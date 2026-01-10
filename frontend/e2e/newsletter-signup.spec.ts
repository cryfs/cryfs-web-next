import { test, expect } from '@playwright/test';

test.describe('Newsletter Signup Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display newsletter signup form', async ({ page }) => {
    const emailInput = page.getByPlaceholder(/enter email/i);
    const submitButton = page.getByRole('button', { name: /get notified/i });

    await expect(emailInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('should allow entering email address', async ({ page }) => {
    const emailInput = page.getByPlaceholder(/enter email/i);

    await emailInput.fill('test@example.com');

    await expect(emailInput).toHaveValue('test@example.com');
  });

  test('should have email input with correct type', async ({ page }) => {
    const emailInput = page.getByPlaceholder(/enter email/i);

    await expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('should have required email input', async ({ page }) => {
    const emailInput = page.getByPlaceholder(/enter email/i);

    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('should show loading state when submitting', async ({ page }) => {
    // Mock the API to delay response
    await page.route('**/newsletter/register', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({ status: 200 });
    });

    const emailInput = page.getByPlaceholder(/enter email/i);
    const submitButton = page.getByRole('button', { name: /get notified/i });

    await emailInput.fill('test@example.com');
    await submitButton.click();

    // Button should be disabled while loading
    await expect(submitButton).toBeDisabled();
  });

  test('should show success message on successful signup', async ({ page }) => {
    // Mock successful API response
    await page.route('**/newsletter/register', async (route) => {
      await route.fulfill({ status: 200, body: '{}' });
    });

    const emailInput = page.getByPlaceholder(/enter email/i);
    const submitButton = page.getByRole('button', { name: /get notified/i });

    await emailInput.fill('test@example.com');
    await submitButton.click();

    // Should show success message
    await expect(page.getByText(/confirmation email/i)).toBeVisible();
  });

  test('should show error message for invalid email', async ({ page }) => {
    // Mock API error response for invalid email
    await page.route('**/newsletter/register', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'invalid-email' }),
      });
    });

    const emailInput = page.getByPlaceholder(/enter email/i);
    const submitButton = page.getByRole('button', { name: /get notified/i });

    await emailInput.fill('invalid-email');
    await submitButton.click();

    // Should show error message
    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });

  test('should show error message for unsubscribed users', async ({ page }) => {
    // Mock API error response for unsubscribed
    await page.route('**/newsletter/register', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'unsubscribed' }),
      });
    });

    const emailInput = page.getByPlaceholder(/enter email/i);
    const submitButton = page.getByRole('button', { name: /get notified/i });

    await emailInput.fill('unsubscribed@example.com');
    await submitButton.click();

    // Should show unsubscribed error message
    await expect(page.getByText(/unsubscribed before/i)).toBeVisible();
  });

  test('should show generic error message on server error', async ({ page }) => {
    // Mock API server error
    await page.route('**/newsletter/register', async (route) => {
      await route.fulfill({ status: 500 });
    });

    const emailInput = page.getByPlaceholder(/enter email/i);
    const submitButton = page.getByRole('button', { name: /get notified/i });

    await emailInput.fill('test@example.com');
    await submitButton.click();

    // Should show generic error message
    await expect(page.getByText(/an error occurred/i)).toBeVisible();
  });

  test('should re-enable button after submission completes', async ({ page }) => {
    // Mock successful API response
    await page.route('**/newsletter/register', async (route) => {
      await route.fulfill({ status: 200, body: '{}' });
    });

    const emailInput = page.getByPlaceholder(/enter email/i);
    const submitButton = page.getByRole('button', { name: /get notified/i });

    await emailInput.fill('test@example.com');
    await submitButton.click();

    // Wait for success message and button to re-enable
    await expect(page.getByText(/confirmation email/i)).toBeVisible();
    await expect(submitButton).not.toBeDisabled();
  });
});
