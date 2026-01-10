import { test, expect } from '@playwright/test';

test.describe('Download Modal Flow', () => {
  test('should open download modal via URL hash', async ({ page }) => {
    await page.goto('/#download');

    // Modal should be visible
    const modal = page.locator('.modal');
    await expect(modal).toBeVisible();

    // Should show download header
    await expect(page.getByText(/download cryfs/i)).toBeVisible();
  });

  test('should display OS selection tabs', async ({ page }) => {
    await page.goto('/#download');

    await expect(page.getByText('Ubuntu')).toBeVisible();
    await expect(page.getByText('Debian')).toBeVisible();
    await expect(page.getByText('Other')).toBeVisible();
  });

  test('should show Ubuntu instructions by default', async ({ page }) => {
    await page.goto('/#download');

    // Ubuntu Easy Install should be visible
    await expect(page.getByText('Easy Install')).toBeVisible();
    await expect(page.getByText(/ubuntu 17.04 and later/i)).toBeVisible();
    await expect(page.getByText('sudo apt install cryfs')).toBeVisible();
  });

  test('should switch to Debian tab', async ({ page }) => {
    await page.goto('/#download');

    await page.getByText('Debian').click();

    // Debian instructions should be visible
    await expect(page.getByText(/debian stretch and later/i)).toBeVisible();
  });

  test('should switch to Other tab and show macOS instructions', async ({ page }) => {
    await page.goto('/#download');

    await page.getByText('Other').click();

    // macOS instructions should be visible
    await expect(page.getByText('Mac OS X')).toBeVisible();
    await expect(page.getByText('brew install --cask macfuse')).toBeVisible();
    await expect(page.getByText('brew install cryfs/tap/cryfs')).toBeVisible();
  });

  test('should show Windows instructions in Other tab', async ({ page }) => {
    await page.goto('/#download');

    await page.getByText('Other').click();

    // Windows instructions should be visible
    await expect(page.getByText('Windows')).toBeVisible();
    await expect(page.getByText(/windows support is highly experimental/i)).toBeVisible();
  });

  test('should have DokanY download link', async ({ page }) => {
    await page.goto('/#download');

    await page.getByText('Other').click();

    const dokanLink = page.getByRole('link', { name: /dokany/i });
    await expect(dokanLink).toBeVisible();
    await expect(dokanLink).toHaveAttribute('href', 'https://github.com/dokan-dev/dokany/releases');
  });

  test('should close modal when close button is clicked', async ({ page }) => {
    await page.goto('/#download');

    // Modal should be visible
    await expect(page.locator('.modal')).toBeVisible();

    // Click close button
    const closeButton = page.getByRole('button', { name: /close/i });
    await closeButton.click();

    // Modal should be hidden
    await expect(page.locator('.modal')).not.toBeVisible();
  });

  test('should update URL hash when modal closes', async ({ page }) => {
    await page.goto('/#download');

    // Close modal
    const closeButton = page.getByRole('button', { name: /close/i });
    await closeButton.click();

    // URL should no longer have #download
    await expect(page).not.toHaveURL(/#download/);
  });

  test('should display OS logos', async ({ page }) => {
    await page.goto('/#download');

    await expect(page.getByAltText('Ubuntu')).toBeVisible();
    await expect(page.getByAltText('Debian')).toBeVisible();
    await expect(page.getByAltText('Other')).toBeVisible();
  });

  test('should link to GitHub releases for older versions', async ({ page }) => {
    await page.goto('/#download');

    const releasesLink = page.getByRole('link', { name: /here/i }).filter({
      has: page.locator('[href*="github.com/cryfs/cryfs/releases"]'),
    });

    await expect(releasesLink).toBeVisible();
  });

  test('should open modal from download link on homepage', async ({ page }) => {
    await page.goto('/');

    // Click download link
    const downloadLink = page.getByRole('link', { name: /download/i }).first();
    await downloadLink.click();

    // Modal should appear
    await expect(page.locator('.modal')).toBeVisible();
    await expect(page.getByText(/download cryfs/i)).toBeVisible();
  });
});
