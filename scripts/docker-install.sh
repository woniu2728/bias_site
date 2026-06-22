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

# Copy .env if not exists
if [ ! -f .env ]; then
    cp .env.example .env 2>/dev/null || true
    echo "Created .env from .env.example"
fi

# Build and start
docker compose up -d --build

echo ""
echo "=== Installation Complete ==="
echo "Site will be available at http://localhost:8080 after startup."
echo "Run 'docker compose logs -f web' to follow startup."
