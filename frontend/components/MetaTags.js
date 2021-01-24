"use strict";

import Head from "next/head"
import Logo from "../assets/images/logo.png"

const MetaTags = (props) => (
    <Head>
        <meta property="og:title" content={props.title} />
        <meta property="og:url" content={props.url} />
        <meta property="og:type" content={(typeof props.type == 'undefined') ? "website" : props.type} />
        <meta property="og:image" content={Logo} />
        <meta property="og:description" content={props.description} />
        { (props.type == 'article') &&
                <meta property="article:author" content="https://www.facebook.com/sebastian.messmer" />
        }
        <meta name="description" content={props.description} />
        <title>{props.title}</title>
    </Head>
)

export default MetaTags;
