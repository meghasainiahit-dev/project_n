#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "Created .env from .env.example. Add your MySQL and SMTP settings, then run this script again."
  exit 1
fi

if [[ ! -d .venv ]]; then
  python3 -m venv .venv 2>/dev/null || python -m venv .venv
fi
if [[ -f .venv/Scripts/activate ]]; then
  source .venv/Scripts/activate
else
  source .venv/bin/activate
fi

python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python init_db.py
PORT_VALUE=$(printenv PORT || printf '8000')
exec uvicorn app.main:app --host 0.0.0.0 --port "$PORT_VALUE"