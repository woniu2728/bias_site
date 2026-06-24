#!/bin/bash
set -e

# ============================================================
# bias-site entrypoint — run migrations, collect static, then
# drop privileges to the bias user and run the CMD.
# ============================================================

chown -R 1000:1000 /app/instance /app/media /app/staticfiles 2>/dev/null || true

# Run database migrations and collect static files as root
cd /app
gosu bias python manage.py migrate --noinput 2>/dev/null || true
gosu bias python manage.py collectstatic --noinput 2>/dev/null || true

exec gosu bias "$@"
