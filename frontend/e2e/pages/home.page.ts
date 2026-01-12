import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  // Teaser section
  readonly downloadButton: Locator;
  readonly tutorialButton: Locator;

  // Newsletter section
  readonly newsletterEmailInput: Locator;
  readonly newsletterSubmitButton: Locator;
  readonly newsletterSuccessMessage: Locator;

  // Contact section
  readonly contactMessageInput: Locator;
  readonly contactEmailInput: Locator;
  readonly contactSubmitButton: Locator;
  readonly contactSuccessMessage: Locator;

  // Modals
  readonly downloadModal: Locator;
  readonly donateModal: Locator;

  constructor(page: Page) {
    super(page);

    // Teaser buttons (desktop)
    this.downloadButton = page.locator('section').filter({ hasText: 'Encrypt your files before' }).getByRole('button', { name: 'Download' });
    this.tutorialButton = page.locator('section').filter({ hasText: 'Encrypt your files before' }).getByRole('button', { name: 'Tutorial' });

    // Newsletter
    this.newsletterEmailInput = page.locator('#inputEmail');
    this.newsletterSubmitButton = page.getByRole('button', { name: /get notified/i });
    this.newsletterSuccessMessage = page.getByText("Thank you. You'll get a confirmation email shortly.");

    // Contact
    this.contactMessageInput = page.locator('#contact_form_message');
    this.contactEmailInput = page.locator('#contact_form_email');
    this.contactSubmitButton = page.getByRole('button', { name: /^send$/i });
    this.contactSuccessMessage = page.getByText('Thank you.', { exact: true });

    // Modals
    this.downloadModal = page.locator('.modal').filter({ hasText: /Download CryFS/i });
    this.donateModal = page.locator('.modal').filter({ has: page.locator('iframe') });
  }

  async goto(): Promise<void> {
    await this.navigateTo('/');
    await this.waitForPageLoad();
  }

  async openDownloadModal(): Promise<void> {
    await this.downloadButton.click();
    await expect(this.downloadModal).toBeVisible();
  }

  async openDonateModal(): Promise<void> {
    await this.page.goto('/#donate');
    await expect(this.donateModal).toBeVisible();
  }

  async submitNewsletter(email: string): Promise<void> {
    await this.newsletterEmailInput.fill(email);
    await this.newsletterSubmitButton.click();
  }

  async submitContactForm(message: string, email?: string): Promise<void> {
    await this.contactMessageInput.fill(message);
    if (email) {
      await this.contactEmailInput.fill(email);
    }
    await this.contactSubmitButton.click();
  }

  // Download modal helpers
  getDownloadTab(tabName: 'Ubuntu' | 'Debian' | 'Other'): Locator {
    return this.downloadModal.locator('.nav-item').filter({ hasText: tabName });
  }

  getDownloadTabContent(): Locator {
    return this.downloadModal.locator('.tab-pane.active');
  }

  getCloseButton(): Locator {
    // Target the Close button in the modal footer (not the X button in header)
    return this.downloadModal.locator('.modal-footer').getByRole('button', { name: 'Close' });
  }
}
