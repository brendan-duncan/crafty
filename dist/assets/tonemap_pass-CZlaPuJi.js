var h=Object.defineProperty;var v=(l,s,a)=>s in l?h(l,s,{enumerable:!0,configurable:!0,writable:!0,value:a}):l[s]=a;var r=(l,s,a)=>v(l,typeof s!="symbol"?s+"":s,a);import{P as B}from"./pass-CMGsmZgn.js";const b=`// tonemap.wgsl — Exposure + ACES + Gamma correction

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
`,c=16;class f extends B{constructor(a,t,e,i,n){super();r(this,"name","TonemapPass");r(this,"_pipeline");r(this,"_hdrBgl");r(this,"_paramsBg");r(this,"_paramsBuf");r(this,"_sampler");r(this,"_paramsAB",new ArrayBuffer(c));r(this,"_paramsF",new Float32Array(this._paramsAB));r(this,"_paramsU",new Uint32Array(this._paramsAB));this._pipeline=a,this._hdrBgl=t,this._paramsBg=e,this._paramsBuf=i,this._sampler=n}static create(a,t){const{device:e,format:i}=a,n=t??i,o=e.createBindGroupLayout({label:"TonemapBGL0",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),p=e.createBindGroupLayout({label:"TonemapBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),d=e.createSampler({label:"TonemapSampler",magFilter:"linear",minFilter:"linear"}),m=e.createBuffer({label:"TonemapParams",size:c,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),g=e.createBindGroup({label:"TonemapBG1",layout:p,entries:[{binding:0,resource:{buffer:m}}]}),u=a.createShaderModule(b,"TonemapShader"),_=e.createRenderPipeline({label:"TonemapPipeline",layout:e.createPipelineLayout({bindGroupLayouts:[o,p]}),vertex:{module:u,entryPoint:"vs_main"},fragment:{module:u,entryPoint:"fs_main",targets:[{format:n}]},primitive:{topology:"triangle-list"}});return new f(_,o,g,m,d)}addToGraph(a,t){a.addPass(this.name,"render",e=>{e.read(t.hdr,"sampled"),e.write(t.backbuffer,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[0,0,0,1]}),e.setExecute((i,n)=>{const o=n.getOrCreateBindGroup({label:"TonemapBG0",layout:this._hdrBgl,entries:[{binding:0,resource:n.getTextureView(t.hdr)},{binding:1,resource:this._sampler}]}),p=i.renderPassEncoder;p.setPipeline(this._pipeline),p.setBindGroup(0,o),p.setBindGroup(1,this._paramsBg),p.draw(3)})})}updateParams(a,t,e,i){let n=0;e&&(n|=1),i&&(n|=2),this._paramsF[0]=t,this._paramsU[1]=n,this._paramsF[2]=0,this._paramsF[3]=0,a.queue.writeBuffer(this._paramsBuf,0,this._paramsAB)}destroy(){this._paramsBuf.destroy()}}export{f as T};
