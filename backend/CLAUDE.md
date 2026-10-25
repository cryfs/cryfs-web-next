# Backend

AWS Lambda serverless functions for the CryFS website, deployed with AWS SAM.

## Tech Stack

- **Runtime**: AWS Lambda with AWS SAM (Serverless Application Model)
- **Language**: TypeScript
- **Bundler**: esbuild (built into SAM, handles TypeScript natively)
- **Testing**: Jest with ts-jest
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
├── *.ts              # Source modules (handlers and utilities)
├── *.test.ts         # Jest tests (colocated)
├── __mocks__/        # Jest mocks for external services
├── types/            # Type declarations for untyped packages
├── iam/              # IAM policy documentation
├── template.yaml     # SAM template (infrastructure as code)
├── tsconfig.json     # TypeScript configuration
└── samconfig.toml    # SAM deployment configuration
```

## Commands

```bash
# Install dependencies
npm install

# Type checking
npm run typecheck      # Run TypeScript compiler without emitting

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

```typescript
import { LambdaFunction } from './lambda_function';

export const myHandler = LambdaFunction(async (body) => {
    // Implementation
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
});
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
Use `CachedValue<T>` for expensive initializations (API clients, secrets):

```typescript
import CachedValue from './cached_value';

const client = new CachedValue(async () => {
    const apiKey = await secret('API_KEY');
    return new ApiClient(apiKey);
});

// Usage - initializes once, returns cached instance
const api = await client.get();
```

### Testing
- All external services must be mocked
- Mock naming convention: `__mockXxx` static properties on mock classes

```typescript
jest.mock('mailchimp-api-v3');

// Access mock via require (for static properties)
const MockMailchimp = require('mailchimp-api-v3').default;

// In tests:
MockMailchimp.__mockPost.mockResolvedValue({ status: 'subscribed' });
```

## AWS Configuration

Deployment requires:
- AWS credentials with appropriate permissions (see `iam/` directory)
- SSM parameters configured for secrets

## Custom Domain (backend.cryfs.org)

The frontend calls the API at `https://backend.cryfs.org`. That domain is not part of `template.yaml`: it was set up by hand, and `sam deploy` doesn't touch it.

- **API Gateway custom domain** `backend.cryfs.org`, edge-optimized, in us-east-1. Its base path mapping must point at the `Prod` stage of this stack's API. If the stack is ever recreated, the new API has to be mapped by hand.
- **ACM certificate** for `backend.cryfs.org` in us-east-1 (edge-optimized domains require that region), validated by DNS. ACM renews it on its own, currently 45 days before it expires, but only while the DNS records below are in place.
- **DNS** for `cryfs.org` is hosted at Cloudflare:
  - `backend` is a CNAME to the custom domain's CloudFront hostname (shown in API Gateway as the "API Gateway domain name"). It is DNS only, not proxied, so clients get the ACM certificate directly from CloudFront.
  - ACM's validation CNAME (`_<hash>.backend` → `….acm-validations.aws`) must stay, because every renewal re-validates against it. The ACM console shows its name and value on the certificate.
  - The CAA records on `@` must include `0 issue "amazon.com"`. Without it, Amazon isn't allowed to issue, and renewals fail with `RenewalStatusReason: CAA_ERROR` even though domain validation shows `SUCCESS` (ACM's warning says "0 domains require validation"). This happened in October 2026.

The CAA record has to be on `@`, not on `backend`. A CAA record can't sit next to a CNAME, so CAs looking up `backend.cryfs.org` find none there and fall back to the records on `cryfs.org`. As soon as the zone has any CAA record, Cloudflare also adds `issue`/`issuewild` records for its own CAs, and those don't include Amazon. The dashboard doesn't list them; it only warns that "Cloudflare will respond with additional CAA records". `dig +noall +answer cryfs.org CAA` shows the full set.

To check the certificate:

```bash
# Expiry of the certificate being served
echo | openssl s_client -connect backend.cryfs.org:443 -servername backend.cryfs.org 2>/dev/null | openssl x509 -noout -enddate

# Renewal status of the certificate the domain uses
CERT=$(aws apigateway get-domain-name --region us-east-1 --domain-name backend.cryfs.org \
  --query certificateArn --output text)
aws acm describe-certificate --region us-east-1 --certificate-arn "$CERT" --query Certificate.RenewalSummary
```

If a renewal fails, fix the cause first; it's usually one of the DNS records above. ACM then retries on its own schedule, and there is no way to trigger it. If expiry is close, issue a new certificate and switch the domain to it:

```bash
NEW=$(aws acm request-certificate --region us-east-1 --domain-name backend.cryfs.org \
  --validation-method DNS --query CertificateArn --output text) &&
aws acm wait certificate-validated --region us-east-1 --certificate-arn "$NEW" &&
aws apigateway update-domain-name --region us-east-1 --domain-name backend.cryfs.org \
  --patch-operations op=replace,path=/certificateArn,value="$NEW"
```

The new certificate reuses the existing validation CNAME, so it is issued within minutes. Delete the old certificate once its `InUseBy` is empty.

## Version Management

IMPORTANT: Node.js version must be kept in sync in two places:
- `package.json` → `engines.node`
- `template.yaml` → `Globals.Function.Runtime`
