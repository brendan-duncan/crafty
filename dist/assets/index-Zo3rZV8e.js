var jr=Object.defineProperty;var Yr=(d,n,e)=>n in d?jr(d,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):d[n]=e;var l=(d,n,e)=>Yr(d,typeof n!="symbol"?n+"":n,e);(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))t(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&t(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function t(r){if(r.ep)return;r.ep=!0;const i=e(r);fetch(r.href,i)}})();const Xr=""+new URL("clear_sky-CyjsjiVR.hdr",import.meta.url).href,Nt=""+new URL("simple_block_atlas-B-7juoTN.png",import.meta.url).href,$r=""+new URL("simple_block_atlas_normal-BdCvGD-K.png",import.meta.url).href,Kr=""+new URL("simple_block_atlas_mer-C_Oa_Ink.png",import.meta.url).href,Zr=""+new URL("simple_block_atlas_heightmap-BOV6qQJl.png",import.meta.url).href,Qr=""+new URL("waterDUDV-CGfbcllR.png",import.meta.url).href,Jr="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAgCAYAAADaInAlAAAA4klEQVR4Ae2UQQ4CIRAEGeAvnn2H/3+PDqBuXLnvoYqEAMvApptKx+3+eJYrW0QpNXvUNdYc57exrjkd+/u9o+58/r8+xj+yr/t+5/G+/7P3rc361lr2Onvva5zrzbyPun7Un+v259uUcdUTpFM2sgMCQH791C4AAgB3AC7fBBAAuANw+SaAAMAdgMs3AQQA7gBcvgkgAHAH4PJNAAGAOwCXbwIIANwBuHwTQADgDsDlmwACAHcALt8EEAC4A3D5JoAAwB2AyzcBBADuAFy+CSAAcAfg8k0AAYA7AJdvAsABeAEiUwM8dIJUQAAAAABJRU5ErkJggg==",ei=""+new URL("flashlight-C64SqrUS.jpg",import.meta.url).href;class k{constructor(n=0,e=0){l(this,"x");l(this,"y");this.x=n,this.y=e}set(n,e){return this.x=n,this.y=e,this}clone(){return new k(this.x,this.y)}add(n){return new k(this.x+n.x,this.y+n.y)}sub(n){return new k(this.x-n.x,this.y-n.y)}scale(n){return new k(this.x*n,this.y*n)}dot(n){return this.x*n.x+this.y*n.y}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.lengthSq())}normalize(){const n=this.length();return n>0?this.scale(1/n):new k}toArray(){return[this.x,this.y]}static zero(){return new k(0,0)}static one(){return new k(1,1)}}class O{constructor(n=0,e=0,t=0){l(this,"x");l(this,"y");l(this,"z");this.x=n,this.y=e,this.z=t}set(n,e,t){return this.x=n,this.y=e,this.z=t,this}clone(){return new O(this.x,this.y,this.z)}negate(){return new O(-this.x,-this.y,-this.z)}add(n){return new O(this.x+n.x,this.y+n.y,this.z+n.z)}sub(n){return new O(this.x-n.x,this.y-n.y,this.z-n.z)}scale(n){return new O(this.x*n,this.y*n,this.z*n)}mul(n){return new O(this.x*n.x,this.y*n.y,this.z*n.z)}dot(n){return this.x*n.x+this.y*n.y+this.z*n.z}cross(n){return new O(this.y*n.z-this.z*n.y,this.z*n.x-this.x*n.z,this.x*n.y-this.y*n.x)}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.lengthSq())}normalize(){const n=this.length();return n>0?this.scale(1/n):new O}lerp(n,e){return new O(this.x+(n.x-this.x)*e,this.y+(n.y-this.y)*e,this.z+(n.z-this.z)*e)}toArray(){return[this.x,this.y,this.z]}static zero(){return new O(0,0,0)}static one(){return new O(1,1,1)}static up(){return new O(0,1,0)}static forward(){return new O(0,0,-1)}static right(){return new O(1,0,0)}static fromArray(n,e=0){return new O(n[e],n[e+1],n[e+2])}}class Ue{constructor(n=0,e=0,t=0,r=0){l(this,"x");l(this,"y");l(this,"z");l(this,"w");this.x=n,this.y=e,this.z=t,this.w=r}set(n,e,t,r){return this.x=n,this.y=e,this.z=t,this.w=r,this}clone(){return new Ue(this.x,this.y,this.z,this.w)}add(n){return new Ue(this.x+n.x,this.y+n.y,this.z+n.z,this.w+n.w)}sub(n){return new Ue(this.x-n.x,this.y-n.y,this.z-n.z,this.w-n.w)}scale(n){return new Ue(this.x*n,this.y*n,this.z*n,this.w*n)}dot(n){return this.x*n.x+this.y*n.y+this.z*n.z+this.w*n.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.lengthSq())}toArray(){return[this.x,this.y,this.z,this.w]}static zero(){return new Ue(0,0,0,0)}static one(){return new Ue(1,1,1,1)}static fromArray(n,e=0){return new Ue(n[e],n[e+1],n[e+2],n[e+3])}}class Z{constructor(n){l(this,"data");this.data=new Float32Array(16),n&&this.data.set(n)}clone(){return new Z(this.data)}get(n,e){return this.data[n*4+e]}set(n,e,t){this.data[n*4+e]=t}multiply(n){const e=this.data,t=n.data,r=new Float32Array(16);for(let i=0;i<4;i++)for(let o=0;o<4;o++)r[i*4+o]=e[0*4+o]*t[i*4+0]+e[1*4+o]*t[i*4+1]+e[2*4+o]*t[i*4+2]+e[3*4+o]*t[i*4+3];return new Z(r)}transformPoint(n){const e=this.data,t=e[0]*n.x+e[4]*n.y+e[8]*n.z+e[12],r=e[1]*n.x+e[5]*n.y+e[9]*n.z+e[13],i=e[2]*n.x+e[6]*n.y+e[10]*n.z+e[14],o=e[3]*n.x+e[7]*n.y+e[11]*n.z+e[15];return new O(t/o,r/o,i/o)}transformDirection(n){const e=this.data;return new O(e[0]*n.x+e[4]*n.y+e[8]*n.z,e[1]*n.x+e[5]*n.y+e[9]*n.z,e[2]*n.x+e[6]*n.y+e[10]*n.z)}transformVec4(n){const e=this.data;return new Ue(e[0]*n.x+e[4]*n.y+e[8]*n.z+e[12]*n.w,e[1]*n.x+e[5]*n.y+e[9]*n.z+e[13]*n.w,e[2]*n.x+e[6]*n.y+e[10]*n.z+e[14]*n.w,e[3]*n.x+e[7]*n.y+e[11]*n.z+e[15]*n.w)}transpose(){const n=this.data;return new Z([n[0],n[4],n[8],n[12],n[1],n[5],n[9],n[13],n[2],n[6],n[10],n[14],n[3],n[7],n[11],n[15]])}invert(){const n=this.data,e=new Float32Array(16),t=n[0],r=n[1],i=n[2],o=n[3],a=n[4],s=n[5],c=n[6],u=n[7],p=n[8],f=n[9],h=n[10],m=n[11],_=n[12],w=n[13],v=n[14],x=n[15],B=t*s-r*a,G=t*c-i*a,S=t*u-o*a,E=r*c-i*s,M=r*u-o*s,A=i*u-o*c,R=p*w-f*_,P=p*v-h*_,b=p*x-m*_,C=f*v-h*w,g=f*x-m*w,T=h*x-m*v;let y=B*T-G*g+S*C+E*b-M*P+A*R;return y===0?Z.identity():(y=1/y,e[0]=(s*T-c*g+u*C)*y,e[1]=(i*g-r*T-o*C)*y,e[2]=(w*A-v*M+x*E)*y,e[3]=(h*M-f*A-m*E)*y,e[4]=(c*b-a*T-u*P)*y,e[5]=(t*T-i*b+o*P)*y,e[6]=(v*S-_*A-x*G)*y,e[7]=(p*A-h*S+m*G)*y,e[8]=(a*g-s*b+u*R)*y,e[9]=(r*b-t*g-o*R)*y,e[10]=(_*M-w*S+x*B)*y,e[11]=(f*S-p*M-m*B)*y,e[12]=(s*P-a*C-c*R)*y,e[13]=(t*C-r*P+i*R)*y,e[14]=(w*G-_*E-v*B)*y,e[15]=(p*E-f*G+h*B)*y,new Z(e))}normalMatrix(){const n=this.data,e=n[0],t=n[1],r=n[2],i=n[4],o=n[5],a=n[6],s=n[8],c=n[9],u=n[10],p=u*o-a*c,f=-u*i+a*s,h=c*i-o*s;let m=e*p+t*f+r*h;if(m===0)return Z.identity();m=1/m;const _=new Float32Array(16);return _[0]=p*m,_[4]=(-u*t+r*c)*m,_[8]=(a*t-r*o)*m,_[1]=f*m,_[5]=(u*e-r*s)*m,_[9]=(-a*e+r*i)*m,_[2]=h*m,_[6]=(-c*e+t*s)*m,_[10]=(o*e-t*i)*m,_[15]=1,new Z(_)}static identity(){return new Z([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}static translation(n,e,t){return new Z([1,0,0,0,0,1,0,0,0,0,1,0,n,e,t,1])}static scale(n,e,t){return new Z([n,0,0,0,0,e,0,0,0,0,t,0,0,0,0,1])}static rotationX(n){const e=Math.cos(n),t=Math.sin(n);return new Z([1,0,0,0,0,e,t,0,0,-t,e,0,0,0,0,1])}static rotationY(n){const e=Math.cos(n),t=Math.sin(n);return new Z([e,0,-t,0,0,1,0,0,t,0,e,0,0,0,0,1])}static rotationZ(n){const e=Math.cos(n),t=Math.sin(n);return new Z([e,t,0,0,-t,e,0,0,0,0,1,0,0,0,0,1])}static fromQuaternion(n,e,t,r){const i=n+n,o=e+e,a=t+t,s=n*i,c=e*i,u=e*o,p=t*i,f=t*o,h=t*a,m=r*i,_=r*o,w=r*a;return new Z([1-u-h,c+w,p-_,0,c-w,1-s-h,f+m,0,p+_,f-m,1-s-u,0,0,0,0,1])}static perspective(n,e,t,r){const i=1/Math.tan(n/2),o=1/(t-r);return new Z([i/e,0,0,0,0,i,0,0,0,0,r*o,-1,0,0,r*t*o,0])}static orthographic(n,e,t,r,i,o){const a=1/(n-e),s=1/(t-r),c=1/(i-o);return new Z([-2*a,0,0,0,0,-2*s,0,0,0,0,c,0,(n+e)*a,(r+t)*s,i*c,1])}static lookAt(n,e,t){const r=e.sub(n).normalize(),i=r.cross(t).normalize(),o=i.cross(r);return new Z([i.x,o.x,-r.x,0,i.y,o.y,-r.y,0,i.z,o.z,-r.z,0,-i.dot(n),-o.dot(n),r.dot(n),1])}static trs(n,e,t,r,i,o){const s=Z.fromQuaternion(e,t,r,i).data;return new Z([o.x*s[0],o.x*s[1],o.x*s[2],0,o.y*s[4],o.y*s[5],o.y*s[6],0,o.z*s[8],o.z*s[9],o.z*s[10],0,n.x,n.y,n.z,1])}}class _e{constructor(n=0,e=0,t=0,r=1){l(this,"x");l(this,"y");l(this,"z");l(this,"w");this.x=n,this.y=e,this.z=t,this.w=r}clone(){return new _e(this.x,this.y,this.z,this.w)}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.lengthSq())}normalize(){const n=this.length();return n>0?new _e(this.x/n,this.y/n,this.z/n,this.w/n):_e.identity()}conjugate(){return new _e(-this.x,-this.y,-this.z,this.w)}multiply(n){const e=this.x,t=this.y,r=this.z,i=this.w,o=n.x,a=n.y,s=n.z,c=n.w;return new _e(i*o+e*c+t*s-r*a,i*a-e*s+t*c+r*o,i*s+e*a-t*o+r*c,i*c-e*o-t*a-r*s)}rotateVec3(n){const e=this.x,t=this.y,r=this.z,i=this.w,o=i*n.x+t*n.z-r*n.y,a=i*n.y+r*n.x-e*n.z,s=i*n.z+e*n.y-t*n.x,c=-e*n.x-t*n.y-r*n.z;return new O(o*i+c*-e+a*-r-s*-t,a*i+c*-t+s*-e-o*-r,s*i+c*-r+o*-t-a*-e)}toMat4(){return Z.fromQuaternion(this.x,this.y,this.z,this.w)}slerp(n,e){let t=this.x*n.x+this.y*n.y+this.z*n.z+this.w*n.w,r=n.x,i=n.y,o=n.z,a=n.w;if(t<0&&(t=-t,r=-r,i=-i,o=-o,a=-a),t>=1)return this.clone();const s=Math.acos(t),c=Math.sqrt(1-t*t);if(Math.abs(c)<.001)return new _e(this.x*.5+r*.5,this.y*.5+i*.5,this.z*.5+o*.5,this.w*.5+a*.5);const u=Math.sin((1-e)*s)/c,p=Math.sin(e*s)/c;return new _e(this.x*u+r*p,this.y*u+i*p,this.z*u+o*p,this.w*u+a*p)}static identity(){return new _e(0,0,0,1)}static fromAxisAngle(n,e){const t=Math.sin(e/2),r=n.normalize();return new _e(r.x*t,r.y*t,r.z*t,Math.cos(e/2))}static fromEuler(n,e,t){const r=Math.cos(n/2),i=Math.sin(n/2),o=Math.cos(e/2),a=Math.sin(e/2),s=Math.cos(t/2),c=Math.sin(t/2);return new _e(i*o*s+r*a*c,r*a*s-i*o*c,r*o*c+i*a*s,r*o*s-i*a*c)}}const He=new Uint8Array([23,125,161,52,103,117,70,37,247,101,203,169,124,126,44,123,152,238,145,45,171,114,253,10,192,136,4,157,249,30,35,72,175,63,77,90,181,16,96,111,133,104,75,162,93,56,66,240,8,50,84,229,49,210,173,239,141,1,87,18,2,198,143,57,225,160,58,217,168,206,245,204,199,6,73,60,20,230,211,233,94,200,88,9,74,155,33,15,219,130,226,202,83,236,42,172,165,218,55,222,46,107,98,154,109,67,196,178,127,158,13,243,65,79,166,248,25,224,115,80,68,51,184,128,232,208,151,122,26,212,105,43,179,213,235,148,146,89,14,195,28,78,112,76,250,47,24,251,140,108,186,190,228,170,183,139,39,188,244,246,132,48,119,144,180,138,134,193,82,182,120,121,86,220,209,3,91,241,149,85,205,150,113,216,31,100,41,164,177,214,153,231,38,71,185,174,97,201,29,95,7,92,54,254,191,118,34,221,131,11,163,99,234,81,227,147,156,176,17,142,69,12,110,62,27,255,0,194,59,116,242,252,19,21,187,53,207,129,64,135,61,40,167,237,102,223,106,159,197,189,215,137,36,32,22,5,23,125,161,52,103,117,70,37,247,101,203,169,124,126,44,123,152,238,145,45,171,114,253,10,192,136,4,157,249,30,35,72,175,63,77,90,181,16,96,111,133,104,75,162,93,56,66,240,8,50,84,229,49,210,173,239,141,1,87,18,2,198,143,57,225,160,58,217,168,206,245,204,199,6,73,60,20,230,211,233,94,200,88,9,74,155,33,15,219,130,226,202,83,236,42,172,165,218,55,222,46,107,98,154,109,67,196,178,127,158,13,243,65,79,166,248,25,224,115,80,68,51,184,128,232,208,151,122,26,212,105,43,179,213,235,148,146,89,14,195,28,78,112,76,250,47,24,251,140,108,186,190,228,170,183,139,39,188,244,246,132,48,119,144,180,138,134,193,82,182,120,121,86,220,209,3,91,241,149,85,205,150,113,216,31,100,41,164,177,214,153,231,38,71,185,174,97,201,29,95,7,92,54,254,191,118,34,221,131,11,163,99,234,81,227,147,156,176,17,142,69,12,110,62,27,255,0,194,59,116,242,252,19,21,187,53,207,129,64,135,61,40,167,237,102,223,106,159,197,189,215,137,36,32,22,5]),Ne=new Uint8Array([7,9,5,0,11,1,6,9,3,9,11,1,8,10,4,7,8,6,1,5,3,10,9,10,0,8,4,1,5,2,7,8,7,11,9,10,1,0,4,7,5,0,11,6,1,4,2,8,8,10,4,9,9,2,5,7,9,1,7,2,2,6,11,5,5,4,6,9,0,1,1,0,7,6,9,8,4,10,3,1,2,8,8,9,10,11,5,11,11,2,6,10,3,4,2,4,9,10,3,2,6,3,6,10,5,3,4,10,11,2,9,11,1,11,10,4,9,4,11,0,4,11,4,0,0,0,7,6,10,4,1,3,11,5,3,4,2,9,1,3,0,1,8,0,6,7,8,7,0,4,6,10,8,2,3,11,11,8,0,2,4,8,3,0,0,10,6,1,2,2,4,5,6,0,1,3,11,9,5,5,9,6,9,8,3,8,1,8,9,6,9,11,10,7,5,6,5,9,1,3,7,0,2,10,11,2,6,1,3,11,7,7,2,1,7,3,0,8,1,1,5,0,6,10,11,11,0,2,7,0,10,8,3,5,7,1,11,1,0,7,9,0,11,5,10,3,2,3,5,9,7,9,8,4,6,5,7,9,5,0,11,1,6,9,3,9,11,1,8,10,4,7,8,6,1,5,3,10,9,10,0,8,4,1,5,2,7,8,7,11,9,10,1,0,4,7,5,0,11,6,1,4,2,8,8,10,4,9,9,2,5,7,9,1,7,2,2,6,11,5,5,4,6,9,0,1,1,0,7,6,9,8,4,10,3,1,2,8,8,9,10,11,5,11,11,2,6,10,3,4,2,4,9,10,3,2,6,3,6,10,5,3,4,10,11,2,9,11,1,11,10,4,9,4,11,0,4,11,4,0,0,0,7,6,10,4,1,3,11,5,3,4,2,9,1,3,0,1,8,0,6,7,8,7,0,4,6,10,8,2,3,11,11,8,0,2,4,8,3,0,0,10,6,1,2,2,4,5,6,0,1,3,11,9,5,5,9,6,9,8,3,8,1,8,9,6,9,11,10,7,5,6,5,9,1,3,7,0,2,10,11,2,6,1,3,11,7,7,2,1,7,3,0,8,1,1,5,0,6,10,11,11,0,2,7,0,10,8,3,5,7,1,11,1,0,7,9,0,11,5,10,3,2,3,5,9,7,9,8,4,6,5]),Rt=new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]);function It(d){const n=d|0;return d<n?n-1:n}function Re(d,n,e,t){const r=d*3;return Rt[r]*n+Rt[r+1]*e+Rt[r+2]*t}function Ot(d){return((d*6-15)*d+10)*d*d*d}function Xt(d,n,e,t,r,i,o){const a=t-1&255,s=r-1&255,c=i-1&255,u=It(d),p=It(n),f=It(e),h=u&a,m=u+1&a,_=p&s,w=p+1&s,v=f&c,x=f+1&c,B=d-u,G=Ot(B),S=n-p,E=Ot(S),M=e-f,A=Ot(M),R=He[h+o],P=He[m+o],b=He[R+_],C=He[R+w],g=He[P+_],T=He[P+w],y=Re(Ne[b+v],B,S,M),U=Re(Ne[b+x],B,S,M-1),N=Re(Ne[C+v],B,S-1,M),V=Re(Ne[C+x],B,S-1,M-1),z=Re(Ne[g+v],B-1,S,M),I=Re(Ne[g+x],B-1,S,M-1),K=Re(Ne[T+v],B-1,S-1,M),de=Re(Ne[T+x],B-1,S-1,M-1),fe=y+(U-y)*A,ee=N+(V-N)*A,ne=z+(I-z)*A,q=K+(de-K)*A,$=fe+(ee-fe)*E,W=ne+(q-ne)*E;return $+(W-$)*G}function xe(d,n,e,t,r,i,o){return Xt(d,n,e,t,r,i,o&255)}function Ar(d,n,e,t,r,i,o){let a=1,s=1,c=.5,u=0;for(let p=0;p<o;p++){let f=Xt(d*a,n*a,e*a,0,0,0,p&255);f=i-Math.abs(f),f=f*f,u+=f*c*s,s=f,a*=t,c*=r}return u}function Dn(d,n,e,t,r,i){let o=1,a=1,s=0;for(let c=0;c<i;c++)s+=Math.abs(Xt(d*o,n*o,e*o,0,0,0,c&255)*a),o*=t,a*=r;return s}const Gt=class Gt extends Uint32Array{constructor(e){super(6);l(this,"_seed");this._seed=0,this.seed=e??Date.now()}get seed(){return this[0]}set seed(e){this._seed=e,this[0]=e,this[1]=this[0]*1812433253+1>>>0,this[2]=this[1]*1812433253+1>>>0,this[3]=this[2]*1812433253+1>>>0,this[4]=0,this[5]=0}reset(){this.seed=this._seed}randomUint32(){let e=this[3];const t=this[0];return this[3]=this[2],this[2]=this[1],this[1]=t,e^=e>>>2,e^=e<<1,e^=t^t<<4,this[0]=e,this[4]=this[4]+362437>>>0,this[5]=e+this[4]>>>0,this[5]}randomFloat(e,t){const r=(this.randomUint32()&8388607)*11920930376163766e-23;return e===void 0?r:r*((t??1)-e)+e}randomDouble(e,t){const r=this.randomUint32()>>>5,i=this.randomUint32()>>>6,o=(r*67108864+i)*(1/9007199254740992);return e===void 0?o:o*((t??1)-e)+e}};l(Gt,"global",new Gt);let be=Gt;class $e{constructor(){l(this,"gameObject")}onAttach(){}onDetach(){}update(n){}}class Le{constructor(n="GameObject"){l(this,"name");l(this,"position");l(this,"rotation");l(this,"scale");l(this,"children",[]);l(this,"parent",null);l(this,"_components",[]);this.name=n,this.position=O.zero(),this.rotation=_e.identity(),this.scale=O.one()}addComponent(n){return n.gameObject=this,this._components.push(n),n.onAttach(),n}getComponent(n){for(const e of this._components)if(e instanceof n)return e;return null}getComponents(n){return this._components.filter(e=>e instanceof n)}removeComponent(n){const e=this._components.indexOf(n);e!==-1&&(n.onDetach(),this._components.splice(e,1))}addChild(n){n.parent=this,this.children.push(n)}localToWorld(){const n=Z.trs(this.position,this.rotation.x,this.rotation.y,this.rotation.z,this.rotation.w,this.scale);return this.parent?this.parent.localToWorld().multiply(n):n}update(n){for(const e of this._components)e.update(n);for(const e of this.children)e.update(n)}}class Mr extends $e{constructor(e=60,t=.1,r=1e3,i=16/9){super();l(this,"fov");l(this,"near");l(this,"far");l(this,"aspect");this.fov=e*(Math.PI/180),this.near=t,this.far=r,this.aspect=i}projectionMatrix(){return Z.perspective(this.fov,this.aspect,this.near,this.far)}viewMatrix(){return this.gameObject.localToWorld().invert()}viewProjectionMatrix(){return this.projectionMatrix().multiply(this.viewMatrix())}position(){const e=this.gameObject.localToWorld();return new O(e.data[12],e.data[13],e.data[14])}frustumCornersWorld(){const e=this.viewProjectionMatrix().invert();return[[-1,-1,0],[1,-1,0],[-1,1,0],[1,1,0],[-1,-1,1],[1,-1,1],[-1,1,1],[1,1,1]].map(([r,i,o])=>e.transformPoint(new O(r,i,o)))}}class Er extends $e{constructor(e=new O(.3,-1,.5),t=O.one(),r=1,i=3){super();l(this,"direction");l(this,"color");l(this,"intensity");l(this,"numCascades");this.direction=e.normalize(),this.color=t,this.intensity=r,this.numCascades=i}computeCascadeMatrices(e,t){const r=t??e.far,i=this._computeSplitDepths(e.near,r,this.numCascades),o=[];for(let a=0;a<this.numCascades;a++){const s=a===0?e.near:i[a-1],c=i[a],u=this._frustumCornersForSplit(e,s,c),p=u.reduce((g,T)=>g.add(T),O.zero()).scale(1/8),f=this.direction.normalize(),h=Z.lookAt(p.sub(f),p,new O(0,1,0)),m=2048;let _=0;for(const g of u)_=Math.max(_,g.sub(p).length());let w=2*_/m;_=Math.ceil(_/w)*w,_*=m/(m-2),w=2*_/m;let v=1/0,x=-1/0;for(const g of u){const T=h.transformPoint(g);v=Math.min(v,T.z),x=Math.max(x,T.z)}const B=Math.min((x-v)*.25,64);v-=B,x+=B;let G=Z.orthographic(-_,_,-_,_,-x,-v);const E=G.multiply(h).transformPoint(p),M=E.x*.5+.5,A=.5-E.y*.5,R=Math.round(M*m)/m,P=Math.round(A*m)/m,b=(R-M)*2,C=-(P-A)*2;G.set(3,0,G.get(3,0)+b),G.set(3,1,G.get(3,1)+C),o.push({lightViewProj:G.multiply(h),splitFar:c,depthRange:x-v,texelWorldSize:w})}return o}_computeSplitDepths(e,t,r){const o=[];for(let a=1;a<=r;a++){const s=e+(t-e)*(a/r),c=e*Math.pow(t/e,a/r);o.push(.75*c+(1-.75)*s)}return o}_frustumCornersForSplit(e,t,r){const i=e.near,o=e.far;e.near=t,e.far=r;const a=e.frustumCornersWorld();return e.near=i,e.far=o,a}}var Je=(d=>(d.Forward="forward",d.Geometry="geometry",d.SkinnedGeometry="skinnedGeometry",d))(Je||{});class ti{constructor(){l(this,"transparent",!1)}}class wt extends $e{constructor(e,t){super();l(this,"mesh");l(this,"material");l(this,"castShadow",!0);this.mesh=e,this.material=t}}class ni{constructor(){l(this,"gameObjects",[])}add(n){this.gameObjects.push(n)}remove(n){const e=this.gameObjects.indexOf(n);e!==-1&&this.gameObjects.splice(e,1)}update(n){for(const e of this.gameObjects)e.update(n)}findCamera(){for(const n of this.gameObjects){const e=n.getComponent(Mr);if(e)return e}return null}findDirectionalLight(){for(const n of this.gameObjects){const e=n.getComponent(Er);if(e)return e}return null}collectMeshRenderers(){const n=[];for(const e of this.gameObjects)this._collectMeshRenderersRecursive(e,n);return n}_collectMeshRenderersRecursive(n,e){const t=n.getComponent(wt);t&&e.push(t);for(const r of n.children)this._collectMeshRenderersRecursive(r,e)}getComponents(n){const e=[];for(const t of this.gameObjects){const r=t.getComponent(n);r&&e.push(r)}return e}}const ri=[new O(1,0,0),new O(-1,0,0),new O(0,1,0),new O(0,-1,0),new O(0,0,1),new O(0,0,-1)],ii=[new O(0,-1,0),new O(0,-1,0),new O(0,0,1),new O(0,0,-1),new O(0,-1,0),new O(0,-1,0)];class $t extends $e{constructor(){super(...arguments);l(this,"color",O.one());l(this,"intensity",1);l(this,"radius",10);l(this,"castShadow",!1)}worldPosition(){return this.gameObject.localToWorld().transformPoint(O.zero())}cubeFaceViewProjs(e=.05){const t=this.worldPosition(),r=Z.perspective(Math.PI/2,1,e,this.radius),i=new Array(6);for(let o=0;o<6;o++)i[o]=r.multiply(Z.lookAt(t,t.add(ri[o]),ii[o]));return i}}class Ur extends $e{constructor(){super(...arguments);l(this,"color",O.one());l(this,"intensity",1);l(this,"range",20);l(this,"innerAngle",15);l(this,"outerAngle",30);l(this,"castShadow",!1);l(this,"projectionTexture",null)}worldPosition(){return this.gameObject.localToWorld().transformPoint(O.zero())}worldDirection(){return this.gameObject.localToWorld().transformDirection(new O(0,0,-1)).normalize()}lightViewProj(e=.1){const t=this.worldPosition(),r=this.worldDirection(),i=Math.abs(r.y)>.99?new O(1,0,0):new O(0,1,0),o=Z.lookAt(t,t.add(r),i);return Z.perspective(this.outerAngle*2*Math.PI/180,1,e,this.range).multiply(o)}}const oi=new O(0,1,0),ai=new O(1,0,0),si=3;class li{constructor(n=0,e=0,t=5,r=.002){l(this,"yaw");l(this,"pitch");l(this,"speed");l(this,"sensitivity");l(this,"inputForward",0);l(this,"inputStrafe",0);l(this,"inputUp",!1);l(this,"inputDown",!1);l(this,"inputFast",!1);l(this,"_keys",new Set);l(this,"_canvas",null);l(this,"_onMouseMove");l(this,"_onKeyDown");l(this,"_onKeyUp");l(this,"_onClick");l(this,"usePointerLock",!0);this.yaw=n,this.pitch=e,this.speed=t,this.sensitivity=r;const i=Math.PI/2-.001;this._onMouseMove=o=>{document.pointerLockElement===this._canvas&&(this.yaw-=o.movementX*this.sensitivity,this.pitch=Math.max(-i,Math.min(i,this.pitch+o.movementY*this.sensitivity)))},this._onKeyDown=o=>this._keys.add(o.code),this._onKeyUp=o=>this._keys.delete(o.code),this._onClick=()=>{var o;this.usePointerLock&&((o=this._canvas)==null||o.requestPointerLock())}}attach(n){this._canvas=n,n.addEventListener("click",this._onClick),document.addEventListener("mousemove",this._onMouseMove),document.addEventListener("keydown",this._onKeyDown),document.addEventListener("keyup",this._onKeyUp)}pressKey(n){this._keys.add(n)}applyLookDelta(n,e){const t=Math.PI/2-.001;this.yaw-=n*this.sensitivity,this.pitch=Math.max(-t,Math.min(t,this.pitch+e*this.sensitivity))}detach(){this._canvas&&(this._canvas.removeEventListener("click",this._onClick),document.removeEventListener("mousemove",this._onMouseMove),document.removeEventListener("keydown",this._onKeyDown),document.removeEventListener("keyup",this._onKeyUp),this._canvas=null)}update(n,e){const t=Math.sin(this.yaw),r=Math.cos(this.yaw);let i=0,o=0,a=0;(this._keys.has("KeyW")||this._keys.has("ArrowUp"))&&(i-=t,a-=r),(this._keys.has("KeyS")||this._keys.has("ArrowDown"))&&(i+=t,a+=r),(this._keys.has("KeyA")||this._keys.has("ArrowLeft"))&&(i-=r,a+=t),(this._keys.has("KeyD")||this._keys.has("ArrowRight"))&&(i+=r,a-=t),this.inputForward!==0&&(i-=t*this.inputForward,a-=r*this.inputForward),this.inputStrafe!==0&&(i+=r*this.inputStrafe,a-=t*this.inputStrafe),(this._keys.has("Space")||this.inputUp)&&(o+=1),(this._keys.has("ShiftLeft")||this.inputDown)&&(o-=1);const s=Math.sqrt(i*i+o*o+a*a);if(s>0){const c=this._keys.has("ControlLeft")||this._keys.has("AltLeft")||this.inputFast,u=this.speed*(c?si:1)*e/s;n.position.x+=i*u,n.position.y+=o*u,n.position.z+=a*u}n.rotation=_e.fromAxisAngle(oi,this.yaw).multiply(_e.fromAxisAngle(ai,-this.pitch))}}const ci=400,ui=16,Cr=ci/ui;var L=(d=>(d[d.NONE=0]="NONE",d[d.GRASS=1]="GRASS",d[d.SAND=2]="SAND",d[d.STONE=3]="STONE",d[d.DIRT=4]="DIRT",d[d.TRUNK=5]="TRUNK",d[d.TREELEAVES=6]="TREELEAVES",d[d.WATER=7]="WATER",d[d.GLASS=8]="GLASS",d[d.FLOWER=9]="FLOWER",d[d.GLOWSTONE=10]="GLOWSTONE",d[d.MAGMA=11]="MAGMA",d[d.OBSIDIAN=12]="OBSIDIAN",d[d.DIAMOND=13]="DIAMOND",d[d.IRON=14]="IRON",d[d.SPECULAR=15]="SPECULAR",d[d.CACTUS=16]="CACTUS",d[d.SNOW=17]="SNOW",d[d.GRASS_SNOW=18]="GRASS_SNOW",d[d.SPRUCE_PLANKS=19]="SPRUCE_PLANKS",d[d.GRASS_PROP=20]="GRASS_PROP",d[d.TORCH=21]="TORCH",d[d.DEAD_BUSH=22]="DEAD_BUSH",d[d.SNOWYLEAVES=23]="SNOWYLEAVES",d[d.AMETHYST=24]="AMETHYST",d[d.MAX=25]="MAX",d))(L||{});class ie{constructor(n,e,t,r){l(this,"blockType");l(this,"sideFace");l(this,"bottomFace");l(this,"topFace");this.blockType=n,this.sideFace=e,this.bottomFace=t,this.topFace=r}}const At=[new ie(0,new k(0,0),new k(0,0),new k(0,0)),new ie(1,new k(1,0),new k(3,0),new k(2,0)),new ie(2,new k(4,0),new k(4,0),new k(4,0)),new ie(3,new k(5,0),new k(5,0),new k(5,0)),new ie(4,new k(6,0),new k(6,0),new k(6,0)),new ie(5,new k(7,0),new k(8,0),new k(8,0)),new ie(6,new k(9,0),new k(9,0),new k(9,0)),new ie(7,new k(2,29),new k(2,29),new k(2,29)),new ie(8,new k(10,0),new k(10,0),new k(10,0)),new ie(9,new k(23,0),new k(23,0),new k(23,0)),new ie(10,new k(11,0),new k(11,0),new k(11,0)),new ie(11,new k(12,0),new k(12,0),new k(12,0)),new ie(12,new k(13,0),new k(13,0),new k(13,0)),new ie(13,new k(14,0),new k(14,0),new k(14,0)),new ie(14,new k(15,0),new k(15,0),new k(15,0)),new ie(15,new k(0,24),new k(0,24),new k(0,24)),new ie(16,new k(17,0),new k(18,0),new k(16,0)),new ie(17,new k(19,0),new k(19,0),new k(19,0)),new ie(18,new k(20,0),new k(3,0),new k(21,0)),new ie(19,new k(22,0),new k(22,0),new k(22,0)),new ie(20,new k(1,1),new k(1,1),new k(1,1)),new ie(21,new k(2,1),new k(2,1),new k(2,1)),new ie(22,new k(3,1),new k(3,1),new k(3,1)),new ie(23,new k(4,1),new k(9,0),new k(21,0)),new ie(24,new k(5,1),new k(5,1),new k(5,1)),new ie(25,new k(0,0),new k(0,0),new k(0,0))];class ae{constructor(n,e,t,r){l(this,"blockType");l(this,"materialType");l(this,"emitsLight");l(this,"collidable");this.blockType=n,this.materialType=e,this.emitsLight=t,this.collidable=r}}const nt=[new ae(0,1,0,0),new ae(1,0,0,1),new ae(2,0,0,1),new ae(3,0,0,1),new ae(4,0,0,1),new ae(5,0,0,1),new ae(6,1,0,1),new ae(7,2,0,0),new ae(8,1,0,1),new ae(9,3,0,0),new ae(10,0,1,1),new ae(11,0,1,1),new ae(12,0,0,1),new ae(13,0,0,1),new ae(14,0,0,1),new ae(15,0,0,1),new ae(16,0,0,1),new ae(17,0,0,1),new ae(18,0,0,1),new ae(19,0,0,1),new ae(20,3,0,0),new ae(21,3,1,0),new ae(22,3,0,0),new ae(23,1,0,1),new ae(24,0,0,1)],di=["None","Grass","Sand","Stone","Dirt","Trunk","Tree leaves","Water","Glass","Flower","Glowstone","Magma","Obsidian","Diamond","Iron","Specular","Cactus","Snow","Grass snow","Spruce planks","Grass prop","Torch","Dead bush","Snowy leaves","Amethyst","Max"];function se(d){return nt[d].materialType===2}function lt(d){return nt[d].materialType===1||nt[d].materialType===3}function zn(d){return nt[d].emitsLight===1}function Se(d){return nt[d].materialType===3}const fi=new O(0,1,0),pi=new O(1,0,0),hi=-28,mi=-4,_i=1.3,gi=4.3,vi=7,bi=11.5,yi=3.5,ge=.3,Ke=1.8,Fn=1.62;class xi{constructor(n,e=Math.PI,t=.1){l(this,"yaw");l(this,"pitch");l(this,"sensitivity",.002);l(this,"inputForward",0);l(this,"inputStrafe",0);l(this,"inputJump",!1);l(this,"inputSneak",!1);l(this,"inputSprint",!1);l(this,"_velY",0);l(this,"_onGround",!1);l(this,"_prevInWater",!1);l(this,"_coyoteFrames",0);l(this,"_keys",new Set);l(this,"_canvas",null);l(this,"_world");l(this,"_onMouseMove");l(this,"_onKeyDown");l(this,"_onKeyUp");l(this,"_onClick");l(this,"usePointerLock",!0);this._world=n,this.yaw=e,this.pitch=t;const r=Math.PI/2-.001;this._onMouseMove=i=>{document.pointerLockElement===this._canvas&&(this.yaw-=i.movementX*this.sensitivity,this.pitch=Math.max(-r,Math.min(r,this.pitch+i.movementY*this.sensitivity)))},this._onKeyDown=i=>this._keys.add(i.code),this._onKeyUp=i=>this._keys.delete(i.code),this._onClick=()=>{var i;this.usePointerLock&&((i=this._canvas)==null||i.requestPointerLock())}}set velY(n){this._velY=n}attach(n){this._canvas=n,n.addEventListener("click",this._onClick),document.addEventListener("mousemove",this._onMouseMove),document.addEventListener("keydown",this._onKeyDown),document.addEventListener("keyup",this._onKeyUp)}applyLookDelta(n,e){const t=Math.PI/2-.001;this.yaw-=n*this.sensitivity,this.pitch=Math.max(-t,Math.min(t,this.pitch+e*this.sensitivity))}detach(){this._canvas&&(this._canvas.removeEventListener("click",this._onClick),document.removeEventListener("mousemove",this._onMouseMove),document.removeEventListener("keydown",this._onKeyDown),document.removeEventListener("keyup",this._onKeyUp),this._canvas=null)}update(n,e){e=Math.min(e,.05),n.rotation=_e.fromAxisAngle(fi,this.yaw).multiply(_e.fromAxisAngle(pi,-this.pitch));const t=Math.sin(this.yaw),r=Math.cos(this.yaw),i=this._keys.has("ControlLeft")||this._keys.has("AltLeft")||this.inputSprint,o=this._keys.has("ShiftLeft")||this.inputSneak,a=i?vi:o?_i:gi;let s=0,c=0;(this._keys.has("KeyW")||this._keys.has("ArrowUp"))&&(s-=t,c-=r),(this._keys.has("KeyS")||this._keys.has("ArrowDown"))&&(s+=t,c+=r),(this._keys.has("KeyA")||this._keys.has("ArrowLeft"))&&(s-=r,c+=t),(this._keys.has("KeyD")||this._keys.has("ArrowRight"))&&(s+=r,c-=t),this.inputForward!==0&&(s-=t*this.inputForward,c-=r*this.inputForward),this.inputStrafe!==0&&(s+=r*this.inputStrafe,c-=t*this.inputStrafe);const u=Math.sqrt(s*s+c*c);if(u>0){const B=1/Math.max(u,1);s=s*B*a,c=c*B*a}let p=n.position.x,f=n.position.y-Fn,h=n.position.z;const m=se(this._world.getBlockType(Math.floor(p),Math.floor(f+Ke*.5),Math.floor(h))),_=this._keys.has("Space")||this.inputJump;m?(_&&(this._velY=yi),this._velY=Math.max(this._velY+mi*e,-2)):(this._prevInWater&&this._velY>0&&(this._velY=0),_&&(this._onGround||this._coyoteFrames>0)&&(this._velY=bi,this._coyoteFrames=0),this._velY=Math.max(this._velY+hi*e,-50)),p=this._slideX(p+s*e,f,h,s),h=this._slideZ(p,f,h+c*e,c);const[w,v,x]=this._slideY(p,f+this._velY*e,h);(v||x)&&(this._velY=0),f=w,this._onGround=v,this._prevInWater=m,v?this._coyoteFrames=6:m||(this._coyoteFrames=Math.max(0,this._coyoteFrames-1)),n.position.x=p,n.position.y=f+Fn,n.position.z=h}_isSolid(n,e,t){const r=this._world.getBlockType(n,e,t);return r!==L.NONE&&!se(r)&&!Se(r)}_slideX(n,e,t,r){if(Math.abs(r)<1e-6)return n;const i=r>0?n+ge:n-ge,o=Math.floor(i),a=Math.floor(e+.01),s=Math.floor(e+Ke-.01),c=Math.floor(t-ge+.01),u=Math.floor(t+ge-.01);for(let p=a;p<=s;p++)for(let f=c;f<=u;f++)if(this._isSolid(o,p,f))return r>0?o-ge-.001:o+1+ge+.001;return n}_slideZ(n,e,t,r){if(Math.abs(r)<1e-6)return t;const i=r>0?t+ge:t-ge,o=Math.floor(i),a=Math.floor(e+.01),s=Math.floor(e+Ke-.01),c=Math.floor(n-ge+.01),u=Math.floor(n+ge-.01);for(let p=a;p<=s;p++)for(let f=c;f<=u;f++)if(this._isSolid(f,p,o))return r>0?o-ge-.001:o+1+ge+.001;return t}_slideY(n,e,t){const r=Math.floor(n-ge+.01),i=Math.floor(n+ge-.01),o=Math.floor(t-ge+.01),a=Math.floor(t+ge-.01);if(this._velY<=0){const s=Math.floor(e-.001);for(let c=r;c<=i;c++)for(let u=o;u<=a;u++)if(this._isSolid(c,s,u))return[s+1,!0,!1];return[e,!1,!1]}else{const s=Math.floor(e+Ke);for(let c=r;c<=i;c++)for(let u=o;u<=a;u++)if(this._isSolid(c,s,u))return[s-Ke-.001,!1,!0];return[e,!1,!1]}}}class Kt{constructor(n,e,t,r,i,o){l(this,"device");l(this,"queue");l(this,"context");l(this,"format");l(this,"canvas");l(this,"hdr");l(this,"enableErrorHandling");this.device=n,this.queue=n.queue,this.context=e,this.format=t,this.canvas=r,this.hdr=i,this.enableErrorHandling=o}get width(){return this.canvas.width}get height(){return this.canvas.height}static async create(n,e={}){if(!navigator.gpu)throw new Error("WebGPU not supported");const t=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!t)throw new Error("No WebGPU adapter found");const r=await t.requestDevice({requiredFeatures:[]});e.enableErrorHandling&&r.addEventListener("uncapturederror",s=>{const c=s.error;c instanceof GPUValidationError?console.error("[WebGPU Validation Error]",c.message):c instanceof GPUOutOfMemoryError?console.error("[WebGPU Out of Memory]"):console.error("[WebGPU Internal Error]",c)});const i=n.getContext("webgpu");let o,a=!1;try{i.configure({device:r,format:"rgba16float",alphaMode:"opaque",colorSpace:"display-p3",toneMapping:{mode:"extended"}}),o="rgba16float",a=!0}catch{o=navigator.gpu.getPreferredCanvasFormat(),i.configure({device:r,format:o,alphaMode:"opaque"})}return n.width=n.clientWidth*devicePixelRatio,n.height=n.clientHeight*devicePixelRatio,new Kt(r,i,o,n,a,e.enableErrorHandling??!1)}getCurrentTexture(){return this.context.getCurrentTexture()}createBuffer(n,e,t){return this.device.createBuffer({size:n,usage:e,label:t})}writeBuffer(n,e,t=0){e instanceof ArrayBuffer?this.queue.writeBuffer(n,t,e):this.queue.writeBuffer(n,t,e.buffer,e.byteOffset,e.byteLength)}pushInitErrorScope(){this.enableErrorHandling&&this.device.pushErrorScope("validation")}async popInitErrorScope(n){if(this.enableErrorHandling){const e=await this.device.popErrorScope();e&&(console.error(`[Init:${n}] Validation Error:`,e.message),console.trace())}}pushFrameErrorScope(){this.enableErrorHandling&&this.device.pushErrorScope("validation")}async popFrameErrorScope(){if(this.enableErrorHandling){const n=await this.device.popErrorScope();n&&(console.error("[Frame] Validation Error:",n.message),console.trace())}}pushPassErrorScope(n){this.enableErrorHandling&&(this.device.pushErrorScope("validation"),this.device.pushErrorScope("out-of-memory"),this.device.pushErrorScope("internal"))}async popPassErrorScope(n){if(this.enableErrorHandling){const e=await this.device.popErrorScope();e&&console.error(`[${n}] Internal Error:`,e),await this.device.popErrorScope()&&console.error(`[${n}] Out of Memory`);const r=await this.device.popErrorScope();r&&console.error(`[${n}] Validation Error:`,r.message)}}}class he{constructor(){l(this,"enabled",!0)}destroy(){}}class St{constructor(n,e,t,r,i){l(this,"albedoRoughness");l(this,"normalMetallic");l(this,"depth");l(this,"albedoRoughnessView");l(this,"normalMetallicView");l(this,"depthView");l(this,"width");l(this,"height");this.albedoRoughness=n,this.normalMetallic=e,this.depth=t,this.width=r,this.height=i,this.albedoRoughnessView=n.createView(),this.normalMetallicView=e.createView(),this.depthView=t.createView()}static create(n){const{device:e,width:t,height:r}=n,i=e.createTexture({label:"GBuffer AlbedoRoughness",size:{width:t,height:r},format:"rgba8unorm",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),o=e.createTexture({label:"GBuffer NormalMetallic",size:{width:t,height:r},format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),a=e.createTexture({label:"GBuffer Depth",size:{width:t,height:r},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING});return new St(i,o,a,t,r)}destroy(){this.albedoRoughness.destroy(),this.normalMetallic.destroy(),this.depth.destroy()}}const Zt=48,Qt=[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x3"},{shaderLocation:2,offset:24,format:"float32x2"},{shaderLocation:3,offset:32,format:"float32x4"}];class Ce{constructor(n,e,t){l(this,"vertexBuffer");l(this,"indexBuffer");l(this,"indexCount");this.vertexBuffer=n,this.indexBuffer=e,this.indexCount=t}destroy(){this.vertexBuffer.destroy(),this.indexBuffer.destroy()}static fromData(n,e,t){const r=n.createBuffer({label:"Mesh VertexBuffer",size:e.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});n.queue.writeBuffer(r,0,e.buffer,e.byteOffset,e.byteLength);const i=n.createBuffer({label:"Mesh IndexBuffer",size:t.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST});return n.queue.writeBuffer(i,0,t.buffer,t.byteOffset,t.byteLength),new Ce(r,i,t.length)}static createCube(n,e=1){const t=e/2,r=[{normal:[0,0,1],tangent:[1,0,0,1],verts:[[-t,-t,t],[t,-t,t],[t,t,t],[-t,t,t]]},{normal:[0,0,-1],tangent:[-1,0,0,1],verts:[[t,-t,-t],[-t,-t,-t],[-t,t,-t],[t,t,-t]]},{normal:[1,0,0],tangent:[0,0,-1,1],verts:[[t,-t,t],[t,-t,-t],[t,t,-t],[t,t,t]]},{normal:[-1,0,0],tangent:[0,0,1,1],verts:[[-t,-t,-t],[-t,-t,t],[-t,t,t],[-t,t,-t]]},{normal:[0,1,0],tangent:[1,0,0,1],verts:[[-t,t,t],[t,t,t],[t,t,-t],[-t,t,-t]]},{normal:[0,-1,0],tangent:[1,0,0,1],verts:[[-t,-t,-t],[t,-t,-t],[t,-t,t],[-t,-t,t]]}],i=[[0,1],[1,1],[1,0],[0,0]],o=[],a=[];let s=0;for(const c of r){for(let u=0;u<4;u++)o.push(...c.verts[u],...c.normal,...i[u],...c.tangent);a.push(s,s+1,s+2,s,s+2,s+3),s+=4}return Ce.fromData(n,new Float32Array(o),new Uint32Array(a))}static createSphere(n,e=.5,t=32,r=32){const i=[],o=[];for(let a=0;a<=t;a++){const s=a/t*Math.PI,c=Math.sin(s),u=Math.cos(s);for(let p=0;p<=r;p++){const f=p/r*Math.PI*2,h=Math.sin(f),m=Math.cos(f),_=c*m,w=u,v=c*h;i.push(_*e,w*e,v*e,_,w,v,p/r,a/t,-h,0,m,1)}}for(let a=0;a<t;a++)for(let s=0;s<r;s++){const c=a*(r+1)+s,u=c+r+1;o.push(c,c+1,u),o.push(c+1,u+1,u)}return Ce.fromData(n,new Float32Array(i),new Uint32Array(o))}static createCone(n,e=.5,t=1,r=16){const i=[],o=[],a=Math.sqrt(t*t+e*e),s=t/a,c=e/a;i.push(0,t,0,0,1,0,.5,0,1,0,0,1);const u=1;for(let h=0;h<=r;h++){const m=h/r*Math.PI*2,_=Math.cos(m),w=Math.sin(m);i.push(_*e,0,w*e,_*s,c,w*s,h/r,1,_,0,w,1)}for(let h=0;h<r;h++)o.push(0,u+h+1,u+h);const p=u+r+1;i.push(0,0,0,0,-1,0,.5,.5,1,0,0,1);const f=p+1;for(let h=0;h<=r;h++){const m=h/r*Math.PI*2,_=Math.cos(m),w=Math.sin(m);i.push(_*e,0,w*e,0,-1,0,.5+_*.5,.5+w*.5,1,0,0,1)}for(let h=0;h<r;h++)o.push(p,f+h,f+h+1);return Ce.fromData(n,new Float32Array(i),new Uint32Array(o))}static createPlane(n,e=10,t=10,r=1,i=1){const o=[],a=[];for(let s=0;s<=i;s++)for(let c=0;c<=r;c++){const u=(c/r-.5)*e,p=(s/i-.5)*t,f=c/r,h=s/i;o.push(u,0,p,0,1,0,f,h,1,0,0,1)}for(let s=0;s<i;s++)for(let c=0;c<r;c++){const u=s*(r+1)+c;a.push(u,u+r+1,u+1,u+1,u+r+1,u+r+2)}return Ce.fromData(n,new Float32Array(o),new Uint32Array(a))}}const Lr=`// Shadow map rendering shader - outputs depth only

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
`,Hn=2048,ct=4;class Jt extends he{constructor(e,t,r,i,o,a,s,c){super();l(this,"name","ShadowPass");l(this,"shadowMap");l(this,"shadowMapView");l(this,"shadowMapArrayViews");l(this,"_pipeline");l(this,"_shadowBindGroups");l(this,"_shadowUniformBuffers");l(this,"_modelUniformBuffers",[]);l(this,"_modelBindGroups",[]);l(this,"_cascadeCount");l(this,"_cascades",[]);l(this,"_modelBGL");l(this,"_sceneSnapshot",[]);this.shadowMap=e,this.shadowMapView=t,this.shadowMapArrayViews=r,this._pipeline=i,this._shadowBindGroups=o,this._shadowUniformBuffers=a,this._modelBGL=s,this._cascadeCount=c}static create(e,t=3){const{device:r}=e,i=r.createTexture({label:"ShadowMap",size:{width:Hn,height:Hn,depthOrArrayLayers:ct},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),o=i.createView({dimension:"2d-array"}),a=Array.from({length:ct},(m,_)=>i.createView({dimension:"2d",baseArrayLayer:_,arrayLayerCount:1})),s=r.createBindGroupLayout({label:"ShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),c=r.createBindGroupLayout({label:"ModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),u=[],p=[];for(let m=0;m<ct;m++){const _=r.createBuffer({label:`ShadowUniformBuffer ${m}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});u.push(_),p.push(r.createBindGroup({label:`ShadowBindGroup ${m}`,layout:s,entries:[{binding:0,resource:{buffer:_}}]}))}const f=r.createShaderModule({label:"ShadowShader",code:Lr}),h=r.createRenderPipeline({label:"ShadowPipeline",layout:r.createPipelineLayout({bindGroupLayouts:[s,c]}),vertex:{module:f,entryPoint:"vs_main",buffers:[{arrayStride:Zt,attributes:[Qt[0]]}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less",depthBias:2,depthBiasSlopeScale:2.5,depthBiasClamp:0},primitive:{topology:"triangle-list",cullMode:"back"}});return new Jt(i,o,a,h,p,u,c,t)}updateScene(e,t,r,i){this._cascades=r.computeCascadeMatrices(t,i),this._cascadeCount=Math.min(this._cascades.length,ct)}execute(e,t){const{device:r}=t,i=this._getMeshRenderers(t);this._ensureModelBuffers(r,i.length);for(let o=0;o<this._cascadeCount&&!(o>=this._cascades.length);o++){const a=this._cascades[o];t.queue.writeBuffer(this._shadowUniformBuffers[o],0,a.lightViewProj.data.buffer);const s=e.beginRenderPass({label:`ShadowPass cascade ${o}`,colorAttachments:[],depthStencilAttachment:{view:this.shadowMapArrayViews[o],depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});s.setPipeline(this._pipeline),s.setBindGroup(0,this._shadowBindGroups[o]);for(let c=0;c<i.length;c++){const{mesh:u,modelMatrix:p}=i[c],f=this._modelUniformBuffers[c];t.queue.writeBuffer(f,0,p.data.buffer),s.setBindGroup(1,this._modelBindGroups[c]),s.setVertexBuffer(0,u.vertexBuffer),s.setIndexBuffer(u.indexBuffer,"uint32"),s.drawIndexed(u.indexCount)}s.end()}}_getMeshRenderers(e){return this._sceneSnapshot??[]}setSceneSnapshot(e){this._sceneSnapshot=e}_ensureModelBuffers(e,t){for(;this._modelUniformBuffers.length<t;){const r=e.createBuffer({label:`ModelUniform ${this._modelUniformBuffers.length}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),i=e.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:r}}]});this._modelUniformBuffers.push(r),this._modelBindGroups.push(i)}}destroy(){this.shadowMap.destroy();for(const e of this._shadowUniformBuffers)e.destroy();for(const e of this._modelUniformBuffers)e.destroy()}}const wi=`// Deferred PBR lighting pass — fullscreen triangle, reads GBuffer + shadow maps + IBL.

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

// Simplified scatter for fog colour (6 main steps).
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

  // Sample fog colour using only the horizontal component of the ray direction.
  // Using the true ray direction creates a visible line at camera height where
  // the sky-scatter colour changes as the downward angle exceeds any clamp value.
  // Projecting to horizontal makes fog colour a function of azimuth only (sun angle),
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
        // 2-pixel border in the cascade's debug colour
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
  let cloud_uv  = clamp(
    (world_pos.xz - light.cloudShadowOrigin) / (cloud_ext * 2.0) + 0.5,
    vec2<f32>(0.0), vec2<f32>(1.0),
  );
  let cloud_shadow = select(
    textureSampleLevel(cloudShadowTex, gbufferSampler, cloud_uv, 0.0).r,
    1.0,
    light.cloudShadowExtent <= 0.0,
  );

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
`,Q="rgba16float",Wn=64*4+16+16,qn=368;class en extends he{constructor(e,t,r,i,o,a,s,c,u,p,f,h,m,_,w,v){super();l(this,"name","LightingPass");l(this,"hdrTexture");l(this,"hdrView");l(this,"cameraBuffer");l(this,"lightBuffer");l(this,"_pipeline");l(this,"_sceneBindGroup");l(this,"_gbufferBindGroup");l(this,"_aoBindGroup");l(this,"_iblBindGroup");l(this,"_defaultCloudShadow");l(this,"_defaultSsgi");l(this,"_device");l(this,"_aoBGL");l(this,"_aoView");l(this,"_aoSampler");l(this,"_ssgiSampler");l(this,"_cameraScratch",new Float32Array(Wn/4));l(this,"_lightScratch",new Float32Array(qn/4));l(this,"_lightScratchU",new Uint32Array(this._lightScratch.buffer));l(this,"_cloudShadowScratch",new Float32Array(3));this.hdrTexture=e,this.hdrView=t,this._pipeline=r,this._sceneBindGroup=i,this._gbufferBindGroup=o,this._aoBindGroup=a,this._iblBindGroup=s,this.cameraBuffer=c,this.lightBuffer=u,this._defaultCloudShadow=p,this._defaultSsgi=f,this._device=h,this._aoBGL=m,this._aoView=_,this._aoSampler=w,this._ssgiSampler=v}static create(e,t,r,i,o,a){const{device:s,width:c,height:u}=e,p=s.createTexture({label:"HDR Texture",size:{width:c,height:u},format:Q,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),f=p.createView(),h=s.createBuffer({label:"LightCameraBuffer",size:Wn,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),m=s.createBuffer({label:"LightBuffer",size:qn,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),_=s.createSampler({label:"ShadowSampler",compare:"less-equal",magFilter:"linear",minFilter:"linear"}),w=s.createSampler({label:"GBufferLinearSampler",magFilter:"linear",minFilter:"linear"}),v=s.createSampler({label:"AoSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),x=s.createSampler({label:"SsgiSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),B=s.createBindGroupLayout({label:"LightSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),G=s.createBindGroupLayout({label:"LightGBufferBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth",viewDimension:"2d-array"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"comparison"}},{binding:5,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:6,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),S=s.createTexture({label:"DefaultCloudShadow",size:{width:1,height:1},format:"r8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});s.queue.writeTexture({texture:S},new Uint8Array([255]),{bytesPerRow:1},{width:1,height:1});const E=o??S.createView(),M=s.createBindGroupLayout({label:"LightAoBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),A=s.createTexture({label:"DefaultSsgi",size:{width:1,height:1},format:Q,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),R=s.createBindGroupLayout({label:"LightIblBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),P=s.createSampler({label:"IblSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge"}),b=s.createTexture({label:"DefaultIblCube",size:{width:1,height:1,depthOrArrayLayers:6},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),C=b.createView({dimension:"cube"}),g=s.createTexture({label:"DefaultBrdfLut",size:{width:1,height:1},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),T=s.createBindGroup({label:"LightIblBG",layout:R,entries:[{binding:0,resource:(a==null?void 0:a.irradianceView)??C},{binding:1,resource:(a==null?void 0:a.prefilteredView)??C},{binding:2,resource:(a==null?void 0:a.brdfLutView)??g.createView()},{binding:3,resource:P}]});b.destroy(),g.destroy();const y=s.createBindGroup({layout:B,entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:{buffer:m}}]}),U=s.createBindGroup({layout:G,entries:[{binding:0,resource:t.albedoRoughnessView},{binding:1,resource:t.normalMetallicView},{binding:2,resource:t.depthView},{binding:3,resource:r.shadowMapView},{binding:4,resource:_},{binding:5,resource:w},{binding:6,resource:E}]}),N=s.createBindGroup({label:"LightAoBG",layout:M,entries:[{binding:0,resource:i},{binding:1,resource:v},{binding:2,resource:A.createView()},{binding:3,resource:x}]}),V=s.createShaderModule({label:"LightingShader",code:wi}),z=s.createRenderPipeline({label:"LightingPipeline",layout:s.createPipelineLayout({bindGroupLayouts:[B,G,M,R]}),vertex:{module:V,entryPoint:"vs_main"},fragment:{module:V,entryPoint:"fs_main",targets:[{format:Q}]},primitive:{topology:"triangle-list"}});return new en(p,f,z,y,U,N,T,h,m,o?null:S,A,s,M,i,v,x)}updateSSGI(e){this._aoBindGroup=this._device.createBindGroup({label:"LightAoBG",layout:this._aoBGL,entries:[{binding:0,resource:this._aoView},{binding:1,resource:this._aoSampler},{binding:2,resource:e},{binding:3,resource:this._ssgiSampler}]})}updateCamera(e,t,r,i,o,a,s,c){const u=this._cameraScratch;u.set(t.data,0),u.set(r.data,16),u.set(i.data,32),u.set(o.data,48),u[64]=a.x,u[65]=a.y,u[66]=a.z,u[67]=s,u[68]=c,e.queue.writeBuffer(this.cameraBuffer,0,u.buffer)}updateLight(e,t,r,i,o,a=!0,s=!1,c=.02){const u=this._lightScratch,p=this._lightScratchU;let f=0;u[f++]=t.x,u[f++]=t.y,u[f++]=t.z,u[f++]=i,u[f++]=r.x,u[f++]=r.y,u[f++]=r.z,p[f++]=o.length;for(let h=0;h<4;h++)h<o.length&&u.set(o[h].lightViewProj.data,f),f+=16;for(let h=0;h<4;h++)u[f++]=h<o.length?o[h].splitFar:1e9;p[f]=a?1:0,p[f+1]=s?1:0,u[81]=c;for(let h=0;h<4;h++)u[84+h]=h<o.length?o[h].depthRange:1;for(let h=0;h<4;h++)u[88+h]=h<o.length?o[h].texelWorldSize:1;e.queue.writeBuffer(this.lightBuffer,0,u.buffer)}updateCloudShadow(e,t,r,i){const o=this._cloudShadowScratch;o[0]=t,o[1]=r,o[2]=i,e.queue.writeBuffer(this.lightBuffer,312,o.buffer)}execute(e,t){const r=e.beginRenderPass({label:"LightingPass",colorAttachments:[{view:this.hdrView,loadOp:"load",storeOp:"store"}]});r.setPipeline(this._pipeline),r.setBindGroup(0,this._sceneBindGroup),r.setBindGroup(1,this._gbufferBindGroup),r.setBindGroup(2,this._aoBindGroup),r.setBindGroup(3,this._iblBindGroup),r.draw(3),r.end()}destroy(){var e,t;this.hdrTexture.destroy(),this.cameraBuffer.destroy(),this.lightBuffer.destroy(),(e=this._defaultCloudShadow)==null||e.destroy(),(t=this._defaultSsgi)==null||t.destroy()}}const Bi=`// Physically based single-scattering atmosphere (Rayleigh + Mie).
// Reference: Nishita 1993, Preetham 1999, Hillaire 2020 (simplified).
//
// World units are metres.  The ground sits at y ≈ 0 so the camera is placed at
// (0, R_E + cameraPos.y, 0) in atmosphere space.

const PI    : f32 = 3.14159265358979;
const R_E   : f32 = 6360000.0;   // Earth radius (m)
const R_A   : f32 = 6420000.0;   // Atmosphere top radius (m)
const H_R   : f32 = 8500.0;      // Rayleigh scale height (m)
const H_M   : f32 = 1200.0;      // Mie scale height (m)
const G     : f32 = 0.758;       // Mie anisotropy (forward-scattering haze)
// Rayleigh coefficients (per metre) tuned to 680 / 550 / 440 nm wavelengths.
const BETA_R : vec3<f32> = vec3<f32>(5.5e-6, 13.0e-6, 22.4e-6);
// Mie coefficient (per metre, wavelength-independent for haze).
const BETA_M : f32 = 21.0e-6;
// Solar irradiance at top of atmosphere (in renderer HDR units).
const SUN_INTENSITY : f32 = 20.0;
// Angular cosine thresholds for sun and moon disks.
const SUN_COS_THRESH  : f32 = 0.9996;   // ~1.6° angular radius (~3× real sun)
const MOON_COS_THRESH : f32 = 0.9997;   // slightly smaller than sun

struct Uniforms {
  invViewProj : mat4x4<f32>,
  cameraPos   : vec3<f32>,
  _pad0       : f32,
  sunDir      : vec3<f32>,  // unit vector pointing TOWARD the sun
  _pad1       : f32,
}

@group(0) @binding(0) var<uniform> u: Uniforms;

// Ray–sphere intersection.  Returns (tNear, tFar); both negative means no hit.
fn raySphere(ro: vec3<f32>, rd: vec3<f32>, r: f32) -> vec2<f32> {
  let b  = dot(ro, rd);
  let c  = dot(ro, ro) - r * r;
  let d  = b * b - c;
  if (d < 0.0) { return vec2<f32>(-1.0, -1.0); }
  let sq = sqrt(d);
  return vec2<f32>(-b - sq, -b + sq);
}

fn phaseR(mu: f32) -> f32 {
  return (3.0 / (16.0 * PI)) * (1.0 + mu * mu);
}

fn phaseM(mu: f32) -> f32 {
  let g2 = G * G;
  return (3.0 / (8.0 * PI)) *
         ((1.0 - g2) * (1.0 + mu * mu)) /
         ((2.0 + g2) * pow(max(1.0 + g2 - 2.0 * G * mu, 1e-4), 1.5));
}

// Optical depth from \`pos\` toward \`dir\` through the atmosphere.
fn opticalDepthToSky(pos: vec3<f32>, dir: vec3<f32>) -> vec2<f32> {
  let t  = raySphere(pos, dir, R_A);
  let ds = t.y / 8.0;
  var od = vec2<f32>(0.0);
  for (var i = 0; i < 8; i++) {
    let h = length(pos + dir * ((f32(i) + 0.5) * ds)) - R_E;
    if (h < 0.0) { break; }
    od += vec2<f32>(exp(-h / H_R), exp(-h / H_M)) * ds;
  }
  return od;
}

// Transmittance of the atmosphere from \`ro\` in direction \`rd\` (used for the sun disk).
fn transmittance(ro: vec3<f32>, rd: vec3<f32>) -> vec3<f32> {
  let od = opticalDepthToSky(ro, rd);
  return exp(-(BETA_R * od.x + BETA_M * 1.1 * od.y));
}

// Single-scattering integral along the view ray.
fn scatter(ro: vec3<f32>, rd: vec3<f32>) -> vec3<f32> {
  let ta   = raySphere(ro, rd, R_A);
  let tMin = max(ta.x, 0.0);
  if (ta.y < 0.0) { return vec3<f32>(0.0); }

  // Clip view ray at the ground surface.
  let tg   = raySphere(ro, rd, R_E);
  let tMax = select(ta.y, min(ta.y, tg.x), tg.x > 0.0);
  if (tMax <= tMin) { return vec3<f32>(0.0); }

  let mu = dot(rd, u.sunDir);
  let pR = phaseR(mu);
  let pM = phaseM(mu);

  let ds = (tMax - tMin) / 16.0;
  var sumR = vec3<f32>(0.0);
  var sumM = vec3<f32>(0.0);
  var odR  = 0.0;
  var odM  = 0.0;

  for (var i = 0; i < 16; i++) {
    let pos = ro + rd * (tMin + (f32(i) + 0.5) * ds);
    let h   = length(pos) - R_E;
    if (h < 0.0) { break; }

    let hrh = exp(-h / H_R) * ds;
    let hmh = exp(-h / H_M) * ds;
    odR += hrh;
    odM += hmh;

    // Light ray toward the sun — skip if blocked by Earth.
    let tg2 = raySphere(pos, u.sunDir, R_E);
    if (tg2.x > 0.0) { continue; }

    let odL = opticalDepthToSky(pos, u.sunDir);

    let tau = BETA_R * (odR + odL.x) + BETA_M * 1.1 * (odM + odL.y);
    let T   = exp(-tau);
    sumR += T * hrh;
    sumM += T * hmh;
  }

  return SUN_INTENSITY * (BETA_R * pR * sumR + vec3<f32>(BETA_M) * pM * sumM);
}

// --- Vertex shader (fullscreen triangle) ---

struct VertOut {
  @builtin(position) clip_pos : vec4<f32>,
  @location(0)       uv       : vec2<f32>,
}

@vertex
fn vs_main(@builtin(vertex_index) vid: u32) -> VertOut {
  let x = f32((vid & 1u) << 2u) - 1.0;
  let y = f32((vid & 2u) << 1u) - 1.0;
  var out: VertOut;
  out.clip_pos = vec4<f32>(x, y, 0.0, 1.0);
  out.uv       = vec2<f32>(x * 0.5 + 0.5, y * -0.5 + 0.5);
  return out;
}

@fragment
fn fs_main(in: VertOut) -> @location(0) vec4<f32> {
  // Reconstruct world-space view direction.
  let ndc = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, 1.0, 1.0);
  let wh  = u.invViewProj * ndc;
  let rd  = normalize(wh.xyz / wh.w - u.cameraPos);

  // Place camera on Earth's surface (world y ≈ metres above sea level).
  let camH = max(u.cameraPos.y, 1.0);
  let ro   = vec3<f32>(0.0, R_E + camH, 0.0);

  var color = scatter(ro, rd);

  // Sun disk: bright limb attenuated by atmosphere transmittance.
  if (dot(rd, u.sunDir) > SUN_COS_THRESH) {
    color += transmittance(ro, u.sunDir) * 1000.0;
  }

  // Moon disk: antipodal to the sun, fades in after sunset.
  // SUN_COS_THRESH gives the same ~0.36° angular radius as the sun.
  let moonDir = -u.sunDir;
  if (dot(rd, moonDir) > MOON_COS_THRESH) {
    let night_t = saturate((-u.sunDir.y - 0.05) * 10.0);
    color += transmittance(ro, moonDir) * vec3<f32>(0.85, 0.90, 1.0) * 15.0 * night_t;
  }

  return vec4<f32>(color, 1.0);
}
`,jn=96;class tn extends he{constructor(e,t,r,i){super();l(this,"name","AtmospherePass");l(this,"_pipeline");l(this,"_uniformBuf");l(this,"_bg");l(this,"_hdrView");this._pipeline=e,this._uniformBuf=t,this._bg=r,this._hdrView=i}static create(e,t){const{device:r}=e,i=r.createBuffer({label:"AtmosphereUniform",size:jn,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),o=r.createBindGroupLayout({label:"AtmosphereBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),a=r.createBindGroup({label:"AtmosphereBG",layout:o,entries:[{binding:0,resource:{buffer:i}}]}),s=r.createShaderModule({label:"AtmosphereShader",code:Bi}),c=r.createRenderPipeline({label:"AtmospherePipeline",layout:r.createPipelineLayout({bindGroupLayouts:[o]}),vertex:{module:s,entryPoint:"vs_main"},fragment:{module:s,entryPoint:"fs_main",targets:[{format:Q}]},primitive:{topology:"triangle-list"}});return new tn(c,i,a,t)}update(e,t,r,i){const o=new Float32Array(jn/4);o.set(t.data,0),o[16]=r.x,o[17]=r.y,o[18]=r.z;const a=Math.sqrt(i.x*i.x+i.y*i.y+i.z*i.z),s=a>0?1/a:0;o[20]=-i.x*s,o[21]=-i.y*s,o[22]=-i.z*s,e.queue.writeBuffer(this._uniformBuf,0,o.buffer)}execute(e,t){const r=e.beginRenderPass({label:"AtmospherePass",colorAttachments:[{view:this._hdrView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._pipeline),r.setBindGroup(0,this._bg),r.draw(3),r.end()}destroy(){this._uniformBuf.destroy()}}const Si=`// Block selection highlight — two draw calls sharing this shader:
//   draw(36): semi-transparent dark face overlay (6 faces × 2 triangles × 3 verts)
//   draw(36, 36): thick edge outlines (12 edges × 2 quads × 3 verts, offset into same array)
//
// Corner index encoding: bit 0 = x, bit 1 = y, bit 2 = z (0=min, 1=max side).

struct Uniforms {
  viewProj : mat4x4<f32>,
  blockPos : vec3<f32>,
  _pad     : f32,
}

@group(0) @binding(0) var<uniform> u: Uniforms;

// ── 36 vertices for 6 faces (triangle-list, cullMode=none) ──────────────────
// Each row: two triangles covering one face of the unit cube.
const FACE_CI: array<u32, 36> = array<u32, 36>(
  0u,3u,2u, 0u,1u,3u,   // -Z  (ci 0,1,2,3 → z=0 face)
  4u,6u,7u, 4u,7u,5u,   // +Z  (ci 4,5,6,7 → z=1 face)
  0u,6u,4u, 0u,2u,6u,   // -X  (ci 0,2,4,6 → x=0 face)
  1u,5u,7u, 1u,7u,3u,   // +X  (ci 1,3,5,7 → x=1 face)
  0u,5u,1u, 0u,4u,5u,   // -Y  (ci 0,1,4,5 → y=0 face)
  2u,3u,7u, 2u,7u,6u,   // +Y  (ci 2,3,6,7 → y=1 face)
);

// ── 72 vertices for 12 edges rendered as quads (triangle-list) ───────────────
// Each edge is two thin quads (one in each perpendicular plane), so 4 triangles.
// W = half-width of each quad in world units.
const W: f32 = 0.04;
const E: f32 = 0.002;   // small inset so edges sit on the block surface

// For each of the 12 cube edges, 6 vertices (2 triangles = 1 quad in the primary plane).
// We render each edge as two perpendicular quads by using a second index buffer offset.
// Layout: for edge i, primary-plane quad at [i*6 .. i*6+5].

// 12 edge corner-index pairs (each edge = two corners)
const EDGE_A: array<u32, 12> = array<u32, 12>(
  0u, 2u, 4u, 6u,   // X-axis edges (vary x, fix y,z)
  0u, 1u, 4u, 5u,   // Y-axis edges (vary y, fix x,z)
  0u, 1u, 2u, 3u,   // Z-axis edges (vary z, fix x,y)
);
const EDGE_B: array<u32, 12> = array<u32, 12>(
  1u, 3u, 5u, 7u,
  2u, 3u, 6u, 7u,
  4u, 5u, 6u, 7u,
);

// Per-edge offset axis for the primary quad: 0=X,1=Y,2=Z axis edges get perpendicular in Y or Z.
// We expand the primary quad by ±W in the "secondary" axis.
// Edge type 0 (X-axis): primary quad expands in Y → secondary in Z handled separately.
// Edge type 1 (Y-axis): primary quad expands in X → secondary in Z.
// Edge type 2 (Z-axis): primary quad expands in X → secondary in Y.
// We encode the expand axis for the primary quad as u32.
const EDGE_TYPE: array<u32, 12> = array<u32, 12>(
  0u,0u,0u,0u,   // X edges
  1u,1u,1u,1u,   // Y edges
  2u,2u,2u,2u,   // Z edges
);

fn ci_to_pos(ci: u32) -> vec3<f32> {
  return u.blockPos + vec3<f32>(
    mix(E, 1.0 - E, f32((ci >> 0u) & 1u)),
    mix(E, 1.0 - E, f32((ci >> 1u) & 1u)),
    mix(E, 1.0 - E, f32((ci >> 2u) & 1u)),
  );
}

// ── Vertex shader for the face overlay ──────────────────────────────────────

// Clip-space depth bias: subtract a fraction of clip.w from clip.z, which
// pushes the rasterised NDC depth toward the camera by a fixed 0.001 (1‰).
// Reliable across drivers/depth formats; the WebGPU \`depthBias\` pipeline
// state is implementation-defined for \`depth32float\`.
const Z_BIAS: f32 = 0.001;

fn bias_clip(clip: vec4<f32>) -> vec4<f32> {
  return vec4<f32>(clip.x, clip.y, clip.z - Z_BIAS * clip.w, clip.w);
}

@vertex
fn vs_face(@builtin(vertex_index) vid: u32) -> @builtin(position) vec4<f32> {
  let ci  = FACE_CI[vid];
  let pos = u.blockPos + vec3<f32>(
    mix(-0.001, 1.001, f32((ci >> 0u) & 1u)),
    mix(-0.001, 1.001, f32((ci >> 1u) & 1u)),
    mix(-0.001, 1.001, f32((ci >> 2u) & 1u)),
  );
  return bias_clip(u.viewProj * vec4<f32>(pos, 1.0));
}

@fragment
fn fs_face() -> @location(0) vec4<f32> {
  return vec4<f32>(0.0, 0.0, 0.0, 0.35);
}

// ── Vertex shader for edge quads ─────────────────────────────────────────────
// Each edge renders as two quads (primary + secondary perpendicular planes).
// First 72 vertices = primary plane quads, next 72 = secondary plane quads.

@vertex
fn vs_edge(@builtin(vertex_index) vid: u32) -> @builtin(position) vec4<f32> {
  let secondary = vid >= 72u;
  let local_vid = vid % 72u;
  let edge_idx  = local_vid / 6u;          // 0..11
  let vert_idx  = local_vid % 6u;          // 0..5 (two triangles: 012, 034... wait, 0-1-2, 0-2-3)

  let A = ci_to_pos(EDGE_A[edge_idx]);
  let B = ci_to_pos(EDGE_B[edge_idx]);

  // Quad vertex offsets along the perpendicular axis.
  // Quad pattern for 6 verts: 0=A-perp, 1=B-perp, 2=B+perp, 3=A+perp (→ tris 0,1,2 and 0,2,3)
  let quad_v = array<u32, 6>(0u, 1u, 2u, 0u, 2u, 3u);
  let qv     = quad_v[vert_idx];

  // Side flag: -1 for perp0, +1 for perp1
  let side = select(-W, W, qv == 1u || qv == 2u);
  // Endpoint flag: A or B
  let at_b = (qv == 1u || qv == 2u || (qv == 3u));  // B endpoints
  // Actually remap: 0→A-, 1→B-, 2→B+, 3→A+
  let use_b = (qv == 1u || qv == 2u);
  let base  = select(A, B, use_b);
  let sgn   = select(-W, W, qv == 2u || qv == 3u);

  let etype = EDGE_TYPE[edge_idx];
  var off = vec3<f32>(0.0);
  if (!secondary) {
    // Primary perpendicular axis
    if (etype == 0u) { off.y = sgn; }        // X-edge: expand in Y
    else if (etype == 1u) { off.x = sgn; }   // Y-edge: expand in X
    else { off.x = sgn; }                     // Z-edge: expand in X
  } else {
    // Secondary perpendicular axis
    if (etype == 0u) { off.z = sgn; }        // X-edge: expand in Z
    else if (etype == 1u) { off.z = sgn; }   // Y-edge: expand in Z
    else { off.y = sgn; }                     // Z-edge: expand in Y
  }

  return bias_clip(u.viewProj * vec4<f32>(base + off, 1.0));
}

@fragment
fn fs_edge() -> @location(0) vec4<f32> {
  return vec4<f32>(0.0, 0.0, 0.0, 0.8);
}
`,Yn=80;class nn extends he{constructor(e,t,r,i,o,a){super();l(this,"name","BlockHighlightPass");l(this,"_facePipeline");l(this,"_edgePipeline");l(this,"_uniformBuf");l(this,"_bg");l(this,"_hdrView");l(this,"_depthView");l(this,"_active",!1);this._facePipeline=e,this._edgePipeline=t,this._uniformBuf=r,this._bg=i,this._hdrView=o,this._depthView=a}static create(e,t,r){const{device:i}=e,o=i.createBuffer({label:"BlockHighlightUniform",size:Yn,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),a=i.createBindGroupLayout({label:"BlockHighlightBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),s=i.createBindGroup({label:"BlockHighlightBG",layout:a,entries:[{binding:0,resource:{buffer:o}}]}),c=i.createShaderModule({label:"BlockHighlightShader",code:Si}),u=i.createPipelineLayout({bindGroupLayouts:[a]}),p={format:"depth32float",depthWriteEnabled:!1,depthCompare:"less-equal"},f={color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}},h=i.createRenderPipeline({label:"BlockHighlightFacePipeline",layout:u,vertex:{module:c,entryPoint:"vs_face"},fragment:{module:c,entryPoint:"fs_face",targets:[{format:Q,blend:f}]},primitive:{topology:"triangle-list",cullMode:"none"},depthStencil:p}),m=i.createRenderPipeline({label:"BlockHighlightEdgePipeline",layout:u,vertex:{module:c,entryPoint:"vs_edge"},fragment:{module:c,entryPoint:"fs_edge",targets:[{format:Q,blend:f}]},primitive:{topology:"triangle-list",cullMode:"none"},depthStencil:p});return new nn(h,m,o,s,t,r)}update(e,t,r){if(!r){this._active=!1;return}this._active=!0;const i=new Float32Array(Yn/4);i.set(t.data,0),i[16]=r.x,i[17]=r.y,i[18]=r.z,e.queue.writeBuffer(this._uniformBuf,0,i.buffer)}execute(e,t){if(!this._active)return;const r=e.beginRenderPass({label:"BlockHighlightPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._depthView,depthLoadOp:"load",depthStoreOp:"store"}});r.setBindGroup(0,this._bg),r.setPipeline(this._facePipeline),r.draw(36),r.setPipeline(this._edgePipeline),r.draw(144),r.end()}destroy(){this._uniformBuf.destroy()}}const Pi=`// Cloud + sky pass — fullscreen triangle.
// Raymarches through a cloud slab with Beer's law transmittance and self-shadow
// light marching.  Sky colour is computed with the same Rayleigh+Mie model as
// atmosphere.wgsl so no sky texture is needed.

const PI: f32 = 3.14159265358979323846;

// ---- Uniforms ----------------------------------------------------------------

struct CameraUniforms {
  invViewProj: mat4x4<f32>,
  position: vec3<f32>,
  near: f32,
  far: f32,
}

struct CloudUniforms {
  cloudBase: f32,
  cloudTop: f32,
  coverage: f32,
  density: f32,
  windOffset: vec2<f32>,
  anisotropy: f32,
  extinction: f32,
  ambientColor: vec3<f32>,
  exposure: f32,
}

struct LightUniforms {
  direction: vec3<f32>,
  intensity: f32,
  color: vec3<f32>,
  _pad: f32,
}

@group(0) @binding(0) var<uniform> camera: CameraUniforms;
@group(0) @binding(1) var<uniform> cloud : CloudUniforms;
@group(1) @binding(0) var<uniform> light : LightUniforms;
@group(2) @binding(0) var          depth_tex  : texture_depth_2d;
@group(2) @binding(1) var          depth_samp : sampler;
@group(3) @binding(0) var          base_noise  : texture_3d<f32>;
@group(3) @binding(1) var          detail_noise: texture_3d<f32>;
@group(3) @binding(2) var          noise_samp  : sampler;

// ---- Atmosphere (Rayleigh + Mie) for sky colour ------------------------------

const R_E            : f32       = 6360000.0;
const R_A            : f32       = 6420000.0;
const H_R            : f32       = 8500.0;
const H_M            : f32       = 1200.0;
const G_ATM          : f32       = 0.758;
const BETA_R         : vec3<f32> = vec3<f32>(5.5e-6, 13.0e-6, 22.4e-6);
const BETA_M_ATM     : f32       = 21.0e-6;
const SUN_INTENSITY  : f32       = 20.0;
const SUN_COS_THRESH  : f32 = 0.999976;  // 10% larger angular radius than default
const MOON_COS_THRESH : f32 = 0.999978;  //  5% larger angular radius than default

fn ray_sphere(ro: vec3<f32>, rd: vec3<f32>, r: f32) -> vec2<f32> {
  let b = dot(ro, rd);
  let c = dot(ro, ro) - r * r;
  let d = b * b - c;
  if (d < 0.0) { return vec2<f32>(-1.0, -1.0); }
  let sq = sqrt(d);
  return vec2<f32>(-b - sq, -b + sq);
}

fn phase_r(mu: f32) -> f32 {
  return (3.0 / (16.0 * PI)) * (1.0 + mu * mu);
}

fn phase_m_atm(mu: f32) -> f32 {
  let g2 = G_ATM * G_ATM;
  return (3.0 / (8.0 * PI)) *
         ((1.0 - g2) * (1.0 + mu * mu)) /
         ((2.0 + g2) * pow(max(1.0 + g2 - 2.0 * G_ATM * mu, 1e-4), 1.5));
}

fn optical_depth_to_sky(pos: vec3<f32>, dir: vec3<f32>) -> vec2<f32> {
  let t  = ray_sphere(pos, dir, R_A);
  let ds = t.y / 4.0;
  var od = vec2<f32>(0.0);
  for (var i = 0; i < 4; i++) {
    let h = length(pos + dir * ((f32(i) + 0.5) * ds)) - R_E;
    if (h < 0.0) { break; }
    od += vec2<f32>(exp(-h / H_R), exp(-h / H_M)) * ds;
  }
  return od;
}

fn sky_transmittance(ro: vec3<f32>, rd: vec3<f32>) -> vec3<f32> {
  let od = optical_depth_to_sky(ro, rd);
  return exp(-(BETA_R * od.x + BETA_M_ATM * 1.1 * od.y));
}

fn scatter_sky(ro: vec3<f32>, rd: vec3<f32>, sun_dir: vec3<f32>) -> vec3<f32> {
  let ta   = ray_sphere(ro, rd, R_A);
  let tMin = max(ta.x, 0.0);
  if (ta.y < 0.0) { return vec3<f32>(0.0); }
  let tg   = ray_sphere(ro, rd, R_E);
  let tMax = select(ta.y, min(ta.y, tg.x), tg.x > 0.0);
  if (tMax <= tMin) { return vec3<f32>(0.0); }

  let mu = dot(rd, sun_dir);
  let pR = phase_r(mu);
  let pM = phase_m_atm(mu);
  let ds = (tMax - tMin) / 8.0;

  var sumR = vec3<f32>(0.0);
  var sumM = vec3<f32>(0.0);
  var odR  = 0.0;
  var odM  = 0.0;

  for (var i = 0; i < 8; i++) {
    let pos = ro + rd * (tMin + (f32(i) + 0.5) * ds);
    let h   = length(pos) - R_E;
    if (h < 0.0) { break; }
    let hrh = exp(-h / H_R) * ds;
    let hmh = exp(-h / H_M) * ds;
    odR += hrh;
    odM += hmh;
    let tg2 = ray_sphere(pos, sun_dir, R_E);
    if (tg2.x > 0.0) { continue; }
    let odL = optical_depth_to_sky(pos, sun_dir);
    let tau = BETA_R * (odR + odL.x) + BETA_M_ATM * 1.1 * (odM + odL.y);
    let T   = exp(-tau);
    sumR += T * hrh;
    sumM += T * hmh;
  }

  return SUN_INTENSITY * (BETA_R * pR * sumR + vec3<f32>(BETA_M_ATM) * pM * sumM);
}

// ---- Vertex shader -----------------------------------------------------------

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

// ---- Cloud helpers -----------------------------------------------------------

fn remap(v: f32, lo: f32, hi: f32, a: f32, b: f32) -> f32 {
  return a + saturate((v - lo) / max(hi - lo, 0.0001)) * (b - a);
}

fn height_gradient(y: f32) -> f32 {
  let t    = clamp((y - cloud.cloudBase) / max(cloud.cloudTop - cloud.cloudBase, 0.001), 0.0, 1.0);
  let base = remap(t, 0.0, 0.07, 0.0, 1.0);
  let top  = remap(t, 0.2, 1.0,  1.0, 0.0);
  return saturate(base * top);
}

fn hg_phase(cos_theta: f32, g: f32) -> f32 {
  let g2 = g * g;
  return (1.0 - g2) / (4.0 * PI * pow(1.0 + g2 - 2.0 * g * cos_theta, 1.5));
}

fn dual_phase(cos_theta: f32, g: f32) -> f32 {
  return 0.7 * hg_phase(cos_theta, g) + 0.3 * hg_phase(cos_theta, -0.25);
}

fn sample_pw(samp_uv: vec3<f32>) -> f32 {
  let s = textureSampleLevel(base_noise, noise_samp, samp_uv, 0.0);
  let w = s.g * 0.5 + s.b * 0.35 + s.a * 0.15;
  return remap(s.r, 1.0 - w, 1.0, 0.0, 1.0);
}

fn sample_density(p: vec3<f32>) -> f32 {
  let wind = vec3<f32>(cloud.windOffset.x, 0.0, cloud.windOffset.y);
  // Large-scale pass (3× coarser) — creates some very big cloud masses.
  // Drifts at half wind speed for natural differential parallax with smaller clouds.
  let pw_large = sample_pw((p + wind * 0.5) * 0.012);
  // Medium-scale pass — smaller individual clouds.
  let pw_med = sample_pw((p + wind) * 0.04);
  // Blend: large scale dominates shape; medium adds smaller clouds in sparser areas.
  let pw = pw_large * 0.6 + pw_med * 0.4;
  let hg = height_gradient(p.y);
  let cov = saturate(remap(pw, 1.0 - cloud.coverage, 1.0, 0.0, 1.0)) * hg;
  if (cov < 0.001) { return 0.0; }
  let detail_uv = p * 0.12 + wind * 0.1;
  let det = textureSampleLevel(detail_noise, noise_samp, detail_uv, 0.0);
  let detail = det.r * 0.5 + det.g * 0.25 + det.b * 0.125;
  return max(0.0, cov - (1.0 - cov) * detail * 0.3) * cloud.density;
}

fn sample_density_coarse(p: vec3<f32>) -> f32 {
  let wind     = vec3<f32>(cloud.windOffset.x, 0.0, cloud.windOffset.y);
  let pw_large = sample_pw((p + wind * 0.5) * 0.012);
  let pw_med   = sample_pw((p + wind) * 0.04);
  let pw       = pw_large * 0.6 + pw_med * 0.4;
  let hg       = height_gradient(p.y);
  return saturate(remap(pw, 1.0 - cloud.coverage, 1.0, 0.0, 1.0)) * hg * cloud.density;
}

fn light_march(p: vec3<f32>, sun_dir: vec3<f32>) -> f32 {
  let step_size = (cloud.cloudTop - cloud.cloudBase) / 2.0;
  var opt_depth = 0.0;
  for (var i = 0; i < 2; i++) {
    let sp = p + sun_dir * (f32(i) + 0.5) * step_size;
    if (sp.y < cloud.cloudBase || sp.y > cloud.cloudTop) { continue; }
    opt_depth += sample_density_coarse(sp) * step_size;
  }
  return exp(-opt_depth * cloud.extinction);
}

fn ray_slab(ro: vec3<f32>, rd: vec3<f32>, y_min: f32, y_max: f32) -> vec2<f32> {
  if (abs(rd.y) < 1e-6) {
    if (ro.y < y_min || ro.y > y_max) {
      return vec2<f32>(-1.0, -1.0);
    }
    return vec2<f32>(0.0, 1e9);
  }
  let t0 = (y_min - ro.y) / rd.y;
  let t1 = (y_max - ro.y) / rd.y;
  let t_near = min(t0, t1);
  let t_far  = max(t0, t1);
  if (t_far < 0.0) {
    return vec2<f32>(-1.0, -1.0);
  }
  return vec2<f32>(max(t_near, 0.0), t_far);
}

// ---- Fragment shader ---------------------------------------------------------

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let ndc     = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, 1.0, 1.0);
  let world_h = camera.invViewProj * ndc;
  let ray_dir = normalize(world_h.xyz / world_h.w - camera.position);

  let sun_dir = normalize(-light.direction);
  let camH    = max(camera.position.y, 1.0);
  let atm_ro  = vec3<f32>(0.0, R_E + camH, 0.0);
  let sky_color = scatter_sky(atm_ro, ray_dir, sun_dir);

  // Clip ray at scene geometry
  let geo_depth = textureLoad(depth_tex, vec2<i32>(in.clip_pos.xy), 0);
  var geo_dist  = 1e9;
  if (geo_depth < 1.0) {
    let ndc_geo = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, geo_depth, 1.0);
    let geo_h   = camera.invViewProj * ndc_geo;
    let geo_pos = geo_h.xyz / geo_h.w;
    geo_dist    = distance(geo_pos, camera.position);
  }

  let moon_dir  = -sun_dir;
  let night_t   = saturate((-sun_dir.y - 0.05) * 10.0);

  // Intersect ray with cloud slab
  let slab = ray_slab(camera.position, ray_dir, cloud.cloudBase, cloud.cloudTop);
  if (slab.x < 0.0 || slab.x > geo_dist) {
    var color = sky_color;
    if (dot(ray_dir, sun_dir) > SUN_COS_THRESH && geo_depth >= 1.0) {
      color += sky_transmittance(atm_ro, sun_dir) * 1000.0;
    }
    if (dot(ray_dir, moon_dir) > MOON_COS_THRESH && geo_depth >= 1.0) {
      color += sky_transmittance(atm_ro, moon_dir) * vec3<f32>(0.85, 0.90, 1.0) * 15.0 * night_t;
    }
    return vec4<f32>(color, 1.0);
  }

  let t_end  = min(min(slab.y, geo_dist), 200.0);
  if (t_end <= slab.x) {
    return vec4<f32>(sky_color, 1.0);
  }

  // Primary ray march (24 steps, IGN jitter for TAA)
  let step_size = (t_end - slab.x) / 24.0;
  let coord     = vec2<i32>(in.clip_pos.xy);
  let jitter    = fract(52.9829189 * fract(0.06711056 * f32(coord.x) + 0.00583715 * f32(coord.y)));
  let t_start   = slab.x + jitter * step_size;
  let cos_theta = dot(ray_dir, sun_dir);
  let phase     = dual_phase(cos_theta, cloud.anisotropy);

  var cloud_color = vec3<f32>(0.0);
  var total_trans = 1.0;

  for (var i = 0; i < 24; i++) {
    let t = t_start + f32(i) * step_size;
    if (t >= t_end) { break; }
    let p = camera.position + ray_dir * t;

    let dens = sample_density(p);
    if (dens < 0.001) { continue; }

    let shadow_t    = light_march(p, sun_dir);
    let height_frac = clamp((p.y - cloud.cloudBase) / max(cloud.cloudTop - cloud.cloudBase, 0.001), 0.0, 1.0);

    let sun_energy = light.color * light.intensity * shadow_t * phase;
    let amb_energy = cloud.ambientColor * mix(0.5, 1.0, height_frac);

    let opt    = dens * cloud.extinction * step_size;
    let t_step = exp(-opt);

    cloud_color += (sun_energy + amb_energy) * (1.0 - t_step) * total_trans;
    total_trans *= t_step;

    if (total_trans < 0.01) { break; }
  }

  var final_color = cloud_color + sky_color * total_trans;
  if (dot(ray_dir, sun_dir) > SUN_COS_THRESH && geo_depth >= 1.0) {
    final_color += sky_transmittance(atm_ro, sun_dir) * total_trans * 1000.0;
  }
  if (dot(ray_dir, moon_dir) > MOON_COS_THRESH && geo_depth >= 1.0) {
    final_color += sky_transmittance(atm_ro, moon_dir) * total_trans * vec3<f32>(0.85, 0.90, 1.0) * 15.0 * night_t;
  }
  return vec4<f32>(final_color, 1.0);
}
`,Xn=96,$n=48,Kn=32;class rn extends he{constructor(e,t,r,i,o,a,s,c,u){super();l(this,"name","CloudPass");l(this,"_pipeline");l(this,"_hdrView");l(this,"_cameraBuffer");l(this,"_cloudBuffer");l(this,"_lightBuffer");l(this,"_sceneBG");l(this,"_lightBG");l(this,"_depthBG");l(this,"_noiseSkyBG");this._pipeline=e,this._hdrView=t,this._cameraBuffer=r,this._cloudBuffer=i,this._lightBuffer=o,this._sceneBG=a,this._lightBG=s,this._depthBG=c,this._noiseSkyBG=u}static create(e,t,r,i){const{device:o}=e,a=o.createBuffer({label:"CloudCameraBuffer",size:Xn,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),s=o.createBuffer({label:"CloudUniformBuffer",size:$n,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),c=o.createBuffer({label:"CloudLightBuffer",size:Kn,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),u=o.createBindGroupLayout({label:"CloudSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),p=o.createBindGroupLayout({label:"CloudLightBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),f=o.createBindGroupLayout({label:"CloudDepthBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),h=o.createBindGroupLayout({label:"CloudNoiseSkyBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),m=o.createSampler({label:"CloudNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"repeat",addressModeV:"repeat",addressModeW:"repeat"}),_=o.createSampler({label:"CloudDepthSampler"}),w=o.createBindGroup({label:"CloudSceneBG",layout:u,entries:[{binding:0,resource:{buffer:a}},{binding:1,resource:{buffer:s}}]}),v=o.createBindGroup({label:"CloudLightBG",layout:p,entries:[{binding:0,resource:{buffer:c}}]}),x=o.createBindGroup({label:"CloudDepthBG",layout:f,entries:[{binding:0,resource:r},{binding:1,resource:_}]}),B=o.createBindGroup({label:"CloudNoiseSkyBG",layout:h,entries:[{binding:0,resource:i.baseView},{binding:1,resource:i.detailView},{binding:2,resource:m}]}),G=o.createShaderModule({label:"CloudShader",code:Pi}),S=o.createRenderPipeline({label:"CloudPipeline",layout:o.createPipelineLayout({bindGroupLayouts:[u,p,f,h]}),vertex:{module:G,entryPoint:"vs_main"},fragment:{module:G,entryPoint:"fs_main",targets:[{format:Q}]},primitive:{topology:"triangle-list"}});return new rn(S,t,a,s,c,w,v,x,B)}updateCamera(e,t,r,i,o){const a=new Float32Array(Xn/4);a.set(t.data,0),a[16]=r.x,a[17]=r.y,a[18]=r.z,a[19]=i,a[20]=o,e.queue.writeBuffer(this._cameraBuffer,0,a.buffer)}updateLight(e,t,r,i){const o=new Float32Array(Kn/4);o[0]=t.x,o[1]=t.y,o[2]=t.z,o[3]=i,o[4]=r.x,o[5]=r.y,o[6]=r.z,e.queue.writeBuffer(this._lightBuffer,0,o.buffer)}updateSettings(e,t){const r=new Float32Array($n/4);r[0]=t.cloudBase,r[1]=t.cloudTop,r[2]=t.coverage,r[3]=t.density,r[4]=t.windOffset[0],r[5]=t.windOffset[1],r[6]=t.anisotropy,r[7]=t.extinction,r[8]=t.ambientColor[0],r[9]=t.ambientColor[1],r[10]=t.ambientColor[2],r[11]=t.exposure,e.queue.writeBuffer(this._cloudBuffer,0,r.buffer)}execute(e,t){const r=e.beginRenderPass({label:"CloudPass",colorAttachments:[{view:this._hdrView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._pipeline),r.setBindGroup(0,this._sceneBG),r.setBindGroup(1,this._lightBG),r.setBindGroup(2,this._depthBG),r.setBindGroup(3,this._noiseSkyBG),r.draw(3),r.end()}destroy(){this._cameraBuffer.destroy(),this._cloudBuffer.destroy(),this._lightBuffer.destroy()}}const Gi=`// Cloud shadow pass — renders a top-down cloud transmittance map (1024×1024 r8unorm).
// For each texel, marches 32 steps vertically through the cloud slab and accumulates
// optical depth, then outputs Beer's-law transmittance.

const PI: f32 = 3.14159265358979323846;

struct CloudShadowUniforms {
  cloudBase    : f32,
  cloudTop     : f32,
  coverage     : f32,
  density      : f32,
  windOffset   : vec2<f32>,   // XZ animated offset
  worldOriginX : f32,         // world-space XZ centre of the shadow map
  worldOriginZ : f32,
  worldExtent  : f32,         // half-size in world units (map covers ±worldExtent)
  extinction   : f32,
  _pad0        : f32,
  _pad1        : f32,
}

@group(0) @binding(0) var<uniform> params     : CloudShadowUniforms;
@group(1) @binding(0) var          base_noise  : texture_3d<f32>;
@group(1) @binding(1) var          detail_noise: texture_3d<f32>;
@group(1) @binding(2) var          noise_samp  : sampler;

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

fn remap(v: f32, lo: f32, hi: f32, a: f32, b: f32) -> f32 {
  return clamp(a + (v - lo) / max(hi - lo, 0.0001) * (b - a), a, b);
}

fn height_gradient(y: f32) -> f32 {
  let t = clamp((y - params.cloudBase) / max(params.cloudTop - params.cloudBase, 0.001), 0.0, 1.0);
  let base = remap(t, 0.0, 0.07, 0.0, 1.0);
  let top  = remap(t, 0.2, 1.0,  1.0, 0.0);
  return saturate(base * top);
}

fn sample_density(world_pos: vec3<f32>) -> f32 {
  let scale = 0.04;
  let base_uv = (world_pos + vec3<f32>(params.windOffset.x, 0.0, params.windOffset.y)) * scale;
  let base = textureSampleLevel(base_noise, noise_samp, base_uv, 0.0);

  // Perlin-Worley blend
  let pw = base.r * 0.625 + (1.0 - base.g) * 0.25 + (1.0 - base.b) * 0.125;
  let hg = height_gradient(world_pos.y);
  let cov = saturate(remap(pw, 1.0 - params.coverage, 1.0, 0.0, 1.0)) * hg;
  if (cov < 0.001) { return 0.0; }

  let detail_scale = 0.12;
  let detail_uv = world_pos * detail_scale + vec3<f32>(params.windOffset.x, 0.0, params.windOffset.y) * 0.1;
  let det = textureSampleLevel(detail_noise, noise_samp, detail_uv, 0.0);
  let detail = det.r * 0.5 + det.g * 0.25 + det.b * 0.125;

  return max(0.0, cov - (1.0 - cov) * detail * 0.3) * params.density;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  // Map UV to world XZ position
  let world_x = params.worldOriginX + (in.uv.x - 0.5) * params.worldExtent * 2.0;
  let world_z = params.worldOriginZ + (in.uv.y - 0.5) * params.worldExtent * 2.0;

  let slab_h = params.cloudTop - params.cloudBase;
  let step_h = slab_h / 16.0;

  var opt_depth = 0.0;
  for (var i = 0; i < 16; i++) {
    let y = params.cloudBase + (f32(i) + 0.5) * step_h;
    opt_depth += sample_density(vec3<f32>(world_x, y, world_z)) * step_h;
  }

  let transmittance = exp(-opt_depth * params.extinction);
  return vec4<f32>(transmittance, 0.0, 0.0, 1.0);
}
`,Zn=1024,Qn="r8unorm",Jn=48;class on extends he{constructor(e,t,r,i,o,a){super();l(this,"name","CloudShadowPass");l(this,"shadowTexture");l(this,"shadowView");l(this,"_pipeline");l(this,"_uniformBuffer");l(this,"_uniformBG");l(this,"_noiseBG");l(this,"_frameCount",0);this.shadowTexture=e,this.shadowView=t,this._pipeline=r,this._uniformBuffer=i,this._uniformBG=o,this._noiseBG=a}static create(e,t){const{device:r}=e,i=r.createTexture({label:"CloudShadowTexture",size:{width:Zn,height:Zn},format:Qn,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),o=i.createView(),a=r.createBuffer({label:"CloudShadowUniform",size:Jn,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),s=r.createBindGroupLayout({label:"CloudShadowUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),c=r.createSampler({label:"CloudNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"repeat",addressModeV:"repeat",addressModeW:"repeat"}),u=r.createBindGroupLayout({label:"CloudShadowNoiseBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),p=r.createBindGroup({label:"CloudShadowUniformBG",layout:s,entries:[{binding:0,resource:{buffer:a}}]}),f=r.createBindGroup({label:"CloudShadowNoiseBG",layout:u,entries:[{binding:0,resource:t.baseView},{binding:1,resource:t.detailView},{binding:2,resource:c}]}),h=r.createShaderModule({label:"CloudShadowShader",code:Gi}),m=r.createRenderPipeline({label:"CloudShadowPipeline",layout:r.createPipelineLayout({bindGroupLayouts:[s,u]}),vertex:{module:h,entryPoint:"vs_main"},fragment:{module:h,entryPoint:"fs_main",targets:[{format:Qn}]},primitive:{topology:"triangle-list"}});return new on(i,o,m,a,p,f)}update(e,t,r,i){const o=new Float32Array(Jn/4);o[0]=t.cloudBase,o[1]=t.cloudTop,o[2]=t.coverage,o[3]=t.density,o[4]=t.windOffset[0],o[5]=t.windOffset[1],o[6]=r[0],o[7]=r[1],o[8]=i,o[9]=t.extinction,e.queue.writeBuffer(this._uniformBuffer,0,o.buffer)}execute(e,t){if(this._frameCount++%2!==0)return;const r=e.beginRenderPass({label:"CloudShadowPass",colorAttachments:[{view:this.shadowView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._pipeline),r.setBindGroup(0,this._uniformBG),r.setBindGroup(1,this._noiseBG),r.draw(3),r.end()}destroy(){this.shadowTexture.destroy(),this._uniformBuffer.destroy()}}const Ti=`// TAA resolve pass — fullscreen triangle, blends current HDR with reprojected history.

struct TAAUniforms {
  invViewProj : mat4x4<f32>, // current frame, un-jittered
  prevViewProj: mat4x4<f32>, // previous frame, un-jittered
}

@group(0) @binding(0) var<uniform> taa : TAAUniforms;

@group(1) @binding(0) var current_hdr   : texture_2d<f32>;
@group(1) @binding(1) var history_tex   : texture_2d<f32>;
@group(1) @binding(2) var depth_tex     : texture_depth_2d;
@group(1) @binding(3) var linear_sampler: sampler;

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
  @location(0)       uv     : vec2<f32>,
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

fn reconstruct_world_pos(uv: vec2<f32>, depth: f32) -> vec4<f32> {
  let ndc = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);
  return taa.invViewProj * ndc;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let coord = vec2<i32>(in.clip_pos.xy);

  let current = textureLoad(current_hdr, coord, 0).rgb;

  // Background: no history to blend
  let depth = textureLoad(depth_tex, coord, 0);
  if (depth >= 1.0) {
    return vec4<f32>(current, 1.0);
  }

  // 3x3 neighborhood AABB for history clamping
  var c_min = current;
  var c_max = current;
  for (var dy = -1; dy <= 1; dy++) {
    for (var dx = -1; dx <= 1; dx++) {
      if (dx == 0 && dy == 0) { continue; }
      let s = textureLoad(current_hdr, coord + vec2<i32>(dx, dy), 0).rgb;
      c_min = min(c_min, s);
      c_max = max(c_max, s);
    }
  }

  // Reconstruct world position and reproject into previous frame
  let world_h   = reconstruct_world_pos(in.uv, depth);
  let world_pos = world_h.xyz / world_h.w;

  let prev_clip = taa.prevViewProj * vec4<f32>(world_pos, 1.0);
  let prev_ndc  = prev_clip.xyz / prev_clip.w;
  let prev_uv   = vec2<f32>(prev_ndc.x * 0.5 + 0.5, -prev_ndc.y * 0.5 + 0.5);

  // Outside previous frustum → accept current frame fully
  let in_bounds = prev_uv.x >= 0.0 && prev_uv.x <= 1.0
               && prev_uv.y >= 0.0 && prev_uv.y <= 1.0;
  if (!in_bounds) {
    return vec4<f32>(current, 1.0);
  }

  var history = textureSampleLevel(history_tex, linear_sampler, prev_uv, 0.0).rgb;
  // Clamp history to current neighborhood to suppress ghosting
  history = clamp(history, c_min, c_max);

  // 10% current frame, 90% history
  return vec4<f32>(mix(history, current, 0.1), 1.0);
}
`,er=128;class an extends he{constructor(e,t,r,i,o,a,s,c,u,p){super();l(this,"name","TAAPass");l(this,"_resolved");l(this,"resolvedView");l(this,"_history");l(this,"_historyView");l(this,"_pipeline");l(this,"_uniformBuffer");l(this,"_uniformBG");l(this,"_textureBG");l(this,"_width");l(this,"_height");this._resolved=e,this.resolvedView=t,this._history=r,this._historyView=i,this._pipeline=o,this._uniformBuffer=a,this._uniformBG=s,this._textureBG=c,this._width=u,this._height=p}get historyView(){return this._historyView}static create(e,t,r){const{device:i,width:o,height:a}=e,s=i.createTexture({label:"TAA Resolved",size:{width:o,height:a},format:Q,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),c=i.createTexture({label:"TAA History",size:{width:o,height:a},format:Q,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),u=s.createView(),p=c.createView(),f=i.createBuffer({label:"TAAUniformBuffer",size:er,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),h=i.createBindGroupLayout({label:"TAAUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),m=i.createBindGroupLayout({label:"TAATextureBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),_=i.createSampler({label:"TAALinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),w=i.createBindGroup({layout:h,entries:[{binding:0,resource:{buffer:f}}]}),v=i.createBindGroup({layout:m,entries:[{binding:0,resource:t.hdrView},{binding:1,resource:p},{binding:2,resource:r.depthView},{binding:3,resource:_}]}),x=i.createShaderModule({label:"TAAShader",code:Ti}),B=i.createRenderPipeline({label:"TAAPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[h,m]}),vertex:{module:x,entryPoint:"vs_main"},fragment:{module:x,entryPoint:"fs_main",targets:[{format:Q}]},primitive:{topology:"triangle-list"}});return new an(s,u,c,p,B,f,w,v,o,a)}updateCamera(e,t,r){const i=new Float32Array(er/4);i.set(t.data,0),i.set(r.data,16),e.queue.writeBuffer(this._uniformBuffer,0,i.buffer)}execute(e,t){const r=e.beginRenderPass({label:"TAAPass",colorAttachments:[{view:this.resolvedView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._pipeline),r.setBindGroup(0,this._uniformBG),r.setBindGroup(1,this._textureBG),r.draw(3),r.end(),e.copyTextureToTexture({texture:this._resolved},{texture:this._history},{width:this._width,height:this._height})}destroy(){this._resolved.destroy(),this._history.destroy(),this._uniformBuffer.destroy()}}const Ai=`// Bloom: prefilter (downsample + threshold) and separable Gaussian blur.
// The composite step is in bloom_composite.wgsl.

struct BloomUniforms {
  threshold: f32,
  knee     : f32,
  strength : f32,
  _pad     : f32,
}

@group(0) @binding(0) var<uniform> bloom   : BloomUniforms;
@group(0) @binding(1) var          src_tex : texture_2d<f32>;
@group(0) @binding(2) var          src_samp: sampler;

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
  @location(0)       uv     : vec2<f32>,
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

// Prefilter: 2× downsample + soft-knee threshold.
// UV is mapped to the half-res output; src_tex is the full-res HDR.
@fragment
fn fs_prefilter(in: VertexOutput) -> @location(0) vec4<f32> {
  let texel = 1.0 / vec2<f32>(textureDimensions(src_tex));
  let c = (
    textureSample(src_tex, src_samp, in.uv + vec2(-0.5, -0.5) * texel) +
    textureSample(src_tex, src_samp, in.uv + vec2( 0.5, -0.5) * texel) +
    textureSample(src_tex, src_samp, in.uv + vec2(-0.5,  0.5) * texel) +
    textureSample(src_tex, src_samp, in.uv + vec2( 0.5,  0.5) * texel)
  ).rgb * 0.25;

  // Soft knee: smooth ramp from (threshold - knee) to (threshold + knee)
  let brightness = max(c.r, max(c.g, c.b));
  let rq         = clamp(brightness - bloom.threshold + bloom.knee, 0.0, 2.0 * bloom.knee);
  let weight     = max(bloom.knee * rq * rq, brightness - bloom.threshold)
                 / max(brightness, 0.0001);
  return vec4<f32>(c * weight, 1.0);
}

// 9-tap separable Gaussian, sigma ≈ 2.  Weights are normalised to sum 1.
const W0: f32 = 0.20416;
const W1: f32 = 0.18009;
const W2: f32 = 0.12388;
const W3: f32 = 0.06626;
const W4: f32 = 0.02763;

@fragment
fn fs_blur_h(in: VertexOutput) -> @location(0) vec4<f32> {
  let tx = 1.0 / f32(textureDimensions(src_tex).x);
  var c  = textureSample(src_tex, src_samp, in.uv).rgb * W0;
  c += textureSample(src_tex, src_samp, in.uv + vec2( tx, 0.0)).rgb * W1;
  c += textureSample(src_tex, src_samp, in.uv + vec2(-tx, 0.0)).rgb * W1;
  c += textureSample(src_tex, src_samp, in.uv + vec2( 2.0*tx, 0.0)).rgb * W2;
  c += textureSample(src_tex, src_samp, in.uv + vec2(-2.0*tx, 0.0)).rgb * W2;
  c += textureSample(src_tex, src_samp, in.uv + vec2( 3.0*tx, 0.0)).rgb * W3;
  c += textureSample(src_tex, src_samp, in.uv + vec2(-3.0*tx, 0.0)).rgb * W3;
  c += textureSample(src_tex, src_samp, in.uv + vec2( 4.0*tx, 0.0)).rgb * W4;
  c += textureSample(src_tex, src_samp, in.uv + vec2(-4.0*tx, 0.0)).rgb * W4;
  return vec4<f32>(c, 1.0);
}

@fragment
fn fs_blur_v(in: VertexOutput) -> @location(0) vec4<f32> {
  let ty = 1.0 / f32(textureDimensions(src_tex).y);
  var c  = textureSample(src_tex, src_samp, in.uv).rgb * W0;
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0,  ty)).rgb * W1;
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0, -ty)).rgb * W1;
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0,  2.0*ty)).rgb * W2;
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0, -2.0*ty)).rgb * W2;
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0,  3.0*ty)).rgb * W3;
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0, -3.0*ty)).rgb * W3;
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0,  4.0*ty)).rgb * W4;
  c += textureSample(src_tex, src_samp, in.uv + vec2(0.0, -4.0*ty)).rgb * W4;
  return vec4<f32>(c, 1.0);
}
`,Mi=`// Bloom composite: adds the blurred bright regions back to the source HDR.

struct BloomUniforms {
  threshold: f32,
  knee     : f32,
  strength : f32,
  _pad     : f32,
}

@group(0) @binding(0) var<uniform> params   : BloomUniforms;
@group(0) @binding(1) var          hdr_tex  : texture_2d<f32>;
@group(0) @binding(2) var          bloom_tex: texture_2d<f32>;
@group(0) @binding(3) var          samp     : sampler;

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
  @location(0)       uv     : vec2<f32>,
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

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let hdr   = textureSample(hdr_tex,   samp, in.uv).rgb;
  // bloom_tex is half-res; bilinear upsample happens automatically
  let glow  = textureSample(bloom_tex, samp, in.uv).rgb;
  return vec4<f32>(hdr + glow * params.strength, 1.0);
}
`,Ei=16;class sn extends he{constructor(e,t,r,i,o,a,s,c,u,p,f,h,m,_,w){super();l(this,"name","BloomPass");l(this,"resultView");l(this,"_result");l(this,"_half1");l(this,"_half2");l(this,"_half1View");l(this,"_half2View");l(this,"_prefilterPipeline");l(this,"_blurHPipeline");l(this,"_blurVPipeline");l(this,"_compositePipeline");l(this,"_uniformBuffer");l(this,"_prefilterBG");l(this,"_blurHBG");l(this,"_blurVBG");l(this,"_compositeBG");this._result=e,this.resultView=t,this._half1=r,this._half1View=i,this._half2=o,this._half2View=a,this._prefilterPipeline=s,this._blurHPipeline=c,this._blurVPipeline=u,this._compositePipeline=p,this._uniformBuffer=f,this._prefilterBG=h,this._blurHBG=m,this._blurVBG=_,this._compositeBG=w}static create(e,t){const{device:r,width:i,height:o}=e,a=Math.max(1,i>>1),s=Math.max(1,o>>1),c=r.createTexture({label:"BloomHalf1",size:{width:a,height:s},format:Q,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),u=r.createTexture({label:"BloomHalf2",size:{width:a,height:s},format:Q,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),p=r.createTexture({label:"BloomResult",size:{width:i,height:o},format:Q,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),f=c.createView(),h=u.createView(),m=p.createView(),_=r.createBuffer({label:"BloomUniforms",size:Ei,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(_,0,new Float32Array([1,.5,.3,0]).buffer);const w=r.createSampler({label:"BloomSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),v=r.createBindGroupLayout({label:"BloomSingleBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),x=r.createBindGroupLayout({label:"BloomCompositeBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),B=r.createShaderModule({label:"BloomShader",code:Ai}),G=r.createShaderModule({label:"BloomComposite",code:Mi}),S=r.createPipelineLayout({bindGroupLayouts:[v]}),E=r.createPipelineLayout({bindGroupLayouts:[x]});function M(N,V){return r.createRenderPipeline({label:V,layout:S,vertex:{module:B,entryPoint:"vs_main"},fragment:{module:B,entryPoint:N,targets:[{format:Q}]},primitive:{topology:"triangle-list"}})}const A=M("fs_prefilter","BloomPrefilterPipeline"),R=M("fs_blur_h","BloomBlurHPipeline"),P=M("fs_blur_v","BloomBlurVPipeline"),b=r.createRenderPipeline({label:"BloomCompositePipeline",layout:E,vertex:{module:G,entryPoint:"vs_main"},fragment:{module:G,entryPoint:"fs_main",targets:[{format:Q}]},primitive:{topology:"triangle-list"}});function C(N){return r.createBindGroup({layout:v,entries:[{binding:0,resource:{buffer:_}},{binding:1,resource:N},{binding:2,resource:w}]})}const g=C(t),T=C(f),y=C(h),U=r.createBindGroup({layout:x,entries:[{binding:0,resource:{buffer:_}},{binding:1,resource:t},{binding:2,resource:f},{binding:3,resource:w}]});return new sn(p,m,c,f,u,h,A,R,P,b,_,g,T,y,U)}updateParams(e,t=1,r=.5,i=.3){e.queue.writeBuffer(this._uniformBuffer,0,new Float32Array([t,r,i,0]).buffer)}execute(e,t){const r=(i,o,a,s)=>{const c=e.beginRenderPass({label:i,colorAttachments:[{view:o,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});c.setPipeline(a),c.setBindGroup(0,s),c.draw(3),c.end()};r("BloomPrefilter",this._half1View,this._prefilterPipeline,this._prefilterBG);for(let i=0;i<2;i++)r("BloomBlurH",this._half2View,this._blurHPipeline,this._blurHBG),r("BloomBlurV",this._half1View,this._blurVPipeline,this._blurVBG);r("BloomComposite",this.resultView,this._compositePipeline,this._compositeBG)}destroy(){this._result.destroy(),this._half1.destroy(),this._half2.destroy(),this._uniformBuffer.destroy()}}const Ui=`// godray_march.wgsl — Half-resolution ray-march pass for volumetric godrays.
//
// Fires rays from the camera toward each pixel's world position, sampling the
// directional-light shadow map at each step to accumulate in-scattered light.
// Outputs a single fog value [0,1] in the R channel of a half-res rgba16float
// texture, dithered to hide banding at low step counts.

const PI: f32 = 3.14159265358979;

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
  @location(0)       uv      : vec2<f32>,
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
  cloudShadowOrigin : vec2<f32>,
  cloudShadowExtent : f32,
  shadowSoftness    : f32,
  _pad_light        : vec2<f32>,
  cascadeDepthRanges: vec4<f32>,
}

struct MarchParams {
  scattering: f32,  // Henyey-Greenstein g parameter
  max_steps : f32,  // stored as float, cast to u32 in the loop
  _pad0     : f32,
  _pad1     : f32,
}

@group(0) @binding(0) var<uniform> camera      : CameraUniforms;
@group(0) @binding(1) var<uniform> light        : LightUniforms;
@group(0) @binding(2) var          depth_tex    : texture_depth_2d;
@group(0) @binding(3) var          shadow_map   : texture_depth_2d_array;
@group(0) @binding(4) var          shadow_samp  : sampler_comparison;
@group(0) @binding(5) var<uniform> march_params : MarchParams;

@vertex
fn vs_main(@builtin(vertex_index) vid: u32) -> VertexOutput {
  let x = f32((vid & 1u) << 2u) - 1.0;
  let y = f32((vid & 2u) << 1u) - 1.0;
  var out: VertexOutput;
  out.clip_pos = vec4<f32>(x, y, 0.0, 1.0);
  out.uv       = vec2<f32>(x * 0.5 + 0.5, -y * 0.5 + 0.5);
  return out;
}

// Henyey-Greenstein phase function — directional forward/back scattering.
fn henyey_greenstein(cos_theta: f32, g: f32) -> f32 {
  let k = 0.0795774715459; // 1 / (4π)
  return k * (1.0 - g * g) / pow(max(1.0 + g * g - 2.0 * g * cos_theta, 1e-4), 1.5);
}

fn reconstruct_world_pos(uv: vec2<f32>, depth: f32) -> vec3<f32> {
  let ndc     = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);
  let world_h = camera.invViewProj * ndc;
  return world_h.xyz / world_h.w;
}

fn select_cascade(view_depth: f32) -> u32 {
  for (var i = 0u; i < light.cascadeCount; i++) {
    if (view_depth < light.cascadeSplits[i]) { return i; }
  }
  return light.cascadeCount - 1u;
}

fn shadow_at(world_pos: vec3<f32>) -> f32 {
  if (light.shadowsEnabled == 0u) { return 1.0; }
  let view_pos   = camera.view * vec4<f32>(world_pos, 1.0);
  let view_depth = -view_pos.z;
  let cascade    = select_cascade(view_depth);

  let ls  = light.cascadeMatrices[cascade] * vec4<f32>(world_pos, 1.0);
  var sc  = ls.xyz / ls.w;
  sc      = vec3<f32>(sc.xy * 0.5 + 0.5, sc.z);
  sc.y    = 1.0 - sc.y;
  if (any(sc.xy < vec2<f32>(0.0)) || any(sc.xy > vec2<f32>(1.0)) || sc.z > 1.0) {
    return 1.0;
  }
  return textureSampleCompareLevel(shadow_map, shadow_samp, sc.xy, i32(cascade), sc.z - 0.005);
}

// Interleaved gradient noise for dithering the ray start offset.
fn dither(uv: vec2<f32>) -> f32 {
  return fract(sin(dot(uv, vec2<f32>(41.0, 289.0))) * 45758.5453);
}

@fragment
fn fs_march(in: VertexOutput) -> @location(0) vec4<f32> {
  // textureLoad avoids the depth+filtering-sampler restriction; depth textures
  // may only be sampled via comparison or textureLoad, not a regular sampler.
  let depth_size = vec2<i32>(textureDimensions(depth_tex));
  let coord      = clamp(vec2<i32>(in.uv * vec2<f32>(depth_size)),
                         vec2<i32>(0), depth_size - vec2<i32>(1));
  let depth = textureLoad(depth_tex, coord, 0u);
  if (depth >= 1.0) { return vec4<f32>(0.0); } // sky pixel — skip

  let world_pos = reconstruct_world_pos(in.uv, depth);
  let ray_vec   = world_pos - camera.position;
  let ray_len   = length(ray_vec);
  let ray_dir   = ray_vec / max(ray_len, 0.001);

  let steps     = u32(march_params.max_steps);
  let step_len  = ray_len / f32(steps);
  let dith      = dither(in.uv) * step_len; // jitter to avoid banding
  var pos       = camera.position + ray_dir * dith;

  let sun_dir   = normalize(-light.direction);
  let cos_theta = dot(ray_dir, sun_dir);
  let phase     = henyey_greenstein(cos_theta, march_params.scattering);

  var accum = 0.0;
  for (var i = 0u; i < steps; i++) {
    accum += phase * shadow_at(pos);
    pos   += ray_dir * step_len;
  }

  let fog = clamp(accum / f32(steps), 0.0, 1.0);
  return vec4<f32>(fog, 0.0, 0.0, 1.0);
}
`,Ci=`// godray_composite.wgsl — Blur and composite passes for volumetric godrays.
//
// fs_blur: bilateral depth-aware Gaussian blur of the half-res fog texture
//          (run twice — horizontal then vertical — using the blur_dir uniform).
//
// fs_composite: depth-aware upsampling from half-res fog to full-res, followed
//               by an additive blend of (fog × sun color × sun intensity) onto
//               the HDR render target.  Uses pipeline blend state (one+one) so
//               the fragment only needs to output the additive contribution.
//
// Bindings 0-3 are used by both entry points; binding 4 (light) is composite-only.
// With layout:'auto' each pipeline derives its own BGL from the entry point's
// static usage, so blur and composite bind groups can be created independently.

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
  @location(0)       uv      : vec2<f32>,
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
  cloudShadowOrigin : vec2<f32>,
  cloudShadowExtent : f32,
  shadowSoftness    : f32,
  _pad_light        : vec2<f32>,
  cascadeDepthRanges: vec4<f32>,
}

// Shared by blur and composite — blur uses blur_dir, composite uses fog_curve.
struct Params {
  blur_dir  : vec2<f32>,  // (1,0) for horizontal, (0,1) for vertical; ignored by composite
  fog_curve : f32,        // power applied to fog before compositing; ignored by blur
  _pad      : f32,
}

@group(0) @binding(0) var          fog_tex  : texture_2d<f32>;
@group(0) @binding(1) var          depth_tex: texture_depth_2d;
@group(0) @binding(2) var          samp     : sampler;
@group(0) @binding(3) var<uniform> params   : Params;
@group(0) @binding(4) var<uniform> light    : LightUniforms; // composite only

fn depth_load(uv: vec2<f32>) -> f32 {
  let size  = vec2<i32>(textureDimensions(depth_tex));
  let coord = clamp(vec2<i32>(uv * vec2<f32>(size)), vec2<i32>(0), size - vec2<i32>(1));
  return textureLoad(depth_tex, coord, 0u);
}

// Gaussian half-kernel (centre..edge, index = abs(tap offset)).
// Sum of symmetric 7-tap (±3) with these weights ≈ 1.
const GAUSS: array<f32, 4> = array<f32, 4>(
  0.19638062, 0.17469900, 0.12161760, 0.06706740,
);

@vertex
fn vs_main(@builtin(vertex_index) vid: u32) -> VertexOutput {
  let x = f32((vid & 1u) << 2u) - 1.0;
  let y = f32((vid & 2u) << 1u) - 1.0;
  var out: VertexOutput;
  out.clip_pos = vec4<f32>(x, y, 0.0, 1.0);
  out.uv       = vec2<f32>(x * 0.5 + 0.5, -y * 0.5 + 0.5);
  return out;
}

// ---- Blur pass ---------------------------------------------------------------

@fragment
fn fs_blur(in: VertexOutput) -> @location(0) vec4<f32> {
  // Step size in UV space: one fog texel in the blur direction.
  let texel  = 1.0 / vec2<f32>(textureDimensions(fog_tex));
  let step   = params.blur_dir * texel;
  let depth0 = depth_load(in.uv);

  var accum  = 0.0;
  var weight = 0.0;
  for (var i: i32 = -3; i <= 3; i++) {
    let uv_off  = in.uv + step * f32(i);
    let depth_s = depth_load(uv_off);
    let fog_s   = textureSampleLevel(fog_tex,   samp, uv_off, 0.0).r;
    // Depth-aware bilateral weight: suppress blur across depth discontinuities.
    let d_wt  = exp(-abs(depth_s - depth0) * 1000.0);
    let w     = GAUSS[abs(i)] * d_wt;
    accum  += w * fog_s;
    weight += w;
  }
  return vec4<f32>(accum / max(weight, 1e-5), 0.0, 0.0, 1.0);
}

// ---- Composite pass ----------------------------------------------------------

@fragment
fn fs_composite(in: VertexOutput) -> @location(0) vec4<f32> {
  let depth0 = depth_load(in.uv);
  if (depth0 >= 1.0) { return vec4<f32>(0.0); } // sky — no godray contribution

  // Depth-aware upsampling: among the four half-res neighbours, pick the one
  // whose depth is closest to this full-res pixel to avoid bleeding across edges.
  let fog_texel = 1.0 / vec2<f32>(textureDimensions(fog_tex));

  let d1 = depth_load(in.uv + vec2<f32>( fog_texel.x, 0.0));
  let d2 = depth_load(in.uv + vec2<f32>(-fog_texel.x, 0.0));
  let d3 = depth_load(in.uv + vec2<f32>(0.0,  fog_texel.y));
  let d4 = depth_load(in.uv + vec2<f32>(0.0, -fog_texel.y));

  let e1 = abs(depth0 - d1); let e2 = abs(depth0 - d2);
  let e3 = abs(depth0 - d3); let e4 = abs(depth0 - d4);
  let dmin = min(min(e1, e2), min(e3, e4));

  var offset = vec2<f32>(0.0);
  if      (dmin == e1) { offset = vec2<f32>( fog_texel.x, 0.0); }
  else if (dmin == e2) { offset = vec2<f32>(-fog_texel.x, 0.0); }
  else if (dmin == e3) { offset = vec2<f32>(0.0,  fog_texel.y); }
  else if (dmin == e4) { offset = vec2<f32>(0.0, -fog_texel.y); }

  var fog = textureSampleLevel(fog_tex, samp, in.uv + offset, 0.0).r;
  fog = pow(max(fog, 0.0), params.fog_curve);

  // Fade godrays at night by scaling with the sun's above-horizon factor.
  let horizon_fade = smoothstep(-0.05, 0.05, -light.direction.y);
  let fog_color    = light.color * light.intensity * fog * horizon_fade;

  // Written additively onto the HDR buffer via one+one blend state.
  return vec4<f32>(fog_color, 0.0);
}
`,Ze=Q,ut=16;class ln extends he{constructor(e,t,r,i,o,a,s,c,u,p,f,h,m,_,w,v,x){super();l(this,"name","GodrayPass");l(this,"scattering",.3);l(this,"fogCurve",2);l(this,"maxSteps",16);l(this,"_fogA");l(this,"_fogB");l(this,"_fogAView");l(this,"_fogBView");l(this,"_hdrView");l(this,"_marchPipeline");l(this,"_blurHPipeline");l(this,"_blurVPipeline");l(this,"_compositePipeline");l(this,"_marchBG");l(this,"_blurHBG");l(this,"_blurVBG");l(this,"_compositeBG");l(this,"_marchParamsBuf");l(this,"_blurHParamsBuf");l(this,"_blurVParamsBuf");l(this,"_compParamsBuf");this._fogA=e,this._fogAView=t,this._fogB=r,this._fogBView=i,this._hdrView=o,this._marchPipeline=a,this._blurHPipeline=s,this._blurVPipeline=c,this._compositePipeline=u,this._marchBG=p,this._blurHBG=f,this._blurVBG=h,this._compositeBG=m,this._marchParamsBuf=_,this._blurHParamsBuf=w,this._blurVParamsBuf=v,this._compParamsBuf=x}static create(e,t,r,i,o,a){const{device:s,width:c,height:u}=e,p=Math.max(1,c>>1),f=Math.max(1,u>>1),h=s.createTexture({label:"GodrayFogA",size:{width:p,height:f},format:Ze,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),m=s.createTexture({label:"GodrayFogB",size:{width:p,height:f},format:Ze,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),_=h.createView(),w=m.createView(),v=s.createSampler({label:"GodraySampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),x=s.createSampler({label:"GodrayCmpSampler",compare:"less-equal",magFilter:"linear",minFilter:"linear"}),B=s.createBuffer({label:"GodrayMarchParams",size:ut,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});s.queue.writeBuffer(B,0,new Float32Array([.3,16,0,0]).buffer);const G=s.createBuffer({label:"GodrayBlurHParams",size:ut,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});s.queue.writeBuffer(G,0,new Float32Array([1,0,0,0]).buffer);const S=s.createBuffer({label:"GodrayBlurVParams",size:ut,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});s.queue.writeBuffer(S,0,new Float32Array([0,1,0,0]).buffer);const E=s.createBuffer({label:"GodrayCompositeParams",size:ut,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});s.queue.writeBuffer(E,0,new Float32Array([0,0,2,0]).buffer);const M=s.createShaderModule({label:"GodrayMarchShader",code:Ui}),A=s.createRenderPipeline({label:"GodrayMarchPipeline",layout:"auto",vertex:{module:M,entryPoint:"vs_main"},fragment:{module:M,entryPoint:"fs_march",targets:[{format:Ze}]},primitive:{topology:"triangle-list"}}),R=s.createBindGroup({label:"GodrayMarchBG",layout:A.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:o}},{binding:1,resource:{buffer:a}},{binding:2,resource:t.depthView},{binding:3,resource:r.shadowMapView},{binding:4,resource:x},{binding:5,resource:{buffer:B}}]}),P=s.createShaderModule({label:"GodrayCompositeShader",code:Ci}),b=s.createRenderPipeline({label:"GodrayBlurHPipeline",layout:"auto",vertex:{module:P,entryPoint:"vs_main"},fragment:{module:P,entryPoint:"fs_blur",targets:[{format:Ze}]},primitive:{topology:"triangle-list"}}),C=s.createRenderPipeline({label:"GodrayBlurVPipeline",layout:"auto",vertex:{module:P,entryPoint:"vs_main"},fragment:{module:P,entryPoint:"fs_blur",targets:[{format:Ze}]},primitive:{topology:"triangle-list"}}),g=s.createRenderPipeline({label:"GodrayCompositePipeline",layout:"auto",vertex:{module:P,entryPoint:"vs_main"},fragment:{module:P,entryPoint:"fs_composite",targets:[{format:Q,blend:{color:{operation:"add",srcFactor:"one",dstFactor:"one"},alpha:{operation:"add",srcFactor:"one",dstFactor:"one"}}}]},primitive:{topology:"triangle-list"}}),T=s.createBindGroup({label:"GodrayBlurHBG",layout:b.getBindGroupLayout(0),entries:[{binding:0,resource:_},{binding:1,resource:t.depthView},{binding:2,resource:v},{binding:3,resource:{buffer:G}}]}),y=s.createBindGroup({label:"GodrayBlurVBG",layout:C.getBindGroupLayout(0),entries:[{binding:0,resource:w},{binding:1,resource:t.depthView},{binding:2,resource:v},{binding:3,resource:{buffer:S}}]}),U=s.createBindGroup({label:"GodrayCompositeBG",layout:g.getBindGroupLayout(0),entries:[{binding:0,resource:_},{binding:1,resource:t.depthView},{binding:2,resource:v},{binding:3,resource:{buffer:E}},{binding:4,resource:{buffer:a}}]});return new ln(h,_,m,w,i,A,b,C,g,R,T,y,U,B,G,S,E)}updateParams(e){e.queue.writeBuffer(this._marchParamsBuf,0,new Float32Array([this.scattering,this.maxSteps,0,0]).buffer),e.queue.writeBuffer(this._compParamsBuf,0,new Float32Array([0,0,this.fogCurve,0]).buffer)}execute(e,t){const r=(i,o,a,s,c=!0)=>{const u=e.beginRenderPass({label:i,colorAttachments:[{view:o,clearValue:[0,0,0,0],loadOp:c?"clear":"load",storeOp:"store"}]});u.setPipeline(a),u.setBindGroup(0,s),u.draw(3),u.end()};r("GodrayMarch",this._fogAView,this._marchPipeline,this._marchBG),r("GodrayBlurH",this._fogBView,this._blurHPipeline,this._blurHBG),r("GodrayBlurV",this._fogAView,this._blurVPipeline,this._blurVBG),r("GodrayComposite",this._hdrView,this._compositePipeline,this._compositeBG,!1)}destroy(){this._fogA.destroy(),this._fogB.destroy(),this._marchParamsBuf.destroy(),this._blurHParamsBuf.destroy(),this._blurVParamsBuf.destroy(),this._compParamsBuf.destroy()}}const Li=`// composite.wgsl — Fog + Underwater + Tonemap merged into a single full-screen draw.
// Replaces FogPass → UnderwaterPass → TonemapPass, saving 2 intermediate HDR
// textures and 2 render-pass boundaries.
//
// Effect enable flags live in params.fog_flags and params.tonemap_flags so the GPU
// can branch them out without pipeline recompilation.

const PI: f32 = 3.14159265358979;

// ── Atmospheric scatter ────────────────────────────────────────────────────────
// Constants must match lighting.wgsl / fog.wgsl exactly.

const ATM_R_E   : f32       = 6360000.0;
const ATM_R_A   : f32       = 6420000.0;
const ATM_H_R   : f32       = 8500.0;
const ATM_H_M   : f32       = 1200.0;
const ATM_G     : f32       = 0.758;
const ATM_BETA_R: vec3<f32> = vec3<f32>(5.5e-6, 13.0e-6, 22.4e-6);
const ATM_BETA_M: f32       = 21.0e-6;
const ATM_SUN_I : f32       = 20.0;

fn atm_ray_sphere(ro: vec3<f32>, rd: vec3<f32>, r: f32) -> vec2<f32> {
  let b = dot(ro, rd); let c = dot(ro, ro) - r * r; let d = b * b - c;
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

// ── Structs ───────────────────────────────────────────────────────────────────

struct CameraUniforms {
  view       : mat4x4<f32>,
  proj       : mat4x4<f32>,
  viewProj   : mat4x4<f32>,
  invViewProj: mat4x4<f32>,
  position   : vec3<f32>,
  near       : f32,
  far        : f32,
}

// Only the first field of the full LightUniforms buffer is needed here.
struct LightDir { direction: vec3<f32>, }

// Combined params buffer — 64 bytes.
// Layout (byte offsets):
//  0  fog_color      vec3<f32>
// 12  depth_density  f32
// 16  depth_begin    f32
// 20  depth_end      f32
// 24  depth_curve    f32
// 28  height_density f32
// 32  height_min     f32
// 36  height_max     f32
// 40  height_curve   f32
// 44  fog_flags      u32  bit 0 = depth fog, bit 1 = height fog
// 48  uw_time        f32
// 52  is_underwater  f32
// 56  tonemap_flags  u32  bit 0 = aces, bit 1 = debug_ao, bit 2 = hdr_canvas
// 60  _pad           f32
struct CompositeParams {
  fog_color      : vec3<f32>,
  depth_density  : f32,
  depth_begin    : f32,
  depth_end      : f32,
  depth_curve    : f32,
  height_density : f32,
  height_min     : f32,
  height_max     : f32,
  height_curve   : f32,
  fog_flags      : u32,
  uw_time        : f32,
  is_underwater  : f32,
  tonemap_flags  : u32,
  _pad           : f32,
}

// invViewProj(64) + cam_pos(12) + pad(4) + sun_dir(12) + pad(4) = 96 bytes
struct StarUniforms {
  invViewProj: mat4x4<f32>,
  cam_pos    : vec3<f32>,
  _pad0      : f32,
  sun_dir    : vec3<f32>,
  _pad1      : f32,
}

struct ExposureBuffer {
  value: f32,
  _p0  : f32, _p1: f32, _p2: f32,
}

// ── Bindings ──────────────────────────────────────────────────────────────────

@group(0) @binding(0) var hdr_tex : texture_2d<f32>;
@group(0) @binding(1) var ao_tex  : texture_2d<f32>;
@group(0) @binding(2) var dep_tex : texture_depth_2d;
@group(0) @binding(3) var samp    : sampler;

@group(1) @binding(0) var<uniform> camera  : CameraUniforms;
@group(1) @binding(1) var<uniform> light   : LightDir;

@group(2) @binding(0) var<uniform>        params   : CompositeParams;
@group(2) @binding(1) var<uniform>        star_uni : StarUniforms;
@group(2) @binding(2) var<storage, read>  exposure : ExposureBuffer;

// ── Vertex shader ─────────────────────────────────────────────────────────────

struct VertOut {
  @builtin(position) pos: vec4<f32>,
  @location(0)       uv : vec2<f32>,
}

@vertex
fn vs_main(@builtin(vertex_index) vid: u32) -> VertOut {
  let x = f32((vid & 1u) << 2u) - 1.0;
  let y = f32((vid & 2u) << 1u) - 1.0;
  var out: VertOut;
  out.pos = vec4<f32>(x, y, 0.0, 1.0);
  out.uv  = vec2<f32>(x * 0.5 + 0.5, -y * 0.5 + 0.5);
  return out;
}

// ── Star field ────────────────────────────────────────────────────────────────

fn star_hash(p: vec2<f32>) -> f32 {
  return fract(sin(dot(p, vec2<f32>(127.1, 311.7))) * 43758.5453);
}

fn star_hash2(p: vec2<f32>) -> vec2<f32> {
  return fract(sin(vec2<f32>(
    dot(p, vec2<f32>(127.1, 311.7)),
    dot(p, vec2<f32>(269.5, 183.3)),
  )) * 43758.5453);
}

fn dir_to_equirect(d: vec3<f32>) -> vec2<f32> {
  let u = atan2(d.x, -d.z) / (2.0 * PI) + 0.5;
  let v = 0.5 - asin(clamp(d.y, -1.0, 1.0)) / PI;
  return vec2<f32>(u, v);
}

fn sample_stars(ray_dir: vec3<f32>) -> vec3<f32> {
  let GRID    = vec2<f32>(300.0, 150.0);
  let uv      = dir_to_equirect(ray_dir);
  let gcoord  = uv * GRID;
  let cell    = floor(gcoord);
  let frac_uv = fract(gcoord);
  let lat     = (0.5 - uv.y) * PI;
  let cos_lat = max(cos(lat), 0.15);
  var color   = vec3<f32>(0.0);

  for (var dy: i32 = -1; dy <= 1; dy++) {
    for (var dx: i32 = -1; dx <= 1; dx++) {
      var nc = cell + vec2<f32>(f32(dx), f32(dy));
      if (nc.y < 0.0 || nc.y >= GRID.y) { continue; }
      nc.x = nc.x - floor(nc.x / GRID.x) * GRID.x;
      let h           = star_hash2(nc);
      let cell_lat    = (0.5 - (nc.y + 0.5) / GRID.y) * PI;
      let star_thresh = 1.0 - 0.18 * max(cos(cell_lat), 0.0);
      if (h.x > star_thresh) {
        let off     = star_hash2(nc + vec2<f32>(7.3, 3.7)) * 0.8 + 0.1;
        let to_star = frac_uv - vec2<f32>(f32(dx), f32(dy)) - off;
        let ts_s    = vec2<f32>(to_star.x * cos_lat, to_star.y);
        let dist2   = dot(ts_s, ts_s);
        let glow    = exp(-dist2 * 500.0);
        if (glow < 0.002) { continue; }
        let mag  = pow(star_hash(nc + vec2<f32>(1.5, 0.0)), 1.8);
        let br   = glow * (0.15 + mag * 0.85);
        let roll = star_hash(nc + vec2<f32>(2.5, 0.0));
        var sc   = vec3<f32>(1.0);
        if      (roll < 0.06) { sc = vec3<f32>(0.65, 0.76, 1.0);  }
        else if (roll < 0.20) { sc = vec3<f32>(0.82, 0.89, 1.0);  }
        else if (roll < 0.44) { sc = vec3<f32>(1.0,  1.0,  0.82); }
        else if (roll < 0.57) { sc = vec3<f32>(1.0,  0.78, 0.51); }
        else if (roll < 0.64) { sc = vec3<f32>(1.0,  0.51, 0.25); }
        color += sc * br;
      }
    }
  }
  return color;
}

// ── ACES filmic ───────────────────────────────────────────────────────────────

fn aces_filmic(x: vec3<f32>) -> vec3<f32> {
  let a = 2.51; let b = 0.03; let c = 2.43; let d = 0.59; let e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), vec3<f32>(0.0), vec3<f32>(1.0));
}

// ── Fragment shader ───────────────────────────────────────────────────────────

@fragment
fn fs_main(in: VertOut) -> @location(0) vec4<f32> {
  let coord = vec2<i32>(in.pos.xy);

  // Debug AO mode — short-circuit everything else.
  if ((params.tonemap_flags & 2u) != 0u) {
    let ao = textureLoad(ao_tex, coord / 2, 0).r;
    return vec4<f32>(ao, ao, ao, 1.0);
  }

  // --- Underwater UV distortion ---
  var sample_uv = in.uv;
  if (params.is_underwater > 0.5) {
    let t = params.uw_time;
    let distort = vec2<f32>(
      sin(in.uv.y * 18.0 + t * 1.4) * 0.006,
      cos(in.uv.x * 14.0 + t * 1.1) * 0.004,
    );
    sample_uv = clamp(in.uv + distort, vec2<f32>(0.001), vec2<f32>(0.999));
  }

  // --- Sample HDR scene ---
  var scene = textureSample(hdr_tex, samp, sample_uv).rgb;

  let depth = textureLoad(dep_tex, coord, 0u);

  // --- Fog (skipped for sky pixels and when no fog mode is active) ---
  if (depth < 1.0 && (params.fog_flags & 3u) != 0u) {
    let ndc       = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, depth, 1.0);
    let world_h   = camera.invViewProj * ndc;
    let world_pos = world_h.xyz / world_h.w;
    let view_pos  = camera.view * vec4<f32>(world_pos, 1.0);
    let view_dist = length(view_pos.xyz);

    let sun_dir = normalize(-light.direction);
    let cam_h   = max(camera.position.y, 0.0);
    let atm_ro  = vec3<f32>(0.0, ATM_R_E + cam_h, 0.0);
    let ray_vec = world_pos - camera.position;
    let ray_dir = normalize(ray_vec);
    let h2      = vec3<f32>(ray_dir.x, 0.0, ray_dir.z);
    let len2    = dot(h2, h2);
    let fog_dir = select(normalize(h2), vec3<f32>(1.0, 0.0, 0.0), len2 < 1e-6);
    let fog_col = atm_scatter(atm_ro, fog_dir, sun_dir) * params.fog_color;

    var fog_amount = 0.0;
    if ((params.fog_flags & 1u) != 0u && params.depth_density > 0.0) {
      let far = select(params.depth_end, camera.far, params.depth_end <= 0.0);
      let t   = smoothstep(params.depth_begin, far, view_dist);
      fog_amount = max(fog_amount, pow(t, params.depth_curve) * params.depth_density);
    }
    if ((params.fog_flags & 2u) != 0u && params.height_density > 0.0) {
      let t = smoothstep(params.height_min, params.height_max, world_pos.y);
      fog_amount = max(fog_amount, pow(t, params.height_curve) * params.height_density);
    }
    scene = mix(scene, fog_col, clamp(fog_amount, 0.0, 1.0));
  }

  // --- Underwater tint + vignette ---
  if (params.is_underwater > 0.5) {
    scene = scene * vec3<f32>(0.20, 0.55, 0.90);
    let d = length(in.uv * 2.0 - 1.0);
    scene *= clamp(1.0 - d * d * 0.55, 0.0, 1.0);
  }

  // --- Exposure ---
  scene *= exposure.value;

  // --- Stars (sky pixels only, rendered after DoF/Bloom for crisp point sources) ---
  if (depth >= 1.0) {
    let ndc     = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, 1.0, 1.0);
    let world_h = star_uni.invViewProj * ndc;
    let ray_dir = normalize(world_h.xyz / world_h.w - star_uni.cam_pos);
    if (ray_dir.y > -0.05) {
      let night_t     = saturate((-star_uni.sun_dir.y - 0.05) * 10.0);
      let above_horiz = saturate(ray_dir.y * 20.0);
      let star_fade   = night_t * above_horiz;
      if (star_fade > 0.001) {
        scene += sample_stars(ray_dir) * (star_fade * 2.0);
      }
    }
  }

  // --- Tonemap + gamma ---
  if ((params.tonemap_flags & 4u) != 0u) {
    // HDR canvas mode: skip ACES, just gamma-encode.
    return vec4<f32>(pow(max(scene, vec3<f32>(0.0)), vec3<f32>(1.0 / 2.2)), 1.0);
  }
  let ldr = select(scene, aces_filmic(scene), (params.tonemap_flags & 1u) != 0u);
  return vec4<f32>(pow(ldr, vec3<f32>(1.0 / 2.2)), 1.0);
}
`,tr=64,nr=96;class cn extends he{constructor(e,t,r,i,o,a){super();l(this,"name","CompositePass");l(this,"depthFogEnabled",!0);l(this,"depthDensity",1);l(this,"depthBegin",32);l(this,"depthEnd",128);l(this,"depthCurve",1.5);l(this,"heightFogEnabled",!1);l(this,"heightDensity",.7);l(this,"heightMin",48);l(this,"heightMax",80);l(this,"heightCurve",1);l(this,"fogColor",[1,1,1]);l(this,"_pipeline");l(this,"_bg0");l(this,"_bg1");l(this,"_bg2");l(this,"_paramsBuf");l(this,"_starBuf");this._pipeline=e,this._bg0=t,this._bg1=r,this._bg2=i,this._paramsBuf=o,this._starBuf=a}static create(e,t,r,i,o,a,s){const{device:c,format:u}=e,p=c.createBindGroupLayout({label:"CompositeBGL0",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),f=c.createBindGroupLayout({label:"CompositeBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),h=c.createBindGroupLayout({label:"CompositeBGL2",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),m=c.createSampler({label:"CompositeSampler",magFilter:"linear",minFilter:"linear"}),_=c.createBuffer({label:"CompositeParams",size:tr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),w=c.createBuffer({label:"CompositeStars",size:nr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),v=c.createBindGroup({label:"CompositeBG0",layout:p,entries:[{binding:0,resource:t},{binding:1,resource:r},{binding:2,resource:i},{binding:3,resource:m}]}),x=c.createBindGroup({label:"CompositeBG1",layout:f,entries:[{binding:0,resource:{buffer:o}},{binding:1,resource:{buffer:a}}]}),B=c.createBindGroup({label:"CompositeBG2",layout:h,entries:[{binding:0,resource:{buffer:_}},{binding:1,resource:{buffer:w}},{binding:2,resource:{buffer:s}}]}),G=c.createShaderModule({label:"CompositeShader",code:Li}),S=c.createPipelineLayout({bindGroupLayouts:[p,f,h]}),E=c.createRenderPipeline({label:"CompositePipeline",layout:S,vertex:{module:G,entryPoint:"vs_main"},fragment:{module:G,entryPoint:"fs_main",targets:[{format:u}]},primitive:{topology:"triangle-list"}});return new cn(E,v,x,B,_,w)}updateParams(e,t,r,i,o,a){const s=new ArrayBuffer(tr),c=new Float32Array(s),u=new Uint32Array(s);let p=0;this.depthFogEnabled&&(p|=1),this.heightFogEnabled&&(p|=2);let f=0;i&&(f|=1),o&&(f|=2),a&&(f|=4),c[0]=this.fogColor[0],c[1]=this.fogColor[1],c[2]=this.fogColor[2],c[3]=this.depthDensity,c[4]=this.depthBegin,c[5]=this.depthEnd,c[6]=this.depthCurve,c[7]=this.heightDensity,c[8]=this.heightMin,c[9]=this.heightMax,c[10]=this.heightCurve,u[11]=p,c[12]=r,c[13]=t?1:0,u[14]=f,c[15]=0,e.queue.writeBuffer(this._paramsBuf,0,s)}updateStars(e,t,r,i){const o=new Float32Array(nr/4);o.set(t.data,0),o[16]=r.x,o[17]=r.y,o[18]=r.z,o[19]=0,o[20]=i.x,o[21]=i.y,o[22]=i.z,o[23]=0,e.queue.writeBuffer(this._starBuf,0,o.buffer)}execute(e,t){const r=e.beginRenderPass({label:"CompositePass",colorAttachments:[{view:t.getCurrentTexture().createView(),clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._pipeline),r.setBindGroup(0,this._bg0),r.setBindGroup(1,this._bg1),r.setBindGroup(2,this._bg2),r.draw(3),r.end()}destroy(){this._paramsBuf.destroy(),this._starBuf.destroy()}}const rr=64*4+16+16,ki=128;class un extends he{constructor(e,t,r,i,o){super();l(this,"name","GeometryPass");l(this,"_gbuffer");l(this,"_cameraBGL");l(this,"_modelBGL");l(this,"_pipelineCache",new Map);l(this,"_cameraBuffer");l(this,"_cameraBindGroup");l(this,"_modelBuffers",[]);l(this,"_modelBindGroups",[]);l(this,"_drawItems",[]);l(this,"_modelData",new Float32Array(32));l(this,"_cameraScratch",new Float32Array(rr/4));this._gbuffer=e,this._cameraBGL=t,this._modelBGL=r,this._cameraBuffer=i,this._cameraBindGroup=o}static create(e,t){const{device:r}=e,i=r.createBindGroupLayout({label:"GeomCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),o=r.createBindGroupLayout({label:"GeomModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),a=r.createBuffer({label:"GeomCameraBuffer",size:rr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),s=r.createBindGroup({label:"GeomCameraBindGroup",layout:i,entries:[{binding:0,resource:{buffer:a}}]});return new un(t,i,o,a,s)}setDrawItems(e){this._drawItems=e}updateCamera(e,t,r,i,o,a,s,c){const u=this._cameraScratch;u.set(t.data,0),u.set(r.data,16),u.set(i.data,32),u.set(o.data,48),u[64]=a.x,u[65]=a.y,u[66]=a.z,u[67]=s,u[68]=c,e.queue.writeBuffer(this._cameraBuffer,0,u.buffer)}execute(e,t){var o,a;const{device:r}=t;this._ensurePerDrawBuffers(r,this._drawItems.length);for(let s=0;s<this._drawItems.length;s++){const c=this._drawItems[s],u=this._modelData;u.set(c.modelMatrix.data,0),u.set(c.normalMatrix.data,16),t.queue.writeBuffer(this._modelBuffers[s],0,u.buffer),(a=(o=c.material).update)==null||a.call(o,t.queue)}const i=e.beginRenderPass({label:"GeometryPass",colorAttachments:[{view:this._gbuffer.albedoRoughnessView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"},{view:this._gbuffer.normalMetallicView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});i.setBindGroup(0,this._cameraBindGroup);for(let s=0;s<this._drawItems.length;s++){const c=this._drawItems[s];i.setPipeline(this._getPipeline(r,c.material)),i.setBindGroup(1,this._modelBindGroups[s]),i.setBindGroup(2,c.material.getBindGroup(r)),i.setVertexBuffer(0,c.mesh.vertexBuffer),i.setIndexBuffer(c.mesh.indexBuffer,"uint32"),i.drawIndexed(c.mesh.indexCount)}i.end()}_getPipeline(e,t){let r=this._pipelineCache.get(t.shaderId);if(r)return r;const i=e.createShaderModule({label:`GeometryShader[${t.shaderId}]`,code:t.getShaderCode(Je.Geometry)});return r=e.createRenderPipeline({label:`GeometryPipeline[${t.shaderId}]`,layout:e.createPipelineLayout({bindGroupLayouts:[this._cameraBGL,this._modelBGL,t.getBindGroupLayout(e)]}),vertex:{module:i,entryPoint:"vs_main",buffers:[{arrayStride:Zt,attributes:Qt}]},fragment:{module:i,entryPoint:"fs_main",targets:[{format:"rgba8unorm"},{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),this._pipelineCache.set(t.shaderId,r),r}_ensurePerDrawBuffers(e,t){for(;this._modelBuffers.length<t;){const r=e.createBuffer({size:ki,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._modelBuffers.push(r),this._modelBindGroups.push(e.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:r}}]}))}}destroy(){this._cameraBuffer.destroy();for(const e of this._modelBuffers)e.destroy()}}const Ni=`// GBuffer fill pass for voxel chunk geometry.
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
`,ir=64*4+16+16,Ri=16,Qe=256,Ii=2048,Oi=5,De=Oi*4,Vt=16;class dn extends he{constructor(e,t,r,i,o,a,s,c,u,p){super();l(this,"name","WorldGeometryPass");l(this,"_gbuffer");l(this,"_device");l(this,"_opaquePipeline");l(this,"_transparentPipeline");l(this,"_propPipeline");l(this,"_cameraBuffer");l(this,"_cameraBindGroup");l(this,"_sharedBindGroup");l(this,"_chunkUniformBuffer");l(this,"_chunkBindGroup");l(this,"_slotFreeList",[]);l(this,"_slotHighWater",0);l(this,"_chunks",new Map);l(this,"_frustumPlanes",new Float32Array(24));l(this,"drawCalls",0);l(this,"triangles",0);l(this,"_cameraData",new Float32Array(ir/4));l(this,"_debugChunks",!1);this._device=e,this._gbuffer=t,this._opaquePipeline=r,this._transparentPipeline=i,this._propPipeline=o,this._cameraBuffer=a,this._cameraBindGroup=s,this._sharedBindGroup=c,this._chunkUniformBuffer=u,this._chunkBindGroup=p}static create(e,t,r){const{device:i}=e,o=i.createBindGroupLayout({label:"ChunkCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),a=i.createBindGroupLayout({label:"ChunkSharedBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),s=i.createBindGroupLayout({label:"ChunkOffsetBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform",hasDynamicOffset:!0,minBindingSize:32}}]}),c=L.MAX,u=i.createBuffer({label:"BlockDataBuffer",size:Math.max(c*Ri,16),usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),p=Cr,f=new Uint32Array(c*4);for(let P=0;P<c;P++){const b=At[P];b&&(f[P*4+0]=b.sideFace.y*p+b.sideFace.x,f[P*4+1]=b.bottomFace.y*p+b.bottomFace.x,f[P*4+2]=b.topFace.y*p+b.topFace.x)}i.queue.writeBuffer(u,0,f);const h=i.createSampler({label:"ChunkAtlasSampler",magFilter:"nearest",minFilter:"nearest",addressModeU:"repeat",addressModeV:"repeat"}),m=i.createBindGroup({label:"ChunkSharedBG",layout:a,entries:[{binding:0,resource:r.colorAtlas.view},{binding:1,resource:r.normalAtlas.view},{binding:2,resource:r.merAtlas.view},{binding:3,resource:h},{binding:4,resource:{buffer:u}}]}),_=i.createBuffer({label:"ChunkCameraBuffer",size:ir,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),w=i.createBindGroup({label:"ChunkCameraBG",layout:o,entries:[{binding:0,resource:{buffer:_}}]}),v=i.createShaderModule({label:"ChunkGeometryShader",code:Ni}),x=i.createPipelineLayout({bindGroupLayouts:[o,a,s]}),B={arrayStride:De,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32"},{shaderLocation:2,offset:16,format:"float32"}]},G=[{format:"rgba8unorm"},{format:"rgba16float"}],S=i.createRenderPipeline({label:"ChunkOpaquePipeline",layout:x,vertex:{module:v,entryPoint:"vs_main",buffers:[B]},fragment:{module:v,entryPoint:"fs_opaque",targets:G},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),E=i.createRenderPipeline({label:"ChunkTransparentPipeline",layout:x,vertex:{module:v,entryPoint:"vs_main",buffers:[B]},fragment:{module:v,entryPoint:"fs_transparent",targets:G},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),M=i.createRenderPipeline({label:"ChunkPropPipeline",layout:x,vertex:{module:v,entryPoint:"vs_prop",buffers:[B]},fragment:{module:v,entryPoint:"fs_prop",targets:G},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}}),A=i.createBuffer({label:"ChunkUniformBuffer",size:Ii*Qe,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),R=i.createBindGroup({label:"ChunkOffsetBG",layout:s,entries:[{binding:0,resource:{buffer:A,size:32}}]});return new dn(i,t,S,E,M,_,w,m,A,R)}updateGBuffer(e){this._gbuffer=e}addChunk(e,t){const r=this._chunks.get(e);r?this._replaceMeshBuffers(r,t):this._chunks.set(e,this._createChunkGpu(e,t))}updateChunk(e,t){const r=this._chunks.get(e);r?this._replaceMeshBuffers(r,t):this._chunks.set(e,this._createChunkGpu(e,t))}removeChunk(e){var r,i,o;const t=this._chunks.get(e);t&&((r=t.opaqueBuffer)==null||r.destroy(),(i=t.transparentBuffer)==null||i.destroy(),(o=t.propBuffer)==null||o.destroy(),this._freeSlot(t.slot),this._chunks.delete(e))}updateCamera(e,t,r,i,o,a,s,c){const u=this._cameraData;u.set(t.data,0),u.set(r.data,16),u.set(i.data,32),u.set(o.data,48),u[64]=a.x,u[65]=a.y,u[66]=a.z,u[67]=s,u[68]=c,e.queue.writeBuffer(this._cameraBuffer,0,u.buffer),this._extractFrustumPlanes(i.data)}_extractFrustumPlanes(e){const t=this._frustumPlanes;t[0]=e[3]+e[0],t[1]=e[7]+e[4],t[2]=e[11]+e[8],t[3]=e[15]+e[12],t[4]=e[3]-e[0],t[5]=e[7]-e[4],t[6]=e[11]-e[8],t[7]=e[15]-e[12],t[8]=e[3]+e[1],t[9]=e[7]+e[5],t[10]=e[11]+e[9],t[11]=e[15]+e[13],t[12]=e[3]-e[1],t[13]=e[7]-e[5],t[14]=e[11]-e[9],t[15]=e[15]-e[13],t[16]=e[2],t[17]=e[6],t[18]=e[10],t[19]=e[14],t[20]=e[3]-e[2],t[21]=e[7]-e[6],t[22]=e[11]-e[10],t[23]=e[15]-e[14]}setDebugChunks(e){if(this._debugChunks!==e){this._debugChunks=e;for(const[t,r]of this._chunks)this._writeChunkUniforms(r.slot,r.ox,r.oy,r.oz)}}_isVisible(e,t,r){const i=this._frustumPlanes,o=e+Vt,a=t+Vt,s=r+Vt;for(let c=0;c<6;c++){const u=i[c*4],p=i[c*4+1],f=i[c*4+2],h=i[c*4+3];if(u*(u>=0?o:e)+p*(p>=0?a:t)+f*(f>=0?s:r)+h<0)return!1}return!0}execute(e,t){const r=e.beginRenderPass({label:"WorldGeometryPass",colorAttachments:[{view:this._gbuffer.albedoRoughnessView,loadOp:"load",storeOp:"store"},{view:this._gbuffer.normalMetallicView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthLoadOp:"load",depthStoreOp:"store"}});r.setBindGroup(0,this._cameraBindGroup),r.setBindGroup(1,this._sharedBindGroup);let i=0,o=0;const a=[];for(const s of this._chunks.values())this._isVisible(s.ox,s.oy,s.oz)&&a.push(s);r.setPipeline(this._opaquePipeline);for(const s of a)s.opaqueBuffer&&s.opaqueCount>0&&(r.setBindGroup(2,this._chunkBindGroup,[s.slot*Qe]),r.setVertexBuffer(0,s.opaqueBuffer),r.draw(s.opaqueCount),i++,o+=s.opaqueCount/3);r.setPipeline(this._transparentPipeline);for(const s of a)s.transparentBuffer&&s.transparentCount>0&&(r.setBindGroup(2,this._chunkBindGroup,[s.slot*Qe]),r.setVertexBuffer(0,s.transparentBuffer),r.draw(s.transparentCount),i++,o+=s.transparentCount/3);r.setPipeline(this._propPipeline);for(const s of a)s.propBuffer&&s.propCount>0&&(r.setBindGroup(2,this._chunkBindGroup,[s.slot*Qe]),r.setVertexBuffer(0,s.propBuffer),r.draw(s.propCount),i++,o+=s.propCount/3);this.drawCalls=i,this.triangles=o,r.end()}destroy(){var e,t,r;this._cameraBuffer.destroy(),this._chunkUniformBuffer.destroy();for(const i of this._chunks.values())(e=i.opaqueBuffer)==null||e.destroy(),(t=i.transparentBuffer)==null||t.destroy(),(r=i.propBuffer)==null||r.destroy();this._chunks.clear()}_allocSlot(){return this._slotFreeList.length>0?this._slotFreeList.pop():this._slotHighWater++}_freeSlot(e){this._slotFreeList.push(e)}_writeChunkUniforms(e,t,r,i){const o=t*73856093^r*19349663^i*83492791,a=(o&255)/255*.6+.4,s=(o>>8&255)/255*.6+.4,c=(o>>16&255)/255*.6+.4,u=new ArrayBuffer(32),p=new Float32Array(u),f=new Uint32Array(u);p[0]=t,p[1]=r,p[2]=i,f[3]=this._debugChunks?1:0,p[4]=a,p[5]=s,p[6]=c,p[7]=0,this._device.queue.writeBuffer(this._chunkUniformBuffer,e*Qe,u)}_createChunkGpu(e,t){const r=this._allocSlot();this._writeChunkUniforms(r,e.globalPosition.x,e.globalPosition.y,e.globalPosition.z);const i={ox:e.globalPosition.x,oy:e.globalPosition.y,oz:e.globalPosition.z,slot:r,opaqueBuffer:null,opaqueCount:0,transparentBuffer:null,transparentCount:0,propBuffer:null,propCount:0};return this._replaceMeshBuffers(i,t),i}_replaceMeshBuffers(e,t){var r,i,o;if((r=e.opaqueBuffer)==null||r.destroy(),(i=e.transparentBuffer)==null||i.destroy(),(o=e.propBuffer)==null||o.destroy(),e.opaqueBuffer=null,e.transparentBuffer=null,e.propBuffer=null,e.opaqueCount=t.opaqueCount,e.transparentCount=t.transparentCount,e.propCount=t.propCount,t.opaqueCount>0){const a=this._device.createBuffer({label:"ChunkOpaqueBuf",size:t.opaqueCount*De,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.opaque.buffer,0,t.opaqueCount*De),e.opaqueBuffer=a}if(t.transparentCount>0){const a=this._device.createBuffer({label:"ChunkTransparentBuf",size:t.transparentCount*De,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.transparent.buffer,0,t.transparentCount*De),e.transparentBuffer=a}if(t.propCount>0){const a=this._device.createBuffer({label:"ChunkPropBuf",size:t.propCount*De,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.prop.buffer,0,t.propCount*De),e.propBuffer=a}}}const Vi=`// Depth of Field: prefilter (CoC + 2x downsample) then fused disc-blur + composite.

struct DofUniforms {
  focus_distance: f32,  // linear depth of sharp plane (world units)
  focus_range   : f32,  // half-range: blur ramps 0→max over this distance on each side
  bokeh_radius  : f32,  // max blur radius in half-res texels
  near          : f32,
  far           : f32,
  _pad1         : f32,
  _pad2         : f32,
  _pad3         : f32,
}

@group(0) @binding(0) var<uniform> dof     : DofUniforms;
@group(0) @binding(1) var          hdr_tex : texture_2d<f32>;
@group(0) @binding(2) var          dep_tex : texture_depth_2d;
@group(0) @binding(3) var          samp    : sampler;
// group 1 is only used by fs_composite; prefilter pipeline has no group 1
@group(1) @binding(0) var          half_tex: texture_2d<f32>;

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
  @location(0)       uv     : vec2<f32>,
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

fn linear_depth(ndc_depth: f32) -> f32 {
  return dof.near * dof.far / (dof.far - ndc_depth * (dof.far - dof.near));
}

fn compute_coc(lin_depth: f32) -> f32 {
  return clamp(
    (lin_depth - dof.focus_distance) / max(dof.focus_range, 0.001),
    0.0, 1.0
  ) * dof.bokeh_radius;
}

// Prefilter: 4-tap 2x downsample; RGB = colour, A = signed CoC (texels, half-res).
// Negative CoC = in front of focus plane.
@fragment
fn fs_prefilter(in: VertexOutput) -> @location(0) vec4<f32> {
  let full_size = vec2<f32>(textureDimensions(hdr_tex));
  let texel = 1.0 / full_size;
  let o = array<vec2<f32>, 4>(
    vec2<f32>(-0.5, -0.5), vec2<f32>( 0.5, -0.5),
    vec2<f32>(-0.5,  0.5), vec2<f32>( 0.5,  0.5)
  );

  var col = vec3<f32>(0.0);
  var c   = 0.0;
  for (var i = 0; i < 4; i++) {
    let uv = in.uv + o[i] * texel;
    col   += textureSampleLevel(hdr_tex, samp, uv, 0.0).rgb;
    let px = clamp(vec2<u32>(uv * full_size), vec2<u32>(0u), vec2<u32>(full_size) - 1u);
    c     += compute_coc(linear_depth(textureLoad(dep_tex, px, 0)));
  }
  return vec4<f32>(col * 0.25, c * 0.25);
}

// Composite: 48-tap Fibonacci spiral disc blur on the prefiltered half-res texture.
// Radii are sqrt-distributed (uniform area coverage) so there are no discrete rings.
// Per-pixel rotation breaks any residual spiral pattern into noise.
const GOLDEN_ANGLE: f32 = 2.399963229728; // 2π(2 - φ), φ = golden ratio
const NUM_TAPS: i32 = 48;

@fragment
fn fs_composite(in: VertexOutput) -> @location(0) vec4<f32> {
  let sharp  = textureSampleLevel(hdr_tex,  samp, in.uv, 0.0).rgb;
  let center = textureSampleLevel(half_tex, samp, in.uv, 0.0);
  let coc_px = abs(center.a);

  let texel = 1.0 / vec2<f32>(textureDimensions(half_tex));

  // Per-pixel rotation offset — breaks the spiral into spatially-varying noise.
  let coord = vec2<u32>(in.clip_pos.xy);
  let rot   = f32((coord.x * 1619u + coord.y * 7919u) & 63u) * (6.28318 / 64.0);

  var accum  = center.rgb;
  var weight = 1.0;
  for (var i = 0; i < NUM_TAPS; i++) {
    // sqrt distribution → uniform area density, no discrete ring jumps
    let r     = sqrt(f32(i) + 0.5) / sqrt(f32(NUM_TAPS)) * coc_px;
    let theta = f32(i) * GOLDEN_ANGLE + rot;
    let uv2   = in.uv + vec2<f32>(cos(theta), sin(theta)) * r * texel;
    let s     = textureSampleLevel(half_tex, samp, uv2, 0.0);
    let w     = clamp(abs(s.a) / max(dof.bokeh_radius, 0.001), 0.0, 1.0);
    accum  += s.rgb * w;
    weight += w;
  }
  let blurred = accum / weight;

  let blend = smoothstep(0.0, 1.0, coc_px / max(dof.bokeh_radius, 0.001));
  return vec4<f32>(mix(sharp, blurred, blend), 1.0);
}
`,Di=32;class fn extends he{constructor(e,t,r,i,o,a,s,c,u,p){super();l(this,"name","DofPass");l(this,"resultView");l(this,"_result");l(this,"_half");l(this,"_halfView");l(this,"_prefilterPipeline");l(this,"_compositePipeline");l(this,"_uniformBuffer");l(this,"_prefilterBG");l(this,"_compBG0");l(this,"_compBG1");this._result=e,this.resultView=t,this._half=r,this._halfView=i,this._prefilterPipeline=o,this._compositePipeline=a,this._uniformBuffer=s,this._prefilterBG=c,this._compBG0=u,this._compBG1=p}static create(e,t,r){const{device:i,width:o,height:a}=e,s=Math.max(1,o>>1),c=Math.max(1,a>>1),u=i.createTexture({label:"DofHalf",size:{width:s,height:c},format:Q,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),p=i.createTexture({label:"DofResult",size:{width:o,height:a},format:Q,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),f=u.createView(),h=p.createView(),m=i.createBuffer({label:"DofUniforms",size:Di,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});i.queue.writeBuffer(m,0,new Float32Array([30,60,6,.1,1e3,0,0,0]).buffer);const _=i.createSampler({label:"DofSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),w=i.createBindGroupLayout({label:"DofBGL0Prefilter",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),v=i.createBindGroupLayout({label:"DofBGL0Composite",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),x=i.createBindGroupLayout({label:"DofBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),B=i.createShaderModule({label:"DofShader",code:Vi}),G=i.createRenderPipeline({label:"DofPrefilterPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[w]}),vertex:{module:B,entryPoint:"vs_main"},fragment:{module:B,entryPoint:"fs_prefilter",targets:[{format:Q}]},primitive:{topology:"triangle-list"}}),S=i.createRenderPipeline({label:"DofCompositePipeline",layout:i.createPipelineLayout({bindGroupLayouts:[v,x]}),vertex:{module:B,entryPoint:"vs_main"},fragment:{module:B,entryPoint:"fs_composite",targets:[{format:Q}]},primitive:{topology:"triangle-list"}}),E=i.createBindGroup({label:"DofPrefilterBG",layout:w,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:t},{binding:2,resource:r},{binding:3,resource:_}]}),M=i.createBindGroup({label:"DofCompBG0",layout:v,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:t},{binding:3,resource:_}]}),A=i.createBindGroup({label:"DofCompBG1",layout:x,entries:[{binding:0,resource:f}]});return new fn(p,h,u,f,G,S,m,E,M,A)}updateParams(e,t=30,r=60,i=6,o=.1,a=1e3,s=1){e.device.queue.writeBuffer(this._uniformBuffer,0,new Float32Array([t,r,i,o,a,s,0,0]).buffer)}execute(e,t){{const r=e.beginRenderPass({label:"DofPrefilter",colorAttachments:[{view:this._halfView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._prefilterPipeline),r.setBindGroup(0,this._prefilterBG),r.draw(3),r.end()}{const r=e.beginRenderPass({label:"DofComposite",colorAttachments:[{view:this.resultView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._compositePipeline),r.setBindGroup(0,this._compBG0),r.setBindGroup(1,this._compBG1),r.draw(3),r.end()}}destroy(){this._result.destroy(),this._half.destroy(),this._uniformBuffer.destroy()}}const zi=`// SSAO: hemisphere sampling in view space.
// Reads GBuffer depth + normals, writes raw AO value [0,1].

const KERNEL_SIZE: i32 = 16;

struct SsaoUniforms {
  view    : mat4x4<f32>,  // offset   0
  proj    : mat4x4<f32>,  // offset  64
  inv_proj: mat4x4<f32>,  // offset 128
  radius  : f32,          // offset 192
  bias    : f32,          // offset 196
  strength: f32,          // offset 200
  _pad    : f32,          // offset 204
  kernel  : array<vec4<f32>, 16>, // offset 208 (256 bytes)
}                          // total: 464 bytes

@group(0) @binding(0) var<uniform> ssao: SsaoUniforms;

@group(1) @binding(0) var normal_tex: texture_2d<f32>;   // GBuffer normalMetallic (rgba16float)
@group(1) @binding(1) var depth_tex : texture_depth_2d;  // GBuffer depth (depth32float)
@group(1) @binding(2) var noise_tex : texture_2d<f32>;   // 4×4 random rotation vectors (rgba8unorm)

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
  @location(0)       uv     : vec2<f32>,
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

// Reconstruct view-space position from UV + NDC depth.
// WebGPU NDC: Y is up, depth [0,1]. UV: Y is down.
fn view_pos(uv: vec2<f32>, depth: f32) -> vec3<f32> {
  let ndc = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);
  let vh  = ssao.inv_proj * ndc;
  return vh.xyz / vh.w;
}

@fragment
fn fs_ssao(in: VertexOutput) -> @location(0) vec4<f32> {
  // This pass runs at half resolution. clip_pos is in half-res pixel space;
  // GBuffer textures are full-res so multiply by 2 to address them correctly.
  let half_coord = vec2<i32>(in.clip_pos.xy);
  let coord      = half_coord * 2;
  let depth = textureLoad(depth_tex, coord, 0);

  // Sky pixels → full AO (no occlusion)
  if (depth >= 1.0) { return vec4<f32>(1.0, 0.0, 0.0, 1.0); }

  let P = view_pos(in.uv, depth);

  // Decode world-space normal (stored as N*0.5+0.5), transform to view space
  let raw_n   = textureLoad(normal_tex, coord, 0).rgb;
  let world_N = normalize(raw_n * 2.0 - 1.0);
  let N       = normalize((ssao.view * vec4<f32>(world_N, 0.0)).xyz);

  // Tiled 4×4 noise using half-res coords so the pattern tiles the full screen.
  let noise_coord = vec2<u32>(half_coord) % vec2<u32>(4u);
  let rnd         = textureLoad(noise_tex, noise_coord, 0).rg * 2.0 - 1.0;

  // Gram-Schmidt: build orthonormal tangent frame from random vector + N
  let rand_vec = vec3<f32>(rnd, 0.0);
  let T = normalize(rand_vec - N * dot(rand_vec, N));
  let B = cross(N, T);
  // TBN columns [T, B, N] maps from tangent space to view space
  let tbn = mat3x3<f32>(T, B, N);

  let tex_size = vec2<f32>(textureDimensions(depth_tex));
  var occlusion = 0.0;

  for (var i = 0; i < KERNEL_SIZE; i++) {
    // View-space sample: kernel.z aligns with N (hemisphere above surface)
    let sample_vs = P + (tbn * ssao.kernel[i].xyz) * ssao.radius;

    // Project sample to screen UV
    let clip       = ssao.proj * vec4<f32>(sample_vs, 1.0);
    let ndc_xy     = clip.xy / clip.w;
    let sample_uv  = vec2<f32>(ndc_xy.x * 0.5 + 0.5, -ndc_xy.y * 0.5 + 0.5);

    // Sample depth at that UV and reconstruct view-space Z
    let sc        = clamp(vec2<i32>(sample_uv * tex_size), vec2<i32>(0), vec2<i32>(tex_size) - 1);
    let ref_depth = textureLoad(depth_tex, sc, 0);
    let ref_z     = view_pos(sample_uv, ref_depth).z;

    // Range check: weight falls to 0 when ref surface is beyond radius (different geometry).
    // Inverted smoothstep avoids the reciprocal spike that caused self-occlusion on flat faces.
    let range_check = 1.0 - smoothstep(0.0, ssao.radius, abs(P.z - ref_z));

    // Right-handed view space: closer to camera = higher (less negative) Z.
    // Occlude when actual geometry is closer to camera than the sample point (sample is inside geometry).
    // Using sample_vs.z rather than P.z makes the check slope-invariant: the sample already sits
    // above the surface, so same-surface pixels always satisfy ref_z < sample_vs.z regardless of tilt.
    occlusion += select(0.0, 1.0, ref_z > sample_vs.z + ssao.bias) * range_check;
  }

  let ao = clamp(1.0 - (occlusion / f32(KERNEL_SIZE)) * ssao.strength, 0.0, 1.0);
  return vec4<f32>(ao, 0.0, 0.0, 1.0);
}
`,Fi=`// SSAO blur: 4×4 box blur to smooth raw SSAO output.

@group(0) @binding(0) var ao_tex: texture_2d<f32>;
@group(0) @binding(1) var samp  : sampler;

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
  @location(0)       uv     : vec2<f32>,
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

@fragment
fn fs_blur(in: VertexOutput) -> @location(0) vec4<f32> {
  let texel = 1.0 / vec2<f32>(textureDimensions(ao_tex));
  var ao = 0.0;
  for (var y = -1; y <= 2; y++) {
    for (var x = -1; x <= 2; x++) {
      ao += textureSampleLevel(ao_tex, samp, in.uv + vec2<f32>(f32(x), f32(y)) * texel, 0.0).r;
    }
  }
  return vec4<f32>(ao / 16.0, 0.0, 0.0, 1.0);
}
`,dt="r8unorm",Dt=16,Hi=464;function Wi(){const d=new Float32Array(Dt*4);for(let n=0;n<Dt;n++){const e=Math.random(),t=Math.random()*Math.PI*2,r=Math.sqrt(1-e*e),i=.1+.9*(n/Dt)**2;d[n*4+0]=r*Math.cos(t)*i,d[n*4+1]=r*Math.sin(t)*i,d[n*4+2]=e*i,d[n*4+3]=0}return d}function qi(){const d=new Uint8Array(64);for(let n=0;n<16;n++){const e=Math.random()*Math.PI*2;d[n*4+0]=Math.round((Math.cos(e)*.5+.5)*255),d[n*4+1]=Math.round((Math.sin(e)*.5+.5)*255),d[n*4+2]=128,d[n*4+3]=255}return d}class pn extends he{constructor(e,t,r,i,o,a,s,c,u,p,f){super();l(this,"name","SSAOPass");l(this,"aoView");l(this,"_raw");l(this,"_blurred");l(this,"_rawView");l(this,"_ssaoPipeline");l(this,"_blurPipeline");l(this,"_uniformBuffer");l(this,"_noiseTex");l(this,"_ssaoBG0");l(this,"_ssaoBG1");l(this,"_blurBG");this._raw=e,this._rawView=t,this._blurred=r,this.aoView=i,this._ssaoPipeline=o,this._blurPipeline=a,this._uniformBuffer=s,this._noiseTex=c,this._ssaoBG0=u,this._ssaoBG1=p,this._blurBG=f}static create(e,t){const{device:r,width:i,height:o}=e,a=Math.max(1,i>>1),s=Math.max(1,o>>1),c=r.createTexture({label:"SsaoRaw",size:{width:a,height:s},format:dt,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),u=r.createTexture({label:"SsaoBlurred",size:{width:a,height:s},format:dt,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),p=c.createView(),f=u.createView(),h=r.createTexture({label:"SsaoNoise",size:{width:4,height:4},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});r.queue.writeTexture({texture:h},qi().buffer,{bytesPerRow:4*4,rowsPerImage:4},{width:4,height:4});const m=h.createView(),_=r.createBuffer({label:"SsaoUniforms",size:Hi,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(_,208,Wi().buffer),r.queue.writeBuffer(_,192,new Float32Array([1,.005,2,0]).buffer);const w=r.createSampler({label:"SsaoBlurSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),v=r.createBindGroupLayout({label:"SsaoBGL0",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),x=r.createBindGroupLayout({label:"SsaoBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),B=r.createBindGroupLayout({label:"SsaoBlurBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),G=r.createShaderModule({label:"SsaoShader",code:zi}),S=r.createShaderModule({label:"SsaoBlurShader",code:Fi}),E=r.createRenderPipeline({label:"SsaoPipeline",layout:r.createPipelineLayout({bindGroupLayouts:[v,x]}),vertex:{module:G,entryPoint:"vs_main"},fragment:{module:G,entryPoint:"fs_ssao",targets:[{format:dt}]},primitive:{topology:"triangle-list"}}),M=r.createRenderPipeline({label:"SsaoBlurPipeline",layout:r.createPipelineLayout({bindGroupLayouts:[B]}),vertex:{module:S,entryPoint:"vs_main"},fragment:{module:S,entryPoint:"fs_blur",targets:[{format:dt}]},primitive:{topology:"triangle-list"}}),A=r.createBindGroup({label:"SsaoBG0",layout:v,entries:[{binding:0,resource:{buffer:_}}]}),R=r.createBindGroup({label:"SsaoBG1",layout:x,entries:[{binding:0,resource:t.normalMetallicView},{binding:1,resource:t.depthView},{binding:2,resource:m}]}),P=r.createBindGroup({label:"SsaoBlurBG",layout:B,entries:[{binding:0,resource:p},{binding:1,resource:w}]});return new pn(c,p,u,f,E,M,_,h,A,R,P)}updateCamera(e,t,r,i){const o=new Float32Array(48);o.set(t.data,0),o.set(r.data,16),o.set(i.data,32),e.device.queue.writeBuffer(this._uniformBuffer,0,o.buffer)}updateParams(e,t=1,r=.005,i=2){e.device.queue.writeBuffer(this._uniformBuffer,192,new Float32Array([t,r,i,0]).buffer)}execute(e,t){{const r=e.beginRenderPass({label:"SSAOPass",colorAttachments:[{view:this._rawView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._ssaoPipeline),r.setBindGroup(0,this._ssaoBG0),r.setBindGroup(1,this._ssaoBG1),r.draw(3),r.end()}{const r=e.beginRenderPass({label:"SSAOBlur",colorAttachments:[{view:this.aoView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._blurPipeline),r.setBindGroup(0,this._blurBG),r.draw(3),r.end()}}destroy(){this._raw.destroy(),this._blurred.destroy(),this._uniformBuffer.destroy(),this._noiseTex.destroy()}}const ji=`// Screen-Space Global Illumination — ray march pass.
// Cosine-weighted hemisphere rays in view space; hits sample previous frame's lit scene.

struct SSGIUniforms {
  view        : mat4x4<f32>,   // offset   0
  proj        : mat4x4<f32>,   // offset  64
  inv_proj    : mat4x4<f32>,   // offset 128
  invViewProj : mat4x4<f32>,   // offset 192
  prevViewProj: mat4x4<f32>,   // offset 256
  camPos      : vec3<f32>,     // offset 320
  numRays     : u32,           // offset 332
  numSteps    : u32,           // offset 336
  radius      : f32,           // offset 340
  thickness   : f32,           // offset 344
  strength    : f32,           // offset 348
  frameIndex  : u32,           // offset 352
}                              // stride 368 (padded to align 16)

@group(0) @binding(0) var<uniform> u: SSGIUniforms;

@group(1) @binding(0) var depth_tex    : texture_depth_2d;
@group(1) @binding(1) var normal_tex   : texture_2d<f32>;
@group(1) @binding(2) var prev_radiance: texture_2d<f32>;
@group(1) @binding(3) var noise_tex    : texture_2d<f32>;
@group(1) @binding(4) var lin_samp     : sampler;

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

fn view_pos_at(uv: vec2<f32>, depth: f32) -> vec3<f32> {
  let ndc = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);
  let h   = u.inv_proj * ndc;
  return h.xyz / h.w;
}

@fragment
fn fs_ssgi(in: VertexOutput) -> @location(0) vec4<f32> {
  let coord = vec2<i32>(in.clip_pos.xy);
  let depth = textureLoad(depth_tex, coord, 0);
  if (depth >= 1.0) { return vec4<f32>(0.0); }

  let vp = view_pos_at(in.uv, depth);

  // World normal → view space
  let nm      = textureLoad(normal_tex, coord, 0);
  let N_world = normalize(nm.rgb * 2.0 - 1.0);
  let N_vs    = normalize((u.view * vec4<f32>(N_world, 0.0)).xyz);

  // Per-pixel TBN from tiled 4×4 noise (cos/sin rotation angle in rg)
  let noise_coord = coord % vec2<i32>(4, 4);
  let noise_val   = textureLoad(noise_tex, noise_coord, 0).rg;
  let cos_a = noise_val.x * 2.0 - 1.0;
  let sin_a = noise_val.y * 2.0 - 1.0;

  var up = vec3<f32>(0.0, 1.0, 0.0);
  if (abs(N_vs.y) > 0.99) { up = vec3<f32>(1.0, 0.0, 0.0); }
  let T_raw = normalize(cross(up, N_vs));
  let B_raw = cross(N_vs, T_raw);
  // Rotate tangent frame by per-pixel noise angle
  let T = cos_a * T_raw - sin_a * B_raw;
  let B = sin_a * T_raw + cos_a * B_raw;

  let screen_dim = vec2<f32>(textureDimensions(depth_tex));
  let screen_i   = vec2<i32>(screen_dim);
  var accum = vec3<f32>(0.0);
  let nr    = f32(u.numRays);
  let ns    = f32(u.numSteps);

  for (var i = 0u; i < u.numRays; i++) {
    // Cosine-weighted hemisphere with golden-ratio temporal jitter
    let phi       = 6.28318530 * fract(f32(i) / nr + f32(u.frameIndex) * 0.618033988);
    let ur        = fract(f32(u.frameIndex * u.numRays + i) * 0.381966011);
    let cos_theta = sqrt(ur);
    let sin_theta = sqrt(max(0.0, 1.0 - cos_theta * cos_theta));
    let ray_local = vec3<f32>(sin_theta * cos(phi), sin_theta * sin(phi), cos_theta);
    let ray_vs    = T * ray_local.x + B * ray_local.y + N_vs * ray_local.z;

    for (var s = 0u; s < u.numSteps; s++) {
      let t  = (f32(s) + 1.0) / ns;
      let p  = vp + ray_vs * (u.radius * t);
      if (p.z >= 0.0) { break; } // stepped behind the camera

      let clip  = u.proj * vec4<f32>(p, 1.0);
      let inv_w = 1.0 / clip.w;
      let ray_uv = vec2<f32>(
         clip.x * inv_w * 0.5 + 0.5,
        -clip.y * inv_w * 0.5 + 0.5,
      );
      if (any(ray_uv < vec2<f32>(0.0)) || any(ray_uv > vec2<f32>(1.0))) { break; }

      // Depth at ray UV (nearest texel to avoid sampler type restrictions)
      let ray_tc       = clamp(vec2<i32>(ray_uv * screen_dim), vec2<i32>(0), screen_i - vec2<i32>(1));
      let stored_depth = textureLoad(depth_tex, ray_tc, 0);
      if (stored_depth >= 1.0) { continue; } // hit sky — keep stepping

      let stored_h = u.inv_proj * vec4<f32>(ray_uv.x * 2.0 - 1.0, 1.0 - ray_uv.y * 2.0, stored_depth, 1.0);
      let stored_z = stored_h.z / stored_h.w;

      // View-space Z is negative in front; hit when ray just passed behind surface.
      if (p.z < stored_z && stored_z - p.z < u.thickness) {
        accum += textureSampleLevel(prev_radiance, lin_samp, ray_uv, 0.0).rgb;
        break;
      }
    }
  }

  return vec4<f32>(accum * u.strength / nr, 1.0);
}
`,Yi=`// Screen-Space Global Illumination — temporal accumulation pass.
// Reprojects SSGI into previous frame, AABB-clamps, blends 10% new / 90% history.

struct SSGIUniforms {
  view        : mat4x4<f32>,
  proj        : mat4x4<f32>,
  inv_proj    : mat4x4<f32>,
  invViewProj : mat4x4<f32>,
  prevViewProj: mat4x4<f32>,
  camPos      : vec3<f32>,
  numRays     : u32,
  numSteps    : u32,
  radius      : f32,
  thickness   : f32,
  strength    : f32,
  frameIndex  : u32,
}

@group(0) @binding(0) var<uniform> u: SSGIUniforms;

@group(1) @binding(0) var raw_ssgi    : texture_2d<f32>;
@group(1) @binding(1) var ssgi_history: texture_2d<f32>;
@group(1) @binding(2) var depth_tex   : texture_depth_2d;
@group(1) @binding(3) var lin_samp    : sampler;

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

@fragment
fn fs_temporal(in: VertexOutput) -> @location(0) vec4<f32> {
  let coord   = vec2<i32>(in.clip_pos.xy);
  let current = textureLoad(raw_ssgi, coord, 0).rgb;

  // Sky pixels carry no indirect irradiance
  let depth = textureLoad(depth_tex, coord, 0);
  if (depth >= 1.0) { return vec4<f32>(0.0); }

  // Reproject to previous frame
  let ndc       = vec4<f32>(in.uv.x * 2.0 - 1.0, 1.0 - in.uv.y * 2.0, depth, 1.0);
  let world_h   = u.invViewProj * ndc;
  let world_pos = world_h.xyz / world_h.w;
  let prev_clip = u.prevViewProj * vec4<f32>(world_pos, 1.0);
  let prev_uv   = vec2<f32>(
     prev_clip.x / prev_clip.w * 0.5 + 0.5,
    -prev_clip.y / prev_clip.w * 0.5 + 0.5,
  );

  // Disocclusion or out-of-frame: trust current sample fully
  if (any(prev_uv < vec2<f32>(0.0)) || any(prev_uv > vec2<f32>(1.0))) {
    return vec4<f32>(current, 1.0);
  }

  // AABB clamp: 3×3 neighbourhood min/max of raw SSGI prevents ghosting
  let dim = vec2<i32>(textureDimensions(raw_ssgi));
  var nb_min = vec3<f32>(1e9);
  var nb_max = vec3<f32>(-1e9);
  for (var dy = -1; dy <= 1; dy++) {
    for (var dx = -1; dx <= 1; dx++) {
      let nc = clamp(coord + vec2<i32>(dx, dy), vec2<i32>(0), dim - vec2<i32>(1));
      let s  = textureLoad(raw_ssgi, nc, 0).rgb;
      nb_min = min(nb_min, s);
      nb_max = max(nb_max, s);
    }
  }

  let history         = textureSampleLevel(ssgi_history, lin_samp, prev_uv, 0.0).rgb;
  let history_clamped = clamp(history, nb_min, nb_max);

  // 10% new / 90% history → effective ~40-sample average with 4 rays/frame
  return vec4<f32>(mix(history_clamped, current, 0.1), 1.0);
}
`,or=368,Xi={numRays:4,numSteps:16,radius:3,thickness:.5,strength:1};function $i(){const d=new Uint8Array(new ArrayBuffer(64));for(let n=0;n<16;n++){const e=Math.random()*Math.PI*2;d[n*4+0]=Math.round((Math.cos(e)*.5+.5)*255),d[n*4+1]=Math.round((Math.sin(e)*.5+.5)*255),d[n*4+2]=128,d[n*4+3]=255}return d}class hn extends he{constructor(e,t,r,i,o,a,s,c,u,p,f,h,m,_,w,v){super();l(this,"name","SSGIPass");l(this,"resultView");l(this,"_uniformBuffer");l(this,"_noiseTexture");l(this,"_rawTexture");l(this,"_rawView");l(this,"_historyTexture");l(this,"_resultTexture");l(this,"_ssgiPipeline");l(this,"_temporalPipeline");l(this,"_ssgiBG0");l(this,"_ssgiBG1");l(this,"_tempBG0");l(this,"_tempBG1");l(this,"_settings");l(this,"_frameIndex",0);l(this,"_width");l(this,"_height");this._uniformBuffer=e,this._noiseTexture=t,this._rawTexture=r,this._rawView=i,this._historyTexture=o,this._resultTexture=a,this.resultView=s,this._ssgiPipeline=c,this._temporalPipeline=u,this._ssgiBG0=p,this._ssgiBG1=f,this._tempBG0=h,this._tempBG1=m,this._settings=_,this._width=w,this._height=v}static create(e,t,r,i=Xi){const{device:o,width:a,height:s}=e,c=o.createBuffer({label:"SSGIUniforms",size:or,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),u=o.createTexture({label:"SSGINoise",size:{width:4,height:4},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});o.queue.writeTexture({texture:u},$i(),{bytesPerRow:4*4,rowsPerImage:4},{width:4,height:4});const p=u.createView(),f=o.createTexture({label:"SSGIRaw",size:{width:a,height:s},format:Q,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),h=f.createView(),m=o.createTexture({label:"SSGIHistory",size:{width:a,height:s},format:Q,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),_=m.createView(),w=o.createTexture({label:"SSGIResult",size:{width:a,height:s},format:Q,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),v=w.createView(),x=o.createSampler({label:"SSGILinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),B=o.createBindGroupLayout({label:"SSGIUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),G=o.createBindGroupLayout({label:"SSGITexBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),S=o.createBindGroupLayout({label:"SSGITempTexBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),E=o.createBindGroup({label:"SSGIUniformBG",layout:B,entries:[{binding:0,resource:{buffer:c}}]}),M=o.createBindGroup({label:"SSGITexBG",layout:G,entries:[{binding:0,resource:t.depthView},{binding:1,resource:t.normalMetallicView},{binding:2,resource:r},{binding:3,resource:p},{binding:4,resource:x}]}),A=o.createBindGroup({label:"SSGITempUniformBG",layout:B,entries:[{binding:0,resource:{buffer:c}}]}),R=o.createBindGroup({label:"SSGITempTexBG",layout:S,entries:[{binding:0,resource:h},{binding:1,resource:_},{binding:2,resource:t.depthView},{binding:3,resource:x}]}),P=o.createShaderModule({label:"SSGIShader",code:ji}),b=o.createShaderModule({label:"SSGITempShader",code:Yi}),C=o.createRenderPipeline({label:"SSGIPipeline",layout:o.createPipelineLayout({bindGroupLayouts:[B,G]}),vertex:{module:P,entryPoint:"vs_main"},fragment:{module:P,entryPoint:"fs_ssgi",targets:[{format:Q}]},primitive:{topology:"triangle-list"}}),g=o.createRenderPipeline({label:"SSGITempPipeline",layout:o.createPipelineLayout({bindGroupLayouts:[B,S]}),vertex:{module:b,entryPoint:"vs_main"},fragment:{module:b,entryPoint:"fs_temporal",targets:[{format:Q}]},primitive:{topology:"triangle-list"}});return new hn(c,u,f,h,m,w,v,C,g,E,M,A,R,i,a,s)}updateCamera(e,t,r,i,o,a,s){const c=new Float32Array(or/4);c.set(t.data,0),c.set(r.data,16),c.set(i.data,32),c.set(o.data,48),c.set(a.data,64),c[80]=s.x,c[81]=s.y,c[82]=s.z;const u=new Uint32Array(c.buffer);u[83]=this._settings.numRays,u[84]=this._settings.numSteps,c[85]=this._settings.radius,c[86]=this._settings.thickness,c[87]=this._settings.strength,u[88]=this._frameIndex++,e.queue.writeBuffer(this._uniformBuffer,0,c.buffer)}updateSettings(e){this._settings={...this._settings,...e}}execute(e,t){{const r=e.beginRenderPass({label:"SSGIRayMarch",colorAttachments:[{view:this._rawView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._ssgiPipeline),r.setBindGroup(0,this._ssgiBG0),r.setBindGroup(1,this._ssgiBG1),r.draw(3),r.end()}{const r=e.beginRenderPass({label:"SSGITemporal",colorAttachments:[{view:this.resultView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._temporalPipeline),r.setBindGroup(0,this._tempBG0),r.setBindGroup(1,this._tempBG1),r.draw(3),r.end()}e.copyTextureToTexture({texture:this._resultTexture},{texture:this._historyTexture},{width:this._width,height:this._height})}destroy(){this._uniformBuffer.destroy(),this._noiseTexture.destroy(),this._rawTexture.destroy(),this._historyTexture.destroy(),this._resultTexture.destroy()}}const Ki=`// VSM shadow map generation for point and spot lights.
//
// Point light faces: output linear depth (distance/radius) and depth² into rgba16float.
// Spot light maps  : output NDC depth and depth² into rgba16float.
//
// Two pipeline pairs share identical bind group layouts:
//   group 0: ShadowUniforms (lightViewProj + lightPos + lightRadius)
//   group 1: ModelUniforms  (model matrix)

struct ShadowUniforms {
  lightViewProj: mat4x4<f32>,  // offset 0, 64 bytes
  lightPos     : vec3<f32>,    // offset 64, 12 bytes
  lightRadius  : f32,          // offset 76, 4 bytes
}  // 80 bytes

struct ModelUniforms {
  model: mat4x4<f32>,  // 64 bytes
}

@group(0) @binding(0) var<uniform> shadow: ShadowUniforms;
@group(1) @binding(0) var<uniform> model : ModelUniforms;

// ---- Point light (linear depth) -----------------------------------------------

struct PointVaryings {
  @builtin(position) clip    : vec4<f32>,
  @location(0)       worldPos: vec3<f32>,
}

@vertex
fn vs_point(@location(0) pos: vec3<f32>) -> PointVaryings {
  let worldPos = model.model * vec4<f32>(pos, 1.0);
  var out: PointVaryings;
  out.clip     = shadow.lightViewProj * worldPos;
  out.worldPos = worldPos.xyz;
  return out;
}

@fragment
fn fs_point(in: PointVaryings) -> @location(0) vec4<f32> {
  let d = length(in.worldPos - shadow.lightPos) / shadow.lightRadius;
  return vec4<f32>(d, d * d, 0.0, 1.0);
}

// ---- Spot light (NDC depth) ----------------------------------------------------

struct SpotVaryings {
  @builtin(position) clip    : vec4<f32>,
  @location(0)       ndcDepth: f32,
}

@vertex
fn vs_spot(@location(0) pos: vec3<f32>) -> SpotVaryings {
  let worldPos = model.model * vec4<f32>(pos, 1.0);
  let clip     = shadow.lightViewProj * worldPos;
  var out: SpotVaryings;
  out.clip     = clip;
  out.ndcDepth = clip.z / clip.w;
  return out;
}

@fragment
fn fs_spot(in: SpotVaryings) -> @location(0) vec4<f32> {
  let d = in.ndcDepth;
  return vec4<f32>(d, d * d, 0.0, 1.0);
}
`,ft=32,pt=32,je=4,Ve=8,ht=256,mt=512,Ae=256,zt=80,Zi=64,Qi=6*je,Ji=Qi+Ve;class mn extends he{constructor(e,t,r,i,o,a,s,c,u,p,f,h,m,_){super();l(this,"name","PointSpotShadowPass");l(this,"pointVsmView");l(this,"spotVsmView");l(this,"projTexView");l(this,"_pointVsmTex");l(this,"_spotVsmTex");l(this,"_projTexArray");l(this,"_pointDepth");l(this,"_spotDepth");l(this,"_pointFaceViews");l(this,"_spotFaceViews");l(this,"_pointDepthView");l(this,"_spotDepthView");l(this,"_pointPipeline");l(this,"_spotPipeline");l(this,"_shadowBufs");l(this,"_shadowBGs");l(this,"_modelBufs",[]);l(this,"_modelBGs",[]);l(this,"_modelBGL");l(this,"_snapshot",[]);l(this,"_pointLights",[]);l(this,"_spotLights",[]);this._pointVsmTex=e,this._spotVsmTex=t,this._projTexArray=r,this._pointDepth=i,this._spotDepth=o,this._pointFaceViews=a,this._spotFaceViews=s,this._pointDepthView=c,this._spotDepthView=u,this._pointPipeline=p,this._spotPipeline=f,this._shadowBufs=h,this._shadowBGs=m,this._modelBGL=_,this.pointVsmView=e.createView({dimension:"cube-array",arrayLayerCount:je*6}),this.spotVsmView=t.createView({dimension:"2d-array"}),this.projTexView=r.createView({dimension:"2d-array"})}static create(e){const{device:t}=e,r=t.createTexture({label:"PointVSM",size:{width:ht,height:ht,depthOrArrayLayers:je*6},format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),i=t.createTexture({label:"SpotVSM",size:{width:mt,height:mt,depthOrArrayLayers:Ve},format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),o=t.createTexture({label:"ProjTexArray",size:{width:Ae,height:Ae,depthOrArrayLayers:Ve},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),a=new Uint8Array(Ae*Ae*4).fill(255);for(let M=0;M<Ve;M++)t.queue.writeTexture({texture:o,origin:{x:0,y:0,z:M}},a,{bytesPerRow:Ae*4,rowsPerImage:Ae},{width:Ae,height:Ae,depthOrArrayLayers:1});const s=t.createTexture({label:"PointShadowDepth",size:{width:ht,height:ht},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),c=t.createTexture({label:"SpotShadowDepth",size:{width:mt,height:mt},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),u=Array.from({length:je*6},(M,A)=>r.createView({dimension:"2d",baseArrayLayer:A,arrayLayerCount:1})),p=Array.from({length:Ve},(M,A)=>i.createView({dimension:"2d",baseArrayLayer:A,arrayLayerCount:1})),f=s.createView(),h=c.createView(),m=t.createBindGroupLayout({label:"PSShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),_=t.createBindGroupLayout({label:"PSModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),w=[],v=[];for(let M=0;M<Ji;M++){const A=t.createBuffer({label:`PSShadowUniform ${M}`,size:zt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});w.push(A),v.push(t.createBindGroup({label:`PSShadowBG ${M}`,layout:m,entries:[{binding:0,resource:{buffer:A}}]}))}const x=t.createPipelineLayout({bindGroupLayouts:[m,_]}),B=t.createShaderModule({label:"PointSpotShadowShader",code:Ki}),G={module:B,buffers:[{arrayStride:Zt,attributes:[Qt[0]]}]},S=t.createRenderPipeline({label:"PointShadowPipeline",layout:x,vertex:{...G,entryPoint:"vs_point"},fragment:{module:B,entryPoint:"fs_point",targets:[{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),E=t.createRenderPipeline({label:"SpotShadowPipeline",layout:x,vertex:{...G,entryPoint:"vs_spot"},fragment:{module:B,entryPoint:"fs_spot",targets:[{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}});return new mn(r,i,o,s,c,u,p,f,h,S,E,w,v,_)}update(e,t,r){this._pointLights=e,this._spotLights=t,this._snapshot=r}setProjectionTexture(e,t,r){e.copyTextureToTexture({texture:r},{texture:this._projTexArray,origin:{x:0,y:0,z:t}},{width:Ae,height:Ae,depthOrArrayLayers:1})}execute(e,t){const{device:r}=t,i=this._snapshot;this._ensureModelBuffers(r,i.length);for(let c=0;c<this._spotLights.length&&c<Ve;c++){const u=this._spotLights[c];u.projectionTexture&&this.setProjectionTexture(e,c,u.projectionTexture)}for(let c=0;c<i.length;c++)t.queue.writeBuffer(this._modelBufs[c],0,i[c].modelMatrix.data.buffer);let o=0,a=0;for(const c of this._pointLights){if(!c.castShadow||a>=je)continue;const u=c.worldPosition(),p=c.cubeFaceViewProjs(),f=new Float32Array(zt/4);f[16]=u.x,f[17]=u.y,f[18]=u.z,f[19]=c.radius;for(let h=0;h<6;h++){f.set(p[h].data,0),t.queue.writeBuffer(this._shadowBufs[o],0,f.buffer);const m=a*6+h,_=e.beginRenderPass({label:`PointShadow light${a} face${h}`,colorAttachments:[{view:this._pointFaceViews[m],clearValue:{r:1,g:1,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._pointDepthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"discard"}});_.setPipeline(this._pointPipeline),_.setBindGroup(0,this._shadowBGs[o]),this._drawItems(_,i),_.end(),o++}a++}let s=0;for(const c of this._spotLights){if(!c.castShadow||s>=Ve)continue;const u=c.lightViewProj(),p=c.worldPosition(),f=new Float32Array(zt/4);f.set(u.data,0),f[16]=p.x,f[17]=p.y,f[18]=p.z,f[19]=c.range,t.queue.writeBuffer(this._shadowBufs[o],0,f.buffer);const h=e.beginRenderPass({label:`SpotShadow light${s}`,colorAttachments:[{view:this._spotFaceViews[s],clearValue:{r:1,g:1,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._spotDepthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"discard"}});h.setPipeline(this._spotPipeline),h.setBindGroup(0,this._shadowBGs[o]),this._drawItems(h,i),h.end(),o++,s++}}_drawItems(e,t){for(let r=0;r<t.length;r++){const{mesh:i}=t[r];e.setBindGroup(1,this._modelBGs[r]),e.setVertexBuffer(0,i.vertexBuffer),e.setIndexBuffer(i.indexBuffer,"uint32"),e.drawIndexed(i.indexCount)}}_ensureModelBuffers(e,t){for(;this._modelBufs.length<t;){const r=e.createBuffer({label:`PSModelUniform ${this._modelBufs.length}`,size:Zi,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._modelBufs.push(r),this._modelBGs.push(e.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:r}}]}))}}destroy(){this._pointVsmTex.destroy(),this._spotVsmTex.destroy(),this._projTexArray.destroy(),this._pointDepth.destroy(),this._spotDepth.destroy();for(const e of this._shadowBufs)e.destroy();for(const e of this._modelBufs)e.destroy()}}const eo=`// Water pass — forward-rendered on top of the deferred-lit HDR buffer.
// Vertex format: [x, y, z] (3 floats, chunk-local).
// Group 0: camera uniforms (matches WorldGeometryPass layout — 4 mat4 + vec3 pos + near + far)
// Group 1: per-frame water uniforms (time)
// Group 2: per-chunk offset
// Group 3: scene textures (refraction copy, depth, dudv, gradient, sky)

struct CameraUniforms {
  view        : mat4x4<f32>,
  proj        : mat4x4<f32>,
  viewProj    : mat4x4<f32>,
  invViewProj : mat4x4<f32>,
  position    : vec3<f32>,
  near        : f32,
  far         : f32,
  _pad0       : f32,
  _pad1       : f32,
  _pad2       : f32,
}

struct WaterUniforms {
  time          : f32,
  sky_intensity : f32,  // 0 at night, 1 at noon — dims the HDR sky reflection
  _p1           : f32,
  _p2           : f32,
}

struct ChunkUniforms {
  offset : vec3<f32>,
  _pad   : f32,
}

@group(0) @binding(0) var<uniform> cam   : CameraUniforms;
@group(1) @binding(0) var<uniform> water : WaterUniforms;
@group(2) @binding(0) var<uniform> chunk : ChunkUniforms;

@group(3) @binding(0) var refraction_tex : texture_2d<f32>;
@group(3) @binding(1) var depth_tex      : texture_depth_2d;
@group(3) @binding(2) var dudv_tex       : texture_2d<f32>;
@group(3) @binding(3) var gradient_tex   : texture_2d<f32>;
@group(3) @binding(4) var sky_tex        : texture_2d<f32>;
@group(3) @binding(5) var samp           : sampler;

struct VertOut {
  @builtin(position) clip_pos   : vec4<f32>,
  @location(0)       world_pos  : vec3<f32>,
  @location(1)       clip_coords: vec4<f32>,
}

const PI            : f32 = 3.14159265358979;
const WAVE_AMPLITUDE: f32 = 3.8;

fn calc_wave(world_pos: vec3<f32>) -> f32 {
  let fy   = fract(world_pos.y + 0.001);
  let wave = 0.05 * sin(2.0 * PI * (water.time * 0.8 + world_pos.x /  2.5 + world_pos.z /  5.0))
           + 0.05 * sin(2.0 * PI * (water.time * 0.6 + world_pos.x /  6.0 + world_pos.z / 12.0));
  return clamp(wave, -fy, 1.0 - fy) * WAVE_AMPLITUDE;
}

@vertex
fn vs_main(@location(0) pos: vec3<f32>) -> VertOut {
  var world_pos  = pos + chunk.offset;
  //world_pos.y   += calc_wave(world_pos);
  let clip       = cam.viewProj * vec4<f32>(world_pos, 1.0);
  var out: VertOut;
  out.clip_pos    = clip;
  out.world_pos   = world_pos;
  out.clip_coords = clip;
  return out;
}

fn linearize(d: f32, near: f32, far: f32) -> f32 {
  return near * far / (far - d * (far - near));
}

// Equirectangular sampling for the sky texture (which is stored as a 2D panorama).
fn sky_uv(d: vec3<f32>) -> vec2<f32> {
  let u = 0.5 + atan2(d.z, d.x) / (2.0 * PI);
  let v = 0.5 - asin(clamp(d.y, -1.0, 1.0)) / PI;
  return vec2<f32>(u, v);
}

// Screen-space reflection: ray-march the reflected ray in view space, sampling
// refraction_tex (the pre-water HDR copy) for radiance at each hit.
// Returns vec4(colour, confidence) — confidence fades to 0 near screen edges or on a miss.
fn ssr(world_pos: vec3<f32>, normal: vec3<f32>, view_dir: vec3<f32>) -> vec4<f32> {
  let reflect_dir = reflect(-view_dir, normal);
  // Transform reflected direction and surface origin to view space.
  let ray_vs    = normalize((cam.view * vec4<f32>(reflect_dir, 0.0)).xyz);
  let origin_vs = (cam.view * vec4<f32>(world_pos, 1.0)).xyz;

  // Only trace rays heading away from the camera (negative view-space Z).
  if (ray_vs.z >= -0.001) { return vec4<f32>(0.0); }

  let screen_dim = vec2<f32>(textureDimensions(refraction_tex));
  let screen_i   = vec2<i32>(screen_dim);

  let NUM_STEPS: u32 = 32u;
  let MAX_DIST : f32 = 50.0;  // world-unit ray length
  let THICKNESS: f32 = 1.5;   // hit tolerance in view-space units

  for (var s = 0u; s < NUM_STEPS; s++) {
    let t = (f32(s) + 1.0) * MAX_DIST / f32(NUM_STEPS);
    let p = origin_vs + ray_vs * t;
    if (p.z >= 0.0) { break; }  // stepped behind the near plane

    // Project the ray point to screen UV.
    let clip  = cam.proj * vec4<f32>(p, 1.0);
    let inv_w = 1.0 / clip.w;
    let uv    = vec2<f32>(clip.x * inv_w * 0.5 + 0.5, -clip.y * inv_w * 0.5 + 0.5);
    if (any(uv < vec2<f32>(0.0)) || any(uv > vec2<f32>(1.0))) { break; }

    // Compare ray depth against the stored GBuffer depth (converted to view-space Z).
    let tc           = clamp(vec2<i32>(uv * screen_dim), vec2<i32>(0), screen_i - vec2<i32>(1));
    let stored_depth = textureLoad(depth_tex, tc, 0);
    if (stored_depth >= 1.0) { continue; }  // sky pixel — keep stepping

    let stored_z = -linearize(stored_depth, cam.near, cam.far);  // view-space Z (negative)
    if (p.z < stored_z && stored_z - p.z < THICKNESS) {
      // Fade confidence near screen edges to hide ray-termination seams.
      let edge = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y)) * 8.0;
      let conf = clamp(edge, 0.0, 1.0);
      let sample_uv = clamp(uv, vec2<f32>(0.001), vec2<f32>(0.999));
      return vec4<f32>(textureSampleLevel(refraction_tex, samp, sample_uv, 0.0).rgb, conf);
    }
  }
  return vec4<f32>(0.0);  // miss
}

@fragment
fn fs_main(in: VertOut) -> @location(0) vec4<f32> {
  if (in.clip_coords.w < cam.near) { discard; }

  // Screen UV from clip coordinates
  let ndc       = in.clip_coords.xy / in.clip_coords.w;
  let screen_uv = vec2<f32>(ndc.x * 0.5 + 0.5, ndc.y * -0.5 + 0.5);

  // Manual depth test: discard water behind solid geometry
  let px        = vec2<u32>(in.clip_pos.xy);
  let floor_lin = linearize(textureLoad(depth_tex, px, 0), cam.near, cam.far);
  let water_lin = linearize(in.clip_pos.z, cam.near, cam.far);
  if (water_lin > floor_lin) { discard; }
  let water_depth = floor_lin - water_lin;

  // Animated DUDV distortion — two-pass stacked sampling for complex ripples
  let base_uv    = vec2<f32>(in.world_pos.x, in.world_pos.z) * (1.0 / 8.0);
  let d1         = textureSample(dudv_tex, samp, vec2<f32>(base_uv.x + water.time * 0.02, base_uv.y)).rg;
  let d2_uv      = d1 + vec2<f32>(d1.x, d1.y + water.time * 0.02);
  let distortion = (textureSample(dudv_tex, samp, d2_uv).rg * 2.0 - 1.0) * 0.02;

  // Refraction: sample the pre-water HDR copy at distorted screen coords
  let ref_uv    = clamp(screen_uv + distortion, vec2<f32>(0.001), vec2<f32>(0.999));
  let refraction = textureSample(refraction_tex, samp, ref_uv).rgb;

  // Water surface normal from DUDV map
  let nc     = textureSample(dudv_tex, samp, d2_uv).rgb;
  let normal = normalize(vec3<f32>(nc.r * 2.0 - 1.0, 3.0, nc.g * 2.0 - 1.0));

  let view_dir = normalize(cam.position - in.world_pos);

  // Schlick Fresnel for water (F0 ≈ 0.02): low reflection when looking straight down,
  // rising towards grazing. Capped at 0.6 so bright HDR sky values cannot saturate to
  // white when viewing water at a shallow angle from far away.
  let VdotN     = clamp(dot(view_dir, normal), 0.0, 1.0);
  let fresnel_r = min(0.02 + 0.98 * pow(1.0 - VdotN, 5.0), 0.6);

  // Screen-space reflection, with the equirectangular sky as fallback for missed rays.
  let ssr_result = ssr(in.world_pos, normal, view_dir);
  let sky_color  = textureSample(sky_tex, samp, sky_uv(reflect(-view_dir, normal))).rgb * water.sky_intensity;
  let reflection = mix(sky_color, ssr_result.rgb, ssr_result.a);

  // Depth-based water tint via gradient map, with murkiness blend (Litecraft approach).
  // Shallow water is transparent refraction; deep water takes the gradient map colour.
  const MURKY_DEPTH: f32 = 4.0;
  let murk_factor = clamp(water_depth / MURKY_DEPTH, 0.0, 1.0);
  let inv_depth   = clamp(1.0 - murk_factor, 0.1, 0.99);
  let water_color = textureSample(gradient_tex, samp, vec2<f32>(inv_depth, 0.5)).rgb
                    * max(water.sky_intensity, 0.05);
  let tinted      = mix(refraction, water_color, murk_factor);

  // Fresnel blend: refraction dominant head-on, SSR reflection rises at grazing angles.
  let world_color = mix(tinted, reflection, fresnel_r);

  // Alpha: transparent at edges/shallow, opaque in deep water (Litecraft smoothstep approach).
  let depth_clamp = clamp(1.0 / max(water_depth, 0.001), 0.0, 1.0);
  let edge_alpha  = clamp(smoothstep(1.0, 0.0, depth_clamp), 0.0, 0.95);

  return vec4<f32>(world_color, edge_alpha);
}
`,ar=64*4+16+16,to=16,no=16,ro=3,Ft=ro*4,Ht=16;class Fe extends he{constructor(e,t,r,i,o,a,s,c,u,p,f,h,m,_,w){super();l(this,"name","WaterPass");l(this,"_device");l(this,"_hdrTexture");l(this,"_hdrView");l(this,"_refractionTex");l(this,"_pipeline");l(this,"_cameraBuffer");l(this,"_waterBuffer");l(this,"_cameraBG");l(this,"_waterBG");l(this,"_sceneBG");l(this,"_sceneBGL");l(this,"_chunkBGL");l(this,"_skyTexture");l(this,"_dudvTexture");l(this,"_gradientTexture");l(this,"_chunks",new Map);l(this,"_frustumPlanes",new Float32Array(24));this._device=e,this._hdrTexture=t,this._hdrView=r,this._refractionTex=i,this._pipeline=o,this._cameraBuffer=a,this._waterBuffer=s,this._cameraBG=c,this._waterBG=u,this._sceneBG=p,this._sceneBGL=f,this._chunkBGL=h,this._skyTexture=m,this._dudvTexture=_,this._gradientTexture=w}static create(e,t,r,i,o,a,s){const{device:c,width:u,height:p}=e,f=c.createBindGroupLayout({label:"WaterCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),h=c.createBindGroupLayout({label:"WaterUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),m=c.createBindGroupLayout({label:"WaterChunkBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),_=c.createBindGroupLayout({label:"WaterSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:5,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),{refractionTex:w,refractionView:v}=Fe._makeRefractionTex(c,u,p),x=c.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"}),B=c.createBuffer({label:"WaterCameraBuffer",size:ar,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),G=c.createBuffer({label:"WaterUniformBuffer",size:to,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),S=c.createBindGroup({label:"WaterCameraBG",layout:f,entries:[{binding:0,resource:{buffer:B}}]}),E=c.createBindGroup({label:"WaterUniformBG",layout:h,entries:[{binding:0,resource:{buffer:G}}]}),M=Fe._makeSceneBG(c,_,v,i,a,s,o,x),A=c.createShaderModule({label:"WaterShader",code:eo}),R=c.createPipelineLayout({bindGroupLayouts:[f,h,m,_]}),P={arrayStride:Ft,attributes:[{shaderLocation:0,offset:0,format:"float32x3"}]},b=c.createRenderPipeline({label:"WaterPipeline",layout:R,vertex:{module:A,entryPoint:"vs_main",buffers:[P]},fragment:{module:A,entryPoint:"fs_main",targets:[{format:Q,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},primitive:{topology:"triangle-list",cullMode:"none"}});return new Fe(c,t,r,w,b,B,G,S,E,M,_,m,o,a,s)}updateRenderTargets(e,t,r,i){this._refractionTex.destroy(),this._hdrTexture=e,this._hdrView=t,i&&(this._skyTexture=i);const{width:o,height:a}=e,{refractionTex:s,refractionView:c}=Fe._makeRefractionTex(this._device,o,a);this._refractionTex=s;const u=this._device.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"});this._sceneBG=Fe._makeSceneBG(this._device,this._sceneBGL,c,r,this._dudvTexture,this._gradientTexture,this._skyTexture,u)}updateCamera(e,t,r,i,o,a,s,c){const u=new Float32Array(ar/4);u.set(t.data,0),u.set(r.data,16),u.set(i.data,32),u.set(o.data,48),u[64]=a.x,u[65]=a.y,u[66]=a.z,u[67]=s,u[68]=c,e.queue.writeBuffer(this._cameraBuffer,0,u.buffer),this._extractFrustumPlanes(i.data)}_extractFrustumPlanes(e){const t=this._frustumPlanes;t[0]=e[3]+e[0],t[1]=e[7]+e[4],t[2]=e[11]+e[8],t[3]=e[15]+e[12],t[4]=e[3]-e[0],t[5]=e[7]-e[4],t[6]=e[11]-e[8],t[7]=e[15]-e[12],t[8]=e[3]+e[1],t[9]=e[7]+e[5],t[10]=e[11]+e[9],t[11]=e[15]+e[13],t[12]=e[3]-e[1],t[13]=e[7]-e[5],t[14]=e[11]-e[9],t[15]=e[15]-e[13],t[16]=e[2],t[17]=e[6],t[18]=e[10],t[19]=e[14],t[20]=e[3]-e[2],t[21]=e[7]-e[6],t[22]=e[11]-e[10],t[23]=e[15]-e[14]}_isVisible(e,t,r){const i=this._frustumPlanes,o=e+Ht,a=t+Ht,s=r+Ht;for(let c=0;c<6;c++){const u=i[c*4],p=i[c*4+1],f=i[c*4+2],h=i[c*4+3];if(u*(u>=0?o:e)+p*(p>=0?a:t)+f*(f>=0?s:r)+h<0)return!1}return!0}updateTime(e,t,r=1){e.queue.writeBuffer(this._waterBuffer,0,new Float32Array([t,r,0,0]).buffer)}addChunk(e,t){const r=this._chunks.get(e);r?this._replaceMeshBuffer(r,t):this._chunks.set(e,this._createChunkGpu(e,t))}updateChunk(e,t){const r=this._chunks.get(e);r?this._replaceMeshBuffer(r,t):this._chunks.set(e,this._createChunkGpu(e,t))}removeChunk(e){var r;const t=this._chunks.get(e);t&&((r=t.buffer)==null||r.destroy(),t.uniformBuffer.destroy(),this._chunks.delete(e))}execute(e,t){const{width:r,height:i}=this._refractionTex;e.copyTextureToTexture({texture:this._hdrTexture},{texture:this._refractionTex},{width:r,height:i,depthOrArrayLayers:1});const o=e.beginRenderPass({label:"WaterPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}]});o.setPipeline(this._pipeline),o.setBindGroup(0,this._cameraBG),o.setBindGroup(1,this._waterBG),o.setBindGroup(3,this._sceneBG);for(const a of this._chunks.values())!a.buffer||a.vertexCount===0||this._isVisible(a.ox,a.oy,a.oz)&&(o.setBindGroup(2,a.chunkBG),o.setVertexBuffer(0,a.buffer),o.draw(a.vertexCount));o.end()}destroy(){var e;this._cameraBuffer.destroy(),this._waterBuffer.destroy(),this._refractionTex.destroy();for(const t of this._chunks.values())(e=t.buffer)==null||e.destroy(),t.uniformBuffer.destroy();this._chunks.clear()}static _makeRefractionTex(e,t,r){const i=e.createTexture({label:"WaterRefractionTex",size:{width:t,height:r},format:Q,usage:GPUTextureUsage.COPY_DST|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT}),o=i.createView();return{refractionTex:i,refractionView:o}}static _makeSceneBG(e,t,r,i,o,a,s,c){return e.createBindGroup({label:"WaterSceneBG",layout:t,entries:[{binding:0,resource:r},{binding:1,resource:i},{binding:2,resource:o.view},{binding:3,resource:a.view},{binding:4,resource:s.view},{binding:5,resource:c}]})}_createChunkGpu(e,t){const r=this._device.createBuffer({label:`WaterChunkBuf(${e.globalPosition.x},${e.globalPosition.y},${e.globalPosition.z})`,size:no,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(r,0,new Float32Array([e.globalPosition.x,e.globalPosition.y,e.globalPosition.z,0]));const i=this._device.createBindGroup({label:"WaterChunkBG",layout:this._chunkBGL,entries:[{binding:0,resource:{buffer:r}}]}),o={ox:e.globalPosition.x,oy:e.globalPosition.y,oz:e.globalPosition.z,buffer:null,vertexCount:0,uniformBuffer:r,chunkBG:i};return this._replaceMeshBuffer(o,t),o}_replaceMeshBuffer(e,t){var r;if((r=e.buffer)==null||r.destroy(),e.buffer=null,e.vertexCount=t.waterCount,t.waterCount>0){const i=this._device.createBuffer({label:"WaterVertexBuf",size:t.waterCount*Ft,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(i,0,t.water.buffer,0,t.waterCount*Ft),e.buffer=i}}}const io=`// Shadow pass for transparent chunk geometry — samples color atlas alpha for discard.
// Opaque chunks use the simpler shadow.wgsl (no fragment shader needed).

struct ShadowUniforms {
  lightViewProj: mat4x4<f32>,
}
struct ModelUniforms {
  model: mat4x4<f32>,
}
struct BlockData {
  sideTile  : u32,
  bottomTile: u32,
  topTile   : u32,
  _pad      : u32,
}

@group(0) @binding(0) var<uniform>       shadow    : ShadowUniforms;
@group(1) @binding(0) var<uniform>       model     : ModelUniforms;
@group(2) @binding(0) var                color_atlas: texture_2d<f32>;
@group(2) @binding(1) var                atlas_samp : sampler;
@group(2) @binding(2) var<storage, read> block_data : array<BlockData>;

const ATLAS_COLS: u32 = 25u;
const INV_COLS  : f32 = 1.0 / 25.0;
const INV_ROWS  : f32 = 1.0 / 25.0;

struct VertexInput {
  @location(0) position  : vec3<f32>,
  @location(1) face      : f32,
  @location(2) block_type: f32,
}

struct VertexOutput {
  @builtin(position)              clip_pos : vec4<f32>,
  @location(0)                    world_pos: vec3<f32>,
  @location(1) @interpolate(flat) face_f   : f32,
  @location(2) @interpolate(flat) block_f  : f32,
}

@vertex
fn vs_main(vin: VertexInput) -> VertexOutput {
  let wp = (model.model * vec4<f32>(vin.position, 1.0)).xyz;
  var out: VertexOutput;
  out.clip_pos  = shadow.lightViewProj * vec4<f32>(wp, 1.0);
  out.world_pos = wp;
  out.face_f    = vin.face;
  out.block_f   = vin.block_type;
  return out;
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

@fragment
fn fs_alpha_test(in: VertexOutput) {
  let uv = atlas_uv(in.world_pos, u32(in.face_f), u32(in.block_f));
  if textureSample(color_atlas, atlas_samp, uv).a < 0.5 { discard; }
}
`,oo=`// Shadow pass for prop billboards (flowers, grass, torches, etc.).
// Expands each 6-vertex centre-point into a 1×1 quad using a right-axis supplied
// via a per-call orient uniform.  Called twice per chunk — once with right=(1,0,0)
// and once with right=(0,0,1) — to produce a cross-shaped shadow.

struct ShadowUniforms { lightViewProj: mat4x4<f32> }
struct ModelUniforms  { model: mat4x4<f32> }
struct OrientUniforms { right: vec3<f32>, _pad: f32 }

struct BlockData {
  sideTile  : u32,
  bottomTile: u32,
  topTile   : u32,
  _pad      : u32,
}

@group(0) @binding(0) var<uniform>       shadow     : ShadowUniforms;
@group(1) @binding(0) var<uniform>       model      : ModelUniforms;
@group(2) @binding(0) var                color_atlas: texture_2d<f32>;
@group(2) @binding(1) var                atlas_samp : sampler;
@group(2) @binding(2) var<storage, read> block_data : array<BlockData>;
@group(3) @binding(0) var<uniform>       orient     : OrientUniforms;

const ATLAS_COLS: u32 = 25u;
const INV_COLS  : f32 = 1.0 / 25.0;
const INV_ROWS  : f32 = 1.0 / 25.0;

struct VertexInput {
  @location(0) position  : vec3<f32>,
  @location(1) face      : f32,
  @location(2) block_type: f32,
}

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
  @location(0)       uv     : vec2<f32>,
  @location(1)       block_f: f32,
}

fn quad_offset(vid: u32) -> vec2<f32> {
  switch vid % 6u {
    case 0u: { return vec2<f32>(-0.5, -0.5); }
    case 1u: { return vec2<f32>( 0.5, -0.5); }
    case 2u: { return vec2<f32>(-0.5,  0.5); }
    case 3u: { return vec2<f32>( 0.5, -0.5); }
    case 4u: { return vec2<f32>( 0.5,  0.5); }
    default: { return vec2<f32>(-0.5,  0.5); }
  }
}

fn quad_uv(vid: u32) -> vec2<f32> {
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
fn vs_main(vin: VertexInput, @builtin(vertex_index) vid: u32) -> VertexOutput {
  let center = (model.model * vec4<f32>(vin.position, 1.0)).xyz;
  let up  = vec3<f32>(0.0, 1.0, 0.0);
  let off = quad_offset(vid);
  let wp  = center + orient.right * off.x + up * off.y;
  var out: VertexOutput;
  out.clip_pos = shadow.lightViewProj * vec4<f32>(wp, 1.0);
  out.uv       = quad_uv(vid);
  out.block_f  = vin.block_type;
  return out;
}

@fragment
fn fs_alpha_test(in: VertexOutput) {
  let tile  = block_data[u32(in.block_f)].sideTile;
  let tileX = f32(tile % ATLAS_COLS);
  let tileY = f32(tile / ATLAS_COLS);
  let uv    = (vec2<f32>(tileX, tileY) + in.uv) * vec2<f32>(INV_COLS, INV_ROWS);
  if textureSample(color_atlas, atlas_samp, uv).a < 0.5 { discard; }
}
`,ao=4,Ee=5*4;class _n extends he{constructor(e,t,r,i,o,a,s,c,u,p,f){super();l(this,"name","WorldShadowPass");l(this,"shadowChunkRadius",4);l(this,"_camX",0);l(this,"_camZ",0);l(this,"_device");l(this,"_shadowMapArrayViews");l(this,"_pipeline");l(this,"_transparentPipeline");l(this,"_propPipeline");l(this,"_cascadeBGs");l(this,"_cascadeBuffers");l(this,"_modelBGL");l(this,"_atlasBG");l(this,"_orientBG_X");l(this,"_orientBG_Z");l(this,"_chunks",new Map);l(this,"_cascades",[]);this._device=e,this._shadowMapArrayViews=t,this._pipeline=r,this._transparentPipeline=i,this._propPipeline=o,this._cascadeBGs=a,this._cascadeBuffers=s,this._modelBGL=c,this._atlasBG=u,this._orientBG_X=p,this._orientBG_Z=f}static create(e,t,r,i){const{device:o}=e,a=o.createBindGroupLayout({label:"WorldShadowCascadeBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),s=o.createBindGroupLayout({label:"WorldShadowModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),c=o.createBindGroupLayout({label:"WorldShadowAtlasBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),u=[],p=[];for(let y=0;y<Math.min(r,ao);y++){const U=o.createBuffer({label:`WorldShadowCascadeBuf${y}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});u.push(U),p.push(o.createBindGroup({label:`WorldShadowCascadeBG${y}`,layout:a,entries:[{binding:0,resource:{buffer:U}}]}))}const f=L.MAX,h=o.createBuffer({label:"WorldShadowBlockDataBuf",size:Math.max(f*16,16),usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),m=Cr,_=new Uint32Array(f*4);for(let y=0;y<f;y++){const U=At[y];U&&(_[y*4+0]=U.sideFace.y*m+U.sideFace.x,_[y*4+1]=U.bottomFace.y*m+U.bottomFace.x,_[y*4+2]=U.topFace.y*m+U.topFace.x)}o.queue.writeBuffer(h,0,_);const w=o.createSampler({label:"WorldShadowAtlasSampler",magFilter:"nearest",minFilter:"nearest"}),v=o.createBindGroup({label:"WorldShadowAtlasBG",layout:c,entries:[{binding:0,resource:i.colorAtlas.view},{binding:1,resource:w},{binding:2,resource:{buffer:h}}]}),x=o.createShaderModule({label:"WorldShadowShader",code:Lr}),B=o.createPipelineLayout({bindGroupLayouts:[a,s]}),G=o.createRenderPipeline({label:"WorldShadowPipeline",layout:B,vertex:{module:x,entryPoint:"vs_main",buffers:[{arrayStride:Ee,attributes:[{shaderLocation:0,offset:0,format:"float32x3"}]}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}}),S=o.createShaderModule({label:"WorldShadowTranspShader",code:io}),E=o.createPipelineLayout({bindGroupLayouts:[a,s,c]}),M=o.createRenderPipeline({label:"WorldShadowTransparentPipeline",layout:E,vertex:{module:S,entryPoint:"vs_main",buffers:[{arrayStride:Ee,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32"},{shaderLocation:2,offset:16,format:"float32"}]}]},fragment:{module:S,entryPoint:"fs_alpha_test",targets:[]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}}),A=o.createBindGroupLayout({label:"WorldShadowOrientBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),R=(y,U,N,V)=>{const z=o.createBuffer({label:y,size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return o.queue.writeBuffer(z,0,new Float32Array([U,N,V,0])),o.createBindGroup({label:y,layout:A,entries:[{binding:0,resource:{buffer:z}}]})},P=R("PropShadowOrientBG_X",1,0,0),b=R("PropShadowOrientBG_Z",0,0,1),C=o.createShaderModule({label:"WorldShadowPropShader",code:oo}),g=o.createPipelineLayout({bindGroupLayouts:[a,s,c,A]}),T=o.createRenderPipeline({label:"WorldShadowPropPipeline",layout:g,vertex:{module:C,entryPoint:"vs_main",buffers:[{arrayStride:Ee,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32"},{shaderLocation:2,offset:16,format:"float32"}]}]},fragment:{module:C,entryPoint:"fs_alpha_test",targets:[]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}});return new _n(o,t,G,M,T,p,u,s,v,P,b)}update(e,t,r,i){this._cascades=t,this._camX=r,this._camZ=i;const o=Math.min(t.length,this._cascadeBuffers.length);for(let a=0;a<o;a++)e.queue.writeBuffer(this._cascadeBuffers[a],0,t[a].lightViewProj.data.buffer)}addChunk(e,t){const r=this._chunks.get(e);r?this._replaceMeshBuffer(r,t):this._chunks.set(e,this._createChunkGpu(e,t))}updateChunk(e,t){const r=this._chunks.get(e);r?this._replaceMeshBuffer(r,t):this._chunks.set(e,this._createChunkGpu(e,t))}removeChunk(e){var r,i,o;const t=this._chunks.get(e);t&&((r=t.opaqueBuffer)==null||r.destroy(),(i=t.transparentBuffer)==null||i.destroy(),(o=t.propBuffer)==null||o.destroy(),t.modelBuffer.destroy(),this._chunks.delete(e))}execute(e,t){const r=Math.min(this._cascades.length,this._cascadeBuffers.length);for(let i=0;i<r;i++){const o=e.beginRenderPass({label:`WorldShadowPass cascade ${i}`,colorAttachments:[],depthStencilAttachment:{view:this._shadowMapArrayViews[i],depthLoadOp:"load",depthStoreOp:"store"}});o.setBindGroup(0,this._cascadeBGs[i]);const a=this.shadowChunkRadius*16,s=a*a;o.setPipeline(this._pipeline);for(const c of this._chunks.values()){if(!c.opaqueBuffer||c.opaqueCount===0)continue;const u=c.ox-this._camX,p=c.oz-this._camZ;u*u+p*p>s||(o.setBindGroup(1,c.modelBG),o.setVertexBuffer(0,c.opaqueBuffer),o.draw(c.opaqueCount))}o.setPipeline(this._transparentPipeline),o.setBindGroup(2,this._atlasBG);for(const c of this._chunks.values()){if(!c.transparentBuffer||c.transparentCount===0)continue;const u=c.ox-this._camX,p=c.oz-this._camZ;u*u+p*p>s||(o.setBindGroup(1,c.modelBG),o.setVertexBuffer(0,c.transparentBuffer),o.draw(c.transparentCount))}o.setPipeline(this._propPipeline),o.setBindGroup(2,this._atlasBG);for(const c of[this._orientBG_X,this._orientBG_Z]){o.setBindGroup(3,c);for(const u of this._chunks.values()){if(!u.propBuffer||u.propCount===0)continue;const p=u.ox-this._camX,f=u.oz-this._camZ;p*p+f*f>s||(o.setBindGroup(1,u.modelBG),o.setVertexBuffer(0,u.propBuffer),o.draw(u.propCount))}}o.end()}}destroy(){var e,t,r;for(const i of this._cascadeBuffers)i.destroy();for(const i of this._chunks.values())(e=i.opaqueBuffer)==null||e.destroy(),(t=i.transparentBuffer)==null||t.destroy(),(r=i.propBuffer)==null||r.destroy(),i.modelBuffer.destroy();this._chunks.clear()}_createChunkGpu(e,t){const r=e.globalPosition,i=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,r.x,r.y,r.z,1]),o=this._device.createBuffer({label:"WorldShadowModelBuf",size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(o,0,i.buffer);const a=this._device.createBindGroup({label:"WorldShadowModelBG",layout:this._modelBGL,entries:[{binding:0,resource:{buffer:o}}]}),s={ox:r.x,oz:r.z,opaqueBuffer:null,opaqueCount:0,transparentBuffer:null,transparentCount:0,propBuffer:null,propCount:0,modelBuffer:o,modelBG:a};return this._replaceMeshBuffer(s,t),s}_replaceMeshBuffer(e,t){var r,i,o;if((r=e.opaqueBuffer)==null||r.destroy(),e.opaqueBuffer=null,e.opaqueCount=t.opaqueCount,t.opaqueCount>0){const a=this._device.createBuffer({label:"WorldShadowOpaqueBuf",size:t.opaqueCount*Ee,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.opaque.buffer,0,t.opaqueCount*Ee),e.opaqueBuffer=a}if((i=e.transparentBuffer)==null||i.destroy(),e.transparentBuffer=null,e.transparentCount=t.transparentCount,t.transparentCount>0){const a=this._device.createBuffer({label:"WorldShadowTransparentBuf",size:t.transparentCount*Ee,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.transparent.buffer,0,t.transparentCount*Ee),e.transparentBuffer=a}if((o=e.propBuffer)==null||o.destroy(),e.propBuffer=null,e.propCount=t.propCount,t.propCount>0){const a=this._device.createBuffer({label:"WorldShadowPropBuf",size:t.propCount*Ee,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.prop.buffer,0,t.propCount*Ee),e.propBuffer=a}}}const so=`// Additive deferred pass for point and spot lights.
// Runs after LightingPass (which handles directional + IBL) with loadOp:'load'
// and srcFactor:'one' dstFactor:'one' so results accumulate on the HDR texture.

const PI: f32 = 3.14159265358979323846;

// ---- Camera (same layout as lighting.wgsl, 288 bytes) -------------------------

struct CameraUniforms {
  view       : mat4x4<f32>,
  proj       : mat4x4<f32>,
  viewProj   : mat4x4<f32>,
  invViewProj: mat4x4<f32>,
  position   : vec3<f32>,
  near       : f32,
  far        : f32,
}

// ---- Light data ---------------------------------------------------------------

struct LightCounts {
  numPoint: u32,
  numSpot : u32,
}

// 48 bytes — must match TypeScript packing in updateLights()
struct PointLightGpu {
  position : vec3<f32>,   // offset 0
  radius   : f32,         // offset 12
  color    : vec3<f32>,   // offset 16
  intensity: f32,         // offset 28
  shadowIdx: i32,         // offset 32  — negative means no shadow
  _pad0    : i32,
  _pad1    : i32,
  _pad2    : i32,
}

// 128 bytes — must match TypeScript packing in updateLights()
struct SpotLightGpu {
  position  : vec3<f32>,    // offset 0
  range     : f32,          // offset 12
  direction : vec3<f32>,    // offset 16
  innerCos  : f32,          // offset 28
  color     : vec3<f32>,    // offset 32
  outerCos  : f32,          // offset 44
  intensity : f32,          // offset 48
  shadowIdx : i32,          // offset 52
  projTexIdx: i32,          // offset 56
  _pad      : f32,          // offset 60
  lightViewProj: mat4x4<f32>, // offset 64
}

@group(0) @binding(0) var<uniform>       camera     : CameraUniforms;
@group(2) @binding(0) var<uniform>       lightCounts: LightCounts;
@group(2) @binding(1) var<storage, read> pointLights: array<PointLightGpu>;
@group(2) @binding(2) var<storage, read> spotLights : array<SpotLightGpu>;

// ---- GBuffer -----------------------------------------------------------------

@group(1) @binding(0) var albedoRoughnessTex: texture_2d<f32>;
@group(1) @binding(1) var normalMetallicTex : texture_2d<f32>;
@group(1) @binding(2) var depthTex          : texture_depth_2d;
@group(1) @binding(3) var gbufferSampler    : sampler;

// ---- Shadow maps + projection textures ----------------------------------------

@group(3) @binding(0) var vsm_point   : texture_cube_array<f32>;
@group(3) @binding(1) var vsm_spot    : texture_2d_array<f32>;
@group(3) @binding(2) var proj_tex    : texture_2d_array<f32>;
@group(3) @binding(3) var vsm_sampler : sampler;
@group(3) @binding(4) var proj_sampler: sampler;

// ---- Vertex ------------------------------------------------------------------

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

// ---- Helpers -----------------------------------------------------------------

fn reconstruct_world_pos(uv: vec2<f32>, depth: f32) -> vec3<f32> {
  let ndc    = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, depth, 1.0);
  let world_h = camera.invViewProj * ndc;
  return world_h.xyz / world_h.w;
}

// Variance shadow map: Chebyshev upper bound
fn vsm_shadow(moments: vec2<f32>, compare: f32) -> f32 {
  if (compare <= moments.x + 0.001) { return 1.0; }
  let variance = max(moments.y - moments.x * moments.x, 1e-5);
  let d = compare - moments.x;
  return variance / (variance + d * d);
}

// Epic-style inverse-square attenuation with smooth radius falloff
fn point_attenuation(dist: f32, radius: f32) -> f32 {
  let r = dist / radius;
  return pow(saturate(1.0 - r * r * r * r), 2.0) / max(dist * dist, 0.0001);
}

// ---- BRDF (same as lighting.wgsl) --------------------------------------------

fn distribution_ggx(NdotH: f32, roughness: f32) -> f32 {
  let a  = roughness * roughness;
  let a2 = a * a;
  let d  = NdotH * NdotH * (a2 - 1.0) + 1.0;
  return a2 / (PI * d * d);
}

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

fn cook_torrance(NdotV: f32, NdotL: f32, NdotH: f32, VdotH: f32, roughness: f32, F0: vec3<f32>, albedo: vec3<f32>, metallic: f32) -> vec3<f32> {
  let D  = distribution_ggx(NdotH, roughness);
  let G  = smith_direct(NdotV, NdotL, roughness);
  let Fd = fresnel_schlick(VdotH, F0);
  let kD = (vec3<f32>(1.0) - Fd) * (1.0 - metallic);
  let specular = D * G * Fd / max(4.0 * NdotV * NdotL, 0.001);
  let diffuse  = kD * albedo / PI;
  return diffuse + specular;
}

// ---- Fragment ----------------------------------------------------------------

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let coord = vec2<i32>(in.clip_pos.xy);
  let depth = textureLoad(depthTex, coord, 0);
  if (depth >= 1.0) { discard; }  // sky — directional pass handles it

  let albedo_rough = textureLoad(albedoRoughnessTex, coord, 0);
  let normal_metal = textureLoad(normalMetallicTex,  coord, 0);

  let albedo    = albedo_rough.rgb;
  let roughness = max(albedo_rough.a, 0.04);
  let N         = normalize(normal_metal.rgb * 2.0 - 1.0);
  let metallic  = normal_metal.a;

  let world_pos = reconstruct_world_pos(in.uv, depth);
  let V         = normalize(camera.position - world_pos);
  let NdotV     = max(dot(N, V), 0.001);
  let F0        = mix(vec3<f32>(0.04), albedo, metallic);

  var accum = vec3<f32>(0.0);

  // ---- Point lights ----------------------------------------------------------
  for (var i = 0u; i < lightCounts.numPoint; i++) {
    let pl   = pointLights[i];
    let diff = pl.position - world_pos;
    let dist = length(diff);
    if (dist >= pl.radius) { continue; }

    let L     = diff / dist;
    let NdotL = max(dot(N, L), 0.0);
    if (NdotL <= 0.0) { continue; }

    let H     = normalize(L + V);
    let NdotH = max(dot(N, H), 0.0);
    let VdotH = max(dot(V, H), 0.0);

    let brdf = cook_torrance(NdotV, NdotL, NdotH, VdotH, roughness, F0, albedo, metallic);
    let att  = point_attenuation(dist, pl.radius);

    // VSM cube-array shadow
    var shad = 1.0;
    if (pl.shadowIdx >= 0) {
      let dir     = -normalize(diff);  // from light toward surface
      let compare = dist / pl.radius;
      let moments = textureSampleLevel(vsm_point, vsm_sampler, dir, pl.shadowIdx, 0.0).rg;
      shad = vsm_shadow(moments, compare);
    }

    accum += brdf * pl.color * pl.intensity * NdotL * att * shad;
  }

  // ---- Spot lights -----------------------------------------------------------
  for (var i = 0u; i < lightCounts.numSpot; i++) {
    let sl   = spotLights[i];
    let diff = sl.position - world_pos;
    let dist = length(diff);
    if (dist >= sl.range) { continue; }

    let L        = diff / dist;
    let NdotL    = max(dot(N, L), 0.0);
    if (NdotL <= 0.0) { continue; }

    // Spot cone attenuation
    let cos_angle = dot(-L, sl.direction);
    if (cos_angle <= sl.outerCos) { continue; }
    let cone = smoothstep(sl.outerCos, sl.innerCos, cos_angle);

    let H     = normalize(L + V);
    let NdotH = max(dot(N, H), 0.0);
    let VdotH = max(dot(V, H), 0.0);

    let brdf = cook_torrance(NdotV, NdotL, NdotH, VdotH, roughness, F0, albedo, metallic);
    let att  = point_attenuation(dist, sl.range);

    // VSM + projection texture (computed from light-space coords)
    var modulator = vec3<f32>(1.0);
    if (sl.shadowIdx >= 0 || sl.projTexIdx >= 0) {
      let ls     = sl.lightViewProj * vec4<f32>(world_pos, 1.0);
      let sc     = ls.xyz / ls.w;
      let uv     = vec2<f32>(sc.x * 0.5 + 0.5, -sc.y * 0.5 + 0.5);
      let in_frustum = all(uv >= vec2<f32>(0.0)) && all(uv <= vec2<f32>(1.0)) && sc.z >= 0.0 && sc.z <= 1.0;

      if (in_frustum) {
        if (sl.shadowIdx >= 0) {
          let moments = textureSampleLevel(vsm_spot, vsm_sampler, uv, sl.shadowIdx, 0.0).rg;
          modulator *= vec3<f32>(vsm_shadow(moments, sc.z));
        }
        if (sl.projTexIdx >= 0) {
          modulator *= textureSampleLevel(proj_tex, proj_sampler, uv, sl.projTexIdx, 0.0).rgb;
        }
      } else {
        modulator = vec3<f32>(0.0);  // outside frustum → no contribution
      }
    }

    accum += brdf * sl.color * sl.intensity * NdotL * att * cone * modulator;
  }

  return vec4<f32>(accum, 0.0);
}
`,sr=64*4+16+16,lo=8,lr=48,cr=128;class gn extends he{constructor(e,t,r,i,o,a,s,c,u,p){super();l(this,"name","PointSpotLightPass");l(this,"_pipeline");l(this,"_cameraBG");l(this,"_gbufferBG");l(this,"_lightBG");l(this,"_shadowBG");l(this,"_cameraBuffer");l(this,"_lightCountsBuffer");l(this,"_pointBuffer");l(this,"_spotBuffer");l(this,"_hdrView");l(this,"_cameraData",new Float32Array(sr/4));l(this,"_lightCountsArr",new Uint32Array(2));l(this,"_pointBuf",new ArrayBuffer(ft*lr));l(this,"_pointF32",new Float32Array(this._pointBuf));l(this,"_pointI32",new Int32Array(this._pointBuf));l(this,"_spotBuf",new ArrayBuffer(pt*cr));l(this,"_spotF32",new Float32Array(this._spotBuf));l(this,"_spotI32",new Int32Array(this._spotBuf));this._pipeline=e,this._cameraBG=t,this._gbufferBG=r,this._lightBG=i,this._shadowBG=o,this._cameraBuffer=a,this._lightCountsBuffer=s,this._pointBuffer=c,this._spotBuffer=u,this._hdrView=p}static create(e,t,r,i){const{device:o}=e,a=o.createBuffer({label:"PSLCameraBuffer",size:sr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),s=o.createBuffer({label:"PSLLightCounts",size:lo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),c=o.createBuffer({label:"PSLPointBuffer",size:ft*lr,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),u=o.createBuffer({label:"PSLSpotBuffer",size:pt*cr,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),p=o.createSampler({label:"PSLLinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),f=o.createSampler({label:"PSLVsmSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge"}),h=o.createSampler({label:"PSLProjSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),m=o.createBindGroupLayout({label:"PSLCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),_=o.createBindGroupLayout({label:"PSLGBufferBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),w=o.createBindGroupLayout({label:"PSLLightBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),v=o.createBindGroupLayout({label:"PSLShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube-array"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d-array"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d-array"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),x=o.createBindGroup({label:"PSLCameraBG",layout:m,entries:[{binding:0,resource:{buffer:a}}]}),B=o.createBindGroup({label:"PSLGBufferBG",layout:_,entries:[{binding:0,resource:t.albedoRoughnessView},{binding:1,resource:t.normalMetallicView},{binding:2,resource:t.depthView},{binding:3,resource:p}]}),G=o.createBindGroup({label:"PSLLightBG",layout:w,entries:[{binding:0,resource:{buffer:s}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:u}}]}),S=o.createBindGroup({label:"PSLShadowBG",layout:v,entries:[{binding:0,resource:r.pointVsmView},{binding:1,resource:r.spotVsmView},{binding:2,resource:r.projTexView},{binding:3,resource:f},{binding:4,resource:h}]}),E=o.createShaderModule({label:"PointSpotLightShader",code:so}),M=o.createRenderPipeline({label:"PointSpotLightPipeline",layout:o.createPipelineLayout({bindGroupLayouts:[m,_,w,v]}),vertex:{module:E,entryPoint:"vs_main"},fragment:{module:E,entryPoint:"fs_main",targets:[{format:Q,blend:{color:{srcFactor:"one",dstFactor:"one",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one",operation:"add"}}}]},primitive:{topology:"triangle-list"}});return new gn(M,x,B,G,S,a,s,c,u,i)}updateCamera(e,t,r,i,o,a,s,c){const u=this._cameraData;u.set(t.data,0),u.set(r.data,16),u.set(i.data,32),u.set(o.data,48),u[64]=a.x,u[65]=a.y,u[66]=a.z,u[67]=s,u[68]=c,e.queue.writeBuffer(this._cameraBuffer,0,u.buffer)}updateLights(e,t,r){const i=this._lightCountsArr;i[0]=Math.min(t.length,ft),i[1]=Math.min(r.length,pt),e.queue.writeBuffer(this._lightCountsBuffer,0,i.buffer);const o=this._pointF32,a=this._pointI32;let s=0;for(let f=0;f<Math.min(t.length,ft);f++){const h=t[f],m=h.worldPosition(),_=f*12;o[_+0]=m.x,o[_+1]=m.y,o[_+2]=m.z,o[_+3]=h.radius,o[_+4]=h.color.x,o[_+5]=h.color.y,o[_+6]=h.color.z,o[_+7]=h.intensity,h.castShadow&&s<je?a[_+8]=s++:a[_+8]=-1,a[_+9]=0,a[_+10]=0,a[_+11]=0}e.queue.writeBuffer(this._pointBuffer,0,this._pointBuf);const c=this._spotF32,u=this._spotI32;let p=0;for(let f=0;f<Math.min(r.length,pt);f++){const h=r[f],m=h.worldPosition(),_=h.worldDirection(),w=h.lightViewProj(),v=f*32;c[v+0]=m.x,c[v+1]=m.y,c[v+2]=m.z,c[v+3]=h.range,c[v+4]=_.x,c[v+5]=_.y,c[v+6]=_.z,c[v+7]=Math.cos(h.innerAngle*Math.PI/180),c[v+8]=h.color.x,c[v+9]=h.color.y,c[v+10]=h.color.z,c[v+11]=Math.cos(h.outerAngle*Math.PI/180),c[v+12]=h.intensity,h.castShadow&&p<Ve?u[v+13]=p++:u[v+13]=-1,u[v+14]=h.projectionTexture!==null?f:-1,u[v+15]=0,c.set(w.data,v+16)}e.queue.writeBuffer(this._spotBuffer,0,this._spotBuf)}execute(e,t){const r=e.beginRenderPass({label:"PointSpotLightPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}]});r.setPipeline(this._pipeline),r.setBindGroup(0,this._cameraBG),r.setBindGroup(1,this._gbufferBG),r.setBindGroup(2,this._lightBG),r.setBindGroup(3,this._shadowBG),r.draw(3),r.end()}destroy(){this._cameraBuffer.destroy(),this._lightCountsBuffer.destroy(),this._pointBuffer.destroy(),this._spotBuffer.destroy()}}const kr=`
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
`;function co(d){switch(d.kind){case"sphere":{const n=Math.cos(d.solidAngle).toFixed(6),e=d.radius.toFixed(6);return`{
  let dir = sample_cone(seed + 10u, seed + 11u, ${n});
  let world_dir = quat_rotate(uniforms.world_quat, dir);
  p.position = uniforms.world_pos + world_dir * ${e};
  p.velocity = world_dir * speed;
}`}case"cone":{const n=Math.cos(d.angle).toFixed(6),e=d.radius.toFixed(6);return`{
  let dir = sample_cone(seed + 10u, seed + 11u, ${n});
  let world_dir = quat_rotate(uniforms.world_quat, dir);
  p.position = uniforms.world_pos + world_dir * ${e};
  p.velocity = world_dir * speed;
}`}case"box":{const[n,e,t]=d.halfExtents.map(r=>r.toFixed(6));return`{
  let local_off = vec3<f32>(
    (rand_f32(seed + 10u) * 2.0 - 1.0) * ${n},
    (rand_f32(seed + 11u) * 2.0 - 1.0) * ${e},
    (rand_f32(seed + 12u) * 2.0 - 1.0) * ${t},
  );
  let up = quat_rotate(uniforms.world_quat, vec3<f32>(0.0, 1.0, 0.0));
  p.position = uniforms.world_pos + quat_rotate(uniforms.world_quat, local_off);
  p.velocity = up * speed;
}`}}}function Nr(d){switch(d.type){case"gravity":return`p.velocity.y -= ${d.strength.toFixed(6)} * uniforms.dt;`;case"drag":return`p.velocity -= p.velocity * ${d.coefficient.toFixed(6)} * uniforms.dt;`;case"force":{const[n,e,t]=d.direction.map(r=>r.toFixed(6));return`p.velocity += vec3<f32>(${n}, ${e}, ${t}) * ${d.strength.toFixed(6)} * uniforms.dt;`}case"swirl_force":{const n=d.speed.toFixed(6),e=d.strength.toFixed(6);return`{
  let swirl_angle = uniforms.time * ${n};
  p.velocity += vec3<f32>(cos(swirl_angle), 0.0, sin(swirl_angle)) * ${e} * uniforms.dt;
}`}case"vortex":return`{
  let vx_radial = p.position.xz - uniforms.world_pos.xz;
  p.velocity += vec3<f32>(-vx_radial.y, 0.0, vx_radial.x) * ${d.strength.toFixed(6)} * uniforms.dt;
}`;case"curl_noise":{const n=d.octaves??1,e=n>1?`curl_noise_fbm(cn_pos, ${n})`:"curl_noise(cn_pos)";return`{
  let cn_pos = p.position * ${d.scale.toFixed(6)} + uniforms.time * ${d.timeScale.toFixed(6)};
  p.velocity += ${e} * ${d.strength.toFixed(6)} * uniforms.dt;
}`}case"size_random":return`p.size = rand_range(${d.min.toFixed(6)}, ${d.max.toFixed(6)}, pcg_hash(idx * 2654435761u));`;case"size_over_lifetime":return`p.size = mix(${d.start.toFixed(6)}, ${d.end.toFixed(6)}, t);`;case"color_over_lifetime":{const[n,e,t,r]=d.startColor.map(c=>c.toFixed(6)),[i,o,a,s]=d.endColor.map(c=>c.toFixed(6));return`p.color = mix(vec4<f32>(${n}, ${e}, ${t}, ${r}), vec4<f32>(${i}, ${o}, ${a}, ${s}), t);`}case"block_collision":return`{
  let _bc_uv = (p.position.xz - vec2<f32>(hm.origin_x, hm.origin_z)) / (hm.extent * 2.0) + 0.5;
  if (all(_bc_uv >= vec2<f32>(0.0)) && all(_bc_uv <= vec2<f32>(1.0))) {
    let _bc_xi = clamp(u32(_bc_uv.x * f32(hm.resolution)), 0u, hm.resolution - 1u);
    let _bc_zi = clamp(u32(_bc_uv.y * f32(hm.resolution)), 0u, hm.resolution - 1u);
    if (p.position.y <= hm_data[_bc_zi * hm.resolution + _bc_xi]) {
      particles[idx].life = -1.0; return;
    }
  }
}`}}function Rr(d,n){return d?d.filter(e=>e.trigger===n).flatMap(e=>e.actions.map(Nr)).join(`
  `):""}function uo(d){const{emitter:n,events:e}=d,[t,r]=n.lifetime.map(h=>h.toFixed(6)),[i,o]=n.initialSpeed.map(h=>h.toFixed(6)),[a,s]=n.initialSize.map(h=>h.toFixed(6)),[c,u,p,f]=n.initialColor.map(h=>h.toFixed(6));return`
${kr}

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
  p.max_life = rand_range(${t}, ${r}, seed + 2u);
  p.color    = vec4<f32>(${c}, ${u}, ${p}, ${f});
  p.size     = rand_range(${a}, ${s}, seed + 3u);
  p.rotation = rand_f32(seed + 4u) * 6.28318530717958647;

  ${co(n.shape)}

  ${Rr(e,"on_spawn")}

  particles[idx] = p;
}
`}function fo(d){return d.modifiers.some(n=>n.type==="block_collision")}const po=`
struct HeightmapUniforms {
  origin_x  : f32,
  origin_z  : f32,
  extent    : f32,
  resolution: u32,
}
@group(2) @binding(0) var<storage, read> hm_data: array<f32>;
@group(2) @binding(1) var<uniform>       hm     : HeightmapUniforms;
`;function ho(d){const n=d.modifiers.some(r=>r.type==="block_collision"),e=d.modifiers.map(Nr).join(`
  `),t=Rr(d.events,"on_death");return`
${kr}
${n?po:""}

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
`}const mo=`// Compact pass — rebuilds alive_list and writes indirect draw instance count.
// Two entry points used as two sequential dispatches within one compute pass:
//   cs_compact      — ceil(maxParticles/64) workgroups, fills alive_list
//   cs_write_indirect — 1 workgroup, copies alive_count → indirect.instanceCount

struct Particle {
  position : vec3<f32>,
  life     : f32,
  velocity : vec3<f32>,
  max_life : f32,
  color    : vec4<f32>,
  size     : f32,
  rotation : f32,
  _pad     : vec2<f32>,
}

struct CompactUniforms {
  max_particles: u32,
  _pad0        : u32,
  _pad1        : u32,
  _pad2        : u32,
}

@group(0) @binding(0) var<storage, read>       particles  : array<Particle>;
@group(0) @binding(1) var<storage, read_write> alive_list : array<u32>;
@group(0) @binding(2) var<storage, read_write> counter    : atomic<u32>;
@group(0) @binding(3) var<storage, read_write> indirect   : array<u32>;
@group(1) @binding(0) var<uniform>             uniforms   : CompactUniforms;

@compute @workgroup_size(64)
fn cs_compact(@builtin(global_invocation_id) gid: vec3<u32>) {
  let idx = gid.x;
  if (idx >= uniforms.max_particles) { return; }
  if (particles[idx].life < 0.0) { return; }
  let slot = atomicAdd(&counter, 1u);
  alive_list[slot] = idx;
}

@compute @workgroup_size(1)
fn cs_write_indirect() {
  // indirect layout: [vertexCount, instanceCount, firstVertex, firstInstance]
  indirect[1] = atomicLoad(&counter);
}
`,_o=`// Particle GBuffer render pass — camera-facing billboard quads.
// Each instance reads one alive particle and writes to the deferred GBuffer.
// Normal is the billboard face direction (toward camera) for deferred lighting.

struct Particle {
  position : vec3<f32>,
  life     : f32,
  velocity : vec3<f32>,
  max_life : f32,
  color    : vec4<f32>,
  size     : f32,
  rotation : f32,
  _pad     : vec2<f32>,
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

struct ParticleRenderUniforms {
  roughness : f32,
  metallic  : f32,
  _pad      : vec2<f32>,
}

@group(0) @binding(0) var<storage, read> particles  : array<Particle>;
@group(0) @binding(1) var<storage, read> alive_list : array<u32>;
@group(1) @binding(0) var<uniform>       camera     : CameraUniforms;
@group(2) @binding(0) var<uniform>       mat_params : ParticleRenderUniforms;

struct VertexOutput {
  @builtin(position) clip_pos  : vec4<f32>,
  @location(0)       color     : vec4<f32>,
  @location(1)       uv        : vec2<f32>,
  @location(2)       world_pos : vec3<f32>,
  @location(3)       face_norm : vec3<f32>,
}

// 2-triangle quad: 6 vertex positions in [-0.5, 0.5]²
fn quad_offset(vid: u32) -> vec2<f32> {
  switch vid {
    case 0u: { return vec2<f32>(-0.5, -0.5); }
    case 1u: { return vec2<f32>( 0.5, -0.5); }
    case 2u: { return vec2<f32>(-0.5,  0.5); }
    case 3u: { return vec2<f32>( 0.5, -0.5); }
    case 4u: { return vec2<f32>( 0.5,  0.5); }
    default: { return vec2<f32>(-0.5,  0.5); }
  }
}

fn quad_uv(vid: u32) -> vec2<f32> {
  switch vid {
    case 0u: { return vec2<f32>(0.0, 1.0); }
    case 1u: { return vec2<f32>(1.0, 1.0); }
    case 2u: { return vec2<f32>(0.0, 0.0); }
    case 3u: { return vec2<f32>(1.0, 1.0); }
    case 4u: { return vec2<f32>(1.0, 0.0); }
    default: { return vec2<f32>(0.0, 0.0); }
  }
}

@vertex
fn vs_main(
  @builtin(vertex_index)   vid: u32,
  @builtin(instance_index) iid: u32,
) -> VertexOutput {
  let p_idx = alive_list[iid];
  let p     = particles[p_idx];

  // Camera right and up from the view matrix rows (column-major storage)
  let cam_right = vec3<f32>(camera.view[0].x, camera.view[1].x, camera.view[2].x);
  let cam_up    = vec3<f32>(camera.view[0].y, camera.view[1].y, camera.view[2].y);

  // Rotate quad corner around particle center using particle.rotation angle
  let ofs    = quad_offset(vid);
  let c      = cos(p.rotation);
  let s      = sin(p.rotation);
  let rotated = vec2<f32>(c * ofs.x - s * ofs.y, s * ofs.x + c * ofs.y);

  let world_pos = p.position
    + cam_right * rotated.x * p.size
    + cam_up    * rotated.y * p.size;

  let face_norm = normalize(camera.position - p.position);

  var out: VertexOutput;
  out.clip_pos  = camera.viewProj * vec4<f32>(world_pos, 1.0);
  out.color     = p.color;
  out.uv        = quad_uv(vid);
  out.world_pos = world_pos;
  out.face_norm = face_norm;
  return out;
}

struct GBufferOutput {
  @location(0) albedo_roughness : vec4<f32>,  // rgba8unorm
  @location(1) normal_metallic  : vec4<f32>,  // rgba16float
}

@fragment
fn fs_main(in: VertexOutput) -> GBufferOutput {
  // Circular clip for round particles
  let d = length(in.uv - 0.5) * 2.0;
  if (d > 1.0) { discard; }

  // Encode world-space normal as [0,1]
  let N = normalize(in.face_norm);

  var out: GBufferOutput;
  out.albedo_roughness = vec4<f32>(in.color.rgb, mat_params.roughness);
  out.normal_metallic  = vec4<f32>(N * 0.5 + 0.5, mat_params.metallic);
  return out;
}
`,go=`// Particle forward HDR render pass — velocity-aligned billboard quads.
// Writes directly to the HDR buffer with alpha blending.
// Used for transparent effects like rain, smoke, sparks.

struct Particle {
  position : vec3<f32>,
  life     : f32,
  velocity : vec3<f32>,
  max_life : f32,
  color    : vec4<f32>,
  size     : f32,
  rotation : f32,
  _pad     : vec2<f32>,
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

@group(0) @binding(0) var<storage, read> particles  : array<Particle>;
@group(0) @binding(1) var<storage, read> alive_list : array<u32>;
@group(1) @binding(0) var<uniform>       camera     : CameraUniforms;

struct VertexOutput {
  @builtin(position) clip_pos : vec4<f32>,
  @location(0)       color    : vec4<f32>,
  @location(1)       uv       : vec2<f32>,
}

// Quad UV: x in [-0.5, 0.5], y in [-0.5, 0.5].
// y=−0.5 is the tail (toward velocity), y=+0.5 is the head.
fn quad_offset(vid: u32) -> vec2<f32> {
  switch vid {
    case 0u: { return vec2<f32>(-0.5, -0.5); }
    case 1u: { return vec2<f32>( 0.5, -0.5); }
    case 2u: { return vec2<f32>(-0.5,  0.5); }
    case 3u: { return vec2<f32>( 0.5, -0.5); }
    case 4u: { return vec2<f32>( 0.5,  0.5); }
    default: { return vec2<f32>(-0.5,  0.5); }
  }
}

fn quad_uv(vid: u32) -> vec2<f32> {
  switch vid {
    case 0u: { return vec2<f32>(0.0, 1.0); }
    case 1u: { return vec2<f32>(1.0, 1.0); }
    case 2u: { return vec2<f32>(0.0, 0.0); }
    case 3u: { return vec2<f32>(1.0, 1.0); }
    case 4u: { return vec2<f32>(1.0, 0.0); }
    default: { return vec2<f32>(0.0, 0.0); }
  }
}

@vertex
fn vs_main(
  @builtin(vertex_index)   vid: u32,
  @builtin(instance_index) iid: u32,
) -> VertexOutput {
  let p_idx = alive_list[iid];
  let p     = particles[p_idx];

  let ofs = quad_offset(vid);

  // Velocity-aligned billboard: long axis follows velocity direction.
  let vel     = p.velocity;
  let spd     = length(vel);
  let vel_dir = select(vec3<f32>(0.0, 1.0, 0.0), vel / max(spd, 0.001), spd > 0.001);
  let cam_dir = normalize(camera.position - p.position);
  // right is perpendicular to both velocity and cam direction
  let right   = normalize(cross(vel_dir, cam_dir));

  // Minimal stretch so each drop stays compact
  let stretch = 1.0 + spd * 0.04;

  let world_pos = p.position
    + right   * ofs.x * p.size
    + vel_dir * ofs.y * p.size * stretch;

  var out: VertexOutput;
  out.clip_pos = camera.viewProj * vec4<f32>(world_pos, 1.0);
  out.color    = p.color;
  out.uv       = quad_uv(vid);
  return out;
}

const EMIT_SCALE: f32 = 4.0;

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  // Fade alpha at the tips of the streak (uv.y near 0 or 1)
  let t = abs(in.uv.y * 2.0 - 1.0);
  let alpha = in.color.a * (1.0 - t * t);
  return vec4<f32>(in.color.rgb * EMIT_SCALE, alpha);
}

// ---- Camera-aligned billboard (snow, soft particles) ------------------------

@vertex
fn vs_camera(
  @builtin(vertex_index)   vid: u32,
  @builtin(instance_index) iid: u32,
) -> VertexOutput {
  let p_idx = alive_list[iid];
  let p     = particles[p_idx];

  let ofs = quad_offset(vid);

  // Extract world-space right and up from the view matrix rows.
  // Column-major mat4x4: view[col][row], so row 0 = right, row 1 = up.
  let right = vec3<f32>(camera.view[0][0], camera.view[1][0], camera.view[2][0]);
  let up    = vec3<f32>(camera.view[0][1], camera.view[1][1], camera.view[2][1]);

  let world_pos = p.position
    + right * ofs.x * p.size
    + up    * ofs.y * p.size;

  var out: VertexOutput;
  out.clip_pos = camera.viewProj * vec4<f32>(world_pos, 1.0);
  out.color    = p.color;
  out.uv       = quad_uv(vid);
  return out;
}

@fragment
fn fs_snow(in: VertexOutput) -> @location(0) vec4<f32> {
  // Soft circular disc with radial falloff from centre.
  let uv = in.uv * 2.0 - 1.0;
  let d2 = dot(uv, uv);
  if (d2 > 1.0) { discard; }
  let alpha = in.color.a * (1.0 - d2);
  return vec4<f32>(in.color.rgb * EMIT_SCALE, alpha);
}
`,ur=64,dr=80,vo=16,bo=16,fr=288,pr=16,Wt=128;class vn extends he{constructor(e,t,r,i,o,a,s,c,u,p,f,h,m,_,w,v,x,B,G,S,E,M,A,R,P,b,C){super();l(this,"name","ParticlePass");l(this,"_gbuffer");l(this,"_hdrView");l(this,"_isForward");l(this,"_maxParticles");l(this,"_config");l(this,"_particleBuffer");l(this,"_aliveList");l(this,"_counterBuffer");l(this,"_indirectBuffer");l(this,"_computeUniforms");l(this,"_renderUniforms");l(this,"_cameraBuffer");l(this,"_spawnPipeline");l(this,"_updatePipeline");l(this,"_compactPipeline");l(this,"_indirectPipeline");l(this,"_renderPipeline");l(this,"_computeDataBG");l(this,"_computeUniBG");l(this,"_compactDataBG");l(this,"_compactUniBG");l(this,"_renderDataBG");l(this,"_cameraRenderBG");l(this,"_renderParamsBG");l(this,"_heightmapDataBuf");l(this,"_heightmapUniBuf");l(this,"_heightmapBG");l(this,"_spawnAccum",0);l(this,"_spawnOffset",0);l(this,"_spawnCount",0);l(this,"_time",0);l(this,"_frameSeed",0);l(this,"_cuBuf",new Float32Array(dr/4));l(this,"_cuiView",new Uint32Array(this._cuBuf.buffer));l(this,"_camBuf",new Float32Array(fr/4));l(this,"_hmUniBuf",new Float32Array(pr/4));l(this,"_hmRes",new Uint32Array([Wt]));l(this,"_resetArr",new Uint32Array(1));this._gbuffer=e,this._hdrView=t,this._isForward=r,this._config=i,this._maxParticles=o,this._particleBuffer=a,this._aliveList=s,this._counterBuffer=c,this._indirectBuffer=u,this._computeUniforms=p,this._renderUniforms=f,this._cameraBuffer=h,this._spawnPipeline=m,this._updatePipeline=_,this._compactPipeline=w,this._indirectPipeline=v,this._renderPipeline=x,this._computeDataBG=B,this._computeUniBG=G,this._compactDataBG=S,this._compactUniBG=E,this._renderDataBG=M,this._cameraRenderBG=A,this._renderParamsBG=R,this._heightmapDataBuf=P,this._heightmapUniBuf=b,this._heightmapBG=C}static create(e,t,r,i){const{device:o}=e,a=t.renderer.type==="sprites"&&t.renderer.renderTarget==="hdr",s=t.emitter.maxParticles,c=o.createBuffer({label:"ParticleBuffer",size:s*ur,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),u=new Float32Array(s*(ur/4));for(let te=0;te<s;te++)u[te*16+3]=-1;o.queue.writeBuffer(c,0,u.buffer);const p=o.createBuffer({label:"ParticleAliveList",size:s*4,usage:GPUBufferUsage.STORAGE}),f=o.createBuffer({label:"ParticleCounter",size:4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),h=o.createBuffer({label:"ParticleIndirect",size:16,usage:GPUBufferUsage.INDIRECT|GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});o.queue.writeBuffer(h,0,new Uint32Array([6,0,0,0]));const m=o.createBuffer({label:"ParticleComputeUniforms",size:dr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),_=o.createBuffer({label:"ParticleCompactUniforms",size:vo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});o.queue.writeBuffer(_,0,new Uint32Array([s,0,0,0]));const w=o.createBuffer({label:"ParticleRenderUniforms",size:bo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});o.queue.writeBuffer(w,0,new Float32Array([t.emitter.roughness,t.emitter.metallic,0,0]));const v=o.createBuffer({label:"ParticleCameraBuffer",size:fr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),x=o.createBindGroupLayout({label:"ParticleComputeDataBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),B=o.createBindGroupLayout({label:"ParticleCompactDataBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),G=o.createBindGroupLayout({label:"ParticleComputeUniBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),S=o.createBindGroupLayout({label:"ParticleRenderDataBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}}]}),E=o.createBindGroupLayout({label:"ParticleCameraRenderBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),M=o.createBindGroupLayout({label:"ParticleRenderParamsBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),A=o.createBindGroup({label:"ParticleComputeDataBG",layout:x,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:p}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:h}}]}),R=o.createBindGroup({label:"ParticleCompactDataBG",layout:B,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:p}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:h}}]}),P=o.createBindGroup({label:"ParticleComputeUniBG",layout:G,entries:[{binding:0,resource:{buffer:m}}]}),b=o.createBindGroup({label:"ParticleCompactUniBG",layout:G,entries:[{binding:0,resource:{buffer:_}}]}),C=o.createBindGroup({label:"ParticleRenderDataBG",layout:S,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:p}}]}),g=o.createBindGroup({label:"ParticleCameraRenderBG",layout:E,entries:[{binding:0,resource:{buffer:v}}]}),T=o.createBindGroup({label:"ParticleRenderParamsBG",layout:M,entries:[{binding:0,resource:{buffer:w}}]});let y,U,N,V;fo(t)&&(y=o.createBuffer({label:"ParticleHeightmapData",size:Wt*Wt*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),U=o.createBuffer({label:"ParticleHeightmapUniforms",size:pr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),V=o.createBindGroupLayout({label:"ParticleHeightmapBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),N=o.createBindGroup({label:"ParticleHeightmapBG",layout:V,entries:[{binding:0,resource:{buffer:y}},{binding:1,resource:{buffer:U}}]}));const z=o.createPipelineLayout({bindGroupLayouts:[x,G]}),I=V?o.createPipelineLayout({bindGroupLayouts:[x,G,V]}):o.createPipelineLayout({bindGroupLayouts:[x,G]}),K=o.createPipelineLayout({bindGroupLayouts:[B,G]}),de=o.createShaderModule({label:"ParticleSpawn",code:uo(t)}),fe=o.createShaderModule({label:"ParticleUpdate",code:ho(t)}),ee=o.createShaderModule({label:"ParticleCompact",code:mo}),ne=o.createComputePipeline({label:"ParticleSpawnPipeline",layout:z,compute:{module:de,entryPoint:"cs_main"}}),q=o.createComputePipeline({label:"ParticleUpdatePipeline",layout:I,compute:{module:fe,entryPoint:"cs_main"}}),$=o.createComputePipeline({label:"ParticleCompactPipeline",layout:K,compute:{module:ee,entryPoint:"cs_compact"}}),W=o.createComputePipeline({label:"ParticleIndirectPipeline",layout:K,compute:{module:ee,entryPoint:"cs_write_indirect"}});let Y;if(a){const te=t.renderer.type==="sprites"?t.renderer.billboard:"camera",me=te==="camera"?"vs_camera":"vs_main",ve=te==="camera"?"fs_snow":"fs_main",pe=o.createShaderModule({label:"ParticleRenderForward",code:go}),le=o.createPipelineLayout({bindGroupLayouts:[S,E]});Y=o.createRenderPipeline({label:"ParticleForwardPipeline",layout:le,vertex:{module:pe,entryPoint:me},fragment:{module:pe,entryPoint:ve,targets:[{format:Q,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},depthStencil:{format:"depth32float",depthWriteEnabled:!1,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}})}else{const te=o.createShaderModule({label:"ParticleRender",code:_o}),me=o.createPipelineLayout({bindGroupLayouts:[S,E,M]});Y=o.createRenderPipeline({label:"ParticleRenderPipeline",layout:me,vertex:{module:te,entryPoint:"vs_main"},fragment:{module:te,entryPoint:"fs_main",targets:[{format:"rgba8unorm"},{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}})}return new vn(r,i,a,t,s,c,p,f,h,m,w,v,ne,q,$,W,Y,A,P,R,b,C,g,a?void 0:T,y,U,N)}updateHeightmap(e,t,r,i,o){if(!this._heightmapDataBuf||!this._heightmapUniBuf)return;e.queue.writeBuffer(this._heightmapDataBuf,0,t.buffer);const a=this._hmUniBuf;a[0]=r,a[1]=i,a[2]=o,e.queue.writeBuffer(this._heightmapUniBuf,0,a.buffer,0,12),e.queue.writeBuffer(this._heightmapUniBuf,12,this._hmRes)}update(e,t,r,i,o,a,s,c,u,p){this._time+=t,this._frameSeed=this._frameSeed+1&4294967295,this._spawnAccum+=this._config.emitter.spawnRate*t,this._spawnCount=Math.min(Math.floor(this._spawnAccum),this._maxParticles),this._spawnAccum-=this._spawnCount;const f=p.data,h=f[12],m=f[13],_=f[14],w=Math.hypot(f[0],f[1],f[2]),v=Math.hypot(f[4],f[5],f[6]),x=Math.hypot(f[8],f[9],f[10]),B=f[0]/w,G=f[1]/w,S=f[2]/w,E=f[4]/v,M=f[5]/v,A=f[6]/v,R=f[8]/x,P=f[9]/x,b=f[10]/x,C=B+M+b;let g,T,y,U;if(C>0){const I=.5/Math.sqrt(C+1);U=.25/I,g=(A-P)*I,T=(R-S)*I,y=(G-E)*I}else if(B>M&&B>b){const I=2*Math.sqrt(1+B-M-b);U=(A-P)/I,g=.25*I,T=(E+G)/I,y=(R+S)/I}else if(M>b){const I=2*Math.sqrt(1+M-B-b);U=(R-S)/I,g=(E+G)/I,T=.25*I,y=(P+A)/I}else{const I=2*Math.sqrt(1+b-B-M);U=(G-E)/I,g=(R+S)/I,T=(P+A)/I,y=.25*I}const N=this._cuBuf,V=this._cuiView;N[0]=h,N[1]=m,N[2]=_,V[3]=this._spawnCount,N[4]=g,N[5]=T,N[6]=y,N[7]=U,V[8]=this._spawnOffset,V[9]=this._maxParticles,V[10]=this._frameSeed,V[11]=0,N[12]=t,N[13]=this._time,e.queue.writeBuffer(this._computeUniforms,0,N.buffer),e.queue.writeBuffer(this._counterBuffer,0,this._resetArr),this._spawnOffset=(this._spawnOffset+this._spawnCount)%this._maxParticles;const z=this._camBuf;z.set(r.data,0),z.set(i.data,16),z.set(o.data,32),z.set(a.data,48),z[64]=s.x,z[65]=s.y,z[66]=s.z,z[67]=c,z[68]=u,e.queue.writeBuffer(this._cameraBuffer,0,z.buffer)}execute(e,t){const r=e.beginComputePass({label:"ParticleCompute"});if(this._spawnCount>0&&(r.setPipeline(this._spawnPipeline),r.setBindGroup(0,this._computeDataBG),r.setBindGroup(1,this._computeUniBG),r.dispatchWorkgroups(Math.ceil(this._spawnCount/64))),r.setPipeline(this._updatePipeline),r.setBindGroup(0,this._computeDataBG),r.setBindGroup(1,this._computeUniBG),this._heightmapBG&&r.setBindGroup(2,this._heightmapBG),r.dispatchWorkgroups(Math.ceil(this._maxParticles/64)),r.setPipeline(this._compactPipeline),r.setBindGroup(0,this._compactDataBG),r.setBindGroup(1,this._compactUniBG),r.dispatchWorkgroups(Math.ceil(this._maxParticles/64)),r.setPipeline(this._indirectPipeline),r.dispatchWorkgroups(1),r.end(),this._isForward){const i=e.beginRenderPass({label:"ParticleForwardPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthReadOnly:!0}});i.setPipeline(this._renderPipeline),i.setBindGroup(0,this._renderDataBG),i.setBindGroup(1,this._cameraRenderBG),i.drawIndirect(this._indirectBuffer,0),i.end()}else{const i=e.beginRenderPass({label:"ParticleGBufferPass",colorAttachments:[{view:this._gbuffer.albedoRoughnessView,loadOp:"load",storeOp:"store"},{view:this._gbuffer.normalMetallicView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthLoadOp:"load",depthStoreOp:"store"}});i.setPipeline(this._renderPipeline),i.setBindGroup(0,this._renderDataBG),i.setBindGroup(1,this._cameraRenderBG),i.setBindGroup(2,this._renderParamsBG),i.drawIndirect(this._indirectBuffer,0),i.end()}}destroy(){var e,t;this._particleBuffer.destroy(),this._aliveList.destroy(),this._counterBuffer.destroy(),this._indirectBuffer.destroy(),this._computeUniforms.destroy(),this._renderUniforms.destroy(),this._cameraBuffer.destroy(),(e=this._heightmapDataBuf)==null||e.destroy(),(t=this._heightmapUniBuf)==null||t.destroy()}}const yo=`// Auto-exposure — two-pass histogram approach.
//
// cs_histogram : samples the HDR scene texture (every 4th pixel), bins each
//                pixel's log2-luminance into 64 workgroup-local bins, then
//                flushes to the global histogram atomically.
// cs_adapt     : reads the 64-bin histogram, computes a weighted average
//                log-luminance (skipping the darkest 5% and brightest 2% of
//                samples), derives the target linear exposure that maps the
//                average to 18% grey, then lerps the current exposure toward
//                that target with a time-constant controlled by adapt_speed.

const NUM_BINS      : u32 = 64u;
const LOG_LUM_MIN   : f32 = -10.0;   // log2 luminance range bottom (2^-10 ≈ 0.001)
const LOG_LUM_MAX   : f32 =   6.0;   // log2 luminance range top   (2^6  = 64)
const LOG_LUM_RANGE : f32 = 16.0;    // LOG_LUM_MAX - LOG_LUM_MIN
const GREY_LOG2     : f32 = -2.474;  // log2(0.18) — target middle-grey point

struct AutoExposureParams {
  dt          : f32,
  adapt_speed : f32,   // EV/second rate constant (higher = faster adaptation)
  min_exposure: f32,   // minimum linear exposure multiplier
  max_exposure: f32,   // maximum linear exposure multiplier
  low_pct     : f32,   // fraction of darkest samples to ignore (default 0.05)
  high_pct    : f32,   // fraction of brightest samples to ignore (default 0.02)
  _pad        : vec2<f32>,
}

struct ExposureBuffer {
  value : f32,
  _pad0 : f32,
  _pad1 : f32,
  _pad2 : f32,
}

@group(0) @binding(0) var                        hdr_tex  : texture_2d<f32>;
@group(0) @binding(1) var<storage, read_write>   histogram: array<atomic<u32>>;  // 64 bins
@group(0) @binding(2) var<storage, read_write>   exposure : ExposureBuffer;
@group(0) @binding(3) var<uniform>               params   : AutoExposureParams;

// ---- Pass 1: Histogram ------------------------------------------------------

var<workgroup> wg_hist: array<atomic<u32>, 64>;

@compute @workgroup_size(8, 8)
fn cs_histogram(
  @builtin(global_invocation_id)    gid: vec3<u32>,
  @builtin(local_invocation_index)  lid: u32,
) {
  // wg_hist is zero-initialised per WGSL spec — no explicit clear needed.

  let size  = textureDimensions(hdr_tex);
  let coord = gid.xy * 4u;   // sample every 4th pixel in each dimension

  if (coord.x < size.x && coord.y < size.y) {
    let rgb = textureLoad(hdr_tex, vec2<i32>(coord), 0).rgb;
    let lum = dot(rgb, vec3<f32>(0.2126, 0.7152, 0.0722));
    if (lum > 1e-5) {
      let t   = clamp((log2(lum) - LOG_LUM_MIN) / LOG_LUM_RANGE, 0.0, 1.0);
      let bin = min(u32(t * f32(NUM_BINS)), NUM_BINS - 1u);
      atomicAdd(&wg_hist[bin], 1u);
    }
  }
  workgroupBarrier();

  // Each thread (lid 0-63) flushes one histogram bin to the global buffer.
  atomicAdd(&histogram[lid], atomicLoad(&wg_hist[lid]));
}

// ---- Pass 2: Adapt ----------------------------------------------------------

var<workgroup> wg_bins: array<u32, 64>;

@compute @workgroup_size(64)
fn cs_adapt(@builtin(local_invocation_index) lid: u32) {
  // Read and clear the global histogram for this frame.
  wg_bins[lid] = atomicExchange(&histogram[lid], 0u);
  workgroupBarrier();

  // Only thread 0 performs the sequential reduction.
  if (lid != 0u) { return; }

  var total = 0u;
  for (var i = 0u; i < NUM_BINS; i++) { total += wg_bins[i]; }
  if (total == 0u) { return; }

  // Skip the darkest low_pct and brightest high_pct samples.
  let low_cut  = u32(f32(total) * params.low_pct);
  let high_cut = total - u32(f32(total) * params.high_pct);

  var acc     = 0u;
  var sum_log = 0.0;
  var cnt     = 0u;
  for (var i = 0u; i < NUM_BINS; i++) {
    let b       = wg_bins[i];
    let b_start = acc;
    let b_end   = acc + b;
    acc = b_end;
    if (b_end > low_cut && b_start < high_cut) {
      let in_cnt  = min(b_end, high_cut) - max(b_start, low_cut);
      let log_lum = LOG_LUM_MIN + (f32(i) + 0.5) / f32(NUM_BINS) * LOG_LUM_RANGE;
      sum_log += log_lum * f32(in_cnt);
      cnt     += in_cnt;
    }
  }
  if (cnt == 0u) { return; }

  // target exposure = 0.18 / avg_lum  →  in log-space: GREY_LOG2 - avg_log
  let avg_log    = sum_log / f32(cnt);
  let target_ev  = clamp(GREY_LOG2 - avg_log,
                         log2(params.min_exposure),
                         log2(params.max_exposure));
  let target_exp = exp2(target_ev);

  // Exponential smoothing toward target.
  let blend = 1.0 - exp(-params.adapt_speed * params.dt);
  exposure.value = exposure.value + (target_exp - exposure.value) * blend;
}
`,xo=64,wo=32,Bo=16,So=xo*4,hr={adaptSpeed:1.5,minExposure:.1,maxExposure:10,lowPct:.05,highPct:.02};class et extends he{constructor(e,t,r,i,o,a,s,c){super();l(this,"name","AutoExposurePass");l(this,"exposureBuffer");l(this,"_histogramPipeline");l(this,"_adaptPipeline");l(this,"_bindGroup");l(this,"_paramsBuffer");l(this,"_histogramBuffer");l(this,"_hdrWidth");l(this,"_hdrHeight");l(this,"enabled",!0);this._histogramPipeline=e,this._adaptPipeline=t,this._bindGroup=r,this._paramsBuffer=i,this._histogramBuffer=o,this.exposureBuffer=a,this._hdrWidth=s,this._hdrHeight=c}static create(e,t,r=hr){const{device:i}=e,o=i.createBindGroupLayout({label:"AutoExposureBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),a=i.createBuffer({label:"AutoExposureHistogram",size:So,usage:GPUBufferUsage.STORAGE}),s=i.createBuffer({label:"AutoExposureValue",size:Bo,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});i.queue.writeBuffer(s,0,new Float32Array([1,0,0,0]));const c=i.createBuffer({label:"AutoExposureParams",size:wo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});et._writeParams(i,c,0,r);const u=i.createBindGroup({label:"AutoExposureBG",layout:o,entries:[{binding:0,resource:t.createView()},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:s}},{binding:3,resource:{buffer:c}}]}),p=i.createPipelineLayout({bindGroupLayouts:[o]}),f=i.createShaderModule({label:"AutoExposure",code:yo}),h=i.createComputePipeline({label:"AutoExposureHistogramPipeline",layout:p,compute:{module:f,entryPoint:"cs_histogram"}}),m=i.createComputePipeline({label:"AutoExposureAdaptPipeline",layout:p,compute:{module:f,entryPoint:"cs_adapt"}});return new et(h,m,u,c,a,s,t.width,t.height)}update(e,t,r=hr){if(!this.enabled){e.device.queue.writeBuffer(this.exposureBuffer,0,new Float32Array([1,0,0,0]));return}et._writeParams(e.device,this._paramsBuffer,t,r)}execute(e,t){if(!this.enabled)return;const r=e.beginComputePass({label:"AutoExposurePass"});r.setPipeline(this._histogramPipeline),r.setBindGroup(0,this._bindGroup),r.dispatchWorkgroups(Math.ceil(this._hdrWidth/32),Math.ceil(this._hdrHeight/32)),r.setPipeline(this._adaptPipeline),r.dispatchWorkgroups(1),r.end()}destroy(){this._paramsBuffer.destroy(),this._histogramBuffer.destroy(),this.exposureBuffer.destroy()}static _writeParams(e,t,r,i){e.queue.writeBuffer(t,0,new Float32Array([r,i.adaptSpeed,i.minExposure,i.maxExposure,i.lowPct,i.highPct,0,0]))}}function Po(d,n,e){let t=(Math.imul(d,1664525)^Math.imul(n,1013904223)^Math.imul(e,22695477))>>>0;return t=Math.imul(t^t>>>16,73244475)>>>0,t=Math.imul(t^t>>>16,73244475)>>>0,((t^t>>>16)>>>0)/4294967295}function Bt(d,n,e,t){return Po(d^t,n^t*7+3,e^t*13+5)}function qt(d){return d*d*d*(d*(d*6-15)+10)}function Go(d,n,e,t,r,i,o,a,s,c,u){const p=d+(n-d)*s,f=e+(t-e)*s,h=r+(i-r)*s,m=o+(a-o)*s,_=p+(f-p)*c,w=h+(m-h)*c;return _+(w-_)*u}const To=new Int8Array([1,-1,1,-1,1,-1,1,-1,0,0,0,0]),Ao=new Int8Array([1,1,-1,-1,0,0,0,0,1,-1,1,-1]),Mo=new Int8Array([0,0,0,0,1,1,-1,-1,1,1,-1,-1]);function Ie(d,n,e,t,r,i,o,a){const s=(d%t+t)%t,c=(n%t+t)%t,u=(e%t+t)%t,p=Math.floor(Bt(s,c,u,r)*12)%12;return To[p]*i+Ao[p]*o+Mo[p]*a}function Eo(d,n,e,t,r){const i=Math.floor(d),o=Math.floor(n),a=Math.floor(e),s=d-i,c=n-o,u=e-a,p=qt(s),f=qt(c),h=qt(u);return Go(Ie(i,o,a,t,r,s,c,u),Ie(i+1,o,a,t,r,s-1,c,u),Ie(i,o+1,a,t,r,s,c-1,u),Ie(i+1,o+1,a,t,r,s-1,c-1,u),Ie(i,o,a+1,t,r,s,c,u-1),Ie(i+1,o,a+1,t,r,s-1,c,u-1),Ie(i,o+1,a+1,t,r,s,c-1,u-1),Ie(i+1,o+1,a+1,t,r,s-1,c-1,u-1),p,f,h)}function Uo(d,n,e,t,r,i){let o=0,a=.5,s=1,c=0;for(let u=0;u<t;u++)o+=Eo(d*s,n*s,e*s,r*s,i+u*17)*a,c+=a,a*=.5,s*=2;return Math.max(0,Math.min(1,o/c*.85+.5))}function We(d,n,e,t,r){const i=d*t,o=n*t,a=e*t,s=Math.floor(i),c=Math.floor(o),u=Math.floor(a);let p=1/0;for(let f=-1;f<=1;f++)for(let h=-1;h<=1;h++)for(let m=-1;m<=1;m++){const _=s+m,w=c+h,v=u+f,x=(_%t+t)%t,B=(w%t+t)%t,G=(v%t+t)%t,S=_+Bt(x,B,G,r),E=w+Bt(x,B,G,r+1),M=v+Bt(x,B,G,r+2),A=i-S,R=o-E,P=a-M,b=A*A+R*R+P*P;b<p&&(p=b)}return 1-Math.min(Math.sqrt(p),1)}function mr(d,n,e,t){const r=d.createTexture({label:n,dimension:"3d",size:{width:e,height:e,depthOrArrayLayers:e},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return d.queue.writeTexture({texture:r},t.buffer,{bytesPerRow:e*4,rowsPerImage:e},{width:e,height:e,depthOrArrayLayers:e}),r}function Co(d){const e=new Uint8Array(1048576);for(let a=0;a<64;a++)for(let s=0;s<64;s++)for(let c=0;c<64;c++){const u=(a*64*64+s*64+c)*4,p=c/64,f=s/64,h=a/64,m=Uo(p,f,h,4,4,0),_=We(p,f,h,2,100),w=We(p,f,h,4,200),v=We(p,f,h,8,300);e[u]=Math.round(m*255),e[u+1]=Math.round(_*255),e[u+2]=Math.round(w*255),e[u+3]=Math.round(v*255)}const t=32,r=new Uint8Array(t*t*t*4);for(let a=0;a<t;a++)for(let s=0;s<t;s++)for(let c=0;c<t;c++){const u=(a*t*t+s*t+c)*4,p=c/t,f=s/t,h=a/t,m=We(p,f,h,4,400),_=We(p,f,h,8,500),w=We(p,f,h,16,600);r[u]=Math.round(m*255),r[u+1]=Math.round(_*255),r[u+2]=Math.round(w*255),r[u+3]=255}const i=mr(d,"CloudBaseNoise",64,e),o=mr(d,"CloudDetailNoise",t,r);return{baseNoise:i,baseView:i.createView({dimension:"3d"}),detailNoise:o,detailView:o.createView({dimension:"3d"}),destroy(){i.destroy(),o.destroy()}}}const Lo=`// IBL baking — two compute entry points share the same bind group layout.
//
// cs_irradiance : cosine-weighted hemisphere integral for diffuse irradiance.
// cs_prefilter  : GGX importance-sampled integral for specular pre-filtered env.
//
// Both sample the sky equirectangular texture and write to one face of a cube
// texture (6 dispatches per roughness level, one face per dispatch).

const PI      : f32 = 3.14159265358979323846;
const SAMPLES : u32 = 256u;

struct IblParams {
  exposure  : f32,
  roughness : f32,   // ignored by cs_irradiance
  face      : f32,   // cube face index 0-5 (written as float, cast to u32)
  _pad      : f32,
}

@group(0) @binding(0) var<uniform> params   : IblParams;
@group(0) @binding(1) var          sky_tex  : texture_2d<f32>;
@group(0) @binding(2) var          sky_samp : sampler;
@group(1) @binding(0) var          out_tex  : texture_storage_2d<rgba16float, write>;

// ---- Helpers ----------------------------------------------------------------

fn equirect_uv(dir: vec3<f32>) -> vec2<f32> {
  let u = atan2(-dir.z, dir.x) / (2.0 * PI) + 0.5;
  let v = acos(clamp(dir.y, -1.0, 1.0)) / PI;
  return vec2<f32>(u, v);
}

// Van der Corput radical inverse (base 2) — low-discrepancy quasi-random sequence
fn radical_inverse(n: u32) -> f32 {
  var bits = (n << 16u) | (n >> 16u);
  bits = ((bits & 0x55555555u) << 1u) | ((bits >> 1u) & 0x55555555u);
  bits = ((bits & 0x33333333u) << 2u) | ((bits >> 2u) & 0x33333333u);
  bits = ((bits & 0x0f0f0f0fu) << 4u) | ((bits >> 4u) & 0x0f0f0f0fu);
  bits = ((bits & 0x00ff00ffu) << 8u) | ((bits >> 8u) & 0x00ff00ffu);
  return f32(bits) * 2.3283064365386963e-10;
}

// Tangent frame around N — columns are (T, B, N), so TBN * local = world.
fn tangent_frame(N: vec3<f32>) -> mat3x3<f32> {
  let up = select(vec3<f32>(1.0, 0.0, 0.0), vec3<f32>(0.0, 1.0, 0.0), abs(N.y) < 0.999);
  let T  = normalize(cross(up, N));
  let B  = cross(N, T);
  return mat3x3<f32>(T, B, N);
}

// Convert cube face + normalised UV in [-1,1] to a world-space direction.
// Uses the standard WebGPU/OpenGL cubemap face convention.
fn cube_dir(face: u32, uc: f32, vc: f32) -> vec3<f32> {
  switch face {
    case 0u: { return normalize(vec3<f32>( 1.0, -vc, -uc)); }  // +X
    case 1u: { return normalize(vec3<f32>(-1.0, -vc,  uc)); }  // -X
    case 2u: { return normalize(vec3<f32>( uc,   1.0,  vc)); }  // +Y
    case 3u: { return normalize(vec3<f32>( uc,  -1.0, -vc)); }  // -Y
    case 4u: { return normalize(vec3<f32>( uc,  -vc,  1.0)); }  // +Z
    default: { return normalize(vec3<f32>(-uc,  -vc, -1.0)); }  // -Z
  }
}

// ---- Irradiance (diffuse IBL) -----------------------------------------------
//
// E(N) = (1/N) Σ L(ωi)   with cosine-weighted PDF = cosθ/π  (estimator = L)

@compute @workgroup_size(8, 8)
fn cs_irradiance(@builtin(global_invocation_id) gid: vec3<u32>) {
  let size = textureDimensions(out_tex);
  if (gid.x >= size.x || gid.y >= size.y) { return; }

  let uc = 2.0 * (f32(gid.x) + 0.5) / f32(size.x) - 1.0;
  let vc = 2.0 * (f32(gid.y) + 0.5) / f32(size.y) - 1.0;
  let N  = cube_dir(u32(params.face), uc, vc);
  let TBN = tangent_frame(N);

  var rgb = vec3<f32>(0.0);
  for (var i = 0u; i < SAMPLES; i++) {
    let xi1  = (f32(i) + 0.5) / f32(SAMPLES);
    let xi2  = radical_inverse(i);
    let sinT = sqrt(xi1);
    let cosT = sqrt(1.0 - xi1);
    let phi2 = xi2 * 2.0 * PI;
    let L    = TBN * vec3<f32>(sinT*cos(phi2), sinT*sin(phi2), cosT);
    rgb     += textureSampleLevel(sky_tex, sky_samp, equirect_uv(L), 0.0).rgb;
  }

  textureStore(out_tex, vec2<i32>(gid.xy),
    vec4<f32>(rgb * params.exposure / f32(SAMPLES), 1.0));
}

// ---- Pre-filtered environment (specular IBL) ---------------------------------
//
// Integrates L(ω) weighted by GGX NDF at params.roughness using importance sampling.

@compute @workgroup_size(8, 8)
fn cs_prefilter(@builtin(global_invocation_id) gid: vec3<u32>) {
  let size = textureDimensions(out_tex);
  if (gid.x >= size.x || gid.y >= size.y) { return; }

  let uc = 2.0 * (f32(gid.x) + 0.5) / f32(size.x) - 1.0;
  let vc = 2.0 * (f32(gid.y) + 0.5) / f32(size.y) - 1.0;
  let N  = cube_dir(u32(params.face), uc, vc);
  let TBN = tangent_frame(N);

  let a  = params.roughness * params.roughness;
  let a2 = a * a;

  var sumRGB = vec3<f32>(0.0);
  var sumW   = 0.0;
  for (var i = 0u; i < SAMPLES; i++) {
    let xi1   = (f32(i) + 0.5) / f32(SAMPLES);
    let xi2   = radical_inverse(i);
    let cosT2 = (1.0 - xi2) / (1.0 + (a2 - 1.0) * xi2);
    let cosT  = sqrt(cosT2);
    let sinT  = sqrt(max(0.0, 1.0 - cosT2));
    let phiH  = xi1 * 2.0 * PI;
    let H     = TBN * vec3<f32>(sinT*cos(phiH), sinT*sin(phiH), cosT);
    let VdotH = cosT; // V = N in the split-sum approximation
    let L     = 2.0 * VdotH * H - N;
    let NdotL = max(0.0, dot(N, L));
    if (NdotL <= 0.0) { continue; }
    sumRGB += textureSampleLevel(sky_tex, sky_samp, equirect_uv(L), 0.0).rgb * NdotL;
    sumW   += NdotL;
  }

  let w = select(sumW, 1.0, sumW <= 0.0);
  textureStore(out_tex, vec2<i32>(gid.xy),
    vec4<f32>(sumRGB / w * params.exposure, 1.0));
}
`,_t=5,jt=128,gt=32,ko=[0,.25,.5,.75,1],No=Math.PI;function Ro(d){let n=d>>>0;return n=(n<<16|n>>>16)>>>0,n=((n&1431655765)<<1|n>>>1&1431655765)>>>0,n=((n&858993459)<<2|n>>>2&858993459)>>>0,n=((n&252645135)<<4|n>>>4&252645135)>>>0,n=((n&16711935)<<8|n>>>8&16711935)>>>0,n*23283064365386963e-26}function Io(d,n,e){const t=new Float32Array(d*n*4);for(let r=0;r<n;r++)for(let i=0;i<d;i++){const o=(i+.5)/d,a=(r+.5)/n,s=a*a,c=s*s,u=Math.sqrt(1-o*o),p=o;let f=0,h=0;for(let _=0;_<e;_++){const w=(_+.5)/e,v=Ro(_),x=(1-v)/(1+(c-1)*v),B=Math.sqrt(x),G=Math.sqrt(Math.max(0,1-x)),S=2*No*w,E=G*Math.cos(S),M=B,A=u*E+p*M;if(A<=0)continue;const R=2*A*M-p,P=Math.max(0,R),b=Math.max(0,B);if(P<=0)continue;const C=c/2,g=o/(o*(1-C)+C),T=P/(P*(1-C)+C),y=g*T*A/(b*o),U=Math.pow(1-A,5);f+=y*(1-U),h+=y*U}const m=(r*d+i)*4;t[m+0]=f/e,t[m+1]=h/e,t[m+2]=0,t[m+3]=1}return t}function Oo(d){const n=new Float32Array([d]),e=new Uint32Array(n.buffer)[0],t=e>>31&1,r=e>>23&255,i=e&8388607;if(r===255)return t<<15|31744|(i?1:0);if(r===0)return t<<15;const o=r-127+15;return o>=31?t<<15|31744:o<=0?t<<15:t<<15|o<<10|i>>13}function Vo(d){const n=new Uint16Array(d.length);for(let e=0;e<d.length;e++)n[e]=Oo(d[e]);return n}const _r=new WeakMap;function Do(d){const n=_r.get(d);if(n)return n;const e=Vo(Io(64,64,512)),t=d.createTexture({label:"IBL BRDF LUT",size:{width:64,height:64},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return d.queue.writeTexture({texture:t},e,{bytesPerRow:64*8},{width:64,height:64}),_r.set(d,t),t}const gr=new WeakMap;function zo(d){const n=gr.get(d);if(n)return n;const e=d.createBindGroupLayout({label:"IblBGL0",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.COMPUTE,sampler:{type:"filtering"}}]}),t=d.createBindGroupLayout({label:"IblBGL1",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"2d"}}]}),r=d.createPipelineLayout({bindGroupLayouts:[e,t]}),i=d.createShaderModule({label:"IblCompute",code:Lo}),o=d.createComputePipeline({label:"IblIrradiancePipeline",layout:r,compute:{module:i,entryPoint:"cs_irradiance"}}),a=d.createComputePipeline({label:"IblPrefilterPipeline",layout:r,compute:{module:i,entryPoint:"cs_prefilter"}}),s=d.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"clamp-to-edge"}),c={irrPipeline:o,pfPipeline:a,bgl0:e,bgl1:t,sampler:s};return gr.set(d,c),c}async function Fo(d,n,e=.2){const{irrPipeline:t,pfPipeline:r,bgl0:i,bgl1:o,sampler:a}=zo(d),s=d.createTexture({label:"IBL Irradiance",size:{width:gt,height:gt,depthOrArrayLayers:6},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),c=d.createTexture({label:"IBL Prefiltered",size:{width:jt,height:jt,depthOrArrayLayers:6},mipLevelCount:_t,format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),u=(P,b)=>{const C=d.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return d.queue.writeBuffer(C,0,new Float32Array([e,P,b,0])),C},p=n.createView(),f=P=>d.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:P}},{binding:1,resource:p},{binding:2,resource:a}]}),h=P=>d.createBindGroup({layout:o,entries:[{binding:0,resource:P}]}),m=Array.from({length:6},(P,b)=>u(0,b)),_=ko.flatMap((P,b)=>Array.from({length:6},(C,g)=>u(P,g))),w=m.map(f),v=_.map(f),x=Array.from({length:6},(P,b)=>h(s.createView({dimension:"2d",baseArrayLayer:b,arrayLayerCount:1}))),B=Array.from({length:_t*6},(P,b)=>{const C=Math.floor(b/6),g=b%6;return h(c.createView({dimension:"2d",baseMipLevel:C,mipLevelCount:1,baseArrayLayer:g,arrayLayerCount:1}))}),G=d.createCommandEncoder({label:"IblComputeEncoder"}),S=G.beginComputePass({label:"IblComputePass"});S.setPipeline(t);for(let P=0;P<6;P++)S.setBindGroup(0,w[P]),S.setBindGroup(1,x[P]),S.dispatchWorkgroups(Math.ceil(gt/8),Math.ceil(gt/8));S.setPipeline(r);for(let P=0;P<_t;P++){const b=jt>>P;for(let C=0;C<6;C++)S.setBindGroup(0,v[P*6+C]),S.setBindGroup(1,B[P*6+C]),S.dispatchWorkgroups(Math.ceil(b/8),Math.ceil(b/8))}S.end(),d.queue.submit([G.finish()]),await d.queue.onSubmittedWorkDone(),m.forEach(P=>P.destroy()),_.forEach(P=>P.destroy());const E=Do(d),M=s.createView({dimension:"cube"}),A=c.createView({dimension:"cube"}),R=E.createView();return{irradiance:s,prefiltered:c,brdfLut:E,irradianceView:M,prefilteredView:A,brdfLutView:R,levels:_t,destroy(){s.destroy(),c.destroy()}}}class Pe{constructor(n,e){l(this,"gpuTexture");l(this,"view");l(this,"type");this.gpuTexture=n,this.type=e,this.view=n.createView({dimension:e==="cube"?"cube":e==="3d"?"3d":"2d"})}destroy(){this.gpuTexture.destroy()}static createSolid(n,e,t,r,i=255){const o=n.createTexture({size:{width:1,height:1},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return n.queue.writeTexture({texture:o},new Uint8Array([e,t,r,i]),{bytesPerRow:4},{width:1,height:1}),new Pe(o,"2d")}static fromBitmap(n,e,{srgb:t=!1,usage:r}={}){const i=t?"rgba8unorm-srgb":"rgba8unorm";r=r?r|(GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT):GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT;const o=n.createTexture({size:{width:e.width,height:e.height},format:i,usage:r});return n.queue.copyExternalImageToTexture({source:e,flipY:!1},{texture:o},{width:e.width,height:e.height}),new Pe(o,"2d")}static async fromUrl(n,e,t={}){const r=await(await fetch(e)).blob(),i={colorSpaceConversion:"none"};t.resizeWidth!==void 0&&t.resizeHeight!==void 0&&(i.resizeWidth=t.resizeWidth,i.resizeHeight=t.resizeHeight,i.resizeQuality="high");const o=await createImageBitmap(r,i);return Pe.fromBitmap(n,o,t)}}const Ho=`// Decodes an RGBE (Radiance HDR) texture into a linear rgba16float texture.
// src: rgba8uint — raw RGBE bytes (R, G, B, Exponent), 4 bytes per pixel.
// dst: rgba16float storage texture — linear HDR output.

@group(0) @binding(0) var src : texture_2d<u32>;
@group(1) @binding(0) var dst : texture_storage_2d<rgba16float, write>;

@compute @workgroup_size(8, 8)
fn cs_decode(@builtin(global_invocation_id) gid: vec3<u32>) {
  let size = textureDimensions(src);
  if (gid.x >= size.x || gid.y >= size.y) { return; }

  let rgbe = textureLoad(src, vec2<i32>(gid.xy), 0);
  var rgb  : vec3<f32>;
  if (rgbe.a == 0u) {
    rgb = vec3<f32>(0.0);
  } else {
    // RGBE: scale = 2^(E - 128) / 256  →  2^(E - 136)
    let scale = pow(2.0, f32(rgbe.a) - 136.0);
    rgb = vec3<f32>(f32(rgbe.r), f32(rgbe.g), f32(rgbe.b)) * scale;
  }
  textureStore(dst, vec2<i32>(gid.xy), vec4<f32>(rgb, 1.0));
}
`;function Wo(d){const n=new Uint8Array(d);let e=0;function t(){let f="";for(;e<n.length&&n[e]!==10;)n[e]!==13&&(f+=String.fromCharCode(n[e])),e++;return e<n.length&&e++,f}const r=t();if(!r.startsWith("#?RADIANCE")&&!r.startsWith("#?RGBE"))throw new Error(`Not a Radiance HDR file (magic: "${r}")`);for(;t().length!==0;);const i=t(),o=i.match(/-Y\s+(\d+)\s+\+X\s+(\d+)/);if(!o)throw new Error(`Unrecognized HDR resolution: "${i}"`);const a=parseInt(o[1],10),s=parseInt(o[2],10),c=new Uint8Array(s*a*4);function u(f){const h=new Uint8Array(s),m=new Uint8Array(s),_=new Uint8Array(s),w=new Uint8Array(s),v=[h,m,_,w];for(let B=0;B<4;B++){const G=v[B];let S=0;for(;S<s;){const E=n[e++];if(E>128){const M=E-128,A=n[e++];G.fill(A,S,S+M),S+=M}else G.set(n.subarray(e,e+E),S),e+=E,S+=E}}const x=f*s*4;for(let B=0;B<s;B++)c[x+B*4+0]=h[B],c[x+B*4+1]=m[B],c[x+B*4+2]=_[B],c[x+B*4+3]=w[B]}function p(f,h,m,_,w){const v=f*s*4;c[v+0]=h,c[v+1]=m,c[v+2]=_,c[v+3]=w;let x=1;for(;x<s;){const B=n[e++],G=n[e++],S=n[e++],E=n[e++];if(B===1&&G===1&&S===1){const M=v+(x-1)*4;for(let A=0;A<E;A++)c[v+x*4+0]=c[M+0],c[v+x*4+1]=c[M+1],c[v+x*4+2]=c[M+2],c[v+x*4+3]=c[M+3],x++}else c[v+x*4+0]=B,c[v+x*4+1]=G,c[v+x*4+2]=S,c[v+x*4+3]=E,x++}}for(let f=0;f<a&&!(e+4>n.length);f++){const h=n[e++],m=n[e++],_=n[e++],w=n[e++];if(h===2&&m===2&&!(_&128)){const v=_<<8|w;if(v!==s)throw new Error(`HDR scanline width mismatch: ${v} vs ${s}`);u(f)}else p(f,h,m,_,w)}return{width:s,height:a,data:c}}const vr=new WeakMap;function qo(d){const n=vr.get(d);if(n)return n;const e=d.createBindGroupLayout({label:"RgbeSrcBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"uint"}}]}),t=d.createBindGroupLayout({label:"RgbeDstBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"2d"}}]}),r=d.createPipelineLayout({bindGroupLayouts:[e,t]}),i=d.createShaderModule({label:"RgbeDecode",code:Ho}),a={pipeline:d.createComputePipeline({label:"RgbeDecodePipeline",layout:r,compute:{module:i,entryPoint:"cs_decode"}}),srcBGL:e,dstBGL:t};return vr.set(d,a),a}async function jo(d,n){const{width:e,height:t,data:r}=n,{pipeline:i,srcBGL:o,dstBGL:a}=qo(d),s=d.createTexture({label:"Sky RGBE Raw",size:{width:e,height:t},format:"rgba8uint",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});d.queue.writeTexture({texture:s},r.buffer,{bytesPerRow:e*4},{width:e,height:t});const c=d.createTexture({label:"Sky HDR Texture",size:{width:e,height:t},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),u=d.createBindGroup({layout:o,entries:[{binding:0,resource:s.createView()}]}),p=d.createBindGroup({layout:a,entries:[{binding:0,resource:c.createView()}]}),f=d.createCommandEncoder({label:"RgbeDecodeEncoder"}),h=f.beginComputePass({label:"RgbeDecodePass"});return h.setPipeline(i),h.setBindGroup(0,u),h.setBindGroup(1,p),h.dispatchWorkgroups(Math.ceil(e/8),Math.ceil(t/8)),h.end(),d.queue.submit([f.finish()]),await d.queue.onSubmittedWorkDone(),s.destroy(),new Pe(c,"2d")}class bn{constructor(n,e,t,r,i,o,a){l(this,"colorAtlas");l(this,"normalAtlas");l(this,"merAtlas");l(this,"heightAtlas");l(this,"blockSize");l(this,"blockCount");l(this,"_atlasWidth");l(this,"_atlasHeight");this.colorAtlas=n,this.normalAtlas=e,this.merAtlas=t,this.heightAtlas=r,this.blockSize=i,this._atlasWidth=o,this._atlasHeight=a,this.blockCount=Math.floor(o/i)}static async load(n,e,t,r,i,o=16){async function a(x){const B=await(await fetch(x)).blob();return createImageBitmap(B,{colorSpaceConversion:"none"})}const[s,c,u,p]=await Promise.all([a(e),a(t),a(r),a(i)]),f=s.width,h=s.height,m=Pe.fromBitmap(n,s,{srgb:!0}),_=Pe.fromBitmap(n,c,{srgb:!1}),w=Pe.fromBitmap(n,u,{srgb:!1}),v=Pe.fromBitmap(n,p,{srgb:!1});return new bn(m,_,w,v,o,f,h)}uvTransform(n){const e=this.blockSize/this._atlasWidth,t=this.blockSize/this._atlasHeight;return[n*e,0,e,t]}destroy(){this.colorAtlas.destroy(),this.normalAtlas.destroy(),this.merAtlas.destroy(),this.heightAtlas.destroy()}}var we=(d=>(d[d.None=0]="None",d[d.SnowyMountains=1]="SnowyMountains",d[d.RockyMountains=2]="RockyMountains",d[d.GrassyPlains=3]="GrassyPlains",d[d.SnowyPlains=4]="SnowyPlains",d[d.Desert=5]="Desert",d[d.Max=6]="Max",d))(we||{}),Ye=(d=>(d[d.None=0]="None",d[d.Rain=1]="Rain",d[d.Snow=2]="Snow",d))(Ye||{});function Yo(d){switch(d){case 1:return 2;case 4:return 2;default:return 0}}function br(d){switch(d){case 1:return{cloudBase:90,cloudTop:200};case 2:return{cloudBase:75,cloudTop:160};default:return{cloudBase:75,cloudTop:105}}}const vt=.05,Xo=[[.35,5,3],[-.15,3,4],[-.3,4,1],[-.5,1,2]];function $o(d){for(const[e,t,r]of Xo){const i=d-e;if(i>=-vt&&i<=vt)return{biome1:r,biome2:t,blend:(i+vt)/(2*vt)}}const n=Ko(d);return{biome1:n,biome2:n,blend:0}}function Ko(d){return d>.35?5:d>-.15?3:d>-.3?4:d>-.5?1:2}function yr(d){switch(d){case 1:return 1.2;case 4:return 1;case 3:return .75;case 2:return .9;case 5:return .15;default:return .55}}function Zo(d,n){let e=(Math.imul(d|0,2654435769)^Math.imul(n|0,1367130551))>>>0;return e=Math.imul(e^e>>>16,73244475)>>>0,e=(e^e>>>16)>>>0,e/4294967296}const F=class F{constructor(n,e,t){l(this,"blocks",new Uint8Array(F.CHUNK_WIDTH*F.CHUNK_HEIGHT*F.CHUNK_DEPTH));l(this,"globalPosition",new O);l(this,"opaqueIndex",-1);l(this,"transparentIndex",-1);l(this,"waterIndex",-1);l(this,"drawCommandIndex",-1);l(this,"chunkDataIndex",-1);l(this,"aabbTreeIndex",-1);l(this,"aliveBlocks",0);l(this,"opaqueBlocks",0);l(this,"transparentBlocks",0);l(this,"waterBlocks",0);l(this,"lightBlocks",0);l(this,"isDeleted",!1);this.globalPosition.set(n,e,t)}generateVertices(n){const e=F.CHUNK_WIDTH,t=F.CHUNK_HEIGHT,r=F.CHUNK_DEPTH,i=5;let o=0,a=0,s=0;for(let g=0;g<this.blocks.length;g++){const T=this.blocks[g];T===L.NONE||se(T)||(Se(T)?s++:lt(T)?a++:o++)}const c=new Float32Array(o*36*i),u=new Float32Array(a*36*i),p=new Float32Array(s*6*i),f=new Uint16Array(e*t*6);let h=0,m=0,_=0,w=!1;const v=[],x=e+2,B=t+2,G=x*B,S=new Uint8Array(x*B*(r+2));for(let g=0;g<r;g++)for(let T=0;T<t;T++)for(let y=0;y<e;y++)S[y+1+(T+1)*x+(g+1)*G]=this.blocks[y+T*e+g*e*t];if(n!=null&&n.negX){const g=n.negX;for(let T=0;T<r;T++)for(let y=0;y<t;y++)S[0+(y+1)*x+(T+1)*G]=g[e-1+y*e+T*e*t]}if(n!=null&&n.posX){const g=n.posX;for(let T=0;T<r;T++)for(let y=0;y<t;y++)S[e+1+(y+1)*x+(T+1)*G]=g[0+y*e+T*e*t]}if(n!=null&&n.negY){const g=n.negY;for(let T=0;T<r;T++)for(let y=0;y<e;y++)S[y+1+0+(T+1)*G]=g[y+(t-1)*e+T*e*t]}if(n!=null&&n.posY){const g=n.posY;for(let T=0;T<r;T++)for(let y=0;y<e;y++)S[y+1+(t+1)*x+(T+1)*G]=g[y+0*e+T*e*t]}if(n!=null&&n.negZ){const g=n.negZ;for(let T=0;T<t;T++)for(let y=0;y<e;y++)S[y+1+(T+1)*x+0]=g[y+T*e+(r-1)*e*t]}if(n!=null&&n.posZ){const g=n.posZ;for(let T=0;T<t;T++)for(let y=0;y<e;y++)S[y+1+(T+1)*x+(r+1)*G]=g[y+T*e+0*e*t]}const E=(g,T,y,U)=>{f[(g*t+T)*6+U]|=1<<y},M=(g,T,y,U)=>(f[(g*t+T)*6+U]&1<<y)!==0,A=(g,T,y)=>S[g+1+(T+1)*x+(y+1)*G],R=(g,T)=>!(T===L.NONE||Se(g)||Se(T)||!se(g)&&se(T)),P=F.CUBE_VERTS;for(let g=0;g<e;g++)for(let T=0;T<t;T++)for(let y=0;y<r;y++){const U=A(g,T,y);if(U===L.NONE)continue;if(se(U)){v.push({x:g,y:T,z:y}),w=!0;continue}if(Se(U)){for(let q=0;q<6;q++)p[_++]=g+.5,p[_++]=T+.5,p[_++]=y+.5,p[_++]=6,p[_++]=U;continue}const V=lt(U),z=R(U,A(g,T,y-1))||M(g,T,y,0),I=R(U,A(g,T,y+1))||M(g,T,y,1),K=R(U,A(g-1,T,y))||M(g,T,y,2),de=R(U,A(g+1,T,y))||M(g,T,y,3),fe=R(U,A(g,T-1,y))||M(g,T,y,4),ee=R(U,A(g,T+1,y))||M(g,T,y,5);if(z&&I&&K&&de&&fe&&ee)continue;let ne=T;if(!z||!I||!K||!de){let q=T;for(;q<t&&A(g,q,y)===U;){ne=q;q++}}if(!z||!I){let q=g,$=g,W=0;for(;$<e&&A($,T,y)===U;){let H=T;for(;H<=ne&&A($,H,y)===U;){W=H;H++}if(W===ne)q=$,$++;else break}for(let H=g;H<=q;H++)for(let re=T;re<=ne;re++)z||E(H,re,y,0),I||E(H,re,y,1);let Y,te;!z&&!I?(Y=0,te=12):z?(Y=6,te=12):(Y=0,te=6);const me=q+1-g,ve=ne+1-T,pe=V?u:c;let le=V?m:h;for(let H=Y;H<te;H++){const re=P[H*3],oe=P[H*3+1],ye=P[H*3+2];pe[le++]=g+.5*(me-1)+.5+re*me,pe[le++]=T+.5*(ve-1)+.5+oe*ve,pe[le++]=y+.5+ye,pe[le++]=H<6?0:1,pe[le++]=U}V?m=le:h=le}if(!K||!de){let q=y,$=y,W=0;for(;$<r&&A(g,T,$)===U;){let H=T;for(;H<=ne&&A(g,H,$)===U;){W=H;H++}if(W===ne)q=$,$++;else break}for(let H=y;H<=q;H++)for(let re=T;re<=ne;re++)K||E(g,re,H,2),de||E(g,re,H,3);let Y,te;!K&&!de?(Y=12,te=24):K?(Y=18,te=24):(Y=12,te=18);const me=q+1-y,ve=ne+1-T,pe=V?u:c;let le=V?m:h;for(let H=Y;H<te;H++){const re=P[H*3],oe=P[H*3+1],ye=P[H*3+2];pe[le++]=g+.5+re,pe[le++]=T+.5*(ve-1)+.5+oe*ve,pe[le++]=y+.5*(me-1)+.5+ye*me,pe[le++]=H<18?2:3,pe[le++]=U}V?m=le:h=le}if(!fe||!ee){let q=g,$=g;for(;$<e&&A($,T,y)===U;){q=$;$++}let W=y,Y=y,te=0;for(;Y<r&&A(g,T,Y)===U;){let oe=g;for(;oe<=q&&A(oe,T,Y)===U;){te=oe;oe++}if(te===q)W=Y,Y++;else break}for(let oe=g;oe<=q;oe++)for(let ye=y;ye<=W;ye++)fe||E(oe,T,ye,4),ee||E(oe,T,ye,5);let me,ve;!fe&&!ee?(me=24,ve=36):fe?(me=30,ve=36):(me=24,ve=30);const pe=q+1-g,le=W+1-y,H=V?u:c;let re=V?m:h;for(let oe=me;oe<ve;oe++){const ye=P[oe*3],J=P[oe*3+1],ue=P[oe*3+2];H[re++]=g+.5*(pe-1)+.5+ye*pe,H[re++]=T+.5+J,H[re++]=y+.5*(le-1)+.5+ue*le,H[re++]=oe<30?4:5,H[re++]=U}V?m=re:h=re}}let b=null,C=0;if(w){b=new Float32Array(v.length*6*6*3);let g=0;for(const T of v){const{x:y,y:U,z:N}=T,V=y+1,z=U+1,I=N+1,K=S[V+(z+1)*x+I*G];se(K)||(b[g++]=y,b[g++]=U+1,b[g++]=N,b[g++]=y+1,b[g++]=U+1,b[g++]=N,b[g++]=y+1,b[g++]=U+1,b[g++]=N+1,b[g++]=y,b[g++]=U+1,b[g++]=N,b[g++]=y,b[g++]=U+1,b[g++]=N+1,b[g++]=y+1,b[g++]=U+1,b[g++]=N+1);const de=S[V+z*x+(I+1)*G],fe=N===r-1;!se(de)&&!(fe&&de===L.NONE)&&(b[g++]=y,b[g++]=U,b[g++]=N+1,b[g++]=y+1,b[g++]=U,b[g++]=N+1,b[g++]=y+1,b[g++]=U+1,b[g++]=N+1,b[g++]=y,b[g++]=U,b[g++]=N+1,b[g++]=y,b[g++]=U+1,b[g++]=N+1,b[g++]=y+1,b[g++]=U+1,b[g++]=N+1);const ee=S[V+z*x+(I-1)*G],ne=N===0;!se(ee)&&!(ne&&ee===L.NONE)&&(b[g++]=y+1,b[g++]=U,b[g++]=N,b[g++]=y,b[g++]=U,b[g++]=N,b[g++]=y,b[g++]=U+1,b[g++]=N,b[g++]=y+1,b[g++]=U,b[g++]=N,b[g++]=y+1,b[g++]=U+1,b[g++]=N,b[g++]=y,b[g++]=U+1,b[g++]=N);const q=S[V+1+z*x+I*G],$=y===e-1;!se(q)&&!($&&q===L.NONE)&&(b[g++]=y+1,b[g++]=U,b[g++]=N,b[g++]=y+1,b[g++]=U+1,b[g++]=N,b[g++]=y+1,b[g++]=U+1,b[g++]=N+1,b[g++]=y+1,b[g++]=U,b[g++]=N,b[g++]=y+1,b[g++]=U,b[g++]=N+1,b[g++]=y+1,b[g++]=U+1,b[g++]=N+1);const W=S[V-1+z*x+I*G],Y=y===0;!se(W)&&!(Y&&W===L.NONE)&&(b[g++]=y,b[g++]=U,b[g++]=N+1,b[g++]=y,b[g++]=U+1,b[g++]=N+1,b[g++]=y,b[g++]=U+1,b[g++]=N,b[g++]=y,b[g++]=U,b[g++]=N+1,b[g++]=y,b[g++]=U,b[g++]=N,b[g++]=y,b[g++]=U+1,b[g++]=N);const te=S[V+(z-1)*x+I*G];se(te)||(b[g++]=y,b[g++]=U,b[g++]=N+1,b[g++]=y+1,b[g++]=U,b[g++]=N+1,b[g++]=y+1,b[g++]=U,b[g++]=N,b[g++]=y,b[g++]=U,b[g++]=N+1,b[g++]=y,b[g++]=U,b[g++]=N,b[g++]=y+1,b[g++]=U,b[g++]=N)}C=g/3,b=b.subarray(0,g)}return{opaque:c.subarray(0,h),opaqueCount:h/i,transparent:u.subarray(0,m),transparentCount:m/i,water:b||new Float32Array(0),waterCount:C,prop:p.subarray(0,_),propCount:_/i}}generateBlocks(n,e){const t=F.CHUNK_WIDTH,r=F.CHUNK_HEIGHT,i=F.CHUNK_DEPTH,o=new Float64Array(t*i),a=new Float64Array(t*i),s=new Float32Array(t*i),c=new Uint8Array(t*i),u=new Uint8Array(t*i),p=new Float32Array(t*i);for(let f=0;f<i;f++)for(let h=0;h<t;h++){const m=h+this.globalPosition.x,_=f+this.globalPosition.z,w=h+f*t,v=xe(m/512,-5,_/512,0,0,0,n+31337),x=xe(m/2048,10,_/2048,0,0,0,n);o[w]=Math.abs(xe(m/1024,0,_/1024,0,0,0,n)*450)*Math.max(.1,(x+1)*.5),a[w]=Ar(m/256,15,_/256,2,.6,1.2,6)*12,s[w]=e?e(m,_):0;const B=$o(v);c[w]=B.biome1,u[w]=B.biome2,p[w]=B.blend}for(let f=0;f<i;f++)for(let h=0;h<r;h++)for(let m=0;m<t;m++){if(this.getBlock(m,h,f)!==L.NONE)continue;const _=m+f*t,w=m+this.globalPosition.x,v=h+this.globalPosition.y,x=f+this.globalPosition.z,B=Math.abs(xe(w/256,v/512,x/256,0,0,0,n)*o[_])+a[_]+s[_];v<B?F._isCave(w,v,x,n,B-v)?v<F.SEA_LEVEL+1?this.setBlock(m,h,f,L.WATER):this.setBlock(m,h,f,L.NONE):this.setBlock(m,h,f,this._generateBlockBasedOnBiome(c[_],u[_],p[_],w,v,x,B)):v<F.SEA_LEVEL+1&&this.setBlock(m,h,f,L.WATER)}for(let f=0;f<F.CHUNK_DEPTH;f++)for(let h=0;h<F.CHUNK_HEIGHT;h++)for(let m=0;m<F.CHUNK_WIDTH;m++){if(this.getBlock(m,h,f)===L.NONE)continue;const _=m+this.globalPosition.x,w=h+this.globalPosition.y,v=f+this.globalPosition.z;this._generateAdditionalBlocks(m,h,f,_,w,v,n)}}setBlock(n,e,t,r){if(n<0||n>=F.CHUNK_WIDTH||e<0||e>=F.CHUNK_HEIGHT||t<0||t>=F.CHUNK_DEPTH)return;const i=n+e*F.CHUNK_WIDTH+t*F.CHUNK_WIDTH*F.CHUNK_HEIGHT,o=this.blocks[i];o!==L.NONE&&(this.aliveBlocks--,se(o)?this.waterBlocks--:lt(o)?this.transparentBlocks--:this.opaqueBlocks--,zn(o)&&this.lightBlocks--),this.blocks[i]=r,r!==L.NONE&&(this.aliveBlocks++,se(r)?this.waterBlocks++:lt(r)?this.transparentBlocks++:this.opaqueBlocks++,zn(r)&&this.lightBlocks++)}getBlock(n,e,t){if(n<0||n>=F.CHUNK_WIDTH||e<0||e>=F.CHUNK_HEIGHT||t<0||t>=F.CHUNK_DEPTH)return L.NONE;const r=n+e*F.CHUNK_WIDTH+t*F.CHUNK_WIDTH*F.CHUNK_HEIGHT;return this.blocks[r]}getBlockIndex(n,e,t){return n<0||n>=F.CHUNK_WIDTH||e<0||e>=F.CHUNK_HEIGHT||t<0||t>=F.CHUNK_DEPTH?-1:n+e*F.CHUNK_WIDTH+t*F.CHUNK_WIDTH*F.CHUNK_HEIGHT}_generateAdditionalBlocks(n,e,t,r,i,o,a){const s=this.getBlock(n,e,t),c=this.getBlock(n-1,e,t),u=this.getBlock(n+1,e,t),p=this.getBlock(n,e,t+1),f=this.getBlock(n,e,t-1),h=this.getBlock(n,e+1,t);if(s==L.SAND)if(i>0&&be.global.randomUint32()%512==0){const m=be.global.randomUint32()%5;for(let _=0;_<m;_++)this.setBlock(n,e+_,t,L.CACTUS)}else be.global.randomUint32()%128==0&&this.setBlock(n,e+1,t,L.DEAD_BUSH);else if(s==L.SNOW||s==L.GRASS_SNOW){if(be.global.randomUint32()%16==0&&i>12&&(h==L.NONE||se(h))&&(c==L.NONE||f==L.NONE))this.setBlock(n,e+1,t,L.DEAD_BUSH);else if(be.global.randomUint32()%16==0&&i>12&&i<300&&e<F.CHUNK_HEIGHT-5&&n>2&&t>2&&n<F.CHUNK_WIDTH-2&&t<F.CHUNK_DEPTH-2&&h==L.NONE&&u==L.NONE&&p==L.NONE&&f==L.NONE){const _=Math.max(be.global.randomUint32()%5,5);for(let w=0;w<_;w++)this.setBlock(n,e+w,t,L.TRUNK);for(let w=-2;w<=2;w++){const v=w<-1||w>1?0:-1,x=w<-1||w>1?0:1;for(let B=-1+v;B<=1+x;B++){const G=Math.abs(B-n);for(let S=-1+v;S<=1+x;S++){const E=Math.abs(S-t),M=B*B+w*w+S*S,A=this.getBlock(n+B,e+_+w,t+S);M+2<be.global.randomUint32()%24&&G!=2-v&&G!=2+x&&E!=2-v&&E!=2+x&&(A==L.NONE||A==L.SNOWYLEAVES)&&this.setBlock(n+B,e+_+w,t+S,L.SNOWYLEAVES)}}}}}else if(s==L.GRASS||s==L.DIRT)if(be.global.randomUint32()%2==0&&i>5&&i<300&&e<F.CHUNK_HEIGHT-5&&n>2&&t>2&&n<F.CHUNK_WIDTH-2&&t<F.CHUNK_DEPTH-2&&h==L.NONE&&u==L.NONE&&p==L.NONE&&f==L.NONE){const _=Math.max(be.global.randomUint32()%5,5);for(let w=0;w<_;w++)this.setBlock(n,e+w,t,L.TRUNK);for(let w=-2;w<=2;w++){const v=w<-1||w>1?0:-1,x=w<-1||w>1?0:1;for(let B=-1+v;B<=1+x;B++){const G=Math.abs(B-n);for(let S=-1+v;S<=1+x;S++){const E=Math.abs(S-t),M=B*B+w*w+S*S,A=this.getBlock(n+B,e+_+w,t+S);M+2<be.global.randomUint32()%24&&G!=2-v&&G!=2+x&&E!=2-v&&E!=2+x&&(A==L.NONE||A==L.TREELEAVES)&&this.setBlock(n+B,e+_+w,t+S,L.TREELEAVES)}}}}else i>5&&h==L.NONE&&(c==L.NONE||f==L.NONE)&&(be.global.randomUint32()%8==0?this.setBlock(n,e+1,t,L.GRASS_PROP):be.global.randomUint32()%8==0&&this.setBlock(n,e+1,t,L.FLOWER))}_generateBlockBasedOnBiome(n,e,t,r,i,o,a){const s=t>0&&n!==e&&Zo(r,o)<t?e:n,c=Math.floor(a)-i,u=a<F.SEA_LEVEL+1;switch(s){case we.GrassyPlains:return c===0?u?L.DIRT:L.GRASS:c<=3?L.DIRT:L.STONE;case we.Desert:return c<=3?L.SAND:L.STONE;case we.SnowyPlains:return c===0?L.GRASS_SNOW:c<=2?L.SNOW:L.STONE;case we.SnowyMountains:{const p=Math.abs(Dn(r/256,i/256,o/256,2,.6,1))*35;return c===0?L.GRASS_SNOW:c<=4||p>20?L.SNOW:L.STONE}case we.RockyMountains:return c===0&&Math.abs(Dn(r/64,i/64,o/64,2,.6,1))<.12?L.SNOW:L.STONE;default:return L.GRASS}}static _determineBiomeFromNoise(n){return n>.35?we.Desert:n>-.15?we.GrassyPlains:n>-.3?we.SnowyPlains:n>-.5?we.SnowyMountains:we.RockyMountains}static _determineBiome(n,e,t,r){const i=xe(n/512,-5,t/512,0,0,0,r+31337);return F._determineBiomeFromNoise(i)}static _isCave(n,e,t,r,i){if(i<3)return!1;if(xe(n/60,e/60,t/60,0,0,0,r+777)>.6)return!0;const a=xe(n/24,e/24,t/24,0,0,0,r+13579),s=xe(n/24,e/14,t/24,0,0,0,r+24680);if(Math.abs(a)<.12&&Math.abs(s)<.12)return!0;const c=xe(n/28,e/18,t/28,0,0,0,r+55555),u=xe(n/28,e/28,t/28,0,0,0,r+99999);return Math.abs(c)<.1&&Math.abs(u)<.1}};l(F,"CHUNK_WIDTH",16),l(F,"CHUNK_HEIGHT",16),l(F,"CHUNK_DEPTH",16),l(F,"SEA_LEVEL",15),l(F,"CUBE_VERTS",new Float32Array([-.5,-.5,-.5,.5,.5,-.5,.5,-.5,-.5,.5,.5,-.5,-.5,-.5,-.5,-.5,.5,-.5,-.5,-.5,.5,.5,-.5,.5,.5,.5,.5,.5,.5,.5,-.5,.5,.5,-.5,-.5,.5,-.5,.5,.5,-.5,.5,-.5,-.5,-.5,-.5,-.5,-.5,-.5,-.5,-.5,.5,-.5,.5,.5,.5,.5,.5,.5,-.5,-.5,.5,.5,-.5,.5,-.5,-.5,.5,.5,.5,.5,-.5,.5,-.5,-.5,-.5,.5,-.5,-.5,.5,-.5,.5,.5,-.5,.5,-.5,-.5,.5,-.5,-.5,-.5,-.5,.5,-.5,.5,.5,.5,.5,.5,-.5,.5,.5,.5,-.5,.5,-.5,-.5,.5,.5]));let X=F;const Ir=128;function Qo(d,n,e){const t=xe(d/2048,10,n/2048,0,0,0,e),r=Math.abs(xe(d/1024,0,n/1024,0,0,0,e)*450)*Math.max(.1,(t+1)*.5),i=Ar(d/256,15,n/256,2,.6,1.2,6)*12;return Math.abs(xe(d/256,0,n/256,0,0,0,e)*r)+i}function xr(d,n,e,t){const r=e|0,i=t|0,o=e-r,a=t-i,s=d[r+i*n],c=d[r+1+i*n],u=d[r+(i+1)*n],p=d[r+1+(i+1)*n];return[(c-s)*(1-a)+(p-u)*a,(u-s)*(1-o)+(p-c)*o,s*(1-o)*(1-a)+c*o*(1-a)+u*(1-o)*a+p*o*a]}function wr(d){return Math.imul(d,1664525)+1013904223>>>0}function Jo(d,n,e){const t=n*n>>2,r=.05,i=4,o=.01,a=.4,s=.3,c=.01,u=4,p=20,f=2,h=f*2+1,m=new Float32Array(h*h);let _=0;for(let x=-f;x<=f;x++)for(let B=-f;B<=f;B++){const G=Math.sqrt(B*B+x*x);if(G<f){const S=1-G/f;m[B+f+(x+f)*h]=S,_+=S}}for(let x=0;x<m.length;x++)m[x]/=_;const w=n-2;let v=(e^3735928559)>>>0;for(let x=0;x<t;x++){v=wr(v);let B=v/4294967295*w;v=wr(v);let G=v/4294967295*w,S=0,E=0,M=1,A=1,R=0;for(let P=0;P<p;P++){const b=B|0,C=G|0;if(b<0||b>=w||C<0||C>=w)break;const g=B-b,T=G-C,[y,U,N]=xr(d,n,B,G);S=S*r-y*(1-r),E=E*r-U*(1-r);const V=Math.sqrt(S*S+E*E);if(V<1e-6)break;S/=V,E/=V;const z=B+S,I=G+E;if(z<0||z>=w||I<0||I>=w)break;const[,,K]=xr(d,n,z,I),de=K-N,fe=Math.max(-de*M*A*i,o);if(R>fe||de>0){const ee=de>0?Math.min(de,R):(R-fe)*s;R-=ee,d[b+C*n]+=ee*(1-g)*(1-T),d[b+1+C*n]+=ee*g*(1-T),d[b+(C+1)*n]+=ee*(1-g)*T,d[b+1+(C+1)*n]+=ee*g*T}else{const ee=Math.min((fe-R)*a,-de);for(let ne=-f;ne<=f;ne++)for(let q=-f;q<=f;q++){const $=b+q,W=C+ne;$<0||$>=n||W<0||W>=n||(d[$+W*n]-=m[q+f+(ne+f)*h]*ee)}R+=ee}M=Math.sqrt(Math.max(M*M+de*u,0)),A*=1-c,B=z,G=I}}}function ea(d,n,e){const t=Ir,r=d*t,i=n*t,o=new Float32Array(t*t);for(let p=0;p<t;p++)for(let f=0;f<t;f++)o[f+p*t]=Qo(r+f,i+p,e);const a=new Float32Array(o),s=(e^(Math.imul(d,73856093)^Math.imul(n,19349663)))>>>0;Jo(a,t,s);const c=12,u=new Float32Array(t*t);for(let p=0;p<t;p++)for(let f=0;f<t;f++){const h=f+p*t,m=Math.min(f,t-1-f,p,t-1-p),_=Math.min(m/c,1);u[h]=(a[h]-o[h])*_}return u}const D=class D{constructor(n){l(this,"seed");l(this,"renderDistanceH",8);l(this,"renderDistanceV",4);l(this,"chunksPerFrame",2);l(this,"time",0);l(this,"waterSimulationRadius",32);l(this,"waterTickInterval",.25);l(this,"_waterTickTimer",0);l(this,"_dirtyChunks",null);l(this,"onChunkAdded");l(this,"onChunkUpdated");l(this,"onChunkRemoved");l(this,"_chunks",new Map);l(this,"_generated",new Set);l(this,"_erosionCache",new Map);l(this,"pendingChunks",0);l(this,"_neighborScratch",{negX:void 0,posX:void 0,negY:void 0,posY:void 0,negZ:void 0,posZ:void 0});l(this,"_scratchTopD2",null);l(this,"_scratchTopXYZ",null);l(this,"_scratchToDelete",[]);l(this,"_scratchWaterBlocks",[]);l(this,"_scratchDirtyChunks",new Set);this.seed=n}get chunkCount(){return this._chunks.size}get chunks(){return this._chunks.values()}getBiomeAt(n,e,t){return X._determineBiome(n,e,t,this.seed)}static normalizeChunkPosition(n,e,t){return[Math.floor(n/X.CHUNK_WIDTH),Math.floor(e/X.CHUNK_HEIGHT),Math.floor(t/X.CHUNK_DEPTH)]}static _cx(n){return Math.floor(n/X.CHUNK_WIDTH)}static _cy(n){return Math.floor(n/X.CHUNK_HEIGHT)}static _cz(n){return Math.floor(n/X.CHUNK_DEPTH)}static _key(n,e,t){return(n+32768)*4294967296+(e+32768)*65536+(t+32768)}getChunk(n,e,t){return this._chunks.get(D._key(D._cx(n),D._cy(e),D._cz(t)))}chunkExists(n,e,t){return this.getChunk(n,e,t)!==void 0}getBlockType(n,e,t){const r=this.getChunk(n,e,t);if(!r)return L.NONE;const i=Math.round(n)-r.globalPosition.x,o=Math.round(e)-r.globalPosition.y,a=Math.round(t)-r.globalPosition.z;return r.getBlock(i,o,a)}setBlockType(n,e,t,r){let i=this.getChunk(n,e,t);if(!i){const c=D._cx(n),u=D._cy(e),p=D._cz(t);i=new X(c*X.CHUNK_WIDTH,u*X.CHUNK_HEIGHT,p*X.CHUNK_DEPTH),this._insertChunk(i)}const o=Math.round(n)-i.globalPosition.x,a=Math.round(e)-i.globalPosition.y,s=Math.round(t)-i.globalPosition.z;return i.setBlock(o,a,s,r),this._updateChunk(i,o,a,s),!0}getTopBlockY(n,e,t){const r=X.CHUNK_HEIGHT,i=Math.floor(n),o=Math.floor(e);for(let a=Math.floor(t/r);a>=0;a--){const s=this.getChunk(i,a*r,o);if(!s)continue;const c=i-s.globalPosition.x,u=o-s.globalPosition.z;for(let p=r-1;p>=0;p--){const f=s.getBlock(c,p,u);if(f!==L.NONE&&!Se(f))return s.globalPosition.y+p+1}}return 0}getBlockByRay(n,e,t){const r=Number.MAX_VALUE;let i=Math.floor(n.x),o=Math.floor(n.y),a=Math.floor(n.z);const s=1/e.x,c=1/e.y,u=1/e.z,p=e.x>0?1:-1,f=e.y>0?1:-1,h=e.z>0?1:-1,m=Math.min(s*p,r),_=Math.min(c*f,r),w=Math.min(u*h,r);let v=Math.abs((i+Math.max(p,0)-n.x)*s),x=Math.abs((o+Math.max(f,0)-n.y)*c),B=Math.abs((a+Math.max(h,0)-n.z)*u),G=0,S=0,E=0;for(let M=0;M<t;M++){if(M>0){const A=this.getChunk(i,o,a);if(A){const R=i-A.globalPosition.x,P=o-A.globalPosition.y,b=a-A.globalPosition.z,C=A.getBlock(R,P,b);if(C!==L.NONE&&!se(C))return{blockType:C,position:new O(i,o,a),face:new O(-G*p,-S*f,-E*h),chunk:A,relativePosition:new O(R,P,b)}}}G=(v<=B?1:0)*(v<=x?1:0),S=(x<=v?1:0)*(x<=B?1:0),E=(B<=x?1:0)*(B<=v?1:0),v+=m*G,x+=_*S,B+=w*E,i+=p*G,o+=f*S,a+=h*E}return null}addBlock(n,e,t,r,i,o,a){if(a===L.NONE||!this.getChunk(n,e,t))return!1;const c=this.getBlockType(n,e,t);if(Se(c))return!1;const u=n+r,p=e+i,f=t+o,h=this.getBlockType(u,p,f);if(se(a)){if(h!==L.NONE&&!se(h))return!1}else if(h!==L.NONE&&!se(h))return!1;let m=this.getChunk(u,p,f);if(!m){const x=D._cx(u),B=D._cy(p),G=D._cz(f);m=new X(x*X.CHUNK_WIDTH,B*X.CHUNK_HEIGHT,G*X.CHUNK_DEPTH),this._insertChunk(m)}const _=u-m.globalPosition.x,w=p-m.globalPosition.y,v=f-m.globalPosition.z;return m.setBlock(_,w,v,a),this._updateChunk(m,_,w,v),!0}mineBlock(n,e,t){const r=this.getChunk(n,e,t);if(!r)return!1;const i=n-r.globalPosition.x,o=e-r.globalPosition.y,a=t-r.globalPosition.z,s=r.getBlock(i,o,a);return s===L.NONE?!1:se(s)?(r.setBlock(i,o,a,L.NONE),this._updateChunk(r,i,o,a),!0):(r.setBlock(i,o,a,L.NONE),this._updateChunk(r,i,o,a),!0)}update(n,e){this.time+=e,this._removeDistantChunks(n),this._createNearbyChunks(n),this._waterTickTimer+=e,this._waterTickTimer>=this.waterTickInterval&&(this._waterTickTimer=0,this._updateWaterFlow(n))}deleteChunk(n){var o;const e=D._cx(n.globalPosition.x),t=D._cy(n.globalPosition.y),r=D._cz(n.globalPosition.z),i=D._key(e,t,r);this._chunks.delete(i),this._generated.delete(i),n.isDeleted=!0,(o=this.onChunkRemoved)==null||o.call(this,n)}calcWaterLevel(n,e,t){const r=this.getChunk(n,e,t);if(!r||r.waterBlocks<=0)return 0;let i=this._calcWaterLevelInChunk(r,e);for(let o=1;o<=4;o++){const a=this.getChunk(n,e+o*X.CHUNK_HEIGHT,t);if(!a)break;const s=D._cx(n),c=D._cz(t),u=s*X.CHUNK_WIDTH-a.globalPosition.x,p=c*X.CHUNK_DEPTH-a.globalPosition.z;if(a.waterBlocks>0&&se(a.getBlock(u,0,p)))i+=this._calcWaterLevelInChunk(a,e);else break}return i}_calcWaterLevelInChunk(n,e){const t=n.globalPosition.y,r=X.CHUNK_HEIGHT;let i=0;return e<=t+r*.8&&i++,e<=t+r*.7&&i++,e<=t+r*.6&&i++,e<=t+r*.5&&i++,i}_getErosionRegion(n,e){const t=`${n},${e}`;let r=this._erosionCache.get(t);return r||(r=ea(n,e,this.seed),this._erosionCache.set(t,r)),r}getErosionDisplacement(n,e){const t=Ir,r=Math.floor(n/t),i=Math.floor(e/t),o=(n%t+t)%t,a=(e%t+t)%t;return this._getErosionRegion(r,i)[o+a*t]}_insertChunk(n){const e=D._cx(n.globalPosition.x),t=D._cy(n.globalPosition.y),r=D._cz(n.globalPosition.z);this._chunks.set(D._key(e,t,r),n),n.isDeleted=!1}_gatherNeighbors(n,e,t){var i,o,a,s,c,u;const r=this._neighborScratch;return r.negX=(i=this._chunks.get(D._key(n-1,e,t)))==null?void 0:i.blocks,r.posX=(o=this._chunks.get(D._key(n+1,e,t)))==null?void 0:o.blocks,r.negY=(a=this._chunks.get(D._key(n,e-1,t)))==null?void 0:a.blocks,r.posY=(s=this._chunks.get(D._key(n,e+1,t)))==null?void 0:s.blocks,r.negZ=(c=this._chunks.get(D._key(n,e,t-1)))==null?void 0:c.blocks,r.posZ=(u=this._chunks.get(D._key(n,e,t+1)))==null?void 0:u.blocks,r}_remeshSingleNeighbor(n,e,t){var i;const r=this._chunks.get(D._key(n,e,t));r&&((i=this.onChunkUpdated)==null||i.call(this,r,r.generateVertices(this._gatherNeighbors(n,e,t))))}_updateChunk(n,e,t,r){var p;const i=D._cx(n.globalPosition.x),o=D._cy(n.globalPosition.y),a=D._cz(n.globalPosition.z);if(this._dirtyChunks){if(this._dirtyChunks.add(n),e===void 0)return;const f=X.CHUNK_WIDTH,h=X.CHUNK_HEIGHT,m=X.CHUNK_DEPTH,_=(w,v,x)=>{const B=this._chunks.get(D._key(w,v,x));B&&this._dirtyChunks.add(B)};e===0&&_(i-1,o,a),e===f-1&&_(i+1,o,a),t===0&&_(i,o-1,a),t===h-1&&_(i,o+1,a),r===0&&_(i,o,a-1),r===m-1&&_(i,o,a+1);return}if((p=this.onChunkUpdated)==null||p.call(this,n,n.generateVertices(this._gatherNeighbors(i,o,a))),e===void 0)return;const s=X.CHUNK_WIDTH,c=X.CHUNK_HEIGHT,u=X.CHUNK_DEPTH;e===0&&this._remeshSingleNeighbor(i-1,o,a),e===s-1&&this._remeshSingleNeighbor(i+1,o,a),t===0&&this._remeshSingleNeighbor(i,o-1,a),t===c-1&&this._remeshSingleNeighbor(i,o+1,a),r===0&&this._remeshSingleNeighbor(i,o,a-1),r===u-1&&this._remeshSingleNeighbor(i,o,a+1)}_createNearbyChunks(n){const e=D._cx(n.x),t=D._cy(n.y),r=D._cz(n.z),i=this.renderDistanceH,o=this.renderDistanceV,a=i*i,s=Math.max(1,this.chunksPerFrame);(!this._scratchTopD2||this._scratchTopD2.length!==s)&&(this._scratchTopD2=new Float64Array(s),this._scratchTopXYZ=new Int32Array(s*3));for(let f=0;f<s;f++)this._scratchTopD2[f]=1/0;let c=0,u=0,p=1/0;for(let f=-i;f<=i;f++){const h=f*f;for(let m=-i;m<=i;m++){const _=h+m*m;if(!(_>a))for(let w=-o;w<=o;w++){const v=e+f,x=t+w,B=r+m;if(this._generated.has(D._key(v,x,B)))continue;c++;const G=_+w*w;if(!(G>=p)){this._scratchTopD2[u]=G,this._scratchTopXYZ[u*3]=v,this._scratchTopXYZ[u*3+1]=x,this._scratchTopXYZ[u*3+2]=B,p=-1/0;for(let S=0;S<s;S++){const E=this._scratchTopD2[S];E>p&&(p=E,u=S)}}}}}if(this.pendingChunks=c,!(this._chunks.size>=D.MAX_CHUNKS))for(let f=0;f<s;f++){let h=-1,m=1/0;for(let x=0;x<s;x++){const B=this._scratchTopD2[x];B<m&&(m=B,h=x)}if(h<0||m===1/0||this._chunks.size>=D.MAX_CHUNKS)break;const _=this._scratchTopXYZ[h*3],w=this._scratchTopXYZ[h*3+1],v=this._scratchTopXYZ[h*3+2];this._scratchTopD2[h]=1/0,this._createChunkAt(_,w,v)}}_removeDistantChunks(n){const e=D._cx(n.x),t=D._cy(n.y),r=D._cz(n.z),i=this.renderDistanceH+1,o=this.renderDistanceV+1,a=this._scratchToDelete;a.length=0;for(const s of this._chunks.values()){const c=D._cx(s.globalPosition.x),u=D._cy(s.globalPosition.y),p=D._cz(s.globalPosition.z),f=c-e,h=u-t,m=p-r;(f*f+m*m>i*i||Math.abs(h)>o)&&a.push(s)}for(let s=0;s<a.length;s++)this.deleteChunk(a[s]);a.length=0}_createChunkAt(n,e,t){var o;const r=D._key(n,e,t);this._generated.add(r);const i=new X(n*X.CHUNK_WIDTH,e*X.CHUNK_HEIGHT,t*X.CHUNK_DEPTH);i.generateBlocks(this.seed,(a,s)=>this.getErosionDisplacement(a,s)),i.aliveBlocks>0&&(this._insertChunk(i),(o=this.onChunkAdded)==null||o.call(this,i,i.generateVertices(this._gatherNeighbors(n,e,t))),this._remeshSingleNeighbor(n-1,e,t),this._remeshSingleNeighbor(n+1,e,t),this._remeshSingleNeighbor(n,e-1,t),this._remeshSingleNeighbor(n,e+1,t),this._remeshSingleNeighbor(n,e,t-1),this._remeshSingleNeighbor(n,e,t+1))}_updateWaterFlow(n){var G;const e=this.waterSimulationRadius,t=Math.floor(n.x-e),r=Math.floor(n.x+e),i=Math.floor(Math.max(0,n.y-e)),o=Math.floor(n.y+e),a=Math.floor(n.z-e),s=Math.floor(n.z+e),c=X.CHUNK_WIDTH,u=X.CHUNK_HEIGHT,p=X.CHUNK_DEPTH,f=Math.floor(t/c),h=Math.floor(r/c),m=Math.floor(i/u),_=Math.floor(o/u),w=Math.floor(a/p),v=Math.floor(s/p),x=this._scratchWaterBlocks;x.length=0;for(let S=f;S<=h;S++)for(let E=m;E<=_;E++)for(let M=w;M<=v;M++){const A=this._chunks.get(D._key(S,E,M));if(!A||A.waterBlocks===0)continue;const R=A.globalPosition.x,P=A.globalPosition.y,b=A.globalPosition.z,C=Math.max(0,t-R),g=Math.min(c-1,r-R),T=Math.max(0,i-P),y=Math.min(u-1,o-P),U=Math.max(0,a-b),N=Math.min(p-1,s-b);for(let V=U;V<=N;V++)for(let z=T;z<=y;z++)for(let I=C;I<=g;I++)se(A.getBlock(I,z,V))&&x.push(R+I,P+z,b+V)}const B=this._scratchDirtyChunks;B.clear(),this._dirtyChunks=B;try{for(let S=0;S<x.length;S+=3)this._flowWater(x[S],x[S+1],x[S+2])}finally{this._dirtyChunks=null}for(const S of B){const E=D._cx(S.globalPosition.x),M=D._cy(S.globalPosition.y),A=D._cz(S.globalPosition.z);(G=this.onChunkUpdated)==null||G.call(this,S,S.generateVertices(this._gatherNeighbors(E,M,A)))}B.clear(),x.length=0}_flowWater(n,e,t){const r=this.getBlockType(n,e-1,t);if(r===L.NONE||Se(r)){this.setBlockType(n,e-1,t,L.WATER),this.setBlockType(n,e,t,L.NONE);return}let i=!1;for(let o=1;o<=4;o++){const a=this.getBlockType(n,e-o,t);if(a!==L.NONE&&!se(a)&&!Se(a)){i=!0;break}if(a===L.NONE||Se(a))break}if(!i){const o=[{x:n+1,y:e,z:t},{x:n-1,y:e,z:t},{x:n,y:e,z:t+1},{x:n,y:e,z:t-1}];for(const a of o){const s=this.getBlockType(a.x,a.y,a.z);if(s===L.NONE||Se(s)){this.setBlockType(a.x,a.y,a.z,L.WATER),this.setBlockType(n,e,t,L.NONE);return}}}if(i){const o=[{x:n+1,y:e,z:t},{x:n-1,y:e,z:t},{x:n,y:e,z:t+1},{x:n,y:e,z:t-1}];for(const a of o){const s=this.getBlockType(a.x,a.y,a.z);if(s===L.NONE||Se(s)){this.setBlockType(a.x,a.y,a.z,L.WATER);return}}}}};l(D,"MAX_CHUNKS",2048);let Yt=D;function Pt(d,n,e,t,r,i,o,a){const s=[{n:[0,0,-1],t:[-1,0,0,1],v:[[-i,-o,-a],[i,-o,-a],[i,o,-a],[-i,o,-a]]},{n:[0,0,1],t:[1,0,0,1],v:[[i,-o,a],[-i,-o,a],[-i,o,a],[i,o,a]]},{n:[-1,0,0],t:[0,0,-1,1],v:[[-i,-o,a],[-i,-o,-a],[-i,o,-a],[-i,o,a]]},{n:[1,0,0],t:[0,0,1,1],v:[[i,-o,-a],[i,-o,a],[i,o,a],[i,o,-a]]},{n:[0,1,0],t:[1,0,0,1],v:[[-i,o,-a],[i,o,-a],[i,o,a],[-i,o,a]]},{n:[0,-1,0],t:[1,0,0,1],v:[[-i,-o,a],[i,-o,a],[i,-o,-a],[-i,-o,-a]]}],c=[[0,1],[1,1],[1,0],[0,0]];for(const u of s){const p=d.length/12;for(let f=0;f<4;f++){const[h,m,_]=u.v[f];d.push(e+h,t+m,r+_,u.n[0],u.n[1],u.n[2],c[f][0],c[f][1],u.t[0],u.t[1],u.t[2],u.t[3])}n.push(p,p+2,p+1,p,p+3,p+2)}}function ta(d){const n=[],e=[];return Pt(n,e,0,0,0,.19,.11,.225),Pt(n,e,0,.07,.225,.075,.06,.06),Ce.fromData(d,new Float32Array(n),new Uint32Array(e))}function na(d){const n=[],e=[];return Pt(n,e,0,0,0,.085,.085,.075),Ce.fromData(d,new Float32Array(n),new Uint32Array(e))}function ra(d){const n=[],e=[];return Pt(n,e,0,0,0,.065,.03,.055),Ce.fromData(d,new Float32Array(n),new Uint32Array(e))}const ia=new O(0,1,0),Tt=class Tt extends $e{constructor(e){super();l(this,"_world");l(this,"_state","idle");l(this,"_timer",0);l(this,"_targetX",0);l(this,"_targetZ",0);l(this,"_hasTarget",!1);l(this,"_velY",0);l(this,"_yaw",0);l(this,"_headGO",null);l(this,"_headBaseY",0);l(this,"_bobPhase");this._world=e,this._timer=1+Math.random()*4,this._yaw=Math.random()*Math.PI*2,this._bobPhase=Math.random()*Math.PI*2}onAttach(){for(const e of this.gameObject.children)if(e.name==="Duck.Head"){this._headGO=e,this._headBaseY=e.position.y;break}}update(e){const t=this.gameObject,r=t.position.x,i=t.position.z,o=Tt.playerPos,a=o.x-r,s=o.z-i,c=a*a+s*s;this._velY-=9.8*e,t.position.y+=this._velY*e;const u=this._world.getTopBlockY(Math.floor(r),Math.floor(i),Math.ceil(t.position.y)+4);if(u>0&&t.position.y<=u+.1){const p=this._world.getBlockType(Math.floor(r),Math.floor(u-1),Math.floor(i));L.WATER,t.position.y=u,this._velY=0}switch(this._state){case"idle":{this._timer-=e,c<36?this._enterFlee():this._timer<=0&&this._pickWanderTarget();break}case"wander":{if(this._timer-=e,c<36){this._enterFlee();break}if(!this._hasTarget||this._timer<=0){this._enterIdle();break}const p=this._targetX-r,f=this._targetZ-i,h=p*p+f*f;if(h<.25){this._enterIdle();break}const m=Math.sqrt(h),_=p/m,w=f/m;t.position.x+=_*1.5*e,t.position.z+=w*1.5*e,this._yaw=Math.atan2(-_,-w);break}case"flee":{if(c>196){this._enterIdle();break}const p=Math.sqrt(c),f=p>0?-a/p:0,h=p>0?-s/p:0;t.position.x+=f*4*e,t.position.z+=h*4*e,this._yaw=Math.atan2(-f,-h);break}}if(t.rotation=_e.fromAxisAngle(ia,this._yaw),this._headGO){this._bobPhase+=e*(this._state==="wander"?6:2);const p=this._state==="wander"?.018:.008;this._headGO.position.y=this._headBaseY+Math.sin(this._bobPhase)*p}}_enterIdle(){this._state="idle",this._hasTarget=!1,this._timer=2+Math.random()*5}_enterFlee(){this._state="flee",this._hasTarget=!1}_pickWanderTarget(){const e=this.gameObject,t=Math.random()*Math.PI*2,r=3+Math.random()*8;this._targetX=e.position.x+Math.cos(t)*r,this._targetZ=e.position.z+Math.sin(t)*r,this._hasTarget=!0,this._state="wander",this._timer=6+Math.random()*6}};l(Tt,"playerPos",new O(0,0,0));let Xe=Tt;const Br=""+new URL("hotbar-DkVq2FsR.png",import.meta.url).href,bt=[L.DIRT,L.IRON,L.STONE,L.SAND,L.TRUNK,L.SPRUCE_PLANKS,L.GLASS,L.TORCH,L.WATER];function oa(d){const n=bt.length;let e=0;const t=document.createElement("div");t.style.cssText=["position:fixed","bottom:12px","left:50%","transform:translateX(-50%)","display:flex","flex-direction:row","flex-wrap:nowrap","align-items:center","gap:0px","background:url("+Br+") no-repeat","background-position:-48px 0px","background-size:414px 48px","width:364px","height:44px","padding:1px 2px","image-rendering:pixelated","box-sizing:border-box"].join(";");const r=[];for(let u=0;u<n;u++){const p=document.createElement("div");p.style.cssText=["width:40px","height:40px","display:flex","align-items:center","justify-content:center","position:relative","flex-shrink:0"].join(";");const f=document.createElement("canvas");f.width=f.height=32,f.style.cssText="width:32px;height:32px;image-rendering:pixelated;",p.appendChild(f);const h=document.createElement("span");h.textContent=String(u+1),h.style.cssText=["position:absolute","top:1px","left:3px","font-family:ui-monospace,monospace","font-size:9px","color:#ccc","text-shadow:0 0 2px #000","pointer-events:none"].join(";"),p.appendChild(h),t.appendChild(p),r.push(f)}document.body.appendChild(t);const i=document.createElement("div");i.style.cssText=["position:fixed","bottom:12px","width:44px","height:48px","background:url("+Br+") no-repeat","background-position:0px 0px","background-size:414px 48px","pointer-events:none","image-rendering:pixelated","transition:left 60ms linear"].join(";"),document.body.appendChild(i);let o=null;function a(){const u=t.getBoundingClientRect();i.style.left=u.left-2+e*40+"px",o==null||o()}const s=new Image;s.src=d;function c(){if(!s.complete)return;const u=16;for(let p=0;p<n;p++){const f=At.find(m=>m.blockType===bt[p]),h=r[p].getContext("2d");h.clearRect(0,0,32,32),f&&(h.imageSmoothingEnabled=!1,h.drawImage(s,f.sideFace.x*u,f.sideFace.y*u,u,u,0,0,32,32))}}return s.onload=c,window.addEventListener("keydown",u=>{const p=parseInt(u.key);p>=1&&p<=n&&(e=p-1,a())}),window.addEventListener("wheel",u=>{e=(e+(u.deltaY>0?1:n-1))%n,a()},{passive:!0}),requestAnimationFrame(a),{getSelected:()=>bt[e],refresh:c,getSelectedSlot:()=>e,setSelectedSlot:u=>{e=u,a()},setOnSelectionChanged:u=>{o=u},slots:bt,element:t}}const aa="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAACWCAYAAADwkd5lAAAD7ElEQVR4nO3dUU7bahSF0eOqgyIwDU/EkmcBUibicQRm5ftyE7UoacvOb+LEa0l9obD7P/VTKdKpAgAA+C7dX35//pZXALBWFzvxp4DM86wfAFvWdV3VhVZcCoh4AFBVlyNyLiCneLy/vy/7KgBWbbfbVdX5iPy4wXsAeAACAkBEQACICAgAEQEBIPLzK588DMPVf2Df9zVNkx07duxsfqflVqud/X7/z5/7pR/jHYah+r6/5m01jmM9PT3ZsWPHzuZ3pmmqj4+Pent7W83O54D4MV4AmhMQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAANDMfHQ6H3369vr7OLdixY8eOnXW95bjz+e/9o6qaP8fiywelrrW261t27Nixc6udlltLXST800EpFwnt2LFj50Y7LhICsEkCAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgGZOF6hcJLRjx46d5XbW9JbjjouEduzYsXMHOy23XCS0Y8eOnQ3tuEgIwCYJCAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQAJo5XaBykdCOHTt2lttZ01uOOy4S2rFjx84d7LTccpHQjh07dja04yIhAJskIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAGjmdIHKRUI7duzYWW5nTW857rhIaMeOHTt3sNNyy0VCO3bs2NnQjouEAGySgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBAaCZ0wUqFwnt2LFjZ7mdNb3luOMioR07duzcwU7LLRcJ7dixY2dDOy4SArBJAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBIBmTheoXCS0Y8eOneV21vSW485iFwkB2BYHpQBoTkAAiAgIAJGft34AyxmG4eqNvu9rmiY7duKdl5eXq3dYJwF5cH3fX/X14zjWNE127MQ7fhjncfkWFgARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkDEPZAH1vd9jeNox85Nd3hc3ZmPzfM8V1U5BAOwcbvdrqqquq6r+tQM38ICICIgAEQEBIDIuf9E77qumw+HQ+33+29/EADr8vz8XHXm/8wv/Quk+/8LANiwS/G4+MFfzM1fA8A9+VsnAAAAvsF/uG+b8sfhThMAAAAASUVORK5CYII=";function sa(d,n,e,t,r,i){const w=[];for(let C=1;C<L.MAX;C++)C!==L.WATER&&w.push(C);const v=document.createElement("div");v.style.cssText="position:relative;display:inline-block;align-self:center;";const x=document.createElement("img");x.src=aa,x.draggable=!1,x.style.cssText=[`width:${400*2}px`,`height:${150*2}px`,"display:block","image-rendering:pixelated","user-select:none"].join(";"),v.appendChild(x);const B=new Image;B.src=n;function G(C,g){const T=C.getContext("2d");if(T.clearRect(0,0,C.width,C.height),!g)return;const y=At.find(U=>U.blockType===g);y&&(T.imageSmoothingEnabled=!1,T.drawImage(B,y.sideFace.x*16,y.sideFace.y*16,16,16,0,0,C.width,C.height))}let S=null,E=null;const M=[];function A(){M.forEach((C,g)=>{C.style.outline=g===r()?"2px solid #ff0":""})}function R(C,g,T){const y=document.createElement("div");y.style.cssText=["position:absolute",`left:${C}px`,`top:${g}px`,"width:32px","height:32px","box-sizing:border-box","cursor:grab"].join(";"),y.draggable=T;const U=document.createElement("canvas");return U.width=U.height=32,U.style.cssText="width:32px;height:32px;image-rendering:pixelated;pointer-events:none;display:block;",y.appendChild(U),v.appendChild(y),[y,U]}for(let C=0;C<6;C++)for(let g=0;g<21;g++){const T=w[C*21+g]??null;if(!T)continue;const[y,U]=R(24+g*36,24+C*36,!0);y.title=String(di[T]),B.complete?G(U,T):B.addEventListener("load",()=>G(U,T),{once:!1}),y.addEventListener("click",()=>{e[r()]=T,b(),t()}),y.addEventListener("dragstart",N=>{S=T,E=null,N.dataTransfer.effectAllowed="copy",y.style.opacity="0.4"}),y.addEventListener("dragend",()=>{y.style.opacity="1"})}const P=[];for(let C=0;C<9;C++){const[g,T]=R(240+C*36,248,!0);P.push(T),M.push(g),g.title=`Slot ${C+1}`,g.addEventListener("click",()=>{i(C),A()}),g.addEventListener("dragstart",y=>{S=e[C],E=C,y.dataTransfer.effectAllowed="move",g.style.opacity="0.4"}),g.addEventListener("dragend",()=>{g.style.opacity="1"}),g.addEventListener("dragover",y=>{y.preventDefault(),y.dataTransfer.dropEffect=E!==null?"move":"copy",g.style.boxShadow="inset 0 0 0 2px #7ff"}),g.addEventListener("dragleave",()=>{g.style.boxShadow=""}),g.addEventListener("drop",y=>{y.preventDefault(),g.style.boxShadow="",S&&(E!==null&&E!==C?[e[C],e[E]]=[e[E],e[C]]:E===null&&(e[C]=S),b(),t(),S=null,E=null)})}function b(){for(let C=0;C<9;C++)G(P[C],e[C])}return B.addEventListener("load",b),B.complete&&b(),d.appendChild(v),{syncHotbar:b,refreshSlotHighlight:A}}function la(d,n,e){const t=document.createElement("div");t.style.cssText=["display:flex","flex-wrap:wrap","gap:8px","justify-content:center","font-family:ui-monospace,monospace","font-size:13px","user-select:none"].join(";");const r="background:#1a2e1a;color:#5f5;border-color:#5f5",i="background:#2e1a1a;color:#f55;border-color:#f55";for(const o of Object.keys(d)){const a=document.createElement("button"),s=o.toUpperCase().padEnd(5),c=()=>{const u=d[o];a.textContent=`${s} ${u?"ON ":"OFF"}`,a.setAttribute("style",["padding:5px 10px","border-width:1px","border-style:solid","border-radius:4px","cursor:pointer","letter-spacing:0.04em",u?r:i].join(";"))};a.addEventListener("click",()=>{d[o]=!d[o],c(),n(o)}),c(),t.appendChild(a)}return e.appendChild(t),t}function ca(d,n){const e=document.createElement("div");e.style.cssText=["position:fixed","inset:0","z-index:100","background:rgba(0,0,0,0.78)","display:none","align-items:center","justify-content:center","font-family:ui-monospace,monospace"].join(";"),document.body.appendChild(e);const t=document.createElement("div");t.style.cssText=["display:flex","flex-direction:column","align-items:center","gap:24px","padding:48px 56px","background:rgba(255,255,255,0.04)","border:1px solid rgba(255,255,255,0.12)","border-radius:12px","max-width:860px","width:90%"].join(";"),e.appendChild(t);const r=document.createElement("h1");r.textContent="CRAFTY",r.style.cssText=["margin:0","font-size:52px","font-weight:900","color:#fff","letter-spacing:0.12em","text-shadow:0 0 48px rgba(100,200,255,0.45)","font-family:ui-monospace,monospace"].join(";"),t.appendChild(r);const i=document.createElement("button");i.textContent="Play",i.style.cssText=["padding:10px 40px","font-size:15px","font-family:ui-monospace,monospace","background:#1a3a1a","color:#5f5","border:1px solid #5f5","border-radius:6px","cursor:pointer","letter-spacing:0.06em","transition:background 0.15s"].join(";"),i.addEventListener("mouseenter",()=>{i.style.background="#243e24"}),i.addEventListener("mouseleave",()=>{i.style.background="#1a3a1a"});const o=()=>{u();try{d.requestPointerLock()}catch{}};i.addEventListener("click",o),i.addEventListener("touchend",f=>{f.preventDefault(),o()},{passive:!1}),t.appendChild(i);const a=document.createElement("div");a.style.cssText="width:100%;height:1px;background:rgba(255,255,255,0.12)",t.appendChild(a);let s=0;function c(){s=performance.now(),e.style.display="flex",n.style.display="none"}function u(){e.style.display="none",n.style.display=""}function p(){return e.style.display!=="none"}return document.addEventListener("pointerlockchange",()=>{document.pointerLockElement===d?u():c()}),document.addEventListener("keydown",f=>{if(f.code==="Escape"&&p()){if(performance.now()-s<200)return;u(),d.requestPointerLock()}}),{overlay:e,card:t,open:c,close:u,isOpen:p}}function ua(){const d=document.createElement("div");d.style.cssText=["position:fixed","top:50%","left:50%","width:16px","height:16px","transform:translate(-50%,-50%)","pointer-events:none"].join(";"),d.innerHTML=['<div style="position:absolute;top:50%;left:0;width:100%;height:3px;background:#fff;opacity:0.8;transform:translateY(-50%)"></div>','<div style="position:absolute;left:50%;top:0;width:3px;height:100%;background:#fff;opacity:0.8;transform:translateX(-50%)"></div>','<div style="position:absolute;top:50%;left:50%;width:7px;height:3px;background:#fff;opacity:0.9;transform:translate(-50%,-50%);border-radius:50%"></div>'].join(""),document.body.appendChild(d);const n=document.createElement("div");n.style.cssText=["position:fixed","top:12px","right:12px","font-family:ui-monospace,monospace","font-size:13px","color:#ff0","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none"].join(";"),document.body.appendChild(n);const e=document.createElement("div");e.style.cssText=["position:fixed","top:44px","right:12px","font-family:ui-monospace,monospace","font-size:11px","color:#aaf","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none","white-space:pre"].join(";"),document.body.appendChild(e);const t=document.createElement("div");t.style.cssText=["position:fixed","bottom:12px","right:12px","font-family:ui-monospace,monospace","font-size:13px","color:#ff0","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none"].join(";"),document.body.appendChild(t);const r=document.createElement("div");return r.style.cssText=["position:fixed","bottom:44px","right:12px","font-family:ui-monospace,monospace","font-size:11px","color:#ccf","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none"].join(";"),document.body.appendChild(r),{fps:n,stats:e,biome:t,pos:r,reticle:d}}function da(d,n,e,t,r,i,o,a){const s=new Le("Camera");s.position.set(64,25,64);const c=s.addComponent(new Mr(70,.1,1e3,t/r));n.add(s);const u=new Le("Flashlight"),p=u.addComponent(new Ur);p.color=new O(1,.95,.9),p.intensity=0,p.range=40,p.innerAngle=12,p.outerAngle=25,p.castShadow=!1,p.projectionTexture=i,s.addChild(u),n.add(u);let f=!1;const h=new xi(e,Math.PI,.1);h.attach(d);const m=new li(Math.PI,.1,15);let _=!0;const w=document.createElement("div");w.textContent="PLAYER",w.style.cssText=["position:fixed","top:12px","left:12px","font-family:ui-monospace,monospace","font-size:13px","font-weight:bold","color:#4f4","background:rgba(0,0,0,0.45)","padding:4px 8px","border-radius:4px","pointer-events:none","letter-spacing:0.05em"].join(";"),document.body.appendChild(w);function v(S){o&&(o.style.display=S?"":"none"),a&&(a.style.display=S?"":"none")}function x(){_=!_,_?(h.yaw=m.yaw,h.pitch=m.pitch,m.detach(),h.attach(d)):(m.yaw=h.yaw,m.pitch=h.pitch,h.detach(),m.attach(d)),w.textContent=_?"PLAYER":"FREE",w.style.color=_?"#4f4":"#4cf",v(_)}function B(S){f=S,p.intensity=f?25:0}let G=-1/0;return document.addEventListener("keyup",S=>{S.code==="Space"&&(G=performance.now())}),document.addEventListener("keydown",S=>{if(S.code==="KeyC"&&!S.repeat){x();return}if(!(S.code!=="Space"||S.repeat)&&performance.now()-G<400&&document.pointerLockElement===d){const E=_;x(),G=-1/0,E&&m.pressKey("Space")}}),window.addEventListener("keydown",S=>{S.code==="KeyF"&&!S.repeat&&(B(!f),console.log(`Flashlight ${f?"ON":"OFF"} (intensity: ${p.intensity})`)),S.ctrlKey&&S.key==="w"&&(S.preventDefault(),window.location.reload())}),{cameraGO:s,camera:c,player:h,freeCamera:m,isPlayerMode:()=>_,flashlight:p,isFlashlightEnabled:()=>f,modeEl:w,toggleController:x,setFlashlightEnabled:B,setPlayerUIVisible:v}}const rt=new Map,it=new Map,Mt=(d,n,e)=>`${d},${n},${e}`;function fa(d,n,e,t){const r=Mt(d,n,e);if(rt.has(r))return;const i=new Le("TorchLight");i.position.set(d+.5,n+.9,e+.5);const o=i.addComponent(new $t);o.color=new O(1,.52,.18),o.intensity=4,o.radius=6,o.castShadow=!1,t.add(i);const a=(d*127.1+n*311.7+e*74.3)%(Math.PI*2);rt.set(r,{go:i,pl:o,phase:a})}function pa(d,n,e,t){const r=Mt(d,n,e),i=rt.get(r);i&&(t.remove(i.go),rt.delete(r))}function ha(d){for(const{pl:n,phase:e}of rt.values()){const t=1+.08*Math.sin(d*11.7+e)+.05*Math.sin(d*7.3+e*1.7)+.03*Math.sin(d*23.1+e*.5);n.intensity=4*t}}function ma(d,n,e,t){const r=Mt(d,n,e);if(it.has(r))return;const i=new Le("MagmaLight");i.position.set(d+.5,n+.5,e+.5);const o=i.addComponent(new $t);o.color=new O(1,.28,0),o.intensity=6,o.radius=10,o.castShadow=!1,t.add(i);const a=(d*127.1+n*311.7+e*74.3)%(Math.PI*2);it.set(r,{go:i,pl:o,phase:a})}function _a(d,n,e,t){const r=Mt(d,n,e),i=it.get(r);i&&(t.remove(i.go),it.delete(r))}function ga(d){for(const{pl:n,phase:e}of it.values()){const t=1+.18*Math.sin(d*1.1+e)+.1*Math.sin(d*2.9+e*.7)+.06*Math.sin(d*.5+e*1.4);n.intensity=6*t}}const va=700,ba=300;function ya(){return{targetBlock:null,targetHit:null,mouseHeld:-1,mouseHoldTime:0,lastBlockAction:0}}function yn(d,n,e,t,r,i){if(d===0&&e.targetBlock){const o=t.getBlockType(e.targetBlock.x,e.targetBlock.y,e.targetBlock.z);o===L.TORCH&&pa(e.targetBlock.x,e.targetBlock.y,e.targetBlock.z,i),o===L.MAGMA&&_a(e.targetBlock.x,e.targetBlock.y,e.targetBlock.z,i),t.mineBlock(e.targetBlock.x,e.targetBlock.y,e.targetBlock.z),e.lastBlockAction=n}else if(d===2&&e.targetHit){const o=e.targetHit,a=r(),s=o.position.x+o.face.x,c=o.position.y+o.face.y,u=o.position.z+o.face.z;t.addBlock(o.position.x,o.position.y,o.position.z,o.face.x,o.face.y,o.face.z,a)&&(a===L.TORCH&&fa(s,c,u,i),a===L.MAGMA&&ma(s,c,u,i)),e.lastBlockAction=n}}function xa(d,n,e,t,r){d.addEventListener("contextmenu",i=>i.preventDefault()),d.addEventListener("mousedown",i=>{document.pointerLockElement===d&&(i.button!==0&&i.button!==2||(n.mouseHeld=i.button,n.mouseHoldTime=i.timeStamp,yn(i.button,i.timeStamp,n,e,t,r)))}),d.addEventListener("mouseup",i=>{i.button===n.mouseHeld&&(n.mouseHeld=-1)})}function wa(d,n,e,t,r,i){e.mouseHeld>=0&&document.pointerLockElement===n&&d-e.mouseHoldTime>=va&&d-e.lastBlockAction>=ba&&yn(e.mouseHeld,d,e,t,r,i)}const Oe=60,Ba=.1,yt=28,qe=64,Sr=44,Sa=.005;function Pa(d,n,e){const t={controls:null,cancel(){}},r=()=>{t.controls||(t.controls=new Ta(d,n),e==null||e(t.controls))};return window.addEventListener("touchstart",r,{once:!0,passive:!0,capture:!0}),t.cancel=()=>window.removeEventListener("touchstart",r,!0),t}function Ga(){if(typeof location<"u"&&/[?&]touch(=1|=true|=on|$|&)/.test(location.search))return!0;if(typeof navigator<"u"){const d=navigator;if((d.maxTouchPoints??0)>0||(d.msMaxTouchPoints??0)>0)return!0}if(typeof window<"u"&&"ontouchstart"in window)return!0;if(typeof window<"u"&&typeof window.matchMedia=="function")try{if(window.matchMedia("(any-pointer: coarse)").matches||window.matchMedia("(pointer: coarse)").matches)return!0}catch{}return!1}class Ta{constructor(n,e){l(this,"_root");l(this,"_joystick");l(this,"_stick");l(this,"_btnJump");l(this,"_btnSneak");l(this,"_btnMine");l(this,"_btnPlace");l(this,"_btnMenu");l(this,"_joyTouchId",null);l(this,"_joyOriginX",0);l(this,"_joyOriginY",0);l(this,"_lookTouchId",null);l(this,"_lookLastX",0);l(this,"_lookLastY",0);l(this,"_lookLastTapAt",-1/0);l(this,"_lookSensitivity");l(this,"_onJoyStart",n=>{if(this._joyTouchId!==null)return;n.preventDefault();const e=n.changedTouches[0];this._joyTouchId=e.identifier;const t=this._joystick.getBoundingClientRect();this._joyOriginX=t.left+t.width*.5,this._joyOriginY=t.top+t.height*.5,this._updateJoystick(e.clientX,e.clientY)});l(this,"_onJoyMove",n=>{if(this._joyTouchId!==null)for(let e=0;e<n.changedTouches.length;e++){const t=n.changedTouches[e];if(t.identifier===this._joyTouchId){n.preventDefault(),this._updateJoystick(t.clientX,t.clientY);return}}});l(this,"_onJoyEnd",n=>{if(this._joyTouchId!==null){for(let e=0;e<n.changedTouches.length;e++)if(n.changedTouches[e].identifier===this._joyTouchId){n.preventDefault(),this._joyTouchId=null,this._setMovement(0,0),this._stick.style.transform="translate(0px, 0px)";return}}});l(this,"_onLookStart",n=>{if(this._lookTouchId!==null)return;const e=n.changedTouches[0],t=window.innerWidth*.5;if(e.clientX<t)return;n.preventDefault(),this._lookTouchId=e.identifier,this._lookLastX=e.clientX,this._lookLastY=e.clientY;const r=performance.now();r-this._lookLastTapAt<350&&this._opts.onLookDoubleTap?(this._opts.onLookDoubleTap(),this._lookLastTapAt=-1/0):this._lookLastTapAt=r});l(this,"_onLookMove",n=>{if(this._lookTouchId!==null)for(let e=0;e<n.changedTouches.length;e++){const t=n.changedTouches[e];if(t.identifier!==this._lookTouchId)continue;n.preventDefault();const r=t.clientX-this._lookLastX,i=t.clientY-this._lookLastY;this._lookLastX=t.clientX,this._lookLastY=t.clientY,this._applyLook(r,i);return}});l(this,"_onLookEnd",n=>{if(this._lookTouchId!==null){for(let e=0;e<n.changedTouches.length;e++)if(n.changedTouches[e].identifier===this._lookTouchId){n.preventDefault(),this._lookTouchId=null;return}}});this._canvas=n,this._opts=e,this._lookSensitivity=e.lookSensitivity??Sa,this._root=document.createElement("div"),this._root.style.cssText=["position:fixed","inset:0","pointer-events:none","user-select:none","-webkit-user-select:none","touch-action:none","z-index:50"].join(";"),this._joystick=document.createElement("div"),this._joystick.style.cssText=["position:absolute","left:24px","bottom:24px",`width:${Oe*2}px`,`height:${Oe*2}px`,"border-radius:50%","background:rgba(255,255,255,0.10)","border:2px solid rgba(255,255,255,0.30)","pointer-events:auto"].join(";"),this._stick=document.createElement("div"),this._stick.style.cssText=["position:absolute",`left:${Oe-yt}px`,`top:${Oe-yt}px`,`width:${yt*2}px`,`height:${yt*2}px`,"border-radius:50%","background:rgba(255,255,255,0.30)","border:2px solid rgba(255,255,255,0.50)","pointer-events:none","transition:transform 80ms ease-out"].join(";"),this._joystick.appendChild(this._stick),this._root.appendChild(this._joystick),this._btnMine=this._makeButton("⛏",`right:${24+qe+12}px`,`bottom:${24+qe+12}px`,"rgba(220,80,80,0.45)"),this._btnPlace=this._makeButton("▣","right:24px",`bottom:${24+qe+12}px`,"rgba(80,180,90,0.45)"),this._btnJump=this._makeButton("⤒","right:24px","bottom:24px","rgba(255,255,255,0.18)"),this._btnSneak=this._makeButton("⤓",`right:${24+qe+12}px`,"bottom:24px","rgba(255,255,255,0.10)"),this._btnMenu=this._makeButton("☰","right:16px","top:16px","rgba(0,0,0,0.45)"),this._btnMenu.style.width=`${Sr}px`,this._btnMenu.style.height=`${Sr}px`,this._btnMenu.style.fontSize="24px",document.body.appendChild(this._root),this._attachEvents()}destroy(){this._detachEvents(),this._root.remove()}_makeButton(n,e,t,r){const i=document.createElement("div");return i.textContent=n,i.style.cssText=["position:absolute",e,t,`width:${qe}px`,`height:${qe}px`,"border-radius:50%",`background:${r}`,"border:2px solid rgba(255,255,255,0.45)","color:#fff","font-size:32px","font-family:sans-serif","display:flex","align-items:center","justify-content:center","pointer-events:auto","user-select:none"].join(";"),this._root.appendChild(i),i}_attachEvents(){this._joystick.addEventListener("touchstart",this._onJoyStart,{passive:!1}),this._joystick.addEventListener("touchmove",this._onJoyMove,{passive:!1}),this._joystick.addEventListener("touchend",this._onJoyEnd,{passive:!1}),this._joystick.addEventListener("touchcancel",this._onJoyEnd,{passive:!1}),this._canvas.addEventListener("touchstart",this._onLookStart,{passive:!1}),this._canvas.addEventListener("touchmove",this._onLookMove,{passive:!1}),this._canvas.addEventListener("touchend",this._onLookEnd,{passive:!1}),this._canvas.addEventListener("touchcancel",this._onLookEnd,{passive:!1}),this._bindHoldButton(this._btnJump,()=>this._setJump(!0),()=>this._setJump(!1)),this._bindHoldButton(this._btnSneak,()=>this._setSneak(!0),()=>this._setSneak(!1)),this._bindHoldButton(this._btnMine,()=>this._actionDown(0),()=>this._actionUp(0)),this._bindHoldButton(this._btnPlace,()=>this._actionDown(2),()=>this._actionUp(2));const n=e=>{var t,r;e.preventDefault(),this._btnMenu.style.filter="",(r=(t=this._opts).onMenu)==null||r.call(t)};this._btnMenu.addEventListener("touchstart",e=>{e.preventDefault(),this._btnMenu.style.filter="brightness(1.5)"},{passive:!1}),this._btnMenu.addEventListener("touchend",n,{passive:!1}),this._btnMenu.addEventListener("touchcancel",()=>{this._btnMenu.style.filter=""},{passive:!1})}_detachEvents(){this._joystick.removeEventListener("touchstart",this._onJoyStart),this._joystick.removeEventListener("touchmove",this._onJoyMove),this._joystick.removeEventListener("touchend",this._onJoyEnd),this._joystick.removeEventListener("touchcancel",this._onJoyEnd),this._canvas.removeEventListener("touchstart",this._onLookStart),this._canvas.removeEventListener("touchmove",this._onLookMove),this._canvas.removeEventListener("touchend",this._onLookEnd),this._canvas.removeEventListener("touchcancel",this._onLookEnd)}_bindHoldButton(n,e,t){const r=o=>{o.preventDefault(),n.style.filter="brightness(1.5)",e()},i=o=>{o.preventDefault(),n.style.filter="",t()};n.addEventListener("touchstart",r,{passive:!1}),n.addEventListener("touchend",i,{passive:!1}),n.addEventListener("touchcancel",i,{passive:!1})}_updateJoystick(n,e){let t=n-this._joyOriginX,r=e-this._joyOriginY;const i=Math.hypot(t,r);if(i>Oe){const c=Oe/i;t*=c,r*=c}this._stick.style.transition="none",this._stick.style.transform=`translate(${t}px, ${r}px)`,requestAnimationFrame(()=>{this._stick.style.transition="transform 80ms ease-out"});const o=t/Oe,a=r/Oe;if(Math.hypot(o,a)<Ba){this._setMovement(0,0);return}this._setMovement(o,-a)}_activeIsCamera(){return(this._opts.getActive?this._opts.getActive():"player")==="camera"}_setMovement(n,e){const t=this._activeIsCamera();t&&this._opts.camera?(this._opts.camera.inputForward=e,this._opts.camera.inputStrafe=n):this._opts.player&&(this._opts.player.inputForward=e,this._opts.player.inputStrafe=n),t&&this._opts.player?(this._opts.player.inputForward=0,this._opts.player.inputStrafe=0):!t&&this._opts.camera&&(this._opts.camera.inputForward=0,this._opts.camera.inputStrafe=0)}_setJump(n){this._activeIsCamera()&&this._opts.camera?this._opts.camera.inputUp=n:this._opts.player&&(this._opts.player.inputJump=n)}_setSneak(n){this._activeIsCamera()&&this._opts.camera?this._opts.camera.inputDown=n:this._opts.player&&(this._opts.player.inputSneak=n)}_applyLook(n,e){const t=n*(this._lookSensitivity/.002),r=e*(this._lookSensitivity/.002);this._activeIsCamera()&&this._opts.camera?this._opts.camera.applyLookDelta(t,r):this._opts.player&&this._opts.player.applyLookDelta(t,r)}_actionDown(n){const{world:e,scene:t,blockInteraction:r,getSelectedBlock:i}=this._opts;if(!e||!t||!r||!i)return;const o=performance.now();r.mouseHeld=n,r.mouseHoldTime=o,yn(n,o,r,e,i,t)}_actionUp(n){const e=this._opts.blockInteraction;e&&e.mouseHeld===n&&(e.mouseHeld=-1)}}const Aa=`// Forward PBR shader with multi-light support
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
`,Ma=`// GBuffer fill pass — writes albedo+roughness and normal+metallic.
// Group 2 texture maps are optional; the material binds 1×1 fallbacks when unset.

struct CameraUniforms {
  view      : mat4x4<f32>,
  proj      : mat4x4<f32>,
  viewProj  : mat4x4<f32>,
  invViewProj: mat4x4<f32>,
  position  : vec3<f32>,
  near      : f32,
  far       : f32,
}

struct ModelUniforms {
  model       : mat4x4<f32>,
  normalMatrix: mat4x4<f32>,
}

struct MaterialUniforms {
  albedo   : vec4<f32>,    // offset  0
  roughness: f32,          // offset 16
  metallic : f32,          // offset 20
  uvOffset : vec2<f32>,    // offset 24  atlas tile offset (0,0 = identity)
  uvScale  : vec2<f32>,    // offset 32  atlas tile scale  (1,1 = identity)
  uvTile   : vec2<f32>,    // offset 40  repetitions across the mesh surface (1,1 = no tiling)
}

@group(0) @binding(0) var<uniform> camera  : CameraUniforms;
@group(1) @binding(0) var<uniform> model   : ModelUniforms;
// Group 2: Material (uniforms + texture maps + sampler).
// Texture maps: albedoMap (srgb), normalMap (tangent-space linear), merMap (R=metallic, G=emissive, B=roughness).
@group(2) @binding(0) var<uniform> material: MaterialUniforms;
@group(2) @binding(1) var albedo_map: texture_2d<f32>;
@group(2) @binding(2) var normal_map: texture_2d<f32>;
@group(2) @binding(3) var mer_map   : texture_2d<f32>;
@group(2) @binding(4) var mat_samp  : sampler;

struct VertexInput {
  @location(0) position: vec3<f32>,
  @location(1) normal  : vec3<f32>,
  @location(2) uv      : vec2<f32>,
  @location(3) tangent : vec4<f32>,  // xyz=tangent, w=bitangent sign
}

struct VertexOutput {
  @builtin(position) clip_pos  : vec4<f32>,
  @location(0)       world_pos : vec3<f32>,
  @location(1)       world_norm: vec3<f32>,
  @location(2)       uv        : vec2<f32>,
  @location(3)       world_tan : vec4<f32>,  // xyz=tangent, w=bitangent sign
}

@vertex
fn vs_main(vin: VertexInput) -> VertexOutput {
  let world_pos  = model.model * vec4<f32>(vin.position, 1.0);
  let world_norm = normalize((model.normalMatrix * vec4<f32>(vin.normal,       0.0)).xyz);
  let world_tan  = normalize((model.normalMatrix * vec4<f32>(vin.tangent.xyz,  0.0)).xyz);

  var out: VertexOutput;
  out.clip_pos   = camera.viewProj * world_pos;
  out.world_pos  = world_pos.xyz;
  out.world_norm = world_norm;
  out.uv         = vin.uv;
  out.world_tan  = vec4<f32>(world_tan, vin.tangent.w);
  return out;
}

struct FragmentOutput {
  @location(0) albedo_roughness: vec4<f32>,
  @location(1) normal_emission : vec4<f32>,
}

@fragment
fn fs_main(in: VertexOutput) -> FragmentOutput {
  // Tile within the mesh surface, then map into the atlas tile region
  let atlas_uv = fract(in.uv * material.uvTile) * material.uvScale + material.uvOffset;

  // Albedo: texture rgb × material colour
  let tex_albedo = textureSample(albedo_map, mat_samp, atlas_uv);
  let albedo     = tex_albedo.rgb * material.albedo.rgb;

  // MER: r=metallic multiplier, g=emissive, b=roughness multiplier
  let mer      = textureSample(mer_map, mat_samp, atlas_uv);
  let roughness = material.roughness * mer.b;
  let metallic  = material.metallic  * mer.r;
  let emission  = mer.g;

  // Build TBN in world space for normal mapping
  let N = normalize(in.world_norm);
  let T = normalize(in.world_tan.xyz);
  // Re-orthogonalise to handle interpolation artefacts
  let T_ortho = normalize(T - N * dot(T, N));
  let B       = cross(N, T_ortho) * in.world_tan.w;  // w encodes bitangent handedness
  let tbn     = mat3x3<f32>(T_ortho, B, N);

  // Decode tangent-space normal map and transform to world space
  let n_ts    = textureSample(normal_map, mat_samp, atlas_uv).rgb * 2.0 - 1.0;
  let mapped_N = normalize(tbn * n_ts);

  var out: FragmentOutput;
  out.albedo_roughness = vec4<f32>(albedo, roughness);
  // Store world normal in [0,1] range (decoded in lighting pass with n*2-1) and emission
  out.normal_emission  = vec4<f32>(mapped_N * 0.5 + 0.5, emission);
  return out;
}
`,Ea=`// Skinned GBuffer fill pass — GPU vertex skinning with up to 4 bone influences.
// Identical to geometry.wgsl except for the extra joint/weight inputs and the
// joint_matrices storage buffer at group 4.

struct CameraUniforms {
  view       : mat4x4<f32>,
  proj       : mat4x4<f32>,
  viewProj   : mat4x4<f32>,
  invViewProj: mat4x4<f32>,
  position   : vec3<f32>,
  near       : f32,
  far        : f32,
}

struct ModelUniforms {
  model       : mat4x4<f32>,
  normalMatrix: mat4x4<f32>,
}

struct MaterialUniforms {
  albedo   : vec4<f32>,
  roughness: f32,
  metallic : f32,
  uvOffset : vec2<f32>,
  uvScale  : vec2<f32>,
  uvTile   : vec2<f32>,
}

@group(0) @binding(0) var<uniform>       camera        : CameraUniforms;
@group(1) @binding(0) var<uniform>       model         : ModelUniforms;
@group(1) @binding(1) var<storage, read> joint_matrices: array<mat4x4<f32>>;
@group(2) @binding(0) var<uniform>       material      : MaterialUniforms;
@group(2) @binding(1) var                albedo_map    : texture_2d<f32>;
@group(2) @binding(2) var                normal_map    : texture_2d<f32>;
@group(2) @binding(3) var                mer_map       : texture_2d<f32>;
@group(2) @binding(4) var                mat_samp      : sampler;

struct VertexInput {
  @location(0) position: vec3<f32>,
  @location(1) normal  : vec3<f32>,
  @location(2) uv      : vec2<f32>,
  @location(3) tangent : vec4<f32>,
  @location(4) joints  : vec4<u32>,
  @location(5) weights : vec4<f32>,
}

struct VertexOutput {
  @builtin(position) clip_pos  : vec4<f32>,
  @location(0)       world_pos : vec3<f32>,
  @location(1)       world_norm: vec3<f32>,
  @location(2)       uv        : vec2<f32>,
  @location(3)       world_tan : vec4<f32>,
}

@vertex
fn vs_main(vin: VertexInput) -> VertexOutput {
  // Blend joint matrices by weights
  let skin_mat =
      vin.weights.x * joint_matrices[vin.joints.x] +
      vin.weights.y * joint_matrices[vin.joints.y] +
      vin.weights.z * joint_matrices[vin.joints.z] +
      vin.weights.w * joint_matrices[vin.joints.w];

  let skinned_pos  = skin_mat * vec4<f32>(vin.position,    1.0);
  let skinned_norm = skin_mat * vec4<f32>(vin.normal,      0.0);
  let skinned_tan  = skin_mat * vec4<f32>(vin.tangent.xyz, 0.0);

  let world_pos  = model.model * skinned_pos;
  let world_norm = normalize((model.normalMatrix * skinned_norm).xyz);
  let world_tan  = normalize((model.normalMatrix * skinned_tan).xyz);

  var out: VertexOutput;
  out.clip_pos   = camera.viewProj * world_pos;
  out.world_pos  = world_pos.xyz;
  out.world_norm = world_norm;
  out.uv         = vin.uv;
  out.world_tan  = vec4<f32>(world_tan, vin.tangent.w);
  return out;
}

struct FragmentOutput {
  @location(0) albedo_roughness: vec4<f32>,
  @location(1) normal_metallic : vec4<f32>,
}

@fragment
fn fs_main(in: VertexOutput) -> FragmentOutput {
  let atlas_uv = fract(in.uv * material.uvTile) * material.uvScale + material.uvOffset;

  let tex_albedo = textureSample(albedo_map, mat_samp, atlas_uv);
  let albedo     = tex_albedo.rgb * material.albedo.rgb;

  let mer      = textureSample(mer_map, mat_samp, atlas_uv);
  let roughness = material.roughness * mer.b;
  let metallic  = material.metallic  * mer.r;

  let N       = normalize(in.world_norm);
  let T       = normalize(in.world_tan.xyz);
  let T_ortho = normalize(T - N * dot(T, N));
  let B       = cross(N, T_ortho) * in.world_tan.w;
  let tbn     = mat3x3<f32>(T_ortho, B, N);

  let n_ts    = textureSample(normal_map, mat_samp, atlas_uv).rgb * 2.0 - 1.0;
  let mapped_N = normalize(tbn * n_ts);

  var out: FragmentOutput;
  out.albedo_roughness = vec4<f32>(albedo, roughness);
  out.normal_metallic  = vec4<f32>(mapped_N * 0.5 + 0.5, metallic);
  return out;
}
`,Pr=48,ce=class ce extends ti{constructor(e={}){super();l(this,"shaderId","pbr");l(this,"albedo");l(this,"roughness");l(this,"metallic");l(this,"uvOffset");l(this,"uvScale");l(this,"uvTile");l(this,"_albedoMap");l(this,"_normalMap");l(this,"_merMap");l(this,"_uniformBuffer",null);l(this,"_uniformDevice",null);l(this,"_bindGroup",null);l(this,"_bindGroupAlbedo");l(this,"_bindGroupNormal");l(this,"_bindGroupMer");l(this,"_dirty",!0);l(this,"_scratch",new Float32Array(Pr/4));this.albedo=e.albedo??[1,1,1,1],this.roughness=e.roughness??.5,this.metallic=e.metallic??0,this.uvOffset=e.uvOffset,this.uvScale=e.uvScale,this.uvTile=e.uvTile,this._albedoMap=e.albedoMap,this._normalMap=e.normalMap,this._merMap=e.merMap,this.transparent=e.transparent??!1}get albedoMap(){return this._albedoMap}set albedoMap(e){e!==this._albedoMap&&(this._albedoMap=e,this._bindGroup=null)}get normalMap(){return this._normalMap}set normalMap(e){e!==this._normalMap&&(this._normalMap=e,this._bindGroup=null)}get merMap(){return this._merMap}set merMap(e){e!==this._merMap&&(this._merMap=e,this._bindGroup=null)}markDirty(){this._dirty=!0}getShaderCode(e){switch(e){case Je.Forward:return Aa;case Je.Geometry:return Ma;case Je.SkinnedGeometry:return Ea}}getBindGroupLayout(e){let t=ce._layoutByDevice.get(e);return t||(t=e.createBindGroupLayout({label:"PbrMaterialBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),ce._layoutByDevice.set(e,t)),t}getBindGroup(e){var a,s,c,u;if(this._bindGroup&&this._bindGroupAlbedo===this._albedoMap&&this._bindGroupNormal===this._normalMap&&this._bindGroupMer===this._merMap)return this._bindGroup;(!this._uniformBuffer||this._uniformDevice!==e)&&((a=this._uniformBuffer)==null||a.destroy(),this._uniformBuffer=e.createBuffer({label:"PbrMaterialUniform",size:Pr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this._uniformDevice=e,this._dirty=!0);const t=ce._getSampler(e),r=((s=this._albedoMap)==null?void 0:s.view)??ce._getWhite(e),i=((c=this._normalMap)==null?void 0:c.view)??ce._getFlatNormal(e),o=((u=this._merMap)==null?void 0:u.view)??ce._getMerDefault(e);return this._bindGroup=e.createBindGroup({label:"PbrMaterialBG",layout:this.getBindGroupLayout(e),entries:[{binding:0,resource:{buffer:this._uniformBuffer}},{binding:1,resource:r},{binding:2,resource:i},{binding:3,resource:o},{binding:4,resource:t}]}),this._bindGroupAlbedo=this._albedoMap,this._bindGroupNormal=this._normalMap,this._bindGroupMer=this._merMap,this._bindGroup}update(e){var r,i,o,a,s,c;if(!this._dirty||!this._uniformBuffer)return;const t=this._scratch;t[0]=this.albedo[0],t[1]=this.albedo[1],t[2]=this.albedo[2],t[3]=this.albedo[3],t[4]=this.roughness,t[5]=this.metallic,t[6]=((r=this.uvOffset)==null?void 0:r[0])??0,t[7]=((i=this.uvOffset)==null?void 0:i[1])??0,t[8]=((o=this.uvScale)==null?void 0:o[0])??1,t[9]=((a=this.uvScale)==null?void 0:a[1])??1,t[10]=((s=this.uvTile)==null?void 0:s[0])??1,t[11]=((c=this.uvTile)==null?void 0:c[1])??1,e.writeBuffer(this._uniformBuffer,0,t.buffer),this._dirty=!1}destroy(){var e;(e=this._uniformBuffer)==null||e.destroy(),this._uniformBuffer=null,this._uniformDevice=null,this._bindGroup=null}static _getSampler(e){let t=ce._samplerByDevice.get(e);return t||(t=e.createSampler({label:"PbrMaterialSampler",magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"}),ce._samplerByDevice.set(e,t)),t}static _make1x1View(e,t,r,i,o,a){const s=e.createTexture({label:t,size:{width:1,height:1},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return e.queue.writeTexture({texture:s},new Uint8Array([r,i,o,a]),{bytesPerRow:4},{width:1,height:1}),s.createView()}static _getWhite(e){let t=ce._whiteByDevice.get(e);return t||(t=ce._make1x1View(e,"PbrFallbackWhite",255,255,255,255),ce._whiteByDevice.set(e,t)),t}static _getFlatNormal(e){let t=ce._flatNormalByDevice.get(e);return t||(t=ce._make1x1View(e,"PbrFallbackFlatNormal",128,128,255,255),ce._flatNormalByDevice.set(e,t)),t}static _getMerDefault(e){let t=ce._merDefaultByDevice.get(e);return t||(t=ce._make1x1View(e,"PbrFallbackMer",255,0,255,255),ce._merDefaultByDevice.set(e,t)),t}};l(ce,"_layoutByDevice",new WeakMap),l(ce,"_samplerByDevice",new WeakMap),l(ce,"_whiteByDevice",new WeakMap),l(ce,"_flatNormalByDevice",new WeakMap),l(ce,"_merDefaultByDevice",new WeakMap);let tt=ce;function Ua(d,n,e,t,r,i,o){const a=e.getTopBlockY(d,n,200);if(a<=0||e.getBiomeAt(d,a,n)!==we.GrassyPlains)return;const u=e.getBlockType(Math.floor(d),Math.floor(a-1),Math.floor(n))===L.WATER?Math.floor(a-.05):a,p=new Le("Duck");p.position.set(d+.5,u,n+.5);const f=new Le("Duck.Body");f.position.set(0,.15,0),f.addComponent(new wt(r,new tt({albedo:[.93,.93,.93,1],roughness:.9}))),p.addChild(f);const h=new Le("Duck.Head");h.position.set(0,.32,-.12),h.addComponent(new wt(i,new tt({albedo:[.08,.32,.1,1],roughness:.9}))),p.addChild(h);const m=new Le("Duck.Bill");m.position.set(0,.27,-.205),m.addComponent(new wt(o,new tt({albedo:[1,.55,.05,1],roughness:.8}))),p.addChild(m),p.addComponent(new Xe(e)),t.add(p)}function Ca(d,n,e,t,r,i,o,a){for(let s=0;s<e;s++){const c=s/e*Math.PI*2+Math.random()*.4,u=8+Math.random()*20;Ua(Math.floor(d+Math.cos(c)*u),Math.floor(n+Math.sin(c)*u),t,r,i,o,a)}}const ze=128,xt=40;class La{constructor(){l(this,"data",new Float32Array(ze*ze));l(this,"resolution",ze);l(this,"extent",xt);l(this,"_camX",NaN);l(this,"_camZ",NaN)}update(n,e,t){if(Math.abs(n-this._camX)<2&&Math.abs(e-this._camZ)<2)return;this._camX=n,this._camZ=e;const r=xt*2/ze,i=n-xt,o=e-xt,a=Math.ceil(e)+80;for(let s=0;s<ze;s++)for(let c=0;c<ze;c++)this.data[s*ze+c]=t.getTopBlockY(Math.floor(i+c*r),Math.floor(o+s*r),a)}}const ka={ssao:!0,ssgi:!1,shadows:!0,dof:!0,bloom:!0,godrays:!0,fog:!1,aces:!0,ao_dbg:!1,shd_dbg:!1,chunk_dbg:!1,hdr:!0,auto_exp:!1,rain:!0,clouds:!0},Na="modulepreload",Ra=function(d,n){return new URL(d,n).href},Gr={},Ia=function(n,e,t){let r=Promise.resolve();if(e&&e.length>0){const o=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),s=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));r=Promise.allSettled(e.map(c=>{if(c=Ra(c,t),c in Gr)return;Gr[c]=!0;const u=c.endsWith(".css"),p=u?'[rel="stylesheet"]':"";if(!!t)for(let m=o.length-1;m>=0;m--){const _=o[m];if(_.href===c&&(!u||_.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${c}"]${p}`))return;const h=document.createElement("link");if(h.rel=u?"stylesheet":Na,u||(h.as="script"),h.crossOrigin="",h.href=c,s&&h.setAttribute("nonce",s),document.head.appendChild(h),u)return new Promise((m,_)=>{h.addEventListener("load",m),h.addEventListener("error",()=>_(new Error(`Unable to preload CSS for ${c}`)))})}))}function i(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return r.then(o=>{for(const a of o||[])a.status==="rejected"&&i(a.reason);return n().catch(i)})},Oa={emitter:{maxParticles:8e4,spawnRate:24e3,lifetime:[2,3.5],shape:{kind:"box",halfExtents:[35,.1,35]},initialSpeed:[0,0],initialColor:[.75,.88,1,.55],initialSize:[.005,.009],roughness:.1,metallic:0},modifiers:[{type:"gravity",strength:9},{type:"drag",coefficient:.05},{type:"color_over_lifetime",startColor:[.75,.88,1,.55],endColor:[.75,.88,1,0]},{type:"block_collision"}],renderer:{type:"sprites",blendMode:"alpha",billboard:"velocity",renderTarget:"hdr"}},Va={emitter:{maxParticles:5e4,spawnRate:1500,lifetime:[30,45],shape:{kind:"box",halfExtents:[35,.1,35]},initialSpeed:[0,0],initialColor:[.92,.96,1,.85],initialSize:[.025,.055],roughness:.1,metallic:0},modifiers:[{type:"gravity",strength:1.5},{type:"drag",coefficient:.8},{type:"curl_noise",scale:1,strength:1,timeScale:1,octaves:1},{type:"block_collision"}],renderer:{type:"sprites",blendMode:"alpha",billboard:"camera",renderTarget:"hdr"}};async function Da(d,n,e,t,r,i,o,a,s,c,u){let p,f,h,m;if(n.worldGeometryPass){const K=St.create(d);n.worldGeometryPass.updateGBuffer(K),p=K,f=n.worldGeometryPass,h=n.worldShadowPass,m=n.waterPass}else{p=St.create(d),f=dn.create(d,p,t),h=_n.create(d,n.shadowPass.shadowMapArrayViews,3,t);const K=d.device.createTexture({label:"WaterDummyHDR",size:{width:d.width,height:d.height},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),de=d.device.createTexture({label:"WaterDummyDepth",size:{width:d.width,height:d.height},format:"depth32float",usage:GPUTextureUsage.TEXTURE_BINDING}),fe=K.createView(),ee=de.createView();m=Fe.create(d,K,fe,ee,r,i,o);const ne=(W,Y)=>{u.set(W,Y),f.addChunk(W,Y),h.addChunk(W,Y),m.addChunk(W,Y)},q=(W,Y)=>{u.set(W,Y),f.updateChunk(W,Y),h.updateChunk(W,Y),m.updateChunk(W,Y)},$=W=>{u.delete(W),f.removeChunk(W),h.removeChunk(W),m.removeChunk(W)};c.onChunkAdded=ne,c.onChunkUpdated=q,c.onChunkRemoved=$;for(const[W,Y]of u)m.addChunk(W,Y)}const _=un.create(d,p),w=pn.create(d,p),v=e.clouds?on.create(d,s):null,x=en.create(d,p,n.shadowPass,w.aoView,v==null?void 0:v.shadowView,a),B=e.godrays?ln.create(d,p,n.shadowPass,x.hdrView,x.cameraBuffer,x.lightBuffer):null,G=tn.create(d,x.hdrView),S=e.clouds?rn.create(d,x.hdrView,p.depthView,s):null;d.pushInitErrorScope();const E=mn.create(d);await d.popInitErrorScope("PointSpotShadowPass");const M=gn.create(d,p,E,x.hdrView),A=an.create(d,x,p),R=hn.create(d,p,A.historyView);x.updateSSGI(R.resultView),n.waterPass,m.updateRenderTargets(x.hdrTexture,x.hdrView,p.depthView,r);let P=null;const b=e.dof?(P=fn.create(d,A.resolvedView,p.depthView),P.resultView):A.resolvedView;let C=null;const g=e.bloom?(C=sn.create(d,b),C.resultView):b,T=nn.create(d,g,p.depthView),y=et.create(d,x.hdrTexture);y.enabled=e.auto_exp;const U=cn.create(d,g,w.aoView,p.depthView,x.cameraBuffer,x.lightBuffer,y.exposureBuffer);U.depthFogEnabled=e.fog;const N=n.currentWeatherEffect??Ye.None;let V=null;if(e.rain&&N!==Ye.None){const K=N===Ye.Snow?Va:Oa;V=vn.create(d,K,p,x.hdrView)}const{RenderGraph:z}=await Ia(async()=>{const{RenderGraph:K}=await import("./index-BZqL4-oZ.js");return{RenderGraph:K}},[],import.meta.url),I=new z;return I.addPass(n.shadowPass),v&&I.addPass(v),I.addPass(h),I.addPass(E),I.addPass(_),I.addPass(f),I.addPass(w),I.addPass(R),S?I.addPass(S):I.addPass(G),I.addPass(x),I.addPass(M),I.addPass(m),B&&I.addPass(B),V&&I.addPass(V),I.addPass(A),P&&I.addPass(P),C&&I.addPass(C),I.addPass(T),I.addPass(y),I.addPass(U),{shadowPass:n.shadowPass,gbuffer:p,geometryPass:_,worldGeometryPass:f,worldShadowPass:h,waterPass:m,ssaoPass:w,ssgiPass:R,lightingPass:x,atmospherePass:G,pointSpotShadowPass:E,pointSpotLightPass:M,taaPass:A,dofPass:P,bloomPass:C,rainPass:V,godrayPass:B,cloudPass:S,cloudShadowPass:v,blockHighlightPass:T,autoExposurePass:y,compositePass:U,graph:I,prevViewProj:null,currentWeatherEffect:N}}function Tr(d,n){let e=0,t=1;for(;d>0;)t/=n,e+=t*(d%n),d=Math.floor(d/n);return e}function za(d,n,e){const t=d.clone();for(let r=0;r<4;r++)t.data[r*4+0]+=n*t.data[r*4+3],t.data[r*4+1]+=e*t.data[r*4+3];return t}async function Fa(){const d=document.getElementById("canvas");if(!d)throw new Error("No canvas element");const n=await Kt.create(d,{enableErrorHandling:!1}),{device:e}=n,t=await jo(e,Wo(await(await fetch(Xr)).arrayBuffer())),r=await Fo(e,t.gpuTexture),i=Co(e),o=await bn.load(e,Nt,$r,Kr,Zr),a=await Pe.fromUrl(e,Qr),s=await Pe.fromUrl(e,Jr),c=await Pe.fromUrl(e,ei,{resizeWidth:256,resizeHeight:256,usage:7}),u=oa(Nt),p=ua(),f=ca(d,p.reticle),h=new Yt(13);Ga()&&(h.renderDistanceH=4,h.renderDistanceV=3);const m=new Map,_=new ni,w=new Le("Sun"),v=w.addComponent(new Er(new O(.3,-1,.5),O.one(),6,3));_.add(w);const x=da(d,_,h,n.width,n.height,c.gpuTexture,p.reticle,u.element),{cameraGO:B,camera:G,player:S,freeCamera:E}=x,M=ya();xa(d,M,h,()=>u.getSelected(),_),Pa(d,{player:S,camera:E,getActive:()=>x.isPlayerMode()?"player":"camera",world:h,scene:_,blockInteraction:M,getSelectedBlock:()=>u.getSelected(),onLookDoubleTap:()=>x.toggleController(),onMenu:()=>f.open()},()=>{S.usePointerLock=!1,E.usePointerLock=!1});const A={...ka},R=Jt.create(n,3);let P={shadowPass:R,currentWeatherEffect:Ye.None};async function b(){P=await Da(n,P,A,o,t,a,s,r,i,h,m),G.aspect=n.width/n.height}await b();const C=B.position.x,g=B.position.z;{const J=h.chunksPerFrame;h.chunksPerFrame=200,h.update(new O(C,50,g),0),h.chunksPerFrame=J;const ue=h.getTopBlockY(C,g,200);ue>0&&(B.position.y=ue+1.62,S.velY=0)}const T=ta(e),y=na(e),U=ra(e);Ca(C,g,30,h,_,T,y,U);const N=document.createElement("div");N.style.cssText="width:100%;height:1px;background:rgba(255,255,255,0.12)",f.card.appendChild(N);const V=sa(f.card,Nt,u.slots,()=>u.refresh(),u.getSelectedSlot,u.setSelectedSlot),z=document.createElement("div");z.style.cssText="width:100%;height:1px;background:rgba(255,255,255,0.12)",f.card.appendChild(z);const I=document.createElement("div");I.textContent="EFFECTS",I.style.cssText="color:rgba(255,255,255,0.35);font-size:11px;letter-spacing:0.18em;align-self:flex-start",f.card.appendChild(I),la(A,async J=>{if(J!=="ssao"&&J!=="ssgi"&&J!=="shadows"&&J!=="aces"&&J!=="ao_dbg"&&J!=="shd_dbg"){if(J==="chunk_dbg"){P.worldGeometryPass.setDebugChunks(A.chunk_dbg);return}if(J!=="hdr"){if(J==="auto_exp"){P.autoExposurePass.enabled=A.auto_exp;return}if(J==="fog"){P.compositePass.depthFogEnabled=A.fog;return}if(J==="rain"){await b();return}if(J==="clouds"){await b();return}await b()}}},f.card),u.setOnSelectionChanged(V.refreshSlotHighlight);const K=document.createElement("div");K.textContent="ESC  ·  resume",K.style.cssText="color:rgba(255,255,255,0.25);font-size:11px;letter-spacing:0.1em",f.card.appendChild(K),new ResizeObserver(async()=>{const J=Math.max(1,Math.round(d.clientWidth*devicePixelRatio)),ue=Math.max(1,Math.round(d.clientHeight*devicePixelRatio));J===d.width&&ue===d.height||(d.width=J,d.height=ue,await b())}).observe(d);let fe=0,ee=0,ne=-1/0,q=Math.PI*.3,$=0,W=0,Y=0,te=0,me=yr(h.getBiomeAt(B.position.x,B.position.y,B.position.z));const ve=br(h.getBiomeAt(B.position.x,B.position.y,B.position.z));let pe=ve.cloudBase,le=ve.cloudTop;const H=new La,re=new O(0,0,-1),oe=new Z([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);async function ye(J){var In,On;n.pushPassErrorScope("frame");const ue=Math.min((J-fe)/1e3,.1);fe=J;const xn=J-ne>=1e3;xn&&(ne=J),ue>0&&(ee+=(1/ue-ee)*.1),q+=ue*.01,$+=ue,Y+=ue*1.5,te+=ue*.5;const wn=Math.sin(q),Et=.25,Ut=-wn,Ct=Math.cos(q),Lt=Math.sqrt(Et*Et+Ut*Ut+Ct*Ct);v.direction.set(Et/Lt,Ut/Lt,Ct/Lt);const kt=wn;v.intensity=Math.max(0,kt)*6;const Bn=Math.max(0,kt);v.color.set(1,.8+.2*Bn,.6+.4*Bn),x.isPlayerMode()?S.update(B,ue):E.update(B,ue),ha(J/1e3),ga(J/1e3);const j=G.position();Xe.playerPos.x=j.x,Xe.playerPos.y=j.y,Xe.playerPos.z=j.z,_.update(ue),h.update(j,ue);const ot=h.getBiomeAt(j.x,j.y,j.z),Sn=Yo(ot);Sn!==P.currentWeatherEffect&&(P.currentWeatherEffect=Sn,await b());const Or=yr(ot);me+=(Or-me)*Math.min(1,.3*ue);const Pn=br(ot);if(pe+=(Pn.cloudBase-pe)*Math.min(1,.3*ue),le+=(Pn.cloudTop-le)*Math.min(1,.3*ue),xn){p.fps.textContent=`${ee.toFixed(0)} fps`;const Be=(P.worldGeometryPass.triangles/1e3).toFixed(1);p.stats.textContent=`${P.worldGeometryPass.drawCalls} draws  ${Be}k tris
${h.chunkCount} chunks  ${h.pendingChunks} pending`,p.biome.textContent=`${we[ot]}  coverage:${me.toFixed(2)}`,p.pos.textContent=`X: ${j.x.toFixed(1)}  Y: ${j.y.toFixed(1)}  Z: ${j.z.toFixed(1)}`}const Gn=W%16+1,Vr=(Tr(Gn,2)-.5)*(2/n.width),Dr=(Tr(Gn,3)-.5)*(2/n.height),Te=G.viewProjectionMatrix(),Tn=za(Te,Vr,Dr),ke=G.viewMatrix(),Me=G.projectionMatrix(),Ge=Te.invert(),An=Me.invert(),Mn=v.computeCascadeMatrices(G,128),En=_.collectMeshRenderers(),zr=En.map(Be=>{const Vn=Be.gameObject.localToWorld();return{mesh:Be.mesh,modelMatrix:Vn,normalMatrix:Vn.normalMatrix(),material:Be.material}}),Un=En.filter(Be=>Be.castShadow).map(Be=>({mesh:Be.mesh,modelMatrix:Be.gameObject.localToWorld()}));R.setSceneSnapshot(Un),R.updateScene(_,G,v,128),P.worldShadowPass.enabled=v.intensity>0,P.worldShadowPass.update(n,Mn,j.x,j.z);const at=Math.max(0,kt),Fr=[.02+.38*at,.03+.52*at,.05+.65*at],Cn={cloudBase:pe,cloudTop:le,coverage:me,density:4,windOffset:[Y,te],anisotropy:.85,extinction:.25,ambientColor:Fr,exposure:1};P.cloudShadowPass&&P.cloudShadowPass.update(n,Cn,[j.x,j.z],128),P.cloudPass&&(P.cloudPass.updateCamera(n,Ge,j,G.near,G.far),P.cloudPass.updateLight(n,v.direction,v.color,v.intensity),P.cloudPass.updateSettings(n,Cn));const Ln=_.getComponents($t),kn=_.getComponents(Ur);P.pointSpotShadowPass.update(Ln,kn,Un),P.pointSpotLightPass.updateCamera(n,ke,Me,Te,Ge,j,G.near,G.far),P.pointSpotLightPass.updateLights(n,Ln,kn),P.atmospherePass.update(n,Ge,j,v.direction),P.geometryPass.setDrawItems(zr),P.geometryPass.updateCamera(n,ke,Me,Tn,Ge,j,G.near,G.far),P.worldGeometryPass.updateCamera(n,ke,Me,Tn,Ge,j,G.near,G.far),P.waterPass.updateCamera(n,ke,Me,Te,Ge,j,G.near,G.far),P.waterPass.updateTime(n,$,Math.max(.01,at)),P.lightingPass.updateCamera(n,ke,Me,Te,Ge,j,G.near,G.far),P.lightingPass.updateLight(n,v.direction,v.color,v.intensity,Mn,A.shadows,A.shd_dbg),P.lightingPass.updateCloudShadow(n,P.cloudShadowPass?j.x:0,P.cloudShadowPass?j.z:0,128),P.ssaoPass.updateCamera(n,ke,Me,An),P.ssaoPass.updateParams(n,1,.005,A.ssao?2:0),P.ssgiPass.enabled=A.ssgi,P.ssgiPass.updateSettings({strength:A.ssgi?1:0}),A.ssgi&&P.ssgiPass.updateCamera(n,ke,Me,An,Ge,P.prevViewProj??Te,j);const Nn=Math.cos(S.pitch);re.x=-Math.sin(S.yaw)*Nn,re.y=-Math.sin(S.pitch),re.z=-Math.cos(S.yaw)*Nn;const st=h.getBlockByRay(j,re,16),Rn=!!(st&&st.position.sub(j).length()<=6);M.targetBlock=Rn?st.position:null,M.targetHit=Rn?st:null;const Hr=M.targetBlock&&!se(h.getBlockType(M.targetBlock.x,M.targetBlock.y,M.targetBlock.z))?M.targetBlock:null;if(P.blockHighlightPass.update(n,Te,Hr),wa(J,d,M,h,()=>u.getSelected(),_),P.rainPass){H.update(j.x,j.z,h),P.rainPass.updateHeightmap(n,H.data,j.x,j.z,H.extent);const Be=P.currentWeatherEffect===Ye.Snow?20:8;oe.data[12]=j.x,oe.data[13]=j.y+Be,oe.data[14]=j.z,P.rainPass.update(n,ue,ke,Me,Te,Ge,j,G.near,G.far,oe)}(In=P.dofPass)==null||In.updateParams(n,8,75,3,G.near,G.far),(On=P.godrayPass)==null||On.updateParams(n);const Wr=se(h.getBlockType(Math.floor(j.x),Math.floor(j.y),Math.floor(j.z))),qr={x:-v.direction.x,y:-v.direction.y,z:-v.direction.z};P.compositePass.updateParams(n,Wr,$,A.aces,A.ao_dbg,A.hdr),P.compositePass.updateStars(n,Ge,j,qr),P.autoExposurePass.update(n,ue),P.taaPass.updateCamera(n,Ge,P.prevViewProj??Te),P.prevViewProj=Te,W++,await P.graph.execute(n),await n.popPassErrorScope("frame"),requestAnimationFrame(ye)}requestAnimationFrame(ye)}Fa().catch(d=>{document.body.innerHTML=`<pre style="color:red;padding:1rem">${d}</pre>`,console.error(d)});export{tn as A,nn as B,rn as C,fn as D,St as G,en as L,vn as P,Kt as R,pn as S,an as T,Fe as W,et as a,sn as b,on as c,cn as d,un as e,ln as f,gn as g,mn as h,he as i,hn as j,Jt as k,dn as l,_n as m};
