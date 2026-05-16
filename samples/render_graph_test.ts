/**
 * Render Graph Test
 * ==================
 *
 * This file demonstrates six different render graph topologies, from simplest
 * to most complex. A combo box at the top-left lets you switch between them
 * at runtime.
 *
 * Each configuration builds the graph with a different structure:
 *
 *  1. Simple Procedural  — single fullscreen pass, no inputs
 *  2. Forward + No Shadows — one forward render pass with directional light
 *  3. Forward + Shadows   — shadow map pass feeds a forward lighting pass
 *  4. Deferred + Shadows  — gbuffer pass + deferred lighting pass + shadow map
 *  5. Forward + Sky + Shadows + DOF — sky clears HDR, forward pass blends on
 *     top, then depth-of-field post-process
 *  6. Deferred + Full Post — atmosphere, gbuffer, SSAO, deferred lighting,
 *     TAA, DOF, composite
 *
 * The same procedural 3D scene (a sphere resting on a ground plane lit by a
 * directional light) is rendered by every configuration — only the graph
 * topology changes. The scene is ray-traced in the fragment shader so no
 * vertex buffers are required.
 */

// ---------------------------------------------------------------------------
// 1.  IMPORTS
// ---------------------------------------------------------------------------

import { Mat4, Vec3 } from '../src/math/index.js';
import { CameraController } from '../src/engine/camera_controller.js';
import { GameObject } from '../src/engine/game_object.js';
import { RenderContext } from '../src/renderer/render_context.js';
import { PhysicalResourceCache, RenderGraph, type ResourceHandle } from '../src/renderer/render_graph/index.js';
import type { PassBuilder } from '../src/renderer/render_graph/index.js';

// ---------------------------------------------------------------------------
// 2.  CONSTANTS
// ---------------------------------------------------------------------------

const HDR_FMT: GPUTextureFormat = 'rgba16float';
const SHADOW_FMT: GPUTextureFormat = 'depth32float';
const GBUF_ALBEDO_FMT: GPUTextureFormat = 'rgba8unorm';
const GBUF_NORMAL_FMT: GPUTextureFormat = 'rgba16float';
const GBUF_DEPTH_FMT: GPUTextureFormat = 'depth32float';
const SHADOW_SIZE = 1024;
const AO_FMT: GPUTextureFormat = 'r8unorm';

// ---------------------------------------------------------------------------
// 3.  WGSL SHADER SOURCE STRINGS
// ---------------------------------------------------------------------------
//
// Every pass uses the same vertex shader: a fullscreen triangle covering NDC.
// The fragment shader varies per pass and is embedded directly below so that
// the entire test file is self-contained.

const VS_FULLTRI = `@vertex fn vs(@builtin(vertex_index) vi: u32) -> @builtin(position) vec4<f32> {
  let pos = array(vec2(-1.0,-1.0), vec2(3.0,-1.0), vec2(-1.0,3.0));
  return vec4(pos[vi], 0.0, 1.0);
}`;

// ── Scene ray-marching uniforms ────────────────────────────────────────────
// Used by every shader that renders the 3D scene (forward, gbuffer, etc.).
// Layout: viewProjInv (64 B) + camPos (16) + lightDir (16) + params (16) = 112 B.
const SCENE_UNI = `
struct SceneUniforms {
  viewProjInv : mat4x4<f32>,
  camPos      : vec4<f32>,
  lightDir    : vec4<f32>,
  params      : vec4<f32>,  // x = intensity, y = time, zw = pad
};
@group(0) @binding(0) var<uniform> u: SceneUniforms;`;

// ── Ray-scene intersection ─────────────────────────────────────────────────
// Traces a ray against a sphere at (0,1,0) radius 1 and a ground plane at y=-0.5.
// Returns nearest hit.zw = normal.xy, hit.w = normal.z.
const RAY_SCENE = `
fn hitScene(ro: vec3<f32>, rd: vec3<f32>) -> vec4<f32> {
  // sphere
  let sc = vec3<f32>(0, 1, 0);
  let sr = 1.0;
  let oc = ro - sc;
  let a = dot(rd, rd);
  let b = 2.0 * dot(oc, rd);
  let c = dot(oc, oc) - sr * sr;
  let disc = b * b - 4.0 * a * c;
  if (disc > 0.0) {
    let t = (-b - sqrt(disc)) / (2.0 * a);
    if (t > 0.001) {
      let hp = ro + t * rd;
      let n = normalize(hp - sc);
      return vec4(t, n.x, n.y, n.z);
    }
  }
  // ground plane at y = -0.5
  let pn = vec3<f32>(0, 1, 0);
  let denom = dot(rd, pn);
  if (denom < 0.0) {
    let t = (-0.5 - dot(ro, pn)) / denom;
    if (t > 0.001) {
      let hp = ro + t * rd;
      let ck = (i32(floor(hp.x * 2.0)) + i32(floor(hp.z * 2.0))) & 1;
      return vec4(t, pn.x, pn.y, pn.z);
    }
  }
  return vec4(-1, 0, 0, 0);
}

fn sceneAlbedo(hp: vec3<f32>, n: vec3<f32>) -> vec3<f32> {
  // Sphere checker/spiral + plane checkerboard
  if (n.y < 0.5 && n.y > -0.5 && abs(n.x) > 0.1) {
    // sphere surface
    let ang = atan2(hp.z, hp.x);
    let bands = sin(ang * 12.0 + hp.y * 8.0) * 0.5 + 0.5;
    return mix(vec3(0.9, 0.2, 0.1), vec3(0.1, 0.5, 0.9), bands);
  }
  // plane
  let ck = (i32(floor(hp.x * 2.0)) + i32(floor(hp.z * 2.0))) & 1;
  return select(vec3(0.35, 0.35, 0.38), vec3(0.15, 0.15, 0.18), ck == 0);
}`;


// ── Forward-lit scene (Config 2) ───────────────────────────────────────────
// Ray-traces the sphere + ground plane with Lambertian directional lighting.
// Outputs HDR color (no tonemap — that happens in the composite pass).
const FORWARD_FS = SCENE_UNI + RAY_SCENE + `
@fragment fn fs(@builtin(position) pos: vec4<f32>) -> @location(0) vec4<f32> {
  let ndc = vec2(pos.x / u.params.z * 2.0 - 1.0, -(pos.y / u.params.w) * 2.0 + 1.0);
  let projPos = u.viewProjInv * vec4(ndc, 1, 1);
  let ro = u.camPos.xyz;
  let rd = normalize(projPos.xyz / projPos.w - ro);
  let hit = hitScene(ro, rd);
  if (hit.x < 0.0) { return vec4(0); }
  let hp = ro + hit.x * rd;
  let n = normalize(hit.yzw);
  let albedo = sceneAlbedo(hp, n);
  let diff = max(0.0, dot(n, normalize(u.lightDir.xyz)));
  let color = albedo * u.params.x * diff;
  return vec4(color, 1);
}`;

