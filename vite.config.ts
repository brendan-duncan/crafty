import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: './',
  root: 'crafty',
  server: {
    port: 5173,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
