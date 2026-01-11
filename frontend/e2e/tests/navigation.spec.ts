import { test, expect } from '@playwright/test';
import { NavigationPage } from '../pages/navigation.page';

test.describe('Page Navigation Flow', () => {
  let navPage: NavigationPage;

  test.beforeEach(async ({ page }, testInfo) => {
    // Skip on mobile - nav links are collapsed in hamburger menu, see mobile-navigation.spec.ts
    test.skip(testInfo.project.name.startsWith('mobile'), 'Nav links require hamburger menu on mobile');
    navPage = new NavigationPage(page);
    await navPage.navigateTo('/');
    await navPage.waitForPageLoad();
  });

  test('navigates from Home to Tutorial', async ({ page }) => {
    await navPage.navigateToTutorial();
    await expect(page).toHaveURL('/tutorial');
    await expect(page.getByRole('heading', { name: 'Tutorial', level: 1 })).toBeVisible();
  });

  test('navigates from Home to How it Works', async ({ page }) => {
    await navPage.navigateToHowItWorks();
    await expect(page).toHaveURL('/howitworks');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/how/i);
  });

  test('navigates from Home to Comparison', async ({ page }) => {
    await navPage.navigateToComparison();
    await expect(page).toHaveURL('/comparison');
  });

  test('navigates from Home to Legal Notice', async ({ page }) => {
    await navPage.navigateToLegalNotice();
    await expect(page).toHaveURL('/legal_notice');
  });

  test('navigates back to Home using brand link', async ({ page }) => {
    await navPage.navigateToTutorial();
    await navPage.homeLink.click();
    await expect(page).toHaveURL('/');
  });

  test('all navigation links are present', async () => {
    await expect(navPage.howItWorksLink).toBeVisible();
    await expect(navPage.tutorialLink).toBeVisible();
    await expect(navPage.compareLink).toBeVisible();
    await expect(navPage.donateLink).toBeVisible();
  });
});
