var P=Object.defineProperty;var L=o=>{throw TypeError(o)};var V=(o,e,r)=>e in o?P(o,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):o[e]=r;var l=(o,e,r)=>V(o,typeof e!="symbol"?e+"":e,r),k=(o,e,r)=>e.has(o)||L("Cannot "+r);var w=(o,e,r)=>(k(o,e,"read from private field"),r?r.call(o):e.get(o)),v=(o,e,r)=>e.has(o)?L("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(o):e.set(o,r),x=(o,e,r,n)=>(k(o,e,"write to private field"),n?n.call(o,r):e.set(o,r),r);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))n(t);new MutationObserver(t=>{for(const a of t)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function r(t){const a={};return t.integrity&&(a.integrity=t.integrity),t.referrerPolicy&&(a.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?a.credentials="include":t.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(t){if(t.ep)return;t.ep=!0;const a=r(t);fetch(t.href,a)}})();const D=`/* Camera Shader Block */\r
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
`,B=`/* Lighting Shader Block */\r
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
`,T=`/* Model Shader Block */\r
\r
struct ModelUniforms {\r
  model: mat4x4<f32>,\r
  normalMatrix: mat4x4<f32>,\r
}\r
\r
@group(1) @binding(0) var<uniform> model: ModelUniforms;\r
`;function S(o,e){let r=o;return r=r.replace(/defined\s*\(\s*(\w+)\s*\)/g,(n,t)=>t in e?"1":"0"),r=r.replace(/\b([a-zA-Z_]\w*)\b/g,(n,t)=>t in e?e[t]||"1":"0"),!!new Function("return ("+r+")")()}function y(o,e){e=e??{};const r=o.split(`
`),n=[],t=[],a=()=>{for(let s=0;s<t.length;s++)if(!t[s].active)return!1;return!0};for(const s of r){const d=s.trim();if(!d.startsWith("#")){a()&&n.push(s);continue}const h=d.slice(1).trimStart(),u=h.match(/^(\w+)/);if(!u){a()&&n.push(s);continue}switch(u[1]){case"define":{if(a()){const i=h.slice(6).trimStart(),c=i.match(/^(\w+)/);if(c){const f=c[1],m=i.slice(f.length).trim();e[f]=m||"1"}}break}case"undef":{if(a()){const i=h.slice(5).trim();i&&delete e[i]}break}case"if":{const i=h.slice(2).trim(),f=a()?S(i,e):!1;t.push({active:f,taken:f,elseSeen:!1});break}case"ifdef":{const i=h.slice(5).trim(),f=a()&&e.hasOwnProperty(i);t.push({active:f,taken:f,elseSeen:!1});break}case"elif":{if(t.length===0)break;const i=t[t.length-1];if(i.elseSeen)break;const c=h.slice(4).trim(),m=t.length===1||t.slice(0,-1).every(N=>N.active)?S(c,e):!1;i.active=!i.taken&&m,i.taken=i.taken||m;break}case"else":{if(t.length===0)break;const i=t[t.length-1];if(i.elseSeen)break;i.active=!i.taken,i.elseSeen=!0;break}case"endif":{t.length>0&&t.pop();break}default:a()&&n.push(s);break}}return n.join(`
`)}const M=Object.assign({"../shaders/modules/camera.wgsl":D,"../shaders/modules/lighting.wgsl":B,"../shaders/modules/model.wgsl":T});class F{constructor(){l(this,"_blocks",{});this._registerBuiltinShaderBlocks()}importShaderBlocks(e,r){return r??(r={}),e=y(e,r),e.replace(/^#import\s+"(.+?)\.wgsl"\s*$/gm,(n,t)=>this.getShaderBlock(t,r))}registerShaderBlock(e,r){this._blocks[e]=r}removeShaderBlock(e){delete this._blocks[e]}getShaderBlock(e,r){let n=this._blocks[e];return n?(n=y(n,r),n=n.replace(/^#import\s+"(.+?)\.wgsl"\s*$/gm,(t,a)=>this.getShaderBlock(a,r))):console.warn(`Missing shader block: ${e}`),n??`/* Missing shader block: ${e} */`}_registerBuiltinShaderBlocks(){for(const[e,r]of Object.entries(M)){const n=e.split("/").pop().replace(".wgsl","");this.registerShaderBlock(n,r)}}}var _,p;const g=class g{constructor(e,r,n,t,a,s,d){l(this,"device");l(this,"queue");l(this,"context");l(this,"format");l(this,"depthFormat");l(this,"canvas");l(this,"hdr");l(this,"enableErrorHandling");l(this,"shaderBlockManager");l(this,"elapsedTime",0);l(this,"deltaTime",0);l(this,"frameCount",0);l(this,"fps",0);v(this,_,performance.now());v(this,p,performance.now());l(this,"_backbufferView",null);l(this,"_backbufferDepth",null);l(this,"_backbufferDepthView",null);this.device=e,this.queue=e.queue,this.context=r,this.format=n,this.depthFormat=t,this.canvas=a,this.hdr=s,this.enableErrorHandling=d,this.shaderBlockManager=new F}get width(){return this.canvas.width}get height(){return this.canvas.height}update(){var t;const e=performance.now();this.deltaTime=Math.max(0,(e-w(this,p))/1e3),x(this,p,e),this.elapsedTime=(e-w(this,_))/1e3,this.frameCount++;const r=this.deltaTime>0?1/this.deltaTime:0;this.fps+=(r-this.fps)*.1,this._backbufferView=null;const n=this.canvas.width!==this.canvas.clientWidth||this.canvas.height!==this.canvas.clientHeight;return n&&(this.canvas.width=this.canvas.clientWidth,this.canvas.height=this.canvas.clientHeight,(t=this._backbufferDepth)==null||t.destroy(),this._backbufferDepth=null,this._backbufferDepthView=null),n}get backbufferTexture(){return this.context.getCurrentTexture()}get backbufferView(){return this._backbufferView||(this._backbufferView=this.backbufferTexture.createView()),this._backbufferView}get backbufferDepth(){return this._backbufferDepth||this._createBackbufferDepth(),this._backbufferDepth}get backbufferDepthView(){return this._backbufferDepth||this._createBackbufferDepth(),this._backbufferDepthView}_createBackbufferDepth(){var e;(e=this._backbufferDepth)==null||e.destroy(),this._backbufferDepth=null,this._backbufferDepthView=null,this.depthFormat&&(this._backbufferDepth=this.device.createTexture({size:{width:this.width,height:this.height},format:this.depthFormat,usage:GPUTextureUsage.RENDER_ATTACHMENT}),this._backbufferDepthView=this._backbufferDepth.createView())}static async create(e,r={}){var b;if(!navigator.gpu)throw new Error("WebGPU not supported");const n=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!n)throw new Error("No WebGPU adapter found");const t=[];for(const i of n.features)t.push(i);const a={};for(const[i,c]of Object.entries(n.limits))a[i]=c;const s=await n.requestDevice({requiredFeatures:t,requiredLimits:a});r.enableErrorHandling&&s.addEventListener("uncapturederror",i=>{const c=i.error;c instanceof GPUValidationError?console.error("[WebGPU Validation Error]",c.message):c instanceof GPUOutOfMemoryError?console.error("[WebGPU Out of Memory]"):console.error("[WebGPU Internal Error]",c)});const d=e.getContext("webgpu");let h,u=!1;try{d.configure({device:s,format:"rgba16float",alphaMode:"opaque",colorSpace:"display-p3",toneMapping:{mode:"extended"}});const i=d.getConfiguration();((b=i==null?void 0:i.toneMapping)==null?void 0:b.mode)==="extended"?(h="rgba16float",u=!0):h=navigator.gpu.getPreferredCanvasFormat()}catch{h=navigator.gpu.getPreferredCanvasFormat(),d.configure({device:s,format:h,alphaMode:"opaque"})}return e.width=e.clientWidth*devicePixelRatio,e.height=e.clientHeight*devicePixelRatio,new g(s,d,h,r.depthFormat??g.DEFAULT_DEPTH_FORMAT,e,u,r.enableErrorHandling??!1)}createShaderModule(e,r,n){return e=this.shaderBlockManager.importShaderBlocks(e,n),this.device.createShaderModule({code:e,label:r})}registerShaderBlock(e,r){this.shaderBlockManager.registerShaderBlock(e,r)}removeShaderBlock(e){this.shaderBlockManager.removeShaderBlock(e)}getShaderBlock(e,r){return this.shaderBlockManager.getShaderBlock(e,r)}createBuffer(e,r,n){return this.device.createBuffer({size:e,usage:r,label:n})}writeBuffer(e,r,n=0){r instanceof ArrayBuffer?this.queue.writeBuffer(e,n,r):this.queue.writeBuffer(e,n,r.buffer,r.byteOffset,r.byteLength)}pushInitErrorScope(){this.enableErrorHandling&&this.device.pushErrorScope("validation")}async popInitErrorScope(e){if(this.enableErrorHandling){const r=await this.device.popErrorScope();r&&(console.error(`[Init:${e}] Validation Error:`,r.message),console.trace())}}pushFrameErrorScope(){this.enableErrorHandling&&this.device.pushErrorScope("validation")}async popFrameErrorScope(){if(this.enableErrorHandling){const e=await this.device.popErrorScope();e&&(console.error("[Frame] Validation Error:",e.message),console.trace())}}pushPassErrorScope(e){this.enableErrorHandling&&(this.device.pushErrorScope("validation"),this.device.pushErrorScope("out-of-memory"),this.device.pushErrorScope("internal"))}async popPassErrorScope(e){if(this.enableErrorHandling){const r=await this.device.popErrorScope();r&&console.error(`[${e}] Internal Error:`,r),await this.device.popErrorScope()&&console.error(`[${e}] Out of Memory`);const t=await this.device.popErrorScope();t&&console.error(`[${e}] Validation Error:`,t.message)}}createDefaultCubemap(){const e=this.device.createTexture({size:{width:1,height:1,depthOrArrayLayers:6},format:"rgba16float",dimension:"2d",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST,mipLevelCount:1}),r=new Uint16Array([0,0,0,0]);for(let n=0;n<6;n++)this.queue.writeTexture({texture:e,origin:{x:0,y:0,z:n}},r,{bytesPerRow:8},{width:1,height:1});return e}createDefaultBrdfLUT(){const e=this.device.createTexture({size:{width:1,height:1},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),r=new Uint16Array([14336,14336,14336,15360]);return this.queue.writeTexture({texture:e},r,{bytesPerRow:8},{width:1,height:1}),e}};_=new WeakMap,p=new WeakMap,l(g,"DEFAULT_DEPTH_FORMAT","depth32float");let E=g;export{E as R};
