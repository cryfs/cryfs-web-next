import { Page, Route } from '@playwright/test';

const BACKEND_URL = 'https://backend.cryfs.org';

export const apiMocks = {
  newsletter: {
    success: {
      status: 200,
      body: {},
    },
    invalidEmail: {
      status: 400,
      body: { error: 'invalid-email' },
    },
    unsubscribed: {
      status: 400,
      body: { error: 'unsubscribed' },
    },
    serverError: {
      status: 500,
      body: { error: 'server-error' },
    },
  },
  contact: {
    success: {
      status: 200,
      body: {},
    },
    error: {
      status: 500,
      body: { error: 'server-error' },
    },
  },
};

export async function mockNewsletterAPI(
  page: Page,
  response: keyof typeof apiMocks.newsletter = 'success'
): Promise<void> {
  await page.route(`${BACKEND_URL}/newsletter/register`, async (route: Route) => {
    const mock = apiMocks.newsletter[response];
    await route.fulfill({
      status: mock.status,
      contentType: 'application/json',
      body: JSON.stringify(mock.body),
    });
  });
}

export async function mockContactAPI(
  page: Page,
  response: keyof typeof apiMocks.contact = 'success'
): Promise<void> {
  await page.route(`${BACKEND_URL}/contact/send`, async (route: Route) => {
    const mock = apiMocks.contact[response];
    await route.fulfill({
      status: mock.status,
      contentType: 'application/json',
      body: JSON.stringify(mock.body),
    });
  });
}

export async function mockAllAPIs(page: Page): Promise<void> {
  await mockNewsletterAPI(page, 'success');
  await mockContactAPI(page, 'success');
}
