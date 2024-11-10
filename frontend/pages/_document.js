"use strict";

import Document, { Html, Head, Main, NextScript } from 'next/document'
import { StyleSheetServer } from 'aphrodite/no-important'

// TODO Do we need CSRF tags?

class MyDocument extends Document {
    static getInitialProps = async ({ renderPage }) => {
        const { html, css } = StyleSheetServer.renderStatic(() => renderPage())
        const ids = css.renderedClassNames
        return { ...(await html), css, ids }
    }

    constructor(props) {
        super(props)
        /* Take the renderedClassNames from aphrodite (as generated
        in getInitialProps) and assign them to __NEXT_DATA__ so that they
        are accessible to the client for rehydration. */
        const { __NEXT_DATA__, ids } = props
        if (ids) {
            __NEXT_DATA__.ids = this.props.ids
        }
    }

    render = () => {
        return (
            // TODO The lang attribute in the html tag and the og:locale tag should be based on the actual chosen language
            <Html lang={"en"}>
                <Head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#">
                    <meta name="author" content="Sebastian Messmer" />
                    <meta property="og:site_name" content="CryFS" />
                    <meta property="og:locale" content="en_US" />
                    {/* Make sure to use data-aphrodite attribute in the style tag here
                    so that aphrodite knows which style tag it's in control of when
                    the client goes to render styles. If you don't you'll get a second
                    <style> tag */}
                    <style
                        data-aphrodite
                        dangerouslySetInnerHTML={{ __html: this.props.css.content }}
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
                <style jsx>{`
                    body {
                      background: black;
                    }
                `}</style>
            </Html>
        );
    }
}

export default MyDocument;
