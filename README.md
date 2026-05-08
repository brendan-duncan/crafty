# Crafty

## Experimental, just having fun

Crafty is a Minecraft-style voxel game engine written in TypeScript with a WebGPU rendering backend. It is designed around a deferred, HDR, multi-pass render graph, a chunk-based infinite world with procedural terrain, and a component-based game object model. The rendering feature set is comparable to a modern PC game engine: cascaded shadow maps, PBR with image-based lighting, screen-space ambient occlusion, screen-space global illumination, temporal anti-aliasing, volumetric clouds, god rays, depth-of-field, bloom, and water with screen-space reflections.

### [Play Crafty](https://brendan-duncan.github.io/crafty/dist)

![Crafty](assets/crafty.png)

---

## Build & Run

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later (ships with `npm`)
- A WebGPU-capable browser (recent Chrome, Edge, or Firefox Nightly with the WebGPU flag)

### Install

```sh
npm install
```

### Run the game (single-player)

```sh
npm run dev
```

Vite serves the game at `http://localhost:5173`. The launcher opens with a **Local** tab where you can pick a world seed and click *Start*.

### Run multiplayer

The repo includes an authoritative WebSocket server in `server/`. In two terminals:

```sh
# terminal 1 — install server deps once, then start it
npm run server:install
npm run server                # listens on ws://localhost:8787

# terminal 2 — start the client
npm run dev
```

Open the launcher's **Network** tab, leave the URL at `ws://localhost:8787` (or change it), and click *Connect*. Open additional browser tabs to join the same world. See [`server/README.md`](server/README.md) for environment variables (`PORT`, `SEED`).

### Production build

```sh
npm run build      # type-checks then writes a static bundle to dist/
npm run preview    # serves the built bundle locally
```

### Tests

