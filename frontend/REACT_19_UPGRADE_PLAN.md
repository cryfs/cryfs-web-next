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

**Estimated Effort:** Medium-High (7 class components to convert, 2 HOC patterns to replace, 5 Link updates)

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

### 3.2 Remove Legacy Link Behavior (1 file)

**File: `components/Layout.js`**
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

Remove all 5 instances of `legacyBehavior` and `passHref` props.

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

### 4.3 useEffect Timing Changes

React 19 has stricter timing for `useEffect` cleanup. Review cleanup functions in:
- `components/RoutingListener.tsx`
- Converted components with route listeners

### 4.4 Hydration Error Improvements

React 19 provides better hydration error messages. After upgrade, run `npm run build && npm start` and verify no hydration mismatches in the console.

---

## Phase 5: Next.js 15 Specific Changes

### 5.1 App Router Consideration

Next.js 15 encourages the App Router (`app/` directory), but Pages Router (`pages/`) is still fully supported. The current codebase uses Pages Router, which will continue to work.

**Recommendation:** Keep Pages Router for this upgrade. App Router migration can be a separate future initiative.

### 5.2 next.config.js Updates

Review `/home/user/cryfs-web-next/frontend/next.config.js` for deprecated options:
- `swcMinify` - Now default, can be removed if present
- `experimental.appDir` - No longer experimental

### 5.3 Image Component Changes

Next.js 15 has updated Image component behavior. Review any `<Image>` components for:
- `fill` prop changes
- `priority` prop behavior
- Blur placeholder handling

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

3. **Fix Link components** (Phase 3.2)
   - Quick win, low risk
   - Update Layout.js

4. **Convert Analytics component** (Phase 3.1)
   - Highest risk component (withRouter + lifecycle)
   - Test route change tracking

5. **Convert RouteHashBasedModal** (Phase 3.1)
   - Tests modal functionality
   - Verify Download/Donate modals work

6. **Convert remaining class components** (Phase 3.1)
   - AsyncButton
   - MyNavBar
   - Tabs
   - ContactSection
   - NewsletterSection

7. **Run full test suite**
   - Unit tests
   - E2E tests
   - Manual testing

8. **Fix any remaining issues**

9. **Update documentation**
   - Update CLAUDE.md to remove "class components are used"
   - Update any component documentation

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

---

## Files Changed Summary

### Must Modify (7 files)
- `components/AsyncButton.js` - Convert class → function
- `components/Layout.js` - Convert class + update Links
- `components/Analytics.js` - Convert class + remove withRouter
- `components/modals/RouteHashBasedModal.js` - Convert class + remove withRouter
- `components/modals/Download.js` - Convert Tabs class
- `components/sections/ContactSection.js` - Convert class
- `components/sections/NewsletterSection.js` - Convert class

### Must Update (1 file)
- `package.json` - Update dependencies

### Should Review (3 files)
- `components/RoutingListener.tsx` - Router imports
- `components/AlternatingSections.tsx` - React.cloneElement usage
- `jest.setup.js` - Remove deprecation suppressions

### No Changes Needed
- `pages/_document.js` - Document class is required by Next.js
- All `.tsx` functional components
- All test files (Testing Library 16.x is compatible)
- `next.config.js` - Should work as-is
- Playwright configuration
- Jest configuration

---

## Codemods Available

React provides official codemods to help automate some migrations:

```bash
npx codemod@latest react/19/migration-recipe
```

However, for this codebase, manual conversion is recommended because:
1. Class → function conversion requires understanding component logic
2. withRouter → useRouter requires context-aware changes
3. The codebase is small enough for manual migration

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

- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)
- [Next.js 15 Release Notes](https://nextjs.org/blog/next-15)
- [React Codemod](https://github.com/reactjs/react-codemod)
