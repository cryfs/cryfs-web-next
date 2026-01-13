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

  test('shows Linux tab by default', async () => {
    await homePage.openDownloadModal();
    const linuxTab = homePage.getDownloadTab('Linux');
    await expect(linuxTab.locator('.nav-link')).toHaveClass(/active/);
  });

  test('navigates between OS tabs', async () => {
    await homePage.openDownloadModal();

    // Linux tab is default, verify its content
    const linuxTab = homePage.getDownloadTab('Linux');
    await expect(linuxTab.locator('.nav-link')).toHaveClass(/active/);
    await expect(homePage.getDownloadTabContent()).toContainText('Debian / Ubuntu');

    // Click macOS tab
    const macosTab = homePage.getDownloadTab('macOS');
    await macosTab.click();
    await expect(macosTab.locator('.nav-link')).toHaveClass(/active/);
    await expect(homePage.getDownloadTabContent()).toContainText('Homebrew');

    // Click Windows tab
    const windowsTab = homePage.getDownloadTab('Windows');
    await windowsTab.click();
    await expect(windowsTab.locator('.nav-link')).toHaveClass(/active/);
    await expect(homePage.getDownloadTabContent()).toContainText('experimental');

    // Click back to Linux tab
    await linuxTab.click();
    await expect(linuxTab.locator('.nav-link')).toHaveClass(/active/);
    await expect(homePage.getDownloadTabContent()).toContainText('apt install cryfs');
  });

  test('displays Linux installation instructions', async () => {
    await homePage.openDownloadModal();
    const content = homePage.getDownloadTabContent();
    await expect(content).toContainText('Debian / Ubuntu');
    await expect(content).toContainText('sudo apt install cryfs');
  });

  test('displays Windows installation instructions in Windows tab', async () => {
    await homePage.openDownloadModal();
    await homePage.getDownloadTab('Windows').click();
    const content = homePage.getDownloadTabContent();
    await expect(content).toContainText('experimental');
    await expect(content).toContainText('DokanY');
  });

  test('displays macOS installation instructions in macOS tab', async () => {
    await homePage.openDownloadModal();
    await homePage.getDownloadTab('macOS').click();
    const content = homePage.getDownloadTabContent();
    await expect(content).toContainText('Homebrew');
    await expect(content).toContainText('brew install');
  });

  test('closes modal with Close button', async () => {
    await homePage.openDownloadModal();
    await homePage.getCloseButton().click();
    await expect(homePage.downloadModal).not.toBeVisible();
  });
});