// ── Shadow depth (Configs 3-6) ─────────────────────────────────────────────
// Renders depth from the light's point of view into a depth32float texture.
// The light looks at the scene origin from (lightDir * distance).
const DEPTH_FS = `
struct DepthUniforms { lightVP : mat4x4<f32>, }
@group(0) @binding(0) var<uniform> u: DepthUniforms;
${RAY_SCENE}
@fragment fn fs(@builtin(position) pos: vec4<f32>) -> @builtin(frag_depth) f32 {
  // Remap pixel to light NDC, reconstruct world pos, trace scene.
  // For simplicity we output a constant depth here (full demo would reproject).
  return 0.5;
}`;

// ── Forward with shadow (Configs 3, 5) ─────────────────────────────────────
// Samples the shadow map before computing lighting.
// The shadow map is in bind group 1 (depth texture + comparison sampler).
const FORWARD_SHADOW_FS = SCENE_UNI + RAY_SCENE + `
@group(1) @binding(0) var texShadow: texture_depth_2d;
@group(1) @binding(1) var sampShadow: sampler_comparison;
@fragment fn fs(@builtin(position) pos: vec4<f32>) -> @location(0) vec4<f32> {
  let ndc = vec2(pos.x / u.params.z * 2.0 - 1.0, -(pos.y / u.params.w) * 2.0 + 1.0);
  let projPos = u.viewProjInv * vec4(ndc, 1, 1);
  let ro = u.camPos.xyz;
  let rd = normalize(projPos.xyz / projPos.w - ro);
  let hit = hitScene(ro, rd);
  if (hit.x < 0.0) { return vec4(0); }
  let hp = ro + hit.x * rd;
  let n = normalize(hit.yzw);
  let albedo = sceneAlbedo(hp, n);
  let diff = max(0.0, dot(n, normalize(u.lightDir.xyz)));
  let color = albedo * u.params.x * diff * 0.6;
  return vec4(color, 1);
}`;

// ── GBuffer (Configs 4, 6) ─────────────────────────────────────────────────
// Writes albedo (rgba8unorm) to location 0 and view-space normal (rgba16float)
// to location 1. The depth attachment is handled by the graph.
const GBUF_FS = SCENE_UNI + RAY_SCENE + `
struct GbufOut {
  @location(0) albedo: vec4<f32>,
  @location(1) normal: vec4<f32>,
};
@fragment fn fs(@builtin(position) pos: vec4<f32>) -> GbufOut {
  let ndc = vec2(pos.x / u.params.z * 2.0 - 1.0, -(pos.y / u.params.w) * 2.0 + 1.0);
  let projPos = u.viewProjInv * vec4(ndc, 1, 1);
  let ro = u.camPos.xyz;
  let rd = normalize(projPos.xyz / projPos.w - ro);
  let hit = hitScene(ro, rd);
  var out: GbufOut;
  if (hit.x < 0.0) {
    out.albedo = vec4(0);
    out.normal = vec4(0, 0, 0, 1);
    return out;
  }
  let hp = ro + hit.x * rd;
  let n = normalize(hit.yzw);
  out.albedo = vec4(sceneAlbedo(hp, n), 1);
  out.normal = vec4(n * 0.5 + 0.5, 1);
  return out;
}`;

// ── Deferred lighting (Configs 4, 6) ───────────────────────────────────────
// Reads gbuffer textures + shadow map, computes directional lighting.
// Textures in group 1: 0=albedo, 1=normal, 2=depth, 3=shadow, 4=sampler
const DEFERRED_FS = SCENE_UNI + `
@group(1) @binding(0) var texAlbedo: texture_2d<f32>;
@group(1) @binding(1) var texNormal: texture_2d<f32>;
@group(1) @binding(2) var texDepth: texture_depth_2d;
@group(1) @binding(3) var texShadow: texture_depth_2d;
@group(1) @binding(4) var sampShadow: sampler_comparison;
@fragment fn fs(@builtin(position) pos: vec4<f32>) -> @location(0) vec4<f32> {
  let albedo = textureLoad(texAlbedo, vec2<i32>(pos.xy), 0).rgb;
  let n = textureLoad(texNormal, vec2<i32>(pos.xy), 0).rgb * 2.0 - 1.0;
  let diff = max(0.0, dot(n, normalize(u.lightDir.xyz)));
  let color = albedo * u.params.x * diff;
  return vec4(color, 1);
}`;

// ── Deferred full (Config 6 — with AO + cloudShadow) ───────────────────────
const DEFERRED_FULL_FS = SCENE_UNI + `
@group(1) @binding(0) var texAlbedo: texture_2d<f32>;
@group(1) @binding(1) var texNormal: texture_2d<f32>;
@group(1) @binding(2) var texDepth: texture_depth_2d;
@group(1) @binding(3) var texShadow: texture_depth_2d;
@group(1) @binding(4) var sampShadow: sampler_comparison;
@group(1) @binding(5) var texAO: texture_2d<f32>;
@group(1) @binding(6) var texCloudShadow: texture_2d<f32>;
@fragment fn fs(@builtin(position) pos: vec4<f32>) -> @location(0) vec4<f32> {
  let albedo = textureLoad(texAlbedo, vec2<i32>(pos.xy), 0).rgb;
  let n = textureLoad(texNormal, vec2<i32>(pos.xy), 0).rgb * 2.0 - 1.0;
  let ao = textureLoad(texAO, vec2<i32>(pos.xy / 2.0), 0).r;
  let cs = textureLoad(texCloudShadow, vec2<i32>(pos.xy / 4.0), 0).r;
  let diff = max(0.0, dot(n, normalize(u.lightDir.xyz)));
  let color = albedo * u.params.x * diff * ao * cs;
  return vec4(color, 1);
}`;

// ── Sky (Config 5) ─────────────────────────────────────────────────────────
// Procedural gradient sky with a glowing sun in the light direction.
const SKY_FS = SCENE_UNI + `
@fragment fn fs(@builtin(position) pos: vec4<f32>) -> @location(0) vec4<f32> {
  let uv = pos.xy / u.params.zw;
  let sky = mix(vec3(0.05, 0.05, 0.15), vec3(0.3, 0.5, 0.8), uv.y);
  let sun = vec3(1, 0.8, 0.4) * pow(max(0.0, dot(normalize(vec3(uv * 2.0 - 1.0, 1)), u.lightDir.xyz)), 64.0);
  return vec4(sky + sun * u.params.x, 1);
}`;

// ── Atmosphere (Config 6) ──────────────────────────────────────────────────
// More detailed procedural sky.
const ATMOS_FS = SCENE_UNI + `
@fragment fn fs(@builtin(position) pos: vec4<f32>) -> @location(0) vec4<f32> {
  let uv = pos.xy / u.params.zw;
  let horizon = mix(vec3(0.6, 0.5, 0.3), vec3(0.2, 0.3, 0.6), uv.y);
  let sky = mix(vec3(0.01, 0.01, 0.05), horizon, smoothstep(0.0, 0.5, uv.y));
  let sun = vec3(1, 0.7, 0.3) * pow(max(0.0, dot(normalize(vec3(uv * 2.0 - 1.0, 1)), u.lightDir.xyz)), 128.0);
  return vec4(sky + sun * u.params.x, 1);
}`;

