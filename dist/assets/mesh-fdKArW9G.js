var X=Object.defineProperty;var K=(x,t,e)=>t in x?X(x,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):x[t]=e;var l=(x,t,e)=>K(x,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function e(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(n){if(n.ep)return;n.ep=!0;const s=e(n);fetch(n.href,s)}})();const g=class g{constructor(t=0,e=0,r=0){l(this,"x");l(this,"y");l(this,"z");this.x=t,this.y=e,this.z=r}set(t,e,r){return this.x=t,this.y=e,this.z=r,this}clone(){return new g(this.x,this.y,this.z)}negate(){return new g(-this.x,-this.y,-this.z)}add(t){return new g(this.x+t.x,this.y+t.y,this.z+t.z)}sub(t){return new g(this.x-t.x,this.y-t.y,this.z-t.z)}scale(t){return new g(this.x*t,this.y*t,this.z*t)}mul(t){return new g(this.x*t.x,this.y*t.y,this.z*t.z)}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}cross(t){return new g(this.y*t.z-this.z*t.y,this.z*t.x-this.x*t.z,this.x*t.y-this.y*t.x)}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.lengthSq())}normalize(){const t=this.length();return t>0?this.scale(1/t):new g}lerp(t,e){return new g(this.x+(t.x-this.x)*e,this.y+(t.y-this.y)*e,this.z+(t.z-this.z)*e)}toArray(){return[this.x,this.y,this.z]}static zero(){return new g(0,0,0)}static one(){return new g(1,1,1)}static up(){return new g(0,1,0)}static down(){return new g(0,-1,0)}static forward(){return new g(0,0,-1)}static backward(){return new g(0,0,1)}static right(){return new g(1,0,0)}static left(){return new g(-1,0,0)}static fromArray(t,e=0){return new g(t[e],t[e+1],t[e+2])}};l(g,"ZERO",new g(0,0,0)),l(g,"ONE",new g(1,1,1)),l(g,"UP",new g(0,1,0)),l(g,"DOWN",new g(0,-1,0)),l(g,"FORWARD",new g(0,0,-1)),l(g,"BACKWARD",new g(0,0,1)),l(g,"RIGHT",new g(1,0,0)),l(g,"LEFT",new g(-1,0,0));let S=g;class L{constructor(t=0,e=0,r=0,n=0){l(this,"x");l(this,"y");l(this,"z");l(this,"w");this.x=t,this.y=e,this.z=r,this.w=n}set(t,e,r,n){return this.x=t,this.y=e,this.z=r,this.w=n,this}clone(){return new L(this.x,this.y,this.z,this.w)}add(t){return new L(this.x+t.x,this.y+t.y,this.z+t.z,this.w+t.w)}sub(t){return new L(this.x-t.x,this.y-t.y,this.z-t.z,this.w-t.w)}scale(t){return new L(this.x*t,this.y*t,this.z*t,this.w*t)}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.lengthSq())}toArray(){return[this.x,this.y,this.z,this.w]}static zero(){return new L(0,0,0,0)}static one(){return new L(1,1,1,1)}static fromArray(t,e=0){return new L(t[e],t[e+1],t[e+2],t[e+3])}}class y{constructor(t){l(this,"data");this.data=new Float32Array(16),t&&this.data.set(t)}clone(){return new y(this.data)}get(t,e){return this.data[t*4+e]}set(t,e,r){this.data[t*4+e]=r}multiply(t){const e=this.data,r=t.data,n=new Float32Array(16);for(let s=0;s<4;s++)for(let i=0;i<4;i++)n[s*4+i]=e[0*4+i]*r[s*4+0]+e[1*4+i]*r[s*4+1]+e[2*4+i]*r[s*4+2]+e[3*4+i]*r[s*4+3];return new y(n)}transformPoint(t){const e=this.data,r=e[0]*t.x+e[4]*t.y+e[8]*t.z+e[12],n=e[1]*t.x+e[5]*t.y+e[9]*t.z+e[13],s=e[2]*t.x+e[6]*t.y+e[10]*t.z+e[14],i=e[3]*t.x+e[7]*t.y+e[11]*t.z+e[15];return new S(r/i,n/i,s/i)}transformDirection(t){const e=this.data;return new S(e[0]*t.x+e[4]*t.y+e[8]*t.z,e[1]*t.x+e[5]*t.y+e[9]*t.z,e[2]*t.x+e[6]*t.y+e[10]*t.z)}transformVec4(t){const e=this.data;return new L(e[0]*t.x+e[4]*t.y+e[8]*t.z+e[12]*t.w,e[1]*t.x+e[5]*t.y+e[9]*t.z+e[13]*t.w,e[2]*t.x+e[6]*t.y+e[10]*t.z+e[14]*t.w,e[3]*t.x+e[7]*t.y+e[11]*t.z+e[15]*t.w)}transpose(){const t=this.data;return new y([t[0],t[4],t[8],t[12],t[1],t[5],t[9],t[13],t[2],t[6],t[10],t[14],t[3],t[7],t[11],t[15]])}invert(){const t=this.data,e=new Float32Array(16),r=t[0],n=t[1],s=t[2],i=t[3],o=t[4],a=t[5],h=t[6],u=t[7],c=t[8],f=t[9],d=t[10],p=t[11],w=t[12],m=t[13],v=t[14],z=t[15],M=r*a-n*o,E=r*h-s*o,D=r*u-i*o,P=n*h-s*a,B=n*u-i*a,A=s*u-i*h,N=c*m-f*w,U=c*v-d*w,F=c*z-p*w,T=f*v-d*m,I=f*z-p*m,V=d*z-p*v;let b=M*V-E*I+D*T+P*F-B*U+A*N;return b===0?y.identity():(b=1/b,e[0]=(a*V-h*I+u*T)*b,e[1]=(s*I-n*V-i*T)*b,e[2]=(m*A-v*B+z*P)*b,e[3]=(d*B-f*A-p*P)*b,e[4]=(h*F-o*V-u*U)*b,e[5]=(r*V-s*F+i*U)*b,e[6]=(v*D-w*A-z*E)*b,e[7]=(c*A-d*D+p*E)*b,e[8]=(o*I-a*F+u*N)*b,e[9]=(n*F-r*I-i*N)*b,e[10]=(w*B-m*D+z*M)*b,e[11]=(f*D-c*B-p*M)*b,e[12]=(a*U-o*T-h*N)*b,e[13]=(r*T-n*U+s*N)*b,e[14]=(m*E-w*P-v*M)*b,e[15]=(c*P-f*E+d*M)*b,new y(e))}normalMatrix(){const t=this.data,e=t[0],r=t[1],n=t[2],s=t[4],i=t[5],o=t[6],a=t[8],h=t[9],u=t[10],c=u*i-o*h,f=-u*s+o*a,d=h*s-i*a;let p=e*c+r*f+n*d;if(p===0)return y.identity();p=1/p;const w=new Float32Array(16);return w[0]=c*p,w[4]=(-u*r+n*h)*p,w[8]=(o*r-n*i)*p,w[1]=f*p,w[5]=(u*e-n*a)*p,w[9]=(-o*e+n*s)*p,w[2]=d*p,w[6]=(-h*e+r*a)*p,w[10]=(i*e-r*s)*p,w[15]=1,new y(w)}static identity(){return new y([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}static translation(t,e,r){return new y([1,0,0,0,0,1,0,0,0,0,1,0,t,e,r,1])}static scale(t,e,r){return new y([t,0,0,0,0,e,0,0,0,0,r,0,0,0,0,1])}static rotationX(t){const e=Math.cos(t),r=Math.sin(t);return new y([1,0,0,0,0,e,r,0,0,-r,e,0,0,0,0,1])}static rotationY(t){const e=Math.cos(t),r=Math.sin(t);return new y([e,0,-r,0,0,1,0,0,r,0,e,0,0,0,0,1])}static rotationZ(t){const e=Math.cos(t),r=Math.sin(t);return new y([e,r,0,0,-r,e,0,0,0,0,1,0,0,0,0,1])}static fromQuaternion(t,e,r,n){const s=t+t,i=e+e,o=r+r,a=t*s,h=e*s,u=e*i,c=r*s,f=r*i,d=r*o,p=n*s,w=n*i,m=n*o;return new y([1-u-d,h+m,c-w,0,h-m,1-a-d,f+p,0,c+w,f-p,1-a-u,0,0,0,0,1])}static perspective(t,e,r,n){const s=1/Math.tan(t/2),i=1/(r-n);return new y([s/e,0,0,0,0,s,0,0,0,0,n*i,-1,0,0,n*r*i,0])}static orthographic(t,e,r,n,s,i){const o=1/(t-e),a=1/(r-n),h=1/(s-i);return new y([-2*o,0,0,0,0,-2*a,0,0,0,0,h,0,(t+e)*o,(n+r)*a,s*h,1])}static lookAt(t,e,r){const n=e.sub(t).normalize(),s=n.cross(r).normalize(),i=s.cross(n);return new y([s.x,i.x,-n.x,0,s.y,i.y,-n.y,0,s.z,i.z,-n.z,0,-s.dot(t),-i.dot(t),n.dot(t),1])}static trs(t,e,r,n,s,i){const a=y.fromQuaternion(e,r,n,s).data;return new y([i.x*a[0],i.x*a[1],i.x*a[2],0,i.y*a[4],i.y*a[5],i.y*a[6],0,i.z*a[8],i.z*a[9],i.z*a[10],0,t.x,t.y,t.z,1])}}class _{constructor(t=0,e=0,r=0,n=1){l(this,"x");l(this,"y");l(this,"z");l(this,"w");this.x=t,this.y=e,this.z=r,this.w=n}clone(){return new _(this.x,this.y,this.z,this.w)}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.lengthSq())}normalize(){const t=this.length();return t>0?new _(this.x/t,this.y/t,this.z/t,this.w/t):_.identity()}conjugate(){return new _(-this.x,-this.y,-this.z,this.w)}multiply(t){const e=this.x,r=this.y,n=this.z,s=this.w,i=t.x,o=t.y,a=t.z,h=t.w;return new _(s*i+e*h+r*a-n*o,s*o-e*a+r*h+n*i,s*a+e*o-r*i+n*h,s*h-e*i-r*o-n*a)}rotateVec3(t){const e=this.x,r=this.y,n=this.z,s=this.w,i=s*t.x+r*t.z-n*t.y,o=s*t.y+n*t.x-e*t.z,a=s*t.z+e*t.y-r*t.x,h=-e*t.x-r*t.y-n*t.z;return new S(i*s+h*-e+o*-n-a*-r,o*s+h*-r+a*-e-i*-n,a*s+h*-n+i*-r-o*-e)}toMat4(){return y.fromQuaternion(this.x,this.y,this.z,this.w)}slerp(t,e){let r=this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w,n=t.x,s=t.y,i=t.z,o=t.w;if(r<0&&(r=-r,n=-n,s=-s,i=-i,o=-o),r>=1)return this.clone();const a=Math.acos(r),h=Math.sqrt(1-r*r);if(Math.abs(h)<.001)return new _(this.x*.5+n*.5,this.y*.5+s*.5,this.z*.5+i*.5,this.w*.5+o*.5);const u=Math.sin((1-e)*a)/h,c=Math.sin(e*a)/h;return new _(this.x*u+n*c,this.y*u+s*c,this.z*u+i*c,this.w*u+o*c)}static identity(){return new _(0,0,0,1)}static fromAxisAngle(t,e){const r=Math.sin(e/2),n=t.normalize();return new _(n.x*r,n.y*r,n.z*r,Math.cos(e/2))}static fromEuler(t,e,r){const n=Math.cos(t/2),s=Math.sin(t/2),i=Math.cos(e/2),o=Math.sin(e/2),a=Math.cos(r/2),h=Math.sin(r/2);return new _(s*i*a+n*o*h,n*o*a-s*i*h,n*i*h+s*o*a,n*i*a-s*o*h)}}const C=class C extends Uint32Array{constructor(e){super(6);l(this,"_seed");this._seed=0,this.seed=e??Date.now()}get seed(){return this[0]}set seed(e){this._seed=e,this[0]=e,this[1]=this[0]*1812433253+1>>>0,this[2]=this[1]*1812433253+1>>>0,this[3]=this[2]*1812433253+1>>>0,this[4]=0,this[5]=0}reset(){this.seed=this._seed}randomUint32(){let e=this[3];const r=this[0];return this[3]=this[2],this[2]=this[1],this[1]=r,e^=e>>>2,e^=e<<1,e^=r^r<<4,this[0]=e,this[4]=this[4]+362437>>>0,this[5]=e+this[4]>>>0,this[5]}randomFloat(e,r){const n=(this.randomUint32()&8388607)*11920930376163766e-23;return e===void 0?n:n*((r??1)-e)+e}randomDouble(e,r){const n=this.randomUint32()>>>5,s=this.randomUint32()>>>6,i=(n*67108864+s)*(1/9007199254740992);return e===void 0?i:i*((r??1)-e)+e}};l(C,"global",new C);let O=C;const W=new S(0,1,0),j=new S(1,0,0),$=3;class Y{constructor(t=0,e=0,r=5,n=.002,s=!1){l(this,"yaw");l(this,"pitch");l(this,"speed");l(this,"sensitivity");l(this,"inputForward",0);l(this,"inputStrafe",0);l(this,"inputUp",!1);l(this,"inputDown",!1);l(this,"inputFast",!1);l(this,"_keys",new Set);l(this,"_canvas",null);l(this,"_mouseBtn",!1);l(this,"_lastMX",0);l(this,"_lastMY",0);l(this,"_onMouseDown");l(this,"_onMouseUp");l(this,"_onMouseMove");l(this,"_onKeyDown");l(this,"_onKeyUp");l(this,"_onClick");l(this,"_onBlur");l(this,"usePointerLock",!1);this.yaw=t,this.pitch=e,this.speed=r,this.sensitivity=n,this.usePointerLock=s;const i=Math.PI/2-.001;this._onMouseDown=o=>{o.button===0&&(this._mouseBtn=!0,this._lastMX=o.clientX,this._lastMY=o.clientY)},this._onMouseUp=o=>{o.button===0&&(this._mouseBtn=!1)},this._onMouseMove=o=>{if(this.usePointerLock){if(document.pointerLockElement!==this._canvas)return;this.yaw-=o.movementX*this.sensitivity,this.pitch=Math.max(-i,Math.min(i,this.pitch+o.movementY*this.sensitivity))}else{if(!this._mouseBtn){this._lastMX=o.clientX,this._lastMY=o.clientY;return}const a=o.clientX-this._lastMX,h=o.clientY-this._lastMY;this._lastMX=o.clientX,this._lastMY=o.clientY,this.yaw-=a*this.sensitivity,this.pitch=Math.max(-i,Math.min(i,this.pitch+h*this.sensitivity))}},this._onKeyDown=o=>this._keys.add(o.code),this._onKeyUp=o=>this._keys.delete(o.code),this._onClick=()=>{var o;this.usePointerLock&&((o=this._canvas)==null||o.requestPointerLock())},this._onBlur=()=>{this._keys.clear(),this._mouseBtn=!1}}static create(t={}){return new Y(t.yaw??0,t.pitch??0,t.speed??5,t.sensitivity??.002,t.pointerLock??!1)}attach(t){this._canvas=t,t.addEventListener("click",this._onClick),document.addEventListener("mousedown",this._onMouseDown),document.addEventListener("mouseup",this._onMouseUp),document.addEventListener("mousemove",this._onMouseMove),document.addEventListener("keydown",this._onKeyDown),document.addEventListener("keyup",this._onKeyUp),window.addEventListener("blur",this._onBlur)}pressKey(t){this._keys.add(t)}applyLookDelta(t,e){const r=Math.PI/2-.001;this.yaw-=t*this.sensitivity,this.pitch=Math.max(-r,Math.min(r,this.pitch+e*this.sensitivity))}detach(){this._canvas&&(this._canvas.removeEventListener("click",this._onClick),document.removeEventListener("mousedown",this._onMouseDown),document.removeEventListener("mouseup",this._onMouseUp),document.removeEventListener("mousemove",this._onMouseMove),document.removeEventListener("keydown",this._onKeyDown),document.removeEventListener("keyup",this._onKeyUp),window.removeEventListener("blur",this._onBlur),this._canvas=null)}update(t,e){const r=Math.sin(this.yaw),n=Math.cos(this.yaw);let s=0,i=0,o=0;(this._keys.has("KeyW")||this._keys.has("ArrowUp"))&&(s-=r,o-=n),(this._keys.has("KeyS")||this._keys.has("ArrowDown"))&&(s+=r,o+=n),(this._keys.has("KeyA")||this._keys.has("ArrowLeft"))&&(s-=n,o+=r),(this._keys.has("KeyD")||this._keys.has("ArrowRight"))&&(s+=n,o-=r),this.inputForward!==0&&(s-=r*this.inputForward,o-=n*this.inputForward),this.inputStrafe!==0&&(s+=n*this.inputStrafe,o-=r*this.inputStrafe),(this._keys.has("Space")||this.inputUp)&&(i+=1),(this._keys.has("ShiftLeft")||this.inputDown)&&(i-=1);const a=Math.sqrt(s*s+i*i+o*o);if(a>0){const h=this._keys.has("ControlLeft")||this._keys.has("AltLeft")||this.inputFast,u=this.speed*(h?$:1)*e/a;t.position.x+=s*u,t.position.y+=i*u,t.position.z+=o*u}t.rotation=_.fromAxisAngle(W,this.yaw).multiply(_.fromAxisAngle(j,-this.pitch))}}const J=`/* Camera Shader Block */\r
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
`,Z=`/* Lighting Shader Block */\r
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
`,Q=`/* Model Shader Block */\r
\r
struct ModelUniforms {\r
  model: mat4x4<f32>,\r
  normalMatrix: mat4x4<f32>,\r
}\r
\r
@group(1) @binding(0) var<uniform> model: ModelUniforms;\r
`;function G(x,t){let e=x;return e=e.replace(/defined\s*\(\s*(\w+)\s*\)/g,(r,n)=>n in t?"1":"0"),e=e.replace(/\b([a-zA-Z_]\w*)\b/g,(r,n)=>n in t?t[n]||"1":"0"),!!new Function("return ("+e+")")()}function R(x,t){t=t??{};const e=x.split(`
`),r=[],n=[],s=()=>{for(let i=0;i<n.length;i++)if(!n[i].active)return!1;return!0};for(const i of e){const o=i.trim();if(!o.startsWith("#")){s()&&r.push(i);continue}const a=o.slice(1).trimStart(),h=a.match(/^(\w+)/);if(!h){s()&&r.push(i);continue}switch(h[1]){case"define":{if(s()){const c=a.slice(6).trimStart(),f=c.match(/^(\w+)/);if(f){const d=f[1],p=c.slice(d.length).trim();t[d]=p||"1"}}break}case"undef":{if(s()){const c=a.slice(5).trim();c&&delete t[c]}break}case"if":{const c=a.slice(2).trim(),d=s()?G(c,t):!1;n.push({active:d,taken:d,elseSeen:!1});break}case"ifdef":{const c=a.slice(5).trim(),d=s()&&t.hasOwnProperty(c);n.push({active:d,taken:d,elseSeen:!1});break}case"elif":{if(n.length===0)break;const c=n[n.length-1];if(c.elseSeen)break;const f=a.slice(4).trim(),p=n.length===1||n.slice(0,-1).every(w=>w.active)?G(f,t):!1;c.active=!c.taken&&p,c.taken=c.taken||p;break}case"else":{if(n.length===0)break;const c=n[n.length-1];if(c.elseSeen)break;c.active=!c.taken,c.elseSeen=!0;break}case"endif":{n.length>0&&n.pop();break}default:s()&&r.push(i);break}}return r.join(`
`)}const tt=Object.assign({"../shaders/modules/camera.wgsl":J,"../shaders/modules/lighting.wgsl":Z,"../shaders/modules/model.wgsl":Q});class et{constructor(){l(this,"_blocks",{});this._registerBuiltinShaderBlocks()}importShaderBlocks(t,e){return e??(e={}),t=R(t,e),t.replace(/^#import\s+"(.+?)\.wgsl"\s*$/gm,(r,n)=>this.getShaderBlock(n,e))}registerShaderBlock(t,e){this._blocks[t]=e}removeShaderBlock(t){delete this._blocks[t]}getShaderBlock(t,e){let r=this._blocks[t];return r?(r=R(r,e),r=r.replace(/^#import\s+"(.+?)\.wgsl"\s*$/gm,(n,s)=>this.getShaderBlock(s,e))):console.warn(`Missing shader block: ${t}`),r??`/* Missing shader block: ${t} */`}_registerBuiltinShaderBlocks(){for(const[t,e]of Object.entries(tt)){const r=t.split("/").pop().replace(".wgsl","");this.registerShaderBlock(r,e)}}}const H=class H{constructor(t,e,r,n,s,i,o){l(this,"device");l(this,"queue");l(this,"context");l(this,"format");l(this,"depthFormat");l(this,"canvas");l(this,"hdr");l(this,"enableErrorHandling");l(this,"shaderBlockManager");l(this,"_backbufferView",null);l(this,"_backbufferDepth",null);l(this,"_backbufferDepthView",null);this.device=t,this.queue=t.queue,this.context=e,this.format=r,this.depthFormat=n,this.canvas=s,this.hdr=i,this.enableErrorHandling=o,this.shaderBlockManager=new et}get width(){return this.canvas.width}get height(){return this.canvas.height}update(){var e;this._backbufferView=null;const t=this.canvas.width!==this.canvas.clientWidth||this.canvas.height!==this.canvas.clientHeight;return t&&(this.canvas.width=this.canvas.clientWidth,this.canvas.height=this.canvas.clientHeight,(e=this._backbufferDepth)==null||e.destroy(),this._backbufferDepth=null,this._backbufferDepthView=null),t}get backbufferTexture(){return this.context.getCurrentTexture()}get backbufferView(){return this._backbufferView||(this._backbufferView=this.backbufferTexture.createView()),this._backbufferView}get backbufferDepth(){return this._backbufferDepth||this._createBackbufferDepth(),this._backbufferDepth}get backbufferDepthView(){return this._backbufferDepth||this._createBackbufferDepth(),this._backbufferDepthView}_createBackbufferDepth(){var t;(t=this._backbufferDepth)==null||t.destroy(),this._backbufferDepth=null,this._backbufferDepthView=null,this.depthFormat&&(this._backbufferDepth=this.device.createTexture({size:{width:this.width,height:this.height},format:this.depthFormat,usage:GPUTextureUsage.RENDER_ATTACHMENT}),this._backbufferDepthView=this._backbufferDepth.createView())}static async create(t,e={}){var u;if(!navigator.gpu)throw new Error("WebGPU not supported");const r=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!r)throw new Error("No WebGPU adapter found");const n=[];for(const c of r.features)n.push(c);const s={};for(const[c,f]of Object.entries(r.limits))s[c]=f;const i=await r.requestDevice({requiredFeatures:n,requiredLimits:s});e.enableErrorHandling&&i.addEventListener("uncapturederror",c=>{const f=c.error;f instanceof GPUValidationError?console.error("[WebGPU Validation Error]",f.message):f instanceof GPUOutOfMemoryError?console.error("[WebGPU Out of Memory]"):console.error("[WebGPU Internal Error]",f)});const o=t.getContext("webgpu");let a,h=!1;try{o.configure({device:i,format:"rgba16float",alphaMode:"opaque",colorSpace:"display-p3",toneMapping:{mode:"extended"}});const c=o.getConfiguration();((u=c==null?void 0:c.toneMapping)==null?void 0:u.mode)==="extended"?(a="rgba16float",h=!0):a=navigator.gpu.getPreferredCanvasFormat()}catch{a=navigator.gpu.getPreferredCanvasFormat(),o.configure({device:i,format:a,alphaMode:"opaque"})}return t.width=t.clientWidth*devicePixelRatio,t.height=t.clientHeight*devicePixelRatio,new H(i,o,a,e.depthFormat??H.DEFAULT_DEPTH_FORMAT,t,h,e.enableErrorHandling??!1)}createShaderModule(t,e,r){return t=this.shaderBlockManager.importShaderBlocks(t,r),this.device.createShaderModule({code:t,label:e})}registerShaderBlock(t,e){this.shaderBlockManager.registerShaderBlock(t,e)}removeShaderBlock(t){this.shaderBlockManager.removeShaderBlock(t)}getShaderBlock(t,e){return this.shaderBlockManager.getShaderBlock(t,e)}createBuffer(t,e,r){return this.device.createBuffer({size:t,usage:e,label:r})}writeBuffer(t,e,r=0){e instanceof ArrayBuffer?this.queue.writeBuffer(t,r,e):this.queue.writeBuffer(t,r,e.buffer,e.byteOffset,e.byteLength)}pushInitErrorScope(){this.enableErrorHandling&&this.device.pushErrorScope("validation")}async popInitErrorScope(t){if(this.enableErrorHandling){const e=await this.device.popErrorScope();e&&(console.error(`[Init:${t}] Validation Error:`,e.message),console.trace())}}pushFrameErrorScope(){this.enableErrorHandling&&this.device.pushErrorScope("validation")}async popFrameErrorScope(){if(this.enableErrorHandling){const t=await this.device.popErrorScope();t&&(console.error("[Frame] Validation Error:",t.message),console.trace())}}pushPassErrorScope(t){this.enableErrorHandling&&(this.device.pushErrorScope("validation"),this.device.pushErrorScope("out-of-memory"),this.device.pushErrorScope("internal"))}async popPassErrorScope(t){if(this.enableErrorHandling){const e=await this.device.popErrorScope();e&&console.error(`[${t}] Internal Error:`,e),await this.device.popErrorScope()&&console.error(`[${t}] Out of Memory`);const n=await this.device.popErrorScope();n&&console.error(`[${t}] Validation Error:`,n.message)}}createDefaultCubemap(){const t=this.device.createTexture({size:{width:1,height:1,depthOrArrayLayers:6},format:"rgba16float",dimension:"2d",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST,mipLevelCount:1}),e=new Uint16Array([14336,14336,14336,15360]);for(let r=0;r<6;r++)this.queue.writeTexture({texture:t,origin:{x:0,y:0,z:r}},e,{bytesPerRow:8},{width:1,height:1});return t}createDefaultBrdfLUT(){const t=this.device.createTexture({size:{width:1,height:1},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),e=new Uint16Array([14336,14336,14336,15360]);return this.queue.writeTexture({texture:t},e,{bytesPerRow:8},{width:1,height:1}),t}};l(H,"DEFAULT_DEPTH_FORMAT","depth32float");let q=H;class nt{constructor(){l(this,"enabled",!0)}destroy(){}}const it=48,st=[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x3"},{shaderLocation:2,offset:24,format:"float32x2"},{shaderLocation:3,offset:32,format:"float32x4"}];class k{constructor(t,e,r){l(this,"vertexBuffer");l(this,"indexBuffer");l(this,"indexCount");this.vertexBuffer=t,this.indexBuffer=e,this.indexCount=r}destroy(){this.vertexBuffer.destroy(),this.indexBuffer.destroy()}static fromData(t,e,r){const n=t.createBuffer({label:"Mesh VertexBuffer",size:e.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});t.queue.writeBuffer(n,0,e.buffer,e.byteOffset,e.byteLength);const s=t.createBuffer({label:"Mesh IndexBuffer",size:r.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST});return t.queue.writeBuffer(s,0,r.buffer,r.byteOffset,r.byteLength),new k(n,s,r.length)}static addBox(t,e,r,n,s,i,o,a){const h=[{n:[0,0,-1],t:[-1,0,0,1],v:[[-i,-o,-a],[i,-o,-a],[i,o,-a],[-i,o,-a]]},{n:[0,0,1],t:[1,0,0,1],v:[[i,-o,a],[-i,-o,a],[-i,o,a],[i,o,a]]},{n:[-1,0,0],t:[0,0,-1,1],v:[[-i,-o,a],[-i,-o,-a],[-i,o,-a],[-i,o,a]]},{n:[1,0,0],t:[0,0,1,1],v:[[i,-o,-a],[i,-o,a],[i,o,a],[i,o,-a]]},{n:[0,1,0],t:[1,0,0,1],v:[[-i,o,-a],[i,o,-a],[i,o,a],[-i,o,a]]},{n:[0,-1,0],t:[1,0,0,1],v:[[-i,-o,a],[i,-o,a],[i,-o,-a],[-i,-o,-a]]}],u=[[0,1],[1,1],[1,0],[0,0]];for(const c of h){const f=t.length/12;for(let d=0;d<4;d++){const[p,w,m]=c.v[d];t.push(r+p,n+w,s+m,c.n[0],c.n[1],c.n[2],u[d][0],u[d][1],c.t[0],c.t[1],c.t[2],c.t[3])}e.push(f,f+2,f+1,f,f+3,f+2)}}static createBox(t,e,r,n){const s=[],i=[];return k.addBox(s,i,0,0,0,e/2,r/2,n/2),k.fromData(t,new Float32Array(s),new Uint32Array(i))}static createCube(t,e=1){const r=e/2,n=[{normal:[0,0,1],tangent:[1,0,0,1],verts:[[-r,-r,r],[r,-r,r],[r,r,r],[-r,r,r]]},{normal:[0,0,-1],tangent:[-1,0,0,1],verts:[[r,-r,-r],[-r,-r,-r],[-r,r,-r],[r,r,-r]]},{normal:[1,0,0],tangent:[0,0,-1,1],verts:[[r,-r,r],[r,-r,-r],[r,r,-r],[r,r,r]]},{normal:[-1,0,0],tangent:[0,0,1,1],verts:[[-r,-r,-r],[-r,-r,r],[-r,r,r],[-r,r,-r]]},{normal:[0,1,0],tangent:[1,0,0,1],verts:[[-r,r,r],[r,r,r],[r,r,-r],[-r,r,-r]]},{normal:[0,-1,0],tangent:[1,0,0,1],verts:[[-r,-r,-r],[r,-r,-r],[r,-r,r],[-r,-r,r]]}],s=[[0,1],[1,1],[1,0],[0,0]],i=[],o=[];let a=0;for(const h of n){for(let u=0;u<4;u++)i.push(...h.verts[u],...h.normal,...s[u],...h.tangent);o.push(a,a+1,a+2,a,a+2,a+3),a+=4}return k.fromData(t,new Float32Array(i),new Uint32Array(o))}static createSphere(t,e=.5,r=32,n=32){const s=[],i=[];for(let o=0;o<=r;o++){const a=o/r*Math.PI,h=Math.sin(a),u=Math.cos(a);for(let c=0;c<=n;c++){const f=c/n*Math.PI*2,d=Math.sin(f),p=Math.cos(f),w=h*p,m=u,v=h*d;s.push(w*e,m*e,v*e,w,m,v,c/n,o/r,-d,0,p,1)}}for(let o=0;o<r;o++)for(let a=0;a<n;a++){const h=o*(n+1)+a,u=h+n+1;i.push(h,h+1,u),i.push(h+1,u+1,u)}return k.fromData(t,new Float32Array(s),new Uint32Array(i))}static createCone(t,e=.5,r=1,n=16){const s=[],i=[],o=Math.sqrt(r*r+e*e),a=r/o,h=e/o;s.push(0,r,0,0,1,0,.5,0,1,0,0,1);const u=1;for(let d=0;d<=n;d++){const p=d/n*Math.PI*2,w=Math.cos(p),m=Math.sin(p);s.push(w*e,0,m*e,w*a,h,m*a,d/n,1,w,0,m,1)}for(let d=0;d<n;d++)i.push(0,u+d+1,u+d);const c=u+n+1;s.push(0,0,0,0,-1,0,.5,.5,1,0,0,1);const f=c+1;for(let d=0;d<=n;d++){const p=d/n*Math.PI*2,w=Math.cos(p),m=Math.sin(p);s.push(w*e,0,m*e,0,-1,0,.5+w*.5,.5+m*.5,1,0,0,1)}for(let d=0;d<n;d++)i.push(c,f+d,f+d+1);return k.fromData(t,new Float32Array(s),new Uint32Array(i))}static createPlane(t,e=10,r=10,n=1,s=1){const i=[],o=[];for(let a=0;a<=s;a++)for(let h=0;h<=n;h++){const u=(h/n-.5)*e,c=(a/s-.5)*r,f=h/n,d=a/s;i.push(u,0,c,0,1,0,f,d,1,0,0,1)}for(let a=0;a<s;a++)for(let h=0;h<n;h++){const u=a*(n+1)+h;o.push(u,u+n+1,u+1,u+1,u+n+1,u+n+2)}return k.fromData(t,new Float32Array(i),new Uint32Array(o))}}export{Y as C,y as M,_ as Q,q as R,S as V,nt as a,L as b,st as c,it as d,k as e,O as f};
