import { test, expect, type Page, type APIRequestContext } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/*
 * Checks that every external link the site renders actually resolves.
 *
 * This does real network requests to third party sites, so it deliberately lives outside
 * e2e/tests and is not part of `npm run test:e2e`. It runs from its own config
 * (playwright.linkcheck.config.ts) on a schedule, so an unrelated pull request never goes red
 * because somebody else's web server had a bad minute.
 *
 * Links come from the rendered DOM rather than from the source or the built bundle. The download
 * modal renders on the client and builds its URLs from VersionNumber, so those exist as complete
 * strings only once a browser has run the page.
 */

// Routes come from the pages directory so that adding a page cannot silently escape the check.
function routes(): string[] {
    const pagesDir = path.join(__dirname, '..', '..', 'pages');
    return fs
        .readdirSync(pagesDir)
        .filter((f) => /\.(tsx|mdx)$/.test(f))
        .map((f) => f.replace(/\.(tsx|mdx)$/, ''))
        .filter((name) => !name.startsWith('_') && name !== '404')
        .map((name) => (name === 'index' ? '/' : `/${name}`));
}

// Only links that leave the site. Internal routes are covered by visiting them.
async function externalLinksOn(page: Page): Promise<string[]> {
    return page.$$eval('a[href]', (anchors, origin) =>
        anchors
            .map((a) => (a as HTMLAnchorElement).href)
            .filter((href) => /^https?:/.test(href) && !href.startsWith(origin)),
        new URL(page.url()).origin
    );
}

/*
 * A link is broken when the server says the target is not there, or when we cannot reach it at all.
 * 401/403/429 mean the server recognised the URL and declined to serve us specifically, which is
 * what several sites do to automated clients. 5xx says the target is having a bad day. Neither
 * means our link is wrong, so both are reported rather than failed.
 */
async function checkLink(request: APIRequestContext, url: string): Promise<string | null> {
    const attempt = (method: 'HEAD' | 'GET') =>
        method === 'HEAD'
            ? request.head(url, { timeout: 30_000, failOnStatusCode: false })
            : request.get(url, { timeout: 30_000, failOnStatusCode: false });

    try {
        let response = await attempt('HEAD');
        // Some servers do not implement HEAD, or answer it differently from GET.
        if ([403, 404, 405, 501].includes(response.status())) {
            response = await attempt('GET');
        }
        const status = response.status();
        if (status >= 200 && status < 400) return null;
        if ([401, 403, 429].includes(status) || status >= 500) {
            console.warn(`  unverifiable (HTTP ${status}, not treated as broken): ${url}`);
            return null;
        }
        return `${url} -> HTTP ${status}`;
    } catch (error) {
        return `${url} -> ${(error as Error).message.split('\n')[0]}`;
    }
}

test('every external link the site renders resolves', async ({ page, request }) => {
    const found = new Set<string>();

    for (const route of routes()) {
        await page.goto(route);
        for (const link of await externalLinksOn(page)) found.add(link);
    }

    /*
     * The download modal renders on the client. Every OS tab's panel is in the DOM whether or not
     * it is the visible one, so its links are collected without clicking through the tabs.
     */
    await page.goto('/#download');
    await expect(page.locator('.modal').filter({ hasText: /Download CryFS/i })).toBeVisible();
    for (const link of await externalLinksOn(page)) found.add(link);

    const urls = [...found].sort();
    console.log(`Checking ${urls.length} distinct external links:\n${urls.join('\n')}`);

    /*
     * Guards, so the check cannot pass by collecting nothing. One link is asserted per download
     * tab, since those are the ones that come from client-rendered markup: the installer URL is
     * built from VersionNumber (Windows), macFUSE is the macOS prerequisite, and Homebrew is the
     * macOS install route.
     */
    expect(urls.some((u) => /releases\/download\/.+\.msi$/.test(u)), 'Windows installer link missing').toBe(true);
    expect(urls.some((u) => u.includes('dokan-dev')), 'DokanY link missing').toBe(true);
    expect(urls.some((u) => u.includes('osxfuse')), 'macFUSE link missing').toBe(true);

    const broken = (await Promise.all(urls.map((url) => checkLink(request, url)))).filter(
        (r): r is string => r !== null
    );

    expect(broken, `broken links:\n${broken.join('\n')}`).toEqual([]);
});
