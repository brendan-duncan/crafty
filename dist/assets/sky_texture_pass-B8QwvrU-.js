var g=Object.defineProperty;var _=(o,i,e)=>i in o?g(o,i,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[i]=e;var a=(o,i,e)=>_(o,typeof i!="symbol"?i+"":i,e);import{a as x}from"./mesh-BK4JnZ1v.js";import{H as b}from"./deferred_lighting_pass-BBq3Yn03.js";const h=`// Sky pass — fullscreen triangle rendering an equirectangular HDR skybox.
// Texture is pre-decoded to rgba16float so bilinear filtering works in linear HDR space.

const PI: f32 = 3.14159265358979323846;

struct SkyUniforms {
  invViewProj: mat4x4<f32>,
  cameraPos  : vec3<f32>,
  exposure   : f32,
}

@group(0) @binding(0) var<uniform> sky        : SkyUniforms;
@group(1) @binding(0) var          sky_tex    : texture_2d<f32>;
@group(1) @binding(1) var          sky_sampler: sampler;

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

// Maps a unit direction to equirectangular (latlong) UV coordinates.
// u wraps around Y axis; v is polar angle from top (0) to bottom (1).
fn equirect_uv(dir: vec3<f32>) -> vec2<f32> {
  let u = atan2(-dir.z, dir.x) / (2.0 * PI) + 0.5;
  let v = acos(clamp(dir.y, -1.0, 1.0)) / PI;
  return vec2<f32>(u, v);
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  // Reconstruct world-space point on the far plane, then derive view direction.
  let ndc     = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, 1.0, 1.0);
  let world_h = sky.invViewProj * ndc;
  let dir     = normalize(world_h.xyz / world_h.w - sky.cameraPos);

  let uv  = equirect_uv(dir);
  let rgb = textureSample(sky_tex, sky_sampler, uv).rgb;
  return vec4<f32>(rgb * sky.exposure, 1.0);
}
`,f=80;class d extends x{constructor(e,s,r,t,n){super();a(this,"name","SkyPass");a(this,"_pipeline");a(this,"_uniformBuffer");a(this,"_uniformBG");a(this,"_textureBG");a(this,"_hdrView");a(this,"_scratch",new Float32Array(f/4));this._pipeline=e,this._uniformBuffer=s,this._uniformBG=r,this._textureBG=t,this._hdrView=n}static create(e,s,r){const{device:t}=e,n=t.createBuffer({label:"SkyUniformBuffer",size:f,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),u=t.createBindGroupLayout({label:"SkyUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),l=t.createBindGroupLayout({label:"SkyTextureBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),p=t.createSampler({label:"SkySampler",magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"clamp-to-edge"}),m=t.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:n}}]}),y=t.createBindGroup({layout:l,entries:[{binding:0,resource:r.view},{binding:1,resource:p}]}),c=e.createShaderModule(h,"SkyShader"),v=t.createRenderPipeline({label:"SkyPipeline",layout:t.createPipelineLayout({bindGroupLayouts:[u,l]}),vertex:{module:c,entryPoint:"vs_main"},fragment:{module:c,entryPoint:"fs_main",targets:[{format:b}]},primitive:{topology:"triangle-list"}});return new d(v,n,m,y,s)}updateCamera(e,s,r,t=.2){const n=this._scratch;n.set(s.data,0),n[16]=r.x,n[17]=r.y,n[18]=r.z,n[19]=t,e.queue.writeBuffer(this._uniformBuffer,0,n.buffer)}execute(e,s){const r=e.beginRenderPass({label:"SkyPass",colorAttachments:[{view:this._hdrView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._pipeline),r.setBindGroup(0,this._uniformBG),r.setBindGroup(1,this._textureBG),r.draw(3),r.end()}destroy(){this._uniformBuffer.destroy()}}export{d as S};
