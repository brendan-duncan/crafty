# Chapter 3: WebGPU Fundamentals

[Contents](../crafty.md) | [02-Mathematics](02-mathematics.md) | [04-Rendering Architecture](04-rendering-architecture.md)

This chapter introduces the WebGPU API from the ground up. We cover every resource type and pipeline stage that Crafty uses, building toward the `RenderContext` abstraction that the rest of the engine is built on.

## 3.1 The Graphics Pipeline

Before diving into the API, it is worth reviewing the modern GPU pipeline. Every frame, the GPU executes a sequence of stages:

![The modern GPU graphics pipeline](../illustrations/03-graphics-pipeline.svg)

WebGPU exposes a subset of this pipeline with a clean, explicit API. The key programmable stages are:

- **Vertex shader** — transforms vertices from model space to clip space, passes interpolated data to the fragment shader.
- **Fragment shader** — computes the color of each rasterised pixel, performing lighting, texturing, and shading.
- **Compute shader** — a general-purpose shader that operates on arbitrary workgroups (used by Crafty for particle systems and auto-exposure).

Pipeline state is fully explicit. Every combination of shaders, vertex layout, blend mode, depth test, and primitive topology is compiled into an immutable `GPURenderPipeline` object. There is no global state — you bind a pipeline, bind resources, and draw.

## 3.2 GPUDevice and GPUAdapter

The entry point to WebGPU is `navigator.gpu`. The first step is to request an **adapter** (a physical or virtual GPU), then create a **device** (the logical handle to that GPU). The device, in turn, owns every resource you create — buffers, textures, shaders, pipelines — and exposes a single queue for submitting work:

![WebGPU object hierarchy](../illustrations/03-device-hierarchy.svg)


```typescript
// ── from src/renderer/render_context.ts ──

static async create(canvas: HTMLCanvasElement, options: RenderContextOptions = {}): Promise<RenderContext> {
  if (!navigator.gpu) {
    throw new Error('WebGPU not supported');
  }

  const adapter = await navigator.gpu.requestAdapter({
    powerPreference: 'high-performance',
  });
  if (!adapter) {
    throw new Error('No WebGPU adapter found');
  }

  const device = await adapter.requestDevice({
    requiredFeatures: [],
  });
  // ...
}
```

**Adapter selection.** We request `powerPreference: 'high-performance'` to prefer the discrete GPU when one is available. The alternative `'low-power'` prefers integrated GPUs to save battery. If the returned adapter is `null`, WebGPU is not available on this system.

**Device creation.** `adapter.requestDevice()` creates a logical device that owns all GPU resources. The `requiredFeatures` array requests optional WebGPU features; Crafty currently uses none, keeping compatibility as broad as possible.

**Error handling.** When `enableErrorHandling` is true, the context registers an `uncapturederror` event listener on the device that logs validation, out-of-memory, and internal errors:

```typescript
device.addEventListener('uncapturederror', (event) => {
  const err = event.error;
  if (err instanceof GPUValidationError) {
    console.error('[WebGPU Validation Error]', err.message);
  } else if (err instanceof GPUOutOfMemoryError) {
    console.error('[WebGPU Out of Memory]');
  }
});
```

Validation errors are the most common — they occur when you misuse the API (e.g., binding a buffer with the wrong usage flags). WebGPU's validation is strict and comprehensive, which means most bugs are caught at creation time rather than appearing as graphical corruption.

### Canvas Configuration

Once we have a device, we configure the canvas to create a swap chain:

```typescript
const context = canvas.getContext('webgpu') as GPUCanvasContext;

// Attempt HDR canvas: rgba16float + display-p3 + extended tonemapping.
let format: GPUTextureFormat;
let hdr = false;
try {
  context.configure({
    device,
    format: 'rgba16float',
    alphaMode: 'opaque',
    colorSpace: 'display-p3',
    toneMapping: { mode: 'extended' },
  });
  const config = context.getConfiguration();
  // Verify that we actually got an HDR display.
  if (config.toneMapping.mode === "extended") {
    format = 'rgba16float';
    hdr = true;
  } else {
    // The display doesn't support HDR, get the format used by the canvas.
    format = navigator.gpu.getPreferredCanvasFormat();
  }
} catch {
  // Fallback to preferred SDR format
  format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({ device, format, alphaMode: 'opaque' });
}
```

Crafty attempts an HDR swap chain (`rgba16float` with `display-p3` color space and extended tone mapping). If the platform does not support it (the `configure()` call throws), we fall back to the platform's preferred SDR format — typically `bgra8unorm` on Windows and `rgba8unorm` on macOS.

## 3.3 GPUBuffer

A `GPUBuffer` is a block of GPU-accessible memory. Buffers are the primary mechanism for moving data between CPU and GPU.

### Buffer Creation

Crafty provides a convenience wrapper `createBuffer` on `RenderContext`:

```typescript
// from src/renderer/render_context.ts
createBuffer(size: number, usage: GPUBufferUsageFlags, label?: string): GPUBuffer {
  return this.device.createBuffer({ size, usage, label });
}
```

The `usage` parameter specifies how the buffer can be used:

| Flag | Used for |
|------|----------|
| `UNIFORM` | Small, frequently updated per-frame data (matrices, lights) |
| `STORAGE` | Large, randomly accessed data (skinning joints, particles) |
| `VERTEX` | Vertex positions, normals, UVs |
| `INDEX` | Triangle index lists |
| `COPY_DST` | Receiving data from `queue.writeBuffer()` |
| `COPY_SRC` | Source for `commandEncoder.copyBufferToTexture()` |
| `INDIRECT` | Indirect draw/dispatch parameters |

Example from the `GeometryPass` camera uniform buffer:

```typescript
const cameraBuffer = device.createBuffer({
  label: 'GeomCameraBuffer',
  size: CAMERA_UNIFORM_SIZE,   // 4 mat4 + vec3 + near/far = 288 bytes
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});
```

The `COPY_DST` flag is essential here — it allows us to upload data via `queue.writeBuffer()`.

### Uploading Data

The fastest way to upload data is `GPUQueue.writeBuffer()`, which copies CPU memory directly into the GPU buffer without an explicit staging buffer:

