# Backend

AWS Lambda backend for CryFS website, deployed with AWS SAM.

## Installation

```bash
npm install
```

### SAM CLI

Install the AWS SAM CLI for local development and deployment:

```bash
# Using pip
pipx install aws-sam-cli

# Or using Homebrew (macOS/Linux)
brew install aws-sam-cli
```

## AWS Setup

See `iam` folder for required IAM permissions.

## SAM Commands

First set AWS environment variables `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

```bash
sam build                           # Build Lambda functions
sam deploy --no-confirm-changeset   # Deploy to AWS
sam local start-api                 # Start local API server
sam logs -n NewsletterRegisterFunction --tail  # View logs
sam delete                          # Delete stack
```

## Testing

```bash
npm test              # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```
