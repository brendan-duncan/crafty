# Chapter 6: Lighting

[Contents](../crafty.md) | [05-Textures / Materials](05-textures-materials.md) | [07-Shadow Mapping](07-shadow-mapping.md)

Lighting is the heart of any renderer. Crafty implements a full physically-based shading pipeline supporting directional (sun), point, and spot lights, plus image-based lighting from environment maps.

## 6.1 Physically-Based Rendering Theory

Crafty uses the **Cook-Torrance** microfacet BRDF (bidirectional reflectance distribution function), which models a surface as a collection of microscopic facets. Every PBR shading calculation revolves around four vectors at the surface point — the surface normal, the directions to the light and the viewer, and the half-vector between them:

![BRDF vectors at a surface point](../illustrations/07-brdf-vectors.svg)

The BRDF has three terms, each evaluated from dot products of these vectors:

**Normal distribution function** (GGX/Trowbridge-Reitz) — describes the statistical orientation of microfacets relative to the surface normal:

```wgsl
// ── from the PBR lighting shader ──
fn D_GGX(n dot h: f32, roughness: f32) -> f32 {
  let a = roughness * roughness;
  let a2 = a * a;
  let denom = (n dot h * n dot h * (a2 - 1.0) + 1.0);
  return a2 / (PI * denom * denom);
}
```

**Geometry function** (Smith GGX with Schlick-GGX) — describes microfacet self-shadowing:

```wgsl
// ── from the PBR lighting shader ──
fn G_SmithGGX(n dot v: f32, n dot l: f32, roughness: f32) -> f32 {
  let a = roughness * roughness;
  let GGX = G_GGX(n dot v, a) * G_GGX(n dot l, a);
  return GGX;
}
```

**Fresnel function** (Schlick approximation) — describes how reflectance varies with viewing angle:

```wgsl
// ── from the PBR lighting shader ──
fn F_Schlick(cosTheta: f32, F0: vec3f) -> vec3f {
  return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}
```

The full BRDF for a single light is:

```wgsl
// ── from the PBR lighting shader ──
let NdotL = max(dot(N, L), 0.0);
let NdotV = max(dot(N, V), 0.0);
let H = normalize(L + V);
let NdotH = max(dot(N, H), 0.0);
let HdotV = max(dot(H, V), 0.0);

let D = D_GGX(NdotH, roughness);
let G = G_SmithGGX(NdotV, NdotL, roughness);
let F = F_Schlick(HdotV, F0);

let specular = (D * G * F) / (4.0 * NdotV * NdotL + 0.0001);
let diffuse = (1.0 - F) * (1.0 - metallic) * albedo / PI;
return (diffuse + specular) * radiance * NdotL;
```

The `metallic` parameter blends between dielectric behavior (specular highlights on a diffuse base) and metallic behavior (no diffuse, colored specular). `F0` is `0.04` for dielectrics and `albedo` for metals, interpolated by `metallic`:

```wgsl
// ── from the PBR lighting shader ──
let F0 = mix(vec3f(0.04), albedo, metallic);
```

## 6.2 The Directional Light (Sun)

Crafty supports three light types — directional, point, and spot — each with a distinct geometry and falloff model:

![Directional, point, and spot lights](../illustrations/07-light-types.svg)

The directional light represents the sun — an infinitely distant light source with parallel rays. It is defined by the `DirectionalLight` interface (`src/renderer/directional_light.ts`):

```typescript
// ── from src/renderer/directional_light.ts ──
export interface DirectionalLight {
  direction: Vec3;
  intensity: number;
  color: Vec3;
  castShadows: boolean;
  lightViewProj?: Mat4;
  shadowMap?: GPUTextureView;
}
```

The `direction` is a unit vector pointing toward the light (from the surface toward the sun). `intensity` controls the overall brightness, and `color` tints the light.

### Directional Light in the Lighting Pass

The deferred lighting pass evaluates the directional light in a fullscreen shader. The light direction and cascade data are uploaded per frame:

```typescript
// ── from lighting_pass.ts updateLight() ──
updateLight(
  ctx: RenderContext,
  light: DirectionalLight,
  cascadeData: CascadeData[],
  cascadeCount: number,
  shadowTexView: GPUTextureView | null,
  debugCascades: boolean,
  shadowSoftness: number,
): void {
  // Pack direction, intensity, color, cascade data into lightBuffer
  const data = this._lightScratch;
  data.set(light.direction.toArray(), 0);
  data[3] = light.intensity;
  data.set(light.color.toArray(), 4);
  data[7] = cascadeCount;
  // ... cascade view-proj matrices, split depths, texel sizes ...
  ctx.queue.writeBuffer(this.lightBuffer, 0, data.buffer as ArrayBuffer);
}
```

## 6.3 Point Lights

A point light emits light equally in all directions from a position in space. It is defined by the `PointLight` interface (`src/renderer/point_light.ts`):

```typescript
// ── from src/renderer/point_light.ts ──
export interface PointLight {
  position: Vec3;
  range: number;
  color: Vec3;
  intensity: number;
  castShadows?: boolean;
}
```

The `range` field limits the light's influence — the engine culls point lights outside this radius from the camera. The attenuation is physically-based (inverse square law) with a smooth falloff at the range boundary.

Point lights are processed in the `PointSpotLightPass`, which renders additive lighting for all active point and spot lights:

```typescript
// ── from point_spot_light_pass.ts updateLights() ──
interface PackedPointLight {
  position: [number, number, number, 0];     // vec4 (w unused)
  color: [number, number, number, number];   // rgb + intensity
  range: number;
}
```

Each point light's world position is tested against the camera frustum; lights outside the frustum are skipped. Up to `MAX_POINT_LIGHTS` (typically 128) can be active per frame.