```typescript
// ── from RenderContext.writeBuffer ──
writeBuffer(buffer: GPUBuffer, data: ArrayBuffer | ArrayBufferView, offset = 0): void {
  if (data instanceof ArrayBuffer) {
    this.queue.writeBuffer(buffer, offset, data);
  } else {
    this.queue.writeBuffer(buffer, offset,
      data.buffer as ArrayBuffer, data.byteOffset, data.byteLength);
  }
}
```

Crafty uses `writeBuffer` extensively for per-frame uniform updates. For example, the geometry pass uploads camera matrices each frame:

```typescript
// ── from GeometryPass.updateCamera ──
updateCamera(ctx: RenderContext, view: Mat4, proj: Mat4, viewProj: Mat4,
             invViewProj: Mat4, camPos: Vec3, near: number, far: number): void {
  const data = this._cameraScratch;  // pre-allocated Float32Array
  data.set(view.data,         0);
  data.set(proj.data,        16);
  data.set(viewProj.data,    32);
  data.set(invViewProj.data, 48);
  data[64] = camPos.x; data[65] = camPos.y; data[66] = camPos.z;
  data[67] = near;
  data[68] = far;
  ctx.queue.writeBuffer(this._cameraBuffer, 0, data.buffer as ArrayBuffer);
}
```

The `_cameraScratch` `Float32Array` is pre-allocated once in the constructor and reused every frame. This avoids garbage-collector pressure from per-frame allocations.

### Buffer Alignment

WebGPU imposes alignment requirements on buffer bindings:

- **Uniform buffers**: `minUniformBufferOffsetAlignment`, typically 256 bytes.
- **Storage buffers**: `minStorageBufferOffsetAlignment`, typically 16 bytes.

Crafty uses dynamic offset uniform buffers in `BlockGeometryPass` to fit per-chunk data into a single large buffer, where each chunk gets a 256-byte aligned slot.

## 3.4 GPUTexture

A `GPUTexture` is a GPU image — a 2D, 3D, or cube-map array of texels used as render targets, depth buffers, or shader-readable inputs.

### Texture Creation

The `GBuffer` class allocates three textures for deferred rendering. Each one packs different per-pixel data into its four channels — albedo + roughness, world-space normal + metallic, and depth:

![GBuffer channel packing across three textures](../illustrations/03-gbuffer-layout.svg)


```typescript
// ── from src/renderer/gbuffer.ts ──
static create(ctx: RenderContext): GBuffer {
  const { device, width, height } = ctx;

  const albedoRoughness = device.createTexture({
    label: 'GBuffer AlbedoRoughness',
    size: { width, height },
    format: 'rgba8unorm',
    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
  });

  const normalMetallic = device.createTexture({
    label: 'GBuffer NormalMetallic',
    size: { width, height },
    format: 'rgba16float',
    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
  });

  const depth = device.createTexture({
    label: 'GBuffer Depth',
    size: { width, height },
    format: 'depth32float',
    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
  });

  return new GBuffer(albedoRoughness, normalMetallic, depth, width, height);
}
```

Key texture parameters:

| Parameter | Description |
|-----------|-------------|
| `size` | `{ width, height, depthOrArrayLayers }` — 1 for a standard 2D texture |
| `format` | Texel format — `rgba8unorm`, `rgba16float`, `depth32float`, etc. |
| `usage` | Bitfield specifying how the texture is used (`RENDER_ATTACHMENT`, `TEXTURE_BINDING`, `COPY_DST`, etc.) |
| `mipLevelCount` | Number of mip levels (default 1) |
| `sampleCount` | MSAA sample count (default 1, no multisampling) |

### Texture Views

A `GPUTextureView` is a window into a texture — a specific subresource (mip level, array layer, aspect) that can be bound as a render target or shader input. Most of the time you just want the default view:

```typescript
this.albedoRoughnessView = albedoRoughness.createView();
```

But some passes need specialized views — for example, reading only the depth aspect of a depth-stencil texture, or binding a single array layer of a cube map.

### HDR Render Target

The lighting pass writes into an HDR color attachment with format `rgba16float`:

```typescript
export const HDR_FORMAT: GPUTextureFormat = 'rgba16float';
```

This is a 16-bit-per-channel floating-point format, giving a wider dynamic range and color precision than the 8-bit sRGB swap chain. The HDR texture persists through post-processing (bloom, TAA, DOF) before being tone-mapped to SDR for display.

## 3.5 GPUSampler

A `GPUSampler` controls how textures are sampled in shaders — filtering mode, addressing mode (wrap/clamp/mirror), and level-of-detail behavior. Samplers are created once and reused across passes.

Typical creation pattern from Crafty's passes:

```typescript
const sampler = device.createSampler({
  addressModeU: 'repeat',
  addressModeV: 'repeat',
  magFilter: 'linear',
  minFilter: 'nearest',
  mipmapFilter: 'linear',
});
```

Samplers are lightweight objects that are bound to shaders through bind groups.

## 3.6 GPUBindGroup and GPUBindGroupLayout

Resources are made available to shaders through **bind groups**. A `GPUBindGroupLayout` describes the types and visibility of resources a shader expects. A `GPUBindGroup` binds actual resources (buffers, textures, samplers) to that layout.

The bind group index from `setBindGroup(N, …)` on the CPU lines up with the `@group(N)` annotation in the shader, and the per-entry `binding` numbers line up with `@binding(M)`. This is how Crafty's geometry pass connects camera, model, and material data to its WGSL:

![Bind groups link CPU resources to shader bindings](../illustrations/03-bind-groups.svg)


### Bind Group Layout

Layouts are immutable descriptions of resource bindings. Here is the geometry pass creating layouts for its camera and model uniforms:

```typescript
// from src/renderer/passes/geometry_pass.ts
const cameraBGL = device.createBindGroupLayout({
  label: 'GeomCameraBGL',
  entries: [
    {
      binding: 0,
      visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      buffer: { type: 'uniform' },
    },
  ],
});

const modelBGL = device.createBindGroupLayout({
  label: 'GeomModelBGL',
  entries: [
    {
      binding: 0,
      visibility: GPUShaderStage.VERTEX,
      buffer: { type: 'uniform' },
    },
  ],
});
```

The `visibility` field controls which shader stages can access the resource. The `type` field specifies the resource type (`uniform`, `storage`, `read-only-storage`, `texture`, `sampler`, etc.).

