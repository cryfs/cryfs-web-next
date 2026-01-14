import { test, expect } from '@playwright/test';

// Note: sitemap.xml is only generated during static export (npm run build).
// These tests will skip when running against the dev server.
test.describe('Sitemap', () => {
  test('sitemap.xml is served and contains valid structure', async ({ request }) => {
    const response = await request.get('/sitemap.xml');

    // Skip if sitemap doesn't exist (dev server doesn't generate it)
    test.skip(!response.ok(), 'Sitemap not available - only generated during static export');

    expect(response.headers()['content-type']).toContain('xml');

    const content = await response.text();

    // Verify XML structure
    expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(content).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(content).toContain('</urlset>');
  });

  test('sitemap.xml contains expected pages', async ({ request }) => {
    const response = await request.get('/sitemap.xml');

    // Skip if sitemap doesn't exist (dev server doesn't generate it)
    test.skip(!response.ok(), 'Sitemap not available - only generated during static export');

    const content = await response.text();

    // Check for expected page URLs
    const expectedPages = [
      'https://www.cryfs.org',
      'https://www.cryfs.org/tutorial',
      'https://www.cryfs.org/howitworks',
      'https://www.cryfs.org/comparison',
      'https://www.cryfs.org/legal_notice',
    ];

    for (const pageUrl of expectedPages) {
      expect(content).toContain(`<loc>${pageUrl}</loc>`);
    }
  });

  test('sitemap.xml excludes internal Next.js pages', async ({ request }) => {
    const response = await request.get('/sitemap.xml');

    // Skip if sitemap doesn't exist (dev server doesn't generate it)
    test.skip(!response.ok(), 'Sitemap not available - only generated during static export');

    const content = await response.text();

    // These internal pages should not be in the sitemap
    expect(content).not.toContain('/_app');
    expect(content).not.toContain('/_document');
    expect(content).not.toContain('/_error');
  });
});