### Shadow Mapping Point Lights

Point light shadows use **cube-map depth textures**. A single point light renders its scene to 6 faces of a cube map, then samples that cube map during lighting:

![Point light shadow: scene rendered to 6 cube faces](../illustrations/07-point-shadow-cube.svg)


```typescript
// ── from point_shadow_pass.ts ──
// Renders scene 6 times (once per cube face)
for (let face = 0; face < 6; face++) {
  const view = cubeFaceViewMatrix(light.position, face);
  const proj = perspective(90°_to_radians, 1.0, near, light.range);
  // ... render geometry from this view ...
}
```

In the lighting shader, the shadow is sampled by computing the vector from the light to the surface point and using it as the cube-map sampling direction:

```wgsl
// ── from the lighting shader ──
let shadowDir = surfacePos - light.position;
let shadowDepth = textureSample(shadowCube, sampler, shadowDir).r;
```

## 6.4 Spot Lights

A spot light emits light in a cone from a position in a specific direction. Crafty's `SpotLight` class (`src/renderer/spot_light.ts`) includes a lazy view-projection matrix computation:

```typescript
// ── from src/renderer/spot_light.ts ──
export class SpotLight {
  position: Vec3;
  range: number;
  direction: Vec3;
  innerAngle: number;  // Full brightness cone half-angle (degrees)
  color: Vec3;
  outerAngle: number;  // Falloff cone half-angle (degrees)
  intensity: number;
  castShadows?: boolean;

  // Lazily computed from position + direction + outerAngle + range
  get lightViewProj(): Mat4;
  computeLightViewProj(near?: number): Mat4;
  markDirty(): void;
}
```

The view-projection matrix is computed from the light's parameters:

```typescript
// ── from src/renderer/spot_light.ts ──
private _compute(near = 0.1): void {
  // Build a lookAt view from the light's position and direction
  const up = Math.abs(this.direction.y) > 0.99
    ? new Vec3(1, 0, 0)    // Avoid gimbal lock when pointing straight up/down
    : new Vec3(0, 1, 0);
  const view = Mat4.lookAt(this.position, this.position.add(this.direction), up);
  // Perspective projection matching the spot's cone angle
  const proj = Mat4.perspective(this.outerAngle * 2 * Math.PI / 180, 1.0, near, this.range);
  this._cachedLvp = proj.multiply(view);
  this._dirty = false;
}
```

A dirty flag avoids recomputation when the light's parameters haven't changed. Call `markDirty()` after mutating `position`, `direction`, `outerAngle`, or `range`.

### Spot Light Attenuation

The GPU evaluates spot light falloff using the inner and outer angles. A `smoothstep` between `cos(outer)` and `cos(inner)` gives a soft transition from the bright inner cone to the dark exterior:

![Spot light cone and smoothstep falloff](../illustrations/07-spot-light-cone.svg)


```wgsl
// ── from the spot light shader ──
// Spot cone attenuation
let cosAngle = dot(normalize(lightDirection), -toLightDir);
let cosInner = cos(spotLight.innerAngle * PI / 180);
let cosOuter = cos(spotLight.outerAngle * PI / 180);
let spotFactor = smoothstep(cosOuter, cosInner, cosAngle);
// Full point-light attenuation * spot cone factor
let attenuation = spotFactor / (distSq + 0.01);
```

## 6.5 Image-Based Lighting (IBL)

Image-based lighting uses an HDR environment map to illuminate surfaces with distant light. This provides ambient lighting that matches the sky and surrounding environment.

IBL requires three textures derived from the HDR sky cubemap — one for diffuse, one for specular at varying roughness, and a 2D table that captures the Fresnel integral:

![IBL: irradiance map, prefilter mip chain, BRDF LUT](../illustrations/07-ibl-textures.svg)


```typescript
// ── from src/assets/ibl.ts ──
interface IblTextures {
  irradianceMap: GPUTexture;      // Diffuse irradiance (low-frequency)
  prefilterMap: GPUTexture;       // Specular prefilter (mipmapped)
  brdfLut: GPUTexture;            // BRDF integration lookup table (2D)
}
```

**Irradiance map.** A heavily blurred version of the sky cubemap (lowest mip). Sampled by the surface normal to give diffuse ambient light:

```wgsl
// ── from the lighting shader ──
let irradiance = textureSample(irradianceMap, sampler, normal).rgb;
let diffuseIBL = irradiance * albedo;
```

**Prefilter map.** A mipmapped cubemap where each mip level represents a different roughness. Sampled by the reflection direction and roughness level:

```wgsl
// ── from the lighting shader ──
let roughnessLevel = roughness * MAX_PREFILTER_MIP_LEVEL;
let prefiltered = textureSampleLevel(prefilterMap, sampler, reflection, roughnessLevel);
```

**BRDF LUT.** A 2D lookup table encoding the Fresnel-integral term of the split-sum approximation. Sampled by `NdotV` and roughness:

```wgsl
// ── from the lighting shader ──
let brdf = textureSample(brdfLut, sampler, vec2f(NdotV, roughness)).rg;
let specularIBL = prefiltered * (F0 * brdf.r + brdf.g);
```

The complete IBL contribution is:

```wgsl
// ── from the lighting shader ──
let ibl = (1.0 - metallic) * diffuseIBL + specularIBL;
```

## 6.6 The BRDF

The Crafty BRDF implementation lives inside the lighting and forward shaders. The key functions are shared across shaders:

