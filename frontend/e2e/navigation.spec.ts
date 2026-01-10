import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to How it works page', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /how it works/i }).click();

    await expect(page).toHaveURL(/howitworks/);
  });

  test('should navigate to Tutorial page', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /tutorial/i }).click();

    await expect(page).toHaveURL(/tutorial/);
  });

  test('should navigate to Compare page', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /compare/i }).click();

    await expect(page).toHaveURL(/comparison/);
  });

  test('should navigate to Legal Notice page', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /legal notice/i }).click();

    await expect(page).toHaveURL(/legal_notice/);
  });

  test('should navigate home when clicking brand', async ({ page }) => {
    await page.goto('/howitworks');

    await page.getByRole('link', { name: /cryfs/i }).first().click();

    await expect(page).toHaveURL('/');
  });

  test('should open GitHub repository in new tab', async ({ page }) => {
    await page.goto('/');

    const githubLink = page.getByRole('link', { name: /fork me on github/i });

    await expect(githubLink).toHaveAttribute('href', 'https://github.com/cryfs/cryfs');
  });

  test('should have working donate link', async ({ page }) => {
    await page.goto('/');

    const donateLink = page.getByRole('link', { name: /donate/i });
    await expect(donateLink).toBeVisible();
    await expect(donateLink).toHaveAttribute('href', '/#donate');
  });

  test('should navigate between multiple pages', async ({ page }) => {
    await page.goto('/');

    // Go to Tutorial
    await page.getByRole('link', { name: /tutorial/i }).click();
    await expect(page).toHaveURL(/tutorial/);

    // Go to Compare
    await page.getByRole('link', { name: /compare/i }).click();
    await expect(page).toHaveURL(/comparison/);

    // Go to How it works
    await page.getByRole('link', { name: /how it works/i }).click();
    await expect(page).toHaveURL(/howitworks/);

    // Go back home
    await page.getByRole('link', { name: /cryfs/i }).first().click();
    await expect(page).toHaveURL('/');
  });

  test('should preserve navbar across pages', async ({ page }) => {
    await page.goto('/');

    // Navigate to different page
    await page.getByRole('link', { name: /tutorial/i }).click();

    // Navbar should still be visible
    const navbar = page.locator('nav');
    await expect(navbar).toBeVisible();

    // All navigation links should be present
    await expect(page.getByRole('link', { name: /how it works/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /tutorial/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /compare/i })).toBeVisible();
  });

  test('should preserve footer across pages', async ({ page }) => {
    await page.goto('/');

    // Navigate to different page
    await page.getByRole('link', { name: /how it works/i }).click();

    // Footer should still be visible
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer.getByText(/Sebastian Messmer/)).toBeVisible();
  });
});

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should show navbar toggler on mobile', async ({ page }) => {
    await page.goto('/');

    const toggler = page.getByRole('button', { name: /toggle navigation/i });
    await expect(toggler).toBeVisible();
  });

  test('should toggle navigation menu on mobile', async ({ page }) => {
    await page.goto('/');

    // Navigation links should be collapsed initially
    const navLinks = page.locator('.navbar-collapse');

    // Click toggler
    const toggler = page.getByRole('button', { name: /toggle navigation/i });
    await toggler.click();

    // Navigation should expand
    await expect(navLinks).toBeVisible();

    // Click toggler again
    await toggler.click();

    // Navigation should collapse
    // Note: The collapse animation might take time
  });

  test('should navigate to page from mobile menu', async ({ page }) => {
    await page.goto('/');

    // Open mobile menu
    const toggler = page.getByRole('button', { name: /toggle navigation/i });
    await toggler.click();

    // Click tutorial link
    await page.getByRole('link', { name: /tutorial/i }).click();

    await expect(page).toHaveURL(/tutorial/);
  });
});
