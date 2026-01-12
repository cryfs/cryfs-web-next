# React 19 Upgrade Plan for CryFS Frontend

## Executive Summary

This document outlines a detailed plan for upgrading the CryFS frontend from React 18.3.1 to React 19, including the required Next.js 14 → 15 upgrade.

**Current State:**
- React: 18.3.1
- React-DOM: 18.3.1
- Next.js: 14.2.17

**Target State:**
- React: 19.x
- React-DOM: 19.x
- Next.js: 15.x

**Estimated Effort:** Medium-High (7 class components to convert, 2 HOC patterns to replace, 11 Link updates)

---

## Phase 1: Pre-Upgrade Preparation

### 1.1 Verify React 18.3.1 Warnings

The current version (18.3.1) already includes deprecation warnings. Run the app and tests to identify any console warnings:

```bash
cd frontend
npm run dev
# Check console for deprecation warnings
npm test
# Check test output for React warnings
```

### 1.2 Audit Third-Party Dependencies

| Dependency | Current | React 19 Compatible | Action |
|------------|---------|---------------------|--------|
| react-bootstrap | 2.10.10 | ✅ Yes | Update to latest |
| @fortawesome/react-fontawesome | 3.1.1 | ✅ Yes | No change needed |
| @testing-library/react | 16.3.1 | ✅ Yes | No change needed |
| @next/mdx | 14.2.17 | ⚠️ Update | Update to 15.x |
| next-export-optimize-images | 4.7.0 | ✅ Yes | Verify compatibility |
| eslint-config-next | 14.2.17 | ⚠️ Update | Update to 15.x |

### 1.3 Create Baseline Test Results

```bash
npm test -- --coverage > baseline-test-results.txt
npm run test:e2e
npm run lint
npm run build
```

Save these results to compare after the upgrade.

---

## Phase 2: Dependency Updates

### 2.1 Update package.json

Update the following dependencies in order:

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "@next/mdx": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "eslint-config-next": "^15.0.0"
  }
}
```

### 2.2 Install Updates

```bash
rm -rf node_modules package-lock.json
npm install
```

### 2.3 Verify Installation

```bash
npm ls react
npm ls next
```

---

## Phase 3: Breaking Changes & Code Updates

### 3.1 Convert Class Components to Functional Components (7 files)

#### Priority 1: Components with withRouter HOC

**File: `components/Analytics.js`**
- Lines: 16-43
- Issues:
  - Class component with `componentWillUnmount`
  - Uses deprecated `withRouter` HOC from `next/dist/client/router`
- Changes:
  - Convert to functional component
  - Use `useRouter()` hook from `next/router`
  - Use `useEffect()` with cleanup for route change listeners

```javascript
// Before
import { withRouter } from "next/dist/client/router";
class AnalyticsSetup_ extends React.Component {
  componentWillUnmount() { ... }
}
export const AnalyticsSetup = withRouter(AnalyticsSetup_);

// After
import { useRouter } from "next/router";
import { useEffect } from "react";
export function AnalyticsSetup() {
  const router = useRouter();
  useEffect(() => {
    // setup
    return () => { /* cleanup */ };
  }, [router]);
}
```

**File: `components/modals/RouteHashBasedModal.js`**
- Lines: 10-71
- Issues:
  - Class component with `componentWillUnmount`
  - Uses deprecated `withRouter` HOC
- Changes:
  - Convert to functional component
  - Use `useRouter()` hook
  - Use `useEffect()` for hash-based modal state management

#### Priority 2: Stateful Class Components

**File: `components/AsyncButton.js`**
- Lines: 11-60
- Issues: Class component with `constructor`, `this.state`, `this.setState()`
- Changes:
  - Convert to functional component
  - Use `useState()` for `isInProgress` state
  - Convert arrow function handlers to regular functions or `useCallback()`

```javascript
// Before
class AsyncButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isInProgress: false };
  }
  ...
}