| Function | Description |
|----------|-------------|
| `D_GGX(n_dot_h, roughness)` | Normal distribution — controls highlight shape |
| `G_SmithGGX(n_dot_v, n_dot_l, roughness)` | Geometry masking/shadowing |
| `F_Schlick(cos_theta, F0)` | Fresnel reflectance |
| `tonemap(color)` | ACES filmic tone-mapping |
| `computeDirectLight(N, V, L, albedo, roughness, metallic, radiance)` | Full direct-light evaluation |

The `computeDirectLight` function composes the three terms and returns the final radiance for a single light.

## 6.7 The Deferred Lighting Pass

The `DeferredLightingPass` ([src/renderer/render_graph/passes/deferred_lighting_pass.ts](../../src/renderer/render_graph/passes/deferred_lighting_pass.ts)) is the core of the deferred renderer. It renders a fullscreen triangle that samples the G-buffer and all shadow/lighting inputs, producing an HDR result and exposing persistent camera + light uniform buffers as handles that downstream passes (composite, godrays) can sample:

```typescript
// ── from src/renderer/render_graph/passes/deferred_lighting_pass.ts ──
export class DeferredLightingPass extends Pass<DeferredLightingDeps, DeferredLightingOutputs> {
  readonly name = 'DeferredLightingPass';
  // Pipelines, BGLs, and samplers — created once in static create(ctx).
}

export interface DeferredLightingOutputs {
  hdr: ResourceHandle;          // direct lighting composited over input HDR
  cameraBuffer: ResourceHandle; // persistent uniform buffer handle
  lightBuffer: ResourceHandle;  // persistent uniform buffer handle
}
```

The fullscreen triangle approach avoids a vertex buffer — three vertices cover the entire clip space:

```wgsl
// ── from src/shaders/deferred_lighting.wgsl ──
@vertex
fn vs_main(@builtin(vertex_index) vi: u32) -> @builtin(position) vec4f {
  // Fullscreen triangle: covers NDC without a vertex buffer
  let uv = vec2f(f32((vi << 1) & 2), f32(vi & 2));
  return vec4f(uv * 2.0 - 1.0, 0.0, 1.0);
}
```

Each fragment samples the G-buffer, reconstructs the world position from depth, evaluates the directional light with cascade shadow maps, adds AO/SSGI, adds IBL, and writes the HDR result:

```typescript
// ── from the deferred lighting shader ──
// Lighting pass fragment shader (conceptual flow):
// 1. Sample G-buffer: albedo, normal, roughness, metallic, depth
// 2. Reconstruct world position from depth + inverse view-proj
// 3. Evaluate directional light (sun) with shadow cascade
// 4. Add ambient occlusion (from SSAO texture)
// 5. Add indirect light (from SSGI texture)
// 6. Add IBL diffuse + specular
// 7. Write HDR color
```

## 6.8 The Forward Lighting Path

Transparent objects cannot use deferred shading (the G-buffer stores only one surface per pixel). Crafty's `ForwardPass` evaluates the same PBR lighting model but in a forward rendering path.

The forward pass handles:

- **Directional light** with cascade shadow sampling (same as deferred).
- **Point lights** sampled in a loop over the active point light list.
- **Spot lights** with spotlight cone attenuation and shadow maps.
- **IBL** from the same irradiance / prefilter / BRDF textures.

The forward pass uses the same camera and light uniform buffers as the deferred passes, ensuring consistent lighting between opaque and transparent objects.

## 6.9 GPU-Based IBL Pre-Computation

The three IBL textures — irradiance map, GGX prefiltered environment map, and BRDF LUT — could be pre-computed offline and shipped as assets, but Crafty computes them at runtime on the GPU. This allows the IBL to adapt to the current sky (procedural or HDR) without managing additional texture assets per environment.

![IBL baking pipeline: equirectangular sky → compute shaders → irradiance cube + prefiltered cube + BRDF LUT](../illustrations/07-ibl-baking.svg)

### BRDF LUT (CPU)

The split-sum BRDF lookup table is view-independent (depends only on NdotV and roughness), so it is computed once on the CPU and cached per device. For each texel `(NdotV, roughness)`, the function importance-samples the GGX distribution using a Hammersley low-discrepancy sequence and integrates the Smith G₂ visibility term weighted by the Fresnel coefficient:

```typescript
// ── from src/assets/ibl.ts ──
function computeBrdfLutData(outW: number, outH: number, samples: number): Float32Array {
  for (let py = 0; py < outH; py++) {
    for (let px = 0; px < outW; px++) {
      const NdotV = (px + 0.5) / outW;
      const roughness = (py + 0.5) / outH;
      // Importance-sample GGX, accumulate scale (A) and bias (B)
      A += G_vis * (1 - Fc);
      B += G_vis * Fc;
    }
  }
}
```

The result is a 64×64 `rgba16float` texture (A in R, B in G). Because it depends only on the BRDF model and not on the environment, it is computed exactly once per `GPUDevice` and reused across IBL rebuilds.

### Irradiance Map (GPU Compute)

The diffuse irradiance map is a heavily blurred version of the HDR sky that stores the cosine-weighted hemisphere integral at every direction. The `cs_irradiance` compute shader (`src/shaders/ibl_baking.wgsl`) dispatches once per cube face (6 dispatches), each thread computing one output texel:

```wgsl
// ── from src/shaders/ibl_baking.wgsl ──
@compute @workgroup_size(8, 8, 1)
fn cs_irradiance(@builtin(global_invocation_id) id: vec3u) {
  let uv = (vec2f(id.xy) + 0.5) / f32(IRR_SIZE);
  let dir = cube_face_dir(u32(params.face), uv * 2.0 - 1.0);
  var irradiance = vec3f(0.0);
  for (var i = 0u; i < SAMPLES; i++) {
    let xi = hammersley(i, SAMPLES);
    let local_dir = cosine_sample_hemisphere(xi);
    let world_dir = tangent_frame(dir) * local_dir;
    irradiance += textureSampleLevel(sky_tex, sky_samp, equirect_uv(world_dir), 0).rgb;
  }
  textureStore(out_tex, id.xy, vec4f(irradiance / f32(SAMPLES) * params.exposure, 1.0));
}
```