Why does WebGPU use a BindGroupLayout, when a BindGroup should be enough? The answer is about validation. The BindGroupLayouts that will be used with a shader are included when creating a Pipeline object. This validates that the shader will be compatible with the resources you intend to use with the shader. The BindGroupLayout is also used to create a BindGroup, validating the BindGroup will be compatible with the Pipeline. Since everything has now been validated at object creation time, WebGPU doesn't need to do that validation at runtime.

### Bind Group

Bind groups are the actual resource handles bound to a layout:

```typescript
const cameraBindGroup = device.createBindGroup({
  label: 'GeomCameraBindGroup',
  layout: cameraBGL,
  entries: [
    { binding: 0, resource: { buffer: cameraBuffer } },
  ],
});
```

During draw, the pipeline sets bind groups at indices matching the WGSL `@group(N)` attribute:

```typescript
pass.setBindGroup(0, this._cameraBindGroup);   // @group(0) in shader
pass.setBindGroup(1, this._modelBindGroups[i]); // @group(1)
pass.setBindGroup(2, item.material.getBindGroup(device)); // @group(2)
```

In the WGSL shader, these correspond to:

```wgsl
// from src/shaders/geometry.wgsl
@group(0) @binding(0) var<uniform> camera  : CameraUniforms;
@group(1) @binding(0) var<uniform> model   : ModelUniforms;
@group(2) @binding(0) var<uniform> material: MaterialUniforms;
@group(2) @binding(1) var albedo_map: texture_2d<f32>;
@group(2) @binding(2) var normal_map: texture_2d<f32>;
@group(2) @binding(3) var mer_map   : texture_2d<f32>;
@group(2) @binding(4) var mat_samp  : sampler;
```

Bind groups are lightweight to create and can be updated each frame when the underlying resource changes (e.g., a new shadow map texture).

## 3.7 GPUShaderModule and WGSL

WebGPU shaders are written in **WGSL** (WebGPU Shading Language), a concise, SPIR-V-derived language designed for the web.

### Shader Structure

A WGSL shader module contains a sequence of declarations — structs, bindings, functions, and entry points. Here is the geometry pass vertex shader:

```wgsl
// ── from src/shaders/geometry.wgsl ──

struct CameraUniforms {
  view       : mat4x4<f32>,
  proj       : mat4x4<f32>,
  viewProj   : mat4x4<f32>,
  invViewProj: mat4x4<f32>,
  position   : vec3<f32>,
  near       : f32,
  far        : f32,
}

struct ModelUniforms {
  model       : mat4x4<f32>,
  normalMatrix: mat4x4<f32>,
}

struct VertexInput {
  @location(0) position: vec3<f32>,
  @location(1) normal  : vec3<f32>,
  @location(2) uv      : vec2<f32>,
  @location(3) tangent : vec4<f32>,
}

struct VertexOutput {
  @builtin(position) clip_pos  : vec4<f32>,
  @location(0)       world_pos : vec3<f32>,
  @location(1)       world_norm: vec3<f32>,
  @location(2)       uv        : vec2<f32>,
  @location(3)       world_tan : vec4<f32>,
}

@group(0) @binding(0) var<uniform> camera : CameraUniforms;
@group(1) @binding(0) var<uniform> model  : ModelUniforms;

@vertex
fn vs_main(input: VertexInput) -> VertexOutput {
  let world_pos = model.model * vec4f(input.position, 1.0);
  var output: VertexOutput;
  output.clip_pos = camera.viewProj * world_pos;
  output.world_pos = world_pos.xyz;
  output.world_norm = (model.normalMatrix * vec4f(input.normal, 0.0)).xyz;
  output.uv = input.uv;
  output.world_tan = model.normalMatrix * input.tangent;
  return output;
}
```

Key WGSL features visible here:

- **Struct types** define shader interfaces.
- `@group(N) @binding(M)` attributes link bindings to the bind groups set from the CPU.
- `@location(N)` specifies vertex attribute locations and inter-stage varying slots.
- `@builtin(position)` marks the clip-space position output.
- `var<uniform>` declares a uniform buffer; `var texture_2d<f32>` declares a sampled texture.

### Shader Compilation

Shader modules are created from WGSL source code at runtime:

```typescript
const shaderModule = device.createShaderModule({
  label: `GeometryShader[${material.shaderId}]`,
  code: material.getShaderCode(MaterialPassType.Geometry),
});
```

WebGPU validates WGSL to native GPU instructions as part of `createShaderModule()`. Compilation errors are reported through `getCompilationInfo()`:

```typescript
const info = shaderModule.getCompilationInfo();
for (const msg of info.messages) {
  if (msg.type === 'error') {
    console.error(`Shader error at ${msg.lineNum}:${msg.linePos}: ${msg.message}`);
  }
}
```

Note that WebGPU doesn't actually compile the shader for the GPU backend (D3D, Vulkan, Metal) until a Pipeline object is created using the ShaderModule. This is because the other state information provided by the Pipeline can affect the shader that is compiled for the GPU backend. Because of this, you will find that creating Pipeline objects is significantly more time consuming than createShaderModule.

Crafty loads shaders at module scope via Vite's `?raw` import syntax:

```typescript
import deferredLightingWgsl from '../../shaders/deferred_lighting.wgsl?raw';
```

This inlines the WGSL source as a string at build time, avoiding runtime fetch requests.

### Preprocessor and Shader Blocks

WebGPU does not include any built-in support for preprocessing shaders, or support for importing external shader code into shaders. This keeps the API simple, but it means that any mechanism for shader code reuse or conditional compilation must be provided by the application.

As shaders become more complex, and the more shaders an application has, the more shader code duplication you will start find between shaders. If you have two material shaders that both use the lighting features of Crafty, then without any sort of shared code mechanism both shaders would need to have their own copy of the lighting code. This both makes writing shaders more complicated and becomes a maintenance burden as changing the lighting code now needs to be done in multiple places.

Crafty includes its own system for preprocessing shaders and importing shader code blocks, exposed through two modules: `preprocessShader` and `ShaderBlockManager`.

#### The Preprocessor

The `preprocessShader` function (`src/assets/preprocess_shader.ts`) processes a WGSL source string line-by-line, interpreting lines starting with `#` as preprocessor directives. The output is a new string with all directives stripped and conditional branches resolved.

Supported directives:

| Directive | Description |
|-----------|-------------|
| `#define NAME` | Defines `NAME` with value `1` |
| `#define NAME value` | Defines `NAME` with the given value |
| `#undef NAME` | Removes a definition |
| `#ifdef NAME` | Includes the block if `NAME` is defined |
| `#if expr` | Includes the block if the expression is non-zero |
| `#elif expr` | Alternative condition in an `#if`/`#ifdef` chain |
| `#else` | Fallback branch |
| `#endif` | Ends a conditional block |

The `#if` expression evaluator supports comparison operators (`==`, `!=`, `>`, `<`, `>=`, `<=`), logical operators (`!`, `&&`, `||`), parentheses for grouping, and the `defined(NAME)` function that returns `1` if the macro is defined and `0` otherwise. Macro names in expressions are automatically expanded to their defined values; undefined identifiers evaluate to `0`.

```wgsl
#define USE_SHADOWS 1
#define SHADOW_QUALITY 2

#ifdef USE_SHADOWS
  #if SHADOW_QUALITY >= 2
    // high-quality shadow sampling code
  #elif SHADOW_QUALITY == 1
    // low-quality shadow sampling code
  #else
    // simplest shadow (if at all)
  #endif
#else
  // no shadow code at all
#endif
```

Preprocessor directives respect nesting — `#if` blocks can be nested inside other `#if` or `#ifdef` blocks, and each block tracks its own conditional state independently.

#### ShaderBlockManager

The `ShaderBlockManager` class (`src/assets/shader_block_manager.ts`) manages reusable WGSL code blocks. Blocks are identified by a string name and registered at runtime. When a shader source contains `#import "name.wgsl"`, the manager replaces that line with the block's preprocessed WGSL code.

During construction, `ShaderBlockManager` automatically loads every `.wgsl` file from `src/shaders/modules/` using Vite's `import.meta.glob`, registering each file as a named block (the filename without the `.wgsl` extension). This means the three built-in modules — `camera.wgsl`, `lighting.wgsl`, and `model.wgsl` — are immediately available for import without any manual registration.

Block lookups are recursive — if block A imports block B, the manager will resolve B's imports as well. Each block is also preprocessed before insertion, so blocks can contain their own `#define`, `#ifdef`, and other directives.

```typescript
// Register a custom block at runtime
ctx.registerShaderBlock('my_utils', 'fn utility() {}');

// Use it in a shader
// #import "my_utils.wgsl"
```

#### Using #import in WGSL Shaders

Shader source files use `#import` to pull in blocks. Here is a complete example from `samples/procedural_test.wgsl`:

```wgsl
// samples/procedural_test.wgsl
#import "camera.wgsl"
#import "lighting.wgsl"
#import "model.wgsl"

struct VertexInput {
  @location(0) position: vec3<f32>,
  @location(1) normal  : vec3<f32>,
  @location(2) uv      : vec2<f32>,
  @location(3) tangent : vec4<f32>,
};
// ... rest of the shader
```

The `#import "lighting.wgsl"` line is of particular note. The `lighting.wgsl` built-in block (220 lines) includes all of the PBR lighting infrastructure: light struct definitions (`PointLight`, `SpotLight`, `DirectionalLight`), the `LightingUniforms` struct, all 11 bind group entries at `@group(3)` for lights, shadow maps, IBL cubemaps and the BRDF LUT, plus all of the PBR calculation functions (`calculate_pbr_lighting`, `fresnel_schlick`, `distribution_ggx`, `geometry_smith`, shadow sampling functions). Any shader that needs to perform lighting in Crafty can include this single import rather than duplicating hundreds of lines of WGSL.

Conditional imports are also supported. Because `importShaderBlocks` runs the preprocessor before resolving imports, `#import` lines inside `#ifdef` or `#else` branches are only resolved when their branch is active:

```wgsl
#define USE_LIGHTING
#ifdef USE_LIGHTING
  #import "lighting.wgsl"
#else
  // manual shading code
#endif
```

#### RenderContext Integration

The `RenderContext` class owns a `ShaderBlockManager` instance as a public property (`shaderBlockManager`), which is automatically initialized during context creation. It also provides convenience methods — `registerShaderBlock`, `getShaderBlock`, `removeShaderBlock` — that delegate to the manager.

The key integration point is `RenderContext.createShaderModule`:

```typescript
// from src/renderer/render_context.ts
createShaderModule(code: string, label?: string, defines?: Record<string, string>): GPUShaderModule {
  code = this.shaderBlockManager.importShaderBlocks(code, defines);
  return this.device.createShaderModule({ code, label });
}
```

This method runs the preprocessor and resolves all `#import` directives before passing the final WGSL to `device.createShaderModule`. Using `ctx.createShaderModule()` instead of `device.createShaderModule()` is all that is needed to enable the full preprocessor and shader block system:

```typescript
// Without Crafty's system — raw WebGPU:
const module = device.createShaderModule({ code: shaderSource, label });

// With Crafty's system — preprocessing + imports:
const module = ctx.createShaderModule(shaderSource, label);
```

The optional `defines` parameter allows the caller to inject initial macro definitions that the preprocessor uses before processing any `#define` directives in the shader source. This is useful when the host application needs to control shader features at runtime without modifying the WGSL files.

## 3.8 GPURenderPipeline and GPUComputePipeline

Pipelines are the immutable, compiled representation of the entire GPU state for a draw or dispatch call.

### Render Pipeline Creation

Creating a render pipeline requires specifying vertex buffers, shader stages, fragment targets, depth/stencil state, and primitive topology — every piece of state needed to issue draw calls is funneled into one immutable object:

![Render pipeline assembly](../illustrations/03-render-pipeline-assembly.svg)


```typescript
// ── from geometry_pass.ts _getPipeline ──
pipeline = device.createRenderPipeline({
  label: `GeometryPipeline[${material.shaderId}]`,
  layout: device.createPipelineLayout({
    bindGroupLayouts: [
      this._cameraBGL,
      this._modelBGL,
      material.getBindGroupLayout(device),
    ],
  }),
  vertex: {
    module: shaderModule,
    entryPoint: 'vs_main',
    buffers: [
      {
        arrayStride: VERTEX_STRIDE,        // bytes per vertex
        attributes: VERTEX_ATTRIBUTES,     // position, normal, uv, tangent
      },
    ],
  },
  fragment: {
    module: shaderModule,
    entryPoint: 'fs_main',
    targets: [
      { format: 'rgba8unorm' },    // albedo+roughness
      { format: 'rgba16float' },   // normal+metallic
    ],
  },
  depthStencil: {
    format: 'depth32float',
    depthWriteEnabled: true,
    depthCompare: 'less',
  },
  primitive: {
    topology: 'triangle-list',
    cullMode: 'back',
  },
});
```

