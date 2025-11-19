# To-Do Task Web Application

## 📋 Project Overview

**Repository**: [todo-web-portal](https://github.com/PramithaMJ/todo-web-portal)  
**Branch**: `test`  
**Submission Date**: November 19, 2025  
**Developer**: PramithaMJ

---

## Requirements Completion Status

### User Requirements

| Requirement | Implementation Details |
|------------|------------------------|
| Create tasks with title and description | Fully functional form with validation |
| Display most recent 5 tasks | Dashboard view shows latest 5 tasks with sorting |
| Mark tasks as completed | "Done" button with status toggle functionality |
| Hide completed tasks from UI | Completed tasks removed from dashboard view |

**Additional Features Implemented**:
- ✅ User authentication (OAuth with Google/GitHub + JWT)
- ✅ Task search and filtering
- ✅ Pagination for all tasks view
- ✅ Task statistics dashboard
- ✅ Responsive mobile-first design
- ✅ Dark/Light theme toggle
- ✅ Task reopen functionality (undo completion)

---

### Architecture Requirements

| Requirement | Technology Used |
|------------|-----------------|
| Database (Relational) | PostgreSQL 16 |
| Backend REST API | Java 17 + Spring Boot 3.2.5 |
| Frontend SPA | React 19 + TypeScript + Vite |
| Docker Containerization | Docker Compose with 3 services |
| Build Process in Docker | Multi-stage Docker builds |

---

## 🏗️ System Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                        │
│  React 19.2 + TypeScript + Vite + TanStack Query            │
│  Port: 5173 (dev) / 80 (prod)                               │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                      Backend API Layer                      │
│  Spring Boot 3.2.5 + Java 17 + Spring Security              │
│  Port: 8080                                                 │
└─────────────────────────────────────────────────────────────┘
                              ↓ JDBC
┌─────────────────────────────────────────────────────────────┐
│                       Database Layer                        │
│  PostgreSQL 16 + Flyway Migrations                          │
│  Port: 5432                                                 │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Database
- **PostgreSQL 16**: Production-grade relational database
- **Flyway**: Version-controlled database migrations
- **H2 Database**: In-memory database for testing

#### Backend
- **Java 17**: LTS version with modern features
- **Spring Boot 3.2.5**: Enterprise-grade framework
- **Spring Data JPA**: ORM with repository pattern
- **Spring Security**: JWT-based authentication
- **Spring Validation**: Bean validation
- **Lombok**: Reduces boilerplate code
- **Maven 3.9**: Dependency management and build tool

#### Frontend
- **React 19.2**: Latest version with concurrent features
- **TypeScript 5**: Type safety and developer experience
- **Vite 7.2**: Fast build tool and dev server
- **TanStack Query 5**: Server state management
- **React Router 7**: Client-side routing
- **Zustand 5**: Lightweight state management
- **Axios**: HTTP client

---

## 🗄️ Database Design

### Task Table Schema

```sql
CREATE TABLE task (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_task_user_id ON task(user_id);
CREATE INDEX idx_task_status ON task(status);
CREATE INDEX idx_task_created_at ON task(created_at DESC);
```

### User Table Schema

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    provider VARCHAR(50),
    provider_id VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Design Principles
- ✅ **Normalized**: Third Normal Form (3NF)
- ✅ **UUID Primary Keys**: Better for distributed systems
- ✅ **Timestamps**: Audit trail with created_at, updated_at
- ✅ **Constraints**: Foreign keys and NOT NULL constraints
- ✅ **Indexes**: Performance optimization on frequently queried columns
- ✅ **Cascading Deletes**: Maintain referential integrity

---

## 🔌 REST API Design

### Base URL
```
http://localhost:8080/api/v1
```

### Endpoints

#### Authentication Endpoints
```http
POST   /api/v1/auth/register          # User registration
POST   /api/v1/auth/login             # User login
POST   /api/v1/auth/refresh           # Refresh access token
GET    /api/v1/auth/me                # Get current user profile
GET    /api/v1/oauth/google           # Google OAuth redirect
GET    /api/v1/oauth/github           # GitHub OAuth redirect
GET    /api/v1/oauth/callback/{provider} # OAuth callback
```

#### Task Management Endpoints
```http
GET    /api/v1/tasks                  # Get paginated tasks
GET    /api/v1/tasks/{id}             # Get task by ID
POST   /api/v1/tasks                  # Create new task
PUT    /api/v1/tasks/{id}             # Update task
DELETE /api/v1/tasks/{id}             # Delete task
PUT    /api/v1/tasks/{id}/complete    # Mark task as completed
PUT    /api/v1/tasks/{id}/reopen      # Reopen completed task
GET    /api/v1/tasks/pending          # Get pending tasks only
GET    /api/v1/tasks/completed        # Get completed tasks
GET    /api/v1/tasks/recent           # Get 5 most recent tasks
GET    /api/v1/tasks/search           # Search tasks
GET    /api/v1/tasks/statistics       # Get task statistics
```

### API Features
- ✅ RESTful design principles
- ✅ JWT token-based authentication
- ✅ Request/Response validation
- ✅ Pagination support (page, size, sort)
- ✅ Error handling with proper HTTP status codes
- ✅ CORS configuration
- ✅ API versioning (/api/v1)

---

## 🧪 Testing Coverage

### Test Summary

| Test Type | Count | Status | Coverage |
|-----------|-------|--------|----------|
| Backend Unit Tests | 39 |  100% Pass | Service + Repository |
| Frontend Unit Tests | 106 |  100% Pass | Components + API + Hooks |
| End-to-End Tests | 7 | 100% Pass | Critical User Flows |
| **TOTAL** | **152** | ** 100%** | **Comprehensive** |

### Backend Testing (39 Tests)

#### Service Layer Tests (21 Tests)
**File**: `TaskServiceImplTest.java`

```java
@Nested @DisplayName("Create Operations")
- shouldCreateTaskSuccessfully
- shouldCreateTaskWithNullDescription

@Nested @DisplayName("Read Operations")  
- shouldGetAllTasksWithPagination
- shouldGetTaskByIdSuccessfully
- shouldThrowExceptionWhenTaskNotFound

@Nested @DisplayName("Update Operations")
- shouldUpdateTaskSuccessfully
- shouldUpdateOnlyProvidedFields
- shouldThrowExceptionWhenUpdatingNonExistentTask

@Nested @DisplayName("Delete Operations")
- shouldDeleteTaskSuccessfully
- shouldThrowExceptionWhenDeletingNonExistentTask

@Nested @DisplayName("Status Management")
- shouldCompleteTaskSuccessfully
- shouldReopenTaskSuccessfully
- shouldThrowExceptionWhenCompletingNonExistentTask
- shouldThrowExceptionWhenReopeningNonExistentTask

@Nested @DisplayName("Pagination & Search")
- shouldReturnPaginatedResults
- shouldReturnEmptyPageWhenNoTasks
- shouldSearchTasksByQuery

@Nested @DisplayName("Statistics")
- shouldReturnTaskStatistics
- shouldReturnZeroStatisticsWhenNoTasks

@Nested @DisplayName("Edge Cases")
- shouldHandleNullableFieldsInUpdateRequest
- shouldNotChangeStatusWhenUpdatingOtherFields
```

#### Repository Integration Tests (13 Tests)
**File**: `TaskRepositoryTest.java`

```java
@DataJpaTest
- shouldSaveAndRetrieveTask
- shouldFindTasksByUserId
- shouldFindByIdAndUserId
- shouldNotFindTaskForDifferentUser
- shouldFindPendingTasks
- shouldFindCompletedTasks
- shouldFindRecent5Tasks
- shouldSearchTasksByTitle
- shouldSearchTasksByDescription
- shouldCountTasksByUserId
- shouldCountTasksByUserIdAndStatus
- shouldUpdateTask
- shouldDeleteTask
```

**Testing Tools**:
- JUnit 5 (Jupiter)
- Mockito (mocking)
- AssertJ (fluent assertions)
- @DataJpaTest (repository testing)
- H2 Database (in-memory testing)
- JaCoCo (code coverage)

### Frontend Testing (106 Tests)

#### API Layer Tests (3 Files, ~40 Tests)
- `task.api.test.ts`: CRUD operations, pagination, search
- `auth.api.test.ts`: Login, registration, token refresh
- `oauth.api.test.ts`: OAuth flows

#### React Query Hooks Tests (3 Files, ~15 Tests)
- `use-create-task.test.ts`: Task creation mutations
- `use-complete-task.test.ts`: Task completion logic
- `use-get-tasks.test.ts`: Task fetching queries

#### Component Tests (2 Files, ~20 Tests)
- `TaskForm.test.tsx`: Form rendering, validation, submission
- `TaskList.test.tsx`: List rendering, empty states, interactions

#### Utility Tests (1 File, ~25 Tests)
- `jwt.test.ts`: Token validation, decoding, expiration

**Testing Tools**:
- Vitest (test runner)
- Testing Library (React testing)
- MSW (Mock Service Worker for API mocking)
- jsdom (DOM environment)

### End-to-End Tests (7 Tests)

**File**: `essential.spec.ts`

```typescript
1. Complete login-to-task-creation workflow
2. Form submission handling  
3. Email format validation
4. View navigation (Dashboard ↔ All Tasks)
5. Session expiration handling
6. Unauthorized access prevention
7. Responsive design (mobile + desktop)
```

**E2E Tools**:
- Playwright (browser automation)
- Chromium (test browser)

### Code Coverage

**Backend Coverage** (JaCoCo):
- Service Layer: Comprehensive
- Repository Layer: Full CRUD operations
- 51 classes analyzed

**Frontend Coverage** (Vitest):
- API Layer: High coverage
- Hooks: Comprehensive
- Components: Core functionality
- Utilities: 100%

---

## 🐳 Docker Implementation

### Docker Compose Structure

```yaml
services:
  database:
    image: postgres:16-alpine
    ports: ["5432:5432"]
    
  backend:
    build: ./todo-backend
    ports: ["8080:8080"]
    depends_on: [database]
    
  frontend:
    build: ./todo-frontend  
    ports: ["80:80"]
    depends_on: [backend]
```

### Multi-Stage Docker Builds

#### Backend Dockerfile
```dockerfile
# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS build
COPY . /app
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### Frontend Dockerfile
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS build
COPY . /app
RUN npm ci && npm run build

# Stage 2: Production
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

### Running the Application

```bash
# Clone repository
git clone https://github.com/PramithaMJ/todo-web-portal.git
cd todo-web-portal

# Start all services
docker-compose up -d

# Access application
# Frontend: http://localhost
# Backend API: http://localhost:8080
# Database: localhost:5432
```

---

## Clean Code & SOLID Principles

### Clean Code Practices

#### Backend
**Meaningful Names**: Clear, descriptive variable and method names
```java
public TaskResponseDto createTask(TaskRequestDto request, UUID userId)
public Page<TaskResponseDto> getPendingTasksByUserId(UUID userId, Pageable pageable)
```

**Single Responsibility**: Each class has one clear purpose
- `TaskController`: HTTP request handling
- `TaskService`: Business logic
- `TaskRepository`: Data access
- `TaskMapper`: DTO conversion

**Small Functions**: Methods focused on single tasks
**Comments**: Only where necessary, code is self-documenting
**Error Handling**: Proper exception handling with custom exceptions
**Formatting**: Consistent indentation and structure

#### Frontend
**Component Composition**: Reusable, focused components
**Custom Hooks**: Encapsulated logic (useAuth, useTask)
**Type Safety**: Full TypeScript coverage
**Feature-Sliced Design**: Organized by features
**Pure Functions**: Predictable utility functions

### SOLID Principles Implementation

#### S - Single Responsibility Principle
```java
// Each class has one reason to change
class TaskService { /* Business logic only */ }
class TaskRepository { /* Data access only */ }
class TaskMapper { /* DTO conversion only */ }
```

#### O - Open/Closed Principle
```java
// Open for extension, closed for modification
interface TaskService {
    TaskResponseDto createTask(TaskRequestDto request, UUID userId);
}

@Service
class TaskServiceImpl implements TaskService { /* Implementation */ }
```

#### L - Liskov Substitution Principle
```java
// Implementations are interchangeable
TaskService service = new TaskServiceImpl();
// Can be replaced with different implementation without breaking code
```

#### I - Interface Segregation Principle
```java
// Specific interfaces instead of fat interfaces
interface TaskRepository extends JpaRepository<Task, UUID> {
    Page<Task> findByUserId(UUID userId, Pageable pageable);
    Page<Task> findPendingTasksByUserId(UUID userId, Pageable pageable);
}
```

#### D - Dependency Inversion Principle
```java
// Depend on abstractions, not concrete implementations
@Service
public class TaskServiceImpl implements TaskService {
    private final TaskRepository taskRepository; // Interface, not implementation
    
    @Autowired
    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }
}
```

---

## 🎨 User Interface

### Design Highlights

#### Features
- **Responsive Design**: Mobile-first approach, works on all screen sizes
- **Dark/Light Theme**: User preference with localStorage persistence
- **Intuitive Navigation**: Clear dashboard and all-tasks views
- **Real-time Feedback**: Loading states, success/error messages
- **Accessibility**: ARIA labels, keyboard navigation
- **Modern UI**: Clean, professional design with smooth animations

---

## 🚀 Running the Application

### Prerequisites
- Docker & Docker Compose
- Linux environment with Bash
- No other installations required (Node.js/Java builds happen in containers)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/PramithaMJ/todo-web-portal.git
cd todo-web-portal

# 2. Start all services
docker-compose up -d

# 3. Wait for services to be ready (~30 seconds)
docker-compose logs -f

# 4. Access the application
# Frontend: http://localhost
# Backend API: http://localhost:8080
# API Docs: http://localhost:8080/swagger-ui.html
```

