var Br=Object.defineProperty;var Gr=(m,n,e)=>n in m?Br(m,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):m[n]=e;var s=(m,n,e)=>Gr(m,typeof n!="symbol"?n+"":n,e);(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const a of t)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function e(t){const a={};return t.integrity&&(a.integrity=t.integrity),t.referrerPolicy&&(a.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?a.credentials="include":t.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(t){if(t.ep)return;t.ep=!0;const a=e(t);fetch(t.href,a)}})();const Dt="/assets/clear_sky-CyjsjiVR.hdr",Ft="/assets/simple_block_atlas-B-7juoTN.png",kt="/assets/simple_block_atlas_normal-BdCvGD-K.png",Ht="/assets/simple_block_atlas_mer-C_Oa_Ink.png",qt="/assets/simple_block_atlas_heightmap-BOV6qQJl.png";class T{constructor(n=0,e=0,r=0){s(this,"x");s(this,"y");s(this,"z");this.x=n,this.y=e,this.z=r}set(n,e,r){return this.x=n,this.y=e,this.z=r,this}clone(){return new T(this.x,this.y,this.z)}negate(){return new T(-this.x,-this.y,-this.z)}add(n){return new T(this.x+n.x,this.y+n.y,this.z+n.z)}sub(n){return new T(this.x-n.x,this.y-n.y,this.z-n.z)}scale(n){return new T(this.x*n,this.y*n,this.z*n)}mul(n){return new T(this.x*n.x,this.y*n.y,this.z*n.z)}dot(n){return this.x*n.x+this.y*n.y+this.z*n.z}cross(n){return new T(this.y*n.z-this.z*n.y,this.z*n.x-this.x*n.z,this.x*n.y-this.y*n.x)}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.lengthSq())}normalize(){const n=this.length();return n>0?this.scale(1/n):new T}lerp(n,e){return new T(this.x+(n.x-this.x)*e,this.y+(n.y-this.y)*e,this.z+(n.z-this.z)*e)}toArray(){return[this.x,this.y,this.z]}static zero(){return new T(0,0,0)}static one(){return new T(1,1,1)}static up(){return new T(0,1,0)}static forward(){return new T(0,0,-1)}static right(){return new T(1,0,0)}static fromArray(n,e=0){return new T(n[e],n[e+1],n[e+2])}}class j{constructor(n=0,e=0,r=0,t=0){s(this,"x");s(this,"y");s(this,"z");s(this,"w");this.x=n,this.y=e,this.z=r,this.w=t}set(n,e,r,t){return this.x=n,this.y=e,this.z=r,this.w=t,this}clone(){return new j(this.x,this.y,this.z,this.w)}add(n){return new j(this.x+n.x,this.y+n.y,this.z+n.z,this.w+n.w)}sub(n){return new j(this.x-n.x,this.y-n.y,this.z-n.z,this.w-n.w)}scale(n){return new j(this.x*n,this.y*n,this.z*n,this.w*n)}dot(n){return this.x*n.x+this.y*n.y+this.z*n.z+this.w*n.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.lengthSq())}toArray(){return[this.x,this.y,this.z,this.w]}static zero(){return new j(0,0,0,0)}static one(){return new j(1,1,1,1)}static fromArray(n,e=0){return new j(n[e],n[e+1],n[e+2],n[e+3])}}class L{constructor(n){s(this,"data");this.data=new Float32Array(16),n&&this.data.set(n)}clone(){return new L(this.data)}get(n,e){return this.data[n*4+e]}set(n,e,r){this.data[n*4+e]=r}multiply(n){const e=this.data,r=n.data,t=new Float32Array(16);for(let a=0;a<4;a++)for(let i=0;i<4;i++)t[a*4+i]=e[0*4+i]*r[a*4+0]+e[1*4+i]*r[a*4+1]+e[2*4+i]*r[a*4+2]+e[3*4+i]*r[a*4+3];return new L(t)}transformPoint(n){const e=this.data,r=e[0]*n.x+e[4]*n.y+e[8]*n.z+e[12],t=e[1]*n.x+e[5]*n.y+e[9]*n.z+e[13],a=e[2]*n.x+e[6]*n.y+e[10]*n.z+e[14],i=e[3]*n.x+e[7]*n.y+e[11]*n.z+e[15];return new T(r/i,t/i,a/i)}transformDirection(n){const e=this.data;return new T(e[0]*n.x+e[4]*n.y+e[8]*n.z,e[1]*n.x+e[5]*n.y+e[9]*n.z,e[2]*n.x+e[6]*n.y+e[10]*n.z)}transformVec4(n){const e=this.data;return new j(e[0]*n.x+e[4]*n.y+e[8]*n.z+e[12]*n.w,e[1]*n.x+e[5]*n.y+e[9]*n.z+e[13]*n.w,e[2]*n.x+e[6]*n.y+e[10]*n.z+e[14]*n.w,e[3]*n.x+e[7]*n.y+e[11]*n.z+e[15]*n.w)}transpose(){const n=this.data;return new L([n[0],n[4],n[8],n[12],n[1],n[5],n[9],n[13],n[2],n[6],n[10],n[14],n[3],n[7],n[11],n[15]])}invert(){const n=this.data,e=new Float32Array(16),r=n[0],t=n[1],a=n[2],i=n[3],c=n[4],l=n[5],o=n[6],u=n[7],p=n[8],d=n[9],f=n[10],_=n[11],h=n[12],v=n[13],g=n[14],b=n[15],x=r*l-t*c,y=r*o-a*c,w=r*u-i*c,S=t*o-a*l,B=t*u-i*l,P=a*u-i*o,E=p*v-d*h,G=p*g-f*h,U=p*b-_*h,M=d*g-f*v,R=d*b-_*v,N=f*b-_*g;let A=x*N-y*R+w*M+S*U-B*G+P*E;return A===0?L.identity():(A=1/A,e[0]=(l*N-o*R+u*M)*A,e[1]=(a*R-t*N-i*M)*A,e[2]=(v*P-g*B+b*S)*A,e[3]=(f*B-d*P-_*S)*A,e[4]=(o*U-c*N-u*G)*A,e[5]=(r*N-a*U+i*G)*A,e[6]=(g*w-h*P-b*y)*A,e[7]=(p*P-f*w+_*y)*A,e[8]=(c*R-l*U+u*E)*A,e[9]=(t*U-r*R-i*E)*A,e[10]=(h*B-v*w+b*x)*A,e[11]=(d*w-p*B-_*x)*A,e[12]=(l*G-c*M-o*E)*A,e[13]=(r*M-t*G+a*E)*A,e[14]=(v*y-h*S-g*x)*A,e[15]=(p*S-d*y+f*x)*A,new L(e))}normalMatrix(){const n=this.data,e=n[0],r=n[1],t=n[2],a=n[4],i=n[5],c=n[6],l=n[8],o=n[9],u=n[10],p=u*i-c*o,d=-u*a+c*l,f=o*a-i*l;let _=e*p+r*d+t*f;if(_===0)return L.identity();_=1/_;const h=new Float32Array(16);return h[0]=p*_,h[4]=(-u*r+t*o)*_,h[8]=(c*r-t*i)*_,h[1]=d*_,h[5]=(u*e-t*l)*_,h[9]=(-c*e+t*a)*_,h[2]=f*_,h[6]=(-o*e+r*l)*_,h[10]=(i*e-r*a)*_,h[15]=1,new L(h)}static identity(){return new L([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}static translation(n,e,r){return new L([1,0,0,0,0,1,0,0,0,0,1,0,n,e,r,1])}static scale(n,e,r){return new L([n,0,0,0,0,e,0,0,0,0,r,0,0,0,0,1])}static rotationX(n){const e=Math.cos(n),r=Math.sin(n);return new L([1,0,0,0,0,e,r,0,0,-r,e,0,0,0,0,1])}static rotationY(n){const e=Math.cos(n),r=Math.sin(n);return new L([e,0,-r,0,0,1,0,0,r,0,e,0,0,0,0,1])}static rotationZ(n){const e=Math.cos(n),r=Math.sin(n);return new L([e,r,0,0,-r,e,0,0,0,0,1,0,0,0,0,1])}static fromQuaternion(n,e,r,t){const a=n+n,i=e+e,c=r+r,l=n*a,o=e*a,u=e*i,p=r*a,d=r*i,f=r*c,_=t*a,h=t*i,v=t*c;return new L([1-u-f,o+v,p-h,0,o-v,1-l-f,d+_,0,p+h,d-_,1-l-u,0,0,0,0,1])}static perspective(n,e,r,t){const a=1/Math.tan(n/2),i=1/(r-t);return new L([a/e,0,0,0,0,a,0,0,0,0,t*i,-1,0,0,t*r*i,0])}static orthographic(n,e,r,t,a,i){const c=1/(n-e),l=1/(r-t),o=1/(a-i);return new L([-2*c,0,0,0,0,-2*l,0,0,0,0,o,0,(n+e)*c,(t+r)*l,a*o,1])}static lookAt(n,e,r){const t=e.sub(n).normalize(),a=t.cross(r).normalize(),i=a.cross(t);return new L([a.x,i.x,-t.x,0,a.y,i.y,-t.y,0,a.z,i.z,-t.z,0,-a.dot(n),-i.dot(n),t.dot(n),1])}static trs(n,e,r,t,a,i){const l=L.fromQuaternion(e,r,t,a).data;return new L([i.x*l[0],i.x*l[1],i.x*l[2],0,i.y*l[4],i.y*l[5],i.y*l[6],0,i.z*l[8],i.z*l[9],i.z*l[10],0,n.x,n.y,n.z,1])}}class k{constructor(n=0,e=0,r=0,t=1){s(this,"x");s(this,"y");s(this,"z");s(this,"w");this.x=n,this.y=e,this.z=r,this.w=t}clone(){return new k(this.x,this.y,this.z,this.w)}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.lengthSq())}normalize(){const n=this.length();return n>0?new k(this.x/n,this.y/n,this.z/n,this.w/n):k.identity()}conjugate(){return new k(-this.x,-this.y,-this.z,this.w)}multiply(n){const e=this.x,r=this.y,t=this.z,a=this.w,i=n.x,c=n.y,l=n.z,o=n.w;return new k(a*i+e*o+r*l-t*c,a*c-e*l+r*o+t*i,a*l+e*c-r*i+t*o,a*o-e*i-r*c-t*l)}rotateVec3(n){const e=this.x,r=this.y,t=this.z,a=this.w,i=a*n.x+r*n.z-t*n.y,c=a*n.y+t*n.x-e*n.z,l=a*n.z+e*n.y-r*n.x,o=-e*n.x-r*n.y-t*n.z;return new T(i*a+o*-e+c*-t-l*-r,c*a+o*-r+l*-e-i*-t,l*a+o*-t+i*-r-c*-e)}toMat4(){return L.fromQuaternion(this.x,this.y,this.z,this.w)}slerp(n,e){let r=this.x*n.x+this.y*n.y+this.z*n.z+this.w*n.w,t=n.x,a=n.y,i=n.z,c=n.w;if(r<0&&(r=-r,t=-t,a=-a,i=-i,c=-c),r>=1)return this.clone();const l=Math.acos(r),o=Math.sqrt(1-r*r);if(Math.abs(o)<.001)return new k(this.x*.5+t*.5,this.y*.5+a*.5,this.z*.5+i*.5,this.w*.5+c*.5);const u=Math.sin((1-e)*l)/o,p=Math.sin(e*l)/o;return new k(this.x*u+t*p,this.y*u+a*p,this.z*u+i*p,this.w*u+c*p)}static identity(){return new k(0,0,0,1)}static fromAxisAngle(n,e){const r=Math.sin(e/2),t=n.normalize();return new k(t.x*r,t.y*r,t.z*r,Math.cos(e/2))}static fromEuler(n,e,r){const t=Math.cos(n/2),a=Math.sin(n/2),i=Math.cos(e/2),c=Math.sin(e/2),l=Math.cos(r/2),o=Math.sin(r/2);return new k(a*i*l+t*c*o,t*c*l-a*i*o,t*i*o+a*c*l,t*i*l-a*c*o)}}const ce=class ce extends Uint32Array{constructor(e){super(6);s(this,"_seed");this._seed=0,this.seed=e??Date.now()}get seed(){return this[0]}set seed(e){this._seed=e,this[0]=e,this[1]=this[0]*1812433253+1>>>0,this[2]=this[1]*1812433253+1>>>0,this[3]=this[2]*1812433253+1>>>0,this[4]=0,this[5]=0}reset(){this.seed=this._seed}randomUint32(){let e=this[3];const r=this[0];return this[3]=this[2],this[2]=this[1],this[1]=r,e^=e>>>2,e^=e<<1,e^=r^r<<4,this[0]=e,this[4]=this[4]+362437>>>0,this[5]=e+this[4]>>>0,this[5]}randomFloat(e,r){const t=(this.randomUint32()&8388607)*11920930376163766e-23;return e===void 0?t:t*((r??1)-e)+e}randomDouble(e,r){const t=this.randomUint32()>>>5,a=this.randomUint32()>>>6,i=(t*67108864+a)*(1/9007199254740992);return e===void 0?i:i*((r??1)-e)+e}};s(ce,"global",new ce);let we=ce;class J{constructor(){s(this,"gameObject")}onAttach(){}onDetach(){}update(n){}}class jt{constructor(n="GameObject"){s(this,"name");s(this,"position");s(this,"rotation");s(this,"scale");s(this,"children",[]);s(this,"parent",null);s(this,"_components",[]);this.name=n,this.position=T.zero(),this.rotation=k.identity(),this.scale=T.one()}addComponent(n){return n.gameObject=this,this._components.push(n),n.onAttach(),n}getComponent(n){for(const e of this._components)if(e instanceof n)return e;return null}getComponents(n){return this._components.filter(e=>e instanceof n)}removeComponent(n){const e=this._components.indexOf(n);e!==-1&&(n.onDetach(),this._components.splice(e,1))}addChild(n){n.parent=this,this.children.push(n)}localToWorld(){const n=L.trs(this.position,this.rotation.x,this.rotation.y,this.rotation.z,this.rotation.w,this.scale);return this.parent?this.parent.localToWorld().multiply(n):n}update(n){for(const e of this._components)e.update(n);for(const e of this.children)e.update(n)}}class Sr extends J{constructor(e=60,r=.1,t=1e3,a=16/9){super();s(this,"fov");s(this,"near");s(this,"far");s(this,"aspect");this.fov=e*(Math.PI/180),this.near=r,this.far=t,this.aspect=a}projectionMatrix(){return L.perspective(this.fov,this.aspect,this.near,this.far)}viewMatrix(){return this.gameObject.localToWorld().invert()}viewProjectionMatrix(){return this.projectionMatrix().multiply(this.viewMatrix())}position(){const e=this.gameObject.localToWorld();return new T(e.data[12],e.data[13],e.data[14])}frustumCornersWorld(){const e=this.viewProjectionMatrix().invert();return[[-1,-1,0],[1,-1,0],[-1,1,0],[1,1,0],[-1,-1,1],[1,-1,1],[-1,1,1],[1,1,1]].map(([t,a,i])=>e.transformPoint(new T(t,a,i)))}}class Pr extends J{constructor(e=new T(.3,-1,.5),r=T.one(),t=1,a=3){super();s(this,"direction");s(this,"color");s(this,"intensity");s(this,"numCascades");this.direction=e.normalize(),this.color=r,this.intensity=t,this.numCascades=a}computeCascadeMatrices(e,r){const t=r??e.far,a=this._computeSplitDepths(e.near,t,this.numCascades),i=[];for(let c=0;c<this.numCascades;c++){const l=c===0?e.near:a[c-1],o=a[c],u=this._frustumCornersForSplit(e,l,o),p=u.reduce((R,N)=>R.add(N),T.zero()).scale(1/8),d=this.direction.normalize(),f=L.lookAt(p.sub(d),p,new T(0,1,0)),_=2048;let h=0;for(const R of u)h=Math.max(h,R.sub(p).length());let v=2*h/_;h=Math.ceil(h/v)*v,h*=_/(_-2),v=2*h/_;let g=1/0,b=-1/0;for(const R of u){const N=f.transformPoint(R);g=Math.min(g,N.z),b=Math.max(b,N.z)}const x=Math.min((b-g)*2,256);g-=x,b+=x;let y=L.orthographic(-h,h,-h,h,-b,-g);const S=y.multiply(f).transformPoint(T.zero()),B=S.x*.5+.5,P=.5-S.y*.5,E=Math.round(B*_)/_,G=Math.round(P*_)/_,U=(E-B)*2,M=-(G-P)*2;y.set(3,0,y.get(3,0)+U),y.set(3,1,y.get(3,1)+M),i.push({lightViewProj:y.multiply(f),splitFar:o,depthRange:b-g,texelWorldSize:v})}return i}_computeSplitDepths(e,r,t){const i=[];for(let c=1;c<=t;c++){const l=e+(r-e)*(c/t),o=e*Math.pow(r/e,c/t);i.push(.75*o+(1-.75)*l)}return i}_frustumCornersForSplit(e,r,t){const a=e.near,i=e.far;e.near=r,e.far=t;const c=e.frustumCornersWorld();return e.near=a,e.far=i,c}}class Tr extends J{constructor(e,r={}){super();s(this,"mesh");s(this,"material");s(this,"castShadow",!0);this.mesh=e,this.material={albedo:r.albedo??[1,1,1,1],roughness:r.roughness??.5,metallic:r.metallic??0,uvOffset:r.uvOffset,uvScale:r.uvScale,uvTile:r.uvTile,albedoMap:r.albedoMap,normalMap:r.normalMap,merMap:r.merMap}}}class Wt{constructor(){s(this,"gameObjects",[])}add(n){this.gameObjects.push(n)}remove(n){const e=this.gameObjects.indexOf(n);e!==-1&&this.gameObjects.splice(e,1)}update(n){for(const e of this.gameObjects)e.update(n)}findCamera(){for(const n of this.gameObjects){const e=n.getComponent(Sr);if(e)return e}return null}findDirectionalLight(){for(const n of this.gameObjects){const e=n.getComponent(Pr);if(e)return e}return null}collectMeshRenderers(){const n=[];for(const e of this.gameObjects)this._collectMeshRenderersRecursive(e,n);return n}_collectMeshRenderersRecursive(n,e){const r=n.getComponent(Tr);r&&e.push(r);for(const t of n.children)this._collectMeshRenderersRecursive(t,e)}getComponents(n){const e=[];for(const r of this.gameObjects){const t=r.getComponent(n);t&&e.push(t)}return e}}const Ur=[new T(1,0,0),new T(-1,0,0),new T(0,1,0),new T(0,-1,0),new T(0,0,1),new T(0,0,-1)],Mr=[new T(0,-1,0),new T(0,-1,0),new T(0,0,1),new T(0,0,-1),new T(0,-1,0),new T(0,-1,0)];class Xt extends J{constructor(){super(...arguments);s(this,"color",T.one());s(this,"intensity",1);s(this,"radius",10);s(this,"castShadow",!1)}worldPosition(){return this.gameObject.localToWorld().transformPoint(T.zero())}cubeFaceViewProjs(e=.05){const r=this.worldPosition(),t=L.perspective(Math.PI/2,1,e,this.radius),a=new Array(6);for(let i=0;i<6;i++)a[i]=t.multiply(L.lookAt(r,r.add(Ur[i]),Mr[i]));return a}}class $t extends J{constructor(){super(...arguments);s(this,"color",T.one());s(this,"intensity",1);s(this,"range",20);s(this,"innerAngle",15);s(this,"outerAngle",30);s(this,"castShadow",!1);s(this,"projectionTexture",null)}worldPosition(){return this.gameObject.localToWorld().transformPoint(T.zero())}worldDirection(){return this.gameObject.localToWorld().transformDirection(new T(0,0,-1)).normalize()}lightViewProj(e=.1){const r=this.worldPosition(),t=this.worldDirection(),a=Math.abs(t.y)>.99?new T(1,0,0):new T(0,1,0),i=L.lookAt(r,r.add(t),a);return L.perspective(this.outerAngle*2*Math.PI/180,1,e,this.range).multiply(i)}}const Ar=new T(0,1,0),Er=new T(1,0,0),Rr=3;class Yt{constructor(n=0,e=0,r=5,t=.002){s(this,"yaw");s(this,"pitch");s(this,"speed");s(this,"sensitivity");s(this,"_keys",new Set);s(this,"_canvas",null);s(this,"_onMouseMove");s(this,"_onKeyDown");s(this,"_onKeyUp");s(this,"_onClick");this.yaw=n,this.pitch=e,this.speed=r,this.sensitivity=t;const a=Math.PI/2-.001;this._onMouseMove=i=>{document.pointerLockElement===this._canvas&&(this.yaw-=i.movementX*this.sensitivity,this.pitch=Math.max(-a,Math.min(a,this.pitch+i.movementY*this.sensitivity)))},this._onKeyDown=i=>this._keys.add(i.code),this._onKeyUp=i=>this._keys.delete(i.code),this._onClick=()=>{var i;return(i=this._canvas)==null?void 0:i.requestPointerLock()}}attach(n){this._canvas=n,n.addEventListener("click",this._onClick),document.addEventListener("mousemove",this._onMouseMove),document.addEventListener("keydown",this._onKeyDown),document.addEventListener("keyup",this._onKeyUp)}pressKey(n){this._keys.add(n)}detach(){this._canvas&&(this._canvas.removeEventListener("click",this._onClick),document.removeEventListener("mousemove",this._onMouseMove),document.removeEventListener("keydown",this._onKeyDown),document.removeEventListener("keyup",this._onKeyUp),this._canvas=null)}update(n,e){const r=Math.sin(this.yaw),t=Math.cos(this.yaw);let a=0,i=0,c=0;(this._keys.has("KeyW")||this._keys.has("ArrowUp"))&&(a-=r,c-=t),(this._keys.has("KeyS")||this._keys.has("ArrowDown"))&&(a+=r,c+=t),(this._keys.has("KeyA")||this._keys.has("ArrowLeft"))&&(a-=t,c+=r),(this._keys.has("KeyD")||this._keys.has("ArrowRight"))&&(a+=t,c-=r),this._keys.has("Space")&&(i+=1),this._keys.has("ShiftLeft")&&(i-=1);const l=Math.sqrt(a*a+i*i+c*c);if(l>0){const o=this._keys.has("ControlLeft")||this._keys.has("AltLeft"),u=this.speed*(o?Rr:1)*e/l;n.position.x+=a*u,n.position.y+=i*u,n.position.z+=c*u}n.rotation=k.fromAxisAngle(Ar,this.yaw).multiply(k.fromAxisAngle(Er,-this.pitch))}}class Ye{constructor(n,e,r,t,a,i){s(this,"device");s(this,"queue");s(this,"context");s(this,"format");s(this,"canvas");s(this,"hdr");s(this,"enableErrorHandling");this.device=n,this.queue=n.queue,this.context=e,this.format=r,this.canvas=t,this.hdr=a,this.enableErrorHandling=i}get width(){return this.canvas.width}get height(){return this.canvas.height}static async create(n,e={}){if(!navigator.gpu)throw new Error("WebGPU not supported");const r=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!r)throw new Error("No WebGPU adapter found");const t=await r.requestDevice({requiredFeatures:[]});e.enableErrorHandling&&t.addEventListener("uncapturederror",l=>{const o=l.error;o instanceof GPUValidationError?console.error("[WebGPU Validation Error]",o.message):o instanceof GPUOutOfMemoryError?console.error("[WebGPU Out of Memory]"):console.error("[WebGPU Internal Error]",o)});const a=n.getContext("webgpu");let i,c=!1;try{a.configure({device:t,format:"rgba16float",alphaMode:"opaque",colorSpace:"display-p3",toneMapping:{mode:"extended"}}),i="rgba16float",c=!0}catch{i=navigator.gpu.getPreferredCanvasFormat(),a.configure({device:t,format:i,alphaMode:"opaque"})}return n.width=n.clientWidth*devicePixelRatio,n.height=n.clientHeight*devicePixelRatio,new Ye(t,a,i,n,c,e.enableErrorHandling??!1)}getCurrentTexture(){return this.context.getCurrentTexture()}createBuffer(n,e,r){return this.device.createBuffer({size:n,usage:e,label:r})}writeBuffer(n,e,r=0){e instanceof ArrayBuffer?this.queue.writeBuffer(n,r,e):this.queue.writeBuffer(n,r,e.buffer,e.byteOffset,e.byteLength)}pushInitErrorScope(){this.enableErrorHandling&&this.device.pushErrorScope("validation")}async popInitErrorScope(n){if(this.enableErrorHandling){const e=await this.device.popErrorScope();e&&(console.error(`[Init:${n}] Validation Error:`,e.message),console.trace())}}pushFrameErrorScope(){this.enableErrorHandling&&this.device.pushErrorScope("validation")}async popFrameErrorScope(){if(this.enableErrorHandling){const n=await this.device.popErrorScope();n&&(console.error("[Frame] Validation Error:",n.message),console.trace())}}pushPassErrorScope(n){this.enableErrorHandling&&(this.device.pushErrorScope("validation"),this.device.pushErrorScope("out-of-memory"),this.device.pushErrorScope("internal"))}async popPassErrorScope(n){if(this.enableErrorHandling){const e=await this.device.popErrorScope();e&&console.error(`[${n}] Internal Error:`,e),await this.device.popErrorScope()&&console.error(`[${n}] Out of Memory`);const t=await this.device.popErrorScope();t&&console.error(`[${n}] Validation Error:`,t.message)}}}class D{constructor(){s(this,"enabled",!0)}destroy(){}}class Ze{constructor(n,e,r,t,a){s(this,"albedoRoughness");s(this,"normalMetallic");s(this,"depth");s(this,"albedoRoughnessView");s(this,"normalMetallicView");s(this,"depthView");s(this,"width");s(this,"height");this.albedoRoughness=n,this.normalMetallic=e,this.depth=r,this.width=t,this.height=a,this.albedoRoughnessView=n.createView(),this.normalMetallicView=e.createView(),this.depthView=r.createView()}static create(n){const{device:e,width:r,height:t}=n,a=e.createTexture({label:"GBuffer AlbedoRoughness",size:{width:r,height:t},format:"rgba8unorm",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),i=e.createTexture({label:"GBuffer NormalMetallic",size:{width:r,height:t},format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),c=e.createTexture({label:"GBuffer Depth",size:{width:r,height:t},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING});return new Ze(a,i,c,r,t)}destroy(){this.albedoRoughness.destroy(),this.normalMetallic.destroy(),this.depth.destroy()}}const ge=48,ve=[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x3"},{shaderLocation:2,offset:24,format:"float32x2"},{shaderLocation:3,offset:32,format:"float32x4"}];class Z{constructor(n,e,r){s(this,"vertexBuffer");s(this,"indexBuffer");s(this,"indexCount");this.vertexBuffer=n,this.indexBuffer=e,this.indexCount=r}destroy(){this.vertexBuffer.destroy(),this.indexBuffer.destroy()}static fromData(n,e,r){const t=n.createBuffer({label:"Mesh VertexBuffer",size:e.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});n.queue.writeBuffer(t,0,e.buffer,e.byteOffset,e.byteLength);const a=n.createBuffer({label:"Mesh IndexBuffer",size:r.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST});return n.queue.writeBuffer(a,0,r.buffer,r.byteOffset,r.byteLength),new Z(t,a,r.length)}static createCube(n,e=1){const r=e/2,t=[{normal:[0,0,1],tangent:[1,0,0,1],verts:[[-r,-r,r],[r,-r,r],[r,r,r],[-r,r,r]]},{normal:[0,0,-1],tangent:[-1,0,0,1],verts:[[r,-r,-r],[-r,-r,-r],[-r,r,-r],[r,r,-r]]},{normal:[1,0,0],tangent:[0,0,-1,1],verts:[[r,-r,r],[r,-r,-r],[r,r,-r],[r,r,r]]},{normal:[-1,0,0],tangent:[0,0,1,1],verts:[[-r,-r,-r],[-r,-r,r],[-r,r,r],[-r,r,-r]]},{normal:[0,1,0],tangent:[1,0,0,1],verts:[[-r,r,r],[r,r,r],[r,r,-r],[-r,r,-r]]},{normal:[0,-1,0],tangent:[1,0,0,1],verts:[[-r,-r,-r],[r,-r,-r],[r,-r,r],[-r,-r,r]]}],a=[[0,1],[1,1],[1,0],[0,0]],i=[],c=[];let l=0;for(const o of t){for(let u=0;u<4;u++)i.push(...o.verts[u],...o.normal,...a[u],...o.tangent);c.push(l,l+1,l+2,l,l+2,l+3),l+=4}return Z.fromData(n,new Float32Array(i),new Uint32Array(c))}static createSphere(n,e=.5,r=32,t=32){const a=[],i=[];for(let c=0;c<=r;c++){const l=c/r*Math.PI,o=Math.sin(l),u=Math.cos(l);for(let p=0;p<=t;p++){const d=p/t*Math.PI*2,f=Math.sin(d),_=Math.cos(d),h=o*_,v=u,g=o*f;a.push(h*e,v*e,g*e,h,v,g,p/t,c/r,-f,0,_,1)}}for(let c=0;c<r;c++)for(let l=0;l<t;l++){const o=c*(t+1)+l,u=o+t+1;i.push(o,o+1,u),i.push(o+1,u+1,u)}return Z.fromData(n,new Float32Array(a),new Uint32Array(i))}static createCone(n,e=.5,r=1,t=16){const a=[],i=[],c=Math.sqrt(r*r+e*e),l=r/c,o=e/c;a.push(0,r,0,0,1,0,.5,0,1,0,0,1);const u=1;for(let f=0;f<=t;f++){const _=f/t*Math.PI*2,h=Math.cos(_),v=Math.sin(_);a.push(h*e,0,v*e,h*l,o,v*l,f/t,1,h,0,v,1)}for(let f=0;f<t;f++)i.push(0,u+f+1,u+f);const p=u+t+1;a.push(0,0,0,0,-1,0,.5,.5,1,0,0,1);const d=p+1;for(let f=0;f<=t;f++){const _=f/t*Math.PI*2,h=Math.cos(_),v=Math.sin(_);a.push(h*e,0,v*e,0,-1,0,.5+h*.5,.5+v*.5,1,0,0,1)}for(let f=0;f<t;f++)i.push(p,d+f,d+f+1);return Z.fromData(n,new Float32Array(a),new Uint32Array(i))}static createPlane(n,e=10,r=10,t=1,a=1){const i=[],c=[];for(let l=0;l<=a;l++)for(let o=0;o<=t;o++){const u=(o/t-.5)*e,p=(l/a-.5)*r,d=o/t,f=l/a;i.push(u,0,p,0,1,0,d,f,1,0,0,1)}for(let l=0;l<a;l++)for(let o=0;o<t;o++){const u=l*(t+1)+o;c.push(u,u+t+1,u+1,u+1,u+t+1,u+t+2)}return Z.fromData(n,new Float32Array(i),new Uint32Array(c))}}const Lr=`// Shadow map generation — depth-only, one cascade at a time.\r
\r
struct ShadowUniforms {\r
  lightViewProj: mat4x4<f32>,\r
}\r
\r
struct ModelUniforms {\r
  model: mat4x4<f32>,\r
}\r
\r
@group(0) @binding(0) var<uniform> shadow: ShadowUniforms;\r
@group(1) @binding(0) var<uniform> model: ModelUniforms;\r
\r
struct VertexInput {\r
  @location(0) position: vec3<f32>,\r
}\r
\r
@vertex\r
fn vs_main(vin: VertexInput) -> @builtin(position) vec4<f32> {\r
  return shadow.lightViewProj * model.model * vec4<f32>(vin.position, 1.0);\r
}\r
`,Be=2048,Q=4;class Ke extends D{constructor(e,r,t,a,i,c,l,o){super();s(this,"name","ShadowPass");s(this,"shadowMap");s(this,"shadowMapView");s(this,"shadowMapArrayViews");s(this,"_pipeline");s(this,"_shadowBindGroups");s(this,"_shadowUniformBuffers");s(this,"_modelUniformBuffers",[]);s(this,"_modelBindGroups",[]);s(this,"_cascadeCount");s(this,"_cascades",[]);s(this,"_modelBGL");s(this,"_sceneSnapshot",[]);this.shadowMap=e,this.shadowMapView=r,this.shadowMapArrayViews=t,this._pipeline=a,this._shadowBindGroups=i,this._shadowUniformBuffers=c,this._modelBGL=l,this._cascadeCount=o}static create(e,r=3){const{device:t}=e,a=t.createTexture({label:"ShadowMap",size:{width:Be,height:Be,depthOrArrayLayers:Q},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),i=a.createView({dimension:"2d-array"}),c=Array.from({length:Q},(_,h)=>a.createView({dimension:"2d",baseArrayLayer:h,arrayLayerCount:1})),l=t.createBindGroupLayout({label:"ShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),o=t.createBindGroupLayout({label:"ModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),u=[],p=[];for(let _=0;_<Q;_++){const h=t.createBuffer({label:`ShadowUniformBuffer ${_}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});u.push(h),p.push(t.createBindGroup({label:`ShadowBindGroup ${_}`,layout:l,entries:[{binding:0,resource:{buffer:h}}]}))}const d=t.createShaderModule({label:"ShadowShader",code:Lr}),f=t.createRenderPipeline({label:"ShadowPipeline",layout:t.createPipelineLayout({bindGroupLayouts:[l,o]}),vertex:{module:d,entryPoint:"vs_main",buffers:[{arrayStride:ge,attributes:[ve[0]]}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less",depthBias:2,depthBiasSlopeScale:1.5,depthBiasClamp:0},primitive:{topology:"triangle-list",cullMode:"back"}});return new Ke(a,i,c,f,p,u,o,r)}updateScene(e,r,t,a){this._cascades=t.computeCascadeMatrices(r,a),this._cascadeCount=Math.min(this._cascades.length,Q)}execute(e,r){const{device:t}=r,a=this._getMeshRenderers(r);this._ensureModelBuffers(t,a.length);for(let i=0;i<this._cascadeCount&&!(i>=this._cascades.length);i++){const c=this._cascades[i];r.queue.writeBuffer(this._shadowUniformBuffers[i],0,c.lightViewProj.data.buffer);const l=e.beginRenderPass({label:`ShadowPass cascade ${i}`,colorAttachments:[],depthStencilAttachment:{view:this.shadowMapArrayViews[i],depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});l.setPipeline(this._pipeline),l.setBindGroup(0,this._shadowBindGroups[i]);for(let o=0;o<a.length;o++){const{mesh:u,modelMatrix:p}=a[o],d=this._modelUniformBuffers[o];r.queue.writeBuffer(d,0,p.data.buffer),l.setBindGroup(1,this._modelBindGroups[o]),l.setVertexBuffer(0,u.vertexBuffer),l.setIndexBuffer(u.indexBuffer,"uint32"),l.drawIndexed(u.indexCount)}l.end()}}_getMeshRenderers(e){return this._sceneSnapshot??[]}setSceneSnapshot(e){this._sceneSnapshot=e}_ensureModelBuffers(e,r){for(;this._modelUniformBuffers.length<r;){const t=e.createBuffer({label:`ModelUniform ${this._modelUniformBuffers.length}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),a=e.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:t}}]});this._modelUniformBuffers.push(t),this._modelBindGroups.push(a)}}destroy(){this.shadowMap.destroy();for(const e of this._shadowUniformBuffers)e.destroy();for(const e of this._modelUniformBuffers)e.destroy()}}const Nr=`// Deferred PBR lighting pass — fullscreen triangle, reads GBuffer + shadow maps + IBL.\r
\r
const PI: f32 = 3.14159265358979323846;\r
\r
// ---- Aerial perspective (Rayleigh + Mie, same model as atmosphere.wgsl) --------\r
// Density scale factor: real atmosphere only hazes over km; game view is ~200 m,\r
// so multiply density by 200 to get visible haze at typical render distances.\r
const ATM_FOG_SCALE : f32       = 80.0;\r
const ATM_R_E       : f32       = 6360000.0;\r
const ATM_R_A       : f32       = 6420000.0;\r
const ATM_H_R       : f32       = 8500.0;\r
const ATM_H_M       : f32       = 1200.0;\r
const ATM_G         : f32       = 0.758;\r
const ATM_BETA_R    : vec3<f32> = vec3<f32>(5.5e-6, 13.0e-6, 22.4e-6);\r
const ATM_BETA_M    : f32       = 21.0e-6;\r
const ATM_SUN_I     : f32       = 20.0;\r
\r
fn atm_ray_sphere(ro: vec3<f32>, rd: vec3<f32>, r: f32) -> vec2<f32> {\r
  let b = dot(ro, rd); let c = dot(ro, ro) - r * r; let d = b*b - c;\r
  if (d < 0.0) { return vec2<f32>(-1.0, -1.0); }\r
  let sq = sqrt(d);\r
  return vec2<f32>(-b - sq, -b + sq);\r
}\r
\r
fn atm_optical_depth(pos: vec3<f32>, dir: vec3<f32>) -> vec2<f32> {\r
  let t = atm_ray_sphere(pos, dir, ATM_R_A); let ds = t.y / 4.0;\r
  var od = vec2<f32>(0.0);\r
  for (var i = 0; i < 4; i++) {\r
    let h = length(pos + dir * ((f32(i) + 0.5) * ds)) - ATM_R_E;\r
    if (h < 0.0) { break; }\r
    od += vec2<f32>(exp(-h / ATM_H_R), exp(-h / ATM_H_M)) * ds;\r
  }\r
  return od;\r
}\r
\r
// Simplified scatter for fog colour (6 main steps).\r
fn atm_scatter(ro: vec3<f32>, rd: vec3<f32>, sun_dir: vec3<f32>) -> vec3<f32> {\r
  let ta = atm_ray_sphere(ro, rd, ATM_R_A); let tMin = max(ta.x, 0.0);\r
  if (ta.y < 0.0) { return vec3<f32>(0.0); }\r
  let tg   = atm_ray_sphere(ro, rd, ATM_R_E);\r
  let tMax = select(ta.y, min(ta.y, tg.x), tg.x > 0.0);\r
  if (tMax <= tMin) { return vec3<f32>(0.0); }\r
  let mu = dot(rd, sun_dir);\r
  let pR = (3.0 / (16.0 * PI)) * (1.0 + mu * mu);\r
  let g2 = ATM_G * ATM_G;\r
  let pM = (3.0 / (8.0 * PI)) * ((1.0 - g2) * (1.0 + mu * mu)) /\r
            ((2.0 + g2) * pow(max(1.0 + g2 - 2.0 * ATM_G * mu, 1e-4), 1.5));\r
  let ds = (tMax - tMin) / 6.0;\r
  var sumR = vec3<f32>(0.0); var sumM = vec3<f32>(0.0);\r
  var odR = 0.0; var odM = 0.0;\r
  for (var i = 0; i < 6; i++) {\r
    let pos = ro + rd * (tMin + (f32(i) + 0.5) * ds);\r
    let h   = length(pos) - ATM_R_E;\r
    if (h < 0.0) { break; }\r
    let hrh = exp(-h / ATM_H_R) * ds; let hmh = exp(-h / ATM_H_M) * ds;\r
    odR += hrh; odM += hmh;\r
    let tg2 = atm_ray_sphere(pos, sun_dir, ATM_R_E);\r
    if (tg2.x > 0.0) { continue; }\r
    let odL = atm_optical_depth(pos, sun_dir);\r
    let tau = ATM_BETA_R * (odR + odL.x) + ATM_BETA_M * 1.1 * (odM + odL.y);\r
    sumR += exp(-tau) * hrh; sumM += exp(-tau) * hmh;\r
  }\r
  return ATM_SUN_I * (ATM_BETA_R * pR * sumR + vec3<f32>(ATM_BETA_M) * pM * sumM);\r
}\r
\r
fn apply_aerial_perspective(geo_color: vec3<f32>, world_pos: vec3<f32>,\r
                             sun_dir: vec3<f32>, cam_h: f32) -> vec3<f32> {\r
  let ray_vec  = world_pos - camera.position;\r
  let dist     = length(ray_vec);\r
  let ray_dir  = ray_vec / max(dist, 0.001);\r
  let atm_ro   = vec3<f32>(0.0, ATM_R_E + cam_h, 0.0);\r
\r
  // Altitude at camera and at the geometry surface.\r
  let h0 = max(camera.position.y, 0.0);\r
  let h1 = max(world_pos.y, 0.0);\r
  let dh = h1 - h0;\r
\r
  // Analytic integral of exp(-h(t)/H) dt along the ray from t=0 to t=dist:\r
  //   h(t) = h0 + (dh/dist)*t\r
  //   integral = (exp(-h0/H) - exp(-h1/H)) * H * dist / dh\r
  // Horizontal-ray limit (|dh| → 0): exp(-h0/H) * dist\r
  // This makes fog thicker for low geometry and thinner for high geometry at the same distance.\r
  var od_R: f32;\r
  var od_M: f32;\r
  if (abs(dh) < 0.1) {\r
    od_R = exp(-h0 / ATM_H_R) * dist;\r
    od_M = exp(-h0 / ATM_H_M) * dist;\r
  } else {\r
    od_R = max((exp(-h0 / ATM_H_R) - exp(-h1 / ATM_H_R)) * ATM_H_R * dist / dh, 0.0);\r
    od_M = max((exp(-h0 / ATM_H_M) - exp(-h1 / ATM_H_M)) * ATM_H_M * dist / dh, 0.0);\r
  }\r
\r
  let tau   = (ATM_BETA_R * od_R + vec3<f32>(ATM_BETA_M * od_M)) * ATM_FOG_SCALE;\r
  let geo_T = exp(-tau);\r
\r
  // Sample fog colour using only the horizontal component of the ray direction.\r
  // Using the true ray direction creates a visible line at camera height where\r
  // the sky-scatter colour changes as the downward angle exceeds any clamp value.\r
  // Projecting to horizontal makes fog colour a function of azimuth only (sun angle),\r
  // matching the sky at the true horizon with no altitude-dependent discontinuity.\r
  let h2   = vec3<f32>(ray_dir.x, 0.0, ray_dir.z);\r
  let len2 = dot(h2, h2);\r
  let fog_dir   = select(normalize(h2), vec3<f32>(1.0, 0.0, 0.0), len2 < 1e-6);\r
  let fog_color = atm_scatter(atm_ro, fog_dir, sun_dir);\r
\r
  return geo_color * geo_T + fog_color * (1.0 - geo_T);\r
}\r
const SHADOW_MAP_SIZE: f32 = 2048.0;\r
\r
const POISSON16 = array<vec2<f32>, 16>(\r
  vec2<f32>(-0.94201624, -0.39906216), vec2<f32>( 0.94558609, -0.76890725),\r
  vec2<f32>(-0.09418410, -0.92938870), vec2<f32>( 0.34495938,  0.29387760),\r
  vec2<f32>(-0.91588581,  0.45771432), vec2<f32>(-0.81544232, -0.87912464),\r
  vec2<f32>(-0.38277543,  0.27676845), vec2<f32>( 0.97484398,  0.75648379),\r
  vec2<f32>( 0.44323325, -0.97511554), vec2<f32>( 0.53742981, -0.47373420),\r
  vec2<f32>(-0.26496911, -0.41893023), vec2<f32>( 0.79197514,  0.19090188),\r
  vec2<f32>(-0.24188840,  0.99706507), vec2<f32>(-0.81409955,  0.91437590),\r
  vec2<f32>( 0.19984126,  0.78641367), vec2<f32>( 0.14383161, -0.14100790),\r
);\r
\r
fn ign(pixel: vec2<f32>) -> f32 {\r
  return fract(52.9829189 * fract(0.06711056 * pixel.x + 0.00583715 * pixel.y));\r
}\r
\r
fn rotate2d(v: vec2<f32>, a: f32) -> vec2<f32> {\r
  let s = sin(a); let c = cos(a);\r
  return vec2<f32>(c*v.x - s*v.y, s*v.x + c*v.y);\r
}\r
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
struct LightUniforms {\r
  direction         : vec3<f32>,\r
  intensity         : f32,\r
  color             : vec3<f32>,\r
  cascadeCount      : u32,\r
  cascadeMatrices   : array<mat4x4<f32>, 4>,\r
  cascadeSplits     : vec4<f32>,\r
  shadowsEnabled    : u32,\r
  debugCascades     : u32,\r
  cloudShadowOrigin : vec2<f32>,  // world-space XZ centre of cloud shadow map\r
  cloudShadowExtent  : f32,        // half-size in world units (covers ±extent)\r
  shadowSoftness     : f32,        // PCSS light-size factor (~0.02)\r
  _pad_light         : vec2<f32>,  // padding to align cascadeDepthRanges to 16 bytes (offset 336)\r
  cascadeDepthRanges : vec4<f32>,  // light-space Z depth per cascade (for adaptive depth bias)\r
  cascadeTexelSizes  : vec4<f32>,  // world-space size of one shadow texel per cascade\r
}\r
\r
@group(0) @binding(0) var<uniform> camera: CameraUniforms;\r
@group(0) @binding(1) var<uniform> light : LightUniforms;\r
\r
@group(1) @binding(0) var albedoRoughnessTex: texture_2d<f32>;\r
@group(1) @binding(1) var normalMetallicTex : texture_2d<f32>;\r
@group(1) @binding(2) var depthTex          : texture_depth_2d;\r
@group(1) @binding(3) var shadowMap         : texture_depth_2d_array;\r
@group(1) @binding(4) var shadowSampler     : sampler_comparison;\r
@group(1) @binding(5) var gbufferSampler    : sampler;\r
@group(1) @binding(6) var cloudShadowTex    : texture_2d<f32>;\r
\r
// SSAO + SSGI (group 2)\r
@group(2) @binding(0) var ao_tex   : texture_2d<f32>;\r
@group(2) @binding(1) var ao_samp  : sampler;\r
@group(2) @binding(2) var ssgi_tex : texture_2d<f32>;\r
@group(2) @binding(3) var ssgi_samp: sampler;\r
\r
// IBL (group 3): pre-baked from the physical sky HDR.\r
// irradiance_cube: diffuse integral (cosine-weighted hemisphere), 32×32 per face.\r
// prefilter_cube:  GGX specular pre-filtered, 128×128 base with IBL_MIP_LEVELS mip levels.\r
// brdf_lut:        split-sum A/B (NdotV × roughness → rg), 64×64.\r
const IBL_MIP_LEVELS: f32 = 5.0;   // must match IBL_LEVELS in ibl.ts\r
@group(3) @binding(0) var irradiance_cube: texture_cube<f32>;\r
@group(3) @binding(1) var prefilter_cube : texture_cube<f32>;\r
@group(3) @binding(2) var brdf_lut       : texture_2d<f32>;\r
@group(3) @binding(3) var ibl_samp       : sampler;\r
\r
struct VertexOutput {\r
  @builtin(position) clip_pos: vec4<f32>,\r
  @location(0)       uv      : vec2<f32>,\r
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
fn reconstruct_world_pos(uv: vec2<f32>, depth: f32) -> vec3<f32> {\r
  let ndc    = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);\r
  let world_h = camera.invViewProj * ndc;\r
  return world_h.xyz / world_h.w;\r
}\r
\r
// === Shadow ===========================================================\r
\r
fn pcf_shadow(cascade: u32, sc: vec3<f32>, bias: f32, kernel_radius: f32, screen_pos: vec2<f32>) -> f32 {\r
  let texel = vec2<f32>(kernel_radius / SHADOW_MAP_SIZE);\r
  let angle = ign(screen_pos) * 6.28318530;\r
  var s = 0.0;\r
  for (var i = 0; i < 16; i++) {\r
    let offset = rotate2d(POISSON16[i], angle) * texel;\r
    let uv = clamp(sc.xy + offset, vec2<f32>(0.0), vec2<f32>(1.0));\r
    s += textureSampleCompareLevel(shadowMap, shadowSampler, uv, i32(cascade), sc.z - bias);\r
  }\r
  return s / 16.0;\r
}\r
\r
// Returns average blocker depth, or -1.0 if receiver is fully lit.\r
fn pcss_blocker_search(cascade: u32, sc: vec3<f32>, search_radius: f32, screen_pos: vec2<f32>) -> f32 {\r
  let texel = vec2<f32>(search_radius / SHADOW_MAP_SIZE);\r
  let angle = ign(screen_pos) * 6.28318530;\r
  var total = 0.0;\r
  var count = 0.0;\r
  for (var i = 0; i < 8; i++) {\r
    let offset = rotate2d(POISSON16[i], angle) * texel;\r
    let uv = clamp(sc.xy + offset, vec2<f32>(0.0), vec2<f32>(1.0));\r
    let tc = clamp(vec2<i32>(uv * SHADOW_MAP_SIZE),\r
                   vec2<i32>(0), vec2<i32>(i32(SHADOW_MAP_SIZE) - 1));\r
    let d = textureLoad(shadowMap, tc, i32(cascade), 0);\r
    if (d < sc.z) {\r
      total += d;\r
      count += 1.0;\r
    }\r
  }\r
  if (count == 0.0) { return -1.0; }\r
  return total / count;\r
}\r
\r
// Returns shadow-space coords for cascade c.  xy in [0,1], z in [0,1] when in-frustum.\r
fn cascade_coords(c: u32, world_pos: vec3<f32>) -> vec3<f32> {\r
  let ls = light.cascadeMatrices[c] * vec4<f32>(world_pos, 1.0);\r
  var sc = ls.xyz / ls.w;\r
  sc = vec3<f32>(sc.xy * 0.5 + 0.5, sc.z);\r
  sc.y = 1.0 - sc.y;\r
  return sc;\r
}\r
\r
fn in_cascade(sc: vec3<f32>) -> bool {\r
  return all(sc.xy >= vec2<f32>(0.0)) && all(sc.xy <= vec2<f32>(1.0))\r
      && sc.z >= 0.0 && sc.z <= 1.0;\r
}\r
\r
fn select_cascade(view_depth: f32) -> u32 {\r
  for (var i = 0u; i < light.cascadeCount; i++) {\r
    if (view_depth < light.cascadeSplits[i]) { return i; }\r
  }\r
  return light.cascadeCount - 1u;\r
}\r
\r
fn shadow_factor(world_pos: vec3<f32>, N: vec3<f32>, NdotL: f32, view_depth: f32, screen_pos: vec2<f32>) -> f32 {\r
  if (light.shadowsEnabled == 0u) { return 1.0; }\r
  let cascade     = select_cascade(view_depth);\r
  let depth_range = light.cascadeDepthRanges[cascade];\r
  let bias        = max(0.05 * (1.0 - NdotL), 0.01) / max(depth_range, 1.0);\r
\r
  // Normal bias — scales with the cascade's world-space texel size so near\r
  // cascades stay sharp and far cascades avoid acne on low-angle surfaces.\r
  // Uses a flat (axis-snapped) normal for temporal stability, then removes the\r
  // light-parallel component so the offset doesn't inflate shadow-map depth.\r
  let L       = normalize(-light.direction);\r
  let q       = round(N);\r
  let flat_N  = select(N, normalize(q), dot(q, q) > 0.5);\r
  let t_angle = 1.0 - max(0.0, dot(L, -flat_N));\r
  var nb      = flat_N * (light.cascadeTexelSizes[cascade] * 1.5 * t_angle);\r
  nb         -= L * dot(L, nb);\r
  let biased_pos = world_pos + nb;\r
\r
  let sc0 = cascade_coords(cascade, biased_pos);\r
  if (!in_cascade(sc0)) { return 1.0; }\r
\r
  // PCSS: blocker search → penumbra width → scaled PCF kernel.\r
  // Screen-space position drives the Poisson rotation so the pattern is\r
  // stable per-pixel rather than jumping with sub-texel shadow UV changes.\r
  var kernel = 2.0;\r
  let avg_blocker = pcss_blocker_search(cascade, sc0, 8.0, screen_pos);\r
  if (avg_blocker >= 0.0) {\r
    let penumbra = light.shadowSoftness * (sc0.z - avg_blocker) / max(avg_blocker, 0.001);\r
    kernel = clamp(penumbra * SHADOW_MAP_SIZE, 1.0, 16.0);\r
  }\r
  let s0 = pcf_shadow(cascade, sc0, bias, kernel, screen_pos);\r
\r
  let next = cascade + 1u;\r
  if (next < light.cascadeCount) {\r
    let split      = light.cascadeSplits[cascade];\r
    let blend_band = split * 0.1;\r
    let t = smoothstep(split - blend_band, split, view_depth);\r
    if (t > 0.0) {\r
      let sc1 = cascade_coords(next, biased_pos);\r
      // Only blend toward the next cascade if this position is actually inside it;\r
      // blending toward an OOB cascade would mix toward depth=1 (fully lit).\r
      if (in_cascade(sc1)) {\r
        var kernel1 = 2.0;\r
        let ab1 = pcss_blocker_search(next, sc1, 8.0, screen_pos);\r
        if (ab1 >= 0.0) {\r
          let pen1 = light.shadowSoftness * (sc1.z - ab1) / max(ab1, 0.001);\r
          kernel1 = clamp(pen1 * SHADOW_MAP_SIZE, 1.0, 16.0);\r
        }\r
        return mix(s0, pcf_shadow(next, sc1, bias, kernel1, screen_pos), t);\r
      }\r
    }\r
  }\r
  return s0;\r
}\r
\r
// === PBR BRDFs ========================================================\r
\r
fn distribution_ggx(NdotH: f32, roughness: f32) -> f32 {\r
  let a  = roughness * roughness;\r
  let a2 = a * a;\r
  let d  = NdotH * NdotH * (a2 - 1.0) + 1.0;\r
  return a2 / (PI * d * d);\r
}\r
\r
// k for direct lighting: (roughness+1)²/8\r
fn geometry_direct(NdotX: f32, roughness: f32) -> f32 {\r
  let r = roughness + 1.0;\r
  let k = r * r / 8.0;\r
  return NdotX / (NdotX * (1.0 - k) + k);\r
}\r
\r
fn smith_direct(NdotV: f32, NdotL: f32, roughness: f32) -> f32 {\r
  return geometry_direct(NdotV, roughness) * geometry_direct(NdotL, roughness);\r
}\r
\r
fn fresnel_schlick(cosTheta: f32, F0: vec3<f32>) -> vec3<f32> {\r
  return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);\r
}\r
\r
// Roughness-clamped Fresnel for IBL — prevents energy gain at grazing angles on rough metals.\r
fn fresnel_schlick_roughness(cosTheta: f32, F0: vec3<f32>, roughness: f32) -> vec3<f32> {\r
  return F0 + (max(vec3<f32>(1.0 - roughness), F0) - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);\r
}\r
\r
\r
// === Fragment =========================================================\r
\r
@fragment\r
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {\r
  let coord = vec2<i32>(in.clip_pos.xy);\r
  let depth = textureLoad(depthTex, coord, 0);\r
\r
  // === Debug: shadow-map depth thumbnails ===================================\r
  // Rendered before the sky discard so they overlay the full screen.\r
  if (light.debugCascades != 0u) {\r
    let screen  = vec2<f32>(textureDimensions(depthTex));\r
    let thumb   = floor(screen.y / 4.0); // square side — 3 thumbnails fit vertically\r
    let sm_size = vec2<f32>(textureDimensions(shadowMap));\r
    let px      = in.clip_pos.xy;\r
\r
    for (var ci = 0u; ci < light.cascadeCount; ci++) {\r
      let x0 = screen.x - thumb;\r
      let y0 = f32(ci) * thumb;\r
      if (px.x >= x0 && px.y >= y0 && px.y < y0 + thumb) {\r
        let uv = (px - vec2<f32>(x0, y0)) / thumb;\r
        // textureLoad avoids the sampler-type conflict (depth textures can't use\r
        // a non-comparison sampler through textureSampleLevel).\r
        let tc = clamp(vec2<i32>(uv * sm_size),\r
                       vec2<i32>(0), vec2<i32>(sm_size) - vec2<i32>(1));\r
        let d = textureLoad(shadowMap, tc, i32(ci), 0);\r
        // 2-pixel border in the cascade's debug colour\r
        let border = 2.0;\r
        if (px.x < x0 + border || px.y < y0 + border || px.y > y0 + thumb - border) {\r
          switch ci {\r
            case 0u: { return vec4<f32>(1.0, 0.25, 0.25, 1.0); }\r
            case 1u: { return vec4<f32>(0.25, 1.0, 0.25, 1.0); }\r
            case 2u: { return vec4<f32>(0.25, 0.25, 1.0, 1.0); }\r
            default: { return vec4<f32>(1.0,  1.0,  0.25, 1.0); }\r
          }\r
        }\r
        return vec4<f32>(d, d, d, 1.0);\r
      }\r
    }\r
  }\r
  // ==========================================================================\r
\r
  if (depth >= 1.0) { discard; } // sky pixels handled by SkyPass\r
\r
  let albedo_rough = textureLoad(albedoRoughnessTex, coord, 0);\r
  let normal_emiss = textureLoad(normalMetallicTex,  coord, 0);\r
\r
  let albedo    = albedo_rough.rgb;\r
  let roughness = max(albedo_rough.a, 0.04); // clamp to avoid division issues\r
  let N         = normalize(normal_emiss.rgb * 2.0 - 1.0);\r
  let emission  = normal_emiss.a;\r
  let metallic  = 0.0; // Replaced with emission channel\r
\r
  let world_pos = reconstruct_world_pos(in.uv, depth);\r
  let V         = normalize(camera.position - world_pos);\r
  let NdotV     = max(dot(N, V), 0.001);\r
\r
  // View-space depth for cascade selection\r
  let view_pos   = camera.view * vec4<f32>(world_pos, 1.0);\r
  let view_depth = -view_pos.z;\r
\r
  // Base reflectance: 0.04 for dielectrics, albedo for metals\r
  let F0 = mix(vec3<f32>(0.04), albedo, metallic);\r
\r
  // === Direct lighting (sun) =========================================\r
  let L     = normalize(-light.direction);\r
  let H     = normalize(L + V);\r
  let NdotL = max(dot(N, L), 0.0);\r
  let NdotH = max(dot(N, H), 0.0);\r
  let VdotH = max(dot(V, H), 0.0);\r
\r
  // Smoothly kill sun contribution as it dips below the horizon (L.y = 0).\r
  let horizon_fade = smoothstep(-0.05, 0.05, L.y);\r
\r
  let D  = distribution_ggx(NdotH, roughness);\r
  let G  = smith_direct(NdotV, NdotL, roughness);\r
  let Fd = fresnel_schlick(VdotH, F0);\r
\r
  let kS_direct = Fd;\r
  let kD_direct = (vec3<f32>(1.0) - kS_direct) * (1.0 - metallic);\r
\r
  let specular_brdf = D * G * Fd / max(4.0 * NdotV * NdotL, 0.001);\r
  let diffuse_brdf  = kD_direct * albedo / PI;\r
\r
  let shad = shadow_factor(world_pos, N, NdotL, view_depth, in.clip_pos.xy);\r
\r
  // Cloud shadow — sample top-down transmittance map; default 1.0 when extent is zero\r
  let cloud_ext = max(light.cloudShadowExtent, 0.001);\r
  let cloud_uv  = clamp(\r
    (world_pos.xz - light.cloudShadowOrigin) / (cloud_ext * 2.0) + 0.5,\r
    vec2<f32>(0.0), vec2<f32>(1.0),\r
  );\r
  let cloud_shadow = select(\r
    textureSampleLevel(cloudShadowTex, gbufferSampler, cloud_uv, 0.0).r,\r
    1.0,\r
    light.cloudShadowExtent <= 0.0,\r
  );\r
\r
  let direct = (diffuse_brdf + specular_brdf) * light.color * light.intensity * NdotL * shad * cloud_shadow * horizon_fade;\r
\r
  // === IBL Ambient ====================================================\r
  let ao = textureSampleLevel(ao_tex, ao_samp, in.uv, 0.0).r;\r
\r
  // Roughness-corrected Fresnel — avoids energy gain on rough metals at grazing angles.\r
  let kS_ibl = fresnel_schlick_roughness(NdotV, F0, roughness);\r
  let kD_ibl = (vec3<f32>(1.0) - kS_ibl) * (1.0 - metallic);\r
\r
  // Diffuse IBL: cosine-weighted hemisphere integral baked into irradiance cube.\r
  let irradiance  = textureSampleLevel(irradiance_cube, ibl_samp, N, 0.0).rgb;\r
  let diffuse_ibl = irradiance * albedo * kD_ibl;\r
\r
  // Specular IBL: GGX pre-filtered env + split-sum BRDF LUT.\r
  let R           = reflect(-V, N);\r
  let prefiltered = textureSampleLevel(prefilter_cube, ibl_samp, R, roughness * (IBL_MIP_LEVELS - 1.0)).rgb;\r
  let brdf        = textureSampleLevel(brdf_lut, ibl_samp, vec2<f32>(NdotV, roughness), 0.0).rg;\r
  let specular_ibl = 0.0;//prefiltered * (kS_ibl * brdf.x + brdf.y);\r
\r
  // Shadow-darken ambient during the day; at night remove shadow influence.\r
  let shadow_scale = mix(1.0, max(shad, 0.05), horizon_fade);\r
  // Scale by AO and shadow; fade IBL with sun so it doesn't blast at night.\r
  // Add a tiny constant for moonlight/starlight so the world isn't pitch black.\r
  let ambient = (diffuse_ibl + specular_ibl) * ao * shadow_scale * horizon_fade\r
              + albedo * (1.0 - metallic) * 0.01;\r
\r
  // SSGI: one-bounce diffuse indirect from screen-space ray march\r
  let ssgi_irr     = textureSampleLevel(ssgi_tex, ssgi_samp, in.uv, 0.0).rgb;\r
  let ssgi_contrib = ssgi_irr * albedo * (1.0 - metallic);\r
\r
  // Add emission (scaled by albedo for colored glow)\r
  let emissive = albedo * emission * 2.0;\r
\r
  let color = direct + ambient + ssgi_contrib + emissive;\r
\r
  if (light.debugCascades != 0u) {\r
    let cascade = select_cascade(view_depth);\r
    var tint: vec3<f32>;\r
    switch cascade {\r
      case 0u:    { tint = vec3<f32>(1.0, 0.25, 0.25); } // red   = near\r
      case 1u:    { tint = vec3<f32>(0.25, 1.0, 0.25); } // green = mid\r
      case 2u:    { tint = vec3<f32>(0.25, 0.25, 1.0); } // blue  = far\r
      default:    { tint = vec3<f32>(1.0,  1.0,  0.25); } // yellow = beyond\r
    }\r
    let shad = shadow_factor(world_pos, N, NdotL, view_depth, in.clip_pos.xy);\r
    return vec4<f32>(tint * mix(0.15, 1.0, shad), 1.0);\r
  }\r
\r
  let sun_dir_fog = normalize(-light.direction);\r
  let cam_h_fog   = max(camera.position.y, 1.0);\r
  let haze = apply_aerial_perspective(color, world_pos, sun_dir_fog, cam_h_fog);\r
  return vec4<f32>(haze, 1.0);\r
}\r
`,V="rgba16float",Ge=64*4+16+16,Se=368;class Je extends D{constructor(e,r,t,a,i,c,l,o,u,p,d,f,_,h,v,g){super();s(this,"name","LightingPass");s(this,"hdrTexture");s(this,"hdrView");s(this,"cameraBuffer");s(this,"lightBuffer");s(this,"_pipeline");s(this,"_sceneBindGroup");s(this,"_gbufferBindGroup");s(this,"_aoBindGroup");s(this,"_iblBindGroup");s(this,"_defaultCloudShadow");s(this,"_defaultSsgi");s(this,"_device");s(this,"_aoBGL");s(this,"_aoView");s(this,"_aoSampler");s(this,"_ssgiSampler");this.hdrTexture=e,this.hdrView=r,this._pipeline=t,this._sceneBindGroup=a,this._gbufferBindGroup=i,this._aoBindGroup=c,this._iblBindGroup=l,this.cameraBuffer=o,this.lightBuffer=u,this._defaultCloudShadow=p,this._defaultSsgi=d,this._device=f,this._aoBGL=_,this._aoView=h,this._aoSampler=v,this._ssgiSampler=g}static create(e,r,t,a,i,c){const{device:l,width:o,height:u}=e,p=l.createTexture({label:"HDR Texture",size:{width:o,height:u},format:V,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),d=p.createView(),f=l.createBuffer({label:"LightCameraBuffer",size:Ge,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),_=l.createBuffer({label:"LightBuffer",size:Se,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),h=l.createSampler({label:"ShadowSampler",compare:"less-equal",magFilter:"linear",minFilter:"linear"}),v=l.createSampler({label:"GBufferLinearSampler",magFilter:"linear",minFilter:"linear"}),g=l.createSampler({label:"AoSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),b=l.createSampler({label:"SsgiSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),x=l.createBindGroupLayout({label:"LightSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),y=l.createBindGroupLayout({label:"LightGBufferBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth",viewDimension:"2d-array"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"comparison"}},{binding:5,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:6,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),w=l.createTexture({label:"DefaultCloudShadow",size:{width:1,height:1},format:"r8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});l.queue.writeTexture({texture:w},new Uint8Array([255]),{bytesPerRow:1},{width:1,height:1});const S=i??w.createView(),B=l.createBindGroupLayout({label:"LightAoBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),P=l.createTexture({label:"DefaultSsgi",size:{width:1,height:1},format:V,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),E=l.createBindGroupLayout({label:"LightIblBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),G=l.createSampler({label:"IblSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge"}),U=l.createTexture({label:"DefaultIblCube",size:{width:1,height:1,depthOrArrayLayers:6},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),M=U.createView({dimension:"cube"}),R=l.createTexture({label:"DefaultBrdfLut",size:{width:1,height:1},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),N=l.createBindGroup({label:"LightIblBG",layout:E,entries:[{binding:0,resource:(c==null?void 0:c.irradianceView)??M},{binding:1,resource:(c==null?void 0:c.prefilteredView)??M},{binding:2,resource:(c==null?void 0:c.brdfLutView)??R.createView()},{binding:3,resource:G}]});U.destroy(),R.destroy();const A=l.createBindGroup({layout:x,entries:[{binding:0,resource:{buffer:f}},{binding:1,resource:{buffer:_}}]}),O=l.createBindGroup({layout:y,entries:[{binding:0,resource:r.albedoRoughnessView},{binding:1,resource:r.normalMetallicView},{binding:2,resource:r.depthView},{binding:3,resource:t.shadowMapView},{binding:4,resource:h},{binding:5,resource:v},{binding:6,resource:S}]}),C=l.createBindGroup({label:"LightAoBG",layout:B,entries:[{binding:0,resource:a},{binding:1,resource:g},{binding:2,resource:P.createView()},{binding:3,resource:b}]}),I=l.createShaderModule({label:"LightingShader",code:Nr}),F=l.createRenderPipeline({label:"LightingPipeline",layout:l.createPipelineLayout({bindGroupLayouts:[x,y,B,E]}),vertex:{module:I,entryPoint:"vs_main"},fragment:{module:I,entryPoint:"fs_main",targets:[{format:V}]},primitive:{topology:"triangle-list"}});return new Je(p,d,F,A,O,C,N,f,_,i?null:w,P,l,B,a,g,b)}updateSSGI(e){this._aoBindGroup=this._device.createBindGroup({label:"LightAoBG",layout:this._aoBGL,entries:[{binding:0,resource:this._aoView},{binding:1,resource:this._aoSampler},{binding:2,resource:e},{binding:3,resource:this._ssgiSampler}]})}updateCamera(e,r,t,a,i,c,l,o){const u=new Float32Array(Ge/4);u.set(r.data,0),u.set(t.data,16),u.set(a.data,32),u.set(i.data,48),u[64]=c.x,u[65]=c.y,u[66]=c.z,u[67]=l,u[68]=o,e.queue.writeBuffer(this.cameraBuffer,0,u.buffer)}updateLight(e,r,t,a,i,c=!0,l=!1,o=.02){const u=new Float32Array(Se/4);let p=0;u[p++]=r.x,u[p++]=r.y,u[p++]=r.z,u[p++]=a,u[p++]=t.x,u[p++]=t.y,u[p++]=t.z,new Uint32Array(u.buffer)[p++]=i.length;for(let d=0;d<4;d++)d<i.length&&u.set(i[d].lightViewProj.data,p),p+=16;for(let d=0;d<4;d++)u[p++]=d<i.length?i[d].splitFar:1e9;new Uint32Array(u.buffer)[p]=c?1:0,new Uint32Array(u.buffer)[p+1]=l?1:0,u[81]=o;for(let d=0;d<4;d++)u[84+d]=d<i.length?i[d].depthRange:1;for(let d=0;d<4;d++)u[88+d]=d<i.length?i[d].texelWorldSize:1;e.queue.writeBuffer(this.lightBuffer,0,u.buffer)}updateCloudShadow(e,r,t,a){const i=new Float32Array(3);i[0]=r,i[1]=t,i[2]=a,e.queue.writeBuffer(this.lightBuffer,312,i.buffer)}execute(e,r){const t=e.beginRenderPass({label:"LightingPass",colorAttachments:[{view:this.hdrView,loadOp:"load",storeOp:"store"}]});t.setPipeline(this._pipeline),t.setBindGroup(0,this._sceneBindGroup),t.setBindGroup(1,this._gbufferBindGroup),t.setBindGroup(2,this._aoBindGroup),t.setBindGroup(3,this._iblBindGroup),t.draw(3),t.end()}destroy(){var e,r;this.hdrTexture.destroy(),this.cameraBuffer.destroy(),this.lightBuffer.destroy(),(e=this._defaultCloudShadow)==null||e.destroy(),(r=this._defaultSsgi)==null||r.destroy()}}const Vr=`// Cloud + sky pass — fullscreen triangle.\r
// Raymarches through a cloud slab with Beer's law transmittance and self-shadow\r
// light marching.  Sky colour is computed with the same Rayleigh+Mie model as\r
// atmosphere.wgsl so no sky texture is needed.\r
\r
const PI: f32 = 3.14159265358979323846;\r
\r
// ---- Uniforms ----------------------------------------------------------------\r
\r
struct CameraUniforms {\r
  invViewProj: mat4x4<f32>,\r
  position: vec3<f32>,\r
  near: f32,\r
  far: f32,\r
}\r
\r
struct CloudUniforms {\r
  cloudBase: f32,\r
  cloudTop: f32,\r
  coverage: f32,\r
  density: f32,\r
  windOffset: vec2<f32>,\r
  anisotropy: f32,\r
  extinction: f32,\r
  ambientColor: vec3<f32>,\r
  exposure: f32,\r
}\r
\r
struct LightUniforms {\r
  direction: vec3<f32>,\r
  intensity: f32,\r
  color: vec3<f32>,\r
  _pad: f32,\r
}\r
\r
@group(0) @binding(0) var<uniform> camera: CameraUniforms;\r
@group(0) @binding(1) var<uniform> cloud : CloudUniforms;\r
@group(1) @binding(0) var<uniform> light : LightUniforms;\r
@group(2) @binding(0) var          depth_tex  : texture_depth_2d;\r
@group(2) @binding(1) var          depth_samp : sampler;\r
@group(3) @binding(0) var          base_noise  : texture_3d<f32>;\r
@group(3) @binding(1) var          detail_noise: texture_3d<f32>;\r
@group(3) @binding(2) var          noise_samp  : sampler;\r
\r
// ---- Atmosphere (Rayleigh + Mie) for sky colour ------------------------------\r
\r
const R_E            : f32       = 6360000.0;\r
const R_A            : f32       = 6420000.0;\r
const H_R            : f32       = 8500.0;\r
const H_M            : f32       = 1200.0;\r
const G_ATM          : f32       = 0.758;\r
const BETA_R         : vec3<f32> = vec3<f32>(5.5e-6, 13.0e-6, 22.4e-6);\r
const BETA_M_ATM     : f32       = 21.0e-6;\r
const SUN_INTENSITY  : f32       = 20.0;\r
const SUN_COS_THRESH  : f32 = 0.999976;  // 10% larger angular radius than default\r
const MOON_COS_THRESH : f32 = 0.999978;  //  5% larger angular radius than default\r
\r
fn ray_sphere(ro: vec3<f32>, rd: vec3<f32>, r: f32) -> vec2<f32> {\r
  let b = dot(ro, rd);\r
  let c = dot(ro, ro) - r * r;\r
  let d = b * b - c;\r
  if (d < 0.0) { return vec2<f32>(-1.0, -1.0); }\r
  let sq = sqrt(d);\r
  return vec2<f32>(-b - sq, -b + sq);\r
}\r
\r
fn phase_r(mu: f32) -> f32 {\r
  return (3.0 / (16.0 * PI)) * (1.0 + mu * mu);\r
}\r
\r
fn phase_m_atm(mu: f32) -> f32 {\r
  let g2 = G_ATM * G_ATM;\r
  return (3.0 / (8.0 * PI)) *\r
         ((1.0 - g2) * (1.0 + mu * mu)) /\r
         ((2.0 + g2) * pow(max(1.0 + g2 - 2.0 * G_ATM * mu, 1e-4), 1.5));\r
}\r
\r
fn optical_depth_to_sky(pos: vec3<f32>, dir: vec3<f32>) -> vec2<f32> {\r
  let t  = ray_sphere(pos, dir, R_A);\r
  let ds = t.y / 4.0;\r
  var od = vec2<f32>(0.0);\r
  for (var i = 0; i < 4; i++) {\r
    let h = length(pos + dir * ((f32(i) + 0.5) * ds)) - R_E;\r
    if (h < 0.0) { break; }\r
    od += vec2<f32>(exp(-h / H_R), exp(-h / H_M)) * ds;\r
  }\r
  return od;\r
}\r
\r
fn sky_transmittance(ro: vec3<f32>, rd: vec3<f32>) -> vec3<f32> {\r
  let od = optical_depth_to_sky(ro, rd);\r
  return exp(-(BETA_R * od.x + BETA_M_ATM * 1.1 * od.y));\r
}\r
\r
fn scatter_sky(ro: vec3<f32>, rd: vec3<f32>, sun_dir: vec3<f32>) -> vec3<f32> {\r
  let ta   = ray_sphere(ro, rd, R_A);\r
  let tMin = max(ta.x, 0.0);\r
  if (ta.y < 0.0) { return vec3<f32>(0.0); }\r
  let tg   = ray_sphere(ro, rd, R_E);\r
  let tMax = select(ta.y, min(ta.y, tg.x), tg.x > 0.0);\r
  if (tMax <= tMin) { return vec3<f32>(0.0); }\r
\r
  let mu = dot(rd, sun_dir);\r
  let pR = phase_r(mu);\r
  let pM = phase_m_atm(mu);\r
  let ds = (tMax - tMin) / 8.0;\r
\r
  var sumR = vec3<f32>(0.0);\r
  var sumM = vec3<f32>(0.0);\r
  var odR  = 0.0;\r
  var odM  = 0.0;\r
\r
  for (var i = 0; i < 8; i++) {\r
    let pos = ro + rd * (tMin + (f32(i) + 0.5) * ds);\r
    let h   = length(pos) - R_E;\r
    if (h < 0.0) { break; }\r
    let hrh = exp(-h / H_R) * ds;\r
    let hmh = exp(-h / H_M) * ds;\r
    odR += hrh;\r
    odM += hmh;\r
    let tg2 = ray_sphere(pos, sun_dir, R_E);\r
    if (tg2.x > 0.0) { continue; }\r
    let odL = optical_depth_to_sky(pos, sun_dir);\r
    let tau = BETA_R * (odR + odL.x) + BETA_M_ATM * 1.1 * (odM + odL.y);\r
    let T   = exp(-tau);\r
    sumR += T * hrh;\r
    sumM += T * hmh;\r
  }\r
\r
  return SUN_INTENSITY * (BETA_R * pR * sumR + vec3<f32>(BETA_M_ATM) * pM * sumM);\r
}\r
\r
// ---- Vertex shader -----------------------------------------------------------\r
\r
struct VertexOutput {\r
  @builtin(position) clip_pos: vec4<f32>,\r
  @location(0)       uv      : vec2<f32>,\r
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
// ---- Cloud helpers -----------------------------------------------------------\r
\r
fn remap(v: f32, lo: f32, hi: f32, a: f32, b: f32) -> f32 {\r
  return a + saturate((v - lo) / max(hi - lo, 0.0001)) * (b - a);\r
}\r
\r
fn height_gradient(y: f32) -> f32 {\r
  let t    = clamp((y - cloud.cloudBase) / max(cloud.cloudTop - cloud.cloudBase, 0.001), 0.0, 1.0);\r
  let base = remap(t, 0.0, 0.07, 0.0, 1.0);\r
  let top  = remap(t, 0.2, 1.0,  1.0, 0.0);\r
  return saturate(base * top);\r
}\r
\r
fn hg_phase(cos_theta: f32, g: f32) -> f32 {\r
  let g2 = g * g;\r
  return (1.0 - g2) / (4.0 * PI * pow(1.0 + g2 - 2.0 * g * cos_theta, 1.5));\r
}\r
\r
fn dual_phase(cos_theta: f32, g: f32) -> f32 {\r
  return 0.7 * hg_phase(cos_theta, g) + 0.3 * hg_phase(cos_theta, -0.25);\r
}\r
\r
fn sample_pw(samp_uv: vec3<f32>) -> f32 {\r
  let s = textureSampleLevel(base_noise, noise_samp, samp_uv, 0.0);\r
  let w = s.g * 0.5 + s.b * 0.35 + s.a * 0.15;\r
  return remap(s.r, 1.0 - w, 1.0, 0.0, 1.0);\r
}\r
\r
fn sample_density(p: vec3<f32>) -> f32 {\r
  let wind = vec3<f32>(cloud.windOffset.x, 0.0, cloud.windOffset.y);\r
  // Large-scale pass (3× coarser) — creates some very big cloud masses.\r
  // Drifts at half wind speed for natural differential parallax with smaller clouds.\r
  let pw_large = sample_pw((p + wind * 0.5) * 0.012);\r
  // Medium-scale pass — smaller individual clouds.\r
  let pw_med = sample_pw((p + wind) * 0.04);\r
  // Blend: large scale dominates shape; medium adds smaller clouds in sparser areas.\r
  let pw = pw_large * 0.6 + pw_med * 0.4;\r
  let hg = height_gradient(p.y);\r
  let cov = saturate(remap(pw, 1.0 - cloud.coverage, 1.0, 0.0, 1.0)) * hg;\r
  if (cov < 0.001) { return 0.0; }\r
  let detail_uv = p * 0.12 + wind * 0.1;\r
  let det = textureSampleLevel(detail_noise, noise_samp, detail_uv, 0.0);\r
  let detail = det.r * 0.5 + det.g * 0.25 + det.b * 0.125;\r
  return max(0.0, cov - (1.0 - cov) * detail * 0.3) * cloud.density;\r
}\r
\r
fn sample_density_coarse(p: vec3<f32>) -> f32 {\r
  let wind     = vec3<f32>(cloud.windOffset.x, 0.0, cloud.windOffset.y);\r
  let pw_large = sample_pw((p + wind * 0.5) * 0.012);\r
  let pw_med   = sample_pw((p + wind) * 0.04);\r
  let pw       = pw_large * 0.6 + pw_med * 0.4;\r
  let hg       = height_gradient(p.y);\r
  return saturate(remap(pw, 1.0 - cloud.coverage, 1.0, 0.0, 1.0)) * hg * cloud.density;\r
}\r
\r
fn light_march(p: vec3<f32>, sun_dir: vec3<f32>) -> f32 {\r
  let step_size = (cloud.cloudTop - cloud.cloudBase) / 2.0;\r
  var opt_depth = 0.0;\r
  for (var i = 0; i < 2; i++) {\r
    let sp = p + sun_dir * (f32(i) + 0.5) * step_size;\r
    if (sp.y < cloud.cloudBase || sp.y > cloud.cloudTop) { continue; }\r
    opt_depth += sample_density_coarse(sp) * step_size;\r
  }\r
  return exp(-opt_depth * cloud.extinction);\r
}\r
\r
fn ray_slab(ro: vec3<f32>, rd: vec3<f32>, y_min: f32, y_max: f32) -> vec2<f32> {\r
  if (abs(rd.y) < 1e-6) {\r
    if (ro.y < y_min || ro.y > y_max) {\r
      return vec2<f32>(-1.0, -1.0);\r
    }\r
    return vec2<f32>(0.0, 1e9);\r
  }\r
  let t0 = (y_min - ro.y) / rd.y;\r
  let t1 = (y_max - ro.y) / rd.y;\r
  let t_near = min(t0, t1);\r
  let t_far  = max(t0, t1);\r
  if (t_far < 0.0) {\r
    return vec2<f32>(-1.0, -1.0);\r
  }\r
  return vec2<f32>(max(t_near, 0.0), t_far);\r
}\r
\r
// ---- Fragment shader ---------------------------------------------------------\r
\r
@fragment\r
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {\r
  let ndc     = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, 1.0, 1.0);\r
  let world_h = camera.invViewProj * ndc;\r
  let ray_dir = normalize(world_h.xyz / world_h.w - camera.position);\r
\r
  let sun_dir = normalize(-light.direction);\r
  let camH    = max(camera.position.y, 1.0);\r
  let atm_ro  = vec3<f32>(0.0, R_E + camH, 0.0);\r
  let sky_color = scatter_sky(atm_ro, ray_dir, sun_dir);\r
\r
  // Clip ray at scene geometry\r
  let geo_depth = textureLoad(depth_tex, vec2<i32>(in.clip_pos.xy), 0);\r
  var geo_dist  = 1e9;\r
  if (geo_depth < 1.0) {\r
    let ndc_geo = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, geo_depth, 1.0);\r
    let geo_h   = camera.invViewProj * ndc_geo;\r
    let geo_pos = geo_h.xyz / geo_h.w;\r
    geo_dist    = distance(geo_pos, camera.position);\r
  }\r
\r
  let moon_dir  = -sun_dir;\r
  let night_t   = saturate((-sun_dir.y - 0.05) * 10.0);\r
\r
  // Intersect ray with cloud slab\r
  let slab = ray_slab(camera.position, ray_dir, cloud.cloudBase, cloud.cloudTop);\r
  if (slab.x < 0.0 || slab.x > geo_dist) {\r
    var color = sky_color;\r
    if (dot(ray_dir, sun_dir) > SUN_COS_THRESH && geo_depth >= 1.0) {\r
      color += sky_transmittance(atm_ro, sun_dir) * 1000.0;\r
    }\r
    if (dot(ray_dir, moon_dir) > MOON_COS_THRESH && geo_depth >= 1.0) {\r
      color += sky_transmittance(atm_ro, moon_dir) * vec3<f32>(0.85, 0.90, 1.0) * 15.0 * night_t;\r
    }\r
    return vec4<f32>(color, 1.0);\r
  }\r
\r
  let t_end  = min(min(slab.y, geo_dist), 200.0);\r
  if (t_end <= slab.x) {\r
    return vec4<f32>(sky_color, 1.0);\r
  }\r
\r
  // Primary ray march (24 steps, IGN jitter for TAA)\r
  let step_size = (t_end - slab.x) / 24.0;\r
  let coord     = vec2<i32>(in.clip_pos.xy);\r
  let jitter    = fract(52.9829189 * fract(0.06711056 * f32(coord.x) + 0.00583715 * f32(coord.y)));\r
  let t_start   = slab.x + jitter * step_size;\r
  let cos_theta = dot(ray_dir, sun_dir);\r
  let phase     = dual_phase(cos_theta, cloud.anisotropy);\r
\r
  var cloud_color = vec3<f32>(0.0);\r
  var total_trans = 1.0;\r
\r
  for (var i = 0; i < 24; i++) {\r
    let t = t_start + f32(i) * step_size;\r
    if (t >= t_end) { break; }\r
    let p = camera.position + ray_dir * t;\r
\r
    let dens = sample_density(p);\r
    if (dens < 0.001) { continue; }\r
\r
    let shadow_t    = light_march(p, sun_dir);\r
    let height_frac = clamp((p.y - cloud.cloudBase) / max(cloud.cloudTop - cloud.cloudBase, 0.001), 0.0, 1.0);\r
\r
    let sun_energy = light.color * light.intensity * shadow_t * phase;\r
    let amb_energy = cloud.ambientColor * mix(0.5, 1.0, height_frac);\r
\r
    let opt    = dens * cloud.extinction * step_size;\r
    let t_step = exp(-opt);\r
\r
    cloud_color += (sun_energy + amb_energy) * (1.0 - t_step) * total_trans;\r
    total_trans *= t_step;\r
\r
    if (total_trans < 0.01) { break; }\r
  }\r
\r
  var final_color = cloud_color + sky_color * total_trans;\r
  if (dot(ray_dir, sun_dir) > SUN_COS_THRESH && geo_depth >= 1.0) {\r
    final_color += sky_transmittance(atm_ro, sun_dir) * total_trans * 1000.0;\r
  }\r
  if (dot(ray_dir, moon_dir) > MOON_COS_THRESH && geo_depth >= 1.0) {\r
    final_color += sky_transmittance(atm_ro, moon_dir) * total_trans * vec3<f32>(0.85, 0.90, 1.0) * 15.0 * night_t;\r
  }\r
  return vec4<f32>(final_color, 1.0);\r
}\r
`,Pe=96,Te=48,Ue=32;class Qe extends D{constructor(e,r,t,a,i,c,l,o,u){super();s(this,"name","CloudPass");s(this,"_pipeline");s(this,"_hdrView");s(this,"_cameraBuffer");s(this,"_cloudBuffer");s(this,"_lightBuffer");s(this,"_sceneBG");s(this,"_lightBG");s(this,"_depthBG");s(this,"_noiseSkyBG");this._pipeline=e,this._hdrView=r,this._cameraBuffer=t,this._cloudBuffer=a,this._lightBuffer=i,this._sceneBG=c,this._lightBG=l,this._depthBG=o,this._noiseSkyBG=u}static create(e,r,t,a){const{device:i}=e,c=i.createBuffer({label:"CloudCameraBuffer",size:Pe,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),l=i.createBuffer({label:"CloudUniformBuffer",size:Te,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),o=i.createBuffer({label:"CloudLightBuffer",size:Ue,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),u=i.createBindGroupLayout({label:"CloudSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),p=i.createBindGroupLayout({label:"CloudLightBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),d=i.createBindGroupLayout({label:"CloudDepthBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),f=i.createBindGroupLayout({label:"CloudNoiseSkyBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),_=i.createSampler({label:"CloudNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"repeat",addressModeV:"repeat",addressModeW:"repeat"}),h=i.createSampler({label:"CloudDepthSampler"}),v=i.createBindGroup({label:"CloudSceneBG",layout:u,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:l}}]}),g=i.createBindGroup({label:"CloudLightBG",layout:p,entries:[{binding:0,resource:{buffer:o}}]}),b=i.createBindGroup({label:"CloudDepthBG",layout:d,entries:[{binding:0,resource:t},{binding:1,resource:h}]}),x=i.createBindGroup({label:"CloudNoiseSkyBG",layout:f,entries:[{binding:0,resource:a.baseView},{binding:1,resource:a.detailView},{binding:2,resource:_}]}),y=i.createShaderModule({label:"CloudShader",code:Vr}),w=i.createRenderPipeline({label:"CloudPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[u,p,d,f]}),vertex:{module:y,entryPoint:"vs_main"},fragment:{module:y,entryPoint:"fs_main",targets:[{format:V}]},primitive:{topology:"triangle-list"}});return new Qe(w,r,c,l,o,v,g,b,x)}updateCamera(e,r,t,a,i){const c=new Float32Array(Pe/4);c.set(r.data,0),c[16]=t.x,c[17]=t.y,c[18]=t.z,c[19]=a,c[20]=i,e.queue.writeBuffer(this._cameraBuffer,0,c.buffer)}updateLight(e,r,t,a){const i=new Float32Array(Ue/4);i[0]=r.x,i[1]=r.y,i[2]=r.z,i[3]=a,i[4]=t.x,i[5]=t.y,i[6]=t.z,e.queue.writeBuffer(this._lightBuffer,0,i.buffer)}updateSettings(e,r){const t=new Float32Array(Te/4);t[0]=r.cloudBase,t[1]=r.cloudTop,t[2]=r.coverage,t[3]=r.density,t[4]=r.windOffset[0],t[5]=r.windOffset[1],t[6]=r.anisotropy,t[7]=r.extinction,t[8]=r.ambientColor[0],t[9]=r.ambientColor[1],t[10]=r.ambientColor[2],t[11]=r.exposure,e.queue.writeBuffer(this._cloudBuffer,0,t.buffer)}execute(e,r){const t=e.beginRenderPass({label:"CloudPass",colorAttachments:[{view:this._hdrView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});t.setPipeline(this._pipeline),t.setBindGroup(0,this._sceneBG),t.setBindGroup(1,this._lightBG),t.setBindGroup(2,this._depthBG),t.setBindGroup(3,this._noiseSkyBG),t.draw(3),t.end()}destroy(){this._cameraBuffer.destroy(),this._cloudBuffer.destroy(),this._lightBuffer.destroy()}}const zr=`// Cloud shadow pass — renders a top-down cloud transmittance map (1024×1024 r8unorm).\r
// For each texel, marches 32 steps vertically through the cloud slab and accumulates\r
// optical depth, then outputs Beer's-law transmittance.\r
\r
const PI: f32 = 3.14159265358979323846;\r
\r
struct CloudShadowUniforms {\r
  cloudBase    : f32,\r
  cloudTop     : f32,\r
  coverage     : f32,\r
  density      : f32,\r
  windOffset   : vec2<f32>,   // XZ animated offset\r
  worldOriginX : f32,         // world-space XZ centre of the shadow map\r
  worldOriginZ : f32,\r
  worldExtent  : f32,         // half-size in world units (map covers ±worldExtent)\r
  extinction   : f32,\r
  _pad0        : f32,\r
  _pad1        : f32,\r
}\r
\r
@group(0) @binding(0) var<uniform> params     : CloudShadowUniforms;\r
@group(1) @binding(0) var          base_noise  : texture_3d<f32>;\r
@group(1) @binding(1) var          detail_noise: texture_3d<f32>;\r
@group(1) @binding(2) var          noise_samp  : sampler;\r
\r
struct VertexOutput {\r
  @builtin(position) clip_pos: vec4<f32>,\r
  @location(0)       uv      : vec2<f32>,\r
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
fn remap(v: f32, lo: f32, hi: f32, a: f32, b: f32) -> f32 {\r
  return clamp(a + (v - lo) / max(hi - lo, 0.0001) * (b - a), a, b);\r
}\r
\r
fn height_gradient(y: f32) -> f32 {\r
  let t = clamp((y - params.cloudBase) / max(params.cloudTop - params.cloudBase, 0.001), 0.0, 1.0);\r
  let base = remap(t, 0.0, 0.07, 0.0, 1.0);\r
  let top  = remap(t, 0.2, 1.0,  1.0, 0.0);\r
  return saturate(base * top);\r
}\r
\r
fn sample_density(world_pos: vec3<f32>) -> f32 {\r
  let scale = 0.04;\r
  let base_uv = (world_pos + vec3<f32>(params.windOffset.x, 0.0, params.windOffset.y)) * scale;\r
  let base = textureSampleLevel(base_noise, noise_samp, base_uv, 0.0);\r
\r
  // Perlin-Worley blend\r
  let pw = base.r * 0.625 + (1.0 - base.g) * 0.25 + (1.0 - base.b) * 0.125;\r
  let hg = height_gradient(world_pos.y);\r
  let cov = saturate(remap(pw, 1.0 - params.coverage, 1.0, 0.0, 1.0)) * hg;\r
  if (cov < 0.001) { return 0.0; }\r
\r
  let detail_scale = 0.12;\r
  let detail_uv = world_pos * detail_scale + vec3<f32>(params.windOffset.x, 0.0, params.windOffset.y) * 0.1;\r
  let det = textureSampleLevel(detail_noise, noise_samp, detail_uv, 0.0);\r
  let detail = det.r * 0.5 + det.g * 0.25 + det.b * 0.125;\r
\r
  return max(0.0, cov - (1.0 - cov) * detail * 0.3) * params.density;\r
}\r
\r
@fragment\r
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {\r
  // Map UV to world XZ position\r
  let world_x = params.worldOriginX + (in.uv.x - 0.5) * params.worldExtent * 2.0;\r
  let world_z = params.worldOriginZ + (in.uv.y - 0.5) * params.worldExtent * 2.0;\r
\r
  let slab_h = params.cloudTop - params.cloudBase;\r
  let step_h = slab_h / 16.0;\r
\r
  var opt_depth = 0.0;\r
  for (var i = 0; i < 16; i++) {\r
    let y = params.cloudBase + (f32(i) + 0.5) * step_h;\r
    opt_depth += sample_density(vec3<f32>(world_x, y, world_z)) * step_h;\r
  }\r
\r
  let transmittance = exp(-opt_depth * params.extinction);\r
  return vec4<f32>(transmittance, 0.0, 0.0, 1.0);\r
}\r
`,Me=1024,Ae="r8unorm",Ee=48;class er extends D{constructor(e,r,t,a,i,c){super();s(this,"name","CloudShadowPass");s(this,"shadowTexture");s(this,"shadowView");s(this,"_pipeline");s(this,"_uniformBuffer");s(this,"_uniformBG");s(this,"_noiseBG");s(this,"_frameCount",0);this.shadowTexture=e,this.shadowView=r,this._pipeline=t,this._uniformBuffer=a,this._uniformBG=i,this._noiseBG=c}static create(e,r){const{device:t}=e,a=t.createTexture({label:"CloudShadowTexture",size:{width:Me,height:Me},format:Ae,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),i=a.createView(),c=t.createBuffer({label:"CloudShadowUniform",size:Ee,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),l=t.createBindGroupLayout({label:"CloudShadowUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),o=t.createSampler({label:"CloudNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"repeat",addressModeV:"repeat",addressModeW:"repeat"}),u=t.createBindGroupLayout({label:"CloudShadowNoiseBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),p=t.createBindGroup({label:"CloudShadowUniformBG",layout:l,entries:[{binding:0,resource:{buffer:c}}]}),d=t.createBindGroup({label:"CloudShadowNoiseBG",layout:u,entries:[{binding:0,resource:r.baseView},{binding:1,resource:r.detailView},{binding:2,resource:o}]}),f=t.createShaderModule({label:"CloudShadowShader",code:zr}),_=t.createRenderPipeline({label:"CloudShadowPipeline",layout:t.createPipelineLayout({bindGroupLayouts:[l,u]}),vertex:{module:f,entryPoint:"vs_main"},fragment:{module:f,entryPoint:"fs_main",targets:[{format:Ae}]},primitive:{topology:"triangle-list"}});return new er(a,i,_,c,p,d)}update(e,r,t,a){const i=new Float32Array(Ee/4);i[0]=r.cloudBase,i[1]=r.cloudTop,i[2]=r.coverage,i[3]=r.density,i[4]=r.windOffset[0],i[5]=r.windOffset[1],i[6]=t[0],i[7]=t[1],i[8]=a,i[9]=r.extinction,e.queue.writeBuffer(this._uniformBuffer,0,i.buffer)}execute(e,r){if(this._frameCount++%2!==0)return;const t=e.beginRenderPass({label:"CloudShadowPass",colorAttachments:[{view:this.shadowView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});t.setPipeline(this._pipeline),t.setBindGroup(0,this._uniformBG),t.setBindGroup(1,this._noiseBG),t.draw(3),t.end()}destroy(){this.shadowTexture.destroy(),this._uniformBuffer.destroy()}}const Cr=`// TAA resolve pass — fullscreen triangle, blends current HDR with reprojected history.\r
\r
struct TAAUniforms {\r
  invViewProj : mat4x4<f32>, // current frame, un-jittered\r
  prevViewProj: mat4x4<f32>, // previous frame, un-jittered\r
}\r
\r
@group(0) @binding(0) var<uniform> taa : TAAUniforms;\r
\r
@group(1) @binding(0) var current_hdr   : texture_2d<f32>;\r
@group(1) @binding(1) var history_tex   : texture_2d<f32>;\r
@group(1) @binding(2) var depth_tex     : texture_depth_2d;\r
@group(1) @binding(3) var linear_sampler: sampler;\r
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
fn reconstruct_world_pos(uv: vec2<f32>, depth: f32) -> vec4<f32> {\r
  let ndc = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);\r
  return taa.invViewProj * ndc;\r
}\r
\r
@fragment\r
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {\r
  let coord = vec2<i32>(in.clip_pos.xy);\r
\r
  let current = textureLoad(current_hdr, coord, 0).rgb;\r
\r
  // Background: no history to blend\r
  let depth = textureLoad(depth_tex, coord, 0);\r
  if (depth >= 1.0) {\r
    return vec4<f32>(current, 1.0);\r
  }\r
\r
  // 3x3 neighborhood AABB for history clamping\r
  var c_min = current;\r
  var c_max = current;\r
  for (var dy = -1; dy <= 1; dy++) {\r
    for (var dx = -1; dx <= 1; dx++) {\r
      if (dx == 0 && dy == 0) { continue; }\r
      let s = textureLoad(current_hdr, coord + vec2<i32>(dx, dy), 0).rgb;\r
      c_min = min(c_min, s);\r
      c_max = max(c_max, s);\r
    }\r
  }\r
\r
  // Reconstruct world position and reproject into previous frame\r
  let world_h   = reconstruct_world_pos(in.uv, depth);\r
  let world_pos = world_h.xyz / world_h.w;\r
\r
  let prev_clip = taa.prevViewProj * vec4<f32>(world_pos, 1.0);\r
  let prev_ndc  = prev_clip.xyz / prev_clip.w;\r
  let prev_uv   = vec2<f32>(prev_ndc.x * 0.5 + 0.5, -prev_ndc.y * 0.5 + 0.5);\r
\r
  // Outside previous frustum → accept current frame fully\r
  let in_bounds = prev_uv.x >= 0.0 && prev_uv.x <= 1.0\r
               && prev_uv.y >= 0.0 && prev_uv.y <= 1.0;\r
  if (!in_bounds) {\r
    return vec4<f32>(current, 1.0);\r
  }\r
\r
  var history = textureSampleLevel(history_tex, linear_sampler, prev_uv, 0.0).rgb;\r
  // Clamp history to current neighborhood to suppress ghosting\r
  history = clamp(history, c_min, c_max);\r
\r
  // 10% current frame, 90% history\r
  return vec4<f32>(mix(history, current, 0.1), 1.0);\r
}\r
`,Re=128;class rr extends D{constructor(e,r,t,a,i,c,l,o,u,p){super();s(this,"name","TAAPass");s(this,"_resolved");s(this,"resolvedView");s(this,"_history");s(this,"_historyView");s(this,"_pipeline");s(this,"_uniformBuffer");s(this,"_uniformBG");s(this,"_textureBG");s(this,"_width");s(this,"_height");this._resolved=e,this.resolvedView=r,this._history=t,this._historyView=a,this._pipeline=i,this._uniformBuffer=c,this._uniformBG=l,this._textureBG=o,this._width=u,this._height=p}get historyView(){return this._historyView}static create(e,r,t){const{device:a,width:i,height:c}=e,l=a.createTexture({label:"TAA Resolved",size:{width:i,height:c},format:V,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),o=a.createTexture({label:"TAA History",size:{width:i,height:c},format:V,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),u=l.createView(),p=o.createView(),d=a.createBuffer({label:"TAAUniformBuffer",size:Re,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),f=a.createBindGroupLayout({label:"TAAUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),_=a.createBindGroupLayout({label:"TAATextureBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),h=a.createSampler({label:"TAALinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),v=a.createBindGroup({layout:f,entries:[{binding:0,resource:{buffer:d}}]}),g=a.createBindGroup({layout:_,entries:[{binding:0,resource:r.hdrView},{binding:1,resource:p},{binding:2,resource:t.depthView},{binding:3,resource:h}]}),b=a.createShaderModule({label:"TAAShader",code:Cr}),x=a.createRenderPipeline({label:"TAAPipeline",layout:a.createPipelineLayout({bindGroupLayouts:[f,_]}),vertex:{module:b,entryPoint:"vs_main"},fragment:{module:b,entryPoint:"fs_main",targets:[{format:V}]},primitive:{topology:"triangle-list"}});return new rr(l,u,o,p,x,d,v,g,i,c)}updateCamera(e,r,t){const a=new Float32Array(Re/4);a.set(r.data,0),a.set(t.data,16),e.queue.writeBuffer(this._uniformBuffer,0,a.buffer)}execute(e,r){const t=e.beginRenderPass({label:"TAAPass",colorAttachments:[{view:this.resolvedView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});t.setPipeline(this._pipeline),t.setBindGroup(0,this._uniformBG),t.setBindGroup(1,this._textureBG),t.draw(3),t.end(),e.copyTextureToTexture({texture:this._resolved},{texture:this._history},{width:this._width,height:this._height})}destroy(){this._resolved.destroy(),this._history.destroy(),this._uniformBuffer.destroy()}}const Or=`// Bloom: prefilter (downsample + threshold) and separable Gaussian blur.\r
// The composite step is in bloom_composite.wgsl.\r
\r
struct BloomUniforms {\r
  threshold: f32,\r
  knee     : f32,\r
  strength : f32,\r
  _pad     : f32,\r
}\r
\r
@group(0) @binding(0) var<uniform> bloom   : BloomUniforms;\r
@group(0) @binding(1) var          src_tex : texture_2d<f32>;\r
@group(0) @binding(2) var          src_samp: sampler;\r
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
// Prefilter: 2× downsample + soft-knee threshold.\r
// UV is mapped to the half-res output; src_tex is the full-res HDR.\r
@fragment\r
fn fs_prefilter(in: VertexOutput) -> @location(0) vec4<f32> {\r
  let texel = 1.0 / vec2<f32>(textureDimensions(src_tex));\r
  let c = (\r
    textureSample(src_tex, src_samp, in.uv + vec2(-0.5, -0.5) * texel) +\r
    textureSample(src_tex, src_samp, in.uv + vec2( 0.5, -0.5) * texel) +\r
    textureSample(src_tex, src_samp, in.uv + vec2(-0.5,  0.5) * texel) +\r
    textureSample(src_tex, src_samp, in.uv + vec2( 0.5,  0.5) * texel)\r
  ).rgb * 0.25;\r
\r
  // Soft knee: smooth ramp from (threshold - knee) to (threshold + knee)\r
  let brightness = max(c.r, max(c.g, c.b));\r
  let rq         = clamp(brightness - bloom.threshold + bloom.knee, 0.0, 2.0 * bloom.knee);\r
  let weight     = max(bloom.knee * rq * rq, brightness - bloom.threshold)\r
                 / max(brightness, 0.0001);\r
  return vec4<f32>(c * weight, 1.0);\r
}\r
\r
// 9-tap separable Gaussian, sigma ≈ 2.  Weights are normalised to sum 1.\r
const W0: f32 = 0.20416;\r
const W1: f32 = 0.18009;\r
const W2: f32 = 0.12388;\r
const W3: f32 = 0.06626;\r
const W4: f32 = 0.02763;\r
\r
@fragment\r
fn fs_blur_h(in: VertexOutput) -> @location(0) vec4<f32> {\r
  let tx = 1.0 / f32(textureDimensions(src_tex).x);\r
  var c  = textureSample(src_tex, src_samp, in.uv).rgb * W0;\r
  c += textureSample(src_tex, src_samp, in.uv + vec2( tx, 0.0)).rgb * W1;\r
  c += textureSample(src_tex, src_samp, in.uv + vec2(-tx, 0.0)).rgb * W1;\r
  c += textureSample(src_tex, src_samp, in.uv + vec2( 2.0*tx, 0.0)).rgb * W2;\r
  c += textureSample(src_tex, src_samp, in.uv + vec2(-2.0*tx, 0.0)).rgb * W2;\r
  c += textureSample(src_tex, src_samp, in.uv + vec2( 3.0*tx, 0.0)).rgb * W3;\r
  c += textureSample(src_tex, src_samp, in.uv + vec2(-3.0*tx, 0.0)).rgb * W3;\r
  c += textureSample(src_tex, src_samp, in.uv + vec2( 4.0*tx, 0.0)).rgb * W4;\r
  c += textureSample(src_tex, src_samp, in.uv + vec2(-4.0*tx, 0.0)).rgb * W4;\r
  return vec4<f32>(c, 1.0);\r
}\r
\r
@fragment\r
fn fs_blur_v(in: VertexOutput) -> @location(0) vec4<f32> {\r
  let ty = 1.0 / f32(textureDimensions(src_tex).y);\r
  var c  = textureSample(src_tex, src_samp, in.uv).rgb * W0;\r
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0,  ty)).rgb * W1;\r
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0, -ty)).rgb * W1;\r
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0,  2.0*ty)).rgb * W2;\r
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0, -2.0*ty)).rgb * W2;\r
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0,  3.0*ty)).rgb * W3;\r
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0, -3.0*ty)).rgb * W3;\r
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0,  4.0*ty)).rgb * W4;\r
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0, -4.0*ty)).rgb * W4;\r
  return vec4<f32>(c, 1.0);\r
}\r
`,Ir=`// Bloom composite: adds the blurred bright regions back to the source HDR.\r
\r
struct BloomUniforms {\r
  threshold: f32,\r
  knee     : f32,\r
  strength : f32,\r
  _pad     : f32,\r
}\r
\r
@group(0) @binding(0) var<uniform> params   : BloomUniforms;\r
@group(0) @binding(1) var          hdr_tex  : texture_2d<f32>;\r
@group(0) @binding(2) var          bloom_tex: texture_2d<f32>;\r
@group(0) @binding(3) var          samp     : sampler;\r
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
@fragment\r
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {\r
  let hdr   = textureSample(hdr_tex,   samp, in.uv).rgb;\r
  // bloom_tex is half-res; bilinear upsample happens automatically\r
  let glow  = textureSample(bloom_tex, samp, in.uv).rgb;\r
  return vec4<f32>(hdr + glow * params.strength, 1.0);\r
}\r
`,Dr=16;class tr extends D{constructor(e,r,t,a,i,c,l,o,u,p,d,f,_,h,v){super();s(this,"name","BloomPass");s(this,"resultView");s(this,"_result");s(this,"_half1");s(this,"_half2");s(this,"_half1View");s(this,"_half2View");s(this,"_prefilterPipeline");s(this,"_blurHPipeline");s(this,"_blurVPipeline");s(this,"_compositePipeline");s(this,"_uniformBuffer");s(this,"_prefilterBG");s(this,"_blurHBG");s(this,"_blurVBG");s(this,"_compositeBG");this._result=e,this.resultView=r,this._half1=t,this._half1View=a,this._half2=i,this._half2View=c,this._prefilterPipeline=l,this._blurHPipeline=o,this._blurVPipeline=u,this._compositePipeline=p,this._uniformBuffer=d,this._prefilterBG=f,this._blurHBG=_,this._blurVBG=h,this._compositeBG=v}static create(e,r){const{device:t,width:a,height:i}=e,c=Math.max(1,a>>1),l=Math.max(1,i>>1),o=t.createTexture({label:"BloomHalf1",size:{width:c,height:l},format:V,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),u=t.createTexture({label:"BloomHalf2",size:{width:c,height:l},format:V,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),p=t.createTexture({label:"BloomResult",size:{width:a,height:i},format:V,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),d=o.createView(),f=u.createView(),_=p.createView(),h=t.createBuffer({label:"BloomUniforms",size:Dr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});t.queue.writeBuffer(h,0,new Float32Array([1,.5,.3,0]).buffer);const v=t.createSampler({label:"BloomSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),g=t.createBindGroupLayout({label:"BloomSingleBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),b=t.createBindGroupLayout({label:"BloomCompositeBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),x=t.createShaderModule({label:"BloomShader",code:Or}),y=t.createShaderModule({label:"BloomComposite",code:Ir}),w=t.createPipelineLayout({bindGroupLayouts:[g]}),S=t.createPipelineLayout({bindGroupLayouts:[b]});function B(C,I){return t.createRenderPipeline({label:I,layout:w,vertex:{module:x,entryPoint:"vs_main"},fragment:{module:x,entryPoint:C,targets:[{format:V}]},primitive:{topology:"triangle-list"}})}const P=B("fs_prefilter","BloomPrefilterPipeline"),E=B("fs_blur_h","BloomBlurHPipeline"),G=B("fs_blur_v","BloomBlurVPipeline"),U=t.createRenderPipeline({label:"BloomCompositePipeline",layout:S,vertex:{module:y,entryPoint:"vs_main"},fragment:{module:y,entryPoint:"fs_main",targets:[{format:V}]},primitive:{topology:"triangle-list"}});function M(C){return t.createBindGroup({layout:g,entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:C},{binding:2,resource:v}]})}const R=M(r),N=M(d),A=M(f),O=t.createBindGroup({layout:b,entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:r},{binding:2,resource:d},{binding:3,resource:v}]});return new tr(p,_,o,d,u,f,P,E,G,U,h,R,N,A,O)}updateParams(e,r=1,t=.5,a=.3){e.queue.writeBuffer(this._uniformBuffer,0,new Float32Array([r,t,a,0]).buffer)}execute(e,r){const t=(a,i,c,l)=>{const o=e.beginRenderPass({label:a,colorAttachments:[{view:i,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});o.setPipeline(c),o.setBindGroup(0,l),o.draw(3),o.end()};t("BloomPrefilter",this._half1View,this._prefilterPipeline,this._prefilterBG);for(let a=0;a<2;a++)t("BloomBlurH",this._half2View,this._blurHPipeline,this._blurHBG),t("BloomBlurV",this._half1View,this._blurVPipeline,this._blurVBG);t("BloomComposite",this.resultView,this._compositePipeline,this._compositeBG)}destroy(){this._result.destroy(),this._half1.destroy(),this._half2.destroy(),this._uniformBuffer.destroy()}}const Fr=`// composite.wgsl — Fog + Underwater + Tonemap merged into a single full-screen draw.\r
// Replaces FogPass → UnderwaterPass → TonemapPass, saving 2 intermediate HDR\r
// textures and 2 render-pass boundaries.\r
//\r
// Effect enable flags live in params.fog_flags and params.tonemap_flags so the GPU\r
// can branch them out without pipeline recompilation.\r
\r
const PI: f32 = 3.14159265358979;\r
\r
// ── Atmospheric scatter ────────────────────────────────────────────────────────\r
// Constants must match lighting.wgsl / fog.wgsl exactly.\r
\r
const ATM_R_E   : f32       = 6360000.0;\r
const ATM_R_A   : f32       = 6420000.0;\r
const ATM_H_R   : f32       = 8500.0;\r
const ATM_H_M   : f32       = 1200.0;\r
const ATM_G     : f32       = 0.758;\r
const ATM_BETA_R: vec3<f32> = vec3<f32>(5.5e-6, 13.0e-6, 22.4e-6);\r
const ATM_BETA_M: f32       = 21.0e-6;\r
const ATM_SUN_I : f32       = 20.0;\r
\r
fn atm_ray_sphere(ro: vec3<f32>, rd: vec3<f32>, r: f32) -> vec2<f32> {\r
  let b = dot(ro, rd); let c = dot(ro, ro) - r * r; let d = b * b - c;\r
  if (d < 0.0) { return vec2<f32>(-1.0, -1.0); }\r
  let sq = sqrt(d);\r
  return vec2<f32>(-b - sq, -b + sq);\r
}\r
\r
fn atm_optical_depth(pos: vec3<f32>, dir: vec3<f32>) -> vec2<f32> {\r
  let t = atm_ray_sphere(pos, dir, ATM_R_A); let ds = t.y / 4.0;\r
  var od = vec2<f32>(0.0);\r
  for (var i = 0; i < 4; i++) {\r
    let h = length(pos + dir * ((f32(i) + 0.5) * ds)) - ATM_R_E;\r
    if (h < 0.0) { break; }\r
    od += vec2<f32>(exp(-h / ATM_H_R), exp(-h / ATM_H_M)) * ds;\r
  }\r
  return od;\r
}\r
\r
fn atm_scatter(ro: vec3<f32>, rd: vec3<f32>, sun_dir: vec3<f32>) -> vec3<f32> {\r
  let ta = atm_ray_sphere(ro, rd, ATM_R_A); let tMin = max(ta.x, 0.0);\r
  if (ta.y < 0.0) { return vec3<f32>(0.0); }\r
  let tg   = atm_ray_sphere(ro, rd, ATM_R_E);\r
  let tMax = select(ta.y, min(ta.y, tg.x), tg.x > 0.0);\r
  if (tMax <= tMin) { return vec3<f32>(0.0); }\r
  let mu = dot(rd, sun_dir);\r
  let pR = (3.0 / (16.0 * PI)) * (1.0 + mu * mu);\r
  let g2 = ATM_G * ATM_G;\r
  let pM = (3.0 / (8.0 * PI)) * ((1.0 - g2) * (1.0 + mu * mu)) /\r
            ((2.0 + g2) * pow(max(1.0 + g2 - 2.0 * ATM_G * mu, 1e-4), 1.5));\r
  let ds = (tMax - tMin) / 6.0;\r
  var sumR = vec3<f32>(0.0); var sumM = vec3<f32>(0.0);\r
  var odR = 0.0; var odM = 0.0;\r
  for (var i = 0; i < 6; i++) {\r
    let pos = ro + rd * (tMin + (f32(i) + 0.5) * ds);\r
    let h   = length(pos) - ATM_R_E;\r
    if (h < 0.0) { break; }\r
    let hrh = exp(-h / ATM_H_R) * ds; let hmh = exp(-h / ATM_H_M) * ds;\r
    odR += hrh; odM += hmh;\r
    let tg2 = atm_ray_sphere(pos, sun_dir, ATM_R_E);\r
    if (tg2.x > 0.0) { continue; }\r
    let odL = atm_optical_depth(pos, sun_dir);\r
    let tau = ATM_BETA_R * (odR + odL.x) + ATM_BETA_M * 1.1 * (odM + odL.y);\r
    sumR += exp(-tau) * hrh; sumM += exp(-tau) * hmh;\r
  }\r
  return ATM_SUN_I * (ATM_BETA_R * pR * sumR + vec3<f32>(ATM_BETA_M) * pM * sumM);\r
}\r
\r
// ── Structs ───────────────────────────────────────────────────────────────────\r
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
// Only the first field of the full LightUniforms buffer is needed here.\r
struct LightDir { direction: vec3<f32>, }\r
\r
// Combined params buffer — 64 bytes.\r
// Layout (byte offsets):\r
//  0  fog_color      vec3<f32>\r
// 12  depth_density  f32\r
// 16  depth_begin    f32\r
// 20  depth_end      f32\r
// 24  depth_curve    f32\r
// 28  height_density f32\r
// 32  height_min     f32\r
// 36  height_max     f32\r
// 40  height_curve   f32\r
// 44  fog_flags      u32  bit 0 = depth fog, bit 1 = height fog\r
// 48  uw_time        f32\r
// 52  is_underwater  f32\r
// 56  tonemap_flags  u32  bit 0 = aces, bit 1 = debug_ao, bit 2 = hdr_canvas\r
// 60  _pad           f32\r
struct CompositeParams {\r
  fog_color      : vec3<f32>,\r
  depth_density  : f32,\r
  depth_begin    : f32,\r
  depth_end      : f32,\r
  depth_curve    : f32,\r
  height_density : f32,\r
  height_min     : f32,\r
  height_max     : f32,\r
  height_curve   : f32,\r
  fog_flags      : u32,\r
  uw_time        : f32,\r
  is_underwater  : f32,\r
  tonemap_flags  : u32,\r
  _pad           : f32,\r
}\r
\r
// invViewProj(64) + cam_pos(12) + pad(4) + sun_dir(12) + pad(4) = 96 bytes\r
struct StarUniforms {\r
  invViewProj: mat4x4<f32>,\r
  cam_pos    : vec3<f32>,\r
  _pad0      : f32,\r
  sun_dir    : vec3<f32>,\r
  _pad1      : f32,\r
}\r
\r
struct ExposureBuffer {\r
  value: f32,\r
  _p0  : f32, _p1: f32, _p2: f32,\r
}\r
\r
// ── Bindings ──────────────────────────────────────────────────────────────────\r
\r
@group(0) @binding(0) var hdr_tex : texture_2d<f32>;\r
@group(0) @binding(1) var ao_tex  : texture_2d<f32>;\r
@group(0) @binding(2) var dep_tex : texture_depth_2d;\r
@group(0) @binding(3) var samp    : sampler;\r
\r
@group(1) @binding(0) var<uniform> camera  : CameraUniforms;\r
@group(1) @binding(1) var<uniform> light   : LightDir;\r
\r
@group(2) @binding(0) var<uniform>        params   : CompositeParams;\r
@group(2) @binding(1) var<uniform>        star_uni : StarUniforms;\r
@group(2) @binding(2) var<storage, read>  exposure : ExposureBuffer;\r
\r
// ── Vertex shader ─────────────────────────────────────────────────────────────\r
\r
struct VertOut {\r
  @builtin(position) pos: vec4<f32>,\r
  @location(0)       uv : vec2<f32>,\r
}\r
\r
@vertex\r
fn vs_main(@builtin(vertex_index) vid: u32) -> VertOut {\r
  let x = f32((vid & 1u) << 2u) - 1.0;\r
  let y = f32((vid & 2u) << 1u) - 1.0;\r
  var out: VertOut;\r
  out.pos = vec4<f32>(x, y, 0.0, 1.0);\r
  out.uv  = vec2<f32>(x * 0.5 + 0.5, -y * 0.5 + 0.5);\r
  return out;\r
}\r
\r
// ── Star field ────────────────────────────────────────────────────────────────\r
\r
fn star_hash(p: vec2<f32>) -> f32 {\r
  return fract(sin(dot(p, vec2<f32>(127.1, 311.7))) * 43758.5453);\r
}\r
\r
fn star_hash2(p: vec2<f32>) -> vec2<f32> {\r
  return fract(sin(vec2<f32>(\r
    dot(p, vec2<f32>(127.1, 311.7)),\r
    dot(p, vec2<f32>(269.5, 183.3)),\r
  )) * 43758.5453);\r
}\r
\r
fn dir_to_equirect(d: vec3<f32>) -> vec2<f32> {\r
  let u = atan2(d.x, -d.z) / (2.0 * PI) + 0.5;\r
  let v = 0.5 - asin(clamp(d.y, -1.0, 1.0)) / PI;\r
  return vec2<f32>(u, v);\r
}\r
\r
fn sample_stars(ray_dir: vec3<f32>) -> vec3<f32> {\r
  let GRID    = vec2<f32>(300.0, 150.0);\r
  let uv      = dir_to_equirect(ray_dir);\r
  let gcoord  = uv * GRID;\r
  let cell    = floor(gcoord);\r
  let frac_uv = fract(gcoord);\r
  let lat     = (0.5 - uv.y) * PI;\r
  let cos_lat = max(cos(lat), 0.15);\r
  var color   = vec3<f32>(0.0);\r
\r
  for (var dy: i32 = -1; dy <= 1; dy++) {\r
    for (var dx: i32 = -1; dx <= 1; dx++) {\r
      var nc = cell + vec2<f32>(f32(dx), f32(dy));\r
      if (nc.y < 0.0 || nc.y >= GRID.y) { continue; }\r
      nc.x = nc.x - floor(nc.x / GRID.x) * GRID.x;\r
      let h           = star_hash2(nc);\r
      let cell_lat    = (0.5 - (nc.y + 0.5) / GRID.y) * PI;\r
      let star_thresh = 1.0 - 0.18 * max(cos(cell_lat), 0.0);\r
      if (h.x > star_thresh) {\r
        let off     = star_hash2(nc + vec2<f32>(7.3, 3.7)) * 0.8 + 0.1;\r
        let to_star = frac_uv - vec2<f32>(f32(dx), f32(dy)) - off;\r
        let ts_s    = vec2<f32>(to_star.x * cos_lat, to_star.y);\r
        let dist2   = dot(ts_s, ts_s);\r
        let glow    = exp(-dist2 * 500.0);\r
        if (glow < 0.002) { continue; }\r
        let mag  = pow(star_hash(nc + vec2<f32>(1.5, 0.0)), 1.8);\r
        let br   = glow * (0.15 + mag * 0.85);\r
        let roll = star_hash(nc + vec2<f32>(2.5, 0.0));\r
        var sc   = vec3<f32>(1.0);\r
        if      (roll < 0.06) { sc = vec3<f32>(0.65, 0.76, 1.0);  }\r
        else if (roll < 0.20) { sc = vec3<f32>(0.82, 0.89, 1.0);  }\r
        else if (roll < 0.44) { sc = vec3<f32>(1.0,  1.0,  0.82); }\r
        else if (roll < 0.57) { sc = vec3<f32>(1.0,  0.78, 0.51); }\r
        else if (roll < 0.64) { sc = vec3<f32>(1.0,  0.51, 0.25); }\r
        color += sc * br;\r
      }\r
    }\r
  }\r
  return color;\r
}\r
\r
// ── ACES filmic ───────────────────────────────────────────────────────────────\r
\r
fn aces_filmic(x: vec3<f32>) -> vec3<f32> {\r
  let a = 2.51; let b = 0.03; let c = 2.43; let d = 0.59; let e = 0.14;\r
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), vec3<f32>(0.0), vec3<f32>(1.0));\r
}\r
\r
// ── Fragment shader ───────────────────────────────────────────────────────────\r
\r
@fragment\r
fn fs_main(in: VertOut) -> @location(0) vec4<f32> {\r
  let coord = vec2<i32>(in.pos.xy);\r
\r
  // Debug AO mode — short-circuit everything else.\r
  if ((params.tonemap_flags & 2u) != 0u) {\r
    let ao = textureLoad(ao_tex, coord / 2, 0).r;\r
    return vec4<f32>(ao, ao, ao, 1.0);\r
  }\r
\r
  // --- Underwater UV distortion ---\r
  var sample_uv = in.uv;\r
  if (params.is_underwater > 0.5) {\r
    let t = params.uw_time;\r
    let distort = vec2<f32>(\r
      sin(in.uv.y * 18.0 + t * 1.4) * 0.006,\r
      cos(in.uv.x * 14.0 + t * 1.1) * 0.004,\r
    );\r
    sample_uv = clamp(in.uv + distort, vec2<f32>(0.001), vec2<f32>(0.999));\r
  }\r
\r
  // --- Sample HDR scene ---\r
  var scene = textureSample(hdr_tex, samp, sample_uv).rgb;\r
\r
  let depth = textureLoad(dep_tex, coord, 0u);\r
\r
  // --- Fog (skipped for sky pixels and when no fog mode is active) ---\r
  if (depth < 1.0 && (params.fog_flags & 3u) != 0u) {\r
    let ndc       = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, depth, 1.0);\r
    let world_h   = camera.invViewProj * ndc;\r
    let world_pos = world_h.xyz / world_h.w;\r
    let view_pos  = camera.view * vec4<f32>(world_pos, 1.0);\r
    let view_dist = length(view_pos.xyz);\r
\r
    let sun_dir = normalize(-light.direction);\r
    let cam_h   = max(camera.position.y, 0.0);\r
    let atm_ro  = vec3<f32>(0.0, ATM_R_E + cam_h, 0.0);\r
    let ray_vec = world_pos - camera.position;\r
    let ray_dir = normalize(ray_vec);\r
    let h2      = vec3<f32>(ray_dir.x, 0.0, ray_dir.z);\r
    let len2    = dot(h2, h2);\r
    let fog_dir = select(normalize(h2), vec3<f32>(1.0, 0.0, 0.0), len2 < 1e-6);\r
    let fog_col = atm_scatter(atm_ro, fog_dir, sun_dir) * params.fog_color;\r
\r
    var fog_amount = 0.0;\r
    if ((params.fog_flags & 1u) != 0u && params.depth_density > 0.0) {\r
      let far = select(params.depth_end, camera.far, params.depth_end <= 0.0);\r
      let t   = smoothstep(params.depth_begin, far, view_dist);\r
      fog_amount = max(fog_amount, pow(t, params.depth_curve) * params.depth_density);\r
    }\r
    if ((params.fog_flags & 2u) != 0u && params.height_density > 0.0) {\r
      let t = smoothstep(params.height_min, params.height_max, world_pos.y);\r
      fog_amount = max(fog_amount, pow(t, params.height_curve) * params.height_density);\r
    }\r
    scene = mix(scene, fog_col, clamp(fog_amount, 0.0, 1.0));\r
  }\r
