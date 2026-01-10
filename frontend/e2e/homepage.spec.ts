import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/CryFS/);
  });

  test('should display the navbar', async ({ page }) => {
    const navbar = page.locator('nav');
    await expect(navbar).toBeVisible();
  });

  test('should display the CryFS brand in navbar', async ({ page }) => {
    const brand = page.getByRole('link', { name: /cryfs/i }).first();
    await expect(brand).toBeVisible();
  });

  test('should display navigation links', async ({ page }) => {
    await expect(page.getByRole('link', { name: /how it works/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /tutorial/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /compare/i })).toBeVisible();
  });

  test('should display the GitHub ribbon', async ({ page }) => {
    const githubRibbon = page.getByAltText(/fork me on github/i);
    await expect(githubRibbon).toBeVisible();
  });

  test('should display the footer', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(page.getByText(/Sebastian Messmer/)).toBeVisible();
  });

  test('should display legal notice link in footer', async ({ page }) => {
    const legalNotice = page.getByRole('link', { name: /legal notice/i });
    await expect(legalNotice).toBeVisible();
  });

  test('should display newsletter signup section', async ({ page }) => {
    const newsletterSection = page.getByText(/get notified when there are updates/i);
    await expect(newsletterSection).toBeVisible();
  });

  test('should display contact section', async ({ page }) => {
    const contactSection = page.getByRole('heading', { name: /contact us/i });
    await expect(contactSection).toBeVisible();
  });

  test('should have a download button/link', async ({ page }) => {
    const downloadLink = page.getByRole('link', { name: /download/i }).first();
    await expect(downloadLink).toBeVisible();
  });

  test('should have proper meta description', async ({ page }) => {
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);
  });
});
