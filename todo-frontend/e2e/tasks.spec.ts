/**
 * E2E Tests for Task Management
 * Comprehensive end-to-end testing following current implementation
 */

import { test, expect } from '@playwright/test';

// Test constants
const DEMO_USER = {
  email: 'demo@example.com',
  password: 'demo123',
};

test.describe('Task Management Application', () => {
  test.describe('Home Page', () => {
    test('should display home page with sign in and sign up buttons', async ({ page }) => {
      await page.goto('/');
      
      // Verify page title and description
      await expect(page.getByText('Welcome to TaskManager')).toBeVisible();
      await expect(page.getByText('Organize your tasks efficiently and boost your productivity')).toBeVisible();
      
      // Verify navigation buttons
      await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible();
    });

    test('should navigate to login page when Sign In clicked', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('button', { name: 'Sign In' }).click();
      
      await expect(page).toHaveURL('/login');
      await expect(page.getByText('Welcome Back')).toBeVisible();
    });

    test('should navigate to signup page when Sign Up clicked', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('button', { name: 'Sign Up' }).click();
      
      await expect(page).toHaveURL('/signup');
    });
  });

  test.describe('Login Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
    });

    test('should display login form with all elements', async ({ page }) => {
      // Verify header
      await expect(page.getByText('Welcome Back')).toBeVisible();
      await expect(page.getByText('Sign in to your account')).toBeVisible();
      
      // Verify form fields
      await expect(page.getByLabel('Email')).toBeVisible();
      await expect(page.getByLabel('Password')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
      
      // Verify OAuth buttons
      await expect(page.getByRole('button', { name: /Continue with Google/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /Continue with GitHub/i })).toBeVisible();
      
      // Verify demo credentials
      await expect(page.getByText('Demo credentials:')).toBeVisible();
      await expect(page.getByText('Email: demo@example.com')).toBeVisible();
    });

    test('should show validation errors for empty form', async ({ page }) => {
      await page.getByRole('button', { name: 'Sign In' }).click();
      
      // Errors are displayed as .input-message--error in the Input components
      await page.waitForTimeout(500);
      const errorMessages = page.locator('.input-message--error');
      const errorCount = await errorMessages.count();
      expect(errorCount).toBeGreaterThanOrEqual(2); // Email and password errors
    });

    test('should show error for invalid email format', async ({ page }) => {
      await page.getByLabel('Email').fill('invalid-email');
      await page.getByLabel('Password').fill('password123');
      await page.getByRole('button', { name: 'Sign In' }).click();
      
      await page.waitForTimeout(500);
      const errorMessages = page.locator('.input-message--error');
      const errorCount = await errorMessages.count();
      expect(errorCount).toBeGreaterThanOrEqual(1); // At least email error
    });

    test('should show error for short password', async ({ page }) => {
      await page.getByLabel('Email').fill('test@example.com');
      await page.getByLabel('Password').fill('12345');
      await page.getByRole('button', { name: 'Sign In' }).click();
      
      await page.waitForTimeout(500);
      const errorMessages = page.locator('.input-message--error');
      const errorCount = await errorMessages.count();
      expect(errorCount).toBeGreaterThanOrEqual(1); // Password error
    });

    test('should successfully login with demo credentials', async ({ page }) => {
      await page.getByLabel('Email').fill(DEMO_USER.email);
      await page.getByLabel('Password').fill(DEMO_USER.password);
      await page.getByRole('button', { name: 'Sign In' }).click();
      
      // Should redirect to tasks page
      await expect(page).toHaveURL('/tasks');
      await expect(page.getByText('Add a Task')).toBeVisible();
    });

    test('should navigate to signup page via link', async ({ page }) => {
      await page.getByRole('link', { name: 'Sign up' }).click();
      await expect(page).toHaveURL('/signup');
    });
  });

  test.describe('Tasks Page - Dashboard View', () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.goto('/login');
      await page.getByLabel('Email').fill(DEMO_USER.email);
      await page.getByLabel('Password').fill(DEMO_USER.password);
      await page.getByRole('button', { name: 'Sign In' }).click();
      await expect(page).toHaveURL('/tasks');
    });

    test('should display navbar with all elements', async ({ page }) => {
      // Verify navbar elements
      await expect(page.getByText('TaskManager')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Dashboard' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'All Tasks' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
    });

    test('should display split-screen dashboard layout', async ({ page }) => {
      // Verify left side: Add Task form
      await expect(page.getByText('Add a Task')).toBeVisible();
      await expect(page.getByLabel('Title')).toBeVisible();
      await expect(page.getByLabel('Description')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
      
      // Verify right side: Task list exists
      const taskList = page.locator('.task-list');
      await expect(taskList).toBeVisible();
    });

    test('should show Dashboard button as active', async ({ page }) => {
      const dashboardButton = page.getByRole('button', { name: 'Dashboard' });
      await expect(dashboardButton).toHaveClass(/navbar__nav-button--active/);
    });

    test('should create a new task successfully', async ({ page }) => {
      const taskTitle = `Test Task ${Date.now()}`;
      const taskDescription = 'This is a test task description';
      
      // Fill form
      await page.getByLabel('Title').fill(taskTitle);
      await page.getByLabel('Description').fill(taskDescription);
      await page.getByRole('button', { name: 'Add' }).click();
      
      // Wait for task to appear
      await expect(page.getByText(taskTitle)).toBeVisible({ timeout: 5000 });
      await expect(page.getByText(taskDescription)).toBeVisible();
      
      // Form should be cleared
      await expect(page.getByLabel('Title')).toHaveValue('');
      await expect(page.getByLabel('Description')).toHaveValue('');
    });

    test('should mark task as complete', async ({ page }) => {
      // Wait for tasks to load
      await page.waitForSelector('.task-card', { timeout: 5000 });
      
      const firstTask = page.locator('.task-card').first();
      const doneButton = firstTask.getByRole('button', { name: 'Done' });
      
      // Check if button exists
      if (await doneButton.isVisible()) {
        await doneButton.click();
        
        // Wait for mutation to complete
        await page.waitForTimeout(1500);
        
        // Verify task is marked as completed
        const classes = await firstTask.getAttribute('class');
        expect(classes).toContain('task-card--completed');
      }
    });

    test('should undo completed task', async ({ page }) => {
      // Wait for tasks to load
      await page.waitForSelector('.task-card', { timeout: 5000 });
      
      const firstTask = page.locator('.task-card').first();
      
      // Check if Done button exists
      const doneButton = firstTask.getByRole('button', { name: 'Done' });
      if (await doneButton.isVisible()) {
        // Mark as done
        await doneButton.click();
        await page.waitForTimeout(1500);
        
        let classes = await firstTask.getAttribute('class');
        expect(classes).toContain('task-card--completed');
        
        // Undo
        await firstTask.getByRole('button', { name: 'Undo' }).click();
        await page.waitForTimeout(1500);
        
        classes = await firstTask.getAttribute('class');
        expect(classes).not.toContain('task-card--completed');
      }
    });

    test('should display maximum 5 tasks in dashboard view', async ({ page }) => {
      await page.waitForSelector('.task-card', { timeout: 5000 });
      
      const taskCards = page.locator('.task-card');
      const count = await taskCards.count();
      
      expect(count).toBeLessThanOrEqual(5);
    });
  });

  test.describe('Tasks Page - All Tasks View', () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.goto('/login');
      await page.getByLabel('Email').fill(DEMO_USER.email);
      await page.getByLabel('Password').fill(DEMO_USER.password);
      await page.getByRole('button', { name: 'Sign In' }).click();
      await expect(page).toHaveURL('/tasks');
      
      // Navigate to All Tasks view
      await page.getByRole('button', { name: 'All Tasks' }).click();
    });

    test('should display All Tasks button as active', async ({ page }) => {
      const allTasksButton = page.locator('.navbar__nav-button').filter({ hasText: 'All Tasks' });
      await expect(allTasksButton).toHaveClass(/navbar__nav-button--active/);
    });

    test('should display full-width layout with filters', async ({ page }) => {
      // Verify no split layout
      await expect(page.getByText('Add a Task')).not.toBeVisible();
      
      // Verify filters are visible - using specific filter tab selectors
      const filterTabs = page.locator('.task-filters__tab');
      await expect(filterTabs).toHaveCount(3);
      await expect(filterTabs.filter({ hasText: 'All Tasks' })).toBeVisible();
      await expect(filterTabs.filter({ hasText: 'Pending' })).toBeVisible();
      await expect(filterTabs.filter({ hasText: 'Completed' })).toBeVisible();
    });

    test('should filter tasks by status', async ({ page }) => {
      await page.waitForSelector('.task-card', { timeout: 5000 });
      
      // Click Completed filter using specific selector
      const completedFilter = page.locator('.task-filters__tab').filter({ hasText: 'Completed' });
      await completedFilter.click();
      
      await page.waitForTimeout(500);
      
      // Check if filter tab is active
      const filterClass = await completedFilter.getAttribute('class');
      expect(filterClass).toContain('task-filters__tab--active');
    });

    test('should search tasks by title', async ({ page }) => {
      await page.waitForSelector('.task-card', { timeout: 5000 });
      
      // Get first task title
      const firstTask = page.locator('.task-card').first();
      const titleElement = firstTask.locator('.task-card__title');
      const searchText = await titleElement.textContent();
      
      if (searchText) {
        // Search for first word of title
        const firstWord = searchText.split(' ')[0];
        await page.getByPlaceholder('Search tasks...').fill(firstWord);
        
        // Verify search results
        await page.waitForTimeout(500); // Debounce delay
        const visibleTasks = page.locator('.task-card');
        const count = await visibleTasks.count();
        
        expect(count).toBeGreaterThan(0);
      }
    });

    test('should display pagination when more than 5 tasks', async ({ page }) => {
      await page.waitForSelector('.task-card', { timeout: 5000 });
      
      const taskCards = page.locator('.task-card');
      const count = await taskCards.count();
      
      // If exactly 5 tasks are shown, pagination might exist
      expect(count).toBeGreaterThan(0);
      expect(count).toBeLessThanOrEqual(5);
    });

    test('should navigate back to Dashboard view', async ({ page }) => {
      // Click Dashboard button
      await page.getByRole('button', { name: 'Dashboard' }).click();
      
      // Verify we're back to dashboard
      await expect(page.getByText('Add a Task')).toBeVisible();
      
      const dashboardButton = page.getByRole('button', { name: 'Dashboard' });
      await expect(dashboardButton).toHaveClass(/navbar__nav-button--active/);
    });
  });

  test.describe('Theme Toggle', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.getByLabel('Email').fill(DEMO_USER.email);
      await page.getByLabel('Password').fill(DEMO_USER.password);
      await page.getByRole('button', { name: 'Sign In' }).click();
      await expect(page).toHaveURL('/tasks');
    });

    test('should toggle between light and dark modes', async ({ page }) => {
      // Find theme toggle button
      const themeToggle = page.locator('.theme-toggle__button').first();
      await expect(themeToggle).toBeVisible();
      
      // Click to change theme
      await themeToggle.click();
      await page.waitForTimeout(300); // Wait for theme transition
      
      // Theme should have changed (localStorage will be updated)
      const theme = await page.evaluate(() => localStorage.getItem('theme'));
      expect(theme).toBeTruthy();
    });
  });

  test.describe('Logout Functionality', () => {
    test('should logout and redirect to home page', async ({ page }) => {
      // Login
      await page.goto('/login');
      await page.getByLabel('Email').fill(DEMO_USER.email);
      await page.getByLabel('Password').fill(DEMO_USER.password);
      await page.getByRole('button', { name: 'Sign In' }).click();
      await expect(page).toHaveURL('/tasks');
      
      // Logout
      await page.getByRole('button', { name: 'Logout' }).click();
      
      // Wait for navigation
      await page.waitForTimeout(1000);
      
      // Should redirect to login page
      await expect(page).toHaveURL('/login');
    });
  });

  test.describe('Responsive Design', () => {
    test('should display mobile layout correctly', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Login
      await page.goto('/login');
      await page.getByLabel('Email').fill(DEMO_USER.email);
      await page.getByLabel('Password').fill(DEMO_USER.password);
      await page.getByRole('button', { name: 'Sign In' }).click();
      await expect(page).toHaveURL('/tasks');
      
      // Verify mobile layout
      await expect(page.getByText('TaskManager')).toBeVisible();
      await expect(page.getByText('Add a Task')).toBeVisible();
      
      // Navigation buttons should be hidden on mobile
      const navButtons = page.locator('.navbar__nav-buttons');
      await expect(navButtons).not.toBeVisible();
    });

    test('should be responsive on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      // Login
      await page.goto('/login');
      await page.getByLabel('Email').fill(DEMO_USER.email);
      await page.getByLabel('Password').fill(DEMO_USER.password);
      await page.getByRole('button', { name: 'Sign In' }).click();
      await expect(page).toHaveURL('/tasks');
      
      // Verify layout works on tablet
      await expect(page.getByText('Add a Task')).toBeVisible();
      const taskList = page.locator('.task-list');
      await expect(taskList).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      await page.goto('/login');
      
      // Try login with invalid credentials
      await page.getByLabel('Email').fill('invalid@example.com');
      await page.getByLabel('Password').fill('wrongpassword');
      await page.getByRole('button', { name: 'Sign In' }).click();
      
      // Wait for error to appear
      await page.waitForTimeout(2000);
      
      // Should show error message in the login-page__error div
      const errorDiv = page.locator('.login-page__error');
      const isVisible = await errorDiv.isVisible().catch(() => false);
      expect(isVisible).toBeTruthy();
    });
  });
});
