# Chapter 5: Textures and Materials

[Contents](../crafty.md) | [04-Meshes](04-meshes.md) | [06-Lighting](06-lighting.md)

Textures provide surface detail beyond what geometry alone can express. Materials bundle shaders, textures, and parameters into a unit the renderer can consume. This chapter shows how Crafty loads, manages, and binds textures and materials.

## 5.1 2D, 3D, and Cube Textures

Crafty supports three texture dimensionalities:

![2D, Cube, and 3D textures](../illustrations/06-texture-dimensions.svg)


**2D textures** are the most common — albedo maps, normal maps, roughness/metallic/emissive (MER) maps, and shadow maps. They are created with a single `width` × `height` size.

**Cube textures** are used for the sky and image-based lighting (IBL). A cube texture has 6 array layers (one per face: +X, -X, +Y, -Y, +Z, -Z):

```typescript
// ── from src/renderer/render_graph/passes/sky_texture_pass.ts ──
// HDR sky cubemap texture
const skyTexture = device.createTexture({
  label: 'SkyCubemap',
  size: { width: 1024, height: 1024, depthOrArrayLayers: 6 },
  format: 'rgba16float',
  usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
});
```

Cube textures are sampled in WGSL with `texture_cube<f32>` using a direction vector, which can be thought of as a ray from the center of the cube that intersects through a particular texel of a side of the cube:

```wgsl
// ── from src/shaders/deferred_lighting.wgsl ──
@group(3) @binding(0) var sky_cube: texture_cube<f32>;
// ...
let skyColor = textureSample(sky_cube, sampler, direction);
```

**3D textures** are used for volumetric data like cloud noise. They have a depth dimension in addition to width and height. They are sampled in WGSL with a `texture_3d<f32>` using a normalized 3d coordinate in the range **0.0** to **1.0**.

```wgsl
// ── from src/shaders/clouds.wgsl ──
@group(0) @binding(0) var volumeSampler: sampler;
@group(0) @binding(1) var volumeTexture3D: texture_3d<f32>;
// ...
let volumeCoords = vec3<f32>(0.5, 0.5, 0.5); // sample the center of the volume
let color: vec4<f32> = textureSample(volumeTexture3D, mySvolumeSamplerampler, volumeCoords);
```

## 5.2 Texture Loading

### Runtime Loading

Textures are loaded at runtime using the browser's built-in image decoding. Crafty's texture loading pipeline:

1. **Fetch** the image file via `fetch()` (typically as a `Blob` or URL).
2. **Decode** using `createImageBitmap()` or `<img>` element loading.
3. **Upload** pixel data to a `GPUTexture` via `queue.writeTexture()` or `copyExternalImageToTexture()`.

HDR environment maps (.hdr files) use a custom RGBE decoder (`src/shaders/rgbe_decode.wgsl`) that converts the Radiance HDR format to floating-point values on the GPU.

### HDR / RGBE Environment Maps

HDR environment maps (.hdr files) store a 360° panoramic image of a real-world lighting environment in the **Radiance RGBE format** — three mantissa bytes (R, G, B) plus a shared exponent (E), packing high dynamic range into 32 bits per pixel. Crafty's `hdr_loader.ts` parses the file on the CPU and decodes it to floating-point on the GPU via a compute shader.

#### File Format Parsing

The `.hdr` file is a text header followed by binary pixel data. The parser reads scanlines with ASCII helpers:

```typescript
// ── from src/assets/hdr_loader.ts ──
const magic = readAsciiLine();
if (!magic.startsWith('#?RADIANCE') && !magic.startsWith('#?RGBE'))
  throw Error('Not a Radiance HDR file');

// Skip header key=value lines until blank line
while (readAsciiLine().length > 0) {}

// Resolution line: -Y height +X width
const m = readAsciiLine().match(/-Y\s+(\d+)\s+\+X\s+(\d+)/);
const height = parseInt(m[1], 10);
const width  = parseInt(m[2], 10);
```

Pixel data uses two encoding schemes detected at scanline granularity. The **new RLE format** stores each channel (R, G, B, E) as a separate interleaved RLE stream, flagged by the scanline prefix `[2, 2, W>>8, W&255]`:

```typescript
// ── from src/assets/hdr_loader.ts ──
if (r === 2 && g === 2 && (b & 0x80) === 0) {
  // New RLE scanline: 4 independent RLE streams (R, G, B, E)
  const sw = (b << 8) | e;  // stored width, must match header
  readNewScanline(y);
}
```

Each channel stream uses run-length encoding where `code > 128` means repeat the next byte `code - 128` times:

