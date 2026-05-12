import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: './',
  root: './',
  server: {
    port: 5173,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'crafty/index.html'
      }
    }
  },
  assetsInclude: ['**/*.wav'],
});
