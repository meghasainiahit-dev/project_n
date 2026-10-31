from pathlib import Path
from urllib.parse import unquote, urlparse
import os
import pymysql
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")
def connection():
    value = os.getenv("DATABASE_URL", "")
    parsed = urlparse(value)
    if parsed.scheme not in ("mysql", "mysql+pymysql") or not parsed.hostname or not parsed.path.strip("/"):
        raise RuntimeError("Set a valid MySQL DATABASE_URL in .env.")
    return pymysql.connect(
        host=parsed.hostname,
        port=parsed.port or 3306,
        user=unquote(parsed.username or ""),
        password=unquote(parsed.password or ""),
        database=unquote(parsed.path.lstrip("/").split("?")[0]),
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True,
    )

def init_db():
    with connection() as db, db.cursor() as cur:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
              id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
              name VARCHAR(255) NOT NULL DEFAULT '',
              email VARCHAR(320) NOT NULL UNIQUE,
              provider VARCHAR(32) NOT NULL DEFAULT 'email',
              provider_subject VARCHAR(255) NOT NULL DEFAULT '',
              password_hash VARCHAR(255) NULL,
              created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS email_challenges (
              email VARCHAR(320) NOT NULL PRIMARY KEY,
              code_hash CHAR(64) NOT NULL,
              expires_at DATETIME NOT NULL,
              attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
              name VARCHAR(255) NOT NULL DEFAULT '',
              provider VARCHAR(32) NOT NULL DEFAULT 'email',
              provider_subject VARCHAR(255) NOT NULL DEFAULT '',
              password_hash VARCHAR(255) NULL,
              created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
        """)
        
        for table, column, definition in (
            ("users", "password_hash", "VARCHAR(255) NULL"),
            ("email_challenges", "password_hash", "VARCHAR(255) NULL"),
        ):
            cur.execute(f"SHOW COLUMNS FROM `{table}` LIKE %s", (column,))
            if not cur.fetchone():
                cur.execute(f"ALTER TABLE `{table}` ADD COLUMN `{column}` {definition}")
        cur.execute("ALTER TABLE users MODIFY provider VARCHAR(32) NOT NULL DEFAULT 'email'")
        cur.execute("ALTER TABLE users MODIFY provider_subject VARCHAR(255) NOT NULL DEFAULT ''")
        cur.execute("ALTER TABLE email_challenges MODIFY provider VARCHAR(32) NOT NULL DEFAULT 'email'")
        cur.execute("ALTER TABLE email_challenges MODIFY provider_subject VARCHAR(255) NOT NULL DEFAULT ''")
        cur.execute("""
            CREATE TABLE IF NOT EXISTS learning_profiles (
              user_id BIGINT UNSIGNED NOT NULL PRIMARY KEY,
              language VARCHAR(80) NOT NULL DEFAULT 'English',
              level VARCHAR(24) NOT NULL DEFAULT 'Basic',
              goal VARCHAR(80) NOT NULL DEFAULT 'Everyday conversation',
              practice_mode VARCHAR(24) NOT NULL DEFAULT 'guided',
              created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              CONSTRAINT fk_learning_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS lesson_progress (
              user_id BIGINT UNSIGNED NOT NULL,
              lesson_id VARCHAR(120) NOT NULL,
              score TINYINT UNSIGNED NULL DEFAULT NULL,
              completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
              PRIMARY KEY (user_id, lesson_id),
              CONSTRAINT fk_lesson_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS aptitude_progress (
              user_id BIGINT UNSIGNED NOT NULL,
              topic_id VARCHAR(100) NOT NULL,
              level VARCHAR(24) NOT NULL,
              score TINYINT UNSIGNED NOT NULL DEFAULT 0,
              total_questions TINYINT UNSIGNED NOT NULL DEFAULT 1,
              completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
              PRIMARY KEY (user_id, topic_id, level),
              CONSTRAINT fk_aptitude_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS voice_practice_sessions (
              id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
              user_id BIGINT UNSIGNED NOT NULL,
              practice_mode VARCHAR(24) NOT NULL,
              goal VARCHAR(80) NOT NULL,
              language VARCHAR(80) NOT NULL,
              planned_minutes TINYINT UNSIGNED NOT NULL,
              elapsed_seconds SMALLINT UNSIGNED NOT NULL DEFAULT 0,
              prompt_count TINYINT UNSIGNED NOT NULL DEFAULT 0,
              status VARCHAR(16) NOT NULL DEFAULT 'in_progress',
              started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
              ended_at TIMESTAMP NULL DEFAULT NULL,
              INDEX idx_voice_sessions_user_started (user_id, started_at),
              CONSTRAINT fk_voice_session_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
        """)

