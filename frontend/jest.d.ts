import '@testing-library/jest-dom';

declare global {
  // gtag is already declared in @types/gtag.js
  const _paq: { push: (...args: unknown[]) => void };
}

export {};
