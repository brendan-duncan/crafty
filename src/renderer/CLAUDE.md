# Renderer

WebGPU rendering layer. Two render-graph systems coexist — see root CLAUDE.md.

## Files in this directory

- [render_context.ts](render_context.ts) — owns `GPUDevice`, canvas context, surface format, frame timing, error scope helpers.
- [render_graph.ts](render_graph.ts) — **old API**. Linear list of `RenderPass`. Used by the game ([crafty/main.ts](../../crafty/main.ts)).
- [render_pass.ts](render_pass.ts) — old API base class. Has `execute(encoder, ctx)` and an `enabled` flag.
- [gbuffer.ts](gbuffer.ts) — old-style G-buffer attachment set (albedo, normal, depth, etc).
- [material.ts](material.ts) — base `Material` class + `MaterialPassType` enum (Opaque/Transparent/Shadow).
- [materials/pbr_material.ts](materials/pbr_material.ts) — PBR material (albedo, roughness, metallic, optional transparency).
- [directional_light.ts](directional_light.ts), [point_light.ts](point_light.ts), [spot_light.ts](spot_light.ts) — light types (plain interfaces / small classes, not `Component`s; those live under [../engine/components/](../engine/components/)).
- [passes/](passes/) — **old-API passes**. Filenames mirror the new ones under [render_graph/passes/](render_graph/passes/) — don't mix them up.
- [render_graph/](render_graph/) — **new render-graph API** (see its own CLAUDE.md).

## Picking which graph to use

| If the calling code is...                  | Use                                               |
| ------------------------------------------ | ------------------------------------------------- |
| [crafty/main.ts](../../crafty/main.ts) game | Old (`render_graph.ts` + `passes/`)              |
| `samples/rg_*.ts`                          | New (`render_graph/` + `render_graph/passes/`)   |
| Other `samples/*.ts`                       | Old                                               |
| New code from scratch                      | New — old API is being phased out                 |

## Common patterns (both APIs)

- Pass classes are typically constructed with a static `create(ctx)` that compiles pipelines/BGLs once. Per-frame state is set via `updateX(...)` methods on the instance before adding to the graph.
- HDR working format is `rgba16float`. Backbuffer is the canvas surface format (queried from `ctx`).
- All uniform/storage buffer sizes are 16-byte aligned; check existing pass constants (e.g. `CAMERA_UNIFORM_SIZE`) before adding new fields.