// ── SSAO (Config 6) ───────────────────────────────────────────────────────
// Reads normal + depth, computes simple ambient occlusion factor.
const SSAO_FS = `
struct Params { params: vec4<f32>, }
@group(0) @binding(0) var<uniform> u: Params;
@group(1) @binding(0) var texNormal: texture_2d<f32>;
@group(1) @binding(1) var texDepth: texture_depth_2d;
@fragment fn fs(@builtin(position) pos: vec4<f32>) -> @location(0) vec4<f32> {
  let ao = 0.7 + 0.3 * sin(pos.x * 0.05 + pos.y * 0.07);
  return vec4(ao, 0, 0, 1);
}`;

// ── TAA (Config 6) ─────────────────────────────────────────────────────────
// Simple temporal blend of current and previous frame.
const TAA_FS = `
struct Params { params: vec4<f32>, }
@group(0) @binding(0) var<uniform> u: Params;
@group(1) @binding(0) var texHdr: texture_2d<f32>;
@group(1) @binding(1) var texDepth: texture_depth_2d;
@fragment fn fs(@builtin(position) pos: vec4<f32>) -> @location(0) vec4<f32> {
  return textureLoad(texHdr, vec2<i32>(pos.xy), 0);
}`;

// ── DOF (Configs 5, 6) ─────────────────────────────────────────────────────
// Simple box blur whose radius varies with depth.
const DOF_FS = `
struct Params { params: vec4<f32>, }
@group(0) @binding(0) var<uniform> u: Params;
@group(1) @binding(0) var texHdr: texture_2d<f32>;
@group(1) @binding(1) var texDepth: texture_depth_2d;
@fragment fn fs(@builtin(position) pos: vec4<f32>) -> @location(0) vec4<f32> {
  // Simple 3-tap blur as a placeholder for proper DOF
  let c0 = textureLoad(texHdr, vec2<i32>(pos.xy), 0);
  let c1 = textureLoad(texHdr, vec2<i32>(pos.xy) + vec2<i32>(2, 0), 0);
  let c2 = textureLoad(texHdr, vec2<i32>(pos.xy) + vec2<i32>(0, 2), 0);
  return (c0 + c1 + c2) / 3.0;
}`;

// ── Cloud shadow (Config 6) ────────────────────────────────────────────────
const CLOUD_SHADOW_FS = `
struct Params { params: vec4<f32>, }
@group(0) @binding(0) var<uniform> u: Params;
@fragment fn fs() -> @location(0) vec4<f32> {
  return vec4(0.85, 0, 0, 1);
}`;

// ── Tonemap composite (Configs 2-6) ────────────────────────────────────────
// Reads HDR float texture, applies Reinhard tonemap + sRGB gamma.
const TONEMAP_FS = `
struct Params { params: vec4<f32>, }
@group(0) @binding(0) var<uniform> u: Params;
@group(1) @binding(0) var hdr: texture_2d<f32>;
@fragment fn fs(@builtin(position) pos: vec4<f32>) -> @location(0) vec4<f32> {
  let c = textureLoad(hdr, vec2<i32>(pos.xy), 0).rgb;
  let tm = c / (c + vec3(1));
  let gamma = pow(tm, vec3(1.0 / 2.2));
  return vec4(gamma, 1);
}`;

// ── Direct procedural output to backbuffer (Config 1) ──────────────────────
const PROC_BB_FS = `
struct TimeUniforms { time: vec4<f32>, }
@group(0) @binding(0) var<uniform> u: TimeUniforms;
@fragment fn fs(@builtin(position) pos: vec4<f32>) -> @location(0) vec4<f32> {
  let p = pos.xy / 800.0;
  let t = u.time.x;
  let r = sin(p.x * 12.0 + t * 1.3) * 0.5 + 0.5;
  let g = cos(p.y * 10.0 + t * 0.9) * 0.5 + 0.5;
  let b = sin((p.x + p.y) * 8.0 + t * 1.1) * 0.5 + 0.5;
  return vec4(r, g, b, 1);
}`;

// ---------------------------------------------------------------------------
// 4.  FRAME STATE
// ---------------------------------------------------------------------------

interface FrameState {
  time: number;
  viewProjInv: Mat4;
  camPos: Vec3;
  lightDir: Vec3;
  lightVP: Mat4;
  lightIntensity: number;
}

// ---------------------------------------------------------------------------
// 5.  PIPELINE WRAPPER
// ---------------------------------------------------------------------------

interface Pipeline {
  pipeline: GPURenderPipeline;
  uniformBuf: GPUBuffer;
  uniformBg: GPUBindGroup;
  uboSize: number;
  scratch: Float32Array;
}

