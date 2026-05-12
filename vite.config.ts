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
        main: 'crafty/index.html',
        directory: 'index.html',
        cube_test: 'samples/cube_test.html',
        cloud_test: 'samples/cloud_test.html',
        cascade_shadow_test: 'samples/cascade_shadow_test.html',
        forward_test: 'samples/forward_test.html',
        procedural_test: 'samples/procedural_test.html',
      }
    }
  },
  assetsInclude: ['**/*.wav'],
});
