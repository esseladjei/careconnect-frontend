# Test Organization Structure

## Directory Layout

```
frontend/
├── tests/                           # All tests in one organized place
│   ├── setup.ts                     # Global test setup
│   ├── helpers/                     # Test utilities
│   │   └── test-utils.tsx          # Custom render with providers
│   ├── unit/                        # Unit tests for utilities/functions
│   │   └── phoneValidation.test.ts
│   ├── components/                  # Component tests
│   │   └── PhoneInput.test.tsx
│   └── hooks/                       # Hook tests
│       └── usePhoneValidation.test.ts
└── src/                             # Source code (NO tests here)
    ├── components/
    ├── hooks/
    └── utils/
```

## Benefits

✅ **Clean separation** - Tests separate from source code
✅ **Easy to find** - All tests in one place
✅ **Scalable** - Easy to add more test categories
✅ **Clear structure** - Mirrors src/ structure

## Test Categories

### 1. `tests/unit/` - Unit Tests

For testing pure functions, utilities, and business logic.

**Example:**

```typescript
// tests/unit/phoneValidation.test.ts
import {validateGhanaPhoneNumber} from '../../src/utils/phoneValidation';

describe('validateGhanaPhoneNumber', () => {
    it('validates MTN numbers', () => {
        expect(validateGhanaPhoneNumber('0241234567').isValid).toBe(true);
    });
});
```

### 2. `tests/components/` - Component Tests

For testing React components.

**Example:**

```typescript
// tests/components/Button.test.tsx
import {render, screen} from '../helpers/test-utils';
import Button from '../../src/components/Button';

describe('Button', () => {
    it('renders text', () => {
        render(<Button>Click
        me < /Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });
});
```

### 3. `tests/hooks/` - Hook Tests

For testing custom React hooks.

**Example:**

```typescript
// tests/hooks/useCounter.test.ts
import {renderHook, act} from '@testing-library/react';
import {useCounter} from '../../src/hooks/useCounter';

describe('useCounter', () => {
    it('increments count', () => {
        const {result} = renderHook(() => useCounter());

        act(() => {
            result.current.increment();
        });

        expect(result.current.count).toBe(1);
    });
});
```

### 4. `tests/helpers/` - Test Utilities

Shared testing utilities and helpers.

**Files:**

- `test-utils.tsx` - Custom render with providers
- Add more helpers as needed

## Adding New Tests

### For a new utility function:

```bash
# Create: tests/unit/myFunction.test.ts
```

### For a new component:

```bash
# Create: tests/components/MyComponent.test.tsx
```

### For a new hook:

```bash
# Create: tests/hooks/useMyHook.test.ts
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test phoneValidation

# Run tests in a category
npm test tests/unit
npm test tests/components
npm test tests/hooks

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage
```

## Import Patterns

### For component tests:

```typescript
import {render, screen} from '../helpers/test-utils';
import MyComponent from '../../src/components/MyComponent';
```

### For unit tests:

```typescript
import {myFunction} from '../../src/utils/myFunction';
```

### For hook tests:

```typescript
import {renderHook, act} from '@testing-library/react';
import {useMyHook} from '../../src/hooks/useMyHook';
```

## Key Points

1. **Never put tests in `src/`** - Keep all tests in `tests/`
2. **Mirror the structure** - `tests/components/` matches `src/components/`
3. **Use test-utils** - Import from `../helpers/test-utils` for components
4. **Follow naming** - `*.test.ts` or `*.test.tsx` for all test files

## Configuration

The test setup is configured in:

- `vitest.config.ts` - Points to `tests/` directory
- `tests/setup.ts` - Global test setup (runs before all tests)
- `tests/helpers/test-utils.tsx` - Custom render utilities

## Future Extensions

You can add more categories as needed:

```
tests/
├── unit/           # Pure functions
├── components/     # React components
├── hooks/          # Custom hooks
├── integration/    # Integration tests (future)
├── e2e/            # End-to-end tests (future)
└── helpers/        # Shared utilities
```

---

**Clean, organized, and scalable! 🎉**
