// @ts-check
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.ts and .env files
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
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
    'components/**/*.{ts,tsx}',
    'pages/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  testMatch: [
    '**/*.test.{ts,tsx}',
  ],
};

export default createJestConfig(customJestConfig);
