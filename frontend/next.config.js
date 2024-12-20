// @ts-check

"use strict";

const withOptimizedImages = require('next-optimized-images');
const mdx = require('@next/mdx')
const fs = require('fs');
const { join } = require('path');
const { VersionNumber } = require('./config/CryfsVersion.js');
const ncp = require('ncp').ncp

/**
 * @type {import('next').NextConfig}
 */
const config = {
    output: 'export',

    exportPathMap: async (
        defaultPathMap,
        { dev, dir, outDir, distDir, buildId }
    ) => {
        // In dev mode (i.e. when we're not exporting), we don't need to copy files
        if (dev) {
            console.log("Not copying version_info.json for dev build")
            return defaultPathMap;
        }

        if (outDir == null) {
            throw new Error("outDir is null")
        }

        // Create the /version_info.json file in the export
        const version_info = JSON.stringify({
            "version_info": {
                "current": VersionNumber,
            },
            "warnings": {},
        })
        fs.writeFile(join(outDir, 'version_info.json'), version_info, function (err) {
            if (err) {
                throw err
            }
            console.log("Written version_info.json");
        });

        // Copy all files from assets/static
        ncp(join(dir, 'assets/static'), outDir, (err) => {
            if (err) {
                throw err
            }
            console.log("Copied static files");
        })

        return defaultPathMap;
    },
    pageExtensions: ['js', 'mdx'],
    // TODO Use next/image from https://nextjs.org/docs/upgrading#nextconfigjs-customization-to-import-images instead of disableStaticImages: true
    //      (also disabled by getInitialProps? https://nextjs.org/docs/api-reference/data-fetching/get-initial-props )
    images: {
        disableStaticImages: true,
    }
}

const withMdx = mdx({
    /* mdx config */
})

/**
 * @type {import('next').NextConfig}
 */
const mergedConfig = withOptimizedImages(withMdx(config))

module.exports = mergedConfig
