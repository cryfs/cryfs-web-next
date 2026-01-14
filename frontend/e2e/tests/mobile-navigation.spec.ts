import { test, expect } from '@playwright/test';
import { NavigationPage } from '../pages/navigation.page';

// Use mobile viewport for all tests in this file
test.use({ viewport: { width: 375, height: 667 } });

test.describe('Mobile Navigation Flow', () => {
  let navPage: NavigationPage;

  test.beforeEach(async ({ page }) => {
    navPage = new NavigationPage(page);
    await navPage.navigateTo('/');
    await navPage.waitForPageLoad();
  });

  test('hamburger menu is visible on mobile', async () => {
    await expect(navPage.hamburgerButton).toBeVisible();
  });

  test('navigation links are initially collapsed', async () => {
    await expect(navPage.navCollapse).not.toHaveClass(/show/);
  });

  test('toggles navigation menu on hamburger click', async () => {
    // Open menu
    await navPage.toggleMobileMenu();
    await expect(navPage.navCollapse).toHaveClass(/show/);

    // Close menu
    await navPage.toggleMobileMenu();
    await expect(navPage.navCollapse).not.toHaveClass(/show/);
  });

  test('shows navigation links when menu is open', async () => {
    await navPage.toggleMobileMenu();

    await expect(navPage.howItWorksLink).toBeVisible();
    await expect(navPage.tutorialLink).toBeVisible();
    await expect(navPage.compareLink).toBeVisible();
    await expect(navPage.downloadLink).toBeVisible();
    await expect(navPage.donateLink).toBeVisible();
  });

  test('navigates to page from mobile menu', async ({ page }) => {
    await navPage.toggleMobileMenu();
    await navPage.tutorialLink.click();

    await expect(page).toHaveURL('/tutorial');
  });
});

// Additional test for desktop - hamburger should be hidden
test.describe('Desktop Navigation', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test('hamburger menu is hidden on desktop', async ({ page }) => {
    const navPage = new NavigationPage(page);
    await navPage.navigateTo('/');
    await expect(navPage.hamburgerButton).not.toBeVisible();
  });

  test('navigation links are directly visible on desktop', async ({ page }) => {
    const navPage = new NavigationPage(page);
    await navPage.navigateTo('/');
    await expect(navPage.howItWorksLink).toBeVisible();
    await expect(navPage.tutorialLink).toBeVisible();
  });
});
