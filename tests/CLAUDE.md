# Tests

Vitest. Layout mirrors [src/](../src/) — e.g. tests for `src/math/vec3.ts` go in `tests/math/vec3.test.ts`.

## Running

```sh
npm test           # watch mode
npm run test:run   # one-shot
npm run test:ui    # Vitest UI
npm run test:coverage
```

## Conventions

- Vitest API is Jest-compatible: `describe`, `it`, `expect`, `beforeEach`, etc.
- File name pattern: `*.test.ts`.
- Imports use `.js` extensions (same as `src/`), e.g. `import { Vec3 } from '../../src/math/vec3.js'`.
- These are **unit** tests. No real `GPUDevice`. If a unit needs GPU, either factor the GPU-touching part out behind an interface and test the rest, or write a sample under [samples/](../samples/) instead.
- See [README.md](README.md) for the existing dir overview.
