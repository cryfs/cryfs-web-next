import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { mockContactAPI } from '../fixtures/api-mocks';

test.describe('Contact Form Flow', () => {
  let homePage: HomePage;

  test.beforeEach(({ page }) => {
    homePage = new HomePage(page);
  });

  test('displays contact form', async ({ page }) => {
    await homePage.goto();
    await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();
    await expect(homePage.contactMessageInput).toBeVisible();
    await expect(homePage.contactEmailInput).toBeVisible();
    await expect(homePage.contactSubmitButton).toBeVisible();
  });

  test('shows success message on successful submission', async ({ page }) => {
    await mockContactAPI(page, 'success');
    await homePage.goto();

    await homePage.submitContactForm('This is a test message', 'test@example.com');

    await expect(homePage.contactSuccessMessage).toBeVisible();
  });

  test('shows success with message only (email optional)', async ({ page }) => {
    await mockContactAPI(page, 'success');
    await homePage.goto();

    await homePage.submitContactForm('Message without email');

    await expect(homePage.contactSuccessMessage).toBeVisible();
  });

  test('shows error for empty message', async ({ page }) => {
    await homePage.goto();

    await homePage.contactSubmitButton.click();

    await expect(page.getByText('Please enter a message to send.')).toBeVisible();
  });

  test('shows error on server failure', async ({ page }) => {
    await mockContactAPI(page, 'error');
    await homePage.goto();

    await homePage.submitContactForm('Test message');

    await expect(page.getByText(/error sending/i)).toBeVisible();
  });

  test('sends correct payload to API', async ({ page }) => {
    let capturedRequest: { email: string; message: string; token: string } | null = null;

    await page.route('**/contact/send', async (route) => {
      capturedRequest = route.request().postDataJSON() as { email: string; message: string; token: string };
      await route.fulfill({ status: 200, body: '{}' });
    });

    await homePage.goto();
    await homePage.submitContactForm('My feedback message', 'feedback@test.com');

    expect(capturedRequest).toEqual({
      email: 'feedback@test.com',
      message: 'My feedback message',
      token: '6BK2tEU6Cv',
    });
  });
});
