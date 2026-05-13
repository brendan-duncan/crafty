# Chapter 23: The Road Ahead

[Contents](../crafty.md) | [22-Tools](22-tools.md)

Crafty is a living project. This chapter outlines the planned features and directions for future development.

## 23.1 Ray Tracing with WebGPU

WebGPU includes experimental support for ray tracing through the `"ray-tracing"` feature flag (available in Chrome Canary). Future versions of Crafty could implement:

- **Hardware-accelerated ray traced shadows** — replacing cascade shadow maps with single-pass ray traced shadows that are perfectly sharp at any distance.
- **Ray traced ambient occlusion** — more accurate than screen-space SSAO.
- **Ray traced reflections** — perfect mirror and water reflections without screen-space limitations.
- **Path-traced preview** — a pure path tracing mode for offline-quality screenshots.

```typescript
// Future: ray tracing pipeline
const rtPipeline = device.createRayTracingPipeline({
  libraries: [shaderModule],
  maxPayloadSize: 16,
  maxAttributeSize: 8,
  maxRecursionDepth: 4,
});
```

## 23.2 Compute Shader Post-Processing

Several post-processing effects could benefit from compute shader implementations:

- **Compute bloom** — faster separable blur via shared memory in workgroups.
- **Compute DOF** — tile-based depth of field with variable-radius gather.
- **Compute TAA** — neighbourhood sampling with shared memory.

```typescript
// Future: compute-based post-processing
const computePipeline = device.createComputePipeline({
  compute: { module: bloomComputeShader, entryPoint: 'cs_bloom' },
});
```

## 23.3 Procedural Generation at Scale

The terrain generation system will be extended with:

- **Infinite terrain** — seamless generation in all directions using a hash-based coordinate system.
- **Cave systems** — 3D cellular automata and Perlin worm caves.
- **Biome diversity** — more biomes (jungle, swamp, tundra, mesa) with unique vegetation and block types.
- **Structure generation** — trees, villages, dungeons placed by rule-based and template-based generation.
- **LOD system for generation** — distant chunks use lower-octave noise for faster generation.

## 23.4 WebXR

- **WebXR integration** — immersive VR mode using `XRSession` with WebGPU as the rendering backend. The renderer would output to the WebXR framebuffer with the correct projection and view matrices for each eye.

## 23.5 Closing Thoughts

Crafty began as an experiment — could we build a complete, modern renderer from scratch on the web platform? The answer is yes, and the code is here for you to read, modify, and learn from.

The rendering techniques covered in this book — deferred shading, PBR, CSM, TAA, bloom, SSAO, and the rest — are not specific to WebGPU or to Crafty. They are the foundation of real-time graphics in 2026, and understanding them deeply will serve you regardless of which API or engine you use next.

The source code at `https://github.com/brendan-duncan/crafty` will continue to evolve. The book will be updated as new features are added. Contributions, issues, and forks are welcome.

**Further reading:**
- WebGPU specification: <https://www.w3.org/TR/webgpu/>
- WGSL specification: <https://www.w3.org/TR/WGSL/>
- Physically Based Rendering (Pharr, Jakob, Humphreys): <https://pbr-book.org/>

----
[Contents](../crafty.md) | [22-Tools](22-tools.md)