### Development Mode

```bash
# Frontend development
cd todo-frontend
npm install
npm run dev      # Runs on http://localhost:5173

# Backend development
cd todo-backend
mvn spring-boot:run  # Runs on http://localhost:8080

# Database (standalone)
docker-compose up database -d
```

### Running Tests

```bash
# Frontend Unit Tests
cd todo-frontend
npm test                  # All unit tests (106 tests)
npm run test:coverage     # With coverage report

# Frontend E2E Tests
npm run e2e              # Essential tests (7 tests, ~18 seconds)

# Backend Tests
cd todo-backend
mvn test                 # All tests (39 tests)
mvn test -Dtest=TaskServiceImplTest  # Specific test class
```

### Stopping the Application

```bash
docker-compose down       # Stop all services
docker-compose down -v    # Stop and remove volumes (clean slate)
```

---
---

## 🔒 Security Implementation

### Authentication & Authorization
- JWT-based authentication
- OAuth 2.0 (Google, GitHub)
- Password hashing (BCrypt)
- Token expiration and refresh
- Protected API endpoints
- User-specific data isolation

### Security Headers
- CORS configuration
- CSRF protection
- XSS prevention
- SQL injection prevention (Prepared statements)

---

## 🎁 Extra Features Implemented

### Beyond Requirements

