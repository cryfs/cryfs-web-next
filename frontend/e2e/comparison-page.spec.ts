import { test, expect } from '@playwright/test';

test.describe('Comparison Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/comparison');
  });

  test('should load the comparison page', async ({ page }) => {
    await expect(page).toHaveURL(/comparison/);
  });

  test('should display page heading', async ({ page }) => {
    // The page should have some heading about comparison/alternatives
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('should display comparison table', async ({ page }) => {
    // Look for a table element
    const table = page.locator('table').first();
    await expect(table).toBeVisible();
  });

  test('should display CryFS in the comparison', async ({ page }) => {
    // CryFS should be in the comparison table
    const table = page.locator('table');
    await expect(table.getByText('CryFS').first()).toBeVisible();
  });

  test('should display alternative encryption tools', async ({ page }) => {
    // Common alternatives that might be compared
    const possibleAlternatives = ['EncFS', 'eCryptfs', 'VeraCrypt', 'gocryptfs'];

    let foundAlternative = false;
    for (const alt of possibleAlternatives) {
      const element = page.getByText(alt, { exact: true });
      if (await element.count() > 0) {
        foundAlternative = true;
        break;
      }
    }

    expect(foundAlternative).toBe(true);
  });

  test('should have navigation available', async ({ page }) => {
    const navbar = page.locator('nav');
    await expect(navbar).toBeVisible();
  });

  test('should be able to navigate back to homepage', async ({ page }) => {
    await page.getByRole('link', { name: /cryfs/i }).first().click();
    await expect(page).toHaveURL('/');
  });

  test('should display footer', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('should have proper page title', async ({ page }) => {
    await expect(page).toHaveTitle(/./);
  });
});
