# Render Graph (new API)

Dependency-graph builder with virtual resources, culling, topo sort, and pooled physical GPU objects. Replacing the old `src/renderer/render_graph.ts`. See [README.md](README.md) for status.

## Core types — [types.ts](types.ts)

- `ResourceHandle { id, version }` — opaque virtual ref. Each `write` returns a new version; reads of an older version are stale and rejected by the compiler.
- `TextureDesc` / `BufferDesc` — virtual allocation params. `extraUsage` is only needed when the pass uses the resource in a way the graph can't infer (e.g. external mipmap gen).
- `ResourceUsage` — `'attachment' | 'depth-attachment' | 'depth-read' | 'sampled' | 'storage-read' | 'storage-write' | 'storage-read-write' | 'uniform' | 'vertex' | 'index' | 'indirect' | 'copy-src' | 'copy-dst'`. Drives both usage flags and which encoder type the graph creates.
- `AttachmentOptions` — `loadOp`/`storeOp`/`clearValue`/`view` for attachments. `resolveTarget` must point at a separately-declared `'attachment'` write handle.
- `PassType` — `'render' | 'compute' | 'transfer'`.

## Pass class — [pass.ts](pass.ts)

```ts
abstract class Pass<TDeps, TOutputs> {
  abstract readonly name: string;
  abstract addToGraph(graph: RenderGraph, deps: TDeps): TOutputs;
  destroy(): void;
}
```

Convention: constructor builds long-lived state (pipelines, BGLs, persistent buffers). `addToGraph` calls `graph.addPass(name, type, b => { ... })` **exactly once** and uses the `PassBuilder` to declare reads/writes/transients and register the execute callback. `destroy` releases owned GPU objects.

## RenderGraph lifecycle (per frame)

1. `const graph = new RenderGraph(ctx, cache)` — `cache` is a long-lived `PhysicalResourceCache`.
2. `pass.addToGraph(graph, deps)` for each pass.
3. `graph.setBackbuffer('canvas')` once.
4. `const compiled = graph.compile()` — validates, culls unused passes, topo-sorts, binds physical resources.
5. `graph.execute(compiled)` — records and submits one command buffer.

`PhysicalResourceCache` is owned outside the graph and lives across frames (pools transients, persists persistent resources). Call `cache.trimUnused()` on resize.

## Built-in passes — [passes/](passes/)

Each is a `Pass` subclass with its own `Deps`/`Outputs` interfaces. Filenames mirror the old-API passes under [../passes/](../passes/) — different code, same names. Common pattern: static `create(ctx)` factory, per-frame `update*` setters, `addToGraph` declares I/O.

## Factories — [factories/](factories/)

Pre-wired graph builders. `DeferredGraphFactory` owns one persistent instance of every deferred pass and wires them per frame; use it when you want the full pipeline.

## Index — [index.ts](index.ts)

Public re-exports: types, `Pass`, `PassBuilder`, `RenderGraph`, `CompiledGraph`, `PhysicalResourceCache`.

## Authoring a new pass — checklist

- Extend `Pass<Deps, Outputs>` with `name = 'YourPassName'`.
- In `addToGraph`, call `graph.addPass(this.name, 'render'|'compute'|'transfer', b => ...)`.
- Inside the builder callback: declare every resource you read/write with the correct `ResourceUsage`. Don't access resources outside what you declared — the compiler won't insert barriers for them.
- For attachments, pass `AttachmentOptions` — do **not** build a `GPURenderPassDescriptor` in the execute callback; the graph builds it.
- Return new handles from writes as your `Outputs`.
- Implement `destroy()` if you own pipelines/buffers/samplers.

## Tests

[tests/renderer/render_graph/](../../../tests/renderer/render_graph/).
