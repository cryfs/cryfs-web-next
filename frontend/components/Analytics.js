"use strict";

import { GoogleAnalyticsRoot, logGoogleAnalyticsPageview, logGoogleAnalyticsEvent } from './GoogleAnalytics'
import { logFacebookPageview, logFacebookEvent } from './Facebook'
import {RoutingListener} from "./RoutingListener";
import {withRouter} from "next/dist/client/router";
import React from 'react';

// TODO Log copying the download instruction command (and check we didn't miss any other events from the old Ruby implementation)

export const logAnalyticsEvent = async (category, action) => {
    logGoogleAnalyticsEvent(category, action)
    await logFacebookEvent(`${category}__${action}`)
}

class AnalyticsSetup_ extends React.Component {
    constructor(props) {
        super(props)

        this.routingListener = new RoutingListener(props.router.asPath)
        this.routingListener.addListener(this.onRouteChangeComplete)
    }

    componentWillUnmount = () => {
        this.routingListener.finish()
    }

    onRouteChangeComplete = async (url) => {
        // Log page view
        // TODO This logs the correct page url but the old page title because page title updates are too slow
        logGoogleAnalyticsPageview(url)
        await logFacebookPageview()
    }

    render = () => (
        <GoogleAnalyticsRoot />
    )
}

export const AnalyticsSetup = withRouter(AnalyticsSetup_)
