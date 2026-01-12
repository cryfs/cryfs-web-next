import type { Config } from 'next-export-optimize-images';

const config: Config = {
  convertFormat: [
    ['png', 'webp'],
    ['jpeg', 'webp'],
    ['jpg', 'webp'],
  ],
  sharpOptions: {
    webp: {
      quality: 80,
    },
    png: {
      quality: 80,
    },
    jpg: {
      quality: 80,
    },
  },
};

export default config;
