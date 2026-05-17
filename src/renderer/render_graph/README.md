# Render Graph

The renderer's dependency-graph builder. Used by every consumer in the repo (the crafty game in `crafty/main.ts` + `crafty/renderer_setup.ts`, and every sample under `samples/`).

## Capabilities

- Per-frame graph compilation with culling and topological sorting
- Physical resource pooling (`PhysicalResourceCache`) and persistent resources across frames
- Builder pattern (`PassBuilder`) with automatic versioning of resource handles
- Render-graph visualization in `src/renderer/render_graph/ui/render_graph_viz.ts`

## Architecture

- `RenderGraph` — per-frame graph builder, compiler, and executor
- `PassBuilderImpl` — internal pass setup builder with versioned resource tracking
- `PhysicalResourceCache` — pool of GPU textures/buffers reused across frames
- Types in `types.ts` — resource handles, descriptors, usage flags

## Tests

Unit tests are in `tests/renderer/render_graph/`.