\r
  // --- Underwater tint + vignette ---\r
  if (params.is_underwater > 0.5) {\r
    scene = scene * vec3<f32>(0.20, 0.55, 0.90);\r
    let d = length(in.uv * 2.0 - 1.0);\r
    scene *= clamp(1.0 - d * d * 0.55, 0.0, 1.0);\r
  }\r
\r
  // --- Exposure ---\r
  scene *= exposure.value;\r
\r
  // --- Stars (sky pixels only, rendered after DoF/Bloom for crisp point sources) ---\r
  if (depth >= 1.0) {\r
    let ndc     = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, 1.0, 1.0);\r
    let world_h = star_uni.invViewProj * ndc;\r
    let ray_dir = normalize(world_h.xyz / world_h.w - star_uni.cam_pos);\r
    if (ray_dir.y > -0.05) {\r
      let night_t     = saturate((-star_uni.sun_dir.y - 0.05) * 10.0);\r
      let above_horiz = saturate(ray_dir.y * 20.0);\r
      let star_fade   = night_t * above_horiz;\r
      if (star_fade > 0.001) {\r
        scene += sample_stars(ray_dir) * (star_fade * 2.0);\r
      }\r
    }\r
  }\r
\r
  // --- Tonemap + gamma ---\r
  if ((params.tonemap_flags & 4u) != 0u) {\r
    // HDR canvas mode: skip ACES, just gamma-encode.\r
    return vec4<f32>(pow(max(scene, vec3<f32>(0.0)), vec3<f32>(1.0 / 2.2)), 1.0);\r
  }\r
  let ldr = select(scene, aces_filmic(scene), (params.tonemap_flags & 1u) != 0u);\r
  return vec4<f32>(pow(ldr, vec3<f32>(1.0 / 2.2)), 1.0);\r
}\r
`,Le=64,Ne=96;class nr extends D{constructor(e,r,t,a,i,c){super();s(this,"name","CompositePass");s(this,"depthFogEnabled",!0);s(this,"depthDensity",1);s(this,"depthBegin",32);s(this,"depthEnd",128);s(this,"depthCurve",1.5);s(this,"heightFogEnabled",!1);s(this,"heightDensity",.7);s(this,"heightMin",48);s(this,"heightMax",80);s(this,"heightCurve",1);s(this,"fogColor",[1,1,1]);s(this,"_pipeline");s(this,"_bg0");s(this,"_bg1");s(this,"_bg2");s(this,"_paramsBuf");s(this,"_starBuf");this._pipeline=e,this._bg0=r,this._bg1=t,this._bg2=a,this._paramsBuf=i,this._starBuf=c}static create(e,r,t,a,i,c,l){const{device:o,format:u}=e,p=o.createBindGroupLayout({label:"CompositeBGL0",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),d=o.createBindGroupLayout({label:"CompositeBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),f=o.createBindGroupLayout({label:"CompositeBGL2",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),_=o.createSampler({label:"CompositeSampler",magFilter:"linear",minFilter:"linear"}),h=o.createBuffer({label:"CompositeParams",size:Le,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),v=o.createBuffer({label:"CompositeStars",size:Ne,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),g=o.createBindGroup({label:"CompositeBG0",layout:p,entries:[{binding:0,resource:r},{binding:1,resource:t},{binding:2,resource:a},{binding:3,resource:_}]}),b=o.createBindGroup({label:"CompositeBG1",layout:d,entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:c}}]}),x=o.createBindGroup({label:"CompositeBG2",layout:f,entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:{buffer:v}},{binding:2,resource:{buffer:l}}]}),y=o.createShaderModule({label:"CompositeShader",code:Fr}),w=o.createPipelineLayout({bindGroupLayouts:[p,d,f]}),S=o.createRenderPipeline({label:"CompositePipeline",layout:w,vertex:{module:y,entryPoint:"vs_main"},fragment:{module:y,entryPoint:"fs_main",targets:[{format:u}]},primitive:{topology:"triangle-list"}});return new nr(S,g,b,x,h,v)}updateParams(e,r,t,a,i,c){const l=new ArrayBuffer(Le),o=new Float32Array(l),u=new Uint32Array(l);let p=0;this.depthFogEnabled&&(p|=1),this.heightFogEnabled&&(p|=2);let d=0;a&&(d|=1),i&&(d|=2),c&&(d|=4),o[0]=this.fogColor[0],o[1]=this.fogColor[1],o[2]=this.fogColor[2],o[3]=this.depthDensity,o[4]=this.depthBegin,o[5]=this.depthEnd,o[6]=this.depthCurve,o[7]=this.heightDensity,o[8]=this.heightMin,o[9]=this.heightMax,o[10]=this.heightCurve,u[11]=p,o[12]=t,o[13]=r?1:0,u[14]=d,o[15]=0,e.queue.writeBuffer(this._paramsBuf,0,l)}updateStars(e,r,t,a){const i=new Float32Array(Ne/4);i.set(r.data,0),i[16]=t.x,i[17]=t.y,i[18]=t.z,i[19]=0,i[20]=a.x,i[21]=a.y,i[22]=a.z,i[23]=0,e.queue.writeBuffer(this._starBuf,0,i.buffer)}execute(e,r){const t=e.beginRenderPass({label:"CompositePass",colorAttachments:[{view:r.getCurrentTexture().createView(),clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});t.setPipeline(this._pipeline),t.setBindGroup(0,this._bg0),t.setBindGroup(1,this._bg1),t.setBindGroup(2,this._bg2),t.draw(3),t.end()}destroy(){this._paramsBuf.destroy(),this._starBuf.destroy()}}const kr=`// GBuffer fill pass — writes albedo+roughness and normal+metallic.\r
// Group 3 texture maps are optional; the geometry pass binds 1×1 fallbacks when unset.\r
\r
struct CameraUniforms {\r
  view      : mat4x4<f32>,\r
  proj      : mat4x4<f32>,\r
  viewProj  : mat4x4<f32>,\r
  invViewProj: mat4x4<f32>,\r
  position  : vec3<f32>,\r
  near      : f32,\r
  far       : f32,\r
}\r
\r
struct ModelUniforms {\r
  model       : mat4x4<f32>,\r
  normalMatrix: mat4x4<f32>,\r
}\r
\r
struct MaterialUniforms {\r
  albedo   : vec4<f32>,    // offset  0\r
  roughness: f32,          // offset 16\r
  metallic : f32,          // offset 20\r
  uvOffset : vec2<f32>,    // offset 24  atlas tile offset (0,0 = identity)\r
  uvScale  : vec2<f32>,    // offset 32  atlas tile scale  (1,1 = identity)\r
  uvTile   : vec2<f32>,    // offset 40  repetitions across the mesh surface (1,1 = no tiling)\r
}\r
\r
@group(0) @binding(0) var<uniform> camera  : CameraUniforms;\r
@group(1) @binding(0) var<uniform> model   : ModelUniforms;\r
@group(2) @binding(0) var<uniform> material: MaterialUniforms;\r
\r
// Texture maps: albedoMap (srgb), normalMap (tangent-space linear), merMap (R=metallic, G=emissive, B=roughness)\r
@group(3) @binding(0) var albedo_map: texture_2d<f32>;\r
@group(3) @binding(1) var normal_map: texture_2d<f32>;\r
@group(3) @binding(2) var mer_map   : texture_2d<f32>;\r
@group(3) @binding(3) var mat_samp  : sampler;\r
\r
struct VertexInput {\r
  @location(0) position: vec3<f32>,\r
  @location(1) normal  : vec3<f32>,\r
  @location(2) uv      : vec2<f32>,\r
  @location(3) tangent : vec4<f32>,  // xyz=tangent, w=bitangent sign\r
}\r
\r
struct VertexOutput {\r
  @builtin(position) clip_pos  : vec4<f32>,\r
  @location(0)       world_pos : vec3<f32>,\r
  @location(1)       world_norm: vec3<f32>,\r
  @location(2)       uv        : vec2<f32>,\r
  @location(3)       world_tan : vec4<f32>,  // xyz=tangent, w=bitangent sign\r
}\r
\r
@vertex\r
fn vs_main(vin: VertexInput) -> VertexOutput {\r
  let world_pos  = model.model * vec4<f32>(vin.position, 1.0);\r
  let world_norm = normalize((model.normalMatrix * vec4<f32>(vin.normal,       0.0)).xyz);\r
  let world_tan  = normalize((model.normalMatrix * vec4<f32>(vin.tangent.xyz,  0.0)).xyz);\r
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
  @location(1) normal_emission : vec4<f32>,\r
}\r
\r
@fragment\r
fn fs_main(in: VertexOutput) -> FragmentOutput {\r
  // Tile within the mesh surface, then map into the atlas tile region\r
  let atlas_uv = fract(in.uv * material.uvTile) * material.uvScale + material.uvOffset;\r
\r
  // Albedo: texture rgb × material colour\r
  let tex_albedo = textureSample(albedo_map, mat_samp, atlas_uv);\r
  let albedo     = tex_albedo.rgb * material.albedo.rgb;\r
\r
  // MER: r=metallic multiplier, g=emissive, b=roughness multiplier\r
  let mer      = textureSample(mer_map, mat_samp, atlas_uv);\r
  let roughness = material.roughness * mer.b;\r
  let metallic  = material.metallic  * mer.r;\r
  let emission  = mer.g;\r
\r
  // Build TBN in world space for normal mapping\r
  let N = normalize(in.world_norm);\r
  let T = normalize(in.world_tan.xyz);\r
  // Re-orthogonalise to handle interpolation artefacts\r
  let T_ortho = normalize(T - N * dot(T, N));\r
  let B       = cross(N, T_ortho) * in.world_tan.w;  // w encodes bitangent handedness\r
  let tbn     = mat3x3<f32>(T_ortho, B, N);\r
\r
  // Decode tangent-space normal map and transform to world space\r
  let n_ts    = textureSample(normal_map, mat_samp, atlas_uv).rgb * 2.0 - 1.0;\r
  let mapped_N = normalize(tbn * n_ts);\r
\r
  var out: FragmentOutput;\r
  out.albedo_roughness = vec4<f32>(albedo, roughness);\r
  // Store world normal in [0,1] range (decoded in lighting pass with n*2-1) and emission\r
  out.normal_emission  = vec4<f32>(mapped_N * 0.5 + 0.5, emission);\r
  return out;\r
}\r
`,Ve=64*4+16+16,Hr=128,qr=48;class ir extends D{constructor(e,r,t,a,i,c,l,o,u,p,d,f,_,h,v){super();s(this,"name","GeometryPass");s(this,"_gbuffer");s(this,"_pipeline");s(this,"_modelBGL");s(this,"_materialBGL");s(this,"_textureBGL");s(this,"_cameraBuffer");s(this,"_cameraBindGroup");s(this,"_modelBuffers",[]);s(this,"_modelBindGroups",[]);s(this,"_materialBuffers",[]);s(this,"_materialBindGroups",[]);s(this,"_whiteTex");s(this,"_flatNormalTex");s(this,"_merDefaultTex");s(this,"_whiteView");s(this,"_flatNormalView");s(this,"_merDefaultView");s(this,"_materialSampler");s(this,"_textureBGs",new WeakMap);s(this,"_drawItems",[]);s(this,"_modelData",new Float32Array(32));s(this,"_matData",new Float32Array(12));this._gbuffer=e,this._pipeline=r,this._modelBGL=a,this._materialBGL=i,this._textureBGL=c,this._cameraBuffer=l,this._cameraBindGroup=o,this._whiteTex=u,this._whiteView=p,this._flatNormalTex=d,this._flatNormalView=f,this._merDefaultTex=_,this._merDefaultView=h,this._materialSampler=v}static create(e,r){const{device:t}=e,a=t.createBindGroupLayout({label:"GeomCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),i=t.createBindGroupLayout({label:"GeomModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),c=t.createBindGroupLayout({label:"GeomMaterialBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),l=t.createBindGroupLayout({label:"GeomTextureBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]});function o(w,S,B,P,E){const G=t.createTexture({label:w,size:{width:1,height:1},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return t.queue.writeTexture({texture:G},new Uint8Array([S,B,P,E]),{bytesPerRow:4},{width:1,height:1}),[G,G.createView()]}const[u,p]=o("GeomWhite",255,255,255,255),[d,f]=o("GeomFlatNormal",128,128,255,255),[_,h]=o("GeomMerDefault",255,0,255,255),v=t.createSampler({label:"GeomMaterialSampler",magFilter:"nearest",minFilter:"nearest",addressModeU:"repeat",addressModeV:"repeat"}),g=t.createBuffer({label:"GeomCameraBuffer",size:Ve,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),b=t.createBindGroup({label:"GeomCameraBindGroup",layout:a,entries:[{binding:0,resource:{buffer:g}}]}),x=t.createShaderModule({label:"GeometryShader",code:kr}),y=t.createRenderPipeline({label:"GeometryPipeline",layout:t.createPipelineLayout({bindGroupLayouts:[a,i,c,l]}),vertex:{module:x,entryPoint:"vs_main",buffers:[{arrayStride:ge,attributes:ve}]},fragment:{module:x,entryPoint:"fs_main",targets:[{format:"rgba8unorm"},{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}});return new ir(r,y,a,i,c,l,g,b,u,p,d,f,_,h,v)}setDrawItems(e){this._drawItems=e}updateCamera(e,r,t,a,i,c,l,o){const u=new Float32Array(Ve/4);u.set(r.data,0),u.set(t.data,16),u.set(a.data,32),u.set(i.data,48),u[64]=c.x,u[65]=c.y,u[66]=c.z,u[67]=l,u[68]=o,e.queue.writeBuffer(this._cameraBuffer,0,u.buffer)}execute(e,r){var i,c,l,o,u,p;const{device:t}=r;this._ensurePerDrawBuffers(t,this._drawItems.length);for(let d=0;d<this._drawItems.length;d++){const f=this._drawItems[d],_=this._modelData;_.set(f.modelMatrix.data,0),_.set(f.normalMatrix.data,16),r.queue.writeBuffer(this._modelBuffers[d],0,_.buffer);const h=this._matData;h.set(f.material.albedo,0),h[4]=f.material.roughness,h[5]=f.material.metallic,h[6]=((i=f.material.uvOffset)==null?void 0:i[0])??0,h[7]=((c=f.material.uvOffset)==null?void 0:c[1])??0,h[8]=((l=f.material.uvScale)==null?void 0:l[0])??1,h[9]=((o=f.material.uvScale)==null?void 0:o[1])??1,h[10]=((u=f.material.uvTile)==null?void 0:u[0])??1,h[11]=((p=f.material.uvTile)==null?void 0:p[1])??1,r.queue.writeBuffer(this._materialBuffers[d],0,h.buffer)}const a=e.beginRenderPass({label:"GeometryPass",colorAttachments:[{view:this._gbuffer.albedoRoughnessView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"},{view:this._gbuffer.normalMetallicView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});a.setPipeline(this._pipeline),a.setBindGroup(0,this._cameraBindGroup);for(let d=0;d<this._drawItems.length;d++){const f=this._drawItems[d];a.setBindGroup(1,this._modelBindGroups[d]),a.setBindGroup(2,this._materialBindGroups[d]),a.setBindGroup(3,this._getOrCreateTextureBG(t,f.material)),a.setVertexBuffer(0,f.mesh.vertexBuffer),a.setIndexBuffer(f.mesh.indexBuffer,"uint32"),a.drawIndexed(f.mesh.indexCount)}a.end()}_getOrCreateTextureBG(e,r){var a,i,c;let t=this._textureBGs.get(r);return t||(t=e.createBindGroup({label:"GeomTextureBG",layout:this._textureBGL,entries:[{binding:0,resource:((a=r.albedoMap)==null?void 0:a.view)??this._whiteView},{binding:1,resource:((i=r.normalMap)==null?void 0:i.view)??this._flatNormalView},{binding:2,resource:((c=r.merMap)==null?void 0:c.view)??this._merDefaultView},{binding:3,resource:this._materialSampler}]}),this._textureBGs.set(r,t)),t}_ensurePerDrawBuffers(e,r){for(;this._modelBuffers.length<r;){const t=e.createBuffer({size:Hr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._modelBuffers.push(t),this._modelBindGroups.push(e.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:t}}]}));const a=e.createBuffer({size:qr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._materialBuffers.push(a),this._materialBindGroups.push(e.createBindGroup({layout:this._materialBGL,entries:[{binding:0,resource:{buffer:a}}]}))}}destroy(){this._cameraBuffer.destroy();for(const e of this._modelBuffers)e.destroy();for(const e of this._materialBuffers)e.destroy();this._whiteTex.destroy(),this._flatNormalTex.destroy(),this._merDefaultTex.destroy()}}const jr=`// Depth of Field: prefilter (CoC + 2x downsample) then fused disc-blur + composite.\r
\r
struct DofUniforms {\r
  focus_distance: f32,  // linear depth of sharp plane (world units)\r
  focus_range   : f32,  // half-range: blur ramps 0→max over this distance on each side\r
  bokeh_radius  : f32,  // max blur radius in half-res texels\r
  near          : f32,\r
  far           : f32,\r
  _pad1         : f32,\r
  _pad2         : f32,\r
  _pad3         : f32,\r
}\r
\r
@group(0) @binding(0) var<uniform> dof     : DofUniforms;\r
@group(0) @binding(1) var          hdr_tex : texture_2d<f32>;\r
@group(0) @binding(2) var          dep_tex : texture_depth_2d;\r
@group(0) @binding(3) var          samp    : sampler;\r
// group 1 is only used by fs_composite; prefilter pipeline has no group 1\r
@group(1) @binding(0) var          half_tex: texture_2d<f32>;\r
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
fn linear_depth(ndc_depth: f32) -> f32 {\r
  return dof.near * dof.far / (dof.far - ndc_depth * (dof.far - dof.near));\r
}\r
\r
fn compute_coc(lin_depth: f32) -> f32 {\r
  return clamp(\r
    (lin_depth - dof.focus_distance) / max(dof.focus_range, 0.001),\r
    0.0, 1.0\r
  ) * dof.bokeh_radius;\r
}\r
\r
// Prefilter: 4-tap 2x downsample; RGB = colour, A = signed CoC (texels, half-res).\r
// Negative CoC = in front of focus plane.\r
@fragment\r
fn fs_prefilter(in: VertexOutput) -> @location(0) vec4<f32> {\r
  let full_size = vec2<f32>(textureDimensions(hdr_tex));\r
  let texel = 1.0 / full_size;\r
  let o = array<vec2<f32>, 4>(\r
    vec2<f32>(-0.5, -0.5), vec2<f32>( 0.5, -0.5),\r
    vec2<f32>(-0.5,  0.5), vec2<f32>( 0.5,  0.5)\r
  );\r
\r
  var col = vec3<f32>(0.0);\r
  var c   = 0.0;\r
  for (var i = 0; i < 4; i++) {\r
    let uv = in.uv + o[i] * texel;\r
    col   += textureSampleLevel(hdr_tex, samp, uv, 0.0).rgb;\r
    let px = clamp(vec2<u32>(uv * full_size), vec2<u32>(0u), vec2<u32>(full_size) - 1u);\r
    c     += compute_coc(linear_depth(textureLoad(dep_tex, px, 0)));\r
  }\r
  return vec4<f32>(col * 0.25, c * 0.25);\r
}\r
\r
// Composite: 48-tap Fibonacci spiral disc blur on the prefiltered half-res texture.\r
// Radii are sqrt-distributed (uniform area coverage) so there are no discrete rings.\r
// Per-pixel rotation breaks any residual spiral pattern into noise.\r
const GOLDEN_ANGLE: f32 = 2.399963229728; // 2π(2 - φ), φ = golden ratio\r
const NUM_TAPS: i32 = 48;\r
\r
@fragment\r
fn fs_composite(in: VertexOutput) -> @location(0) vec4<f32> {\r
  let sharp  = textureSampleLevel(hdr_tex,  samp, in.uv, 0.0).rgb;\r
  let center = textureSampleLevel(half_tex, samp, in.uv, 0.0);\r
  let coc_px = abs(center.a);\r
\r
  let texel = 1.0 / vec2<f32>(textureDimensions(half_tex));\r
\r
  // Per-pixel rotation offset — breaks the spiral into spatially-varying noise.\r
  let coord = vec2<u32>(in.clip_pos.xy);\r
  let rot   = f32((coord.x * 1619u + coord.y * 7919u) & 63u) * (6.28318 / 64.0);\r
\r
  var accum  = center.rgb;\r
  var weight = 1.0;\r
  for (var i = 0; i < NUM_TAPS; i++) {\r
    // sqrt distribution → uniform area density, no discrete ring jumps\r
    let r     = sqrt(f32(i) + 0.5) / sqrt(f32(NUM_TAPS)) * coc_px;\r
    let theta = f32(i) * GOLDEN_ANGLE + rot;\r
    let uv2   = in.uv + vec2<f32>(cos(theta), sin(theta)) * r * texel;\r
    let s     = textureSampleLevel(half_tex, samp, uv2, 0.0);\r
    let w     = clamp(abs(s.a) / max(dof.bokeh_radius, 0.001), 0.0, 1.0);\r
    accum  += s.rgb * w;\r
    weight += w;\r
  }\r
  let blurred = accum / weight;\r
\r
  let blend = smoothstep(0.0, 1.0, coc_px / max(dof.bokeh_radius, 0.001));\r
  return vec4<f32>(mix(sharp, blurred, blend), 1.0);\r
}\r
`,Wr=32;class ar extends D{constructor(e,r,t,a,i,c,l,o,u,p){super();s(this,"name","DofPass");s(this,"resultView");s(this,"_result");s(this,"_half");s(this,"_halfView");s(this,"_prefilterPipeline");s(this,"_compositePipeline");s(this,"_uniformBuffer");s(this,"_prefilterBG");s(this,"_compBG0");s(this,"_compBG1");this._result=e,this.resultView=r,this._half=t,this._halfView=a,this._prefilterPipeline=i,this._compositePipeline=c,this._uniformBuffer=l,this._prefilterBG=o,this._compBG0=u,this._compBG1=p}static create(e,r,t){const{device:a,width:i,height:c}=e,l=Math.max(1,i>>1),o=Math.max(1,c>>1),u=a.createTexture({label:"DofHalf",size:{width:l,height:o},format:V,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),p=a.createTexture({label:"DofResult",size:{width:i,height:c},format:V,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),d=u.createView(),f=p.createView(),_=a.createBuffer({label:"DofUniforms",size:Wr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});a.queue.writeBuffer(_,0,new Float32Array([30,60,6,.1,1e3,0,0,0]).buffer);const h=a.createSampler({label:"DofSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),v=a.createBindGroupLayout({label:"DofBGL0Prefilter",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),g=a.createBindGroupLayout({label:"DofBGL0Composite",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),b=a.createBindGroupLayout({label:"DofBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),x=a.createShaderModule({label:"DofShader",code:jr}),y=a.createRenderPipeline({label:"DofPrefilterPipeline",layout:a.createPipelineLayout({bindGroupLayouts:[v]}),vertex:{module:x,entryPoint:"vs_main"},fragment:{module:x,entryPoint:"fs_prefilter",targets:[{format:V}]},primitive:{topology:"triangle-list"}}),w=a.createRenderPipeline({label:"DofCompositePipeline",layout:a.createPipelineLayout({bindGroupLayouts:[g,b]}),vertex:{module:x,entryPoint:"vs_main"},fragment:{module:x,entryPoint:"fs_composite",targets:[{format:V}]},primitive:{topology:"triangle-list"}}),S=a.createBindGroup({label:"DofPrefilterBG",layout:v,entries:[{binding:0,resource:{buffer:_}},{binding:1,resource:r},{binding:2,resource:t},{binding:3,resource:h}]}),B=a.createBindGroup({label:"DofCompBG0",layout:g,entries:[{binding:0,resource:{buffer:_}},{binding:1,resource:r},{binding:3,resource:h}]}),P=a.createBindGroup({label:"DofCompBG1",layout:b,entries:[{binding:0,resource:d}]});return new ar(p,f,u,d,y,w,_,S,B,P)}updateParams(e,r=30,t=60,a=6,i=.1,c=1e3,l=1){e.device.queue.writeBuffer(this._uniformBuffer,0,new Float32Array([r,t,a,i,c,l,0,0]).buffer)}execute(e,r){{const t=e.beginRenderPass({label:"DofPrefilter",colorAttachments:[{view:this._halfView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]});t.setPipeline(this._prefilterPipeline),t.setBindGroup(0,this._prefilterBG),t.draw(3),t.end()}{const t=e.beginRenderPass({label:"DofComposite",colorAttachments:[{view:this.resultView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});t.setPipeline(this._compositePipeline),t.setBindGroup(0,this._compBG0),t.setBindGroup(1,this._compBG1),t.draw(3),t.end()}}destroy(){this._result.destroy(),this._half.destroy(),this._uniformBuffer.destroy()}}const Xr=`// SSAO: hemisphere sampling in view space.\r
// Reads GBuffer depth + normals, writes raw AO value [0,1].\r
\r
const KERNEL_SIZE: i32 = 16;\r
\r
struct SsaoUniforms {\r
  view    : mat4x4<f32>,  // offset   0\r
  proj    : mat4x4<f32>,  // offset  64\r
  inv_proj: mat4x4<f32>,  // offset 128\r
  radius  : f32,          // offset 192\r
  bias    : f32,          // offset 196\r
  strength: f32,          // offset 200\r
  _pad    : f32,          // offset 204\r
  kernel  : array<vec4<f32>, 16>, // offset 208 (256 bytes)\r
}                          // total: 464 bytes\r
\r
@group(0) @binding(0) var<uniform> ssao: SsaoUniforms;\r
\r
@group(1) @binding(0) var normal_tex: texture_2d<f32>;   // GBuffer normalMetallic (rgba16float)\r
@group(1) @binding(1) var depth_tex : texture_depth_2d;  // GBuffer depth (depth32float)\r
@group(1) @binding(2) var noise_tex : texture_2d<f32>;   // 4×4 random rotation vectors (rgba8unorm)\r
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
// Reconstruct view-space position from UV + NDC depth.\r
// WebGPU NDC: Y is up, depth [0,1]. UV: Y is down.\r
fn view_pos(uv: vec2<f32>, depth: f32) -> vec3<f32> {\r
  let ndc = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);\r
  let vh  = ssao.inv_proj * ndc;\r
  return vh.xyz / vh.w;\r
}\r
\r
@fragment\r
fn fs_ssao(in: VertexOutput) -> @location(0) vec4<f32> {\r
  // This pass runs at half resolution. clip_pos is in half-res pixel space;\r
  // GBuffer textures are full-res so multiply by 2 to address them correctly.\r
  let half_coord = vec2<i32>(in.clip_pos.xy);\r
  let coord      = half_coord * 2;\r
  let depth = textureLoad(depth_tex, coord, 0);\r
\r
  // Sky pixels → full AO (no occlusion)\r
  if (depth >= 1.0) { return vec4<f32>(1.0, 0.0, 0.0, 1.0); }\r
\r
  let P = view_pos(in.uv, depth);\r
\r
  // Decode world-space normal (stored as N*0.5+0.5), transform to view space\r
  let raw_n   = textureLoad(normal_tex, coord, 0).rgb;\r
  let world_N = normalize(raw_n * 2.0 - 1.0);\r
  let N       = normalize((ssao.view * vec4<f32>(world_N, 0.0)).xyz);\r
\r
  // Tiled 4×4 noise using half-res coords so the pattern tiles the full screen.\r
  let noise_coord = vec2<u32>(half_coord) % vec2<u32>(4u);\r
  let rnd         = textureLoad(noise_tex, noise_coord, 0).rg * 2.0 - 1.0;\r
\r
  // Gram-Schmidt: build orthonormal tangent frame from random vector + N\r
  let rand_vec = vec3<f32>(rnd, 0.0);\r
  let T = normalize(rand_vec - N * dot(rand_vec, N));\r
  let B = cross(N, T);\r
  // TBN columns [T, B, N] maps from tangent space to view space\r
  let tbn = mat3x3<f32>(T, B, N);\r
\r
  let tex_size = vec2<f32>(textureDimensions(depth_tex));\r
  var occlusion = 0.0;\r
\r
  for (var i = 0; i < KERNEL_SIZE; i++) {\r
    // View-space sample: kernel.z aligns with N (hemisphere above surface)\r
    let sample_vs = P + (tbn * ssao.kernel[i].xyz) * ssao.radius;\r
\r
    // Project sample to screen UV\r
    let clip       = ssao.proj * vec4<f32>(sample_vs, 1.0);\r
    let ndc_xy     = clip.xy / clip.w;\r
    let sample_uv  = vec2<f32>(ndc_xy.x * 0.5 + 0.5, -ndc_xy.y * 0.5 + 0.5);\r
\r
    // Sample depth at that UV and reconstruct view-space Z\r
    let sc        = clamp(vec2<i32>(sample_uv * tex_size), vec2<i32>(0), vec2<i32>(tex_size) - 1);\r
    let ref_depth = textureLoad(depth_tex, sc, 0);\r
    let ref_z     = view_pos(sample_uv, ref_depth).z;\r
\r
    // Range check: weight falls to 0 when ref surface is beyond radius (different geometry).\r
    // Inverted smoothstep avoids the reciprocal spike that caused self-occlusion on flat faces.\r
    let range_check = 1.0 - smoothstep(0.0, ssao.radius, abs(P.z - ref_z));\r
\r
    // Right-handed view space: closer to camera = higher (less negative) Z.\r
    // Occlude when actual geometry is closer to camera than the sample point (sample is inside geometry).\r
    // Using sample_vs.z rather than P.z makes the check slope-invariant: the sample already sits\r
    // above the surface, so same-surface pixels always satisfy ref_z < sample_vs.z regardless of tilt.\r
    occlusion += select(0.0, 1.0, ref_z > sample_vs.z + ssao.bias) * range_check;\r
  }\r
\r
  let ao = clamp(1.0 - (occlusion / f32(KERNEL_SIZE)) * ssao.strength, 0.0, 1.0);\r
  return vec4<f32>(ao, 0.0, 0.0, 1.0);\r
}\r
`,$r=`// SSAO blur: 4×4 box blur to smooth raw SSAO output.\r
\r
@group(0) @binding(0) var ao_tex: texture_2d<f32>;\r
@group(0) @binding(1) var samp  : sampler;\r
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
@fragment\r
fn fs_blur(in: VertexOutput) -> @location(0) vec4<f32> {\r
  let texel = 1.0 / vec2<f32>(textureDimensions(ao_tex));\r
  var ao = 0.0;\r
  for (var y = -1; y <= 2; y++) {\r
    for (var x = -1; x <= 2; x++) {\r
      ao += textureSampleLevel(ao_tex, samp, in.uv + vec2<f32>(f32(x), f32(y)) * texel, 0.0).r;\r
    }\r
  }\r
  return vec4<f32>(ao / 16.0, 0.0, 0.0, 1.0);\r
}\r
`,ee="r8unorm",fe=16,Yr=464;function Zr(){const m=new Float32Array(fe*4);for(let n=0;n<fe;n++){const e=Math.random(),r=Math.random()*Math.PI*2,t=Math.sqrt(1-e*e),a=.1+.9*(n/fe)**2;m[n*4+0]=t*Math.cos(r)*a,m[n*4+1]=t*Math.sin(r)*a,m[n*4+2]=e*a,m[n*4+3]=0}return m}function Kr(){const m=new Uint8Array(64);for(let n=0;n<16;n++){const e=Math.random()*Math.PI*2;m[n*4+0]=Math.round((Math.cos(e)*.5+.5)*255),m[n*4+1]=Math.round((Math.sin(e)*.5+.5)*255),m[n*4+2]=128,m[n*4+3]=255}return m}class sr extends D{constructor(e,r,t,a,i,c,l,o,u,p,d){super();s(this,"name","SSAOPass");s(this,"aoView");s(this,"_raw");s(this,"_blurred");s(this,"_rawView");s(this,"_ssaoPipeline");s(this,"_blurPipeline");s(this,"_uniformBuffer");s(this,"_noiseTex");s(this,"_ssaoBG0");s(this,"_ssaoBG1");s(this,"_blurBG");this._raw=e,this._rawView=r,this._blurred=t,this.aoView=a,this._ssaoPipeline=i,this._blurPipeline=c,this._uniformBuffer=l,this._noiseTex=o,this._ssaoBG0=u,this._ssaoBG1=p,this._blurBG=d}static create(e,r){const{device:t,width:a,height:i}=e,c=Math.max(1,a>>1),l=Math.max(1,i>>1),o=t.createTexture({label:"SsaoRaw",size:{width:c,height:l},format:ee,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),u=t.createTexture({label:"SsaoBlurred",size:{width:c,height:l},format:ee,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),p=o.createView(),d=u.createView(),f=t.createTexture({label:"SsaoNoise",size:{width:4,height:4},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});t.queue.writeTexture({texture:f},Kr().buffer,{bytesPerRow:4*4,rowsPerImage:4},{width:4,height:4});const _=f.createView(),h=t.createBuffer({label:"SsaoUniforms",size:Yr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});t.queue.writeBuffer(h,208,Zr().buffer),t.queue.writeBuffer(h,192,new Float32Array([1,.005,2,0]).buffer);const v=t.createSampler({label:"SsaoBlurSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),g=t.createBindGroupLayout({label:"SsaoBGL0",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),b=t.createBindGroupLayout({label:"SsaoBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),x=t.createBindGroupLayout({label:"SsaoBlurBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),y=t.createShaderModule({label:"SsaoShader",code:Xr}),w=t.createShaderModule({label:"SsaoBlurShader",code:$r}),S=t.createRenderPipeline({label:"SsaoPipeline",layout:t.createPipelineLayout({bindGroupLayouts:[g,b]}),vertex:{module:y,entryPoint:"vs_main"},fragment:{module:y,entryPoint:"fs_ssao",targets:[{format:ee}]},primitive:{topology:"triangle-list"}}),B=t.createRenderPipeline({label:"SsaoBlurPipeline",layout:t.createPipelineLayout({bindGroupLayouts:[x]}),vertex:{module:w,entryPoint:"vs_main"},fragment:{module:w,entryPoint:"fs_blur",targets:[{format:ee}]},primitive:{topology:"triangle-list"}}),P=t.createBindGroup({label:"SsaoBG0",layout:g,entries:[{binding:0,resource:{buffer:h}}]}),E=t.createBindGroup({label:"SsaoBG1",layout:b,entries:[{binding:0,resource:r.normalMetallicView},{binding:1,resource:r.depthView},{binding:2,resource:_}]}),G=t.createBindGroup({label:"SsaoBlurBG",layout:x,entries:[{binding:0,resource:p},{binding:1,resource:v}]});return new sr(o,p,u,d,S,B,h,f,P,E,G)}updateCamera(e,r,t,a){const i=new Float32Array(48);i.set(r.data,0),i.set(t.data,16),i.set(a.data,32),e.device.queue.writeBuffer(this._uniformBuffer,0,i.buffer)}updateParams(e,r=1,t=.005,a=2){e.device.queue.writeBuffer(this._uniformBuffer,192,new Float32Array([r,t,a,0]).buffer)}execute(e,r){{const t=e.beginRenderPass({label:"SSAOPass",colorAttachments:[{view:this._rawView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});t.setPipeline(this._ssaoPipeline),t.setBindGroup(0,this._ssaoBG0),t.setBindGroup(1,this._ssaoBG1),t.draw(3),t.end()}{const t=e.beginRenderPass({label:"SSAOBlur",colorAttachments:[{view:this.aoView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});t.setPipeline(this._blurPipeline),t.setBindGroup(0,this._blurBG),t.draw(3),t.end()}}destroy(){this._raw.destroy(),this._blurred.destroy(),this._uniformBuffer.destroy(),this._noiseTex.destroy()}}const Jr=`// Screen-Space Global Illumination — ray march pass.\r
// Cosine-weighted hemisphere rays in view space; hits sample previous frame's lit scene.\r
\r
struct SSGIUniforms {\r
  view        : mat4x4<f32>,   // offset   0\r
  proj        : mat4x4<f32>,   // offset  64\r
  inv_proj    : mat4x4<f32>,   // offset 128\r
  invViewProj : mat4x4<f32>,   // offset 192\r
  prevViewProj: mat4x4<f32>,   // offset 256\r
  camPos      : vec3<f32>,     // offset 320\r
  numRays     : u32,           // offset 332\r
  numSteps    : u32,           // offset 336\r
  radius      : f32,           // offset 340\r
  thickness   : f32,           // offset 344\r
  strength    : f32,           // offset 348\r
  frameIndex  : u32,           // offset 352\r
}                              // stride 368 (padded to align 16)\r
\r
@group(0) @binding(0) var<uniform> u: SSGIUniforms;\r
\r
@group(1) @binding(0) var depth_tex    : texture_depth_2d;\r
@group(1) @binding(1) var normal_tex   : texture_2d<f32>;\r
@group(1) @binding(2) var prev_radiance: texture_2d<f32>;\r
@group(1) @binding(3) var noise_tex    : texture_2d<f32>;\r
@group(1) @binding(4) var lin_samp     : sampler;\r
\r
struct VertexOutput {\r
  @builtin(position) clip_pos: vec4<f32>,\r
  @location(0)       uv      : vec2<f32>,\r
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
fn view_pos_at(uv: vec2<f32>, depth: f32) -> vec3<f32> {\r
  let ndc = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);\r
  let h   = u.inv_proj * ndc;\r
  return h.xyz / h.w;\r
}\r
\r
@fragment\r
fn fs_ssgi(in: VertexOutput) -> @location(0) vec4<f32> {\r
  let coord = vec2<i32>(in.clip_pos.xy);\r
  let depth = textureLoad(depth_tex, coord, 0);\r
  if (depth >= 1.0) { return vec4<f32>(0.0); }\r
\r
  let vp = view_pos_at(in.uv, depth);\r
\r
  // World normal → view space\r
  let nm      = textureLoad(normal_tex, coord, 0);\r
  let N_world = normalize(nm.rgb * 2.0 - 1.0);\r
  let N_vs    = normalize((u.view * vec4<f32>(N_world, 0.0)).xyz);\r
\r
  // Per-pixel TBN from tiled 4×4 noise (cos/sin rotation angle in rg)\r
  let noise_coord = coord % vec2<i32>(4, 4);\r
  let noise_val   = textureLoad(noise_tex, noise_coord, 0).rg;\r
  let cos_a = noise_val.x * 2.0 - 1.0;\r
  let sin_a = noise_val.y * 2.0 - 1.0;\r
\r
  var up = vec3<f32>(0.0, 1.0, 0.0);\r
  if (abs(N_vs.y) > 0.99) { up = vec3<f32>(1.0, 0.0, 0.0); }\r
  let T_raw = normalize(cross(up, N_vs));\r
  let B_raw = cross(N_vs, T_raw);\r
  // Rotate tangent frame by per-pixel noise angle\r
  let T = cos_a * T_raw - sin_a * B_raw;\r
  let B = sin_a * T_raw + cos_a * B_raw;\r
\r
  let screen_dim = vec2<f32>(textureDimensions(depth_tex));\r
  let screen_i   = vec2<i32>(screen_dim);\r
  var accum = vec3<f32>(0.0);\r
  let nr    = f32(u.numRays);\r
  let ns    = f32(u.numSteps);\r
\r
  for (var i = 0u; i < u.numRays; i++) {\r
    // Cosine-weighted hemisphere with golden-ratio temporal jitter\r
    let phi       = 6.28318530 * fract(f32(i) / nr + f32(u.frameIndex) * 0.618033988);\r
    let ur        = fract(f32(u.frameIndex * u.numRays + i) * 0.381966011);\r
    let cos_theta = sqrt(ur);\r
    let sin_theta = sqrt(max(0.0, 1.0 - cos_theta * cos_theta));\r
    let ray_local = vec3<f32>(sin_theta * cos(phi), sin_theta * sin(phi), cos_theta);\r
    let ray_vs    = T * ray_local.x + B * ray_local.y + N_vs * ray_local.z;\r
\r
    for (var s = 0u; s < u.numSteps; s++) {\r
      let t  = (f32(s) + 1.0) / ns;\r
      let p  = vp + ray_vs * (u.radius * t);\r
      if (p.z >= 0.0) { break; } // stepped behind the camera\r
\r
      let clip  = u.proj * vec4<f32>(p, 1.0);\r
      let inv_w = 1.0 / clip.w;\r
      let ray_uv = vec2<f32>(\r
         clip.x * inv_w * 0.5 + 0.5,\r
        -clip.y * inv_w * 0.5 + 0.5,\r
      );\r
      if (any(ray_uv < vec2<f32>(0.0)) || any(ray_uv > vec2<f32>(1.0))) { break; }\r
\r
      // Depth at ray UV (nearest texel to avoid sampler type restrictions)\r
      let ray_tc       = clamp(vec2<i32>(ray_uv * screen_dim), vec2<i32>(0), screen_i - vec2<i32>(1));\r
      let stored_depth = textureLoad(depth_tex, ray_tc, 0);\r
      if (stored_depth >= 1.0) { continue; } // hit sky — keep stepping\r
\r
      let stored_h = u.inv_proj * vec4<f32>(ray_uv.x * 2.0 - 1.0, 1.0 - ray_uv.y * 2.0, stored_depth, 1.0);\r
      let stored_z = stored_h.z / stored_h.w;\r
\r
      // View-space Z is negative in front; hit when ray just passed behind surface.\r
      if (p.z < stored_z && stored_z - p.z < u.thickness) {\r
        accum += textureSampleLevel(prev_radiance, lin_samp, ray_uv, 0.0).rgb;\r
        break;\r
      }\r
    }\r
  }\r
\r
  return vec4<f32>(accum * u.strength / nr, 1.0);\r
}\r
`,Qr=`// Screen-Space Global Illumination — temporal accumulation pass.\r
// Reprojects SSGI into previous frame, AABB-clamps, blends 10% new / 90% history.\r
\r
struct SSGIUniforms {\r
  view        : mat4x4<f32>,\r
  proj        : mat4x4<f32>,\r
  inv_proj    : mat4x4<f32>,\r
  invViewProj : mat4x4<f32>,\r
  prevViewProj: mat4x4<f32>,\r
  camPos      : vec3<f32>,\r
  numRays     : u32,\r
  numSteps    : u32,\r
  radius      : f32,\r
  thickness   : f32,\r
  strength    : f32,\r
  frameIndex  : u32,\r
}\r
\r
@group(0) @binding(0) var<uniform> u: SSGIUniforms;\r
\r
@group(1) @binding(0) var raw_ssgi    : texture_2d<f32>;\r
@group(1) @binding(1) var ssgi_history: texture_2d<f32>;\r
@group(1) @binding(2) var depth_tex   : texture_depth_2d;\r
@group(1) @binding(3) var lin_samp    : sampler;\r
\r
struct VertexOutput {\r
  @builtin(position) clip_pos: vec4<f32>,\r
  @location(0)       uv      : vec2<f32>,\r
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
@fragment\r
fn fs_temporal(in: VertexOutput) -> @location(0) vec4<f32> {\r
  let coord   = vec2<i32>(in.clip_pos.xy);\r
  let current = textureLoad(raw_ssgi, coord, 0).rgb;\r
\r
  // Sky pixels carry no indirect irradiance\r
  let depth = textureLoad(depth_tex, coord, 0);\r
  if (depth >= 1.0) { return vec4<f32>(0.0); }\r
\r
  // Reproject to previous frame\r
  let ndc       = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, depth, 1.0);\r
  let world_h   = u.invViewProj * ndc;\r
  let world_pos = world_h.xyz / world_h.w;\r
  let prev_clip = u.prevViewProj * vec4<f32>(world_pos, 1.0);\r
  let prev_uv   = vec2<f32>(\r
     prev_clip.x / prev_clip.w * 0.5 + 0.5,\r
    -prev_clip.y / prev_clip.w * 0.5 + 0.5,\r
  );\r
\r
  // Disocclusion or out-of-frame: trust current sample fully\r
  if (any(prev_uv < vec2<f32>(0.0)) || any(prev_uv > vec2<f32>(1.0))) {\r
    return vec4<f32>(current, 1.0);\r
  }\r
\r
  // AABB clamp: 3×3 neighbourhood min/max of raw SSGI prevents ghosting\r
  let dim = vec2<i32>(textureDimensions(raw_ssgi));\r
  var nb_min = vec3<f32>(1e9);\r
  var nb_max = vec3<f32>(-1e9);\r
  for (var dy = -1; dy <= 1; dy++) {\r
    for (var dx = -1; dx <= 1; dx++) {\r
      let nc = clamp(coord + vec2<i32>(dx, dy), vec2<i32>(0), dim - vec2<i32>(1));\r
      let s  = textureLoad(raw_ssgi, nc, 0).rgb;\r
      nb_min = min(nb_min, s);\r
      nb_max = max(nb_max, s);\r
    }\r
  }\r
\r
  let history         = textureSampleLevel(ssgi_history, lin_samp, prev_uv, 0.0).rgb;\r
  let history_clamped = clamp(history, nb_min, nb_max);\r
\r
  // 10% new / 90% history → effective ~40-sample average with 4 rays/frame\r
  return vec4<f32>(mix(history_clamped, current, 0.1), 1.0);\r
}\r
`,ze=368,et={numRays:4,numSteps:16,radius:3,thickness:.5,strength:1};function rt(){const m=new Uint8Array(new ArrayBuffer(64));for(let n=0;n<16;n++){const e=Math.random()*Math.PI*2;m[n*4+0]=Math.round((Math.cos(e)*.5+.5)*255),m[n*4+1]=Math.round((Math.sin(e)*.5+.5)*255),m[n*4+2]=128,m[n*4+3]=255}return m}class or extends D{constructor(e,r,t,a,i,c,l,o,u,p,d,f,_,h,v,g){super();s(this,"name","SSGIPass");s(this,"resultView");s(this,"_uniformBuffer");s(this,"_noiseTexture");s(this,"_rawTexture");s(this,"_rawView");s(this,"_historyTexture");s(this,"_resultTexture");s(this,"_ssgiPipeline");s(this,"_temporalPipeline");s(this,"_ssgiBG0");s(this,"_ssgiBG1");s(this,"_tempBG0");s(this,"_tempBG1");s(this,"_settings");s(this,"_frameIndex",0);s(this,"_width");s(this,"_height");this._uniformBuffer=e,this._noiseTexture=r,this._rawTexture=t,this._rawView=a,this._historyTexture=i,this._resultTexture=c,this.resultView=l,this._ssgiPipeline=o,this._temporalPipeline=u,this._ssgiBG0=p,this._ssgiBG1=d,this._tempBG0=f,this._tempBG1=_,this._settings=h,this._width=v,this._height=g}static create(e,r,t,a=et){const{device:i,width:c,height:l}=e,o=i.createBuffer({label:"SSGIUniforms",size:ze,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),u=i.createTexture({label:"SSGINoise",size:{width:4,height:4},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});i.queue.writeTexture({texture:u},rt(),{bytesPerRow:4*4,rowsPerImage:4},{width:4,height:4});const p=u.createView(),d=i.createTexture({label:"SSGIRaw",size:{width:c,height:l},format:V,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),f=d.createView(),_=i.createTexture({label:"SSGIHistory",size:{width:c,height:l},format:V,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),h=_.createView(),v=i.createTexture({label:"SSGIResult",size:{width:c,height:l},format:V,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),g=v.createView(),b=i.createSampler({label:"SSGILinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),x=i.createBindGroupLayout({label:"SSGIUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),y=i.createBindGroupLayout({label:"SSGITexBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),w=i.createBindGroupLayout({label:"SSGITempTexBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),S=i.createBindGroup({label:"SSGIUniformBG",layout:x,entries:[{binding:0,resource:{buffer:o}}]}),B=i.createBindGroup({label:"SSGITexBG",layout:y,entries:[{binding:0,resource:r.depthView},{binding:1,resource:r.normalMetallicView},{binding:2,resource:t},{binding:3,resource:p},{binding:4,resource:b}]}),P=i.createBindGroup({label:"SSGITempUniformBG",layout:x,entries:[{binding:0,resource:{buffer:o}}]}),E=i.createBindGroup({label:"SSGITempTexBG",layout:w,entries:[{binding:0,resource:f},{binding:1,resource:h},{binding:2,resource:r.depthView},{binding:3,resource:b}]}),G=i.createShaderModule({label:"SSGIShader",code:Jr}),U=i.createShaderModule({label:"SSGITempShader",code:Qr}),M=i.createRenderPipeline({label:"SSGIPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[x,y]}),vertex:{module:G,entryPoint:"vs_main"},fragment:{module:G,entryPoint:"fs_ssgi",targets:[{format:V}]},primitive:{topology:"triangle-list"}}),R=i.createRenderPipeline({label:"SSGITempPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[x,w]}),vertex:{module:U,entryPoint:"vs_main"},fragment:{module:U,entryPoint:"fs_temporal",targets:[{format:V}]},primitive:{topology:"triangle-list"}});return new or(o,u,d,f,_,v,g,M,R,S,B,P,E,a,c,l)}updateCamera(e,r,t,a,i,c,l){const o=new Float32Array(ze/4);o.set(r.data,0),o.set(t.data,16),o.set(a.data,32),o.set(i.data,48),o.set(c.data,64),o[80]=l.x,o[81]=l.y,o[82]=l.z;const u=new Uint32Array(o.buffer);u[83]=this._settings.numRays,u[84]=this._settings.numSteps,o[85]=this._settings.radius,o[86]=this._settings.thickness,o[87]=this._settings.strength,u[88]=this._frameIndex++,e.queue.writeBuffer(this._uniformBuffer,0,o.buffer)}updateSettings(e){this._settings={...this._settings,...e}}execute(e,r){{const t=e.beginRenderPass({label:"SSGIRayMarch",colorAttachments:[{view:this._rawView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]});t.setPipeline(this._ssgiPipeline),t.setBindGroup(0,this._ssgiBG0),t.setBindGroup(1,this._ssgiBG1),t.draw(3),t.end()}{const t=e.beginRenderPass({label:"SSGITemporal",colorAttachments:[{view:this.resultView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]});t.setPipeline(this._temporalPipeline),t.setBindGroup(0,this._tempBG0),t.setBindGroup(1,this._tempBG1),t.draw(3),t.end()}e.copyTextureToTexture({texture:this._resultTexture},{texture:this._historyTexture},{width:this._width,height:this._height})}destroy(){this._uniformBuffer.destroy(),this._noiseTexture.destroy(),this._rawTexture.destroy(),this._historyTexture.destroy(),this._resultTexture.destroy()}}const tt=`// VSM shadow map generation for point and spot lights.\r
//\r
// Point light faces: output linear depth (distance/radius) and depth² into rgba16float.\r
// Spot light maps  : output NDC depth and depth² into rgba16float.\r
//\r
// Two pipeline pairs share identical bind group layouts:\r
//   group 0: ShadowUniforms (lightViewProj + lightPos + lightRadius)\r
//   group 1: ModelUniforms  (model matrix)\r
\r
struct ShadowUniforms {\r
  lightViewProj: mat4x4<f32>,  // offset 0, 64 bytes\r
  lightPos     : vec3<f32>,    // offset 64, 12 bytes\r
  lightRadius  : f32,          // offset 76, 4 bytes\r
}  // 80 bytes\r
\r
struct ModelUniforms {\r
  model: mat4x4<f32>,  // 64 bytes\r
}\r
\r
@group(0) @binding(0) var<uniform> shadow: ShadowUniforms;\r
@group(1) @binding(0) var<uniform> model : ModelUniforms;\r
\r
// ---- Point light (linear depth) -----------------------------------------------\r
\r
struct PointVaryings {\r
  @builtin(position) clip    : vec4<f32>,\r
  @location(0)       worldPos: vec3<f32>,\r
}\r
\r
@vertex\r
fn vs_point(@location(0) pos: vec3<f32>) -> PointVaryings {\r
  let worldPos = model.model * vec4<f32>(pos, 1.0);\r
  var out: PointVaryings;\r
  out.clip     = shadow.lightViewProj * worldPos;\r
  out.worldPos = worldPos.xyz;\r
  return out;\r
}\r
\r
@fragment\r
fn fs_point(in: PointVaryings) -> @location(0) vec4<f32> {\r
  let d = length(in.worldPos - shadow.lightPos) / shadow.lightRadius;\r
  return vec4<f32>(d, d * d, 0.0, 1.0);\r
}\r
\r
// ---- Spot light (NDC depth) ----------------------------------------------------\r
\r
struct SpotVaryings {\r
  @builtin(position) clip    : vec4<f32>,\r
  @location(0)       ndcDepth: f32,\r
}\r
\r
@vertex\r
fn vs_spot(@location(0) pos: vec3<f32>) -> SpotVaryings {\r
  let worldPos = model.model * vec4<f32>(pos, 1.0);\r
  let clip     = shadow.lightViewProj * worldPos;\r
  var out: SpotVaryings;\r
  out.clip     = clip;\r
  out.ndcDepth = clip.z / clip.w;\r
  return out;\r
}\r
\r
@fragment\r
fn fs_spot(in: SpotVaryings) -> @location(0) vec4<f32> {\r
  let d = in.ndcDepth;\r
  return vec4<f32>(d, d * d, 0.0, 1.0);\r
}\r
`,re=32,te=32,K=4,$=8,ne=256,ie=512,H=256,pe=80,nt=64,it=6*K,at=it+$;class lr extends D{constructor(e,r,t,a,i,c,l,o,u,p,d,f,_,h){super();s(this,"name","PointSpotShadowPass");s(this,"pointVsmView");s(this,"spotVsmView");s(this,"projTexView");s(this,"_pointVsmTex");s(this,"_spotVsmTex");s(this,"_projTexArray");s(this,"_pointDepth");s(this,"_spotDepth");s(this,"_pointFaceViews");s(this,"_spotFaceViews");s(this,"_pointDepthView");s(this,"_spotDepthView");s(this,"_pointPipeline");s(this,"_spotPipeline");s(this,"_shadowBufs");s(this,"_shadowBGs");s(this,"_modelBufs",[]);s(this,"_modelBGs",[]);s(this,"_modelBGL");s(this,"_snapshot",[]);s(this,"_pointLights",[]);s(this,"_spotLights",[]);this._pointVsmTex=e,this._spotVsmTex=r,this._projTexArray=t,this._pointDepth=a,this._spotDepth=i,this._pointFaceViews=c,this._spotFaceViews=l,this._pointDepthView=o,this._spotDepthView=u,this._pointPipeline=p,this._spotPipeline=d,this._shadowBufs=f,this._shadowBGs=_,this._modelBGL=h,this.pointVsmView=e.createView({dimension:"cube-array",arrayLayerCount:K*6}),this.spotVsmView=r.createView({dimension:"2d-array"}),this.projTexView=t.createView({dimension:"2d-array"})}static create(e){const{device:r}=e,t=r.createTexture({label:"PointVSM",size:{width:ne,height:ne,depthOrArrayLayers:K*6},format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),a=r.createTexture({label:"SpotVSM",size:{width:ie,height:ie,depthOrArrayLayers:$},format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),i=r.createTexture({label:"ProjTexArray",size:{width:H,height:H,depthOrArrayLayers:$},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),c=new Uint8Array(H*H*4).fill(255);for(let B=0;B<$;B++)r.queue.writeTexture({texture:i,origin:{x:0,y:0,z:B}},c,{bytesPerRow:H*4,rowsPerImage:H},{width:H,height:H,depthOrArrayLayers:1});const l=r.createTexture({label:"PointShadowDepth",size:{width:ne,height:ne},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),o=r.createTexture({label:"SpotShadowDepth",size:{width:ie,height:ie},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),u=Array.from({length:K*6},(B,P)=>t.createView({dimension:"2d",baseArrayLayer:P,arrayLayerCount:1})),p=Array.from({length:$},(B,P)=>a.createView({dimension:"2d",baseArrayLayer:P,arrayLayerCount:1})),d=l.createView(),f=o.createView(),_=r.createBindGroupLayout({label:"PSShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),h=r.createBindGroupLayout({label:"PSModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),v=[],g=[];for(let B=0;B<at;B++){const P=r.createBuffer({label:`PSShadowUniform ${B}`,size:pe,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});v.push(P),g.push(r.createBindGroup({label:`PSShadowBG ${B}`,layout:_,entries:[{binding:0,resource:{buffer:P}}]}))}const b=r.createPipelineLayout({bindGroupLayouts:[_,h]}),x=r.createShaderModule({label:"PointSpotShadowShader",code:tt}),y={module:x,buffers:[{arrayStride:ge,attributes:[ve[0]]}]},w=r.createRenderPipeline({label:"PointShadowPipeline",layout:b,vertex:{...y,entryPoint:"vs_point"},fragment:{module:x,entryPoint:"fs_point",targets:[{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),S=r.createRenderPipeline({label:"SpotShadowPipeline",layout:b,vertex:{...y,entryPoint:"vs_spot"},fragment:{module:x,entryPoint:"fs_spot",targets:[{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}});return new lr(t,a,i,l,o,u,p,d,f,w,S,v,g,h)}update(e,r,t){this._pointLights=e,this._spotLights=r,this._snapshot=t}setProjectionTexture(e,r,t){e.copyTextureToTexture({texture:t},{texture:this._projTexArray,origin:{x:0,y:0,z:r}},{width:H,height:H,depthOrArrayLayers:1})}execute(e,r){const{device:t}=r,a=this._snapshot;this._ensureModelBuffers(t,a.length);for(let o=0;o<this._spotLights.length&&o<$;o++){const u=this._spotLights[o];u.projectionTexture&&this.setProjectionTexture(e,o,u.projectionTexture)}for(let o=0;o<a.length;o++)r.queue.writeBuffer(this._modelBufs[o],0,a[o].modelMatrix.data.buffer);let i=0,c=0;for(const o of this._pointLights){if(!o.castShadow||c>=K)continue;const u=o.worldPosition(),p=o.cubeFaceViewProjs(),d=new Float32Array(pe/4);d[16]=u.x,d[17]=u.y,d[18]=u.z,d[19]=o.radius;for(let f=0;f<6;f++){d.set(p[f].data,0),r.queue.writeBuffer(this._shadowBufs[i],0,d.buffer);const _=c*6+f,h=e.beginRenderPass({label:`PointShadow light${c} face${f}`,colorAttachments:[{view:this._pointFaceViews[_],clearValue:{r:1,g:1,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._pointDepthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"discard"}});h.setPipeline(this._pointPipeline),h.setBindGroup(0,this._shadowBGs[i]),this._drawItems(h,a),h.end(),i++}c++}let l=0;for(const o of this._spotLights){if(!o.castShadow||l>=$)continue;const u=o.lightViewProj(),p=o.worldPosition(),d=new Float32Array(pe/4);d.set(u.data,0),d[16]=p.x,d[17]=p.y,d[18]=p.z,d[19]=o.range,r.queue.writeBuffer(this._shadowBufs[i],0,d.buffer);const f=e.beginRenderPass({label:`SpotShadow light${l}`,colorAttachments:[{view:this._spotFaceViews[l],clearValue:{r:1,g:1,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._spotDepthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"discard"}});f.setPipeline(this._spotPipeline),f.setBindGroup(0,this._shadowBGs[i]),this._drawItems(f,a),f.end(),i++,l++}}_drawItems(e,r){for(let t=0;t<r.length;t++){const{mesh:a}=r[t];e.setBindGroup(1,this._modelBGs[t]),e.setVertexBuffer(0,a.vertexBuffer),e.setIndexBuffer(a.indexBuffer,"uint32"),e.drawIndexed(a.indexCount)}}_ensureModelBuffers(e,r){for(;this._modelBufs.length<r;){const t=e.createBuffer({label:`PSModelUniform ${this._modelBufs.length}`,size:nt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._modelBufs.push(t),this._modelBGs.push(e.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:t}}]}))}}destroy(){this._pointVsmTex.destroy(),this._spotVsmTex.destroy(),this._projTexArray.destroy(),this._pointDepth.destroy(),this._spotDepth.destroy();for(const e of this._shadowBufs)e.destroy();for(const e of this._modelBufs)e.destroy()}}const st=`// Additive deferred pass for point and spot lights.\r
// Runs after LightingPass (which handles directional + IBL) with loadOp:'load'\r
// and srcFactor:'one' dstFactor:'one' so results accumulate on the HDR texture.\r
\r
const PI: f32 = 3.14159265358979323846;\r
\r
// ---- Camera (same layout as lighting.wgsl, 288 bytes) -------------------------\r
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
// ---- Light data ---------------------------------------------------------------\r
\r
struct LightCounts {\r
  numPoint: u32,\r
  numSpot : u32,\r
}\r
\r
// 48 bytes — must match TypeScript packing in updateLights()\r
struct PointLightGpu {\r
  position : vec3<f32>,   // offset 0\r
  radius   : f32,         // offset 12\r
  color    : vec3<f32>,   // offset 16\r
  intensity: f32,         // offset 28\r
  shadowIdx: i32,         // offset 32  — negative means no shadow\r
  _pad0    : i32,\r
  _pad1    : i32,\r
  _pad2    : i32,\r
}\r
\r
// 128 bytes — must match TypeScript packing in updateLights()\r
struct SpotLightGpu {\r
  position  : vec3<f32>,    // offset 0\r
  range     : f32,          // offset 12\r
  direction : vec3<f32>,    // offset 16\r
  innerCos  : f32,          // offset 28\r
  color     : vec3<f32>,    // offset 32\r
  outerCos  : f32,          // offset 44\r
  intensity : f32,          // offset 48\r
  shadowIdx : i32,          // offset 52\r
  projTexIdx: i32,          // offset 56\r
  _pad      : f32,          // offset 60\r
  lightViewProj: mat4x4<f32>, // offset 64\r
}\r
\r
@group(0) @binding(0) var<uniform>       camera     : CameraUniforms;\r
@group(2) @binding(0) var<uniform>       lightCounts: LightCounts;\r
@group(2) @binding(1) var<storage, read> pointLights: array<PointLightGpu>;\r
@group(2) @binding(2) var<storage, read> spotLights : array<SpotLightGpu>;\r
\r
// ---- GBuffer -----------------------------------------------------------------\r
\r
@group(1) @binding(0) var albedoRoughnessTex: texture_2d<f32>;\r
@group(1) @binding(1) var normalMetallicTex : texture_2d<f32>;\r
@group(1) @binding(2) var depthTex          : texture_depth_2d;\r
@group(1) @binding(3) var gbufferSampler    : sampler;\r
\r
// ---- Shadow maps + projection textures ----------------------------------------\r
\r
@group(3) @binding(0) var vsm_point   : texture_cube_array<f32>;\r
@group(3) @binding(1) var vsm_spot    : texture_2d_array<f32>;\r
@group(3) @binding(2) var proj_tex    : texture_2d_array<f32>;\r
@group(3) @binding(3) var vsm_sampler : sampler;\r
@group(3) @binding(4) var proj_sampler: sampler;\r
\r
// ---- Vertex ------------------------------------------------------------------\r
\r
struct VertexOutput {\r
  @builtin(position) clip_pos: vec4<f32>,\r
  @location(0)       uv      : vec2<f32>,\r
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
// ---- Helpers -----------------------------------------------------------------\r
\r
fn reconstruct_world_pos(uv: vec2<f32>, depth: f32) -> vec3<f32> {\r
  let ndc    = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);\r
  let world_h = camera.invViewProj * ndc;\r
  return world_h.xyz / world_h.w;\r
}\r
\r
// Variance shadow map: Chebyshev upper bound\r
fn vsm_shadow(moments: vec2<f32>, compare: f32) -> f32 {\r
  if (compare <= moments.x + 0.001) { return 1.0; }\r
  let variance = max(moments.y - moments.x * moments.x, 1e-5);\r
  let d = compare - moments.x;\r
  return variance / (variance + d * d);\r
}\r
\r
// Epic-style inverse-square attenuation with smooth radius falloff\r
fn point_attenuation(dist: f32, radius: f32) -> f32 {\r
  let r = dist / radius;\r
  return pow(saturate(1.0 - r * r * r * r), 2.0) / max(dist * dist, 0.0001);\r
}\r
\r
// ---- BRDF (same as lighting.wgsl) --------------------------------------------\r
\r
fn distribution_ggx(NdotH: f32, roughness: f32) -> f32 {\r
  let a  = roughness * roughness;\r
  let a2 = a * a;\r
  let d  = NdotH * NdotH * (a2 - 1.0) + 1.0;\r
  return a2 / (PI * d * d);\r
}\r
\r
fn geometry_direct(NdotX: f32, roughness: f32) -> f32 {\r
  let r = roughness + 1.0;\r
  let k = r * r / 8.0;\r
  return NdotX / (NdotX * (1.0 - k) + k);\r
}\r
\r
fn smith_direct(NdotV: f32, NdotL: f32, roughness: f32) -> f32 {\r
  return geometry_direct(NdotV, roughness) * geometry_direct(NdotL, roughness);\r
}\r
\r
fn fresnel_schlick(cosTheta: f32, F0: vec3<f32>) -> vec3<f32> {\r
  return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);\r
}\r
\r
fn cook_torrance(NdotV: f32, NdotL: f32, NdotH: f32, VdotH: f32, roughness: f32, F0: vec3<f32>, albedo: vec3<f32>, metallic: f32) -> vec3<f32> {\r
  let D  = distribution_ggx(NdotH, roughness);\r
  let G  = smith_direct(NdotV, NdotL, roughness);\r
  let Fd = fresnel_schlick(VdotH, F0);\r
  let kD = (vec3<f32>(1.0) - Fd) * (1.0 - metallic);\r
  let specular = D * G * Fd / max(4.0 * NdotV * NdotL, 0.001);\r
  let diffuse  = kD * albedo / PI;\r
  return diffuse + specular;\r
}\r
\r
// ---- Fragment ----------------------------------------------------------------\r
\r
@fragment\r
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {\r
  let coord = vec2<i32>(in.clip_pos.xy);\r
  let depth = textureLoad(depthTex, coord, 0);\r
  if (depth >= 1.0) { discard; }  // sky — directional pass handles it\r
\r
  let albedo_rough = textureLoad(albedoRoughnessTex, coord, 0);\r
  let normal_metal = textureLoad(normalMetallicTex,  coord, 0);\r
\r
  let albedo    = albedo_rough.rgb;\r
  let roughness = max(albedo_rough.a, 0.04);\r
  let N         = normalize(normal_metal.rgb * 2.0 - 1.0);\r
  let metallic  = normal_metal.a;\r
\r
  let world_pos = reconstruct_world_pos(in.uv, depth);\r
  let V         = normalize(camera.position - world_pos);\r
  let NdotV     = max(dot(N, V), 0.001);\r
  let F0        = mix(vec3<f32>(0.04), albedo, metallic);\r
\r
  var accum = vec3<f32>(0.0);\r
\r
  // ---- Point lights ----------------------------------------------------------\r
  for (var i = 0u; i < lightCounts.numPoint; i++) {\r
    let pl   = pointLights[i];\r
    let diff = pl.position - world_pos;\r
    let dist = length(diff);\r
    if (dist >= pl.radius) { continue; }\r
\r
    let L     = diff / dist;\r
    let NdotL = max(dot(N, L), 0.0);\r
    if (NdotL <= 0.0) { continue; }\r
\r
    let H     = normalize(L + V);\r
    let NdotH = max(dot(N, H), 0.0);\r
    let VdotH = max(dot(V, H), 0.0);\r
\r
    let brdf = cook_torrance(NdotV, NdotL, NdotH, VdotH, roughness, F0, albedo, metallic);\r
    let att  = point_attenuation(dist, pl.radius);\r
\r
    // VSM cube-array shadow\r
    var shad = 1.0;\r
    if (pl.shadowIdx >= 0) {\r
      let dir     = -normalize(diff);  // from light toward surface\r
      let compare = dist / pl.radius;\r
      let moments = textureSampleLevel(vsm_point, vsm_sampler, dir, pl.shadowIdx, 0.0).rg;\r
      shad = vsm_shadow(moments, compare);\r
    }\r
\r
    accum += brdf * pl.color * pl.intensity * NdotL * att * shad;\r
  }\r
\r
  // ---- Spot lights -----------------------------------------------------------\r
  for (var i = 0u; i < lightCounts.numSpot; i++) {\r
    let sl   = spotLights[i];\r
    let diff = sl.position - world_pos;\r
    let dist = length(diff);\r
    if (dist >= sl.range) { continue; }\r
\r
    let L        = diff / dist;\r
    let NdotL    = max(dot(N, L), 0.0);\r
    if (NdotL <= 0.0) { continue; }\r
\r
    // Spot cone attenuation\r
    let cos_angle = dot(-L, sl.direction);\r
    if (cos_angle <= sl.outerCos) { continue; }\r
    let cone = smoothstep(sl.outerCos, sl.innerCos, cos_angle);\r
\r
    let H     = normalize(L + V);\r
    let NdotH = max(dot(N, H), 0.0);\r
    let VdotH = max(dot(V, H), 0.0);\r
\r
    let brdf = cook_torrance(NdotV, NdotL, NdotH, VdotH, roughness, F0, albedo, metallic);\r
    let att  = point_attenuation(dist, sl.range);\r
\r
    // VSM + projection texture (computed from light-space coords)\r
    var modulator = vec3<f32>(1.0);\r
    if (sl.shadowIdx >= 0 || sl.projTexIdx >= 0) {\r
      let ls     = sl.lightViewProj * vec4<f32>(world_pos, 1.0);\r
      let sc     = ls.xyz / ls.w;\r
      let uv     = vec2<f32>(sc.x * 0.5 + 0.5, -sc.y * 0.5 + 0.5);\r
      let in_frustum = all(uv >= vec2<f32>(0.0)) && all(uv <= vec2<f32>(1.0)) && sc.z >= 0.0 && sc.z <= 1.0;\r
\r
      if (in_frustum) {\r
        if (sl.shadowIdx >= 0) {\r
          let moments = textureSampleLevel(vsm_spot, vsm_sampler, uv, sl.shadowIdx, 0.0).rg;\r
          modulator *= vec3<f32>(vsm_shadow(moments, sc.z));\r
        }\r
        if (sl.projTexIdx >= 0) {\r
          modulator *= textureSampleLevel(proj_tex, proj_sampler, uv, sl.projTexIdx, 0.0).rgb;\r
        }\r
      } else {\r
        modulator = vec3<f32>(0.0);  // outside frustum → no contribution\r
      }\r
    }\r
\r
    accum += brdf * sl.color * sl.intensity * NdotL * att * cone * modulator;\r
  }\r
\r
  return vec4<f32>(accum, 0.0);\r
}\r
`,Ce=64*4+16+16,ot=8,Oe=48,Ie=128;class cr extends D{constructor(e,r,t,a,i,c,l,o,u,p){super();s(this,"name","PointSpotLightPass");s(this,"_pipeline");s(this,"_cameraBG");s(this,"_gbufferBG");s(this,"_lightBG");s(this,"_shadowBG");s(this,"_cameraBuffer");s(this,"_lightCountsBuffer");s(this,"_pointBuffer");s(this,"_spotBuffer");s(this,"_hdrView");s(this,"_cameraData",new Float32Array(Ce/4));s(this,"_lightCountsArr",new Uint32Array(2));s(this,"_pointBuf",new ArrayBuffer(re*Oe));s(this,"_pointF32",new Float32Array(this._pointBuf));s(this,"_pointI32",new Int32Array(this._pointBuf));s(this,"_spotBuf",new ArrayBuffer(te*Ie));s(this,"_spotF32",new Float32Array(this._spotBuf));s(this,"_spotI32",new Int32Array(this._spotBuf));this._pipeline=e,this._cameraBG=r,this._gbufferBG=t,this._lightBG=a,this._shadowBG=i,this._cameraBuffer=c,this._lightCountsBuffer=l,this._pointBuffer=o,this._spotBuffer=u,this._hdrView=p}static create(e,r,t,a){const{device:i}=e,c=i.createBuffer({label:"PSLCameraBuffer",size:Ce,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),l=i.createBuffer({label:"PSLLightCounts",size:ot,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),o=i.createBuffer({label:"PSLPointBuffer",size:re*Oe,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),u=i.createBuffer({label:"PSLSpotBuffer",size:te*Ie,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),p=i.createSampler({label:"PSLLinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),d=i.createSampler({label:"PSLVsmSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge"}),f=i.createSampler({label:"PSLProjSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),_=i.createBindGroupLayout({label:"PSLCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),h=i.createBindGroupLayout({label:"PSLGBufferBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),v=i.createBindGroupLayout({label:"PSLLightBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),g=i.createBindGroupLayout({label:"PSLShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube-array"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d-array"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d-array"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),b=i.createBindGroup({label:"PSLCameraBG",layout:_,entries:[{binding:0,resource:{buffer:c}}]}),x=i.createBindGroup({label:"PSLGBufferBG",layout:h,entries:[{binding:0,resource:r.albedoRoughnessView},{binding:1,resource:r.normalMetallicView},{binding:2,resource:r.depthView},{binding:3,resource:p}]}),y=i.createBindGroup({label:"PSLLightBG",layout:v,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:u}}]}),w=i.createBindGroup({label:"PSLShadowBG",layout:g,entries:[{binding:0,resource:t.pointVsmView},{binding:1,resource:t.spotVsmView},{binding:2,resource:t.projTexView},{binding:3,resource:d},{binding:4,resource:f}]}),S=i.createShaderModule({label:"PointSpotLightShader",code:st}),B=i.createRenderPipeline({label:"PointSpotLightPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[_,h,v,g]}),vertex:{module:S,entryPoint:"vs_main"},fragment:{module:S,entryPoint:"fs_main",targets:[{format:V,blend:{color:{srcFactor:"one",dstFactor:"one",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one",operation:"add"}}}]},primitive:{topology:"triangle-list"}});return new cr(B,b,x,y,w,c,l,o,u,a)}updateCamera(e,r,t,a,i,c,l,o){const u=this._cameraData;u.set(r.data,0),u.set(t.data,16),u.set(a.data,32),u.set(i.data,48),u[64]=c.x,u[65]=c.y,u[66]=c.z,u[67]=l,u[68]=o,e.queue.writeBuffer(this._cameraBuffer,0,u.buffer)}updateLights(e,r,t){const a=this._lightCountsArr;a[0]=Math.min(r.length,re),a[1]=Math.min(t.length,te),e.queue.writeBuffer(this._lightCountsBuffer,0,a.buffer);const i=this._pointF32,c=this._pointI32;let l=0;for(let d=0;d<Math.min(r.length,re);d++){const f=r[d],_=f.worldPosition(),h=d*12;i[h+0]=_.x,i[h+1]=_.y,i[h+2]=_.z,i[h+3]=f.radius,i[h+4]=f.color.x,i[h+5]=f.color.y,i[h+6]=f.color.z,i[h+7]=f.intensity,f.castShadow&&l<K?c[h+8]=l++:c[h+8]=-1,c[h+9]=0,c[h+10]=0,c[h+11]=0}e.queue.writeBuffer(this._pointBuffer,0,this._pointBuf);const o=this._spotF32,u=this._spotI32;let p=0;for(let d=0;d<Math.min(t.length,te);d++){const f=t[d],_=f.worldPosition(),h=f.worldDirection(),v=f.lightViewProj(),g=d*32;o[g+0]=_.x,o[g+1]=_.y,o[g+2]=_.z,o[g+3]=f.range,o[g+4]=h.x,o[g+5]=h.y,o[g+6]=h.z,o[g+7]=Math.cos(f.innerAngle*Math.PI/180),o[g+8]=f.color.x,o[g+9]=f.color.y,o[g+10]=f.color.z,o[g+11]=Math.cos(f.outerAngle*Math.PI/180),o[g+12]=f.intensity,f.castShadow&&p<$?u[g+13]=p++:u[g+13]=-1,u[g+14]=f.projectionTexture!==null?d:-1,u[g+15]=0,o.set(v.data,g+16)}e.queue.writeBuffer(this._spotBuffer,0,this._spotBuf)}execute(e,r){const t=e.beginRenderPass({label:"PointSpotLightPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}]});t.setPipeline(this._pipeline),t.setBindGroup(0,this._cameraBG),t.setBindGroup(1,this._gbufferBG),t.setBindGroup(2,this._lightBG),t.setBindGroup(3,this._shadowBG),t.draw(3),t.end()}destroy(){this._cameraBuffer.destroy(),this._lightCountsBuffer.destroy(),this._pointBuffer.destroy(),this._spotBuffer.destroy()}}const ur=`
struct Particle {
  position : vec3<f32>,  // offset  0
  life     : f32,        // offset 12  (-1 = dead)
  velocity : vec3<f32>,  // offset 16
  max_life : f32,        // offset 28
  color    : vec4<f32>,  // offset 32
  size     : f32,        // offset 48
  rotation : f32,        // offset 52
  _pad     : vec2<f32>,  // offset 56
}                        // total: 64 bytes

