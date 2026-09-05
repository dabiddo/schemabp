FROM node:24.13.1-bookworm-slim

# Install system dependencies & global pnpm
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    wget \
    tar \
    gzip \
    git \
    ca-certificates \
    openssh-client \
    sudo \
    && npm install -g pnpm \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Fix permissions for app directory, node home, and Zed remote server directories
RUN mkdir -p /app /home/node/.local /home/node/.zed-server /tmp \
    && chown -R node:node /app /home/node /tmp

USER node
WORKDIR /app

ENV HOST=0.0.0.0
ENV PORT=3001
EXPOSE 3001
