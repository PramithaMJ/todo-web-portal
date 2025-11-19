# Local Deployment Guide
## Prerequisites

The evaluator only needs:
- ✅ **Docker** (with Docker Compose)
- ✅ **Linux environment** with Bash
- ✅ **Git** (to clone the repository)

> **Note**: All builds (Java backend, TypeScript frontend) happen inside Docker containers. No need to install Java, Node.js, Maven, or npm locally.

---

## Quick Start (5 Minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/PramithaMJ/todo-web-portal.git
cd todo-web-portal
```

### 2. Start the Application

```bash
docker-compose up --build
```

This single command will:
- ✅ Build the Java Spring Boot backend inside Docker
- ✅ Build the React TypeScript frontend inside Docker
- ✅ Start PostgreSQL database
- ✅ Run database migrations
- ✅ Start all services

### 3. Access the Application

Open your browser:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Docs**: http://localhost:8080/swagger-ui.html


## Detailed Build Process

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Compose                        │
├──────────────┬──────────────────┬──────────────────────┤
│  PostgreSQL  │  Backend (Java)  │  Frontend (React)    │
│   (Port      │   (Port 8080)    │   (Port 3000)        │
│   5432)      │                  │                       │
└──────────────┴──────────────────┴──────────────────────┘
```

### Build Stages

#### 1. Database Container
```yaml
postgres:15-alpine
- Initializes with schema
- Creates 'task' table
- Sets up user authentication
```

#### 2. Backend Container (Multi-stage Build)
```dockerfile
Stage 1: Maven Build (in Docker)
- Uses maven:3.9-eclipse-temurin-17
- Compiles Java source code
- Runs unit tests
- Packages as JAR file

Stage 2: Runtime
- Uses eclipse-temurin:17-jre-alpine
- Copies built JAR
- Exposes port 8080
- Runs Spring Boot application
```

#### 3. Frontend Container (Multi-stage Build)
```dockerfile
Stage 1: Node.js Build (in Docker)
- Uses node:20-alpine
- Installs dependencies
- Compiles TypeScript
- Builds production bundle with Vite

Stage 2: Nginx Runtime
- Uses nginx:alpine
- Serves static files
- Exposes port 3000
- Configured for SPA routing
```

---

## Docker Compose Commands

### Start All Services
```bash
docker-compose up -d
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Stop Services
```bash
docker-compose down
```

### Rebuild After Code Changes
```bash
docker-compose up --build
```

### Clean Everything (including volumes)
```bash
docker-compose down -v
docker system prune -a
```

---

## Verification Steps

### 1. Check Container Status
```bash
docker-compose ps
```

Expected output:
```
NAME                          STATUS    PORTS
todo-web-portal-backend-1     Up        0.0.0.0:8080->8080/tcp
todo-web-portal-frontend-1    Up        0.0.0.0:3000->3000/tcp
todo-web-portal-postgres-1    Up        5432/tcp
```

### 2. Test Backend API
```bash
# Health check
curl http://localhost:8080/actuator/health

# Get tasks (requires authentication)
curl -X GET http://localhost:8080/api/v1/tasks \
  -H "Authorization: Bearer <token>"
```

### 3. Test Frontend
```bash
# Check if frontend is serving
curl http://localhost:3000

# Should return HTML content
```

### 4. Test Database Connection
```bash
docker-compose exec postgres psql -U todouser -d tododb -c "\dt"
```

Expected tables:
- `task`
- `users`
- `flyway_schema_history`

---

## Production Deployment

### Build for Production
```bash
# Build all images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Configuration

Create `.env` file:
```env
# Database
POSTGRES_DB=tododb
POSTGRES_USER=todouser
POSTGRES_PASSWORD=secure_password_here

# Backend
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=your-256-bit-secret-key-here
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-secret
GITHUB_CLIENT_ID=your-github-oauth-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-secret

# Frontend
VITE_API_URL=http://localhost:8080
```

## API Testing with Docker

### Using Docker Container
```bash
# Run curl from within Docker network
docker-compose exec backend curl http://localhost:8080/actuator/health

# Run integration tests
docker-compose run --rm backend mvn verify
```

### Using Postman/Thunder Client
Import the API collection:
- **File**: `docs/api-collection.json`
- **Base URL**: `http://localhost:8080`

---

## Continuous Integration Setup

### GitHub Actions (CI/CD)
```yaml
name: CI/CD Pipeline

on: [push, pull_request]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Build with Docker Compose
        run: docker-compose build
        
      - name: Run tests
        run: |
          docker-compose run --rm backend mvn test
          docker-compose run --rm frontend npm test
```

---

## Security Notes for Evaluators

### Default Credentials (Development Only)
```
Database:
- User: todouser
- Password: todopass
- Database: tododb

```

⚠️ **These are for evaluation purposes only. Change for production!**

### OAuth (Optional)
For full OAuth functionality, set environment variables:
```bash
export GOOGLE_CLIENT_ID="your-client-id"
export GOOGLE_CLIENT_SECRET="your-secret"
export GITHUB_CLIENT_ID="your-client-id"
export GITHUB_CLIENT_SECRET="your-secret"
```

---

## Quick Commands Cheat Sheet

```bash
# Start everything
docker-compose up -d

# View logs (follow mode)
docker-compose logs -f

# Stop everything
docker-compose down

# Rebuild and restart
docker-compose up --build -d

# Run backend tests
docker-compose run --rm backend mvn test

# Run frontend tests
docker-compose run --rm frontend npm test

# Access database CLI
docker-compose exec postgres psql -U todouser -d tododb

# Clean everything
docker-compose down -v && docker system prune -a -f
```

---