struct ComputeUniforms {
  world_pos     : vec3<f32>,
  spawn_count   : u32,
  world_quat    : vec4<f32>,
  spawn_offset  : u32,
  max_particles : u32,
  frame_seed    : u32,
  _pad0         : u32,
  dt            : f32,
  time          : f32,
  _pad1         : vec2<f32>,
}

fn pcg_hash(v: u32) -> u32 {
  let state = v * 747796405u + 2891336453u;
  let word  = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
  return (word >> 22u) ^ word;
}

fn rand_f32(seed: u32) -> f32 {
  return f32(pcg_hash(seed)) / 4294967295.0;
}

fn rand_range(lo: f32, hi: f32, seed: u32) -> f32 {
  return lo + rand_f32(seed) * (hi - lo);
}

fn quat_rotate(q: vec4<f32>, v: vec3<f32>) -> vec3<f32> {
  let t = 2.0 * cross(q.xyz, v);
  return v + q.w * t + cross(q.xyz, t);
}

// Uniform sample in a spherical cap of half-angle acos(cos_max) around +Y.
fn sample_cone(seed0: u32, seed1: u32, cos_max: f32) -> vec3<f32> {
  let cos_theta = mix(cos_max, 1.0, rand_f32(seed0));
  let sin_theta = sqrt(max(0.0, 1.0 - cos_theta * cos_theta));
  let phi       = rand_f32(seed1) * 6.28318530717958647;
  return vec3<f32>(sin_theta * cos(phi), cos_theta, sin_theta * sin(phi));
}

