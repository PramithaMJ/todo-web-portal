# Multi-stage Dockerfile for Spring Boot Application
# Stage 1: Build Stage
FROM maven:3.9-amazoncorretto-17 AS builder

# Set build arguments
ARG SPRING_PROFILE=prod

# Set working directory
WORKDIR /build

# Copy Maven wrapper and pom.xml first (for better layer caching)
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Make mvnw executable
RUN chmod +x mvnw

# Download dependencies (cached if pom.xml hasn't changed)
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src ./src

# Build application (skip tests for faster builds)
# Tests should be run in CI/CD pipeline
RUN ./mvnw clean package -DskipTests -B && \
    # Verify the JAR was created
    ls -lh target/*.jar

# Stage 2: Runtime Stage
FROM amazoncorretto:17-alpine

# Add metadata labels
LABEL maintainer="lpramithamj@gmail.com"
LABEL version="1.0.0"
LABEL description="Todo Backend Application - Spring Boot"
LABEL org.opencontainers.image.source="https://github.com/PramithaMJ/todo-web-portal"

# Install additional utilities
RUN apk add --no-cache \
    wget \
    curl \
    bash \
    && rm -rf /var/cache/apk/*

# Create non-root user and group for security
RUN addgroup -S -g 1001 spring && \
    adduser -S -u 1001 -G spring spring

# Set working directory
WORKDIR /app

# Create logs directory
RUN mkdir -p /app/logs && \
    chown -R spring:spring /app

# Copy built artifact from builder stage
COPY --from=builder --chown=spring:spring /build/target/*.jar app.jar

# Switch to non-root user
USER spring:spring

# Expose application port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Environment variables for JVM tuning
ENV JAVA_OPTS="-XX:+UseContainerSupport \
    -XX:MaxRAMPercentage=75.0 \
    -XX:InitialRAMPercentage=50.0 \
    -XX:+UseG1GC \
    -XX:+UseStringDeduplication \
    -XX:+OptimizeStringConcat \
    -Djava.security.egd=file:/dev/./urandom \
    -Dfile.encoding=UTF-8"

# Run application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
