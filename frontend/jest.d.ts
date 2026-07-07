// TypeScript 6 no longer auto-includes @types packages whose name contains a
// dot (e.g. gtag.js), so reference it explicitly to keep the global `gtag`
// declaration (used via `window.gtag`) available across the project.
/// <reference types="gtag.js" />
import '@testing-library/jest-dom';

declare global {
  // gtag is already declared in @types/gtag.js
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _paq: { push: (...args: any[]) => void };
}

export {};
