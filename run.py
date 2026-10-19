from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
ENV_FILE = ROOT / ".env"
EXAMPLE_ENV = ROOT / ".env.example"
VENV_DIR = ROOT / ".venv"


def read_env():
    values = {}
    if not ENV_FILE.exists():
        return values

    for raw_line in ENV_FILE.read_text(encoding="utf-8-sig").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        values[key.strip()] = value.strip().strip('"').strip("'")

    return values


def stop(message, code=1):
    print("\n" + message)
    raise SystemExit(code)


def ensure_configuration():
    if not ENV_FILE.exists():
        if EXAMPLE_ENV.exists():
            ENV_FILE.write_text(
                EXAMPLE_ENV.read_text(encoding="utf-8-sig"),
                encoding="utf-8",
            )
        stop("Created .env. Fill APP_SECRET_KEY and DATABASE_URL, then run python run.py again.")

    values = read_env()

    secret = values.get("APP_SECRET_KEY", "")
    if not secret or "replace-with" in secret.lower() or secret == "change-this-in-env":
        stop("Set a private APP_SECRET_KEY in .env before starting.")

    url = values.get("DATABASE_URL", "")
    parsed = urlparse(url)

    if parsed.scheme not in ("mysql", "mysql+pymysql") or not parsed.hostname or not parsed.path.strip("/"):
        stop(
            "Set DATABASE_URL in .env. Example: "
            "mysql+pymysql://authportal_app:password@localhost:3306/meghas?charset=utf8mb4"
        )

    if (parsed.username or "") in ("", "username") or (parsed.password or "") in ("", "password"):
        stop("Replace the database username and password in .env with the MySQL app user credentials.")

    if parsed.path.strip("/").split("/")[0] in ("northstar", "database", "your_database"):
        stop("Set the database name in DATABASE_URL to the schema you created, for example meghas.")


def run(command, label):
    print("\n" + label)
    subprocess.run(command, cwd=ROOT, check=True)



def main():
    if sys.version_info < (3, 11):
        stop("Python 3.11 or newer is required. Install it, then run python run.py again.")

    ensure_configuration()

    if not VENV_DIR.exists():
        print("Creating the project virtual environment...")
        run(
            [sys.executable, "-m", "venv", str(VENV_DIR)],
            "Preparing Python",
        )

    if os.name == "nt":
        venv_python = VENV_DIR / "Scripts" / "python.exe"
    else:
        venv_python = VENV_DIR / "bin" / "python"


    run(
        [str(venv_python), str(ROOT / "init_db.py")],
        "Connecting to MySQL and preparing tables",
    )

    values = read_env()
    port = values.get("PORT") or os.getenv("PORT", "8000")

    run(
        [
            str(venv_python),
            "-m",
            "uvicorn",
            "app.main:app",
            "--reload",
            "--host",
            "127.0.0.1",
            "--port",
            port,
        ],
        "Starting FastAPI at http://localhost:" + port,
    )



if __name__ == "__main__":
    try:
        main()
    except subprocess.CalledProcessError as exc:
        stop(
            "A setup command failed with exit code "
            + str(exc.returncode)
            + ". Fix the message above, then run python run.py again.",
            exc.returncode or 1,
        )
    except OSError as exc:
        stop(f"Could not start the app process: {exc}")
