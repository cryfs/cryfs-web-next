import { Router } from "next/dist/client/router";

export class RoutingListener {
    url: string
    onChangeCallbacks: ((url: string) => void | Promise<void>)[]

    constructor(initialUrl: string) {
        this.url = initialUrl
        // console.log("inital url: " + this.url)

        this.onChangeCallbacks = []

        Router.events.on('routeChangeComplete', this.handleRouteChange)
        Router.events.on('hashChangeComplete', this.handleRouteChange)
    }

    finish = () => {
        Router.events.off('routeChangeComplete', this.handleRouteChange)
        Router.events.off('hashChangeComplete', this.handleRouteChange)
    }

    handleRouteChange = (url: string) => {
        void this.onRouteChangeComplete(url)
    }

    addListener = (func: (url: string) => void | Promise<void>) => {
        this.onChangeCallbacks.push(func)
    }

    onRouteChangeComplete = async (url: string) => {
        this.url = url
        if (this.url.startsWith("http://") || this.url.startsWith("https://")) {
            // Make it a relative URL. Skip past the protocol slashes:
            // "http://".length = 7, "https://".length = 8
            const protocolLength = this.url.startsWith("https://") ? 8 : 7
            this.url = this.url.substring(this.url.indexOf('/', protocolLength))
        }

        const promises = this.onChangeCallbacks.map(async (callback) => {
            await callback(this.url)
        })
        await Promise.all(promises)
    }
}