Each output direction `dir` is the center of a cube face texel transformed to a unit vector. A tangent frame is built around that vector and 256 cosine-weighted hemisphere samples are taken from the equirectangular sky texture. The result is a 32×32 `rgba16float` cube map — low resolution since irradiance is very low-frequency.

### GGX Prefiltered Environment Map (GPU Compute)

The specular prefiltered cube follows the same pattern but uses importance sampling of the GGX distribution. Each mip level corresponds to a different roughness value (0, 0.25, 0.5, 0.75, 1.0), allowing the lighting shader to sample a mip level matching the surface roughness:

```wgsl
// ── from src/shaders/ibl_baking.wgsl ──
@compute @workgroup_size(8, 8, 1)
fn cs_prefilter(@builtin(global_invocation_id) id: vec3u) {
  let uv = (vec2f(id.xy) + 0.5) / f32(mipSize);
  let dir = cube_face_dir(u32(params.face), uv * 2.0 - 1.0);
  var color = vec3f(0.0); var weight = 0.0;
  for (var i = 0u; i < SAMPLES; i++) {
    let xi = hammersley(i, SAMPLES);
    let h  = ggx_importance_sample(xi, params.roughness);
    let l  = reflect(-dir, h);
    let ndotl = max(dot(dir, l), 0.0);
    if (ndotl > 0.0) {
      color += textureSampleLevel(sky_tex, sky_samp, equirect_uv(l), 0).rgb * ndotl;
      weight += ndotl;
    }
  }
  textureStore(out_tex, id.xy, vec4f(color / weight * params.exposure, 1.0));
}
```

The dispatch is 6 faces × 5 roughness levels = 30 workgroups, each sampling 256 GGX-importance-weighted directions per texel. The base mip is 128×128 per face, halving at each roughness level down to 8×8 at roughness 1.0.

These compute dispatches run once when the sky changes (e.g., on world load or a new HDR map), and the results persist until the next rebuild. The `computeIblGpu()` function in `src/assets/ibl.ts` orchestrates the entire pipeline and awaits `onSubmittedWorkDone()` before returning the ready-to-use textures.

## 6.10 Screen-Space Ambient Occlusion (SSAO)

SSAO estimates ambient light occlusion by sampling the depth buffer around each pixel and counting how many samples fall *inside* nearby geometry. The `SSAOPass` ([src/renderer/render_graph/passes/ssao_pass.ts](../../src/renderer/render_graph/passes/ssao_pass.ts)) implements **classic Crytek-style view-space hemisphere SSAO** — the technique introduced in *Crysis 2*. It's not HBAO or GTAO: there's no horizon traversal, no analytical occlusion integral, and no temporal accumulation. Just a per-pixel hemisphere of samples, an in/out test, and a bilateral cleanup blur.

![SSAO: hemisphere of samples around the surface](../illustrations/12-ssao-hemisphere.svg)

The pass runs at **half resolution** to keep the per-pixel cost manageable — the AO factor varies smoothly enough that the blur recovers most of the detail loss.

### Per-Frame Setup: Kernel and Noise

Two static inputs are built once at pass creation and uploaded as uniforms:

**1. The hemisphere kernel** — 16 random points in the unit upper hemisphere (`z >= 0`):

```typescript
// ── from src/renderer/render_graph/passes/ssao_pass.ts ──
function generateKernel(): Float32Array {
  const k = new Float32Array(KERNEL_SIZE * 4);
  for (let i = 0; i < KERNEL_SIZE; i++) {
    const cosT = Math.random();
    const phi = Math.random() * Math.PI * 2;
    const sinT = Math.sqrt(1 - cosT * cosT);
    const scale = 0.1 + 0.9 * (i / KERNEL_SIZE) ** 2;
    k[i * 4 + 0] = sinT * Math.cos(phi) * scale;
    k[i * 4 + 1] = sinT * Math.sin(phi) * scale;
    k[i * 4 + 2] = cosT * scale;
    k[i * 4 + 3] = 0;
  }
  return k;
}
```

Each sample is roughly cosine-weighted (`cosT = U(0, 1)` so points cluster near the pole), then radially scaled by `0.1 + 0.9 * (i/N)²` so most samples sit close to the origin, where they contribute most to AO. Far samples still exist for crevice detection but they're a minority of the kernel.

**2. The rotation noise** — a 4×4 `rgba8unorm` texture of random 2D unit vectors `(cos θ, sin θ)` encoded as `0.5 + 0.5 * v`. The shader tiles this across the screen via `uv % 4` and uses the decoded vector to rotate the kernel per pixel. Without per-pixel rotation, every pixel would sample the same 16 directions and the result would show visible kernel banding; the 4×4 dither breaks that up at the cost of high-frequency noise the blur then smooths out.

### The AO Pass

For each half-resolution pixel ([src/shaders/ssao.wgsl](../../src/shaders/ssao.wgsl), `fs_ssao`):

**1. Reconstruct view-space position and normal.** Read the GBuffer depth and world-space normal at the matching full-res texel, transform the normal into view space, and reconstruct view-space `P` from depth via the inverse projection.

**2. Build a per-pixel TBN frame.** Use Gram-Schmidt to construct an orthonormal basis from the tiled noise vector and the surface normal:

```wgsl
// ── from src/shaders/ssao.wgsl ──
let noise_coord = vec2<u32>(half_coord) % vec2<u32>(4u);
let rnd         = textureLoad(noise_tex, noise_coord, 0).rg * 2.0 - 1.0;

let rand_vec = vec3<f32>(rnd, 0.0);
let T = normalize(rand_vec - N * dot(rand_vec, N));
let B = cross(N, T);
let tbn = mat3x3<f32>(T, B, N);  // tangent space → view space
```

This re-orients the hemisphere kernel so its `+z` axis aligns with the surface normal — every kernel sample is now guaranteed to be on the visible side of the surface.

**3. Test 16 samples.** For each kernel sample, transform it into view space, project it back to screen UV, read the depth there, and reconstruct that point's view-space Z:

```wgsl
// ── from src/shaders/ssao.wgsl ──
for (var i = 0; i < KERNEL_SIZE; i++) {
  // View-space sample: kernel.z aligns with N (hemisphere above surface)
  let sample_vs = P + (tbn * ssao.kernel[i].xyz) * ssao.radius;

  // Project sample to screen UV, sample depth there
  let clip       = ssao.proj * vec4<f32>(sample_vs, 1.0);
  let ndc_xy     = clip.xy / clip.w;
  let sample_uv  = vec2<f32>(ndc_xy.x * 0.5 + 0.5, -ndc_xy.y * 0.5 + 0.5);
  let ref_depth  = textureLoad(depth_tex, /* ... */, 0);
  let ref_z      = view_pos(sample_uv, ref_depth).z;

  // Range falloff: ignore hits on geometry far from this surface
  let range_check = 1.0 - smoothstep(0.0, ssao.radius, abs(P.z - ref_z));

  // Occluded when the real surface is closer to the camera than the sample
  occlusion += select(0.0, 1.0, ref_z > sample_vs.z + ssao.bias) * range_check;
}

let ao = clamp(1.0 - (occlusion / f32(KERNEL_SIZE)) * ssao.strength, 0.0, 1.0);
```

Two details worth calling out:

- **Slope-invariant bias.** The occlusion test compares `ref_z > sample_vs.z + bias`, not `ref_z > P.z + bias`. Comparing against `sample_vs.z` makes the bias work the same on flat and steep surfaces — since the kernel sample already sits "above" the surface in tangent space, same-surface pixels always satisfy `ref_z < sample_vs.z` regardless of tilt. Comparing against `P.z` would need a tilt-dependent bias to avoid self-occlusion on steep faces.
- **Inverted-smoothstep range check.** Many SSAO implementations use `1 / (1 + d/r)` for the range falloff, but that form has a spike near `d = 0` that produces small bursts of self-occlusion on flat surfaces. `1 - smoothstep(0, radius, |ΔZ|)` is monotonic and falls smoothly to zero at the radius boundary.

The final AO factor is written to a half-res `r8unorm` target.

### Bilateral Blur

The raw output is noisy (16 samples × per-pixel rotation = high-frequency dither). The blur pass ([src/shaders/ssao_blur.wgsl](../../src/shaders/ssao_blur.wgsl)) supports two quality modes selectable at construction time:

**Quality (default)** — two-pass separable bilateral Gaussian:

```wgsl
// ── from src/shaders/ssao_blur.wgsl ──
const GAUSS: array<f32, 4> = array<f32, 4>(
  0.19638062, 0.17469900, 0.12161760, 0.06706740,
);

fn blur(uv: vec2<f32>, step: vec2<f32>) -> vec4<f32> {
  let depth0 = depth_load(uv);
  var accum  = 0.0;
  var weight = 0.0;
  for (var i: i32 = -3; i <= 3; i++) {
    let uv_off  = uv + step * f32(i);
    let depth_s = depth_load(uv_off);
    let ao_s    = textureSampleLevel(ao_tex, samp, uv_off, 0.0).r;
    let d_wt    = exp(-abs(depth_s - depth0) * 1000.0);
    let w       = GAUSS[abs(i)] * d_wt;
    accum  += w * ao_s;
    weight += w;
  }
  return vec4<f32>(accum / max(weight, 1e-5), 0.0, 0.0, 1.0);
}
```

Two passes (horizontal then vertical), 7 taps each, with the spatial Gaussian (`GAUSS[]`) multiplied by a depth-aware term `exp(-|Δdepth| * 1000)`. The depth term collapses to zero across silhouettes, so AO from a near surface doesn't bleed onto a distant one — a classic bilateral edge stop.

**Performance** — a single-pass unweighted 4×4 box average. Cheaper but ignores depth, so it can mush AO across edges.

### Pipeline Position

`SSAOPass.addToGraph(graph, { normal, depth })` takes the two G-buffer handles already produced by the geometry passes and returns a half-res `r8unorm` AO handle:

```typescript
// ── from crafty/renderer_setup.ts ──
const ssao = ssaoPass.addToGraph(graph, { normal: gbuf.normal, depth: gbuf.depth });
// ... later, the lighting pass consumes the AO:
const lit = lightingPass.addToGraph(graph, { gbuffer: gbuf, ao: ssao.ao, /* ... */ });
```

Downstream, two passes read the AO:

- **`DeferredLightingPass`** multiplies the ambient (IBL diffuse + indirect) term by AO. Direct lighting is *not* scaled by AO — direct shadowing is the shadow map's job, and applying AO on top would darken contact regions twice.
- **`CompositePass`** uses AO when blending depth fog, so deep crevices remain visibly darker through the fog.

Both intermediate (raw) and final (blurred) AO targets are transient per-frame resources; only the kernel uniform buffer and the noise texture persist on the pass instance.

## 6.11 Screen-Space Global Illumination (SSGI)

