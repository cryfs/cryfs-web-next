import '@testing-library/jest-dom';

declare global {
  // gtag is already declared in @types/gtag.js
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _paq: { push: (...args: any[]) => void };
}

export {};