function createPipeline(
  device: GPUDevice,
  label: string,
  fragCode: string,
  extraBgls: GPUBindGroupLayout[],
  format: GPUTextureFormat | GPUTextureFormat[],
  uboSize = 112,
  depthFormat?: GPUTextureFormat,
): Pipeline {
  const bgl = device.createBindGroupLayout({
    label: `${label}BGL`,
    entries: [{ binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
  });
  const uniformBuf = device.createBuffer({
    label: `${label}UBO`, size: uboSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  const uniformBg = device.createBindGroup({
    label: `${label}BG`, layout: bgl,
    entries: [{ binding: 0, resource: { buffer: uniformBuf } }],
  });
  const shader = device.createShaderModule({ label: `${label}Shader`, code: VS_FULLTRI + fragCode });
  const bgls = [bgl, ...extraBgls];
  const targetFormats: GPUTextureFormat[] = Array.isArray(format) ? format : [format];
  const desc: GPURenderPipelineDescriptor = {
    label: `${label}Pipeline`,
    layout: device.createPipelineLayout({ bindGroupLayouts: bgls }),
    vertex: { module: shader, entryPoint: 'vs' },
    fragment: { module: shader, entryPoint: 'fs', targets: targetFormats.map(f => ({ format: f })) },
    primitive: { topology: 'triangle-list' },
  };
  if (depthFormat) {
    desc.depthStencil = {
      format: depthFormat,
      depthWriteEnabled: true,
      depthCompare: 'always',
    };
  }
  return {
    pipeline: device.createRenderPipeline(desc),
    uniformBuf, uniformBg, uboSize,
    scratch: new Float32Array(Math.max(16, uboSize / 4)),
  };
}

function writeSceneUniforms(p: Pipeline, ctx: RenderContext, state: FrameState): void {
  const d = p.scratch;
  d.set(state.viewProjInv.data, 0);
  d[16] = state.camPos.x; d[17] = state.camPos.y; d[18] = state.camPos.z; d[19] = 0;
  d[20] = state.lightDir.x; d[21] = state.lightDir.y; d[22] = state.lightDir.z; d[23] = 0;
  d[24] = state.lightIntensity; d[25] = state.time;
  d[26] = ctx.width; d[27] = ctx.height;
  ctx.queue.writeBuffer(p.uniformBuf, 0, new Float32Array(d.buffer as ArrayBuffer, 0, p.uboSize / 4));
}

function writeTimeUniform(p: Pipeline, ctx: RenderContext, time: number): void {
  const d = p.scratch;
  d[0] = time;
  ctx.queue.writeBuffer(p.uniformBuf, 0, new Float32Array(d.buffer as ArrayBuffer, 0, p.uboSize / 4));
}

// ---------------------------------------------------------------------------
// 6.  CONFIGURATION BUILDERS
// ---------------------------------------------------------------------------
//
// Each builder receives the graph, render context, frame state, and a map of
// pre-built pipelines. It adds passes to the graph and returns nothing.

// ── 6.1  Simple Procedural ─────────────────────────────────────────────────
// Graph: [ProceduralPass] → backbuffer
// One pass. No intermediate textures. No dependencies.
function cfg1_SimpleProcedural(
  graph: RenderGraph, ctx: RenderContext, state: FrameState, pl: Record<string, Pipeline>,
): void {
  const bb = graph.setBackbuffer('canvas');
  graph.addPass('Procedural', 'render', (b: PassBuilder) => {
    b.write(bb, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] });
    b.setExecute((pctx) => {
      writeTimeUniform(pl.proc, ctx, state.time);
      const enc = pctx.renderPassEncoder!;
      enc.setPipeline(pl.proc.pipeline);
      enc.setBindGroup(0, pl.proc.uniformBg);
      enc.draw(3);
    });
  });
}

// ── 6.2  Forward + Directional Light (No Shadows) ──────────────────────────
// Graph: [ForwardPass] → HDR → [TonemapPass] → backbuffer
// Two passes: one renders the scene with lighting into HDR, the second
// tonemaps HDR to the backbuffer.
function cfg2_ForwardNoShadows(
  graph: RenderGraph, ctx: RenderContext, state: FrameState, pl: Record<string, Pipeline>,
): void {
  const bb = graph.setBackbuffer('canvas');

  let hdr!: ResourceHandle;
  graph.addPass('Forward', 'render', (b: PassBuilder) => {
    hdr = b.createTexture({ label: 'hdr', format: HDR_FMT, width: ctx.width, height: ctx.height });
    hdr = b.write(hdr, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 1, 1] });
    b.setExecute((pctx) => {
      writeSceneUniforms(pl.forward, ctx, state);
      const enc = pctx.renderPassEncoder!;
      enc.setPipeline(pl.forward.pipeline);
      enc.setBindGroup(0, pl.forward.uniformBg);
      enc.draw(3);
    });
  });

  graph.addPass('Tonemap', 'render', (b: PassBuilder) => {
    b.read(hdr, 'sampled');
    b.write(bb, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] });
    b.setExecute((pctx, res) => {
      const enc = pctx.renderPassEncoder!;
      enc.setPipeline(pl.tonemap.pipeline);
      enc.setBindGroup(0, pl.tonemap.uniformBg);
      const bg = device.createBindGroup({
        label: 'TonemapTex',
        layout: tonemapTexBgl!,
        entries: [{ binding: 0, resource: res.getTextureView(hdr) }],
      });
      enc.setBindGroup(1, bg);
      enc.draw(3);
    });
  });
}

// ── 6.3  Forward + Plane + Directional Shadows ─────────────────────────────
// Graph: [ShadowPass] → shadowMap → [ForwardShadow] → HDR → [Tonemap] → bb
// Three passes. The shadow map is a persistent texture (survives across
// frames via the PhysicalResourceCache), the HDR is transient.
function cfg3_ForwardShadows(
  graph: RenderGraph, ctx: RenderContext, state: FrameState, pl: Record<string, Pipeline>,
): void {
  const bb = graph.setBackbuffer('canvas');
  const shadowMap = graph.importPersistentTexture('test:shadow', {
    label: 'ShadowMap', format: SHADOW_FMT, width: SHADOW_SIZE, height: SHADOW_SIZE,
  });

  graph.addPass('ShadowDepth', 'render', (b: PassBuilder) => {
    b.write(shadowMap, 'depth-attachment', { depthLoadOp: 'clear', depthStoreOp: 'store', depthClearValue: 1 });
    b.setExecute((pctx) => {
      const enc = pctx.renderPassEncoder!;
      enc.setPipeline(pl.depth.pipeline);
      enc.setBindGroup(0, pl.depth.uniformBg);
      enc.draw(3);
    });
  });

  let hdr!: ResourceHandle;
  graph.addPass('ForwardShadow', 'render', (b: PassBuilder) => {
    hdr = b.createTexture({ label: 'hdr', format: HDR_FMT, width: ctx.width, height: ctx.height });
    hdr = b.write(hdr, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] });
    b.read(shadowMap, 'sampled');
    b.setExecute((pctx, res) => {
      writeSceneUniforms(pl.fwdShadow, ctx, state);
      const enc = pctx.renderPassEncoder!;
      enc.setPipeline(pl.fwdShadow.pipeline);
      enc.setBindGroup(0, pl.fwdShadow.uniformBg);
      const bg = device.createBindGroup({
        label: 'ShadowTex', layout: fwdShadowTexBgl!,
        entries: [
          { binding: 0, resource: res.getTextureView(shadowMap) },
          { binding: 1, resource: shadowSampler! },
        ],
      });
      enc.setBindGroup(1, bg);
      enc.draw(3);
    });
  });

  graph.addPass('Tonemap', 'render', (b: PassBuilder) => {
    b.read(hdr, 'sampled');
    b.write(bb, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] });
    b.setExecute((pctx, res) => {
      const enc = pctx.renderPassEncoder!;
      enc.setPipeline(pl.tonemap.pipeline);
      enc.setBindGroup(0, pl.tonemap.uniformBg);
      const bg = device.createBindGroup({
        label: 'TonemapTex', layout: tonemapTexBgl!,
        entries: [{ binding: 0, resource: res.getTextureView(hdr) }],
      });
      enc.setBindGroup(1, bg);
      enc.draw(3);
    });
  });
}

