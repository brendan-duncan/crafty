import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  root: './',
  server: {
    port: 5173,
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    rollupOptions: {
       input: {
         main: 'crafty/index.html',
         index: 'index.html',
         samples: 'samples/index.html',
         engine_test: 'samples/engine_test.html',
         cloud_test: 'samples/cloud_test.html',
         cascade_shadow_test: 'samples/cascade_shadow_test.html',
         forward_test: 'samples/forward_test.html',
         procedural_test: 'samples/procedural_test.html',
         terraforming_test: 'samples/terraforming_test.html',
         animal_test: 'samples/animal_test.html',
       }
    }
  },
  assetsInclude: ['**/*.wav'],
});
