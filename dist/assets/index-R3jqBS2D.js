var hi=Object.defineProperty;var mi=(u,r,e)=>r in u?hi(u,r,{enumerable:!0,configurable:!0,writable:!0,value:e}):u[r]=e;var c=(u,r,e)=>mi(u,typeof r!="symbol"?r+"":r,e);(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))t(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&t(i)}).observe(document,{childList:!0,subtree:!0});function e(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function t(n){if(n.ep)return;n.ep=!0;const o=e(n);fetch(n.href,o)}})();const _i=""+new URL("clear_sky-CyjsjiVR.hdr",import.meta.url).href,fn=""+new URL("simple_block_atlas-B-7juoTN.png",import.meta.url).href,gi=""+new URL("simple_block_atlas_normal-BdCvGD-K.png",import.meta.url).href,vi=""+new URL("simple_block_atlas_mer-C_Oa_Ink.png",import.meta.url).href,bi=""+new URL("simple_block_atlas_heightmap-BOV6qQJl.png",import.meta.url).href,yi=""+new URL("waterDUDV-CGfbcllR.png",import.meta.url).href,xi="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAgCAYAAADaInAlAAAA4klEQVR4Ae2UQQ4CIRAEGeAvnn2H/3+PDqBuXLnvoYqEAMvApptKx+3+eJYrW0QpNXvUNdYc57exrjkd+/u9o+58/r8+xj+yr/t+5/G+/7P3rc361lr2Onvva5zrzbyPun7Un+v259uUcdUTpFM2sgMCQH791C4AAgB3AC7fBBAAuANw+SaAAMAdgMs3AQQA7gBcvgkgAHAH4PJNAAGAOwCXbwIIANwBuHwTQADgDsDlmwACAHcALt8EEAC4A3D5JoAAwB2AyzcBBADuAFy+CSAAcAfg8k0AAYA7AJdvAsABeAEiUwM8dIJUQAAAAABJRU5ErkJggg==",wi=""+new URL("flashlight-C64SqrUS.jpg",import.meta.url).href;class I{constructor(r=0,e=0){c(this,"x");c(this,"y");this.x=r,this.y=e}set(r,e){return this.x=r,this.y=e,this}clone(){return new I(this.x,this.y)}add(r){return new I(this.x+r.x,this.y+r.y)}sub(r){return new I(this.x-r.x,this.y-r.y)}scale(r){return new I(this.x*r,this.y*r)}dot(r){return this.x*r.x+this.y*r.y}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.lengthSq())}normalize(){const r=this.length();return r>0?this.scale(1/r):new I}toArray(){return[this.x,this.y]}static zero(){return new I(0,0)}static one(){return new I(1,1)}}class D{constructor(r=0,e=0,t=0){c(this,"x");c(this,"y");c(this,"z");this.x=r,this.y=e,this.z=t}set(r,e,t){return this.x=r,this.y=e,this.z=t,this}clone(){return new D(this.x,this.y,this.z)}negate(){return new D(-this.x,-this.y,-this.z)}add(r){return new D(this.x+r.x,this.y+r.y,this.z+r.z)}sub(r){return new D(this.x-r.x,this.y-r.y,this.z-r.z)}scale(r){return new D(this.x*r,this.y*r,this.z*r)}mul(r){return new D(this.x*r.x,this.y*r.y,this.z*r.z)}dot(r){return this.x*r.x+this.y*r.y+this.z*r.z}cross(r){return new D(this.y*r.z-this.z*r.y,this.z*r.x-this.x*r.z,this.x*r.y-this.y*r.x)}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.lengthSq())}normalize(){const r=this.length();return r>0?this.scale(1/r):new D}lerp(r,e){return new D(this.x+(r.x-this.x)*e,this.y+(r.y-this.y)*e,this.z+(r.z-this.z)*e)}toArray(){return[this.x,this.y,this.z]}static zero(){return new D(0,0,0)}static one(){return new D(1,1,1)}static up(){return new D(0,1,0)}static forward(){return new D(0,0,-1)}static right(){return new D(1,0,0)}static fromArray(r,e=0){return new D(r[e],r[e+1],r[e+2])}}class Oe{constructor(r=0,e=0,t=0,n=0){c(this,"x");c(this,"y");c(this,"z");c(this,"w");this.x=r,this.y=e,this.z=t,this.w=n}set(r,e,t,n){return this.x=r,this.y=e,this.z=t,this.w=n,this}clone(){return new Oe(this.x,this.y,this.z,this.w)}add(r){return new Oe(this.x+r.x,this.y+r.y,this.z+r.z,this.w+r.w)}sub(r){return new Oe(this.x-r.x,this.y-r.y,this.z-r.z,this.w-r.w)}scale(r){return new Oe(this.x*r,this.y*r,this.z*r,this.w*r)}dot(r){return this.x*r.x+this.y*r.y+this.z*r.z+this.w*r.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.lengthSq())}toArray(){return[this.x,this.y,this.z,this.w]}static zero(){return new Oe(0,0,0,0)}static one(){return new Oe(1,1,1,1)}static fromArray(r,e=0){return new Oe(r[e],r[e+1],r[e+2],r[e+3])}}class oe{constructor(r){c(this,"data");this.data=new Float32Array(16),r&&this.data.set(r)}clone(){return new oe(this.data)}get(r,e){return this.data[r*4+e]}set(r,e,t){this.data[r*4+e]=t}multiply(r){const e=this.data,t=r.data,n=new Float32Array(16);for(let o=0;o<4;o++)for(let i=0;i<4;i++)n[o*4+i]=e[0*4+i]*t[o*4+0]+e[1*4+i]*t[o*4+1]+e[2*4+i]*t[o*4+2]+e[3*4+i]*t[o*4+3];return new oe(n)}transformPoint(r){const e=this.data,t=e[0]*r.x+e[4]*r.y+e[8]*r.z+e[12],n=e[1]*r.x+e[5]*r.y+e[9]*r.z+e[13],o=e[2]*r.x+e[6]*r.y+e[10]*r.z+e[14],i=e[3]*r.x+e[7]*r.y+e[11]*r.z+e[15];return new D(t/i,n/i,o/i)}transformDirection(r){const e=this.data;return new D(e[0]*r.x+e[4]*r.y+e[8]*r.z,e[1]*r.x+e[5]*r.y+e[9]*r.z,e[2]*r.x+e[6]*r.y+e[10]*r.z)}transformVec4(r){const e=this.data;return new Oe(e[0]*r.x+e[4]*r.y+e[8]*r.z+e[12]*r.w,e[1]*r.x+e[5]*r.y+e[9]*r.z+e[13]*r.w,e[2]*r.x+e[6]*r.y+e[10]*r.z+e[14]*r.w,e[3]*r.x+e[7]*r.y+e[11]*r.z+e[15]*r.w)}transpose(){const r=this.data;return new oe([r[0],r[4],r[8],r[12],r[1],r[5],r[9],r[13],r[2],r[6],r[10],r[14],r[3],r[7],r[11],r[15]])}invert(){const r=this.data,e=new Float32Array(16),t=r[0],n=r[1],o=r[2],i=r[3],a=r[4],s=r[5],l=r[6],d=r[7],p=r[8],f=r[9],h=r[10],m=r[11],_=r[12],y=r[13],w=r[14],x=r[15],B=t*s-n*a,P=t*l-o*a,S=t*d-i*a,M=n*l-o*s,L=n*d-i*s,A=o*d-i*l,O=p*y-f*_,T=p*w-h*_,v=p*x-m*_,C=f*w-h*y,g=f*x-m*y,G=h*x-m*w;let b=B*G-P*g+S*C+M*v-L*T+A*O;return b===0?oe.identity():(b=1/b,e[0]=(s*G-l*g+d*C)*b,e[1]=(o*g-n*G-i*C)*b,e[2]=(y*A-w*L+x*M)*b,e[3]=(h*L-f*A-m*M)*b,e[4]=(l*v-a*G-d*T)*b,e[5]=(t*G-o*v+i*T)*b,e[6]=(w*S-_*A-x*P)*b,e[7]=(p*A-h*S+m*P)*b,e[8]=(a*g-s*v+d*O)*b,e[9]=(n*v-t*g-i*O)*b,e[10]=(_*L-y*S+x*B)*b,e[11]=(f*S-p*L-m*B)*b,e[12]=(s*T-a*C-l*O)*b,e[13]=(t*C-n*T+o*O)*b,e[14]=(y*P-_*M-w*B)*b,e[15]=(p*M-f*P+h*B)*b,new oe(e))}normalMatrix(){const r=this.data,e=r[0],t=r[1],n=r[2],o=r[4],i=r[5],a=r[6],s=r[8],l=r[9],d=r[10],p=d*i-a*l,f=-d*o+a*s,h=l*o-i*s;let m=e*p+t*f+n*h;if(m===0)return oe.identity();m=1/m;const _=new Float32Array(16);return _[0]=p*m,_[4]=(-d*t+n*l)*m,_[8]=(a*t-n*i)*m,_[1]=f*m,_[5]=(d*e-n*s)*m,_[9]=(-a*e+n*o)*m,_[2]=h*m,_[6]=(-l*e+t*s)*m,_[10]=(i*e-t*o)*m,_[15]=1,new oe(_)}static identity(){return new oe([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}static translation(r,e,t){return new oe([1,0,0,0,0,1,0,0,0,0,1,0,r,e,t,1])}static scale(r,e,t){return new oe([r,0,0,0,0,e,0,0,0,0,t,0,0,0,0,1])}static rotationX(r){const e=Math.cos(r),t=Math.sin(r);return new oe([1,0,0,0,0,e,t,0,0,-t,e,0,0,0,0,1])}static rotationY(r){const e=Math.cos(r),t=Math.sin(r);return new oe([e,0,-t,0,0,1,0,0,t,0,e,0,0,0,0,1])}static rotationZ(r){const e=Math.cos(r),t=Math.sin(r);return new oe([e,t,0,0,-t,e,0,0,0,0,1,0,0,0,0,1])}static fromQuaternion(r,e,t,n){const o=r+r,i=e+e,a=t+t,s=r*o,l=e*o,d=e*i,p=t*o,f=t*i,h=t*a,m=n*o,_=n*i,y=n*a;return new oe([1-d-h,l+y,p-_,0,l-y,1-s-h,f+m,0,p+_,f-m,1-s-d,0,0,0,0,1])}static perspective(r,e,t,n){const o=1/Math.tan(r/2),i=1/(t-n);return new oe([o/e,0,0,0,0,o,0,0,0,0,n*i,-1,0,0,n*t*i,0])}static orthographic(r,e,t,n,o,i){const a=1/(r-e),s=1/(t-n),l=1/(o-i);return new oe([-2*a,0,0,0,0,-2*s,0,0,0,0,l,0,(r+e)*a,(n+t)*s,o*l,1])}static lookAt(r,e,t){const n=e.sub(r).normalize(),o=n.cross(t).normalize(),i=o.cross(n);return new oe([o.x,i.x,-n.x,0,o.y,i.y,-n.y,0,o.z,i.z,-n.z,0,-o.dot(r),-i.dot(r),n.dot(r),1])}static trs(r,e,t,n,o,i){const s=oe.fromQuaternion(e,t,n,o).data;return new oe([i.x*s[0],i.x*s[1],i.x*s[2],0,i.y*s[4],i.y*s[5],i.y*s[6],0,i.z*s[8],i.z*s[9],i.z*s[10],0,r.x,r.y,r.z,1])}}class de{constructor(r=0,e=0,t=0,n=1){c(this,"x");c(this,"y");c(this,"z");c(this,"w");this.x=r,this.y=e,this.z=t,this.w=n}clone(){return new de(this.x,this.y,this.z,this.w)}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.lengthSq())}normalize(){const r=this.length();return r>0?new de(this.x/r,this.y/r,this.z/r,this.w/r):de.identity()}conjugate(){return new de(-this.x,-this.y,-this.z,this.w)}multiply(r){const e=this.x,t=this.y,n=this.z,o=this.w,i=r.x,a=r.y,s=r.z,l=r.w;return new de(o*i+e*l+t*s-n*a,o*a-e*s+t*l+n*i,o*s+e*a-t*i+n*l,o*l-e*i-t*a-n*s)}rotateVec3(r){const e=this.x,t=this.y,n=this.z,o=this.w,i=o*r.x+t*r.z-n*r.y,a=o*r.y+n*r.x-e*r.z,s=o*r.z+e*r.y-t*r.x,l=-e*r.x-t*r.y-n*r.z;return new D(i*o+l*-e+a*-n-s*-t,a*o+l*-t+s*-e-i*-n,s*o+l*-n+i*-t-a*-e)}toMat4(){return oe.fromQuaternion(this.x,this.y,this.z,this.w)}slerp(r,e){let t=this.x*r.x+this.y*r.y+this.z*r.z+this.w*r.w,n=r.x,o=r.y,i=r.z,a=r.w;if(t<0&&(t=-t,n=-n,o=-o,i=-i,a=-a),t>=1)return this.clone();const s=Math.acos(t),l=Math.sqrt(1-t*t);if(Math.abs(l)<.001)return new de(this.x*.5+n*.5,this.y*.5+o*.5,this.z*.5+i*.5,this.w*.5+a*.5);const d=Math.sin((1-e)*s)/l,p=Math.sin(e*s)/l;return new de(this.x*d+n*p,this.y*d+o*p,this.z*d+i*p,this.w*d+a*p)}static identity(){return new de(0,0,0,1)}static fromAxisAngle(r,e){const t=Math.sin(e/2),n=r.normalize();return new de(n.x*t,n.y*t,n.z*t,Math.cos(e/2))}static fromEuler(r,e,t){const n=Math.cos(r/2),o=Math.sin(r/2),i=Math.cos(e/2),a=Math.sin(e/2),s=Math.cos(t/2),l=Math.sin(t/2);return new de(o*i*s+n*a*l,n*a*s-o*i*l,n*i*l+o*a*s,n*i*s-o*a*l)}}const ot=new Uint8Array([23,125,161,52,103,117,70,37,247,101,203,169,124,126,44,123,152,238,145,45,171,114,253,10,192,136,4,157,249,30,35,72,175,63,77,90,181,16,96,111,133,104,75,162,93,56,66,240,8,50,84,229,49,210,173,239,141,1,87,18,2,198,143,57,225,160,58,217,168,206,245,204,199,6,73,60,20,230,211,233,94,200,88,9,74,155,33,15,219,130,226,202,83,236,42,172,165,218,55,222,46,107,98,154,109,67,196,178,127,158,13,243,65,79,166,248,25,224,115,80,68,51,184,128,232,208,151,122,26,212,105,43,179,213,235,148,146,89,14,195,28,78,112,76,250,47,24,251,140,108,186,190,228,170,183,139,39,188,244,246,132,48,119,144,180,138,134,193,82,182,120,121,86,220,209,3,91,241,149,85,205,150,113,216,31,100,41,164,177,214,153,231,38,71,185,174,97,201,29,95,7,92,54,254,191,118,34,221,131,11,163,99,234,81,227,147,156,176,17,142,69,12,110,62,27,255,0,194,59,116,242,252,19,21,187,53,207,129,64,135,61,40,167,237,102,223,106,159,197,189,215,137,36,32,22,5,23,125,161,52,103,117,70,37,247,101,203,169,124,126,44,123,152,238,145,45,171,114,253,10,192,136,4,157,249,30,35,72,175,63,77,90,181,16,96,111,133,104,75,162,93,56,66,240,8,50,84,229,49,210,173,239,141,1,87,18,2,198,143,57,225,160,58,217,168,206,245,204,199,6,73,60,20,230,211,233,94,200,88,9,74,155,33,15,219,130,226,202,83,236,42,172,165,218,55,222,46,107,98,154,109,67,196,178,127,158,13,243,65,79,166,248,25,224,115,80,68,51,184,128,232,208,151,122,26,212,105,43,179,213,235,148,146,89,14,195,28,78,112,76,250,47,24,251,140,108,186,190,228,170,183,139,39,188,244,246,132,48,119,144,180,138,134,193,82,182,120,121,86,220,209,3,91,241,149,85,205,150,113,216,31,100,41,164,177,214,153,231,38,71,185,174,97,201,29,95,7,92,54,254,191,118,34,221,131,11,163,99,234,81,227,147,156,176,17,142,69,12,110,62,27,255,0,194,59,116,242,252,19,21,187,53,207,129,64,135,61,40,167,237,102,223,106,159,197,189,215,137,36,32,22,5]),He=new Uint8Array([7,9,5,0,11,1,6,9,3,9,11,1,8,10,4,7,8,6,1,5,3,10,9,10,0,8,4,1,5,2,7,8,7,11,9,10,1,0,4,7,5,0,11,6,1,4,2,8,8,10,4,9,9,2,5,7,9,1,7,2,2,6,11,5,5,4,6,9,0,1,1,0,7,6,9,8,4,10,3,1,2,8,8,9,10,11,5,11,11,2,6,10,3,4,2,4,9,10,3,2,6,3,6,10,5,3,4,10,11,2,9,11,1,11,10,4,9,4,11,0,4,11,4,0,0,0,7,6,10,4,1,3,11,5,3,4,2,9,1,3,0,1,8,0,6,7,8,7,0,4,6,10,8,2,3,11,11,8,0,2,4,8,3,0,0,10,6,1,2,2,4,5,6,0,1,3,11,9,5,5,9,6,9,8,3,8,1,8,9,6,9,11,10,7,5,6,5,9,1,3,7,0,2,10,11,2,6,1,3,11,7,7,2,1,7,3,0,8,1,1,5,0,6,10,11,11,0,2,7,0,10,8,3,5,7,1,11,1,0,7,9,0,11,5,10,3,2,3,5,9,7,9,8,4,6,5,7,9,5,0,11,1,6,9,3,9,11,1,8,10,4,7,8,6,1,5,3,10,9,10,0,8,4,1,5,2,7,8,7,11,9,10,1,0,4,7,5,0,11,6,1,4,2,8,8,10,4,9,9,2,5,7,9,1,7,2,2,6,11,5,5,4,6,9,0,1,1,0,7,6,9,8,4,10,3,1,2,8,8,9,10,11,5,11,11,2,6,10,3,4,2,4,9,10,3,2,6,3,6,10,5,3,4,10,11,2,9,11,1,11,10,4,9,4,11,0,4,11,4,0,0,0,7,6,10,4,1,3,11,5,3,4,2,9,1,3,0,1,8,0,6,7,8,7,0,4,6,10,8,2,3,11,11,8,0,2,4,8,3,0,0,10,6,1,2,2,4,5,6,0,1,3,11,9,5,5,9,6,9,8,3,8,1,8,9,6,9,11,10,7,5,6,5,9,1,3,7,0,2,10,11,2,6,1,3,11,7,7,2,1,7,3,0,8,1,1,5,0,6,10,11,11,0,2,7,0,10,8,3,5,7,1,11,1,0,7,9,0,11,5,10,3,2,3,5,9,7,9,8,4,6,5]),pn=new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]);function hn(u){const r=u|0;return u<r?r-1:r}function We(u,r,e,t){const n=u*3;return pn[n]*r+pn[n+1]*e+pn[n+2]*t}function mn(u){return((u*6-15)*u+10)*u*u*u}function Mn(u,r,e,t,n,o,i){const a=t-1&255,s=n-1&255,l=o-1&255,d=hn(u),p=hn(r),f=hn(e),h=d&a,m=d+1&a,_=p&s,y=p+1&s,w=f&l,x=f+1&l,B=u-d,P=mn(B),S=r-p,M=mn(S),L=e-f,A=mn(L),O=ot[h+i],T=ot[m+i],v=ot[O+_],C=ot[O+y],g=ot[T+_],G=ot[T+y],b=We(He[v+w],B,S,L),k=We(He[v+x],B,S,L-1),U=We(He[C+w],B,S-1,L),F=We(He[C+x],B,S-1,L-1),W=We(He[g+w],B-1,S,L),V=We(He[g+x],B-1,S,L-1),Z=We(He[G+w],B-1,S-1,L),se=We(He[G+x],B-1,S-1,L-1),fe=b+(k-b)*A,re=U+(F-U)*A,te=W+(V-W)*A,X=Z+(se-Z)*A,J=fe+(re-fe)*M,R=te+(X-te)*M;return J+(R-J)*P}function Ce(u,r,e,t,n,o,i){return Mn(u,r,e,t,n,o,i&255)}function zo(u,r,e,t,n,o,i){let a=1,s=1,l=.5,d=0;for(let p=0;p<i;p++){let f=Mn(u*a,r*a,e*a,0,0,0,p&255);f=o-Math.abs(f),f=f*f,d+=f*l*s,s=f,a*=t,l*=n}return d}function Lr(u,r,e,t,n,o){let i=1,a=1,s=0;for(let l=0;l<o;l++)s+=Math.abs(Mn(u*i,r*i,e*i,0,0,0,l&255)*a),i*=t,a*=n;return s}const en=class en extends Uint32Array{constructor(e){super(6);c(this,"_seed");this._seed=0,this.seed=e??Date.now()}get seed(){return this[0]}set seed(e){this._seed=e,this[0]=e,this[1]=this[0]*1812433253+1>>>0,this[2]=this[1]*1812433253+1>>>0,this[3]=this[2]*1812433253+1>>>0,this[4]=0,this[5]=0}reset(){this.seed=this._seed}randomUint32(){let e=this[3];const t=this[0];return this[3]=this[2],this[2]=this[1],this[1]=t,e^=e>>>2,e^=e<<1,e^=t^t<<4,this[0]=e,this[4]=this[4]+362437>>>0,this[5]=e+this[4]>>>0,this[5]}randomFloat(e,t){const n=(this.randomUint32()&8388607)*11920930376163766e-23;return e===void 0?n:n*((t??1)-e)+e}randomDouble(e,t){const n=this.randomUint32()>>>5,o=this.randomUint32()>>>6,i=(n*67108864+o)*(1/9007199254740992);return e===void 0?i:i*((t??1)-e)+e}};c(en,"global",new en);let Ee=en;class Ze{constructor(){c(this,"gameObject")}onAttach(){}onDetach(){}update(r){}}class me{constructor(r="GameObject"){c(this,"name");c(this,"position");c(this,"rotation");c(this,"scale");c(this,"children",[]);c(this,"parent",null);c(this,"_components",[]);this.name=r,this.position=D.zero(),this.rotation=de.identity(),this.scale=D.one()}addComponent(r){return r.gameObject=this,this._components.push(r),r.onAttach(),r}getComponent(r){for(const e of this._components)if(e instanceof r)return e;return null}getComponents(r){return this._components.filter(e=>e instanceof r)}removeComponent(r){const e=this._components.indexOf(r);e!==-1&&(r.onDetach(),this._components.splice(e,1))}addChild(r){r.parent=this,this.children.push(r)}localToWorld(){const r=oe.trs(this.position,this.rotation.x,this.rotation.y,this.rotation.z,this.rotation.w,this.scale);return this.parent?this.parent.localToWorld().multiply(r):r}update(r){for(const e of this._components)e.update(r);for(const e of this.children)e.update(r)}}class Fo extends Ze{constructor(e=60,t=.1,n=1e3,o=16/9){super();c(this,"fov");c(this,"near");c(this,"far");c(this,"aspect");this.fov=e*(Math.PI/180),this.near=t,this.far=n,this.aspect=o}projectionMatrix(){return oe.perspective(this.fov,this.aspect,this.near,this.far)}viewMatrix(){return this.gameObject.localToWorld().invert()}viewProjectionMatrix(){return this.projectionMatrix().multiply(this.viewMatrix())}position(){const e=this.gameObject.localToWorld();return new D(e.data[12],e.data[13],e.data[14])}frustumCornersWorld(){const e=this.viewProjectionMatrix().invert();return[[-1,-1,0],[1,-1,0],[-1,1,0],[1,1,0],[-1,-1,1],[1,-1,1],[-1,1,1],[1,1,1]].map(([n,o,i])=>e.transformPoint(new D(n,o,i)))}}class Ho extends Ze{constructor(e=new D(.3,-1,.5),t=D.one(),n=1,o=3){super();c(this,"direction");c(this,"color");c(this,"intensity");c(this,"numCascades");this.direction=e.normalize(),this.color=t,this.intensity=n,this.numCascades=o}computeCascadeMatrices(e,t){const n=t??e.far,o=this._computeSplitDepths(e.near,n,this.numCascades),i=[];for(let a=0;a<this.numCascades;a++){const s=a===0?e.near:o[a-1],l=o[a],d=this._frustumCornersForSplit(e,s,l),p=d.reduce((g,G)=>g.add(G),D.zero()).scale(1/8),f=this.direction.normalize(),h=oe.lookAt(p.sub(f),p,new D(0,1,0)),m=2048;let _=0;for(const g of d)_=Math.max(_,g.sub(p).length());let y=2*_/m;_=Math.ceil(_/y)*y,_*=m/(m-2),y=2*_/m;let w=1/0,x=-1/0;for(const g of d){const G=h.transformPoint(g);w=Math.min(w,G.z),x=Math.max(x,G.z)}const B=Math.min((x-w)*.25,64);w-=B,x+=B;let P=oe.orthographic(-_,_,-_,_,-x,-w);const M=P.multiply(h).transformPoint(p),L=M.x*.5+.5,A=.5-M.y*.5,O=Math.round(L*m)/m,T=Math.round(A*m)/m,v=(O-L)*2,C=-(T-A)*2;P.set(3,0,P.get(3,0)+v),P.set(3,1,P.get(3,1)+C),i.push({lightViewProj:P.multiply(h),splitFar:l,depthRange:x-w,texelWorldSize:y})}return i}_computeSplitDepths(e,t,n){const i=[];for(let a=1;a<=n;a++){const s=e+(t-e)*(a/n),l=e*Math.pow(t/e,a/n);i.push(.75*l+(1-.75)*s)}return i}_frustumCornersForSplit(e,t,n){const o=e.near,i=e.far;e.near=t,e.far=n;const a=e.frustumCornersWorld();return e.near=o,e.far=i,a}}var xt=(u=>(u.Forward="forward",u.Geometry="geometry",u.SkinnedGeometry="skinnedGeometry",u))(xt||{});class Bi{constructor(){c(this,"transparent",!1)}}class Pe extends Ze{constructor(e,t){super();c(this,"mesh");c(this,"material");c(this,"castShadow",!0);this.mesh=e,this.material=t}}class Si{constructor(){c(this,"gameObjects",[])}add(r){this.gameObjects.push(r)}remove(r){const e=this.gameObjects.indexOf(r);e!==-1&&this.gameObjects.splice(e,1)}update(r){for(const e of this.gameObjects)e.update(r)}findCamera(){for(const r of this.gameObjects){const e=r.getComponent(Fo);if(e)return e}return null}findDirectionalLight(){for(const r of this.gameObjects){const e=r.getComponent(Ho);if(e)return e}return null}collectMeshRenderers(){const r=[];for(const e of this.gameObjects)this._collectMeshRenderersRecursive(e,r);return r}_collectMeshRenderersRecursive(r,e){const t=r.getComponent(Pe);t&&e.push(t);for(const n of r.children)this._collectMeshRenderersRecursive(n,e)}getComponents(r){const e=[];for(const t of this.gameObjects){const n=t.getComponent(r);n&&e.push(n)}return e}}const Pi=[new D(1,0,0),new D(-1,0,0),new D(0,1,0),new D(0,-1,0),new D(0,0,1),new D(0,0,-1)],Gi=[new D(0,-1,0),new D(0,-1,0),new D(0,0,1),new D(0,0,-1),new D(0,-1,0),new D(0,-1,0)];class Un extends Ze{constructor(){super(...arguments);c(this,"color",D.one());c(this,"intensity",1);c(this,"radius",10);c(this,"castShadow",!1)}worldPosition(){return this.gameObject.localToWorld().transformPoint(D.zero())}cubeFaceViewProjs(e=.05){const t=this.worldPosition(),n=oe.perspective(Math.PI/2,1,e,this.radius),o=new Array(6);for(let i=0;i<6;i++)o[i]=n.multiply(oe.lookAt(t,t.add(Pi[i]),Gi[i]));return o}}class Wo extends Ze{constructor(){super(...arguments);c(this,"color",D.one());c(this,"intensity",1);c(this,"range",20);c(this,"innerAngle",15);c(this,"outerAngle",30);c(this,"castShadow",!1);c(this,"projectionTexture",null)}worldPosition(){return this.gameObject.localToWorld().transformPoint(D.zero())}worldDirection(){return this.gameObject.localToWorld().transformDirection(new D(0,0,-1)).normalize()}lightViewProj(e=.1){const t=this.worldPosition(),n=this.worldDirection(),o=Math.abs(n.y)>.99?new D(1,0,0):new D(0,1,0),i=oe.lookAt(t,t.add(n),o);return oe.perspective(this.outerAngle*2*Math.PI/180,1,e,this.range).multiply(i)}}const Ti=new D(0,1,0);class Ei extends Ze{constructor(e){super();c(this,"_world");c(this,"_state","idle");c(this,"_timer",0);c(this,"_targetX",0);c(this,"_targetZ",0);c(this,"_hasTarget",!1);c(this,"_velY",0);c(this,"_yaw",0);c(this,"_headGO",null);c(this,"_headBaseY",0);c(this,"_bobPhase");this._world=e,this._timer=1+Math.random()*5,this._yaw=Math.random()*Math.PI*2,this._bobPhase=Math.random()*Math.PI*2}onAttach(){for(const e of this.gameObject.children)if(e.name==="Pig.Head"){this._headGO=e,this._headBaseY=e.position.y;break}}update(e){const t=this.gameObject,n=t.position.x,o=t.position.z;this._velY-=9.8*e,t.position.y+=this._velY*e;const i=this._world.getTopBlockY(Math.floor(n),Math.floor(o),Math.ceil(t.position.y)+4);switch(i>0&&t.position.y<=i+.1&&(t.position.y=i,this._velY=0),this._state){case"idle":{this._timer-=e,this._timer<=0&&this._pickWanderTarget();break}case"wander":{if(this._timer-=e,!this._hasTarget||this._timer<=0){this._enterIdle();break}const a=this._targetX-n,s=this._targetZ-o,l=a*a+s*s;if(l<.25){this._enterIdle();break}const d=Math.sqrt(l);t.position.x+=a/d*1.2*e,t.position.z+=s/d*1.2*e,this._yaw=Math.atan2(-(a/d),-(s/d));break}}if(t.rotation=de.fromAxisAngle(Ti,this._yaw),this._headGO){this._bobPhase+=e*(this._state==="wander"?4:1.5);const a=this._state==="wander"?.014:.005;this._headGO.position.y=this._headBaseY+Math.sin(this._bobPhase)*a}}_enterIdle(){this._state="idle",this._hasTarget=!1,this._timer=3+Math.random()*5}_pickWanderTarget(){const e=this.gameObject,t=Math.random()*Math.PI*2,n=4+Math.random()*8;this._targetX=e.position.x+Math.cos(t)*n,this._targetZ=e.position.z+Math.sin(t)*n,this._hasTarget=!0,this._state="wander",this._timer=8+Math.random()*7}}const Ai=new D(0,1,0);class Mi extends Ze{constructor(e,t){super();c(this,"_parent");c(this,"_world");c(this,"_velY",0);c(this,"_yaw",0);c(this,"_headGO",null);c(this,"_headBaseY",0);c(this,"_bobPhase");c(this,"_offsetAngle");c(this,"_followDist");this._parent=e,this._world=t,this._offsetAngle=Math.random()*Math.PI*2,this._followDist=.55+Math.random()*.5,this._bobPhase=Math.random()*Math.PI*2}onAttach(){for(const e of this.gameObject.children)if(e.name==="Duckling.Head"){this._headGO=e,this._headBaseY=e.position.y;break}}update(e){const t=this.gameObject,n=t.position.x,o=t.position.z;this._velY-=9.8*e,t.position.y+=this._velY*e;const i=this._world.getTopBlockY(Math.floor(n),Math.floor(o),Math.ceil(t.position.y)+4);i>0&&t.position.y<=i+.1&&(t.position.y=i,this._velY=0),this._offsetAngle+=e*.25;const a=this._parent.position.x+Math.cos(this._offsetAngle)*this._followDist,s=this._parent.position.z+Math.sin(this._offsetAngle)*this._followDist,l=a-n,d=s-o,p=l*l+d*d;let f=!1;if(p>.04){const h=Math.sqrt(p),m=h>2.5?3.5:1.8,_=l/h,y=d/h;t.position.x+=_*m*e,t.position.z+=y*m*e,this._yaw=Math.atan2(-_,-y),f=!0}if(t.rotation=de.fromAxisAngle(Ai,this._yaw),this._headGO){this._bobPhase+=e*(f?7:2);const h=f?.012:.004;this._headGO.position.y=this._headBaseY+Math.sin(this._bobPhase)*h}}}const Ui=new D(0,1,0),Ci=new D(1,0,0),ki=3;class Li{constructor(r=0,e=0,t=5,n=.002){c(this,"yaw");c(this,"pitch");c(this,"speed");c(this,"sensitivity");c(this,"inputForward",0);c(this,"inputStrafe",0);c(this,"inputUp",!1);c(this,"inputDown",!1);c(this,"inputFast",!1);c(this,"_keys",new Set);c(this,"_canvas",null);c(this,"_onMouseMove");c(this,"_onKeyDown");c(this,"_onKeyUp");c(this,"_onClick");c(this,"usePointerLock",!0);this.yaw=r,this.pitch=e,this.speed=t,this.sensitivity=n;const o=Math.PI/2-.001;this._onMouseMove=i=>{document.pointerLockElement===this._canvas&&(this.yaw-=i.movementX*this.sensitivity,this.pitch=Math.max(-o,Math.min(o,this.pitch+i.movementY*this.sensitivity)))},this._onKeyDown=i=>this._keys.add(i.code),this._onKeyUp=i=>this._keys.delete(i.code),this._onClick=()=>{var i;this.usePointerLock&&((i=this._canvas)==null||i.requestPointerLock())}}attach(r){this._canvas=r,r.addEventListener("click",this._onClick),document.addEventListener("mousemove",this._onMouseMove),document.addEventListener("keydown",this._onKeyDown),document.addEventListener("keyup",this._onKeyUp)}pressKey(r){this._keys.add(r)}applyLookDelta(r,e){const t=Math.PI/2-.001;this.yaw-=r*this.sensitivity,this.pitch=Math.max(-t,Math.min(t,this.pitch+e*this.sensitivity))}detach(){this._canvas&&(this._canvas.removeEventListener("click",this._onClick),document.removeEventListener("mousemove",this._onMouseMove),document.removeEventListener("keydown",this._onKeyDown),document.removeEventListener("keyup",this._onKeyUp),this._canvas=null)}update(r,e){const t=Math.sin(this.yaw),n=Math.cos(this.yaw);let o=0,i=0,a=0;(this._keys.has("KeyW")||this._keys.has("ArrowUp"))&&(o-=t,a-=n),(this._keys.has("KeyS")||this._keys.has("ArrowDown"))&&(o+=t,a+=n),(this._keys.has("KeyA")||this._keys.has("ArrowLeft"))&&(o-=n,a+=t),(this._keys.has("KeyD")||this._keys.has("ArrowRight"))&&(o+=n,a-=t),this.inputForward!==0&&(o-=t*this.inputForward,a-=n*this.inputForward),this.inputStrafe!==0&&(o+=n*this.inputStrafe,a-=t*this.inputStrafe),(this._keys.has("Space")||this.inputUp)&&(i+=1),(this._keys.has("ShiftLeft")||this.inputDown)&&(i-=1);const s=Math.sqrt(o*o+i*i+a*a);if(s>0){const l=this._keys.has("ControlLeft")||this._keys.has("AltLeft")||this.inputFast,d=this.speed*(l?ki:1)*e/s;r.position.x+=o*d,r.position.y+=i*d,r.position.z+=a*d}r.rotation=de.fromAxisAngle(Ui,this.yaw).multiply(de.fromAxisAngle(Ci,-this.pitch))}}const Ni=400,Ri=16,jo=Ni/Ri;var N=(u=>(u[u.NONE=0]="NONE",u[u.GRASS=1]="GRASS",u[u.SAND=2]="SAND",u[u.STONE=3]="STONE",u[u.DIRT=4]="DIRT",u[u.TRUNK=5]="TRUNK",u[u.TREELEAVES=6]="TREELEAVES",u[u.WATER=7]="WATER",u[u.GLASS=8]="GLASS",u[u.FLOWER=9]="FLOWER",u[u.GLOWSTONE=10]="GLOWSTONE",u[u.MAGMA=11]="MAGMA",u[u.OBSIDIAN=12]="OBSIDIAN",u[u.DIAMOND=13]="DIAMOND",u[u.IRON=14]="IRON",u[u.SPECULAR=15]="SPECULAR",u[u.CACTUS=16]="CACTUS",u[u.SNOW=17]="SNOW",u[u.GRASS_SNOW=18]="GRASS_SNOW",u[u.SPRUCE_PLANKS=19]="SPRUCE_PLANKS",u[u.GRASS_PROP=20]="GRASS_PROP",u[u.TORCH=21]="TORCH",u[u.DEAD_BUSH=22]="DEAD_BUSH",u[u.SNOWYLEAVES=23]="SNOWYLEAVES",u[u.AMETHYST=24]="AMETHYST",u[u.MAX=25]="MAX",u))(N||{});class le{constructor(r,e,t,n){c(this,"blockType");c(this,"sideFace");c(this,"bottomFace");c(this,"topFace");this.blockType=r,this.sideFace=e,this.bottomFace=t,this.topFace=n}}const nn=[new le(0,new I(0,0),new I(0,0),new I(0,0)),new le(1,new I(1,0),new I(3,0),new I(2,0)),new le(2,new I(4,0),new I(4,0),new I(4,0)),new le(3,new I(5,0),new I(5,0),new I(5,0)),new le(4,new I(6,0),new I(6,0),new I(6,0)),new le(5,new I(7,0),new I(8,0),new I(8,0)),new le(6,new I(9,0),new I(9,0),new I(9,0)),new le(7,new I(2,29),new I(2,29),new I(2,29)),new le(8,new I(10,0),new I(10,0),new I(10,0)),new le(9,new I(23,0),new I(23,0),new I(23,0)),new le(10,new I(11,0),new I(11,0),new I(11,0)),new le(11,new I(12,0),new I(12,0),new I(12,0)),new le(12,new I(13,0),new I(13,0),new I(13,0)),new le(13,new I(14,0),new I(14,0),new I(14,0)),new le(14,new I(15,0),new I(15,0),new I(15,0)),new le(15,new I(0,24),new I(0,24),new I(0,24)),new le(16,new I(17,0),new I(18,0),new I(16,0)),new le(17,new I(19,0),new I(19,0),new I(19,0)),new le(18,new I(20,0),new I(3,0),new I(21,0)),new le(19,new I(22,0),new I(22,0),new I(22,0)),new le(20,new I(1,1),new I(1,1),new I(1,1)),new le(21,new I(2,1),new I(2,1),new I(2,1)),new le(22,new I(3,1),new I(3,1),new I(3,1)),new le(23,new I(4,1),new I(9,0),new I(21,0)),new le(24,new I(5,1),new I(5,1),new I(5,1)),new le(25,new I(0,0),new I(0,0),new I(0,0))];class ce{constructor(r,e,t,n){c(this,"blockType");c(this,"materialType");c(this,"emitsLight");c(this,"collidable");this.blockType=r,this.materialType=e,this.emitsLight=t,this.collidable=n}}const Bt=[new ce(0,1,0,0),new ce(1,0,0,1),new ce(2,0,0,1),new ce(3,0,0,1),new ce(4,0,0,1),new ce(5,0,0,1),new ce(6,1,0,1),new ce(7,2,0,0),new ce(8,1,0,1),new ce(9,3,0,0),new ce(10,0,1,1),new ce(11,0,1,1),new ce(12,0,0,1),new ce(13,0,0,1),new ce(14,0,0,1),new ce(15,0,0,1),new ce(16,0,0,1),new ce(17,0,0,1),new ce(18,0,0,1),new ce(19,0,0,1),new ce(20,3,0,0),new ce(21,3,1,0),new ce(22,3,0,0),new ce(23,1,0,1),new ce(24,0,0,1)],Ii=["None","Grass","Sand","Stone","Dirt","Trunk","Tree leaves","Water","Glass","Flower","Glowstone","Magma","Obsidian","Diamond","Iron","Specular","Cactus","Snow","Grass snow","Spruce planks","Grass prop","Torch","Dead bush","Snowy leaves","Amethyst","Max"];function ue(u){return Bt[u].materialType===2}function it(u){return Bt[u].materialType===1||Bt[u].materialType===3}function Nr(u){return Bt[u].emitsLight===1}function Me(u){return Bt[u].materialType===3}const Oi=new D(0,1,0),Vi=new D(1,0,0),Di=-28,zi=-4,Fi=1.3,Hi=4.3,Wi=7,ji=11.5,qi=3.5,Se=.3,_t=1.8,Rr=1.62;class Yi{constructor(r,e=Math.PI,t=.1){c(this,"yaw");c(this,"pitch");c(this,"sensitivity",.002);c(this,"inputForward",0);c(this,"inputStrafe",0);c(this,"inputJump",!1);c(this,"inputSneak",!1);c(this,"inputSprint",!1);c(this,"_velY",0);c(this,"_onGround",!1);c(this,"_prevInWater",!1);c(this,"_coyoteFrames",0);c(this,"_keys",new Set);c(this,"_canvas",null);c(this,"_world");c(this,"_onMouseMove");c(this,"_onKeyDown");c(this,"_onKeyUp");c(this,"_onClick");c(this,"usePointerLock",!0);this._world=r,this.yaw=e,this.pitch=t;const n=Math.PI/2-.001;this._onMouseMove=o=>{document.pointerLockElement===this._canvas&&(this.yaw-=o.movementX*this.sensitivity,this.pitch=Math.max(-n,Math.min(n,this.pitch+o.movementY*this.sensitivity)))},this._onKeyDown=o=>this._keys.add(o.code),this._onKeyUp=o=>this._keys.delete(o.code),this._onClick=()=>{var o;this.usePointerLock&&((o=this._canvas)==null||o.requestPointerLock())}}set velY(r){this._velY=r}attach(r){this._canvas=r,r.addEventListener("click",this._onClick),document.addEventListener("mousemove",this._onMouseMove),document.addEventListener("keydown",this._onKeyDown),document.addEventListener("keyup",this._onKeyUp)}applyLookDelta(r,e){const t=Math.PI/2-.001;this.yaw-=r*this.sensitivity,this.pitch=Math.max(-t,Math.min(t,this.pitch+e*this.sensitivity))}detach(){this._canvas&&(this._canvas.removeEventListener("click",this._onClick),document.removeEventListener("mousemove",this._onMouseMove),document.removeEventListener("keydown",this._onKeyDown),document.removeEventListener("keyup",this._onKeyUp),this._canvas=null)}update(r,e){e=Math.min(e,.05),r.rotation=de.fromAxisAngle(Oi,this.yaw).multiply(de.fromAxisAngle(Vi,-this.pitch));const t=Math.sin(this.yaw),n=Math.cos(this.yaw),o=this._keys.has("ControlLeft")||this._keys.has("AltLeft")||this.inputSprint,i=this._keys.has("ShiftLeft")||this.inputSneak,a=o?Wi:i?Fi:Hi;let s=0,l=0;(this._keys.has("KeyW")||this._keys.has("ArrowUp"))&&(s-=t,l-=n),(this._keys.has("KeyS")||this._keys.has("ArrowDown"))&&(s+=t,l+=n),(this._keys.has("KeyA")||this._keys.has("ArrowLeft"))&&(s-=n,l+=t),(this._keys.has("KeyD")||this._keys.has("ArrowRight"))&&(s+=n,l-=t),this.inputForward!==0&&(s-=t*this.inputForward,l-=n*this.inputForward),this.inputStrafe!==0&&(s+=n*this.inputStrafe,l-=t*this.inputStrafe);const d=Math.sqrt(s*s+l*l);if(d>0){const B=1/Math.max(d,1);s=s*B*a,l=l*B*a}let p=r.position.x,f=r.position.y-Rr,h=r.position.z;const m=ue(this._world.getBlockType(Math.floor(p),Math.floor(f+_t*.5),Math.floor(h))),_=this._keys.has("Space")||this.inputJump;m?(_&&(this._velY=qi),this._velY=Math.max(this._velY+zi*e,-2)):(this._prevInWater&&this._velY>0&&(this._velY=0),_&&(this._onGround||this._coyoteFrames>0)&&(this._velY=ji,this._coyoteFrames=0),this._velY=Math.max(this._velY+Di*e,-50)),p=this._slideX(p+s*e,f,h,s),h=this._slideZ(p,f,h+l*e,l);const[y,w,x]=this._slideY(p,f+this._velY*e,h);(w||x)&&(this._velY=0),f=y,this._onGround=w,this._prevInWater=m,w?this._coyoteFrames=6:m||(this._coyoteFrames=Math.max(0,this._coyoteFrames-1)),r.position.x=p,r.position.y=f+Rr,r.position.z=h}_isSolid(r,e,t){const n=this._world.getBlockType(r,e,t);return n!==N.NONE&&!ue(n)&&!Me(n)}_slideX(r,e,t,n){if(Math.abs(n)<1e-6)return r;const o=n>0?r+Se:r-Se,i=Math.floor(o),a=Math.floor(e+.01),s=Math.floor(e+_t-.01),l=Math.floor(t-Se+.01),d=Math.floor(t+Se-.01);for(let p=a;p<=s;p++)for(let f=l;f<=d;f++)if(this._isSolid(i,p,f))return n>0?i-Se-.001:i+1+Se+.001;return r}_slideZ(r,e,t,n){if(Math.abs(n)<1e-6)return t;const o=n>0?t+Se:t-Se,i=Math.floor(o),a=Math.floor(e+.01),s=Math.floor(e+_t-.01),l=Math.floor(r-Se+.01),d=Math.floor(r+Se-.01);for(let p=a;p<=s;p++)for(let f=l;f<=d;f++)if(this._isSolid(f,p,i))return n>0?i-Se-.001:i+1+Se+.001;return t}_slideY(r,e,t){const n=Math.floor(r-Se+.01),o=Math.floor(r+Se-.01),i=Math.floor(t-Se+.01),a=Math.floor(t+Se-.01);if(this._velY<=0){const s=Math.floor(e-.001);for(let l=n;l<=o;l++)for(let d=i;d<=a;d++)if(this._isSolid(l,s,d))return[s+1,!0,!1];return[e,!1,!1]}else{const s=Math.floor(e+_t);for(let l=n;l<=o;l++)for(let d=i;d<=a;d++)if(this._isSolid(l,s,d))return[s-_t-.001,!1,!0];return[e,!1,!1]}}}class Cn{constructor(r,e,t,n,o,i){c(this,"device");c(this,"queue");c(this,"context");c(this,"format");c(this,"canvas");c(this,"hdr");c(this,"enableErrorHandling");this.device=r,this.queue=r.queue,this.context=e,this.format=t,this.canvas=n,this.hdr=o,this.enableErrorHandling=i}get width(){return this.canvas.width}get height(){return this.canvas.height}static async create(r,e={}){if(!navigator.gpu)throw new Error("WebGPU not supported");const t=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!t)throw new Error("No WebGPU adapter found");const n=await t.requestDevice({requiredFeatures:[]});e.enableErrorHandling&&n.addEventListener("uncapturederror",s=>{const l=s.error;l instanceof GPUValidationError?console.error("[WebGPU Validation Error]",l.message):l instanceof GPUOutOfMemoryError?console.error("[WebGPU Out of Memory]"):console.error("[WebGPU Internal Error]",l)});const o=r.getContext("webgpu");let i,a=!1;try{o.configure({device:n,format:"rgba16float",alphaMode:"opaque",colorSpace:"display-p3",toneMapping:{mode:"extended"}}),i="rgba16float",a=!0}catch{i=navigator.gpu.getPreferredCanvasFormat(),o.configure({device:n,format:i,alphaMode:"opaque"})}return r.width=r.clientWidth*devicePixelRatio,r.height=r.clientHeight*devicePixelRatio,new Cn(n,o,i,r,a,e.enableErrorHandling??!1)}getCurrentTexture(){return this.context.getCurrentTexture()}createBuffer(r,e,t){return this.device.createBuffer({size:r,usage:e,label:t})}writeBuffer(r,e,t=0){e instanceof ArrayBuffer?this.queue.writeBuffer(r,t,e):this.queue.writeBuffer(r,t,e.buffer,e.byteOffset,e.byteLength)}pushInitErrorScope(){this.enableErrorHandling&&this.device.pushErrorScope("validation")}async popInitErrorScope(r){if(this.enableErrorHandling){const e=await this.device.popErrorScope();e&&(console.error(`[Init:${r}] Validation Error:`,e.message),console.trace())}}pushFrameErrorScope(){this.enableErrorHandling&&this.device.pushErrorScope("validation")}async popFrameErrorScope(){if(this.enableErrorHandling){const r=await this.device.popErrorScope();r&&(console.error("[Frame] Validation Error:",r.message),console.trace())}}pushPassErrorScope(r){this.enableErrorHandling&&(this.device.pushErrorScope("validation"),this.device.pushErrorScope("out-of-memory"),this.device.pushErrorScope("internal"))}async popPassErrorScope(r){if(this.enableErrorHandling){const e=await this.device.popErrorScope();e&&console.error(`[${r}] Internal Error:`,e),await this.device.popErrorScope()&&console.error(`[${r}] Out of Memory`);const n=await this.device.popErrorScope();n&&console.error(`[${r}] Validation Error:`,n.message)}}}class be{constructor(){c(this,"enabled",!0)}destroy(){}}class Jt{constructor(r,e,t,n,o){c(this,"albedoRoughness");c(this,"normalMetallic");c(this,"depth");c(this,"albedoRoughnessView");c(this,"normalMetallicView");c(this,"depthView");c(this,"width");c(this,"height");this.albedoRoughness=r,this.normalMetallic=e,this.depth=t,this.width=n,this.height=o,this.albedoRoughnessView=r.createView(),this.normalMetallicView=e.createView(),this.depthView=t.createView()}static create(r){const{device:e,width:t,height:n}=r,o=e.createTexture({label:"GBuffer AlbedoRoughness",size:{width:t,height:n},format:"rgba8unorm",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),i=e.createTexture({label:"GBuffer NormalMetallic",size:{width:t,height:n},format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),a=e.createTexture({label:"GBuffer Depth",size:{width:t,height:n},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING});return new Jt(o,i,a,t,n)}destroy(){this.albedoRoughness.destroy(),this.normalMetallic.destroy(),this.depth.destroy()}}const kn=48,Ln=[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x3"},{shaderLocation:2,offset:24,format:"float32x2"},{shaderLocation:3,offset:32,format:"float32x4"}];class ke{constructor(r,e,t){c(this,"vertexBuffer");c(this,"indexBuffer");c(this,"indexCount");this.vertexBuffer=r,this.indexBuffer=e,this.indexCount=t}destroy(){this.vertexBuffer.destroy(),this.indexBuffer.destroy()}static fromData(r,e,t){const n=r.createBuffer({label:"Mesh VertexBuffer",size:e.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(n,0,e.buffer,e.byteOffset,e.byteLength);const o=r.createBuffer({label:"Mesh IndexBuffer",size:t.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(o,0,t.buffer,t.byteOffset,t.byteLength),new ke(n,o,t.length)}static createCube(r,e=1){const t=e/2,n=[{normal:[0,0,1],tangent:[1,0,0,1],verts:[[-t,-t,t],[t,-t,t],[t,t,t],[-t,t,t]]},{normal:[0,0,-1],tangent:[-1,0,0,1],verts:[[t,-t,-t],[-t,-t,-t],[-t,t,-t],[t,t,-t]]},{normal:[1,0,0],tangent:[0,0,-1,1],verts:[[t,-t,t],[t,-t,-t],[t,t,-t],[t,t,t]]},{normal:[-1,0,0],tangent:[0,0,1,1],verts:[[-t,-t,-t],[-t,-t,t],[-t,t,t],[-t,t,-t]]},{normal:[0,1,0],tangent:[1,0,0,1],verts:[[-t,t,t],[t,t,t],[t,t,-t],[-t,t,-t]]},{normal:[0,-1,0],tangent:[1,0,0,1],verts:[[-t,-t,-t],[t,-t,-t],[t,-t,t],[-t,-t,t]]}],o=[[0,1],[1,1],[1,0],[0,0]],i=[],a=[];let s=0;for(const l of n){for(let d=0;d<4;d++)i.push(...l.verts[d],...l.normal,...o[d],...l.tangent);a.push(s,s+1,s+2,s,s+2,s+3),s+=4}return ke.fromData(r,new Float32Array(i),new Uint32Array(a))}static createSphere(r,e=.5,t=32,n=32){const o=[],i=[];for(let a=0;a<=t;a++){const s=a/t*Math.PI,l=Math.sin(s),d=Math.cos(s);for(let p=0;p<=n;p++){const f=p/n*Math.PI*2,h=Math.sin(f),m=Math.cos(f),_=l*m,y=d,w=l*h;o.push(_*e,y*e,w*e,_,y,w,p/n,a/t,-h,0,m,1)}}for(let a=0;a<t;a++)for(let s=0;s<n;s++){const l=a*(n+1)+s,d=l+n+1;i.push(l,l+1,d),i.push(l+1,d+1,d)}return ke.fromData(r,new Float32Array(o),new Uint32Array(i))}static createCone(r,e=.5,t=1,n=16){const o=[],i=[],a=Math.sqrt(t*t+e*e),s=t/a,l=e/a;o.push(0,t,0,0,1,0,.5,0,1,0,0,1);const d=1;for(let h=0;h<=n;h++){const m=h/n*Math.PI*2,_=Math.cos(m),y=Math.sin(m);o.push(_*e,0,y*e,_*s,l,y*s,h/n,1,_,0,y,1)}for(let h=0;h<n;h++)i.push(0,d+h+1,d+h);const p=d+n+1;o.push(0,0,0,0,-1,0,.5,.5,1,0,0,1);const f=p+1;for(let h=0;h<=n;h++){const m=h/n*Math.PI*2,_=Math.cos(m),y=Math.sin(m);o.push(_*e,0,y*e,0,-1,0,.5+_*.5,.5+y*.5,1,0,0,1)}for(let h=0;h<n;h++)i.push(p,f+h,f+h+1);return ke.fromData(r,new Float32Array(o),new Uint32Array(i))}static createPlane(r,e=10,t=10,n=1,o=1){const i=[],a=[];for(let s=0;s<=o;s++)for(let l=0;l<=n;l++){const d=(l/n-.5)*e,p=(s/o-.5)*t,f=l/n,h=s/o;i.push(d,0,p,0,1,0,f,h,1,0,0,1)}for(let s=0;s<o;s++)for(let l=0;l<n;l++){const d=s*(n+1)+l;a.push(d,d+n+1,d+1,d+1,d+n+1,d+n+2)}return ke.fromData(r,new Float32Array(i),new Uint32Array(a))}}const qo=`// Shadow map rendering shader - outputs depth only

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
`,Ir=2048,kt=4;class Nn extends be{constructor(e,t,n,o,i,a,s,l){super();c(this,"name","ShadowPass");c(this,"shadowMap");c(this,"shadowMapView");c(this,"shadowMapArrayViews");c(this,"_pipeline");c(this,"_shadowBindGroups");c(this,"_shadowUniformBuffers");c(this,"_modelUniformBuffers",[]);c(this,"_modelBindGroups",[]);c(this,"_cascadeCount");c(this,"_cascades",[]);c(this,"_modelBGL");c(this,"_sceneSnapshot",[]);this.shadowMap=e,this.shadowMapView=t,this.shadowMapArrayViews=n,this._pipeline=o,this._shadowBindGroups=i,this._shadowUniformBuffers=a,this._modelBGL=s,this._cascadeCount=l}static create(e,t=3){const{device:n}=e,o=n.createTexture({label:"ShadowMap",size:{width:Ir,height:Ir,depthOrArrayLayers:kt},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),i=o.createView({dimension:"2d-array"}),a=Array.from({length:kt},(m,_)=>o.createView({dimension:"2d",baseArrayLayer:_,arrayLayerCount:1})),s=n.createBindGroupLayout({label:"ShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),l=n.createBindGroupLayout({label:"ModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),d=[],p=[];for(let m=0;m<kt;m++){const _=n.createBuffer({label:`ShadowUniformBuffer ${m}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});d.push(_),p.push(n.createBindGroup({label:`ShadowBindGroup ${m}`,layout:s,entries:[{binding:0,resource:{buffer:_}}]}))}const f=n.createShaderModule({label:"ShadowShader",code:qo}),h=n.createRenderPipeline({label:"ShadowPipeline",layout:n.createPipelineLayout({bindGroupLayouts:[s,l]}),vertex:{module:f,entryPoint:"vs_main",buffers:[{arrayStride:kn,attributes:[Ln[0]]}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less",depthBias:2,depthBiasSlopeScale:2.5,depthBiasClamp:0},primitive:{topology:"triangle-list",cullMode:"back"}});return new Nn(o,i,a,h,p,d,l,t)}updateScene(e,t,n,o){this._cascades=n.computeCascadeMatrices(t,o),this._cascadeCount=Math.min(this._cascades.length,kt)}execute(e,t){const{device:n}=t,o=this._getMeshRenderers(t);this._ensureModelBuffers(n,o.length);for(let i=0;i<this._cascadeCount&&!(i>=this._cascades.length);i++){const a=this._cascades[i];t.queue.writeBuffer(this._shadowUniformBuffers[i],0,a.lightViewProj.data.buffer);const s=e.beginRenderPass({label:`ShadowPass cascade ${i}`,colorAttachments:[],depthStencilAttachment:{view:this.shadowMapArrayViews[i],depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});s.setPipeline(this._pipeline),s.setBindGroup(0,this._shadowBindGroups[i]);for(let l=0;l<o.length;l++){const{mesh:d,modelMatrix:p}=o[l],f=this._modelUniformBuffers[l];t.queue.writeBuffer(f,0,p.data.buffer),s.setBindGroup(1,this._modelBindGroups[l]),s.setVertexBuffer(0,d.vertexBuffer),s.setIndexBuffer(d.indexBuffer,"uint32"),s.drawIndexed(d.indexCount)}s.end()}}_getMeshRenderers(e){return this._sceneSnapshot??[]}setSceneSnapshot(e){this._sceneSnapshot=e}_ensureModelBuffers(e,t){for(;this._modelUniformBuffers.length<t;){const n=e.createBuffer({label:`ModelUniform ${this._modelUniformBuffers.length}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),o=e.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:n}}]});this._modelUniformBuffers.push(n),this._modelBindGroups.push(o)}}destroy(){this.shadowMap.destroy();for(const e of this._shadowUniformBuffers)e.destroy();for(const e of this._modelUniformBuffers)e.destroy()}}const Xi=`// Deferred PBR lighting pass — fullscreen triangle, reads GBuffer + shadow maps + IBL.

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
`,ie="rgba16float",Or=64*4+16+16,Vr=368;class Rn extends be{constructor(e,t,n,o,i,a,s,l,d,p,f,h,m,_,y,w){super();c(this,"name","LightingPass");c(this,"hdrTexture");c(this,"hdrView");c(this,"cameraBuffer");c(this,"lightBuffer");c(this,"_pipeline");c(this,"_sceneBindGroup");c(this,"_gbufferBindGroup");c(this,"_aoBindGroup");c(this,"_iblBindGroup");c(this,"_defaultCloudShadow");c(this,"_defaultSsgi");c(this,"_device");c(this,"_aoBGL");c(this,"_aoView");c(this,"_aoSampler");c(this,"_ssgiSampler");c(this,"_cameraScratch",new Float32Array(Or/4));c(this,"_lightScratch",new Float32Array(Vr/4));c(this,"_lightScratchU",new Uint32Array(this._lightScratch.buffer));c(this,"_cloudShadowScratch",new Float32Array(3));this.hdrTexture=e,this.hdrView=t,this._pipeline=n,this._sceneBindGroup=o,this._gbufferBindGroup=i,this._aoBindGroup=a,this._iblBindGroup=s,this.cameraBuffer=l,this.lightBuffer=d,this._defaultCloudShadow=p,this._defaultSsgi=f,this._device=h,this._aoBGL=m,this._aoView=_,this._aoSampler=y,this._ssgiSampler=w}static create(e,t,n,o,i,a){const{device:s,width:l,height:d}=e,p=s.createTexture({label:"HDR Texture",size:{width:l,height:d},format:ie,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),f=p.createView(),h=s.createBuffer({label:"LightCameraBuffer",size:Or,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),m=s.createBuffer({label:"LightBuffer",size:Vr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),_=s.createSampler({label:"ShadowSampler",compare:"less-equal",magFilter:"linear",minFilter:"linear"}),y=s.createSampler({label:"GBufferLinearSampler",magFilter:"linear",minFilter:"linear"}),w=s.createSampler({label:"AoSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),x=s.createSampler({label:"SsgiSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),B=s.createBindGroupLayout({label:"LightSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),P=s.createBindGroupLayout({label:"LightGBufferBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth",viewDimension:"2d-array"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"comparison"}},{binding:5,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:6,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),S=s.createTexture({label:"DefaultCloudShadow",size:{width:1,height:1},format:"r8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});s.queue.writeTexture({texture:S},new Uint8Array([255]),{bytesPerRow:1},{width:1,height:1});const M=i??S.createView(),L=s.createBindGroupLayout({label:"LightAoBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),A=s.createTexture({label:"DefaultSsgi",size:{width:1,height:1},format:ie,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),O=s.createBindGroupLayout({label:"LightIblBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),T=s.createSampler({label:"IblSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge"}),v=s.createTexture({label:"DefaultIblCube",size:{width:1,height:1,depthOrArrayLayers:6},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),C=v.createView({dimension:"cube"}),g=s.createTexture({label:"DefaultBrdfLut",size:{width:1,height:1},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),G=s.createBindGroup({label:"LightIblBG",layout:O,entries:[{binding:0,resource:(a==null?void 0:a.irradianceView)??C},{binding:1,resource:(a==null?void 0:a.prefilteredView)??C},{binding:2,resource:(a==null?void 0:a.brdfLutView)??g.createView()},{binding:3,resource:T}]});v.destroy(),g.destroy();const b=s.createBindGroup({layout:B,entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:{buffer:m}}]}),k=s.createBindGroup({layout:P,entries:[{binding:0,resource:t.albedoRoughnessView},{binding:1,resource:t.normalMetallicView},{binding:2,resource:t.depthView},{binding:3,resource:n.shadowMapView},{binding:4,resource:_},{binding:5,resource:y},{binding:6,resource:M}]}),U=s.createBindGroup({label:"LightAoBG",layout:L,entries:[{binding:0,resource:o},{binding:1,resource:w},{binding:2,resource:A.createView()},{binding:3,resource:x}]}),F=s.createShaderModule({label:"LightingShader",code:Xi}),W=s.createRenderPipeline({label:"LightingPipeline",layout:s.createPipelineLayout({bindGroupLayouts:[B,P,L,O]}),vertex:{module:F,entryPoint:"vs_main"},fragment:{module:F,entryPoint:"fs_main",targets:[{format:ie}]},primitive:{topology:"triangle-list"}});return new Rn(p,f,W,b,k,U,G,h,m,i?null:S,A,s,L,o,w,x)}updateSSGI(e){this._aoBindGroup=this._device.createBindGroup({label:"LightAoBG",layout:this._aoBGL,entries:[{binding:0,resource:this._aoView},{binding:1,resource:this._aoSampler},{binding:2,resource:e},{binding:3,resource:this._ssgiSampler}]})}updateCamera(e,t,n,o,i,a,s,l){const d=this._cameraScratch;d.set(t.data,0),d.set(n.data,16),d.set(o.data,32),d.set(i.data,48),d[64]=a.x,d[65]=a.y,d[66]=a.z,d[67]=s,d[68]=l,e.queue.writeBuffer(this.cameraBuffer,0,d.buffer)}updateLight(e,t,n,o,i,a=!0,s=!1,l=.02){const d=this._lightScratch,p=this._lightScratchU;let f=0;d[f++]=t.x,d[f++]=t.y,d[f++]=t.z,d[f++]=o,d[f++]=n.x,d[f++]=n.y,d[f++]=n.z,p[f++]=i.length;for(let h=0;h<4;h++)h<i.length&&d.set(i[h].lightViewProj.data,f),f+=16;for(let h=0;h<4;h++)d[f++]=h<i.length?i[h].splitFar:1e9;p[f]=a?1:0,p[f+1]=s?1:0,d[81]=l;for(let h=0;h<4;h++)d[84+h]=h<i.length?i[h].depthRange:1;for(let h=0;h<4;h++)d[88+h]=h<i.length?i[h].texelWorldSize:1;e.queue.writeBuffer(this.lightBuffer,0,d.buffer)}updateCloudShadow(e,t,n,o){const i=this._cloudShadowScratch;i[0]=t,i[1]=n,i[2]=o,e.queue.writeBuffer(this.lightBuffer,312,i.buffer)}execute(e,t){const n=e.beginRenderPass({label:"LightingPass",colorAttachments:[{view:this.hdrView,loadOp:"load",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._sceneBindGroup),n.setBindGroup(1,this._gbufferBindGroup),n.setBindGroup(2,this._aoBindGroup),n.setBindGroup(3,this._iblBindGroup),n.draw(3),n.end()}destroy(){var e,t;this.hdrTexture.destroy(),this.cameraBuffer.destroy(),this.lightBuffer.destroy(),(e=this._defaultCloudShadow)==null||e.destroy(),(t=this._defaultSsgi)==null||t.destroy()}}const $i=`// Physically based single-scattering atmosphere (Rayleigh + Mie).
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
`,Dr=96;class In extends be{constructor(e,t,n,o){super();c(this,"name","AtmospherePass");c(this,"_pipeline");c(this,"_uniformBuf");c(this,"_bg");c(this,"_hdrView");this._pipeline=e,this._uniformBuf=t,this._bg=n,this._hdrView=o}static create(e,t){const{device:n}=e,o=n.createBuffer({label:"AtmosphereUniform",size:Dr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),i=n.createBindGroupLayout({label:"AtmosphereBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),a=n.createBindGroup({label:"AtmosphereBG",layout:i,entries:[{binding:0,resource:{buffer:o}}]}),s=n.createShaderModule({label:"AtmosphereShader",code:$i}),l=n.createRenderPipeline({label:"AtmospherePipeline",layout:n.createPipelineLayout({bindGroupLayouts:[i]}),vertex:{module:s,entryPoint:"vs_main"},fragment:{module:s,entryPoint:"fs_main",targets:[{format:ie}]},primitive:{topology:"triangle-list"}});return new In(l,o,a,t)}update(e,t,n,o){const i=new Float32Array(Dr/4);i.set(t.data,0),i[16]=n.x,i[17]=n.y,i[18]=n.z;const a=Math.sqrt(o.x*o.x+o.y*o.y+o.z*o.z),s=a>0?1/a:0;i[20]=-o.x*s,i[21]=-o.y*s,i[22]=-o.z*s,e.queue.writeBuffer(this._uniformBuf,0,i.buffer)}execute(e,t){const n=e.beginRenderPass({label:"AtmospherePass",colorAttachments:[{view:this._hdrView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._bg),n.draw(3),n.end()}destroy(){this._uniformBuf.destroy()}}const Zi=`// Block selection highlight — two draw calls sharing this shader:
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
`,zr=80;class On extends be{constructor(e,t,n,o,i,a){super();c(this,"name","BlockHighlightPass");c(this,"_facePipeline");c(this,"_edgePipeline");c(this,"_uniformBuf");c(this,"_bg");c(this,"_hdrView");c(this,"_depthView");c(this,"_active",!1);this._facePipeline=e,this._edgePipeline=t,this._uniformBuf=n,this._bg=o,this._hdrView=i,this._depthView=a}static create(e,t,n){const{device:o}=e,i=o.createBuffer({label:"BlockHighlightUniform",size:zr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),a=o.createBindGroupLayout({label:"BlockHighlightBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),s=o.createBindGroup({label:"BlockHighlightBG",layout:a,entries:[{binding:0,resource:{buffer:i}}]}),l=o.createShaderModule({label:"BlockHighlightShader",code:Zi}),d=o.createPipelineLayout({bindGroupLayouts:[a]}),p={format:"depth32float",depthWriteEnabled:!1,depthCompare:"less-equal"},f={color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}},h=o.createRenderPipeline({label:"BlockHighlightFacePipeline",layout:d,vertex:{module:l,entryPoint:"vs_face"},fragment:{module:l,entryPoint:"fs_face",targets:[{format:ie,blend:f}]},primitive:{topology:"triangle-list",cullMode:"none"},depthStencil:p}),m=o.createRenderPipeline({label:"BlockHighlightEdgePipeline",layout:d,vertex:{module:l,entryPoint:"vs_edge"},fragment:{module:l,entryPoint:"fs_edge",targets:[{format:ie,blend:f}]},primitive:{topology:"triangle-list",cullMode:"none"},depthStencil:p});return new On(h,m,i,s,t,n)}update(e,t,n){if(!n){this._active=!1;return}this._active=!0;const o=new Float32Array(zr/4);o.set(t.data,0),o[16]=n.x,o[17]=n.y,o[18]=n.z,e.queue.writeBuffer(this._uniformBuf,0,o.buffer)}execute(e,t){if(!this._active)return;const n=e.beginRenderPass({label:"BlockHighlightPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._depthView,depthLoadOp:"load",depthStoreOp:"store"}});n.setBindGroup(0,this._bg),n.setPipeline(this._facePipeline),n.draw(36),n.setPipeline(this._edgePipeline),n.draw(144),n.end()}destroy(){this._uniformBuf.destroy()}}const Ki=`// Cloud + sky pass — fullscreen triangle.
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
`,Fr=96,Hr=48,Wr=32;class Vn extends be{constructor(e,t,n,o,i,a,s,l,d){super();c(this,"name","CloudPass");c(this,"_pipeline");c(this,"_hdrView");c(this,"_cameraBuffer");c(this,"_cloudBuffer");c(this,"_lightBuffer");c(this,"_sceneBG");c(this,"_lightBG");c(this,"_depthBG");c(this,"_noiseSkyBG");this._pipeline=e,this._hdrView=t,this._cameraBuffer=n,this._cloudBuffer=o,this._lightBuffer=i,this._sceneBG=a,this._lightBG=s,this._depthBG=l,this._noiseSkyBG=d}static create(e,t,n,o){const{device:i}=e,a=i.createBuffer({label:"CloudCameraBuffer",size:Fr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),s=i.createBuffer({label:"CloudUniformBuffer",size:Hr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),l=i.createBuffer({label:"CloudLightBuffer",size:Wr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),d=i.createBindGroupLayout({label:"CloudSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),p=i.createBindGroupLayout({label:"CloudLightBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),f=i.createBindGroupLayout({label:"CloudDepthBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),h=i.createBindGroupLayout({label:"CloudNoiseSkyBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),m=i.createSampler({label:"CloudNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"repeat",addressModeV:"repeat",addressModeW:"repeat"}),_=i.createSampler({label:"CloudDepthSampler"}),y=i.createBindGroup({label:"CloudSceneBG",layout:d,entries:[{binding:0,resource:{buffer:a}},{binding:1,resource:{buffer:s}}]}),w=i.createBindGroup({label:"CloudLightBG",layout:p,entries:[{binding:0,resource:{buffer:l}}]}),x=i.createBindGroup({label:"CloudDepthBG",layout:f,entries:[{binding:0,resource:n},{binding:1,resource:_}]}),B=i.createBindGroup({label:"CloudNoiseSkyBG",layout:h,entries:[{binding:0,resource:o.baseView},{binding:1,resource:o.detailView},{binding:2,resource:m}]}),P=i.createShaderModule({label:"CloudShader",code:Ki}),S=i.createRenderPipeline({label:"CloudPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[d,p,f,h]}),vertex:{module:P,entryPoint:"vs_main"},fragment:{module:P,entryPoint:"fs_main",targets:[{format:ie}]},primitive:{topology:"triangle-list"}});return new Vn(S,t,a,s,l,y,w,x,B)}updateCamera(e,t,n,o,i){const a=new Float32Array(Fr/4);a.set(t.data,0),a[16]=n.x,a[17]=n.y,a[18]=n.z,a[19]=o,a[20]=i,e.queue.writeBuffer(this._cameraBuffer,0,a.buffer)}updateLight(e,t,n,o){const i=new Float32Array(Wr/4);i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=o,i[4]=n.x,i[5]=n.y,i[6]=n.z,e.queue.writeBuffer(this._lightBuffer,0,i.buffer)}updateSettings(e,t){const n=new Float32Array(Hr/4);n[0]=t.cloudBase,n[1]=t.cloudTop,n[2]=t.coverage,n[3]=t.density,n[4]=t.windOffset[0],n[5]=t.windOffset[1],n[6]=t.anisotropy,n[7]=t.extinction,n[8]=t.ambientColor[0],n[9]=t.ambientColor[1],n[10]=t.ambientColor[2],n[11]=t.exposure,e.queue.writeBuffer(this._cloudBuffer,0,n.buffer)}execute(e,t){const n=e.beginRenderPass({label:"CloudPass",colorAttachments:[{view:this._hdrView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._sceneBG),n.setBindGroup(1,this._lightBG),n.setBindGroup(2,this._depthBG),n.setBindGroup(3,this._noiseSkyBG),n.draw(3),n.end()}destroy(){this._cameraBuffer.destroy(),this._cloudBuffer.destroy(),this._lightBuffer.destroy()}}const Ji=`// Cloud shadow pass — renders a top-down cloud transmittance map (1024×1024 r8unorm).
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
`,jr=1024,qr="r8unorm",Yr=48;class Dn extends be{constructor(e,t,n,o,i,a){super();c(this,"name","CloudShadowPass");c(this,"shadowTexture");c(this,"shadowView");c(this,"_pipeline");c(this,"_uniformBuffer");c(this,"_uniformBG");c(this,"_noiseBG");c(this,"_frameCount",0);this.shadowTexture=e,this.shadowView=t,this._pipeline=n,this._uniformBuffer=o,this._uniformBG=i,this._noiseBG=a}static create(e,t){const{device:n}=e,o=n.createTexture({label:"CloudShadowTexture",size:{width:jr,height:jr},format:qr,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),i=o.createView(),a=n.createBuffer({label:"CloudShadowUniform",size:Yr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),s=n.createBindGroupLayout({label:"CloudShadowUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),l=n.createSampler({label:"CloudNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"repeat",addressModeV:"repeat",addressModeW:"repeat"}),d=n.createBindGroupLayout({label:"CloudShadowNoiseBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),p=n.createBindGroup({label:"CloudShadowUniformBG",layout:s,entries:[{binding:0,resource:{buffer:a}}]}),f=n.createBindGroup({label:"CloudShadowNoiseBG",layout:d,entries:[{binding:0,resource:t.baseView},{binding:1,resource:t.detailView},{binding:2,resource:l}]}),h=n.createShaderModule({label:"CloudShadowShader",code:Ji}),m=n.createRenderPipeline({label:"CloudShadowPipeline",layout:n.createPipelineLayout({bindGroupLayouts:[s,d]}),vertex:{module:h,entryPoint:"vs_main"},fragment:{module:h,entryPoint:"fs_main",targets:[{format:qr}]},primitive:{topology:"triangle-list"}});return new Dn(o,i,m,a,p,f)}update(e,t,n,o){const i=new Float32Array(Yr/4);i[0]=t.cloudBase,i[1]=t.cloudTop,i[2]=t.coverage,i[3]=t.density,i[4]=t.windOffset[0],i[5]=t.windOffset[1],i[6]=n[0],i[7]=n[1],i[8]=o,i[9]=t.extinction,e.queue.writeBuffer(this._uniformBuffer,0,i.buffer)}execute(e,t){if(this._frameCount++%2!==0)return;const n=e.beginRenderPass({label:"CloudShadowPass",colorAttachments:[{view:this.shadowView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._uniformBG),n.setBindGroup(1,this._noiseBG),n.draw(3),n.end()}destroy(){this.shadowTexture.destroy(),this._uniformBuffer.destroy()}}const Qi=`// TAA resolve pass — fullscreen triangle, blends current HDR with reprojected history.

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
`,Xr=128;class zn extends be{constructor(e,t,n,o,i,a,s,l,d,p){super();c(this,"name","TAAPass");c(this,"_resolved");c(this,"resolvedView");c(this,"_history");c(this,"_historyView");c(this,"_pipeline");c(this,"_uniformBuffer");c(this,"_uniformBG");c(this,"_textureBG");c(this,"_width");c(this,"_height");this._resolved=e,this.resolvedView=t,this._history=n,this._historyView=o,this._pipeline=i,this._uniformBuffer=a,this._uniformBG=s,this._textureBG=l,this._width=d,this._height=p}get historyView(){return this._historyView}static create(e,t,n){const{device:o,width:i,height:a}=e,s=o.createTexture({label:"TAA Resolved",size:{width:i,height:a},format:ie,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),l=o.createTexture({label:"TAA History",size:{width:i,height:a},format:ie,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),d=s.createView(),p=l.createView(),f=o.createBuffer({label:"TAAUniformBuffer",size:Xr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),h=o.createBindGroupLayout({label:"TAAUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),m=o.createBindGroupLayout({label:"TAATextureBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),_=o.createSampler({label:"TAALinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),y=o.createBindGroup({layout:h,entries:[{binding:0,resource:{buffer:f}}]}),w=o.createBindGroup({layout:m,entries:[{binding:0,resource:t.hdrView},{binding:1,resource:p},{binding:2,resource:n.depthView},{binding:3,resource:_}]}),x=o.createShaderModule({label:"TAAShader",code:Qi}),B=o.createRenderPipeline({label:"TAAPipeline",layout:o.createPipelineLayout({bindGroupLayouts:[h,m]}),vertex:{module:x,entryPoint:"vs_main"},fragment:{module:x,entryPoint:"fs_main",targets:[{format:ie}]},primitive:{topology:"triangle-list"}});return new zn(s,d,l,p,B,f,y,w,i,a)}updateCamera(e,t,n){const o=new Float32Array(Xr/4);o.set(t.data,0),o.set(n.data,16),e.queue.writeBuffer(this._uniformBuffer,0,o.buffer)}execute(e,t){const n=e.beginRenderPass({label:"TAAPass",colorAttachments:[{view:this.resolvedView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._uniformBG),n.setBindGroup(1,this._textureBG),n.draw(3),n.end(),e.copyTextureToTexture({texture:this._resolved},{texture:this._history},{width:this._width,height:this._height})}destroy(){this._resolved.destroy(),this._history.destroy(),this._uniformBuffer.destroy()}}const ea=`// Bloom: prefilter (downsample + threshold) and separable Gaussian blur.
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
`,ta=`// Bloom composite: adds the blurred bright regions back to the source HDR.

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
`,na=16;class Fn extends be{constructor(e,t,n,o,i,a,s,l,d,p,f,h,m,_,y){super();c(this,"name","BloomPass");c(this,"resultView");c(this,"_result");c(this,"_half1");c(this,"_half2");c(this,"_half1View");c(this,"_half2View");c(this,"_prefilterPipeline");c(this,"_blurHPipeline");c(this,"_blurVPipeline");c(this,"_compositePipeline");c(this,"_uniformBuffer");c(this,"_prefilterBG");c(this,"_blurHBG");c(this,"_blurVBG");c(this,"_compositeBG");this._result=e,this.resultView=t,this._half1=n,this._half1View=o,this._half2=i,this._half2View=a,this._prefilterPipeline=s,this._blurHPipeline=l,this._blurVPipeline=d,this._compositePipeline=p,this._uniformBuffer=f,this._prefilterBG=h,this._blurHBG=m,this._blurVBG=_,this._compositeBG=y}static create(e,t){const{device:n,width:o,height:i}=e,a=Math.max(1,o>>1),s=Math.max(1,i>>1),l=n.createTexture({label:"BloomHalf1",size:{width:a,height:s},format:ie,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),d=n.createTexture({label:"BloomHalf2",size:{width:a,height:s},format:ie,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),p=n.createTexture({label:"BloomResult",size:{width:o,height:i},format:ie,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),f=l.createView(),h=d.createView(),m=p.createView(),_=n.createBuffer({label:"BloomUniforms",size:na,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});n.queue.writeBuffer(_,0,new Float32Array([1,.5,.3,0]).buffer);const y=n.createSampler({label:"BloomSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),w=n.createBindGroupLayout({label:"BloomSingleBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),x=n.createBindGroupLayout({label:"BloomCompositeBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),B=n.createShaderModule({label:"BloomShader",code:ea}),P=n.createShaderModule({label:"BloomComposite",code:ta}),S=n.createPipelineLayout({bindGroupLayouts:[w]}),M=n.createPipelineLayout({bindGroupLayouts:[x]});function L(U,F){return n.createRenderPipeline({label:F,layout:S,vertex:{module:B,entryPoint:"vs_main"},fragment:{module:B,entryPoint:U,targets:[{format:ie}]},primitive:{topology:"triangle-list"}})}const A=L("fs_prefilter","BloomPrefilterPipeline"),O=L("fs_blur_h","BloomBlurHPipeline"),T=L("fs_blur_v","BloomBlurVPipeline"),v=n.createRenderPipeline({label:"BloomCompositePipeline",layout:M,vertex:{module:P,entryPoint:"vs_main"},fragment:{module:P,entryPoint:"fs_main",targets:[{format:ie}]},primitive:{topology:"triangle-list"}});function C(U){return n.createBindGroup({layout:w,entries:[{binding:0,resource:{buffer:_}},{binding:1,resource:U},{binding:2,resource:y}]})}const g=C(t),G=C(f),b=C(h),k=n.createBindGroup({layout:x,entries:[{binding:0,resource:{buffer:_}},{binding:1,resource:t},{binding:2,resource:f},{binding:3,resource:y}]});return new Fn(p,m,l,f,d,h,A,O,T,v,_,g,G,b,k)}updateParams(e,t=1,n=.5,o=.3){e.queue.writeBuffer(this._uniformBuffer,0,new Float32Array([t,n,o,0]).buffer)}execute(e,t){const n=(o,i,a,s)=>{const l=e.beginRenderPass({label:o,colorAttachments:[{view:i,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});l.setPipeline(a),l.setBindGroup(0,s),l.draw(3),l.end()};n("BloomPrefilter",this._half1View,this._prefilterPipeline,this._prefilterBG);for(let o=0;o<2;o++)n("BloomBlurH",this._half2View,this._blurHPipeline,this._blurHBG),n("BloomBlurV",this._half1View,this._blurVPipeline,this._blurVBG);n("BloomComposite",this.resultView,this._compositePipeline,this._compositeBG)}destroy(){this._result.destroy(),this._half1.destroy(),this._half2.destroy(),this._uniformBuffer.destroy()}}const ra=`// godray_march.wgsl — Half-resolution ray-march pass for volumetric godrays.
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
`,oa=`// godray_composite.wgsl — Blur and composite passes for volumetric godrays.
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
`,gt=ie,Lt=16;class Hn extends be{constructor(e,t,n,o,i,a,s,l,d,p,f,h,m,_,y,w,x){super();c(this,"name","GodrayPass");c(this,"scattering",.3);c(this,"fogCurve",2);c(this,"maxSteps",16);c(this,"_fogA");c(this,"_fogB");c(this,"_fogAView");c(this,"_fogBView");c(this,"_hdrView");c(this,"_marchPipeline");c(this,"_blurHPipeline");c(this,"_blurVPipeline");c(this,"_compositePipeline");c(this,"_marchBG");c(this,"_blurHBG");c(this,"_blurVBG");c(this,"_compositeBG");c(this,"_marchParamsBuf");c(this,"_blurHParamsBuf");c(this,"_blurVParamsBuf");c(this,"_compParamsBuf");this._fogA=e,this._fogAView=t,this._fogB=n,this._fogBView=o,this._hdrView=i,this._marchPipeline=a,this._blurHPipeline=s,this._blurVPipeline=l,this._compositePipeline=d,this._marchBG=p,this._blurHBG=f,this._blurVBG=h,this._compositeBG=m,this._marchParamsBuf=_,this._blurHParamsBuf=y,this._blurVParamsBuf=w,this._compParamsBuf=x}static create(e,t,n,o,i,a){const{device:s,width:l,height:d}=e,p=Math.max(1,l>>1),f=Math.max(1,d>>1),h=s.createTexture({label:"GodrayFogA",size:{width:p,height:f},format:gt,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),m=s.createTexture({label:"GodrayFogB",size:{width:p,height:f},format:gt,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),_=h.createView(),y=m.createView(),w=s.createSampler({label:"GodraySampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),x=s.createSampler({label:"GodrayCmpSampler",compare:"less-equal",magFilter:"linear",minFilter:"linear"}),B=s.createBuffer({label:"GodrayMarchParams",size:Lt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});s.queue.writeBuffer(B,0,new Float32Array([.3,16,0,0]).buffer);const P=s.createBuffer({label:"GodrayBlurHParams",size:Lt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});s.queue.writeBuffer(P,0,new Float32Array([1,0,0,0]).buffer);const S=s.createBuffer({label:"GodrayBlurVParams",size:Lt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});s.queue.writeBuffer(S,0,new Float32Array([0,1,0,0]).buffer);const M=s.createBuffer({label:"GodrayCompositeParams",size:Lt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});s.queue.writeBuffer(M,0,new Float32Array([0,0,2,0]).buffer);const L=s.createShaderModule({label:"GodrayMarchShader",code:ra}),A=s.createRenderPipeline({label:"GodrayMarchPipeline",layout:"auto",vertex:{module:L,entryPoint:"vs_main"},fragment:{module:L,entryPoint:"fs_march",targets:[{format:gt}]},primitive:{topology:"triangle-list"}}),O=s.createBindGroup({label:"GodrayMarchBG",layout:A.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:a}},{binding:2,resource:t.depthView},{binding:3,resource:n.shadowMapView},{binding:4,resource:x},{binding:5,resource:{buffer:B}}]}),T=s.createShaderModule({label:"GodrayCompositeShader",code:oa}),v=s.createRenderPipeline({label:"GodrayBlurHPipeline",layout:"auto",vertex:{module:T,entryPoint:"vs_main"},fragment:{module:T,entryPoint:"fs_blur",targets:[{format:gt}]},primitive:{topology:"triangle-list"}}),C=s.createRenderPipeline({label:"GodrayBlurVPipeline",layout:"auto",vertex:{module:T,entryPoint:"vs_main"},fragment:{module:T,entryPoint:"fs_blur",targets:[{format:gt}]},primitive:{topology:"triangle-list"}}),g=s.createRenderPipeline({label:"GodrayCompositePipeline",layout:"auto",vertex:{module:T,entryPoint:"vs_main"},fragment:{module:T,entryPoint:"fs_composite",targets:[{format:ie,blend:{color:{operation:"add",srcFactor:"one",dstFactor:"one"},alpha:{operation:"add",srcFactor:"one",dstFactor:"one"}}}]},primitive:{topology:"triangle-list"}}),G=s.createBindGroup({label:"GodrayBlurHBG",layout:v.getBindGroupLayout(0),entries:[{binding:0,resource:_},{binding:1,resource:t.depthView},{binding:2,resource:w},{binding:3,resource:{buffer:P}}]}),b=s.createBindGroup({label:"GodrayBlurVBG",layout:C.getBindGroupLayout(0),entries:[{binding:0,resource:y},{binding:1,resource:t.depthView},{binding:2,resource:w},{binding:3,resource:{buffer:S}}]}),k=s.createBindGroup({label:"GodrayCompositeBG",layout:g.getBindGroupLayout(0),entries:[{binding:0,resource:_},{binding:1,resource:t.depthView},{binding:2,resource:w},{binding:3,resource:{buffer:M}},{binding:4,resource:{buffer:a}}]});return new Hn(h,_,m,y,o,A,v,C,g,O,G,b,k,B,P,S,M)}updateParams(e){e.queue.writeBuffer(this._marchParamsBuf,0,new Float32Array([this.scattering,this.maxSteps,0,0]).buffer),e.queue.writeBuffer(this._compParamsBuf,0,new Float32Array([0,0,this.fogCurve,0]).buffer)}execute(e,t){const n=(o,i,a,s,l=!0)=>{const d=e.beginRenderPass({label:o,colorAttachments:[{view:i,clearValue:[0,0,0,0],loadOp:l?"clear":"load",storeOp:"store"}]});d.setPipeline(a),d.setBindGroup(0,s),d.draw(3),d.end()};n("GodrayMarch",this._fogAView,this._marchPipeline,this._marchBG),n("GodrayBlurH",this._fogBView,this._blurHPipeline,this._blurHBG),n("GodrayBlurV",this._fogAView,this._blurVPipeline,this._blurVBG),n("GodrayComposite",this._hdrView,this._compositePipeline,this._compositeBG,!1)}destroy(){this._fogA.destroy(),this._fogB.destroy(),this._marchParamsBuf.destroy(),this._blurHParamsBuf.destroy(),this._blurVParamsBuf.destroy(),this._compParamsBuf.destroy()}}const ia=`// composite.wgsl — Fog + Underwater + Tonemap merged into a single full-screen draw.
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
`,$r=64,Zr=96;class Wn extends be{constructor(e,t,n,o,i,a){super();c(this,"name","CompositePass");c(this,"depthFogEnabled",!0);c(this,"depthDensity",1);c(this,"depthBegin",32);c(this,"depthEnd",128);c(this,"depthCurve",1.5);c(this,"heightFogEnabled",!1);c(this,"heightDensity",.7);c(this,"heightMin",48);c(this,"heightMax",80);c(this,"heightCurve",1);c(this,"fogColor",[1,1,1]);c(this,"_pipeline");c(this,"_bg0");c(this,"_bg1");c(this,"_bg2");c(this,"_paramsBuf");c(this,"_starBuf");this._pipeline=e,this._bg0=t,this._bg1=n,this._bg2=o,this._paramsBuf=i,this._starBuf=a}static create(e,t,n,o,i,a,s){const{device:l,format:d}=e,p=l.createBindGroupLayout({label:"CompositeBGL0",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),f=l.createBindGroupLayout({label:"CompositeBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),h=l.createBindGroupLayout({label:"CompositeBGL2",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),m=l.createSampler({label:"CompositeSampler",magFilter:"linear",minFilter:"linear"}),_=l.createBuffer({label:"CompositeParams",size:$r,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),y=l.createBuffer({label:"CompositeStars",size:Zr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),w=l.createBindGroup({label:"CompositeBG0",layout:p,entries:[{binding:0,resource:t},{binding:1,resource:n},{binding:2,resource:o},{binding:3,resource:m}]}),x=l.createBindGroup({label:"CompositeBG1",layout:f,entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:a}}]}),B=l.createBindGroup({label:"CompositeBG2",layout:h,entries:[{binding:0,resource:{buffer:_}},{binding:1,resource:{buffer:y}},{binding:2,resource:{buffer:s}}]}),P=l.createShaderModule({label:"CompositeShader",code:ia}),S=l.createPipelineLayout({bindGroupLayouts:[p,f,h]}),M=l.createRenderPipeline({label:"CompositePipeline",layout:S,vertex:{module:P,entryPoint:"vs_main"},fragment:{module:P,entryPoint:"fs_main",targets:[{format:d}]},primitive:{topology:"triangle-list"}});return new Wn(M,w,x,B,_,y)}updateParams(e,t,n,o,i,a){const s=new ArrayBuffer($r),l=new Float32Array(s),d=new Uint32Array(s);let p=0;this.depthFogEnabled&&(p|=1),this.heightFogEnabled&&(p|=2);let f=0;o&&(f|=1),i&&(f|=2),a&&(f|=4),l[0]=this.fogColor[0],l[1]=this.fogColor[1],l[2]=this.fogColor[2],l[3]=this.depthDensity,l[4]=this.depthBegin,l[5]=this.depthEnd,l[6]=this.depthCurve,l[7]=this.heightDensity,l[8]=this.heightMin,l[9]=this.heightMax,l[10]=this.heightCurve,d[11]=p,l[12]=n,l[13]=t?1:0,d[14]=f,l[15]=0,e.queue.writeBuffer(this._paramsBuf,0,s)}updateStars(e,t,n,o){const i=new Float32Array(Zr/4);i.set(t.data,0),i[16]=n.x,i[17]=n.y,i[18]=n.z,i[19]=0,i[20]=o.x,i[21]=o.y,i[22]=o.z,i[23]=0,e.queue.writeBuffer(this._starBuf,0,i.buffer)}execute(e,t){const n=e.beginRenderPass({label:"CompositePass",colorAttachments:[{view:t.getCurrentTexture().createView(),clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._bg0),n.setBindGroup(1,this._bg1),n.setBindGroup(2,this._bg2),n.draw(3),n.end()}destroy(){this._paramsBuf.destroy(),this._starBuf.destroy()}}const Kr=64*4+16+16,aa=128;class jn extends be{constructor(e,t,n,o,i){super();c(this,"name","GeometryPass");c(this,"_gbuffer");c(this,"_cameraBGL");c(this,"_modelBGL");c(this,"_pipelineCache",new Map);c(this,"_cameraBuffer");c(this,"_cameraBindGroup");c(this,"_modelBuffers",[]);c(this,"_modelBindGroups",[]);c(this,"_drawItems",[]);c(this,"_modelData",new Float32Array(32));c(this,"_cameraScratch",new Float32Array(Kr/4));this._gbuffer=e,this._cameraBGL=t,this._modelBGL=n,this._cameraBuffer=o,this._cameraBindGroup=i}static create(e,t){const{device:n}=e,o=n.createBindGroupLayout({label:"GeomCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),i=n.createBindGroupLayout({label:"GeomModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),a=n.createBuffer({label:"GeomCameraBuffer",size:Kr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),s=n.createBindGroup({label:"GeomCameraBindGroup",layout:o,entries:[{binding:0,resource:{buffer:a}}]});return new jn(t,o,i,a,s)}setDrawItems(e){this._drawItems=e}updateCamera(e,t,n,o,i,a,s,l){const d=this._cameraScratch;d.set(t.data,0),d.set(n.data,16),d.set(o.data,32),d.set(i.data,48),d[64]=a.x,d[65]=a.y,d[66]=a.z,d[67]=s,d[68]=l,e.queue.writeBuffer(this._cameraBuffer,0,d.buffer)}execute(e,t){var i,a;const{device:n}=t;this._ensurePerDrawBuffers(n,this._drawItems.length);for(let s=0;s<this._drawItems.length;s++){const l=this._drawItems[s],d=this._modelData;d.set(l.modelMatrix.data,0),d.set(l.normalMatrix.data,16),t.queue.writeBuffer(this._modelBuffers[s],0,d.buffer),(a=(i=l.material).update)==null||a.call(i,t.queue)}const o=e.beginRenderPass({label:"GeometryPass",colorAttachments:[{view:this._gbuffer.albedoRoughnessView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"},{view:this._gbuffer.normalMetallicView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});o.setBindGroup(0,this._cameraBindGroup);for(let s=0;s<this._drawItems.length;s++){const l=this._drawItems[s];o.setPipeline(this._getPipeline(n,l.material)),o.setBindGroup(1,this._modelBindGroups[s]),o.setBindGroup(2,l.material.getBindGroup(n)),o.setVertexBuffer(0,l.mesh.vertexBuffer),o.setIndexBuffer(l.mesh.indexBuffer,"uint32"),o.drawIndexed(l.mesh.indexCount)}o.end()}_getPipeline(e,t){let n=this._pipelineCache.get(t.shaderId);if(n)return n;const o=e.createShaderModule({label:`GeometryShader[${t.shaderId}]`,code:t.getShaderCode(xt.Geometry)});return n=e.createRenderPipeline({label:`GeometryPipeline[${t.shaderId}]`,layout:e.createPipelineLayout({bindGroupLayouts:[this._cameraBGL,this._modelBGL,t.getBindGroupLayout(e)]}),vertex:{module:o,entryPoint:"vs_main",buffers:[{arrayStride:kn,attributes:Ln}]},fragment:{module:o,entryPoint:"fs_main",targets:[{format:"rgba8unorm"},{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),this._pipelineCache.set(t.shaderId,n),n}_ensurePerDrawBuffers(e,t){for(;this._modelBuffers.length<t;){const n=e.createBuffer({size:aa,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._modelBuffers.push(n),this._modelBindGroups.push(e.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:n}}]}))}}destroy(){this._cameraBuffer.destroy();for(const e of this._modelBuffers)e.destroy()}}const sa=`// GBuffer fill pass for voxel chunk geometry.
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
`,Jr=64*4+16+16,la=16,vt=256,ca=2048,ua=5,tt=ua*4,_n=16;class qn extends be{constructor(e,t,n,o,i,a,s,l,d,p){super();c(this,"name","WorldGeometryPass");c(this,"_gbuffer");c(this,"_device");c(this,"_opaquePipeline");c(this,"_transparentPipeline");c(this,"_propPipeline");c(this,"_cameraBuffer");c(this,"_cameraBindGroup");c(this,"_sharedBindGroup");c(this,"_chunkUniformBuffer");c(this,"_chunkBindGroup");c(this,"_slotFreeList",[]);c(this,"_slotHighWater",0);c(this,"_chunks",new Map);c(this,"_frustumPlanes",new Float32Array(24));c(this,"drawCalls",0);c(this,"triangles",0);c(this,"_cameraData",new Float32Array(Jr/4));c(this,"_debugChunks",!1);this._device=e,this._gbuffer=t,this._opaquePipeline=n,this._transparentPipeline=o,this._propPipeline=i,this._cameraBuffer=a,this._cameraBindGroup=s,this._sharedBindGroup=l,this._chunkUniformBuffer=d,this._chunkBindGroup=p}static create(e,t,n){const{device:o}=e,i=o.createBindGroupLayout({label:"ChunkCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),a=o.createBindGroupLayout({label:"ChunkSharedBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),s=o.createBindGroupLayout({label:"ChunkOffsetBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform",hasDynamicOffset:!0,minBindingSize:32}}]}),l=N.MAX,d=o.createBuffer({label:"BlockDataBuffer",size:Math.max(l*la,16),usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),p=jo,f=new Uint32Array(l*4);for(let T=0;T<l;T++){const v=nn[T];v&&(f[T*4+0]=v.sideFace.y*p+v.sideFace.x,f[T*4+1]=v.bottomFace.y*p+v.bottomFace.x,f[T*4+2]=v.topFace.y*p+v.topFace.x)}o.queue.writeBuffer(d,0,f);const h=o.createSampler({label:"ChunkAtlasSampler",magFilter:"nearest",minFilter:"nearest",addressModeU:"repeat",addressModeV:"repeat"}),m=o.createBindGroup({label:"ChunkSharedBG",layout:a,entries:[{binding:0,resource:n.colorAtlas.view},{binding:1,resource:n.normalAtlas.view},{binding:2,resource:n.merAtlas.view},{binding:3,resource:h},{binding:4,resource:{buffer:d}}]}),_=o.createBuffer({label:"ChunkCameraBuffer",size:Jr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),y=o.createBindGroup({label:"ChunkCameraBG",layout:i,entries:[{binding:0,resource:{buffer:_}}]}),w=o.createShaderModule({label:"ChunkGeometryShader",code:sa}),x=o.createPipelineLayout({bindGroupLayouts:[i,a,s]}),B={arrayStride:tt,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32"},{shaderLocation:2,offset:16,format:"float32"}]},P=[{format:"rgba8unorm"},{format:"rgba16float"}],S=o.createRenderPipeline({label:"ChunkOpaquePipeline",layout:x,vertex:{module:w,entryPoint:"vs_main",buffers:[B]},fragment:{module:w,entryPoint:"fs_opaque",targets:P},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),M=o.createRenderPipeline({label:"ChunkTransparentPipeline",layout:x,vertex:{module:w,entryPoint:"vs_main",buffers:[B]},fragment:{module:w,entryPoint:"fs_transparent",targets:P},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),L=o.createRenderPipeline({label:"ChunkPropPipeline",layout:x,vertex:{module:w,entryPoint:"vs_prop",buffers:[B]},fragment:{module:w,entryPoint:"fs_prop",targets:P},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}}),A=o.createBuffer({label:"ChunkUniformBuffer",size:ca*vt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),O=o.createBindGroup({label:"ChunkOffsetBG",layout:s,entries:[{binding:0,resource:{buffer:A,size:32}}]});return new qn(o,t,S,M,L,_,y,m,A,O)}updateGBuffer(e){this._gbuffer=e}addChunk(e,t){const n=this._chunks.get(e);n?this._replaceMeshBuffers(n,t):this._chunks.set(e,this._createChunkGpu(e,t))}updateChunk(e,t){const n=this._chunks.get(e);n?this._replaceMeshBuffers(n,t):this._chunks.set(e,this._createChunkGpu(e,t))}removeChunk(e){var n,o,i;const t=this._chunks.get(e);t&&((n=t.opaqueBuffer)==null||n.destroy(),(o=t.transparentBuffer)==null||o.destroy(),(i=t.propBuffer)==null||i.destroy(),this._freeSlot(t.slot),this._chunks.delete(e))}updateCamera(e,t,n,o,i,a,s,l){const d=this._cameraData;d.set(t.data,0),d.set(n.data,16),d.set(o.data,32),d.set(i.data,48),d[64]=a.x,d[65]=a.y,d[66]=a.z,d[67]=s,d[68]=l,e.queue.writeBuffer(this._cameraBuffer,0,d.buffer),this._extractFrustumPlanes(o.data)}_extractFrustumPlanes(e){const t=this._frustumPlanes;t[0]=e[3]+e[0],t[1]=e[7]+e[4],t[2]=e[11]+e[8],t[3]=e[15]+e[12],t[4]=e[3]-e[0],t[5]=e[7]-e[4],t[6]=e[11]-e[8],t[7]=e[15]-e[12],t[8]=e[3]+e[1],t[9]=e[7]+e[5],t[10]=e[11]+e[9],t[11]=e[15]+e[13],t[12]=e[3]-e[1],t[13]=e[7]-e[5],t[14]=e[11]-e[9],t[15]=e[15]-e[13],t[16]=e[2],t[17]=e[6],t[18]=e[10],t[19]=e[14],t[20]=e[3]-e[2],t[21]=e[7]-e[6],t[22]=e[11]-e[10],t[23]=e[15]-e[14]}setDebugChunks(e){if(this._debugChunks!==e){this._debugChunks=e;for(const[t,n]of this._chunks)this._writeChunkUniforms(n.slot,n.ox,n.oy,n.oz)}}_isVisible(e,t,n){const o=this._frustumPlanes,i=e+_n,a=t+_n,s=n+_n;for(let l=0;l<6;l++){const d=o[l*4],p=o[l*4+1],f=o[l*4+2],h=o[l*4+3];if(d*(d>=0?i:e)+p*(p>=0?a:t)+f*(f>=0?s:n)+h<0)return!1}return!0}execute(e,t){const n=e.beginRenderPass({label:"WorldGeometryPass",colorAttachments:[{view:this._gbuffer.albedoRoughnessView,loadOp:"load",storeOp:"store"},{view:this._gbuffer.normalMetallicView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthLoadOp:"load",depthStoreOp:"store"}});n.setBindGroup(0,this._cameraBindGroup),n.setBindGroup(1,this._sharedBindGroup);let o=0,i=0;const a=[];for(const s of this._chunks.values())this._isVisible(s.ox,s.oy,s.oz)&&a.push(s);n.setPipeline(this._opaquePipeline);for(const s of a)s.opaqueBuffer&&s.opaqueCount>0&&(n.setBindGroup(2,this._chunkBindGroup,[s.slot*vt]),n.setVertexBuffer(0,s.opaqueBuffer),n.draw(s.opaqueCount),o++,i+=s.opaqueCount/3);n.setPipeline(this._transparentPipeline);for(const s of a)s.transparentBuffer&&s.transparentCount>0&&(n.setBindGroup(2,this._chunkBindGroup,[s.slot*vt]),n.setVertexBuffer(0,s.transparentBuffer),n.draw(s.transparentCount),o++,i+=s.transparentCount/3);n.setPipeline(this._propPipeline);for(const s of a)s.propBuffer&&s.propCount>0&&(n.setBindGroup(2,this._chunkBindGroup,[s.slot*vt]),n.setVertexBuffer(0,s.propBuffer),n.draw(s.propCount),o++,i+=s.propCount/3);this.drawCalls=o,this.triangles=i,n.end()}destroy(){var e,t,n;this._cameraBuffer.destroy(),this._chunkUniformBuffer.destroy();for(const o of this._chunks.values())(e=o.opaqueBuffer)==null||e.destroy(),(t=o.transparentBuffer)==null||t.destroy(),(n=o.propBuffer)==null||n.destroy();this._chunks.clear()}_allocSlot(){return this._slotFreeList.length>0?this._slotFreeList.pop():this._slotHighWater++}_freeSlot(e){this._slotFreeList.push(e)}_writeChunkUniforms(e,t,n,o){const i=t*73856093^n*19349663^o*83492791,a=(i&255)/255*.6+.4,s=(i>>8&255)/255*.6+.4,l=(i>>16&255)/255*.6+.4,d=new ArrayBuffer(32),p=new Float32Array(d),f=new Uint32Array(d);p[0]=t,p[1]=n,p[2]=o,f[3]=this._debugChunks?1:0,p[4]=a,p[5]=s,p[6]=l,p[7]=0,this._device.queue.writeBuffer(this._chunkUniformBuffer,e*vt,d)}_createChunkGpu(e,t){const n=this._allocSlot();this._writeChunkUniforms(n,e.globalPosition.x,e.globalPosition.y,e.globalPosition.z);const o={ox:e.globalPosition.x,oy:e.globalPosition.y,oz:e.globalPosition.z,slot:n,opaqueBuffer:null,opaqueCount:0,transparentBuffer:null,transparentCount:0,propBuffer:null,propCount:0};return this._replaceMeshBuffers(o,t),o}_replaceMeshBuffers(e,t){var n,o,i;if((n=e.opaqueBuffer)==null||n.destroy(),(o=e.transparentBuffer)==null||o.destroy(),(i=e.propBuffer)==null||i.destroy(),e.opaqueBuffer=null,e.transparentBuffer=null,e.propBuffer=null,e.opaqueCount=t.opaqueCount,e.transparentCount=t.transparentCount,e.propCount=t.propCount,t.opaqueCount>0){const a=this._device.createBuffer({label:"ChunkOpaqueBuf",size:t.opaqueCount*tt,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.opaque.buffer,0,t.opaqueCount*tt),e.opaqueBuffer=a}if(t.transparentCount>0){const a=this._device.createBuffer({label:"ChunkTransparentBuf",size:t.transparentCount*tt,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.transparent.buffer,0,t.transparentCount*tt),e.transparentBuffer=a}if(t.propCount>0){const a=this._device.createBuffer({label:"ChunkPropBuf",size:t.propCount*tt,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.prop.buffer,0,t.propCount*tt),e.propBuffer=a}}}const da=`// Depth of Field: prefilter (CoC + 2x downsample) then fused disc-blur + composite.

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
`,fa=32;class Yn extends be{constructor(e,t,n,o,i,a,s,l,d,p){super();c(this,"name","DofPass");c(this,"resultView");c(this,"_result");c(this,"_half");c(this,"_halfView");c(this,"_prefilterPipeline");c(this,"_compositePipeline");c(this,"_uniformBuffer");c(this,"_prefilterBG");c(this,"_compBG0");c(this,"_compBG1");this._result=e,this.resultView=t,this._half=n,this._halfView=o,this._prefilterPipeline=i,this._compositePipeline=a,this._uniformBuffer=s,this._prefilterBG=l,this._compBG0=d,this._compBG1=p}static create(e,t,n){const{device:o,width:i,height:a}=e,s=Math.max(1,i>>1),l=Math.max(1,a>>1),d=o.createTexture({label:"DofHalf",size:{width:s,height:l},format:ie,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),p=o.createTexture({label:"DofResult",size:{width:i,height:a},format:ie,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),f=d.createView(),h=p.createView(),m=o.createBuffer({label:"DofUniforms",size:fa,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});o.queue.writeBuffer(m,0,new Float32Array([30,60,6,.1,1e3,0,0,0]).buffer);const _=o.createSampler({label:"DofSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),y=o.createBindGroupLayout({label:"DofBGL0Prefilter",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),w=o.createBindGroupLayout({label:"DofBGL0Composite",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),x=o.createBindGroupLayout({label:"DofBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),B=o.createShaderModule({label:"DofShader",code:da}),P=o.createRenderPipeline({label:"DofPrefilterPipeline",layout:o.createPipelineLayout({bindGroupLayouts:[y]}),vertex:{module:B,entryPoint:"vs_main"},fragment:{module:B,entryPoint:"fs_prefilter",targets:[{format:ie}]},primitive:{topology:"triangle-list"}}),S=o.createRenderPipeline({label:"DofCompositePipeline",layout:o.createPipelineLayout({bindGroupLayouts:[w,x]}),vertex:{module:B,entryPoint:"vs_main"},fragment:{module:B,entryPoint:"fs_composite",targets:[{format:ie}]},primitive:{topology:"triangle-list"}}),M=o.createBindGroup({label:"DofPrefilterBG",layout:y,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:t},{binding:2,resource:n},{binding:3,resource:_}]}),L=o.createBindGroup({label:"DofCompBG0",layout:w,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:t},{binding:3,resource:_}]}),A=o.createBindGroup({label:"DofCompBG1",layout:x,entries:[{binding:0,resource:f}]});return new Yn(p,h,d,f,P,S,m,M,L,A)}updateParams(e,t=30,n=60,o=6,i=.1,a=1e3,s=1){e.device.queue.writeBuffer(this._uniformBuffer,0,new Float32Array([t,n,o,i,a,s,0,0]).buffer)}execute(e,t){{const n=e.beginRenderPass({label:"DofPrefilter",colorAttachments:[{view:this._halfView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._prefilterPipeline),n.setBindGroup(0,this._prefilterBG),n.draw(3),n.end()}{const n=e.beginRenderPass({label:"DofComposite",colorAttachments:[{view:this.resultView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._compositePipeline),n.setBindGroup(0,this._compBG0),n.setBindGroup(1,this._compBG1),n.draw(3),n.end()}}destroy(){this._result.destroy(),this._half.destroy(),this._uniformBuffer.destroy()}}const pa=`// SSAO: hemisphere sampling in view space.
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
`,ha=`// SSAO blur: 4×4 box blur to smooth raw SSAO output.

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
`,Nt="r8unorm",gn=16,ma=464;function _a(){const u=new Float32Array(gn*4);for(let r=0;r<gn;r++){const e=Math.random(),t=Math.random()*Math.PI*2,n=Math.sqrt(1-e*e),o=.1+.9*(r/gn)**2;u[r*4+0]=n*Math.cos(t)*o,u[r*4+1]=n*Math.sin(t)*o,u[r*4+2]=e*o,u[r*4+3]=0}return u}function ga(){const u=new Uint8Array(64);for(let r=0;r<16;r++){const e=Math.random()*Math.PI*2;u[r*4+0]=Math.round((Math.cos(e)*.5+.5)*255),u[r*4+1]=Math.round((Math.sin(e)*.5+.5)*255),u[r*4+2]=128,u[r*4+3]=255}return u}class Xn extends be{constructor(e,t,n,o,i,a,s,l,d,p,f){super();c(this,"name","SSAOPass");c(this,"aoView");c(this,"_raw");c(this,"_blurred");c(this,"_rawView");c(this,"_ssaoPipeline");c(this,"_blurPipeline");c(this,"_uniformBuffer");c(this,"_noiseTex");c(this,"_ssaoBG0");c(this,"_ssaoBG1");c(this,"_blurBG");this._raw=e,this._rawView=t,this._blurred=n,this.aoView=o,this._ssaoPipeline=i,this._blurPipeline=a,this._uniformBuffer=s,this._noiseTex=l,this._ssaoBG0=d,this._ssaoBG1=p,this._blurBG=f}static create(e,t){const{device:n,width:o,height:i}=e,a=Math.max(1,o>>1),s=Math.max(1,i>>1),l=n.createTexture({label:"SsaoRaw",size:{width:a,height:s},format:Nt,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),d=n.createTexture({label:"SsaoBlurred",size:{width:a,height:s},format:Nt,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),p=l.createView(),f=d.createView(),h=n.createTexture({label:"SsaoNoise",size:{width:4,height:4},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});n.queue.writeTexture({texture:h},ga().buffer,{bytesPerRow:4*4,rowsPerImage:4},{width:4,height:4});const m=h.createView(),_=n.createBuffer({label:"SsaoUniforms",size:ma,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});n.queue.writeBuffer(_,208,_a().buffer),n.queue.writeBuffer(_,192,new Float32Array([1,.005,2,0]).buffer);const y=n.createSampler({label:"SsaoBlurSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),w=n.createBindGroupLayout({label:"SsaoBGL0",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),x=n.createBindGroupLayout({label:"SsaoBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),B=n.createBindGroupLayout({label:"SsaoBlurBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),P=n.createShaderModule({label:"SsaoShader",code:pa}),S=n.createShaderModule({label:"SsaoBlurShader",code:ha}),M=n.createRenderPipeline({label:"SsaoPipeline",layout:n.createPipelineLayout({bindGroupLayouts:[w,x]}),vertex:{module:P,entryPoint:"vs_main"},fragment:{module:P,entryPoint:"fs_ssao",targets:[{format:Nt}]},primitive:{topology:"triangle-list"}}),L=n.createRenderPipeline({label:"SsaoBlurPipeline",layout:n.createPipelineLayout({bindGroupLayouts:[B]}),vertex:{module:S,entryPoint:"vs_main"},fragment:{module:S,entryPoint:"fs_blur",targets:[{format:Nt}]},primitive:{topology:"triangle-list"}}),A=n.createBindGroup({label:"SsaoBG0",layout:w,entries:[{binding:0,resource:{buffer:_}}]}),O=n.createBindGroup({label:"SsaoBG1",layout:x,entries:[{binding:0,resource:t.normalMetallicView},{binding:1,resource:t.depthView},{binding:2,resource:m}]}),T=n.createBindGroup({label:"SsaoBlurBG",layout:B,entries:[{binding:0,resource:p},{binding:1,resource:y}]});return new Xn(l,p,d,f,M,L,_,h,A,O,T)}updateCamera(e,t,n,o){const i=new Float32Array(48);i.set(t.data,0),i.set(n.data,16),i.set(o.data,32),e.device.queue.writeBuffer(this._uniformBuffer,0,i.buffer)}updateParams(e,t=1,n=.005,o=2){e.device.queue.writeBuffer(this._uniformBuffer,192,new Float32Array([t,n,o,0]).buffer)}execute(e,t){{const n=e.beginRenderPass({label:"SSAOPass",colorAttachments:[{view:this._rawView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._ssaoPipeline),n.setBindGroup(0,this._ssaoBG0),n.setBindGroup(1,this._ssaoBG1),n.draw(3),n.end()}{const n=e.beginRenderPass({label:"SSAOBlur",colorAttachments:[{view:this.aoView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._blurPipeline),n.setBindGroup(0,this._blurBG),n.draw(3),n.end()}}destroy(){this._raw.destroy(),this._blurred.destroy(),this._uniformBuffer.destroy(),this._noiseTex.destroy()}}const va=`// Screen-Space Global Illumination — ray march pass.
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
`,ba=`// Screen-Space Global Illumination — temporal accumulation pass.
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
`,Qr=368,ya={numRays:4,numSteps:16,radius:3,thickness:.5,strength:1};function xa(){const u=new Uint8Array(new ArrayBuffer(64));for(let r=0;r<16;r++){const e=Math.random()*Math.PI*2;u[r*4+0]=Math.round((Math.cos(e)*.5+.5)*255),u[r*4+1]=Math.round((Math.sin(e)*.5+.5)*255),u[r*4+2]=128,u[r*4+3]=255}return u}class $n extends be{constructor(e,t,n,o,i,a,s,l,d,p,f,h,m,_,y,w){super();c(this,"name","SSGIPass");c(this,"resultView");c(this,"_uniformBuffer");c(this,"_noiseTexture");c(this,"_rawTexture");c(this,"_rawView");c(this,"_historyTexture");c(this,"_resultTexture");c(this,"_ssgiPipeline");c(this,"_temporalPipeline");c(this,"_ssgiBG0");c(this,"_ssgiBG1");c(this,"_tempBG0");c(this,"_tempBG1");c(this,"_settings");c(this,"_frameIndex",0);c(this,"_width");c(this,"_height");this._uniformBuffer=e,this._noiseTexture=t,this._rawTexture=n,this._rawView=o,this._historyTexture=i,this._resultTexture=a,this.resultView=s,this._ssgiPipeline=l,this._temporalPipeline=d,this._ssgiBG0=p,this._ssgiBG1=f,this._tempBG0=h,this._tempBG1=m,this._settings=_,this._width=y,this._height=w}static create(e,t,n,o=ya){const{device:i,width:a,height:s}=e,l=i.createBuffer({label:"SSGIUniforms",size:Qr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),d=i.createTexture({label:"SSGINoise",size:{width:4,height:4},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});i.queue.writeTexture({texture:d},xa(),{bytesPerRow:4*4,rowsPerImage:4},{width:4,height:4});const p=d.createView(),f=i.createTexture({label:"SSGIRaw",size:{width:a,height:s},format:ie,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),h=f.createView(),m=i.createTexture({label:"SSGIHistory",size:{width:a,height:s},format:ie,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),_=m.createView(),y=i.createTexture({label:"SSGIResult",size:{width:a,height:s},format:ie,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),w=y.createView(),x=i.createSampler({label:"SSGILinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),B=i.createBindGroupLayout({label:"SSGIUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),P=i.createBindGroupLayout({label:"SSGITexBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),S=i.createBindGroupLayout({label:"SSGITempTexBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),M=i.createBindGroup({label:"SSGIUniformBG",layout:B,entries:[{binding:0,resource:{buffer:l}}]}),L=i.createBindGroup({label:"SSGITexBG",layout:P,entries:[{binding:0,resource:t.depthView},{binding:1,resource:t.normalMetallicView},{binding:2,resource:n},{binding:3,resource:p},{binding:4,resource:x}]}),A=i.createBindGroup({label:"SSGITempUniformBG",layout:B,entries:[{binding:0,resource:{buffer:l}}]}),O=i.createBindGroup({label:"SSGITempTexBG",layout:S,entries:[{binding:0,resource:h},{binding:1,resource:_},{binding:2,resource:t.depthView},{binding:3,resource:x}]}),T=i.createShaderModule({label:"SSGIShader",code:va}),v=i.createShaderModule({label:"SSGITempShader",code:ba}),C=i.createRenderPipeline({label:"SSGIPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[B,P]}),vertex:{module:T,entryPoint:"vs_main"},fragment:{module:T,entryPoint:"fs_ssgi",targets:[{format:ie}]},primitive:{topology:"triangle-list"}}),g=i.createRenderPipeline({label:"SSGITempPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[B,S]}),vertex:{module:v,entryPoint:"vs_main"},fragment:{module:v,entryPoint:"fs_temporal",targets:[{format:ie}]},primitive:{topology:"triangle-list"}});return new $n(l,d,f,h,m,y,w,C,g,M,L,A,O,o,a,s)}updateCamera(e,t,n,o,i,a,s){const l=new Float32Array(Qr/4);l.set(t.data,0),l.set(n.data,16),l.set(o.data,32),l.set(i.data,48),l.set(a.data,64),l[80]=s.x,l[81]=s.y,l[82]=s.z;const d=new Uint32Array(l.buffer);d[83]=this._settings.numRays,d[84]=this._settings.numSteps,l[85]=this._settings.radius,l[86]=this._settings.thickness,l[87]=this._settings.strength,d[88]=this._frameIndex++,e.queue.writeBuffer(this._uniformBuffer,0,l.buffer)}updateSettings(e){this._settings={...this._settings,...e}}execute(e,t){{const n=e.beginRenderPass({label:"SSGIRayMarch",colorAttachments:[{view:this._rawView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._ssgiPipeline),n.setBindGroup(0,this._ssgiBG0),n.setBindGroup(1,this._ssgiBG1),n.draw(3),n.end()}{const n=e.beginRenderPass({label:"SSGITemporal",colorAttachments:[{view:this.resultView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._temporalPipeline),n.setBindGroup(0,this._tempBG0),n.setBindGroup(1,this._tempBG1),n.draw(3),n.end()}e.copyTextureToTexture({texture:this._resultTexture},{texture:this._historyTexture},{width:this._width,height:this._height})}destroy(){this._uniformBuffer.destroy(),this._noiseTexture.destroy(),this._rawTexture.destroy(),this._historyTexture.destroy(),this._resultTexture.destroy()}}const wa=`// VSM shadow map generation for point and spot lights.
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
`,Rt=32,It=32,ut=4,Ye=8,Ot=256,Vt=512,Ie=256,vn=80,Ba=64,Sa=6*ut,Pa=Sa+Ye;class Zn extends be{constructor(e,t,n,o,i,a,s,l,d,p,f,h,m,_){super();c(this,"name","PointSpotShadowPass");c(this,"pointVsmView");c(this,"spotVsmView");c(this,"projTexView");c(this,"_pointVsmTex");c(this,"_spotVsmTex");c(this,"_projTexArray");c(this,"_pointDepth");c(this,"_spotDepth");c(this,"_pointFaceViews");c(this,"_spotFaceViews");c(this,"_pointDepthView");c(this,"_spotDepthView");c(this,"_pointPipeline");c(this,"_spotPipeline");c(this,"_shadowBufs");c(this,"_shadowBGs");c(this,"_modelBufs",[]);c(this,"_modelBGs",[]);c(this,"_modelBGL");c(this,"_snapshot",[]);c(this,"_pointLights",[]);c(this,"_spotLights",[]);this._pointVsmTex=e,this._spotVsmTex=t,this._projTexArray=n,this._pointDepth=o,this._spotDepth=i,this._pointFaceViews=a,this._spotFaceViews=s,this._pointDepthView=l,this._spotDepthView=d,this._pointPipeline=p,this._spotPipeline=f,this._shadowBufs=h,this._shadowBGs=m,this._modelBGL=_,this.pointVsmView=e.createView({dimension:"cube-array",arrayLayerCount:ut*6}),this.spotVsmView=t.createView({dimension:"2d-array"}),this.projTexView=n.createView({dimension:"2d-array"})}static create(e){const{device:t}=e,n=t.createTexture({label:"PointVSM",size:{width:Ot,height:Ot,depthOrArrayLayers:ut*6},format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),o=t.createTexture({label:"SpotVSM",size:{width:Vt,height:Vt,depthOrArrayLayers:Ye},format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),i=t.createTexture({label:"ProjTexArray",size:{width:Ie,height:Ie,depthOrArrayLayers:Ye},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),a=new Uint8Array(Ie*Ie*4).fill(255);for(let L=0;L<Ye;L++)t.queue.writeTexture({texture:i,origin:{x:0,y:0,z:L}},a,{bytesPerRow:Ie*4,rowsPerImage:Ie},{width:Ie,height:Ie,depthOrArrayLayers:1});const s=t.createTexture({label:"PointShadowDepth",size:{width:Ot,height:Ot},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),l=t.createTexture({label:"SpotShadowDepth",size:{width:Vt,height:Vt},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),d=Array.from({length:ut*6},(L,A)=>n.createView({dimension:"2d",baseArrayLayer:A,arrayLayerCount:1})),p=Array.from({length:Ye},(L,A)=>o.createView({dimension:"2d",baseArrayLayer:A,arrayLayerCount:1})),f=s.createView(),h=l.createView(),m=t.createBindGroupLayout({label:"PSShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),_=t.createBindGroupLayout({label:"PSModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),y=[],w=[];for(let L=0;L<Pa;L++){const A=t.createBuffer({label:`PSShadowUniform ${L}`,size:vn,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});y.push(A),w.push(t.createBindGroup({label:`PSShadowBG ${L}`,layout:m,entries:[{binding:0,resource:{buffer:A}}]}))}const x=t.createPipelineLayout({bindGroupLayouts:[m,_]}),B=t.createShaderModule({label:"PointSpotShadowShader",code:wa}),P={module:B,buffers:[{arrayStride:kn,attributes:[Ln[0]]}]},S=t.createRenderPipeline({label:"PointShadowPipeline",layout:x,vertex:{...P,entryPoint:"vs_point"},fragment:{module:B,entryPoint:"fs_point",targets:[{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),M=t.createRenderPipeline({label:"SpotShadowPipeline",layout:x,vertex:{...P,entryPoint:"vs_spot"},fragment:{module:B,entryPoint:"fs_spot",targets:[{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}});return new Zn(n,o,i,s,l,d,p,f,h,S,M,y,w,_)}update(e,t,n){this._pointLights=e,this._spotLights=t,this._snapshot=n}setProjectionTexture(e,t,n){e.copyTextureToTexture({texture:n},{texture:this._projTexArray,origin:{x:0,y:0,z:t}},{width:Ie,height:Ie,depthOrArrayLayers:1})}execute(e,t){const{device:n}=t,o=this._snapshot;this._ensureModelBuffers(n,o.length);for(let l=0;l<this._spotLights.length&&l<Ye;l++){const d=this._spotLights[l];d.projectionTexture&&this.setProjectionTexture(e,l,d.projectionTexture)}for(let l=0;l<o.length;l++)t.queue.writeBuffer(this._modelBufs[l],0,o[l].modelMatrix.data.buffer);let i=0,a=0;for(const l of this._pointLights){if(!l.castShadow||a>=ut)continue;const d=l.worldPosition(),p=l.cubeFaceViewProjs(),f=new Float32Array(vn/4);f[16]=d.x,f[17]=d.y,f[18]=d.z,f[19]=l.radius;for(let h=0;h<6;h++){f.set(p[h].data,0),t.queue.writeBuffer(this._shadowBufs[i],0,f.buffer);const m=a*6+h,_=e.beginRenderPass({label:`PointShadow light${a} face${h}`,colorAttachments:[{view:this._pointFaceViews[m],clearValue:{r:1,g:1,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._pointDepthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"discard"}});_.setPipeline(this._pointPipeline),_.setBindGroup(0,this._shadowBGs[i]),this._drawItems(_,o),_.end(),i++}a++}let s=0;for(const l of this._spotLights){if(!l.castShadow||s>=Ye)continue;const d=l.lightViewProj(),p=l.worldPosition(),f=new Float32Array(vn/4);f.set(d.data,0),f[16]=p.x,f[17]=p.y,f[18]=p.z,f[19]=l.range,t.queue.writeBuffer(this._shadowBufs[i],0,f.buffer);const h=e.beginRenderPass({label:`SpotShadow light${s}`,colorAttachments:[{view:this._spotFaceViews[s],clearValue:{r:1,g:1,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._spotDepthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"discard"}});h.setPipeline(this._spotPipeline),h.setBindGroup(0,this._shadowBGs[i]),this._drawItems(h,o),h.end(),i++,s++}}_drawItems(e,t){for(let n=0;n<t.length;n++){const{mesh:o}=t[n];e.setBindGroup(1,this._modelBGs[n]),e.setVertexBuffer(0,o.vertexBuffer),e.setIndexBuffer(o.indexBuffer,"uint32"),e.drawIndexed(o.indexCount)}}_ensureModelBuffers(e,t){for(;this._modelBufs.length<t;){const n=e.createBuffer({label:`PSModelUniform ${this._modelBufs.length}`,size:Ba,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._modelBufs.push(n),this._modelBGs.push(e.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:n}}]}))}}destroy(){this._pointVsmTex.destroy(),this._spotVsmTex.destroy(),this._projTexArray.destroy(),this._pointDepth.destroy(),this._spotDepth.destroy();for(const e of this._shadowBufs)e.destroy();for(const e of this._modelBufs)e.destroy()}}const Ga=`// Water pass — forward-rendered on top of the deferred-lit HDR buffer.
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
`,eo=64*4+16+16,Ta=16,Ea=16,Aa=3,bn=Aa*4,yn=16;class rt extends be{constructor(e,t,n,o,i,a,s,l,d,p,f,h,m,_,y){super();c(this,"name","WaterPass");c(this,"_device");c(this,"_hdrTexture");c(this,"_hdrView");c(this,"_refractionTex");c(this,"_pipeline");c(this,"_cameraBuffer");c(this,"_waterBuffer");c(this,"_cameraBG");c(this,"_waterBG");c(this,"_sceneBG");c(this,"_sceneBGL");c(this,"_chunkBGL");c(this,"_skyTexture");c(this,"_dudvTexture");c(this,"_gradientTexture");c(this,"_chunks",new Map);c(this,"_frustumPlanes",new Float32Array(24));this._device=e,this._hdrTexture=t,this._hdrView=n,this._refractionTex=o,this._pipeline=i,this._cameraBuffer=a,this._waterBuffer=s,this._cameraBG=l,this._waterBG=d,this._sceneBG=p,this._sceneBGL=f,this._chunkBGL=h,this._skyTexture=m,this._dudvTexture=_,this._gradientTexture=y}static create(e,t,n,o,i,a,s){const{device:l,width:d,height:p}=e,f=l.createBindGroupLayout({label:"WaterCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),h=l.createBindGroupLayout({label:"WaterUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),m=l.createBindGroupLayout({label:"WaterChunkBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),_=l.createBindGroupLayout({label:"WaterSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:5,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),{refractionTex:y,refractionView:w}=rt._makeRefractionTex(l,d,p),x=l.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"}),B=l.createBuffer({label:"WaterCameraBuffer",size:eo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),P=l.createBuffer({label:"WaterUniformBuffer",size:Ta,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),S=l.createBindGroup({label:"WaterCameraBG",layout:f,entries:[{binding:0,resource:{buffer:B}}]}),M=l.createBindGroup({label:"WaterUniformBG",layout:h,entries:[{binding:0,resource:{buffer:P}}]}),L=rt._makeSceneBG(l,_,w,o,a,s,i,x),A=l.createShaderModule({label:"WaterShader",code:Ga}),O=l.createPipelineLayout({bindGroupLayouts:[f,h,m,_]}),T={arrayStride:bn,attributes:[{shaderLocation:0,offset:0,format:"float32x3"}]},v=l.createRenderPipeline({label:"WaterPipeline",layout:O,vertex:{module:A,entryPoint:"vs_main",buffers:[T]},fragment:{module:A,entryPoint:"fs_main",targets:[{format:ie,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},primitive:{topology:"triangle-list",cullMode:"none"}});return new rt(l,t,n,y,v,B,P,S,M,L,_,m,i,a,s)}updateRenderTargets(e,t,n,o){this._refractionTex.destroy(),this._hdrTexture=e,this._hdrView=t,o&&(this._skyTexture=o);const{width:i,height:a}=e,{refractionTex:s,refractionView:l}=rt._makeRefractionTex(this._device,i,a);this._refractionTex=s;const d=this._device.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"});this._sceneBG=rt._makeSceneBG(this._device,this._sceneBGL,l,n,this._dudvTexture,this._gradientTexture,this._skyTexture,d)}updateCamera(e,t,n,o,i,a,s,l){const d=new Float32Array(eo/4);d.set(t.data,0),d.set(n.data,16),d.set(o.data,32),d.set(i.data,48),d[64]=a.x,d[65]=a.y,d[66]=a.z,d[67]=s,d[68]=l,e.queue.writeBuffer(this._cameraBuffer,0,d.buffer),this._extractFrustumPlanes(o.data)}_extractFrustumPlanes(e){const t=this._frustumPlanes;t[0]=e[3]+e[0],t[1]=e[7]+e[4],t[2]=e[11]+e[8],t[3]=e[15]+e[12],t[4]=e[3]-e[0],t[5]=e[7]-e[4],t[6]=e[11]-e[8],t[7]=e[15]-e[12],t[8]=e[3]+e[1],t[9]=e[7]+e[5],t[10]=e[11]+e[9],t[11]=e[15]+e[13],t[12]=e[3]-e[1],t[13]=e[7]-e[5],t[14]=e[11]-e[9],t[15]=e[15]-e[13],t[16]=e[2],t[17]=e[6],t[18]=e[10],t[19]=e[14],t[20]=e[3]-e[2],t[21]=e[7]-e[6],t[22]=e[11]-e[10],t[23]=e[15]-e[14]}_isVisible(e,t,n){const o=this._frustumPlanes,i=e+yn,a=t+yn,s=n+yn;for(let l=0;l<6;l++){const d=o[l*4],p=o[l*4+1],f=o[l*4+2],h=o[l*4+3];if(d*(d>=0?i:e)+p*(p>=0?a:t)+f*(f>=0?s:n)+h<0)return!1}return!0}updateTime(e,t,n=1){e.queue.writeBuffer(this._waterBuffer,0,new Float32Array([t,n,0,0]).buffer)}addChunk(e,t){const n=this._chunks.get(e);n?this._replaceMeshBuffer(n,t):this._chunks.set(e,this._createChunkGpu(e,t))}updateChunk(e,t){const n=this._chunks.get(e);n?this._replaceMeshBuffer(n,t):this._chunks.set(e,this._createChunkGpu(e,t))}removeChunk(e){var n;const t=this._chunks.get(e);t&&((n=t.buffer)==null||n.destroy(),t.uniformBuffer.destroy(),this._chunks.delete(e))}execute(e,t){const{width:n,height:o}=this._refractionTex;e.copyTextureToTexture({texture:this._hdrTexture},{texture:this._refractionTex},{width:n,height:o,depthOrArrayLayers:1});const i=e.beginRenderPass({label:"WaterPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}]});i.setPipeline(this._pipeline),i.setBindGroup(0,this._cameraBG),i.setBindGroup(1,this._waterBG),i.setBindGroup(3,this._sceneBG);for(const a of this._chunks.values())!a.buffer||a.vertexCount===0||this._isVisible(a.ox,a.oy,a.oz)&&(i.setBindGroup(2,a.chunkBG),i.setVertexBuffer(0,a.buffer),i.draw(a.vertexCount));i.end()}destroy(){var e;this._cameraBuffer.destroy(),this._waterBuffer.destroy(),this._refractionTex.destroy();for(const t of this._chunks.values())(e=t.buffer)==null||e.destroy(),t.uniformBuffer.destroy();this._chunks.clear()}static _makeRefractionTex(e,t,n){const o=e.createTexture({label:"WaterRefractionTex",size:{width:t,height:n},format:ie,usage:GPUTextureUsage.COPY_DST|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT}),i=o.createView();return{refractionTex:o,refractionView:i}}static _makeSceneBG(e,t,n,o,i,a,s,l){return e.createBindGroup({label:"WaterSceneBG",layout:t,entries:[{binding:0,resource:n},{binding:1,resource:o},{binding:2,resource:i.view},{binding:3,resource:a.view},{binding:4,resource:s.view},{binding:5,resource:l}]})}_createChunkGpu(e,t){const n=this._device.createBuffer({label:`WaterChunkBuf(${e.globalPosition.x},${e.globalPosition.y},${e.globalPosition.z})`,size:Ea,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(n,0,new Float32Array([e.globalPosition.x,e.globalPosition.y,e.globalPosition.z,0]));const o=this._device.createBindGroup({label:"WaterChunkBG",layout:this._chunkBGL,entries:[{binding:0,resource:{buffer:n}}]}),i={ox:e.globalPosition.x,oy:e.globalPosition.y,oz:e.globalPosition.z,buffer:null,vertexCount:0,uniformBuffer:n,chunkBG:o};return this._replaceMeshBuffer(i,t),i}_replaceMeshBuffer(e,t){var n;if((n=e.buffer)==null||n.destroy(),e.buffer=null,e.vertexCount=t.waterCount,t.waterCount>0){const o=this._device.createBuffer({label:"WaterVertexBuf",size:t.waterCount*bn,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(o,0,t.water.buffer,0,t.waterCount*bn),e.buffer=o}}}const Ma=`// Shadow pass for transparent chunk geometry — samples color atlas alpha for discard.
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
`,Ua=`// Shadow pass for prop billboards (flowers, grass, torches, etc.).
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
`,Ca=4,ze=5*4;class Kn extends be{constructor(e,t,n,o,i,a,s,l,d,p,f){super();c(this,"name","WorldShadowPass");c(this,"shadowChunkRadius",4);c(this,"_camX",0);c(this,"_camZ",0);c(this,"_device");c(this,"_shadowMapArrayViews");c(this,"_pipeline");c(this,"_transparentPipeline");c(this,"_propPipeline");c(this,"_cascadeBGs");c(this,"_cascadeBuffers");c(this,"_modelBGL");c(this,"_atlasBG");c(this,"_orientBG_X");c(this,"_orientBG_Z");c(this,"_chunks",new Map);c(this,"_cascades",[]);this._device=e,this._shadowMapArrayViews=t,this._pipeline=n,this._transparentPipeline=o,this._propPipeline=i,this._cascadeBGs=a,this._cascadeBuffers=s,this._modelBGL=l,this._atlasBG=d,this._orientBG_X=p,this._orientBG_Z=f}static create(e,t,n,o){const{device:i}=e,a=i.createBindGroupLayout({label:"WorldShadowCascadeBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),s=i.createBindGroupLayout({label:"WorldShadowModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),l=i.createBindGroupLayout({label:"WorldShadowAtlasBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),d=[],p=[];for(let b=0;b<Math.min(n,Ca);b++){const k=i.createBuffer({label:`WorldShadowCascadeBuf${b}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});d.push(k),p.push(i.createBindGroup({label:`WorldShadowCascadeBG${b}`,layout:a,entries:[{binding:0,resource:{buffer:k}}]}))}const f=N.MAX,h=i.createBuffer({label:"WorldShadowBlockDataBuf",size:Math.max(f*16,16),usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),m=jo,_=new Uint32Array(f*4);for(let b=0;b<f;b++){const k=nn[b];k&&(_[b*4+0]=k.sideFace.y*m+k.sideFace.x,_[b*4+1]=k.bottomFace.y*m+k.bottomFace.x,_[b*4+2]=k.topFace.y*m+k.topFace.x)}i.queue.writeBuffer(h,0,_);const y=i.createSampler({label:"WorldShadowAtlasSampler",magFilter:"nearest",minFilter:"nearest"}),w=i.createBindGroup({label:"WorldShadowAtlasBG",layout:l,entries:[{binding:0,resource:o.colorAtlas.view},{binding:1,resource:y},{binding:2,resource:{buffer:h}}]}),x=i.createShaderModule({label:"WorldShadowShader",code:qo}),B=i.createPipelineLayout({bindGroupLayouts:[a,s]}),P=i.createRenderPipeline({label:"WorldShadowPipeline",layout:B,vertex:{module:x,entryPoint:"vs_main",buffers:[{arrayStride:ze,attributes:[{shaderLocation:0,offset:0,format:"float32x3"}]}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}}),S=i.createShaderModule({label:"WorldShadowTranspShader",code:Ma}),M=i.createPipelineLayout({bindGroupLayouts:[a,s,l]}),L=i.createRenderPipeline({label:"WorldShadowTransparentPipeline",layout:M,vertex:{module:S,entryPoint:"vs_main",buffers:[{arrayStride:ze,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32"},{shaderLocation:2,offset:16,format:"float32"}]}]},fragment:{module:S,entryPoint:"fs_alpha_test",targets:[]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}}),A=i.createBindGroupLayout({label:"WorldShadowOrientBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),O=(b,k,U,F)=>{const W=i.createBuffer({label:b,size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return i.queue.writeBuffer(W,0,new Float32Array([k,U,F,0])),i.createBindGroup({label:b,layout:A,entries:[{binding:0,resource:{buffer:W}}]})},T=O("PropShadowOrientBG_X",1,0,0),v=O("PropShadowOrientBG_Z",0,0,1),C=i.createShaderModule({label:"WorldShadowPropShader",code:Ua}),g=i.createPipelineLayout({bindGroupLayouts:[a,s,l,A]}),G=i.createRenderPipeline({label:"WorldShadowPropPipeline",layout:g,vertex:{module:C,entryPoint:"vs_main",buffers:[{arrayStride:ze,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32"},{shaderLocation:2,offset:16,format:"float32"}]}]},fragment:{module:C,entryPoint:"fs_alpha_test",targets:[]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}});return new Kn(i,t,P,L,G,p,d,s,w,T,v)}update(e,t,n,o){this._cascades=t,this._camX=n,this._camZ=o;const i=Math.min(t.length,this._cascadeBuffers.length);for(let a=0;a<i;a++)e.queue.writeBuffer(this._cascadeBuffers[a],0,t[a].lightViewProj.data.buffer)}addChunk(e,t){const n=this._chunks.get(e);n?this._replaceMeshBuffer(n,t):this._chunks.set(e,this._createChunkGpu(e,t))}updateChunk(e,t){const n=this._chunks.get(e);n?this._replaceMeshBuffer(n,t):this._chunks.set(e,this._createChunkGpu(e,t))}removeChunk(e){var n,o,i;const t=this._chunks.get(e);t&&((n=t.opaqueBuffer)==null||n.destroy(),(o=t.transparentBuffer)==null||o.destroy(),(i=t.propBuffer)==null||i.destroy(),t.modelBuffer.destroy(),this._chunks.delete(e))}execute(e,t){const n=Math.min(this._cascades.length,this._cascadeBuffers.length);for(let o=0;o<n;o++){const i=e.beginRenderPass({label:`WorldShadowPass cascade ${o}`,colorAttachments:[],depthStencilAttachment:{view:this._shadowMapArrayViews[o],depthLoadOp:"load",depthStoreOp:"store"}});i.setBindGroup(0,this._cascadeBGs[o]);const a=this.shadowChunkRadius*16,s=a*a;i.setPipeline(this._pipeline);for(const l of this._chunks.values()){if(!l.opaqueBuffer||l.opaqueCount===0)continue;const d=l.ox-this._camX,p=l.oz-this._camZ;d*d+p*p>s||(i.setBindGroup(1,l.modelBG),i.setVertexBuffer(0,l.opaqueBuffer),i.draw(l.opaqueCount))}i.setPipeline(this._transparentPipeline),i.setBindGroup(2,this._atlasBG);for(const l of this._chunks.values()){if(!l.transparentBuffer||l.transparentCount===0)continue;const d=l.ox-this._camX,p=l.oz-this._camZ;d*d+p*p>s||(i.setBindGroup(1,l.modelBG),i.setVertexBuffer(0,l.transparentBuffer),i.draw(l.transparentCount))}i.setPipeline(this._propPipeline),i.setBindGroup(2,this._atlasBG);for(const l of[this._orientBG_X,this._orientBG_Z]){i.setBindGroup(3,l);for(const d of this._chunks.values()){if(!d.propBuffer||d.propCount===0)continue;const p=d.ox-this._camX,f=d.oz-this._camZ;p*p+f*f>s||(i.setBindGroup(1,d.modelBG),i.setVertexBuffer(0,d.propBuffer),i.draw(d.propCount))}}i.end()}}destroy(){var e,t,n;for(const o of this._cascadeBuffers)o.destroy();for(const o of this._chunks.values())(e=o.opaqueBuffer)==null||e.destroy(),(t=o.transparentBuffer)==null||t.destroy(),(n=o.propBuffer)==null||n.destroy(),o.modelBuffer.destroy();this._chunks.clear()}_createChunkGpu(e,t){const n=e.globalPosition,o=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,n.x,n.y,n.z,1]),i=this._device.createBuffer({label:"WorldShadowModelBuf",size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(i,0,o.buffer);const a=this._device.createBindGroup({label:"WorldShadowModelBG",layout:this._modelBGL,entries:[{binding:0,resource:{buffer:i}}]}),s={ox:n.x,oz:n.z,opaqueBuffer:null,opaqueCount:0,transparentBuffer:null,transparentCount:0,propBuffer:null,propCount:0,modelBuffer:i,modelBG:a};return this._replaceMeshBuffer(s,t),s}_replaceMeshBuffer(e,t){var n,o,i;if((n=e.opaqueBuffer)==null||n.destroy(),e.opaqueBuffer=null,e.opaqueCount=t.opaqueCount,t.opaqueCount>0){const a=this._device.createBuffer({label:"WorldShadowOpaqueBuf",size:t.opaqueCount*ze,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.opaque.buffer,0,t.opaqueCount*ze),e.opaqueBuffer=a}if((o=e.transparentBuffer)==null||o.destroy(),e.transparentBuffer=null,e.transparentCount=t.transparentCount,t.transparentCount>0){const a=this._device.createBuffer({label:"WorldShadowTransparentBuf",size:t.transparentCount*ze,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.transparent.buffer,0,t.transparentCount*ze),e.transparentBuffer=a}if((i=e.propBuffer)==null||i.destroy(),e.propBuffer=null,e.propCount=t.propCount,t.propCount>0){const a=this._device.createBuffer({label:"WorldShadowPropBuf",size:t.propCount*ze,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.prop.buffer,0,t.propCount*ze),e.propBuffer=a}}}const ka=`// Additive deferred pass for point and spot lights.
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
`,to=64*4+16+16,La=8,no=48,ro=128;class Jn extends be{constructor(e,t,n,o,i,a,s,l,d,p){super();c(this,"name","PointSpotLightPass");c(this,"_pipeline");c(this,"_cameraBG");c(this,"_gbufferBG");c(this,"_lightBG");c(this,"_shadowBG");c(this,"_cameraBuffer");c(this,"_lightCountsBuffer");c(this,"_pointBuffer");c(this,"_spotBuffer");c(this,"_hdrView");c(this,"_cameraData",new Float32Array(to/4));c(this,"_lightCountsArr",new Uint32Array(2));c(this,"_pointBuf",new ArrayBuffer(Rt*no));c(this,"_pointF32",new Float32Array(this._pointBuf));c(this,"_pointI32",new Int32Array(this._pointBuf));c(this,"_spotBuf",new ArrayBuffer(It*ro));c(this,"_spotF32",new Float32Array(this._spotBuf));c(this,"_spotI32",new Int32Array(this._spotBuf));this._pipeline=e,this._cameraBG=t,this._gbufferBG=n,this._lightBG=o,this._shadowBG=i,this._cameraBuffer=a,this._lightCountsBuffer=s,this._pointBuffer=l,this._spotBuffer=d,this._hdrView=p}static create(e,t,n,o){const{device:i}=e,a=i.createBuffer({label:"PSLCameraBuffer",size:to,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),s=i.createBuffer({label:"PSLLightCounts",size:La,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),l=i.createBuffer({label:"PSLPointBuffer",size:Rt*no,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),d=i.createBuffer({label:"PSLSpotBuffer",size:It*ro,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),p=i.createSampler({label:"PSLLinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),f=i.createSampler({label:"PSLVsmSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge"}),h=i.createSampler({label:"PSLProjSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),m=i.createBindGroupLayout({label:"PSLCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),_=i.createBindGroupLayout({label:"PSLGBufferBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),y=i.createBindGroupLayout({label:"PSLLightBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),w=i.createBindGroupLayout({label:"PSLShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube-array"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d-array"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d-array"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),x=i.createBindGroup({label:"PSLCameraBG",layout:m,entries:[{binding:0,resource:{buffer:a}}]}),B=i.createBindGroup({label:"PSLGBufferBG",layout:_,entries:[{binding:0,resource:t.albedoRoughnessView},{binding:1,resource:t.normalMetallicView},{binding:2,resource:t.depthView},{binding:3,resource:p}]}),P=i.createBindGroup({label:"PSLLightBG",layout:y,entries:[{binding:0,resource:{buffer:s}},{binding:1,resource:{buffer:l}},{binding:2,resource:{buffer:d}}]}),S=i.createBindGroup({label:"PSLShadowBG",layout:w,entries:[{binding:0,resource:n.pointVsmView},{binding:1,resource:n.spotVsmView},{binding:2,resource:n.projTexView},{binding:3,resource:f},{binding:4,resource:h}]}),M=i.createShaderModule({label:"PointSpotLightShader",code:ka}),L=i.createRenderPipeline({label:"PointSpotLightPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[m,_,y,w]}),vertex:{module:M,entryPoint:"vs_main"},fragment:{module:M,entryPoint:"fs_main",targets:[{format:ie,blend:{color:{srcFactor:"one",dstFactor:"one",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one",operation:"add"}}}]},primitive:{topology:"triangle-list"}});return new Jn(L,x,B,P,S,a,s,l,d,o)}updateCamera(e,t,n,o,i,a,s,l){const d=this._cameraData;d.set(t.data,0),d.set(n.data,16),d.set(o.data,32),d.set(i.data,48),d[64]=a.x,d[65]=a.y,d[66]=a.z,d[67]=s,d[68]=l,e.queue.writeBuffer(this._cameraBuffer,0,d.buffer)}updateLights(e,t,n){const o=this._lightCountsArr;o[0]=Math.min(t.length,Rt),o[1]=Math.min(n.length,It),e.queue.writeBuffer(this._lightCountsBuffer,0,o.buffer);const i=this._pointF32,a=this._pointI32;let s=0;for(let f=0;f<Math.min(t.length,Rt);f++){const h=t[f],m=h.worldPosition(),_=f*12;i[_+0]=m.x,i[_+1]=m.y,i[_+2]=m.z,i[_+3]=h.radius,i[_+4]=h.color.x,i[_+5]=h.color.y,i[_+6]=h.color.z,i[_+7]=h.intensity,h.castShadow&&s<ut?a[_+8]=s++:a[_+8]=-1,a[_+9]=0,a[_+10]=0,a[_+11]=0}e.queue.writeBuffer(this._pointBuffer,0,this._pointBuf);const l=this._spotF32,d=this._spotI32;let p=0;for(let f=0;f<Math.min(n.length,It);f++){const h=n[f],m=h.worldPosition(),_=h.worldDirection(),y=h.lightViewProj(),w=f*32;l[w+0]=m.x,l[w+1]=m.y,l[w+2]=m.z,l[w+3]=h.range,l[w+4]=_.x,l[w+5]=_.y,l[w+6]=_.z,l[w+7]=Math.cos(h.innerAngle*Math.PI/180),l[w+8]=h.color.x,l[w+9]=h.color.y,l[w+10]=h.color.z,l[w+11]=Math.cos(h.outerAngle*Math.PI/180),l[w+12]=h.intensity,h.castShadow&&p<Ye?d[w+13]=p++:d[w+13]=-1,d[w+14]=h.projectionTexture!==null?f:-1,d[w+15]=0,l.set(y.data,w+16)}e.queue.writeBuffer(this._spotBuffer,0,this._spotBuf)}execute(e,t){const n=e.beginRenderPass({label:"PointSpotLightPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._cameraBG),n.setBindGroup(1,this._gbufferBG),n.setBindGroup(2,this._lightBG),n.setBindGroup(3,this._shadowBG),n.draw(3),n.end()}destroy(){this._cameraBuffer.destroy(),this._lightCountsBuffer.destroy(),this._pointBuffer.destroy(),this._spotBuffer.destroy()}}const Yo=`
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
`;function Na(u){switch(u.kind){case"sphere":{const r=Math.cos(u.solidAngle).toFixed(6),e=u.radius.toFixed(6);return`{
  let dir = sample_cone(seed + 10u, seed + 11u, ${r});
  let world_dir = quat_rotate(uniforms.world_quat, dir);
  p.position = uniforms.world_pos + world_dir * ${e};
  p.velocity = world_dir * speed;
}`}case"cone":{const r=Math.cos(u.angle).toFixed(6),e=u.radius.toFixed(6);return`{
  let dir = sample_cone(seed + 10u, seed + 11u, ${r});
  let world_dir = quat_rotate(uniforms.world_quat, dir);
  p.position = uniforms.world_pos + world_dir * ${e};
  p.velocity = world_dir * speed;
}`}case"box":{const[r,e,t]=u.halfExtents.map(n=>n.toFixed(6));return`{
  let local_off = vec3<f32>(
    (rand_f32(seed + 10u) * 2.0 - 1.0) * ${r},
    (rand_f32(seed + 11u) * 2.0 - 1.0) * ${e},
    (rand_f32(seed + 12u) * 2.0 - 1.0) * ${t},
  );
  let up = quat_rotate(uniforms.world_quat, vec3<f32>(0.0, 1.0, 0.0));
  p.position = uniforms.world_pos + quat_rotate(uniforms.world_quat, local_off);
  p.velocity = up * speed;
}`}}}function Xo(u){switch(u.type){case"gravity":return`p.velocity.y -= ${u.strength.toFixed(6)} * uniforms.dt;`;case"drag":return`p.velocity -= p.velocity * ${u.coefficient.toFixed(6)} * uniforms.dt;`;case"force":{const[r,e,t]=u.direction.map(n=>n.toFixed(6));return`p.velocity += vec3<f32>(${r}, ${e}, ${t}) * ${u.strength.toFixed(6)} * uniforms.dt;`}case"swirl_force":{const r=u.speed.toFixed(6),e=u.strength.toFixed(6);return`{
  let swirl_angle = uniforms.time * ${r};
  p.velocity += vec3<f32>(cos(swirl_angle), 0.0, sin(swirl_angle)) * ${e} * uniforms.dt;
}`}case"vortex":return`{
  let vx_radial = p.position.xz - uniforms.world_pos.xz;
  p.velocity += vec3<f32>(-vx_radial.y, 0.0, vx_radial.x) * ${u.strength.toFixed(6)} * uniforms.dt;
}`;case"curl_noise":{const r=u.octaves??1,e=r>1?`curl_noise_fbm(cn_pos, ${r})`:"curl_noise(cn_pos)";return`{
  let cn_pos = p.position * ${u.scale.toFixed(6)} + uniforms.time * ${u.timeScale.toFixed(6)};
  p.velocity += ${e} * ${u.strength.toFixed(6)} * uniforms.dt;
}`}case"size_random":return`p.size = rand_range(${u.min.toFixed(6)}, ${u.max.toFixed(6)}, pcg_hash(idx * 2654435761u));`;case"size_over_lifetime":return`p.size = mix(${u.start.toFixed(6)}, ${u.end.toFixed(6)}, t);`;case"color_over_lifetime":{const[r,e,t,n]=u.startColor.map(l=>l.toFixed(6)),[o,i,a,s]=u.endColor.map(l=>l.toFixed(6));return`p.color = mix(vec4<f32>(${r}, ${e}, ${t}, ${n}), vec4<f32>(${o}, ${i}, ${a}, ${s}), t);`}case"block_collision":return`{
  let _bc_uv = (p.position.xz - vec2<f32>(hm.origin_x, hm.origin_z)) / (hm.extent * 2.0) + 0.5;
  if (all(_bc_uv >= vec2<f32>(0.0)) && all(_bc_uv <= vec2<f32>(1.0))) {
    let _bc_xi = clamp(u32(_bc_uv.x * f32(hm.resolution)), 0u, hm.resolution - 1u);
    let _bc_zi = clamp(u32(_bc_uv.y * f32(hm.resolution)), 0u, hm.resolution - 1u);
    if (p.position.y <= hm_data[_bc_zi * hm.resolution + _bc_xi]) {
      particles[idx].life = -1.0; return;
    }
  }
}`}}function $o(u,r){return u?u.filter(e=>e.trigger===r).flatMap(e=>e.actions.map(Xo)).join(`
  `):""}function Ra(u){const{emitter:r,events:e}=u,[t,n]=r.lifetime.map(h=>h.toFixed(6)),[o,i]=r.initialSpeed.map(h=>h.toFixed(6)),[a,s]=r.initialSize.map(h=>h.toFixed(6)),[l,d,p,f]=r.initialColor.map(h=>h.toFixed(6));return`
${Yo}

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
  p.max_life = rand_range(${t}, ${n}, seed + 2u);
  p.color    = vec4<f32>(${l}, ${d}, ${p}, ${f});
  p.size     = rand_range(${a}, ${s}, seed + 3u);
  p.rotation = rand_f32(seed + 4u) * 6.28318530717958647;

  ${Na(r.shape)}

  ${$o(e,"on_spawn")}

  particles[idx] = p;
}
`}function Ia(u){return u.modifiers.some(r=>r.type==="block_collision")}const Oa=`
struct HeightmapUniforms {
  origin_x  : f32,
  origin_z  : f32,
  extent    : f32,
  resolution: u32,
}
@group(2) @binding(0) var<storage, read> hm_data: array<f32>;
@group(2) @binding(1) var<uniform>       hm     : HeightmapUniforms;
`;function Va(u){const r=u.modifiers.some(n=>n.type==="block_collision"),e=u.modifiers.map(Xo).join(`
  `),t=$o(u.events,"on_death");return`
${Yo}
${r?Oa:""}

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
`}const Da=`// Compact pass — rebuilds alive_list and writes indirect draw instance count.
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
`,za=`// Particle GBuffer render pass — camera-facing billboard quads.
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
`,Fa=`// Particle forward HDR render pass — velocity-aligned billboard quads.
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
`,oo=64,io=80,Ha=16,Wa=16,ao=288,so=16,xn=128;class Qn extends be{constructor(e,t,n,o,i,a,s,l,d,p,f,h,m,_,y,w,x,B,P,S,M,L,A,O,T,v,C){super();c(this,"name","ParticlePass");c(this,"_gbuffer");c(this,"_hdrView");c(this,"_isForward");c(this,"_maxParticles");c(this,"_config");c(this,"_particleBuffer");c(this,"_aliveList");c(this,"_counterBuffer");c(this,"_indirectBuffer");c(this,"_computeUniforms");c(this,"_renderUniforms");c(this,"_cameraBuffer");c(this,"_spawnPipeline");c(this,"_updatePipeline");c(this,"_compactPipeline");c(this,"_indirectPipeline");c(this,"_renderPipeline");c(this,"_computeDataBG");c(this,"_computeUniBG");c(this,"_compactDataBG");c(this,"_compactUniBG");c(this,"_renderDataBG");c(this,"_cameraRenderBG");c(this,"_renderParamsBG");c(this,"_heightmapDataBuf");c(this,"_heightmapUniBuf");c(this,"_heightmapBG");c(this,"_spawnAccum",0);c(this,"_spawnOffset",0);c(this,"_spawnCount",0);c(this,"_time",0);c(this,"_frameSeed",0);c(this,"_cuBuf",new Float32Array(io/4));c(this,"_cuiView",new Uint32Array(this._cuBuf.buffer));c(this,"_camBuf",new Float32Array(ao/4));c(this,"_hmUniBuf",new Float32Array(so/4));c(this,"_hmRes",new Uint32Array([xn]));c(this,"_resetArr",new Uint32Array(1));this._gbuffer=e,this._hdrView=t,this._isForward=n,this._config=o,this._maxParticles=i,this._particleBuffer=a,this._aliveList=s,this._counterBuffer=l,this._indirectBuffer=d,this._computeUniforms=p,this._renderUniforms=f,this._cameraBuffer=h,this._spawnPipeline=m,this._updatePipeline=_,this._compactPipeline=y,this._indirectPipeline=w,this._renderPipeline=x,this._computeDataBG=B,this._computeUniBG=P,this._compactDataBG=S,this._compactUniBG=M,this._renderDataBG=L,this._cameraRenderBG=A,this._renderParamsBG=O,this._heightmapDataBuf=T,this._heightmapUniBuf=v,this._heightmapBG=C}static create(e,t,n,o){const{device:i}=e,a=t.renderer.type==="sprites"&&t.renderer.renderTarget==="hdr",s=t.emitter.maxParticles,l=i.createBuffer({label:"ParticleBuffer",size:s*oo,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),d=new Float32Array(s*(oo/4));for(let K=0;K<s;K++)d[K*16+3]=-1;i.queue.writeBuffer(l,0,d.buffer);const p=i.createBuffer({label:"ParticleAliveList",size:s*4,usage:GPUBufferUsage.STORAGE}),f=i.createBuffer({label:"ParticleCounter",size:4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),h=i.createBuffer({label:"ParticleIndirect",size:16,usage:GPUBufferUsage.INDIRECT|GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});i.queue.writeBuffer(h,0,new Uint32Array([6,0,0,0]));const m=i.createBuffer({label:"ParticleComputeUniforms",size:io,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),_=i.createBuffer({label:"ParticleCompactUniforms",size:Ha,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});i.queue.writeBuffer(_,0,new Uint32Array([s,0,0,0]));const y=i.createBuffer({label:"ParticleRenderUniforms",size:Wa,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});i.queue.writeBuffer(y,0,new Float32Array([t.emitter.roughness,t.emitter.metallic,0,0]));const w=i.createBuffer({label:"ParticleCameraBuffer",size:ao,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),x=i.createBindGroupLayout({label:"ParticleComputeDataBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),B=i.createBindGroupLayout({label:"ParticleCompactDataBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),P=i.createBindGroupLayout({label:"ParticleComputeUniBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),S=i.createBindGroupLayout({label:"ParticleRenderDataBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}}]}),M=i.createBindGroupLayout({label:"ParticleCameraRenderBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),L=i.createBindGroupLayout({label:"ParticleRenderParamsBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),A=i.createBindGroup({label:"ParticleComputeDataBG",layout:x,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:p}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:h}}]}),O=i.createBindGroup({label:"ParticleCompactDataBG",layout:B,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:p}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:h}}]}),T=i.createBindGroup({label:"ParticleComputeUniBG",layout:P,entries:[{binding:0,resource:{buffer:m}}]}),v=i.createBindGroup({label:"ParticleCompactUniBG",layout:P,entries:[{binding:0,resource:{buffer:_}}]}),C=i.createBindGroup({label:"ParticleRenderDataBG",layout:S,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:p}}]}),g=i.createBindGroup({label:"ParticleCameraRenderBG",layout:M,entries:[{binding:0,resource:{buffer:w}}]}),G=i.createBindGroup({label:"ParticleRenderParamsBG",layout:L,entries:[{binding:0,resource:{buffer:y}}]});let b,k,U,F;Ia(t)&&(b=i.createBuffer({label:"ParticleHeightmapData",size:xn*xn*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),k=i.createBuffer({label:"ParticleHeightmapUniforms",size:so,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),F=i.createBindGroupLayout({label:"ParticleHeightmapBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),U=i.createBindGroup({label:"ParticleHeightmapBG",layout:F,entries:[{binding:0,resource:{buffer:b}},{binding:1,resource:{buffer:k}}]}));const W=i.createPipelineLayout({bindGroupLayouts:[x,P]}),V=F?i.createPipelineLayout({bindGroupLayouts:[x,P,F]}):i.createPipelineLayout({bindGroupLayouts:[x,P]}),Z=i.createPipelineLayout({bindGroupLayouts:[B,P]}),se=i.createShaderModule({label:"ParticleSpawn",code:Ra(t)}),fe=i.createShaderModule({label:"ParticleUpdate",code:Va(t)}),re=i.createShaderModule({label:"ParticleCompact",code:Da}),te=i.createComputePipeline({label:"ParticleSpawnPipeline",layout:W,compute:{module:se,entryPoint:"cs_main"}}),X=i.createComputePipeline({label:"ParticleUpdatePipeline",layout:V,compute:{module:fe,entryPoint:"cs_main"}}),J=i.createComputePipeline({label:"ParticleCompactPipeline",layout:Z,compute:{module:re,entryPoint:"cs_compact"}}),R=i.createComputePipeline({label:"ParticleIndirectPipeline",layout:Z,compute:{module:re,entryPoint:"cs_write_indirect"}});let z;if(a){const K=t.renderer.type==="sprites"?t.renderer.billboard:"camera",Q=K==="camera"?"vs_camera":"vs_main",_e=K==="camera"?"fs_snow":"fs_main",xe=i.createShaderModule({label:"ParticleRenderForward",code:Fa}),ae=i.createPipelineLayout({bindGroupLayouts:[S,M]});z=i.createRenderPipeline({label:"ParticleForwardPipeline",layout:ae,vertex:{module:xe,entryPoint:Q},fragment:{module:xe,entryPoint:_e,targets:[{format:ie,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},depthStencil:{format:"depth32float",depthWriteEnabled:!1,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}})}else{const K=i.createShaderModule({label:"ParticleRender",code:za}),Q=i.createPipelineLayout({bindGroupLayouts:[S,M,L]});z=i.createRenderPipeline({label:"ParticleRenderPipeline",layout:Q,vertex:{module:K,entryPoint:"vs_main"},fragment:{module:K,entryPoint:"fs_main",targets:[{format:"rgba8unorm"},{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}})}return new Qn(n,o,a,t,s,l,p,f,h,m,y,w,te,X,J,R,z,A,T,O,v,C,g,a?void 0:G,b,k,U)}updateHeightmap(e,t,n,o,i){if(!this._heightmapDataBuf||!this._heightmapUniBuf)return;e.queue.writeBuffer(this._heightmapDataBuf,0,t.buffer);const a=this._hmUniBuf;a[0]=n,a[1]=o,a[2]=i,e.queue.writeBuffer(this._heightmapUniBuf,0,a.buffer,0,12),e.queue.writeBuffer(this._heightmapUniBuf,12,this._hmRes)}update(e,t,n,o,i,a,s,l,d,p){this._time+=t,this._frameSeed=this._frameSeed+1&4294967295,this._spawnAccum+=this._config.emitter.spawnRate*t,this._spawnCount=Math.min(Math.floor(this._spawnAccum),this._maxParticles),this._spawnAccum-=this._spawnCount;const f=p.data,h=f[12],m=f[13],_=f[14],y=Math.hypot(f[0],f[1],f[2]),w=Math.hypot(f[4],f[5],f[6]),x=Math.hypot(f[8],f[9],f[10]),B=f[0]/y,P=f[1]/y,S=f[2]/y,M=f[4]/w,L=f[5]/w,A=f[6]/w,O=f[8]/x,T=f[9]/x,v=f[10]/x,C=B+L+v;let g,G,b,k;if(C>0){const V=.5/Math.sqrt(C+1);k=.25/V,g=(A-T)*V,G=(O-S)*V,b=(P-M)*V}else if(B>L&&B>v){const V=2*Math.sqrt(1+B-L-v);k=(A-T)/V,g=.25*V,G=(M+P)/V,b=(O+S)/V}else if(L>v){const V=2*Math.sqrt(1+L-B-v);k=(O-S)/V,g=(M+P)/V,G=.25*V,b=(T+A)/V}else{const V=2*Math.sqrt(1+v-B-L);k=(P-M)/V,g=(O+S)/V,G=(T+A)/V,b=.25*V}const U=this._cuBuf,F=this._cuiView;U[0]=h,U[1]=m,U[2]=_,F[3]=this._spawnCount,U[4]=g,U[5]=G,U[6]=b,U[7]=k,F[8]=this._spawnOffset,F[9]=this._maxParticles,F[10]=this._frameSeed,F[11]=0,U[12]=t,U[13]=this._time,e.queue.writeBuffer(this._computeUniforms,0,U.buffer),e.queue.writeBuffer(this._counterBuffer,0,this._resetArr),this._spawnOffset=(this._spawnOffset+this._spawnCount)%this._maxParticles;const W=this._camBuf;W.set(n.data,0),W.set(o.data,16),W.set(i.data,32),W.set(a.data,48),W[64]=s.x,W[65]=s.y,W[66]=s.z,W[67]=l,W[68]=d,e.queue.writeBuffer(this._cameraBuffer,0,W.buffer)}execute(e,t){const n=e.beginComputePass({label:"ParticleCompute"});if(this._spawnCount>0&&(n.setPipeline(this._spawnPipeline),n.setBindGroup(0,this._computeDataBG),n.setBindGroup(1,this._computeUniBG),n.dispatchWorkgroups(Math.ceil(this._spawnCount/64))),n.setPipeline(this._updatePipeline),n.setBindGroup(0,this._computeDataBG),n.setBindGroup(1,this._computeUniBG),this._heightmapBG&&n.setBindGroup(2,this._heightmapBG),n.dispatchWorkgroups(Math.ceil(this._maxParticles/64)),n.setPipeline(this._compactPipeline),n.setBindGroup(0,this._compactDataBG),n.setBindGroup(1,this._compactUniBG),n.dispatchWorkgroups(Math.ceil(this._maxParticles/64)),n.setPipeline(this._indirectPipeline),n.dispatchWorkgroups(1),n.end(),this._isForward){const o=e.beginRenderPass({label:"ParticleForwardPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthReadOnly:!0}});o.setPipeline(this._renderPipeline),o.setBindGroup(0,this._renderDataBG),o.setBindGroup(1,this._cameraRenderBG),o.drawIndirect(this._indirectBuffer,0),o.end()}else{const o=e.beginRenderPass({label:"ParticleGBufferPass",colorAttachments:[{view:this._gbuffer.albedoRoughnessView,loadOp:"load",storeOp:"store"},{view:this._gbuffer.normalMetallicView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthLoadOp:"load",depthStoreOp:"store"}});o.setPipeline(this._renderPipeline),o.setBindGroup(0,this._renderDataBG),o.setBindGroup(1,this._cameraRenderBG),o.setBindGroup(2,this._renderParamsBG),o.drawIndirect(this._indirectBuffer,0),o.end()}}destroy(){var e,t;this._particleBuffer.destroy(),this._aliveList.destroy(),this._counterBuffer.destroy(),this._indirectBuffer.destroy(),this._computeUniforms.destroy(),this._renderUniforms.destroy(),this._cameraBuffer.destroy(),(e=this._heightmapDataBuf)==null||e.destroy(),(t=this._heightmapUniBuf)==null||t.destroy()}}const ja=`// Auto-exposure — two-pass histogram approach.
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
`,qa=64,Ya=32,Xa=16,$a=qa*4,lo={adaptSpeed:1.5,minExposure:.1,maxExposure:10,lowPct:.05,highPct:.02};class wt extends be{constructor(e,t,n,o,i,a,s,l){super();c(this,"name","AutoExposurePass");c(this,"exposureBuffer");c(this,"_histogramPipeline");c(this,"_adaptPipeline");c(this,"_bindGroup");c(this,"_paramsBuffer");c(this,"_histogramBuffer");c(this,"_hdrWidth");c(this,"_hdrHeight");c(this,"enabled",!0);this._histogramPipeline=e,this._adaptPipeline=t,this._bindGroup=n,this._paramsBuffer=o,this._histogramBuffer=i,this.exposureBuffer=a,this._hdrWidth=s,this._hdrHeight=l}static create(e,t,n=lo){const{device:o}=e,i=o.createBindGroupLayout({label:"AutoExposureBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),a=o.createBuffer({label:"AutoExposureHistogram",size:$a,usage:GPUBufferUsage.STORAGE}),s=o.createBuffer({label:"AutoExposureValue",size:Xa,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});o.queue.writeBuffer(s,0,new Float32Array([1,0,0,0]));const l=o.createBuffer({label:"AutoExposureParams",size:Ya,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});wt._writeParams(o,l,0,n);const d=o.createBindGroup({label:"AutoExposureBG",layout:i,entries:[{binding:0,resource:t.createView()},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:s}},{binding:3,resource:{buffer:l}}]}),p=o.createPipelineLayout({bindGroupLayouts:[i]}),f=o.createShaderModule({label:"AutoExposure",code:ja}),h=o.createComputePipeline({label:"AutoExposureHistogramPipeline",layout:p,compute:{module:f,entryPoint:"cs_histogram"}}),m=o.createComputePipeline({label:"AutoExposureAdaptPipeline",layout:p,compute:{module:f,entryPoint:"cs_adapt"}});return new wt(h,m,d,l,a,s,t.width,t.height)}update(e,t,n=lo){if(!this.enabled){e.device.queue.writeBuffer(this.exposureBuffer,0,new Float32Array([1,0,0,0]));return}wt._writeParams(e.device,this._paramsBuffer,t,n)}execute(e,t){if(!this.enabled)return;const n=e.beginComputePass({label:"AutoExposurePass"});n.setPipeline(this._histogramPipeline),n.setBindGroup(0,this._bindGroup),n.dispatchWorkgroups(Math.ceil(this._hdrWidth/32),Math.ceil(this._hdrHeight/32)),n.setPipeline(this._adaptPipeline),n.dispatchWorkgroups(1),n.end()}destroy(){this._paramsBuffer.destroy(),this._histogramBuffer.destroy(),this.exposureBuffer.destroy()}static _writeParams(e,t,n,o){e.queue.writeBuffer(t,0,new Float32Array([n,o.adaptSpeed,o.minExposure,o.maxExposure,o.lowPct,o.highPct,0,0]))}}function Za(u,r,e){let t=(Math.imul(u,1664525)^Math.imul(r,1013904223)^Math.imul(e,22695477))>>>0;return t=Math.imul(t^t>>>16,73244475)>>>0,t=Math.imul(t^t>>>16,73244475)>>>0,((t^t>>>16)>>>0)/4294967295}function Zt(u,r,e,t){return Za(u^t,r^t*7+3,e^t*13+5)}function wn(u){return u*u*u*(u*(u*6-15)+10)}function Ka(u,r,e,t,n,o,i,a,s,l,d){const p=u+(r-u)*s,f=e+(t-e)*s,h=n+(o-n)*s,m=i+(a-i)*s,_=p+(f-p)*l,y=h+(m-h)*l;return _+(y-_)*d}const Ja=new Int8Array([1,-1,1,-1,1,-1,1,-1,0,0,0,0]),Qa=new Int8Array([1,1,-1,-1,0,0,0,0,1,-1,1,-1]),es=new Int8Array([0,0,0,0,1,1,-1,-1,1,1,-1,-1]);function je(u,r,e,t,n,o,i,a){const s=(u%t+t)%t,l=(r%t+t)%t,d=(e%t+t)%t,p=Math.floor(Zt(s,l,d,n)*12)%12;return Ja[p]*o+Qa[p]*i+es[p]*a}function ts(u,r,e,t,n){const o=Math.floor(u),i=Math.floor(r),a=Math.floor(e),s=u-o,l=r-i,d=e-a,p=wn(s),f=wn(l),h=wn(d);return Ka(je(o,i,a,t,n,s,l,d),je(o+1,i,a,t,n,s-1,l,d),je(o,i+1,a,t,n,s,l-1,d),je(o+1,i+1,a,t,n,s-1,l-1,d),je(o,i,a+1,t,n,s,l,d-1),je(o+1,i,a+1,t,n,s-1,l,d-1),je(o,i+1,a+1,t,n,s,l-1,d-1),je(o+1,i+1,a+1,t,n,s-1,l-1,d-1),p,f,h)}function ns(u,r,e,t,n,o){let i=0,a=.5,s=1,l=0;for(let d=0;d<t;d++)i+=ts(u*s,r*s,e*s,n*s,o+d*17)*a,l+=a,a*=.5,s*=2;return Math.max(0,Math.min(1,i/l*.85+.5))}function at(u,r,e,t,n){const o=u*t,i=r*t,a=e*t,s=Math.floor(o),l=Math.floor(i),d=Math.floor(a);let p=1/0;for(let f=-1;f<=1;f++)for(let h=-1;h<=1;h++)for(let m=-1;m<=1;m++){const _=s+m,y=l+h,w=d+f,x=(_%t+t)%t,B=(y%t+t)%t,P=(w%t+t)%t,S=_+Zt(x,B,P,n),M=y+Zt(x,B,P,n+1),L=w+Zt(x,B,P,n+2),A=o-S,O=i-M,T=a-L,v=A*A+O*O+T*T;v<p&&(p=v)}return 1-Math.min(Math.sqrt(p),1)}function co(u,r,e,t){const n=u.createTexture({label:r,dimension:"3d",size:{width:e,height:e,depthOrArrayLayers:e},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return u.queue.writeTexture({texture:n},t.buffer,{bytesPerRow:e*4,rowsPerImage:e},{width:e,height:e,depthOrArrayLayers:e}),n}function rs(u){const e=new Uint8Array(1048576);for(let a=0;a<64;a++)for(let s=0;s<64;s++)for(let l=0;l<64;l++){const d=(a*64*64+s*64+l)*4,p=l/64,f=s/64,h=a/64,m=ns(p,f,h,4,4,0),_=at(p,f,h,2,100),y=at(p,f,h,4,200),w=at(p,f,h,8,300);e[d]=Math.round(m*255),e[d+1]=Math.round(_*255),e[d+2]=Math.round(y*255),e[d+3]=Math.round(w*255)}const t=32,n=new Uint8Array(t*t*t*4);for(let a=0;a<t;a++)for(let s=0;s<t;s++)for(let l=0;l<t;l++){const d=(a*t*t+s*t+l)*4,p=l/t,f=s/t,h=a/t,m=at(p,f,h,4,400),_=at(p,f,h,8,500),y=at(p,f,h,16,600);n[d]=Math.round(m*255),n[d+1]=Math.round(_*255),n[d+2]=Math.round(y*255),n[d+3]=255}const o=co(u,"CloudBaseNoise",64,e),i=co(u,"CloudDetailNoise",t,n);return{baseNoise:o,baseView:o.createView({dimension:"3d"}),detailNoise:i,detailView:i.createView({dimension:"3d"}),destroy(){o.destroy(),i.destroy()}}}const os=`// IBL baking — two compute entry points share the same bind group layout.
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
`,Dt=5,Bn=128,zt=32,is=[0,.25,.5,.75,1],as=Math.PI;function ss(u){let r=u>>>0;return r=(r<<16|r>>>16)>>>0,r=((r&1431655765)<<1|r>>>1&1431655765)>>>0,r=((r&858993459)<<2|r>>>2&858993459)>>>0,r=((r&252645135)<<4|r>>>4&252645135)>>>0,r=((r&16711935)<<8|r>>>8&16711935)>>>0,r*23283064365386963e-26}function ls(u,r,e){const t=new Float32Array(u*r*4);for(let n=0;n<r;n++)for(let o=0;o<u;o++){const i=(o+.5)/u,a=(n+.5)/r,s=a*a,l=s*s,d=Math.sqrt(1-i*i),p=i;let f=0,h=0;for(let _=0;_<e;_++){const y=(_+.5)/e,w=ss(_),x=(1-w)/(1+(l-1)*w),B=Math.sqrt(x),P=Math.sqrt(Math.max(0,1-x)),S=2*as*y,M=P*Math.cos(S),L=B,A=d*M+p*L;if(A<=0)continue;const O=2*A*L-p,T=Math.max(0,O),v=Math.max(0,B);if(T<=0)continue;const C=l/2,g=i/(i*(1-C)+C),G=T/(T*(1-C)+C),b=g*G*A/(v*i),k=Math.pow(1-A,5);f+=b*(1-k),h+=b*k}const m=(n*u+o)*4;t[m+0]=f/e,t[m+1]=h/e,t[m+2]=0,t[m+3]=1}return t}function cs(u){const r=new Float32Array([u]),e=new Uint32Array(r.buffer)[0],t=e>>31&1,n=e>>23&255,o=e&8388607;if(n===255)return t<<15|31744|(o?1:0);if(n===0)return t<<15;const i=n-127+15;return i>=31?t<<15|31744:i<=0?t<<15:t<<15|i<<10|o>>13}function us(u){const r=new Uint16Array(u.length);for(let e=0;e<u.length;e++)r[e]=cs(u[e]);return r}const uo=new WeakMap;function ds(u){const r=uo.get(u);if(r)return r;const e=us(ls(64,64,512)),t=u.createTexture({label:"IBL BRDF LUT",size:{width:64,height:64},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return u.queue.writeTexture({texture:t},e,{bytesPerRow:64*8},{width:64,height:64}),uo.set(u,t),t}const fo=new WeakMap;function fs(u){const r=fo.get(u);if(r)return r;const e=u.createBindGroupLayout({label:"IblBGL0",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.COMPUTE,sampler:{type:"filtering"}}]}),t=u.createBindGroupLayout({label:"IblBGL1",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"2d"}}]}),n=u.createPipelineLayout({bindGroupLayouts:[e,t]}),o=u.createShaderModule({label:"IblCompute",code:os}),i=u.createComputePipeline({label:"IblIrradiancePipeline",layout:n,compute:{module:o,entryPoint:"cs_irradiance"}}),a=u.createComputePipeline({label:"IblPrefilterPipeline",layout:n,compute:{module:o,entryPoint:"cs_prefilter"}}),s=u.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"clamp-to-edge"}),l={irrPipeline:i,pfPipeline:a,bgl0:e,bgl1:t,sampler:s};return fo.set(u,l),l}async function ps(u,r,e=.2){const{irrPipeline:t,pfPipeline:n,bgl0:o,bgl1:i,sampler:a}=fs(u),s=u.createTexture({label:"IBL Irradiance",size:{width:zt,height:zt,depthOrArrayLayers:6},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),l=u.createTexture({label:"IBL Prefiltered",size:{width:Bn,height:Bn,depthOrArrayLayers:6},mipLevelCount:Dt,format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),d=(T,v)=>{const C=u.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return u.queue.writeBuffer(C,0,new Float32Array([e,T,v,0])),C},p=r.createView(),f=T=>u.createBindGroup({layout:o,entries:[{binding:0,resource:{buffer:T}},{binding:1,resource:p},{binding:2,resource:a}]}),h=T=>u.createBindGroup({layout:i,entries:[{binding:0,resource:T}]}),m=Array.from({length:6},(T,v)=>d(0,v)),_=is.flatMap((T,v)=>Array.from({length:6},(C,g)=>d(T,g))),y=m.map(f),w=_.map(f),x=Array.from({length:6},(T,v)=>h(s.createView({dimension:"2d",baseArrayLayer:v,arrayLayerCount:1}))),B=Array.from({length:Dt*6},(T,v)=>{const C=Math.floor(v/6),g=v%6;return h(l.createView({dimension:"2d",baseMipLevel:C,mipLevelCount:1,baseArrayLayer:g,arrayLayerCount:1}))}),P=u.createCommandEncoder({label:"IblComputeEncoder"}),S=P.beginComputePass({label:"IblComputePass"});S.setPipeline(t);for(let T=0;T<6;T++)S.setBindGroup(0,y[T]),S.setBindGroup(1,x[T]),S.dispatchWorkgroups(Math.ceil(zt/8),Math.ceil(zt/8));S.setPipeline(n);for(let T=0;T<Dt;T++){const v=Bn>>T;for(let C=0;C<6;C++)S.setBindGroup(0,w[T*6+C]),S.setBindGroup(1,B[T*6+C]),S.dispatchWorkgroups(Math.ceil(v/8),Math.ceil(v/8))}S.end(),u.queue.submit([P.finish()]),await u.queue.onSubmittedWorkDone(),m.forEach(T=>T.destroy()),_.forEach(T=>T.destroy());const M=ds(u),L=s.createView({dimension:"cube"}),A=l.createView({dimension:"cube"}),O=M.createView();return{irradiance:s,prefiltered:l,brdfLut:M,irradianceView:L,prefilteredView:A,brdfLutView:O,levels:Dt,destroy(){s.destroy(),l.destroy()}}}class Le{constructor(r,e){c(this,"gpuTexture");c(this,"view");c(this,"type");this.gpuTexture=r,this.type=e,this.view=r.createView({dimension:e==="cube"?"cube":e==="3d"?"3d":"2d"})}destroy(){this.gpuTexture.destroy()}static createSolid(r,e,t,n,o=255){const i=r.createTexture({size:{width:1,height:1},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return r.queue.writeTexture({texture:i},new Uint8Array([e,t,n,o]),{bytesPerRow:4},{width:1,height:1}),new Le(i,"2d")}static fromBitmap(r,e,{srgb:t=!1,usage:n}={}){const o=t?"rgba8unorm-srgb":"rgba8unorm";n=n?n|(GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT):GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT;const i=r.createTexture({size:{width:e.width,height:e.height},format:o,usage:n});return r.queue.copyExternalImageToTexture({source:e,flipY:!1},{texture:i},{width:e.width,height:e.height}),new Le(i,"2d")}static async fromUrl(r,e,t={}){const n=await(await fetch(e)).blob(),o={colorSpaceConversion:"none"};t.resizeWidth!==void 0&&t.resizeHeight!==void 0&&(o.resizeWidth=t.resizeWidth,o.resizeHeight=t.resizeHeight,o.resizeQuality="high");const i=await createImageBitmap(n,o);return Le.fromBitmap(r,i,t)}}const hs=`// Decodes an RGBE (Radiance HDR) texture into a linear rgba16float texture.
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
`;function ms(u){const r=new Uint8Array(u);let e=0;function t(){let f="";for(;e<r.length&&r[e]!==10;)r[e]!==13&&(f+=String.fromCharCode(r[e])),e++;return e<r.length&&e++,f}const n=t();if(!n.startsWith("#?RADIANCE")&&!n.startsWith("#?RGBE"))throw new Error(`Not a Radiance HDR file (magic: "${n}")`);for(;t().length!==0;);const o=t(),i=o.match(/-Y\s+(\d+)\s+\+X\s+(\d+)/);if(!i)throw new Error(`Unrecognized HDR resolution: "${o}"`);const a=parseInt(i[1],10),s=parseInt(i[2],10),l=new Uint8Array(s*a*4);function d(f){const h=new Uint8Array(s),m=new Uint8Array(s),_=new Uint8Array(s),y=new Uint8Array(s),w=[h,m,_,y];for(let B=0;B<4;B++){const P=w[B];let S=0;for(;S<s;){const M=r[e++];if(M>128){const L=M-128,A=r[e++];P.fill(A,S,S+L),S+=L}else P.set(r.subarray(e,e+M),S),e+=M,S+=M}}const x=f*s*4;for(let B=0;B<s;B++)l[x+B*4+0]=h[B],l[x+B*4+1]=m[B],l[x+B*4+2]=_[B],l[x+B*4+3]=y[B]}function p(f,h,m,_,y){const w=f*s*4;l[w+0]=h,l[w+1]=m,l[w+2]=_,l[w+3]=y;let x=1;for(;x<s;){const B=r[e++],P=r[e++],S=r[e++],M=r[e++];if(B===1&&P===1&&S===1){const L=w+(x-1)*4;for(let A=0;A<M;A++)l[w+x*4+0]=l[L+0],l[w+x*4+1]=l[L+1],l[w+x*4+2]=l[L+2],l[w+x*4+3]=l[L+3],x++}else l[w+x*4+0]=B,l[w+x*4+1]=P,l[w+x*4+2]=S,l[w+x*4+3]=M,x++}}for(let f=0;f<a&&!(e+4>r.length);f++){const h=r[e++],m=r[e++],_=r[e++],y=r[e++];if(h===2&&m===2&&!(_&128)){const w=_<<8|y;if(w!==s)throw new Error(`HDR scanline width mismatch: ${w} vs ${s}`);d(f)}else p(f,h,m,_,y)}return{width:s,height:a,data:l}}const po=new WeakMap;function _s(u){const r=po.get(u);if(r)return r;const e=u.createBindGroupLayout({label:"RgbeSrcBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"uint"}}]}),t=u.createBindGroupLayout({label:"RgbeDstBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"2d"}}]}),n=u.createPipelineLayout({bindGroupLayouts:[e,t]}),o=u.createShaderModule({label:"RgbeDecode",code:hs}),a={pipeline:u.createComputePipeline({label:"RgbeDecodePipeline",layout:n,compute:{module:o,entryPoint:"cs_decode"}}),srcBGL:e,dstBGL:t};return po.set(u,a),a}async function gs(u,r){const{width:e,height:t,data:n}=r,{pipeline:o,srcBGL:i,dstBGL:a}=_s(u),s=u.createTexture({label:"Sky RGBE Raw",size:{width:e,height:t},format:"rgba8uint",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});u.queue.writeTexture({texture:s},n.buffer,{bytesPerRow:e*4},{width:e,height:t});const l=u.createTexture({label:"Sky HDR Texture",size:{width:e,height:t},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),d=u.createBindGroup({layout:i,entries:[{binding:0,resource:s.createView()}]}),p=u.createBindGroup({layout:a,entries:[{binding:0,resource:l.createView()}]}),f=u.createCommandEncoder({label:"RgbeDecodeEncoder"}),h=f.beginComputePass({label:"RgbeDecodePass"});return h.setPipeline(o),h.setBindGroup(0,d),h.setBindGroup(1,p),h.dispatchWorkgroups(Math.ceil(e/8),Math.ceil(t/8)),h.end(),u.queue.submit([f.finish()]),await u.queue.onSubmittedWorkDone(),s.destroy(),new Le(l,"2d")}class er{constructor(r,e,t,n,o,i,a){c(this,"colorAtlas");c(this,"normalAtlas");c(this,"merAtlas");c(this,"heightAtlas");c(this,"blockSize");c(this,"blockCount");c(this,"_atlasWidth");c(this,"_atlasHeight");this.colorAtlas=r,this.normalAtlas=e,this.merAtlas=t,this.heightAtlas=n,this.blockSize=o,this._atlasWidth=i,this._atlasHeight=a,this.blockCount=Math.floor(i/o)}static async load(r,e,t,n,o,i=16){async function a(x){const B=await(await fetch(x)).blob();return createImageBitmap(B,{colorSpaceConversion:"none"})}const[s,l,d,p]=await Promise.all([a(e),a(t),a(n),a(o)]),f=s.width,h=s.height,m=Le.fromBitmap(r,s,{srgb:!0}),_=Le.fromBitmap(r,l,{srgb:!1}),y=Le.fromBitmap(r,d,{srgb:!1}),w=Le.fromBitmap(r,p,{srgb:!1});return new er(m,_,y,w,i,f,h)}uvTransform(r){const e=this.blockSize/this._atlasWidth,t=this.blockSize/this._atlasHeight;return[r*e,0,e,t]}destroy(){this.colorAtlas.destroy(),this.normalAtlas.destroy(),this.merAtlas.destroy(),this.heightAtlas.destroy()}}var Ae=(u=>(u[u.None=0]="None",u[u.SnowyMountains=1]="SnowyMountains",u[u.RockyMountains=2]="RockyMountains",u[u.GrassyPlains=3]="GrassyPlains",u[u.SnowyPlains=4]="SnowyPlains",u[u.Desert=5]="Desert",u[u.Max=6]="Max",u))(Ae||{}),dt=(u=>(u[u.None=0]="None",u[u.Rain=1]="Rain",u[u.Snow=2]="Snow",u))(dt||{});function vs(u){switch(u){case 1:return 2;case 4:return 2;default:return 0}}function ho(u){switch(u){case 1:return{cloudBase:90,cloudTop:200};case 2:return{cloudBase:75,cloudTop:160};default:return{cloudBase:75,cloudTop:105}}}const Ft=.05,bs=[[.35,5,3],[-.15,3,4],[-.3,4,1],[-.5,1,2]];function ys(u){for(const[e,t,n]of bs){const o=u-e;if(o>=-Ft&&o<=Ft)return{biome1:n,biome2:t,blend:(o+Ft)/(2*Ft)}}const r=xs(u);return{biome1:r,biome2:r,blend:0}}function xs(u){return u>.35?5:u>-.15?3:u>-.3?4:u>-.5?1:2}function mo(u){switch(u){case 1:return 1.2;case 4:return 1;case 3:return .75;case 2:return .9;case 5:return .15;default:return .55}}function ws(u,r){let e=(Math.imul(u|0,2654435769)^Math.imul(r|0,1367130551))>>>0;return e=Math.imul(e^e>>>16,73244475)>>>0,e=(e^e>>>16)>>>0,e/4294967296}const Y=class Y{constructor(r,e,t){c(this,"blocks",new Uint8Array(Y.CHUNK_WIDTH*Y.CHUNK_HEIGHT*Y.CHUNK_DEPTH));c(this,"globalPosition",new D);c(this,"opaqueIndex",-1);c(this,"transparentIndex",-1);c(this,"waterIndex",-1);c(this,"drawCommandIndex",-1);c(this,"chunkDataIndex",-1);c(this,"aabbTreeIndex",-1);c(this,"aliveBlocks",0);c(this,"opaqueBlocks",0);c(this,"transparentBlocks",0);c(this,"waterBlocks",0);c(this,"lightBlocks",0);c(this,"isDeleted",!1);this.globalPosition.set(r,e,t)}generateVertices(r){const e=Y.CHUNK_WIDTH,t=Y.CHUNK_HEIGHT,n=Y.CHUNK_DEPTH,o=5;let i=0,a=0,s=0;for(let g=0;g<this.blocks.length;g++){const G=this.blocks[g];G===N.NONE||ue(G)||(Me(G)?s++:it(G)?a++:i++)}const l=new Float32Array(i*36*o),d=new Float32Array(a*36*o),p=new Float32Array(s*6*o),f=new Uint16Array(e*t*6);let h=0,m=0,_=0,y=!1;const w=[],x=e+2,B=t+2,P=x*B,S=new Uint8Array(x*B*(n+2));for(let g=0;g<n;g++)for(let G=0;G<t;G++)for(let b=0;b<e;b++)S[b+1+(G+1)*x+(g+1)*P]=this.blocks[b+G*e+g*e*t];if(r!=null&&r.negX){const g=r.negX;for(let G=0;G<n;G++)for(let b=0;b<t;b++)S[0+(b+1)*x+(G+1)*P]=g[e-1+b*e+G*e*t]}if(r!=null&&r.posX){const g=r.posX;for(let G=0;G<n;G++)for(let b=0;b<t;b++)S[e+1+(b+1)*x+(G+1)*P]=g[0+b*e+G*e*t]}if(r!=null&&r.negY){const g=r.negY;for(let G=0;G<n;G++)for(let b=0;b<e;b++)S[b+1+0+(G+1)*P]=g[b+(t-1)*e+G*e*t]}if(r!=null&&r.posY){const g=r.posY;for(let G=0;G<n;G++)for(let b=0;b<e;b++)S[b+1+(t+1)*x+(G+1)*P]=g[b+0*e+G*e*t]}if(r!=null&&r.negZ){const g=r.negZ;for(let G=0;G<t;G++)for(let b=0;b<e;b++)S[b+1+(G+1)*x+0]=g[b+G*e+(n-1)*e*t]}if(r!=null&&r.posZ){const g=r.posZ;for(let G=0;G<t;G++)for(let b=0;b<e;b++)S[b+1+(G+1)*x+(n+1)*P]=g[b+G*e+0*e*t]}const M=(g,G,b,k)=>{f[(g*t+G)*6+k]|=1<<b},L=(g,G,b,k)=>(f[(g*t+G)*6+k]&1<<b)!==0,A=(g,G,b)=>S[g+1+(G+1)*x+(b+1)*P],O=(g,G)=>!(G===N.NONE||Me(g)||Me(G)||!ue(g)&&ue(G)||!it(g)&&it(G)),T=Y.CUBE_VERTS;for(let g=0;g<e;g++)for(let G=0;G<t;G++)for(let b=0;b<n;b++){const k=A(g,G,b);if(k===N.NONE)continue;if(ue(k)){w.push({x:g,y:G,z:b}),y=!0;continue}if(Me(k)){for(let X=0;X<6;X++)p[_++]=g+.5,p[_++]=G+.5,p[_++]=b+.5,p[_++]=6,p[_++]=k;continue}const F=it(k),W=O(k,A(g,G,b-1))||L(g,G,b,0),V=O(k,A(g,G,b+1))||L(g,G,b,1),Z=O(k,A(g-1,G,b))||L(g,G,b,2),se=O(k,A(g+1,G,b))||L(g,G,b,3),fe=O(k,A(g,G-1,b))||L(g,G,b,4),re=O(k,A(g,G+1,b))||L(g,G,b,5);if(W&&V&&Z&&se&&fe&&re)continue;let te=G;if(!W||!V||!Z||!se){let X=G;for(;X<t&&A(g,X,b)===k;){te=X;X++}}if(!W||!V){let X=g,J=g,R=0;for(;J<e&&A(J,G,b)===k;){let q=G;for(;q<=te&&A(J,q,b)===k;){R=q;q++}if(R===te)X=J,J++;else break}for(let q=g;q<=X;q++)for(let pe=G;pe<=te;pe++)W||M(q,pe,b,0),V||M(q,pe,b,1);let z,K;!W&&!V?(z=0,K=12):W?(z=6,K=12):(z=0,K=6);const Q=X+1-g,_e=te+1-G,xe=F?d:l;let ae=F?m:h;for(let q=z;q<K;q++){const pe=T[q*3],ge=T[q*3+1],Ue=T[q*3+2];xe[ae++]=g+.5*(Q-1)+.5+pe*Q,xe[ae++]=G+.5*(_e-1)+.5+ge*_e,xe[ae++]=b+.5+Ue,xe[ae++]=q<6?0:1,xe[ae++]=k}F?m=ae:h=ae}if(!Z||!se){let X=b,J=b,R=0;for(;J<n&&A(g,G,J)===k;){let q=G;for(;q<=te&&A(g,q,J)===k;){R=q;q++}if(R===te)X=J,J++;else break}for(let q=b;q<=X;q++)for(let pe=G;pe<=te;pe++)Z||M(g,pe,q,2),se||M(g,pe,q,3);let z,K;!Z&&!se?(z=12,K=24):Z?(z=18,K=24):(z=12,K=18);const Q=X+1-b,_e=te+1-G,xe=F?d:l;let ae=F?m:h;for(let q=z;q<K;q++){const pe=T[q*3],ge=T[q*3+1],Ue=T[q*3+2];xe[ae++]=g+.5+pe,xe[ae++]=G+.5*(_e-1)+.5+ge*_e,xe[ae++]=b+.5*(Q-1)+.5+Ue*Q,xe[ae++]=q<18?2:3,xe[ae++]=k}F?m=ae:h=ae}if(!fe||!re){let X=g,J=g;for(;J<e&&A(J,G,b)===k;){X=J;J++}let R=b,z=b,K=0;for(;z<n&&A(g,G,z)===k;){let ge=g;for(;ge<=X&&A(ge,G,z)===k;){K=ge;ge++}if(K===X)R=z,z++;else break}for(let ge=g;ge<=X;ge++)for(let Ue=b;Ue<=R;Ue++)fe||M(ge,G,Ue,4),re||M(ge,G,Ue,5);let Q,_e;!fe&&!re?(Q=24,_e=36):fe?(Q=30,_e=36):(Q=24,_e=30);const xe=X+1-g,ae=R+1-b,q=F?d:l;let pe=F?m:h;for(let ge=Q;ge<_e;ge++){const Ue=T[ge*3],pt=T[ge*3+1],ht=T[ge*3+2];q[pe++]=g+.5*(xe-1)+.5+Ue*xe,q[pe++]=G+.5+pt,q[pe++]=b+.5*(ae-1)+.5+ht*ae,q[pe++]=ge<30?4:5,q[pe++]=k}F?m=pe:h=pe}}let v=null,C=0;if(y){v=new Float32Array(w.length*6*6*3);let g=0;for(const G of w){const{x:b,y:k,z:U}=G,F=b+1,W=k+1,V=U+1,Z=S[F+(W+1)*x+V*P];ue(Z)||(v[g++]=b,v[g++]=k+1,v[g++]=U,v[g++]=b+1,v[g++]=k+1,v[g++]=U,v[g++]=b+1,v[g++]=k+1,v[g++]=U+1,v[g++]=b,v[g++]=k+1,v[g++]=U,v[g++]=b,v[g++]=k+1,v[g++]=U+1,v[g++]=b+1,v[g++]=k+1,v[g++]=U+1);const se=S[F+W*x+(V+1)*P],fe=U===n-1;!ue(se)&&!(fe&&se===N.NONE)&&(v[g++]=b,v[g++]=k,v[g++]=U+1,v[g++]=b+1,v[g++]=k,v[g++]=U+1,v[g++]=b+1,v[g++]=k+1,v[g++]=U+1,v[g++]=b,v[g++]=k,v[g++]=U+1,v[g++]=b,v[g++]=k+1,v[g++]=U+1,v[g++]=b+1,v[g++]=k+1,v[g++]=U+1);const re=S[F+W*x+(V-1)*P],te=U===0;!ue(re)&&!(te&&re===N.NONE)&&(v[g++]=b+1,v[g++]=k,v[g++]=U,v[g++]=b,v[g++]=k,v[g++]=U,v[g++]=b,v[g++]=k+1,v[g++]=U,v[g++]=b+1,v[g++]=k,v[g++]=U,v[g++]=b+1,v[g++]=k+1,v[g++]=U,v[g++]=b,v[g++]=k+1,v[g++]=U);const X=S[F+1+W*x+V*P],J=b===e-1;!ue(X)&&!(J&&X===N.NONE)&&(v[g++]=b+1,v[g++]=k,v[g++]=U,v[g++]=b+1,v[g++]=k+1,v[g++]=U,v[g++]=b+1,v[g++]=k+1,v[g++]=U+1,v[g++]=b+1,v[g++]=k,v[g++]=U,v[g++]=b+1,v[g++]=k,v[g++]=U+1,v[g++]=b+1,v[g++]=k+1,v[g++]=U+1);const R=S[F-1+W*x+V*P],z=b===0;!ue(R)&&!(z&&R===N.NONE)&&(v[g++]=b,v[g++]=k,v[g++]=U+1,v[g++]=b,v[g++]=k+1,v[g++]=U+1,v[g++]=b,v[g++]=k+1,v[g++]=U,v[g++]=b,v[g++]=k,v[g++]=U+1,v[g++]=b,v[g++]=k,v[g++]=U,v[g++]=b,v[g++]=k+1,v[g++]=U);const K=S[F+(W-1)*x+V*P];ue(K)||(v[g++]=b,v[g++]=k,v[g++]=U+1,v[g++]=b+1,v[g++]=k,v[g++]=U+1,v[g++]=b+1,v[g++]=k,v[g++]=U,v[g++]=b,v[g++]=k,v[g++]=U+1,v[g++]=b,v[g++]=k,v[g++]=U,v[g++]=b+1,v[g++]=k,v[g++]=U)}C=g/3,v=v.subarray(0,g)}return{opaque:l.subarray(0,h),opaqueCount:h/o,transparent:d.subarray(0,m),transparentCount:m/o,water:v||new Float32Array(0),waterCount:C,prop:p.subarray(0,_),propCount:_/o}}generateBlocks(r,e){const t=Y.CHUNK_WIDTH,n=Y.CHUNK_HEIGHT,o=Y.CHUNK_DEPTH,i=new Float64Array(t*o),a=new Float64Array(t*o),s=new Float32Array(t*o),l=new Uint8Array(t*o),d=new Uint8Array(t*o),p=new Float32Array(t*o);for(let f=0;f<o;f++)for(let h=0;h<t;h++){const m=h+this.globalPosition.x,_=f+this.globalPosition.z,y=h+f*t,w=Ce(m/512,-5,_/512,0,0,0,r+31337),x=Ce(m/2048,10,_/2048,0,0,0,r);i[y]=Math.abs(Ce(m/1024,0,_/1024,0,0,0,r)*450)*Math.max(.1,(x+1)*.5),a[y]=zo(m/256,15,_/256,2,.6,1.2,6)*12,s[y]=e?e(m,_):0;const B=ys(w);l[y]=B.biome1,d[y]=B.biome2,p[y]=B.blend}for(let f=0;f<o;f++)for(let h=0;h<n;h++)for(let m=0;m<t;m++){if(this.getBlock(m,h,f)!==N.NONE)continue;const _=m+f*t,y=m+this.globalPosition.x,w=h+this.globalPosition.y,x=f+this.globalPosition.z,B=Math.abs(Ce(y/256,w/512,x/256,0,0,0,r)*i[_])+a[_]+s[_];w<B?Y._isCave(y,w,x,r,B-w)?w<Y.SEA_LEVEL+1?this.setBlock(m,h,f,N.WATER):this.setBlock(m,h,f,N.NONE):this.setBlock(m,h,f,this._generateBlockBasedOnBiome(l[_],d[_],p[_],y,w,x,B)):w<Y.SEA_LEVEL+1&&this.setBlock(m,h,f,N.WATER)}for(let f=0;f<Y.CHUNK_DEPTH;f++)for(let h=0;h<Y.CHUNK_HEIGHT;h++)for(let m=0;m<Y.CHUNK_WIDTH;m++){if(this.getBlock(m,h,f)===N.NONE)continue;const _=m+this.globalPosition.x,y=h+this.globalPosition.y,w=f+this.globalPosition.z;this._generateAdditionalBlocks(m,h,f,_,y,w,r)}}setBlock(r,e,t,n){if(r<0||r>=Y.CHUNK_WIDTH||e<0||e>=Y.CHUNK_HEIGHT||t<0||t>=Y.CHUNK_DEPTH)return;const o=r+e*Y.CHUNK_WIDTH+t*Y.CHUNK_WIDTH*Y.CHUNK_HEIGHT,i=this.blocks[o];i!==N.NONE&&(this.aliveBlocks--,ue(i)?this.waterBlocks--:it(i)?this.transparentBlocks--:this.opaqueBlocks--,Nr(i)&&this.lightBlocks--),this.blocks[o]=n,n!==N.NONE&&(this.aliveBlocks++,ue(n)?this.waterBlocks++:it(n)?this.transparentBlocks++:this.opaqueBlocks++,Nr(n)&&this.lightBlocks++)}getBlock(r,e,t){if(r<0||r>=Y.CHUNK_WIDTH||e<0||e>=Y.CHUNK_HEIGHT||t<0||t>=Y.CHUNK_DEPTH)return N.NONE;const n=r+e*Y.CHUNK_WIDTH+t*Y.CHUNK_WIDTH*Y.CHUNK_HEIGHT;return this.blocks[n]}getBlockIndex(r,e,t){return r<0||r>=Y.CHUNK_WIDTH||e<0||e>=Y.CHUNK_HEIGHT||t<0||t>=Y.CHUNK_DEPTH?-1:r+e*Y.CHUNK_WIDTH+t*Y.CHUNK_WIDTH*Y.CHUNK_HEIGHT}_generateAdditionalBlocks(r,e,t,n,o,i,a){const s=this.getBlock(r,e,t),l=this.getBlock(r-1,e,t),d=this.getBlock(r+1,e,t),p=this.getBlock(r,e,t+1),f=this.getBlock(r,e,t-1),h=this.getBlock(r,e+1,t);if(s==N.SAND)if(o>0&&Ee.global.randomUint32()%512==0){const m=Ee.global.randomUint32()%5;for(let _=0;_<m;_++)this.setBlock(r,e+_,t,N.CACTUS)}else Ee.global.randomUint32()%128==0&&this.setBlock(r,e+1,t,N.DEAD_BUSH);else if(s==N.SNOW||s==N.GRASS_SNOW){if(Ee.global.randomUint32()%16==0&&o>12&&(h==N.NONE||ue(h))&&(l==N.NONE||f==N.NONE))this.setBlock(r,e+1,t,N.DEAD_BUSH);else if(Ee.global.randomUint32()%16==0&&o>12&&o<300&&e<Y.CHUNK_HEIGHT-5&&r>2&&t>2&&r<Y.CHUNK_WIDTH-2&&t<Y.CHUNK_DEPTH-2&&h==N.NONE&&d==N.NONE&&p==N.NONE&&f==N.NONE){const _=Math.max(Ee.global.randomUint32()%5,5);for(let y=0;y<_;y++)this.setBlock(r,e+y,t,N.TRUNK);for(let y=-2;y<=2;y++){const w=y<-1||y>1?0:-1,x=y<-1||y>1?0:1;for(let B=-1+w;B<=1+x;B++){const P=Math.abs(B-r);for(let S=-1+w;S<=1+x;S++){const M=Math.abs(S-t),L=B*B+y*y+S*S,A=this.getBlock(r+B,e+_+y,t+S);L+2<Ee.global.randomUint32()%24&&P!=2-w&&P!=2+x&&M!=2-w&&M!=2+x&&(A==N.NONE||A==N.SNOWYLEAVES)&&this.setBlock(r+B,e+_+y,t+S,N.SNOWYLEAVES)}}}}}else if(s==N.GRASS||s==N.DIRT)if(Ee.global.randomUint32()%2==0&&o>5&&o<300&&e<Y.CHUNK_HEIGHT-5&&r>2&&t>2&&r<Y.CHUNK_WIDTH-2&&t<Y.CHUNK_DEPTH-2&&h==N.NONE&&d==N.NONE&&p==N.NONE&&f==N.NONE){const _=Math.max(Ee.global.randomUint32()%5,5);for(let y=0;y<_;y++)this.setBlock(r,e+y,t,N.TRUNK);for(let y=-2;y<=2;y++){const w=y<-1||y>1?0:-1,x=y<-1||y>1?0:1;for(let B=-1+w;B<=1+x;B++){const P=Math.abs(B-r);for(let S=-1+w;S<=1+x;S++){const M=Math.abs(S-t),L=B*B+y*y+S*S,A=this.getBlock(r+B,e+_+y,t+S);L+2<Ee.global.randomUint32()%24&&P!=2-w&&P!=2+x&&M!=2-w&&M!=2+x&&(A==N.NONE||A==N.TREELEAVES)&&this.setBlock(r+B,e+_+y,t+S,N.TREELEAVES)}}}}else o>5&&h==N.NONE&&(l==N.NONE||f==N.NONE)&&(Ee.global.randomUint32()%8==0?this.setBlock(r,e+1,t,N.GRASS_PROP):Ee.global.randomUint32()%8==0&&this.setBlock(r,e+1,t,N.FLOWER))}_generateBlockBasedOnBiome(r,e,t,n,o,i,a){const s=t>0&&r!==e&&ws(n,i)<t?e:r,l=Math.floor(a)-o,d=a<Y.SEA_LEVEL+1;switch(s){case Ae.GrassyPlains:return l===0?d?N.DIRT:N.GRASS:l<=3?N.DIRT:N.STONE;case Ae.Desert:return l<=3?N.SAND:N.STONE;case Ae.SnowyPlains:return l===0?N.GRASS_SNOW:l<=2?N.SNOW:N.STONE;case Ae.SnowyMountains:{const p=Math.abs(Lr(n/256,o/256,i/256,2,.6,1))*35;return l===0?N.GRASS_SNOW:l<=4||p>20?N.SNOW:N.STONE}case Ae.RockyMountains:return l===0&&Math.abs(Lr(n/64,o/64,i/64,2,.6,1))<.12?N.SNOW:N.STONE;default:return N.GRASS}}static _determineBiomeFromNoise(r){return r>.35?Ae.Desert:r>-.15?Ae.GrassyPlains:r>-.3?Ae.SnowyPlains:r>-.5?Ae.SnowyMountains:Ae.RockyMountains}static _determineBiome(r,e,t,n){const o=Ce(r/512,-5,t/512,0,0,0,n+31337);return Y._determineBiomeFromNoise(o)}static _isCave(r,e,t,n,o){if(o<3)return!1;if(Ce(r/60,e/60,t/60,0,0,0,n+777)>.6)return!0;const a=Ce(r/24,e/24,t/24,0,0,0,n+13579),s=Ce(r/24,e/14,t/24,0,0,0,n+24680);if(Math.abs(a)<.12&&Math.abs(s)<.12)return!0;const l=Ce(r/28,e/18,t/28,0,0,0,n+55555),d=Ce(r/28,e/28,t/28,0,0,0,n+99999);return Math.abs(l)<.1&&Math.abs(d)<.1}};c(Y,"CHUNK_WIDTH",16),c(Y,"CHUNK_HEIGHT",16),c(Y,"CHUNK_DEPTH",16),c(Y,"SEA_LEVEL",15),c(Y,"CUBE_VERTS",new Float32Array([-.5,-.5,-.5,.5,.5,-.5,.5,-.5,-.5,.5,.5,-.5,-.5,-.5,-.5,-.5,.5,-.5,-.5,-.5,.5,.5,-.5,.5,.5,.5,.5,.5,.5,.5,-.5,.5,.5,-.5,-.5,.5,-.5,.5,.5,-.5,.5,-.5,-.5,-.5,-.5,-.5,-.5,-.5,-.5,-.5,.5,-.5,.5,.5,.5,.5,.5,.5,-.5,-.5,.5,.5,-.5,.5,-.5,-.5,.5,.5,.5,.5,-.5,.5,-.5,-.5,-.5,.5,-.5,-.5,.5,-.5,.5,.5,-.5,.5,-.5,-.5,.5,-.5,-.5,-.5,-.5,.5,-.5,.5,.5,.5,.5,.5,-.5,.5,.5,.5,-.5,.5,-.5,-.5,.5,.5]));let ee=Y;const Zo=128;function Bs(u,r,e){const t=Ce(u/2048,10,r/2048,0,0,0,e),n=Math.abs(Ce(u/1024,0,r/1024,0,0,0,e)*450)*Math.max(.1,(t+1)*.5),o=zo(u/256,15,r/256,2,.6,1.2,6)*12;return Math.abs(Ce(u/256,0,r/256,0,0,0,e)*n)+o}function _o(u,r,e,t){const n=e|0,o=t|0,i=e-n,a=t-o,s=u[n+o*r],l=u[n+1+o*r],d=u[n+(o+1)*r],p=u[n+1+(o+1)*r];return[(l-s)*(1-a)+(p-d)*a,(d-s)*(1-i)+(p-l)*i,s*(1-i)*(1-a)+l*i*(1-a)+d*(1-i)*a+p*i*a]}function go(u){return Math.imul(u,1664525)+1013904223>>>0}function Ss(u,r,e){const t=r*r>>2,n=.05,o=4,i=.01,a=.4,s=.3,l=.01,d=4,p=20,f=2,h=f*2+1,m=new Float32Array(h*h);let _=0;for(let x=-f;x<=f;x++)for(let B=-f;B<=f;B++){const P=Math.sqrt(B*B+x*x);if(P<f){const S=1-P/f;m[B+f+(x+f)*h]=S,_+=S}}for(let x=0;x<m.length;x++)m[x]/=_;const y=r-2;let w=(e^3735928559)>>>0;for(let x=0;x<t;x++){w=go(w);let B=w/4294967295*y;w=go(w);let P=w/4294967295*y,S=0,M=0,L=1,A=1,O=0;for(let T=0;T<p;T++){const v=B|0,C=P|0;if(v<0||v>=y||C<0||C>=y)break;const g=B-v,G=P-C,[b,k,U]=_o(u,r,B,P);S=S*n-b*(1-n),M=M*n-k*(1-n);const F=Math.sqrt(S*S+M*M);if(F<1e-6)break;S/=F,M/=F;const W=B+S,V=P+M;if(W<0||W>=y||V<0||V>=y)break;const[,,Z]=_o(u,r,W,V),se=Z-U,fe=Math.max(-se*L*A*o,i);if(O>fe||se>0){const re=se>0?Math.min(se,O):(O-fe)*s;O-=re,u[v+C*r]+=re*(1-g)*(1-G),u[v+1+C*r]+=re*g*(1-G),u[v+(C+1)*r]+=re*(1-g)*G,u[v+1+(C+1)*r]+=re*g*G}else{const re=Math.min((fe-O)*a,-se);for(let te=-f;te<=f;te++)for(let X=-f;X<=f;X++){const J=v+X,R=C+te;J<0||J>=r||R<0||R>=r||(u[J+R*r]-=m[X+f+(te+f)*h]*re)}O+=re}L=Math.sqrt(Math.max(L*L+se*d,0)),A*=1-l,B=W,P=V}}}function Ps(u,r,e){const t=Zo,n=u*t,o=r*t,i=new Float32Array(t*t);for(let p=0;p<t;p++)for(let f=0;f<t;f++)i[f+p*t]=Bs(n+f,o+p,e);const a=new Float32Array(i),s=(e^(Math.imul(u,73856093)^Math.imul(r,19349663)))>>>0;Ss(a,t,s);const l=12,d=new Float32Array(t*t);for(let p=0;p<t;p++)for(let f=0;f<t;f++){const h=f+p*t,m=Math.min(f,t-1-f,p,t-1-p),_=Math.min(m/l,1);d[h]=(a[h]-i[h])*_}return d}const j=class j{constructor(r){c(this,"seed");c(this,"renderDistanceH",8);c(this,"renderDistanceV",4);c(this,"chunksPerFrame",2);c(this,"time",0);c(this,"waterSimulationRadius",32);c(this,"waterTickInterval",.25);c(this,"_waterTickTimer",0);c(this,"_dirtyChunks",null);c(this,"onChunkAdded");c(this,"onChunkUpdated");c(this,"onChunkRemoved");c(this,"_chunks",new Map);c(this,"_generated",new Set);c(this,"_erosionCache",new Map);c(this,"pendingChunks",0);c(this,"_neighborScratch",{negX:void 0,posX:void 0,negY:void 0,posY:void 0,negZ:void 0,posZ:void 0});c(this,"_scratchTopD2",null);c(this,"_scratchTopXYZ",null);c(this,"_scratchToDelete",[]);c(this,"_scratchWaterBlocks",[]);c(this,"_scratchDirtyChunks",new Set);this.seed=r}get chunkCount(){return this._chunks.size}get chunks(){return this._chunks.values()}getBiomeAt(r,e,t){return ee._determineBiome(r,e,t,this.seed)}static normalizeChunkPosition(r,e,t){return[Math.floor(r/ee.CHUNK_WIDTH),Math.floor(e/ee.CHUNK_HEIGHT),Math.floor(t/ee.CHUNK_DEPTH)]}static _cx(r){return Math.floor(r/ee.CHUNK_WIDTH)}static _cy(r){return Math.floor(r/ee.CHUNK_HEIGHT)}static _cz(r){return Math.floor(r/ee.CHUNK_DEPTH)}static _key(r,e,t){return(r+32768)*4294967296+(e+32768)*65536+(t+32768)}getChunk(r,e,t){return this._chunks.get(j._key(j._cx(r),j._cy(e),j._cz(t)))}chunkExists(r,e,t){return this.getChunk(r,e,t)!==void 0}getBlockType(r,e,t){const n=this.getChunk(r,e,t);if(!n)return N.NONE;const o=Math.round(r)-n.globalPosition.x,i=Math.round(e)-n.globalPosition.y,a=Math.round(t)-n.globalPosition.z;return n.getBlock(o,i,a)}setBlockType(r,e,t,n){let o=this.getChunk(r,e,t);if(!o){const l=j._cx(r),d=j._cy(e),p=j._cz(t);o=new ee(l*ee.CHUNK_WIDTH,d*ee.CHUNK_HEIGHT,p*ee.CHUNK_DEPTH),this._insertChunk(o)}const i=Math.round(r)-o.globalPosition.x,a=Math.round(e)-o.globalPosition.y,s=Math.round(t)-o.globalPosition.z;return o.setBlock(i,a,s,n),this._updateChunk(o,i,a,s),!0}getTopBlockY(r,e,t){const n=ee.CHUNK_HEIGHT,o=Math.floor(r),i=Math.floor(e);for(let a=Math.floor(t/n);a>=0;a--){const s=this.getChunk(o,a*n,i);if(!s)continue;const l=o-s.globalPosition.x,d=i-s.globalPosition.z;for(let p=n-1;p>=0;p--){const f=s.getBlock(l,p,d);if(f!==N.NONE&&!Me(f))return s.globalPosition.y+p+1}}return 0}getBlockByRay(r,e,t){const n=Number.MAX_VALUE;let o=Math.floor(r.x),i=Math.floor(r.y),a=Math.floor(r.z);const s=1/e.x,l=1/e.y,d=1/e.z,p=e.x>0?1:-1,f=e.y>0?1:-1,h=e.z>0?1:-1,m=Math.min(s*p,n),_=Math.min(l*f,n),y=Math.min(d*h,n);let w=Math.abs((o+Math.max(p,0)-r.x)*s),x=Math.abs((i+Math.max(f,0)-r.y)*l),B=Math.abs((a+Math.max(h,0)-r.z)*d),P=0,S=0,M=0;for(let L=0;L<t;L++){if(L>0){const A=this.getChunk(o,i,a);if(A){const O=o-A.globalPosition.x,T=i-A.globalPosition.y,v=a-A.globalPosition.z,C=A.getBlock(O,T,v);if(C!==N.NONE&&!ue(C))return{blockType:C,position:new D(o,i,a),face:new D(-P*p,-S*f,-M*h),chunk:A,relativePosition:new D(O,T,v)}}}P=(w<=B?1:0)*(w<=x?1:0),S=(x<=w?1:0)*(x<=B?1:0),M=(B<=x?1:0)*(B<=w?1:0),w+=m*P,x+=_*S,B+=y*M,o+=p*P,i+=f*S,a+=h*M}return null}addBlock(r,e,t,n,o,i,a){if(a===N.NONE||!this.getChunk(r,e,t))return!1;const l=this.getBlockType(r,e,t);if(Me(l))return!1;const d=r+n,p=e+o,f=t+i,h=this.getBlockType(d,p,f);if(ue(a)){if(h!==N.NONE&&!ue(h))return!1}else if(h!==N.NONE&&!ue(h))return!1;let m=this.getChunk(d,p,f);if(!m){const x=j._cx(d),B=j._cy(p),P=j._cz(f);m=new ee(x*ee.CHUNK_WIDTH,B*ee.CHUNK_HEIGHT,P*ee.CHUNK_DEPTH),this._insertChunk(m)}const _=d-m.globalPosition.x,y=p-m.globalPosition.y,w=f-m.globalPosition.z;return m.setBlock(_,y,w,a),this._updateChunk(m,_,y,w),!0}mineBlock(r,e,t){const n=this.getChunk(r,e,t);if(!n)return!1;const o=r-n.globalPosition.x,i=e-n.globalPosition.y,a=t-n.globalPosition.z,s=n.getBlock(o,i,a);return s===N.NONE?!1:ue(s)?(n.setBlock(o,i,a,N.NONE),this._updateChunk(n,o,i,a),!0):(n.setBlock(o,i,a,N.NONE),this._updateChunk(n,o,i,a),!0)}update(r,e){this.time+=e,this._removeDistantChunks(r),this._createNearbyChunks(r),this._waterTickTimer+=e,this._waterTickTimer>=this.waterTickInterval&&(this._waterTickTimer=0,this._updateWaterFlow(r))}deleteChunk(r){var i;const e=j._cx(r.globalPosition.x),t=j._cy(r.globalPosition.y),n=j._cz(r.globalPosition.z),o=j._key(e,t,n);this._chunks.delete(o),this._generated.delete(o),r.isDeleted=!0,(i=this.onChunkRemoved)==null||i.call(this,r)}calcWaterLevel(r,e,t){const n=this.getChunk(r,e,t);if(!n||n.waterBlocks<=0)return 0;let o=this._calcWaterLevelInChunk(n,e);for(let i=1;i<=4;i++){const a=this.getChunk(r,e+i*ee.CHUNK_HEIGHT,t);if(!a)break;const s=j._cx(r),l=j._cz(t),d=s*ee.CHUNK_WIDTH-a.globalPosition.x,p=l*ee.CHUNK_DEPTH-a.globalPosition.z;if(a.waterBlocks>0&&ue(a.getBlock(d,0,p)))o+=this._calcWaterLevelInChunk(a,e);else break}return o}_calcWaterLevelInChunk(r,e){const t=r.globalPosition.y,n=ee.CHUNK_HEIGHT;let o=0;return e<=t+n*.8&&o++,e<=t+n*.7&&o++,e<=t+n*.6&&o++,e<=t+n*.5&&o++,o}_getErosionRegion(r,e){const t=`${r},${e}`;let n=this._erosionCache.get(t);return n||(n=Ps(r,e,this.seed),this._erosionCache.set(t,n)),n}getErosionDisplacement(r,e){const t=Zo,n=Math.floor(r/t),o=Math.floor(e/t),i=(r%t+t)%t,a=(e%t+t)%t;return this._getErosionRegion(n,o)[i+a*t]}_insertChunk(r){const e=j._cx(r.globalPosition.x),t=j._cy(r.globalPosition.y),n=j._cz(r.globalPosition.z);this._chunks.set(j._key(e,t,n),r),r.isDeleted=!1}_gatherNeighbors(r,e,t){var o,i,a,s,l,d;const n=this._neighborScratch;return n.negX=(o=this._chunks.get(j._key(r-1,e,t)))==null?void 0:o.blocks,n.posX=(i=this._chunks.get(j._key(r+1,e,t)))==null?void 0:i.blocks,n.negY=(a=this._chunks.get(j._key(r,e-1,t)))==null?void 0:a.blocks,n.posY=(s=this._chunks.get(j._key(r,e+1,t)))==null?void 0:s.blocks,n.negZ=(l=this._chunks.get(j._key(r,e,t-1)))==null?void 0:l.blocks,n.posZ=(d=this._chunks.get(j._key(r,e,t+1)))==null?void 0:d.blocks,n}_remeshSingleNeighbor(r,e,t){var o;const n=this._chunks.get(j._key(r,e,t));n&&((o=this.onChunkUpdated)==null||o.call(this,n,n.generateVertices(this._gatherNeighbors(r,e,t))))}_updateChunk(r,e,t,n){var p;const o=j._cx(r.globalPosition.x),i=j._cy(r.globalPosition.y),a=j._cz(r.globalPosition.z);if(this._dirtyChunks){if(this._dirtyChunks.add(r),e===void 0)return;const f=ee.CHUNK_WIDTH,h=ee.CHUNK_HEIGHT,m=ee.CHUNK_DEPTH,_=(y,w,x)=>{const B=this._chunks.get(j._key(y,w,x));B&&this._dirtyChunks.add(B)};e===0&&_(o-1,i,a),e===f-1&&_(o+1,i,a),t===0&&_(o,i-1,a),t===h-1&&_(o,i+1,a),n===0&&_(o,i,a-1),n===m-1&&_(o,i,a+1);return}if((p=this.onChunkUpdated)==null||p.call(this,r,r.generateVertices(this._gatherNeighbors(o,i,a))),e===void 0)return;const s=ee.CHUNK_WIDTH,l=ee.CHUNK_HEIGHT,d=ee.CHUNK_DEPTH;e===0&&this._remeshSingleNeighbor(o-1,i,a),e===s-1&&this._remeshSingleNeighbor(o+1,i,a),t===0&&this._remeshSingleNeighbor(o,i-1,a),t===l-1&&this._remeshSingleNeighbor(o,i+1,a),n===0&&this._remeshSingleNeighbor(o,i,a-1),n===d-1&&this._remeshSingleNeighbor(o,i,a+1)}_createNearbyChunks(r){const e=j._cx(r.x),t=j._cy(r.y),n=j._cz(r.z),o=this.renderDistanceH,i=this.renderDistanceV,a=o*o,s=Math.max(1,this.chunksPerFrame);(!this._scratchTopD2||this._scratchTopD2.length!==s)&&(this._scratchTopD2=new Float64Array(s),this._scratchTopXYZ=new Int32Array(s*3));for(let f=0;f<s;f++)this._scratchTopD2[f]=1/0;let l=0,d=0,p=1/0;for(let f=-o;f<=o;f++){const h=f*f;for(let m=-o;m<=o;m++){const _=h+m*m;if(!(_>a))for(let y=-i;y<=i;y++){const w=e+f,x=t+y,B=n+m;if(this._generated.has(j._key(w,x,B)))continue;l++;const P=_+y*y;if(!(P>=p)){this._scratchTopD2[d]=P,this._scratchTopXYZ[d*3]=w,this._scratchTopXYZ[d*3+1]=x,this._scratchTopXYZ[d*3+2]=B,p=-1/0;for(let S=0;S<s;S++){const M=this._scratchTopD2[S];M>p&&(p=M,d=S)}}}}}if(this.pendingChunks=l,!(this._chunks.size>=j.MAX_CHUNKS))for(let f=0;f<s;f++){let h=-1,m=1/0;for(let x=0;x<s;x++){const B=this._scratchTopD2[x];B<m&&(m=B,h=x)}if(h<0||m===1/0||this._chunks.size>=j.MAX_CHUNKS)break;const _=this._scratchTopXYZ[h*3],y=this._scratchTopXYZ[h*3+1],w=this._scratchTopXYZ[h*3+2];this._scratchTopD2[h]=1/0,this._createChunkAt(_,y,w)}}_removeDistantChunks(r){const e=j._cx(r.x),t=j._cy(r.y),n=j._cz(r.z),o=this.renderDistanceH+1,i=this.renderDistanceV+1,a=this._scratchToDelete;a.length=0;for(const s of this._chunks.values()){const l=j._cx(s.globalPosition.x),d=j._cy(s.globalPosition.y),p=j._cz(s.globalPosition.z),f=l-e,h=d-t,m=p-n;(f*f+m*m>o*o||Math.abs(h)>i)&&a.push(s)}for(let s=0;s<a.length;s++)this.deleteChunk(a[s]);a.length=0}_createChunkAt(r,e,t){var i;const n=j._key(r,e,t);this._generated.add(n);const o=new ee(r*ee.CHUNK_WIDTH,e*ee.CHUNK_HEIGHT,t*ee.CHUNK_DEPTH);o.generateBlocks(this.seed,(a,s)=>this.getErosionDisplacement(a,s)),o.aliveBlocks>0&&(this._insertChunk(o),(i=this.onChunkAdded)==null||i.call(this,o,o.generateVertices(this._gatherNeighbors(r,e,t))),this._remeshSingleNeighbor(r-1,e,t),this._remeshSingleNeighbor(r+1,e,t),this._remeshSingleNeighbor(r,e-1,t),this._remeshSingleNeighbor(r,e+1,t),this._remeshSingleNeighbor(r,e,t-1),this._remeshSingleNeighbor(r,e,t+1))}_updateWaterFlow(r){var P;const e=this.waterSimulationRadius,t=Math.floor(r.x-e),n=Math.floor(r.x+e),o=Math.floor(Math.max(0,r.y-e)),i=Math.floor(r.y+e),a=Math.floor(r.z-e),s=Math.floor(r.z+e),l=ee.CHUNK_WIDTH,d=ee.CHUNK_HEIGHT,p=ee.CHUNK_DEPTH,f=Math.floor(t/l),h=Math.floor(n/l),m=Math.floor(o/d),_=Math.floor(i/d),y=Math.floor(a/p),w=Math.floor(s/p),x=this._scratchWaterBlocks;x.length=0;for(let S=f;S<=h;S++)for(let M=m;M<=_;M++)for(let L=y;L<=w;L++){const A=this._chunks.get(j._key(S,M,L));if(!A||A.waterBlocks===0)continue;const O=A.globalPosition.x,T=A.globalPosition.y,v=A.globalPosition.z,C=Math.max(0,t-O),g=Math.min(l-1,n-O),G=Math.max(0,o-T),b=Math.min(d-1,i-T),k=Math.max(0,a-v),U=Math.min(p-1,s-v);for(let F=k;F<=U;F++)for(let W=G;W<=b;W++)for(let V=C;V<=g;V++)ue(A.getBlock(V,W,F))&&x.push(O+V,T+W,v+F)}const B=this._scratchDirtyChunks;B.clear(),this._dirtyChunks=B;try{for(let S=0;S<x.length;S+=3)this._flowWater(x[S],x[S+1],x[S+2])}finally{this._dirtyChunks=null}for(const S of B){const M=j._cx(S.globalPosition.x),L=j._cy(S.globalPosition.y),A=j._cz(S.globalPosition.z);(P=this.onChunkUpdated)==null||P.call(this,S,S.generateVertices(this._gatherNeighbors(M,L,A)))}B.clear(),x.length=0}_flowWater(r,e,t){const n=this.getBlockType(r,e-1,t);if(n===N.NONE||Me(n)){this.setBlockType(r,e-1,t,N.WATER),this.setBlockType(r,e,t,N.NONE);return}let o=!1;for(let i=1;i<=4;i++){const a=this.getBlockType(r,e-i,t);if(a!==N.NONE&&!ue(a)&&!Me(a)){o=!0;break}if(a===N.NONE||Me(a))break}if(!o){const i=[{x:r+1,y:e,z:t},{x:r-1,y:e,z:t},{x:r,y:e,z:t+1},{x:r,y:e,z:t-1}];for(const a of i){const s=this.getBlockType(a.x,a.y,a.z);if(s===N.NONE||Me(s)){this.setBlockType(a.x,a.y,a.z,N.WATER),this.setBlockType(r,e,t,N.NONE);return}}}if(o){const i=[{x:r+1,y:e,z:t},{x:r-1,y:e,z:t},{x:r,y:e,z:t+1},{x:r,y:e,z:t-1}];for(const a of i){const s=this.getBlockType(a.x,a.y,a.z);if(s===N.NONE||Me(s)){this.setBlockType(a.x,a.y,a.z,N.WATER);return}}}}};c(j,"MAX_CHUNKS",2048);let En=j;function Qt(u,r,e,t,n,o,i,a){const s=[{n:[0,0,-1],t:[-1,0,0,1],v:[[-o,-i,-a],[o,-i,-a],[o,i,-a],[-o,i,-a]]},{n:[0,0,1],t:[1,0,0,1],v:[[o,-i,a],[-o,-i,a],[-o,i,a],[o,i,a]]},{n:[-1,0,0],t:[0,0,-1,1],v:[[-o,-i,a],[-o,-i,-a],[-o,i,-a],[-o,i,a]]},{n:[1,0,0],t:[0,0,1,1],v:[[o,-i,-a],[o,-i,a],[o,i,a],[o,i,-a]]},{n:[0,1,0],t:[1,0,0,1],v:[[-o,i,-a],[o,i,-a],[o,i,a],[-o,i,a]]},{n:[0,-1,0],t:[1,0,0,1],v:[[-o,-i,a],[o,-i,a],[o,-i,-a],[-o,-i,-a]]}],l=[[0,1],[1,1],[1,0],[0,0]];for(const d of s){const p=u.length/12;for(let f=0;f<4;f++){const[h,m,_]=d.v[f];u.push(e+h,t+m,n+_,d.n[0],d.n[1],d.n[2],l[f][0],l[f][1],d.t[0],d.t[1],d.t[2],d.t[3])}r.push(p,p+2,p+1,p,p+3,p+2)}}function vo(u,r=1){const e=[],t=[],n=r;return Qt(e,t,0,0,0,.19*n,.11*n,.225*n),Qt(e,t,0,.07*n,.225*n,.075*n,.06*n,.06*n),ke.fromData(u,new Float32Array(e),new Uint32Array(t))}function bo(u,r=1){const e=[],t=[],n=r;return Qt(e,t,0,0,0,.085*n,.085*n,.075*n),ke.fromData(u,new Float32Array(e),new Uint32Array(t))}function yo(u,r=1){const e=[],t=[],n=r;return Qt(e,t,0,0,0,.065*n,.03*n,.055*n),ke.fromData(u,new Float32Array(e),new Uint32Array(t))}function Xe(u,r,e,t,n,o,i,a){const s=[{n:[0,0,-1],t:[-1,0,0,1],v:[[-o,-i,-a],[o,-i,-a],[o,i,-a],[-o,i,-a]]},{n:[0,0,1],t:[1,0,0,1],v:[[o,-i,a],[-o,-i,a],[-o,i,a],[o,i,a]]},{n:[-1,0,0],t:[0,0,-1,1],v:[[-o,-i,a],[-o,-i,-a],[-o,i,-a],[-o,i,a]]},{n:[1,0,0],t:[0,0,1,1],v:[[o,-i,-a],[o,-i,a],[o,i,a],[o,i,-a]]},{n:[0,1,0],t:[1,0,0,1],v:[[-o,i,-a],[o,i,-a],[o,i,a],[-o,i,a]]},{n:[0,-1,0],t:[1,0,0,1],v:[[-o,-i,a],[o,-i,a],[o,-i,-a],[-o,-i,-a]]}],l=[[0,1],[1,1],[1,0],[0,0]];for(const d of s){const p=u.length/12;for(let f=0;f<4;f++){const[h,m,_]=d.v[f];u.push(e+h,t+m,n+_,d.n[0],d.n[1],d.n[2],l[f][0],l[f][1],d.t[0],d.t[1],d.t[2],d.t[3])}r.push(p,p+2,p+1,p,p+3,p+2)}}function xo(u,r=1){const e=[],t=[],n=r;Xe(e,t,0,0,0,.22*n,.15*n,.32*n),Xe(e,t,0,.07*n,.32*n,.035*n,.035*n,.035*n);const o=.155*n,i=-.25*n,a=.255*n,s=.065*n,l=.1*n,d=.065*n;return Xe(e,t,-o,i,-a,s,l,d),Xe(e,t,o,i,-a,s,l,d),Xe(e,t,-o,i,a,s,l,d),Xe(e,t,o,i,a,s,l,d),ke.fromData(u,new Float32Array(e),new Uint32Array(t))}function wo(u,r=1){const e=[],t=[],n=r;return Xe(e,t,0,0,0,.18*n,.16*n,.16*n),ke.fromData(u,new Float32Array(e),new Uint32Array(t))}function Bo(u,r=1){const e=[],t=[],n=r;return Xe(e,t,0,0,0,.1*n,.08*n,.06*n),ke.fromData(u,new Float32Array(e),new Uint32Array(t))}const Gs=new D(0,1,0),tn=class tn extends Ze{constructor(e){super();c(this,"_world");c(this,"_state","idle");c(this,"_timer",0);c(this,"_targetX",0);c(this,"_targetZ",0);c(this,"_hasTarget",!1);c(this,"_velY",0);c(this,"_yaw",0);c(this,"_headGO",null);c(this,"_headBaseY",0);c(this,"_bobPhase");this._world=e,this._timer=1+Math.random()*4,this._yaw=Math.random()*Math.PI*2,this._bobPhase=Math.random()*Math.PI*2}onAttach(){for(const e of this.gameObject.children)if(e.name==="Duck.Head"){this._headGO=e,this._headBaseY=e.position.y;break}}update(e){const t=this.gameObject,n=t.position.x,o=t.position.z,i=tn.playerPos,a=i.x-n,s=i.z-o,l=a*a+s*s;this._velY-=9.8*e,t.position.y+=this._velY*e;const d=this._world.getTopBlockY(Math.floor(n),Math.floor(o),Math.ceil(t.position.y)+4);if(d>0&&t.position.y<=d+.1){const p=this._world.getBlockType(Math.floor(n),Math.floor(d-1),Math.floor(o));N.WATER,t.position.y=d,this._velY=0}switch(this._state){case"idle":{this._timer-=e,l<36?this._enterFlee():this._timer<=0&&this._pickWanderTarget();break}case"wander":{if(this._timer-=e,l<36){this._enterFlee();break}if(!this._hasTarget||this._timer<=0){this._enterIdle();break}const p=this._targetX-n,f=this._targetZ-o,h=p*p+f*f;if(h<.25){this._enterIdle();break}const m=Math.sqrt(h),_=p/m,y=f/m;t.position.x+=_*1.5*e,t.position.z+=y*1.5*e,this._yaw=Math.atan2(-_,-y);break}case"flee":{if(l>196){this._enterIdle();break}const p=Math.sqrt(l),f=p>0?-a/p:0,h=p>0?-s/p:0;t.position.x+=f*4*e,t.position.z+=h*4*e,this._yaw=Math.atan2(-f,-h);break}}if(t.rotation=de.fromAxisAngle(Gs,this._yaw),this._headGO){this._bobPhase+=e*(this._state==="wander"?6:2);const p=this._state==="wander"?.018:.008;this._headGO.position.y=this._headBaseY+Math.sin(this._bobPhase)*p}}_enterIdle(){this._state="idle",this._hasTarget=!1,this._timer=2+Math.random()*5}_enterFlee(){this._state="flee",this._hasTarget=!1}_pickWanderTarget(){const e=this.gameObject,t=Math.random()*Math.PI*2,n=3+Math.random()*8;this._targetX=e.position.x+Math.cos(t)*n,this._targetZ=e.position.z+Math.sin(t)*n,this._hasTarget=!0,this._state="wander",this._timer=6+Math.random()*6}};c(tn,"playerPos",new D(0,0,0));let ft=tn;const So=""+new URL("hotbar-DkVq2FsR.png",import.meta.url).href,Ht=[N.DIRT,N.IRON,N.STONE,N.SAND,N.TRUNK,N.SPRUCE_PLANKS,N.GLASS,N.TORCH,N.WATER];function Ts(u){const r=Ht.length;let e=0;const t=document.createElement("div");t.style.cssText=["position:fixed","bottom:12px","left:50%","transform:translateX(-50%)","display:flex","flex-direction:row","flex-wrap:nowrap","align-items:center","gap:0px","background:url("+So+") no-repeat","background-position:-48px 0px","background-size:414px 48px","width:364px","height:44px","padding:1px 2px","image-rendering:pixelated","box-sizing:border-box"].join(";");const n=[];for(let d=0;d<r;d++){const p=document.createElement("div");p.style.cssText=["width:40px","height:40px","display:flex","align-items:center","justify-content:center","position:relative","flex-shrink:0"].join(";");const f=document.createElement("canvas");f.width=f.height=32,f.style.cssText="width:32px;height:32px;image-rendering:pixelated;",p.appendChild(f);const h=document.createElement("span");h.textContent=String(d+1),h.style.cssText=["position:absolute","top:1px","left:3px","font-family:ui-monospace,monospace","font-size:9px","color:#ccc","text-shadow:0 0 2px #000","pointer-events:none"].join(";"),p.appendChild(h),t.appendChild(p),n.push(f)}document.body.appendChild(t);const o=document.createElement("div");o.style.cssText=["position:fixed","bottom:12px","width:44px","height:48px","background:url("+So+") no-repeat","background-position:0px 0px","background-size:414px 48px","pointer-events:none","image-rendering:pixelated","transition:left 60ms linear"].join(";"),document.body.appendChild(o);let i=null;function a(){const d=t.getBoundingClientRect();o.style.left=d.left-2+e*40+"px",i==null||i()}const s=new Image;s.src=u;function l(){if(!s.complete)return;const d=16;for(let p=0;p<r;p++){const f=nn.find(m=>m.blockType===Ht[p]),h=n[p].getContext("2d");h.clearRect(0,0,32,32),f&&(h.imageSmoothingEnabled=!1,h.drawImage(s,f.sideFace.x*d,f.sideFace.y*d,d,d,0,0,32,32))}}return s.onload=l,window.addEventListener("keydown",d=>{const p=parseInt(d.key);p>=1&&p<=r&&(e=p-1,a())}),window.addEventListener("wheel",d=>{e=(e+(d.deltaY>0?1:r-1))%r,a()},{passive:!0}),requestAnimationFrame(a),{getSelected:()=>Ht[e],refresh:l,getSelectedSlot:()=>e,setSelectedSlot:d=>{e=d,a()},setOnSelectionChanged:d=>{i=d},slots:Ht,element:t}}const Es="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAACWCAYAAADwkd5lAAAD7ElEQVR4nO3dUU7bahSF0eOqgyIwDU/EkmcBUibicQRm5ftyE7UoacvOb+LEa0l9obD7P/VTKdKpAgAA+C7dX35//pZXALBWFzvxp4DM86wfAFvWdV3VhVZcCoh4AFBVlyNyLiCneLy/vy/7KgBWbbfbVdX5iPy4wXsAeAACAkBEQACICAgAEQEBIPLzK588DMPVf2Df9zVNkx07duxsfqflVqud/X7/z5/7pR/jHYah+r6/5m01jmM9PT3ZsWPHzuZ3pmmqj4+Pent7W83O54D4MV4AmhMQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAANDMfHQ6H3369vr7OLdixY8eOnXW95bjz+e/9o6qaP8fiywelrrW261t27Nixc6udlltLXST800EpFwnt2LFj50Y7LhICsEkCAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgGZOF6hcJLRjx46d5XbW9JbjjouEduzYsXMHOy23XCS0Y8eOnQ3tuEgIwCYJCAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQAJo5XaBykdCOHTt2lttZ01uOOy4S2rFjx84d7LTccpHQjh07dja04yIhAJskIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAGjmdIHKRUI7duzYWW5nTW857rhIaMeOHTt3sNNyy0VCO3bs2NnQjouEAGySgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBAaCZ0wUqFwnt2LFjZ7mdNb3luOMioR07duzcwU7LLRcJ7dixY2dDOy4SArBJAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBIBmTheoXCS0Y8eOneV21vSW485iFwkB2BYHpQBoTkAAiAgIAJGft34AyxmG4eqNvu9rmiY7duKdl5eXq3dYJwF5cH3fX/X14zjWNE127MQ7fhjncfkWFgARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkDEPZAH1vd9jeNox85Nd3hc3ZmPzfM8V1U5BAOwcbvdrqqquq6r+tQM38ICICIgAEQEBIDIuf9E77qumw+HQ+33+29/EADr8vz8XHXm/8wv/Quk+/8LANiwS/G4+MFfzM1fA8A9+VsnAAAAvsF/uG+b8sfhThMAAAAASUVORK5CYII=";function As(u,r,e,t,n,o){const y=[];for(let C=1;C<N.MAX;C++)C!==N.WATER&&y.push(C);const w=document.createElement("div");w.style.cssText="position:relative;display:inline-block;align-self:center;";const x=document.createElement("img");x.src=Es,x.draggable=!1,x.style.cssText=[`width:${400*2}px`,`height:${150*2}px`,"display:block","image-rendering:pixelated","user-select:none"].join(";"),w.appendChild(x);const B=new Image;B.src=r;function P(C,g){const G=C.getContext("2d");if(G.clearRect(0,0,C.width,C.height),!g)return;const b=nn.find(k=>k.blockType===g);b&&(G.imageSmoothingEnabled=!1,G.drawImage(B,b.sideFace.x*16,b.sideFace.y*16,16,16,0,0,C.width,C.height))}let S=null,M=null;const L=[];function A(){L.forEach((C,g)=>{C.style.outline=g===n()?"2px solid #ff0":""})}function O(C,g,G){const b=document.createElement("div");b.style.cssText=["position:absolute",`left:${C}px`,`top:${g}px`,"width:32px","height:32px","box-sizing:border-box","cursor:grab"].join(";"),b.draggable=G;const k=document.createElement("canvas");return k.width=k.height=32,k.style.cssText="width:32px;height:32px;image-rendering:pixelated;pointer-events:none;display:block;",b.appendChild(k),w.appendChild(b),[b,k]}for(let C=0;C<6;C++)for(let g=0;g<21;g++){const G=y[C*21+g]??null;if(!G)continue;const[b,k]=O(24+g*36,24+C*36,!0);b.title=String(Ii[G]),B.complete?P(k,G):B.addEventListener("load",()=>P(k,G),{once:!1}),b.addEventListener("click",()=>{e[n()]=G,v(),t()}),b.addEventListener("dragstart",U=>{S=G,M=null,U.dataTransfer.effectAllowed="copy",b.style.opacity="0.4"}),b.addEventListener("dragend",()=>{b.style.opacity="1"})}const T=[];for(let C=0;C<9;C++){const[g,G]=O(240+C*36,248,!0);T.push(G),L.push(g),g.title=`Slot ${C+1}`,g.addEventListener("click",()=>{o(C),A()}),g.addEventListener("dragstart",b=>{S=e[C],M=C,b.dataTransfer.effectAllowed="move",g.style.opacity="0.4"}),g.addEventListener("dragend",()=>{g.style.opacity="1"}),g.addEventListener("dragover",b=>{b.preventDefault(),b.dataTransfer.dropEffect=M!==null?"move":"copy",g.style.boxShadow="inset 0 0 0 2px #7ff"}),g.addEventListener("dragleave",()=>{g.style.boxShadow=""}),g.addEventListener("drop",b=>{b.preventDefault(),g.style.boxShadow="",S&&(M!==null&&M!==C?[e[C],e[M]]=[e[M],e[C]]:M===null&&(e[C]=S),v(),t(),S=null,M=null)})}function v(){for(let C=0;C<9;C++)P(T[C],e[C])}return B.addEventListener("load",v),B.complete&&v(),u.appendChild(w),{syncHotbar:v,refreshSlotHighlight:A}}function Ms(u,r,e){const t=document.createElement("div");t.style.cssText=["display:flex","flex-wrap:wrap","gap:8px","justify-content:center","font-family:ui-monospace,monospace","font-size:13px","user-select:none"].join(";");const n="background:#1a2e1a;color:#5f5;border-color:#5f5",o="background:#2e1a1a;color:#f55;border-color:#f55";for(const i of Object.keys(u)){const a=document.createElement("button"),s=i.toUpperCase().padEnd(5),l=()=>{const d=u[i];a.textContent=`${s} ${d?"ON ":"OFF"}`,a.setAttribute("style",["padding:5px 10px","border-width:1px","border-style:solid","border-radius:4px","cursor:pointer","letter-spacing:0.04em",d?n:o].join(";"))};a.addEventListener("click",()=>{u[i]=!u[i],l(),r(i)}),l(),t.appendChild(a)}return e.appendChild(t),t}function Us(u,r){const e=document.createElement("div");e.style.cssText=["position:fixed","inset:0","z-index:100","background:rgba(0,0,0,0.78)","display:none","align-items:center","justify-content:center","font-family:ui-monospace,monospace"].join(";"),document.body.appendChild(e);const t=document.createElement("div");t.style.cssText=["display:flex","flex-direction:column","align-items:center","gap:24px","padding:48px 56px","background:rgba(255,255,255,0.24)","border:1px solid rgba(255,255,255,0.12)","border-radius:12px","max-width:860px","width:90%"].join(";"),e.appendChild(t);const n=document.createElement("h1");n.textContent="CRAFTY",n.style.cssText=["margin:0","font-size:52px","font-weight:900","color:#fff","letter-spacing:0.12em","text-shadow:0 0 48px rgba(100,200,255,0.45)","font-family:ui-monospace,monospace"].join(";"),t.appendChild(n);const o=document.createElement("button");o.textContent="Back to Game",o.style.cssText=["padding:10px 40px","font-size:15px","font-family:ui-monospace,monospace","background:#1a3a1a","color:#5f5","border:1px solid #5f5","border-radius:6px","cursor:pointer","letter-spacing:0.06em","transition:background 0.15s"].join(";"),o.addEventListener("mouseenter",()=>{o.style.background="#243e24"}),o.addEventListener("mouseleave",()=>{o.style.background="#1a3a1a"});const i=()=>{d();try{u.requestPointerLock()}catch{}};o.addEventListener("click",i),o.addEventListener("touchend",f=>{f.preventDefault(),i()},{passive:!1}),t.appendChild(o);const a=document.createElement("div");a.style.cssText="width:100%;height:1px;background:rgba(255,255,255,0.12)",t.appendChild(a);let s=0;function l(){s=performance.now(),e.style.display="flex",r.style.display="none"}function d(){e.style.display="none",r.style.display=""}function p(){return e.style.display!=="none"}return document.addEventListener("pointerlockchange",()=>{document.pointerLockElement===u?d():l()}),document.addEventListener("keydown",f=>{if(f.code==="Escape"&&p()){if(performance.now()-s<200)return;d(),u.requestPointerLock()}}),{overlay:e,card:t,open:l,close:d,isOpen:p}}function Cs(){const u=document.createElement("div");u.style.cssText=["position:fixed","top:50%","left:50%","width:16px","height:16px","transform:translate(-50%,-50%)","pointer-events:none"].join(";"),u.innerHTML=['<div style="position:absolute;top:50%;left:0;width:100%;height:3px;background:#fff;opacity:0.8;transform:translateY(-50%)"></div>','<div style="position:absolute;left:50%;top:0;width:3px;height:100%;background:#fff;opacity:0.8;transform:translateX(-50%)"></div>','<div style="position:absolute;top:50%;left:50%;width:7px;height:3px;background:#fff;opacity:0.9;transform:translate(-50%,-50%);border-radius:50%"></div>'].join(""),document.body.appendChild(u);const r=document.createElement("div");r.style.cssText=["position:fixed","top:12px","right:12px","font-family:ui-monospace,monospace","font-size:13px","color:#ff0","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none"].join(";"),document.body.appendChild(r);const e=document.createElement("div");e.style.cssText=["position:fixed","top:44px","right:12px","font-family:ui-monospace,monospace","font-size:11px","color:#aaf","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none","white-space:pre"].join(";"),document.body.appendChild(e);const t=document.createElement("div");t.style.cssText=["position:fixed","bottom:12px","right:12px","font-family:ui-monospace,monospace","font-size:13px","color:#ff0","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none"].join(";"),document.body.appendChild(t);const n=document.createElement("div");return n.style.cssText=["position:fixed","bottom:44px","right:12px","font-family:ui-monospace,monospace","font-size:11px","color:#ccf","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none"].join(";"),document.body.appendChild(n),{fps:r,stats:e,biome:t,pos:n,reticle:u}}function ks(u,r,e,t,n,o,i,a){const s=new me("Camera");s.position.set(64,25,64);const l=s.addComponent(new Fo(70,.1,1e3,t/n));r.add(s);const d=new me("Flashlight"),p=d.addComponent(new Wo);p.color=new D(1,.95,.9),p.intensity=0,p.range=40,p.innerAngle=12,p.outerAngle=25,p.castShadow=!1,p.projectionTexture=o,s.addChild(d),r.add(d);let f=!1;const h=new Yi(e,Math.PI,.1);h.attach(u);const m=new Li(Math.PI,.1,15);let _=!0;const y=document.createElement("div");y.textContent="PLAYER",y.style.cssText=["position:fixed","top:12px","left:12px","font-family:ui-monospace,monospace","font-size:13px","font-weight:bold","color:#4f4","background:rgba(0,0,0,0.45)","padding:4px 8px","border-radius:4px","pointer-events:none","letter-spacing:0.05em"].join(";"),document.body.appendChild(y);function w(S){i&&(i.style.display=S?"":"none"),a&&(a.style.display=S?"":"none")}function x(){_=!_,_?(h.yaw=m.yaw,h.pitch=m.pitch,m.detach(),h.attach(u)):(m.yaw=h.yaw,m.pitch=h.pitch,h.detach(),m.attach(u)),y.textContent=_?"PLAYER":"FREE",y.style.color=_?"#4f4":"#4cf",w(_)}function B(S){f=S,p.intensity=f?25:0}let P=-1/0;return document.addEventListener("keyup",S=>{S.code==="Space"&&(P=performance.now())}),document.addEventListener("keydown",S=>{if(S.code==="KeyC"&&!S.repeat){x();return}if(!(S.code!=="Space"||S.repeat)&&performance.now()-P<400&&document.pointerLockElement===u){const M=_;x(),P=-1/0,M&&m.pressKey("Space")}}),window.addEventListener("keydown",S=>{S.code==="KeyF"&&!S.repeat&&(B(!f),console.log(`Flashlight ${f?"ON":"OFF"} (intensity: ${p.intensity})`)),S.ctrlKey&&S.key==="w"&&(S.preventDefault(),window.location.reload())}),{cameraGO:s,camera:l,player:h,freeCamera:m,isPlayerMode:()=>_,flashlight:p,isFlashlightEnabled:()=>f,modeEl:y,toggleController:x,setFlashlightEnabled:B,setPlayerUIVisible:w}}const St=new Map,Pt=new Map,rn=(u,r,e)=>`${u},${r},${e}`;function Ko(u,r,e,t){const n=rn(u,r,e);if(St.has(n))return;const o=new me("TorchLight");o.position.set(u+.5,r+.9,e+.5);const i=o.addComponent(new Un);i.color=new D(1,.52,.18),i.intensity=4,i.radius=6,i.castShadow=!1,t.add(o);const a=(u*127.1+r*311.7+e*74.3)%(Math.PI*2);St.set(n,{go:o,pl:i,phase:a})}function An(u,r,e,t){const n=rn(u,r,e),o=St.get(n);o&&(t.remove(o.go),St.delete(n))}function Ls(u){for(const{pl:r,phase:e}of St.values()){const t=1+.08*Math.sin(u*11.7+e)+.05*Math.sin(u*7.3+e*1.7)+.03*Math.sin(u*23.1+e*.5);r.intensity=4*t}}function Jo(u,r,e,t){const n=rn(u,r,e);if(Pt.has(n))return;const o=new me("MagmaLight");o.position.set(u+.5,r+.5,e+.5);const i=o.addComponent(new Un);i.color=new D(1,.28,0),i.intensity=6,i.radius=10,i.castShadow=!1,t.add(o);const a=(u*127.1+r*311.7+e*74.3)%(Math.PI*2);Pt.set(n,{go:o,pl:i,phase:a})}function Qo(u,r,e,t){const n=rn(u,r,e),o=Pt.get(n);o&&(t.remove(o.go),Pt.delete(n))}function Ns(u){for(const{pl:r,phase:e}of Pt.values()){const t=1+.18*Math.sin(u*1.1+e)+.1*Math.sin(u*2.9+e*.7)+.06*Math.sin(u*.5+e*1.4);r.intensity=6*t}}const Rs=700,Is=300;function Os(){return{targetBlock:null,targetHit:null,mouseHeld:-1,mouseHoldTime:0,lastBlockAction:0}}function tr(u,r,e,t,n,o){var i,a,s;if(u===0&&e.targetBlock){const l=e.targetBlock.x,d=e.targetBlock.y,p=e.targetBlock.z,f=t.getBlockType(l,d,p);if(f===N.TORCH&&An(l,d,p,o),f===N.MAGMA&&Qo(l,d,p,o),t.mineBlock(l,d,p)&&((i=e.onLocalEdit)==null||i.call(e,{kind:"break",x:l,y:d,z:p}),!Me(f))){const h=t.getBlockType(l,d+1,p);Me(h)&&(h===N.TORCH&&An(l,d+1,p,o),t.mineBlock(l,d+1,p)&&((a=e.onLocalEdit)==null||a.call(e,{kind:"break",x:l,y:d+1,z:p})))}e.lastBlockAction=r}else if(u===2&&e.targetHit){const l=e.targetHit,d=n(),p=l.position.x+l.face.x,f=l.position.y+l.face.y,h=l.position.z+l.face.z;t.addBlock(l.position.x,l.position.y,l.position.z,l.face.x,l.face.y,l.face.z,d)&&(d===N.TORCH&&Ko(p,f,h,o),d===N.MAGMA&&Jo(p,f,h,o),(s=e.onLocalEdit)==null||s.call(e,{kind:"place",x:l.position.x,y:l.position.y,z:l.position.z,fx:l.face.x,fy:l.face.y,fz:l.face.z,blockType:d})),e.lastBlockAction=r}}function Po(u,r,e){if(u.kind==="break"){const i=r.getBlockType(u.x,u.y,u.z);i===N.TORCH&&An(u.x,u.y,u.z,e),i===N.MAGMA&&Qo(u.x,u.y,u.z,e),r.mineBlock(u.x,u.y,u.z);return}const t=u.x+u.fx,n=u.y+u.fy,o=u.z+u.fz;r.setBlockType(t,n,o,u.blockType),u.blockType===N.TORCH&&Ko(t,n,o,e),u.blockType===N.MAGMA&&Jo(t,n,o,e)}function Vs(u,r,e,t,n){u.addEventListener("contextmenu",o=>o.preventDefault()),u.addEventListener("mousedown",o=>{document.pointerLockElement===u&&(o.button!==0&&o.button!==2||(r.mouseHeld=o.button,r.mouseHoldTime=o.timeStamp,tr(o.button,o.timeStamp,r,e,t,n)))}),u.addEventListener("mouseup",o=>{o.button===r.mouseHeld&&(r.mouseHeld=-1)})}function Ds(u,r,e,t,n,o){e.mouseHeld>=0&&document.pointerLockElement===r&&u-e.mouseHoldTime>=Rs&&u-e.lastBlockAction>=Is&&tr(e.mouseHeld,u,e,t,n,o)}const qe=60,zs=.1,Wt=28,st=64,Go=44,Fs=.005;function Hs(u,r,e){const t={controls:null,cancel(){}},n=()=>{t.controls||(t.controls=new js(u,r),e==null||e(t.controls))};return window.addEventListener("touchstart",n,{once:!0,passive:!0,capture:!0}),t.cancel=()=>window.removeEventListener("touchstart",n,!0),t}function Ws(){if(typeof location<"u"&&/[?&]touch(=1|=true|=on|$|&)/.test(location.search))return!0;if(typeof navigator<"u"){const u=navigator;if((u.maxTouchPoints??0)>0||(u.msMaxTouchPoints??0)>0)return!0}if(typeof window<"u"&&"ontouchstart"in window)return!0;if(typeof window<"u"&&typeof window.matchMedia=="function")try{if(window.matchMedia("(any-pointer: coarse)").matches||window.matchMedia("(pointer: coarse)").matches)return!0}catch{}return!1}class js{constructor(r,e){c(this,"_root");c(this,"_joystick");c(this,"_stick");c(this,"_btnJump");c(this,"_btnSneak");c(this,"_btnMine");c(this,"_btnPlace");c(this,"_btnMenu");c(this,"_joyTouchId",null);c(this,"_joyOriginX",0);c(this,"_joyOriginY",0);c(this,"_lookTouchId",null);c(this,"_lookLastX",0);c(this,"_lookLastY",0);c(this,"_lookLastTapAt",-1/0);c(this,"_lookSensitivity");c(this,"_onJoyStart",r=>{if(this._joyTouchId!==null)return;r.preventDefault();const e=r.changedTouches[0];this._joyTouchId=e.identifier;const t=this._joystick.getBoundingClientRect();this._joyOriginX=t.left+t.width*.5,this._joyOriginY=t.top+t.height*.5,this._updateJoystick(e.clientX,e.clientY)});c(this,"_onJoyMove",r=>{if(this._joyTouchId!==null)for(let e=0;e<r.changedTouches.length;e++){const t=r.changedTouches[e];if(t.identifier===this._joyTouchId){r.preventDefault(),this._updateJoystick(t.clientX,t.clientY);return}}});c(this,"_onJoyEnd",r=>{if(this._joyTouchId!==null){for(let e=0;e<r.changedTouches.length;e++)if(r.changedTouches[e].identifier===this._joyTouchId){r.preventDefault(),this._joyTouchId=null,this._setMovement(0,0),this._stick.style.transform="translate(0px, 0px)";return}}});c(this,"_onLookStart",r=>{if(this._lookTouchId!==null)return;const e=r.changedTouches[0],t=window.innerWidth*.5;if(e.clientX<t)return;r.preventDefault(),this._lookTouchId=e.identifier,this._lookLastX=e.clientX,this._lookLastY=e.clientY;const n=performance.now();n-this._lookLastTapAt<350&&this._opts.onLookDoubleTap?(this._opts.onLookDoubleTap(),this._lookLastTapAt=-1/0):this._lookLastTapAt=n});c(this,"_onLookMove",r=>{if(this._lookTouchId!==null)for(let e=0;e<r.changedTouches.length;e++){const t=r.changedTouches[e];if(t.identifier!==this._lookTouchId)continue;r.preventDefault();const n=t.clientX-this._lookLastX,o=t.clientY-this._lookLastY;this._lookLastX=t.clientX,this._lookLastY=t.clientY,this._applyLook(n,o);return}});c(this,"_onLookEnd",r=>{if(this._lookTouchId!==null){for(let e=0;e<r.changedTouches.length;e++)if(r.changedTouches[e].identifier===this._lookTouchId){r.preventDefault(),this._lookTouchId=null;return}}});this._canvas=r,this._opts=e,this._lookSensitivity=e.lookSensitivity??Fs,this._root=document.createElement("div"),this._root.style.cssText=["position:fixed","inset:0","pointer-events:none","user-select:none","-webkit-user-select:none","touch-action:none","z-index:50"].join(";"),this._joystick=document.createElement("div"),this._joystick.style.cssText=["position:absolute","left:24px","bottom:24px",`width:${qe*2}px`,`height:${qe*2}px`,"border-radius:50%","background:rgba(255,255,255,0.10)","border:2px solid rgba(255,255,255,0.30)","pointer-events:auto"].join(";"),this._stick=document.createElement("div"),this._stick.style.cssText=["position:absolute",`left:${qe-Wt}px`,`top:${qe-Wt}px`,`width:${Wt*2}px`,`height:${Wt*2}px`,"border-radius:50%","background:rgba(255,255,255,0.30)","border:2px solid rgba(255,255,255,0.50)","pointer-events:none","transition:transform 80ms ease-out"].join(";"),this._joystick.appendChild(this._stick),this._root.appendChild(this._joystick),this._btnMine=this._makeButton("⛏",`right:${24+st+12}px`,`bottom:${24+st+12}px`,"rgba(220,80,80,0.45)"),this._btnPlace=this._makeButton("▣","right:24px",`bottom:${24+st+12}px`,"rgba(80,180,90,0.45)"),this._btnJump=this._makeButton("⤒","right:24px","bottom:24px","rgba(255,255,255,0.18)"),this._btnSneak=this._makeButton("⤓",`right:${24+st+12}px`,"bottom:24px","rgba(255,255,255,0.10)"),this._btnMenu=this._makeButton("☰","right:16px","top:16px","rgba(0,0,0,0.45)"),this._btnMenu.style.width=`${Go}px`,this._btnMenu.style.height=`${Go}px`,this._btnMenu.style.fontSize="24px",document.body.appendChild(this._root),this._attachEvents()}destroy(){this._detachEvents(),this._root.remove()}_makeButton(r,e,t,n){const o=document.createElement("div");return o.textContent=r,o.style.cssText=["position:absolute",e,t,`width:${st}px`,`height:${st}px`,"border-radius:50%",`background:${n}`,"border:2px solid rgba(255,255,255,0.45)","color:#fff","font-size:32px","font-family:sans-serif","display:flex","align-items:center","justify-content:center","pointer-events:auto","user-select:none"].join(";"),this._root.appendChild(o),o}_attachEvents(){this._joystick.addEventListener("touchstart",this._onJoyStart,{passive:!1}),this._joystick.addEventListener("touchmove",this._onJoyMove,{passive:!1}),this._joystick.addEventListener("touchend",this._onJoyEnd,{passive:!1}),this._joystick.addEventListener("touchcancel",this._onJoyEnd,{passive:!1}),this._canvas.addEventListener("touchstart",this._onLookStart,{passive:!1}),this._canvas.addEventListener("touchmove",this._onLookMove,{passive:!1}),this._canvas.addEventListener("touchend",this._onLookEnd,{passive:!1}),this._canvas.addEventListener("touchcancel",this._onLookEnd,{passive:!1}),this._bindHoldButton(this._btnJump,()=>this._setJump(!0),()=>this._setJump(!1)),this._bindHoldButton(this._btnSneak,()=>this._setSneak(!0),()=>this._setSneak(!1)),this._bindHoldButton(this._btnMine,()=>this._actionDown(0),()=>this._actionUp(0)),this._bindHoldButton(this._btnPlace,()=>this._actionDown(2),()=>this._actionUp(2));const r=e=>{var t,n;e.preventDefault(),this._btnMenu.style.filter="",(n=(t=this._opts).onMenu)==null||n.call(t)};this._btnMenu.addEventListener("touchstart",e=>{e.preventDefault(),this._btnMenu.style.filter="brightness(1.5)"},{passive:!1}),this._btnMenu.addEventListener("touchend",r,{passive:!1}),this._btnMenu.addEventListener("touchcancel",()=>{this._btnMenu.style.filter=""},{passive:!1})}_detachEvents(){this._joystick.removeEventListener("touchstart",this._onJoyStart),this._joystick.removeEventListener("touchmove",this._onJoyMove),this._joystick.removeEventListener("touchend",this._onJoyEnd),this._joystick.removeEventListener("touchcancel",this._onJoyEnd),this._canvas.removeEventListener("touchstart",this._onLookStart),this._canvas.removeEventListener("touchmove",this._onLookMove),this._canvas.removeEventListener("touchend",this._onLookEnd),this._canvas.removeEventListener("touchcancel",this._onLookEnd)}_bindHoldButton(r,e,t){const n=i=>{i.preventDefault(),r.style.filter="brightness(1.5)",e()},o=i=>{i.preventDefault(),r.style.filter="",t()};r.addEventListener("touchstart",n,{passive:!1}),r.addEventListener("touchend",o,{passive:!1}),r.addEventListener("touchcancel",o,{passive:!1})}_updateJoystick(r,e){let t=r-this._joyOriginX,n=e-this._joyOriginY;const o=Math.hypot(t,n);if(o>qe){const l=qe/o;t*=l,n*=l}this._stick.style.transition="none",this._stick.style.transform=`translate(${t}px, ${n}px)`,requestAnimationFrame(()=>{this._stick.style.transition="transform 80ms ease-out"});const i=t/qe,a=n/qe;if(Math.hypot(i,a)<zs){this._setMovement(0,0);return}this._setMovement(i,-a)}_activeIsCamera(){return(this._opts.getActive?this._opts.getActive():"player")==="camera"}_setMovement(r,e){const t=this._activeIsCamera();t&&this._opts.camera?(this._opts.camera.inputForward=e,this._opts.camera.inputStrafe=r):this._opts.player&&(this._opts.player.inputForward=e,this._opts.player.inputStrafe=r),t&&this._opts.player?(this._opts.player.inputForward=0,this._opts.player.inputStrafe=0):!t&&this._opts.camera&&(this._opts.camera.inputForward=0,this._opts.camera.inputStrafe=0)}_setJump(r){this._activeIsCamera()&&this._opts.camera?this._opts.camera.inputUp=r:this._opts.player&&(this._opts.player.inputJump=r)}_setSneak(r){this._activeIsCamera()&&this._opts.camera?this._opts.camera.inputDown=r:this._opts.player&&(this._opts.player.inputSneak=r)}_applyLook(r,e){const t=r*(this._lookSensitivity/.002),n=e*(this._lookSensitivity/.002);this._activeIsCamera()&&this._opts.camera?this._opts.camera.applyLookDelta(t,n):this._opts.player&&this._opts.player.applyLookDelta(t,n)}_actionDown(r){const{world:e,scene:t,blockInteraction:n,getSelectedBlock:o}=this._opts;if(!e||!t||!n||!o)return;const i=performance.now();n.mouseHeld=r,n.mouseHoldTime=i,tr(r,i,n,e,o,t)}_actionUp(r){const e=this._opts.blockInteraction;e&&e.mouseHeld===r&&(e.mouseHeld=-1)}}const qs=`// Forward PBR shader with multi-light support
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
`,Ys=`// GBuffer fill pass — writes albedo+roughness and normal+metallic.
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
`,Xs=`// Skinned GBuffer fill pass — GPU vertex skinning with up to 4 bone influences.
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
`,To=48,he=class he extends Bi{constructor(e={}){super();c(this,"shaderId","pbr");c(this,"albedo");c(this,"roughness");c(this,"metallic");c(this,"uvOffset");c(this,"uvScale");c(this,"uvTile");c(this,"_albedoMap");c(this,"_normalMap");c(this,"_merMap");c(this,"_uniformBuffer",null);c(this,"_uniformDevice",null);c(this,"_bindGroup",null);c(this,"_bindGroupAlbedo");c(this,"_bindGroupNormal");c(this,"_bindGroupMer");c(this,"_dirty",!0);c(this,"_scratch",new Float32Array(To/4));this.albedo=e.albedo??[1,1,1,1],this.roughness=e.roughness??.5,this.metallic=e.metallic??0,this.uvOffset=e.uvOffset,this.uvScale=e.uvScale,this.uvTile=e.uvTile,this._albedoMap=e.albedoMap,this._normalMap=e.normalMap,this._merMap=e.merMap,this.transparent=e.transparent??!1}get albedoMap(){return this._albedoMap}set albedoMap(e){e!==this._albedoMap&&(this._albedoMap=e,this._bindGroup=null)}get normalMap(){return this._normalMap}set normalMap(e){e!==this._normalMap&&(this._normalMap=e,this._bindGroup=null)}get merMap(){return this._merMap}set merMap(e){e!==this._merMap&&(this._merMap=e,this._bindGroup=null)}markDirty(){this._dirty=!0}getShaderCode(e){switch(e){case xt.Forward:return qs;case xt.Geometry:return Ys;case xt.SkinnedGeometry:return Xs}}getBindGroupLayout(e){let t=he._layoutByDevice.get(e);return t||(t=e.createBindGroupLayout({label:"PbrMaterialBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),he._layoutByDevice.set(e,t)),t}getBindGroup(e){var a,s,l,d;if(this._bindGroup&&this._bindGroupAlbedo===this._albedoMap&&this._bindGroupNormal===this._normalMap&&this._bindGroupMer===this._merMap)return this._bindGroup;(!this._uniformBuffer||this._uniformDevice!==e)&&((a=this._uniformBuffer)==null||a.destroy(),this._uniformBuffer=e.createBuffer({label:"PbrMaterialUniform",size:To,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this._uniformDevice=e,this._dirty=!0);const t=he._getSampler(e),n=((s=this._albedoMap)==null?void 0:s.view)??he._getWhite(e),o=((l=this._normalMap)==null?void 0:l.view)??he._getFlatNormal(e),i=((d=this._merMap)==null?void 0:d.view)??he._getMerDefault(e);return this._bindGroup=e.createBindGroup({label:"PbrMaterialBG",layout:this.getBindGroupLayout(e),entries:[{binding:0,resource:{buffer:this._uniformBuffer}},{binding:1,resource:n},{binding:2,resource:o},{binding:3,resource:i},{binding:4,resource:t}]}),this._bindGroupAlbedo=this._albedoMap,this._bindGroupNormal=this._normalMap,this._bindGroupMer=this._merMap,this._bindGroup}update(e){var n,o,i,a,s,l;if(!this._dirty||!this._uniformBuffer)return;const t=this._scratch;t[0]=this.albedo[0],t[1]=this.albedo[1],t[2]=this.albedo[2],t[3]=this.albedo[3],t[4]=this.roughness,t[5]=this.metallic,t[6]=((n=this.uvOffset)==null?void 0:n[0])??0,t[7]=((o=this.uvOffset)==null?void 0:o[1])??0,t[8]=((i=this.uvScale)==null?void 0:i[0])??1,t[9]=((a=this.uvScale)==null?void 0:a[1])??1,t[10]=((s=this.uvTile)==null?void 0:s[0])??1,t[11]=((l=this.uvTile)==null?void 0:l[1])??1,e.writeBuffer(this._uniformBuffer,0,t.buffer),this._dirty=!1}destroy(){var e;(e=this._uniformBuffer)==null||e.destroy(),this._uniformBuffer=null,this._uniformDevice=null,this._bindGroup=null}static _getSampler(e){let t=he._samplerByDevice.get(e);return t||(t=e.createSampler({label:"PbrMaterialSampler",magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"}),he._samplerByDevice.set(e,t)),t}static _make1x1View(e,t,n,o,i,a){const s=e.createTexture({label:t,size:{width:1,height:1},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return e.queue.writeTexture({texture:s},new Uint8Array([n,o,i,a]),{bytesPerRow:4},{width:1,height:1}),s.createView()}static _getWhite(e){let t=he._whiteByDevice.get(e);return t||(t=he._make1x1View(e,"PbrFallbackWhite",255,255,255,255),he._whiteByDevice.set(e,t)),t}static _getFlatNormal(e){let t=he._flatNormalByDevice.get(e);return t||(t=he._make1x1View(e,"PbrFallbackFlatNormal",128,128,255,255),he._flatNormalByDevice.set(e,t)),t}static _getMerDefault(e){let t=he._merDefaultByDevice.get(e);return t||(t=he._make1x1View(e,"PbrFallbackMer",255,0,255,255),he._merDefaultByDevice.set(e,t)),t}};c(he,"_layoutByDevice",new WeakMap),c(he,"_samplerByDevice",new WeakMap),c(he,"_whiteByDevice",new WeakMap),c(he,"_flatNormalByDevice",new WeakMap),c(he,"_merDefaultByDevice",new WeakMap);let Be=he;const $s=.5;function Zs(u,r,e,t,n,o,i){const a=e.getTopBlockY(u,r,200);if(a<=0||e.getBiomeAt(u,a,r)!==Ae.GrassyPlains)return null;const d=e.getBlockType(Math.floor(u),Math.floor(a-1),Math.floor(r))===N.WATER?Math.floor(a-.05):a,p=new me("Duck");p.position.set(u+.5,d,r+.5);const f=new me("Duck.Body");f.position.set(0,.15,0),f.addComponent(new Pe(n,new Be({albedo:[.93,.93,.93,1],roughness:.9}))),p.addChild(f);const h=new me("Duck.Head");h.position.set(0,.32,-.12),h.addComponent(new Pe(o,new Be({albedo:[.08,.32,.1,1],roughness:.9}))),p.addChild(h);const m=new me("Duck.Bill");return m.position.set(0,.27,-.205),m.addComponent(new Pe(i,new Be({albedo:[1,.55,.05,1],roughness:.8}))),p.addChild(m),p.addComponent(new ft(e)),t.add(p),p}function Ks(u,r,e,t,n,o){const i=Math.random()*Math.PI*2,a=.5+Math.random()*1,s=u.position.x+Math.cos(i)*a,l=u.position.z+Math.sin(i)*a,d=r.getTopBlockY(Math.floor(s),Math.floor(l),200);if(d<=0)return;const p=$s,f=new me("Duckling");f.position.set(s,d,l);const h=new me("Duckling.Body");h.position.set(0,.15*p,0),h.addComponent(new Pe(t,new Be({albedo:[.95,.87,.25,1],roughness:.9}))),f.addChild(h);const m=new me("Duckling.Head");m.position.set(0,.32*p,-.12*p),m.addComponent(new Pe(n,new Be({albedo:[.88,.78,.15,1],roughness:.9}))),f.addChild(m);const _=new me("Duckling.Bill");_.position.set(0,.27*p,-.205*p),_.addComponent(new Pe(o,new Be({albedo:[1,.55,.05,1],roughness:.8}))),f.addChild(_),f.addComponent(new Mi(u,r)),e.add(f)}const Eo=[.96,.7,.72,1],Js=[.98,.76,.78,1];function Ao(u,r,e,t,n,o,i,a=1){const s=e.getTopBlockY(u,r,200);if(s<=0||e.getBiomeAt(u,s,r)!==Ae.GrassyPlains)return;const d=a,p=new me("Pig");p.position.set(u+.5,s,r+.5);const f=new me("Pig.Body");f.position.set(0,.35*d,0),f.addComponent(new Pe(n,new Be({albedo:Eo,roughness:.85}))),p.addChild(f);const h=new me("Pig.Head");h.position.set(0,.35*d,-.48*d),h.addComponent(new Pe(o,new Be({albedo:Eo,roughness:.85}))),p.addChild(h);const m=new me("Pig.Snout");m.position.set(0,.31*d,-.7*d),m.addComponent(new Pe(i,new Be({albedo:Js,roughness:.8}))),p.addChild(m),p.addComponent(new Ei(e)),t.add(p)}const $e=16,Qs=.15,el=.2,tl=.25,nl=5,rl=.25;function ol(u,r,e){const t=new Set,n=u.onChunkAdded;u.onChunkAdded=(o,i)=>{if(n==null||n(o,i),o.aliveBlocks===0)return;const a=Math.floor(o.globalPosition.x/$e),s=Math.floor(o.globalPosition.z/$e),l=`${a}:${s}`;t.has(l)||(t.add(l),il(a,s,u,r,e))}}function il(u,r,e,t,n){const o=u*$e,i=r*$e;if(Math.random()<Qs){const a=1+Math.floor(Math.random()*2);for(let s=0;s<a;s++){const l=Math.floor(o+Math.random()*$e),d=Math.floor(i+Math.random()*$e),p=Zs(l,d,e,t,n.duckBody,n.duckHead,n.duckBill);if(p&&Math.random()<tl)for(let f=0;f<nl;f++)Ks(p,e,t,n.ducklingBody,n.ducklingHead,n.ducklingBill)}}if(Math.random()<el){const a=1+Math.floor(Math.random()*2);for(let s=0;s<a;s++){const l=Math.floor(o+Math.random()*$e),d=Math.floor(i+Math.random()*$e);Math.random()<rl?Ao(l,d,e,t,n.babyPigBody,n.babyPigHead,n.babyPigSnout,.55):Ao(l,d,e,t,n.pigBody,n.pigHead,n.pigSnout,1)}}}const nt=128,jt=40;class al{constructor(){c(this,"data",new Float32Array(nt*nt));c(this,"resolution",nt);c(this,"extent",jt);c(this,"_camX",NaN);c(this,"_camZ",NaN)}update(r,e,t){if(Math.abs(r-this._camX)<2&&Math.abs(e-this._camZ)<2)return;this._camX=r,this._camZ=e;const n=jt*2/nt,o=r-jt,i=e-jt,a=Math.ceil(e)+80;for(let s=0;s<nt;s++)for(let l=0;l<nt;l++)this.data[s*nt+l]=t.getTopBlockY(Math.floor(o+l*n),Math.floor(i+s*n),a)}}function qt(u,r,e,t,n,o,i,a){const s=[{n:[0,0,-1],t:[-1,0,0,1],v:[[-o,-i,-a],[o,-i,-a],[o,i,-a],[-o,i,-a]]},{n:[0,0,1],t:[1,0,0,1],v:[[o,-i,a],[-o,-i,a],[-o,i,a],[o,i,a]]},{n:[-1,0,0],t:[0,0,-1,1],v:[[-o,-i,a],[-o,-i,-a],[-o,i,-a],[-o,i,a]]},{n:[1,0,0],t:[0,0,1,1],v:[[o,-i,-a],[o,-i,a],[o,i,a],[o,i,-a]]},{n:[0,1,0],t:[1,0,0,1],v:[[-o,i,-a],[o,i,-a],[o,i,a],[-o,i,a]]},{n:[0,-1,0],t:[1,0,0,1],v:[[-o,-i,a],[o,-i,a],[o,-i,-a],[-o,-i,-a]]}],l=[[0,1],[1,1],[1,0],[0,0]];for(const d of s){const p=u.length/12;for(let f=0;f<4;f++){const[h,m,_]=d.v[f];u.push(e+h,t+m,n+_,d.n[0],d.n[1],d.n[2],l[f][0],l[f][1],d.t[0],d.t[1],d.t[2],d.t[3])}r.push(p,p+2,p+1,p,p+3,p+2)}}function sl(u){const r=Yt(u,(o,i)=>qt(o,i,0,0,0,.25,.375,.125)),e=Yt(u,(o,i)=>qt(o,i,0,0,0,.25,.25,.25)),t=Yt(u,(o,i)=>qt(o,i,0,-.375,0,.125,.375,.125)),n=Yt(u,(o,i)=>qt(o,i,0,-.375,0,.125,.375,.125));return{body:r,head:e,arm:t,leg:n}}function Yt(u,r){const e=[],t=[];return r(e,t),ke.fromData(u,new Float32Array(e),new Uint32Array(t))}const ll=[.95,.78,.62,1],Sn=[.3,.55,.85,1],Mo=[.25,.3,.45,1];class cl{constructor(r,e,t,n){c(this,"playerId");c(this,"name");c(this,"root");c(this,"_scene");c(this,"_head");c(this,"_armL");c(this,"_armR");c(this,"_legL");c(this,"_legR");c(this,"_curX",0);c(this,"_curY",0);c(this,"_curZ",0);c(this,"_curYaw",0);c(this,"_curPitch",0);c(this,"_tgtX",0);c(this,"_tgtY",0);c(this,"_tgtZ",0);c(this,"_tgtYaw",0);c(this,"_tgtPitch",0);c(this,"_hasTarget",!1);c(this,"_walkPhase",0);this.playerId=r,this.name=e,this._scene=t;const o=new me(`RemotePlayer.${r}`);this.root=o;const i=new me("RP.Body");i.position.set(0,1.125,0),i.addComponent(new Pe(n.body,new Be({albedo:Sn,roughness:.85}))),o.addChild(i);const a=new me("RP.Head");a.position.set(0,1.75,0),a.addComponent(new Pe(n.head,new Be({albedo:ll,roughness:.8}))),o.addChild(a),this._head=a;const s=new me("RP.ArmL");s.position.set(-.375,1.5,0),s.addComponent(new Pe(n.arm,new Be({albedo:Sn,roughness:.85}))),o.addChild(s),this._armL=s;const l=new me("RP.ArmR");l.position.set(.375,1.5,0),l.addComponent(new Pe(n.arm,new Be({albedo:Sn,roughness:.85}))),o.addChild(l),this._armR=l;const d=new me("RP.LegL");d.position.set(-.125,.75,0),d.addComponent(new Pe(n.leg,new Be({albedo:Mo,roughness:.85}))),o.addChild(d),this._legL=d;const p=new me("RP.LegR");p.position.set(.125,.75,0),p.addComponent(new Pe(n.leg,new Be({albedo:Mo,roughness:.85}))),o.addChild(p),this._legR=p,t.add(o)}setTargetTransform(r,e,t,n,o){this._hasTarget||(this._curX=r,this._curY=e,this._curZ=t,this._curYaw=n,this._curPitch=o),this._tgtX=r,this._tgtY=e,this._tgtZ=t,this._tgtYaw=n,this._tgtPitch=o,this._hasTarget=!0}update(r){if(!this._hasTarget)return;const e=1-Math.exp(-12*r),t=this._tgtX-this._curX,n=this._tgtY-this._curY,o=this._tgtZ-this._curZ;this._curX+=t*e,this._curY+=n*e,this._curZ+=o*e,this._curYaw=dl(this._curYaw,this._tgtYaw,e),this._curPitch+=(this._tgtPitch-this._curPitch)*e,this.root.position.set(this._curX,this._curY-1.625,this._curZ),this.root.rotation=de.fromAxisAngle(ul,this._curYaw),this._head.rotation=de.fromAxisAngle(bt,this._curPitch);const a=Math.hypot(t,o)/Math.max(r,.001),s=a>.3,l=s?Math.min(a*1.2,8):4;this._walkPhase+=r*l;const d=s?Math.sin(this._walkPhase)*.55:0;this._armL.rotation=de.fromAxisAngle(bt,d),this._armR.rotation=de.fromAxisAngle(bt,-d),this._legL.rotation=de.fromAxisAngle(bt,-d),this._legR.rotation=de.fromAxisAngle(bt,d)}headWorldPosition(r){return r.x=this.root.position.x,r.y=this.root.position.y+2.1,r.z=this.root.position.z,r}dispose(){this._scene.remove(this.root)}}const ul=new D(0,1,0),bt=new D(1,0,0);function dl(u,r,e){let t=r-u;for(;t>Math.PI;)t-=2*Math.PI;for(;t<-Math.PI;)t+=2*Math.PI;return u+t*e}const Uo=64;class fl{constructor(r){c(this,"_root");c(this,"_labels",new Map);const e=document.createElement("div");e.style.position="absolute",e.style.left="0",e.style.top="0",e.style.width="100%",e.style.height="100%",e.style.pointerEvents="none",e.style.overflow="hidden",r.appendChild(e),this._root=e}add(r,e){if(this._labels.has(r))return;const t=document.createElement("div");t.textContent=e,t.style.position="absolute",t.style.transform="translate(-50%, -100%)",t.style.padding="2px 6px",t.style.font="12px sans-serif",t.style.color="#fff",t.style.background="rgba(0,0,0,0.55)",t.style.border="1px solid rgba(255,255,255,0.2)",t.style.borderRadius="4px",t.style.whiteSpace="nowrap",t.style.userSelect="none",t.style.display="none",this._root.appendChild(t),this._labels.set(r,t)}remove(r){const e=this._labels.get(r);e!==void 0&&(e.remove(),this._labels.delete(r))}update(r,e,t,n,o){for(const[i,a]of this._labels){const s=o.get(i);if(s===void 0){a.style.display="none";continue}const l=s.x-e.x,d=s.y-e.y,p=s.z-e.z;if(l*l+d*d+p*p>Uo*Uo){a.style.display="none";continue}const h=r.transformVec4(new Oe(s.x,s.y,s.z,1));if(h.w<=.001){a.style.display="none";continue}const m=h.x/h.w,_=h.y/h.w;if(m<-1||m>1||_<-1||_>1){a.style.display="none";continue}const y=(m*.5+.5)*t,w=(1-(_*.5+.5))*n;a.style.display="block",a.style.left=`${y}px`,a.style.top=`${w}px`}}}const Kt=1,pl="crafty",hl=1,Xt="worlds";class nr{constructor(r){c(this,"_db");this._db=r}static open(){return new Promise((r,e)=>{const t=indexedDB.open(pl,hl);t.onupgradeneeded=()=>{const n=t.result;n.objectStoreNames.contains(Xt)||n.createObjectStore(Xt,{keyPath:"id"})},t.onsuccess=()=>r(new nr(t.result)),t.onerror=()=>e(t.error??new Error("IndexedDB open failed"))})}list(){return this._withStore("readonly",r=>new Promise((e,t)=>{const n=r.getAll();n.onsuccess=()=>{const o=n.result??[];o.sort((i,a)=>a.lastPlayedAt-i.lastPlayedAt),e(o)},n.onerror=()=>t(n.error??new Error("IndexedDB list failed"))}))}load(r){return this._withStore("readonly",e=>new Promise((t,n)=>{const o=e.get(r);o.onsuccess=()=>t(o.result??null),o.onerror=()=>n(o.error??new Error("IndexedDB load failed"))}))}save(r){return this._withStore("readwrite",e=>new Promise((t,n)=>{const o=e.put(r);o.onsuccess=()=>t(),o.onerror=()=>n(o.error??new Error("IndexedDB save failed"))}))}delete(r){return this._withStore("readwrite",e=>new Promise((t,n)=>{const o=e.delete(r);o.onsuccess=()=>t(),o.onerror=()=>n(o.error??new Error("IndexedDB delete failed"))}))}_withStore(r,e){const n=this._db.transaction(Xt,r).objectStore(Xt);return e(n)}}function Co(u,r){const e=Date.now();return{id:ml(),name:u,seed:r,createdAt:e,lastPlayedAt:e,edits:[],player:{x:64,y:80,z:64,yaw:0,pitch:0},sunAngle:Math.PI*.3,version:Kt}}function ml(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`}const _l=2,gl=20,vl=1e3/gl;class bl{constructor(){c(this,"_ws",null);c(this,"_callbacks",{});c(this,"_lastTransformSend",0);c(this,"_pendingTransform",null);c(this,"_connected",!1);c(this,"_inGame",!1);c(this,"_pendingHello",null);c(this,"_pendingCreate",null);c(this,"_pendingJoin",null)}get connected(){return this._connected}setCallbacks(r){this._callbacks=r}connect(r,e,t){return new Promise((n,o)=>{const i=new WebSocket(r);this._ws=i,this._pendingHello={resolve:n,reject:o},i.addEventListener("open",()=>{this._send({t:"hello",playerKey:e,name:t,version:_l})}),i.addEventListener("message",a=>{let s;try{s=JSON.parse(typeof a.data=="string"?a.data:"")}catch{return}this._dispatch(s)}),i.addEventListener("error",()=>{this._failAllPending(new Error("WebSocket error"))}),i.addEventListener("close",()=>{this._connected=!1,this._inGame=!1,this._failAllPending(new Error("WebSocket closed"))})})}createWorld(r,e){return!this._connected||this._inGame?Promise.reject(new Error("createWorld requires lobby phase")):new Promise((t,n)=>{this._pendingCreate={resolve:t,reject:n},this._send({t:"create_world",name:r,seed:e})})}joinWorld(r){return!this._connected||this._inGame?Promise.reject(new Error("joinWorld requires lobby phase")):new Promise((e,t)=>{this._pendingJoin={resolve:e,reject:t},this._send({t:"join_world",worldId:r})})}sendTransform(r,e,t,n,o){if(!this._inGame)return;this._pendingTransform={x:r,y:e,z:t,yaw:n,pitch:o};const i=performance.now();if(i-this._lastTransformSend<vl)return;this._lastTransformSend=i;const a=this._pendingTransform;this._pendingTransform=null,this._send({t:"transform",x:a.x,y:a.y,z:a.z,yaw:a.yaw,pitch:a.pitch})}sendBlockPlace(r,e,t,n,o,i,a){this._inGame&&this._send({t:"block_place",x:r,y:e,z:t,fx:n,fy:o,fz:i,blockType:a})}sendBlockBreak(r,e,t){this._inGame&&this._send({t:"block_break",x:r,y:e,z:t})}_dispatch(r){var e,t,n,o,i,a,s,l,d,p;switch(r.t){case"world_list":if(this._pendingHello!==null){this._connected=!0,this._pendingHello.resolve(r.worlds),this._pendingHello=null;return}(t=(e=this._callbacks).onWorldList)==null||t.call(e,r.worlds);return;case"world_created":this._pendingCreate!==null&&(this._pendingCreate.resolve(r.world),this._pendingCreate=null);return;case"welcome":this._pendingJoin!==null&&(this._inGame=!0,this._pendingJoin.resolve({playerId:r.playerId,worldId:r.worldId,seed:r.seed,sunAngle:r.sunAngle,lastPosition:r.lastPosition,edits:r.edits,players:r.players}),this._pendingJoin=null);return;case"error":{const f=new Error(`${r.code}: ${r.message}`);if(this._pendingCreate!==null){this._pendingCreate.reject(f),this._pendingCreate=null;return}if(this._pendingJoin!==null){this._pendingJoin.reject(f),this._pendingJoin=null;return}if(this._pendingHello!==null){this._pendingHello.reject(f),this._pendingHello=null;return}console.warn("[crafty] server error:",f.message);return}case"player_join":(o=(n=this._callbacks).onPlayerJoin)==null||o.call(n,r.playerId,r.name);return;case"player_leave":(a=(i=this._callbacks).onPlayerLeave)==null||a.call(i,r.playerId);return;case"player_transform":(l=(s=this._callbacks).onPlayerTransform)==null||l.call(s,r.playerId,r.x,r.y,r.z,r.yaw,r.pitch);return;case"block_edit":(p=(d=this._callbacks).onBlockEdit)==null||p.call(d,r.edit);return}}_failAllPending(r){this._pendingHello!==null&&(this._pendingHello.reject(r),this._pendingHello=null),this._pendingCreate!==null&&(this._pendingCreate.reject(r),this._pendingCreate=null),this._pendingJoin!==null&&(this._pendingJoin.reject(r),this._pendingJoin=null)}_send(r){this._ws===null||this._ws.readyState!==WebSocket.OPEN||this._ws.send(JSON.stringify(r))}}const yl=""+new URL("crafty-CP0F5VYA.png",import.meta.url).href,ko="crafty.playerName",$t="crafty.lastSeed",Lo="crafty.serverUrl",No="crafty.playerKey",Pn="ws://localhost:8787";function xl(){let u=localStorage.getItem(No);return(u===null||u.length===0)&&(u=typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`,localStorage.setItem(No,u)),u}async function wl(){let u=null,r=[];try{u=await nr.open(),r=await u.list()}catch(e){console.warn("[crafty] world storage unavailable — local worlds will not persist",e)}return new Promise(e=>{const t=document.createElement("div");t.style.cssText=["position:fixed","inset:0","z-index:200",`background:linear-gradient(rgba(128,128,128,0.35),rgba(128,128,128,0.75)),url(${yl}) center/cover no-repeat #000`,"display:flex","align-items:center","justify-content:center","font-family:ui-monospace,monospace"].join(";"),document.body.appendChild(t);const n=document.createElement("div");n.style.cssText=["display:flex","flex-direction:column","align-items:stretch","gap:18px","padding:36px 44px","background:rgba(82, 82, 82, 1.0)","border:1px solid rgba(255,255,255,0.12)","border-radius:12px","min-width:480px","max-width:560px","box-shadow:0 0 55px rgba(255,255,255,0.8)"].join(";"),t.appendChild(n);const o=document.createElement("h1");o.textContent="CRAFTY",o.style.cssText=["margin:0 0 4px","text-align:center","font-size:44px","font-weight:900","color:#fff","letter-spacing:0.14em","text-shadow:0 0 32px rgba(100,200,255,0.4)"].join(";"),n.appendChild(o);const i=ct("Player name",lt({value:localStorage.getItem(ko)??"",placeholder:"Steve",maxLength:16}));n.appendChild(i.row);const a=document.createElement("div");a.style.cssText="display:flex;gap:0;border-bottom:1px solid rgba(255,255,255,0.12)",n.appendChild(a);const s=Ro("Local"),l=Ro("Network");a.appendChild(s),a.appendChild(l);const d=Oo(),p=Oo();n.appendChild(d),n.appendChild(p),d.appendChild(yt("Saved worlds"));const f=document.createElement("div");f.style.cssText=["display:flex","flex-direction:column","gap:6px","max-height:240px","overflow-y:auto","padding:8px 4px 12px"].join(";"),d.appendChild(f);let h=r;function m(){if(f.replaceChildren(),h.length===0){const R=document.createElement("div");R.textContent=u===null?"Storage unavailable in this browser":"No saved worlds yet",R.style.cssText="color:rgba(255,255,255,0.85);font-size:12px;padding:8px 0",f.appendChild(R);return}for(const R of h)f.appendChild(Bl(R,()=>_(R),()=>y(R)))}m();function _(R){J({mode:"local",world:R,storage:u,playerName:te()})}async function y(R){if(u!==null)try{await u.delete(R.id),h=h.filter(z=>z.id!==R.id),m()}catch(z){console.error("[crafty] delete failed",z)}}d.appendChild(yt("New world"));const w=lt({value:"",placeholder:`World ${r.length+1}`,maxLength:32});d.appendChild(ct("Name",w).row);const x=lt({value:localStorage.getItem($t)??"13",placeholder:"random"});d.appendChild(ct("Seed",x).row);const B=Gn("Create"),P=document.createElement("div");P.style.cssText="color:#f88;font-size:12px;min-height:16px;text-align:right",d.appendChild(Tn(B,P));const S=xl();let M=null,L="",A=[];const O=document.createElement("div");O.style.cssText="display:flex;flex-direction:column;gap:10px",p.appendChild(O);const T=document.createElement("div");T.style.cssText="display:none;flex-direction:column;gap:10px",p.appendChild(T),O.appendChild(yt("Server"));const v=lt({value:localStorage.getItem(Lo)??Pn,placeholder:Pn});O.appendChild(ct("URL",v).row);const C=Gn("Connect"),g=document.createElement("div");g.style.cssText="color:#f88;font-size:12px;min-height:16px;text-align:right",O.appendChild(Tn(C,g)),T.appendChild(yt("Server worlds"));const G=document.createElement("div");G.style.cssText="color:rgba(255,255,255,0.6);font-size:11px;padding:0 0 4px;display:flex;align-items:center;justify-content:space-between;gap:8px";const b=document.createElement("span");G.appendChild(b);const k=document.createElement("button");k.textContent="Disconnect",k.style.cssText=["background:transparent","color:rgba(255,255,255,0.6)","border:1px solid rgba(255,255,255,0.25)","border-radius:4px","padding:2px 8px","font:11px ui-monospace,monospace","cursor:pointer"].join(";"),G.appendChild(k),T.appendChild(G);const U=document.createElement("div");U.style.cssText=["display:flex","flex-direction:column","gap:6px","max-height:200px","overflow-y:auto","padding:4px"].join(";"),T.appendChild(U),T.appendChild(yt("New world"));const F=lt({value:"",placeholder:"World name",maxLength:32});T.appendChild(ct("Name",F).row);const W=lt({value:localStorage.getItem($t)??"13",placeholder:"random"});T.appendChild(ct("Seed",W).row);const V=Gn("Create"),Z=document.createElement("div");Z.style.cssText="color:#f88;font-size:12px;min-height:16px;text-align:right",T.appendChild(Tn(V,Z));function se(){if(U.replaceChildren(),A.length===0){const R=document.createElement("div");R.textContent="No worlds on this server yet",R.style.cssText="color:rgba(255,255,255,0.85);font-size:12px;padding:8px 0",U.appendChild(R);return}for(const R of A)U.appendChild(Sl(R,()=>fe(R)))}async function fe(R){if(M!==null){Z.style.color="rgba(255,255,255,0.92)",Z.textContent=`joining "${R.name}"…`;try{const z=await M.joinWorld(R.id);J({mode:"network",playerName:te(),serverUrl:L,network:M,welcome:z,world:R})}catch(z){Z.style.color="#f88",Z.textContent=`join failed: ${z.message}`}}}V.addEventListener("click",async()=>{if(M===null)return;const R=X(W.value);W.value=String(R),localStorage.setItem($t,String(R));const z=F.value.trim(),K=z.length>0?z:`World ${A.length+1}`;V.disabled=!0,Z.style.color="rgba(255,255,255,0.92)",Z.textContent="creating…";try{const Q=await M.createWorld(K,R),_e=await M.joinWorld(Q.id);J({mode:"network",playerName:te(),serverUrl:L,network:M,welcome:_e,world:Q})}catch(Q){Z.style.color="#f88",Z.textContent=`failed: ${Q.message}`,V.disabled=!1}}),k.addEventListener("click",()=>{M=null,A=[],L="",T.style.display="none",O.style.display="flex",C.disabled=!1,g.textContent=""});function re(R){const z=R==="local";Io(s,z),Io(l,!z),d.style.display=z?"flex":"none",p.style.display=z?"none":"flex"}s.addEventListener("click",()=>re("local")),l.addEventListener("click",()=>re("network")),re("local");function te(){const R=(i.input.value??"").trim().slice(0,16);return R.length>0?R:`player${Math.floor(Math.random()*1e3)}`}function X(R){const z=R.trim();if(z.length===0)return Math.floor(Math.random()*2147483647);const K=Number(z);if(Number.isFinite(K))return Math.floor(K);let Q=2166136261;for(let _e=0;_e<z.length;_e++)Q=Math.imul(Q^z.charCodeAt(_e),16777619)>>>0;return Q&2147483647}function J(R){localStorage.setItem(ko,te()),t.remove(),e(R)}B.addEventListener("click",async()=>{const R=X(x.value);x.value=String(R),localStorage.setItem($t,String(R));const z=w.value.trim(),K=z.length>0?z:`World ${h.length+1}`;if(u===null){J({mode:"local",world:Co(K,R),storage:null,playerName:te()});return}B.disabled=!0,P.style.color="rgba(255,255,255,0.92)",P.textContent="creating…";try{const Q=Co(K,R);await u.save(Q),J({mode:"local",world:Q,storage:u,playerName:te()})}catch(Q){P.style.color="#f88",P.textContent=`failed: ${Q.message}`,B.disabled=!1}}),C.addEventListener("click",async()=>{const R=v.value.trim()||Pn,z=te();g.style.color="rgba(255,255,255,0.92)",g.textContent="connecting…",C.disabled=!0;const K=new bl;try{const Q=await K.connect(R,S,z);localStorage.setItem(Lo,R),M=K,L=R,A=Q,K.setCallbacks({onWorldList:_e=>{A=_e,se()}}),b.textContent=R,O.style.display="none",T.style.display="flex",g.textContent="",se()}catch(Q){g.style.color="#f88",g.textContent=`failed: ${Q.message}`,C.disabled=!1}})})}function lt(u){const r=document.createElement("input");return r.type="text",u.value!==void 0&&(r.value=u.value),u.placeholder!==void 0&&(r.placeholder=u.placeholder),u.maxLength!==void 0&&(r.maxLength=u.maxLength),r.style.cssText=["flex:1","padding:8px 10px","background:rgba(0,0,0,0.55)","color:#fff","border:1px solid rgba(255,255,255,0.35)","border-radius:5px","font:13px ui-monospace,monospace","outline:none"].join(";"),r.addEventListener("focus",()=>{r.style.borderColor="#5f5"}),r.addEventListener("blur",()=>{r.style.borderColor="rgba(255,255,255,0.35)"}),r}function ct(u,r){const e=document.createElement("div");e.style.cssText="display:flex;align-items:center;gap:12px";const t=document.createElement("label");return t.textContent=u,t.style.cssText="min-width:96px;color:rgba(255,255,255,0.92);font-size:12px;letter-spacing:0.06em",e.appendChild(t),e.appendChild(r),{row:e,input:r}}function Ro(u){const r=document.createElement("button");return r.textContent=u,r.style.cssText=["padding:10px 20px","background:transparent","color:rgba(255,255,255,0.8)","border:none","border-bottom:2px solid transparent","font:13px ui-monospace,monospace","letter-spacing:0.08em","cursor:pointer"].join(";"),r}function Io(u,r){u.style.color=r?"#9fff9f":"rgba(255,255,255,0.8)",u.style.borderBottomColor=r?"#9fff9f":"transparent"}function Oo(){const u=document.createElement("div");return u.style.cssText="display:flex;flex-direction:column;gap:10px;padding:12px 0",u}function yt(u){const r=document.createElement("div");return r.textContent=u,r.style.cssText="color:#fff;font-size:11px;letter-spacing:0.18em",r}function Gn(u){const r=document.createElement("button");return r.textContent=u,r.style.cssText=["padding:10px 32px","background:#1a3a1a","color:#5f5","border:1px solid #5f5","border-radius:6px","font:13px ui-monospace,monospace","letter-spacing:0.06em","cursor:pointer","transition:background 0.15s"].join(";"),r.addEventListener("mouseenter",()=>{r.disabled||(r.style.background="#243e24")}),r.addEventListener("mouseleave",()=>{r.style.background="#1a3a1a"}),r}function Tn(...u){const r=document.createElement("div");r.style.cssText="display:flex;align-items:center;gap:12px;justify-content:flex-end;padding-top:8px";for(const e of u)r.appendChild(e);return r}function Bl(u,r,e){const t=document.createElement("div");t.style.cssText=["display:flex","align-items:center","gap:10px","padding:6px 8px","border-radius:6px","background:rgba(0,0,0,0.35)","border:1px solid rgba(255,255,255,0.08)","cursor:pointer","transition:background 0.12s"].join(";"),t.addEventListener("mouseenter",()=>{t.style.background="rgba(255,255,255,0.08)"}),t.addEventListener("mouseleave",()=>{t.style.background="rgba(0,0,0,0.35)"}),t.addEventListener("click",d=>{d.target.dataset.role!=="delete"&&r()});const n=document.createElement("div");if(n.style.cssText=["width:64px","height:36px","flex-shrink:0","border-radius:4px","overflow:hidden","background:linear-gradient(135deg,#1f3a4a,#0a1622)"].join(";"),u.screenshot!==void 0){const d=document.createElement("img");d.src=URL.createObjectURL(u.screenshot),d.style.cssText="width:100%;height:100%;object-fit:cover;display:block",d.addEventListener("load",()=>URL.revokeObjectURL(d.src)),n.appendChild(d)}t.appendChild(n);const o=document.createElement("div");o.style.cssText="flex:1;display:flex;flex-direction:column;gap:2px;min-width:0";const i=document.createElement("div");i.textContent=u.name,i.style.cssText="color:#fff;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis";const a=document.createElement("div");a.textContent=ei(Date.now()-u.lastPlayedAt),a.style.cssText="color:rgba(255,255,255,0.55);font-size:11px",o.appendChild(i),o.appendChild(a),t.appendChild(o);const s=document.createElement("button");s.dataset.role="delete",s.textContent="×",s.title="Delete",s.style.cssText=["background:transparent","color:rgba(255,255,255,0.45)","border:1px solid rgba(255,255,255,0.18)","border-radius:4px","padding:2px 8px","font:13px ui-monospace,monospace","cursor:pointer"].join(";");let l=!1;return s.addEventListener("click",d=>{if(d.stopPropagation(),!l){l=!0,s.textContent="Delete?",s.style.color="#f88",s.style.borderColor="#f88";const p=()=>{l=!1,s.textContent="×",s.style.color="rgba(255,255,255,0.45)",s.style.borderColor="rgba(255,255,255,0.18)",document.removeEventListener("click",p,!0)};setTimeout(()=>document.addEventListener("click",p,!0),0);return}e()}),t.appendChild(s),t}function Sl(u,r){const e=document.createElement("div");e.style.cssText=["display:flex","align-items:center","gap:10px","padding:8px 10px","border-radius:6px","background:rgba(0,0,0,0.35)","border:1px solid rgba(255,255,255,0.08)","cursor:pointer","transition:background 0.12s"].join(";"),e.addEventListener("mouseenter",()=>{e.style.background="rgba(255,255,255,0.08)"}),e.addEventListener("mouseleave",()=>{e.style.background="rgba(0,0,0,0.35)"}),e.addEventListener("click",r);const t=document.createElement("div");t.style.cssText="flex:1;display:flex;flex-direction:column;gap:2px;min-width:0";const n=document.createElement("div");n.textContent=u.name,n.style.cssText="color:#fff;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis";const o=document.createElement("div"),i=u.playerCount===1?"1 player":`${u.playerCount} players`;return o.textContent=`${i}  ·  ${u.editCount} edit${u.editCount===1?"":"s"}  ·  ${ei(Date.now()-u.lastModifiedAt)}`,o.style.cssText="color:rgba(255,255,255,0.55);font-size:11px",t.appendChild(n),t.appendChild(o),e.appendChild(t),e}function ei(u){if(u<0)return"just now";const r=Math.floor(u/1e3);if(r<60)return"just now";const e=Math.floor(r/60);if(e<60)return`${e} minute${e===1?"":"s"} ago`;const t=Math.floor(e/60);if(t<24)return`${t} hour${t===1?"":"s"} ago`;const n=Math.floor(t/24);if(n<30)return`${n} day${n===1?"":"s"} ago`;const o=Math.floor(n/30);return`${o} month${o===1?"":"s"} ago`}const Pl={ssao:!0,ssgi:!1,shadows:!0,dof:!0,bloom:!0,godrays:!0,fog:!1,aces:!0,ao_dbg:!1,shd_dbg:!1,chunk_dbg:!1,hdr:!0,auto_exp:!1,rain:!0,clouds:!0},Gl="modulepreload",Tl=function(u,r){return new URL(u,r).href},Vo={},El=function(r,e,t){let n=Promise.resolve();if(e&&e.length>0){const i=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),s=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));n=Promise.allSettled(e.map(l=>{if(l=Tl(l,t),l in Vo)return;Vo[l]=!0;const d=l.endsWith(".css"),p=d?'[rel="stylesheet"]':"";if(!!t)for(let m=i.length-1;m>=0;m--){const _=i[m];if(_.href===l&&(!d||_.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${l}"]${p}`))return;const h=document.createElement("link");if(h.rel=d?"stylesheet":Gl,d||(h.as="script"),h.crossOrigin="",h.href=l,s&&h.setAttribute("nonce",s),document.head.appendChild(h),d)return new Promise((m,_)=>{h.addEventListener("load",m),h.addEventListener("error",()=>_(new Error(`Unable to preload CSS for ${l}`)))})}))}function o(i){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=i,window.dispatchEvent(a),!a.defaultPrevented)throw i}return n.then(i=>{for(const a of i||[])a.status==="rejected"&&o(a.reason);return r().catch(o)})},Al={emitter:{maxParticles:8e4,spawnRate:24e3,lifetime:[2,3.5],shape:{kind:"box",halfExtents:[35,.1,35]},initialSpeed:[0,0],initialColor:[.75,.88,1,.55],initialSize:[.005,.009],roughness:.1,metallic:0},modifiers:[{type:"gravity",strength:9},{type:"drag",coefficient:.05},{type:"color_over_lifetime",startColor:[.75,.88,1,.55],endColor:[.75,.88,1,0]},{type:"block_collision"}],renderer:{type:"sprites",blendMode:"alpha",billboard:"velocity",renderTarget:"hdr"}},Ml={emitter:{maxParticles:5e4,spawnRate:1500,lifetime:[30,45],shape:{kind:"box",halfExtents:[35,.1,35]},initialSpeed:[0,0],initialColor:[.92,.96,1,.85],initialSize:[.025,.055],roughness:.1,metallic:0},modifiers:[{type:"gravity",strength:1.5},{type:"drag",coefficient:.8},{type:"curl_noise",scale:1,strength:1,timeScale:1,octaves:1},{type:"block_collision"}],renderer:{type:"sprites",blendMode:"alpha",billboard:"camera",renderTarget:"hdr"}};async function Ul(u,r,e,t,n,o,i,a,s,l,d){let p,f,h,m;if(r.worldGeometryPass){const Z=Jt.create(u);r.worldGeometryPass.updateGBuffer(Z),p=Z,f=r.worldGeometryPass,h=r.worldShadowPass,m=r.waterPass}else{p=Jt.create(u),f=qn.create(u,p,t),h=Kn.create(u,r.shadowPass.shadowMapArrayViews,3,t);const Z=u.device.createTexture({label:"WaterDummyHDR",size:{width:u.width,height:u.height},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),se=u.device.createTexture({label:"WaterDummyDepth",size:{width:u.width,height:u.height},format:"depth32float",usage:GPUTextureUsage.TEXTURE_BINDING}),fe=Z.createView(),re=se.createView();m=rt.create(u,Z,fe,re,n,o,i);const te=(R,z)=>{d.set(R,z),f.addChunk(R,z),h.addChunk(R,z),m.addChunk(R,z)},X=(R,z)=>{d.set(R,z),f.updateChunk(R,z),h.updateChunk(R,z),m.updateChunk(R,z)},J=R=>{d.delete(R),f.removeChunk(R),h.removeChunk(R),m.removeChunk(R)};l.onChunkAdded=te,l.onChunkUpdated=X,l.onChunkRemoved=J;for(const[R,z]of d)m.addChunk(R,z)}const _=jn.create(u,p),y=Xn.create(u,p),w=e.clouds?Dn.create(u,s):null,x=Rn.create(u,p,r.shadowPass,y.aoView,w==null?void 0:w.shadowView,a),B=e.godrays?Hn.create(u,p,r.shadowPass,x.hdrView,x.cameraBuffer,x.lightBuffer):null,P=In.create(u,x.hdrView),S=e.clouds?Vn.create(u,x.hdrView,p.depthView,s):null;u.pushInitErrorScope();const M=Zn.create(u);await u.popInitErrorScope("PointSpotShadowPass");const L=Jn.create(u,p,M,x.hdrView),A=zn.create(u,x,p),O=$n.create(u,p,A.historyView);x.updateSSGI(O.resultView),r.waterPass,m.updateRenderTargets(x.hdrTexture,x.hdrView,p.depthView,n);let T=null;const v=e.dof?(T=Yn.create(u,A.resolvedView,p.depthView),T.resultView):A.resolvedView;let C=null;const g=e.bloom?(C=Fn.create(u,v),C.resultView):v,G=On.create(u,g,p.depthView),b=wt.create(u,x.hdrTexture);b.enabled=e.auto_exp;const k=Wn.create(u,g,y.aoView,p.depthView,x.cameraBuffer,x.lightBuffer,b.exposureBuffer);k.depthFogEnabled=e.fog;const U=r.currentWeatherEffect??dt.None;let F=null;if(e.rain&&U!==dt.None){const Z=U===dt.Snow?Ml:Al;F=Qn.create(u,Z,p,x.hdrView)}const{RenderGraph:W}=await El(async()=>{const{RenderGraph:Z}=await import("./index-JBKpxALW.js");return{RenderGraph:Z}},[],import.meta.url),V=new W;return V.addPass(r.shadowPass),w&&V.addPass(w),V.addPass(h),V.addPass(M),V.addPass(_),V.addPass(f),V.addPass(y),V.addPass(O),S?V.addPass(S):V.addPass(P),V.addPass(x),V.addPass(L),V.addPass(m),B&&V.addPass(B),F&&V.addPass(F),V.addPass(A),T&&V.addPass(T),C&&V.addPass(C),V.addPass(G),V.addPass(b),V.addPass(k),{shadowPass:r.shadowPass,gbuffer:p,geometryPass:_,worldGeometryPass:f,worldShadowPass:h,waterPass:m,ssaoPass:y,ssgiPass:O,lightingPass:x,atmospherePass:P,pointSpotShadowPass:M,pointSpotLightPass:L,taaPass:A,dofPass:T,bloomPass:C,rainPass:F,godrayPass:B,cloudPass:S,cloudShadowPass:w,blockHighlightPass:G,autoExposurePass:b,compositePass:k,graph:V,prevViewProj:null,currentWeatherEffect:U}}function Do(u,r){let e=0,t=1;for(;u>0;)t/=r,e+=t*(u%r),u=Math.floor(u/r);return e}function Cl(u,r,e){const t=u.clone();for(let n=0;n<4;n++)t.data[n*4+0]+=r*t.data[n*4+3],t.data[n*4+1]+=e*t.data[n*4+3];return t}async function kl(){const u=document.getElementById("canvas");if(!u)throw new Error("No canvas element");const r=await wl(),e=r.playerName,t=r.mode==="network"?r.network:null,n=r.mode==="network"?r.welcome:null,o=r.mode==="local"?r.world:null,i=r.mode==="local"?r.storage:null;if(n!==null)console.log(`[crafty] connected as player ${n.playerId} "${e}" (${n.players.length} other(s) online, ${n.edits.length} replay edits)`);else if(o!==null){if((o.version??0)<1){let H=0;for(const ne of o.edits)ne.kind==="place"&&(ne.x-=ne.fx??0,ne.y-=ne.fy??0,ne.z-=ne.fz??0,H++);o.version=Kt,console.log(`[crafty] migrated saved world to v${Kt} (${H} place edits rewritten)`)}console.log(`[crafty] starting local world "${o.name}" (seed=${o.seed}, ${o.edits.length} edits to replay)`)}const a=await Cn.create(u,{enableErrorHandling:!1}),{device:s}=a,l=await gs(s,ms(await(await fetch(_i)).arrayBuffer())),d=await ps(s,l.gpuTexture),p=rs(s),f=await er.load(s,fn,gi,vi,bi),h=await Le.fromUrl(s,yi),m=await Le.fromUrl(s,xi),_=await Le.fromUrl(s,wi,{resizeWidth:256,resizeHeight:256,usage:7}),y=Ts(fn),w=Cs(),x=Us(u,w.reticle),B=(n==null?void 0:n.seed)??(o==null?void 0:o.seed)??13,P=new En(B);Ws()&&(P.renderDistanceH=4,P.renderDistanceV=3);const S=new Map,M=new Si,L=new me("Sun"),A=L.addComponent(new Ho(new D(.3,-1,.5),D.one(),6,3));M.add(L);const O=ks(u,M,P,a.width,a.height,_.gpuTexture,w.reticle,y.element),{cameraGO:T,camera:v,player:C,freeCamera:g}=O,G=Os();Vs(u,G,P,()=>y.getSelected(),M),Hs(u,{player:C,camera:g,getActive:()=>O.isPlayerMode()?"player":"camera",world:P,scene:M,blockInteraction:G,getSelectedBlock:()=>y.getSelected(),onLookDoubleTap:()=>O.toggleController(),onMenu:()=>x.open()},()=>{C.usePointerLock=!1,g.usePointerLock=!1});const b={...Pl},k=Nn.create(a,3);let U={shadowPass:k,currentWeatherEffect:dt.None};async function F(){U=await Ul(a,U,b,f,l,h,m,d,p,P,S),v.aspect=a.width/a.height}await F(),ol(P,M,{duckBody:vo(s),duckHead:bo(s),duckBill:yo(s),ducklingBody:vo(s,.5),ducklingHead:bo(s,.5),ducklingBill:yo(s,.5),pigBody:xo(s,1),pigHead:wo(s,1),pigSnout:Bo(s,1),babyPigBody:xo(s,.55),babyPigHead:wo(s,.55),babyPigSnout:Bo(s,.55)});const W=16,V=16,Z=16,se=(E,H,ne)=>`${Math.floor(E/W)},${Math.floor(H/V)},${Math.floor(ne/Z)}`,fe=new Map;function re(E){return E.kind==="place"?[E.x+(E.fx??0),E.y+(E.fy??0),E.z+(E.fz??0)]:[E.x,E.y,E.z]}function te(E,H){return!(H.kind==="break"&&E.kind==="place")}function X(E){const[H,ne,Ge]=re(E),ve=se(H,ne,Ge);let ye=fe.get(ve);ye===void 0&&(ye=[],fe.set(ve,ye));for(let Te=ye.length-1;Te>=0;Te--){const[Je,Qe,At]=re(ye[Te]);if(Je===H&&Qe===ne&&At===Ge){te(E,ye[Te])&&ye.splice(Te,1);break}}ye.push(E)}if(n!==null)for(const E of n.edits)X(E);if(o!==null)for(const E of o.edits)X(E);const J=P.onChunkAdded;P.onChunkAdded=(E,H)=>{J==null||J(E,H);const ne=`${Math.floor(E.globalPosition.x/W)},${Math.floor(E.globalPosition.y/V)},${Math.floor(E.globalPosition.z/Z)}`,Ge=fe.get(ne);if(Ge!==void 0)for(const ve of Ge)Po(ve.kind==="place"?{kind:"place",x:ve.x,y:ve.y,z:ve.z,fx:ve.fx??0,fy:ve.fy??0,fz:ve.fz??0,blockType:ve.blockType}:{kind:"break",x:ve.x,y:ve.y,z:ve.z},P,M)};const R=new Map,z=sl(s),K=new fl(u.parentElement??document.body),Q=new Map;function _e(E,H){if(R.has(E))return;const ne=new cl(E,H,M,z);R.set(E,ne),K.add(E,H),Q.set(E,new D)}function xe(E){const H=R.get(E);H!==void 0&&(H.dispose(),R.delete(E)),K.remove(E),Q.delete(E)}if(n!==null)for(const E of n.players)_e(E.playerId,E.name),R.get(E.playerId).setTargetTransform(E.x,E.y,E.z,E.yaw,E.pitch);t!==null?(t.setCallbacks({onPlayerJoin:(E,H)=>{console.log(`[crafty] +${H} (#${E})`),_e(E,H)},onPlayerLeave:E=>{console.log(`[crafty] -#${E}`),xe(E)},onPlayerTransform:(E,H,ne,Ge,ve,ye)=>{const Te=R.get(E);Te!==void 0&&Te.setTargetTransform(H,ne,Ge,ve,ye)},onBlockEdit:E=>{X(E),Po(E.kind==="place"?{kind:"place",x:E.x,y:E.y,z:E.z,fx:E.fx??0,fy:E.fy??0,fz:E.fz??0,blockType:E.blockType}:{kind:"break",x:E.x,y:E.y,z:E.z},P,M)}}),G.onLocalEdit=E=>{E.kind==="place"?(X({kind:"place",x:E.x,y:E.y,z:E.z,blockType:E.blockType,fx:E.fx,fy:E.fy,fz:E.fz}),t.sendBlockPlace(E.x,E.y,E.z,E.fx,E.fy,E.fz,E.blockType)):(X({kind:"break",x:E.x,y:E.y,z:E.z,blockType:0}),t.sendBlockBreak(E.x,E.y,E.z))}):o!==null&&(G.onLocalEdit=E=>{const H=E.kind==="place"?{kind:"place",x:E.x,y:E.y,z:E.z,blockType:E.blockType,fx:E.fx,fy:E.fy,fz:E.fz}:{kind:"break",x:E.x,y:E.y,z:E.z,blockType:0},[ne,Ge,ve]=re(H);for(let ye=o.edits.length-1;ye>=0;ye--){const[Te,Je,Qe]=re(o.edits[ye]);if(Te===ne&&Je===Ge&&Qe===ve){te(H,o.edits[ye])&&o.edits.splice(ye,1);break}}o.edits.push(H),X(H),ae=!0});let ae=!1;const q=(n==null?void 0:n.lastPosition)??(o!==null&&o.lastPlayedAt>o.createdAt?o.player:null);if(q!==null){T.position.set(q.x,q.y,q.z),C.yaw=q.yaw,C.pitch=q.pitch,C.velY=0;const E=P.chunksPerFrame;P.chunksPerFrame=200,P.update(new D(q.x,q.y,q.z),0),P.chunksPerFrame=E}else{const E=T.position.x,H=T.position.z,ne=P.chunksPerFrame;P.chunksPerFrame=200,P.update(new D(E,50,H),0),P.chunksPerFrame=ne;const Ge=P.getTopBlockY(E,H,200);Ge>0&&(T.position.y=Ge+1.62,C.velY=0)}const pe=document.createElement("div");pe.style.cssText="width:100%;height:1px;background:rgba(255,255,255,0.12)",x.card.appendChild(pe);const ge=As(x.card,fn,y.slots,()=>y.refresh(),y.getSelectedSlot,y.setSelectedSlot),Ue=document.createElement("div");Ue.style.cssText="width:100%;height:1px;background:rgba(255,255,255,0.12)",x.card.appendChild(Ue);const pt=document.createElement("div");pt.textContent="EFFECTS",pt.style.cssText="color:rgba(255,255,255,0.35);font-size:11px;letter-spacing:0.18em;align-self:flex-start",x.card.appendChild(pt),Ms(b,async E=>{if(E!=="ssao"&&E!=="ssgi"&&E!=="shadows"&&E!=="aces"&&E!=="ao_dbg"&&E!=="shd_dbg"){if(E==="chunk_dbg"){U.worldGeometryPass.setDebugChunks(b.chunk_dbg);return}if(E!=="hdr"){if(E==="auto_exp"){U.autoExposurePass.enabled=b.auto_exp;return}if(E==="fog"){U.compositePass.depthFogEnabled=b.fog;return}if(E==="rain"){await F();return}if(E==="clouds"){await F();return}await F()}}},x.card),y.setOnSelectionChanged(ge.refreshSlotHighlight);const ht=document.createElement("div");ht.textContent="ESC  ·  resume",ht.style.cssText="color:rgba(255,255,255,0.25);font-size:11px;letter-spacing:0.1em",x.card.appendChild(ht);const Ve=document.createElement("button");Ve.textContent="Save and Quit to Title",Ve.style.cssText=["padding:8px 28px","font-size:13px","font-family:ui-monospace,monospace","background: #3a1a1a","color:#f88","border:1px solid #f88","border-radius:6px","cursor:pointer","letter-spacing:0.06em","transition:background 0.15s"].join(";"),Ve.addEventListener("mouseenter",()=>{Ve.style.background="#4a2424"}),Ve.addEventListener("mouseleave",()=>{Ve.style.background="#3a1a1a"});const rr=()=>{document.pointerLockElement===u&&document.exitPointerLock(),location.reload()};Ve.addEventListener("click",rr),Ve.addEventListener("touchend",E=>{E.preventDefault(),rr()},{passive:!1}),x.card.insertBefore(Ve,x.card.children[2]),new ResizeObserver(async()=>{const E=Math.max(1,Math.round(u.clientWidth*devicePixelRatio)),H=Math.max(1,Math.round(u.clientHeight*devicePixelRatio));E===u.width&&H===u.height||(u.width=E,u.height=H,await F())}).observe(u);let or=0,on=0,ir=-1/0,Ke=(n==null?void 0:n.sunAngle)??(o==null?void 0:o.sunAngle)??Math.PI*.3,an=0,ar=0,sr=0,lr=0,Gt=mo(P.getBiomeAt(T.position.x,T.position.y,T.position.z));const cr=ho(P.getBiomeAt(T.position.x,T.position.y,T.position.z));let sn=cr.cloudBase,ln=cr.cloudTop;const cn=new al,Tt=new D(0,0,-1),Et=new oe([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),ti=5e3,ni=3e4,ur=.5,ri=.005;let dr=performance.now(),fr=-1/0,pr=T.position.x,hr=T.position.y,mr=T.position.z,_r=Ke,un=!1;async function oi(){try{const E=await createImageBitmap(u,{resizeWidth:160,resizeHeight:90,resizeQuality:"medium"}),H=new OffscreenCanvas(160,90),ne=H.getContext("2d");return ne===null?null:(ne.drawImage(E,0,0),await H.convertToBlob({type:"image/jpeg",quality:.7}))}catch(E){return console.warn("[crafty] screenshot capture failed",E),null}}function gr(E){if(o===null||i===null||un)return;o.player.x=T.position.x,o.player.y=T.position.y,o.player.z=T.position.z,o.player.yaw=C.yaw,o.player.pitch=C.pitch,o.sunAngle=Ke,o.lastPlayedAt=Date.now(),o.version=Kt,pr=T.position.x,hr=T.position.y,mr=T.position.z,_r=Ke,ae=!1,un=!0;const H=()=>{i.save(o).catch(ne=>{console.error("[crafty] save failed",ne)}).finally(()=>{un=!1})};E?oi().then(ne=>{ne!==null&&(o.screenshot=ne),fr=performance.now(),H()}):H()}if(o!==null&&i!==null){const E=()=>{ae&&gr(!1)};window.addEventListener("beforeunload",E),window.addEventListener("pagehide",E),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&E()})}async function vr(E){var Cr,kr;a.pushPassErrorScope("frame");const H=Math.min((E-or)/1e3,.1);or=E;const ne=E-ir>=1e3;ne&&(ir=E),H>0&&(on+=(1/H-on)*.1),Ke+=H*.01,an+=H,sr+=H*1.5,lr+=H*.5;const Ge=Math.sin(Ke),ve=.25,ye=-Ge,Te=Math.cos(Ke),Je=Math.sqrt(ve*ve+ye*ye+Te*Te);A.direction.set(ve/Je,ye/Je,Te/Je);const Qe=Ge;A.intensity=Math.max(0,Qe)*6;const At=Math.max(0,Qe);A.color.set(1,.8+.2*At,.6+.4*At),O.isPlayerMode()?C.update(T,H):g.update(T,H),Ls(E/1e3),Ns(E/1e3);const $=v.position();ft.playerPos.x=$.x,ft.playerPos.y=$.y,ft.playerPos.z=$.z,t!==null&&t.connected&&t.sendTransform($.x,$.y,$.z,C.yaw,C.pitch);for(const we of R.values())we.update(H);M.update(H),P.update($,H);const Mt=P.getBiomeAt($.x,$.y,$.z),br=vs(Mt);br!==U.currentWeatherEffect&&(U.currentWeatherEffect=br,await F());const ii=mo(Mt);Gt+=(ii-Gt)*Math.min(1,.3*H);const yr=ho(Mt);if(sn+=(yr.cloudBase-sn)*Math.min(1,.3*H),ln+=(yr.cloudTop-ln)*Math.min(1,.3*H),ne){w.fps.textContent=`${on.toFixed(0)} fps`;const we=(U.worldGeometryPass.triangles/1e3).toFixed(1);w.stats.textContent=`${U.worldGeometryPass.drawCalls} draws  ${we}k tris
${P.chunkCount} chunks  ${P.pendingChunks} pending`,w.biome.textContent=`${Ae[Mt]}  coverage:${Gt.toFixed(2)}`,w.pos.textContent=`X: ${$.x.toFixed(1)}  Y: ${$.y.toFixed(1)}  Z: ${$.z.toFixed(1)}`}const xr=ar%16+1,ai=(Do(xr,2)-.5)*(2/a.width),si=(Do(xr,3)-.5)*(2/a.height),Ne=v.viewProjectionMatrix(),wr=Cl(Ne,ai,si),Fe=v.viewMatrix(),De=v.projectionMatrix(),Re=Ne.invert(),Br=De.invert(),Sr=A.computeCascadeMatrices(v,128),Pr=M.collectMeshRenderers(),li=Pr.map(we=>{const et=we.gameObject.localToWorld();return{mesh:we.mesh,modelMatrix:et,normalMatrix:et.normalMatrix(),material:we.material}}),Gr=Pr.filter(we=>we.castShadow).map(we=>({mesh:we.mesh,modelMatrix:we.gameObject.localToWorld()}));k.setSceneSnapshot(Gr),k.updateScene(M,v,A,128),U.worldShadowPass.enabled=A.intensity>0,U.worldShadowPass.update(a,Sr,$.x,$.z);const Ut=Math.max(0,Qe),ci=[.02+.38*Ut,.03+.52*Ut,.05+.65*Ut],Tr={cloudBase:sn,cloudTop:ln,coverage:Gt,density:4,windOffset:[sr,lr],anisotropy:.85,extinction:.25,ambientColor:ci,exposure:1};U.cloudShadowPass&&U.cloudShadowPass.update(a,Tr,[$.x,$.z],128),U.cloudPass&&(U.cloudPass.updateCamera(a,Re,$,v.near,v.far),U.cloudPass.updateLight(a,A.direction,A.color,A.intensity),U.cloudPass.updateSettings(a,Tr));const Er=M.getComponents(Un),Ar=M.getComponents(Wo);U.pointSpotShadowPass.update(Er,Ar,Gr),U.pointSpotLightPass.updateCamera(a,Fe,De,Ne,Re,$,v.near,v.far),U.pointSpotLightPass.updateLights(a,Er,Ar),U.atmospherePass.update(a,Re,$,A.direction),U.geometryPass.setDrawItems(li),U.geometryPass.updateCamera(a,Fe,De,wr,Re,$,v.near,v.far),U.worldGeometryPass.updateCamera(a,Fe,De,wr,Re,$,v.near,v.far),U.waterPass.updateCamera(a,Fe,De,Ne,Re,$,v.near,v.far),U.waterPass.updateTime(a,an,Math.max(.01,Ut)),U.lightingPass.updateCamera(a,Fe,De,Ne,Re,$,v.near,v.far),U.lightingPass.updateLight(a,A.direction,A.color,A.intensity,Sr,b.shadows,b.shd_dbg),U.lightingPass.updateCloudShadow(a,U.cloudShadowPass?$.x:0,U.cloudShadowPass?$.z:0,128),U.ssaoPass.updateCamera(a,Fe,De,Br),U.ssaoPass.updateParams(a,1,.005,b.ssao?2:0),U.ssgiPass.enabled=b.ssgi,U.ssgiPass.updateSettings({strength:b.ssgi?1:0}),b.ssgi&&U.ssgiPass.updateCamera(a,Fe,De,Br,Re,U.prevViewProj??Ne,$);const Mr=Math.cos(C.pitch);Tt.x=-Math.sin(C.yaw)*Mr,Tt.y=-Math.sin(C.pitch),Tt.z=-Math.cos(C.yaw)*Mr;const Ct=P.getBlockByRay($,Tt,16),Ur=!!(Ct&&Ct.position.sub($).length()<=6);G.targetBlock=Ur?Ct.position:null,G.targetHit=Ur?Ct:null;const ui=G.targetBlock&&!ue(P.getBlockType(G.targetBlock.x,G.targetBlock.y,G.targetBlock.z))?G.targetBlock:null;if(U.blockHighlightPass.update(a,Ne,ui),Ds(E,u,G,P,()=>y.getSelected(),M),U.rainPass){cn.update($.x,$.z,P),U.rainPass.updateHeightmap(a,cn.data,$.x,$.z,cn.extent);const we=U.currentWeatherEffect===dt.Snow?20:8;Et.data[12]=$.x,Et.data[13]=$.y+we,Et.data[14]=$.z,U.rainPass.update(a,H,Fe,De,Ne,Re,$,v.near,v.far,Et)}(Cr=U.dofPass)==null||Cr.updateParams(a,8,75,3,v.near,v.far),(kr=U.godrayPass)==null||kr.updateParams(a);const di=ue(P.getBlockType(Math.floor($.x),Math.floor($.y),Math.floor($.z))),fi={x:-A.direction.x,y:-A.direction.y,z:-A.direction.z};if(U.compositePass.updateParams(a,di,an,b.aces,b.ao_dbg,b.hdr),U.compositePass.updateStars(a,Re,$,fi),U.autoExposurePass.update(a,H),U.taaPass.updateCamera(a,Re,U.prevViewProj??Ne),R.size>0){for(const[we,et]of R){const mt=Q.get(we);mt!==void 0&&et.headWorldPosition(mt)}K.update(Ne,$,u.clientWidth,u.clientHeight,Q)}if(U.prevViewProj=Ne,ar++,await U.graph.execute(a),await a.popPassErrorScope("frame"),o!==null&&i!==null){const we=T.position.x-pr,et=T.position.y-hr,mt=T.position.z-mr;we*we+et*et+mt*mt>ur*ur&&(ae=!0),Math.abs(Ke-_r)>ri&&(ae=!0);const dn=performance.now();if(ae&&dn-dr>=ti){dr=dn;const pi=dn-fr>=ni;gr(pi)}}requestAnimationFrame(vr)}requestAnimationFrame(vr)}kl().catch(u=>{document.body.innerHTML=`<pre style="color:red;padding:1rem">${u}</pre>`,console.error(u)});export{In as A,On as B,Vn as C,Yn as D,Jt as G,Rn as L,Qn as P,Cn as R,Xn as S,zn as T,rt as W,wt as a,Fn as b,Dn as c,Wn as d,jn as e,Hn as f,Jn as g,Zn as h,be as i,$n as j,Nn as k,qn as l,Kn as m};
