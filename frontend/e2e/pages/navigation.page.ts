import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class NavigationPage extends BasePage {
  readonly navbar: Locator;
  readonly hamburgerButton: Locator;
  readonly navCollapse: Locator;

  readonly homeLink: Locator;
  readonly howItWorksLink: Locator;
  readonly tutorialLink: Locator;
  readonly compareLink: Locator;
  readonly downloadLink: Locator;
  readonly donateLink: Locator;
  readonly legalNoticeLink: Locator;

  constructor(page: Page) {
    super(page);

    this.navbar = page.locator('nav.navbar');
    this.hamburgerButton = page.locator('.navbar-toggler');
    this.navCollapse = page.locator('.navbar-collapse');

    this.homeLink = page.locator('.navbar-brand');
    this.howItWorksLink = page.getByRole('link', { name: 'How it works' });
    this.tutorialLink = page.locator('nav').getByRole('link', { name: 'Tutorial' });
    this.compareLink = page.getByRole('link', { name: 'Compare' });
    this.downloadLink = page.locator('nav').getByRole('link', { name: 'Download' });
    this.donateLink = page.locator('nav').getByRole('link', { name: 'Donate' });
    this.legalNoticeLink = page.getByRole('link', { name: 'Legal Notice' });
  }

  async toggleMobileMenu(): Promise<void> {
    await this.hamburgerButton.click();
  }

  async navigateToHowItWorks(): Promise<void> {
    await this.howItWorksLink.click();
    await expect(this.page).toHaveURL(/\/howitworks/);
  }

  async navigateToTutorial(): Promise<void> {
    await this.tutorialLink.click();
    await expect(this.page).toHaveURL(/\/tutorial/);
  }

  async navigateToComparison(): Promise<void> {
    await this.compareLink.click();
    await expect(this.page).toHaveURL(/\/comparison/);
  }

  async navigateToLegalNotice(): Promise<void> {
    await this.legalNoticeLink.click();
    await expect(this.page).toHaveURL(/\/legal_notice/);
  }
}
