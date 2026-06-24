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

# Install Python dependencies（先装本地 bias-core 和扩展，再装 site）
COPY pyproject.toml .
COPY bias_core/ /tmp/bias_core/
COPY bias_ext_users/ /tmp/bias_ext_users/ 2>/dev/null || true
RUN pip install --no-cache-dir -e /tmp/bias_core \
    && if [ -d /tmp/bias_ext_users ]; then pip install --no-cache-dir -e /tmp/bias_ext_users; fi \
    && pip install --no-cache-dir -e . \
    && rm -rf ~/.cache/pip /tmp/*

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
