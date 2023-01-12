"use strict";

const {withPlugins} = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');
const withMDX = require('@next/mdx')
const fs = require('fs');
const { join } = require('path');
const {VersionNumber} = require('./config/CryfsVersion.js');
const ncp = require('ncp').ncp

const config = {
    exportPathMap: async (
        defaultPathMap,
        { dev, dir, outDir, distDir, buildId }
    ) => {
        // In dev mode (i.e. when we're not exporting), we don't need to copy files
        if (dev) {
            console.log("Not copying version_info.json for dev build")
            return defaultPathMap;
        }

        // Create the /version_info.json file in the export
        const version_info = JSON.stringify({
            "version_info":{
                "current": VersionNumber,
            },
            "warnings":{},
        })
        fs.writeFile(join(outDir, 'version_info.json'), version_info, function(err) {
            if(err) {
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
    pageExtensions: ['js', 'md'],
}

module.exports = withPlugins([
    [optimizedImages, {/* config */}],
    [withMDX({
        extension: /\.mdx?$/
    }), {/* config */}],
], config);
