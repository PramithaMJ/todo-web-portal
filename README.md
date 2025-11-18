# Todo Application - Full Stack

A production-ready Todo application with Spring Boot backend, React frontend, and PostgreSQL database.

## 🏗️ Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│   Frontend      │─────▶│   Backend       │─────▶│   PostgreSQL    │
│   (React+Vite)  │      │   (Spring Boot) │      │   Database      │
│   Port: 3000    │      │   Port: 8080    │      │   Port: 5432    │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker (20.10+)
- Docker Compose (2.0+)
- Make (optional, for convenience commands)

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd coverageX-todo

# Initialize environment file
make init
# OR manually:
cp .env.example .env
```

### 2. Configure Environment

Edit `.env` file with your configuration:

```bash
# Update OAuth credentials (optional, for OAuth login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Update JWT secret (generate with: openssl rand -base64 64)
JWT_SECRET_KEY=your-secure-secret-key

# Other settings can use defaults
```

### 3. Start the Application

#### Using Make (Recommended)

```bash
# Complete setup (first time)
make setup

# Or step by step
make build  # Build Docker images
make up     # Start services

# Development mode
make dev    # Start with hot-reload

# View logs
make logs
```

#### Using Docker Compose Directly

```bash
# Production mode
docker-compose up -d

# Development mode
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# View logs
docker-compose logs -f
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **Database**: localhost:5432

## 📋 Available Commands

Run `make help` to see all available commands:

```bash
make help           # Show all commands
make build          # Build Docker images
make up             # Start all services (production)
make down           # Stop all services
make restart        # Restart services
make logs           # Show all logs
make logs-backend   # Show backend logs only
make logs-frontend  # Show frontend logs only
make logs-db        # Show database logs only
make dev            # Start in development mode
make clean          # Stop and remove all containers/volumes
make prune          # Remove all unused Docker resources
make ps             # Show running containers
make shell-backend  # Open shell in backend container
make shell-frontend # Open shell in frontend container
make shell-db       # Open PostgreSQL shell
make health         # Check health of all services
make test-backend   # Run backend tests
make test-frontend  # Run frontend tests
```

## 🔧 Development

### Development Mode

Development mode includes:
- Hot-reload for frontend
- Debug port for backend (5005)
- Volume mounts for live code changes

```bash
# Start development environment
make dev

# Or with docker-compose
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

Access points in dev mode:
- Frontend: http://localhost:5173 (Vite dev server)
- Backend: http://localhost:8080
- Backend Debug: localhost:5005

### Running Tests

```bash
# Backend tests
make test-backend

# Frontend tests
make test-frontend

# Or manually
cd todo-backend && ./mvnw test
cd todo-frontend && npm test
```

### Database Access

```bash
# Open PostgreSQL shell
make shell-db

# Or with docker-compose
docker-compose exec postgres psql -U todouser -d tododb

# Common queries
\dt              # List tables
\d users         # Describe users table
SELECT * FROM users;
```

## 🐳 Docker Details

### Image Sizes (Optimized)

- Backend: ~200MB (multi-stage build)
- Frontend: ~25MB (Nginx Alpine)
- Database: ~80MB (PostgreSQL Alpine)

### Volumes

- `postgres_data`: Persistent database storage
- `backend_logs`: Application logs

### Networks

All services run on `todo-network` bridge network for internal communication.

### Health Checks

All services include health checks:
- Backend: `/actuator/health` endpoint
- Frontend: `/health` endpoint
- Database: `pg_isready` command

## 🔒 Security Features

### Backend
- Non-root user execution
- JWT authentication
- BCrypt password encryption
- OAuth2 integration (Google, GitHub)
- CORS configuration
- Security headers

### Frontend
- Content Security Policy
- XSS protection headers
- Gzip compression
- Static asset caching

### Database
- Encrypted connections
- User isolation
- Volume encryption at rest

## 📊 Monitoring

### Health Check Endpoints

```bash
# Backend health
curl http://localhost:8080/actuator/health

# Frontend health
curl http://localhost:3000/health

# Service status
make health
```

### Logs

```bash
# All services
make logs

# Specific service
make logs-backend
make logs-frontend
make logs-db

# Follow logs with grep
docker-compose logs -f backend | grep ERROR
```

## 🔄 CI/CD Integration

### Build Pipeline Example

```yaml
# .github/workflows/docker-build.yml
name: Build and Push Docker Images

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build images
        run: docker-compose build
      
      - name: Run tests
        run: |
          make test-backend
          make test-frontend
      
      - name: Push images
        run: |
          docker-compose push
```

## 🚨 Troubleshooting

### Port Already in Use

```bash
# Check what's using the port
lsof -i :8080
lsof -i :3000
lsof -i :5432

# Change ports in .env file
BACKEND_PORT=8081
FRONTEND_PORT=3001
DB_PORT=5433
```

### Database Connection Issues

```bash
# Check database logs
make logs-db

# Restart database
docker-compose restart postgres

# Reset database (WARNING: deletes all data)
make clean
make up
```

### Container Won't Start

```bash
# Check container status
make ps

# View detailed logs
make logs

# Rebuild from scratch
make clean
make build
make up
```

### Memory Issues

```bash
# Increase Docker memory limit in Docker Desktop
# Settings -> Resources -> Memory (recommend 4GB minimum)

# Or adjust JVM memory in docker-compose.yml
JAVA_OPTS: "-Xms256m -Xmx1g"
```

## 📝 Environment Variables

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_PROFILES_ACTIVE` | Spring profile | `prod` |
| `DATABASE_URL` | PostgreSQL connection URL | `jdbc:postgresql://postgres:5432/tododb` |
| `JWT_SECRET_KEY` | JWT signing key | - |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | - |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | - |

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8080` |

### Database

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_DB` | Database name | `tododb` |
| `POSTGRES_USER` | Database user | `todouser` |
| `POSTGRES_PASSWORD` | Database password | `todopassword` |

## 🎯 Production Deployment

### Prerequisites

1. Generate secure JWT secret:
```bash
openssl rand -base64 64
```

2. Set up OAuth credentials:
- Google: https://console.cloud.google.com/
- GitHub: https://github.com/settings/developers

3. Update production .env file

### Deploy

```bash
# Build production images
docker-compose build

# Start services
docker-compose up -d

# Check health
make health

# View logs
make logs
```

### Scaling

```bash
# Scale backend instances
docker-compose up -d --scale backend=3

# Use load balancer (nginx, traefik, etc.)
```

## 📚 Additional Documentation

- [Backend Security Implementation](./todo-backend/SECURITY_IMPLEMENTATION.md)
- [Frontend Documentation](./todo-frontend/README.md)
- [API Documentation](http://localhost:8080/swagger-ui.html)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Run tests: `make test-backend && make test-frontend`
4. Commit your changes
5. Push to the branch
6. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Pramitha MJ

## 🙏 Acknowledgments

- Spring Boot team
- React team
- PostgreSQL community
