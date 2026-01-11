# Frontend

Next.js static website for CryFS.

## Tech Stack

- **Framework**: Next.js with static export (`output: 'export'`)
- **Language**: TypeScript (strict mode) with `allowJs` for mixed JS/TS codebase
- **Styling**: CSS Modules + Bootstrap + SCSS
- **UI Components**: React Bootstrap (Bootstrap React components)
- **Content**: MDX for markdown pages

## Directory Structure

```
frontend/
├── pages/          # Next.js pages (JS and MDX files)
├── components/     # React components
│   ├── modals/     # Modal components (Download, Donate)
│   └── sections/   # Page section components
├── e2e/            # Playwright E2E tests
│   ├── tests/      # Test specifications
│   ├── pages/      # Page Object Model classes
│   └── fixtures/   # Test fixtures and API mocks
├── config/         # App configuration
└── assets/         # Images, styles, static files
```

## Code Conventions

### Components
- Both class and functional components are used
- PascalCase for component files (`AsyncButton.js`, `Console.tsx`)
- Lowercase for page files (`index.js`, `legal_notice.mdx`)

### Styling with CSS Modules
```javascript
import styles from './Component.module.css';

// Usage
<div className={styles.container}>
```

CSS Module file (Component.module.css):
```css
.container {
    padding: 15px;
}

@media (min-width: 768px) {
    .container {
        padding: 30px;
    }
}
```

Combine with Bootstrap classes when needed:
```javascript
<div className={`${styles.custom} d-none d-lg-block`}>
```

### Router-Based Modals
Modals open/close based on URL hash (`#download`, `#donate`). The `RouteHashBasedModal` component handles this pattern.

### Analytics
Dual analytics logging via `logAnalyticsEvent()`:
```javascript
import { logAnalyticsEvent } from './Analytics'
await logAnalyticsEvent('category', 'action')
```

### Testing
- Unit tests colocated with components: `Component.test.tsx`
- E2E tests use Page Object Model pattern in `e2e/pages/`

## Commands

```bash
npm run dev          # Development server (localhost:3000)
npm run build        # Production static export
npm test             # Unit tests (Jest + React Testing Library)
npm run test:watch   # Unit tests in watch mode
npm run test:e2e     # E2E tests (Playwright, all browsers)
npm run test:e2e:ui  # E2E tests with Playwright UI
npm run lint         # ESLint
```
