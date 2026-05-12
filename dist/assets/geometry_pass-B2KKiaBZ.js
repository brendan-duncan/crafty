var J=Object.defineProperty;var ee=(m,i,e)=>i in m?J(m,i,{enumerable:!0,configurable:!0,writable:!0,value:e}):m[i]=e;var n=(m,i,e)=>ee(m,typeof i!="symbol"?i+"":i,e);import{c as y,Q as te,f as E,a as I,s as ne,V as H,b as j,M as re}from"./shadow-CGnDmh2T.js";class V{constructor(){n(this,"gameObject")}onAttach(){}onDetach(){}update(i){}}class ue{constructor(i="GameObject"){n(this,"name");n(this,"position");n(this,"rotation");n(this,"scale");n(this,"children",[]);n(this,"parent",null);n(this,"_components",[]);this.name=i,this.position=y.zero(),this.rotation=te.identity(),this.scale=y.one()}addComponent(i){return i.gameObject=this,this._components.push(i),i.onAttach(),i}getComponent(i){for(const e of this._components)if(e instanceof i)return e;return null}getComponents(i){return this._components.filter(e=>e instanceof i)}removeComponent(i){const e=this._components.indexOf(i);e!==-1&&(i.onDetach(),this._components.splice(e,1))}addChild(i){i.parent=this,this.children.push(i)}localToWorld(){const i=E.trs(this.position,this.rotation.x,this.rotation.y,this.rotation.z,this.rotation.w,this.scale);return this.parent?this.parent.localToWorld().multiply(i):i}update(i){for(const e of this._components)e.update(i);for(const e of this.children)e.update(i)}}class ae extends V{constructor(e=60,r=.1,t=1e3,a=16/9){super();n(this,"fov");n(this,"near");n(this,"far");n(this,"aspect");this.fov=e*(Math.PI/180),this.near=r,this.far=t,this.aspect=a}projectionMatrix(){return E.perspective(this.fov,this.aspect,this.near,this.far)}viewMatrix(){return this.gameObject.localToWorld().invert()}viewProjectionMatrix(){return this.projectionMatrix().multiply(this.viewMatrix())}position(){const e=this.gameObject.localToWorld();return new y(e.data[12],e.data[13],e.data[14])}frustumCornersWorld(){const e=this.viewProjectionMatrix().invert();return[[-1,-1,0],[1,-1,0],[-1,1,0],[1,1,0],[-1,-1,1],[1,-1,1],[-1,1,1],[1,1,1]].map(([t,a,o])=>e.transformPoint(new y(t,a,o)))}}class se extends V{constructor(e=new y(.3,-1,.5),r=y.one(),t=1,a=3){super();n(this,"direction");n(this,"color");n(this,"intensity");n(this,"numCascades");this.direction=e.normalize(),this.color=r,this.intensity=t,this.numCascades=a}computeCascadeMatrices(e,r){const t=r??e.far,a=this._computeSplitDepths(e.near,t,this.numCascades),o=[];for(let d=0;d<this.numCascades;d++){const s=d===0?e.near:a[d-1],c=a[d],l=this._frustumCornersForSplit(e,s,c),_=l.reduce((x,G)=>x.add(G),y.ZERO).scale(1/8),h=this.direction.normalize(),u=E.lookAt(_.sub(h),_,y.UP),p=2048;let f=0;for(const x of l)f=Math.max(f,x.sub(_).length());let w=2*f/p;f=Math.ceil(f/w)*w,f*=p/(p-2),w=2*f/p;let g=1/0,b=-1/0;for(const x of l){const G=u.transformPoint(x);g=Math.min(g,G.z),b=Math.max(b,G.z)}const S=Math.min((b-g)*.25,64);g-=S,b+=S;let v=E.orthographic(-f,f,-f,f,-b,-g);const R=v.multiply(u).transformPoint(_),B=R.x*.5+.5,M=.5-R.y*.5,L=Math.round(B*p)/p,N=Math.round(M*p)/p,A=(L-B)*2,P=-(N-M)*2;v.set(3,0,v.get(3,0)+A),v.set(3,1,v.get(3,1)+P),o.push({lightViewProj:v.multiply(u),splitFar:c,depthRange:b-g,texelWorldSize:w})}return o}_computeSplitDepths(e,r,t){const o=[];for(let d=1;d<=t;d++){const s=e+(r-e)*(d/t),c=e*Math.pow(r/e,d/t);o.push(.75*c+(1-.75)*s)}return o}_frustumCornersForSplit(e,r,t){const a=e.near,o=e.far;e.near=r,e.far=t;const d=e.frustumCornersWorld();return e.near=a,e.far=o,d}}class ie extends V{constructor(e,r){super();n(this,"mesh");n(this,"material");n(this,"castShadow",!0);this.mesh=e,this.material=r}}class he{constructor(){n(this,"gameObjects",[])}add(i){this.gameObjects.push(i)}remove(i){const e=this.gameObjects.indexOf(i);e!==-1&&this.gameObjects.splice(e,1)}update(i){for(const e of this.gameObjects)e.update(i)}findCamera(){for(const i of this.gameObjects){const e=i.getComponent(ae);if(e)return e}return null}findDirectionalLight(){for(const i of this.gameObjects){const e=i.getComponent(se);if(e)return e}return null}collectMeshRenderers(){const i=[];for(const e of this.gameObjects)this._collectMeshRenderersRecursive(e,i);return i}_collectMeshRenderersRecursive(i,e){const r=i.getComponent(ie);r&&e.push(r);for(const t of i.children)this._collectMeshRenderersRecursive(t,e)}getComponents(i){const e=[];for(const r of this.gameObjects){const t=r.getComponent(i);t&&e.push(t)}return e}}class X{constructor(i,e,r,t,a){n(this,"albedoRoughness");n(this,"normalMetallic");n(this,"depth");n(this,"albedoRoughnessView");n(this,"normalMetallicView");n(this,"depthView");n(this,"width");n(this,"height");this.albedoRoughness=i,this.normalMetallic=e,this.depth=r,this.width=t,this.height=a,this.albedoRoughnessView=i.createView(),this.normalMetallicView=e.createView(),this.depthView=r.createView()}static create(i){const{device:e,width:r,height:t}=i,a=e.createTexture({label:"GBuffer AlbedoRoughness",size:{width:r,height:t},format:"rgba8unorm",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),o=e.createTexture({label:"GBuffer NormalMetallic",size:{width:r,height:t},format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),d=e.createTexture({label:"GBuffer Depth",size:{width:r,height:t},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING});return new X(a,o,d,r,t)}destroy(){this.albedoRoughness.destroy(),this.normalMetallic.destroy(),this.depth.destroy()}}const O=2048,U=4;class W extends I{constructor(e,r,t,a,o,d,s,c){super();n(this,"name","ShadowPass");n(this,"shadowMap");n(this,"shadowMapView");n(this,"shadowMapArrayViews");n(this,"_pipeline");n(this,"_shadowBindGroups");n(this,"_shadowUniformBuffers");n(this,"_modelUniformBuffers",[]);n(this,"_modelBindGroups",[]);n(this,"_cascadeCount");n(this,"_cascades",[]);n(this,"_modelBGL");n(this,"_sceneSnapshot",[]);this.shadowMap=e,this.shadowMapView=r,this.shadowMapArrayViews=t,this._pipeline=a,this._shadowBindGroups=o,this._shadowUniformBuffers=d,this._modelBGL=s,this._cascadeCount=c}static create(e,r=3){const{device:t}=e,a=t.createTexture({label:"ShadowMap",size:{width:O,height:O,depthOrArrayLayers:U},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),o=a.createView({dimension:"2d-array"}),d=Array.from({length:U},(p,f)=>a.createView({dimension:"2d",baseArrayLayer:f,arrayLayerCount:1})),s=t.createBindGroupLayout({label:"ShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),c=t.createBindGroupLayout({label:"ModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),l=[],_=[];for(let p=0;p<U;p++){const f=t.createBuffer({label:`ShadowUniformBuffer ${p}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});l.push(f),_.push(t.createBindGroup({label:`ShadowBindGroup ${p}`,layout:s,entries:[{binding:0,resource:{buffer:f}}]}))}const h=t.createShaderModule({label:"ShadowShader",code:ne}),u=t.createRenderPipeline({label:"ShadowPipeline",layout:t.createPipelineLayout({bindGroupLayouts:[s,c]}),vertex:{module:h,entryPoint:"vs_main",buffers:[{arrayStride:j,attributes:[H[0]]}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less",depthBias:2,depthBiasSlopeScale:2.5,depthBiasClamp:0},primitive:{topology:"triangle-list",cullMode:"back"}});return new W(a,o,d,u,_,l,c,r)}updateScene(e,r,t,a){this._cascades=t.computeCascadeMatrices(r,a),this._cascadeCount=Math.min(this._cascades.length,U)}execute(e,r){const{device:t}=r,a=this._getMeshRenderers(r);this._ensureModelBuffers(t,a.length);for(let o=0;o<this._cascadeCount&&!(o>=this._cascades.length);o++){const d=this._cascades[o];r.queue.writeBuffer(this._shadowUniformBuffers[o],0,d.lightViewProj.data.buffer);const s=e.beginRenderPass({label:`ShadowPass cascade ${o}`,colorAttachments:[],depthStencilAttachment:{view:this.shadowMapArrayViews[o],depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});s.setPipeline(this._pipeline),s.setBindGroup(0,this._shadowBindGroups[o]);for(let c=0;c<a.length;c++){const{mesh:l,modelMatrix:_}=a[c],h=this._modelUniformBuffers[c];r.queue.writeBuffer(h,0,_.data.buffer),s.setBindGroup(1,this._modelBindGroups[c]),s.setVertexBuffer(0,l.vertexBuffer),s.setIndexBuffer(l.indexBuffer,"uint32"),s.drawIndexed(l.indexCount)}s.end()}}_getMeshRenderers(e){return this._sceneSnapshot??[]}setSceneSnapshot(e){this._sceneSnapshot=e}_ensureModelBuffers(e,r){for(;this._modelUniformBuffers.length<r;){const t=e.createBuffer({label:`ModelUniform ${this._modelUniformBuffers.length}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),a=e.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:t}}]});this._modelUniformBuffers.push(t),this._modelBindGroups.push(a)}}destroy(){this.shadowMap.destroy();for(const e of this._shadowUniformBuffers)e.destroy();for(const e of this._modelUniformBuffers)e.destroy()}}const oe=`// Deferred PBR lighting pass — fullscreen triangle, reads GBuffer + shadow maps + IBL.

const PI: f32 = 3.14159265358979323846;

// ---- Aerial perspective (Rayleigh + Mie, same model as atmosphere.wgsl) --------
// Density scale factor: real atmosphere only hazes over km; game view is ~200 m,
// so multiply density by 200 to get visible haze at typical render distances.
const ATM_FOG_SCALE : f32       = 80.0;
const ATM_R_E       : f32       = 6360000.0;
const ATM_R_A       : f32       = 6420000.0;
const ATM_H_R       : f32       = 8500.0;
const ATM_H_M       : f32       = 1200.0;
const ATM_G         : f32       = 0.758;
const ATM_BETA_R    : vec3<f32> = vec3<f32>(5.5e-6, 13.0e-6, 22.4e-6);
const ATM_BETA_M    : f32       = 21.0e-6;
const ATM_SUN_I     : f32       = 20.0;

fn atm_ray_sphere(ro: vec3<f32>, rd: vec3<f32>, r: f32) -> vec2<f32> {
  let b = dot(ro, rd); let c = dot(ro, ro) - r * r; let d = b*b - c;
  if (d < 0.0) { return vec2<f32>(-1.0, -1.0); }
  let sq = sqrt(d);
  return vec2<f32>(-b - sq, -b + sq);
}

fn atm_optical_depth(pos: vec3<f32>, dir: vec3<f32>) -> vec2<f32> {
  let t = atm_ray_sphere(pos, dir, ATM_R_A); let ds = t.y / 4.0;
  var od = vec2<f32>(0.0);
  for (var i = 0; i < 4; i++) {
    let h = length(pos + dir * ((f32(i) + 0.5) * ds)) - ATM_R_E;
    if (h < 0.0) { break; }
    od += vec2<f32>(exp(-h / ATM_H_R), exp(-h / ATM_H_M)) * ds;
  }
  return od;
}

// Simplified scatter for fog color (6 main steps).
fn atm_scatter(ro: vec3<f32>, rd: vec3<f32>, sun_dir: vec3<f32>) -> vec3<f32> {
  let ta = atm_ray_sphere(ro, rd, ATM_R_A); let tMin = max(ta.x, 0.0);
  if (ta.y < 0.0) { return vec3<f32>(0.0); }
  let tg   = atm_ray_sphere(ro, rd, ATM_R_E);
  let tMax = select(ta.y, min(ta.y, tg.x), tg.x > 0.0);
  if (tMax <= tMin) { return vec3<f32>(0.0); }
  let mu = dot(rd, sun_dir);
  let pR = (3.0 / (16.0 * PI)) * (1.0 + mu * mu);
  let g2 = ATM_G * ATM_G;
  let pM = (3.0 / (8.0 * PI)) * ((1.0 - g2) * (1.0 + mu * mu)) /
            ((2.0 + g2) * pow(max(1.0 + g2 - 2.0 * ATM_G * mu, 1e-4), 1.5));
  let ds = (tMax - tMin) / 6.0;
  var sumR = vec3<f32>(0.0); var sumM = vec3<f32>(0.0);
  var odR = 0.0; var odM = 0.0;
  for (var i = 0; i < 6; i++) {
    let pos = ro + rd * (tMin + (f32(i) + 0.5) * ds);
    let h   = length(pos) - ATM_R_E;
    if (h < 0.0) { break; }
    let hrh = exp(-h / ATM_H_R) * ds; let hmh = exp(-h / ATM_H_M) * ds;
    odR += hrh; odM += hmh;
    let tg2 = atm_ray_sphere(pos, sun_dir, ATM_R_E);
    if (tg2.x > 0.0) { continue; }
    let odL = atm_optical_depth(pos, sun_dir);
    let tau = ATM_BETA_R * (odR + odL.x) + ATM_BETA_M * 1.1 * (odM + odL.y);
    sumR += exp(-tau) * hrh; sumM += exp(-tau) * hmh;
  }
  return ATM_SUN_I * (ATM_BETA_R * pR * sumR + vec3<f32>(ATM_BETA_M) * pM * sumM);
}

fn apply_aerial_perspective(geo_color: vec3<f32>, world_pos: vec3<f32>,
                             sun_dir: vec3<f32>, cam_h: f32) -> vec3<f32> {
  let ray_vec  = world_pos - camera.position;
  let dist     = length(ray_vec);
  let ray_dir  = ray_vec / max(dist, 0.001);
  let atm_ro   = vec3<f32>(0.0, ATM_R_E + cam_h, 0.0);

  // Altitude at camera and at the geometry surface.
  let h0 = max(camera.position.y, 0.0);
  let h1 = max(world_pos.y, 0.0);
  let dh = h1 - h0;

  // Analytic integral of exp(-h(t)/H) dt along the ray from t=0 to t=dist:
  //   h(t) = h0 + (dh/dist)*t
  //   integral = (exp(-h0/H) - exp(-h1/H)) * H * dist / dh
  // Horizontal-ray limit (|dh| → 0): exp(-h0/H) * dist
  // This makes fog thicker for low geometry and thinner for high geometry at the same distance.
  var od_R: f32;
  var od_M: f32;
  if (abs(dh) < 0.1) {
    od_R = exp(-h0 / ATM_H_R) * dist;
    od_M = exp(-h0 / ATM_H_M) * dist;
  } else {
    od_R = max((exp(-h0 / ATM_H_R) - exp(-h1 / ATM_H_R)) * ATM_H_R * dist / dh, 0.0);
    od_M = max((exp(-h0 / ATM_H_M) - exp(-h1 / ATM_H_M)) * ATM_H_M * dist / dh, 0.0);
  }

  let tau   = (ATM_BETA_R * od_R + vec3<f32>(ATM_BETA_M * od_M)) * ATM_FOG_SCALE;
  let geo_T = exp(-tau);

  // Sample fog color using only the horizontal component of the ray direction.
  // Using the true ray direction creates a visible line at camera height where
  // the sky-scatter color changes as the downward angle exceeds any clamp value.
  // Projecting to horizontal makes fog color a function of azimuth only (sun angle),
  // matching the sky at the true horizon with no altitude-dependent discontinuity.
  let h2   = vec3<f32>(ray_dir.x, 0.0, ray_dir.z);
  let len2 = dot(h2, h2);
  let fog_dir   = select(normalize(h2), vec3<f32>(1.0, 0.0, 0.0), len2 < 1e-6);
  let fog_color = atm_scatter(atm_ro, fog_dir, sun_dir);

  return geo_color * geo_T + fog_color * (1.0 - geo_T);
}
const SHADOW_MAP_SIZE: f32 = 2048.0;

const POISSON16 = array<vec2<f32>, 16>(
  vec2<f32>(-0.94201624, -0.39906216), vec2<f32>( 0.94558609, -0.76890725),
  vec2<f32>(-0.09418410, -0.92938870), vec2<f32>( 0.34495938,  0.29387760),
  vec2<f32>(-0.91588581,  0.45771432), vec2<f32>(-0.81544232, -0.87912464),
  vec2<f32>(-0.38277543,  0.27676845), vec2<f32>( 0.97484398,  0.75648379),
  vec2<f32>( 0.44323325, -0.97511554), vec2<f32>( 0.53742981, -0.47373420),
  vec2<f32>(-0.26496911, -0.41893023), vec2<f32>( 0.79197514,  0.19090188),
  vec2<f32>(-0.24188840,  0.99706507), vec2<f32>(-0.81409955,  0.91437590),
  vec2<f32>( 0.19984126,  0.78641367), vec2<f32>( 0.14383161, -0.14100790),
);

fn ign(pixel: vec2<f32>) -> f32 {
  return fract(52.9829189 * fract(0.06711056 * pixel.x + 0.00583715 * pixel.y));
}

fn rotate2d(v: vec2<f32>, a: f32) -> vec2<f32> {
  let s = sin(a); let c = cos(a);
  return vec2<f32>(c*v.x - s*v.y, s*v.x + c*v.y);
}

struct CameraUniforms {
  view       : mat4x4<f32>,
  proj       : mat4x4<f32>,
  viewProj   : mat4x4<f32>,
  invViewProj: mat4x4<f32>,
  position   : vec3<f32>,
  near       : f32,
  far        : f32,
}

struct LightUniforms {
  direction         : vec3<f32>,
  intensity         : f32,
  color             : vec3<f32>,
  cascadeCount      : u32,
  cascadeMatrices   : array<mat4x4<f32>, 4>,
  cascadeSplits     : vec4<f32>,
  shadowsEnabled    : u32,
  debugCascades     : u32,
  cloudShadowOrigin : vec2<f32>,  // world-space XZ centre of cloud shadow map
  cloudShadowExtent  : f32,        // half-size in world units (covers ±extent)
  shadowSoftness     : f32,        // PCSS light-size factor (~0.02)
  _pad_light         : vec2<f32>,  // padding to align cascadeDepthRanges to 16 bytes (offset 336)
  cascadeDepthRanges : vec4<f32>,  // light-space Z depth per cascade (for adaptive depth bias)
  cascadeTexelSizes  : vec4<f32>,  // world-space size of one shadow texel per cascade
}

@group(0) @binding(0) var<uniform> camera: CameraUniforms;
@group(0) @binding(1) var<uniform> light : LightUniforms;

@group(1) @binding(0) var albedoRoughnessTex: texture_2d<f32>;
@group(1) @binding(1) var normalMetallicTex : texture_2d<f32>;
@group(1) @binding(2) var depthTex          : texture_depth_2d;
@group(1) @binding(3) var shadowMap         : texture_depth_2d_array;
@group(1) @binding(4) var shadowSampler     : sampler_comparison;
@group(1) @binding(5) var gbufferSampler    : sampler;
@group(1) @binding(6) var cloudShadowTex    : texture_2d<f32>;

// SSAO + SSGI (group 2)
@group(2) @binding(0) var ao_tex   : texture_2d<f32>;
@group(2) @binding(1) var ao_samp  : sampler;
@group(2) @binding(2) var ssgi_tex : texture_2d<f32>;
@group(2) @binding(3) var ssgi_samp: sampler;

// IBL (group 3): pre-baked from the physical sky HDR.
// irradiance_cube: diffuse integral (cosine-weighted hemisphere), 32×32 per face.
// prefilter_cube:  GGX specular pre-filtered, 128×128 base with IBL_MIP_LEVELS mip levels.
// brdf_lut:        split-sum A/B (NdotV × roughness → rg), 64×64.
const IBL_MIP_LEVELS: f32 = 5.0;   // must match IBL_LEVELS in ibl.ts
@group(3) @binding(0) var irradiance_cube: texture_cube<f32>;
@group(3) @binding(1) var prefilter_cube : texture_cube<f32>;
@group(3) @binding(2) var brdf_lut       : texture_2d<f32>;
@group(3) @binding(3) var ibl_samp       : sampler;

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
  @location(0)       uv      : vec2<f32>,
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

fn reconstruct_world_pos(uv: vec2<f32>, depth: f32) -> vec3<f32> {
  let ndc    = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);
  let world_h = camera.invViewProj * ndc;
  return world_h.xyz / world_h.w;
}

// === Shadow ===========================================================

fn pcf_shadow(cascade: u32, sc: vec3<f32>, bias: f32, kernel_radius: f32, screen_pos: vec2<f32>) -> f32 {
  let texel = vec2<f32>(kernel_radius / SHADOW_MAP_SIZE);
  let angle = ign(screen_pos) * 6.28318530;
  var s = 0.0;
  for (var i = 0; i < 16; i++) {
    let offset = rotate2d(POISSON16[i], angle) * texel;
    let uv = clamp(sc.xy + offset, vec2<f32>(0.0), vec2<f32>(1.0));
    s += textureSampleCompareLevel(shadowMap, shadowSampler, uv, i32(cascade), sc.z - bias);
  }
  return s / 16.0;
}

// Returns average blocker depth, or -1.0 if receiver is fully lit.
fn pcss_blocker_search(cascade: u32, sc: vec3<f32>, search_radius: f32, screen_pos: vec2<f32>) -> f32 {
  let texel = vec2<f32>(search_radius / SHADOW_MAP_SIZE);
  let angle = ign(screen_pos) * 6.28318530;
  var total = 0.0;
  var count = 0.0;
  for (var i = 0; i < 8; i++) {
    let offset = rotate2d(POISSON16[i], angle) * texel;
    let uv = clamp(sc.xy + offset, vec2<f32>(0.0), vec2<f32>(1.0));
    let tc = clamp(vec2<i32>(uv * SHADOW_MAP_SIZE),
                   vec2<i32>(0), vec2<i32>(i32(SHADOW_MAP_SIZE) - 1));
    let d = textureLoad(shadowMap, tc, i32(cascade), 0);
    if (d < sc.z) {
      total += d;
      count += 1.0;
    }
  }
  if (count == 0.0) { return -1.0; }
  return total / count;
}

// Returns shadow-space coords for cascade c.  xy in [0,1], z in [0,1] when in-frustum.
fn cascade_coords(c: u32, world_pos: vec3<f32>) -> vec3<f32> {
  let ls = light.cascadeMatrices[c] * vec4<f32>(world_pos, 1.0);
  var sc = ls.xyz / ls.w;
  sc = vec3<f32>(sc.xy * 0.5 + 0.5, sc.z);
  sc.y = 1.0 - sc.y;
  return sc;
}

fn in_cascade(sc: vec3<f32>) -> bool {
  return all(sc.xy >= vec2<f32>(0.0)) && all(sc.xy <= vec2<f32>(1.0))
      && sc.z >= 0.0 && sc.z <= 1.0;
}

fn select_cascade(view_depth: f32) -> u32 {
  for (var i = 0u; i < light.cascadeCount; i++) {
    if (view_depth < light.cascadeSplits[i]) { return i; }
  }
  return light.cascadeCount - 1u;
}

fn shadow_factor(world_pos: vec3<f32>, N: vec3<f32>, NdotL: f32, view_depth: f32, screen_pos: vec2<f32>) -> f32 {
  if (light.shadowsEnabled == 0u) { return 1.0; }
  let cascade = select_cascade(view_depth);
  // Constant receiver bias scaled by surface slope. Independent of per-frame
  // cascade depth range so the bias doesn't oscillate as the camera moves.
  let bias    = max(0.002 * (1.0 - NdotL), 0.0005);

  // Normal bias — offset receiver along its surface normal by a fraction of
  // the cascade's world-space texel size, scaled by grazing angle so the
  // offset is large where it's needed and zero on directly-lit surfaces.
  // Removes the light-parallel component so the offset doesn't fake depth bias.
  let L          = normalize(-light.direction);
  let t_angle    = clamp(1.0 - max(0.0, NdotL), 0.0, 1.0);
  var nb         = N * (light.cascadeTexelSizes[cascade] * 3.0 * t_angle);
  nb            -= L * dot(L, nb);
  let biased_pos = world_pos + nb;

  let sc0 = cascade_coords(cascade, biased_pos);
  if (!in_cascade(sc0)) { return 1.0; }

  // PCSS with the penumbra estimate computed in WORLD units, then converted
  // to per-cascade texels for sampling. This keeps the visual softness
  // consistent across cascades, so the blend at the cascade boundary doesn't
  // reveal a sudden change in shadow appearance. Min kernel is 1 texel
  // per-cascade (sharp default), not a fixed world distance — that would
  // force a wide blur on near cascades where one texel is already small.
  let SEARCH_WORLD     : f32 = 0.3;   // metres — blocker search radius
  let KERNEL_MAX_WORLD : f32 = 1.0;   // metres — caps very soft shadows

  let texel_world_0 = light.cascadeTexelSizes[cascade];
  let depth_world_0 = light.cascadeDepthRanges[cascade];
  let search_tex_0  = clamp(SEARCH_WORLD / texel_world_0, 2.0, 8.0);

  var kernel0      = 1.0;
  let avg_blocker0 = pcss_blocker_search(cascade, sc0, search_tex_0, screen_pos);
  if (avg_blocker0 >= 0.0) {
    let occluder_dist = max((sc0.z - avg_blocker0) * depth_world_0, 0.0);
    let penumbra_world = min(light.shadowSoftness * occluder_dist, KERNEL_MAX_WORLD);
    kernel0 = clamp(penumbra_world / texel_world_0, 1.0, 16.0);
  }
  let s0 = pcf_shadow(cascade, sc0, bias, kernel0, screen_pos);

  let next = cascade + 1u;
  if (next < light.cascadeCount) {
    let split      = light.cascadeSplits[cascade];
    let blend_band = split * 0.2;
    let t = smoothstep(split - blend_band, split, view_depth);
    if (t > 0.0) {
      let sc1 = cascade_coords(next, biased_pos);
      // Only blend toward the next cascade if this position is actually inside it;
      // blending toward an OOB cascade would mix toward depth=1 (fully lit).
      if (in_cascade(sc1)) {
        let texel_world_1 = light.cascadeTexelSizes[next];
        let depth_world_1 = light.cascadeDepthRanges[next];
        let search_tex_1  = clamp(SEARCH_WORLD / texel_world_1, 2.0, 8.0);

        var kernel1      = 1.0;
        let avg_blocker1 = pcss_blocker_search(next, sc1, search_tex_1, screen_pos);
        if (avg_blocker1 >= 0.0) {
          let occluder_dist1  = max((sc1.z - avg_blocker1) * depth_world_1, 0.0);
          let penumbra_world1 = min(light.shadowSoftness * occluder_dist1, KERNEL_MAX_WORLD);
          kernel1 = clamp(penumbra_world1 / texel_world_1, 1.0, 16.0);
        }
        return mix(s0, pcf_shadow(next, sc1, bias, kernel1, screen_pos), t);
      }
    }
  }
  return s0;
}

// === PBR BRDFs ========================================================

fn distribution_ggx(NdotH: f32, roughness: f32) -> f32 {
  let a  = roughness * roughness;
  let a2 = a * a;
  let d  = NdotH * NdotH * (a2 - 1.0) + 1.0;
  return a2 / (PI * d * d);
}

// k for direct lighting: (roughness+1)²/8
fn geometry_direct(NdotX: f32, roughness: f32) -> f32 {
  let r = roughness + 1.0;
  let k = r * r / 8.0;
  return NdotX / (NdotX * (1.0 - k) + k);
}

fn smith_direct(NdotV: f32, NdotL: f32, roughness: f32) -> f32 {
  return geometry_direct(NdotV, roughness) * geometry_direct(NdotL, roughness);
}

fn fresnel_schlick(cosTheta: f32, F0: vec3<f32>) -> vec3<f32> {
  return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}

// Roughness-clamped Fresnel for IBL — prevents energy gain at grazing angles on rough metals.
fn fresnel_schlick_roughness(cosTheta: f32, F0: vec3<f32>, roughness: f32) -> vec3<f32> {
  return F0 + (max(vec3<f32>(1.0 - roughness), F0) - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}


// === Fragment =========================================================

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let coord = vec2<i32>(in.clip_pos.xy);
  let depth = textureLoad(depthTex, coord, 0);

  // === Debug: shadow-map depth thumbnails ===================================
  // Rendered before the sky discard so they overlay the full screen.
  if (light.debugCascades != 0u) {
    let screen  = vec2<f32>(textureDimensions(depthTex));
    let thumb   = floor(screen.y / 4.0); // square side — 3 thumbnails fit vertically
    let sm_size = vec2<f32>(textureDimensions(shadowMap));
    let px      = in.clip_pos.xy;

    for (var ci = 0u; ci < light.cascadeCount; ci++) {
      let x0 = screen.x - thumb;
      let y0 = f32(ci) * thumb;
      if (px.x >= x0 && px.y >= y0 && px.y < y0 + thumb) {
        let uv = (px - vec2<f32>(x0, y0)) / thumb;
        // textureLoad avoids the sampler-type conflict (depth textures can't use
        // a non-comparison sampler through textureSampleLevel).
        let tc = clamp(vec2<i32>(uv * sm_size),
                       vec2<i32>(0), vec2<i32>(sm_size) - vec2<i32>(1));
        let d = textureLoad(shadowMap, tc, i32(ci), 0);
        // 2-pixel border in the cascade's debug color
        let border = 2.0;
        if (px.x < x0 + border || px.y < y0 + border || px.y > y0 + thumb - border) {
          switch ci {
            case 0u: { return vec4<f32>(1.0, 0.25, 0.25, 1.0); }
            case 1u: { return vec4<f32>(0.25, 1.0, 0.25, 1.0); }
            case 2u: { return vec4<f32>(0.25, 0.25, 1.0, 1.0); }
            default: { return vec4<f32>(1.0,  1.0,  0.25, 1.0); }
          }
        }
        return vec4<f32>(d, d, d, 1.0);
      }
    }
  }
  // ==========================================================================

  if (depth >= 1.0) { discard; } // sky pixels handled by SkyPass

  let albedo_rough = textureLoad(albedoRoughnessTex, coord, 0);
  let normal_emiss = textureLoad(normalMetallicTex,  coord, 0);

  let albedo    = albedo_rough.rgb;
  let roughness = max(albedo_rough.a, 0.04); // clamp to avoid division issues
  let N         = normalize(normal_emiss.rgb * 2.0 - 1.0);
  let emission  = normal_emiss.a;
  let metallic  = 0.0; // Replaced with emission channel

  let world_pos = reconstruct_world_pos(in.uv, depth);
  let V         = normalize(camera.position - world_pos);
  let NdotV     = max(dot(N, V), 0.001);

  // View-space depth for cascade selection
  let view_pos   = camera.view * vec4<f32>(world_pos, 1.0);
  let view_depth = -view_pos.z;

  // Base reflectance: 0.04 for dielectrics, albedo for metals
  let F0 = mix(vec3<f32>(0.04), albedo, metallic);

  // === Direct lighting (sun) =========================================
  let L     = normalize(-light.direction);
  let H     = normalize(L + V);
  let NdotL = max(dot(N, L), 0.0);
  let NdotH = max(dot(N, H), 0.0);
  let VdotH = max(dot(V, H), 0.0);

  // Smoothly kill sun contribution as it dips below the horizon (L.y = 0).
  let horizon_fade = smoothstep(-0.05, 0.05, L.y);

  let D  = distribution_ggx(NdotH, roughness);
  let G  = smith_direct(NdotV, NdotL, roughness);
  let Fd = fresnel_schlick(VdotH, F0);

  let kS_direct = Fd;
  let kD_direct = (vec3<f32>(1.0) - kS_direct) * (1.0 - metallic);

  let specular_brdf = D * G * Fd / max(4.0 * NdotV * NdotL, 0.001);
  let diffuse_brdf  = kD_direct * albedo / PI;

  let shad = shadow_factor(world_pos, N, NdotL, view_depth, in.clip_pos.xy);

  // Cloud shadow — sample top-down transmittance map; default 1.0 when extent is zero
  let cloud_ext = max(light.cloudShadowExtent, 0.001);
  let cloud_uv  = (world_pos.xz - light.cloudShadowOrigin) / (cloud_ext * 2.0) + 0.5;
  // Fade cloud shadow to 1.0 (no shadow) in the outer 10% of the map to hide the
  // hard edge where the shadow map repeats its border.
  var cloud_edge = min(cloud_uv.x, 1.0 - cloud_uv.x);
  cloud_edge = min(cloud_edge, min(cloud_uv.y, 1.0 - cloud_uv.y));
  let cloud_fade = saturate(cloud_edge * 10.0);
  let cloud_raw  = textureSampleLevel(cloudShadowTex, gbufferSampler, clamp(cloud_uv, vec2<f32>(0.0), vec2<f32>(1.0)), 0.0).r;
  let cloud_shadow = select(mix(1.0, cloud_raw, cloud_fade), 1.0, light.cloudShadowExtent <= 0.0);

  let direct = (diffuse_brdf + specular_brdf) * light.color * light.intensity * NdotL * shad * cloud_shadow * horizon_fade;

  // === IBL Ambient ====================================================
  let ao = textureSampleLevel(ao_tex, ao_samp, in.uv, 0.0).r;

  // Roughness-corrected Fresnel — avoids energy gain on rough metals at grazing angles.
  let kS_ibl = fresnel_schlick_roughness(NdotV, F0, roughness);
  let kD_ibl = (vec3<f32>(1.0) - kS_ibl) * (1.0 - metallic);

  // Diffuse IBL: cosine-weighted hemisphere integral baked into irradiance cube.
  let irradiance  = textureSampleLevel(irradiance_cube, ibl_samp, N, 0.0).rgb;
  let diffuse_ibl = irradiance * albedo * kD_ibl;

  // Specular IBL: GGX pre-filtered env + split-sum BRDF LUT.
  let R           = reflect(-V, N);
  let prefiltered = textureSampleLevel(prefilter_cube, ibl_samp, R, roughness * (IBL_MIP_LEVELS - 1.0)).rgb;
  let brdf        = textureSampleLevel(brdf_lut, ibl_samp, vec2<f32>(NdotV, roughness), 0.0).rg;
  let specular_ibl = 0.0;//prefiltered * (kS_ibl * brdf.x + brdf.y);

  // Shadow-darken ambient during the day; at night remove shadow influence.
  let shadow_scale = mix(1.0, max(shad, 0.05), horizon_fade);
  // Scale by AO and shadow; fade IBL with sun so it doesn't blast at night.
  // Add a tiny constant for moonlight/starlight so the world isn't pitch black.
  let ambient = (diffuse_ibl + specular_ibl) * ao * shadow_scale * horizon_fade
              + albedo * (1.0 - metallic) * 0.01;

  // SSGI: one-bounce diffuse indirect from screen-space ray march
  let ssgi_irr     = textureSampleLevel(ssgi_tex, ssgi_samp, in.uv, 0.0).rgb;
  let ssgi_contrib = ssgi_irr * albedo * (1.0 - metallic);

  // Add emission (scaled by albedo for colored glow)
  let emissive = albedo * emission * 2.0;

  let color = direct + ambient + ssgi_contrib + emissive;

  if (light.debugCascades != 0u) {
    let cascade = select_cascade(view_depth);
    var tint: vec3<f32>;
    switch cascade {
      case 0u:    { tint = vec3<f32>(1.0, 0.25, 0.25); } // red   = near
      case 1u:    { tint = vec3<f32>(0.25, 1.0, 0.25); } // green = mid
      case 2u:    { tint = vec3<f32>(0.25, 0.25, 1.0); } // blue  = far
      default:    { tint = vec3<f32>(1.0,  1.0,  0.25); } // yellow = beyond
    }
    let shad = shadow_factor(world_pos, N, NdotL, view_depth, in.clip_pos.xy);
    return vec4<f32>(tint * mix(0.15, 1.0, shad), 1.0);
  }

  let sun_dir_fog = normalize(-light.direction);
  let cam_h_fog   = max(camera.position.y, 1.0);
  let haze = apply_aerial_perspective(color, world_pos, sun_dir_fog, cam_h_fog);
  return vec4<f32>(haze, 1.0);
}
`,C="rgba16float",z=64*4+16+16,F=368;class q extends I{constructor(e,r,t,a,o,d,s,c,l,_,h,u,p,f,w,g,b,S){super();n(this,"name","DeferredLightingPass");n(this,"hdrTexture");n(this,"hdrView");n(this,"cameraBuffer");n(this,"lightBuffer");n(this,"_pipeline");n(this,"_sceneBindGroup");n(this,"_gbufferBindGroup");n(this,"_aoBindGroup");n(this,"_iblBindGroup");n(this,"_defaultCloudShadow");n(this,"_defaultSsgi");n(this,"_defaultIblCube");n(this,"_defaultBrdfLut");n(this,"_device");n(this,"_aoBGL");n(this,"_aoView");n(this,"_aoSampler");n(this,"_ssgiSampler");n(this,"_cameraScratch",new Float32Array(z/4));n(this,"_lightScratch",new Float32Array(F/4));n(this,"_lightScratchU",new Uint32Array(this._lightScratch.buffer));n(this,"_cloudShadowScratch",new Float32Array(3));this.hdrTexture=e,this.hdrView=r,this._pipeline=t,this._sceneBindGroup=a,this._gbufferBindGroup=o,this._aoBindGroup=d,this._iblBindGroup=s,this.cameraBuffer=c,this.lightBuffer=l,this._defaultCloudShadow=_,this._defaultSsgi=h,this._defaultIblCube=u,this._defaultBrdfLut=p,this._device=f,this._aoBGL=w,this._aoView=g,this._aoSampler=b,this._ssgiSampler=S}static create(e,r,t,a,o,d){const{device:s,width:c,height:l}=e,_=s.createTexture({label:"HDR Texture",size:{width:c,height:l},format:C,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),h=_.createView(),u=s.createBuffer({label:"LightCameraBuffer",size:z,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),p=s.createBuffer({label:"LightBuffer",size:F,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),f=s.createSampler({label:"ShadowSampler",compare:"less-equal",magFilter:"linear",minFilter:"linear"}),w=s.createSampler({label:"GBufferLinearSampler",magFilter:"linear",minFilter:"linear"}),g=s.createSampler({label:"AoSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),b=s.createSampler({label:"SsgiSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),S=s.createBindGroupLayout({label:"LightSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),v=s.createBindGroupLayout({label:"LightGBufferBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth",viewDimension:"2d-array"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"comparison"}},{binding:5,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:6,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),T=s.createTexture({label:"DefaultCloudShadow",size:{width:1,height:1},format:"r8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});s.queue.writeTexture({texture:T},new Uint8Array([255]),{bytesPerRow:1},{width:1,height:1});const R=o??T.createView(),B=s.createBindGroupLayout({label:"LightAoBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),M=s.createTexture({label:"DefaultSsgi",size:{width:1,height:1},format:C,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),L=s.createBindGroupLayout({label:"LightIblBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),N=s.createSampler({label:"IblSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge"}),A=s.createTexture({label:"DefaultIblCube",size:{width:1,height:1,depthOrArrayLayers:6},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),P=A.createView({dimension:"cube"}),x=s.createTexture({label:"DefaultBrdfLut",size:{width:1,height:1},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),G=s.createBindGroup({label:"LightIblBG",layout:L,entries:[{binding:0,resource:(d==null?void 0:d.irradianceView)??P},{binding:1,resource:(d==null?void 0:d.prefilteredView)??P},{binding:2,resource:(d==null?void 0:d.brdfLutView)??x.createView()},{binding:3,resource:N}]}),Y=s.createBindGroup({layout:S,entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:{buffer:p}}]}),$=s.createBindGroup({layout:v,entries:[{binding:0,resource:r.albedoRoughnessView},{binding:1,resource:r.normalMetallicView},{binding:2,resource:r.depthView},{binding:3,resource:t.shadowMapView},{binding:4,resource:f},{binding:5,resource:w},{binding:6,resource:R}]}),K=s.createBindGroup({label:"LightAoBG",layout:B,entries:[{binding:0,resource:a},{binding:1,resource:g},{binding:2,resource:M.createView()},{binding:3,resource:b}]}),D=s.createShaderModule({label:"LightingShader",code:oe}),Q=s.createRenderPipeline({label:"LightingPipeline",layout:s.createPipelineLayout({bindGroupLayouts:[S,v,B,L]}),vertex:{module:D,entryPoint:"vs_main"},fragment:{module:D,entryPoint:"fs_main",targets:[{format:C}]},primitive:{topology:"triangle-list"}});return new q(_,h,Q,Y,$,K,G,u,p,o?null:T,M,d?null:A,d?null:x,s,B,a,g,b)}updateSSGI(e){this._aoBindGroup=this._device.createBindGroup({label:"LightAoBG",layout:this._aoBGL,entries:[{binding:0,resource:this._aoView},{binding:1,resource:this._aoSampler},{binding:2,resource:e},{binding:3,resource:this._ssgiSampler}]})}updateCamera(e,r,t,a,o,d,s,c){const l=this._cameraScratch;l.set(r.data,0),l.set(t.data,16),l.set(a.data,32),l.set(o.data,48),l[64]=d.x,l[65]=d.y,l[66]=d.z,l[67]=s,l[68]=c,e.queue.writeBuffer(this.cameraBuffer,0,l.buffer)}updateLight(e,r,t,a,o,d=!0,s=!1,c=.02){const l=this._lightScratch,_=this._lightScratchU;let h=0;l[h++]=r.x,l[h++]=r.y,l[h++]=r.z,l[h++]=a,l[h++]=t.x,l[h++]=t.y,l[h++]=t.z,_[h++]=o.length;for(let u=0;u<4;u++)u<o.length&&l.set(o[u].lightViewProj.data,h),h+=16;for(let u=0;u<4;u++)l[h++]=u<o.length?o[u].splitFar:1e9;_[h]=d?1:0,_[h+1]=s?1:0,l[81]=c;for(let u=0;u<4;u++)l[84+u]=u<o.length?o[u].depthRange:1;for(let u=0;u<4;u++)l[88+u]=u<o.length?o[u].texelWorldSize:1;e.queue.writeBuffer(this.lightBuffer,0,l.buffer)}updateCloudShadow(e,r,t,a){const o=this._cloudShadowScratch;o[0]=r,o[1]=t,o[2]=a,e.queue.writeBuffer(this.lightBuffer,312,o.buffer)}execute(e,r){const t=e.beginRenderPass({label:"DeferredLightingPass",colorAttachments:[{view:this.hdrView,loadOp:"load",storeOp:"store"}]});t.setPipeline(this._pipeline),t.setBindGroup(0,this._sceneBindGroup),t.setBindGroup(1,this._gbufferBindGroup),t.setBindGroup(2,this._aoBindGroup),t.setBindGroup(3,this._iblBindGroup),t.draw(3),t.end()}destroy(){var e,r,t,a;this.hdrTexture.destroy(),this.cameraBuffer.destroy(),this.lightBuffer.destroy(),(e=this._defaultCloudShadow)==null||e.destroy(),(r=this._defaultSsgi)==null||r.destroy(),(t=this._defaultIblCube)==null||t.destroy(),(a=this._defaultBrdfLut)==null||a.destroy()}}const k=64*4+16+16,le=128;class Z extends I{constructor(e,r,t,a,o){super();n(this,"name","GeometryPass");n(this,"_gbuffer");n(this,"_cameraBGL");n(this,"_modelBGL");n(this,"_pipelineCache",new Map);n(this,"_cameraBuffer");n(this,"_cameraBindGroup");n(this,"_modelBuffers",[]);n(this,"_modelBindGroups",[]);n(this,"_drawItems",[]);n(this,"_modelData",new Float32Array(32));n(this,"_cameraScratch",new Float32Array(k/4));this._gbuffer=e,this._cameraBGL=r,this._modelBGL=t,this._cameraBuffer=a,this._cameraBindGroup=o}static create(e,r){const{device:t}=e,a=t.createBindGroupLayout({label:"GeomCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),o=t.createBindGroupLayout({label:"GeomModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),d=t.createBuffer({label:"GeomCameraBuffer",size:k,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),s=t.createBindGroup({label:"GeomCameraBindGroup",layout:a,entries:[{binding:0,resource:{buffer:d}}]});return new Z(r,a,o,d,s)}setDrawItems(e){this._drawItems=e}updateCamera(e,r,t,a,o,d,s,c){const l=this._cameraScratch;l.set(r.data,0),l.set(t.data,16),l.set(a.data,32),l.set(o.data,48),l[64]=d.x,l[65]=d.y,l[66]=d.z,l[67]=s,l[68]=c,e.queue.writeBuffer(this._cameraBuffer,0,l.buffer)}execute(e,r){var o,d;const{device:t}=r;this._ensurePerDrawBuffers(t,this._drawItems.length);for(let s=0;s<this._drawItems.length;s++){const c=this._drawItems[s],l=this._modelData;l.set(c.modelMatrix.data,0),l.set(c.normalMatrix.data,16),r.queue.writeBuffer(this._modelBuffers[s],0,l.buffer),(d=(o=c.material).update)==null||d.call(o,r.queue)}const a=e.beginRenderPass({label:"GeometryPass",colorAttachments:[{view:this._gbuffer.albedoRoughnessView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"},{view:this._gbuffer.normalMetallicView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});a.setBindGroup(0,this._cameraBindGroup);for(let s=0;s<this._drawItems.length;s++){const c=this._drawItems[s];a.setPipeline(this._getPipeline(t,c.material)),a.setBindGroup(1,this._modelBindGroups[s]),a.setBindGroup(2,c.material.getBindGroup(t)),a.setVertexBuffer(0,c.mesh.vertexBuffer),a.setIndexBuffer(c.mesh.indexBuffer,"uint32"),a.drawIndexed(c.mesh.indexCount)}a.end()}_getPipeline(e,r){let t=this._pipelineCache.get(r.shaderId);if(t)return t;const a=e.createShaderModule({label:`GeometryShader[${r.shaderId}]`,code:r.getShaderCode(re.Geometry)});return t=e.createRenderPipeline({label:`GeometryPipeline[${r.shaderId}]`,layout:e.createPipelineLayout({bindGroupLayouts:[this._cameraBGL,this._modelBGL,r.getBindGroupLayout(e)]}),vertex:{module:a,entryPoint:"vs_main",buffers:[{arrayStride:j,attributes:H}]},fragment:{module:a,entryPoint:"fs_main",targets:[{format:"rgba8unorm"},{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),this._pipelineCache.set(r.shaderId,t),t}_ensurePerDrawBuffers(e,r){for(;this._modelBuffers.length<r;){const t=e.createBuffer({size:le,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._modelBuffers.push(t),this._modelBindGroups.push(e.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:t}}]}))}}destroy(){this._cameraBuffer.destroy();for(const e of this._modelBuffers)e.destroy()}}export{ae as C,q as D,X as G,C as H,ie as M,W as S,Z as a,ue as b,he as c,se as d,V as e};
