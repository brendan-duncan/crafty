var w=Object.defineProperty;var P=(o,n,t)=>n in o?w(o,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[n]=t;var u=(o,n,t)=>P(o,typeof n!="symbol"?n+"":n,t);import{P as B}from"./mesh-B_UY4euz.js";const G=`// SSAO: hemisphere sampling in view space.
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
`,T=`// SSAO blur: separable bilateral depth-aware Gaussian blur.
// Two passes: horizontal (fs_blur_h) then vertical (fs_blur_v).

@group(0) @binding(0) var ao_tex   : texture_2d<f32>;
@group(0) @binding(1) var depth_tex: texture_depth_2d;
@group(0) @binding(2) var samp     : sampler;

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

fn depth_load(uv: vec2<f32>) -> f32 {
  let size  = vec2<i32>(textureDimensions(depth_tex));
  let coord = clamp(vec2<i32>(uv * vec2<f32>(size)), vec2<i32>(0), size - vec2<i32>(1));
  return textureLoad(depth_tex, coord, 0u);
}

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

@fragment
fn fs_blur_h(in: VertexOutput) -> @location(0) vec4<f32> {
  let texel = 1.0 / vec2<f32>(textureDimensions(ao_tex));
  return blur(in.uv, vec2<f32>(texel.x, 0.0));
}

@fragment
fn fs_blur_v(in: VertexOutput) -> @location(0) vec4<f32> {
  let texel = 1.0 / vec2<f32>(textureDimensions(ao_tex));
  return blur(in.uv, vec2<f32>(0.0, texel.y));
}
`,v="r8unorm",x=16,V=464;function O(){const o=new Float32Array(x*4);for(let n=0;n<x;n++){const t=Math.random(),r=Math.random()*Math.PI*2,e=Math.sqrt(1-t*t),d=.1+.9*(n/x)**2;o[n*4+0]=e*Math.cos(r)*d,o[n*4+1]=e*Math.sin(r)*d,o[n*4+2]=t*d,o[n*4+3]=0}return o}function M(){const o=new Uint8Array(64);for(let n=0;n<16;n++){const t=Math.random()*Math.PI*2;o[n*4+0]=Math.round((Math.cos(t)*.5+.5)*255),o[n*4+1]=Math.round((Math.sin(t)*.5+.5)*255),o[n*4+2]=128,o[n*4+3]=255}return o}class g extends B{constructor(t,r,e,d,_,f,h,p,a,s,l,i){super();u(this,"name","SSAOPass");u(this,"_ssaoPipeline");u(this,"_blurHPipeline");u(this,"_blurVPipeline");u(this,"_boxBlurPipeline");u(this,"_blurQuality");u(this,"_uniformBuffer");u(this,"_noiseTex");u(this,"_noiseView");u(this,"_ssaoBgl1");u(this,"_blurBgl");u(this,"_ssaoBg0");u(this,"_blurSampler");u(this,"_cameraScratch",new Float32Array(48));u(this,"_paramsScratch",new Float32Array(4));this._ssaoPipeline=t,this._blurHPipeline=r,this._blurVPipeline=e,this._boxBlurPipeline=d,this._blurQuality=i,this._uniformBuffer=_,this._noiseTex=f,this._noiseView=h,this._ssaoBgl1=p,this._blurBgl=a,this._ssaoBg0=s,this._blurSampler=l}static create(t,r="quality"){const{device:e}=t,d=e.createTexture({label:"SsaoNoise",size:{width:4,height:4},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});e.queue.writeTexture({texture:d},M().buffer,{bytesPerRow:4*4,rowsPerImage:4},{width:4,height:4});const _=d.createView(),f=e.createBuffer({label:"SsaoUniforms",size:V,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(f,208,O().buffer),e.queue.writeBuffer(f,192,new Float32Array([1,.005,2,0]).buffer);const h=e.createSampler({label:"SsaoBlurSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),p=e.createBindGroupLayout({label:"SsaoBGL0",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),a=e.createBindGroupLayout({label:"SsaoBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),s=e.createBindGroupLayout({label:"SsaoBlurBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),l=t.createShaderModule(G,"SsaoShader"),i=t.createShaderModule(T,"SsaoBlurShader"),c=e.createRenderPipeline({label:"SsaoPipeline",layout:e.createPipelineLayout({bindGroupLayouts:[p,a]}),vertex:{module:l,entryPoint:"vs_main"},fragment:{module:l,entryPoint:"fs_ssao",targets:[{format:v}]},primitive:{topology:"triangle-list"}}),m=e.createRenderPipeline({label:"SsaoBlurHPipeline",layout:e.createPipelineLayout({bindGroupLayouts:[s]}),vertex:{module:i,entryPoint:"vs_main"},fragment:{module:i,entryPoint:"fs_blur_h",targets:[{format:v}]},primitive:{topology:"triangle-list"}}),b=e.createRenderPipeline({label:"SsaoBlurVPipeline",layout:e.createPipelineLayout({bindGroupLayouts:[s]}),vertex:{module:i,entryPoint:"vs_main"},fragment:{module:i,entryPoint:"fs_blur_v",targets:[{format:v}]},primitive:{topology:"triangle-list"}}),y=e.createRenderPipeline({label:"SsaoBoxBlurPipeline",layout:e.createPipelineLayout({bindGroupLayouts:[s]}),vertex:{module:i,entryPoint:"vs_main"},fragment:{module:i,entryPoint:"fs_blur",targets:[{format:v}]},primitive:{topology:"triangle-list"}}),S=e.createBindGroup({label:"SsaoBG0",layout:p,entries:[{binding:0,resource:{buffer:f}}]});return new g(c,m,b,y,f,d,_,a,s,S,h,r)}updateCamera(t){const r=t.activeCamera;if(!r)throw new Error("SSAOPass.updateCamera: ctx.activeCamera is null");const e=this._cameraScratch;e.set(r.viewMatrix().data,0),e.set(r.projectionMatrix().data,16),e.set(r.inverseProjectionMatrix().data,32),t.device.queue.writeBuffer(this._uniformBuffer,0,e.buffer)}setBlurQuality(t){this._blurQuality=t}updateParams(t,r=1,e=.005,d=2){this._paramsScratch[0]=r,this._paramsScratch[1]=e,this._paramsScratch[2]=d,this._paramsScratch[3]=0,t.device.queue.writeBuffer(this._uniformBuffer,192,this._paramsScratch.buffer)}addToGraph(t,r){const{ctx:e}=t,d=Math.max(1,e.width>>1),_=Math.max(1,e.height>>1),f={format:v,width:d,height:_};let h,p;if(t.addPass("SSAOPass.raw","render",a=>{h=a.createTexture({label:"SsaoRaw",...f}),h=a.write(h,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[1,0,0,1]}),a.read(r.normal,"sampled"),a.read(r.depth,"sampled"),a.setExecute((s,l)=>{const i=l.getOrCreateBindGroup({label:"SsaoBG1",layout:this._ssaoBgl1,entries:[{binding:0,resource:l.getTextureView(r.normal)},{binding:1,resource:l.getTextureView(r.depth)},{binding:2,resource:this._noiseView}]}),c=s.renderPassEncoder;c.setPipeline(this._ssaoPipeline),c.setBindGroup(0,this._ssaoBg0),c.setBindGroup(1,i),c.draw(3)})}),this._blurQuality==="quality"){let a;t.addPass("SSAOPass.blurH","render",s=>{a=s.createTexture({label:"SsaoBlurH",...f}),a=s.write(a,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[1,0,0,1]}),s.read(h,"sampled"),s.read(r.depth,"sampled"),s.setExecute((l,i)=>{const c=i.getOrCreateBindGroup({label:"SsaoBlurHBG",layout:this._blurBgl,entries:[{binding:0,resource:i.getTextureView(h)},{binding:1,resource:i.getTextureView(r.depth)},{binding:2,resource:this._blurSampler}]}),m=l.renderPassEncoder;m.setPipeline(this._blurHPipeline),m.setBindGroup(0,c),m.draw(3)})}),t.addPass("SSAOPass.blurV","render",s=>{p=s.createTexture({label:"SsaoBlurred",...f}),p=s.write(p,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[1,0,0,1]}),s.read(a,"sampled"),s.read(r.depth,"sampled"),s.setExecute((l,i)=>{const c=i.getOrCreateBindGroup({label:"SsaoBlurVBG",layout:this._blurBgl,entries:[{binding:0,resource:i.getTextureView(a)},{binding:1,resource:i.getTextureView(r.depth)},{binding:2,resource:this._blurSampler}]}),m=l.renderPassEncoder;m.setPipeline(this._blurVPipeline),m.setBindGroup(0,c),m.draw(3)})})}else t.addPass("SSAOPass.boxBlur","render",a=>{p=a.createTexture({label:"SsaoBoxBlurred",...f}),p=a.write(p,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[1,0,0,1]}),a.read(h,"sampled"),a.read(r.depth,"sampled"),a.setExecute((s,l)=>{const i=l.getOrCreateBindGroup({label:"SsaoBoxBlurBG",layout:this._blurBgl,entries:[{binding:0,resource:l.getTextureView(h)},{binding:1,resource:l.getTextureView(r.depth)},{binding:2,resource:this._blurSampler}]}),c=s.renderPassEncoder;c.setPipeline(this._boxBlurPipeline),c.setBindGroup(0,i),c.draw(3)})});return{ao:p}}destroy(){this._uniformBuffer.destroy(),this._noiseTex.destroy()}}export{g as S,T as s};
