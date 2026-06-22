#!/bin/bash
# bias-site docker upgrade script
set -e

echo "=== Bias Site Docker Upgrade ==="

if ! docker compose ps &> /dev/null; then
    echo "Bias is not running. Use docker-install.sh to install."
    exit 1
fi

# Pull latest images and rebuild
docker compose pull
docker compose up -d --build

echo ""
echo "=== Upgrade Complete ==="
echo "Run 'docker compose logs -f web' to verify startup."
