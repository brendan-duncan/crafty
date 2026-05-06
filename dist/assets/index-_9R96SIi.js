var In=Object.defineProperty;var Vn=(d,n,e)=>n in d?In(d,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):d[n]=e;var c=(d,n,e)=>Vn(d,typeof n!="symbol"?n+"":n,e);(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))t(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&t(i)}).observe(document,{childList:!0,subtree:!0});function e(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function t(r){if(r.ep)return;r.ep=!0;const o=e(r);fetch(r.href,o)}})();const zn=""+new URL("clear_sky-CyjsjiVR.hdr",import.meta.url).href,Ut=""+new URL("simple_block_atlas-B-7juoTN.png",import.meta.url).href,Dn=""+new URL("simple_block_atlas_normal-BdCvGD-K.png",import.meta.url).href,Fn=""+new URL("simple_block_atlas_mer-C_Oa_Ink.png",import.meta.url).href,Hn=""+new URL("simple_block_atlas_heightmap-BOV6qQJl.png",import.meta.url).href,Wn=""+new URL("waterDUDV-CGfbcllR.png",import.meta.url).href,qn="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAgCAYAAADaInAlAAAA4klEQVR4Ae2UQQ4CIRAEGeAvnn2H/3+PDqBuXLnvoYqEAMvApptKx+3+eJYrW0QpNXvUNdYc57exrjkd+/u9o+58/r8+xj+yr/t+5/G+/7P3rc361lr2Onvva5zrzbyPun7Un+v259uUcdUTpFM2sgMCQH791C4AAgB3AC7fBBAAuANw+SaAAMAdgMs3AQQA7gBcvgkgAHAH4PJNAAGAOwCXbwIIANwBuHwTQADgDsDlmwACAHcALt8EEAC4A3D5JoAAwB2AyzcBBADuAFy+CSAAcAfg8k0AAYA7AJdvAsABeAEiUwM8dIJUQAAAAABJRU5ErkJggg==",jn=""+new URL("flashlight-C64SqrUS.jpg",import.meta.url).href;class L{constructor(n=0,e=0){c(this,"x");c(this,"y");this.x=n,this.y=e}set(n,e){return this.x=n,this.y=e,this}clone(){return new L(this.x,this.y)}add(n){return new L(this.x+n.x,this.y+n.y)}sub(n){return new L(this.x-n.x,this.y-n.y)}scale(n){return new L(this.x*n,this.y*n)}dot(n){return this.x*n.x+this.y*n.y}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.lengthSq())}normalize(){const n=this.length();return n>0?this.scale(1/n):new L}toArray(){return[this.x,this.y]}static zero(){return new L(0,0)}static one(){return new L(1,1)}}class I{constructor(n=0,e=0,t=0){c(this,"x");c(this,"y");c(this,"z");this.x=n,this.y=e,this.z=t}set(n,e,t){return this.x=n,this.y=e,this.z=t,this}clone(){return new I(this.x,this.y,this.z)}negate(){return new I(-this.x,-this.y,-this.z)}add(n){return new I(this.x+n.x,this.y+n.y,this.z+n.z)}sub(n){return new I(this.x-n.x,this.y-n.y,this.z-n.z)}scale(n){return new I(this.x*n,this.y*n,this.z*n)}mul(n){return new I(this.x*n.x,this.y*n.y,this.z*n.z)}dot(n){return this.x*n.x+this.y*n.y+this.z*n.z}cross(n){return new I(this.y*n.z-this.z*n.y,this.z*n.x-this.x*n.z,this.x*n.y-this.y*n.x)}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.lengthSq())}normalize(){const n=this.length();return n>0?this.scale(1/n):new I}lerp(n,e){return new I(this.x+(n.x-this.x)*e,this.y+(n.y-this.y)*e,this.z+(n.z-this.z)*e)}toArray(){return[this.x,this.y,this.z]}static zero(){return new I(0,0,0)}static one(){return new I(1,1,1)}static up(){return new I(0,1,0)}static forward(){return new I(0,0,-1)}static right(){return new I(1,0,0)}static fromArray(n,e=0){return new I(n[e],n[e+1],n[e+2])}}class Ee{constructor(n=0,e=0,t=0,r=0){c(this,"x");c(this,"y");c(this,"z");c(this,"w");this.x=n,this.y=e,this.z=t,this.w=r}set(n,e,t,r){return this.x=n,this.y=e,this.z=t,this.w=r,this}clone(){return new Ee(this.x,this.y,this.z,this.w)}add(n){return new Ee(this.x+n.x,this.y+n.y,this.z+n.z,this.w+n.w)}sub(n){return new Ee(this.x-n.x,this.y-n.y,this.z-n.z,this.w-n.w)}scale(n){return new Ee(this.x*n,this.y*n,this.z*n,this.w*n)}dot(n){return this.x*n.x+this.y*n.y+this.z*n.z+this.w*n.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.lengthSq())}toArray(){return[this.x,this.y,this.z,this.w]}static zero(){return new Ee(0,0,0,0)}static one(){return new Ee(1,1,1,1)}static fromArray(n,e=0){return new Ee(n[e],n[e+1],n[e+2],n[e+3])}}class K{constructor(n){c(this,"data");this.data=new Float32Array(16),n&&this.data.set(n)}clone(){return new K(this.data)}get(n,e){return this.data[n*4+e]}set(n,e,t){this.data[n*4+e]=t}multiply(n){const e=this.data,t=n.data,r=new Float32Array(16);for(let o=0;o<4;o++)for(let i=0;i<4;i++)r[o*4+i]=e[0*4+i]*t[o*4+0]+e[1*4+i]*t[o*4+1]+e[2*4+i]*t[o*4+2]+e[3*4+i]*t[o*4+3];return new K(r)}transformPoint(n){const e=this.data,t=e[0]*n.x+e[4]*n.y+e[8]*n.z+e[12],r=e[1]*n.x+e[5]*n.y+e[9]*n.z+e[13],o=e[2]*n.x+e[6]*n.y+e[10]*n.z+e[14],i=e[3]*n.x+e[7]*n.y+e[11]*n.z+e[15];return new I(t/i,r/i,o/i)}transformDirection(n){const e=this.data;return new I(e[0]*n.x+e[4]*n.y+e[8]*n.z,e[1]*n.x+e[5]*n.y+e[9]*n.z,e[2]*n.x+e[6]*n.y+e[10]*n.z)}transformVec4(n){const e=this.data;return new Ee(e[0]*n.x+e[4]*n.y+e[8]*n.z+e[12]*n.w,e[1]*n.x+e[5]*n.y+e[9]*n.z+e[13]*n.w,e[2]*n.x+e[6]*n.y+e[10]*n.z+e[14]*n.w,e[3]*n.x+e[7]*n.y+e[11]*n.z+e[15]*n.w)}transpose(){const n=this.data;return new K([n[0],n[4],n[8],n[12],n[1],n[5],n[9],n[13],n[2],n[6],n[10],n[14],n[3],n[7],n[11],n[15]])}invert(){const n=this.data,e=new Float32Array(16),t=n[0],r=n[1],o=n[2],i=n[3],a=n[4],l=n[5],s=n[6],u=n[7],p=n[8],f=n[9],h=n[10],_=n[11],m=n[12],x=n[13],v=n[14],w=n[15],B=t*l-r*a,G=t*s-o*a,S=t*u-i*a,M=r*s-o*l,U=r*u-i*l,A=o*u-i*s,N=p*x-f*m,P=p*v-h*m,y=p*w-_*m,C=f*v-h*x,g=f*w-_*x,T=h*w-_*v;let b=B*T-G*g+S*C+M*y-U*P+A*N;return b===0?K.identity():(b=1/b,e[0]=(l*T-s*g+u*C)*b,e[1]=(o*g-r*T-i*C)*b,e[2]=(x*A-v*U+w*M)*b,e[3]=(h*U-f*A-_*M)*b,e[4]=(s*y-a*T-u*P)*b,e[5]=(t*T-o*y+i*P)*b,e[6]=(v*S-m*A-w*G)*b,e[7]=(p*A-h*S+_*G)*b,e[8]=(a*g-l*y+u*N)*b,e[9]=(r*y-t*g-i*N)*b,e[10]=(m*U-x*S+w*B)*b,e[11]=(f*S-p*U-_*B)*b,e[12]=(l*P-a*C-s*N)*b,e[13]=(t*C-r*P+o*N)*b,e[14]=(x*G-m*M-v*B)*b,e[15]=(p*M-f*G+h*B)*b,new K(e))}normalMatrix(){const n=this.data,e=n[0],t=n[1],r=n[2],o=n[4],i=n[5],a=n[6],l=n[8],s=n[9],u=n[10],p=u*i-a*s,f=-u*o+a*l,h=s*o-i*l;let _=e*p+t*f+r*h;if(_===0)return K.identity();_=1/_;const m=new Float32Array(16);return m[0]=p*_,m[4]=(-u*t+r*s)*_,m[8]=(a*t-r*i)*_,m[1]=f*_,m[5]=(u*e-r*l)*_,m[9]=(-a*e+r*o)*_,m[2]=h*_,m[6]=(-s*e+t*l)*_,m[10]=(i*e-t*o)*_,m[15]=1,new K(m)}static identity(){return new K([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}static translation(n,e,t){return new K([1,0,0,0,0,1,0,0,0,0,1,0,n,e,t,1])}static scale(n,e,t){return new K([n,0,0,0,0,e,0,0,0,0,t,0,0,0,0,1])}static rotationX(n){const e=Math.cos(n),t=Math.sin(n);return new K([1,0,0,0,0,e,t,0,0,-t,e,0,0,0,0,1])}static rotationY(n){const e=Math.cos(n),t=Math.sin(n);return new K([e,0,-t,0,0,1,0,0,t,0,e,0,0,0,0,1])}static rotationZ(n){const e=Math.cos(n),t=Math.sin(n);return new K([e,t,0,0,-t,e,0,0,0,0,1,0,0,0,0,1])}static fromQuaternion(n,e,t,r){const o=n+n,i=e+e,a=t+t,l=n*o,s=e*o,u=e*i,p=t*o,f=t*i,h=t*a,_=r*o,m=r*i,x=r*a;return new K([1-u-h,s+x,p-m,0,s-x,1-l-h,f+_,0,p+m,f-_,1-l-u,0,0,0,0,1])}static perspective(n,e,t,r){const o=1/Math.tan(n/2),i=1/(t-r);return new K([o/e,0,0,0,0,o,0,0,0,0,r*i,-1,0,0,r*t*i,0])}static orthographic(n,e,t,r,o,i){const a=1/(n-e),l=1/(t-r),s=1/(o-i);return new K([-2*a,0,0,0,0,-2*l,0,0,0,0,s,0,(n+e)*a,(r+t)*l,o*s,1])}static lookAt(n,e,t){const r=e.sub(n).normalize(),o=r.cross(t).normalize(),i=o.cross(r);return new K([o.x,i.x,-r.x,0,o.y,i.y,-r.y,0,o.z,i.z,-r.z,0,-o.dot(n),-i.dot(n),r.dot(n),1])}static trs(n,e,t,r,o,i){const l=K.fromQuaternion(e,t,r,o).data;return new K([i.x*l[0],i.x*l[1],i.x*l[2],0,i.y*l[4],i.y*l[5],i.y*l[6],0,i.z*l[8],i.z*l[9],i.z*l[10],0,n.x,n.y,n.z,1])}}class me{constructor(n=0,e=0,t=0,r=1){c(this,"x");c(this,"y");c(this,"z");c(this,"w");this.x=n,this.y=e,this.z=t,this.w=r}clone(){return new me(this.x,this.y,this.z,this.w)}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.lengthSq())}normalize(){const n=this.length();return n>0?new me(this.x/n,this.y/n,this.z/n,this.w/n):me.identity()}conjugate(){return new me(-this.x,-this.y,-this.z,this.w)}multiply(n){const e=this.x,t=this.y,r=this.z,o=this.w,i=n.x,a=n.y,l=n.z,s=n.w;return new me(o*i+e*s+t*l-r*a,o*a-e*l+t*s+r*i,o*l+e*a-t*i+r*s,o*s-e*i-t*a-r*l)}rotateVec3(n){const e=this.x,t=this.y,r=this.z,o=this.w,i=o*n.x+t*n.z-r*n.y,a=o*n.y+r*n.x-e*n.z,l=o*n.z+e*n.y-t*n.x,s=-e*n.x-t*n.y-r*n.z;return new I(i*o+s*-e+a*-r-l*-t,a*o+s*-t+l*-e-i*-r,l*o+s*-r+i*-t-a*-e)}toMat4(){return K.fromQuaternion(this.x,this.y,this.z,this.w)}slerp(n,e){let t=this.x*n.x+this.y*n.y+this.z*n.z+this.w*n.w,r=n.x,o=n.y,i=n.z,a=n.w;if(t<0&&(t=-t,r=-r,o=-o,i=-i,a=-a),t>=1)return this.clone();const l=Math.acos(t),s=Math.sqrt(1-t*t);if(Math.abs(s)<.001)return new me(this.x*.5+r*.5,this.y*.5+o*.5,this.z*.5+i*.5,this.w*.5+a*.5);const u=Math.sin((1-e)*l)/s,p=Math.sin(e*l)/s;return new me(this.x*u+r*p,this.y*u+o*p,this.z*u+i*p,this.w*u+a*p)}static identity(){return new me(0,0,0,1)}static fromAxisAngle(n,e){const t=Math.sin(e/2),r=n.normalize();return new me(r.x*t,r.y*t,r.z*t,Math.cos(e/2))}static fromEuler(n,e,t){const r=Math.cos(n/2),o=Math.sin(n/2),i=Math.cos(e/2),a=Math.sin(e/2),l=Math.cos(t/2),s=Math.sin(t/2);return new me(o*i*l+r*a*s,r*a*l-o*i*s,r*i*s+o*a*l,r*i*l-o*a*s)}}const De=new Uint8Array([23,125,161,52,103,117,70,37,247,101,203,169,124,126,44,123,152,238,145,45,171,114,253,10,192,136,4,157,249,30,35,72,175,63,77,90,181,16,96,111,133,104,75,162,93,56,66,240,8,50,84,229,49,210,173,239,141,1,87,18,2,198,143,57,225,160,58,217,168,206,245,204,199,6,73,60,20,230,211,233,94,200,88,9,74,155,33,15,219,130,226,202,83,236,42,172,165,218,55,222,46,107,98,154,109,67,196,178,127,158,13,243,65,79,166,248,25,224,115,80,68,51,184,128,232,208,151,122,26,212,105,43,179,213,235,148,146,89,14,195,28,78,112,76,250,47,24,251,140,108,186,190,228,170,183,139,39,188,244,246,132,48,119,144,180,138,134,193,82,182,120,121,86,220,209,3,91,241,149,85,205,150,113,216,31,100,41,164,177,214,153,231,38,71,185,174,97,201,29,95,7,92,54,254,191,118,34,221,131,11,163,99,234,81,227,147,156,176,17,142,69,12,110,62,27,255,0,194,59,116,242,252,19,21,187,53,207,129,64,135,61,40,167,237,102,223,106,159,197,189,215,137,36,32,22,5,23,125,161,52,103,117,70,37,247,101,203,169,124,126,44,123,152,238,145,45,171,114,253,10,192,136,4,157,249,30,35,72,175,63,77,90,181,16,96,111,133,104,75,162,93,56,66,240,8,50,84,229,49,210,173,239,141,1,87,18,2,198,143,57,225,160,58,217,168,206,245,204,199,6,73,60,20,230,211,233,94,200,88,9,74,155,33,15,219,130,226,202,83,236,42,172,165,218,55,222,46,107,98,154,109,67,196,178,127,158,13,243,65,79,166,248,25,224,115,80,68,51,184,128,232,208,151,122,26,212,105,43,179,213,235,148,146,89,14,195,28,78,112,76,250,47,24,251,140,108,186,190,228,170,183,139,39,188,244,246,132,48,119,144,180,138,134,193,82,182,120,121,86,220,209,3,91,241,149,85,205,150,113,216,31,100,41,164,177,214,153,231,38,71,185,174,97,201,29,95,7,92,54,254,191,118,34,221,131,11,163,99,234,81,227,147,156,176,17,142,69,12,110,62,27,255,0,194,59,116,242,252,19,21,187,53,207,129,64,135,61,40,167,237,102,223,106,159,197,189,215,137,36,32,22,5]),Le=new Uint8Array([7,9,5,0,11,1,6,9,3,9,11,1,8,10,4,7,8,6,1,5,3,10,9,10,0,8,4,1,5,2,7,8,7,11,9,10,1,0,4,7,5,0,11,6,1,4,2,8,8,10,4,9,9,2,5,7,9,1,7,2,2,6,11,5,5,4,6,9,0,1,1,0,7,6,9,8,4,10,3,1,2,8,8,9,10,11,5,11,11,2,6,10,3,4,2,4,9,10,3,2,6,3,6,10,5,3,4,10,11,2,9,11,1,11,10,4,9,4,11,0,4,11,4,0,0,0,7,6,10,4,1,3,11,5,3,4,2,9,1,3,0,1,8,0,6,7,8,7,0,4,6,10,8,2,3,11,11,8,0,2,4,8,3,0,0,10,6,1,2,2,4,5,6,0,1,3,11,9,5,5,9,6,9,8,3,8,1,8,9,6,9,11,10,7,5,6,5,9,1,3,7,0,2,10,11,2,6,1,3,11,7,7,2,1,7,3,0,8,1,1,5,0,6,10,11,11,0,2,7,0,10,8,3,5,7,1,11,1,0,7,9,0,11,5,10,3,2,3,5,9,7,9,8,4,6,5,7,9,5,0,11,1,6,9,3,9,11,1,8,10,4,7,8,6,1,5,3,10,9,10,0,8,4,1,5,2,7,8,7,11,9,10,1,0,4,7,5,0,11,6,1,4,2,8,8,10,4,9,9,2,5,7,9,1,7,2,2,6,11,5,5,4,6,9,0,1,1,0,7,6,9,8,4,10,3,1,2,8,8,9,10,11,5,11,11,2,6,10,3,4,2,4,9,10,3,2,6,3,6,10,5,3,4,10,11,2,9,11,1,11,10,4,9,4,11,0,4,11,4,0,0,0,7,6,10,4,1,3,11,5,3,4,2,9,1,3,0,1,8,0,6,7,8,7,0,4,6,10,8,2,3,11,11,8,0,2,4,8,3,0,0,10,6,1,2,2,4,5,6,0,1,3,11,9,5,5,9,6,9,8,3,8,1,8,9,6,9,11,10,7,5,6,5,9,1,3,7,0,2,10,11,2,6,1,3,11,7,7,2,1,7,3,0,8,1,1,5,0,6,10,11,11,0,2,7,0,10,8,3,5,7,1,11,1,0,7,9,0,11,5,10,3,2,3,5,9,7,9,8,4,6,5]),Et=new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]);function Mt(d){const n=d|0;return d<n?n-1:n}function Ne(d,n,e,t){const r=d*3;return Et[r]*n+Et[r+1]*e+Et[r+2]*t}function Ct(d){return((d*6-15)*d+10)*d*d*d}function Ft(d,n,e,t,r,o,i){const a=t-1&255,l=r-1&255,s=o-1&255,u=Mt(d),p=Mt(n),f=Mt(e),h=u&a,_=u+1&a,m=p&l,x=p+1&l,v=f&s,w=f+1&s,B=d-u,G=Ct(B),S=n-p,M=Ct(S),U=e-f,A=Ct(U),N=De[h+i],P=De[_+i],y=De[N+m],C=De[N+x],g=De[P+m],T=De[P+x],b=Ne(Le[y+v],B,S,U),E=Ne(Le[y+w],B,S,U-1),k=Ne(Le[C+v],B,S-1,U),z=Ne(Le[C+w],B,S-1,U-1),D=Ne(Le[g+v],B-1,S,U),O=Ne(Le[g+w],B-1,S,U-1),X=Ne(Le[T+v],B-1,S-1,U),ue=Ne(Le[T+w],B-1,S-1,U-1),de=b+(E-b)*A,Q=k+(z-k)*A,J=D+(O-D)*A,H=X+(ue-X)*A,Y=de+(Q-de)*M,q=J+(H-J)*M;return Y+(q-Y)*G}function ye(d,n,e,t,r,o,i){return Ft(d,n,e,t,r,o,i&255)}function bn(d,n,e,t,r,o,i){let a=1,l=1,s=.5,u=0;for(let p=0;p<i;p++){let f=Ft(d*a,n*a,e*a,0,0,0,p&255);f=o-Math.abs(f),f=f*f,u+=f*s*l,l=f,a*=t,s*=r}return u}function Cr(d,n,e,t,r,o){let i=1,a=1,l=0;for(let s=0;s<o;s++)l+=Math.abs(Ft(d*i,n*i,e*i,0,0,0,s&255)*a),i*=t,a*=r;return l}const yt=class yt extends Uint32Array{constructor(e){super(6);c(this,"_seed");this._seed=0,this.seed=e??Date.now()}get seed(){return this[0]}set seed(e){this._seed=e,this[0]=e,this[1]=this[0]*1812433253+1>>>0,this[2]=this[1]*1812433253+1>>>0,this[3]=this[2]*1812433253+1>>>0,this[4]=0,this[5]=0}reset(){this.seed=this._seed}randomUint32(){let e=this[3];const t=this[0];return this[3]=this[2],this[2]=this[1],this[1]=t,e^=e>>>2,e^=e<<1,e^=t^t<<4,this[0]=e,this[4]=this[4]+362437>>>0,this[5]=e+this[4]>>>0,this[5]}randomFloat(e,t){const r=(this.randomUint32()&8388607)*11920930376163766e-23;return e===void 0?r:r*((t??1)-e)+e}randomDouble(e,t){const r=this.randomUint32()>>>5,o=this.randomUint32()>>>6,i=(r*67108864+o)*(1/9007199254740992);return e===void 0?i:i*((t??1)-e)+e}};c(yt,"global",new yt);let ve=yt;class je{constructor(){c(this,"gameObject")}onAttach(){}onDetach(){}update(n){}}class Ce{constructor(n="GameObject"){c(this,"name");c(this,"position");c(this,"rotation");c(this,"scale");c(this,"children",[]);c(this,"parent",null);c(this,"_components",[]);this.name=n,this.position=I.zero(),this.rotation=me.identity(),this.scale=I.one()}addComponent(n){return n.gameObject=this,this._components.push(n),n.onAttach(),n}getComponent(n){for(const e of this._components)if(e instanceof n)return e;return null}getComponents(n){return this._components.filter(e=>e instanceof n)}removeComponent(n){const e=this._components.indexOf(n);e!==-1&&(n.onDetach(),this._components.splice(e,1))}addChild(n){n.parent=this,this.children.push(n)}localToWorld(){const n=K.trs(this.position,this.rotation.x,this.rotation.y,this.rotation.z,this.rotation.w,this.scale);return this.parent?this.parent.localToWorld().multiply(n):n}update(n){for(const e of this._components)e.update(n);for(const e of this.children)e.update(n)}}class yn extends je{constructor(e=60,t=.1,r=1e3,o=16/9){super();c(this,"fov");c(this,"near");c(this,"far");c(this,"aspect");this.fov=e*(Math.PI/180),this.near=t,this.far=r,this.aspect=o}projectionMatrix(){return K.perspective(this.fov,this.aspect,this.near,this.far)}viewMatrix(){return this.gameObject.localToWorld().invert()}viewProjectionMatrix(){return this.projectionMatrix().multiply(this.viewMatrix())}position(){const e=this.gameObject.localToWorld();return new I(e.data[12],e.data[13],e.data[14])}frustumCornersWorld(){const e=this.viewProjectionMatrix().invert();return[[-1,-1,0],[1,-1,0],[-1,1,0],[1,1,0],[-1,-1,1],[1,-1,1],[-1,1,1],[1,1,1]].map(([r,o,i])=>e.transformPoint(new I(r,o,i)))}}class xn extends je{constructor(e=new I(.3,-1,.5),t=I.one(),r=1,o=3){super();c(this,"direction");c(this,"color");c(this,"intensity");c(this,"numCascades");this.direction=e.normalize(),this.color=t,this.intensity=r,this.numCascades=o}computeCascadeMatrices(e,t){const r=t??e.far,o=this._computeSplitDepths(e.near,r,this.numCascades),i=[];for(let a=0;a<this.numCascades;a++){const l=a===0?e.near:o[a-1],s=o[a],u=this._frustumCornersForSplit(e,l,s),p=u.reduce((g,T)=>g.add(T),I.zero()).scale(1/8),f=this.direction.normalize(),h=K.lookAt(p.sub(f),p,new I(0,1,0)),_=2048;let m=0;for(const g of u)m=Math.max(m,g.sub(p).length());let x=2*m/_;m=Math.ceil(m/x)*x,m*=_/(_-2),x=2*m/_;let v=1/0,w=-1/0;for(const g of u){const T=h.transformPoint(g);v=Math.min(v,T.z),w=Math.max(w,T.z)}const B=Math.min((w-v)*2,256);v-=B,w+=B;let G=K.orthographic(-m,m,-m,m,-w,-v);const M=G.multiply(h).transformPoint(I.zero()),U=M.x*.5+.5,A=.5-M.y*.5,N=Math.round(U*_)/_,P=Math.round(A*_)/_,y=(N-U)*2,C=-(P-A)*2;G.set(3,0,G.get(3,0)+y),G.set(3,1,G.get(3,1)+C),i.push({lightViewProj:G.multiply(h),splitFar:s,depthRange:w-v,texelWorldSize:x})}return i}_computeSplitDepths(e,t,r){const i=[];for(let a=1;a<=r;a++){const l=e+(t-e)*(a/r),s=e*Math.pow(t/e,a/r);i.push(.75*s+(1-.75)*l)}return i}_frustumCornersForSplit(e,t,r){const o=e.near,i=e.far;e.near=t,e.far=r;const a=e.frustumCornersWorld();return e.near=o,e.far=i,a}}class _t extends je{constructor(e,t={}){super();c(this,"mesh");c(this,"material");c(this,"castShadow",!0);this.mesh=e,this.material={albedo:t.albedo??[1,1,1,1],roughness:t.roughness??.5,metallic:t.metallic??0,uvOffset:t.uvOffset,uvScale:t.uvScale,uvTile:t.uvTile,albedoMap:t.albedoMap,normalMap:t.normalMap,merMap:t.merMap}}}class Yn{constructor(){c(this,"gameObjects",[])}add(n){this.gameObjects.push(n)}remove(n){const e=this.gameObjects.indexOf(n);e!==-1&&this.gameObjects.splice(e,1)}update(n){for(const e of this.gameObjects)e.update(n)}findCamera(){for(const n of this.gameObjects){const e=n.getComponent(yn);if(e)return e}return null}findDirectionalLight(){for(const n of this.gameObjects){const e=n.getComponent(xn);if(e)return e}return null}collectMeshRenderers(){const n=[];for(const e of this.gameObjects)this._collectMeshRenderersRecursive(e,n);return n}_collectMeshRenderersRecursive(n,e){const t=n.getComponent(_t);t&&e.push(t);for(const r of n.children)this._collectMeshRenderersRecursive(r,e)}getComponents(n){const e=[];for(const t of this.gameObjects){const r=t.getComponent(n);r&&e.push(r)}return e}}const Xn=[new I(1,0,0),new I(-1,0,0),new I(0,1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1)],Kn=[new I(0,-1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1),new I(0,-1,0),new I(0,-1,0)];class Ht extends je{constructor(){super(...arguments);c(this,"color",I.one());c(this,"intensity",1);c(this,"radius",10);c(this,"castShadow",!1)}worldPosition(){return this.gameObject.localToWorld().transformPoint(I.zero())}cubeFaceViewProjs(e=.05){const t=this.worldPosition(),r=K.perspective(Math.PI/2,1,e,this.radius),o=new Array(6);for(let i=0;i<6;i++)o[i]=r.multiply(K.lookAt(t,t.add(Xn[i]),Kn[i]));return o}}class wn extends je{constructor(){super(...arguments);c(this,"color",I.one());c(this,"intensity",1);c(this,"range",20);c(this,"innerAngle",15);c(this,"outerAngle",30);c(this,"castShadow",!1);c(this,"projectionTexture",null)}worldPosition(){return this.gameObject.localToWorld().transformPoint(I.zero())}worldDirection(){return this.gameObject.localToWorld().transformDirection(new I(0,0,-1)).normalize()}lightViewProj(e=.1){const t=this.worldPosition(),r=this.worldDirection(),o=Math.abs(r.y)>.99?new I(1,0,0):new I(0,1,0),i=K.lookAt(t,t.add(r),o);return K.perspective(this.outerAngle*2*Math.PI/180,1,e,this.range).multiply(i)}}const $n=new I(0,1,0),Zn=new I(1,0,0),Qn=3;class Jn{constructor(n=0,e=0,t=5,r=.002){c(this,"yaw");c(this,"pitch");c(this,"speed");c(this,"sensitivity");c(this,"_keys",new Set);c(this,"_canvas",null);c(this,"_onMouseMove");c(this,"_onKeyDown");c(this,"_onKeyUp");c(this,"_onClick");this.yaw=n,this.pitch=e,this.speed=t,this.sensitivity=r;const o=Math.PI/2-.001;this._onMouseMove=i=>{document.pointerLockElement===this._canvas&&(this.yaw-=i.movementX*this.sensitivity,this.pitch=Math.max(-o,Math.min(o,this.pitch+i.movementY*this.sensitivity)))},this._onKeyDown=i=>this._keys.add(i.code),this._onKeyUp=i=>this._keys.delete(i.code),this._onClick=()=>{var i;return(i=this._canvas)==null?void 0:i.requestPointerLock()}}attach(n){this._canvas=n,n.addEventListener("click",this._onClick),document.addEventListener("mousemove",this._onMouseMove),document.addEventListener("keydown",this._onKeyDown),document.addEventListener("keyup",this._onKeyUp)}pressKey(n){this._keys.add(n)}detach(){this._canvas&&(this._canvas.removeEventListener("click",this._onClick),document.removeEventListener("mousemove",this._onMouseMove),document.removeEventListener("keydown",this._onKeyDown),document.removeEventListener("keyup",this._onKeyUp),this._canvas=null)}update(n,e){const t=Math.sin(this.yaw),r=Math.cos(this.yaw);let o=0,i=0,a=0;(this._keys.has("KeyW")||this._keys.has("ArrowUp"))&&(o-=t,a-=r),(this._keys.has("KeyS")||this._keys.has("ArrowDown"))&&(o+=t,a+=r),(this._keys.has("KeyA")||this._keys.has("ArrowLeft"))&&(o-=r,a+=t),(this._keys.has("KeyD")||this._keys.has("ArrowRight"))&&(o+=r,a-=t),this._keys.has("Space")&&(i+=1),this._keys.has("ShiftLeft")&&(i-=1);const l=Math.sqrt(o*o+i*i+a*a);if(l>0){const s=this._keys.has("ControlLeft")||this._keys.has("AltLeft"),u=this.speed*(s?Qn:1)*e/l;n.position.x+=o*u,n.position.y+=i*u,n.position.z+=a*u}n.rotation=me.fromAxisAngle($n,this.yaw).multiply(me.fromAxisAngle(Zn,-this.pitch))}}const ei=400,ti=16,Bn=ei/ti;var R=(d=>(d[d.NONE=0]="NONE",d[d.GRASS=1]="GRASS",d[d.SAND=2]="SAND",d[d.STONE=3]="STONE",d[d.DIRT=4]="DIRT",d[d.TRUNK=5]="TRUNK",d[d.TREELEAVES=6]="TREELEAVES",d[d.WATER=7]="WATER",d[d.GLASS=8]="GLASS",d[d.FLOWER=9]="FLOWER",d[d.GLOWSTONE=10]="GLOWSTONE",d[d.MAGMA=11]="MAGMA",d[d.OBSIDIAN=12]="OBSIDIAN",d[d.DIAMOND=13]="DIAMOND",d[d.IRON=14]="IRON",d[d.SPECULAR=15]="SPECULAR",d[d.CACTUS=16]="CACTUS",d[d.SNOW=17]="SNOW",d[d.GRASS_SNOW=18]="GRASS_SNOW",d[d.SPRUCE_PLANKS=19]="SPRUCE_PLANKS",d[d.GRASS_PROP=20]="GRASS_PROP",d[d.TORCH=21]="TORCH",d[d.DEAD_BUSH=22]="DEAD_BUSH",d[d.SNOWYLEAVES=23]="SNOWYLEAVES",d[d.AMETHYST=24]="AMETHYST",d[d.MAX=25]="MAX",d))(R||{});class te{constructor(n,e,t,r){c(this,"blockType");c(this,"sideFace");c(this,"bottomFace");c(this,"topFace");this.blockType=n,this.sideFace=e,this.bottomFace=t,this.topFace=r}}const wt=[new te(0,new L(0,0),new L(0,0),new L(0,0)),new te(1,new L(1,0),new L(3,0),new L(2,0)),new te(2,new L(4,0),new L(4,0),new L(4,0)),new te(3,new L(5,0),new L(5,0),new L(5,0)),new te(4,new L(6,0),new L(6,0),new L(6,0)),new te(5,new L(7,0),new L(8,0),new L(8,0)),new te(6,new L(9,0),new L(9,0),new L(9,0)),new te(7,new L(2,29),new L(2,29),new L(2,29)),new te(8,new L(10,0),new L(10,0),new L(10,0)),new te(9,new L(23,0),new L(23,0),new L(23,0)),new te(10,new L(11,0),new L(11,0),new L(11,0)),new te(11,new L(12,0),new L(12,0),new L(12,0)),new te(12,new L(13,0),new L(13,0),new L(13,0)),new te(13,new L(14,0),new L(14,0),new L(14,0)),new te(14,new L(15,0),new L(15,0),new L(15,0)),new te(15,new L(0,24),new L(0,24),new L(0,24)),new te(16,new L(17,0),new L(18,0),new L(16,0)),new te(17,new L(19,0),new L(19,0),new L(19,0)),new te(18,new L(20,0),new L(3,0),new L(21,0)),new te(19,new L(22,0),new L(22,0),new L(22,0)),new te(20,new L(1,1),new L(1,1),new L(1,1)),new te(21,new L(2,1),new L(2,1),new L(2,1)),new te(22,new L(3,1),new L(3,1),new L(3,1)),new te(23,new L(4,1),new L(9,0),new L(21,0)),new te(24,new L(5,1),new L(5,1),new L(5,1)),new te(25,new L(0,0),new L(0,0),new L(0,0))];class oe{constructor(n,e,t,r){c(this,"blockType");c(this,"materialType");c(this,"emitsLight");c(this,"collidable");this.blockType=n,this.materialType=e,this.emitsLight=t,this.collidable=r}}const Ze=[new oe(0,1,0,0),new oe(1,0,0,1),new oe(2,0,0,1),new oe(3,0,0,1),new oe(4,0,0,1),new oe(5,0,0,1),new oe(6,1,0,1),new oe(7,2,0,0),new oe(8,1,0,1),new oe(9,3,0,0),new oe(10,0,1,1),new oe(11,0,1,1),new oe(12,0,0,1),new oe(13,0,0,1),new oe(14,0,0,1),new oe(15,0,0,1),new oe(16,0,0,1),new oe(17,0,0,1),new oe(18,0,0,1),new oe(19,0,0,1),new oe(20,3,0,0),new oe(21,3,1,0),new oe(22,3,0,0),new oe(23,1,0,1),new oe(24,0,0,1)],ri=["None","Grass","Sand","Stone","Dirt","Trunk","Tree leaves","Water","Glass","Flower","Glowstone","Magma","Obsidian","Diamond","Iron","Specular","Cactus","Snow","Grass snow","Spruce planks","Grass prop","Torch","Dead bush","Snowy leaves","Amethyst","Max"];function ae(d){return Ze[d].materialType===2}function nt(d){return Ze[d].materialType===1||Ze[d].materialType===3}function Rr(d){return Ze[d].emitsLight===1}function Be(d){return Ze[d].materialType===3}const ni=new I(0,1,0),ii=new I(1,0,0),oi=-28,ai=-4,si=1.3,li=4.3,ci=7,ui=11.5,di=3.5,_e=.3,Ye=1.8,Lr=1.62;class fi{constructor(n,e=Math.PI,t=.1){c(this,"yaw");c(this,"pitch");c(this,"sensitivity",.002);c(this,"_velY",0);c(this,"_onGround",!1);c(this,"_prevInWater",!1);c(this,"_coyoteFrames",0);c(this,"_keys",new Set);c(this,"_canvas",null);c(this,"_world");c(this,"_onMouseMove");c(this,"_onKeyDown");c(this,"_onKeyUp");c(this,"_onClick");this._world=n,this.yaw=e,this.pitch=t;const r=Math.PI/2-.001;this._onMouseMove=o=>{document.pointerLockElement===this._canvas&&(this.yaw-=o.movementX*this.sensitivity,this.pitch=Math.max(-r,Math.min(r,this.pitch+o.movementY*this.sensitivity)))},this._onKeyDown=o=>this._keys.add(o.code),this._onKeyUp=o=>this._keys.delete(o.code),this._onClick=()=>{var o;return(o=this._canvas)==null?void 0:o.requestPointerLock()}}set velY(n){this._velY=n}attach(n){this._canvas=n,n.addEventListener("click",this._onClick),document.addEventListener("mousemove",this._onMouseMove),document.addEventListener("keydown",this._onKeyDown),document.addEventListener("keyup",this._onKeyUp)}detach(){this._canvas&&(this._canvas.removeEventListener("click",this._onClick),document.removeEventListener("mousemove",this._onMouseMove),document.removeEventListener("keydown",this._onKeyDown),document.removeEventListener("keyup",this._onKeyUp),this._canvas=null)}update(n,e){e=Math.min(e,.05),n.rotation=me.fromAxisAngle(ni,this.yaw).multiply(me.fromAxisAngle(ii,-this.pitch));const t=Math.sin(this.yaw),r=Math.cos(this.yaw),o=this._keys.has("ControlLeft")||this._keys.has("AltLeft"),i=this._keys.has("ShiftLeft"),a=o?ci:i?si:li;let l=0,s=0;(this._keys.has("KeyW")||this._keys.has("ArrowUp"))&&(l-=t,s-=r),(this._keys.has("KeyS")||this._keys.has("ArrowDown"))&&(l+=t,s+=r),(this._keys.has("KeyA")||this._keys.has("ArrowLeft"))&&(l-=r,s+=t),(this._keys.has("KeyD")||this._keys.has("ArrowRight"))&&(l+=r,s-=t);const u=Math.sqrt(l*l+s*s);u>0&&(l=l/u*a,s=s/u*a);let p=n.position.x,f=n.position.y-Lr,h=n.position.z;const _=ae(this._world.getBlockType(Math.floor(p),Math.floor(f+Ye*.5),Math.floor(h)));_?(this._keys.has("Space")&&(this._velY=di),this._velY=Math.max(this._velY+ai*e,-2)):(this._prevInWater&&this._velY>0&&(this._velY=0),this._keys.has("Space")&&(this._onGround||this._coyoteFrames>0)&&(this._velY=ui,this._coyoteFrames=0),this._velY=Math.max(this._velY+oi*e,-50)),p=this._slideX(p+l*e,f,h,l),h=this._slideZ(p,f,h+s*e,s);const[m,x,v]=this._slideY(p,f+this._velY*e,h);(x||v)&&(this._velY=0),f=m,this._onGround=x,this._prevInWater=_,x?this._coyoteFrames=6:_||(this._coyoteFrames=Math.max(0,this._coyoteFrames-1)),n.position.x=p,n.position.y=f+Lr,n.position.z=h}_isSolid(n,e,t){const r=this._world.getBlockType(n,e,t);return r!==R.NONE&&!ae(r)&&!Be(r)}_slideX(n,e,t,r){if(Math.abs(r)<1e-6)return n;const o=r>0?n+_e:n-_e,i=Math.floor(o),a=Math.floor(e+.01),l=Math.floor(e+Ye-.01),s=Math.floor(t-_e+.01),u=Math.floor(t+_e-.01);for(let p=a;p<=l;p++)for(let f=s;f<=u;f++)if(this._isSolid(i,p,f))return r>0?i-_e-.001:i+1+_e+.001;return n}_slideZ(n,e,t,r){if(Math.abs(r)<1e-6)return t;const o=r>0?t+_e:t-_e,i=Math.floor(o),a=Math.floor(e+.01),l=Math.floor(e+Ye-.01),s=Math.floor(n-_e+.01),u=Math.floor(n+_e-.01);for(let p=a;p<=l;p++)for(let f=s;f<=u;f++)if(this._isSolid(f,p,i))return r>0?i-_e-.001:i+1+_e+.001;return t}_slideY(n,e,t){const r=Math.floor(n-_e+.01),o=Math.floor(n+_e-.01),i=Math.floor(t-_e+.01),a=Math.floor(t+_e-.01);if(this._velY<=0){const l=Math.floor(e-.001);for(let s=r;s<=o;s++)for(let u=i;u<=a;u++)if(this._isSolid(s,l,u))return[l+1,!0,!1];return[e,!1,!1]}else{const l=Math.floor(e+Ye);for(let s=r;s<=o;s++)for(let u=i;u<=a;u++)if(this._isSolid(s,l,u))return[l-Ye-.001,!1,!0];return[e,!1,!1]}}}class Wt{constructor(n,e,t,r,o,i){c(this,"device");c(this,"queue");c(this,"context");c(this,"format");c(this,"canvas");c(this,"hdr");c(this,"enableErrorHandling");this.device=n,this.queue=n.queue,this.context=e,this.format=t,this.canvas=r,this.hdr=o,this.enableErrorHandling=i}get width(){return this.canvas.width}get height(){return this.canvas.height}static async create(n,e={}){if(!navigator.gpu)throw new Error("WebGPU not supported");const t=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!t)throw new Error("No WebGPU adapter found");const r=await t.requestDevice({requiredFeatures:[]});e.enableErrorHandling&&r.addEventListener("uncapturederror",l=>{const s=l.error;s instanceof GPUValidationError?console.error("[WebGPU Validation Error]",s.message):s instanceof GPUOutOfMemoryError?console.error("[WebGPU Out of Memory]"):console.error("[WebGPU Internal Error]",s)});const o=n.getContext("webgpu");let i,a=!1;try{o.configure({device:r,format:"rgba16float",alphaMode:"opaque",colorSpace:"display-p3",toneMapping:{mode:"extended"}}),i="rgba16float",a=!0}catch{i=navigator.gpu.getPreferredCanvasFormat(),o.configure({device:r,format:i,alphaMode:"opaque"})}return n.width=n.clientWidth*devicePixelRatio,n.height=n.clientHeight*devicePixelRatio,new Wt(r,o,i,n,a,e.enableErrorHandling??!1)}getCurrentTexture(){return this.context.getCurrentTexture()}createBuffer(n,e,t){return this.device.createBuffer({size:n,usage:e,label:t})}writeBuffer(n,e,t=0){e instanceof ArrayBuffer?this.queue.writeBuffer(n,t,e):this.queue.writeBuffer(n,t,e.buffer,e.byteOffset,e.byteLength)}pushInitErrorScope(){this.enableErrorHandling&&this.device.pushErrorScope("validation")}async popInitErrorScope(n){if(this.enableErrorHandling){const e=await this.device.popErrorScope();e&&(console.error(`[Init:${n}] Validation Error:`,e.message),console.trace())}}pushFrameErrorScope(){this.enableErrorHandling&&this.device.pushErrorScope("validation")}async popFrameErrorScope(){if(this.enableErrorHandling){const n=await this.device.popErrorScope();n&&(console.error("[Frame] Validation Error:",n.message),console.trace())}}pushPassErrorScope(n){this.enableErrorHandling&&(this.device.pushErrorScope("validation"),this.device.pushErrorScope("out-of-memory"),this.device.pushErrorScope("internal"))}async popPassErrorScope(n){if(this.enableErrorHandling){const e=await this.device.popErrorScope();e&&console.error(`[${n}] Internal Error:`,e),await this.device.popErrorScope()&&console.error(`[${n}] Out of Memory`);const r=await this.device.popErrorScope();r&&console.error(`[${n}] Validation Error:`,r.message)}}}class pe{constructor(){c(this,"enabled",!0)}destroy(){}}class vt{constructor(n,e,t,r,o){c(this,"albedoRoughness");c(this,"normalMetallic");c(this,"depth");c(this,"albedoRoughnessView");c(this,"normalMetallicView");c(this,"depthView");c(this,"width");c(this,"height");this.albedoRoughness=n,this.normalMetallic=e,this.depth=t,this.width=r,this.height=o,this.albedoRoughnessView=n.createView(),this.normalMetallicView=e.createView(),this.depthView=t.createView()}static create(n){const{device:e,width:t,height:r}=n,o=e.createTexture({label:"GBuffer AlbedoRoughness",size:{width:t,height:r},format:"rgba8unorm",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),i=e.createTexture({label:"GBuffer NormalMetallic",size:{width:t,height:r},format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),a=e.createTexture({label:"GBuffer Depth",size:{width:t,height:r},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING});return new vt(o,i,a,t,r)}destroy(){this.albedoRoughness.destroy(),this.normalMetallic.destroy(),this.depth.destroy()}}const qt=48,jt=[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x3"},{shaderLocation:2,offset:24,format:"float32x2"},{shaderLocation:3,offset:32,format:"float32x4"}];class Me{constructor(n,e,t){c(this,"vertexBuffer");c(this,"indexBuffer");c(this,"indexCount");this.vertexBuffer=n,this.indexBuffer=e,this.indexCount=t}destroy(){this.vertexBuffer.destroy(),this.indexBuffer.destroy()}static fromData(n,e,t){const r=n.createBuffer({label:"Mesh VertexBuffer",size:e.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});n.queue.writeBuffer(r,0,e.buffer,e.byteOffset,e.byteLength);const o=n.createBuffer({label:"Mesh IndexBuffer",size:t.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST});return n.queue.writeBuffer(o,0,t.buffer,t.byteOffset,t.byteLength),new Me(r,o,t.length)}static createCube(n,e=1){const t=e/2,r=[{normal:[0,0,1],tangent:[1,0,0,1],verts:[[-t,-t,t],[t,-t,t],[t,t,t],[-t,t,t]]},{normal:[0,0,-1],tangent:[-1,0,0,1],verts:[[t,-t,-t],[-t,-t,-t],[-t,t,-t],[t,t,-t]]},{normal:[1,0,0],tangent:[0,0,-1,1],verts:[[t,-t,t],[t,-t,-t],[t,t,-t],[t,t,t]]},{normal:[-1,0,0],tangent:[0,0,1,1],verts:[[-t,-t,-t],[-t,-t,t],[-t,t,t],[-t,t,-t]]},{normal:[0,1,0],tangent:[1,0,0,1],verts:[[-t,t,t],[t,t,t],[t,t,-t],[-t,t,-t]]},{normal:[0,-1,0],tangent:[1,0,0,1],verts:[[-t,-t,-t],[t,-t,-t],[t,-t,t],[-t,-t,t]]}],o=[[0,1],[1,1],[1,0],[0,0]],i=[],a=[];let l=0;for(const s of r){for(let u=0;u<4;u++)i.push(...s.verts[u],...s.normal,...o[u],...s.tangent);a.push(l,l+1,l+2,l,l+2,l+3),l+=4}return Me.fromData(n,new Float32Array(i),new Uint32Array(a))}static createSphere(n,e=.5,t=32,r=32){const o=[],i=[];for(let a=0;a<=t;a++){const l=a/t*Math.PI,s=Math.sin(l),u=Math.cos(l);for(let p=0;p<=r;p++){const f=p/r*Math.PI*2,h=Math.sin(f),_=Math.cos(f),m=s*_,x=u,v=s*h;o.push(m*e,x*e,v*e,m,x,v,p/r,a/t,-h,0,_,1)}}for(let a=0;a<t;a++)for(let l=0;l<r;l++){const s=a*(r+1)+l,u=s+r+1;i.push(s,s+1,u),i.push(s+1,u+1,u)}return Me.fromData(n,new Float32Array(o),new Uint32Array(i))}static createCone(n,e=.5,t=1,r=16){const o=[],i=[],a=Math.sqrt(t*t+e*e),l=t/a,s=e/a;o.push(0,t,0,0,1,0,.5,0,1,0,0,1);const u=1;for(let h=0;h<=r;h++){const _=h/r*Math.PI*2,m=Math.cos(_),x=Math.sin(_);o.push(m*e,0,x*e,m*l,s,x*l,h/r,1,m,0,x,1)}for(let h=0;h<r;h++)i.push(0,u+h+1,u+h);const p=u+r+1;o.push(0,0,0,0,-1,0,.5,.5,1,0,0,1);const f=p+1;for(let h=0;h<=r;h++){const _=h/r*Math.PI*2,m=Math.cos(_),x=Math.sin(_);o.push(m*e,0,x*e,0,-1,0,.5+m*.5,.5+x*.5,1,0,0,1)}for(let h=0;h<r;h++)i.push(p,f+h,f+h+1);return Me.fromData(n,new Float32Array(o),new Uint32Array(i))}static createPlane(n,e=10,t=10,r=1,o=1){const i=[],a=[];for(let l=0;l<=o;l++)for(let s=0;s<=r;s++){const u=(s/r-.5)*e,p=(l/o-.5)*t,f=s/r,h=l/o;i.push(u,0,p,0,1,0,f,h,1,0,0,1)}for(let l=0;l<o;l++)for(let s=0;s<r;s++){const u=l*(r+1)+s;a.push(u,u+r+1,u+1,u+1,u+r+1,u+r+2)}return Me.fromData(n,new Float32Array(i),new Uint32Array(a))}}const Sn=`// Shadow map rendering shader - outputs depth only

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
`,Nr=2048,it=4;class Yt extends pe{constructor(e,t,r,o,i,a,l,s){super();c(this,"name","ShadowPass");c(this,"shadowMap");c(this,"shadowMapView");c(this,"shadowMapArrayViews");c(this,"_pipeline");c(this,"_shadowBindGroups");c(this,"_shadowUniformBuffers");c(this,"_modelUniformBuffers",[]);c(this,"_modelBindGroups",[]);c(this,"_cascadeCount");c(this,"_cascades",[]);c(this,"_modelBGL");c(this,"_sceneSnapshot",[]);this.shadowMap=e,this.shadowMapView=t,this.shadowMapArrayViews=r,this._pipeline=o,this._shadowBindGroups=i,this._shadowUniformBuffers=a,this._modelBGL=l,this._cascadeCount=s}static create(e,t=3){const{device:r}=e,o=r.createTexture({label:"ShadowMap",size:{width:Nr,height:Nr,depthOrArrayLayers:it},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),i=o.createView({dimension:"2d-array"}),a=Array.from({length:it},(_,m)=>o.createView({dimension:"2d",baseArrayLayer:m,arrayLayerCount:1})),l=r.createBindGroupLayout({label:"ShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),s=r.createBindGroupLayout({label:"ModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),u=[],p=[];for(let _=0;_<it;_++){const m=r.createBuffer({label:`ShadowUniformBuffer ${_}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});u.push(m),p.push(r.createBindGroup({label:`ShadowBindGroup ${_}`,layout:l,entries:[{binding:0,resource:{buffer:m}}]}))}const f=r.createShaderModule({label:"ShadowShader",code:Sn}),h=r.createRenderPipeline({label:"ShadowPipeline",layout:r.createPipelineLayout({bindGroupLayouts:[l,s]}),vertex:{module:f,entryPoint:"vs_main",buffers:[{arrayStride:qt,attributes:[jt[0]]}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less",depthBias:2,depthBiasSlopeScale:1.5,depthBiasClamp:0},primitive:{topology:"triangle-list",cullMode:"back"}});return new Yt(o,i,a,h,p,u,s,t)}updateScene(e,t,r,o){this._cascades=r.computeCascadeMatrices(t,o),this._cascadeCount=Math.min(this._cascades.length,it)}execute(e,t){const{device:r}=t,o=this._getMeshRenderers(t);this._ensureModelBuffers(r,o.length);for(let i=0;i<this._cascadeCount&&!(i>=this._cascades.length);i++){const a=this._cascades[i];t.queue.writeBuffer(this._shadowUniformBuffers[i],0,a.lightViewProj.data.buffer);const l=e.beginRenderPass({label:`ShadowPass cascade ${i}`,colorAttachments:[],depthStencilAttachment:{view:this.shadowMapArrayViews[i],depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});l.setPipeline(this._pipeline),l.setBindGroup(0,this._shadowBindGroups[i]);for(let s=0;s<o.length;s++){const{mesh:u,modelMatrix:p}=o[s],f=this._modelUniformBuffers[s];t.queue.writeBuffer(f,0,p.data.buffer),l.setBindGroup(1,this._modelBindGroups[s]),l.setVertexBuffer(0,u.vertexBuffer),l.setIndexBuffer(u.indexBuffer,"uint32"),l.drawIndexed(u.indexCount)}l.end()}}_getMeshRenderers(e){return this._sceneSnapshot??[]}setSceneSnapshot(e){this._sceneSnapshot=e}_ensureModelBuffers(e,t){for(;this._modelUniformBuffers.length<t;){const r=e.createBuffer({label:`ModelUniform ${this._modelUniformBuffers.length}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),o=e.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:r}}]});this._modelUniformBuffers.push(r),this._modelBindGroups.push(o)}}destroy(){this.shadowMap.destroy();for(const e of this._shadowUniformBuffers)e.destroy();for(const e of this._modelUniformBuffers)e.destroy()}}const pi=`// Deferred PBR lighting pass — fullscreen triangle, reads GBuffer + shadow maps + IBL.\r
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
`,$="rgba16float",kr=64*4+16+16,Or=368;class Xt extends pe{constructor(e,t,r,o,i,a,l,s,u,p,f,h,_,m,x,v){super();c(this,"name","LightingPass");c(this,"hdrTexture");c(this,"hdrView");c(this,"cameraBuffer");c(this,"lightBuffer");c(this,"_pipeline");c(this,"_sceneBindGroup");c(this,"_gbufferBindGroup");c(this,"_aoBindGroup");c(this,"_iblBindGroup");c(this,"_defaultCloudShadow");c(this,"_defaultSsgi");c(this,"_device");c(this,"_aoBGL");c(this,"_aoView");c(this,"_aoSampler");c(this,"_ssgiSampler");this.hdrTexture=e,this.hdrView=t,this._pipeline=r,this._sceneBindGroup=o,this._gbufferBindGroup=i,this._aoBindGroup=a,this._iblBindGroup=l,this.cameraBuffer=s,this.lightBuffer=u,this._defaultCloudShadow=p,this._defaultSsgi=f,this._device=h,this._aoBGL=_,this._aoView=m,this._aoSampler=x,this._ssgiSampler=v}static create(e,t,r,o,i,a){const{device:l,width:s,height:u}=e,p=l.createTexture({label:"HDR Texture",size:{width:s,height:u},format:$,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),f=p.createView(),h=l.createBuffer({label:"LightCameraBuffer",size:kr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),_=l.createBuffer({label:"LightBuffer",size:Or,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),m=l.createSampler({label:"ShadowSampler",compare:"less-equal",magFilter:"linear",minFilter:"linear"}),x=l.createSampler({label:"GBufferLinearSampler",magFilter:"linear",minFilter:"linear"}),v=l.createSampler({label:"AoSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),w=l.createSampler({label:"SsgiSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),B=l.createBindGroupLayout({label:"LightSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),G=l.createBindGroupLayout({label:"LightGBufferBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth",viewDimension:"2d-array"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"comparison"}},{binding:5,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:6,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),S=l.createTexture({label:"DefaultCloudShadow",size:{width:1,height:1},format:"r8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});l.queue.writeTexture({texture:S},new Uint8Array([255]),{bytesPerRow:1},{width:1,height:1});const M=i??S.createView(),U=l.createBindGroupLayout({label:"LightAoBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),A=l.createTexture({label:"DefaultSsgi",size:{width:1,height:1},format:$,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),N=l.createBindGroupLayout({label:"LightIblBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),P=l.createSampler({label:"IblSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge"}),y=l.createTexture({label:"DefaultIblCube",size:{width:1,height:1,depthOrArrayLayers:6},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),C=y.createView({dimension:"cube"}),g=l.createTexture({label:"DefaultBrdfLut",size:{width:1,height:1},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),T=l.createBindGroup({label:"LightIblBG",layout:N,entries:[{binding:0,resource:(a==null?void 0:a.irradianceView)??C},{binding:1,resource:(a==null?void 0:a.prefilteredView)??C},{binding:2,resource:(a==null?void 0:a.brdfLutView)??g.createView()},{binding:3,resource:P}]});y.destroy(),g.destroy();const b=l.createBindGroup({layout:B,entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:{buffer:_}}]}),E=l.createBindGroup({layout:G,entries:[{binding:0,resource:t.albedoRoughnessView},{binding:1,resource:t.normalMetallicView},{binding:2,resource:t.depthView},{binding:3,resource:r.shadowMapView},{binding:4,resource:m},{binding:5,resource:x},{binding:6,resource:M}]}),k=l.createBindGroup({label:"LightAoBG",layout:U,entries:[{binding:0,resource:o},{binding:1,resource:v},{binding:2,resource:A.createView()},{binding:3,resource:w}]}),z=l.createShaderModule({label:"LightingShader",code:pi}),D=l.createRenderPipeline({label:"LightingPipeline",layout:l.createPipelineLayout({bindGroupLayouts:[B,G,U,N]}),vertex:{module:z,entryPoint:"vs_main"},fragment:{module:z,entryPoint:"fs_main",targets:[{format:$}]},primitive:{topology:"triangle-list"}});return new Xt(p,f,D,b,E,k,T,h,_,i?null:S,A,l,U,o,v,w)}updateSSGI(e){this._aoBindGroup=this._device.createBindGroup({label:"LightAoBG",layout:this._aoBGL,entries:[{binding:0,resource:this._aoView},{binding:1,resource:this._aoSampler},{binding:2,resource:e},{binding:3,resource:this._ssgiSampler}]})}updateCamera(e,t,r,o,i,a,l,s){const u=new Float32Array(kr/4);u.set(t.data,0),u.set(r.data,16),u.set(o.data,32),u.set(i.data,48),u[64]=a.x,u[65]=a.y,u[66]=a.z,u[67]=l,u[68]=s,e.queue.writeBuffer(this.cameraBuffer,0,u.buffer)}updateLight(e,t,r,o,i,a=!0,l=!1,s=.02){const u=new Float32Array(Or/4);let p=0;u[p++]=t.x,u[p++]=t.y,u[p++]=t.z,u[p++]=o,u[p++]=r.x,u[p++]=r.y,u[p++]=r.z,new Uint32Array(u.buffer)[p++]=i.length;for(let f=0;f<4;f++)f<i.length&&u.set(i[f].lightViewProj.data,p),p+=16;for(let f=0;f<4;f++)u[p++]=f<i.length?i[f].splitFar:1e9;new Uint32Array(u.buffer)[p]=a?1:0,new Uint32Array(u.buffer)[p+1]=l?1:0,u[81]=s;for(let f=0;f<4;f++)u[84+f]=f<i.length?i[f].depthRange:1;for(let f=0;f<4;f++)u[88+f]=f<i.length?i[f].texelWorldSize:1;e.queue.writeBuffer(this.lightBuffer,0,u.buffer)}updateCloudShadow(e,t,r,o){const i=new Float32Array(3);i[0]=t,i[1]=r,i[2]=o,e.queue.writeBuffer(this.lightBuffer,312,i.buffer)}execute(e,t){const r=e.beginRenderPass({label:"LightingPass",colorAttachments:[{view:this.hdrView,loadOp:"load",storeOp:"store"}]});r.setPipeline(this._pipeline),r.setBindGroup(0,this._sceneBindGroup),r.setBindGroup(1,this._gbufferBindGroup),r.setBindGroup(2,this._aoBindGroup),r.setBindGroup(3,this._iblBindGroup),r.draw(3),r.end()}destroy(){var e,t;this.hdrTexture.destroy(),this.cameraBuffer.destroy(),this.lightBuffer.destroy(),(e=this._defaultCloudShadow)==null||e.destroy(),(t=this._defaultSsgi)==null||t.destroy()}}const hi=`// Physically based single-scattering atmosphere (Rayleigh + Mie).\r
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
`,Ir=96;class Kt extends pe{constructor(e,t,r,o){super();c(this,"name","AtmospherePass");c(this,"_pipeline");c(this,"_uniformBuf");c(this,"_bg");c(this,"_hdrView");this._pipeline=e,this._uniformBuf=t,this._bg=r,this._hdrView=o}static create(e,t){const{device:r}=e,o=r.createBuffer({label:"AtmosphereUniform",size:Ir,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),i=r.createBindGroupLayout({label:"AtmosphereBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),a=r.createBindGroup({label:"AtmosphereBG",layout:i,entries:[{binding:0,resource:{buffer:o}}]}),l=r.createShaderModule({label:"AtmosphereShader",code:hi}),s=r.createRenderPipeline({label:"AtmospherePipeline",layout:r.createPipelineLayout({bindGroupLayouts:[i]}),vertex:{module:l,entryPoint:"vs_main"},fragment:{module:l,entryPoint:"fs_main",targets:[{format:$}]},primitive:{topology:"triangle-list"}});return new Kt(s,o,a,t)}update(e,t,r,o){const i=new Float32Array(Ir/4);i.set(t.data,0),i[16]=r.x,i[17]=r.y,i[18]=r.z;const a=Math.sqrt(o.x*o.x+o.y*o.y+o.z*o.z),l=a>0?1/a:0;i[20]=-o.x*l,i[21]=-o.y*l,i[22]=-o.z*l,e.queue.writeBuffer(this._uniformBuf,0,i.buffer)}execute(e,t){const r=e.beginRenderPass({label:"AtmospherePass",colorAttachments:[{view:this._hdrView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._pipeline),r.setBindGroup(0,this._bg),r.draw(3),r.end()}destroy(){this._uniformBuf.destroy()}}const mi=`// Block selection highlight — two draw calls sharing this shader:\r
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
@vertex\r
fn vs_face(@builtin(vertex_index) vid: u32) -> @builtin(position) vec4<f32> {\r
  let ci  = FACE_CI[vid];\r
  let pos = u.blockPos + vec3<f32>(\r
    mix(-0.001, 1.001, f32((ci >> 0u) & 1u)),\r
    mix(-0.001, 1.001, f32((ci >> 1u) & 1u)),\r
    mix(-0.001, 1.001, f32((ci >> 2u) & 1u)),\r
  );\r
  return u.viewProj * vec4<f32>(pos, 1.0);\r
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
  return u.viewProj * vec4<f32>(base + off, 1.0);\r
}\r
\r
@fragment\r
fn fs_edge() -> @location(0) vec4<f32> {\r
  return vec4<f32>(0.0, 0.0, 0.0, 0.8);\r
}\r
`,Vr=80;class $t extends pe{constructor(e,t,r,o,i,a){super();c(this,"name","BlockHighlightPass");c(this,"_facePipeline");c(this,"_edgePipeline");c(this,"_uniformBuf");c(this,"_bg");c(this,"_hdrView");c(this,"_depthView");c(this,"_active",!1);this._facePipeline=e,this._edgePipeline=t,this._uniformBuf=r,this._bg=o,this._hdrView=i,this._depthView=a}static create(e,t,r){const{device:o}=e,i=o.createBuffer({label:"BlockHighlightUniform",size:Vr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),a=o.createBindGroupLayout({label:"BlockHighlightBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),l=o.createBindGroup({label:"BlockHighlightBG",layout:a,entries:[{binding:0,resource:{buffer:i}}]}),s=o.createShaderModule({label:"BlockHighlightShader",code:mi}),u=o.createPipelineLayout({bindGroupLayouts:[a]}),p={format:"depth32float",depthWriteEnabled:!1,depthCompare:"less-equal"},f={format:"depth32float",depthWriteEnabled:!1,depthCompare:"less-equal",depthBias:-2,depthBiasSlopeScale:-1,depthBiasClamp:0},h={color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}},_=o.createRenderPipeline({label:"BlockHighlightFacePipeline",layout:u,vertex:{module:s,entryPoint:"vs_face"},fragment:{module:s,entryPoint:"fs_face",targets:[{format:$,blend:h}]},primitive:{topology:"triangle-list",cullMode:"none"},depthStencil:f}),m=o.createRenderPipeline({label:"BlockHighlightEdgePipeline",layout:u,vertex:{module:s,entryPoint:"vs_edge"},fragment:{module:s,entryPoint:"fs_edge",targets:[{format:$,blend:h}]},primitive:{topology:"triangle-list",cullMode:"none"},depthStencil:p});return new $t(_,m,i,l,t,r)}update(e,t,r){if(!r){this._active=!1;return}this._active=!0;const o=new Float32Array(Vr/4);o.set(t.data,0),o[16]=r.x,o[17]=r.y,o[18]=r.z,e.queue.writeBuffer(this._uniformBuf,0,o.buffer)}execute(e,t){if(!this._active)return;const r=e.beginRenderPass({label:"BlockHighlightPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._depthView,depthLoadOp:"load",depthStoreOp:"store"}});r.setBindGroup(0,this._bg),r.setPipeline(this._facePipeline),r.draw(36),r.setPipeline(this._edgePipeline),r.draw(144),r.end()}destroy(){this._uniformBuf.destroy()}}const _i=`// Cloud + sky pass — fullscreen triangle.\r
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
`,zr=96,Dr=48,Fr=32;class Zt extends pe{constructor(e,t,r,o,i,a,l,s,u){super();c(this,"name","CloudPass");c(this,"_pipeline");c(this,"_hdrView");c(this,"_cameraBuffer");c(this,"_cloudBuffer");c(this,"_lightBuffer");c(this,"_sceneBG");c(this,"_lightBG");c(this,"_depthBG");c(this,"_noiseSkyBG");this._pipeline=e,this._hdrView=t,this._cameraBuffer=r,this._cloudBuffer=o,this._lightBuffer=i,this._sceneBG=a,this._lightBG=l,this._depthBG=s,this._noiseSkyBG=u}static create(e,t,r,o){const{device:i}=e,a=i.createBuffer({label:"CloudCameraBuffer",size:zr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),l=i.createBuffer({label:"CloudUniformBuffer",size:Dr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),s=i.createBuffer({label:"CloudLightBuffer",size:Fr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),u=i.createBindGroupLayout({label:"CloudSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),p=i.createBindGroupLayout({label:"CloudLightBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),f=i.createBindGroupLayout({label:"CloudDepthBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),h=i.createBindGroupLayout({label:"CloudNoiseSkyBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),_=i.createSampler({label:"CloudNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"repeat",addressModeV:"repeat",addressModeW:"repeat"}),m=i.createSampler({label:"CloudDepthSampler"}),x=i.createBindGroup({label:"CloudSceneBG",layout:u,entries:[{binding:0,resource:{buffer:a}},{binding:1,resource:{buffer:l}}]}),v=i.createBindGroup({label:"CloudLightBG",layout:p,entries:[{binding:0,resource:{buffer:s}}]}),w=i.createBindGroup({label:"CloudDepthBG",layout:f,entries:[{binding:0,resource:r},{binding:1,resource:m}]}),B=i.createBindGroup({label:"CloudNoiseSkyBG",layout:h,entries:[{binding:0,resource:o.baseView},{binding:1,resource:o.detailView},{binding:2,resource:_}]}),G=i.createShaderModule({label:"CloudShader",code:_i}),S=i.createRenderPipeline({label:"CloudPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[u,p,f,h]}),vertex:{module:G,entryPoint:"vs_main"},fragment:{module:G,entryPoint:"fs_main",targets:[{format:$}]},primitive:{topology:"triangle-list"}});return new Zt(S,t,a,l,s,x,v,w,B)}updateCamera(e,t,r,o,i){const a=new Float32Array(zr/4);a.set(t.data,0),a[16]=r.x,a[17]=r.y,a[18]=r.z,a[19]=o,a[20]=i,e.queue.writeBuffer(this._cameraBuffer,0,a.buffer)}updateLight(e,t,r,o){const i=new Float32Array(Fr/4);i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=o,i[4]=r.x,i[5]=r.y,i[6]=r.z,e.queue.writeBuffer(this._lightBuffer,0,i.buffer)}updateSettings(e,t){const r=new Float32Array(Dr/4);r[0]=t.cloudBase,r[1]=t.cloudTop,r[2]=t.coverage,r[3]=t.density,r[4]=t.windOffset[0],r[5]=t.windOffset[1],r[6]=t.anisotropy,r[7]=t.extinction,r[8]=t.ambientColor[0],r[9]=t.ambientColor[1],r[10]=t.ambientColor[2],r[11]=t.exposure,e.queue.writeBuffer(this._cloudBuffer,0,r.buffer)}execute(e,t){const r=e.beginRenderPass({label:"CloudPass",colorAttachments:[{view:this._hdrView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._pipeline),r.setBindGroup(0,this._sceneBG),r.setBindGroup(1,this._lightBG),r.setBindGroup(2,this._depthBG),r.setBindGroup(3,this._noiseSkyBG),r.draw(3),r.end()}destroy(){this._cameraBuffer.destroy(),this._cloudBuffer.destroy(),this._lightBuffer.destroy()}}const gi=`// Cloud shadow pass — renders a top-down cloud transmittance map (1024×1024 r8unorm).\r
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
`,Hr=1024,Wr="r8unorm",qr=48;class Qt extends pe{constructor(e,t,r,o,i,a){super();c(this,"name","CloudShadowPass");c(this,"shadowTexture");c(this,"shadowView");c(this,"_pipeline");c(this,"_uniformBuffer");c(this,"_uniformBG");c(this,"_noiseBG");c(this,"_frameCount",0);this.shadowTexture=e,this.shadowView=t,this._pipeline=r,this._uniformBuffer=o,this._uniformBG=i,this._noiseBG=a}static create(e,t){const{device:r}=e,o=r.createTexture({label:"CloudShadowTexture",size:{width:Hr,height:Hr},format:Wr,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),i=o.createView(),a=r.createBuffer({label:"CloudShadowUniform",size:qr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),l=r.createBindGroupLayout({label:"CloudShadowUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),s=r.createSampler({label:"CloudNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"repeat",addressModeV:"repeat",addressModeW:"repeat"}),u=r.createBindGroupLayout({label:"CloudShadowNoiseBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),p=r.createBindGroup({label:"CloudShadowUniformBG",layout:l,entries:[{binding:0,resource:{buffer:a}}]}),f=r.createBindGroup({label:"CloudShadowNoiseBG",layout:u,entries:[{binding:0,resource:t.baseView},{binding:1,resource:t.detailView},{binding:2,resource:s}]}),h=r.createShaderModule({label:"CloudShadowShader",code:gi}),_=r.createRenderPipeline({label:"CloudShadowPipeline",layout:r.createPipelineLayout({bindGroupLayouts:[l,u]}),vertex:{module:h,entryPoint:"vs_main"},fragment:{module:h,entryPoint:"fs_main",targets:[{format:Wr}]},primitive:{topology:"triangle-list"}});return new Qt(o,i,_,a,p,f)}update(e,t,r,o){const i=new Float32Array(qr/4);i[0]=t.cloudBase,i[1]=t.cloudTop,i[2]=t.coverage,i[3]=t.density,i[4]=t.windOffset[0],i[5]=t.windOffset[1],i[6]=r[0],i[7]=r[1],i[8]=o,i[9]=t.extinction,e.queue.writeBuffer(this._uniformBuffer,0,i.buffer)}execute(e,t){if(this._frameCount++%2!==0)return;const r=e.beginRenderPass({label:"CloudShadowPass",colorAttachments:[{view:this.shadowView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._pipeline),r.setBindGroup(0,this._uniformBG),r.setBindGroup(1,this._noiseBG),r.draw(3),r.end()}destroy(){this.shadowTexture.destroy(),this._uniformBuffer.destroy()}}const vi=`// TAA resolve pass — fullscreen triangle, blends current HDR with reprojected history.\r
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
`,jr=128;class Jt extends pe{constructor(e,t,r,o,i,a,l,s,u,p){super();c(this,"name","TAAPass");c(this,"_resolved");c(this,"resolvedView");c(this,"_history");c(this,"_historyView");c(this,"_pipeline");c(this,"_uniformBuffer");c(this,"_uniformBG");c(this,"_textureBG");c(this,"_width");c(this,"_height");this._resolved=e,this.resolvedView=t,this._history=r,this._historyView=o,this._pipeline=i,this._uniformBuffer=a,this._uniformBG=l,this._textureBG=s,this._width=u,this._height=p}get historyView(){return this._historyView}static create(e,t,r){const{device:o,width:i,height:a}=e,l=o.createTexture({label:"TAA Resolved",size:{width:i,height:a},format:$,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),s=o.createTexture({label:"TAA History",size:{width:i,height:a},format:$,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),u=l.createView(),p=s.createView(),f=o.createBuffer({label:"TAAUniformBuffer",size:jr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),h=o.createBindGroupLayout({label:"TAAUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),_=o.createBindGroupLayout({label:"TAATextureBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),m=o.createSampler({label:"TAALinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),x=o.createBindGroup({layout:h,entries:[{binding:0,resource:{buffer:f}}]}),v=o.createBindGroup({layout:_,entries:[{binding:0,resource:t.hdrView},{binding:1,resource:p},{binding:2,resource:r.depthView},{binding:3,resource:m}]}),w=o.createShaderModule({label:"TAAShader",code:vi}),B=o.createRenderPipeline({label:"TAAPipeline",layout:o.createPipelineLayout({bindGroupLayouts:[h,_]}),vertex:{module:w,entryPoint:"vs_main"},fragment:{module:w,entryPoint:"fs_main",targets:[{format:$}]},primitive:{topology:"triangle-list"}});return new Jt(l,u,s,p,B,f,x,v,i,a)}updateCamera(e,t,r){const o=new Float32Array(jr/4);o.set(t.data,0),o.set(r.data,16),e.queue.writeBuffer(this._uniformBuffer,0,o.buffer)}execute(e,t){const r=e.beginRenderPass({label:"TAAPass",colorAttachments:[{view:this.resolvedView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._pipeline),r.setBindGroup(0,this._uniformBG),r.setBindGroup(1,this._textureBG),r.draw(3),r.end(),e.copyTextureToTexture({texture:this._resolved},{texture:this._history},{width:this._width,height:this._height})}destroy(){this._resolved.destroy(),this._history.destroy(),this._uniformBuffer.destroy()}}const bi=`// Bloom: prefilter (downsample + threshold) and separable Gaussian blur.\r
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
`,yi=`// Bloom composite: adds the blurred bright regions back to the source HDR.\r
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
`,xi=16;class er extends pe{constructor(e,t,r,o,i,a,l,s,u,p,f,h,_,m,x){super();c(this,"name","BloomPass");c(this,"resultView");c(this,"_result");c(this,"_half1");c(this,"_half2");c(this,"_half1View");c(this,"_half2View");c(this,"_prefilterPipeline");c(this,"_blurHPipeline");c(this,"_blurVPipeline");c(this,"_compositePipeline");c(this,"_uniformBuffer");c(this,"_prefilterBG");c(this,"_blurHBG");c(this,"_blurVBG");c(this,"_compositeBG");this._result=e,this.resultView=t,this._half1=r,this._half1View=o,this._half2=i,this._half2View=a,this._prefilterPipeline=l,this._blurHPipeline=s,this._blurVPipeline=u,this._compositePipeline=p,this._uniformBuffer=f,this._prefilterBG=h,this._blurHBG=_,this._blurVBG=m,this._compositeBG=x}static create(e,t){const{device:r,width:o,height:i}=e,a=Math.max(1,o>>1),l=Math.max(1,i>>1),s=r.createTexture({label:"BloomHalf1",size:{width:a,height:l},format:$,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),u=r.createTexture({label:"BloomHalf2",size:{width:a,height:l},format:$,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),p=r.createTexture({label:"BloomResult",size:{width:o,height:i},format:$,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),f=s.createView(),h=u.createView(),_=p.createView(),m=r.createBuffer({label:"BloomUniforms",size:xi,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(m,0,new Float32Array([1,.5,.3,0]).buffer);const x=r.createSampler({label:"BloomSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),v=r.createBindGroupLayout({label:"BloomSingleBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),w=r.createBindGroupLayout({label:"BloomCompositeBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),B=r.createShaderModule({label:"BloomShader",code:bi}),G=r.createShaderModule({label:"BloomComposite",code:yi}),S=r.createPipelineLayout({bindGroupLayouts:[v]}),M=r.createPipelineLayout({bindGroupLayouts:[w]});function U(k,z){return r.createRenderPipeline({label:z,layout:S,vertex:{module:B,entryPoint:"vs_main"},fragment:{module:B,entryPoint:k,targets:[{format:$}]},primitive:{topology:"triangle-list"}})}const A=U("fs_prefilter","BloomPrefilterPipeline"),N=U("fs_blur_h","BloomBlurHPipeline"),P=U("fs_blur_v","BloomBlurVPipeline"),y=r.createRenderPipeline({label:"BloomCompositePipeline",layout:M,vertex:{module:G,entryPoint:"vs_main"},fragment:{module:G,entryPoint:"fs_main",targets:[{format:$}]},primitive:{topology:"triangle-list"}});function C(k){return r.createBindGroup({layout:v,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:k},{binding:2,resource:x}]})}const g=C(t),T=C(f),b=C(h),E=r.createBindGroup({layout:w,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:t},{binding:2,resource:f},{binding:3,resource:x}]});return new er(p,_,s,f,u,h,A,N,P,y,m,g,T,b,E)}updateParams(e,t=1,r=.5,o=.3){e.queue.writeBuffer(this._uniformBuffer,0,new Float32Array([t,r,o,0]).buffer)}execute(e,t){const r=(o,i,a,l)=>{const s=e.beginRenderPass({label:o,colorAttachments:[{view:i,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});s.setPipeline(a),s.setBindGroup(0,l),s.draw(3),s.end()};r("BloomPrefilter",this._half1View,this._prefilterPipeline,this._prefilterBG);for(let o=0;o<2;o++)r("BloomBlurH",this._half2View,this._blurHPipeline,this._blurHBG),r("BloomBlurV",this._half1View,this._blurVPipeline,this._blurVBG);r("BloomComposite",this.resultView,this._compositePipeline,this._compositeBG)}destroy(){this._result.destroy(),this._half1.destroy(),this._half2.destroy(),this._uniformBuffer.destroy()}}const wi=`// godray_march.wgsl — Half-resolution ray-march pass for volumetric godrays.\r
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
`,Bi=`// godray_composite.wgsl — Blur and composite passes for volumetric godrays.\r
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
`,Xe=$,ot=16;class tr extends pe{constructor(e,t,r,o,i,a,l,s,u,p,f,h,_,m,x,v,w){super();c(this,"name","GodrayPass");c(this,"scattering",.3);c(this,"fogCurve",2);c(this,"maxSteps",16);c(this,"_fogA");c(this,"_fogB");c(this,"_fogAView");c(this,"_fogBView");c(this,"_hdrView");c(this,"_marchPipeline");c(this,"_blurHPipeline");c(this,"_blurVPipeline");c(this,"_compositePipeline");c(this,"_marchBG");c(this,"_blurHBG");c(this,"_blurVBG");c(this,"_compositeBG");c(this,"_marchParamsBuf");c(this,"_blurHParamsBuf");c(this,"_blurVParamsBuf");c(this,"_compParamsBuf");this._fogA=e,this._fogAView=t,this._fogB=r,this._fogBView=o,this._hdrView=i,this._marchPipeline=a,this._blurHPipeline=l,this._blurVPipeline=s,this._compositePipeline=u,this._marchBG=p,this._blurHBG=f,this._blurVBG=h,this._compositeBG=_,this._marchParamsBuf=m,this._blurHParamsBuf=x,this._blurVParamsBuf=v,this._compParamsBuf=w}static create(e,t,r,o,i,a){const{device:l,width:s,height:u}=e,p=Math.max(1,s>>1),f=Math.max(1,u>>1),h=l.createTexture({label:"GodrayFogA",size:{width:p,height:f},format:Xe,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),_=l.createTexture({label:"GodrayFogB",size:{width:p,height:f},format:Xe,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),m=h.createView(),x=_.createView(),v=l.createSampler({label:"GodraySampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),w=l.createSampler({label:"GodrayCmpSampler",compare:"less-equal",magFilter:"linear",minFilter:"linear"}),B=l.createBuffer({label:"GodrayMarchParams",size:ot,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});l.queue.writeBuffer(B,0,new Float32Array([.3,16,0,0]).buffer);const G=l.createBuffer({label:"GodrayBlurHParams",size:ot,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});l.queue.writeBuffer(G,0,new Float32Array([1,0,0,0]).buffer);const S=l.createBuffer({label:"GodrayBlurVParams",size:ot,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});l.queue.writeBuffer(S,0,new Float32Array([0,1,0,0]).buffer);const M=l.createBuffer({label:"GodrayCompositeParams",size:ot,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});l.queue.writeBuffer(M,0,new Float32Array([0,0,2,0]).buffer);const U=l.createShaderModule({label:"GodrayMarchShader",code:wi}),A=l.createRenderPipeline({label:"GodrayMarchPipeline",layout:"auto",vertex:{module:U,entryPoint:"vs_main"},fragment:{module:U,entryPoint:"fs_march",targets:[{format:Xe}]},primitive:{topology:"triangle-list"}}),N=l.createBindGroup({label:"GodrayMarchBG",layout:A.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:a}},{binding:2,resource:t.depthView},{binding:3,resource:r.shadowMapView},{binding:4,resource:w},{binding:5,resource:{buffer:B}}]}),P=l.createShaderModule({label:"GodrayCompositeShader",code:Bi}),y=l.createRenderPipeline({label:"GodrayBlurHPipeline",layout:"auto",vertex:{module:P,entryPoint:"vs_main"},fragment:{module:P,entryPoint:"fs_blur",targets:[{format:Xe}]},primitive:{topology:"triangle-list"}}),C=l.createRenderPipeline({label:"GodrayBlurVPipeline",layout:"auto",vertex:{module:P,entryPoint:"vs_main"},fragment:{module:P,entryPoint:"fs_blur",targets:[{format:Xe}]},primitive:{topology:"triangle-list"}}),g=l.createRenderPipeline({label:"GodrayCompositePipeline",layout:"auto",vertex:{module:P,entryPoint:"vs_main"},fragment:{module:P,entryPoint:"fs_composite",targets:[{format:$,blend:{color:{operation:"add",srcFactor:"one",dstFactor:"one"},alpha:{operation:"add",srcFactor:"one",dstFactor:"one"}}}]},primitive:{topology:"triangle-list"}}),T=l.createBindGroup({label:"GodrayBlurHBG",layout:y.getBindGroupLayout(0),entries:[{binding:0,resource:m},{binding:1,resource:t.depthView},{binding:2,resource:v},{binding:3,resource:{buffer:G}}]}),b=l.createBindGroup({label:"GodrayBlurVBG",layout:C.getBindGroupLayout(0),entries:[{binding:0,resource:x},{binding:1,resource:t.depthView},{binding:2,resource:v},{binding:3,resource:{buffer:S}}]}),E=l.createBindGroup({label:"GodrayCompositeBG",layout:g.getBindGroupLayout(0),entries:[{binding:0,resource:m},{binding:1,resource:t.depthView},{binding:2,resource:v},{binding:3,resource:{buffer:M}},{binding:4,resource:{buffer:a}}]});return new tr(h,m,_,x,o,A,y,C,g,N,T,b,E,B,G,S,M)}updateParams(e){e.queue.writeBuffer(this._marchParamsBuf,0,new Float32Array([this.scattering,this.maxSteps,0,0]).buffer),e.queue.writeBuffer(this._compParamsBuf,0,new Float32Array([0,0,this.fogCurve,0]).buffer)}execute(e,t){const r=(o,i,a,l,s=!0)=>{const u=e.beginRenderPass({label:o,colorAttachments:[{view:i,clearValue:[0,0,0,0],loadOp:s?"clear":"load",storeOp:"store"}]});u.setPipeline(a),u.setBindGroup(0,l),u.draw(3),u.end()};r("GodrayMarch",this._fogAView,this._marchPipeline,this._marchBG),r("GodrayBlurH",this._fogBView,this._blurHPipeline,this._blurHBG),r("GodrayBlurV",this._fogAView,this._blurVPipeline,this._blurVBG),r("GodrayComposite",this._hdrView,this._compositePipeline,this._compositeBG,!1)}destroy(){this._fogA.destroy(),this._fogB.destroy(),this._marchParamsBuf.destroy(),this._blurHParamsBuf.destroy(),this._blurVParamsBuf.destroy(),this._compParamsBuf.destroy()}}const Si=`// composite.wgsl — Fog + Underwater + Tonemap merged into a single full-screen draw.\r
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
`,Yr=64,Xr=96;class rr extends pe{constructor(e,t,r,o,i,a){super();c(this,"name","CompositePass");c(this,"depthFogEnabled",!0);c(this,"depthDensity",1);c(this,"depthBegin",32);c(this,"depthEnd",128);c(this,"depthCurve",1.5);c(this,"heightFogEnabled",!1);c(this,"heightDensity",.7);c(this,"heightMin",48);c(this,"heightMax",80);c(this,"heightCurve",1);c(this,"fogColor",[1,1,1]);c(this,"_pipeline");c(this,"_bg0");c(this,"_bg1");c(this,"_bg2");c(this,"_paramsBuf");c(this,"_starBuf");this._pipeline=e,this._bg0=t,this._bg1=r,this._bg2=o,this._paramsBuf=i,this._starBuf=a}static create(e,t,r,o,i,a,l){const{device:s,format:u}=e,p=s.createBindGroupLayout({label:"CompositeBGL0",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),f=s.createBindGroupLayout({label:"CompositeBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),h=s.createBindGroupLayout({label:"CompositeBGL2",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),_=s.createSampler({label:"CompositeSampler",magFilter:"linear",minFilter:"linear"}),m=s.createBuffer({label:"CompositeParams",size:Yr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),x=s.createBuffer({label:"CompositeStars",size:Xr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),v=s.createBindGroup({label:"CompositeBG0",layout:p,entries:[{binding:0,resource:t},{binding:1,resource:r},{binding:2,resource:o},{binding:3,resource:_}]}),w=s.createBindGroup({label:"CompositeBG1",layout:f,entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:a}}]}),B=s.createBindGroup({label:"CompositeBG2",layout:h,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:x}},{binding:2,resource:{buffer:l}}]}),G=s.createShaderModule({label:"CompositeShader",code:Si}),S=s.createPipelineLayout({bindGroupLayouts:[p,f,h]}),M=s.createRenderPipeline({label:"CompositePipeline",layout:S,vertex:{module:G,entryPoint:"vs_main"},fragment:{module:G,entryPoint:"fs_main",targets:[{format:u}]},primitive:{topology:"triangle-list"}});return new rr(M,v,w,B,m,x)}updateParams(e,t,r,o,i,a){const l=new ArrayBuffer(Yr),s=new Float32Array(l),u=new Uint32Array(l);let p=0;this.depthFogEnabled&&(p|=1),this.heightFogEnabled&&(p|=2);let f=0;o&&(f|=1),i&&(f|=2),a&&(f|=4),s[0]=this.fogColor[0],s[1]=this.fogColor[1],s[2]=this.fogColor[2],s[3]=this.depthDensity,s[4]=this.depthBegin,s[5]=this.depthEnd,s[6]=this.depthCurve,s[7]=this.heightDensity,s[8]=this.heightMin,s[9]=this.heightMax,s[10]=this.heightCurve,u[11]=p,s[12]=r,s[13]=t?1:0,u[14]=f,s[15]=0,e.queue.writeBuffer(this._paramsBuf,0,l)}updateStars(e,t,r,o){const i=new Float32Array(Xr/4);i.set(t.data,0),i[16]=r.x,i[17]=r.y,i[18]=r.z,i[19]=0,i[20]=o.x,i[21]=o.y,i[22]=o.z,i[23]=0,e.queue.writeBuffer(this._starBuf,0,i.buffer)}execute(e,t){const r=e.beginRenderPass({label:"CompositePass",colorAttachments:[{view:t.getCurrentTexture().createView(),clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._pipeline),r.setBindGroup(0,this._bg0),r.setBindGroup(1,this._bg1),r.setBindGroup(2,this._bg2),r.draw(3),r.end()}destroy(){this._paramsBuf.destroy(),this._starBuf.destroy()}}const Pi=`// GBuffer fill pass — writes albedo+roughness and normal+metallic.\r
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
`,Kr=64*4+16+16,Gi=128,Ti=48;class nr extends pe{constructor(e,t,r,o,i,a,l,s,u,p,f,h,_,m,x){super();c(this,"name","GeometryPass");c(this,"_gbuffer");c(this,"_pipeline");c(this,"_modelBGL");c(this,"_materialBGL");c(this,"_textureBGL");c(this,"_cameraBuffer");c(this,"_cameraBindGroup");c(this,"_modelBuffers",[]);c(this,"_modelBindGroups",[]);c(this,"_materialBuffers",[]);c(this,"_materialBindGroups",[]);c(this,"_whiteTex");c(this,"_flatNormalTex");c(this,"_merDefaultTex");c(this,"_whiteView");c(this,"_flatNormalView");c(this,"_merDefaultView");c(this,"_materialSampler");c(this,"_textureBGs",new WeakMap);c(this,"_drawItems",[]);c(this,"_modelData",new Float32Array(32));c(this,"_matData",new Float32Array(12));this._gbuffer=e,this._pipeline=t,this._modelBGL=o,this._materialBGL=i,this._textureBGL=a,this._cameraBuffer=l,this._cameraBindGroup=s,this._whiteTex=u,this._whiteView=p,this._flatNormalTex=f,this._flatNormalView=h,this._merDefaultTex=_,this._merDefaultView=m,this._materialSampler=x}static create(e,t){const{device:r}=e,o=r.createBindGroupLayout({label:"GeomCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),i=r.createBindGroupLayout({label:"GeomModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),a=r.createBindGroupLayout({label:"GeomMaterialBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),l=r.createBindGroupLayout({label:"GeomTextureBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]});function s(S,M,U,A,N){const P=r.createTexture({label:S,size:{width:1,height:1},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return r.queue.writeTexture({texture:P},new Uint8Array([M,U,A,N]),{bytesPerRow:4},{width:1,height:1}),[P,P.createView()]}const[u,p]=s("GeomWhite",255,255,255,255),[f,h]=s("GeomFlatNormal",128,128,255,255),[_,m]=s("GeomMerDefault",255,0,255,255),x=r.createSampler({label:"GeomMaterialSampler",magFilter:"nearest",minFilter:"nearest",addressModeU:"repeat",addressModeV:"repeat"}),v=r.createBuffer({label:"GeomCameraBuffer",size:Kr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),w=r.createBindGroup({label:"GeomCameraBindGroup",layout:o,entries:[{binding:0,resource:{buffer:v}}]}),B=r.createShaderModule({label:"GeometryShader",code:Pi}),G=r.createRenderPipeline({label:"GeometryPipeline",layout:r.createPipelineLayout({bindGroupLayouts:[o,i,a,l]}),vertex:{module:B,entryPoint:"vs_main",buffers:[{arrayStride:qt,attributes:jt}]},fragment:{module:B,entryPoint:"fs_main",targets:[{format:"rgba8unorm"},{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}});return new nr(t,G,o,i,a,l,v,w,u,p,f,h,_,m,x)}setDrawItems(e){this._drawItems=e}updateCamera(e,t,r,o,i,a,l,s){const u=new Float32Array(Kr/4);u.set(t.data,0),u.set(r.data,16),u.set(o.data,32),u.set(i.data,48),u[64]=a.x,u[65]=a.y,u[66]=a.z,u[67]=l,u[68]=s,e.queue.writeBuffer(this._cameraBuffer,0,u.buffer)}execute(e,t){var i,a,l,s,u,p;const{device:r}=t;this._ensurePerDrawBuffers(r,this._drawItems.length);for(let f=0;f<this._drawItems.length;f++){const h=this._drawItems[f],_=this._modelData;_.set(h.modelMatrix.data,0),_.set(h.normalMatrix.data,16),t.queue.writeBuffer(this._modelBuffers[f],0,_.buffer);const m=this._matData;m.set(h.material.albedo,0),m[4]=h.material.roughness,m[5]=h.material.metallic,m[6]=((i=h.material.uvOffset)==null?void 0:i[0])??0,m[7]=((a=h.material.uvOffset)==null?void 0:a[1])??0,m[8]=((l=h.material.uvScale)==null?void 0:l[0])??1,m[9]=((s=h.material.uvScale)==null?void 0:s[1])??1,m[10]=((u=h.material.uvTile)==null?void 0:u[0])??1,m[11]=((p=h.material.uvTile)==null?void 0:p[1])??1,t.queue.writeBuffer(this._materialBuffers[f],0,m.buffer)}const o=e.beginRenderPass({label:"GeometryPass",colorAttachments:[{view:this._gbuffer.albedoRoughnessView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"},{view:this._gbuffer.normalMetallicView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});o.setPipeline(this._pipeline),o.setBindGroup(0,this._cameraBindGroup);for(let f=0;f<this._drawItems.length;f++){const h=this._drawItems[f];o.setBindGroup(1,this._modelBindGroups[f]),o.setBindGroup(2,this._materialBindGroups[f]),o.setBindGroup(3,this._getOrCreateTextureBG(r,h.material)),o.setVertexBuffer(0,h.mesh.vertexBuffer),o.setIndexBuffer(h.mesh.indexBuffer,"uint32"),o.drawIndexed(h.mesh.indexCount)}o.end()}_getOrCreateTextureBG(e,t){var o,i,a;let r=this._textureBGs.get(t);return r||(r=e.createBindGroup({label:"GeomTextureBG",layout:this._textureBGL,entries:[{binding:0,resource:((o=t.albedoMap)==null?void 0:o.view)??this._whiteView},{binding:1,resource:((i=t.normalMap)==null?void 0:i.view)??this._flatNormalView},{binding:2,resource:((a=t.merMap)==null?void 0:a.view)??this._merDefaultView},{binding:3,resource:this._materialSampler}]}),this._textureBGs.set(t,r)),r}_ensurePerDrawBuffers(e,t){for(;this._modelBuffers.length<t;){const r=e.createBuffer({size:Gi,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._modelBuffers.push(r),this._modelBindGroups.push(e.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:r}}]}));const o=e.createBuffer({size:Ti,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._materialBuffers.push(o),this._materialBindGroups.push(e.createBindGroup({layout:this._materialBGL,entries:[{binding:0,resource:{buffer:o}}]}))}}destroy(){this._cameraBuffer.destroy();for(const e of this._modelBuffers)e.destroy();for(const e of this._materialBuffers)e.destroy();this._whiteTex.destroy(),this._flatNormalTex.destroy(),this._merDefaultTex.destroy()}}const Ai=`// GBuffer fill pass for voxel chunk geometry.\r
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
  offset: vec3<f32>,\r
  _pad  : f32,\r
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
`,$r=64*4+16+16,Ui=16,Ke=256,Ei=2048,Mi=5,Ie=Mi*4,Rt=16;class ir extends pe{constructor(e,t,r,o,i,a,l,s,u,p){super();c(this,"name","WorldGeometryPass");c(this,"_gbuffer");c(this,"_device");c(this,"_opaquePipeline");c(this,"_transparentPipeline");c(this,"_propPipeline");c(this,"_cameraBuffer");c(this,"_cameraBindGroup");c(this,"_sharedBindGroup");c(this,"_chunkUniformBuffer");c(this,"_chunkBindGroup");c(this,"_slotFreeList",[]);c(this,"_slotHighWater",0);c(this,"_chunks",new Map);c(this,"_frustumPlanes",new Float32Array(24));c(this,"drawCalls",0);c(this,"triangles",0);c(this,"_cameraData",new Float32Array($r/4));this._device=e,this._gbuffer=t,this._opaquePipeline=r,this._transparentPipeline=o,this._propPipeline=i,this._cameraBuffer=a,this._cameraBindGroup=l,this._sharedBindGroup=s,this._chunkUniformBuffer=u,this._chunkBindGroup=p}static create(e,t,r){const{device:o}=e,i=o.createBindGroupLayout({label:"ChunkCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),a=o.createBindGroupLayout({label:"ChunkSharedBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),l=o.createBindGroupLayout({label:"ChunkOffsetBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform",hasDynamicOffset:!0,minBindingSize:16}}]}),s=R.MAX,u=o.createBuffer({label:"BlockDataBuffer",size:Math.max(s*Ui,16),usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),p=Bn,f=new Uint32Array(s*4);for(let P=0;P<s;P++){const y=wt[P];y&&(f[P*4+0]=y.sideFace.y*p+y.sideFace.x,f[P*4+1]=y.bottomFace.y*p+y.bottomFace.x,f[P*4+2]=y.topFace.y*p+y.topFace.x)}o.queue.writeBuffer(u,0,f);const h=o.createSampler({label:"ChunkAtlasSampler",magFilter:"nearest",minFilter:"nearest",addressModeU:"repeat",addressModeV:"repeat"}),_=o.createBindGroup({label:"ChunkSharedBG",layout:a,entries:[{binding:0,resource:r.colorAtlas.view},{binding:1,resource:r.normalAtlas.view},{binding:2,resource:r.merAtlas.view},{binding:3,resource:h},{binding:4,resource:{buffer:u}}]}),m=o.createBuffer({label:"ChunkCameraBuffer",size:$r,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),x=o.createBindGroup({label:"ChunkCameraBG",layout:i,entries:[{binding:0,resource:{buffer:m}}]}),v=o.createShaderModule({label:"ChunkGeometryShader",code:Ai}),w=o.createPipelineLayout({bindGroupLayouts:[i,a,l]}),B={arrayStride:Ie,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32"},{shaderLocation:2,offset:16,format:"float32"}]},G=[{format:"rgba8unorm"},{format:"rgba16float"}],S=o.createRenderPipeline({label:"ChunkOpaquePipeline",layout:w,vertex:{module:v,entryPoint:"vs_main",buffers:[B]},fragment:{module:v,entryPoint:"fs_opaque",targets:G},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),M=o.createRenderPipeline({label:"ChunkTransparentPipeline",layout:w,vertex:{module:v,entryPoint:"vs_main",buffers:[B]},fragment:{module:v,entryPoint:"fs_transparent",targets:G},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),U=o.createRenderPipeline({label:"ChunkPropPipeline",layout:w,vertex:{module:v,entryPoint:"vs_prop",buffers:[B]},fragment:{module:v,entryPoint:"fs_prop",targets:G},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}}),A=o.createBuffer({label:"ChunkUniformBuffer",size:Ei*Ke,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),N=o.createBindGroup({label:"ChunkOffsetBG",layout:l,entries:[{binding:0,resource:{buffer:A,size:16}}]});return new ir(o,t,S,M,U,m,x,_,A,N)}updateGBuffer(e){this._gbuffer=e}addChunk(e,t){const r=this._chunks.get(e);r?this._replaceMeshBuffers(r,t):this._chunks.set(e,this._createChunkGpu(e,t))}updateChunk(e,t){const r=this._chunks.get(e);r?this._replaceMeshBuffers(r,t):this._chunks.set(e,this._createChunkGpu(e,t))}removeChunk(e){var r,o,i;const t=this._chunks.get(e);t&&((r=t.opaqueBuffer)==null||r.destroy(),(o=t.transparentBuffer)==null||o.destroy(),(i=t.propBuffer)==null||i.destroy(),this._freeSlot(t.slot),this._chunks.delete(e))}updateCamera(e,t,r,o,i,a,l,s){const u=this._cameraData;u.set(t.data,0),u.set(r.data,16),u.set(o.data,32),u.set(i.data,48),u[64]=a.x,u[65]=a.y,u[66]=a.z,u[67]=l,u[68]=s,e.queue.writeBuffer(this._cameraBuffer,0,u.buffer),this._extractFrustumPlanes(o.data)}_extractFrustumPlanes(e){const t=this._frustumPlanes;t[0]=e[3]+e[0],t[1]=e[7]+e[4],t[2]=e[11]+e[8],t[3]=e[15]+e[12],t[4]=e[3]-e[0],t[5]=e[7]-e[4],t[6]=e[11]-e[8],t[7]=e[15]-e[12],t[8]=e[3]+e[1],t[9]=e[7]+e[5],t[10]=e[11]+e[9],t[11]=e[15]+e[13],t[12]=e[3]-e[1],t[13]=e[7]-e[5],t[14]=e[11]-e[9],t[15]=e[15]-e[13],t[16]=e[2],t[17]=e[6],t[18]=e[10],t[19]=e[14],t[20]=e[3]-e[2],t[21]=e[7]-e[6],t[22]=e[11]-e[10],t[23]=e[15]-e[14]}_isVisible(e,t,r){const o=this._frustumPlanes,i=e+Rt,a=t+Rt,l=r+Rt;for(let s=0;s<6;s++){const u=o[s*4],p=o[s*4+1],f=o[s*4+2],h=o[s*4+3];if(u*(u>=0?i:e)+p*(p>=0?a:t)+f*(f>=0?l:r)+h<0)return!1}return!0}execute(e,t){const r=e.beginRenderPass({label:"WorldGeometryPass",colorAttachments:[{view:this._gbuffer.albedoRoughnessView,loadOp:"load",storeOp:"store"},{view:this._gbuffer.normalMetallicView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthLoadOp:"load",depthStoreOp:"store"}});r.setBindGroup(0,this._cameraBindGroup),r.setBindGroup(1,this._sharedBindGroup);let o=0,i=0;const a=[];for(const l of this._chunks.values())this._isVisible(l.ox,l.oy,l.oz)&&a.push(l);r.setPipeline(this._opaquePipeline);for(const l of a)l.opaqueBuffer&&l.opaqueCount>0&&(r.setBindGroup(2,this._chunkBindGroup,[l.slot*Ke]),r.setVertexBuffer(0,l.opaqueBuffer),r.draw(l.opaqueCount),o++,i+=l.opaqueCount/3);r.setPipeline(this._transparentPipeline);for(const l of a)l.transparentBuffer&&l.transparentCount>0&&(r.setBindGroup(2,this._chunkBindGroup,[l.slot*Ke]),r.setVertexBuffer(0,l.transparentBuffer),r.draw(l.transparentCount),o++,i+=l.transparentCount/3);r.setPipeline(this._propPipeline);for(const l of a)l.propBuffer&&l.propCount>0&&(r.setBindGroup(2,this._chunkBindGroup,[l.slot*Ke]),r.setVertexBuffer(0,l.propBuffer),r.draw(l.propCount),o++,i+=l.propCount/3);this.drawCalls=o,this.triangles=i,r.end()}destroy(){var e,t,r;this._cameraBuffer.destroy(),this._chunkUniformBuffer.destroy();for(const o of this._chunks.values())(e=o.opaqueBuffer)==null||e.destroy(),(t=o.transparentBuffer)==null||t.destroy(),(r=o.propBuffer)==null||r.destroy();this._chunks.clear()}_allocSlot(){return this._slotFreeList.length>0?this._slotFreeList.pop():this._slotHighWater++}_freeSlot(e){this._slotFreeList.push(e)}_createChunkGpu(e,t){const r=this._allocSlot(),o=new Float32Array([e.globalPosition.x,e.globalPosition.y,e.globalPosition.z,0]);this._device.queue.writeBuffer(this._chunkUniformBuffer,r*Ke,o);const i={ox:e.globalPosition.x,oy:e.globalPosition.y,oz:e.globalPosition.z,slot:r,opaqueBuffer:null,opaqueCount:0,transparentBuffer:null,transparentCount:0,propBuffer:null,propCount:0};return this._replaceMeshBuffers(i,t),i}_replaceMeshBuffers(e,t){var r,o,i;if((r=e.opaqueBuffer)==null||r.destroy(),(o=e.transparentBuffer)==null||o.destroy(),(i=e.propBuffer)==null||i.destroy(),e.opaqueBuffer=null,e.transparentBuffer=null,e.propBuffer=null,e.opaqueCount=t.opaqueCount,e.transparentCount=t.transparentCount,e.propCount=t.propCount,t.opaqueCount>0){const a=this._device.createBuffer({label:"ChunkOpaqueBuf",size:t.opaqueCount*Ie,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.opaque.buffer,0,t.opaqueCount*Ie),e.opaqueBuffer=a}if(t.transparentCount>0){const a=this._device.createBuffer({label:"ChunkTransparentBuf",size:t.transparentCount*Ie,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.transparent.buffer,0,t.transparentCount*Ie),e.transparentBuffer=a}if(t.propCount>0){const a=this._device.createBuffer({label:"ChunkPropBuf",size:t.propCount*Ie,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.prop.buffer,0,t.propCount*Ie),e.propBuffer=a}}}const Ci=`// Depth of Field: prefilter (CoC + 2x downsample) then fused disc-blur + composite.\r
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
`,Ri=32;class or extends pe{constructor(e,t,r,o,i,a,l,s,u,p){super();c(this,"name","DofPass");c(this,"resultView");c(this,"_result");c(this,"_half");c(this,"_halfView");c(this,"_prefilterPipeline");c(this,"_compositePipeline");c(this,"_uniformBuffer");c(this,"_prefilterBG");c(this,"_compBG0");c(this,"_compBG1");this._result=e,this.resultView=t,this._half=r,this._halfView=o,this._prefilterPipeline=i,this._compositePipeline=a,this._uniformBuffer=l,this._prefilterBG=s,this._compBG0=u,this._compBG1=p}static create(e,t,r){const{device:o,width:i,height:a}=e,l=Math.max(1,i>>1),s=Math.max(1,a>>1),u=o.createTexture({label:"DofHalf",size:{width:l,height:s},format:$,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),p=o.createTexture({label:"DofResult",size:{width:i,height:a},format:$,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),f=u.createView(),h=p.createView(),_=o.createBuffer({label:"DofUniforms",size:Ri,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});o.queue.writeBuffer(_,0,new Float32Array([30,60,6,.1,1e3,0,0,0]).buffer);const m=o.createSampler({label:"DofSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),x=o.createBindGroupLayout({label:"DofBGL0Prefilter",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),v=o.createBindGroupLayout({label:"DofBGL0Composite",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),w=o.createBindGroupLayout({label:"DofBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),B=o.createShaderModule({label:"DofShader",code:Ci}),G=o.createRenderPipeline({label:"DofPrefilterPipeline",layout:o.createPipelineLayout({bindGroupLayouts:[x]}),vertex:{module:B,entryPoint:"vs_main"},fragment:{module:B,entryPoint:"fs_prefilter",targets:[{format:$}]},primitive:{topology:"triangle-list"}}),S=o.createRenderPipeline({label:"DofCompositePipeline",layout:o.createPipelineLayout({bindGroupLayouts:[v,w]}),vertex:{module:B,entryPoint:"vs_main"},fragment:{module:B,entryPoint:"fs_composite",targets:[{format:$}]},primitive:{topology:"triangle-list"}}),M=o.createBindGroup({label:"DofPrefilterBG",layout:x,entries:[{binding:0,resource:{buffer:_}},{binding:1,resource:t},{binding:2,resource:r},{binding:3,resource:m}]}),U=o.createBindGroup({label:"DofCompBG0",layout:v,entries:[{binding:0,resource:{buffer:_}},{binding:1,resource:t},{binding:3,resource:m}]}),A=o.createBindGroup({label:"DofCompBG1",layout:w,entries:[{binding:0,resource:f}]});return new or(p,h,u,f,G,S,_,M,U,A)}updateParams(e,t=30,r=60,o=6,i=.1,a=1e3,l=1){e.device.queue.writeBuffer(this._uniformBuffer,0,new Float32Array([t,r,o,i,a,l,0,0]).buffer)}execute(e,t){{const r=e.beginRenderPass({label:"DofPrefilter",colorAttachments:[{view:this._halfView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._prefilterPipeline),r.setBindGroup(0,this._prefilterBG),r.draw(3),r.end()}{const r=e.beginRenderPass({label:"DofComposite",colorAttachments:[{view:this.resultView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._compositePipeline),r.setBindGroup(0,this._compBG0),r.setBindGroup(1,this._compBG1),r.draw(3),r.end()}}destroy(){this._result.destroy(),this._half.destroy(),this._uniformBuffer.destroy()}}const Li=`// SSAO: hemisphere sampling in view space.\r
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
`,Ni=`// SSAO blur: 4×4 box blur to smooth raw SSAO output.\r
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
`,at="r8unorm",Lt=16,ki=464;function Oi(){const d=new Float32Array(Lt*4);for(let n=0;n<Lt;n++){const e=Math.random(),t=Math.random()*Math.PI*2,r=Math.sqrt(1-e*e),o=.1+.9*(n/Lt)**2;d[n*4+0]=r*Math.cos(t)*o,d[n*4+1]=r*Math.sin(t)*o,d[n*4+2]=e*o,d[n*4+3]=0}return d}function Ii(){const d=new Uint8Array(64);for(let n=0;n<16;n++){const e=Math.random()*Math.PI*2;d[n*4+0]=Math.round((Math.cos(e)*.5+.5)*255),d[n*4+1]=Math.round((Math.sin(e)*.5+.5)*255),d[n*4+2]=128,d[n*4+3]=255}return d}class ar extends pe{constructor(e,t,r,o,i,a,l,s,u,p,f){super();c(this,"name","SSAOPass");c(this,"aoView");c(this,"_raw");c(this,"_blurred");c(this,"_rawView");c(this,"_ssaoPipeline");c(this,"_blurPipeline");c(this,"_uniformBuffer");c(this,"_noiseTex");c(this,"_ssaoBG0");c(this,"_ssaoBG1");c(this,"_blurBG");this._raw=e,this._rawView=t,this._blurred=r,this.aoView=o,this._ssaoPipeline=i,this._blurPipeline=a,this._uniformBuffer=l,this._noiseTex=s,this._ssaoBG0=u,this._ssaoBG1=p,this._blurBG=f}static create(e,t){const{device:r,width:o,height:i}=e,a=Math.max(1,o>>1),l=Math.max(1,i>>1),s=r.createTexture({label:"SsaoRaw",size:{width:a,height:l},format:at,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),u=r.createTexture({label:"SsaoBlurred",size:{width:a,height:l},format:at,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),p=s.createView(),f=u.createView(),h=r.createTexture({label:"SsaoNoise",size:{width:4,height:4},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});r.queue.writeTexture({texture:h},Ii().buffer,{bytesPerRow:4*4,rowsPerImage:4},{width:4,height:4});const _=h.createView(),m=r.createBuffer({label:"SsaoUniforms",size:ki,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(m,208,Oi().buffer),r.queue.writeBuffer(m,192,new Float32Array([1,.005,2,0]).buffer);const x=r.createSampler({label:"SsaoBlurSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),v=r.createBindGroupLayout({label:"SsaoBGL0",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),w=r.createBindGroupLayout({label:"SsaoBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),B=r.createBindGroupLayout({label:"SsaoBlurBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),G=r.createShaderModule({label:"SsaoShader",code:Li}),S=r.createShaderModule({label:"SsaoBlurShader",code:Ni}),M=r.createRenderPipeline({label:"SsaoPipeline",layout:r.createPipelineLayout({bindGroupLayouts:[v,w]}),vertex:{module:G,entryPoint:"vs_main"},fragment:{module:G,entryPoint:"fs_ssao",targets:[{format:at}]},primitive:{topology:"triangle-list"}}),U=r.createRenderPipeline({label:"SsaoBlurPipeline",layout:r.createPipelineLayout({bindGroupLayouts:[B]}),vertex:{module:S,entryPoint:"vs_main"},fragment:{module:S,entryPoint:"fs_blur",targets:[{format:at}]},primitive:{topology:"triangle-list"}}),A=r.createBindGroup({label:"SsaoBG0",layout:v,entries:[{binding:0,resource:{buffer:m}}]}),N=r.createBindGroup({label:"SsaoBG1",layout:w,entries:[{binding:0,resource:t.normalMetallicView},{binding:1,resource:t.depthView},{binding:2,resource:_}]}),P=r.createBindGroup({label:"SsaoBlurBG",layout:B,entries:[{binding:0,resource:p},{binding:1,resource:x}]});return new ar(s,p,u,f,M,U,m,h,A,N,P)}updateCamera(e,t,r,o){const i=new Float32Array(48);i.set(t.data,0),i.set(r.data,16),i.set(o.data,32),e.device.queue.writeBuffer(this._uniformBuffer,0,i.buffer)}updateParams(e,t=1,r=.005,o=2){e.device.queue.writeBuffer(this._uniformBuffer,192,new Float32Array([t,r,o,0]).buffer)}execute(e,t){{const r=e.beginRenderPass({label:"SSAOPass",colorAttachments:[{view:this._rawView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._ssaoPipeline),r.setBindGroup(0,this._ssaoBG0),r.setBindGroup(1,this._ssaoBG1),r.draw(3),r.end()}{const r=e.beginRenderPass({label:"SSAOBlur",colorAttachments:[{view:this.aoView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._blurPipeline),r.setBindGroup(0,this._blurBG),r.draw(3),r.end()}}destroy(){this._raw.destroy(),this._blurred.destroy(),this._uniformBuffer.destroy(),this._noiseTex.destroy()}}const Vi=`// Screen-Space Global Illumination — ray march pass.\r
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
`,zi=`// Screen-Space Global Illumination — temporal accumulation pass.\r
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
`,Zr=368,Di={numRays:4,numSteps:16,radius:3,thickness:.5,strength:1};function Fi(){const d=new Uint8Array(new ArrayBuffer(64));for(let n=0;n<16;n++){const e=Math.random()*Math.PI*2;d[n*4+0]=Math.round((Math.cos(e)*.5+.5)*255),d[n*4+1]=Math.round((Math.sin(e)*.5+.5)*255),d[n*4+2]=128,d[n*4+3]=255}return d}class sr extends pe{constructor(e,t,r,o,i,a,l,s,u,p,f,h,_,m,x,v){super();c(this,"name","SSGIPass");c(this,"resultView");c(this,"_uniformBuffer");c(this,"_noiseTexture");c(this,"_rawTexture");c(this,"_rawView");c(this,"_historyTexture");c(this,"_resultTexture");c(this,"_ssgiPipeline");c(this,"_temporalPipeline");c(this,"_ssgiBG0");c(this,"_ssgiBG1");c(this,"_tempBG0");c(this,"_tempBG1");c(this,"_settings");c(this,"_frameIndex",0);c(this,"_width");c(this,"_height");this._uniformBuffer=e,this._noiseTexture=t,this._rawTexture=r,this._rawView=o,this._historyTexture=i,this._resultTexture=a,this.resultView=l,this._ssgiPipeline=s,this._temporalPipeline=u,this._ssgiBG0=p,this._ssgiBG1=f,this._tempBG0=h,this._tempBG1=_,this._settings=m,this._width=x,this._height=v}static create(e,t,r,o=Di){const{device:i,width:a,height:l}=e,s=i.createBuffer({label:"SSGIUniforms",size:Zr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),u=i.createTexture({label:"SSGINoise",size:{width:4,height:4},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});i.queue.writeTexture({texture:u},Fi(),{bytesPerRow:4*4,rowsPerImage:4},{width:4,height:4});const p=u.createView(),f=i.createTexture({label:"SSGIRaw",size:{width:a,height:l},format:$,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),h=f.createView(),_=i.createTexture({label:"SSGIHistory",size:{width:a,height:l},format:$,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),m=_.createView(),x=i.createTexture({label:"SSGIResult",size:{width:a,height:l},format:$,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),v=x.createView(),w=i.createSampler({label:"SSGILinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),B=i.createBindGroupLayout({label:"SSGIUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),G=i.createBindGroupLayout({label:"SSGITexBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),S=i.createBindGroupLayout({label:"SSGITempTexBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),M=i.createBindGroup({label:"SSGIUniformBG",layout:B,entries:[{binding:0,resource:{buffer:s}}]}),U=i.createBindGroup({label:"SSGITexBG",layout:G,entries:[{binding:0,resource:t.depthView},{binding:1,resource:t.normalMetallicView},{binding:2,resource:r},{binding:3,resource:p},{binding:4,resource:w}]}),A=i.createBindGroup({label:"SSGITempUniformBG",layout:B,entries:[{binding:0,resource:{buffer:s}}]}),N=i.createBindGroup({label:"SSGITempTexBG",layout:S,entries:[{binding:0,resource:h},{binding:1,resource:m},{binding:2,resource:t.depthView},{binding:3,resource:w}]}),P=i.createShaderModule({label:"SSGIShader",code:Vi}),y=i.createShaderModule({label:"SSGITempShader",code:zi}),C=i.createRenderPipeline({label:"SSGIPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[B,G]}),vertex:{module:P,entryPoint:"vs_main"},fragment:{module:P,entryPoint:"fs_ssgi",targets:[{format:$}]},primitive:{topology:"triangle-list"}}),g=i.createRenderPipeline({label:"SSGITempPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[B,S]}),vertex:{module:y,entryPoint:"vs_main"},fragment:{module:y,entryPoint:"fs_temporal",targets:[{format:$}]},primitive:{topology:"triangle-list"}});return new sr(s,u,f,h,_,x,v,C,g,M,U,A,N,o,a,l)}updateCamera(e,t,r,o,i,a,l){const s=new Float32Array(Zr/4);s.set(t.data,0),s.set(r.data,16),s.set(o.data,32),s.set(i.data,48),s.set(a.data,64),s[80]=l.x,s[81]=l.y,s[82]=l.z;const u=new Uint32Array(s.buffer);u[83]=this._settings.numRays,u[84]=this._settings.numSteps,s[85]=this._settings.radius,s[86]=this._settings.thickness,s[87]=this._settings.strength,u[88]=this._frameIndex++,e.queue.writeBuffer(this._uniformBuffer,0,s.buffer)}updateSettings(e){this._settings={...this._settings,...e}}execute(e,t){{const r=e.beginRenderPass({label:"SSGIRayMarch",colorAttachments:[{view:this._rawView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._ssgiPipeline),r.setBindGroup(0,this._ssgiBG0),r.setBindGroup(1,this._ssgiBG1),r.draw(3),r.end()}{const r=e.beginRenderPass({label:"SSGITemporal",colorAttachments:[{view:this.resultView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._temporalPipeline),r.setBindGroup(0,this._tempBG0),r.setBindGroup(1,this._tempBG1),r.draw(3),r.end()}e.copyTextureToTexture({texture:this._resultTexture},{texture:this._historyTexture},{width:this._width,height:this._height})}destroy(){this._uniformBuffer.destroy(),this._noiseTexture.destroy(),this._rawTexture.destroy(),this._historyTexture.destroy(),this._resultTexture.destroy()}}const Hi=`// VSM shadow map generation for point and spot lights.\r
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
`,st=32,lt=32,He=4,Oe=8,ct=256,ut=512,Te=256,Nt=80,Wi=64,qi=6*He,ji=qi+Oe;class lr extends pe{constructor(e,t,r,o,i,a,l,s,u,p,f,h,_,m){super();c(this,"name","PointSpotShadowPass");c(this,"pointVsmView");c(this,"spotVsmView");c(this,"projTexView");c(this,"_pointVsmTex");c(this,"_spotVsmTex");c(this,"_projTexArray");c(this,"_pointDepth");c(this,"_spotDepth");c(this,"_pointFaceViews");c(this,"_spotFaceViews");c(this,"_pointDepthView");c(this,"_spotDepthView");c(this,"_pointPipeline");c(this,"_spotPipeline");c(this,"_shadowBufs");c(this,"_shadowBGs");c(this,"_modelBufs",[]);c(this,"_modelBGs",[]);c(this,"_modelBGL");c(this,"_snapshot",[]);c(this,"_pointLights",[]);c(this,"_spotLights",[]);this._pointVsmTex=e,this._spotVsmTex=t,this._projTexArray=r,this._pointDepth=o,this._spotDepth=i,this._pointFaceViews=a,this._spotFaceViews=l,this._pointDepthView=s,this._spotDepthView=u,this._pointPipeline=p,this._spotPipeline=f,this._shadowBufs=h,this._shadowBGs=_,this._modelBGL=m,this.pointVsmView=e.createView({dimension:"cube-array",arrayLayerCount:He*6}),this.spotVsmView=t.createView({dimension:"2d-array"}),this.projTexView=r.createView({dimension:"2d-array"})}static create(e){const{device:t}=e,r=t.createTexture({label:"PointVSM",size:{width:ct,height:ct,depthOrArrayLayers:He*6},format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),o=t.createTexture({label:"SpotVSM",size:{width:ut,height:ut,depthOrArrayLayers:Oe},format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),i=t.createTexture({label:"ProjTexArray",size:{width:Te,height:Te,depthOrArrayLayers:Oe},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),a=new Uint8Array(Te*Te*4).fill(255);for(let U=0;U<Oe;U++)t.queue.writeTexture({texture:i,origin:{x:0,y:0,z:U}},a,{bytesPerRow:Te*4,rowsPerImage:Te},{width:Te,height:Te,depthOrArrayLayers:1});const l=t.createTexture({label:"PointShadowDepth",size:{width:ct,height:ct},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),s=t.createTexture({label:"SpotShadowDepth",size:{width:ut,height:ut},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),u=Array.from({length:He*6},(U,A)=>r.createView({dimension:"2d",baseArrayLayer:A,arrayLayerCount:1})),p=Array.from({length:Oe},(U,A)=>o.createView({dimension:"2d",baseArrayLayer:A,arrayLayerCount:1})),f=l.createView(),h=s.createView(),_=t.createBindGroupLayout({label:"PSShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),m=t.createBindGroupLayout({label:"PSModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),x=[],v=[];for(let U=0;U<ji;U++){const A=t.createBuffer({label:`PSShadowUniform ${U}`,size:Nt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});x.push(A),v.push(t.createBindGroup({label:`PSShadowBG ${U}`,layout:_,entries:[{binding:0,resource:{buffer:A}}]}))}const w=t.createPipelineLayout({bindGroupLayouts:[_,m]}),B=t.createShaderModule({label:"PointSpotShadowShader",code:Hi}),G={module:B,buffers:[{arrayStride:qt,attributes:[jt[0]]}]},S=t.createRenderPipeline({label:"PointShadowPipeline",layout:w,vertex:{...G,entryPoint:"vs_point"},fragment:{module:B,entryPoint:"fs_point",targets:[{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),M=t.createRenderPipeline({label:"SpotShadowPipeline",layout:w,vertex:{...G,entryPoint:"vs_spot"},fragment:{module:B,entryPoint:"fs_spot",targets:[{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}});return new lr(r,o,i,l,s,u,p,f,h,S,M,x,v,m)}update(e,t,r){this._pointLights=e,this._spotLights=t,this._snapshot=r}setProjectionTexture(e,t,r){e.copyTextureToTexture({texture:r},{texture:this._projTexArray,origin:{x:0,y:0,z:t}},{width:Te,height:Te,depthOrArrayLayers:1})}execute(e,t){const{device:r}=t,o=this._snapshot;this._ensureModelBuffers(r,o.length);for(let s=0;s<this._spotLights.length&&s<Oe;s++){const u=this._spotLights[s];u.projectionTexture&&this.setProjectionTexture(e,s,u.projectionTexture)}for(let s=0;s<o.length;s++)t.queue.writeBuffer(this._modelBufs[s],0,o[s].modelMatrix.data.buffer);let i=0,a=0;for(const s of this._pointLights){if(!s.castShadow||a>=He)continue;const u=s.worldPosition(),p=s.cubeFaceViewProjs(),f=new Float32Array(Nt/4);f[16]=u.x,f[17]=u.y,f[18]=u.z,f[19]=s.radius;for(let h=0;h<6;h++){f.set(p[h].data,0),t.queue.writeBuffer(this._shadowBufs[i],0,f.buffer);const _=a*6+h,m=e.beginRenderPass({label:`PointShadow light${a} face${h}`,colorAttachments:[{view:this._pointFaceViews[_],clearValue:{r:1,g:1,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._pointDepthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"discard"}});m.setPipeline(this._pointPipeline),m.setBindGroup(0,this._shadowBGs[i]),this._drawItems(m,o),m.end(),i++}a++}let l=0;for(const s of this._spotLights){if(!s.castShadow||l>=Oe)continue;const u=s.lightViewProj(),p=s.worldPosition(),f=new Float32Array(Nt/4);f.set(u.data,0),f[16]=p.x,f[17]=p.y,f[18]=p.z,f[19]=s.range,t.queue.writeBuffer(this._shadowBufs[i],0,f.buffer);const h=e.beginRenderPass({label:`SpotShadow light${l}`,colorAttachments:[{view:this._spotFaceViews[l],clearValue:{r:1,g:1,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._spotDepthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"discard"}});h.setPipeline(this._spotPipeline),h.setBindGroup(0,this._shadowBGs[i]),this._drawItems(h,o),h.end(),i++,l++}}_drawItems(e,t){for(let r=0;r<t.length;r++){const{mesh:o}=t[r];e.setBindGroup(1,this._modelBGs[r]),e.setVertexBuffer(0,o.vertexBuffer),e.setIndexBuffer(o.indexBuffer,"uint32"),e.drawIndexed(o.indexCount)}}_ensureModelBuffers(e,t){for(;this._modelBufs.length<t;){const r=e.createBuffer({label:`PSModelUniform ${this._modelBufs.length}`,size:Wi,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._modelBufs.push(r),this._modelBGs.push(e.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:r}}]}))}}destroy(){this._pointVsmTex.destroy(),this._spotVsmTex.destroy(),this._projTexArray.destroy(),this._pointDepth.destroy(),this._spotDepth.destroy();for(const e of this._shadowBufs)e.destroy();for(const e of this._modelBufs)e.destroy()}}const Yi=`// Water pass — forward-rendered on top of the deferred-lit HDR buffer.\r
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
`,Qr=64*4+16+16,Xi=16,Ki=16,$i=3,kt=$i*4,Ot=16;class ze extends pe{constructor(e,t,r,o,i,a,l,s,u,p,f,h,_,m,x){super();c(this,"name","WaterPass");c(this,"_device");c(this,"_hdrTexture");c(this,"_hdrView");c(this,"_refractionTex");c(this,"_pipeline");c(this,"_cameraBuffer");c(this,"_waterBuffer");c(this,"_cameraBG");c(this,"_waterBG");c(this,"_sceneBG");c(this,"_sceneBGL");c(this,"_chunkBGL");c(this,"_skyTexture");c(this,"_dudvTexture");c(this,"_gradientTexture");c(this,"_chunks",new Map);c(this,"_frustumPlanes",new Float32Array(24));this._device=e,this._hdrTexture=t,this._hdrView=r,this._refractionTex=o,this._pipeline=i,this._cameraBuffer=a,this._waterBuffer=l,this._cameraBG=s,this._waterBG=u,this._sceneBG=p,this._sceneBGL=f,this._chunkBGL=h,this._skyTexture=_,this._dudvTexture=m,this._gradientTexture=x}static create(e,t,r,o,i,a,l){const{device:s,width:u,height:p}=e,f=s.createBindGroupLayout({label:"WaterCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),h=s.createBindGroupLayout({label:"WaterUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),_=s.createBindGroupLayout({label:"WaterChunkBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),m=s.createBindGroupLayout({label:"WaterSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:5,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),{refractionTex:x,refractionView:v}=ze._makeRefractionTex(s,u,p),w=s.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"}),B=s.createBuffer({label:"WaterCameraBuffer",size:Qr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),G=s.createBuffer({label:"WaterUniformBuffer",size:Xi,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),S=s.createBindGroup({label:"WaterCameraBG",layout:f,entries:[{binding:0,resource:{buffer:B}}]}),M=s.createBindGroup({label:"WaterUniformBG",layout:h,entries:[{binding:0,resource:{buffer:G}}]}),U=ze._makeSceneBG(s,m,v,o,a,l,i,w),A=s.createShaderModule({label:"WaterShader",code:Yi}),N=s.createPipelineLayout({bindGroupLayouts:[f,h,_,m]}),P={arrayStride:kt,attributes:[{shaderLocation:0,offset:0,format:"float32x3"}]},y=s.createRenderPipeline({label:"WaterPipeline",layout:N,vertex:{module:A,entryPoint:"vs_main",buffers:[P]},fragment:{module:A,entryPoint:"fs_main",targets:[{format:$,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},primitive:{topology:"triangle-list",cullMode:"none"}});return new ze(s,t,r,x,y,B,G,S,M,U,m,_,i,a,l)}updateRenderTargets(e,t,r,o){this._refractionTex.destroy(),this._hdrTexture=e,this._hdrView=t,o&&(this._skyTexture=o);const{width:i,height:a}=e,{refractionTex:l,refractionView:s}=ze._makeRefractionTex(this._device,i,a);this._refractionTex=l;const u=this._device.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"});this._sceneBG=ze._makeSceneBG(this._device,this._sceneBGL,s,r,this._dudvTexture,this._gradientTexture,this._skyTexture,u)}updateCamera(e,t,r,o,i,a,l,s){const u=new Float32Array(Qr/4);u.set(t.data,0),u.set(r.data,16),u.set(o.data,32),u.set(i.data,48),u[64]=a.x,u[65]=a.y,u[66]=a.z,u[67]=l,u[68]=s,e.queue.writeBuffer(this._cameraBuffer,0,u.buffer),this._extractFrustumPlanes(o.data)}_extractFrustumPlanes(e){const t=this._frustumPlanes;t[0]=e[3]+e[0],t[1]=e[7]+e[4],t[2]=e[11]+e[8],t[3]=e[15]+e[12],t[4]=e[3]-e[0],t[5]=e[7]-e[4],t[6]=e[11]-e[8],t[7]=e[15]-e[12],t[8]=e[3]+e[1],t[9]=e[7]+e[5],t[10]=e[11]+e[9],t[11]=e[15]+e[13],t[12]=e[3]-e[1],t[13]=e[7]-e[5],t[14]=e[11]-e[9],t[15]=e[15]-e[13],t[16]=e[2],t[17]=e[6],t[18]=e[10],t[19]=e[14],t[20]=e[3]-e[2],t[21]=e[7]-e[6],t[22]=e[11]-e[10],t[23]=e[15]-e[14]}_isVisible(e,t,r){const o=this._frustumPlanes,i=e+Ot,a=t+Ot,l=r+Ot;for(let s=0;s<6;s++){const u=o[s*4],p=o[s*4+1],f=o[s*4+2],h=o[s*4+3];if(u*(u>=0?i:e)+p*(p>=0?a:t)+f*(f>=0?l:r)+h<0)return!1}return!0}updateTime(e,t,r=1){e.queue.writeBuffer(this._waterBuffer,0,new Float32Array([t,r,0,0]).buffer)}addChunk(e,t){const r=this._chunks.get(e);r?this._replaceMeshBuffer(r,t):this._chunks.set(e,this._createChunkGpu(e,t))}updateChunk(e,t){const r=this._chunks.get(e);r?this._replaceMeshBuffer(r,t):this._chunks.set(e,this._createChunkGpu(e,t))}removeChunk(e){var r;const t=this._chunks.get(e);t&&((r=t.buffer)==null||r.destroy(),t.uniformBuffer.destroy(),this._chunks.delete(e))}execute(e,t){const{width:r,height:o}=this._refractionTex;e.copyTextureToTexture({texture:this._hdrTexture},{texture:this._refractionTex},{width:r,height:o,depthOrArrayLayers:1});const i=e.beginRenderPass({label:"WaterPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}]});i.setPipeline(this._pipeline),i.setBindGroup(0,this._cameraBG),i.setBindGroup(1,this._waterBG),i.setBindGroup(3,this._sceneBG);for(const a of this._chunks.values())!a.buffer||a.vertexCount===0||this._isVisible(a.ox,a.oy,a.oz)&&(i.setBindGroup(2,a.chunkBG),i.setVertexBuffer(0,a.buffer),i.draw(a.vertexCount));i.end()}destroy(){var e;this._cameraBuffer.destroy(),this._waterBuffer.destroy(),this._refractionTex.destroy();for(const t of this._chunks.values())(e=t.buffer)==null||e.destroy(),t.uniformBuffer.destroy();this._chunks.clear()}static _makeRefractionTex(e,t,r){const o=e.createTexture({label:"WaterRefractionTex",size:{width:t,height:r},format:$,usage:GPUTextureUsage.COPY_DST|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT}),i=o.createView();return{refractionTex:o,refractionView:i}}static _makeSceneBG(e,t,r,o,i,a,l,s){return e.createBindGroup({label:"WaterSceneBG",layout:t,entries:[{binding:0,resource:r},{binding:1,resource:o},{binding:2,resource:i.view},{binding:3,resource:a.view},{binding:4,resource:l.view},{binding:5,resource:s}]})}_createChunkGpu(e,t){const r=this._device.createBuffer({label:`WaterChunkBuf(${e.globalPosition.x},${e.globalPosition.y},${e.globalPosition.z})`,size:Ki,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(r,0,new Float32Array([e.globalPosition.x,e.globalPosition.y,e.globalPosition.z,0]));const o=this._device.createBindGroup({label:"WaterChunkBG",layout:this._chunkBGL,entries:[{binding:0,resource:{buffer:r}}]}),i={ox:e.globalPosition.x,oy:e.globalPosition.y,oz:e.globalPosition.z,buffer:null,vertexCount:0,uniformBuffer:r,chunkBG:o};return this._replaceMeshBuffer(i,t),i}_replaceMeshBuffer(e,t){var r;if((r=e.buffer)==null||r.destroy(),e.buffer=null,e.vertexCount=t.waterCount,t.waterCount>0){const o=this._device.createBuffer({label:"WaterVertexBuf",size:t.waterCount*kt,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(o,0,t.water.buffer,0,t.waterCount*kt),e.buffer=o}}}const Zi=`// Shadow pass for transparent chunk geometry — samples color atlas alpha for discard.\r
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
`,Qi=`// Shadow pass for prop billboards (flowers, grass, torches, etc.).\r
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
`,Ji=4,Ue=5*4;class cr extends pe{constructor(e,t,r,o,i,a,l,s,u,p,f){super();c(this,"name","WorldShadowPass");c(this,"shadowChunkRadius",4);c(this,"_camX",0);c(this,"_camZ",0);c(this,"_device");c(this,"_shadowMapArrayViews");c(this,"_pipeline");c(this,"_transparentPipeline");c(this,"_propPipeline");c(this,"_cascadeBGs");c(this,"_cascadeBuffers");c(this,"_modelBGL");c(this,"_atlasBG");c(this,"_orientBG_X");c(this,"_orientBG_Z");c(this,"_chunks",new Map);c(this,"_cascades",[]);this._device=e,this._shadowMapArrayViews=t,this._pipeline=r,this._transparentPipeline=o,this._propPipeline=i,this._cascadeBGs=a,this._cascadeBuffers=l,this._modelBGL=s,this._atlasBG=u,this._orientBG_X=p,this._orientBG_Z=f}static create(e,t,r,o){const{device:i}=e,a=i.createBindGroupLayout({label:"WorldShadowCascadeBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),l=i.createBindGroupLayout({label:"WorldShadowModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),s=i.createBindGroupLayout({label:"WorldShadowAtlasBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),u=[],p=[];for(let b=0;b<Math.min(r,Ji);b++){const E=i.createBuffer({label:`WorldShadowCascadeBuf${b}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});u.push(E),p.push(i.createBindGroup({label:`WorldShadowCascadeBG${b}`,layout:a,entries:[{binding:0,resource:{buffer:E}}]}))}const f=R.MAX,h=i.createBuffer({label:"WorldShadowBlockDataBuf",size:Math.max(f*16,16),usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),_=Bn,m=new Uint32Array(f*4);for(let b=0;b<f;b++){const E=wt[b];E&&(m[b*4+0]=E.sideFace.y*_+E.sideFace.x,m[b*4+1]=E.bottomFace.y*_+E.bottomFace.x,m[b*4+2]=E.topFace.y*_+E.topFace.x)}i.queue.writeBuffer(h,0,m);const x=i.createSampler({label:"WorldShadowAtlasSampler",magFilter:"nearest",minFilter:"nearest"}),v=i.createBindGroup({label:"WorldShadowAtlasBG",layout:s,entries:[{binding:0,resource:o.colorAtlas.view},{binding:1,resource:x},{binding:2,resource:{buffer:h}}]}),w=i.createShaderModule({label:"WorldShadowShader",code:Sn}),B=i.createPipelineLayout({bindGroupLayouts:[a,l]}),G=i.createRenderPipeline({label:"WorldShadowPipeline",layout:B,vertex:{module:w,entryPoint:"vs_main",buffers:[{arrayStride:Ue,attributes:[{shaderLocation:0,offset:0,format:"float32x3"}]}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}}),S=i.createShaderModule({label:"WorldShadowTranspShader",code:Zi}),M=i.createPipelineLayout({bindGroupLayouts:[a,l,s]}),U=i.createRenderPipeline({label:"WorldShadowTransparentPipeline",layout:M,vertex:{module:S,entryPoint:"vs_main",buffers:[{arrayStride:Ue,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32"},{shaderLocation:2,offset:16,format:"float32"}]}]},fragment:{module:S,entryPoint:"fs_alpha_test",targets:[]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}}),A=i.createBindGroupLayout({label:"WorldShadowOrientBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),N=(b,E,k,z)=>{const D=i.createBuffer({label:b,size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return i.queue.writeBuffer(D,0,new Float32Array([E,k,z,0])),i.createBindGroup({label:b,layout:A,entries:[{binding:0,resource:{buffer:D}}]})},P=N("PropShadowOrientBG_X",1,0,0),y=N("PropShadowOrientBG_Z",0,0,1),C=i.createShaderModule({label:"WorldShadowPropShader",code:Qi}),g=i.createPipelineLayout({bindGroupLayouts:[a,l,s,A]}),T=i.createRenderPipeline({label:"WorldShadowPropPipeline",layout:g,vertex:{module:C,entryPoint:"vs_main",buffers:[{arrayStride:Ue,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32"},{shaderLocation:2,offset:16,format:"float32"}]}]},fragment:{module:C,entryPoint:"fs_alpha_test",targets:[]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}});return new cr(i,t,G,U,T,p,u,l,v,P,y)}update(e,t,r,o){this._cascades=t,this._camX=r,this._camZ=o;const i=Math.min(t.length,this._cascadeBuffers.length);for(let a=0;a<i;a++)e.queue.writeBuffer(this._cascadeBuffers[a],0,t[a].lightViewProj.data.buffer)}addChunk(e,t){const r=this._chunks.get(e);r?this._replaceMeshBuffer(r,t):this._chunks.set(e,this._createChunkGpu(e,t))}updateChunk(e,t){const r=this._chunks.get(e);r?this._replaceMeshBuffer(r,t):this._chunks.set(e,this._createChunkGpu(e,t))}removeChunk(e){var r,o,i;const t=this._chunks.get(e);t&&((r=t.opaqueBuffer)==null||r.destroy(),(o=t.transparentBuffer)==null||o.destroy(),(i=t.propBuffer)==null||i.destroy(),t.modelBuffer.destroy(),this._chunks.delete(e))}execute(e,t){const r=Math.min(this._cascades.length,this._cascadeBuffers.length);for(let o=0;o<r;o++){const i=e.beginRenderPass({label:`WorldShadowPass cascade ${o}`,colorAttachments:[],depthStencilAttachment:{view:this._shadowMapArrayViews[o],depthLoadOp:"load",depthStoreOp:"store"}});i.setBindGroup(0,this._cascadeBGs[o]);const a=this.shadowChunkRadius*16,l=a*a;i.setPipeline(this._pipeline);for(const s of this._chunks.values()){if(!s.opaqueBuffer||s.opaqueCount===0)continue;const u=s.ox-this._camX,p=s.oz-this._camZ;u*u+p*p>l||(i.setBindGroup(1,s.modelBG),i.setVertexBuffer(0,s.opaqueBuffer),i.draw(s.opaqueCount))}i.setPipeline(this._transparentPipeline),i.setBindGroup(2,this._atlasBG);for(const s of this._chunks.values()){if(!s.transparentBuffer||s.transparentCount===0)continue;const u=s.ox-this._camX,p=s.oz-this._camZ;u*u+p*p>l||(i.setBindGroup(1,s.modelBG),i.setVertexBuffer(0,s.transparentBuffer),i.draw(s.transparentCount))}i.setPipeline(this._propPipeline),i.setBindGroup(2,this._atlasBG);for(const s of[this._orientBG_X,this._orientBG_Z]){i.setBindGroup(3,s);for(const u of this._chunks.values()){if(!u.propBuffer||u.propCount===0)continue;const p=u.ox-this._camX,f=u.oz-this._camZ;p*p+f*f>l||(i.setBindGroup(1,u.modelBG),i.setVertexBuffer(0,u.propBuffer),i.draw(u.propCount))}}i.end()}}destroy(){var e,t,r;for(const o of this._cascadeBuffers)o.destroy();for(const o of this._chunks.values())(e=o.opaqueBuffer)==null||e.destroy(),(t=o.transparentBuffer)==null||t.destroy(),(r=o.propBuffer)==null||r.destroy(),o.modelBuffer.destroy();this._chunks.clear()}_createChunkGpu(e,t){const r=e.globalPosition,o=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,r.x,r.y,r.z,1]),i=this._device.createBuffer({label:"WorldShadowModelBuf",size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(i,0,o.buffer);const a=this._device.createBindGroup({label:"WorldShadowModelBG",layout:this._modelBGL,entries:[{binding:0,resource:{buffer:i}}]}),l={ox:r.x,oz:r.z,opaqueBuffer:null,opaqueCount:0,transparentBuffer:null,transparentCount:0,propBuffer:null,propCount:0,modelBuffer:i,modelBG:a};return this._replaceMeshBuffer(l,t),l}_replaceMeshBuffer(e,t){var r,o,i;if((r=e.opaqueBuffer)==null||r.destroy(),e.opaqueBuffer=null,e.opaqueCount=t.opaqueCount,t.opaqueCount>0){const a=this._device.createBuffer({label:"WorldShadowOpaqueBuf",size:t.opaqueCount*Ue,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.opaque.buffer,0,t.opaqueCount*Ue),e.opaqueBuffer=a}if((o=e.transparentBuffer)==null||o.destroy(),e.transparentBuffer=null,e.transparentCount=t.transparentCount,t.transparentCount>0){const a=this._device.createBuffer({label:"WorldShadowTransparentBuf",size:t.transparentCount*Ue,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.transparent.buffer,0,t.transparentCount*Ue),e.transparentBuffer=a}if((i=e.propBuffer)==null||i.destroy(),e.propBuffer=null,e.propCount=t.propCount,t.propCount>0){const a=this._device.createBuffer({label:"WorldShadowPropBuf",size:t.propCount*Ue,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.prop.buffer,0,t.propCount*Ue),e.propBuffer=a}}}const eo=`// Additive deferred pass for point and spot lights.\r
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
`,Jr=64*4+16+16,to=8,en=48,tn=128;class ur extends pe{constructor(e,t,r,o,i,a,l,s,u,p){super();c(this,"name","PointSpotLightPass");c(this,"_pipeline");c(this,"_cameraBG");c(this,"_gbufferBG");c(this,"_lightBG");c(this,"_shadowBG");c(this,"_cameraBuffer");c(this,"_lightCountsBuffer");c(this,"_pointBuffer");c(this,"_spotBuffer");c(this,"_hdrView");c(this,"_cameraData",new Float32Array(Jr/4));c(this,"_lightCountsArr",new Uint32Array(2));c(this,"_pointBuf",new ArrayBuffer(st*en));c(this,"_pointF32",new Float32Array(this._pointBuf));c(this,"_pointI32",new Int32Array(this._pointBuf));c(this,"_spotBuf",new ArrayBuffer(lt*tn));c(this,"_spotF32",new Float32Array(this._spotBuf));c(this,"_spotI32",new Int32Array(this._spotBuf));this._pipeline=e,this._cameraBG=t,this._gbufferBG=r,this._lightBG=o,this._shadowBG=i,this._cameraBuffer=a,this._lightCountsBuffer=l,this._pointBuffer=s,this._spotBuffer=u,this._hdrView=p}static create(e,t,r,o){const{device:i}=e,a=i.createBuffer({label:"PSLCameraBuffer",size:Jr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),l=i.createBuffer({label:"PSLLightCounts",size:to,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),s=i.createBuffer({label:"PSLPointBuffer",size:st*en,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),u=i.createBuffer({label:"PSLSpotBuffer",size:lt*tn,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),p=i.createSampler({label:"PSLLinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),f=i.createSampler({label:"PSLVsmSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge"}),h=i.createSampler({label:"PSLProjSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),_=i.createBindGroupLayout({label:"PSLCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),m=i.createBindGroupLayout({label:"PSLGBufferBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),x=i.createBindGroupLayout({label:"PSLLightBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),v=i.createBindGroupLayout({label:"PSLShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube-array"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d-array"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d-array"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),w=i.createBindGroup({label:"PSLCameraBG",layout:_,entries:[{binding:0,resource:{buffer:a}}]}),B=i.createBindGroup({label:"PSLGBufferBG",layout:m,entries:[{binding:0,resource:t.albedoRoughnessView},{binding:1,resource:t.normalMetallicView},{binding:2,resource:t.depthView},{binding:3,resource:p}]}),G=i.createBindGroup({label:"PSLLightBG",layout:x,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:s}},{binding:2,resource:{buffer:u}}]}),S=i.createBindGroup({label:"PSLShadowBG",layout:v,entries:[{binding:0,resource:r.pointVsmView},{binding:1,resource:r.spotVsmView},{binding:2,resource:r.projTexView},{binding:3,resource:f},{binding:4,resource:h}]}),M=i.createShaderModule({label:"PointSpotLightShader",code:eo}),U=i.createRenderPipeline({label:"PointSpotLightPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[_,m,x,v]}),vertex:{module:M,entryPoint:"vs_main"},fragment:{module:M,entryPoint:"fs_main",targets:[{format:$,blend:{color:{srcFactor:"one",dstFactor:"one",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one",operation:"add"}}}]},primitive:{topology:"triangle-list"}});return new ur(U,w,B,G,S,a,l,s,u,o)}updateCamera(e,t,r,o,i,a,l,s){const u=this._cameraData;u.set(t.data,0),u.set(r.data,16),u.set(o.data,32),u.set(i.data,48),u[64]=a.x,u[65]=a.y,u[66]=a.z,u[67]=l,u[68]=s,e.queue.writeBuffer(this._cameraBuffer,0,u.buffer)}updateLights(e,t,r){const o=this._lightCountsArr;o[0]=Math.min(t.length,st),o[1]=Math.min(r.length,lt),e.queue.writeBuffer(this._lightCountsBuffer,0,o.buffer);const i=this._pointF32,a=this._pointI32;let l=0;for(let f=0;f<Math.min(t.length,st);f++){const h=t[f],_=h.worldPosition(),m=f*12;i[m+0]=_.x,i[m+1]=_.y,i[m+2]=_.z,i[m+3]=h.radius,i[m+4]=h.color.x,i[m+5]=h.color.y,i[m+6]=h.color.z,i[m+7]=h.intensity,h.castShadow&&l<He?a[m+8]=l++:a[m+8]=-1,a[m+9]=0,a[m+10]=0,a[m+11]=0}e.queue.writeBuffer(this._pointBuffer,0,this._pointBuf);const s=this._spotF32,u=this._spotI32;let p=0;for(let f=0;f<Math.min(r.length,lt);f++){const h=r[f],_=h.worldPosition(),m=h.worldDirection(),x=h.lightViewProj(),v=f*32;s[v+0]=_.x,s[v+1]=_.y,s[v+2]=_.z,s[v+3]=h.range,s[v+4]=m.x,s[v+5]=m.y,s[v+6]=m.z,s[v+7]=Math.cos(h.innerAngle*Math.PI/180),s[v+8]=h.color.x,s[v+9]=h.color.y,s[v+10]=h.color.z,s[v+11]=Math.cos(h.outerAngle*Math.PI/180),s[v+12]=h.intensity,h.castShadow&&p<Oe?u[v+13]=p++:u[v+13]=-1,u[v+14]=h.projectionTexture!==null?f:-1,u[v+15]=0,s.set(x.data,v+16)}e.queue.writeBuffer(this._spotBuffer,0,this._spotBuf)}execute(e,t){const r=e.beginRenderPass({label:"PointSpotLightPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}]});r.setPipeline(this._pipeline),r.setBindGroup(0,this._cameraBG),r.setBindGroup(1,this._gbufferBG),r.setBindGroup(2,this._lightBG),r.setBindGroup(3,this._shadowBG),r.draw(3),r.end()}destroy(){this._cameraBuffer.destroy(),this._lightCountsBuffer.destroy(),this._pointBuffer.destroy(),this._spotBuffer.destroy()}}const Pn=`
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
`;function ro(d){switch(d.kind){case"sphere":{const n=Math.cos(d.solidAngle).toFixed(6),e=d.radius.toFixed(6);return`{
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
}`}}}function Gn(d){switch(d.type){case"gravity":return`p.velocity.y -= ${d.strength.toFixed(6)} * uniforms.dt;`;case"drag":return`p.velocity -= p.velocity * ${d.coefficient.toFixed(6)} * uniforms.dt;`;case"force":{const[n,e,t]=d.direction.map(r=>r.toFixed(6));return`p.velocity += vec3<f32>(${n}, ${e}, ${t}) * ${d.strength.toFixed(6)} * uniforms.dt;`}case"swirl_force":{const n=d.speed.toFixed(6),e=d.strength.toFixed(6);return`{
  let swirl_angle = uniforms.time * ${n};
  p.velocity += vec3<f32>(cos(swirl_angle), 0.0, sin(swirl_angle)) * ${e} * uniforms.dt;
}`}case"vortex":return`{
  let vx_radial = p.position.xz - uniforms.world_pos.xz;
  p.velocity += vec3<f32>(-vx_radial.y, 0.0, vx_radial.x) * ${d.strength.toFixed(6)} * uniforms.dt;
}`;case"curl_noise":{const n=d.octaves??1,e=n>1?`curl_noise_fbm(cn_pos, ${n})`:"curl_noise(cn_pos)";return`{
  let cn_pos = p.position * ${d.scale.toFixed(6)} + uniforms.time * ${d.timeScale.toFixed(6)};
  p.velocity += ${e} * ${d.strength.toFixed(6)} * uniforms.dt;
}`}case"size_random":return`p.size = rand_range(${d.min.toFixed(6)}, ${d.max.toFixed(6)}, pcg_hash(idx * 2654435761u));`;case"size_over_lifetime":return`p.size = mix(${d.start.toFixed(6)}, ${d.end.toFixed(6)}, t);`;case"color_over_lifetime":{const[n,e,t,r]=d.startColor.map(s=>s.toFixed(6)),[o,i,a,l]=d.endColor.map(s=>s.toFixed(6));return`p.color = mix(vec4<f32>(${n}, ${e}, ${t}, ${r}), vec4<f32>(${o}, ${i}, ${a}, ${l}), t);`}case"block_collision":return`{
  let _bc_uv = (p.position.xz - vec2<f32>(hm.origin_x, hm.origin_z)) / (hm.extent * 2.0) + 0.5;
  if (all(_bc_uv >= vec2<f32>(0.0)) && all(_bc_uv <= vec2<f32>(1.0))) {
    let _bc_xi = clamp(u32(_bc_uv.x * f32(hm.resolution)), 0u, hm.resolution - 1u);
    let _bc_zi = clamp(u32(_bc_uv.y * f32(hm.resolution)), 0u, hm.resolution - 1u);
    if (p.position.y <= hm_data[_bc_zi * hm.resolution + _bc_xi]) {
      particles[idx].life = -1.0; return;
    }
  }
}`}}function Tn(d,n){return d?d.filter(e=>e.trigger===n).flatMap(e=>e.actions.map(Gn)).join(`
  `):""}function no(d){const{emitter:n,events:e}=d,[t,r]=n.lifetime.map(h=>h.toFixed(6)),[o,i]=n.initialSpeed.map(h=>h.toFixed(6)),[a,l]=n.initialSize.map(h=>h.toFixed(6)),[s,u,p,f]=n.initialColor.map(h=>h.toFixed(6));return`
${Pn}

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

  let speed = rand_range(${o}, ${i}, seed + 1u);

  var p: Particle;
  p.life     = 0.0;
  p.max_life = rand_range(${t}, ${r}, seed + 2u);
  p.color    = vec4<f32>(${s}, ${u}, ${p}, ${f});
  p.size     = rand_range(${a}, ${l}, seed + 3u);
  p.rotation = rand_f32(seed + 4u) * 6.28318530717958647;

  ${ro(n.shape)}

  ${Tn(e,"on_spawn")}

  particles[idx] = p;
}
`}function io(d){return d.modifiers.some(n=>n.type==="block_collision")}const oo=`
struct HeightmapUniforms {
  origin_x  : f32,
  origin_z  : f32,
  extent    : f32,
  resolution: u32,
}
@group(2) @binding(0) var<storage, read> hm_data: array<f32>;
@group(2) @binding(1) var<uniform>       hm     : HeightmapUniforms;
`;function ao(d){const n=d.modifiers.some(r=>r.type==="block_collision"),e=d.modifiers.map(Gn).join(`
  `),t=Tn(d.events,"on_death");return`
${Pn}
${n?oo:""}

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
`}const so=`// Compact pass — rebuilds alive_list and writes indirect draw instance count.\r
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
`,lo=`// Particle GBuffer render pass — camera-facing billboard quads.\r
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
`,co=`// Particle forward HDR render pass — velocity-aligned billboard quads.\r
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
`,rn=64,nn=80,uo=16,fo=16,on=288,an=16,It=128;class dr extends pe{constructor(e,t,r,o,i,a,l,s,u,p,f,h,_,m,x,v,w,B,G,S,M,U,A,N,P,y,C){super();c(this,"name","ParticlePass");c(this,"_gbuffer");c(this,"_hdrView");c(this,"_isForward");c(this,"_maxParticles");c(this,"_config");c(this,"_particleBuffer");c(this,"_aliveList");c(this,"_counterBuffer");c(this,"_indirectBuffer");c(this,"_computeUniforms");c(this,"_renderUniforms");c(this,"_cameraBuffer");c(this,"_spawnPipeline");c(this,"_updatePipeline");c(this,"_compactPipeline");c(this,"_indirectPipeline");c(this,"_renderPipeline");c(this,"_computeDataBG");c(this,"_computeUniBG");c(this,"_compactDataBG");c(this,"_compactUniBG");c(this,"_renderDataBG");c(this,"_cameraRenderBG");c(this,"_renderParamsBG");c(this,"_heightmapDataBuf");c(this,"_heightmapUniBuf");c(this,"_heightmapBG");c(this,"_spawnAccum",0);c(this,"_spawnOffset",0);c(this,"_spawnCount",0);c(this,"_time",0);c(this,"_frameSeed",0);c(this,"_cuBuf",new Float32Array(nn/4));c(this,"_cuiView",new Uint32Array(this._cuBuf.buffer));c(this,"_camBuf",new Float32Array(on/4));c(this,"_hmUniBuf",new Float32Array(an/4));c(this,"_hmRes",new Uint32Array([It]));c(this,"_resetArr",new Uint32Array(1));this._gbuffer=e,this._hdrView=t,this._isForward=r,this._config=o,this._maxParticles=i,this._particleBuffer=a,this._aliveList=l,this._counterBuffer=s,this._indirectBuffer=u,this._computeUniforms=p,this._renderUniforms=f,this._cameraBuffer=h,this._spawnPipeline=_,this._updatePipeline=m,this._compactPipeline=x,this._indirectPipeline=v,this._renderPipeline=w,this._computeDataBG=B,this._computeUniBG=G,this._compactDataBG=S,this._compactUniBG=M,this._renderDataBG=U,this._cameraRenderBG=A,this._renderParamsBG=N,this._heightmapDataBuf=P,this._heightmapUniBuf=y,this._heightmapBG=C}static create(e,t,r,o){const{device:i}=e,a=t.renderer.type==="sprites"&&t.renderer.renderTarget==="hdr",l=t.emitter.maxParticles,s=i.createBuffer({label:"ParticleBuffer",size:l*rn,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),u=new Float32Array(l*(rn/4));for(let ne=0;ne<l;ne++)u[ne*16+3]=-1;i.queue.writeBuffer(s,0,u.buffer);const p=i.createBuffer({label:"ParticleAliveList",size:l*4,usage:GPUBufferUsage.STORAGE}),f=i.createBuffer({label:"ParticleCounter",size:4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),h=i.createBuffer({label:"ParticleIndirect",size:16,usage:GPUBufferUsage.INDIRECT|GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});i.queue.writeBuffer(h,0,new Uint32Array([6,0,0,0]));const _=i.createBuffer({label:"ParticleComputeUniforms",size:nn,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),m=i.createBuffer({label:"ParticleCompactUniforms",size:uo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});i.queue.writeBuffer(m,0,new Uint32Array([l,0,0,0]));const x=i.createBuffer({label:"ParticleRenderUniforms",size:fo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});i.queue.writeBuffer(x,0,new Float32Array([t.emitter.roughness,t.emitter.metallic,0,0]));const v=i.createBuffer({label:"ParticleCameraBuffer",size:on,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),w=i.createBindGroupLayout({label:"ParticleComputeDataBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),B=i.createBindGroupLayout({label:"ParticleCompactDataBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),G=i.createBindGroupLayout({label:"ParticleComputeUniBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),S=i.createBindGroupLayout({label:"ParticleRenderDataBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}}]}),M=i.createBindGroupLayout({label:"ParticleCameraRenderBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),U=i.createBindGroupLayout({label:"ParticleRenderParamsBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),A=i.createBindGroup({label:"ParticleComputeDataBG",layout:w,entries:[{binding:0,resource:{buffer:s}},{binding:1,resource:{buffer:p}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:h}}]}),N=i.createBindGroup({label:"ParticleCompactDataBG",layout:B,entries:[{binding:0,resource:{buffer:s}},{binding:1,resource:{buffer:p}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:h}}]}),P=i.createBindGroup({label:"ParticleComputeUniBG",layout:G,entries:[{binding:0,resource:{buffer:_}}]}),y=i.createBindGroup({label:"ParticleCompactUniBG",layout:G,entries:[{binding:0,resource:{buffer:m}}]}),C=i.createBindGroup({label:"ParticleRenderDataBG",layout:S,entries:[{binding:0,resource:{buffer:s}},{binding:1,resource:{buffer:p}}]}),g=i.createBindGroup({label:"ParticleCameraRenderBG",layout:M,entries:[{binding:0,resource:{buffer:v}}]}),T=i.createBindGroup({label:"ParticleRenderParamsBG",layout:U,entries:[{binding:0,resource:{buffer:x}}]});let b,E,k,z;io(t)&&(b=i.createBuffer({label:"ParticleHeightmapData",size:It*It*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),E=i.createBuffer({label:"ParticleHeightmapUniforms",size:an,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),z=i.createBindGroupLayout({label:"ParticleHeightmapBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),k=i.createBindGroup({label:"ParticleHeightmapBG",layout:z,entries:[{binding:0,resource:{buffer:b}},{binding:1,resource:{buffer:E}}]}));const D=i.createPipelineLayout({bindGroupLayouts:[w,G]}),O=z?i.createPipelineLayout({bindGroupLayouts:[w,G,z]}):i.createPipelineLayout({bindGroupLayouts:[w,G]}),X=i.createPipelineLayout({bindGroupLayouts:[B,G]}),ue=i.createShaderModule({label:"ParticleSpawn",code:no(t)}),de=i.createShaderModule({label:"ParticleUpdate",code:ao(t)}),Q=i.createShaderModule({label:"ParticleCompact",code:so}),J=i.createComputePipeline({label:"ParticleSpawnPipeline",layout:D,compute:{module:ue,entryPoint:"cs_main"}}),H=i.createComputePipeline({label:"ParticleUpdatePipeline",layout:O,compute:{module:de,entryPoint:"cs_main"}}),Y=i.createComputePipeline({label:"ParticleCompactPipeline",layout:X,compute:{module:Q,entryPoint:"cs_compact"}}),q=i.createComputePipeline({label:"ParticleIndirectPipeline",layout:X,compute:{module:Q,entryPoint:"cs_write_indirect"}});let j;if(a){const ne=t.renderer.type==="sprites"?t.renderer.billboard:"camera",he=ne==="camera"?"vs_camera":"vs_main",ge=ne==="camera"?"fs_snow":"fs_main",fe=i.createShaderModule({label:"ParticleRenderForward",code:co}),se=i.createPipelineLayout({bindGroupLayouts:[S,M]});j=i.createRenderPipeline({label:"ParticleForwardPipeline",layout:se,vertex:{module:fe,entryPoint:he},fragment:{module:fe,entryPoint:ge,targets:[{format:$,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},depthStencil:{format:"depth32float",depthWriteEnabled:!1,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}})}else{const ne=i.createShaderModule({label:"ParticleRender",code:lo}),he=i.createPipelineLayout({bindGroupLayouts:[S,M,U]});j=i.createRenderPipeline({label:"ParticleRenderPipeline",layout:he,vertex:{module:ne,entryPoint:"vs_main"},fragment:{module:ne,entryPoint:"fs_main",targets:[{format:"rgba8unorm"},{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}})}return new dr(r,o,a,t,l,s,p,f,h,_,x,v,J,H,Y,q,j,A,P,N,y,C,g,a?void 0:T,b,E,k)}updateHeightmap(e,t,r,o,i){if(!this._heightmapDataBuf||!this._heightmapUniBuf)return;e.queue.writeBuffer(this._heightmapDataBuf,0,t.buffer);const a=this._hmUniBuf;a[0]=r,a[1]=o,a[2]=i,e.queue.writeBuffer(this._heightmapUniBuf,0,a.buffer,0,12),e.queue.writeBuffer(this._heightmapUniBuf,12,this._hmRes)}update(e,t,r,o,i,a,l,s,u,p){this._time+=t,this._frameSeed=this._frameSeed+1&4294967295,this._spawnAccum+=this._config.emitter.spawnRate*t,this._spawnCount=Math.min(Math.floor(this._spawnAccum),this._maxParticles),this._spawnAccum-=this._spawnCount;const f=p.data,h=f[12],_=f[13],m=f[14],x=Math.hypot(f[0],f[1],f[2]),v=Math.hypot(f[4],f[5],f[6]),w=Math.hypot(f[8],f[9],f[10]),B=f[0]/x,G=f[1]/x,S=f[2]/x,M=f[4]/v,U=f[5]/v,A=f[6]/v,N=f[8]/w,P=f[9]/w,y=f[10]/w,C=B+U+y;let g,T,b,E;if(C>0){const O=.5/Math.sqrt(C+1);E=.25/O,g=(A-P)*O,T=(N-S)*O,b=(G-M)*O}else if(B>U&&B>y){const O=2*Math.sqrt(1+B-U-y);E=(A-P)/O,g=.25*O,T=(M+G)/O,b=(N+S)/O}else if(U>y){const O=2*Math.sqrt(1+U-B-y);E=(N-S)/O,g=(M+G)/O,T=.25*O,b=(P+A)/O}else{const O=2*Math.sqrt(1+y-B-U);E=(G-M)/O,g=(N+S)/O,T=(P+A)/O,b=.25*O}const k=this._cuBuf,z=this._cuiView;k[0]=h,k[1]=_,k[2]=m,z[3]=this._spawnCount,k[4]=g,k[5]=T,k[6]=b,k[7]=E,z[8]=this._spawnOffset,z[9]=this._maxParticles,z[10]=this._frameSeed,z[11]=0,k[12]=t,k[13]=this._time,e.queue.writeBuffer(this._computeUniforms,0,k.buffer),e.queue.writeBuffer(this._counterBuffer,0,this._resetArr),this._spawnOffset=(this._spawnOffset+this._spawnCount)%this._maxParticles;const D=this._camBuf;D.set(r.data,0),D.set(o.data,16),D.set(i.data,32),D.set(a.data,48),D[64]=l.x,D[65]=l.y,D[66]=l.z,D[67]=s,D[68]=u,e.queue.writeBuffer(this._cameraBuffer,0,D.buffer)}execute(e,t){const r=e.beginComputePass({label:"ParticleCompute"});if(this._spawnCount>0&&(r.setPipeline(this._spawnPipeline),r.setBindGroup(0,this._computeDataBG),r.setBindGroup(1,this._computeUniBG),r.dispatchWorkgroups(Math.ceil(this._spawnCount/64))),r.setPipeline(this._updatePipeline),r.setBindGroup(0,this._computeDataBG),r.setBindGroup(1,this._computeUniBG),this._heightmapBG&&r.setBindGroup(2,this._heightmapBG),r.dispatchWorkgroups(Math.ceil(this._maxParticles/64)),r.setPipeline(this._compactPipeline),r.setBindGroup(0,this._compactDataBG),r.setBindGroup(1,this._compactUniBG),r.dispatchWorkgroups(Math.ceil(this._maxParticles/64)),r.setPipeline(this._indirectPipeline),r.dispatchWorkgroups(1),r.end(),this._isForward){const o=e.beginRenderPass({label:"ParticleForwardPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthReadOnly:!0}});o.setPipeline(this._renderPipeline),o.setBindGroup(0,this._renderDataBG),o.setBindGroup(1,this._cameraRenderBG),o.drawIndirect(this._indirectBuffer,0),o.end()}else{const o=e.beginRenderPass({label:"ParticleGBufferPass",colorAttachments:[{view:this._gbuffer.albedoRoughnessView,loadOp:"load",storeOp:"store"},{view:this._gbuffer.normalMetallicView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthLoadOp:"load",depthStoreOp:"store"}});o.setPipeline(this._renderPipeline),o.setBindGroup(0,this._renderDataBG),o.setBindGroup(1,this._cameraRenderBG),o.setBindGroup(2,this._renderParamsBG),o.drawIndirect(this._indirectBuffer,0),o.end()}}destroy(){var e,t;this._particleBuffer.destroy(),this._aliveList.destroy(),this._counterBuffer.destroy(),this._indirectBuffer.destroy(),this._computeUniforms.destroy(),this._renderUniforms.destroy(),this._cameraBuffer.destroy(),(e=this._heightmapDataBuf)==null||e.destroy(),(t=this._heightmapUniBuf)==null||t.destroy()}}const po=`// Auto-exposure — two-pass histogram approach.\r
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
`,ho=64,mo=32,_o=16,go=ho*4,sn={adaptSpeed:1.5,minExposure:.1,maxExposure:10,lowPct:.05,highPct:.02};class $e extends pe{constructor(e,t,r,o,i,a,l,s){super();c(this,"name","AutoExposurePass");c(this,"exposureBuffer");c(this,"_histogramPipeline");c(this,"_adaptPipeline");c(this,"_bindGroup");c(this,"_paramsBuffer");c(this,"_histogramBuffer");c(this,"_hdrWidth");c(this,"_hdrHeight");c(this,"enabled",!0);this._histogramPipeline=e,this._adaptPipeline=t,this._bindGroup=r,this._paramsBuffer=o,this._histogramBuffer=i,this.exposureBuffer=a,this._hdrWidth=l,this._hdrHeight=s}static create(e,t,r=sn){const{device:o}=e,i=o.createBindGroupLayout({label:"AutoExposureBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),a=o.createBuffer({label:"AutoExposureHistogram",size:go,usage:GPUBufferUsage.STORAGE}),l=o.createBuffer({label:"AutoExposureValue",size:_o,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});o.queue.writeBuffer(l,0,new Float32Array([1,0,0,0]));const s=o.createBuffer({label:"AutoExposureParams",size:mo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});$e._writeParams(o,s,0,r);const u=o.createBindGroup({label:"AutoExposureBG",layout:i,entries:[{binding:0,resource:t.createView()},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:s}}]}),p=o.createPipelineLayout({bindGroupLayouts:[i]}),f=o.createShaderModule({label:"AutoExposure",code:po}),h=o.createComputePipeline({label:"AutoExposureHistogramPipeline",layout:p,compute:{module:f,entryPoint:"cs_histogram"}}),_=o.createComputePipeline({label:"AutoExposureAdaptPipeline",layout:p,compute:{module:f,entryPoint:"cs_adapt"}});return new $e(h,_,u,s,a,l,t.width,t.height)}update(e,t,r=sn){if(!this.enabled){e.device.queue.writeBuffer(this.exposureBuffer,0,new Float32Array([1,0,0,0]));return}$e._writeParams(e.device,this._paramsBuffer,t,r)}execute(e,t){if(!this.enabled)return;const r=e.beginComputePass({label:"AutoExposurePass"});r.setPipeline(this._histogramPipeline),r.setBindGroup(0,this._bindGroup),r.dispatchWorkgroups(Math.ceil(this._hdrWidth/32),Math.ceil(this._hdrHeight/32)),r.setPipeline(this._adaptPipeline),r.dispatchWorkgroups(1),r.end()}destroy(){this._paramsBuffer.destroy(),this._histogramBuffer.destroy(),this.exposureBuffer.destroy()}static _writeParams(e,t,r,o){e.queue.writeBuffer(t,0,new Float32Array([r,o.adaptSpeed,o.minExposure,o.maxExposure,o.lowPct,o.highPct,0,0]))}}function vo(d,n,e){let t=(Math.imul(d,1664525)^Math.imul(n,1013904223)^Math.imul(e,22695477))>>>0;return t=Math.imul(t^t>>>16,73244475)>>>0,t=Math.imul(t^t>>>16,73244475)>>>0,((t^t>>>16)>>>0)/4294967295}function gt(d,n,e,t){return vo(d^t,n^t*7+3,e^t*13+5)}function Vt(d){return d*d*d*(d*(d*6-15)+10)}function bo(d,n,e,t,r,o,i,a,l,s,u){const p=d+(n-d)*l,f=e+(t-e)*l,h=r+(o-r)*l,_=i+(a-i)*l,m=p+(f-p)*s,x=h+(_-h)*s;return m+(x-m)*u}const yo=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];function ke(d,n,e,t,r,o,i,a){const l=h=>(h%t+t)%t,s=Math.floor(gt(l(d),l(n),l(e),r)*12)%12,[u,p,f]=yo[s];return u*o+p*i+f*a}function xo(d,n,e,t,r){const o=Math.floor(d),i=Math.floor(n),a=Math.floor(e),l=d-o,s=n-i,u=e-a,p=Vt(l),f=Vt(s),h=Vt(u);return bo(ke(o,i,a,t,r,l,s,u),ke(o+1,i,a,t,r,l-1,s,u),ke(o,i+1,a,t,r,l,s-1,u),ke(o+1,i+1,a,t,r,l-1,s-1,u),ke(o,i,a+1,t,r,l,s,u-1),ke(o+1,i,a+1,t,r,l-1,s,u-1),ke(o,i+1,a+1,t,r,l,s-1,u-1),ke(o+1,i+1,a+1,t,r,l-1,s-1,u-1),p,f,h)}function wo(d,n,e,t,r,o){let i=0,a=.5,l=1,s=0;for(let u=0;u<t;u++)i+=xo(d*l,n*l,e*l,r*l,o+u*17)*a,s+=a,a*=.5,l*=2;return Math.max(0,Math.min(1,i/s*.85+.5))}function Fe(d,n,e,t,r){const o=d*t,i=n*t,a=e*t,l=Math.floor(o),s=Math.floor(i),u=Math.floor(a),p=h=>(h%t+t)%t;let f=1/0;for(let h=-1;h<=1;h++)for(let _=-1;_<=1;_++)for(let m=-1;m<=1;m++){const x=l+m,v=s+_,w=u+h,B=x+gt(p(x),p(v),p(w),r),G=v+gt(p(x),p(v),p(w),r+1),S=w+gt(p(x),p(v),p(w),r+2),M=o-B,U=i-G,A=a-S,N=M*M+U*U+A*A;N<f&&(f=N)}return 1-Math.min(Math.sqrt(f),1)}function ln(d,n,e,t){const r=d.createTexture({label:n,dimension:"3d",size:{width:e,height:e,depthOrArrayLayers:e},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return d.queue.writeTexture({texture:r},t.buffer,{bytesPerRow:e*4,rowsPerImage:e},{width:e,height:e,depthOrArrayLayers:e}),r}function Bo(d){const e=new Uint8Array(1048576);for(let a=0;a<64;a++)for(let l=0;l<64;l++)for(let s=0;s<64;s++){const u=(a*64*64+l*64+s)*4,p=s/64,f=l/64,h=a/64,_=wo(p,f,h,4,4,0),m=Fe(p,f,h,2,100),x=Fe(p,f,h,4,200),v=Fe(p,f,h,8,300);e[u]=Math.round(_*255),e[u+1]=Math.round(m*255),e[u+2]=Math.round(x*255),e[u+3]=Math.round(v*255)}const t=32,r=new Uint8Array(t*t*t*4);for(let a=0;a<t;a++)for(let l=0;l<t;l++)for(let s=0;s<t;s++){const u=(a*t*t+l*t+s)*4,p=s/t,f=l/t,h=a/t,_=Fe(p,f,h,4,400),m=Fe(p,f,h,8,500),x=Fe(p,f,h,16,600);r[u]=Math.round(_*255),r[u+1]=Math.round(m*255),r[u+2]=Math.round(x*255),r[u+3]=255}const o=ln(d,"CloudBaseNoise",64,e),i=ln(d,"CloudDetailNoise",t,r);return{baseNoise:o,baseView:o.createView({dimension:"3d"}),detailNoise:i,detailView:i.createView({dimension:"3d"}),destroy(){o.destroy(),i.destroy()}}}const So=`// IBL baking — two compute entry points share the same bind group layout.\r
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
`,dt=5,zt=128,ft=32,Po=[0,.25,.5,.75,1],Go=Math.PI;function To(d){let n=d>>>0;return n=(n<<16|n>>>16)>>>0,n=((n&1431655765)<<1|n>>>1&1431655765)>>>0,n=((n&858993459)<<2|n>>>2&858993459)>>>0,n=((n&252645135)<<4|n>>>4&252645135)>>>0,n=((n&16711935)<<8|n>>>8&16711935)>>>0,n*23283064365386963e-26}function Ao(d,n,e){const t=new Float32Array(d*n*4);for(let r=0;r<n;r++)for(let o=0;o<d;o++){const i=(o+.5)/d,a=(r+.5)/n,l=a*a,s=l*l,u=Math.sqrt(1-i*i),p=i;let f=0,h=0;for(let m=0;m<e;m++){const x=(m+.5)/e,v=To(m),w=(1-v)/(1+(s-1)*v),B=Math.sqrt(w),G=Math.sqrt(Math.max(0,1-w)),S=2*Go*x,M=G*Math.cos(S),U=B,A=u*M+p*U;if(A<=0)continue;const N=2*A*U-p,P=Math.max(0,N),y=Math.max(0,B);if(P<=0)continue;const C=s/2,g=i/(i*(1-C)+C),T=P/(P*(1-C)+C),b=g*T*A/(y*i),E=Math.pow(1-A,5);f+=b*(1-E),h+=b*E}const _=(r*d+o)*4;t[_+0]=f/e,t[_+1]=h/e,t[_+2]=0,t[_+3]=1}return t}function Uo(d){const n=new Float32Array([d]),e=new Uint32Array(n.buffer)[0],t=e>>31&1,r=e>>23&255,o=e&8388607;if(r===255)return t<<15|31744|(o?1:0);if(r===0)return t<<15;const i=r-127+15;return i>=31?t<<15|31744:i<=0?t<<15:t<<15|i<<10|o>>13}function Eo(d){const n=new Uint16Array(d.length);for(let e=0;e<d.length;e++)n[e]=Uo(d[e]);return n}const cn=new WeakMap;function Mo(d){const n=cn.get(d);if(n)return n;const e=Eo(Ao(64,64,512)),t=d.createTexture({label:"IBL BRDF LUT",size:{width:64,height:64},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return d.queue.writeTexture({texture:t},e,{bytesPerRow:64*8},{width:64,height:64}),cn.set(d,t),t}const un=new WeakMap;function Co(d){const n=un.get(d);if(n)return n;const e=d.createBindGroupLayout({label:"IblBGL0",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.COMPUTE,sampler:{type:"filtering"}}]}),t=d.createBindGroupLayout({label:"IblBGL1",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"2d"}}]}),r=d.createPipelineLayout({bindGroupLayouts:[e,t]}),o=d.createShaderModule({label:"IblCompute",code:So}),i=d.createComputePipeline({label:"IblIrradiancePipeline",layout:r,compute:{module:o,entryPoint:"cs_irradiance"}}),a=d.createComputePipeline({label:"IblPrefilterPipeline",layout:r,compute:{module:o,entryPoint:"cs_prefilter"}}),l=d.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"clamp-to-edge"}),s={irrPipeline:i,pfPipeline:a,bgl0:e,bgl1:t,sampler:l};return un.set(d,s),s}async function Ro(d,n,e=.2){const{irrPipeline:t,pfPipeline:r,bgl0:o,bgl1:i,sampler:a}=Co(d),l=d.createTexture({label:"IBL Irradiance",size:{width:ft,height:ft,depthOrArrayLayers:6},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),s=d.createTexture({label:"IBL Prefiltered",size:{width:zt,height:zt,depthOrArrayLayers:6},mipLevelCount:dt,format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),u=(P,y)=>{const C=d.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return d.queue.writeBuffer(C,0,new Float32Array([e,P,y,0])),C},p=n.createView(),f=P=>d.createBindGroup({layout:o,entries:[{binding:0,resource:{buffer:P}},{binding:1,resource:p},{binding:2,resource:a}]}),h=P=>d.createBindGroup({layout:i,entries:[{binding:0,resource:P}]}),_=Array.from({length:6},(P,y)=>u(0,y)),m=Po.flatMap((P,y)=>Array.from({length:6},(C,g)=>u(P,g))),x=_.map(f),v=m.map(f),w=Array.from({length:6},(P,y)=>h(l.createView({dimension:"2d",baseArrayLayer:y,arrayLayerCount:1}))),B=Array.from({length:dt*6},(P,y)=>{const C=Math.floor(y/6),g=y%6;return h(s.createView({dimension:"2d",baseMipLevel:C,mipLevelCount:1,baseArrayLayer:g,arrayLayerCount:1}))}),G=d.createCommandEncoder({label:"IblComputeEncoder"}),S=G.beginComputePass({label:"IblComputePass"});S.setPipeline(t);for(let P=0;P<6;P++)S.setBindGroup(0,x[P]),S.setBindGroup(1,w[P]),S.dispatchWorkgroups(Math.ceil(ft/8),Math.ceil(ft/8));S.setPipeline(r);for(let P=0;P<dt;P++){const y=zt>>P;for(let C=0;C<6;C++)S.setBindGroup(0,v[P*6+C]),S.setBindGroup(1,B[P*6+C]),S.dispatchWorkgroups(Math.ceil(y/8),Math.ceil(y/8))}S.end(),d.queue.submit([G.finish()]),await d.queue.onSubmittedWorkDone(),_.forEach(P=>P.destroy()),m.forEach(P=>P.destroy());const M=Mo(d),U=l.createView({dimension:"cube"}),A=s.createView({dimension:"cube"}),N=M.createView();return{irradiance:l,prefiltered:s,brdfLut:M,irradianceView:U,prefilteredView:A,brdfLutView:N,levels:dt,destroy(){l.destroy(),s.destroy()}}}class Se{constructor(n,e){c(this,"gpuTexture");c(this,"view");c(this,"type");this.gpuTexture=n,this.type=e,this.view=n.createView({dimension:e==="cube"?"cube":e==="3d"?"3d":"2d"})}destroy(){this.gpuTexture.destroy()}static createSolid(n,e,t,r,o=255){const i=n.createTexture({size:{width:1,height:1},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return n.queue.writeTexture({texture:i},new Uint8Array([e,t,r,o]),{bytesPerRow:4},{width:1,height:1}),new Se(i,"2d")}static fromBitmap(n,e,{srgb:t=!1,usage:r}={}){const o=t?"rgba8unorm-srgb":"rgba8unorm";r=r?r|(GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT):GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT;const i=n.createTexture({size:{width:e.width,height:e.height},format:o,usage:r});return n.queue.copyExternalImageToTexture({source:e,flipY:!1},{texture:i},{width:e.width,height:e.height}),new Se(i,"2d")}static async fromUrl(n,e,t={}){const r=await(await fetch(e)).blob(),o={colorSpaceConversion:"none"};t.resizeWidth!==void 0&&t.resizeHeight!==void 0&&(o.resizeWidth=t.resizeWidth,o.resizeHeight=t.resizeHeight,o.resizeQuality="high");const i=await createImageBitmap(r,o);return Se.fromBitmap(n,i,t)}}const Lo=`// Decodes an RGBE (Radiance HDR) texture into a linear rgba16float texture.\r
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
`;function No(d){const n=new Uint8Array(d);let e=0;function t(){let f="";for(;e<n.length&&n[e]!==10;)n[e]!==13&&(f+=String.fromCharCode(n[e])),e++;return e<n.length&&e++,f}const r=t();if(!r.startsWith("#?RADIANCE")&&!r.startsWith("#?RGBE"))throw new Error(`Not a Radiance HDR file (magic: "${r}")`);for(;t().length!==0;);const o=t(),i=o.match(/-Y\s+(\d+)\s+\+X\s+(\d+)/);if(!i)throw new Error(`Unrecognized HDR resolution: "${o}"`);const a=parseInt(i[1],10),l=parseInt(i[2],10),s=new Uint8Array(l*a*4);function u(f){const h=new Uint8Array(l),_=new Uint8Array(l),m=new Uint8Array(l),x=new Uint8Array(l),v=[h,_,m,x];for(let B=0;B<4;B++){const G=v[B];let S=0;for(;S<l;){const M=n[e++];if(M>128){const U=M-128,A=n[e++];G.fill(A,S,S+U),S+=U}else G.set(n.subarray(e,e+M),S),e+=M,S+=M}}const w=f*l*4;for(let B=0;B<l;B++)s[w+B*4+0]=h[B],s[w+B*4+1]=_[B],s[w+B*4+2]=m[B],s[w+B*4+3]=x[B]}function p(f,h,_,m,x){const v=f*l*4;s[v+0]=h,s[v+1]=_,s[v+2]=m,s[v+3]=x;let w=1;for(;w<l;){const B=n[e++],G=n[e++],S=n[e++],M=n[e++];if(B===1&&G===1&&S===1){const U=v+(w-1)*4;for(let A=0;A<M;A++)s[v+w*4+0]=s[U+0],s[v+w*4+1]=s[U+1],s[v+w*4+2]=s[U+2],s[v+w*4+3]=s[U+3],w++}else s[v+w*4+0]=B,s[v+w*4+1]=G,s[v+w*4+2]=S,s[v+w*4+3]=M,w++}}for(let f=0;f<a&&!(e+4>n.length);f++){const h=n[e++],_=n[e++],m=n[e++],x=n[e++];if(h===2&&_===2&&!(m&128)){const v=m<<8|x;if(v!==l)throw new Error(`HDR scanline width mismatch: ${v} vs ${l}`);u(f)}else p(f,h,_,m,x)}return{width:l,height:a,data:s}}const dn=new WeakMap;function ko(d){const n=dn.get(d);if(n)return n;const e=d.createBindGroupLayout({label:"RgbeSrcBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"uint"}}]}),t=d.createBindGroupLayout({label:"RgbeDstBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"2d"}}]}),r=d.createPipelineLayout({bindGroupLayouts:[e,t]}),o=d.createShaderModule({label:"RgbeDecode",code:Lo}),a={pipeline:d.createComputePipeline({label:"RgbeDecodePipeline",layout:r,compute:{module:o,entryPoint:"cs_decode"}}),srcBGL:e,dstBGL:t};return dn.set(d,a),a}async function Oo(d,n){const{width:e,height:t,data:r}=n,{pipeline:o,srcBGL:i,dstBGL:a}=ko(d),l=d.createTexture({label:"Sky RGBE Raw",size:{width:e,height:t},format:"rgba8uint",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});d.queue.writeTexture({texture:l},r.buffer,{bytesPerRow:e*4},{width:e,height:t});const s=d.createTexture({label:"Sky HDR Texture",size:{width:e,height:t},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),u=d.createBindGroup({layout:i,entries:[{binding:0,resource:l.createView()}]}),p=d.createBindGroup({layout:a,entries:[{binding:0,resource:s.createView()}]}),f=d.createCommandEncoder({label:"RgbeDecodeEncoder"}),h=f.beginComputePass({label:"RgbeDecodePass"});return h.setPipeline(o),h.setBindGroup(0,u),h.setBindGroup(1,p),h.dispatchWorkgroups(Math.ceil(e/8),Math.ceil(t/8)),h.end(),d.queue.submit([f.finish()]),await d.queue.onSubmittedWorkDone(),l.destroy(),new Se(s,"2d")}class fr{constructor(n,e,t,r,o,i,a){c(this,"colorAtlas");c(this,"normalAtlas");c(this,"merAtlas");c(this,"heightAtlas");c(this,"blockSize");c(this,"blockCount");c(this,"_atlasWidth");c(this,"_atlasHeight");this.colorAtlas=n,this.normalAtlas=e,this.merAtlas=t,this.heightAtlas=r,this.blockSize=o,this._atlasWidth=i,this._atlasHeight=a,this.blockCount=Math.floor(i/o)}static async load(n,e,t,r,o,i=16){async function a(w){const B=await(await fetch(w)).blob();return createImageBitmap(B,{colorSpaceConversion:"none"})}const[l,s,u,p]=await Promise.all([a(e),a(t),a(r),a(o)]),f=l.width,h=l.height,_=Se.fromBitmap(n,l,{srgb:!0}),m=Se.fromBitmap(n,s,{srgb:!1}),x=Se.fromBitmap(n,u,{srgb:!1}),v=Se.fromBitmap(n,p,{srgb:!1});return new fr(_,m,x,v,i,f,h)}uvTransform(n){const e=this.blockSize/this._atlasWidth,t=this.blockSize/this._atlasHeight;return[n*e,0,e,t]}destroy(){this.colorAtlas.destroy(),this.normalAtlas.destroy(),this.merAtlas.destroy(),this.heightAtlas.destroy()}}var xe=(d=>(d[d.None=0]="None",d[d.SnowyMountains=1]="SnowyMountains",d[d.RockyMountains=2]="RockyMountains",d[d.GrassyPlains=3]="GrassyPlains",d[d.SnowyPlains=4]="SnowyPlains",d[d.Desert=5]="Desert",d[d.Max=6]="Max",d))(xe||{}),We=(d=>(d[d.None=0]="None",d[d.Rain=1]="Rain",d[d.Snow=2]="Snow",d))(We||{});function Io(d){switch(d){case 1:return 2;case 4:return 2;default:return 0}}function fn(d){switch(d){case 1:return{cloudBase:90,cloudTop:200};case 2:return{cloudBase:75,cloudTop:160};default:return{cloudBase:75,cloudTop:105}}}const pt=.05,Vo=[[.35,5,3],[-.15,3,4],[-.3,4,1],[-.5,1,2]];function zo(d){for(const[e,t,r]of Vo){const o=d-e;if(o>=-pt&&o<=pt)return{biome1:r,biome2:t,blend:(o+pt)/(2*pt)}}const n=Do(d);return{biome1:n,biome2:n,blend:0}}function Do(d){return d>.35?5:d>-.15?3:d>-.3?4:d>-.5?1:2}function pn(d){switch(d){case 1:return 1.2;case 4:return 1;case 3:return .75;case 2:return .9;case 5:return .15;default:return .55}}function Fo(d,n){let e=(Math.imul(d|0,2654435769)^Math.imul(n|0,1367130551))>>>0;return e=Math.imul(e^e>>>16,73244475)>>>0,e=(e^e>>>16)>>>0,e/4294967296}const V=class V{constructor(n,e,t){c(this,"blocks",new Uint8Array(V.CHUNK_WIDTH*V.CHUNK_HEIGHT*V.CHUNK_DEPTH));c(this,"globalPosition",new I);c(this,"opaqueIndex",-1);c(this,"transparentIndex",-1);c(this,"waterIndex",-1);c(this,"drawCommandIndex",-1);c(this,"chunkDataIndex",-1);c(this,"aabbTreeIndex",-1);c(this,"aliveBlocks",0);c(this,"opaqueBlocks",0);c(this,"transparentBlocks",0);c(this,"waterBlocks",0);c(this,"lightBlocks",0);c(this,"isDeleted",!1);this.globalPosition.set(n,e,t)}generateVertices(n){const e=V.CHUNK_WIDTH,t=V.CHUNK_HEIGHT,r=V.CHUNK_DEPTH,o=5;let i=0,a=0,l=0;for(let g=0;g<this.blocks.length;g++){const T=this.blocks[g];T===R.NONE||ae(T)||(Be(T)?l++:nt(T)?a++:i++)}const s=new Float32Array(i*36*o),u=new Float32Array(a*36*o),p=new Float32Array(l*6*o),f=new Uint16Array(e*t*6);let h=0,_=0,m=0,x=!1;const v=[],w=e+2,B=t+2,G=w*B,S=new Uint8Array(w*B*(r+2));for(let g=0;g<r;g++)for(let T=0;T<t;T++)for(let b=0;b<e;b++)S[b+1+(T+1)*w+(g+1)*G]=this.blocks[b+T*e+g*e*t];if(n!=null&&n.negX){const g=n.negX;for(let T=0;T<r;T++)for(let b=0;b<t;b++)S[0+(b+1)*w+(T+1)*G]=g[e-1+b*e+T*e*t]}if(n!=null&&n.posX){const g=n.posX;for(let T=0;T<r;T++)for(let b=0;b<t;b++)S[e+1+(b+1)*w+(T+1)*G]=g[0+b*e+T*e*t]}if(n!=null&&n.negY){const g=n.negY;for(let T=0;T<r;T++)for(let b=0;b<e;b++)S[b+1+0+(T+1)*G]=g[b+(t-1)*e+T*e*t]}if(n!=null&&n.posY){const g=n.posY;for(let T=0;T<r;T++)for(let b=0;b<e;b++)S[b+1+(t+1)*w+(T+1)*G]=g[b+0*e+T*e*t]}if(n!=null&&n.negZ){const g=n.negZ;for(let T=0;T<t;T++)for(let b=0;b<e;b++)S[b+1+(T+1)*w+0]=g[b+T*e+(r-1)*e*t]}if(n!=null&&n.posZ){const g=n.posZ;for(let T=0;T<t;T++)for(let b=0;b<e;b++)S[b+1+(T+1)*w+(r+1)*G]=g[b+T*e+0*e*t]}const M=(g,T,b,E)=>{f[(g*t+T)*6+E]|=1<<b},U=(g,T,b,E)=>(f[(g*t+T)*6+E]&1<<b)!==0,A=(g,T,b)=>S[g+1+(T+1)*w+(b+1)*G],N=(g,T)=>!(T===R.NONE||Be(g)||Be(T)||!ae(g)&&ae(T)),P=V.CUBE_VERTS;for(let g=0;g<e;g++)for(let T=0;T<t;T++)for(let b=0;b<r;b++){const E=A(g,T,b);if(E===R.NONE)continue;if(ae(E)){v.push({x:g,y:T,z:b}),x=!0;continue}if(Be(E)){for(let H=0;H<6;H++)p[m++]=g+.5,p[m++]=T+.5,p[m++]=b+.5,p[m++]=6,p[m++]=E;continue}const z=nt(E),D=N(E,A(g,T,b-1))||U(g,T,b,0),O=N(E,A(g,T,b+1))||U(g,T,b,1),X=N(E,A(g-1,T,b))||U(g,T,b,2),ue=N(E,A(g+1,T,b))||U(g,T,b,3),de=N(E,A(g,T-1,b))||U(g,T,b,4),Q=N(E,A(g,T+1,b))||U(g,T,b,5);if(D&&O&&X&&ue&&de&&Q)continue;let J=T;if(!D||!O||!X||!ue){let H=T;for(;H<t&&A(g,H,b)===E;){J=H;H++}}if(!D||!O){let H=g,Y=g,q=0;for(;Y<e&&A(Y,T,b)===E;){let F=T;for(;F<=J&&A(Y,F,b)===E;){q=F;F++}if(q===J)H=Y,Y++;else break}for(let F=g;F<=H;F++)for(let ee=T;ee<=J;ee++)D||M(F,ee,b,0),O||M(F,ee,b,1);let j,ne;!D&&!O?(j=0,ne=12):D?(j=6,ne=12):(j=0,ne=6);const he=H+1-g,ge=J+1-T,fe=z?u:s;let se=z?_:h;for(let F=j;F<ne;F++){const ee=P[F*3],ie=P[F*3+1],be=P[F*3+2];fe[se++]=g+.5*(he-1)+.5+ee*he,fe[se++]=T+.5*(ge-1)+.5+ie*ge,fe[se++]=b+.5+be,fe[se++]=F<6?0:1,fe[se++]=E}z?_=se:h=se}if(!X||!ue){let H=b,Y=b,q=0;for(;Y<r&&A(g,T,Y)===E;){let F=T;for(;F<=J&&A(g,F,Y)===E;){q=F;F++}if(q===J)H=Y,Y++;else break}for(let F=b;F<=H;F++)for(let ee=T;ee<=J;ee++)X||M(g,ee,F,2),ue||M(g,ee,F,3);let j,ne;!X&&!ue?(j=12,ne=24):X?(j=18,ne=24):(j=12,ne=18);const he=H+1-b,ge=J+1-T,fe=z?u:s;let se=z?_:h;for(let F=j;F<ne;F++){const ee=P[F*3],ie=P[F*3+1],be=P[F*3+2];fe[se++]=g+.5+ee,fe[se++]=T+.5*(ge-1)+.5+ie*ge,fe[se++]=b+.5*(he-1)+.5+be*he,fe[se++]=F<18?2:3,fe[se++]=E}z?_=se:h=se}if(!de||!Q){let H=g,Y=g;for(;Y<e&&A(Y,T,b)===E;){H=Y;Y++}let q=b,j=b,ne=0;for(;j<r&&A(g,T,j)===E;){let ie=g;for(;ie<=H&&A(ie,T,j)===E;){ne=ie;ie++}if(ne===H)q=j,j++;else break}for(let ie=g;ie<=H;ie++)for(let be=b;be<=q;be++)de||M(ie,T,be,4),Q||M(ie,T,be,5);let he,ge;!de&&!Q?(he=24,ge=36):de?(he=30,ge=36):(he=24,ge=30);const fe=H+1-g,se=q+1-b,F=z?u:s;let ee=z?_:h;for(let ie=he;ie<ge;ie++){const be=P[ie*3],Z=P[ie*3+1],le=P[ie*3+2];F[ee++]=g+.5*(fe-1)+.5+be*fe,F[ee++]=T+.5+Z,F[ee++]=b+.5*(se-1)+.5+le*se,F[ee++]=ie<30?4:5,F[ee++]=E}z?_=ee:h=ee}}let y=null,C=0;if(x){y=new Float32Array(v.length*6*6*3);let g=0;for(const T of v){const{x:b,y:E,z:k}=T,z=b+1,D=E+1,O=k+1,X=S[z+(D+1)*w+O*G];ae(X)||(y[g++]=b,y[g++]=E+1,y[g++]=k,y[g++]=b+1,y[g++]=E+1,y[g++]=k,y[g++]=b+1,y[g++]=E+1,y[g++]=k+1,y[g++]=b,y[g++]=E+1,y[g++]=k,y[g++]=b,y[g++]=E+1,y[g++]=k+1,y[g++]=b+1,y[g++]=E+1,y[g++]=k+1);const ue=S[z+D*w+(O+1)*G];ae(ue)||(y[g++]=b,y[g++]=E,y[g++]=k+1,y[g++]=b+1,y[g++]=E,y[g++]=k+1,y[g++]=b+1,y[g++]=E+1,y[g++]=k+1,y[g++]=b,y[g++]=E,y[g++]=k+1,y[g++]=b,y[g++]=E+1,y[g++]=k+1,y[g++]=b+1,y[g++]=E+1,y[g++]=k+1);const de=S[z+D*w+(O-1)*G];ae(de)||(y[g++]=b+1,y[g++]=E,y[g++]=k,y[g++]=b,y[g++]=E,y[g++]=k,y[g++]=b,y[g++]=E+1,y[g++]=k,y[g++]=b+1,y[g++]=E,y[g++]=k,y[g++]=b+1,y[g++]=E+1,y[g++]=k,y[g++]=b,y[g++]=E+1,y[g++]=k);const Q=S[z+1+D*w+O*G];ae(Q)||(y[g++]=b+1,y[g++]=E,y[g++]=k,y[g++]=b+1,y[g++]=E+1,y[g++]=k,y[g++]=b+1,y[g++]=E+1,y[g++]=k+1,y[g++]=b+1,y[g++]=E,y[g++]=k,y[g++]=b+1,y[g++]=E,y[g++]=k+1,y[g++]=b+1,y[g++]=E+1,y[g++]=k+1);const J=S[z-1+D*w+O*G];ae(J)||(y[g++]=b,y[g++]=E,y[g++]=k+1,y[g++]=b,y[g++]=E+1,y[g++]=k+1,y[g++]=b,y[g++]=E+1,y[g++]=k,y[g++]=b,y[g++]=E,y[g++]=k+1,y[g++]=b,y[g++]=E,y[g++]=k,y[g++]=b,y[g++]=E+1,y[g++]=k);const H=S[z+(D-1)*w+O*G];ae(H)||(y[g++]=b,y[g++]=E,y[g++]=k+1,y[g++]=b+1,y[g++]=E,y[g++]=k+1,y[g++]=b+1,y[g++]=E,y[g++]=k,y[g++]=b,y[g++]=E,y[g++]=k+1,y[g++]=b,y[g++]=E,y[g++]=k,y[g++]=b+1,y[g++]=E,y[g++]=k)}C=g/3,y=y.subarray(0,g)}return{opaque:s.subarray(0,h),opaqueCount:h/o,transparent:u.subarray(0,_),transparentCount:_/o,water:y||new Float32Array(0),waterCount:C,prop:p.subarray(0,m),propCount:m/o}}generateBlocks(n,e){const t=V.CHUNK_WIDTH,r=V.CHUNK_HEIGHT,o=V.CHUNK_DEPTH,i=new Float64Array(t*o),a=new Float64Array(t*o),l=new Float32Array(t*o),s=new Uint8Array(t*o),u=new Uint8Array(t*o),p=new Float32Array(t*o);for(let f=0;f<o;f++)for(let h=0;h<t;h++){const _=h+this.globalPosition.x,m=f+this.globalPosition.z,x=h+f*t,v=ye(_/512,-5,m/512,0,0,0,n+31337),w=ye(_/2048,10,m/2048,0,0,0,n);i[x]=Math.abs(ye(_/1024,0,m/1024,0,0,0,n)*450)*Math.max(.1,(w+1)*.5),a[x]=bn(_/256,15,m/256,2,.6,1.2,6)*12,l[x]=e?e(_,m):0;const B=zo(v);s[x]=B.biome1,u[x]=B.biome2,p[x]=B.blend}for(let f=0;f<o;f++)for(let h=0;h<r;h++)for(let _=0;_<t;_++){if(this.getBlock(_,h,f)!==R.NONE)continue;const m=_+f*t,x=_+this.globalPosition.x,v=h+this.globalPosition.y,w=f+this.globalPosition.z,B=Math.abs(ye(x/256,v/512,w/256,0,0,0,n)*i[m])+a[m]+l[m];v<B?V._isCave(x,v,w,n,B-v)?v<V.SEA_LEVEL+1?this.setBlock(_,h,f,R.WATER):this.setBlock(_,h,f,R.NONE):this.setBlock(_,h,f,this._generateBlockBasedOnBiome(s[m],u[m],p[m],x,v,w,B)):v<V.SEA_LEVEL+1&&this.setBlock(_,h,f,R.WATER)}for(let f=0;f<V.CHUNK_DEPTH;f++)for(let h=0;h<V.CHUNK_HEIGHT;h++)for(let _=0;_<V.CHUNK_WIDTH;_++){if(this.getBlock(_,h,f)===R.NONE)continue;const m=_+this.globalPosition.x,x=h+this.globalPosition.y,v=f+this.globalPosition.z;this._generateAdditionalBlocks(_,h,f,m,x,v,n)}}setBlock(n,e,t,r){if(n<0||n>=V.CHUNK_WIDTH||e<0||e>=V.CHUNK_HEIGHT||t<0||t>=V.CHUNK_DEPTH)return;const o=n+e*V.CHUNK_WIDTH+t*V.CHUNK_WIDTH*V.CHUNK_HEIGHT,i=this.blocks[o];i!==R.NONE&&(this.aliveBlocks--,ae(i)?this.waterBlocks--:nt(i)?this.transparentBlocks--:this.opaqueBlocks--,Rr(i)&&this.lightBlocks--),this.blocks[o]=r,r!==R.NONE&&(this.aliveBlocks++,ae(r)?this.waterBlocks++:nt(r)?this.transparentBlocks++:this.opaqueBlocks++,Rr(r)&&this.lightBlocks++)}getBlock(n,e,t){if(n<0||n>=V.CHUNK_WIDTH||e<0||e>=V.CHUNK_HEIGHT||t<0||t>=V.CHUNK_DEPTH)return R.NONE;const r=n+e*V.CHUNK_WIDTH+t*V.CHUNK_WIDTH*V.CHUNK_HEIGHT;return this.blocks[r]}getBlockIndex(n,e,t){return n<0||n>=V.CHUNK_WIDTH||e<0||e>=V.CHUNK_HEIGHT||t<0||t>=V.CHUNK_DEPTH?-1:n+e*V.CHUNK_WIDTH+t*V.CHUNK_WIDTH*V.CHUNK_HEIGHT}_generateAdditionalBlocks(n,e,t,r,o,i,a){const l=this.getBlock(n,e,t),s=this.getBlock(n-1,e,t),u=this.getBlock(n+1,e,t),p=this.getBlock(n,e,t+1),f=this.getBlock(n,e,t-1),h=this.getBlock(n,e+1,t);if(l==R.SAND)if(o>0&&ve.global.randomUint32()%512==0){const _=ve.global.randomUint32()%5;for(let m=0;m<_;m++)this.setBlock(n,e+m,t,R.CACTUS)}else ve.global.randomUint32()%128==0&&this.setBlock(n,e+1,t,R.DEAD_BUSH);else if(l==R.SNOW||l==R.GRASS_SNOW){if(ve.global.randomUint32()%16==0&&o>12&&(h==R.NONE||ae(h))&&(s==R.NONE||f==R.NONE))this.setBlock(n,e+1,t,R.DEAD_BUSH);else if(ve.global.randomUint32()%16==0&&o>12&&o<300&&e<V.CHUNK_HEIGHT-5&&n>2&&t>2&&n<V.CHUNK_WIDTH-2&&t<V.CHUNK_DEPTH-2&&h==R.NONE&&u==R.NONE&&p==R.NONE&&f==R.NONE){const m=Math.max(ve.global.randomUint32()%5,5);for(let x=0;x<m;x++)this.setBlock(n,e+x,t,R.TRUNK);for(let x=-2;x<=2;x++){const v=x<-1||x>1?0:-1,w=x<-1||x>1?0:1;for(let B=-1+v;B<=1+w;B++){const G=Math.abs(B-n);for(let S=-1+v;S<=1+w;S++){const M=Math.abs(S-t),U=B*B+x*x+S*S,A=this.getBlock(n+B,e+m+x,t+S);U+2<ve.global.randomUint32()%24&&G!=2-v&&G!=2+w&&M!=2-v&&M!=2+w&&(A==R.NONE||A==R.SNOWYLEAVES)&&this.setBlock(n+B,e+m+x,t+S,R.SNOWYLEAVES)}}}}}else if(l==R.GRASS||l==R.DIRT)if(ve.global.randomUint32()%2==0&&o>5&&o<300&&e<V.CHUNK_HEIGHT-5&&n>2&&t>2&&n<V.CHUNK_WIDTH-2&&t<V.CHUNK_DEPTH-2&&h==R.NONE&&u==R.NONE&&p==R.NONE&&f==R.NONE){const m=Math.max(ve.global.randomUint32()%5,5);for(let x=0;x<m;x++)this.setBlock(n,e+x,t,R.TRUNK);for(let x=-2;x<=2;x++){const v=x<-1||x>1?0:-1,w=x<-1||x>1?0:1;for(let B=-1+v;B<=1+w;B++){const G=Math.abs(B-n);for(let S=-1+v;S<=1+w;S++){const M=Math.abs(S-t),U=B*B+x*x+S*S,A=this.getBlock(n+B,e+m+x,t+S);U+2<ve.global.randomUint32()%24&&G!=2-v&&G!=2+w&&M!=2-v&&M!=2+w&&(A==R.NONE||A==R.TREELEAVES)&&this.setBlock(n+B,e+m+x,t+S,R.TREELEAVES)}}}}else o>5&&h==R.NONE&&(s==R.NONE||f==R.NONE)&&(ve.global.randomUint32()%8==0?this.setBlock(n,e+1,t,R.GRASS_PROP):ve.global.randomUint32()%8==0&&this.setBlock(n,e+1,t,R.FLOWER))}_generateBlockBasedOnBiome(n,e,t,r,o,i,a){const l=t>0&&n!==e&&Fo(r,i)<t?e:n,s=Math.floor(a)-o,u=a<V.SEA_LEVEL+1;switch(l){case xe.GrassyPlains:return s===0?u?R.DIRT:R.GRASS:s<=3?R.DIRT:R.STONE;case xe.Desert:return s<=3?R.SAND:R.STONE;case xe.SnowyPlains:return s===0?R.GRASS_SNOW:s<=2?R.SNOW:R.STONE;case xe.SnowyMountains:{const p=Math.abs(Cr(r/256,o/256,i/256,2,.6,1))*35;return s===0?R.GRASS_SNOW:s<=4||p>20?R.SNOW:R.STONE}case xe.RockyMountains:return s===0&&Math.abs(Cr(r/64,o/64,i/64,2,.6,1))<.12?R.SNOW:R.STONE;default:return R.GRASS}}static _determineBiomeFromNoise(n){return n>.35?xe.Desert:n>-.15?xe.GrassyPlains:n>-.3?xe.SnowyPlains:n>-.5?xe.SnowyMountains:xe.RockyMountains}static _determineBiome(n,e,t,r){const o=ye(n/512,-5,t/512,0,0,0,r+31337);return V._determineBiomeFromNoise(o)}static _isCave(n,e,t,r,o){if(o<3)return!1;if(ye(n/60,e/60,t/60,0,0,0,r+777)>.6)return!0;const a=ye(n/24,e/24,t/24,0,0,0,r+13579),l=ye(n/24,e/14,t/24,0,0,0,r+24680);if(Math.abs(a)<.12&&Math.abs(l)<.12)return!0;const s=ye(n/28,e/18,t/28,0,0,0,r+55555),u=ye(n/28,e/28,t/28,0,0,0,r+99999);return Math.abs(s)<.1&&Math.abs(u)<.1}};c(V,"CHUNK_WIDTH",16),c(V,"CHUNK_HEIGHT",16),c(V,"CHUNK_DEPTH",16),c(V,"SEA_LEVEL",15),c(V,"CUBE_VERTS",new Float32Array([-.5,-.5,-.5,.5,.5,-.5,.5,-.5,-.5,.5,.5,-.5,-.5,-.5,-.5,-.5,.5,-.5,-.5,-.5,.5,.5,-.5,.5,.5,.5,.5,.5,.5,.5,-.5,.5,.5,-.5,-.5,.5,-.5,.5,.5,-.5,.5,-.5,-.5,-.5,-.5,-.5,-.5,-.5,-.5,-.5,.5,-.5,.5,.5,.5,.5,.5,.5,-.5,-.5,.5,.5,-.5,.5,-.5,-.5,.5,.5,.5,.5,-.5,.5,-.5,-.5,-.5,.5,-.5,-.5,.5,-.5,.5,.5,-.5,.5,-.5,-.5,.5,-.5,-.5,-.5,-.5,.5,-.5,.5,.5,.5,.5,.5,-.5,.5,.5,.5,-.5,.5,-.5,-.5,.5,.5]));let re=V;const An=128;function Ho(d,n,e){const t=ye(d/2048,10,n/2048,0,0,0,e),r=Math.abs(ye(d/1024,0,n/1024,0,0,0,e)*450)*Math.max(.1,(t+1)*.5),o=bn(d/256,15,n/256,2,.6,1.2,6)*12;return Math.abs(ye(d/256,0,n/256,0,0,0,e)*r)+o}function hn(d,n,e,t){const r=e|0,o=t|0,i=e-r,a=t-o,l=d[r+o*n],s=d[r+1+o*n],u=d[r+(o+1)*n],p=d[r+1+(o+1)*n];return[(s-l)*(1-a)+(p-u)*a,(u-l)*(1-i)+(p-s)*i,l*(1-i)*(1-a)+s*i*(1-a)+u*(1-i)*a+p*i*a]}function mn(d){return Math.imul(d,1664525)+1013904223>>>0}function Wo(d,n,e){const t=n*n>>2,r=.05,o=4,i=.01,a=.4,l=.3,s=.01,u=4,p=20,f=2,h=f*2+1,_=new Float32Array(h*h);let m=0;for(let w=-f;w<=f;w++)for(let B=-f;B<=f;B++){const G=Math.sqrt(B*B+w*w);if(G<f){const S=1-G/f;_[B+f+(w+f)*h]=S,m+=S}}for(let w=0;w<_.length;w++)_[w]/=m;const x=n-2;let v=(e^3735928559)>>>0;for(let w=0;w<t;w++){v=mn(v);let B=v/4294967295*x;v=mn(v);let G=v/4294967295*x,S=0,M=0,U=1,A=1,N=0;for(let P=0;P<p;P++){const y=B|0,C=G|0;if(y<0||y>=x||C<0||C>=x)break;const g=B-y,T=G-C,[b,E,k]=hn(d,n,B,G);S=S*r-b*(1-r),M=M*r-E*(1-r);const z=Math.sqrt(S*S+M*M);if(z<1e-6)break;S/=z,M/=z;const D=B+S,O=G+M;if(D<0||D>=x||O<0||O>=x)break;const[,,X]=hn(d,n,D,O),ue=X-k,de=Math.max(-ue*U*A*o,i);if(N>de||ue>0){const Q=ue>0?Math.min(ue,N):(N-de)*l;N-=Q,d[y+C*n]+=Q*(1-g)*(1-T),d[y+1+C*n]+=Q*g*(1-T),d[y+(C+1)*n]+=Q*(1-g)*T,d[y+1+(C+1)*n]+=Q*g*T}else{const Q=Math.min((de-N)*a,-ue);for(let J=-f;J<=f;J++)for(let H=-f;H<=f;H++){const Y=y+H,q=C+J;Y<0||Y>=n||q<0||q>=n||(d[Y+q*n]-=_[H+f+(J+f)*h]*Q)}N+=Q}U=Math.sqrt(Math.max(U*U+ue*u,0)),A*=1-s,B=D,G=O}}}function qo(d,n,e){const t=An,r=d*t,o=n*t,i=new Float32Array(t*t);for(let p=0;p<t;p++)for(let f=0;f<t;f++)i[f+p*t]=Ho(r+f,o+p,e);const a=new Float32Array(i),l=(e^(Math.imul(d,73856093)^Math.imul(n,19349663)))>>>0;Wo(a,t,l);const s=12,u=new Float32Array(t*t);for(let p=0;p<t;p++)for(let f=0;f<t;f++){const h=f+p*t,_=Math.min(f,t-1-f,p,t-1-p),m=Math.min(_/s,1);u[h]=(a[h]-i[h])*m}return u}const ce=class ce{constructor(n){c(this,"seed");c(this,"renderDistanceH",8);c(this,"renderDistanceV",4);c(this,"chunksPerFrame",2);c(this,"time",0);c(this,"waterSimulationRadius",32);c(this,"waterTickInterval",.25);c(this,"_waterTickTimer",0);c(this,"onChunkAdded");c(this,"onChunkUpdated");c(this,"onChunkRemoved");c(this,"_chunks",new Map);c(this,"_generated",new Set);c(this,"_erosionCache",new Map);c(this,"pendingChunks",0);this.seed=n}get chunkCount(){return this._chunks.size}get chunks(){return this._chunks.values()}getBiomeAt(n,e,t){return re._determineBiome(n,e,t,this.seed)}static normalizeChunkPosition(n,e,t){return[Math.floor(n/re.CHUNK_WIDTH),Math.floor(e/re.CHUNK_HEIGHT),Math.floor(t/re.CHUNK_DEPTH)]}static _key(n,e,t){return`${n},${e},${t}`}getChunk(n,e,t){const[r,o,i]=ce.normalizeChunkPosition(n,e,t);return this._chunks.get(ce._key(r,o,i))}chunkExists(n,e,t){return this.getChunk(n,e,t)!==void 0}getBlockType(n,e,t){const r=this.getChunk(n,e,t);if(!r)return R.NONE;const o=Math.round(n)-r.globalPosition.x,i=Math.round(e)-r.globalPosition.y,a=Math.round(t)-r.globalPosition.z;return r.getBlock(o,i,a)}setBlockType(n,e,t,r){let o=this.getChunk(n,e,t);if(!o){const[s,u,p]=ce.normalizeChunkPosition(n,e,t);o=new re(s*re.CHUNK_WIDTH,u*re.CHUNK_HEIGHT,p*re.CHUNK_DEPTH),this._insertChunk(o)}const i=Math.round(n)-o.globalPosition.x,a=Math.round(e)-o.globalPosition.y,l=Math.round(t)-o.globalPosition.z;return o.setBlock(i,a,l,r),this._updateChunk(o,i,a,l),!0}getTopBlockY(n,e,t){const r=re.CHUNK_HEIGHT,o=Math.floor(n),i=Math.floor(e);for(let a=Math.floor(t/r);a>=0;a--){const l=this.getChunk(o,a*r,i);if(!l)continue;const s=o-l.globalPosition.x,u=i-l.globalPosition.z;for(let p=r-1;p>=0;p--){const f=l.getBlock(s,p,u);if(f!==R.NONE&&!Be(f))return l.globalPosition.y+p+1}}return 0}getBlockByRay(n,e,t){const r=Number.MAX_VALUE;let o=Math.floor(n.x),i=Math.floor(n.y),a=Math.floor(n.z);const l=1/e.x,s=1/e.y,u=1/e.z,p=e.x>0?1:-1,f=e.y>0?1:-1,h=e.z>0?1:-1,_=Math.min(l*p,r),m=Math.min(s*f,r),x=Math.min(u*h,r);let v=Math.abs((o+Math.max(p,0)-n.x)*l),w=Math.abs((i+Math.max(f,0)-n.y)*s),B=Math.abs((a+Math.max(h,0)-n.z)*u),G=0,S=0,M=0;for(let U=0;U<t;U++){if(U>0){const A=this.getChunk(o,i,a);if(A){const N=o-A.globalPosition.x,P=i-A.globalPosition.y,y=a-A.globalPosition.z,C=A.getBlock(N,P,y);if(C!==R.NONE&&!ae(C))return{blockType:C,position:new I(o,i,a),face:new I(-G*p,-S*f,-M*h),chunk:A,relativePosition:new I(N,P,y)}}}G=(v<=B?1:0)*(v<=w?1:0),S=(w<=v?1:0)*(w<=B?1:0),M=(B<=w?1:0)*(B<=v?1:0),v+=_*G,w+=m*S,B+=x*M,o+=p*G,i+=f*S,a+=h*M}return null}addBlock(n,e,t,r,o,i,a){if(a===R.NONE||!this.getChunk(n,e,t))return!1;const s=this.getBlockType(n,e,t);if(Be(s))return!1;const u=n+r,p=e+o,f=t+i,h=this.getBlockType(u,p,f);if(ae(a)){if(h!==R.NONE&&!ae(h))return!1}else if(h!==R.NONE&&!ae(h))return!1;let _=this.getChunk(u,p,f);if(!_){const[w,B,G]=ce.normalizeChunkPosition(u,p,f);_=new re(w*re.CHUNK_WIDTH,B*re.CHUNK_HEIGHT,G*re.CHUNK_DEPTH),this._insertChunk(_)}const m=u-_.globalPosition.x,x=p-_.globalPosition.y,v=f-_.globalPosition.z;return _.setBlock(m,x,v,a),this._updateChunk(_,m,x,v),!0}mineBlock(n,e,t){const r=this.getChunk(n,e,t);if(!r)return!1;const o=n-r.globalPosition.x,i=e-r.globalPosition.y,a=t-r.globalPosition.z,l=r.getBlock(o,i,a);return l===R.NONE?!1:ae(l)?(r.setBlock(o,i,a,R.NONE),this._updateChunk(r,o,i,a),!0):(r.setBlock(o,i,a,R.NONE),this._updateChunk(r,o,i,a),!0)}update(n,e){this.time+=e,this._removeDistantChunks(n),this._createNearbyChunks(n),this._waterTickTimer+=e,this._waterTickTimer>=this.waterTickInterval&&(this._waterTickTimer=0,this._updateWaterFlow(n))}deleteChunk(n){var i;const[e,t,r]=ce.normalizeChunkPosition(n.globalPosition.x,n.globalPosition.y,n.globalPosition.z),o=ce._key(e,t,r);this._chunks.delete(o),this._generated.delete(o),n.isDeleted=!0,(i=this.onChunkRemoved)==null||i.call(this,n)}calcWaterLevel(n,e,t){const r=this.getChunk(n,e,t);if(!r||r.waterBlocks<=0)return 0;let o=this._calcWaterLevelInChunk(r,e);for(let i=1;i<=4;i++){const a=this.getChunk(n,e+i*re.CHUNK_HEIGHT,t);if(!a)break;const[l,,s]=ce.normalizeChunkPosition(n,e,t),u=l*re.CHUNK_WIDTH-a.globalPosition.x,p=s*re.CHUNK_DEPTH-a.globalPosition.z;if(a.waterBlocks>0&&ae(a.getBlock(u,0,p)))o+=this._calcWaterLevelInChunk(a,e);else break}return o}_calcWaterLevelInChunk(n,e){const t=n.globalPosition.y,r=re.CHUNK_HEIGHT;let o=0;return e<=t+r*.8&&o++,e<=t+r*.7&&o++,e<=t+r*.6&&o++,e<=t+r*.5&&o++,o}_getErosionRegion(n,e){const t=`${n},${e}`;let r=this._erosionCache.get(t);return r||(r=qo(n,e,this.seed),this._erosionCache.set(t,r)),r}getErosionDisplacement(n,e){const t=An,r=Math.floor(n/t),o=Math.floor(e/t),i=(n%t+t)%t,a=(e%t+t)%t;return this._getErosionRegion(r,o)[i+a*t]}_insertChunk(n){const[e,t,r]=ce.normalizeChunkPosition(n.globalPosition.x,n.globalPosition.y,n.globalPosition.z);this._chunks.set(ce._key(e,t,r),n),n.isDeleted=!1}_gatherNeighbors(n,e,t){const r=(o,i,a)=>{var l;return(l=this._chunks.get(ce._key(n+o,e+i,t+a)))==null?void 0:l.blocks};return{negX:r(-1,0,0),posX:r(1,0,0),negY:r(0,-1,0),posY:r(0,1,0),negZ:r(0,0,-1),posZ:r(0,0,1)}}_remeshSingleNeighbor(n,e,t){var o;const r=this._chunks.get(ce._key(n,e,t));r&&((o=this.onChunkUpdated)==null||o.call(this,r,r.generateVertices(this._gatherNeighbors(n,e,t))))}_updateChunk(n,e,t,r){var p;const[o,i,a]=ce.normalizeChunkPosition(n.globalPosition.x,n.globalPosition.y,n.globalPosition.z);if((p=this.onChunkUpdated)==null||p.call(this,n,n.generateVertices(this._gatherNeighbors(o,i,a))),e===void 0)return;const l=re.CHUNK_WIDTH,s=re.CHUNK_HEIGHT,u=re.CHUNK_DEPTH;e===0&&this._remeshSingleNeighbor(o-1,i,a),e===l-1&&this._remeshSingleNeighbor(o+1,i,a),t===0&&this._remeshSingleNeighbor(o,i-1,a),t===s-1&&this._remeshSingleNeighbor(o,i+1,a),r===0&&this._remeshSingleNeighbor(o,i,a-1),r===u-1&&this._remeshSingleNeighbor(o,i,a+1)}_createNearbyChunks(n){const[e,t,r]=ce.normalizeChunkPosition(n.x,n.y,n.z),o=this.renderDistanceH,i=this.renderDistanceV,a=[];for(let s=-o;s<=o;s++)for(let u=-o;u<=o;u++)if(!(s*s+u*u>o*o))for(let p=-i;p<=i;p++){const f=e+s,h=t+p,_=r+u,m=ce._key(f,h,_);this._generated.has(m)||a.push([s*s+p*p+u*u,f,h,_])}if(a.sort((s,u)=>s[0]-u[0]),this.pendingChunks=a.length,this._chunks.size>=ce.MAX_CHUNKS)return;let l=0;for(const[,s,u,p]of a){if(l>=this.chunksPerFrame||this._chunks.size>=ce.MAX_CHUNKS)break;this._createChunkAt(s,u,p),l++}}_removeDistantChunks(n){const[e,t,r]=ce.normalizeChunkPosition(n.x,n.y,n.z),o=this.renderDistanceH+1,i=this.renderDistanceV+1,a=[];for(const l of this._chunks.values()){const[s,u,p]=ce.normalizeChunkPosition(l.globalPosition.x,l.globalPosition.y,l.globalPosition.z),f=s-e,h=u-t,_=p-r;(f*f+_*_>o*o||Math.abs(h)>i)&&a.push(l)}for(const l of a)this.deleteChunk(l)}_createChunkAt(n,e,t){var i;const r=ce._key(n,e,t);this._generated.add(r);const o=new re(n*re.CHUNK_WIDTH,e*re.CHUNK_HEIGHT,t*re.CHUNK_DEPTH);if(o.generateBlocks(this.seed,(a,l)=>this.getErosionDisplacement(a,l)),o.aliveBlocks>0){this._insertChunk(o),(i=this.onChunkAdded)==null||i.call(this,o,o.generateVertices(this._gatherNeighbors(n,e,t)));for(const[a,l,s]of[[-1,0,0],[1,0,0],[0,-1,0],[0,1,0],[0,0,-1],[0,0,1]])this._remeshSingleNeighbor(n+a,e+l,t+s)}}_updateWaterFlow(n){const e=this.waterSimulationRadius,t=Math.floor(n.x-e),r=Math.floor(n.x+e),o=Math.floor(Math.max(0,n.y-e)),i=Math.floor(n.y+e),a=Math.floor(n.z-e),l=Math.floor(n.z+e),s=[];for(let u=t;u<=r;u++)for(let p=o;p<=i;p++)for(let f=a;f<=l;f++){const h=this.getBlockType(u,p,f);ae(h)&&s.push({x:u,y:p,z:f})}for(const{x:u,y:p,z:f}of s)this._flowWater(u,p,f)}_flowWater(n,e,t){const r=this.getBlockType(n,e-1,t);if(r===R.NONE||Be(r)){this.setBlockType(n,e-1,t,R.WATER),this.setBlockType(n,e,t,R.NONE);return}let o=!1;for(let i=1;i<=4;i++){const a=this.getBlockType(n,e-i,t);if(a!==R.NONE&&!ae(a)&&!Be(a)){o=!0;break}if(a===R.NONE||Be(a))break}if(!o){const i=[{x:n+1,y:e,z:t},{x:n-1,y:e,z:t},{x:n,y:e,z:t+1},{x:n,y:e,z:t-1}];for(const a of i){const l=this.getBlockType(a.x,a.y,a.z);if(l===R.NONE||Be(l)){this.setBlockType(a.x,a.y,a.z,R.WATER),this.setBlockType(n,e,t,R.NONE);return}}}if(o){const i=[{x:n+1,y:e,z:t},{x:n-1,y:e,z:t},{x:n,y:e,z:t+1},{x:n,y:e,z:t-1}];for(const a of i){const l=this.getBlockType(a.x,a.y,a.z);if(l===R.NONE||Be(l)){this.setBlockType(a.x,a.y,a.z,R.WATER);return}}}}};c(ce,"MAX_CHUNKS",2048);let Dt=ce;function bt(d,n,e,t,r,o,i,a){const l=[{n:[0,0,-1],t:[-1,0,0,1],v:[[-o,-i,-a],[o,-i,-a],[o,i,-a],[-o,i,-a]]},{n:[0,0,1],t:[1,0,0,1],v:[[o,-i,a],[-o,-i,a],[-o,i,a],[o,i,a]]},{n:[-1,0,0],t:[0,0,-1,1],v:[[-o,-i,a],[-o,-i,-a],[-o,i,-a],[-o,i,a]]},{n:[1,0,0],t:[0,0,1,1],v:[[o,-i,-a],[o,-i,a],[o,i,a],[o,i,-a]]},{n:[0,1,0],t:[1,0,0,1],v:[[-o,i,-a],[o,i,-a],[o,i,a],[-o,i,a]]},{n:[0,-1,0],t:[1,0,0,1],v:[[-o,-i,a],[o,-i,a],[o,-i,-a],[-o,-i,-a]]}],s=[[0,1],[1,1],[1,0],[0,0]];for(const u of l){const p=d.length/12;for(let f=0;f<4;f++){const[h,_,m]=u.v[f];d.push(e+h,t+_,r+m,u.n[0],u.n[1],u.n[2],s[f][0],s[f][1],u.t[0],u.t[1],u.t[2],u.t[3])}n.push(p,p+2,p+1,p,p+3,p+2)}}function jo(d){const n=[],e=[];return bt(n,e,0,0,0,.19,.11,.225),bt(n,e,0,.07,.225,.075,.06,.06),Me.fromData(d,new Float32Array(n),new Uint32Array(e))}function Yo(d){const n=[],e=[];return bt(n,e,0,0,0,.085,.085,.075),Me.fromData(d,new Float32Array(n),new Uint32Array(e))}function Xo(d){const n=[],e=[];return bt(n,e,0,0,0,.065,.03,.055),Me.fromData(d,new Float32Array(n),new Uint32Array(e))}const Ko=new I(0,1,0),xt=class xt extends je{constructor(e){super();c(this,"_world");c(this,"_state","idle");c(this,"_timer",0);c(this,"_targetX",0);c(this,"_targetZ",0);c(this,"_hasTarget",!1);c(this,"_velY",0);c(this,"_yaw",0);c(this,"_headGO",null);c(this,"_headBaseY",0);c(this,"_bobPhase");this._world=e,this._timer=1+Math.random()*4,this._yaw=Math.random()*Math.PI*2,this._bobPhase=Math.random()*Math.PI*2}onAttach(){for(const e of this.gameObject.children)if(e.name==="Duck.Head"){this._headGO=e,this._headBaseY=e.position.y;break}}update(e){const t=this.gameObject,r=t.position.x,o=t.position.z,i=xt.playerPos,a=i.x-r,l=i.z-o,s=a*a+l*l;this._velY-=9.8*e,t.position.y+=this._velY*e;const u=this._world.getTopBlockY(Math.floor(r),Math.floor(o),Math.ceil(t.position.y)+4);if(u>0&&t.position.y<=u+.1){const p=this._world.getBlockType(Math.floor(r),Math.floor(u-1),Math.floor(o));R.WATER,t.position.y=u,this._velY=0}switch(this._state){case"idle":{this._timer-=e,s<36?this._enterFlee():this._timer<=0&&this._pickWanderTarget();break}case"wander":{if(this._timer-=e,s<36){this._enterFlee();break}if(!this._hasTarget||this._timer<=0){this._enterIdle();break}const p=this._targetX-r,f=this._targetZ-o,h=p*p+f*f;if(h<.25){this._enterIdle();break}const _=Math.sqrt(h),m=p/_,x=f/_;t.position.x+=m*1.5*e,t.position.z+=x*1.5*e,this._yaw=Math.atan2(-m,-x);break}case"flee":{if(s>196){this._enterIdle();break}const p=Math.sqrt(s),f=p>0?-a/p:0,h=p>0?-l/p:0;t.position.x+=f*4*e,t.position.z+=h*4*e,this._yaw=Math.atan2(-f,-h);break}}if(t.rotation=me.fromAxisAngle(Ko,this._yaw),this._headGO){this._bobPhase+=e*(this._state==="wander"?6:2);const p=this._state==="wander"?.018:.008;this._headGO.position.y=this._headBaseY+Math.sin(this._bobPhase)*p}}_enterIdle(){this._state="idle",this._hasTarget=!1,this._timer=2+Math.random()*5}_enterFlee(){this._state="flee",this._hasTarget=!1}_pickWanderTarget(){const e=this.gameObject,t=Math.random()*Math.PI*2,r=3+Math.random()*8;this._targetX=e.position.x+Math.cos(t)*r,this._targetZ=e.position.z+Math.sin(t)*r,this._hasTarget=!0,this._state="wander",this._timer=6+Math.random()*6}};c(xt,"playerPos",new I(0,0,0));let qe=xt;const _n=""+new URL("hotbar-DkVq2FsR.png",import.meta.url).href,ht=[R.DIRT,R.IRON,R.STONE,R.SAND,R.TRUNK,R.SPRUCE_PLANKS,R.GLASS,R.TORCH,R.WATER];function $o(d){const n=ht.length;let e=0;const t=document.createElement("div");t.style.cssText=["position:fixed","bottom:12px","left:50%","transform:translateX(-50%)","display:flex","flex-direction:row","flex-wrap:nowrap","align-items:center","gap:0px","background:url("+_n+") no-repeat","background-position:-48px 0px","background-size:414px 48px","width:364px","height:44px","padding:1px 2px","image-rendering:pixelated","box-sizing:border-box"].join(";");const r=[];for(let u=0;u<n;u++){const p=document.createElement("div");p.style.cssText=["width:40px","height:40px","display:flex","align-items:center","justify-content:center","position:relative","flex-shrink:0"].join(";");const f=document.createElement("canvas");f.width=f.height=32,f.style.cssText="width:32px;height:32px;image-rendering:pixelated;",p.appendChild(f);const h=document.createElement("span");h.textContent=String(u+1),h.style.cssText=["position:absolute","top:1px","left:3px","font-family:ui-monospace,monospace","font-size:9px","color:#ccc","text-shadow:0 0 2px #000","pointer-events:none"].join(";"),p.appendChild(h),t.appendChild(p),r.push(f)}document.body.appendChild(t);const o=document.createElement("div");o.style.cssText=["position:fixed","bottom:12px","width:44px","height:48px","background:url("+_n+") no-repeat","background-position:0px 0px","background-size:414px 48px","pointer-events:none","image-rendering:pixelated","transition:left 60ms linear"].join(";"),document.body.appendChild(o);let i=null;function a(){const u=t.getBoundingClientRect();o.style.left=u.left-2+e*40+"px",i==null||i()}const l=new Image;l.src=d;function s(){if(!l.complete)return;const u=16;for(let p=0;p<n;p++){const f=wt.find(_=>_.blockType===ht[p]),h=r[p].getContext("2d");h.clearRect(0,0,32,32),f&&(h.imageSmoothingEnabled=!1,h.drawImage(l,f.sideFace.x*u,f.sideFace.y*u,u,u,0,0,32,32))}}return l.onload=s,window.addEventListener("keydown",u=>{const p=parseInt(u.key);p>=1&&p<=n&&(e=p-1,a())}),window.addEventListener("wheel",u=>{e=(e+(u.deltaY>0?1:n-1))%n,a()},{passive:!0}),requestAnimationFrame(a),{getSelected:()=>ht[e],refresh:s,getSelectedSlot:()=>e,setSelectedSlot:u=>{e=u,a()},setOnSelectionChanged:u=>{i=u},slots:ht,element:t}}const Zo="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAACWCAYAAADwkd5lAAAD7ElEQVR4nO3dUU7bahSF0eOqgyIwDU/EkmcBUibicQRm5ftyE7UoacvOb+LEa0l9obD7P/VTKdKpAgAA+C7dX35//pZXALBWFzvxp4DM86wfAFvWdV3VhVZcCoh4AFBVlyNyLiCneLy/vy/7KgBWbbfbVdX5iPy4wXsAeAACAkBEQACICAgAEQEBIPLzK588DMPVf2Df9zVNkx07duxsfqflVqud/X7/z5/7pR/jHYah+r6/5m01jmM9PT3ZsWPHzuZ3pmmqj4+Pent7W83O54D4MV4AmhMQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAANDMfHQ6H3369vr7OLdixY8eOnXW95bjz+e/9o6qaP8fiywelrrW261t27Nixc6udlltLXST800EpFwnt2LFj50Y7LhICsEkCAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgGZOF6hcJLRjx46d5XbW9JbjjouEduzYsXMHOy23XCS0Y8eOnQ3tuEgIwCYJCAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQAJo5XaBykdCOHTt2lttZ01uOOy4S2rFjx84d7LTccpHQjh07dja04yIhAJskIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAGjmdIHKRUI7duzYWW5nTW857rhIaMeOHTt3sNNyy0VCO3bs2NnQjouEAGySgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBAaCZ0wUqFwnt2LFjZ7mdNb3luOMioR07duzcwU7LLRcJ7dixY2dDOy4SArBJAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBIBmTheoXCS0Y8eOneV21vSW485iFwkB2BYHpQBoTkAAiAgIAJGft34AyxmG4eqNvu9rmiY7duKdl5eXq3dYJwF5cH3fX/X14zjWNE127MQ7fhjncfkWFgARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkDEPZAH1vd9jeNox85Nd3hc3ZmPzfM8V1U5BAOwcbvdrqqquq6r+tQM38ICICIgAEQEBIDIuf9E77qumw+HQ+33+29/EADr8vz8XHXm/8wv/Quk+/8LANiwS/G4+MFfzM1fA8A9+VsnAAAAvsF/uG+b8sfhThMAAAAASUVORK5CYII=";function Qo(d,n,e,t,r,o){const x=[];for(let C=1;C<R.MAX;C++)C!==R.WATER&&x.push(C);const v=document.createElement("div");v.style.cssText="position:relative;display:inline-block;align-self:center;";const w=document.createElement("img");w.src=Zo,w.draggable=!1,w.style.cssText=[`width:${400*2}px`,`height:${150*2}px`,"display:block","image-rendering:pixelated","user-select:none"].join(";"),v.appendChild(w);const B=new Image;B.src=n;function G(C,g){const T=C.getContext("2d");if(T.clearRect(0,0,C.width,C.height),!g)return;const b=wt.find(E=>E.blockType===g);b&&(T.imageSmoothingEnabled=!1,T.drawImage(B,b.sideFace.x*16,b.sideFace.y*16,16,16,0,0,C.width,C.height))}let S=null,M=null;const U=[];function A(){U.forEach((C,g)=>{C.style.outline=g===r()?"2px solid #ff0":""})}function N(C,g,T){const b=document.createElement("div");b.style.cssText=["position:absolute",`left:${C}px`,`top:${g}px`,"width:32px","height:32px","box-sizing:border-box","cursor:grab"].join(";"),b.draggable=T;const E=document.createElement("canvas");return E.width=E.height=32,E.style.cssText="width:32px;height:32px;image-rendering:pixelated;pointer-events:none;display:block;",b.appendChild(E),v.appendChild(b),[b,E]}for(let C=0;C<6;C++)for(let g=0;g<21;g++){const T=x[C*21+g]??null;if(!T)continue;const[b,E]=N(24+g*36,24+C*36,!0);b.title=String(ri[T]),B.complete?G(E,T):B.addEventListener("load",()=>G(E,T),{once:!1}),b.addEventListener("click",()=>{e[r()]=T,y(),t()}),b.addEventListener("dragstart",k=>{S=T,M=null,k.dataTransfer.effectAllowed="copy",b.style.opacity="0.4"}),b.addEventListener("dragend",()=>{b.style.opacity="1"})}const P=[];for(let C=0;C<9;C++){const[g,T]=N(240+C*36,248,!0);P.push(T),U.push(g),g.title=`Slot ${C+1}`,g.addEventListener("click",()=>{o(C),A()}),g.addEventListener("dragstart",b=>{S=e[C],M=C,b.dataTransfer.effectAllowed="move",g.style.opacity="0.4"}),g.addEventListener("dragend",()=>{g.style.opacity="1"}),g.addEventListener("dragover",b=>{b.preventDefault(),b.dataTransfer.dropEffect=M!==null?"move":"copy",g.style.boxShadow="inset 0 0 0 2px #7ff"}),g.addEventListener("dragleave",()=>{g.style.boxShadow=""}),g.addEventListener("drop",b=>{b.preventDefault(),g.style.boxShadow="",S&&(M!==null&&M!==C?[e[C],e[M]]=[e[M],e[C]]:M===null&&(e[C]=S),y(),t(),S=null,M=null)})}function y(){for(let C=0;C<9;C++)G(P[C],e[C])}return B.addEventListener("load",y),B.complete&&y(),d.appendChild(v),{syncHotbar:y,refreshSlotHighlight:A}}function Jo(d,n,e){const t=document.createElement("div");t.style.cssText=["display:flex","flex-wrap:wrap","gap:8px","justify-content:center","font-family:ui-monospace,monospace","font-size:13px","user-select:none"].join(";");const r="background:#1a2e1a;color:#5f5;border-color:#5f5",o="background:#2e1a1a;color:#f55;border-color:#f55";for(const i of Object.keys(d)){const a=document.createElement("button"),l=i.toUpperCase().padEnd(5),s=()=>{const u=d[i];a.textContent=`${l} ${u?"ON ":"OFF"}`,a.setAttribute("style",["padding:5px 10px","border-width:1px","border-style:solid","border-radius:4px","cursor:pointer","letter-spacing:0.04em",u?r:o].join(";"))};a.addEventListener("click",()=>{d[i]=!d[i],s(),n(i)}),s(),t.appendChild(a)}return e.appendChild(t),t}function ea(d,n){const e=document.createElement("div");e.style.cssText=["position:fixed","inset:0","z-index:100","background:rgba(0,0,0,0.78)","display:none","align-items:center","justify-content:center","font-family:ui-monospace,monospace"].join(";"),document.body.appendChild(e);const t=document.createElement("div");t.style.cssText=["display:flex","flex-direction:column","align-items:center","gap:24px","padding:48px 56px","background:rgba(255,255,255,0.04)","border:1px solid rgba(255,255,255,0.12)","border-radius:12px","max-width:860px","width:90%"].join(";"),e.appendChild(t);const r=document.createElement("h1");r.textContent="CRAFTY",r.style.cssText=["margin:0","font-size:52px","font-weight:900","color:#fff","letter-spacing:0.12em","text-shadow:0 0 48px rgba(100,200,255,0.45)","font-family:ui-monospace,monospace"].join(";"),t.appendChild(r);const o=document.createElement("button");o.textContent="Play",o.style.cssText=["padding:10px 40px","font-size:15px","font-family:ui-monospace,monospace","background:#1a3a1a","color:#5f5","border:1px solid #5f5","border-radius:6px","cursor:pointer","letter-spacing:0.06em","transition:background 0.15s"].join(";"),o.addEventListener("mouseenter",()=>{o.style.background="#243e24"}),o.addEventListener("mouseleave",()=>{o.style.background="#1a3a1a"}),o.addEventListener("click",async()=>{d.requestPointerLock()}),t.appendChild(o);const i=document.createElement("div");i.style.cssText="width:100%;height:1px;background:rgba(255,255,255,0.12)",t.appendChild(i);let a=0;function l(){a=performance.now(),e.style.display="flex",n.style.display="none"}function s(){e.style.display="none",n.style.display=""}function u(){return e.style.display!=="none"}return document.addEventListener("pointerlockchange",()=>{document.pointerLockElement===d?s():l()}),document.addEventListener("keydown",p=>{if(p.code==="Escape"&&u()){if(performance.now()-a<200)return;s(),d.requestPointerLock()}}),{overlay:e,card:t,open:l,close:s,isOpen:u}}function ta(){const d=document.createElement("div");d.style.cssText=["position:fixed","top:50%","left:50%","width:16px","height:16px","transform:translate(-50%,-50%)","pointer-events:none"].join(";"),d.innerHTML=['<div style="position:absolute;top:50%;left:0;width:100%;height:3px;background:#fff;opacity:0.8;transform:translateY(-50%)"></div>','<div style="position:absolute;left:50%;top:0;width:3px;height:100%;background:#fff;opacity:0.8;transform:translateX(-50%)"></div>','<div style="position:absolute;top:50%;left:50%;width:7px;height:3px;background:#fff;opacity:0.9;transform:translate(-50%,-50%);border-radius:50%"></div>'].join(""),document.body.appendChild(d);const n=document.createElement("div");n.style.cssText=["position:fixed","top:12px","right:12px","font-family:ui-monospace,monospace","font-size:13px","color:#ff0","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none"].join(";"),document.body.appendChild(n);const e=document.createElement("div");e.style.cssText=["position:fixed","top:44px","right:12px","font-family:ui-monospace,monospace","font-size:11px","color:#aaf","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none","white-space:pre"].join(";"),document.body.appendChild(e);const t=document.createElement("div");t.style.cssText=["position:fixed","bottom:12px","right:12px","font-family:ui-monospace,monospace","font-size:13px","color:#ff0","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none"].join(";"),document.body.appendChild(t);const r=document.createElement("div");return r.style.cssText=["position:fixed","bottom:44px","right:12px","font-family:ui-monospace,monospace","font-size:11px","color:#ccf","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none"].join(";"),document.body.appendChild(r),{fps:n,stats:e,biome:t,pos:r,reticle:d}}function ra(d,n,e,t,r,o,i,a){const l=new Ce("Camera");l.position.set(64,25,64);const s=l.addComponent(new yn(70,.1,1e3,t/r));n.add(l);const u=new Ce("Flashlight"),p=u.addComponent(new wn);p.color=new I(1,.95,.9),p.intensity=0,p.range=40,p.innerAngle=12,p.outerAngle=25,p.castShadow=!1,p.projectionTexture=o,l.addChild(u),n.add(u);let f=!1;const h=new fi(e,Math.PI,.1);h.attach(d);const _=new Jn(Math.PI,.1,15);let m=!0;const x=document.createElement("div");x.textContent="PLAYER",x.style.cssText=["position:fixed","top:12px","left:12px","font-family:ui-monospace,monospace","font-size:13px","font-weight:bold","color:#4f4","background:rgba(0,0,0,0.45)","padding:4px 8px","border-radius:4px","pointer-events:none","letter-spacing:0.05em"].join(";"),document.body.appendChild(x);function v(S){i&&(i.style.display=S?"":"none"),a&&(a.style.display=S?"":"none")}function w(){m=!m,m?(h.yaw=_.yaw,h.pitch=_.pitch,_.detach(),h.attach(d)):(_.yaw=h.yaw,_.pitch=h.pitch,h.detach(),_.attach(d)),x.textContent=m?"PLAYER":"FREE",x.style.color=m?"#4f4":"#4cf",v(m)}function B(S){f=S,p.intensity=f?25:0}let G=-1/0;return document.addEventListener("keyup",S=>{S.code==="Space"&&(G=performance.now())}),document.addEventListener("keydown",S=>{if(S.code==="KeyC"&&!S.repeat){w();return}if(!(S.code!=="Space"||S.repeat)&&performance.now()-G<400&&document.pointerLockElement===d){const M=m;w(),G=-1/0,M&&_.pressKey("Space")}}),window.addEventListener("keydown",S=>{S.code==="KeyF"&&!S.repeat&&(B(!f),console.log(`Flashlight ${f?"ON":"OFF"} (intensity: ${p.intensity})`)),S.ctrlKey&&S.key==="w"&&(S.preventDefault(),window.location.reload())}),{cameraGO:l,camera:s,player:h,freeCamera:_,isPlayerMode:()=>m,flashlight:p,isFlashlightEnabled:()=>f,modeEl:x,toggleController:w,setFlashlightEnabled:B,setPlayerUIVisible:v}}const Qe=new Map,Je=new Map,Bt=(d,n,e)=>`${d},${n},${e}`;function na(d,n,e,t){const r=Bt(d,n,e);if(Qe.has(r))return;const o=new Ce("TorchLight");o.position.set(d+.5,n+.9,e+.5);const i=o.addComponent(new Ht);i.color=new I(1,.52,.18),i.intensity=4,i.radius=6,i.castShadow=!1,t.add(o);const a=(d*127.1+n*311.7+e*74.3)%(Math.PI*2);Qe.set(r,{go:o,pl:i,phase:a})}function ia(d,n,e,t){const r=Bt(d,n,e),o=Qe.get(r);o&&(t.remove(o.go),Qe.delete(r))}function oa(d){for(const{pl:n,phase:e}of Qe.values()){const t=1+.08*Math.sin(d*11.7+e)+.05*Math.sin(d*7.3+e*1.7)+.03*Math.sin(d*23.1+e*.5);n.intensity=4*t}}function aa(d,n,e,t){const r=Bt(d,n,e);if(Je.has(r))return;const o=new Ce("MagmaLight");o.position.set(d+.5,n+.5,e+.5);const i=o.addComponent(new Ht);i.color=new I(1,.28,0),i.intensity=6,i.radius=10,i.castShadow=!1,t.add(o);const a=(d*127.1+n*311.7+e*74.3)%(Math.PI*2);Je.set(r,{go:o,pl:i,phase:a})}function sa(d,n,e,t){const r=Bt(d,n,e),o=Je.get(r);o&&(t.remove(o.go),Je.delete(r))}function la(d){for(const{pl:n,phase:e}of Je.values()){const t=1+.18*Math.sin(d*1.1+e)+.1*Math.sin(d*2.9+e*.7)+.06*Math.sin(d*.5+e*1.4);n.intensity=6*t}}const ca=700,ua=300;function da(){return{targetBlock:null,targetHit:null,mouseHeld:-1,mouseHoldTime:0,lastBlockAction:0}}function Un(d,n,e,t,r,o){if(d===0&&e.targetBlock){const i=t.getBlockType(e.targetBlock.x,e.targetBlock.y,e.targetBlock.z);i===R.TORCH&&ia(e.targetBlock.x,e.targetBlock.y,e.targetBlock.z,o),i===R.MAGMA&&sa(e.targetBlock.x,e.targetBlock.y,e.targetBlock.z,o),t.mineBlock(e.targetBlock.x,e.targetBlock.y,e.targetBlock.z),e.lastBlockAction=n}else if(d===2&&e.targetHit){const i=e.targetHit,a=r(),l=i.position.x+i.face.x,s=i.position.y+i.face.y,u=i.position.z+i.face.z;t.addBlock(i.position.x,i.position.y,i.position.z,i.face.x,i.face.y,i.face.z,a)&&(a===R.TORCH&&na(l,s,u,o),a===R.MAGMA&&aa(l,s,u,o)),e.lastBlockAction=n}}function fa(d,n,e,t,r){d.addEventListener("contextmenu",o=>o.preventDefault()),d.addEventListener("mousedown",o=>{document.pointerLockElement===d&&(o.button!==0&&o.button!==2||(n.mouseHeld=o.button,n.mouseHoldTime=o.timeStamp,Un(o.button,o.timeStamp,n,e,t,r)))}),d.addEventListener("mouseup",o=>{o.button===n.mouseHeld&&(n.mouseHeld=-1)})}function pa(d,n,e,t,r,o){e.mouseHeld>=0&&document.pointerLockElement===n&&d-e.mouseHoldTime>=ca&&d-e.lastBlockAction>=ua&&Un(e.mouseHeld,d,e,t,r,o)}function ha(d,n,e,t,r,o,i){const a=e.getTopBlockY(d,n,200);if(a<=0||e.getBiomeAt(d,a,n)!==xe.GrassyPlains)return;const u=e.getBlockType(Math.floor(d),Math.floor(a-1),Math.floor(n))===R.WATER?Math.floor(a-.05):a,p=new Ce("Duck");p.position.set(d+.5,u,n+.5);const f=new Ce("Duck.Body");f.position.set(0,.15,0),f.addComponent(new _t(r,{albedo:[.93,.93,.93,1],roughness:.9})),p.addChild(f);const h=new Ce("Duck.Head");h.position.set(0,.32,-.12),h.addComponent(new _t(o,{albedo:[.08,.32,.1,1],roughness:.9})),p.addChild(h);const _=new Ce("Duck.Bill");_.position.set(0,.27,-.205),_.addComponent(new _t(i,{albedo:[1,.55,.05,1],roughness:.8})),p.addChild(_),p.addComponent(new qe(e)),t.add(p)}function ma(d,n,e,t,r,o,i,a){for(let l=0;l<e;l++){const s=l/e*Math.PI*2+Math.random()*.4,u=8+Math.random()*20;ha(Math.floor(d+Math.cos(s)*u),Math.floor(n+Math.sin(s)*u),t,r,o,i,a)}}const Ve=128,mt=40;class _a{constructor(){c(this,"data",new Float32Array(Ve*Ve));c(this,"resolution",Ve);c(this,"extent",mt);c(this,"_camX",NaN);c(this,"_camZ",NaN)}update(n,e,t){if(Math.abs(n-this._camX)<2&&Math.abs(e-this._camZ)<2)return;this._camX=n,this._camZ=e;const r=mt*2/Ve,o=n-mt,i=e-mt,a=Math.ceil(e)+80;for(let l=0;l<Ve;l++)for(let s=0;s<Ve;s++)this.data[l*Ve+s]=t.getTopBlockY(Math.floor(o+s*r),Math.floor(i+l*r),a)}}const ga={ssao:!0,ssgi:!1,shadows:!0,dof:!0,bloom:!0,godrays:!0,fog:!1,aces:!0,ao_dbg:!1,shd_dbg:!1,hdr:!0,auto_exp:!1,rain:!0,clouds:!0},va="modulepreload",ba=function(d,n){return new URL(d,n).href},gn={},ya=function(n,e,t){let r=Promise.resolve();if(e&&e.length>0){const i=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),l=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));r=Promise.allSettled(e.map(s=>{if(s=ba(s,t),s in gn)return;gn[s]=!0;const u=s.endsWith(".css"),p=u?'[rel="stylesheet"]':"";if(!!t)for(let _=i.length-1;_>=0;_--){const m=i[_];if(m.href===s&&(!u||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${s}"]${p}`))return;const h=document.createElement("link");if(h.rel=u?"stylesheet":va,u||(h.as="script"),h.crossOrigin="",h.href=s,l&&h.setAttribute("nonce",l),document.head.appendChild(h),u)return new Promise((_,m)=>{h.addEventListener("load",_),h.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${s}`)))})}))}function o(i){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=i,window.dispatchEvent(a),!a.defaultPrevented)throw i}return r.then(i=>{for(const a of i||[])a.status==="rejected"&&o(a.reason);return n().catch(o)})},xa={emitter:{maxParticles:8e4,spawnRate:24e3,lifetime:[2,3.5],shape:{kind:"box",halfExtents:[35,.1,35]},initialSpeed:[0,0],initialColor:[.75,.88,1,.55],initialSize:[.005,.009],roughness:.1,metallic:0},modifiers:[{type:"gravity",strength:9},{type:"drag",coefficient:.05},{type:"color_over_lifetime",startColor:[.75,.88,1,.55],endColor:[.75,.88,1,0]},{type:"block_collision"}],renderer:{type:"sprites",blendMode:"alpha",billboard:"velocity",renderTarget:"hdr"}},wa={emitter:{maxParticles:5e4,spawnRate:1500,lifetime:[30,45],shape:{kind:"box",halfExtents:[35,.1,35]},initialSpeed:[0,0],initialColor:[.92,.96,1,.85],initialSize:[.025,.055],roughness:.1,metallic:0},modifiers:[{type:"gravity",strength:1.5},{type:"drag",coefficient:.8},{type:"curl_noise",scale:1,strength:1,timeScale:1,octaves:1},{type:"block_collision"}],renderer:{type:"sprites",blendMode:"alpha",billboard:"camera",renderTarget:"hdr"}};async function Ba(d,n,e,t,r,o,i,a,l,s,u){let p,f,h,_;if(n.worldGeometryPass){const X=vt.create(d);n.worldGeometryPass.updateGBuffer(X),p=X,f=n.worldGeometryPass,h=n.worldShadowPass,_=n.waterPass}else{p=vt.create(d),f=ir.create(d,p,t),h=cr.create(d,n.shadowPass.shadowMapArrayViews,3,t);const X=d.device.createTexture({label:"WaterDummyHDR",size:{width:d.width,height:d.height},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),ue=d.device.createTexture({label:"WaterDummyDepth",size:{width:d.width,height:d.height},format:"depth32float",usage:GPUTextureUsage.TEXTURE_BINDING}),de=X.createView(),Q=ue.createView();_=ze.create(d,X,de,Q,r,o,i);const J=(q,j)=>{u.set(q,j),f.addChunk(q,j),h.addChunk(q,j),_.addChunk(q,j)},H=(q,j)=>{u.set(q,j),f.updateChunk(q,j),h.updateChunk(q,j),_.updateChunk(q,j)},Y=q=>{u.delete(q),f.removeChunk(q),h.removeChunk(q),_.removeChunk(q)};s.onChunkAdded=J,s.onChunkUpdated=H,s.onChunkRemoved=Y;for(const[q,j]of u)_.addChunk(q,j)}const m=nr.create(d,p),x=ar.create(d,p),v=e.clouds?Qt.create(d,l):null,w=Xt.create(d,p,n.shadowPass,x.aoView,v==null?void 0:v.shadowView,a),B=e.godrays?tr.create(d,p,n.shadowPass,w.hdrView,w.cameraBuffer,w.lightBuffer):null,G=Kt.create(d,w.hdrView),S=e.clouds?Zt.create(d,w.hdrView,p.depthView,l):null;d.pushInitErrorScope();const M=lr.create(d);await d.popInitErrorScope("PointSpotShadowPass");const U=ur.create(d,p,M,w.hdrView),A=Jt.create(d,w,p),N=sr.create(d,p,A.historyView);w.updateSSGI(N.resultView),n.waterPass,_.updateRenderTargets(w.hdrTexture,w.hdrView,p.depthView,r);let P=null;const y=e.dof?(P=or.create(d,A.resolvedView,p.depthView),P.resultView):A.resolvedView;let C=null;const g=e.bloom?(C=er.create(d,y),C.resultView):y,T=$t.create(d,g,p.depthView),b=$e.create(d,w.hdrTexture);b.enabled=e.auto_exp;const E=rr.create(d,g,x.aoView,p.depthView,w.cameraBuffer,w.lightBuffer,b.exposureBuffer);E.depthFogEnabled=e.fog;const k=n.currentWeatherEffect??We.None;let z=null;if(e.rain&&k!==We.None){const X=k===We.Snow?wa:xa;z=dr.create(d,X,p,w.hdrView)}const{RenderGraph:D}=await ya(async()=>{const{RenderGraph:X}=await import("./index-BecGT-US.js");return{RenderGraph:X}},[],import.meta.url),O=new D;return O.addPass(n.shadowPass),v&&O.addPass(v),O.addPass(h),O.addPass(M),O.addPass(m),O.addPass(f),O.addPass(x),O.addPass(N),S?O.addPass(S):O.addPass(G),O.addPass(w),O.addPass(U),O.addPass(_),B&&O.addPass(B),z&&O.addPass(z),O.addPass(A),P&&O.addPass(P),C&&O.addPass(C),O.addPass(T),O.addPass(b),O.addPass(E),{shadowPass:n.shadowPass,gbuffer:p,geometryPass:m,worldGeometryPass:f,worldShadowPass:h,waterPass:_,ssaoPass:x,ssgiPass:N,lightingPass:w,atmospherePass:G,pointSpotShadowPass:M,pointSpotLightPass:U,taaPass:A,dofPass:P,bloomPass:C,rainPass:z,godrayPass:B,cloudPass:S,cloudShadowPass:v,blockHighlightPass:T,autoExposurePass:b,compositePass:E,graph:O,prevViewProj:null,currentWeatherEffect:k}}function vn(d,n){let e=0,t=1;for(;d>0;)t/=n,e+=t*(d%n),d=Math.floor(d/n);return e}function Sa(d,n,e){const t=d.clone();for(let r=0;r<4;r++)t.data[r*4+0]+=n*t.data[r*4+3],t.data[r*4+1]+=e*t.data[r*4+3];return t}async function Pa(){const d=document.getElementById("canvas");if(!d)throw new Error("No canvas element");const n=await Wt.create(d,{enableErrorHandling:!1}),{device:e}=n,t=await Oo(e,No(await(await fetch(zn)).arrayBuffer())),r=await Ro(e,t.gpuTexture),o=Bo(e),i=await fr.load(e,Ut,Dn,Fn,Hn),a=await Se.fromUrl(e,Wn),l=await Se.fromUrl(e,qn),s=await Se.fromUrl(e,jn,{resizeWidth:256,resizeHeight:256,usage:7}),u=$o(Ut),p=ta(),f=ea(d,p.reticle),h=new Dt(13),_=new Map,m=new Yn,x=new Ce("Sun"),v=x.addComponent(new xn(new I(.3,-1,.5),I.one(),3,3));m.add(x);const w=ra(d,m,h,n.width,n.height,s.gpuTexture,p.reticle,u.element),{cameraGO:B,camera:G,player:S,freeCamera:M}=w,U=da();fa(d,U,h,()=>u.getSelected(),m);const A={...ga},N=Yt.create(n,3);let P={shadowPass:N,currentWeatherEffect:We.None};async function y(){P=await Ba(n,P,A,i,t,a,l,r,o,h,_),G.aspect=n.width/n.height}await y();const C=B.position.x,g=B.position.z;{const Z=h.chunksPerFrame;h.chunksPerFrame=200,h.update(new I(C,50,g),0),h.chunksPerFrame=Z;const le=h.getTopBlockY(C,g,200);le>0&&(B.position.y=le+1.62,S.velY=0)}const T=jo(e),b=Yo(e),E=Xo(e);ma(C,g,30,h,m,T,b,E);const k=document.createElement("div");k.style.cssText="width:100%;height:1px;background:rgba(255,255,255,0.12)",f.card.appendChild(k);const z=Qo(f.card,Ut,u.slots,()=>u.refresh(),u.getSelectedSlot,u.setSelectedSlot),D=document.createElement("div");D.style.cssText="width:100%;height:1px;background:rgba(255,255,255,0.12)",f.card.appendChild(D);const O=document.createElement("div");O.textContent="EFFECTS",O.style.cssText="color:rgba(255,255,255,0.35);font-size:11px;letter-spacing:0.18em;align-self:flex-start",f.card.appendChild(O),Jo(A,async Z=>{if(Z!=="ssao"&&Z!=="ssgi"&&Z!=="shadows"&&Z!=="aces"&&Z!=="ao_dbg"&&Z!=="shd_dbg"&&Z!=="hdr"){if(Z==="auto_exp"){P.autoExposurePass.enabled=A.auto_exp;return}if(Z==="fog"){P.compositePass.depthFogEnabled=A.fog;return}if(Z==="rain"){await y();return}if(Z==="clouds"){await y();return}await y()}},f.card),u.setOnSelectionChanged(z.refreshSlotHighlight);const X=document.createElement("div");X.textContent="ESC  ·  resume",X.style.cssText="color:rgba(255,255,255,0.25);font-size:11px;letter-spacing:0.1em",f.card.appendChild(X),new ResizeObserver(async()=>{const Z=Math.max(1,Math.round(d.clientWidth*devicePixelRatio)),le=Math.max(1,Math.round(d.clientHeight*devicePixelRatio));Z===d.width&&le===d.height||(d.width=Z,d.height=le,await y())}).observe(d);let de=0,Q=0,J=-1/0,H=Math.PI*.3,Y=0,q=0,j=0,ne=0,he=pn(h.getBiomeAt(B.position.x,B.position.y,B.position.z));const ge=fn(h.getBiomeAt(B.position.x,B.position.y,B.position.z));let fe=ge.cloudBase,se=ge.cloudTop;const F=new _a,ee=new I(0,0,-1),ie=new K([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);async function be(Z){var Ur,Er;n.pushPassErrorScope("frame");const le=Math.min((Z-de)/1e3,.1);de=Z;const pr=Z-J>=1e3;pr&&(J=Z),le>0&&(Q+=(1/le-Q)*.1),H+=le*.01,Y+=le,j+=le*1.5,ne+=le*.5;const hr=Math.sin(H),St=.25,Pt=-hr,Gt=Math.cos(H),Tt=Math.sqrt(St*St+Pt*Pt+Gt*Gt);v.direction.set(St/Tt,Pt/Tt,Gt/Tt);const At=hr;v.intensity=Math.max(0,At)*3;const mr=Math.max(0,At);v.color.set(1,.8+.2*mr,.6+.4*mr),w.isPlayerMode()?S.update(B,le):M.update(B,le),oa(Z/1e3),la(Z/1e3);const W=G.position();qe.playerPos.x=W.x,qe.playerPos.y=W.y,qe.playerPos.z=W.z,m.update(le),h.update(W,le);const et=h.getBiomeAt(W.x,W.y,W.z),_r=Io(et);_r!==P.currentWeatherEffect&&(P.currentWeatherEffect=_r,await y());const En=pn(et);he+=(En-he)*Math.min(1,.3*le);const gr=fn(et);if(fe+=(gr.cloudBase-fe)*Math.min(1,.3*le),se+=(gr.cloudTop-se)*Math.min(1,.3*le),pr){p.fps.textContent=`${Q.toFixed(0)} fps`;const we=(P.worldGeometryPass.triangles/1e3).toFixed(1);p.stats.textContent=`${P.worldGeometryPass.drawCalls} draws  ${we}k tris
${h.chunkCount} chunks  ${h.pendingChunks} pending`,p.biome.textContent=`${xe[et]}  coverage:${he.toFixed(2)}`,p.pos.textContent=`X: ${W.x.toFixed(1)}  Y: ${W.y.toFixed(1)}  Z: ${W.z.toFixed(1)}`}const vr=q%16+1,Mn=(vn(vr,2)-.5)*(2/n.width),Cn=(vn(vr,3)-.5)*(2/n.height),Ge=G.viewProjectionMatrix(),br=Sa(Ge,Mn,Cn),Re=G.viewMatrix(),Ae=G.projectionMatrix(),Pe=Ge.invert(),yr=Ae.invert(),xr=v.computeCascadeMatrices(G,128),wr=m.collectMeshRenderers(),Rn=wr.map(we=>{const Mr=we.gameObject.localToWorld();return{mesh:we.mesh,modelMatrix:Mr,normalMatrix:Mr.normalMatrix(),material:we.material}}),Br=wr.filter(we=>we.castShadow).map(we=>({mesh:we.mesh,modelMatrix:we.gameObject.localToWorld()}));N.setSceneSnapshot(Br),N.updateScene(m,G,v,128),P.worldShadowPass.enabled=v.intensity>0,P.worldShadowPass.update(n,xr,W.x,W.z);const tt=Math.max(0,At),Ln=[.02+.38*tt,.03+.52*tt,.05+.65*tt],Sr={cloudBase:fe,cloudTop:se,coverage:he,density:4,windOffset:[j,ne],anisotropy:.85,extinction:.25,ambientColor:Ln,exposure:1};P.cloudShadowPass&&P.cloudShadowPass.update(n,Sr,[W.x,W.z],128),P.cloudPass&&(P.cloudPass.updateCamera(n,Pe,W,G.near,G.far),P.cloudPass.updateLight(n,v.direction,v.color,v.intensity),P.cloudPass.updateSettings(n,Sr));const Pr=m.getComponents(Ht),Gr=m.getComponents(wn);P.pointSpotShadowPass.update(Pr,Gr,Br),P.pointSpotLightPass.updateCamera(n,Re,Ae,Ge,Pe,W,G.near,G.far),P.pointSpotLightPass.updateLights(n,Pr,Gr),P.atmospherePass.update(n,Pe,W,v.direction),P.geometryPass.setDrawItems(Rn),P.geometryPass.updateCamera(n,Re,Ae,br,Pe,W,G.near,G.far),P.worldGeometryPass.updateCamera(n,Re,Ae,br,Pe,W,G.near,G.far),P.waterPass.updateCamera(n,Re,Ae,Ge,Pe,W,G.near,G.far),P.waterPass.updateTime(n,Y,Math.max(.01,tt)),P.lightingPass.updateCamera(n,Re,Ae,Ge,Pe,W,G.near,G.far),P.lightingPass.updateLight(n,v.direction,v.color,v.intensity,xr,A.shadows,A.shd_dbg),P.lightingPass.updateCloudShadow(n,P.cloudShadowPass?W.x:0,P.cloudShadowPass?W.z:0,128),P.ssaoPass.updateCamera(n,Re,Ae,yr),P.ssaoPass.updateParams(n,1,.005,A.ssao?2:0),P.ssgiPass.enabled=A.ssgi,P.ssgiPass.updateSettings({strength:A.ssgi?1:0}),A.ssgi&&P.ssgiPass.updateCamera(n,Re,Ae,yr,Pe,P.prevViewProj??Ge,W);const Tr=Math.cos(S.pitch);ee.x=-Math.sin(S.yaw)*Tr,ee.y=-Math.sin(S.pitch),ee.z=-Math.cos(S.yaw)*Tr;const rt=h.getBlockByRay(W,ee,16),Ar=!!(rt&&rt.position.sub(W).length()<=6);U.targetBlock=Ar?rt.position:null,U.targetHit=Ar?rt:null;const Nn=U.targetBlock&&!ae(h.getBlockType(U.targetBlock.x,U.targetBlock.y,U.targetBlock.z))?U.targetBlock:null;if(P.blockHighlightPass.update(n,Ge,Nn),pa(Z,d,U,h,()=>u.getSelected(),m),P.rainPass){F.update(W.x,W.z,h),P.rainPass.updateHeightmap(n,F.data,W.x,W.z,F.extent);const we=P.currentWeatherEffect===We.Snow?20:8;ie.data[12]=W.x,ie.data[13]=W.y+we,ie.data[14]=W.z,P.rainPass.update(n,le,Re,Ae,Ge,Pe,W,G.near,G.far,ie)}(Ur=P.dofPass)==null||Ur.updateParams(n,8,75,3,G.near,G.far),(Er=P.godrayPass)==null||Er.updateParams(n);const kn=ae(h.getBlockType(Math.floor(W.x),Math.floor(W.y),Math.floor(W.z))),On={x:-v.direction.x,y:-v.direction.y,z:-v.direction.z};P.compositePass.updateParams(n,kn,Y,A.aces,A.ao_dbg,A.hdr),P.compositePass.updateStars(n,Pe,W,On),P.autoExposurePass.update(n,le),P.taaPass.updateCamera(n,Pe,P.prevViewProj??Ge),P.prevViewProj=Ge,q++,await P.graph.execute(n),await n.popPassErrorScope("frame"),requestAnimationFrame(be)}requestAnimationFrame(be)}Pa().catch(d=>{document.body.innerHTML=`<pre style="color:red;padding:1rem">${d}</pre>`,console.error(d)});export{Kt as A,$t as B,Zt as C,or as D,vt as G,Xt as L,dr as P,Wt as R,ar as S,Jt as T,ze as W,$e as a,er as b,Qt as c,rr as d,nr as e,tr as f,ur as g,lr as h,pe as i,sr as j,Yt as k,ir as l,cr as m};
