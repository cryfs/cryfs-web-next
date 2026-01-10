import '@testing-library/jest-dom';

declare global {
  function gtag(...args: unknown[]): void;
  const _paq: { push: jest.Mock };
}

export {};
