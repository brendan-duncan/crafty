import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    open: '/tests/cube_test.html',
  },
  build: {
    rollupOptions: {
      input: {
        cube_test: 'tests/cube_test.html',
      },
    },
  },
});
