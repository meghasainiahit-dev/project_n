import asyncio
import hashlib
import hmac
import json
import logging
import os
import secrets
import smtplib
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage

from dotenv import load_dotenv
from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware

from app.db import BASE_DIR, connection

load_dotenv(BASE_DIR / ".env")
SECRET_KEY = os.getenv("APP_SECRET_KEY", "change-this-in-env")
app = FastAPI(title="Northstar")
app.add_middleware(
    SessionMiddleware,
    secret_key=SECRET_KEY,
    session_cookie="northstar_session",
    same_site=os.getenv("SESSION_SAME_SITE", "lax"),
    https_only=os.getenv("COOKIE_SECURE", "0") == "1",
    max_age=60 * 60 * 24 * 7,
)
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")
templates = Jinja2Templates(directory=BASE_DIR / "templates")


def csrf_token(request: Request):
    token = request.session.get("csrf_token")
    if not token:
        token = secrets.token_urlsafe(32)
        request.session["csrf_token"] = token
    return token


def valid_csrf(request: Request, value: str):
    saved = request.session.get("csrf_token", "")
    return bool(saved and value and hmac.compare_digest(saved, value))


def add_message(request: Request, message: str, category: str = "error"):
    request.session["messages"] = [{"text": message, "category": category}]


def pop_messages(request: Request):
    return request.session.pop("messages", [])


def password_hash(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 600_000)
    return f"pbkdf2_sha256$600000${salt.hex()}${digest.hex()}"


def password_matches(password: str, encoded: str) -> bool:
    try:
        algorithm, rounds, salt_hex, digest_hex = encoded.split("$", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), bytes.fromhex(salt_hex), int(rounds))
        return hmac.compare_digest(digest.hex(), digest_hex)
    except (ValueError, TypeError):
        return False


def code_hash(email: str, code: str):
    payload = email.lower() + ":" + code
    return hmac.new(SECRET_KEY.encode(), payload.encode(), hashlib.sha256).hexdigest()


def send_code(email: str, code: str):
    host = os.getenv("EMAIL_HOST", "")
    username = os.getenv("EMAIL_HOST_USER", "")
    password = os.getenv("EMAIL_HOST_PASSWORD", "")
    sender = os.getenv("DEFAULT_FROM_EMAIL", username)
    if not (host and username and password and sender):
        raise RuntimeError("Configure EMAIL_HOST, EMAIL_HOST_USER, EMAIL_HOST_PASSWORD, and DEFAULT_FROM_EMAIL in .env.")
    msg = EmailMessage()
    msg["Subject"] = "Your Northstar verification code"
    msg["From"] = sender
    msg["To"] = email
    msg.set_content(f"Your Northstar verification code is {code}. It expires in 10 minutes. If you did not request it, ignore this email.")
    port = int(os.getenv("EMAIL_PORT", "587"))
    if os.getenv("EMAIL_USE_SSL", "0") == "1":
        with smtplib.SMTP_SSL(host, port, timeout=20) as server:
            server.login(username, password)
            server.send_message(msg)
    else:
        with smtplib.SMTP(host, port, timeout=20) as server:
            if os.getenv("EMAIL_USE_TLS", "1") == "1":
                server.starttls()
            server.login(username, password)
            server.send_message(msg)


def template(request: Request, template_name: str, **context):
    return templates.TemplateResponse(request=request, name=template_name, context={
        "csrf": csrf_token(request),
        "messages": pop_messages(request),
        **context,
    })


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    if request.session.get("user_id") and request.session.get("email_verified"):
        return RedirectResponse("/dashboard", status_code=303)
    return template(request, "authflow/index.html")


