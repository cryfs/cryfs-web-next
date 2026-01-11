import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { NavigationPage } from '../pages/navigation.page';

test.describe('Donate Modal Flow', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test('opens donate modal via URL hash', async ({ page }) => {
    await page.goto('/#donate');
    await expect(homePage.donateModal).toBeVisible();
  });

  test('opens donate modal via navigation link', async ({ page }, testInfo) => {
    // Skip on mobile - nav links are collapsed, use hamburger menu test instead
    test.skip(testInfo.project.name.startsWith('mobile'), 'Nav links require hamburger menu on mobile');
    await homePage.goto();
    await page.locator('nav').getByRole('link', { name: 'Donate' }).click();
    await expect(homePage.donateModal).toBeVisible();
  });

  test('opens donate modal via mobile navigation', async ({ page }, testInfo) => {
    // Only run on mobile
    test.skip(!testInfo.project.name.startsWith('mobile'), 'Mobile-specific test');
    const navPage = new NavigationPage(page);
    await navPage.navigateTo('/');
    await navPage.waitForPageLoad();
    await navPage.toggleMobileMenu();
    await navPage.donateLink.click();
    await expect(homePage.donateModal).toBeVisible();
  });

  test('contains Donorbox iframe', async ({ page }) => {
    await page.goto('/#donate');
    await expect(page.locator('iframe')).toBeVisible();
  });

  test('iframe has correct source URL', async ({ page }) => {
    await page.goto('/#donate');
    const iframe = page.locator('iframe');
    await expect(iframe).toHaveAttribute('src', /donorbox\.org/);
  });

  test('closes modal when navigating away', async ({ page }) => {
    await page.goto('/#donate');
    await expect(homePage.donateModal).toBeVisible();

    await page.goto('/');
    await expect(homePage.donateModal).not.toBeVisible();
  });
});
