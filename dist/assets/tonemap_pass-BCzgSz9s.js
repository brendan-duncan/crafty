var y=Object.defineProperty;var h=(o,r,n)=>r in o?y(o,r,{enumerable:!0,configurable:!0,writable:!0,value:n}):o[r]=n;var t=(o,r,n)=>h(o,typeof r!="symbol"?r+"":r,n);import{a as B}from"./mesh-LUU9vCQq.js";const P=`// tonemap.wgsl — Exposure + ACES + Gamma correction

// ── ACES filmic ───────────────────────────────────────────────────────────────

fn aces_filmic(x: vec3<f32>) -> vec3<f32> {
  let a = 2.51; let b = 0.03; let c = 2.43; let d = 0.59; let e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), vec3<f32>(0.0), vec3<f32>(1.0));
}

// ── Structs & Bindings ────────────────────────────────────────────────────────

struct TonemapParams {
  exposure: f32,
  flags: u32,      // bit 0: enable ACES, bit 1: skip gamma (for HDR canvas)
  _pad0: f32,
  _pad1: f32,
}

@group(0) @binding(0) var hdr_tex: texture_2d<f32>;
@group(0) @binding(1) var samp: sampler;
@group(1) @binding(0) var<uniform> params: TonemapParams;

// ── Vertex shader ─────────────────────────────────────────────────────────────

struct VertOut {
  @builtin(position) pos: vec4<f32>,
  @location(0) uv: vec2<f32>,
}

@vertex
fn vs_main(@builtin(vertex_index) vid: u32) -> VertOut {
  let x = f32((vid & 1u) << 2u) - 1.0;
  let y = f32((vid & 2u) << 1u) - 1.0;
  var out: VertOut;
  out.pos = vec4<f32>(x, y, 0.0, 1.0);
  out.uv = vec2<f32>(x * 0.5 + 0.5, -y * 0.5 + 0.5);
  return out;
}

// ── Fragment shader ───────────────────────────────────────────────────────────

@fragment
fn fs_main(in: VertOut) -> @location(0) vec4<f32> {
  // Sample HDR scene
  var scene = textureSample(hdr_tex, samp, in.uv).rgb;

  // Apply exposure
  scene *= params.exposure;

  // Apply ACES tone mapping if enabled
  let use_aces = (params.flags & 1u) != 0u;
  let ldr = select(scene, aces_filmic(scene), use_aces);

  // Apply gamma correction (skip if bit 1 is set for HDR canvas)
  let skip_gamma = (params.flags & 2u) != 0u;
  if (skip_gamma) {
    return vec4<f32>(max(ldr, vec3<f32>(0.0)), 1.0);
  }

  return vec4<f32>(pow(max(ldr, vec3<f32>(0.0)), vec3<f32>(1.0 / 2.2)), 1.0);
}
`,f=16;class d extends B{constructor(n,s,a,e){super();t(this,"name","TonemapPass");t(this,"_pipeline");t(this,"_bg0");t(this,"_bg1");t(this,"_paramsBuf");t(this,"_paramsAB",new ArrayBuffer(f));t(this,"_paramsF",new Float32Array(this._paramsAB));t(this,"_paramsU",new Uint32Array(this._paramsAB));this._pipeline=n,this._bg0=s,this._bg1=a,this._paramsBuf=e}static create(n,s,a){const{device:e,format:p}=n,l=a??p,i=e.createBindGroupLayout({label:"TonemapBGL0",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),u=e.createBindGroupLayout({label:"TonemapBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),g=e.createSampler({label:"TonemapSampler",magFilter:"linear",minFilter:"linear"}),m=e.createBuffer({label:"TonemapParams",size:f,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),b=e.createBindGroup({label:"TonemapBG0",layout:i,entries:[{binding:0,resource:s},{binding:1,resource:g}]}),v=e.createBindGroup({label:"TonemapBG1",layout:u,entries:[{binding:0,resource:{buffer:m}}]}),c=e.createShaderModule({label:"TonemapShader",code:P}),_=e.createPipelineLayout({bindGroupLayouts:[i,u]}),x=e.createRenderPipeline({label:"TonemapPipeline",layout:_,vertex:{module:c,entryPoint:"vs_main"},fragment:{module:c,entryPoint:"fs_main",targets:[{format:l}]},primitive:{topology:"triangle-list"}});return new d(x,b,v,m)}updateParams(n,s,a,e){const p=this._paramsF,l=this._paramsU;let i=0;a&&(i|=1),e&&(i|=2),p[0]=s,l[1]=i,p[2]=0,p[3]=0,n.queue.writeBuffer(this._paramsBuf,0,this._paramsAB)}execute(n,s){const a=n.beginRenderPass({label:"TonemapPass",colorAttachments:[{view:s.getCurrentTexture().createView(),clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});a.setPipeline(this._pipeline),a.setBindGroup(0,this._bg0),a.setBindGroup(1,this._bg1),a.draw(3),a.end()}destroy(){this._paramsBuf.destroy()}}export{d as T};