**Pipeline layout.** The `GPU PipelineLayout` aggregates all bind group layouts used by the pipeline. This is optional — you can use `layout: 'auto'` — but explicit layouts give you portability and validation across different WebGPU implementations.

**Vertex buffers.** The `buffers` array describes the vertex input layout: `arrayStride` (bytes between consecutive vertices) and `attributes` (location, format, and offset within the stride).

**Fragment targets.** The `targets` array must match the color attachments in the render pass — one entry per attachment.

**Depth/stencil.** We use `depth32float` with `less` comparison and write enabled for the opaque geometry pass.

**Culling.** Back-face culling with counter-clockwise winding order (the default) assumes triangles are wound correctly during mesh creation.

### Pipeline Caching

Creating pipelines is expensive — compilation can take tens of milliseconds on complex shaders. Crafty caches pipelines in a `Map<string, GPURenderPipeline>` keyed by material shader ID:

```typescript
private _pipelineCache = new Map<string, GPURenderPipeline>();

private _getPipeline(device: GPUDevice, material: Material): GPURenderPipeline {
  let pipeline = this._pipelineCache.get(material.shaderId);
  if (pipeline) return pipeline;
  // ... create and cache ...
  this._pipelineCache.set(material.shaderId, pipeline);
  return pipeline;
}
```

Materials that share the same WGSL shader source reuse the same pipeline.

### Compute Pipelines

Compute pipelines are simpler — they have no vertex/fragment state, only a compute shader and layout:

```typescript
const computePipeline = device.createComputePipeline({
  layout: pipelineLayout,
  compute: {
    module: shaderModule,
    entryPoint: 'cs_main',
  },
});
```

Crafty uses compute pipelines for particle simulation, auto-exposure histogram computation, and temporal SSGI.

## 3.9 GPUCommandEncoder and GPUQueue

All GPU work is recorded into a **command buffer** via a `GPUCommandEncoder`, then submitted to the GPU through a `GPUQueue`. Every render pass for the frame writes into a single shared encoder, which is then finished and submitted as one command buffer:

![Frame command flow: encoder → passes → submit](../illustrations/03-frame-command-flow.svg)


### The Frame Recording Pattern

The render graph creates a single encoder per frame and shares it across all passes:

```typescript
// ── from render_graph.ts execute() ──
async execute(ctx: RenderContext): Promise<void> {
  ctx.pushFrameErrorScope();

  const encoder = ctx.device.createCommandEncoder();
  for (const pass of this._passes) {
    if (pass.enabled) {
      pass.execute(encoder, ctx);
    }
  }
  ctx.queue.submit([encoder.finish()]);

  await ctx.popFrameErrorScope();
}
```

**All passes share one encoder.** This is critical for correctness — each pass appends commands (render passes, buffer copies, barriers) into the same encoder. A single `encoder.finish()` produces one command buffer, and `queue.submit()` sends it to the GPU.

## 3.10 Render Passes

A **render pass** records a set of draw calls that write into a fixed collection of **attachments** — textures that serve as the render targets for that pass. The pass begins by declaring those attachments and specifying load and store behavior for each one. It then records state changes (pipeline, bind groups, vertex and index buffers) and draw calls. When the pass ends, the GPU executes every recorded command against those attachments.

Conceptually, a render pass is a transaction: you declare what surfaces you are drawing into, you specify the starting and ending states of those surfaces, and you submit draw commands. The GPU processes the entire pass before the next pass can read from the same surfaces.

The `GPURenderPassEncoder` is the API object that represents this transaction. You create one by calling `encoder.beginRenderPass()` on a command encoder, record into it, and then call `pass.end()`:

```wgsl
const pass = encoder.beginRenderPass(descriptor);
// ... set pipeline, bind groups, buffers, issue draws ...
pass.end();
```

### Attachments

Every render pass operates on one or more **attachments**. There are two categories:

- **Color attachments** — textures that receive color output from the fragment shader. A pass can have up to the device's `maxColorAttachments` limit (typically 8). Each attachment in the `colorAttachments` array corresponds to a `@location(N)` output in the fragment shader.
- **Depth/stencil attachment** — an optional texture that receives depth and/or stencil output. When present, the GPU uses it for the depth test and stencil test on each fragment.

An attachment is described by three fields:

```typescript
{
  view: GPUTextureView,          // which texture (and subresource) to write into
  loadOp: 'clear' | 'load',     // what to do at the start of the pass
  storeOp: 'store' | 'discard', // what to do at the end of the pass
  clearValue?: GPUColor,         // used only when loadOp is 'clear'
}
```

The `view` must be a `GPUTextureView` created from a texture whose usage flags include `RENDER_ATTACHMENT`. The texture format must match the format declared in the render pipeline's fragment targets for color attachments, and the depth/stencil format must match the pipeline's `depthStencil.format`.

### Load and Store Operations

The most important behavioral decision for each attachment is the combination of `loadOp` and `storeOp`.

**`loadOp`** controls what the GPU does to the attachment at the very start of the pass, before any draw calls execute:

| `loadOp` | Behavior |
| --- | --- |
| `'clear'` | Fills the entire attachment with `clearValue` before drawing. This is the most common choice for the first pass that writes to a surface. |
| `'load'` | Preserves whatever was already in the texture. Use this when a later pass wants to add to the contents written by an earlier pass, such as when the block geometry pass appends to a G-buffer that the mesh geometry pass already started filling. |

Choosing `'clear'` is almost always correct for the first pass that writes to a given attachment each frame. It also signals to tile-based GPUs (common in mobile hardware) that they do not need to load the previous frame's contents from main memory into tile memory before beginning, which is a meaningful performance win on those architectures.

**`storeOp`** controls what happens to the attachment's contents at the end of the pass, after all draw calls have finished:

