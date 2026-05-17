var ge=Object.defineProperty;var he=(n,a,t)=>a in n?ge(n,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[a]=t;var c=(n,a,t)=>he(n,typeof a!="symbol"?a+"":a,t);import{P as Z}from"./mesh-B_UY4euz.js";import{H as V}from"./deferred_lighting_pass-BZaHbbPw.js";import{G as Q,a as ve,b as xe}from"./block_geometry_pass-AbvsKQeg.js";const be=`// IBL baking — two compute entry points share the same bind group layout.
//
// cs_irradiance : cosine-weighted hemisphere integral for diffuse irradiance.
// cs_prefilter  : GGX importance-sampled integral for specular pre-filtered env.
//
// Both sample the sky equirectangular texture and write to one face of a cube
// texture (6 dispatches per roughness level, one face per dispatch).

const PI      : f32 = 3.14159265358979323846;
const SAMPLES : u32 = 256u;

struct IblParams {
  exposure  : f32,
  roughness : f32,   // ignored by cs_irradiance
  face      : f32,   // cube face index 0-5 (written as float, cast to u32)
  _pad      : f32,
}

@group(0) @binding(0) var<uniform> params   : IblParams;
@group(0) @binding(1) var          sky_tex  : texture_2d<f32>;
@group(0) @binding(2) var          sky_samp : sampler;
@group(1) @binding(0) var          out_tex  : texture_storage_2d<rgba16float, write>;

// ---- Helpers ----------------------------------------------------------------

fn equirect_uv(dir: vec3<f32>) -> vec2<f32> {
  let u = atan2(-dir.z, dir.x) / (2.0 * PI) + 0.5;
  let v = acos(clamp(dir.y, -1.0, 1.0)) / PI;
  return vec2<f32>(u, v);
}

// Van der Corput radical inverse (base 2) — low-discrepancy quasi-random sequence
fn radical_inverse(n: u32) -> f32 {
  var bits = (n << 16u) | (n >> 16u);
  bits = ((bits & 0x55555555u) << 1u) | ((bits >> 1u) & 0x55555555u);
  bits = ((bits & 0x33333333u) << 2u) | ((bits >> 2u) & 0x33333333u);
  bits = ((bits & 0x0f0f0f0fu) << 4u) | ((bits >> 4u) & 0x0f0f0f0fu);
  bits = ((bits & 0x00ff00ffu) << 8u) | ((bits >> 8u) & 0x00ff00ffu);
  return f32(bits) * 2.3283064365386963e-10;
}

// Tangent frame around N — columns are (T, B, N), so TBN * local = world.
fn tangent_frame(N: vec3<f32>) -> mat3x3<f32> {
  let up = select(vec3<f32>(1.0, 0.0, 0.0), vec3<f32>(0.0, 1.0, 0.0), abs(N.y) < 0.999);
  let T  = normalize(cross(up, N));
  let B  = cross(N, T);
  return mat3x3<f32>(T, B, N);
}

// Convert cube face + normalized UV in [-1,1] to a world-space direction.
// Uses the standard WebGPU/OpenGL cubemap face convention.
fn cube_dir(face: u32, uc: f32, vc: f32) -> vec3<f32> {
  switch face {
    case 0u: { return normalize(vec3<f32>( 1.0, -vc, -uc)); }  // +X
    case 1u: { return normalize(vec3<f32>(-1.0, -vc,  uc)); }  // -X
    case 2u: { return normalize(vec3<f32>( uc,   1.0,  vc)); }  // +Y
    case 3u: { return normalize(vec3<f32>( uc,  -1.0, -vc)); }  // -Y
    case 4u: { return normalize(vec3<f32>( uc,  -vc,  1.0)); }  // +Z
    default: { return normalize(vec3<f32>(-uc,  -vc, -1.0)); }  // -Z
  }
}

// ---- Irradiance (diffuse IBL) -----------------------------------------------
//
// E(N) = (1/N) Σ L(ωi)   with cosine-weighted PDF = cosθ/π  (estimator = L)

@compute @workgroup_size(8, 8)
fn cs_irradiance(@builtin(global_invocation_id) gid: vec3<u32>) {
  let size = textureDimensions(out_tex);
  if (gid.x >= size.x || gid.y >= size.y) { return; }

  let uc = 2.0 * (f32(gid.x) + 0.5) / f32(size.x) - 1.0;
  let vc = 2.0 * (f32(gid.y) + 0.5) / f32(size.y) - 1.0;
  let N  = cube_dir(u32(params.face), uc, vc);
  let TBN = tangent_frame(N);

  var rgb = vec3<f32>(0.0);
  for (var i = 0u; i < SAMPLES; i++) {
    let xi1  = (f32(i) + 0.5) / f32(SAMPLES);
    let xi2  = radical_inverse(i);
    let sinT = sqrt(xi1);
    let cosT = sqrt(1.0 - xi1);
    let phi2 = xi2 * 2.0 * PI;
    let L    = TBN * vec3<f32>(sinT*cos(phi2), sinT*sin(phi2), cosT);
    rgb     += textureSampleLevel(sky_tex, sky_samp, equirect_uv(L), 0.0).rgb;
  }

  textureStore(out_tex, vec2<i32>(gid.xy),
    vec4<f32>(rgb * params.exposure / f32(SAMPLES), 1.0));
}

// ---- Pre-filtered environment (specular IBL) ---------------------------------
//
// Integrates L(ω) weighted by GGX NDF at params.roughness using importance sampling.

@compute @workgroup_size(8, 8)
fn cs_prefilter(@builtin(global_invocation_id) gid: vec3<u32>) {
  let size = textureDimensions(out_tex);
  if (gid.x >= size.x || gid.y >= size.y) { return; }

  let uc = 2.0 * (f32(gid.x) + 0.5) / f32(size.x) - 1.0;
  let vc = 2.0 * (f32(gid.y) + 0.5) / f32(size.y) - 1.0;
  let N  = cube_dir(u32(params.face), uc, vc);
  let TBN = tangent_frame(N);

  let a  = params.roughness * params.roughness;
  let a2 = a * a;

  var sumRGB = vec3<f32>(0.0);
  var sumW   = 0.0;
  for (var i = 0u; i < SAMPLES; i++) {
    let xi1   = (f32(i) + 0.5) / f32(SAMPLES);
    let xi2   = radical_inverse(i);
    let cosT2 = (1.0 - xi2) / (1.0 + (a2 - 1.0) * xi2);
    let cosT  = sqrt(cosT2);
    let sinT  = sqrt(max(0.0, 1.0 - cosT2));
    let phiH  = xi1 * 2.0 * PI;
    let H     = TBN * vec3<f32>(sinT*cos(phiH), sinT*sin(phiH), cosT);
    let VdotH = cosT; // V = N in the split-sum approximation
    let L     = 2.0 * VdotH * H - N;
    let NdotL = max(0.0, dot(N, L));
    if (NdotL <= 0.0) { continue; }
    sumRGB += textureSampleLevel(sky_tex, sky_samp, equirect_uv(L), 0.0).rgb * NdotL;
    sumW   += NdotL;
  }

  let w = select(sumW, 1.0, sumW <= 0.0);
  textureStore(out_tex, vec2<i32>(gid.xy),
    vec4<f32>(sumRGB / w * params.exposure, 1.0));
}
`,H=5,Y=128,$=32,ye=[0,.25,.5,.75,1],Pe=Math.PI;function we(n){let a=n>>>0;return a=(a<<16|a>>>16)>>>0,a=((a&1431655765)<<1|a>>>1&1431655765)>>>0,a=((a&858993459)<<2|a>>>2&858993459)>>>0,a=((a&252645135)<<4|a>>>4&252645135)>>>0,a=((a&16711935)<<8|a>>>8&16711935)>>>0,a*23283064365386963e-26}function Be(n,a,t){const e=new Float32Array(n*a*4);for(let r=0;r<a;r++)for(let o=0;o<n;o++){const l=(o+.5)/n,u=(r+.5)/a,f=u*u,s=f*f,_=Math.sqrt(1-l*l),d=l;let i=0,p=0;for(let h=0;h<t;h++){const P=(h+.5)/t,y=we(h),w=(1-y)/(1+(s-1)*y),B=Math.sqrt(w),x=Math.sqrt(Math.max(0,1-w)),S=2*Pe*P,C=x*Math.cos(S),M=B,E=_*C+d*M;if(E<=0)continue;const I=2*E*M-d,m=Math.max(0,I),b=Math.max(0,B);if(m<=0)continue;const G=s/2,T=l/(l*(1-G)+G),O=m/(m*(1-G)+G),R=T*O*E/(b*l),L=Math.pow(1-E,5);i+=R*(1-L),p+=R*L}const g=(r*n+o)*4;e[g+0]=i/t,e[g+1]=p/t,e[g+2]=0,e[g+3]=1}return e}function Se(n){const a=new Float32Array([n]),t=new Uint32Array(a.buffer)[0],e=t>>31&1,r=t>>23&255,o=t&8388607;if(r===255)return e<<15|31744|(o?1:0);if(r===0)return e<<15;const l=r-127+15;return l>=31?e<<15|31744:l<=0?e<<15:e<<15|l<<10|o>>13}function Ge(n){const a=new Uint16Array(n.length);for(let t=0;t<n.length;t++)a[t]=Se(n[t]);return a}const J=new WeakMap;function Ue(n){const a=J.get(n);if(a)return a;const t=Ge(Be(64,64,512)),e=n.createTexture({label:"IBL BRDF LUT",size:{width:64,height:64},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return n.queue.writeTexture({texture:e},t,{bytesPerRow:64*8},{width:64,height:64}),J.set(n,e),e}const ee=new WeakMap;function Te(n){const a=ee.get(n);if(a)return a;const t=n.createBindGroupLayout({label:"IblBGL0",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.COMPUTE,sampler:{type:"filtering"}}]}),e=n.createBindGroupLayout({label:"IblBGL1",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"2d"}}]}),r=n.createPipelineLayout({bindGroupLayouts:[t,e]}),o=n.createShaderModule({label:"IblCompute",code:be}),l=n.createComputePipeline({label:"IblIrradiancePipeline",layout:r,compute:{module:o,entryPoint:"cs_irradiance"}}),u=n.createComputePipeline({label:"IblPrefilterPipeline",layout:r,compute:{module:o,entryPoint:"cs_prefilter"}}),f=n.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"clamp-to-edge"}),s={irrPipeline:l,pfPipeline:u,bgl0:t,bgl1:e,sampler:f};return ee.set(n,s),s}async function Ke(n,a,t=.2){const{irrPipeline:e,pfPipeline:r,bgl0:o,bgl1:l,sampler:u}=Te(n),f=n.createTexture({label:"IBL Irradiance",size:{width:$,height:$,depthOrArrayLayers:6},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),s=n.createTexture({label:"IBL Prefiltered",size:{width:Y,height:Y,depthOrArrayLayers:6},mipLevelCount:H,format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),_=(m,b)=>{const G=n.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return n.queue.writeBuffer(G,0,new Float32Array([t,m,b,0])),G},d=a.createView(),i=m=>n.createBindGroup({layout:o,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:d},{binding:2,resource:u}]}),p=m=>n.createBindGroup({layout:l,entries:[{binding:0,resource:m}]}),g=Array.from({length:6},(m,b)=>_(0,b)),h=ye.flatMap((m,b)=>Array.from({length:6},(G,T)=>_(m,T))),P=g.map(i),y=h.map(i),w=Array.from({length:6},(m,b)=>p(f.createView({dimension:"2d",baseArrayLayer:b,arrayLayerCount:1}))),B=Array.from({length:H*6},(m,b)=>{const G=Math.floor(b/6),T=b%6;return p(s.createView({dimension:"2d",baseMipLevel:G,mipLevelCount:1,baseArrayLayer:T,arrayLayerCount:1}))}),x=n.createCommandEncoder({label:"IblComputeEncoder"}),S=x.beginComputePass({label:"IblComputePass"});S.setPipeline(e);for(let m=0;m<6;m++)S.setBindGroup(0,P[m]),S.setBindGroup(1,w[m]),S.dispatchWorkgroups(Math.ceil($/8),Math.ceil($/8));S.setPipeline(r);for(let m=0;m<H;m++){const b=Y>>m;for(let G=0;G<6;G++)S.setBindGroup(0,y[m*6+G]),S.setBindGroup(1,B[m*6+G]),S.dispatchWorkgroups(Math.ceil(b/8),Math.ceil(b/8))}S.end(),n.queue.submit([x.finish()]),await n.queue.onSubmittedWorkDone(),g.forEach(m=>m.destroy()),h.forEach(m=>m.destroy());const C=Ue(n),M=f.createView({dimension:"cube"}),E=s.createView({dimension:"cube"}),I=C.createView();return{irradiance:f,prefiltered:s,brdfLut:C,irradianceView:M,prefilteredView:E,brdfLutView:I,levels:H,destroy(){f.destroy(),s.destroy()}}}const Me=`// Screen-Space Global Illumination — ray march pass.
// Cosine-weighted hemisphere rays in view space; hits sample previous frame's lit scene.

struct SSGIUniforms {
  view        : mat4x4<f32>,   // offset   0
  proj        : mat4x4<f32>,   // offset  64
  inv_proj    : mat4x4<f32>,   // offset 128
  invViewProj : mat4x4<f32>,   // offset 192
  prevViewProj: mat4x4<f32>,   // offset 256
  camPos      : vec3<f32>,     // offset 320
  numRays     : u32,           // offset 332
  numSteps    : u32,           // offset 336
  radius      : f32,           // offset 340
  thickness   : f32,           // offset 344
  strength    : f32,           // offset 348
  frameIndex  : u32,           // offset 352
}                              // stride 368 (padded to align 16)

@group(0) @binding(0) var<uniform> u: SSGIUniforms;

@group(1) @binding(0) var depth_tex    : texture_depth_2d;
@group(1) @binding(1) var normal_tex   : texture_2d<f32>;
@group(1) @binding(2) var prev_radiance: texture_2d<f32>;
@group(1) @binding(3) var noise_tex    : texture_2d<f32>;
@group(1) @binding(4) var lin_samp     : sampler;

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

fn view_pos_at(uv: vec2<f32>, depth: f32) -> vec3<f32> {
  let ndc = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);
  let h   = u.inv_proj * ndc;
  return h.xyz / h.w;
}

@fragment
fn fs_ssgi(in: VertexOutput) -> @location(0) vec4<f32> {
  let coord = vec2<i32>(in.clip_pos.xy);
  let depth = textureLoad(depth_tex, coord, 0);
  if (depth >= 1.0) { return vec4<f32>(0.0); }

  let vp = view_pos_at(in.uv, depth);

  // World normal → view space
  let nm      = textureLoad(normal_tex, coord, 0);
  let N_world = normalize(nm.rgb * 2.0 - 1.0);
  let N_vs    = normalize((u.view * vec4<f32>(N_world, 0.0)).xyz);

  // Per-pixel TBN from tiled 4×4 noise (cos/sin rotation angle in rg)
  let noise_coord = coord % vec2<i32>(4, 4);
  let noise_val   = textureLoad(noise_tex, noise_coord, 0).rg;
  let cos_a = noise_val.x * 2.0 - 1.0;
  let sin_a = noise_val.y * 2.0 - 1.0;

  var up = vec3<f32>(0.0, 1.0, 0.0);
  if (abs(N_vs.y) > 0.99) { up = vec3<f32>(1.0, 0.0, 0.0); }
  let T_raw = normalize(cross(up, N_vs));
  let B_raw = cross(N_vs, T_raw);
  // Rotate tangent frame by per-pixel noise angle
  let T = cos_a * T_raw - sin_a * B_raw;
  let B = sin_a * T_raw + cos_a * B_raw;

  let screen_dim = vec2<f32>(textureDimensions(depth_tex));
  let screen_i   = vec2<i32>(screen_dim);
  var accum = vec3<f32>(0.0);
  let nr    = f32(u.numRays);
  let ns    = f32(u.numSteps);

  for (var i = 0u; i < u.numRays; i++) {
    // Cosine-weighted hemisphere with golden-ratio temporal jitter
    let phi       = 6.28318530 * fract(f32(i) / nr + f32(u.frameIndex) * 0.618033988);
    let ur        = fract(f32(u.frameIndex * u.numRays + i) * 0.381966011);
    let cos_theta = sqrt(ur);
    let sin_theta = sqrt(max(0.0, 1.0 - cos_theta * cos_theta));
    let ray_local = vec3<f32>(sin_theta * cos(phi), sin_theta * sin(phi), cos_theta);
    let ray_vs    = T * ray_local.x + B * ray_local.y + N_vs * ray_local.z;

    for (var s = 0u; s < u.numSteps; s++) {
      let t  = (f32(s) + 1.0) / ns;
      let p  = vp + ray_vs * (u.radius * t);
      if (p.z >= 0.0) { break; } // stepped behind the camera

      let clip  = u.proj * vec4<f32>(p, 1.0);
      let inv_w = 1.0 / clip.w;
      let ray_uv = vec2<f32>(
         clip.x * inv_w * 0.5 + 0.5,
        -clip.y * inv_w * 0.5 + 0.5,
      );
      if (any(ray_uv < vec2<f32>(0.0)) || any(ray_uv > vec2<f32>(1.0))) { break; }

      // Depth at ray UV (nearest texel to avoid sampler type restrictions)
      let ray_tc       = clamp(vec2<i32>(ray_uv * screen_dim), vec2<i32>(0), screen_i - vec2<i32>(1));
      let stored_depth = textureLoad(depth_tex, ray_tc, 0);
      if (stored_depth >= 1.0) { continue; } // hit sky — keep stepping

      let stored_h = u.inv_proj * vec4<f32>(ray_uv.x * 2.0 - 1.0, 1.0 - ray_uv.y * 2.0, stored_depth, 1.0);
      let stored_z = stored_h.z / stored_h.w;

      // View-space Z is negative in front; hit when ray just passed behind surface.
      if (p.z < stored_z && stored_z - p.z < u.thickness) {
        accum += textureSampleLevel(prev_radiance, lin_samp, ray_uv, 0.0).rgb;
        break;
      }
    }
  }

  return vec4<f32>(accum * u.strength / nr, 1.0);
}
`,Ee=`// Screen-Space Global Illumination — temporal accumulation pass.
// Reprojects SSGI into previous frame, AABB-clamps, blends 10% new / 90% history.

struct SSGIUniforms {
  view        : mat4x4<f32>,
  proj        : mat4x4<f32>,
  inv_proj    : mat4x4<f32>,
  invViewProj : mat4x4<f32>,
  prevViewProj: mat4x4<f32>,
  camPos      : vec3<f32>,
  numRays     : u32,
  numSteps    : u32,
  radius      : f32,
  thickness   : f32,
  strength    : f32,
  frameIndex  : u32,
}

@group(0) @binding(0) var<uniform> u: SSGIUniforms;

@group(1) @binding(0) var raw_ssgi    : texture_2d<f32>;
@group(1) @binding(1) var ssgi_history: texture_2d<f32>;
@group(1) @binding(2) var depth_tex   : texture_depth_2d;
@group(1) @binding(3) var lin_samp    : sampler;

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

@fragment
fn fs_temporal(in: VertexOutput) -> @location(0) vec4<f32> {
  let coord   = vec2<i32>(in.clip_pos.xy);
  let current = textureLoad(raw_ssgi, coord, 0).rgb;

  // Sky pixels carry no indirect irradiance
  let depth = textureLoad(depth_tex, coord, 0);
  if (depth >= 1.0) { return vec4<f32>(0.0); }

  // Reproject to previous frame
  let ndc       = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, depth, 1.0);
  let world_h   = u.invViewProj * ndc;
  let world_pos = world_h.xyz / world_h.w;
  let prev_clip = u.prevViewProj * vec4<f32>(world_pos, 1.0);
  let prev_uv   = vec2<f32>(
     prev_clip.x / prev_clip.w * 0.5 + 0.5,
    -prev_clip.y / prev_clip.w * 0.5 + 0.5,
  );

  // Disocclusion or out-of-frame: trust current sample fully
  if (any(prev_uv < vec2<f32>(0.0)) || any(prev_uv > vec2<f32>(1.0))) {
    return vec4<f32>(current, 1.0);
  }

  // AABB clamp: 3×3 neighbourhood min/max of raw SSGI prevents ghosting
  let dim = vec2<i32>(textureDimensions(raw_ssgi));
  var nb_min = vec3<f32>(1e9);
  var nb_max = vec3<f32>(-1e9);
  for (var dy = -1; dy <= 1; dy++) {
    for (var dx = -1; dx <= 1; dx++) {
      let nc = clamp(coord + vec2<i32>(dx, dy), vec2<i32>(0), dim - vec2<i32>(1));
      let s  = textureLoad(raw_ssgi, nc, 0).rgb;
      nb_min = min(nb_min, s);
      nb_max = max(nb_max, s);
    }
  }

  let history         = textureSampleLevel(ssgi_history, lin_samp, prev_uv, 0.0).rgb;
  let history_clamped = clamp(history, nb_min, nb_max);

  // 10% new / 90% history → effective ~40-sample average with 4 rays/frame
  return vec4<f32>(mix(history_clamped, current, 0.1), 1.0);
}
`,te=368,Le={numRays:4,numSteps:16,radius:3,thickness:.5,strength:1},Ce="ssgi:history";function Ie(){const n=new Uint8Array(new ArrayBuffer(64));for(let a=0;a<16;a++){const t=Math.random()*Math.PI*2;n[a*4+0]=Math.round((Math.cos(t)*.5+.5)*255),n[a*4+1]=Math.round((Math.sin(t)*.5+.5)*255),n[a*4+2]=128,n[a*4+3]=255}return n}class se extends Z{constructor(t,e,r,o,l,u,f,s,_){super();c(this,"name","SSGIPass");c(this,"_uniformBuffer");c(this,"_noiseTex");c(this,"_noiseView");c(this,"_ssgiPipeline");c(this,"_temporalPipeline");c(this,"_ssgiTexBgl");c(this,"_tempTexBgl");c(this,"_uniformBg");c(this,"_sampler");c(this,"_settings",Le);c(this,"_frameIndex",0);c(this,"_scratch",new Float32Array(te/4));c(this,"_scratchU32",new Uint32Array(this._scratch.buffer));this._uniformBuffer=t,this._noiseTex=e,this._noiseView=r,this._ssgiPipeline=o,this._temporalPipeline=l,this._ssgiTexBgl=u,this._tempTexBgl=f,this._uniformBg=s,this._sampler=_}static create(t){const{device:e}=t,r=e.createBuffer({label:"SSGIUniforms",size:te,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),o=e.createTexture({label:"SSGINoise",size:{width:4,height:4},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});e.queue.writeTexture({texture:o},Ie(),{bytesPerRow:4*4,rowsPerImage:4},{width:4,height:4});const l=e.createSampler({label:"SSGILinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),u=e.createBindGroupLayout({label:"SSGIUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),f=e.createBindGroupLayout({label:"SSGITexBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),s=e.createBindGroupLayout({label:"SSGITempTexBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),_=e.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:r}}]}),d=t.createShaderModule(Me,"SSGIShader"),i=t.createShaderModule(Ee,"SSGITempShader"),p=e.createRenderPipeline({label:"SSGIPipeline",layout:e.createPipelineLayout({bindGroupLayouts:[u,f]}),vertex:{module:d,entryPoint:"vs_main"},fragment:{module:d,entryPoint:"fs_ssgi",targets:[{format:V}]},primitive:{topology:"triangle-list"}}),g=e.createRenderPipeline({label:"SSGITempPipeline",layout:e.createPipelineLayout({bindGroupLayouts:[u,s]}),vertex:{module:i,entryPoint:"vs_main"},fragment:{module:i,entryPoint:"fs_temporal",targets:[{format:V}]},primitive:{topology:"triangle-list"}});return new se(r,o,o.createView(),p,g,f,s,_,l)}updateCamera(t){const e=t.activeCamera;if(!e)throw new Error("SSGIPass.updateCamera: ctx.activeCamera is null");const r=e.position(),o=this._scratch;o.set(e.viewMatrix().data,0),o.set(e.projectionMatrix().data,16),o.set(e.inverseProjectionMatrix().data,32),o.set(e.inverseViewProjectionMatrix().data,48),o.set(e.previousViewProjectionMatrix().data,64),o[80]=r.x,o[81]=r.y,o[82]=r.z;const l=this._scratchU32;l[83]=this._settings.numRays,l[84]=this._settings.numSteps,o[85]=this._settings.radius,o[86]=this._settings.thickness,o[87]=this._settings.strength,l[88]=this._frameIndex++,t.queue.writeBuffer(this._uniformBuffer,0,o.buffer)}updateSettings(t){this._settings={...this._settings,...t}}addToGraph(t,e){const{ctx:r}=t,o={format:V,width:r.width,height:r.height},l=t.importPersistentTexture(Ce,{...o,label:"SSGIHistory"});let u,f;return t.addPass("SSGIPass.rayMarch","render",s=>{u=s.createTexture({label:"SSGIRaw",...o}),u=s.write(u,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[0,0,0,0]}),s.read(e.depth,"sampled"),s.read(e.normal,"sampled"),s.read(e.prevRadiance,"sampled"),s.setExecute((_,d)=>{const i=d.getOrCreateBindGroup({layout:this._ssgiTexBgl,entries:[{binding:0,resource:d.getTextureView(e.depth)},{binding:1,resource:d.getTextureView(e.normal)},{binding:2,resource:d.getTextureView(e.prevRadiance)},{binding:3,resource:this._noiseView},{binding:4,resource:this._sampler}]}),p=_.renderPassEncoder;p.setPipeline(this._ssgiPipeline),p.setBindGroup(0,this._uniformBg),p.setBindGroup(1,i),p.draw(3)})}),t.addPass("SSGIPass.temporal","render",s=>{f=s.createTexture({label:"SSGIResult",...o,extraUsage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),f=s.write(f,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[0,0,0,0]}),s.read(u,"sampled"),s.read(l,"sampled"),s.read(e.depth,"sampled"),s.setExecute((_,d)=>{const i=d.getOrCreateBindGroup({layout:this._tempTexBgl,entries:[{binding:0,resource:d.getTextureView(u)},{binding:1,resource:d.getTextureView(l)},{binding:2,resource:d.getTextureView(e.depth)},{binding:3,resource:this._sampler}]}),p=_.renderPassEncoder;p.setPipeline(this._temporalPipeline),p.setBindGroup(0,this._uniformBg),p.setBindGroup(1,i),p.draw(3)})}),t.addPass("SSGIPass.copyHistory","transfer",s=>{s.read(f,"copy-src"),s.write(l,"copy-dst"),s.setExecute((_,d)=>{_.commandEncoder.copyTextureToTexture({texture:d.getTexture(f)},{texture:d.getTexture(l)},{width:r.width,height:r.height})})}),{result:f}}destroy(){this._uniformBuffer.destroy(),this._noiseTex.destroy()}}const oe=`
struct Particle {
  position : vec3<f32>,  // offset  0
  life     : f32,        // offset 12  (-1 = dead)
  velocity : vec3<f32>,  // offset 16
  max_life : f32,        // offset 28
  color    : vec4<f32>,  // offset 32
  size     : f32,        // offset 48
  rotation : f32,        // offset 52
  _pad     : vec2<f32>,  // offset 56
}                        // total: 64 bytes

struct ComputeUniforms {
  world_pos     : vec3<f32>,
  spawn_count   : u32,
  world_quat    : vec4<f32>,
  spawn_offset  : u32,
  max_particles : u32,
  frame_seed    : u32,
  _pad0         : u32,
  dt            : f32,
  time          : f32,
  _pad1         : vec2<f32>,
  spawn_color   : vec4<f32>,
}

fn pcg_hash(v: u32) -> u32 {
  let state = v * 747796405u + 2891336453u;
  let word  = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
  return (word >> 22u) ^ word;
}

fn rand_f32(seed: u32) -> f32 {
  return f32(pcg_hash(seed)) / 4294967295.0;
}

fn rand_range(lo: f32, hi: f32, seed: u32) -> f32 {
  return lo + rand_f32(seed) * (hi - lo);
}

fn quat_rotate(q: vec4<f32>, v: vec3<f32>) -> vec3<f32> {
  let t = 2.0 * cross(q.xyz, v);
  return v + q.w * t + cross(q.xyz, t);
}

// Uniform sample in a spherical cap of half-angle acos(cos_max) around +Y.
fn sample_cone(seed0: u32, seed1: u32, cos_max: f32) -> vec3<f32> {
  let cos_theta = mix(cos_max, 1.0, rand_f32(seed0));
  let sin_theta = sqrt(max(0.0, 1.0 - cos_theta * cos_theta));
  let phi       = rand_f32(seed1) * 6.28318530717958647;
  return vec3<f32>(sin_theta * cos(phi), cos_theta, sin_theta * sin(phi));
}

// 3-component gradient noise helpers for curl noise
fn hash3(p: vec3<f32>) -> vec3<f32> {
  var q = vec3<f32>(
    dot(p, vec3<f32>(127.1, 311.7, 74.7)),
    dot(p, vec3<f32>(269.5, 183.3, 246.1)),
    dot(p, vec3<f32>(113.5,  271.9, 124.6)),
  );
  return fract(sin(q) * 43758.5453123);
}

fn noise3(p: vec3<f32>) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(dot(hash3(i + vec3(0.,0.,0.)) * 2.0 - 1.0, f - vec3(0.,0.,0.)),
            dot(hash3(i + vec3(1.,0.,0.)) * 2.0 - 1.0, f - vec3(1.,0.,0.)), u.x),
        mix(dot(hash3(i + vec3(0.,1.,0.)) * 2.0 - 1.0, f - vec3(0.,1.,0.)),
            dot(hash3(i + vec3(1.,1.,0.)) * 2.0 - 1.0, f - vec3(1.,1.,0.)), u.x), u.y),
    mix(mix(dot(hash3(i + vec3(0.,0.,1.)) * 2.0 - 1.0, f - vec3(0.,0.,1.)),
            dot(hash3(i + vec3(1.,0.,1.)) * 2.0 - 1.0, f - vec3(1.,0.,1.)), u.x),
        mix(dot(hash3(i + vec3(0.,1.,1.)) * 2.0 - 1.0, f - vec3(0.,1.,1.)),
            dot(hash3(i + vec3(1.,1.,1.)) * 2.0 - 1.0, f - vec3(1.,1.,1.)), u.x), u.y), u.z);
}

fn curl_noise(p: vec3<f32>) -> vec3<f32> {
  let e  = 0.1;
  let ex = vec3<f32>(e,   0.0, 0.0);
  let ey = vec3<f32>(0.0, e,   0.0);
  let ez = vec3<f32>(0.0, 0.0, e  );
  // Three decorrelated potential fields: Fx=noise3(p), Fy=noise3(p+o1), Fz=noise3(p+o2)
  let o1 = vec3<f32>(31.416, 27.183, 14.142);
  let o2 = vec3<f32>(62.832, 54.366, 28.284);
  // curl(F).x = dFz/dy - dFy/dz
  let cx = (noise3(p + o2 + ey) - noise3(p + o2 - ey))
         - (noise3(p + o1 + ez) - noise3(p + o1 - ez));
  // curl(F).y = dFx/dz - dFz/dx
  let cy = (noise3(p + ez)      - noise3(p - ez))
         - (noise3(p + o2 + ex) - noise3(p + o2 - ex));
  // curl(F).z = dFy/dx - dFx/dy
  let cz = (noise3(p + o1 + ex) - noise3(p + o1 - ex))
         - (noise3(p + ey)      - noise3(p - ey));
  return vec3<f32>(cx, cy, cz) / (2.0 * e);
}

// FBM curl noise: sums octaves at increasing frequencies / decreasing amplitudes.
// Normalized so output magnitude matches single-octave curl_noise.
fn curl_noise_fbm(p: vec3<f32>, octaves: i32) -> vec3<f32> {
  var result    = vec3<f32>(0.0);
  var freq      = 1.0;
  var amp       = 0.5;
  var total_amp = 0.0;
  for (var o = 0; o < octaves; o++) {
    result    += curl_noise(p * freq) * amp;
    total_amp += amp;
    freq      *= 2.0;
    amp       *= 0.5;
  }
  return result / total_amp;
}
`;function Oe(n){switch(n.kind){case"sphere":{const a=Math.cos(n.solidAngle).toFixed(6),t=n.radius.toFixed(6);return`{
  let dir = sample_cone(seed + 10u, seed + 11u, ${a});
  let world_dir = quat_rotate(uniforms.world_quat, dir);
  p.position = uniforms.world_pos + world_dir * ${t};
  p.velocity = world_dir * speed;
}`}case"cone":{const a=Math.cos(n.angle).toFixed(6),t=n.radius.toFixed(6);return`{
  let dir = sample_cone(seed + 10u, seed + 11u, ${a});
  let world_dir = quat_rotate(uniforms.world_quat, dir);
  p.position = uniforms.world_pos + world_dir * ${t};
  p.velocity = world_dir * speed;
}`}case"box":{const[a,t,e]=n.halfExtents.map(r=>r.toFixed(6));return`{
  let local_off = vec3<f32>(
    (rand_f32(seed + 10u) * 2.0 - 1.0) * ${a},
    (rand_f32(seed + 11u) * 2.0 - 1.0) * ${t},
    (rand_f32(seed + 12u) * 2.0 - 1.0) * ${e},
  );
  let up = quat_rotate(uniforms.world_quat, vec3<f32>(0.0, 1.0, 0.0));
  p.position = uniforms.world_pos + quat_rotate(uniforms.world_quat, local_off);
  p.velocity = up * speed;
}`}}}function ce(n){switch(n.type){case"gravity":return`p.velocity.y -= ${n.strength.toFixed(6)} * uniforms.dt;`;case"drag":return`p.velocity -= p.velocity * ${n.coefficient.toFixed(6)} * uniforms.dt;`;case"force":{const[a,t,e]=n.direction.map(r=>r.toFixed(6));return`p.velocity += vec3<f32>(${a}, ${t}, ${e}) * ${n.strength.toFixed(6)} * uniforms.dt;`}case"swirl_force":{const a=n.speed.toFixed(6),t=n.strength.toFixed(6);return`{
  let swirl_angle = uniforms.time * ${a};
  p.velocity += vec3<f32>(cos(swirl_angle), 0.0, sin(swirl_angle)) * ${t} * uniforms.dt;
}`}case"vortex":return`{
  let vx_radial = p.position.xz - uniforms.world_pos.xz;
  p.velocity += vec3<f32>(-vx_radial.y, 0.0, vx_radial.x) * ${n.strength.toFixed(6)} * uniforms.dt;
}`;case"curl_noise":{const a=n.octaves??1,t=a>1?`curl_noise_fbm(cn_pos, ${a})`:"curl_noise(cn_pos)";return`{
  let cn_pos = p.position * ${n.scale.toFixed(6)} + uniforms.time * ${n.timeScale.toFixed(6)};
  p.velocity += ${t} * ${n.strength.toFixed(6)} * uniforms.dt;
}`}case"size_random":return`p.size = rand_range(${n.min.toFixed(6)}, ${n.max.toFixed(6)}, pcg_hash(idx * 2654435761u));`;case"size_over_lifetime":return`p.size = mix(${n.start.toFixed(6)}, ${n.end.toFixed(6)}, t);`;case"color_over_lifetime":{const[a,t,e,r]=n.startColor.map(s=>s.toFixed(6)),[o,l,u,f]=n.endColor.map(s=>s.toFixed(6));return`p.color = mix(vec4<f32>(${a}, ${t}, ${e}, ${r}), vec4<f32>(${o}, ${l}, ${u}, ${f}), t);`}case"block_collision":return`{
  let _bc_uv = (p.position.xz - vec2<f32>(hm.origin_x, hm.origin_z)) / (hm.extent * 2.0) + 0.5;
  if (all(_bc_uv >= vec2<f32>(0.0)) && all(_bc_uv <= vec2<f32>(1.0))) {
    let _bc_xi = clamp(u32(_bc_uv.x * f32(hm.resolution)), 0u, hm.resolution - 1u);
    let _bc_zi = clamp(u32(_bc_uv.y * f32(hm.resolution)), 0u, hm.resolution - 1u);
    if (p.position.y <= hm_data[_bc_zi * hm.resolution + _bc_xi]) {
      particles[idx].life = -1.0; return;
    }
  }
}`}}function ue(n,a){return n?n.filter(t=>t.trigger===a).flatMap(t=>t.actions.map(ce)).join(`
  `):""}function Re(n){const{emitter:a,events:t}=n,[e,r]=a.lifetime.map(s=>s.toFixed(6)),[o,l]=a.initialSpeed.map(s=>s.toFixed(6)),[u,f]=a.initialSize.map(s=>s.toFixed(6));return`
${oe}

@group(0) @binding(0) var<storage, read_write> particles  : array<Particle>;
@group(0) @binding(1) var<storage, read_write> alive_list : array<u32>;
@group(0) @binding(2) var<storage, read_write> counter    : atomic<u32>;
@group(0) @binding(3) var<storage, read_write> indirect   : array<u32>;
@group(1) @binding(0) var<uniform>             uniforms   : ComputeUniforms;

@compute @workgroup_size(64)
fn cs_main(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (gid.x >= uniforms.spawn_count) { return; }

  let idx  = (uniforms.spawn_offset + gid.x) % uniforms.max_particles;
  // Use the globally unique cumulative spawn index as the seed so consecutive frames
  // never collide on gid.x + frame_seed = (gid.x+1) + (frame_seed-1).
  let seed = pcg_hash(uniforms.spawn_offset + gid.x);

  let speed = rand_range(${o}, ${l}, seed + 1u);

  var p: Particle;
  p.life     = 0.0;
  p.max_life = rand_range(${e}, ${r}, seed + 2u);
  p.color    = uniforms.spawn_color;
  p.size     = rand_range(${u}, ${f}, seed + 3u);
  p.rotation = rand_f32(seed + 4u) * 6.28318530717958647;

  ${Oe(a.shape)}

  ${ue(t,"on_spawn")}

  particles[idx] = p;
}
`}function ze(n){return n.modifiers.some(a=>a.type==="block_collision")}const Fe=`
struct HeightmapUniforms {
  origin_x  : f32,
  origin_z  : f32,
  extent    : f32,
  resolution: u32,
}
@group(2) @binding(0) var<storage, read> hm_data: array<f32>;
@group(2) @binding(1) var<uniform>       hm     : HeightmapUniforms;
`;function Ve(n){const a=n.modifiers.some(r=>r.type==="block_collision"),t=n.modifiers.map(ce).join(`
  `),e=ue(n.events,"on_death");return`
${oe}
${a?Fe:""}

@group(0) @binding(0) var<storage, read_write> particles  : array<Particle>;
@group(0) @binding(1) var<storage, read_write> alive_list : array<u32>;
@group(0) @binding(2) var<storage, read_write> counter    : atomic<u32>;
@group(0) @binding(3) var<storage, read_write> indirect   : array<u32>;
@group(1) @binding(0) var<uniform>             uniforms   : ComputeUniforms;

@compute @workgroup_size(64)
fn cs_main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let idx = gid.x;
  if (idx >= uniforms.max_particles) { return; }

  var p = particles[idx];
  if (p.life < 0.0) { return; }

  p.life += uniforms.dt;
  if (p.life >= p.max_life) {
    ${e}
    particles[idx].life = -1.0;
    return;
  }

  let t = p.life / p.max_life;

  ${t}

  p.position += p.velocity * uniforms.dt;
  particles[idx] = p;
}
`}const Ae=`// Compact pass — rebuilds alive_list and writes indirect draw instance count.
// Two entry points used as two sequential dispatches within one compute pass:
//   cs_compact      — ceil(maxParticles/64) workgroups, fills alive_list
//   cs_write_indirect — 1 workgroup, copies alive_count → indirect.instanceCount

struct Particle {
  position : vec3<f32>,
  life     : f32,
  velocity : vec3<f32>,
  max_life : f32,
  color    : vec4<f32>,
  size     : f32,
  rotation : f32,
  _pad     : vec2<f32>,
}

struct CompactUniforms {
  max_particles: u32,
  _pad0        : u32,
  _pad1        : u32,
  _pad2        : u32,
}

@group(0) @binding(0) var<storage, read>       particles  : array<Particle>;
@group(0) @binding(1) var<storage, read_write> alive_list : array<u32>;
@group(0) @binding(2) var<storage, read_write> counter    : atomic<u32>;
@group(0) @binding(3) var<storage, read_write> indirect   : array<u32>;
@group(1) @binding(0) var<uniform>             uniforms   : CompactUniforms;

@compute @workgroup_size(64)
fn cs_compact(@builtin(global_invocation_id) gid: vec3<u32>) {
  let idx = gid.x;
  if (idx >= uniforms.max_particles) { return; }
  if (particles[idx].life < 0.0) { return; }
  let slot = atomicAdd(&counter, 1u);
  alive_list[slot] = idx;
}

@compute @workgroup_size(1)
fn cs_write_indirect() {
  // indirect layout: [vertexCount, instanceCount, firstVertex, firstInstance]
  indirect[1] = atomicLoad(&counter);
}
`,Ne=`// Particle GBuffer render pass — camera-facing billboard quads.
// Each instance reads one alive particle and writes to the deferred GBuffer.
// Normal is the billboard face direction (toward camera) for deferred lighting.

struct Particle {
  position : vec3<f32>,
  life     : f32,
  velocity : vec3<f32>,
  max_life : f32,
  color    : vec4<f32>,
  size     : f32,
  rotation : f32,
  _pad     : vec2<f32>,
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

struct ParticleRenderUniforms {
  roughness : f32,
  metallic  : f32,
  _pad      : vec2<f32>,
}

@group(0) @binding(0) var<storage, read> particles  : array<Particle>;
@group(0) @binding(1) var<storage, read> alive_list : array<u32>;
@group(1) @binding(0) var<uniform>       camera     : CameraUniforms;
@group(2) @binding(0) var<uniform>       mat_params : ParticleRenderUniforms;

struct VertexOutput {
  @builtin(position) clip_pos  : vec4<f32>,
  @location(0)       color     : vec4<f32>,
  @location(1)       uv        : vec2<f32>,
  @location(2)       world_pos : vec3<f32>,
  @location(3)       face_norm : vec3<f32>,
}

// 2-triangle quad: 6 vertex positions in [-0.5, 0.5]²
fn quad_offset(vid: u32) -> vec2<f32> {
  switch vid {
    case 0u: { return vec2<f32>(-0.5, -0.5); }
    case 1u: { return vec2<f32>( 0.5, -0.5); }
    case 2u: { return vec2<f32>(-0.5,  0.5); }
    case 3u: { return vec2<f32>( 0.5, -0.5); }
    case 4u: { return vec2<f32>( 0.5,  0.5); }
    default: { return vec2<f32>(-0.5,  0.5); }
  }
}

fn quad_uv(vid: u32) -> vec2<f32> {
  switch vid {
    case 0u: { return vec2<f32>(0.0, 1.0); }
    case 1u: { return vec2<f32>(1.0, 1.0); }
    case 2u: { return vec2<f32>(0.0, 0.0); }
    case 3u: { return vec2<f32>(1.0, 1.0); }
    case 4u: { return vec2<f32>(1.0, 0.0); }
    default: { return vec2<f32>(0.0, 0.0); }
  }
}

@vertex
fn vs_main(
  @builtin(vertex_index)   vid: u32,
  @builtin(instance_index) iid: u32,
) -> VertexOutput {
  let p_idx = alive_list[iid];
  let p     = particles[p_idx];

  // Camera right and up from the view matrix rows (column-major storage)
  let cam_right = vec3<f32>(camera.view[0].x, camera.view[1].x, camera.view[2].x);
  let cam_up    = vec3<f32>(camera.view[0].y, camera.view[1].y, camera.view[2].y);

  // Rotate quad corner around particle center using particle.rotation angle
  let ofs    = quad_offset(vid);
  let c      = cos(p.rotation);
  let s      = sin(p.rotation);
  let rotated = vec2<f32>(c * ofs.x - s * ofs.y, s * ofs.x + c * ofs.y);

  let world_pos = p.position
    + cam_right * rotated.x * p.size
    + cam_up    * rotated.y * p.size;

  let face_norm = normalize(camera.position - p.position);

  var out: VertexOutput;
  out.clip_pos  = camera.viewProj * vec4<f32>(world_pos, 1.0);
  out.color     = p.color;
  out.uv        = quad_uv(vid);
  out.world_pos = world_pos;
  out.face_norm = face_norm;
  return out;
}

struct GBufferOutput {
  @location(0) albedo_roughness : vec4<f32>,  // rgba8unorm
  @location(1) normal_metallic  : vec4<f32>,  // rgba16float
}

@fragment
fn fs_main(in: VertexOutput) -> GBufferOutput {
  // Circular clip for round particles
  let d = length(in.uv - 0.5) * 2.0;
  if (d > 1.0) { discard; }

  // Encode world-space normal as [0,1]
  let N = normalize(in.face_norm);

  var out: GBufferOutput;
  out.albedo_roughness = vec4<f32>(in.color.rgb, mat_params.roughness);
  out.normal_metallic  = vec4<f32>(N * 0.5 + 0.5, mat_params.metallic);
  return out;
}
`,De=`// Particle forward HDR render pass — velocity-aligned billboard quads.
// Writes directly to the HDR buffer with alpha blending.
// Used for transparent effects like rain, smoke, sparks.

struct Particle {
  position : vec3<f32>,
  life     : f32,
  velocity : vec3<f32>,
  max_life : f32,
  color    : vec4<f32>,
  size     : f32,
  rotation : f32,
  _pad     : vec2<f32>,
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

@group(0) @binding(0) var<storage, read> particles  : array<Particle>;
@group(0) @binding(1) var<storage, read> alive_list : array<u32>;
@group(1) @binding(0) var<uniform>       camera     : CameraUniforms;

struct VertexOutput {
  @builtin(position) clip_pos : vec4<f32>,
  @location(0)       color    : vec4<f32>,
  @location(1)       uv       : vec2<f32>,
}

// Quad UV: x in [-0.5, 0.5], y in [-0.5, 0.5].
// y=−0.5 is the tail (toward velocity), y=+0.5 is the head.
fn quad_offset(vid: u32) -> vec2<f32> {
  switch vid {
    case 0u: { return vec2<f32>(-0.5, -0.5); }
    case 1u: { return vec2<f32>( 0.5, -0.5); }
    case 2u: { return vec2<f32>(-0.5,  0.5); }
    case 3u: { return vec2<f32>( 0.5, -0.5); }
    case 4u: { return vec2<f32>( 0.5,  0.5); }
    default: { return vec2<f32>(-0.5,  0.5); }
  }
}

fn quad_uv(vid: u32) -> vec2<f32> {
  switch vid {
    case 0u: { return vec2<f32>(0.0, 1.0); }
    case 1u: { return vec2<f32>(1.0, 1.0); }
    case 2u: { return vec2<f32>(0.0, 0.0); }
    case 3u: { return vec2<f32>(1.0, 1.0); }
    case 4u: { return vec2<f32>(1.0, 0.0); }
    default: { return vec2<f32>(0.0, 0.0); }
  }
}

@vertex
fn vs_main(
  @builtin(vertex_index)   vid: u32,
  @builtin(instance_index) iid: u32,
) -> VertexOutput {
  let p_idx = alive_list[iid];
  let p     = particles[p_idx];

  let ofs = quad_offset(vid);

  // Velocity-aligned billboard: long axis follows velocity direction.
  let vel     = p.velocity;
  let spd     = length(vel);
  let vel_dir = select(vec3<f32>(0.0, 1.0, 0.0), vel / max(spd, 0.001), spd > 0.001);
  let cam_dir = normalize(camera.position - p.position);
  // right is perpendicular to both velocity and cam direction
  let right   = normalize(cross(vel_dir, cam_dir));

  // Minimal stretch so each drop stays compact
  let stretch = 1.0 + spd * 0.04;

  let world_pos = p.position
    + right   * ofs.x * p.size
    + vel_dir * ofs.y * p.size * stretch;

  var out: VertexOutput;
  out.clip_pos = camera.viewProj * vec4<f32>(world_pos, 1.0);
  out.color    = p.color;
  out.uv       = quad_uv(vid);
  return out;
}

const EMIT_SCALE: f32 = 4.0;

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  // Fade alpha at the tips of the streak (uv.y near 0 or 1)
  let t = abs(in.uv.y * 2.0 - 1.0);
  let alpha = in.color.a * (1.0 - t * t);
  return vec4<f32>(in.color.rgb * EMIT_SCALE, alpha);
}

// ---- Camera-aligned billboard (snow, soft particles) ------------------------

@vertex
fn vs_camera(
  @builtin(vertex_index)   vid: u32,
  @builtin(instance_index) iid: u32,
) -> VertexOutput {
  let p_idx = alive_list[iid];
  let p     = particles[p_idx];

  let ofs = quad_offset(vid);

  // Extract world-space right and up from the view matrix rows.
  // Column-major mat4x4: view[col][row], so row 0 = right, row 1 = up.
  let right = vec3<f32>(camera.view[0][0], camera.view[1][0], camera.view[2][0]);
  let up    = vec3<f32>(camera.view[0][1], camera.view[1][1], camera.view[2][1]);

  let world_pos = p.position
    + right * ofs.x * p.size
    + up    * ofs.y * p.size;

  var out: VertexOutput;
  out.clip_pos = camera.viewProj * vec4<f32>(world_pos, 1.0);
  out.color    = p.color;
  out.uv       = quad_uv(vid);
  return out;
}

@fragment
fn fs_snow(in: VertexOutput) -> @location(0) vec4<f32> {
  // Soft circular disc with radial falloff from center.
  let uv = in.uv * 2.0 - 1.0;
  let d2 = dot(uv, uv);
  if (d2 > 1.0) { discard; }
  let alpha = in.color.a * (1.0 - d2);
  return vec4<f32>(in.color.rgb * EMIT_SCALE, alpha);
}

// Hard square pixel — no radial falloff, no discard. Suits chunky debris that
// should read as a solid colored pixel rather than a soft glow. Skips
// EMIT_SCALE so the output matches the source color after tonemapping.
@fragment
fn fs_pixel(in: VertexOutput) -> @location(0) vec4<f32> {
  return vec4<f32>(in.color.rgb, in.color.a);
}
`,re=64,ne=80,qe=16,ke=16,ie=288,ae=16,X=128;class le extends Z{constructor(t,e,r,o,l,u,f,s,_,d,i,p,g,h,P,y,w,B,x,S,C,M,E,I,m){super();c(this,"name","ParticlePass");c(this,"_isForward");c(this,"_maxParticles");c(this,"_config");c(this,"_particleBuffer");c(this,"_aliveList");c(this,"_counterBuffer");c(this,"_indirectBuffer");c(this,"_computeUniforms");c(this,"_renderUniforms");c(this,"_cameraBuffer");c(this,"_spawnPipeline");c(this,"_updatePipeline");c(this,"_compactPipeline");c(this,"_indirectPipeline");c(this,"_renderPipeline");c(this,"_computeDataBg");c(this,"_computeUniBg");c(this,"_compactDataBg");c(this,"_compactUniBg");c(this,"_renderDataBg");c(this,"_cameraRenderBg");c(this,"_renderParamsBg");c(this,"_heightmapDataBuf");c(this,"_heightmapUniBuf");c(this,"_heightmapBg");c(this,"_spawnAccum",0);c(this,"_spawnOffset",0);c(this,"_spawnCount",0);c(this,"_time",0);c(this,"_frameSeed",0);c(this,"_pendingBurst",null);c(this,"_cuBuf",new Float32Array(ne/4));c(this,"_cuiView",new Uint32Array(this._cuBuf.buffer));c(this,"_camBuf",new Float32Array(ie/4));c(this,"_hmUniBuf",new Float32Array(ae/4));c(this,"_hmRes",new Uint32Array([X]));c(this,"_resetArr",new Uint32Array(1));this._isForward=t,this._config=e,this._maxParticles=r,this._particleBuffer=o,this._aliveList=l,this._counterBuffer=u,this._indirectBuffer=f,this._computeUniforms=s,this._renderUniforms=_,this._cameraBuffer=d,this._spawnPipeline=i,this._updatePipeline=p,this._compactPipeline=g,this._indirectPipeline=h,this._renderPipeline=P,this._computeDataBg=y,this._computeUniBg=w,this._compactDataBg=B,this._compactUniBg=x,this._renderDataBg=S,this._cameraRenderBg=C,this._renderParamsBg=M,this._heightmapDataBuf=E,this._heightmapUniBuf=I,this._heightmapBg=m}setSpawnRate(t){this._config.emitter.spawnRate=t}burst(t,e,r){if(r<=0)return;const o=Math.min(r,this._maxParticles);this._pendingBurst={px:t.x,py:t.y,pz:t.z,r:e[0],g:e[1],b:e[2],a:e[3],count:o}}static create(t,e){const{device:r}=t,o=e.renderer.type==="sprites"&&e.renderer.renderTarget==="hdr",l=e.emitter.maxParticles,u=r.createBuffer({label:"ParticleBuffer",size:l*re,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),f=new Float32Array(l*(re/4));for(let F=0;F<l;F++)f[F*16+3]=-1;r.queue.writeBuffer(u,0,f.buffer);const s=r.createBuffer({label:"ParticleAliveList",size:l*4,usage:GPUBufferUsage.STORAGE}),_=r.createBuffer({label:"ParticleCounter",size:4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),d=r.createBuffer({label:"ParticleIndirect",size:16,usage:GPUBufferUsage.INDIRECT|GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(d,0,new Uint32Array([6,0,0,0]));const i=r.createBuffer({label:"ParticleComputeUniforms",size:ne,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),p=r.createBuffer({label:"ParticleCompactUniforms",size:qe,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(p,0,new Uint32Array([l,0,0,0]));const g=r.createBuffer({label:"ParticleRenderUniforms",size:ke,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(g,0,new Float32Array([e.emitter.roughness,e.emitter.metallic,0,0]));const h=r.createBuffer({label:"ParticleCameraBuffer",size:ie,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),P=r.createBindGroupLayout({label:"ParticleComputeDataBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),y=r.createBindGroupLayout({label:"ParticleCompactDataBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),w=r.createBindGroupLayout({label:"ParticleComputeUniBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),B=r.createBindGroupLayout({label:"ParticleRenderDataBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}}]}),x=r.createBindGroupLayout({label:"ParticleCameraRenderBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),S=r.createBindGroupLayout({label:"ParticleRenderParamsBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),C=r.createBindGroup({label:"ParticleComputeDataBG",layout:P,entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:s}},{binding:2,resource:{buffer:_}},{binding:3,resource:{buffer:d}}]}),M=r.createBindGroup({label:"ParticleCompactDataBG",layout:y,entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:s}},{binding:2,resource:{buffer:_}},{binding:3,resource:{buffer:d}}]}),E=r.createBindGroup({label:"ParticleComputeUniBG",layout:w,entries:[{binding:0,resource:{buffer:i}}]}),I=r.createBindGroup({label:"ParticleCompactUniBG",layout:w,entries:[{binding:0,resource:{buffer:p}}]}),m=r.createBindGroup({label:"ParticleRenderDataBG",layout:B,entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:s}}]}),b=r.createBindGroup({label:"ParticleCameraRenderBG",layout:x,entries:[{binding:0,resource:{buffer:h}}]}),G=r.createBindGroup({label:"ParticleRenderParamsBG",layout:S,entries:[{binding:0,resource:{buffer:g}}]});let T,O,R,L;ze(e)&&(T=r.createBuffer({label:"ParticleHeightmapData",size:X*X*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),O=r.createBuffer({label:"ParticleHeightmapUniforms",size:ae,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),L=r.createBindGroupLayout({label:"ParticleHeightmapBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),R=r.createBindGroup({label:"ParticleHeightmapBG",layout:L,entries:[{binding:0,resource:{buffer:T}},{binding:1,resource:{buffer:O}}]}));const N=r.createPipelineLayout({bindGroupLayouts:[P,w]}),q=L?r.createPipelineLayout({bindGroupLayouts:[P,w,L]}):r.createPipelineLayout({bindGroupLayouts:[P,w]}),D=r.createPipelineLayout({bindGroupLayouts:[y,w]}),k=t.createShaderModule(Re(e),"ParticleSpawn"),W=t.createShaderModule(Ve(e),"ParticleUpdate"),U=t.createShaderModule(Ae,"ParticleCompact"),A=r.createComputePipeline({label:"ParticleSpawnPipeline",layout:N,compute:{module:k,entryPoint:"cs_main"}}),z=r.createComputePipeline({label:"ParticleUpdatePipeline",layout:q,compute:{module:W,entryPoint:"cs_main"}}),v=r.createComputePipeline({label:"ParticleCompactPipeline",layout:D,compute:{module:U,entryPoint:"cs_compact"}}),de=r.createComputePipeline({label:"ParticleIndirectPipeline",layout:D,compute:{module:U,entryPoint:"cs_write_indirect"}});let j;if(o){const F=e.renderer.type==="sprites"?e.renderer.billboard:"camera",pe=e.renderer.type==="sprites"?e.renderer.shape??"soft":"soft",me=F==="camera"?"vs_camera":"vs_main",_e=F==="velocity"?"fs_main":pe==="pixel"?"fs_pixel":"fs_snow",K=t.createShaderModule(De,"ParticleRenderForward");j=r.createRenderPipeline({label:"ParticleForwardPipeline",layout:r.createPipelineLayout({bindGroupLayouts:[B,x]}),vertex:{module:K,entryPoint:me},fragment:{module:K,entryPoint:_e,targets:[{format:V,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},depthStencil:{format:Q,depthWriteEnabled:!1,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}})}else{const F=t.createShaderModule(Ne,"ParticleRender");j=r.createRenderPipeline({label:"ParticleRenderPipeline",layout:r.createPipelineLayout({bindGroupLayouts:[B,x,S]}),vertex:{module:F,entryPoint:"vs_main"},fragment:{module:F,entryPoint:"fs_main",targets:[{format:ve},{format:xe}]},depthStencil:{format:Q,depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}})}return new le(o,e,l,u,s,_,d,i,g,h,A,z,v,de,j,C,E,M,I,m,b,o?void 0:G,T,O,R)}updateHeightmap(t,e,r,o,l){if(!this._heightmapDataBuf||!this._heightmapUniBuf)return;t.queue.writeBuffer(this._heightmapDataBuf,0,e.buffer);const u=this._hmUniBuf;u[0]=r,u[1]=o,u[2]=l,t.queue.writeBuffer(this._heightmapUniBuf,0,u.buffer,0,12),t.queue.writeBuffer(this._heightmapUniBuf,12,this._hmRes)}update(t,e,r,o,l,u,f,s,_){const d=t.deltaTime;this._time+=d,this._frameSeed=this._frameSeed+1&4294967295,this._spawnAccum+=this._config.emitter.spawnRate*d,this._spawnCount=Math.min(Math.floor(this._spawnAccum),this._maxParticles),this._spawnAccum-=this._spawnCount;const i=_.data;let p=i[12],g=i[13],h=i[14];const P=Math.hypot(i[0],i[1],i[2]),y=Math.hypot(i[4],i[5],i[6]),w=Math.hypot(i[8],i[9],i[10]),B=i[0]/P,x=i[1]/P,S=i[2]/P,C=i[4]/y,M=i[5]/y,E=i[6]/y,I=i[8]/w,m=i[9]/w,b=i[10]/w,G=B+M+b;let T,O,R,L;if(G>0){const v=.5/Math.sqrt(G+1);L=.25/v,T=(E-m)*v,O=(I-S)*v,R=(x-C)*v}else if(B>M&&B>b){const v=2*Math.sqrt(1+B-M-b);L=(E-m)/v,T=.25*v,O=(C+x)/v,R=(I+S)/v}else if(M>b){const v=2*Math.sqrt(1+M-B-b);L=(I-S)/v,T=(C+x)/v,O=.25*v,R=(m+E)/v}else{const v=2*Math.sqrt(1+b-B-M);L=(x-C)/v,T=(I+S)/v,O=(m+E)/v,R=.25*v}const N=this._config.emitter.initialColor;let q=N[0],D=N[1],k=N[2],W=N[3];if(this._pendingBurst){const v=this._pendingBurst;p=v.px,g=v.py,h=v.pz,T=0,O=0,R=0,L=1,this._spawnCount=v.count,q=v.r,D=v.g,k=v.b,W=v.a,this._pendingBurst=null}const U=this._cuBuf,A=this._cuiView;U[0]=p,U[1]=g,U[2]=h,A[3]=this._spawnCount,U[4]=T,U[5]=O,U[6]=R,U[7]=L,A[8]=this._spawnOffset,A[9]=this._maxParticles,A[10]=this._frameSeed,A[11]=0,U[12]=d,U[13]=this._time,U[16]=q,U[17]=D,U[18]=k,U[19]=W,t.queue.writeBuffer(this._computeUniforms,0,U.buffer),t.queue.writeBuffer(this._counterBuffer,0,this._resetArr),this._spawnOffset=(this._spawnOffset+this._spawnCount)%this._maxParticles;const z=this._camBuf;z.set(e.data,0),z.set(r.data,16),z.set(o.data,32),z.set(l.data,48),z[64]=u.x,z[65]=u.y,z[66]=u.z,z[67]=f,z[68]=s,t.queue.writeBuffer(this._cameraBuffer,0,z.buffer)}addToGraph(t,e){const r=t.importExternalBuffer(this._indirectBuffer,{label:"ParticleIndirect",size:16});let o;t.addPass(this.name+".compute","compute",_=>{o=_.write(r,"storage-write"),_.setExecute(d=>{const i=d.computePassEncoder;this._spawnCount>0&&(i.setPipeline(this._spawnPipeline),i.setBindGroup(0,this._computeDataBg),i.setBindGroup(1,this._computeUniBg),i.dispatchWorkgroups(Math.ceil(this._spawnCount/64))),i.setPipeline(this._updatePipeline),i.setBindGroup(0,this._computeDataBg),i.setBindGroup(1,this._computeUniBg),this._heightmapBg&&i.setBindGroup(2,this._heightmapBg),i.dispatchWorkgroups(Math.ceil(this._maxParticles/64)),i.setPipeline(this._compactPipeline),i.setBindGroup(0,this._compactDataBg),i.setBindGroup(1,this._compactUniBg),i.dispatchWorkgroups(Math.ceil(this._maxParticles/64)),i.setPipeline(this._indirectPipeline),i.dispatchWorkgroups(1)})});let l,u,f,s;if(this._isForward){if(!e.hdr)throw new Error("[ParticlePass] forward mode requires deps.hdr");const _=e.hdr,d=e.gbuffer.depth;t.addPass(this.name+".render","render",i=>{l=i.write(_,"attachment",{loadOp:"load",storeOp:"store"}),i.read(d,"depth-read"),i.read(o,"indirect"),i.setExecute(p=>{const g=p.renderPassEncoder;g.setPipeline(this._renderPipeline),g.setBindGroup(0,this._renderDataBg),g.setBindGroup(1,this._cameraRenderBg),g.drawIndirect(this._indirectBuffer,0)})})}else{if(!e.gbuffer.albedo||!e.gbuffer.normal)throw new Error("[ParticlePass] deferred mode requires deps.gbuffer.{albedo,normal}");const _=e.gbuffer.albedo,d=e.gbuffer.normal,i=e.gbuffer.depth;t.addPass(this.name+".render","render",p=>{u=p.write(_,"attachment",{loadOp:"load",storeOp:"store"}),f=p.write(d,"attachment",{loadOp:"load",storeOp:"store"}),s=p.write(i,"depth-attachment",{depthLoadOp:"load",depthStoreOp:"store"}),p.read(o,"indirect"),p.setExecute(g=>{const h=g.renderPassEncoder;h.setPipeline(this._renderPipeline),h.setBindGroup(0,this._renderDataBg),h.setBindGroup(1,this._cameraRenderBg),h.setBindGroup(2,this._renderParamsBg),h.drawIndirect(this._indirectBuffer,0)})})}return{hdr:l,albedo:u,normal:f,depth:s}}destroy(){var t,e;this._particleBuffer.destroy(),this._aliveList.destroy(),this._counterBuffer.destroy(),this._indirectBuffer.destroy(),this._computeUniforms.destroy(),this._renderUniforms.destroy(),this._cameraBuffer.destroy(),(t=this._heightmapDataBuf)==null||t.destroy(),(e=this._heightmapUniBuf)==null||e.destroy()}}const We=`// Bloom: prefilter (downsample + threshold) and separable Gaussian blur.
// The composite step is in bloom_composite.wgsl.

struct BloomUniforms {
  threshold: f32,
  knee     : f32,
  strength : f32,
  _pad     : f32,
}

@group(0) @binding(0) var<uniform> bloom   : BloomUniforms;
@group(0) @binding(1) var          src_tex : texture_2d<f32>;
@group(0) @binding(2) var          src_samp: sampler;

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
  @location(0)       uv     : vec2<f32>,
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

// Prefilter: 2× downsample + soft-knee threshold.
// UV is mapped to the half-res output; src_tex is the full-res HDR.
@fragment
fn fs_prefilter(in: VertexOutput) -> @location(0) vec4<f32> {
  let texel = 1.0 / vec2<f32>(textureDimensions(src_tex));
  let c = (
    textureSample(src_tex, src_samp, in.uv + vec2(-0.5, -0.5) * texel) +
    textureSample(src_tex, src_samp, in.uv + vec2( 0.5, -0.5) * texel) +
    textureSample(src_tex, src_samp, in.uv + vec2(-0.5,  0.5) * texel) +
    textureSample(src_tex, src_samp, in.uv + vec2( 0.5,  0.5) * texel)
  ).rgb * 0.25;

  // Soft knee: smooth ramp from (threshold - knee) to (threshold + knee)
  let brightness = max(c.r, max(c.g, c.b));
  let rq         = clamp(brightness - bloom.threshold + bloom.knee, 0.0, 2.0 * bloom.knee);
  let weight     = max(bloom.knee * rq * rq, brightness - bloom.threshold)
                 / max(brightness, 0.0001);
  return vec4<f32>(c * weight, 1.0);
}

// 9-tap separable Gaussian, sigma ≈ 2.  Weights are normalized to sum 1.
const W0: f32 = 0.20416;
const W1: f32 = 0.18009;
const W2: f32 = 0.12388;
const W3: f32 = 0.06626;
const W4: f32 = 0.02763;

@fragment
fn fs_blur_h(in: VertexOutput) -> @location(0) vec4<f32> {
  let tx = 1.0 / f32(textureDimensions(src_tex).x);
  var c  = textureSample(src_tex, src_samp, in.uv).rgb * W0;
  c += textureSample(src_tex, src_samp, in.uv + vec2( tx, 0.0)).rgb * W1;
  c += textureSample(src_tex, src_samp, in.uv + vec2(-tx, 0.0)).rgb * W1;
  c += textureSample(src_tex, src_samp, in.uv + vec2( 2.0*tx, 0.0)).rgb * W2;
  c += textureSample(src_tex, src_samp, in.uv + vec2(-2.0*tx, 0.0)).rgb * W2;
  c += textureSample(src_tex, src_samp, in.uv + vec2( 3.0*tx, 0.0)).rgb * W3;
  c += textureSample(src_tex, src_samp, in.uv + vec2(-3.0*tx, 0.0)).rgb * W3;
  c += textureSample(src_tex, src_samp, in.uv + vec2( 4.0*tx, 0.0)).rgb * W4;
  c += textureSample(src_tex, src_samp, in.uv + vec2(-4.0*tx, 0.0)).rgb * W4;
  return vec4<f32>(c, 1.0);
}

@fragment
fn fs_blur_v(in: VertexOutput) -> @location(0) vec4<f32> {
  let ty = 1.0 / f32(textureDimensions(src_tex).y);
  var c  = textureSample(src_tex, src_samp, in.uv).rgb * W0;
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0,  ty)).rgb * W1;
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0, -ty)).rgb * W1;
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0,  2.0*ty)).rgb * W2;
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0, -2.0*ty)).rgb * W2;
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0,  3.0*ty)).rgb * W3;
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0, -3.0*ty)).rgb * W3;
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0,  4.0*ty)).rgb * W4;
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0, -4.0*ty)).rgb * W4;
  return vec4<f32>(c, 1.0);
}
`,He=`// Bloom composite: adds the blurred bright regions back to the source HDR.

