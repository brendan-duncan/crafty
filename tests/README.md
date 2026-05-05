# Crafty Tests

Unit tests for the Crafty game engine using Vitest.

## Running Tests

```bash
# Run tests in watch mode (re-runs on file changes)
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

- `tests/math/` - Tests for math utilities (Vec3, Mat4, etc.)
- `tests/block/` - Tests for block types and materials
- `tests/utils/` - Tests for utility functions (halton sequence, etc.)

## Writing Tests

Tests use Vitest which has a Jest-compatible API:

```typescript
import { describe, it, expect } from 'vitest';

describe('MyModule', () => {
  it('should do something', () => {
    expect(true).toBe(true);
  });
});
```

## Coverage

Coverage reports are generated in the `coverage/` directory when running:
```bash
npm run test:coverage
```

Open `coverage/index.html` in a browser to view the detailed report.
