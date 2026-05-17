var C=Object.defineProperty;var L=(l,a,e)=>a in l?C(l,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[a]=e;var p=(l,a,e)=>L(l,typeof a!="symbol"?a+"":a,e);import{T as M}from"./texture-R38axQR3.js";import{P as R,h as A}from"./mesh-B_UY4euz.js";import{H as x}from"./deferred_lighting_pass-BZaHbbPw.js";const N=`// Decodes an RGBE (Radiance HDR) texture into a linear rgba16float texture.
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
`;function Y(l){const a=new Uint8Array(l);let e=0;function t(){let c="";for(;e<a.length&&a[e]!==10;)a[e]!==13&&(c+=String.fromCharCode(a[e])),e++;return e<a.length&&e++,c}const n=t();if(!n.startsWith("#?RADIANCE")&&!n.startsWith("#?RGBE"))throw new Error(`Not a Radiance HDR file (magic: "${n}")`);for(;t().length!==0;);const u=t(),i=u.match(/-Y\s+(\d+)\s+\+X\s+(\d+)/);if(!i)throw new Error(`Unrecognized HDR resolution: "${u}"`);const s=parseInt(i[1],10),o=parseInt(i[2],10),r=new Uint8Array(o*s*4);function b(c){const d=new Uint8Array(o),g=new Uint8Array(o),y=new Uint8Array(o),w=new Uint8Array(o),h=[d,g,y,w];for(let _=0;_<4;_++){const G=h[_];let v=0;for(;v<o;){const P=a[e++];if(P>128){const T=P-128,B=a[e++];G.fill(B,v,v+T),v+=T}else G.set(a.subarray(e,e+P),v),e+=P,v+=P}}const m=c*o*4;for(let _=0;_<o;_++)r[m+_*4+0]=d[_],r[m+_*4+1]=g[_],r[m+_*4+2]=y[_],r[m+_*4+3]=w[_]}function f(c,d,g,y,w){const h=c*o*4;r[h+0]=d,r[h+1]=g,r[h+2]=y,r[h+3]=w;let m=1;for(;m<o;){const _=a[e++],G=a[e++],v=a[e++],P=a[e++];if(_===1&&G===1&&v===1){const T=h+(m-1)*4;for(let B=0;B<P;B++)r[h+m*4+0]=r[T+0],r[h+m*4+1]=r[T+1],r[h+m*4+2]=r[T+2],r[h+m*4+3]=r[T+3],m++}else r[h+m*4+0]=_,r[h+m*4+1]=G,r[h+m*4+2]=v,r[h+m*4+3]=P,m++}}for(let c=0;c<s&&!(e+4>a.length);c++){const d=a[e++],g=a[e++],y=a[e++],w=a[e++];if(d===2&&g===2&&!(y&128)){const h=y<<8|w;if(h!==o)throw new Error(`HDR scanline width mismatch: ${h} vs ${o}`);b(c)}else f(c,d,g,y,w)}return{width:o,height:s,data:r}}const U=new WeakMap;function O(l){const a=U.get(l);if(a)return a;const e=l.createBindGroupLayout({label:"RgbeSrcBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"uint"}}]}),t=l.createBindGroupLayout({label:"RgbeDstBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"2d"}}]}),n=l.createPipelineLayout({bindGroupLayouts:[e,t]}),u=l.createShaderModule({label:"RgbeDecode",code:N}),s={pipeline:l.createComputePipeline({label:"RgbeDecodePipeline",layout:n,compute:{module:u,entryPoint:"cs_decode"}}),srcBGL:e,dstBGL:t};return U.set(l,s),s}async function $(l,a){const{width:e,height:t,data:n}=a,{pipeline:u,srcBGL:i,dstBGL:s}=O(l),o=l.createTexture({label:"Sky RGBE Raw",size:{width:e,height:t},format:"rgba8uint",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});l.queue.writeTexture({texture:o},n.buffer,{bytesPerRow:e*4},{width:e,height:t});const r=l.createTexture({label:"Sky HDR Texture",size:{width:e,height:t},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),b=l.createBindGroup({layout:i,entries:[{binding:0,resource:o.createView()}]}),f=l.createBindGroup({layout:s,entries:[{binding:0,resource:r.createView()}]}),c=l.createCommandEncoder({label:"RgbeDecodeEncoder"}),d=c.beginComputePass({label:"RgbeDecodePass"});return d.setPipeline(u),d.setBindGroup(0,b),d.setBindGroup(1,f),d.dispatchWorkgroups(Math.ceil(e/8),Math.ceil(t/8)),d.end(),l.queue.submit([c.finish()]),await l.queue.onSubmittedWorkDone(),o.destroy(),new M(r,"2d")}const V=`// TAA resolve pass — fullscreen triangle, blends current HDR with reprojected history.

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
`,S=128,F="taa:history",I={label:"TAAHistory",format:x,width:0,height:0};class E extends R{constructor(e,t,n,u,i){super();p(this,"name","TAAPass");p(this,"_pipeline");p(this,"_textureBgl");p(this,"_uniformBg");p(this,"_uniformBuffer");p(this,"_sampler");p(this,"_scratch",new Float32Array(S/4));p(this,"sampleCount",16);p(this,"_frameIndex",0);this._pipeline=e,this._textureBgl=t,this._uniformBg=n,this._uniformBuffer=u,this._sampler=i}static create(e){const{device:t}=e,n=t.createBuffer({label:"TAAUniformBuffer",size:S,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),u=t.createBindGroupLayout({label:"TAAUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),i=t.createBindGroupLayout({label:"TAATextureBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),s=t.createSampler({label:"TAALinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),o=t.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:n}}]}),r=e.createShaderModule(V,"TAAShader"),b=t.createRenderPipeline({label:"TAAPipeline",layout:t.createPipelineLayout({bindGroupLayouts:[u,i]}),vertex:{module:r,entryPoint:"vs_main"},fragment:{module:r,entryPoint:"fs_main",targets:[{format:x}]},primitive:{topology:"triangle-list"}});return new E(b,i,o,n,s)}updateCamera(e){const t=e.activeCamera;if(!t)throw new Error("TAAPass.updateCamera: ctx.activeCamera is null");const n=this._frameIndex%this.sampleCount+1,u=(A(n,2)-.5)*(2/e.width),i=(A(n,3)-.5)*(2/e.height);t.applyJitter(u,i);const s=this._scratch;s.set(t.inverseViewProjectionMatrix().data,0),s.set(t.previousViewProjectionMatrix().data,16),e.queue.writeBuffer(this._uniformBuffer,0,s.buffer),this._frameIndex++}resetJitter(){this._frameIndex=0}addToGraph(e,t){const{ctx:n}=e,u=this._resolveTarget(e,t.output),i=e.importPersistentTexture(F,{...I,width:n.width,height:n.height});let s,o;return e.addPass("TAAPass.resolve","render",r=>{const b=u??r.createTexture({label:"TAAResolved",format:x,width:n.width,height:n.height,extraUsage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC});s=r.write(b,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[0,0,0,1]}),r.read(t.hdr,"sampled"),r.read(i,"sampled"),r.read(t.depth,"sampled"),r.setExecute((f,c)=>{const d=c.getOrCreateBindGroup({layout:this._textureBgl,entries:[{binding:0,resource:c.getTextureView(t.hdr)},{binding:1,resource:c.getTextureView(i)},{binding:2,resource:c.getTextureView(t.depth)},{binding:3,resource:this._sampler}]}),g=f.renderPassEncoder;g.setPipeline(this._pipeline),g.setBindGroup(0,this._uniformBg),g.setBindGroup(1,d),g.draw(3)})}),e.addPass("TAAPass.copyHistory","transfer",r=>{r.read(s,"copy-src"),o=r.write(i,"copy-dst"),r.setExecute((b,f)=>{b.commandEncoder.copyTextureToTexture({texture:f.getTexture(s)},{texture:f.getTexture(i)},{width:n.width,height:n.height})})}),{resolved:s,history:o}}_resolveTarget(e,t){if(t===void 0)return null;if(t==="backbuffer"){const u=e.getBackbuffer(),i=e.getResourceInfo(u.id);if((i==null?void 0:i.format)!==x)throw new Error(`[TAAPass] output: 'backbuffer' requires canvas format ${x}, got ${i==null?void 0:i.format}.`);return u}if(t==="auto")try{const u=e.getBackbuffer(),i=e.getResourceInfo(u.id);return(i==null?void 0:i.format)===x?u:null}catch{return null}const n=e.getResourceInfo(t.id);if((n==null?void 0:n.format)!==x)throw new Error(`[TAAPass] output handle must have format ${x}, got ${n==null?void 0:n.format}.`);return t}destroy(){this._uniformBuffer.destroy()}}const k=`// Depth of Field: prefilter (CoC + 2x downsample) then fused disc-blur + composite.

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
`,H=32;class D extends R{constructor(e,t,n,u,i,s,o){super();p(this,"name","DofPass");p(this,"_bglPrefilter");p(this,"_bglComp0");p(this,"_bglComp1");p(this,"_prefilterPipeline");p(this,"_compositePipeline");p(this,"_uniformBuffer");p(this,"_sampler");p(this,"_scratch",new Float32Array(8));this._bglPrefilter=e,this._bglComp0=t,this._bglComp1=n,this._prefilterPipeline=u,this._compositePipeline=i,this._uniformBuffer=s,this._sampler=o}static create(e){const{device:t}=e,n=t.createBuffer({label:"DofUniforms",size:H,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});t.queue.writeBuffer(n,0,new Float32Array([30,60,6,.1,1e3,1,0,0]).buffer);const u=t.createSampler({label:"DofSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),i=t.createBindGroupLayout({label:"DofBGL0Prefilter",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),s=t.createBindGroupLayout({label:"DofBGL0Composite",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),o=t.createBindGroupLayout({label:"DofBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),r=e.createShaderModule(k,"DofShader"),b=t.createRenderPipeline({label:"DofPrefilterPipeline",layout:t.createPipelineLayout({bindGroupLayouts:[i]}),vertex:{module:r,entryPoint:"vs_main"},fragment:{module:r,entryPoint:"fs_prefilter",targets:[{format:x}]},primitive:{topology:"triangle-list"}}),f=t.createRenderPipeline({label:"DofCompositePipeline",layout:t.createPipelineLayout({bindGroupLayouts:[s,o]}),vertex:{module:r,entryPoint:"vs_main"},fragment:{module:r,entryPoint:"fs_composite",targets:[{format:x}]},primitive:{topology:"triangle-list"}});return new D(i,s,o,b,f,n,u)}updateParams(e,t=30,n=60,u=6,i=.1,s=1e3,o=1){this._scratch[0]=t,this._scratch[1]=n,this._scratch[2]=u,this._scratch[3]=i,this._scratch[4]=s,this._scratch[5]=o,this._scratch[6]=0,this._scratch[7]=0,e.queue.writeBuffer(this._uniformBuffer,0,this._scratch.buffer)}addToGraph(e,t){const{ctx:n}=e,u={format:x,width:Math.max(1,n.width>>1),height:Math.max(1,n.height>>1)},i={format:x,width:n.width,height:n.height};let s,o;return e.addPass("DofPass.prefilter","render",r=>{s=r.createTexture({label:"DofHalf",...u}),s=r.write(s,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[0,0,0,0]}),r.read(t.hdr,"sampled"),r.read(t.depth,"sampled"),r.setExecute((b,f)=>{const c=f.getOrCreateBindGroup({layout:this._bglPrefilter,entries:[{binding:0,resource:{buffer:this._uniformBuffer}},{binding:1,resource:f.getTextureView(t.hdr)},{binding:2,resource:f.getTextureView(t.depth)},{binding:3,resource:this._sampler}]}),d=b.renderPassEncoder;d.setPipeline(this._prefilterPipeline),d.setBindGroup(0,c),d.draw(3)})}),e.addPass("DofPass.composite","render",r=>{o=r.createTexture({label:"DofResult",...i}),o=r.write(o,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[0,0,0,1]}),r.read(t.hdr,"sampled"),r.read(s,"sampled"),r.setExecute((b,f)=>{const c=f.getOrCreateBindGroup({layout:this._bglComp0,entries:[{binding:0,resource:{buffer:this._uniformBuffer}},{binding:1,resource:f.getTextureView(t.hdr)},{binding:3,resource:this._sampler}]}),d=f.getOrCreateBindGroup({layout:this._bglComp1,entries:[{binding:0,resource:f.getTextureView(s)}]}),g=b.renderPassEncoder;g.setPipeline(this._compositePipeline),g.setBindGroup(0,c),g.setBindGroup(1,d),g.draw(3)})}),{result:o}}destroy(){this._uniformBuffer.destroy()}}export{D,E as T,$ as c,Y as p};
