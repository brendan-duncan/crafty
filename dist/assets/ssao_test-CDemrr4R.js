var k=Object.defineProperty;var q=(a,u,e)=>u in a?k(a,u,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[u]=e;var m=(a,u,e)=>q(a,typeof u!="symbol"?u+"":u,e);import{a as Q,P as W,R as Y}from"./render_graph-BZgk4rbM.js";import{B as $,c as K,n as X,m as Z,h as J}from"./block_texture-CKuB8SH0.js";import{P as z,G as ee,C as te,V as y,R as ne,Q as R,b as C}from"./mesh-B_UY4euz.js";import{C as P}from"./chunk-D0Xdx04Q.js";import{B as E}from"./block_type-DoJ9WTh9.js";import{B as ae}from"./block_geometry_pass-AbvsKQeg.js";import{S as re}from"./shadow_pass-CI2ObY9W.js";import{s as I,S as ie}from"./ssao_pass-D4-sBRV2.js";import{D as oe}from"./deferred_lighting_pass-BZaHbbPw.js";import{A as se,C as le}from"./composite_pass-rYRWB-6Z.js";import"./texture-R38axQR3.js";import"./biome_type-CWc41QQE.js";const ue=`// GTAO: Ground Truth Ambient Occlusion (Jiménez et al. 2016).
//
// Slice-based horizon integration with projected-normal correction.
// For each slice through the view direction, find horizons left and right
// of the pixel, project the surface normal onto the slice plane, and
// evaluate the analytical cosine-weighted visibility integral.
//
// Reads GBuffer depth + normals, writes raw AO value [0, 1].

const NUM_SLICES: i32 = 2;
const STEPS_PER_DIR: i32 = 4;
const HALF_PI: f32 = 1.5707963267948966;
const PI: f32 = 3.141592653589793;

struct GtaoUniforms {
  view    : mat4x4<f32>,  // offset   0
  proj    : mat4x4<f32>,  // offset  64
  inv_proj: mat4x4<f32>,  // offset 128
  radius  : f32,          // offset 192
  bias    : f32,          // offset 196 — thickness bias (radius * (1 + bias*10) cutoff)
  strength: f32,          // offset 200 — exponent applied to visibility
  _pad    : f32,
}                          // total 208 bytes

@group(0) @binding(0) var<uniform> u: GtaoUniforms;

@group(1) @binding(0) var normal_tex: texture_2d<f32>;   // rgba16float (N*0.5+0.5 in rgb)
@group(1) @binding(1) var depth_tex : texture_depth_2d;  // depth32float
@group(1) @binding(2) var noise_tex : texture_2d<f32>;   // 4×4 random rg in [0,1]

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

fn view_pos(uv: vec2<f32>, depth: f32) -> vec3<f32> {
  let ndc = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);
  let vh  = u.inv_proj * ndc;
  return vh.xyz / vh.w;
}

fn depth_load_uv(uv: vec2<f32>) -> f32 {
  let size = vec2<i32>(textureDimensions(depth_tex));
  let c    = clamp(vec2<i32>(uv * vec2<f32>(size)), vec2<i32>(0), size - vec2<i32>(1));
  return textureLoad(depth_tex, c, 0);
}

@fragment
fn fs_gtao(in: VertexOutput) -> @location(0) vec4<f32> {
  // Half-res target; GBuffer textures are full-res, so address by half_coord*2.
  let half_coord = vec2<i32>(in.clip_pos.xy);
  let coord      = half_coord * 2;
  let depth      = textureLoad(depth_tex, coord, 0);
  if (depth >= 1.0) { return vec4<f32>(1.0, 0.0, 0.0, 1.0); }

  let P = view_pos(in.uv, depth);
  let raw_n   = textureLoad(normal_tex, coord, 0).rgb;
  let world_N = normalize(raw_n * 2.0 - 1.0);
  let N       = normalize((u.view * vec4<f32>(world_N, 0.0)).xyz);
  let V       = normalize(-P);  // camera is at origin in view space

  // Per-pixel jitter (4×4 tiled). Use stored rg as two random [0,1] values.
  let noise_coord = vec2<u32>(half_coord) % vec2<u32>(4u);
  let rnd         = textureLoad(noise_tex, noise_coord, 0).rg;

  // Convert world-space radius to half-res pixel-step length on the depth tex.
  // proj[1][1] is the vertical projection scale (cot(fovy/2)). Half-res tex_size
  // is half the depth_tex size, but we step in UV space so units cancel.
  let tex_size   = vec2<f32>(textureDimensions(depth_tex));
  let proj_scale = u.proj[1][1] * 0.5 * tex_size.y;
  let radius_px  = clamp(u.radius * proj_scale / max(-P.z, 0.01), 4.0, 256.0);
  let step_px    = max(radius_px / f32(STEPS_PER_DIR), 1.0);
  let max_thick  = u.radius * (1.0 + u.bias * 10.0);

  var visibility: f32 = 0.0;

  for (var s: i32 = 0; s < NUM_SLICES; s++) {
    // Slice angle in [0, π) jittered per pixel.
    let phi   = (f32(s) + rnd.x) * (PI / f32(NUM_SLICES));
    let omega = vec2<f32>(cos(phi), sin(phi));

    // View-space slice tangent: reconstruct a same-depth neighbor along omega.
    // This gives us the slice plane span (V, slice_t) regardless of perspective.
    let near_uv = clamp(in.uv + omega / tex_size, vec2<f32>(0.0), vec2<f32>(1.0));
    let near_p  = view_pos(near_uv, depth);
    let slice_t = normalize(near_p - P);
    let axis    = normalize(cross(V, slice_t));

    // Project N onto the slice plane.
    let proj_N     = N - axis * dot(N, axis);
    let proj_N_len = length(proj_N);
    if (proj_N_len < 1e-4) { continue; }

    // Signed angle of the projected normal from V toward slice_t.
    let n_angle = atan2(dot(proj_N, slice_t), dot(proj_N, V));

    // Track horizon as max(cos(angle from V)); higher cos = closer to V = tighter horizon.
    var cos_h_pos: f32 = -1.0; // +omega side
    var cos_h_neg: f32 = -1.0; // -omega side

    for (var step_i: i32 = 1; step_i <= STEPS_PER_DIR; step_i++) {
      let off  = (f32(step_i) - 0.5 + rnd.y) * step_px;
      let uv_p = clamp(in.uv + omega * off / tex_size, vec2<f32>(0.0), vec2<f32>(1.0));
      let uv_n = clamp(in.uv - omega * off / tex_size, vec2<f32>(0.0), vec2<f32>(1.0));

      let pp = view_pos(uv_p, depth_load_uv(uv_p));
      let pn = view_pos(uv_n, depth_load_uv(uv_n));
      let dp = pp - P;
      let dn = pn - P;
      let lp = length(dp);
      let ln = length(dn);

      // Thickness heuristic: distant samples don't lower the horizon.
      if (lp < max_thick && lp > 1e-5) {
        cos_h_pos = max(cos_h_pos, dot(dp, V) / lp);
      }
      if (ln < max_thick && ln > 1e-5) {
        cos_h_neg = max(cos_h_neg, dot(dn, V) / ln);
      }
    }

    // Convert cosines to signed horizon angles measured from V.
    let h_pos = acos(clamp(cos_h_pos, -1.0, 1.0));   //  0..π
    let h_neg = -acos(clamp(cos_h_neg, -1.0, 1.0));  // -π..0

    // Clamp to the visible hemisphere of the projected normal.
    let h_pos_c = min(h_pos, n_angle + HALF_PI);
    let h_neg_c = max(h_neg, n_angle - HALF_PI);

    // Cosine-weighted slice integral: ∫_{h_neg_c}^{h_pos_c} cos(α - n_angle) dα / 2
    // = (sin(h_pos_c - n_angle) - sin(h_neg_c - n_angle)) / 2. Normalized so a
    // fully-unoccluded slice yields 1. Weight by projected-normal length.
    let v_slice = 0.5 * (sin(h_pos_c - n_angle) - sin(h_neg_c - n_angle));
    visibility += v_slice * proj_N_len;
  }

  visibility = visibility / f32(NUM_SLICES);
  let ao = clamp(pow(max(visibility, 0.0), u.strength), 0.0, 1.0);
  return vec4<f32>(ao, 0.0, 0.0, 1.0);
}
`,V="r8unorm",ce=208;function de(){const a=new Uint8Array(64);for(let u=0;u<16;u++)a[u*4+0]=Math.round(Math.random()*255),a[u*4+1]=Math.round(Math.random()*255),a[u*4+2]=128,a[u*4+3]=255;return a}class A extends z{constructor(e,r,t,d,f,c,h,s,i,n,l,o){super();m(this,"name","GTAOPass");m(this,"_gtaoPipeline");m(this,"_blurHPipeline");m(this,"_blurVPipeline");m(this,"_boxBlurPipeline");m(this,"_blurQuality");m(this,"_uniformBuffer");m(this,"_noiseTex");m(this,"_noiseView");m(this,"_gtaoBgl1");m(this,"_blurBgl");m(this,"_gtaoBg0");m(this,"_blurSampler");m(this,"_cameraScratch",new Float32Array(48));m(this,"_paramsScratch",new Float32Array(4));this._gtaoPipeline=e,this._blurHPipeline=r,this._blurVPipeline=t,this._boxBlurPipeline=d,this._blurQuality=o,this._uniformBuffer=f,this._noiseTex=c,this._noiseView=h,this._gtaoBgl1=s,this._blurBgl=i,this._gtaoBg0=n,this._blurSampler=l}static create(e,r="quality"){const{device:t}=e,d=t.createTexture({label:"GtaoNoise",size:{width:4,height:4},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});t.queue.writeTexture({texture:d},de().buffer,{bytesPerRow:4*4,rowsPerImage:4},{width:4,height:4});const f=d.createView(),c=t.createBuffer({label:"GtaoUniforms",size:ce,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});t.queue.writeBuffer(c,192,new Float32Array([1,.1,2,0]).buffer);const h=t.createSampler({label:"GtaoBlurSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),s=t.createBindGroupLayout({label:"GtaoBGL0",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),i=t.createBindGroupLayout({label:"GtaoBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),n=t.createBindGroupLayout({label:"GtaoBlurBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),l=e.createShaderModule(ue,"GtaoShader"),o=e.createShaderModule(I,"GtaoBlurShader"),p=t.createRenderPipeline({label:"GtaoPipeline",layout:t.createPipelineLayout({bindGroupLayouts:[s,i]}),vertex:{module:l,entryPoint:"vs_main"},fragment:{module:l,entryPoint:"fs_gtao",targets:[{format:V}]},primitive:{topology:"triangle-list"}}),g=t.createRenderPipeline({label:"GtaoBlurHPipeline",layout:t.createPipelineLayout({bindGroupLayouts:[n]}),vertex:{module:o,entryPoint:"vs_main"},fragment:{module:o,entryPoint:"fs_blur_h",targets:[{format:V}]},primitive:{topology:"triangle-list"}}),B=t.createRenderPipeline({label:"GtaoBlurVPipeline",layout:t.createPipelineLayout({bindGroupLayouts:[n]}),vertex:{module:o,entryPoint:"vs_main"},fragment:{module:o,entryPoint:"fs_blur_v",targets:[{format:V}]},primitive:{topology:"triangle-list"}}),w=t.createRenderPipeline({label:"GtaoBoxBlurPipeline",layout:t.createPipelineLayout({bindGroupLayouts:[n]}),vertex:{module:o,entryPoint:"vs_main"},fragment:{module:o,entryPoint:"fs_blur",targets:[{format:V}]},primitive:{topology:"triangle-list"}}),G=t.createBindGroup({label:"GtaoBG0",layout:s,entries:[{binding:0,resource:{buffer:c}}]});return new A(p,g,B,w,c,d,f,i,n,G,h,r)}updateCamera(e){const r=e.activeCamera;if(!r)throw new Error("GTAOPass.updateCamera: ctx.activeCamera is null");const t=this._cameraScratch;t.set(r.viewMatrix().data,0),t.set(r.projectionMatrix().data,16),t.set(r.inverseProjectionMatrix().data,32),e.device.queue.writeBuffer(this._uniformBuffer,0,t.buffer)}setBlurQuality(e){this._blurQuality=e}updateParams(e,r=1,t=.1,d=2){this._paramsScratch[0]=r,this._paramsScratch[1]=t,this._paramsScratch[2]=d,this._paramsScratch[3]=0,e.device.queue.writeBuffer(this._uniformBuffer,192,this._paramsScratch.buffer)}addToGraph(e,r){const{ctx:t}=e,d=Math.max(1,t.width>>1),f=Math.max(1,t.height>>1),c={format:V,width:d,height:f};let h,s;if(e.addPass("GTAOPass.raw","render",i=>{h=i.createTexture({label:"GtaoRaw",...c}),h=i.write(h,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[1,0,0,1]}),i.read(r.normal,"sampled"),i.read(r.depth,"sampled"),i.setExecute((n,l)=>{const o=l.getOrCreateBindGroup({label:"GtaoBG1",layout:this._gtaoBgl1,entries:[{binding:0,resource:l.getTextureView(r.normal)},{binding:1,resource:l.getTextureView(r.depth)},{binding:2,resource:this._noiseView}]}),p=n.renderPassEncoder;p.setPipeline(this._gtaoPipeline),p.setBindGroup(0,this._gtaoBg0),p.setBindGroup(1,o),p.draw(3)})}),this._blurQuality==="quality"){let i;e.addPass("GTAOPass.blurH","render",n=>{i=n.createTexture({label:"GtaoBlurH",...c}),i=n.write(i,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[1,0,0,1]}),n.read(h,"sampled"),n.read(r.depth,"sampled"),n.setExecute((l,o)=>{const p=o.getOrCreateBindGroup({label:"GtaoBlurHBG",layout:this._blurBgl,entries:[{binding:0,resource:o.getTextureView(h)},{binding:1,resource:o.getTextureView(r.depth)},{binding:2,resource:this._blurSampler}]}),g=l.renderPassEncoder;g.setPipeline(this._blurHPipeline),g.setBindGroup(0,p),g.draw(3)})}),e.addPass("GTAOPass.blurV","render",n=>{s=n.createTexture({label:"GtaoBlurred",...c}),s=n.write(s,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[1,0,0,1]}),n.read(i,"sampled"),n.read(r.depth,"sampled"),n.setExecute((l,o)=>{const p=o.getOrCreateBindGroup({label:"GtaoBlurVBG",layout:this._blurBgl,entries:[{binding:0,resource:o.getTextureView(i)},{binding:1,resource:o.getTextureView(r.depth)},{binding:2,resource:this._blurSampler}]}),g=l.renderPassEncoder;g.setPipeline(this._blurVPipeline),g.setBindGroup(0,p),g.draw(3)})})}else e.addPass("GTAOPass.boxBlur","render",i=>{s=i.createTexture({label:"GtaoBoxBlurred",...c}),s=i.write(s,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[1,0,0,1]}),i.read(h,"sampled"),i.read(r.depth,"sampled"),i.setExecute((n,l)=>{const o=l.getOrCreateBindGroup({label:"GtaoBoxBlurBG",layout:this._blurBgl,entries:[{binding:0,resource:l.getTextureView(h)},{binding:1,resource:l.getTextureView(r.depth)},{binding:2,resource:this._blurSampler}]}),p=n.renderPassEncoder;p.setPipeline(this._boxBlurPipeline),p.setBindGroup(0,o),p.draw(3)})});return{ao:s}}destroy(){this._uniformBuffer.destroy(),this._noiseTex.destroy()}}const pe=`// HBAO+: Horizon-Based Ambient Occlusion, plus (NVIDIA, 2008/2013).
//
// For each of N screen-space directions, march from the pixel and track
// the largest "horizon angle" above the tangent plane. The unoccluded
// contribution from that direction is the visible solid angle between
// the tangent plane and the horizon. Average across directions.
//
// The "+" variant just denotes per-pixel direction jitter (we sample a
// 4×4 noise texture) and an angle bias to suppress self-occlusion.
//
// Reads GBuffer depth + normals, writes raw AO value [0, 1].

const NUM_DIRS: i32 = 8;
const STEPS_PER_DIR: i32 = 4;
const TWO_PI: f32 = 6.283185307179586;

struct HbaoUniforms {
  view    : mat4x4<f32>,  // offset   0
  proj    : mat4x4<f32>,  // offset  64
  inv_proj: mat4x4<f32>,  // offset 128
  radius  : f32,          // offset 192
  bias    : f32,          // offset 196 — tangent angle bias in radians
  strength: f32,          // offset 200
  _pad    : f32,
}                          // total 208 bytes

@group(0) @binding(0) var<uniform> u: HbaoUniforms;

@group(1) @binding(0) var normal_tex: texture_2d<f32>;
@group(1) @binding(1) var depth_tex : texture_depth_2d;
@group(1) @binding(2) var noise_tex : texture_2d<f32>;

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

fn view_pos(uv: vec2<f32>, depth: f32) -> vec3<f32> {
  let ndc = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);
  let vh  = u.inv_proj * ndc;
  return vh.xyz / vh.w;
}

fn depth_load_uv(uv: vec2<f32>) -> f32 {
  let size = vec2<i32>(textureDimensions(depth_tex));
  let c    = clamp(vec2<i32>(uv * vec2<f32>(size)), vec2<i32>(0), size - vec2<i32>(1));
  return textureLoad(depth_tex, c, 0);
}

@fragment
fn fs_hbao(in: VertexOutput) -> @location(0) vec4<f32> {
  let half_coord = vec2<i32>(in.clip_pos.xy);
  let coord      = half_coord * 2;
  let depth      = textureLoad(depth_tex, coord, 0);
  if (depth >= 1.0) { return vec4<f32>(1.0, 0.0, 0.0, 1.0); }

  let P = view_pos(in.uv, depth);
  let raw_n   = textureLoad(normal_tex, coord, 0).rgb;
  let world_N = normalize(raw_n * 2.0 - 1.0);
  let N       = normalize((u.view * vec4<f32>(world_N, 0.0)).xyz);

  let noise_coord = vec2<u32>(half_coord) % vec2<u32>(4u);
  let rnd         = textureLoad(noise_tex, noise_coord, 0).rg;

  let tex_size   = vec2<f32>(textureDimensions(depth_tex));
  let proj_scale = u.proj[1][1] * 0.5 * tex_size.y;
  let radius_px  = clamp(u.radius * proj_scale / max(-P.z, 0.01), 4.0, 256.0);
  let step_px    = max(radius_px / f32(STEPS_PER_DIR), 1.0);

  let sin_bias = sin(u.bias);
  var ao_accum: f32 = 0.0;

  for (var d: i32 = 0; d < NUM_DIRS; d++) {
    // Direction angle in [0, 2π) jittered per pixel.
    let phi   = (f32(d) + rnd.x) * (TWO_PI / f32(NUM_DIRS));
    let omega = vec2<f32>(cos(phi), sin(phi));

    // Track max sin(angle above tangent plane) along this direction.
    var sin_h: f32 = -1.0;

    for (var step_i: i32 = 1; step_i <= STEPS_PER_DIR; step_i++) {
      let off  = (f32(step_i) - 0.5 + rnd.y) * step_px;
      let uv_s = clamp(in.uv + omega * off / tex_size, vec2<f32>(0.0), vec2<f32>(1.0));
      let ps   = view_pos(uv_s, depth_load_uv(uv_s));
      let D    = ps - P;
      let len  = length(D);
      if (len > u.radius * 2.0 || len < 1e-5) { continue; }

      // sin(angle from tangent plane) = (D · N) / |D|.
      let s = dot(D, N) / len;

      // Range attenuation softens the horizon contribution past ~radius.
      let attn = 1.0 - smoothstep(0.0, u.radius * 2.0, len);
      sin_h = max(sin_h, s * attn);
    }

    // Visible angular extent above tangent plane = sin_h, minus a bias to
    // suppress self-occlusion on flat surfaces. Negative contributions are
    // clamped (the sample is below the tangent plane → no occlusion).
    ao_accum += max(sin_h - sin_bias, 0.0);
  }

  let occlusion  = (ao_accum / f32(NUM_DIRS)) * u.strength;
  let ao_factor  = clamp(1.0 - occlusion, 0.0, 1.0);
  return vec4<f32>(ao_factor, 0.0, 0.0, 1.0);
}
`,O="r8unorm",he=208;function me(){const a=new Uint8Array(64);for(let u=0;u<16;u++)a[u*4+0]=Math.round(Math.random()*255),a[u*4+1]=Math.round(Math.random()*255),a[u*4+2]=128,a[u*4+3]=255;return a}class U extends z{constructor(e,r,t,d,f,c,h,s,i,n,l,o){super();m(this,"name","HBAOPlusPass");m(this,"_hbaoPipeline");m(this,"_blurHPipeline");m(this,"_blurVPipeline");m(this,"_boxBlurPipeline");m(this,"_blurQuality");m(this,"_uniformBuffer");m(this,"_noiseTex");m(this,"_noiseView");m(this,"_hbaoBgl1");m(this,"_blurBgl");m(this,"_hbaoBg0");m(this,"_blurSampler");m(this,"_cameraScratch",new Float32Array(48));m(this,"_paramsScratch",new Float32Array(4));this._hbaoPipeline=e,this._blurHPipeline=r,this._blurVPipeline=t,this._boxBlurPipeline=d,this._blurQuality=o,this._uniformBuffer=f,this._noiseTex=c,this._noiseView=h,this._hbaoBgl1=s,this._blurBgl=i,this._hbaoBg0=n,this._blurSampler=l}static create(e,r="quality"){const{device:t}=e,d=t.createTexture({label:"HbaoNoise",size:{width:4,height:4},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});t.queue.writeTexture({texture:d},me().buffer,{bytesPerRow:4*4,rowsPerImage:4},{width:4,height:4});const f=d.createView(),c=t.createBuffer({label:"HbaoUniforms",size:he,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});t.queue.writeBuffer(c,192,new Float32Array([1,.1,2,0]).buffer);const h=t.createSampler({label:"HbaoBlurSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),s=t.createBindGroupLayout({label:"HbaoBGL0",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),i=t.createBindGroupLayout({label:"HbaoBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),n=t.createBindGroupLayout({label:"HbaoBlurBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),l=e.createShaderModule(pe,"HbaoShader"),o=e.createShaderModule(I,"HbaoBlurShader"),p=t.createRenderPipeline({label:"HbaoPipeline",layout:t.createPipelineLayout({bindGroupLayouts:[s,i]}),vertex:{module:l,entryPoint:"vs_main"},fragment:{module:l,entryPoint:"fs_hbao",targets:[{format:O}]},primitive:{topology:"triangle-list"}}),g=t.createRenderPipeline({label:"HbaoBlurHPipeline",layout:t.createPipelineLayout({bindGroupLayouts:[n]}),vertex:{module:o,entryPoint:"vs_main"},fragment:{module:o,entryPoint:"fs_blur_h",targets:[{format:O}]},primitive:{topology:"triangle-list"}}),B=t.createRenderPipeline({label:"HbaoBlurVPipeline",layout:t.createPipelineLayout({bindGroupLayouts:[n]}),vertex:{module:o,entryPoint:"vs_main"},fragment:{module:o,entryPoint:"fs_blur_v",targets:[{format:O}]},primitive:{topology:"triangle-list"}}),w=t.createRenderPipeline({label:"HbaoBoxBlurPipeline",layout:t.createPipelineLayout({bindGroupLayouts:[n]}),vertex:{module:o,entryPoint:"vs_main"},fragment:{module:o,entryPoint:"fs_blur",targets:[{format:O}]},primitive:{topology:"triangle-list"}}),G=t.createBindGroup({label:"HbaoBG0",layout:s,entries:[{binding:0,resource:{buffer:c}}]});return new U(p,g,B,w,c,d,f,i,n,G,h,r)}updateCamera(e){const r=e.activeCamera;if(!r)throw new Error("HBAOPlusPass.updateCamera: ctx.activeCamera is null");const t=this._cameraScratch;t.set(r.viewMatrix().data,0),t.set(r.projectionMatrix().data,16),t.set(r.inverseProjectionMatrix().data,32),e.device.queue.writeBuffer(this._uniformBuffer,0,t.buffer)}setBlurQuality(e){this._blurQuality=e}updateParams(e,r=1,t=.1,d=2){this._paramsScratch[0]=r,this._paramsScratch[1]=t,this._paramsScratch[2]=d,this._paramsScratch[3]=0,e.device.queue.writeBuffer(this._uniformBuffer,192,this._paramsScratch.buffer)}addToGraph(e,r){const{ctx:t}=e,d=Math.max(1,t.width>>1),f=Math.max(1,t.height>>1),c={format:O,width:d,height:f};let h,s;if(e.addPass("HBAOPlusPass.raw","render",i=>{h=i.createTexture({label:"HbaoRaw",...c}),h=i.write(h,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[1,0,0,1]}),i.read(r.normal,"sampled"),i.read(r.depth,"sampled"),i.setExecute((n,l)=>{const o=l.getOrCreateBindGroup({label:"HbaoBG1",layout:this._hbaoBgl1,entries:[{binding:0,resource:l.getTextureView(r.normal)},{binding:1,resource:l.getTextureView(r.depth)},{binding:2,resource:this._noiseView}]}),p=n.renderPassEncoder;p.setPipeline(this._hbaoPipeline),p.setBindGroup(0,this._hbaoBg0),p.setBindGroup(1,o),p.draw(3)})}),this._blurQuality==="quality"){let i;e.addPass("HBAOPlusPass.blurH","render",n=>{i=n.createTexture({label:"HbaoBlurH",...c}),i=n.write(i,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[1,0,0,1]}),n.read(h,"sampled"),n.read(r.depth,"sampled"),n.setExecute((l,o)=>{const p=o.getOrCreateBindGroup({label:"HbaoBlurHBG",layout:this._blurBgl,entries:[{binding:0,resource:o.getTextureView(h)},{binding:1,resource:o.getTextureView(r.depth)},{binding:2,resource:this._blurSampler}]}),g=l.renderPassEncoder;g.setPipeline(this._blurHPipeline),g.setBindGroup(0,p),g.draw(3)})}),e.addPass("HBAOPlusPass.blurV","render",n=>{s=n.createTexture({label:"HbaoBlurred",...c}),s=n.write(s,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[1,0,0,1]}),n.read(i,"sampled"),n.read(r.depth,"sampled"),n.setExecute((l,o)=>{const p=o.getOrCreateBindGroup({label:"HbaoBlurVBG",layout:this._blurBgl,entries:[{binding:0,resource:o.getTextureView(i)},{binding:1,resource:o.getTextureView(r.depth)},{binding:2,resource:this._blurSampler}]}),g=l.renderPassEncoder;g.setPipeline(this._blurVPipeline),g.setBindGroup(0,p),g.draw(3)})})}else e.addPass("HBAOPlusPass.boxBlur","render",i=>{s=i.createTexture({label:"HbaoBoxBlurred",...c}),s=i.write(s,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[1,0,0,1]}),i.read(h,"sampled"),i.read(r.depth,"sampled"),i.setExecute((n,l)=>{const o=l.getOrCreateBindGroup({label:"HbaoBoxBlurBG",layout:this._blurBgl,entries:[{binding:0,resource:l.getTextureView(h)},{binding:1,resource:l.getTextureView(r.depth)},{binding:2,resource:this._blurSampler}]}),p=n.renderPassEncoder;p.setPipeline(this._boxBlurPipeline),p.setBindGroup(0,o),p.draw(3)})});return{ao:s}}destroy(){this._uniformBuffer.destroy(),this._noiseTex.destroy()}}const L={ssao:.005,gtao:.1,"hbao+":.1,off:.005};async function fe(){const a=document.getElementById("canvas"),u=document.getElementById("stats"),e=await Q.create(a,{enableErrorHandling:!0}),r=e.device,t=new W(r),d=await $.load(r,K,X,Z,J),f=ge(12648430,.4),c=ae.create(e,d),h=re.create(e),s=ie.create(e,"quality"),i=A.create(e,"quality"),n=U.create(e,"quality"),l=oe.create(e),o=se.create(e);o.setFixedExposure(1);const p=le.create(e);p.depthFogEnabled=!1,c.addChunk(f,f.generateVertices());const g=new y(P.CHUNK_WIDTH*.5,P.CHUNK_HEIGHT*.5,P.CHUNK_DEPTH*.5),B=new ee({name:"Camera"}),w=B.addComponent(te.createPerspective(60,.1,200,e.width/e.height)),G=be(a,g,28,Math.PI/4,.55),H=new y(.3,-.9,.4).normalize(),_={algorithm:"ssao",blur:"quality",radius:1,bias:L.ssao,strength:2,viewDebugAO:!0};ve(_),new ResizeObserver(()=>{const x=Math.max(1,Math.round(a.clientWidth*devicePixelRatio)),S=Math.max(1,Math.round(a.clientHeight*devicePixelRatio));x===a.width&&S===a.height||(a.width=x,a.height=S,t.trimUnused())}).observe(a);function N(){e.update(),u.textContent=`FPS ${e.fps.toFixed(0)}
algo ${_.algorithm}
blur ${_.blur}
view ${_.viewDebugAO?"debug-AO":"lit"}`,G.applyTo(B),w.updateRender(e),e.activeCamera=w,c.updateCamera(e);const x=_.blur;switch(_.algorithm){case"ssao":s.setBlurQuality(x),s.updateCamera(e),s.updateParams(e,_.radius,_.bias,_.strength);break;case"gtao":i.setBlurQuality(x),i.updateCamera(e),i.updateParams(e,_.radius,_.bias,_.strength);break;case"hbao+":n.setBlurQuality(x),n.updateCamera(e),n.updateParams(e,_.radius,_.bias,_.strength);break;case"off":s.setBlurQuality(x),s.updateCamera(e),s.updateParams(e,_.radius,_.bias,0);break}const S=_e(g,H);l.updateCamera(e),l.updateLight(e,H,{x:1,y:.95,z:.85},3,S,!1),o.update(e),p.updateParams(e,!1,0,!0,_.viewDebugAO,e.hdr);const b=new Y(e,t),F=b.setBackbuffer("canvas"),D=h.addToGraph(b,{cascades:S,drawItems:[]}),v=c.addToGraph(b,{loadOp:"clear"});let T;switch(_.algorithm){case"gtao":T=i.addToGraph(b,{normal:v.normal,depth:v.depth}).ao;break;case"hbao+":T=n.addToGraph(b,{normal:v.normal,depth:v.depth}).ao;break;default:T=s.addToGraph(b,{normal:v.normal,depth:v.depth}).ao;break}const M=l.addToGraph(b,{gbuffer:v,shadowMap:D.shadowMap,ao:T}),j=o.addToGraph(b,{hdr:M.hdr});p.addToGraph(b,{input:M.hdr,ao:T,depth:v.depth,cameraBuffer:M.cameraBuffer,lightBuffer:M.lightBuffer,exposureBuffer:j.exposureBuffer,backbuffer:F}),b.execute(b.compile()),requestAnimationFrame(N)}requestAnimationFrame(N)}function ge(a,u){const e=new P(0,0,0),r=new ne(a),t=[E.STONE,E.DIRT,E.SAND,E.SPRUCE_PLANKS,E.OBSIDIAN];for(let d=0;d<P.CHUNK_DEPTH;d++)for(let f=0;f<P.CHUNK_HEIGHT;f++)for(let c=0;c<P.CHUNK_WIDTH;c++){if(!(r.randomFloat()<u))continue;const s=t[r.randomUint32()%t.length];e.setBlock(c,f,d,s)}return e}function _e(a,u){const r=new y(a.x-u.x*40,a.y-u.y*40,a.z-u.z*40),t=C.lookAt(r,a,new y(0,1,0));return[{lightViewProj:C.orthographic(-16,16,-16,16,1,40*2).multiply(t),splitFar:200,depthRange:40*2-1,texelWorldSize:32/1024}]}function be(a,u,e,r,t){let d=e,f=r,c=t,h=!1,s=0,i=0;return a.addEventListener("mousedown",n=>{h=!0,s=n.clientX,i=n.clientY}),window.addEventListener("mouseup",()=>{h=!1}),window.addEventListener("mousemove",n=>{if(!h)return;const l=n.clientX-s,o=n.clientY-i;s=n.clientX,i=n.clientY,f-=l*.005,c=Math.max(-Math.PI/2+.05,Math.min(Math.PI/2-.05,c+o*.005))}),a.addEventListener("wheel",n=>{n.preventDefault(),d=Math.max(2,Math.min(120,d*Math.exp(n.deltaY*.001)))},{passive:!1}),{applyTo(n){const l=Math.cos(c),o=new y(u.x+d*l*Math.sin(f),u.y+d*Math.sin(c),u.z+d*l*Math.cos(f));n.position.set(o.x,o.y,o.z);const p=R.fromAxisAngle(new y(0,1,0),f),g=R.fromAxisAngle(new y(1,0,0),-c);n.rotation=p.multiply(g)}}}function ve(a){const u=document.getElementById("algo"),e=document.getElementById("blur"),r=document.getElementById("radius"),t=document.getElementById("radiusVal"),d=document.getElementById("bias"),f=document.getElementById("biasVal"),c=document.getElementById("strength"),h=document.getElementById("strengthVal"),s=document.getElementById("view");u.addEventListener("change",()=>{a.algorithm=u.value,a.bias=L[a.algorithm],d.value=a.bias.toString(),f.textContent=a.bias.toFixed(3)}),e.addEventListener("change",()=>{a.blur=e.value}),r.addEventListener("input",()=>{a.radius=parseFloat(r.value),t.textContent=a.radius.toFixed(2)}),d.addEventListener("input",()=>{a.bias=parseFloat(d.value),f.textContent=a.bias.toFixed(3)}),c.addEventListener("input",()=>{a.strength=parseFloat(c.value),h.textContent=a.strength.toFixed(1)}),s.addEventListener("change",()=>{a.viewDebugAO=s.value==="ao"})}fe().catch(a=>{document.body.innerHTML=`<pre style="color:#f55;padding:1rem;font-family:ui-monospace,monospace">${(a==null?void 0:a.message)??a}</pre>`,console.error(a)});
