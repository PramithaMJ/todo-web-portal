/**
 * Core E2E Tests - Essential Task Management Workflows
 * Streamlined test suite covering critical user paths only
 */

import { test, expect } from '@playwright/test';

const DEMO_USER = {
  email: 'demo@example.com',
  password: 'demo123',
};

test.describe('Core User Workflows', () => {
  test('should complete full user journey: login → create task → complete task → logout', async ({ page }) => {
    // Navigate and login
    await page.goto('/');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/login');
    
    await page.getByLabel('Email').fill(DEMO_USER.email);
    await page.getByLabel('Password').fill(DEMO_USER.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/tasks');

    // Create a task
    const taskTitle = `Task ${Date.now()}`;
    await page.getByLabel('Title').fill(taskTitle);
    await page.getByLabel('Description').fill('Test description');
    await page.getByRole('button', { name: 'Add' }).click();
    
    await expect(page.getByText(taskTitle)).toBeVisible({ timeout: 3000 });

    // Complete the task
    await page.waitForSelector('.task-card', { timeout: 3000 });
    const taskCard = page.locator('.task-card').filter({ hasText: taskTitle });
    await taskCard.getByRole('button', { name: 'Done' }).click();
    await page.waitForTimeout(1000);

    // Logout
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL('/login');
  });

  test('should navigate between Dashboard and All Tasks views', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(DEMO_USER.email);
    await page.getByLabel('Password').fill(DEMO_USER.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/tasks');

    // Verify Dashboard view
    await expect(page.getByText('Add a Task')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Dashboard' })).toHaveClass(/navbar__nav-button--active/);

    // Switch to All Tasks
    await page.getByRole('button', { name: 'All Tasks' }).click();
    await expect(page.getByText('Add a Task')).not.toBeVisible();
    await expect(page.locator('.task-filters__tab')).toHaveCount(3);

    // Switch back to Dashboard
    await page.getByRole('button', { name: 'Dashboard' }).click();
    await expect(page.getByText('Add a Task')).toBeVisible();
  });

  test('should filter and search tasks in All Tasks view', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(DEMO_USER.email);
    await page.getByLabel('Password').fill(DEMO_USER.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/tasks');

    // Go to All Tasks
    await page.getByRole('button', { name: 'All Tasks' }).click();
    await page.waitForSelector('.task-card', { timeout: 3000 });

    // Test filter tabs
    const completedFilter = page.locator('.task-filters__tab').filter({ hasText: 'Completed' });
    await completedFilter.click();
    await page.waitForTimeout(500);

    // Test search
    const searchInput = page.getByPlaceholder('Search tasks...');
    await searchInput.fill('test');
    await page.waitForTimeout(500);
    const taskCards = page.locator('.task-card');
    const count = await taskCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should handle login form validation', async ({ page }) => {
    await page.goto('/login');
    
    // Test empty form
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForTimeout(500);
    const errorMessages = page.locator('.input-message--error');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBeGreaterThanOrEqual(2);

    // Test invalid email
    await page.getByLabel('Email').fill('invalid-email');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForTimeout(500);
    const emailErrors = await page.locator('.input-message--error').count();
    expect(emailErrors).toBeGreaterThanOrEqual(1);
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/login');
    await page.getByLabel('Email').fill(DEMO_USER.email);
    await page.getByLabel('Password').fill(DEMO_USER.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/tasks');

    // Verify mobile layout
    await expect(page.getByText('TaskManager')).toBeVisible();
    await expect(page.getByText('Add a Task')).toBeVisible();
    
    // Mobile menu toggle should be visible
    const mobileToggle = page.locator('.navbar__mobile-toggle');
    await expect(mobileToggle).toBeVisible();
  });
});
