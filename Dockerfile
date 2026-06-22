FROM python:3.12-slim

WORKDIR /app

# Install system dependencies（含 gosu，用于 entrypoint 降权）
RUN apt-get update && apt-get install -y \
    postgresql-client \
    gcc \
    python3-dev \
    gosu \
    && rm -rf /var/lib/apt/lists/* \
    && gosu --version

# Install Python dependencies（先装 bias-core，再装 site）
COPY pyproject.toml .
RUN pip install --no-cache-dir bias-core>=0.1,<0.2 \
    && pip install --no-cache-dir -e . \
    && rm -rf ~/.cache/pip

# Copy project source
COPY . .

# Create runtime directories
RUN mkdir -p media static instance /var/log/bias \
    && chown -R 1000:1000 /var/log/bias

# 创建非 root 用户运行应用
RUN useradd -m -u 1000 -s /bin/bash bias \
    && chown -R bias:bias /app

# 入口脚本
COPY docker/entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

EXPOSE 8000

CMD ["gunicorn", "config.asgi:application", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000", "--workers", "2"]