// 3-component gradient noise helpers for curl noise
fn hash3(p: vec3<f32>) -> vec3<f32> {
  var q = vec3<f32>(
    dot(p, vec3<f32>(127.1, 311.7, 74.7)),
    dot(p, vec3<f32>(269.5, 183.3, 246.1)),
    dot(p, vec3<f32>(113.5,  271.9, 124.6)),
  );
  return fract(sin(q) * 43758.5453123);
}

fn noise3(p: vec3<f32>) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(dot(hash3(i + vec3(0.,0.,0.)) * 2.0 - 1.0, f - vec3(0.,0.,0.)),
            dot(hash3(i + vec3(1.,0.,0.)) * 2.0 - 1.0, f - vec3(1.,0.,0.)), u.x),
        mix(dot(hash3(i + vec3(0.,1.,0.)) * 2.0 - 1.0, f - vec3(0.,1.,0.)),
            dot(hash3(i + vec3(1.,1.,0.)) * 2.0 - 1.0, f - vec3(1.,1.,0.)), u.x), u.y),
    mix(mix(dot(hash3(i + vec3(0.,0.,1.)) * 2.0 - 1.0, f - vec3(0.,0.,1.)),
            dot(hash3(i + vec3(1.,0.,1.)) * 2.0 - 1.0, f - vec3(1.,0.,1.)), u.x),
        mix(dot(hash3(i + vec3(0.,1.,1.)) * 2.0 - 1.0, f - vec3(0.,1.,1.)),
            dot(hash3(i + vec3(1.,1.,1.)) * 2.0 - 1.0, f - vec3(1.,1.,1.)), u.x), u.y), u.z);
}

