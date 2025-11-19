# Todo Web Portal - Full Stack Application

A production-ready, enterprise-grade Todo application featuring a modern tech stack with Spring Boot backend, React frontend, PostgreSQL database, and comprehensive OAuth2 authentication.

## ✨ Features

- ✅ **Full CRUD Operations** - Create, read, update, and delete tasks
- 🔐 **Secure Authentication** - JWT-based auth with OAuth2 (Google & GitHub)
- 🎨 **Modern UI** - Responsive React interface with Vite
- 🐳 **Docker Ready** - Fully containerized with Docker Compose
- 🔒 **Production Security** - CORS, security headers, encrypted connections
- 📊 **Health Monitoring** - Built-in health checks and actuator endpoints
- 🚀 **Optimized Build** - Multi-stage Docker builds for minimal image sizes

## 🏗️ Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Frontend      │      │   Backend       │      │   PostgreSQL    │
│   React + Vite  │─────▶│  Spring Boot    │─────▶│    Database     │
│   Port: 3000    │      │   Port: 8080    │      │   Port: 5432    │
│   Nginx         │      │   Java 21       │      │   Alpine        │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## 🛠️ Technologies Used

### Backend
- **Spring Boot 3.2.5** - Application framework
- **Java 21** - Programming language
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database abstraction
- **PostgreSQL** - Relational database
- **Flyway** - Database migrations
- **JWT** - Token-based authentication
- **OAuth2** - Social login (Google, GitHub)
- **Maven** - Build tool
- **Docker** - Containerization

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Zustand** - State management
- **React Query** - Server state management
- **CSS3** - Styling
- **Nginx** - Production web server

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **PostgreSQL Alpine** - Lightweight database image
- **Multi-stage builds** - Optimized image sizes
- **Health checks** - Service monitoring

## Quick Start

### Prerequisites

- Docker (20.10+)
- Docker Compose (2.0+)

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/PramithaMJ/todo-web-portal.git
cd todo-web-portal

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

#### Using Docker Compose Directly

```bash
# Production mode
docker-compose up -d

# View logs
docker-compose logs -f
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **Database**: localhost:5432

## 🔧 Development

### Development Mode

Development mode includes:
- Hot-reload for frontend
- Debug port for backend (5005)
- Volume mounts for live code changes

```bash
# Or with docker-compose
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

Access points in dev mode:
- Frontend: http://localhost:5173 (Vite dev server)
- Backend: http://localhost:8080
- Backend Debug: localhost:5005

### Running Tests

```bash
cd todo-backend && ./mvnw test
cd todo-frontend && npm test
```

### Database Access

```bash
# with docker-compose
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
```

### Logs

```bash
# Follow logs with grep
docker-compose logs -f backend | grep ERROR
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
```

### Scaling

```bash
# Scale backend instances
docker-compose up -d --scale backend=3

# Use load balancer (nginx, traefik, etc.)
```

## 📚 Additional Documentation

- [API Documentation](http://localhost:8080/swagger-ui.html)

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- PramithaMJ