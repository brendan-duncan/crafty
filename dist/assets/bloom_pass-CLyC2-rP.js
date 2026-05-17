var ve=Object.defineProperty;var xe=(n,i,t)=>i in n?ve(n,i,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[i]=t;var s=(n,i,t)=>xe(n,typeof i!="symbol"?i+"":i,t);import{a as H}from"./dof_pass-DpRc5q33.js";import{P as K}from"./mesh-BJGbBOtt.js";import{H as F}from"./deferred_lighting_pass-0W5ZoDq7.js";import{a as J,b as be,c as ye}from"./geometry_pass-Dhq13HDM.js";const et=""+new URL("simple_block_atlas-B-7juoTN.png",import.meta.url).href,tt=""+new URL("simple_block_atlas_normal-BdCvGD-K.png",import.meta.url).href,rt=""+new URL("simple_block_atlas_mer-C_Oa_Ink.png",import.meta.url).href,nt=""+new URL("simple_block_atlas_heightmap-BOV6qQJl.png",import.meta.url).href,Pe=`// IBL baking — two compute entry points share the same bind group layout.
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
`,$=5,X=128,j=32,Be=[0,.25,.5,.75,1],we=Math.PI;function Se(n){let i=n>>>0;return i=(i<<16|i>>>16)>>>0,i=((i&1431655765)<<1|i>>>1&1431655765)>>>0,i=((i&858993459)<<2|i>>>2&858993459)>>>0,i=((i&252645135)<<4|i>>>4&252645135)>>>0,i=((i&16711935)<<8|i>>>8&16711935)>>>0,i*23283064365386963e-26}function Ge(n,i,t){const e=new Float32Array(n*i*4);for(let r=0;r<i;r++)for(let o=0;o<n;o++){const u=(o+.5)/n,l=(r+.5)/i,f=l*l,c=f*f,m=Math.sqrt(1-u*u),p=u;let a=0,d=0;for(let h=0;h<t;h++){const b=(h+.5)/t,x=Se(h),y=(1-x)/(1+(c-1)*x),P=Math.sqrt(y),B=Math.sqrt(Math.max(0,1-y)),S=2*we*b,L=B*Math.cos(S),M=P,E=m*L+p*M;if(E<=0)continue;const I=2*E*M-p,_=Math.max(0,I),w=Math.max(0,P);if(_<=0)continue;const G=c/2,T=u/(u*(1-G)+G),R=_/(_*(1-G)+G),O=T*R*E/(w*u),C=Math.pow(1-E,5);a+=O*(1-C),d+=O*C}const g=(r*n+o)*4;e[g+0]=a/t,e[g+1]=d/t,e[g+2]=0,e[g+3]=1}return e}function Ue(n){const i=new Float32Array([n]),t=new Uint32Array(i.buffer)[0],e=t>>31&1,r=t>>23&255,o=t&8388607;if(r===255)return e<<15|31744|(o?1:0);if(r===0)return e<<15;const u=r-127+15;return u>=31?e<<15|31744:u<=0?e<<15:e<<15|u<<10|o>>13}function Te(n){const i=new Uint16Array(n.length);for(let t=0;t<n.length;t++)i[t]=Ue(n[t]);return i}const ee=new WeakMap;function Me(n){const i=ee.get(n);if(i)return i;const t=Te(Ge(64,64,512)),e=n.createTexture({label:"IBL BRDF LUT",size:{width:64,height:64},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return n.queue.writeTexture({texture:e},t,{bytesPerRow:64*8},{width:64,height:64}),ee.set(n,e),e}const te=new WeakMap;function Ee(n){const i=te.get(n);if(i)return i;const t=n.createBindGroupLayout({label:"IblBGL0",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.COMPUTE,sampler:{type:"filtering"}}]}),e=n.createBindGroupLayout({label:"IblBGL1",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"2d"}}]}),r=n.createPipelineLayout({bindGroupLayouts:[t,e]}),o=n.createShaderModule({label:"IblCompute",code:Pe}),u=n.createComputePipeline({label:"IblIrradiancePipeline",layout:r,compute:{module:o,entryPoint:"cs_irradiance"}}),l=n.createComputePipeline({label:"IblPrefilterPipeline",layout:r,compute:{module:o,entryPoint:"cs_prefilter"}}),f=n.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"clamp-to-edge"}),c={irrPipeline:u,pfPipeline:l,bgl0:t,bgl1:e,sampler:f};return te.set(n,c),c}async function it(n,i,t=.2){const{irrPipeline:e,pfPipeline:r,bgl0:o,bgl1:u,sampler:l}=Ee(n),f=n.createTexture({label:"IBL Irradiance",size:{width:j,height:j,depthOrArrayLayers:6},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),c=n.createTexture({label:"IBL Prefiltered",size:{width:X,height:X,depthOrArrayLayers:6},mipLevelCount:$,format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),m=(_,w)=>{const G=n.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return n.queue.writeBuffer(G,0,new Float32Array([t,_,w,0])),G},p=i.createView(),a=_=>n.createBindGroup({layout:o,entries:[{binding:0,resource:{buffer:_}},{binding:1,resource:p},{binding:2,resource:l}]}),d=_=>n.createBindGroup({layout:u,entries:[{binding:0,resource:_}]}),g=Array.from({length:6},(_,w)=>m(0,w)),h=Be.flatMap((_,w)=>Array.from({length:6},(G,T)=>m(_,T))),b=g.map(a),x=h.map(a),y=Array.from({length:6},(_,w)=>d(f.createView({dimension:"2d",baseArrayLayer:w,arrayLayerCount:1}))),P=Array.from({length:$*6},(_,w)=>{const G=Math.floor(w/6),T=w%6;return d(c.createView({dimension:"2d",baseMipLevel:G,mipLevelCount:1,baseArrayLayer:T,arrayLayerCount:1}))}),B=n.createCommandEncoder({label:"IblComputeEncoder"}),S=B.beginComputePass({label:"IblComputePass"});S.setPipeline(e);for(let _=0;_<6;_++)S.setBindGroup(0,b[_]),S.setBindGroup(1,y[_]),S.dispatchWorkgroups(Math.ceil(j/8),Math.ceil(j/8));S.setPipeline(r);for(let _=0;_<$;_++){const w=X>>_;for(let G=0;G<6;G++)S.setBindGroup(0,x[_*6+G]),S.setBindGroup(1,P[_*6+G]),S.dispatchWorkgroups(Math.ceil(w/8),Math.ceil(w/8))}S.end(),n.queue.submit([B.finish()]),await n.queue.onSubmittedWorkDone(),g.forEach(_=>_.destroy()),h.forEach(_=>_.destroy());const L=Me(n),M=f.createView({dimension:"cube"}),E=c.createView({dimension:"cube"}),I=L.createView();return{irradiance:f,prefiltered:c,brdfLut:L,irradianceView:M,prefilteredView:E,brdfLutView:I,levels:$,destroy(){f.destroy(),c.destroy()}}}class oe{constructor(i,t,e,r,o,u,l){s(this,"colorAtlas");s(this,"normalAtlas");s(this,"merAtlas");s(this,"heightAtlas");s(this,"blockSize");s(this,"blockCount");s(this,"_atlasWidth");s(this,"_atlasHeight");this.colorAtlas=i,this.normalAtlas=t,this.merAtlas=e,this.heightAtlas=r,this.blockSize=o,this._atlasWidth=u,this._atlasHeight=l,this.blockCount=Math.floor(u/o)}static async load(i,t,e,r,o,u=16){async function l(y){const P=await(await fetch(y)).blob();return createImageBitmap(P,{colorSpaceConversion:"none"})}const[f,c,m,p]=await Promise.all([l(t),l(e),l(r),l(o)]),a=f.width,d=f.height,g=H.fromBitmap(i,f,{srgb:!0}),h=H.fromBitmap(i,c,{srgb:!1}),b=H.fromBitmap(i,m,{srgb:!1}),x=H.fromBitmap(i,p,{srgb:!1});return new oe(g,h,b,x,u,a,d)}uvTransform(i){const t=this.blockSize/this._atlasWidth,e=this.blockSize/this._atlasHeight;return[i*t,0,t,e]}destroy(){this.colorAtlas.destroy(),this.normalAtlas.destroy(),this.merAtlas.destroy(),this.heightAtlas.destroy()}}const Ce=`// Screen-Space Global Illumination — ray march pass.
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
`,Le=`// Screen-Space Global Illumination — temporal accumulation pass.
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
`,re=368,Ie={numRays:4,numSteps:16,radius:3,thickness:.5,strength:1},Re="ssgi:history";function Oe(){const n=new Uint8Array(new ArrayBuffer(64));for(let i=0;i<16;i++){const t=Math.random()*Math.PI*2;n[i*4+0]=Math.round((Math.cos(t)*.5+.5)*255),n[i*4+1]=Math.round((Math.sin(t)*.5+.5)*255),n[i*4+2]=128,n[i*4+3]=255}return n}class ce extends K{constructor(t,e,r,o,u,l,f,c,m){super();s(this,"name","SSGIPass");s(this,"_uniformBuffer");s(this,"_noiseTex");s(this,"_noiseView");s(this,"_ssgiPipeline");s(this,"_temporalPipeline");s(this,"_ssgiTexBgl");s(this,"_tempTexBgl");s(this,"_uniformBg");s(this,"_sampler");s(this,"_settings",Ie);s(this,"_frameIndex",0);s(this,"_scratch",new Float32Array(re/4));s(this,"_scratchU32",new Uint32Array(this._scratch.buffer));this._uniformBuffer=t,this._noiseTex=e,this._noiseView=r,this._ssgiPipeline=o,this._temporalPipeline=u,this._ssgiTexBgl=l,this._tempTexBgl=f,this._uniformBg=c,this._sampler=m}static create(t){const{device:e}=t,r=e.createBuffer({label:"SSGIUniforms",size:re,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),o=e.createTexture({label:"SSGINoise",size:{width:4,height:4},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});e.queue.writeTexture({texture:o},Oe(),{bytesPerRow:4*4,rowsPerImage:4},{width:4,height:4});const u=e.createSampler({label:"SSGILinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),l=e.createBindGroupLayout({label:"SSGIUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),f=e.createBindGroupLayout({label:"SSGITexBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),c=e.createBindGroupLayout({label:"SSGITempTexBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),m=e.createBindGroup({layout:l,entries:[{binding:0,resource:{buffer:r}}]}),p=t.createShaderModule(Ce,"SSGIShader"),a=t.createShaderModule(Le,"SSGITempShader"),d=e.createRenderPipeline({label:"SSGIPipeline",layout:e.createPipelineLayout({bindGroupLayouts:[l,f]}),vertex:{module:p,entryPoint:"vs_main"},fragment:{module:p,entryPoint:"fs_ssgi",targets:[{format:F}]},primitive:{topology:"triangle-list"}}),g=e.createRenderPipeline({label:"SSGITempPipeline",layout:e.createPipelineLayout({bindGroupLayouts:[l,c]}),vertex:{module:a,entryPoint:"vs_main"},fragment:{module:a,entryPoint:"fs_temporal",targets:[{format:F}]},primitive:{topology:"triangle-list"}});return new ce(r,o,o.createView(),d,g,f,c,m,u)}updateCamera(t){const e=t.activeCamera;if(!e)throw new Error("SSGIPass.updateCamera: ctx.activeCamera is null");const r=e.position(),o=this._scratch;o.set(e.viewMatrix().data,0),o.set(e.projectionMatrix().data,16),o.set(e.inverseProjectionMatrix().data,32),o.set(e.inverseViewProjectionMatrix().data,48),o.set(e.previousViewProjectionMatrix().data,64),o[80]=r.x,o[81]=r.y,o[82]=r.z;const u=this._scratchU32;u[83]=this._settings.numRays,u[84]=this._settings.numSteps,o[85]=this._settings.radius,o[86]=this._settings.thickness,o[87]=this._settings.strength,u[88]=this._frameIndex++,t.queue.writeBuffer(this._uniformBuffer,0,o.buffer)}updateSettings(t){this._settings={...this._settings,...t}}addToGraph(t,e){const{ctx:r}=t,o={format:F,width:r.width,height:r.height},u=t.importPersistentTexture(Re,{...o,label:"SSGIHistory"});let l,f;return t.addPass("SSGIPass.rayMarch","render",c=>{l=c.createTexture({label:"SSGIRaw",...o}),l=c.write(l,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[0,0,0,0]}),c.read(e.depth,"sampled"),c.read(e.normal,"sampled"),c.read(e.prevRadiance,"sampled"),c.setExecute((m,p)=>{const a=p.getOrCreateBindGroup({layout:this._ssgiTexBgl,entries:[{binding:0,resource:p.getTextureView(e.depth)},{binding:1,resource:p.getTextureView(e.normal)},{binding:2,resource:p.getTextureView(e.prevRadiance)},{binding:3,resource:this._noiseView},{binding:4,resource:this._sampler}]}),d=m.renderPassEncoder;d.setPipeline(this._ssgiPipeline),d.setBindGroup(0,this._uniformBg),d.setBindGroup(1,a),d.draw(3)})}),t.addPass("SSGIPass.temporal","render",c=>{f=c.createTexture({label:"SSGIResult",...o,extraUsage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),f=c.write(f,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[0,0,0,0]}),c.read(l,"sampled"),c.read(u,"sampled"),c.read(e.depth,"sampled"),c.setExecute((m,p)=>{const a=p.getOrCreateBindGroup({layout:this._tempTexBgl,entries:[{binding:0,resource:p.getTextureView(l)},{binding:1,resource:p.getTextureView(u)},{binding:2,resource:p.getTextureView(e.depth)},{binding:3,resource:this._sampler}]}),d=m.renderPassEncoder;d.setPipeline(this._temporalPipeline),d.setBindGroup(0,this._uniformBg),d.setBindGroup(1,a),d.draw(3)})}),t.addPass("SSGIPass.copyHistory","transfer",c=>{c.read(f,"copy-src"),c.write(u,"copy-dst"),c.setExecute((m,p)=>{m.commandEncoder.copyTextureToTexture({texture:p.getTexture(f)},{texture:p.getTexture(u)},{width:r.width,height:r.height})})}),{result:f}}destroy(){this._uniformBuffer.destroy(),this._noiseTex.destroy()}}const le=`
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
`;function ze(n){switch(n.kind){case"sphere":{const i=Math.cos(n.solidAngle).toFixed(6),t=n.radius.toFixed(6);return`{
  let dir = sample_cone(seed + 10u, seed + 11u, ${i});
  let world_dir = quat_rotate(uniforms.world_quat, dir);
  p.position = uniforms.world_pos + world_dir * ${t};
  p.velocity = world_dir * speed;
}`}case"cone":{const i=Math.cos(n.angle).toFixed(6),t=n.radius.toFixed(6);return`{
  let dir = sample_cone(seed + 10u, seed + 11u, ${i});
  let world_dir = quat_rotate(uniforms.world_quat, dir);
  p.position = uniforms.world_pos + world_dir * ${t};
  p.velocity = world_dir * speed;
}`}case"box":{const[i,t,e]=n.halfExtents.map(r=>r.toFixed(6));return`{
  let local_off = vec3<f32>(
    (rand_f32(seed + 10u) * 2.0 - 1.0) * ${i},
    (rand_f32(seed + 11u) * 2.0 - 1.0) * ${t},
    (rand_f32(seed + 12u) * 2.0 - 1.0) * ${e},
  );
  let up = quat_rotate(uniforms.world_quat, vec3<f32>(0.0, 1.0, 0.0));
  p.position = uniforms.world_pos + quat_rotate(uniforms.world_quat, local_off);
  p.velocity = up * speed;
}`}}}function ue(n){switch(n.type){case"gravity":return`p.velocity.y -= ${n.strength.toFixed(6)} * uniforms.dt;`;case"drag":return`p.velocity -= p.velocity * ${n.coefficient.toFixed(6)} * uniforms.dt;`;case"force":{const[i,t,e]=n.direction.map(r=>r.toFixed(6));return`p.velocity += vec3<f32>(${i}, ${t}, ${e}) * ${n.strength.toFixed(6)} * uniforms.dt;`}case"swirl_force":{const i=n.speed.toFixed(6),t=n.strength.toFixed(6);return`{
  let swirl_angle = uniforms.time * ${i};
  p.velocity += vec3<f32>(cos(swirl_angle), 0.0, sin(swirl_angle)) * ${t} * uniforms.dt;
}`}case"vortex":return`{
  let vx_radial = p.position.xz - uniforms.world_pos.xz;
  p.velocity += vec3<f32>(-vx_radial.y, 0.0, vx_radial.x) * ${n.strength.toFixed(6)} * uniforms.dt;
}`;case"curl_noise":{const i=n.octaves??1,t=i>1?`curl_noise_fbm(cn_pos, ${i})`:"curl_noise(cn_pos)";return`{
  let cn_pos = p.position * ${n.scale.toFixed(6)} + uniforms.time * ${n.timeScale.toFixed(6)};
  p.velocity += ${t} * ${n.strength.toFixed(6)} * uniforms.dt;
}`}case"size_random":return`p.size = rand_range(${n.min.toFixed(6)}, ${n.max.toFixed(6)}, pcg_hash(idx * 2654435761u));`;case"size_over_lifetime":return`p.size = mix(${n.start.toFixed(6)}, ${n.end.toFixed(6)}, t);`;case"color_over_lifetime":{const[i,t,e,r]=n.startColor.map(c=>c.toFixed(6)),[o,u,l,f]=n.endColor.map(c=>c.toFixed(6));return`p.color = mix(vec4<f32>(${i}, ${t}, ${e}, ${r}), vec4<f32>(${o}, ${u}, ${l}, ${f}), t);`}case"block_collision":return`{
  let _bc_uv = (p.position.xz - vec2<f32>(hm.origin_x, hm.origin_z)) / (hm.extent * 2.0) + 0.5;
  if (all(_bc_uv >= vec2<f32>(0.0)) && all(_bc_uv <= vec2<f32>(1.0))) {
    let _bc_xi = clamp(u32(_bc_uv.x * f32(hm.resolution)), 0u, hm.resolution - 1u);
    let _bc_zi = clamp(u32(_bc_uv.y * f32(hm.resolution)), 0u, hm.resolution - 1u);
    if (p.position.y <= hm_data[_bc_zi * hm.resolution + _bc_xi]) {
      particles[idx].life = -1.0; return;
    }
  }
}`}}function fe(n,i){return n?n.filter(t=>t.trigger===i).flatMap(t=>t.actions.map(ue)).join(`
  `):""}function Ae(n){const{emitter:i,events:t}=n,[e,r]=i.lifetime.map(c=>c.toFixed(6)),[o,u]=i.initialSpeed.map(c=>c.toFixed(6)),[l,f]=i.initialSize.map(c=>c.toFixed(6));return`
${le}

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

  let speed = rand_range(${o}, ${u}, seed + 1u);

  var p: Particle;
  p.life     = 0.0;
  p.max_life = rand_range(${e}, ${r}, seed + 2u);
  p.color    = uniforms.spawn_color;
  p.size     = rand_range(${l}, ${f}, seed + 3u);
  p.rotation = rand_f32(seed + 4u) * 6.28318530717958647;

  ${ze(i.shape)}

  ${fe(t,"on_spawn")}

  particles[idx] = p;
}
`}function Fe(n){return n.modifiers.some(i=>i.type==="block_collision")}const Ve=`
struct HeightmapUniforms {
  origin_x  : f32,
  origin_z  : f32,
  extent    : f32,
  resolution: u32,
}
@group(2) @binding(0) var<storage, read> hm_data: array<f32>;
@group(2) @binding(1) var<uniform>       hm     : HeightmapUniforms;
`;function Ne(n){const i=n.modifiers.some(r=>r.type==="block_collision"),t=n.modifiers.map(ue).join(`
  `),e=fe(n.events,"on_death");return`
${le}
${i?Ve:""}

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
`}const De=`// Compact pass — rebuilds alive_list and writes indirect draw instance count.
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
`,qe=`// Particle GBuffer render pass — camera-facing billboard quads.
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
`,ke=`// Particle forward HDR render pass — velocity-aligned billboard quads.
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
`,ne=64,ie=80,We=16,He=16,ae=288,se=16,Z=128;class pe extends K{constructor(t,e,r,o,u,l,f,c,m,p,a,d,g,h,b,x,y,P,B,S,L,M,E,I,_){super();s(this,"name","ParticlePass");s(this,"_isForward");s(this,"_maxParticles");s(this,"_config");s(this,"_particleBuffer");s(this,"_aliveList");s(this,"_counterBuffer");s(this,"_indirectBuffer");s(this,"_computeUniforms");s(this,"_renderUniforms");s(this,"_cameraBuffer");s(this,"_spawnPipeline");s(this,"_updatePipeline");s(this,"_compactPipeline");s(this,"_indirectPipeline");s(this,"_renderPipeline");s(this,"_computeDataBg");s(this,"_computeUniBg");s(this,"_compactDataBg");s(this,"_compactUniBg");s(this,"_renderDataBg");s(this,"_cameraRenderBg");s(this,"_renderParamsBg");s(this,"_heightmapDataBuf");s(this,"_heightmapUniBuf");s(this,"_heightmapBg");s(this,"_spawnAccum",0);s(this,"_spawnOffset",0);s(this,"_spawnCount",0);s(this,"_time",0);s(this,"_frameSeed",0);s(this,"_pendingBurst",null);s(this,"_cuBuf",new Float32Array(ie/4));s(this,"_cuiView",new Uint32Array(this._cuBuf.buffer));s(this,"_camBuf",new Float32Array(ae/4));s(this,"_hmUniBuf",new Float32Array(se/4));s(this,"_hmRes",new Uint32Array([Z]));s(this,"_resetArr",new Uint32Array(1));this._isForward=t,this._config=e,this._maxParticles=r,this._particleBuffer=o,this._aliveList=u,this._counterBuffer=l,this._indirectBuffer=f,this._computeUniforms=c,this._renderUniforms=m,this._cameraBuffer=p,this._spawnPipeline=a,this._updatePipeline=d,this._compactPipeline=g,this._indirectPipeline=h,this._renderPipeline=b,this._computeDataBg=x,this._computeUniBg=y,this._compactDataBg=P,this._compactUniBg=B,this._renderDataBg=S,this._cameraRenderBg=L,this._renderParamsBg=M,this._heightmapDataBuf=E,this._heightmapUniBuf=I,this._heightmapBg=_}setSpawnRate(t){this._config.emitter.spawnRate=t}burst(t,e,r){if(r<=0)return;const o=Math.min(r,this._maxParticles);this._pendingBurst={px:t.x,py:t.y,pz:t.z,r:e[0],g:e[1],b:e[2],a:e[3],count:o}}static create(t,e){const{device:r}=t,o=e.renderer.type==="sprites"&&e.renderer.renderTarget==="hdr",u=e.emitter.maxParticles,l=r.createBuffer({label:"ParticleBuffer",size:u*ne,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),f=new Float32Array(u*(ne/4));for(let A=0;A<u;A++)f[A*16+3]=-1;r.queue.writeBuffer(l,0,f.buffer);const c=r.createBuffer({label:"ParticleAliveList",size:u*4,usage:GPUBufferUsage.STORAGE}),m=r.createBuffer({label:"ParticleCounter",size:4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),p=r.createBuffer({label:"ParticleIndirect",size:16,usage:GPUBufferUsage.INDIRECT|GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(p,0,new Uint32Array([6,0,0,0]));const a=r.createBuffer({label:"ParticleComputeUniforms",size:ie,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),d=r.createBuffer({label:"ParticleCompactUniforms",size:We,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(d,0,new Uint32Array([u,0,0,0]));const g=r.createBuffer({label:"ParticleRenderUniforms",size:He,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(g,0,new Float32Array([e.emitter.roughness,e.emitter.metallic,0,0]));const h=r.createBuffer({label:"ParticleCameraBuffer",size:ae,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),b=r.createBindGroupLayout({label:"ParticleComputeDataBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),x=r.createBindGroupLayout({label:"ParticleCompactDataBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),y=r.createBindGroupLayout({label:"ParticleComputeUniBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),P=r.createBindGroupLayout({label:"ParticleRenderDataBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}}]}),B=r.createBindGroupLayout({label:"ParticleCameraRenderBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),S=r.createBindGroupLayout({label:"ParticleRenderParamsBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),L=r.createBindGroup({label:"ParticleComputeDataBG",layout:b,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:m}},{binding:3,resource:{buffer:p}}]}),M=r.createBindGroup({label:"ParticleCompactDataBG",layout:x,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:m}},{binding:3,resource:{buffer:p}}]}),E=r.createBindGroup({label:"ParticleComputeUniBG",layout:y,entries:[{binding:0,resource:{buffer:a}}]}),I=r.createBindGroup({label:"ParticleCompactUniBG",layout:y,entries:[{binding:0,resource:{buffer:d}}]}),_=r.createBindGroup({label:"ParticleRenderDataBG",layout:P,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:c}}]}),w=r.createBindGroup({label:"ParticleCameraRenderBG",layout:B,entries:[{binding:0,resource:{buffer:h}}]}),G=r.createBindGroup({label:"ParticleRenderParamsBG",layout:S,entries:[{binding:0,resource:{buffer:g}}]});let T,R,O,C;Fe(e)&&(T=r.createBuffer({label:"ParticleHeightmapData",size:Z*Z*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),R=r.createBuffer({label:"ParticleHeightmapUniforms",size:se,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),C=r.createBindGroupLayout({label:"ParticleHeightmapBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),O=r.createBindGroup({label:"ParticleHeightmapBG",layout:C,entries:[{binding:0,resource:{buffer:T}},{binding:1,resource:{buffer:R}}]}));const N=r.createPipelineLayout({bindGroupLayouts:[b,y]}),q=C?r.createPipelineLayout({bindGroupLayouts:[b,y,C]}):r.createPipelineLayout({bindGroupLayouts:[b,y]}),D=r.createPipelineLayout({bindGroupLayouts:[x,y]}),k=t.createShaderModule(Ae(e),"ParticleSpawn"),W=t.createShaderModule(Ne(e),"ParticleUpdate"),U=t.createShaderModule(De,"ParticleCompact"),V=r.createComputePipeline({label:"ParticleSpawnPipeline",layout:N,compute:{module:k,entryPoint:"cs_main"}}),z=r.createComputePipeline({label:"ParticleUpdatePipeline",layout:q,compute:{module:W,entryPoint:"cs_main"}}),v=r.createComputePipeline({label:"ParticleCompactPipeline",layout:D,compute:{module:U,entryPoint:"cs_compact"}}),me=r.createComputePipeline({label:"ParticleIndirectPipeline",layout:D,compute:{module:U,entryPoint:"cs_write_indirect"}});let Y;if(o){const A=e.renderer.type==="sprites"?e.renderer.billboard:"camera",_e=e.renderer.type==="sprites"?e.renderer.shape??"soft":"soft",ge=A==="camera"?"vs_camera":"vs_main",he=A==="velocity"?"fs_main":_e==="pixel"?"fs_pixel":"fs_snow",Q=t.createShaderModule(ke,"ParticleRenderForward");Y=r.createRenderPipeline({label:"ParticleForwardPipeline",layout:r.createPipelineLayout({bindGroupLayouts:[P,B]}),vertex:{module:Q,entryPoint:ge},fragment:{module:Q,entryPoint:he,targets:[{format:F,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},depthStencil:{format:J,depthWriteEnabled:!1,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}})}else{const A=t.createShaderModule(qe,"ParticleRender");Y=r.createRenderPipeline({label:"ParticleRenderPipeline",layout:r.createPipelineLayout({bindGroupLayouts:[P,B,S]}),vertex:{module:A,entryPoint:"vs_main"},fragment:{module:A,entryPoint:"fs_main",targets:[{format:be},{format:ye}]},depthStencil:{format:J,depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}})}return new pe(o,e,u,l,c,m,p,a,g,h,V,z,v,me,Y,L,E,M,I,_,w,o?void 0:G,T,R,O)}updateHeightmap(t,e,r,o,u){if(!this._heightmapDataBuf||!this._heightmapUniBuf)return;t.queue.writeBuffer(this._heightmapDataBuf,0,e.buffer);const l=this._hmUniBuf;l[0]=r,l[1]=o,l[2]=u,t.queue.writeBuffer(this._heightmapUniBuf,0,l.buffer,0,12),t.queue.writeBuffer(this._heightmapUniBuf,12,this._hmRes)}update(t,e,r,o,u,l,f,c,m){const p=t.deltaTime;this._time+=p,this._frameSeed=this._frameSeed+1&4294967295,this._spawnAccum+=this._config.emitter.spawnRate*p,this._spawnCount=Math.min(Math.floor(this._spawnAccum),this._maxParticles),this._spawnAccum-=this._spawnCount;const a=m.data;let d=a[12],g=a[13],h=a[14];const b=Math.hypot(a[0],a[1],a[2]),x=Math.hypot(a[4],a[5],a[6]),y=Math.hypot(a[8],a[9],a[10]),P=a[0]/b,B=a[1]/b,S=a[2]/b,L=a[4]/x,M=a[5]/x,E=a[6]/x,I=a[8]/y,_=a[9]/y,w=a[10]/y,G=P+M+w;let T,R,O,C;if(G>0){const v=.5/Math.sqrt(G+1);C=.25/v,T=(E-_)*v,R=(I-S)*v,O=(B-L)*v}else if(P>M&&P>w){const v=2*Math.sqrt(1+P-M-w);C=(E-_)/v,T=.25*v,R=(L+B)/v,O=(I+S)/v}else if(M>w){const v=2*Math.sqrt(1+M-P-w);C=(I-S)/v,T=(L+B)/v,R=.25*v,O=(_+E)/v}else{const v=2*Math.sqrt(1+w-P-M);C=(B-L)/v,T=(I+S)/v,R=(_+E)/v,O=.25*v}const N=this._config.emitter.initialColor;let q=N[0],D=N[1],k=N[2],W=N[3];if(this._pendingBurst){const v=this._pendingBurst;d=v.px,g=v.py,h=v.pz,T=0,R=0,O=0,C=1,this._spawnCount=v.count,q=v.r,D=v.g,k=v.b,W=v.a,this._pendingBurst=null}const U=this._cuBuf,V=this._cuiView;U[0]=d,U[1]=g,U[2]=h,V[3]=this._spawnCount,U[4]=T,U[5]=R,U[6]=O,U[7]=C,V[8]=this._spawnOffset,V[9]=this._maxParticles,V[10]=this._frameSeed,V[11]=0,U[12]=p,U[13]=this._time,U[16]=q,U[17]=D,U[18]=k,U[19]=W,t.queue.writeBuffer(this._computeUniforms,0,U.buffer),t.queue.writeBuffer(this._counterBuffer,0,this._resetArr),this._spawnOffset=(this._spawnOffset+this._spawnCount)%this._maxParticles;const z=this._camBuf;z.set(e.data,0),z.set(r.data,16),z.set(o.data,32),z.set(u.data,48),z[64]=l.x,z[65]=l.y,z[66]=l.z,z[67]=f,z[68]=c,t.queue.writeBuffer(this._cameraBuffer,0,z.buffer)}addToGraph(t,e){const r=t.importExternalBuffer(this._indirectBuffer,{label:"ParticleIndirect",size:16});let o;t.addPass(this.name+".compute","compute",m=>{o=m.write(r,"storage-write"),m.setExecute(p=>{const a=p.computePassEncoder;this._spawnCount>0&&(a.setPipeline(this._spawnPipeline),a.setBindGroup(0,this._computeDataBg),a.setBindGroup(1,this._computeUniBg),a.dispatchWorkgroups(Math.ceil(this._spawnCount/64))),a.setPipeline(this._updatePipeline),a.setBindGroup(0,this._computeDataBg),a.setBindGroup(1,this._computeUniBg),this._heightmapBg&&a.setBindGroup(2,this._heightmapBg),a.dispatchWorkgroups(Math.ceil(this._maxParticles/64)),a.setPipeline(this._compactPipeline),a.setBindGroup(0,this._compactDataBg),a.setBindGroup(1,this._compactUniBg),a.dispatchWorkgroups(Math.ceil(this._maxParticles/64)),a.setPipeline(this._indirectPipeline),a.dispatchWorkgroups(1)})});let u,l,f,c;if(this._isForward){if(!e.hdr)throw new Error("[ParticlePass] forward mode requires deps.hdr");const m=e.hdr,p=e.gbuffer.depth;t.addPass(this.name+".render","render",a=>{u=a.write(m,"attachment",{loadOp:"load",storeOp:"store"}),a.read(p,"depth-read"),a.read(o,"indirect"),a.setExecute(d=>{const g=d.renderPassEncoder;g.setPipeline(this._renderPipeline),g.setBindGroup(0,this._renderDataBg),g.setBindGroup(1,this._cameraRenderBg),g.drawIndirect(this._indirectBuffer,0)})})}else{if(!e.gbuffer.albedo||!e.gbuffer.normal)throw new Error("[ParticlePass] deferred mode requires deps.gbuffer.{albedo,normal}");const m=e.gbuffer.albedo,p=e.gbuffer.normal,a=e.gbuffer.depth;t.addPass(this.name+".render","render",d=>{l=d.write(m,"attachment",{loadOp:"load",storeOp:"store"}),f=d.write(p,"attachment",{loadOp:"load",storeOp:"store"}),c=d.write(a,"depth-attachment",{depthLoadOp:"load",depthStoreOp:"store"}),d.read(o,"indirect"),d.setExecute(g=>{const h=g.renderPassEncoder;h.setPipeline(this._renderPipeline),h.setBindGroup(0,this._renderDataBg),h.setBindGroup(1,this._cameraRenderBg),h.setBindGroup(2,this._renderParamsBg),h.drawIndirect(this._indirectBuffer,0)})})}return{hdr:u,albedo:l,normal:f,depth:c}}destroy(){var t,e;this._particleBuffer.destroy(),this._aliveList.destroy(),this._counterBuffer.destroy(),this._indirectBuffer.destroy(),this._computeUniforms.destroy(),this._renderUniforms.destroy(),this._cameraBuffer.destroy(),(t=this._heightmapDataBuf)==null||t.destroy(),(e=this._heightmapUniBuf)==null||e.destroy()}}const $e=`// Bloom: prefilter (downsample + threshold) and separable Gaussian blur.
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
`,je=`// Bloom composite: adds the blurred bright regions back to the source HDR.

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
`,Ye=16;class de extends K{constructor(t,e,r,o,u,l,f,c,m){super();s(this,"name","BloomPass");s(this,"_device");s(this,"_singleBgl");s(this,"_compositeBgl");s(this,"_prefilterPipeline");s(this,"_blurHPipeline");s(this,"_blurVPipeline");s(this,"_compositePipeline");s(this,"_uniformBuffer");s(this,"_sampler");s(this,"_scratch",new Float32Array(4));this._device=t,this._singleBgl=e,this._compositeBgl=r,this._prefilterPipeline=o,this._blurHPipeline=u,this._blurVPipeline=l,this._compositePipeline=f,this._uniformBuffer=c,this._sampler=m}static create(t){const{device:e}=t,r=e.createBuffer({label:"BloomUniforms",size:Ye,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(r,0,new Float32Array([1,.5,.3,0]).buffer);const o=e.createSampler({label:"BloomSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),u=e.createBindGroupLayout({label:"BloomSingleBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),l=e.createBindGroupLayout({label:"BloomCompositeBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),f=t.createShaderModule($e,"BloomShader"),c=t.createShaderModule(je,"BloomComposite"),m=e.createPipelineLayout({bindGroupLayouts:[u]}),p=e.createPipelineLayout({bindGroupLayouts:[l]}),a=(d,g)=>e.createRenderPipeline({label:g,layout:m,vertex:{module:f,entryPoint:"vs_main"},fragment:{module:f,entryPoint:d,targets:[{format:F}]},primitive:{topology:"triangle-list"}});return new de(e,u,l,a("fs_prefilter","BloomPrefilterPipeline"),a("fs_blur_h","BloomBlurHPipeline"),a("fs_blur_v","BloomBlurVPipeline"),e.createRenderPipeline({label:"BloomCompositePipeline",layout:p,vertex:{module:c,entryPoint:"vs_main"},fragment:{module:c,entryPoint:"fs_main",targets:[{format:F}]},primitive:{topology:"triangle-list"}}),r,o)}updateParams(t,e=1,r=.5,o=.3){this._scratch[0]=e,this._scratch[1]=r,this._scratch[2]=o,this._scratch[3]=0,t.queue.writeBuffer(this._uniformBuffer,0,this._scratch.buffer)}addToGraph(t,e){const{ctx:r}=t,o={format:F,width:Math.max(1,r.width>>1),height:Math.max(1,r.height>>1)},u={format:F,width:r.width,height:r.height};let l,f,c;const m=a=>this._device.createBindGroup({layout:this._singleBgl,entries:[{binding:0,resource:{buffer:this._uniformBuffer}},{binding:1,resource:a},{binding:2,resource:this._sampler}]});t.addPass("BloomPass.prefilter","render",a=>{l=a.createTexture({label:"BloomHalf1",...o}),l=a.write(l,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[0,0,0,1]}),a.read(e.hdr,"sampled"),a.setExecute((d,g)=>{const h=d.renderPassEncoder;h.setPipeline(this._prefilterPipeline),h.setBindGroup(0,m(g.getTextureView(e.hdr))),h.draw(3)})});for(let a=0;a<2;a++){const d=l;let g;t.addPass(`BloomPass.blurH${a}`,"render",x=>{f=a===0?x.createTexture({label:"BloomHalf2",...o}):f,g=x.write(f,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[0,0,0,1]}),x.read(d,"sampled"),x.setExecute((y,P)=>{const B=y.renderPassEncoder;B.setPipeline(this._blurHPipeline),B.setBindGroup(0,m(P.getTextureView(d))),B.draw(3)})}),f=g;const h=f;let b;t.addPass(`BloomPass.blurV${a}`,"render",x=>{b=x.write(l,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[0,0,0,1]}),x.read(h,"sampled"),x.setExecute((y,P)=>{const B=y.renderPassEncoder;B.setPipeline(this._blurVPipeline),B.setBindGroup(0,m(P.getTextureView(h))),B.draw(3)})}),l=b}const p=l;return t.addPass("BloomPass.composite","render",a=>{c=a.createTexture({label:"BloomResult",...u}),c=a.write(c,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[0,0,0,1]}),a.read(e.hdr,"sampled"),a.read(p,"sampled"),a.setExecute((d,g)=>{const h=this._device.createBindGroup({layout:this._compositeBgl,entries:[{binding:0,resource:{buffer:this._uniformBuffer}},{binding:1,resource:g.getTextureView(e.hdr)},{binding:2,resource:g.getTextureView(p)},{binding:3,resource:this._sampler}]}),b=d.renderPassEncoder;b.setPipeline(this._compositePipeline),b.setBindGroup(0,h),b.draw(3)})}),{result:c}}destroy(){this._uniformBuffer.destroy()}}export{de as B,pe as P,ce as S,oe as a,et as b,it as c,nt as h,rt as m,tt as n};
