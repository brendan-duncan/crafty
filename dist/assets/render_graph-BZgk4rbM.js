var U=Object.defineProperty;var k=a=>{throw TypeError(a)};var O=(a,e,r)=>e in a?U(a,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):a[e]=r;var l=(a,e,r)=>O(a,typeof e!="symbol"?e+"":e,r),y=(a,e,r)=>e.has(a)||k("Cannot "+r);var x=(a,e,r)=>(y(a,e,"read from private field"),r?r.call(a):e.get(a)),v=(a,e,r)=>e.has(a)?k("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(a):e.set(a,r),T=(a,e,r,t)=>(y(a,e,"write to private field"),t?t.call(a,r):e.set(a,r),r);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&t(i)}).observe(document,{childList:!0,subtree:!0});function r(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function t(s){if(s.ep)return;s.ep=!0;const n=r(s);fetch(s.href,n)}})();const C=`/* Camera Shader Block */\r
\r
struct CameraUniforms {\r
  view        : mat4x4<f32>,\r
  proj        : mat4x4<f32>,\r
  viewProj    : mat4x4<f32>,\r
  invViewProj : mat4x4<f32>,\r
  position    : vec3<f32>,\r
  near        : f32,\r
  far         : f32,\r
}\r
\r
@group(0) @binding(0) var<uniform> camera: CameraUniforms;\r
`,$=`/* Lighting Shader Block */\r
const MAX_POINT_LIGHTS: u32 = 8u;\r
const MAX_SPOT_LIGHTS: u32 = 4u;\r
\r
struct PointLight {\r
  position    : vec3<f32>,\r
  range       : f32,\r
  color       : vec3<f32>,\r
  intensity   : f32,\r
  castShadows : u32,\r
  _pad        : vec3<u32>,\r
}\r
\r
struct SpotLight {\r
  position        : vec3<f32>,\r
  range           : f32,\r
  direction       : vec3<f32>,\r
  innerAngle      : f32,\r
  color           : vec3<f32>,\r
  outerAngle      : f32,\r
  intensity       : f32,\r
  castShadows     : u32,\r
  shadowMapIndex  : u32,\r
  _pad            : u32,\r
  lightViewProj   : mat4x4<f32>,\r
}\r
\r
struct DirectionalLight {\r
  direction       : vec3<f32>,\r
  intensity       : f32,\r
  color           : vec3<f32>,\r
  castShadows     : u32,\r
  shadowMapIndex  : u32,\r
  _pad            : vec3<u32>,\r
  lightViewProj   : mat4x4<f32>,\r
}\r
\r
struct LightingUniforms {\r
  numPointLights : u32,\r
  numSpotLights  : u32,\r
  _pad           : vec2<u32>,\r
}\r
\r
@group(3) @binding(0) var<uniform> lighting: LightingUniforms;\r
@group(3) @binding(1) var<uniform> directionalLight: DirectionalLight;\r
@group(3) @binding(2) var<storage, read> pointLights: array<PointLight>;\r
@group(3) @binding(3) var<storage, read> spotLights: array<SpotLight>;\r
@group(3) @binding(4) var shadowMapArray: texture_depth_2d_array;\r
@group(3) @binding(5) var shadowSampler: sampler_comparison;\r
@group(3) @binding(6) var irradiance_cube: texture_cube<f32>;\r
@group(3) @binding(7) var prefilter_cube: texture_cube<f32>;\r
@group(3) @binding(8) var brdf_lut: texture_2d<f32>;\r
@group(3) @binding(9) var ibl_sampler: sampler;\r
@group(3) @binding(10) var pointShadowCubeArray: texture_depth_cube_array;\r
\r
const IBL_MIP_LEVELS: f32 = 5.0;\r
\r
// PBR lighting functions\r
\r
fn fresnel_schlick(cos_theta: f32, F0: vec3<f32>) -> vec3<f32> {\r
  return F0 + (vec3<f32>(1.0) - F0) * pow(max(1.0 - cos_theta, 0.0), 5.0);\r
}\r
\r
fn fresnel_schlick_roughness(cos_theta: f32, F0: vec3<f32>, roughness: f32) -> vec3<f32> {\r
  let omr = vec3<f32>(1.0 - roughness);\r
  return F0 + (max(omr, F0) - F0) * pow(max(1.0 - cos_theta, 0.0), 5.0);\r
}\r
\r
fn distribution_ggx(N: vec3<f32>, H: vec3<f32>, roughness: f32) -> f32 {\r
  let a = roughness * roughness;\r
  let a2 = a * a;\r
  let NdotH = max(dot(N, H), 0.0);\r
  let NdotH2 = NdotH * NdotH;\r
  let denom = NdotH2 * (a2 - 1.0) + 1.0;\r
  return a2 / (PI * denom * denom);\r
}\r
\r
fn geometry_schlick_ggx(NdotV: f32, roughness: f32) -> f32 {\r
  let r = roughness + 1.0;\r
  let k = (r * r) / 8.0;\r
  return NdotV / (NdotV * (1.0 - k) + k);\r
}\r
\r
fn geometry_smith(N: vec3<f32>, V: vec3<f32>, L: vec3<f32>, roughness: f32) -> f32 {\r
  let NdotV = max(dot(N, V), 0.0);\r
  let NdotL = max(dot(N, L), 0.0);\r
  let ggx1 = geometry_schlick_ggx(NdotV, roughness);\r
  let ggx2 = geometry_schlick_ggx(NdotL, roughness);\r
  return ggx1 * ggx2;\r
}\r
\r
fn sample_shadow(world_pos: vec3<f32>) -> f32 {\r
  if (directionalLight.castShadows == 0u) { return 1.0; }\r
  let light_space = directionalLight.lightViewProj * vec4<f32>(world_pos, 1.0);\r
  var shadow_coord = light_space.xyz / light_space.w;\r
  shadow_coord = vec3<f32>(shadow_coord.xy * 0.5 + 0.5, shadow_coord.z);\r
  shadow_coord.y = 1.0 - shadow_coord.y;\r
  if (shadow_coord.x < 0.0 || shadow_coord.x > 1.0 ||\r
      shadow_coord.y < 0.0 || shadow_coord.y > 1.0 ||\r
      shadow_coord.z < 0.0 || shadow_coord.z > 1.0) { return 1.0; }\r
  let bias = 0.002;\r
  return textureSampleCompareLevel(shadowMapArray, shadowSampler, shadow_coord.xy, i32(directionalLight.shadowMapIndex), shadow_coord.z - bias);\r
}\r
\r
fn sample_spot_shadow(world_pos: vec3<f32>, light: SpotLight) -> f32 {\r
  if (light.castShadows == 0u) { return 1.0; }\r
  let light_space = light.lightViewProj * vec4<f32>(world_pos, 1.0);\r
  var shadow_coord = light_space.xyz / light_space.w;\r
  shadow_coord = vec3<f32>(shadow_coord.xy * 0.5 + 0.5, shadow_coord.z);\r
  shadow_coord.y = 1.0 - shadow_coord.y;\r
  if (shadow_coord.x < 0.0 || shadow_coord.x > 1.0 ||\r
      shadow_coord.y < 0.0 || shadow_coord.y > 1.0 ||\r
      shadow_coord.z < 0.0 || shadow_coord.z > 1.0) { return 1.0; }\r
  let bias = 0.002;\r
  return textureSampleCompareLevel(shadowMapArray, shadowSampler, shadow_coord.xy, i32(light.shadowMapIndex), shadow_coord.z - bias);\r
}\r
\r
fn sample_point_shadow(world_pos: vec3<f32>, light: PointLight, slot: i32) -> f32 {\r
  if (light.castShadows == 0u) { return 1.0; }\r
  let to_frag = world_pos - light.position;\r
  let dist = length(to_frag);\r
  if (dist >= light.range) { return 1.0; }\r
  let dir = to_frag / dist;\r
  return textureSampleCompareLevel(pointShadowCubeArray, shadowSampler, dir, slot, dist / light.range - 0.005);\r
}\r
\r
fn calculate_pbr_lighting(\r
  albedo: vec3<f32>, N: vec3<f32>, V: vec3<f32>,\r
  world_pos: vec3<f32>, roughness: f32, metallic: f32,\r
) -> vec3<f32> {\r
  let F0 = mix(vec3<f32>(0.04), albedo, metallic);\r
  let NdotV = max(dot(N, V), 0.001);\r
  var Lo = vec3<f32>(0.0);\r
\r
  // Directional light\r
  {\r
    let L = normalize(-directionalLight.direction);\r
    let H = normalize(V + L);\r
    let NdotL = max(dot(N, L), 0.0);\r
    if (NdotL > 0.0) {\r
      let radiance = directionalLight.color * directionalLight.intensity;\r
      let D = distribution_ggx(N, H, roughness);\r
      let G = geometry_smith(N, V, L, roughness);\r
      let F = fresnel_schlick(max(dot(H, V), 0.0), F0);\r
      let specular = (D * G * F) / max(4.0 * NdotV * NdotL, 0.001);\r
      let kD = (vec3<f32>(1.0) - F) * (1.0 - metallic);\r
      let diffuse = kD * albedo / PI;\r
      let shadow = sample_shadow(world_pos);\r
      Lo += (diffuse + specular) * radiance * NdotL * shadow;\r
    }\r
  }\r
\r
  // Point lights\r
  for (var i = 0u; i < lighting.numPointLights && i < MAX_POINT_LIGHTS; i++) {\r
    let light = pointLights[i];\r
    let L = light.position - world_pos;\r
    let distance = length(L);\r
    let L_norm = L / distance;\r
    if (distance < light.range) {\r
      let H = normalize(V + L_norm);\r
      let NdotL = max(dot(N, L_norm), 0.0);\r
      if (NdotL > 0.0) {\r
        let atten = max(1.0 - (distance / light.range), 0.0);\r
        let radiance = light.color * light.intensity * atten * atten;\r
        let D = distribution_ggx(N, H, roughness);\r
        let G = geometry_smith(N, V, L_norm, roughness);\r
        let F = fresnel_schlick(max(dot(H, V), 0.0), F0);\r
        let specular = (D * G * F) / max(4.0 * NdotV * NdotL, 0.001);\r
        let kD = (vec3<f32>(1.0) - F) * (1.0 - metallic);\r
        let diffuse = kD * albedo / PI;\r
        let shadow = sample_point_shadow(world_pos, light, i32(i));\r
        Lo += (diffuse + specular) * radiance * NdotL * shadow;\r
      }\r
    }\r
  }\r
\r
  // Spot lights\r
  for (var i = 0u; i < lighting.numSpotLights && i < MAX_SPOT_LIGHTS; i++) {\r
    let light = spotLights[i];\r
    let L = light.position - world_pos;\r
    let distance = length(L);\r
    let L_norm = L / distance;\r
    if (distance < light.range) {\r
      let spot_dir = normalize(-light.direction);\r
      let theta = dot(L_norm, spot_dir);\r
      let inner = cos(light.innerAngle * 0.0174533);\r
      let outer = cos(light.outerAngle * 0.0174533);\r
      let intens = clamp((theta - outer) / (inner - outer), 0.0, 1.0);\r
      if (intens > 0.0) {\r
        let H = normalize(V + L_norm);\r
        let NdotL = max(dot(N, L_norm), 0.0);\r
        if (NdotL > 0.0) {\r
          let atten = max(1.0 - (distance / light.range), 0.0);\r
          let radiance = light.color * light.intensity * atten * atten * intens;\r
          let D = distribution_ggx(N, H, roughness);\r
          let G = geometry_smith(N, V, L_norm, roughness);\r
          let F = fresnel_schlick(max(dot(H, V), 0.0), F0);\r
          let specular = (D * G * F) / max(4.0 * NdotV * NdotL, 0.001);\r
          let kD = (vec3<f32>(1.0) - F) * (1.0 - metallic);\r
          let diffuse = kD * albedo / PI;\r
          let shadow = sample_spot_shadow(world_pos, light);\r
          Lo += (diffuse + specular) * radiance * NdotL * shadow;\r
        }\r
      }\r
    }\r
  }\r
\r
  // IBL ambient\r
  let kS_ibl = fresnel_schlick_roughness(NdotV, F0, roughness);\r
  let kD_ibl = (vec3<f32>(1.0) - kS_ibl) * (1.0 - metallic);\r
  let irradiance = textureSampleLevel(irradiance_cube, ibl_sampler, N, 0.0).rgb;\r
  let diffuse_ibl = irradiance * albedo * kD_ibl;\r
  let R = reflect(-V, N);\r
  let prefiltered = textureSampleLevel(prefilter_cube, ibl_sampler, R, roughness * (IBL_MIP_LEVELS - 1.0)).rgb;\r
  let brdf = textureSampleLevel(brdf_lut, ibl_sampler, vec2<f32>(NdotV, roughness), 0.0).rg;\r
  let specular_ibl = prefiltered * (kS_ibl * brdf.x + brdf.y);\r
  let ambient = (diffuse_ibl + specular_ibl) * 0.5;\r
\r
  return Lo + ambient;\r
}\r
`,N=`/* Model Shader Block */\r
\r
struct ModelUniforms {\r
  model: mat4x4<f32>,\r
  normalMatrix: mat4x4<f32>,\r
}\r
\r
@group(1) @binding(0) var<uniform> model: ModelUniforms;\r
`;function B(a,e){let r=a;return r=r.replace(/defined\s*\(\s*(\w+)\s*\)/g,(t,s)=>s in e?"1":"0"),r=r.replace(/\b([a-zA-Z_]\w*)\b/g,(t,s)=>s in e?e[s]||"1":"0"),!!new Function("return ("+r+")")()}function P(a,e){e=e??{};const r=a.split(`
`),t=[],s=[],n=()=>{for(let i=0;i<s.length;i++)if(!s[i].active)return!1;return!0};for(const i of r){const c=i.trim();if(!c.startsWith("#")){n()&&t.push(i);continue}const o=c.slice(1).trimStart(),d=o.match(/^(\w+)/);if(!d){n()&&t.push(i);continue}switch(d[1]){case"define":{if(n()){const h=o.slice(6).trimStart(),f=h.match(/^(\w+)/);if(f){const p=f[1],m=h.slice(p.length).trim();e[p]=m||"1"}}break}case"undef":{if(n()){const h=o.slice(5).trim();h&&delete e[h]}break}case"if":{const h=o.slice(2).trim(),p=n()?B(h,e):!1;s.push({active:p,taken:p,elseSeen:!1});break}case"ifdef":{const h=o.slice(5).trim(),p=n()&&e.hasOwnProperty(h);s.push({active:p,taken:p,elseSeen:!1});break}case"elif":{if(s.length===0)break;const h=s[s.length-1];if(h.elseSeen)break;const f=o.slice(4).trim(),m=s.length===1||s.slice(0,-1).every(V=>V.active)?B(f,e):!1;h.active=!h.taken&&m,h.taken=h.taken||m;break}case"else":{if(s.length===0)break;const h=s[s.length-1];if(h.elseSeen)break;h.active=!h.taken,h.elseSeen=!0;break}case"endif":{s.length>0&&s.pop();break}default:n()&&t.push(i);break}}return t.join(`
`)}const D=Object.assign({"../shaders/modules/camera.wgsl":C,"../shaders/modules/lighting.wgsl":$,"../shaders/modules/model.wgsl":N});class I{constructor(){l(this,"_blocks",{});this._registerBuiltinShaderBlocks()}importShaderBlocks(e,r){return r??(r={}),e=P(e,r),e.replace(/^#import\s+"(.+?)\.wgsl"\s*$/gm,(t,s)=>this.getShaderBlock(s,r))}registerShaderBlock(e,r){this._blocks[e]=r}removeShaderBlock(e){delete this._blocks[e]}getShaderBlock(e,r){let t=this._blocks[e];return t?(t=P(t,r),t=t.replace(/^#import\s+"(.+?)\.wgsl"\s*$/gm,(s,n)=>this.getShaderBlock(n,r))):console.warn(`Missing shader block: ${e}`),t??`/* Missing shader block: ${e} */`}_registerBuiltinShaderBlocks(){for(const[e,r]of Object.entries(D)){const t=e.split("/").pop().replace(".wgsl","");this.registerShaderBlock(t,r)}}}var w,b;const _=class _{constructor(e,r,t,s,n,i,c){l(this,"device");l(this,"queue");l(this,"context");l(this,"format");l(this,"depthFormat");l(this,"canvas");l(this,"hdr");l(this,"enableErrorHandling");l(this,"shaderBlockManager");l(this,"activeCamera",null);l(this,"elapsedTime",0);l(this,"deltaTime",0);l(this,"frameCount",0);l(this,"framesPerSecond",0);l(this,"fps",0);v(this,w,performance.now());v(this,b,performance.now());l(this,"_backbufferView",null);l(this,"_backbufferDepth",null);l(this,"_backbufferDepthView",null);this.device=e,this.queue=e.queue,this.context=r,this.format=t,this.depthFormat=s,this.canvas=n,this.hdr=i,this.enableErrorHandling=c,this.shaderBlockManager=new I}get width(){return this.canvas.width}get height(){return this.canvas.height}update(){var s;const e=performance.now();this.deltaTime=Math.max(0,(e-x(this,b))/1e3),T(this,b,e),this.elapsedTime=(e-x(this,w))/1e3,this.frameCount++;const r=this.deltaTime>0?1/this.deltaTime:0;this.framesPerSecond+=(r-this.framesPerSecond)*.1,this.fps=Math.round(this.framesPerSecond),this._backbufferView=null;const t=this.canvas.width!==this.canvas.clientWidth||this.canvas.height!==this.canvas.clientHeight;return t&&(this.canvas.width=this.canvas.clientWidth,this.canvas.height=this.canvas.clientHeight,(s=this._backbufferDepth)==null||s.destroy(),this._backbufferDepth=null,this._backbufferDepthView=null),t}get backbufferTexture(){return this.context.getCurrentTexture()}get backbufferView(){return this._backbufferView||(this._backbufferView=this.backbufferTexture.createView()),this._backbufferView}get backbufferDepth(){return this._backbufferDepth||this._createBackbufferDepth(),this._backbufferDepth}get backbufferDepthView(){return this._backbufferDepth||this._createBackbufferDepth(),this._backbufferDepthView}_createBackbufferDepth(){var e;(e=this._backbufferDepth)==null||e.destroy(),this._backbufferDepth=null,this._backbufferDepthView=null,this.depthFormat&&(this._backbufferDepth=this.device.createTexture({size:{width:this.width,height:this.height},format:this.depthFormat,usage:GPUTextureUsage.RENDER_ATTACHMENT}),this._backbufferDepthView=this._backbufferDepth.createView())}static async create(e,r={}){var h;if(!navigator.gpu)throw new Error("WebGPU not supported");const t=await navigator.gpu.requestAdapter();if(!t)throw new Error("No WebGPU adapter found");const s=[];for(const f of t.features)s.push(f);const n={};for(const[f,p]of Object.entries(t.limits))n[f]=p;const i=await t.requestDevice({requiredFeatures:s,requiredLimits:n});r.enableErrorHandling&&i.addEventListener("uncapturederror",f=>{const p=f.error;p instanceof GPUValidationError?console.error("[WebGPU Validation Error]",p.message):p instanceof GPUOutOfMemoryError?console.error("[WebGPU Out of Memory]"):console.error("[WebGPU Internal Error]",p)});const c=e.getContext("webgpu");let o,d=!1;const u=GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC;try{c.configure({device:i,format:"rgba16float",alphaMode:"opaque",colorSpace:"display-p3",toneMapping:{mode:"extended"},usage:u});const f=c.getConfiguration();((h=f==null?void 0:f.toneMapping)==null?void 0:h.mode)==="extended"?(o="rgba16float",d=!0):o=navigator.gpu.getPreferredCanvasFormat()}catch{o=navigator.gpu.getPreferredCanvasFormat(),c.configure({device:i,format:o,alphaMode:"opaque",usage:u})}return e.width=e.clientWidth*devicePixelRatio,e.height=e.clientHeight*devicePixelRatio,new _(i,c,o,r.depthFormat??_.DEFAULT_DEPTH_FORMAT,e,d,r.enableErrorHandling??!1)}createShaderModule(e,r,t){return e=this.shaderBlockManager.importShaderBlocks(e,t),this.device.createShaderModule({code:e,label:r})}registerShaderBlock(e,r){this.shaderBlockManager.registerShaderBlock(e,r)}removeShaderBlock(e){this.shaderBlockManager.removeShaderBlock(e)}getShaderBlock(e,r){return this.shaderBlockManager.getShaderBlock(e,r)}createBuffer(e,r,t){return this.device.createBuffer({size:e,usage:r,label:t})}writeBuffer(e,r,t=0){r instanceof ArrayBuffer?this.queue.writeBuffer(e,t,r):this.queue.writeBuffer(e,t,r.buffer,r.byteOffset,r.byteLength)}pushInitErrorScope(){this.enableErrorHandling&&this.device.pushErrorScope("validation")}async popInitErrorScope(e){if(this.enableErrorHandling){const r=await this.device.popErrorScope();r&&(console.error(`[Init:${e}] Validation Error:`,r.message),console.trace())}}pushFrameErrorScope(){this.enableErrorHandling&&this.device.pushErrorScope("validation")}async popFrameErrorScope(){if(this.enableErrorHandling){const e=await this.device.popErrorScope();e&&(console.error("[Frame] Validation Error:",e.message),console.trace())}}pushPassErrorScope(e){this.enableErrorHandling&&(this.device.pushErrorScope("validation"),this.device.pushErrorScope("out-of-memory"),this.device.pushErrorScope("internal"))}async popPassErrorScope(e){if(this.enableErrorHandling){const r=await this.device.popErrorScope();r&&console.error(`[${e}] Internal Error:`,r),await this.device.popErrorScope()&&console.error(`[${e}] Out of Memory`);const s=await this.device.popErrorScope();s&&console.error(`[${e}] Validation Error:`,s.message)}}createDefaultCubemap(){const e=this.device.createTexture({size:{width:1,height:1,depthOrArrayLayers:6},format:"rgba16float",dimension:"2d",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST,mipLevelCount:1}),r=new Uint16Array([0,0,0,0]);for(let t=0;t<6;t++)this.queue.writeTexture({texture:e,origin:{x:0,y:0,z:t}},r,{bytesPerRow:8},{width:1,height:1});return e}createDefaultBrdfLUT(){const e=this.device.createTexture({size:{width:1,height:1},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),r=new Uint16Array([14336,14336,14336,15360]);return this.queue.writeTexture({texture:e},r,{bytesPerRow:8},{width:1,height:1}),e}};w=new WeakMap,b=new WeakMap,l(_,"DEFAULT_DEPTH_FORMAT","depth32float");let S=_;class F{constructor(e){l(this,"_device");l(this,"_texturePool",new Map);l(this,"_bufferPool",new Map);l(this,"_liveTransients",[]);l(this,"_persistentTextures",new Map);l(this,"_persistentBuffers",new Map);l(this,"_viewCache",new WeakMap);l(this,"_gpuObjectIds",new WeakMap);l(this,"_nextGpuObjectId",1);l(this,"_bindGroupCache",new Map);this._device=e}acquireTexture(e,r){const t=E(e,r),s=this._texturePool.get(t);let n=s==null?void 0:s.pop();return n||(n=this._device.createTexture({label:e.label,size:{width:e.width,height:e.height,depthOrArrayLayers:e.depthOrArrayLayers??1},format:e.format,mipLevelCount:e.mipLevelCount??1,sampleCount:e.sampleCount??1,dimension:e.dimension??"2d",usage:r})),this._liveTransients.push({kind:"tex",key:t,resource:n}),n}acquireBuffer(e,r){const t=L(e,r),s=this._bufferPool.get(t);let n=s==null?void 0:s.pop();return n||(n=this._device.createBuffer({label:e.label,size:e.size,usage:r})),this._liveTransients.push({kind:"buf",key:t,resource:n}),n}releaseAllTransients(){for(const e of this._liveTransients)if(e.kind==="tex"){let r=this._texturePool.get(e.key);r||(r=[],this._texturePool.set(e.key,r)),r.push(e.resource)}else{let r=this._bufferPool.get(e.key);r||(r=[],this._bufferPool.set(e.key,r)),r.push(e.resource)}this._liveTransients.length=0}_gpuObjectId(e){let r=this._gpuObjectIds.get(e);return r===void 0&&(r=this._nextGpuObjectId++,this._gpuObjectIds.set(e,r)),r}_bindGroupEntryKey(e){const r=e.resource,t=e.binding;if(r instanceof GPUBuffer)return`${t}:B${this._gpuObjectId(r)}`;if(r instanceof GPUTextureView)return`${t}:V${this._gpuObjectId(r)}`;if(r instanceof GPUSampler)return`${t}:S${this._gpuObjectId(r)}`;if("buffer"in r){const s=r;return`${t}:B${this._gpuObjectId(s.buffer)}:${s.offset??0}:${s.size??0}`}return"sampler"in r?`${t}:S${this._gpuObjectId(r.sampler)}`:"texture"in r?`${t}:V${this._gpuObjectId(r.texture)}`:`${t}:?`}getOrCreateBindGroup(e){let r=this._bindGroupCache.get(e.layout);r||(r=new Map,this._bindGroupCache.set(e.layout,r));const t=Array.from(e.entries,n=>this._bindGroupEntryKey(n)).join("|");let s=r.get(t);return s||(s=this._device.createBindGroup(e),r.set(t,s)),s}getOrCreatePersistentTexture(e,r,t){const s=this._persistentTextures.get(e),n=E(r,t);if(s){if(s.descKey===n)return s.texture;s.texture.destroy(),this._persistentTextures.delete(e)}const i=this._device.createTexture({label:r.label??e,size:{width:r.width,height:r.height,depthOrArrayLayers:r.depthOrArrayLayers??1},format:r.format,mipLevelCount:r.mipLevelCount??1,sampleCount:r.sampleCount??1,dimension:r.dimension??"2d",usage:t});return this._persistentTextures.set(e,{texture:i,descKey:n}),i}getOrCreatePersistentBuffer(e,r,t){const s=this._persistentBuffers.get(e),n=L(r,t);if(s){if(s.descKey===n)return s.buffer;s.buffer.destroy(),this._persistentBuffers.delete(e)}const i=this._device.createBuffer({label:r.label??e,size:r.size,usage:t});return this._persistentBuffers.set(e,{buffer:i,descKey:n}),i}getOrCreateView(e,r){let t=this._viewCache.get(e);t||(t=new Map,this._viewCache.set(e,t));const s=r?JSON.stringify(r):"";let n=t.get(s);return n||(n=e.createView(r),t.set(s,n)),n}trimUnused(){for(const e of this._texturePool.values()){for(const r of e)r.destroy();e.length=0}this._texturePool.clear();for(const e of this._bufferPool.values()){for(const r of e)r.destroy();e.length=0}this._bufferPool.clear(),this._bindGroupCache.clear()}destroyPersistentTexture(e){const r=this._persistentTextures.get(e);r&&(r.texture.destroy(),this._persistentTextures.delete(e))}destroyPersistentBuffer(e){const r=this._persistentBuffers.get(e);r&&(r.buffer.destroy(),this._persistentBuffers.delete(e))}destroy(){this.trimUnused();for(const e of this._liveTransients)e.kind,e.resource.destroy();this._liveTransients.length=0;for(const e of this._persistentTextures.values())e.texture.destroy();this._persistentTextures.clear();for(const e of this._persistentBuffers.values())e.buffer.destroy();this._persistentBuffers.clear()}}function E(a,e){return`${a.format}|${a.width}x${a.height}x${a.depthOrArrayLayers??1}|m${a.mipLevelCount??1}|s${a.sampleCount??1}|${a.dimension??"2d"}|u${e}`}function L(a,e){return`s${a.size}|u${e}`}class M{constructor(e,r,t,s,n,i,c){l(this,"_localVersion",new Map);l(this,"node");this._onCreateTexture=s,this._onCreateBuffer=n,this._onWriteBumpVersion=i,this._validateHandle=c,this.node={name:e,type:r,order:t,reads:[],writes:[],created:[],execute:null}}createTexture(e){const r=this._onCreateTexture(e);return this.node.created.push(r.id),this._localVersion.set(r.id,r.version),r}createBuffer(e){const r=this._onCreateBuffer(e);return this.node.created.push(r.id),this._localVersion.set(r.id,r.version),r}read(e,r){this._validateHandle(e);const t=this._localVersion.get(e.id);if(t!==void 0&&t>e.version)throw new Error(`[render-graph] Pass '${this.node.name}' reads stale handle id=${e.id} v${e.version} (latest in this pass is v${t}). Use the handle returned by write().`);return this.node.reads.push({id:e.id,version:e.version,usage:r}),e}write(e,r,t){this._validateHandle(e);for(const n of this.node.reads)if(n.id===e.id)throw new Error(`[render-graph] Pass '${this.node.name}' writes id=${e.id} after reading it in the same pass. Split the work into two passes.`);const s=this._onWriteBumpVersion(e.id);return this._localVersion.set(e.id,s),this.node.writes.push({id:e.id,version:s,usage:r,attachment:t}),{id:e.id,version:s}}setExecute(e){if(this.node.execute)throw new Error(`[render-graph] Pass '${this.node.name}' setExecute called more than once.`);this.node.execute=e}}var g=(a=>(a[a.Texture=0]="Texture",a[a.Buffer=1]="Buffer",a))(g||{});class R{constructor(e,r){l(this,"ctx");l(this,"cache");l(this,"_resources",new Map);l(this,"_passes",[]);l(this,"_nextId",1);l(this,"_backbufferHandle",null);l(this,"_backbufferDepthHandle",null);this.ctx=e,this.cache=r}get passList(){return this._passes}getResourceInfo(e){const r=this._resources.get(e);if(!r)return null;if(r.kind===g.Texture){const t=r.desc;return{kind:"texture",format:t.format,isBackbuffer:r.isBackbuffer,label:r.persistentKey??(r.isBackbuffer?"Backbuffer":t.format),width:t.width,height:t.height}}else{const t=r.desc;return{kind:"buffer",label:t.label??`Buffer #${e}`,size:t.size}}}setBackbuffer(e,r){if(this._backbufferHandle)throw new Error("[render-graph] setBackbuffer called more than once.");const t=this._nextId++,s={label:"backbuffer",format:this.ctx.format,width:this.ctx.width,height:this.ctx.height,...r},n=e==="canvas";return this._resources.set(t,{id:t,kind:g.Texture,desc:s,currentVersion:0,persistentKey:null,isBackbuffer:n,externalTexture:n?null:e,externalBuffer:null}),this._backbufferHandle={id:t,version:0},this._backbufferHandle}setBackbufferDepth(e,r){if(this._backbufferDepthHandle)throw new Error("[render-graph] setBackbufferDepth called more than once.");const t=this._nextId++,s={label:"backbuffer-depth",format:this.ctx.depthFormat??"depth32float",width:this.ctx.width,height:this.ctx.height,...r},n=e==="canvas";return this._resources.set(t,{id:t,kind:g.Texture,desc:s,currentVersion:0,persistentKey:null,isBackbuffer:n,externalTexture:n?null:e,externalBuffer:null}),this._backbufferDepthHandle={id:t,version:0},this._backbufferDepthHandle}getBackbuffer(){if(!this._backbufferHandle)throw new Error("[render-graph] getBackbuffer() before setBackbuffer().");return this._backbufferHandle}getBackbufferDepth(){return this._backbufferDepthHandle}importPersistentTexture(e,r){const t=this._nextId++;return this._resources.set(t,{id:t,kind:g.Texture,desc:r,currentVersion:0,persistentKey:e,isBackbuffer:!1,externalTexture:null,externalBuffer:null}),{id:t,version:0}}importPersistentBuffer(e,r){const t=this._nextId++;return this._resources.set(t,{id:t,kind:g.Buffer,desc:r,currentVersion:0,persistentKey:e,isBackbuffer:!1,externalTexture:null,externalBuffer:null}),{id:t,version:0}}importExternalTexture(e,r){const t=this._nextId++;return this._resources.set(t,{id:t,kind:g.Texture,desc:r,currentVersion:0,persistentKey:null,isBackbuffer:!1,externalTexture:e,externalBuffer:null}),{id:t,version:0}}importExternalBuffer(e,r){const t=this._nextId++;return this._resources.set(t,{id:t,kind:g.Buffer,desc:r,currentVersion:0,persistentKey:null,isBackbuffer:!1,externalTexture:null,externalBuffer:e}),{id:t,version:0}}addPass(e,r,t){const s=new M(e,r,this._passes.length,n=>this._registerCreatedTexture(n),n=>this._registerCreatedBuffer(n),n=>this._bumpVersion(n),n=>this._validateHandle(n));if(t(s),!s.node.execute)throw new Error(`[render-graph] Pass '${e}' did not call setExecute().`);this._passes.push(s.node)}compile(){this._validateAccesses();const e=this._cull(),r=this._topoSort(e),t=new Map,s=new Map,n=[],i=new Set;for(const d of r){for(const u of d.reads)i.add(u.id);for(const u of d.writes)i.add(u.id)}const c=new Map,o=new Map;for(const d of i){const u=this._resources.get(d);if(!u.persistentKey)continue;const h=this._aggregateUsage(d,r);if(u.kind===g.Texture){const f=c.get(u.persistentKey)??0;c.set(u.persistentKey,f|h)}else{const f=o.get(u.persistentKey)??0;o.set(u.persistentKey,f|h)}}for(const d of i){const u=this._resources.get(d),h=this._aggregateUsage(d,r);if(u.kind===g.Texture)if(u.isBackbuffer)n.push(d);else if(u.externalTexture)t.set(d,u.externalTexture);else if(u.persistentKey){const f=c.get(u.persistentKey),p=this.cache.getOrCreatePersistentTexture(u.persistentKey,u.desc,f);t.set(d,p)}else{const f=this.cache.acquireTexture(u.desc,h);t.set(d,f)}else if(u.externalBuffer)s.set(d,u.externalBuffer);else if(u.persistentKey){const f=o.get(u.persistentKey),p=this.cache.getOrCreatePersistentBuffer(u.persistentKey,u.desc,f);s.set(d,p)}else{const f=this.cache.acquireBuffer(u.desc,h);s.set(d,f)}}return{passes:r.map((d,u)=>({node:d,index:u})),textureBindings:t,bufferBindings:s,backbufferIds:n}}async execute(e){var s,n;this.ctx.pushFrameErrorScope();for(const i of e.backbufferIds)if(i===((s=this._backbufferHandle)==null?void 0:s.id))e.textureBindings.set(i,this.ctx.backbufferTexture);else if(i===((n=this._backbufferDepthHandle)==null?void 0:n.id)){const c=this.ctx.backbufferDepth;c||this._fail("backbuffer depth not configured"),e.textureBindings.set(i,c)}const r=this.ctx.device.createCommandEncoder({label:"RenderGraph"}),t=this._buildResolvedResources(e);for(const i of e.passes){const c=i.node;if(c.type==="render"){const{colorAttachments:o,depthStencilAttachment:d}=this._buildRenderPassDescriptor(c,e),u=r.beginRenderPass({label:c.name,colorAttachments:o,depthStencilAttachment:d});c.execute({commandEncoder:r,renderPassEncoder:u},t),u.end()}else if(c.type==="compute"){const o=r.beginComputePass({label:c.name});c.execute({commandEncoder:r,computePassEncoder:o},t),o.end()}else c.execute({commandEncoder:r},t)}this.ctx.queue.submit([r.finish()]),this.cache.releaseAllTransients(),await this.ctx.popFrameErrorScope()}_registerCreatedTexture(e){const r=this._nextId++;return this._resources.set(r,{id:r,kind:g.Texture,desc:e,currentVersion:0,persistentKey:null,isBackbuffer:!1,externalTexture:null,externalBuffer:null}),{id:r,version:0}}_registerCreatedBuffer(e){const r=this._nextId++;return this._resources.set(r,{id:r,kind:g.Buffer,desc:e,currentVersion:0,persistentKey:null,isBackbuffer:!1,externalTexture:null,externalBuffer:null}),{id:r,version:0}}_bumpVersion(e){const r=this._resources.get(e);if(!r)throw new Error(`[render-graph] write of unknown resource id=${e}`);return++r.currentVersion}_validateHandle(e){if(!this._resources.get(e.id))throw new Error(`[render-graph] handle id=${e.id} not registered with this graph`)}_validateAccesses(){const e=new Map;for(let r=0;r<this._passes.length;r++)for(const t of this._passes[r].writes){const s=`${t.id}:${t.version}`;if(e.has(s))throw new Error(`[render-graph] resource id=${t.id} v${t.version} written by multiple passes`);e.set(s,r)}for(let r=0;r<this._passes.length;r++)for(const t of this._passes[r].reads){if(t.version===0)continue;if(e.get(`${t.id}:${t.version}`)===void 0)throw new Error(`[render-graph] pass '${this._passes[r].name}' reads id=${t.id} v${t.version} which is never produced`)}}_cull(){const e=new Set;if(!this._backbufferHandle)return this._passes.slice();const r=new Set;r.add(this._backbufferHandle.id),this._backbufferDepthHandle&&r.add(this._backbufferDepthHandle.id);for(const n of this._resources.values())(n.persistentKey||n.externalTexture||n.externalBuffer)&&r.add(n.id);const t=[];for(let n=0;n<this._passes.length;n++)for(const i of this._passes[n].writes)if(r.has(i.id)){e.has(n)||(e.add(n),t.push(n));break}const s=new Map;for(let n=0;n<this._passes.length;n++)for(const i of this._passes[n].writes)s.set(`${i.id}:${i.version}`,n);for(;t.length>0;){const n=t.pop();for(const i of this._passes[n].reads){if(i.version===0)continue;const c=s.get(`${i.id}:${i.version}`);c!==void 0&&!e.has(c)&&(e.add(c),t.push(c))}for(const i of this._passes[n].writes){if(i.version<=1)continue;const c=s.get(`${i.id}:${i.version-1}`);c!==void 0&&!e.has(c)&&(e.add(c),t.push(c))}}return this._passes.filter((n,i)=>e.has(i))}_topoSort(e){const r=new Map;e.forEach((s,n)=>r.set(s,n));const t=new Map;for(let s=0;s<e.length;s++)for(const n of e[s].writes)t.set(`${n.id}:${n.version}`,s);for(let s=0;s<e.length;s++)for(const n of e[s].reads){if(n.version===0)continue;const i=t.get(`${n.id}:${n.version}`);if(i!==void 0&&i>s)throw new Error(`[render-graph] pass '${e[s].name}' reads id=${n.id} v${n.version} produced by '${e[i].name}' which was added later. addPass() ordering must respect data dependencies.`)}return e}_aggregateUsage(e,r){const t=this._resources.get(e);let s=0,n=0;const i=t.kind===g.Texture,c=o=>{i?s|=G(o,t.desc.format):n|=H(o)};for(const o of r){for(const d of o.reads)d.id===e&&c(d.usage);for(const d of o.writes)d.id===e&&c(d.usage)}if(i){const o=t.desc;return o.extraUsage&&(s|=o.extraUsage),s}else{const o=t.desc;return o.extraUsage&&(n|=o.extraUsage),n}}_buildResolvedResources(e){const r=this.cache;return{getTexture:t=>{const s=e.textureBindings.get(t.id);if(!s)throw new Error(`[render-graph] no physical texture for id=${t.id}`);return s},getTextureView:(t,s)=>{const n=e.textureBindings.get(t.id);if(!n)throw new Error(`[render-graph] no physical texture for id=${t.id}`);return r.getOrCreateView(n,s)},getBuffer:t=>{const s=e.bufferBindings.get(t.id);if(!s)throw new Error(`[render-graph] no physical buffer for id=${t.id}`);return s},getOrCreateBindGroup:t=>r.getOrCreateBindGroup(t)}}_buildRenderPassDescriptor(e,r){const t=[];let s;const n=new Set;for(const i of e.writes)if(i.usage==="depth-attachment"){if(s)throw new Error(`[render-graph] pass '${e.name}' has multiple depth attachments`);const c=r.textureBindings.get(i.id);if(!c)throw new Error(`[render-graph] depth attachment id=${i.id} unbound`);const o=i.attachment??{};s={view:this.cache.getOrCreateView(c,o.view),depthLoadOp:o.depthLoadOp??o.loadOp??"load",depthStoreOp:o.depthStoreOp??o.storeOp??"store",depthClearValue:o.depthClearValue},(o.stencilLoadOp||o.stencilStoreOp||o.stencilClearValue!==void 0)&&(s.stencilLoadOp=o.stencilLoadOp,s.stencilStoreOp=o.stencilStoreOp,s.stencilClearValue=o.stencilClearValue)}for(const i of e.reads)if(i.usage==="depth-read"){if(s)throw new Error(`[render-graph] pass '${e.name}' depth-read conflicts with depth-attachment write`);const c=r.textureBindings.get(i.id);if(!c)throw new Error(`[render-graph] depth-read id=${i.id} unbound`);s={view:this.cache.getOrCreateView(c),depthReadOnly:!0}}for(const i of e.writes){if(i.usage!=="attachment"||n.has(i.id))continue;const c=r.textureBindings.get(i.id);if(!c)throw new Error(`[render-graph] color attachment id=${i.id} unbound`);const o=i.attachment??{};let d;if(o.resolveTarget){const u=r.textureBindings.get(o.resolveTarget.id);if(!u)throw new Error(`[render-graph] resolveTarget id=${o.resolveTarget.id} unbound`);d=this.cache.getOrCreateView(u),n.add(o.resolveTarget.id)}t.push({view:this.cache.getOrCreateView(c,o.view),loadOp:o.loadOp??"load",storeOp:o.storeOp??"store",clearValue:o.clearValue,resolveTarget:d})}return{colorAttachments:t,depthStencilAttachment:s}}_fail(e){throw new Error(`[render-graph] ${e}`)}}function G(a,e){switch(a){case"attachment":case"depth-attachment":return GPUTextureUsage.RENDER_ATTACHMENT;case"depth-read":return GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING;case"sampled":return GPUTextureUsage.TEXTURE_BINDING;case"storage-read":case"storage-write":case"storage-read-write":return GPUTextureUsage.STORAGE_BINDING;case"copy-src":return GPUTextureUsage.COPY_SRC;case"copy-dst":return GPUTextureUsage.COPY_DST;default:return 0}}function H(a){switch(a){case"uniform":return GPUBufferUsage.UNIFORM;case"storage-read":case"storage-write":case"storage-read-write":return GPUBufferUsage.STORAGE;case"vertex":return GPUBufferUsage.VERTEX;case"index":return GPUBufferUsage.INDEX;case"indirect":return GPUBufferUsage.INDIRECT;case"copy-src":return GPUBufferUsage.COPY_SRC;case"copy-dst":return GPUBufferUsage.COPY_DST;default:return 0}}export{F as P,R,S as a};
