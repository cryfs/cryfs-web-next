# Backend

AWS Lambda serverless functions for the CryFS website.

## Tech Stack

- **Runtime**: AWS Lambda with Serverless Framework
- **Language**: JavaScript (ES6+, no TypeScript)
- **Bundler**: Webpack + Babel
- **External Services**: SendGrid (email), Mailchimp (newsletter)
- **Secrets**: AWS SSM Parameter Store

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/newsletter/register` | Subscribe email to Mailchimp newsletter |
| POST | `/contact/send` | Send contact form message via SendGrid |

Both endpoints use simple token-based spam protection (not authentication).

## Directory Structure

```
backend/
├── *.js            # Source modules (handlers and utilities)
├── *.test.js       # Jest tests (colocated)
├── __mocks__/      # Jest mocks for external services
├── iam/            # IAM policy documentation
├── serverless.yml  # Serverless Framework config
└── webpack.config.js
```

## Code Conventions

### Lambda Handler Pattern
All handlers use the `LambdaFunction()` higher-order function wrapper:

```javascript
import { LambdaFunction } from './lambda_function'

export const myHandler = LambdaFunction(async (event) => {
    // Implementation
    return { success: true }
})
```

The wrapper provides:
- Token validation from request body
- CORS headers
- Error handling with admin email notifications
- Response formatting

### Naming Conventions
- Exported handlers: camelCase (`register`, `send`)
- Internal functions: snake_case (`do_register`, `email_myself`)

### Caching Pattern
Use `CachedValue` for expensive initializations (API clients, secrets):

```javascript
import CachedValue from './cached_value'

const client = new CachedValue(async () => {
    const apiKey = await secret('API_KEY')
    return new ApiClient(apiKey)
})

// Usage - initializes once, returns cached instance
const api = await client.get()
```

### Testing
- All external services must be mocked
- Mock naming convention: `__mockXxx` properties

```javascript
jest.mock('mailchimp-api-v3')
// In tests:
Mailchimp.__mockPost.mockResolvedValue({ status: 'subscribed' })
```

## Commands

```bash
npm test              # Run tests
npm run test:watch    # Tests in watch mode
npm run test:coverage # Coverage report
./serverless package  # Package for deployment
./serverless deploy --stage prod  # Deploy to AWS
```

## AWS Configuration

Deployment requires:
- AWS credentials with appropriate permissions (see `iam/` directory)
- SSM parameters configured for secrets
