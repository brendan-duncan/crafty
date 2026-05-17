var L=Object.defineProperty;var E=(t,o,e)=>o in t?L(t,o,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[o]=e;var a=(t,o,e)=>E(t,typeof o!="symbol"?o+"":o,e);import{a as N,c as q,P as H,R as j}from"./render_graph-DOejAKJF.js";import{M as w,G as Y,V as p,C as $,a as X,c as r}from"./pass-CMGsmZgn.js";import{M as J}from"./material-xWpU3U9R.js";import{F as K}from"./forward_pass-BbV_GpRz.js";import{S as Q}from"./shadow_pass-CP3zbucd.js";import{T as Z}from"./tonemap_pass-CZlaPuJi.js";const ee=`// Forward procedural shader — custom material demo
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
`,V=256,h=class h extends J{constructor(){super(...arguments);a(this,"shaderId","procedural");a(this,"baseColor",new Float32Array([.15,.35,.75,1]));a(this,"accentColor",new Float32Array([1,.3,.1,1]));a(this,"patternScale",2);a(this,"time",0);a(this,"animSpeed",1);a(this,"edgeWidth",.04);a(this,"_device",null);a(this,"_buffer",null);a(this,"_bindGroup",null);a(this,"_dirty",!0);a(this,"_data",new Float32Array(V/4))}getShaderCode(e){return ee}getBindGroupLayout(e){let n=h._bglCache.get(e);return n||(n=e.createBindGroupLayout({label:"ProceduralMaterialBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),h._bglCache.set(e,n)),n}getBindGroup(e){return(!this._buffer||this._device!==e)&&(this._device=e,this._buffer=e.createBuffer({label:"ProceduralMaterialUniforms",size:V,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this._bindGroup=e.createBindGroup({label:"ProceduralMaterialBindGroup",layout:this.getBindGroupLayout(e),entries:[{binding:0,resource:{buffer:this._buffer}}]}),this._dirty=!0),this._bindGroup}update(e){if(!this._dirty||!this._buffer)return;const n=this._data;n.set(this.baseColor,0),n.set(this.accentColor,4),n[8]=this.patternScale,n[9]=this.time,n[10]=this.animSpeed,n[11]=this.edgeWidth,e.writeBuffer(this._buffer,0,n),this._dirty=!1}markDirty(){this._dirty=!0}destroy(){var e;(e=this._buffer)==null||e.destroy(),this._buffer=null,this._bindGroup=null}};a(h,"_bglCache",new WeakMap);let u=h;async function te(){const t=document.getElementById("canvas"),o=document.getElementById("fps");t.width=t.clientWidth,t.height=t.clientHeight;const e=await N.create(t,{enableErrorHandling:!0}),{device:n}=e,v=new H(n),T=w.createPlane(n,30,30),U=w.createCube(n,1.5),z=w.createSphere(n,.9,24,24),I=w.createCone(n,.8,1.6,20),i=new u;i.baseColor.set([.1,.3,.8,1]),i.accentColor.set([1,.4,.1,1]),i.patternScale=1.5;const s=new u;s.baseColor.set([.6,0,.4,1]),s.accentColor.set([0,1,.6,1]),s.patternScale=2.5,s.animSpeed=1.5;const l=new u;l.baseColor.set([0,.2,.2,1]),l.accentColor.set([1,.8,0,1]),l.patternScale=3,l.edgeWidth=.08;const b=new Y({position:new p(0,4,12)}),_=b.addComponent($.createPerspective(60,.1,100,e.width/e.height)),y=X.create({yaw:0,pitch:0,speed:5,sensitivity:.002,pointerLock:!1});y.attach(t);const B=Q.create(e),f=K.create(e),x=Z.create(e);x.updateParams(e,1,!1,!1);const R=q(null).attach();new ResizeObserver(()=>{const d=Math.max(1,Math.round(t.clientWidth*devicePixelRatio)),m=Math.max(1,Math.round(t.clientHeight*devicePixelRatio));d===t.width&&m===t.height||(t.width=d,t.height=m,v.trimUnused())}).observe(t);function M(){e.update(),o.textContent=`FPS: ${e.fps}`,y.update(b,e.deltaTime),_.updateRender(e),e.activeCamera=_;const d=new p(.4,-.7,-.5).normalize(),m=new p(0,1,0),D=r.lookAt(m.sub(d.scale(25)),m,p.UP),C=[{lightViewProj:r.orthographic(-12,12,-12,12,1,50).multiply(D),splitFar:100,depthRange:49,texelWorldSize:24/2048}],F={direction:d,intensity:1.5,color:new p(1,.95,.9),castShadows:!0,cascades:C},g=4,P=[{mesh:T,modelMatrix:r.translation(0,-.5,0),normalMatrix:r.identity(),material:i},{mesh:U,modelMatrix:r.translation(0,1.5,0).multiply(r.rotationY(e.elapsedTime*40*Math.PI/180)),normalMatrix:r.identity(),material:s},{mesh:z,modelMatrix:r.translation(Math.sin(e.elapsedTime*.6)*g,1.5,Math.cos(e.elapsedTime*.6)*g).multiply(r.rotationY(e.elapsedTime*60*Math.PI/180)),normalMatrix:r.identity(),material:l},{mesh:I,modelMatrix:r.translation(Math.sin(e.elapsedTime*.6+Math.PI)*g,1.5,Math.cos(e.elapsedTime*.6+Math.PI)*g),normalMatrix:r.identity(),material:i}];i.time=e.elapsedTime,s.time=e.elapsedTime,l.time=e.elapsedTime,i.markDirty(),s.markDirty(),l.markDirty();const O=P.map(S=>({mesh:S.mesh,modelMatrix:S.modelMatrix}));f.setDrawItems(P),f.updateCamera(e),f.updateLights(e,F,[],[]);const c=new j(e,v),W=c.setBackbuffer("canvas"),k=B.addToGraph(c,{cascades:C,drawItems:O}),A=f.addToGraph(c,{clearColor:[.2,.2,.45,1],shadowMapSource:k.shadowMap});x.addToGraph(c,{hdr:A.output,backbuffer:W});const G=c.compile();R.setGraph(c,G),c.execute(G),requestAnimationFrame(M)}M()}te().catch(t=>{document.body.innerHTML=`<pre style="color:red;padding:1rem">${t.message??t}</pre>`,console.error(t)});
