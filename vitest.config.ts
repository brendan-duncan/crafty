import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts', 'crafty/**/*.ts'],
      exclude: [
        'src/**/*.test.ts',
        'tests/**/*',
        '**/*.d.ts',
        '**/node_modules/**',
      ],
    },
  },
});
