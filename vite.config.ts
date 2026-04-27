import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    open: '/game/crafty/index.html',
  },
  build: {
    rollupOptions: {
      input: {
        crafty:    'game/crafty/index.html',
        cube_test: 'tests/cube_test.html',
      },
    },
  },
});
