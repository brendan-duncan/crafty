var I=Object.defineProperty;var N=(b,s,t)=>s in b?I(b,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):b[s]=t;var i=(b,s,t)=>N(b,typeof s!="symbol"?s+"":s,t);import{f as G,H as U,V as F,i as j}from"./block_texture-DUcatH03.js";class H{constructor(){i(this,"_passes",[])}addPass(s){this._passes.push(s)}async execute(s){s.pushFrameErrorScope();const t=s.device.createCommandEncoder();for(const n of this._passes)n.enabled&&n.execute(t,s);s.queue.submit([t.finish()]),await s.popFrameErrorScope()}destroy(){for(const s of this._passes)s.destroy();this._passes=[]}}const z=`// Sky pass — fullscreen triangle rendering an equirectangular HDR skybox.\r
// Texture is pre-decoded to rgba16float so bilinear filtering works in linear HDR space.\r
\r
const PI: f32 = 3.14159265358979323846;\r
\r
struct SkyUniforms {\r
  invViewProj: mat4x4<f32>,\r
  cameraPos  : vec3<f32>,\r
  exposure   : f32,\r
}\r
\r
@group(0) @binding(0) var<uniform> sky        : SkyUniforms;\r
@group(1) @binding(0) var          sky_tex    : texture_2d<f32>;\r
@group(1) @binding(1) var          sky_sampler: sampler;\r
\r
struct VertexOutput {\r
  @builtin(position) clip_pos: vec4<f32>,\r
  @location(0)       uv     : vec2<f32>,\r
}\r
\r
@vertex\r
fn vs_main(@builtin(vertex_index) vid: u32) -> VertexOutput {\r
  let x = f32((vid & 1u) << 2u) - 1.0;\r
  let y = f32((vid & 2u) << 1u) - 1.0;\r
  var out: VertexOutput;\r
  out.clip_pos = vec4<f32>(x, y, 0.0, 1.0);\r
  out.uv       = vec2<f32>(x * 0.5 + 0.5, -y * 0.5 + 0.5);\r
  return out;\r
}\r
\r
// Maps a unit direction to equirectangular (latlong) UV coordinates.\r
// u wraps around Y axis; v is polar angle from top (0) to bottom (1).\r
fn equirect_uv(dir: vec3<f32>) -> vec2<f32> {\r
  let u = atan2(-dir.z, dir.x) / (2.0 * PI) + 0.5;\r
  let v = acos(clamp(dir.y, -1.0, 1.0)) / PI;\r
  return vec2<f32>(u, v);\r
}\r
\r
@fragment\r
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {\r
  // Reconstruct world-space point on the far plane, then derive view direction.\r
  let ndc     = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, 1.0, 1.0);\r
  let world_h = sky.invViewProj * ndc;\r
  let dir     = normalize(world_h.xyz / world_h.w - sky.cameraPos);\r
\r
  let uv  = equirect_uv(dir);\r
  let rgb = textureSample(sky_tex, sky_sampler, uv).rgb;\r
  return vec4<f32>(rgb * sky.exposure, 1.0);\r
}\r
`,x=80;class P extends G{constructor(t,n,e,r,a){super();i(this,"name","SkyPass");i(this,"_pipeline");i(this,"_uniformBuffer");i(this,"_uniformBG");i(this,"_textureBG");i(this,"_hdrView");this._pipeline=t,this._uniformBuffer=n,this._uniformBG=e,this._textureBG=r,this._hdrView=a}static create(t,n,e){const{device:r}=t,a=r.createBuffer({label:"SkyUniformBuffer",size:x,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),o=r.createBindGroupLayout({label:"SkyUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),m=r.createBindGroupLayout({label:"SkyTextureBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),d=r.createSampler({label:"SkySampler",magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"clamp-to-edge"}),f=r.createBindGroup({layout:o,entries:[{binding:0,resource:{buffer:a}}]}),_=r.createBindGroup({layout:m,entries:[{binding:0,resource:e.view},{binding:1,resource:d}]}),p=r.createShaderModule({label:"SkyShader",code:z}),u=r.createRenderPipeline({label:"SkyPipeline",layout:r.createPipelineLayout({bindGroupLayouts:[o,m]}),vertex:{module:p,entryPoint:"vs_main"},fragment:{module:p,entryPoint:"fs_main",targets:[{format:U}]},primitive:{topology:"triangle-list"}});return new P(u,a,f,_,n)}updateCamera(t,n,e,r=.2){const a=new Float32Array(x/4);a.set(n.data,0),a[16]=e.x,a[17]=e.y,a[18]=e.z,a[19]=r,t.queue.writeBuffer(this._uniformBuffer,0,a.buffer)}execute(t,n){const e=t.beginRenderPass({label:"SkyPass",colorAttachments:[{view:this._hdrView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});e.setPipeline(this._pipeline),e.setBindGroup(0,this._uniformBG),e.setBindGroup(1,this._textureBG),e.draw(3),e.end()}destroy(){this._uniformBuffer.destroy()}}const A=80,C=[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x3"},{shaderLocation:2,offset:24,format:"float32x2"},{shaderLocation:3,offset:32,format:"float32x4"},{shaderLocation:4,offset:48,format:"uint32x4"},{shaderLocation:5,offset:64,format:"float32x4"}];class T{constructor(s,t,n){i(this,"vertexBuffer");i(this,"indexBuffer");i(this,"indexCount");this.vertexBuffer=s,this.indexBuffer=t,this.indexCount=n}static fromData(s,t,n){const e=s.createBuffer({label:"SkinnedMesh VertexBuffer",size:t.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});s.queue.writeBuffer(e,0,t.buffer,t.byteOffset,t.byteLength);const r=s.createBuffer({label:"SkinnedMesh IndexBuffer",size:n.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST});return s.queue.writeBuffer(r,0,n.buffer,n.byteOffset,n.byteLength),new T(e,r,n.length)}destroy(){this.vertexBuffer.destroy(),this.indexBuffer.destroy()}}const q=`// Skinned GBuffer fill pass — GPU vertex skinning with up to 4 bone influences.\r
// Identical to geometry.wgsl except for the extra joint/weight inputs and the\r
// joint_matrices storage buffer at group 4.\r
\r
struct CameraUniforms {\r
  view       : mat4x4<f32>,\r
  proj       : mat4x4<f32>,\r
  viewProj   : mat4x4<f32>,\r
  invViewProj: mat4x4<f32>,\r
  position   : vec3<f32>,\r
  near       : f32,\r
  far        : f32,\r
}\r
\r
struct ModelUniforms {\r
  model       : mat4x4<f32>,\r
  normalMatrix: mat4x4<f32>,\r
}\r
\r
struct MaterialUniforms {\r
  albedo   : vec4<f32>,\r
  roughness: f32,\r
  metallic : f32,\r
  uvOffset : vec2<f32>,\r
  uvScale  : vec2<f32>,\r
  uvTile   : vec2<f32>,\r
}\r
\r
@group(0) @binding(0) var<uniform>       camera        : CameraUniforms;\r
@group(1) @binding(0) var<uniform>       model         : ModelUniforms;\r
@group(1) @binding(1) var<storage, read> joint_matrices: array<mat4x4<f32>>;\r
@group(2) @binding(0) var<uniform>       material      : MaterialUniforms;\r
@group(3) @binding(0) var                albedo_map    : texture_2d<f32>;\r
@group(3) @binding(1) var                normal_map    : texture_2d<f32>;\r
@group(3) @binding(2) var                mer_map       : texture_2d<f32>;\r
@group(3) @binding(3) var                mat_samp      : sampler;\r
\r
struct VertexInput {\r
  @location(0) position: vec3<f32>,\r
  @location(1) normal  : vec3<f32>,\r
  @location(2) uv      : vec2<f32>,\r
  @location(3) tangent : vec4<f32>,\r
  @location(4) joints  : vec4<u32>,\r
  @location(5) weights : vec4<f32>,\r
}\r
\r
struct VertexOutput {\r
  @builtin(position) clip_pos  : vec4<f32>,\r
  @location(0)       world_pos : vec3<f32>,\r
  @location(1)       world_norm: vec3<f32>,\r
  @location(2)       uv        : vec2<f32>,\r
  @location(3)       world_tan : vec4<f32>,\r
}\r
\r
@vertex\r
fn vs_main(vin: VertexInput) -> VertexOutput {\r
  // Blend joint matrices by weights\r
  let skin_mat =\r
      vin.weights.x * joint_matrices[vin.joints.x] +\r
      vin.weights.y * joint_matrices[vin.joints.y] +\r
      vin.weights.z * joint_matrices[vin.joints.z] +\r
      vin.weights.w * joint_matrices[vin.joints.w];\r
\r
  let skinned_pos  = skin_mat * vec4<f32>(vin.position,    1.0);\r
  let skinned_norm = skin_mat * vec4<f32>(vin.normal,      0.0);\r
  let skinned_tan  = skin_mat * vec4<f32>(vin.tangent.xyz, 0.0);\r
\r
  let world_pos  = model.model * skinned_pos;\r
  let world_norm = normalize((model.normalMatrix * skinned_norm).xyz);\r
  let world_tan  = normalize((model.normalMatrix * skinned_tan).xyz);\r
\r
  var out: VertexOutput;\r
  out.clip_pos   = camera.viewProj * world_pos;\r
  out.world_pos  = world_pos.xyz;\r
  out.world_norm = world_norm;\r
  out.uv         = vin.uv;\r
  out.world_tan  = vec4<f32>(world_tan, vin.tangent.w);\r
  return out;\r
}\r
\r
struct FragmentOutput {\r
  @location(0) albedo_roughness: vec4<f32>,\r
  @location(1) normal_metallic : vec4<f32>,\r
}\r
\r
@fragment\r
fn fs_main(in: VertexOutput) -> FragmentOutput {\r
  let atlas_uv = fract(in.uv * material.uvTile) * material.uvScale + material.uvOffset;\r
\r
  let tex_albedo = textureSample(albedo_map, mat_samp, atlas_uv);\r
  let albedo     = tex_albedo.rgb * material.albedo.rgb;\r
\r
  let mer      = textureSample(mer_map, mat_samp, atlas_uv);\r
  let roughness = material.roughness * mer.b;\r
  let metallic  = material.metallic  * mer.r;\r
\r
  let N       = normalize(in.world_norm);\r
  let T       = normalize(in.world_tan.xyz);\r
  let T_ortho = normalize(T - N * dot(T, N));\r
  let B       = cross(N, T_ortho) * in.world_tan.w;\r
  let tbn     = mat3x3<f32>(T_ortho, B, N);\r
\r
  let n_ts    = textureSample(normal_map, mat_samp, atlas_uv).rgb * 2.0 - 1.0;\r
  let mapped_N = normalize(tbn * n_ts);\r
\r
  var out: FragmentOutput;\r
  out.albedo_roughness = vec4<f32>(albedo, roughness);\r
  out.normal_metallic  = vec4<f32>(mapped_N * 0.5 + 0.5, metallic);\r
  return out;\r
}\r
`,w=64*4+16+16,X=128,J=48;class M extends G{constructor(t,n,e,r,a,o,m,d,f,_,p,u,l,h,c){super();i(this,"name","SkinnedGeometryPass");i(this,"_gbuffer");i(this,"_pipeline");i(this,"_modelJointBGL");i(this,"_materialBGL");i(this,"_textureBGL");i(this,"_cameraBuffer");i(this,"_cameraBindGroup");i(this,"_modelBuffers",[]);i(this,"_jointBuffers",[]);i(this,"_jointBufferSizes",[]);i(this,"_modelJointBindGroups",[]);i(this,"_materialBuffers",[]);i(this,"_materialBindGroups",[]);i(this,"_whiteTex");i(this,"_flatNormalTex");i(this,"_merDefaultTex");i(this,"_whiteView");i(this,"_flatNormalView");i(this,"_merDefaultView");i(this,"_materialSampler");i(this,"_textureBGs",new WeakMap);i(this,"_drawItems",[]);i(this,"_modelData",new Float32Array(32));i(this,"_matData",new Float32Array(12));this._gbuffer=t,this._pipeline=n,this._modelJointBGL=r,this._materialBGL=a,this._textureBGL=o,this._cameraBuffer=m,this._cameraBindGroup=d,this._whiteTex=f,this._whiteView=_,this._flatNormalTex=p,this._flatNormalView=u,this._merDefaultTex=l,this._merDefaultView=h,this._materialSampler=c}static create(t,n){const{device:e}=t,r=e.createBindGroupLayout({label:"SkinnedGeomCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),a=e.createBindGroupLayout({label:"SkinnedGeomModelJointBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}}]}),o=e.createBindGroupLayout({label:"SkinnedGeomMaterialBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),m=e.createBindGroupLayout({label:"SkinnedGeomTextureBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]});function d(O,k,R,E,D){const v=e.createTexture({label:O,size:{width:1,height:1},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return e.queue.writeTexture({texture:v},new Uint8Array([k,R,E,D]),{bytesPerRow:4},{width:1,height:1}),[v,v.createView()]}const[f,_]=d("SkinnedGeomWhite",255,255,255,255),[p,u]=d("SkinnedGeomFlatNormal",128,128,255,255),[l,h]=d("SkinnedGeomMerDefault",255,255,255,255),c=e.createSampler({label:"SkinnedGeomMaterialSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"}),g=e.createBuffer({label:"SkinnedGeomCameraBuffer",size:w,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),B=e.createBindGroup({label:"SkinnedGeomCameraBG",layout:r,entries:[{binding:0,resource:{buffer:g}}]}),y=e.createShaderModule({label:"SkinnedGeometryShader",code:q}),L=e.createRenderPipeline({label:"SkinnedGeometryPipeline",layout:e.createPipelineLayout({bindGroupLayouts:[r,a,o,m]}),vertex:{module:y,entryPoint:"vs_main",buffers:[{arrayStride:A,attributes:C}]},fragment:{module:y,entryPoint:"fs_main",targets:[{format:"rgba8unorm"},{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}});return new M(n,L,r,a,o,m,g,B,f,_,p,u,l,h,c)}setDrawItems(t){this._drawItems=t}updateCamera(t,n,e,r,a,o,m,d){const f=new Float32Array(w/4);f.set(n.data,0),f.set(e.data,16),f.set(r.data,32),f.set(a.data,48),f[64]=o.x,f[65]=o.y,f[66]=o.z,f[67]=m,f[68]=d,t.queue.writeBuffer(this._cameraBuffer,0,f.buffer)}execute(t,n){var a,o,m,d,f,_,p;if(this._drawItems.length===0)return;const{device:e}=n;this._ensurePerDrawBuffers(e,this._drawItems.length);for(let u=0;u<this._drawItems.length;u++){const l=this._drawItems[u],h=this._modelData;h.set(l.modelMatrix.data,0),h.set(l.normalMatrix.data,16),n.queue.writeBuffer(this._modelBuffers[u],0,h.buffer);const c=this._matData;c.set(l.material.albedo,0),c[4]=l.material.roughness,c[5]=l.material.metallic,c[6]=((a=l.material.uvOffset)==null?void 0:a[0])??0,c[7]=((o=l.material.uvOffset)==null?void 0:o[1])??0,c[8]=((m=l.material.uvScale)==null?void 0:m[0])??1,c[9]=((d=l.material.uvScale)==null?void 0:d[1])??1,c[10]=((f=l.material.uvTile)==null?void 0:f[0])??1,c[11]=((_=l.material.uvTile)==null?void 0:_[1])??1,n.queue.writeBuffer(this._materialBuffers[u],0,c.buffer);const g=l.jointMatrices.byteLength;if(this._jointBufferSizes[u]<g||!this._jointBuffers[u]){(p=this._jointBuffers[u])==null||p.destroy();const B=e.createBuffer({label:`SkinnedGeomJointBuffer[${u}]`,size:Math.max(g,64),usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});this._jointBuffers[u]=B,this._jointBufferSizes[u]=g,this._modelJointBindGroups[u]=e.createBindGroup({label:`SkinnedGeomModelJointBG[${u}]`,layout:this._modelJointBGL,entries:[{binding:0,resource:{buffer:this._modelBuffers[u]}},{binding:1,resource:{buffer:B}}]})}n.queue.writeBuffer(this._jointBuffers[u],0,l.jointMatrices.buffer,l.jointMatrices.byteOffset,g)}const r=t.beginRenderPass({label:"SkinnedGeometryPass",colorAttachments:[{view:this._gbuffer.albedoRoughnessView,loadOp:"load",storeOp:"store"},{view:this._gbuffer.normalMetallicView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthLoadOp:"load",depthStoreOp:"store"}});r.setPipeline(this._pipeline),r.setBindGroup(0,this._cameraBindGroup);for(let u=0;u<this._drawItems.length;u++){const l=this._drawItems[u];r.setBindGroup(1,this._modelJointBindGroups[u]),r.setBindGroup(2,this._materialBindGroups[u]),r.setBindGroup(3,this._getOrCreateTextureBG(e,l.material)),r.setVertexBuffer(0,l.mesh.vertexBuffer),r.setIndexBuffer(l.mesh.indexBuffer,"uint32"),r.drawIndexed(l.mesh.indexCount)}r.end()}_getOrCreateTextureBG(t,n){var r,a,o;let e=this._textureBGs.get(n);return e||(e=t.createBindGroup({label:"SkinnedGeomTextureBG",layout:this._textureBGL,entries:[{binding:0,resource:((r=n.albedoMap)==null?void 0:r.view)??this._whiteView},{binding:1,resource:((a=n.normalMap)==null?void 0:a.view)??this._flatNormalView},{binding:2,resource:((o=n.merMap)==null?void 0:o.view)??this._merDefaultView},{binding:3,resource:this._materialSampler}]}),this._textureBGs.set(n,e)),e}_ensurePerDrawBuffers(t,n){for(;this._modelBuffers.length<n;){const e=t.createBuffer({size:X,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._modelBuffers.push(e),this._jointBuffers.push(null),this._jointBufferSizes.push(0),this._modelJointBindGroups.push(null);const r=t.createBuffer({size:J,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._materialBuffers.push(r),this._materialBindGroups.push(t.createBindGroup({layout:this._materialBGL,entries:[{binding:0,resource:{buffer:r}}]}))}}destroy(){this._cameraBuffer.destroy();for(const t of this._modelBuffers)t.destroy();for(const t of this._jointBuffers)t==null||t.destroy();for(const t of this._materialBuffers)t.destroy();this._whiteTex.destroy(),this._flatNormalTex.destroy(),this._merDefaultTex.destroy()}}const Y=`// Unlit pass for debug geometry (e.g. a cone showing the directional light).\r
\r
struct Uniforms {\r
  mvp  : mat4x4<f32>,\r
  color: vec4<f32>,\r
}\r
\r
@group(0) @binding(0) var<uniform> u: Uniforms;\r
\r
struct VertOut {\r
  @builtin(position) pos: vec4<f32>,\r
}\r
\r
@vertex\r
fn vs_main(@location(0) position: vec3<f32>) -> VertOut {\r
  var out: VertOut;\r
  out.pos = u.mvp * vec4<f32>(position, 1.0);\r
  return out;\r
}\r
\r
@fragment\r
fn fs_main(in: VertOut) -> @location(0) vec4<f32> {\r
  return u.color;\r
}\r
`,S=80;class V extends G{constructor(t,n,e,r,a){super();i(this,"name","DebugLightPass");i(this,"_pipeline");i(this,"_uniformBuffer");i(this,"_bindGroup");i(this,"_hdrView");i(this,"_depthView");i(this,"_mesh",null);this._pipeline=t,this._uniformBuffer=n,this._bindGroup=e,this._hdrView=r,this._depthView=a}static create(t,n,e){const{device:r}=t,a=r.createBuffer({label:"DebugLightUniform",size:S,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),o=r.createBindGroupLayout({label:"DebugLightBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),m=r.createBindGroup({label:"DebugLightBG",layout:o,entries:[{binding:0,resource:{buffer:a}}]}),d=r.createShaderModule({label:"DebugLightShader",code:Y}),f=r.createRenderPipeline({label:"DebugLightPipeline",layout:r.createPipelineLayout({bindGroupLayouts:[o]}),vertex:{module:d,entryPoint:"vs_main",buffers:[{arrayStride:j,attributes:[F[0]]}]},fragment:{module:d,entryPoint:"fs_main",targets:[{format:U}]},depthStencil:{format:"depth32float",depthWriteEnabled:!1,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}});return new V(f,a,m,n,e)}setMesh(t){this._mesh=t}update(t,n,e,r){const a=n.multiply(e),o=new Float32Array(S/4);o.set(a.data,0),o[16]=r[0],o[17]=r[1],o[18]=r[2],o[19]=r[3],t.queue.writeBuffer(this._uniformBuffer,0,o.buffer)}execute(t,n){if(!this._mesh)return;const e=t.beginRenderPass({label:"DebugLightPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._depthView,depthReadOnly:!0}});e.setPipeline(this._pipeline),e.setBindGroup(0,this._bindGroup),e.setVertexBuffer(0,this._mesh.vertexBuffer),e.setIndexBuffer(this._mesh.indexBuffer,"uint32"),e.drawIndexed(this._mesh.indexCount),e.end()}destroy(){this._uniformBuffer.destroy()}}export{V as D,H as R,M as S,P as a,T as b};
