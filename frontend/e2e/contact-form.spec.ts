import { test, expect } from '@playwright/test';

test.describe('Contact Form Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display contact form', async ({ page }) => {
    const messageTextarea = page.getByPlaceholder(/your message to us/i);
    const emailInput = page.getByPlaceholder(/your email address/i);
    const sendButton = page.getByRole('button', { name: /send/i });

    await expect(messageTextarea).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(sendButton).toBeVisible();
  });

  test('should have Contact Us heading', async ({ page }) => {
    const heading = page.getByRole('heading', { name: /contact us/i });
    await expect(heading).toBeVisible();
  });

  test('should allow entering message', async ({ page }) => {
    const messageTextarea = page.getByPlaceholder(/your message to us/i);

    await messageTextarea.fill('This is a test message');

    await expect(messageTextarea).toHaveValue('This is a test message');
  });

  test('should allow entering email (optional)', async ({ page }) => {
    const emailInput = page.getByPlaceholder(/your email address/i);

    await emailInput.fill('user@example.com');

    await expect(emailInput).toHaveValue('user@example.com');
  });

  test('should indicate email is optional', async ({ page }) => {
    const emailInput = page.getByPlaceholder(/your email address/i);
    const placeholder = await emailInput.getAttribute('placeholder');

    expect(placeholder?.toLowerCase()).toContain('optional');
  });

  test('should show error when submitting empty message', async ({ page }) => {
    const sendButton = page.getByRole('button', { name: /send/i });

    await sendButton.click();

    // Should show error about empty message
    await expect(page.getByText(/please enter a message/i)).toBeVisible();
  });

  test('should show success message on successful submission', async ({ page }) => {
    // Mock successful API response
    await page.route('**/contact/send', async (route) => {
      await route.fulfill({ status: 200, body: '{}' });
    });

    const messageTextarea = page.getByPlaceholder(/your message to us/i);
    const sendButton = page.getByRole('button', { name: /send/i });

    await messageTextarea.fill('This is my feedback');
    await sendButton.click();

    // Should show success message
    await expect(page.getByText(/thank you/i).first()).toBeVisible();
  });

  test('should allow submission without email', async ({ page }) => {
    // Mock successful API response
    await page.route('**/contact/send', async (route) => {
      await route.fulfill({ status: 200, body: '{}' });
    });

    const messageTextarea = page.getByPlaceholder(/your message to us/i);
    const sendButton = page.getByRole('button', { name: /send/i });

    await messageTextarea.fill('Anonymous feedback');
    await sendButton.click();

    // Should show success message
    await expect(page.getByText(/thank you/i).first()).toBeVisible();
  });

  test('should include email in submission when provided', async ({ page }) => {
    let requestBody: any;

    // Mock API and capture request
    await page.route('**/contact/send', async (route) => {
      requestBody = JSON.parse(route.request().postData() || '{}');
      await route.fulfill({ status: 200, body: '{}' });
    });

    const messageTextarea = page.getByPlaceholder(/your message to us/i);
    const emailInput = page.getByPlaceholder(/your email address/i);
    const sendButton = page.getByRole('button', { name: /send/i });

    await messageTextarea.fill('Test message');
    await emailInput.fill('test@example.com');
    await sendButton.click();

    // Wait for request to complete
    await expect(page.getByText(/thank you/i).first()).toBeVisible();

    expect(requestBody.email).toBe('test@example.com');
    expect(requestBody.message).toBe('Test message');
  });

  test('should show error message on server error', async ({ page }) => {
    // Mock API server error
    await page.route('**/contact/send', async (route) => {
      await route.fulfill({ status: 500 });
    });

    const messageTextarea = page.getByPlaceholder(/your message to us/i);
    const sendButton = page.getByRole('button', { name: /send/i });

    await messageTextarea.fill('Test message');
    await sendButton.click();

    // Should show error message
    await expect(page.getByText(/sorry, there was an error/i)).toBeVisible();
  });

  test('should show loading state during submission', async ({ page }) => {
    // Mock the API to delay response
    await page.route('**/contact/send', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({ status: 200, body: '{}' });
    });

    const messageTextarea = page.getByPlaceholder(/your message to us/i);
    const sendButton = page.getByRole('button', { name: /send/i });

    await messageTextarea.fill('Test message');
    await sendButton.click();

    // Button should be disabled while loading
    await expect(sendButton).toBeDisabled();
  });
});
