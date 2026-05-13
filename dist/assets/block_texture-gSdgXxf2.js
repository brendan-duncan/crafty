var De=Object.defineProperty;var ze=(f,c,n)=>c in f?De(f,c,{enumerable:!0,configurable:!0,writable:!0,value:n}):f[c]=n;var t=(f,c,n)=>ze(f,typeof c!="symbol"?c+"":c,n);import{V as U,e as ne,a as H,c as ke,d as He}from"./mesh-LUU9vCQq.js";import{a as ye}from"./scene-Cs-jjS8T.js";import{H as T}from"./deferred_lighting_pass-67zBdndm.js";import{T as K}from"./hdr_loader-BebuUkhF.js";const Rt=""+new URL("simple_block_atlas-B-7juoTN.png",import.meta.url).href,Mt=""+new URL("simple_block_atlas_normal-BdCvGD-K.png",import.meta.url).href,Nt=""+new URL("simple_block_atlas_mer-C_Oa_Ink.png",import.meta.url).href,Ot=""+new URL("simple_block_atlas_heightmap-BOV6qQJl.png",import.meta.url).href,je=[new U(1,0,0),new U(-1,0,0),new U(0,1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1)],qe=[new U(0,-1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1),new U(0,-1,0),new U(0,-1,0)];class It extends ye{constructor(){super(...arguments);t(this,"color",U.one());t(this,"intensity",1);t(this,"radius",10);t(this,"castShadow",!1)}worldPosition(){return this.gameObject.localToWorld().transformPoint(U.ZERO)}cubeFaceViewProjs(n=.05){const i=this.worldPosition(),e=ne.perspective(Math.PI/2,1,n,this.radius),a=new Array(6);for(let r=0;r<6;r++)a[r]=e.multiply(ne.lookAt(i,i.add(je[r]),qe[r]));return a}}class Ct extends ye{constructor(){super(...arguments);t(this,"color",U.one());t(this,"intensity",1);t(this,"range",20);t(this,"innerAngle",15);t(this,"outerAngle",30);t(this,"castShadow",!1);t(this,"projectionTexture",null)}worldPosition(){return this.gameObject.localToWorld().transformPoint(U.ZERO)}worldDirection(){return this.gameObject.localToWorld().transformDirection(U.FORWARD).normalize()}lightViewProj(n=.1){const i=this.worldPosition(),e=this.worldDirection(),a=Math.abs(e.y)>.99?U.RIGHT:U.UP,r=ne.lookAt(i,i.add(e),a);return ne.perspective(this.outerAngle*2*Math.PI/180,1,n,this.range).multiply(r)}}const We=`// TAA resolve pass — fullscreen triangle, blends current HDR with reprojected history.

struct TAAUniforms {
  invViewProj : mat4x4<f32>, // current frame, un-jittered
  prevViewProj: mat4x4<f32>, // previous frame, un-jittered
}

@group(0) @binding(0) var<uniform> taa : TAAUniforms;

@group(1) @binding(0) var current_hdr   : texture_2d<f32>;
@group(1) @binding(1) var history_tex   : texture_2d<f32>;
@group(1) @binding(2) var depth_tex     : texture_depth_2d;
@group(1) @binding(3) var linear_sampler: sampler;

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

fn reconstruct_world_pos(uv: vec2<f32>, depth: f32) -> vec4<f32> {
  let ndc = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);
  return taa.invViewProj * ndc;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let coord = vec2<i32>(in.clip_pos.xy);

  let current = textureLoad(current_hdr, coord, 0).rgb;

  // Background: no history to blend
  let depth = textureLoad(depth_tex, coord, 0);
  if (depth >= 1.0) {
    return vec4<f32>(current, 1.0);
  }

  // 3x3 neighborhood AABB for history clamping
  var c_min = current;
  var c_max = current;
  for (var dy = -1; dy <= 1; dy++) {
    for (var dx = -1; dx <= 1; dx++) {
      if (dx == 0 && dy == 0) { continue; }
      let s = textureLoad(current_hdr, coord + vec2<i32>(dx, dy), 0).rgb;
      c_min = min(c_min, s);
      c_max = max(c_max, s);
    }
  }

  // Reconstruct world position and reproject into previous frame
  let world_h   = reconstruct_world_pos(in.uv, depth);
  let world_pos = world_h.xyz / world_h.w;

  let prev_clip = taa.prevViewProj * vec4<f32>(world_pos, 1.0);
  let prev_ndc  = prev_clip.xyz / prev_clip.w;
  let prev_uv   = vec2<f32>(prev_ndc.x * 0.5 + 0.5, -prev_ndc.y * 0.5 + 0.5);

  // Outside previous frustum → accept current frame fully
  let in_bounds = prev_uv.x >= 0.0 && prev_uv.x <= 1.0
               && prev_uv.y >= 0.0 && prev_uv.y <= 1.0;
  if (!in_bounds) {
    return vec4<f32>(current, 1.0);
  }

  var history = textureSampleLevel(history_tex, linear_sampler, prev_uv, 0.0).rgb;
  // Clamp history to current neighborhood to suppress ghosting
  history = clamp(history, c_min, c_max);

  // 10% current frame, 90% history
  return vec4<f32>(mix(history, current, 0.1), 1.0);
}
`,ue=128;class we extends H{constructor(n,i,e,a,r,o,u,s,d,m){super();t(this,"name","TAAPass");t(this,"_resolved");t(this,"resolvedView");t(this,"_history");t(this,"_historyView");t(this,"_pipeline");t(this,"_uniformBuffer");t(this,"_uniformBG");t(this,"_textureBG");t(this,"_width");t(this,"_height");t(this,"_scratch",new Float32Array(ue/4));this._resolved=n,this.resolvedView=i,this._history=e,this._historyView=a,this._pipeline=r,this._uniformBuffer=o,this._uniformBG=u,this._textureBG=s,this._width=d,this._height=m}get historyView(){return this._historyView}static create(n,i,e){const{device:a,width:r,height:o}=n,u=a.createTexture({label:"TAA Resolved",size:{width:r,height:o},format:T,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),s=a.createTexture({label:"TAA History",size:{width:r,height:o},format:T,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),d=u.createView(),m=s.createView(),l=a.createBuffer({label:"TAAUniformBuffer",size:ue,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),p=a.createBindGroupLayout({label:"TAAUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),g=a.createBindGroupLayout({label:"TAATextureBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),h=a.createSampler({label:"TAALinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),b=a.createBindGroup({layout:p,entries:[{binding:0,resource:{buffer:l}}]}),_=a.createBindGroup({layout:g,entries:[{binding:0,resource:i.hdrView},{binding:1,resource:m},{binding:2,resource:e.depthView},{binding:3,resource:h}]}),y=a.createShaderModule({label:"TAAShader",code:We}),v=a.createRenderPipeline({label:"TAAPipeline",layout:a.createPipelineLayout({bindGroupLayouts:[p,g]}),vertex:{module:y,entryPoint:"vs_main"},fragment:{module:y,entryPoint:"fs_main",targets:[{format:T}]},primitive:{topology:"triangle-list"}});return new we(u,d,s,m,v,l,b,_,r,o)}updateCamera(n,i,e){const a=this._scratch;a.set(i.data,0),a.set(e.data,16),n.queue.writeBuffer(this._uniformBuffer,0,a.buffer)}execute(n,i){const e=n.beginRenderPass({label:"TAAPass",colorAttachments:[{view:this.resolvedView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});e.setPipeline(this._pipeline),e.setBindGroup(0,this._uniformBG),e.setBindGroup(1,this._textureBG),e.draw(3),e.end(),n.copyTextureToTexture({texture:this._resolved},{texture:this._history},{width:this._width,height:this._height})}destroy(){this._resolved.destroy(),this._history.destroy(),this._uniformBuffer.destroy()}}const $e=`// Bloom: prefilter (downsample + threshold) and separable Gaussian blur.
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
`,Xe=`// Bloom composite: adds the blurred bright regions back to the source HDR.

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
`,Ye=16;class Pe extends H{constructor(n,i,e,a,r,o,u,s,d,m,l,p,g,h,b){super();t(this,"name","BloomPass");t(this,"resultView");t(this,"_result");t(this,"_half1");t(this,"_half2");t(this,"_half1View");t(this,"_half2View");t(this,"_prefilterPipeline");t(this,"_blurHPipeline");t(this,"_blurVPipeline");t(this,"_compositePipeline");t(this,"_uniformBuffer");t(this,"_scratch",new Float32Array(4));t(this,"_prefilterBG");t(this,"_blurHBG");t(this,"_blurVBG");t(this,"_compositeBG");this._result=n,this.resultView=i,this._half1=e,this._half1View=a,this._half2=r,this._half2View=o,this._prefilterPipeline=u,this._blurHPipeline=s,this._blurVPipeline=d,this._compositePipeline=m,this._uniformBuffer=l,this._prefilterBG=p,this._blurHBG=g,this._blurVBG=h,this._compositeBG=b}static create(n,i){const{device:e,width:a,height:r}=n,o=Math.max(1,a>>1),u=Math.max(1,r>>1),s=e.createTexture({label:"BloomHalf1",size:{width:o,height:u},format:T,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),d=e.createTexture({label:"BloomHalf2",size:{width:o,height:u},format:T,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),m=e.createTexture({label:"BloomResult",size:{width:a,height:r},format:T,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),l=s.createView(),p=d.createView(),g=m.createView(),h=e.createBuffer({label:"BloomUniforms",size:Ye,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(h,0,new Float32Array([1,.5,.3,0]).buffer);const b=e.createSampler({label:"BloomSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),_=e.createBindGroupLayout({label:"BloomSingleBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),y=e.createBindGroupLayout({label:"BloomCompositeBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),v=e.createShaderModule({label:"BloomShader",code:$e}),P=e.createShaderModule({label:"BloomComposite",code:Xe}),B=e.createPipelineLayout({bindGroupLayouts:[_]}),G=e.createPipelineLayout({bindGroupLayouts:[y]});function x(C,z){return e.createRenderPipeline({label:z,layout:B,vertex:{module:v,entryPoint:"vs_main"},fragment:{module:v,entryPoint:C,targets:[{format:T}]},primitive:{topology:"triangle-list"}})}const S=x("fs_prefilter","BloomPrefilterPipeline"),E=x("fs_blur_h","BloomBlurHPipeline"),V=x("fs_blur_v","BloomBlurVPipeline"),L=e.createRenderPipeline({label:"BloomCompositePipeline",layout:G,vertex:{module:P,entryPoint:"vs_main"},fragment:{module:P,entryPoint:"fs_main",targets:[{format:T}]},primitive:{topology:"triangle-list"}});function M(C){return e.createBindGroup({layout:_,entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:C},{binding:2,resource:b}]})}const N=M(i),F=M(l),O=M(p),I=e.createBindGroup({layout:y,entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:i},{binding:2,resource:l},{binding:3,resource:b}]});return new Pe(m,g,s,l,d,p,S,E,V,L,h,N,F,O,I)}updateParams(n,i=1,e=.5,a=.3){this._scratch[0]=i,this._scratch[1]=e,this._scratch[2]=a,this._scratch[3]=0,n.queue.writeBuffer(this._uniformBuffer,0,this._scratch.buffer)}execute(n,i){const e=(a,r,o,u)=>{const s=n.beginRenderPass({label:a,colorAttachments:[{view:r,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});s.setPipeline(o),s.setBindGroup(0,u),s.draw(3),s.end()};e("BloomPrefilter",this._half1View,this._prefilterPipeline,this._prefilterBG);for(let a=0;a<2;a++)e("BloomBlurH",this._half2View,this._blurHPipeline,this._blurHBG),e("BloomBlurV",this._half1View,this._blurVPipeline,this._blurVBG);e("BloomComposite",this.resultView,this._compositePipeline,this._compositeBG)}destroy(){this._result.destroy(),this._half1.destroy(),this._half2.destroy(),this._uniformBuffer.destroy()}}const Ze=`// Depth of Field: prefilter (CoC + 2x downsample) then fused disc-blur + composite.

struct DofUniforms {
  focus_distance: f32,  // linear depth of sharp plane (world units)
  focus_range   : f32,  // half-range: blur ramps 0→max over this distance on each side
  bokeh_radius  : f32,  // max blur radius in half-res texels
  near          : f32,
  far           : f32,
  _pad1         : f32,
  _pad2         : f32,
  _pad3         : f32,
}

@group(0) @binding(0) var<uniform> dof     : DofUniforms;
@group(0) @binding(1) var          hdr_tex : texture_2d<f32>;
@group(0) @binding(2) var          dep_tex : texture_depth_2d;
@group(0) @binding(3) var          samp    : sampler;
// group 1 is only used by fs_composite; prefilter pipeline has no group 1
@group(1) @binding(0) var          half_tex: texture_2d<f32>;

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

fn linear_depth(ndc_depth: f32) -> f32 {
  return dof.near * dof.far / (dof.far - ndc_depth * (dof.far - dof.near));
}

fn compute_coc(lin_depth: f32) -> f32 {
  return clamp(
    (lin_depth - dof.focus_distance) / max(dof.focus_range, 0.001),
    0.0, 1.0
  ) * dof.bokeh_radius;
}

// Prefilter: 4-tap 2x downsample; RGB = color, A = signed CoC (texels, half-res).
// Negative CoC = in front of focus plane.
@fragment
fn fs_prefilter(in: VertexOutput) -> @location(0) vec4<f32> {
  let full_size = vec2<f32>(textureDimensions(hdr_tex));
  let texel = 1.0 / full_size;
  let o = array<vec2<f32>, 4>(
    vec2<f32>(-0.5, -0.5), vec2<f32>( 0.5, -0.5),
    vec2<f32>(-0.5,  0.5), vec2<f32>( 0.5,  0.5)
  );

  var col = vec3<f32>(0.0);
  var c   = 0.0;
  for (var i = 0; i < 4; i++) {
    let uv = in.uv + o[i] * texel;
    col   += textureSampleLevel(hdr_tex, samp, uv, 0.0).rgb;
    let px = clamp(vec2<u32>(uv * full_size), vec2<u32>(0u), vec2<u32>(full_size) - 1u);
    c     += compute_coc(linear_depth(textureLoad(dep_tex, px, 0)));
  }
  return vec4<f32>(col * 0.25, c * 0.25);
}

// Composite: 48-tap Fibonacci spiral disc blur on the prefiltered half-res texture.
// Radii are sqrt-distributed (uniform area coverage) so there are no discrete rings.
// Per-pixel rotation breaks any residual spiral pattern into noise.
const GOLDEN_ANGLE: f32 = 2.399963229728; // 2π(2 - φ), φ = golden ratio
const NUM_TAPS: i32 = 48;

@fragment
fn fs_composite(in: VertexOutput) -> @location(0) vec4<f32> {
  let sharp  = textureSampleLevel(hdr_tex,  samp, in.uv, 0.0).rgb;
  let center = textureSampleLevel(half_tex, samp, in.uv, 0.0);
  let coc_px = abs(center.a);

  let texel = 1.0 / vec2<f32>(textureDimensions(half_tex));

  // Per-pixel rotation offset — breaks the spiral into spatially-varying noise.
  let coord = vec2<u32>(in.clip_pos.xy);
  let rot   = f32((coord.x * 1619u + coord.y * 7919u) & 63u) * (6.28318 / 64.0);

  var accum  = center.rgb;
  var weight = 1.0;
  for (var i = 0; i < NUM_TAPS; i++) {
    // sqrt distribution → uniform area density, no discrete ring jumps
    let r     = sqrt(f32(i) + 0.5) / sqrt(f32(NUM_TAPS)) * coc_px;
    let theta = f32(i) * GOLDEN_ANGLE + rot;
    let uv2   = in.uv + vec2<f32>(cos(theta), sin(theta)) * r * texel;
    let s     = textureSampleLevel(half_tex, samp, uv2, 0.0);
    let w     = clamp(abs(s.a) / max(dof.bokeh_radius, 0.001), 0.0, 1.0);
    accum  += s.rgb * w;
    weight += w;
  }
  let blurred = accum / weight;

  let blend = smoothstep(0.0, 1.0, coc_px / max(dof.bokeh_radius, 0.001));
  return vec4<f32>(mix(sharp, blurred, blend), 1.0);
}
`,Ke=32;class Be extends H{constructor(n,i,e,a,r,o,u,s,d,m){super();t(this,"name","DofPass");t(this,"resultView");t(this,"_result");t(this,"_half");t(this,"_halfView");t(this,"_prefilterPipeline");t(this,"_compositePipeline");t(this,"_uniformBuffer");t(this,"_scratch",new Float32Array(8));t(this,"_prefilterBG");t(this,"_compBG0");t(this,"_compBG1");this._result=n,this.resultView=i,this._half=e,this._halfView=a,this._prefilterPipeline=r,this._compositePipeline=o,this._uniformBuffer=u,this._prefilterBG=s,this._compBG0=d,this._compBG1=m}static create(n,i,e){const{device:a,width:r,height:o}=n,u=Math.max(1,r>>1),s=Math.max(1,o>>1),d=a.createTexture({label:"DofHalf",size:{width:u,height:s},format:T,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),m=a.createTexture({label:"DofResult",size:{width:r,height:o},format:T,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),l=d.createView(),p=m.createView(),g=a.createBuffer({label:"DofUniforms",size:Ke,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});a.queue.writeBuffer(g,0,new Float32Array([30,60,6,.1,1e3,0,0,0]).buffer);const h=a.createSampler({label:"DofSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),b=a.createBindGroupLayout({label:"DofBGL0Prefilter",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),_=a.createBindGroupLayout({label:"DofBGL0Composite",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),y=a.createBindGroupLayout({label:"DofBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),v=a.createShaderModule({label:"DofShader",code:Ze}),P=a.createRenderPipeline({label:"DofPrefilterPipeline",layout:a.createPipelineLayout({bindGroupLayouts:[b]}),vertex:{module:v,entryPoint:"vs_main"},fragment:{module:v,entryPoint:"fs_prefilter",targets:[{format:T}]},primitive:{topology:"triangle-list"}}),B=a.createRenderPipeline({label:"DofCompositePipeline",layout:a.createPipelineLayout({bindGroupLayouts:[_,y]}),vertex:{module:v,entryPoint:"vs_main"},fragment:{module:v,entryPoint:"fs_composite",targets:[{format:T}]},primitive:{topology:"triangle-list"}}),G=a.createBindGroup({label:"DofPrefilterBG",layout:b,entries:[{binding:0,resource:{buffer:g}},{binding:1,resource:i},{binding:2,resource:e},{binding:3,resource:h}]}),x=a.createBindGroup({label:"DofCompBG0",layout:_,entries:[{binding:0,resource:{buffer:g}},{binding:1,resource:i},{binding:3,resource:h}]}),S=a.createBindGroup({label:"DofCompBG1",layout:y,entries:[{binding:0,resource:l}]});return new Be(m,p,d,l,P,B,g,G,x,S)}updateParams(n,i=30,e=60,a=6,r=.1,o=1e3,u=1){this._scratch[0]=i,this._scratch[1]=e,this._scratch[2]=a,this._scratch[3]=r,this._scratch[4]=o,this._scratch[5]=u,this._scratch[6]=0,this._scratch[7]=0,n.device.queue.writeBuffer(this._uniformBuffer,0,this._scratch.buffer)}execute(n,i){{const e=n.beginRenderPass({label:"DofPrefilter",colorAttachments:[{view:this._halfView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]});e.setPipeline(this._prefilterPipeline),e.setBindGroup(0,this._prefilterBG),e.draw(3),e.end()}{const e=n.beginRenderPass({label:"DofComposite",colorAttachments:[{view:this.resultView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});e.setPipeline(this._compositePipeline),e.setBindGroup(0,this._compBG0),e.setBindGroup(1,this._compBG1),e.draw(3),e.end()}}destroy(){this._result.destroy(),this._half.destroy(),this._uniformBuffer.destroy()}}const Je=`// SSAO: hemisphere sampling in view space.
// Reads GBuffer depth + normals, writes raw AO value [0,1].

const KERNEL_SIZE: i32 = 16;

struct SsaoUniforms {
  view    : mat4x4<f32>,  // offset   0
  proj    : mat4x4<f32>,  // offset  64
  inv_proj: mat4x4<f32>,  // offset 128
  radius  : f32,          // offset 192
  bias    : f32,          // offset 196
  strength: f32,          // offset 200
  _pad    : f32,          // offset 204
  kernel  : array<vec4<f32>, 16>, // offset 208 (256 bytes)
}                          // total: 464 bytes

@group(0) @binding(0) var<uniform> ssao: SsaoUniforms;

@group(1) @binding(0) var normal_tex: texture_2d<f32>;   // GBuffer normalMetallic (rgba16float)
@group(1) @binding(1) var depth_tex : texture_depth_2d;  // GBuffer depth (depth32float)
@group(1) @binding(2) var noise_tex : texture_2d<f32>;   // 4×4 random rotation vectors (rgba8unorm)

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

// Reconstruct view-space position from UV + NDC depth.
// WebGPU NDC: Y is up, depth [0,1]. UV: Y is down.
fn view_pos(uv: vec2<f32>, depth: f32) -> vec3<f32> {
  let ndc = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);
  let vh  = ssao.inv_proj * ndc;
  return vh.xyz / vh.w;
}

@fragment
fn fs_ssao(in: VertexOutput) -> @location(0) vec4<f32> {
  // This pass runs at half resolution. clip_pos is in half-res pixel space;
  // GBuffer textures are full-res so multiply by 2 to address them correctly.
  let half_coord = vec2<i32>(in.clip_pos.xy);
  let coord      = half_coord * 2;
  let depth = textureLoad(depth_tex, coord, 0);

  // Sky pixels → full AO (no occlusion)
  if (depth >= 1.0) { return vec4<f32>(1.0, 0.0, 0.0, 1.0); }

  let P = view_pos(in.uv, depth);

  // Decode world-space normal (stored as N*0.5+0.5), transform to view space
  let raw_n   = textureLoad(normal_tex, coord, 0).rgb;
  let world_N = normalize(raw_n * 2.0 - 1.0);
  let N       = normalize((ssao.view * vec4<f32>(world_N, 0.0)).xyz);

  // Tiled 4×4 noise using half-res coords so the pattern tiles the full screen.
  let noise_coord = vec2<u32>(half_coord) % vec2<u32>(4u);
  let rnd         = textureLoad(noise_tex, noise_coord, 0).rg * 2.0 - 1.0;

  // Gram-Schmidt: build orthonormal tangent frame from random vector + N
  let rand_vec = vec3<f32>(rnd, 0.0);
  let T = normalize(rand_vec - N * dot(rand_vec, N));
  let B = cross(N, T);
  // TBN columns [T, B, N] maps from tangent space to view space
  let tbn = mat3x3<f32>(T, B, N);

  let tex_size = vec2<f32>(textureDimensions(depth_tex));
  var occlusion = 0.0;

  for (var i = 0; i < KERNEL_SIZE; i++) {
    // View-space sample: kernel.z aligns with N (hemisphere above surface)
    let sample_vs = P + (tbn * ssao.kernel[i].xyz) * ssao.radius;

    // Project sample to screen UV
    let clip       = ssao.proj * vec4<f32>(sample_vs, 1.0);
    let ndc_xy     = clip.xy / clip.w;
    let sample_uv  = vec2<f32>(ndc_xy.x * 0.5 + 0.5, -ndc_xy.y * 0.5 + 0.5);

    // Sample depth at that UV and reconstruct view-space Z
    let sc        = clamp(vec2<i32>(sample_uv * tex_size), vec2<i32>(0), vec2<i32>(tex_size) - 1);
    let ref_depth = textureLoad(depth_tex, sc, 0);
    let ref_z     = view_pos(sample_uv, ref_depth).z;

    // Range check: weight falls to 0 when ref surface is beyond radius (different geometry).
    // Inverted smoothstep avoids the reciprocal spike that caused self-occlusion on flat faces.
    let range_check = 1.0 - smoothstep(0.0, ssao.radius, abs(P.z - ref_z));

    // Right-handed view space: closer to camera = higher (less negative) Z.
    // Occlude when actual geometry is closer to camera than the sample point (sample is inside geometry).
    // Using sample_vs.z rather than P.z makes the check slope-invariant: the sample already sits
    // above the surface, so same-surface pixels always satisfy ref_z < sample_vs.z regardless of tilt.
    occlusion += select(0.0, 1.0, ref_z > sample_vs.z + ssao.bias) * range_check;
  }

  let ao = clamp(1.0 - (occlusion / f32(KERNEL_SIZE)) * ssao.strength, 0.0, 1.0);
  return vec4<f32>(ao, 0.0, 0.0, 1.0);
}
`,Qe=`// SSAO blur: 4×4 box blur to smooth raw SSAO output.

@group(0) @binding(0) var ao_tex: texture_2d<f32>;
@group(0) @binding(1) var samp  : sampler;

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
fn fs_blur(in: VertexOutput) -> @location(0) vec4<f32> {
  let texel = 1.0 / vec2<f32>(textureDimensions(ao_tex));
  var ao = 0.0;
  for (var y = -1; y <= 2; y++) {
    for (var x = -1; x <= 2; x++) {
      ao += textureSampleLevel(ao_tex, samp, in.uv + vec2<f32>(f32(x), f32(y)) * texel, 0.0).r;
    }
  }
  return vec4<f32>(ao / 16.0, 0.0, 0.0, 1.0);
}
`,J="r8unorm",se=16,et=464;function tt(){const f=new Float32Array(se*4);for(let c=0;c<se;c++){const n=Math.random(),i=Math.random()*Math.PI*2,e=Math.sqrt(1-n*n),a=.1+.9*(c/se)**2;f[c*4+0]=e*Math.cos(i)*a,f[c*4+1]=e*Math.sin(i)*a,f[c*4+2]=n*a,f[c*4+3]=0}return f}function rt(){const f=new Uint8Array(64);for(let c=0;c<16;c++){const n=Math.random()*Math.PI*2;f[c*4+0]=Math.round((Math.cos(n)*.5+.5)*255),f[c*4+1]=Math.round((Math.sin(n)*.5+.5)*255),f[c*4+2]=128,f[c*4+3]=255}return f}class Ge extends H{constructor(n,i,e,a,r,o,u,s,d,m,l){super();t(this,"name","SSAOPass");t(this,"aoView");t(this,"_raw");t(this,"_blurred");t(this,"_rawView");t(this,"_ssaoPipeline");t(this,"_blurPipeline");t(this,"_uniformBuffer");t(this,"_noiseTex");t(this,"_cameraScratch",new Float32Array(48));t(this,"_paramsScratch",new Float32Array(4));t(this,"_ssaoBG0");t(this,"_ssaoBG1");t(this,"_blurBG");this._raw=n,this._rawView=i,this._blurred=e,this.aoView=a,this._ssaoPipeline=r,this._blurPipeline=o,this._uniformBuffer=u,this._noiseTex=s,this._ssaoBG0=d,this._ssaoBG1=m,this._blurBG=l}static create(n,i){const{device:e,width:a,height:r}=n,o=Math.max(1,a>>1),u=Math.max(1,r>>1),s=e.createTexture({label:"SsaoRaw",size:{width:o,height:u},format:J,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),d=e.createTexture({label:"SsaoBlurred",size:{width:o,height:u},format:J,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),m=s.createView(),l=d.createView(),p=e.createTexture({label:"SsaoNoise",size:{width:4,height:4},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});e.queue.writeTexture({texture:p},rt().buffer,{bytesPerRow:4*4,rowsPerImage:4},{width:4,height:4});const g=p.createView(),h=e.createBuffer({label:"SsaoUniforms",size:et,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(h,208,tt().buffer),e.queue.writeBuffer(h,192,new Float32Array([1,.005,2,0]).buffer);const b=e.createSampler({label:"SsaoBlurSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),_=e.createBindGroupLayout({label:"SsaoBGL0",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),y=e.createBindGroupLayout({label:"SsaoBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),v=e.createBindGroupLayout({label:"SsaoBlurBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),P=e.createShaderModule({label:"SsaoShader",code:Je}),B=e.createShaderModule({label:"SsaoBlurShader",code:Qe}),G=e.createRenderPipeline({label:"SsaoPipeline",layout:e.createPipelineLayout({bindGroupLayouts:[_,y]}),vertex:{module:P,entryPoint:"vs_main"},fragment:{module:P,entryPoint:"fs_ssao",targets:[{format:J}]},primitive:{topology:"triangle-list"}}),x=e.createRenderPipeline({label:"SsaoBlurPipeline",layout:e.createPipelineLayout({bindGroupLayouts:[v]}),vertex:{module:B,entryPoint:"vs_main"},fragment:{module:B,entryPoint:"fs_blur",targets:[{format:J}]},primitive:{topology:"triangle-list"}}),S=e.createBindGroup({label:"SsaoBG0",layout:_,entries:[{binding:0,resource:{buffer:h}}]}),E=e.createBindGroup({label:"SsaoBG1",layout:y,entries:[{binding:0,resource:i.normalMetallicView},{binding:1,resource:i.depthView},{binding:2,resource:g}]}),V=e.createBindGroup({label:"SsaoBlurBG",layout:v,entries:[{binding:0,resource:m},{binding:1,resource:b}]});return new Ge(s,m,d,l,G,x,h,p,S,E,V)}updateCamera(n,i,e,a){const r=this._cameraScratch;r.set(i.data,0),r.set(e.data,16),r.set(a.data,32),n.device.queue.writeBuffer(this._uniformBuffer,0,r.buffer)}updateParams(n,i=1,e=.005,a=2){this._paramsScratch[0]=i,this._paramsScratch[1]=e,this._paramsScratch[2]=a,this._paramsScratch[3]=0,n.device.queue.writeBuffer(this._uniformBuffer,192,this._paramsScratch.buffer)}execute(n,i){{const e=n.beginRenderPass({label:"SSAOPass",colorAttachments:[{view:this._rawView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});e.setPipeline(this._ssaoPipeline),e.setBindGroup(0,this._ssaoBG0),e.setBindGroup(1,this._ssaoBG1),e.draw(3),e.end()}{const e=n.beginRenderPass({label:"SSAOBlur",colorAttachments:[{view:this.aoView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});e.setPipeline(this._blurPipeline),e.setBindGroup(0,this._blurBG),e.draw(3),e.end()}}destroy(){this._raw.destroy(),this._blurred.destroy(),this._uniformBuffer.destroy(),this._noiseTex.destroy()}}const nt=`// Screen-Space Global Illumination — ray march pass.
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
`,it=`// Screen-Space Global Illumination — temporal accumulation pass.
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
`,ce=368,at={numRays:4,numSteps:16,radius:3,thickness:.5,strength:1};function st(){const f=new Uint8Array(new ArrayBuffer(64));for(let c=0;c<16;c++){const n=Math.random()*Math.PI*2;f[c*4+0]=Math.round((Math.cos(n)*.5+.5)*255),f[c*4+1]=Math.round((Math.sin(n)*.5+.5)*255),f[c*4+2]=128,f[c*4+3]=255}return f}class Se extends H{constructor(n,i,e,a,r,o,u,s,d,m,l,p,g,h,b,_){super();t(this,"name","SSGIPass");t(this,"resultView");t(this,"_uniformBuffer");t(this,"_noiseTexture");t(this,"_rawTexture");t(this,"_rawView");t(this,"_historyTexture");t(this,"_resultTexture");t(this,"_ssgiPipeline");t(this,"_temporalPipeline");t(this,"_ssgiBG0");t(this,"_ssgiBG1");t(this,"_tempBG0");t(this,"_tempBG1");t(this,"_settings");t(this,"_frameIndex",0);t(this,"_scratch",new Float32Array(ce/4));t(this,"_scratchU32",new Uint32Array(this._scratch.buffer));t(this,"_width");t(this,"_height");this._uniformBuffer=n,this._noiseTexture=i,this._rawTexture=e,this._rawView=a,this._historyTexture=r,this._resultTexture=o,this.resultView=u,this._ssgiPipeline=s,this._temporalPipeline=d,this._ssgiBG0=m,this._ssgiBG1=l,this._tempBG0=p,this._tempBG1=g,this._settings=h,this._width=b,this._height=_}static create(n,i,e,a=at){const{device:r,width:o,height:u}=n,s=r.createBuffer({label:"SSGIUniforms",size:ce,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),d=r.createTexture({label:"SSGINoise",size:{width:4,height:4},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});r.queue.writeTexture({texture:d},st(),{bytesPerRow:4*4,rowsPerImage:4},{width:4,height:4});const m=d.createView(),l=r.createTexture({label:"SSGIRaw",size:{width:o,height:u},format:T,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),p=l.createView(),g=r.createTexture({label:"SSGIHistory",size:{width:o,height:u},format:T,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),h=g.createView(),b=r.createTexture({label:"SSGIResult",size:{width:o,height:u},format:T,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),_=b.createView(),y=r.createSampler({label:"SSGILinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),v=r.createBindGroupLayout({label:"SSGIUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),P=r.createBindGroupLayout({label:"SSGITexBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),B=r.createBindGroupLayout({label:"SSGITempTexBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),G=r.createBindGroup({label:"SSGIUniformBG",layout:v,entries:[{binding:0,resource:{buffer:s}}]}),x=r.createBindGroup({label:"SSGITexBG",layout:P,entries:[{binding:0,resource:i.depthView},{binding:1,resource:i.normalMetallicView},{binding:2,resource:e},{binding:3,resource:m},{binding:4,resource:y}]}),S=r.createBindGroup({label:"SSGITempUniformBG",layout:v,entries:[{binding:0,resource:{buffer:s}}]}),E=r.createBindGroup({label:"SSGITempTexBG",layout:B,entries:[{binding:0,resource:p},{binding:1,resource:h},{binding:2,resource:i.depthView},{binding:3,resource:y}]}),V=r.createShaderModule({label:"SSGIShader",code:nt}),L=r.createShaderModule({label:"SSGITempShader",code:it}),M=r.createRenderPipeline({label:"SSGIPipeline",layout:r.createPipelineLayout({bindGroupLayouts:[v,P]}),vertex:{module:V,entryPoint:"vs_main"},fragment:{module:V,entryPoint:"fs_ssgi",targets:[{format:T}]},primitive:{topology:"triangle-list"}}),N=r.createRenderPipeline({label:"SSGITempPipeline",layout:r.createPipelineLayout({bindGroupLayouts:[v,B]}),vertex:{module:L,entryPoint:"vs_main"},fragment:{module:L,entryPoint:"fs_temporal",targets:[{format:T}]},primitive:{topology:"triangle-list"}});return new Se(s,d,l,p,g,b,_,M,N,G,x,S,E,a,o,u)}updateCamera(n,i,e,a,r,o,u){const s=this._scratch;s.set(i.data,0),s.set(e.data,16),s.set(a.data,32),s.set(r.data,48),s.set(o.data,64),s[80]=u.x,s[81]=u.y,s[82]=u.z;const d=this._scratchU32;d[83]=this._settings.numRays,d[84]=this._settings.numSteps,s[85]=this._settings.radius,s[86]=this._settings.thickness,s[87]=this._settings.strength,d[88]=this._frameIndex++,n.queue.writeBuffer(this._uniformBuffer,0,s.buffer)}updateSettings(n){this._settings={...this._settings,...n}}execute(n,i){{const e=n.beginRenderPass({label:"SSGIRayMarch",colorAttachments:[{view:this._rawView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]});e.setPipeline(this._ssgiPipeline),e.setBindGroup(0,this._ssgiBG0),e.setBindGroup(1,this._ssgiBG1),e.draw(3),e.end()}{const e=n.beginRenderPass({label:"SSGITemporal",colorAttachments:[{view:this.resultView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]});e.setPipeline(this._temporalPipeline),e.setBindGroup(0,this._tempBG0),e.setBindGroup(1,this._tempBG1),e.draw(3),e.end()}n.copyTextureToTexture({texture:this._resultTexture},{texture:this._historyTexture},{width:this._width,height:this._height})}destroy(){this._uniformBuffer.destroy(),this._noiseTexture.destroy(),this._rawTexture.destroy(),this._historyTexture.destroy(),this._resultTexture.destroy()}}const ot=`// VSM shadow map generation for point and spot lights.
//
// Point light faces: output linear depth (distance/radius) and depth² into rgba16float.
// Spot light maps  : output NDC depth and depth² into rgba16float.
//
// Two pipeline pairs share identical bind group layouts:
//   group 0: ShadowUniforms (lightViewProj + lightPos + lightRadius)
//   group 1: ModelUniforms  (model matrix)

struct ShadowUniforms {
  lightViewProj: mat4x4<f32>,  // offset 0, 64 bytes
  lightPos     : vec3<f32>,    // offset 64, 12 bytes
  lightRadius  : f32,          // offset 76, 4 bytes
}  // 80 bytes

struct ModelUniforms {
  model: mat4x4<f32>,  // 64 bytes
}

@group(0) @binding(0) var<uniform> shadow: ShadowUniforms;
@group(1) @binding(0) var<uniform> model : ModelUniforms;

// ---- Point light (linear depth) -----------------------------------------------

struct PointVaryings {
  @builtin(position) clip    : vec4<f32>,
  @location(0)       worldPos: vec3<f32>,
}

@vertex
fn vs_point(@location(0) pos: vec3<f32>) -> PointVaryings {
  let worldPos = model.model * vec4<f32>(pos, 1.0);
  var out: PointVaryings;
  out.clip     = shadow.lightViewProj * worldPos;
  out.worldPos = worldPos.xyz;
  return out;
}

@fragment
fn fs_point(in: PointVaryings) -> @location(0) vec4<f32> {
  let d = length(in.worldPos - shadow.lightPos) / shadow.lightRadius;
  return vec4<f32>(d, d * d, 0.0, 1.0);
}

// ---- Spot light (NDC depth) ----------------------------------------------------

struct SpotVaryings {
  @builtin(position) clip    : vec4<f32>,
  @location(0)       ndcDepth: f32,
}

@vertex
fn vs_spot(@location(0) pos: vec3<f32>) -> SpotVaryings {
  let worldPos = model.model * vec4<f32>(pos, 1.0);
  let clip     = shadow.lightViewProj * worldPos;
  var out: SpotVaryings;
  out.clip     = clip;
  out.ndcDepth = clip.z / clip.w;
  return out;
}

@fragment
fn fs_spot(in: SpotVaryings) -> @location(0) vec4<f32> {
  let d = in.ndcDepth;
  return vec4<f32>(d, d * d, 0.0, 1.0);
}
`,Q=32,ee=32,$=4,j=8,te=256,re=512,D=256,de=80,lt=64,ut=6*$,ct=ut+j;class Ue extends H{constructor(n,i,e,a,r,o,u,s,d,m,l,p,g,h){super();t(this,"name","PointSpotShadowPass");t(this,"pointVsmView");t(this,"spotVsmView");t(this,"projTexView");t(this,"_pointVsmTex");t(this,"_spotVsmTex");t(this,"_projTexArray");t(this,"_pointDepth");t(this,"_spotDepth");t(this,"_pointFaceViews");t(this,"_spotFaceViews");t(this,"_pointDepthView");t(this,"_spotDepthView");t(this,"_pointPipeline");t(this,"_spotPipeline");t(this,"_shadowBufs");t(this,"_shadowBGs");t(this,"_modelBufs",[]);t(this,"_modelBGs",[]);t(this,"_modelBGL");t(this,"_shadowScratch",new Float32Array(de/4));t(this,"_snapshot",[]);t(this,"_pointLights",[]);t(this,"_spotLights",[]);this._pointVsmTex=n,this._spotVsmTex=i,this._projTexArray=e,this._pointDepth=a,this._spotDepth=r,this._pointFaceViews=o,this._spotFaceViews=u,this._pointDepthView=s,this._spotDepthView=d,this._pointPipeline=m,this._spotPipeline=l,this._shadowBufs=p,this._shadowBGs=g,this._modelBGL=h,this.pointVsmView=n.createView({dimension:"cube-array",arrayLayerCount:$*6}),this.spotVsmView=i.createView({dimension:"2d-array"}),this.projTexView=e.createView({dimension:"2d-array"})}static create(n){const{device:i}=n,e=i.createTexture({label:"PointVSM",size:{width:te,height:te,depthOrArrayLayers:$*6},format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),a=i.createTexture({label:"SpotVSM",size:{width:re,height:re,depthOrArrayLayers:j},format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),r=i.createTexture({label:"ProjTexArray",size:{width:D,height:D,depthOrArrayLayers:j},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),o=new Uint8Array(D*D*4).fill(255);for(let x=0;x<j;x++)i.queue.writeTexture({texture:r,origin:{x:0,y:0,z:x}},o,{bytesPerRow:D*4,rowsPerImage:D},{width:D,height:D,depthOrArrayLayers:1});const u=i.createTexture({label:"PointShadowDepth",size:{width:te,height:te},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),s=i.createTexture({label:"SpotShadowDepth",size:{width:re,height:re},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),d=Array.from({length:$*6},(x,S)=>e.createView({dimension:"2d",baseArrayLayer:S,arrayLayerCount:1})),m=Array.from({length:j},(x,S)=>a.createView({dimension:"2d",baseArrayLayer:S,arrayLayerCount:1})),l=u.createView(),p=s.createView(),g=i.createBindGroupLayout({label:"PSShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),h=i.createBindGroupLayout({label:"PSModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),b=[],_=[];for(let x=0;x<ct;x++){const S=i.createBuffer({label:`PSShadowUniform ${x}`,size:de,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});b.push(S),_.push(i.createBindGroup({label:`PSShadowBG ${x}`,layout:g,entries:[{binding:0,resource:{buffer:S}}]}))}const y=i.createPipelineLayout({bindGroupLayouts:[g,h]}),v=i.createShaderModule({label:"PointSpotShadowShader",code:ot}),P={module:v,buffers:[{arrayStride:He,attributes:[ke[0]]}]},B=i.createRenderPipeline({label:"PointShadowPipeline",layout:y,vertex:{...P,entryPoint:"vs_point"},fragment:{module:v,entryPoint:"fs_point",targets:[{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),G=i.createRenderPipeline({label:"SpotShadowPipeline",layout:y,vertex:{...P,entryPoint:"vs_spot"},fragment:{module:v,entryPoint:"fs_spot",targets:[{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}});return new Ue(e,a,r,u,s,d,m,l,p,B,G,b,_,h)}update(n,i,e){this._pointLights=n,this._spotLights=i,this._snapshot=e}setProjectionTexture(n,i,e){n.copyTextureToTexture({texture:e},{texture:this._projTexArray,origin:{x:0,y:0,z:i}},{width:D,height:D,depthOrArrayLayers:1})}execute(n,i){const{device:e}=i,a=this._snapshot;this._ensureModelBuffers(e,a.length);for(let s=0;s<this._spotLights.length&&s<j;s++){const d=this._spotLights[s];d.projectionTexture&&this.setProjectionTexture(n,s,d.projectionTexture)}for(let s=0;s<a.length;s++)i.queue.writeBuffer(this._modelBufs[s],0,a[s].modelMatrix.data.buffer);let r=0,o=0;for(const s of this._pointLights){if(!s.castShadow||o>=$)continue;const d=s.worldPosition(),m=s.cubeFaceViewProjs(),l=this._shadowScratch;l[16]=d.x,l[17]=d.y,l[18]=d.z,l[19]=s.radius;for(let p=0;p<6;p++){l.set(m[p].data,0),i.queue.writeBuffer(this._shadowBufs[r],0,l.buffer);const g=o*6+p,h=n.beginRenderPass({label:`PointShadow light${o} face${p}`,colorAttachments:[{view:this._pointFaceViews[g],clearValue:{r:1,g:1,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._pointDepthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"discard"}});h.setPipeline(this._pointPipeline),h.setBindGroup(0,this._shadowBGs[r]),this._drawItems(h,a),h.end(),r++}o++}let u=0;for(const s of this._spotLights){if(!s.castShadow||u>=j)continue;const d=s.lightViewProj(),m=s.worldPosition(),l=this._shadowScratch;l.set(d.data,0),l[16]=m.x,l[17]=m.y,l[18]=m.z,l[19]=s.range,i.queue.writeBuffer(this._shadowBufs[r],0,l.buffer);const p=n.beginRenderPass({label:`SpotShadow light${u}`,colorAttachments:[{view:this._spotFaceViews[u],clearValue:{r:1,g:1,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._spotDepthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"discard"}});p.setPipeline(this._spotPipeline),p.setBindGroup(0,this._shadowBGs[r]),this._drawItems(p,a),p.end(),r++,u++}}_drawItems(n,i){for(let e=0;e<i.length;e++){const{mesh:a}=i[e];n.setBindGroup(1,this._modelBGs[e]),n.setVertexBuffer(0,a.vertexBuffer),n.setIndexBuffer(a.indexBuffer,"uint32"),n.drawIndexed(a.indexCount)}}_ensureModelBuffers(n,i){for(;this._modelBufs.length<i;){const e=n.createBuffer({label:`PSModelUniform ${this._modelBufs.length}`,size:lt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._modelBufs.push(e),this._modelBGs.push(n.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:e}}]}))}}destroy(){this._pointVsmTex.destroy(),this._spotVsmTex.destroy(),this._projTexArray.destroy(),this._pointDepth.destroy(),this._spotDepth.destroy();for(const n of this._shadowBufs)n.destroy();for(const n of this._modelBufs)n.destroy()}}const dt=`// Additive deferred pass for point and spot lights.
// Runs after DeferredLightingPass (which handles directional + IBL) with loadOp:'load'
// and srcFactor:'one' dstFactor:'one' so results accumulate on the HDR texture.

const PI: f32 = 3.14159265358979323846;

// ---- Camera (same layout as lighting.wgsl, 288 bytes) -------------------------

struct CameraUniforms {
  view       : mat4x4<f32>,
  proj       : mat4x4<f32>,
  viewProj   : mat4x4<f32>,
  invViewProj: mat4x4<f32>,
  position   : vec3<f32>,
  near       : f32,
  far        : f32,
}

// ---- Light data ---------------------------------------------------------------

struct LightCounts {
  numPoint: u32,
  numSpot : u32,
}

// 48 bytes — must match TypeScript packing in updateLights()
struct PointLightGpu {
  position : vec3<f32>,   // offset 0
  radius   : f32,         // offset 12
  color    : vec3<f32>,   // offset 16
  intensity: f32,         // offset 28
  shadowIdx: i32,         // offset 32  — negative means no shadow
  _pad0    : i32,
  _pad1    : i32,
  _pad2    : i32,
}

// 128 bytes — must match TypeScript packing in updateLights()
struct SpotLightGpu {
  position  : vec3<f32>,    // offset 0
  range     : f32,          // offset 12
  direction : vec3<f32>,    // offset 16
  innerCos  : f32,          // offset 28
  color     : vec3<f32>,    // offset 32
  outerCos  : f32,          // offset 44
  intensity : f32,          // offset 48
  shadowIdx : i32,          // offset 52
  projTexIdx: i32,          // offset 56
  _pad      : f32,          // offset 60
  lightViewProj: mat4x4<f32>, // offset 64
}

@group(0) @binding(0) var<uniform>       camera     : CameraUniforms;
@group(2) @binding(0) var<uniform>       lightCounts: LightCounts;
@group(2) @binding(1) var<storage, read> pointLights: array<PointLightGpu>;
@group(2) @binding(2) var<storage, read> spotLights : array<SpotLightGpu>;

// ---- GBuffer -----------------------------------------------------------------

@group(1) @binding(0) var albedoRoughnessTex: texture_2d<f32>;
@group(1) @binding(1) var normalMetallicTex : texture_2d<f32>;
@group(1) @binding(2) var depthTex          : texture_depth_2d;
@group(1) @binding(3) var gbufferSampler    : sampler;

// ---- Shadow maps + projection textures ----------------------------------------

@group(3) @binding(0) var vsm_point   : texture_cube_array<f32>;
@group(3) @binding(1) var vsm_spot    : texture_2d_array<f32>;
@group(3) @binding(2) var proj_tex    : texture_2d_array<f32>;
@group(3) @binding(3) var vsm_sampler : sampler;
@group(3) @binding(4) var proj_sampler: sampler;

// ---- Vertex ------------------------------------------------------------------

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

// ---- Helpers -----------------------------------------------------------------

fn reconstruct_world_pos(uv: vec2<f32>, depth: f32) -> vec3<f32> {
  let ndc    = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);
  let world_h = camera.invViewProj * ndc;
  return world_h.xyz / world_h.w;
}

// Variance shadow map: Chebyshev upper bound
fn vsm_shadow(moments: vec2<f32>, compare: f32) -> f32 {
  if (compare <= moments.x + 0.001) { return 1.0; }
  let variance = max(moments.y - moments.x * moments.x, 1e-5);
  let d = compare - moments.x;
  return variance / (variance + d * d);
}

// Epic-style inverse-square attenuation with smooth radius falloff
fn point_attenuation(dist: f32, radius: f32) -> f32 {
  let r = dist / radius;
  return pow(saturate(1.0 - r * r * r * r), 2.0) / max(dist * dist, 0.0001);
}

// ---- BRDF (same as lighting.wgsl) --------------------------------------------

fn distribution_ggx(NdotH: f32, roughness: f32) -> f32 {
  let a  = roughness * roughness;
  let a2 = a * a;
  let d  = NdotH * NdotH * (a2 - 1.0) + 1.0;
  return a2 / (PI * d * d);
}

fn geometry_direct(NdotX: f32, roughness: f32) -> f32 {
  let r = roughness + 1.0;
  let k = r * r / 8.0;
  return NdotX / (NdotX * (1.0 - k) + k);
}

fn smith_direct(NdotV: f32, NdotL: f32, roughness: f32) -> f32 {
  return geometry_direct(NdotV, roughness) * geometry_direct(NdotL, roughness);
}

fn fresnel_schlick(cosTheta: f32, F0: vec3<f32>) -> vec3<f32> {
  return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}

fn cook_torrance(NdotV: f32, NdotL: f32, NdotH: f32, VdotH: f32, roughness: f32, F0: vec3<f32>, albedo: vec3<f32>, metallic: f32) -> vec3<f32> {
  let D  = distribution_ggx(NdotH, roughness);
  let G  = smith_direct(NdotV, NdotL, roughness);
  let Fd = fresnel_schlick(VdotH, F0);
  let kD = (vec3<f32>(1.0) - Fd) * (1.0 - metallic);
  let specular = D * G * Fd / max(4.0 * NdotV * NdotL, 0.001);
  let diffuse  = kD * albedo / PI;
  return diffuse + specular;
}

// ---- Fragment ----------------------------------------------------------------

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let coord = vec2<i32>(in.clip_pos.xy);
  let depth = textureLoad(depthTex, coord, 0);
  if (depth >= 1.0) { discard; }  // sky — directional pass handles it

  let albedo_rough = textureLoad(albedoRoughnessTex, coord, 0);
  let normal_metal = textureLoad(normalMetallicTex,  coord, 0);

  let albedo    = albedo_rough.rgb;
  let roughness = max(albedo_rough.a, 0.04);
  let N         = normalize(normal_metal.rgb * 2.0 - 1.0);
  let metallic  = normal_metal.a;

  let world_pos = reconstruct_world_pos(in.uv, depth);
  let V         = normalize(camera.position - world_pos);
  let NdotV     = max(dot(N, V), 0.001);
  let F0        = mix(vec3<f32>(0.04), albedo, metallic);

  var accum = vec3<f32>(0.0);

  // ---- Point lights ----------------------------------------------------------
  for (var i = 0u; i < lightCounts.numPoint; i++) {
    let pl   = pointLights[i];
    let diff = pl.position - world_pos;
    let dist = length(diff);
    if (dist >= pl.radius) { continue; }

    let L     = diff / dist;
    let NdotL = max(dot(N, L), 0.0);
    if (NdotL <= 0.0) { continue; }

    let H     = normalize(L + V);
    let NdotH = max(dot(N, H), 0.0);
    let VdotH = max(dot(V, H), 0.0);

    let brdf = cook_torrance(NdotV, NdotL, NdotH, VdotH, roughness, F0, albedo, metallic);
    let att  = point_attenuation(dist, pl.radius);

    // VSM cube-array shadow
    var shad = 1.0;
    if (pl.shadowIdx >= 0) {
      let dir     = -normalize(diff);  // from light toward surface
      let compare = dist / pl.radius;
      let moments = textureSampleLevel(vsm_point, vsm_sampler, dir, pl.shadowIdx, 0.0).rg;
      shad = vsm_shadow(moments, compare);
    }

    accum += brdf * pl.color * pl.intensity * NdotL * att * shad;
  }

  // ---- Spot lights -----------------------------------------------------------
  for (var i = 0u; i < lightCounts.numSpot; i++) {
    let sl   = spotLights[i];
    let diff = sl.position - world_pos;
    let dist = length(diff);
    if (dist >= sl.range) { continue; }

    let L        = diff / dist;
    let NdotL    = max(dot(N, L), 0.0);
    if (NdotL <= 0.0) { continue; }

    // Spot cone attenuation
    let cos_angle = dot(-L, sl.direction);
    if (cos_angle <= sl.outerCos) { continue; }
    let cone = smoothstep(sl.outerCos, sl.innerCos, cos_angle);

    let H     = normalize(L + V);
    let NdotH = max(dot(N, H), 0.0);
    let VdotH = max(dot(V, H), 0.0);

    let brdf = cook_torrance(NdotV, NdotL, NdotH, VdotH, roughness, F0, albedo, metallic);
    let att  = point_attenuation(dist, sl.range);

    // VSM + projection texture (computed from light-space coords)
    var modulator = vec3<f32>(1.0);
    if (sl.shadowIdx >= 0 || sl.projTexIdx >= 0) {
      let ls     = sl.lightViewProj * vec4<f32>(world_pos, 1.0);
      let sc     = ls.xyz / ls.w;
      let uv     = vec2<f32>(sc.x * 0.5 + 0.5, -sc.y * 0.5 + 0.5);
      let in_frustum = all(uv >= vec2<f32>(0.0)) && all(uv <= vec2<f32>(1.0)) && sc.z >= 0.0 && sc.z <= 1.0;

      if (in_frustum) {
        if (sl.shadowIdx >= 0) {
          let moments = textureSampleLevel(vsm_spot, vsm_sampler, uv, sl.shadowIdx, 0.0).rg;
          modulator *= vec3<f32>(vsm_shadow(moments, sc.z));
        }
        if (sl.projTexIdx >= 0) {
          modulator *= textureSampleLevel(proj_tex, proj_sampler, uv, sl.projTexIdx, 0.0).rgb;
        }
      } else {
        modulator = vec3<f32>(0.0);  // outside frustum → no contribution
      }
    }

    accum += brdf * sl.color * sl.intensity * NdotL * att * cone * modulator;
  }

  return vec4<f32>(accum, 0.0);
}
`,pe=64*4+16+16,pt=8,fe=48,he=128;class Te extends H{constructor(n,i,e,a,r,o,u,s,d,m){super();t(this,"name","PointSpotLightPass");t(this,"_pipeline");t(this,"_cameraBG");t(this,"_gbufferBG");t(this,"_lightBG");t(this,"_shadowBG");t(this,"_cameraBuffer");t(this,"_lightCountsBuffer");t(this,"_pointBuffer");t(this,"_spotBuffer");t(this,"_hdrView");t(this,"_cameraData",new Float32Array(pe/4));t(this,"_lightCountsArr",new Uint32Array(2));t(this,"_pointBuf",new ArrayBuffer(Q*fe));t(this,"_pointF32",new Float32Array(this._pointBuf));t(this,"_pointI32",new Int32Array(this._pointBuf));t(this,"_spotBuf",new ArrayBuffer(ee*he));t(this,"_spotF32",new Float32Array(this._spotBuf));t(this,"_spotI32",new Int32Array(this._spotBuf));this._pipeline=n,this._cameraBG=i,this._gbufferBG=e,this._lightBG=a,this._shadowBG=r,this._cameraBuffer=o,this._lightCountsBuffer=u,this._pointBuffer=s,this._spotBuffer=d,this._hdrView=m}static create(n,i,e,a){const{device:r}=n,o=r.createBuffer({label:"PSLCameraBuffer",size:pe,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),u=r.createBuffer({label:"PSLLightCounts",size:pt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),s=r.createBuffer({label:"PSLPointBuffer",size:Q*fe,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),d=r.createBuffer({label:"PSLSpotBuffer",size:ee*he,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),m=r.createSampler({label:"PSLLinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),l=r.createSampler({label:"PSLVsmSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge"}),p=r.createSampler({label:"PSLProjSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),g=r.createBindGroupLayout({label:"PSLCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),h=r.createBindGroupLayout({label:"PSLGBufferBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),b=r.createBindGroupLayout({label:"PSLLightBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),_=r.createBindGroupLayout({label:"PSLShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube-array"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d-array"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d-array"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),y=r.createBindGroup({label:"PSLCameraBG",layout:g,entries:[{binding:0,resource:{buffer:o}}]}),v=r.createBindGroup({label:"PSLGBufferBG",layout:h,entries:[{binding:0,resource:i.albedoRoughnessView},{binding:1,resource:i.normalMetallicView},{binding:2,resource:i.depthView},{binding:3,resource:m}]}),P=r.createBindGroup({label:"PSLLightBG",layout:b,entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:s}},{binding:2,resource:{buffer:d}}]}),B=r.createBindGroup({label:"PSLShadowBG",layout:_,entries:[{binding:0,resource:e.pointVsmView},{binding:1,resource:e.spotVsmView},{binding:2,resource:e.projTexView},{binding:3,resource:l},{binding:4,resource:p}]}),G=r.createShaderModule({label:"PointSpotLightShader",code:dt}),x=r.createRenderPipeline({label:"PointSpotLightPipeline",layout:r.createPipelineLayout({bindGroupLayouts:[g,h,b,_]}),vertex:{module:G,entryPoint:"vs_main"},fragment:{module:G,entryPoint:"fs_main",targets:[{format:T,blend:{color:{srcFactor:"one",dstFactor:"one",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one",operation:"add"}}}]},primitive:{topology:"triangle-list"}});return new Te(x,y,v,P,B,o,u,s,d,a)}updateCamera(n,i,e,a,r,o,u,s){const d=this._cameraData;d.set(i.data,0),d.set(e.data,16),d.set(a.data,32),d.set(r.data,48),d[64]=o.x,d[65]=o.y,d[66]=o.z,d[67]=u,d[68]=s,n.queue.writeBuffer(this._cameraBuffer,0,d.buffer)}updateLights(n,i,e){const a=this._lightCountsArr;a[0]=Math.min(i.length,Q),a[1]=Math.min(e.length,ee),n.queue.writeBuffer(this._lightCountsBuffer,0,a.buffer);const r=this._pointF32,o=this._pointI32;let u=0;for(let l=0;l<Math.min(i.length,Q);l++){const p=i[l],g=p.worldPosition(),h=l*12;r[h+0]=g.x,r[h+1]=g.y,r[h+2]=g.z,r[h+3]=p.radius,r[h+4]=p.color.x,r[h+5]=p.color.y,r[h+6]=p.color.z,r[h+7]=p.intensity,p.castShadow&&u<$?o[h+8]=u++:o[h+8]=-1,o[h+9]=0,o[h+10]=0,o[h+11]=0}n.queue.writeBuffer(this._pointBuffer,0,this._pointBuf);const s=this._spotF32,d=this._spotI32;let m=0;for(let l=0;l<Math.min(e.length,ee);l++){const p=e[l],g=p.worldPosition(),h=p.worldDirection(),b=p.lightViewProj(),_=l*32;s[_+0]=g.x,s[_+1]=g.y,s[_+2]=g.z,s[_+3]=p.range,s[_+4]=h.x,s[_+5]=h.y,s[_+6]=h.z,s[_+7]=Math.cos(p.innerAngle*Math.PI/180),s[_+8]=p.color.x,s[_+9]=p.color.y,s[_+10]=p.color.z,s[_+11]=Math.cos(p.outerAngle*Math.PI/180),s[_+12]=p.intensity,p.castShadow&&m<j?d[_+13]=m++:d[_+13]=-1,d[_+14]=p.projectionTexture!==null?l:-1,d[_+15]=0,s.set(b.data,_+16)}n.queue.writeBuffer(this._spotBuffer,0,this._spotBuf)}updateLight(n){n.computeLightViewProj()}execute(n,i){const e=n.beginRenderPass({label:"PointSpotLightPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}]});e.setPipeline(this._pipeline),e.setBindGroup(0,this._cameraBG),e.setBindGroup(1,this._gbufferBG),e.setBindGroup(2,this._lightBG),e.setBindGroup(3,this._shadowBG),e.draw(3),e.end()}destroy(){this._cameraBuffer.destroy(),this._lightCountsBuffer.destroy(),this._pointBuffer.destroy(),this._spotBuffer.destroy()}}const Ae=`
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
`;function ft(f){switch(f.kind){case"sphere":{const c=Math.cos(f.solidAngle).toFixed(6),n=f.radius.toFixed(6);return`{
  let dir = sample_cone(seed + 10u, seed + 11u, ${c});
  let world_dir = quat_rotate(uniforms.world_quat, dir);
  p.position = uniforms.world_pos + world_dir * ${n};
  p.velocity = world_dir * speed;
}`}case"cone":{const c=Math.cos(f.angle).toFixed(6),n=f.radius.toFixed(6);return`{
  let dir = sample_cone(seed + 10u, seed + 11u, ${c});
  let world_dir = quat_rotate(uniforms.world_quat, dir);
  p.position = uniforms.world_pos + world_dir * ${n};
  p.velocity = world_dir * speed;
}`}case"box":{const[c,n,i]=f.halfExtents.map(e=>e.toFixed(6));return`{
  let local_off = vec3<f32>(
    (rand_f32(seed + 10u) * 2.0 - 1.0) * ${c},
    (rand_f32(seed + 11u) * 2.0 - 1.0) * ${n},
    (rand_f32(seed + 12u) * 2.0 - 1.0) * ${i},
  );
  let up = quat_rotate(uniforms.world_quat, vec3<f32>(0.0, 1.0, 0.0));
  p.position = uniforms.world_pos + quat_rotate(uniforms.world_quat, local_off);
  p.velocity = up * speed;
}`}}}function Ve(f){switch(f.type){case"gravity":return`p.velocity.y -= ${f.strength.toFixed(6)} * uniforms.dt;`;case"drag":return`p.velocity -= p.velocity * ${f.coefficient.toFixed(6)} * uniforms.dt;`;case"force":{const[c,n,i]=f.direction.map(e=>e.toFixed(6));return`p.velocity += vec3<f32>(${c}, ${n}, ${i}) * ${f.strength.toFixed(6)} * uniforms.dt;`}case"swirl_force":{const c=f.speed.toFixed(6),n=f.strength.toFixed(6);return`{
  let swirl_angle = uniforms.time * ${c};
  p.velocity += vec3<f32>(cos(swirl_angle), 0.0, sin(swirl_angle)) * ${n} * uniforms.dt;
}`}case"vortex":return`{
  let vx_radial = p.position.xz - uniforms.world_pos.xz;
  p.velocity += vec3<f32>(-vx_radial.y, 0.0, vx_radial.x) * ${f.strength.toFixed(6)} * uniforms.dt;
}`;case"curl_noise":{const c=f.octaves??1,n=c>1?`curl_noise_fbm(cn_pos, ${c})`:"curl_noise(cn_pos)";return`{
  let cn_pos = p.position * ${f.scale.toFixed(6)} + uniforms.time * ${f.timeScale.toFixed(6)};
  p.velocity += ${n} * ${f.strength.toFixed(6)} * uniforms.dt;
}`}case"size_random":return`p.size = rand_range(${f.min.toFixed(6)}, ${f.max.toFixed(6)}, pcg_hash(idx * 2654435761u));`;case"size_over_lifetime":return`p.size = mix(${f.start.toFixed(6)}, ${f.end.toFixed(6)}, t);`;case"color_over_lifetime":{const[c,n,i,e]=f.startColor.map(s=>s.toFixed(6)),[a,r,o,u]=f.endColor.map(s=>s.toFixed(6));return`p.color = mix(vec4<f32>(${c}, ${n}, ${i}, ${e}), vec4<f32>(${a}, ${r}, ${o}, ${u}), t);`}case"block_collision":return`{
  let _bc_uv = (p.position.xz - vec2<f32>(hm.origin_x, hm.origin_z)) / (hm.extent * 2.0) + 0.5;
  if (all(_bc_uv >= vec2<f32>(0.0)) && all(_bc_uv <= vec2<f32>(1.0))) {
    let _bc_xi = clamp(u32(_bc_uv.x * f32(hm.resolution)), 0u, hm.resolution - 1u);
    let _bc_zi = clamp(u32(_bc_uv.y * f32(hm.resolution)), 0u, hm.resolution - 1u);
    if (p.position.y <= hm_data[_bc_zi * hm.resolution + _bc_xi]) {
      particles[idx].life = -1.0; return;
    }
  }
}`}}function Le(f,c){return f?f.filter(n=>n.trigger===c).flatMap(n=>n.actions.map(Ve)).join(`
  `):""}function ht(f){const{emitter:c,events:n}=f,[i,e]=c.lifetime.map(s=>s.toFixed(6)),[a,r]=c.initialSpeed.map(s=>s.toFixed(6)),[o,u]=c.initialSize.map(s=>s.toFixed(6));return`
${Ae}

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

  let speed = rand_range(${a}, ${r}, seed + 1u);

  var p: Particle;
  p.life     = 0.0;
  p.max_life = rand_range(${i}, ${e}, seed + 2u);
  p.color    = uniforms.spawn_color;
  p.size     = rand_range(${o}, ${u}, seed + 3u);
  p.rotation = rand_f32(seed + 4u) * 6.28318530717958647;

  ${ft(c.shape)}

  ${Le(n,"on_spawn")}

  particles[idx] = p;
}
`}function mt(f){return f.modifiers.some(c=>c.type==="block_collision")}const _t=`
struct HeightmapUniforms {
  origin_x  : f32,
  origin_z  : f32,
  extent    : f32,
  resolution: u32,
}
@group(2) @binding(0) var<storage, read> hm_data: array<f32>;
@group(2) @binding(1) var<uniform>       hm     : HeightmapUniforms;
`;function gt(f){const c=f.modifiers.some(e=>e.type==="block_collision"),n=f.modifiers.map(Ve).join(`
  `),i=Le(f.events,"on_death");return`
${Ae}
${c?_t:""}

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
    ${i}
    particles[idx].life = -1.0;
    return;
  }

  let t = p.life / p.max_life;

  ${n}

  p.position += p.velocity * uniforms.dt;
  particles[idx] = p;
}
`}const vt=`// Compact pass — rebuilds alive_list and writes indirect draw instance count.
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
`,bt=`// Particle GBuffer render pass — camera-facing billboard quads.
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
`,xt=`// Particle forward HDR render pass — velocity-aligned billboard quads.
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
`,me=64,_e=80,yt=16,wt=16,ge=288,ve=16,oe=128;class Ee extends H{constructor(n,i,e,a,r,o,u,s,d,m,l,p,g,h,b,_,y,v,P,B,G,x,S,E,V,L,M){super();t(this,"name","ParticlePass");t(this,"_gbuffer");t(this,"_hdrView");t(this,"_isForward");t(this,"_maxParticles");t(this,"_config");t(this,"_particleBuffer");t(this,"_aliveList");t(this,"_counterBuffer");t(this,"_indirectBuffer");t(this,"_computeUniforms");t(this,"_renderUniforms");t(this,"_cameraBuffer");t(this,"_spawnPipeline");t(this,"_updatePipeline");t(this,"_compactPipeline");t(this,"_indirectPipeline");t(this,"_renderPipeline");t(this,"_computeDataBG");t(this,"_computeUniBG");t(this,"_compactDataBG");t(this,"_compactUniBG");t(this,"_renderDataBG");t(this,"_cameraRenderBG");t(this,"_renderParamsBG");t(this,"_heightmapDataBuf");t(this,"_heightmapUniBuf");t(this,"_heightmapBG");t(this,"_spawnAccum",0);t(this,"_spawnOffset",0);t(this,"_spawnCount",0);t(this,"_pendingBurst",null);t(this,"_time",0);t(this,"_frameSeed",0);t(this,"_cuBuf",new Float32Array(_e/4));t(this,"_cuiView",new Uint32Array(this._cuBuf.buffer));t(this,"_camBuf",new Float32Array(ge/4));t(this,"_hmUniBuf",new Float32Array(ve/4));t(this,"_hmRes",new Uint32Array([oe]));t(this,"_resetArr",new Uint32Array(1));this._gbuffer=n,this._hdrView=i,this._isForward=e,this._config=a,this._maxParticles=r,this._particleBuffer=o,this._aliveList=u,this._counterBuffer=s,this._indirectBuffer=d,this._computeUniforms=m,this._renderUniforms=l,this._cameraBuffer=p,this._spawnPipeline=g,this._updatePipeline=h,this._compactPipeline=b,this._indirectPipeline=_,this._renderPipeline=y,this._computeDataBG=v,this._computeUniBG=P,this._compactDataBG=B,this._compactUniBG=G,this._renderDataBG=x,this._cameraRenderBG=S,this._renderParamsBG=E,this._heightmapDataBuf=V,this._heightmapUniBuf=L,this._heightmapBG=M}setSpawnRate(n){this._config.emitter.spawnRate=n}burst(n,i,e){if(e<=0)return;const a=Math.min(e,this._maxParticles);this._pendingBurst={px:n.x,py:n.y,pz:n.z,r:i[0],g:i[1],b:i[2],a:i[3],count:a}}static create(n,i,e,a){const{device:r}=n,o=i.renderer.type==="sprites"&&i.renderer.renderTarget==="hdr",u=i.emitter.maxParticles,s=r.createBuffer({label:"ParticleBuffer",size:u*me,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),d=new Float32Array(u*(me/4));for(let k=0;k<u;k++)d[k*16+3]=-1;r.queue.writeBuffer(s,0,d.buffer);const m=r.createBuffer({label:"ParticleAliveList",size:u*4,usage:GPUBufferUsage.STORAGE}),l=r.createBuffer({label:"ParticleCounter",size:4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),p=r.createBuffer({label:"ParticleIndirect",size:16,usage:GPUBufferUsage.INDIRECT|GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(p,0,new Uint32Array([6,0,0,0]));const g=r.createBuffer({label:"ParticleComputeUniforms",size:_e,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),h=r.createBuffer({label:"ParticleCompactUniforms",size:yt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(h,0,new Uint32Array([u,0,0,0]));const b=r.createBuffer({label:"ParticleRenderUniforms",size:wt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(b,0,new Float32Array([i.emitter.roughness,i.emitter.metallic,0,0]));const _=r.createBuffer({label:"ParticleCameraBuffer",size:ge,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),y=r.createBindGroupLayout({label:"ParticleComputeDataBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),v=r.createBindGroupLayout({label:"ParticleCompactDataBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),P=r.createBindGroupLayout({label:"ParticleComputeUniBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),B=r.createBindGroupLayout({label:"ParticleRenderDataBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}}]}),G=r.createBindGroupLayout({label:"ParticleCameraRenderBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),x=r.createBindGroupLayout({label:"ParticleRenderParamsBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),S=r.createBindGroup({label:"ParticleComputeDataBG",layout:y,entries:[{binding:0,resource:{buffer:s}},{binding:1,resource:{buffer:m}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:p}}]}),E=r.createBindGroup({label:"ParticleCompactDataBG",layout:v,entries:[{binding:0,resource:{buffer:s}},{binding:1,resource:{buffer:m}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:p}}]}),V=r.createBindGroup({label:"ParticleComputeUniBG",layout:P,entries:[{binding:0,resource:{buffer:g}}]}),L=r.createBindGroup({label:"ParticleCompactUniBG",layout:P,entries:[{binding:0,resource:{buffer:h}}]}),M=r.createBindGroup({label:"ParticleRenderDataBG",layout:B,entries:[{binding:0,resource:{buffer:s}},{binding:1,resource:{buffer:m}}]}),N=r.createBindGroup({label:"ParticleCameraRenderBG",layout:G,entries:[{binding:0,resource:{buffer:_}}]}),F=r.createBindGroup({label:"ParticleRenderParamsBG",layout:x,entries:[{binding:0,resource:{buffer:b}}]});let O,I,C,z;mt(i)&&(O=r.createBuffer({label:"ParticleHeightmapData",size:oe*oe*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),I=r.createBuffer({label:"ParticleHeightmapUniforms",size:ve,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),z=r.createBindGroupLayout({label:"ParticleHeightmapBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),C=r.createBindGroup({label:"ParticleHeightmapBG",layout:z,entries:[{binding:0,resource:{buffer:O}},{binding:1,resource:{buffer:I}}]}));const Y=r.createPipelineLayout({bindGroupLayouts:[y,P]}),Z=z?r.createPipelineLayout({bindGroupLayouts:[y,P,z]}):r.createPipelineLayout({bindGroupLayouts:[y,P]}),X=r.createPipelineLayout({bindGroupLayouts:[v,P]}),A=r.createShaderModule({label:"ParticleSpawn",code:ht(i)}),q=r.createShaderModule({label:"ParticleUpdate",code:gt(i)}),R=r.createShaderModule({label:"ParticleCompact",code:vt}),w=r.createComputePipeline({label:"ParticleSpawnPipeline",layout:Y,compute:{module:A,entryPoint:"cs_main"}}),Me=r.createComputePipeline({label:"ParticleUpdatePipeline",layout:Z,compute:{module:q,entryPoint:"cs_main"}}),Ne=r.createComputePipeline({label:"ParticleCompactPipeline",layout:X,compute:{module:R,entryPoint:"cs_compact"}}),Oe=r.createComputePipeline({label:"ParticleIndirectPipeline",layout:X,compute:{module:R,entryPoint:"cs_write_indirect"}});let ie;if(o){const k=i.renderer.type==="sprites"?i.renderer.billboard:"camera",ae=i.renderer.type==="sprites"?i.renderer.shape??"soft":"soft",Ie=k==="camera"?"vs_camera":"vs_main",Ce=k==="velocity"?"fs_main":ae==="pixel"?"fs_pixel":"fs_snow",le=r.createShaderModule({label:"ParticleRenderForward",code:xt}),Fe=r.createPipelineLayout({bindGroupLayouts:[B,G]});ie=r.createRenderPipeline({label:"ParticleForwardPipeline",layout:Fe,vertex:{module:le,entryPoint:Ie},fragment:{module:le,entryPoint:Ce,targets:[{format:T,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},depthStencil:{format:"depth32float",depthWriteEnabled:!1,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}})}else{const k=r.createShaderModule({label:"ParticleRender",code:bt}),ae=r.createPipelineLayout({bindGroupLayouts:[B,G,x]});ie=r.createRenderPipeline({label:"ParticleRenderPipeline",layout:ae,vertex:{module:k,entryPoint:"vs_main"},fragment:{module:k,entryPoint:"fs_main",targets:[{format:"rgba8unorm"},{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}})}return new Ee(e,a,o,i,u,s,m,l,p,g,b,_,w,Me,Ne,Oe,ie,S,V,E,L,M,N,o?void 0:F,O,I,C)}updateHeightmap(n,i,e,a,r){if(!this._heightmapDataBuf||!this._heightmapUniBuf)return;n.queue.writeBuffer(this._heightmapDataBuf,0,i.buffer);const o=this._hmUniBuf;o[0]=e,o[1]=a,o[2]=r,n.queue.writeBuffer(this._heightmapUniBuf,0,o.buffer,0,12),n.queue.writeBuffer(this._heightmapUniBuf,12,this._hmRes)}update(n,i,e,a,r,o,u,s,d,m){this._time+=i,this._frameSeed=this._frameSeed+1&4294967295,this._spawnAccum+=this._config.emitter.spawnRate*i,this._spawnCount=Math.min(Math.floor(this._spawnAccum),this._maxParticles),this._spawnAccum-=this._spawnCount;const l=m.data;let p=l[12],g=l[13],h=l[14];const b=Math.hypot(l[0],l[1],l[2]),_=Math.hypot(l[4],l[5],l[6]),y=Math.hypot(l[8],l[9],l[10]),v=l[0]/b,P=l[1]/b,B=l[2]/b,G=l[4]/_,x=l[5]/_,S=l[6]/_,E=l[8]/y,V=l[9]/y,L=l[10]/y,M=v+x+L;let N,F,O,I;if(M>0){const w=.5/Math.sqrt(M+1);I=.25/w,N=(S-V)*w,F=(E-B)*w,O=(P-G)*w}else if(v>x&&v>L){const w=2*Math.sqrt(1+v-x-L);I=(S-V)/w,N=.25*w,F=(G+P)/w,O=(E+B)/w}else if(x>L){const w=2*Math.sqrt(1+x-v-L);I=(E-B)/w,N=(G+P)/w,F=.25*w,O=(V+S)/w}else{const w=2*Math.sqrt(1+L-v-x);I=(P-G)/w,N=(E+B)/w,F=(V+S)/w,O=.25*w}const C=this._config.emitter.initialColor;let z=C[0],Y=C[1],Z=C[2],X=C[3];if(this._pendingBurst){const w=this._pendingBurst;p=w.px,g=w.py,h=w.pz,N=0,F=0,O=0,I=1,this._spawnCount=w.count,z=w.r,Y=w.g,Z=w.b,X=w.a,this._pendingBurst=null}const A=this._cuBuf,q=this._cuiView;A[0]=p,A[1]=g,A[2]=h,q[3]=this._spawnCount,A[4]=N,A[5]=F,A[6]=O,A[7]=I,q[8]=this._spawnOffset,q[9]=this._maxParticles,q[10]=this._frameSeed,q[11]=0,A[12]=i,A[13]=this._time,A[16]=z,A[17]=Y,A[18]=Z,A[19]=X,n.queue.writeBuffer(this._computeUniforms,0,A.buffer),n.queue.writeBuffer(this._counterBuffer,0,this._resetArr),this._spawnOffset=(this._spawnOffset+this._spawnCount)%this._maxParticles;const R=this._camBuf;R.set(e.data,0),R.set(a.data,16),R.set(r.data,32),R.set(o.data,48),R[64]=u.x,R[65]=u.y,R[66]=u.z,R[67]=s,R[68]=d,n.queue.writeBuffer(this._cameraBuffer,0,R.buffer)}execute(n,i){const e=n.beginComputePass({label:"ParticleCompute"});if(this._spawnCount>0&&(e.setPipeline(this._spawnPipeline),e.setBindGroup(0,this._computeDataBG),e.setBindGroup(1,this._computeUniBG),e.dispatchWorkgroups(Math.ceil(this._spawnCount/64))),e.setPipeline(this._updatePipeline),e.setBindGroup(0,this._computeDataBG),e.setBindGroup(1,this._computeUniBG),this._heightmapBG&&e.setBindGroup(2,this._heightmapBG),e.dispatchWorkgroups(Math.ceil(this._maxParticles/64)),e.setPipeline(this._compactPipeline),e.setBindGroup(0,this._compactDataBG),e.setBindGroup(1,this._compactUniBG),e.dispatchWorkgroups(Math.ceil(this._maxParticles/64)),e.setPipeline(this._indirectPipeline),e.dispatchWorkgroups(1),e.end(),this._isForward){const a=n.beginRenderPass({label:"ParticleForwardPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthReadOnly:!0}});a.setPipeline(this._renderPipeline),a.setBindGroup(0,this._renderDataBG),a.setBindGroup(1,this._cameraRenderBG),a.drawIndirect(this._indirectBuffer,0),a.end()}else{const a=n.beginRenderPass({label:"ParticleGBufferPass",colorAttachments:[{view:this._gbuffer.albedoRoughnessView,loadOp:"load",storeOp:"store"},{view:this._gbuffer.normalMetallicView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthLoadOp:"load",depthStoreOp:"store"}});a.setPipeline(this._renderPipeline),a.setBindGroup(0,this._renderDataBG),a.setBindGroup(1,this._cameraRenderBG),a.setBindGroup(2,this._renderParamsBG),a.drawIndirect(this._indirectBuffer,0),a.end()}}destroy(){var n,i;this._particleBuffer.destroy(),this._aliveList.destroy(),this._counterBuffer.destroy(),this._indirectBuffer.destroy(),this._computeUniforms.destroy(),this._renderUniforms.destroy(),this._cameraBuffer.destroy(),(n=this._heightmapDataBuf)==null||n.destroy(),(i=this._heightmapUniBuf)==null||i.destroy()}}const Pt=`// Auto-exposure — two-pass histogram approach.
//
// cs_histogram : samples the HDR scene texture (every 4th pixel), bins each
//                pixel's log2-luminance into 64 workgroup-local bins, then
//                flushes to the global histogram atomically.
// cs_adapt     : reads the 64-bin histogram, computes a weighted average
//                log-luminance (skipping the darkest 5% and brightest 2% of
//                samples), derives the target linear exposure that maps the
//                average to 18% gray, then lerps the current exposure toward
//                that target with a time-constant controlled by adapt_speed.

const NUM_BINS      : u32 = 64u;
const LOG_LUM_MIN   : f32 = -10.0;   // log2 luminance range bottom (2^-10 ≈ 0.001)
const LOG_LUM_MAX   : f32 =   6.0;   // log2 luminance range top   (2^6  = 64)
const LOG_LUM_RANGE : f32 = 16.0;    // LOG_LUM_MAX - LOG_LUM_MIN
const GRAY_LOG2     : f32 = -2.474;  // log2(0.18) — target middle-grey point

struct AutoExposureParams {
  dt          : f32,
  adapt_speed : f32,   // EV/second rate constant (higher = faster adaptation)
  min_exposure: f32,   // minimum linear exposure multiplier
  max_exposure: f32,   // maximum linear exposure multiplier
  low_pct     : f32,   // fraction of darkest samples to ignore (default 0.05)
  high_pct    : f32,   // fraction of brightest samples to ignore (default 0.02)
  _pad        : vec2<f32>,
}

struct ExposureBuffer {
  value : f32,
  _pad0 : f32,
  _pad1 : f32,
  _pad2 : f32,
}

@group(0) @binding(0) var                        hdr_tex  : texture_2d<f32>;
@group(0) @binding(1) var<storage, read_write>   histogram: array<atomic<u32>>;  // 64 bins
@group(0) @binding(2) var<storage, read_write>   exposure : ExposureBuffer;
@group(0) @binding(3) var<uniform>               params   : AutoExposureParams;

// ---- Pass 1: Histogram ------------------------------------------------------

var<workgroup> wg_hist: array<atomic<u32>, 64>;

@compute @workgroup_size(8, 8)
fn cs_histogram(
  @builtin(global_invocation_id)    gid: vec3<u32>,
  @builtin(local_invocation_index)  lid: u32,
) {
  // wg_hist is zero-initialized per WGSL spec — no explicit clear needed.

  let size  = textureDimensions(hdr_tex);
  let coord = gid.xy * 4u;   // sample every 4th pixel in each dimension

  if (coord.x < size.x && coord.y < size.y) {
    let rgb = textureLoad(hdr_tex, vec2<i32>(coord), 0).rgb;
    let lum = dot(rgb, vec3<f32>(0.2126, 0.7152, 0.0722));
    if (lum > 1e-5) {
      let t   = clamp((log2(lum) - LOG_LUM_MIN) / LOG_LUM_RANGE, 0.0, 1.0);
      let bin = min(u32(t * f32(NUM_BINS)), NUM_BINS - 1u);
      atomicAdd(&wg_hist[bin], 1u);
    }
  }
  workgroupBarrier();

  // Each thread (lid 0-63) flushes one histogram bin to the global buffer.
  atomicAdd(&histogram[lid], atomicLoad(&wg_hist[lid]));
}

// ---- Pass 2: Adapt ----------------------------------------------------------

var<workgroup> wg_bins: array<u32, 64>;

@compute @workgroup_size(64)
fn cs_adapt(@builtin(local_invocation_index) lid: u32) {
  // Read and clear the global histogram for this frame.
  wg_bins[lid] = atomicExchange(&histogram[lid], 0u);
  workgroupBarrier();

  // Only thread 0 performs the sequential reduction.
  if (lid != 0u) { return; }

  var total = 0u;
  for (var i = 0u; i < NUM_BINS; i++) { total += wg_bins[i]; }
  if (total == 0u) { return; }

  // Skip the darkest low_pct and brightest high_pct samples.
  let low_cut  = u32(f32(total) * params.low_pct);
  let high_cut = total - u32(f32(total) * params.high_pct);

  var acc     = 0u;
  var sum_log = 0.0;
  var cnt     = 0u;
  for (var i = 0u; i < NUM_BINS; i++) {
    let b       = wg_bins[i];
    let b_start = acc;
    let b_end   = acc + b;
    acc = b_end;
    if (b_end > low_cut && b_start < high_cut) {
      let in_cnt  = min(b_end, high_cut) - max(b_start, low_cut);
      let log_lum = LOG_LUM_MIN + (f32(i) + 0.5) / f32(NUM_BINS) * LOG_LUM_RANGE;
      sum_log += log_lum * f32(in_cnt);
      cnt     += in_cnt;
    }
  }
  if (cnt == 0u) { return; }

  // target exposure = 0.18 / avg_lum  →  in log-space: GRAY_LOG2 - avg_log
  let avg_log    = sum_log / f32(cnt);
  let target_ev  = clamp(GRAY_LOG2 - avg_log,
                         log2(params.min_exposure),
                         log2(params.max_exposure));
  let target_exp = exp2(target_ev);

  // Exponential smoothing toward target.
  let blend = 1.0 - exp(-params.adapt_speed * params.dt);
  exposure.value = exposure.value + (target_exp - exposure.value) * blend;
}
`,Bt=64,Gt=32,St=16,Ut=Bt*4,be={adaptSpeed:1.5,minExposure:.1,maxExposure:10,lowPct:.05,highPct:.02},W=class W extends H{constructor(n,i,e,a,r,o,u,s){super();t(this,"name","AutoExposurePass");t(this,"exposureBuffer");t(this,"_histogramPipeline");t(this,"_adaptPipeline");t(this,"_bindGroup");t(this,"_paramsBuffer");t(this,"_histogramBuffer");t(this,"_hdrWidth");t(this,"_hdrHeight");t(this,"enabled",!0);t(this,"_resetScratch",new Float32Array([1,0,0,0]));this._histogramPipeline=n,this._adaptPipeline=i,this._bindGroup=e,this._paramsBuffer=a,this._histogramBuffer=r,this.exposureBuffer=o,this._hdrWidth=u,this._hdrHeight=s}static create(n,i,e=be){const{device:a}=n,r=a.createBindGroupLayout({label:"AutoExposureBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),o=a.createBuffer({label:"AutoExposureHistogram",size:Ut,usage:GPUBufferUsage.STORAGE}),u=a.createBuffer({label:"AutoExposureValue",size:St,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});a.queue.writeBuffer(u,0,new Float32Array([1,0,0,0]));const s=a.createBuffer({label:"AutoExposureParams",size:Gt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});W._writeParams(a,s,0,e);const d=a.createBindGroup({label:"AutoExposureBG",layout:r,entries:[{binding:0,resource:i.createView()},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:u}},{binding:3,resource:{buffer:s}}]}),m=a.createPipelineLayout({bindGroupLayouts:[r]}),l=a.createShaderModule({label:"AutoExposure",code:Pt}),p=a.createComputePipeline({label:"AutoExposureHistogramPipeline",layout:m,compute:{module:l,entryPoint:"cs_histogram"}}),g=a.createComputePipeline({label:"AutoExposureAdaptPipeline",layout:m,compute:{module:l,entryPoint:"cs_adapt"}});return new W(p,g,d,s,o,u,i.width,i.height)}update(n,i,e=be){if(!this.enabled){n.device.queue.writeBuffer(this.exposureBuffer,0,this._resetScratch);return}W._writeParams(n.device,this._paramsBuffer,i,e)}execute(n,i){if(!this.enabled)return;const e=n.beginComputePass({label:"AutoExposurePass"});e.setPipeline(this._histogramPipeline),e.setBindGroup(0,this._bindGroup),e.dispatchWorkgroups(Math.ceil(this._hdrWidth/32),Math.ceil(this._hdrHeight/32)),e.setPipeline(this._adaptPipeline),e.dispatchWorkgroups(1),e.end()}destroy(){this._paramsBuffer.destroy(),this._histogramBuffer.destroy(),this.exposureBuffer.destroy()}static _writeParams(n,i,e,a){const r=W._paramsScratch;r[0]=e,r[1]=a.adaptSpeed,r[2]=a.minExposure,r[3]=a.maxExposure,r[4]=a.lowPct,r[5]=a.highPct,r[6]=0,r[7]=0,n.queue.writeBuffer(i,0,r)}};t(W,"_paramsScratch",new Float32Array(8));let xe=W;class Re{constructor(c,n,i,e,a,r,o){t(this,"colorAtlas");t(this,"normalAtlas");t(this,"merAtlas");t(this,"heightAtlas");t(this,"blockSize");t(this,"blockCount");t(this,"_atlasWidth");t(this,"_atlasHeight");this.colorAtlas=c,this.normalAtlas=n,this.merAtlas=i,this.heightAtlas=e,this.blockSize=a,this._atlasWidth=r,this._atlasHeight=o,this.blockCount=Math.floor(r/a)}static async load(c,n,i,e,a,r=16){async function o(y){const v=await(await fetch(y)).blob();return createImageBitmap(v,{colorSpaceConversion:"none"})}const[u,s,d,m]=await Promise.all([o(n),o(i),o(e),o(a)]),l=u.width,p=u.height,g=K.fromBitmap(c,u,{srgb:!0}),h=K.fromBitmap(c,s,{srgb:!1}),b=K.fromBitmap(c,d,{srgb:!1}),_=K.fromBitmap(c,m,{srgb:!1});return new Re(g,h,b,_,r,l,p)}uvTransform(c){const n=this.blockSize/this._atlasWidth,i=this.blockSize/this._atlasHeight;return[c*n,0,n,i]}destroy(){this.colorAtlas.destroy(),this.normalAtlas.destroy(),this.merAtlas.destroy(),this.heightAtlas.destroy()}}export{xe as A,Pe as B,Be as D,Ee as P,Ge as S,we as T,Te as a,Ue as b,Se as c,Re as d,Rt as e,It as f,Ct as g,Ot as h,Nt as m,Mt as n};