```typescript
// ── from src/assets/hdr_loader.ts ──
while (x < width) {
  const code = bytes[pos++];
  if (code > 128) {
    const count = code - 128;
    dst.fill(bytes[pos++], x, x + count);
    x += count;
  } else {
    dst.set(bytes.subarray(pos, pos + code), x);
    pos += code;  x += code;
  }
}
```

The **old/uncompressed format** stores raw RGBE quads, with `[1, 1, 1, count]` sequences indicating a pixel-repeat run.

#### GPU-Accelerated RGBE Decoding

Rather than computing `Math.pow(2, e - 128)` per pixel on the CPU, the raw RGBE bytes are uploaded as an `rgba8uint` texture and decoded to `rgba16float` via a compute shader (`src/shaders/rgbe_decode.wgsl`):

```typescript
// ── from src/assets/hdr_loader.ts ──
// Upload raw RGBE bytes as uint texture — CPU does no math
const srcTex = device.createTexture({
  format: 'rgba8uint',
  usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
});
device.queue.writeTexture(
  { texture: srcTex },
  data.buffer, { bytesPerRow: width * 4 }, { width, height },
);

// Decode via compute shader → rgba16float
const dstTex = device.createTexture({
  format: 'rgba16float',
  usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING,
});

pass.setPipeline(pipeline);
pass.setBindGroup(0, srcBG);  // rgba8uint input
pass.setBindGroup(1, dstBG);  // rgba16float output
pass.dispatchWorkgroups(ceil(width / 8), ceil(height / 8));
```

The decode shader expands each RGBE texel to floating-point radiance in a single arithmetic instruction:

```wgsl
@compute @workgroup_size(8, 8)
fn cs_decode(@builtin(global_invocation_id) id: vec3u) {
  let rgbe = textureLoad(srcTex, id.xy, 0);
  let exponent = f32(rgbe.a * 255u) - 128.0;
  textureStore(dstTex, id.xy, vec4f(vec3f(rgbe.rgb) * pow(2.0, exponent), 1.0));
}
```

The compute pipeline and bind group layouts are cached per-device via a `WeakMap`, so repeated HDR loads reuse the same compiled shader.

#### Equirectangular to Cubemap Extraction

The decoded 2D equirectangular HDR texture is typically converted to a cubemap for skybox rendering and IBL pre-filtering. Crafty renders six fullscreen quads, each sampling the equirectangular texture with spherical coordinates derived from the cubemap face direction:

```wgsl
// In the cubemap-face render pass
let dir = normalize(cubeFaceDir);
let u = 0.5 + atan2(dir.z, dir.x) / (2.0 * PI);
let v = 0.5 - asin(clamp(dir.y, -1.0, 1.0)) / PI;
let radiance = textureSample(equirectTex, sampler, vec2f(u, v));
```

This face-by-face rendering produces a 6-layer cube texture used as the sky background and as the source for the IBL irradiance and prefiltered environment maps.

### Block Texture Atlas

Voxel games face a unique texturing challenge: there can be hundreds of unique block types, each with up to 6 face textures. Rather than binding individual textures per chunk, Crafty packs all block textures into a **texture atlas**. Each block face stores its UV offset and scale within the atlas as part of its material parameters, so a fragment's local UV gets remapped into the atlas at sample time:

![Block atlas with per-tile UV remapping](../illustrations/06-block-atlas.svg)

The atlas is built at development time via `npm run build-atlas`, which runs `scripts/build_atlas.js`.

Multiple atlas textures exist for different channel groups — all four are sampled in parallel at the same UV per fragment:

![Four parallel atlases sampled at the same UV](../illustrations/06-atlas-channels.svg)


| Atlas | Channels | Format |
|-------|----------|--------|
| Color atlas | sRGB albedo | Compressed or `rgba8unorm` |
| Normal atlas | Tangent-space normals | `rgba8unorm` |
| MER atlas | Metallic (R), Emissive (G), Roughness (B) | `rgba8unorm` |
| Heightmap atlas | Parallax/height data | `r8unorm` |

The chunk geometry pass samples the atlas using per-vertex UV coordinates combined with per-face atlas tile parameters:

```wgsl
let uv = input.uv * material.uvScale + material.uvOffset;
let albedo = textureSample(albedo_map, mat_samp, uv);
```

## 5.3 Textures in the GBuffer

The deferred G-buffer writes two color textures that encode surface properties for the lighting pass:

**Albedo + Roughness** (`rgba8unorm`):
```
R = albedo red
G = albedo green
B = albedo blue
A = roughness (0 = smooth, 1 = rough)
```

