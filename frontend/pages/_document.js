"use strict";

import Document, { Html, Head, Main, NextScript } from 'next/document'

// TODO Do we need CSRF tags?

class MyDocument extends Document {
    render = () => {
        return (
            // TODO The lang attribute in the html tag and the og:locale tag should be based on the actual chosen language
            <Html lang={"en"}>
                <Head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#">
                    <meta name="author" content="Sebastian Messmer" />
                    <meta property="og:site_name" content="CryFS" />
                    <meta property="og:locale" content="en_US" />
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