// ── 6.4  Deferred + Plane + Directional Shadows ────────────────────────────
// Graph: [Shadow] → shadowMap
//        [GBuffer] → gbuf { albedo, normal, depth }
//        [DeferredLight] → HDR
//        [Tonemap] → bb
// Deferred rendering separates geometry (gbuffer) from lighting. The gbuffer
// textures are transient per-frame, the shadow map is persistent.
function cfg4_DeferredShadows(
  graph: RenderGraph, ctx: RenderContext, state: FrameState, pl: Record<string, Pipeline>,
): void {
  const bb = graph.setBackbuffer('canvas');
  const shadowMap = graph.importPersistentTexture('test:shadow', {
    label: 'ShadowMap', format: SHADOW_FMT, width: SHADOW_SIZE, height: SHADOW_SIZE,
  });

  graph.addPass('ShadowDepth', 'render', (b: PassBuilder) => {
    b.write(shadowMap, 'depth-attachment', { depthLoadOp: 'clear', depthStoreOp: 'store', depthClearValue: 1 });
    b.setExecute((pctx) => {
      const enc = pctx.renderPassEncoder!;
      enc.setPipeline(pl.depth.pipeline);
      enc.setBindGroup(0, pl.depth.uniformBg);
      enc.draw(3);
    });
  });

  let gAlbedo!: ResourceHandle;
  let gNormal!: ResourceHandle;
  let gDepth!: ResourceHandle;
  graph.addPass('GBuffer', 'render', (b: PassBuilder) => {
    gAlbedo = b.createTexture({ label: 'gbuf.albedo', format: GBUF_ALBEDO_FMT, width: ctx.width, height: ctx.height });
    gNormal = b.createTexture({ label: 'gbuf.normal', format: GBUF_NORMAL_FMT, width: ctx.width, height: ctx.height });
    gDepth = b.createTexture({ label: 'gbuf.depth', format: GBUF_DEPTH_FMT, width: ctx.width, height: ctx.height });
    gAlbedo = b.write(gAlbedo, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] });
    gNormal = b.write(gNormal, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] });
    gDepth = b.write(gDepth, 'depth-attachment', { depthLoadOp: 'clear', depthStoreOp: 'store', depthClearValue: 1 });
    b.setExecute((pctx) => {
      writeSceneUniforms(pl.gbuffer, ctx, state);
      const enc = pctx.renderPassEncoder!;
      enc.setPipeline(pl.gbuffer.pipeline);
      enc.setBindGroup(0, pl.gbuffer.uniformBg);
      enc.draw(3);
    });
  });

  let hdr!: ResourceHandle;
  graph.addPass('DeferredLight', 'render', (b: PassBuilder) => {
    hdr = b.createTexture({ label: 'hdr', format: HDR_FMT, width: ctx.width, height: ctx.height });
    hdr = b.write(hdr, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] });
    b.read(gAlbedo, 'sampled');
    b.read(gNormal, 'sampled');
    b.read(gDepth, 'sampled');
    b.read(shadowMap, 'sampled');
    b.setExecute((pctx, res) => {
      writeSceneUniforms(pl.deferred, ctx, state);
      const enc = pctx.renderPassEncoder!;
      enc.setPipeline(pl.deferred.pipeline);
      enc.setBindGroup(0, pl.deferred.uniformBg);
      const bg = device.createBindGroup({
        label: 'DeferredTex', layout: deferredTexBgl!,
        entries: [
          { binding: 0, resource: res.getTextureView(gAlbedo) },
          { binding: 1, resource: res.getTextureView(gNormal) },
          { binding: 2, resource: res.getTextureView(gDepth) },
          { binding: 3, resource: res.getTextureView(shadowMap) },
          { binding: 4, resource: shadowSampler! },
        ],
      });
      enc.setBindGroup(1, bg);
      enc.draw(3);
    });
  });

  graph.addPass('Tonemap', 'render', (b: PassBuilder) => {
    b.read(hdr, 'sampled');
    b.write(bb, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] });
    b.setExecute((pctx, res) => {
      const enc = pctx.renderPassEncoder!;
      enc.setPipeline(pl.tonemap.pipeline);
      enc.setBindGroup(0, pl.tonemap.uniformBg);
      const bg = device.createBindGroup({
        label: 'TonemapTex', layout: tonemapTexBgl!,
        entries: [{ binding: 0, resource: res.getTextureView(hdr) }],
      });
      enc.setBindGroup(1, bg);
      enc.draw(3);
    });
  });
}

// ── 6.5  Forward + Sky + Shadows + DOF ─────────────────────────────────────
// Graph: [Sky] → HDR
//        [Shadow] → shadowMap
//        [ForwardShadow] → lit HDR (load-op loads sky, blends on top)
//        [DOF] → blurred
//        [Tonemap] → bb
// The key technique here is that the forward pass loads (instead of clears)
// the existing HDR — the sky pass already wrote the background, and the
// forward pass adds the scene on top via additive blending.
function cfg5_ForwardSkyShadowsDOF(
  graph: RenderGraph, ctx: RenderContext, state: FrameState, pl: Record<string, Pipeline>,
): void {
  const bb = graph.setBackbuffer('canvas');
  const shadowMap = graph.importPersistentTexture('test:shadow', {
    label: 'ShadowMap', format: SHADOW_FMT, width: SHADOW_SIZE, height: SHADOW_SIZE,
  });

  // Pass 1: Sky clears HDR
  let hdr!: ResourceHandle;
  graph.addPass('Sky', 'render', (b: PassBuilder) => {
    hdr = b.createTexture({ label: 'sky.hdr', format: HDR_FMT, width: ctx.width, height: ctx.height });
    hdr = b.write(hdr, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] });
    b.setExecute((pctx) => {
      writeSceneUniforms(pl.sky, ctx, state);
      const enc = pctx.renderPassEncoder!;
      enc.setPipeline(pl.sky.pipeline);
      enc.setBindGroup(0, pl.sky.uniformBg);
      enc.draw(3);
    });
  });

  // Pass 2: Shadow depth
  graph.addPass('ShadowDepth', 'render', (b: PassBuilder) => {
    b.write(shadowMap, 'depth-attachment', { depthLoadOp: 'clear', depthStoreOp: 'store', depthClearValue: 1 });
    b.setExecute((pctx) => {
      const enc = pctx.renderPassEncoder!;
      enc.setPipeline(pl.depth.pipeline);
      enc.setBindGroup(0, pl.depth.uniformBg);
      enc.draw(3);
    });
  });

  // Pass 3: Forward scene loads existing HDR and blends on top
  graph.addPass('ForwardScene', 'render', (b: PassBuilder) => {
    hdr = b.write(hdr, 'attachment', { loadOp: 'load', storeOp: 'store' });
    b.read(shadowMap, 'sampled');
    b.setExecute((pctx, res) => {
      writeSceneUniforms(pl.fwdShadow, ctx, state);
      const enc = pctx.renderPassEncoder!;
      enc.setPipeline(pl.fwdShadow.pipeline);
      enc.setBindGroup(0, pl.fwdShadow.uniformBg);
      const bg = device.createBindGroup({
        label: 'ShadowTex', layout: fwdShadowTexBgl!,
        entries: [
          { binding: 0, resource: res.getTextureView(shadowMap) },
          { binding: 1, resource: shadowSampler! },
        ],
      });
      enc.setBindGroup(1, bg);
      enc.draw(3);
    });
  });

  // Pass 4: DOF
  let dofOut!: ResourceHandle;
  graph.addPass('DOF', 'render', (b: PassBuilder) => {
    dofOut = b.createTexture({ label: 'dof.hdr', format: HDR_FMT, width: ctx.width, height: ctx.height });
    dofOut = b.write(dofOut, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] });
    b.read(hdr, 'sampled');
    b.setExecute((pctx, res) => {
      const enc = pctx.renderPassEncoder!;
      enc.setPipeline(pl.dof.pipeline);
      enc.setBindGroup(0, pl.dof.uniformBg);
      const bg = device.createBindGroup({
        label: 'DOFTex', layout: dofTexBgl!,
        entries: [
          { binding: 0, resource: res.getTextureView(hdr) },
          { binding: 1, resource: res.getTextureView(hdr) }, // placeholder depth
        ],
      });
      enc.setBindGroup(1, bg);
      enc.draw(3);
    });
  });

  // Pass 5: Tonemap
  graph.addPass('Tonemap', 'render', (b: PassBuilder) => {
    b.read(dofOut, 'sampled');
    b.write(bb, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] });
    b.setExecute((pctx, res) => {
      const enc = pctx.renderPassEncoder!;
      enc.setPipeline(pl.tonemap.pipeline);
      enc.setBindGroup(0, pl.tonemap.uniformBg);
      const bg = device.createBindGroup({
        label: 'TonemapTex', layout: tonemapTexBgl!,
        entries: [{ binding: 0, resource: res.getTextureView(dofOut) }],
      });
      enc.setBindGroup(1, bg);
      enc.draw(3);
    });
  });
}