**Normal + Metallic** (`rgba16float`):
```
R = world-space normal X
G = world-space normal Y
B = world-space normal Z
A = metallic (0 = dielectric, 1 = metal)
```

The `rgba16float` format for the normal-metallic texture is critical — world-space normals can be negative and require higher precision than `unorm` provides.

## 5.4 The PBR Material System

The `Material` abstract class (`src/engine/material.ts`) defines the interface that all materials must implement:

```typescript
export abstract class Material {
  abstract readonly shaderId: string;
  transparent: boolean = false;

  abstract getShaderCode(passType: MaterialPassType): string;
  abstract getBindGroupLayout(device: GPUDevice): GPUBindGroupLayout;
  abstract getBindGroup(device: GPUDevice): GPUBindGroup;
  update?(queue: GPUQueue): void;
  destroy?(): void;
}
```

### Material Pass Types

A material can provide different shader code for different render passes:

```typescript
export enum MaterialPassType {
  Forward = 'forward',             // Forward rendering (transparent objects)
  Geometry = 'geometry',           // Deferred G-buffer fill (opaque)
  SkinnedGeometry = 'skinnedGeometry',  // Skinned mesh G-buffer fill
}
```

Most materials use only `Geometry` (opaque objects). Transparent materials use `Forward`. Skinned meshes use `SkinnedGeometry` (which adds joint matrix bindings).

### Shared Bind Group Slot

All materials place their resources at `@group(2)`, which is reserved in the render pass pipeline layouts:

```typescript
export const MATERIAL_GROUP = 2;
```

This means a material's bind group can contain:

```wgsl
@group(2) @binding(0) var<uniform> material: MaterialUniforms;
@group(2) @binding(1) var albedo_map: texture_2d<f32>;
@group(2) @binding(2) var normal_map: texture_2d<f32>;
@group(2) @binding(3) var mer_map   : texture_2d<f32>;
@group(2) @binding(4) var mat_samp  : sampler;
```

The material uniform struct contains PBR parameters:

```wgsl
struct MaterialUniforms {
  albedo   : vec4<f32>,     // RGBA base color (+ padding)
  roughness: f32,
  metallic : f32,
  uvOffset : vec2<f32>,     // Atlas tile offset
  uvScale  : vec2<f32>,     // Atlas tile scale
  uvTile   : vec2<f32>,     // UV tiling repetition
}
```

### Pipeline Caching

Pipelines are cached by `shaderId` — a stable identifier shared by all instances of a material subclass:

```typescript
private _pipelineCache = new Map<string, GPURenderPipeline>();

private _getPipeline(device: GPUDevice, material: Material): GPURenderPipeline {
  let pipeline = this._pipelineCache.get(material.shaderId);
  if (pipeline) return pipeline;
  // Create and cache pipeline
  const shaderModule = device.createShaderModule({
    code: material.getShaderCode(MaterialPassType.Geometry),
  });
  pipeline = device.createRenderPipeline({
    layout: device.createPipelineLayout({
      bindGroupLayouts: [
        cameraBGL,                        // group 0
        modelBGL,                         // group 1
        material.getBindGroupLayout(device), // group 2
      ],
    }),
    // ... vertex, fragment, depth, primitive state ...
  });
  this._pipelineCache.set(material.shaderId, pipeline);
  return pipeline;
}
```

Materials sharing a `shaderId` MUST return identical WGSL source and bind group layouts — the cache assumes they are interchangeable.

### Material Update Pattern

Materials can implement an optional `update()` method that the pass calls once per draw to flush dirty uniforms:

```typescript
// In the geometry pass execute():
for (let i = 0; i < this._drawItems.length; i++) {
  const item = this._drawItems[i];
  // Upload model matrix
  ctx.queue.writeBuffer(this._modelBuffers[i], 0, modelData.buffer);
  // Flush material updates
  item.material.update?.(ctx.queue);
}
```

This pattern allows materials to lazily update GPU uniform buffers only when their CPU-side properties change, using a dirty flag internally.

## 5.5 Material Passes

Different render passes use different subsets of the material system. The mesh kind (static / skinned / voxel) and the `transparent` flag determine which pass actually draws an object:

![Material → render pass routing](../illustrations/06-material-pass-routing.svg)


**GeometryPass** draws opaque materials into the G-buffer. It expects materials to output albedo+roughness and normal+metallic in the fragment shader.

**BlockGeometryPass** draws voxel chunk geometry. Chunks use a dedicated shader (`chunk_geometry.wgsl`) that samples the block texture atlas and packs the same G-buffer format.

