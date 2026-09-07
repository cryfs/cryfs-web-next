import { defineConfig, devices } from '@playwright/test';

/*
 * Config for the external link check (e2e/link-check).
 *
 * Kept separate from playwright.config.ts on purpose. That suite runs on every pull request across
 * five browser projects; these tests talk to third party servers, so running them there would make
 * unrelated pull requests fail whenever somebody else's site is briefly unreachable, five times over.
 * This one runs on a schedule instead, in a single browser, since link rot is not browser specific.
 */
export default defineConfig({
  testDir: './e2e/link-check',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  // Retry the whole check rather than let one dropped connection report a broken link.
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 3 * 60 * 1000,
  reporter: process.env.CI ? [['list'], ['github']] : [['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'link-check',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
