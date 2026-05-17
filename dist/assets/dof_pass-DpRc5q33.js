var N=Object.defineProperty;var L=(l,a,e)=>a in l?N(l,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[a]=e;var d=(l,a,e)=>L(l,typeof a!="symbol"?a+"":a,e);import{P as S,h as A}from"./mesh-BJGbBOtt.js";import{H as b}from"./deferred_lighting_pass-0W5ZoDq7.js";class B{constructor(a,e){d(this,"gpuTexture");d(this,"view");d(this,"type");this.gpuTexture=a,this.type=e,this.view=a.createView({dimension:e==="cube"?"cube":e==="3d"?"3d":"2d"})}destroy(){this.gpuTexture.destroy()}static createSolid(a,e,t,n,o=255){const i=a.createTexture({size:{width:1,height:1},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return a.queue.writeTexture({texture:i},new Uint8Array([e,t,n,o]),{bytesPerRow:4},{width:1,height:1}),new B(i,"2d")}static fromBitmap(a,e,{srgb:t=!1,usage:n}={}){const o=t?"rgba8unorm-srgb":"rgba8unorm";n=n?n|(GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT):GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT;const i=a.createTexture({size:{width:e.width,height:e.height},format:o,usage:n});return a.queue.copyExternalImageToTexture({source:e,flipY:!1},{texture:i},{width:e.width,height:e.height}),new B(i,"2d")}static async fromUrl(a,e,t={}){const n=await(await fetch(e)).blob(),o={colorSpaceConversion:"none"};t.resizeWidth!==void 0&&t.resizeHeight!==void 0&&(o.resizeWidth=t.resizeWidth,o.resizeHeight=t.resizeHeight,o.resizeQuality="high");const i=await createImageBitmap(n,o);return B.fromBitmap(a,i,t)}}const O=`// Decodes an RGBE (Radiance HDR) texture into a linear rgba16float texture.
// src: rgba8uint — raw RGBE bytes (R, G, B, Exponent), 4 bytes per pixel.
// dst: rgba16float storage texture — linear HDR output.

@group(0) @binding(0) var src : texture_2d<u32>;
@group(1) @binding(0) var dst : texture_storage_2d<rgba16float, write>;

@compute @workgroup_size(8, 8)
fn cs_decode(@builtin(global_invocation_id) gid: vec3<u32>) {
  let size = textureDimensions(src);
  if (gid.x >= size.x || gid.y >= size.y) { return; }

  let rgbe = textureLoad(src, vec2<i32>(gid.xy), 0);
  var rgb  : vec3<f32>;
  if (rgbe.a == 0u) {
    rgb = vec3<f32>(0.0);
  } else {
    // RGBE: scale = 2^(E - 128) / 256  →  2^(E - 136)
    let scale = pow(2.0, f32(rgbe.a) - 136.0);
    rgb = vec3<f32>(f32(rgbe.r), f32(rgbe.g), f32(rgbe.b)) * scale;
  }
  textureStore(dst, vec2<i32>(gid.xy), vec4<f32>(rgb, 1.0));
}
`;function Y(l){const a=new Uint8Array(l);let e=0;function t(){let c="";for(;e<a.length&&a[e]!==10;)a[e]!==13&&(c+=String.fromCharCode(a[e])),e++;return e<a.length&&e++,c}const n=t();if(!n.startsWith("#?RADIANCE")&&!n.startsWith("#?RGBE"))throw new Error(`Not a Radiance HDR file (magic: "${n}")`);for(;t().length!==0;);const o=t(),i=o.match(/-Y\s+(\d+)\s+\+X\s+(\d+)/);if(!i)throw new Error(`Unrecognized HDR resolution: "${o}"`);const u=parseInt(i[1],10),s=parseInt(i[2],10),r=new Uint8Array(s*u*4);function _(c){const f=new Uint8Array(s),g=new Uint8Array(s),y=new Uint8Array(s),w=new Uint8Array(s),h=[f,g,y,w];for(let x=0;x<4;x++){const G=h[x];let v=0;for(;v<s;){const T=a[e++];if(T>128){const P=T-128,U=a[e++];G.fill(U,v,v+P),v+=P}else G.set(a.subarray(e,e+T),v),e+=T,v+=T}}const m=c*s*4;for(let x=0;x<s;x++)r[m+x*4+0]=f[x],r[m+x*4+1]=g[x],r[m+x*4+2]=y[x],r[m+x*4+3]=w[x]}function p(c,f,g,y,w){const h=c*s*4;r[h+0]=f,r[h+1]=g,r[h+2]=y,r[h+3]=w;let m=1;for(;m<s;){const x=a[e++],G=a[e++],v=a[e++],T=a[e++];if(x===1&&G===1&&v===1){const P=h+(m-1)*4;for(let U=0;U<T;U++)r[h+m*4+0]=r[P+0],r[h+m*4+1]=r[P+1],r[h+m*4+2]=r[P+2],r[h+m*4+3]=r[P+3],m++}else r[h+m*4+0]=x,r[h+m*4+1]=G,r[h+m*4+2]=v,r[h+m*4+3]=T,m++}}for(let c=0;c<u&&!(e+4>a.length);c++){const f=a[e++],g=a[e++],y=a[e++],w=a[e++];if(f===2&&g===2&&!(y&128)){const h=y<<8|w;if(h!==s)throw new Error(`HDR scanline width mismatch: ${h} vs ${s}`);_(c)}else p(c,f,g,y,w)}return{width:s,height:u,data:r}}const R=new WeakMap;function M(l){const a=R.get(l);if(a)return a;const e=l.createBindGroupLayout({label:"RgbeSrcBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"uint"}}]}),t=l.createBindGroupLayout({label:"RgbeDstBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"2d"}}]}),n=l.createPipelineLayout({bindGroupLayouts:[e,t]}),o=l.createShaderModule({label:"RgbeDecode",code:O}),u={pipeline:l.createComputePipeline({label:"RgbeDecodePipeline",layout:n,compute:{module:o,entryPoint:"cs_decode"}}),srcBGL:e,dstBGL:t};return R.set(l,u),u}async function W(l,a){const{width:e,height:t,data:n}=a,{pipeline:o,srcBGL:i,dstBGL:u}=M(l),s=l.createTexture({label:"Sky RGBE Raw",size:{width:e,height:t},format:"rgba8uint",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});l.queue.writeTexture({texture:s},n.buffer,{bytesPerRow:e*4},{width:e,height:t});const r=l.createTexture({label:"Sky HDR Texture",size:{width:e,height:t},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),_=l.createBindGroup({layout:i,entries:[{binding:0,resource:s.createView()}]}),p=l.createBindGroup({layout:u,entries:[{binding:0,resource:r.createView()}]}),c=l.createCommandEncoder({label:"RgbeDecodeEncoder"}),f=c.beginComputePass({label:"RgbeDecodePass"});return f.setPipeline(o),f.setBindGroup(0,_),f.setBindGroup(1,p),f.dispatchWorkgroups(Math.ceil(e/8),Math.ceil(t/8)),f.end(),l.queue.submit([c.finish()]),await l.queue.onSubmittedWorkDone(),s.destroy(),new B(r,"2d")}const I=`// TAA resolve pass — fullscreen triangle, blends current HDR with reprojected history.

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
`,E=128,V="taa:history",F={label:"TAAHistory",format:b,width:0,height:0};class D extends S{constructor(e,t,n,o,i){super();d(this,"name","TAAPass");d(this,"_pipeline");d(this,"_textureBgl");d(this,"_uniformBg");d(this,"_uniformBuffer");d(this,"_sampler");d(this,"_scratch",new Float32Array(E/4));d(this,"sampleCount",16);d(this,"_frameIndex",0);this._pipeline=e,this._textureBgl=t,this._uniformBg=n,this._uniformBuffer=o,this._sampler=i}static create(e){const{device:t}=e,n=t.createBuffer({label:"TAAUniformBuffer",size:E,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),o=t.createBindGroupLayout({label:"TAAUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),i=t.createBindGroupLayout({label:"TAATextureBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),u=t.createSampler({label:"TAALinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),s=t.createBindGroup({layout:o,entries:[{binding:0,resource:{buffer:n}}]}),r=e.createShaderModule(I,"TAAShader"),_=t.createRenderPipeline({label:"TAAPipeline",layout:t.createPipelineLayout({bindGroupLayouts:[o,i]}),vertex:{module:r,entryPoint:"vs_main"},fragment:{module:r,entryPoint:"fs_main",targets:[{format:b}]},primitive:{topology:"triangle-list"}});return new D(_,i,s,n,u)}updateCamera(e){const t=e.activeCamera;if(!t)throw new Error("TAAPass.updateCamera: ctx.activeCamera is null");const n=this._frameIndex%this.sampleCount+1,o=(A(n,2)-.5)*(2/e.width),i=(A(n,3)-.5)*(2/e.height);t.applyJitter(o,i);const u=this._scratch;u.set(t.inverseViewProjectionMatrix().data,0),u.set(t.previousViewProjectionMatrix().data,16),e.queue.writeBuffer(this._uniformBuffer,0,u.buffer),this._frameIndex++}resetJitter(){this._frameIndex=0}addToGraph(e,t){const{ctx:n}=e,o=this._resolveTarget(e,t.output),i=e.importPersistentTexture(V,{...F,width:n.width,height:n.height});let u,s;return e.addPass("TAAPass.resolve","render",r=>{const _=o??r.createTexture({label:"TAAResolved",format:b,width:n.width,height:n.height,extraUsage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC});u=r.write(_,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[0,0,0,1]}),r.read(t.hdr,"sampled"),r.read(i,"sampled"),r.read(t.depth,"sampled"),r.setExecute((p,c)=>{const f=c.getOrCreateBindGroup({layout:this._textureBgl,entries:[{binding:0,resource:c.getTextureView(t.hdr)},{binding:1,resource:c.getTextureView(i)},{binding:2,resource:c.getTextureView(t.depth)},{binding:3,resource:this._sampler}]}),g=p.renderPassEncoder;g.setPipeline(this._pipeline),g.setBindGroup(0,this._uniformBg),g.setBindGroup(1,f),g.draw(3)})}),e.addPass("TAAPass.copyHistory","transfer",r=>{r.read(u,"copy-src"),s=r.write(i,"copy-dst"),r.setExecute((_,p)=>{_.commandEncoder.copyTextureToTexture({texture:p.getTexture(u)},{texture:p.getTexture(i)},{width:n.width,height:n.height})})}),{resolved:u,history:s}}_resolveTarget(e,t){if(t===void 0)return null;if(t==="backbuffer"){const o=e.getBackbuffer(),i=e.getResourceInfo(o.id);if((i==null?void 0:i.format)!==b)throw new Error(`[TAAPass] output: 'backbuffer' requires canvas format ${b}, got ${i==null?void 0:i.format}.`);return o}if(t==="auto")try{const o=e.getBackbuffer(),i=e.getResourceInfo(o.id);return(i==null?void 0:i.format)===b?o:null}catch{return null}const n=e.getResourceInfo(t.id);if((n==null?void 0:n.format)!==b)throw new Error(`[TAAPass] output handle must have format ${b}, got ${n==null?void 0:n.format}.`);return t}destroy(){this._uniformBuffer.destroy()}}const z=`// Depth of Field: prefilter (CoC + 2x downsample) then fused disc-blur + composite.

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
`,H=32;class C extends S{constructor(e,t,n,o,i,u,s){super();d(this,"name","DofPass");d(this,"_bglPrefilter");d(this,"_bglComp0");d(this,"_bglComp1");d(this,"_prefilterPipeline");d(this,"_compositePipeline");d(this,"_uniformBuffer");d(this,"_sampler");d(this,"_scratch",new Float32Array(8));this._bglPrefilter=e,this._bglComp0=t,this._bglComp1=n,this._prefilterPipeline=o,this._compositePipeline=i,this._uniformBuffer=u,this._sampler=s}static create(e){const{device:t}=e,n=t.createBuffer({label:"DofUniforms",size:H,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});t.queue.writeBuffer(n,0,new Float32Array([30,60,6,.1,1e3,1,0,0]).buffer);const o=t.createSampler({label:"DofSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),i=t.createBindGroupLayout({label:"DofBGL0Prefilter",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),u=t.createBindGroupLayout({label:"DofBGL0Composite",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),s=t.createBindGroupLayout({label:"DofBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),r=e.createShaderModule(z,"DofShader"),_=t.createRenderPipeline({label:"DofPrefilterPipeline",layout:t.createPipelineLayout({bindGroupLayouts:[i]}),vertex:{module:r,entryPoint:"vs_main"},fragment:{module:r,entryPoint:"fs_prefilter",targets:[{format:b}]},primitive:{topology:"triangle-list"}}),p=t.createRenderPipeline({label:"DofCompositePipeline",layout:t.createPipelineLayout({bindGroupLayouts:[u,s]}),vertex:{module:r,entryPoint:"vs_main"},fragment:{module:r,entryPoint:"fs_composite",targets:[{format:b}]},primitive:{topology:"triangle-list"}});return new C(i,u,s,_,p,n,o)}updateParams(e,t=30,n=60,o=6,i=.1,u=1e3,s=1){this._scratch[0]=t,this._scratch[1]=n,this._scratch[2]=o,this._scratch[3]=i,this._scratch[4]=u,this._scratch[5]=s,this._scratch[6]=0,this._scratch[7]=0,e.queue.writeBuffer(this._uniformBuffer,0,this._scratch.buffer)}addToGraph(e,t){const{ctx:n}=e,o={format:b,width:Math.max(1,n.width>>1),height:Math.max(1,n.height>>1)},i={format:b,width:n.width,height:n.height};let u,s;return e.addPass("DofPass.prefilter","render",r=>{u=r.createTexture({label:"DofHalf",...o}),u=r.write(u,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[0,0,0,0]}),r.read(t.hdr,"sampled"),r.read(t.depth,"sampled"),r.setExecute((_,p)=>{const c=p.getOrCreateBindGroup({layout:this._bglPrefilter,entries:[{binding:0,resource:{buffer:this._uniformBuffer}},{binding:1,resource:p.getTextureView(t.hdr)},{binding:2,resource:p.getTextureView(t.depth)},{binding:3,resource:this._sampler}]}),f=_.renderPassEncoder;f.setPipeline(this._prefilterPipeline),f.setBindGroup(0,c),f.draw(3)})}),e.addPass("DofPass.composite","render",r=>{s=r.createTexture({label:"DofResult",...i}),s=r.write(s,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[0,0,0,1]}),r.read(t.hdr,"sampled"),r.read(u,"sampled"),r.setExecute((_,p)=>{const c=p.getOrCreateBindGroup({layout:this._bglComp0,entries:[{binding:0,resource:{buffer:this._uniformBuffer}},{binding:1,resource:p.getTextureView(t.hdr)},{binding:3,resource:this._sampler}]}),f=p.getOrCreateBindGroup({layout:this._bglComp1,entries:[{binding:0,resource:p.getTextureView(u)}]}),g=_.renderPassEncoder;g.setPipeline(this._compositePipeline),g.setBindGroup(0,c),g.setBindGroup(1,f),g.draw(3)})}),{result:s}}destroy(){this._uniformBuffer.destroy()}}export{C as D,D as T,B as a,W as c,Y as p};
