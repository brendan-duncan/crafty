var V=Object.defineProperty;var I=(w,v,t)=>v in w?V(w,v,{enumerable:!0,configurable:!0,writable:!0,value:t}):w[v]=t;var o=(w,v,t)=>I(w,typeof v!="symbol"?v+"":v,t);import{P as E,e as q,f as D}from"./mesh-BJGbBOtt.js";import{a as z}from"./material-xWpU3U9R.js";import{B as X,d as Y,h as W}from"./block_type-Tvo_l-6G.js";const j=`// GBuffer fill pass for voxel chunk geometry.
// Vertex layout: position(vec3f) + face(f32, 0-5) + blockType(f32).
// Writes albedo+roughness and normal+emission (same encoding as geometry.wgsl).

struct CameraUniforms {
  view       : mat4x4<f32>,
  proj       : mat4x4<f32>,
  viewProj   : mat4x4<f32>,
  invViewProj: mat4x4<f32>,
  position   : vec3<f32>,
  near       : f32,
  far        : f32,
}

struct ChunkUniforms {
  offset    : vec3<f32>,
  debugMode : u32,       // 0 = normal, 1 = debug chunks with color
  debugColor: vec3<f32>,
  _pad      : f32,
}

struct BlockData {
  sideTile  : u32,
  bottomTile: u32,
  topTile   : u32,
  _pad      : u32,
}

@group(0) @binding(0) var<uniform>       camera      : CameraUniforms;
@group(1) @binding(0) var                color_atlas : texture_2d<f32>;
@group(1) @binding(1) var                normal_atlas: texture_2d<f32>;
@group(1) @binding(2) var                mer_atlas   : texture_2d<f32>;
@group(1) @binding(3) var                atlas_samp  : sampler;
@group(1) @binding(4) var<storage, read> block_data  : array<BlockData>;
@group(2) @binding(0) var<uniform>       chunk       : ChunkUniforms;

const ATLAS_COLS: u32 = 25u;
const INV_COLS  : f32 = 1.0 / 25.0;
const INV_ROWS  : f32 = 1.0 / 25.0;

// World-space face normals, indexed by face id (0=back/-Z … 5=top/+Y)
const FACE_NORMALS = array<vec3<f32>, 6>(
  vec3<f32>( 0,  0, -1),  // 0 back  -Z
  vec3<f32>( 0,  0,  1),  // 1 front +Z
  vec3<f32>(-1,  0,  0),  // 2 left  -X
  vec3<f32>( 1,  0,  0),  // 3 right +X
  vec3<f32>( 0, -1,  0),  // 4 bottom-Y
  vec3<f32>( 0,  1,  0),  // 5 top   +Y
);

// Tangent xyz + bitangent handedness w for each face.
// B = cross(N, T) * w  →  TBN maps tangent-space normals to world space.
const FACE_TANGENTS = array<vec4<f32>, 6>(
  vec4<f32>( 1,  0,  0, 1),  // back
  vec4<f32>( 1,  0,  0, 1),  // front
  vec4<f32>( 0,  0,  1, 1),  // left
  vec4<f32>( 0,  0, -1, 1),  // right
  vec4<f32>( 1,  0,  0, 1),  // bottom
  vec4<f32>( 1,  0,  0, 1),  // top
);

struct VertexInput {
  @location(0) position  : vec3<f32>,
  @location(1) face      : f32,
  @location(2) block_type: f32,
}

struct VertexOutput {
  @builtin(position)              clip_pos  : vec4<f32>,
  @location(0)                    world_pos : vec3<f32>,
  @location(1)                    world_norm: vec3<f32>,
  @location(2)                    world_tan : vec4<f32>,
  @location(3) @interpolate(flat) face_f    : f32,
  @location(4) @interpolate(flat) block_f   : f32,
}

@vertex
fn vs_main(vin: VertexInput) -> VertexOutput {
  let wp   = vin.position + chunk.offset;
  let face = u32(vin.face);
  var out: VertexOutput;
  out.clip_pos   = camera.viewProj * vec4<f32>(wp, 1.0);
  out.world_pos  = wp;
  out.world_norm = FACE_NORMALS[face];
  out.world_tan  = FACE_TANGENTS[face];
  out.face_f     = vin.face;
  out.block_f    = vin.block_type;
  return out;
}

struct FragOutput {
  @location(0) albedo_roughness: vec4<f32>,
  @location(1) normal_emission : vec4<f32>,
}

fn atlas_uv(world_pos: vec3<f32>, face: u32, block_type: u32) -> vec2<f32> {
  let bd = block_data[block_type];
  var tile: u32;
  if face == 4u      { tile = bd.bottomTile; }
  else if face == 5u { tile = bd.topTile; }
  else               { tile = bd.sideTile; }

  var local_uv: vec2<f32>;
  if face == 2u || face == 3u {
    local_uv = vec2<f32>(fract(world_pos.z), 1.0 - fract(world_pos.y));
  } else if face == 4u || face == 5u {
    local_uv = fract(world_pos.xz);
  } else {
    local_uv = vec2<f32>(fract(world_pos.x), 1.0 - fract(world_pos.y));
  }

  let tileX = f32(tile % ATLAS_COLS);
  let tileY = f32(tile / ATLAS_COLS);
  return (vec2<f32>(tileX, tileY) + local_uv) * vec2<f32>(INV_COLS, INV_ROWS);
}

fn shade(in: VertexOutput, uv: vec2<f32>) -> FragOutput {
  // Debug mode: use solid chunk color
  if (chunk.debugMode != 0u) {
    let N = normalize(in.world_norm);
    var out: FragOutput;
    out.albedo_roughness = vec4<f32>(chunk.debugColor, 0.8);
    out.normal_emission  = vec4<f32>(N * 0.5 + 0.5, 0.0);
    return out;
  }

  let albedo_samp = textureSample(color_atlas,  atlas_samp, uv);
  let mer         = textureSample(mer_atlas,     atlas_samp, uv);
  let n_ts        = textureSample(normal_atlas,  atlas_samp, uv).rgb * 2.0 - 1.0;

  let N       = normalize(in.world_norm);
  let T       = normalize(in.world_tan.xyz);
  let T_ortho = normalize(T - N * dot(T, N));
  let B       = cross(N, T_ortho) * in.world_tan.w;
  let tbn     = mat3x3<f32>(T_ortho, B, N);
  let mapped_N = normalize(tbn * n_ts);

  // Darken snow blocks for HDR displays (BlockType.SNOW = 17, GRASS_SNOW = 18, SNOWYLEAVES = 23)
  let block_type = u32(in.block_f);
  var albedo_scale = 1.0;
  if (block_type == 17u || block_type == 18u || block_type == 23u) {
    albedo_scale = 0.70;
  }

  var out: FragOutput;
  out.albedo_roughness = vec4<f32>(albedo_samp.rgb * albedo_scale, mer.b);
  out.normal_emission  = vec4<f32>(mapped_N * 0.5 + 0.5, mer.g);
  return out;
}

@fragment
fn fs_opaque(in: VertexOutput) -> FragOutput {
  let uv = atlas_uv(in.world_pos, u32(in.face_f), u32(in.block_f));
  if textureSample(color_atlas, atlas_samp, uv).a < 0.5 { discard; }
  return shade(in, uv);
}

@fragment
fn fs_transparent(in: VertexOutput) -> FragOutput {
  let uv = atlas_uv(in.world_pos, u32(in.face_f), u32(in.block_f));
  if textureSample(color_atlas, atlas_samp, uv).a < 0.5 { discard; }
  return shade(in, uv);
}

// ---- Prop billboard -------------------------------------------------------

struct PropVertexOutput {
  @builtin(position)              clip_pos : vec4<f32>,
  @location(0)                    world_pos: vec3<f32>,
  @location(1)                    uv       : vec2<f32>,
  @location(2) @interpolate(flat) block_f  : f32,
  @location(3)                    face_norm: vec3<f32>,
}

fn billboard_offset(vid: u32) -> vec2<f32> {
  switch vid % 6u {
    case 0u: { return vec2<f32>(-0.5, -0.5); }
    case 1u: { return vec2<f32>( 0.5, -0.5); }
    case 2u: { return vec2<f32>(-0.5,  0.5); }
    case 3u: { return vec2<f32>( 0.5, -0.5); }
    case 4u: { return vec2<f32>( 0.5,  0.5); }
    default: { return vec2<f32>(-0.5,  0.5); }
  }
}

fn billboard_uv(vid: u32) -> vec2<f32> {
  switch vid % 6u {
    case 0u: { return vec2<f32>(0.0, 1.0); }
    case 1u: { return vec2<f32>(1.0, 1.0); }
    case 2u: { return vec2<f32>(0.0, 0.0); }
    case 3u: { return vec2<f32>(1.0, 1.0); }
    case 4u: { return vec2<f32>(1.0, 0.0); }
    default: { return vec2<f32>(0.0, 0.0); }
  }
}

@vertex
fn vs_prop(vin: VertexInput, @builtin(vertex_index) vid: u32) -> PropVertexOutput {
  let center = vin.position + chunk.offset;

  // Camera right and up from the view matrix rows (column-major storage).
  let cam_right = vec3<f32>(camera.view[0].x, camera.view[1].x, camera.view[2].x);
  let cam_up    = vec3<f32>(camera.view[0].y, camera.view[1].y, camera.view[2].y);

  let off = billboard_offset(vid);
  let wp  = center + cam_right * off.x + cam_up * off.y;

  var out: PropVertexOutput;
  out.clip_pos  = camera.viewProj * vec4<f32>(wp, 1.0);
  out.world_pos = wp;
  out.uv        = billboard_uv(vid);
  out.block_f   = vin.block_type;
  out.face_norm = normalize(camera.position - center);
  return out;
}

@fragment
fn fs_prop(in: PropVertexOutput) -> FragOutput {
  let tile  = block_data[u32(in.block_f)].sideTile;
  let tileX = f32(tile % ATLAS_COLS);
  let tileY = f32(tile / ATLAS_COLS);
  let uv    = (vec2<f32>(tileX, tileY) + in.uv) * vec2<f32>(INV_COLS, INV_ROWS);

  let albedo_samp = textureSample(color_atlas, atlas_samp, uv);
  if albedo_samp.a < 0.5 { discard; }

  let mer = textureSample(mer_atlas, atlas_samp, uv);
  let N   = normalize(in.face_norm);

  var out: FragOutput;
  out.albedo_roughness = vec4<f32>(albedo_samp.rgb, mer.b);
  out.normal_emission  = vec4<f32>(N * 0.5 + 0.5, mer.g);
  return out;
}
`,O=64*4+16+16,H=16,S=256,Z=2048,K=5,y=K*4,T=16,k="rgba8unorm",x="rgba16float",G="depth32float";class M extends E{constructor(t,e,n,r,i,s,d,c,f){super();o(this,"name","BlockGeometryPass");o(this,"drawCalls",0);o(this,"triangles",0);o(this,"_device");o(this,"_opaquePipeline");o(this,"_transparentPipeline");o(this,"_propPipeline");o(this,"_cameraBuffer");o(this,"_cameraBindGroup");o(this,"_sharedBindGroup");o(this,"_chunkUniformBuffer");o(this,"_chunkBindGroup");o(this,"_slotFreeList",[]);o(this,"_slotHighWater",0);o(this,"_chunks",new Map);o(this,"_frustumPlanes",new Float32Array(24));o(this,"_cameraData",new Float32Array(O/4));o(this,"_chunkUniformAB",new ArrayBuffer(32));o(this,"_chunkUniformF",new Float32Array(this._chunkUniformAB));o(this,"_chunkUniformU",new Uint32Array(this._chunkUniformAB));o(this,"_debugChunks",!1);this._device=t,this._opaquePipeline=e,this._transparentPipeline=n,this._propPipeline=r,this._cameraBuffer=i,this._cameraBindGroup=s,this._sharedBindGroup=d,this._chunkUniformBuffer=c,this._chunkBindGroup=f}static create(t,e){const{device:n}=t,r=n.createBindGroupLayout({label:"ChunkCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),i=n.createBindGroupLayout({label:"ChunkSharedBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),s=n.createBindGroupLayout({label:"ChunkOffsetBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform",hasDynamicOffset:!0,minBindingSize:32}}]}),d=X.MAX,c=n.createBuffer({label:"BlockDataBuffer",size:Math.max(d*H,16),usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),f=W,_=new Uint32Array(d*4);for(let C=0;C<d;C++){const B=Y[C];B&&(_[C*4+0]=B.sideFace.y*f+B.sideFace.x,_[C*4+1]=B.bottomFace.y*f+B.bottomFace.x,_[C*4+2]=B.topFace.y*f+B.topFace.x)}n.queue.writeBuffer(c,0,_);const m=n.createSampler({label:"ChunkAtlasSampler",magFilter:"nearest",minFilter:"nearest",addressModeU:"repeat",addressModeV:"repeat"}),l=n.createBindGroup({label:"ChunkSharedBG",layout:i,entries:[{binding:0,resource:e.colorAtlas.view},{binding:1,resource:e.normalAtlas.view},{binding:2,resource:e.merAtlas.view},{binding:3,resource:m},{binding:4,resource:{buffer:c}}]}),P=n.createBuffer({label:"ChunkCameraBuffer",size:O,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),u=n.createBindGroup({label:"ChunkCameraBG",layout:r,entries:[{binding:0,resource:{buffer:P}}]}),h=t.createShaderModule(j,"ChunkGeometryShader"),b=n.createPipelineLayout({bindGroupLayouts:[r,i,s]}),p={arrayStride:y,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32"},{shaderLocation:2,offset:16,format:"float32"}]},a=[{format:k},{format:x}],g=n.createRenderPipeline({label:"ChunkOpaquePipeline",layout:b,vertex:{module:h,entryPoint:"vs_main",buffers:[p]},fragment:{module:h,entryPoint:"fs_opaque",targets:a},depthStencil:{format:G,depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),L=n.createRenderPipeline({label:"ChunkTransparentPipeline",layout:b,vertex:{module:h,entryPoint:"vs_main",buffers:[p]},fragment:{module:h,entryPoint:"fs_transparent",targets:a},depthStencil:{format:G,depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),N=n.createRenderPipeline({label:"ChunkPropPipeline",layout:b,vertex:{module:h,entryPoint:"vs_prop",buffers:[p]},fragment:{module:h,entryPoint:"fs_prop",targets:a},depthStencil:{format:G,depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}}),U=n.createBuffer({label:"ChunkUniformBuffer",size:Z*S,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),R=n.createBindGroup({label:"ChunkOffsetBG",layout:s,entries:[{binding:0,resource:{buffer:U,size:32}}]});return new M(n,g,L,N,P,u,l,U,R)}addChunk(t,e){const n=this._chunks.get(t);n?this._replaceMeshBuffers(n,e):this._chunks.set(t,this._createChunkGpu(t,e))}updateChunk(t,e){this.addChunk(t,e)}removeChunk(t){var n,r,i;const e=this._chunks.get(t);e&&((n=e.opaqueBuffer)==null||n.destroy(),(r=e.transparentBuffer)==null||r.destroy(),(i=e.propBuffer)==null||i.destroy(),this._freeSlot(e.slot),this._chunks.delete(t))}updateCamera(t){const e=t.activeCamera;if(!e)throw new Error("BlockGeometryPass.updateCamera: ctx.activeCamera is null");const n=e.position(),r=this._cameraData;r.set(e.viewMatrix().data,0),r.set(e.projectionMatrix().data,16),r.set(e.jitteredViewProjectionMatrix().data,32),r.set(e.inverseViewProjectionMatrix().data,48),r[64]=n.x,r[65]=n.y,r[66]=n.z,r[67]=e.near,r[68]=e.far,t.queue.writeBuffer(this._cameraBuffer,0,r.buffer),this._extractFrustumPlanes(e.viewProjectionMatrix().data)}_extractFrustumPlanes(t){const e=this._frustumPlanes;e[0]=t[3]+t[0],e[1]=t[7]+t[4],e[2]=t[11]+t[8],e[3]=t[15]+t[12],e[4]=t[3]-t[0],e[5]=t[7]-t[4],e[6]=t[11]-t[8],e[7]=t[15]-t[12],e[8]=t[3]+t[1],e[9]=t[7]+t[5],e[10]=t[11]+t[9],e[11]=t[15]+t[13],e[12]=t[3]-t[1],e[13]=t[7]-t[5],e[14]=t[11]-t[9],e[15]=t[15]-t[13],e[16]=t[2],e[17]=t[6],e[18]=t[10],e[19]=t[14],e[20]=t[3]-t[2],e[21]=t[7]-t[6],e[22]=t[11]-t[10],e[23]=t[15]-t[14]}setDebugChunks(t){if(this._debugChunks!==t){this._debugChunks=t;for(const[,e]of this._chunks)this._writeChunkUniforms(e.slot,e.ox,e.oy,e.oz)}}_isVisible(t,e,n){const r=this._frustumPlanes,i=t+T,s=e+T,d=n+T;for(let c=0;c<6;c++){const f=r[c*4],_=r[c*4+1],m=r[c*4+2],l=r[c*4+3];if(f*(f>=0?i:t)+_*(_>=0?s:e)+m*(m>=0?d:n)+l<0)return!1}return!0}addToGraph(t,e={}){const{ctx:n}=t,r=l=>({format:l,width:n.width,height:n.height});let i,s,d;e.gbuffer?(i=e.gbuffer.albedo,s=e.gbuffer.normal,d=e.gbuffer.depth):(i=void 0,s=void 0,d=void 0);let c,f,_;const m=e.loadOp??(e.gbuffer?"load":"clear");return t.addPass(this.name,"render",l=>{e.gbuffer||(i=l.createTexture({label:"gbuffer.albedo",...r(k)}),s=l.createTexture({label:"gbuffer.normal",...r(x)}),d=l.createTexture({label:"gbuffer.depth",...r(G)})),c=l.write(i,"attachment",{loadOp:m,storeOp:"store",clearValue:[0,0,0,1]}),f=l.write(s,"attachment",{loadOp:m,storeOp:"store",clearValue:[.5,.5,1,1]}),_=l.write(d,"depth-attachment",{depthLoadOp:m,depthStoreOp:"store",depthClearValue:1}),l.setExecute(P=>{const u=P.renderPassEncoder;u.setBindGroup(0,this._cameraBindGroup),u.setBindGroup(1,this._sharedBindGroup);let h=0,b=0;const p=[];for(const a of this._chunks.values())this._isVisible(a.ox,a.oy,a.oz)&&p.push(a);u.setPipeline(this._opaquePipeline);for(const a of p)a.opaqueBuffer&&a.opaqueCount>0&&(u.setBindGroup(2,this._chunkBindGroup,[a.slot*S]),u.setVertexBuffer(0,a.opaqueBuffer),u.draw(a.opaqueCount),h++,b+=a.opaqueCount/3);u.setPipeline(this._transparentPipeline);for(const a of p)a.transparentBuffer&&a.transparentCount>0&&(u.setBindGroup(2,this._chunkBindGroup,[a.slot*S]),u.setVertexBuffer(0,a.transparentBuffer),u.draw(a.transparentCount),h++,b+=a.transparentCount/3);u.setPipeline(this._propPipeline);for(const a of p)a.propBuffer&&a.propCount>0&&(u.setBindGroup(2,this._chunkBindGroup,[a.slot*S]),u.setVertexBuffer(0,a.propBuffer),u.draw(a.propCount),h++,b+=a.propCount/3);this.drawCalls=h,this.triangles=b})}),{albedo:c,normal:f,depth:_}}destroy(){var t,e,n;this._cameraBuffer.destroy(),this._chunkUniformBuffer.destroy();for(const r of this._chunks.values())(t=r.opaqueBuffer)==null||t.destroy(),(e=r.transparentBuffer)==null||e.destroy(),(n=r.propBuffer)==null||n.destroy();this._chunks.clear()}_allocSlot(){return this._slotFreeList.length>0?this._slotFreeList.pop():this._slotHighWater++}_freeSlot(t){this._slotFreeList.push(t)}_writeChunkUniforms(t,e,n,r){const i=e*73856093^n*19349663^r*83492791,s=(i&255)/255*.6+.4,d=(i>>8&255)/255*.6+.4,c=(i>>16&255)/255*.6+.4,f=this._chunkUniformF,_=this._chunkUniformU;f[0]=e,f[1]=n,f[2]=r,_[3]=this._debugChunks?1:0,f[4]=s,f[5]=d,f[6]=c,f[7]=0,this._device.queue.writeBuffer(this._chunkUniformBuffer,t*S,this._chunkUniformAB)}_createChunkGpu(t,e){const n=this._allocSlot();this._writeChunkUniforms(n,t.globalPosition.x,t.globalPosition.y,t.globalPosition.z);const r={ox:t.globalPosition.x,oy:t.globalPosition.y,oz:t.globalPosition.z,slot:n,opaqueBuffer:null,opaqueCount:0,transparentBuffer:null,transparentCount:0,propBuffer:null,propCount:0};return this._replaceMeshBuffers(r,e),r}_replaceMeshBuffers(t,e){var n,r,i;if((n=t.opaqueBuffer)==null||n.destroy(),(r=t.transparentBuffer)==null||r.destroy(),(i=t.propBuffer)==null||i.destroy(),t.opaqueBuffer=null,t.transparentBuffer=null,t.propBuffer=null,t.opaqueCount=e.opaqueCount,t.transparentCount=e.transparentCount,t.propCount=e.propCount,e.opaqueCount>0){const s=this._device.createBuffer({label:"ChunkOpaqueBuf",size:e.opaqueCount*y,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(s,0,e.opaque.buffer,0,e.opaqueCount*y),t.opaqueBuffer=s}if(e.transparentCount>0){const s=this._device.createBuffer({label:"ChunkTransparentBuf",size:e.transparentCount*y,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(s,0,e.transparent.buffer,0,e.transparentCount*y),t.transparentBuffer=s}if(e.propCount>0){const s=this._device.createBuffer({label:"ChunkPropBuf",size:e.propCount*y,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(s,0,e.prop.buffer,0,e.propCount*y),t.propBuffer=s}}}const A=64*4+16+16,$=128;class F extends E{constructor(t,e,n,r,i,s){super();o(this,"name","GeometryPass");o(this,"_ctx");o(this,"_device");o(this,"_cameraBgl");o(this,"_modelBgl");o(this,"_pipelineCache",new Map);o(this,"_cameraBuffer");o(this,"_cameraBindGroup");o(this,"_modelBuffers",[]);o(this,"_modelBindGroups",[]);o(this,"_drawItems",[]);o(this,"_modelData",new Float32Array(32));o(this,"_cameraScratch",new Float32Array(A/4));this._ctx=t,this._device=e,this._cameraBgl=n,this._modelBgl=r,this._cameraBuffer=i,this._cameraBindGroup=s}static create(t){const{device:e}=t,n=e.createBindGroupLayout({label:"GeomCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),r=e.createBindGroupLayout({label:"GeomModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),i=e.createBuffer({label:"GeomCameraBuffer",size:A,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),s=e.createBindGroup({label:"GeomCameraBindGroup",layout:n,entries:[{binding:0,resource:{buffer:i}}]});return new F(t,e,n,r,i,s)}setDrawItems(t){this._drawItems=t}updateCamera(t){const e=t.activeCamera;if(!e)throw new Error("GeometryPass.updateCamera: ctx.activeCamera is null");const n=e.position(),r=this._cameraScratch;r.set(e.viewMatrix().data,0),r.set(e.projectionMatrix().data,16),r.set(e.jitteredViewProjectionMatrix().data,32),r.set(e.inverseViewProjectionMatrix().data,48),r[64]=n.x,r[65]=n.y,r[66]=n.z,r[67]=e.near,r[68]=e.far,t.queue.writeBuffer(this._cameraBuffer,0,r.buffer)}addToGraph(t,e={}){const{ctx:n}=t,r=l=>({format:l,width:n.width,height:n.height});let i=e.gbuffer?e.gbuffer.albedo:void 0,s=e.gbuffer?e.gbuffer.normal:void 0,d=e.gbuffer?e.gbuffer.depth:void 0,c,f,_;const m=e.loadOp??(e.gbuffer?"load":"clear");return t.addPass(this.name,"render",l=>{e.gbuffer||(i=l.createTexture({label:"gbuffer.albedo",...r(k)}),s=l.createTexture({label:"gbuffer.normal",...r(x)}),d=l.createTexture({label:"gbuffer.depth",...r(G)})),c=l.write(i,"attachment",{loadOp:m,storeOp:"store",clearValue:[0,0,0,1]}),f=l.write(s,"attachment",{loadOp:m,storeOp:"store",clearValue:[0,0,0,0]}),_=l.write(d,"depth-attachment",{depthLoadOp:m,depthStoreOp:"store",depthClearValue:1}),l.setExecute(P=>{var h,b;this._ensurePerDrawBuffers(this._drawItems.length);for(let p=0;p<this._drawItems.length;p++){const a=this._drawItems[p],g=this._modelData;g.set(a.modelMatrix.data,0),g.set(a.normalMatrix.data,16),this._device.queue.writeBuffer(this._modelBuffers[p],0,g.buffer),(b=(h=a.material).update)==null||b.call(h,this._device.queue)}const u=P.renderPassEncoder;u.setBindGroup(0,this._cameraBindGroup);for(let p=0;p<this._drawItems.length;p++){const a=this._drawItems[p],g="variantMask"in a.material?a.material.variantMask:0;u.setPipeline(this._getPipeline(a.material,g)),u.setBindGroup(1,this._modelBindGroups[p]),u.setBindGroup(2,a.material.getBindGroup(this._device)),u.setVertexBuffer(0,a.mesh.vertexBuffer),u.setIndexBuffer(a.mesh.indexBuffer,"uint32"),u.drawIndexed(a.mesh.indexCount)}})}),{albedo:c,normal:f,depth:_}}_getPipeline(t,e){const n=`${t.shaderId}:${e}`;let r=this._pipelineCache.get(n);if(r)return r;const i={};e&1&&(i.HAS_ALBEDO_MAP="1"),e&2&&(i.HAS_NORMAL_MAP="1"),e&4&&(i.HAS_MER_MAP="1");const s=this._ctx.createShaderModule(t.getShaderCode(z.Geometry,e),`GeometryShader[${n}]`,i);return r=this._device.createRenderPipeline({label:`GeometryPipeline[${n}]`,layout:this._device.createPipelineLayout({bindGroupLayouts:[this._cameraBgl,this._modelBgl,t.getBindGroupLayout(this._device,e)]}),vertex:{module:s,entryPoint:"vs_main",buffers:[{arrayStride:D,attributes:q}]},fragment:{module:s,entryPoint:"fs_main",targets:[{format:k},{format:x}]},depthStencil:{format:G,depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),this._pipelineCache.set(n,r),r}_ensurePerDrawBuffers(t){for(;this._modelBuffers.length<t;){const e=this._device.createBuffer({size:$,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._modelBuffers.push(e),this._modelBindGroups.push(this._device.createBindGroup({layout:this._modelBgl,entries:[{binding:0,resource:{buffer:e}}]}))}}destroy(){this._cameraBuffer.destroy();for(const t of this._modelBuffers)t.destroy()}}export{M as B,F as G,G as a,k as b,x as c};
