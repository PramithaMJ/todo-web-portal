# Multi-stage Dockerfile for React/Vite Application
# Stage 1: Build Stage
FROM node:20-alpine AS builder

# Set build-time arguments (these become available during build)
ARG VITE_API_URL=http://localhost:8080
ARG VITE_API_BASE_URL=http://localhost:8080/api
ARG VITE_API_TIMEOUT=30000
ARG VITE_APP_ENV=production

# Set environment variables from build args
# NOTE: NODE_ENV is NOT set to production here because we need devDependencies for the build
ENV VITE_API_URL=$VITE_API_URL \
    VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_API_TIMEOUT=$VITE_API_TIMEOUT \
    VITE_APP_ENV=$VITE_APP_ENV

# Set working directory
WORKDIR /build

# Copy package files
COPY package.json package-lock.json* ./

# Install ALL dependencies (including devDependencies needed for build)
RUN npm ci --loglevel verbose || \
    npm ci --loglevel verbose || \
    npm ci

# Debug: Check if TypeScript was installed
RUN echo "=== Checking TypeScript installation ===" && \
    ls -la node_modules/.bin/ | grep -E 'tsc|vite' && \
    npm list typescript vite && \
    which tsc || echo "tsc not in PATH"

# Copy source files
COPY . .

# Build application for production
RUN npm run build && \
    # Verify build output
    ls -lh dist/

# Stage 2: Production Stage with Nginx
FROM nginx:1.25-alpine

# Add metadata labels
LABEL maintainer="lpramithamj@gmail.com"
LABEL version="1.0.0"
LABEL description="Todo Frontend Application - React + Vite + Nginx"
LABEL org.opencontainers.image.source="https://github.com/PramithaMJ/todo-web-portal"

# Install additional utilities for healthcheck
RUN apk add --no-cache \
    wget \
    curl \
    && rm -rf /var/cache/apk/*

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /build/dist /usr/share/nginx/html

# Create necessary directories and set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid && \
    # Set proper permissions
    chmod -R 755 /usr/share/nginx/html

# Switch to non-root user
USER nginx

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
