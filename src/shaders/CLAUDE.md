# Shaders (WGSL)

Loaded via `vite-plugin-glsl`. Import a `.wgsl` file and you get its source as a string.

## Layout

- Top-level `*.wgsl` — full pass shaders (e.g. `forward_pbr.wgsl`, `geometry.wgsl`, `composite.wgsl`).
- [modules/](modules/) — reusable snippets that get textually included by other shaders (`camera.wgsl`, `lighting.wgsl`, `model.wgsl`).
- [particles/](particles/) — particle compute + render variants.

`vite-plugin-glsl` resolves `#include` directives. Use those rather than concatenating strings in TS.

## Conventions

- WebGPU spec WGSL only (no GLSL leftovers).
- Common helpers (HDR encode/decode, lighting math, camera struct) live in `common.wgsl` or `modules/`. Look there before re-deriving math.
- Bind group numbering is per-pass; align with what the host-side pass code declares in its bind-group layout.
- HDR textures are `rgba16float`. Depth is typically `depth32float` or `depth24plus`; check the calling pass.

## Shader preprocessing helper

[../assets/preprocess_shader.ts](../assets/preprocess_shader.ts) exists for runtime macro expansion (used when shader variants depend on JS state). For static includes prefer `vite-plugin-glsl`'s `#include`.
