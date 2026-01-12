import '@testing-library/jest-dom';

// Mock window.gtag for Google Analytics
(global as Record<string, unknown>).gtag = jest.fn();

// Mock window._paq for Matomo
(global as Record<string, unknown>)._paq = { push: jest.fn() };

// Suppress specific console warnings during tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args: unknown[]): void => {
    // Suppress React DOM warnings that are not actionable in tests
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
        args[0].includes('Warning: An update to') ||
        args[0].includes('Warning: validateDOMNesting'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args: unknown[]): void => {
    // No class component warnings to suppress after React 19 migration
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
