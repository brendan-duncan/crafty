var g=Object.defineProperty;var _=(s,i,t)=>i in s?g(s,i,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[i]=t;var a=(s,i,t)=>_(s,typeof i!="symbol"?i+"":i,t);import{a as x}from"./shadow-CGnDmh2T.js";import{H as b}from"./geometry_pass-B2KKiaBZ.js";const h=`// Sky pass — fullscreen triangle rendering an equirectangular HDR skybox.
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
`,d=80;class f extends x{constructor(t,o,e,r,n){super();a(this,"name","SkyPass");a(this,"_pipeline");a(this,"_uniformBuffer");a(this,"_uniformBG");a(this,"_textureBG");a(this,"_hdrView");a(this,"_scratch",new Float32Array(d/4));this._pipeline=t,this._uniformBuffer=o,this._uniformBG=e,this._textureBG=r,this._hdrView=n}static create(t,o,e){const{device:r}=t,n=r.createBuffer({label:"SkyUniformBuffer",size:d,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),u=r.createBindGroupLayout({label:"SkyUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),l=r.createBindGroupLayout({label:"SkyTextureBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),p=r.createSampler({label:"SkySampler",magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"clamp-to-edge"}),m=r.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:n}}]}),y=r.createBindGroup({layout:l,entries:[{binding:0,resource:e.view},{binding:1,resource:p}]}),c=r.createShaderModule({label:"SkyShader",code:h}),v=r.createRenderPipeline({label:"SkyPipeline",layout:r.createPipelineLayout({bindGroupLayouts:[u,l]}),vertex:{module:c,entryPoint:"vs_main"},fragment:{module:c,entryPoint:"fs_main",targets:[{format:b}]},primitive:{topology:"triangle-list"}});return new f(v,n,m,y,o)}updateCamera(t,o,e,r=.2){const n=this._scratch;n.set(o.data,0),n[16]=e.x,n[17]=e.y,n[18]=e.z,n[19]=r,t.queue.writeBuffer(this._uniformBuffer,0,n.buffer)}execute(t,o){const e=t.beginRenderPass({label:"SkyPass",colorAttachments:[{view:this._hdrView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});e.setPipeline(this._pipeline),e.setBindGroup(0,this._uniformBG),e.setBindGroup(1,this._textureBG),e.draw(3),e.end()}destroy(){this._uniformBuffer.destroy()}}export{f as S};