**ForwardPass** renders transparent materials with per-pixel lighting. Transparent materials use `depthWriteEnabled: false` and alpha blending:

```typescript
fragment: {
  module: shaderModule,
  entryPoint: 'fs_main',
  targets: [{
    format: HDR_FORMAT,
    blend: {
      color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha' },
      alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha' },
    },
  }],
},
```

## 5.6 Shader Management and Caching

WGSL shaders are stored in `src/shaders/` and loaded at module scope via Vite's `?raw` import:

```typescript
import lightingWgsl from '../../shaders/deferred_lighting.wgsl?raw';
```

This inlines the shader source as a JavaScript string at build time. No runtime fetch is needed.

### Common Shader Module

The `src/shaders/common.wgsl` file defines shared types and utility functions used across multiple shaders:

```wgsl
struct CameraUniforms {
  view       : mat4x4<f32>,
  proj       : mat4x4<f32>,
  viewProj   : mat4x4<f32>,
  invViewProj: mat4x4<f32>,
  position   : vec3<f32>,
  near       : f32,
  far        : f32,
}
```

Each `Material` subclass returns complete WGSL source from `getShaderCode()`, which may concatenate shared code with specific implementations. Reinventing this per material avoids the complexity of a full shader include system while keeping the shader source self-contained.

## 5.7 Shader Variants

A `PbrMaterial` is configurable: any of its texture maps (`albedoMap`, `normalMap`, `merMap`) can be present or absent independently. That's eight possible combinations, but compiling eight separate shader files would be brittle and impossible to keep in sync. Instead, every material shader is **one file** with `#ifdef` guards around the optional bindings and sampling code; the geometry pass picks the right variant per draw by passing different `defines` to the shader compiler.

