module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.js$': 'esbuild-jest',
  },
  collectCoverageFrom: [
    '*.js',
    '!jest.config.js',
  ],
  clearMocks: true,
  resetModules: true,
};
