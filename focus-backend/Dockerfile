# Explicitly use native architecture for better performance
FROM --platform=$BUILDPLATFORM python:3.11-slim

WORKDIR /app

# Install uv (faster package management)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Copy dependency files first for better layer caching
COPY pyproject.toml uv.lock ./

# Optimize uv for performance and use cache mount
ENV UV_CACHE_DIR=/tmp/uv-cache
RUN --mount=type=cache,target=/tmp/uv-cache \
    uv sync --frozen

COPY . .

# Run the application
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"] 