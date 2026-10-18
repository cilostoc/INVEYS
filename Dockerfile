# ==============================================================================
# INVEYS Production Container Image
# Multi-stage optimized, lightweight, and secured with non-root user execution.
# Includes: Python 3.11, Tesseract OCR, Poppler (PDF), FFmpeg (Audio), and CCXT.
# ==============================================================================

FROM python:3.11-slim-bookworm

# Metadata
LABEL maintainer="INVEYS Core Team"
LABEL description="INVEYS — Local-First Financial Operating System"

# Environment configuration
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    DEBIAN_FRONTEND=noninteractive \
    HOST=0.0.0.0 \
    PORT=3000 \
    INVEYS_DATA_DIR=/data

# Install operating system dependencies for OCR, PDF parsing, voice audio transcoding, and curl
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-eng \
    poppler-utils \
    ffmpeg \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code and assets
COPY src/ ./src/
COPY server/ ./server/
COPY scripts/ ./scripts/
COPY serve.py build.py package.json README.md CHANGELOG.md ./

# Pre-compile the standalone HTML application bundle (inveys-app.html) during build
RUN python3 build.py

# Create dedicated non-root user and persistent storage vault directory
RUN groupadd -g 1000 inveys && \
    useradd -u 1000 -g inveys -m -s /bin/bash inveys && \
    mkdir -p /data && \
    chown -R inveys:inveys /app /data && \
    chmod 700 /data

# Expose HTTP port
EXPOSE 3000

# Declare persistent volume for SQLite Vault (~/.inveys/)
VOLUME ["/data"]

# Switch to non-root user for maximum container security
USER inveys

# Health check to ensure API daemon is operational
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://127.0.0.1:3000/api/auth/status || exit 1

# Default execution command
CMD ["python3", "serve.py"]
