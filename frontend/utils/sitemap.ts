const SITEMAP_EXCLUDED_PATHS = ['/_app', '/_document', '/_error', '/404', '/500'];

/**
 * Generates a sitemap XML string from a list of page paths.
 * @param paths - Array of page paths (e.g., ['/', '/tutorial', '/howitworks'])
 * @param baseUrl - Base URL of the site (e.g., 'https://www.cryfs.org')
 * @returns XML string for the sitemap
 */
export function generateSitemap(paths: string[], baseUrl: string): string {
  const filteredPaths = paths.filter(path => !SITEMAP_EXCLUDED_PATHS.includes(path));

  const urls = filteredPaths
    .map(path => {
      const loc = path === '/' ? baseUrl : `${baseUrl}${path}`;
      return `  <url>\n    <loc>${loc}</loc>\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}
