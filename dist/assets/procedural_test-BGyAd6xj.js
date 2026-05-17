var k=Object.defineProperty;var A=(a,o,e)=>o in a?k(a,o,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[o]=e;var n=(a,o,e)=>A(a,typeof o!="symbol"?o+"":o,e);import{R as O}from"./render_context-CS49VIWO.js";import{e as f,G as L,V as d,C as R,d as W,M as r}from"./mesh-QCRC26ja.js";import{a as E}from"./material-DqlrPFF9.js";import{F as N,D as j}from"./directional_shadow_pass-BTw1cZCl.js";import{R as q}from"./render_graph-Iq2DzviW.js";import"./render_pass-BouxMEb8.js";import"./shadow-eFElBMYD.js";const Y=`// Forward procedural shader — custom material demo
// Uses the forward renderer's lighting infrastructure (groups 0,1,3)
// with a procedurally generated animated pattern in the fragment shader.

// Include the standard modules
#import "camera.wgsl"
#import "lighting.wgsl"
#import "model.wgsl"

const PI: f32 = 3.14159265358979323846;

struct ProceduralUniforms {
  baseColor   : vec4<f32>,
  accentColor : vec4<f32>,
  patternScale: f32,
  time        : f32,
  animSpeed   : f32,
  edgeWidth   : f32,
}

@group(2) @binding(0) var<uniform> params: ProceduralUniforms;

struct VertexInput {
  @location(0) position: vec3<f32>,
  @location(1) normal: vec3<f32>,
  @location(2) uv: vec2<f32>,
  @location(3) tangent: vec4<f32>,
}

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
  @location(0) world_pos  : vec3<f32>,
  @location(1) world_norm : vec3<f32>,
  @location(2) uv         : vec2<f32>,
  @location(3) world_tan  : vec4<f32>,
}

@vertex
fn vs_main(vin: VertexInput) -> VertexOutput {
  let world_pos = model.model * vec4<f32>(vin.position, 1.0);
  let world_norm = normalize((model.normalMatrix * vec4<f32>(vin.normal, 0.0)).xyz);
  let world_tan = normalize((model.normalMatrix * vec4<f32>(vin.tangent.xyz, 0.0)).xyz);

  var out: VertexOutput;
  out.clip_pos = camera.viewProj * world_pos;
  out.world_pos = world_pos.xyz;
  out.world_norm = world_norm;
  out.uv = vin.uv;
  out.world_tan = vec4<f32>(world_tan, vin.tangent.w);
  return out;
}

// Procedural pattern functions

fn hash2(p: vec2<f32>) -> vec2<f32> {
  let h = dot(p, vec2<f32>(127.1, 311.7));
  return fract(sin(vec2<f32>(h, h + 12.989)) * 43758.5453);
}

fn noise2(p: vec2<f32>) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  let a = hash2(i).x;
  let b = hash2(i + vec2<f32>(1.0, 0.0)).x;
  let c = hash2(i + vec2<f32>(0.0, 1.0)).x;
  let d = hash2(i + vec2<f32>(1.0, 1.0)).x;
  return 2.0 * (a + (b - a) * u.x + (c - a) * u.y + (a - b - c + d) * u.x * u.y) - 1.0;
}

fn fbm(p: vec2<f32>) -> f32 {
  var val = 0.0;
  var amp = 0.5;
  var freq = 1.0;
  for (var i = 0u; i < 4u; i++) {
    val += amp * noise2(p * freq);
    freq *= 2.0;
    amp *= 0.5;
  }
  return val;
}

fn procedural_pattern(pos: vec3<f32>, uv: vec2<f32>) -> vec3<f32> {
  let worldUV = pos.xz * params.patternScale;
  let time = params.time * params.animSpeed;

  // Animated grid glow
  let gridUV = fract(worldUV) - 0.5;
  let gridDist = max(abs(gridUV.x), abs(gridUV.y));
  let edge = 1.0 - smoothstep(0.0, params.edgeWidth, gridDist);
  let gridGlow = sin(edge * PI * 4.0 - time * 2.0) * 0.5 + 0.5;

  // Value noise overlay
  let n = fbm(worldUV + time * 0.1);
  let noiseVal = n * 0.5 + 0.5;

  // Sweeping bands
  let bands = sin(pos.x * 2.0 + pos.z * 1.5 + time) * 0.5 + 0.5;

  let baseMix = clamp(noiseVal * 0.6 + bands * 0.4, 0.0, 1.0);
  let base = mix(params.baseColor, params.accentColor, baseMix);

  // Glow
  let glowColor = vec4<f32>(1.0, 0.6, 0.1, 1.0);
  let glow = gridGlow * (sin(time * 1.5) * 0.3 + 0.7);

  return base.rgb + glow * glowColor.rgb;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let albedo = procedural_pattern(in.world_pos, in.uv);

  let V = normalize(camera.position - in.world_pos);
  let N = normalize(in.world_norm);

  let roughness = 0.35;
  let metallic = 0.0;
  let lit = calculate_pbr_lighting(albedo, N, V, in.world_pos, roughness, metallic);

  // subtle emissive boost
  let emissive = albedo * 0.08;

  return vec4<f32>(lit + emissive, 1.0);
}
`,S=256,p=class p extends E{constructor(){super(...arguments);n(this,"shaderId","procedural");n(this,"baseColor",new Float32Array([.15,.35,.75,1]));n(this,"accentColor",new Float32Array([1,.3,.1,1]));n(this,"patternScale",2);n(this,"time",0);n(this,"animSpeed",1);n(this,"edgeWidth",.04);n(this,"_device",null);n(this,"_buffer",null);n(this,"_bindGroup",null);n(this,"_dirty",!0);n(this,"_data",new Float32Array(S/4))}getShaderCode(e){return Y}getBindGroupLayout(e){let t=p._bglCache.get(e);return t||(t=e.createBindGroupLayout({label:"ProceduralMaterialBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),p._bglCache.set(e,t)),t}getBindGroup(e){return(!this._buffer||this._device!==e)&&(this._device=e,this._buffer=e.createBuffer({label:"ProceduralMaterialUniforms",size:S,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this._bindGroup=e.createBindGroup({label:"ProceduralMaterialBindGroup",layout:this.getBindGroupLayout(e),entries:[{binding:0,resource:{buffer:this._buffer}}]}),this._dirty=!0),this._bindGroup}update(e){if(!this._dirty||!this._buffer)return;const t=this._data;t.set(this.baseColor,0),t.set(this.accentColor,4),t[8]=this.patternScale,t[9]=this.time,t[10]=this.animSpeed,t[11]=this.edgeWidth,e.writeBuffer(this._buffer,0,t),this._dirty=!1}markDirty(){this._dirty=!0}destroy(){var e;(e=this._buffer)==null||e.destroy(),this._buffer=null,this._bindGroup=null}};n(p,"_bglCache",new WeakMap);let m=p;async function H(){const a=document.getElementById("canvas"),o=document.getElementById("fps");a.width=a.clientWidth,a.height=a.clientHeight;const e=await O.create(a),{device:t}=e,G=f.createPlane(t,30,30),V=f.createCube(t,1.5),I=f.createSphere(t,.9,24,24),U=f.createCone(t,.8,1.6,20),i=new m;i.baseColor.set([.1,.3,.8,1]),i.accentColor.set([1,.4,.1,1]),i.patternScale=1.5;const s=new m;s.baseColor.set([.6,0,.4,1]),s.accentColor.set([0,1,.6,1]),s.patternScale=2.5,s.animSpeed=1.5;const l=new m;l.baseColor.set([0,.2,.2,1]),l.accentColor.set([1,.8,0,1]),l.patternScale=3,l.edgeWidth=.08;const c=N.create(e,{clearColor:[.2,.2,.45,1]}),h=j.create(e,c.getShadowMap(0)),g=new L({position:new d(0,4,12)}),b=g.addComponent(R.createPerspective(60,.1,100,e.width/e.height)),v=W.create({yaw:0,pitch:0,speed:5,sensitivity:.002,pointerLock:!1});v.attach(a);const w=new q;w.addPass(h),w.addPass(c);async function _(){e.update();const D=e.backbufferView;o.textContent=`FPS: ${e.fps}`,v.update(g,e.deltaTime),b.updateRender(e),e.activeCamera=b,c.updateCamera(e);const y=new d(.4,-.7,-.5).normalize(),x=new d(0,1,0),T=x.sub(y.scale(25)),B=r.lookAt(T,x,new d(0,1,0)),C=r.orthographic(-12,12,-12,12,1,50).multiply(B),z={direction:y,intensity:1.5,color:new d(1,.95,.9),castShadows:!0,lightViewProj:C,shadowMap:c.getShadowMap(0)},u=4,M=[{mesh:G,modelMatrix:r.translation(0,-.5,0),normalMatrix:r.identity(),material:i},{mesh:V,modelMatrix:r.translation(0,1.5,0).multiply(r.rotationY(e.elapsedTime*40*Math.PI/180)),normalMatrix:r.identity(),material:s},{mesh:I,modelMatrix:r.translation(Math.sin(e.elapsedTime*.6)*u,1.5,Math.cos(e.elapsedTime*.6)*u).multiply(r.rotationY(e.elapsedTime*60*Math.PI/180)),normalMatrix:r.identity(),material:l},{mesh:U,modelMatrix:r.translation(Math.sin(e.elapsedTime*.6+Math.PI)*u,1.5,Math.cos(e.elapsedTime*.6+Math.PI)*u),normalMatrix:r.identity(),material:i}];i.time=e.elapsedTime,s.time=e.elapsedTime,l.time=e.elapsedTime,i.markDirty(),s.markDirty(),l.markDirty();const F=M.map(P=>({mesh:P.mesh,modelMatrix:P.modelMatrix}));h.setDrawItems(F),h.updateCamera(e,C),c.updateLights(e,z,[],[]),c.setDrawItems(M),c.setOutput(D,e.backbufferDepthView),w.execute(e),requestAnimationFrame(_)}_()}H();
