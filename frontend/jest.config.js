const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Handle module aliases
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    // Handle image imports
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.ts',
    // Handle CSS modules
    '\\.module\\.css$': 'identity-obj-proxy',
    // Handle Next.js modules
    '^next/router$': '<rootDir>/__mocks__/next/router.tsx',
    '^next/dist/client/router$': '<rootDir>/__mocks__/next/router.tsx',
    '^next/link$': '<rootDir>/__mocks__/next/link.tsx',
    '^next/head$': '<rootDir>/__mocks__/next/head.tsx',
    '^next/script$': '<rootDir>/__mocks__/next/script.tsx',
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
  ],
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'pages/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  testMatch: [
    '**/*.test.{js,jsx,ts,tsx}',
  ],
};

module.exports = createJestConfig(customJestConfig);
