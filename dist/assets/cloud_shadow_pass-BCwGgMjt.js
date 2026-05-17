var Y=Object.defineProperty;var Z=(d,c,n)=>c in d?Y(d,c,{enumerable:!0,configurable:!0,writable:!0,value:n}):d[c]=n;var _=(d,c,n)=>Z(d,typeof c!="symbol"?c+"":c,n);import{P as D}from"./mesh-B_UY4euz.js";import{H as T}from"./deferred_lighting_pass-BZaHbbPw.js";function X(d,c,n){let e=(Math.imul(d,1664525)^Math.imul(c,1013904223)^Math.imul(n,22695477))>>>0;return e=Math.imul(e^e>>>16,73244475)>>>0,e=Math.imul(e^e>>>16,73244475)>>>0,((e^e>>>16)>>>0)/4294967295}function S(d,c,n,e){return X(d^e,c^e*7+3,n^e*13+5)}function M(d){return d*d*d*(d*(d*6-15)+10)}function W(d,c,n,e,t,r,a,o,i,s,l){const u=d+(c-d)*i,p=n+(e-n)*i,f=t+(r-t)*i,h=a+(o-a)*i,m=u+(p-u)*s,g=f+(h-f)*s;return m+(g-m)*l}const j=new Int8Array([1,-1,1,-1,1,-1,1,-1,0,0,0,0]),K=new Int8Array([1,1,-1,-1,0,0,0,0,1,-1,1,-1]),q=new Int8Array([0,0,0,0,1,1,-1,-1,1,1,-1,-1]);function v(d,c,n,e,t,r,a,o){const i=(d%e+e)%e,s=(c%e+e)%e,l=(n%e+e)%e,u=Math.floor(S(i,s,l,t)*12)%12;return j[u]*r+K[u]*a+q[u]*o}function J(d,c,n,e,t){const r=Math.floor(d),a=Math.floor(c),o=Math.floor(n),i=d-r,s=c-a,l=n-o,u=M(i),p=M(s),f=M(l);return W(v(r,a,o,e,t,i,s,l),v(r+1,a,o,e,t,i-1,s,l),v(r,a+1,o,e,t,i,s-1,l),v(r+1,a+1,o,e,t,i-1,s-1,l),v(r,a,o+1,e,t,i,s,l-1),v(r+1,a,o+1,e,t,i-1,s,l-1),v(r,a+1,o+1,e,t,i,s-1,l-1),v(r+1,a+1,o+1,e,t,i-1,s-1,l-1),u,p,f)}function Q(d,c,n,e,t,r){let a=0,o=.5,i=1,s=0;for(let l=0;l<e;l++)a+=J(d*i,c*i,n*i,t*i,r+l*17)*o,s+=o,o*=.5,i*=2;return Math.max(0,Math.min(1,a/s*.85+.5))}function b(d,c,n,e,t){const r=d*e,a=c*e,o=n*e,i=Math.floor(r),s=Math.floor(a),l=Math.floor(o);let u=1/0;for(let p=-1;p<=1;p++)for(let f=-1;f<=1;f++)for(let h=-1;h<=1;h++){const m=i+h,g=s+f,y=l+p,x=(m%e+e)%e,w=(g%e+e)%e,B=(y%e+e)%e,k=m+S(x,w,B,t),V=g+S(x,w,B,t+1),H=y+S(x,w,B,t+2),O=r-k,R=a-V,E=o-H,G=O*O+R*R+E*E;G<u&&(u=G)}return 1-Math.min(Math.sqrt(u),1)}function C(d,c,n,e){const t=d.createTexture({label:c,dimension:"3d",size:{width:n,height:n,depthOrArrayLayers:n},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return d.queue.writeTexture({texture:t},e.buffer,{bytesPerRow:n*4,rowsPerImage:n},{width:n,height:n,depthOrArrayLayers:n}),t}function ie(d){const n=new Uint8Array(1048576);for(let o=0;o<64;o++)for(let i=0;i<64;i++)for(let s=0;s<64;s++){const l=(o*64*64+i*64+s)*4,u=s/64,p=i/64,f=o/64,h=Q(u,p,f,4,4,0),m=b(u,p,f,2,100),g=b(u,p,f,4,200),y=b(u,p,f,8,300);n[l]=Math.round(h*255),n[l+1]=Math.round(m*255),n[l+2]=Math.round(g*255),n[l+3]=Math.round(y*255)}const e=32,t=new Uint8Array(e*e*e*4);for(let o=0;o<e;o++)for(let i=0;i<e;i++)for(let s=0;s<e;s++){const l=(o*e*e+i*e+s)*4,u=s/e,p=i/e,f=o/e,h=b(u,p,f,4,400),m=b(u,p,f,8,500),g=b(u,p,f,16,600);t[l]=Math.round(h*255),t[l+1]=Math.round(m*255),t[l+2]=Math.round(g*255),t[l+3]=255}const r=C(d,"CloudBaseNoise",64,n),a=C(d,"CloudDetailNoise",e,t);return{baseNoise:r,baseView:r.createView({dimension:"3d"}),detailNoise:a,detailView:a.createView({dimension:"3d"}),destroy(){r.destroy(),a.destroy()}}}const $=`// Cloud + sky pass — fullscreen triangle.
// Raymarches through a cloud slab with Beer's law transmittance and self-shadow
// light marching.  Sky color is computed with the same Rayleigh+Mie model as
// atmosphere.wgsl so no sky texture is needed.

const PI: f32 = 3.14159265358979323846;

// When set via pipeline-overridable constant, the pass outputs premultiplied
// (cloud_color, 1 - total_trans) — designed to blend over an already-lit HDR
// target.  In default mode the pass outputs the full sky + cloud composite.
override OVERLAY_MODE: bool = false;

// ---- Uniforms ----------------------------------------------------------------

struct CameraUniforms {
  invViewProj: mat4x4<f32>,
  position: vec3<f32>,
  near: f32,
  far: f32,
}

struct CloudUniforms {
  cloudBase: f32,
  cloudTop: f32,
  coverage: f32,
  density: f32,
  windOffset: vec2<f32>,
  anisotropy: f32,
  extinction: f32,
  ambientColor: vec3<f32>,
  exposure: f32,
}

struct LightUniforms {
  direction: vec3<f32>,
  intensity: f32,
  color: vec3<f32>,
  _pad: f32,
}

@group(0) @binding(0) var<uniform> camera: CameraUniforms;
@group(0) @binding(1) var<uniform> cloud : CloudUniforms;
@group(1) @binding(0) var<uniform> light : LightUniforms;
@group(2) @binding(0) var          depth_tex  : texture_depth_2d;
@group(2) @binding(1) var          depth_samp : sampler;
@group(3) @binding(0) var          base_noise  : texture_3d<f32>;
@group(3) @binding(1) var          detail_noise: texture_3d<f32>;
@group(3) @binding(2) var          noise_samp  : sampler;

// ---- Atmosphere (Rayleigh + Mie) for sky color ------------------------------

const R_E            : f32       = 6360000.0;
const R_A            : f32       = 6420000.0;
const H_R            : f32       = 8500.0;
const H_M            : f32       = 1200.0;
const G_ATM          : f32       = 0.758;
const BETA_R         : vec3<f32> = vec3<f32>(5.5e-6, 13.0e-6, 22.4e-6);
const BETA_M_ATM     : f32       = 21.0e-6;
const SUN_INTENSITY  : f32       = 20.0;
const SUN_COS_THRESH  : f32 = 0.999976;  // 10% larger angular radius than default
const MOON_COS_THRESH : f32 = 0.999978;  //  5% larger angular radius than default

fn ray_sphere(ro: vec3<f32>, rd: vec3<f32>, r: f32) -> vec2<f32> {
  let b = dot(ro, rd);
  let c = dot(ro, ro) - r * r;
  let d = b * b - c;
  if (d < 0.0) { return vec2<f32>(-1.0, -1.0); }
  let sq = sqrt(d);
  return vec2<f32>(-b - sq, -b + sq);
}

fn phase_r(mu: f32) -> f32 {
  return (3.0 / (16.0 * PI)) * (1.0 + mu * mu);
}

fn phase_m_atm(mu: f32) -> f32 {
  let g2 = G_ATM * G_ATM;
  return (3.0 / (8.0 * PI)) *
         ((1.0 - g2) * (1.0 + mu * mu)) /
         ((2.0 + g2) * pow(max(1.0 + g2 - 2.0 * G_ATM * mu, 1e-4), 1.5));
}

fn optical_depth_to_sky(pos: vec3<f32>, dir: vec3<f32>) -> vec2<f32> {
  let t  = ray_sphere(pos, dir, R_A);
  let ds = t.y / 4.0;
  var od = vec2<f32>(0.0);
  for (var i = 0; i < 4; i++) {
    let h = length(pos + dir * ((f32(i) + 0.5) * ds)) - R_E;
    if (h < 0.0) { break; }
    od += vec2<f32>(exp(-h / H_R), exp(-h / H_M)) * ds;
  }
  return od;
}

fn sky_transmittance(ro: vec3<f32>, rd: vec3<f32>) -> vec3<f32> {
  let od = optical_depth_to_sky(ro, rd);
  return exp(-(BETA_R * od.x + BETA_M_ATM * 1.1 * od.y));
}

fn scatter_sky(ro: vec3<f32>, rd: vec3<f32>, sun_dir: vec3<f32>) -> vec3<f32> {
  let ta   = ray_sphere(ro, rd, R_A);
  let tMin = max(ta.x, 0.0);
  if (ta.y < 0.0) { return vec3<f32>(0.0); }
  let tg   = ray_sphere(ro, rd, R_E);
  let tMax = select(ta.y, min(ta.y, tg.x), tg.x > 0.0);
  if (tMax <= tMin) { return vec3<f32>(0.0); }

  let mu = dot(rd, sun_dir);
  let pR = phase_r(mu);
  let pM = phase_m_atm(mu);
  let ds = (tMax - tMin) / 8.0;

  var sumR = vec3<f32>(0.0);
  var sumM = vec3<f32>(0.0);
  var odR  = 0.0;
  var odM  = 0.0;

  for (var i = 0; i < 8; i++) {
    let pos = ro + rd * (tMin + (f32(i) + 0.5) * ds);
    let h   = length(pos) - R_E;
    if (h < 0.0) { break; }
    let hrh = exp(-h / H_R) * ds;
    let hmh = exp(-h / H_M) * ds;
    odR += hrh;
    odM += hmh;
    let tg2 = ray_sphere(pos, sun_dir, R_E);
    if (tg2.x > 0.0) { continue; }
    let odL = optical_depth_to_sky(pos, sun_dir);
    let tau = BETA_R * (odR + odL.x) + BETA_M_ATM * 1.1 * (odM + odL.y);
    let T   = exp(-tau);
    sumR += T * hrh;
    sumM += T * hmh;
  }

  return SUN_INTENSITY * (BETA_R * pR * sumR + vec3<f32>(BETA_M_ATM) * pM * sumM);
}

// ---- Vertex shader -----------------------------------------------------------

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
  @location(0)       uv      : vec2<f32>,
}

@vertex
fn vs_main(@builtin(vertex_index) vid: u32) -> VertexOutput {
  let x = f32((vid & 1u) << 2u) - 1.0;
  let y = f32((vid & 2u) << 1u) - 1.0;
  var out: VertexOutput;
  out.clip_pos = vec4<f32>(x, y, 0.0, 1.0);
  out.uv       = vec2<f32>(x * 0.5 + 0.5, -y * 0.5 + 0.5);
  return out;
}

// ---- Cloud helpers -----------------------------------------------------------

// Rotate XZ around Y by ~37° so the Perlin noise grid doesn't align with world
// axes, which would otherwise produce visible hard edges along X=0 and Z=0.
const ROT_C: f32 = 0.79863551;
const ROT_S: f32 = 0.60181502;
fn rotate_xz(p: vec3<f32>) -> vec3<f32> {
  return vec3<f32>(p.x * ROT_C - p.z * ROT_S, p.y, p.x * ROT_S + p.z * ROT_C);
}

fn remap(v: f32, lo: f32, hi: f32, a: f32, b: f32) -> f32 {
  return a + saturate((v - lo) / max(hi - lo, 0.0001)) * (b - a);
}

fn height_gradient(y: f32) -> f32 {
  let t    = clamp((y - cloud.cloudBase) / max(cloud.cloudTop - cloud.cloudBase, 0.001), 0.0, 1.0);
  let base = remap(t, 0.0, 0.07, 0.0, 1.0);
  let top  = remap(t, 0.2, 1.0,  1.0, 0.0);
  return saturate(base * top);
}

fn hg_phase(cos_theta: f32, g: f32) -> f32 {
  let g2 = g * g;
  return (1.0 - g2) / (4.0 * PI * pow(1.0 + g2 - 2.0 * g * cos_theta, 1.5));
}

fn dual_phase(cos_theta: f32, g: f32) -> f32 {
  return 0.7 * hg_phase(cos_theta, g) + 0.3 * hg_phase(cos_theta, -0.25);
}

fn sample_pw(samp_uv: vec3<f32>) -> f32 {
  let s = textureSampleLevel(base_noise, noise_samp, samp_uv, 0.0);
  let w = s.g * 0.5 + s.b * 0.35 + s.a * 0.15;
  return remap(s.r, 1.0 - w, 1.0, 0.0, 1.0);
}

fn sample_density(p: vec3<f32>) -> f32 {
  let wind = vec3<f32>(cloud.windOffset.x, 0.0, cloud.windOffset.y);
  let pr = rotate_xz(rotate_xz(p));
  // Large-scale pass (3× coarser) — creates some very big cloud masses.
  // Drifts at half wind speed for natural differential parallax with smaller clouds.
  let pw_large = sample_pw((pr + wind * 0.5) * 0.012);
  // Medium-scale pass — smaller individual clouds.
  let pw_med = sample_pw((pr + wind) * 0.04);
  // Blend: large scale dominates shape; medium adds smaller clouds in sparser areas.
  let pw = pw_large * 0.6 + pw_med * 0.4;
  let hg = height_gradient(p.y);
  let cov = saturate(remap(pw, 1.0 - cloud.coverage, 1.0, 0.0, 1.0)) * hg;
  if (cov < 0.001) { return 0.0; }
  let detail_uv = pr * 0.12 + wind * 0.1;
  let det = textureSampleLevel(detail_noise, noise_samp, detail_uv, 0.0);
  let detail = det.r * 0.5 + det.g * 0.25 + det.b * 0.125;
  return max(0.0, cov - (1.0 - cov) * detail * 0.3) * cloud.density;
}

fn sample_density_coarse(p: vec3<f32>) -> f32 {
  let wind     = vec3<f32>(cloud.windOffset.x, 0.0, cloud.windOffset.y);
  let pr       = rotate_xz(p);
  let pw_large = sample_pw((pr + wind * 0.5) * 0.012);
  let pw_med   = sample_pw((pr + wind) * 0.04);
  let pw       = pw_large * 0.6 + pw_med * 0.4;
  let hg       = height_gradient(p.y);
  return saturate(remap(pw, 1.0 - cloud.coverage, 1.0, 0.0, 1.0)) * hg * cloud.density;
}

fn light_march(p: vec3<f32>, sun_dir: vec3<f32>) -> f32 {
  let step_size = (cloud.cloudTop - cloud.cloudBase) / 2.0;
  var opt_depth = 0.0;
  for (var i = 0; i < 2; i++) {
    let sp = p + sun_dir * (f32(i) + 0.5) * step_size;
    if (sp.y < cloud.cloudBase || sp.y > cloud.cloudTop) { continue; }
    opt_depth += sample_density_coarse(sp) * step_size;
  }
  return exp(-opt_depth * cloud.extinction);
}

fn ray_slab(ro: vec3<f32>, rd: vec3<f32>, y_min: f32, y_max: f32) -> vec2<f32> {
  if (abs(rd.y) < 1e-6) {
    if (ro.y < y_min || ro.y > y_max) {
      return vec2<f32>(-1.0, -1.0);
    }
    return vec2<f32>(0.0, 1e9);
  }
  let t0 = (y_min - ro.y) / rd.y;
  let t1 = (y_max - ro.y) / rd.y;
  let t_near = min(t0, t1);
  let t_far  = max(t0, t1);
  if (t_far < 0.0) {
    return vec2<f32>(-1.0, -1.0);
  }
  return vec2<f32>(max(t_near, 0.0), t_far);
}

// ---- Fragment shader ---------------------------------------------------------

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let ndc     = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, 1.0, 1.0);
  let world_h = camera.invViewProj * ndc;
  let ray_dir = normalize(world_h.xyz / world_h.w - camera.position);

  let sun_dir = normalize(-light.direction);
  let camH    = max(camera.position.y, 1.0);
  let atm_ro  = vec3<f32>(0.0, R_E + camH, 0.0);
  // Atmosphere already drew sky+discs behind us in overlay mode — skip the work.
  var sky_color = vec3<f32>(0.0);
  if (!OVERLAY_MODE) {
    sky_color = scatter_sky(atm_ro, ray_dir, sun_dir);
  }

  // Clip ray at scene geometry
  let geo_depth = textureLoad(depth_tex, vec2<i32>(in.clip_pos.xy), 0);
  var geo_dist  = 1e9;
  if (geo_depth < 1.0) {
    let ndc_geo = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, geo_depth, 1.0);
    let geo_h   = camera.invViewProj * ndc_geo;
    let geo_pos = geo_h.xyz / geo_h.w;
    geo_dist    = distance(geo_pos, camera.position);
  }

  let moon_dir  = -sun_dir;
  let night_t   = saturate((-sun_dir.y - 0.05) * 10.0);

  // Intersect ray with cloud slab
  let slab = ray_slab(camera.position, ray_dir, cloud.cloudBase, cloud.cloudTop);
  if (slab.x < 0.0 || slab.x > geo_dist) {
    if (OVERLAY_MODE) { return vec4<f32>(0.0, 0.0, 0.0, 0.0); }
    var color = sky_color;
    if (dot(ray_dir, sun_dir) > SUN_COS_THRESH && geo_depth >= 1.0) {
      color += sky_transmittance(atm_ro, sun_dir) * 1000.0;
    }
    if (dot(ray_dir, moon_dir) > MOON_COS_THRESH && geo_depth >= 1.0) {
      color += sky_transmittance(atm_ro, moon_dir) * vec3<f32>(0.85, 0.90, 1.0) * 15.0 * night_t;
    }
    return vec4<f32>(color, 1.0);
  }

  let t_end  = min(min(slab.y, geo_dist), 200.0);
  if (t_end <= slab.x) {
    if (OVERLAY_MODE) { return vec4<f32>(0.0, 0.0, 0.0, 0.0); }
    return vec4<f32>(sky_color, 1.0);
  }

  // Primary ray march (24 steps, IGN jitter for TAA)
  let step_size = (t_end - slab.x) / 24.0;
  let coord     = vec2<i32>(in.clip_pos.xy);
  let jitter    = fract(52.9829189 * fract(0.06711056 * f32(coord.x) + 0.00583715 * f32(coord.y)));
  let t_start   = slab.x + jitter * step_size;
  let cos_theta = dot(ray_dir, sun_dir);
  let phase     = dual_phase(cos_theta, cloud.anisotropy);

  var cloud_color = vec3<f32>(0.0);
  var total_trans = 1.0;

  for (var i = 0; i < 24; i++) {
    let t = t_start + f32(i) * step_size;
    if (t >= t_end) { break; }
    let p = camera.position + ray_dir * t;

    let dens = sample_density(p);
    if (dens < 0.001) { continue; }

    let shadow_t    = light_march(p, sun_dir);
    let height_frac = clamp((p.y - cloud.cloudBase) / max(cloud.cloudTop - cloud.cloudBase, 0.001), 0.0, 1.0);

    let sun_energy = light.color * light.intensity * shadow_t * phase;
    let amb_energy = cloud.ambientColor * mix(0.5, 1.0, height_frac);

    let opt    = dens * cloud.extinction * step_size;
    let t_step = exp(-opt);

    cloud_color += (sun_energy + amb_energy) * (1.0 - t_step) * total_trans;
    total_trans *= t_step;

    if (total_trans < 0.01) { break; }
  }

  if (OVERLAY_MODE) {
    return vec4<f32>(cloud_color, 1.0 - total_trans);
  }
  var final_color = cloud_color + sky_color * total_trans;
  if (dot(ray_dir, sun_dir) > SUN_COS_THRESH && geo_depth >= 1.0) {
    final_color += sky_transmittance(atm_ro, sun_dir) * total_trans * 1000.0;
  }
  if (dot(ray_dir, moon_dir) > MOON_COS_THRESH && geo_depth >= 1.0) {
    final_color += sky_transmittance(atm_ro, moon_dir) * total_trans * vec3<f32>(0.85, 0.90, 1.0) * 15.0 * night_t;
  }
  return vec4<f32>(final_color, 1.0);
}
`,A=96,P=48,U=32;class z extends D{constructor(n,e,t,r,a,o,i,s,l,u,p){super();_(this,"name","CloudPass");_(this,"_device");_(this,"_pipeline");_(this,"_overlayPipeline");_(this,"_cameraBuffer");_(this,"_cloudBuffer");_(this,"_lightBuffer");_(this,"_sceneBg");_(this,"_lightBg");_(this,"_depthBgl");_(this,"_noiseSkyBg");_(this,"_depthSampler");_(this,"_cameraScratch",new Float32Array(A/4));_(this,"_lightScratch",new Float32Array(U/4));_(this,"_settingsScratch",new Float32Array(P/4));this._device=n,this._pipeline=e,this._overlayPipeline=t,this._cameraBuffer=r,this._cloudBuffer=a,this._lightBuffer=o,this._sceneBg=i,this._lightBg=s,this._depthBgl=l,this._noiseSkyBg=u,this._depthSampler=p}static create(n,e){const{device:t}=n,r=t.createBuffer({label:"CloudCameraBuffer",size:A,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),a=t.createBuffer({label:"CloudUniformBuffer",size:P,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),o=t.createBuffer({label:"CloudLightBuffer",size:U,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),i=t.createBindGroupLayout({label:"CloudSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),s=t.createBindGroupLayout({label:"CloudLightBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),l=t.createBindGroupLayout({label:"CloudDepthBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),u=t.createBindGroupLayout({label:"CloudNoiseSkyBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),p=t.createSampler({label:"CloudNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"mirror-repeat",addressModeV:"mirror-repeat",addressModeW:"mirror-repeat"}),f=t.createSampler({label:"CloudDepthSampler"}),h=t.createBindGroup({label:"CloudSceneBG",layout:i,entries:[{binding:0,resource:{buffer:r}},{binding:1,resource:{buffer:a}}]}),m=t.createBindGroup({label:"CloudLightBG",layout:s,entries:[{binding:0,resource:{buffer:o}}]}),g=t.createBindGroup({label:"CloudNoiseSkyBG",layout:u,entries:[{binding:0,resource:e.baseView},{binding:1,resource:e.detailView},{binding:2,resource:p}]}),y=n.createShaderModule($,"CloudShader"),x=t.createPipelineLayout({bindGroupLayouts:[i,s,l,u]}),w=t.createRenderPipeline({label:"CloudPipeline",layout:x,vertex:{module:y,entryPoint:"vs_main"},fragment:{module:y,entryPoint:"fs_main",targets:[{format:T}]},primitive:{topology:"triangle-list"}}),B=t.createRenderPipeline({label:"CloudOverlayPipeline",layout:x,vertex:{module:y,entryPoint:"vs_main"},fragment:{module:y,entryPoint:"fs_main",constants:{OVERLAY_MODE:1},targets:[{format:T,blend:{color:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},primitive:{topology:"triangle-list"}});return new z(t,w,B,r,a,o,h,m,l,g,f)}updateCamera(n){const e=n.activeCamera;if(!e)throw new Error("CloudPass.updateCamera: ctx.activeCamera is null");const t=e.position(),r=this._cameraScratch;r.set(e.inverseViewProjectionMatrix().data,0),r[16]=t.x,r[17]=t.y,r[18]=t.z,r[19]=e.near,r[20]=e.far,n.queue.writeBuffer(this._cameraBuffer,0,r.buffer)}updateLight(n,e,t,r){const a=this._lightScratch;a[0]=e.x,a[1]=e.y,a[2]=e.z,a[3]=r,a[4]=t.x,a[5]=t.y,a[6]=t.z,n.queue.writeBuffer(this._lightBuffer,0,a.buffer)}updateSettings(n,e){const t=this._settingsScratch;t[0]=e.cloudBase,t[1]=e.cloudTop,t[2]=e.coverage,t[3]=e.density,t[4]=e.windOffset[0],t[5]=e.windOffset[1],t[6]=e.anisotropy,t[7]=e.extinction,t[8]=e.ambientColor[0],t[9]=e.ambientColor[1],t[10]=e.ambientColor[2],t[11]=e.exposure,n.queue.writeBuffer(this._cloudBuffer,0,t.buffer)}addToGraph(n,e){const{ctx:t}=n,r=!!e.overlay;if(r&&!e.hdr)throw new Error("CloudPass: overlay mode requires an hdr input");const a=!!e.hdr;let o=e.hdr??void 0,i;return n.addPass(this.name,"render",s=>{a||(o=s.createTexture({label:"cloud.hdr",format:T,width:t.width,height:t.height,extraUsage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC})),i=s.write(o,"attachment",{loadOp:a?"load":"clear",storeOp:"store",clearValue:[0,0,0,1]}),s.read(e.depth,"sampled"),s.setExecute((l,u)=>{const p=this._device.createBindGroup({label:"CloudDepthBG",layout:this._depthBgl,entries:[{binding:0,resource:u.getTextureView(e.depth)},{binding:1,resource:this._depthSampler}]}),f=l.renderPassEncoder;f.setPipeline(r?this._overlayPipeline:this._pipeline),f.setBindGroup(0,this._sceneBg),f.setBindGroup(1,this._lightBg),f.setBindGroup(2,p),f.setBindGroup(3,this._noiseSkyBg),f.draw(3)})}),{hdr:i}}destroy(){this._cameraBuffer.destroy(),this._cloudBuffer.destroy(),this._lightBuffer.destroy()}}const ee=`// Cloud shadow pass — renders a top-down cloud transmittance map (1024×1024 r8unorm).
// For each texel, marches 32 steps vertically through the cloud slab and accumulates
// optical depth, then outputs Beer's-law transmittance.

const PI: f32 = 3.14159265358979323846;

const ROT_C: f32 = 0.79863551;
const ROT_S: f32 = 0.60181502;
fn rotate_xz(p: vec3<f32>) -> vec3<f32> {
  return vec3<f32>(p.x * ROT_C - p.z * ROT_S, p.y, p.x * ROT_S + p.z * ROT_C);
}

struct CloudShadowUniforms {
  cloudBase    : f32,
  cloudTop     : f32,
  coverage     : f32,
  density      : f32,
  windOffset   : vec2<f32>,   // XZ animated offset
  worldOriginX : f32,         // world-space XZ center of the shadow map
  worldOriginZ : f32,
  worldExtent  : f32,         // half-size in world units (map covers ±worldExtent)
  extinction   : f32,
  _pad0        : f32,
  _pad1        : f32,
}

@group(0) @binding(0) var<uniform> params     : CloudShadowUniforms;
@group(1) @binding(0) var          base_noise  : texture_3d<f32>;
@group(1) @binding(1) var          detail_noise: texture_3d<f32>;
@group(1) @binding(2) var          noise_samp  : sampler;

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
  @location(0)       uv      : vec2<f32>,
}

@vertex
fn vs_main(@builtin(vertex_index) vid: u32) -> VertexOutput {
  let x = f32((vid & 1u) << 2u) - 1.0;
  let y = f32((vid & 2u) << 1u) - 1.0;
  var out: VertexOutput;
  out.clip_pos = vec4<f32>(x, y, 0.0, 1.0);
  out.uv       = vec2<f32>(x * 0.5 + 0.5, -y * 0.5 + 0.5);
  return out;
}

fn remap(v: f32, lo: f32, hi: f32, a: f32, b: f32) -> f32 {
  return clamp(a + (v - lo) / max(hi - lo, 0.0001) * (b - a), a, b);
}

fn height_gradient(y: f32) -> f32 {
  let t = clamp((y - params.cloudBase) / max(params.cloudTop - params.cloudBase, 0.001), 0.0, 1.0);
  let base = remap(t, 0.0, 0.07, 0.0, 1.0);
  let top  = remap(t, 0.2, 1.0,  1.0, 0.0);
  return saturate(base * top);
}

fn sample_density(world_pos: vec3<f32>) -> f32 {
  let pr = rotate_xz(world_pos);
  let scale = 0.04;
  let base_uv = (pr + vec3<f32>(params.windOffset.x, 0.0, params.windOffset.y)) * scale;
  let base = textureSampleLevel(base_noise, noise_samp, base_uv, 0.0);

  // Perlin-Worley blend
  let pw = base.r * 0.625 + (1.0 - base.g) * 0.25 + (1.0 - base.b) * 0.125;
  let hg = height_gradient(world_pos.y);
  let cov = saturate(remap(pw, 1.0 - params.coverage, 1.0, 0.0, 1.0)) * hg;
  if (cov < 0.001) { return 0.0; }

  let detail_scale = 0.12;
  let detail_uv = pr * detail_scale + vec3<f32>(params.windOffset.x, 0.0, params.windOffset.y) * 0.1;
  let det = textureSampleLevel(detail_noise, noise_samp, detail_uv, 0.0);
  let detail = det.r * 0.5 + det.g * 0.25 + det.b * 0.125;

  return max(0.0, cov - (1.0 - cov) * detail * 0.3) * params.density;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  // Map UV to world XZ position
  let world_x = params.worldOriginX + (in.uv.x - 0.5) * params.worldExtent * 2.0;
  let world_z = params.worldOriginZ + (in.uv.y - 0.5) * params.worldExtent * 2.0;

  let slab_h = params.cloudTop - params.cloudBase;
  let step_h = slab_h / 16.0;

  var opt_depth = 0.0;
  for (var i = 0; i < 16; i++) {
    let y = params.cloudBase + (f32(i) + 0.5) * step_h;
    opt_depth += sample_density(vec3<f32>(world_x, y, world_z)) * step_h;
  }

  let transmittance = exp(-opt_depth * params.extinction);
  return vec4<f32>(transmittance, 0.0, 0.0, 1.0);
}
`,N=1024,F="r8unorm",L=48,te="cloud:shadow",ne={label:"CloudShadowTexture",format:F,width:N,height:N};class I extends D{constructor(n,e,t,r){super();_(this,"name","CloudShadowPass");_(this,"_pipeline");_(this,"_uniformBuffer");_(this,"_uniformBg");_(this,"_noiseBg");_(this,"_frameCount",0);_(this,"_data",new Float32Array(L/4));this._pipeline=n,this._uniformBuffer=e,this._uniformBg=t,this._noiseBg=r}static create(n,e){const{device:t}=n,r=t.createBuffer({label:"CloudShadowUniform",size:L,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),a=t.createBindGroupLayout({label:"CloudShadowUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),o=t.createBindGroupLayout({label:"CloudShadowNoiseBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),i=t.createSampler({label:"CloudNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"mirror-repeat",addressModeV:"mirror-repeat",addressModeW:"mirror-repeat"}),s=t.createBindGroup({label:"CloudShadowUniformBG",layout:a,entries:[{binding:0,resource:{buffer:r}}]}),l=t.createBindGroup({label:"CloudShadowNoiseBG",layout:o,entries:[{binding:0,resource:e.baseView},{binding:1,resource:e.detailView},{binding:2,resource:i}]}),u=n.createShaderModule(ee,"CloudShadowShader"),p=t.createRenderPipeline({label:"CloudShadowPipeline",layout:t.createPipelineLayout({bindGroupLayouts:[a,o]}),vertex:{module:u,entryPoint:"vs_main"},fragment:{module:u,entryPoint:"fs_main",targets:[{format:F}]},primitive:{topology:"triangle-list"}});return new I(p,r,s,l)}update(n,e,t,r){this._data[0]=e.cloudBase,this._data[1]=e.cloudTop,this._data[2]=e.coverage,this._data[3]=e.density,this._data[4]=e.windOffset[0],this._data[5]=e.windOffset[1],this._data[6]=t[0],this._data[7]=t[1],this._data[8]=r,this._data[9]=e.extinction,n.queue.writeBuffer(this._uniformBuffer,0,this._data.buffer)}addToGraph(n){const e=n.importPersistentTexture(te,ne);let t;return n.addPass(this.name,"render",r=>{t=r.write(e,"attachment",{loadOp:"load",storeOp:"store"}),r.setExecute(a=>{if(this._frameCount++%2!==0)return;const o=a.renderPassEncoder;o.setPipeline(this._pipeline),o.setBindGroup(0,this._uniformBg),o.setBindGroup(1,this._noiseBg),o.draw(3)})}),{shadow:t}}destroy(){this._uniformBuffer.destroy()}}export{I as C,z as a,ie as c};
