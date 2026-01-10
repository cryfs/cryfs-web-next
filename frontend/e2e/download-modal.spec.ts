import { test, expect } from '@playwright/test';

test.describe('Download Modal Flow', () => {
  test('should open download modal via URL hash', async ({ page }) => {
    await page.goto('/#download');

    // Modal should be visible
    const modal = page.locator('.modal');
    await expect(modal).toBeVisible();

    // Should show download header
    await expect(modal.getByText(/download cryfs/i)).toBeVisible();
  });

  test('should display OS selection tabs', async ({ page }) => {
    await page.goto('/#download');

    const modal = page.locator('.modal');
    // Check for tab elements with OS names
    await expect(modal.getByRole('tab', { name: /ubuntu/i })).toBeVisible();
    await expect(modal.getByRole('tab', { name: /debian/i })).toBeVisible();
    await expect(modal.getByRole('tab', { name: /other/i })).toBeVisible();
  });

  test('should show Ubuntu instructions by default', async ({ page }) => {
    await page.goto('/#download');

    const modal = page.locator('.modal');
    // Ubuntu Easy Install should be visible
    await expect(modal.getByText('Easy Install').first()).toBeVisible();
    await expect(modal.getByText(/ubuntu 17.04 and later/i)).toBeVisible();
    await expect(modal.getByText('sudo apt install cryfs').first()).toBeVisible();
  });

  test('should switch to Debian tab', async ({ page }) => {
    await page.goto('/#download');

    const modal = page.locator('.modal');
    await modal.getByRole('tab', { name: /debian/i }).click();

    // Debian instructions should be visible
    await expect(modal.getByText(/debian stretch and later/i)).toBeVisible();
  });

  test('should switch to Other tab and show macOS instructions', async ({ page }) => {
    await page.goto('/#download');

    const modal = page.locator('.modal');
    await modal.getByRole('tab', { name: /other/i }).click();

    // macOS instructions should be visible
    await expect(modal.getByText('Mac OS X').first()).toBeVisible();
    await expect(modal.getByText('brew install --cask macfuse').first()).toBeVisible();
    await expect(modal.getByText('brew install cryfs/tap/cryfs').first()).toBeVisible();
  });

  test('should show Windows instructions in Other tab', async ({ page }) => {
    await page.goto('/#download');

    const modal = page.locator('.modal');
    await modal.getByRole('tab', { name: /other/i }).click();

    // Windows instructions should be visible
    await expect(modal.getByText('Windows').first()).toBeVisible();
    await expect(modal.getByText(/windows support is highly experimental/i)).toBeVisible();
  });

  test('should have DokanY download link', async ({ page }) => {
    await page.goto('/#download');

    const modal = page.locator('.modal');
    await modal.getByRole('tab', { name: /other/i }).click();

    const dokanLink = modal.getByRole('link', { name: /dokany/i });
    await expect(dokanLink).toBeVisible();
    await expect(dokanLink).toHaveAttribute('href', 'https://github.com/dokan-dev/dokany/releases');
  });

  test('should close modal when close button is clicked', async ({ page }) => {
    await page.goto('/#download');

    // Modal should be visible
    const modal = page.locator('.modal');
    await expect(modal).toBeVisible();

    // Click close button
    const closeButton = modal.getByRole('button', { name: /close/i });
    await closeButton.click();

    // Modal should be hidden
    await expect(modal).not.toBeVisible();
  });

  test('should update URL hash when modal closes', async ({ page }) => {
    await page.goto('/#download');

    const modal = page.locator('.modal');
    // Close modal
    const closeButton = modal.getByRole('button', { name: /close/i });
    await closeButton.click();

    // URL should no longer have #download
    await expect(page).not.toHaveURL(/#download/);
  });

  test('should display OS logos', async ({ page }) => {
    await page.goto('/#download');

    const modal = page.locator('.modal');
    await expect(modal.getByAltText('Ubuntu')).toBeVisible();
    await expect(modal.getByAltText('Debian')).toBeVisible();
    await expect(modal.getByAltText('Other')).toBeVisible();
  });

  test('should link to GitHub releases for older versions', async ({ page }) => {
    await page.goto('/#download');

    const modal = page.locator('.modal');
    const releasesLink = modal.locator('a[href*="github.com/cryfs/cryfs/releases"]');
    await expect(releasesLink.first()).toBeVisible();
  });

  test('should open modal from download link on homepage', async ({ page }) => {
    await page.goto('/');

    // Click download link
    const downloadLink = page.getByRole('link', { name: /download/i }).first();
    await downloadLink.click();

    // Modal should appear
    const modal = page.locator('.modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByText(/download cryfs/i)).toBeVisible();
  });
});