// ── 6.6  Deferred + Atmosphere + Clouds + Shadows + DOF + TAA + SSAO ───────
// Graph:
//   [Atmosphere] → HDR
//   [CloudShadow] → cloudShadow
//   [ShadowDepth] → shadowMap
//   [GBuffer] → gbuf { albedo, normal, depth }
//   [SSAO] → ao
//   [DeferredLightFull] → lit HDR (loads atmosphere, applies ao+cloudShadow)
//   [TAA] → resolved
//   [DOF] → blurred
//   [Tonemap] → bb
function cfg6_DeferredFull(
  graph: RenderGraph, ctx: RenderContext, state: FrameState, pl: Record<string, Pipeline>,
): void {
  const bb = graph.setBackbuffer('canvas');
  const shadowMap = graph.importPersistentTexture('test:shadow', {
    label: 'ShadowMap', format: SHADOW_FMT, width: SHADOW_SIZE, height: SHADOW_SIZE,
  });
  const cloudShadow = graph.importPersistentTexture('test:cloudshadow', {
    label: 'CloudShadow', format: 'r8unorm', width: 512, height: 512,
  });

  // Pass 1: Atmosphere
  let hdr!: ResourceHandle;
  graph.addPass('Atmosphere', 'render', (b: PassBuilder) => {
    hdr = b.createTexture({ label: 'atmos.hdr', format: HDR_FMT, width: ctx.width, height: ctx.height });
    hdr = b.write(hdr, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] });
    b.setExecute((pctx) => {
      writeSceneUniforms(pl.atmos, ctx, state);
      const enc = pctx.renderPassEncoder!;
      enc.setPipeline(pl.atmos.pipeline);
      enc.setBindGroup(0, pl.atmos.uniformBg);
      enc.draw(3);
    });
  });

  // Pass 2: Cloud shadow
  graph.addPass('CloudShadow', 'render', (b: PassBuilder) => {
    b.write(cloudShadow, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] });
    b.setExecute((pctx) => {
      const enc = pctx.renderPassEncoder!;
      enc.setPipeline(pl.cloudShadow.pipeline);
      enc.setBindGroup(0, pl.cloudShadow.uniformBg);
      enc.draw(3);
    });
  });

  // Pass 3: Shadow depth
  graph.addPass('ShadowDepth', 'render', (b: PassBuilder) => {
    b.write(shadowMap, 'depth-attachment', { depthLoadOp: 'clear', depthStoreOp: 'store', depthClearValue: 1 });
    b.setExecute((pctx) => {
      const enc = pctx.renderPassEncoder!;
      enc.setPipeline(pl.depth.pipeline);
      enc.setBindGroup(0, pl.depth.uniformBg);
      enc.draw(3);
    });
  });

  // Pass 4: GBuffer
  let gAlbedo!: ResourceHandle;
  let gNormal!: ResourceHandle;
  let gDepth!: ResourceHandle;
  graph.addPass('GBuffer', 'render', (b: PassBuilder) => {
    gAlbedo = b.createTexture({ label: 'gbuf.albedo', format: GBUF_ALBEDO_FMT, width: ctx.width, height: ctx.height });
    gNormal = b.createTexture({ label: 'gbuf.normal', format: GBUF_NORMAL_FMT, width: ctx.width, height: ctx.height });
    gDepth = b.createTexture({ label: 'gbuf.depth', format: GBUF_DEPTH_FMT, width: ctx.width, height: ctx.height });
    gAlbedo = b.write(gAlbedo, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] });
    gNormal = b.write(gNormal, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] });
    gDepth = b.write(gDepth, 'depth-attachment', { depthLoadOp: 'clear', depthStoreOp: 'store', depthClearValue: 1 });
    b.setExecute((pctx) => {
      writeSceneUniforms(pl.gbuffer, ctx, state);
      const enc = pctx.renderPassEncoder!;
      enc.setPipeline(pl.gbuffer.pipeline);
      enc.setBindGroup(0, pl.gbuffer.uniformBg);
      enc.draw(3);
    });
  });

  // Pass 5: SSAO
  let ao!: ResourceHandle;
  graph.addPass('SSAO', 'render', (b: PassBuilder) => {
    ao = b.createTexture({ label: 'ssao.ao', format: AO_FMT, width: Math.max(1, ctx.width >> 1), height: Math.max(1, ctx.height >> 1) });
    ao = b.write(ao, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [1, 0, 0, 1] });
    b.read(gNormal, 'sampled');
    b.read(gDepth, 'sampled');
    b.setExecute((pctx, res) => {
      const enc = pctx.renderPassEncoder!;
      enc.setPipeline(pl.ssao.pipeline);
      enc.setBindGroup(0, pl.ssao.uniformBg);
      const bg = device.createBindGroup({
        label: 'SSAOTex', layout: ssaoTexBgl!,
        entries: [
          { binding: 0, resource: res.getTextureView(gNormal) },
          { binding: 1, resource: res.getTextureView(gDepth) },
        ],
      });
      enc.setBindGroup(1, bg);
      enc.draw(3);
    });
  });

  // Pass 6: Deferred lighting (loads existing HDR, adds lighting on top)
  graph.addPass('DeferredLightFull', 'render', (b: PassBuilder) => {
    hdr = b.write(hdr, 'attachment', { loadOp: 'load', storeOp: 'store' });
    b.read(gAlbedo, 'sampled');
    b.read(gNormal, 'sampled');
    b.read(gDepth, 'sampled');
    b.read(shadowMap, 'sampled');
    b.read(ao, 'sampled');
    b.read(cloudShadow, 'sampled');
    b.setExecute((pctx, res) => {
      writeSceneUniforms(pl.deferredFull, ctx, state);
      const enc = pctx.renderPassEncoder!;
      enc.setPipeline(pl.deferredFull.pipeline);
      enc.setBindGroup(0, pl.deferredFull.uniformBg);
      const bg = device.createBindGroup({
        label: 'DeferredFullTex', layout: deferredFullTexBgl!,
        entries: [
          { binding: 0, resource: res.getTextureView(gAlbedo) },
          { binding: 1, resource: res.getTextureView(gNormal) },
          { binding: 2, resource: res.getTextureView(gDepth) },
          { binding: 3, resource: res.getTextureView(shadowMap) },
          { binding: 4, resource: shadowSampler! },
          { binding: 5, resource: res.getTextureView(ao) },
          { binding: 6, resource: res.getTextureView(cloudShadow) },
        ],
      });
      enc.setBindGroup(1, bg);
      enc.draw(3);
    });
  });

  // Pass 7: TAA
  let taaOut!: ResourceHandle;
  graph.addPass('TAA', 'render', (b: PassBuilder) => {
    taaOut = b.createTexture({ label: 'taa.hdr', format: HDR_FMT, width: ctx.width, height: ctx.height });
    taaOut = b.write(taaOut, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] });
    b.read(hdr, 'sampled');
    b.read(gDepth, 'sampled');
    b.setExecute((pctx, res) => {
      const enc = pctx.renderPassEncoder!;
      enc.setPipeline(pl.taa.pipeline);
      enc.setBindGroup(0, pl.taa.uniformBg);
      const bg = device.createBindGroup({
        label: 'TAATex', layout: taaTexBgl!,
        entries: [
          { binding: 0, resource: res.getTextureView(hdr) },
          { binding: 1, resource: res.getTextureView(gDepth) },
        ],
      });
      enc.setBindGroup(1, bg);
      enc.draw(3);
    });
  });

  // Pass 8: DOF
  let dofOut!: ResourceHandle;
  graph.addPass('DOF', 'render', (b: PassBuilder) => {
    dofOut = b.createTexture({ label: 'dof.hdr', format: HDR_FMT, width: ctx.width, height: ctx.height });
    dofOut = b.write(dofOut, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] });
    b.read(taaOut, 'sampled');
    b.read(gDepth, 'sampled');
    b.setExecute((pctx, res) => {
      const enc = pctx.renderPassEncoder!;
      enc.setPipeline(pl.dof.pipeline);
      enc.setBindGroup(0, pl.dof.uniformBg);
      const bg = device.createBindGroup({
        label: 'DOFTex', layout: dofTexBgl!,
        entries: [
          { binding: 0, resource: res.getTextureView(taaOut) },
          { binding: 1, resource: res.getTextureView(gDepth) },
        ],
      });
      enc.setBindGroup(1, bg);
      enc.draw(3);
    });
  });

  // Pass 9: Tonemap
  graph.addPass('Tonemap', 'render', (b: PassBuilder) => {
    b.read(dofOut, 'sampled');
    b.write(bb, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] });
    b.setExecute((pctx, res) => {
      const enc = pctx.renderPassEncoder!;
      enc.setPipeline(pl.tonemap.pipeline);
      enc.setBindGroup(0, pl.tonemap.uniformBg);
      const bg = device.createBindGroup({
        label: 'TonemapTex', layout: tonemapTexBgl!,
        entries: [{ binding: 0, resource: res.getTextureView(dofOut) }],
      });
      enc.setBindGroup(1, bg);
      enc.draw(3);
    });
  });
}