// After
function AsyncButton(props) {
  const [isInProgress, setIsInProgress] = useState(false);
  ...
}
```

**File: `components/Layout.js` (MyNavBar class)**
- Lines: 17-58
- Issues: Class component for navbar with toggle state
- Changes:
  - Convert `MyNavBar` class to functional component
  - Use `useState()` for `isOpen` state

**File: `components/modals/Download.js` (Tabs class)**
- Lines: 21-81
- Issues: Class component with `activeTab` state
- Changes:
  - Convert `Tabs` class to functional component
  - Use `useState()` for `activeTab` state

**File: `components/sections/ContactSection.js`**
- Lines: 16-137
- Issues: Class component with form state and fetch calls
- Changes:
  - Convert to functional component
  - Use `useState()` for form fields and notification state
  - Use `useCallback()` for form handlers

**File: `components/sections/NewsletterSection.js`**
- Lines: 16-126
- Issues: Class component with form state and fetch calls
- Changes:
  - Convert to functional component
  - Use `useState()` for form fields
  - Use `useCallback()` for submit handler

### 3.2 Remove Legacy Link Behavior (7 files, 11 instances)

The `legacyBehavior` prop will be removed in Next.js 16. The `passHref` prop is also deprecated when using the new Link behavior.

**File: `components/Layout.js`** (5 instances with `legacyBehavior passHref`)
- Lines: 39, 42, 45, 48, 51

```javascript
// Before
<Link legacyBehavior passHref href="/howitworks">
  <Nav.Link>How It Works</Nav.Link>
</Link>

// After (Next.js 15 style)
<Nav.Link as={Link} href="/howitworks">
  How It Works
</Nav.Link>
```

**File: `components/Teaser.js`** (2 instances with `passHref`)
- Lines: 43, 46

```javascript
// Before
<Link passHref href="/#download">
  <Button>Download</Button>
</Link>

// After
<Button as={Link} href="/#download">Download</Button>
```

**File: `components/sections/BulletsSection.js`** (1 instance with `passHref`)
- Line: 20

**File: `pages/howitworks.mdx`** (1 instance with `passHref`)
- Line: 134

```javascript
// Before
<Link passHref href="/tutorial"><Button variant="primary" size="lg">Tutorial</Button></Link>

// After
<Button as={Link} variant="primary" size="lg" href="/tutorial">Tutorial</Button>
```

**File: `pages/comparison.mdx`** (1 instance with `passHref`)
- Line: 436

**File: `pages/tutorial.mdx`** (1 instance with `passHref`)
- Line: 213

**Note:** For Button components inside Link, use `as={Link}` prop on Button. For Nav.Link inside Link, use `as={Link}` prop on Nav.Link.

### 3.3 Update Router Imports

**Files to update:**
- `components/Analytics.js` - Line 6
- `components/modals/RouteHashBasedModal.js` - Line 3
- `components/RoutingListener.tsx`

```javascript
// Before
import { withRouter } from "next/dist/client/router";

