/** @type {import('next-export-optimize-images').Config} */
const config = {
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

module.exports = config;