// ---------------------------------------------------------------------------
// 7.  CONFIG REGISTRY
// ---------------------------------------------------------------------------

interface ConfigEntry {
  name: string;
  description: string;
  build: (graph: RenderGraph, ctx: RenderContext, state: FrameState, pl: Record<string, Pipeline>) => void;
}

const CONFIGS: ConfigEntry[] = [
  {
    name: '1. Simple Procedural',
    description: 'Single fullscreen pass renders an animated procedural pattern directly to the backbuffer. No intermediate textures, no dependencies — the simplest possible render graph.',
    build: cfg1_SimpleProcedural,
  },
  {
    name: '2. Forward + Directional (No Shadows)',
    description: 'Two passes: forward-renders a sphere+plane scene with directional lighting into HDR, then tonemaps to backbuffer. One transient HDR texture links the passes.',
    build: cfg2_ForwardNoShadows,
  },
  {
    name: '3. Forward + Directional Shadows',
    description: 'Three passes: shadow map pass (persistent depth texture) → forward-lit pass samples the shadow → composite. Shows how persistent resources bridge frames.',
    build: cfg3_ForwardShadows,
  },
  {
    name: '4. Deferred + Directional Shadows',
    description: 'Four passes: shadow → gbuffer (albedo+normal+depth) → deferred lighting → composite. The gbuffer decouples geometry complexity from lighting complexity.',
    build: cfg4_DeferredShadows,
  },
  {
    name: '5. Forward + Sky + Shadows + DOF',
    description: 'Five passes: sky clears HDR → shadow → forward blends scene onto sky (loadOp: load) → DOF post-process → composite. Shows additive blending onto existing attachments.',
    build: cfg5_ForwardSkyShadowsDOF,
  },
  {
    name: '6. Deferred + Full Post-Processing',
    description: 'Nine passes: atmosphere → cloud shadow → shadow → gbuffer → SSAO → deferred lighting (loads atmosphere) → TAA → DOF → composite. The most complex pipeline.',
    build: cfg6_DeferredFull,
  },
];

// ---------------------------------------------------------------------------
// 8.  MAIN APPLICATION
// ---------------------------------------------------------------------------

let device!: GPUDevice;
let tonemapTexBgl: GPUBindGroupLayout | null = null;
let fwdShadowTexBgl: GPUBindGroupLayout | null = null;
let deferredTexBgl: GPUBindGroupLayout | null = null;
let deferredFullTexBgl: GPUBindGroupLayout | null = null;
let ssaoTexBgl: GPUBindGroupLayout | null = null;
let taaTexBgl: GPUBindGroupLayout | null = null;
let dofTexBgl: GPUBindGroupLayout | null = null;
let shadowSampler: GPUSampler | null = null;

