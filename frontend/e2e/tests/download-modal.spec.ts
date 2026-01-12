import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';

test.describe('Download Modal Flow', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }, testInfo) => {
    // Skip on mobile - Download button is hidden on mobile viewports (d-none d-lg-block)
    test.skip(testInfo.project.name.startsWith('mobile'), 'Download button not visible on mobile');
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('opens download modal when clicking Download button', async () => {
    await homePage.openDownloadModal();
    await expect(homePage.downloadModal).toBeVisible();
    await expect(homePage.downloadModal).toContainText('Download CryFS');
  });

  test('opens download modal via navigation link', async ({ page }) => {
    // Use navbar Download link to open modal
    await page.locator('nav').getByRole('link', { name: 'Download' }).click();
    await expect(homePage.downloadModal).toBeVisible();
  });

  test('shows Ubuntu tab by default', async () => {
    await homePage.openDownloadModal();
    const ubuntuTab = homePage.getDownloadTab('Ubuntu');
    await expect(ubuntuTab.locator('.nav-link')).toHaveClass(/active/);
  });

  test('navigates between OS tabs', async () => {
    await homePage.openDownloadModal();

    // Click Debian tab
    const debianTab = homePage.getDownloadTab('Debian');
    await debianTab.click();
    await expect(debianTab.locator('.nav-link')).toHaveClass(/active/);
    await expect(homePage.getDownloadTabContent()).toContainText('official Debian repositories');

    // Click Other tab
    const otherTab = homePage.getDownloadTab('Other');
    await otherTab.click();
    await expect(otherTab.locator('.nav-link')).toHaveClass(/active/);
    await expect(homePage.getDownloadTabContent()).toContainText('macOS');
  });

  test('displays Ubuntu installation instructions', async () => {
    await homePage.openDownloadModal();
    const content = homePage.getDownloadTabContent();
    await expect(content).toContainText('Easy Install');
    await expect(content).toContainText('sudo apt install cryfs');
  });

  test('displays Windows installation instructions in Other tab', async () => {
    await homePage.openDownloadModal();
    await homePage.getDownloadTab('Other').click();
    const content = homePage.getDownloadTabContent();
    await expect(content).toContainText('Windows');
    await expect(content).toContainText('DokanY');
  });

  test('displays macOS installation instructions in Other tab', async () => {
    await homePage.openDownloadModal();
    await homePage.getDownloadTab('Other').click();
    const content = homePage.getDownloadTabContent();
    await expect(content).toContainText('macOS');
    await expect(content).toContainText('brew install');
  });

  test('closes modal with Close button', async () => {
    await homePage.openDownloadModal();
    await homePage.getCloseButton().click();
    await expect(homePage.downloadModal).not.toBeVisible();
  });
});
