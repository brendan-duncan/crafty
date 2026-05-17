var L=Object.defineProperty;var V=(k,h,e)=>h in k?L(k,h,{enumerable:!0,configurable:!0,writable:!0,value:e}):k[h]=e;var i=(k,h,e)=>V(k,typeof h!="symbol"?h+"":h,e);import{P as M}from"./mesh-B_UY4euz.js";import{B as R,b as q,f as z}from"./block_type-DoJ9WTh9.js";const D=`// GBuffer fill pass for voxel chunk geometry.
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
`,G=64*4+16+16,I=16,y=256,W=2048,Y=5,B=Y*4,S=16,T="rgba8unorm",U="rgba16float",w="depth32float";class O extends M{constructor(e,t,n,r,u,a,c,l,s){super();i(this,"name","BlockGeometryPass");i(this,"drawCalls",0);i(this,"triangles",0);i(this,"_device");i(this,"_opaquePipeline");i(this,"_transparentPipeline");i(this,"_propPipeline");i(this,"_cameraBuffer");i(this,"_cameraBindGroup");i(this,"_sharedBindGroup");i(this,"_chunkUniformBuffer");i(this,"_chunkBindGroup");i(this,"_slotFreeList",[]);i(this,"_slotHighWater",0);i(this,"_chunks",new Map);i(this,"_frustumPlanes",new Float32Array(24));i(this,"_cameraData",new Float32Array(G/4));i(this,"_chunkUniformAB",new ArrayBuffer(32));i(this,"_chunkUniformF",new Float32Array(this._chunkUniformAB));i(this,"_chunkUniformU",new Uint32Array(this._chunkUniformAB));i(this,"_debugChunks",!1);this._device=e,this._opaquePipeline=t,this._transparentPipeline=n,this._propPipeline=r,this._cameraBuffer=u,this._cameraBindGroup=a,this._sharedBindGroup=c,this._chunkUniformBuffer=l,this._chunkBindGroup=s}static create(e,t){const{device:n}=e,r=n.createBindGroupLayout({label:"ChunkCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),u=n.createBindGroupLayout({label:"ChunkSharedBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),a=n.createBindGroupLayout({label:"ChunkOffsetBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform",hasDynamicOffset:!0,minBindingSize:32}}]}),c=R.MAX,l=n.createBuffer({label:"BlockDataBuffer",size:Math.max(c*I,16),usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),s=z,d=new Uint32Array(c*4);for(let C=0;C<c;C++){const g=q[C];g&&(d[C*4+0]=g.sideFace.y*s+g.sideFace.x,d[C*4+1]=g.bottomFace.y*s+g.bottomFace.x,d[C*4+2]=g.topFace.y*s+g.topFace.x)}n.queue.writeBuffer(l,0,d);const v=n.createSampler({label:"ChunkAtlasSampler",magFilter:"nearest",minFilter:"nearest",addressModeU:"repeat",addressModeV:"repeat"}),p=n.createBindGroup({label:"ChunkSharedBG",layout:u,entries:[{binding:0,resource:t.colorAtlas.view},{binding:1,resource:t.normalAtlas.view},{binding:2,resource:t.merAtlas.view},{binding:3,resource:v},{binding:4,resource:{buffer:l}}]}),P=n.createBuffer({label:"ChunkCameraBuffer",size:G,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),f=n.createBindGroup({label:"ChunkCameraBG",layout:r,entries:[{binding:0,resource:{buffer:P}}]}),_=e.createShaderModule(D,"ChunkGeometryShader"),b=n.createPipelineLayout({bindGroupLayouts:[r,u,a]}),m={arrayStride:B,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32"},{shaderLocation:2,offset:16,format:"float32"}]},o=[{format:T},{format:U}],A=n.createRenderPipeline({label:"ChunkOpaquePipeline",layout:b,vertex:{module:_,entryPoint:"vs_main",buffers:[m]},fragment:{module:_,entryPoint:"fs_opaque",targets:o},depthStencil:{format:w,depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),F=n.createRenderPipeline({label:"ChunkTransparentPipeline",layout:b,vertex:{module:_,entryPoint:"vs_main",buffers:[m]},fragment:{module:_,entryPoint:"fs_transparent",targets:o},depthStencil:{format:w,depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),N=n.createRenderPipeline({label:"ChunkPropPipeline",layout:b,vertex:{module:_,entryPoint:"vs_prop",buffers:[m]},fragment:{module:_,entryPoint:"fs_prop",targets:o},depthStencil:{format:w,depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}}),x=n.createBuffer({label:"ChunkUniformBuffer",size:W*y,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),E=n.createBindGroup({label:"ChunkOffsetBG",layout:a,entries:[{binding:0,resource:{buffer:x,size:32}}]});return new O(n,A,F,N,P,f,p,x,E)}addChunk(e,t){const n=this._chunks.get(e);n?this._replaceMeshBuffers(n,t):this._chunks.set(e,this._createChunkGpu(e,t))}updateChunk(e,t){this.addChunk(e,t)}removeChunk(e){var n,r,u;const t=this._chunks.get(e);t&&((n=t.opaqueBuffer)==null||n.destroy(),(r=t.transparentBuffer)==null||r.destroy(),(u=t.propBuffer)==null||u.destroy(),this._freeSlot(t.slot),this._chunks.delete(e))}updateCamera(e){const t=e.activeCamera;if(!t)throw new Error("BlockGeometryPass.updateCamera: ctx.activeCamera is null");const n=t.position(),r=this._cameraData;r.set(t.viewMatrix().data,0),r.set(t.projectionMatrix().data,16),r.set(t.jitteredViewProjectionMatrix().data,32),r.set(t.inverseViewProjectionMatrix().data,48),r[64]=n.x,r[65]=n.y,r[66]=n.z,r[67]=t.near,r[68]=t.far,e.queue.writeBuffer(this._cameraBuffer,0,r.buffer),this._extractFrustumPlanes(t.viewProjectionMatrix().data)}_extractFrustumPlanes(e){const t=this._frustumPlanes;t[0]=e[3]+e[0],t[1]=e[7]+e[4],t[2]=e[11]+e[8],t[3]=e[15]+e[12],t[4]=e[3]-e[0],t[5]=e[7]-e[4],t[6]=e[11]-e[8],t[7]=e[15]-e[12],t[8]=e[3]+e[1],t[9]=e[7]+e[5],t[10]=e[11]+e[9],t[11]=e[15]+e[13],t[12]=e[3]-e[1],t[13]=e[7]-e[5],t[14]=e[11]-e[9],t[15]=e[15]-e[13],t[16]=e[2],t[17]=e[6],t[18]=e[10],t[19]=e[14],t[20]=e[3]-e[2],t[21]=e[7]-e[6],t[22]=e[11]-e[10],t[23]=e[15]-e[14]}setDebugChunks(e){if(this._debugChunks!==e){this._debugChunks=e;for(const[,t]of this._chunks)this._writeChunkUniforms(t.slot,t.ox,t.oy,t.oz)}}_isVisible(e,t,n){const r=this._frustumPlanes,u=e+S,a=t+S,c=n+S;for(let l=0;l<6;l++){const s=r[l*4],d=r[l*4+1],v=r[l*4+2],p=r[l*4+3];if(s*(s>=0?u:e)+d*(d>=0?a:t)+v*(v>=0?c:n)+p<0)return!1}return!0}addToGraph(e,t={}){const{ctx:n}=e,r=p=>({format:p,width:n.width,height:n.height});let u,a,c;t.gbuffer?(u=t.gbuffer.albedo,a=t.gbuffer.normal,c=t.gbuffer.depth):(u=void 0,a=void 0,c=void 0);let l,s,d;const v=t.loadOp??(t.gbuffer?"load":"clear");return e.addPass(this.name,"render",p=>{t.gbuffer||(u=p.createTexture({label:"gbuffer.albedo",...r(T)}),a=p.createTexture({label:"gbuffer.normal",...r(U)}),c=p.createTexture({label:"gbuffer.depth",...r(w)})),l=p.write(u,"attachment",{loadOp:v,storeOp:"store",clearValue:[0,0,0,1]}),s=p.write(a,"attachment",{loadOp:v,storeOp:"store",clearValue:[.5,.5,1,1]}),d=p.write(c,"depth-attachment",{depthLoadOp:v,depthStoreOp:"store",depthClearValue:1}),p.setExecute(P=>{const f=P.renderPassEncoder;f.setBindGroup(0,this._cameraBindGroup),f.setBindGroup(1,this._sharedBindGroup);let _=0,b=0;const m=[];for(const o of this._chunks.values())this._isVisible(o.ox,o.oy,o.oz)&&m.push(o);f.setPipeline(this._opaquePipeline);for(const o of m)o.opaqueBuffer&&o.opaqueCount>0&&(f.setBindGroup(2,this._chunkBindGroup,[o.slot*y]),f.setVertexBuffer(0,o.opaqueBuffer),f.draw(o.opaqueCount),_++,b+=o.opaqueCount/3);f.setPipeline(this._transparentPipeline);for(const o of m)o.transparentBuffer&&o.transparentCount>0&&(f.setBindGroup(2,this._chunkBindGroup,[o.slot*y]),f.setVertexBuffer(0,o.transparentBuffer),f.draw(o.transparentCount),_++,b+=o.transparentCount/3);f.setPipeline(this._propPipeline);for(const o of m)o.propBuffer&&o.propCount>0&&(f.setBindGroup(2,this._chunkBindGroup,[o.slot*y]),f.setVertexBuffer(0,o.propBuffer),f.draw(o.propCount),_++,b+=o.propCount/3);this.drawCalls=_,this.triangles=b})}),{albedo:l,normal:s,depth:d}}destroy(){var e,t,n;this._cameraBuffer.destroy(),this._chunkUniformBuffer.destroy();for(const r of this._chunks.values())(e=r.opaqueBuffer)==null||e.destroy(),(t=r.transparentBuffer)==null||t.destroy(),(n=r.propBuffer)==null||n.destroy();this._chunks.clear()}_allocSlot(){return this._slotFreeList.length>0?this._slotFreeList.pop():this._slotHighWater++}_freeSlot(e){this._slotFreeList.push(e)}_writeChunkUniforms(e,t,n,r){const u=t*73856093^n*19349663^r*83492791,a=(u&255)/255*.6+.4,c=(u>>8&255)/255*.6+.4,l=(u>>16&255)/255*.6+.4,s=this._chunkUniformF,d=this._chunkUniformU;s[0]=t,s[1]=n,s[2]=r,d[3]=this._debugChunks?1:0,s[4]=a,s[5]=c,s[6]=l,s[7]=0,this._device.queue.writeBuffer(this._chunkUniformBuffer,e*y,this._chunkUniformAB)}_createChunkGpu(e,t){const n=this._allocSlot();this._writeChunkUniforms(n,e.globalPosition.x,e.globalPosition.y,e.globalPosition.z);const r={ox:e.globalPosition.x,oy:e.globalPosition.y,oz:e.globalPosition.z,slot:n,opaqueBuffer:null,opaqueCount:0,transparentBuffer:null,transparentCount:0,propBuffer:null,propCount:0};return this._replaceMeshBuffers(r,t),r}_replaceMeshBuffers(e,t){var n,r,u;if((n=e.opaqueBuffer)==null||n.destroy(),(r=e.transparentBuffer)==null||r.destroy(),(u=e.propBuffer)==null||u.destroy(),e.opaqueBuffer=null,e.transparentBuffer=null,e.propBuffer=null,e.opaqueCount=t.opaqueCount,e.transparentCount=t.transparentCount,e.propCount=t.propCount,t.opaqueCount>0){const a=this._device.createBuffer({label:"ChunkOpaqueBuf",size:t.opaqueCount*B,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.opaque.buffer,0,t.opaqueCount*B),e.opaqueBuffer=a}if(t.transparentCount>0){const a=this._device.createBuffer({label:"ChunkTransparentBuf",size:t.transparentCount*B,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.transparent.buffer,0,t.transparentCount*B),e.transparentBuffer=a}if(t.propCount>0){const a=this._device.createBuffer({label:"ChunkPropBuf",size:t.propCount*B,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.prop.buffer,0,t.propCount*B),e.propBuffer=a}}}export{O as B,w as G,T as a,U as b};
