import { generateSitemap } from './sitemap';

describe('generateSitemap', () => {
  const baseUrl = 'https://www.example.org';

  it('generates valid XML sitemap structure', () => {
    const paths = ['/'];
    const result = generateSitemap(paths, baseUrl);

    expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(result).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(result).toContain('</urlset>');
  });

  it('generates correct URL for root path', () => {
    const paths = ['/'];
    const result = generateSitemap(paths, baseUrl);

    expect(result).toContain(`<loc>${baseUrl}</loc>`);
    expect(result).not.toContain(`<loc>${baseUrl}/</loc>`);
  });

  it('generates correct URLs for non-root paths', () => {
    const paths = ['/tutorial', '/howitworks'];
    const result = generateSitemap(paths, baseUrl);

    expect(result).toContain(`<loc>${baseUrl}/tutorial</loc>`);
    expect(result).toContain(`<loc>${baseUrl}/howitworks</loc>`);
  });

  it('excludes special Next.js pages', () => {
    const paths = ['/', '/_app', '/_document', '/_error', '/404', '/500', '/tutorial'];
    const result = generateSitemap(paths, baseUrl);

    expect(result).toContain(`<loc>${baseUrl}</loc>`);
    expect(result).toContain(`<loc>${baseUrl}/tutorial</loc>`);
    expect(result).not.toContain('_app');
    expect(result).not.toContain('_document');
    expect(result).not.toContain('_error');
    expect(result).not.toContain('/404');
    expect(result).not.toContain('/500');
  });

  it('handles empty paths array', () => {
    const paths: string[] = [];
    const result = generateSitemap(paths, baseUrl);

    expect(result).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(result).toContain('</urlset>');
    expect(result).not.toContain('<url>');
  });

  it('generates sitemap with multiple pages', () => {
    const paths = ['/', '/tutorial', '/howitworks', '/comparison', '/legal_notice'];
    const result = generateSitemap(paths, baseUrl);

    const urlCount = (result.match(/<url>/g) || []).length;
    expect(urlCount).toBe(5);
  });
});
