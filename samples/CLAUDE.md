# Samples

Each sample is a `<name>.html` + `<name>.ts` pair served by Vite. They're entry points for ad-hoc demos and for exercising the new render graph in isolation.

All samples use the **new** render graph ([src/renderer/render_graph/](../src/renderer/render_graph/)). The `rg_*.ts` files are the small, focused reference samples (forward/deferred wiring, the render-graph viz, etc.); the others are the larger demos (clouds, terraforming, animal display, procedural materials).

When adding a new sample, register it in [../vite.config.ts](../vite.config.ts) under `rollupOptions.input` and add it to the launcher list in [index.html](index.html).

## Structure (typical sample)

```ts
async function main(): Promise<void> {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = await RenderContext.create(canvas, { enableErrorHandling: true });
  const cache = new PhysicalResourceCache(ctx.device);
  // ... create meshes, materials, persistent pass instances ...
  function frame(): void {
    ctx.update();
    // update per-frame pass uniforms via pass.updateX(ctx, ...)
    const graph = new RenderGraph(ctx, cache);
    const bb = graph.setBackbuffer('canvas');
    // pass.addToGraph(graph, deps) for each pass
    void graph.execute(graph.compile());
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
main().catch(err => { /* show in DOM */ });
```

`rg_forward_full.ts` and `rg_deferred_full.ts` are the cleanest references for the new-graph pattern, including the optional render-graph viz overlay (press `G`).

## Special files

- [terraforming/](terraforming/) — marching cubes density/march/render shaders + LUTs (shared by `terraforming_test.ts`).
- [procedural_test.wgsl](procedural_test.wgsl) — sample-local shader.
- [index.html](index.html) — sample picker / launcher.