// After
import { useRouter } from "next/router";
```

### 3.4 TypeScript Types Update

After installing `@types/react@19`, review these files for type compatibility:
- All `.tsx` files in `components/`
- `pages/*.tsx` files

Key type changes in React 19:
- `ReactNode` now includes `Promise<ReactNode>`
- `RefObject` is now read-only (affects `useRef()`)
- `ref` is a regular prop on function components

---

## Phase 4: React 19 Specific Changes

### 4.1 ref as Prop (New in React 19)

While no `forwardRef` usage was found in the codebase, be aware that React 19 allows passing `ref` directly as a prop:

```javascript
// React 19 - forwardRef no longer needed
function MyComponent({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
```

### 4.2 Removed APIs

Verify none of these removed APIs are used:
- ✅ `propTypes` - Not used
- ✅ `defaultProps` on function components - Not used
- ✅ String refs - Not used
- ✅ Legacy Context (`contextTypes`, `childContextTypes`) - Not used
- ✅ `findDOMNode` - Not used
- ✅ `ReactDOM.render` - Not used (only referenced in jest.setup.js warning suppression)
- ✅ `ReactDOM.hydrate` - Not used
- ✅ `unmountComponentAtNode` - Not used

### 4.3 Form Hook Changes (React 19)

**`useFormState` → `useActionState`:**

`useFormState` is deprecated in React 19 and will be removed in a future release. Use `useActionState` instead, which includes a new `pending` property:

```javascript
// Before (React 18)
import { useFormState } from 'react-dom';
const [state, formAction] = useFormState(action, initialState);

// After (React 19)
import { useActionState } from 'react';
const [state, formAction, isPending] = useActionState(action, initialState);
```

**`useFormStatus` new properties:**

In React 19, `useFormStatus` returns additional properties: `data`, `method`, and `action`. In React 18, only `pending` was available.

**Status:** ✅ Neither `useFormState` nor `useFormStatus` are used in the codebase - no changes needed.

### 4.4 useRef TypeScript Changes

In React 19, `useRef()` now requires an argument. This is a TypeScript breaking change:

```typescript
// Before (allowed in React 18)
const ref = useRef();

// After (React 19 requires argument)
const ref = useRef(undefined);
// or
const ref = useRef<HTMLDivElement>(null);
```

**Status:** ✅ No `useRef` usage found in the codebase - no changes needed.

### 4.5 Ref Callback Cleanup Functions (New in React 19)

React 19 supports returning a cleanup function from ref callbacks:

```javascript
<input ref={(node) => {
  // setup
  return () => {
    // cleanup when component unmounts
  };
}} />
```

**TypeScript Impact:** Implicit returns from ref callbacks are now rejected. If you have:
```javascript
// This will error in React 19 TypeScript
ref={(node) => node && node.focus()}

// Must be explicit:
ref={(node) => { if (node) node.focus(); }}
```

**Status:** ✅ No ref callbacks with implicit returns found in the codebase.

### 4.6 Context.Provider Deprecation

In React 19, you can render `<Context>` directly instead of `<Context.Provider>`:

```javascript
// Before
<ThemeContext.Provider value="dark">
  {children}
</ThemeContext.Provider>

// After (React 19)
<ThemeContext value="dark">
  {children}
</ThemeContext>
```

`Context.Provider` will be deprecated in a future version.

**Status:** ✅ No Context usage found in the codebase - no changes needed.

### 4.7 act() Import Change

In React 19, `act()` is imported from `react` instead of `react-dom/test-utils`:

```javascript
// Before
import { act } from 'react-dom/test-utils';

// After
import { act } from 'react';
```

**Status:** ✅ No `react-dom/test-utils` imports found - tests use `@testing-library/react` which handles this internally.

### 4.8 react-test-renderer Deprecation

`react-test-renderer` is deprecated in React 19. Migrate to `@testing-library/react`.

**Status:** ✅ Not used - tests already use `@testing-library/react`.

### 4.9 useEffect Timing Changes

React 19 has stricter timing for `useEffect` cleanup. Review cleanup functions in:
- `components/RoutingListener.tsx`
- Converted components with route listeners

### 4.10 Hydration Error Improvements

React 19 provides better hydration error messages and is more forgiving of third-party elements:
- Better diff output showing exactly what mismatched
- Unexpected tags in `<head>` and `<body>` from browser extensions are now skipped

After upgrade, run `npm run build && npm start` and verify no hydration mismatches in the console.

### 4.11 Error Handling Changes

React 19 adds new error handling options to `createRoot` and `hydrateRoot`:
- `onCaughtError` - Called when React catches an error in an Error Boundary
- `onUncaughtError` - Called when an error is thrown and not caught
- `onRecoverableError` - Called when React recovers from an error

**Status:** No Error Boundaries in codebase - no changes needed, but consider adding for production robustness.

---

## Phase 5: Next.js 15 Specific Changes

### 5.1 App Router Consideration

Next.js 15 encourages the App Router (`app/` directory), but Pages Router (`pages/`) is still fully supported. The current codebase uses Pages Router, which will continue to work.

**Recommendation:** Keep Pages Router for this upgrade. App Router migration can be a separate future initiative.

### 5.2 Async Request APIs (Breaking Change for App Router)

In Next.js 15, these APIs are now async and return Promises:
- `cookies()`
- `headers()`
- `draftMode()`
- `params` (in page/layout/route files)
- `searchParams` (in page files)

**Status:** ✅ Not applicable - this codebase uses Pages Router, not App Router. These APIs are only async in App Router.

### 5.3 Runtime Configuration (Breaking Change)

The `runtime` segment configuration no longer accepts `experimental-edge`. Use `edge` instead:

```javascript
// Before
export const runtime = 'experimental-edge'

// After
export const runtime = 'edge'
```

**Status:** ✅ No `runtime` configuration found in the codebase - no changes needed.

### 5.4 Caching Behavior Changes

Next.js 15 changes caching defaults:

| Feature | Next.js 14 | Next.js 15 |
|---------|------------|------------|
| `fetch()` requests | Cached by default | **Not cached** by default |
| GET Route Handlers | Cached by default | **Not cached** by default |
| Client Router Cache | Cached | **Not cached** (staleTime=0) |

**Opting into caching:**

```javascript
// For individual fetch requests
fetch(url, { cache: 'force-cache' })

// For all fetches in a layout/page (segment config)
export const fetchCache = 'default-cache'

// For Route Handlers
export const dynamic = 'force-static'

// For Client Router Cache (next.config.js)
experimental: {
  staleTimes: {
    dynamic: 30,
    static: 180,
  },
}
```

**Status:** ✅ No fetch() calls with caching concerns. No API routes. Forms use POST requests which aren't cached.

### 5.5 next.config.js Updates

Review `/home/user/cryfs-web-next/frontend/next.config.js` for deprecated options:
- `swcMinify` - Now default, can be removed if present (not in current config ✅)
- `experimental.appDir` - No longer experimental (not in current config ✅)
- `experimental.serverComponentsExternalPackages` → renamed to `serverExternalPackages`
- `experimental.bundlePagesExternals` → renamed to `bundlePagesRouterDependencies`

**Current config analysis:**
- Uses `output: 'export'` - ✅ Still supported
- Uses `images.loader: 'custom'` - ✅ Still supported
- Uses `pageExtensions: ['js', 'mdx']` - ✅ Still supported
- No deprecated experimental flags found

### 5.6 Image Component Changes

The codebase uses `next-export-optimize-images/image` instead of `next/image`. Files using Image:
- `components/Layout.js`
- `components/Teaser.js`
- `components/modals/Download.js`
- `pages/howitworks.mdx`
- `pages/comparison.mdx`

**Action:** Verify `next-export-optimize-images` package is compatible with Next.js 15. Check their changelog for any breaking changes.

### 5.7 ESLint 9 Support

Next.js 15 introduces ESLint 9 support while maintaining backward compatibility with ESLint 8.

Current setup:
- ESLint: 8.57.1
- Config: `.eslintrc.json` (legacy format)

**Options:**
1. **Keep ESLint 8** - No changes needed, backward compatible
2. **Upgrade to ESLint 9** - Would require migrating to flat config (`eslint.config.js`)

**Recommendation:** Keep ESLint 8 for this upgrade. ESLint 9 migration can be done separately.

### 5.8 Removed Features

- **`@next/font`** - Removed in favor of `next/font`
  **Status:** ✅ Not used in codebase

- **`geo` and `ip` on NextRequest** - Removed (hosting provider specific)
  **Status:** ✅ Not used in codebase

- **Speed Insights auto-instrumentation** - Removed
  **Status:** ✅ Not used in codebase

### 5.9 Turbopack (Optional)

Next.js 15 makes Turbopack stable for development:
```bash
next dev --turbopack
```

This is optional and can provide faster dev server startup. Consider testing after the upgrade is stable.

---

## Phase 6: Testing Strategy

### 6.1 Unit Test Updates

**File: `jest.setup.js`**
- Lines 31-34 suppress warnings for `componentWillReceiveProps`
- After converting class components, these suppressions can be removed

Run tests after each phase:
```bash
npm test
npm test -- --coverage
```

### 6.2 E2E Test Verification

```bash
npm run test:e2e
```

All E2E tests should pass without modification since they test user-visible behavior, not implementation details.

### 6.3 Manual Testing Checklist

- [ ] Home page loads correctly
- [ ] Navigation works (all links)
- [ ] Download modal opens via `/#download`
- [ ] Donate modal opens via `/#donate`
- [ ] Contact form submits correctly
- [ ] Newsletter form submits correctly
- [ ] Analytics events fire correctly
- [ ] Mobile navigation toggle works
- [ ] All MDX pages render correctly

### 6.4 Build Verification

```bash
npm run build
npm run lint
```

Verify static export generates correctly and no lint errors are introduced.

---

## Phase 7: Implementation Order

### Step-by-Step Execution

1. **Create feature branch**
   ```bash
   git checkout -b feat/react-19-upgrade
   ```

2. **Update dependencies** (Phase 2)
   - Update package.json
   - Run `npm install`
   - Fix any immediate errors
   - Verify `next-export-optimize-images` compatibility

3. **Fix Link components** (Phase 3.2) - 11 instances across 7 files
   - Quick win, low risk
   - Update `components/Layout.js` (5 instances)
   - Update `components/Teaser.js` (2 instances)
   - Update `components/sections/BulletsSection.js` (1 instance)
   - Update `pages/howitworks.mdx` (1 instance)
   - Update `pages/comparison.mdx` (1 instance)
   - Update `pages/tutorial.mdx` (1 instance)
   - Update `__mocks__/next/link.js` mock

4. **Convert Analytics component** (Phase 3.1)
   - Highest risk component (withRouter + lifecycle)
   - Test route change tracking

5. **Convert RouteHashBasedModal** (Phase 3.1)
   - Tests modal functionality
   - Verify Download/Donate modals work

6. **Convert remaining class components** (Phase 3.1)
   - AsyncButton
   - MyNavBar (in Layout.js)
   - Tabs (in Download.js)
   - ContactSection
   - NewsletterSection

7. **Run full test suite**
   - Unit tests: `npm test`
   - E2E tests: `npm run test:e2e`
   - Manual testing per checklist

8. **Fix any remaining issues**
   - TypeScript errors
   - ESLint warnings
   - Runtime errors

9. **Clean up**
   - Remove warning suppressions from `jest.setup.js`
   - Update `CLAUDE.md` to remove "class components are used"
   - Test with Turbopack (optional): `npm run dev -- --turbo`

---

## Phase 8: Rollback Plan

If critical issues are discovered:

1. **Immediate rollback:**
   ```bash
   git checkout master
   ```

2. **Partial rollback (keep some changes):**
   - Revert specific commits
   - Keep Link updates, revert component conversions

3. **Dependency rollback:**
   ```bash
   git checkout master -- package.json package-lock.json
   npm install
   ```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Third-party library incompatibility | Low | Medium | Test in isolation first |
| Route-based modal regression | Medium | High | Thorough E2E testing |
| Analytics tracking breaks | Medium | Medium | Test with dev tools |
| Build failure | Low | High | Incremental updates |
| TypeScript errors | Medium | Low | Fix as encountered |
| `next-export-optimize-images` incompatibility | Low | High | Check changelog, test images |
| MDX Link rendering issues | Low | Medium | Test all MDX pages manually |
| react-bootstrap Link integration | Medium | Medium | Test Nav.Link and Button as Link |
| ESLint config conflicts | Low | Low | Keep ESLint 8 initially |

### Verified Non-Issues (No Risk)

Based on codebase analysis, these React 19 / Next.js 15 breaking changes do NOT apply:

**React 19:**
- ✅ No `useRef` without arguments
- ✅ No `forwardRef` usage
- ✅ No `PropTypes` usage
- ✅ No `defaultProps` on function components
- ✅ No string refs
- ✅ No legacy Context API
- ✅ No `findDOMNode` usage
- ✅ No `react-dom/test-utils` imports
- ✅ No `react-test-renderer` usage
- ✅ No `ReactDOM.render` or `ReactDOM.hydrate` calls
- ✅ No implicit ref callback returns
- ✅ No `useFormState` or `useFormStatus` usage

**Next.js 15:**
- ✅ No async cookies/headers/params (Pages Router, not App Router)
- ✅ No `runtime = 'experimental-edge'` configuration
- ✅ No `@next/font` usage (uses custom font loading)
- ✅ No API routes with GET handlers needing cache config
- ✅ No `fetchCache` segment configs
- ✅ No `geo` or `ip` usage on NextRequest
- ✅ No Speed Insights auto-instrumentation

---

## Files Changed Summary

### Must Modify - Class Components (7 files)
- `components/AsyncButton.js` - Convert class → function
- `components/Layout.js` - Convert class + update 5 Links
- `components/Analytics.js` - Convert class + remove withRouter
- `components/modals/RouteHashBasedModal.js` - Convert class + remove withRouter
- `components/modals/Download.js` - Convert Tabs class
- `components/sections/ContactSection.js` - Convert class
- `components/sections/NewsletterSection.js` - Convert class

### Must Modify - Link Updates (6 additional files)
- `components/Teaser.js` - Update 2 Links (remove passHref)
- `components/sections/BulletsSection.js` - Update 1 Link (remove passHref)
- `pages/howitworks.mdx` - Update 1 Link (remove passHref)
- `pages/comparison.mdx` - Update 1 Link (remove passHref)
- `pages/tutorial.mdx` - Update 1 Link (remove passHref)
- `__mocks__/next/link.js` - Update mock to not require legacyBehavior/passHref

### Must Update (1 file)
- `package.json` - Update dependencies

### Should Review (4 files)
- `components/RoutingListener.tsx` - Router imports
- `components/AlternatingSections.tsx` - React.cloneElement usage
- `jest.setup.js` - Remove deprecation suppressions after upgrade
- `next-export-optimize-images` - Verify Next.js 15 compatibility

### No Changes Needed
- `pages/_document.js` - Document class is required by Next.js
- All `.tsx` functional components
- All test files (Testing Library 16.x is compatible)
- `next.config.js` - Should work as-is
- `.eslintrc.json` - ESLint 8 still supported
- Playwright configuration
- Jest configuration

---

## Codemods Available

### React 19 Codemods

React provides official codemods to help automate migrations:

```bash
# Full React 19 migration recipe
npx codemod@latest react/19/migration-recipe

# TypeScript-specific changes
npx types-react-codemod@latest preset-19 ./frontend
```

Available React 19 codemods:
- `no-implicit-ref-callback-return` - Fix ref callbacks with implicit returns
- `refobject-defaults` - Update RefObject usage
- `useRef-required-initial` - Add missing useRef arguments

### Next.js 15 Codemods

```bash
# Upgrade CLI (recommended)
npx @next/codemod@canary upgrade latest

# Specific codemods
npx @next/codemod@latest next-async-request-api ./frontend  # For async APIs
npx @next/codemod@latest new-link ./frontend                 # For Link component
```

### Recommendation for This Codebase

Manual conversion is recommended because:
1. Class → function conversion requires understanding component logic
2. withRouter → useRouter requires context-aware changes
3. The codebase is small enough (7 class components) for manual migration
4. MDX files need manual Link updates (codemods may not handle MDX)

However, you can run the codemods first to catch any issues:
```bash
# Dry run to see what would change
npx @next/codemod@latest new-link ./frontend --dry
npx types-react-codemod@latest preset-19 ./frontend --dry
```

---

## Success Criteria

- [ ] All unit tests pass
- [ ] All E2E tests pass
- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] No console errors in browser
- [ ] No React deprecation warnings
- [ ] All modals function correctly
- [ ] Analytics events fire correctly
- [ ] Forms submit correctly
- [ ] Navigation works on desktop and mobile

---

## References

### React 19
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide) - Official migration guide
- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19) - Full changelog
- [React 19.2 Release Notes](https://react.dev/blog/2025/10/01/react-19-2) - Latest patch notes
- [React Codemod](https://github.com/reactjs/react-codemod) - Automated migration tools
- [Types React Codemod](https://github.com/eps1lon/types-react-codemod) - TypeScript migration

### Next.js 15
- [Next.js 15 Release Notes](https://nextjs.org/blog/next-15) - Official announcement
- [Next.js 15 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-15) - Migration documentation
- [Next.js Codemods](https://nextjs.org/docs/app/guides/upgrading/codemods) - Automated migration tools
- [Async Dynamic APIs](https://nextjs.org/docs/messages/sync-dynamic-apis) - Breaking change details

### Community Resources
- [MUI X React 19 Migration](https://mui.com/blog/react-19-update/) - Real-world migration experience
- [React 18 to 19 Migration - Codemod.com](https://docs.codemod.com/guides/migrations/react-18-19) - Additional tooling
