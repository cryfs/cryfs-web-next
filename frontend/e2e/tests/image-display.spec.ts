import { test, expect, Locator } from '@playwright/test';
import { BasePage } from '../pages/base.page';

/**
 * Helper function to verify an image is visible and has loaded correctly.
 * Scrolls to the image to trigger lazy loading, waits for it to load,
 * then verifies naturalWidth > 0.
 */
async function expectImageLoaded(image: Locator, description: string): Promise<void> {
  // Scroll image into view to trigger lazy loading
  await image.scrollIntoViewIfNeeded();

  // Wait for the image to be visible
  await expect(image, `${description} should be visible`).toBeVisible();

  // Wait for the image to actually load (naturalWidth > 0)
  // This polls until the condition is met or times out
  await expect
    .poll(
      async () => {
        return await image.evaluate((img: HTMLImageElement) => img.naturalWidth);
      },
      {
        message: `${description} should have loaded (naturalWidth > 0)`,
        timeout: 10000,
      }
    )
    .toBeGreaterThan(0);
}

test.describe('Image Display', () => {
  let basePage: BasePage;

  test.beforeEach(({ page }) => {
    basePage = new BasePage(page);
  });

  test.describe('Homepage', () => {
    test('teaser background image loads on desktop', async ({ page }, testInfo) => {
      // Skip on mobile - teaser section uses different layout
      test.skip(testInfo.project.name.startsWith('mobile'), 'Desktop teaser not visible on mobile');

      await basePage.navigateTo('/');
      await basePage.waitForPageLoad();

      // The teaser section has a Picture component with a background image
      const teaserSection = page.locator('section').filter({ hasText: 'Encrypt your cloud storage' }).first();
      await expect(teaserSection).toBeVisible();

      // Check for the teaser image (rendered as img by next-export-optimize-images)
      const teaserImage = teaserSection.locator('img').first();
      await expectImageLoaded(teaserImage, 'Teaser background image');
    });

    test('logo image loads on mobile', async ({ page }, testInfo) => {
      // This test is for mobile where the logo is shown instead of the full teaser
      test.skip(!testInfo.project.name.startsWith('mobile'), 'Logo only visible on mobile');

      await basePage.navigateTo('/');
      await basePage.waitForPageLoad();

      const logoImage = page.locator('img[alt="Logo"]');
      await expectImageLoaded(logoImage, 'Logo image');
    });
  });

  test.describe('Comparison Page', () => {
    test.beforeEach(async () => {
      await basePage.navigateTo('/comparison');
      await basePage.waitForPageLoad();
    });

    test('main comparison diagram loads', async ({ page }) => {
      const comparisonImage = page.locator('img[alt="Encrypting your cloud storage"]');
      await expectImageLoaded(comparisonImage, 'Comparison diagram');
    });

    test('VeraCrypt image loads', async ({ page }) => {
      const veracryptImage = page.locator('img[alt="VeraCrypt"]');
      await expectImageLoaded(veracryptImage, 'VeraCrypt image');
    });

    test('gocryptfs image loads', async ({ page }) => {
      const gocryptfsImage = page.locator('img[alt="Gocryptfs"]');
      await expectImageLoaded(gocryptfsImage, 'Gocryptfs image');
    });

    test('EncFS image loads', async ({ page }) => {
      const encfsImage = page.locator('img[alt="EncFS"]');
      await expectImageLoaded(encfsImage, 'EncFS image');
    });

    test('eCryptfs image loads', async ({ page }) => {
      const ecryptfsImage = page.locator('img[alt="eCryptfs"]');
      await expectImageLoaded(ecryptfsImage, 'eCryptfs image');
    });

    test('CryFS image loads', async ({ page }) => {
      const cryfsImage = page.locator('img[alt="CryFS"]');
      await expectImageLoaded(cryfsImage, 'CryFS image');
    });

    test('all comparison page images load correctly', async ({ page }) => {
      // This is a comprehensive test that checks all images on the comparison page
      const expectedImages = [
        'Encrypting your cloud storage',
        'VeraCrypt',
        'Gocryptfs',
        'EncFS',
        'eCryptfs',
        'CryFS',
      ];

      for (const altText of expectedImages) {
        const image = page.locator(`img[alt="${altText}"]`);
        await expectImageLoaded(image, `Image with alt="${altText}"`);
      }
    });
  });

  test.describe('How It Works Page', () => {
    test.beforeEach(async () => {
      await basePage.navigateTo('/howitworks');
      await basePage.waitForPageLoad();
    });

    test('diagrams load correctly', async ({ page }) => {
      // The howitworks page has explanatory diagrams
      const images = page.locator('article img');
      const count = await images.count();

      expect(count, 'How It Works page should have images').toBeGreaterThan(0);

      // Check each image loads
      for (let i = 0; i < count; i++) {
        const image = images.nth(i);
        const altText = await image.getAttribute('alt') ?? `Image ${i + 1}`;
        await expectImageLoaded(image, `How It Works: ${altText}`);
      }
    });
  });
});
