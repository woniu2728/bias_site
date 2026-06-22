#!/bin/bash
set -e

# ============================================================
# bias-site entrypoint — fix writable directory permissions, then
# drop privileges to the bias user and run the CMD.
# ============================================================

chown -R 1000:1000 /app/instance /app/media /app/staticfiles 2>/dev/null || true

exec gosu bias "$@"
