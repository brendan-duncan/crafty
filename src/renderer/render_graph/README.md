# Render Graph (WIP)

This directory contains a **work-in-progress** new render graph API being developed as a replacement for the original `src/renderer/render_graph.ts`.

## Status

- Core graph compilation, culling, and topological sorting are functional
- Physical resource pooling and persistent resource management work
- Pass system uses a builder pattern (`PassBuilder`) with automatic versioning of resource handles
- Render graph visualization is in `src/renderer/render_graph/ui/render_graph_viz.ts`

The old `src/renderer/render_graph.ts` (Replaced by this new system) is still used by the crafty editor (`crafty/main.ts`), while this new system is exercised by the engine test sample (`samples/engine_test_rg.ts`) and the render graph slice sample (`samples/render_graph_slice/`).

## Architecture

- `RenderGraph` — per-frame graph builder, compiler, and executor
- `PassBuilderImpl` — internal pass setup builder with versioned resource tracking
- `PhysicalResourceCache` — pool of GPU textures/buffers reused across frames
- Types in `types.ts` — resource handles, descriptors, usage flags

## Tests

Unit tests are in `tests/renderer/render_graph/`.