Screen-space global illumination approximates one-bounce indirect light from the scene itself rather than from a pre-computed environment map. The `SSGIPass` ([src/renderer/render_graph/passes/ssgi_pass.ts](../../src/renderer/render_graph/passes/ssgi_pass.ts)) casts stochastic rays in screen space against the previous frame's lit radiance, then accumulates the result temporally using a reprojected history:

![SSGI pipeline: ray march → temporal accumulation → copy to history](../illustrations/07-ssgi-pipeline.svg)

### Ray March Pass

For each visible pixel, the shader reconstructs the world-space normal and view-space position from the G-buffer, then casts several rays in a cosine-weighted hemisphere oriented around the surface normal. Each ray steps through view space; at each step the current position is projected back to screen space and compared against the stored depth buffer:

![SSGI ray sampling in screen space](../illustrations/07-ssgi-sampling.svg)

```wgsl
// ── from src/shaders/ssgi.wgsl ──
let vp = view_pos_at(in.uv, depth);
let N_vs = normalize((u.view * vec4<f32>(N_world, 0.0)).xyz);

for (var i = 0u; i < u.numRays; i++) {
  let phi = 6.28318530 * fract(f32(i) / f32(u.numRays) + f32(u.frameIndex) * 0.618033988);
  let ur = fract(f32(u.frameIndex * u.numRays + i) * 0.381966011);
  let cos_theta = sqrt(ur);
  let sin_theta = sqrt(max(0.0, 1.0 - cos_theta * cos_theta));
  let ray_local = vec3<f32>(sin_theta * cos(phi), sin_theta * sin(phi), cos_theta);

  for (var s = 0u; s < u.numSteps; s++) {
    let t = (f32(s) + 1.0) / f32(u.numSteps);
    let p = vp + ray_vs * (u.radius * t);
    // Project to screen UV, compare with stored depth
    let clip = u.proj * vec4<f32>(p, 1.0);
    let inv_w = 1.0 / clip.w;
    let ray_uv = vec2<f32>(clip.x * inv_w * 0.5 + 0.5, -clip.y * inv_w * 0.5 + 0.5);
    // ... read depth at ray_uv, test if ray passed behind surface ...
    if (p.z < stored_z && stored_z - p.z < u.thickness) {
      accum += textureSampleLevel(prev_radiance, lin_samp, ray_uv, 0.0).rgb;
      break;
    }
  }
}
```

Key details of the ray march:

**Cosine-weighted distribution.** Rays are distributed according to a cosine-weighted hemisphere, which matches the Lambertian diffuse BRDF — directions near the surface normal contribute more energy, while grazing-angle directions contribute less. The weighting is embedded in the ray distribution itself so every hit contributes equally and no explicit weight factor is needed.

**Golden-ratio temporal jitter.** The azimuth angle `phi` is offset each frame by the golden ratio `φ ≈ 0.618` of a full turn. Over successive frames the ray pattern fills the hemisphere without ever repeating the same direction, so that temporal accumulation converges to a dense sampling pattern:

```text
Frame 0: phi = 2π × fract(0 + 0 × 0.618)
Frame 1: phi = 2π × fract(0 + 1 × 0.618)
Frame 2: phi = 2π × fract(0 + 2 × 0.618)  →  ~124° rotation each frame
```

**Tangent frame rotation.** A 4×4 random noise texture provides a per-pixel rotation angle for the tangent frame, decorrelating rays between adjacent pixels. Without this, nearby pixels would cast rays in nearly identical directions, producing visible banding in the raw output:

```wgsl
// ── from src/shaders/ssgi.wgsl ──
let noise_val = textureLoad(noise_tex, coord % 4, 0).rg;
let cos_a = noise_val.x * 2.0 - 1.0;
let sin_a = noise_val.y * 2.0 - 1.0;
let T = cos_a * T_raw - sin_a * B_raw;
let B = sin_a * T_raw + cos_a * B_raw;
```

**Hit test.** An intersection is recorded when the ray's view-space Z has stepped past the stored depth at the projected screen position and the distance behind the surface is within the `thickness` threshold (default 0.5 view-space units). The thickness parameter prevents rays from self-intersecting on thin geometry such as leaves or wires.

### Temporal Accumulation Pass

The raw SSGI output from a single frame is extremely noisy — only 4 rays per pixel. The temporal pass accumulates samples over many frames by reprojecting each pixel's SSGI into the previous frame and blending:

```wgsl
// ── from src/shaders/ssgi_temporal.wgsl ──
// Reproject to previous frame
let world_pos = reconstructWorld(in.uv, depth);
let prev_clip = u.prevViewProj * vec4<f32>(world_pos, 1.0);
let prev_uv = vec2<f32>(
  prev_clip.x / prev_clip.w * 0.5 + 0.5,
  -prev_clip.y / prev_clip.w * 0.5 + 0.5,
);

// AABB clamp: 3×3 neighbourhood of raw SSGI
var nb_min = vec3<f32>(1e9);
var nb_max = vec3<f32>(-1e9);
for (var dy = -1; dy <= 1; dy++) {
  for (var dx = -1; dx <= 1; dx++) {
    let s = textureLoad(raw_ssgi, clamp(coord + vec2<i32>(dx, dy), ...), 0).rgb;
    nb_min = min(nb_min, s);
    nb_max = max(nb_max, s);
  }
}
let history_clamped = clamp(history, nb_min, nb_max);
let result = mix(history_clamped, current, 0.1);
```

**Reprojection.** Each pixel is converted from screen-space UV and depth back to world position using the inverse view-projection matrix, then transformed into the previous frame's clip space using the stored `prevViewProj` matrix. If the previous UV falls outside the screen boundaries (disocclusion), the pixel trusts only the current frame.