fn curl_noise(p: vec3<f32>) -> vec3<f32> {
  let e  = 0.1;
  let ex = vec3<f32>(e,   0.0, 0.0);
  let ey = vec3<f32>(0.0, e,   0.0);
  let ez = vec3<f32>(0.0, 0.0, e  );
  // Three decorrelated potential fields: Fx=noise3(p), Fy=noise3(p+o1), Fz=noise3(p+o2)
  let o1 = vec3<f32>(31.416, 27.183, 14.142);
  let o2 = vec3<f32>(62.832, 54.366, 28.284);
  // curl(F).x = dFz/dy - dFy/dz
  let cx = (noise3(p + o2 + ey) - noise3(p + o2 - ey))
         - (noise3(p + o1 + ez) - noise3(p + o1 - ez));
  // curl(F).y = dFx/dz - dFz/dx
  let cy = (noise3(p + ez)      - noise3(p - ez))
         - (noise3(p + o2 + ex) - noise3(p + o2 - ex));
  // curl(F).z = dFy/dx - dFx/dy
  let cz = (noise3(p + o1 + ex) - noise3(p + o1 - ex))
         - (noise3(p + ey)      - noise3(p - ey));
  return vec3<f32>(cx, cy, cz) / (2.0 * e);
}

// FBM curl noise: sums octaves at increasing frequencies / decreasing amplitudes.
// Normalized so output magnitude matches single-octave curl_noise.
fn curl_noise_fbm(p: vec3<f32>, octaves: i32) -> vec3<f32> {
  var result    = vec3<f32>(0.0);
  var freq      = 1.0;
  var amp       = 0.5;
  var total_amp = 0.0;
  for (var o = 0; o < octaves; o++) {
    result    += curl_noise(p * freq) * amp;
    total_amp += amp;
    freq      *= 2.0;
    amp       *= 0.5;
  }
  return result / total_amp;
}
`;function lt(m){switch(m.kind){case"sphere":{const n=Math.cos(m.solidAngle).toFixed(6),e=m.radius.toFixed(6);return`{
  let dir = sample_cone(seed + 10u, seed + 11u, ${n});
  let world_dir = quat_rotate(uniforms.world_quat, dir);
  p.position = uniforms.world_pos + world_dir * ${e};
  p.velocity = world_dir * speed;
}`}case"cone":{const n=Math.cos(m.angle).toFixed(6),e=m.radius.toFixed(6);return`{
  let dir = sample_cone(seed + 10u, seed + 11u, ${n});
  let world_dir = quat_rotate(uniforms.world_quat, dir);
  p.position = uniforms.world_pos + world_dir * ${e};
  p.velocity = world_dir * speed;
}`}case"box":{const[n,e,r]=m.halfExtents.map(t=>t.toFixed(6));return`{
  let local_off = vec3<f32>(
    (rand_f32(seed + 10u) * 2.0 - 1.0) * ${n},
    (rand_f32(seed + 11u) * 2.0 - 1.0) * ${e},
    (rand_f32(seed + 12u) * 2.0 - 1.0) * ${r},
  );
  let up = quat_rotate(uniforms.world_quat, vec3<f32>(0.0, 1.0, 0.0));
  p.position = uniforms.world_pos + quat_rotate(uniforms.world_quat, local_off);
  p.velocity = up * speed;
}`}}}function dr(m){switch(m.type){case"gravity":return`p.velocity.y -= ${m.strength.toFixed(6)} * uniforms.dt;`;case"drag":return`p.velocity -= p.velocity * ${m.coefficient.toFixed(6)} * uniforms.dt;`;case"force":{const[n,e,r]=m.direction.map(t=>t.toFixed(6));return`p.velocity += vec3<f32>(${n}, ${e}, ${r}) * ${m.strength.toFixed(6)} * uniforms.dt;`}case"swirl_force":{const n=m.speed.toFixed(6),e=m.strength.toFixed(6);return`{
  let swirl_angle = uniforms.time * ${n};
  p.velocity += vec3<f32>(cos(swirl_angle), 0.0, sin(swirl_angle)) * ${e} * uniforms.dt;
}`}case"vortex":return`{
  let vx_radial = p.position.xz - uniforms.world_pos.xz;
  p.velocity += vec3<f32>(-vx_radial.y, 0.0, vx_radial.x) * ${m.strength.toFixed(6)} * uniforms.dt;
}`;case"curl_noise":{const n=m.octaves??1,e=n>1?`curl_noise_fbm(cn_pos, ${n})`:"curl_noise(cn_pos)";return`{
  let cn_pos = p.position * ${m.scale.toFixed(6)} + uniforms.time * ${m.timeScale.toFixed(6)};
  p.velocity += ${e} * ${m.strength.toFixed(6)} * uniforms.dt;
}`}case"size_random":return`p.size = rand_range(${m.min.toFixed(6)}, ${m.max.toFixed(6)}, pcg_hash(idx * 2654435761u));`;case"size_over_lifetime":return`p.size = mix(${m.start.toFixed(6)}, ${m.end.toFixed(6)}, t);`;case"color_over_lifetime":{const[n,e,r,t]=m.startColor.map(o=>o.toFixed(6)),[a,i,c,l]=m.endColor.map(o=>o.toFixed(6));return`p.color = mix(vec4<f32>(${n}, ${e}, ${r}, ${t}), vec4<f32>(${a}, ${i}, ${c}, ${l}), t);`}case"block_collision":return`{
  let _bc_uv = (p.position.xz - vec2<f32>(hm.origin_x, hm.origin_z)) / (hm.extent * 2.0) + 0.5;
  if (all(_bc_uv >= vec2<f32>(0.0)) && all(_bc_uv <= vec2<f32>(1.0))) {
    let _bc_xi = clamp(u32(_bc_uv.x * f32(hm.resolution)), 0u, hm.resolution - 1u);
    let _bc_zi = clamp(u32(_bc_uv.y * f32(hm.resolution)), 0u, hm.resolution - 1u);
    if (p.position.y <= hm_data[_bc_zi * hm.resolution + _bc_xi]) {
      particles[idx].life = -1.0; return;
    }
  }
}`}}function fr(m,n){return m?m.filter(e=>e.trigger===n).flatMap(e=>e.actions.map(dr)).join(`
  `):""}function ct(m){const{emitter:n,events:e}=m,[r,t]=n.lifetime.map(f=>f.toFixed(6)),[a,i]=n.initialSpeed.map(f=>f.toFixed(6)),[c,l]=n.initialSize.map(f=>f.toFixed(6)),[o,u,p,d]=n.initialColor.map(f=>f.toFixed(6));return`
