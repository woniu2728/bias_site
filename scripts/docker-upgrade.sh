#!/bin/bash
# bias-site docker upgrade script
set -e

echo "=== Bias Site Docker Upgrade ==="

if ! docker compose ps &> /dev/null; then
    echo "Bias is not running. Use docker-install.sh to install."
    exit 1
fi

# Pull latest images and rebuild
mkdir -p wheels
rm -f wheels/*.whl
python -m build --wheel --no-isolation ../bias_core -o wheels
for extension_dir in ../bias-ext-*; do
    [ -d "$extension_dir" ] || continue
    python -m build --wheel --no-isolation "$extension_dir" -o wheels
done
docker compose pull
docker compose up -d --build
docker compose exec -T web python manage.py upgrade_forum --skip-migrate --skip-collectstatic
docker compose exec -T web python manage.py doctor

echo ""
echo "=== Upgrade Complete ==="
echo "Run 'docker compose logs -f web' to verify startup."
