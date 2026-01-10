Installation
-------------
Run "npm install" to install dependencies

Running
-------------
Run dev version: $ npm run dev
Build prod version: $ npm run build
Start built prod version: $ npm run start
Export to static files: $ npm run export

Testing
-------------

### Unit Tests

The project uses Jest and React Testing Library for unit and component tests. Test files are colocated with their source files using the `.test.tsx` or `.test.ts` extension.

**Run all unit tests:**
```bash
npm test
```

**Run tests in watch mode (useful during development):**
```bash
npm run test:watch
```

**Run tests with coverage report:**
```bash
npm run test:coverage
```

The coverage report will be generated in the `coverage/` directory.

### End-to-End Tests

The project uses Playwright for end-to-end testing. E2E tests are located in the `e2e/` directory.

**Run E2E tests:**
```bash
npm run test:e2e
```

**Run E2E tests in headed mode (see the browser):**
```bash
npm run test:e2e:headed
```

**Run E2E tests for a specific browser:**
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

**View E2E test report:**
```bash
npx playwright show-report
```

**Install Playwright browsers (first time setup):**
```bash
npx playwright install
```

### Writing Tests

**Unit Tests:**
- Place test files next to the source file: `Component.tsx` → `Component.test.tsx`
- Use React Testing Library for component testing
- Follow the existing patterns in the codebase
- Mock external dependencies (fetch, analytics, Next.js router)

Example:
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);

    await user.click(screen.getByRole('button'));

    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

**E2E Tests:**
- Place test files in the `e2e/` directory with `.spec.ts` extension
- Use Playwright's testing API
- Mock API responses when testing form submissions

Example:
```typescript
import { test, expect } from '@playwright/test';

test('should complete user flow', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: /submit/i }).click();

  await expect(page.getByText('Success!')).toBeVisible();
});
```

### Test Structure

```
frontend/
├── components/
│   ├── MyComponent.tsx
│   ├── MyComponent.test.tsx      # Unit test (colocated)
│   └── ...
├── e2e/
│   ├── homepage.spec.ts          # E2E tests
│   ├── navigation.spec.ts
│   └── ...
├── __mocks__/                    # Jest mocks
│   ├── next/
│   ├── aphrodite.js
│   └── unfetch.js
├── jest.config.js
├── jest.setup.js
└── playwright.config.ts
```

Deployment
-------------
Circle CI, on a successful master build, exports the project to static files and
pushes them to the 'gh-pages' branch, where they are picked up by GitHub Pages.