${ur}

@group(0) @binding(0) var<storage, read_write> particles  : array<Particle>;
@group(0) @binding(1) var<storage, read_write> alive_list : array<u32>;
@group(0) @binding(2) var<storage, read_write> counter    : atomic<u32>;
@group(0) @binding(3) var<storage, read_write> indirect   : array<u32>;
@group(1) @binding(0) var<uniform>             uniforms   : ComputeUniforms;

@compute @workgroup_size(64)
fn cs_main(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (gid.x >= uniforms.spawn_count) { return; }

  let idx  = (uniforms.spawn_offset + gid.x) % uniforms.max_particles;
  // Use the globally unique cumulative spawn index as the seed so consecutive frames
  // never collide on gid.x + frame_seed = (gid.x+1) + (frame_seed-1).
  let seed = pcg_hash(uniforms.spawn_offset + gid.x);

  let speed = rand_range(${a}, ${i}, seed + 1u);

  var p: Particle;
  p.life     = 0.0;
  p.max_life = rand_range(${r}, ${t}, seed + 2u);
  p.color    = vec4<f32>(${o}, ${u}, ${p}, ${d});
  p.size     = rand_range(${c}, ${l}, seed + 3u);
  p.rotation = rand_f32(seed + 4u) * 6.28318530717958647;

  ${lt(n.shape)}

  ${fr(e,"on_spawn")}

  particles[idx] = p;
}
`}function ut(m){return m.modifiers.some(n=>n.type==="block_collision")}const dt=`
struct HeightmapUniforms {
  origin_x  : f32,
  origin_z  : f32,
  extent    : f32,
  resolution: u32,
}
@group(2) @binding(0) var<storage, read> hm_data: array<f32>;
@group(2) @binding(1) var<uniform>       hm     : HeightmapUniforms;
`;function ft(m){const n=m.modifiers.some(t=>t.type==="block_collision"),e=m.modifiers.map(dr).join(`
  `),r=fr(m.events,"on_death");return`
