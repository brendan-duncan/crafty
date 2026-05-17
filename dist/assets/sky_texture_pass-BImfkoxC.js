var _=Object.defineProperty;var v=(d,a,e)=>a in d?_(d,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):d[a]=e;var i=(d,a,e)=>v(d,typeof a!="symbol"?a+"":a,e);import{P as y}from"./mesh-B_UY4euz.js";import{H as m}from"./deferred_lighting_pass-BZaHbbPw.js";const x=`// Sky pass — fullscreen triangle rendering an equirectangular HDR skybox.
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
`,g=80;class h extends y{constructor(e,t,r,n,s,o,u,l){super();i(this,"name","SkyTexturePass");i(this,"exposure",.2);i(this,"_device");i(this,"_shader");i(this,"_pipelineLayout");i(this,"_pipelineCache",new Map);i(this,"_uniformBuffer");i(this,"_uniformBg");i(this,"_textureBg");i(this,"_textureBgl");i(this,"_sampler");i(this,"_scratch",new Float32Array(g/4));this._device=e,this._shader=t,this._pipelineLayout=r,this._uniformBuffer=n,this._uniformBg=s,this._textureBg=o,this._textureBgl=u,this._sampler=l}static create(e,t){const{device:r}=e,n=r.createBuffer({label:"SkyUniformBuffer",size:g,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),s=r.createBindGroupLayout({label:"SkyUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),o=r.createBindGroupLayout({label:"SkyTextureBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),u=r.createSampler({label:"SkySampler",magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"clamp-to-edge"}),l=r.createBindGroup({layout:s,entries:[{binding:0,resource:{buffer:n}}]}),f=r.createBindGroup({layout:o,entries:[{binding:0,resource:t.view},{binding:1,resource:u}]}),p=e.createShaderModule(x,"SkyShader"),c=r.createPipelineLayout({bindGroupLayouts:[s,o]});return new h(r,p,c,n,l,f,o,u)}_getPipeline(e){let t=this._pipelineCache.get(e);return t||(t=this._device.createRenderPipeline({label:`SkyPipeline[${e}]`,layout:this._pipelineLayout,vertex:{module:this._shader,entryPoint:"vs_main"},fragment:{module:this._shader,entryPoint:"fs_main",targets:[{format:e}]},primitive:{topology:"triangle-list"}}),this._pipelineCache.set(e,t),t)}setSkyTexture(e){this._textureBg=this._device.createBindGroup({layout:this._textureBgl,entries:[{binding:0,resource:e.view},{binding:1,resource:this._sampler}]})}updateCamera(e){const t=e.activeCamera;if(!t)throw new Error("SkyTexturePass.updateCamera: ctx.activeCamera is null");const r=t.position(),n=this._scratch;n.set(t.inverseViewProjectionMatrix().data,0),n[16]=r.x,n[17]=r.y,n[18]=r.z,n[19]=this.exposure,e.queue.writeBuffer(this._uniformBuffer,0,n.buffer)}addToGraph(e,t={}){const{ctx:r}=e,n=this._resolveColorTarget(e,t.output??t.hdr),s=n.format,o=n.handle!==null;let u;return e.addPass(this.name,"render",l=>{const f=n.handle??l.createTexture({label:"sky.hdr",format:s,width:r.width,height:r.height,extraUsage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC});u=l.write(f,"attachment",{loadOp:t.load??(o?"load":"clear"),storeOp:"store",clearValue:[0,0,0,1]}),l.setExecute(p=>{const c=p.renderPassEncoder;c.setPipeline(this._getPipeline(s)),c.setBindGroup(0,this._uniformBg),c.setBindGroup(1,this._textureBg),c.draw(3)})}),{hdr:u}}_resolveColorTarget(e,t){if(t===void 0)return{handle:null,format:m};if(t==="backbuffer")return{handle:e.getBackbuffer(),format:e.ctx.format};if(t==="auto")try{return{handle:e.getBackbuffer(),format:e.ctx.format}}catch{return{handle:null,format:m}}const r=e.getResourceInfo(t.id);return{handle:t,format:(r==null?void 0:r.format)??m}}destroy(){this._uniformBuffer.destroy()}}export{h as S};
