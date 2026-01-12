import { test, expect, Page } from '@playwright/test';

/**
 * Helper function to verify an image has actually loaded (not just present in DOM).
 * An image that failed to load will have naturalWidth = 0.
 */
async function expectImageLoaded(page: Page, altText: string) {
  const image = page.getByAltText(altText);
  await expect(image).toBeVisible();

  // Verify the image has actually loaded by checking naturalWidth
  const naturalWidth = await image.evaluate((img: HTMLImageElement) => img.naturalWidth);
  expect(naturalWidth, `Image with alt="${altText}" should have loaded (naturalWidth > 0)`).toBeGreaterThan(0);
}

test.describe('Image Display - Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('displays GitHub ribbon image', async ({ page }) => {
    await expectImageLoaded(page, 'Fork me on GitHub');
  });

  test('displays logo image on mobile viewport', async ({ page }, testInfo) => {
    // Only run on mobile projects
    test.skip(!testInfo.project.name.startsWith('mobile'), 'Logo only visible on mobile');

    await expectImageLoaded(page, 'Logo');
  });

  test('displays teaser background image on desktop', async ({ page }, testInfo) => {
    // Skip on mobile - teaser background is desktop only
    test.skip(testInfo.project.name.startsWith('mobile'), 'Teaser background only visible on desktop');

    // The desktop teaser has an image with empty alt text (decorative)
    const teaserSection = page.locator('section.d-none.d-lg-block');
    const teaserImage = teaserSection.locator('img');

    await expect(teaserImage).toBeVisible();
    const naturalWidth = await teaserImage.evaluate((img: HTMLImageElement) => img.naturalWidth);
    expect(naturalWidth, 'Desktop teaser image should have loaded').toBeGreaterThan(0);
  });
});

test.describe('Image Display - Download Modal', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    // Skip on mobile - Download button is hidden on mobile viewports
    test.skip(testInfo.project.name.startsWith('mobile'), 'Download modal not accessible on mobile');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Open download modal
    await page.locator('section').filter({ hasText: 'Keep your data safe' }).getByRole('button', { name: 'Download' }).click();
    await expect(page.locator('.modal').filter({ hasText: /Download CryFS/i })).toBeVisible();
  });

  test('displays Ubuntu OS logo', async ({ page }) => {
    await expectImageLoaded(page, 'Ubuntu');
  });

  test('displays Debian OS logo', async ({ page }) => {
    await expectImageLoaded(page, 'Debian');
  });

  test('displays Other OS logo', async ({ page }) => {
    await expectImageLoaded(page, 'Other');
  });

  test('displays all OS logos in download modal tabs', async ({ page }) => {
    // Verify all three OS logos are loaded
    const osLogos = ['Ubuntu', 'Debian', 'Other'];

    for (const os of osLogos) {
      await expectImageLoaded(page, os);
    }
  });
});

test.describe('Image Display - Comparison Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/comparison');
    await page.waitForLoadState('networkidle');
  });

  test('displays comparison header image', async ({ page }) => {
    await expectImageLoaded(page, 'Encrypting your cloud storage');
  });

  test('displays VeraCrypt logo', async ({ page }) => {
    await expectImageLoaded(page, 'VeraCrypt');
  });

  test('displays Gocryptfs logo', async ({ page }) => {
    await expectImageLoaded(page, 'Gocryptfs');
  });

  test('displays EncFS logo', async ({ page }) => {
    await expectImageLoaded(page, 'EncFS');
  });

  test('displays eCryptfs logo', async ({ page }) => {
    await expectImageLoaded(page, 'eCryptfs');
  });

  test('displays CryFS logo', async ({ page }) => {
    await expectImageLoaded(page, 'CryFS');
  });

  test('displays all encryption tool logos on comparison page', async ({ page }) => {
    const toolLogos = [
      'Encrypting your cloud storage',
      'VeraCrypt',
      'Gocryptfs',
      'EncFS',
      'eCryptfs',
      'CryFS'
    ];

    for (const logo of toolLogos) {
      await expectImageLoaded(page, logo);
    }
  });
});

test.describe('Image Display - How It Works Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/howitworks');
    await page.waitForLoadState('networkidle');
  });

  test('displays storing data diagram', async ({ page }) => {
    await expectImageLoaded(page, 'Your files, metadata and directory structure are stored as a set of same-size blocks, encrypted, and stored in the cloud.');
  });

  test('displays configuration file encryption diagram', async ({ page }) => {
    await expectImageLoaded(page, 'Configuration File Encryption Layers');
  });

  test('displays all technical diagrams', async ({ page }) => {
    const diagrams = [
      'Your files, metadata and directory structure are stored as a set of same-size blocks, encrypted, and stored in the cloud.',
      'Configuration File Encryption Layers'
    ];

    for (const diagram of diagrams) {
      await expectImageLoaded(page, diagram);
    }
  });
});

test.describe('Image Display - Cross-page Verification', () => {
  test('GitHub ribbon is visible on all main pages', async ({ page }) => {
    const pages = ['/', '/howitworks', '/tutorial', '/comparison'];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      await expectImageLoaded(page, 'Fork me on GitHub');
    }
  });
});
