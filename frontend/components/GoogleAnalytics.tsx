import Head from 'next/head'

const google_analytics_id = "UA-65863982-1"
const google_analytics_init = (
	`window.dataLayer = window.dataLayer || [];` +
	`window.gtag = function(){dataLayer.push(arguments);};` +
	`window.gtag('js', new Date());` +
	`window.gtag('config', '${google_analytics_id}');`
)

export const logGoogleAnalyticsEvent = (category: string, action: string) => {
	window.gtag('event', action, {
		'event_category': category,
	})
}

export const logGoogleAnalyticsPageview = (path: string) => {
	window.gtag('config', google_analytics_id, {
		'page_path': path,
	})
	window.gtag('event', 'page_view')
}

export const GoogleAnalyticsRoot = () => (
	<Head>
		<script dangerouslySetInnerHTML={{
			__html: google_analytics_init
		}} />
		<script async defer src={`https://www.googletagmanager.com/gtag/js?id=${google_analytics_id}`} />
	</Head>
)
