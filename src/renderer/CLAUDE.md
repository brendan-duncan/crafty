# Renderer

WebGPU rendering layer. All pass wiring goes through [render_graph/](render_graph/).

## Files in this directory

- [render_context.ts](render_context.ts) — owns `GPUDevice`, canvas context, surface format, frame timing, error scope helpers.
- [material.ts](material.ts) — base `Material` class + `MaterialPassType` enum (Opaque/Transparent/Shadow).
- [materials/pbr_material.ts](materials/pbr_material.ts) — PBR material (albedo, roughness, metallic, optional transparency).
- [directional_light.ts](directional_light.ts), [point_light.ts](point_light.ts), [spot_light.ts](spot_light.ts) — light types (plain interfaces / small classes, not `Component`s; those live under [../engine/components/](../engine/components/)).
- [render_graph/](render_graph/) — render graph API and all pass classes (see its own CLAUDE.md).

## Common pass patterns

- Pass classes have a static `create(ctx)` that compiles pipelines/BGLs once. Per-frame state is set via `updateX(...)` methods on the instance before adding to the graph.
- HDR working format is `rgba16float`. Backbuffer is the canvas surface format (queried from `ctx`).
- All uniform/storage buffer sizes are 16-byte aligned; check existing pass constants (e.g. `CAMERA_UNIFORM_SIZE`) before adding new fields.