The mechanism behind `#ifdef` — `ctx.createShaderModule(source, label, defines)` and the preprocessor that runs ahead of `#import` resolution — is described in [§2.7 Shader Variants](02-webgpu-fundamentals.md#shader-variants). This section covers how the material system actually drives it.

### The Variant Mask

Each `PbrMaterial` instance exposes a small bitmask describing which optional features are active for *this* material:

```typescript
// ── from src/renderer/materials/pbr_material.ts ──
const HAS_ALBEDO_MAP = 1 << 0;
const HAS_NORMAL_MAP = 1 << 1;
const HAS_MER_MAP    = 1 << 2;

get variantMask(): number {
  let mask = 0;
  if (this._albedoMap) mask |= HAS_ALBEDO_MAP;
  if (this._normalMap) mask |= HAS_NORMAL_MAP;
  if (this._merMap)    mask |= HAS_MER_MAP;
  return mask;
}
```

A material with all three texture maps reports `0b111 = 7`. A material with only an albedo map reports `0b001 = 1`. The mask is computed from the same `_*Map` fields that drive `getBindGroup()`, so it always reflects what the material is actually about to bind.

### The Shader Guards

The geometry shader uses the same three names as `#ifdef` guards, around both the **binding declarations** and the **sampling code**:

```wgsl
// ── from src/shaders/geometry.wgsl ──
@group(2) @binding(0) var<uniform> material: MaterialUniforms;
#ifdef HAS_ALBEDO_MAP
@group(2) @binding(1) var albedo_map: texture_2d<f32>;
#endif
#ifdef HAS_NORMAL_MAP
@group(2) @binding(2) var normal_map: texture_2d<f32>;
#endif
#ifdef HAS_MER_MAP
@group(2) @binding(3) var mer_map   : texture_2d<f32>;
#endif
@group(2) @binding(4) var mat_samp  : sampler;

// ...

@fragment
fn fs_main(in: VertexOutput) -> FragmentOutput {
  let atlas_uv = fract(in.uv * material.uvTile) * material.uvScale + material.uvOffset;

#ifdef HAS_ALBEDO_MAP
  let albedo = textureSample(albedo_map, mat_samp, atlas_uv).rgb * material.albedo.rgb;
#else
  let albedo = material.albedo.rgb;
#endif

  // ...
}
```

Guarding the binding declarations — not just the sampling code — is what makes the variant pay off. A variant compiled with `HAS_ALBEDO_MAP` undefined doesn't have an `albedo_map` binding at all; the bind group layout for that variant doesn't have to allocate a slot for it. The compiled shader is also strictly smaller, with no dead `textureSample` calls a driver would otherwise have to eliminate.

### Wiring It Together

The geometry pass ties shader variant, bind group layout, and pipeline together via a single cache key:

```typescript
// ── from src/renderer/render_graph/passes/geometry_pass.ts ──
const variantMask = (item.material as any).variantMask ?? 0;
enc.setPipeline(this._getPipeline(item.material, variantMask));

// ...

private _getPipeline(material: Material, variantMask: number): GPURenderPipeline {
  const key = `${material.shaderId}:${variantMask}`;
  let pipeline = this._pipelineCache.get(key);
  if (pipeline) return pipeline;

  const defines: Record<string, string> = {};
  if (variantMask & 1) defines['HAS_ALBEDO_MAP'] = '1';
  if (variantMask & 2) defines['HAS_NORMAL_MAP'] = '1';
  if (variantMask & 4) defines['HAS_MER_MAP']    = '1';

  const shaderModule = this._ctx.createShaderModule(
    material.getShaderCode(MaterialPassType.Geometry, variantMask),
    `GeometryShader[${key}]`,
    defines,
  );
  pipeline = this._device.createRenderPipeline({
    label: `GeometryPipeline[${key}]`,
    layout: this._device.createPipelineLayout({
      bindGroupLayouts: [
        this._cameraBgl,
        this._modelBgl,
        material.getBindGroupLayout(this._device, variantMask),
      ],
    }),
    // ... vertex, fragment, depth, primitive state ...
  });
  this._pipelineCache.set(key, pipeline);
  return pipeline;
}
```

Three things are keyed by the same `variantMask`:

1. **The shader module.** `defines` is built from the mask bits and fed to `ctx.createShaderModule()`, which preprocesses the WGSL before passing it to WebGPU.
2. **The bind group layout.** `material.getBindGroupLayout(device, variantMask)` returns a layout whose entries match the bindings actually present in this variant's compiled shader.
3. **The pipeline cache key.** `shaderId:variantMask` ensures one compiled pipeline per (material type, feature combination). A scene with 100 PBR materials but only three unique masks ends up with three pipelines.

WebGPU validates pipeline-layout/shader-binding compatibility at pipeline creation time, so keeping the layout and the shader in lockstep through the same mask is what makes the whole thing safe. A mismatch — for example, returning the all-textures layout while compiling a no-textures shader — would fail at `createRenderPipeline` immediately, not at draw time.

### Why Not Just Always Bind All Textures?

A reasonable alternative would be to always declare all three texture bindings and bind a 1×1 white placeholder when a map is absent. That avoids variants entirely, but at the cost of:

- A bind group layout slot for every optional texture, whether or not it's used.
- Extra `textureSample` calls and arithmetic on every fragment.
- Less help from the driver, which can no longer specialise the shader to the actual binding set.

Variants pay for these costs in pipeline-cache size rather than per-fragment work. For a small, well-defined set of feature flags (Crafty's PBR material has three, giving at most eight variants per pass type), that trade-off is comfortably the right one — variants are negligible to cache and meaningfully cheaper to execute. A material with dozens of independently-toggleable features would have to be more careful, since the cache size grows exponentially with the number of flags.

### Same Mask Across Pass Types

The variant mask isn't pass-specific — it's a property of the material instance and gets used by every pass that draws it. `GeometryPass`, `ForwardPass`, and `SkinnedGeometryPass` all consult `material.variantMask` and pass it to both `getShaderCode(passType, mask)` and `getBindGroupLayout(device, mask)`. The same opaque mesh drawn into the G-buffer and into a depth-only shadow map will compile two pipelines (one per pass type) but they share the same `HAS_ALBEDO_MAP / HAS_NORMAL_MAP / HAS_MER_MAP` settings, keyed by the same mask.

## 5.8 Summary

The material system decouples surface appearance from the renderer:

- **Textures** are GPU images with a specific dimensionality (2D, cube, 3D).
- **The block atlas** packs all voxel textures into a single texture with per-tile UV remapping.
- **Materials** implement an abstract interface providing WGSL, bind group layouts, and per-frame uniform updates.
- **Pipeline caching** by `shaderId` ensures materials sharing a shader also share compilation results.

**Further reading:**
- `src/engine/material.ts` — Abstract Material base class
- `src/assets/mesh.ts` — Vertex layout matching the shader inputs
- `src/shaders/geometry.wgsl` — G-buffer fill shader
- `src/shaders/forward_pbr.wgsl` — Forward PBR shader (transparency)
- `src/shaders/common.wgsl` — Shared struct definitions

----
[Contents](../crafty.md) | [04-Meshes](04-meshes.md) | [06-Lighting](06-lighting.md)
