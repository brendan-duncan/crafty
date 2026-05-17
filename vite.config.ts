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
         cloud_test: 'samples/cloud_test.html',
         procedural_test: 'samples/procedural_test.html',
         terraforming_test: 'samples/terraforming_test.html',
         animal_test: 'samples/animal_test.html',
         rg_procedural: 'samples/rg_procedural.html',
         rg_forward_simple: 'samples/rg_forward_simple.html',
         rg_forward_full: 'samples/rg_forward_full.html',
         rg_deferred_simple: 'samples/rg_deferred_simple.html',
         rg_deferred_full: 'samples/rg_deferred_full.html',
         rg_engine_test: 'samples/rg_engine_test.html',
        }
    }
  },
  assetsInclude: ['**/*.wav'],
});
