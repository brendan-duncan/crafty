# Crafty

WebGPU voxel game engine in TypeScript. Deferred + HDR multi-pass renderer, infinite chunked world, component-based game objects.

## Layout

- `src/` — engine library (math, engine, renderer, assets, block, particles, shaders).
- `crafty/` — the game built on top of the engine (entry `crafty/main.ts`, UI, AI components, world gen).
- `samples/` — standalone HTML+TS demos. `rg_*.ts` exercise the new render graph; others use the old one.
- `tests/` — vitest unit tests, mirrors `src/` layout.
- `server/` — separate npm package, authoritative multiplayer WebSocket server.
- `shared/` — code shared between client and server (currently just `net_protocol.ts`).
- `docs/` — companion book (markdown chapters under `docs/chapters/`).
- `dist/`, `node_modules/` — generated, ignore.

## Conventions

- **Import paths use `.js` extension on TypeScript files** (ESM/bundler resolution). `import { Foo } from './foo.js'` resolves `./foo.ts`. Do not omit the extension.
- `"type": "module"`, target ES2022, `strict: true`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`. Unused params/locals fail the build.
- File names: `snake_case.ts`. Types/classes inside: `PascalCase`. Members: `camelCase`. Constants: `SCREAMING_SNAKE`.
- WGSL shaders live in `src/shaders/*.wgsl`, included via `vite-plugin-glsl` (`?raw` or default import).
- WebGPU types come from `@webgpu/types` (already in tsconfig `types`), no extra imports needed.

## Commands

```sh
npm run dev          # vite dev server at http://localhost:5173/crafty/
npm run build        # tsc && vite build → dist/
npm test             # vitest watch
npm run test:run     # vitest one-shot
npm run server       # multiplayer server (after server:install)
```

No lint script. Type-check via `npm run build` or `tsc --noEmit`.

## Render Graph: two systems coexist

This is the single biggest gotcha — keep them straight:

- **New API** — [src/renderer/render_graph/](src/renderer/render_graph/) directory: real dependency-graph builder with virtual resources, culling, pooled physical resources, `Pass` base class with typed deps/outputs. Used by the game ([crafty/main.ts](crafty/main.ts) + [crafty/renderer_setup.ts](crafty/renderer_setup.ts)) and by `samples/rg_*.ts`.
- **Old API** — [src/renderer/render_graph.ts](src/renderer/render_graph.ts): linear ordered list of `RenderPass` instances. Still used by non-`rg_*` samples; being phased out.

When asked to add/modify a pass, first determine which system the calling code uses. Pass classes for the new system live under [src/renderer/render_graph/passes/](src/renderer/render_graph/passes/); old-system passes are in [src/renderer/passes/](src/renderer/passes/). Same filenames, different APIs.

## Where to look

- Math primitives (Vec3, Mat4, Quaternion, noise, random): [src/math/](src/math/)
- Asset loading (mesh, gltf, hdr, ibl, texture, shader): [src/assets/](src/assets/)
- GameObject / Component / Scene: [src/engine/](src/engine/), components in [src/engine/components/](src/engine/components/)
- Block/chunk/world: [src/block/](src/block/)
- Game-specific entities & AI: [crafty/game/](crafty/game/)
- Particles: [src/particles/](src/particles/) + shader templates in [src/shaders/particles/](src/shaders/particles/)