```sh
npm test           # vitest in watch mode
npm run test:run   # one-shot, suitable for CI
```

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [WebGPU Integration](#2-webgpu-integration)
3. [Render Graph Architecture](#3-render-graph-architecture)
4. [G-Buffer and Deferred Shading](#4-g-buffer-and-deferred-shading)
5. [Render Passes](#5-render-passes)
6. [Shader Organization](#6-shader-organization)
7. [Voxel Chunk System](#7-voxel-chunk-system)
8. [World and Chunk Management](#8-world-and-chunk-management)
9. [Procedural Generation](#9-procedural-generation)
10. [Biome System](#10-biome-system)
11. [Block System and Texture Atlas](#11-block-system-and-texture-atlas)
12. [Game Engine Layer](#12-game-engine-layer)
13. [Player Controller and Physics](#13-player-controller-and-physics)
14. [Asset System](#14-asset-system)
15. [Particle System](#15-particle-system)
16. [Math Library](#16-math-library)
17. [Performance Optimizations](#17-performance-optimizations)
18. [Future Development Ideas](#18-future-development-ideas)

---

## 1. Project Structure

```
crafty/
├── src/
│   ├── renderer/           # Rendering engine
│   │   ├── passes/         # Individual render passes
│   │   ├── render_context.ts
│   │   ├── render_graph.ts
│   │   ├── render_pass.ts
│   │   └── gbuffer.ts
│   ├── block/              # Voxel world
│   │   ├── chunk.ts        # Chunk data + meshing
│   │   ├── world.ts        # World management
│   │   ├── block_type.ts   # Block definitions and atlas data
│   │   └── biome_type.ts   # Biome definitions
│   ├── engine/             # Game engine
│   │   ├── game_object.ts
│   │   ├── component.ts
│   │   ├── player_controller.ts
│   │   └── components/
│   ├── assets/             # Asset loaders
│   ├── math/               # Linear algebra + noise
│   ├── particles/          # GPU particle system
│   └── shaders/            # WGSL shader sources
├── crafty/
│   └── main.ts             # Game entry point and render graph wiring
└── tests/                  # Test scenes
```

Modules are compiled with Vite and TypeScript. Shaders are imported as raw text strings and compiled at runtime via the WebGPU `createShaderModule` API.

---

## 2. WebGPU Integration

### RenderContext

`RenderContext` is the thin wrapper around the raw WebGPU API. It owns:

- `GPUDevice` and `GPUQueue`
- The `GPUCanvasContext` for swapchain presentation
- Helper methods for creating and uploading buffers

**HDR canvas support.** At startup, Crafty requests an `rgba16float` swapchain with `display-p3` color space and `extended` tonemapping. This allows the final composite pass to output values above 1.0 and let the display's hardware tonemapper preserve specular highlights on HDR monitors. If the browser does not support it, the context falls back to the preferred SDR canvas format automatically.

```typescript
// Preferred HDR path
const ctx = canvas.getContext('webgpu');
ctx.configure({
  device,
  format: 'rgba16float',
  colorSpace: 'display-p3',
  toneMapping: { mode: 'extended' },
  alphaMode: 'opaque',
});
```

### Bind Group Layout Strategy

Every render pass defines its own bind group layouts. Groups are assigned by semantic scope:

- **Group 0** — camera uniforms (view, proj, viewProj, invViewProj, position, near, far)
- **Group 1** — pass-specific uniforms (time, light parameters, effect settings)
- **Group 2** — per-object / per-chunk data (transform offset into a shared buffer)
- **Group 3** — scene textures (G-buffer, shadow maps, environment maps)

This layout is consistent across geometry, lighting, and post-process passes, which avoids redundant bind group rebuilds.

### Uniform Buffer Alignment

Crafty uses 256-byte aligned uniform buffer offsets throughout, which matches the `minUniformBufferOffsetAlignment` requirement for all WebGPU implementations. This is most visible in the chunk slot allocator, where each chunk's world-offset uniform occupies exactly one 256-byte slot regardless of its actual data size.

---

## 3. Render Graph Architecture

`RenderGraph` is an ordered list of `RenderPass` instances. Each frame the graph encodes all enabled passes into a single `GPUCommandEncoder`, which is then submitted to the queue in one call. This minimizes JavaScript-to-GPU round-trips.

```
Frame N:
  encoder = device.createCommandEncoder()
  for pass of renderGraph.passes:
    if pass.enabled:
      pass.execute(encoder, ctx)
  device.queue.submit([encoder.finish()])
```

`RenderPass` is an abstract base class:

```typescript
abstract class RenderPass {
  enabled = true;
  abstract execute(encoder: GPUCommandEncoder, ctx: RenderContext): void;
}
```

Passes communicate through textures. Each pass declares the textures it reads and writes; the graph does not enforce this automatically — wiring is done explicitly in `main.ts` when each pass is constructed.

### Full Pass Execution Order (main.ts)

```
ShadowPass            → directional-light depth maps (cascaded)
WorldShadowPass       → voxel chunk shadow depth
PointSpotShadowPass   → point/spot light depth cubemaps
WorldGeometryPass     → G-buffer: opaque chunks, transparent, props
GeometryPass          → G-buffer: static scene meshes
SkinnedGeometryPass   → G-buffer: animated models
SkyPass               → sky color into HDR output
AtmospherePass        → atmospheric scattering into HDR
CloudShadowPass       → cloud shadow depth map
CloudPass             → volumetric cloud rendering into HDR
LightingPass          → deferred PBR shading into HDR
SSAOPass              → screen-space ambient occlusion
SSGIPass              → screen-space global illumination
PointSpotLightPass    → deferred point/spot contributions
WaterPass             → water surfaces (forward, post-lighting)
GodrayPass            → volumetric light shafts
ParticlePass          → GPU particles (forward, pre-TAA)
BlockHighlightPass    → selection outline
TAAPass               → temporal anti-aliasing
DofPass               → depth-of-field (optional)
BloomPass             → bloom (optional)
AutoExposurePass      → histogram-based exposure
CompositePass         → fog + tonemap + underwater → swapchain
```

---

## 4. G-Buffer and Deferred Shading

The G-buffer stores surface properties written by all geometry passes and later consumed by the lighting pass.

| Texture | Format | Contents |
|---|---|---|
| `albedoRoughness` | rgba8unorm | RGB: albedo, A: roughness |
| `normalMetallic` | rgba16float | RGB: world-space normal, A: metallic |
| `depth` | depth32float | Hardware depth |

The two-texture layout keeps the G-buffer read compact. The depth texture is shared by every pass that needs either depth testing or depth reconstruction (lighting, SSAO, SSGI, TAA, water, composite).

**World-position reconstruction.** Passes that need the world position of a pixel compute it from the depth sample and the `invViewProj` matrix rather than storing a position G-buffer texture. This halves the G-buffer bandwidth cost.

```wgsl
let ndc  = vec3<f32>(uv * 2.0 - 1.0, depth);
let clip = vec4<f32>(ndc, 1.0);
let wp4  = cam.invViewProj * clip;
let world_pos = wp4.xyz / wp4.w;
```

---

## 5. Render Passes

### Shadow Pass

`ShadowPass` implements cascaded shadow maps for the directional (sun) light. It uses a 2048×2048 depth texture array with one layer per cascade (up to four). Each cascade renders the scene from the light's perspective using a tightly fitted orthographic frustum around the camera's view frustum sub-volume for that cascade. A separate bind group is allocated per cascade to avoid overwriting a layer in use.

`WorldShadowPass` is the chunk-specific variant — it uses the same pipeline but only submits voxel chunk draw calls, keeping shadow rendering efficient by skipping mesh and skeletal geometry when only chunks are in view.

### WorldGeometryPass

This is the most complex pass in the engine. It renders all visible voxel chunks into the G-buffer in three sub-passes:

1. **Opaque** — solid blocks, depth-write on, no blending
2. **Transparent** — glass, leaves, alpha blending on
3. **Props** — billboard vegetation (flowers, grass, torches), no back-face culling

**Vertex format.** Each vertex is 5 floats: `[x, y, z, face(0–5), blockType]`. The face index encodes the normal direction; the block type is used in the fragment shader to look up UV offsets in the atlas buffer.

**Slot allocator.** The GPU holds one shared uniform buffer sized for 2048 chunks (2048 × 256 bytes = 512 KB). Each active chunk is assigned a slot index. The chunk's world-space offset is written into its slot; the draw call uses a dynamic offset to point the shader at the right slot. When a chunk is removed, its slot returns to a free-list.

**Frustum culling.** Before issuing draw calls, each chunk's AABB is tested against the six camera frustum planes (Gribb/Hartmann extraction from the VP matrix). Chunks that fail are skipped entirely — no draw call is encoded, which eliminates GPU vertex processing overhead for invisible geometry.

**Block data buffer.** A GPU buffer stores the atlas tile offsets for all 26 block types (4 u32 values each — side, bottom, top, and a flags word). The fragment shader indexes into this by block type to look up the correct UV.

### LightingPass

The deferred lighting pass reads the G-buffer, reconstructs world positions, and evaluates PBR for the directional sun light. It produces an rgba16float HDR output.

**BRDF.** Cook-Torrance specular with GGX distribution, Smith geometry term, and Fresnel-Schlick. Lambertian diffuse with albedo. Energy conservation is enforced by the kD/kS split.

**IBL (Image-based Lighting).** Three textures feed ambient lighting:
- Irradiance cubemap — pre-convolved diffuse
- Prefiltered specular cubemap — roughness-based mip levels
- BRDF integration LUT — split-sum approximation

These are computed once at startup in `ibl.ts` on the GPU using compute shaders (`ibl.wgsl`).

**Cascaded Shadow Maps.** The lighting shader selects the tightest-fitting cascade based on the fragment's linear depth and samples it with PCF filtering. Cascade selection is made visible in debug mode by tinting each cascade a different color.

**Cloud shadows.** An optional cloud shadow map (a 2D depth texture rendered by `CloudShadowPass`) occludes the directional light contribution, adding soft ground shadows from the cloud layer.

**SSGI.** When enabled, the SSGI result texture is added to the indirect diffuse contribution, giving bounce lighting from nearby geometry.

### SSAOPass

Two-stage screen-space ambient occlusion:

1. **Raw SSAO** — 16 samples distributed in a hemisphere aligned to the surface normal (reconstructed from G-buffer). A 4×4 random rotation noise texture tiles across the screen to break up banding. Samples are projected into NDC to fetch the depth texture and compared.
2. **Bilateral blur** — A depth-aware blur pass reduces noise while preserving edges. The AO value is stored as r8unorm.

The final AO value is multiplied into the ambient lighting term in `LightingPass`.

### SSGIPass

Screen-space global illumination in two stages:

1. **Raw SSGI** — For each pixel, traces `numRays` (default 4) rays in the reflected hemisphere. Each ray steps `numSteps` (default 16) times through screen space sampling the HDR output. On a depth hit, the HDR radiance at the hit point is added as indirect diffuse.
2. **Temporal reprojection** — The noisy single-frame result is blended with the reprojected previous-frame accumulation. Over multiple frames the signal converges. A frame index and per-frame random seed keep sample patterns decorrelated between frames.

### TAAPass

Temporal anti-aliasing accumulates geometry across frames by blending the current rendered frame with a reprojected history buffer. Each frame, the jitter pattern is indexed to sample different sub-pixel positions; the history is warped using the depth-based per-pixel reprojection vector computed from `prevViewProj`. The blend weight is ~0.1 for the current frame and ~0.9 for history, giving fast convergence with minimal ghosting.

### WaterPass

Water is rendered forward (not deferred) on top of the HDR result, after lighting but before TAA. Each chunk contributes one horizontal quad per (X, Z) cell that contains a water block; the quad's Y is computed in the vertex shader as `chunkOffset.y + WATER_HEIGHT`.

**Distortion.** A DUDV normal map is sampled twice with offset UVs animated by `water.time`. The two samples are stacked to produce complex ripple distortion.

**Refraction.** The pre-water HDR color is copied to a refraction texture. The fragment shader samples it at distorted screen-space UVs to produce a color-shifted view through the water surface.

**Screen-space reflection (SSR).** A 32-step ray march through view space looks for geometry that intersects the reflected view ray. On a hit, the pre-water HDR color at the hit's screen position is used as the reflection. Edge confidence fades toward zero at screen boundaries to hide ray-termination seams.

**Fresnel.** Schlick approximation with F0 = 0.02 (water). Near-normal incidence is dominated by refraction; grazing angles are dominated by SSR reflection.

**Sky fallback.** When the SSR ray misses (exits the screen or finds no intersection), the sky panorama texture is sampled using equirectangular projection along the reflected direction. This ensures reflections always have a plausible result.

**Depth tinting.** Shallow water passes through refracted color; deep water blends to a deep-blue gradient map texture. The murkiness factor is `clamp(water_depth / 4.0, 0, 1)`.

**Alpha edge fading.** A smoothstep on `1/water_depth` gives a smooth transparent edge where water is shallow, preventing hard geometric cutoffs.

### BloomPass

Multi-stage bloom:

1. **Prefilter** — Extract bright pixels using a soft knee threshold; output at half resolution.
2. **Horizontal blur** — Separable Gaussian horizontal blur.
3. **Vertical blur** — Separable Gaussian vertical blur.
4. **Composite** — Add bloom result back to the full-resolution HDR image with a configurable strength.

### CompositePass

The final pass merges post-processing, tonemapping, and output into a single draw call:

- **Depth fog** — Exponential fog with configurable density, color, start distance, and height gradient. Fog can be toggled without rebuilding the pass.
- **Underwater** — When the camera is below the water surface, the image is tinted with a blue-green underwater color and a different tonemap curve is applied.
- **ACES tonemap** — The Narkowicz ACES approximation maps HDR to [0, 1] for SDR output.
- **HDR pass-through** — On HDR-capable displays the final values are not clamped; they are written as-is into the rgba16float swapchain for the display's hardware tonemapper.
- **Auto-exposure** — An exposure scalar from `AutoExposurePass` scales the HDR input before tonemapping, keeping average luminance near a target value.
- **SSAO debug mode** — When enabled, the AO texture is rendered directly to screen for inspection.

### AtmospherePass and SkyPass

`AtmospherePass` computes atmospheric scattering using Rayleigh and Mie models to derive a physically based sky color from the sun direction. `SkyPass` samples the HDR environment cubemap for the sky dome, providing reflections and ambient environment detail. Both write into the HDR output before the lighting pass accumulates on top.

### CloudPass and GodrayPass

`CloudPass` renders volumetric clouds using Perlin noise with per-biome density parameters (cloud base altitude, cloud top altitude, coverage percentage). `CloudShadowPass` renders a shadow map from the sun's perspective through the cloud volume, which `LightingPass` samples to cast soft cloud ground shadows. `GodrayPass` ray-marches from the fragment toward the sun, sampling the cloud shadow map to accumulate shaft brightness.

---

## 6. Shader Organization

All shaders are WGSL files in `src/shaders/`. They are imported as raw text strings and compiled at runtime. The organization is one file per pass, with common utilities shared via manual concatenation or struct duplication.

Notable files:

| File | Role |
|---|---|
| `chunk_geometry.wgsl` | G-buffer write for voxel blocks (opaque, transparent, prop variants) |
| `lighting.wgsl` | Full PBR deferred lighting with IBL, shadows, SSGI, cloud shadows |
| `water.wgsl` | Water surface (refraction, SSR, Fresnel, distortion, alpha edge) |
| `ssao.wgsl / ssao_blur.wgsl` | SSAO computation and bilateral blur |
| `ssgi.wgsl / ssgi_temporal.wgsl` | SSGI and temporal reprojection |
| `taa.wgsl` | Temporal anti-aliasing reprojection |
| `bloom.wgsl / bloom_composite.wgsl` | Bloom stages |
| `dof.wgsl` | Depth-of-field (Fibonacci spiral sampling) |
| `atmosphere.wgsl` | Rayleigh–Mie sky scattering |
| `clouds.wgsl` | Volumetric cloud ray march |
| `godray_march.wgsl` | Volumetric light shaft march |
| `ibl.wgsl` | IBL cubemap convolution (irradiance + prefiltered specular) |
| `composite.wgsl` | Fog, underwater, ACES tonemap, HDR output |
| `auto_exposure.wgsl` | Histogram-based luminance and exposure |
| `shadow.wgsl / chunk_shadow.wgsl` | Shadow depth renders |
| `particles/` | Compute simulation + forward billboard rendering |

All geometry shaders share the same `CameraUniforms` struct layout so bind group 0 can be set once and reused across opaque, transparent, shadow, and water passes.

---

## 7. Voxel Chunk System

### Chunk Data

A `Chunk` stores 16×16×16 blocks as a flat `Uint8Array` (4096 bytes). The index formula is:

```
index = x + y * WIDTH + z * WIDTH * HEIGHT
```

A chunk also tracks counters for alive, opaque, transparent, water, and light-emitting blocks. These counters allow the renderer to skip a chunk pass entirely when its count is zero — for example, a chunk with no water blocks never emits a draw call to `WaterPass`.

Each chunk holds slot indices into the GPU buffers:

- `opaqueIndex` — slot in the opaque vertex buffer pool
- `transparentIndex` — slot in the transparent vertex buffer pool
- `waterIndex` — slot in the water vertex buffer pool
- `chunkDataIndex` — slot in the shared uniform buffer (256-byte aligned)
- `drawCommandIndex` — slot in the indirect draw command buffer

### Greedy Meshing and Neighbor-Padded Buffer

`generateVertices()` is the most performance-critical function in the engine. It receives a `ChunkNeighbors` struct of references to the six adjacent chunks' block arrays.

**Padded buffer.** Before the meshing loop begins, a `(W+2) × (H+2) × (D+2)` buffer is built that pads the chunk's own 16³ blocks with one layer of neighbor data on each face. The meshing loop then reads from this padded buffer using simple index arithmetic — no per-iteration boundary checks, no branching on chunk edges.

**Face culling.** `skipCheck(b1, b2)` determines whether the face between two adjacent blocks should be skipped. A face is hidden when:
- The neighbor is any solid, non-water, non-prop block of the same category (opaque hides opaque)
- The rendering category matters: water does not hide solid, and props never hide anything

**Greedy meshing.** For horizontal (top/bottom) faces, the algorithm expands a quad in X first, then Z, merging runs of the same block type into a single rectangle. For vertical (side) faces it expands in the perpendicular axis. This dramatically reduces vertex count for flat surfaces and uniform terrain. A `drawnFaces` bit-array records which (block, face) pairs have already been merged so no face is emitted twice.

**Output format.** The mesh is returned as four separate typed arrays:
- `opaque` — 5 floats per vertex, solid blocks
- `transparent` — 5 floats per vertex, glass/leaves
- `prop` — 5 floats per vertex, billboard vegetation
- `water` — 2 floats per vertex (X, Z), one quad per wet cell

The water mesh is degenerate on purpose: only the X and Z coordinates are stored. The vertex shader reconstructs world Y from the chunk offset and the constant `WATER_HEIGHT`.

### Chunk Counters and Conditional Draw

```typescript
opaqueBlocks      // > 0 → submit opaque draw call
transparentBlocks // > 0 → submit transparent draw call
waterBlocks       // > 0 → submit water draw call
lightBlocks       // > 0 → register as point-light source
```

These counters are updated atomically by `setBlock()` so they are always consistent with the actual block data.

---

## 8. World and Chunk Management

### World Class

`World` manages chunk lifetime, spatial lookup, and streaming around the player.

**Spatial indexing.** Chunks are keyed by `"cx,cy,cz"` string keys in a `Map<string, Chunk>`. A `Set<string>` of generated keys tracks which positions have already been attempted (including positions that turned out to be empty and were not inserted).

**Streaming parameters.**

| Parameter | Default | Meaning |
|---|---|---|
| `renderDistanceH` | 8 | Horizontal radius in chunks |
| `renderDistanceV` | 4 | Vertical radius in chunks |
| `chunksPerFrame` | 2 | New chunks generated per frame |
| `MAX_CHUNKS` | 2048 | Hard cap on live chunks |

**Generation loop.** Each frame, `_createNearbyChunks()` collects all ungenerated positions within the cylindrical render distance, sorts them by distance² from the player chunk, and processes the `chunksPerFrame` closest first. This gives a natural load-closest-first order that minimizes visible pop-in.

**Eviction.** `_removeDistantChunks()` runs every frame and deletes any chunk whose chunk coordinates exceed the render distance (+1 margin). The evicted chunk raises `onChunkRemoved`, which frees its GPU buffer slots.

**Neighbor remesh.** When a chunk's block data changes (player adds or removes a block), the chunk is re-meshed. If the changed block is on a chunk edge, the one or two adjacent chunks that share that face are also re-meshed so their exposed faces update correctly.

### Raycasting

`getBlockByRay()` implements the **Amanatides–Woo fast voxel traversal** algorithm. It advances through the voxel grid by selecting the axis with the smallest parametric step `t` at each iteration, similar to a 3D DDA. This gives exactly one block test per grid crossing — optimal for picking, player–world interaction, and line-of-sight checks.

### Water Level

`calcWaterLevel()` returns a depth integer for the water column at a world position, scanning upward through stacked water chunks. This is used by the player controller to determine swim depth and by the composite pass to detect when the camera is underwater.

---

## 9. Procedural Generation

### Surface Height

`generateBlocks()` uses a two-pass approach:

**Pass 1 — Terrain.** For each (X, Z) column in the chunk, the following values are precomputed once:

- `temperature` — `perlinNoise3Seed(x/512, -5, z/512, seed+31337)` in [-1, 1]
- `cont` (continentalness) — `perlinNoise3Seed(x/2048, 10, z/2048, seed)` in [-1, 1]
- `colHeightMult` — `|perlinNoise3Seed(x/1024, 0, z/1024, seed) × 450| × max(0.1, (cont+1)/2)`
- `colFlatness` — `perlinRidgeNoise3(x/256, 15, z/256, 2, 0.6, 1.2, 6) × 12`
- `colErosion` — hydraulic erosion displacement in blocks (see below); negative = valley carved, positive = fan deposited
- `colBiome` — determined from `temperature` (see §10)

For each block position `(gx, gy, gz)`:

```
surfaceHeight = |perlinNoise3Seed(gx/256, gy/512, gz/256, seed) × colHeightMult|
              + colFlatness + colErosion
```

Using `gy` in the noise input creates overhangs and caves: the noise value at a given world Y differs from its neighbors, so some Y slabs cross below the surface threshold while others stay above it.

The continentalness scalar `max(0.1, (cont+1)/2)` modulates terrain amplitude: ocean-like continentalness values produce nearly flat low terrain; high continentalness produces dramatic height variation.

**Pass 2 — Props and trees.** After all terrain blocks are placed, a second pass over every block calls `_generateAdditionalBlocks()` to spawn trees, cactus, grass, flowers, and dead bushes on appropriate surfaces.

### Hydraulic Erosion

`colErosion` is supplied by `World.getErosionDisplacement(gx, gz)`, which lazily computes 128×128-block erosion regions on first access and caches them indefinitely (`src/block/erosion.ts`).

**Algorithm.** Each region runs Sebastian Lague's droplet-based hydraulic erosion:

1. Sample the 2D base heightmap for the region (same noise as column generation, at y=0).
2. Simulate 4 096 water droplets. Each droplet flows downhill for up to 20 steps, eroding steep slopes (adding to a sediment budget) and depositing in flat areas.
3. Erosion at each step is spread over a 5×5 distance-weighted brush so carved valleys are smooth rather than pixel-wide.
4. Compute `displacement = eroded − original`. Multiply by an edge-fade factor (0→1 over the inner 12-block border) so displacement is zero at region boundaries, eliminating seams when adjacent regions join.

**Parameters.** `inertia=0.05`, `sedimentCapacity=4`, `erodeSpeed=0.4`, `depositSpeed=0.3`, `evaporateSpeed=0.01`, `gravity=4`. Typical displacement range: −15 to +5 blocks.

**Determinism.** The droplet PRNG is an inline LCG seeded by `worldSeed XOR hash(regionX, regionZ)`, so erosion is fully reproducible per world seed.

### Noise Functions

| Function | Use |
|---|---|
| `perlinNoise3Seed` | Seeded Perlin noise — biome temperature, terrain height, continentalness |
| `perlinRidgeNoise3` | Ridge noise — adds plateau-like flatness variation |
| `perlinTurbulenceNoise3` | Turbulence (FBM abs) — block material variation in mountain biomes |

The `perlinNoise3Seed` function takes six lattice wrap parameters, which keeps noise deterministic across arbitrary world coordinates without needing a large permutation table.

---

## 10. Biome System

Biome is determined per column from a single noise field (temperature), mapped monotonically across its signed range to avoid ring-banding artifacts:

```typescript
// temperature ∈ [-1, 1]
if (temperature > 0.35)  → Desert
if (temperature > -0.15) → GrassyPlains
if (temperature > -0.3)  → SnowyPlains
if (temperature > -0.5)  → SnowyMountains
else                     → RockyMountains
```

Mapping the raw signed value produces broad, organically shaped biome regions. Using `Math.abs()` would fold positive and negative values onto the same range, creating concentric ring patterns around every noise zero-crossing.

### Biome Blending

Hard threshold transitions produce a visible edge where, for example, grass immediately becomes sand. Biome blending replaces this with a dithered transition band (~50 blocks wide, ≈ 3 chunks) around each threshold.

**`getBiomeBlend(temperature)`** (`src/block/biome_type.ts`) returns `{ biome1, biome2, blend }`:
- Outside any transition band: `biome1 === biome2`, `blend === 0` (pure biome, no dithering).
- Inside a band: `biome1` = the cool-side biome, `biome2` = the warm-side biome, `blend ∈ (0, 1)`.

The column precomputation stores all three values (`colBiome1`, `colBiome2`, `colBiomeBlend`). When placing each block, `_generateBlockBasedOnBiome` consults a deterministic position hash:

```typescript
const biome = _xzHash(p_x, p_z) < blend ? biome2 : biome1;
```

`_xzHash` is a Wang-hash mix of world X and Z — seed-independent, so the dither pattern is stable across world reloads. At `blend = 0.5` (the threshold itself), approximately half the columns use each biome, producing a natural scattered-block appearance (grass patches in sand, etc.) that grows into the adjacent pure biome over the transition band.

### Block Assignment Per Biome

`_generateBlockBasedOnBiome()` selects the block type at a position based on depth below the terrain surface:

| Biome | Surface | 1–3 deep | > 3 deep |
|---|---|---|---|
| GrassyPlains | GRASS (above water), DIRT (underwater) | DIRT | STONE |
| Desert | SAND | SAND | STONE |
| SnowyPlains | GRASS_SNOW | SNOW | STONE |
| SnowyMountains | GRASS_SNOW | SNOW (or STONE via turbulence) | STONE |
| RockyMountains | STONE (rare SNOW patch) | STONE | STONE |

SnowyMountains uses 3D turbulence noise to vary between snow and stone in the sub-surface layers, creating naturalistic snow pockets and rock outcroppings:

```typescript
const noise3d = Math.abs(perlinTurbulenceNoise3(px/256, py/256, pz/256, 2, 0.6, 1)) * 35;
if (depth <= 4 || noise3d > 20) return SNOW;
return STONE;
```

### Biome Environment Effects

`BiomeType` also encodes environment parameters consumed by other engine systems:

- **Cloud base/top altitude** — clouds in desert biomes sit higher and are sparser
- **Cloud coverage** — snowy biomes have heavier cloud cover
- **Environment effect** — snow particle emitter (SnowyMountains, SnowyPlains), rain (not yet used)

---

## 11. Block System and Texture Atlas

### Block Types

Twenty-five named block types are defined in `block_type.ts` as integer constants. Properties per block:

- `materialType` — OPAQUE, SEMI_TRANSPARENT, WATER, PROP
- Texture offsets: three atlas tile coordinates (side face, bottom face, top face)
- `isEmittingLight` — whether the block registers as a point light source
- `collidable` — whether the player collides with it (false for water, props)

### Texture Atlas

The atlas is four 400×400 pixel textures loaded from PNG:

| Atlas | Format | Contents |
|---|---|---|
| Color | sRGB | Diffuse albedo |
| Normal | Linear | Tangent-space normals |
| MER | Linear | R: metallic, G: emissive mask, B: roughness |
| Height | Linear | Heightmap for parallax occlusion (future) |

Each tile is 16×16 pixels. The atlas grid is 25×25 = 625 tile slots. Block faces index into the grid by their tile offset; the GPU atlas data buffer stores these offsets so the fragment shader can compute UV without a texture lookup.

### Emissive Blocks as Point Lights

Blocks that emit light (GLOWSTONE, MAGMA, OBSIDIAN, TORCH) register as point lights at runtime when they are placed. The emissive properties are defined per block type:

| Block | Color | Radius |
|---|---|---|
| GLOWSTONE | warm yellow | 6.4 |
| MAGMA | red | 8.7 |
| OBSIDIAN | purple | 9.2 |
| TORCH | warm amber | 3.2 |

---

## 12. Game Engine Layer

### Game Object and Components

`GameObject` implements a scene graph node:

```
GameObject
├── position: Vec3
├── rotation: Quaternion
├── scale: Vec3
├── children: GameObject[]
└── components: Component[]
```

`localToWorld()` traverses the parent chain to compute the full world transform. `update(dt)` propagates down children and calls `Component.update(dt)` on all attached components.

`Component` is an abstract base. Subclasses override `onAttach()`, `onDetach()`, and `update(dt)` for their behavior.

### Built-in Components

| Component | Role |
|---|---|
| `Camera` | Perspective projection + view matrix; frustum corner helpers for shadow cascade fitting |
| `DirectionalLight` | Sun light with cascade shadow data; cascade VP matrices updated per frame |
| `PointLight` | Radius-based point light, omnidirectional shadow map |
| `SpotLight` | Cone light with shadow |
| `MeshRenderer` | Submits a static mesh to `GeometryPass` |
| `AnimatedModel` | Skeletal animation playback, submits to `SkinnedGeometryPass` |

---

## 13. Player Controller and Physics

The `PlayerController` component implements AABB physics against the voxel world with no physics library dependency.

### Movement Parameters

| Parameter | Value |
|---|---|
| Walk speed | 4.3 blocks/s |
| Sprint speed (ControlLeft) | 7.0 blocks/s |
| Sneak speed (ShiftLeft) | 1.3 blocks/s |
| Jump velocity | 11.5 blocks/s |
| Swim up velocity | 3.5 blocks/s |
| Gravity (air) | –28 blocks/s² |
| Gravity (water) | –4 blocks/s² |
| Player AABB | 0.3 × 1.8 × 0.3 blocks |
| Eye height | 1.62 blocks above feet |

### Collision Resolution

Each frame, movement is applied in three separate axis steps (X, Y, Z). After each step, all blocks overlapping the AABB are tested. On intersection, the velocity component for that axis is zeroed and the position is pushed out of the block. Doing X, Y, Z independently prevents corner-sticking artifacts.

### Coyote Time

A brief window (a few frames) after walking off an edge still allows the player to jump. This is the standard "coyote frames" mechanic.

### Interaction

`World.getBlockByRay()` casts a ray from the camera eye along the view direction. If a non-water, non-prop block is hit within range, it is highlighted by `BlockHighlightPass`. Left-click mines the block (`mineBlock()`); right-click places the selected hotbar block against the hit face (`addBlock()`). Both calls trigger a neighbor remesh.

---

## 14. Asset System

### Texture

`Texture` wraps a `GPUTexture`. It can be created from:

- `ImageBitmap` — 2D textures from images (block atlas, DUDV, gradient, sky panorama)
- Float data — HDR environment maps (rgba32float or rgba16float)
- Procedural data — Noise textures for SSAO rotation, cloud density

Mipmaps are generated on the GPU via `GPUCommandEncoder.copyTextureToTexture` + manual mip chain, or deferred to the browser's `createImageBitmap` pipeline.

### Mesh

`Mesh` stores vertex data as interleaved `Float32Array` with configurable attribute layouts (position, normal, UV, tangent, bone weights, etc.). It creates a single vertex buffer and an optional index buffer.

### HDR Loader

`hdr_loader.ts` parses Radiance HDR (`.hdr`) files. The RGBE-encoded scanlines are decoded to linear floating-point `rgba32float` textures. These serve as the environment cubemap and panoramic sky texture.

### IBL Computation

At startup, `ibl.ts` submits GPU compute shaders (`ibl.wgsl`) to:

1. Convert the equirectangular HDR panorama to a cubemap
2. Convolve the cubemap for diffuse irradiance
3. Pre-filter the cubemap at multiple roughness levels for specular IBL
4. Bake the BRDF split-sum integration LUT

All four outputs are retained for `LightingPass`.

### Asset Manager

`AssetManager` is a simple dictionary cache. Assets are loaded once and reused by key. It prevents duplicate GPU texture allocation for shared resources like the block atlas.

---

## 15. Particle System

The particle system is fully GPU-driven using compute shaders.

### Data Layout

Each particle is 64 bytes:

```wgsl
struct Particle {
  position  : vec3<f32>,  // world position
  life      : f32,        // -1 = dead
  velocity  : vec3<f32>,
  max_life  : f32,
  color     : vec4<f32>,
  size      : f32,
  rotation  : f32,
  _pad      : vec2<f32>,
}
```

### Compute Simulation

Each frame, a compute shader updates all particles. Key features:

- **PCG hashing** for fast on-GPU random number generation per particle
- **Quaternion rotation** — particles inherit a world-space orientation for directional effects
- **Spherical cap sampling** — spawn velocity sampled in a configurable cone angle
- **Curl noise** — FBM multi-octave noise drives fluid-like turbulence for snow and fire effects
- **Spawn control** — `spawn_count` new particles are initialized per frame from the emitter position

### Rendering

`ParticlePass` renders particles as camera-facing billboards into the HDR output using a forward pass. The vertex shader reads particle position, size, and rotation from the storage buffer and constructs a quad in view space.

---

## 16. Math Library

All math types are in `src/math/` and exported through `index.ts`.

| Type | Description |
|---|---|
| `Vec2`, `Vec3`, `Vec4` | GLSL-style vectors with swizzle-like accessors |
| `Mat4` | 4×4 column-major matrix (matches WebGPU and WGSL conventions) |
| `Quaternion` | Rotation quaternion with `fromAxisAngle`, `multiply`, `toMat4` |
| `Random` | Seeded LCG random number generator with a global instance |

### Noise Functions

| Function | Octaves | Use |
|---|---|---|
| `perlinNoise3` | 1 | Base lattice Perlin |
| `perlinNoise3Seed` | 1 | Seeded variant (deterministic per world seed) |
| `perlinFbmNoise3` | n | Fractional Brownian motion |
| `perlinRidgeNoise3` | n | Ridged — abs, invert, accumulate; produces plateau-like terrain |
| `perlinTurbulenceNoise3` | n | Turbulence — abs accumulate; produces jagged variation |

The column-major matrix layout is consistent throughout: `Mat4` stores data in column order, projection and view matrices are constructed accordingly, and WGSL struct fields match the memory layout so buffer writes via `TypedArray` are correct without transposition.

---

## 17. Performance Optimizations

### GPU-Side

**Deferred shading.** All geometry is rendered once into the G-buffer. Lighting is evaluated once per pixel regardless of overdraw. Scene complexity does not multiply lighting cost.

**Frustum culling.** Each chunk AABB is tested against the camera frustum before encoding a draw call. For a render distance of 8 chunks, typically 30–50% of chunks are culled at any view angle.

**Slot allocator with free list.** Chunk GPU memory is managed with a slot allocator rather than individual allocations. Freed slots return immediately for reuse. This avoids `GPUBuffer` creation churn as the player moves.

**Conditional draw calls.** Chunks with zero opaque, transparent, or water blocks skip the corresponding draw call entirely. This is especially effective for sky chunks (all air) and deep underground chunks with no water.

**Single command encoder per frame.** All passes encode into one `GPUCommandEncoder` submitted as one `GPUCommandBuffer`. This minimizes pipeline flush points.

**Temporal techniques.** TAA and SSGI both accumulate information across frames, meaning each frame does less work than a clean non-temporal render. SSGI at 4 rays per pixel looks acceptable over 8+ accumulated frames; TAA trades geometry aliasing for motion blur.

### CPU-Side

**Per-column noise precomputation.** `generateBlocks()` evaluates all column-dependent noise (height multiplier, flatness, biome) once per (X, Z) pair — 256 evaluations rather than 4096. This gives roughly a 5× reduction in noise function calls per chunk.

**Padded neighbor buffer.** Copying neighbor data into a single padded array before the meshing loop eliminates per-vertex boundary checks. The hot inner loop becomes a simple array index — no branch prediction pressure.

**Typed arrays throughout.** Vertex buffers, block arrays, and intermediate meshing state all use `Float32Array`, `Uint8Array`, or `Uint16Array`. This keeps memory layouts compact, avoids boxing, and enables direct `GPUQueue.writeBuffer` without copying.

**Incremental chunk loading.** Only `chunksPerFrame` (default 2) new chunks are generated per frame. Generation is prioritized by distance² from the player, so closest chunks pop in first and the frame budget is never blown by a sudden large generation spike.

**Greedy meshing.** Merging adjacent same-type faces into larger quads reduces vertex count significantly on flat terrain. A uniform 16×16 floor of GRASS generates 6 vertices (one quad) instead of 16×16×6 = 1536. Actual terrain averages 5–15× reduction over naïve per-face meshing.

**Neighbor remesh on block change.** When a block is added or removed, only the affected chunk and its face-adjacent neighbors (up to 6) are re-meshed. The rest of the world is untouched.

---

## 18. Future Development Ideas

### Rendering

**Ambient occlusion baking into vertex data.** Compute per-vertex ambient occlusion from neighbor blocks at mesh generation time. Store it as a 4-bit value per face. This gives free contact shadows at block corners without a screen-space pass and is how most Minecraft renderers achieve their characteristic look.

**Volumetric fog via 3D LUT.** Replace the depth-exponential fog in CompositePass with a full voxel-based volumetric fog using a froxel (frustum-aligned voxel) grid. This enables light-scattering fog shafts, local fog density variation (caves, swamps), and realistic night-time depth haze.

**Path tracing mode.** WebGPU's compute pipeline supports full path tracing via acceleration structure extensions (proposed). A denoised 1 spp/frame path tracer with ReSTIR reservoir sampling would give near-photorealistic GI without the screen-space limitations of SSGI.

**Indirect draw calls.** Move draw call construction entirely to the GPU using `drawIndirect` and a compute cull pass. The CPU would only submit a single indirect draw call per material type, and the GPU would perform per-chunk frustum and occlusion culling. This eliminates the JavaScript frustum loop and scales to much higher chunk counts.

**Ray-traced shadows.** Replace PCF shadow maps with ray-traced area light shadows via a compute shader. Soft shadow penumbra would be physically accurate at any distance.

**Signed distance field ambient occlusion.** Build a coarse SDF from chunk data (one value per 2×2×2 voxel) and use it to ray-march accurate multi-bounce AO. This would capture occlusion from cave ceilings, overhangs, and block cavities that SSAO misses.

**Subsurface scattering for leaves.** The semi-transparent leaf block type could use a forward SSS pass that transmits a fraction of the sun's light through the leaf geometry, giving realistic dappled light under tree canopies.

### World Generation

**Spline-based height curves.** Replace the linear amplitude modulation with Perlin → spline → height curves, as used by Minecraft 1.18+. Splines allow authoring exact terrain shapes (plains at exactly Y=64, cliffs at specific amplitude thresholds) with smooth transitions.

**Erosion simulation.** Hydraulic erosion run on the heightmap post-generation carves realistic river valleys and talus slopes. Run as a CPU pass on initial chunk generation or precomputed offline.

**Structure generation.** Villages, ruins, dungeons — multi-chunk structures that span chunk boundaries. Requires a two-phase generation: place structure anchors during chunk generation, then populate surrounding chunks with structure data on first load.

**Cave systems.** 3D Perlin worm caves (carver algorithm) or Voronoi-based open cave chambers. Currently the 3D height noise creates some overhangs; dedicated cave carvers would create true hollow interiors.

**River generation.** Trace rivers from high-elevation noise peaks downhill using gradient descent. Mark river cells as water; carve a channel 2–4 blocks wide and 1–2 blocks deep.

### Gameplay Systems

**Crafting.** Inventory items with stack counts, a 3×3 crafting grid, and a recipe database. The block placement already supports item removal from the hotbar — the missing piece is the recipe resolution and inventory persistence.

**Mob AI.** Simple state machine AI (idle → wander → aggro → flee) driven by `World.getBlockByRay()` for line-of-sight and `World.getTopBlockY()` for pathfinding height queries. NavMesh is not needed at voxel granularity — A* on the block grid suffices for small areas.

**Save and load.** Serialize `Chunk.blocks` as a run-length encoded binary blob per chunk, keyed by chunk coordinate. A `WorldStorage` layer wraps IndexedDB (browser) or a local file (desktop) with chunk cache eviction.

**Multiplayer.** WebSocket-based delta sync: send only changed blocks (position + type) from server to clients. A server-authoritative world with client-side prediction for player movement would require a small Node.js game server with the same `World` class running headlessly.

**Day/night cycle.** Animate the sun direction over a configurable period (e.g., 20 minutes per in-game day). Drive `water.sky_intensity`, cloud coverage, directional light color (warm at sunset, cold blue at dawn), and star visibility from the sun elevation angle. The night sky pass could render a static star field from a pre-baked cubemap.

### Engine Infrastructure

**Hot shader reload.** Watch WGSL files for changes and recompile the affected pass pipeline without restarting. WebGPU already creates shader modules synchronously (for async) or via `createShaderModule`; the missing piece is a file-watch event triggering a pipeline rebuild.

**GPU-driven scene.** Move the render loop for static geometry into a persistent GPU scene: encode mesh data once, let a GPU cull pass write indirect draw commands each frame. The CPU becomes responsible only for scene graph updates.

**Chunked world streaming over HTTP.** Pregenerate chunks server-side and stream them as binary blobs. The browser `World` object would request chunks by key and decompress them using the Web Streams API. This enables very large pre-authored worlds without per-client generation cost.

**Profiling pass.** Wrap each `RenderPass.execute()` in a `GPUQuerySet` timestamp query. Accumulate pass times over N frames and expose a performance overlay showing per-pass GPU cost. This would make it straightforward to identify the bottleneck as the scene scales.
