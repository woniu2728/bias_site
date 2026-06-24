FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    postgresql-client \
    gcc \
    python3-dev \
    gosu \
    && rm -rf /var/lib/apt/lists/* \
    && gosu --version

# Install bias-core from PyPI
RUN pip install --no-cache-dir bias-core>=0.1,<0.2 \
    && rm -rf ~/.cache/pip

# Copy project source
COPY pyproject.toml .
COPY config/ config/
COPY manage.py .
COPY --chown=1000:1000 . /app

RUN pip install --no-cache-dir -e . && rm -rf ~/.cache/pip

# Entrypoint
COPY docker/entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

RUN mkdir -p media static instance /var/log/bias \
    && useradd -m -u 1000 -s /bin/bash bias \
    && chown -R 1000:1000 /var/log/bias /app

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
EXPOSE 8000
CMD ["gunicorn", "config.asgi:application", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000", "--workers", "2"]