| `storeOp` | Behavior |
| --- | --- |
| `'store'` | Writes the rendered results back to the texture in memory, making them available for subsequent passes or presentation. |
| `'discard'` | Tells the GPU it can throw away the rendered results. Use this for intermediate surfaces that are only needed by the GPU during the pass itself — for example, a multisample resolve target or an intermediate depth buffer that will not be read later. |

On tile-based GPUs, `'discard'` avoids the cost of flushing tile memory back to main memory. When you use MSAA, you typically set `storeOp: 'discard'` on the multi-sampled color attachment and set up a `resolveTarget` pointing to the single-sampled texture where resolved output will be stored.

A complete color attachment for the geometry pass looks like this:

```typescript
{
  view: this._gbuffer.albedoRoughnessView,
  clearValue: [0, 0, 0, 1],
  loadOp: 'clear',
  storeOp: 'store',
}
```

And a subsequent pass that reads the G-buffer depth and writes additional geometry into it uses `'load'`:

```typescript
{
  view: this._gbuffer.albedoRoughnessView,
  loadOp: 'load',   // preserve what the previous geometry pass wrote
  storeOp: 'store',
}
```

Depth/stencil attachments have separate `depthLoadOp` / `depthStoreOp` and `stencilLoadOp` / `stencilStoreOp` fields, along with `depthClearValue` (a float, typically `1.0` for a reverse-Z buffer or `0.0` for a standard near-to-far depth convention) and `stencilClearValue` (an integer):

```typescript
depthStencilAttachment: {
  view: this._gbuffer.depthView,
  depthClearValue: 1.0,
  depthLoadOp: 'clear',
  depthStoreOp: 'store',
}
```

### Relationship to Render Pipelines

The attachment configuration declared in `beginRenderPass()` must be compatible with every `GPURenderPipeline` you bind during that pass. Specifically:

- The number of color attachments must match the number of `targets` entries in the pipeline's `fragment` descriptor.
- Each attachment's texture format must match the corresponding `targets[N].format`.
- If a depth/stencil attachment is present, its format must match `depthStencil.format` in the pipeline.
- The `sampleCount` of the render pass textures must match `multisample.count` in the pipeline (default 1).

WebGPU validates this compatibility when you call `setPipeline()` during the pass. If there is a mismatch, a validation error fires immediately. This is the key reason that pipelines encode format information: it allows the runtime to verify pipeline-attachment compatibility without deferring the check to draw time.

```typescript
// The pipeline's fragment targets...
fragment: {
  module: shaderModule,
  entryPoint: 'fs_main',
  targets: [
    { format: 'rgba8unorm' },    // must match albedoRoughness attachment
    { format: 'rgba16float' },   // must match normalMetallic attachment
  ],
},
// ...must exactly match the render pass attachments:
colorAttachments: [
  { view: albedoRoughnessView, /* format: rgba8unorm */ ... },
  { view: normalMetallicView,  /* format: rgba16float */ ... },
]
```

### Multiple Render Targets

A single render pass can write to multiple color attachments simultaneously. In the fragment shader, each output is declared with a separate `@location(N)` attribute:

```wgsl
struct FragOutput {
  @location(0) albedo_roughness : vec4<f32>,  // → colorAttachments[0]
  @location(1) normal_metallic  : vec4<f32>,  // → colorAttachments[1]
}

@fragment
fn fs_main(in: VertexOutput) -> FragOutput {
  var out: FragOutput;
  out.albedo_roughness = vec4f(albedo, roughness);
  out.normal_metallic  = vec4f(normal * 0.5 + 0.5, metallic);
  return out;
}
```

This is how Crafty's G-buffer pass populates two separate textures in a single draw call sequence, rather than making two passes over the same geometry. Multiple render targets are only possible because the pipeline's `targets` array and the pass's `colorAttachments` array are matched by index.

### Fullscreen Passes

Many render passes — the lighting pass, SSAO, bloom, tone mapping — do not draw any scene geometry. Instead they draw a single large triangle that covers the entire viewport, running the fragment shader once for every pixel. A common pattern is:

```typescript
// No vertex or index buffers; the shader generates a fullscreen triangle from @builtin(vertex_index)
pass.draw(3); // Three vertices, one triangle
```

In the vertex shader:

```wgsl
@vertex
fn vs_main(@builtin(vertex_index) idx: u32) -> @builtin(position) vec4<f32> {
  // Generates a CCW triangle that covers the clip-space square [-1,1]²
  let uv = vec2f(f32((idx << 1u) & 2u), f32(idx & 2u));
  return vec4f(uv * 2.0 - 1.0, 0.0, 1.0);
}
```

These passes use `loadOp: 'clear'` on their output attachments (since they will write every pixel) and `loadOp: 'load'` on any G-buffer textures they sample as inputs — though those inputs are accessed as bound textures via `TEXTURE_BINDING` usage, not as attachments.

### Viewport and Scissor

By default the render pass covers the entire attachment. You can restrict drawing to a subregion with `setViewport()` and `setScissorRect()`:

```typescript
// Render into the top-left quarter of the attachment
pass.setViewport(0, 0, width / 2, height / 2, 0.0, 1.0);

// Clip all fragment output to this pixel rectangle (no border)
pass.setScissorRect(0, 0, width / 2, height / 2);
```

The viewport controls the NDC-to-pixel mapping (including depth range via the last two parameters, `minDepth` and `maxDepth`). The scissor rectangle clips the rasterizer's output: fragments outside the scissor are discarded before the depth test and fragment shader execute.

### Occlusion Queries

Render passes optionally accept an **occlusion query set**, allowing the CPU to ask "how many samples passed the depth test for this draw call?" You declare the query set on the pass descriptor and issue `beginOcclusionQuery()` / `endOcclusionQuery()` around the relevant draws. The results can drive CPU-side culling decisions for subsequent frames.

### Draw Calls

Inside a render pass, the typical draw sequence is:

```typescript
pass.setPipeline(pipeline);
pass.setBindGroup(0, cameraBindGroup);
pass.setBindGroup(1, modelBindGroup);
pass.setBindGroup(2, materialBindGroup);
pass.setVertexBuffer(0, vertexBuffer);
pass.setIndexBuffer(indexBuffer, 'uint32');
pass.drawIndexed(indexCount);
```

Crafty uses indexed drawing (via `drawIndexed`) for all triangle meshes. Non-indexed `draw()` is used for fullscreen triangle passes (lighting, post-processing).

