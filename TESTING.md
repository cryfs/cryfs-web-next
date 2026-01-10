# Testing Documentation

This document describes the comprehensive test suite for the CryFS website project, covering both frontend and backend components.

## Overview

The project uses Jest as the primary testing framework for both frontend and backend code. The test suite includes:

- **Frontend**: Unit tests for React components and integration tests for pages
- **Backend**: Unit tests for utility modules and integration tests for Lambda functions

## Frontend Tests

### Framework and Tools

- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **@testing-library/user-event** - User interaction simulation
- **@testing-library/jest-dom** - Custom DOM matchers

### Test Structure

Frontend tests are located in `__tests__` directories alongside the code they test:

```
frontend/
├── components/
│   ├── __tests__/
│   │   └── AsyncButton.test.js
│   └── sections/
│       └── __tests__/
│           ├── NewsletterSection.test.js
│           └── ContactSection.test.js
└── pages/
    └── __tests__/
        └── index.test.js
```

### Running Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Frontend Test Coverage

The frontend test suite covers:

- **AsyncButton** - Button component with async operation handling and loading states
- **NewsletterSection** - Newsletter registration form with API integration and error handling
- **ContactSection** - Contact form with validation and API integration
- **Download Modal** - Operating system selection and tab switching
- **Donate Modal** - Donation widget integration
- **Index Page** - Main landing page integration

## Backend Tests

### Framework and Tools

- **Jest** - Test runner and assertion library
- **aws-sdk-mock** - Mock AWS services for testing

### Test Structure

Backend tests are located in the `__tests__` directory at the root level:

```
backend/
└── __tests__/
    ├── cached_value.test.js
    ├── secret.test.js
    ├── email.test.js
    ├── lambda_function.test.js
    ├── newsletter.test.js
    └── contact.test.js
```

### Running Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Backend Test Coverage

The backend test suite covers:

- **cached_value.js** - Thread-safe caching with concurrency control
- **secret.js** - AWS Parameter Store integration for secrets management
- **email.js** - SendGrid email sending functionality
- **lambda_function.js** - Lambda wrapper with CORS and error handling
- **newsletter.js** - Mailchimp newsletter registration with error scenarios
- **contact.js** - Contact form submission handling

## CI/CD Integration

Tests are automatically run in GitHub Actions workflows:

### Frontend Workflow

The frontend workflow runs tests before building and deploying:

1. Install dependencies
2. **Run tests with coverage**
3. Build Next.js application
4. Deploy to GitHub Pages (on master branch only)

### Backend Workflow

The backend workflow runs tests before packaging and deploying:

1. Install dependencies
2. **Run tests with coverage**
3. Package Serverless application
4. Deploy to AWS Lambda (on master branch only)

## Coverage Thresholds

### Backend

The backend has coverage thresholds configured in `jest.config.js`:

- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

Tests will fail if coverage drops below these thresholds.

## Writing New Tests

### Frontend Component Tests

When creating new frontend components, add corresponding tests in a `__tests__` directory:

```javascript
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

### Backend Module Tests

When creating new backend modules, add corresponding tests in the `__tests__` directory:

```javascript
import myModule from '../myModule'

describe('myModule', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('performs expected behavior', async () => {
    const result = await myModule.doSomething()
    expect(result).toBe('expected value')
  })
})
```

## Mocking Strategies

### Frontend Mocking

- **API calls**: Mock `fetch` globally
- **Analytics**: Mock the Analytics module
- **Next.js components**: Mock Next.js specific components (Script, Router)

### Backend Mocking

- **AWS SDK**: Use jest.mock() to mock AWS services
- **External APIs**: Mock Mailchimp and SendGrid clients
- **Secrets**: Mock the secret module to return test values

## Common Issues

### Frontend

**Issue**: Tests fail with "Cannot find module '@testing-library/jest-dom'"
**Solution**: Run `npm install` in the frontend directory

**Issue**: Tests timeout
**Solution**: Increase Jest timeout or check for unresolved promises

### Backend

**Issue**: AWS SDK mock not working
**Solution**: Ensure mocks are defined before importing the module under test

**Issue**: Module import errors
**Solution**: Use `jest.resetModules()` before importing in tests

## Best Practices

1. **Keep tests focused** - Test one thing per test case
2. **Use descriptive names** - Test names should clearly describe what is being tested
3. **Mock external dependencies** - Don't make real API calls in tests
4. **Test error cases** - Include tests for error scenarios
5. **Maintain coverage** - Ensure new code is covered by tests
6. **Run tests before committing** - Ensure all tests pass locally
7. **Keep tests fast** - Avoid unnecessary delays and timeouts

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://testingjavascript.com/)
