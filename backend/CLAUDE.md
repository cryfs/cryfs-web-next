# Backend

AWS Lambda serverless functions for the CryFS website, deployed with AWS SAM.

## Tech Stack

- **Runtime**: AWS Lambda with AWS SAM (Serverless Application Model)
- **Language**: JavaScript (ES6+, no TypeScript)
- **Bundler**: esbuild (built into SAM)
- **External Services**: AWS SES (email), Mailchimp (newsletter)
- **Secrets**: AWS SSM Parameter Store

## Prerequisites

Install the AWS SAM CLI:
- macOS: `brew install aws-sam-cli`
- Other: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/newsletter/register` | Subscribe email to Mailchimp newsletter |
| POST | `/contact/send` | Send contact form message via AWS SES |

Both endpoints use simple token-based spam protection (not authentication).

## Directory Structure

```
backend/
├── *.js              # Source modules (handlers and utilities)
├── *.test.js         # Jest tests (colocated)
├── __mocks__/        # Jest mocks for external services
├── iam/              # IAM policy documentation
├── template.yaml     # SAM template (infrastructure as code)
└── samconfig.toml    # SAM deployment configuration
```

## Commands

```bash
# Install dependencies
npm install

# Run unit tests
npm test
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report

# Build Lambda functions
npm run build          # or: sam build

# Local development
npm run local          # Start local API at http://localhost:3000
sam local invoke NewsletterRegisterFunction --event events/test.json

# Deploy to AWS (requires AWS credentials)
npm run deploy         # or: sam deploy --no-confirm-changeset
```

## Local Testing with SAM

1. Build the functions:
   ```bash
   sam build
   ```

2. Start local API Gateway:
   ```bash
   sam local start-api
   ```

3. Test endpoints (in another terminal):
   ```bash
   curl -X POST http://localhost:3000/newsletter/register \
     -H "Content-Type: application/json" \
     -d '{"token": "fd0kAn1zns", "email": "test@example.com"}'
   ```

Note: Local testing requires Docker. SSM secrets won't work locally unless you mock them or set environment variables.

## Code Conventions

### Lambda Handler Pattern
All handlers use the `LambdaFunction()` higher-order function wrapper:

```javascript
import { LambdaFunction } from './lambda_function'

export const myHandler = LambdaFunction(async (body) => {
    // Implementation
    return { statusCode: 200, body: JSON.stringify({ success: true }) }
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

## AWS Configuration

Deployment requires:
- AWS credentials with appropriate permissions (see `iam/` directory)
- SSM parameters configured for secrets

## Version Management

IMPORTANT: Node.js version must be kept in sync in two places:
- `package.json` → `engines.node`
- `template.yaml` → `Globals.Function.Runtime`
