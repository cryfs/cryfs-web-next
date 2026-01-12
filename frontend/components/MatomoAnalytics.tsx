import Script from 'next/script'

const matomo_analytics_init = `
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

export const logMatomoAnalyticsPageview = (path: string) => {
    // @ts-ignore
    window._paq.push(['setCustomUrl', path])
    // @ts-ignore
    window._paq.push(['trackPageView', path])
}

export const MatomoAnalyticsRoot = () => (
    <>
        <Script id="matomo_analytics_init">{matomo_analytics_init}</Script>
    </>
)
