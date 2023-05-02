import { Router } from "next/dist/client/router";

export class RoutingListener {
    url: string
    onChangeCallbacks: ((url: string) => Promise<void>)[]

    constructor(initialUrl: string) {
        this.url = initialUrl
        // console.log("inital url: " + this.url)

        this.onChangeCallbacks = []

        Router.events.on('routeChangeComplete', this.onRouteChangeComplete)
        Router.events.on('hashChangeComplete', this.onRouteChangeComplete)
    }

    finish = () => {
        Router.events.off('routeChangeComplete', this.onRouteChangeComplete)
        Router.events.off('hashChangeComplete', this.onRouteChangeComplete)
    }

    addListener = (func: (url: string) => Promise<void>) => {
        this.onChangeCallbacks.push(func)
    }

    onRouteChangeComplete = async (url: string) => {
        this.url = url
        if (this.url.startsWith("http://") || this.url.startsWith("https://")) {
            // Make it a relative URL
            this.url = this.url.substr(this.url.indexOf('/', 7))
        }

        const promises = this.onChangeCallbacks.map(async (callback) => {
            await callback(this.url)
        })
        await Promise.all(promises)
    }
}