import { GoogleAnalyticsRoot, logGoogleAnalyticsPageview, logGoogleAnalyticsEvent } from './GoogleAnalytics';
import { MatomoAnalyticsRoot, logMatomoAnalyticsPageview, logMatomoAnalyticsEvent } from './MatomoAnalytics';
import { RoutingListener } from "./RoutingListener";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from 'react';

// TODO Log copying the download instruction command (and check we didn't miss any other events from the old Ruby implementation)

export const logAnalyticsEvent = async (category: string, action: string): Promise<void> => {
    logGoogleAnalyticsEvent(category, action);
    logMatomoAnalyticsEvent(category, action);
};

export function AnalyticsSetup() {
    const router = useRouter();
    const routingListenerRef = useRef<RoutingListener | null>(null);

    useEffect(() => {
        const onRouteChangeComplete = async (url: string) => {
            // Log page view
            // TODO This logs the correct page url but the old page title because page title updates are too slow
            logGoogleAnalyticsPageview(url);
            logMatomoAnalyticsPageview(url);
        };

        routingListenerRef.current = new RoutingListener(router.asPath);
        routingListenerRef.current.addListener(onRouteChangeComplete);

        return () => {
            if (routingListenerRef.current) {
                routingListenerRef.current.finish();
            }
        };
    }, [router.asPath]);

    return (
        <>
            <GoogleAnalyticsRoot />
            <MatomoAnalyticsRoot />
        </>
    );
}
