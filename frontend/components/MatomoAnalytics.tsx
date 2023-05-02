"use strict";

import Head from 'next/head'

const google_analytics_id = "UA-65863982-1"
const google_analytics_init = `
    var _paq = window._paq = window._paq || [];
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    (function() {
        var u="https://cryfs.matomo.cloud/";
        _paq.push(['setTrackerUrl', u+'matomo.php']);
        _paq.push(['setSiteId', '1']);
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.async=true; g.src='//cdn.matomo.cloud/cryfs.matomo.cloud/matomo.js'; s.parentNode.insertBefore(g,s);
    })();
`

export const logMatomoAnalyticsEvent = (category: string, action: string) => {
    // @ts-ignore
    window._paq.push(['trackEvent', category, action])
}

export const logMatomoAnalyticsPageview = (pah: string) => {
    // @ts-ignore
    window._paq.push(['trackPageView', path]);
    // window.gtag('config', google_analytics_id, {
    //     'page_path': path,
    // })
    // window.gtag('event', 'page_view')
}

export const MatomoAnalyticsRoot = () => (
    <Head>
        <script dangerouslySetInnerHTML={{
            __html: google_analytics_init
        }} />
    </Head>
)
