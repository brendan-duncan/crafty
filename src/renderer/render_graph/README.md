# Render Graph (WIP)

This directory contains a **work-in-progress** new render graph API being developed as a replacement for the original `src/renderer/render_graph.ts`.

## Status

- Core graph compilation, culling, and topological sorting are functional
- Physical resource pooling and persistent resource management work
- Pass system uses a builder pattern (`PassBuilder`) with automatic versioning of resource handles
- Render graph visualization is in `src/renderer/render_graph/ui/render_graph_viz.ts`

The crafty game (`crafty/main.ts` + `crafty/renderer_setup.ts`) and all `samples/rg_*.ts` samples use this system. The old `src/renderer/render_graph.ts` is still used by non-`rg_*` samples and is being phased out.

## Architecture

- `RenderGraph` — per-frame graph builder, compiler, and executor
- `PassBuilderImpl` — internal pass setup builder with versioned resource tracking
- `PhysicalResourceCache` — pool of GPU textures/buffers reused across frames
- Types in `types.ts` — resource handles, descriptors, usage flags

## Tests

Unit tests are in `tests/renderer/render_graph/`.