@app.post("/email/start")
async def email_start(
    request: Request,
    email: str = Form(...),
    password: str = Form(...),
    name: str = Form(""),
    mode: str = Form("login"),
    csrf: str = Form(...),
):
    email = email.strip().lower()
    name = name.strip()
    mode = mode.lower()
    if not valid_csrf(request, csrf):
        add_message(request, "Your form expired. Refresh the page and try again.")
        return RedirectResponse("/", status_code=303)
    if mode not in {"login", "signup"} or "@" not in email:
        add_message(request, "Enter a valid email address.")
        return RedirectResponse("/", status_code=303)
    if len(password) < 8:
        add_message(request, "Use an app password with at least 8 characters.")
        return RedirectResponse("/", status_code=303)
    if mode == "signup" and not name:
        add_message(request, "Enter your name to create an account.")
        return RedirectResponse("/", status_code=303)

    try:
        with connection() as db, db.cursor() as cur:
            cur.execute("SELECT id, name, email, password_hash FROM users WHERE email=%s", (email,))
            user = cur.fetchone()

            if user and user["password_hash"]:
                if mode == "signup":
                    add_message(request, "An account already exists for this email. Choose Log in.")
                    return RedirectResponse("/", status_code=303)
                if not password_matches(password, user["password_hash"]):
                    add_message(request, "Email or password is incorrect.")
                    return RedirectResponse("/", status_code=303)
                # A correct app password authenticates existing users; OTP is for account creation.
                request.session.clear()
                request.session.update({"user_id": user["id"], "user_name": user["name"], "user_email": user["email"], "email_verified": True})
                csrf_token(request)
                return RedirectResponse("/dashboard", status_code=303)
            elif user and mode == "signup":
                add_message(request, "An account already exists for this email. Choose Log in.")
                return RedirectResponse("/", status_code=303)
            elif not user and mode == "login":
                add_message(request, "No account found for this email. Choose Create account.")
                return RedirectResponse("/", status_code=303)
            elif user:
                # Older provider-created accounts can set an app password after proving mailbox access.
                name = user["name"] or name

            code = f"{secrets.randbelow(1_000_000):06d}"
            expires = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(minutes=10)
            cur.execute(
                """INSERT INTO email_challenges
                   (email,code_hash,expires_at,attempts,name,provider,provider_subject,password_hash)
                   VALUES (%s,%s,%s,0,%s,'email',%s,%s)
                   ON DUPLICATE KEY UPDATE code_hash=VALUES(code_hash), expires_at=VALUES(expires_at),
                   attempts=0, name=VALUES(name), provider='email', provider_subject=VALUES(provider_subject),
                   password_hash=VALUES(password_hash), created_at=CURRENT_TIMESTAMP""",
                (email, code_hash(email, code), expires, name, email, password_hash(password)),
            )
        send_code(email, code)
        request.session.clear()
        request.session["pending_email"] = email
        request.session["csrf_token"] = secrets.token_urlsafe(32)
        add_message(request, "A verification code was sent to " + email + ".", "success")
        return RedirectResponse("/verify-email", status_code=303)
    except Exception as exc:
        logging.exception("Email sign-in start failed")
        message = str(exc) if isinstance(exc, RuntimeError) else "We could not send the verification email. Check the email settings and try again."
        add_message(request, message)
        return RedirectResponse("/", status_code=303)


@app.get("/verify-email", response_class=HTMLResponse)
async def verify_page(request: Request):
    if not request.session.get("pending_email"):
        return RedirectResponse("/", status_code=303)
    return template(request, "authflow/verify.html", email=request.session["pending_email"])


@app.post("/verify-email")
async def verify_code(request: Request, code: str = Form(...), csrf: str = Form(...)):
    email = request.session.get("pending_email")
    if not email:
        return RedirectResponse("/", status_code=303)
    if not valid_csrf(request, csrf):
        add_message(request, "Your form expired. Please try again.")
        return RedirectResponse("/verify-email", status_code=303)
    digits = "".join(char for char in code if char.isdigit())
    with connection() as db, db.cursor() as cur:
        cur.execute("SELECT * FROM email_challenges WHERE email=%s", (email,))
        challenge = cur.fetchone()
        if not challenge:
            add_message(request, "No active code was found. Start again.")
        elif challenge["attempts"] >= 5:
            add_message(request, "Too many attempts. Start again.")
        elif datetime.now(timezone.utc).replace(tzinfo=None) > challenge["expires_at"]:
            add_message(request, "That code expired. Start again.")
        elif not hmac.compare_digest(challenge["code_hash"], code_hash(email, digits)):
            cur.execute("UPDATE email_challenges SET attempts=attempts+1 WHERE email=%s", (email,))
            add_message(request, "That code did not match. Please try again.")
        else:
            cur.execute(
                """INSERT INTO users (name,email,provider,provider_subject,password_hash)
                   VALUES (%s,%s,'email',%s,%s)
                   ON DUPLICATE KEY UPDATE name=VALUES(name), provider='email', provider_subject=VALUES(provider_subject),
                   password_hash=VALUES(password_hash), updated_at=CURRENT_TIMESTAMP""",
                (challenge["name"], email, email, challenge["password_hash"]),
            )
            cur.execute("SELECT id,name,email FROM users WHERE email=%s", (email,))
            user = cur.fetchone()
            cur.execute("DELETE FROM email_challenges WHERE email=%s", (email,))
            request.session.clear()
            request.session.update({"user_id": user["id"], "user_name": user["name"], "user_email": user["email"], "email_verified": True})
            return RedirectResponse("/dashboard", status_code=303)
    return RedirectResponse("/verify-email", status_code=303)