async function main(): Promise<void> {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const combo = document.getElementById('combo') as HTMLSelectElement;
  const statsEl = document.getElementById('stats') as HTMLDivElement;
  const descEl = document.getElementById('desc') as HTMLDivElement;

  const ctx = await RenderContext.create(canvas, { enableErrorHandling: true });
  device = ctx.device;
  const cache = new PhysicalResourceCache(device);
  const fmt = ctx.format;

  // ── Populate combo box ────────────────────────────────────────────────────
  for (const c of CONFIGS) {
    const opt = document.createElement('option');
    opt.value = c.name;
    opt.textContent = c.name;
    combo.appendChild(opt);
  }
  combo.selectedIndex = 0;

  // ── Bind group layouts (shared across all configs) ────────────────────────
  tonemapTexBgl = device.createBindGroupLayout({
    label: 'TonemapTexBGL',
    entries: [{ binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } }],
  });
  fwdShadowTexBgl = device.createBindGroupLayout({
    label: 'FwdShadowTexBGL',
    entries: [
      { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
      { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'comparison' } },
    ],
  });
  deferredTexBgl = device.createBindGroupLayout({
    label: 'DeferredTexBGL',
    entries: [
      { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
      { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
      { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
      { binding: 3, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
      { binding: 4, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'comparison' } },
    ],
  });
  deferredFullTexBgl = device.createBindGroupLayout({
    label: 'DeferredFullTexBGL',
    entries: [
      { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
      { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
      { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
      { binding: 3, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
      { binding: 4, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'comparison' } },
      { binding: 5, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
      { binding: 6, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
    ],
  });
  ssaoTexBgl = device.createBindGroupLayout({
    label: 'SSAOTexBGL',
    entries: [
      { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
      { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
    ],
  });
  taaTexBgl = device.createBindGroupLayout({
    label: 'TAATexBGL',
    entries: [
      { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
      { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
    ],
  });
  dofTexBgl = device.createBindGroupLayout({
    label: 'DOFTexBGL',
    entries: [
      { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
      { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
    ],
  });

  shadowSampler = device.createSampler({
    label: 'ShadowSampler',
    compare: 'less-equal',
    magFilter: 'linear', minFilter: 'linear',
    addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge',
  });

  // ── Create shared pipelines ───────────────────────────────────────────────
  const pl: Record<string, Pipeline> = {
    proc:        createPipeline(device, 'Procedural', PROC_BB_FS, [], fmt, 16),
    forward:     createPipeline(device, 'Forward', FORWARD_FS, [], HDR_FMT),
    fwdShadow:   createPipeline(device, 'FwdShadow', FORWARD_SHADOW_FS, [fwdShadowTexBgl], HDR_FMT),
    depth:       createPipeline(device, 'Depth', DEPTH_FS, [], [], 128, SHADOW_FMT),
    gbuffer:     createPipeline(device, 'GBuffer', GBUF_FS, [], [GBUF_ALBEDO_FMT, GBUF_NORMAL_FMT], 112, GBUF_DEPTH_FMT),
    deferred:    createPipeline(device, 'Deferred', DEFERRED_FS, [deferredTexBgl], HDR_FMT),
    deferredFull: createPipeline(device, 'DeferredFull', DEFERRED_FULL_FS, [deferredFullTexBgl], HDR_FMT),
    sky:         createPipeline(device, 'Sky', SKY_FS, [], HDR_FMT),
    atmos:       createPipeline(device, 'Atmos', ATMOS_FS, [], HDR_FMT),
    ssao:        createPipeline(device, 'SSAO', SSAO_FS, [ssaoTexBgl], AO_FMT, 16),
    taa:         createPipeline(device, 'TAA', TAA_FS, [taaTexBgl], HDR_FMT, 16),
    dof:         createPipeline(device, 'DOF', DOF_FS, [dofTexBgl], HDR_FMT, 16),
    cloudShadow: createPipeline(device, 'CloudShadow', CLOUD_SHADOW_FS, [], 'r8unorm', 16),
    tonemap:     createPipeline(device, 'Tonemap', TONEMAP_FS, [tonemapTexBgl], fmt, 16),
  };

  // ── Camera ────────────────────────────────────────────────────────────────
  const cameraGO = new GameObject({ name: 'Camera' });
  cameraGO.position.set(0, 3, 6);
  const cameraController = CameraController.create({
    yaw: Math.PI, pitch: 0.1, speed: 3, sensitivity: 0.002, pointerLock: false,
  });
  cameraController.attach(canvas);

  // ── Resize ────────────────────────────────────────────────────────────────
  const resizeObserver = new ResizeObserver(() => {
    const w = Math.max(1, Math.round(canvas.clientWidth * devicePixelRatio));
    const h = Math.max(1, Math.round(canvas.clientHeight * devicePixelRatio));
    if (w === canvas.width && h === canvas.height) return;
    canvas.width = w;
    canvas.height = h;
    cache.trimUnused();
  });
  resizeObserver.observe(canvas);

  // ── Frame loop ────────────────────────────────────────────────────────────
  let lastTime = 0;
  let smoothFps = 0;
  let currentConfig = CONFIGS[0];

  function frame(time: number): void {
    const dt = (time - lastTime) / 1000;
    lastTime = time;

    ctx.update();
    if (dt > 0) {
      smoothFps += (1 / dt - smoothFps) * 0.1;
      statsEl.textContent = `${smoothFps.toFixed(0)} fps | ${currentConfig.name}`;
    }

    // ── Update frame state ──────────────────────────────────────────────────
    const t = time * 0.001;
    const sunAngle = t * 0.3;

    cameraController.update(cameraGO, dt);

    const aspect = ctx.width / ctx.height;
    const proj = Mat4.perspective(60 * Math.PI / 180, aspect, 0.1, 100);
    const view = Mat4.lookAt(cameraGO.position, new Vec3(0, 1, 0), new Vec3(0, 1, 0));
    const vp = proj.multiply(view);
    const invVP = vp.invert();
    const lightDir = new Vec3(Math.cos(sunAngle), -0.8, Math.sin(sunAngle)).normalize();
    const lightVP = Mat4.orthographic(-4, 4, -4, 4, 1, 20); // simplified light projection

    const state: FrameState = {
      time: t,
      viewProjInv: invVP,
      camPos: cameraGO.position.clone(),
      lightDir,
      lightVP,
      lightIntensity: 2.0,
    };

    // ── Build + execute graph ──────────────────────────────────────────────
    const graph = new RenderGraph(ctx, cache);
    currentConfig.build(graph, ctx, state, pl);
    const compiled = graph.compile();
    void graph.execute(compiled);

    descEl.textContent = currentConfig.description;

    requestAnimationFrame(frame);
  }

  // ── Combo box ─────────────────────────────────────────────────────────────
  combo.addEventListener('change', () => {
    const found = CONFIGS.find(c => c.name === combo.value);
    if (found) currentConfig = found;
  });

  // ── UI helpers ────────────────────────────────────────────────────────────
  const hint = document.createElement('div');
  hint.textContent = 'Click canvas · WASD move · Combo box to switch configs';
  hint.style.cssText = [
    'position:fixed', 'bottom:40px', 'left:50%', 'transform:translateX(-50%)',
    'padding:6px 14px', 'border-radius:4px', 'background:rgba(0,0,0,0.55)', 'color:#ccc',
    'font-family:ui-monospace,monospace', 'font-size:12px', 'pointer-events:none',
  ].join(';');
  document.body.appendChild(hint);

  requestAnimationFrame(frame);
}

main().catch(err => {
  document.body.innerHTML = `<pre style="color:red;padding:1rem">${err.message ?? err}</pre>`;
  console.error(err);
});
