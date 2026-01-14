import Head from "next/head"

import Logo from "../assets/images/logo.png"

type MetaTagsProps = {
    title: string
    url: string
    type?: string
    description: string
}

const MetaTags = (props: MetaTagsProps) => (
    <Head>
        <meta property="og:title" content={props.title} />
        <meta property="og:url" content={props.url} />
        <meta property="og:type" content={props.type ?? "website"} />
        <meta property="og:image" content={Logo.src} />
        <meta property="og:description" content={props.description} />
        {(props.type == 'article') &&
            <meta property="article:author" content="https://www.facebook.com/sebastian.messmer" />
        }
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={props.title} />
        <meta name="twitter:description" content={props.description} />
        <meta name="twitter:image" content={Logo.src} />
        <meta name="description" content={props.description} />
        <title>{props.title}</title>
        <link rel="canonical" href={props.url} />
    </Head>
)

export default MetaTags;