1. **User Authentication System**
   - Email/password registration and login
   - OAuth integration (Google, GitHub)
   - JWT token management
   - Session handling

2. **Advanced Task Management**
   - Task search functionality
   - Filter by status (All/Pending/Completed)
   - Pagination for large datasets
   - Task statistics and analytics
   - Task reopen functionality

3. **Enhanced UI/UX**
   - Dark/Light theme toggle
   - Responsive mobile design
   - Loading states and animations
   - Error handling with user feedback
   - Professional navbar with toggle menu

4. **Comprehensive Testing**
   - 152 total tests (39 backend + 106 frontend + 7 E2E)
   - 100% test pass rate
   - Code coverage reporting

5. **Developer Experience**
   - Hot reload in development
   - Type safety with TypeScript
   - API documentation (Swagger)
   - Detailed README files
   - Clean commit history

---

### API Documentation
- Swagger UI available at: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

---

## 🔄 CI/CD Ready

### Pipeline Integration
```yaml
# Example GitHub Actions workflow
name: CI/CD Pipeline

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Backend Tests
        run: cd todo-backend && mvn test
        
      - name: Frontend Tests  
        run: cd todo-frontend && npm test && npm run e2e
        
      - name: Build Docker Images
        run: docker-compose build
```

---

## 🔮 Future Enhancements (Out of Scope)

1. Task categories/tags
2. Due dates and reminders
3. Task priority levels
4. Collaborative task sharing
5. Task attachments
6. Email notifications
7. Mobile native apps
8. Real-time updates (WebSocket)

---

## 📞 Contact & Support

**Developer**: PramithaMJ  
**Repository**: https://github.com/PramithaMJ/todo-web-portal  
**Branch**: `main`
