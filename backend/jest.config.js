module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: [
    '*.js',
    '!jest.config.js',
    '!webpack.config.js',
  ],
  clearMocks: true,
  resetModules: true,
};
