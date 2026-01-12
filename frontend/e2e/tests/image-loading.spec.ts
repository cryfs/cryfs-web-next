import { test, expect, Locator } from '@playwright/test';
import { HomePage } from '../pages/home.page';

/**
 * Helper function to check if an image has loaded successfully.
 * An image is considered loaded if it has naturalWidth and naturalHeight > 0.
 */
async function expectImageLoaded(image: Locator): Promise<void> {
  // Wait for image to be visible first
  await expect(image).toBeVisible();

  // Check that the image has actually loaded (naturalWidth/Height > 0)
  const isLoaded = await image.evaluate((img: HTMLImageElement) => {
    return img.complete && img.naturalWidth > 0 && img.naturalHeight > 0;
  });

  expect(isLoaded).toBe(true);
}

test.describe('Image Loading', () => {
  test.describe('Homepage Images', () => {
    test('teaser background image loads on desktop', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name.startsWith('mobile'), 'Desktop teaser not shown on mobile');

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // The teaser section has a background image
      const teaserImage = page.locator('section').filter({ hasText: 'Keep your data safe' }).locator('img').first();
      await expectImageLoaded(teaserImage);
    });

    test('logo image loads on mobile', async ({ page }, testInfo) => {
      test.skip(!testInfo.project.name.startsWith('mobile'), 'Mobile logo only shown on mobile');

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // On mobile, a logo image is shown
      const logoImage = page.locator('img[alt="Logo"]');
      await expectImageLoaded(logoImage);
    });

    test('GitHub ribbon image loads', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name.startsWith('mobile'), 'GitHub ribbon not shown on mobile');

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const githubRibbon = page.locator('img[alt="Fork me on GitHub"]');
      await expectImageLoaded(githubRibbon);
    });
  });

  test.describe('Download Modal Images', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }, testInfo) => {
      test.skip(testInfo.project.name.startsWith('mobile'), 'Download modal tabs differ on mobile');
      homePage = new HomePage(page);
      await homePage.goto();
    });

    test('Ubuntu logo loads in download modal', async ({ page }) => {
      await homePage.openDownloadModal();

      const ubuntuLogo = page.locator('img[alt="Ubuntu"]');
      await expectImageLoaded(ubuntuLogo);
    });

    test('Debian logo loads in download modal', async ({ page }) => {
      await homePage.openDownloadModal();

      // Click on Debian tab to ensure image is visible
      await homePage.getDownloadTab('Debian').click();

      const debianLogo = page.locator('img[alt="Debian"]');
      await expectImageLoaded(debianLogo);
    });

    test('Other OS logo loads in download modal', async ({ page }) => {
      await homePage.openDownloadModal();

      // Click on Other tab to ensure image is visible
      await homePage.getDownloadTab('Other').click();

      const otherLogo = page.locator('img[alt="Other"]');
      await expectImageLoaded(otherLogo);
    });
  });

  test.describe('Comparison Page Images', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/comparison');
      await page.waitForLoadState('networkidle');
    });

    test('comparison diagram image loads', async ({ page }) => {
      const comparisonImage = page.locator('img[alt="Encrypting your Dropbox"]');
      await expectImageLoaded(comparisonImage);
    });

    test('VeraCrypt logo loads', async ({ page }) => {
      const veracryptLogo = page.locator('img[alt="VeraCrypt"]');
      await expectImageLoaded(veracryptLogo);
    });

    test('gocryptfs logo loads', async ({ page }) => {
      const gocryptfsLogo = page.locator('img[alt="gocryptfs"]');
      await expectImageLoaded(gocryptfsLogo);
    });

    test('EncFS logo loads', async ({ page }) => {
      const encfsLogo = page.locator('img[alt="EncFS"]');
      await expectImageLoaded(encfsLogo);
    });

    test('eCryptfs logo loads', async ({ page }) => {
      const ecryptfsLogo = page.locator('img[alt="eCryptfs"]');
      await expectImageLoaded(ecryptfsLogo);
    });
  });

  test.describe('How It Works Page Images', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/howitworks');
      await page.waitForLoadState('networkidle');
    });

    test('config file encryption diagram loads', async ({ page }) => {
      const configImage = page.locator('img[alt="Config File Encryption"]');
      await expectImageLoaded(configImage);
    });

    test('storing data diagram loads', async ({ page }) => {
      const storingDataImage = page.locator('img[alt="Storing Data"]');
      await expectImageLoaded(storingDataImage);
    });
  });

  test.describe('Critical Images Across Pages', () => {
    const pagesToTest = [
      { path: '/', name: 'Homepage' },
      { path: '/comparison', name: 'Comparison' },
      { path: '/howitworks', name: 'How It Works' },
      { path: '/tutorial', name: 'Tutorial' },
    ];

    for (const pageInfo of pagesToTest) {
      test(`all visible images load on ${pageInfo.name} page`, async ({ page }) => {
        await page.goto(pageInfo.path);
        await page.waitForLoadState('networkidle');

        // Get all visible img elements
        const images = page.locator('img:visible');
        const imageCount = await images.count();

        // Check each visible image has loaded
        for (let i = 0; i < imageCount; i++) {
          const img = images.nth(i);
          const alt = await img.getAttribute('alt') ?? `image ${i}`;
          const src = await img.getAttribute('src') ?? 'unknown src';

          const isLoaded = await img.evaluate((el: HTMLImageElement) => {
            return el.complete && el.naturalWidth > 0 && el.naturalHeight > 0;
          });

          expect(isLoaded, `Image "${alt}" (${src}) should be loaded`).toBe(true);
        }
      });
    }
  });
});
