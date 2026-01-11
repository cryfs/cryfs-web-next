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
Run tests: $ npm test
Run tests in watch mode: $ npm run test:watch
Run tests with coverage: $ npm run test:coverage

E2E Testing
-------------
E2E tests use Playwright to test user flows in real browsers.

### Setup
Install Playwright browsers (one-time setup):
```
npx playwright install
```

For CI environments, install with system dependencies:
```
npx playwright install --with-deps chromium firefox webkit
```

### Running E2E Tests
Run all E2E tests: $ npm run test:e2e
Run with interactive UI: $ npm run test:e2e:ui
Run in headed mode (visible browser): $ npm run test:e2e:headed
Run only Chromium: $ npm run test:e2e:chromium

### Viewing Test Reports
After running tests, view the HTML report:
```
npx playwright show-report
```

Deployment
-------------
GitHub Actions, on a successful master build, runs unit tests and E2E tests,
then exports the project to static files and deploys them to GitHub Pages.
