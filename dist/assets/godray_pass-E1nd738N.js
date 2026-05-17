var J=Object.defineProperty;var K=(v,u,n)=>u in v?J(v,u,{enumerable:!0,configurable:!0,writable:!0,value:n}):v[u]=n;var r=(v,u,n)=>K(v,typeof u!="symbol"?u+"":u,n);import{R as V}from"./render_pass-BouxMEb8.js";import{H as O}from"./deferred_lighting_pass-CezAqw45.js";import{a as Q,b as $}from"./cloud_noise-YhCgvemq.js";const L=96,z=48,E=32;class q extends V{constructor(n,t,e,o,i,s,d,a,l){super();r(this,"name","CloudPass");r(this,"_pipeline");r(this,"_hdrView");r(this,"_cameraBuffer");r(this,"_cloudBuffer");r(this,"_lightBuffer");r(this,"_sceneBG");r(this,"_lightBG");r(this,"_depthBG");r(this,"_noiseSkyBG");r(this,"_cameraScratch",new Float32Array(L/4));r(this,"_lightScratch",new Float32Array(E/4));r(this,"_settingsScratch",new Float32Array(z/4));this._pipeline=n,this._hdrView=t,this._cameraBuffer=e,this._cloudBuffer=o,this._lightBuffer=i,this._sceneBG=s,this._lightBG=d,this._depthBG=a,this._noiseSkyBG=l}static create(n,t,e,o){const{device:i}=n,s=i.createBuffer({label:"CloudCameraBuffer",size:L,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),d=i.createBuffer({label:"CloudUniformBuffer",size:z,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),a=i.createBuffer({label:"CloudLightBuffer",size:E,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),l=i.createBindGroupLayout({label:"CloudSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),p=i.createBindGroupLayout({label:"CloudLightBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),f=i.createBindGroupLayout({label:"CloudDepthBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),c=i.createBindGroupLayout({label:"CloudNoiseSkyBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),h=i.createSampler({label:"CloudNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"mirror-repeat",addressModeV:"mirror-repeat",addressModeW:"mirror-repeat"}),g=i.createSampler({label:"CloudDepthSampler"}),_=i.createBindGroup({label:"CloudSceneBG",layout:l,entries:[{binding:0,resource:{buffer:s}},{binding:1,resource:{buffer:d}}]}),y=i.createBindGroup({label:"CloudLightBG",layout:p,entries:[{binding:0,resource:{buffer:a}}]}),m=i.createBindGroup({label:"CloudDepthBG",layout:f,entries:[{binding:0,resource:e},{binding:1,resource:g}]}),B=i.createBindGroup({label:"CloudNoiseSkyBG",layout:c,entries:[{binding:0,resource:o.baseView},{binding:1,resource:o.detailView},{binding:2,resource:h}]}),G=n.createShaderModule(Q,"CloudShader"),x=i.createRenderPipeline({label:"CloudPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[l,p,f,c]}),vertex:{module:G,entryPoint:"vs_main"},fragment:{module:G,entryPoint:"fs_main",targets:[{format:O}]},primitive:{topology:"triangle-list"}});return new q(x,t,s,d,a,_,y,m,B)}updateCamera(n){const t=n.activeCamera;if(!t)throw new Error("CloudPass.updateCamera: ctx.activeCamera is null");const e=t.position(),o=this._cameraScratch;o.set(t.inverseViewProjectionMatrix().data,0),o[16]=e.x,o[17]=e.y,o[18]=e.z,o[19]=t.near,o[20]=t.far,n.queue.writeBuffer(this._cameraBuffer,0,o.buffer)}updateLight(n,t,e,o){const i=this._lightScratch;i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=o,i[4]=e.x,i[5]=e.y,i[6]=e.z,n.queue.writeBuffer(this._lightBuffer,0,i.buffer)}updateSettings(n,t){const e=this._settingsScratch;e[0]=t.cloudBase,e[1]=t.cloudTop,e[2]=t.coverage,e[3]=t.density,e[4]=t.windOffset[0],e[5]=t.windOffset[1],e[6]=t.anisotropy,e[7]=t.extinction,e[8]=t.ambientColor[0],e[9]=t.ambientColor[1],e[10]=t.ambientColor[2],e[11]=t.exposure,n.queue.writeBuffer(this._cloudBuffer,0,e.buffer)}execute(n,t){const e=n.beginRenderPass({label:"CloudPass",colorAttachments:[{view:this._hdrView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});e.setPipeline(this._pipeline),e.setBindGroup(0,this._sceneBG),e.setBindGroup(1,this._lightBG),e.setBindGroup(2,this._depthBG),e.setBindGroup(3,this._noiseSkyBG),e.draw(3),e.end()}destroy(){this._cameraBuffer.destroy(),this._cloudBuffer.destroy(),this._lightBuffer.destroy()}}const N=1024,I="r8unorm",H=48;class k extends V{constructor(n,t,e,o,i,s){super();r(this,"name","CloudShadowPass");r(this,"shadowTexture");r(this,"shadowView");r(this,"_pipeline");r(this,"_uniformBuffer");r(this,"_uniformBG");r(this,"_noiseBG");r(this,"_frameCount",0);r(this,"_data",new Float32Array(H/4));this.shadowTexture=n,this.shadowView=t,this._pipeline=e,this._uniformBuffer=o,this._uniformBG=i,this._noiseBG=s}static create(n,t){const{device:e}=n,o=e.createTexture({label:"CloudShadowTexture",size:{width:N,height:N},format:I,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),i=o.createView(),s=e.createBuffer({label:"CloudShadowUniform",size:H,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),d=e.createBindGroupLayout({label:"CloudShadowUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),a=e.createSampler({label:"CloudNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"mirror-repeat",addressModeV:"mirror-repeat",addressModeW:"mirror-repeat"}),l=e.createBindGroupLayout({label:"CloudShadowNoiseBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),p=e.createBindGroup({label:"CloudShadowUniformBG",layout:d,entries:[{binding:0,resource:{buffer:s}}]}),f=e.createBindGroup({label:"CloudShadowNoiseBG",layout:l,entries:[{binding:0,resource:t.baseView},{binding:1,resource:t.detailView},{binding:2,resource:a}]}),c=n.createShaderModule($,"CloudShadowShader"),h=e.createRenderPipeline({label:"CloudShadowPipeline",layout:e.createPipelineLayout({bindGroupLayouts:[d,l]}),vertex:{module:c,entryPoint:"vs_main"},fragment:{module:c,entryPoint:"fs_main",targets:[{format:I}]},primitive:{topology:"triangle-list"}});return new k(o,i,h,s,p,f)}update(n,t,e,o){this._data[0]=t.cloudBase,this._data[1]=t.cloudTop,this._data[2]=t.coverage,this._data[3]=t.density,this._data[4]=t.windOffset[0],this._data[5]=t.windOffset[1],this._data[6]=e[0],this._data[7]=e[1],this._data[8]=o,this._data[9]=t.extinction,n.queue.writeBuffer(this._uniformBuffer,0,this._data.buffer)}execute(n,t){if(this._frameCount++%2!==0)return;const e=n.beginRenderPass({label:"CloudShadowPass",colorAttachments:[{view:this.shadowView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});e.setPipeline(this._pipeline),e.setBindGroup(0,this._uniformBG),e.setBindGroup(1,this._noiseBG),e.draw(3),e.end()}destroy(){this.shadowTexture.destroy(),this._uniformBuffer.destroy()}}const ee=`// godray_march.wgsl — Half-resolution ray-march pass with 3D cloud-density shadowing

const PI: f32 = 3.14159265358979;

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
  @location(0)       uv      : vec2<f32>,
}

struct CameraUniforms {
  view       : mat4x4<f32>,
  proj       : mat4x4<f32>,
  viewProj   : mat4x4<f32>,
  invViewProj: mat4x4<f32>,
  position   : vec3<f32>,
  near       : f32,
  far        : f32,
}

struct LightUniforms {
  direction         : vec3<f32>,
  intensity         : f32,
  color             : vec3<f32>,
  cascadeCount      : u32,
  cascadeMatrices   : array<mat4x4<f32>, 4>,
  cascadeSplits     : vec4<f32>,
  shadowsEnabled    : u32,
  debugCascades     : u32,
  cloudShadowOrigin : vec2<f32>,
  cloudShadowExtent : f32,
  shadowSoftness    : f32,
  _pad_light        : vec2<f32>,
  cascadeDepthRanges: vec4<f32>,
}

struct MarchParams {
  scattering: f32,
  max_steps : f32,
  _pad0     : f32,
  _pad1     : f32,
}

struct CloudDensityUniforms {
  cloudBase : f32,
  cloudTop  : f32,
  coverage  : f32,
  density   : f32,
  windOffset: vec2<f32>,
  extinction: f32,
  _pad0     : f32,
  _pad1     : f32,
  _pad2     : f32,
  _pad3     : f32,
  _pad4     : f32,
  _pad5     : f32,
  _pad6     : f32,
  _pad7     : f32,
}

@group(0) @binding(0) var<uniform> camera         : CameraUniforms;
@group(0) @binding(1) var<uniform> light           : LightUniforms;
@group(0) @binding(2) var          depth_tex       : texture_depth_2d;
@group(0) @binding(3) var          shadow_map      : texture_depth_2d_array;
@group(0) @binding(4) var          shadow_samp     : sampler_comparison;
@group(0) @binding(5) var<uniform> march_params    : MarchParams;
@group(0) @binding(6) var<uniform> cloud_density   : CloudDensityUniforms;
@group(0) @binding(7) var          base_noise      : texture_3d<f32>;
@group(0) @binding(8) var          detail_noise    : texture_3d<f32>;
@group(0) @binding(9) var          noise_samp      : sampler;

@vertex
fn vs_main(@builtin(vertex_index) vid: u32) -> VertexOutput {
  let x = f32((vid & 1u) << 2u) - 1.0;
  let y = f32((vid & 2u) << 1u) - 1.0;
  var out: VertexOutput;
  out.clip_pos = vec4<f32>(x, y, 0.0, 1.0);
  out.uv       = vec2<f32>(x * 0.5 + 0.5, -y * 0.5 + 0.5);
  return out;
}

fn henyey_greenstein(cos_theta: f32, g: f32) -> f32 {
  let k = 0.0795774715459;
  return k * (1.0 - g * g) / pow(max(1.0 + g * g - 2.0 * g * cos_theta, 1e-4), 1.5);
}

fn reconstruct_world_pos(uv: vec2<f32>, depth: f32) -> vec3<f32> {
  let ndc     = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);
  let world_h = camera.invViewProj * ndc;
  return world_h.xyz / world_h.w;
}

fn select_cascade(view_depth: f32) -> u32 {
  for (var i = 0u; i < light.cascadeCount; i++) {
    if (view_depth < light.cascadeSplits[i]) { return i; }
  }
  return light.cascadeCount - 1u;
}

fn shadow_at(world_pos: vec3<f32>) -> f32 {
  if (light.shadowsEnabled == 0u) { return 1.0; }
  let view_pos   = camera.view * vec4<f32>(world_pos, 1.0);
  let view_depth = -view_pos.z;
  let cascade    = select_cascade(view_depth);

  let ls  = light.cascadeMatrices[cascade] * vec4<f32>(world_pos, 1.0);
  var sc  = ls.xyz / ls.w;
  sc      = vec3<f32>(sc.xy * 0.5 + 0.5, sc.z);
  sc.y    = 1.0 - sc.y;
  if (any(sc.xy < vec2<f32>(0.0)) || any(sc.xy > vec2<f32>(1.0)) || sc.z > 1.0) {
    return 1.0;
  }
  return textureSampleCompareLevel(shadow_map, shadow_samp, sc.xy, i32(cascade), sc.z - 0.005);
}

fn dither(uv: vec2<f32>) -> f32 {
  return fract(sin(dot(uv, vec2<f32>(41.0, 289.0))) * 45758.5453);
}

// ---- Cloud density helpers (mirrors cloud_shadow.wgsl) -----------------------

const ROT_C: f32 = 0.79863551;
const ROT_S: f32 = 0.60181502;
fn rotate_xz(p: vec3<f32>) -> vec3<f32> {
  return vec3<f32>(p.x * ROT_C - p.z * ROT_S, p.y, p.x * ROT_S + p.z * ROT_C);
}

fn remap(v: f32, lo: f32, hi: f32, a: f32, b: f32) -> f32 {
  return clamp(a + (v - lo) / max(hi - lo, 0.0001) * (b - a), a, b);
}

fn height_gradient(y: f32) -> f32 {
  let t    = clamp((y - cloud_density.cloudBase) / max(cloud_density.cloudTop - cloud_density.cloudBase, 0.001), 0.0, 1.0);
  let base = remap(t, 0.0, 0.07, 0.0, 1.0);
  let top  = remap(t, 0.2, 1.0,  1.0, 0.0);
  return saturate(base * top);
}

fn sample_density(world_pos: vec3<f32>) -> f32 {
  let pr = rotate_xz(world_pos);
  let scale = 0.04;
  let base_uv = (pr + vec3<f32>(cloud_density.windOffset.x, 0.0, cloud_density.windOffset.y)) * scale;
  let base = textureSampleLevel(base_noise, noise_samp, base_uv, 0.0);

  let pw = base.r * 0.625 + (1.0 - base.g) * 0.25 + (1.0 - base.b) * 0.125;
  let hg = height_gradient(world_pos.y);
  let cov = saturate(remap(pw, 1.0 - cloud_density.coverage, 1.0, 0.0, 1.0)) * hg;
  if (cov < 0.001) { return 0.0; }

  let detail_scale = 0.12;
  let detail_uv = pr * detail_scale + vec3<f32>(cloud_density.windOffset.x, 0.0, cloud_density.windOffset.y) * 0.1;
  let det = textureSampleLevel(detail_noise, noise_samp, detail_uv, 0.0);
  let detail = det.r * 0.5 + det.g * 0.25 + det.b * 0.125;

  return max(0.0, cov - (1.0 - cov) * detail * 0.3) * cloud_density.density;
}

// Integrates cloud density vertically above p through the full cloud slab.
// Returns the Beer's-law transmittance (1 = fully transparent, 0 = fully opaque).
fn cloud_shadow_vertical(p: vec3<f32>) -> f32 {
  let start_y = max(p.y, cloud_density.cloudBase);
  if (start_y >= cloud_density.cloudTop) { return 1.0; }
  let range = cloud_density.cloudTop - start_y;
  let num_steps = 4u;
  let step_size = range / f32(num_steps);
  var opt_depth = 0.0;
  for (var i = 0u; i < num_steps; i++) {
    let y = start_y + (f32(i) + 0.5) * step_size;
    opt_depth += sample_density(vec3<f32>(p.x, y, p.z)) * step_size;
  }
  return exp(-opt_depth * cloud_density.extinction);
}

// ---- Fragment shader ---------------------------------------------------------

@fragment
fn fs_march(in: VertexOutput) -> @location(0) vec4<f32> {
  let depth_size = vec2<i32>(textureDimensions(depth_tex));
  let coord      = clamp(vec2<i32>(in.uv * vec2<f32>(depth_size)),
                         vec2<i32>(0), depth_size - vec2<i32>(1));
  let depth = textureLoad(depth_tex, coord, 0u);

  let hit_depth = select(depth, 1.0, depth >= 1.0);
  let world_pos = reconstruct_world_pos(in.uv, hit_depth);
  let ray_vec   = world_pos - camera.position;
  let ray_len   = length(ray_vec);
  let ray_dir   = ray_vec / max(ray_len, 0.001);

  let steps     = u32(march_params.max_steps);
  let step_len  = ray_len / f32(steps);
  let dith      = dither(in.uv) * step_len;
  var pos       = camera.position + ray_dir * dith;

  let sun_dir   = normalize(-light.direction);
  let cos_theta = dot(ray_dir, sun_dir);
  let phase     = henyey_greenstein(cos_theta, march_params.scattering);

  var accum = 0.0;
  for (var i = 0u; i < steps; i++) {
    let shad     = shadow_at(pos);
    let trans    = cloud_shadow_vertical(pos);
    accum += phase * shad * trans;
    pos   += ray_dir * step_len;
  }

  let fog = clamp(accum / f32(steps), 0.0, 1.0);
  return vec4<f32>(fog, 0.0, 0.0, 1.0);
}
`,te=`// godray_composite.wgsl — Blur and composite passes for volumetric godrays.
//
// fs_blur: bilateral depth-aware Gaussian blur of the half-res fog texture
//          (run twice — horizontal then vertical — using the blur_dir uniform).
//
// fs_composite: depth-aware upsampling from half-res fog to full-res, followed
//               by an additive blend of (fog × sun color × sun intensity) onto
//               the HDR render target.  Uses pipeline blend state (one+one) so
//               the fragment only needs to output the additive contribution.
//
// Bindings 0-3 are used by both entry points; binding 4 (light) is composite-only.
// With layout:'auto' each pipeline derives its own BGL from the entry point's
// static usage, so blur and composite bind groups can be created independently.

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
  @location(0)       uv      : vec2<f32>,
}

struct LightUniforms {
  direction         : vec3<f32>,
  intensity         : f32,
  color             : vec3<f32>,
  cascadeCount      : u32,
  cascadeMatrices   : array<mat4x4<f32>, 4>,
  cascadeSplits     : vec4<f32>,
  shadowsEnabled    : u32,
  debugCascades     : u32,
  cloudShadowOrigin : vec2<f32>,
  cloudShadowExtent : f32,
  shadowSoftness    : f32,
  _pad_light        : vec2<f32>,
  cascadeDepthRanges: vec4<f32>,
}

// Shared by blur and composite — blur uses blur_dir, composite uses fog_curve.
struct Params {
  blur_dir  : vec2<f32>,  // (1,0) for horizontal, (0,1) for vertical; ignored by composite
  fog_curve : f32,        // power applied to fog before compositing; ignored by blur
  _pad      : f32,
}

@group(0) @binding(0) var          fog_tex  : texture_2d<f32>;
@group(0) @binding(1) var          depth_tex: texture_depth_2d;
@group(0) @binding(2) var          samp     : sampler;
@group(0) @binding(3) var<uniform> params   : Params;
@group(0) @binding(4) var<uniform> light    : LightUniforms; // composite only

fn depth_load(uv: vec2<f32>) -> f32 {
  let size  = vec2<i32>(textureDimensions(depth_tex));
  let coord = clamp(vec2<i32>(uv * vec2<f32>(size)), vec2<i32>(0), size - vec2<i32>(1));
  return textureLoad(depth_tex, coord, 0u);
}

// Gaussian half-kernel (center..edge, index = abs(tap offset)).
// Sum of symmetric 7-tap (±3) with these weights ≈ 1.
const GAUSS: array<f32, 4> = array<f32, 4>(
  0.19638062, 0.17469900, 0.12161760, 0.06706740,
);

@vertex
fn vs_main(@builtin(vertex_index) vid: u32) -> VertexOutput {
  let x = f32((vid & 1u) << 2u) - 1.0;
  let y = f32((vid & 2u) << 1u) - 1.0;
  var out: VertexOutput;
  out.clip_pos = vec4<f32>(x, y, 0.0, 1.0);
  out.uv       = vec2<f32>(x * 0.5 + 0.5, -y * 0.5 + 0.5);
  return out;
}

// ---- Blur pass ---------------------------------------------------------------

@fragment
fn fs_blur(in: VertexOutput) -> @location(0) vec4<f32> {
  // Step size in UV space: one fog texel in the blur direction.
  let texel  = 1.0 / vec2<f32>(textureDimensions(fog_tex));
  let step   = params.blur_dir * texel;
  let depth0 = depth_load(in.uv);

  var accum  = 0.0;
  var weight = 0.0;
  for (var i: i32 = -3; i <= 3; i++) {
    let uv_off  = in.uv + step * f32(i);
    let depth_s = depth_load(uv_off);
    let fog_s   = textureSampleLevel(fog_tex,   samp, uv_off, 0.0).r;
    // Depth-aware bilateral weight: suppress blur across depth discontinuities.
    let d_wt  = exp(-abs(depth_s - depth0) * 1000.0);
    let w     = GAUSS[abs(i)] * d_wt;
    accum  += w * fog_s;
    weight += w;
  }
  return vec4<f32>(accum / max(weight, 1e-5), 0.0, 0.0, 1.0);
}

// ---- Composite pass ----------------------------------------------------------

@fragment
fn fs_composite(in: VertexOutput) -> @location(0) vec4<f32> {
  let depth0 = depth_load(in.uv);

  // Sky pixels: sample fog directly without depth-aware neighbor logic.
  if (depth0 >= 1.0) {
    var fog = textureSampleLevel(fog_tex, samp, in.uv, 0.0).r;
    fog = pow(max(fog, 0.0), params.fog_curve);
    let horizon_fade = smoothstep(-0.05, 0.05, -light.direction.y);
    let fog_color = light.color * light.intensity * fog * horizon_fade;
    return vec4<f32>(fog_color, 0.0);
  }

  // Depth-aware upsampling: among the four half-res neighbours, pick the one
  // whose depth is closest to this full-res pixel to avoid bleeding across edges.
  let fog_texel = 1.0 / vec2<f32>(textureDimensions(fog_tex));

  let d1 = depth_load(in.uv + vec2<f32>( fog_texel.x, 0.0));
  let d2 = depth_load(in.uv + vec2<f32>(-fog_texel.x, 0.0));
  let d3 = depth_load(in.uv + vec2<f32>(0.0,  fog_texel.y));
  let d4 = depth_load(in.uv + vec2<f32>(0.0, -fog_texel.y));

  let e1 = abs(depth0 - d1); let e2 = abs(depth0 - d2);
  let e3 = abs(depth0 - d3); let e4 = abs(depth0 - d4);
  let dmin = min(min(e1, e2), min(e3, e4));

  var offset = vec2<f32>(0.0);
  if      (dmin == e1) { offset = vec2<f32>( fog_texel.x, 0.0); }
  else if (dmin == e2) { offset = vec2<f32>(-fog_texel.x, 0.0); }
  else if (dmin == e3) { offset = vec2<f32>(0.0,  fog_texel.y); }
  else if (dmin == e4) { offset = vec2<f32>(0.0, -fog_texel.y); }

  var fog = textureSampleLevel(fog_tex, samp, in.uv + offset, 0.0).r;
  fog = pow(max(fog, 0.0), params.fog_curve);

  // Fade godrays at night by scaling with the sun's above-horizon factor.
  let horizon_fade = smoothstep(-0.05, 0.05, -light.direction.y);
  let fog_color    = light.color * light.intensity * fog * horizon_fade;

  // Written additively onto the HDR buffer via one+one blend state.
  return vec4<f32>(fog_color, 0.0);
}
`,w=O,S=16,re=64;class W extends V{constructor(n,t,e,o,i,s,d,a,l,p,f,c,h,g,_,y,m,B){super();r(this,"name","GodrayPass");r(this,"scattering",.3);r(this,"fogCurve",2);r(this,"maxSteps",16);r(this,"_fogA");r(this,"_fogB");r(this,"_fogAView");r(this,"_fogBView");r(this,"_hdrView");r(this,"_marchPipeline");r(this,"_blurHPipeline");r(this,"_blurVPipeline");r(this,"_compositePipeline");r(this,"_marchBG");r(this,"_blurHBG");r(this,"_blurVBG");r(this,"_compositeBG");r(this,"_marchParamsBuf");r(this,"_blurHParamsBuf");r(this,"_blurVParamsBuf");r(this,"_compParamsBuf");r(this,"_cloudDensityBuf");r(this,"_marchScratch",new Float32Array(4));r(this,"_compScratch",new Float32Array(4));r(this,"_densityScratch",new Float32Array(8));this._fogA=n,this._fogAView=t,this._fogB=e,this._fogBView=o,this._hdrView=i,this._marchPipeline=s,this._blurHPipeline=d,this._blurVPipeline=a,this._compositePipeline=l,this._marchBG=p,this._blurHBG=f,this._blurVBG=c,this._compositeBG=h,this._marchParamsBuf=g,this._blurHParamsBuf=_,this._blurVParamsBuf=y,this._compParamsBuf=m,this._cloudDensityBuf=B}static create(n,t,e,o,i,s,d){const{device:a,width:l,height:p}=n,f=Math.max(1,l>>1),c=Math.max(1,p>>1),h=a.createTexture({label:"GodrayFogA",size:{width:f,height:c},format:w,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),g=a.createTexture({label:"GodrayFogB",size:{width:f,height:c},format:w,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),_=h.createView(),y=g.createView(),m=a.createSampler({label:"GodraySampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),B=a.createSampler({label:"GodrayNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"mirror-repeat",addressModeV:"mirror-repeat",addressModeW:"mirror-repeat"}),G=a.createSampler({label:"GodrayCmpSampler",compare:"less-equal",magFilter:"linear",minFilter:"linear"}),x=a.createBuffer({label:"GodrayCloudDensity",size:re,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),P=a.createBuffer({label:"GodrayMarchParams",size:S,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});a.queue.writeBuffer(P,0,new Float32Array([.3,16,0,0]).buffer);const U=a.createBuffer({label:"GodrayBlurHParams",size:S,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});a.queue.writeBuffer(U,0,new Float32Array([1,0,0,0]).buffer);const C=a.createBuffer({label:"GodrayBlurVParams",size:S,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});a.queue.writeBuffer(C,0,new Float32Array([0,1,0,0]).buffer);const T=a.createBuffer({label:"GodrayCompositeParams",size:S,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});a.queue.writeBuffer(T,0,new Float32Array([0,0,2,0]).buffer);const R=n.createShaderModule(ee,"GodrayMarchShader"),M=a.createRenderPipeline({label:"GodrayMarchPipeline",layout:"auto",vertex:{module:R,entryPoint:"vs_main"},fragment:{module:R,entryPoint:"fs_march",targets:[{format:w}]},primitive:{topology:"triangle-list"}}),Y=a.createBindGroup({label:"GodrayMarchBG",layout:M.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:s}},{binding:2,resource:t.depthView},{binding:3,resource:e.shadowMapView},{binding:4,resource:G},{binding:5,resource:{buffer:P}},{binding:6,resource:{buffer:x}},{binding:7,resource:d.baseView},{binding:8,resource:d.detailView},{binding:9,resource:B}]}),b=n.createShaderModule(te,"GodrayCompositeShader"),F=a.createRenderPipeline({label:"GodrayBlurHPipeline",layout:"auto",vertex:{module:b,entryPoint:"vs_main"},fragment:{module:b,entryPoint:"fs_blur",targets:[{format:w}]},primitive:{topology:"triangle-list"}}),A=a.createRenderPipeline({label:"GodrayBlurVPipeline",layout:"auto",vertex:{module:b,entryPoint:"vs_main"},fragment:{module:b,entryPoint:"fs_blur",targets:[{format:w}]},primitive:{topology:"triangle-list"}}),D=a.createRenderPipeline({label:"GodrayCompositePipeline",layout:"auto",vertex:{module:b,entryPoint:"vs_main"},fragment:{module:b,entryPoint:"fs_composite",targets:[{format:O,blend:{color:{operation:"add",srcFactor:"one",dstFactor:"one"},alpha:{operation:"add",srcFactor:"one",dstFactor:"one"}}}]},primitive:{topology:"triangle-list"}}),Z=a.createBindGroup({label:"GodrayBlurHBG",layout:F.getBindGroupLayout(0),entries:[{binding:0,resource:_},{binding:1,resource:t.depthView},{binding:2,resource:m},{binding:3,resource:{buffer:U}}]}),j=a.createBindGroup({label:"GodrayBlurVBG",layout:A.getBindGroupLayout(0),entries:[{binding:0,resource:y},{binding:1,resource:t.depthView},{binding:2,resource:m},{binding:3,resource:{buffer:C}}]}),X=a.createBindGroup({label:"GodrayCompositeBG",layout:D.getBindGroupLayout(0),entries:[{binding:0,resource:_},{binding:1,resource:t.depthView},{binding:2,resource:m},{binding:3,resource:{buffer:T}},{binding:4,resource:{buffer:s}}]});return new W(h,_,g,y,o,M,F,A,D,Y,Z,j,X,P,U,C,T,x)}updateParams(n){this._marchScratch[0]=this.scattering,this._marchScratch[1]=this.maxSteps,this._marchScratch[2]=0,this._marchScratch[3]=0,n.queue.writeBuffer(this._marchParamsBuf,0,this._marchScratch.buffer),this._compScratch[0]=0,this._compScratch[1]=0,this._compScratch[2]=this.fogCurve,this._compScratch[3]=0,n.queue.writeBuffer(this._compParamsBuf,0,this._compScratch.buffer)}updateCloudDensity(n,t){const e=this._densityScratch;e[0]=t.cloudBase,e[1]=t.cloudTop,e[2]=t.coverage,e[3]=t.density,e[4]=t.windOffset[0],e[5]=t.windOffset[1],e[6]=t.extinction,e[7]=0,n.queue.writeBuffer(this._cloudDensityBuf,0,e.buffer)}execute(n,t){const e=(o,i,s,d,a=!0)=>{const l=n.beginRenderPass({label:o,colorAttachments:[{view:i,clearValue:[0,0,0,0],loadOp:a?"clear":"load",storeOp:"store"}]});l.setPipeline(s),l.setBindGroup(0,d),l.draw(3),l.end()};e("GodrayMarch",this._fogAView,this._marchPipeline,this._marchBG),e("GodrayBlurH",this._fogBView,this._blurHPipeline,this._blurHBG),e("GodrayBlurV",this._fogAView,this._blurVPipeline,this._blurVBG),e("GodrayComposite",this._hdrView,this._compositePipeline,this._compositeBG,!1)}destroy(){this._fogA.destroy(),this._fogB.destroy(),this._marchParamsBuf.destroy(),this._blurHParamsBuf.destroy(),this._blurVParamsBuf.destroy(),this._compParamsBuf.destroy(),this._cloudDensityBuf.destroy()}}export{q as C,W as G,k as a};
