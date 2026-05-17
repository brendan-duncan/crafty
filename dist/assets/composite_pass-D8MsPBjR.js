var w=Object.defineProperty;var M=(c,o,i)=>o in c?w(c,o,{enumerable:!0,configurable:!0,writable:!0,value:i}):c[o]=i;var n=(c,o,i)=>M(c,typeof o!="symbol"?o+"":o,i);import{R as A}from"./render_pass-BouxMEb8.js";const B=`// composite.wgsl — Fog + Underwater + Tonemap merged into a single full-screen draw.
// Replaces FogPass → UnderwaterPass → TonemapPass, saving 2 intermediate HDR
// textures and 2 render-pass boundaries.
//
// Effect enable flags live in params.fog_flags and params.tonemap_flags so the GPU
// can branch them out without pipeline recompilation.

const PI: f32 = 3.14159265358979;

// ── Atmospheric scatter ────────────────────────────────────────────────────────
// Constants must match lighting.wgsl / fog.wgsl exactly.

const ATM_R_E   : f32       = 6360000.0;
const ATM_R_A   : f32       = 6420000.0;
const ATM_H_R   : f32       = 8500.0;
const ATM_H_M   : f32       = 1200.0;
const ATM_G     : f32       = 0.758;
const ATM_BETA_R: vec3<f32> = vec3<f32>(5.5e-6, 13.0e-6, 22.4e-6);
const ATM_BETA_M: f32       = 21.0e-6;
const ATM_SUN_I : f32       = 20.0;

fn atm_ray_sphere(ro: vec3<f32>, rd: vec3<f32>, r: f32) -> vec2<f32> {
  let b = dot(ro, rd); let c = dot(ro, ro) - r * r; let d = b * b - c;
  if (d < 0.0) { return vec2<f32>(-1.0, -1.0); }
  let sq = sqrt(d);
  return vec2<f32>(-b - sq, -b + sq);
}

fn atm_optical_depth(pos: vec3<f32>, dir: vec3<f32>) -> vec2<f32> {
  let t = atm_ray_sphere(pos, dir, ATM_R_A); let ds = t.y / 4.0;
  var od = vec2<f32>(0.0);
  for (var i = 0; i < 4; i++) {
    let h = length(pos + dir * ((f32(i) + 0.5) * ds)) - ATM_R_E;
    if (h < 0.0) { break; }
    od += vec2<f32>(exp(-h / ATM_H_R), exp(-h / ATM_H_M)) * ds;
  }
  return od;
}

fn atm_scatter(ro: vec3<f32>, rd: vec3<f32>, sun_dir: vec3<f32>) -> vec3<f32> {
  let ta = atm_ray_sphere(ro, rd, ATM_R_A); let tMin = max(ta.x, 0.0);
  if (ta.y < 0.0) { return vec3<f32>(0.0); }
  let tg   = atm_ray_sphere(ro, rd, ATM_R_E);
  let tMax = select(ta.y, min(ta.y, tg.x), tg.x > 0.0);
  if (tMax <= tMin) { return vec3<f32>(0.0); }
  let mu = dot(rd, sun_dir);
  let pR = (3.0 / (16.0 * PI)) * (1.0 + mu * mu);
  let g2 = ATM_G * ATM_G;
  let pM = (3.0 / (8.0 * PI)) * ((1.0 - g2) * (1.0 + mu * mu)) /
            ((2.0 + g2) * pow(max(1.0 + g2 - 2.0 * ATM_G * mu, 1e-4), 1.5));
  let ds = (tMax - tMin) / 6.0;
  var sumR = vec3<f32>(0.0); var sumM = vec3<f32>(0.0);
  var odR = 0.0; var odM = 0.0;
  for (var i = 0; i < 6; i++) {
    let pos = ro + rd * (tMin + (f32(i) + 0.5) * ds);
    let h   = length(pos) - ATM_R_E;
    if (h < 0.0) { break; }
    let hrh = exp(-h / ATM_H_R) * ds; let hmh = exp(-h / ATM_H_M) * ds;
    odR += hrh; odM += hmh;
    let tg2 = atm_ray_sphere(pos, sun_dir, ATM_R_E);
    if (tg2.x > 0.0) { continue; }
    let odL = atm_optical_depth(pos, sun_dir);
    let tau = ATM_BETA_R * (odR + odL.x) + ATM_BETA_M * 1.1 * (odM + odL.y);
    sumR += exp(-tau) * hrh; sumM += exp(-tau) * hmh;
  }
  return ATM_SUN_I * (ATM_BETA_R * pR * sumR + vec3<f32>(ATM_BETA_M) * pM * sumM);
}

// ── Structs ───────────────────────────────────────────────────────────────────

struct CameraUniforms {
  view       : mat4x4<f32>,
  proj       : mat4x4<f32>,
  viewProj   : mat4x4<f32>,
  invViewProj: mat4x4<f32>,
  position   : vec3<f32>,
  near       : f32,
  far        : f32,
}

// Only the first field of the full LightUniforms buffer is needed here.
struct LightDir { direction: vec3<f32>, }

// Combined params buffer — 64 bytes.
// Layout (byte offsets):
//  0  fog_color      vec3<f32>
// 12  depth_density  f32
// 16  depth_begin    f32
// 20  depth_end      f32
// 24  depth_curve    f32
// 28  height_density f32
// 32  height_min     f32
// 36  height_max     f32
// 40  height_curve   f32
// 44  fog_flags      u32  bit 0 = depth fog, bit 1 = height fog
// 48  uw_time        f32
// 52  is_underwater  f32
// 56  tonemap_flags  u32  bit 0 = aces, bit 1 = debug_ao, bit 2 = hdr_canvas
// 60  _pad           f32
struct CompositeParams {
  fog_color      : vec3<f32>,
  depth_density  : f32,
  depth_begin    : f32,
  depth_end      : f32,
  depth_curve    : f32,
  height_density : f32,
  height_min     : f32,
  height_max     : f32,
  height_curve   : f32,
  fog_flags      : u32,
  uw_time        : f32,
  is_underwater  : f32,
  tonemap_flags  : u32,
  _pad           : f32,
}

// invViewProj(64) + cam_pos(12) + pad(4) + sun_dir(12) + pad(4) = 96 bytes
struct StarUniforms {
  invViewProj: mat4x4<f32>,
  cam_pos    : vec3<f32>,
  _pad0      : f32,
  sun_dir    : vec3<f32>,
  _pad1      : f32,
}

struct ExposureBuffer {
  value: f32,
  _p0  : f32, _p1: f32, _p2: f32,
}

// ── Bindings ──────────────────────────────────────────────────────────────────

@group(0) @binding(0) var hdr_tex : texture_2d<f32>;
@group(0) @binding(1) var ao_tex  : texture_2d<f32>;
@group(0) @binding(2) var dep_tex : texture_depth_2d;
@group(0) @binding(3) var samp    : sampler;

@group(1) @binding(0) var<uniform> camera  : CameraUniforms;
@group(1) @binding(1) var<uniform> light   : LightDir;

@group(2) @binding(0) var<uniform>        params   : CompositeParams;
@group(2) @binding(1) var<uniform>        star_uni : StarUniforms;
@group(2) @binding(2) var<storage, read>  exposure : ExposureBuffer;

// ── Vertex shader ─────────────────────────────────────────────────────────────

struct VertOut {
  @builtin(position) pos: vec4<f32>,
  @location(0)       uv : vec2<f32>,
}

@vertex
fn vs_main(@builtin(vertex_index) vid: u32) -> VertOut {
  let x = f32((vid & 1u) << 2u) - 1.0;
  let y = f32((vid & 2u) << 1u) - 1.0;
  var out: VertOut;
  out.pos = vec4<f32>(x, y, 0.0, 1.0);
  out.uv  = vec2<f32>(x * 0.5 + 0.5, -y * 0.5 + 0.5);
  return out;
}

// ── Star field ────────────────────────────────────────────────────────────────

fn star_hash(p: vec2<f32>) -> f32 {
  return fract(sin(dot(p, vec2<f32>(127.1, 311.7))) * 43758.5453);
}

fn star_hash2(p: vec2<f32>) -> vec2<f32> {
  return fract(sin(vec2<f32>(
    dot(p, vec2<f32>(127.1, 311.7)),
    dot(p, vec2<f32>(269.5, 183.3)),
  )) * 43758.5453);
}

fn dir_to_equirect(d: vec3<f32>) -> vec2<f32> {
  let u = atan2(d.x, -d.z) / (2.0 * PI) + 0.5;
  let v = 0.5 - asin(clamp(d.y, -1.0, 1.0)) / PI;
  return vec2<f32>(u, v);
}

fn sample_stars(ray_dir: vec3<f32>) -> vec3<f32> {
  let GRID    = vec2<f32>(300.0, 150.0);
  let uv      = dir_to_equirect(ray_dir);
  let gcoord  = uv * GRID;
  let cell    = floor(gcoord);
  let frac_uv = fract(gcoord);
  let lat     = (0.5 - uv.y) * PI;
  let cos_lat = max(cos(lat), 0.15);
  var color   = vec3<f32>(0.0);

  for (var dy: i32 = -1; dy <= 1; dy++) {
    for (var dx: i32 = -1; dx <= 1; dx++) {
      var nc = cell + vec2<f32>(f32(dx), f32(dy));
      if (nc.y < 0.0 || nc.y >= GRID.y) { continue; }
      nc.x = nc.x - floor(nc.x / GRID.x) * GRID.x;
      let h           = star_hash2(nc);
      let cell_lat    = (0.5 - (nc.y + 0.5) / GRID.y) * PI;
      let star_thresh = 1.0 - 0.18 * max(cos(cell_lat), 0.0);
      if (h.x > star_thresh) {
        let off     = star_hash2(nc + vec2<f32>(7.3, 3.7)) * 0.8 + 0.1;
        let to_star = frac_uv - vec2<f32>(f32(dx), f32(dy)) - off;
        let ts_s    = vec2<f32>(to_star.x * cos_lat, to_star.y);
        let dist2   = dot(ts_s, ts_s);
        let glow    = exp(-dist2 * 500.0);
        if (glow < 0.002) { continue; }
        let mag  = pow(star_hash(nc + vec2<f32>(1.5, 0.0)), 1.8);
        let br   = glow * (0.15 + mag * 0.85);
        let roll = star_hash(nc + vec2<f32>(2.5, 0.0));
        var sc   = vec3<f32>(1.0);
        if      (roll < 0.06) { sc = vec3<f32>(0.65, 0.76, 1.0);  }
        else if (roll < 0.20) { sc = vec3<f32>(0.82, 0.89, 1.0);  }
        else if (roll < 0.44) { sc = vec3<f32>(1.0,  1.0,  0.82); }
        else if (roll < 0.57) { sc = vec3<f32>(1.0,  0.78, 0.51); }
        else if (roll < 0.64) { sc = vec3<f32>(1.0,  0.51, 0.25); }
        color += sc * br;
      }
    }
  }
  return color;
}

// ── ACES filmic ───────────────────────────────────────────────────────────────

fn aces_filmic(x: vec3<f32>) -> vec3<f32> {
  let a = 2.51; let b = 0.03; let c = 2.43; let d = 0.59; let e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), vec3<f32>(0.0), vec3<f32>(1.0));
}

// ── Fragment shader ───────────────────────────────────────────────────────────

@fragment
fn fs_main(in: VertOut) -> @location(0) vec4<f32> {
  let coord = vec2<i32>(in.pos.xy);

  // Debug AO mode — short-circuit everything else.
  if ((params.tonemap_flags & 2u) != 0u) {
    let ao = textureLoad(ao_tex, coord / 2, 0).r;
    return vec4<f32>(ao, ao, ao, 1.0);
  }

  // --- Underwater UV distortion ---
  var sample_uv = in.uv;
  if (params.is_underwater > 0.5) {
    let t = params.uw_time;
    let distort = vec2<f32>(
      sin(in.uv.y * 18.0 + t * 1.4) * 0.006,
      cos(in.uv.x * 14.0 + t * 1.1) * 0.004,
    );
    sample_uv = clamp(in.uv + distort, vec2<f32>(0.001), vec2<f32>(0.999));
  }

  // --- Sample HDR scene ---
  var scene = textureSample(hdr_tex, samp, sample_uv).rgb;

  let depth = textureLoad(dep_tex, coord, 0u);

  // --- Fog (skipped for sky pixels and when no fog mode is active) ---
  if (depth < 1.0 && (params.fog_flags & 3u) != 0u) {
    let ndc       = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, depth, 1.0);
    let world_h   = camera.invViewProj * ndc;
    let world_pos = world_h.xyz / world_h.w;
    let view_pos  = camera.view * vec4<f32>(world_pos, 1.0);
    let view_dist = length(view_pos.xyz);

    let sun_dir = normalize(-light.direction);
    let cam_h   = max(camera.position.y, 0.0);
    let atm_ro  = vec3<f32>(0.0, ATM_R_E + cam_h, 0.0);
    let ray_vec = world_pos - camera.position;
    let ray_dir = normalize(ray_vec);
    let h2      = vec3<f32>(ray_dir.x, 0.0, ray_dir.z);
    let len2    = dot(h2, h2);
    let fog_dir = select(normalize(h2), vec3<f32>(1.0, 0.0, 0.0), len2 < 1e-6);
    let fog_col = atm_scatter(atm_ro, fog_dir, sun_dir) * params.fog_color;

    var fog_amount = 0.0;
    if ((params.fog_flags & 1u) != 0u && params.depth_density > 0.0) {
      let far = select(params.depth_end, camera.far, params.depth_end <= 0.0);
      let t   = smoothstep(params.depth_begin, far, view_dist);
      fog_amount = max(fog_amount, pow(t, params.depth_curve) * params.depth_density);
    }
    if ((params.fog_flags & 2u) != 0u && params.height_density > 0.0) {
      let t = smoothstep(params.height_min, params.height_max, world_pos.y);
      fog_amount = max(fog_amount, pow(t, params.height_curve) * params.height_density);
    }
    scene = mix(scene, fog_col, clamp(fog_amount, 0.0, 1.0));
  }

  // --- Underwater tint + vignette ---
  if (params.is_underwater > 0.5) {
    scene = scene * vec3<f32>(0.20, 0.55, 0.90);
    let d = length(in.uv * 2.0 - 1.0);
    scene *= clamp(1.0 - d * d * 0.55, 0.0, 1.0);
  }

  // --- Exposure ---
  scene *= exposure.value;

  // --- Stars (sky pixels only, rendered after DoF/Bloom for crisp point sources) ---
  if (depth >= 1.0) {
    let ndc     = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, 1.0, 1.0);
    let world_h = star_uni.invViewProj * ndc;
    let ray_dir = normalize(world_h.xyz / world_h.w - star_uni.cam_pos);
    if (ray_dir.y > -0.05) {
      let night_t     = saturate((-star_uni.sun_dir.y - 0.05) * 10.0);
      let above_horiz = saturate(ray_dir.y * 20.0);
      let star_fade   = night_t * above_horiz;
      if (star_fade > 0.001) {
        scene += sample_stars(ray_dir) * (star_fade * 2.0);
      }
    }
  }

  // --- Tonemap + gamma ---
  if ((params.tonemap_flags & 4u) != 0u) {
    // HDR canvas mode: skip ACES, just gamma-encode.
    return vec4<f32>(pow(max(scene, vec3<f32>(0.0)), vec3<f32>(1.0 / 2.2)), 1.0);
  }
  let ldr = select(scene, aces_filmic(scene), (params.tonemap_flags & 1u) != 0u);
  return vec4<f32>(pow(ldr, vec3<f32>(1.0 / 2.2)), 1.0);
}
`,p=64,h=96;class m extends A{constructor(i,a,e,s,r,l,t=null){super();n(this,"name","CompositePass");n(this,"depthFogEnabled",!0);n(this,"depthDensity",1);n(this,"depthBegin",32);n(this,"depthEnd",128);n(this,"depthCurve",1.5);n(this,"heightFogEnabled",!1);n(this,"heightDensity",.7);n(this,"heightMin",48);n(this,"heightMax",80);n(this,"heightCurve",1);n(this,"fogColor",[1,1,1]);n(this,"_pipeline");n(this,"_bg0");n(this,"_bg1");n(this,"_bg2");n(this,"_paramsBuf");n(this,"_starBuf");n(this,"_paramsAB",new ArrayBuffer(p));n(this,"_paramsF",new Float32Array(this._paramsAB));n(this,"_paramsU",new Uint32Array(this._paramsAB));n(this,"_starScratch",new Float32Array(h/4));n(this,"outputView",null);this._pipeline=i,this._bg0=a,this._bg1=e,this._bg2=s,this._paramsBuf=r,this._starBuf=l,this.outputView=t}static create(i,a){const{device:e,format:s}=i,r=e.createBindGroupLayout({label:"CompositeBGL0",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),l=e.createBindGroupLayout({label:"CompositeBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),t=e.createBindGroupLayout({label:"CompositeBGL2",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),u=e.createSampler({label:"CompositeSampler",magFilter:"linear",minFilter:"linear"}),d=e.createBuffer({label:"CompositeParams",size:p,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),f=e.createBuffer({label:"CompositeStars",size:h,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),g=e.createBindGroup({label:"CompositeBG0",layout:r,entries:[{binding:0,resource:a.inputView},{binding:1,resource:a.aoView},{binding:2,resource:a.depthView},{binding:3,resource:u}]}),v=e.createBindGroup({label:"CompositeBG1",layout:l,entries:[{binding:0,resource:{buffer:a.cameraBuffer}},{binding:1,resource:{buffer:a.lightBuffer}}]}),b=e.createBindGroup({label:"CompositeBG2",layout:t,entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:{buffer:f}},{binding:2,resource:{buffer:a.exposureBuffer}}]}),_=e.createShaderModule({label:"CompositeShader",code:B}),y=e.createPipelineLayout({bindGroupLayouts:[r,l,t]}),x=e.createRenderPipeline({label:"CompositePipeline",layout:y,vertex:{module:_,entryPoint:"vs_main"},fragment:{module:_,entryPoint:"fs_main",targets:[{format:s}]},primitive:{topology:"triangle-list"}});return new m(x,g,v,b,d,f,a.outputView??null)}updateParams(i,a,e,s,r,l){const t=this._paramsF,u=this._paramsU;let d=0;this.depthFogEnabled&&(d|=1),this.heightFogEnabled&&(d|=2);let f=0;s&&(f|=1),r&&(f|=2),l&&(f|=4),t[0]=this.fogColor[0],t[1]=this.fogColor[1],t[2]=this.fogColor[2],t[3]=this.depthDensity,t[4]=this.depthBegin,t[5]=this.depthEnd,t[6]=this.depthCurve,t[7]=this.heightDensity,t[8]=this.heightMin,t[9]=this.heightMax,t[10]=this.heightCurve,u[11]=d,t[12]=e,t[13]=a?1:0,u[14]=f,t[15]=0,i.queue.writeBuffer(this._paramsBuf,0,this._paramsAB)}updateStars(i,a,e,s){const r=this._starScratch;r.set(a.data,0),r[16]=e.x,r[17]=e.y,r[18]=e.z,r[19]=0,r[20]=s.x,r[21]=s.y,r[22]=s.z,r[23]=0,i.queue.writeBuffer(this._starBuf,0,r.buffer)}execute(i,a){const e=i.beginRenderPass({label:"CompositePass",colorAttachments:[{view:this.outputView||a.backbufferView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});e.setPipeline(this._pipeline),e.setBindGroup(0,this._bg0),e.setBindGroup(1,this._bg1),e.setBindGroup(2,this._bg2),e.draw(3),e.end()}destroy(){this._paramsBuf.destroy(),this._starBuf.destroy()}}export{m as C};
