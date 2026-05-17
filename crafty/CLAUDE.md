# Crafty (game)

The actual game built on top of [src/](../src/). Engine code stays in `src/`; anything game-specific (entities, AI, UI chrome, world generation tuning) goes here.

## Layout

- [main.ts](main.ts) — game entry point. Sets up `RenderContext`, scene, world, networking, input; per-frame uploads pass uniforms and calls `passes.render(ctx, frameDeps)`.
- [renderer_setup.ts](renderer_setup.ts) — wires up the deferred-rendering pipeline on the **new** render graph: owns persistent pass instances and builds a fresh `RenderGraph` each frame inside `render()`.
- [config/](config/) — gameplay-visible tuning: effect settings, particle configs.
- [game/](game/) — runtime game systems.
  - [entities/](game/entities/) — concrete entities (creeper, duck, pig, bee).
  - [components/](game/components/) — AI components attached to entities.
  - [world_storage.ts](game/world_storage.ts) — chunk persistence.
  - [network_client.ts](game/network_client.ts), [remote_player.ts](game/remote_player.ts) — multiplayer client side, talks to [../server/](../server/) over the protocol in [../shared/net_protocol.ts](../shared/net_protocol.ts).
  - [village_gen.ts](game/village_gen.ts), [heightmap.ts](game/heightmap.ts), [weather_system.ts](game/weather_system.ts), [animal_spawner.ts](game/animal_spawner.ts), [block_interaction.ts](game/block_interaction.ts), [audio_manager.ts](game/audio_manager.ts), [lights.ts](game/lights.ts), [touch_controls.ts](game/touch_controls.ts) — self-explanatory game systems.
- [ui/](ui/) — DOM UI: launcher, HUD, hotbar, menu, control panel, block manager.

## Conventions

- Game code uses the **new** render graph ([../src/renderer/render_graph/](../src/renderer/render_graph/)). New passes go under [../src/renderer/render_graph/passes/](../src/renderer/render_graph/passes/); wire them into the per-frame graph build in [renderer_setup.ts](renderer_setup.ts).
- Entities extend `GameObject` and compose `Component`s. AI lives in components in [game/components/](game/components/).
- Multiplayer is authoritative on the server; client-side prediction is minimal. Wire format in [../shared/net_protocol.ts](../shared/net_protocol.ts).