@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard(request: Request):
    if not (request.session.get("user_id") and request.session.get("email_verified")):
        return RedirectResponse("/", status_code=303)
    user_id = request.session["user_id"]
    with connection() as db, db.cursor() as cur:
        cur.execute("SELECT language, level, goal, practice_mode FROM learning_profiles WHERE user_id=%s", (user_id,))
        profile = cur.fetchone() or {"language": "English", "level": "Basic", "goal": "Everyday conversation", "practice_mode": "guided"}
        cur.execute("SELECT COUNT(*) AS count, AVG(score) AS average FROM lesson_progress WHERE user_id=%s", (user_id,))
        progress = cur.fetchone()
    return template(request, "authflow/dashboard.html", name=request.session.get("user_name"), email=request.session.get("user_email"), profile=profile, progress=progress)


@app.get("/api/learning/profile")
async def get_learning_profile(request: Request):
    if not request.session.get("email_verified"):
        return JSONResponse({"detail": "Not authenticated"}, status_code=401)
    with connection() as db, db.cursor() as cur:
        cur.execute("SELECT language, level, goal, practice_mode FROM learning_profiles WHERE user_id=%s", (request.session["user_id"],))
        profile = cur.fetchone()
    return profile or {"language": "English", "level": "Basic", "goal": "Everyday conversation", "practice_mode": "guided"}


