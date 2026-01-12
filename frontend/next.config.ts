import type { NextConfig } from 'next';
import withExportImages from 'next-export-optimize-images';
import mdx from '@next/mdx';
import fs from 'fs';
import { join } from 'path';
import { VersionNumber } from './config/CryfsVersion';
// @ts-expect-error - ncp doesn't have type declarations
import ncp from 'ncp';

const config: NextConfig = {
  output: 'export',

  exportPathMap: async (
    defaultPathMap,
    { dev, dir, outDir }
  ) => {
    // In dev mode (i.e. when we're not exporting), we don't need to copy files
    if (dev) {
      console.log("Not copying version_info.json for dev build");
      return defaultPathMap;
    }

    if (outDir == null) {
      throw new Error("outDir is null");
    }

    // Create the /version_info.json file in the export
    const version_info = JSON.stringify({
      "version_info": {
        "current": VersionNumber,
      },
      "warnings": {},
    });
    fs.writeFile(join(outDir, 'version_info.json'), version_info, function (err) {
      if (err) {
        throw err;
      }
      console.log("Written version_info.json");
    });

    // Copy all files from assets/static
    ncp.ncp(join(dir, 'assets/static'), outDir, (err: Error | null) => {
      if (err) {
        throw err;
      }
      console.log("Copied static files");
    });

    return defaultPathMap;
  },
  pageExtensions: ['ts', 'tsx', 'mdx'],
  images: {
    loader: 'custom',
  },
};

const withMdx = mdx({
  /* mdx config */
});

export default withExportImages(withMdx(config));
