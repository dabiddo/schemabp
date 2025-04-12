FROM node:20.12.2-bookworm-slim 

# Install necessary packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    wget \
    tar \
    gzip \
    git \
    ca-certificates \
    openssh-client \  
    && npm install -g pnpm \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create necessary directories and set permissions
RUN mkdir -p /app \
    && chown -R node:node /app

# Switch to non-root user
USER node

# Set working directory
WORKDIR /app

# Set host environment variable
ENV HOST=0.0.0.0