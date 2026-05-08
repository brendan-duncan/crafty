var qn=Object.defineProperty;var jn=(d,r,e)=>r in d?qn(d,r,{enumerable:!0,configurable:!0,writable:!0,value:e}):d[r]=e;var l=(d,r,e)=>jn(d,typeof r!="symbol"?r+"":r,e);(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))t(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&t(o)}).observe(document,{childList:!0,subtree:!0});function e(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function t(n){if(n.ep)return;n.ep=!0;const i=e(n);fetch(n.href,i)}})();const Yn=""+new URL("clear_sky-CyjsjiVR.hdr",import.meta.url).href,Nt=""+new URL("simple_block_atlas-B-7juoTN.png",import.meta.url).href,Xn=""+new URL("simple_block_atlas_normal-BdCvGD-K.png",import.meta.url).href,$n=""+new URL("simple_block_atlas_mer-C_Oa_Ink.png",import.meta.url).href,Kn=""+new URL("simple_block_atlas_heightmap-BOV6qQJl.png",import.meta.url).href,Zn=""+new URL("waterDUDV-CGfbcllR.png",import.meta.url).href,Qn="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAgCAYAAADaInAlAAAA4klEQVR4Ae2UQQ4CIRAEGeAvnn2H/3+PDqBuXLnvoYqEAMvApptKx+3+eJYrW0QpNXvUNdYc57exrjkd+/u9o+58/r8+xj+yr/t+5/G+/7P3rc361lr2Onvva5zrzbyPun7Un+v259uUcdUTpFM2sgMCQH791C4AAgB3AC7fBBAAuANw+SaAAMAdgMs3AQQA7gBcvgkgAHAH4PJNAAGAOwCXbwIIANwBuHwTQADgDsDlmwACAHcALt8EEAC4A3D5JoAAwB2AyzcBBADuAFy+CSAAcAfg8k0AAYA7AJdvAsABeAEiUwM8dIJUQAAAAABJRU5ErkJggg==",Jn=""+new URL("flashlight-C64SqrUS.jpg",import.meta.url).href;class k{constructor(r=0,e=0){l(this,"x");l(this,"y");this.x=r,this.y=e}set(r,e){return this.x=r,this.y=e,this}clone(){return new k(this.x,this.y)}add(r){return new k(this.x+r.x,this.y+r.y)}sub(r){return new k(this.x-r.x,this.y-r.y)}scale(r){return new k(this.x*r,this.y*r)}dot(r){return this.x*r.x+this.y*r.y}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.lengthSq())}normalize(){const r=this.length();return r>0?this.scale(1/r):new k}toArray(){return[this.x,this.y]}static zero(){return new k(0,0)}static one(){return new k(1,1)}}class O{constructor(r=0,e=0,t=0){l(this,"x");l(this,"y");l(this,"z");this.x=r,this.y=e,this.z=t}set(r,e,t){return this.x=r,this.y=e,this.z=t,this}clone(){return new O(this.x,this.y,this.z)}negate(){return new O(-this.x,-this.y,-this.z)}add(r){return new O(this.x+r.x,this.y+r.y,this.z+r.z)}sub(r){return new O(this.x-r.x,this.y-r.y,this.z-r.z)}scale(r){return new O(this.x*r,this.y*r,this.z*r)}mul(r){return new O(this.x*r.x,this.y*r.y,this.z*r.z)}dot(r){return this.x*r.x+this.y*r.y+this.z*r.z}cross(r){return new O(this.y*r.z-this.z*r.y,this.z*r.x-this.x*r.z,this.x*r.y-this.y*r.x)}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.lengthSq())}normalize(){const r=this.length();return r>0?this.scale(1/r):new O}lerp(r,e){return new O(this.x+(r.x-this.x)*e,this.y+(r.y-this.y)*e,this.z+(r.z-this.z)*e)}toArray(){return[this.x,this.y,this.z]}static zero(){return new O(0,0,0)}static one(){return new O(1,1,1)}static up(){return new O(0,1,0)}static forward(){return new O(0,0,-1)}static right(){return new O(1,0,0)}static fromArray(r,e=0){return new O(r[e],r[e+1],r[e+2])}}class Ue{constructor(r=0,e=0,t=0,n=0){l(this,"x");l(this,"y");l(this,"z");l(this,"w");this.x=r,this.y=e,this.z=t,this.w=n}set(r,e,t,n){return this.x=r,this.y=e,this.z=t,this.w=n,this}clone(){return new Ue(this.x,this.y,this.z,this.w)}add(r){return new Ue(this.x+r.x,this.y+r.y,this.z+r.z,this.w+r.w)}sub(r){return new Ue(this.x-r.x,this.y-r.y,this.z-r.z,this.w-r.w)}scale(r){return new Ue(this.x*r,this.y*r,this.z*r,this.w*r)}dot(r){return this.x*r.x+this.y*r.y+this.z*r.z+this.w*r.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.lengthSq())}toArray(){return[this.x,this.y,this.z,this.w]}static zero(){return new Ue(0,0,0,0)}static one(){return new Ue(1,1,1,1)}static fromArray(r,e=0){return new Ue(r[e],r[e+1],r[e+2],r[e+3])}}class Z{constructor(r){l(this,"data");this.data=new Float32Array(16),r&&this.data.set(r)}clone(){return new Z(this.data)}get(r,e){return this.data[r*4+e]}set(r,e,t){this.data[r*4+e]=t}multiply(r){const e=this.data,t=r.data,n=new Float32Array(16);for(let i=0;i<4;i++)for(let o=0;o<4;o++)n[i*4+o]=e[0*4+o]*t[i*4+0]+e[1*4+o]*t[i*4+1]+e[2*4+o]*t[i*4+2]+e[3*4+o]*t[i*4+3];return new Z(n)}transformPoint(r){const e=this.data,t=e[0]*r.x+e[4]*r.y+e[8]*r.z+e[12],n=e[1]*r.x+e[5]*r.y+e[9]*r.z+e[13],i=e[2]*r.x+e[6]*r.y+e[10]*r.z+e[14],o=e[3]*r.x+e[7]*r.y+e[11]*r.z+e[15];return new O(t/o,n/o,i/o)}transformDirection(r){const e=this.data;return new O(e[0]*r.x+e[4]*r.y+e[8]*r.z,e[1]*r.x+e[5]*r.y+e[9]*r.z,e[2]*r.x+e[6]*r.y+e[10]*r.z)}transformVec4(r){const e=this.data;return new Ue(e[0]*r.x+e[4]*r.y+e[8]*r.z+e[12]*r.w,e[1]*r.x+e[5]*r.y+e[9]*r.z+e[13]*r.w,e[2]*r.x+e[6]*r.y+e[10]*r.z+e[14]*r.w,e[3]*r.x+e[7]*r.y+e[11]*r.z+e[15]*r.w)}transpose(){const r=this.data;return new Z([r[0],r[4],r[8],r[12],r[1],r[5],r[9],r[13],r[2],r[6],r[10],r[14],r[3],r[7],r[11],r[15]])}invert(){const r=this.data,e=new Float32Array(16),t=r[0],n=r[1],i=r[2],o=r[3],a=r[4],s=r[5],c=r[6],u=r[7],p=r[8],f=r[9],h=r[10],m=r[11],_=r[12],w=r[13],v=r[14],x=r[15],B=t*s-n*a,G=t*c-i*a,S=t*u-o*a,E=n*c-i*s,M=n*u-o*s,A=i*u-o*c,R=p*w-f*_,P=p*v-h*_,b=p*x-m*_,C=f*v-h*w,g=f*x-m*w,T=h*x-m*v;let y=B*T-G*g+S*C+E*b-M*P+A*R;return y===0?Z.identity():(y=1/y,e[0]=(s*T-c*g+u*C)*y,e[1]=(i*g-n*T-o*C)*y,e[2]=(w*A-v*M+x*E)*y,e[3]=(h*M-f*A-m*E)*y,e[4]=(c*b-a*T-u*P)*y,e[5]=(t*T-i*b+o*P)*y,e[6]=(v*S-_*A-x*G)*y,e[7]=(p*A-h*S+m*G)*y,e[8]=(a*g-s*b+u*R)*y,e[9]=(n*b-t*g-o*R)*y,e[10]=(_*M-w*S+x*B)*y,e[11]=(f*S-p*M-m*B)*y,e[12]=(s*P-a*C-c*R)*y,e[13]=(t*C-n*P+i*R)*y,e[14]=(w*G-_*E-v*B)*y,e[15]=(p*E-f*G+h*B)*y,new Z(e))}normalMatrix(){const r=this.data,e=r[0],t=r[1],n=r[2],i=r[4],o=r[5],a=r[6],s=r[8],c=r[9],u=r[10],p=u*o-a*c,f=-u*i+a*s,h=c*i-o*s;let m=e*p+t*f+n*h;if(m===0)return Z.identity();m=1/m;const _=new Float32Array(16);return _[0]=p*m,_[4]=(-u*t+n*c)*m,_[8]=(a*t-n*o)*m,_[1]=f*m,_[5]=(u*e-n*s)*m,_[9]=(-a*e+n*i)*m,_[2]=h*m,_[6]=(-c*e+t*s)*m,_[10]=(o*e-t*i)*m,_[15]=1,new Z(_)}static identity(){return new Z([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}static translation(r,e,t){return new Z([1,0,0,0,0,1,0,0,0,0,1,0,r,e,t,1])}static scale(r,e,t){return new Z([r,0,0,0,0,e,0,0,0,0,t,0,0,0,0,1])}static rotationX(r){const e=Math.cos(r),t=Math.sin(r);return new Z([1,0,0,0,0,e,t,0,0,-t,e,0,0,0,0,1])}static rotationY(r){const e=Math.cos(r),t=Math.sin(r);return new Z([e,0,-t,0,0,1,0,0,t,0,e,0,0,0,0,1])}static rotationZ(r){const e=Math.cos(r),t=Math.sin(r);return new Z([e,t,0,0,-t,e,0,0,0,0,1,0,0,0,0,1])}static fromQuaternion(r,e,t,n){const i=r+r,o=e+e,a=t+t,s=r*i,c=e*i,u=e*o,p=t*i,f=t*o,h=t*a,m=n*i,_=n*o,w=n*a;return new Z([1-u-h,c+w,p-_,0,c-w,1-s-h,f+m,0,p+_,f-m,1-s-u,0,0,0,0,1])}static perspective(r,e,t,n){const i=1/Math.tan(r/2),o=1/(t-n);return new Z([i/e,0,0,0,0,i,0,0,0,0,n*o,-1,0,0,n*t*o,0])}static orthographic(r,e,t,n,i,o){const a=1/(r-e),s=1/(t-n),c=1/(i-o);return new Z([-2*a,0,0,0,0,-2*s,0,0,0,0,c,0,(r+e)*a,(n+t)*s,i*c,1])}static lookAt(r,e,t){const n=e.sub(r).normalize(),i=n.cross(t).normalize(),o=i.cross(n);return new Z([i.x,o.x,-n.x,0,i.y,o.y,-n.y,0,i.z,o.z,-n.z,0,-i.dot(r),-o.dot(r),n.dot(r),1])}static trs(r,e,t,n,i,o){const s=Z.fromQuaternion(e,t,n,i).data;return new Z([o.x*s[0],o.x*s[1],o.x*s[2],0,o.y*s[4],o.y*s[5],o.y*s[6],0,o.z*s[8],o.z*s[9],o.z*s[10],0,r.x,r.y,r.z,1])}}class _e{constructor(r=0,e=0,t=0,n=1){l(this,"x");l(this,"y");l(this,"z");l(this,"w");this.x=r,this.y=e,this.z=t,this.w=n}clone(){return new _e(this.x,this.y,this.z,this.w)}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.lengthSq())}normalize(){const r=this.length();return r>0?new _e(this.x/r,this.y/r,this.z/r,this.w/r):_e.identity()}conjugate(){return new _e(-this.x,-this.y,-this.z,this.w)}multiply(r){const e=this.x,t=this.y,n=this.z,i=this.w,o=r.x,a=r.y,s=r.z,c=r.w;return new _e(i*o+e*c+t*s-n*a,i*a-e*s+t*c+n*o,i*s+e*a-t*o+n*c,i*c-e*o-t*a-n*s)}rotateVec3(r){const e=this.x,t=this.y,n=this.z,i=this.w,o=i*r.x+t*r.z-n*r.y,a=i*r.y+n*r.x-e*r.z,s=i*r.z+e*r.y-t*r.x,c=-e*r.x-t*r.y-n*r.z;return new O(o*i+c*-e+a*-n-s*-t,a*i+c*-t+s*-e-o*-n,s*i+c*-n+o*-t-a*-e)}toMat4(){return Z.fromQuaternion(this.x,this.y,this.z,this.w)}slerp(r,e){let t=this.x*r.x+this.y*r.y+this.z*r.z+this.w*r.w,n=r.x,i=r.y,o=r.z,a=r.w;if(t<0&&(t=-t,n=-n,i=-i,o=-o,a=-a),t>=1)return this.clone();const s=Math.acos(t),c=Math.sqrt(1-t*t);if(Math.abs(c)<.001)return new _e(this.x*.5+n*.5,this.y*.5+i*.5,this.z*.5+o*.5,this.w*.5+a*.5);const u=Math.sin((1-e)*s)/c,p=Math.sin(e*s)/c;return new _e(this.x*u+n*p,this.y*u+i*p,this.z*u+o*p,this.w*u+a*p)}static identity(){return new _e(0,0,0,1)}static fromAxisAngle(r,e){const t=Math.sin(e/2),n=r.normalize();return new _e(n.x*t,n.y*t,n.z*t,Math.cos(e/2))}static fromEuler(r,e,t){const n=Math.cos(r/2),i=Math.sin(r/2),o=Math.cos(e/2),a=Math.sin(e/2),s=Math.cos(t/2),c=Math.sin(t/2);return new _e(i*o*s+n*a*c,n*a*s-i*o*c,n*o*c+i*a*s,n*o*s-i*a*c)}}const He=new Uint8Array([23,125,161,52,103,117,70,37,247,101,203,169,124,126,44,123,152,238,145,45,171,114,253,10,192,136,4,157,249,30,35,72,175,63,77,90,181,16,96,111,133,104,75,162,93,56,66,240,8,50,84,229,49,210,173,239,141,1,87,18,2,198,143,57,225,160,58,217,168,206,245,204,199,6,73,60,20,230,211,233,94,200,88,9,74,155,33,15,219,130,226,202,83,236,42,172,165,218,55,222,46,107,98,154,109,67,196,178,127,158,13,243,65,79,166,248,25,224,115,80,68,51,184,128,232,208,151,122,26,212,105,43,179,213,235,148,146,89,14,195,28,78,112,76,250,47,24,251,140,108,186,190,228,170,183,139,39,188,244,246,132,48,119,144,180,138,134,193,82,182,120,121,86,220,209,3,91,241,149,85,205,150,113,216,31,100,41,164,177,214,153,231,38,71,185,174,97,201,29,95,7,92,54,254,191,118,34,221,131,11,163,99,234,81,227,147,156,176,17,142,69,12,110,62,27,255,0,194,59,116,242,252,19,21,187,53,207,129,64,135,61,40,167,237,102,223,106,159,197,189,215,137,36,32,22,5,23,125,161,52,103,117,70,37,247,101,203,169,124,126,44,123,152,238,145,45,171,114,253,10,192,136,4,157,249,30,35,72,175,63,77,90,181,16,96,111,133,104,75,162,93,56,66,240,8,50,84,229,49,210,173,239,141,1,87,18,2,198,143,57,225,160,58,217,168,206,245,204,199,6,73,60,20,230,211,233,94,200,88,9,74,155,33,15,219,130,226,202,83,236,42,172,165,218,55,222,46,107,98,154,109,67,196,178,127,158,13,243,65,79,166,248,25,224,115,80,68,51,184,128,232,208,151,122,26,212,105,43,179,213,235,148,146,89,14,195,28,78,112,76,250,47,24,251,140,108,186,190,228,170,183,139,39,188,244,246,132,48,119,144,180,138,134,193,82,182,120,121,86,220,209,3,91,241,149,85,205,150,113,216,31,100,41,164,177,214,153,231,38,71,185,174,97,201,29,95,7,92,54,254,191,118,34,221,131,11,163,99,234,81,227,147,156,176,17,142,69,12,110,62,27,255,0,194,59,116,242,252,19,21,187,53,207,129,64,135,61,40,167,237,102,223,106,159,197,189,215,137,36,32,22,5]),Ne=new Uint8Array([7,9,5,0,11,1,6,9,3,9,11,1,8,10,4,7,8,6,1,5,3,10,9,10,0,8,4,1,5,2,7,8,7,11,9,10,1,0,4,7,5,0,11,6,1,4,2,8,8,10,4,9,9,2,5,7,9,1,7,2,2,6,11,5,5,4,6,9,0,1,1,0,7,6,9,8,4,10,3,1,2,8,8,9,10,11,5,11,11,2,6,10,3,4,2,4,9,10,3,2,6,3,6,10,5,3,4,10,11,2,9,11,1,11,10,4,9,4,11,0,4,11,4,0,0,0,7,6,10,4,1,3,11,5,3,4,2,9,1,3,0,1,8,0,6,7,8,7,0,4,6,10,8,2,3,11,11,8,0,2,4,8,3,0,0,10,6,1,2,2,4,5,6,0,1,3,11,9,5,5,9,6,9,8,3,8,1,8,9,6,9,11,10,7,5,6,5,9,1,3,7,0,2,10,11,2,6,1,3,11,7,7,2,1,7,3,0,8,1,1,5,0,6,10,11,11,0,2,7,0,10,8,3,5,7,1,11,1,0,7,9,0,11,5,10,3,2,3,5,9,7,9,8,4,6,5,7,9,5,0,11,1,6,9,3,9,11,1,8,10,4,7,8,6,1,5,3,10,9,10,0,8,4,1,5,2,7,8,7,11,9,10,1,0,4,7,5,0,11,6,1,4,2,8,8,10,4,9,9,2,5,7,9,1,7,2,2,6,11,5,5,4,6,9,0,1,1,0,7,6,9,8,4,10,3,1,2,8,8,9,10,11,5,11,11,2,6,10,3,4,2,4,9,10,3,2,6,3,6,10,5,3,4,10,11,2,9,11,1,11,10,4,9,4,11,0,4,11,4,0,0,0,7,6,10,4,1,3,11,5,3,4,2,9,1,3,0,1,8,0,6,7,8,7,0,4,6,10,8,2,3,11,11,8,0,2,4,8,3,0,0,10,6,1,2,2,4,5,6,0,1,3,11,9,5,5,9,6,9,8,3,8,1,8,9,6,9,11,10,7,5,6,5,9,1,3,7,0,2,10,11,2,6,1,3,11,7,7,2,1,7,3,0,8,1,1,5,0,6,10,11,11,0,2,7,0,10,8,3,5,7,1,11,1,0,7,9,0,11,5,10,3,2,3,5,9,7,9,8,4,6,5]),Rt=new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]);function It(d){const r=d|0;return d<r?r-1:r}function Re(d,r,e,t){const n=d*3;return Rt[n]*r+Rt[n+1]*e+Rt[n+2]*t}function Ot(d){return((d*6-15)*d+10)*d*d*d}function Xt(d,r,e,t,n,i,o){const a=t-1&255,s=n-1&255,c=i-1&255,u=It(d),p=It(r),f=It(e),h=u&a,m=u+1&a,_=p&s,w=p+1&s,v=f&c,x=f+1&c,B=d-u,G=Ot(B),S=r-p,E=Ot(S),M=e-f,A=Ot(M),R=He[h+o],P=He[m+o],b=He[R+_],C=He[R+w],g=He[P+_],T=He[P+w],y=Re(Ne[b+v],B,S,M),U=Re(Ne[b+x],B,S,M-1),N=Re(Ne[C+v],B,S-1,M),V=Re(Ne[C+x],B,S-1,M-1),z=Re(Ne[g+v],B-1,S,M),I=Re(Ne[g+x],B-1,S,M-1),K=Re(Ne[T+v],B-1,S-1,M),de=Re(Ne[T+x],B-1,S-1,M-1),fe=y+(U-y)*A,ee=N+(V-N)*A,re=z+(I-z)*A,q=K+(de-K)*A,$=fe+(ee-fe)*E,W=re+(q-re)*E;return $+(W-$)*G}function xe(d,r,e,t,n,i,o){return Xt(d,r,e,t,n,i,o&255)}function Tn(d,r,e,t,n,i,o){let a=1,s=1,c=.5,u=0;for(let p=0;p<o;p++){let f=Xt(d*a,r*a,e*a,0,0,0,p&255);f=i-Math.abs(f),f=f*f,u+=f*c*s,s=f,a*=t,c*=n}return u}function Vr(d,r,e,t,n,i){let o=1,a=1,s=0;for(let c=0;c<i;c++)s+=Math.abs(Xt(d*o,r*o,e*o,0,0,0,c&255)*a),o*=t,a*=n;return s}const Gt=class Gt extends Uint32Array{constructor(e){super(6);l(this,"_seed");this._seed=0,this.seed=e??Date.now()}get seed(){return this[0]}set seed(e){this._seed=e,this[0]=e,this[1]=this[0]*1812433253+1>>>0,this[2]=this[1]*1812433253+1>>>0,this[3]=this[2]*1812433253+1>>>0,this[4]=0,this[5]=0}reset(){this.seed=this._seed}randomUint32(){let e=this[3];const t=this[0];return this[3]=this[2],this[2]=this[1],this[1]=t,e^=e>>>2,e^=e<<1,e^=t^t<<4,this[0]=e,this[4]=this[4]+362437>>>0,this[5]=e+this[4]>>>0,this[5]}randomFloat(e,t){const n=(this.randomUint32()&8388607)*11920930376163766e-23;return e===void 0?n:n*((t??1)-e)+e}randomDouble(e,t){const n=this.randomUint32()>>>5,i=this.randomUint32()>>>6,o=(n*67108864+i)*(1/9007199254740992);return e===void 0?o:o*((t??1)-e)+e}};l(Gt,"global",new Gt);let be=Gt;class $e{constructor(){l(this,"gameObject")}onAttach(){}onDetach(){}update(r){}}class Le{constructor(r="GameObject"){l(this,"name");l(this,"position");l(this,"rotation");l(this,"scale");l(this,"children",[]);l(this,"parent",null);l(this,"_components",[]);this.name=r,this.position=O.zero(),this.rotation=_e.identity(),this.scale=O.one()}addComponent(r){return r.gameObject=this,this._components.push(r),r.onAttach(),r}getComponent(r){for(const e of this._components)if(e instanceof r)return e;return null}getComponents(r){return this._components.filter(e=>e instanceof r)}removeComponent(r){const e=this._components.indexOf(r);e!==-1&&(r.onDetach(),this._components.splice(e,1))}addChild(r){r.parent=this,this.children.push(r)}localToWorld(){const r=Z.trs(this.position,this.rotation.x,this.rotation.y,this.rotation.z,this.rotation.w,this.scale);return this.parent?this.parent.localToWorld().multiply(r):r}update(r){for(const e of this._components)e.update(r);for(const e of this.children)e.update(r)}}class An extends $e{constructor(e=60,t=.1,n=1e3,i=16/9){super();l(this,"fov");l(this,"near");l(this,"far");l(this,"aspect");this.fov=e*(Math.PI/180),this.near=t,this.far=n,this.aspect=i}projectionMatrix(){return Z.perspective(this.fov,this.aspect,this.near,this.far)}viewMatrix(){return this.gameObject.localToWorld().invert()}viewProjectionMatrix(){return this.projectionMatrix().multiply(this.viewMatrix())}position(){const e=this.gameObject.localToWorld();return new O(e.data[12],e.data[13],e.data[14])}frustumCornersWorld(){const e=this.viewProjectionMatrix().invert();return[[-1,-1,0],[1,-1,0],[-1,1,0],[1,1,0],[-1,-1,1],[1,-1,1],[-1,1,1],[1,1,1]].map(([n,i,o])=>e.transformPoint(new O(n,i,o)))}}class Mn extends $e{constructor(e=new O(.3,-1,.5),t=O.one(),n=1,i=3){super();l(this,"direction");l(this,"color");l(this,"intensity");l(this,"numCascades");this.direction=e.normalize(),this.color=t,this.intensity=n,this.numCascades=i}computeCascadeMatrices(e,t){const n=t??e.far,i=this._computeSplitDepths(e.near,n,this.numCascades),o=[];for(let a=0;a<this.numCascades;a++){const s=a===0?e.near:i[a-1],c=i[a],u=this._frustumCornersForSplit(e,s,c),p=u.reduce((g,T)=>g.add(T),O.zero()).scale(1/8),f=this.direction.normalize(),h=Z.lookAt(p.sub(f),p,new O(0,1,0)),m=2048;let _=0;for(const g of u)_=Math.max(_,g.sub(p).length());let w=2*_/m;_=Math.ceil(_/w)*w,_*=m/(m-2),w=2*_/m;let v=1/0,x=-1/0;for(const g of u){const T=h.transformPoint(g);v=Math.min(v,T.z),x=Math.max(x,T.z)}const B=Math.min((x-v)*.25,64);v-=B,x+=B;let G=Z.orthographic(-_,_,-_,_,-x,-v);const E=G.multiply(h).transformPoint(p),M=E.x*.5+.5,A=.5-E.y*.5,R=Math.round(M*m)/m,P=Math.round(A*m)/m,b=(R-M)*2,C=-(P-A)*2;G.set(3,0,G.get(3,0)+b),G.set(3,1,G.get(3,1)+C),o.push({lightViewProj:G.multiply(h),splitFar:c,depthRange:x-v,texelWorldSize:w})}return o}_computeSplitDepths(e,t,n){const o=[];for(let a=1;a<=n;a++){const s=e+(t-e)*(a/n),c=e*Math.pow(t/e,a/n);o.push(.75*c+(1-.75)*s)}return o}_frustumCornersForSplit(e,t,n){const i=e.near,o=e.far;e.near=t,e.far=n;const a=e.frustumCornersWorld();return e.near=i,e.far=o,a}}var Je=(d=>(d.Forward="forward",d.Geometry="geometry",d.SkinnedGeometry="skinnedGeometry",d))(Je||{});class ei{constructor(){l(this,"transparent",!1)}}class wt extends $e{constructor(e,t){super();l(this,"mesh");l(this,"material");l(this,"castShadow",!0);this.mesh=e,this.material=t}}class ti{constructor(){l(this,"gameObjects",[])}add(r){this.gameObjects.push(r)}remove(r){const e=this.gameObjects.indexOf(r);e!==-1&&this.gameObjects.splice(e,1)}update(r){for(const e of this.gameObjects)e.update(r)}findCamera(){for(const r of this.gameObjects){const e=r.getComponent(An);if(e)return e}return null}findDirectionalLight(){for(const r of this.gameObjects){const e=r.getComponent(Mn);if(e)return e}return null}collectMeshRenderers(){const r=[];for(const e of this.gameObjects)this._collectMeshRenderersRecursive(e,r);return r}_collectMeshRenderersRecursive(r,e){const t=r.getComponent(wt);t&&e.push(t);for(const n of r.children)this._collectMeshRenderersRecursive(n,e)}getComponents(r){const e=[];for(const t of this.gameObjects){const n=t.getComponent(r);n&&e.push(n)}return e}}const ri=[new O(1,0,0),new O(-1,0,0),new O(0,1,0),new O(0,-1,0),new O(0,0,1),new O(0,0,-1)],ni=[new O(0,-1,0),new O(0,-1,0),new O(0,0,1),new O(0,0,-1),new O(0,-1,0),new O(0,-1,0)];class $t extends $e{constructor(){super(...arguments);l(this,"color",O.one());l(this,"intensity",1);l(this,"radius",10);l(this,"castShadow",!1)}worldPosition(){return this.gameObject.localToWorld().transformPoint(O.zero())}cubeFaceViewProjs(e=.05){const t=this.worldPosition(),n=Z.perspective(Math.PI/2,1,e,this.radius),i=new Array(6);for(let o=0;o<6;o++)i[o]=n.multiply(Z.lookAt(t,t.add(ri[o]),ni[o]));return i}}class En extends $e{constructor(){super(...arguments);l(this,"color",O.one());l(this,"intensity",1);l(this,"range",20);l(this,"innerAngle",15);l(this,"outerAngle",30);l(this,"castShadow",!1);l(this,"projectionTexture",null)}worldPosition(){return this.gameObject.localToWorld().transformPoint(O.zero())}worldDirection(){return this.gameObject.localToWorld().transformDirection(new O(0,0,-1)).normalize()}lightViewProj(e=.1){const t=this.worldPosition(),n=this.worldDirection(),i=Math.abs(n.y)>.99?new O(1,0,0):new O(0,1,0),o=Z.lookAt(t,t.add(n),i);return Z.perspective(this.outerAngle*2*Math.PI/180,1,e,this.range).multiply(o)}}const ii=new O(0,1,0),oi=new O(1,0,0),ai=3;class si{constructor(r=0,e=0,t=5,n=.002){l(this,"yaw");l(this,"pitch");l(this,"speed");l(this,"sensitivity");l(this,"inputForward",0);l(this,"inputStrafe",0);l(this,"inputUp",!1);l(this,"inputDown",!1);l(this,"inputFast",!1);l(this,"_keys",new Set);l(this,"_canvas",null);l(this,"_onMouseMove");l(this,"_onKeyDown");l(this,"_onKeyUp");l(this,"_onClick");l(this,"usePointerLock",!0);this.yaw=r,this.pitch=e,this.speed=t,this.sensitivity=n;const i=Math.PI/2-.001;this._onMouseMove=o=>{document.pointerLockElement===this._canvas&&(this.yaw-=o.movementX*this.sensitivity,this.pitch=Math.max(-i,Math.min(i,this.pitch+o.movementY*this.sensitivity)))},this._onKeyDown=o=>this._keys.add(o.code),this._onKeyUp=o=>this._keys.delete(o.code),this._onClick=()=>{var o;this.usePointerLock&&((o=this._canvas)==null||o.requestPointerLock())}}attach(r){this._canvas=r,r.addEventListener("click",this._onClick),document.addEventListener("mousemove",this._onMouseMove),document.addEventListener("keydown",this._onKeyDown),document.addEventListener("keyup",this._onKeyUp)}pressKey(r){this._keys.add(r)}applyLookDelta(r,e){const t=Math.PI/2-.001;this.yaw-=r*this.sensitivity,this.pitch=Math.max(-t,Math.min(t,this.pitch+e*this.sensitivity))}detach(){this._canvas&&(this._canvas.removeEventListener("click",this._onClick),document.removeEventListener("mousemove",this._onMouseMove),document.removeEventListener("keydown",this._onKeyDown),document.removeEventListener("keyup",this._onKeyUp),this._canvas=null)}update(r,e){const t=Math.sin(this.yaw),n=Math.cos(this.yaw);let i=0,o=0,a=0;(this._keys.has("KeyW")||this._keys.has("ArrowUp"))&&(i-=t,a-=n),(this._keys.has("KeyS")||this._keys.has("ArrowDown"))&&(i+=t,a+=n),(this._keys.has("KeyA")||this._keys.has("ArrowLeft"))&&(i-=n,a+=t),(this._keys.has("KeyD")||this._keys.has("ArrowRight"))&&(i+=n,a-=t),this.inputForward!==0&&(i-=t*this.inputForward,a-=n*this.inputForward),this.inputStrafe!==0&&(i+=n*this.inputStrafe,a-=t*this.inputStrafe),(this._keys.has("Space")||this.inputUp)&&(o+=1),(this._keys.has("ShiftLeft")||this.inputDown)&&(o-=1);const s=Math.sqrt(i*i+o*o+a*a);if(s>0){const c=this._keys.has("ControlLeft")||this._keys.has("AltLeft")||this.inputFast,u=this.speed*(c?ai:1)*e/s;r.position.x+=i*u,r.position.y+=o*u,r.position.z+=a*u}r.rotation=_e.fromAxisAngle(ii,this.yaw).multiply(_e.fromAxisAngle(oi,-this.pitch))}}const li=400,ci=16,Un=li/ci;var L=(d=>(d[d.NONE=0]="NONE",d[d.GRASS=1]="GRASS",d[d.SAND=2]="SAND",d[d.STONE=3]="STONE",d[d.DIRT=4]="DIRT",d[d.TRUNK=5]="TRUNK",d[d.TREELEAVES=6]="TREELEAVES",d[d.WATER=7]="WATER",d[d.GLASS=8]="GLASS",d[d.FLOWER=9]="FLOWER",d[d.GLOWSTONE=10]="GLOWSTONE",d[d.MAGMA=11]="MAGMA",d[d.OBSIDIAN=12]="OBSIDIAN",d[d.DIAMOND=13]="DIAMOND",d[d.IRON=14]="IRON",d[d.SPECULAR=15]="SPECULAR",d[d.CACTUS=16]="CACTUS",d[d.SNOW=17]="SNOW",d[d.GRASS_SNOW=18]="GRASS_SNOW",d[d.SPRUCE_PLANKS=19]="SPRUCE_PLANKS",d[d.GRASS_PROP=20]="GRASS_PROP",d[d.TORCH=21]="TORCH",d[d.DEAD_BUSH=22]="DEAD_BUSH",d[d.SNOWYLEAVES=23]="SNOWYLEAVES",d[d.AMETHYST=24]="AMETHYST",d[d.MAX=25]="MAX",d))(L||{});class ie{constructor(r,e,t,n){l(this,"blockType");l(this,"sideFace");l(this,"bottomFace");l(this,"topFace");this.blockType=r,this.sideFace=e,this.bottomFace=t,this.topFace=n}}const At=[new ie(0,new k(0,0),new k(0,0),new k(0,0)),new ie(1,new k(1,0),new k(3,0),new k(2,0)),new ie(2,new k(4,0),new k(4,0),new k(4,0)),new ie(3,new k(5,0),new k(5,0),new k(5,0)),new ie(4,new k(6,0),new k(6,0),new k(6,0)),new ie(5,new k(7,0),new k(8,0),new k(8,0)),new ie(6,new k(9,0),new k(9,0),new k(9,0)),new ie(7,new k(2,29),new k(2,29),new k(2,29)),new ie(8,new k(10,0),new k(10,0),new k(10,0)),new ie(9,new k(23,0),new k(23,0),new k(23,0)),new ie(10,new k(11,0),new k(11,0),new k(11,0)),new ie(11,new k(12,0),new k(12,0),new k(12,0)),new ie(12,new k(13,0),new k(13,0),new k(13,0)),new ie(13,new k(14,0),new k(14,0),new k(14,0)),new ie(14,new k(15,0),new k(15,0),new k(15,0)),new ie(15,new k(0,24),new k(0,24),new k(0,24)),new ie(16,new k(17,0),new k(18,0),new k(16,0)),new ie(17,new k(19,0),new k(19,0),new k(19,0)),new ie(18,new k(20,0),new k(3,0),new k(21,0)),new ie(19,new k(22,0),new k(22,0),new k(22,0)),new ie(20,new k(1,1),new k(1,1),new k(1,1)),new ie(21,new k(2,1),new k(2,1),new k(2,1)),new ie(22,new k(3,1),new k(3,1),new k(3,1)),new ie(23,new k(4,1),new k(9,0),new k(21,0)),new ie(24,new k(5,1),new k(5,1),new k(5,1)),new ie(25,new k(0,0),new k(0,0),new k(0,0))];class ae{constructor(r,e,t,n){l(this,"blockType");l(this,"materialType");l(this,"emitsLight");l(this,"collidable");this.blockType=r,this.materialType=e,this.emitsLight=t,this.collidable=n}}const rt=[new ae(0,1,0,0),new ae(1,0,0,1),new ae(2,0,0,1),new ae(3,0,0,1),new ae(4,0,0,1),new ae(5,0,0,1),new ae(6,1,0,1),new ae(7,2,0,0),new ae(8,1,0,1),new ae(9,3,0,0),new ae(10,0,1,1),new ae(11,0,1,1),new ae(12,0,0,1),new ae(13,0,0,1),new ae(14,0,0,1),new ae(15,0,0,1),new ae(16,0,0,1),new ae(17,0,0,1),new ae(18,0,0,1),new ae(19,0,0,1),new ae(20,3,0,0),new ae(21,3,1,0),new ae(22,3,0,0),new ae(23,1,0,1),new ae(24,0,0,1)],ui=["None","Grass","Sand","Stone","Dirt","Trunk","Tree leaves","Water","Glass","Flower","Glowstone","Magma","Obsidian","Diamond","Iron","Specular","Cactus","Snow","Grass snow","Spruce planks","Grass prop","Torch","Dead bush","Snowy leaves","Amethyst","Max"];function se(d){return rt[d].materialType===2}function lt(d){return rt[d].materialType===1||rt[d].materialType===3}function Dr(d){return rt[d].emitsLight===1}function Se(d){return rt[d].materialType===3}const di=new O(0,1,0),fi=new O(1,0,0),pi=-28,hi=-4,mi=1.3,_i=4.3,gi=7,vi=11.5,bi=3.5,ge=.3,Ke=1.8,zr=1.62;class yi{constructor(r,e=Math.PI,t=.1){l(this,"yaw");l(this,"pitch");l(this,"sensitivity",.002);l(this,"inputForward",0);l(this,"inputStrafe",0);l(this,"inputJump",!1);l(this,"inputSneak",!1);l(this,"inputSprint",!1);l(this,"_velY",0);l(this,"_onGround",!1);l(this,"_prevInWater",!1);l(this,"_coyoteFrames",0);l(this,"_keys",new Set);l(this,"_canvas",null);l(this,"_world");l(this,"_onMouseMove");l(this,"_onKeyDown");l(this,"_onKeyUp");l(this,"_onClick");l(this,"usePointerLock",!0);this._world=r,this.yaw=e,this.pitch=t;const n=Math.PI/2-.001;this._onMouseMove=i=>{document.pointerLockElement===this._canvas&&(this.yaw-=i.movementX*this.sensitivity,this.pitch=Math.max(-n,Math.min(n,this.pitch+i.movementY*this.sensitivity)))},this._onKeyDown=i=>this._keys.add(i.code),this._onKeyUp=i=>this._keys.delete(i.code),this._onClick=()=>{var i;this.usePointerLock&&((i=this._canvas)==null||i.requestPointerLock())}}set velY(r){this._velY=r}attach(r){this._canvas=r,r.addEventListener("click",this._onClick),document.addEventListener("mousemove",this._onMouseMove),document.addEventListener("keydown",this._onKeyDown),document.addEventListener("keyup",this._onKeyUp)}applyLookDelta(r,e){const t=Math.PI/2-.001;this.yaw-=r*this.sensitivity,this.pitch=Math.max(-t,Math.min(t,this.pitch+e*this.sensitivity))}detach(){this._canvas&&(this._canvas.removeEventListener("click",this._onClick),document.removeEventListener("mousemove",this._onMouseMove),document.removeEventListener("keydown",this._onKeyDown),document.removeEventListener("keyup",this._onKeyUp),this._canvas=null)}update(r,e){e=Math.min(e,.05),r.rotation=_e.fromAxisAngle(di,this.yaw).multiply(_e.fromAxisAngle(fi,-this.pitch));const t=Math.sin(this.yaw),n=Math.cos(this.yaw),i=this._keys.has("ControlLeft")||this._keys.has("AltLeft")||this.inputSprint,o=this._keys.has("ShiftLeft")||this.inputSneak,a=i?gi:o?mi:_i;let s=0,c=0;(this._keys.has("KeyW")||this._keys.has("ArrowUp"))&&(s-=t,c-=n),(this._keys.has("KeyS")||this._keys.has("ArrowDown"))&&(s+=t,c+=n),(this._keys.has("KeyA")||this._keys.has("ArrowLeft"))&&(s-=n,c+=t),(this._keys.has("KeyD")||this._keys.has("ArrowRight"))&&(s+=n,c-=t),this.inputForward!==0&&(s-=t*this.inputForward,c-=n*this.inputForward),this.inputStrafe!==0&&(s+=n*this.inputStrafe,c-=t*this.inputStrafe);const u=Math.sqrt(s*s+c*c);if(u>0){const B=1/Math.max(u,1);s=s*B*a,c=c*B*a}let p=r.position.x,f=r.position.y-zr,h=r.position.z;const m=se(this._world.getBlockType(Math.floor(p),Math.floor(f+Ke*.5),Math.floor(h))),_=this._keys.has("Space")||this.inputJump;m?(_&&(this._velY=bi),this._velY=Math.max(this._velY+hi*e,-2)):(this._prevInWater&&this._velY>0&&(this._velY=0),_&&(this._onGround||this._coyoteFrames>0)&&(this._velY=vi,this._coyoteFrames=0),this._velY=Math.max(this._velY+pi*e,-50)),p=this._slideX(p+s*e,f,h,s),h=this._slideZ(p,f,h+c*e,c);const[w,v,x]=this._slideY(p,f+this._velY*e,h);(v||x)&&(this._velY=0),f=w,this._onGround=v,this._prevInWater=m,v?this._coyoteFrames=6:m||(this._coyoteFrames=Math.max(0,this._coyoteFrames-1)),r.position.x=p,r.position.y=f+zr,r.position.z=h}_isSolid(r,e,t){const n=this._world.getBlockType(r,e,t);return n!==L.NONE&&!se(n)&&!Se(n)}_slideX(r,e,t,n){if(Math.abs(n)<1e-6)return r;const i=n>0?r+ge:r-ge,o=Math.floor(i),a=Math.floor(e+.01),s=Math.floor(e+Ke-.01),c=Math.floor(t-ge+.01),u=Math.floor(t+ge-.01);for(let p=a;p<=s;p++)for(let f=c;f<=u;f++)if(this._isSolid(o,p,f))return n>0?o-ge-.001:o+1+ge+.001;return r}_slideZ(r,e,t,n){if(Math.abs(n)<1e-6)return t;const i=n>0?t+ge:t-ge,o=Math.floor(i),a=Math.floor(e+.01),s=Math.floor(e+Ke-.01),c=Math.floor(r-ge+.01),u=Math.floor(r+ge-.01);for(let p=a;p<=s;p++)for(let f=c;f<=u;f++)if(this._isSolid(f,p,o))return n>0?o-ge-.001:o+1+ge+.001;return t}_slideY(r,e,t){const n=Math.floor(r-ge+.01),i=Math.floor(r+ge-.01),o=Math.floor(t-ge+.01),a=Math.floor(t+ge-.01);if(this._velY<=0){const s=Math.floor(e-.001);for(let c=n;c<=i;c++)for(let u=o;u<=a;u++)if(this._isSolid(c,s,u))return[s+1,!0,!1];return[e,!1,!1]}else{const s=Math.floor(e+Ke);for(let c=n;c<=i;c++)for(let u=o;u<=a;u++)if(this._isSolid(c,s,u))return[s-Ke-.001,!1,!0];return[e,!1,!1]}}}class Kt{constructor(r,e,t,n,i,o){l(this,"device");l(this,"queue");l(this,"context");l(this,"format");l(this,"canvas");l(this,"hdr");l(this,"enableErrorHandling");this.device=r,this.queue=r.queue,this.context=e,this.format=t,this.canvas=n,this.hdr=i,this.enableErrorHandling=o}get width(){return this.canvas.width}get height(){return this.canvas.height}static async create(r,e={}){if(!navigator.gpu)throw new Error("WebGPU not supported");const t=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!t)throw new Error("No WebGPU adapter found");const n=await t.requestDevice({requiredFeatures:[]});e.enableErrorHandling&&n.addEventListener("uncapturederror",s=>{const c=s.error;c instanceof GPUValidationError?console.error("[WebGPU Validation Error]",c.message):c instanceof GPUOutOfMemoryError?console.error("[WebGPU Out of Memory]"):console.error("[WebGPU Internal Error]",c)});const i=r.getContext("webgpu");let o,a=!1;try{i.configure({device:n,format:"rgba16float",alphaMode:"opaque",colorSpace:"display-p3",toneMapping:{mode:"extended"}}),o="rgba16float",a=!0}catch{o=navigator.gpu.getPreferredCanvasFormat(),i.configure({device:n,format:o,alphaMode:"opaque"})}return r.width=r.clientWidth*devicePixelRatio,r.height=r.clientHeight*devicePixelRatio,new Kt(n,i,o,r,a,e.enableErrorHandling??!1)}getCurrentTexture(){return this.context.getCurrentTexture()}createBuffer(r,e,t){return this.device.createBuffer({size:r,usage:e,label:t})}writeBuffer(r,e,t=0){e instanceof ArrayBuffer?this.queue.writeBuffer(r,t,e):this.queue.writeBuffer(r,t,e.buffer,e.byteOffset,e.byteLength)}pushInitErrorScope(){this.enableErrorHandling&&this.device.pushErrorScope("validation")}async popInitErrorScope(r){if(this.enableErrorHandling){const e=await this.device.popErrorScope();e&&(console.error(`[Init:${r}] Validation Error:`,e.message),console.trace())}}pushFrameErrorScope(){this.enableErrorHandling&&this.device.pushErrorScope("validation")}async popFrameErrorScope(){if(this.enableErrorHandling){const r=await this.device.popErrorScope();r&&(console.error("[Frame] Validation Error:",r.message),console.trace())}}pushPassErrorScope(r){this.enableErrorHandling&&(this.device.pushErrorScope("validation"),this.device.pushErrorScope("out-of-memory"),this.device.pushErrorScope("internal"))}async popPassErrorScope(r){if(this.enableErrorHandling){const e=await this.device.popErrorScope();e&&console.error(`[${r}] Internal Error:`,e),await this.device.popErrorScope()&&console.error(`[${r}] Out of Memory`);const n=await this.device.popErrorScope();n&&console.error(`[${r}] Validation Error:`,n.message)}}}class he{constructor(){l(this,"enabled",!0)}destroy(){}}class St{constructor(r,e,t,n,i){l(this,"albedoRoughness");l(this,"normalMetallic");l(this,"depth");l(this,"albedoRoughnessView");l(this,"normalMetallicView");l(this,"depthView");l(this,"width");l(this,"height");this.albedoRoughness=r,this.normalMetallic=e,this.depth=t,this.width=n,this.height=i,this.albedoRoughnessView=r.createView(),this.normalMetallicView=e.createView(),this.depthView=t.createView()}static create(r){const{device:e,width:t,height:n}=r,i=e.createTexture({label:"GBuffer AlbedoRoughness",size:{width:t,height:n},format:"rgba8unorm",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),o=e.createTexture({label:"GBuffer NormalMetallic",size:{width:t,height:n},format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),a=e.createTexture({label:"GBuffer Depth",size:{width:t,height:n},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING});return new St(i,o,a,t,n)}destroy(){this.albedoRoughness.destroy(),this.normalMetallic.destroy(),this.depth.destroy()}}const Zt=48,Qt=[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x3"},{shaderLocation:2,offset:24,format:"float32x2"},{shaderLocation:3,offset:32,format:"float32x4"}];class Ce{constructor(r,e,t){l(this,"vertexBuffer");l(this,"indexBuffer");l(this,"indexCount");this.vertexBuffer=r,this.indexBuffer=e,this.indexCount=t}destroy(){this.vertexBuffer.destroy(),this.indexBuffer.destroy()}static fromData(r,e,t){const n=r.createBuffer({label:"Mesh VertexBuffer",size:e.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(n,0,e.buffer,e.byteOffset,e.byteLength);const i=r.createBuffer({label:"Mesh IndexBuffer",size:t.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(i,0,t.buffer,t.byteOffset,t.byteLength),new Ce(n,i,t.length)}static createCube(r,e=1){const t=e/2,n=[{normal:[0,0,1],tangent:[1,0,0,1],verts:[[-t,-t,t],[t,-t,t],[t,t,t],[-t,t,t]]},{normal:[0,0,-1],tangent:[-1,0,0,1],verts:[[t,-t,-t],[-t,-t,-t],[-t,t,-t],[t,t,-t]]},{normal:[1,0,0],tangent:[0,0,-1,1],verts:[[t,-t,t],[t,-t,-t],[t,t,-t],[t,t,t]]},{normal:[-1,0,0],tangent:[0,0,1,1],verts:[[-t,-t,-t],[-t,-t,t],[-t,t,t],[-t,t,-t]]},{normal:[0,1,0],tangent:[1,0,0,1],verts:[[-t,t,t],[t,t,t],[t,t,-t],[-t,t,-t]]},{normal:[0,-1,0],tangent:[1,0,0,1],verts:[[-t,-t,-t],[t,-t,-t],[t,-t,t],[-t,-t,t]]}],i=[[0,1],[1,1],[1,0],[0,0]],o=[],a=[];let s=0;for(const c of n){for(let u=0;u<4;u++)o.push(...c.verts[u],...c.normal,...i[u],...c.tangent);a.push(s,s+1,s+2,s,s+2,s+3),s+=4}return Ce.fromData(r,new Float32Array(o),new Uint32Array(a))}static createSphere(r,e=.5,t=32,n=32){const i=[],o=[];for(let a=0;a<=t;a++){const s=a/t*Math.PI,c=Math.sin(s),u=Math.cos(s);for(let p=0;p<=n;p++){const f=p/n*Math.PI*2,h=Math.sin(f),m=Math.cos(f),_=c*m,w=u,v=c*h;i.push(_*e,w*e,v*e,_,w,v,p/n,a/t,-h,0,m,1)}}for(let a=0;a<t;a++)for(let s=0;s<n;s++){const c=a*(n+1)+s,u=c+n+1;o.push(c,c+1,u),o.push(c+1,u+1,u)}return Ce.fromData(r,new Float32Array(i),new Uint32Array(o))}static createCone(r,e=.5,t=1,n=16){const i=[],o=[],a=Math.sqrt(t*t+e*e),s=t/a,c=e/a;i.push(0,t,0,0,1,0,.5,0,1,0,0,1);const u=1;for(let h=0;h<=n;h++){const m=h/n*Math.PI*2,_=Math.cos(m),w=Math.sin(m);i.push(_*e,0,w*e,_*s,c,w*s,h/n,1,_,0,w,1)}for(let h=0;h<n;h++)o.push(0,u+h+1,u+h);const p=u+n+1;i.push(0,0,0,0,-1,0,.5,.5,1,0,0,1);const f=p+1;for(let h=0;h<=n;h++){const m=h/n*Math.PI*2,_=Math.cos(m),w=Math.sin(m);i.push(_*e,0,w*e,0,-1,0,.5+_*.5,.5+w*.5,1,0,0,1)}for(let h=0;h<n;h++)o.push(p,f+h,f+h+1);return Ce.fromData(r,new Float32Array(i),new Uint32Array(o))}static createPlane(r,e=10,t=10,n=1,i=1){const o=[],a=[];for(let s=0;s<=i;s++)for(let c=0;c<=n;c++){const u=(c/n-.5)*e,p=(s/i-.5)*t,f=c/n,h=s/i;o.push(u,0,p,0,1,0,f,h,1,0,0,1)}for(let s=0;s<i;s++)for(let c=0;c<n;c++){const u=s*(n+1)+c;a.push(u,u+n+1,u+1,u+1,u+n+1,u+n+2)}return Ce.fromData(r,new Float32Array(o),new Uint32Array(a))}}const Cn=`// Shadow map rendering shader - outputs depth only

struct CameraUniforms {
  viewProj: mat4x4<f32>,
}

struct ModelUniforms {
  model: mat4x4<f32>,
}

@group(0) @binding(0) var<uniform> camera: CameraUniforms;
@group(1) @binding(0) var<uniform> model: ModelUniforms;

struct VertexInput {
  @location(0) position: vec3<f32>,
}

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
}

@vertex
fn vs_main(vin: VertexInput) -> VertexOutput {
  let world_pos = model.model * vec4<f32>(vin.position, 1.0);
  var out: VertexOutput;
  out.clip_pos = camera.viewProj * world_pos;
  return out;
}

@fragment
fn fs_main(in: VertexOutput) {
  // Depth is written automatically - no fragment output needed
}
`,Fr=2048,ct=4;class Jt extends he{constructor(e,t,n,i,o,a,s,c){super();l(this,"name","ShadowPass");l(this,"shadowMap");l(this,"shadowMapView");l(this,"shadowMapArrayViews");l(this,"_pipeline");l(this,"_shadowBindGroups");l(this,"_shadowUniformBuffers");l(this,"_modelUniformBuffers",[]);l(this,"_modelBindGroups",[]);l(this,"_cascadeCount");l(this,"_cascades",[]);l(this,"_modelBGL");l(this,"_sceneSnapshot",[]);this.shadowMap=e,this.shadowMapView=t,this.shadowMapArrayViews=n,this._pipeline=i,this._shadowBindGroups=o,this._shadowUniformBuffers=a,this._modelBGL=s,this._cascadeCount=c}static create(e,t=3){const{device:n}=e,i=n.createTexture({label:"ShadowMap",size:{width:Fr,height:Fr,depthOrArrayLayers:ct},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),o=i.createView({dimension:"2d-array"}),a=Array.from({length:ct},(m,_)=>i.createView({dimension:"2d",baseArrayLayer:_,arrayLayerCount:1})),s=n.createBindGroupLayout({label:"ShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),c=n.createBindGroupLayout({label:"ModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),u=[],p=[];for(let m=0;m<ct;m++){const _=n.createBuffer({label:`ShadowUniformBuffer ${m}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});u.push(_),p.push(n.createBindGroup({label:`ShadowBindGroup ${m}`,layout:s,entries:[{binding:0,resource:{buffer:_}}]}))}const f=n.createShaderModule({label:"ShadowShader",code:Cn}),h=n.createRenderPipeline({label:"ShadowPipeline",layout:n.createPipelineLayout({bindGroupLayouts:[s,c]}),vertex:{module:f,entryPoint:"vs_main",buffers:[{arrayStride:Zt,attributes:[Qt[0]]}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less",depthBias:2,depthBiasSlopeScale:2.5,depthBiasClamp:0},primitive:{topology:"triangle-list",cullMode:"back"}});return new Jt(i,o,a,h,p,u,c,t)}updateScene(e,t,n,i){this._cascades=n.computeCascadeMatrices(t,i),this._cascadeCount=Math.min(this._cascades.length,ct)}execute(e,t){const{device:n}=t,i=this._getMeshRenderers(t);this._ensureModelBuffers(n,i.length);for(let o=0;o<this._cascadeCount&&!(o>=this._cascades.length);o++){const a=this._cascades[o];t.queue.writeBuffer(this._shadowUniformBuffers[o],0,a.lightViewProj.data.buffer);const s=e.beginRenderPass({label:`ShadowPass cascade ${o}`,colorAttachments:[],depthStencilAttachment:{view:this.shadowMapArrayViews[o],depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});s.setPipeline(this._pipeline),s.setBindGroup(0,this._shadowBindGroups[o]);for(let c=0;c<i.length;c++){const{mesh:u,modelMatrix:p}=i[c],f=this._modelUniformBuffers[c];t.queue.writeBuffer(f,0,p.data.buffer),s.setBindGroup(1,this._modelBindGroups[c]),s.setVertexBuffer(0,u.vertexBuffer),s.setIndexBuffer(u.indexBuffer,"uint32"),s.drawIndexed(u.indexCount)}s.end()}}_getMeshRenderers(e){return this._sceneSnapshot??[]}setSceneSnapshot(e){this._sceneSnapshot=e}_ensureModelBuffers(e,t){for(;this._modelUniformBuffers.length<t;){const n=e.createBuffer({label:`ModelUniform ${this._modelUniformBuffers.length}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),i=e.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:n}}]});this._modelUniformBuffers.push(n),this._modelBindGroups.push(i)}}destroy(){this.shadowMap.destroy();for(const e of this._shadowUniformBuffers)e.destroy();for(const e of this._modelUniformBuffers)e.destroy()}}const xi=`// Deferred PBR lighting pass — fullscreen triangle, reads GBuffer + shadow maps + IBL.\r
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
  let cascade = select_cascade(view_depth);\r
  // Constant receiver bias scaled by surface slope. Independent of per-frame\r
  // cascade depth range so the bias doesn't oscillate as the camera moves.\r
  let bias    = max(0.002 * (1.0 - NdotL), 0.0005);\r
\r
  // Normal bias — offset receiver along its surface normal by a fraction of\r
  // the cascade's world-space texel size, scaled by grazing angle so the\r
  // offset is large where it's needed and zero on directly-lit surfaces.\r
  // Removes the light-parallel component so the offset doesn't fake depth bias.\r
  let L          = normalize(-light.direction);\r
  let t_angle    = clamp(1.0 - max(0.0, NdotL), 0.0, 1.0);\r
  var nb         = N * (light.cascadeTexelSizes[cascade] * 3.0 * t_angle);\r
  nb            -= L * dot(L, nb);\r
  let biased_pos = world_pos + nb;\r
\r
  let sc0 = cascade_coords(cascade, biased_pos);\r
  if (!in_cascade(sc0)) { return 1.0; }\r
\r
  // PCSS with the penumbra estimate computed in WORLD units, then converted\r
  // to per-cascade texels for sampling. This keeps the visual softness\r
  // consistent across cascades, so the blend at the cascade boundary doesn't\r
  // reveal a sudden change in shadow appearance. Min kernel is 1 texel\r
  // per-cascade (sharp default), not a fixed world distance — that would\r
  // force a wide blur on near cascades where one texel is already small.\r
  let SEARCH_WORLD     : f32 = 0.3;   // metres — blocker search radius\r
  let KERNEL_MAX_WORLD : f32 = 1.0;   // metres — caps very soft shadows\r
\r
  let texel_world_0 = light.cascadeTexelSizes[cascade];\r
  let depth_world_0 = light.cascadeDepthRanges[cascade];\r
  let search_tex_0  = clamp(SEARCH_WORLD / texel_world_0, 2.0, 8.0);\r
\r
  var kernel0      = 1.0;\r
  let avg_blocker0 = pcss_blocker_search(cascade, sc0, search_tex_0, screen_pos);\r
  if (avg_blocker0 >= 0.0) {\r
    let occluder_dist = max((sc0.z - avg_blocker0) * depth_world_0, 0.0);\r
    let penumbra_world = min(light.shadowSoftness * occluder_dist, KERNEL_MAX_WORLD);\r
    kernel0 = clamp(penumbra_world / texel_world_0, 1.0, 16.0);\r
  }\r
  let s0 = pcf_shadow(cascade, sc0, bias, kernel0, screen_pos);\r
\r
  let next = cascade + 1u;\r
  if (next < light.cascadeCount) {\r
    let split      = light.cascadeSplits[cascade];\r
    let blend_band = split * 0.2;\r
    let t = smoothstep(split - blend_band, split, view_depth);\r
    if (t > 0.0) {\r
      let sc1 = cascade_coords(next, biased_pos);\r
      // Only blend toward the next cascade if this position is actually inside it;\r
      // blending toward an OOB cascade would mix toward depth=1 (fully lit).\r
      if (in_cascade(sc1)) {\r
        let texel_world_1 = light.cascadeTexelSizes[next];\r
        let depth_world_1 = light.cascadeDepthRanges[next];\r
        let search_tex_1  = clamp(SEARCH_WORLD / texel_world_1, 2.0, 8.0);\r
\r
        var kernel1      = 1.0;\r
        let avg_blocker1 = pcss_blocker_search(next, sc1, search_tex_1, screen_pos);\r
        if (avg_blocker1 >= 0.0) {\r
          let occluder_dist1  = max((sc1.z - avg_blocker1) * depth_world_1, 0.0);\r
          let penumbra_world1 = min(light.shadowSoftness * occluder_dist1, KERNEL_MAX_WORLD);\r
          kernel1 = clamp(penumbra_world1 / texel_world_1, 1.0, 16.0);\r
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
`,Q="rgba16float",Hr=64*4+16+16,Wr=368;class er extends he{constructor(e,t,n,i,o,a,s,c,u,p,f,h,m,_,w,v){super();l(this,"name","LightingPass");l(this,"hdrTexture");l(this,"hdrView");l(this,"cameraBuffer");l(this,"lightBuffer");l(this,"_pipeline");l(this,"_sceneBindGroup");l(this,"_gbufferBindGroup");l(this,"_aoBindGroup");l(this,"_iblBindGroup");l(this,"_defaultCloudShadow");l(this,"_defaultSsgi");l(this,"_device");l(this,"_aoBGL");l(this,"_aoView");l(this,"_aoSampler");l(this,"_ssgiSampler");l(this,"_cameraScratch",new Float32Array(Hr/4));l(this,"_lightScratch",new Float32Array(Wr/4));l(this,"_lightScratchU",new Uint32Array(this._lightScratch.buffer));l(this,"_cloudShadowScratch",new Float32Array(3));this.hdrTexture=e,this.hdrView=t,this._pipeline=n,this._sceneBindGroup=i,this._gbufferBindGroup=o,this._aoBindGroup=a,this._iblBindGroup=s,this.cameraBuffer=c,this.lightBuffer=u,this._defaultCloudShadow=p,this._defaultSsgi=f,this._device=h,this._aoBGL=m,this._aoView=_,this._aoSampler=w,this._ssgiSampler=v}static create(e,t,n,i,o,a){const{device:s,width:c,height:u}=e,p=s.createTexture({label:"HDR Texture",size:{width:c,height:u},format:Q,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),f=p.createView(),h=s.createBuffer({label:"LightCameraBuffer",size:Hr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),m=s.createBuffer({label:"LightBuffer",size:Wr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),_=s.createSampler({label:"ShadowSampler",compare:"less-equal",magFilter:"linear",minFilter:"linear"}),w=s.createSampler({label:"GBufferLinearSampler",magFilter:"linear",minFilter:"linear"}),v=s.createSampler({label:"AoSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),x=s.createSampler({label:"SsgiSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),B=s.createBindGroupLayout({label:"LightSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),G=s.createBindGroupLayout({label:"LightGBufferBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth",viewDimension:"2d-array"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"comparison"}},{binding:5,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:6,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),S=s.createTexture({label:"DefaultCloudShadow",size:{width:1,height:1},format:"r8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});s.queue.writeTexture({texture:S},new Uint8Array([255]),{bytesPerRow:1},{width:1,height:1});const E=o??S.createView(),M=s.createBindGroupLayout({label:"LightAoBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),A=s.createTexture({label:"DefaultSsgi",size:{width:1,height:1},format:Q,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),R=s.createBindGroupLayout({label:"LightIblBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),P=s.createSampler({label:"IblSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge"}),b=s.createTexture({label:"DefaultIblCube",size:{width:1,height:1,depthOrArrayLayers:6},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),C=b.createView({dimension:"cube"}),g=s.createTexture({label:"DefaultBrdfLut",size:{width:1,height:1},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),T=s.createBindGroup({label:"LightIblBG",layout:R,entries:[{binding:0,resource:(a==null?void 0:a.irradianceView)??C},{binding:1,resource:(a==null?void 0:a.prefilteredView)??C},{binding:2,resource:(a==null?void 0:a.brdfLutView)??g.createView()},{binding:3,resource:P}]});b.destroy(),g.destroy();const y=s.createBindGroup({layout:B,entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:{buffer:m}}]}),U=s.createBindGroup({layout:G,entries:[{binding:0,resource:t.albedoRoughnessView},{binding:1,resource:t.normalMetallicView},{binding:2,resource:t.depthView},{binding:3,resource:n.shadowMapView},{binding:4,resource:_},{binding:5,resource:w},{binding:6,resource:E}]}),N=s.createBindGroup({label:"LightAoBG",layout:M,entries:[{binding:0,resource:i},{binding:1,resource:v},{binding:2,resource:A.createView()},{binding:3,resource:x}]}),V=s.createShaderModule({label:"LightingShader",code:xi}),z=s.createRenderPipeline({label:"LightingPipeline",layout:s.createPipelineLayout({bindGroupLayouts:[B,G,M,R]}),vertex:{module:V,entryPoint:"vs_main"},fragment:{module:V,entryPoint:"fs_main",targets:[{format:Q}]},primitive:{topology:"triangle-list"}});return new er(p,f,z,y,U,N,T,h,m,o?null:S,A,s,M,i,v,x)}updateSSGI(e){this._aoBindGroup=this._device.createBindGroup({label:"LightAoBG",layout:this._aoBGL,entries:[{binding:0,resource:this._aoView},{binding:1,resource:this._aoSampler},{binding:2,resource:e},{binding:3,resource:this._ssgiSampler}]})}updateCamera(e,t,n,i,o,a,s,c){const u=this._cameraScratch;u.set(t.data,0),u.set(n.data,16),u.set(i.data,32),u.set(o.data,48),u[64]=a.x,u[65]=a.y,u[66]=a.z,u[67]=s,u[68]=c,e.queue.writeBuffer(this.cameraBuffer,0,u.buffer)}updateLight(e,t,n,i,o,a=!0,s=!1,c=.02){const u=this._lightScratch,p=this._lightScratchU;let f=0;u[f++]=t.x,u[f++]=t.y,u[f++]=t.z,u[f++]=i,u[f++]=n.x,u[f++]=n.y,u[f++]=n.z,p[f++]=o.length;for(let h=0;h<4;h++)h<o.length&&u.set(o[h].lightViewProj.data,f),f+=16;for(let h=0;h<4;h++)u[f++]=h<o.length?o[h].splitFar:1e9;p[f]=a?1:0,p[f+1]=s?1:0,u[81]=c;for(let h=0;h<4;h++)u[84+h]=h<o.length?o[h].depthRange:1;for(let h=0;h<4;h++)u[88+h]=h<o.length?o[h].texelWorldSize:1;e.queue.writeBuffer(this.lightBuffer,0,u.buffer)}updateCloudShadow(e,t,n,i){const o=this._cloudShadowScratch;o[0]=t,o[1]=n,o[2]=i,e.queue.writeBuffer(this.lightBuffer,312,o.buffer)}execute(e,t){const n=e.beginRenderPass({label:"LightingPass",colorAttachments:[{view:this.hdrView,loadOp:"load",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._sceneBindGroup),n.setBindGroup(1,this._gbufferBindGroup),n.setBindGroup(2,this._aoBindGroup),n.setBindGroup(3,this._iblBindGroup),n.draw(3),n.end()}destroy(){var e,t;this.hdrTexture.destroy(),this.cameraBuffer.destroy(),this.lightBuffer.destroy(),(e=this._defaultCloudShadow)==null||e.destroy(),(t=this._defaultSsgi)==null||t.destroy()}}const wi=`// Physically based single-scattering atmosphere (Rayleigh + Mie).\r
// Reference: Nishita 1993, Preetham 1999, Hillaire 2020 (simplified).\r
//\r
// World units are metres.  The ground sits at y ≈ 0 so the camera is placed at\r
// (0, R_E + cameraPos.y, 0) in atmosphere space.\r
\r
const PI    : f32 = 3.14159265358979;\r
const R_E   : f32 = 6360000.0;   // Earth radius (m)\r
const R_A   : f32 = 6420000.0;   // Atmosphere top radius (m)\r
const H_R   : f32 = 8500.0;      // Rayleigh scale height (m)\r
const H_M   : f32 = 1200.0;      // Mie scale height (m)\r
const G     : f32 = 0.758;       // Mie anisotropy (forward-scattering haze)\r
// Rayleigh coefficients (per metre) tuned to 680 / 550 / 440 nm wavelengths.\r
const BETA_R : vec3<f32> = vec3<f32>(5.5e-6, 13.0e-6, 22.4e-6);\r
// Mie coefficient (per metre, wavelength-independent for haze).\r
const BETA_M : f32 = 21.0e-6;\r
// Solar irradiance at top of atmosphere (in renderer HDR units).\r
const SUN_INTENSITY : f32 = 20.0;\r
// Angular cosine thresholds for sun and moon disks.\r
const SUN_COS_THRESH  : f32 = 0.9996;   // ~1.6° angular radius (~3× real sun)\r
const MOON_COS_THRESH : f32 = 0.9997;   // slightly smaller than sun\r
\r
struct Uniforms {\r
  invViewProj : mat4x4<f32>,\r
  cameraPos   : vec3<f32>,\r
  _pad0       : f32,\r
  sunDir      : vec3<f32>,  // unit vector pointing TOWARD the sun\r
  _pad1       : f32,\r
}\r
\r
@group(0) @binding(0) var<uniform> u: Uniforms;\r
\r
// Ray–sphere intersection.  Returns (tNear, tFar); both negative means no hit.\r
fn raySphere(ro: vec3<f32>, rd: vec3<f32>, r: f32) -> vec2<f32> {\r
  let b  = dot(ro, rd);\r
  let c  = dot(ro, ro) - r * r;\r
  let d  = b * b - c;\r
  if (d < 0.0) { return vec2<f32>(-1.0, -1.0); }\r
  let sq = sqrt(d);\r
  return vec2<f32>(-b - sq, -b + sq);\r
}\r
\r
fn phaseR(mu: f32) -> f32 {\r
  return (3.0 / (16.0 * PI)) * (1.0 + mu * mu);\r
}\r
\r
fn phaseM(mu: f32) -> f32 {\r
  let g2 = G * G;\r
  return (3.0 / (8.0 * PI)) *\r
         ((1.0 - g2) * (1.0 + mu * mu)) /\r
         ((2.0 + g2) * pow(max(1.0 + g2 - 2.0 * G * mu, 1e-4), 1.5));\r
}\r
\r
// Optical depth from \`pos\` toward \`dir\` through the atmosphere.\r
fn opticalDepthToSky(pos: vec3<f32>, dir: vec3<f32>) -> vec2<f32> {\r
  let t  = raySphere(pos, dir, R_A);\r
  let ds = t.y / 8.0;\r
  var od = vec2<f32>(0.0);\r
  for (var i = 0; i < 8; i++) {\r
    let h = length(pos + dir * ((f32(i) + 0.5) * ds)) - R_E;\r
    if (h < 0.0) { break; }\r
    od += vec2<f32>(exp(-h / H_R), exp(-h / H_M)) * ds;\r
  }\r
  return od;\r
}\r
\r
// Transmittance of the atmosphere from \`ro\` in direction \`rd\` (used for the sun disk).\r
fn transmittance(ro: vec3<f32>, rd: vec3<f32>) -> vec3<f32> {\r
  let od = opticalDepthToSky(ro, rd);\r
  return exp(-(BETA_R * od.x + BETA_M * 1.1 * od.y));\r
}\r
\r
// Single-scattering integral along the view ray.\r
fn scatter(ro: vec3<f32>, rd: vec3<f32>) -> vec3<f32> {\r
  let ta   = raySphere(ro, rd, R_A);\r
  let tMin = max(ta.x, 0.0);\r
  if (ta.y < 0.0) { return vec3<f32>(0.0); }\r
\r
  // Clip view ray at the ground surface.\r
  let tg   = raySphere(ro, rd, R_E);\r
  let tMax = select(ta.y, min(ta.y, tg.x), tg.x > 0.0);\r
  if (tMax <= tMin) { return vec3<f32>(0.0); }\r
\r
  let mu = dot(rd, u.sunDir);\r
  let pR = phaseR(mu);\r
  let pM = phaseM(mu);\r
\r
  let ds = (tMax - tMin) / 16.0;\r
  var sumR = vec3<f32>(0.0);\r
  var sumM = vec3<f32>(0.0);\r
  var odR  = 0.0;\r
  var odM  = 0.0;\r
\r
  for (var i = 0; i < 16; i++) {\r
    let pos = ro + rd * (tMin + (f32(i) + 0.5) * ds);\r
    let h   = length(pos) - R_E;\r
    if (h < 0.0) { break; }\r
\r
    let hrh = exp(-h / H_R) * ds;\r
    let hmh = exp(-h / H_M) * ds;\r
    odR += hrh;\r
    odM += hmh;\r
\r
    // Light ray toward the sun — skip if blocked by Earth.\r
    let tg2 = raySphere(pos, u.sunDir, R_E);\r
    if (tg2.x > 0.0) { continue; }\r
\r
    let odL = opticalDepthToSky(pos, u.sunDir);\r
\r
    let tau = BETA_R * (odR + odL.x) + BETA_M * 1.1 * (odM + odL.y);\r
    let T   = exp(-tau);\r
    sumR += T * hrh;\r
    sumM += T * hmh;\r
  }\r
\r
  return SUN_INTENSITY * (BETA_R * pR * sumR + vec3<f32>(BETA_M) * pM * sumM);\r
}\r
\r
// --- Vertex shader (fullscreen triangle) ---\r
\r
struct VertOut {\r
  @builtin(position) clip_pos : vec4<f32>,\r
  @location(0)       uv       : vec2<f32>,\r
}\r
\r
@vertex\r
fn vs_main(@builtin(vertex_index) vid: u32) -> VertOut {\r
  let x = f32((vid & 1u) << 2u) - 1.0;\r
  let y = f32((vid & 2u) << 1u) - 1.0;\r
  var out: VertOut;\r
  out.clip_pos = vec4<f32>(x, y, 0.0, 1.0);\r
  out.uv       = vec2<f32>(x * 0.5 + 0.5, y * -0.5 + 0.5);\r
  return out;\r
}\r
\r
@fragment\r
fn fs_main(in: VertOut) -> @location(0) vec4<f32> {\r
  // Reconstruct world-space view direction.\r
  let ndc = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, 1.0, 1.0);\r
  let wh  = u.invViewProj * ndc;\r
  let rd  = normalize(wh.xyz / wh.w - u.cameraPos);\r
\r
  // Place camera on Earth's surface (world y ≈ metres above sea level).\r
  let camH = max(u.cameraPos.y, 1.0);\r
  let ro   = vec3<f32>(0.0, R_E + camH, 0.0);\r
\r
  var color = scatter(ro, rd);\r
\r
  // Sun disk: bright limb attenuated by atmosphere transmittance.\r
  if (dot(rd, u.sunDir) > SUN_COS_THRESH) {\r
    color += transmittance(ro, u.sunDir) * 1000.0;\r
  }\r
\r
  // Moon disk: antipodal to the sun, fades in after sunset.\r
  // SUN_COS_THRESH gives the same ~0.36° angular radius as the sun.\r
  let moonDir = -u.sunDir;\r
  if (dot(rd, moonDir) > MOON_COS_THRESH) {\r
    let night_t = saturate((-u.sunDir.y - 0.05) * 10.0);\r
    color += transmittance(ro, moonDir) * vec3<f32>(0.85, 0.90, 1.0) * 15.0 * night_t;\r
  }\r
\r
  return vec4<f32>(color, 1.0);\r
}\r
`,qr=96;class tr extends he{constructor(e,t,n,i){super();l(this,"name","AtmospherePass");l(this,"_pipeline");l(this,"_uniformBuf");l(this,"_bg");l(this,"_hdrView");this._pipeline=e,this._uniformBuf=t,this._bg=n,this._hdrView=i}static create(e,t){const{device:n}=e,i=n.createBuffer({label:"AtmosphereUniform",size:qr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),o=n.createBindGroupLayout({label:"AtmosphereBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),a=n.createBindGroup({label:"AtmosphereBG",layout:o,entries:[{binding:0,resource:{buffer:i}}]}),s=n.createShaderModule({label:"AtmosphereShader",code:wi}),c=n.createRenderPipeline({label:"AtmospherePipeline",layout:n.createPipelineLayout({bindGroupLayouts:[o]}),vertex:{module:s,entryPoint:"vs_main"},fragment:{module:s,entryPoint:"fs_main",targets:[{format:Q}]},primitive:{topology:"triangle-list"}});return new tr(c,i,a,t)}update(e,t,n,i){const o=new Float32Array(qr/4);o.set(t.data,0),o[16]=n.x,o[17]=n.y,o[18]=n.z;const a=Math.sqrt(i.x*i.x+i.y*i.y+i.z*i.z),s=a>0?1/a:0;o[20]=-i.x*s,o[21]=-i.y*s,o[22]=-i.z*s,e.queue.writeBuffer(this._uniformBuf,0,o.buffer)}execute(e,t){const n=e.beginRenderPass({label:"AtmospherePass",colorAttachments:[{view:this._hdrView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._bg),n.draw(3),n.end()}destroy(){this._uniformBuf.destroy()}}const Bi=`// Block selection highlight — two draw calls sharing this shader:\r
//   draw(36): semi-transparent dark face overlay (6 faces × 2 triangles × 3 verts)\r
//   draw(36, 36): thick edge outlines (12 edges × 2 quads × 3 verts, offset into same array)\r
//\r
// Corner index encoding: bit 0 = x, bit 1 = y, bit 2 = z (0=min, 1=max side).\r
\r
struct Uniforms {\r
  viewProj : mat4x4<f32>,\r
  blockPos : vec3<f32>,\r
  _pad     : f32,\r
}\r
\r
@group(0) @binding(0) var<uniform> u: Uniforms;\r
\r
// ── 36 vertices for 6 faces (triangle-list, cullMode=none) ──────────────────\r
// Each row: two triangles covering one face of the unit cube.\r
const FACE_CI: array<u32, 36> = array<u32, 36>(\r
  0u,3u,2u, 0u,1u,3u,   // -Z  (ci 0,1,2,3 → z=0 face)\r
  4u,6u,7u, 4u,7u,5u,   // +Z  (ci 4,5,6,7 → z=1 face)\r
  0u,6u,4u, 0u,2u,6u,   // -X  (ci 0,2,4,6 → x=0 face)\r
  1u,5u,7u, 1u,7u,3u,   // +X  (ci 1,3,5,7 → x=1 face)\r
  0u,5u,1u, 0u,4u,5u,   // -Y  (ci 0,1,4,5 → y=0 face)\r
  2u,3u,7u, 2u,7u,6u,   // +Y  (ci 2,3,6,7 → y=1 face)\r
);\r
\r
// ── 72 vertices for 12 edges rendered as quads (triangle-list) ───────────────\r
// Each edge is two thin quads (one in each perpendicular plane), so 4 triangles.\r
// W = half-width of each quad in world units.\r
const W: f32 = 0.04;\r
const E: f32 = 0.002;   // small inset so edges sit on the block surface\r
\r
// For each of the 12 cube edges, 6 vertices (2 triangles = 1 quad in the primary plane).\r
// We render each edge as two perpendicular quads by using a second index buffer offset.\r
// Layout: for edge i, primary-plane quad at [i*6 .. i*6+5].\r
\r
// 12 edge corner-index pairs (each edge = two corners)\r
const EDGE_A: array<u32, 12> = array<u32, 12>(\r
  0u, 2u, 4u, 6u,   // X-axis edges (vary x, fix y,z)\r
  0u, 1u, 4u, 5u,   // Y-axis edges (vary y, fix x,z)\r
  0u, 1u, 2u, 3u,   // Z-axis edges (vary z, fix x,y)\r
);\r
const EDGE_B: array<u32, 12> = array<u32, 12>(\r
  1u, 3u, 5u, 7u,\r
  2u, 3u, 6u, 7u,\r
  4u, 5u, 6u, 7u,\r
);\r
\r
// Per-edge offset axis for the primary quad: 0=X,1=Y,2=Z axis edges get perpendicular in Y or Z.\r
// We expand the primary quad by ±W in the "secondary" axis.\r
// Edge type 0 (X-axis): primary quad expands in Y → secondary in Z handled separately.\r
// Edge type 1 (Y-axis): primary quad expands in X → secondary in Z.\r
// Edge type 2 (Z-axis): primary quad expands in X → secondary in Y.\r
// We encode the expand axis for the primary quad as u32.\r
const EDGE_TYPE: array<u32, 12> = array<u32, 12>(\r
  0u,0u,0u,0u,   // X edges\r
  1u,1u,1u,1u,   // Y edges\r
  2u,2u,2u,2u,   // Z edges\r
);\r
\r
fn ci_to_pos(ci: u32) -> vec3<f32> {\r
  return u.blockPos + vec3<f32>(\r
    mix(E, 1.0 - E, f32((ci >> 0u) & 1u)),\r
    mix(E, 1.0 - E, f32((ci >> 1u) & 1u)),\r
    mix(E, 1.0 - E, f32((ci >> 2u) & 1u)),\r
  );\r
}\r
\r
// ── Vertex shader for the face overlay ──────────────────────────────────────\r
\r
// Clip-space depth bias: subtract a fraction of clip.w from clip.z, which\r
// pushes the rasterised NDC depth toward the camera by a fixed 0.001 (1‰).\r
// Reliable across drivers/depth formats; the WebGPU \`depthBias\` pipeline\r
// state is implementation-defined for \`depth32float\`.\r
const Z_BIAS: f32 = 0.001;\r
\r
fn bias_clip(clip: vec4<f32>) -> vec4<f32> {\r
  return vec4<f32>(clip.x, clip.y, clip.z - Z_BIAS * clip.w, clip.w);\r
}\r
\r
@vertex\r
fn vs_face(@builtin(vertex_index) vid: u32) -> @builtin(position) vec4<f32> {\r
  let ci  = FACE_CI[vid];\r
  let pos = u.blockPos + vec3<f32>(\r
    mix(-0.001, 1.001, f32((ci >> 0u) & 1u)),\r
    mix(-0.001, 1.001, f32((ci >> 1u) & 1u)),\r
    mix(-0.001, 1.001, f32((ci >> 2u) & 1u)),\r
  );\r
  return bias_clip(u.viewProj * vec4<f32>(pos, 1.0));\r
}\r
\r
@fragment\r
fn fs_face() -> @location(0) vec4<f32> {\r
  return vec4<f32>(0.0, 0.0, 0.0, 0.35);\r
}\r
\r
// ── Vertex shader for edge quads ─────────────────────────────────────────────\r
// Each edge renders as two quads (primary + secondary perpendicular planes).\r
// First 72 vertices = primary plane quads, next 72 = secondary plane quads.\r
\r
@vertex\r
fn vs_edge(@builtin(vertex_index) vid: u32) -> @builtin(position) vec4<f32> {\r
  let secondary = vid >= 72u;\r
  let local_vid = vid % 72u;\r
  let edge_idx  = local_vid / 6u;          // 0..11\r
  let vert_idx  = local_vid % 6u;          // 0..5 (two triangles: 012, 034... wait, 0-1-2, 0-2-3)\r
\r
  let A = ci_to_pos(EDGE_A[edge_idx]);\r
  let B = ci_to_pos(EDGE_B[edge_idx]);\r
\r
  // Quad vertex offsets along the perpendicular axis.\r
  // Quad pattern for 6 verts: 0=A-perp, 1=B-perp, 2=B+perp, 3=A+perp (→ tris 0,1,2 and 0,2,3)\r
  let quad_v = array<u32, 6>(0u, 1u, 2u, 0u, 2u, 3u);\r
  let qv     = quad_v[vert_idx];\r
\r
  // Side flag: -1 for perp0, +1 for perp1\r
  let side = select(-W, W, qv == 1u || qv == 2u);\r
  // Endpoint flag: A or B\r
  let at_b = (qv == 1u || qv == 2u || (qv == 3u));  // B endpoints\r
  // Actually remap: 0→A-, 1→B-, 2→B+, 3→A+\r
  let use_b = (qv == 1u || qv == 2u);\r
  let base  = select(A, B, use_b);\r
  let sgn   = select(-W, W, qv == 2u || qv == 3u);\r
\r
  let etype = EDGE_TYPE[edge_idx];\r
  var off = vec3<f32>(0.0);\r
  if (!secondary) {\r
    // Primary perpendicular axis\r
    if (etype == 0u) { off.y = sgn; }        // X-edge: expand in Y\r
    else if (etype == 1u) { off.x = sgn; }   // Y-edge: expand in X\r
    else { off.x = sgn; }                     // Z-edge: expand in X\r
  } else {\r
    // Secondary perpendicular axis\r
    if (etype == 0u) { off.z = sgn; }        // X-edge: expand in Z\r
    else if (etype == 1u) { off.z = sgn; }   // Y-edge: expand in Z\r
    else { off.y = sgn; }                     // Z-edge: expand in Y\r
  }\r
\r
  return bias_clip(u.viewProj * vec4<f32>(base + off, 1.0));\r
}\r
\r
@fragment\r
fn fs_edge() -> @location(0) vec4<f32> {\r
  return vec4<f32>(0.0, 0.0, 0.0, 0.8);\r
}\r
`,jr=80;class rr extends he{constructor(e,t,n,i,o,a){super();l(this,"name","BlockHighlightPass");l(this,"_facePipeline");l(this,"_edgePipeline");l(this,"_uniformBuf");l(this,"_bg");l(this,"_hdrView");l(this,"_depthView");l(this,"_active",!1);this._facePipeline=e,this._edgePipeline=t,this._uniformBuf=n,this._bg=i,this._hdrView=o,this._depthView=a}static create(e,t,n){const{device:i}=e,o=i.createBuffer({label:"BlockHighlightUniform",size:jr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),a=i.createBindGroupLayout({label:"BlockHighlightBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),s=i.createBindGroup({label:"BlockHighlightBG",layout:a,entries:[{binding:0,resource:{buffer:o}}]}),c=i.createShaderModule({label:"BlockHighlightShader",code:Bi}),u=i.createPipelineLayout({bindGroupLayouts:[a]}),p={format:"depth32float",depthWriteEnabled:!1,depthCompare:"less-equal"},f={color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}},h=i.createRenderPipeline({label:"BlockHighlightFacePipeline",layout:u,vertex:{module:c,entryPoint:"vs_face"},fragment:{module:c,entryPoint:"fs_face",targets:[{format:Q,blend:f}]},primitive:{topology:"triangle-list",cullMode:"none"},depthStencil:p}),m=i.createRenderPipeline({label:"BlockHighlightEdgePipeline",layout:u,vertex:{module:c,entryPoint:"vs_edge"},fragment:{module:c,entryPoint:"fs_edge",targets:[{format:Q,blend:f}]},primitive:{topology:"triangle-list",cullMode:"none"},depthStencil:p});return new rr(h,m,o,s,t,n)}update(e,t,n){if(!n){this._active=!1;return}this._active=!0;const i=new Float32Array(jr/4);i.set(t.data,0),i[16]=n.x,i[17]=n.y,i[18]=n.z,e.queue.writeBuffer(this._uniformBuf,0,i.buffer)}execute(e,t){if(!this._active)return;const n=e.beginRenderPass({label:"BlockHighlightPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._depthView,depthLoadOp:"load",depthStoreOp:"store"}});n.setBindGroup(0,this._bg),n.setPipeline(this._facePipeline),n.draw(36),n.setPipeline(this._edgePipeline),n.draw(144),n.end()}destroy(){this._uniformBuf.destroy()}}const Si=`// Cloud + sky pass — fullscreen triangle.\r
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
`,Yr=96,Xr=48,$r=32;class nr extends he{constructor(e,t,n,i,o,a,s,c,u){super();l(this,"name","CloudPass");l(this,"_pipeline");l(this,"_hdrView");l(this,"_cameraBuffer");l(this,"_cloudBuffer");l(this,"_lightBuffer");l(this,"_sceneBG");l(this,"_lightBG");l(this,"_depthBG");l(this,"_noiseSkyBG");this._pipeline=e,this._hdrView=t,this._cameraBuffer=n,this._cloudBuffer=i,this._lightBuffer=o,this._sceneBG=a,this._lightBG=s,this._depthBG=c,this._noiseSkyBG=u}static create(e,t,n,i){const{device:o}=e,a=o.createBuffer({label:"CloudCameraBuffer",size:Yr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),s=o.createBuffer({label:"CloudUniformBuffer",size:Xr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),c=o.createBuffer({label:"CloudLightBuffer",size:$r,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),u=o.createBindGroupLayout({label:"CloudSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),p=o.createBindGroupLayout({label:"CloudLightBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),f=o.createBindGroupLayout({label:"CloudDepthBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),h=o.createBindGroupLayout({label:"CloudNoiseSkyBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),m=o.createSampler({label:"CloudNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"repeat",addressModeV:"repeat",addressModeW:"repeat"}),_=o.createSampler({label:"CloudDepthSampler"}),w=o.createBindGroup({label:"CloudSceneBG",layout:u,entries:[{binding:0,resource:{buffer:a}},{binding:1,resource:{buffer:s}}]}),v=o.createBindGroup({label:"CloudLightBG",layout:p,entries:[{binding:0,resource:{buffer:c}}]}),x=o.createBindGroup({label:"CloudDepthBG",layout:f,entries:[{binding:0,resource:n},{binding:1,resource:_}]}),B=o.createBindGroup({label:"CloudNoiseSkyBG",layout:h,entries:[{binding:0,resource:i.baseView},{binding:1,resource:i.detailView},{binding:2,resource:m}]}),G=o.createShaderModule({label:"CloudShader",code:Si}),S=o.createRenderPipeline({label:"CloudPipeline",layout:o.createPipelineLayout({bindGroupLayouts:[u,p,f,h]}),vertex:{module:G,entryPoint:"vs_main"},fragment:{module:G,entryPoint:"fs_main",targets:[{format:Q}]},primitive:{topology:"triangle-list"}});return new nr(S,t,a,s,c,w,v,x,B)}updateCamera(e,t,n,i,o){const a=new Float32Array(Yr/4);a.set(t.data,0),a[16]=n.x,a[17]=n.y,a[18]=n.z,a[19]=i,a[20]=o,e.queue.writeBuffer(this._cameraBuffer,0,a.buffer)}updateLight(e,t,n,i){const o=new Float32Array($r/4);o[0]=t.x,o[1]=t.y,o[2]=t.z,o[3]=i,o[4]=n.x,o[5]=n.y,o[6]=n.z,e.queue.writeBuffer(this._lightBuffer,0,o.buffer)}updateSettings(e,t){const n=new Float32Array(Xr/4);n[0]=t.cloudBase,n[1]=t.cloudTop,n[2]=t.coverage,n[3]=t.density,n[4]=t.windOffset[0],n[5]=t.windOffset[1],n[6]=t.anisotropy,n[7]=t.extinction,n[8]=t.ambientColor[0],n[9]=t.ambientColor[1],n[10]=t.ambientColor[2],n[11]=t.exposure,e.queue.writeBuffer(this._cloudBuffer,0,n.buffer)}execute(e,t){const n=e.beginRenderPass({label:"CloudPass",colorAttachments:[{view:this._hdrView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._sceneBG),n.setBindGroup(1,this._lightBG),n.setBindGroup(2,this._depthBG),n.setBindGroup(3,this._noiseSkyBG),n.draw(3),n.end()}destroy(){this._cameraBuffer.destroy(),this._cloudBuffer.destroy(),this._lightBuffer.destroy()}}const Pi=`// Cloud shadow pass — renders a top-down cloud transmittance map (1024×1024 r8unorm).\r
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
`,Kr=1024,Zr="r8unorm",Qr=48;class ir extends he{constructor(e,t,n,i,o,a){super();l(this,"name","CloudShadowPass");l(this,"shadowTexture");l(this,"shadowView");l(this,"_pipeline");l(this,"_uniformBuffer");l(this,"_uniformBG");l(this,"_noiseBG");l(this,"_frameCount",0);this.shadowTexture=e,this.shadowView=t,this._pipeline=n,this._uniformBuffer=i,this._uniformBG=o,this._noiseBG=a}static create(e,t){const{device:n}=e,i=n.createTexture({label:"CloudShadowTexture",size:{width:Kr,height:Kr},format:Zr,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),o=i.createView(),a=n.createBuffer({label:"CloudShadowUniform",size:Qr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),s=n.createBindGroupLayout({label:"CloudShadowUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),c=n.createSampler({label:"CloudNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"repeat",addressModeV:"repeat",addressModeW:"repeat"}),u=n.createBindGroupLayout({label:"CloudShadowNoiseBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),p=n.createBindGroup({label:"CloudShadowUniformBG",layout:s,entries:[{binding:0,resource:{buffer:a}}]}),f=n.createBindGroup({label:"CloudShadowNoiseBG",layout:u,entries:[{binding:0,resource:t.baseView},{binding:1,resource:t.detailView},{binding:2,resource:c}]}),h=n.createShaderModule({label:"CloudShadowShader",code:Pi}),m=n.createRenderPipeline({label:"CloudShadowPipeline",layout:n.createPipelineLayout({bindGroupLayouts:[s,u]}),vertex:{module:h,entryPoint:"vs_main"},fragment:{module:h,entryPoint:"fs_main",targets:[{format:Zr}]},primitive:{topology:"triangle-list"}});return new ir(i,o,m,a,p,f)}update(e,t,n,i){const o=new Float32Array(Qr/4);o[0]=t.cloudBase,o[1]=t.cloudTop,o[2]=t.coverage,o[3]=t.density,o[4]=t.windOffset[0],o[5]=t.windOffset[1],o[6]=n[0],o[7]=n[1],o[8]=i,o[9]=t.extinction,e.queue.writeBuffer(this._uniformBuffer,0,o.buffer)}execute(e,t){if(this._frameCount++%2!==0)return;const n=e.beginRenderPass({label:"CloudShadowPass",colorAttachments:[{view:this.shadowView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._uniformBG),n.setBindGroup(1,this._noiseBG),n.draw(3),n.end()}destroy(){this.shadowTexture.destroy(),this._uniformBuffer.destroy()}}const Gi=`// TAA resolve pass — fullscreen triangle, blends current HDR with reprojected history.\r
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
`,Jr=128;class or extends he{constructor(e,t,n,i,o,a,s,c,u,p){super();l(this,"name","TAAPass");l(this,"_resolved");l(this,"resolvedView");l(this,"_history");l(this,"_historyView");l(this,"_pipeline");l(this,"_uniformBuffer");l(this,"_uniformBG");l(this,"_textureBG");l(this,"_width");l(this,"_height");this._resolved=e,this.resolvedView=t,this._history=n,this._historyView=i,this._pipeline=o,this._uniformBuffer=a,this._uniformBG=s,this._textureBG=c,this._width=u,this._height=p}get historyView(){return this._historyView}static create(e,t,n){const{device:i,width:o,height:a}=e,s=i.createTexture({label:"TAA Resolved",size:{width:o,height:a},format:Q,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),c=i.createTexture({label:"TAA History",size:{width:o,height:a},format:Q,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),u=s.createView(),p=c.createView(),f=i.createBuffer({label:"TAAUniformBuffer",size:Jr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),h=i.createBindGroupLayout({label:"TAAUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),m=i.createBindGroupLayout({label:"TAATextureBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),_=i.createSampler({label:"TAALinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),w=i.createBindGroup({layout:h,entries:[{binding:0,resource:{buffer:f}}]}),v=i.createBindGroup({layout:m,entries:[{binding:0,resource:t.hdrView},{binding:1,resource:p},{binding:2,resource:n.depthView},{binding:3,resource:_}]}),x=i.createShaderModule({label:"TAAShader",code:Gi}),B=i.createRenderPipeline({label:"TAAPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[h,m]}),vertex:{module:x,entryPoint:"vs_main"},fragment:{module:x,entryPoint:"fs_main",targets:[{format:Q}]},primitive:{topology:"triangle-list"}});return new or(s,u,c,p,B,f,w,v,o,a)}updateCamera(e,t,n){const i=new Float32Array(Jr/4);i.set(t.data,0),i.set(n.data,16),e.queue.writeBuffer(this._uniformBuffer,0,i.buffer)}execute(e,t){const n=e.beginRenderPass({label:"TAAPass",colorAttachments:[{view:this.resolvedView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._uniformBG),n.setBindGroup(1,this._textureBG),n.draw(3),n.end(),e.copyTextureToTexture({texture:this._resolved},{texture:this._history},{width:this._width,height:this._height})}destroy(){this._resolved.destroy(),this._history.destroy(),this._uniformBuffer.destroy()}}const Ti=`// Bloom: prefilter (downsample + threshold) and separable Gaussian blur.\r
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
`,Ai=`// Bloom composite: adds the blurred bright regions back to the source HDR.\r
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
`,Mi=16;class ar extends he{constructor(e,t,n,i,o,a,s,c,u,p,f,h,m,_,w){super();l(this,"name","BloomPass");l(this,"resultView");l(this,"_result");l(this,"_half1");l(this,"_half2");l(this,"_half1View");l(this,"_half2View");l(this,"_prefilterPipeline");l(this,"_blurHPipeline");l(this,"_blurVPipeline");l(this,"_compositePipeline");l(this,"_uniformBuffer");l(this,"_prefilterBG");l(this,"_blurHBG");l(this,"_blurVBG");l(this,"_compositeBG");this._result=e,this.resultView=t,this._half1=n,this._half1View=i,this._half2=o,this._half2View=a,this._prefilterPipeline=s,this._blurHPipeline=c,this._blurVPipeline=u,this._compositePipeline=p,this._uniformBuffer=f,this._prefilterBG=h,this._blurHBG=m,this._blurVBG=_,this._compositeBG=w}static create(e,t){const{device:n,width:i,height:o}=e,a=Math.max(1,i>>1),s=Math.max(1,o>>1),c=n.createTexture({label:"BloomHalf1",size:{width:a,height:s},format:Q,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),u=n.createTexture({label:"BloomHalf2",size:{width:a,height:s},format:Q,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),p=n.createTexture({label:"BloomResult",size:{width:i,height:o},format:Q,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),f=c.createView(),h=u.createView(),m=p.createView(),_=n.createBuffer({label:"BloomUniforms",size:Mi,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});n.queue.writeBuffer(_,0,new Float32Array([1,.5,.3,0]).buffer);const w=n.createSampler({label:"BloomSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),v=n.createBindGroupLayout({label:"BloomSingleBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),x=n.createBindGroupLayout({label:"BloomCompositeBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),B=n.createShaderModule({label:"BloomShader",code:Ti}),G=n.createShaderModule({label:"BloomComposite",code:Ai}),S=n.createPipelineLayout({bindGroupLayouts:[v]}),E=n.createPipelineLayout({bindGroupLayouts:[x]});function M(N,V){return n.createRenderPipeline({label:V,layout:S,vertex:{module:B,entryPoint:"vs_main"},fragment:{module:B,entryPoint:N,targets:[{format:Q}]},primitive:{topology:"triangle-list"}})}const A=M("fs_prefilter","BloomPrefilterPipeline"),R=M("fs_blur_h","BloomBlurHPipeline"),P=M("fs_blur_v","BloomBlurVPipeline"),b=n.createRenderPipeline({label:"BloomCompositePipeline",layout:E,vertex:{module:G,entryPoint:"vs_main"},fragment:{module:G,entryPoint:"fs_main",targets:[{format:Q}]},primitive:{topology:"triangle-list"}});function C(N){return n.createBindGroup({layout:v,entries:[{binding:0,resource:{buffer:_}},{binding:1,resource:N},{binding:2,resource:w}]})}const g=C(t),T=C(f),y=C(h),U=n.createBindGroup({layout:x,entries:[{binding:0,resource:{buffer:_}},{binding:1,resource:t},{binding:2,resource:f},{binding:3,resource:w}]});return new ar(p,m,c,f,u,h,A,R,P,b,_,g,T,y,U)}updateParams(e,t=1,n=.5,i=.3){e.queue.writeBuffer(this._uniformBuffer,0,new Float32Array([t,n,i,0]).buffer)}execute(e,t){const n=(i,o,a,s)=>{const c=e.beginRenderPass({label:i,colorAttachments:[{view:o,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});c.setPipeline(a),c.setBindGroup(0,s),c.draw(3),c.end()};n("BloomPrefilter",this._half1View,this._prefilterPipeline,this._prefilterBG);for(let i=0;i<2;i++)n("BloomBlurH",this._half2View,this._blurHPipeline,this._blurHBG),n("BloomBlurV",this._half1View,this._blurVPipeline,this._blurVBG);n("BloomComposite",this.resultView,this._compositePipeline,this._compositeBG)}destroy(){this._result.destroy(),this._half1.destroy(),this._half2.destroy(),this._uniformBuffer.destroy()}}const Ei=`// godray_march.wgsl — Half-resolution ray-march pass for volumetric godrays.\r
//\r
// Fires rays from the camera toward each pixel's world position, sampling the\r
// directional-light shadow map at each step to accumulate in-scattered light.\r
// Outputs a single fog value [0,1] in the R channel of a half-res rgba16float\r
// texture, dithered to hide banding at low step counts.\r
\r
const PI: f32 = 3.14159265358979;\r
\r
struct VertexOutput {\r
  @builtin(position) clip_pos: vec4<f32>,\r
  @location(0)       uv      : vec2<f32>,\r
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
  cloudShadowOrigin : vec2<f32>,\r
  cloudShadowExtent : f32,\r
  shadowSoftness    : f32,\r
  _pad_light        : vec2<f32>,\r
  cascadeDepthRanges: vec4<f32>,\r
}\r
\r
struct MarchParams {\r
  scattering: f32,  // Henyey-Greenstein g parameter\r
  max_steps : f32,  // stored as float, cast to u32 in the loop\r
  _pad0     : f32,\r
  _pad1     : f32,\r
}\r
\r
@group(0) @binding(0) var<uniform> camera      : CameraUniforms;\r
@group(0) @binding(1) var<uniform> light        : LightUniforms;\r
@group(0) @binding(2) var          depth_tex    : texture_depth_2d;\r
@group(0) @binding(3) var          shadow_map   : texture_depth_2d_array;\r
@group(0) @binding(4) var          shadow_samp  : sampler_comparison;\r
@group(0) @binding(5) var<uniform> march_params : MarchParams;\r
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
// Henyey-Greenstein phase function — directional forward/back scattering.\r
fn henyey_greenstein(cos_theta: f32, g: f32) -> f32 {\r
  let k = 0.0795774715459; // 1 / (4π)\r
  return k * (1.0 - g * g) / pow(max(1.0 + g * g - 2.0 * g * cos_theta, 1e-4), 1.5);\r
}\r
\r
fn reconstruct_world_pos(uv: vec2<f32>, depth: f32) -> vec3<f32> {\r
  let ndc     = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);\r
  let world_h = camera.invViewProj * ndc;\r
  return world_h.xyz / world_h.w;\r
}\r
\r
fn select_cascade(view_depth: f32) -> u32 {\r
  for (var i = 0u; i < light.cascadeCount; i++) {\r
    if (view_depth < light.cascadeSplits[i]) { return i; }\r
  }\r
  return light.cascadeCount - 1u;\r
}\r
\r
fn shadow_at(world_pos: vec3<f32>) -> f32 {\r
  if (light.shadowsEnabled == 0u) { return 1.0; }\r
  let view_pos   = camera.view * vec4<f32>(world_pos, 1.0);\r
  let view_depth = -view_pos.z;\r
  let cascade    = select_cascade(view_depth);\r
\r
  let ls  = light.cascadeMatrices[cascade] * vec4<f32>(world_pos, 1.0);\r
  var sc  = ls.xyz / ls.w;\r
  sc      = vec3<f32>(sc.xy * 0.5 + 0.5, sc.z);\r
  sc.y    = 1.0 - sc.y;\r
  if (any(sc.xy < vec2<f32>(0.0)) || any(sc.xy > vec2<f32>(1.0)) || sc.z > 1.0) {\r
    return 1.0;\r
  }\r
  return textureSampleCompareLevel(shadow_map, shadow_samp, sc.xy, i32(cascade), sc.z - 0.005);\r
}\r
\r
// Interleaved gradient noise for dithering the ray start offset.\r
fn dither(uv: vec2<f32>) -> f32 {\r
  return fract(sin(dot(uv, vec2<f32>(41.0, 289.0))) * 45758.5453);\r
}\r
\r
@fragment\r
fn fs_march(in: VertexOutput) -> @location(0) vec4<f32> {\r
  // textureLoad avoids the depth+filtering-sampler restriction; depth textures\r
  // may only be sampled via comparison or textureLoad, not a regular sampler.\r
  let depth_size = vec2<i32>(textureDimensions(depth_tex));\r
  let coord      = clamp(vec2<i32>(in.uv * vec2<f32>(depth_size)),\r
                         vec2<i32>(0), depth_size - vec2<i32>(1));\r
  let depth = textureLoad(depth_tex, coord, 0u);\r
  if (depth >= 1.0) { return vec4<f32>(0.0); } // sky pixel — skip\r
\r
  let world_pos = reconstruct_world_pos(in.uv, depth);\r
  let ray_vec   = world_pos - camera.position;\r
  let ray_len   = length(ray_vec);\r
  let ray_dir   = ray_vec / max(ray_len, 0.001);\r
\r
  let steps     = u32(march_params.max_steps);\r
  let step_len  = ray_len / f32(steps);\r
  let dith      = dither(in.uv) * step_len; // jitter to avoid banding\r
  var pos       = camera.position + ray_dir * dith;\r
\r
  let sun_dir   = normalize(-light.direction);\r
  let cos_theta = dot(ray_dir, sun_dir);\r
  let phase     = henyey_greenstein(cos_theta, march_params.scattering);\r
\r
  var accum = 0.0;\r
  for (var i = 0u; i < steps; i++) {\r
    accum += phase * shadow_at(pos);\r
    pos   += ray_dir * step_len;\r
  }\r
\r
  let fog = clamp(accum / f32(steps), 0.0, 1.0);\r
  return vec4<f32>(fog, 0.0, 0.0, 1.0);\r
}\r
`,Ui=`// godray_composite.wgsl — Blur and composite passes for volumetric godrays.\r
//\r
// fs_blur: bilateral depth-aware Gaussian blur of the half-res fog texture\r
//          (run twice — horizontal then vertical — using the blur_dir uniform).\r
//\r
// fs_composite: depth-aware upsampling from half-res fog to full-res, followed\r
//               by an additive blend of (fog × sun color × sun intensity) onto\r
//               the HDR render target.  Uses pipeline blend state (one+one) so\r
//               the fragment only needs to output the additive contribution.\r
//\r
// Bindings 0-3 are used by both entry points; binding 4 (light) is composite-only.\r
// With layout:'auto' each pipeline derives its own BGL from the entry point's\r
// static usage, so blur and composite bind groups can be created independently.\r
\r
struct VertexOutput {\r
  @builtin(position) clip_pos: vec4<f32>,\r
  @location(0)       uv      : vec2<f32>,\r
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
  cloudShadowOrigin : vec2<f32>,\r
  cloudShadowExtent : f32,\r
  shadowSoftness    : f32,\r
  _pad_light        : vec2<f32>,\r
  cascadeDepthRanges: vec4<f32>,\r
}\r
\r
// Shared by blur and composite — blur uses blur_dir, composite uses fog_curve.\r
struct Params {\r
  blur_dir  : vec2<f32>,  // (1,0) for horizontal, (0,1) for vertical; ignored by composite\r
  fog_curve : f32,        // power applied to fog before compositing; ignored by blur\r
  _pad      : f32,\r
}\r
\r
@group(0) @binding(0) var          fog_tex  : texture_2d<f32>;\r
@group(0) @binding(1) var          depth_tex: texture_depth_2d;\r
@group(0) @binding(2) var          samp     : sampler;\r
@group(0) @binding(3) var<uniform> params   : Params;\r
@group(0) @binding(4) var<uniform> light    : LightUniforms; // composite only\r
\r
fn depth_load(uv: vec2<f32>) -> f32 {\r
  let size  = vec2<i32>(textureDimensions(depth_tex));\r
  let coord = clamp(vec2<i32>(uv * vec2<f32>(size)), vec2<i32>(0), size - vec2<i32>(1));\r
  return textureLoad(depth_tex, coord, 0u);\r
}\r
\r
// Gaussian half-kernel (centre..edge, index = abs(tap offset)).\r
// Sum of symmetric 7-tap (±3) with these weights ≈ 1.\r
const GAUSS: array<f32, 4> = array<f32, 4>(\r
  0.19638062, 0.17469900, 0.12161760, 0.06706740,\r
);\r
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
// ---- Blur pass ---------------------------------------------------------------\r
\r
@fragment\r
fn fs_blur(in: VertexOutput) -> @location(0) vec4<f32> {\r
  // Step size in UV space: one fog texel in the blur direction.\r
  let texel  = 1.0 / vec2<f32>(textureDimensions(fog_tex));\r
  let step   = params.blur_dir * texel;\r
  let depth0 = depth_load(in.uv);\r
\r
  var accum  = 0.0;\r
  var weight = 0.0;\r
  for (var i: i32 = -3; i <= 3; i++) {\r
    let uv_off  = in.uv + step * f32(i);\r
    let depth_s = depth_load(uv_off);\r
    let fog_s   = textureSampleLevel(fog_tex,   samp, uv_off, 0.0).r;\r
    // Depth-aware bilateral weight: suppress blur across depth discontinuities.\r
    let d_wt  = exp(-abs(depth_s - depth0) * 1000.0);\r
    let w     = GAUSS[abs(i)] * d_wt;\r
    accum  += w * fog_s;\r
    weight += w;\r
  }\r
  return vec4<f32>(accum / max(weight, 1e-5), 0.0, 0.0, 1.0);\r
}\r
\r
// ---- Composite pass ----------------------------------------------------------\r
\r
@fragment\r
fn fs_composite(in: VertexOutput) -> @location(0) vec4<f32> {\r
  let depth0 = depth_load(in.uv);\r
  if (depth0 >= 1.0) { return vec4<f32>(0.0); } // sky — no godray contribution\r
\r
  // Depth-aware upsampling: among the four half-res neighbours, pick the one\r
  // whose depth is closest to this full-res pixel to avoid bleeding across edges.\r
  let fog_texel = 1.0 / vec2<f32>(textureDimensions(fog_tex));\r
\r
  let d1 = depth_load(in.uv + vec2<f32>( fog_texel.x, 0.0));\r
  let d2 = depth_load(in.uv + vec2<f32>(-fog_texel.x, 0.0));\r
  let d3 = depth_load(in.uv + vec2<f32>(0.0,  fog_texel.y));\r
  let d4 = depth_load(in.uv + vec2<f32>(0.0, -fog_texel.y));\r
\r
  let e1 = abs(depth0 - d1); let e2 = abs(depth0 - d2);\r
  let e3 = abs(depth0 - d3); let e4 = abs(depth0 - d4);\r
  let dmin = min(min(e1, e2), min(e3, e4));\r
\r
  var offset = vec2<f32>(0.0);\r
  if      (dmin == e1) { offset = vec2<f32>( fog_texel.x, 0.0); }\r
  else if (dmin == e2) { offset = vec2<f32>(-fog_texel.x, 0.0); }\r
  else if (dmin == e3) { offset = vec2<f32>(0.0,  fog_texel.y); }\r
  else if (dmin == e4) { offset = vec2<f32>(0.0, -fog_texel.y); }\r
\r
  var fog = textureSampleLevel(fog_tex, samp, in.uv + offset, 0.0).r;\r
  fog = pow(max(fog, 0.0), params.fog_curve);\r
\r
  // Fade godrays at night by scaling with the sun's above-horizon factor.\r
  let horizon_fade = smoothstep(-0.05, 0.05, -light.direction.y);\r
  let fog_color    = light.color * light.intensity * fog * horizon_fade;\r
\r
  // Written additively onto the HDR buffer via one+one blend state.\r
  return vec4<f32>(fog_color, 0.0);\r
}\r
`,Ze=Q,ut=16;class sr extends he{constructor(e,t,n,i,o,a,s,c,u,p,f,h,m,_,w,v,x){super();l(this,"name","GodrayPass");l(this,"scattering",.3);l(this,"fogCurve",2);l(this,"maxSteps",16);l(this,"_fogA");l(this,"_fogB");l(this,"_fogAView");l(this,"_fogBView");l(this,"_hdrView");l(this,"_marchPipeline");l(this,"_blurHPipeline");l(this,"_blurVPipeline");l(this,"_compositePipeline");l(this,"_marchBG");l(this,"_blurHBG");l(this,"_blurVBG");l(this,"_compositeBG");l(this,"_marchParamsBuf");l(this,"_blurHParamsBuf");l(this,"_blurVParamsBuf");l(this,"_compParamsBuf");this._fogA=e,this._fogAView=t,this._fogB=n,this._fogBView=i,this._hdrView=o,this._marchPipeline=a,this._blurHPipeline=s,this._blurVPipeline=c,this._compositePipeline=u,this._marchBG=p,this._blurHBG=f,this._blurVBG=h,this._compositeBG=m,this._marchParamsBuf=_,this._blurHParamsBuf=w,this._blurVParamsBuf=v,this._compParamsBuf=x}static create(e,t,n,i,o,a){const{device:s,width:c,height:u}=e,p=Math.max(1,c>>1),f=Math.max(1,u>>1),h=s.createTexture({label:"GodrayFogA",size:{width:p,height:f},format:Ze,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),m=s.createTexture({label:"GodrayFogB",size:{width:p,height:f},format:Ze,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),_=h.createView(),w=m.createView(),v=s.createSampler({label:"GodraySampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),x=s.createSampler({label:"GodrayCmpSampler",compare:"less-equal",magFilter:"linear",minFilter:"linear"}),B=s.createBuffer({label:"GodrayMarchParams",size:ut,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});s.queue.writeBuffer(B,0,new Float32Array([.3,16,0,0]).buffer);const G=s.createBuffer({label:"GodrayBlurHParams",size:ut,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});s.queue.writeBuffer(G,0,new Float32Array([1,0,0,0]).buffer);const S=s.createBuffer({label:"GodrayBlurVParams",size:ut,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});s.queue.writeBuffer(S,0,new Float32Array([0,1,0,0]).buffer);const E=s.createBuffer({label:"GodrayCompositeParams",size:ut,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});s.queue.writeBuffer(E,0,new Float32Array([0,0,2,0]).buffer);const M=s.createShaderModule({label:"GodrayMarchShader",code:Ei}),A=s.createRenderPipeline({label:"GodrayMarchPipeline",layout:"auto",vertex:{module:M,entryPoint:"vs_main"},fragment:{module:M,entryPoint:"fs_march",targets:[{format:Ze}]},primitive:{topology:"triangle-list"}}),R=s.createBindGroup({label:"GodrayMarchBG",layout:A.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:o}},{binding:1,resource:{buffer:a}},{binding:2,resource:t.depthView},{binding:3,resource:n.shadowMapView},{binding:4,resource:x},{binding:5,resource:{buffer:B}}]}),P=s.createShaderModule({label:"GodrayCompositeShader",code:Ui}),b=s.createRenderPipeline({label:"GodrayBlurHPipeline",layout:"auto",vertex:{module:P,entryPoint:"vs_main"},fragment:{module:P,entryPoint:"fs_blur",targets:[{format:Ze}]},primitive:{topology:"triangle-list"}}),C=s.createRenderPipeline({label:"GodrayBlurVPipeline",layout:"auto",vertex:{module:P,entryPoint:"vs_main"},fragment:{module:P,entryPoint:"fs_blur",targets:[{format:Ze}]},primitive:{topology:"triangle-list"}}),g=s.createRenderPipeline({label:"GodrayCompositePipeline",layout:"auto",vertex:{module:P,entryPoint:"vs_main"},fragment:{module:P,entryPoint:"fs_composite",targets:[{format:Q,blend:{color:{operation:"add",srcFactor:"one",dstFactor:"one"},alpha:{operation:"add",srcFactor:"one",dstFactor:"one"}}}]},primitive:{topology:"triangle-list"}}),T=s.createBindGroup({label:"GodrayBlurHBG",layout:b.getBindGroupLayout(0),entries:[{binding:0,resource:_},{binding:1,resource:t.depthView},{binding:2,resource:v},{binding:3,resource:{buffer:G}}]}),y=s.createBindGroup({label:"GodrayBlurVBG",layout:C.getBindGroupLayout(0),entries:[{binding:0,resource:w},{binding:1,resource:t.depthView},{binding:2,resource:v},{binding:3,resource:{buffer:S}}]}),U=s.createBindGroup({label:"GodrayCompositeBG",layout:g.getBindGroupLayout(0),entries:[{binding:0,resource:_},{binding:1,resource:t.depthView},{binding:2,resource:v},{binding:3,resource:{buffer:E}},{binding:4,resource:{buffer:a}}]});return new sr(h,_,m,w,i,A,b,C,g,R,T,y,U,B,G,S,E)}updateParams(e){e.queue.writeBuffer(this._marchParamsBuf,0,new Float32Array([this.scattering,this.maxSteps,0,0]).buffer),e.queue.writeBuffer(this._compParamsBuf,0,new Float32Array([0,0,this.fogCurve,0]).buffer)}execute(e,t){const n=(i,o,a,s,c=!0)=>{const u=e.beginRenderPass({label:i,colorAttachments:[{view:o,clearValue:[0,0,0,0],loadOp:c?"clear":"load",storeOp:"store"}]});u.setPipeline(a),u.setBindGroup(0,s),u.draw(3),u.end()};n("GodrayMarch",this._fogAView,this._marchPipeline,this._marchBG),n("GodrayBlurH",this._fogBView,this._blurHPipeline,this._blurHBG),n("GodrayBlurV",this._fogAView,this._blurVPipeline,this._blurVBG),n("GodrayComposite",this._hdrView,this._compositePipeline,this._compositeBG,!1)}destroy(){this._fogA.destroy(),this._fogB.destroy(),this._marchParamsBuf.destroy(),this._blurHParamsBuf.destroy(),this._blurVParamsBuf.destroy(),this._compParamsBuf.destroy()}}const Ci=`// composite.wgsl — Fog + Underwater + Tonemap merged into a single full-screen draw.\r
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
`,en=64,tn=96;class lr extends he{constructor(e,t,n,i,o,a){super();l(this,"name","CompositePass");l(this,"depthFogEnabled",!0);l(this,"depthDensity",1);l(this,"depthBegin",32);l(this,"depthEnd",128);l(this,"depthCurve",1.5);l(this,"heightFogEnabled",!1);l(this,"heightDensity",.7);l(this,"heightMin",48);l(this,"heightMax",80);l(this,"heightCurve",1);l(this,"fogColor",[1,1,1]);l(this,"_pipeline");l(this,"_bg0");l(this,"_bg1");l(this,"_bg2");l(this,"_paramsBuf");l(this,"_starBuf");this._pipeline=e,this._bg0=t,this._bg1=n,this._bg2=i,this._paramsBuf=o,this._starBuf=a}static create(e,t,n,i,o,a,s){const{device:c,format:u}=e,p=c.createBindGroupLayout({label:"CompositeBGL0",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),f=c.createBindGroupLayout({label:"CompositeBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),h=c.createBindGroupLayout({label:"CompositeBGL2",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),m=c.createSampler({label:"CompositeSampler",magFilter:"linear",minFilter:"linear"}),_=c.createBuffer({label:"CompositeParams",size:en,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),w=c.createBuffer({label:"CompositeStars",size:tn,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),v=c.createBindGroup({label:"CompositeBG0",layout:p,entries:[{binding:0,resource:t},{binding:1,resource:n},{binding:2,resource:i},{binding:3,resource:m}]}),x=c.createBindGroup({label:"CompositeBG1",layout:f,entries:[{binding:0,resource:{buffer:o}},{binding:1,resource:{buffer:a}}]}),B=c.createBindGroup({label:"CompositeBG2",layout:h,entries:[{binding:0,resource:{buffer:_}},{binding:1,resource:{buffer:w}},{binding:2,resource:{buffer:s}}]}),G=c.createShaderModule({label:"CompositeShader",code:Ci}),S=c.createPipelineLayout({bindGroupLayouts:[p,f,h]}),E=c.createRenderPipeline({label:"CompositePipeline",layout:S,vertex:{module:G,entryPoint:"vs_main"},fragment:{module:G,entryPoint:"fs_main",targets:[{format:u}]},primitive:{topology:"triangle-list"}});return new lr(E,v,x,B,_,w)}updateParams(e,t,n,i,o,a){const s=new ArrayBuffer(en),c=new Float32Array(s),u=new Uint32Array(s);let p=0;this.depthFogEnabled&&(p|=1),this.heightFogEnabled&&(p|=2);let f=0;i&&(f|=1),o&&(f|=2),a&&(f|=4),c[0]=this.fogColor[0],c[1]=this.fogColor[1],c[2]=this.fogColor[2],c[3]=this.depthDensity,c[4]=this.depthBegin,c[5]=this.depthEnd,c[6]=this.depthCurve,c[7]=this.heightDensity,c[8]=this.heightMin,c[9]=this.heightMax,c[10]=this.heightCurve,u[11]=p,c[12]=n,c[13]=t?1:0,u[14]=f,c[15]=0,e.queue.writeBuffer(this._paramsBuf,0,s)}updateStars(e,t,n,i){const o=new Float32Array(tn/4);o.set(t.data,0),o[16]=n.x,o[17]=n.y,o[18]=n.z,o[19]=0,o[20]=i.x,o[21]=i.y,o[22]=i.z,o[23]=0,e.queue.writeBuffer(this._starBuf,0,o.buffer)}execute(e,t){const n=e.beginRenderPass({label:"CompositePass",colorAttachments:[{view:t.getCurrentTexture().createView(),clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._bg0),n.setBindGroup(1,this._bg1),n.setBindGroup(2,this._bg2),n.draw(3),n.end()}destroy(){this._paramsBuf.destroy(),this._starBuf.destroy()}}const rn=64*4+16+16,Li=128;class cr extends he{constructor(e,t,n,i,o){super();l(this,"name","GeometryPass");l(this,"_gbuffer");l(this,"_cameraBGL");l(this,"_modelBGL");l(this,"_pipelineCache",new Map);l(this,"_cameraBuffer");l(this,"_cameraBindGroup");l(this,"_modelBuffers",[]);l(this,"_modelBindGroups",[]);l(this,"_drawItems",[]);l(this,"_modelData",new Float32Array(32));l(this,"_cameraScratch",new Float32Array(rn/4));this._gbuffer=e,this._cameraBGL=t,this._modelBGL=n,this._cameraBuffer=i,this._cameraBindGroup=o}static create(e,t){const{device:n}=e,i=n.createBindGroupLayout({label:"GeomCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),o=n.createBindGroupLayout({label:"GeomModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),a=n.createBuffer({label:"GeomCameraBuffer",size:rn,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),s=n.createBindGroup({label:"GeomCameraBindGroup",layout:i,entries:[{binding:0,resource:{buffer:a}}]});return new cr(t,i,o,a,s)}setDrawItems(e){this._drawItems=e}updateCamera(e,t,n,i,o,a,s,c){const u=this._cameraScratch;u.set(t.data,0),u.set(n.data,16),u.set(i.data,32),u.set(o.data,48),u[64]=a.x,u[65]=a.y,u[66]=a.z,u[67]=s,u[68]=c,e.queue.writeBuffer(this._cameraBuffer,0,u.buffer)}execute(e,t){var o,a;const{device:n}=t;this._ensurePerDrawBuffers(n,this._drawItems.length);for(let s=0;s<this._drawItems.length;s++){const c=this._drawItems[s],u=this._modelData;u.set(c.modelMatrix.data,0),u.set(c.normalMatrix.data,16),t.queue.writeBuffer(this._modelBuffers[s],0,u.buffer),(a=(o=c.material).update)==null||a.call(o,t.queue)}const i=e.beginRenderPass({label:"GeometryPass",colorAttachments:[{view:this._gbuffer.albedoRoughnessView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"},{view:this._gbuffer.normalMetallicView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});i.setBindGroup(0,this._cameraBindGroup);for(let s=0;s<this._drawItems.length;s++){const c=this._drawItems[s];i.setPipeline(this._getPipeline(n,c.material)),i.setBindGroup(1,this._modelBindGroups[s]),i.setBindGroup(2,c.material.getBindGroup(n)),i.setVertexBuffer(0,c.mesh.vertexBuffer),i.setIndexBuffer(c.mesh.indexBuffer,"uint32"),i.drawIndexed(c.mesh.indexCount)}i.end()}_getPipeline(e,t){let n=this._pipelineCache.get(t.shaderId);if(n)return n;const i=e.createShaderModule({label:`GeometryShader[${t.shaderId}]`,code:t.getShaderCode(Je.Geometry)});return n=e.createRenderPipeline({label:`GeometryPipeline[${t.shaderId}]`,layout:e.createPipelineLayout({bindGroupLayouts:[this._cameraBGL,this._modelBGL,t.getBindGroupLayout(e)]}),vertex:{module:i,entryPoint:"vs_main",buffers:[{arrayStride:Zt,attributes:Qt}]},fragment:{module:i,entryPoint:"fs_main",targets:[{format:"rgba8unorm"},{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),this._pipelineCache.set(t.shaderId,n),n}_ensurePerDrawBuffers(e,t){for(;this._modelBuffers.length<t;){const n=e.createBuffer({size:Li,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._modelBuffers.push(n),this._modelBindGroups.push(e.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:n}}]}))}}destroy(){this._cameraBuffer.destroy();for(const e of this._modelBuffers)e.destroy()}}const ki=`// GBuffer fill pass for voxel chunk geometry.\r
// Vertex layout: position(vec3f) + face(f32, 0-5) + blockType(f32).\r
// Writes albedo+roughness and normal+emission (same encoding as geometry.wgsl).\r
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
struct ChunkUniforms {\r
  offset    : vec3<f32>,\r
  debugMode : u32,       // 0 = normal, 1 = debug chunks with color\r
  debugColor: vec3<f32>,\r
  _pad      : f32,\r
}\r
\r
struct BlockData {\r
  sideTile  : u32,\r
  bottomTile: u32,\r
  topTile   : u32,\r
  _pad      : u32,\r
}\r
\r
@group(0) @binding(0) var<uniform>       camera      : CameraUniforms;\r
@group(1) @binding(0) var                color_atlas : texture_2d<f32>;\r
@group(1) @binding(1) var                normal_atlas: texture_2d<f32>;\r
@group(1) @binding(2) var                mer_atlas   : texture_2d<f32>;\r
@group(1) @binding(3) var                atlas_samp  : sampler;\r
@group(1) @binding(4) var<storage, read> block_data  : array<BlockData>;\r
@group(2) @binding(0) var<uniform>       chunk       : ChunkUniforms;\r
\r
const ATLAS_COLS: u32 = 25u;\r
const INV_COLS  : f32 = 1.0 / 25.0;\r
const INV_ROWS  : f32 = 1.0 / 25.0;\r
\r
// World-space face normals, indexed by face id (0=back/-Z … 5=top/+Y)\r
const FACE_NORMALS = array<vec3<f32>, 6>(\r
  vec3<f32>( 0,  0, -1),  // 0 back  -Z\r
  vec3<f32>( 0,  0,  1),  // 1 front +Z\r
  vec3<f32>(-1,  0,  0),  // 2 left  -X\r
  vec3<f32>( 1,  0,  0),  // 3 right +X\r
  vec3<f32>( 0, -1,  0),  // 4 bottom-Y\r
  vec3<f32>( 0,  1,  0),  // 5 top   +Y\r
);\r
\r
// Tangent xyz + bitangent handedness w for each face.\r
// B = cross(N, T) * w  →  TBN maps tangent-space normals to world space.\r
const FACE_TANGENTS = array<vec4<f32>, 6>(\r
  vec4<f32>( 1,  0,  0, 1),  // back\r
  vec4<f32>( 1,  0,  0, 1),  // front\r
  vec4<f32>( 0,  0,  1, 1),  // left\r
  vec4<f32>( 0,  0, -1, 1),  // right\r
  vec4<f32>( 1,  0,  0, 1),  // bottom\r
  vec4<f32>( 1,  0,  0, 1),  // top\r
);\r
\r
struct VertexInput {\r
  @location(0) position  : vec3<f32>,\r
  @location(1) face      : f32,\r
  @location(2) block_type: f32,\r
}\r
\r
struct VertexOutput {\r
  @builtin(position)              clip_pos  : vec4<f32>,\r
  @location(0)                    world_pos : vec3<f32>,\r
  @location(1)                    world_norm: vec3<f32>,\r
  @location(2)                    world_tan : vec4<f32>,\r
  @location(3) @interpolate(flat) face_f    : f32,\r
  @location(4) @interpolate(flat) block_f   : f32,\r
}\r
\r
@vertex\r
fn vs_main(vin: VertexInput) -> VertexOutput {\r
  let wp   = vin.position + chunk.offset;\r
  let face = u32(vin.face);\r
  var out: VertexOutput;\r
  out.clip_pos   = camera.viewProj * vec4<f32>(wp, 1.0);\r
  out.world_pos  = wp;\r
  out.world_norm = FACE_NORMALS[face];\r
  out.world_tan  = FACE_TANGENTS[face];\r
  out.face_f     = vin.face;\r
  out.block_f    = vin.block_type;\r
  return out;\r
}\r
\r
struct FragOutput {\r
  @location(0) albedo_roughness: vec4<f32>,\r
  @location(1) normal_emission : vec4<f32>,\r
}\r
\r
fn atlas_uv(world_pos: vec3<f32>, face: u32, block_type: u32) -> vec2<f32> {\r
  let bd = block_data[block_type];\r
  var tile: u32;\r
  if face == 4u      { tile = bd.bottomTile; }\r
  else if face == 5u { tile = bd.topTile; }\r
  else               { tile = bd.sideTile; }\r
\r
  var local_uv: vec2<f32>;\r
  if face == 2u || face == 3u {\r
    local_uv = vec2<f32>(fract(world_pos.z), 1.0 - fract(world_pos.y));\r
  } else if face == 4u || face == 5u {\r
    local_uv = fract(world_pos.xz);\r
  } else {\r
    local_uv = vec2<f32>(fract(world_pos.x), 1.0 - fract(world_pos.y));\r
  }\r
\r
  let tileX = f32(tile % ATLAS_COLS);\r
  let tileY = f32(tile / ATLAS_COLS);\r
  return (vec2<f32>(tileX, tileY) + local_uv) * vec2<f32>(INV_COLS, INV_ROWS);\r
}\r
\r
fn shade(in: VertexOutput, uv: vec2<f32>) -> FragOutput {\r
  // Debug mode: use solid chunk color\r
  if (chunk.debugMode != 0u) {\r
    let N = normalize(in.world_norm);\r
    var out: FragOutput;\r
    out.albedo_roughness = vec4<f32>(chunk.debugColor, 0.8);\r
    out.normal_emission  = vec4<f32>(N * 0.5 + 0.5, 0.0);\r
    return out;\r
  }\r
\r
  let albedo_samp = textureSample(color_atlas,  atlas_samp, uv);\r
  let mer         = textureSample(mer_atlas,     atlas_samp, uv);\r
  let n_ts        = textureSample(normal_atlas,  atlas_samp, uv).rgb * 2.0 - 1.0;\r
\r
  let N       = normalize(in.world_norm);\r
  let T       = normalize(in.world_tan.xyz);\r
  let T_ortho = normalize(T - N * dot(T, N));\r
  let B       = cross(N, T_ortho) * in.world_tan.w;\r
  let tbn     = mat3x3<f32>(T_ortho, B, N);\r
  let mapped_N = normalize(tbn * n_ts);\r
\r
  // Darken snow blocks for HDR displays (BlockType.SNOW = 17, GRASS_SNOW = 18, SNOWYLEAVES = 23)\r
  let block_type = u32(in.block_f);\r
  var albedo_scale = 1.0;\r
  if (block_type == 17u || block_type == 18u || block_type == 23u) {\r
    albedo_scale = 0.70;\r
  }\r
\r
  var out: FragOutput;\r
  out.albedo_roughness = vec4<f32>(albedo_samp.rgb * albedo_scale, mer.b);\r
  out.normal_emission  = vec4<f32>(mapped_N * 0.5 + 0.5, mer.g);\r
  return out;\r
}\r
\r
@fragment\r
fn fs_opaque(in: VertexOutput) -> FragOutput {\r
  let uv = atlas_uv(in.world_pos, u32(in.face_f), u32(in.block_f));\r
  if textureSample(color_atlas, atlas_samp, uv).a < 0.5 { discard; }\r
  return shade(in, uv);\r
}\r
\r
@fragment\r
fn fs_transparent(in: VertexOutput) -> FragOutput {\r
  let uv = atlas_uv(in.world_pos, u32(in.face_f), u32(in.block_f));\r
  if textureSample(color_atlas, atlas_samp, uv).a < 0.5 { discard; }\r
  return shade(in, uv);\r
}\r
\r
// ---- Prop billboard -------------------------------------------------------\r
\r
struct PropVertexOutput {\r
  @builtin(position)              clip_pos : vec4<f32>,\r
  @location(0)                    world_pos: vec3<f32>,\r
  @location(1)                    uv       : vec2<f32>,\r
  @location(2) @interpolate(flat) block_f  : f32,\r
  @location(3)                    face_norm: vec3<f32>,\r
}\r
\r
fn billboard_offset(vid: u32) -> vec2<f32> {\r
  switch vid % 6u {\r
    case 0u: { return vec2<f32>(-0.5, -0.5); }\r
    case 1u: { return vec2<f32>( 0.5, -0.5); }\r
    case 2u: { return vec2<f32>(-0.5,  0.5); }\r
    case 3u: { return vec2<f32>( 0.5, -0.5); }\r
    case 4u: { return vec2<f32>( 0.5,  0.5); }\r
    default: { return vec2<f32>(-0.5,  0.5); }\r
  }\r
}\r
\r
fn billboard_uv(vid: u32) -> vec2<f32> {\r
  switch vid % 6u {\r
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
fn vs_prop(vin: VertexInput, @builtin(vertex_index) vid: u32) -> PropVertexOutput {\r
  let center = vin.position + chunk.offset;\r
\r
  // Camera right and up from the view matrix rows (column-major storage).\r
  let cam_right = vec3<f32>(camera.view[0].x, camera.view[1].x, camera.view[2].x);\r
  let cam_up    = vec3<f32>(camera.view[0].y, camera.view[1].y, camera.view[2].y);\r
\r
  let off = billboard_offset(vid);\r
  let wp  = center + cam_right * off.x + cam_up * off.y;\r
\r
  var out: PropVertexOutput;\r
  out.clip_pos  = camera.viewProj * vec4<f32>(wp, 1.0);\r
  out.world_pos = wp;\r
  out.uv        = billboard_uv(vid);\r
  out.block_f   = vin.block_type;\r
  out.face_norm = normalize(camera.position - center);\r
  return out;\r
}\r
\r
@fragment\r
fn fs_prop(in: PropVertexOutput) -> FragOutput {\r
  let tile  = block_data[u32(in.block_f)].sideTile;\r
  let tileX = f32(tile % ATLAS_COLS);\r
  let tileY = f32(tile / ATLAS_COLS);\r
  let uv    = (vec2<f32>(tileX, tileY) + in.uv) * vec2<f32>(INV_COLS, INV_ROWS);\r
\r
  let albedo_samp = textureSample(color_atlas, atlas_samp, uv);\r
  if albedo_samp.a < 0.5 { discard; }\r
\r
  let mer = textureSample(mer_atlas, atlas_samp, uv);\r
  let N   = normalize(in.face_norm);\r
\r
  var out: FragOutput;\r
  out.albedo_roughness = vec4<f32>(albedo_samp.rgb, mer.b);\r
  out.normal_emission  = vec4<f32>(N * 0.5 + 0.5, mer.g);\r
  return out;\r
}\r
`,nn=64*4+16+16,Ni=16,Qe=256,Ri=2048,Ii=5,De=Ii*4,Vt=16;class ur extends he{constructor(e,t,n,i,o,a,s,c,u,p){super();l(this,"name","WorldGeometryPass");l(this,"_gbuffer");l(this,"_device");l(this,"_opaquePipeline");l(this,"_transparentPipeline");l(this,"_propPipeline");l(this,"_cameraBuffer");l(this,"_cameraBindGroup");l(this,"_sharedBindGroup");l(this,"_chunkUniformBuffer");l(this,"_chunkBindGroup");l(this,"_slotFreeList",[]);l(this,"_slotHighWater",0);l(this,"_chunks",new Map);l(this,"_frustumPlanes",new Float32Array(24));l(this,"drawCalls",0);l(this,"triangles",0);l(this,"_cameraData",new Float32Array(nn/4));l(this,"_debugChunks",!1);this._device=e,this._gbuffer=t,this._opaquePipeline=n,this._transparentPipeline=i,this._propPipeline=o,this._cameraBuffer=a,this._cameraBindGroup=s,this._sharedBindGroup=c,this._chunkUniformBuffer=u,this._chunkBindGroup=p}static create(e,t,n){const{device:i}=e,o=i.createBindGroupLayout({label:"ChunkCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),a=i.createBindGroupLayout({label:"ChunkSharedBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),s=i.createBindGroupLayout({label:"ChunkOffsetBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform",hasDynamicOffset:!0,minBindingSize:32}}]}),c=L.MAX,u=i.createBuffer({label:"BlockDataBuffer",size:Math.max(c*Ni,16),usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),p=Un,f=new Uint32Array(c*4);for(let P=0;P<c;P++){const b=At[P];b&&(f[P*4+0]=b.sideFace.y*p+b.sideFace.x,f[P*4+1]=b.bottomFace.y*p+b.bottomFace.x,f[P*4+2]=b.topFace.y*p+b.topFace.x)}i.queue.writeBuffer(u,0,f);const h=i.createSampler({label:"ChunkAtlasSampler",magFilter:"nearest",minFilter:"nearest",addressModeU:"repeat",addressModeV:"repeat"}),m=i.createBindGroup({label:"ChunkSharedBG",layout:a,entries:[{binding:0,resource:n.colorAtlas.view},{binding:1,resource:n.normalAtlas.view},{binding:2,resource:n.merAtlas.view},{binding:3,resource:h},{binding:4,resource:{buffer:u}}]}),_=i.createBuffer({label:"ChunkCameraBuffer",size:nn,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),w=i.createBindGroup({label:"ChunkCameraBG",layout:o,entries:[{binding:0,resource:{buffer:_}}]}),v=i.createShaderModule({label:"ChunkGeometryShader",code:ki}),x=i.createPipelineLayout({bindGroupLayouts:[o,a,s]}),B={arrayStride:De,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32"},{shaderLocation:2,offset:16,format:"float32"}]},G=[{format:"rgba8unorm"},{format:"rgba16float"}],S=i.createRenderPipeline({label:"ChunkOpaquePipeline",layout:x,vertex:{module:v,entryPoint:"vs_main",buffers:[B]},fragment:{module:v,entryPoint:"fs_opaque",targets:G},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),E=i.createRenderPipeline({label:"ChunkTransparentPipeline",layout:x,vertex:{module:v,entryPoint:"vs_main",buffers:[B]},fragment:{module:v,entryPoint:"fs_transparent",targets:G},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),M=i.createRenderPipeline({label:"ChunkPropPipeline",layout:x,vertex:{module:v,entryPoint:"vs_prop",buffers:[B]},fragment:{module:v,entryPoint:"fs_prop",targets:G},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}}),A=i.createBuffer({label:"ChunkUniformBuffer",size:Ri*Qe,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),R=i.createBindGroup({label:"ChunkOffsetBG",layout:s,entries:[{binding:0,resource:{buffer:A,size:32}}]});return new ur(i,t,S,E,M,_,w,m,A,R)}updateGBuffer(e){this._gbuffer=e}addChunk(e,t){const n=this._chunks.get(e);n?this._replaceMeshBuffers(n,t):this._chunks.set(e,this._createChunkGpu(e,t))}updateChunk(e,t){const n=this._chunks.get(e);n?this._replaceMeshBuffers(n,t):this._chunks.set(e,this._createChunkGpu(e,t))}removeChunk(e){var n,i,o;const t=this._chunks.get(e);t&&((n=t.opaqueBuffer)==null||n.destroy(),(i=t.transparentBuffer)==null||i.destroy(),(o=t.propBuffer)==null||o.destroy(),this._freeSlot(t.slot),this._chunks.delete(e))}updateCamera(e,t,n,i,o,a,s,c){const u=this._cameraData;u.set(t.data,0),u.set(n.data,16),u.set(i.data,32),u.set(o.data,48),u[64]=a.x,u[65]=a.y,u[66]=a.z,u[67]=s,u[68]=c,e.queue.writeBuffer(this._cameraBuffer,0,u.buffer),this._extractFrustumPlanes(i.data)}_extractFrustumPlanes(e){const t=this._frustumPlanes;t[0]=e[3]+e[0],t[1]=e[7]+e[4],t[2]=e[11]+e[8],t[3]=e[15]+e[12],t[4]=e[3]-e[0],t[5]=e[7]-e[4],t[6]=e[11]-e[8],t[7]=e[15]-e[12],t[8]=e[3]+e[1],t[9]=e[7]+e[5],t[10]=e[11]+e[9],t[11]=e[15]+e[13],t[12]=e[3]-e[1],t[13]=e[7]-e[5],t[14]=e[11]-e[9],t[15]=e[15]-e[13],t[16]=e[2],t[17]=e[6],t[18]=e[10],t[19]=e[14],t[20]=e[3]-e[2],t[21]=e[7]-e[6],t[22]=e[11]-e[10],t[23]=e[15]-e[14]}setDebugChunks(e){if(this._debugChunks!==e){this._debugChunks=e;for(const[t,n]of this._chunks)this._writeChunkUniforms(n.slot,n.ox,n.oy,n.oz)}}_isVisible(e,t,n){const i=this._frustumPlanes,o=e+Vt,a=t+Vt,s=n+Vt;for(let c=0;c<6;c++){const u=i[c*4],p=i[c*4+1],f=i[c*4+2],h=i[c*4+3];if(u*(u>=0?o:e)+p*(p>=0?a:t)+f*(f>=0?s:n)+h<0)return!1}return!0}execute(e,t){const n=e.beginRenderPass({label:"WorldGeometryPass",colorAttachments:[{view:this._gbuffer.albedoRoughnessView,loadOp:"load",storeOp:"store"},{view:this._gbuffer.normalMetallicView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthLoadOp:"load",depthStoreOp:"store"}});n.setBindGroup(0,this._cameraBindGroup),n.setBindGroup(1,this._sharedBindGroup);let i=0,o=0;const a=[];for(const s of this._chunks.values())this._isVisible(s.ox,s.oy,s.oz)&&a.push(s);n.setPipeline(this._opaquePipeline);for(const s of a)s.opaqueBuffer&&s.opaqueCount>0&&(n.setBindGroup(2,this._chunkBindGroup,[s.slot*Qe]),n.setVertexBuffer(0,s.opaqueBuffer),n.draw(s.opaqueCount),i++,o+=s.opaqueCount/3);n.setPipeline(this._transparentPipeline);for(const s of a)s.transparentBuffer&&s.transparentCount>0&&(n.setBindGroup(2,this._chunkBindGroup,[s.slot*Qe]),n.setVertexBuffer(0,s.transparentBuffer),n.draw(s.transparentCount),i++,o+=s.transparentCount/3);n.setPipeline(this._propPipeline);for(const s of a)s.propBuffer&&s.propCount>0&&(n.setBindGroup(2,this._chunkBindGroup,[s.slot*Qe]),n.setVertexBuffer(0,s.propBuffer),n.draw(s.propCount),i++,o+=s.propCount/3);this.drawCalls=i,this.triangles=o,n.end()}destroy(){var e,t,n;this._cameraBuffer.destroy(),this._chunkUniformBuffer.destroy();for(const i of this._chunks.values())(e=i.opaqueBuffer)==null||e.destroy(),(t=i.transparentBuffer)==null||t.destroy(),(n=i.propBuffer)==null||n.destroy();this._chunks.clear()}_allocSlot(){return this._slotFreeList.length>0?this._slotFreeList.pop():this._slotHighWater++}_freeSlot(e){this._slotFreeList.push(e)}_writeChunkUniforms(e,t,n,i){const o=t*73856093^n*19349663^i*83492791,a=(o&255)/255*.6+.4,s=(o>>8&255)/255*.6+.4,c=(o>>16&255)/255*.6+.4,u=new ArrayBuffer(32),p=new Float32Array(u),f=new Uint32Array(u);p[0]=t,p[1]=n,p[2]=i,f[3]=this._debugChunks?1:0,p[4]=a,p[5]=s,p[6]=c,p[7]=0,this._device.queue.writeBuffer(this._chunkUniformBuffer,e*Qe,u)}_createChunkGpu(e,t){const n=this._allocSlot();this._writeChunkUniforms(n,e.globalPosition.x,e.globalPosition.y,e.globalPosition.z);const i={ox:e.globalPosition.x,oy:e.globalPosition.y,oz:e.globalPosition.z,slot:n,opaqueBuffer:null,opaqueCount:0,transparentBuffer:null,transparentCount:0,propBuffer:null,propCount:0};return this._replaceMeshBuffers(i,t),i}_replaceMeshBuffers(e,t){var n,i,o;if((n=e.opaqueBuffer)==null||n.destroy(),(i=e.transparentBuffer)==null||i.destroy(),(o=e.propBuffer)==null||o.destroy(),e.opaqueBuffer=null,e.transparentBuffer=null,e.propBuffer=null,e.opaqueCount=t.opaqueCount,e.transparentCount=t.transparentCount,e.propCount=t.propCount,t.opaqueCount>0){const a=this._device.createBuffer({label:"ChunkOpaqueBuf",size:t.opaqueCount*De,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.opaque.buffer,0,t.opaqueCount*De),e.opaqueBuffer=a}if(t.transparentCount>0){const a=this._device.createBuffer({label:"ChunkTransparentBuf",size:t.transparentCount*De,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.transparent.buffer,0,t.transparentCount*De),e.transparentBuffer=a}if(t.propCount>0){const a=this._device.createBuffer({label:"ChunkPropBuf",size:t.propCount*De,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.prop.buffer,0,t.propCount*De),e.propBuffer=a}}}const Oi=`// Depth of Field: prefilter (CoC + 2x downsample) then fused disc-blur + composite.\r
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
`,Vi=32;class dr extends he{constructor(e,t,n,i,o,a,s,c,u,p){super();l(this,"name","DofPass");l(this,"resultView");l(this,"_result");l(this,"_half");l(this,"_halfView");l(this,"_prefilterPipeline");l(this,"_compositePipeline");l(this,"_uniformBuffer");l(this,"_prefilterBG");l(this,"_compBG0");l(this,"_compBG1");this._result=e,this.resultView=t,this._half=n,this._halfView=i,this._prefilterPipeline=o,this._compositePipeline=a,this._uniformBuffer=s,this._prefilterBG=c,this._compBG0=u,this._compBG1=p}static create(e,t,n){const{device:i,width:o,height:a}=e,s=Math.max(1,o>>1),c=Math.max(1,a>>1),u=i.createTexture({label:"DofHalf",size:{width:s,height:c},format:Q,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),p=i.createTexture({label:"DofResult",size:{width:o,height:a},format:Q,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),f=u.createView(),h=p.createView(),m=i.createBuffer({label:"DofUniforms",size:Vi,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});i.queue.writeBuffer(m,0,new Float32Array([30,60,6,.1,1e3,0,0,0]).buffer);const _=i.createSampler({label:"DofSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),w=i.createBindGroupLayout({label:"DofBGL0Prefilter",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),v=i.createBindGroupLayout({label:"DofBGL0Composite",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),x=i.createBindGroupLayout({label:"DofBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),B=i.createShaderModule({label:"DofShader",code:Oi}),G=i.createRenderPipeline({label:"DofPrefilterPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[w]}),vertex:{module:B,entryPoint:"vs_main"},fragment:{module:B,entryPoint:"fs_prefilter",targets:[{format:Q}]},primitive:{topology:"triangle-list"}}),S=i.createRenderPipeline({label:"DofCompositePipeline",layout:i.createPipelineLayout({bindGroupLayouts:[v,x]}),vertex:{module:B,entryPoint:"vs_main"},fragment:{module:B,entryPoint:"fs_composite",targets:[{format:Q}]},primitive:{topology:"triangle-list"}}),E=i.createBindGroup({label:"DofPrefilterBG",layout:w,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:t},{binding:2,resource:n},{binding:3,resource:_}]}),M=i.createBindGroup({label:"DofCompBG0",layout:v,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:t},{binding:3,resource:_}]}),A=i.createBindGroup({label:"DofCompBG1",layout:x,entries:[{binding:0,resource:f}]});return new dr(p,h,u,f,G,S,m,E,M,A)}updateParams(e,t=30,n=60,i=6,o=.1,a=1e3,s=1){e.device.queue.writeBuffer(this._uniformBuffer,0,new Float32Array([t,n,i,o,a,s,0,0]).buffer)}execute(e,t){{const n=e.beginRenderPass({label:"DofPrefilter",colorAttachments:[{view:this._halfView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._prefilterPipeline),n.setBindGroup(0,this._prefilterBG),n.draw(3),n.end()}{const n=e.beginRenderPass({label:"DofComposite",colorAttachments:[{view:this.resultView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._compositePipeline),n.setBindGroup(0,this._compBG0),n.setBindGroup(1,this._compBG1),n.draw(3),n.end()}}destroy(){this._result.destroy(),this._half.destroy(),this._uniformBuffer.destroy()}}const Di=`// SSAO: hemisphere sampling in view space.\r
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
`,zi=`// SSAO blur: 4×4 box blur to smooth raw SSAO output.\r
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
`,dt="r8unorm",Dt=16,Fi=464;function Hi(){const d=new Float32Array(Dt*4);for(let r=0;r<Dt;r++){const e=Math.random(),t=Math.random()*Math.PI*2,n=Math.sqrt(1-e*e),i=.1+.9*(r/Dt)**2;d[r*4+0]=n*Math.cos(t)*i,d[r*4+1]=n*Math.sin(t)*i,d[r*4+2]=e*i,d[r*4+3]=0}return d}function Wi(){const d=new Uint8Array(64);for(let r=0;r<16;r++){const e=Math.random()*Math.PI*2;d[r*4+0]=Math.round((Math.cos(e)*.5+.5)*255),d[r*4+1]=Math.round((Math.sin(e)*.5+.5)*255),d[r*4+2]=128,d[r*4+3]=255}return d}class fr extends he{constructor(e,t,n,i,o,a,s,c,u,p,f){super();l(this,"name","SSAOPass");l(this,"aoView");l(this,"_raw");l(this,"_blurred");l(this,"_rawView");l(this,"_ssaoPipeline");l(this,"_blurPipeline");l(this,"_uniformBuffer");l(this,"_noiseTex");l(this,"_ssaoBG0");l(this,"_ssaoBG1");l(this,"_blurBG");this._raw=e,this._rawView=t,this._blurred=n,this.aoView=i,this._ssaoPipeline=o,this._blurPipeline=a,this._uniformBuffer=s,this._noiseTex=c,this._ssaoBG0=u,this._ssaoBG1=p,this._blurBG=f}static create(e,t){const{device:n,width:i,height:o}=e,a=Math.max(1,i>>1),s=Math.max(1,o>>1),c=n.createTexture({label:"SsaoRaw",size:{width:a,height:s},format:dt,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),u=n.createTexture({label:"SsaoBlurred",size:{width:a,height:s},format:dt,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),p=c.createView(),f=u.createView(),h=n.createTexture({label:"SsaoNoise",size:{width:4,height:4},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});n.queue.writeTexture({texture:h},Wi().buffer,{bytesPerRow:4*4,rowsPerImage:4},{width:4,height:4});const m=h.createView(),_=n.createBuffer({label:"SsaoUniforms",size:Fi,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});n.queue.writeBuffer(_,208,Hi().buffer),n.queue.writeBuffer(_,192,new Float32Array([1,.005,2,0]).buffer);const w=n.createSampler({label:"SsaoBlurSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),v=n.createBindGroupLayout({label:"SsaoBGL0",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),x=n.createBindGroupLayout({label:"SsaoBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),B=n.createBindGroupLayout({label:"SsaoBlurBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),G=n.createShaderModule({label:"SsaoShader",code:Di}),S=n.createShaderModule({label:"SsaoBlurShader",code:zi}),E=n.createRenderPipeline({label:"SsaoPipeline",layout:n.createPipelineLayout({bindGroupLayouts:[v,x]}),vertex:{module:G,entryPoint:"vs_main"},fragment:{module:G,entryPoint:"fs_ssao",targets:[{format:dt}]},primitive:{topology:"triangle-list"}}),M=n.createRenderPipeline({label:"SsaoBlurPipeline",layout:n.createPipelineLayout({bindGroupLayouts:[B]}),vertex:{module:S,entryPoint:"vs_main"},fragment:{module:S,entryPoint:"fs_blur",targets:[{format:dt}]},primitive:{topology:"triangle-list"}}),A=n.createBindGroup({label:"SsaoBG0",layout:v,entries:[{binding:0,resource:{buffer:_}}]}),R=n.createBindGroup({label:"SsaoBG1",layout:x,entries:[{binding:0,resource:t.normalMetallicView},{binding:1,resource:t.depthView},{binding:2,resource:m}]}),P=n.createBindGroup({label:"SsaoBlurBG",layout:B,entries:[{binding:0,resource:p},{binding:1,resource:w}]});return new fr(c,p,u,f,E,M,_,h,A,R,P)}updateCamera(e,t,n,i){const o=new Float32Array(48);o.set(t.data,0),o.set(n.data,16),o.set(i.data,32),e.device.queue.writeBuffer(this._uniformBuffer,0,o.buffer)}updateParams(e,t=1,n=.005,i=2){e.device.queue.writeBuffer(this._uniformBuffer,192,new Float32Array([t,n,i,0]).buffer)}execute(e,t){{const n=e.beginRenderPass({label:"SSAOPass",colorAttachments:[{view:this._rawView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._ssaoPipeline),n.setBindGroup(0,this._ssaoBG0),n.setBindGroup(1,this._ssaoBG1),n.draw(3),n.end()}{const n=e.beginRenderPass({label:"SSAOBlur",colorAttachments:[{view:this.aoView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._blurPipeline),n.setBindGroup(0,this._blurBG),n.draw(3),n.end()}}destroy(){this._raw.destroy(),this._blurred.destroy(),this._uniformBuffer.destroy(),this._noiseTex.destroy()}}const qi=`// Screen-Space Global Illumination — ray march pass.\r
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
`,ji=`// Screen-Space Global Illumination — temporal accumulation pass.\r
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
`,on=368,Yi={numRays:4,numSteps:16,radius:3,thickness:.5,strength:1};function Xi(){const d=new Uint8Array(new ArrayBuffer(64));for(let r=0;r<16;r++){const e=Math.random()*Math.PI*2;d[r*4+0]=Math.round((Math.cos(e)*.5+.5)*255),d[r*4+1]=Math.round((Math.sin(e)*.5+.5)*255),d[r*4+2]=128,d[r*4+3]=255}return d}class pr extends he{constructor(e,t,n,i,o,a,s,c,u,p,f,h,m,_,w,v){super();l(this,"name","SSGIPass");l(this,"resultView");l(this,"_uniformBuffer");l(this,"_noiseTexture");l(this,"_rawTexture");l(this,"_rawView");l(this,"_historyTexture");l(this,"_resultTexture");l(this,"_ssgiPipeline");l(this,"_temporalPipeline");l(this,"_ssgiBG0");l(this,"_ssgiBG1");l(this,"_tempBG0");l(this,"_tempBG1");l(this,"_settings");l(this,"_frameIndex",0);l(this,"_width");l(this,"_height");this._uniformBuffer=e,this._noiseTexture=t,this._rawTexture=n,this._rawView=i,this._historyTexture=o,this._resultTexture=a,this.resultView=s,this._ssgiPipeline=c,this._temporalPipeline=u,this._ssgiBG0=p,this._ssgiBG1=f,this._tempBG0=h,this._tempBG1=m,this._settings=_,this._width=w,this._height=v}static create(e,t,n,i=Yi){const{device:o,width:a,height:s}=e,c=o.createBuffer({label:"SSGIUniforms",size:on,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),u=o.createTexture({label:"SSGINoise",size:{width:4,height:4},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});o.queue.writeTexture({texture:u},Xi(),{bytesPerRow:4*4,rowsPerImage:4},{width:4,height:4});const p=u.createView(),f=o.createTexture({label:"SSGIRaw",size:{width:a,height:s},format:Q,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),h=f.createView(),m=o.createTexture({label:"SSGIHistory",size:{width:a,height:s},format:Q,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),_=m.createView(),w=o.createTexture({label:"SSGIResult",size:{width:a,height:s},format:Q,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),v=w.createView(),x=o.createSampler({label:"SSGILinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),B=o.createBindGroupLayout({label:"SSGIUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),G=o.createBindGroupLayout({label:"SSGITexBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),S=o.createBindGroupLayout({label:"SSGITempTexBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),E=o.createBindGroup({label:"SSGIUniformBG",layout:B,entries:[{binding:0,resource:{buffer:c}}]}),M=o.createBindGroup({label:"SSGITexBG",layout:G,entries:[{binding:0,resource:t.depthView},{binding:1,resource:t.normalMetallicView},{binding:2,resource:n},{binding:3,resource:p},{binding:4,resource:x}]}),A=o.createBindGroup({label:"SSGITempUniformBG",layout:B,entries:[{binding:0,resource:{buffer:c}}]}),R=o.createBindGroup({label:"SSGITempTexBG",layout:S,entries:[{binding:0,resource:h},{binding:1,resource:_},{binding:2,resource:t.depthView},{binding:3,resource:x}]}),P=o.createShaderModule({label:"SSGIShader",code:qi}),b=o.createShaderModule({label:"SSGITempShader",code:ji}),C=o.createRenderPipeline({label:"SSGIPipeline",layout:o.createPipelineLayout({bindGroupLayouts:[B,G]}),vertex:{module:P,entryPoint:"vs_main"},fragment:{module:P,entryPoint:"fs_ssgi",targets:[{format:Q}]},primitive:{topology:"triangle-list"}}),g=o.createRenderPipeline({label:"SSGITempPipeline",layout:o.createPipelineLayout({bindGroupLayouts:[B,S]}),vertex:{module:b,entryPoint:"vs_main"},fragment:{module:b,entryPoint:"fs_temporal",targets:[{format:Q}]},primitive:{topology:"triangle-list"}});return new pr(c,u,f,h,m,w,v,C,g,E,M,A,R,i,a,s)}updateCamera(e,t,n,i,o,a,s){const c=new Float32Array(on/4);c.set(t.data,0),c.set(n.data,16),c.set(i.data,32),c.set(o.data,48),c.set(a.data,64),c[80]=s.x,c[81]=s.y,c[82]=s.z;const u=new Uint32Array(c.buffer);u[83]=this._settings.numRays,u[84]=this._settings.numSteps,c[85]=this._settings.radius,c[86]=this._settings.thickness,c[87]=this._settings.strength,u[88]=this._frameIndex++,e.queue.writeBuffer(this._uniformBuffer,0,c.buffer)}updateSettings(e){this._settings={...this._settings,...e}}execute(e,t){{const n=e.beginRenderPass({label:"SSGIRayMarch",colorAttachments:[{view:this._rawView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._ssgiPipeline),n.setBindGroup(0,this._ssgiBG0),n.setBindGroup(1,this._ssgiBG1),n.draw(3),n.end()}{const n=e.beginRenderPass({label:"SSGITemporal",colorAttachments:[{view:this.resultView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._temporalPipeline),n.setBindGroup(0,this._tempBG0),n.setBindGroup(1,this._tempBG1),n.draw(3),n.end()}e.copyTextureToTexture({texture:this._resultTexture},{texture:this._historyTexture},{width:this._width,height:this._height})}destroy(){this._uniformBuffer.destroy(),this._noiseTexture.destroy(),this._rawTexture.destroy(),this._historyTexture.destroy(),this._resultTexture.destroy()}}const $i=`// VSM shadow map generation for point and spot lights.\r
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
`,ft=32,pt=32,je=4,Ve=8,ht=256,mt=512,Ae=256,zt=80,Ki=64,Zi=6*je,Qi=Zi+Ve;class hr extends he{constructor(e,t,n,i,o,a,s,c,u,p,f,h,m,_){super();l(this,"name","PointSpotShadowPass");l(this,"pointVsmView");l(this,"spotVsmView");l(this,"projTexView");l(this,"_pointVsmTex");l(this,"_spotVsmTex");l(this,"_projTexArray");l(this,"_pointDepth");l(this,"_spotDepth");l(this,"_pointFaceViews");l(this,"_spotFaceViews");l(this,"_pointDepthView");l(this,"_spotDepthView");l(this,"_pointPipeline");l(this,"_spotPipeline");l(this,"_shadowBufs");l(this,"_shadowBGs");l(this,"_modelBufs",[]);l(this,"_modelBGs",[]);l(this,"_modelBGL");l(this,"_snapshot",[]);l(this,"_pointLights",[]);l(this,"_spotLights",[]);this._pointVsmTex=e,this._spotVsmTex=t,this._projTexArray=n,this._pointDepth=i,this._spotDepth=o,this._pointFaceViews=a,this._spotFaceViews=s,this._pointDepthView=c,this._spotDepthView=u,this._pointPipeline=p,this._spotPipeline=f,this._shadowBufs=h,this._shadowBGs=m,this._modelBGL=_,this.pointVsmView=e.createView({dimension:"cube-array",arrayLayerCount:je*6}),this.spotVsmView=t.createView({dimension:"2d-array"}),this.projTexView=n.createView({dimension:"2d-array"})}static create(e){const{device:t}=e,n=t.createTexture({label:"PointVSM",size:{width:ht,height:ht,depthOrArrayLayers:je*6},format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),i=t.createTexture({label:"SpotVSM",size:{width:mt,height:mt,depthOrArrayLayers:Ve},format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),o=t.createTexture({label:"ProjTexArray",size:{width:Ae,height:Ae,depthOrArrayLayers:Ve},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),a=new Uint8Array(Ae*Ae*4).fill(255);for(let M=0;M<Ve;M++)t.queue.writeTexture({texture:o,origin:{x:0,y:0,z:M}},a,{bytesPerRow:Ae*4,rowsPerImage:Ae},{width:Ae,height:Ae,depthOrArrayLayers:1});const s=t.createTexture({label:"PointShadowDepth",size:{width:ht,height:ht},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),c=t.createTexture({label:"SpotShadowDepth",size:{width:mt,height:mt},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),u=Array.from({length:je*6},(M,A)=>n.createView({dimension:"2d",baseArrayLayer:A,arrayLayerCount:1})),p=Array.from({length:Ve},(M,A)=>i.createView({dimension:"2d",baseArrayLayer:A,arrayLayerCount:1})),f=s.createView(),h=c.createView(),m=t.createBindGroupLayout({label:"PSShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),_=t.createBindGroupLayout({label:"PSModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),w=[],v=[];for(let M=0;M<Qi;M++){const A=t.createBuffer({label:`PSShadowUniform ${M}`,size:zt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});w.push(A),v.push(t.createBindGroup({label:`PSShadowBG ${M}`,layout:m,entries:[{binding:0,resource:{buffer:A}}]}))}const x=t.createPipelineLayout({bindGroupLayouts:[m,_]}),B=t.createShaderModule({label:"PointSpotShadowShader",code:$i}),G={module:B,buffers:[{arrayStride:Zt,attributes:[Qt[0]]}]},S=t.createRenderPipeline({label:"PointShadowPipeline",layout:x,vertex:{...G,entryPoint:"vs_point"},fragment:{module:B,entryPoint:"fs_point",targets:[{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),E=t.createRenderPipeline({label:"SpotShadowPipeline",layout:x,vertex:{...G,entryPoint:"vs_spot"},fragment:{module:B,entryPoint:"fs_spot",targets:[{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}});return new hr(n,i,o,s,c,u,p,f,h,S,E,w,v,_)}update(e,t,n){this._pointLights=e,this._spotLights=t,this._snapshot=n}setProjectionTexture(e,t,n){e.copyTextureToTexture({texture:n},{texture:this._projTexArray,origin:{x:0,y:0,z:t}},{width:Ae,height:Ae,depthOrArrayLayers:1})}execute(e,t){const{device:n}=t,i=this._snapshot;this._ensureModelBuffers(n,i.length);for(let c=0;c<this._spotLights.length&&c<Ve;c++){const u=this._spotLights[c];u.projectionTexture&&this.setProjectionTexture(e,c,u.projectionTexture)}for(let c=0;c<i.length;c++)t.queue.writeBuffer(this._modelBufs[c],0,i[c].modelMatrix.data.buffer);let o=0,a=0;for(const c of this._pointLights){if(!c.castShadow||a>=je)continue;const u=c.worldPosition(),p=c.cubeFaceViewProjs(),f=new Float32Array(zt/4);f[16]=u.x,f[17]=u.y,f[18]=u.z,f[19]=c.radius;for(let h=0;h<6;h++){f.set(p[h].data,0),t.queue.writeBuffer(this._shadowBufs[o],0,f.buffer);const m=a*6+h,_=e.beginRenderPass({label:`PointShadow light${a} face${h}`,colorAttachments:[{view:this._pointFaceViews[m],clearValue:{r:1,g:1,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._pointDepthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"discard"}});_.setPipeline(this._pointPipeline),_.setBindGroup(0,this._shadowBGs[o]),this._drawItems(_,i),_.end(),o++}a++}let s=0;for(const c of this._spotLights){if(!c.castShadow||s>=Ve)continue;const u=c.lightViewProj(),p=c.worldPosition(),f=new Float32Array(zt/4);f.set(u.data,0),f[16]=p.x,f[17]=p.y,f[18]=p.z,f[19]=c.range,t.queue.writeBuffer(this._shadowBufs[o],0,f.buffer);const h=e.beginRenderPass({label:`SpotShadow light${s}`,colorAttachments:[{view:this._spotFaceViews[s],clearValue:{r:1,g:1,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._spotDepthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"discard"}});h.setPipeline(this._spotPipeline),h.setBindGroup(0,this._shadowBGs[o]),this._drawItems(h,i),h.end(),o++,s++}}_drawItems(e,t){for(let n=0;n<t.length;n++){const{mesh:i}=t[n];e.setBindGroup(1,this._modelBGs[n]),e.setVertexBuffer(0,i.vertexBuffer),e.setIndexBuffer(i.indexBuffer,"uint32"),e.drawIndexed(i.indexCount)}}_ensureModelBuffers(e,t){for(;this._modelBufs.length<t;){const n=e.createBuffer({label:`PSModelUniform ${this._modelBufs.length}`,size:Ki,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._modelBufs.push(n),this._modelBGs.push(e.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:n}}]}))}}destroy(){this._pointVsmTex.destroy(),this._spotVsmTex.destroy(),this._projTexArray.destroy(),this._pointDepth.destroy(),this._spotDepth.destroy();for(const e of this._shadowBufs)e.destroy();for(const e of this._modelBufs)e.destroy()}}const Ji=`// Water pass — forward-rendered on top of the deferred-lit HDR buffer.\r
// Vertex format: [x, y, z] (3 floats, chunk-local).\r
// Group 0: camera uniforms (matches WorldGeometryPass layout — 4 mat4 + vec3 pos + near + far)\r
// Group 1: per-frame water uniforms (time)\r
// Group 2: per-chunk offset\r
// Group 3: scene textures (refraction copy, depth, dudv, gradient, sky)\r
\r
struct CameraUniforms {\r
  view        : mat4x4<f32>,\r
  proj        : mat4x4<f32>,\r
  viewProj    : mat4x4<f32>,\r
  invViewProj : mat4x4<f32>,\r
  position    : vec3<f32>,\r
  near        : f32,\r
  far         : f32,\r
  _pad0       : f32,\r
  _pad1       : f32,\r
  _pad2       : f32,\r
}\r
\r
struct WaterUniforms {\r
  time          : f32,\r
  sky_intensity : f32,  // 0 at night, 1 at noon — dims the HDR sky reflection\r
  _p1           : f32,\r
  _p2           : f32,\r
}\r
\r
struct ChunkUniforms {\r
  offset : vec3<f32>,\r
  _pad   : f32,\r
}\r
\r
@group(0) @binding(0) var<uniform> cam   : CameraUniforms;\r
@group(1) @binding(0) var<uniform> water : WaterUniforms;\r
@group(2) @binding(0) var<uniform> chunk : ChunkUniforms;\r
\r
@group(3) @binding(0) var refraction_tex : texture_2d<f32>;\r
@group(3) @binding(1) var depth_tex      : texture_depth_2d;\r
@group(3) @binding(2) var dudv_tex       : texture_2d<f32>;\r
@group(3) @binding(3) var gradient_tex   : texture_2d<f32>;\r
@group(3) @binding(4) var sky_tex        : texture_2d<f32>;\r
@group(3) @binding(5) var samp           : sampler;\r
\r
struct VertOut {\r
  @builtin(position) clip_pos   : vec4<f32>,\r
  @location(0)       world_pos  : vec3<f32>,\r
  @location(1)       clip_coords: vec4<f32>,\r
}\r
\r
const PI            : f32 = 3.14159265358979;\r
const WAVE_AMPLITUDE: f32 = 3.8;\r
\r
fn calc_wave(world_pos: vec3<f32>) -> f32 {\r
  let fy   = fract(world_pos.y + 0.001);\r
  let wave = 0.05 * sin(2.0 * PI * (water.time * 0.8 + world_pos.x /  2.5 + world_pos.z /  5.0))\r
           + 0.05 * sin(2.0 * PI * (water.time * 0.6 + world_pos.x /  6.0 + world_pos.z / 12.0));\r
  return clamp(wave, -fy, 1.0 - fy) * WAVE_AMPLITUDE;\r
}\r
\r
@vertex\r
fn vs_main(@location(0) pos: vec3<f32>) -> VertOut {\r
  var world_pos  = pos + chunk.offset;\r
  //world_pos.y   += calc_wave(world_pos);\r
  let clip       = cam.viewProj * vec4<f32>(world_pos, 1.0);\r
  var out: VertOut;\r
  out.clip_pos    = clip;\r
  out.world_pos   = world_pos;\r
  out.clip_coords = clip;\r
  return out;\r
}\r
\r
fn linearize(d: f32, near: f32, far: f32) -> f32 {\r
  return near * far / (far - d * (far - near));\r
}\r
\r
// Equirectangular sampling for the sky texture (which is stored as a 2D panorama).\r
fn sky_uv(d: vec3<f32>) -> vec2<f32> {\r
  let u = 0.5 + atan2(d.z, d.x) / (2.0 * PI);\r
  let v = 0.5 - asin(clamp(d.y, -1.0, 1.0)) / PI;\r
  return vec2<f32>(u, v);\r
}\r
\r
// Screen-space reflection: ray-march the reflected ray in view space, sampling\r
// refraction_tex (the pre-water HDR copy) for radiance at each hit.\r
// Returns vec4(colour, confidence) — confidence fades to 0 near screen edges or on a miss.\r
fn ssr(world_pos: vec3<f32>, normal: vec3<f32>, view_dir: vec3<f32>) -> vec4<f32> {\r
  let reflect_dir = reflect(-view_dir, normal);\r
  // Transform reflected direction and surface origin to view space.\r
  let ray_vs    = normalize((cam.view * vec4<f32>(reflect_dir, 0.0)).xyz);\r
  let origin_vs = (cam.view * vec4<f32>(world_pos, 1.0)).xyz;\r
\r
  // Only trace rays heading away from the camera (negative view-space Z).\r
  if (ray_vs.z >= -0.001) { return vec4<f32>(0.0); }\r
\r
  let screen_dim = vec2<f32>(textureDimensions(refraction_tex));\r
  let screen_i   = vec2<i32>(screen_dim);\r
\r
  let NUM_STEPS: u32 = 32u;\r
  let MAX_DIST : f32 = 50.0;  // world-unit ray length\r
  let THICKNESS: f32 = 1.5;   // hit tolerance in view-space units\r
\r
  for (var s = 0u; s < NUM_STEPS; s++) {\r
    let t = (f32(s) + 1.0) * MAX_DIST / f32(NUM_STEPS);\r
    let p = origin_vs + ray_vs * t;\r
    if (p.z >= 0.0) { break; }  // stepped behind the near plane\r
\r
    // Project the ray point to screen UV.\r
    let clip  = cam.proj * vec4<f32>(p, 1.0);\r
    let inv_w = 1.0 / clip.w;\r
    let uv    = vec2<f32>(clip.x * inv_w * 0.5 + 0.5, -clip.y * inv_w * 0.5 + 0.5);\r
    if (any(uv < vec2<f32>(0.0)) || any(uv > vec2<f32>(1.0))) { break; }\r
\r
    // Compare ray depth against the stored GBuffer depth (converted to view-space Z).\r
    let tc           = clamp(vec2<i32>(uv * screen_dim), vec2<i32>(0), screen_i - vec2<i32>(1));\r
    let stored_depth = textureLoad(depth_tex, tc, 0);\r
    if (stored_depth >= 1.0) { continue; }  // sky pixel — keep stepping\r
\r
    let stored_z = -linearize(stored_depth, cam.near, cam.far);  // view-space Z (negative)\r
    if (p.z < stored_z && stored_z - p.z < THICKNESS) {\r
      // Fade confidence near screen edges to hide ray-termination seams.\r
      let edge = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y)) * 8.0;\r
      let conf = clamp(edge, 0.0, 1.0);\r
      let sample_uv = clamp(uv, vec2<f32>(0.001), vec2<f32>(0.999));\r
      return vec4<f32>(textureSampleLevel(refraction_tex, samp, sample_uv, 0.0).rgb, conf);\r
    }\r
  }\r
  return vec4<f32>(0.0);  // miss\r
}\r
\r
@fragment\r
fn fs_main(in: VertOut) -> @location(0) vec4<f32> {\r
  if (in.clip_coords.w < cam.near) { discard; }\r
\r
  // Screen UV from clip coordinates\r
  let ndc       = in.clip_coords.xy / in.clip_coords.w;\r
  let screen_uv = vec2<f32>(ndc.x * 0.5 + 0.5, ndc.y * -0.5 + 0.5);\r
\r
  // Manual depth test: discard water behind solid geometry\r
  let px        = vec2<u32>(in.clip_pos.xy);\r
  let floor_lin = linearize(textureLoad(depth_tex, px, 0), cam.near, cam.far);\r
  let water_lin = linearize(in.clip_pos.z, cam.near, cam.far);\r
  if (water_lin > floor_lin) { discard; }\r
  let water_depth = floor_lin - water_lin;\r
\r
  // Animated DUDV distortion — two-pass stacked sampling for complex ripples\r
  let base_uv    = vec2<f32>(in.world_pos.x, in.world_pos.z) * (1.0 / 8.0);\r
  let d1         = textureSample(dudv_tex, samp, vec2<f32>(base_uv.x + water.time * 0.02, base_uv.y)).rg;\r
  let d2_uv      = d1 + vec2<f32>(d1.x, d1.y + water.time * 0.02);\r
  let distortion = (textureSample(dudv_tex, samp, d2_uv).rg * 2.0 - 1.0) * 0.02;\r
\r
  // Refraction: sample the pre-water HDR copy at distorted screen coords\r
  let ref_uv    = clamp(screen_uv + distortion, vec2<f32>(0.001), vec2<f32>(0.999));\r
  let refraction = textureSample(refraction_tex, samp, ref_uv).rgb;\r
\r
  // Water surface normal from DUDV map\r
  let nc     = textureSample(dudv_tex, samp, d2_uv).rgb;\r
  let normal = normalize(vec3<f32>(nc.r * 2.0 - 1.0, 3.0, nc.g * 2.0 - 1.0));\r
\r
  let view_dir = normalize(cam.position - in.world_pos);\r
\r
  // Schlick Fresnel for water (F0 ≈ 0.02): low reflection when looking straight down,\r
  // rising towards grazing. Capped at 0.6 so bright HDR sky values cannot saturate to\r
  // white when viewing water at a shallow angle from far away.\r
  let VdotN     = clamp(dot(view_dir, normal), 0.0, 1.0);\r
  let fresnel_r = min(0.02 + 0.98 * pow(1.0 - VdotN, 5.0), 0.6);\r
\r
  // Screen-space reflection, with the equirectangular sky as fallback for missed rays.\r
  let ssr_result = ssr(in.world_pos, normal, view_dir);\r
  let sky_color  = textureSample(sky_tex, samp, sky_uv(reflect(-view_dir, normal))).rgb * water.sky_intensity;\r
  let reflection = mix(sky_color, ssr_result.rgb, ssr_result.a);\r
\r
  // Depth-based water tint via gradient map, with murkiness blend (Litecraft approach).\r
  // Shallow water is transparent refraction; deep water takes the gradient map colour.\r
  const MURKY_DEPTH: f32 = 4.0;\r
  let murk_factor = clamp(water_depth / MURKY_DEPTH, 0.0, 1.0);\r
  let inv_depth   = clamp(1.0 - murk_factor, 0.1, 0.99);\r
  let water_color = textureSample(gradient_tex, samp, vec2<f32>(inv_depth, 0.5)).rgb\r
                    * max(water.sky_intensity, 0.05);\r
  let tinted      = mix(refraction, water_color, murk_factor);\r
\r
  // Fresnel blend: refraction dominant head-on, SSR reflection rises at grazing angles.\r
  let world_color = mix(tinted, reflection, fresnel_r);\r
\r
  // Alpha: transparent at edges/shallow, opaque in deep water (Litecraft smoothstep approach).\r
  let depth_clamp = clamp(1.0 / max(water_depth, 0.001), 0.0, 1.0);\r
  let edge_alpha  = clamp(smoothstep(1.0, 0.0, depth_clamp), 0.0, 0.95);\r
\r
  return vec4<f32>(world_color, edge_alpha);\r
}\r
`,an=64*4+16+16,eo=16,to=16,ro=3,Ft=ro*4,Ht=16;class Fe extends he{constructor(e,t,n,i,o,a,s,c,u,p,f,h,m,_,w){super();l(this,"name","WaterPass");l(this,"_device");l(this,"_hdrTexture");l(this,"_hdrView");l(this,"_refractionTex");l(this,"_pipeline");l(this,"_cameraBuffer");l(this,"_waterBuffer");l(this,"_cameraBG");l(this,"_waterBG");l(this,"_sceneBG");l(this,"_sceneBGL");l(this,"_chunkBGL");l(this,"_skyTexture");l(this,"_dudvTexture");l(this,"_gradientTexture");l(this,"_chunks",new Map);l(this,"_frustumPlanes",new Float32Array(24));this._device=e,this._hdrTexture=t,this._hdrView=n,this._refractionTex=i,this._pipeline=o,this._cameraBuffer=a,this._waterBuffer=s,this._cameraBG=c,this._waterBG=u,this._sceneBG=p,this._sceneBGL=f,this._chunkBGL=h,this._skyTexture=m,this._dudvTexture=_,this._gradientTexture=w}static create(e,t,n,i,o,a,s){const{device:c,width:u,height:p}=e,f=c.createBindGroupLayout({label:"WaterCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),h=c.createBindGroupLayout({label:"WaterUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),m=c.createBindGroupLayout({label:"WaterChunkBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),_=c.createBindGroupLayout({label:"WaterSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:5,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),{refractionTex:w,refractionView:v}=Fe._makeRefractionTex(c,u,p),x=c.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"}),B=c.createBuffer({label:"WaterCameraBuffer",size:an,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),G=c.createBuffer({label:"WaterUniformBuffer",size:eo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),S=c.createBindGroup({label:"WaterCameraBG",layout:f,entries:[{binding:0,resource:{buffer:B}}]}),E=c.createBindGroup({label:"WaterUniformBG",layout:h,entries:[{binding:0,resource:{buffer:G}}]}),M=Fe._makeSceneBG(c,_,v,i,a,s,o,x),A=c.createShaderModule({label:"WaterShader",code:Ji}),R=c.createPipelineLayout({bindGroupLayouts:[f,h,m,_]}),P={arrayStride:Ft,attributes:[{shaderLocation:0,offset:0,format:"float32x3"}]},b=c.createRenderPipeline({label:"WaterPipeline",layout:R,vertex:{module:A,entryPoint:"vs_main",buffers:[P]},fragment:{module:A,entryPoint:"fs_main",targets:[{format:Q,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},primitive:{topology:"triangle-list",cullMode:"none"}});return new Fe(c,t,n,w,b,B,G,S,E,M,_,m,o,a,s)}updateRenderTargets(e,t,n,i){this._refractionTex.destroy(),this._hdrTexture=e,this._hdrView=t,i&&(this._skyTexture=i);const{width:o,height:a}=e,{refractionTex:s,refractionView:c}=Fe._makeRefractionTex(this._device,o,a);this._refractionTex=s;const u=this._device.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"});this._sceneBG=Fe._makeSceneBG(this._device,this._sceneBGL,c,n,this._dudvTexture,this._gradientTexture,this._skyTexture,u)}updateCamera(e,t,n,i,o,a,s,c){const u=new Float32Array(an/4);u.set(t.data,0),u.set(n.data,16),u.set(i.data,32),u.set(o.data,48),u[64]=a.x,u[65]=a.y,u[66]=a.z,u[67]=s,u[68]=c,e.queue.writeBuffer(this._cameraBuffer,0,u.buffer),this._extractFrustumPlanes(i.data)}_extractFrustumPlanes(e){const t=this._frustumPlanes;t[0]=e[3]+e[0],t[1]=e[7]+e[4],t[2]=e[11]+e[8],t[3]=e[15]+e[12],t[4]=e[3]-e[0],t[5]=e[7]-e[4],t[6]=e[11]-e[8],t[7]=e[15]-e[12],t[8]=e[3]+e[1],t[9]=e[7]+e[5],t[10]=e[11]+e[9],t[11]=e[15]+e[13],t[12]=e[3]-e[1],t[13]=e[7]-e[5],t[14]=e[11]-e[9],t[15]=e[15]-e[13],t[16]=e[2],t[17]=e[6],t[18]=e[10],t[19]=e[14],t[20]=e[3]-e[2],t[21]=e[7]-e[6],t[22]=e[11]-e[10],t[23]=e[15]-e[14]}_isVisible(e,t,n){const i=this._frustumPlanes,o=e+Ht,a=t+Ht,s=n+Ht;for(let c=0;c<6;c++){const u=i[c*4],p=i[c*4+1],f=i[c*4+2],h=i[c*4+3];if(u*(u>=0?o:e)+p*(p>=0?a:t)+f*(f>=0?s:n)+h<0)return!1}return!0}updateTime(e,t,n=1){e.queue.writeBuffer(this._waterBuffer,0,new Float32Array([t,n,0,0]).buffer)}addChunk(e,t){const n=this._chunks.get(e);n?this._replaceMeshBuffer(n,t):this._chunks.set(e,this._createChunkGpu(e,t))}updateChunk(e,t){const n=this._chunks.get(e);n?this._replaceMeshBuffer(n,t):this._chunks.set(e,this._createChunkGpu(e,t))}removeChunk(e){var n;const t=this._chunks.get(e);t&&((n=t.buffer)==null||n.destroy(),t.uniformBuffer.destroy(),this._chunks.delete(e))}execute(e,t){const{width:n,height:i}=this._refractionTex;e.copyTextureToTexture({texture:this._hdrTexture},{texture:this._refractionTex},{width:n,height:i,depthOrArrayLayers:1});const o=e.beginRenderPass({label:"WaterPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}]});o.setPipeline(this._pipeline),o.setBindGroup(0,this._cameraBG),o.setBindGroup(1,this._waterBG),o.setBindGroup(3,this._sceneBG);for(const a of this._chunks.values())!a.buffer||a.vertexCount===0||this._isVisible(a.ox,a.oy,a.oz)&&(o.setBindGroup(2,a.chunkBG),o.setVertexBuffer(0,a.buffer),o.draw(a.vertexCount));o.end()}destroy(){var e;this._cameraBuffer.destroy(),this._waterBuffer.destroy(),this._refractionTex.destroy();for(const t of this._chunks.values())(e=t.buffer)==null||e.destroy(),t.uniformBuffer.destroy();this._chunks.clear()}static _makeRefractionTex(e,t,n){const i=e.createTexture({label:"WaterRefractionTex",size:{width:t,height:n},format:Q,usage:GPUTextureUsage.COPY_DST|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT}),o=i.createView();return{refractionTex:i,refractionView:o}}static _makeSceneBG(e,t,n,i,o,a,s,c){return e.createBindGroup({label:"WaterSceneBG",layout:t,entries:[{binding:0,resource:n},{binding:1,resource:i},{binding:2,resource:o.view},{binding:3,resource:a.view},{binding:4,resource:s.view},{binding:5,resource:c}]})}_createChunkGpu(e,t){const n=this._device.createBuffer({label:`WaterChunkBuf(${e.globalPosition.x},${e.globalPosition.y},${e.globalPosition.z})`,size:to,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(n,0,new Float32Array([e.globalPosition.x,e.globalPosition.y,e.globalPosition.z,0]));const i=this._device.createBindGroup({label:"WaterChunkBG",layout:this._chunkBGL,entries:[{binding:0,resource:{buffer:n}}]}),o={ox:e.globalPosition.x,oy:e.globalPosition.y,oz:e.globalPosition.z,buffer:null,vertexCount:0,uniformBuffer:n,chunkBG:i};return this._replaceMeshBuffer(o,t),o}_replaceMeshBuffer(e,t){var n;if((n=e.buffer)==null||n.destroy(),e.buffer=null,e.vertexCount=t.waterCount,t.waterCount>0){const i=this._device.createBuffer({label:"WaterVertexBuf",size:t.waterCount*Ft,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(i,0,t.water.buffer,0,t.waterCount*Ft),e.buffer=i}}}const no=`// Shadow pass for transparent chunk geometry — samples color atlas alpha for discard.\r
// Opaque chunks use the simpler shadow.wgsl (no fragment shader needed).\r
\r
struct ShadowUniforms {\r
  lightViewProj: mat4x4<f32>,\r
}\r
struct ModelUniforms {\r
  model: mat4x4<f32>,\r
}\r
struct BlockData {\r
  sideTile  : u32,\r
  bottomTile: u32,\r
  topTile   : u32,\r
  _pad      : u32,\r
}\r
\r
@group(0) @binding(0) var<uniform>       shadow    : ShadowUniforms;\r
@group(1) @binding(0) var<uniform>       model     : ModelUniforms;\r
@group(2) @binding(0) var                color_atlas: texture_2d<f32>;\r
@group(2) @binding(1) var                atlas_samp : sampler;\r
@group(2) @binding(2) var<storage, read> block_data : array<BlockData>;\r
\r
const ATLAS_COLS: u32 = 25u;\r
const INV_COLS  : f32 = 1.0 / 25.0;\r
const INV_ROWS  : f32 = 1.0 / 25.0;\r
\r
struct VertexInput {\r
  @location(0) position  : vec3<f32>,\r
  @location(1) face      : f32,\r
  @location(2) block_type: f32,\r
}\r
\r
struct VertexOutput {\r
  @builtin(position)              clip_pos : vec4<f32>,\r
  @location(0)                    world_pos: vec3<f32>,\r
  @location(1) @interpolate(flat) face_f   : f32,\r
  @location(2) @interpolate(flat) block_f  : f32,\r
}\r
\r
@vertex\r
fn vs_main(vin: VertexInput) -> VertexOutput {\r
  let wp = (model.model * vec4<f32>(vin.position, 1.0)).xyz;\r
  var out: VertexOutput;\r
  out.clip_pos  = shadow.lightViewProj * vec4<f32>(wp, 1.0);\r
  out.world_pos = wp;\r
  out.face_f    = vin.face;\r
  out.block_f   = vin.block_type;\r
  return out;\r
}\r
\r
fn atlas_uv(world_pos: vec3<f32>, face: u32, block_type: u32) -> vec2<f32> {\r
  let bd = block_data[block_type];\r
  var tile: u32;\r
  if face == 4u      { tile = bd.bottomTile; }\r
  else if face == 5u { tile = bd.topTile; }\r
  else               { tile = bd.sideTile; }\r
\r
  var local_uv: vec2<f32>;\r
  if face == 2u || face == 3u {\r
    local_uv = vec2<f32>(fract(world_pos.z), 1.0 - fract(world_pos.y));\r
  } else if face == 4u || face == 5u {\r
    local_uv = fract(world_pos.xz);\r
  } else {\r
    local_uv = vec2<f32>(fract(world_pos.x), 1.0 - fract(world_pos.y));\r
  }\r
\r
  let tileX = f32(tile % ATLAS_COLS);\r
  let tileY = f32(tile / ATLAS_COLS);\r
  return (vec2<f32>(tileX, tileY) + local_uv) * vec2<f32>(INV_COLS, INV_ROWS);\r
}\r
\r
@fragment\r
fn fs_alpha_test(in: VertexOutput) {\r
  let uv = atlas_uv(in.world_pos, u32(in.face_f), u32(in.block_f));\r
  if textureSample(color_atlas, atlas_samp, uv).a < 0.5 { discard; }\r
}\r
`,io=`// Shadow pass for prop billboards (flowers, grass, torches, etc.).\r
// Expands each 6-vertex centre-point into a 1×1 quad using a right-axis supplied\r
// via a per-call orient uniform.  Called twice per chunk — once with right=(1,0,0)\r
// and once with right=(0,0,1) — to produce a cross-shaped shadow.\r
\r
struct ShadowUniforms { lightViewProj: mat4x4<f32> }\r
struct ModelUniforms  { model: mat4x4<f32> }\r
struct OrientUniforms { right: vec3<f32>, _pad: f32 }\r
\r
struct BlockData {\r
  sideTile  : u32,\r
  bottomTile: u32,\r
  topTile   : u32,\r
  _pad      : u32,\r
}\r
\r
@group(0) @binding(0) var<uniform>       shadow     : ShadowUniforms;\r
@group(1) @binding(0) var<uniform>       model      : ModelUniforms;\r
@group(2) @binding(0) var                color_atlas: texture_2d<f32>;\r
@group(2) @binding(1) var                atlas_samp : sampler;\r
@group(2) @binding(2) var<storage, read> block_data : array<BlockData>;\r
@group(3) @binding(0) var<uniform>       orient     : OrientUniforms;\r
\r
const ATLAS_COLS: u32 = 25u;\r
const INV_COLS  : f32 = 1.0 / 25.0;\r
const INV_ROWS  : f32 = 1.0 / 25.0;\r
\r
struct VertexInput {\r
  @location(0) position  : vec3<f32>,\r
  @location(1) face      : f32,\r
  @location(2) block_type: f32,\r
}\r
\r
struct VertexOutput {\r
  @builtin(position) clip_pos: vec4<f32>,\r
  @location(0)       uv     : vec2<f32>,\r
  @location(1)       block_f: f32,\r
}\r
\r
fn quad_offset(vid: u32) -> vec2<f32> {\r
  switch vid % 6u {\r
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
  switch vid % 6u {\r
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
fn vs_main(vin: VertexInput, @builtin(vertex_index) vid: u32) -> VertexOutput {\r
  let center = (model.model * vec4<f32>(vin.position, 1.0)).xyz;\r
  let up  = vec3<f32>(0.0, 1.0, 0.0);\r
  let off = quad_offset(vid);\r
  let wp  = center + orient.right * off.x + up * off.y;\r
  var out: VertexOutput;\r
  out.clip_pos = shadow.lightViewProj * vec4<f32>(wp, 1.0);\r
  out.uv       = quad_uv(vid);\r
  out.block_f  = vin.block_type;\r
  return out;\r
}\r
\r
@fragment\r
fn fs_alpha_test(in: VertexOutput) {\r
  let tile  = block_data[u32(in.block_f)].sideTile;\r
  let tileX = f32(tile % ATLAS_COLS);\r
  let tileY = f32(tile / ATLAS_COLS);\r
  let uv    = (vec2<f32>(tileX, tileY) + in.uv) * vec2<f32>(INV_COLS, INV_ROWS);\r
  if textureSample(color_atlas, atlas_samp, uv).a < 0.5 { discard; }\r
}\r
`,oo=4,Ee=5*4;class mr extends he{constructor(e,t,n,i,o,a,s,c,u,p,f){super();l(this,"name","WorldShadowPass");l(this,"shadowChunkRadius",4);l(this,"_camX",0);l(this,"_camZ",0);l(this,"_device");l(this,"_shadowMapArrayViews");l(this,"_pipeline");l(this,"_transparentPipeline");l(this,"_propPipeline");l(this,"_cascadeBGs");l(this,"_cascadeBuffers");l(this,"_modelBGL");l(this,"_atlasBG");l(this,"_orientBG_X");l(this,"_orientBG_Z");l(this,"_chunks",new Map);l(this,"_cascades",[]);this._device=e,this._shadowMapArrayViews=t,this._pipeline=n,this._transparentPipeline=i,this._propPipeline=o,this._cascadeBGs=a,this._cascadeBuffers=s,this._modelBGL=c,this._atlasBG=u,this._orientBG_X=p,this._orientBG_Z=f}static create(e,t,n,i){const{device:o}=e,a=o.createBindGroupLayout({label:"WorldShadowCascadeBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),s=o.createBindGroupLayout({label:"WorldShadowModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),c=o.createBindGroupLayout({label:"WorldShadowAtlasBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),u=[],p=[];for(let y=0;y<Math.min(n,oo);y++){const U=o.createBuffer({label:`WorldShadowCascadeBuf${y}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});u.push(U),p.push(o.createBindGroup({label:`WorldShadowCascadeBG${y}`,layout:a,entries:[{binding:0,resource:{buffer:U}}]}))}const f=L.MAX,h=o.createBuffer({label:"WorldShadowBlockDataBuf",size:Math.max(f*16,16),usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),m=Un,_=new Uint32Array(f*4);for(let y=0;y<f;y++){const U=At[y];U&&(_[y*4+0]=U.sideFace.y*m+U.sideFace.x,_[y*4+1]=U.bottomFace.y*m+U.bottomFace.x,_[y*4+2]=U.topFace.y*m+U.topFace.x)}o.queue.writeBuffer(h,0,_);const w=o.createSampler({label:"WorldShadowAtlasSampler",magFilter:"nearest",minFilter:"nearest"}),v=o.createBindGroup({label:"WorldShadowAtlasBG",layout:c,entries:[{binding:0,resource:i.colorAtlas.view},{binding:1,resource:w},{binding:2,resource:{buffer:h}}]}),x=o.createShaderModule({label:"WorldShadowShader",code:Cn}),B=o.createPipelineLayout({bindGroupLayouts:[a,s]}),G=o.createRenderPipeline({label:"WorldShadowPipeline",layout:B,vertex:{module:x,entryPoint:"vs_main",buffers:[{arrayStride:Ee,attributes:[{shaderLocation:0,offset:0,format:"float32x3"}]}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}}),S=o.createShaderModule({label:"WorldShadowTranspShader",code:no}),E=o.createPipelineLayout({bindGroupLayouts:[a,s,c]}),M=o.createRenderPipeline({label:"WorldShadowTransparentPipeline",layout:E,vertex:{module:S,entryPoint:"vs_main",buffers:[{arrayStride:Ee,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32"},{shaderLocation:2,offset:16,format:"float32"}]}]},fragment:{module:S,entryPoint:"fs_alpha_test",targets:[]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}}),A=o.createBindGroupLayout({label:"WorldShadowOrientBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),R=(y,U,N,V)=>{const z=o.createBuffer({label:y,size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return o.queue.writeBuffer(z,0,new Float32Array([U,N,V,0])),o.createBindGroup({label:y,layout:A,entries:[{binding:0,resource:{buffer:z}}]})},P=R("PropShadowOrientBG_X",1,0,0),b=R("PropShadowOrientBG_Z",0,0,1),C=o.createShaderModule({label:"WorldShadowPropShader",code:io}),g=o.createPipelineLayout({bindGroupLayouts:[a,s,c,A]}),T=o.createRenderPipeline({label:"WorldShadowPropPipeline",layout:g,vertex:{module:C,entryPoint:"vs_main",buffers:[{arrayStride:Ee,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32"},{shaderLocation:2,offset:16,format:"float32"}]}]},fragment:{module:C,entryPoint:"fs_alpha_test",targets:[]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}});return new mr(o,t,G,M,T,p,u,s,v,P,b)}update(e,t,n,i){this._cascades=t,this._camX=n,this._camZ=i;const o=Math.min(t.length,this._cascadeBuffers.length);for(let a=0;a<o;a++)e.queue.writeBuffer(this._cascadeBuffers[a],0,t[a].lightViewProj.data.buffer)}addChunk(e,t){const n=this._chunks.get(e);n?this._replaceMeshBuffer(n,t):this._chunks.set(e,this._createChunkGpu(e,t))}updateChunk(e,t){const n=this._chunks.get(e);n?this._replaceMeshBuffer(n,t):this._chunks.set(e,this._createChunkGpu(e,t))}removeChunk(e){var n,i,o;const t=this._chunks.get(e);t&&((n=t.opaqueBuffer)==null||n.destroy(),(i=t.transparentBuffer)==null||i.destroy(),(o=t.propBuffer)==null||o.destroy(),t.modelBuffer.destroy(),this._chunks.delete(e))}execute(e,t){const n=Math.min(this._cascades.length,this._cascadeBuffers.length);for(let i=0;i<n;i++){const o=e.beginRenderPass({label:`WorldShadowPass cascade ${i}`,colorAttachments:[],depthStencilAttachment:{view:this._shadowMapArrayViews[i],depthLoadOp:"load",depthStoreOp:"store"}});o.setBindGroup(0,this._cascadeBGs[i]);const a=this.shadowChunkRadius*16,s=a*a;o.setPipeline(this._pipeline);for(const c of this._chunks.values()){if(!c.opaqueBuffer||c.opaqueCount===0)continue;const u=c.ox-this._camX,p=c.oz-this._camZ;u*u+p*p>s||(o.setBindGroup(1,c.modelBG),o.setVertexBuffer(0,c.opaqueBuffer),o.draw(c.opaqueCount))}o.setPipeline(this._transparentPipeline),o.setBindGroup(2,this._atlasBG);for(const c of this._chunks.values()){if(!c.transparentBuffer||c.transparentCount===0)continue;const u=c.ox-this._camX,p=c.oz-this._camZ;u*u+p*p>s||(o.setBindGroup(1,c.modelBG),o.setVertexBuffer(0,c.transparentBuffer),o.draw(c.transparentCount))}o.setPipeline(this._propPipeline),o.setBindGroup(2,this._atlasBG);for(const c of[this._orientBG_X,this._orientBG_Z]){o.setBindGroup(3,c);for(const u of this._chunks.values()){if(!u.propBuffer||u.propCount===0)continue;const p=u.ox-this._camX,f=u.oz-this._camZ;p*p+f*f>s||(o.setBindGroup(1,u.modelBG),o.setVertexBuffer(0,u.propBuffer),o.draw(u.propCount))}}o.end()}}destroy(){var e,t,n;for(const i of this._cascadeBuffers)i.destroy();for(const i of this._chunks.values())(e=i.opaqueBuffer)==null||e.destroy(),(t=i.transparentBuffer)==null||t.destroy(),(n=i.propBuffer)==null||n.destroy(),i.modelBuffer.destroy();this._chunks.clear()}_createChunkGpu(e,t){const n=e.globalPosition,i=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,n.x,n.y,n.z,1]),o=this._device.createBuffer({label:"WorldShadowModelBuf",size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(o,0,i.buffer);const a=this._device.createBindGroup({label:"WorldShadowModelBG",layout:this._modelBGL,entries:[{binding:0,resource:{buffer:o}}]}),s={ox:n.x,oz:n.z,opaqueBuffer:null,opaqueCount:0,transparentBuffer:null,transparentCount:0,propBuffer:null,propCount:0,modelBuffer:o,modelBG:a};return this._replaceMeshBuffer(s,t),s}_replaceMeshBuffer(e,t){var n,i,o;if((n=e.opaqueBuffer)==null||n.destroy(),e.opaqueBuffer=null,e.opaqueCount=t.opaqueCount,t.opaqueCount>0){const a=this._device.createBuffer({label:"WorldShadowOpaqueBuf",size:t.opaqueCount*Ee,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.opaque.buffer,0,t.opaqueCount*Ee),e.opaqueBuffer=a}if((i=e.transparentBuffer)==null||i.destroy(),e.transparentBuffer=null,e.transparentCount=t.transparentCount,t.transparentCount>0){const a=this._device.createBuffer({label:"WorldShadowTransparentBuf",size:t.transparentCount*Ee,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.transparent.buffer,0,t.transparentCount*Ee),e.transparentBuffer=a}if((o=e.propBuffer)==null||o.destroy(),e.propBuffer=null,e.propCount=t.propCount,t.propCount>0){const a=this._device.createBuffer({label:"WorldShadowPropBuf",size:t.propCount*Ee,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.prop.buffer,0,t.propCount*Ee),e.propBuffer=a}}}const ao=`// Additive deferred pass for point and spot lights.\r
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
`,sn=64*4+16+16,so=8,ln=48,cn=128;class _r extends he{constructor(e,t,n,i,o,a,s,c,u,p){super();l(this,"name","PointSpotLightPass");l(this,"_pipeline");l(this,"_cameraBG");l(this,"_gbufferBG");l(this,"_lightBG");l(this,"_shadowBG");l(this,"_cameraBuffer");l(this,"_lightCountsBuffer");l(this,"_pointBuffer");l(this,"_spotBuffer");l(this,"_hdrView");l(this,"_cameraData",new Float32Array(sn/4));l(this,"_lightCountsArr",new Uint32Array(2));l(this,"_pointBuf",new ArrayBuffer(ft*ln));l(this,"_pointF32",new Float32Array(this._pointBuf));l(this,"_pointI32",new Int32Array(this._pointBuf));l(this,"_spotBuf",new ArrayBuffer(pt*cn));l(this,"_spotF32",new Float32Array(this._spotBuf));l(this,"_spotI32",new Int32Array(this._spotBuf));this._pipeline=e,this._cameraBG=t,this._gbufferBG=n,this._lightBG=i,this._shadowBG=o,this._cameraBuffer=a,this._lightCountsBuffer=s,this._pointBuffer=c,this._spotBuffer=u,this._hdrView=p}static create(e,t,n,i){const{device:o}=e,a=o.createBuffer({label:"PSLCameraBuffer",size:sn,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),s=o.createBuffer({label:"PSLLightCounts",size:so,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),c=o.createBuffer({label:"PSLPointBuffer",size:ft*ln,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),u=o.createBuffer({label:"PSLSpotBuffer",size:pt*cn,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),p=o.createSampler({label:"PSLLinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),f=o.createSampler({label:"PSLVsmSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge"}),h=o.createSampler({label:"PSLProjSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),m=o.createBindGroupLayout({label:"PSLCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),_=o.createBindGroupLayout({label:"PSLGBufferBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),w=o.createBindGroupLayout({label:"PSLLightBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),v=o.createBindGroupLayout({label:"PSLShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube-array"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d-array"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d-array"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),x=o.createBindGroup({label:"PSLCameraBG",layout:m,entries:[{binding:0,resource:{buffer:a}}]}),B=o.createBindGroup({label:"PSLGBufferBG",layout:_,entries:[{binding:0,resource:t.albedoRoughnessView},{binding:1,resource:t.normalMetallicView},{binding:2,resource:t.depthView},{binding:3,resource:p}]}),G=o.createBindGroup({label:"PSLLightBG",layout:w,entries:[{binding:0,resource:{buffer:s}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:u}}]}),S=o.createBindGroup({label:"PSLShadowBG",layout:v,entries:[{binding:0,resource:n.pointVsmView},{binding:1,resource:n.spotVsmView},{binding:2,resource:n.projTexView},{binding:3,resource:f},{binding:4,resource:h}]}),E=o.createShaderModule({label:"PointSpotLightShader",code:ao}),M=o.createRenderPipeline({label:"PointSpotLightPipeline",layout:o.createPipelineLayout({bindGroupLayouts:[m,_,w,v]}),vertex:{module:E,entryPoint:"vs_main"},fragment:{module:E,entryPoint:"fs_main",targets:[{format:Q,blend:{color:{srcFactor:"one",dstFactor:"one",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one",operation:"add"}}}]},primitive:{topology:"triangle-list"}});return new _r(M,x,B,G,S,a,s,c,u,i)}updateCamera(e,t,n,i,o,a,s,c){const u=this._cameraData;u.set(t.data,0),u.set(n.data,16),u.set(i.data,32),u.set(o.data,48),u[64]=a.x,u[65]=a.y,u[66]=a.z,u[67]=s,u[68]=c,e.queue.writeBuffer(this._cameraBuffer,0,u.buffer)}updateLights(e,t,n){const i=this._lightCountsArr;i[0]=Math.min(t.length,ft),i[1]=Math.min(n.length,pt),e.queue.writeBuffer(this._lightCountsBuffer,0,i.buffer);const o=this._pointF32,a=this._pointI32;let s=0;for(let f=0;f<Math.min(t.length,ft);f++){const h=t[f],m=h.worldPosition(),_=f*12;o[_+0]=m.x,o[_+1]=m.y,o[_+2]=m.z,o[_+3]=h.radius,o[_+4]=h.color.x,o[_+5]=h.color.y,o[_+6]=h.color.z,o[_+7]=h.intensity,h.castShadow&&s<je?a[_+8]=s++:a[_+8]=-1,a[_+9]=0,a[_+10]=0,a[_+11]=0}e.queue.writeBuffer(this._pointBuffer,0,this._pointBuf);const c=this._spotF32,u=this._spotI32;let p=0;for(let f=0;f<Math.min(n.length,pt);f++){const h=n[f],m=h.worldPosition(),_=h.worldDirection(),w=h.lightViewProj(),v=f*32;c[v+0]=m.x,c[v+1]=m.y,c[v+2]=m.z,c[v+3]=h.range,c[v+4]=_.x,c[v+5]=_.y,c[v+6]=_.z,c[v+7]=Math.cos(h.innerAngle*Math.PI/180),c[v+8]=h.color.x,c[v+9]=h.color.y,c[v+10]=h.color.z,c[v+11]=Math.cos(h.outerAngle*Math.PI/180),c[v+12]=h.intensity,h.castShadow&&p<Ve?u[v+13]=p++:u[v+13]=-1,u[v+14]=h.projectionTexture!==null?f:-1,u[v+15]=0,c.set(w.data,v+16)}e.queue.writeBuffer(this._spotBuffer,0,this._spotBuf)}execute(e,t){const n=e.beginRenderPass({label:"PointSpotLightPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._cameraBG),n.setBindGroup(1,this._gbufferBG),n.setBindGroup(2,this._lightBG),n.setBindGroup(3,this._shadowBG),n.draw(3),n.end()}destroy(){this._cameraBuffer.destroy(),this._lightCountsBuffer.destroy(),this._pointBuffer.destroy(),this._spotBuffer.destroy()}}const Ln=`
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
`;function lo(d){switch(d.kind){case"sphere":{const r=Math.cos(d.solidAngle).toFixed(6),e=d.radius.toFixed(6);return`{
  let dir = sample_cone(seed + 10u, seed + 11u, ${r});
  let world_dir = quat_rotate(uniforms.world_quat, dir);
  p.position = uniforms.world_pos + world_dir * ${e};
  p.velocity = world_dir * speed;
}`}case"cone":{const r=Math.cos(d.angle).toFixed(6),e=d.radius.toFixed(6);return`{
  let dir = sample_cone(seed + 10u, seed + 11u, ${r});
  let world_dir = quat_rotate(uniforms.world_quat, dir);
  p.position = uniforms.world_pos + world_dir * ${e};
  p.velocity = world_dir * speed;
}`}case"box":{const[r,e,t]=d.halfExtents.map(n=>n.toFixed(6));return`{
  let local_off = vec3<f32>(
    (rand_f32(seed + 10u) * 2.0 - 1.0) * ${r},
    (rand_f32(seed + 11u) * 2.0 - 1.0) * ${e},
    (rand_f32(seed + 12u) * 2.0 - 1.0) * ${t},
  );
  let up = quat_rotate(uniforms.world_quat, vec3<f32>(0.0, 1.0, 0.0));
  p.position = uniforms.world_pos + quat_rotate(uniforms.world_quat, local_off);
  p.velocity = up * speed;
}`}}}function kn(d){switch(d.type){case"gravity":return`p.velocity.y -= ${d.strength.toFixed(6)} * uniforms.dt;`;case"drag":return`p.velocity -= p.velocity * ${d.coefficient.toFixed(6)} * uniforms.dt;`;case"force":{const[r,e,t]=d.direction.map(n=>n.toFixed(6));return`p.velocity += vec3<f32>(${r}, ${e}, ${t}) * ${d.strength.toFixed(6)} * uniforms.dt;`}case"swirl_force":{const r=d.speed.toFixed(6),e=d.strength.toFixed(6);return`{
  let swirl_angle = uniforms.time * ${r};
  p.velocity += vec3<f32>(cos(swirl_angle), 0.0, sin(swirl_angle)) * ${e} * uniforms.dt;
}`}case"vortex":return`{
  let vx_radial = p.position.xz - uniforms.world_pos.xz;
  p.velocity += vec3<f32>(-vx_radial.y, 0.0, vx_radial.x) * ${d.strength.toFixed(6)} * uniforms.dt;
}`;case"curl_noise":{const r=d.octaves??1,e=r>1?`curl_noise_fbm(cn_pos, ${r})`:"curl_noise(cn_pos)";return`{
  let cn_pos = p.position * ${d.scale.toFixed(6)} + uniforms.time * ${d.timeScale.toFixed(6)};
  p.velocity += ${e} * ${d.strength.toFixed(6)} * uniforms.dt;
}`}case"size_random":return`p.size = rand_range(${d.min.toFixed(6)}, ${d.max.toFixed(6)}, pcg_hash(idx * 2654435761u));`;case"size_over_lifetime":return`p.size = mix(${d.start.toFixed(6)}, ${d.end.toFixed(6)}, t);`;case"color_over_lifetime":{const[r,e,t,n]=d.startColor.map(c=>c.toFixed(6)),[i,o,a,s]=d.endColor.map(c=>c.toFixed(6));return`p.color = mix(vec4<f32>(${r}, ${e}, ${t}, ${n}), vec4<f32>(${i}, ${o}, ${a}, ${s}), t);`}case"block_collision":return`{
  let _bc_uv = (p.position.xz - vec2<f32>(hm.origin_x, hm.origin_z)) / (hm.extent * 2.0) + 0.5;
  if (all(_bc_uv >= vec2<f32>(0.0)) && all(_bc_uv <= vec2<f32>(1.0))) {
    let _bc_xi = clamp(u32(_bc_uv.x * f32(hm.resolution)), 0u, hm.resolution - 1u);
    let _bc_zi = clamp(u32(_bc_uv.y * f32(hm.resolution)), 0u, hm.resolution - 1u);
    if (p.position.y <= hm_data[_bc_zi * hm.resolution + _bc_xi]) {
      particles[idx].life = -1.0; return;
    }
  }
}`}}function Nn(d,r){return d?d.filter(e=>e.trigger===r).flatMap(e=>e.actions.map(kn)).join(`
  `):""}function co(d){const{emitter:r,events:e}=d,[t,n]=r.lifetime.map(h=>h.toFixed(6)),[i,o]=r.initialSpeed.map(h=>h.toFixed(6)),[a,s]=r.initialSize.map(h=>h.toFixed(6)),[c,u,p,f]=r.initialColor.map(h=>h.toFixed(6));return`
${Ln}

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

  let speed = rand_range(${i}, ${o}, seed + 1u);

  var p: Particle;
  p.life     = 0.0;
  p.max_life = rand_range(${t}, ${n}, seed + 2u);
  p.color    = vec4<f32>(${c}, ${u}, ${p}, ${f});
  p.size     = rand_range(${a}, ${s}, seed + 3u);
  p.rotation = rand_f32(seed + 4u) * 6.28318530717958647;

  ${lo(r.shape)}

  ${Nn(e,"on_spawn")}

  particles[idx] = p;
}
`}function uo(d){return d.modifiers.some(r=>r.type==="block_collision")}const fo=`
struct HeightmapUniforms {
  origin_x  : f32,
  origin_z  : f32,
  extent    : f32,
  resolution: u32,
}
@group(2) @binding(0) var<storage, read> hm_data: array<f32>;
@group(2) @binding(1) var<uniform>       hm     : HeightmapUniforms;
`;function po(d){const r=d.modifiers.some(n=>n.type==="block_collision"),e=d.modifiers.map(kn).join(`
  `),t=Nn(d.events,"on_death");return`
${Ln}
${r?fo:""}

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
    ${t}
    particles[idx].life = -1.0;
    return;
  }

  let t = p.life / p.max_life;

  ${e}

  p.position += p.velocity * uniforms.dt;
  particles[idx] = p;
}
`}const ho=`// Compact pass — rebuilds alive_list and writes indirect draw instance count.\r
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
`,mo=`// Particle GBuffer render pass — camera-facing billboard quads.\r
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
`,_o=`// Particle forward HDR render pass — velocity-aligned billboard quads.\r
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
`,un=64,dn=80,go=16,vo=16,fn=288,pn=16,Wt=128;class gr extends he{constructor(e,t,n,i,o,a,s,c,u,p,f,h,m,_,w,v,x,B,G,S,E,M,A,R,P,b,C){super();l(this,"name","ParticlePass");l(this,"_gbuffer");l(this,"_hdrView");l(this,"_isForward");l(this,"_maxParticles");l(this,"_config");l(this,"_particleBuffer");l(this,"_aliveList");l(this,"_counterBuffer");l(this,"_indirectBuffer");l(this,"_computeUniforms");l(this,"_renderUniforms");l(this,"_cameraBuffer");l(this,"_spawnPipeline");l(this,"_updatePipeline");l(this,"_compactPipeline");l(this,"_indirectPipeline");l(this,"_renderPipeline");l(this,"_computeDataBG");l(this,"_computeUniBG");l(this,"_compactDataBG");l(this,"_compactUniBG");l(this,"_renderDataBG");l(this,"_cameraRenderBG");l(this,"_renderParamsBG");l(this,"_heightmapDataBuf");l(this,"_heightmapUniBuf");l(this,"_heightmapBG");l(this,"_spawnAccum",0);l(this,"_spawnOffset",0);l(this,"_spawnCount",0);l(this,"_time",0);l(this,"_frameSeed",0);l(this,"_cuBuf",new Float32Array(dn/4));l(this,"_cuiView",new Uint32Array(this._cuBuf.buffer));l(this,"_camBuf",new Float32Array(fn/4));l(this,"_hmUniBuf",new Float32Array(pn/4));l(this,"_hmRes",new Uint32Array([Wt]));l(this,"_resetArr",new Uint32Array(1));this._gbuffer=e,this._hdrView=t,this._isForward=n,this._config=i,this._maxParticles=o,this._particleBuffer=a,this._aliveList=s,this._counterBuffer=c,this._indirectBuffer=u,this._computeUniforms=p,this._renderUniforms=f,this._cameraBuffer=h,this._spawnPipeline=m,this._updatePipeline=_,this._compactPipeline=w,this._indirectPipeline=v,this._renderPipeline=x,this._computeDataBG=B,this._computeUniBG=G,this._compactDataBG=S,this._compactUniBG=E,this._renderDataBG=M,this._cameraRenderBG=A,this._renderParamsBG=R,this._heightmapDataBuf=P,this._heightmapUniBuf=b,this._heightmapBG=C}static create(e,t,n,i){const{device:o}=e,a=t.renderer.type==="sprites"&&t.renderer.renderTarget==="hdr",s=t.emitter.maxParticles,c=o.createBuffer({label:"ParticleBuffer",size:s*un,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),u=new Float32Array(s*(un/4));for(let te=0;te<s;te++)u[te*16+3]=-1;o.queue.writeBuffer(c,0,u.buffer);const p=o.createBuffer({label:"ParticleAliveList",size:s*4,usage:GPUBufferUsage.STORAGE}),f=o.createBuffer({label:"ParticleCounter",size:4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),h=o.createBuffer({label:"ParticleIndirect",size:16,usage:GPUBufferUsage.INDIRECT|GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});o.queue.writeBuffer(h,0,new Uint32Array([6,0,0,0]));const m=o.createBuffer({label:"ParticleComputeUniforms",size:dn,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),_=o.createBuffer({label:"ParticleCompactUniforms",size:go,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});o.queue.writeBuffer(_,0,new Uint32Array([s,0,0,0]));const w=o.createBuffer({label:"ParticleRenderUniforms",size:vo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});o.queue.writeBuffer(w,0,new Float32Array([t.emitter.roughness,t.emitter.metallic,0,0]));const v=o.createBuffer({label:"ParticleCameraBuffer",size:fn,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),x=o.createBindGroupLayout({label:"ParticleComputeDataBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),B=o.createBindGroupLayout({label:"ParticleCompactDataBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),G=o.createBindGroupLayout({label:"ParticleComputeUniBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),S=o.createBindGroupLayout({label:"ParticleRenderDataBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}}]}),E=o.createBindGroupLayout({label:"ParticleCameraRenderBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),M=o.createBindGroupLayout({label:"ParticleRenderParamsBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),A=o.createBindGroup({label:"ParticleComputeDataBG",layout:x,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:p}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:h}}]}),R=o.createBindGroup({label:"ParticleCompactDataBG",layout:B,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:p}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:h}}]}),P=o.createBindGroup({label:"ParticleComputeUniBG",layout:G,entries:[{binding:0,resource:{buffer:m}}]}),b=o.createBindGroup({label:"ParticleCompactUniBG",layout:G,entries:[{binding:0,resource:{buffer:_}}]}),C=o.createBindGroup({label:"ParticleRenderDataBG",layout:S,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:p}}]}),g=o.createBindGroup({label:"ParticleCameraRenderBG",layout:E,entries:[{binding:0,resource:{buffer:v}}]}),T=o.createBindGroup({label:"ParticleRenderParamsBG",layout:M,entries:[{binding:0,resource:{buffer:w}}]});let y,U,N,V;uo(t)&&(y=o.createBuffer({label:"ParticleHeightmapData",size:Wt*Wt*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),U=o.createBuffer({label:"ParticleHeightmapUniforms",size:pn,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),V=o.createBindGroupLayout({label:"ParticleHeightmapBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),N=o.createBindGroup({label:"ParticleHeightmapBG",layout:V,entries:[{binding:0,resource:{buffer:y}},{binding:1,resource:{buffer:U}}]}));const z=o.createPipelineLayout({bindGroupLayouts:[x,G]}),I=V?o.createPipelineLayout({bindGroupLayouts:[x,G,V]}):o.createPipelineLayout({bindGroupLayouts:[x,G]}),K=o.createPipelineLayout({bindGroupLayouts:[B,G]}),de=o.createShaderModule({label:"ParticleSpawn",code:co(t)}),fe=o.createShaderModule({label:"ParticleUpdate",code:po(t)}),ee=o.createShaderModule({label:"ParticleCompact",code:ho}),re=o.createComputePipeline({label:"ParticleSpawnPipeline",layout:z,compute:{module:de,entryPoint:"cs_main"}}),q=o.createComputePipeline({label:"ParticleUpdatePipeline",layout:I,compute:{module:fe,entryPoint:"cs_main"}}),$=o.createComputePipeline({label:"ParticleCompactPipeline",layout:K,compute:{module:ee,entryPoint:"cs_compact"}}),W=o.createComputePipeline({label:"ParticleIndirectPipeline",layout:K,compute:{module:ee,entryPoint:"cs_write_indirect"}});let Y;if(a){const te=t.renderer.type==="sprites"?t.renderer.billboard:"camera",me=te==="camera"?"vs_camera":"vs_main",ve=te==="camera"?"fs_snow":"fs_main",pe=o.createShaderModule({label:"ParticleRenderForward",code:_o}),le=o.createPipelineLayout({bindGroupLayouts:[S,E]});Y=o.createRenderPipeline({label:"ParticleForwardPipeline",layout:le,vertex:{module:pe,entryPoint:me},fragment:{module:pe,entryPoint:ve,targets:[{format:Q,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},depthStencil:{format:"depth32float",depthWriteEnabled:!1,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}})}else{const te=o.createShaderModule({label:"ParticleRender",code:mo}),me=o.createPipelineLayout({bindGroupLayouts:[S,E,M]});Y=o.createRenderPipeline({label:"ParticleRenderPipeline",layout:me,vertex:{module:te,entryPoint:"vs_main"},fragment:{module:te,entryPoint:"fs_main",targets:[{format:"rgba8unorm"},{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}})}return new gr(n,i,a,t,s,c,p,f,h,m,w,v,re,q,$,W,Y,A,P,R,b,C,g,a?void 0:T,y,U,N)}updateHeightmap(e,t,n,i,o){if(!this._heightmapDataBuf||!this._heightmapUniBuf)return;e.queue.writeBuffer(this._heightmapDataBuf,0,t.buffer);const a=this._hmUniBuf;a[0]=n,a[1]=i,a[2]=o,e.queue.writeBuffer(this._heightmapUniBuf,0,a.buffer,0,12),e.queue.writeBuffer(this._heightmapUniBuf,12,this._hmRes)}update(e,t,n,i,o,a,s,c,u,p){this._time+=t,this._frameSeed=this._frameSeed+1&4294967295,this._spawnAccum+=this._config.emitter.spawnRate*t,this._spawnCount=Math.min(Math.floor(this._spawnAccum),this._maxParticles),this._spawnAccum-=this._spawnCount;const f=p.data,h=f[12],m=f[13],_=f[14],w=Math.hypot(f[0],f[1],f[2]),v=Math.hypot(f[4],f[5],f[6]),x=Math.hypot(f[8],f[9],f[10]),B=f[0]/w,G=f[1]/w,S=f[2]/w,E=f[4]/v,M=f[5]/v,A=f[6]/v,R=f[8]/x,P=f[9]/x,b=f[10]/x,C=B+M+b;let g,T,y,U;if(C>0){const I=.5/Math.sqrt(C+1);U=.25/I,g=(A-P)*I,T=(R-S)*I,y=(G-E)*I}else if(B>M&&B>b){const I=2*Math.sqrt(1+B-M-b);U=(A-P)/I,g=.25*I,T=(E+G)/I,y=(R+S)/I}else if(M>b){const I=2*Math.sqrt(1+M-B-b);U=(R-S)/I,g=(E+G)/I,T=.25*I,y=(P+A)/I}else{const I=2*Math.sqrt(1+b-B-M);U=(G-E)/I,g=(R+S)/I,T=(P+A)/I,y=.25*I}const N=this._cuBuf,V=this._cuiView;N[0]=h,N[1]=m,N[2]=_,V[3]=this._spawnCount,N[4]=g,N[5]=T,N[6]=y,N[7]=U,V[8]=this._spawnOffset,V[9]=this._maxParticles,V[10]=this._frameSeed,V[11]=0,N[12]=t,N[13]=this._time,e.queue.writeBuffer(this._computeUniforms,0,N.buffer),e.queue.writeBuffer(this._counterBuffer,0,this._resetArr),this._spawnOffset=(this._spawnOffset+this._spawnCount)%this._maxParticles;const z=this._camBuf;z.set(n.data,0),z.set(i.data,16),z.set(o.data,32),z.set(a.data,48),z[64]=s.x,z[65]=s.y,z[66]=s.z,z[67]=c,z[68]=u,e.queue.writeBuffer(this._cameraBuffer,0,z.buffer)}execute(e,t){const n=e.beginComputePass({label:"ParticleCompute"});if(this._spawnCount>0&&(n.setPipeline(this._spawnPipeline),n.setBindGroup(0,this._computeDataBG),n.setBindGroup(1,this._computeUniBG),n.dispatchWorkgroups(Math.ceil(this._spawnCount/64))),n.setPipeline(this._updatePipeline),n.setBindGroup(0,this._computeDataBG),n.setBindGroup(1,this._computeUniBG),this._heightmapBG&&n.setBindGroup(2,this._heightmapBG),n.dispatchWorkgroups(Math.ceil(this._maxParticles/64)),n.setPipeline(this._compactPipeline),n.setBindGroup(0,this._compactDataBG),n.setBindGroup(1,this._compactUniBG),n.dispatchWorkgroups(Math.ceil(this._maxParticles/64)),n.setPipeline(this._indirectPipeline),n.dispatchWorkgroups(1),n.end(),this._isForward){const i=e.beginRenderPass({label:"ParticleForwardPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthReadOnly:!0}});i.setPipeline(this._renderPipeline),i.setBindGroup(0,this._renderDataBG),i.setBindGroup(1,this._cameraRenderBG),i.drawIndirect(this._indirectBuffer,0),i.end()}else{const i=e.beginRenderPass({label:"ParticleGBufferPass",colorAttachments:[{view:this._gbuffer.albedoRoughnessView,loadOp:"load",storeOp:"store"},{view:this._gbuffer.normalMetallicView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthLoadOp:"load",depthStoreOp:"store"}});i.setPipeline(this._renderPipeline),i.setBindGroup(0,this._renderDataBG),i.setBindGroup(1,this._cameraRenderBG),i.setBindGroup(2,this._renderParamsBG),i.drawIndirect(this._indirectBuffer,0),i.end()}}destroy(){var e,t;this._particleBuffer.destroy(),this._aliveList.destroy(),this._counterBuffer.destroy(),this._indirectBuffer.destroy(),this._computeUniforms.destroy(),this._renderUniforms.destroy(),this._cameraBuffer.destroy(),(e=this._heightmapDataBuf)==null||e.destroy(),(t=this._heightmapUniBuf)==null||t.destroy()}}const bo=`// Auto-exposure — two-pass histogram approach.\r
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
`,yo=64,xo=32,wo=16,Bo=yo*4,hn={adaptSpeed:1.5,minExposure:.1,maxExposure:10,lowPct:.05,highPct:.02};class et extends he{constructor(e,t,n,i,o,a,s,c){super();l(this,"name","AutoExposurePass");l(this,"exposureBuffer");l(this,"_histogramPipeline");l(this,"_adaptPipeline");l(this,"_bindGroup");l(this,"_paramsBuffer");l(this,"_histogramBuffer");l(this,"_hdrWidth");l(this,"_hdrHeight");l(this,"enabled",!0);this._histogramPipeline=e,this._adaptPipeline=t,this._bindGroup=n,this._paramsBuffer=i,this._histogramBuffer=o,this.exposureBuffer=a,this._hdrWidth=s,this._hdrHeight=c}static create(e,t,n=hn){const{device:i}=e,o=i.createBindGroupLayout({label:"AutoExposureBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),a=i.createBuffer({label:"AutoExposureHistogram",size:Bo,usage:GPUBufferUsage.STORAGE}),s=i.createBuffer({label:"AutoExposureValue",size:wo,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});i.queue.writeBuffer(s,0,new Float32Array([1,0,0,0]));const c=i.createBuffer({label:"AutoExposureParams",size:xo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});et._writeParams(i,c,0,n);const u=i.createBindGroup({label:"AutoExposureBG",layout:o,entries:[{binding:0,resource:t.createView()},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:s}},{binding:3,resource:{buffer:c}}]}),p=i.createPipelineLayout({bindGroupLayouts:[o]}),f=i.createShaderModule({label:"AutoExposure",code:bo}),h=i.createComputePipeline({label:"AutoExposureHistogramPipeline",layout:p,compute:{module:f,entryPoint:"cs_histogram"}}),m=i.createComputePipeline({label:"AutoExposureAdaptPipeline",layout:p,compute:{module:f,entryPoint:"cs_adapt"}});return new et(h,m,u,c,a,s,t.width,t.height)}update(e,t,n=hn){if(!this.enabled){e.device.queue.writeBuffer(this.exposureBuffer,0,new Float32Array([1,0,0,0]));return}et._writeParams(e.device,this._paramsBuffer,t,n)}execute(e,t){if(!this.enabled)return;const n=e.beginComputePass({label:"AutoExposurePass"});n.setPipeline(this._histogramPipeline),n.setBindGroup(0,this._bindGroup),n.dispatchWorkgroups(Math.ceil(this._hdrWidth/32),Math.ceil(this._hdrHeight/32)),n.setPipeline(this._adaptPipeline),n.dispatchWorkgroups(1),n.end()}destroy(){this._paramsBuffer.destroy(),this._histogramBuffer.destroy(),this.exposureBuffer.destroy()}static _writeParams(e,t,n,i){e.queue.writeBuffer(t,0,new Float32Array([n,i.adaptSpeed,i.minExposure,i.maxExposure,i.lowPct,i.highPct,0,0]))}}function So(d,r,e){let t=(Math.imul(d,1664525)^Math.imul(r,1013904223)^Math.imul(e,22695477))>>>0;return t=Math.imul(t^t>>>16,73244475)>>>0,t=Math.imul(t^t>>>16,73244475)>>>0,((t^t>>>16)>>>0)/4294967295}function Bt(d,r,e,t){return So(d^t,r^t*7+3,e^t*13+5)}function qt(d){return d*d*d*(d*(d*6-15)+10)}function Po(d,r,e,t,n,i,o,a,s,c,u){const p=d+(r-d)*s,f=e+(t-e)*s,h=n+(i-n)*s,m=o+(a-o)*s,_=p+(f-p)*c,w=h+(m-h)*c;return _+(w-_)*u}const Go=new Int8Array([1,-1,1,-1,1,-1,1,-1,0,0,0,0]),To=new Int8Array([1,1,-1,-1,0,0,0,0,1,-1,1,-1]),Ao=new Int8Array([0,0,0,0,1,1,-1,-1,1,1,-1,-1]);function Ie(d,r,e,t,n,i,o,a){const s=(d%t+t)%t,c=(r%t+t)%t,u=(e%t+t)%t,p=Math.floor(Bt(s,c,u,n)*12)%12;return Go[p]*i+To[p]*o+Ao[p]*a}function Mo(d,r,e,t,n){const i=Math.floor(d),o=Math.floor(r),a=Math.floor(e),s=d-i,c=r-o,u=e-a,p=qt(s),f=qt(c),h=qt(u);return Po(Ie(i,o,a,t,n,s,c,u),Ie(i+1,o,a,t,n,s-1,c,u),Ie(i,o+1,a,t,n,s,c-1,u),Ie(i+1,o+1,a,t,n,s-1,c-1,u),Ie(i,o,a+1,t,n,s,c,u-1),Ie(i+1,o,a+1,t,n,s-1,c,u-1),Ie(i,o+1,a+1,t,n,s,c-1,u-1),Ie(i+1,o+1,a+1,t,n,s-1,c-1,u-1),p,f,h)}function Eo(d,r,e,t,n,i){let o=0,a=.5,s=1,c=0;for(let u=0;u<t;u++)o+=Mo(d*s,r*s,e*s,n*s,i+u*17)*a,c+=a,a*=.5,s*=2;return Math.max(0,Math.min(1,o/c*.85+.5))}function We(d,r,e,t,n){const i=d*t,o=r*t,a=e*t,s=Math.floor(i),c=Math.floor(o),u=Math.floor(a);let p=1/0;for(let f=-1;f<=1;f++)for(let h=-1;h<=1;h++)for(let m=-1;m<=1;m++){const _=s+m,w=c+h,v=u+f,x=(_%t+t)%t,B=(w%t+t)%t,G=(v%t+t)%t,S=_+Bt(x,B,G,n),E=w+Bt(x,B,G,n+1),M=v+Bt(x,B,G,n+2),A=i-S,R=o-E,P=a-M,b=A*A+R*R+P*P;b<p&&(p=b)}return 1-Math.min(Math.sqrt(p),1)}function mn(d,r,e,t){const n=d.createTexture({label:r,dimension:"3d",size:{width:e,height:e,depthOrArrayLayers:e},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return d.queue.writeTexture({texture:n},t.buffer,{bytesPerRow:e*4,rowsPerImage:e},{width:e,height:e,depthOrArrayLayers:e}),n}function Uo(d){const e=new Uint8Array(1048576);for(let a=0;a<64;a++)for(let s=0;s<64;s++)for(let c=0;c<64;c++){const u=(a*64*64+s*64+c)*4,p=c/64,f=s/64,h=a/64,m=Eo(p,f,h,4,4,0),_=We(p,f,h,2,100),w=We(p,f,h,4,200),v=We(p,f,h,8,300);e[u]=Math.round(m*255),e[u+1]=Math.round(_*255),e[u+2]=Math.round(w*255),e[u+3]=Math.round(v*255)}const t=32,n=new Uint8Array(t*t*t*4);for(let a=0;a<t;a++)for(let s=0;s<t;s++)for(let c=0;c<t;c++){const u=(a*t*t+s*t+c)*4,p=c/t,f=s/t,h=a/t,m=We(p,f,h,4,400),_=We(p,f,h,8,500),w=We(p,f,h,16,600);n[u]=Math.round(m*255),n[u+1]=Math.round(_*255),n[u+2]=Math.round(w*255),n[u+3]=255}const i=mn(d,"CloudBaseNoise",64,e),o=mn(d,"CloudDetailNoise",t,n);return{baseNoise:i,baseView:i.createView({dimension:"3d"}),detailNoise:o,detailView:o.createView({dimension:"3d"}),destroy(){i.destroy(),o.destroy()}}}const Co=`// IBL baking — two compute entry points share the same bind group layout.\r
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
`,_t=5,jt=128,gt=32,Lo=[0,.25,.5,.75,1],ko=Math.PI;function No(d){let r=d>>>0;return r=(r<<16|r>>>16)>>>0,r=((r&1431655765)<<1|r>>>1&1431655765)>>>0,r=((r&858993459)<<2|r>>>2&858993459)>>>0,r=((r&252645135)<<4|r>>>4&252645135)>>>0,r=((r&16711935)<<8|r>>>8&16711935)>>>0,r*23283064365386963e-26}function Ro(d,r,e){const t=new Float32Array(d*r*4);for(let n=0;n<r;n++)for(let i=0;i<d;i++){const o=(i+.5)/d,a=(n+.5)/r,s=a*a,c=s*s,u=Math.sqrt(1-o*o),p=o;let f=0,h=0;for(let _=0;_<e;_++){const w=(_+.5)/e,v=No(_),x=(1-v)/(1+(c-1)*v),B=Math.sqrt(x),G=Math.sqrt(Math.max(0,1-x)),S=2*ko*w,E=G*Math.cos(S),M=B,A=u*E+p*M;if(A<=0)continue;const R=2*A*M-p,P=Math.max(0,R),b=Math.max(0,B);if(P<=0)continue;const C=c/2,g=o/(o*(1-C)+C),T=P/(P*(1-C)+C),y=g*T*A/(b*o),U=Math.pow(1-A,5);f+=y*(1-U),h+=y*U}const m=(n*d+i)*4;t[m+0]=f/e,t[m+1]=h/e,t[m+2]=0,t[m+3]=1}return t}function Io(d){const r=new Float32Array([d]),e=new Uint32Array(r.buffer)[0],t=e>>31&1,n=e>>23&255,i=e&8388607;if(n===255)return t<<15|31744|(i?1:0);if(n===0)return t<<15;const o=n-127+15;return o>=31?t<<15|31744:o<=0?t<<15:t<<15|o<<10|i>>13}function Oo(d){const r=new Uint16Array(d.length);for(let e=0;e<d.length;e++)r[e]=Io(d[e]);return r}const _n=new WeakMap;function Vo(d){const r=_n.get(d);if(r)return r;const e=Oo(Ro(64,64,512)),t=d.createTexture({label:"IBL BRDF LUT",size:{width:64,height:64},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return d.queue.writeTexture({texture:t},e,{bytesPerRow:64*8},{width:64,height:64}),_n.set(d,t),t}const gn=new WeakMap;function Do(d){const r=gn.get(d);if(r)return r;const e=d.createBindGroupLayout({label:"IblBGL0",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.COMPUTE,sampler:{type:"filtering"}}]}),t=d.createBindGroupLayout({label:"IblBGL1",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"2d"}}]}),n=d.createPipelineLayout({bindGroupLayouts:[e,t]}),i=d.createShaderModule({label:"IblCompute",code:Co}),o=d.createComputePipeline({label:"IblIrradiancePipeline",layout:n,compute:{module:i,entryPoint:"cs_irradiance"}}),a=d.createComputePipeline({label:"IblPrefilterPipeline",layout:n,compute:{module:i,entryPoint:"cs_prefilter"}}),s=d.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"clamp-to-edge"}),c={irrPipeline:o,pfPipeline:a,bgl0:e,bgl1:t,sampler:s};return gn.set(d,c),c}async function zo(d,r,e=.2){const{irrPipeline:t,pfPipeline:n,bgl0:i,bgl1:o,sampler:a}=Do(d),s=d.createTexture({label:"IBL Irradiance",size:{width:gt,height:gt,depthOrArrayLayers:6},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),c=d.createTexture({label:"IBL Prefiltered",size:{width:jt,height:jt,depthOrArrayLayers:6},mipLevelCount:_t,format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),u=(P,b)=>{const C=d.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return d.queue.writeBuffer(C,0,new Float32Array([e,P,b,0])),C},p=r.createView(),f=P=>d.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:P}},{binding:1,resource:p},{binding:2,resource:a}]}),h=P=>d.createBindGroup({layout:o,entries:[{binding:0,resource:P}]}),m=Array.from({length:6},(P,b)=>u(0,b)),_=Lo.flatMap((P,b)=>Array.from({length:6},(C,g)=>u(P,g))),w=m.map(f),v=_.map(f),x=Array.from({length:6},(P,b)=>h(s.createView({dimension:"2d",baseArrayLayer:b,arrayLayerCount:1}))),B=Array.from({length:_t*6},(P,b)=>{const C=Math.floor(b/6),g=b%6;return h(c.createView({dimension:"2d",baseMipLevel:C,mipLevelCount:1,baseArrayLayer:g,arrayLayerCount:1}))}),G=d.createCommandEncoder({label:"IblComputeEncoder"}),S=G.beginComputePass({label:"IblComputePass"});S.setPipeline(t);for(let P=0;P<6;P++)S.setBindGroup(0,w[P]),S.setBindGroup(1,x[P]),S.dispatchWorkgroups(Math.ceil(gt/8),Math.ceil(gt/8));S.setPipeline(n);for(let P=0;P<_t;P++){const b=jt>>P;for(let C=0;C<6;C++)S.setBindGroup(0,v[P*6+C]),S.setBindGroup(1,B[P*6+C]),S.dispatchWorkgroups(Math.ceil(b/8),Math.ceil(b/8))}S.end(),d.queue.submit([G.finish()]),await d.queue.onSubmittedWorkDone(),m.forEach(P=>P.destroy()),_.forEach(P=>P.destroy());const E=Vo(d),M=s.createView({dimension:"cube"}),A=c.createView({dimension:"cube"}),R=E.createView();return{irradiance:s,prefiltered:c,brdfLut:E,irradianceView:M,prefilteredView:A,brdfLutView:R,levels:_t,destroy(){s.destroy(),c.destroy()}}}class Pe{constructor(r,e){l(this,"gpuTexture");l(this,"view");l(this,"type");this.gpuTexture=r,this.type=e,this.view=r.createView({dimension:e==="cube"?"cube":e==="3d"?"3d":"2d"})}destroy(){this.gpuTexture.destroy()}static createSolid(r,e,t,n,i=255){const o=r.createTexture({size:{width:1,height:1},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return r.queue.writeTexture({texture:o},new Uint8Array([e,t,n,i]),{bytesPerRow:4},{width:1,height:1}),new Pe(o,"2d")}static fromBitmap(r,e,{srgb:t=!1,usage:n}={}){const i=t?"rgba8unorm-srgb":"rgba8unorm";n=n?n|(GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT):GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT;const o=r.createTexture({size:{width:e.width,height:e.height},format:i,usage:n});return r.queue.copyExternalImageToTexture({source:e,flipY:!1},{texture:o},{width:e.width,height:e.height}),new Pe(o,"2d")}static async fromUrl(r,e,t={}){const n=await(await fetch(e)).blob(),i={colorSpaceConversion:"none"};t.resizeWidth!==void 0&&t.resizeHeight!==void 0&&(i.resizeWidth=t.resizeWidth,i.resizeHeight=t.resizeHeight,i.resizeQuality="high");const o=await createImageBitmap(n,i);return Pe.fromBitmap(r,o,t)}}const Fo=`// Decodes an RGBE (Radiance HDR) texture into a linear rgba16float texture.\r
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
`;function Ho(d){const r=new Uint8Array(d);let e=0;function t(){let f="";for(;e<r.length&&r[e]!==10;)r[e]!==13&&(f+=String.fromCharCode(r[e])),e++;return e<r.length&&e++,f}const n=t();if(!n.startsWith("#?RADIANCE")&&!n.startsWith("#?RGBE"))throw new Error(`Not a Radiance HDR file (magic: "${n}")`);for(;t().length!==0;);const i=t(),o=i.match(/-Y\s+(\d+)\s+\+X\s+(\d+)/);if(!o)throw new Error(`Unrecognized HDR resolution: "${i}"`);const a=parseInt(o[1],10),s=parseInt(o[2],10),c=new Uint8Array(s*a*4);function u(f){const h=new Uint8Array(s),m=new Uint8Array(s),_=new Uint8Array(s),w=new Uint8Array(s),v=[h,m,_,w];for(let B=0;B<4;B++){const G=v[B];let S=0;for(;S<s;){const E=r[e++];if(E>128){const M=E-128,A=r[e++];G.fill(A,S,S+M),S+=M}else G.set(r.subarray(e,e+E),S),e+=E,S+=E}}const x=f*s*4;for(let B=0;B<s;B++)c[x+B*4+0]=h[B],c[x+B*4+1]=m[B],c[x+B*4+2]=_[B],c[x+B*4+3]=w[B]}function p(f,h,m,_,w){const v=f*s*4;c[v+0]=h,c[v+1]=m,c[v+2]=_,c[v+3]=w;let x=1;for(;x<s;){const B=r[e++],G=r[e++],S=r[e++],E=r[e++];if(B===1&&G===1&&S===1){const M=v+(x-1)*4;for(let A=0;A<E;A++)c[v+x*4+0]=c[M+0],c[v+x*4+1]=c[M+1],c[v+x*4+2]=c[M+2],c[v+x*4+3]=c[M+3],x++}else c[v+x*4+0]=B,c[v+x*4+1]=G,c[v+x*4+2]=S,c[v+x*4+3]=E,x++}}for(let f=0;f<a&&!(e+4>r.length);f++){const h=r[e++],m=r[e++],_=r[e++],w=r[e++];if(h===2&&m===2&&!(_&128)){const v=_<<8|w;if(v!==s)throw new Error(`HDR scanline width mismatch: ${v} vs ${s}`);u(f)}else p(f,h,m,_,w)}return{width:s,height:a,data:c}}const vn=new WeakMap;function Wo(d){const r=vn.get(d);if(r)return r;const e=d.createBindGroupLayout({label:"RgbeSrcBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"uint"}}]}),t=d.createBindGroupLayout({label:"RgbeDstBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"2d"}}]}),n=d.createPipelineLayout({bindGroupLayouts:[e,t]}),i=d.createShaderModule({label:"RgbeDecode",code:Fo}),a={pipeline:d.createComputePipeline({label:"RgbeDecodePipeline",layout:n,compute:{module:i,entryPoint:"cs_decode"}}),srcBGL:e,dstBGL:t};return vn.set(d,a),a}async function qo(d,r){const{width:e,height:t,data:n}=r,{pipeline:i,srcBGL:o,dstBGL:a}=Wo(d),s=d.createTexture({label:"Sky RGBE Raw",size:{width:e,height:t},format:"rgba8uint",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});d.queue.writeTexture({texture:s},n.buffer,{bytesPerRow:e*4},{width:e,height:t});const c=d.createTexture({label:"Sky HDR Texture",size:{width:e,height:t},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),u=d.createBindGroup({layout:o,entries:[{binding:0,resource:s.createView()}]}),p=d.createBindGroup({layout:a,entries:[{binding:0,resource:c.createView()}]}),f=d.createCommandEncoder({label:"RgbeDecodeEncoder"}),h=f.beginComputePass({label:"RgbeDecodePass"});return h.setPipeline(i),h.setBindGroup(0,u),h.setBindGroup(1,p),h.dispatchWorkgroups(Math.ceil(e/8),Math.ceil(t/8)),h.end(),d.queue.submit([f.finish()]),await d.queue.onSubmittedWorkDone(),s.destroy(),new Pe(c,"2d")}class vr{constructor(r,e,t,n,i,o,a){l(this,"colorAtlas");l(this,"normalAtlas");l(this,"merAtlas");l(this,"heightAtlas");l(this,"blockSize");l(this,"blockCount");l(this,"_atlasWidth");l(this,"_atlasHeight");this.colorAtlas=r,this.normalAtlas=e,this.merAtlas=t,this.heightAtlas=n,this.blockSize=i,this._atlasWidth=o,this._atlasHeight=a,this.blockCount=Math.floor(o/i)}static async load(r,e,t,n,i,o=16){async function a(x){const B=await(await fetch(x)).blob();return createImageBitmap(B,{colorSpaceConversion:"none"})}const[s,c,u,p]=await Promise.all([a(e),a(t),a(n),a(i)]),f=s.width,h=s.height,m=Pe.fromBitmap(r,s,{srgb:!0}),_=Pe.fromBitmap(r,c,{srgb:!1}),w=Pe.fromBitmap(r,u,{srgb:!1}),v=Pe.fromBitmap(r,p,{srgb:!1});return new vr(m,_,w,v,o,f,h)}uvTransform(r){const e=this.blockSize/this._atlasWidth,t=this.blockSize/this._atlasHeight;return[r*e,0,e,t]}destroy(){this.colorAtlas.destroy(),this.normalAtlas.destroy(),this.merAtlas.destroy(),this.heightAtlas.destroy()}}var we=(d=>(d[d.None=0]="None",d[d.SnowyMountains=1]="SnowyMountains",d[d.RockyMountains=2]="RockyMountains",d[d.GrassyPlains=3]="GrassyPlains",d[d.SnowyPlains=4]="SnowyPlains",d[d.Desert=5]="Desert",d[d.Max=6]="Max",d))(we||{}),Ye=(d=>(d[d.None=0]="None",d[d.Rain=1]="Rain",d[d.Snow=2]="Snow",d))(Ye||{});function jo(d){switch(d){case 1:return 2;case 4:return 2;default:return 0}}function bn(d){switch(d){case 1:return{cloudBase:90,cloudTop:200};case 2:return{cloudBase:75,cloudTop:160};default:return{cloudBase:75,cloudTop:105}}}const vt=.05,Yo=[[.35,5,3],[-.15,3,4],[-.3,4,1],[-.5,1,2]];function Xo(d){for(const[e,t,n]of Yo){const i=d-e;if(i>=-vt&&i<=vt)return{biome1:n,biome2:t,blend:(i+vt)/(2*vt)}}const r=$o(d);return{biome1:r,biome2:r,blend:0}}function $o(d){return d>.35?5:d>-.15?3:d>-.3?4:d>-.5?1:2}function yn(d){switch(d){case 1:return 1.2;case 4:return 1;case 3:return .75;case 2:return .9;case 5:return .15;default:return .55}}function Ko(d,r){let e=(Math.imul(d|0,2654435769)^Math.imul(r|0,1367130551))>>>0;return e=Math.imul(e^e>>>16,73244475)>>>0,e=(e^e>>>16)>>>0,e/4294967296}const F=class F{constructor(r,e,t){l(this,"blocks",new Uint8Array(F.CHUNK_WIDTH*F.CHUNK_HEIGHT*F.CHUNK_DEPTH));l(this,"globalPosition",new O);l(this,"opaqueIndex",-1);l(this,"transparentIndex",-1);l(this,"waterIndex",-1);l(this,"drawCommandIndex",-1);l(this,"chunkDataIndex",-1);l(this,"aabbTreeIndex",-1);l(this,"aliveBlocks",0);l(this,"opaqueBlocks",0);l(this,"transparentBlocks",0);l(this,"waterBlocks",0);l(this,"lightBlocks",0);l(this,"isDeleted",!1);this.globalPosition.set(r,e,t)}generateVertices(r){const e=F.CHUNK_WIDTH,t=F.CHUNK_HEIGHT,n=F.CHUNK_DEPTH,i=5;let o=0,a=0,s=0;for(let g=0;g<this.blocks.length;g++){const T=this.blocks[g];T===L.NONE||se(T)||(Se(T)?s++:lt(T)?a++:o++)}const c=new Float32Array(o*36*i),u=new Float32Array(a*36*i),p=new Float32Array(s*6*i),f=new Uint16Array(e*t*6);let h=0,m=0,_=0,w=!1;const v=[],x=e+2,B=t+2,G=x*B,S=new Uint8Array(x*B*(n+2));for(let g=0;g<n;g++)for(let T=0;T<t;T++)for(let y=0;y<e;y++)S[y+1+(T+1)*x+(g+1)*G]=this.blocks[y+T*e+g*e*t];if(r!=null&&r.negX){const g=r.negX;for(let T=0;T<n;T++)for(let y=0;y<t;y++)S[0+(y+1)*x+(T+1)*G]=g[e-1+y*e+T*e*t]}if(r!=null&&r.posX){const g=r.posX;for(let T=0;T<n;T++)for(let y=0;y<t;y++)S[e+1+(y+1)*x+(T+1)*G]=g[0+y*e+T*e*t]}if(r!=null&&r.negY){const g=r.negY;for(let T=0;T<n;T++)for(let y=0;y<e;y++)S[y+1+0+(T+1)*G]=g[y+(t-1)*e+T*e*t]}if(r!=null&&r.posY){const g=r.posY;for(let T=0;T<n;T++)for(let y=0;y<e;y++)S[y+1+(t+1)*x+(T+1)*G]=g[y+0*e+T*e*t]}if(r!=null&&r.negZ){const g=r.negZ;for(let T=0;T<t;T++)for(let y=0;y<e;y++)S[y+1+(T+1)*x+0]=g[y+T*e+(n-1)*e*t]}if(r!=null&&r.posZ){const g=r.posZ;for(let T=0;T<t;T++)for(let y=0;y<e;y++)S[y+1+(T+1)*x+(n+1)*G]=g[y+T*e+0*e*t]}const E=(g,T,y,U)=>{f[(g*t+T)*6+U]|=1<<y},M=(g,T,y,U)=>(f[(g*t+T)*6+U]&1<<y)!==0,A=(g,T,y)=>S[g+1+(T+1)*x+(y+1)*G],R=(g,T)=>!(T===L.NONE||Se(g)||Se(T)||!se(g)&&se(T)),P=F.CUBE_VERTS;for(let g=0;g<e;g++)for(let T=0;T<t;T++)for(let y=0;y<n;y++){const U=A(g,T,y);if(U===L.NONE)continue;if(se(U)){v.push({x:g,y:T,z:y}),w=!0;continue}if(Se(U)){for(let q=0;q<6;q++)p[_++]=g+.5,p[_++]=T+.5,p[_++]=y+.5,p[_++]=6,p[_++]=U;continue}const V=lt(U),z=R(U,A(g,T,y-1))||M(g,T,y,0),I=R(U,A(g,T,y+1))||M(g,T,y,1),K=R(U,A(g-1,T,y))||M(g,T,y,2),de=R(U,A(g+1,T,y))||M(g,T,y,3),fe=R(U,A(g,T-1,y))||M(g,T,y,4),ee=R(U,A(g,T+1,y))||M(g,T,y,5);if(z&&I&&K&&de&&fe&&ee)continue;let re=T;if(!z||!I||!K||!de){let q=T;for(;q<t&&A(g,q,y)===U;){re=q;q++}}if(!z||!I){let q=g,$=g,W=0;for(;$<e&&A($,T,y)===U;){let H=T;for(;H<=re&&A($,H,y)===U;){W=H;H++}if(W===re)q=$,$++;else break}for(let H=g;H<=q;H++)for(let ne=T;ne<=re;ne++)z||E(H,ne,y,0),I||E(H,ne,y,1);let Y,te;!z&&!I?(Y=0,te=12):z?(Y=6,te=12):(Y=0,te=6);const me=q+1-g,ve=re+1-T,pe=V?u:c;let le=V?m:h;for(let H=Y;H<te;H++){const ne=P[H*3],oe=P[H*3+1],ye=P[H*3+2];pe[le++]=g+.5*(me-1)+.5+ne*me,pe[le++]=T+.5*(ve-1)+.5+oe*ve,pe[le++]=y+.5+ye,pe[le++]=H<6?0:1,pe[le++]=U}V?m=le:h=le}if(!K||!de){let q=y,$=y,W=0;for(;$<n&&A(g,T,$)===U;){let H=T;for(;H<=re&&A(g,H,$)===U;){W=H;H++}if(W===re)q=$,$++;else break}for(let H=y;H<=q;H++)for(let ne=T;ne<=re;ne++)K||E(g,ne,H,2),de||E(g,ne,H,3);let Y,te;!K&&!de?(Y=12,te=24):K?(Y=18,te=24):(Y=12,te=18);const me=q+1-y,ve=re+1-T,pe=V?u:c;let le=V?m:h;for(let H=Y;H<te;H++){const ne=P[H*3],oe=P[H*3+1],ye=P[H*3+2];pe[le++]=g+.5+ne,pe[le++]=T+.5*(ve-1)+.5+oe*ve,pe[le++]=y+.5*(me-1)+.5+ye*me,pe[le++]=H<18?2:3,pe[le++]=U}V?m=le:h=le}if(!fe||!ee){let q=g,$=g;for(;$<e&&A($,T,y)===U;){q=$;$++}let W=y,Y=y,te=0;for(;Y<n&&A(g,T,Y)===U;){let oe=g;for(;oe<=q&&A(oe,T,Y)===U;){te=oe;oe++}if(te===q)W=Y,Y++;else break}for(let oe=g;oe<=q;oe++)for(let ye=y;ye<=W;ye++)fe||E(oe,T,ye,4),ee||E(oe,T,ye,5);let me,ve;!fe&&!ee?(me=24,ve=36):fe?(me=30,ve=36):(me=24,ve=30);const pe=q+1-g,le=W+1-y,H=V?u:c;let ne=V?m:h;for(let oe=me;oe<ve;oe++){const ye=P[oe*3],J=P[oe*3+1],ue=P[oe*3+2];H[ne++]=g+.5*(pe-1)+.5+ye*pe,H[ne++]=T+.5+J,H[ne++]=y+.5*(le-1)+.5+ue*le,H[ne++]=oe<30?4:5,H[ne++]=U}V?m=ne:h=ne}}let b=null,C=0;if(w){b=new Float32Array(v.length*6*6*3);let g=0;for(const T of v){const{x:y,y:U,z:N}=T,V=y+1,z=U+1,I=N+1,K=S[V+(z+1)*x+I*G];se(K)||(b[g++]=y,b[g++]=U+1,b[g++]=N,b[g++]=y+1,b[g++]=U+1,b[g++]=N,b[g++]=y+1,b[g++]=U+1,b[g++]=N+1,b[g++]=y,b[g++]=U+1,b[g++]=N,b[g++]=y,b[g++]=U+1,b[g++]=N+1,b[g++]=y+1,b[g++]=U+1,b[g++]=N+1);const de=S[V+z*x+(I+1)*G],fe=N===n-1;!se(de)&&!(fe&&de===L.NONE)&&(b[g++]=y,b[g++]=U,b[g++]=N+1,b[g++]=y+1,b[g++]=U,b[g++]=N+1,b[g++]=y+1,b[g++]=U+1,b[g++]=N+1,b[g++]=y,b[g++]=U,b[g++]=N+1,b[g++]=y,b[g++]=U+1,b[g++]=N+1,b[g++]=y+1,b[g++]=U+1,b[g++]=N+1);const ee=S[V+z*x+(I-1)*G],re=N===0;!se(ee)&&!(re&&ee===L.NONE)&&(b[g++]=y+1,b[g++]=U,b[g++]=N,b[g++]=y,b[g++]=U,b[g++]=N,b[g++]=y,b[g++]=U+1,b[g++]=N,b[g++]=y+1,b[g++]=U,b[g++]=N,b[g++]=y+1,b[g++]=U+1,b[g++]=N,b[g++]=y,b[g++]=U+1,b[g++]=N);const q=S[V+1+z*x+I*G],$=y===e-1;!se(q)&&!($&&q===L.NONE)&&(b[g++]=y+1,b[g++]=U,b[g++]=N,b[g++]=y+1,b[g++]=U+1,b[g++]=N,b[g++]=y+1,b[g++]=U+1,b[g++]=N+1,b[g++]=y+1,b[g++]=U,b[g++]=N,b[g++]=y+1,b[g++]=U,b[g++]=N+1,b[g++]=y+1,b[g++]=U+1,b[g++]=N+1);const W=S[V-1+z*x+I*G],Y=y===0;!se(W)&&!(Y&&W===L.NONE)&&(b[g++]=y,b[g++]=U,b[g++]=N+1,b[g++]=y,b[g++]=U+1,b[g++]=N+1,b[g++]=y,b[g++]=U+1,b[g++]=N,b[g++]=y,b[g++]=U,b[g++]=N+1,b[g++]=y,b[g++]=U,b[g++]=N,b[g++]=y,b[g++]=U+1,b[g++]=N);const te=S[V+(z-1)*x+I*G];se(te)||(b[g++]=y,b[g++]=U,b[g++]=N+1,b[g++]=y+1,b[g++]=U,b[g++]=N+1,b[g++]=y+1,b[g++]=U,b[g++]=N,b[g++]=y,b[g++]=U,b[g++]=N+1,b[g++]=y,b[g++]=U,b[g++]=N,b[g++]=y+1,b[g++]=U,b[g++]=N)}C=g/3,b=b.subarray(0,g)}return{opaque:c.subarray(0,h),opaqueCount:h/i,transparent:u.subarray(0,m),transparentCount:m/i,water:b||new Float32Array(0),waterCount:C,prop:p.subarray(0,_),propCount:_/i}}generateBlocks(r,e){const t=F.CHUNK_WIDTH,n=F.CHUNK_HEIGHT,i=F.CHUNK_DEPTH,o=new Float64Array(t*i),a=new Float64Array(t*i),s=new Float32Array(t*i),c=new Uint8Array(t*i),u=new Uint8Array(t*i),p=new Float32Array(t*i);for(let f=0;f<i;f++)for(let h=0;h<t;h++){const m=h+this.globalPosition.x,_=f+this.globalPosition.z,w=h+f*t,v=xe(m/512,-5,_/512,0,0,0,r+31337),x=xe(m/2048,10,_/2048,0,0,0,r);o[w]=Math.abs(xe(m/1024,0,_/1024,0,0,0,r)*450)*Math.max(.1,(x+1)*.5),a[w]=Tn(m/256,15,_/256,2,.6,1.2,6)*12,s[w]=e?e(m,_):0;const B=Xo(v);c[w]=B.biome1,u[w]=B.biome2,p[w]=B.blend}for(let f=0;f<i;f++)for(let h=0;h<n;h++)for(let m=0;m<t;m++){if(this.getBlock(m,h,f)!==L.NONE)continue;const _=m+f*t,w=m+this.globalPosition.x,v=h+this.globalPosition.y,x=f+this.globalPosition.z,B=Math.abs(xe(w/256,v/512,x/256,0,0,0,r)*o[_])+a[_]+s[_];v<B?F._isCave(w,v,x,r,B-v)?v<F.SEA_LEVEL+1?this.setBlock(m,h,f,L.WATER):this.setBlock(m,h,f,L.NONE):this.setBlock(m,h,f,this._generateBlockBasedOnBiome(c[_],u[_],p[_],w,v,x,B)):v<F.SEA_LEVEL+1&&this.setBlock(m,h,f,L.WATER)}for(let f=0;f<F.CHUNK_DEPTH;f++)for(let h=0;h<F.CHUNK_HEIGHT;h++)for(let m=0;m<F.CHUNK_WIDTH;m++){if(this.getBlock(m,h,f)===L.NONE)continue;const _=m+this.globalPosition.x,w=h+this.globalPosition.y,v=f+this.globalPosition.z;this._generateAdditionalBlocks(m,h,f,_,w,v,r)}}setBlock(r,e,t,n){if(r<0||r>=F.CHUNK_WIDTH||e<0||e>=F.CHUNK_HEIGHT||t<0||t>=F.CHUNK_DEPTH)return;const i=r+e*F.CHUNK_WIDTH+t*F.CHUNK_WIDTH*F.CHUNK_HEIGHT,o=this.blocks[i];o!==L.NONE&&(this.aliveBlocks--,se(o)?this.waterBlocks--:lt(o)?this.transparentBlocks--:this.opaqueBlocks--,Dr(o)&&this.lightBlocks--),this.blocks[i]=n,n!==L.NONE&&(this.aliveBlocks++,se(n)?this.waterBlocks++:lt(n)?this.transparentBlocks++:this.opaqueBlocks++,Dr(n)&&this.lightBlocks++)}getBlock(r,e,t){if(r<0||r>=F.CHUNK_WIDTH||e<0||e>=F.CHUNK_HEIGHT||t<0||t>=F.CHUNK_DEPTH)return L.NONE;const n=r+e*F.CHUNK_WIDTH+t*F.CHUNK_WIDTH*F.CHUNK_HEIGHT;return this.blocks[n]}getBlockIndex(r,e,t){return r<0||r>=F.CHUNK_WIDTH||e<0||e>=F.CHUNK_HEIGHT||t<0||t>=F.CHUNK_DEPTH?-1:r+e*F.CHUNK_WIDTH+t*F.CHUNK_WIDTH*F.CHUNK_HEIGHT}_generateAdditionalBlocks(r,e,t,n,i,o,a){const s=this.getBlock(r,e,t),c=this.getBlock(r-1,e,t),u=this.getBlock(r+1,e,t),p=this.getBlock(r,e,t+1),f=this.getBlock(r,e,t-1),h=this.getBlock(r,e+1,t);if(s==L.SAND)if(i>0&&be.global.randomUint32()%512==0){const m=be.global.randomUint32()%5;for(let _=0;_<m;_++)this.setBlock(r,e+_,t,L.CACTUS)}else be.global.randomUint32()%128==0&&this.setBlock(r,e+1,t,L.DEAD_BUSH);else if(s==L.SNOW||s==L.GRASS_SNOW){if(be.global.randomUint32()%16==0&&i>12&&(h==L.NONE||se(h))&&(c==L.NONE||f==L.NONE))this.setBlock(r,e+1,t,L.DEAD_BUSH);else if(be.global.randomUint32()%16==0&&i>12&&i<300&&e<F.CHUNK_HEIGHT-5&&r>2&&t>2&&r<F.CHUNK_WIDTH-2&&t<F.CHUNK_DEPTH-2&&h==L.NONE&&u==L.NONE&&p==L.NONE&&f==L.NONE){const _=Math.max(be.global.randomUint32()%5,5);for(let w=0;w<_;w++)this.setBlock(r,e+w,t,L.TRUNK);for(let w=-2;w<=2;w++){const v=w<-1||w>1?0:-1,x=w<-1||w>1?0:1;for(let B=-1+v;B<=1+x;B++){const G=Math.abs(B-r);for(let S=-1+v;S<=1+x;S++){const E=Math.abs(S-t),M=B*B+w*w+S*S,A=this.getBlock(r+B,e+_+w,t+S);M+2<be.global.randomUint32()%24&&G!=2-v&&G!=2+x&&E!=2-v&&E!=2+x&&(A==L.NONE||A==L.SNOWYLEAVES)&&this.setBlock(r+B,e+_+w,t+S,L.SNOWYLEAVES)}}}}}else if(s==L.GRASS||s==L.DIRT)if(be.global.randomUint32()%2==0&&i>5&&i<300&&e<F.CHUNK_HEIGHT-5&&r>2&&t>2&&r<F.CHUNK_WIDTH-2&&t<F.CHUNK_DEPTH-2&&h==L.NONE&&u==L.NONE&&p==L.NONE&&f==L.NONE){const _=Math.max(be.global.randomUint32()%5,5);for(let w=0;w<_;w++)this.setBlock(r,e+w,t,L.TRUNK);for(let w=-2;w<=2;w++){const v=w<-1||w>1?0:-1,x=w<-1||w>1?0:1;for(let B=-1+v;B<=1+x;B++){const G=Math.abs(B-r);for(let S=-1+v;S<=1+x;S++){const E=Math.abs(S-t),M=B*B+w*w+S*S,A=this.getBlock(r+B,e+_+w,t+S);M+2<be.global.randomUint32()%24&&G!=2-v&&G!=2+x&&E!=2-v&&E!=2+x&&(A==L.NONE||A==L.TREELEAVES)&&this.setBlock(r+B,e+_+w,t+S,L.TREELEAVES)}}}}else i>5&&h==L.NONE&&(c==L.NONE||f==L.NONE)&&(be.global.randomUint32()%8==0?this.setBlock(r,e+1,t,L.GRASS_PROP):be.global.randomUint32()%8==0&&this.setBlock(r,e+1,t,L.FLOWER))}_generateBlockBasedOnBiome(r,e,t,n,i,o,a){const s=t>0&&r!==e&&Ko(n,o)<t?e:r,c=Math.floor(a)-i,u=a<F.SEA_LEVEL+1;switch(s){case we.GrassyPlains:return c===0?u?L.DIRT:L.GRASS:c<=3?L.DIRT:L.STONE;case we.Desert:return c<=3?L.SAND:L.STONE;case we.SnowyPlains:return c===0?L.GRASS_SNOW:c<=2?L.SNOW:L.STONE;case we.SnowyMountains:{const p=Math.abs(Vr(n/256,i/256,o/256,2,.6,1))*35;return c===0?L.GRASS_SNOW:c<=4||p>20?L.SNOW:L.STONE}case we.RockyMountains:return c===0&&Math.abs(Vr(n/64,i/64,o/64,2,.6,1))<.12?L.SNOW:L.STONE;default:return L.GRASS}}static _determineBiomeFromNoise(r){return r>.35?we.Desert:r>-.15?we.GrassyPlains:r>-.3?we.SnowyPlains:r>-.5?we.SnowyMountains:we.RockyMountains}static _determineBiome(r,e,t,n){const i=xe(r/512,-5,t/512,0,0,0,n+31337);return F._determineBiomeFromNoise(i)}static _isCave(r,e,t,n,i){if(i<3)return!1;if(xe(r/60,e/60,t/60,0,0,0,n+777)>.6)return!0;const a=xe(r/24,e/24,t/24,0,0,0,n+13579),s=xe(r/24,e/14,t/24,0,0,0,n+24680);if(Math.abs(a)<.12&&Math.abs(s)<.12)return!0;const c=xe(r/28,e/18,t/28,0,0,0,n+55555),u=xe(r/28,e/28,t/28,0,0,0,n+99999);return Math.abs(c)<.1&&Math.abs(u)<.1}};l(F,"CHUNK_WIDTH",16),l(F,"CHUNK_HEIGHT",16),l(F,"CHUNK_DEPTH",16),l(F,"SEA_LEVEL",15),l(F,"CUBE_VERTS",new Float32Array([-.5,-.5,-.5,.5,.5,-.5,.5,-.5,-.5,.5,.5,-.5,-.5,-.5,-.5,-.5,.5,-.5,-.5,-.5,.5,.5,-.5,.5,.5,.5,.5,.5,.5,.5,-.5,.5,.5,-.5,-.5,.5,-.5,.5,.5,-.5,.5,-.5,-.5,-.5,-.5,-.5,-.5,-.5,-.5,-.5,.5,-.5,.5,.5,.5,.5,.5,.5,-.5,-.5,.5,.5,-.5,.5,-.5,-.5,.5,.5,.5,.5,-.5,.5,-.5,-.5,-.5,.5,-.5,-.5,.5,-.5,.5,.5,-.5,.5,-.5,-.5,.5,-.5,-.5,-.5,-.5,.5,-.5,.5,.5,.5,.5,.5,-.5,.5,.5,.5,-.5,.5,-.5,-.5,.5,.5]));let X=F;const Rn=128;function Zo(d,r,e){const t=xe(d/2048,10,r/2048,0,0,0,e),n=Math.abs(xe(d/1024,0,r/1024,0,0,0,e)*450)*Math.max(.1,(t+1)*.5),i=Tn(d/256,15,r/256,2,.6,1.2,6)*12;return Math.abs(xe(d/256,0,r/256,0,0,0,e)*n)+i}function xn(d,r,e,t){const n=e|0,i=t|0,o=e-n,a=t-i,s=d[n+i*r],c=d[n+1+i*r],u=d[n+(i+1)*r],p=d[n+1+(i+1)*r];return[(c-s)*(1-a)+(p-u)*a,(u-s)*(1-o)+(p-c)*o,s*(1-o)*(1-a)+c*o*(1-a)+u*(1-o)*a+p*o*a]}function wn(d){return Math.imul(d,1664525)+1013904223>>>0}function Qo(d,r,e){const t=r*r>>2,n=.05,i=4,o=.01,a=.4,s=.3,c=.01,u=4,p=20,f=2,h=f*2+1,m=new Float32Array(h*h);let _=0;for(let x=-f;x<=f;x++)for(let B=-f;B<=f;B++){const G=Math.sqrt(B*B+x*x);if(G<f){const S=1-G/f;m[B+f+(x+f)*h]=S,_+=S}}for(let x=0;x<m.length;x++)m[x]/=_;const w=r-2;let v=(e^3735928559)>>>0;for(let x=0;x<t;x++){v=wn(v);let B=v/4294967295*w;v=wn(v);let G=v/4294967295*w,S=0,E=0,M=1,A=1,R=0;for(let P=0;P<p;P++){const b=B|0,C=G|0;if(b<0||b>=w||C<0||C>=w)break;const g=B-b,T=G-C,[y,U,N]=xn(d,r,B,G);S=S*n-y*(1-n),E=E*n-U*(1-n);const V=Math.sqrt(S*S+E*E);if(V<1e-6)break;S/=V,E/=V;const z=B+S,I=G+E;if(z<0||z>=w||I<0||I>=w)break;const[,,K]=xn(d,r,z,I),de=K-N,fe=Math.max(-de*M*A*i,o);if(R>fe||de>0){const ee=de>0?Math.min(de,R):(R-fe)*s;R-=ee,d[b+C*r]+=ee*(1-g)*(1-T),d[b+1+C*r]+=ee*g*(1-T),d[b+(C+1)*r]+=ee*(1-g)*T,d[b+1+(C+1)*r]+=ee*g*T}else{const ee=Math.min((fe-R)*a,-de);for(let re=-f;re<=f;re++)for(let q=-f;q<=f;q++){const $=b+q,W=C+re;$<0||$>=r||W<0||W>=r||(d[$+W*r]-=m[q+f+(re+f)*h]*ee)}R+=ee}M=Math.sqrt(Math.max(M*M+de*u,0)),A*=1-c,B=z,G=I}}}function Jo(d,r,e){const t=Rn,n=d*t,i=r*t,o=new Float32Array(t*t);for(let p=0;p<t;p++)for(let f=0;f<t;f++)o[f+p*t]=Zo(n+f,i+p,e);const a=new Float32Array(o),s=(e^(Math.imul(d,73856093)^Math.imul(r,19349663)))>>>0;Qo(a,t,s);const c=12,u=new Float32Array(t*t);for(let p=0;p<t;p++)for(let f=0;f<t;f++){const h=f+p*t,m=Math.min(f,t-1-f,p,t-1-p),_=Math.min(m/c,1);u[h]=(a[h]-o[h])*_}return u}const D=class D{constructor(r){l(this,"seed");l(this,"renderDistanceH",8);l(this,"renderDistanceV",4);l(this,"chunksPerFrame",2);l(this,"time",0);l(this,"waterSimulationRadius",32);l(this,"waterTickInterval",.25);l(this,"_waterTickTimer",0);l(this,"_dirtyChunks",null);l(this,"onChunkAdded");l(this,"onChunkUpdated");l(this,"onChunkRemoved");l(this,"_chunks",new Map);l(this,"_generated",new Set);l(this,"_erosionCache",new Map);l(this,"pendingChunks",0);l(this,"_neighborScratch",{negX:void 0,posX:void 0,negY:void 0,posY:void 0,negZ:void 0,posZ:void 0});l(this,"_scratchTopD2",null);l(this,"_scratchTopXYZ",null);l(this,"_scratchToDelete",[]);l(this,"_scratchWaterBlocks",[]);l(this,"_scratchDirtyChunks",new Set);this.seed=r}get chunkCount(){return this._chunks.size}get chunks(){return this._chunks.values()}getBiomeAt(r,e,t){return X._determineBiome(r,e,t,this.seed)}static normalizeChunkPosition(r,e,t){return[Math.floor(r/X.CHUNK_WIDTH),Math.floor(e/X.CHUNK_HEIGHT),Math.floor(t/X.CHUNK_DEPTH)]}static _cx(r){return Math.floor(r/X.CHUNK_WIDTH)}static _cy(r){return Math.floor(r/X.CHUNK_HEIGHT)}static _cz(r){return Math.floor(r/X.CHUNK_DEPTH)}static _key(r,e,t){return(r+32768)*4294967296+(e+32768)*65536+(t+32768)}getChunk(r,e,t){return this._chunks.get(D._key(D._cx(r),D._cy(e),D._cz(t)))}chunkExists(r,e,t){return this.getChunk(r,e,t)!==void 0}getBlockType(r,e,t){const n=this.getChunk(r,e,t);if(!n)return L.NONE;const i=Math.round(r)-n.globalPosition.x,o=Math.round(e)-n.globalPosition.y,a=Math.round(t)-n.globalPosition.z;return n.getBlock(i,o,a)}setBlockType(r,e,t,n){let i=this.getChunk(r,e,t);if(!i){const c=D._cx(r),u=D._cy(e),p=D._cz(t);i=new X(c*X.CHUNK_WIDTH,u*X.CHUNK_HEIGHT,p*X.CHUNK_DEPTH),this._insertChunk(i)}const o=Math.round(r)-i.globalPosition.x,a=Math.round(e)-i.globalPosition.y,s=Math.round(t)-i.globalPosition.z;return i.setBlock(o,a,s,n),this._updateChunk(i,o,a,s),!0}getTopBlockY(r,e,t){const n=X.CHUNK_HEIGHT,i=Math.floor(r),o=Math.floor(e);for(let a=Math.floor(t/n);a>=0;a--){const s=this.getChunk(i,a*n,o);if(!s)continue;const c=i-s.globalPosition.x,u=o-s.globalPosition.z;for(let p=n-1;p>=0;p--){const f=s.getBlock(c,p,u);if(f!==L.NONE&&!Se(f))return s.globalPosition.y+p+1}}return 0}getBlockByRay(r,e,t){const n=Number.MAX_VALUE;let i=Math.floor(r.x),o=Math.floor(r.y),a=Math.floor(r.z);const s=1/e.x,c=1/e.y,u=1/e.z,p=e.x>0?1:-1,f=e.y>0?1:-1,h=e.z>0?1:-1,m=Math.min(s*p,n),_=Math.min(c*f,n),w=Math.min(u*h,n);let v=Math.abs((i+Math.max(p,0)-r.x)*s),x=Math.abs((o+Math.max(f,0)-r.y)*c),B=Math.abs((a+Math.max(h,0)-r.z)*u),G=0,S=0,E=0;for(let M=0;M<t;M++){if(M>0){const A=this.getChunk(i,o,a);if(A){const R=i-A.globalPosition.x,P=o-A.globalPosition.y,b=a-A.globalPosition.z,C=A.getBlock(R,P,b);if(C!==L.NONE&&!se(C))return{blockType:C,position:new O(i,o,a),face:new O(-G*p,-S*f,-E*h),chunk:A,relativePosition:new O(R,P,b)}}}G=(v<=B?1:0)*(v<=x?1:0),S=(x<=v?1:0)*(x<=B?1:0),E=(B<=x?1:0)*(B<=v?1:0),v+=m*G,x+=_*S,B+=w*E,i+=p*G,o+=f*S,a+=h*E}return null}addBlock(r,e,t,n,i,o,a){if(a===L.NONE||!this.getChunk(r,e,t))return!1;const c=this.getBlockType(r,e,t);if(Se(c))return!1;const u=r+n,p=e+i,f=t+o,h=this.getBlockType(u,p,f);if(se(a)){if(h!==L.NONE&&!se(h))return!1}else if(h!==L.NONE&&!se(h))return!1;let m=this.getChunk(u,p,f);if(!m){const x=D._cx(u),B=D._cy(p),G=D._cz(f);m=new X(x*X.CHUNK_WIDTH,B*X.CHUNK_HEIGHT,G*X.CHUNK_DEPTH),this._insertChunk(m)}const _=u-m.globalPosition.x,w=p-m.globalPosition.y,v=f-m.globalPosition.z;return m.setBlock(_,w,v,a),this._updateChunk(m,_,w,v),!0}mineBlock(r,e,t){const n=this.getChunk(r,e,t);if(!n)return!1;const i=r-n.globalPosition.x,o=e-n.globalPosition.y,a=t-n.globalPosition.z,s=n.getBlock(i,o,a);return s===L.NONE?!1:se(s)?(n.setBlock(i,o,a,L.NONE),this._updateChunk(n,i,o,a),!0):(n.setBlock(i,o,a,L.NONE),this._updateChunk(n,i,o,a),!0)}update(r,e){this.time+=e,this._removeDistantChunks(r),this._createNearbyChunks(r),this._waterTickTimer+=e,this._waterTickTimer>=this.waterTickInterval&&(this._waterTickTimer=0,this._updateWaterFlow(r))}deleteChunk(r){var o;const e=D._cx(r.globalPosition.x),t=D._cy(r.globalPosition.y),n=D._cz(r.globalPosition.z),i=D._key(e,t,n);this._chunks.delete(i),this._generated.delete(i),r.isDeleted=!0,(o=this.onChunkRemoved)==null||o.call(this,r)}calcWaterLevel(r,e,t){const n=this.getChunk(r,e,t);if(!n||n.waterBlocks<=0)return 0;let i=this._calcWaterLevelInChunk(n,e);for(let o=1;o<=4;o++){const a=this.getChunk(r,e+o*X.CHUNK_HEIGHT,t);if(!a)break;const s=D._cx(r),c=D._cz(t),u=s*X.CHUNK_WIDTH-a.globalPosition.x,p=c*X.CHUNK_DEPTH-a.globalPosition.z;if(a.waterBlocks>0&&se(a.getBlock(u,0,p)))i+=this._calcWaterLevelInChunk(a,e);else break}return i}_calcWaterLevelInChunk(r,e){const t=r.globalPosition.y,n=X.CHUNK_HEIGHT;let i=0;return e<=t+n*.8&&i++,e<=t+n*.7&&i++,e<=t+n*.6&&i++,e<=t+n*.5&&i++,i}_getErosionRegion(r,e){const t=`${r},${e}`;let n=this._erosionCache.get(t);return n||(n=Jo(r,e,this.seed),this._erosionCache.set(t,n)),n}getErosionDisplacement(r,e){const t=Rn,n=Math.floor(r/t),i=Math.floor(e/t),o=(r%t+t)%t,a=(e%t+t)%t;return this._getErosionRegion(n,i)[o+a*t]}_insertChunk(r){const e=D._cx(r.globalPosition.x),t=D._cy(r.globalPosition.y),n=D._cz(r.globalPosition.z);this._chunks.set(D._key(e,t,n),r),r.isDeleted=!1}_gatherNeighbors(r,e,t){var i,o,a,s,c,u;const n=this._neighborScratch;return n.negX=(i=this._chunks.get(D._key(r-1,e,t)))==null?void 0:i.blocks,n.posX=(o=this._chunks.get(D._key(r+1,e,t)))==null?void 0:o.blocks,n.negY=(a=this._chunks.get(D._key(r,e-1,t)))==null?void 0:a.blocks,n.posY=(s=this._chunks.get(D._key(r,e+1,t)))==null?void 0:s.blocks,n.negZ=(c=this._chunks.get(D._key(r,e,t-1)))==null?void 0:c.blocks,n.posZ=(u=this._chunks.get(D._key(r,e,t+1)))==null?void 0:u.blocks,n}_remeshSingleNeighbor(r,e,t){var i;const n=this._chunks.get(D._key(r,e,t));n&&((i=this.onChunkUpdated)==null||i.call(this,n,n.generateVertices(this._gatherNeighbors(r,e,t))))}_updateChunk(r,e,t,n){var p;const i=D._cx(r.globalPosition.x),o=D._cy(r.globalPosition.y),a=D._cz(r.globalPosition.z);if(this._dirtyChunks){if(this._dirtyChunks.add(r),e===void 0)return;const f=X.CHUNK_WIDTH,h=X.CHUNK_HEIGHT,m=X.CHUNK_DEPTH,_=(w,v,x)=>{const B=this._chunks.get(D._key(w,v,x));B&&this._dirtyChunks.add(B)};e===0&&_(i-1,o,a),e===f-1&&_(i+1,o,a),t===0&&_(i,o-1,a),t===h-1&&_(i,o+1,a),n===0&&_(i,o,a-1),n===m-1&&_(i,o,a+1);return}if((p=this.onChunkUpdated)==null||p.call(this,r,r.generateVertices(this._gatherNeighbors(i,o,a))),e===void 0)return;const s=X.CHUNK_WIDTH,c=X.CHUNK_HEIGHT,u=X.CHUNK_DEPTH;e===0&&this._remeshSingleNeighbor(i-1,o,a),e===s-1&&this._remeshSingleNeighbor(i+1,o,a),t===0&&this._remeshSingleNeighbor(i,o-1,a),t===c-1&&this._remeshSingleNeighbor(i,o+1,a),n===0&&this._remeshSingleNeighbor(i,o,a-1),n===u-1&&this._remeshSingleNeighbor(i,o,a+1)}_createNearbyChunks(r){const e=D._cx(r.x),t=D._cy(r.y),n=D._cz(r.z),i=this.renderDistanceH,o=this.renderDistanceV,a=i*i,s=Math.max(1,this.chunksPerFrame);(!this._scratchTopD2||this._scratchTopD2.length!==s)&&(this._scratchTopD2=new Float64Array(s),this._scratchTopXYZ=new Int32Array(s*3));for(let f=0;f<s;f++)this._scratchTopD2[f]=1/0;let c=0,u=0,p=1/0;for(let f=-i;f<=i;f++){const h=f*f;for(let m=-i;m<=i;m++){const _=h+m*m;if(!(_>a))for(let w=-o;w<=o;w++){const v=e+f,x=t+w,B=n+m;if(this._generated.has(D._key(v,x,B)))continue;c++;const G=_+w*w;if(!(G>=p)){this._scratchTopD2[u]=G,this._scratchTopXYZ[u*3]=v,this._scratchTopXYZ[u*3+1]=x,this._scratchTopXYZ[u*3+2]=B,p=-1/0;for(let S=0;S<s;S++){const E=this._scratchTopD2[S];E>p&&(p=E,u=S)}}}}}if(this.pendingChunks=c,!(this._chunks.size>=D.MAX_CHUNKS))for(let f=0;f<s;f++){let h=-1,m=1/0;for(let x=0;x<s;x++){const B=this._scratchTopD2[x];B<m&&(m=B,h=x)}if(h<0||m===1/0||this._chunks.size>=D.MAX_CHUNKS)break;const _=this._scratchTopXYZ[h*3],w=this._scratchTopXYZ[h*3+1],v=this._scratchTopXYZ[h*3+2];this._scratchTopD2[h]=1/0,this._createChunkAt(_,w,v)}}_removeDistantChunks(r){const e=D._cx(r.x),t=D._cy(r.y),n=D._cz(r.z),i=this.renderDistanceH+1,o=this.renderDistanceV+1,a=this._scratchToDelete;a.length=0;for(const s of this._chunks.values()){const c=D._cx(s.globalPosition.x),u=D._cy(s.globalPosition.y),p=D._cz(s.globalPosition.z),f=c-e,h=u-t,m=p-n;(f*f+m*m>i*i||Math.abs(h)>o)&&a.push(s)}for(let s=0;s<a.length;s++)this.deleteChunk(a[s]);a.length=0}_createChunkAt(r,e,t){var o;const n=D._key(r,e,t);this._generated.add(n);const i=new X(r*X.CHUNK_WIDTH,e*X.CHUNK_HEIGHT,t*X.CHUNK_DEPTH);i.generateBlocks(this.seed,(a,s)=>this.getErosionDisplacement(a,s)),i.aliveBlocks>0&&(this._insertChunk(i),(o=this.onChunkAdded)==null||o.call(this,i,i.generateVertices(this._gatherNeighbors(r,e,t))),this._remeshSingleNeighbor(r-1,e,t),this._remeshSingleNeighbor(r+1,e,t),this._remeshSingleNeighbor(r,e-1,t),this._remeshSingleNeighbor(r,e+1,t),this._remeshSingleNeighbor(r,e,t-1),this._remeshSingleNeighbor(r,e,t+1))}_updateWaterFlow(r){var G;const e=this.waterSimulationRadius,t=Math.floor(r.x-e),n=Math.floor(r.x+e),i=Math.floor(Math.max(0,r.y-e)),o=Math.floor(r.y+e),a=Math.floor(r.z-e),s=Math.floor(r.z+e),c=X.CHUNK_WIDTH,u=X.CHUNK_HEIGHT,p=X.CHUNK_DEPTH,f=Math.floor(t/c),h=Math.floor(n/c),m=Math.floor(i/u),_=Math.floor(o/u),w=Math.floor(a/p),v=Math.floor(s/p),x=this._scratchWaterBlocks;x.length=0;for(let S=f;S<=h;S++)for(let E=m;E<=_;E++)for(let M=w;M<=v;M++){const A=this._chunks.get(D._key(S,E,M));if(!A||A.waterBlocks===0)continue;const R=A.globalPosition.x,P=A.globalPosition.y,b=A.globalPosition.z,C=Math.max(0,t-R),g=Math.min(c-1,n-R),T=Math.max(0,i-P),y=Math.min(u-1,o-P),U=Math.max(0,a-b),N=Math.min(p-1,s-b);for(let V=U;V<=N;V++)for(let z=T;z<=y;z++)for(let I=C;I<=g;I++)se(A.getBlock(I,z,V))&&x.push(R+I,P+z,b+V)}const B=this._scratchDirtyChunks;B.clear(),this._dirtyChunks=B;try{for(let S=0;S<x.length;S+=3)this._flowWater(x[S],x[S+1],x[S+2])}finally{this._dirtyChunks=null}for(const S of B){const E=D._cx(S.globalPosition.x),M=D._cy(S.globalPosition.y),A=D._cz(S.globalPosition.z);(G=this.onChunkUpdated)==null||G.call(this,S,S.generateVertices(this._gatherNeighbors(E,M,A)))}B.clear(),x.length=0}_flowWater(r,e,t){const n=this.getBlockType(r,e-1,t);if(n===L.NONE||Se(n)){this.setBlockType(r,e-1,t,L.WATER),this.setBlockType(r,e,t,L.NONE);return}let i=!1;for(let o=1;o<=4;o++){const a=this.getBlockType(r,e-o,t);if(a!==L.NONE&&!se(a)&&!Se(a)){i=!0;break}if(a===L.NONE||Se(a))break}if(!i){const o=[{x:r+1,y:e,z:t},{x:r-1,y:e,z:t},{x:r,y:e,z:t+1},{x:r,y:e,z:t-1}];for(const a of o){const s=this.getBlockType(a.x,a.y,a.z);if(s===L.NONE||Se(s)){this.setBlockType(a.x,a.y,a.z,L.WATER),this.setBlockType(r,e,t,L.NONE);return}}}if(i){const o=[{x:r+1,y:e,z:t},{x:r-1,y:e,z:t},{x:r,y:e,z:t+1},{x:r,y:e,z:t-1}];for(const a of o){const s=this.getBlockType(a.x,a.y,a.z);if(s===L.NONE||Se(s)){this.setBlockType(a.x,a.y,a.z,L.WATER);return}}}}};l(D,"MAX_CHUNKS",2048);let Yt=D;function Pt(d,r,e,t,n,i,o,a){const s=[{n:[0,0,-1],t:[-1,0,0,1],v:[[-i,-o,-a],[i,-o,-a],[i,o,-a],[-i,o,-a]]},{n:[0,0,1],t:[1,0,0,1],v:[[i,-o,a],[-i,-o,a],[-i,o,a],[i,o,a]]},{n:[-1,0,0],t:[0,0,-1,1],v:[[-i,-o,a],[-i,-o,-a],[-i,o,-a],[-i,o,a]]},{n:[1,0,0],t:[0,0,1,1],v:[[i,-o,-a],[i,-o,a],[i,o,a],[i,o,-a]]},{n:[0,1,0],t:[1,0,0,1],v:[[-i,o,-a],[i,o,-a],[i,o,a],[-i,o,a]]},{n:[0,-1,0],t:[1,0,0,1],v:[[-i,-o,a],[i,-o,a],[i,-o,-a],[-i,-o,-a]]}],c=[[0,1],[1,1],[1,0],[0,0]];for(const u of s){const p=d.length/12;for(let f=0;f<4;f++){const[h,m,_]=u.v[f];d.push(e+h,t+m,n+_,u.n[0],u.n[1],u.n[2],c[f][0],c[f][1],u.t[0],u.t[1],u.t[2],u.t[3])}r.push(p,p+2,p+1,p,p+3,p+2)}}function ea(d){const r=[],e=[];return Pt(r,e,0,0,0,.19,.11,.225),Pt(r,e,0,.07,.225,.075,.06,.06),Ce.fromData(d,new Float32Array(r),new Uint32Array(e))}function ta(d){const r=[],e=[];return Pt(r,e,0,0,0,.085,.085,.075),Ce.fromData(d,new Float32Array(r),new Uint32Array(e))}function ra(d){const r=[],e=[];return Pt(r,e,0,0,0,.065,.03,.055),Ce.fromData(d,new Float32Array(r),new Uint32Array(e))}const na=new O(0,1,0),Tt=class Tt extends $e{constructor(e){super();l(this,"_world");l(this,"_state","idle");l(this,"_timer",0);l(this,"_targetX",0);l(this,"_targetZ",0);l(this,"_hasTarget",!1);l(this,"_velY",0);l(this,"_yaw",0);l(this,"_headGO",null);l(this,"_headBaseY",0);l(this,"_bobPhase");this._world=e,this._timer=1+Math.random()*4,this._yaw=Math.random()*Math.PI*2,this._bobPhase=Math.random()*Math.PI*2}onAttach(){for(const e of this.gameObject.children)if(e.name==="Duck.Head"){this._headGO=e,this._headBaseY=e.position.y;break}}update(e){const t=this.gameObject,n=t.position.x,i=t.position.z,o=Tt.playerPos,a=o.x-n,s=o.z-i,c=a*a+s*s;this._velY-=9.8*e,t.position.y+=this._velY*e;const u=this._world.getTopBlockY(Math.floor(n),Math.floor(i),Math.ceil(t.position.y)+4);if(u>0&&t.position.y<=u+.1){const p=this._world.getBlockType(Math.floor(n),Math.floor(u-1),Math.floor(i));L.WATER,t.position.y=u,this._velY=0}switch(this._state){case"idle":{this._timer-=e,c<36?this._enterFlee():this._timer<=0&&this._pickWanderTarget();break}case"wander":{if(this._timer-=e,c<36){this._enterFlee();break}if(!this._hasTarget||this._timer<=0){this._enterIdle();break}const p=this._targetX-n,f=this._targetZ-i,h=p*p+f*f;if(h<.25){this._enterIdle();break}const m=Math.sqrt(h),_=p/m,w=f/m;t.position.x+=_*1.5*e,t.position.z+=w*1.5*e,this._yaw=Math.atan2(-_,-w);break}case"flee":{if(c>196){this._enterIdle();break}const p=Math.sqrt(c),f=p>0?-a/p:0,h=p>0?-s/p:0;t.position.x+=f*4*e,t.position.z+=h*4*e,this._yaw=Math.atan2(-f,-h);break}}if(t.rotation=_e.fromAxisAngle(na,this._yaw),this._headGO){this._bobPhase+=e*(this._state==="wander"?6:2);const p=this._state==="wander"?.018:.008;this._headGO.position.y=this._headBaseY+Math.sin(this._bobPhase)*p}}_enterIdle(){this._state="idle",this._hasTarget=!1,this._timer=2+Math.random()*5}_enterFlee(){this._state="flee",this._hasTarget=!1}_pickWanderTarget(){const e=this.gameObject,t=Math.random()*Math.PI*2,n=3+Math.random()*8;this._targetX=e.position.x+Math.cos(t)*n,this._targetZ=e.position.z+Math.sin(t)*n,this._hasTarget=!0,this._state="wander",this._timer=6+Math.random()*6}};l(Tt,"playerPos",new O(0,0,0));let Xe=Tt;const Bn=""+new URL("hotbar-DkVq2FsR.png",import.meta.url).href,bt=[L.DIRT,L.IRON,L.STONE,L.SAND,L.TRUNK,L.SPRUCE_PLANKS,L.GLASS,L.TORCH,L.WATER];function ia(d){const r=bt.length;let e=0;const t=document.createElement("div");t.style.cssText=["position:fixed","bottom:12px","left:50%","transform:translateX(-50%)","display:flex","flex-direction:row","flex-wrap:nowrap","align-items:center","gap:0px","background:url("+Bn+") no-repeat","background-position:-48px 0px","background-size:414px 48px","width:364px","height:44px","padding:1px 2px","image-rendering:pixelated","box-sizing:border-box"].join(";");const n=[];for(let u=0;u<r;u++){const p=document.createElement("div");p.style.cssText=["width:40px","height:40px","display:flex","align-items:center","justify-content:center","position:relative","flex-shrink:0"].join(";");const f=document.createElement("canvas");f.width=f.height=32,f.style.cssText="width:32px;height:32px;image-rendering:pixelated;",p.appendChild(f);const h=document.createElement("span");h.textContent=String(u+1),h.style.cssText=["position:absolute","top:1px","left:3px","font-family:ui-monospace,monospace","font-size:9px","color:#ccc","text-shadow:0 0 2px #000","pointer-events:none"].join(";"),p.appendChild(h),t.appendChild(p),n.push(f)}document.body.appendChild(t);const i=document.createElement("div");i.style.cssText=["position:fixed","bottom:12px","width:44px","height:48px","background:url("+Bn+") no-repeat","background-position:0px 0px","background-size:414px 48px","pointer-events:none","image-rendering:pixelated","transition:left 60ms linear"].join(";"),document.body.appendChild(i);let o=null;function a(){const u=t.getBoundingClientRect();i.style.left=u.left-2+e*40+"px",o==null||o()}const s=new Image;s.src=d;function c(){if(!s.complete)return;const u=16;for(let p=0;p<r;p++){const f=At.find(m=>m.blockType===bt[p]),h=n[p].getContext("2d");h.clearRect(0,0,32,32),f&&(h.imageSmoothingEnabled=!1,h.drawImage(s,f.sideFace.x*u,f.sideFace.y*u,u,u,0,0,32,32))}}return s.onload=c,window.addEventListener("keydown",u=>{const p=parseInt(u.key);p>=1&&p<=r&&(e=p-1,a())}),window.addEventListener("wheel",u=>{e=(e+(u.deltaY>0?1:r-1))%r,a()},{passive:!0}),requestAnimationFrame(a),{getSelected:()=>bt[e],refresh:c,getSelectedSlot:()=>e,setSelectedSlot:u=>{e=u,a()},setOnSelectionChanged:u=>{o=u},slots:bt,element:t}}const oa="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAACWCAYAAADwkd5lAAAD7ElEQVR4nO3dUU7bahSF0eOqgyIwDU/EkmcBUibicQRm5ftyE7UoacvOb+LEa0l9obD7P/VTKdKpAgAA+C7dX35//pZXALBWFzvxp4DM86wfAFvWdV3VhVZcCoh4AFBVlyNyLiCneLy/vy/7KgBWbbfbVdX5iPy4wXsAeAACAkBEQACICAgAEQEBIPLzK588DMPVf2Df9zVNkx07duxsfqflVqud/X7/z5/7pR/jHYah+r6/5m01jmM9PT3ZsWPHzuZ3pmmqj4+Pent7W83O54D4MV4AmhMQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAANDMfHQ6H3369vr7OLdixY8eOnXW95bjz+e/9o6qaP8fiywelrrW261t27Nixc6udlltLXST800EpFwnt2LFj50Y7LhICsEkCAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgGZOF6hcJLRjx46d5XbW9JbjjouEduzYsXMHOy23XCS0Y8eOnQ3tuEgIwCYJCAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQAJo5XaBykdCOHTt2lttZ01uOOy4S2rFjx84d7LTccpHQjh07dja04yIhAJskIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAGjmdIHKRUI7duzYWW5nTW857rhIaMeOHTt3sNNyy0VCO3bs2NnQjouEAGySgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBAaCZ0wUqFwnt2LFjZ7mdNb3luOMioR07duzcwU7LLRcJ7dixY2dDOy4SArBJAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBIBmTheoXCS0Y8eOneV21vSW485iFwkB2BYHpQBoTkAAiAgIAJGft34AyxmG4eqNvu9rmiY7duKdl5eXq3dYJwF5cH3fX/X14zjWNE127MQ7fhjncfkWFgARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkDEPZAH1vd9jeNox85Nd3hc3ZmPzfM8V1U5BAOwcbvdrqqquq6r+tQM38ICICIgAEQEBIDIuf9E77qumw+HQ+33+29/EADr8vz8XHXm/8wv/Quk+/8LANiwS/G4+MFfzM1fA8A9+VsnAAAAvsF/uG+b8sfhThMAAAAASUVORK5CYII=";function aa(d,r,e,t,n,i){const w=[];for(let C=1;C<L.MAX;C++)C!==L.WATER&&w.push(C);const v=document.createElement("div");v.style.cssText="position:relative;display:inline-block;align-self:center;";const x=document.createElement("img");x.src=oa,x.draggable=!1,x.style.cssText=[`width:${400*2}px`,`height:${150*2}px`,"display:block","image-rendering:pixelated","user-select:none"].join(";"),v.appendChild(x);const B=new Image;B.src=r;function G(C,g){const T=C.getContext("2d");if(T.clearRect(0,0,C.width,C.height),!g)return;const y=At.find(U=>U.blockType===g);y&&(T.imageSmoothingEnabled=!1,T.drawImage(B,y.sideFace.x*16,y.sideFace.y*16,16,16,0,0,C.width,C.height))}let S=null,E=null;const M=[];function A(){M.forEach((C,g)=>{C.style.outline=g===n()?"2px solid #ff0":""})}function R(C,g,T){const y=document.createElement("div");y.style.cssText=["position:absolute",`left:${C}px`,`top:${g}px`,"width:32px","height:32px","box-sizing:border-box","cursor:grab"].join(";"),y.draggable=T;const U=document.createElement("canvas");return U.width=U.height=32,U.style.cssText="width:32px;height:32px;image-rendering:pixelated;pointer-events:none;display:block;",y.appendChild(U),v.appendChild(y),[y,U]}for(let C=0;C<6;C++)for(let g=0;g<21;g++){const T=w[C*21+g]??null;if(!T)continue;const[y,U]=R(24+g*36,24+C*36,!0);y.title=String(ui[T]),B.complete?G(U,T):B.addEventListener("load",()=>G(U,T),{once:!1}),y.addEventListener("click",()=>{e[n()]=T,b(),t()}),y.addEventListener("dragstart",N=>{S=T,E=null,N.dataTransfer.effectAllowed="copy",y.style.opacity="0.4"}),y.addEventListener("dragend",()=>{y.style.opacity="1"})}const P=[];for(let C=0;C<9;C++){const[g,T]=R(240+C*36,248,!0);P.push(T),M.push(g),g.title=`Slot ${C+1}`,g.addEventListener("click",()=>{i(C),A()}),g.addEventListener("dragstart",y=>{S=e[C],E=C,y.dataTransfer.effectAllowed="move",g.style.opacity="0.4"}),g.addEventListener("dragend",()=>{g.style.opacity="1"}),g.addEventListener("dragover",y=>{y.preventDefault(),y.dataTransfer.dropEffect=E!==null?"move":"copy",g.style.boxShadow="inset 0 0 0 2px #7ff"}),g.addEventListener("dragleave",()=>{g.style.boxShadow=""}),g.addEventListener("drop",y=>{y.preventDefault(),g.style.boxShadow="",S&&(E!==null&&E!==C?[e[C],e[E]]=[e[E],e[C]]:E===null&&(e[C]=S),b(),t(),S=null,E=null)})}function b(){for(let C=0;C<9;C++)G(P[C],e[C])}return B.addEventListener("load",b),B.complete&&b(),d.appendChild(v),{syncHotbar:b,refreshSlotHighlight:A}}function sa(d,r,e){const t=document.createElement("div");t.style.cssText=["display:flex","flex-wrap:wrap","gap:8px","justify-content:center","font-family:ui-monospace,monospace","font-size:13px","user-select:none"].join(";");const n="background:#1a2e1a;color:#5f5;border-color:#5f5",i="background:#2e1a1a;color:#f55;border-color:#f55";for(const o of Object.keys(d)){const a=document.createElement("button"),s=o.toUpperCase().padEnd(5),c=()=>{const u=d[o];a.textContent=`${s} ${u?"ON ":"OFF"}`,a.setAttribute("style",["padding:5px 10px","border-width:1px","border-style:solid","border-radius:4px","cursor:pointer","letter-spacing:0.04em",u?n:i].join(";"))};a.addEventListener("click",()=>{d[o]=!d[o],c(),r(o)}),c(),t.appendChild(a)}return e.appendChild(t),t}function la(d,r){const e=document.createElement("div");e.style.cssText=["position:fixed","inset:0","z-index:100","background:rgba(0,0,0,0.78)","display:none","align-items:center","justify-content:center","font-family:ui-monospace,monospace"].join(";"),document.body.appendChild(e);const t=document.createElement("div");t.style.cssText=["display:flex","flex-direction:column","align-items:center","gap:24px","padding:48px 56px","background:rgba(255,255,255,0.04)","border:1px solid rgba(255,255,255,0.12)","border-radius:12px","max-width:860px","width:90%"].join(";"),e.appendChild(t);const n=document.createElement("h1");n.textContent="CRAFTY",n.style.cssText=["margin:0","font-size:52px","font-weight:900","color:#fff","letter-spacing:0.12em","text-shadow:0 0 48px rgba(100,200,255,0.45)","font-family:ui-monospace,monospace"].join(";"),t.appendChild(n);const i=document.createElement("button");i.textContent="Play",i.style.cssText=["padding:10px 40px","font-size:15px","font-family:ui-monospace,monospace","background:#1a3a1a","color:#5f5","border:1px solid #5f5","border-radius:6px","cursor:pointer","letter-spacing:0.06em","transition:background 0.15s"].join(";"),i.addEventListener("mouseenter",()=>{i.style.background="#243e24"}),i.addEventListener("mouseleave",()=>{i.style.background="#1a3a1a"}),i.addEventListener("click",async()=>{d.requestPointerLock()}),t.appendChild(i);const o=document.createElement("div");o.style.cssText="width:100%;height:1px;background:rgba(255,255,255,0.12)",t.appendChild(o);let a=0;function s(){a=performance.now(),e.style.display="flex",r.style.display="none"}function c(){e.style.display="none",r.style.display=""}function u(){return e.style.display!=="none"}return document.addEventListener("pointerlockchange",()=>{document.pointerLockElement===d?c():s()}),document.addEventListener("keydown",p=>{if(p.code==="Escape"&&u()){if(performance.now()-a<200)return;c(),d.requestPointerLock()}}),{overlay:e,card:t,open:s,close:c,isOpen:u}}function ca(){const d=document.createElement("div");d.style.cssText=["position:fixed","top:50%","left:50%","width:16px","height:16px","transform:translate(-50%,-50%)","pointer-events:none"].join(";"),d.innerHTML=['<div style="position:absolute;top:50%;left:0;width:100%;height:3px;background:#fff;opacity:0.8;transform:translateY(-50%)"></div>','<div style="position:absolute;left:50%;top:0;width:3px;height:100%;background:#fff;opacity:0.8;transform:translateX(-50%)"></div>','<div style="position:absolute;top:50%;left:50%;width:7px;height:3px;background:#fff;opacity:0.9;transform:translate(-50%,-50%);border-radius:50%"></div>'].join(""),document.body.appendChild(d);const r=document.createElement("div");r.style.cssText=["position:fixed","top:12px","right:12px","font-family:ui-monospace,monospace","font-size:13px","color:#ff0","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none"].join(";"),document.body.appendChild(r);const e=document.createElement("div");e.style.cssText=["position:fixed","top:44px","right:12px","font-family:ui-monospace,monospace","font-size:11px","color:#aaf","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none","white-space:pre"].join(";"),document.body.appendChild(e);const t=document.createElement("div");t.style.cssText=["position:fixed","bottom:12px","right:12px","font-family:ui-monospace,monospace","font-size:13px","color:#ff0","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none"].join(";"),document.body.appendChild(t);const n=document.createElement("div");return n.style.cssText=["position:fixed","bottom:44px","right:12px","font-family:ui-monospace,monospace","font-size:11px","color:#ccf","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none"].join(";"),document.body.appendChild(n),{fps:r,stats:e,biome:t,pos:n,reticle:d}}function ua(d,r,e,t,n,i,o,a){const s=new Le("Camera");s.position.set(64,25,64);const c=s.addComponent(new An(70,.1,1e3,t/n));r.add(s);const u=new Le("Flashlight"),p=u.addComponent(new En);p.color=new O(1,.95,.9),p.intensity=0,p.range=40,p.innerAngle=12,p.outerAngle=25,p.castShadow=!1,p.projectionTexture=i,s.addChild(u),r.add(u);let f=!1;const h=new yi(e,Math.PI,.1);h.attach(d);const m=new si(Math.PI,.1,15);let _=!0;const w=document.createElement("div");w.textContent="PLAYER",w.style.cssText=["position:fixed","top:12px","left:12px","font-family:ui-monospace,monospace","font-size:13px","font-weight:bold","color:#4f4","background:rgba(0,0,0,0.45)","padding:4px 8px","border-radius:4px","pointer-events:none","letter-spacing:0.05em"].join(";"),document.body.appendChild(w);function v(S){o&&(o.style.display=S?"":"none"),a&&(a.style.display=S?"":"none")}function x(){_=!_,_?(h.yaw=m.yaw,h.pitch=m.pitch,m.detach(),h.attach(d)):(m.yaw=h.yaw,m.pitch=h.pitch,h.detach(),m.attach(d)),w.textContent=_?"PLAYER":"FREE",w.style.color=_?"#4f4":"#4cf",v(_)}function B(S){f=S,p.intensity=f?25:0}let G=-1/0;return document.addEventListener("keyup",S=>{S.code==="Space"&&(G=performance.now())}),document.addEventListener("keydown",S=>{if(S.code==="KeyC"&&!S.repeat){x();return}if(!(S.code!=="Space"||S.repeat)&&performance.now()-G<400&&document.pointerLockElement===d){const E=_;x(),G=-1/0,E&&m.pressKey("Space")}}),window.addEventListener("keydown",S=>{S.code==="KeyF"&&!S.repeat&&(B(!f),console.log(`Flashlight ${f?"ON":"OFF"} (intensity: ${p.intensity})`)),S.ctrlKey&&S.key==="w"&&(S.preventDefault(),window.location.reload())}),{cameraGO:s,camera:c,player:h,freeCamera:m,isPlayerMode:()=>_,flashlight:p,isFlashlightEnabled:()=>f,modeEl:w,toggleController:x,setFlashlightEnabled:B,setPlayerUIVisible:v}}const nt=new Map,it=new Map,Mt=(d,r,e)=>`${d},${r},${e}`;function da(d,r,e,t){const n=Mt(d,r,e);if(nt.has(n))return;const i=new Le("TorchLight");i.position.set(d+.5,r+.9,e+.5);const o=i.addComponent(new $t);o.color=new O(1,.52,.18),o.intensity=4,o.radius=6,o.castShadow=!1,t.add(i);const a=(d*127.1+r*311.7+e*74.3)%(Math.PI*2);nt.set(n,{go:i,pl:o,phase:a})}function fa(d,r,e,t){const n=Mt(d,r,e),i=nt.get(n);i&&(t.remove(i.go),nt.delete(n))}function pa(d){for(const{pl:r,phase:e}of nt.values()){const t=1+.08*Math.sin(d*11.7+e)+.05*Math.sin(d*7.3+e*1.7)+.03*Math.sin(d*23.1+e*.5);r.intensity=4*t}}function ha(d,r,e,t){const n=Mt(d,r,e);if(it.has(n))return;const i=new Le("MagmaLight");i.position.set(d+.5,r+.5,e+.5);const o=i.addComponent(new $t);o.color=new O(1,.28,0),o.intensity=6,o.radius=10,o.castShadow=!1,t.add(i);const a=(d*127.1+r*311.7+e*74.3)%(Math.PI*2);it.set(n,{go:i,pl:o,phase:a})}function ma(d,r,e,t){const n=Mt(d,r,e),i=it.get(n);i&&(t.remove(i.go),it.delete(n))}function _a(d){for(const{pl:r,phase:e}of it.values()){const t=1+.18*Math.sin(d*1.1+e)+.1*Math.sin(d*2.9+e*.7)+.06*Math.sin(d*.5+e*1.4);r.intensity=6*t}}const ga=700,va=300;function ba(){return{targetBlock:null,targetHit:null,mouseHeld:-1,mouseHoldTime:0,lastBlockAction:0}}function br(d,r,e,t,n,i){if(d===0&&e.targetBlock){const o=t.getBlockType(e.targetBlock.x,e.targetBlock.y,e.targetBlock.z);o===L.TORCH&&fa(e.targetBlock.x,e.targetBlock.y,e.targetBlock.z,i),o===L.MAGMA&&ma(e.targetBlock.x,e.targetBlock.y,e.targetBlock.z,i),t.mineBlock(e.targetBlock.x,e.targetBlock.y,e.targetBlock.z),e.lastBlockAction=r}else if(d===2&&e.targetHit){const o=e.targetHit,a=n(),s=o.position.x+o.face.x,c=o.position.y+o.face.y,u=o.position.z+o.face.z;t.addBlock(o.position.x,o.position.y,o.position.z,o.face.x,o.face.y,o.face.z,a)&&(a===L.TORCH&&da(s,c,u,i),a===L.MAGMA&&ha(s,c,u,i)),e.lastBlockAction=r}}function ya(d,r,e,t,n){d.addEventListener("contextmenu",i=>i.preventDefault()),d.addEventListener("mousedown",i=>{document.pointerLockElement===d&&(i.button!==0&&i.button!==2||(r.mouseHeld=i.button,r.mouseHoldTime=i.timeStamp,br(i.button,i.timeStamp,r,e,t,n)))}),d.addEventListener("mouseup",i=>{i.button===r.mouseHeld&&(r.mouseHeld=-1)})}function xa(d,r,e,t,n,i){e.mouseHeld>=0&&document.pointerLockElement===r&&d-e.mouseHoldTime>=ga&&d-e.lastBlockAction>=va&&br(e.mouseHeld,d,e,t,n,i)}const Oe=60,wa=.1,yt=28,qe=64,Ba=.005;function Sa(){return typeof window<"u"&&"ontouchstart"in window||typeof navigator<"u"&&navigator.maxTouchPoints>0}class Pa{constructor(r,e){l(this,"_root");l(this,"_joystick");l(this,"_stick");l(this,"_btnJump");l(this,"_btnSneak");l(this,"_btnMine");l(this,"_btnPlace");l(this,"_joyTouchId",null);l(this,"_joyOriginX",0);l(this,"_joyOriginY",0);l(this,"_lookTouchId",null);l(this,"_lookLastX",0);l(this,"_lookLastY",0);l(this,"_lookLastTapAt",-1/0);l(this,"_lookSensitivity");l(this,"_onJoyStart",r=>{if(this._joyTouchId!==null)return;r.preventDefault();const e=r.changedTouches[0];this._joyTouchId=e.identifier;const t=this._joystick.getBoundingClientRect();this._joyOriginX=t.left+t.width*.5,this._joyOriginY=t.top+t.height*.5,this._updateJoystick(e.clientX,e.clientY)});l(this,"_onJoyMove",r=>{if(this._joyTouchId!==null)for(let e=0;e<r.changedTouches.length;e++){const t=r.changedTouches[e];if(t.identifier===this._joyTouchId){r.preventDefault(),this._updateJoystick(t.clientX,t.clientY);return}}});l(this,"_onJoyEnd",r=>{if(this._joyTouchId!==null){for(let e=0;e<r.changedTouches.length;e++)if(r.changedTouches[e].identifier===this._joyTouchId){r.preventDefault(),this._joyTouchId=null,this._setMovement(0,0),this._stick.style.transform="translate(0px, 0px)";return}}});l(this,"_onLookStart",r=>{if(this._lookTouchId!==null)return;const e=r.changedTouches[0],t=window.innerWidth*.5;if(e.clientX<t)return;r.preventDefault(),this._lookTouchId=e.identifier,this._lookLastX=e.clientX,this._lookLastY=e.clientY;const n=performance.now();n-this._lookLastTapAt<350&&this._opts.onLookDoubleTap?(this._opts.onLookDoubleTap(),this._lookLastTapAt=-1/0):this._lookLastTapAt=n});l(this,"_onLookMove",r=>{if(this._lookTouchId!==null)for(let e=0;e<r.changedTouches.length;e++){const t=r.changedTouches[e];if(t.identifier!==this._lookTouchId)continue;r.preventDefault();const n=t.clientX-this._lookLastX,i=t.clientY-this._lookLastY;this._lookLastX=t.clientX,this._lookLastY=t.clientY,this._applyLook(n,i);return}});l(this,"_onLookEnd",r=>{if(this._lookTouchId!==null){for(let e=0;e<r.changedTouches.length;e++)if(r.changedTouches[e].identifier===this._lookTouchId){r.preventDefault(),this._lookTouchId=null;return}}});this._canvas=r,this._opts=e,this._lookSensitivity=e.lookSensitivity??Ba,this._root=document.createElement("div"),this._root.style.cssText=["position:fixed","inset:0","pointer-events:none","user-select:none","-webkit-user-select:none","touch-action:none","z-index:9999"].join(";"),this._joystick=document.createElement("div"),this._joystick.style.cssText=["position:absolute","left:24px","bottom:24px",`width:${Oe*2}px`,`height:${Oe*2}px`,"border-radius:50%","background:rgba(255,255,255,0.10)","border:2px solid rgba(255,255,255,0.30)","pointer-events:auto"].join(";"),this._stick=document.createElement("div"),this._stick.style.cssText=["position:absolute",`left:${Oe-yt}px`,`top:${Oe-yt}px`,`width:${yt*2}px`,`height:${yt*2}px`,"border-radius:50%","background:rgba(255,255,255,0.30)","border:2px solid rgba(255,255,255,0.50)","pointer-events:none","transition:transform 80ms ease-out"].join(";"),this._joystick.appendChild(this._stick),this._root.appendChild(this._joystick),this._btnMine=this._makeButton("⛏",`right:${24+qe+12}px`,`bottom:${24+qe+12}px`,"rgba(220,80,80,0.45)"),this._btnPlace=this._makeButton("▣","right:24px",`bottom:${24+qe+12}px`,"rgba(80,180,90,0.45)"),this._btnJump=this._makeButton("⤒","right:24px","bottom:24px","rgba(255,255,255,0.18)"),this._btnSneak=this._makeButton("⤓",`right:${24+qe+12}px`,"bottom:24px","rgba(255,255,255,0.10)"),document.body.appendChild(this._root),this._attachEvents()}destroy(){this._detachEvents(),this._root.remove()}_makeButton(r,e,t,n){const i=document.createElement("div");return i.textContent=r,i.style.cssText=["position:absolute",e,t,`width:${qe}px`,`height:${qe}px`,"border-radius:50%",`background:${n}`,"border:2px solid rgba(255,255,255,0.45)","color:#fff","font-size:32px","font-family:sans-serif","display:flex","align-items:center","justify-content:center","pointer-events:auto","user-select:none"].join(";"),this._root.appendChild(i),i}_attachEvents(){this._joystick.addEventListener("touchstart",this._onJoyStart,{passive:!1}),this._joystick.addEventListener("touchmove",this._onJoyMove,{passive:!1}),this._joystick.addEventListener("touchend",this._onJoyEnd,{passive:!1}),this._joystick.addEventListener("touchcancel",this._onJoyEnd,{passive:!1}),this._canvas.addEventListener("touchstart",this._onLookStart,{passive:!1}),this._canvas.addEventListener("touchmove",this._onLookMove,{passive:!1}),this._canvas.addEventListener("touchend",this._onLookEnd,{passive:!1}),this._canvas.addEventListener("touchcancel",this._onLookEnd,{passive:!1}),this._bindHoldButton(this._btnJump,()=>this._setJump(!0),()=>this._setJump(!1)),this._bindHoldButton(this._btnSneak,()=>this._setSneak(!0),()=>this._setSneak(!1)),this._bindHoldButton(this._btnMine,()=>this._actionDown(0),()=>this._actionUp(0)),this._bindHoldButton(this._btnPlace,()=>this._actionDown(2),()=>this._actionUp(2))}_detachEvents(){this._joystick.removeEventListener("touchstart",this._onJoyStart),this._joystick.removeEventListener("touchmove",this._onJoyMove),this._joystick.removeEventListener("touchend",this._onJoyEnd),this._joystick.removeEventListener("touchcancel",this._onJoyEnd),this._canvas.removeEventListener("touchstart",this._onLookStart),this._canvas.removeEventListener("touchmove",this._onLookMove),this._canvas.removeEventListener("touchend",this._onLookEnd),this._canvas.removeEventListener("touchcancel",this._onLookEnd)}_bindHoldButton(r,e,t){const n=o=>{o.preventDefault(),r.style.filter="brightness(1.5)",e()},i=o=>{o.preventDefault(),r.style.filter="",t()};r.addEventListener("touchstart",n,{passive:!1}),r.addEventListener("touchend",i,{passive:!1}),r.addEventListener("touchcancel",i,{passive:!1})}_updateJoystick(r,e){let t=r-this._joyOriginX,n=e-this._joyOriginY;const i=Math.hypot(t,n);if(i>Oe){const c=Oe/i;t*=c,n*=c}this._stick.style.transition="none",this._stick.style.transform=`translate(${t}px, ${n}px)`,requestAnimationFrame(()=>{this._stick.style.transition="transform 80ms ease-out"});const o=t/Oe,a=n/Oe;if(Math.hypot(o,a)<wa){this._setMovement(0,0);return}this._setMovement(o,-a)}_activeIsCamera(){return(this._opts.getActive?this._opts.getActive():"player")==="camera"}_setMovement(r,e){const t=this._activeIsCamera();t&&this._opts.camera?(this._opts.camera.inputForward=e,this._opts.camera.inputStrafe=r):this._opts.player&&(this._opts.player.inputForward=e,this._opts.player.inputStrafe=r),t&&this._opts.player?(this._opts.player.inputForward=0,this._opts.player.inputStrafe=0):!t&&this._opts.camera&&(this._opts.camera.inputForward=0,this._opts.camera.inputStrafe=0)}_setJump(r){this._activeIsCamera()&&this._opts.camera?this._opts.camera.inputUp=r:this._opts.player&&(this._opts.player.inputJump=r)}_setSneak(r){this._activeIsCamera()&&this._opts.camera?this._opts.camera.inputDown=r:this._opts.player&&(this._opts.player.inputSneak=r)}_applyLook(r,e){const t=r*(this._lookSensitivity/.002),n=e*(this._lookSensitivity/.002);this._activeIsCamera()&&this._opts.camera?this._opts.camera.applyLookDelta(t,n):this._opts.player&&this._opts.player.applyLookDelta(t,n)}_actionDown(r){const{world:e,scene:t,blockInteraction:n,getSelectedBlock:i}=this._opts;if(!e||!t||!n||!i)return;const o=performance.now();n.mouseHeld=r,n.mouseHoldTime=o,br(r,o,n,e,i,t)}_actionUp(r){const e=this._opts.blockInteraction;e&&e.mouseHeld===r&&(e.mouseHeld=-1)}}const Ga=`// Forward PBR shader with multi-light support
// Supports: directional, point, spot lights with shadows
// Materials: PBR with IBL, normal mapping, MER textures

const PI: f32 = 3.14159265358979323846;

// Maximum lights supported
const MAX_POINT_LIGHTS: u32 = 8u;
const MAX_SPOT_LIGHTS: u32 = 4u;

struct CameraUniforms {
  view        : mat4x4<f32>,
  proj        : mat4x4<f32>,
  viewProj    : mat4x4<f32>,
  invViewProj : mat4x4<f32>,
  position    : vec3<f32>,
  near        : f32,
  far         : f32,
}

struct ModelUniforms {
  model        : mat4x4<f32>,
  normalMatrix : mat4x4<f32>,
}

struct MaterialUniforms {
  albedo    : vec4<f32>,
  roughness : f32,
  metallic  : f32,
  uvOffset  : vec2<f32>,
  uvScale   : vec2<f32>,
  uvTile    : vec2<f32>,
}

struct PointLight {
  position    : vec3<f32>,
  range       : f32,
  color       : vec3<f32>,
  intensity   : f32,
  castShadows : u32,
  _pad        : vec3<u32>,
}

struct SpotLight {
  position        : vec3<f32>,
  range           : f32,
  direction       : vec3<f32>,
  innerAngle      : f32,
  color           : vec3<f32>,
  outerAngle      : f32,
  intensity       : f32,
  castShadows     : u32,
  shadowMapIndex  : u32,
  _pad            : u32,
  lightViewProj   : mat4x4<f32>,
}

struct DirectionalLight {
  direction       : vec3<f32>,
  intensity       : f32,
  color           : vec3<f32>,
  castShadows     : u32,
  shadowMapIndex  : u32,
  _pad            : vec3<u32>,
  lightViewProj   : mat4x4<f32>,
}

struct LightingUniforms {
  numPointLights : u32,
  numSpotLights  : u32,
  _pad           : vec2<u32>,
}

// Group 0: Camera
@group(0) @binding(0) var<uniform> camera : CameraUniforms;

// Group 1: Model
@group(1) @binding(0) var<uniform> model    : ModelUniforms;

// Group 2: Material (uniforms + texture maps + sampler)
@group(2) @binding(0) var<uniform> material : MaterialUniforms;
@group(2) @binding(1) var albedo_map  : texture_2d<f32>;
@group(2) @binding(2) var normal_map  : texture_2d<f32>;
@group(2) @binding(3) var mer_map     : texture_2d<f32>;
@group(2) @binding(4) var mat_sampler : sampler;

// Group 3: Lighting + Shadow + IBL
@group(3) @binding(0) var<uniform> lighting            : LightingUniforms;
@group(3) @binding(1) var<uniform> directionalLight    : DirectionalLight;
@group(3) @binding(2) var<storage, read> pointLights   : array<PointLight>;
@group(3) @binding(3) var<storage, read> spotLights    : array<SpotLight>;
@group(3) @binding(4) var shadowMapArray     : texture_depth_2d_array;
@group(3) @binding(5) var shadowSampler      : sampler_comparison;
@group(3) @binding(6) var irradiance_cube    : texture_cube<f32>;
@group(3) @binding(7) var prefilter_cube     : texture_cube<f32>;
@group(3) @binding(8) var brdf_lut           : texture_2d<f32>;
@group(3) @binding(9) var ibl_sampler        : sampler;
@group(3) @binding(10) var pointShadowCubeArray : texture_depth_cube_array;

const IBL_MIP_LEVELS: f32 = 5.0;

// Vertex input/output
struct VertexInput {
  @location(0) position : vec3<f32>,
  @location(1) normal   : vec3<f32>,
  @location(2) uv       : vec2<f32>,
  @location(3) tangent  : vec4<f32>,
}

struct VertexOutput {
  @builtin(position) clip_pos   : vec4<f32>,
  @location(0)       world_pos  : vec3<f32>,
  @location(1)       world_norm : vec3<f32>,
  @location(2)       uv         : vec2<f32>,
  @location(3)       world_tan  : vec4<f32>,
}

@vertex
fn vs_main(vin: VertexInput) -> VertexOutput {
  let world_pos  = model.model * vec4<f32>(vin.position, 1.0);
  let world_norm = normalize((model.normalMatrix * vec4<f32>(vin.normal,      0.0)).xyz);
  let world_tan  = normalize((model.normalMatrix * vec4<f32>(vin.tangent.xyz, 0.0)).xyz);

  var out: VertexOutput;
  out.clip_pos   = camera.viewProj * world_pos;
  out.world_pos  = world_pos.xyz;
  out.world_norm = world_norm;
  out.uv         = vin.uv;
  out.world_tan  = vec4<f32>(world_tan, vin.tangent.w);
  return out;
}

// PBR functions
fn fresnel_schlick(cos_theta: f32, F0: vec3<f32>) -> vec3<f32> {
  return F0 + (vec3<f32>(1.0) - F0) * pow(max(1.0 - cos_theta, 0.0), 5.0);
}

fn fresnel_schlick_roughness(cos_theta: f32, F0: vec3<f32>, roughness: f32) -> vec3<f32> {
  let one_minus_roughness = vec3<f32>(1.0 - roughness);
  return F0 + (max(one_minus_roughness, F0) - F0) * pow(max(1.0 - cos_theta, 0.0), 5.0);
}

fn distribution_ggx(N: vec3<f32>, H: vec3<f32>, roughness: f32) -> f32 {
  let a = roughness * roughness;
  let a2 = a * a;
  let NdotH = max(dot(N, H), 0.0);
  let NdotH2 = NdotH * NdotH;
  let denom = NdotH2 * (a2 - 1.0) + 1.0;
  return a2 / (PI * denom * denom);
}

fn geometry_schlick_ggx(NdotV: f32, roughness: f32) -> f32 {
  let r = roughness + 1.0;
  let k = (r * r) / 8.0;
  return NdotV / (NdotV * (1.0 - k) + k);
}

fn geometry_smith(N: vec3<f32>, V: vec3<f32>, L: vec3<f32>, roughness: f32) -> f32 {
  let NdotV = max(dot(N, V), 0.0);
  let NdotL = max(dot(N, L), 0.0);
  let ggx1 = geometry_schlick_ggx(NdotV, roughness);
  let ggx2 = geometry_schlick_ggx(NdotL, roughness);
  return ggx1 * ggx2;
}

// Shadow sampling for directional light
fn sample_shadow(world_pos: vec3<f32>) -> f32 {
  if (directionalLight.castShadows == 0u) {
    return 1.0;
  }

  let light_space = directionalLight.lightViewProj * vec4<f32>(world_pos, 1.0);
  var shadow_coord = light_space.xyz / light_space.w;
  shadow_coord = vec3<f32>(shadow_coord.xy * 0.5 + 0.5, shadow_coord.z);
  shadow_coord.y = 1.0 - shadow_coord.y;

  if (shadow_coord.x < 0.0 || shadow_coord.x > 1.0 ||
      shadow_coord.y < 0.0 || shadow_coord.y > 1.0 ||
      shadow_coord.z < 0.0 || shadow_coord.z > 1.0) {
    return 1.0;
  }

  // Use slope-based bias to prevent shadow acne
  let bias = 0.002;
  let arrayIndex = i32(directionalLight.shadowMapIndex);
  return textureSampleCompareLevel(shadowMapArray, shadowSampler, shadow_coord.xy, arrayIndex, shadow_coord.z - bias);
}

// Shadow sampling for spot light
fn sample_spot_shadow(world_pos: vec3<f32>, light: SpotLight) -> f32 {
  if (light.castShadows == 0u) {
    return 1.0;
  }

  let light_space = light.lightViewProj * vec4<f32>(world_pos, 1.0);
  var shadow_coord = light_space.xyz / light_space.w;
  shadow_coord = vec3<f32>(shadow_coord.xy * 0.5 + 0.5, shadow_coord.z);
  shadow_coord.y = 1.0 - shadow_coord.y;

  if (shadow_coord.x < 0.0 || shadow_coord.x > 1.0 ||
      shadow_coord.y < 0.0 || shadow_coord.y > 1.0 ||
      shadow_coord.z < 0.0 || shadow_coord.z > 1.0) {
    return 1.0;
  }

  let bias = 0.002;
  let arrayIndex = i32(light.shadowMapIndex);
  return textureSampleCompareLevel(shadowMapArray, shadowSampler, shadow_coord.xy, arrayIndex, shadow_coord.z - bias);
}

// Shadow sampling for point light (cube array, linear normalized depth)
fn sample_point_shadow(world_pos: vec3<f32>, light: PointLight, slot: i32) -> f32 {
  if (light.castShadows == 0u) {
    return 1.0;
  }

  let to_frag = world_pos - light.position;
  let dist = length(to_frag);
  if (dist >= light.range) {
    return 1.0;
  }

  let dir = to_frag / dist;
  let compare = dist / light.range;
  let bias = 0.005;
  return textureSampleCompareLevel(pointShadowCubeArray, shadowSampler, dir, slot, compare - bias);
}

// Lighting calculations
fn calculate_pbr_lighting(
  albedo: vec3<f32>,
  N: vec3<f32>,
  V: vec3<f32>,
  world_pos: vec3<f32>,
  roughness: f32,
  metallic: f32,
) -> vec3<f32> {
  let F0 = mix(vec3<f32>(0.04), albedo, metallic);
  let NdotV = max(dot(N, V), 0.001);

  var Lo = vec3<f32>(0.0);

  // Directional light
  {
    let L = normalize(-directionalLight.direction);
    let H = normalize(V + L);
    let NdotL = max(dot(N, L), 0.0);

    if (NdotL > 0.0) {
      let radiance = directionalLight.color * directionalLight.intensity;

      let D = distribution_ggx(N, H, roughness);
      let G = geometry_smith(N, V, L, roughness);
      let F = fresnel_schlick(max(dot(H, V), 0.0), F0);

      let numerator = D * G * F;
      let denominator = 4.0 * NdotV * NdotL;
      let specular = numerator / max(denominator, 0.001);

      let kD = (vec3<f32>(1.0) - F) * (1.0 - metallic);
      let diffuse = kD * albedo / PI;

      let shadow = sample_shadow(world_pos);
      Lo += (diffuse + specular) * radiance * NdotL * shadow;
    }
  }

  // Point lights
  for (var i = 0u; i < lighting.numPointLights && i < MAX_POINT_LIGHTS; i++) {
    let light = pointLights[i];
    let L = light.position - world_pos;
    let distance = length(L);
    let L_norm = L / distance;

    if (distance < light.range) {
      let H = normalize(V + L_norm);
      let NdotL = max(dot(N, L_norm), 0.0);

      if (NdotL > 0.0) {
        let attenuation = max(1.0 - (distance / light.range), 0.0);
        let attenuation2 = attenuation * attenuation;
        let radiance = light.color * light.intensity * attenuation2;

        let D = distribution_ggx(N, H, roughness);
        let G = geometry_smith(N, V, L_norm, roughness);
        let F = fresnel_schlick(max(dot(H, V), 0.0), F0);

        let numerator = D * G * F;
        let denominator = 4.0 * NdotV * NdotL;
        let specular = numerator / max(denominator, 0.001);

        let kD = (vec3<f32>(1.0) - F) * (1.0 - metallic);
        let diffuse = kD * albedo / PI;

        let shadow = sample_point_shadow(world_pos, light, i32(i));
        Lo += (diffuse + specular) * radiance * NdotL * shadow;
      }
    }
  }

  // Spot lights
  for (var i = 0u; i < lighting.numSpotLights && i < MAX_SPOT_LIGHTS; i++) {
    let light = spotLights[i];
    let L = light.position - world_pos;
    let distance = length(L);
    let L_norm = L / distance;

    if (distance < light.range) {
      let spot_dir = normalize(-light.direction);
      let theta = dot(L_norm, spot_dir);
      let inner = cos(light.innerAngle * 0.0174533);
      let outer = cos(light.outerAngle * 0.0174533);
      let epsilon = inner - outer;
      let intensity_factor = clamp((theta - outer) / epsilon, 0.0, 1.0);

      if (intensity_factor > 0.0) {
        let H = normalize(V + L_norm);
        let NdotL = max(dot(N, L_norm), 0.0);

        if (NdotL > 0.0) {
          let attenuation = max(1.0 - (distance / light.range), 0.0);
          let attenuation2 = attenuation * attenuation;
          let radiance = light.color * light.intensity * attenuation2 * intensity_factor;

          let D = distribution_ggx(N, H, roughness);
          let G = geometry_smith(N, V, L_norm, roughness);
          let F = fresnel_schlick(max(dot(H, V), 0.0), F0);

          let numerator = D * G * F;
          let denominator = 4.0 * NdotV * NdotL;
          let specular = numerator / max(denominator, 0.001);

          let kD = (vec3<f32>(1.0) - F) * (1.0 - metallic);
          let diffuse = kD * albedo / PI;

          let shadow = sample_spot_shadow(world_pos, light);
          Lo += (diffuse + specular) * radiance * NdotL * shadow;
        }
      }
    }
  }

  // IBL ambient
  let kS_ibl = fresnel_schlick_roughness(NdotV, F0, roughness);
  let kD_ibl = (vec3<f32>(1.0) - kS_ibl) * (1.0 - metallic);

  let irradiance = textureSampleLevel(irradiance_cube, ibl_sampler, N, 0.0).rgb;
  let diffuse_ibl = irradiance * albedo * kD_ibl;

  let R = reflect(-V, N);
  let prefiltered = textureSampleLevel(prefilter_cube, ibl_sampler, R, roughness * (IBL_MIP_LEVELS - 1.0)).rgb;
  let brdf = textureSampleLevel(brdf_lut, ibl_sampler, vec2<f32>(NdotV, roughness), 0.0).rg;
  let specular_ibl = prefiltered * (kS_ibl * brdf.x + brdf.y);

  let ambient = (diffuse_ibl + specular_ibl) * 0.5;

  return Lo + ambient;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let atlas_uv = fract(in.uv * material.uvTile) * material.uvScale + material.uvOffset;

  let tex_albedo = textureSample(albedo_map, mat_sampler, atlas_uv);
  let albedo = tex_albedo.rgb * material.albedo.rgb;
  let alpha = tex_albedo.a * material.albedo.a;

  let mer = textureSample(mer_map, mat_sampler, atlas_uv);
  let roughness = max(material.roughness * mer.b, 0.04);
  let metallic = material.metallic * mer.r;
  let emission = mer.g;

  // Build TBN matrix for normal mapping
  let N_geom = normalize(in.world_norm);
  let T = normalize(in.world_tan.xyz);
  let T_ortho = normalize(T - N_geom * dot(T, N_geom));
  let B = cross(N_geom, T_ortho) * in.world_tan.w;
  let tbn = mat3x3<f32>(T_ortho, B, N_geom);

  let n_ts = textureSample(normal_map, mat_sampler, atlas_uv).rgb * 2.0 - 1.0;
  let N = normalize(tbn * n_ts);

  let V = normalize(camera.position - in.world_pos);

  let lit_color = calculate_pbr_lighting(albedo, N, V, in.world_pos, roughness, metallic);
  let emissive = albedo * emission * 2.0;
  let final_color = lit_color + emissive;

  return vec4<f32>(final_color, alpha);
}
`,Ta=`// GBuffer fill pass — writes albedo+roughness and normal+metallic.\r
// Group 2 texture maps are optional; the material binds 1×1 fallbacks when unset.\r
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
// Group 2: Material (uniforms + texture maps + sampler).\r
// Texture maps: albedoMap (srgb), normalMap (tangent-space linear), merMap (R=metallic, G=emissive, B=roughness).\r
@group(2) @binding(0) var<uniform> material: MaterialUniforms;\r
@group(2) @binding(1) var albedo_map: texture_2d<f32>;\r
@group(2) @binding(2) var normal_map: texture_2d<f32>;\r
@group(2) @binding(3) var mer_map   : texture_2d<f32>;\r
@group(2) @binding(4) var mat_samp  : sampler;\r
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
`,Aa=`// Skinned GBuffer fill pass — GPU vertex skinning with up to 4 bone influences.\r
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
@group(2) @binding(1) var                albedo_map    : texture_2d<f32>;\r
@group(2) @binding(2) var                normal_map    : texture_2d<f32>;\r
@group(2) @binding(3) var                mer_map       : texture_2d<f32>;\r
@group(2) @binding(4) var                mat_samp      : sampler;\r
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
`,Sn=48,ce=class ce extends ei{constructor(e={}){super();l(this,"shaderId","pbr");l(this,"albedo");l(this,"roughness");l(this,"metallic");l(this,"uvOffset");l(this,"uvScale");l(this,"uvTile");l(this,"_albedoMap");l(this,"_normalMap");l(this,"_merMap");l(this,"_uniformBuffer",null);l(this,"_uniformDevice",null);l(this,"_bindGroup",null);l(this,"_bindGroupAlbedo");l(this,"_bindGroupNormal");l(this,"_bindGroupMer");l(this,"_dirty",!0);l(this,"_scratch",new Float32Array(Sn/4));this.albedo=e.albedo??[1,1,1,1],this.roughness=e.roughness??.5,this.metallic=e.metallic??0,this.uvOffset=e.uvOffset,this.uvScale=e.uvScale,this.uvTile=e.uvTile,this._albedoMap=e.albedoMap,this._normalMap=e.normalMap,this._merMap=e.merMap,this.transparent=e.transparent??!1}get albedoMap(){return this._albedoMap}set albedoMap(e){e!==this._albedoMap&&(this._albedoMap=e,this._bindGroup=null)}get normalMap(){return this._normalMap}set normalMap(e){e!==this._normalMap&&(this._normalMap=e,this._bindGroup=null)}get merMap(){return this._merMap}set merMap(e){e!==this._merMap&&(this._merMap=e,this._bindGroup=null)}markDirty(){this._dirty=!0}getShaderCode(e){switch(e){case Je.Forward:return Ga;case Je.Geometry:return Ta;case Je.SkinnedGeometry:return Aa}}getBindGroupLayout(e){let t=ce._layoutByDevice.get(e);return t||(t=e.createBindGroupLayout({label:"PbrMaterialBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),ce._layoutByDevice.set(e,t)),t}getBindGroup(e){var a,s,c,u;if(this._bindGroup&&this._bindGroupAlbedo===this._albedoMap&&this._bindGroupNormal===this._normalMap&&this._bindGroupMer===this._merMap)return this._bindGroup;(!this._uniformBuffer||this._uniformDevice!==e)&&((a=this._uniformBuffer)==null||a.destroy(),this._uniformBuffer=e.createBuffer({label:"PbrMaterialUniform",size:Sn,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this._uniformDevice=e,this._dirty=!0);const t=ce._getSampler(e),n=((s=this._albedoMap)==null?void 0:s.view)??ce._getWhite(e),i=((c=this._normalMap)==null?void 0:c.view)??ce._getFlatNormal(e),o=((u=this._merMap)==null?void 0:u.view)??ce._getMerDefault(e);return this._bindGroup=e.createBindGroup({label:"PbrMaterialBG",layout:this.getBindGroupLayout(e),entries:[{binding:0,resource:{buffer:this._uniformBuffer}},{binding:1,resource:n},{binding:2,resource:i},{binding:3,resource:o},{binding:4,resource:t}]}),this._bindGroupAlbedo=this._albedoMap,this._bindGroupNormal=this._normalMap,this._bindGroupMer=this._merMap,this._bindGroup}update(e){var n,i,o,a,s,c;if(!this._dirty||!this._uniformBuffer)return;const t=this._scratch;t[0]=this.albedo[0],t[1]=this.albedo[1],t[2]=this.albedo[2],t[3]=this.albedo[3],t[4]=this.roughness,t[5]=this.metallic,t[6]=((n=this.uvOffset)==null?void 0:n[0])??0,t[7]=((i=this.uvOffset)==null?void 0:i[1])??0,t[8]=((o=this.uvScale)==null?void 0:o[0])??1,t[9]=((a=this.uvScale)==null?void 0:a[1])??1,t[10]=((s=this.uvTile)==null?void 0:s[0])??1,t[11]=((c=this.uvTile)==null?void 0:c[1])??1,e.writeBuffer(this._uniformBuffer,0,t.buffer),this._dirty=!1}destroy(){var e;(e=this._uniformBuffer)==null||e.destroy(),this._uniformBuffer=null,this._uniformDevice=null,this._bindGroup=null}static _getSampler(e){let t=ce._samplerByDevice.get(e);return t||(t=e.createSampler({label:"PbrMaterialSampler",magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"}),ce._samplerByDevice.set(e,t)),t}static _make1x1View(e,t,n,i,o,a){const s=e.createTexture({label:t,size:{width:1,height:1},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return e.queue.writeTexture({texture:s},new Uint8Array([n,i,o,a]),{bytesPerRow:4},{width:1,height:1}),s.createView()}static _getWhite(e){let t=ce._whiteByDevice.get(e);return t||(t=ce._make1x1View(e,"PbrFallbackWhite",255,255,255,255),ce._whiteByDevice.set(e,t)),t}static _getFlatNormal(e){let t=ce._flatNormalByDevice.get(e);return t||(t=ce._make1x1View(e,"PbrFallbackFlatNormal",128,128,255,255),ce._flatNormalByDevice.set(e,t)),t}static _getMerDefault(e){let t=ce._merDefaultByDevice.get(e);return t||(t=ce._make1x1View(e,"PbrFallbackMer",255,0,255,255),ce._merDefaultByDevice.set(e,t)),t}};l(ce,"_layoutByDevice",new WeakMap),l(ce,"_samplerByDevice",new WeakMap),l(ce,"_whiteByDevice",new WeakMap),l(ce,"_flatNormalByDevice",new WeakMap),l(ce,"_merDefaultByDevice",new WeakMap);let tt=ce;function Ma(d,r,e,t,n,i,o){const a=e.getTopBlockY(d,r,200);if(a<=0||e.getBiomeAt(d,a,r)!==we.GrassyPlains)return;const u=e.getBlockType(Math.floor(d),Math.floor(a-1),Math.floor(r))===L.WATER?Math.floor(a-.05):a,p=new Le("Duck");p.position.set(d+.5,u,r+.5);const f=new Le("Duck.Body");f.position.set(0,.15,0),f.addComponent(new wt(n,new tt({albedo:[.93,.93,.93,1],roughness:.9}))),p.addChild(f);const h=new Le("Duck.Head");h.position.set(0,.32,-.12),h.addComponent(new wt(i,new tt({albedo:[.08,.32,.1,1],roughness:.9}))),p.addChild(h);const m=new Le("Duck.Bill");m.position.set(0,.27,-.205),m.addComponent(new wt(o,new tt({albedo:[1,.55,.05,1],roughness:.8}))),p.addChild(m),p.addComponent(new Xe(e)),t.add(p)}function Ea(d,r,e,t,n,i,o,a){for(let s=0;s<e;s++){const c=s/e*Math.PI*2+Math.random()*.4,u=8+Math.random()*20;Ma(Math.floor(d+Math.cos(c)*u),Math.floor(r+Math.sin(c)*u),t,n,i,o,a)}}const ze=128,xt=40;class Ua{constructor(){l(this,"data",new Float32Array(ze*ze));l(this,"resolution",ze);l(this,"extent",xt);l(this,"_camX",NaN);l(this,"_camZ",NaN)}update(r,e,t){if(Math.abs(r-this._camX)<2&&Math.abs(e-this._camZ)<2)return;this._camX=r,this._camZ=e;const n=xt*2/ze,i=r-xt,o=e-xt,a=Math.ceil(e)+80;for(let s=0;s<ze;s++)for(let c=0;c<ze;c++)this.data[s*ze+c]=t.getTopBlockY(Math.floor(i+c*n),Math.floor(o+s*n),a)}}const Ca={ssao:!0,ssgi:!1,shadows:!0,dof:!0,bloom:!0,godrays:!0,fog:!1,aces:!0,ao_dbg:!1,shd_dbg:!1,chunk_dbg:!1,hdr:!0,auto_exp:!1,rain:!0,clouds:!0},La="modulepreload",ka=function(d,r){return new URL(d,r).href},Pn={},Na=function(r,e,t){let n=Promise.resolve();if(e&&e.length>0){const o=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),s=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));n=Promise.allSettled(e.map(c=>{if(c=ka(c,t),c in Pn)return;Pn[c]=!0;const u=c.endsWith(".css"),p=u?'[rel="stylesheet"]':"";if(!!t)for(let m=o.length-1;m>=0;m--){const _=o[m];if(_.href===c&&(!u||_.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${c}"]${p}`))return;const h=document.createElement("link");if(h.rel=u?"stylesheet":La,u||(h.as="script"),h.crossOrigin="",h.href=c,s&&h.setAttribute("nonce",s),document.head.appendChild(h),u)return new Promise((m,_)=>{h.addEventListener("load",m),h.addEventListener("error",()=>_(new Error(`Unable to preload CSS for ${c}`)))})}))}function i(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return n.then(o=>{for(const a of o||[])a.status==="rejected"&&i(a.reason);return r().catch(i)})},Ra={emitter:{maxParticles:8e4,spawnRate:24e3,lifetime:[2,3.5],shape:{kind:"box",halfExtents:[35,.1,35]},initialSpeed:[0,0],initialColor:[.75,.88,1,.55],initialSize:[.005,.009],roughness:.1,metallic:0},modifiers:[{type:"gravity",strength:9},{type:"drag",coefficient:.05},{type:"color_over_lifetime",startColor:[.75,.88,1,.55],endColor:[.75,.88,1,0]},{type:"block_collision"}],renderer:{type:"sprites",blendMode:"alpha",billboard:"velocity",renderTarget:"hdr"}},Ia={emitter:{maxParticles:5e4,spawnRate:1500,lifetime:[30,45],shape:{kind:"box",halfExtents:[35,.1,35]},initialSpeed:[0,0],initialColor:[.92,.96,1,.85],initialSize:[.025,.055],roughness:.1,metallic:0},modifiers:[{type:"gravity",strength:1.5},{type:"drag",coefficient:.8},{type:"curl_noise",scale:1,strength:1,timeScale:1,octaves:1},{type:"block_collision"}],renderer:{type:"sprites",blendMode:"alpha",billboard:"camera",renderTarget:"hdr"}};async function Oa(d,r,e,t,n,i,o,a,s,c,u){let p,f,h,m;if(r.worldGeometryPass){const K=St.create(d);r.worldGeometryPass.updateGBuffer(K),p=K,f=r.worldGeometryPass,h=r.worldShadowPass,m=r.waterPass}else{p=St.create(d),f=ur.create(d,p,t),h=mr.create(d,r.shadowPass.shadowMapArrayViews,3,t);const K=d.device.createTexture({label:"WaterDummyHDR",size:{width:d.width,height:d.height},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),de=d.device.createTexture({label:"WaterDummyDepth",size:{width:d.width,height:d.height},format:"depth32float",usage:GPUTextureUsage.TEXTURE_BINDING}),fe=K.createView(),ee=de.createView();m=Fe.create(d,K,fe,ee,n,i,o);const re=(W,Y)=>{u.set(W,Y),f.addChunk(W,Y),h.addChunk(W,Y),m.addChunk(W,Y)},q=(W,Y)=>{u.set(W,Y),f.updateChunk(W,Y),h.updateChunk(W,Y),m.updateChunk(W,Y)},$=W=>{u.delete(W),f.removeChunk(W),h.removeChunk(W),m.removeChunk(W)};c.onChunkAdded=re,c.onChunkUpdated=q,c.onChunkRemoved=$;for(const[W,Y]of u)m.addChunk(W,Y)}const _=cr.create(d,p),w=fr.create(d,p),v=e.clouds?ir.create(d,s):null,x=er.create(d,p,r.shadowPass,w.aoView,v==null?void 0:v.shadowView,a),B=e.godrays?sr.create(d,p,r.shadowPass,x.hdrView,x.cameraBuffer,x.lightBuffer):null,G=tr.create(d,x.hdrView),S=e.clouds?nr.create(d,x.hdrView,p.depthView,s):null;d.pushInitErrorScope();const E=hr.create(d);await d.popInitErrorScope("PointSpotShadowPass");const M=_r.create(d,p,E,x.hdrView),A=or.create(d,x,p),R=pr.create(d,p,A.historyView);x.updateSSGI(R.resultView),r.waterPass,m.updateRenderTargets(x.hdrTexture,x.hdrView,p.depthView,n);let P=null;const b=e.dof?(P=dr.create(d,A.resolvedView,p.depthView),P.resultView):A.resolvedView;let C=null;const g=e.bloom?(C=ar.create(d,b),C.resultView):b,T=rr.create(d,g,p.depthView),y=et.create(d,x.hdrTexture);y.enabled=e.auto_exp;const U=lr.create(d,g,w.aoView,p.depthView,x.cameraBuffer,x.lightBuffer,y.exposureBuffer);U.depthFogEnabled=e.fog;const N=r.currentWeatherEffect??Ye.None;let V=null;if(e.rain&&N!==Ye.None){const K=N===Ye.Snow?Ia:Ra;V=gr.create(d,K,p,x.hdrView)}const{RenderGraph:z}=await Na(async()=>{const{RenderGraph:K}=await import("./index-wR3rwCN4.js");return{RenderGraph:K}},[],import.meta.url),I=new z;return I.addPass(r.shadowPass),v&&I.addPass(v),I.addPass(h),I.addPass(E),I.addPass(_),I.addPass(f),I.addPass(w),I.addPass(R),S?I.addPass(S):I.addPass(G),I.addPass(x),I.addPass(M),I.addPass(m),B&&I.addPass(B),V&&I.addPass(V),I.addPass(A),P&&I.addPass(P),C&&I.addPass(C),I.addPass(T),I.addPass(y),I.addPass(U),{shadowPass:r.shadowPass,gbuffer:p,geometryPass:_,worldGeometryPass:f,worldShadowPass:h,waterPass:m,ssaoPass:w,ssgiPass:R,lightingPass:x,atmospherePass:G,pointSpotShadowPass:E,pointSpotLightPass:M,taaPass:A,dofPass:P,bloomPass:C,rainPass:V,godrayPass:B,cloudPass:S,cloudShadowPass:v,blockHighlightPass:T,autoExposurePass:y,compositePass:U,graph:I,prevViewProj:null,currentWeatherEffect:N}}function Gn(d,r){let e=0,t=1;for(;d>0;)t/=r,e+=t*(d%r),d=Math.floor(d/r);return e}function Va(d,r,e){const t=d.clone();for(let n=0;n<4;n++)t.data[n*4+0]+=r*t.data[n*4+3],t.data[n*4+1]+=e*t.data[n*4+3];return t}async function Da(){const d=document.getElementById("canvas");if(!d)throw new Error("No canvas element");const r=await Kt.create(d,{enableErrorHandling:!1}),{device:e}=r,t=await qo(e,Ho(await(await fetch(Yn)).arrayBuffer())),n=await zo(e,t.gpuTexture),i=Uo(e),o=await vr.load(e,Nt,Xn,$n,Kn),a=await Pe.fromUrl(e,Zn),s=await Pe.fromUrl(e,Qn),c=await Pe.fromUrl(e,Jn,{resizeWidth:256,resizeHeight:256,usage:7}),u=ia(Nt),p=ca(),f=la(d,p.reticle),h=new Yt(13),m=new Map,_=new ti,w=new Le("Sun"),v=w.addComponent(new Mn(new O(.3,-1,.5),O.one(),6,3));_.add(w);const x=ua(d,_,h,r.width,r.height,c.gpuTexture,p.reticle,u.element),{cameraGO:B,camera:G,player:S,freeCamera:E}=x,M=ba();ya(d,M,h,()=>u.getSelected(),_),Sa()&&(S.usePointerLock=!1,E.usePointerLock=!1,new Pa(d,{player:S,camera:E,getActive:()=>x.isPlayerMode()?"player":"camera",world:h,scene:_,blockInteraction:M,getSelectedBlock:()=>u.getSelected(),onLookDoubleTap:()=>x.toggleController()}));const A={...Ca},R=Jt.create(r,3);let P={shadowPass:R,currentWeatherEffect:Ye.None};async function b(){P=await Oa(r,P,A,o,t,a,s,n,i,h,m),G.aspect=r.width/r.height}await b();const C=B.position.x,g=B.position.z;{const J=h.chunksPerFrame;h.chunksPerFrame=200,h.update(new O(C,50,g),0),h.chunksPerFrame=J;const ue=h.getTopBlockY(C,g,200);ue>0&&(B.position.y=ue+1.62,S.velY=0)}const T=ea(e),y=ta(e),U=ra(e);Ea(C,g,30,h,_,T,y,U);const N=document.createElement("div");N.style.cssText="width:100%;height:1px;background:rgba(255,255,255,0.12)",f.card.appendChild(N);const V=aa(f.card,Nt,u.slots,()=>u.refresh(),u.getSelectedSlot,u.setSelectedSlot),z=document.createElement("div");z.style.cssText="width:100%;height:1px;background:rgba(255,255,255,0.12)",f.card.appendChild(z);const I=document.createElement("div");I.textContent="EFFECTS",I.style.cssText="color:rgba(255,255,255,0.35);font-size:11px;letter-spacing:0.18em;align-self:flex-start",f.card.appendChild(I),sa(A,async J=>{if(J!=="ssao"&&J!=="ssgi"&&J!=="shadows"&&J!=="aces"&&J!=="ao_dbg"&&J!=="shd_dbg"){if(J==="chunk_dbg"){P.worldGeometryPass.setDebugChunks(A.chunk_dbg);return}if(J!=="hdr"){if(J==="auto_exp"){P.autoExposurePass.enabled=A.auto_exp;return}if(J==="fog"){P.compositePass.depthFogEnabled=A.fog;return}if(J==="rain"){await b();return}if(J==="clouds"){await b();return}await b()}}},f.card),u.setOnSelectionChanged(V.refreshSlotHighlight);const K=document.createElement("div");K.textContent="ESC  ·  resume",K.style.cssText="color:rgba(255,255,255,0.25);font-size:11px;letter-spacing:0.1em",f.card.appendChild(K),new ResizeObserver(async()=>{const J=Math.max(1,Math.round(d.clientWidth*devicePixelRatio)),ue=Math.max(1,Math.round(d.clientHeight*devicePixelRatio));J===d.width&&ue===d.height||(d.width=J,d.height=ue,await b())}).observe(d);let fe=0,ee=0,re=-1/0,q=Math.PI*.3,$=0,W=0,Y=0,te=0,me=yn(h.getBiomeAt(B.position.x,B.position.y,B.position.z));const ve=bn(h.getBiomeAt(B.position.x,B.position.y,B.position.z));let pe=ve.cloudBase,le=ve.cloudTop;const H=new Ua,ne=new O(0,0,-1),oe=new Z([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);async function ye(J){var Rr,Ir;r.pushPassErrorScope("frame");const ue=Math.min((J-fe)/1e3,.1);fe=J;const yr=J-re>=1e3;yr&&(re=J),ue>0&&(ee+=(1/ue-ee)*.1),q+=ue*.01,$+=ue,Y+=ue*1.5,te+=ue*.5;const xr=Math.sin(q),Et=.25,Ut=-xr,Ct=Math.cos(q),Lt=Math.sqrt(Et*Et+Ut*Ut+Ct*Ct);v.direction.set(Et/Lt,Ut/Lt,Ct/Lt);const kt=xr;v.intensity=Math.max(0,kt)*6;const wr=Math.max(0,kt);v.color.set(1,.8+.2*wr,.6+.4*wr),x.isPlayerMode()?S.update(B,ue):E.update(B,ue),pa(J/1e3),_a(J/1e3);const j=G.position();Xe.playerPos.x=j.x,Xe.playerPos.y=j.y,Xe.playerPos.z=j.z,_.update(ue),h.update(j,ue);const ot=h.getBiomeAt(j.x,j.y,j.z),Br=jo(ot);Br!==P.currentWeatherEffect&&(P.currentWeatherEffect=Br,await b());const In=yn(ot);me+=(In-me)*Math.min(1,.3*ue);const Sr=bn(ot);if(pe+=(Sr.cloudBase-pe)*Math.min(1,.3*ue),le+=(Sr.cloudTop-le)*Math.min(1,.3*ue),yr){p.fps.textContent=`${ee.toFixed(0)} fps`;const Be=(P.worldGeometryPass.triangles/1e3).toFixed(1);p.stats.textContent=`${P.worldGeometryPass.drawCalls} draws  ${Be}k tris
${h.chunkCount} chunks  ${h.pendingChunks} pending`,p.biome.textContent=`${we[ot]}  coverage:${me.toFixed(2)}`,p.pos.textContent=`X: ${j.x.toFixed(1)}  Y: ${j.y.toFixed(1)}  Z: ${j.z.toFixed(1)}`}const Pr=W%16+1,On=(Gn(Pr,2)-.5)*(2/r.width),Vn=(Gn(Pr,3)-.5)*(2/r.height),Te=G.viewProjectionMatrix(),Gr=Va(Te,On,Vn),ke=G.viewMatrix(),Me=G.projectionMatrix(),Ge=Te.invert(),Tr=Me.invert(),Ar=v.computeCascadeMatrices(G,128),Mr=_.collectMeshRenderers(),Dn=Mr.map(Be=>{const Or=Be.gameObject.localToWorld();return{mesh:Be.mesh,modelMatrix:Or,normalMatrix:Or.normalMatrix(),material:Be.material}}),Er=Mr.filter(Be=>Be.castShadow).map(Be=>({mesh:Be.mesh,modelMatrix:Be.gameObject.localToWorld()}));R.setSceneSnapshot(Er),R.updateScene(_,G,v,128),P.worldShadowPass.enabled=v.intensity>0,P.worldShadowPass.update(r,Ar,j.x,j.z);const at=Math.max(0,kt),zn=[.02+.38*at,.03+.52*at,.05+.65*at],Ur={cloudBase:pe,cloudTop:le,coverage:me,density:4,windOffset:[Y,te],anisotropy:.85,extinction:.25,ambientColor:zn,exposure:1};P.cloudShadowPass&&P.cloudShadowPass.update(r,Ur,[j.x,j.z],128),P.cloudPass&&(P.cloudPass.updateCamera(r,Ge,j,G.near,G.far),P.cloudPass.updateLight(r,v.direction,v.color,v.intensity),P.cloudPass.updateSettings(r,Ur));const Cr=_.getComponents($t),Lr=_.getComponents(En);P.pointSpotShadowPass.update(Cr,Lr,Er),P.pointSpotLightPass.updateCamera(r,ke,Me,Te,Ge,j,G.near,G.far),P.pointSpotLightPass.updateLights(r,Cr,Lr),P.atmospherePass.update(r,Ge,j,v.direction),P.geometryPass.setDrawItems(Dn),P.geometryPass.updateCamera(r,ke,Me,Gr,Ge,j,G.near,G.far),P.worldGeometryPass.updateCamera(r,ke,Me,Gr,Ge,j,G.near,G.far),P.waterPass.updateCamera(r,ke,Me,Te,Ge,j,G.near,G.far),P.waterPass.updateTime(r,$,Math.max(.01,at)),P.lightingPass.updateCamera(r,ke,Me,Te,Ge,j,G.near,G.far),P.lightingPass.updateLight(r,v.direction,v.color,v.intensity,Ar,A.shadows,A.shd_dbg),P.lightingPass.updateCloudShadow(r,P.cloudShadowPass?j.x:0,P.cloudShadowPass?j.z:0,128),P.ssaoPass.updateCamera(r,ke,Me,Tr),P.ssaoPass.updateParams(r,1,.005,A.ssao?2:0),P.ssgiPass.enabled=A.ssgi,P.ssgiPass.updateSettings({strength:A.ssgi?1:0}),A.ssgi&&P.ssgiPass.updateCamera(r,ke,Me,Tr,Ge,P.prevViewProj??Te,j);const kr=Math.cos(S.pitch);ne.x=-Math.sin(S.yaw)*kr,ne.y=-Math.sin(S.pitch),ne.z=-Math.cos(S.yaw)*kr;const st=h.getBlockByRay(j,ne,16),Nr=!!(st&&st.position.sub(j).length()<=6);M.targetBlock=Nr?st.position:null,M.targetHit=Nr?st:null;const Fn=M.targetBlock&&!se(h.getBlockType(M.targetBlock.x,M.targetBlock.y,M.targetBlock.z))?M.targetBlock:null;if(P.blockHighlightPass.update(r,Te,Fn),xa(J,d,M,h,()=>u.getSelected(),_),P.rainPass){H.update(j.x,j.z,h),P.rainPass.updateHeightmap(r,H.data,j.x,j.z,H.extent);const Be=P.currentWeatherEffect===Ye.Snow?20:8;oe.data[12]=j.x,oe.data[13]=j.y+Be,oe.data[14]=j.z,P.rainPass.update(r,ue,ke,Me,Te,Ge,j,G.near,G.far,oe)}(Rr=P.dofPass)==null||Rr.updateParams(r,8,75,3,G.near,G.far),(Ir=P.godrayPass)==null||Ir.updateParams(r);const Hn=se(h.getBlockType(Math.floor(j.x),Math.floor(j.y),Math.floor(j.z))),Wn={x:-v.direction.x,y:-v.direction.y,z:-v.direction.z};P.compositePass.updateParams(r,Hn,$,A.aces,A.ao_dbg,A.hdr),P.compositePass.updateStars(r,Ge,j,Wn),P.autoExposurePass.update(r,ue),P.taaPass.updateCamera(r,Ge,P.prevViewProj??Te),P.prevViewProj=Te,W++,await P.graph.execute(r),await r.popPassErrorScope("frame"),requestAnimationFrame(ye)}requestAnimationFrame(ye)}Da().catch(d=>{document.body.innerHTML=`<pre style="color:red;padding:1rem">${d}</pre>`,console.error(d)});export{tr as A,rr as B,nr as C,dr as D,St as G,er as L,gr as P,Kt as R,fr as S,or as T,Fe as W,et as a,ar as b,ir as c,lr as d,cr as e,sr as f,_r as g,hr as h,he as i,pr as j,Jt as k,ur as l,mr as m};
