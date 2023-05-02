import Head from "next/head"

// TODO Checking types for imported image files only works if we remove `images.disableStaticImages: true` from next.config.js,
//      but then we can't optimize images on export anymore. So let's for now just exclude this from the type checker.
// @ts-ignore
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
        <meta property="og:type" content={(typeof props.type == 'undefined') ? "website" : props.type} />
        <meta property="og:image" content={Logo} />
        <meta property="og:description" content={props.description} />
        {(props.type == 'article') &&
            <meta property="article:author" content="https://www.facebook.com/sebastian.messmer" />
        }
        <meta name="description" content={props.description} />
        <title>{props.title}</title>
    </Head>
)

export default MetaTags;
