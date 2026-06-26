#!/bin/bash
# bias-site docker install script
set -e

echo "=== Bias Site Docker Installation ==="

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed."
    exit 1
fi

# Check docker-compose
if ! docker compose version &> /dev/null; then
    echo "Error: docker compose plugin is not available."
    exit 1
fi

# Create instance directory
mkdir -p instance
mkdir -p wheels

# Copy .env if not exists
if [ ! -f .env ]; then
    cp .env.example .env 2>/dev/null || true
    echo "Created .env from .env.example"
fi

# Build and start
rm -f wheels/*.whl
python -m build --wheel --no-isolation ../bias_core -o wheels
for extension_dir in ../bias-ext-*; do
    [ -d "$extension_dir" ] || continue
    python -m build --wheel --no-isolation "$extension_dir" -o wheels
done
docker compose up -d --build
docker compose exec -T web python manage.py install_forum --skip-migrate --skip-collectstatic
docker compose exec -T web python manage.py doctor

echo ""
echo "=== Installation Complete ==="
echo "Site will be available at http://localhost:8080 after startup."
echo "Run 'docker compose logs -f web' to follow startup."