## 3.11 Compute Passes

While render passes produce pixel output, **compute passes** run general-purpose GPU programs that operate on arbitrary data. A compute pass has no rasterizer, no attachments, and no fixed-function pipeline stages — just a compute shader dispatched over a grid of work items.

A compute pass is created with `encoder.beginComputePass()` and records one or more `dispatchWorkgroups()` calls against a bound compute pipeline:

```typescript
const pass = encoder.beginComputePass({ label: 'ParticleUpdate' });
pass.setPipeline(this._simulatePipeline);
pass.setBindGroup(0, this._particleBindGroup);
pass.dispatchWorkgroups(Math.ceil(particleCount / 64));
pass.end();
```

There are no draw calls, no vertex buffers, and no color attachments. The compute shader writes its results into storage buffers or storage textures declared in its bind groups.

### The Compute Shader Model

A compute shader runs as a three-dimensional grid of **workgroups**, each workgroup containing a fixed number of **invocations** (individual shader threads). The workgroup size is declared in WGSL with the `@workgroup_size` attribute:

```wgsl
@compute @workgroup_size(64, 1, 1)
fn cs_main(
  @builtin(global_invocation_id) gid: vec3<u32>,
  @builtin(local_invocation_id) lid: vec3<u32>,
  @builtin(workgroup_id) wid: vec3<u32>,
) {
  let index = gid.x; // global thread index across all workgroups
  if (index >= arrayLength(&particles)) { return; }
  // ... update particles[index] ...
}
```

Key built-in values:

| Built-in | Meaning |
| --- | --- |
| `global_invocation_id` | Absolute thread position across the entire dispatch grid (x, y, z) |
| `local_invocation_id` | Thread position within its own workgroup |
| `workgroup_id` | Which workgroup this thread belongs to |
| `local_invocation_index` | Flattened linear index within the workgroup |
| `num_workgroups` | Total number of workgroups dispatched |

The total number of threads equals `dispatchWorkgroups(Wx, Wy, Wz)` × `@workgroup_size(Sx, Sy, Sz)`. If your data has `N` elements and your workgroup size is 64, you dispatch `ceil(N / 64)` workgroups and guard against out-of-bounds access:

```wgsl
if (gid.x >= arrayLength(&particles)) { return; }
```

### Workgroup Memory

Threads within the same workgroup can communicate through **workgroup-shared memory**, declared with the `var<workgroup>` address space:

```wgsl
var<workgroup> shared_data: array<f32, 64>;

@compute @workgroup_size(64)
fn cs_main(@builtin(local_invocation_index) lid: u32) {
  // Phase 1: each thread writes to shared memory
  shared_data[lid] = load_something(lid);

  // Synchronize: all threads must reach this barrier before any proceed
  workgroupBarrier();

  // Phase 2: each thread reads the result of its neighbor
  let neighbor = shared_data[(lid + 1u) % 64u];
  // ...
}
```

`workgroupBarrier()` issues a memory and execution barrier: no thread in the workgroup proceeds past it until every thread has reached it. This is the mechanism for parallel reduction, prefix sums, histogram computation, and other patterns that require intra-workgroup communication.

Workgroup memory is fast (on-chip) but limited. The WebGPU spec guarantees at least 16 KB per workgroup; typical hardware provides 32–64 KB. Exceeding the limit is a pipeline creation error.

### Storage Buffers and Storage Textures

Compute shaders communicate with the rest of the frame through **storage buffers** and **storage textures** — the only resource types that compute shaders can write to.

A storage buffer is declared with `var<storage, read_write>` (or `read` for read-only access):

```wgsl
struct Particle {
  position: vec3<f32>,
  velocity: vec3<f32>,
  life:     f32,
}

@group(0) @binding(0) var<storage, read_write> particles: array<Particle>;
@group(0) @binding(1) var<uniform>              params:   ParticleParams;
```

A storage texture is declared with `var<storage_texture, write>` (currently, most platforms support write-only storage textures in compute; read-write storage textures require the `"chromium-experimental-read-write-storage-texture"` feature):

```wgsl
@group(0) @binding(0) var output_tex: texture_storage_2d<rgba8unorm, write>;

@compute @workgroup_size(8, 8)
fn cs_main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let value = compute_value(gid.xy);
  textureStore(output_tex, vec2i(gid.xy), vec4f(value, 0.0, 0.0, 1.0));
}
```

Storage textures use `textureStore()` rather than `textureSample()` — there is no sampler, filtering, or mip selection. For reading from a texture in a compute shader, you can bind it as a regular `texture_2d` with `textureLoad()` (which reads a specific texel without filtering):

```wgsl
@group(0) @binding(1) var input_tex: texture_2d<f32>;

let texel = textureLoad(input_tex, vec2i(coord), 0); // mip level 0
```

### Dispatching Work

`dispatchWorkgroups(x, y, z)` launches a 3D grid of workgroups. The `y` and `z` dimensions default to 1 if omitted:

```typescript
// 1D: particle simulation over N particles, 64 threads per workgroup
pass.dispatchWorkgroups(Math.ceil(particleCount / 64));

// 2D: image processing over a width × height texture
pass.dispatchWorkgroups(
  Math.ceil(width  / 8),
  Math.ceil(height / 8),
);

// 3D: volumetric operation over a 3D grid
pass.dispatchWorkgroups(
  Math.ceil(gridX / 4),
  Math.ceil(gridY / 4),
  Math.ceil(gridZ / 4),
);
```

For dynamic workload sizes determined by a previous compute pass (for example, the number of visible particles surviving a culling pass), use **indirect dispatch**:

```typescript
// The compute shader wrote the workgroup counts into an INDIRECT buffer
pass.dispatchWorkgroupsIndirect(indirectBuffer, byteOffset);
```

The buffer at `byteOffset` must contain three `uint32` values: `[workgroupCountX, workgroupCountY, workgroupCountZ]`.

### Compute Pipelines

A `GPUComputePipeline` is simpler than a render pipeline — it has no vertex layout, no fragment targets, no depth state, and no primitive topology. It consists of a pipeline layout (bind group layouts) and a single compute shader entry point:

```typescript
const computePipeline = device.createComputePipeline({
  label: 'ParticleSimulate',
  layout: device.createPipelineLayout({
    bindGroupLayouts: [particleBGL],
  }),
  compute: {
    module: shaderModule,
    entryPoint: 'cs_main',
  },
});
```

Like render pipelines, compute pipelines are immutable and expensive to create. They should be created once during initialization and cached.

The `@workgroup_size` declared in the WGSL shader becomes part of the compiled pipeline. If you need the same algorithm to run efficiently at multiple workgroup sizes (for hardware that prefers different tile widths), you need separate pipeline objects — or use WGSL `override` constants:

```wgsl
override WORKGROUP_SIZE: u32 = 64;

@compute @workgroup_size(WORKGROUP_SIZE)
fn cs_main(...) { ... }
```

```typescript
device.createComputePipeline({
  compute: {
    module: shaderModule,
    entryPoint: 'cs_main',
    constants: { WORKGROUP_SIZE: 128 },  // override at pipeline creation
  },
});
```

### Synchronization Between Passes

In WebGPU, resource synchronization between passes is managed by the API automatically. A storage buffer written by a compute pass is visible to the next render pass that reads it — there is no explicit barrier API call required from the application. The command encoder's ordering guarantees that:

- All commands in a compute pass complete before the next pass begins.
- A texture transitioned from `RENDER_ATTACHMENT` usage to `TEXTURE_BINDING` usage is automatically available to subsequent passes.

This is a significant simplification compared to Vulkan and D3D12, where explicit pipeline barriers and image layout transitions are the programmer's responsibility. WebGPU's driver inserts the necessary barriers during `queue.submit()`.

However, within a single compute pass, there are no implicit barriers between `dispatchWorkgroups()` calls. If two dispatches in the same pass access the same storage buffer — one writing and one reading — you must split them into separate compute passes:

```typescript
// WRONG: second dispatch may read before first dispatch finishes writing
const pass = encoder.beginComputePass();
pass.dispatchWorkgroups(...); // writes buffer A
pass.dispatchWorkgroups(...); // reads buffer A — undefined behavior
pass.end();

// CORRECT: separate passes ensure ordering
const passA = encoder.beginComputePass();
passA.dispatchWorkgroups(...);
passA.end();

const passB = encoder.beginComputePass();
passB.dispatchWorkgroups(...);
passB.end();
```

### Copy Operations

The command encoder also supports copy operations. For example, copying the results of a compute shader into a storage buffer for indirect draw:

```typescript
encoder.copyBufferToBuffer(source, 0, dest, 0, size);
```

Crafty uses compute-to-buffer copies in the particle system to copy the computed particle count into the indirect draw buffer.

## 3.13 The RenderContext Abstraction

The `RenderContext` class (`src/renderer/render_context.ts`) wraps the WebGPU device, queue, and canvas configuration into a single handle that flows through the entire render graph.

```typescript
export class RenderContext {
  readonly device: GPUDevice;
  readonly queue: GPUQueue;
  readonly context: GPUCanvasContext;
  readonly format: GPUTextureFormat;
  readonly canvas: HTMLCanvasElement;
  readonly hdr: boolean;
  readonly enableErrorHandling: boolean;
}
```

It provides:

- **Swap chain access** via `getCurrentTexture()`.
- **Buffer creation** via `createBuffer()`.
- **Data upload** via `writeBuffer()`.
- **Error scope management** via `pushInitErrorScope()` / `popInitErrorScope()` and per-frame/per-pass variants.

Every render pass receives the `RenderContext` during `execute()` and uses it to access the device, queue, and canvas dimensions. The `RenderGraph` owns the relationship between passes and the context:

```
Application (main.ts)
   │
   ▼
RenderGraph  ─── owns ───►  RenderPass[]
   │                            │
   │                            ▼
   │                      execute(encoder, ctx)
   │
   └──►  GPUCommandEncoder ──► queue.submit()
```

### Lifecycle

1. **Creation.** `RenderContext.create(canvas)` is called once during startup. It requests the adapter, creates the device, and configures the canvas.
2. **Frame loop.** Each frame, `RenderGraph.execute()` creates a command encoder, runs all passes, and submits.
3. **Resize.** On canvas resize, the canvas pixel dimensions are updated and the graph is re-created (passes that depend on canvas size, like the GBuffer, reallocate their textures).
4. **Destroy.** `RenderGraph.destroy()` calls `destroy()` on every pass, and the render context itself is discarded.

### 3.14 Summary

In this chapter we covered every major WebGPU resource type and saw how Crafty uses them:

| Resource | Crafty usage | Key files |
|----------|-------------|-----------|
| `GPUAdapter` / `GPUDevice` | Created once in `RenderContext.create()` | `render_context.ts` |
| `GPUBuffer` | Uniforms per-frame, vertex/index for meshes, storage for particles | `geometry_pass.ts`, `particle_pass.ts` |
| `GPUTexture` | GBuffer, HDR target, shadow maps, sky, cloud noise | `gbuffer.ts`, `lighting_pass.ts` |
| `GPUSampler` | Created per-pass for texture sampling | various passes |
| `GPUBindGroup` / `GPUBindGroupLayout` | Group 0=camera, 1=model, 2=material | `geometry_pass.ts` |
| `GPUShaderModule` | Loaded from `.wgsl` files via `?raw` import | `src/shaders/*.wgsl` |
| `GPURenderPipeline` | Cached per material shader ID | `geometry_pass.ts` |
| `GPUComputePipeline` | Particles, auto-exposure, SSGI | `particle_pass.ts`, `auto_exposure_pass.ts` |
| `GPUCommandEncoder` | One per frame, shared across all passes | `render_graph.ts` |
| `GPUQueue` | `writeBuffer()` for uniform uploads, `submit()` for command buffers | `render_context.ts` |

**Further reading:**
- `src/renderer/render_context.ts` — GPUDevice/GPUAdapter creation and management
- `src/renderer/passes/` — Per-pass buffer, texture, and pipeline creation
- `src/shaders/` — All WGSL shader modules
- `src/engine/camera.ts` — Camera uniforms and bind group layout

In the next chapter, we see how these pieces come together in Crafty's render graph architecture — the system that orchestrates all these resources into a complete frame.

----
[Contents](../crafty.md) | [02-Mathematics](02-mathematics.md) | [04-Rendering Architecture](04-rendering-architecture.md)