${ur}
${n?dt:""}

@group(0) @binding(0) var<storage, read_write> particles  : array<Particle>;
@group(0) @binding(1) var<storage, read_write> alive_list : array<u32>;
@group(0) @binding(2) var<storage, read_write> counter    : atomic<u32>;
@group(0) @binding(3) var<storage, read_write> indirect   : array<u32>;
@group(1) @binding(0) var<uniform>             uniforms   : ComputeUniforms;

@compute @workgroup_size(64)
fn cs_main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let idx = gid.x;
  if (idx >= uniforms.max_particles) { return; }

  var p = particles[idx];
  if (p.life < 0.0) { return; }

  p.life += uniforms.dt;
  if (p.life >= p.max_life) {
    ${r}
    particles[idx].life = -1.0;
    return;
  }

  let t = p.life / p.max_life;

  ${e}

  p.position += p.velocity * uniforms.dt;
  particles[idx] = p;
}
`}const pt=`// Compact pass — rebuilds alive_list and writes indirect draw instance count.\r
// Two entry points used as two sequential dispatches within one compute pass:\r
//   cs_compact      — ceil(maxParticles/64) workgroups, fills alive_list\r
//   cs_write_indirect — 1 workgroup, copies alive_count → indirect.instanceCount\r
\r
struct Particle {\r
  position : vec3<f32>,\r
  life     : f32,\r
  velocity : vec3<f32>,\r
  max_life : f32,\r
  color    : vec4<f32>,\r
  size     : f32,\r
  rotation : f32,\r
  _pad     : vec2<f32>,\r
}\r
\r
struct CompactUniforms {\r
  max_particles: u32,\r
  _pad0        : u32,\r
  _pad1        : u32,\r
  _pad2        : u32,\r
}\r
\r
@group(0) @binding(0) var<storage, read>       particles  : array<Particle>;\r
@group(0) @binding(1) var<storage, read_write> alive_list : array<u32>;\r
@group(0) @binding(2) var<storage, read_write> counter    : atomic<u32>;\r
@group(0) @binding(3) var<storage, read_write> indirect   : array<u32>;\r
@group(1) @binding(0) var<uniform>             uniforms   : CompactUniforms;\r
\r
@compute @workgroup_size(64)\r
fn cs_compact(@builtin(global_invocation_id) gid: vec3<u32>) {\r
  let idx = gid.x;\r
  if (idx >= uniforms.max_particles) { return; }\r
  if (particles[idx].life < 0.0) { return; }\r
  let slot = atomicAdd(&counter, 1u);\r
  alive_list[slot] = idx;\r
}\r
\r
@compute @workgroup_size(1)\r
fn cs_write_indirect() {\r
  // indirect layout: [vertexCount, instanceCount, firstVertex, firstInstance]\r
  indirect[1] = atomicLoad(&counter);\r
}\r
`,ht=`// Particle GBuffer render pass — camera-facing billboard quads.\r
// Each instance reads one alive particle and writes to the deferred GBuffer.\r
// Normal is the billboard face direction (toward camera) for deferred lighting.\r
\r
struct Particle {\r
  position : vec3<f32>,\r
  life     : f32,\r
  velocity : vec3<f32>,\r
  max_life : f32,\r
  color    : vec4<f32>,\r
  size     : f32,\r
  rotation : f32,\r
  _pad     : vec2<f32>,\r
}\r
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
struct ParticleRenderUniforms {\r
  roughness : f32,\r
  metallic  : f32,\r
  _pad      : vec2<f32>,\r
}\r
\r
@group(0) @binding(0) var<storage, read> particles  : array<Particle>;\r
@group(0) @binding(1) var<storage, read> alive_list : array<u32>;\r
@group(1) @binding(0) var<uniform>       camera     : CameraUniforms;\r
@group(2) @binding(0) var<uniform>       mat_params : ParticleRenderUniforms;\r
\r
struct VertexOutput {\r
  @builtin(position) clip_pos  : vec4<f32>,\r
  @location(0)       color     : vec4<f32>,\r
  @location(1)       uv        : vec2<f32>,\r
  @location(2)       world_pos : vec3<f32>,\r
  @location(3)       face_norm : vec3<f32>,\r
}\r
\r
// 2-triangle quad: 6 vertex positions in [-0.5, 0.5]²\r
fn quad_offset(vid: u32) -> vec2<f32> {\r
  switch vid {\r
    case 0u: { return vec2<f32>(-0.5, -0.5); }\r
    case 1u: { return vec2<f32>( 0.5, -0.5); }\r
    case 2u: { return vec2<f32>(-0.5,  0.5); }\r
    case 3u: { return vec2<f32>( 0.5, -0.5); }\r
    case 4u: { return vec2<f32>( 0.5,  0.5); }\r
    default: { return vec2<f32>(-0.5,  0.5); }\r
  }\r
}\r
\r
fn quad_uv(vid: u32) -> vec2<f32> {\r
  switch vid {\r
    case 0u: { return vec2<f32>(0.0, 1.0); }\r
    case 1u: { return vec2<f32>(1.0, 1.0); }\r
    case 2u: { return vec2<f32>(0.0, 0.0); }\r
    case 3u: { return vec2<f32>(1.0, 1.0); }\r
    case 4u: { return vec2<f32>(1.0, 0.0); }\r
    default: { return vec2<f32>(0.0, 0.0); }\r
  }\r
}\r
\r
@vertex\r
fn vs_main(\r
  @builtin(vertex_index)   vid: u32,\r
  @builtin(instance_index) iid: u32,\r
) -> VertexOutput {\r
  let p_idx = alive_list[iid];\r
  let p     = particles[p_idx];\r
\r
  // Camera right and up from the view matrix rows (column-major storage)\r
  let cam_right = vec3<f32>(camera.view[0].x, camera.view[1].x, camera.view[2].x);\r
  let cam_up    = vec3<f32>(camera.view[0].y, camera.view[1].y, camera.view[2].y);\r
\r
  // Rotate quad corner around particle center using particle.rotation angle\r
  let ofs    = quad_offset(vid);\r
  let c      = cos(p.rotation);\r
  let s      = sin(p.rotation);\r
  let rotated = vec2<f32>(c * ofs.x - s * ofs.y, s * ofs.x + c * ofs.y);\r
\r
  let world_pos = p.position\r
    + cam_right * rotated.x * p.size\r
    + cam_up    * rotated.y * p.size;\r
\r
  let face_norm = normalize(camera.position - p.position);\r
\r
  var out: VertexOutput;\r
  out.clip_pos  = camera.viewProj * vec4<f32>(world_pos, 1.0);\r
  out.color     = p.color;\r
  out.uv        = quad_uv(vid);\r
  out.world_pos = world_pos;\r
  out.face_norm = face_norm;\r
  return out;\r
}\r
\r
struct GBufferOutput {\r
  @location(0) albedo_roughness : vec4<f32>,  // rgba8unorm\r
  @location(1) normal_metallic  : vec4<f32>,  // rgba16float\r
}\r
\r
@fragment\r
fn fs_main(in: VertexOutput) -> GBufferOutput {\r
  // Circular clip for round particles\r
  let d = length(in.uv - 0.5) * 2.0;\r
  if (d > 1.0) { discard; }\r
\r
  // Encode world-space normal as [0,1]\r
  let N = normalize(in.face_norm);\r
\r
  var out: GBufferOutput;\r
  out.albedo_roughness = vec4<f32>(in.color.rgb, mat_params.roughness);\r
  out.normal_metallic  = vec4<f32>(N * 0.5 + 0.5, mat_params.metallic);\r
  return out;\r
}\r
`,mt=`// Particle forward HDR render pass — velocity-aligned billboard quads.\r
// Writes directly to the HDR buffer with alpha blending.\r
// Used for transparent effects like rain, smoke, sparks.\r
\r
struct Particle {\r
  position : vec3<f32>,\r
  life     : f32,\r
  velocity : vec3<f32>,\r
  max_life : f32,\r
  color    : vec4<f32>,\r
  size     : f32,\r
  rotation : f32,\r
  _pad     : vec2<f32>,\r
}\r
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
@group(0) @binding(0) var<storage, read> particles  : array<Particle>;\r
@group(0) @binding(1) var<storage, read> alive_list : array<u32>;\r
@group(1) @binding(0) var<uniform>       camera     : CameraUniforms;\r
\r
struct VertexOutput {\r
  @builtin(position) clip_pos : vec4<f32>,\r
  @location(0)       color    : vec4<f32>,\r
  @location(1)       uv       : vec2<f32>,\r
}\r
\r
// Quad UV: x in [-0.5, 0.5], y in [-0.5, 0.5].\r
// y=−0.5 is the tail (toward velocity), y=+0.5 is the head.\r
fn quad_offset(vid: u32) -> vec2<f32> {\r
  switch vid {\r
    case 0u: { return vec2<f32>(-0.5, -0.5); }\r
    case 1u: { return vec2<f32>( 0.5, -0.5); }\r
    case 2u: { return vec2<f32>(-0.5,  0.5); }\r
    case 3u: { return vec2<f32>( 0.5, -0.5); }\r
    case 4u: { return vec2<f32>( 0.5,  0.5); }\r
    default: { return vec2<f32>(-0.5,  0.5); }\r
  }\r
}\r
\r
fn quad_uv(vid: u32) -> vec2<f32> {\r
  switch vid {\r
    case 0u: { return vec2<f32>(0.0, 1.0); }\r
    case 1u: { return vec2<f32>(1.0, 1.0); }\r
    case 2u: { return vec2<f32>(0.0, 0.0); }\r
    case 3u: { return vec2<f32>(1.0, 1.0); }\r
    case 4u: { return vec2<f32>(1.0, 0.0); }\r
    default: { return vec2<f32>(0.0, 0.0); }\r
  }\r
}\r
\r
@vertex\r
fn vs_main(\r
  @builtin(vertex_index)   vid: u32,\r
  @builtin(instance_index) iid: u32,\r
) -> VertexOutput {\r
  let p_idx = alive_list[iid];\r
  let p     = particles[p_idx];\r
\r
  let ofs = quad_offset(vid);\r
\r
  // Velocity-aligned billboard: long axis follows velocity direction.\r
  let vel     = p.velocity;\r
  let spd     = length(vel);\r
  let vel_dir = select(vec3<f32>(0.0, 1.0, 0.0), vel / max(spd, 0.001), spd > 0.001);\r
  let cam_dir = normalize(camera.position - p.position);\r
  // right is perpendicular to both velocity and cam direction\r
  let right   = normalize(cross(vel_dir, cam_dir));\r
\r
  // Minimal stretch so each drop stays compact\r
  let stretch = 1.0 + spd * 0.04;\r
\r
  let world_pos = p.position\r
    + right   * ofs.x * p.size\r
    + vel_dir * ofs.y * p.size * stretch;\r
\r
  var out: VertexOutput;\r
  out.clip_pos = camera.viewProj * vec4<f32>(world_pos, 1.0);\r
  out.color    = p.color;\r
  out.uv       = quad_uv(vid);\r
  return out;\r
}\r
\r
const EMIT_SCALE: f32 = 4.0;\r
\r
@fragment\r
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {\r
  // Fade alpha at the tips of the streak (uv.y near 0 or 1)\r
  let t = abs(in.uv.y * 2.0 - 1.0);\r
  let alpha = in.color.a * (1.0 - t * t);\r
  return vec4<f32>(in.color.rgb * EMIT_SCALE, alpha);\r
}\r
\r
// ---- Camera-aligned billboard (snow, soft particles) ------------------------\r
\r
@vertex\r
fn vs_camera(\r
  @builtin(vertex_index)   vid: u32,\r
  @builtin(instance_index) iid: u32,\r
) -> VertexOutput {\r
  let p_idx = alive_list[iid];\r
  let p     = particles[p_idx];\r
\r
  let ofs = quad_offset(vid);\r
\r
  // Extract world-space right and up from the view matrix rows.\r
  // Column-major mat4x4: view[col][row], so row 0 = right, row 1 = up.\r
  let right = vec3<f32>(camera.view[0][0], camera.view[1][0], camera.view[2][0]);\r
  let up    = vec3<f32>(camera.view[0][1], camera.view[1][1], camera.view[2][1]);\r
\r
  let world_pos = p.position\r
    + right * ofs.x * p.size\r
    + up    * ofs.y * p.size;\r
\r
  var out: VertexOutput;\r
  out.clip_pos = camera.viewProj * vec4<f32>(world_pos, 1.0);\r
  out.color    = p.color;\r
  out.uv       = quad_uv(vid);\r
  return out;\r
}\r
\r
@fragment\r
fn fs_snow(in: VertexOutput) -> @location(0) vec4<f32> {\r
  // Soft circular disc with radial falloff from centre.\r
  let uv = in.uv * 2.0 - 1.0;\r
  let d2 = dot(uv, uv);\r
  if (d2 > 1.0) { discard; }\r
  let alpha = in.color.a * (1.0 - d2);\r
  return vec4<f32>(in.color.rgb * EMIT_SCALE, alpha);\r
}\r
`,De=64,Fe=80,_t=16,gt=16,ke=288,He=16,he=128;class pr extends D{constructor(e,r,t,a,i,c,l,o,u,p,d,f,_,h,v,g,b,x,y,w,S,B,P,E,G,U,M){super();s(this,"name","ParticlePass");s(this,"_gbuffer");s(this,"_hdrView");s(this,"_isForward");s(this,"_maxParticles");s(this,"_config");s(this,"_particleBuffer");s(this,"_aliveList");s(this,"_counterBuffer");s(this,"_indirectBuffer");s(this,"_computeUniforms");s(this,"_renderUniforms");s(this,"_cameraBuffer");s(this,"_spawnPipeline");s(this,"_updatePipeline");s(this,"_compactPipeline");s(this,"_indirectPipeline");s(this,"_renderPipeline");s(this,"_computeDataBG");s(this,"_computeUniBG");s(this,"_compactDataBG");s(this,"_compactUniBG");s(this,"_renderDataBG");s(this,"_cameraRenderBG");s(this,"_renderParamsBG");s(this,"_heightmapDataBuf");s(this,"_heightmapUniBuf");s(this,"_heightmapBG");s(this,"_spawnAccum",0);s(this,"_spawnOffset",0);s(this,"_spawnCount",0);s(this,"_time",0);s(this,"_frameSeed",0);s(this,"_cuBuf",new Float32Array(Fe/4));s(this,"_cuiView",new Uint32Array(this._cuBuf.buffer));s(this,"_camBuf",new Float32Array(ke/4));s(this,"_hmUniBuf",new Float32Array(He/4));s(this,"_hmRes",new Uint32Array([he]));s(this,"_resetArr",new Uint32Array(1));this._gbuffer=e,this._hdrView=r,this._isForward=t,this._config=a,this._maxParticles=i,this._particleBuffer=c,this._aliveList=l,this._counterBuffer=o,this._indirectBuffer=u,this._computeUniforms=p,this._renderUniforms=d,this._cameraBuffer=f,this._spawnPipeline=_,this._updatePipeline=h,this._compactPipeline=v,this._indirectPipeline=g,this._renderPipeline=b,this._computeDataBG=x,this._computeUniBG=y,this._compactDataBG=w,this._compactUniBG=S,this._renderDataBG=B,this._cameraRenderBG=P,this._renderParamsBG=E,this._heightmapDataBuf=G,this._heightmapUniBuf=U,this._heightmapBG=M}static create(e,r,t,a){const{device:i}=e,c=r.renderer.type==="sprites"&&r.renderer.renderTarget==="hdr",l=r.emitter.maxParticles,o=i.createBuffer({label:"ParticleBuffer",size:l*De,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),u=new Float32Array(l*(De/4));for(let q=0;q<l;q++)u[q*16+3]=-1;i.queue.writeBuffer(o,0,u.buffer);const p=i.createBuffer({label:"ParticleAliveList",size:l*4,usage:GPUBufferUsage.STORAGE}),d=i.createBuffer({label:"ParticleCounter",size:4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),f=i.createBuffer({label:"ParticleIndirect",size:16,usage:GPUBufferUsage.INDIRECT|GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});i.queue.writeBuffer(f,0,new Uint32Array([6,0,0,0]));const _=i.createBuffer({label:"ParticleComputeUniforms",size:Fe,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),h=i.createBuffer({label:"ParticleCompactUniforms",size:_t,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});i.queue.writeBuffer(h,0,new Uint32Array([l,0,0,0]));const v=i.createBuffer({label:"ParticleRenderUniforms",size:gt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});i.queue.writeBuffer(v,0,new Float32Array([r.emitter.roughness,r.emitter.metallic,0,0]));const g=i.createBuffer({label:"ParticleCameraBuffer",size:ke,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),b=i.createBindGroupLayout({label:"ParticleComputeDataBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),x=i.createBindGroupLayout({label:"ParticleCompactDataBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),y=i.createBindGroupLayout({label:"ParticleComputeUniBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),w=i.createBindGroupLayout({label:"ParticleRenderDataBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}}]}),S=i.createBindGroupLayout({label:"ParticleCameraRenderBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),B=i.createBindGroupLayout({label:"ParticleRenderParamsBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),P=i.createBindGroup({label:"ParticleComputeDataBG",layout:b,entries:[{binding:0,resource:{buffer:o}},{binding:1,resource:{buffer:p}},{binding:2,resource:{buffer:d}},{binding:3,resource:{buffer:f}}]}),E=i.createBindGroup({label:"ParticleCompactDataBG",layout:x,entries:[{binding:0,resource:{buffer:o}},{binding:1,resource:{buffer:p}},{binding:2,resource:{buffer:d}},{binding:3,resource:{buffer:f}}]}),G=i.createBindGroup({label:"ParticleComputeUniBG",layout:y,entries:[{binding:0,resource:{buffer:_}}]}),U=i.createBindGroup({label:"ParticleCompactUniBG",layout:y,entries:[{binding:0,resource:{buffer:h}}]}),M=i.createBindGroup({label:"ParticleRenderDataBG",layout:w,entries:[{binding:0,resource:{buffer:o}},{binding:1,resource:{buffer:p}}]}),R=i.createBindGroup({label:"ParticleCameraRenderBG",layout:S,entries:[{binding:0,resource:{buffer:g}}]}),N=i.createBindGroup({label:"ParticleRenderParamsBG",layout:B,entries:[{binding:0,resource:{buffer:v}}]});let A,O,C,I;ut(r)&&(A=i.createBuffer({label:"ParticleHeightmapData",size:he*he*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),O=i.createBuffer({label:"ParticleHeightmapUniforms",size:He,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),I=i.createBindGroupLayout({label:"ParticleHeightmapBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),C=i.createBindGroup({label:"ParticleHeightmapBG",layout:I,entries:[{binding:0,resource:{buffer:A}},{binding:1,resource:{buffer:O}}]}));const F=i.createPipelineLayout({bindGroupLayouts:[b,y]}),z=I?i.createPipelineLayout({bindGroupLayouts:[b,y,I]}):i.createPipelineLayout({bindGroupLayouts:[b,y]}),be=i.createPipelineLayout({bindGroupLayouts:[x,y]}),mr=i.createShaderModule({label:"ParticleSpawn",code:ct(r)}),_r=i.createShaderModule({label:"ParticleUpdate",code:ft(r)}),xe=i.createShaderModule({label:"ParticleCompact",code:pt}),gr=i.createComputePipeline({label:"ParticleSpawnPipeline",layout:F,compute:{module:mr,entryPoint:"cs_main"}}),vr=i.createComputePipeline({label:"ParticleUpdatePipeline",layout:z,compute:{module:_r,entryPoint:"cs_main"}}),br=i.createComputePipeline({label:"ParticleCompactPipeline",layout:be,compute:{module:xe,entryPoint:"cs_compact"}}),xr=i.createComputePipeline({label:"ParticleIndirectPipeline",layout:be,compute:{module:xe,entryPoint:"cs_write_indirect"}});let ue;if(c){const q=r.renderer.type==="sprites"?r.renderer.billboard:"camera",de=q==="camera"?"vs_camera":"vs_main",yr=q==="camera"?"fs_snow":"fs_main",ye=i.createShaderModule({label:"ParticleRenderForward",code:mt}),wr=i.createPipelineLayout({bindGroupLayouts:[w,S]});ue=i.createRenderPipeline({label:"ParticleForwardPipeline",layout:wr,vertex:{module:ye,entryPoint:de},fragment:{module:ye,entryPoint:yr,targets:[{format:V,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},depthStencil:{format:"depth32float",depthWriteEnabled:!1,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}})}else{const q=i.createShaderModule({label:"ParticleRender",code:ht}),de=i.createPipelineLayout({bindGroupLayouts:[w,S,B]});ue=i.createRenderPipeline({label:"ParticleRenderPipeline",layout:de,vertex:{module:q,entryPoint:"vs_main"},fragment:{module:q,entryPoint:"fs_main",targets:[{format:"rgba8unorm"},{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}})}return new pr(t,a,c,r,l,o,p,d,f,_,v,g,gr,vr,br,xr,ue,P,G,E,U,M,R,c?void 0:N,A,O,C)}updateHeightmap(e,r,t,a,i){if(!this._heightmapDataBuf||!this._heightmapUniBuf)return;e.queue.writeBuffer(this._heightmapDataBuf,0,r.buffer);const c=this._hmUniBuf;c[0]=t,c[1]=a,c[2]=i,e.queue.writeBuffer(this._heightmapUniBuf,0,c.buffer,0,12),e.queue.writeBuffer(this._heightmapUniBuf,12,this._hmRes)}update(e,r,t,a,i,c,l,o,u,p){this._time+=r,this._frameSeed=this._frameSeed+1&4294967295,this._spawnAccum+=this._config.emitter.spawnRate*r,this._spawnCount=Math.min(Math.floor(this._spawnAccum),this._maxParticles),this._spawnAccum-=this._spawnCount;const d=p.data,f=d[12],_=d[13],h=d[14],v=Math.hypot(d[0],d[1],d[2]),g=Math.hypot(d[4],d[5],d[6]),b=Math.hypot(d[8],d[9],d[10]),x=d[0]/v,y=d[1]/v,w=d[2]/v,S=d[4]/g,B=d[5]/g,P=d[6]/g,E=d[8]/b,G=d[9]/b,U=d[10]/b,M=x+B+U;let R,N,A,O;if(M>0){const z=.5/Math.sqrt(M+1);O=.25/z,R=(P-G)*z,N=(E-w)*z,A=(y-S)*z}else if(x>B&&x>U){const z=2*Math.sqrt(1+x-B-U);O=(P-G)/z,R=.25*z,N=(S+y)/z,A=(E+w)/z}else if(B>U){const z=2*Math.sqrt(1+B-x-U);O=(E-w)/z,R=(S+y)/z,N=.25*z,A=(G+P)/z}else{const z=2*Math.sqrt(1+U-x-B);O=(y-S)/z,R=(E+w)/z,N=(G+P)/z,A=.25*z}const C=this._cuBuf,I=this._cuiView;C[0]=f,C[1]=_,C[2]=h,I[3]=this._spawnCount,C[4]=R,C[5]=N,C[6]=A,C[7]=O,I[8]=this._spawnOffset,I[9]=this._maxParticles,I[10]=this._frameSeed,I[11]=0,C[12]=r,C[13]=this._time,e.queue.writeBuffer(this._computeUniforms,0,C.buffer),e.queue.writeBuffer(this._counterBuffer,0,this._resetArr),this._spawnOffset=(this._spawnOffset+this._spawnCount)%this._maxParticles;const F=this._camBuf;F.set(t.data,0),F.set(a.data,16),F.set(i.data,32),F.set(c.data,48),F[64]=l.x,F[65]=l.y,F[66]=l.z,F[67]=o,F[68]=u,e.queue.writeBuffer(this._cameraBuffer,0,F.buffer)}execute(e,r){const t=e.beginComputePass({label:"ParticleCompute"});if(this._spawnCount>0&&(t.setPipeline(this._spawnPipeline),t.setBindGroup(0,this._computeDataBG),t.setBindGroup(1,this._computeUniBG),t.dispatchWorkgroups(Math.ceil(this._spawnCount/64))),t.setPipeline(this._updatePipeline),t.setBindGroup(0,this._computeDataBG),t.setBindGroup(1,this._computeUniBG),this._heightmapBG&&t.setBindGroup(2,this._heightmapBG),t.dispatchWorkgroups(Math.ceil(this._maxParticles/64)),t.setPipeline(this._compactPipeline),t.setBindGroup(0,this._compactDataBG),t.setBindGroup(1,this._compactUniBG),t.dispatchWorkgroups(Math.ceil(this._maxParticles/64)),t.setPipeline(this._indirectPipeline),t.dispatchWorkgroups(1),t.end(),this._isForward){const a=e.beginRenderPass({label:"ParticleForwardPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthReadOnly:!0}});a.setPipeline(this._renderPipeline),a.setBindGroup(0,this._renderDataBG),a.setBindGroup(1,this._cameraRenderBG),a.drawIndirect(this._indirectBuffer,0),a.end()}else{const a=e.beginRenderPass({label:"ParticleGBufferPass",colorAttachments:[{view:this._gbuffer.albedoRoughnessView,loadOp:"load",storeOp:"store"},{view:this._gbuffer.normalMetallicView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthLoadOp:"load",depthStoreOp:"store"}});a.setPipeline(this._renderPipeline),a.setBindGroup(0,this._renderDataBG),a.setBindGroup(1,this._cameraRenderBG),a.setBindGroup(2,this._renderParamsBG),a.drawIndirect(this._indirectBuffer,0),a.end()}}destroy(){var e,r;this._particleBuffer.destroy(),this._aliveList.destroy(),this._counterBuffer.destroy(),this._indirectBuffer.destroy(),this._computeUniforms.destroy(),this._renderUniforms.destroy(),this._cameraBuffer.destroy(),(e=this._heightmapDataBuf)==null||e.destroy(),(r=this._heightmapUniBuf)==null||r.destroy()}}const vt=`// Auto-exposure — two-pass histogram approach.\r
//\r
// cs_histogram : samples the HDR scene texture (every 4th pixel), bins each\r
//                pixel's log2-luminance into 64 workgroup-local bins, then\r
//                flushes to the global histogram atomically.\r
// cs_adapt     : reads the 64-bin histogram, computes a weighted average\r
//                log-luminance (skipping the darkest 5% and brightest 2% of\r
//                samples), derives the target linear exposure that maps the\r
//                average to 18% grey, then lerps the current exposure toward\r
//                that target with a time-constant controlled by adapt_speed.\r
\r
const NUM_BINS      : u32 = 64u;\r
const LOG_LUM_MIN   : f32 = -10.0;   // log2 luminance range bottom (2^-10 ≈ 0.001)\r
const LOG_LUM_MAX   : f32 =   6.0;   // log2 luminance range top   (2^6  = 64)\r
const LOG_LUM_RANGE : f32 = 16.0;    // LOG_LUM_MAX - LOG_LUM_MIN\r
const GREY_LOG2     : f32 = -2.474;  // log2(0.18) — target middle-grey point\r
\r
struct AutoExposureParams {\r
  dt          : f32,\r
  adapt_speed : f32,   // EV/second rate constant (higher = faster adaptation)\r
  min_exposure: f32,   // minimum linear exposure multiplier\r
  max_exposure: f32,   // maximum linear exposure multiplier\r
  low_pct     : f32,   // fraction of darkest samples to ignore (default 0.05)\r
  high_pct    : f32,   // fraction of brightest samples to ignore (default 0.02)\r
  _pad        : vec2<f32>,\r
}\r
\r
struct ExposureBuffer {\r
  value : f32,\r
  _pad0 : f32,\r
  _pad1 : f32,\r
  _pad2 : f32,\r
}\r
\r
@group(0) @binding(0) var                        hdr_tex  : texture_2d<f32>;\r
@group(0) @binding(1) var<storage, read_write>   histogram: array<atomic<u32>>;  // 64 bins\r
@group(0) @binding(2) var<storage, read_write>   exposure : ExposureBuffer;\r
@group(0) @binding(3) var<uniform>               params   : AutoExposureParams;\r
\r
// ---- Pass 1: Histogram ------------------------------------------------------\r
\r
var<workgroup> wg_hist: array<atomic<u32>, 64>;\r
\r
@compute @workgroup_size(8, 8)\r
fn cs_histogram(\r
  @builtin(global_invocation_id)    gid: vec3<u32>,\r
  @builtin(local_invocation_index)  lid: u32,\r
) {\r
  // wg_hist is zero-initialised per WGSL spec — no explicit clear needed.\r
\r
  let size  = textureDimensions(hdr_tex);\r
  let coord = gid.xy * 4u;   // sample every 4th pixel in each dimension\r
\r
  if (coord.x < size.x && coord.y < size.y) {\r
    let rgb = textureLoad(hdr_tex, vec2<i32>(coord), 0).rgb;\r
    let lum = dot(rgb, vec3<f32>(0.2126, 0.7152, 0.0722));\r
    if (lum > 1e-5) {\r
      let t   = clamp((log2(lum) - LOG_LUM_MIN) / LOG_LUM_RANGE, 0.0, 1.0);\r
      let bin = min(u32(t * f32(NUM_BINS)), NUM_BINS - 1u);\r
      atomicAdd(&wg_hist[bin], 1u);\r
    }\r
  }\r
  workgroupBarrier();\r
\r
  // Each thread (lid 0-63) flushes one histogram bin to the global buffer.\r
  atomicAdd(&histogram[lid], atomicLoad(&wg_hist[lid]));\r
}\r
\r
// ---- Pass 2: Adapt ----------------------------------------------------------\r
\r
var<workgroup> wg_bins: array<u32, 64>;\r
\r
@compute @workgroup_size(64)\r
fn cs_adapt(@builtin(local_invocation_index) lid: u32) {\r
  // Read and clear the global histogram for this frame.\r
  wg_bins[lid] = atomicExchange(&histogram[lid], 0u);\r
  workgroupBarrier();\r
\r
  // Only thread 0 performs the sequential reduction.\r
  if (lid != 0u) { return; }\r
\r
  var total = 0u;\r
  for (var i = 0u; i < NUM_BINS; i++) { total += wg_bins[i]; }\r
  if (total == 0u) { return; }\r
\r
  // Skip the darkest low_pct and brightest high_pct samples.\r
  let low_cut  = u32(f32(total) * params.low_pct);\r
  let high_cut = total - u32(f32(total) * params.high_pct);\r
\r
  var acc     = 0u;\r
  var sum_log = 0.0;\r
  var cnt     = 0u;\r
  for (var i = 0u; i < NUM_BINS; i++) {\r
    let b       = wg_bins[i];\r
    let b_start = acc;\r
    let b_end   = acc + b;\r
    acc = b_end;\r
    if (b_end > low_cut && b_start < high_cut) {\r
      let in_cnt  = min(b_end, high_cut) - max(b_start, low_cut);\r
      let log_lum = LOG_LUM_MIN + (f32(i) + 0.5) / f32(NUM_BINS) * LOG_LUM_RANGE;\r
      sum_log += log_lum * f32(in_cnt);\r
      cnt     += in_cnt;\r
    }\r
  }\r
  if (cnt == 0u) { return; }\r
\r
  // target exposure = 0.18 / avg_lum  →  in log-space: GREY_LOG2 - avg_log\r
  let avg_log    = sum_log / f32(cnt);\r
  let target_ev  = clamp(GREY_LOG2 - avg_log,\r
                         log2(params.min_exposure),\r
                         log2(params.max_exposure));\r
  let target_exp = exp2(target_ev);\r
\r
  // Exponential smoothing toward target.\r
  let blend = 1.0 - exp(-params.adapt_speed * params.dt);\r
  exposure.value = exposure.value + (target_exp - exposure.value) * blend;\r
}\r
`,bt=64,xt=32,yt=16,wt=bt*4,qe={adaptSpeed:1.5,minExposure:.1,maxExposure:10,lowPct:.05,highPct:.02};class oe extends D{constructor(e,r,t,a,i,c,l,o){super();s(this,"name","AutoExposurePass");s(this,"exposureBuffer");s(this,"_histogramPipeline");s(this,"_adaptPipeline");s(this,"_bindGroup");s(this,"_paramsBuffer");s(this,"_histogramBuffer");s(this,"_hdrWidth");s(this,"_hdrHeight");s(this,"enabled",!0);this._histogramPipeline=e,this._adaptPipeline=r,this._bindGroup=t,this._paramsBuffer=a,this._histogramBuffer=i,this.exposureBuffer=c,this._hdrWidth=l,this._hdrHeight=o}static create(e,r,t=qe){const{device:a}=e,i=a.createBindGroupLayout({label:"AutoExposureBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),c=a.createBuffer({label:"AutoExposureHistogram",size:wt,usage:GPUBufferUsage.STORAGE}),l=a.createBuffer({label:"AutoExposureValue",size:yt,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});a.queue.writeBuffer(l,0,new Float32Array([1,0,0,0]));const o=a.createBuffer({label:"AutoExposureParams",size:xt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});oe._writeParams(a,o,0,t);const u=a.createBindGroup({label:"AutoExposureBG",layout:i,entries:[{binding:0,resource:r.createView()},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:o}}]}),p=a.createPipelineLayout({bindGroupLayouts:[i]}),d=a.createShaderModule({label:"AutoExposure",code:vt}),f=a.createComputePipeline({label:"AutoExposureHistogramPipeline",layout:p,compute:{module:d,entryPoint:"cs_histogram"}}),_=a.createComputePipeline({label:"AutoExposureAdaptPipeline",layout:p,compute:{module:d,entryPoint:"cs_adapt"}});return new oe(f,_,u,o,c,l,r.width,r.height)}update(e,r,t=qe){if(!this.enabled){e.device.queue.writeBuffer(this.exposureBuffer,0,new Float32Array([1,0,0,0]));return}oe._writeParams(e.device,this._paramsBuffer,r,t)}execute(e,r){if(!this.enabled)return;const t=e.beginComputePass({label:"AutoExposurePass"});t.setPipeline(this._histogramPipeline),t.setBindGroup(0,this._bindGroup),t.dispatchWorkgroups(Math.ceil(this._hdrWidth/32),Math.ceil(this._hdrHeight/32)),t.setPipeline(this._adaptPipeline),t.dispatchWorkgroups(1),t.end()}destroy(){this._paramsBuffer.destroy(),this._histogramBuffer.destroy(),this.exposureBuffer.destroy()}static _writeParams(e,r,t,a){e.queue.writeBuffer(r,0,new Float32Array([t,a.adaptSpeed,a.minExposure,a.maxExposure,a.lowPct,a.highPct,0,0]))}}function Bt(m,n,e){let r=(Math.imul(m,1664525)^Math.imul(n,1013904223)^Math.imul(e,22695477))>>>0;return r=Math.imul(r^r>>>16,73244475)>>>0,r=Math.imul(r^r>>>16,73244475)>>>0,((r^r>>>16)>>>0)/4294967295}function le(m,n,e,r){return Bt(m^r,n^r*7+3,e^r*13+5)}function me(m){return m*m*m*(m*(m*6-15)+10)}function Gt(m,n,e,r,t,a,i,c,l,o,u){const p=m+(n-m)*l,d=e+(r-e)*l,f=t+(a-t)*l,_=i+(c-i)*l,h=p+(d-p)*o,v=f+(_-f)*o;return h+(v-h)*u}const St=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];function X(m,n,e,r,t,a,i,c){const l=f=>(f%r+r)%r,o=Math.floor(le(l(m),l(n),l(e),t)*12)%12,[u,p,d]=St[o];return u*a+p*i+d*c}function Pt(m,n,e,r,t){const a=Math.floor(m),i=Math.floor(n),c=Math.floor(e),l=m-a,o=n-i,u=e-c,p=me(l),d=me(o),f=me(u);return Gt(X(a,i,c,r,t,l,o,u),X(a+1,i,c,r,t,l-1,o,u),X(a,i+1,c,r,t,l,o-1,u),X(a+1,i+1,c,r,t,l-1,o-1,u),X(a,i,c+1,r,t,l,o,u-1),X(a+1,i,c+1,r,t,l-1,o,u-1),X(a,i+1,c+1,r,t,l,o-1,u-1),X(a+1,i+1,c+1,r,t,l-1,o-1,u-1),p,d,f)}function Tt(m,n,e,r,t,a){let i=0,c=.5,l=1,o=0;for(let u=0;u<r;u++)i+=Pt(m*l,n*l,e*l,t*l,a+u*17)*c,o+=c,c*=.5,l*=2;return Math.max(0,Math.min(1,i/o*.85+.5))}function Y(m,n,e,r,t){const a=m*r,i=n*r,c=e*r,l=Math.floor(a),o=Math.floor(i),u=Math.floor(c),p=f=>(f%r+r)%r;let d=1/0;for(let f=-1;f<=1;f++)for(let _=-1;_<=1;_++)for(let h=-1;h<=1;h++){const v=l+h,g=o+_,b=u+f,x=v+le(p(v),p(g),p(b),t),y=g+le(p(v),p(g),p(b),t+1),w=b+le(p(v),p(g),p(b),t+2),S=a-x,B=i-y,P=c-w,E=S*S+B*B+P*P;E<d&&(d=E)}return 1-Math.min(Math.sqrt(d),1)}function je(m,n,e,r){const t=m.createTexture({label:n,dimension:"3d",size:{width:e,height:e,depthOrArrayLayers:e},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return m.queue.writeTexture({texture:t},r.buffer,{bytesPerRow:e*4,rowsPerImage:e},{width:e,height:e,depthOrArrayLayers:e}),t}function Zt(m){const e=new Uint8Array(1048576);for(let c=0;c<64;c++)for(let l=0;l<64;l++)for(let o=0;o<64;o++){const u=(c*64*64+l*64+o)*4,p=o/64,d=l/64,f=c/64,_=Tt(p,d,f,4,4,0),h=Y(p,d,f,2,100),v=Y(p,d,f,4,200),g=Y(p,d,f,8,300);e[u]=Math.round(_*255),e[u+1]=Math.round(h*255),e[u+2]=Math.round(v*255),e[u+3]=Math.round(g*255)}const r=32,t=new Uint8Array(r*r*r*4);for(let c=0;c<r;c++)for(let l=0;l<r;l++)for(let o=0;o<r;o++){const u=(c*r*r+l*r+o)*4,p=o/r,d=l/r,f=c/r,_=Y(p,d,f,4,400),h=Y(p,d,f,8,500),v=Y(p,d,f,16,600);t[u]=Math.round(_*255),t[u+1]=Math.round(h*255),t[u+2]=Math.round(v*255),t[u+3]=255}const a=je(m,"CloudBaseNoise",64,e),i=je(m,"CloudDetailNoise",r,t);return{baseNoise:a,baseView:a.createView({dimension:"3d"}),detailNoise:i,detailView:i.createView({dimension:"3d"}),destroy(){a.destroy(),i.destroy()}}}const Ut=`// IBL baking — two compute entry points share the same bind group layout.\r
//\r
// cs_irradiance : cosine-weighted hemisphere integral for diffuse irradiance.\r
// cs_prefilter  : GGX importance-sampled integral for specular pre-filtered env.\r
//\r
// Both sample the sky equirectangular texture and write to one face of a cube\r
// texture (6 dispatches per roughness level, one face per dispatch).\r
\r
const PI      : f32 = 3.14159265358979323846;\r
const SAMPLES : u32 = 256u;\r
\r
struct IblParams {\r
  exposure  : f32,\r
  roughness : f32,   // ignored by cs_irradiance\r
  face      : f32,   // cube face index 0-5 (written as float, cast to u32)\r
  _pad      : f32,\r
}\r
\r
@group(0) @binding(0) var<uniform> params   : IblParams;\r
@group(0) @binding(1) var          sky_tex  : texture_2d<f32>;\r
@group(0) @binding(2) var          sky_samp : sampler;\r
@group(1) @binding(0) var          out_tex  : texture_storage_2d<rgba16float, write>;\r
\r
// ---- Helpers ----------------------------------------------------------------\r
\r
fn equirect_uv(dir: vec3<f32>) -> vec2<f32> {\r
  let u = atan2(-dir.z, dir.x) / (2.0 * PI) + 0.5;\r
  let v = acos(clamp(dir.y, -1.0, 1.0)) / PI;\r
  return vec2<f32>(u, v);\r
}\r
\r
// Van der Corput radical inverse (base 2) — low-discrepancy quasi-random sequence\r
fn radical_inverse(n: u32) -> f32 {\r
  var bits = (n << 16u) | (n >> 16u);\r
  bits = ((bits & 0x55555555u) << 1u) | ((bits >> 1u) & 0x55555555u);\r
  bits = ((bits & 0x33333333u) << 2u) | ((bits >> 2u) & 0x33333333u);\r
  bits = ((bits & 0x0f0f0f0fu) << 4u) | ((bits >> 4u) & 0x0f0f0f0fu);\r
  bits = ((bits & 0x00ff00ffu) << 8u) | ((bits >> 8u) & 0x00ff00ffu);\r
  return f32(bits) * 2.3283064365386963e-10;\r
}\r
\r
// Tangent frame around N — columns are (T, B, N), so TBN * local = world.\r
fn tangent_frame(N: vec3<f32>) -> mat3x3<f32> {\r
  let up = select(vec3<f32>(1.0, 0.0, 0.0), vec3<f32>(0.0, 1.0, 0.0), abs(N.y) < 0.999);\r
  let T  = normalize(cross(up, N));\r
  let B  = cross(N, T);\r
  return mat3x3<f32>(T, B, N);\r
}\r
\r
// Convert cube face + normalised UV in [-1,1] to a world-space direction.\r
// Uses the standard WebGPU/OpenGL cubemap face convention.\r
fn cube_dir(face: u32, uc: f32, vc: f32) -> vec3<f32> {\r
  switch face {\r
    case 0u: { return normalize(vec3<f32>( 1.0, -vc, -uc)); }  // +X\r
    case 1u: { return normalize(vec3<f32>(-1.0, -vc,  uc)); }  // -X\r
    case 2u: { return normalize(vec3<f32>( uc,   1.0,  vc)); }  // +Y\r
    case 3u: { return normalize(vec3<f32>( uc,  -1.0, -vc)); }  // -Y\r
    case 4u: { return normalize(vec3<f32>( uc,  -vc,  1.0)); }  // +Z\r
    default: { return normalize(vec3<f32>(-uc,  -vc, -1.0)); }  // -Z\r
  }\r
}\r
\r
// ---- Irradiance (diffuse IBL) -----------------------------------------------\r
//\r
// E(N) = (1/N) Σ L(ωi)   with cosine-weighted PDF = cosθ/π  (estimator = L)\r
\r
@compute @workgroup_size(8, 8)\r
fn cs_irradiance(@builtin(global_invocation_id) gid: vec3<u32>) {\r
  let size = textureDimensions(out_tex);\r
  if (gid.x >= size.x || gid.y >= size.y) { return; }\r
\r
  let uc = 2.0 * (f32(gid.x) + 0.5) / f32(size.x) - 1.0;\r
  let vc = 2.0 * (f32(gid.y) + 0.5) / f32(size.y) - 1.0;\r
  let N  = cube_dir(u32(params.face), uc, vc);\r
  let TBN = tangent_frame(N);\r
\r
  var rgb = vec3<f32>(0.0);\r
  for (var i = 0u; i < SAMPLES; i++) {\r
    let xi1  = (f32(i) + 0.5) / f32(SAMPLES);\r
    let xi2  = radical_inverse(i);\r
    let sinT = sqrt(xi1);\r
    let cosT = sqrt(1.0 - xi1);\r
    let phi2 = xi2 * 2.0 * PI;\r
    let L    = TBN * vec3<f32>(sinT*cos(phi2), sinT*sin(phi2), cosT);\r
    rgb     += textureSampleLevel(sky_tex, sky_samp, equirect_uv(L), 0.0).rgb;\r
  }\r
\r
  textureStore(out_tex, vec2<i32>(gid.xy),\r
    vec4<f32>(rgb * params.exposure / f32(SAMPLES), 1.0));\r
}\r
\r
// ---- Pre-filtered environment (specular IBL) ---------------------------------\r
//\r
// Integrates L(ω) weighted by GGX NDF at params.roughness using importance sampling.\r
\r
@compute @workgroup_size(8, 8)\r
fn cs_prefilter(@builtin(global_invocation_id) gid: vec3<u32>) {\r
  let size = textureDimensions(out_tex);\r
  if (gid.x >= size.x || gid.y >= size.y) { return; }\r
\r
  let uc = 2.0 * (f32(gid.x) + 0.5) / f32(size.x) - 1.0;\r
  let vc = 2.0 * (f32(gid.y) + 0.5) / f32(size.y) - 1.0;\r
  let N  = cube_dir(u32(params.face), uc, vc);\r
  let TBN = tangent_frame(N);\r
\r
  let a  = params.roughness * params.roughness;\r
  let a2 = a * a;\r
\r
  var sumRGB = vec3<f32>(0.0);\r
  var sumW   = 0.0;\r
  for (var i = 0u; i < SAMPLES; i++) {\r
    let xi1   = (f32(i) + 0.5) / f32(SAMPLES);\r
    let xi2   = radical_inverse(i);\r
    let cosT2 = (1.0 - xi2) / (1.0 + (a2 - 1.0) * xi2);\r
    let cosT  = sqrt(cosT2);\r
    let sinT  = sqrt(max(0.0, 1.0 - cosT2));\r
    let phiH  = xi1 * 2.0 * PI;\r
    let H     = TBN * vec3<f32>(sinT*cos(phiH), sinT*sin(phiH), cosT);\r
    let VdotH = cosT; // V = N in the split-sum approximation\r
    let L     = 2.0 * VdotH * H - N;\r
    let NdotL = max(0.0, dot(N, L));\r
    if (NdotL <= 0.0) { continue; }\r
    sumRGB += textureSampleLevel(sky_tex, sky_samp, equirect_uv(L), 0.0).rgb * NdotL;\r
    sumW   += NdotL;\r
  }\r
\r
  let w = select(sumW, 1.0, sumW <= 0.0);\r
  textureStore(out_tex, vec2<i32>(gid.xy),\r
    vec4<f32>(sumRGB / w * params.exposure, 1.0));\r
}\r
`,ae=5,_e=128,se=32,Mt=[0,.25,.5,.75,1],At=Math.PI;function Et(m){let n=m>>>0;return n=(n<<16|n>>>16)>>>0,n=((n&1431655765)<<1|n>>>1&1431655765)>>>0,n=((n&858993459)<<2|n>>>2&858993459)>>>0,n=((n&252645135)<<4|n>>>4&252645135)>>>0,n=((n&16711935)<<8|n>>>8&16711935)>>>0,n*23283064365386963e-26}function Rt(m,n,e){const r=new Float32Array(m*n*4);for(let t=0;t<n;t++)for(let a=0;a<m;a++){const i=(a+.5)/m,c=(t+.5)/n,l=c*c,o=l*l,u=Math.sqrt(1-i*i),p=i;let d=0,f=0;for(let h=0;h<e;h++){const v=(h+.5)/e,g=Et(h),b=(1-g)/(1+(o-1)*g),x=Math.sqrt(b),y=Math.sqrt(Math.max(0,1-b)),w=2*At*v,S=y*Math.cos(w),B=x,P=u*S+p*B;if(P<=0)continue;const E=2*P*B-p,G=Math.max(0,E),U=Math.max(0,x);if(G<=0)continue;const M=o/2,R=i/(i*(1-M)+M),N=G/(G*(1-M)+M),A=R*N*P/(U*i),O=Math.pow(1-P,5);d+=A*(1-O),f+=A*O}const _=(t*m+a)*4;r[_+0]=d/e,r[_+1]=f/e,r[_+2]=0,r[_+3]=1}return r}function Lt(m){const n=new Float32Array([m]),e=new Uint32Array(n.buffer)[0],r=e>>31&1,t=e>>23&255,a=e&8388607;if(t===255)return r<<15|31744|(a?1:0);if(t===0)return r<<15;const i=t-127+15;return i>=31?r<<15|31744:i<=0?r<<15:r<<15|i<<10|a>>13}function Nt(m){const n=new Uint16Array(m.length);for(let e=0;e<m.length;e++)n[e]=Lt(m[e]);return n}const We=new WeakMap;function Vt(m){const n=We.get(m);if(n)return n;const e=Nt(Rt(64,64,512)),r=m.createTexture({label:"IBL BRDF LUT",size:{width:64,height:64},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return m.queue.writeTexture({texture:r},e,{bytesPerRow:64*8},{width:64,height:64}),We.set(m,r),r}const Xe=new WeakMap;function zt(m){const n=Xe.get(m);if(n)return n;const e=m.createBindGroupLayout({label:"IblBGL0",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.COMPUTE,sampler:{type:"filtering"}}]}),r=m.createBindGroupLayout({label:"IblBGL1",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"2d"}}]}),t=m.createPipelineLayout({bindGroupLayouts:[e,r]}),a=m.createShaderModule({label:"IblCompute",code:Ut}),i=m.createComputePipeline({label:"IblIrradiancePipeline",layout:t,compute:{module:a,entryPoint:"cs_irradiance"}}),c=m.createComputePipeline({label:"IblPrefilterPipeline",layout:t,compute:{module:a,entryPoint:"cs_prefilter"}}),l=m.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"clamp-to-edge"}),o={irrPipeline:i,pfPipeline:c,bgl0:e,bgl1:r,sampler:l};return Xe.set(m,o),o}async function Kt(m,n,e=.2){const{irrPipeline:r,pfPipeline:t,bgl0:a,bgl1:i,sampler:c}=zt(m),l=m.createTexture({label:"IBL Irradiance",size:{width:se,height:se,depthOrArrayLayers:6},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),o=m.createTexture({label:"IBL Prefiltered",size:{width:_e,height:_e,depthOrArrayLayers:6},mipLevelCount:ae,format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),u=(G,U)=>{const M=m.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return m.queue.writeBuffer(M,0,new Float32Array([e,G,U,0])),M},p=n.createView(),d=G=>m.createBindGroup({layout:a,entries:[{binding:0,resource:{buffer:G}},{binding:1,resource:p},{binding:2,resource:c}]}),f=G=>m.createBindGroup({layout:i,entries:[{binding:0,resource:G}]}),_=Array.from({length:6},(G,U)=>u(0,U)),h=Mt.flatMap((G,U)=>Array.from({length:6},(M,R)=>u(G,R))),v=_.map(d),g=h.map(d),b=Array.from({length:6},(G,U)=>f(l.createView({dimension:"2d",baseArrayLayer:U,arrayLayerCount:1}))),x=Array.from({length:ae*6},(G,U)=>{const M=Math.floor(U/6),R=U%6;return f(o.createView({dimension:"2d",baseMipLevel:M,mipLevelCount:1,baseArrayLayer:R,arrayLayerCount:1}))}),y=m.createCommandEncoder({label:"IblComputeEncoder"}),w=y.beginComputePass({label:"IblComputePass"});w.setPipeline(r);for(let G=0;G<6;G++)w.setBindGroup(0,v[G]),w.setBindGroup(1,b[G]),w.dispatchWorkgroups(Math.ceil(se/8),Math.ceil(se/8));w.setPipeline(t);for(let G=0;G<ae;G++){const U=_e>>G;for(let M=0;M<6;M++)w.setBindGroup(0,g[G*6+M]),w.setBindGroup(1,x[G*6+M]),w.dispatchWorkgroups(Math.ceil(U/8),Math.ceil(U/8))}w.end(),m.queue.submit([y.finish()]),await m.queue.onSubmittedWorkDone(),_.forEach(G=>G.destroy()),h.forEach(G=>G.destroy());const S=Vt(m),B=l.createView({dimension:"cube"}),P=o.createView({dimension:"cube"}),E=S.createView();return{irradiance:l,prefiltered:o,brdfLut:S,irradianceView:B,prefilteredView:P,brdfLutView:E,levels:ae,destroy(){l.destroy(),o.destroy()}}}class W{constructor(n,e){s(this,"gpuTexture");s(this,"view");s(this,"type");this.gpuTexture=n,this.type=e,this.view=n.createView({dimension:e==="cube"?"cube":e==="3d"?"3d":"2d"})}destroy(){this.gpuTexture.destroy()}static createSolid(n,e,r,t,a=255){const i=n.createTexture({size:{width:1,height:1},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return n.queue.writeTexture({texture:i},new Uint8Array([e,r,t,a]),{bytesPerRow:4},{width:1,height:1}),new W(i,"2d")}static fromBitmap(n,e,{srgb:r=!1,usage:t}={}){const a=r?"rgba8unorm-srgb":"rgba8unorm";t=t?t|(GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT):GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT;const i=n.createTexture({size:{width:e.width,height:e.height},format:a,usage:t});return n.queue.copyExternalImageToTexture({source:e,flipY:!1},{texture:i},{width:e.width,height:e.height}),new W(i,"2d")}static async fromUrl(n,e,r={}){const t=await(await fetch(e)).blob(),a={colorSpaceConversion:"none"};r.resizeWidth!==void 0&&r.resizeHeight!==void 0&&(a.resizeWidth=r.resizeWidth,a.resizeHeight=r.resizeHeight,a.resizeQuality="high");const i=await createImageBitmap(t,a);return W.fromBitmap(n,i,r)}}const Ct=`// Decodes an RGBE (Radiance HDR) texture into a linear rgba16float texture.\r
// src: rgba8uint — raw RGBE bytes (R, G, B, Exponent), 4 bytes per pixel.\r
// dst: rgba16float storage texture — linear HDR output.\r
\r
@group(0) @binding(0) var src : texture_2d<u32>;\r
@group(1) @binding(0) var dst : texture_storage_2d<rgba16float, write>;\r
\r
@compute @workgroup_size(8, 8)\r
fn cs_decode(@builtin(global_invocation_id) gid: vec3<u32>) {\r
  let size = textureDimensions(src);\r
  if (gid.x >= size.x || gid.y >= size.y) { return; }\r
\r
  let rgbe = textureLoad(src, vec2<i32>(gid.xy), 0);\r
  var rgb  : vec3<f32>;\r
  if (rgbe.a == 0u) {\r
    rgb = vec3<f32>(0.0);\r
  } else {\r
    // RGBE: scale = 2^(E - 128) / 256  →  2^(E - 136)\r
    let scale = pow(2.0, f32(rgbe.a) - 136.0);\r
    rgb = vec3<f32>(f32(rgbe.r), f32(rgbe.g), f32(rgbe.b)) * scale;\r
  }\r
  textureStore(dst, vec2<i32>(gid.xy), vec4<f32>(rgb, 1.0));\r
}\r
`;function Jt(m){const n=new Uint8Array(m);let e=0;function r(){let d="";for(;e<n.length&&n[e]!==10;)n[e]!==13&&(d+=String.fromCharCode(n[e])),e++;return e<n.length&&e++,d}const t=r();if(!t.startsWith("#?RADIANCE")&&!t.startsWith("#?RGBE"))throw new Error(`Not a Radiance HDR file (magic: "${t}")`);for(;r().length!==0;);const a=r(),i=a.match(/-Y\s+(\d+)\s+\+X\s+(\d+)/);if(!i)throw new Error(`Unrecognized HDR resolution: "${a}"`);const c=parseInt(i[1],10),l=parseInt(i[2],10),o=new Uint8Array(l*c*4);function u(d){const f=new Uint8Array(l),_=new Uint8Array(l),h=new Uint8Array(l),v=new Uint8Array(l),g=[f,_,h,v];for(let x=0;x<4;x++){const y=g[x];let w=0;for(;w<l;){const S=n[e++];if(S>128){const B=S-128,P=n[e++];y.fill(P,w,w+B),w+=B}else y.set(n.subarray(e,e+S),w),e+=S,w+=S}}const b=d*l*4;for(let x=0;x<l;x++)o[b+x*4+0]=f[x],o[b+x*4+1]=_[x],o[b+x*4+2]=h[x],o[b+x*4+3]=v[x]}function p(d,f,_,h,v){const g=d*l*4;o[g+0]=f,o[g+1]=_,o[g+2]=h,o[g+3]=v;let b=1;for(;b<l;){const x=n[e++],y=n[e++],w=n[e++],S=n[e++];if(x===1&&y===1&&w===1){const B=g+(b-1)*4;for(let P=0;P<S;P++)o[g+b*4+0]=o[B+0],o[g+b*4+1]=o[B+1],o[g+b*4+2]=o[B+2],o[g+b*4+3]=o[B+3],b++}else o[g+b*4+0]=x,o[g+b*4+1]=y,o[g+b*4+2]=w,o[g+b*4+3]=S,b++}}for(let d=0;d<c&&!(e+4>n.length);d++){const f=n[e++],_=n[e++],h=n[e++],v=n[e++];if(f===2&&_===2&&!(h&128)){const g=h<<8|v;if(g!==l)throw new Error(`HDR scanline width mismatch: ${g} vs ${l}`);u(d)}else p(d,f,_,h,v)}return{width:l,height:c,data:o}}const $e=new WeakMap;function Ot(m){const n=$e.get(m);if(n)return n;const e=m.createBindGroupLayout({label:"RgbeSrcBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"uint"}}]}),r=m.createBindGroupLayout({label:"RgbeDstBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"2d"}}]}),t=m.createPipelineLayout({bindGroupLayouts:[e,r]}),a=m.createShaderModule({label:"RgbeDecode",code:Ct}),c={pipeline:m.createComputePipeline({label:"RgbeDecodePipeline",layout:t,compute:{module:a,entryPoint:"cs_decode"}}),srcBGL:e,dstBGL:r};return $e.set(m,c),c}async function Qt(m,n){const{width:e,height:r,data:t}=n,{pipeline:a,srcBGL:i,dstBGL:c}=Ot(m),l=m.createTexture({label:"Sky RGBE Raw",size:{width:e,height:r},format:"rgba8uint",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});m.queue.writeTexture({texture:l},t.buffer,{bytesPerRow:e*4},{width:e,height:r});const o=m.createTexture({label:"Sky HDR Texture",size:{width:e,height:r},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),u=m.createBindGroup({layout:i,entries:[{binding:0,resource:l.createView()}]}),p=m.createBindGroup({layout:c,entries:[{binding:0,resource:o.createView()}]}),d=m.createCommandEncoder({label:"RgbeDecodeEncoder"}),f=d.beginComputePass({label:"RgbeDecodePass"});return f.setPipeline(a),f.setBindGroup(0,u),f.setBindGroup(1,p),f.dispatchWorkgroups(Math.ceil(e/8),Math.ceil(r/8)),f.end(),m.queue.submit([d.finish()]),await m.queue.onSubmittedWorkDone(),l.destroy(),new W(o,"2d")}class hr{constructor(n,e,r,t,a,i,c){s(this,"colorAtlas");s(this,"normalAtlas");s(this,"merAtlas");s(this,"heightAtlas");s(this,"blockSize");s(this,"blockCount");s(this,"_atlasWidth");s(this,"_atlasHeight");this.colorAtlas=n,this.normalAtlas=e,this.merAtlas=r,this.heightAtlas=t,this.blockSize=a,this._atlasWidth=i,this._atlasHeight=c,this.blockCount=Math.floor(i/a)}static async load(n,e,r,t,a,i=16){async function c(b){const x=await(await fetch(b)).blob();return createImageBitmap(x,{colorSpaceConversion:"none"})}const[l,o,u,p]=await Promise.all([c(e),c(r),c(t),c(a)]),d=l.width,f=l.height,_=W.fromBitmap(n,l,{srgb:!0}),h=W.fromBitmap(n,o,{srgb:!1}),v=W.fromBitmap(n,u,{srgb:!1}),g=W.fromBitmap(n,p,{srgb:!1});return new hr(_,h,v,g,i,d,f)}uvTransform(n){const e=this.blockSize/this._atlasWidth,r=this.blockSize/this._atlasHeight;return[n*e,0,e,r]}destroy(){this.colorAtlas.destroy(),this.normalAtlas.destroy(),this.merAtlas.destroy(),this.heightAtlas.destroy()}}export{oe as A,tr as B,Qe as C,ar as D,Sr as E,Yt as F,Ze as G,V as H,Dt as I,L as J,Lr as K,Je as L,Z as M,we as N,Pr as O,pr as P,k as Q,Ye as R,sr as S,rr as T,ve as V,er as a,nr as b,ir as c,cr as d,lr as e,D as f,or as g,Ke as h,ge as i,J as j,W as k,Qt as l,Kt as m,Zt as n,hr as o,Jt as p,Ft as q,kt as r,Ht as s,qt as t,jt as u,Tr as v,Wt as w,Xt as x,T as y,$t as z};