struct BloomUniforms {
  threshold: f32,
  knee     : f32,
  strength : f32,
  _pad     : f32,
}

@group(0) @binding(0) var<uniform> params   : BloomUniforms;
@group(0) @binding(1) var          hdr_tex  : texture_2d<f32>;
@group(0) @binding(2) var          bloom_tex: texture_2d<f32>;
@group(0) @binding(3) var          samp     : sampler;

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
  @location(0)       uv     : vec2<f32>,
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

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let hdr   = textureSample(hdr_tex,   samp, in.uv).rgb;
  // bloom_tex is half-res; bilinear upsample happens automatically
  let glow  = textureSample(bloom_tex, samp, in.uv).rgb;
  return vec4<f32>(hdr + glow * params.strength, 1.0);
}
`,$e=16;class fe extends Z{constructor(t,e,r,o,l,u,f,s,_){super();c(this,"name","BloomPass");c(this,"_device");c(this,"_singleBgl");c(this,"_compositeBgl");c(this,"_prefilterPipeline");c(this,"_blurHPipeline");c(this,"_blurVPipeline");c(this,"_compositePipeline");c(this,"_uniformBuffer");c(this,"_sampler");c(this,"_scratch",new Float32Array(4));this._device=t,this._singleBgl=e,this._compositeBgl=r,this._prefilterPipeline=o,this._blurHPipeline=l,this._blurVPipeline=u,this._compositePipeline=f,this._uniformBuffer=s,this._sampler=_}static create(t){const{device:e}=t,r=e.createBuffer({label:"BloomUniforms",size:$e,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(r,0,new Float32Array([1,.5,.3,0]).buffer);const o=e.createSampler({label:"BloomSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),l=e.createBindGroupLayout({label:"BloomSingleBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),u=e.createBindGroupLayout({label:"BloomCompositeBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),f=t.createShaderModule(We,"BloomShader"),s=t.createShaderModule(He,"BloomComposite"),_=e.createPipelineLayout({bindGroupLayouts:[l]}),d=e.createPipelineLayout({bindGroupLayouts:[u]}),i=(p,g)=>e.createRenderPipeline({label:g,layout:_,vertex:{module:f,entryPoint:"vs_main"},fragment:{module:f,entryPoint:p,targets:[{format:V}]},primitive:{topology:"triangle-list"}});return new fe(e,l,u,i("fs_prefilter","BloomPrefilterPipeline"),i("fs_blur_h","BloomBlurHPipeline"),i("fs_blur_v","BloomBlurVPipeline"),e.createRenderPipeline({label:"BloomCompositePipeline",layout:d,vertex:{module:s,entryPoint:"vs_main"},fragment:{module:s,entryPoint:"fs_main",targets:[{format:V}]},primitive:{topology:"triangle-list"}}),r,o)}updateParams(t,e=1,r=.5,o=.3){this._scratch[0]=e,this._scratch[1]=r,this._scratch[2]=o,this._scratch[3]=0,t.queue.writeBuffer(this._uniformBuffer,0,this._scratch.buffer)}addToGraph(t,e){const{ctx:r}=t,o={format:V,width:Math.max(1,r.width>>1),height:Math.max(1,r.height>>1)},l={format:V,width:r.width,height:r.height};let u,f,s;const _=i=>this._device.createBindGroup({layout:this._singleBgl,entries:[{binding:0,resource:{buffer:this._uniformBuffer}},{binding:1,resource:i},{binding:2,resource:this._sampler}]});t.addPass("BloomPass.prefilter","render",i=>{u=i.createTexture({label:"BloomHalf1",...o}),u=i.write(u,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[0,0,0,1]}),i.read(e.hdr,"sampled"),i.setExecute((p,g)=>{const h=p.renderPassEncoder;h.setPipeline(this._prefilterPipeline),h.setBindGroup(0,_(g.getTextureView(e.hdr))),h.draw(3)})});for(let i=0;i<2;i++){const p=u;let g;t.addPass(`BloomPass.blurH${i}`,"render",y=>{f=i===0?y.createTexture({label:"BloomHalf2",...o}):f,g=y.write(f,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[0,0,0,1]}),y.read(p,"sampled"),y.setExecute((w,B)=>{const x=w.renderPassEncoder;x.setPipeline(this._blurHPipeline),x.setBindGroup(0,_(B.getTextureView(p))),x.draw(3)})}),f=g;const h=f;let P;t.addPass(`BloomPass.blurV${i}`,"render",y=>{P=y.write(u,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[0,0,0,1]}),y.read(h,"sampled"),y.setExecute((w,B)=>{const x=w.renderPassEncoder;x.setPipeline(this._blurVPipeline),x.setBindGroup(0,_(B.getTextureView(h))),x.draw(3)})}),u=P}const d=u;return t.addPass("BloomPass.composite","render",i=>{s=i.createTexture({label:"BloomResult",...l}),s=i.write(s,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[0,0,0,1]}),i.read(e.hdr,"sampled"),i.read(d,"sampled"),i.setExecute((p,g)=>{const h=this._device.createBindGroup({layout:this._compositeBgl,entries:[{binding:0,resource:{buffer:this._uniformBuffer}},{binding:1,resource:g.getTextureView(e.hdr)},{binding:2,resource:g.getTextureView(d)},{binding:3,resource:this._sampler}]}),P=p.renderPassEncoder;P.setPipeline(this._compositePipeline),P.setBindGroup(0,h),P.draw(3)})}),{result:s}}destroy(){this._uniformBuffer.destroy()}}export{fe as B,le as P,se as S,Ke as c};
