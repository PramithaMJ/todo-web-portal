# Quick Start Guide

## 🚀 Getting Started in 30 Seconds

### Current Status
✅ Development server is **running** on http://localhost:5173/  
✅ All dependencies installed  
✅ MSW service worker initialized  
✅ 41 unit tests passing  

## 🎯 Quick Commands

```bash
# Development (already running)
npm run dev                    # http://localhost:5173/

# Testing
npm test                       # Run all unit tests
npm run test:coverage          # Generate coverage report
npm run e2e                    # Run E2E tests with Playwright

# Build
npm run build                  # Build for production
npm run preview                # Preview production build

# Code Quality
npm run lint                   # Lint code
npx tsc --noEmit              # Check TypeScript errors
```

## 📱 Testing the Application

### 1. View the Application
Open http://localhost:5173/ in your browser (or check the VS Code Simple Browser)

### 2. Test Features

**Create a Task:**
1. Look at the left sidebar (or top on mobile)
2. Enter task title: "Buy groceries"
3. Enter description: "Get milk, eggs, bread"
4. Select priority: "High"
5. Click "Add Task"
6. ✅ Task appears in the list with a red priority bar

**Complete a Task:**
1. Find any task card
2. Click the "Done" button
3. ✅ Task gets marked complete with strikethrough
4. ✅ Button changes to "Undo"

**Undo Completion:**
1. Click "Undo" on a completed task
2. ✅ Task becomes pending again

**Test OAuth (Mocked):**
1. Click "Sign in with Google" or "Sign in with GitHub"
2. ✅ Redirects to mock OAuth URL (in development mode)

### 3. Mobile Testing
Resize your browser window or use DevTools device emulation:
- **Mobile:** < 768px (single column)
- **Tablet:** 768px - 1024px (2 columns)
- **Desktop:** > 1024px (sidebar + main)

## 🧪 Run Tests

### Unit Tests (Recommended)
```bash
npm test -- --run
```

**Expected output:** ✅ 41 tests passing

**Test coverage:**
- String helpers (15 tests)
- Validators (8 tests)
- Button component (10 tests)
- TaskCard component (4 tests)
- useLocalStorage hook (4 tests)

### E2E Tests
```bash
npm run e2e
```

**Tests:**
- Task creation flow
- Task completion flow
- Error handling

## 📂 Key Files to Review

### Architecture Entry Points
```
src/app/App.tsx                    # Application root
src/app/providers/                 # All providers (Query, Auth, Router)
src/pages/tasks/ui/TasksPage.tsx  # Main dashboard
```

### Domain Models
```
src/entities/task/model/task.entity.ts     # Task entity with business rules
src/entities/task/model/value-objects.ts   # TaskTitle, TaskDescription, etc.
```

### Features
```
src/features/auth/                 # Authentication feature
src/features/tasks/                # Task management feature
```

### API Layer
```
src/shared/api/client/apiClient.ts # HTTP client
src/shared/api/client/interceptors.ts # Auth interceptors
```

### Mocks
```
src/mocks/handlers/                # MSW request handlers
src/mocks/data/                    # Mock data
```

## 🎨 UI Components

All components in `src/shared/ui/`:

```tsx
// Button
<Button variant="primary" size="medium" onClick={handleClick}>
  Click Me
</Button>

// Card
<Card elevation="medium" padding="large">
  Content
</Card>

// Input
<Input
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  error={error}
/>

// Spinner
<Spinner size="medium" />
```

## 🔧 Configuration

### Environment Variables
```env
# .env.local
VITE_API_BASE_URL=http://localhost:8080/api
VITE_ENABLE_MOCKS=true
VITE_OAUTH_GOOGLE_CLIENT_ID=your-client-id
VITE_OAUTH_GITHUB_CLIENT_ID=your-client-id
```

### Switch to Real Backend
1. Set `VITE_ENABLE_MOCKS=false` in `.env.local`
2. Update `VITE_API_BASE_URL` to your API URL
3. Configure OAuth client IDs
4. Restart dev server

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Restart dev server
npm run dev
```

### Clear Cache
```bash
rm -rf node_modules/.vite
npm run dev
```

### Reset Mock Data
MSW data resets on browser refresh or server restart.

### Tests Failing
```bash
# Clear test cache
npx vitest run --clearCache

# Re-run tests
npm test
```

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| **Total Files** | 85+ |
| **Components** | 20+ |
| **Custom Hooks** | 10+ |
| **Test Suites** | 5 |
| **Tests Passing** | 41/41 ✅ |
| **Code Coverage** | High |
| **TypeScript Errors** | 0 ✅ |

## 🎯 Feature Checklist

### Completed ✅
- [x] Clean Architecture implementation
- [x] SOLID principles
- [x] Domain-Driven Design
- [x] Task CRUD operations
- [x] OAuth authentication (Google, GitHub)
- [x] Responsive design (mobile, tablet, desktop)
- [x] Unit tests (41 passing)
- [x] E2E tests setup
- [x] MSW API mocking
- [x] TypeScript strict mode
- [x] Accessibility features
- [x] Error handling
- [x] Loading states
- [x] Form validation with Zod
- [x] React Query state management
- [x] Zustand client state
- [x] Token refresh mechanism

### Production Deployment
- [ ] Connect to real backend API
- [ ] Configure OAuth client IDs
- [ ] Deploy to hosting (Vercel/Netlify)
- [ ] Set up CI/CD pipeline
- [ ] Add error tracking (Sentry)
- [ ] Add analytics

## 📚 Documentation

- **IMPLEMENTATION.md** - Architecture and features overview
- **COMPLETION_SUMMARY.md** - Full implementation report
- **README.md** - Project documentation
- **QUICK_START.md** - This file

## 🆘 Need Help?

### Common Issues

**Q: Can't access localhost:5173?**  
A: Check that dev server is running. Look for "Local: http://localhost:5173/" in terminal.

**Q: OAuth not working?**  
A: In development mode, OAuth redirects to mock URLs. Set VITE_ENABLE_MOCKS=false to use real OAuth.

**Q: Tasks not persisting?**  
A: Mock data is in-memory. It resets on page refresh. Connect to real backend for persistence.

**Q: TypeScript errors in IDE?**  
A: Restart TypeScript server: CMD+Shift+P → "TypeScript: Restart TS Server"

### Architecture Questions

**Q: Where do I add a new feature?**  
A: Create a new folder in `src/features/`. Follow the structure of `auth/` or `tasks/`.

**Q: How do I add a new API endpoint?**  
A: Add to `src/shared/constants/api.ts` and create API function in feature's `api/` folder.

**Q: Where are the API mocks?**  
A: `src/mocks/handlers/` contains MSW request handlers. `src/mocks/data/` has mock data.

**Q: How do I add a new page?**  
A: Create folder in `src/pages/`, add route in `src/app/providers/RouterProvider.tsx`.

## 🎓 Learning Resources

This codebase demonstrates:
- Clean Architecture layers
- SOLID principles in action
- DDD with entities and value objects
- Feature-Sliced Design
- React 19 best practices
- TypeScript advanced patterns
- Testing strategies
- State management patterns

Each file is < 200 lines and heavily commented for learning.

---

**🚀 You're ready to go! The application is running and all tests are passing.**

**Next steps:**
1. ✅ View the app at http://localhost:5173/
2. ✅ Create and complete some tasks
3. ✅ Explore the codebase
4. ✅ Run tests with `npm test`
5. ✅ Review architecture in IMPLEMENTATION.md

**Happy coding! 🎉**
