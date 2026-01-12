import type { NextConfig } from 'next';
import withExportImages from 'next-export-optimize-images';
import mdx from '@next/mdx';
import { promises as fs } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { VersionNumber } from './config/CryfsVersion';
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
const ncpModule: { ncp: (source: string, destination: string, callback: (err: Error | null) => void) => void } = require('ncp');

const ncp = promisify(ncpModule.ncp);

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
    await fs.writeFile(join(outDir, 'version_info.json'), version_info);
    console.log("Written version_info.json");

    // Copy all files from assets/static
    await ncp(join(dir, 'assets/static'), outDir);
    console.log("Copied static files");

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

const mergedConfig: NextConfig = withExportImages(withMdx(config));

export default mergedConfig;