**Neighbourhood clamping.** The raw SSGI has high variance — a few bright rays can cause temporal ghosting when the camera moves. A 3×3 neighbourhood AABB around the current pixel's raw SSGI clamps the history sample to prevent stale bright values from persisting after a geometry change.

**Blend factor.** The 10% blend (`mix(history_clamped, current, 0.1)`) means each frame contributes one tenth of the new raw estimate. With 4 rays per frame, the effective sample count after `N` frames is `4 × (1 − 0.9^N) / 0.1`, reaching ~36 effective rays after 20 frames and ~40 rays at convergence.

### Pass Wiring in the Render Graph

`SSGIPass.addToGraph()` declares **three** sub-passes in the graph for one logical SSGI step. The first two are render passes; the third is a `'transfer'` pass that copies the resolved frame into a persistent history texture for the next frame to read:

```typescript
// ── from src/renderer/render_graph/passes/ssgi_pass.ts ──
addToGraph(graph: RenderGraph, deps: SSGIDeps): SSGIOutputs {
  const { ctx } = graph;
  const fullDesc: TextureDesc = { format: HDR_FORMAT, width: ctx.width, height: ctx.height };

  const history = graph.importPersistentTexture(SSGI_HISTORY_KEY, {
    ...fullDesc, label: 'SSGIHistory',
  });

  let raw!: ResourceHandle;
  let result!: ResourceHandle;

  // 1. Ray march → raw
  graph.addPass('SSGIPass.rayMarch', 'render', (b) => {
    raw = b.createTexture({ label: 'SSGIRaw', ...fullDesc });
    raw = b.write(raw, 'attachment', { loadOp: 'clear', /* ... */ });
    b.read(deps.depth,        'sampled');
    b.read(deps.normal,       'sampled');
    b.read(deps.prevRadiance, 'sampled');   // ← TAA history, see below
    b.setExecute(/* ... draws fullscreen triangle with ssgi.wgsl ... */);
  });

  // 2. Temporal accumulate (raw + history → result)
  graph.addPass('SSGIPass.temporal', 'render', (b) => {
    result = b.createTexture({
      label: 'SSGIResult', ...fullDesc,
      extraUsage: GPUTextureUsage.RENDER_ATTACHMENT
                | GPUTextureUsage.TEXTURE_BINDING
                | GPUTextureUsage.COPY_SRC,
    });
    result = b.write(result, 'attachment', { loadOp: 'clear', /* ... */ });
    b.read(raw,       'sampled');
    b.read(history,   'sampled');
    b.read(deps.depth, 'sampled');
    b.setExecute(/* ... draws fullscreen triangle with ssgi_temporal.wgsl ... */);
  });

  // 3. Copy result → history for next frame
  graph.addPass('SSGIPass.copyHistory', 'transfer', (b) => {
    b.read(result,   'copy-src');
    b.write(history, 'copy-dst');
    b.setExecute((pctx, res) => {
      pctx.commandEncoder.copyTextureToTexture(
        { texture: res.getTexture(result) },
        { texture: res.getTexture(history) },
        { width: ctx.width, height: ctx.height },
      );
    });
  });

  return { result };
}
```

A handful of details from this layout are worth pulling out:

- **The history texture is persistent.** `graph.importPersistentTexture(SSGI_HISTORY_KEY, ...)` (with the key `'ssgi:history'`) returns a handle backed by a single physical `GPUTexture` in the `PhysicalResourceCache`. The same physical texture is bound across frames, so what the copy pass writes today is what the temporal pass reads tomorrow. See [§3.3 Persistent and External Resources](03-rendering-architecture.md#persistent-and-external-resources).
- **The copy participates in the dependency graph.** `copyHistory` is `type: 'transfer'`, declares `result` as `'copy-src'` and `history` as `'copy-dst'`, and its execute callback issues a `copyTextureToTexture`. Because the write bumps the persistent history's version, compile-time culling treats this pass as a sink — even though nothing else in the current frame reads the new history version, the copy is never dropped.
- **Raw and result are transient.** The raw ray-march output and the accumulated result are both created via `b.createTexture()` and live for the frame only. The pool keeps them across frames keyed by descriptor, so the actual `GPUTexture` allocations happen once and are reused — no per-frame churn.

### Pipeline Position

`updateCamera()` uploads the per-frame uniforms — current matrices, plus the *previous* frame's view-projection for reprojection and the rolling frame counter that drives the golden-ratio jitter:

```typescript
// ── from src/renderer/render_graph/passes/ssgi_pass.ts ──
updateCamera(ctx: RenderContext): void {
  const camera = ctx.activeCamera;
  // ...
  data.set(camera.viewMatrix().data, 0);
  data.set(camera.projectionMatrix().data, 16);
  data.set(camera.inverseProjectionMatrix().data, 32);
  data.set(camera.inverseViewProjectionMatrix().data, 48);
  data.set(camera.previousViewProjectionMatrix().data, 64);  // ← from Camera
  // ... settings, frame counter ...
  u32[88] = this._frameIndex++;
  ctx.queue.writeBuffer(this._uniformBuffer, 0, data.buffer as ArrayBuffer);
}
```

`camera.previousViewProjectionMatrix()` is snapshotted at the top of `Camera.updateRender()` each frame and falls back to the current VP on the first frame (so the very first reproject sees zero motion rather than a singularity). See [§11.3 Camera.jitteredViewProj and Camera.prevViewProj](11-post-processing.md#camerajitteredviewproj-and-cameraprevviewproj) for the full story.

The host wires `updateCamera()` conditionally on the `ssgi` setting, then adds the pass to the graph. The interesting line is the `prevRadiance` argument:

```typescript
// ── from crafty/renderer_setup.ts ──
// 6. SSGI uses last frame's TAA history as previous-radiance source.
// The TAA pass owns the persistent key; we import it here so SSGI reads
// the v=0 (previous frame's) contents before TAA bumps it later this frame.
let ssgi: ResourceHandle | undefined;
if (effects.ssgi) {
  const taaHistory = graph.importPersistentTexture('taa:history', {
    label: 'TAAHistory', format: 'rgba16float',
    width: ctxArg.width, height: ctxArg.height,
  });
  ssgi = ssgiPass.addToGraph(graph, {
    prevRadiance: taaHistory,
    normal: gbuf.normal,
    depth: gbuf.depth,
  }).result;
}
```

This is the trick that makes SSGI work cheaply in Crafty:

- **The bounce source is the TAA history texture, not a separate buffer.** SSGI needs a "what color was the scene at this screen position last frame?" image to read from. TAA already maintains exactly that — a temporally-accumulated, anti-aliased copy of the final HDR — and keeps it in the `'taa:history'` persistent slot. SSGI just borrows it. No extra texture, no extra copy.
- **Read-old / write-new ordering is enforced by handle versions.** Earlier in §3 we saw that each write to a virtual resource bumps its version. When the SSGI sub-graph imports `'taa:history'`, it observes the texture at version 0 — the previous frame's contents. The TAA pass later in the same frame bumps that version (via its own `copyHistory`). The graph compiler validates the order: SSGI's read of v0 must come before TAA's write of v1. Get the order wrong and the build fails rather than silently reading this-frame data and producing a feedback loop.

The host frame loop also threads the `updateCamera` calls in the order their consumers need them:

```typescript
// ── from crafty/main.ts ──
passes.ssaoPass!.updateCamera(ctx);
passes.ssaoPass!.updateParams(ctx, 1.0, 0.005, effects.ssao ? 2.0 : 0.0);
passes.ssgiPass!.updateSettings({ strength: effects.ssgi ? 1.0 : 0.0 });
if (effects.ssgi) {
  passes.ssgiPass!.updateCamera(ctx);
}
```

Disabling SSGI at runtime is two things together: setting `strength = 0` (so the shader output is multiplied to zero even if it runs) and *not* adding the pass to the graph. Skipping `addToGraph` is what actually keeps the ray-march cost off the GPU; setting strength to zero is the belt-and-braces path used by samples that don't conditionally rebuild the graph.

Downstream, the `DeferredLightingPass` consumes the resolved SSGI as the indirect-diffuse contribution to the ambient term:

```typescript
// ── from crafty/renderer_setup.ts ──
const lit = lightingPass.addToGraph(graph, {
  gbuffer: gbuf,
  shadowMap,
  ao: ssao.ao,
  hdr: skyHdr,
  cloudShadow,
  ssgi,                  // ← SSGI result
  iblTextures: frame.iblTextures,
});
```

When `ssgi` is `undefined` (the effect is disabled or the pass wasn't added), the lighting pass falls back to its IBL-only ambient term. When present, the SSGI radiance is added on top of the IBL diffuse, scaled by AO so contact crevices stay dark.

### SSGI Settings

| Parameter | Default | Description |
|-----------|---------|-------------|
| `numRays` | 4 | Stochastic rays per pixel per frame |
| `numSteps` | 16 | March steps along each ray |
| `radius` | 3.0 | Maximum march distance (view-space units) |
| `thickness` | 0.5 | Hit acceptance depth tolerance |
| `strength` | 1.0 | Output intensity multiplier |

These are exposed through the `SSGISettings` interface and can be adjusted at runtime via `SSGIPass.updateSettings()`.

## 6.12 Summary

Lighting is a composition of several systems:

| System | Pass | Purpose |
|--------|------|---------|
| Directional (sun) | `DeferredLightingPass` | Main light, CSM shadows |
| Point lights | `PointSpotLightPass` | Additive deferred, cube shadow maps |
| Spot lights | `PointSpotLightPass` | Additive deferred, 2D shadow maps |
| IBL | `DeferredLightingPass` | Environment-based ambient + specular |
| SSAO | `SSAOPass` | Local ambient occlusion from depth buffer |
| SSGI | `SSGIPass` | One-bounce indirect light via screen-space ray marching |
| Forward transparency | `ForwardPass` | PBR for transparent surfaces |

All paths share the same PBR BRDF functions, ensuring consistent appearance regardless of rendering path.

**Further reading:**
- `src/shaders/deferred_lighting.wgsl` — Deferred lighting shader (full PBR evaluation)
- `src/shaders/forward_pbr.wgsl` — Forward PBR shader
- `src/shaders/ibl_baking.wgsl` — IBL sampling functions and baking compute shaders
- `src/assets/ibl.ts` — GPU-based IBL pre-computation pipeline
- `src/renderer/render_graph/passes/deferred_lighting_pass.ts` — Deferred lighting pass
- `src/renderer/render_graph/passes/forward_pass.ts` — Forward lighting pass
- `src/renderer/render_graph/passes/point_spot_light_pass.ts` — Additive point/spot pass
- `src/renderer/render_graph/passes/ssao_pass.ts` — Screen-space ambient occlusion
- `src/renderer/render_graph/passes/ssgi_pass.ts` — Screen-space global illumination
- `src/shaders/ssgi.wgsl` — SSGI ray march shader
- `src/shaders/ssgi_temporal.wgsl` — SSGI temporal accumulation shader

----
[Contents](../crafty.md) | [05-Textures / Materials](05-textures-materials.md) | [07-Shadow Mapping](07-shadow-mapping.md)
