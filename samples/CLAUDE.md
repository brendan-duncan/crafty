# Samples

Each sample is a `<name>.html` + `<name>.ts` pair served by Vite. They're entry points for ad-hoc demos and for exercising the new render graph in isolation.

## Two flavors

- **`rg_*.ts`** — use the **new** render graph ([src/renderer/render_graph/](../src/renderer/render_graph/)).
- **Everything else** — use the **old** render graph ([src/renderer/render_graph.ts](../src/renderer/render_graph.ts)) or hand-roll `RenderPass` instances directly.

When adding a new sample, pick one or the other. Don't mix.

## Structure (typical sample)

```ts
async function main(): Promise<void> {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = await RenderContext.create(canvas, { enableErrorHandling: true });
  // ... create meshes, materials, passes ...
  function frame(): void {
    ctx.update();
    // update pass uniforms
    // (new RG) build graph, compile, execute
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
main().catch(err => { /* show in DOM */ });
```

`rg_forward.ts` is the cleanest reference for the new-graph pattern, including the optional render-graph viz overlay (press `G`).

## Special files

- [terraforming/](terraforming/) — marching cubes density/march/render shaders + LUTs (shared by `terraforming_test.ts`).
- [procedural_test.wgsl](procedural_test.wgsl) — sample-local shader.
- [index.html](index.html) — sample picker / launcher.
