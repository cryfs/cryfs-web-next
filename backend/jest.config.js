module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/__tests__/**',
    '!jest.config.js',
    '!webpack.config.js',
    '!.webpack/**',
  ],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.webpack/',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}
