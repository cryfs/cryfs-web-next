# CryFS Website Repository

This is the source code for the CryFS website (https://www.cryfs.org).

## Repository Structure

This is a monorepo with two independent projects:

- **`frontend/`** - Next.js static website (deployed to GitHub Pages)
- **`backend/`** - AWS Lambda serverless functions (deployed to AWS)

Each directory has its own `package.json`, dependencies, and `CLAUDE.md` with detailed guidance.

## Branch

- `master` is the main branch

## Quick Reference

### Frontend
```bash
cd frontend
npm install
npm run dev      # Development server at localhost:3000
npm test         # Unit tests
npm run test:e2e # E2E tests
npm run build    # Production build
```

### Backend
```bash
cd backend
npm install
npm run typecheck # Type checking
npm test          # Unit tests
npm run build     # Build with SAM
npm run local     # Local API server (requires Docker)
npm run deploy    # Deploy to AWS (requires credentials)
```

## Deployment

- **Frontend**: Automatically deployed to GitHub Pages on push to `master`
- **Backend**: Automatically deployed to AWS Lambda on push to `master` (requires AWS secrets in GitHub)

## See Also

- [frontend/CLAUDE.md](frontend/CLAUDE.md) - Frontend development guide
- [backend/CLAUDE.md](backend/CLAUDE.md) - Backend development guide
