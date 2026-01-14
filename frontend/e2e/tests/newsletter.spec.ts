import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { mockNewsletterAPI } from '../fixtures/api-mocks';

test.describe('Newsletter Signup Flow', () => {
  let homePage: HomePage;

  test.beforeEach(({ page }) => {
    homePage = new HomePage(page);
  });

  test('displays newsletter signup form', async ({ page }) => {
    await homePage.goto();
    await expect(page.getByRole('heading', { name: /stay updated/i })).toBeVisible();
    await expect(homePage.newsletterEmailInput).toBeVisible();
    await expect(homePage.newsletterSubmitButton).toBeVisible();
  });

  test('shows success message on successful subscription', async ({ page }) => {
    await mockNewsletterAPI(page, 'success');
    await homePage.goto();

    await homePage.submitNewsletter('test@example.com');

    await expect(homePage.newsletterSuccessMessage).toBeVisible();
  });

  test('shows error for invalid email', async ({ page }) => {
    await mockNewsletterAPI(page, 'invalidEmail');
    await homePage.goto();

    await homePage.submitNewsletter('invalid-email');

    await expect(page.getByText('Invalid email address.')).toBeVisible();
  });

  test('shows error for previously unsubscribed email', async ({ page }) => {
    await mockNewsletterAPI(page, 'unsubscribed');
    await homePage.goto();

    await homePage.submitNewsletter('unsubscribed@example.com');

    await expect(page.getByText(/unsubscribed before/i)).toBeVisible();
  });

  test('shows error on server failure', async ({ page }) => {
    await mockNewsletterAPI(page, 'serverError');
    await homePage.goto();

    await homePage.submitNewsletter('test@example.com');

    await expect(page.getByText(/error occurred/i)).toBeVisible();
  });

  test('sends correct payload to API', async ({ page }) => {
    let capturedRequest: { email: string; token: string } | null = null;

    await page.route('**/newsletter/register', async (route) => {
      capturedRequest = route.request().postDataJSON() as { email: string; token: string };
      await route.fulfill({ status: 200, body: '{}' });
    });

    await homePage.goto();
    await homePage.submitNewsletter('user@test.com');

    expect(capturedRequest).toEqual({
      email: 'user@test.com',
      token: 'fd0kAn1zns',
    });
  });
});