@app.post("/api/learning/transliterate")
async def transliterate_bengali(request: Request):
    if not request.session.get("email_verified"):
        return JSONResponse({"detail": "Not authenticated"}, status_code=401)
    if not valid_csrf(request, request.headers.get("x-csrf-token", "")):
        return JSONResponse({"detail": "Invalid form token"}, status_code=403)
    try:
        payload = await request.json()
        text = payload.get("text", "").strip()
        code = payload.get("language", "")
    except (ValueError, AttributeError):
        return JSONResponse({"detail": "Invalid request"}, status_code=400)
    if not text or len(text.encode("utf-8")) > 500:
        return JSONResponse({"detail": "Text must contain 1–500 bytes"}, status_code=422)
    input_methods = {
        "ar": "ar-t-i0-und", "bn": "bn-t-i0-und", "fa": "fa-t-i0-und", "gu": "gu-t-i0-und",
        "hi": "hi-t-i0-und", "ja": "ja-t-i0-und", "mr": "mr-t-i0-und", "ne": "ne-t-i0-und",
        "pa": "pa-t-i0-und", "ru": "ru-t-i0-und", "ta": "ta-t-i0-und", "te": "te-t-i0-und",
        "ur": "ur-t-i0-und", "zh": "zh-t-i0-pinyin",
    }
    if code not in input_methods:
        return JSONResponse({"detail": "Roman typing is not available for this language yet. Choose on-screen keys or type in its script."}, status_code=422)

    def convert():
        query = urllib.parse.urlencode({"text": text, "itc": input_methods[code], "num": "1"})
        req = urllib.request.Request(
            f"https://inputtools.google.com/request?{query}",
            headers={"User-Agent": "Northstar/1.0", "Accept": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=8) as response:
            data = json.loads(response.read().decode("utf-8"))
        candidate = data[1][0][1][0] if data and data[0] == "SUCCESS" else ""
        if not candidate:
            raise ValueError("No Bengali transliteration returned")
        return {"text": candidate}

    try:
        return await asyncio.to_thread(convert)
    except Exception:
        return JSONResponse({"detail": "Could not convert that spelling. Try another spelling or use on-screen keys."}, status_code=502)


@app.post("/api/learning/profile")
async def save_learning_profile(request: Request):
    if not request.session.get("email_verified"):
        return JSONResponse({"detail": "Not authenticated"}, status_code=401)
    if not valid_csrf(request, request.headers.get("x-csrf-token", "")):
        return JSONResponse({"detail": "Invalid form token"}, status_code=403)
    try:
        payload = await request.json()
    except Exception:
        return JSONResponse({"detail": "Invalid request"}, status_code=400)
    language = str(payload.get("language", "English")).strip()[:80]
    level = str(payload.get("level", "Basic"))
    goal = str(payload.get("goal", "Everyday conversation")).strip()[:80]
    mode = str(payload.get("practice_mode", "guided"))
    if not language or level not in {"Basic", "Intermediate", "Advanced"} or mode not in {"free", "guided", "challenge"} or not goal:
        return JSONResponse({"detail": "Choose a valid language, level, goal, and practice mode."}, status_code=422)
    with connection() as db, db.cursor() as cur:
        cur.execute(
            """INSERT INTO learning_profiles (user_id,language,level,goal,practice_mode)
               VALUES (%s,%s,%s,%s,%s) ON DUPLICATE KEY UPDATE language=VALUES(language), level=VALUES(level),
               goal=VALUES(goal), practice_mode=VALUES(practice_mode), updated_at=CURRENT_TIMESTAMP""",
            (request.session["user_id"], language, level, goal, mode),
        )
    return {"saved": True, "language": language, "level": level, "goal": goal, "practice_mode": mode}


@app.get("/api/learning/voice-sessions/summary")
async def get_voice_practice_summary(request: Request):
    if not request.session.get("email_verified"):
        return JSONResponse({"detail": "Not authenticated"}, status_code=401)
    with connection() as db, db.cursor() as cur:
        cur.execute(
            """SELECT COUNT(*) AS sessions, COALESCE(SUM(FLOOR(elapsed_seconds/60)),0) AS minutes
               FROM voice_practice_sessions WHERE user_id=%s AND status='completed'""",
            (request.session["user_id"],),
        )
        summary = cur.fetchone() or {"sessions": 0, "minutes": 0}
        cur.execute(
            """SELECT goal, language, planned_minutes, elapsed_seconds, prompt_count, ended_at
               FROM voice_practice_sessions WHERE user_id=%s AND status='completed'
               ORDER BY ended_at DESC LIMIT 1""",
            (request.session["user_id"],),
        )
        latest = cur.fetchone()
    return {"sessions": int(summary["sessions"]), "minutes": int(summary["minutes"]), "latest": latest}


@app.post("/api/learning/voice-sessions")
async def start_voice_practice_session(request: Request):
    if not request.session.get("email_verified"):
        return JSONResponse({"detail": "Not authenticated"}, status_code=401)
    if not valid_csrf(request, request.headers.get("x-csrf-token", "")):
        return JSONResponse({"detail": "Invalid form token"}, status_code=403)
    try:
        payload = await request.json()
        mode = str(payload.get("practice_mode", "guided"))
        goal = str(payload.get("goal", "Everyday conversation")).strip()[:80]
        language = str(payload.get("language", "English")).strip()[:80]
        planned = int(payload.get("planned_minutes", 10))
    except (ValueError, TypeError, AttributeError):
        return JSONResponse({"detail": "Invalid voice practice session"}, status_code=400)
    if mode not in {"free", "guided", "challenge"} or planned not in {5, 10, 15} or not goal or not language:
        return JSONResponse({"detail": "Choose a valid practice mode, purpose, language, and duration."}, status_code=422)
    with connection() as db, db.cursor() as cur:
        cur.execute(
            """INSERT INTO voice_practice_sessions (user_id,practice_mode,goal,language,planned_minutes)
               VALUES (%s,%s,%s,%s,%s)""",
            (request.session["user_id"], mode, goal, language, planned),
        )
        session_id = cur.lastrowid
    return {"saved": True, "session_id": session_id}


@app.patch("/api/learning/voice-sessions/{session_id}")
async def finish_voice_practice_session(session_id: int, request: Request):
    if not request.session.get("email_verified"):
        return JSONResponse({"detail": "Not authenticated"}, status_code=401)
    if not valid_csrf(request, request.headers.get("x-csrf-token", "")):
        return JSONResponse({"detail": "Invalid form token"}, status_code=403)
    try:
        payload = await request.json()
        status = str(payload.get("status", "completed"))
        elapsed = max(0, min(3600, int(payload.get("elapsed_seconds", 0))))
        prompts = max(0, min(50, int(payload.get("prompt_count", 0))))
    except (ValueError, TypeError, AttributeError):
        return JSONResponse({"detail": "Invalid voice practice result"}, status_code=422)
    if status not in {"completed", "abandoned"}:
        return JSONResponse({"detail": "Invalid session status"}, status_code=422)
    with connection() as db, db.cursor() as cur:
        cur.execute(
            """UPDATE voice_practice_sessions SET status=%s, elapsed_seconds=%s,
               prompt_count=%s, ended_at=CURRENT_TIMESTAMP
               WHERE id=%s AND user_id=%s AND status='in_progress'""",
            (status, elapsed, prompts, session_id, request.session["user_id"]),
        )
        saved = cur.rowcount == 1
    if not saved:
        return JSONResponse({"detail": "Voice practice session was not found or already ended."}, status_code=404)
    return {"saved": True, "session_id": session_id, "status": status}


@app.get("/api/learning/progress")
async def get_learning_progress(request: Request):
    if not request.session.get("email_verified"):
        return JSONResponse({"detail": "Not authenticated"}, status_code=401)
    with connection() as db, db.cursor() as cur:
        cur.execute("SELECT lesson_id, score, completed_at FROM lesson_progress WHERE user_id=%s ORDER BY completed_at DESC", (request.session["user_id"],))
        rows = cur.fetchall()
    return rows


@app.post("/api/learning/progress/{lesson_id}")
async def complete_learning_lesson(lesson_id: str, request: Request):
    if not request.session.get("email_verified"):
        return JSONResponse({"detail": "Not authenticated"}, status_code=401)
    if not valid_csrf(request, request.headers.get("x-csrf-token", "")):
        return JSONResponse({"detail": "Invalid form token"}, status_code=403)
    try:
        payload = await request.json()
        raw_score = payload.get("score")
        score = None if raw_score is None else max(0, min(100, int(raw_score)))
    except (ValueError, TypeError, AttributeError):
        return JSONResponse({"detail": "Invalid score"}, status_code=422)
    with connection() as db, db.cursor() as cur:
        cur.execute(
            """INSERT INTO lesson_progress (user_id,lesson_id,score) VALUES (%s,%s,%s)
               ON DUPLICATE KEY UPDATE score=COALESCE(VALUES(score),score), completed_at=CURRENT_TIMESTAMP""",
            (request.session["user_id"], lesson_id[:120], score),
        )
    return {"saved": True, "lesson_id": lesson_id, "score": score}


@app.get("/api/aptitude/progress")
async def get_aptitude_progress(request: Request):
    if not request.session.get("email_verified"):
        return JSONResponse({"detail": "Not authenticated"}, status_code=401)
    with connection() as db, db.cursor() as cur:
        cur.execute("SELECT topic_id, level, score, total_questions, completed_at FROM aptitude_progress WHERE user_id=%s", (request.session["user_id"],))
        rows = cur.fetchall()
    return rows


@app.post("/api/aptitude/progress/{topic_id}/{level}")
async def save_aptitude_progress(topic_id: str, level: str, request: Request):
    if not request.session.get("email_verified"):
        return JSONResponse({"detail": "Not authenticated"}, status_code=401)
    if not valid_csrf(request, request.headers.get("x-csrf-token", "")):
        return JSONResponse({"detail": "Invalid form token"}, status_code=403)
    if level not in {"Basic", "Intermediate", "Advanced"} or not topic_id or len(topic_id) > 100:
        return JSONResponse({"detail": "Invalid topic or level"}, status_code=422)
    try:
        payload = await request.json()
        score = max(0, min(100, int(payload.get("score", 0))))
        total = max(1, min(50, int(payload.get("total_questions", 1))))
    except (ValueError, TypeError, AttributeError):
        return JSONResponse({"detail": "Invalid quiz result"}, status_code=422)
    with connection() as db, db.cursor() as cur:
        cur.execute(
            """INSERT INTO aptitude_progress (user_id,topic_id,level,score,total_questions)
               VALUES (%s,%s,%s,%s,%s) ON DUPLICATE KEY UPDATE
               score=GREATEST(score,VALUES(score)), total_questions=VALUES(total_questions), completed_at=CURRENT_TIMESTAMP""",
            (request.session["user_id"], topic_id, level, score, total),
        )
    return {"saved": True, "topic_id": topic_id, "level": level, "score": score, "total_questions": total}


@app.post("/logout")
async def logout(request: Request, csrf: str = Form(...)):
    if not valid_csrf(request, csrf):
        return JSONResponse({"detail": "Invalid form token"}, status_code=403)
    request.session.clear()
    return RedirectResponse("/", status_code=303)


@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.get("/api/me")
async def current_user(request: Request):
    if not request.session.get("email_verified"):
        return JSONResponse({"detail": "Not authenticated"}, status_code=401)
    return {"id": request.session.get("user_id"), "name": request.session.get("user_name"), "email": request.session.get("user_email")}
