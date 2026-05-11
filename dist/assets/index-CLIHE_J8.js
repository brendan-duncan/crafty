var Vi=Object.defineProperty;var zi=(u,r,e)=>r in u?Vi(u,r,{enumerable:!0,configurable:!0,writable:!0,value:e}):u[r]=e;var s=(u,r,e)=>zi(u,typeof r!="symbol"?r+"":r,e);(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))t(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&t(i)}).observe(document,{childList:!0,subtree:!0});function e(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function t(n){if(n.ep)return;n.ep=!0;const o=e(n);fetch(n.href,o)}})();const Fi=""+new URL("clear_sky-CyjsjiVR.hdr",import.meta.url).href,Sr=""+new URL("simple_block_atlas-B-7juoTN.png",import.meta.url).href,Hi=""+new URL("simple_block_atlas_normal-BdCvGD-K.png",import.meta.url).href,Wi=""+new URL("simple_block_atlas_mer-C_Oa_Ink.png",import.meta.url).href,ji=""+new URL("simple_block_atlas_heightmap-BOV6qQJl.png",import.meta.url).href,qi=""+new URL("waterDUDV-CGfbcllR.png",import.meta.url).href,Yi="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAgCAYAAADaInAlAAAA4klEQVR4Ae2UQQ4CIRAEGeAvnn2H/3+PDqBuXLnvoYqEAMvApptKx+3+eJYrW0QpNXvUNdYc57exrjkd+/u9o+58/r8+xj+yr/t+5/G+/7P3rc361lr2Onvva5zrzbyPun7Un+v259uUcdUTpFM2sgMCQH791C4AAgB3AC7fBBAAuANw+SaAAMAdgMs3AQQA7gBcvgkgAHAH4PJNAAGAOwCXbwIIANwBuHwTQADgDsDlmwACAHcALt8EEAC4A3D5JoAAwB2AyzcBBADuAFy+CSAAcAfg8k0AAYA7AJdvAsABeAEiUwM8dIJUQAAAAABJRU5ErkJggg==",Xi=""+new URL("flashlight-C64SqrUS.jpg",import.meta.url).href;class V{constructor(r=0,e=0){s(this,"x");s(this,"y");this.x=r,this.y=e}set(r,e){return this.x=r,this.y=e,this}clone(){return new V(this.x,this.y)}add(r){return new V(this.x+r.x,this.y+r.y)}sub(r){return new V(this.x-r.x,this.y-r.y)}scale(r){return new V(this.x*r,this.y*r)}dot(r){return this.x*r.x+this.y*r.y}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.lengthSq())}normalize(){const r=this.length();return r>0?this.scale(1/r):new V}toArray(){return[this.x,this.y]}static zero(){return new V(0,0)}static one(){return new V(1,1)}}const re=class re{constructor(r=0,e=0,t=0){s(this,"x");s(this,"y");s(this,"z");this.x=r,this.y=e,this.z=t}set(r,e,t){return this.x=r,this.y=e,this.z=t,this}clone(){return new re(this.x,this.y,this.z)}negate(){return new re(-this.x,-this.y,-this.z)}add(r){return new re(this.x+r.x,this.y+r.y,this.z+r.z)}sub(r){return new re(this.x-r.x,this.y-r.y,this.z-r.z)}scale(r){return new re(this.x*r,this.y*r,this.z*r)}mul(r){return new re(this.x*r.x,this.y*r.y,this.z*r.z)}dot(r){return this.x*r.x+this.y*r.y+this.z*r.z}cross(r){return new re(this.y*r.z-this.z*r.y,this.z*r.x-this.x*r.z,this.x*r.y-this.y*r.x)}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.lengthSq())}normalize(){const r=this.length();return r>0?this.scale(1/r):new re}lerp(r,e){return new re(this.x+(r.x-this.x)*e,this.y+(r.y-this.y)*e,this.z+(r.z-this.z)*e)}toArray(){return[this.x,this.y,this.z]}static zero(){return new re(0,0,0)}static one(){return new re(1,1,1)}static up(){return new re(0,1,0)}static down(){return new re(0,-1,0)}static forward(){return new re(0,0,-1)}static backward(){return new re(0,0,1)}static right(){return new re(1,0,0)}static left(){return new re(-1,0,0)}static fromArray(r,e=0){return new re(r[e],r[e+1],r[e+2])}};s(re,"ZERO",new re(0,0,0)),s(re,"ONE",new re(1,1,1)),s(re,"UP",new re(0,1,0)),s(re,"DOWN",new re(0,-1,0)),s(re,"FORWARD",new re(0,0,-1)),s(re,"BACKWARD",new re(0,0,1)),s(re,"RIGHT",new re(1,0,0)),s(re,"LEFT",new re(-1,0,0));let j=re;class ze{constructor(r=0,e=0,t=0,n=0){s(this,"x");s(this,"y");s(this,"z");s(this,"w");this.x=r,this.y=e,this.z=t,this.w=n}set(r,e,t,n){return this.x=r,this.y=e,this.z=t,this.w=n,this}clone(){return new ze(this.x,this.y,this.z,this.w)}add(r){return new ze(this.x+r.x,this.y+r.y,this.z+r.z,this.w+r.w)}sub(r){return new ze(this.x-r.x,this.y-r.y,this.z-r.z,this.w-r.w)}scale(r){return new ze(this.x*r,this.y*r,this.z*r,this.w*r)}dot(r){return this.x*r.x+this.y*r.y+this.z*r.z+this.w*r.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.lengthSq())}toArray(){return[this.x,this.y,this.z,this.w]}static zero(){return new ze(0,0,0,0)}static one(){return new ze(1,1,1,1)}static fromArray(r,e=0){return new ze(r[e],r[e+1],r[e+2],r[e+3])}}class se{constructor(r){s(this,"data");this.data=new Float32Array(16),r&&this.data.set(r)}clone(){return new se(this.data)}get(r,e){return this.data[r*4+e]}set(r,e,t){this.data[r*4+e]=t}multiply(r){const e=this.data,t=r.data,n=new Float32Array(16);for(let o=0;o<4;o++)for(let i=0;i<4;i++)n[o*4+i]=e[0*4+i]*t[o*4+0]+e[1*4+i]*t[o*4+1]+e[2*4+i]*t[o*4+2]+e[3*4+i]*t[o*4+3];return new se(n)}transformPoint(r){const e=this.data,t=e[0]*r.x+e[4]*r.y+e[8]*r.z+e[12],n=e[1]*r.x+e[5]*r.y+e[9]*r.z+e[13],o=e[2]*r.x+e[6]*r.y+e[10]*r.z+e[14],i=e[3]*r.x+e[7]*r.y+e[11]*r.z+e[15];return new j(t/i,n/i,o/i)}transformDirection(r){const e=this.data;return new j(e[0]*r.x+e[4]*r.y+e[8]*r.z,e[1]*r.x+e[5]*r.y+e[9]*r.z,e[2]*r.x+e[6]*r.y+e[10]*r.z)}transformVec4(r){const e=this.data;return new ze(e[0]*r.x+e[4]*r.y+e[8]*r.z+e[12]*r.w,e[1]*r.x+e[5]*r.y+e[9]*r.z+e[13]*r.w,e[2]*r.x+e[6]*r.y+e[10]*r.z+e[14]*r.w,e[3]*r.x+e[7]*r.y+e[11]*r.z+e[15]*r.w)}transpose(){const r=this.data;return new se([r[0],r[4],r[8],r[12],r[1],r[5],r[9],r[13],r[2],r[6],r[10],r[14],r[3],r[7],r[11],r[15]])}invert(){const r=this.data,e=new Float32Array(16),t=r[0],n=r[1],o=r[2],i=r[3],a=r[4],l=r[5],c=r[6],d=r[7],f=r[8],p=r[9],h=r[10],_=r[11],m=r[12],b=r[13],v=r[14],y=r[15],w=t*l-n*a,S=t*c-o*a,x=t*d-i*a,k=n*c-o*l,C=n*d-i*l,E=o*d-i*c,I=f*b-p*m,U=f*v-h*m,g=f*y-_*m,A=p*v-h*b,P=p*y-_*b,T=h*y-_*v;let B=w*T-S*P+x*A+k*g-C*U+E*I;return B===0?se.identity():(B=1/B,e[0]=(l*T-c*P+d*A)*B,e[1]=(o*P-n*T-i*A)*B,e[2]=(b*E-v*C+y*k)*B,e[3]=(h*C-p*E-_*k)*B,e[4]=(c*g-a*T-d*U)*B,e[5]=(t*T-o*g+i*U)*B,e[6]=(v*x-m*E-y*S)*B,e[7]=(f*E-h*x+_*S)*B,e[8]=(a*P-l*g+d*I)*B,e[9]=(n*g-t*P-i*I)*B,e[10]=(m*C-b*x+y*w)*B,e[11]=(p*x-f*C-_*w)*B,e[12]=(l*U-a*A-c*I)*B,e[13]=(t*A-n*U+o*I)*B,e[14]=(b*S-m*k-v*w)*B,e[15]=(f*k-p*S+h*w)*B,new se(e))}normalMatrix(){const r=this.data,e=r[0],t=r[1],n=r[2],o=r[4],i=r[5],a=r[6],l=r[8],c=r[9],d=r[10],f=d*i-a*c,p=-d*o+a*l,h=c*o-i*l;let _=e*f+t*p+n*h;if(_===0)return se.identity();_=1/_;const m=new Float32Array(16);return m[0]=f*_,m[4]=(-d*t+n*c)*_,m[8]=(a*t-n*i)*_,m[1]=p*_,m[5]=(d*e-n*l)*_,m[9]=(-a*e+n*o)*_,m[2]=h*_,m[6]=(-c*e+t*l)*_,m[10]=(i*e-t*o)*_,m[15]=1,new se(m)}static identity(){return new se([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}static translation(r,e,t){return new se([1,0,0,0,0,1,0,0,0,0,1,0,r,e,t,1])}static scale(r,e,t){return new se([r,0,0,0,0,e,0,0,0,0,t,0,0,0,0,1])}static rotationX(r){const e=Math.cos(r),t=Math.sin(r);return new se([1,0,0,0,0,e,t,0,0,-t,e,0,0,0,0,1])}static rotationY(r){const e=Math.cos(r),t=Math.sin(r);return new se([e,0,-t,0,0,1,0,0,t,0,e,0,0,0,0,1])}static rotationZ(r){const e=Math.cos(r),t=Math.sin(r);return new se([e,t,0,0,-t,e,0,0,0,0,1,0,0,0,0,1])}static fromQuaternion(r,e,t,n){const o=r+r,i=e+e,a=t+t,l=r*o,c=e*o,d=e*i,f=t*o,p=t*i,h=t*a,_=n*o,m=n*i,b=n*a;return new se([1-d-h,c+b,f-m,0,c-b,1-l-h,p+_,0,f+m,p-_,1-l-d,0,0,0,0,1])}static perspective(r,e,t,n){const o=1/Math.tan(r/2),i=1/(t-n);return new se([o/e,0,0,0,0,o,0,0,0,0,n*i,-1,0,0,n*t*i,0])}static orthographic(r,e,t,n,o,i){const a=1/(r-e),l=1/(t-n),c=1/(o-i);return new se([-2*a,0,0,0,0,-2*l,0,0,0,0,c,0,(r+e)*a,(n+t)*l,o*c,1])}static lookAt(r,e,t){const n=e.sub(r).normalize(),o=n.cross(t).normalize(),i=o.cross(n);return new se([o.x,i.x,-n.x,0,o.y,i.y,-n.y,0,o.z,i.z,-n.z,0,-o.dot(r),-i.dot(r),n.dot(r),1])}static trs(r,e,t,n,o,i){const l=se.fromQuaternion(e,t,n,o).data;return new se([i.x*l[0],i.x*l[1],i.x*l[2],0,i.y*l[4],i.y*l[5],i.y*l[6],0,i.z*l[8],i.z*l[9],i.z*l[10],0,r.x,r.y,r.z,1])}}class me{constructor(r=0,e=0,t=0,n=1){s(this,"x");s(this,"y");s(this,"z");s(this,"w");this.x=r,this.y=e,this.z=t,this.w=n}clone(){return new me(this.x,this.y,this.z,this.w)}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.lengthSq())}normalize(){const r=this.length();return r>0?new me(this.x/r,this.y/r,this.z/r,this.w/r):me.identity()}conjugate(){return new me(-this.x,-this.y,-this.z,this.w)}multiply(r){const e=this.x,t=this.y,n=this.z,o=this.w,i=r.x,a=r.y,l=r.z,c=r.w;return new me(o*i+e*c+t*l-n*a,o*a-e*l+t*c+n*i,o*l+e*a-t*i+n*c,o*c-e*i-t*a-n*l)}rotateVec3(r){const e=this.x,t=this.y,n=this.z,o=this.w,i=o*r.x+t*r.z-n*r.y,a=o*r.y+n*r.x-e*r.z,l=o*r.z+e*r.y-t*r.x,c=-e*r.x-t*r.y-n*r.z;return new j(i*o+c*-e+a*-n-l*-t,a*o+c*-t+l*-e-i*-n,l*o+c*-n+i*-t-a*-e)}toMat4(){return se.fromQuaternion(this.x,this.y,this.z,this.w)}slerp(r,e){let t=this.x*r.x+this.y*r.y+this.z*r.z+this.w*r.w,n=r.x,o=r.y,i=r.z,a=r.w;if(t<0&&(t=-t,n=-n,o=-o,i=-i,a=-a),t>=1)return this.clone();const l=Math.acos(t),c=Math.sqrt(1-t*t);if(Math.abs(c)<.001)return new me(this.x*.5+n*.5,this.y*.5+o*.5,this.z*.5+i*.5,this.w*.5+a*.5);const d=Math.sin((1-e)*l)/c,f=Math.sin(e*l)/c;return new me(this.x*d+n*f,this.y*d+o*f,this.z*d+i*f,this.w*d+a*f)}static identity(){return new me(0,0,0,1)}static fromAxisAngle(r,e){const t=Math.sin(e/2),n=r.normalize();return new me(n.x*t,n.y*t,n.z*t,Math.cos(e/2))}static fromEuler(r,e,t){const n=Math.cos(r/2),o=Math.sin(r/2),i=Math.cos(e/2),a=Math.sin(e/2),l=Math.cos(t/2),c=Math.sin(t/2);return new me(o*i*l+n*a*c,n*a*l-o*i*c,n*i*c+o*a*l,n*i*l-o*a*c)}}const _t=new Uint8Array([23,125,161,52,103,117,70,37,247,101,203,169,124,126,44,123,152,238,145,45,171,114,253,10,192,136,4,157,249,30,35,72,175,63,77,90,181,16,96,111,133,104,75,162,93,56,66,240,8,50,84,229,49,210,173,239,141,1,87,18,2,198,143,57,225,160,58,217,168,206,245,204,199,6,73,60,20,230,211,233,94,200,88,9,74,155,33,15,219,130,226,202,83,236,42,172,165,218,55,222,46,107,98,154,109,67,196,178,127,158,13,243,65,79,166,248,25,224,115,80,68,51,184,128,232,208,151,122,26,212,105,43,179,213,235,148,146,89,14,195,28,78,112,76,250,47,24,251,140,108,186,190,228,170,183,139,39,188,244,246,132,48,119,144,180,138,134,193,82,182,120,121,86,220,209,3,91,241,149,85,205,150,113,216,31,100,41,164,177,214,153,231,38,71,185,174,97,201,29,95,7,92,54,254,191,118,34,221,131,11,163,99,234,81,227,147,156,176,17,142,69,12,110,62,27,255,0,194,59,116,242,252,19,21,187,53,207,129,64,135,61,40,167,237,102,223,106,159,197,189,215,137,36,32,22,5,23,125,161,52,103,117,70,37,247,101,203,169,124,126,44,123,152,238,145,45,171,114,253,10,192,136,4,157,249,30,35,72,175,63,77,90,181,16,96,111,133,104,75,162,93,56,66,240,8,50,84,229,49,210,173,239,141,1,87,18,2,198,143,57,225,160,58,217,168,206,245,204,199,6,73,60,20,230,211,233,94,200,88,9,74,155,33,15,219,130,226,202,83,236,42,172,165,218,55,222,46,107,98,154,109,67,196,178,127,158,13,243,65,79,166,248,25,224,115,80,68,51,184,128,232,208,151,122,26,212,105,43,179,213,235,148,146,89,14,195,28,78,112,76,250,47,24,251,140,108,186,190,228,170,183,139,39,188,244,246,132,48,119,144,180,138,134,193,82,182,120,121,86,220,209,3,91,241,149,85,205,150,113,216,31,100,41,164,177,214,153,231,38,71,185,174,97,201,29,95,7,92,54,254,191,118,34,221,131,11,163,99,234,81,227,147,156,176,17,142,69,12,110,62,27,255,0,194,59,116,242,252,19,21,187,53,207,129,64,135,61,40,167,237,102,223,106,159,197,189,215,137,36,32,22,5]),Je=new Uint8Array([7,9,5,0,11,1,6,9,3,9,11,1,8,10,4,7,8,6,1,5,3,10,9,10,0,8,4,1,5,2,7,8,7,11,9,10,1,0,4,7,5,0,11,6,1,4,2,8,8,10,4,9,9,2,5,7,9,1,7,2,2,6,11,5,5,4,6,9,0,1,1,0,7,6,9,8,4,10,3,1,2,8,8,9,10,11,5,11,11,2,6,10,3,4,2,4,9,10,3,2,6,3,6,10,5,3,4,10,11,2,9,11,1,11,10,4,9,4,11,0,4,11,4,0,0,0,7,6,10,4,1,3,11,5,3,4,2,9,1,3,0,1,8,0,6,7,8,7,0,4,6,10,8,2,3,11,11,8,0,2,4,8,3,0,0,10,6,1,2,2,4,5,6,0,1,3,11,9,5,5,9,6,9,8,3,8,1,8,9,6,9,11,10,7,5,6,5,9,1,3,7,0,2,10,11,2,6,1,3,11,7,7,2,1,7,3,0,8,1,1,5,0,6,10,11,11,0,2,7,0,10,8,3,5,7,1,11,1,0,7,9,0,11,5,10,3,2,3,5,9,7,9,8,4,6,5,7,9,5,0,11,1,6,9,3,9,11,1,8,10,4,7,8,6,1,5,3,10,9,10,0,8,4,1,5,2,7,8,7,11,9,10,1,0,4,7,5,0,11,6,1,4,2,8,8,10,4,9,9,2,5,7,9,1,7,2,2,6,11,5,5,4,6,9,0,1,1,0,7,6,9,8,4,10,3,1,2,8,8,9,10,11,5,11,11,2,6,10,3,4,2,4,9,10,3,2,6,3,6,10,5,3,4,10,11,2,9,11,1,11,10,4,9,4,11,0,4,11,4,0,0,0,7,6,10,4,1,3,11,5,3,4,2,9,1,3,0,1,8,0,6,7,8,7,0,4,6,10,8,2,3,11,11,8,0,2,4,8,3,0,0,10,6,1,2,2,4,5,6,0,1,3,11,9,5,5,9,6,9,8,3,8,1,8,9,6,9,11,10,7,5,6,5,9,1,3,7,0,2,10,11,2,6,1,3,11,7,7,2,1,7,3,0,8,1,1,5,0,6,10,11,11,0,2,7,0,10,8,3,5,7,1,11,1,0,7,9,0,11,5,10,3,2,3,5,9,7,9,8,4,6,5]),Pr=new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]);function Gr(u){const r=u|0;return u<r?r-1:r}function Qe(u,r,e,t){const n=u*3;return Pr[n]*r+Pr[n+1]*e+Pr[n+2]*t}function Tr(u){return((u*6-15)*u+10)*u*u*u}function Hr(u,r,e,t,n,o,i){const a=t-1&255,l=n-1&255,c=o-1&255,d=Gr(u),f=Gr(r),p=Gr(e),h=d&a,_=d+1&a,m=f&l,b=f+1&l,v=p&c,y=p+1&c,w=u-d,S=Tr(w),x=r-f,k=Tr(x),C=e-p,E=Tr(C),I=_t[h+i],U=_t[_+i],g=_t[I+m],A=_t[I+b],P=_t[U+m],T=_t[U+b],B=Qe(Je[g+v],w,x,C),N=Qe(Je[g+y],w,x,C-1),G=Qe(Je[A+v],w,x-1,C),q=Qe(Je[A+y],w,x-1,C-1),O=Qe(Je[P+v],w-1,x,C),L=Qe(Je[P+y],w-1,x,C-1),F=Qe(Je[T+v],w-1,x-1,C),z=Qe(Je[T+y],w-1,x-1,C-1),ae=B+(N-B)*E,oe=G+(q-G)*E,ie=O+(L-O)*E,K=F+(z-F)*E,ee=ae+(oe-ae)*k,D=ie+(K-ie)*k;return ee+(D-ee)*S}function Ce(u,r,e,t,n,o,i){return Hr(u,r,e,t,n,o,i&255)}function ci(u,r,e,t,n,o,i){let a=1,l=1,c=.5,d=0;for(let f=0;f<i;f++){let p=Hr(u*a,r*a,e*a,0,0,0,f&255);p=o-Math.abs(p),p=p*p,d+=p*c*l,l=p,a*=t,c*=n}return d}function Kn(u,r,e,t,n,o){let i=1,a=1,l=0;for(let c=0;c<o;c++)l+=Math.abs(Hr(u*i,r*i,e*i,0,0,0,c&255)*a),i*=t,a*=n;return l}const lr=class lr extends Uint32Array{constructor(e){super(6);s(this,"_seed");this._seed=0,this.seed=e??Date.now()}get seed(){return this[0]}set seed(e){this._seed=e,this[0]=e,this[1]=this[0]*1812433253+1>>>0,this[2]=this[1]*1812433253+1>>>0,this[3]=this[2]*1812433253+1>>>0,this[4]=0,this[5]=0}reset(){this.seed=this._seed}randomUint32(){let e=this[3];const t=this[0];return this[3]=this[2],this[2]=this[1],this[1]=t,e^=e>>>2,e^=e<<1,e^=t^t<<4,this[0]=e,this[4]=this[4]+362437>>>0,this[5]=e+this[4]>>>0,this[5]}randomFloat(e,t){const n=(this.randomUint32()&8388607)*11920930376163766e-23;return e===void 0?n:n*((t??1)-e)+e}randomDouble(e,t){const n=this.randomUint32()>>>5,o=this.randomUint32()>>>6,i=(n*67108864+o)*(1/9007199254740992);return e===void 0?i:i*((t??1)-e)+e}};s(lr,"global",new lr);let Ee=lr;class it{constructor(){s(this,"gameObject")}onAttach(){}onDetach(){}update(r){}}class be{constructor(r="GameObject"){s(this,"name");s(this,"position");s(this,"rotation");s(this,"scale");s(this,"children",[]);s(this,"parent",null);s(this,"_components",[]);this.name=r,this.position=j.zero(),this.rotation=me.identity(),this.scale=j.one()}addComponent(r){return r.gameObject=this,this._components.push(r),r.onAttach(),r}getComponent(r){for(const e of this._components)if(e instanceof r)return e;return null}getComponents(r){return this._components.filter(e=>e instanceof r)}removeComponent(r){const e=this._components.indexOf(r);e!==-1&&(r.onDetach(),this._components.splice(e,1))}addChild(r){r.parent=this,this.children.push(r)}localToWorld(){const r=se.trs(this.position,this.rotation.x,this.rotation.y,this.rotation.z,this.rotation.w,this.scale);return this.parent?this.parent.localToWorld().multiply(r):r}update(r){for(const e of this._components)e.update(r);for(const e of this.children)e.update(r)}}class ui extends it{constructor(e=60,t=.1,n=1e3,o=16/9){super();s(this,"fov");s(this,"near");s(this,"far");s(this,"aspect");this.fov=e*(Math.PI/180),this.near=t,this.far=n,this.aspect=o}projectionMatrix(){return se.perspective(this.fov,this.aspect,this.near,this.far)}viewMatrix(){return this.gameObject.localToWorld().invert()}viewProjectionMatrix(){return this.projectionMatrix().multiply(this.viewMatrix())}position(){const e=this.gameObject.localToWorld();return new j(e.data[12],e.data[13],e.data[14])}frustumCornersWorld(){const e=this.viewProjectionMatrix().invert();return[[-1,-1,0],[1,-1,0],[-1,1,0],[1,1,0],[-1,-1,1],[1,-1,1],[-1,1,1],[1,1,1]].map(([n,o,i])=>e.transformPoint(new j(n,o,i)))}}class di extends it{constructor(e=new j(.3,-1,.5),t=j.one(),n=1,o=3){super();s(this,"direction");s(this,"color");s(this,"intensity");s(this,"numCascades");this.direction=e.normalize(),this.color=t,this.intensity=n,this.numCascades=o}computeCascadeMatrices(e,t){const n=t??e.far,o=this._computeSplitDepths(e.near,n,this.numCascades),i=[];for(let a=0;a<this.numCascades;a++){const l=a===0?e.near:o[a-1],c=o[a],d=this._frustumCornersForSplit(e,l,c),f=d.reduce((P,T)=>P.add(T),j.ZERO).scale(1/8),p=this.direction.normalize(),h=se.lookAt(f.sub(p),f,j.UP),_=2048;let m=0;for(const P of d)m=Math.max(m,P.sub(f).length());let b=2*m/_;m=Math.ceil(m/b)*b,m*=_/(_-2),b=2*m/_;let v=1/0,y=-1/0;for(const P of d){const T=h.transformPoint(P);v=Math.min(v,T.z),y=Math.max(y,T.z)}const w=Math.min((y-v)*.25,64);v-=w,y+=w;let S=se.orthographic(-m,m,-m,m,-y,-v);const k=S.multiply(h).transformPoint(f),C=k.x*.5+.5,E=.5-k.y*.5,I=Math.round(C*_)/_,U=Math.round(E*_)/_,g=(I-C)*2,A=-(U-E)*2;S.set(3,0,S.get(3,0)+g),S.set(3,1,S.get(3,1)+A),i.push({lightViewProj:S.multiply(h),splitFar:c,depthRange:y-v,texelWorldSize:b})}return i}_computeSplitDepths(e,t,n){const i=[];for(let a=1;a<=n;a++){const l=e+(t-e)*(a/n),c=e*Math.pow(t/e,a/n);i.push(.75*c+(1-.75)*l)}return i}_frustumCornersForSplit(e,t,n){const o=e.near,i=e.far;e.near=t,e.far=n;const a=e.frustumCornersWorld();return e.near=o,e.far=i,a}}var Et=(u=>(u.Forward="forward",u.Geometry="geometry",u.SkinnedGeometry="skinnedGeometry",u))(Et||{});class $i{constructor(){s(this,"transparent",!1)}}class Te extends it{constructor(e,t){super();s(this,"mesh");s(this,"material");s(this,"castShadow",!0);this.mesh=e,this.material=t}}class Zi{constructor(){s(this,"gameObjects",[])}add(r){this.gameObjects.push(r)}remove(r){const e=this.gameObjects.indexOf(r);e!==-1&&this.gameObjects.splice(e,1)}update(r){for(const e of this.gameObjects)e.update(r)}findCamera(){for(const r of this.gameObjects){const e=r.getComponent(ui);if(e)return e}return null}findDirectionalLight(){for(const r of this.gameObjects){const e=r.getComponent(di);if(e)return e}return null}collectMeshRenderers(){const r=[];for(const e of this.gameObjects)this._collectMeshRenderersRecursive(e,r);return r}_collectMeshRenderersRecursive(r,e){const t=r.getComponent(Te);t&&e.push(t);for(const n of r.children)this._collectMeshRenderersRecursive(n,e)}getComponents(r){const e=[];for(const t of this.gameObjects){const n=t.getComponent(r);n&&e.push(n)}return e}}const Ki=[new j(1,0,0),new j(-1,0,0),new j(0,1,0),new j(0,-1,0),new j(0,0,1),new j(0,0,-1)],Ji=[new j(0,-1,0),new j(0,-1,0),new j(0,0,1),new j(0,0,-1),new j(0,-1,0),new j(0,-1,0)];class Wr extends it{constructor(){super(...arguments);s(this,"color",j.one());s(this,"intensity",1);s(this,"radius",10);s(this,"castShadow",!1)}worldPosition(){return this.gameObject.localToWorld().transformPoint(j.ZERO)}cubeFaceViewProjs(e=.05){const t=this.worldPosition(),n=se.perspective(Math.PI/2,1,e,this.radius),o=new Array(6);for(let i=0;i<6;i++)o[i]=n.multiply(se.lookAt(t,t.add(Ki[i]),Ji[i]));return o}}class fi extends it{constructor(){super(...arguments);s(this,"color",j.one());s(this,"intensity",1);s(this,"range",20);s(this,"innerAngle",15);s(this,"outerAngle",30);s(this,"castShadow",!1);s(this,"projectionTexture",null)}worldPosition(){return this.gameObject.localToWorld().transformPoint(j.ZERO)}worldDirection(){return this.gameObject.localToWorld().transformDirection(j.FORWARD).normalize()}lightViewProj(e=.1){const t=this.worldPosition(),n=this.worldDirection(),o=Math.abs(n.y)>.99?j.RIGHT:j.UP,i=se.lookAt(t,t.add(n),o);return se.perspective(this.outerAngle*2*Math.PI/180,1,e,this.range).multiply(i)}}const Qi=new j(0,1,0);class ea extends it{constructor(e){super();s(this,"_world");s(this,"_state","idle");s(this,"_timer",0);s(this,"_targetX",0);s(this,"_targetZ",0);s(this,"_hasTarget",!1);s(this,"_velY",0);s(this,"_yaw",0);s(this,"_headGO",null);s(this,"_headBaseY",0);s(this,"_bobPhase");this._world=e,this._timer=1+Math.random()*5,this._yaw=Math.random()*Math.PI*2,this._bobPhase=Math.random()*Math.PI*2}onAttach(){for(const e of this.gameObject.children)if(e.name==="Pig.Head"){this._headGO=e,this._headBaseY=e.position.y;break}}update(e){const t=this.gameObject,n=t.position.x,o=t.position.z;this._velY-=9.8*e,t.position.y+=this._velY*e;const i=this._world.getTopBlockY(Math.floor(n),Math.floor(o),Math.ceil(t.position.y)+4);switch(i>0&&t.position.y<=i+.1&&(t.position.y=i,this._velY=0),this._state){case"idle":{this._timer-=e,this._timer<=0&&this._pickWanderTarget();break}case"wander":{if(this._timer-=e,!this._hasTarget||this._timer<=0){this._enterIdle();break}const a=this._targetX-n,l=this._targetZ-o,c=a*a+l*l;if(c<.25){this._enterIdle();break}const d=Math.sqrt(c);t.position.x+=a/d*1.2*e,t.position.z+=l/d*1.2*e,this._yaw=Math.atan2(-(a/d),-(l/d));break}}if(t.rotation=me.fromAxisAngle(Qi,this._yaw),this._headGO){this._bobPhase+=e*(this._state==="wander"?4:1.5);const a=this._state==="wander"?.014:.005;this._headGO.position.y=this._headBaseY+Math.sin(this._bobPhase)*a}}_enterIdle(){this._state="idle",this._hasTarget=!1,this._timer=3+Math.random()*5}_pickWanderTarget(){const e=this.gameObject,t=Math.random()*Math.PI*2,n=4+Math.random()*8;this._targetX=e.position.x+Math.cos(t)*n,this._targetZ=e.position.z+Math.sin(t)*n,this._hasTarget=!0,this._state="wander",this._timer=8+Math.random()*7}}const ta=new j(0,1,0);class ra extends it{constructor(e,t){super();s(this,"_parent");s(this,"_world");s(this,"_velY",0);s(this,"_yaw",0);s(this,"_headGO",null);s(this,"_headBaseY",0);s(this,"_bobPhase");s(this,"_offsetAngle");s(this,"_followDist");this._parent=e,this._world=t,this._offsetAngle=Math.random()*Math.PI*2,this._followDist=.55+Math.random()*.5,this._bobPhase=Math.random()*Math.PI*2}onAttach(){for(const e of this.gameObject.children)if(e.name==="Duckling.Head"){this._headGO=e,this._headBaseY=e.position.y;break}}update(e){const t=this.gameObject,n=t.position.x,o=t.position.z;this._velY-=9.8*e,t.position.y+=this._velY*e;const i=this._world.getTopBlockY(Math.floor(n),Math.floor(o),Math.ceil(t.position.y)+4);i>0&&t.position.y<=i+.1&&(t.position.y=i,this._velY=0),this._offsetAngle+=e*.25;const a=this._parent.position.x+Math.cos(this._offsetAngle)*this._followDist,l=this._parent.position.z+Math.sin(this._offsetAngle)*this._followDist,c=a-n,d=l-o,f=c*c+d*d;let p=!1;if(f>.04){const h=Math.sqrt(f),_=h>2.5?3.5:1.8,m=c/h,b=d/h;t.position.x+=m*_*e,t.position.z+=b*_*e,this._yaw=Math.atan2(-m,-b),p=!0}if(t.rotation=me.fromAxisAngle(ta,this._yaw),this._headGO){this._bobPhase+=e*(p?7:2);const h=p?.012:.004;this._headGO.position.y=this._headBaseY+Math.sin(this._bobPhase)*h}}}const na=new j(0,1,0),oa=new j(1,0,0),ia=3;class aa{constructor(r=0,e=0,t=5,n=.002){s(this,"yaw");s(this,"pitch");s(this,"speed");s(this,"sensitivity");s(this,"inputForward",0);s(this,"inputStrafe",0);s(this,"inputUp",!1);s(this,"inputDown",!1);s(this,"inputFast",!1);s(this,"_keys",new Set);s(this,"_canvas",null);s(this,"_onMouseMove");s(this,"_onKeyDown");s(this,"_onKeyUp");s(this,"_onClick");s(this,"_onBlur");s(this,"usePointerLock",!0);this.yaw=r,this.pitch=e,this.speed=t,this.sensitivity=n;const o=Math.PI/2-.001;this._onMouseMove=i=>{document.pointerLockElement===this._canvas&&(this.yaw-=i.movementX*this.sensitivity,this.pitch=Math.max(-o,Math.min(o,this.pitch+i.movementY*this.sensitivity)))},this._onKeyDown=i=>this._keys.add(i.code),this._onKeyUp=i=>this._keys.delete(i.code),this._onClick=()=>{var i;this.usePointerLock&&((i=this._canvas)==null||i.requestPointerLock())},this._onBlur=()=>this._keys.clear()}attach(r){this._canvas=r,r.addEventListener("click",this._onClick),document.addEventListener("mousemove",this._onMouseMove),document.addEventListener("keydown",this._onKeyDown),document.addEventListener("keyup",this._onKeyUp),window.addEventListener("blur",this._onBlur)}pressKey(r){this._keys.add(r)}applyLookDelta(r,e){const t=Math.PI/2-.001;this.yaw-=r*this.sensitivity,this.pitch=Math.max(-t,Math.min(t,this.pitch+e*this.sensitivity))}detach(){this._canvas&&(this._canvas.removeEventListener("click",this._onClick),document.removeEventListener("mousemove",this._onMouseMove),document.removeEventListener("keydown",this._onKeyDown),document.removeEventListener("keyup",this._onKeyUp),window.removeEventListener("blur",this._onBlur),this._canvas=null)}update(r,e){const t=Math.sin(this.yaw),n=Math.cos(this.yaw);let o=0,i=0,a=0;(this._keys.has("KeyW")||this._keys.has("ArrowUp"))&&(o-=t,a-=n),(this._keys.has("KeyS")||this._keys.has("ArrowDown"))&&(o+=t,a+=n),(this._keys.has("KeyA")||this._keys.has("ArrowLeft"))&&(o-=n,a+=t),(this._keys.has("KeyD")||this._keys.has("ArrowRight"))&&(o+=n,a-=t),this.inputForward!==0&&(o-=t*this.inputForward,a-=n*this.inputForward),this.inputStrafe!==0&&(o+=n*this.inputStrafe,a-=t*this.inputStrafe),(this._keys.has("Space")||this.inputUp)&&(i+=1),(this._keys.has("ShiftLeft")||this.inputDown)&&(i-=1);const l=Math.sqrt(o*o+i*i+a*a);if(l>0){const c=this._keys.has("ControlLeft")||this._keys.has("AltLeft")||this.inputFast,d=this.speed*(c?ia:1)*e/l;r.position.x+=o*d,r.position.y+=i*d,r.position.z+=a*d}r.rotation=me.fromAxisAngle(na,this.yaw).multiply(me.fromAxisAngle(oa,-this.pitch))}}const sa=400,la=16,pi=sa/la;var R=(u=>(u[u.NONE=0]="NONE",u[u.GRASS=1]="GRASS",u[u.SAND=2]="SAND",u[u.STONE=3]="STONE",u[u.DIRT=4]="DIRT",u[u.TRUNK=5]="TRUNK",u[u.TREELEAVES=6]="TREELEAVES",u[u.WATER=7]="WATER",u[u.GLASS=8]="GLASS",u[u.FLOWER=9]="FLOWER",u[u.GLOWSTONE=10]="GLOWSTONE",u[u.MAGMA=11]="MAGMA",u[u.OBSIDIAN=12]="OBSIDIAN",u[u.DIAMOND=13]="DIAMOND",u[u.IRON=14]="IRON",u[u.SPECULAR=15]="SPECULAR",u[u.CACTUS=16]="CACTUS",u[u.SNOW=17]="SNOW",u[u.GRASS_SNOW=18]="GRASS_SNOW",u[u.SPRUCE_PLANKS=19]="SPRUCE_PLANKS",u[u.GRASS_PROP=20]="GRASS_PROP",u[u.TORCH=21]="TORCH",u[u.DEAD_BUSH=22]="DEAD_BUSH",u[u.SNOWYLEAVES=23]="SNOWYLEAVES",u[u.AMETHYST=24]="AMETHYST",u[u.MAX=25]="MAX",u))(R||{});class fe{constructor(r,e,t,n){s(this,"blockType");s(this,"sideFace");s(this,"bottomFace");s(this,"topFace");this.blockType=r,this.sideFace=e,this.bottomFace=t,this.topFace=n}}const ur=[new fe(0,new V(0,0),new V(0,0),new V(0,0)),new fe(1,new V(1,0),new V(3,0),new V(2,0)),new fe(2,new V(4,0),new V(4,0),new V(4,0)),new fe(3,new V(5,0),new V(5,0),new V(5,0)),new fe(4,new V(6,0),new V(6,0),new V(6,0)),new fe(5,new V(7,0),new V(8,0),new V(8,0)),new fe(6,new V(9,0),new V(9,0),new V(9,0)),new fe(7,new V(2,29),new V(2,29),new V(2,29)),new fe(8,new V(10,0),new V(10,0),new V(10,0)),new fe(9,new V(23,0),new V(23,0),new V(23,0)),new fe(10,new V(11,0),new V(11,0),new V(11,0)),new fe(11,new V(12,0),new V(12,0),new V(12,0)),new fe(12,new V(13,0),new V(13,0),new V(13,0)),new fe(13,new V(14,0),new V(14,0),new V(14,0)),new fe(14,new V(15,0),new V(15,0),new V(15,0)),new fe(15,new V(0,24),new V(0,24),new V(0,24)),new fe(16,new V(17,0),new V(18,0),new V(16,0)),new fe(17,new V(19,0),new V(19,0),new V(19,0)),new fe(18,new V(20,0),new V(3,0),new V(21,0)),new fe(19,new V(22,0),new V(22,0),new V(22,0)),new fe(20,new V(1,1),new V(1,1),new V(1,1)),new fe(21,new V(2,1),new V(2,1),new V(2,1)),new fe(22,new V(3,1),new V(3,1),new V(3,1)),new fe(23,new V(4,1),new V(9,0),new V(21,0)),new fe(24,new V(5,1),new V(5,1),new V(5,1)),new fe(25,new V(0,0),new V(0,0),new V(0,0))];class he{constructor(r,e,t,n){s(this,"blockType");s(this,"materialType");s(this,"emitsLight");s(this,"collidable");this.blockType=r,this.materialType=e,this.emitsLight=t,this.collidable=n}}const At=[new he(0,1,0,0),new he(1,0,0,1),new he(2,0,0,1),new he(3,0,0,1),new he(4,0,0,1),new he(5,0,0,1),new he(6,1,0,1),new he(7,2,0,0),new he(8,1,0,1),new he(9,3,0,0),new he(10,0,1,1),new he(11,0,1,1),new he(12,0,0,1),new he(13,0,0,1),new he(14,0,0,1),new he(15,0,0,1),new he(16,0,0,1),new he(17,0,0,1),new he(18,0,0,1),new he(19,0,0,1),new he(20,3,0,0),new he(21,3,1,0),new he(22,3,0,0),new he(23,1,0,1),new he(24,0,0,1)],ca=[0,.6,.5,1.5,.5,2,.2,0,.3,0,.3,.3,10,3,3,1.5,.4,.1,.6,2,0,0,0,.2,1.5],ua=["None","Grass","Sand","Stone","Dirt","Trunk","Tree leaves","Water","Glass","Flower","Glowstone","Magma","Obsidian","Diamond","Iron","Specular","Cactus","Snow","Grass snow","Spruce planks","Grass prop","Torch","Dead bush","Snowy leaves","Amethyst","Max"];function _e(u){return At[u].materialType===2}function mt(u){return At[u].materialType===1||At[u].materialType===3}function Jn(u){return At[u].emitsLight===1}function Ae(u){return At[u].materialType===3}function da(u){switch(u){case R.GRASS:case R.DIRT:case R.TREELEAVES:case R.SNOW:case R.GRASS_SNOW:case R.GRASS_PROP:case R.SNOWYLEAVES:return"grass";case R.SAND:return"sand";case R.TRUNK:case R.SPRUCE_PLANKS:return"wood";default:return"stone"}}const fa=new j(0,1,0),pa=new j(1,0,0),ha=-28,_a=-4,ma=1.3,ga=4.3,va=7,ba=11.5,ya=8,wa=3.5,Pe=.3,St=1.8,Qn=1.62;class xa{constructor(r,e=Math.PI,t=.1){s(this,"yaw");s(this,"pitch");s(this,"sensitivity",.002);s(this,"inputForward",0);s(this,"inputStrafe",0);s(this,"inputJump",!1);s(this,"inputSneak",!1);s(this,"inputSprint",!1);s(this,"autoJump",!0);s(this,"onStep");s(this,"onLand");s(this,"_velY",0);s(this,"_stepDistance",0);s(this,"_onGround",!1);s(this,"_prevInWater",!1);s(this,"_coyoteFrames",0);s(this,"_keys",new Set);s(this,"_canvas",null);s(this,"_world");s(this,"_onMouseMove");s(this,"_onKeyDown");s(this,"_onKeyUp");s(this,"_onClick");s(this,"_onBlur");s(this,"usePointerLock",!0);this._world=r,this.yaw=e,this.pitch=t;const n=Math.PI/2-.001;this._onMouseMove=o=>{document.pointerLockElement===this._canvas&&(this.yaw-=o.movementX*this.sensitivity,this.pitch=Math.max(-n,Math.min(n,this.pitch+o.movementY*this.sensitivity)))},this._onKeyDown=o=>this._keys.add(o.code),this._onKeyUp=o=>this._keys.delete(o.code),this._onClick=()=>{var o;this.usePointerLock&&((o=this._canvas)==null||o.requestPointerLock())},this._onBlur=()=>this._keys.clear()}set velY(r){this._velY=r}attach(r){this._canvas=r,r.addEventListener("click",this._onClick),document.addEventListener("mousemove",this._onMouseMove),document.addEventListener("keydown",this._onKeyDown),document.addEventListener("keyup",this._onKeyUp),window.addEventListener("blur",this._onBlur)}applyLookDelta(r,e){const t=Math.PI/2-.001;this.yaw-=r*this.sensitivity,this.pitch=Math.max(-t,Math.min(t,this.pitch+e*this.sensitivity))}detach(){this._canvas&&(this._canvas.removeEventListener("click",this._onClick),document.removeEventListener("mousemove",this._onMouseMove),document.removeEventListener("keydown",this._onKeyDown),document.removeEventListener("keyup",this._onKeyUp),window.removeEventListener("blur",this._onBlur),this._canvas=null)}update(r,e){var U,g;e=Math.min(e,.05),r.rotation=me.fromAxisAngle(fa,this.yaw).multiply(me.fromAxisAngle(pa,-this.pitch));const t=Math.sin(this.yaw),n=Math.cos(this.yaw),o=this._keys.has("ControlLeft")||this._keys.has("AltLeft")||this.inputSprint,i=this._keys.has("ShiftLeft")||this.inputSneak,a=o?va:i?ma:ga;let l=0,c=0;(this._keys.has("KeyW")||this._keys.has("ArrowUp"))&&(l-=t,c-=n),(this._keys.has("KeyS")||this._keys.has("ArrowDown"))&&(l+=t,c+=n),(this._keys.has("KeyA")||this._keys.has("ArrowLeft"))&&(l-=n,c+=t),(this._keys.has("KeyD")||this._keys.has("ArrowRight"))&&(l+=n,c-=t),this.inputForward!==0&&(l-=t*this.inputForward,c-=n*this.inputForward),this.inputStrafe!==0&&(l+=n*this.inputStrafe,c-=t*this.inputStrafe);const d=Math.sqrt(l*l+c*c);if(d>0){const A=1/Math.max(d,1);l=l*A*a,c=c*A*a}let f=r.position.x,p=r.position.y-Qn,h=r.position.z;const _=_e(this._world.getBlockType(Math.floor(f),Math.floor(p+St*.5),Math.floor(h))),m=this._keys.has("Space")||this.inputJump;_?(m&&(this._velY=wa),this._velY=Math.max(this._velY+_a*e,-2)):(this._prevInWater&&this._velY>0&&(this._velY=0),m&&(this._onGround||this._coyoteFrames>0)&&(this._velY=ba,this._coyoteFrames=0),this._velY=Math.max(this._velY+ha*e,-50));const b=this._onGround,v=Math.sqrt(l*l+c*c);if(this.autoJump&&this._onGround&&v>.5){const A=1/Math.max(v,1),P=l*A,T=c*A,B=Math.floor(p),N=Math.floor(f+P*(Pe+.3)),G=Math.floor(h+T*(Pe+.3));this._isSolid(N,B,G)&&!this._isSolid(N,B+1,G)&&(this._velY=ya)}f=this._slideX(f+l*e,p,h,l),h=this._slideZ(f,p,h+c*e,c);const[y,w,S]=this._slideY(f,p+this._velY*e,h),x=this._velY;(w||S)&&(this._velY=0),p=y,this._onGround=w,this._prevInWater=_;const k=Math.floor(f),C=Math.floor(p-.01),E=Math.floor(h),I=da(this._world.getBlockType(k,C,E));if(w&&!b&&((U=this.onLand)==null||U.call(this,I,Math.abs(x))),w&&v>.5){this._stepDistance+=v*e;const A=v>5.5?.55:v>2?.45:.3;this._stepDistance>=A&&(this._stepDistance-=A,(g=this.onStep)==null||g.call(this,I))}else this._stepDistance=0;w?this._coyoteFrames=6:_||(this._coyoteFrames=Math.max(0,this._coyoteFrames-1)),r.position.x=f,r.position.y=p+Qn,r.position.z=h}_isSolid(r,e,t){const n=this._world.getBlockType(r,e,t);return n!==R.NONE&&!_e(n)&&!Ae(n)}_slideX(r,e,t,n){if(Math.abs(n)<1e-6)return r;const o=n>0?r+Pe:r-Pe,i=Math.floor(o),a=Math.floor(e+.01),l=Math.floor(e+St-.01),c=Math.floor(t-Pe+.01),d=Math.floor(t+Pe-.01);for(let f=a;f<=l;f++)for(let p=c;p<=d;p++)if(this._isSolid(i,f,p))return n>0?i-Pe-.001:i+1+Pe+.001;return r}_slideZ(r,e,t,n){if(Math.abs(n)<1e-6)return t;const o=n>0?t+Pe:t-Pe,i=Math.floor(o),a=Math.floor(e+.01),l=Math.floor(e+St-.01),c=Math.floor(r-Pe+.01),d=Math.floor(r+Pe-.01);for(let f=a;f<=l;f++)for(let p=c;p<=d;p++)if(this._isSolid(p,f,i))return n>0?i-Pe-.001:i+1+Pe+.001;return t}_slideY(r,e,t){const n=Math.floor(r-Pe+.01),o=Math.floor(r+Pe-.01),i=Math.floor(t-Pe+.01),a=Math.floor(t+Pe-.01);if(this._velY<=0){const l=Math.floor(e-.001);for(let c=n;c<=o;c++)for(let d=i;d<=a;d++)if(this._isSolid(c,l,d))return[l+1,!0,!1];return[e,!1,!1]}else{const l=Math.floor(e+St);for(let c=n;c<=o;c++)for(let d=i;d<=a;d++)if(this._isSolid(c,l,d))return[l-St-.001,!1,!0];return[e,!1,!1]}}}class jr{constructor(r,e,t,n,o,i){s(this,"device");s(this,"queue");s(this,"context");s(this,"format");s(this,"canvas");s(this,"hdr");s(this,"enableErrorHandling");this.device=r,this.queue=r.queue,this.context=e,this.format=t,this.canvas=n,this.hdr=o,this.enableErrorHandling=i}get width(){return this.canvas.width}get height(){return this.canvas.height}static async create(r,e={}){if(!navigator.gpu)throw new Error("WebGPU not supported");const t=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!t)throw new Error("No WebGPU adapter found");const n=await t.requestDevice({requiredFeatures:[]});e.enableErrorHandling&&n.addEventListener("uncapturederror",l=>{const c=l.error;c instanceof GPUValidationError?console.error("[WebGPU Validation Error]",c.message):c instanceof GPUOutOfMemoryError?console.error("[WebGPU Out of Memory]"):console.error("[WebGPU Internal Error]",c)});const o=r.getContext("webgpu");let i,a=!1;try{o.configure({device:n,format:"rgba16float",alphaMode:"opaque",colorSpace:"display-p3",toneMapping:{mode:"extended"}}),i="rgba16float",a=!0}catch{i=navigator.gpu.getPreferredCanvasFormat(),o.configure({device:n,format:i,alphaMode:"opaque"})}return r.width=r.clientWidth*devicePixelRatio,r.height=r.clientHeight*devicePixelRatio,new jr(n,o,i,r,a,e.enableErrorHandling??!1)}getCurrentTexture(){return this.context.getCurrentTexture()}createBuffer(r,e,t){return this.device.createBuffer({size:r,usage:e,label:t})}writeBuffer(r,e,t=0){e instanceof ArrayBuffer?this.queue.writeBuffer(r,t,e):this.queue.writeBuffer(r,t,e.buffer,e.byteOffset,e.byteLength)}pushInitErrorScope(){this.enableErrorHandling&&this.device.pushErrorScope("validation")}async popInitErrorScope(r){if(this.enableErrorHandling){const e=await this.device.popErrorScope();e&&(console.error(`[Init:${r}] Validation Error:`,e.message),console.trace())}}pushFrameErrorScope(){this.enableErrorHandling&&this.device.pushErrorScope("validation")}async popFrameErrorScope(){if(this.enableErrorHandling){const r=await this.device.popErrorScope();r&&(console.error("[Frame] Validation Error:",r.message),console.trace())}}pushPassErrorScope(r){this.enableErrorHandling&&(this.device.pushErrorScope("validation"),this.device.pushErrorScope("out-of-memory"),this.device.pushErrorScope("internal"))}async popPassErrorScope(r){if(this.enableErrorHandling){const e=await this.device.popErrorScope();e&&console.error(`[${r}] Internal Error:`,e),await this.device.popErrorScope()&&console.error(`[${r}] Out of Memory`);const n=await this.device.popErrorScope();n&&console.error(`[${r}] Validation Error:`,n.message)}}}class Se{constructor(){s(this,"enabled",!0)}destroy(){}}class ir{constructor(r,e,t,n,o){s(this,"albedoRoughness");s(this,"normalMetallic");s(this,"depth");s(this,"albedoRoughnessView");s(this,"normalMetallicView");s(this,"depthView");s(this,"width");s(this,"height");this.albedoRoughness=r,this.normalMetallic=e,this.depth=t,this.width=n,this.height=o,this.albedoRoughnessView=r.createView(),this.normalMetallicView=e.createView(),this.depthView=t.createView()}static create(r){const{device:e,width:t,height:n}=r,o=e.createTexture({label:"GBuffer AlbedoRoughness",size:{width:t,height:n},format:"rgba8unorm",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),i=e.createTexture({label:"GBuffer NormalMetallic",size:{width:t,height:n},format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),a=e.createTexture({label:"GBuffer Depth",size:{width:t,height:n},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING});return new ir(o,i,a,t,n)}destroy(){this.albedoRoughness.destroy(),this.normalMetallic.destroy(),this.depth.destroy()}}const qr=48,Yr=[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x3"},{shaderLocation:2,offset:24,format:"float32x2"},{shaderLocation:3,offset:32,format:"float32x4"}];class Le{constructor(r,e,t){s(this,"vertexBuffer");s(this,"indexBuffer");s(this,"indexCount");this.vertexBuffer=r,this.indexBuffer=e,this.indexCount=t}destroy(){this.vertexBuffer.destroy(),this.indexBuffer.destroy()}static fromData(r,e,t){const n=r.createBuffer({label:"Mesh VertexBuffer",size:e.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(n,0,e.buffer,e.byteOffset,e.byteLength);const o=r.createBuffer({label:"Mesh IndexBuffer",size:t.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(o,0,t.buffer,t.byteOffset,t.byteLength),new Le(n,o,t.length)}static createCube(r,e=1){const t=e/2,n=[{normal:[0,0,1],tangent:[1,0,0,1],verts:[[-t,-t,t],[t,-t,t],[t,t,t],[-t,t,t]]},{normal:[0,0,-1],tangent:[-1,0,0,1],verts:[[t,-t,-t],[-t,-t,-t],[-t,t,-t],[t,t,-t]]},{normal:[1,0,0],tangent:[0,0,-1,1],verts:[[t,-t,t],[t,-t,-t],[t,t,-t],[t,t,t]]},{normal:[-1,0,0],tangent:[0,0,1,1],verts:[[-t,-t,-t],[-t,-t,t],[-t,t,t],[-t,t,-t]]},{normal:[0,1,0],tangent:[1,0,0,1],verts:[[-t,t,t],[t,t,t],[t,t,-t],[-t,t,-t]]},{normal:[0,-1,0],tangent:[1,0,0,1],verts:[[-t,-t,-t],[t,-t,-t],[t,-t,t],[-t,-t,t]]}],o=[[0,1],[1,1],[1,0],[0,0]],i=[],a=[];let l=0;for(const c of n){for(let d=0;d<4;d++)i.push(...c.verts[d],...c.normal,...o[d],...c.tangent);a.push(l,l+1,l+2,l,l+2,l+3),l+=4}return Le.fromData(r,new Float32Array(i),new Uint32Array(a))}static createSphere(r,e=.5,t=32,n=32){const o=[],i=[];for(let a=0;a<=t;a++){const l=a/t*Math.PI,c=Math.sin(l),d=Math.cos(l);for(let f=0;f<=n;f++){const p=f/n*Math.PI*2,h=Math.sin(p),_=Math.cos(p),m=c*_,b=d,v=c*h;o.push(m*e,b*e,v*e,m,b,v,f/n,a/t,-h,0,_,1)}}for(let a=0;a<t;a++)for(let l=0;l<n;l++){const c=a*(n+1)+l,d=c+n+1;i.push(c,c+1,d),i.push(c+1,d+1,d)}return Le.fromData(r,new Float32Array(o),new Uint32Array(i))}static createCone(r,e=.5,t=1,n=16){const o=[],i=[],a=Math.sqrt(t*t+e*e),l=t/a,c=e/a;o.push(0,t,0,0,1,0,.5,0,1,0,0,1);const d=1;for(let h=0;h<=n;h++){const _=h/n*Math.PI*2,m=Math.cos(_),b=Math.sin(_);o.push(m*e,0,b*e,m*l,c,b*l,h/n,1,m,0,b,1)}for(let h=0;h<n;h++)i.push(0,d+h+1,d+h);const f=d+n+1;o.push(0,0,0,0,-1,0,.5,.5,1,0,0,1);const p=f+1;for(let h=0;h<=n;h++){const _=h/n*Math.PI*2,m=Math.cos(_),b=Math.sin(_);o.push(m*e,0,b*e,0,-1,0,.5+m*.5,.5+b*.5,1,0,0,1)}for(let h=0;h<n;h++)i.push(f,p+h,p+h+1);return Le.fromData(r,new Float32Array(o),new Uint32Array(i))}static createPlane(r,e=10,t=10,n=1,o=1){const i=[],a=[];for(let l=0;l<=o;l++)for(let c=0;c<=n;c++){const d=(c/n-.5)*e,f=(l/o-.5)*t,p=c/n,h=l/o;i.push(d,0,f,0,1,0,p,h,1,0,0,1)}for(let l=0;l<o;l++)for(let c=0;c<n;c++){const d=l*(n+1)+c;a.push(d,d+n+1,d+1,d+1,d+n+1,d+n+2)}return Le.fromData(r,new Float32Array(i),new Uint32Array(a))}}const hi=`// Shadow map rendering shader - outputs depth only

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
`,eo=2048,Vt=4;class Xr extends Se{constructor(e,t,n,o,i,a,l,c){super();s(this,"name","ShadowPass");s(this,"shadowMap");s(this,"shadowMapView");s(this,"shadowMapArrayViews");s(this,"_pipeline");s(this,"_shadowBindGroups");s(this,"_shadowUniformBuffers");s(this,"_modelUniformBuffers",[]);s(this,"_modelBindGroups",[]);s(this,"_cascadeCount");s(this,"_cascades",[]);s(this,"_modelBGL");s(this,"_sceneSnapshot",[]);this.shadowMap=e,this.shadowMapView=t,this.shadowMapArrayViews=n,this._pipeline=o,this._shadowBindGroups=i,this._shadowUniformBuffers=a,this._modelBGL=l,this._cascadeCount=c}static create(e,t=3){const{device:n}=e,o=n.createTexture({label:"ShadowMap",size:{width:eo,height:eo,depthOrArrayLayers:Vt},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),i=o.createView({dimension:"2d-array"}),a=Array.from({length:Vt},(_,m)=>o.createView({dimension:"2d",baseArrayLayer:m,arrayLayerCount:1})),l=n.createBindGroupLayout({label:"ShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),c=n.createBindGroupLayout({label:"ModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),d=[],f=[];for(let _=0;_<Vt;_++){const m=n.createBuffer({label:`ShadowUniformBuffer ${_}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});d.push(m),f.push(n.createBindGroup({label:`ShadowBindGroup ${_}`,layout:l,entries:[{binding:0,resource:{buffer:m}}]}))}const p=n.createShaderModule({label:"ShadowShader",code:hi}),h=n.createRenderPipeline({label:"ShadowPipeline",layout:n.createPipelineLayout({bindGroupLayouts:[l,c]}),vertex:{module:p,entryPoint:"vs_main",buffers:[{arrayStride:qr,attributes:[Yr[0]]}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less",depthBias:2,depthBiasSlopeScale:2.5,depthBiasClamp:0},primitive:{topology:"triangle-list",cullMode:"back"}});return new Xr(o,i,a,h,f,d,c,t)}updateScene(e,t,n,o){this._cascades=n.computeCascadeMatrices(t,o),this._cascadeCount=Math.min(this._cascades.length,Vt)}execute(e,t){const{device:n}=t,o=this._getMeshRenderers(t);this._ensureModelBuffers(n,o.length);for(let i=0;i<this._cascadeCount&&!(i>=this._cascades.length);i++){const a=this._cascades[i];t.queue.writeBuffer(this._shadowUniformBuffers[i],0,a.lightViewProj.data.buffer);const l=e.beginRenderPass({label:`ShadowPass cascade ${i}`,colorAttachments:[],depthStencilAttachment:{view:this.shadowMapArrayViews[i],depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});l.setPipeline(this._pipeline),l.setBindGroup(0,this._shadowBindGroups[i]);for(let c=0;c<o.length;c++){const{mesh:d,modelMatrix:f}=o[c],p=this._modelUniformBuffers[c];t.queue.writeBuffer(p,0,f.data.buffer),l.setBindGroup(1,this._modelBindGroups[c]),l.setVertexBuffer(0,d.vertexBuffer),l.setIndexBuffer(d.indexBuffer,"uint32"),l.drawIndexed(d.indexCount)}l.end()}}_getMeshRenderers(e){return this._sceneSnapshot??[]}setSceneSnapshot(e){this._sceneSnapshot=e}_ensureModelBuffers(e,t){for(;this._modelUniformBuffers.length<t;){const n=e.createBuffer({label:`ModelUniform ${this._modelUniformBuffers.length}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),o=e.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:n}}]});this._modelUniformBuffers.push(n),this._modelBindGroups.push(o)}}destroy(){this.shadowMap.destroy();for(const e of this._shadowUniformBuffers)e.destroy();for(const e of this._modelUniformBuffers)e.destroy()}}const Ba=`// Deferred PBR lighting pass — fullscreen triangle, reads GBuffer + shadow maps + IBL.\r
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
  let cloud_uv  = (world_pos.xz - light.cloudShadowOrigin) / (cloud_ext * 2.0) + 0.5;\r
  // Fade cloud shadow to 1.0 (no shadow) in the outer 10% of the map to hide the\r
  // hard edge where the shadow map repeats its border.\r
  var cloud_edge = min(cloud_uv.x, 1.0 - cloud_uv.x);\r
  cloud_edge = min(cloud_edge, min(cloud_uv.y, 1.0 - cloud_uv.y));\r
  let cloud_fade = saturate(cloud_edge * 10.0);\r
  let cloud_raw  = textureSampleLevel(cloudShadowTex, gbufferSampler, clamp(cloud_uv, vec2<f32>(0.0), vec2<f32>(1.0)), 0.0).r;\r
  let cloud_shadow = select(mix(1.0, cloud_raw, cloud_fade), 1.0, light.cloudShadowExtent <= 0.0);\r
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
`,le="rgba16float",to=64*4+16+16,ro=368;class $r extends Se{constructor(e,t,n,o,i,a,l,c,d,f,p,h,_,m,b,v,y,w){super();s(this,"name","LightingPass");s(this,"hdrTexture");s(this,"hdrView");s(this,"cameraBuffer");s(this,"lightBuffer");s(this,"_pipeline");s(this,"_sceneBindGroup");s(this,"_gbufferBindGroup");s(this,"_aoBindGroup");s(this,"_iblBindGroup");s(this,"_defaultCloudShadow");s(this,"_defaultSsgi");s(this,"_defaultIblCube");s(this,"_defaultBrdfLut");s(this,"_device");s(this,"_aoBGL");s(this,"_aoView");s(this,"_aoSampler");s(this,"_ssgiSampler");s(this,"_cameraScratch",new Float32Array(to/4));s(this,"_lightScratch",new Float32Array(ro/4));s(this,"_lightScratchU",new Uint32Array(this._lightScratch.buffer));s(this,"_cloudShadowScratch",new Float32Array(3));this.hdrTexture=e,this.hdrView=t,this._pipeline=n,this._sceneBindGroup=o,this._gbufferBindGroup=i,this._aoBindGroup=a,this._iblBindGroup=l,this.cameraBuffer=c,this.lightBuffer=d,this._defaultCloudShadow=f,this._defaultSsgi=p,this._defaultIblCube=h,this._defaultBrdfLut=_,this._device=m,this._aoBGL=b,this._aoView=v,this._aoSampler=y,this._ssgiSampler=w}static create(e,t,n,o,i,a){const{device:l,width:c,height:d}=e,f=l.createTexture({label:"HDR Texture",size:{width:c,height:d},format:le,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),p=f.createView(),h=l.createBuffer({label:"LightCameraBuffer",size:to,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),_=l.createBuffer({label:"LightBuffer",size:ro,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),m=l.createSampler({label:"ShadowSampler",compare:"less-equal",magFilter:"linear",minFilter:"linear"}),b=l.createSampler({label:"GBufferLinearSampler",magFilter:"linear",minFilter:"linear"}),v=l.createSampler({label:"AoSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),y=l.createSampler({label:"SsgiSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),w=l.createBindGroupLayout({label:"LightSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),S=l.createBindGroupLayout({label:"LightGBufferBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth",viewDimension:"2d-array"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"comparison"}},{binding:5,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:6,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),x=l.createTexture({label:"DefaultCloudShadow",size:{width:1,height:1},format:"r8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});l.queue.writeTexture({texture:x},new Uint8Array([255]),{bytesPerRow:1},{width:1,height:1});const k=i??x.createView(),C=l.createBindGroupLayout({label:"LightAoBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),E=l.createTexture({label:"DefaultSsgi",size:{width:1,height:1},format:le,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),I=l.createBindGroupLayout({label:"LightIblBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),U=l.createSampler({label:"IblSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge"}),g=l.createTexture({label:"DefaultIblCube",size:{width:1,height:1,depthOrArrayLayers:6},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),A=g.createView({dimension:"cube"}),P=l.createTexture({label:"DefaultBrdfLut",size:{width:1,height:1},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),T=l.createBindGroup({label:"LightIblBG",layout:I,entries:[{binding:0,resource:(a==null?void 0:a.irradianceView)??A},{binding:1,resource:(a==null?void 0:a.prefilteredView)??A},{binding:2,resource:(a==null?void 0:a.brdfLutView)??P.createView()},{binding:3,resource:U}]}),B=l.createBindGroup({layout:w,entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:{buffer:_}}]}),N=l.createBindGroup({layout:S,entries:[{binding:0,resource:t.albedoRoughnessView},{binding:1,resource:t.normalMetallicView},{binding:2,resource:t.depthView},{binding:3,resource:n.shadowMapView},{binding:4,resource:m},{binding:5,resource:b},{binding:6,resource:k}]}),G=l.createBindGroup({label:"LightAoBG",layout:C,entries:[{binding:0,resource:o},{binding:1,resource:v},{binding:2,resource:E.createView()},{binding:3,resource:y}]}),q=l.createShaderModule({label:"LightingShader",code:Ba}),O=l.createRenderPipeline({label:"LightingPipeline",layout:l.createPipelineLayout({bindGroupLayouts:[w,S,C,I]}),vertex:{module:q,entryPoint:"vs_main"},fragment:{module:q,entryPoint:"fs_main",targets:[{format:le}]},primitive:{topology:"triangle-list"}});return new $r(f,p,O,B,N,G,T,h,_,i?null:x,E,a?null:g,a?null:P,l,C,o,v,y)}updateSSGI(e){this._aoBindGroup=this._device.createBindGroup({label:"LightAoBG",layout:this._aoBGL,entries:[{binding:0,resource:this._aoView},{binding:1,resource:this._aoSampler},{binding:2,resource:e},{binding:3,resource:this._ssgiSampler}]})}updateCamera(e,t,n,o,i,a,l,c){const d=this._cameraScratch;d.set(t.data,0),d.set(n.data,16),d.set(o.data,32),d.set(i.data,48),d[64]=a.x,d[65]=a.y,d[66]=a.z,d[67]=l,d[68]=c,e.queue.writeBuffer(this.cameraBuffer,0,d.buffer)}updateLight(e,t,n,o,i,a=!0,l=!1,c=.02){const d=this._lightScratch,f=this._lightScratchU;let p=0;d[p++]=t.x,d[p++]=t.y,d[p++]=t.z,d[p++]=o,d[p++]=n.x,d[p++]=n.y,d[p++]=n.z,f[p++]=i.length;for(let h=0;h<4;h++)h<i.length&&d.set(i[h].lightViewProj.data,p),p+=16;for(let h=0;h<4;h++)d[p++]=h<i.length?i[h].splitFar:1e9;f[p]=a?1:0,f[p+1]=l?1:0,d[81]=c;for(let h=0;h<4;h++)d[84+h]=h<i.length?i[h].depthRange:1;for(let h=0;h<4;h++)d[88+h]=h<i.length?i[h].texelWorldSize:1;e.queue.writeBuffer(this.lightBuffer,0,d.buffer)}updateCloudShadow(e,t,n,o){const i=this._cloudShadowScratch;i[0]=t,i[1]=n,i[2]=o,e.queue.writeBuffer(this.lightBuffer,312,i.buffer)}execute(e,t){const n=e.beginRenderPass({label:"LightingPass",colorAttachments:[{view:this.hdrView,loadOp:"load",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._sceneBindGroup),n.setBindGroup(1,this._gbufferBindGroup),n.setBindGroup(2,this._aoBindGroup),n.setBindGroup(3,this._iblBindGroup),n.draw(3),n.end()}destroy(){var e,t,n,o;this.hdrTexture.destroy(),this.cameraBuffer.destroy(),this.lightBuffer.destroy(),(e=this._defaultCloudShadow)==null||e.destroy(),(t=this._defaultSsgi)==null||t.destroy(),(n=this._defaultIblCube)==null||n.destroy(),(o=this._defaultBrdfLut)==null||o.destroy()}}const Sa=`// Physically based single-scattering atmosphere (Rayleigh + Mie).\r
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
`,no=96;class Zr extends Se{constructor(e,t,n,o){super();s(this,"name","AtmospherePass");s(this,"_pipeline");s(this,"_uniformBuf");s(this,"_bg");s(this,"_hdrView");s(this,"_scratch",new Float32Array(no/4));this._pipeline=e,this._uniformBuf=t,this._bg=n,this._hdrView=o}static create(e,t){const{device:n}=e,o=n.createBuffer({label:"AtmosphereUniform",size:no,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),i=n.createBindGroupLayout({label:"AtmosphereBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),a=n.createBindGroup({label:"AtmosphereBG",layout:i,entries:[{binding:0,resource:{buffer:o}}]}),l=n.createShaderModule({label:"AtmosphereShader",code:Sa}),c=n.createRenderPipeline({label:"AtmospherePipeline",layout:n.createPipelineLayout({bindGroupLayouts:[i]}),vertex:{module:l,entryPoint:"vs_main"},fragment:{module:l,entryPoint:"fs_main",targets:[{format:le}]},primitive:{topology:"triangle-list"}});return new Zr(c,o,a,t)}update(e,t,n,o){const i=this._scratch;i.set(t.data,0),i[16]=n.x,i[17]=n.y,i[18]=n.z;const a=Math.sqrt(o.x*o.x+o.y*o.y+o.z*o.z),l=a>0?1/a:0;i[20]=-o.x*l,i[21]=-o.y*l,i[22]=-o.z*l,e.queue.writeBuffer(this._uniformBuf,0,i.buffer)}execute(e,t){const n=e.beginRenderPass({label:"AtmospherePass",colorAttachments:[{view:this._hdrView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._bg),n.draw(3),n.end()}destroy(){this._uniformBuf.destroy()}}const Pa=`// Block selection highlight — two draw calls sharing this shader:\r
//   draw(36): semi-transparent dark face overlay (6 faces × 2 triangles × 3 verts)\r
//   draw(36, 36): thick edge outlines (12 edges × 2 quads × 3 verts, offset into same array)\r
//\r
// Corner index encoding: bit 0 = x, bit 1 = y, bit 2 = z (0=min, 1=max side).\r
\r
struct Uniforms {\r
  viewProj   : mat4x4<f32>,\r
  blockPos   : vec3<f32>,\r
  crackStage : f32,\r
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
struct FaceOutput {\r
  @builtin(position) clip_pos : vec4<f32>,\r
  @location(0)       world_pos : vec3<f32>,\r
}\r
\r
@vertex\r
fn vs_face(@builtin(vertex_index) vid: u32) -> FaceOutput {\r
  let ci  = FACE_CI[vid];\r
  let pos = u.blockPos + vec3<f32>(\r
    mix(-0.001, 1.001, f32((ci >> 0u) & 1u)),\r
    mix(-0.001, 1.001, f32((ci >> 1u) & 1u)),\r
    mix(-0.001, 1.001, f32((ci >> 2u) & 1u)),\r
  );\r
  var out: FaceOutput;\r
  out.clip_pos  = bias_clip(u.viewProj * vec4<f32>(pos, 1.0));\r
  out.world_pos = pos;\r
  return out;\r
}\r
\r
// Procedural crack overlay — hash-based cell pattern\r
fn hash2(p: vec2<f32>) -> f32 {\r
  return fract(sin(dot(p, vec2<f32>(127.1, 311.7))) * 43758.5453);\r
}\r
\r
fn crack_alpha(local: vec3<f32>, stage: f32) -> f32 {\r
  if (stage < 0.5) { return 0.0; }\r
\r
  // Use the two dominant face axes for UV\r
  let ax = abs(local.x - 0.5);\r
  let ay = abs(local.y - 0.5);\r
  let az = abs(local.z - 0.5);\r
  var u = local.x;\r
  var v = local.z;\r
  if (ax <= ay && ax <= az) { u = local.y; v = local.z; }\r
  else if (az <= ax && az <= ay) { u = local.x; v = local.y; }\r
\r
  // 8x8 hash grid on the block face — each cell cracks independently\r
  let cell = floor(vec2<f32>(u, v) * 8.0);\r
  let h = hash2(cell);\r
  let percent = stage / 10.0;\r
  return 1.0 - smoothstep(percent - 0.08, percent + 0.08, h);\r
}\r
\r
@fragment\r
fn fs_face(in: FaceOutput) -> @location(0) vec4<f32> {\r
  let crack = crack_alpha(in.world_pos - u.blockPos, u.crackStage);\r
  let alpha = min(0.35 + crack * 0.5, 0.9);\r
  return vec4<f32>(0.0, 0.0, 0.0, alpha);\r
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
`,oo=80;class Kr extends Se{constructor(e,t,n,o,i,a){super();s(this,"name","BlockHighlightPass");s(this,"_facePipeline");s(this,"_edgePipeline");s(this,"_uniformBuf");s(this,"_bg");s(this,"_hdrView");s(this,"_depthView");s(this,"_active",!1);s(this,"_crackStage",0);s(this,"_scratch",new Float32Array(oo/4));this._facePipeline=e,this._edgePipeline=t,this._uniformBuf=n,this._bg=o,this._hdrView=i,this._depthView=a}static create(e,t,n){const{device:o}=e,i=o.createBuffer({label:"BlockHighlightUniform",size:oo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),a=o.createBindGroupLayout({label:"BlockHighlightBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),l=o.createBindGroup({label:"BlockHighlightBG",layout:a,entries:[{binding:0,resource:{buffer:i}}]}),c=o.createShaderModule({label:"BlockHighlightShader",code:Pa}),d=o.createPipelineLayout({bindGroupLayouts:[a]}),f={format:"depth32float",depthWriteEnabled:!1,depthCompare:"less-equal"},p={color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}},h=o.createRenderPipeline({label:"BlockHighlightFacePipeline",layout:d,vertex:{module:c,entryPoint:"vs_face"},fragment:{module:c,entryPoint:"fs_face",targets:[{format:le,blend:p}]},primitive:{topology:"triangle-list",cullMode:"none"},depthStencil:f}),_=o.createRenderPipeline({label:"BlockHighlightEdgePipeline",layout:d,vertex:{module:c,entryPoint:"vs_edge"},fragment:{module:c,entryPoint:"fs_edge",targets:[{format:le,blend:p}]},primitive:{topology:"triangle-list",cullMode:"none"},depthStencil:f});return new Kr(h,_,i,l,t,n)}setCrackStage(e){this._crackStage=Math.max(0,Math.min(9,Math.floor(e)))}update(e,t,n){if(!n){this._active=!1;return}this._active=!0;const o=this._scratch;o.set(t.data,0),o[16]=n.x,o[17]=n.y,o[18]=n.z,o[19]=this._crackStage,e.queue.writeBuffer(this._uniformBuf,0,o.buffer)}execute(e,t){if(!this._active)return;const n=e.beginRenderPass({label:"BlockHighlightPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._depthView,depthLoadOp:"load",depthStoreOp:"store"}});n.setBindGroup(0,this._bg),n.setPipeline(this._facePipeline),n.draw(36),n.setPipeline(this._edgePipeline),n.draw(144),n.end()}destroy(){this._uniformBuf.destroy()}}const Ga=`// Cloud + sky pass — fullscreen triangle.\r
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
// Rotate XZ around Y by ~37° so the Perlin noise grid doesn't align with world\r
// axes, which would otherwise produce visible hard edges along X=0 and Z=0.\r
const ROT_C: f32 = 0.79863551;\r
const ROT_S: f32 = 0.60181502;\r
fn rotate_xz(p: vec3<f32>) -> vec3<f32> {\r
  return vec3<f32>(p.x * ROT_C - p.z * ROT_S, p.y, p.x * ROT_S + p.z * ROT_C);\r
}\r
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
  let pr = rotate_xz(rotate_xz(p));\r
  // Large-scale pass (3× coarser) — creates some very big cloud masses.\r
  // Drifts at half wind speed for natural differential parallax with smaller clouds.\r
  let pw_large = sample_pw((pr + wind * 0.5) * 0.012);\r
  // Medium-scale pass — smaller individual clouds.\r
  let pw_med = sample_pw((pr + wind) * 0.04);\r
  // Blend: large scale dominates shape; medium adds smaller clouds in sparser areas.\r
  let pw = pw_large * 0.6 + pw_med * 0.4;\r
  let hg = height_gradient(p.y);\r
  let cov = saturate(remap(pw, 1.0 - cloud.coverage, 1.0, 0.0, 1.0)) * hg;\r
  if (cov < 0.001) { return 0.0; }\r
  let detail_uv = pr * 0.12 + wind * 0.1;\r
  let det = textureSampleLevel(detail_noise, noise_samp, detail_uv, 0.0);\r
  let detail = det.r * 0.5 + det.g * 0.25 + det.b * 0.125;\r
  return max(0.0, cov - (1.0 - cov) * detail * 0.3) * cloud.density;\r
}\r
\r
fn sample_density_coarse(p: vec3<f32>) -> f32 {\r
  let wind     = vec3<f32>(cloud.windOffset.x, 0.0, cloud.windOffset.y);\r
  let pr       = rotate_xz(p);\r
  let pw_large = sample_pw((pr + wind * 0.5) * 0.012);\r
  let pw_med   = sample_pw((pr + wind) * 0.04);\r
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
`,io=96,ao=48,so=32;class Jr extends Se{constructor(e,t,n,o,i,a,l,c,d){super();s(this,"name","CloudPass");s(this,"_pipeline");s(this,"_hdrView");s(this,"_cameraBuffer");s(this,"_cloudBuffer");s(this,"_lightBuffer");s(this,"_sceneBG");s(this,"_lightBG");s(this,"_depthBG");s(this,"_noiseSkyBG");s(this,"_cameraScratch",new Float32Array(io/4));s(this,"_lightScratch",new Float32Array(so/4));s(this,"_settingsScratch",new Float32Array(ao/4));this._pipeline=e,this._hdrView=t,this._cameraBuffer=n,this._cloudBuffer=o,this._lightBuffer=i,this._sceneBG=a,this._lightBG=l,this._depthBG=c,this._noiseSkyBG=d}static create(e,t,n,o){const{device:i}=e,a=i.createBuffer({label:"CloudCameraBuffer",size:io,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),l=i.createBuffer({label:"CloudUniformBuffer",size:ao,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),c=i.createBuffer({label:"CloudLightBuffer",size:so,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),d=i.createBindGroupLayout({label:"CloudSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),f=i.createBindGroupLayout({label:"CloudLightBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),p=i.createBindGroupLayout({label:"CloudDepthBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),h=i.createBindGroupLayout({label:"CloudNoiseSkyBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),_=i.createSampler({label:"CloudNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"mirror-repeat",addressModeV:"mirror-repeat",addressModeW:"mirror-repeat"}),m=i.createSampler({label:"CloudDepthSampler"}),b=i.createBindGroup({label:"CloudSceneBG",layout:d,entries:[{binding:0,resource:{buffer:a}},{binding:1,resource:{buffer:l}}]}),v=i.createBindGroup({label:"CloudLightBG",layout:f,entries:[{binding:0,resource:{buffer:c}}]}),y=i.createBindGroup({label:"CloudDepthBG",layout:p,entries:[{binding:0,resource:n},{binding:1,resource:m}]}),w=i.createBindGroup({label:"CloudNoiseSkyBG",layout:h,entries:[{binding:0,resource:o.baseView},{binding:1,resource:o.detailView},{binding:2,resource:_}]}),S=i.createShaderModule({label:"CloudShader",code:Ga}),x=i.createRenderPipeline({label:"CloudPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[d,f,p,h]}),vertex:{module:S,entryPoint:"vs_main"},fragment:{module:S,entryPoint:"fs_main",targets:[{format:le}]},primitive:{topology:"triangle-list"}});return new Jr(x,t,a,l,c,b,v,y,w)}updateCamera(e,t,n,o,i){const a=this._cameraScratch;a.set(t.data,0),a[16]=n.x,a[17]=n.y,a[18]=n.z,a[19]=o,a[20]=i,e.queue.writeBuffer(this._cameraBuffer,0,a.buffer)}updateLight(e,t,n,o){const i=this._lightScratch;i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=o,i[4]=n.x,i[5]=n.y,i[6]=n.z,e.queue.writeBuffer(this._lightBuffer,0,i.buffer)}updateSettings(e,t){const n=this._settingsScratch;n[0]=t.cloudBase,n[1]=t.cloudTop,n[2]=t.coverage,n[3]=t.density,n[4]=t.windOffset[0],n[5]=t.windOffset[1],n[6]=t.anisotropy,n[7]=t.extinction,n[8]=t.ambientColor[0],n[9]=t.ambientColor[1],n[10]=t.ambientColor[2],n[11]=t.exposure,e.queue.writeBuffer(this._cloudBuffer,0,n.buffer)}execute(e,t){const n=e.beginRenderPass({label:"CloudPass",colorAttachments:[{view:this._hdrView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._sceneBG),n.setBindGroup(1,this._lightBG),n.setBindGroup(2,this._depthBG),n.setBindGroup(3,this._noiseSkyBG),n.draw(3),n.end()}destroy(){this._cameraBuffer.destroy(),this._cloudBuffer.destroy(),this._lightBuffer.destroy()}}const Ta=`// Cloud shadow pass — renders a top-down cloud transmittance map (1024×1024 r8unorm).\r
// For each texel, marches 32 steps vertically through the cloud slab and accumulates\r
// optical depth, then outputs Beer's-law transmittance.\r
\r
const PI: f32 = 3.14159265358979323846;\r
\r
const ROT_C: f32 = 0.79863551;\r
const ROT_S: f32 = 0.60181502;\r
fn rotate_xz(p: vec3<f32>) -> vec3<f32> {\r
  return vec3<f32>(p.x * ROT_C - p.z * ROT_S, p.y, p.x * ROT_S + p.z * ROT_C);\r
}\r
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
  let pr = rotate_xz(world_pos);\r
  let scale = 0.04;\r
  let base_uv = (pr + vec3<f32>(params.windOffset.x, 0.0, params.windOffset.y)) * scale;\r
  let base = textureSampleLevel(base_noise, noise_samp, base_uv, 0.0);\r
\r
  // Perlin-Worley blend\r
  let pw = base.r * 0.625 + (1.0 - base.g) * 0.25 + (1.0 - base.b) * 0.125;\r
  let hg = height_gradient(world_pos.y);\r
  let cov = saturate(remap(pw, 1.0 - params.coverage, 1.0, 0.0, 1.0)) * hg;\r
  if (cov < 0.001) { return 0.0; }\r
\r
  let detail_scale = 0.12;\r
  let detail_uv = pr * detail_scale + vec3<f32>(params.windOffset.x, 0.0, params.windOffset.y) * 0.1;\r
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
`,lo=1024,co="r8unorm",uo=48;class Qr extends Se{constructor(e,t,n,o,i,a){super();s(this,"name","CloudShadowPass");s(this,"shadowTexture");s(this,"shadowView");s(this,"_pipeline");s(this,"_uniformBuffer");s(this,"_uniformBG");s(this,"_noiseBG");s(this,"_frameCount",0);s(this,"_data",new Float32Array(uo/4));this.shadowTexture=e,this.shadowView=t,this._pipeline=n,this._uniformBuffer=o,this._uniformBG=i,this._noiseBG=a}static create(e,t){const{device:n}=e,o=n.createTexture({label:"CloudShadowTexture",size:{width:lo,height:lo},format:co,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),i=o.createView(),a=n.createBuffer({label:"CloudShadowUniform",size:uo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),l=n.createBindGroupLayout({label:"CloudShadowUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),c=n.createSampler({label:"CloudNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"mirror-repeat",addressModeV:"mirror-repeat",addressModeW:"mirror-repeat"}),d=n.createBindGroupLayout({label:"CloudShadowNoiseBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),f=n.createBindGroup({label:"CloudShadowUniformBG",layout:l,entries:[{binding:0,resource:{buffer:a}}]}),p=n.createBindGroup({label:"CloudShadowNoiseBG",layout:d,entries:[{binding:0,resource:t.baseView},{binding:1,resource:t.detailView},{binding:2,resource:c}]}),h=n.createShaderModule({label:"CloudShadowShader",code:Ta}),_=n.createRenderPipeline({label:"CloudShadowPipeline",layout:n.createPipelineLayout({bindGroupLayouts:[l,d]}),vertex:{module:h,entryPoint:"vs_main"},fragment:{module:h,entryPoint:"fs_main",targets:[{format:co}]},primitive:{topology:"triangle-list"}});return new Qr(o,i,_,a,f,p)}update(e,t,n,o){this._data[0]=t.cloudBase,this._data[1]=t.cloudTop,this._data[2]=t.coverage,this._data[3]=t.density,this._data[4]=t.windOffset[0],this._data[5]=t.windOffset[1],this._data[6]=n[0],this._data[7]=n[1],this._data[8]=o,this._data[9]=t.extinction,e.queue.writeBuffer(this._uniformBuffer,0,this._data.buffer)}execute(e,t){if(this._frameCount++%2!==0)return;const n=e.beginRenderPass({label:"CloudShadowPass",colorAttachments:[{view:this.shadowView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._uniformBG),n.setBindGroup(1,this._noiseBG),n.draw(3),n.end()}destroy(){this.shadowTexture.destroy(),this._uniformBuffer.destroy()}}const Ma=`// TAA resolve pass — fullscreen triangle, blends current HDR with reprojected history.\r
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
`,fo=128;class en extends Se{constructor(e,t,n,o,i,a,l,c,d,f){super();s(this,"name","TAAPass");s(this,"_resolved");s(this,"resolvedView");s(this,"_history");s(this,"_historyView");s(this,"_pipeline");s(this,"_uniformBuffer");s(this,"_uniformBG");s(this,"_textureBG");s(this,"_width");s(this,"_height");s(this,"_scratch",new Float32Array(fo/4));this._resolved=e,this.resolvedView=t,this._history=n,this._historyView=o,this._pipeline=i,this._uniformBuffer=a,this._uniformBG=l,this._textureBG=c,this._width=d,this._height=f}get historyView(){return this._historyView}static create(e,t,n){const{device:o,width:i,height:a}=e,l=o.createTexture({label:"TAA Resolved",size:{width:i,height:a},format:le,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),c=o.createTexture({label:"TAA History",size:{width:i,height:a},format:le,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),d=l.createView(),f=c.createView(),p=o.createBuffer({label:"TAAUniformBuffer",size:fo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),h=o.createBindGroupLayout({label:"TAAUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),_=o.createBindGroupLayout({label:"TAATextureBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),m=o.createSampler({label:"TAALinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),b=o.createBindGroup({layout:h,entries:[{binding:0,resource:{buffer:p}}]}),v=o.createBindGroup({layout:_,entries:[{binding:0,resource:t.hdrView},{binding:1,resource:f},{binding:2,resource:n.depthView},{binding:3,resource:m}]}),y=o.createShaderModule({label:"TAAShader",code:Ma}),w=o.createRenderPipeline({label:"TAAPipeline",layout:o.createPipelineLayout({bindGroupLayouts:[h,_]}),vertex:{module:y,entryPoint:"vs_main"},fragment:{module:y,entryPoint:"fs_main",targets:[{format:le}]},primitive:{topology:"triangle-list"}});return new en(l,d,c,f,w,p,b,v,i,a)}updateCamera(e,t,n){const o=this._scratch;o.set(t.data,0),o.set(n.data,16),e.queue.writeBuffer(this._uniformBuffer,0,o.buffer)}execute(e,t){const n=e.beginRenderPass({label:"TAAPass",colorAttachments:[{view:this.resolvedView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._uniformBG),n.setBindGroup(1,this._textureBG),n.draw(3),n.end(),e.copyTextureToTexture({texture:this._resolved},{texture:this._history},{width:this._width,height:this._height})}destroy(){this._resolved.destroy(),this._history.destroy(),this._uniformBuffer.destroy()}}const Ea=`// Bloom: prefilter (downsample + threshold) and separable Gaussian blur.\r
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
`,Aa=`// Bloom composite: adds the blurred bright regions back to the source HDR.\r
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
`,Ua=16;class tn extends Se{constructor(e,t,n,o,i,a,l,c,d,f,p,h,_,m,b){super();s(this,"name","BloomPass");s(this,"resultView");s(this,"_result");s(this,"_half1");s(this,"_half2");s(this,"_half1View");s(this,"_half2View");s(this,"_prefilterPipeline");s(this,"_blurHPipeline");s(this,"_blurVPipeline");s(this,"_compositePipeline");s(this,"_uniformBuffer");s(this,"_scratch",new Float32Array(4));s(this,"_prefilterBG");s(this,"_blurHBG");s(this,"_blurVBG");s(this,"_compositeBG");this._result=e,this.resultView=t,this._half1=n,this._half1View=o,this._half2=i,this._half2View=a,this._prefilterPipeline=l,this._blurHPipeline=c,this._blurVPipeline=d,this._compositePipeline=f,this._uniformBuffer=p,this._prefilterBG=h,this._blurHBG=_,this._blurVBG=m,this._compositeBG=b}static create(e,t){const{device:n,width:o,height:i}=e,a=Math.max(1,o>>1),l=Math.max(1,i>>1),c=n.createTexture({label:"BloomHalf1",size:{width:a,height:l},format:le,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),d=n.createTexture({label:"BloomHalf2",size:{width:a,height:l},format:le,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),f=n.createTexture({label:"BloomResult",size:{width:o,height:i},format:le,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),p=c.createView(),h=d.createView(),_=f.createView(),m=n.createBuffer({label:"BloomUniforms",size:Ua,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});n.queue.writeBuffer(m,0,new Float32Array([1,.5,.3,0]).buffer);const b=n.createSampler({label:"BloomSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),v=n.createBindGroupLayout({label:"BloomSingleBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),y=n.createBindGroupLayout({label:"BloomCompositeBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),w=n.createShaderModule({label:"BloomShader",code:Ea}),S=n.createShaderModule({label:"BloomComposite",code:Aa}),x=n.createPipelineLayout({bindGroupLayouts:[v]}),k=n.createPipelineLayout({bindGroupLayouts:[y]});function C(G,q){return n.createRenderPipeline({label:q,layout:x,vertex:{module:w,entryPoint:"vs_main"},fragment:{module:w,entryPoint:G,targets:[{format:le}]},primitive:{topology:"triangle-list"}})}const E=C("fs_prefilter","BloomPrefilterPipeline"),I=C("fs_blur_h","BloomBlurHPipeline"),U=C("fs_blur_v","BloomBlurVPipeline"),g=n.createRenderPipeline({label:"BloomCompositePipeline",layout:k,vertex:{module:S,entryPoint:"vs_main"},fragment:{module:S,entryPoint:"fs_main",targets:[{format:le}]},primitive:{topology:"triangle-list"}});function A(G){return n.createBindGroup({layout:v,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:G},{binding:2,resource:b}]})}const P=A(t),T=A(p),B=A(h),N=n.createBindGroup({layout:y,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:t},{binding:2,resource:p},{binding:3,resource:b}]});return new tn(f,_,c,p,d,h,E,I,U,g,m,P,T,B,N)}updateParams(e,t=1,n=.5,o=.3){this._scratch[0]=t,this._scratch[1]=n,this._scratch[2]=o,this._scratch[3]=0,e.queue.writeBuffer(this._uniformBuffer,0,this._scratch.buffer)}execute(e,t){const n=(o,i,a,l)=>{const c=e.beginRenderPass({label:o,colorAttachments:[{view:i,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});c.setPipeline(a),c.setBindGroup(0,l),c.draw(3),c.end()};n("BloomPrefilter",this._half1View,this._prefilterPipeline,this._prefilterBG);for(let o=0;o<2;o++)n("BloomBlurH",this._half2View,this._blurHPipeline,this._blurHBG),n("BloomBlurV",this._half1View,this._blurVPipeline,this._blurVBG);n("BloomComposite",this.resultView,this._compositePipeline,this._compositeBG)}destroy(){this._result.destroy(),this._half1.destroy(),this._half2.destroy(),this._uniformBuffer.destroy()}}const ka=`// godray_march.wgsl — Half-resolution ray-march pass with 3D cloud-density shadowing\r
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
  scattering: f32,\r
  max_steps : f32,\r
  _pad0     : f32,\r
  _pad1     : f32,\r
}\r
\r
struct CloudDensityUniforms {\r
  cloudBase : f32,\r
  cloudTop  : f32,\r
  coverage  : f32,\r
  density   : f32,\r
  windOffset: vec2<f32>,\r
  extinction: f32,\r
  _pad0     : f32,\r
  _pad1     : f32,\r
  _pad2     : f32,\r
  _pad3     : f32,\r
  _pad4     : f32,\r
  _pad5     : f32,\r
  _pad6     : f32,\r
  _pad7     : f32,\r
}\r
\r
@group(0) @binding(0) var<uniform> camera         : CameraUniforms;\r
@group(0) @binding(1) var<uniform> light           : LightUniforms;\r
@group(0) @binding(2) var          depth_tex       : texture_depth_2d;\r
@group(0) @binding(3) var          shadow_map      : texture_depth_2d_array;\r
@group(0) @binding(4) var          shadow_samp     : sampler_comparison;\r
@group(0) @binding(5) var<uniform> march_params    : MarchParams;\r
@group(0) @binding(6) var<uniform> cloud_density   : CloudDensityUniforms;\r
@group(0) @binding(7) var          base_noise      : texture_3d<f32>;\r
@group(0) @binding(8) var          detail_noise    : texture_3d<f32>;\r
@group(0) @binding(9) var          noise_samp      : sampler;\r
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
fn henyey_greenstein(cos_theta: f32, g: f32) -> f32 {\r
  let k = 0.0795774715459;\r
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
fn dither(uv: vec2<f32>) -> f32 {\r
  return fract(sin(dot(uv, vec2<f32>(41.0, 289.0))) * 45758.5453);\r
}\r
\r
// ---- Cloud density helpers (mirrors cloud_shadow.wgsl) -----------------------\r
\r
const ROT_C: f32 = 0.79863551;\r
const ROT_S: f32 = 0.60181502;\r
fn rotate_xz(p: vec3<f32>) -> vec3<f32> {\r
  return vec3<f32>(p.x * ROT_C - p.z * ROT_S, p.y, p.x * ROT_S + p.z * ROT_C);\r
}\r
\r
fn remap(v: f32, lo: f32, hi: f32, a: f32, b: f32) -> f32 {\r
  return clamp(a + (v - lo) / max(hi - lo, 0.0001) * (b - a), a, b);\r
}\r
\r
fn height_gradient(y: f32) -> f32 {\r
  let t    = clamp((y - cloud_density.cloudBase) / max(cloud_density.cloudTop - cloud_density.cloudBase, 0.001), 0.0, 1.0);\r
  let base = remap(t, 0.0, 0.07, 0.0, 1.0);\r
  let top  = remap(t, 0.2, 1.0,  1.0, 0.0);\r
  return saturate(base * top);\r
}\r
\r
fn sample_density(world_pos: vec3<f32>) -> f32 {\r
  let pr = rotate_xz(world_pos);\r
  let scale = 0.04;\r
  let base_uv = (pr + vec3<f32>(cloud_density.windOffset.x, 0.0, cloud_density.windOffset.y)) * scale;\r
  let base = textureSampleLevel(base_noise, noise_samp, base_uv, 0.0);\r
\r
  let pw = base.r * 0.625 + (1.0 - base.g) * 0.25 + (1.0 - base.b) * 0.125;\r
  let hg = height_gradient(world_pos.y);\r
  let cov = saturate(remap(pw, 1.0 - cloud_density.coverage, 1.0, 0.0, 1.0)) * hg;\r
  if (cov < 0.001) { return 0.0; }\r
\r
  let detail_scale = 0.12;\r
  let detail_uv = pr * detail_scale + vec3<f32>(cloud_density.windOffset.x, 0.0, cloud_density.windOffset.y) * 0.1;\r
  let det = textureSampleLevel(detail_noise, noise_samp, detail_uv, 0.0);\r
  let detail = det.r * 0.5 + det.g * 0.25 + det.b * 0.125;\r
\r
  return max(0.0, cov - (1.0 - cov) * detail * 0.3) * cloud_density.density;\r
}\r
\r
// Integrates cloud density vertically above p through the full cloud slab.\r
// Returns the Beer's-law transmittance (1 = fully transparent, 0 = fully opaque).\r
fn cloud_shadow_vertical(p: vec3<f32>) -> f32 {\r
  let start_y = max(p.y, cloud_density.cloudBase);\r
  if (start_y >= cloud_density.cloudTop) { return 1.0; }\r
  let range = cloud_density.cloudTop - start_y;\r
  let num_steps = 4u;\r
  let step_size = range / f32(num_steps);\r
  var opt_depth = 0.0;\r
  for (var i = 0u; i < num_steps; i++) {\r
    let y = start_y + (f32(i) + 0.5) * step_size;\r
    opt_depth += sample_density(vec3<f32>(p.x, y, p.z)) * step_size;\r
  }\r
  return exp(-opt_depth * cloud_density.extinction);\r
}\r
\r
// ---- Fragment shader ---------------------------------------------------------\r
\r
@fragment\r
fn fs_march(in: VertexOutput) -> @location(0) vec4<f32> {\r
  let depth_size = vec2<i32>(textureDimensions(depth_tex));\r
  let coord      = clamp(vec2<i32>(in.uv * vec2<f32>(depth_size)),\r
                         vec2<i32>(0), depth_size - vec2<i32>(1));\r
  let depth = textureLoad(depth_tex, coord, 0u);\r
\r
  let hit_depth = select(depth, 1.0, depth >= 1.0);\r
  let world_pos = reconstruct_world_pos(in.uv, hit_depth);\r
  let ray_vec   = world_pos - camera.position;\r
  let ray_len   = length(ray_vec);\r
  let ray_dir   = ray_vec / max(ray_len, 0.001);\r
\r
  let steps     = u32(march_params.max_steps);\r
  let step_len  = ray_len / f32(steps);\r
  let dith      = dither(in.uv) * step_len;\r
  var pos       = camera.position + ray_dir * dith;\r
\r
  let sun_dir   = normalize(-light.direction);\r
  let cos_theta = dot(ray_dir, sun_dir);\r
  let phase     = henyey_greenstein(cos_theta, march_params.scattering);\r
\r
  var accum = 0.0;\r
  for (var i = 0u; i < steps; i++) {\r
    let shad     = shadow_at(pos);\r
    let trans    = cloud_shadow_vertical(pos);\r
    accum += phase * shad * trans;\r
    pos   += ray_dir * step_len;\r
  }\r
\r
  let fog = clamp(accum / f32(steps), 0.0, 1.0);\r
  return vec4<f32>(fog, 0.0, 0.0, 1.0);\r
}\r
`,Ca=`// godray_composite.wgsl — Blur and composite passes for volumetric godrays.\r
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
\r
  // Sky pixels: sample fog directly without depth-aware neighbor logic.\r
  if (depth0 >= 1.0) {\r
    var fog = textureSampleLevel(fog_tex, samp, in.uv, 0.0).r;\r
    fog = pow(max(fog, 0.0), params.fog_curve);\r
    let horizon_fade = smoothstep(-0.05, 0.05, -light.direction.y);\r
    let fog_color = light.color * light.intensity * fog * horizon_fade;\r
    return vec4<f32>(fog_color, 0.0);\r
  }\r
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
`,Pt=le,zt=16,La=64;class rn extends Se{constructor(e,t,n,o,i,a,l,c,d,f,p,h,_,m,b,v,y,w){super();s(this,"name","GodrayPass");s(this,"scattering",.3);s(this,"fogCurve",2);s(this,"maxSteps",16);s(this,"_fogA");s(this,"_fogB");s(this,"_fogAView");s(this,"_fogBView");s(this,"_hdrView");s(this,"_marchPipeline");s(this,"_blurHPipeline");s(this,"_blurVPipeline");s(this,"_compositePipeline");s(this,"_marchBG");s(this,"_blurHBG");s(this,"_blurVBG");s(this,"_compositeBG");s(this,"_marchParamsBuf");s(this,"_blurHParamsBuf");s(this,"_blurVParamsBuf");s(this,"_compParamsBuf");s(this,"_cloudDensityBuf");s(this,"_marchScratch",new Float32Array(4));s(this,"_compScratch",new Float32Array(4));s(this,"_densityScratch",new Float32Array(8));this._fogA=e,this._fogAView=t,this._fogB=n,this._fogBView=o,this._hdrView=i,this._marchPipeline=a,this._blurHPipeline=l,this._blurVPipeline=c,this._compositePipeline=d,this._marchBG=f,this._blurHBG=p,this._blurVBG=h,this._compositeBG=_,this._marchParamsBuf=m,this._blurHParamsBuf=b,this._blurVParamsBuf=v,this._compParamsBuf=y,this._cloudDensityBuf=w}static create(e,t,n,o,i,a,l){const{device:c,width:d,height:f}=e,p=Math.max(1,d>>1),h=Math.max(1,f>>1),_=c.createTexture({label:"GodrayFogA",size:{width:p,height:h},format:Pt,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),m=c.createTexture({label:"GodrayFogB",size:{width:p,height:h},format:Pt,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),b=_.createView(),v=m.createView(),y=c.createSampler({label:"GodraySampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),w=c.createSampler({label:"GodrayNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"mirror-repeat",addressModeV:"mirror-repeat",addressModeW:"mirror-repeat"}),S=c.createSampler({label:"GodrayCmpSampler",compare:"less-equal",magFilter:"linear",minFilter:"linear"}),x=c.createBuffer({label:"GodrayCloudDensity",size:La,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),k=c.createBuffer({label:"GodrayMarchParams",size:zt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});c.queue.writeBuffer(k,0,new Float32Array([.3,16,0,0]).buffer);const C=c.createBuffer({label:"GodrayBlurHParams",size:zt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});c.queue.writeBuffer(C,0,new Float32Array([1,0,0,0]).buffer);const E=c.createBuffer({label:"GodrayBlurVParams",size:zt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});c.queue.writeBuffer(E,0,new Float32Array([0,1,0,0]).buffer);const I=c.createBuffer({label:"GodrayCompositeParams",size:zt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});c.queue.writeBuffer(I,0,new Float32Array([0,0,2,0]).buffer);const U=c.createShaderModule({label:"GodrayMarchShader",code:ka}),g=c.createRenderPipeline({label:"GodrayMarchPipeline",layout:"auto",vertex:{module:U,entryPoint:"vs_main"},fragment:{module:U,entryPoint:"fs_march",targets:[{format:Pt}]},primitive:{topology:"triangle-list"}}),A=c.createBindGroup({label:"GodrayMarchBG",layout:g.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:a}},{binding:2,resource:t.depthView},{binding:3,resource:n.shadowMapView},{binding:4,resource:S},{binding:5,resource:{buffer:k}},{binding:6,resource:{buffer:x}},{binding:7,resource:l.baseView},{binding:8,resource:l.detailView},{binding:9,resource:w}]}),P=c.createShaderModule({label:"GodrayCompositeShader",code:Ca}),T=c.createRenderPipeline({label:"GodrayBlurHPipeline",layout:"auto",vertex:{module:P,entryPoint:"vs_main"},fragment:{module:P,entryPoint:"fs_blur",targets:[{format:Pt}]},primitive:{topology:"triangle-list"}}),B=c.createRenderPipeline({label:"GodrayBlurVPipeline",layout:"auto",vertex:{module:P,entryPoint:"vs_main"},fragment:{module:P,entryPoint:"fs_blur",targets:[{format:Pt}]},primitive:{topology:"triangle-list"}}),N=c.createRenderPipeline({label:"GodrayCompositePipeline",layout:"auto",vertex:{module:P,entryPoint:"vs_main"},fragment:{module:P,entryPoint:"fs_composite",targets:[{format:le,blend:{color:{operation:"add",srcFactor:"one",dstFactor:"one"},alpha:{operation:"add",srcFactor:"one",dstFactor:"one"}}}]},primitive:{topology:"triangle-list"}}),G=c.createBindGroup({label:"GodrayBlurHBG",layout:T.getBindGroupLayout(0),entries:[{binding:0,resource:b},{binding:1,resource:t.depthView},{binding:2,resource:y},{binding:3,resource:{buffer:C}}]}),q=c.createBindGroup({label:"GodrayBlurVBG",layout:B.getBindGroupLayout(0),entries:[{binding:0,resource:v},{binding:1,resource:t.depthView},{binding:2,resource:y},{binding:3,resource:{buffer:E}}]}),O=c.createBindGroup({label:"GodrayCompositeBG",layout:N.getBindGroupLayout(0),entries:[{binding:0,resource:b},{binding:1,resource:t.depthView},{binding:2,resource:y},{binding:3,resource:{buffer:I}},{binding:4,resource:{buffer:a}}]});return new rn(_,b,m,v,o,g,T,B,N,A,G,q,O,k,C,E,I,x)}updateParams(e){this._marchScratch[0]=this.scattering,this._marchScratch[1]=this.maxSteps,this._marchScratch[2]=0,this._marchScratch[3]=0,e.queue.writeBuffer(this._marchParamsBuf,0,this._marchScratch.buffer),this._compScratch[0]=0,this._compScratch[1]=0,this._compScratch[2]=this.fogCurve,this._compScratch[3]=0,e.queue.writeBuffer(this._compParamsBuf,0,this._compScratch.buffer)}updateCloudDensity(e,t){const n=this._densityScratch;n[0]=t.cloudBase,n[1]=t.cloudTop,n[2]=t.coverage,n[3]=t.density,n[4]=t.windOffset[0],n[5]=t.windOffset[1],n[6]=t.extinction,n[7]=0,e.queue.writeBuffer(this._cloudDensityBuf,0,n.buffer)}execute(e,t){const n=(o,i,a,l,c=!0)=>{const d=e.beginRenderPass({label:o,colorAttachments:[{view:i,clearValue:[0,0,0,0],loadOp:c?"clear":"load",storeOp:"store"}]});d.setPipeline(a),d.setBindGroup(0,l),d.draw(3),d.end()};n("GodrayMarch",this._fogAView,this._marchPipeline,this._marchBG),n("GodrayBlurH",this._fogBView,this._blurHPipeline,this._blurHBG),n("GodrayBlurV",this._fogAView,this._blurVPipeline,this._blurVBG),n("GodrayComposite",this._hdrView,this._compositePipeline,this._compositeBG,!1)}destroy(){this._fogA.destroy(),this._fogB.destroy(),this._marchParamsBuf.destroy(),this._blurHParamsBuf.destroy(),this._blurVParamsBuf.destroy(),this._compParamsBuf.destroy(),this._cloudDensityBuf.destroy()}}const Ra=`// composite.wgsl — Fog + Underwater + Tonemap merged into a single full-screen draw.\r
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
`,po=64,ho=96;class nn extends Se{constructor(e,t,n,o,i,a){super();s(this,"name","CompositePass");s(this,"depthFogEnabled",!0);s(this,"depthDensity",1);s(this,"depthBegin",32);s(this,"depthEnd",128);s(this,"depthCurve",1.5);s(this,"heightFogEnabled",!1);s(this,"heightDensity",.7);s(this,"heightMin",48);s(this,"heightMax",80);s(this,"heightCurve",1);s(this,"fogColor",[1,1,1]);s(this,"_pipeline");s(this,"_bg0");s(this,"_bg1");s(this,"_bg2");s(this,"_paramsBuf");s(this,"_starBuf");s(this,"_paramsAB",new ArrayBuffer(po));s(this,"_paramsF",new Float32Array(this._paramsAB));s(this,"_paramsU",new Uint32Array(this._paramsAB));s(this,"_starScratch",new Float32Array(ho/4));this._pipeline=e,this._bg0=t,this._bg1=n,this._bg2=o,this._paramsBuf=i,this._starBuf=a}static create(e,t,n,o,i,a,l){const{device:c,format:d}=e,f=c.createBindGroupLayout({label:"CompositeBGL0",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),p=c.createBindGroupLayout({label:"CompositeBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),h=c.createBindGroupLayout({label:"CompositeBGL2",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),_=c.createSampler({label:"CompositeSampler",magFilter:"linear",minFilter:"linear"}),m=c.createBuffer({label:"CompositeParams",size:po,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),b=c.createBuffer({label:"CompositeStars",size:ho,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),v=c.createBindGroup({label:"CompositeBG0",layout:f,entries:[{binding:0,resource:t},{binding:1,resource:n},{binding:2,resource:o},{binding:3,resource:_}]}),y=c.createBindGroup({label:"CompositeBG1",layout:p,entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:a}}]}),w=c.createBindGroup({label:"CompositeBG2",layout:h,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:b}},{binding:2,resource:{buffer:l}}]}),S=c.createShaderModule({label:"CompositeShader",code:Ra}),x=c.createPipelineLayout({bindGroupLayouts:[f,p,h]}),k=c.createRenderPipeline({label:"CompositePipeline",layout:x,vertex:{module:S,entryPoint:"vs_main"},fragment:{module:S,entryPoint:"fs_main",targets:[{format:d}]},primitive:{topology:"triangle-list"}});return new nn(k,v,y,w,m,b)}updateParams(e,t,n,o,i,a){const l=this._paramsF,c=this._paramsU;let d=0;this.depthFogEnabled&&(d|=1),this.heightFogEnabled&&(d|=2);let f=0;o&&(f|=1),i&&(f|=2),a&&(f|=4),l[0]=this.fogColor[0],l[1]=this.fogColor[1],l[2]=this.fogColor[2],l[3]=this.depthDensity,l[4]=this.depthBegin,l[5]=this.depthEnd,l[6]=this.depthCurve,l[7]=this.heightDensity,l[8]=this.heightMin,l[9]=this.heightMax,l[10]=this.heightCurve,c[11]=d,l[12]=n,l[13]=t?1:0,c[14]=f,l[15]=0,e.queue.writeBuffer(this._paramsBuf,0,this._paramsAB)}updateStars(e,t,n,o){const i=this._starScratch;i.set(t.data,0),i[16]=n.x,i[17]=n.y,i[18]=n.z,i[19]=0,i[20]=o.x,i[21]=o.y,i[22]=o.z,i[23]=0,e.queue.writeBuffer(this._starBuf,0,i.buffer)}execute(e,t){const n=e.beginRenderPass({label:"CompositePass",colorAttachments:[{view:t.getCurrentTexture().createView(),clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._bg0),n.setBindGroup(1,this._bg1),n.setBindGroup(2,this._bg2),n.draw(3),n.end()}destroy(){this._paramsBuf.destroy(),this._starBuf.destroy()}}const _o=64*4+16+16,Na=128;class on extends Se{constructor(e,t,n,o,i){super();s(this,"name","GeometryPass");s(this,"_gbuffer");s(this,"_cameraBGL");s(this,"_modelBGL");s(this,"_pipelineCache",new Map);s(this,"_cameraBuffer");s(this,"_cameraBindGroup");s(this,"_modelBuffers",[]);s(this,"_modelBindGroups",[]);s(this,"_drawItems",[]);s(this,"_modelData",new Float32Array(32));s(this,"_cameraScratch",new Float32Array(_o/4));this._gbuffer=e,this._cameraBGL=t,this._modelBGL=n,this._cameraBuffer=o,this._cameraBindGroup=i}static create(e,t){const{device:n}=e,o=n.createBindGroupLayout({label:"GeomCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),i=n.createBindGroupLayout({label:"GeomModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),a=n.createBuffer({label:"GeomCameraBuffer",size:_o,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),l=n.createBindGroup({label:"GeomCameraBindGroup",layout:o,entries:[{binding:0,resource:{buffer:a}}]});return new on(t,o,i,a,l)}setDrawItems(e){this._drawItems=e}updateCamera(e,t,n,o,i,a,l,c){const d=this._cameraScratch;d.set(t.data,0),d.set(n.data,16),d.set(o.data,32),d.set(i.data,48),d[64]=a.x,d[65]=a.y,d[66]=a.z,d[67]=l,d[68]=c,e.queue.writeBuffer(this._cameraBuffer,0,d.buffer)}execute(e,t){var i,a;const{device:n}=t;this._ensurePerDrawBuffers(n,this._drawItems.length);for(let l=0;l<this._drawItems.length;l++){const c=this._drawItems[l],d=this._modelData;d.set(c.modelMatrix.data,0),d.set(c.normalMatrix.data,16),t.queue.writeBuffer(this._modelBuffers[l],0,d.buffer),(a=(i=c.material).update)==null||a.call(i,t.queue)}const o=e.beginRenderPass({label:"GeometryPass",colorAttachments:[{view:this._gbuffer.albedoRoughnessView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"},{view:this._gbuffer.normalMetallicView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});o.setBindGroup(0,this._cameraBindGroup);for(let l=0;l<this._drawItems.length;l++){const c=this._drawItems[l];o.setPipeline(this._getPipeline(n,c.material)),o.setBindGroup(1,this._modelBindGroups[l]),o.setBindGroup(2,c.material.getBindGroup(n)),o.setVertexBuffer(0,c.mesh.vertexBuffer),o.setIndexBuffer(c.mesh.indexBuffer,"uint32"),o.drawIndexed(c.mesh.indexCount)}o.end()}_getPipeline(e,t){let n=this._pipelineCache.get(t.shaderId);if(n)return n;const o=e.createShaderModule({label:`GeometryShader[${t.shaderId}]`,code:t.getShaderCode(Et.Geometry)});return n=e.createRenderPipeline({label:`GeometryPipeline[${t.shaderId}]`,layout:e.createPipelineLayout({bindGroupLayouts:[this._cameraBGL,this._modelBGL,t.getBindGroupLayout(e)]}),vertex:{module:o,entryPoint:"vs_main",buffers:[{arrayStride:qr,attributes:Yr}]},fragment:{module:o,entryPoint:"fs_main",targets:[{format:"rgba8unorm"},{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),this._pipelineCache.set(t.shaderId,n),n}_ensurePerDrawBuffers(e,t){for(;this._modelBuffers.length<t;){const n=e.createBuffer({size:Na,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._modelBuffers.push(n),this._modelBindGroups.push(e.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:n}}]}))}}destroy(){this._cameraBuffer.destroy();for(const e of this._modelBuffers)e.destroy()}}const Ia=`// GBuffer fill pass for voxel chunk geometry.\r
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
`,mo=64*4+16+16,Oa=16,Gt=256,Da=2048,Va=5,st=Va*4,Mr=16;class an extends Se{constructor(e,t,n,o,i,a,l,c,d,f){super();s(this,"name","WorldGeometryPass");s(this,"_gbuffer");s(this,"_device");s(this,"_opaquePipeline");s(this,"_transparentPipeline");s(this,"_propPipeline");s(this,"_cameraBuffer");s(this,"_cameraBindGroup");s(this,"_sharedBindGroup");s(this,"_chunkUniformBuffer");s(this,"_chunkBindGroup");s(this,"_slotFreeList",[]);s(this,"_slotHighWater",0);s(this,"_chunks",new Map);s(this,"_frustumPlanes",new Float32Array(24));s(this,"drawCalls",0);s(this,"triangles",0);s(this,"_cameraData",new Float32Array(mo/4));s(this,"_chunkUniformAB",new ArrayBuffer(32));s(this,"_chunkUniformF",new Float32Array(this._chunkUniformAB));s(this,"_chunkUniformU",new Uint32Array(this._chunkUniformAB));s(this,"_debugChunks",!1);this._device=e,this._gbuffer=t,this._opaquePipeline=n,this._transparentPipeline=o,this._propPipeline=i,this._cameraBuffer=a,this._cameraBindGroup=l,this._sharedBindGroup=c,this._chunkUniformBuffer=d,this._chunkBindGroup=f}static create(e,t,n){const{device:o}=e,i=o.createBindGroupLayout({label:"ChunkCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),a=o.createBindGroupLayout({label:"ChunkSharedBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),l=o.createBindGroupLayout({label:"ChunkOffsetBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform",hasDynamicOffset:!0,minBindingSize:32}}]}),c=R.MAX,d=o.createBuffer({label:"BlockDataBuffer",size:Math.max(c*Oa,16),usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),f=pi,p=new Uint32Array(c*4);for(let U=0;U<c;U++){const g=ur[U];g&&(p[U*4+0]=g.sideFace.y*f+g.sideFace.x,p[U*4+1]=g.bottomFace.y*f+g.bottomFace.x,p[U*4+2]=g.topFace.y*f+g.topFace.x)}o.queue.writeBuffer(d,0,p);const h=o.createSampler({label:"ChunkAtlasSampler",magFilter:"nearest",minFilter:"nearest",addressModeU:"repeat",addressModeV:"repeat"}),_=o.createBindGroup({label:"ChunkSharedBG",layout:a,entries:[{binding:0,resource:n.colorAtlas.view},{binding:1,resource:n.normalAtlas.view},{binding:2,resource:n.merAtlas.view},{binding:3,resource:h},{binding:4,resource:{buffer:d}}]}),m=o.createBuffer({label:"ChunkCameraBuffer",size:mo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),b=o.createBindGroup({label:"ChunkCameraBG",layout:i,entries:[{binding:0,resource:{buffer:m}}]}),v=o.createShaderModule({label:"ChunkGeometryShader",code:Ia}),y=o.createPipelineLayout({bindGroupLayouts:[i,a,l]}),w={arrayStride:st,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32"},{shaderLocation:2,offset:16,format:"float32"}]},S=[{format:"rgba8unorm"},{format:"rgba16float"}],x=o.createRenderPipeline({label:"ChunkOpaquePipeline",layout:y,vertex:{module:v,entryPoint:"vs_main",buffers:[w]},fragment:{module:v,entryPoint:"fs_opaque",targets:S},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),k=o.createRenderPipeline({label:"ChunkTransparentPipeline",layout:y,vertex:{module:v,entryPoint:"vs_main",buffers:[w]},fragment:{module:v,entryPoint:"fs_transparent",targets:S},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),C=o.createRenderPipeline({label:"ChunkPropPipeline",layout:y,vertex:{module:v,entryPoint:"vs_prop",buffers:[w]},fragment:{module:v,entryPoint:"fs_prop",targets:S},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}}),E=o.createBuffer({label:"ChunkUniformBuffer",size:Da*Gt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),I=o.createBindGroup({label:"ChunkOffsetBG",layout:l,entries:[{binding:0,resource:{buffer:E,size:32}}]});return new an(o,t,x,k,C,m,b,_,E,I)}updateGBuffer(e){this._gbuffer=e}addChunk(e,t){const n=this._chunks.get(e);n?this._replaceMeshBuffers(n,t):this._chunks.set(e,this._createChunkGpu(e,t))}updateChunk(e,t){const n=this._chunks.get(e);n?this._replaceMeshBuffers(n,t):this._chunks.set(e,this._createChunkGpu(e,t))}removeChunk(e){var n,o,i;const t=this._chunks.get(e);t&&((n=t.opaqueBuffer)==null||n.destroy(),(o=t.transparentBuffer)==null||o.destroy(),(i=t.propBuffer)==null||i.destroy(),this._freeSlot(t.slot),this._chunks.delete(e))}updateCamera(e,t,n,o,i,a,l,c){const d=this._cameraData;d.set(t.data,0),d.set(n.data,16),d.set(o.data,32),d.set(i.data,48),d[64]=a.x,d[65]=a.y,d[66]=a.z,d[67]=l,d[68]=c,e.queue.writeBuffer(this._cameraBuffer,0,d.buffer),this._extractFrustumPlanes(o.data)}_extractFrustumPlanes(e){const t=this._frustumPlanes;t[0]=e[3]+e[0],t[1]=e[7]+e[4],t[2]=e[11]+e[8],t[3]=e[15]+e[12],t[4]=e[3]-e[0],t[5]=e[7]-e[4],t[6]=e[11]-e[8],t[7]=e[15]-e[12],t[8]=e[3]+e[1],t[9]=e[7]+e[5],t[10]=e[11]+e[9],t[11]=e[15]+e[13],t[12]=e[3]-e[1],t[13]=e[7]-e[5],t[14]=e[11]-e[9],t[15]=e[15]-e[13],t[16]=e[2],t[17]=e[6],t[18]=e[10],t[19]=e[14],t[20]=e[3]-e[2],t[21]=e[7]-e[6],t[22]=e[11]-e[10],t[23]=e[15]-e[14]}setDebugChunks(e){if(this._debugChunks!==e){this._debugChunks=e;for(const[t,n]of this._chunks)this._writeChunkUniforms(n.slot,n.ox,n.oy,n.oz)}}_isVisible(e,t,n){const o=this._frustumPlanes,i=e+Mr,a=t+Mr,l=n+Mr;for(let c=0;c<6;c++){const d=o[c*4],f=o[c*4+1],p=o[c*4+2],h=o[c*4+3];if(d*(d>=0?i:e)+f*(f>=0?a:t)+p*(p>=0?l:n)+h<0)return!1}return!0}execute(e,t){const n=e.beginRenderPass({label:"WorldGeometryPass",colorAttachments:[{view:this._gbuffer.albedoRoughnessView,loadOp:"load",storeOp:"store"},{view:this._gbuffer.normalMetallicView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthLoadOp:"load",depthStoreOp:"store"}});n.setBindGroup(0,this._cameraBindGroup),n.setBindGroup(1,this._sharedBindGroup);let o=0,i=0;const a=[];for(const l of this._chunks.values())this._isVisible(l.ox,l.oy,l.oz)&&a.push(l);n.setPipeline(this._opaquePipeline);for(const l of a)l.opaqueBuffer&&l.opaqueCount>0&&(n.setBindGroup(2,this._chunkBindGroup,[l.slot*Gt]),n.setVertexBuffer(0,l.opaqueBuffer),n.draw(l.opaqueCount),o++,i+=l.opaqueCount/3);n.setPipeline(this._transparentPipeline);for(const l of a)l.transparentBuffer&&l.transparentCount>0&&(n.setBindGroup(2,this._chunkBindGroup,[l.slot*Gt]),n.setVertexBuffer(0,l.transparentBuffer),n.draw(l.transparentCount),o++,i+=l.transparentCount/3);n.setPipeline(this._propPipeline);for(const l of a)l.propBuffer&&l.propCount>0&&(n.setBindGroup(2,this._chunkBindGroup,[l.slot*Gt]),n.setVertexBuffer(0,l.propBuffer),n.draw(l.propCount),o++,i+=l.propCount/3);this.drawCalls=o,this.triangles=i,n.end()}destroy(){var e,t,n;this._cameraBuffer.destroy(),this._chunkUniformBuffer.destroy();for(const o of this._chunks.values())(e=o.opaqueBuffer)==null||e.destroy(),(t=o.transparentBuffer)==null||t.destroy(),(n=o.propBuffer)==null||n.destroy();this._chunks.clear()}_allocSlot(){return this._slotFreeList.length>0?this._slotFreeList.pop():this._slotHighWater++}_freeSlot(e){this._slotFreeList.push(e)}_writeChunkUniforms(e,t,n,o){const i=t*73856093^n*19349663^o*83492791,a=(i&255)/255*.6+.4,l=(i>>8&255)/255*.6+.4,c=(i>>16&255)/255*.6+.4,d=this._chunkUniformAB,f=this._chunkUniformF,p=this._chunkUniformU;f[0]=t,f[1]=n,f[2]=o,p[3]=this._debugChunks?1:0,f[4]=a,f[5]=l,f[6]=c,f[7]=0,this._device.queue.writeBuffer(this._chunkUniformBuffer,e*Gt,d)}_createChunkGpu(e,t){const n=this._allocSlot();this._writeChunkUniforms(n,e.globalPosition.x,e.globalPosition.y,e.globalPosition.z);const o={ox:e.globalPosition.x,oy:e.globalPosition.y,oz:e.globalPosition.z,slot:n,opaqueBuffer:null,opaqueCount:0,transparentBuffer:null,transparentCount:0,propBuffer:null,propCount:0};return this._replaceMeshBuffers(o,t),o}_replaceMeshBuffers(e,t){var n,o,i;if((n=e.opaqueBuffer)==null||n.destroy(),(o=e.transparentBuffer)==null||o.destroy(),(i=e.propBuffer)==null||i.destroy(),e.opaqueBuffer=null,e.transparentBuffer=null,e.propBuffer=null,e.opaqueCount=t.opaqueCount,e.transparentCount=t.transparentCount,e.propCount=t.propCount,t.opaqueCount>0){const a=this._device.createBuffer({label:"ChunkOpaqueBuf",size:t.opaqueCount*st,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.opaque.buffer,0,t.opaqueCount*st),e.opaqueBuffer=a}if(t.transparentCount>0){const a=this._device.createBuffer({label:"ChunkTransparentBuf",size:t.transparentCount*st,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.transparent.buffer,0,t.transparentCount*st),e.transparentBuffer=a}if(t.propCount>0){const a=this._device.createBuffer({label:"ChunkPropBuf",size:t.propCount*st,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.prop.buffer,0,t.propCount*st),e.propBuffer=a}}}const za=`// Depth of Field: prefilter (CoC + 2x downsample) then fused disc-blur + composite.\r
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
`,Fa=32;class sn extends Se{constructor(e,t,n,o,i,a,l,c,d,f){super();s(this,"name","DofPass");s(this,"resultView");s(this,"_result");s(this,"_half");s(this,"_halfView");s(this,"_prefilterPipeline");s(this,"_compositePipeline");s(this,"_uniformBuffer");s(this,"_scratch",new Float32Array(8));s(this,"_prefilterBG");s(this,"_compBG0");s(this,"_compBG1");this._result=e,this.resultView=t,this._half=n,this._halfView=o,this._prefilterPipeline=i,this._compositePipeline=a,this._uniformBuffer=l,this._prefilterBG=c,this._compBG0=d,this._compBG1=f}static create(e,t,n){const{device:o,width:i,height:a}=e,l=Math.max(1,i>>1),c=Math.max(1,a>>1),d=o.createTexture({label:"DofHalf",size:{width:l,height:c},format:le,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),f=o.createTexture({label:"DofResult",size:{width:i,height:a},format:le,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),p=d.createView(),h=f.createView(),_=o.createBuffer({label:"DofUniforms",size:Fa,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});o.queue.writeBuffer(_,0,new Float32Array([30,60,6,.1,1e3,0,0,0]).buffer);const m=o.createSampler({label:"DofSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),b=o.createBindGroupLayout({label:"DofBGL0Prefilter",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),v=o.createBindGroupLayout({label:"DofBGL0Composite",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),y=o.createBindGroupLayout({label:"DofBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),w=o.createShaderModule({label:"DofShader",code:za}),S=o.createRenderPipeline({label:"DofPrefilterPipeline",layout:o.createPipelineLayout({bindGroupLayouts:[b]}),vertex:{module:w,entryPoint:"vs_main"},fragment:{module:w,entryPoint:"fs_prefilter",targets:[{format:le}]},primitive:{topology:"triangle-list"}}),x=o.createRenderPipeline({label:"DofCompositePipeline",layout:o.createPipelineLayout({bindGroupLayouts:[v,y]}),vertex:{module:w,entryPoint:"vs_main"},fragment:{module:w,entryPoint:"fs_composite",targets:[{format:le}]},primitive:{topology:"triangle-list"}}),k=o.createBindGroup({label:"DofPrefilterBG",layout:b,entries:[{binding:0,resource:{buffer:_}},{binding:1,resource:t},{binding:2,resource:n},{binding:3,resource:m}]}),C=o.createBindGroup({label:"DofCompBG0",layout:v,entries:[{binding:0,resource:{buffer:_}},{binding:1,resource:t},{binding:3,resource:m}]}),E=o.createBindGroup({label:"DofCompBG1",layout:y,entries:[{binding:0,resource:p}]});return new sn(f,h,d,p,S,x,_,k,C,E)}updateParams(e,t=30,n=60,o=6,i=.1,a=1e3,l=1){this._scratch[0]=t,this._scratch[1]=n,this._scratch[2]=o,this._scratch[3]=i,this._scratch[4]=a,this._scratch[5]=l,this._scratch[6]=0,this._scratch[7]=0,e.device.queue.writeBuffer(this._uniformBuffer,0,this._scratch.buffer)}execute(e,t){{const n=e.beginRenderPass({label:"DofPrefilter",colorAttachments:[{view:this._halfView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._prefilterPipeline),n.setBindGroup(0,this._prefilterBG),n.draw(3),n.end()}{const n=e.beginRenderPass({label:"DofComposite",colorAttachments:[{view:this.resultView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._compositePipeline),n.setBindGroup(0,this._compBG0),n.setBindGroup(1,this._compBG1),n.draw(3),n.end()}}destroy(){this._result.destroy(),this._half.destroy(),this._uniformBuffer.destroy()}}const Ha=`// SSAO: hemisphere sampling in view space.\r
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
`,Wa=`// SSAO blur: 4×4 box blur to smooth raw SSAO output.\r
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
`,Ft="r8unorm",Er=16,ja=464;function qa(){const u=new Float32Array(Er*4);for(let r=0;r<Er;r++){const e=Math.random(),t=Math.random()*Math.PI*2,n=Math.sqrt(1-e*e),o=.1+.9*(r/Er)**2;u[r*4+0]=n*Math.cos(t)*o,u[r*4+1]=n*Math.sin(t)*o,u[r*4+2]=e*o,u[r*4+3]=0}return u}function Ya(){const u=new Uint8Array(64);for(let r=0;r<16;r++){const e=Math.random()*Math.PI*2;u[r*4+0]=Math.round((Math.cos(e)*.5+.5)*255),u[r*4+1]=Math.round((Math.sin(e)*.5+.5)*255),u[r*4+2]=128,u[r*4+3]=255}return u}class ln extends Se{constructor(e,t,n,o,i,a,l,c,d,f,p){super();s(this,"name","SSAOPass");s(this,"aoView");s(this,"_raw");s(this,"_blurred");s(this,"_rawView");s(this,"_ssaoPipeline");s(this,"_blurPipeline");s(this,"_uniformBuffer");s(this,"_noiseTex");s(this,"_cameraScratch",new Float32Array(48));s(this,"_paramsScratch",new Float32Array(4));s(this,"_ssaoBG0");s(this,"_ssaoBG1");s(this,"_blurBG");this._raw=e,this._rawView=t,this._blurred=n,this.aoView=o,this._ssaoPipeline=i,this._blurPipeline=a,this._uniformBuffer=l,this._noiseTex=c,this._ssaoBG0=d,this._ssaoBG1=f,this._blurBG=p}static create(e,t){const{device:n,width:o,height:i}=e,a=Math.max(1,o>>1),l=Math.max(1,i>>1),c=n.createTexture({label:"SsaoRaw",size:{width:a,height:l},format:Ft,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),d=n.createTexture({label:"SsaoBlurred",size:{width:a,height:l},format:Ft,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),f=c.createView(),p=d.createView(),h=n.createTexture({label:"SsaoNoise",size:{width:4,height:4},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});n.queue.writeTexture({texture:h},Ya().buffer,{bytesPerRow:4*4,rowsPerImage:4},{width:4,height:4});const _=h.createView(),m=n.createBuffer({label:"SsaoUniforms",size:ja,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});n.queue.writeBuffer(m,208,qa().buffer),n.queue.writeBuffer(m,192,new Float32Array([1,.005,2,0]).buffer);const b=n.createSampler({label:"SsaoBlurSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),v=n.createBindGroupLayout({label:"SsaoBGL0",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),y=n.createBindGroupLayout({label:"SsaoBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),w=n.createBindGroupLayout({label:"SsaoBlurBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),S=n.createShaderModule({label:"SsaoShader",code:Ha}),x=n.createShaderModule({label:"SsaoBlurShader",code:Wa}),k=n.createRenderPipeline({label:"SsaoPipeline",layout:n.createPipelineLayout({bindGroupLayouts:[v,y]}),vertex:{module:S,entryPoint:"vs_main"},fragment:{module:S,entryPoint:"fs_ssao",targets:[{format:Ft}]},primitive:{topology:"triangle-list"}}),C=n.createRenderPipeline({label:"SsaoBlurPipeline",layout:n.createPipelineLayout({bindGroupLayouts:[w]}),vertex:{module:x,entryPoint:"vs_main"},fragment:{module:x,entryPoint:"fs_blur",targets:[{format:Ft}]},primitive:{topology:"triangle-list"}}),E=n.createBindGroup({label:"SsaoBG0",layout:v,entries:[{binding:0,resource:{buffer:m}}]}),I=n.createBindGroup({label:"SsaoBG1",layout:y,entries:[{binding:0,resource:t.normalMetallicView},{binding:1,resource:t.depthView},{binding:2,resource:_}]}),U=n.createBindGroup({label:"SsaoBlurBG",layout:w,entries:[{binding:0,resource:f},{binding:1,resource:b}]});return new ln(c,f,d,p,k,C,m,h,E,I,U)}updateCamera(e,t,n,o){const i=this._cameraScratch;i.set(t.data,0),i.set(n.data,16),i.set(o.data,32),e.device.queue.writeBuffer(this._uniformBuffer,0,i.buffer)}updateParams(e,t=1,n=.005,o=2){this._paramsScratch[0]=t,this._paramsScratch[1]=n,this._paramsScratch[2]=o,this._paramsScratch[3]=0,e.device.queue.writeBuffer(this._uniformBuffer,192,this._paramsScratch.buffer)}execute(e,t){{const n=e.beginRenderPass({label:"SSAOPass",colorAttachments:[{view:this._rawView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._ssaoPipeline),n.setBindGroup(0,this._ssaoBG0),n.setBindGroup(1,this._ssaoBG1),n.draw(3),n.end()}{const n=e.beginRenderPass({label:"SSAOBlur",colorAttachments:[{view:this.aoView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._blurPipeline),n.setBindGroup(0,this._blurBG),n.draw(3),n.end()}}destroy(){this._raw.destroy(),this._blurred.destroy(),this._uniformBuffer.destroy(),this._noiseTex.destroy()}}const Xa=`// Screen-Space Global Illumination — ray march pass.\r
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
`,$a=`// Screen-Space Global Illumination — temporal accumulation pass.\r
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
`,go=368,Za={numRays:4,numSteps:16,radius:3,thickness:.5,strength:1};function Ka(){const u=new Uint8Array(new ArrayBuffer(64));for(let r=0;r<16;r++){const e=Math.random()*Math.PI*2;u[r*4+0]=Math.round((Math.cos(e)*.5+.5)*255),u[r*4+1]=Math.round((Math.sin(e)*.5+.5)*255),u[r*4+2]=128,u[r*4+3]=255}return u}class cn extends Se{constructor(e,t,n,o,i,a,l,c,d,f,p,h,_,m,b,v){super();s(this,"name","SSGIPass");s(this,"resultView");s(this,"_uniformBuffer");s(this,"_noiseTexture");s(this,"_rawTexture");s(this,"_rawView");s(this,"_historyTexture");s(this,"_resultTexture");s(this,"_ssgiPipeline");s(this,"_temporalPipeline");s(this,"_ssgiBG0");s(this,"_ssgiBG1");s(this,"_tempBG0");s(this,"_tempBG1");s(this,"_settings");s(this,"_frameIndex",0);s(this,"_scratch",new Float32Array(go/4));s(this,"_scratchU32",new Uint32Array(this._scratch.buffer));s(this,"_width");s(this,"_height");this._uniformBuffer=e,this._noiseTexture=t,this._rawTexture=n,this._rawView=o,this._historyTexture=i,this._resultTexture=a,this.resultView=l,this._ssgiPipeline=c,this._temporalPipeline=d,this._ssgiBG0=f,this._ssgiBG1=p,this._tempBG0=h,this._tempBG1=_,this._settings=m,this._width=b,this._height=v}static create(e,t,n,o=Za){const{device:i,width:a,height:l}=e,c=i.createBuffer({label:"SSGIUniforms",size:go,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),d=i.createTexture({label:"SSGINoise",size:{width:4,height:4},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});i.queue.writeTexture({texture:d},Ka(),{bytesPerRow:4*4,rowsPerImage:4},{width:4,height:4});const f=d.createView(),p=i.createTexture({label:"SSGIRaw",size:{width:a,height:l},format:le,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),h=p.createView(),_=i.createTexture({label:"SSGIHistory",size:{width:a,height:l},format:le,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),m=_.createView(),b=i.createTexture({label:"SSGIResult",size:{width:a,height:l},format:le,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),v=b.createView(),y=i.createSampler({label:"SSGILinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),w=i.createBindGroupLayout({label:"SSGIUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),S=i.createBindGroupLayout({label:"SSGITexBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),x=i.createBindGroupLayout({label:"SSGITempTexBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),k=i.createBindGroup({label:"SSGIUniformBG",layout:w,entries:[{binding:0,resource:{buffer:c}}]}),C=i.createBindGroup({label:"SSGITexBG",layout:S,entries:[{binding:0,resource:t.depthView},{binding:1,resource:t.normalMetallicView},{binding:2,resource:n},{binding:3,resource:f},{binding:4,resource:y}]}),E=i.createBindGroup({label:"SSGITempUniformBG",layout:w,entries:[{binding:0,resource:{buffer:c}}]}),I=i.createBindGroup({label:"SSGITempTexBG",layout:x,entries:[{binding:0,resource:h},{binding:1,resource:m},{binding:2,resource:t.depthView},{binding:3,resource:y}]}),U=i.createShaderModule({label:"SSGIShader",code:Xa}),g=i.createShaderModule({label:"SSGITempShader",code:$a}),A=i.createRenderPipeline({label:"SSGIPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[w,S]}),vertex:{module:U,entryPoint:"vs_main"},fragment:{module:U,entryPoint:"fs_ssgi",targets:[{format:le}]},primitive:{topology:"triangle-list"}}),P=i.createRenderPipeline({label:"SSGITempPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[w,x]}),vertex:{module:g,entryPoint:"vs_main"},fragment:{module:g,entryPoint:"fs_temporal",targets:[{format:le}]},primitive:{topology:"triangle-list"}});return new cn(c,d,p,h,_,b,v,A,P,k,C,E,I,o,a,l)}updateCamera(e,t,n,o,i,a,l){const c=this._scratch;c.set(t.data,0),c.set(n.data,16),c.set(o.data,32),c.set(i.data,48),c.set(a.data,64),c[80]=l.x,c[81]=l.y,c[82]=l.z;const d=this._scratchU32;d[83]=this._settings.numRays,d[84]=this._settings.numSteps,c[85]=this._settings.radius,c[86]=this._settings.thickness,c[87]=this._settings.strength,d[88]=this._frameIndex++,e.queue.writeBuffer(this._uniformBuffer,0,c.buffer)}updateSettings(e){this._settings={...this._settings,...e}}execute(e,t){{const n=e.beginRenderPass({label:"SSGIRayMarch",colorAttachments:[{view:this._rawView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._ssgiPipeline),n.setBindGroup(0,this._ssgiBG0),n.setBindGroup(1,this._ssgiBG1),n.draw(3),n.end()}{const n=e.beginRenderPass({label:"SSGITemporal",colorAttachments:[{view:this.resultView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._temporalPipeline),n.setBindGroup(0,this._tempBG0),n.setBindGroup(1,this._tempBG1),n.draw(3),n.end()}e.copyTextureToTexture({texture:this._resultTexture},{texture:this._historyTexture},{width:this._width,height:this._height})}destroy(){this._uniformBuffer.destroy(),this._noiseTexture.destroy(),this._rawTexture.destroy(),this._historyTexture.destroy(),this._resultTexture.destroy()}}const Ja=`// VSM shadow map generation for point and spot lights.\r
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
`,Ht=32,Wt=32,yt=4,rt=8,jt=256,qt=512,Ve=256,vo=80,Qa=64,es=6*yt,ts=es+rt;class un extends Se{constructor(e,t,n,o,i,a,l,c,d,f,p,h,_,m){super();s(this,"name","PointSpotShadowPass");s(this,"pointVsmView");s(this,"spotVsmView");s(this,"projTexView");s(this,"_pointVsmTex");s(this,"_spotVsmTex");s(this,"_projTexArray");s(this,"_pointDepth");s(this,"_spotDepth");s(this,"_pointFaceViews");s(this,"_spotFaceViews");s(this,"_pointDepthView");s(this,"_spotDepthView");s(this,"_pointPipeline");s(this,"_spotPipeline");s(this,"_shadowBufs");s(this,"_shadowBGs");s(this,"_modelBufs",[]);s(this,"_modelBGs",[]);s(this,"_modelBGL");s(this,"_shadowScratch",new Float32Array(vo/4));s(this,"_snapshot",[]);s(this,"_pointLights",[]);s(this,"_spotLights",[]);this._pointVsmTex=e,this._spotVsmTex=t,this._projTexArray=n,this._pointDepth=o,this._spotDepth=i,this._pointFaceViews=a,this._spotFaceViews=l,this._pointDepthView=c,this._spotDepthView=d,this._pointPipeline=f,this._spotPipeline=p,this._shadowBufs=h,this._shadowBGs=_,this._modelBGL=m,this.pointVsmView=e.createView({dimension:"cube-array",arrayLayerCount:yt*6}),this.spotVsmView=t.createView({dimension:"2d-array"}),this.projTexView=n.createView({dimension:"2d-array"})}static create(e){const{device:t}=e,n=t.createTexture({label:"PointVSM",size:{width:jt,height:jt,depthOrArrayLayers:yt*6},format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),o=t.createTexture({label:"SpotVSM",size:{width:qt,height:qt,depthOrArrayLayers:rt},format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),i=t.createTexture({label:"ProjTexArray",size:{width:Ve,height:Ve,depthOrArrayLayers:rt},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),a=new Uint8Array(Ve*Ve*4).fill(255);for(let C=0;C<rt;C++)t.queue.writeTexture({texture:i,origin:{x:0,y:0,z:C}},a,{bytesPerRow:Ve*4,rowsPerImage:Ve},{width:Ve,height:Ve,depthOrArrayLayers:1});const l=t.createTexture({label:"PointShadowDepth",size:{width:jt,height:jt},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),c=t.createTexture({label:"SpotShadowDepth",size:{width:qt,height:qt},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),d=Array.from({length:yt*6},(C,E)=>n.createView({dimension:"2d",baseArrayLayer:E,arrayLayerCount:1})),f=Array.from({length:rt},(C,E)=>o.createView({dimension:"2d",baseArrayLayer:E,arrayLayerCount:1})),p=l.createView(),h=c.createView(),_=t.createBindGroupLayout({label:"PSShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),m=t.createBindGroupLayout({label:"PSModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),b=[],v=[];for(let C=0;C<ts;C++){const E=t.createBuffer({label:`PSShadowUniform ${C}`,size:vo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});b.push(E),v.push(t.createBindGroup({label:`PSShadowBG ${C}`,layout:_,entries:[{binding:0,resource:{buffer:E}}]}))}const y=t.createPipelineLayout({bindGroupLayouts:[_,m]}),w=t.createShaderModule({label:"PointSpotShadowShader",code:Ja}),S={module:w,buffers:[{arrayStride:qr,attributes:[Yr[0]]}]},x=t.createRenderPipeline({label:"PointShadowPipeline",layout:y,vertex:{...S,entryPoint:"vs_point"},fragment:{module:w,entryPoint:"fs_point",targets:[{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),k=t.createRenderPipeline({label:"SpotShadowPipeline",layout:y,vertex:{...S,entryPoint:"vs_spot"},fragment:{module:w,entryPoint:"fs_spot",targets:[{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}});return new un(n,o,i,l,c,d,f,p,h,x,k,b,v,m)}update(e,t,n){this._pointLights=e,this._spotLights=t,this._snapshot=n}setProjectionTexture(e,t,n){e.copyTextureToTexture({texture:n},{texture:this._projTexArray,origin:{x:0,y:0,z:t}},{width:Ve,height:Ve,depthOrArrayLayers:1})}execute(e,t){const{device:n}=t,o=this._snapshot;this._ensureModelBuffers(n,o.length);for(let c=0;c<this._spotLights.length&&c<rt;c++){const d=this._spotLights[c];d.projectionTexture&&this.setProjectionTexture(e,c,d.projectionTexture)}for(let c=0;c<o.length;c++)t.queue.writeBuffer(this._modelBufs[c],0,o[c].modelMatrix.data.buffer);let i=0,a=0;for(const c of this._pointLights){if(!c.castShadow||a>=yt)continue;const d=c.worldPosition(),f=c.cubeFaceViewProjs(),p=this._shadowScratch;p[16]=d.x,p[17]=d.y,p[18]=d.z,p[19]=c.radius;for(let h=0;h<6;h++){p.set(f[h].data,0),t.queue.writeBuffer(this._shadowBufs[i],0,p.buffer);const _=a*6+h,m=e.beginRenderPass({label:`PointShadow light${a} face${h}`,colorAttachments:[{view:this._pointFaceViews[_],clearValue:{r:1,g:1,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._pointDepthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"discard"}});m.setPipeline(this._pointPipeline),m.setBindGroup(0,this._shadowBGs[i]),this._drawItems(m,o),m.end(),i++}a++}let l=0;for(const c of this._spotLights){if(!c.castShadow||l>=rt)continue;const d=c.lightViewProj(),f=c.worldPosition(),p=this._shadowScratch;p.set(d.data,0),p[16]=f.x,p[17]=f.y,p[18]=f.z,p[19]=c.range,t.queue.writeBuffer(this._shadowBufs[i],0,p.buffer);const h=e.beginRenderPass({label:`SpotShadow light${l}`,colorAttachments:[{view:this._spotFaceViews[l],clearValue:{r:1,g:1,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._spotDepthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"discard"}});h.setPipeline(this._spotPipeline),h.setBindGroup(0,this._shadowBGs[i]),this._drawItems(h,o),h.end(),i++,l++}}_drawItems(e,t){for(let n=0;n<t.length;n++){const{mesh:o}=t[n];e.setBindGroup(1,this._modelBGs[n]),e.setVertexBuffer(0,o.vertexBuffer),e.setIndexBuffer(o.indexBuffer,"uint32"),e.drawIndexed(o.indexCount)}}_ensureModelBuffers(e,t){for(;this._modelBufs.length<t;){const n=e.createBuffer({label:`PSModelUniform ${this._modelBufs.length}`,size:Qa,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._modelBufs.push(n),this._modelBGs.push(e.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:n}}]}))}}destroy(){this._pointVsmTex.destroy(),this._spotVsmTex.destroy(),this._projTexArray.destroy(),this._pointDepth.destroy(),this._spotDepth.destroy();for(const e of this._shadowBufs)e.destroy();for(const e of this._modelBufs)e.destroy()}}const rs=`// Water pass — forward-rendered on top of the deferred-lit HDR buffer.\r
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
`,bo=64*4+16+16,ns=16,os=16,is=3,Ar=is*4,Ur=16;class ut extends Se{constructor(e,t,n,o,i,a,l,c,d,f,p,h,_,m,b){super();s(this,"name","WaterPass");s(this,"_device");s(this,"_hdrTexture");s(this,"_hdrView");s(this,"_refractionTex");s(this,"_pipeline");s(this,"_cameraBuffer");s(this,"_waterBuffer");s(this,"_cameraBG");s(this,"_waterBG");s(this,"_sceneBG");s(this,"_sceneBGL");s(this,"_chunkBGL");s(this,"_skyTexture");s(this,"_dudvTexture");s(this,"_gradientTexture");s(this,"_chunks",new Map);s(this,"_frustumPlanes",new Float32Array(24));s(this,"_cameraScratch",new Float32Array(bo/4));s(this,"_waterScratch",new Float32Array(4));this._device=e,this._hdrTexture=t,this._hdrView=n,this._refractionTex=o,this._pipeline=i,this._cameraBuffer=a,this._waterBuffer=l,this._cameraBG=c,this._waterBG=d,this._sceneBG=f,this._sceneBGL=p,this._chunkBGL=h,this._skyTexture=_,this._dudvTexture=m,this._gradientTexture=b}static create(e,t,n,o,i,a,l){const{device:c,width:d,height:f}=e,p=c.createBindGroupLayout({label:"WaterCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),h=c.createBindGroupLayout({label:"WaterUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),_=c.createBindGroupLayout({label:"WaterChunkBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),m=c.createBindGroupLayout({label:"WaterSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:5,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),{refractionTex:b,refractionView:v}=ut._makeRefractionTex(c,d,f),y=c.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"}),w=c.createBuffer({label:"WaterCameraBuffer",size:bo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),S=c.createBuffer({label:"WaterUniformBuffer",size:ns,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),x=c.createBindGroup({label:"WaterCameraBG",layout:p,entries:[{binding:0,resource:{buffer:w}}]}),k=c.createBindGroup({label:"WaterUniformBG",layout:h,entries:[{binding:0,resource:{buffer:S}}]}),C=ut._makeSceneBG(c,m,v,o,a,l,i,y),E=c.createShaderModule({label:"WaterShader",code:rs}),I=c.createPipelineLayout({bindGroupLayouts:[p,h,_,m]}),U={arrayStride:Ar,attributes:[{shaderLocation:0,offset:0,format:"float32x3"}]},g=c.createRenderPipeline({label:"WaterPipeline",layout:I,vertex:{module:E,entryPoint:"vs_main",buffers:[U]},fragment:{module:E,entryPoint:"fs_main",targets:[{format:le,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},primitive:{topology:"triangle-list",cullMode:"none"}});return new ut(c,t,n,b,g,w,S,x,k,C,m,_,i,a,l)}updateRenderTargets(e,t,n,o){this._refractionTex.destroy(),this._hdrTexture=e,this._hdrView=t,o&&(this._skyTexture=o);const{width:i,height:a}=e,{refractionTex:l,refractionView:c}=ut._makeRefractionTex(this._device,i,a);this._refractionTex=l;const d=this._device.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"});this._sceneBG=ut._makeSceneBG(this._device,this._sceneBGL,c,n,this._dudvTexture,this._gradientTexture,this._skyTexture,d)}updateCamera(e,t,n,o,i,a,l,c){const d=this._cameraScratch;d.set(t.data,0),d.set(n.data,16),d.set(o.data,32),d.set(i.data,48),d[64]=a.x,d[65]=a.y,d[66]=a.z,d[67]=l,d[68]=c,e.queue.writeBuffer(this._cameraBuffer,0,d.buffer),this._extractFrustumPlanes(o.data)}_extractFrustumPlanes(e){const t=this._frustumPlanes;t[0]=e[3]+e[0],t[1]=e[7]+e[4],t[2]=e[11]+e[8],t[3]=e[15]+e[12],t[4]=e[3]-e[0],t[5]=e[7]-e[4],t[6]=e[11]-e[8],t[7]=e[15]-e[12],t[8]=e[3]+e[1],t[9]=e[7]+e[5],t[10]=e[11]+e[9],t[11]=e[15]+e[13],t[12]=e[3]-e[1],t[13]=e[7]-e[5],t[14]=e[11]-e[9],t[15]=e[15]-e[13],t[16]=e[2],t[17]=e[6],t[18]=e[10],t[19]=e[14],t[20]=e[3]-e[2],t[21]=e[7]-e[6],t[22]=e[11]-e[10],t[23]=e[15]-e[14]}_isVisible(e,t,n){const o=this._frustumPlanes,i=e+Ur,a=t+Ur,l=n+Ur;for(let c=0;c<6;c++){const d=o[c*4],f=o[c*4+1],p=o[c*4+2],h=o[c*4+3];if(d*(d>=0?i:e)+f*(f>=0?a:t)+p*(p>=0?l:n)+h<0)return!1}return!0}updateTime(e,t,n=1){this._waterScratch[0]=t,this._waterScratch[1]=n,this._waterScratch[2]=0,this._waterScratch[3]=0,e.queue.writeBuffer(this._waterBuffer,0,this._waterScratch.buffer)}addChunk(e,t){const n=this._chunks.get(e);n?this._replaceMeshBuffer(n,t):this._chunks.set(e,this._createChunkGpu(e,t))}updateChunk(e,t){const n=this._chunks.get(e);n?this._replaceMeshBuffer(n,t):this._chunks.set(e,this._createChunkGpu(e,t))}removeChunk(e){var n;const t=this._chunks.get(e);t&&((n=t.buffer)==null||n.destroy(),t.uniformBuffer.destroy(),this._chunks.delete(e))}execute(e,t){const{width:n,height:o}=this._refractionTex;e.copyTextureToTexture({texture:this._hdrTexture},{texture:this._refractionTex},{width:n,height:o,depthOrArrayLayers:1});const i=e.beginRenderPass({label:"WaterPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}]});i.setPipeline(this._pipeline),i.setBindGroup(0,this._cameraBG),i.setBindGroup(1,this._waterBG),i.setBindGroup(3,this._sceneBG);for(const a of this._chunks.values())!a.buffer||a.vertexCount===0||this._isVisible(a.ox,a.oy,a.oz)&&(i.setBindGroup(2,a.chunkBG),i.setVertexBuffer(0,a.buffer),i.draw(a.vertexCount));i.end()}destroy(){var e;this._cameraBuffer.destroy(),this._waterBuffer.destroy(),this._refractionTex.destroy();for(const t of this._chunks.values())(e=t.buffer)==null||e.destroy(),t.uniformBuffer.destroy();this._chunks.clear()}static _makeRefractionTex(e,t,n){const o=e.createTexture({label:"WaterRefractionTex",size:{width:t,height:n},format:le,usage:GPUTextureUsage.COPY_DST|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT}),i=o.createView();return{refractionTex:o,refractionView:i}}static _makeSceneBG(e,t,n,o,i,a,l,c){return e.createBindGroup({label:"WaterSceneBG",layout:t,entries:[{binding:0,resource:n},{binding:1,resource:o},{binding:2,resource:i.view},{binding:3,resource:a.view},{binding:4,resource:l.view},{binding:5,resource:c}]})}_createChunkGpu(e,t){const n=this._device.createBuffer({label:`WaterChunkBuf(${e.globalPosition.x},${e.globalPosition.y},${e.globalPosition.z})`,size:os,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(n,0,new Float32Array([e.globalPosition.x,e.globalPosition.y,e.globalPosition.z,0]));const o=this._device.createBindGroup({label:"WaterChunkBG",layout:this._chunkBGL,entries:[{binding:0,resource:{buffer:n}}]}),i={ox:e.globalPosition.x,oy:e.globalPosition.y,oz:e.globalPosition.z,buffer:null,vertexCount:0,uniformBuffer:n,chunkBG:o};return this._replaceMeshBuffer(i,t),i}_replaceMeshBuffer(e,t){var n;if((n=e.buffer)==null||n.destroy(),e.buffer=null,e.vertexCount=t.waterCount,t.waterCount>0){const o=this._device.createBuffer({label:"WaterVertexBuf",size:t.waterCount*Ar,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(o,0,t.water.buffer,0,t.waterCount*Ar),e.buffer=o}}}const as=`// Shadow pass for transparent chunk geometry — samples color atlas alpha for discard.\r
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
`,ss=`// Shadow pass for prop billboards (flowers, grass, torches, etc.).\r
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
`,ls=4,qe=5*4;class dn extends Se{constructor(e,t,n,o,i,a,l,c,d,f,p){super();s(this,"name","WorldShadowPass");s(this,"shadowChunkRadius",4);s(this,"_camX",0);s(this,"_camZ",0);s(this,"_device");s(this,"_shadowMapArrayViews");s(this,"_pipeline");s(this,"_transparentPipeline");s(this,"_propPipeline");s(this,"_cascadeBGs");s(this,"_cascadeBuffers");s(this,"_modelBGL");s(this,"_atlasBG");s(this,"_orientBG_X");s(this,"_orientBG_Z");s(this,"_chunks",new Map);s(this,"_cascades",[]);this._device=e,this._shadowMapArrayViews=t,this._pipeline=n,this._transparentPipeline=o,this._propPipeline=i,this._cascadeBGs=a,this._cascadeBuffers=l,this._modelBGL=c,this._atlasBG=d,this._orientBG_X=f,this._orientBG_Z=p}static create(e,t,n,o){const{device:i}=e,a=i.createBindGroupLayout({label:"WorldShadowCascadeBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),l=i.createBindGroupLayout({label:"WorldShadowModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),c=i.createBindGroupLayout({label:"WorldShadowAtlasBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),d=[],f=[];for(let B=0;B<Math.min(n,ls);B++){const N=i.createBuffer({label:`WorldShadowCascadeBuf${B}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});d.push(N),f.push(i.createBindGroup({label:`WorldShadowCascadeBG${B}`,layout:a,entries:[{binding:0,resource:{buffer:N}}]}))}const p=R.MAX,h=i.createBuffer({label:"WorldShadowBlockDataBuf",size:Math.max(p*16,16),usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),_=pi,m=new Uint32Array(p*4);for(let B=0;B<p;B++){const N=ur[B];N&&(m[B*4+0]=N.sideFace.y*_+N.sideFace.x,m[B*4+1]=N.bottomFace.y*_+N.bottomFace.x,m[B*4+2]=N.topFace.y*_+N.topFace.x)}i.queue.writeBuffer(h,0,m);const b=i.createSampler({label:"WorldShadowAtlasSampler",magFilter:"nearest",minFilter:"nearest"}),v=i.createBindGroup({label:"WorldShadowAtlasBG",layout:c,entries:[{binding:0,resource:o.colorAtlas.view},{binding:1,resource:b},{binding:2,resource:{buffer:h}}]}),y=i.createShaderModule({label:"WorldShadowShader",code:hi}),w=i.createPipelineLayout({bindGroupLayouts:[a,l]}),S=i.createRenderPipeline({label:"WorldShadowPipeline",layout:w,vertex:{module:y,entryPoint:"vs_main",buffers:[{arrayStride:qe,attributes:[{shaderLocation:0,offset:0,format:"float32x3"}]}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}}),x=i.createShaderModule({label:"WorldShadowTranspShader",code:as}),k=i.createPipelineLayout({bindGroupLayouts:[a,l,c]}),C=i.createRenderPipeline({label:"WorldShadowTransparentPipeline",layout:k,vertex:{module:x,entryPoint:"vs_main",buffers:[{arrayStride:qe,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32"},{shaderLocation:2,offset:16,format:"float32"}]}]},fragment:{module:x,entryPoint:"fs_alpha_test",targets:[]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}}),E=i.createBindGroupLayout({label:"WorldShadowOrientBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),I=(B,N,G,q)=>{const O=i.createBuffer({label:B,size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return i.queue.writeBuffer(O,0,new Float32Array([N,G,q,0])),i.createBindGroup({label:B,layout:E,entries:[{binding:0,resource:{buffer:O}}]})},U=I("PropShadowOrientBG_X",1,0,0),g=I("PropShadowOrientBG_Z",0,0,1),A=i.createShaderModule({label:"WorldShadowPropShader",code:ss}),P=i.createPipelineLayout({bindGroupLayouts:[a,l,c,E]}),T=i.createRenderPipeline({label:"WorldShadowPropPipeline",layout:P,vertex:{module:A,entryPoint:"vs_main",buffers:[{arrayStride:qe,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32"},{shaderLocation:2,offset:16,format:"float32"}]}]},fragment:{module:A,entryPoint:"fs_alpha_test",targets:[]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}});return new dn(i,t,S,C,T,f,d,l,v,U,g)}update(e,t,n,o){this._cascades=t,this._camX=n,this._camZ=o;const i=Math.min(t.length,this._cascadeBuffers.length);for(let a=0;a<i;a++)e.queue.writeBuffer(this._cascadeBuffers[a],0,t[a].lightViewProj.data.buffer)}addChunk(e,t){const n=this._chunks.get(e);n?this._replaceMeshBuffer(n,t):this._chunks.set(e,this._createChunkGpu(e,t))}updateChunk(e,t){const n=this._chunks.get(e);n?this._replaceMeshBuffer(n,t):this._chunks.set(e,this._createChunkGpu(e,t))}removeChunk(e){var n,o,i;const t=this._chunks.get(e);t&&((n=t.opaqueBuffer)==null||n.destroy(),(o=t.transparentBuffer)==null||o.destroy(),(i=t.propBuffer)==null||i.destroy(),t.modelBuffer.destroy(),this._chunks.delete(e))}execute(e,t){const n=Math.min(this._cascades.length,this._cascadeBuffers.length);for(let o=0;o<n;o++){const i=e.beginRenderPass({label:`WorldShadowPass cascade ${o}`,colorAttachments:[],depthStencilAttachment:{view:this._shadowMapArrayViews[o],depthLoadOp:"load",depthStoreOp:"store"}});i.setBindGroup(0,this._cascadeBGs[o]);const a=this.shadowChunkRadius*16,l=a*a;i.setPipeline(this._pipeline);for(const c of this._chunks.values()){if(!c.opaqueBuffer||c.opaqueCount===0)continue;const d=c.ox-this._camX,f=c.oz-this._camZ;d*d+f*f>l||(i.setBindGroup(1,c.modelBG),i.setVertexBuffer(0,c.opaqueBuffer),i.draw(c.opaqueCount))}i.setPipeline(this._transparentPipeline),i.setBindGroup(2,this._atlasBG);for(const c of this._chunks.values()){if(!c.transparentBuffer||c.transparentCount===0)continue;const d=c.ox-this._camX,f=c.oz-this._camZ;d*d+f*f>l||(i.setBindGroup(1,c.modelBG),i.setVertexBuffer(0,c.transparentBuffer),i.draw(c.transparentCount))}i.setPipeline(this._propPipeline),i.setBindGroup(2,this._atlasBG);for(const c of[this._orientBG_X,this._orientBG_Z]){i.setBindGroup(3,c);for(const d of this._chunks.values()){if(!d.propBuffer||d.propCount===0)continue;const f=d.ox-this._camX,p=d.oz-this._camZ;f*f+p*p>l||(i.setBindGroup(1,d.modelBG),i.setVertexBuffer(0,d.propBuffer),i.draw(d.propCount))}}i.end()}}destroy(){var e,t,n;for(const o of this._cascadeBuffers)o.destroy();for(const o of this._chunks.values())(e=o.opaqueBuffer)==null||e.destroy(),(t=o.transparentBuffer)==null||t.destroy(),(n=o.propBuffer)==null||n.destroy(),o.modelBuffer.destroy();this._chunks.clear()}_createChunkGpu(e,t){const n=e.globalPosition,o=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,n.x,n.y,n.z,1]),i=this._device.createBuffer({label:"WorldShadowModelBuf",size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(i,0,o.buffer);const a=this._device.createBindGroup({label:"WorldShadowModelBG",layout:this._modelBGL,entries:[{binding:0,resource:{buffer:i}}]}),l={ox:n.x,oz:n.z,opaqueBuffer:null,opaqueCount:0,transparentBuffer:null,transparentCount:0,propBuffer:null,propCount:0,modelBuffer:i,modelBG:a};return this._replaceMeshBuffer(l,t),l}_replaceMeshBuffer(e,t){var n,o,i;if((n=e.opaqueBuffer)==null||n.destroy(),e.opaqueBuffer=null,e.opaqueCount=t.opaqueCount,t.opaqueCount>0){const a=this._device.createBuffer({label:"WorldShadowOpaqueBuf",size:t.opaqueCount*qe,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.opaque.buffer,0,t.opaqueCount*qe),e.opaqueBuffer=a}if((o=e.transparentBuffer)==null||o.destroy(),e.transparentBuffer=null,e.transparentCount=t.transparentCount,t.transparentCount>0){const a=this._device.createBuffer({label:"WorldShadowTransparentBuf",size:t.transparentCount*qe,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.transparent.buffer,0,t.transparentCount*qe),e.transparentBuffer=a}if((i=e.propBuffer)==null||i.destroy(),e.propBuffer=null,e.propCount=t.propCount,t.propCount>0){const a=this._device.createBuffer({label:"WorldShadowPropBuf",size:t.propCount*qe,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.prop.buffer,0,t.propCount*qe),e.propBuffer=a}}}const cs=`// Additive deferred pass for point and spot lights.\r
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
`,yo=64*4+16+16,us=8,wo=48,xo=128;class fn extends Se{constructor(e,t,n,o,i,a,l,c,d,f){super();s(this,"name","PointSpotLightPass");s(this,"_pipeline");s(this,"_cameraBG");s(this,"_gbufferBG");s(this,"_lightBG");s(this,"_shadowBG");s(this,"_cameraBuffer");s(this,"_lightCountsBuffer");s(this,"_pointBuffer");s(this,"_spotBuffer");s(this,"_hdrView");s(this,"_cameraData",new Float32Array(yo/4));s(this,"_lightCountsArr",new Uint32Array(2));s(this,"_pointBuf",new ArrayBuffer(Ht*wo));s(this,"_pointF32",new Float32Array(this._pointBuf));s(this,"_pointI32",new Int32Array(this._pointBuf));s(this,"_spotBuf",new ArrayBuffer(Wt*xo));s(this,"_spotF32",new Float32Array(this._spotBuf));s(this,"_spotI32",new Int32Array(this._spotBuf));this._pipeline=e,this._cameraBG=t,this._gbufferBG=n,this._lightBG=o,this._shadowBG=i,this._cameraBuffer=a,this._lightCountsBuffer=l,this._pointBuffer=c,this._spotBuffer=d,this._hdrView=f}static create(e,t,n,o){const{device:i}=e,a=i.createBuffer({label:"PSLCameraBuffer",size:yo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),l=i.createBuffer({label:"PSLLightCounts",size:us,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),c=i.createBuffer({label:"PSLPointBuffer",size:Ht*wo,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),d=i.createBuffer({label:"PSLSpotBuffer",size:Wt*xo,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),f=i.createSampler({label:"PSLLinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),p=i.createSampler({label:"PSLVsmSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge"}),h=i.createSampler({label:"PSLProjSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),_=i.createBindGroupLayout({label:"PSLCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),m=i.createBindGroupLayout({label:"PSLGBufferBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),b=i.createBindGroupLayout({label:"PSLLightBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),v=i.createBindGroupLayout({label:"PSLShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube-array"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d-array"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d-array"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),y=i.createBindGroup({label:"PSLCameraBG",layout:_,entries:[{binding:0,resource:{buffer:a}}]}),w=i.createBindGroup({label:"PSLGBufferBG",layout:m,entries:[{binding:0,resource:t.albedoRoughnessView},{binding:1,resource:t.normalMetallicView},{binding:2,resource:t.depthView},{binding:3,resource:f}]}),S=i.createBindGroup({label:"PSLLightBG",layout:b,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:d}}]}),x=i.createBindGroup({label:"PSLShadowBG",layout:v,entries:[{binding:0,resource:n.pointVsmView},{binding:1,resource:n.spotVsmView},{binding:2,resource:n.projTexView},{binding:3,resource:p},{binding:4,resource:h}]}),k=i.createShaderModule({label:"PointSpotLightShader",code:cs}),C=i.createRenderPipeline({label:"PointSpotLightPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[_,m,b,v]}),vertex:{module:k,entryPoint:"vs_main"},fragment:{module:k,entryPoint:"fs_main",targets:[{format:le,blend:{color:{srcFactor:"one",dstFactor:"one",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one",operation:"add"}}}]},primitive:{topology:"triangle-list"}});return new fn(C,y,w,S,x,a,l,c,d,o)}updateCamera(e,t,n,o,i,a,l,c){const d=this._cameraData;d.set(t.data,0),d.set(n.data,16),d.set(o.data,32),d.set(i.data,48),d[64]=a.x,d[65]=a.y,d[66]=a.z,d[67]=l,d[68]=c,e.queue.writeBuffer(this._cameraBuffer,0,d.buffer)}updateLights(e,t,n){const o=this._lightCountsArr;o[0]=Math.min(t.length,Ht),o[1]=Math.min(n.length,Wt),e.queue.writeBuffer(this._lightCountsBuffer,0,o.buffer);const i=this._pointF32,a=this._pointI32;let l=0;for(let p=0;p<Math.min(t.length,Ht);p++){const h=t[p],_=h.worldPosition(),m=p*12;i[m+0]=_.x,i[m+1]=_.y,i[m+2]=_.z,i[m+3]=h.radius,i[m+4]=h.color.x,i[m+5]=h.color.y,i[m+6]=h.color.z,i[m+7]=h.intensity,h.castShadow&&l<yt?a[m+8]=l++:a[m+8]=-1,a[m+9]=0,a[m+10]=0,a[m+11]=0}e.queue.writeBuffer(this._pointBuffer,0,this._pointBuf);const c=this._spotF32,d=this._spotI32;let f=0;for(let p=0;p<Math.min(n.length,Wt);p++){const h=n[p],_=h.worldPosition(),m=h.worldDirection(),b=h.lightViewProj(),v=p*32;c[v+0]=_.x,c[v+1]=_.y,c[v+2]=_.z,c[v+3]=h.range,c[v+4]=m.x,c[v+5]=m.y,c[v+6]=m.z,c[v+7]=Math.cos(h.innerAngle*Math.PI/180),c[v+8]=h.color.x,c[v+9]=h.color.y,c[v+10]=h.color.z,c[v+11]=Math.cos(h.outerAngle*Math.PI/180),c[v+12]=h.intensity,h.castShadow&&f<rt?d[v+13]=f++:d[v+13]=-1,d[v+14]=h.projectionTexture!==null?p:-1,d[v+15]=0,c.set(b.data,v+16)}e.queue.writeBuffer(this._spotBuffer,0,this._spotBuf)}updateLight(e){e.computeLightViewProj()}execute(e,t){const n=e.beginRenderPass({label:"PointSpotLightPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._cameraBG),n.setBindGroup(1,this._gbufferBG),n.setBindGroup(2,this._lightBG),n.setBindGroup(3,this._shadowBG),n.draw(3),n.end()}destroy(){this._cameraBuffer.destroy(),this._lightCountsBuffer.destroy(),this._pointBuffer.destroy(),this._spotBuffer.destroy()}}const _i=`
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
`;function ds(u){switch(u.kind){case"sphere":{const r=Math.cos(u.solidAngle).toFixed(6),e=u.radius.toFixed(6);return`{
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
}`}}}function mi(u){switch(u.type){case"gravity":return`p.velocity.y -= ${u.strength.toFixed(6)} * uniforms.dt;`;case"drag":return`p.velocity -= p.velocity * ${u.coefficient.toFixed(6)} * uniforms.dt;`;case"force":{const[r,e,t]=u.direction.map(n=>n.toFixed(6));return`p.velocity += vec3<f32>(${r}, ${e}, ${t}) * ${u.strength.toFixed(6)} * uniforms.dt;`}case"swirl_force":{const r=u.speed.toFixed(6),e=u.strength.toFixed(6);return`{
  let swirl_angle = uniforms.time * ${r};
  p.velocity += vec3<f32>(cos(swirl_angle), 0.0, sin(swirl_angle)) * ${e} * uniforms.dt;
}`}case"vortex":return`{
  let vx_radial = p.position.xz - uniforms.world_pos.xz;
  p.velocity += vec3<f32>(-vx_radial.y, 0.0, vx_radial.x) * ${u.strength.toFixed(6)} * uniforms.dt;
}`;case"curl_noise":{const r=u.octaves??1,e=r>1?`curl_noise_fbm(cn_pos, ${r})`:"curl_noise(cn_pos)";return`{
  let cn_pos = p.position * ${u.scale.toFixed(6)} + uniforms.time * ${u.timeScale.toFixed(6)};
  p.velocity += ${e} * ${u.strength.toFixed(6)} * uniforms.dt;
}`}case"size_random":return`p.size = rand_range(${u.min.toFixed(6)}, ${u.max.toFixed(6)}, pcg_hash(idx * 2654435761u));`;case"size_over_lifetime":return`p.size = mix(${u.start.toFixed(6)}, ${u.end.toFixed(6)}, t);`;case"color_over_lifetime":{const[r,e,t,n]=u.startColor.map(c=>c.toFixed(6)),[o,i,a,l]=u.endColor.map(c=>c.toFixed(6));return`p.color = mix(vec4<f32>(${r}, ${e}, ${t}, ${n}), vec4<f32>(${o}, ${i}, ${a}, ${l}), t);`}case"block_collision":return`{
  let _bc_uv = (p.position.xz - vec2<f32>(hm.origin_x, hm.origin_z)) / (hm.extent * 2.0) + 0.5;
  if (all(_bc_uv >= vec2<f32>(0.0)) && all(_bc_uv <= vec2<f32>(1.0))) {
    let _bc_xi = clamp(u32(_bc_uv.x * f32(hm.resolution)), 0u, hm.resolution - 1u);
    let _bc_zi = clamp(u32(_bc_uv.y * f32(hm.resolution)), 0u, hm.resolution - 1u);
    if (p.position.y <= hm_data[_bc_zi * hm.resolution + _bc_xi]) {
      particles[idx].life = -1.0; return;
    }
  }
}`}}function gi(u,r){return u?u.filter(e=>e.trigger===r).flatMap(e=>e.actions.map(mi)).join(`
  `):""}function fs(u){const{emitter:r,events:e}=u,[t,n]=r.lifetime.map(h=>h.toFixed(6)),[o,i]=r.initialSpeed.map(h=>h.toFixed(6)),[a,l]=r.initialSize.map(h=>h.toFixed(6)),[c,d,f,p]=r.initialColor.map(h=>h.toFixed(6));return`
${_i}

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
  p.color    = vec4<f32>(${c}, ${d}, ${f}, ${p});
  p.size     = rand_range(${a}, ${l}, seed + 3u);
  p.rotation = rand_f32(seed + 4u) * 6.28318530717958647;

  ${ds(r.shape)}

  ${gi(e,"on_spawn")}

  particles[idx] = p;
}
`}function ps(u){return u.modifiers.some(r=>r.type==="block_collision")}const hs=`
struct HeightmapUniforms {
  origin_x  : f32,
  origin_z  : f32,
  extent    : f32,
  resolution: u32,
}
@group(2) @binding(0) var<storage, read> hm_data: array<f32>;
@group(2) @binding(1) var<uniform>       hm     : HeightmapUniforms;
`;function _s(u){const r=u.modifiers.some(n=>n.type==="block_collision"),e=u.modifiers.map(mi).join(`
  `),t=gi(u.events,"on_death");return`
${_i}
${r?hs:""}

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
`}const ms=`// Compact pass — rebuilds alive_list and writes indirect draw instance count.\r
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
`,gs=`// Particle GBuffer render pass — camera-facing billboard quads.\r
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
`,vs=`// Particle forward HDR render pass — velocity-aligned billboard quads.\r
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
`,Bo=64,So=80,bs=16,ys=16,Po=288,Go=16,kr=128;class pn extends Se{constructor(e,t,n,o,i,a,l,c,d,f,p,h,_,m,b,v,y,w,S,x,k,C,E,I,U,g,A){super();s(this,"name","ParticlePass");s(this,"_gbuffer");s(this,"_hdrView");s(this,"_isForward");s(this,"_maxParticles");s(this,"_config");s(this,"_particleBuffer");s(this,"_aliveList");s(this,"_counterBuffer");s(this,"_indirectBuffer");s(this,"_computeUniforms");s(this,"_renderUniforms");s(this,"_cameraBuffer");s(this,"_spawnPipeline");s(this,"_updatePipeline");s(this,"_compactPipeline");s(this,"_indirectPipeline");s(this,"_renderPipeline");s(this,"_computeDataBG");s(this,"_computeUniBG");s(this,"_compactDataBG");s(this,"_compactUniBG");s(this,"_renderDataBG");s(this,"_cameraRenderBG");s(this,"_renderParamsBG");s(this,"_heightmapDataBuf");s(this,"_heightmapUniBuf");s(this,"_heightmapBG");s(this,"_spawnAccum",0);s(this,"_spawnOffset",0);s(this,"_spawnCount",0);s(this,"_time",0);s(this,"_frameSeed",0);s(this,"_cuBuf",new Float32Array(So/4));s(this,"_cuiView",new Uint32Array(this._cuBuf.buffer));s(this,"_camBuf",new Float32Array(Po/4));s(this,"_hmUniBuf",new Float32Array(Go/4));s(this,"_hmRes",new Uint32Array([kr]));s(this,"_resetArr",new Uint32Array(1));this._gbuffer=e,this._hdrView=t,this._isForward=n,this._config=o,this._maxParticles=i,this._particleBuffer=a,this._aliveList=l,this._counterBuffer=c,this._indirectBuffer=d,this._computeUniforms=f,this._renderUniforms=p,this._cameraBuffer=h,this._spawnPipeline=_,this._updatePipeline=m,this._compactPipeline=b,this._indirectPipeline=v,this._renderPipeline=y,this._computeDataBG=w,this._computeUniBG=S,this._compactDataBG=x,this._compactUniBG=k,this._renderDataBG=C,this._cameraRenderBG=E,this._renderParamsBG=I,this._heightmapDataBuf=U,this._heightmapUniBuf=g,this._heightmapBG=A}setSpawnRate(e){this._config.emitter.spawnRate=e}static create(e,t,n,o){const{device:i}=e,a=t.renderer.type==="sprites"&&t.renderer.renderTarget==="hdr",l=t.emitter.maxParticles,c=i.createBuffer({label:"ParticleBuffer",size:l*Bo,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),d=new Float32Array(l*(Bo/4));for(let Q=0;Q<l;Q++)d[Q*16+3]=-1;i.queue.writeBuffer(c,0,d.buffer);const f=i.createBuffer({label:"ParticleAliveList",size:l*4,usage:GPUBufferUsage.STORAGE}),p=i.createBuffer({label:"ParticleCounter",size:4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),h=i.createBuffer({label:"ParticleIndirect",size:16,usage:GPUBufferUsage.INDIRECT|GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});i.queue.writeBuffer(h,0,new Uint32Array([6,0,0,0]));const _=i.createBuffer({label:"ParticleComputeUniforms",size:So,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),m=i.createBuffer({label:"ParticleCompactUniforms",size:bs,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});i.queue.writeBuffer(m,0,new Uint32Array([l,0,0,0]));const b=i.createBuffer({label:"ParticleRenderUniforms",size:ys,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});i.queue.writeBuffer(b,0,new Float32Array([t.emitter.roughness,t.emitter.metallic,0,0]));const v=i.createBuffer({label:"ParticleCameraBuffer",size:Po,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),y=i.createBindGroupLayout({label:"ParticleComputeDataBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),w=i.createBindGroupLayout({label:"ParticleCompactDataBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),S=i.createBindGroupLayout({label:"ParticleComputeUniBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),x=i.createBindGroupLayout({label:"ParticleRenderDataBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}}]}),k=i.createBindGroupLayout({label:"ParticleCameraRenderBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),C=i.createBindGroupLayout({label:"ParticleRenderParamsBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),E=i.createBindGroup({label:"ParticleComputeDataBG",layout:y,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:f}},{binding:2,resource:{buffer:p}},{binding:3,resource:{buffer:h}}]}),I=i.createBindGroup({label:"ParticleCompactDataBG",layout:w,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:f}},{binding:2,resource:{buffer:p}},{binding:3,resource:{buffer:h}}]}),U=i.createBindGroup({label:"ParticleComputeUniBG",layout:S,entries:[{binding:0,resource:{buffer:_}}]}),g=i.createBindGroup({label:"ParticleCompactUniBG",layout:S,entries:[{binding:0,resource:{buffer:m}}]}),A=i.createBindGroup({label:"ParticleRenderDataBG",layout:x,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:f}}]}),P=i.createBindGroup({label:"ParticleCameraRenderBG",layout:k,entries:[{binding:0,resource:{buffer:v}}]}),T=i.createBindGroup({label:"ParticleRenderParamsBG",layout:C,entries:[{binding:0,resource:{buffer:b}}]});let B,N,G,q;ps(t)&&(B=i.createBuffer({label:"ParticleHeightmapData",size:kr*kr*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),N=i.createBuffer({label:"ParticleHeightmapUniforms",size:Go,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),q=i.createBindGroupLayout({label:"ParticleHeightmapBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),G=i.createBindGroup({label:"ParticleHeightmapBG",layout:q,entries:[{binding:0,resource:{buffer:B}},{binding:1,resource:{buffer:N}}]}));const O=i.createPipelineLayout({bindGroupLayouts:[y,S]}),L=q?i.createPipelineLayout({bindGroupLayouts:[y,S,q]}):i.createPipelineLayout({bindGroupLayouts:[y,S]}),F=i.createPipelineLayout({bindGroupLayouts:[w,S]}),z=i.createShaderModule({label:"ParticleSpawn",code:fs(t)}),ae=i.createShaderModule({label:"ParticleUpdate",code:_s(t)}),oe=i.createShaderModule({label:"ParticleCompact",code:ms}),ie=i.createComputePipeline({label:"ParticleSpawnPipeline",layout:O,compute:{module:z,entryPoint:"cs_main"}}),K=i.createComputePipeline({label:"ParticleUpdatePipeline",layout:L,compute:{module:ae,entryPoint:"cs_main"}}),ee=i.createComputePipeline({label:"ParticleCompactPipeline",layout:F,compute:{module:oe,entryPoint:"cs_compact"}}),D=i.createComputePipeline({label:"ParticleIndirectPipeline",layout:F,compute:{module:oe,entryPoint:"cs_write_indirect"}});let W;if(a){const Q=t.renderer.type==="sprites"?t.renderer.billboard:"camera",J=Q==="camera"?"vs_camera":"vs_main",ue=Q==="camera"?"fs_snow":"fs_main",ce=i.createShaderModule({label:"ParticleRenderForward",code:vs}),ge=i.createPipelineLayout({bindGroupLayouts:[x,k]});W=i.createRenderPipeline({label:"ParticleForwardPipeline",layout:ge,vertex:{module:ce,entryPoint:J},fragment:{module:ce,entryPoint:ue,targets:[{format:le,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},depthStencil:{format:"depth32float",depthWriteEnabled:!1,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}})}else{const Q=i.createShaderModule({label:"ParticleRender",code:gs}),J=i.createPipelineLayout({bindGroupLayouts:[x,k,C]});W=i.createRenderPipeline({label:"ParticleRenderPipeline",layout:J,vertex:{module:Q,entryPoint:"vs_main"},fragment:{module:Q,entryPoint:"fs_main",targets:[{format:"rgba8unorm"},{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}})}return new pn(n,o,a,t,l,c,f,p,h,_,b,v,ie,K,ee,D,W,E,U,I,g,A,P,a?void 0:T,B,N,G)}updateHeightmap(e,t,n,o,i){if(!this._heightmapDataBuf||!this._heightmapUniBuf)return;e.queue.writeBuffer(this._heightmapDataBuf,0,t.buffer);const a=this._hmUniBuf;a[0]=n,a[1]=o,a[2]=i,e.queue.writeBuffer(this._heightmapUniBuf,0,a.buffer,0,12),e.queue.writeBuffer(this._heightmapUniBuf,12,this._hmRes)}update(e,t,n,o,i,a,l,c,d,f){this._time+=t,this._frameSeed=this._frameSeed+1&4294967295,this._spawnAccum+=this._config.emitter.spawnRate*t,this._spawnCount=Math.min(Math.floor(this._spawnAccum),this._maxParticles),this._spawnAccum-=this._spawnCount;const p=f.data,h=p[12],_=p[13],m=p[14],b=Math.hypot(p[0],p[1],p[2]),v=Math.hypot(p[4],p[5],p[6]),y=Math.hypot(p[8],p[9],p[10]),w=p[0]/b,S=p[1]/b,x=p[2]/b,k=p[4]/v,C=p[5]/v,E=p[6]/v,I=p[8]/y,U=p[9]/y,g=p[10]/y,A=w+C+g;let P,T,B,N;if(A>0){const L=.5/Math.sqrt(A+1);N=.25/L,P=(E-U)*L,T=(I-x)*L,B=(S-k)*L}else if(w>C&&w>g){const L=2*Math.sqrt(1+w-C-g);N=(E-U)/L,P=.25*L,T=(k+S)/L,B=(I+x)/L}else if(C>g){const L=2*Math.sqrt(1+C-w-g);N=(I-x)/L,P=(k+S)/L,T=.25*L,B=(U+E)/L}else{const L=2*Math.sqrt(1+g-w-C);N=(S-k)/L,P=(I+x)/L,T=(U+E)/L,B=.25*L}const G=this._cuBuf,q=this._cuiView;G[0]=h,G[1]=_,G[2]=m,q[3]=this._spawnCount,G[4]=P,G[5]=T,G[6]=B,G[7]=N,q[8]=this._spawnOffset,q[9]=this._maxParticles,q[10]=this._frameSeed,q[11]=0,G[12]=t,G[13]=this._time,e.queue.writeBuffer(this._computeUniforms,0,G.buffer),e.queue.writeBuffer(this._counterBuffer,0,this._resetArr),this._spawnOffset=(this._spawnOffset+this._spawnCount)%this._maxParticles;const O=this._camBuf;O.set(n.data,0),O.set(o.data,16),O.set(i.data,32),O.set(a.data,48),O[64]=l.x,O[65]=l.y,O[66]=l.z,O[67]=c,O[68]=d,e.queue.writeBuffer(this._cameraBuffer,0,O.buffer)}execute(e,t){const n=e.beginComputePass({label:"ParticleCompute"});if(this._spawnCount>0&&(n.setPipeline(this._spawnPipeline),n.setBindGroup(0,this._computeDataBG),n.setBindGroup(1,this._computeUniBG),n.dispatchWorkgroups(Math.ceil(this._spawnCount/64))),n.setPipeline(this._updatePipeline),n.setBindGroup(0,this._computeDataBG),n.setBindGroup(1,this._computeUniBG),this._heightmapBG&&n.setBindGroup(2,this._heightmapBG),n.dispatchWorkgroups(Math.ceil(this._maxParticles/64)),n.setPipeline(this._compactPipeline),n.setBindGroup(0,this._compactDataBG),n.setBindGroup(1,this._compactUniBG),n.dispatchWorkgroups(Math.ceil(this._maxParticles/64)),n.setPipeline(this._indirectPipeline),n.dispatchWorkgroups(1),n.end(),this._isForward){const o=e.beginRenderPass({label:"ParticleForwardPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthReadOnly:!0}});o.setPipeline(this._renderPipeline),o.setBindGroup(0,this._renderDataBG),o.setBindGroup(1,this._cameraRenderBG),o.drawIndirect(this._indirectBuffer,0),o.end()}else{const o=e.beginRenderPass({label:"ParticleGBufferPass",colorAttachments:[{view:this._gbuffer.albedoRoughnessView,loadOp:"load",storeOp:"store"},{view:this._gbuffer.normalMetallicView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthLoadOp:"load",depthStoreOp:"store"}});o.setPipeline(this._renderPipeline),o.setBindGroup(0,this._renderDataBG),o.setBindGroup(1,this._cameraRenderBG),o.setBindGroup(2,this._renderParamsBG),o.drawIndirect(this._indirectBuffer,0),o.end()}}destroy(){var e,t;this._particleBuffer.destroy(),this._aliveList.destroy(),this._counterBuffer.destroy(),this._indirectBuffer.destroy(),this._computeUniforms.destroy(),this._renderUniforms.destroy(),this._cameraBuffer.destroy(),(e=this._heightmapDataBuf)==null||e.destroy(),(t=this._heightmapUniBuf)==null||t.destroy()}}const ws=`// Auto-exposure — two-pass histogram approach.\r
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
`,xs=64,Bs=32,Ss=16,Ps=xs*4,To={adaptSpeed:1.5,minExposure:.1,maxExposure:10,lowPct:.05,highPct:.02},dt=class dt extends Se{constructor(e,t,n,o,i,a,l,c){super();s(this,"name","AutoExposurePass");s(this,"exposureBuffer");s(this,"_histogramPipeline");s(this,"_adaptPipeline");s(this,"_bindGroup");s(this,"_paramsBuffer");s(this,"_histogramBuffer");s(this,"_hdrWidth");s(this,"_hdrHeight");s(this,"enabled",!0);s(this,"_resetScratch",new Float32Array([1,0,0,0]));this._histogramPipeline=e,this._adaptPipeline=t,this._bindGroup=n,this._paramsBuffer=o,this._histogramBuffer=i,this.exposureBuffer=a,this._hdrWidth=l,this._hdrHeight=c}static create(e,t,n=To){const{device:o}=e,i=o.createBindGroupLayout({label:"AutoExposureBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),a=o.createBuffer({label:"AutoExposureHistogram",size:Ps,usage:GPUBufferUsage.STORAGE}),l=o.createBuffer({label:"AutoExposureValue",size:Ss,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});o.queue.writeBuffer(l,0,new Float32Array([1,0,0,0]));const c=o.createBuffer({label:"AutoExposureParams",size:Bs,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});dt._writeParams(o,c,0,n);const d=o.createBindGroup({label:"AutoExposureBG",layout:i,entries:[{binding:0,resource:t.createView()},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:c}}]}),f=o.createPipelineLayout({bindGroupLayouts:[i]}),p=o.createShaderModule({label:"AutoExposure",code:ws}),h=o.createComputePipeline({label:"AutoExposureHistogramPipeline",layout:f,compute:{module:p,entryPoint:"cs_histogram"}}),_=o.createComputePipeline({label:"AutoExposureAdaptPipeline",layout:f,compute:{module:p,entryPoint:"cs_adapt"}});return new dt(h,_,d,c,a,l,t.width,t.height)}update(e,t,n=To){if(!this.enabled){e.device.queue.writeBuffer(this.exposureBuffer,0,this._resetScratch);return}dt._writeParams(e.device,this._paramsBuffer,t,n)}execute(e,t){if(!this.enabled)return;const n=e.beginComputePass({label:"AutoExposurePass"});n.setPipeline(this._histogramPipeline),n.setBindGroup(0,this._bindGroup),n.dispatchWorkgroups(Math.ceil(this._hdrWidth/32),Math.ceil(this._hdrHeight/32)),n.setPipeline(this._adaptPipeline),n.dispatchWorkgroups(1),n.end()}destroy(){this._paramsBuffer.destroy(),this._histogramBuffer.destroy(),this.exposureBuffer.destroy()}static _writeParams(e,t,n,o){const i=dt._paramsScratch;i[0]=n,i[1]=o.adaptSpeed,i[2]=o.minExposure,i[3]=o.maxExposure,i[4]=o.lowPct,i[5]=o.highPct,i[6]=0,i[7]=0,e.queue.writeBuffer(t,0,i)}};s(dt,"_paramsScratch",new Float32Array(8));let Vr=dt;function Gs(u,r,e){let t=(Math.imul(u,1664525)^Math.imul(r,1013904223)^Math.imul(e,22695477))>>>0;return t=Math.imul(t^t>>>16,73244475)>>>0,t=Math.imul(t^t>>>16,73244475)>>>0,((t^t>>>16)>>>0)/4294967295}function nr(u,r,e,t){return Gs(u^t,r^t*7+3,e^t*13+5)}function Cr(u){return u*u*u*(u*(u*6-15)+10)}function Ts(u,r,e,t,n,o,i,a,l,c,d){const f=u+(r-u)*l,p=e+(t-e)*l,h=n+(o-n)*l,_=i+(a-i)*l,m=f+(p-f)*c,b=h+(_-h)*c;return m+(b-m)*d}const Ms=new Int8Array([1,-1,1,-1,1,-1,1,-1,0,0,0,0]),Es=new Int8Array([1,1,-1,-1,0,0,0,0,1,-1,1,-1]),As=new Int8Array([0,0,0,0,1,1,-1,-1,1,1,-1,-1]);function et(u,r,e,t,n,o,i,a){const l=(u%t+t)%t,c=(r%t+t)%t,d=(e%t+t)%t,f=Math.floor(nr(l,c,d,n)*12)%12;return Ms[f]*o+Es[f]*i+As[f]*a}function Us(u,r,e,t,n){const o=Math.floor(u),i=Math.floor(r),a=Math.floor(e),l=u-o,c=r-i,d=e-a,f=Cr(l),p=Cr(c),h=Cr(d);return Ts(et(o,i,a,t,n,l,c,d),et(o+1,i,a,t,n,l-1,c,d),et(o,i+1,a,t,n,l,c-1,d),et(o+1,i+1,a,t,n,l-1,c-1,d),et(o,i,a+1,t,n,l,c,d-1),et(o+1,i,a+1,t,n,l-1,c,d-1),et(o,i+1,a+1,t,n,l,c-1,d-1),et(o+1,i+1,a+1,t,n,l-1,c-1,d-1),f,p,h)}function ks(u,r,e,t,n,o){let i=0,a=.5,l=1,c=0;for(let d=0;d<t;d++)i+=Us(u*l,r*l,e*l,n*l,o+d*17)*a,c+=a,a*=.5,l*=2;return Math.max(0,Math.min(1,i/c*.85+.5))}function gt(u,r,e,t,n){const o=u*t,i=r*t,a=e*t,l=Math.floor(o),c=Math.floor(i),d=Math.floor(a);let f=1/0;for(let p=-1;p<=1;p++)for(let h=-1;h<=1;h++)for(let _=-1;_<=1;_++){const m=l+_,b=c+h,v=d+p,y=(m%t+t)%t,w=(b%t+t)%t,S=(v%t+t)%t,x=m+nr(y,w,S,n),k=b+nr(y,w,S,n+1),C=v+nr(y,w,S,n+2),E=o-x,I=i-k,U=a-C,g=E*E+I*I+U*U;g<f&&(f=g)}return 1-Math.min(Math.sqrt(f),1)}function Mo(u,r,e,t){const n=u.createTexture({label:r,dimension:"3d",size:{width:e,height:e,depthOrArrayLayers:e},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return u.queue.writeTexture({texture:n},t.buffer,{bytesPerRow:e*4,rowsPerImage:e},{width:e,height:e,depthOrArrayLayers:e}),n}function Cs(u){const e=new Uint8Array(1048576);for(let a=0;a<64;a++)for(let l=0;l<64;l++)for(let c=0;c<64;c++){const d=(a*64*64+l*64+c)*4,f=c/64,p=l/64,h=a/64,_=ks(f,p,h,4,4,0),m=gt(f,p,h,2,100),b=gt(f,p,h,4,200),v=gt(f,p,h,8,300);e[d]=Math.round(_*255),e[d+1]=Math.round(m*255),e[d+2]=Math.round(b*255),e[d+3]=Math.round(v*255)}const t=32,n=new Uint8Array(t*t*t*4);for(let a=0;a<t;a++)for(let l=0;l<t;l++)for(let c=0;c<t;c++){const d=(a*t*t+l*t+c)*4,f=c/t,p=l/t,h=a/t,_=gt(f,p,h,4,400),m=gt(f,p,h,8,500),b=gt(f,p,h,16,600);n[d]=Math.round(_*255),n[d+1]=Math.round(m*255),n[d+2]=Math.round(b*255),n[d+3]=255}const o=Mo(u,"CloudBaseNoise",64,e),i=Mo(u,"CloudDetailNoise",t,n);return{baseNoise:o,baseView:o.createView({dimension:"3d"}),detailNoise:i,detailView:i.createView({dimension:"3d"}),destroy(){o.destroy(),i.destroy()}}}const Ls=`// IBL baking — two compute entry points share the same bind group layout.\r
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
`,Yt=5,Lr=128,Xt=32,Rs=[0,.25,.5,.75,1],Ns=Math.PI;function Is(u){let r=u>>>0;return r=(r<<16|r>>>16)>>>0,r=((r&1431655765)<<1|r>>>1&1431655765)>>>0,r=((r&858993459)<<2|r>>>2&858993459)>>>0,r=((r&252645135)<<4|r>>>4&252645135)>>>0,r=((r&16711935)<<8|r>>>8&16711935)>>>0,r*23283064365386963e-26}function Os(u,r,e){const t=new Float32Array(u*r*4);for(let n=0;n<r;n++)for(let o=0;o<u;o++){const i=(o+.5)/u,a=(n+.5)/r,l=a*a,c=l*l,d=Math.sqrt(1-i*i),f=i;let p=0,h=0;for(let m=0;m<e;m++){const b=(m+.5)/e,v=Is(m),y=(1-v)/(1+(c-1)*v),w=Math.sqrt(y),S=Math.sqrt(Math.max(0,1-y)),x=2*Ns*b,k=S*Math.cos(x),C=w,E=d*k+f*C;if(E<=0)continue;const I=2*E*C-f,U=Math.max(0,I),g=Math.max(0,w);if(U<=0)continue;const A=c/2,P=i/(i*(1-A)+A),T=U/(U*(1-A)+A),B=P*T*E/(g*i),N=Math.pow(1-E,5);p+=B*(1-N),h+=B*N}const _=(n*u+o)*4;t[_+0]=p/e,t[_+1]=h/e,t[_+2]=0,t[_+3]=1}return t}function Ds(u){const r=new Float32Array([u]),e=new Uint32Array(r.buffer)[0],t=e>>31&1,n=e>>23&255,o=e&8388607;if(n===255)return t<<15|31744|(o?1:0);if(n===0)return t<<15;const i=n-127+15;return i>=31?t<<15|31744:i<=0?t<<15:t<<15|i<<10|o>>13}function Vs(u){const r=new Uint16Array(u.length);for(let e=0;e<u.length;e++)r[e]=Ds(u[e]);return r}const Eo=new WeakMap;function zs(u){const r=Eo.get(u);if(r)return r;const e=Vs(Os(64,64,512)),t=u.createTexture({label:"IBL BRDF LUT",size:{width:64,height:64},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return u.queue.writeTexture({texture:t},e,{bytesPerRow:64*8},{width:64,height:64}),Eo.set(u,t),t}const Ao=new WeakMap;function Fs(u){const r=Ao.get(u);if(r)return r;const e=u.createBindGroupLayout({label:"IblBGL0",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.COMPUTE,sampler:{type:"filtering"}}]}),t=u.createBindGroupLayout({label:"IblBGL1",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"2d"}}]}),n=u.createPipelineLayout({bindGroupLayouts:[e,t]}),o=u.createShaderModule({label:"IblCompute",code:Ls}),i=u.createComputePipeline({label:"IblIrradiancePipeline",layout:n,compute:{module:o,entryPoint:"cs_irradiance"}}),a=u.createComputePipeline({label:"IblPrefilterPipeline",layout:n,compute:{module:o,entryPoint:"cs_prefilter"}}),l=u.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"clamp-to-edge"}),c={irrPipeline:i,pfPipeline:a,bgl0:e,bgl1:t,sampler:l};return Ao.set(u,c),c}async function Hs(u,r,e=.2){const{irrPipeline:t,pfPipeline:n,bgl0:o,bgl1:i,sampler:a}=Fs(u),l=u.createTexture({label:"IBL Irradiance",size:{width:Xt,height:Xt,depthOrArrayLayers:6},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),c=u.createTexture({label:"IBL Prefiltered",size:{width:Lr,height:Lr,depthOrArrayLayers:6},mipLevelCount:Yt,format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),d=(U,g)=>{const A=u.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return u.queue.writeBuffer(A,0,new Float32Array([e,U,g,0])),A},f=r.createView(),p=U=>u.createBindGroup({layout:o,entries:[{binding:0,resource:{buffer:U}},{binding:1,resource:f},{binding:2,resource:a}]}),h=U=>u.createBindGroup({layout:i,entries:[{binding:0,resource:U}]}),_=Array.from({length:6},(U,g)=>d(0,g)),m=Rs.flatMap((U,g)=>Array.from({length:6},(A,P)=>d(U,P))),b=_.map(p),v=m.map(p),y=Array.from({length:6},(U,g)=>h(l.createView({dimension:"2d",baseArrayLayer:g,arrayLayerCount:1}))),w=Array.from({length:Yt*6},(U,g)=>{const A=Math.floor(g/6),P=g%6;return h(c.createView({dimension:"2d",baseMipLevel:A,mipLevelCount:1,baseArrayLayer:P,arrayLayerCount:1}))}),S=u.createCommandEncoder({label:"IblComputeEncoder"}),x=S.beginComputePass({label:"IblComputePass"});x.setPipeline(t);for(let U=0;U<6;U++)x.setBindGroup(0,b[U]),x.setBindGroup(1,y[U]),x.dispatchWorkgroups(Math.ceil(Xt/8),Math.ceil(Xt/8));x.setPipeline(n);for(let U=0;U<Yt;U++){const g=Lr>>U;for(let A=0;A<6;A++)x.setBindGroup(0,v[U*6+A]),x.setBindGroup(1,w[U*6+A]),x.dispatchWorkgroups(Math.ceil(g/8),Math.ceil(g/8))}x.end(),u.queue.submit([S.finish()]),await u.queue.onSubmittedWorkDone(),_.forEach(U=>U.destroy()),m.forEach(U=>U.destroy());const k=zs(u),C=l.createView({dimension:"cube"}),E=c.createView({dimension:"cube"}),I=k.createView();return{irradiance:l,prefiltered:c,brdfLut:k,irradianceView:C,prefilteredView:E,brdfLutView:I,levels:Yt,destroy(){l.destroy(),c.destroy()}}}class Ne{constructor(r,e){s(this,"gpuTexture");s(this,"view");s(this,"type");this.gpuTexture=r,this.type=e,this.view=r.createView({dimension:e==="cube"?"cube":e==="3d"?"3d":"2d"})}destroy(){this.gpuTexture.destroy()}static createSolid(r,e,t,n,o=255){const i=r.createTexture({size:{width:1,height:1},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return r.queue.writeTexture({texture:i},new Uint8Array([e,t,n,o]),{bytesPerRow:4},{width:1,height:1}),new Ne(i,"2d")}static fromBitmap(r,e,{srgb:t=!1,usage:n}={}){const o=t?"rgba8unorm-srgb":"rgba8unorm";n=n?n|(GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT):GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT;const i=r.createTexture({size:{width:e.width,height:e.height},format:o,usage:n});return r.queue.copyExternalImageToTexture({source:e,flipY:!1},{texture:i},{width:e.width,height:e.height}),new Ne(i,"2d")}static async fromUrl(r,e,t={}){const n=await(await fetch(e)).blob(),o={colorSpaceConversion:"none"};t.resizeWidth!==void 0&&t.resizeHeight!==void 0&&(o.resizeWidth=t.resizeWidth,o.resizeHeight=t.resizeHeight,o.resizeQuality="high");const i=await createImageBitmap(n,o);return Ne.fromBitmap(r,i,t)}}const Ws=`// Decodes an RGBE (Radiance HDR) texture into a linear rgba16float texture.\r
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
`;function js(u){const r=new Uint8Array(u);let e=0;function t(){let p="";for(;e<r.length&&r[e]!==10;)r[e]!==13&&(p+=String.fromCharCode(r[e])),e++;return e<r.length&&e++,p}const n=t();if(!n.startsWith("#?RADIANCE")&&!n.startsWith("#?RGBE"))throw new Error(`Not a Radiance HDR file (magic: "${n}")`);for(;t().length!==0;);const o=t(),i=o.match(/-Y\s+(\d+)\s+\+X\s+(\d+)/);if(!i)throw new Error(`Unrecognized HDR resolution: "${o}"`);const a=parseInt(i[1],10),l=parseInt(i[2],10),c=new Uint8Array(l*a*4);function d(p){const h=new Uint8Array(l),_=new Uint8Array(l),m=new Uint8Array(l),b=new Uint8Array(l),v=[h,_,m,b];for(let w=0;w<4;w++){const S=v[w];let x=0;for(;x<l;){const k=r[e++];if(k>128){const C=k-128,E=r[e++];S.fill(E,x,x+C),x+=C}else S.set(r.subarray(e,e+k),x),e+=k,x+=k}}const y=p*l*4;for(let w=0;w<l;w++)c[y+w*4+0]=h[w],c[y+w*4+1]=_[w],c[y+w*4+2]=m[w],c[y+w*4+3]=b[w]}function f(p,h,_,m,b){const v=p*l*4;c[v+0]=h,c[v+1]=_,c[v+2]=m,c[v+3]=b;let y=1;for(;y<l;){const w=r[e++],S=r[e++],x=r[e++],k=r[e++];if(w===1&&S===1&&x===1){const C=v+(y-1)*4;for(let E=0;E<k;E++)c[v+y*4+0]=c[C+0],c[v+y*4+1]=c[C+1],c[v+y*4+2]=c[C+2],c[v+y*4+3]=c[C+3],y++}else c[v+y*4+0]=w,c[v+y*4+1]=S,c[v+y*4+2]=x,c[v+y*4+3]=k,y++}}for(let p=0;p<a&&!(e+4>r.length);p++){const h=r[e++],_=r[e++],m=r[e++],b=r[e++];if(h===2&&_===2&&!(m&128)){const v=m<<8|b;if(v!==l)throw new Error(`HDR scanline width mismatch: ${v} vs ${l}`);d(p)}else f(p,h,_,m,b)}return{width:l,height:a,data:c}}const Uo=new WeakMap;function qs(u){const r=Uo.get(u);if(r)return r;const e=u.createBindGroupLayout({label:"RgbeSrcBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"uint"}}]}),t=u.createBindGroupLayout({label:"RgbeDstBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"2d"}}]}),n=u.createPipelineLayout({bindGroupLayouts:[e,t]}),o=u.createShaderModule({label:"RgbeDecode",code:Ws}),a={pipeline:u.createComputePipeline({label:"RgbeDecodePipeline",layout:n,compute:{module:o,entryPoint:"cs_decode"}}),srcBGL:e,dstBGL:t};return Uo.set(u,a),a}async function Ys(u,r){const{width:e,height:t,data:n}=r,{pipeline:o,srcBGL:i,dstBGL:a}=qs(u),l=u.createTexture({label:"Sky RGBE Raw",size:{width:e,height:t},format:"rgba8uint",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});u.queue.writeTexture({texture:l},n.buffer,{bytesPerRow:e*4},{width:e,height:t});const c=u.createTexture({label:"Sky HDR Texture",size:{width:e,height:t},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),d=u.createBindGroup({layout:i,entries:[{binding:0,resource:l.createView()}]}),f=u.createBindGroup({layout:a,entries:[{binding:0,resource:c.createView()}]}),p=u.createCommandEncoder({label:"RgbeDecodeEncoder"}),h=p.beginComputePass({label:"RgbeDecodePass"});return h.setPipeline(o),h.setBindGroup(0,d),h.setBindGroup(1,f),h.dispatchWorkgroups(Math.ceil(e/8),Math.ceil(t/8)),h.end(),u.queue.submit([p.finish()]),await u.queue.onSubmittedWorkDone(),l.destroy(),new Ne(c,"2d")}class hn{constructor(r,e,t,n,o,i,a){s(this,"colorAtlas");s(this,"normalAtlas");s(this,"merAtlas");s(this,"heightAtlas");s(this,"blockSize");s(this,"blockCount");s(this,"_atlasWidth");s(this,"_atlasHeight");this.colorAtlas=r,this.normalAtlas=e,this.merAtlas=t,this.heightAtlas=n,this.blockSize=o,this._atlasWidth=i,this._atlasHeight=a,this.blockCount=Math.floor(i/o)}static async load(r,e,t,n,o,i=16){async function a(y){const w=await(await fetch(y)).blob();return createImageBitmap(w,{colorSpaceConversion:"none"})}const[l,c,d,f]=await Promise.all([a(e),a(t),a(n),a(o)]),p=l.width,h=l.height,_=Ne.fromBitmap(r,l,{srgb:!0}),m=Ne.fromBitmap(r,c,{srgb:!1}),b=Ne.fromBitmap(r,d,{srgb:!1}),v=Ne.fromBitmap(r,f,{srgb:!1});return new hn(_,m,b,v,i,p,h)}uvTransform(r){const e=this.blockSize/this._atlasWidth,t=this.blockSize/this._atlasHeight;return[r*e,0,e,t]}destroy(){this.colorAtlas.destroy(),this.normalAtlas.destroy(),this.merAtlas.destroy(),this.heightAtlas.destroy()}}var Be=(u=>(u[u.None=0]="None",u[u.SnowyMountains=1]="SnowyMountains",u[u.RockyMountains=2]="RockyMountains",u[u.GrassyPlains=3]="GrassyPlains",u[u.SnowyPlains=4]="SnowyPlains",u[u.Desert=5]="Desert",u[u.Max=6]="Max",u))(Be||{}),Ye=(u=>(u[u.None=0]="None",u[u.Rain=1]="Rain",u[u.Snow=2]="Snow",u))(Ye||{});function ko(u){switch(u){case 1:return{cloudBase:90,cloudTop:200};case 2:return{cloudBase:75,cloudTop:160};default:return{cloudBase:75,cloudTop:105}}}const $t=.05,Xs=[[.35,5,3],[-.15,3,4],[-.3,4,1],[-.5,1,2]];function $s(u){for(const[e,t,n]of Xs){const o=u-e;if(o>=-$t&&o<=$t)return{biome1:n,biome2:t,blend:(o+$t)/(2*$t)}}const r=Zs(u);return{biome1:r,biome2:r,blend:0}}function Zs(u){return u>.35?5:u>-.15?3:u>-.3?4:u>-.5?1:2}function Ks(u,r){let e=(Math.imul(u|0,2654435769)^Math.imul(r|0,1367130551))>>>0;return e=Math.imul(e^e>>>16,73244475)>>>0,e=(e^e>>>16)>>>0,e/4294967296}const X=class X{constructor(r,e,t){s(this,"blocks",new Uint8Array(X.CHUNK_WIDTH*X.CHUNK_HEIGHT*X.CHUNK_DEPTH));s(this,"globalPosition",new j);s(this,"opaqueIndex",-1);s(this,"transparentIndex",-1);s(this,"waterIndex",-1);s(this,"drawCommandIndex",-1);s(this,"chunkDataIndex",-1);s(this,"aabbTreeIndex",-1);s(this,"aliveBlocks",0);s(this,"opaqueBlocks",0);s(this,"transparentBlocks",0);s(this,"waterBlocks",0);s(this,"lightBlocks",0);s(this,"isDeleted",!1);this.globalPosition.set(r,e,t)}generateVertices(r){const e=X.CHUNK_WIDTH,t=X.CHUNK_HEIGHT,n=X.CHUNK_DEPTH,o=5;let i=0,a=0,l=0;for(let P=0;P<this.blocks.length;P++){const T=this.blocks[P];T===R.NONE||_e(T)||(Ae(T)?l++:mt(T)?a++:i++)}const c=new Float32Array(i*36*o),d=new Float32Array(a*36*o),f=new Float32Array(l*6*o),p=new Uint16Array(e*t*6);let h=0,_=0,m=0,b=!1;const v=[],y=e+2,w=t+2,S=y*w,x=new Uint8Array(y*w*(n+2));for(let P=0;P<n;P++)for(let T=0;T<t;T++)for(let B=0;B<e;B++)x[B+1+(T+1)*y+(P+1)*S]=this.blocks[B+T*e+P*e*t];if(r!=null&&r.negX){const P=r.negX;for(let T=0;T<n;T++)for(let B=0;B<t;B++)x[0+(B+1)*y+(T+1)*S]=P[e-1+B*e+T*e*t]}if(r!=null&&r.posX){const P=r.posX;for(let T=0;T<n;T++)for(let B=0;B<t;B++)x[e+1+(B+1)*y+(T+1)*S]=P[0+B*e+T*e*t]}if(r!=null&&r.negY){const P=r.negY;for(let T=0;T<n;T++)for(let B=0;B<e;B++)x[B+1+0+(T+1)*S]=P[B+(t-1)*e+T*e*t]}if(r!=null&&r.posY){const P=r.posY;for(let T=0;T<n;T++)for(let B=0;B<e;B++)x[B+1+(t+1)*y+(T+1)*S]=P[B+0*e+T*e*t]}if(r!=null&&r.negZ){const P=r.negZ;for(let T=0;T<t;T++)for(let B=0;B<e;B++)x[B+1+(T+1)*y+0]=P[B+T*e+(n-1)*e*t]}if(r!=null&&r.posZ){const P=r.posZ;for(let T=0;T<t;T++)for(let B=0;B<e;B++)x[B+1+(T+1)*y+(n+1)*S]=P[B+T*e+0*e*t]}const k=(P,T,B,N)=>{p[(P*t+T)*6+N]|=1<<B},C=(P,T,B,N)=>(p[(P*t+T)*6+N]&1<<B)!==0,E=(P,T,B)=>x[P+1+(T+1)*y+(B+1)*S],I=(P,T)=>!(T===R.NONE||Ae(P)||Ae(T)||!_e(P)&&_e(T)||!mt(P)&&mt(T)),U=X.CUBE_VERTS;for(let P=0;P<e;P++)for(let T=0;T<t;T++)for(let B=0;B<n;B++){const N=E(P,T,B);if(N===R.NONE)continue;if(_e(N)){v.push({x:P,y:T,z:B}),b=!0;continue}if(Ae(N)){for(let K=0;K<6;K++)f[m++]=P+.5,f[m++]=T+.5,f[m++]=B+.5,f[m++]=6,f[m++]=N;continue}const q=mt(N),O=I(N,E(P,T,B-1))||C(P,T,B,0),L=I(N,E(P,T,B+1))||C(P,T,B,1),F=I(N,E(P-1,T,B))||C(P,T,B,2),z=I(N,E(P+1,T,B))||C(P,T,B,3),ae=I(N,E(P,T-1,B))||C(P,T,B,4),oe=I(N,E(P,T+1,B))||C(P,T,B,5);if(O&&L&&F&&z&&ae&&oe)continue;let ie=T;if(!O||!L||!F||!z){let K=T;for(;K<t&&E(P,K,B)===N;){ie=K;K++}}if(!O||!L){let K=P,ee=P,D=0;for(;ee<e&&E(ee,T,B)===N;){let $=T;for(;$<=ie&&E(ee,$,B)===N;){D=$;$++}if(D===ie)K=ee,ee++;else break}for(let $=P;$<=K;$++)for(let de=T;de<=ie;de++)O||k($,de,B,0),L||k($,de,B,1);let W,Q;!O&&!L?(W=0,Q=12):O?(W=6,Q=12):(W=0,Q=6);const J=K+1-P,ue=ie+1-T,ce=q?d:c;let ge=q?_:h;for(let $=W;$<Q;$++){const de=U[$*3],ye=U[$*3+1],Re=U[$*3+2];ce[ge++]=P+.5*(J-1)+.5+de*J,ce[ge++]=T+.5*(ue-1)+.5+ye*ue,ce[ge++]=B+.5+Re,ce[ge++]=$<6?0:1,ce[ge++]=N}q?_=ge:h=ge}if(!F||!z){let K=B,ee=B,D=0;for(;ee<n&&E(P,T,ee)===N;){let $=T;for(;$<=ie&&E(P,$,ee)===N;){D=$;$++}if(D===ie)K=ee,ee++;else break}for(let $=B;$<=K;$++)for(let de=T;de<=ie;de++)F||k(P,de,$,2),z||k(P,de,$,3);let W,Q;!F&&!z?(W=12,Q=24):F?(W=18,Q=24):(W=12,Q=18);const J=K+1-B,ue=ie+1-T,ce=q?d:c;let ge=q?_:h;for(let $=W;$<Q;$++){const de=U[$*3],ye=U[$*3+1],Re=U[$*3+2];ce[ge++]=P+.5+de,ce[ge++]=T+.5*(ue-1)+.5+ye*ue,ce[ge++]=B+.5*(J-1)+.5+Re*J,ce[ge++]=$<18?2:3,ce[ge++]=N}q?_=ge:h=ge}if(!ae||!oe){let K=P,ee=P;for(;ee<e&&E(ee,T,B)===N;){K=ee;ee++}let D=B,W=B,Q=0;for(;W<n&&E(P,T,W)===N;){let ye=P;for(;ye<=K&&E(ye,T,W)===N;){Q=ye;ye++}if(Q===K)D=W,W++;else break}for(let ye=P;ye<=K;ye++)for(let Re=B;Re<=D;Re++)ae||k(ye,T,Re,4),oe||k(ye,T,Re,5);let J,ue;!ae&&!oe?(J=24,ue=36):ae?(J=30,ue=36):(J=24,ue=30);const ce=K+1-P,ge=D+1-B,$=q?d:c;let de=q?_:h;for(let ye=J;ye<ue;ye++){const Re=U[ye*3],Xe=U[ye*3+1],Ie=U[ye*3+2];$[de++]=P+.5*(ce-1)+.5+Re*ce,$[de++]=T+.5+Xe,$[de++]=B+.5*(ge-1)+.5+Ie*ge,$[de++]=ye<30?4:5,$[de++]=N}q?_=de:h=de}}let g=null,A=0;if(b){const P=(r==null?void 0:r.negX)!==void 0,T=(r==null?void 0:r.posX)!==void 0,B=(r==null?void 0:r.negZ)!==void 0,N=(r==null?void 0:r.posZ)!==void 0;g=new Float32Array(v.length*6*6*3);let G=0;for(const q of v){const{x:O,y:L,z:F}=q,z=O+1,ae=L+1,oe=F+1,ie=x[z+(ae+1)*y+oe*S];_e(ie)||(g[G++]=O,g[G++]=L+1,g[G++]=F,g[G++]=O+1,g[G++]=L+1,g[G++]=F,g[G++]=O+1,g[G++]=L+1,g[G++]=F+1,g[G++]=O,g[G++]=L+1,g[G++]=F,g[G++]=O,g[G++]=L+1,g[G++]=F+1,g[G++]=O+1,g[G++]=L+1,g[G++]=F+1);const K=x[z+ae*y+(oe+1)*S],ee=F===n-1;!_e(K)&&!(ee&&K===R.NONE&&!N)&&(g[G++]=O,g[G++]=L,g[G++]=F+1,g[G++]=O+1,g[G++]=L,g[G++]=F+1,g[G++]=O+1,g[G++]=L+1,g[G++]=F+1,g[G++]=O,g[G++]=L,g[G++]=F+1,g[G++]=O,g[G++]=L+1,g[G++]=F+1,g[G++]=O+1,g[G++]=L+1,g[G++]=F+1);const D=x[z+ae*y+(oe-1)*S],W=F===0;!_e(D)&&!(W&&D===R.NONE&&!B)&&(g[G++]=O+1,g[G++]=L,g[G++]=F,g[G++]=O,g[G++]=L,g[G++]=F,g[G++]=O,g[G++]=L+1,g[G++]=F,g[G++]=O+1,g[G++]=L,g[G++]=F,g[G++]=O+1,g[G++]=L+1,g[G++]=F,g[G++]=O,g[G++]=L+1,g[G++]=F);const Q=x[z+1+ae*y+oe*S],J=O===e-1;!_e(Q)&&!(J&&Q===R.NONE&&!T)&&(g[G++]=O+1,g[G++]=L,g[G++]=F,g[G++]=O+1,g[G++]=L+1,g[G++]=F,g[G++]=O+1,g[G++]=L+1,g[G++]=F+1,g[G++]=O+1,g[G++]=L,g[G++]=F,g[G++]=O+1,g[G++]=L,g[G++]=F+1,g[G++]=O+1,g[G++]=L+1,g[G++]=F+1);const ue=x[z-1+ae*y+oe*S],ce=O===0;!_e(ue)&&!(ce&&ue===R.NONE&&!P)&&(g[G++]=O,g[G++]=L,g[G++]=F+1,g[G++]=O,g[G++]=L+1,g[G++]=F+1,g[G++]=O,g[G++]=L+1,g[G++]=F,g[G++]=O,g[G++]=L,g[G++]=F+1,g[G++]=O,g[G++]=L,g[G++]=F,g[G++]=O,g[G++]=L+1,g[G++]=F);const ge=x[z+(ae-1)*y+oe*S];_e(ge)||(g[G++]=O,g[G++]=L,g[G++]=F+1,g[G++]=O+1,g[G++]=L,g[G++]=F+1,g[G++]=O+1,g[G++]=L,g[G++]=F,g[G++]=O,g[G++]=L,g[G++]=F+1,g[G++]=O,g[G++]=L,g[G++]=F,g[G++]=O+1,g[G++]=L,g[G++]=F)}A=G/3,g=g.subarray(0,G)}return{opaque:c.subarray(0,h),opaqueCount:h/o,transparent:d.subarray(0,_),transparentCount:_/o,water:g||new Float32Array(0),waterCount:A,prop:f.subarray(0,m),propCount:m/o}}generateBlocks(r,e){const t=X.CHUNK_WIDTH,n=X.CHUNK_HEIGHT,o=X.CHUNK_DEPTH,i=new Float64Array(t*o),a=new Float64Array(t*o),l=new Float32Array(t*o),c=new Uint8Array(t*o),d=new Uint8Array(t*o),f=new Float32Array(t*o);for(let p=0;p<o;p++)for(let h=0;h<t;h++){const _=h+this.globalPosition.x,m=p+this.globalPosition.z,b=h+p*t,v=Ce(_/512,-5,m/512,0,0,0,r+31337),y=Ce(_/2048,10,m/2048,0,0,0,r);i[b]=Math.abs(Ce(_/1024,0,m/1024,0,0,0,r)*450)*Math.max(.1,(y+1)*.5),a[b]=ci(_/256,15,m/256,2,.6,1.2,6)*12,l[b]=e?e(_,m):0;const w=$s(v);c[b]=w.biome1,d[b]=w.biome2,f[b]=w.blend}for(let p=0;p<o;p++)for(let h=0;h<n;h++)for(let _=0;_<t;_++){if(this.getBlock(_,h,p)!==R.NONE)continue;const m=_+p*t,b=_+this.globalPosition.x,v=h+this.globalPosition.y,y=p+this.globalPosition.z,w=Math.abs(Ce(b/256,v/512,y/256,0,0,0,r)*i[m])+a[m]+l[m];v<w?X._isCave(b,v,y,r,w-v)?v<X.SEA_LEVEL+1?this.setBlock(_,h,p,R.WATER):this.setBlock(_,h,p,R.NONE):this.setBlock(_,h,p,this._generateBlockBasedOnBiome(c[m],d[m],f[m],b,v,y,w)):v<X.SEA_LEVEL+1&&this.setBlock(_,h,p,R.WATER)}for(let p=0;p<X.CHUNK_DEPTH;p++)for(let h=0;h<X.CHUNK_HEIGHT;h++)for(let _=0;_<X.CHUNK_WIDTH;_++){if(this.getBlock(_,h,p)===R.NONE)continue;const m=_+this.globalPosition.x,b=h+this.globalPosition.y,v=p+this.globalPosition.z;this._generateAdditionalBlocks(_,h,p,m,b,v,r)}}setBlock(r,e,t,n){if(r<0||r>=X.CHUNK_WIDTH||e<0||e>=X.CHUNK_HEIGHT||t<0||t>=X.CHUNK_DEPTH)return;const o=r+e*X.CHUNK_WIDTH+t*X.CHUNK_WIDTH*X.CHUNK_HEIGHT,i=this.blocks[o];i!==R.NONE&&(this.aliveBlocks--,_e(i)?this.waterBlocks--:mt(i)?this.transparentBlocks--:this.opaqueBlocks--,Jn(i)&&this.lightBlocks--),this.blocks[o]=n,n!==R.NONE&&(this.aliveBlocks++,_e(n)?this.waterBlocks++:mt(n)?this.transparentBlocks++:this.opaqueBlocks++,Jn(n)&&this.lightBlocks++)}getBlock(r,e,t){if(r<0||r>=X.CHUNK_WIDTH||e<0||e>=X.CHUNK_HEIGHT||t<0||t>=X.CHUNK_DEPTH)return R.NONE;const n=r+e*X.CHUNK_WIDTH+t*X.CHUNK_WIDTH*X.CHUNK_HEIGHT;return this.blocks[n]}getBlockIndex(r,e,t){return r<0||r>=X.CHUNK_WIDTH||e<0||e>=X.CHUNK_HEIGHT||t<0||t>=X.CHUNK_DEPTH?-1:r+e*X.CHUNK_WIDTH+t*X.CHUNK_WIDTH*X.CHUNK_HEIGHT}_generateAdditionalBlocks(r,e,t,n,o,i,a){const l=this.getBlock(r,e,t),c=this.getBlock(r-1,e,t),d=this.getBlock(r+1,e,t),f=this.getBlock(r,e,t+1),p=this.getBlock(r,e,t-1),h=this.getBlock(r,e+1,t);if(l==R.SAND)if(o>0&&Ee.global.randomUint32()%512==0){const _=Ee.global.randomUint32()%5;for(let m=0;m<_;m++)this.setBlock(r,e+m,t,R.CACTUS)}else Ee.global.randomUint32()%128==0&&this.setBlock(r,e+1,t,R.DEAD_BUSH);else if(l==R.SNOW||l==R.GRASS_SNOW){if(Ee.global.randomUint32()%16==0&&o>12&&(h==R.NONE||_e(h))&&(c==R.NONE||p==R.NONE))this.setBlock(r,e+1,t,R.DEAD_BUSH);else if(Ee.global.randomUint32()%16==0&&o>12&&o<300&&e<X.CHUNK_HEIGHT-5&&r>2&&t>2&&r<X.CHUNK_WIDTH-2&&t<X.CHUNK_DEPTH-2&&h==R.NONE&&d==R.NONE&&f==R.NONE&&p==R.NONE){const m=Math.max(Ee.global.randomUint32()%5,5);for(let b=0;b<m;b++)this.setBlock(r,e+b,t,R.TRUNK);for(let b=-2;b<=2;b++){const v=b<-1||b>1?0:-1,y=b<-1||b>1?0:1;for(let w=-1+v;w<=1+y;w++){const S=Math.abs(w-r);for(let x=-1+v;x<=1+y;x++){const k=Math.abs(x-t),C=w*w+b*b+x*x,E=this.getBlock(r+w,e+m+b,t+x);C+2<Ee.global.randomUint32()%24&&S!=2-v&&S!=2+y&&k!=2-v&&k!=2+y&&(E==R.NONE||E==R.SNOWYLEAVES)&&this.setBlock(r+w,e+m+b,t+x,R.SNOWYLEAVES)}}}}}else if(l==R.GRASS||l==R.DIRT)if(Ee.global.randomUint32()%2==0&&o>5&&o<300&&e<X.CHUNK_HEIGHT-5&&r>2&&t>2&&r<X.CHUNK_WIDTH-2&&t<X.CHUNK_DEPTH-2&&h==R.NONE&&d==R.NONE&&f==R.NONE&&p==R.NONE){const m=Math.max(Ee.global.randomUint32()%5,5);for(let b=0;b<m;b++)this.setBlock(r,e+b,t,R.TRUNK);for(let b=-2;b<=2;b++){const v=b<-1||b>1?0:-1,y=b<-1||b>1?0:1;for(let w=-1+v;w<=1+y;w++){const S=Math.abs(w-r);for(let x=-1+v;x<=1+y;x++){const k=Math.abs(x-t),C=w*w+b*b+x*x,E=this.getBlock(r+w,e+m+b,t+x);C+2<Ee.global.randomUint32()%24&&S!=2-v&&S!=2+y&&k!=2-v&&k!=2+y&&(E==R.NONE||E==R.TREELEAVES)&&this.setBlock(r+w,e+m+b,t+x,R.TREELEAVES)}}}}else o>5&&h==R.NONE&&(c==R.NONE||p==R.NONE)&&(Ee.global.randomUint32()%8==0?this.setBlock(r,e+1,t,R.GRASS_PROP):Ee.global.randomUint32()%8==0&&this.setBlock(r,e+1,t,R.FLOWER))}_generateBlockBasedOnBiome(r,e,t,n,o,i,a){const l=t>0&&r!==e&&Ks(n,i)<t?e:r,c=Math.floor(a)-o,d=a<X.SEA_LEVEL+1;switch(l){case Be.GrassyPlains:return c===0?d?R.DIRT:R.GRASS:c<=3?R.DIRT:R.STONE;case Be.Desert:return c<=3?R.SAND:R.STONE;case Be.SnowyPlains:return c===0?R.GRASS_SNOW:c<=2?R.SNOW:R.STONE;case Be.SnowyMountains:{const f=Math.abs(Kn(n/256,o/256,i/256,2,.6,1))*35;return c===0?R.GRASS_SNOW:c<=4||f>20?R.SNOW:R.STONE}case Be.RockyMountains:return c===0&&Math.abs(Kn(n/64,o/64,i/64,2,.6,1))<.12?R.SNOW:R.STONE;default:return R.GRASS}}static _determineBiomeFromNoise(r){return r>.35?Be.Desert:r>-.15?Be.GrassyPlains:r>-.3?Be.SnowyPlains:r>-.5?Be.SnowyMountains:Be.RockyMountains}static _determineBiome(r,e,t,n){const o=Ce(r/512,-5,t/512,0,0,0,n+31337);return X._determineBiomeFromNoise(o)}static _isCave(r,e,t,n,o){if(o<3)return!1;if(Ce(r/60,e/60,t/60,0,0,0,n+777)>.6)return!0;const a=Ce(r/24,e/24,t/24,0,0,0,n+13579),l=Ce(r/24,e/14,t/24,0,0,0,n+24680);if(Math.abs(a)<.12&&Math.abs(l)<.12)return!0;const c=Ce(r/28,e/18,t/28,0,0,0,n+55555),d=Ce(r/28,e/28,t/28,0,0,0,n+99999);return Math.abs(c)<.1&&Math.abs(d)<.1}};s(X,"CHUNK_WIDTH",16),s(X,"CHUNK_HEIGHT",16),s(X,"CHUNK_DEPTH",16),s(X,"SEA_LEVEL",15),s(X,"CUBE_VERTS",new Float32Array([-.5,-.5,-.5,.5,.5,-.5,.5,-.5,-.5,.5,.5,-.5,-.5,-.5,-.5,-.5,.5,-.5,-.5,-.5,.5,.5,-.5,.5,.5,.5,.5,.5,.5,.5,-.5,.5,.5,-.5,-.5,.5,-.5,.5,.5,-.5,.5,-.5,-.5,-.5,-.5,-.5,-.5,-.5,-.5,-.5,.5,-.5,.5,.5,.5,.5,.5,.5,-.5,-.5,.5,.5,-.5,.5,-.5,-.5,.5,.5,.5,.5,-.5,.5,-.5,-.5,-.5,.5,-.5,-.5,.5,-.5,.5,.5,-.5,.5,-.5,-.5,.5,-.5,-.5,-.5,-.5,.5,-.5,.5,.5,.5,.5,.5,-.5,.5,.5,.5,-.5,.5,-.5,-.5,.5,.5]));let ne=X;const vi=128;function Js(u,r,e){const t=Ce(u/2048,10,r/2048,0,0,0,e),n=Math.abs(Ce(u/1024,0,r/1024,0,0,0,e)*450)*Math.max(.1,(t+1)*.5),o=ci(u/256,15,r/256,2,.6,1.2,6)*12;return Math.abs(Ce(u/256,0,r/256,0,0,0,e)*n)+o}function Co(u,r,e,t){const n=e|0,o=t|0,i=e-n,a=t-o,l=u[n+o*r],c=u[n+1+o*r],d=u[n+(o+1)*r],f=u[n+1+(o+1)*r];return[(c-l)*(1-a)+(f-d)*a,(d-l)*(1-i)+(f-c)*i,l*(1-i)*(1-a)+c*i*(1-a)+d*(1-i)*a+f*i*a]}function Lo(u){return Math.imul(u,1664525)+1013904223>>>0}function Qs(u,r,e){const t=r*r>>2,n=.05,o=4,i=.01,a=.4,l=.3,c=.01,d=4,f=20,p=2,h=p*2+1,_=new Float32Array(h*h);let m=0;for(let y=-p;y<=p;y++)for(let w=-p;w<=p;w++){const S=Math.sqrt(w*w+y*y);if(S<p){const x=1-S/p;_[w+p+(y+p)*h]=x,m+=x}}for(let y=0;y<_.length;y++)_[y]/=m;const b=r-2;let v=(e^3735928559)>>>0;for(let y=0;y<t;y++){v=Lo(v);let w=v/4294967295*b;v=Lo(v);let S=v/4294967295*b,x=0,k=0,C=1,E=1,I=0;for(let U=0;U<f;U++){const g=w|0,A=S|0;if(g<0||g>=b||A<0||A>=b)break;const P=w-g,T=S-A,[B,N,G]=Co(u,r,w,S);x=x*n-B*(1-n),k=k*n-N*(1-n);const q=Math.sqrt(x*x+k*k);if(q<1e-6)break;x/=q,k/=q;const O=w+x,L=S+k;if(O<0||O>=b||L<0||L>=b)break;const[,,F]=Co(u,r,O,L),z=F-G,ae=Math.max(-z*C*E*o,i);if(I>ae||z>0){const oe=z>0?Math.min(z,I):(I-ae)*l;I-=oe,u[g+A*r]+=oe*(1-P)*(1-T),u[g+1+A*r]+=oe*P*(1-T),u[g+(A+1)*r]+=oe*(1-P)*T,u[g+1+(A+1)*r]+=oe*P*T}else{const oe=Math.min((ae-I)*a,-z);for(let ie=-p;ie<=p;ie++)for(let K=-p;K<=p;K++){const ee=g+K,D=A+ie;ee<0||ee>=r||D<0||D>=r||(u[ee+D*r]-=_[K+p+(ie+p)*h]*oe)}I+=oe}C=Math.sqrt(Math.max(C*C+z*d,0)),E*=1-c,w=O,S=L}}}function el(u,r,e){const t=vi,n=u*t,o=r*t,i=new Float32Array(t*t);for(let f=0;f<t;f++)for(let p=0;p<t;p++)i[p+f*t]=Js(n+p,o+f,e);const a=new Float32Array(i),l=(e^(Math.imul(u,73856093)^Math.imul(r,19349663)))>>>0;Qs(a,t,l);const c=12,d=new Float32Array(t*t);for(let f=0;f<t;f++)for(let p=0;p<t;p++){const h=p+f*t,_=Math.min(p,t-1-p,f,t-1-f),m=Math.min(_/c,1);d[h]=(a[h]-i[h])*m}return d}const Y=class Y{constructor(r){s(this,"seed");s(this,"renderDistanceH",8);s(this,"renderDistanceV",4);s(this,"chunksPerFrame",2);s(this,"time",0);s(this,"waterSimulationRadius",32);s(this,"waterTickInterval",.25);s(this,"_waterTickTimer",0);s(this,"_dirtyChunks",null);s(this,"onChunkAdded");s(this,"onChunkUpdated");s(this,"onChunkRemoved");s(this,"_chunks",new Map);s(this,"_generated",new Set);s(this,"_erosionCache",new Map);s(this,"pendingChunks",0);s(this,"_neighborScratch",{negX:void 0,posX:void 0,negY:void 0,posY:void 0,negZ:void 0,posZ:void 0});s(this,"_scratchTopD2",null);s(this,"_scratchTopXYZ",null);s(this,"_scratchToDelete",[]);s(this,"_scratchWaterBlocks",[]);s(this,"_scratchDirtyChunks",new Set);this.seed=r}get chunkCount(){return this._chunks.size}get chunks(){return this._chunks.values()}getBiomeAt(r,e,t){return ne._determineBiome(r,e,t,this.seed)}static normalizeChunkPosition(r,e,t){return[Math.floor(r/ne.CHUNK_WIDTH),Math.floor(e/ne.CHUNK_HEIGHT),Math.floor(t/ne.CHUNK_DEPTH)]}static _cx(r){return Math.floor(r/ne.CHUNK_WIDTH)}static _cy(r){return Math.floor(r/ne.CHUNK_HEIGHT)}static _cz(r){return Math.floor(r/ne.CHUNK_DEPTH)}static _key(r,e,t){return(r+32768)*4294967296+(e+32768)*65536+(t+32768)}getChunk(r,e,t){return this._chunks.get(Y._key(Y._cx(r),Y._cy(e),Y._cz(t)))}chunkExists(r,e,t){return this.getChunk(r,e,t)!==void 0}getBlockType(r,e,t){const n=this.getChunk(r,e,t);if(!n)return R.NONE;const o=Math.round(r)-n.globalPosition.x,i=Math.round(e)-n.globalPosition.y,a=Math.round(t)-n.globalPosition.z;return n.getBlock(o,i,a)}setBlockType(r,e,t,n){let o=this.getChunk(r,e,t);if(!o){const c=Y._cx(r),d=Y._cy(e),f=Y._cz(t);o=new ne(c*ne.CHUNK_WIDTH,d*ne.CHUNK_HEIGHT,f*ne.CHUNK_DEPTH),this._insertChunk(o)}const i=Math.round(r)-o.globalPosition.x,a=Math.round(e)-o.globalPosition.y,l=Math.round(t)-o.globalPosition.z;return o.setBlock(i,a,l,n),this._updateChunk(o,i,a,l),!0}getTopBlockY(r,e,t){const n=ne.CHUNK_HEIGHT,o=Math.floor(r),i=Math.floor(e);for(let a=Math.floor(t/n);a>=0;a--){const l=this.getChunk(o,a*n,i);if(!l)continue;const c=o-l.globalPosition.x,d=i-l.globalPosition.z;for(let f=n-1;f>=0;f--){const p=l.getBlock(c,f,d);if(p!==R.NONE&&!Ae(p))return l.globalPosition.y+f+1}}return 0}getBlockByRay(r,e,t){const n=Number.MAX_VALUE;let o=Math.floor(r.x),i=Math.floor(r.y),a=Math.floor(r.z);const l=1/e.x,c=1/e.y,d=1/e.z,f=e.x>0?1:-1,p=e.y>0?1:-1,h=e.z>0?1:-1,_=Math.min(l*f,n),m=Math.min(c*p,n),b=Math.min(d*h,n);let v=Math.abs((o+Math.max(f,0)-r.x)*l),y=Math.abs((i+Math.max(p,0)-r.y)*c),w=Math.abs((a+Math.max(h,0)-r.z)*d),S=0,x=0,k=0;for(let C=0;C<t;C++){if(C>0){const E=this.getChunk(o,i,a);if(E){const I=o-E.globalPosition.x,U=i-E.globalPosition.y,g=a-E.globalPosition.z,A=E.getBlock(I,U,g);if(A!==R.NONE&&!_e(A))return{blockType:A,position:new j(o,i,a),face:new j(-S*f,-x*p,-k*h),chunk:E,relativePosition:new j(I,U,g)}}}S=(v<=w?1:0)*(v<=y?1:0),x=(y<=v?1:0)*(y<=w?1:0),k=(w<=y?1:0)*(w<=v?1:0),v+=_*S,y+=m*x,w+=b*k,o+=f*S,i+=p*x,a+=h*k}return null}addBlock(r,e,t,n,o,i,a){if(a===R.NONE||!this.getChunk(r,e,t))return!1;const c=this.getBlockType(r,e,t);if(Ae(c))return!1;const d=r+n,f=e+o,p=t+i,h=this.getBlockType(d,f,p);if(_e(a)){if(h!==R.NONE&&!_e(h))return!1}else if(h!==R.NONE&&!_e(h))return!1;let _=this.getChunk(d,f,p);if(!_){const y=Y._cx(d),w=Y._cy(f),S=Y._cz(p);_=new ne(y*ne.CHUNK_WIDTH,w*ne.CHUNK_HEIGHT,S*ne.CHUNK_DEPTH),this._insertChunk(_)}const m=d-_.globalPosition.x,b=f-_.globalPosition.y,v=p-_.globalPosition.z;return _.setBlock(m,b,v,a),this._updateChunk(_,m,b,v),!0}mineBlock(r,e,t){const n=this.getChunk(r,e,t);if(!n)return!1;const o=r-n.globalPosition.x,i=e-n.globalPosition.y,a=t-n.globalPosition.z,l=n.getBlock(o,i,a);return l===R.NONE?!1:_e(l)?(n.setBlock(o,i,a,R.NONE),this._updateChunk(n,o,i,a),!0):(n.setBlock(o,i,a,R.NONE),this._updateChunk(n,o,i,a),!0)}update(r,e){this.time+=e,this._removeDistantChunks(r),this._createNearbyChunks(r),this._waterTickTimer+=e,this._waterTickTimer>=this.waterTickInterval&&(this._waterTickTimer=0,this._updateWaterFlow(r))}deleteChunk(r){var i;const e=Y._cx(r.globalPosition.x),t=Y._cy(r.globalPosition.y),n=Y._cz(r.globalPosition.z),o=Y._key(e,t,n);this._chunks.delete(o),this._generated.delete(o),r.isDeleted=!0,(i=this.onChunkRemoved)==null||i.call(this,r)}calcWaterLevel(r,e,t){const n=this.getChunk(r,e,t);if(!n||n.waterBlocks<=0)return 0;let o=this._calcWaterLevelInChunk(n,e);for(let i=1;i<=4;i++){const a=this.getChunk(r,e+i*ne.CHUNK_HEIGHT,t);if(!a)break;const l=Y._cx(r),c=Y._cz(t),d=l*ne.CHUNK_WIDTH-a.globalPosition.x,f=c*ne.CHUNK_DEPTH-a.globalPosition.z;if(a.waterBlocks>0&&_e(a.getBlock(d,0,f)))o+=this._calcWaterLevelInChunk(a,e);else break}return o}_calcWaterLevelInChunk(r,e){const t=r.globalPosition.y,n=ne.CHUNK_HEIGHT;let o=0;return e<=t+n*.8&&o++,e<=t+n*.7&&o++,e<=t+n*.6&&o++,e<=t+n*.5&&o++,o}_getErosionRegion(r,e){const t=`${r},${e}`;let n=this._erosionCache.get(t);return n||(n=el(r,e,this.seed),this._erosionCache.set(t,n)),n}getErosionDisplacement(r,e){const t=vi,n=Math.floor(r/t),o=Math.floor(e/t),i=(r%t+t)%t,a=(e%t+t)%t;return this._getErosionRegion(n,o)[i+a*t]}_insertChunk(r){const e=Y._cx(r.globalPosition.x),t=Y._cy(r.globalPosition.y),n=Y._cz(r.globalPosition.z);this._chunks.set(Y._key(e,t,n),r),r.isDeleted=!1}_gatherNeighbors(r,e,t){var o,i,a,l,c,d;const n=this._neighborScratch;return n.negX=(o=this._chunks.get(Y._key(r-1,e,t)))==null?void 0:o.blocks,n.posX=(i=this._chunks.get(Y._key(r+1,e,t)))==null?void 0:i.blocks,n.negY=(a=this._chunks.get(Y._key(r,e-1,t)))==null?void 0:a.blocks,n.posY=(l=this._chunks.get(Y._key(r,e+1,t)))==null?void 0:l.blocks,n.negZ=(c=this._chunks.get(Y._key(r,e,t-1)))==null?void 0:c.blocks,n.posZ=(d=this._chunks.get(Y._key(r,e,t+1)))==null?void 0:d.blocks,n}_remeshSingleNeighbor(r,e,t){var o;const n=this._chunks.get(Y._key(r,e,t));n&&((o=this.onChunkUpdated)==null||o.call(this,n,n.generateVertices(this._gatherNeighbors(r,e,t))))}_updateChunk(r,e,t,n){var f;const o=Y._cx(r.globalPosition.x),i=Y._cy(r.globalPosition.y),a=Y._cz(r.globalPosition.z);if(this._dirtyChunks){if(this._dirtyChunks.add(r),e===void 0)return;const p=ne.CHUNK_WIDTH,h=ne.CHUNK_HEIGHT,_=ne.CHUNK_DEPTH,m=(b,v,y)=>{const w=this._chunks.get(Y._key(b,v,y));w&&this._dirtyChunks.add(w)};e===0&&m(o-1,i,a),e===p-1&&m(o+1,i,a),t===0&&m(o,i-1,a),t===h-1&&m(o,i+1,a),n===0&&m(o,i,a-1),n===_-1&&m(o,i,a+1);return}if((f=this.onChunkUpdated)==null||f.call(this,r,r.generateVertices(this._gatherNeighbors(o,i,a))),e===void 0)return;const l=ne.CHUNK_WIDTH,c=ne.CHUNK_HEIGHT,d=ne.CHUNK_DEPTH;e===0&&this._remeshSingleNeighbor(o-1,i,a),e===l-1&&this._remeshSingleNeighbor(o+1,i,a),t===0&&this._remeshSingleNeighbor(o,i-1,a),t===c-1&&this._remeshSingleNeighbor(o,i+1,a),n===0&&this._remeshSingleNeighbor(o,i,a-1),n===d-1&&this._remeshSingleNeighbor(o,i,a+1)}_createNearbyChunks(r){const e=Y._cx(r.x),t=Y._cy(r.y),n=Y._cz(r.z),o=this.renderDistanceH,i=this.renderDistanceV,a=o*o,l=Math.max(1,this.chunksPerFrame);(!this._scratchTopD2||this._scratchTopD2.length!==l)&&(this._scratchTopD2=new Float64Array(l),this._scratchTopXYZ=new Int32Array(l*3));for(let p=0;p<l;p++)this._scratchTopD2[p]=1/0;let c=0,d=0,f=1/0;for(let p=-o;p<=o;p++){const h=p*p;for(let _=-o;_<=o;_++){const m=h+_*_;if(!(m>a))for(let b=-i;b<=i;b++){const v=e+p,y=t+b,w=n+_;if(this._generated.has(Y._key(v,y,w)))continue;c++;const S=m+b*b;if(!(S>=f)){this._scratchTopD2[d]=S,this._scratchTopXYZ[d*3]=v,this._scratchTopXYZ[d*3+1]=y,this._scratchTopXYZ[d*3+2]=w,f=-1/0;for(let x=0;x<l;x++){const k=this._scratchTopD2[x];k>f&&(f=k,d=x)}}}}}if(this.pendingChunks=c,!(this._chunks.size>=Y.MAX_CHUNKS))for(let p=0;p<l;p++){let h=-1,_=1/0;for(let y=0;y<l;y++){const w=this._scratchTopD2[y];w<_&&(_=w,h=y)}if(h<0||_===1/0||this._chunks.size>=Y.MAX_CHUNKS)break;const m=this._scratchTopXYZ[h*3],b=this._scratchTopXYZ[h*3+1],v=this._scratchTopXYZ[h*3+2];this._scratchTopD2[h]=1/0,this._createChunkAt(m,b,v)}}_removeDistantChunks(r){const e=Y._cx(r.x),t=Y._cy(r.y),n=Y._cz(r.z),o=this.renderDistanceH+1,i=this.renderDistanceV+1,a=this._scratchToDelete;a.length=0;for(const l of this._chunks.values()){const c=Y._cx(l.globalPosition.x),d=Y._cy(l.globalPosition.y),f=Y._cz(l.globalPosition.z),p=c-e,h=d-t,_=f-n;(p*p+_*_>o*o||Math.abs(h)>i)&&a.push(l)}for(let l=0;l<a.length;l++)this.deleteChunk(a[l]);a.length=0}_createChunkAt(r,e,t){var i;const n=Y._key(r,e,t);this._generated.add(n);const o=new ne(r*ne.CHUNK_WIDTH,e*ne.CHUNK_HEIGHT,t*ne.CHUNK_DEPTH);o.generateBlocks(this.seed,(a,l)=>this.getErosionDisplacement(a,l)),o.aliveBlocks>0&&(this._insertChunk(o),(i=this.onChunkAdded)==null||i.call(this,o,o.generateVertices(this._gatherNeighbors(r,e,t))),this._remeshSingleNeighbor(r-1,e,t),this._remeshSingleNeighbor(r+1,e,t),this._remeshSingleNeighbor(r,e-1,t),this._remeshSingleNeighbor(r,e+1,t),this._remeshSingleNeighbor(r,e,t-1),this._remeshSingleNeighbor(r,e,t+1))}_updateWaterFlow(r){var S;const e=this.waterSimulationRadius,t=Math.floor(r.x-e),n=Math.floor(r.x+e),o=Math.floor(Math.max(0,r.y-e)),i=Math.floor(r.y+e),a=Math.floor(r.z-e),l=Math.floor(r.z+e),c=ne.CHUNK_WIDTH,d=ne.CHUNK_HEIGHT,f=ne.CHUNK_DEPTH,p=Math.floor(t/c),h=Math.floor(n/c),_=Math.floor(o/d),m=Math.floor(i/d),b=Math.floor(a/f),v=Math.floor(l/f),y=this._scratchWaterBlocks;y.length=0;for(let x=p;x<=h;x++)for(let k=_;k<=m;k++)for(let C=b;C<=v;C++){const E=this._chunks.get(Y._key(x,k,C));if(!E||E.waterBlocks===0)continue;const I=E.globalPosition.x,U=E.globalPosition.y,g=E.globalPosition.z,A=Math.max(0,t-I),P=Math.min(c-1,n-I),T=Math.max(0,o-U),B=Math.min(d-1,i-U),N=Math.max(0,a-g),G=Math.min(f-1,l-g);for(let q=N;q<=G;q++)for(let O=T;O<=B;O++)for(let L=A;L<=P;L++)_e(E.getBlock(L,O,q))&&y.push(I+L,U+O,g+q)}const w=this._scratchDirtyChunks;w.clear(),this._dirtyChunks=w;try{for(let x=0;x<y.length;x+=3)this._flowWater(y[x],y[x+1],y[x+2])}finally{this._dirtyChunks=null}for(const x of w){const k=Y._cx(x.globalPosition.x),C=Y._cy(x.globalPosition.y),E=Y._cz(x.globalPosition.z);(S=this.onChunkUpdated)==null||S.call(this,x,x.generateVertices(this._gatherNeighbors(k,C,E)))}w.clear(),y.length=0}_flowWater(r,e,t){const n=this.getBlockType(r,e-1,t);if(n===R.NONE||Ae(n)){this.setBlockType(r,e-1,t,R.WATER),this.setBlockType(r,e,t,R.NONE);return}let o=!1;for(let i=1;i<=4;i++){const a=this.getBlockType(r,e-i,t);if(a!==R.NONE&&!_e(a)&&!Ae(a)){o=!0;break}if(a===R.NONE||Ae(a))break}if(!o){const i=[{x:r+1,y:e,z:t},{x:r-1,y:e,z:t},{x:r,y:e,z:t+1},{x:r,y:e,z:t-1}];for(const a of i){const l=this.getBlockType(a.x,a.y,a.z);if(l===R.NONE||Ae(l)){this.setBlockType(a.x,a.y,a.z,R.WATER),this.setBlockType(r,e,t,R.NONE);return}}}if(o){const i=[{x:r+1,y:e,z:t},{x:r-1,y:e,z:t},{x:r,y:e,z:t+1},{x:r,y:e,z:t-1}];for(const a of i){const l=this.getBlockType(a.x,a.y,a.z);if(l===R.NONE||Ae(l)){this.setBlockType(a.x,a.y,a.z,R.WATER);return}}}}};s(Y,"MAX_CHUNKS",2048);let zr=Y;function ar(u,r,e,t,n,o,i,a){const l=[{n:[0,0,-1],t:[-1,0,0,1],v:[[-o,-i,-a],[o,-i,-a],[o,i,-a],[-o,i,-a]]},{n:[0,0,1],t:[1,0,0,1],v:[[o,-i,a],[-o,-i,a],[-o,i,a],[o,i,a]]},{n:[-1,0,0],t:[0,0,-1,1],v:[[-o,-i,a],[-o,-i,-a],[-o,i,-a],[-o,i,a]]},{n:[1,0,0],t:[0,0,1,1],v:[[o,-i,-a],[o,-i,a],[o,i,a],[o,i,-a]]},{n:[0,1,0],t:[1,0,0,1],v:[[-o,i,-a],[o,i,-a],[o,i,a],[-o,i,a]]},{n:[0,-1,0],t:[1,0,0,1],v:[[-o,-i,a],[o,-i,a],[o,-i,-a],[-o,-i,-a]]}],c=[[0,1],[1,1],[1,0],[0,0]];for(const d of l){const f=u.length/12;for(let p=0;p<4;p++){const[h,_,m]=d.v[p];u.push(e+h,t+_,n+m,d.n[0],d.n[1],d.n[2],c[p][0],c[p][1],d.t[0],d.t[1],d.t[2],d.t[3])}r.push(f,f+2,f+1,f,f+3,f+2)}}function Ro(u,r=1){const e=[],t=[],n=r;return ar(e,t,0,0,0,.19*n,.11*n,.225*n),ar(e,t,0,.07*n,.225*n,.075*n,.06*n,.06*n),Le.fromData(u,new Float32Array(e),new Uint32Array(t))}function No(u,r=1){const e=[],t=[],n=r;return ar(e,t,0,0,0,.085*n,.085*n,.075*n),Le.fromData(u,new Float32Array(e),new Uint32Array(t))}function Io(u,r=1){const e=[],t=[],n=r;return ar(e,t,0,0,0,.065*n,.03*n,.055*n),Le.fromData(u,new Float32Array(e),new Uint32Array(t))}function nt(u,r,e,t,n,o,i,a){const l=[{n:[0,0,-1],t:[-1,0,0,1],v:[[-o,-i,-a],[o,-i,-a],[o,i,-a],[-o,i,-a]]},{n:[0,0,1],t:[1,0,0,1],v:[[o,-i,a],[-o,-i,a],[-o,i,a],[o,i,a]]},{n:[-1,0,0],t:[0,0,-1,1],v:[[-o,-i,a],[-o,-i,-a],[-o,i,-a],[-o,i,a]]},{n:[1,0,0],t:[0,0,1,1],v:[[o,-i,-a],[o,-i,a],[o,i,a],[o,i,-a]]},{n:[0,1,0],t:[1,0,0,1],v:[[-o,i,-a],[o,i,-a],[o,i,a],[-o,i,a]]},{n:[0,-1,0],t:[1,0,0,1],v:[[-o,-i,a],[o,-i,a],[o,-i,-a],[-o,-i,-a]]}],c=[[0,1],[1,1],[1,0],[0,0]];for(const d of l){const f=u.length/12;for(let p=0;p<4;p++){const[h,_,m]=d.v[p];u.push(e+h,t+_,n+m,d.n[0],d.n[1],d.n[2],c[p][0],c[p][1],d.t[0],d.t[1],d.t[2],d.t[3])}r.push(f,f+2,f+1,f,f+3,f+2)}}function Oo(u,r=1){const e=[],t=[],n=r;nt(e,t,0,0,0,.22*n,.15*n,.32*n),nt(e,t,0,.07*n,.32*n,.035*n,.035*n,.035*n);const o=.155*n,i=-.25*n,a=.255*n,l=.065*n,c=.1*n,d=.065*n;return nt(e,t,-o,i,-a,l,c,d),nt(e,t,o,i,-a,l,c,d),nt(e,t,-o,i,a,l,c,d),nt(e,t,o,i,a,l,c,d),Le.fromData(u,new Float32Array(e),new Uint32Array(t))}function Do(u,r=1){const e=[],t=[],n=r;return nt(e,t,0,0,0,.18*n,.16*n,.16*n),Le.fromData(u,new Float32Array(e),new Uint32Array(t))}function Vo(u,r=1){const e=[],t=[],n=r;return nt(e,t,0,0,0,.1*n,.08*n,.06*n),Le.fromData(u,new Float32Array(e),new Uint32Array(t))}const tl=new j(0,1,0),cr=class cr extends it{constructor(e){super();s(this,"_world");s(this,"_state","idle");s(this,"_timer",0);s(this,"_targetX",0);s(this,"_targetZ",0);s(this,"_hasTarget",!1);s(this,"_velY",0);s(this,"_yaw",0);s(this,"_headGO",null);s(this,"_headBaseY",0);s(this,"_bobPhase");this._world=e,this._timer=1+Math.random()*4,this._yaw=Math.random()*Math.PI*2,this._bobPhase=Math.random()*Math.PI*2}onAttach(){for(const e of this.gameObject.children)if(e.name==="Duck.Head"){this._headGO=e,this._headBaseY=e.position.y;break}}update(e){const t=this.gameObject,n=t.position.x,o=t.position.z,i=cr.playerPos,a=i.x-n,l=i.z-o,c=a*a+l*l;this._velY-=9.8*e,t.position.y+=this._velY*e;const d=this._world.getTopBlockY(Math.floor(n),Math.floor(o),Math.ceil(t.position.y)+4);if(d>0&&t.position.y<=d+.1){const f=this._world.getBlockType(Math.floor(n),Math.floor(d-1),Math.floor(o));R.WATER,t.position.y=d,this._velY=0}switch(this._state){case"idle":{this._timer-=e,c<36?this._enterFlee():this._timer<=0&&this._pickWanderTarget();break}case"wander":{if(this._timer-=e,c<36){this._enterFlee();break}if(!this._hasTarget||this._timer<=0){this._enterIdle();break}const f=this._targetX-n,p=this._targetZ-o,h=f*f+p*p;if(h<.25){this._enterIdle();break}const _=Math.sqrt(h),m=f/_,b=p/_;t.position.x+=m*1.5*e,t.position.z+=b*1.5*e,this._yaw=Math.atan2(-m,-b);break}case"flee":{if(c>196){this._enterIdle();break}const f=Math.sqrt(c),p=f>0?-a/f:0,h=f>0?-l/f:0;t.position.x+=p*4*e,t.position.z+=h*4*e,this._yaw=Math.atan2(-p,-h);break}}if(t.rotation=me.fromAxisAngle(tl,this._yaw),this._headGO){this._bobPhase+=e*(this._state==="wander"?6:2);const f=this._state==="wander"?.018:.008;this._headGO.position.y=this._headBaseY+Math.sin(this._bobPhase)*f}}_enterIdle(){this._state="idle",this._hasTarget=!1,this._timer=2+Math.random()*5}_enterFlee(){this._state="flee",this._hasTarget=!1}_pickWanderTarget(){const e=this.gameObject,t=Math.random()*Math.PI*2,n=3+Math.random()*8;this._targetX=e.position.x+Math.cos(t)*n,this._targetZ=e.position.z+Math.sin(t)*n,this._hasTarget=!0,this._state="wander",this._timer=6+Math.random()*6}};s(cr,"playerPos",new j(0,0,0));let wt=cr;const zo=""+new URL("hotbar-DkVq2FsR.png",import.meta.url).href,Zt=[R.DIRT,R.IRON,R.STONE,R.SAND,R.TRUNK,R.SPRUCE_PLANKS,R.GLASS,R.TORCH,R.WATER];function rl(u){const r=Zt.length;let e=0;const t=document.createElement("div");t.style.cssText=["position:fixed","bottom:12px","left:50%","transform:translateX(-50%)","display:flex","flex-direction:row","flex-wrap:nowrap","align-items:center","gap:0px","background:url("+zo+") no-repeat","background-position:-48px 0px","background-size:414px 48px","width:364px","height:44px","padding:1px 2px","image-rendering:pixelated","box-sizing:border-box","align-items:center","justify-content:flex-start"].join(";");const n=[];for(let d=0;d<r;d++){const f=document.createElement("div");f.style.cssText=["width:40px","height:40px","display:flex","align-items:center","justify-content:center","position:relative","flex-shrink:0"].join(";");const p=document.createElement("canvas");p.width=p.height=32,p.style.cssText="width:32px;height:32px;image-rendering:pixelated;",f.appendChild(p);const h=document.createElement("span");h.textContent=String(d+1),h.style.cssText=["position:absolute","top:1px","left:3px","font-family:ui-monospace,monospace","font-size:9px","color:#ccc","text-shadow:0 0 2px #000","pointer-events:none"].join(";"),f.appendChild(h),f.addEventListener("click",()=>{e=d,a()}),t.appendChild(f),n.push(p)}document.body.appendChild(t);const o=document.createElement("div");o.style.cssText=["position:fixed","bottom:12px","width:44px","height:48px","background:url("+zo+") no-repeat","background-position:0px 0px","background-size:414px 48px","pointer-events:none","image-rendering:pixelated","transition:left 60ms linear"].join(";"),document.body.appendChild(o);let i=null;function a(){const d=t.getBoundingClientRect();o.style.left=d.left-2+e*40+"px",i==null||i()}const l=new Image;l.src=u;function c(){if(!l.complete)return;const d=16;for(let f=0;f<r;f++){const p=ur.find(_=>_.blockType===Zt[f]),h=n[f].getContext("2d");h.clearRect(0,0,32,32),p&&(h.imageSmoothingEnabled=!1,h.drawImage(l,p.sideFace.x*d,p.sideFace.y*d,d,d,0,0,32,32))}}return l.onload=c,window.addEventListener("keydown",d=>{const f=parseInt(d.key);f>=1&&f<=r&&(e=f-1,a())}),window.addEventListener("wheel",d=>{e=(e+(d.deltaY>0?1:r-1))%r,a()},{passive:!0}),window.addEventListener("resize",a),requestAnimationFrame(a),{getSelected:()=>Zt[e],refresh:c,getSelectedSlot:()=>e,setSelectedSlot:d=>{e=d,a()},setOnSelectionChanged:d=>{i=d},slots:Zt,element:t}}const nl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAACWCAYAAADwkd5lAAAD7ElEQVR4nO3dUU7bahSF0eOqgyIwDU/EkmcBUibicQRm5ftyE7UoacvOb+LEa0l9obD7P/VTKdKpAgAA+C7dX35//pZXALBWFzvxp4DM86wfAFvWdV3VhVZcCoh4AFBVlyNyLiCneLy/vy/7KgBWbbfbVdX5iPy4wXsAeAACAkBEQACICAgAEQEBIPLzK588DMPVf2Df9zVNkx07duxsfqflVqud/X7/z5/7pR/jHYah+r6/5m01jmM9PT3ZsWPHzuZ3pmmqj4+Pent7W83O54D4MV4AmhMQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAANDMfHQ6H3369vr7OLdixY8eOnXW95bjz+e/9o6qaP8fiywelrrW261t27Nixc6udlltLXST800EpFwnt2LFj50Y7LhICsEkCAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgGZOF6hcJLRjx46d5XbW9JbjjouEduzYsXMHOy23XCS0Y8eOnQ3tuEgIwCYJCAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQAJo5XaBykdCOHTt2lttZ01uOOy4S2rFjx84d7LTccpHQjh07dja04yIhAJskIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAGjmdIHKRUI7duzYWW5nTW857rhIaMeOHTt3sNNyy0VCO3bs2NnQjouEAGySgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBAaCZ0wUqFwnt2LFjZ7mdNb3luOMioR07duzcwU7LLRcJ7dixY2dDOy4SArBJAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBIBmTheoXCS0Y8eOneV21vSW485iFwkB2BYHpQBoTkAAiAgIAJGft34AyxmG4eqNvu9rmiY7duKdl5eXq3dYJwF5cH3fX/X14zjWNE127MQ7fhjncfkWFgARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkDEPZAH1vd9jeNox85Nd3hc3ZmPzfM8V1U5BAOwcbvdrqqquq6r+tQM38ICICIgAEQEBIDIuf9E77qumw+HQ+33+29/EADr8vz8XHXm/8wv/Quk+/8LANiwS/G4+MFfzM1fA8A9+VsnAAAAvsF/uG+b8sfhThMAAAAASUVORK5CYII=";function ol(u,r,e,t,n,o){const b=[];for(let A=1;A<R.MAX;A++)A!==R.WATER&&b.push(A);const v=document.createElement("div");v.style.cssText="position:relative;display:inline-block;align-self:center;";const y=document.createElement("img");y.src=nl,y.draggable=!1,y.style.cssText=[`width:${400*2}px`,`height:${150*2}px`,"display:block","image-rendering:pixelated","user-select:none"].join(";"),v.appendChild(y);const w=new Image;w.src=r;function S(A,P){const T=A.getContext("2d");if(T.clearRect(0,0,A.width,A.height),!P)return;const B=ur.find(N=>N.blockType===P);B&&(T.imageSmoothingEnabled=!1,T.drawImage(w,B.sideFace.x*16,B.sideFace.y*16,16,16,0,0,A.width,A.height))}let x=null,k=null;const C=[];function E(){C.forEach((A,P)=>{A.style.outline=P===n()?"2px solid #ff0":""})}function I(A,P,T){const B=document.createElement("div");B.style.cssText=["position:absolute",`left:${A}px`,`top:${P}px`,"width:32px","height:32px","box-sizing:border-box","cursor:grab"].join(";"),B.draggable=T;const N=document.createElement("canvas");return N.width=N.height=32,N.style.cssText="width:32px;height:32px;image-rendering:pixelated;pointer-events:none;display:block;",B.appendChild(N),v.appendChild(B),[B,N]}for(let A=0;A<6;A++)for(let P=0;P<21;P++){const T=b[A*21+P]??null;if(!T)continue;const[B,N]=I(24+P*36,24+A*36,!0);B.title=String(ua[T]),w.complete?S(N,T):w.addEventListener("load",()=>S(N,T),{once:!1}),B.addEventListener("click",()=>{e[n()]=T,g(),t()}),B.addEventListener("dragstart",G=>{x=T,k=null,G.dataTransfer.effectAllowed="copy",B.style.opacity="0.4"}),B.addEventListener("dragend",()=>{B.style.opacity="1"})}const U=[];for(let A=0;A<9;A++){const[P,T]=I(240+A*36,248,!0);U.push(T),C.push(P),P.title=`Slot ${A+1}`,P.addEventListener("click",()=>{o(A),E()}),P.addEventListener("dragstart",B=>{x=e[A],k=A,B.dataTransfer.effectAllowed="move",P.style.opacity="0.4"}),P.addEventListener("dragend",()=>{P.style.opacity="1"}),P.addEventListener("dragover",B=>{B.preventDefault(),B.dataTransfer.dropEffect=k!==null?"move":"copy",P.style.boxShadow="inset 0 0 0 2px #7ff"}),P.addEventListener("dragleave",()=>{P.style.boxShadow=""}),P.addEventListener("drop",B=>{B.preventDefault(),P.style.boxShadow="",x&&(k!==null&&k!==A?[e[A],e[k]]=[e[k],e[A]]:k===null&&(e[A]=x),g(),t(),x=null,k=null)})}function g(){for(let A=0;A<9;A++)S(U[A],e[A])}return w.addEventListener("load",g),w.complete&&g(),u.appendChild(v),{syncHotbar:g,refreshSlotHighlight:E}}function il(u,r,e){const t=document.createElement("div");t.style.cssText=["display:flex","flex-wrap:wrap","gap:8px","justify-content:center","font-family:ui-monospace,monospace","font-size:13px","user-select:none"].join(";");const n="background:#1a2e1a;color:#5f5;border-color:#5f5",o="background:#2e1a1a;color:#f55;border-color:#f55";for(const i of Object.keys(u)){const a=document.createElement("button"),l=i.toUpperCase().padEnd(5),c=()=>{const d=u[i];a.textContent=`${l} ${d?"ON ":"OFF"}`,a.setAttribute("style",["padding:5px 10px","border-width:1px","border-style:solid","border-radius:4px","cursor:pointer","letter-spacing:0.04em",d?n:o].join(";"))};a.addEventListener("click",()=>{u[i]=!u[i],c(),r(i)}),c(),t.appendChild(a)}return e.appendChild(t),t}function al(u,r){const e=document.createElement("div");e.style.cssText=["position:fixed","inset:0","z-index:100","background:rgba(0,0,0,0.78)","display:none","align-items:center","justify-content:center","font-family:ui-monospace,monospace"].join(";"),document.body.appendChild(e);const t=document.createElement("div");t.style.cssText=["display:flex","flex-direction:column","align-items:center","padding:clamp(20px,5vh,48px) clamp(16px,5vw,56px)","background:rgba(255,255,255,0.74)","border:1px solid rgba(255,255,255,0.12)","border-radius:12px","width:min(860px,calc(100vw - 24px))","box-sizing:border-box","max-height:min(700px,calc(100vh - 24px))","overflow-y:auto","padding:0px;"].join(";"),e.appendChild(t);const n=document.createElement("h1");n.textContent="CRAFTY",n.style.cssText=["margin:0","font-size:clamp(28px,7vw,52px)","font-weight:900","color:#fff","letter-spacing:0.12em","text-shadow:0 0 48px rgba(100,200,255,0.45)","font-family:ui-monospace,monospace"].join(";"),t.appendChild(n);const o=document.createElement("button");o.textContent="Back to Game (ESC)",o.style.cssText=["padding:10px 40px","font-size:15px","font-family:ui-monospace,monospace","background:#1a3a1a","color:#5f5","border:1px solid #5f5","border-radius:6px","cursor:pointer","letter-spacing:0.06em","transition:background 0.15s","margin-top:12px"].join(";"),o.addEventListener("mouseenter",()=>{o.style.background="#243e24"}),o.addEventListener("mouseleave",()=>{o.style.background="#1a3a1a"});const i=()=>{c();try{u.requestPointerLock()}catch{}};o.addEventListener("click",i),o.addEventListener("touchend",f=>{f.preventDefault(),i()},{passive:!1}),t.appendChild(o);let a=0;function l(){a=performance.now(),e.style.display="flex",r.style.display="none"}function c(){e.style.display="none",r.style.display=""}function d(){return e.style.display!=="none"}return document.addEventListener("pointerlockchange",()=>{document.pointerLockElement===u?c():l()}),document.addEventListener("keydown",f=>{if(f.code==="Escape"&&d()){if(performance.now()-a<200)return;c(),u.requestPointerLock()}}),{overlay:e,card:t,open:l,close:c,isOpen:d}}function sl(){const u=document.createElement("div");u.style.cssText=["position:fixed","top:50%","left:50%","width:16px","height:16px","transform:translate(-50%,-50%)","pointer-events:none"].join(";"),u.innerHTML=['<div style="position:absolute;top:50%;left:0;width:100%;height:3px;background:#fff;opacity:0.8;transform:translateY(-50%)"></div>','<div style="position:absolute;left:50%;top:0;width:3px;height:100%;background:#fff;opacity:0.8;transform:translateX(-50%)"></div>','<div style="position:absolute;top:50%;left:50%;width:7px;height:3px;background:#fff;opacity:0.9;transform:translate(-50%,-50%);border-radius:50%"></div>'].join(""),document.body.appendChild(u);const r=()=>{const a=document.createElement("div");return a.style.display="none",document.body.appendChild(a),a},e=r();e.style.cssText=["position:fixed","top:12px","right:12px","font-family:ui-monospace,monospace","font-size:13px","color:#ff0","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none"].join(";");const t=r();t.style.cssText=["position:fixed","top:44px","right:12px","font-family:ui-monospace,monospace","font-size:11px","color:#aaf","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none","white-space:pre"].join(";");const n=r();n.style.cssText=["position:fixed","bottom:12px","right:12px","font-family:ui-monospace,monospace","font-size:13px","color:#ff0","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none"].join(";");const o=r();o.style.cssText=["position:fixed","bottom:44px","right:12px","font-family:ui-monospace,monospace","font-size:11px","color:#ccf","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none"].join(";");const i=r();return i.style.cssText=["position:fixed","top:76px","right:12px","font-family:ui-monospace,monospace","font-size:11px","color:#afc","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none","white-space:pre"].join(";"),{fps:e,stats:t,biome:n,pos:o,weather:i,reticle:u}}function ll(u,r,e,t,n,o,i,a){const l=new be("Camera");l.position.set(64,25,64);const c=l.addComponent(new ui(70,.1,1e3,t/n));r.add(l);const d=new be("Flashlight"),f=d.addComponent(new fi);f.color=new j(1,.95,.9),f.intensity=0,f.range=40,f.innerAngle=12,f.outerAngle=25,f.castShadow=!1,f.projectionTexture=o,l.addChild(d),r.add(d);let p=!1;const h=new xa(e,Math.PI,.1);h.attach(u);const _=new aa(Math.PI,.1,15);let m=!0;const b=document.createElement("div");b.textContent="PLAYER",b.style.cssText=["position:fixed","top:12px","left:12px","font-family:ui-monospace,monospace","font-size:13px","font-weight:bold","color:#4f4","background:rgba(0,0,0,0.45)","padding:4px 8px","border-radius:4px","pointer-events:none","letter-spacing:0.05em"].join(";"),document.body.appendChild(b);function v(x){i&&(i.style.display=x?"":"none"),a&&(a.style.display=x?"flex":"none")}function y(){m=!m,m?(h.yaw=_.yaw,h.pitch=_.pitch,_.detach(),h.attach(u)):(_.yaw=h.yaw,_.pitch=h.pitch,h.detach(),_.attach(u)),b.textContent=m?"PLAYER":"FREE",b.style.color=m?"#4f4":"#4cf",v(m)}function w(x){p=x,f.intensity=p?25:0}let S=-1/0;return document.addEventListener("keyup",x=>{x.code==="Space"&&(S=performance.now())}),document.addEventListener("keydown",x=>{if(x.code==="KeyC"&&!x.repeat){y();return}if(!(x.code!=="Space"||x.repeat)&&performance.now()-S<400&&document.pointerLockElement===u){const k=m;y(),S=-1/0,k&&_.pressKey("Space")}}),window.addEventListener("keydown",x=>{x.code==="KeyF"&&!x.repeat&&(w(!p),console.log(`Flashlight ${p?"ON":"OFF"} (intensity: ${f.intensity})`)),x.ctrlKey&&x.key==="w"&&(x.preventDefault(),window.location.reload())}),{cameraGO:l,camera:c,player:h,freeCamera:_,isPlayerMode:()=>m,flashlight:f,isFlashlightEnabled:()=>p,modeEl:b,toggleController:y,setFlashlightEnabled:w,setPlayerUIVisible:v}}const Ut=new Map,kt=new Map,dr=(u,r,e)=>`${u},${r},${e}`;function bi(u,r,e,t){const n=dr(u,r,e);if(Ut.has(n))return;const o=new be("TorchLight");o.position.set(u+.5,r+.9,e+.5);const i=o.addComponent(new Wr);i.color=new j(1,.52,.18),i.intensity=4,i.radius=6,i.castShadow=!1,t.add(o);const a=(u*127.1+r*311.7+e*74.3)%(Math.PI*2);Ut.set(n,{go:o,pl:i,phase:a})}function Fr(u,r,e,t){const n=dr(u,r,e),o=Ut.get(n);o&&(t.remove(o.go),Ut.delete(n))}function cl(u){for(const{pl:r,phase:e}of Ut.values()){const t=1+.08*Math.sin(u*11.7+e)+.05*Math.sin(u*7.3+e*1.7)+.03*Math.sin(u*23.1+e*.5);r.intensity=4*t}}function yi(u,r,e,t){const n=dr(u,r,e);if(kt.has(n))return;const o=new be("MagmaLight");o.position.set(u+.5,r+.5,e+.5);const i=o.addComponent(new Wr);i.color=new j(1,.28,0),i.intensity=6,i.radius=10,i.castShadow=!1,t.add(o);const a=(u*127.1+r*311.7+e*74.3)%(Math.PI*2);kt.set(n,{go:o,pl:i,phase:a})}function wi(u,r,e,t){const n=dr(u,r,e),o=kt.get(n);o&&(t.remove(o.go),kt.delete(n))}function ul(u){for(const{pl:r,phase:e}of kt.values()){const t=1+.18*Math.sin(u*1.1+e)+.1*Math.sin(u*2.9+e*.7)+.06*Math.sin(u*.5+e*1.4);r.intensity=6*t}}const dl=700,fl=300;function xi(u){return ca[u]*1500}function pl(){return{targetBlock:null,targetHit:null,mouseHeld:-1,mouseHoldTime:0,lastBlockAction:0,breakProgress:0,breakingBlock:null,breakTime:0,crackStage:-1}}function sr(u,r,e){var a,l;const t=u.breakingBlock.x,n=u.breakingBlock.y,o=u.breakingBlock.z,i=r.getBlockType(t,n,o);if(i===R.TORCH&&Fr(t,n,o,e),i===R.MAGMA&&wi(t,n,o,e),r.mineBlock(t,n,o)&&((a=u.onLocalEdit)==null||a.call(u,{kind:"break",x:t,y:n,z:o}),!Ae(i))){const c=r.getBlockType(t,n+1,o);Ae(c)&&(c===R.TORCH&&Fr(t,n+1,o,e),r.mineBlock(t,n+1,o)&&((l=u.onLocalEdit)==null||l.call(u,{kind:"break",x:t,y:n+1,z:o})))}u.breakProgress=0,u.breakingBlock=null,u.crackStage=-1}function _n(u,r,e,t,n,o){var i;if(u===0&&e.targetBlock){const a=e.targetBlock.x,l=e.targetBlock.y,c=e.targetBlock.z,d=t.getBlockType(a,l,c);e.breakingBlock&&(e.breakingBlock.x!==a||e.breakingBlock.y!==l||e.breakingBlock.z!==c)&&(e.breakProgress=0,e.crackStage=-1,e.breakingBlock=null),e.breakingBlock=new j(a,l,c),e.breakTime=xi(d),e.breakTime===0&&sr(e,t,o),e.lastBlockAction=r}else if(u===2&&e.targetHit){const a=e.targetHit,l=n(),c=a.position.x+a.face.x,d=a.position.y+a.face.y,f=a.position.z+a.face.z;t.addBlock(a.position.x,a.position.y,a.position.z,a.face.x,a.face.y,a.face.z,l)&&(l===R.TORCH&&bi(c,d,f,o),l===R.MAGMA&&yi(c,d,f,o),(i=e.onLocalEdit)==null||i.call(e,{kind:"place",x:a.position.x,y:a.position.y,z:a.position.z,fx:a.face.x,fy:a.face.y,fz:a.face.z,blockType:l})),e.lastBlockAction=r}}function Fo(u,r,e){if(u.kind==="break"){const i=r.getBlockType(u.x,u.y,u.z);i===R.TORCH&&Fr(u.x,u.y,u.z,e),i===R.MAGMA&&wi(u.x,u.y,u.z,e),r.mineBlock(u.x,u.y,u.z);return}const t=u.x+u.fx,n=u.y+u.fy,o=u.z+u.fz;r.setBlockType(t,n,o,u.blockType),u.blockType===R.TORCH&&bi(t,n,o,e),u.blockType===R.MAGMA&&yi(t,n,o,e)}function hl(u,r,e,t,n){u.addEventListener("contextmenu",o=>o.preventDefault()),u.addEventListener("mousedown",o=>{document.pointerLockElement===u&&(o.button!==0&&o.button!==2||(r.mouseHeld=o.button,r.mouseHoldTime=o.timeStamp,o.button===2&&_n(o.button,o.timeStamp,r,e,t,n)))}),u.addEventListener("mouseup",o=>{o.button===r.mouseHeld&&(r.mouseHeld=-1,r.breakProgress=0,r.breakingBlock=null,r.crackStage=-1)})}function _l(u,r,e,t,n,o){if(e.mouseHeld>=0)if(e.mouseHeld===0){const i=e.targetBlock;if(i&&e.breakingBlock)i.x===e.breakingBlock.x&&i.y===e.breakingBlock.y&&i.z===e.breakingBlock.z?(e.breakProgress+=u*1e3,e.crackStage=Math.min(Math.floor(e.breakProgress/e.breakTime*10),9),e.breakProgress>=e.breakTime&&sr(e,t,o)):(e.breakProgress=0,e.breakingBlock=null,e.crackStage=-1);else if(i&&!e.breakingBlock){const a=t.getBlockType(i.x,i.y,i.z);e.breakingBlock=new j(i.x,i.y,i.z),e.breakTime=xi(a),e.breakProgress=0,e.crackStage=0,e.breakTime===0&&sr(e,t,o)}}else e.mouseHeld===2&&r-e.mouseHoldTime>=dl&&r-e.lastBlockAction>=fl&&_n(e.mouseHeld,r,e,t,n,o);else e.breakingBlock&&(e.breakProgress=0,e.breakingBlock=null,e.crackStage=-1)}const tt=60,ml=.1,Kt=28,Rr=64,Ho=44,lt=70,gl=.005;function vl(u,r,e){const t={controls:null,cancel(){}},n=()=>{t.controls||(t.controls=new yl(u,r),e==null||e(t.controls))};return window.addEventListener("touchstart",n,{once:!0,passive:!0,capture:!0}),t.cancel=()=>window.removeEventListener("touchstart",n,!0),t}function bl(){if(typeof location<"u"&&/[?&]touch(=1|=true|=on|$|&)/.test(location.search))return!0;if(typeof navigator<"u"){const u=navigator;if((u.maxTouchPoints??0)>0||(u.msMaxTouchPoints??0)>0)return!0}if(typeof window<"u"&&"ontouchstart"in window)return!0;if(typeof window<"u"&&typeof window.matchMedia=="function")try{if(window.matchMedia("(any-pointer: coarse)").matches||window.matchMedia("(pointer: coarse)").matches)return!0}catch{}return!1}class yl{constructor(r,e){s(this,"_root");s(this,"_joystick");s(this,"_stick");s(this,"_btnJump");s(this,"_btnSneak");s(this,"_btnRun");s(this,"_btnMine");s(this,"_btnPlace");s(this,"_btnFlashlight");s(this,"_btnMenu");s(this,"_joyTouchId",null);s(this,"_joyOriginX",0);s(this,"_joyOriginY",0);s(this,"_lookTouchId",null);s(this,"_lookLastX",0);s(this,"_lookLastY",0);s(this,"_lookLastTapAt",-1/0);s(this,"_sprinting",!1);s(this,"_flashlightOn",!1);s(this,"_lookSensitivity");s(this,"_onJoyStart",r=>{if(this._joyTouchId!==null)return;r.preventDefault();const e=r.changedTouches[0];this._joyTouchId=e.identifier;const t=this._joystick.getBoundingClientRect();this._joyOriginX=t.left+t.width*.5,this._joyOriginY=t.top+t.height*.5,this._updateJoystick(e.clientX,e.clientY)});s(this,"_onJoyMove",r=>{if(this._joyTouchId!==null)for(let e=0;e<r.changedTouches.length;e++){const t=r.changedTouches[e];if(t.identifier===this._joyTouchId){r.preventDefault(),this._updateJoystick(t.clientX,t.clientY);return}}});s(this,"_onJoyEnd",r=>{if(this._joyTouchId!==null){for(let e=0;e<r.changedTouches.length;e++)if(r.changedTouches[e].identifier===this._joyTouchId){r.preventDefault(),this._joyTouchId=null,this._setMovement(0,0),this._stick.style.transform="translate(0px, 0px)";return}}});s(this,"_onLookStart",r=>{if(this._lookTouchId!==null)return;const e=r.changedTouches[0],t=window.innerWidth*.5;if(e.clientX<t)return;r.preventDefault(),this._lookTouchId=e.identifier,this._lookLastX=e.clientX,this._lookLastY=e.clientY;const n=performance.now();n-this._lookLastTapAt<350&&this._opts.onLookDoubleTap?(this._opts.onLookDoubleTap(),this._lookLastTapAt=-1/0):this._lookLastTapAt=n});s(this,"_onLookMove",r=>{if(this._lookTouchId!==null)for(let e=0;e<r.changedTouches.length;e++){const t=r.changedTouches[e];if(t.identifier!==this._lookTouchId)continue;r.preventDefault();const n=t.clientX-this._lookLastX,o=t.clientY-this._lookLastY;this._lookLastX=t.clientX,this._lookLastY=t.clientY,this._applyLook(n,o);return}});s(this,"_onLookEnd",r=>{if(this._lookTouchId!==null){for(let e=0;e<r.changedTouches.length;e++)if(r.changedTouches[e].identifier===this._lookTouchId){r.preventDefault(),this._lookTouchId=null;return}}});this._canvas=r,this._opts=e,this._lookSensitivity=e.lookSensitivity??gl,this._root=document.createElement("div"),this._root.style.cssText=["position:fixed","inset:0","pointer-events:none","user-select:none","-webkit-user-select:none","touch-action:none","z-index:50"].join(";"),this._joystick=document.createElement("div"),this._joystick.style.cssText=["position:absolute","left:24px",`bottom:${lt}px`,`width:${tt*2}px`,`height:${tt*2}px`,"border-radius:50%","background:rgba(255,255,255,0.10)","border:2px solid rgba(255,255,255,0.30)","pointer-events:auto"].join(";"),this._stick=document.createElement("div"),this._stick.style.cssText=["position:absolute",`left:${tt-Kt}px`,`top:${tt-Kt}px`,`width:${Kt*2}px`,`height:${Kt*2}px`,"border-radius:50%","background:rgba(255,255,255,0.30)","border:2px solid rgba(255,255,255,0.50)","pointer-events:none","transition:transform 80ms ease-out"].join(";"),this._joystick.appendChild(this._stick),this._root.appendChild(this._joystick);const t=Rr+12;this._btnSneak=this._makeButton("⤓",`right:${24+2*t}px`,`bottom:${lt}px`,"rgba(255,255,255,0.10)"),this._btnRun=this._makeButton(">>",`right:${24+t}px`,`bottom:${lt}px`,"rgba(100,200,100,0.25)"),this._btnJump=this._makeButton("⤒","right:24px",`bottom:${lt}px`,"rgba(255,255,255,0.18)"),this._btnMine=this._makeButton("⛏",`right:${24+2*t}px`,`bottom:${lt+t}px`,"rgba(220,80,80,0.45)"),this._btnPlace=this._makeButton("▣",`right:${24+t}px`,`bottom:${lt+t}px`,"rgba(80,180,90,0.45)"),this._btnFlashlight=this._makeButton("💡","right:24px",`bottom:${lt+t}px`,"rgba(200,200,80,0.25)"),this._btnMenu=this._makeButton("☰","right:16px","top:16px","rgba(0,0,0,0.45)"),this._btnMenu.style.width=`${Ho}px`,this._btnMenu.style.height=`${Ho}px`,this._btnMenu.style.fontSize="24px",document.body.appendChild(this._root),this._attachEvents()}destroy(){this._detachEvents(),this._root.remove()}_makeButton(r,e,t,n){const o=document.createElement("div");return o.textContent=r,o.style.cssText=["position:absolute",e,t,`width:${Rr}px`,`height:${Rr}px`,"border-radius:50%",`background:${n}`,"border:2px solid rgba(255,255,255,0.45)","color:#fff","font-size:32px","font-family:sans-serif","display:flex","align-items:center","justify-content:center","pointer-events:auto","user-select:none"].join(";"),this._root.appendChild(o),o}_attachEvents(){this._joystick.addEventListener("touchstart",this._onJoyStart,{passive:!1}),this._joystick.addEventListener("touchmove",this._onJoyMove,{passive:!1}),this._joystick.addEventListener("touchend",this._onJoyEnd,{passive:!1}),this._joystick.addEventListener("touchcancel",this._onJoyEnd,{passive:!1}),this._canvas.addEventListener("touchstart",this._onLookStart,{passive:!1}),this._canvas.addEventListener("touchmove",this._onLookMove,{passive:!1}),this._canvas.addEventListener("touchend",this._onLookEnd,{passive:!1}),this._canvas.addEventListener("touchcancel",this._onLookEnd,{passive:!1}),this._bindHoldButton(this._btnJump,()=>this._setJump(!0),()=>this._setJump(!1)),this._bindHoldButton(this._btnSneak,()=>this._setSneak(!0),()=>this._setSneak(!1)),this._bindHoldButton(this._btnMine,()=>this._actionDown(0),()=>this._actionUp(0)),this._bindHoldButton(this._btnPlace,()=>this._actionDown(2),()=>this._actionUp(2)),this._bindToggleButton(this._btnRun,()=>this._toggleSprint()),this._bindToggleButton(this._btnFlashlight,()=>this._toggleFlashlight());const r=e=>{var t,n;e.preventDefault(),this._btnMenu.style.filter="",(n=(t=this._opts).onMenu)==null||n.call(t)};this._btnMenu.addEventListener("touchstart",e=>{e.preventDefault(),this._btnMenu.style.filter="brightness(1.5)"},{passive:!1}),this._btnMenu.addEventListener("touchend",r,{passive:!1}),this._btnMenu.addEventListener("touchcancel",()=>{this._btnMenu.style.filter=""},{passive:!1})}_detachEvents(){this._joystick.removeEventListener("touchstart",this._onJoyStart),this._joystick.removeEventListener("touchmove",this._onJoyMove),this._joystick.removeEventListener("touchend",this._onJoyEnd),this._joystick.removeEventListener("touchcancel",this._onJoyEnd),this._canvas.removeEventListener("touchstart",this._onLookStart),this._canvas.removeEventListener("touchmove",this._onLookMove),this._canvas.removeEventListener("touchend",this._onLookEnd),this._canvas.removeEventListener("touchcancel",this._onLookEnd)}_bindHoldButton(r,e,t){const n=i=>{i.preventDefault(),r.style.filter="brightness(1.5)",e()},o=i=>{i.preventDefault(),r.style.filter="",t()};r.addEventListener("touchstart",n,{passive:!1}),r.addEventListener("touchend",o,{passive:!1}),r.addEventListener("touchcancel",o,{passive:!1})}_bindToggleButton(r,e){const t=n=>{n.preventDefault(),e()};r.addEventListener("touchstart",t,{passive:!1}),r.addEventListener("touchend",n=>n.preventDefault(),{passive:!1})}_toggleSprint(){this._sprinting=!this._sprinting,this._btnRun.style.background=this._sprinting?"rgba(100,200,100,0.55)":"rgba(100,200,100,0.25)",this._btnRun.style.borderColor=this._sprinting?"rgba(100,255,100,0.8)":"rgba(255,255,255,0.45)",this._opts.player&&(this._opts.player.inputSprint=this._sprinting)}_toggleFlashlight(){var r,e;this._flashlightOn=!this._flashlightOn,this._btnFlashlight.style.background=this._flashlightOn?"rgba(200,200,80,0.55)":"rgba(200,200,80,0.25)",this._btnFlashlight.style.borderColor=this._flashlightOn?"rgba(255,255,180,0.8)":"rgba(255,255,255,0.45)",(e=(r=this._opts).onFlashlightToggle)==null||e.call(r)}_updateJoystick(r,e){let t=r-this._joyOriginX,n=e-this._joyOriginY;const o=Math.hypot(t,n);if(o>tt){const c=tt/o;t*=c,n*=c}this._stick.style.transition="none",this._stick.style.transform=`translate(${t}px, ${n}px)`,requestAnimationFrame(()=>{this._stick.style.transition="transform 80ms ease-out"});const i=t/tt,a=n/tt;if(Math.hypot(i,a)<ml){this._setMovement(0,0);return}this._setMovement(i,-a)}_activeIsCamera(){return(this._opts.getActive?this._opts.getActive():"player")==="camera"}_setMovement(r,e){const t=this._activeIsCamera();t&&this._opts.camera?(this._opts.camera.inputForward=e,this._opts.camera.inputStrafe=r):this._opts.player&&(this._opts.player.inputForward=e,this._opts.player.inputStrafe=r),t&&this._opts.player?(this._opts.player.inputForward=0,this._opts.player.inputStrafe=0):!t&&this._opts.camera&&(this._opts.camera.inputForward=0,this._opts.camera.inputStrafe=0)}_setJump(r){this._activeIsCamera()&&this._opts.camera?this._opts.camera.inputUp=r:this._opts.player&&(this._opts.player.inputJump=r)}_setSneak(r){this._activeIsCamera()&&this._opts.camera?this._opts.camera.inputDown=r:this._opts.player&&(this._opts.player.inputSneak=r)}_applyLook(r,e){const t=r*(this._lookSensitivity/.002),n=e*(this._lookSensitivity/.002);this._activeIsCamera()&&this._opts.camera?this._opts.camera.applyLookDelta(t,n):this._opts.player&&this._opts.player.applyLookDelta(t,n)}_actionDown(r){const{world:e,scene:t,blockInteraction:n,getSelectedBlock:o}=this._opts;if(!e||!t||!n||!o)return;const i=performance.now();if(r===0){const a=n.targetBlock;a&&(n.breakingBlock=new j(a.x,a.y,a.z),sr(n,e,t)),n.mouseHeld=-1,n.mouseHoldTime=i}else r===2&&(n.mouseHeld=r,n.mouseHoldTime=i,_n(r,i,n,e,o,t))}_actionUp(r){const e=this._opts.blockInteraction;e&&e.mouseHeld===r&&(e.mouseHeld=-1)}}const wl=""+new URL("cloth1-rQSbqQaY.wav",import.meta.url).href,xl=""+new URL("cloth2-Bsf9dy7W.wav",import.meta.url).href,Bl=""+new URL("cloth3-4mN9PCjB.wav",import.meta.url).href,Sl=""+new URL("cloth4-BB13HI0Q.wav",import.meta.url).href,Pl=""+new URL("coral1-Ce7Jeu17.wav",import.meta.url).href,Gl=""+new URL("coral2-Cfy2RjU2.wav",import.meta.url).href,Tl=""+new URL("coral3-CyI9rIW8.wav",import.meta.url).href,Ml=""+new URL("coral4-Bp3T5iM4.wav",import.meta.url).href,El=""+new URL("coral5-DonNr-7d.wav",import.meta.url).href,Al=""+new URL("coral6-B8JOks-i.wav",import.meta.url).href,Ul=""+new URL("grass1-CcRd259Q.wav",import.meta.url).href,kl=""+new URL("grass2-DGXOtHh7.wav",import.meta.url).href,Cl=""+new URL("grass3-BPyuRLOX.wav",import.meta.url).href,Ll=""+new URL("grass4-DVxIVnx3.wav",import.meta.url).href,Rl=""+new URL("grass5-DI6OjZl4.wav",import.meta.url).href,Nl=""+new URL("grass6-Bf5VD6yI.wav",import.meta.url).href,Il=""+new URL("gravel1-CZz6Zfew.wav",import.meta.url).href,Ol=""+new URL("gravel2-C9lv5mzC.wav",import.meta.url).href,Dl=""+new URL("gravel3-DyeQ0Rfa.wav",import.meta.url).href,Vl=""+new URL("gravel4-BfSCT7w0.wav",import.meta.url).href,zl=""+new URL("sand1-Ciqwhtq8.wav",import.meta.url).href,Fl=""+new URL("sand2-BTi87W5b.wav",import.meta.url).href,Hl=""+new URL("sand3-532u2TkY.wav",import.meta.url).href,Wl=""+new URL("sand4-C_w1pmBG.wav",import.meta.url).href,jl=""+new URL("sand5-CDCdXHm6.wav",import.meta.url).href,ql=""+new URL("stone1-BsjzFAng.wav",import.meta.url).href,Yl=""+new URL("stone2-DzvdL41T.wav",import.meta.url).href,Xl=""+new URL("stone3-CYb6BfFN.wav",import.meta.url).href,$l=""+new URL("stone4-DFPefyQ7.wav",import.meta.url).href,Zl=""+new URL("stone5-CVLj567P.wav",import.meta.url).href,Kl=""+new URL("stone6-CswOa5tA.wav",import.meta.url).href,Jl=""+new URL("wood1-DSWFSF8G.wav",import.meta.url).href,Ql=""+new URL("wood2-CSGQI2IY.wav",import.meta.url).href,ec=""+new URL("wood3-DCP5Ew66.wav",import.meta.url).href,tc=""+new URL("wood4-C--JcgAp.wav",import.meta.url).href,rc=""+new URL("wood5-cP_3p3YS.wav",import.meta.url).href,nc=""+new URL("wood6-IdFIwSmi.wav",import.meta.url).href,oc=""+new URL("fallbig-BE8dw5XJ.wav",import.meta.url).href,ic=""+new URL("fallsmall-BZcAgTny.wav",import.meta.url).href,ac=""+new URL("grass1-CCHdxn4D.wav",import.meta.url).href,sc=""+new URL("grass2-Ctd8JhUF.wav",import.meta.url).href,lc=""+new URL("grass3-x_45b-_D.wav",import.meta.url).href,cc=""+new URL("grass4-spl5Ndua.wav",import.meta.url).href,uc=""+new URL("sand1-T_E592kx.wav",import.meta.url).href,dc=""+new URL("sand2-BNuSYbkF.wav",import.meta.url).href,fc=""+new URL("sand3-DaqPUVKQ.wav",import.meta.url).href,pc=""+new URL("sand4-TT7LnGwY.wav",import.meta.url).href,hc=""+new URL("stone1-DAnELQ24.wav",import.meta.url).href,_c=""+new URL("stone2-cLpgUmtS.wav",import.meta.url).href,mc=""+new URL("stone3-3yjcMYde.wav",import.meta.url).href,gc=""+new URL("stone4-DaH288J_.wav",import.meta.url).href,vc=""+new URL("wood1-D5mqXTyf.wav",import.meta.url).href,bc=""+new URL("wood2-mBu4sysu.wav",import.meta.url).href,yc=""+new URL("wood3-wSoj1HMx.wav",import.meta.url).href,wc=""+new URL("wood4-DKmn8tfu.wav",import.meta.url).href,xc=Object.assign({"../../assets/sounds/player/step/cloth1.wav":wl,"../../assets/sounds/player/step/cloth2.wav":xl,"../../assets/sounds/player/step/cloth3.wav":Bl,"../../assets/sounds/player/step/cloth4.wav":Sl,"../../assets/sounds/player/step/coral1.wav":Pl,"../../assets/sounds/player/step/coral2.wav":Gl,"../../assets/sounds/player/step/coral3.wav":Tl,"../../assets/sounds/player/step/coral4.wav":Ml,"../../assets/sounds/player/step/coral5.wav":El,"../../assets/sounds/player/step/coral6.wav":Al,"../../assets/sounds/player/step/grass1.wav":Ul,"../../assets/sounds/player/step/grass2.wav":kl,"../../assets/sounds/player/step/grass3.wav":Cl,"../../assets/sounds/player/step/grass4.wav":Ll,"../../assets/sounds/player/step/grass5.wav":Rl,"../../assets/sounds/player/step/grass6.wav":Nl,"../../assets/sounds/player/step/gravel1.wav":Il,"../../assets/sounds/player/step/gravel2.wav":Ol,"../../assets/sounds/player/step/gravel3.wav":Dl,"../../assets/sounds/player/step/gravel4.wav":Vl,"../../assets/sounds/player/step/sand1.wav":zl,"../../assets/sounds/player/step/sand2.wav":Fl,"../../assets/sounds/player/step/sand3.wav":Hl,"../../assets/sounds/player/step/sand4.wav":Wl,"../../assets/sounds/player/step/sand5.wav":jl,"../../assets/sounds/player/step/stone1.wav":ql,"../../assets/sounds/player/step/stone2.wav":Yl,"../../assets/sounds/player/step/stone3.wav":Xl,"../../assets/sounds/player/step/stone4.wav":$l,"../../assets/sounds/player/step/stone5.wav":Zl,"../../assets/sounds/player/step/stone6.wav":Kl,"../../assets/sounds/player/step/wood1.wav":Jl,"../../assets/sounds/player/step/wood2.wav":Ql,"../../assets/sounds/player/step/wood3.wav":ec,"../../assets/sounds/player/step/wood4.wav":tc,"../../assets/sounds/player/step/wood5.wav":rc,"../../assets/sounds/player/step/wood6.wav":nc}),Bc=Object.assign({"../../assets/sounds/player/fall/fallbig.wav":oc,"../../assets/sounds/player/fall/fallsmall.wav":ic}),Sc=Object.assign({"../../assets/sounds/player/dig/grass1.wav":ac,"../../assets/sounds/player/dig/grass2.wav":sc,"../../assets/sounds/player/dig/grass3.wav":lc,"../../assets/sounds/player/dig/grass4.wav":cc,"../../assets/sounds/player/dig/sand1.wav":uc,"../../assets/sounds/player/dig/sand2.wav":dc,"../../assets/sounds/player/dig/sand3.wav":fc,"../../assets/sounds/player/dig/sand4.wav":pc,"../../assets/sounds/player/dig/stone1.wav":hc,"../../assets/sounds/player/dig/stone2.wav":_c,"../../assets/sounds/player/dig/stone3.wav":mc,"../../assets/sounds/player/dig/stone4.wav":gc,"../../assets/sounds/player/dig/wood1.wav":vc,"../../assets/sounds/player/dig/wood2.wav":bc,"../../assets/sounds/player/dig/wood3.wav":yc,"../../assets/sounds/player/dig/wood4.wav":wc});function Wo(u){const r=u.match(/step\/(\w+?)(\d+)\.wav$/);return r?{surface:r[1],variant:parseInt(r[2],10)}:null}function Pc(u){const r=u.match(/fall\/(\w+)\.wav$/);return r?r[1]:null}class Gc{constructor(){s(this,"_ctx",null);s(this,"_stepBuffers",new Map);s(this,"_fallBuffers",new Map);s(this,"_digBuffers",new Map);s(this,"_oneShots",[]);s(this,"_musicGain",null);s(this,"_musicSource",null);s(this,"_musicBuffer",null);s(this,"masterVolume",.5);s(this,"sfxVolume",.7);s(this,"musicVolume",.4)}async init(){this._ctx||(this._ctx=new AudioContext),this._ctx.state==="suspended"&&await this._ctx.resume(),await Promise.all([this._loadStepSounds(),this._loadFallSounds(),this._loadDigSounds()])}get context(){return this._ctx||(this._ctx=new AudioContext),this._ctx}async _loadStepSounds(){const r=new Map;for(const[e,t]of Object.entries(xc)){const n=Wo(e);if(!n)continue;const o=await this._fetchDecode(t);if(!o)continue;let i=r.get(n.surface);i||(i=[],r.set(n.surface,i)),i.push(o)}for(const[,e]of r)e.sort(()=>Math.random()-.5);this._stepBuffers=r}async _loadFallSounds(){for(const[r,e]of Object.entries(Bc)){const t=Pc(r);if(!t)continue;const n=await this._fetchDecode(e);n&&this._fallBuffers.set(t,n)}}async _loadDigSounds(){const r=new Map;for(const[e,t]of Object.entries(Sc)){const n=Wo(e);if(!n)continue;const o=await this._fetchDecode(t);if(!o)continue;let i=r.get(n.surface);i||(i=[],r.set(n.surface,i)),i.push(o)}for(const[,e]of r)e.sort(()=>Math.random()-.5);this._digBuffers=r}async _fetchDecode(r){try{const t=await(await fetch(r)).arrayBuffer();return await this.context.decodeAudioData(t)}catch(e){return console.warn("[audio] failed to load",r,e),null}}get ready(){return this._ctx!==null&&this._ctx.state!=="suspended"}updateListener(r,e,t){const n=this._ctx;if(!n||n.state!=="running")return;const o=n.listener;o.positionX.value=r.x,o.positionY.value=r.y,o.positionZ.value=r.z,o.forwardX.value=e.x,o.forwardY.value=e.y,o.forwardZ.value=e.z,o.upX.value=t.x,o.upY.value=t.y,o.upZ.value=t.z;for(let i=this._oneShots.length-1;i>=0;i--)this._oneShots[i].done&&(this._oneShots[i].dispose(),this._oneShots.splice(i,1))}playBufferAt(r,e,t=1,n=1){const o=this._ctx;if(!o||o.state!=="running")return;const i=t*this.sfxVolume*this.masterVolume;if(i<=0)return;const a=new Tc(o,r,e,i,n);this._oneShots.push(a)}playStep(r,e,t=1,n=1){const o=this._stepBuffers.get(r);if(!o||o.length===0)return;const i=o[Math.floor(Math.random()*o.length)];this.playBufferAt(i,e,t,n)}playLand(r,e,t){const n=t>15?"fallbig":"fallsmall",o=this._fallBuffers.get(n);o&&this.playBufferAt(o,e,.6+Math.min(t/30,.4))}playDig(r,e){const t=this._digBuffers.get(r);if(!t||t.length===0)return;const n=t[Math.floor(Math.random()*t.length)];this.playBufferAt(n,e,.8)}playUI(r,e=1){const t=this._ctx;if(!t||t.state!=="running")return;const n=e*this.sfxVolume*this.masterVolume;if(n<=0)return;const o=t.createBufferSource();o.buffer=r;const i=t.createGain();i.gain.value=n,o.connect(i).connect(t.destination),o.start(),o.onended=()=>{o.disconnect(),i.disconnect()}}async playMusic(r,e){const t=this._ctx;if(!t)return;this.stopMusic();const n=await this._fetchDecode(r);if(!n)return;this._musicBuffer=n,this._musicGain||(this._musicGain=t.createGain(),this._musicGain.connect(t.destination)),this._musicGain.gain.value=(e??this.musicVolume)*this.masterVolume;const o=t.createBufferSource();o.buffer=n,o.loop=!0,o.connect(this._musicGain),o.start(),this._musicSource=o}setMusicVolume(r){this.musicVolume=r,this._musicGain&&(this._musicGain.gain.value=r*this.masterVolume)}stopMusic(){if(this._musicSource){try{this._musicSource.stop()}catch{}this._musicSource.disconnect(),this._musicSource=null}this._musicBuffer=null}fadeOutMusic(r=2){return new Promise(e=>{if(!this._musicGain||!this._musicSource){e();return}const t=this._musicGain.gain.value;this._musicGain.gain.cancelScheduledValues(this.context.currentTime),this._musicGain.gain.setValueAtTime(t,this.context.currentTime),this._musicGain.gain.linearRampToValueAtTime(0,this.context.currentTime+r),setTimeout(()=>{this.stopMusic(),e()},r*1e3)})}dispose(){this.stopMusic();for(const r of this._oneShots)r.dispose();this._oneShots.length=0,this._stepBuffers.clear(),this._fallBuffers.clear(),this._digBuffers.clear(),this._ctx&&(this._ctx.close().catch(()=>{}),this._ctx=null)}}class Tc{constructor(r,e,t,n,o){s(this,"_src");s(this,"_gain");s(this,"_panner");s(this,"_ctx");s(this,"_finished",!1);this._ctx=r,this._gain=r.createGain(),this._gain.gain.value=n,this._panner=r.createPanner(),this._panner.panningModel="HRTF",this._panner.distanceModel="inverse",this._panner.maxDistance=50,this._panner.refDistance=5,this._panner.rolloffFactor=1,this._panner.positionX.value=t.x,this._panner.positionY.value=t.y,this._panner.positionZ.value=t.z,this._src=r.createBufferSource(),this._src.buffer=e,this._src.playbackRate.value=o,this._src.connect(this._gain),this._gain.connect(this._panner),this._panner.connect(r.destination),this._src.start(),this._src.onended=()=>{this._finished=!0}}get done(){return this._finished}dispose(){try{this._src.stop()}catch{}this._src.disconnect(),this._gain.disconnect(),this._panner.disconnect()}}const Mc={[Be.None]:[0,1,2],[Be.Desert]:[0,1],[Be.GrassyPlains]:[0,1,2,3,4],[Be.RockyMountains]:[0,1,2,3,4],[Be.SnowyPlains]:[0,1,2,5,6],[Be.SnowyMountains]:[0,1,2,5,6],[Be.Max]:[0,1,2]},jo={0:5,1:4,2:2,3:2,4:1,5:2,6:1},Ec={0:"Clear",1:"Cloudy",2:"Overcast",3:"Light Rain",4:"Heavy Rain",5:"Light Snow",6:"Heavy Snow"};function Ac(u){return Ec[u]}function qo(u){switch(u){case 0:return .1;case 1:return .85;case 2:return 1.1;case 3:return .95;case 4:return 1.1;case 5:return .8;case 6:return 1.2}}function Uc(u){switch(u){case 3:case 4:return Ye.Rain;case 5:case 6:return Ye.Snow;default:return Ye.None}}function kc(u){switch(u){case 3:return 12e3;case 4:return 5e4;case 5:return 800;case 6:return 5500;default:return 0}}function Yo(u,r){const e=Mc[u];if(!e||e.length===0)return 0;const t=e.reduce((o,i)=>o+jo[i],0);let n=Math.random()*t;for(const o of e)if(n-=jo[o],n<=0)return o;return e[e.length-1]}function Xo(){return 30+Math.random()*90}const Cc=`// Forward PBR shader with multi-light support
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
`,Lc=`// GBuffer fill pass — writes albedo+roughness and normal+metallic.\r
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
`,Rc=`// Skinned GBuffer fill pass — GPU vertex skinning with up to 4 bone influences.\r
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
`,$o=48,ve=class ve extends $i{constructor(e={}){super();s(this,"shaderId","pbr");s(this,"albedo");s(this,"roughness");s(this,"metallic");s(this,"uvOffset");s(this,"uvScale");s(this,"uvTile");s(this,"_albedoMap");s(this,"_normalMap");s(this,"_merMap");s(this,"_uniformBuffer",null);s(this,"_uniformDevice",null);s(this,"_bindGroup",null);s(this,"_bindGroupAlbedo");s(this,"_bindGroupNormal");s(this,"_bindGroupMer");s(this,"_dirty",!0);s(this,"_scratch",new Float32Array($o/4));this.albedo=e.albedo??[1,1,1,1],this.roughness=e.roughness??.5,this.metallic=e.metallic??0,this.uvOffset=e.uvOffset,this.uvScale=e.uvScale,this.uvTile=e.uvTile,this._albedoMap=e.albedoMap,this._normalMap=e.normalMap,this._merMap=e.merMap,this.transparent=e.transparent??!1}get albedoMap(){return this._albedoMap}set albedoMap(e){e!==this._albedoMap&&(this._albedoMap=e,this._bindGroup=null)}get normalMap(){return this._normalMap}set normalMap(e){e!==this._normalMap&&(this._normalMap=e,this._bindGroup=null)}get merMap(){return this._merMap}set merMap(e){e!==this._merMap&&(this._merMap=e,this._bindGroup=null)}markDirty(){this._dirty=!0}getShaderCode(e){switch(e){case Et.Forward:return Cc;case Et.Geometry:return Lc;case Et.SkinnedGeometry:return Rc}}getBindGroupLayout(e){let t=ve._layoutByDevice.get(e);return t||(t=e.createBindGroupLayout({label:"PbrMaterialBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),ve._layoutByDevice.set(e,t)),t}getBindGroup(e){var a,l,c,d;if(this._bindGroup&&this._bindGroupAlbedo===this._albedoMap&&this._bindGroupNormal===this._normalMap&&this._bindGroupMer===this._merMap)return this._bindGroup;(!this._uniformBuffer||this._uniformDevice!==e)&&((a=this._uniformBuffer)==null||a.destroy(),this._uniformBuffer=e.createBuffer({label:"PbrMaterialUniform",size:$o,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this._uniformDevice=e,this._dirty=!0);const t=ve._getSampler(e),n=((l=this._albedoMap)==null?void 0:l.view)??ve._getWhite(e),o=((c=this._normalMap)==null?void 0:c.view)??ve._getFlatNormal(e),i=((d=this._merMap)==null?void 0:d.view)??ve._getMerDefault(e);return this._bindGroup=e.createBindGroup({label:"PbrMaterialBG",layout:this.getBindGroupLayout(e),entries:[{binding:0,resource:{buffer:this._uniformBuffer}},{binding:1,resource:n},{binding:2,resource:o},{binding:3,resource:i},{binding:4,resource:t}]}),this._bindGroupAlbedo=this._albedoMap,this._bindGroupNormal=this._normalMap,this._bindGroupMer=this._merMap,this._bindGroup}update(e){var n,o,i,a,l,c;if(!this._dirty||!this._uniformBuffer)return;const t=this._scratch;t[0]=this.albedo[0],t[1]=this.albedo[1],t[2]=this.albedo[2],t[3]=this.albedo[3],t[4]=this.roughness,t[5]=this.metallic,t[6]=((n=this.uvOffset)==null?void 0:n[0])??0,t[7]=((o=this.uvOffset)==null?void 0:o[1])??0,t[8]=((i=this.uvScale)==null?void 0:i[0])??1,t[9]=((a=this.uvScale)==null?void 0:a[1])??1,t[10]=((l=this.uvTile)==null?void 0:l[0])??1,t[11]=((c=this.uvTile)==null?void 0:c[1])??1,e.writeBuffer(this._uniformBuffer,0,t.buffer),this._dirty=!1}destroy(){var e;(e=this._uniformBuffer)==null||e.destroy(),this._uniformBuffer=null,this._uniformDevice=null,this._bindGroup=null}static _getSampler(e){let t=ve._samplerByDevice.get(e);return t||(t=e.createSampler({label:"PbrMaterialSampler",magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"}),ve._samplerByDevice.set(e,t)),t}static _make1x1View(e,t,n,o,i,a){const l=e.createTexture({label:t,size:{width:1,height:1},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return e.queue.writeTexture({texture:l},new Uint8Array([n,o,i,a]),{bytesPerRow:4},{width:1,height:1}),l.createView()}static _getWhite(e){let t=ve._whiteByDevice.get(e);return t||(t=ve._make1x1View(e,"PbrFallbackWhite",255,255,255,255),ve._whiteByDevice.set(e,t)),t}static _getFlatNormal(e){let t=ve._flatNormalByDevice.get(e);return t||(t=ve._make1x1View(e,"PbrFallbackFlatNormal",128,128,255,255),ve._flatNormalByDevice.set(e,t)),t}static _getMerDefault(e){let t=ve._merDefaultByDevice.get(e);return t||(t=ve._make1x1View(e,"PbrFallbackMer",255,0,255,255),ve._merDefaultByDevice.set(e,t)),t}};s(ve,"_layoutByDevice",new WeakMap),s(ve,"_samplerByDevice",new WeakMap),s(ve,"_whiteByDevice",new WeakMap),s(ve,"_flatNormalByDevice",new WeakMap),s(ve,"_merDefaultByDevice",new WeakMap);let Ge=ve;const Nc=.5;function Ic(u,r,e,t,n,o,i){const a=e.getTopBlockY(u,r,200);if(a<=0||e.getBiomeAt(u,a,r)!==Be.GrassyPlains)return null;const d=e.getBlockType(Math.floor(u),Math.floor(a-1),Math.floor(r))===R.WATER?Math.floor(a-.05):a,f=new be("Duck");f.position.set(u+.5,d,r+.5);const p=new be("Duck.Body");p.position.set(0,.15,0),p.addComponent(new Te(n,new Ge({albedo:[.93,.93,.93,1],roughness:.9}))),f.addChild(p);const h=new be("Duck.Head");h.position.set(0,.32,-.12),h.addComponent(new Te(o,new Ge({albedo:[.08,.32,.1,1],roughness:.9}))),f.addChild(h);const _=new be("Duck.Bill");return _.position.set(0,.27,-.205),_.addComponent(new Te(i,new Ge({albedo:[1,.55,.05,1],roughness:.8}))),f.addChild(_),f.addComponent(new wt(e)),t.add(f),f}function Oc(u,r,e,t,n,o){const i=Math.random()*Math.PI*2,a=.5+Math.random()*1,l=u.position.x+Math.cos(i)*a,c=u.position.z+Math.sin(i)*a,d=r.getTopBlockY(Math.floor(l),Math.floor(c),200);if(d<=0)return;const f=Nc,p=new be("Duckling");p.position.set(l,d,c);const h=new be("Duckling.Body");h.position.set(0,.15*f,0),h.addComponent(new Te(t,new Ge({albedo:[.95,.87,.25,1],roughness:.9}))),p.addChild(h);const _=new be("Duckling.Head");_.position.set(0,.32*f,-.12*f),_.addComponent(new Te(n,new Ge({albedo:[.88,.78,.15,1],roughness:.9}))),p.addChild(_);const m=new be("Duckling.Bill");m.position.set(0,.27*f,-.205*f),m.addComponent(new Te(o,new Ge({albedo:[1,.55,.05,1],roughness:.8}))),p.addChild(m),p.addComponent(new ra(u,r)),e.add(p)}const Zo=[.96,.7,.72,1],Dc=[.98,.76,.78,1];function Ko(u,r,e,t,n,o,i,a=1){const l=e.getTopBlockY(u,r,200);if(l<=0||e.getBiomeAt(u,l,r)!==Be.GrassyPlains)return;const d=a,f=new be("Pig");f.position.set(u+.5,l,r+.5);const p=new be("Pig.Body");p.position.set(0,.35*d,0),p.addComponent(new Te(n,new Ge({albedo:Zo,roughness:.85}))),f.addChild(p);const h=new be("Pig.Head");h.position.set(0,.35*d,-.48*d),h.addComponent(new Te(o,new Ge({albedo:Zo,roughness:.85}))),f.addChild(h);const _=new be("Pig.Snout");_.position.set(0,.31*d,-.7*d),_.addComponent(new Te(i,new Ge({albedo:Dc,roughness:.8}))),f.addChild(_),f.addComponent(new ea(e)),t.add(f)}const ot=16,Vc=.15,zc=.2,Fc=.25,Hc=5,Wc=.25;function jc(u,r,e){const t=new Set,n=u.onChunkAdded;u.onChunkAdded=(o,i)=>{if(n==null||n(o,i),o.aliveBlocks===0)return;const a=Math.floor(o.globalPosition.x/ot),l=Math.floor(o.globalPosition.z/ot),c=`${a}:${l}`;t.has(c)||(t.add(c),qc(a,l,u,r,e))}}function qc(u,r,e,t,n){const o=u*ot,i=r*ot;if(Math.random()<Vc){const a=1+Math.floor(Math.random()*2);for(let l=0;l<a;l++){const c=Math.floor(o+Math.random()*ot),d=Math.floor(i+Math.random()*ot),f=Ic(c,d,e,t,n.duckBody,n.duckHead,n.duckBill);if(f&&Math.random()<Fc)for(let p=0;p<Hc;p++)Oc(f,e,t,n.ducklingBody,n.ducklingHead,n.ducklingBill)}}if(Math.random()<zc){const a=1+Math.floor(Math.random()*2);for(let l=0;l<a;l++){const c=Math.floor(o+Math.random()*ot),d=Math.floor(i+Math.random()*ot);Math.random()<Wc?Ko(c,d,e,t,n.babyPigBody,n.babyPigHead,n.babyPigSnout,.55):Ko(c,d,e,t,n.pigBody,n.pigHead,n.pigSnout,1)}}}const ct=128,Jt=40;class Yc{constructor(){s(this,"data",new Float32Array(ct*ct));s(this,"resolution",ct);s(this,"extent",Jt);s(this,"_camX",NaN);s(this,"_camZ",NaN)}update(r,e,t){if(Math.abs(r-this._camX)<2&&Math.abs(e-this._camZ)<2)return;this._camX=r,this._camZ=e;const n=Jt*2/ct,o=r-Jt,i=e-Jt,a=Math.ceil(e)+80;for(let l=0;l<ct;l++)for(let c=0;c<ct;c++)this.data[l*ct+c]=t.getTopBlockY(Math.floor(o+c*n),Math.floor(i+l*n),a)}}function Qt(u,r,e,t,n,o,i,a){const l=[{n:[0,0,-1],t:[-1,0,0,1],v:[[-o,-i,-a],[o,-i,-a],[o,i,-a],[-o,i,-a]]},{n:[0,0,1],t:[1,0,0,1],v:[[o,-i,a],[-o,-i,a],[-o,i,a],[o,i,a]]},{n:[-1,0,0],t:[0,0,-1,1],v:[[-o,-i,a],[-o,-i,-a],[-o,i,-a],[-o,i,a]]},{n:[1,0,0],t:[0,0,1,1],v:[[o,-i,-a],[o,-i,a],[o,i,a],[o,i,-a]]},{n:[0,1,0],t:[1,0,0,1],v:[[-o,i,-a],[o,i,-a],[o,i,a],[-o,i,a]]},{n:[0,-1,0],t:[1,0,0,1],v:[[-o,-i,a],[o,-i,a],[o,-i,-a],[-o,-i,-a]]}],c=[[0,1],[1,1],[1,0],[0,0]];for(const d of l){const f=u.length/12;for(let p=0;p<4;p++){const[h,_,m]=d.v[p];u.push(e+h,t+_,n+m,d.n[0],d.n[1],d.n[2],c[p][0],c[p][1],d.t[0],d.t[1],d.t[2],d.t[3])}r.push(f,f+2,f+1,f,f+3,f+2)}}function Xc(u){const r=er(u,(o,i)=>Qt(o,i,0,0,0,.25,.375,.125)),e=er(u,(o,i)=>Qt(o,i,0,0,0,.25,.25,.25)),t=er(u,(o,i)=>Qt(o,i,0,-.375,0,.125,.375,.125)),n=er(u,(o,i)=>Qt(o,i,0,-.375,0,.125,.375,.125));return{body:r,head:e,arm:t,leg:n}}function er(u,r){const e=[],t=[];return r(e,t),Le.fromData(u,new Float32Array(e),new Uint32Array(t))}const $c=[.95,.78,.62,1],Nr=[.3,.55,.85,1],Jo=[.25,.3,.45,1];class Zc{constructor(r,e,t,n){s(this,"playerId");s(this,"name");s(this,"root");s(this,"_scene");s(this,"_head");s(this,"_armL");s(this,"_armR");s(this,"_legL");s(this,"_legR");s(this,"_curX",0);s(this,"_curY",0);s(this,"_curZ",0);s(this,"_curYaw",0);s(this,"_curPitch",0);s(this,"_tgtX",0);s(this,"_tgtY",0);s(this,"_tgtZ",0);s(this,"_tgtYaw",0);s(this,"_tgtPitch",0);s(this,"_hasTarget",!1);s(this,"_walkPhase",0);this.playerId=r,this.name=e,this._scene=t;const o=new be(`RemotePlayer.${r}`);this.root=o;const i=new be("RP.Body");i.position.set(0,1.125,0),i.addComponent(new Te(n.body,new Ge({albedo:Nr,roughness:.85}))),o.addChild(i);const a=new be("RP.Head");a.position.set(0,1.75,0),a.addComponent(new Te(n.head,new Ge({albedo:$c,roughness:.8}))),o.addChild(a),this._head=a;const l=new be("RP.ArmL");l.position.set(-.375,1.5,0),l.addComponent(new Te(n.arm,new Ge({albedo:Nr,roughness:.85}))),o.addChild(l),this._armL=l;const c=new be("RP.ArmR");c.position.set(.375,1.5,0),c.addComponent(new Te(n.arm,new Ge({albedo:Nr,roughness:.85}))),o.addChild(c),this._armR=c;const d=new be("RP.LegL");d.position.set(-.125,.75,0),d.addComponent(new Te(n.leg,new Ge({albedo:Jo,roughness:.85}))),o.addChild(d),this._legL=d;const f=new be("RP.LegR");f.position.set(.125,.75,0),f.addComponent(new Te(n.leg,new Ge({albedo:Jo,roughness:.85}))),o.addChild(f),this._legR=f,t.add(o)}setTargetTransform(r,e,t,n,o){this._hasTarget||(this._curX=r,this._curY=e,this._curZ=t,this._curYaw=n,this._curPitch=o),this._tgtX=r,this._tgtY=e,this._tgtZ=t,this._tgtYaw=n,this._tgtPitch=o,this._hasTarget=!0}update(r){if(!this._hasTarget)return;const e=1-Math.exp(-12*r),t=this._tgtX-this._curX,n=this._tgtY-this._curY,o=this._tgtZ-this._curZ;this._curX+=t*e,this._curY+=n*e,this._curZ+=o*e,this._curYaw=Jc(this._curYaw,this._tgtYaw,e),this._curPitch+=(this._tgtPitch-this._curPitch)*e,this.root.position.set(this._curX,this._curY-1.625,this._curZ),this.root.rotation=me.fromAxisAngle(Kc,this._curYaw),this._head.rotation=me.fromAxisAngle(Tt,this._curPitch);const a=Math.hypot(t,o)/Math.max(r,.001),l=a>.3,c=l?Math.min(a*1.2,8):4;this._walkPhase+=r*c;const d=l?Math.sin(this._walkPhase)*.55:0;this._armL.rotation=me.fromAxisAngle(Tt,d),this._armR.rotation=me.fromAxisAngle(Tt,-d),this._legL.rotation=me.fromAxisAngle(Tt,-d),this._legR.rotation=me.fromAxisAngle(Tt,d)}headWorldPosition(r){return r.x=this.root.position.x,r.y=this.root.position.y+2.1,r.z=this.root.position.z,r}dispose(){this._scene.remove(this.root)}}const Kc=new j(0,1,0),Tt=new j(1,0,0);function Jc(u,r,e){let t=r-u;for(;t>Math.PI;)t-=2*Math.PI;for(;t<-Math.PI;)t+=2*Math.PI;return u+t*e}const Qo=64;class Qc{constructor(r){s(this,"_root");s(this,"_labels",new Map);const e=document.createElement("div");e.style.position="absolute",e.style.left="0",e.style.top="0",e.style.width="100%",e.style.height="100%",e.style.pointerEvents="none",e.style.overflow="hidden",r.appendChild(e),this._root=e}add(r,e){if(this._labels.has(r))return;const t=document.createElement("div");t.textContent=e,t.style.position="absolute",t.style.transform="translate(-50%, -100%)",t.style.padding="2px 6px",t.style.font="12px sans-serif",t.style.color="#fff",t.style.background="rgba(0,0,0,0.55)",t.style.border="1px solid rgba(255,255,255,0.2)",t.style.borderRadius="4px",t.style.whiteSpace="nowrap",t.style.userSelect="none",t.style.display="none",this._root.appendChild(t),this._labels.set(r,t)}remove(r){const e=this._labels.get(r);e!==void 0&&(e.remove(),this._labels.delete(r))}update(r,e,t,n,o){for(const[i,a]of this._labels){const l=o.get(i);if(l===void 0){a.style.display="none";continue}const c=l.x-e.x,d=l.y-e.y,f=l.z-e.z;if(c*c+d*d+f*f>Qo*Qo){a.style.display="none";continue}const h=r.transformVec4(new ze(l.x,l.y,l.z,1));if(h.w<=.001){a.style.display="none";continue}const _=h.x/h.w,m=h.y/h.w;if(_<-1||_>1||m<-1||m>1){a.style.display="none";continue}const b=(_*.5+.5)*t,v=(1-(m*.5+.5))*n;a.style.display="block",a.style.left=`${b}px`,a.style.top=`${v}px`}}}const or=1,eu="crafty",tu=1,tr="worlds";class mn{constructor(r){s(this,"_db");this._db=r}static open(){return new Promise((r,e)=>{const t=indexedDB.open(eu,tu);t.onupgradeneeded=()=>{const n=t.result;n.objectStoreNames.contains(tr)||n.createObjectStore(tr,{keyPath:"id"})},t.onsuccess=()=>r(new mn(t.result)),t.onerror=()=>e(t.error??new Error("IndexedDB open failed"))})}list(){return this._withStore("readonly",r=>new Promise((e,t)=>{const n=r.getAll();n.onsuccess=()=>{const o=n.result??[];o.sort((i,a)=>a.lastPlayedAt-i.lastPlayedAt),e(o)},n.onerror=()=>t(n.error??new Error("IndexedDB list failed"))}))}load(r){return this._withStore("readonly",e=>new Promise((t,n)=>{const o=e.get(r);o.onsuccess=()=>t(o.result??null),o.onerror=()=>n(o.error??new Error("IndexedDB load failed"))}))}save(r){return this._withStore("readwrite",e=>new Promise((t,n)=>{const o=e.put(r);o.onsuccess=()=>t(),o.onerror=()=>n(o.error??new Error("IndexedDB save failed"))}))}delete(r){return this._withStore("readwrite",e=>new Promise((t,n)=>{const o=e.delete(r);o.onsuccess=()=>t(),o.onerror=()=>n(o.error??new Error("IndexedDB delete failed"))}))}_withStore(r,e){const n=this._db.transaction(tr,r).objectStore(tr);return e(n)}}function ei(u,r){const e=Date.now();return{id:ru(),name:u,seed:r,createdAt:e,lastPlayedAt:e,edits:[],player:{x:64,y:80,z:64,yaw:0,pitch:0},sunAngle:Math.PI*.3,version:or}}function ru(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`}const nu=2,ou=20,iu=1e3/ou;class au{constructor(){s(this,"_ws",null);s(this,"_callbacks",{});s(this,"_lastTransformSend",0);s(this,"_pendingTransform",null);s(this,"_connected",!1);s(this,"_inGame",!1);s(this,"_pendingHello",null);s(this,"_pendingCreate",null);s(this,"_pendingJoin",null)}get connected(){return this._connected}setCallbacks(r){this._callbacks=r}connect(r,e,t){return new Promise((n,o)=>{const i=new WebSocket(r);this._ws=i,this._pendingHello={resolve:n,reject:o},i.addEventListener("open",()=>{this._send({t:"hello",playerKey:e,name:t,version:nu})}),i.addEventListener("message",a=>{let l;try{l=JSON.parse(typeof a.data=="string"?a.data:"")}catch{return}this._dispatch(l)}),i.addEventListener("error",()=>{this._failAllPending(new Error("WebSocket error"))}),i.addEventListener("close",()=>{this._connected=!1,this._inGame=!1,this._failAllPending(new Error("WebSocket closed"))})})}createWorld(r,e){return!this._connected||this._inGame?Promise.reject(new Error("createWorld requires lobby phase")):new Promise((t,n)=>{this._pendingCreate={resolve:t,reject:n},this._send({t:"create_world",name:r,seed:e})})}joinWorld(r){return!this._connected||this._inGame?Promise.reject(new Error("joinWorld requires lobby phase")):new Promise((e,t)=>{this._pendingJoin={resolve:e,reject:t},this._send({t:"join_world",worldId:r})})}sendTransform(r,e,t,n,o){if(!this._inGame)return;this._pendingTransform={x:r,y:e,z:t,yaw:n,pitch:o};const i=performance.now();if(i-this._lastTransformSend<iu)return;this._lastTransformSend=i;const a=this._pendingTransform;this._pendingTransform=null,this._send({t:"transform",x:a.x,y:a.y,z:a.z,yaw:a.yaw,pitch:a.pitch})}sendBlockPlace(r,e,t,n,o,i,a){this._inGame&&this._send({t:"block_place",x:r,y:e,z:t,fx:n,fy:o,fz:i,blockType:a})}sendBlockBreak(r,e,t){this._inGame&&this._send({t:"block_break",x:r,y:e,z:t})}_dispatch(r){var e,t,n,o,i,a,l,c,d,f;switch(r.t){case"world_list":if(this._pendingHello!==null){this._connected=!0,this._pendingHello.resolve(r.worlds),this._pendingHello=null;return}(t=(e=this._callbacks).onWorldList)==null||t.call(e,r.worlds);return;case"world_created":this._pendingCreate!==null&&(this._pendingCreate.resolve(r.world),this._pendingCreate=null);return;case"welcome":this._pendingJoin!==null&&(this._inGame=!0,this._pendingJoin.resolve({playerId:r.playerId,worldId:r.worldId,seed:r.seed,sunAngle:r.sunAngle,lastPosition:r.lastPosition,edits:r.edits,players:r.players}),this._pendingJoin=null);return;case"error":{const p=new Error(`${r.code}: ${r.message}`);if(this._pendingCreate!==null){this._pendingCreate.reject(p),this._pendingCreate=null;return}if(this._pendingJoin!==null){this._pendingJoin.reject(p),this._pendingJoin=null;return}if(this._pendingHello!==null){this._pendingHello.reject(p),this._pendingHello=null;return}console.warn("[crafty] server error:",p.message);return}case"player_join":(o=(n=this._callbacks).onPlayerJoin)==null||o.call(n,r.playerId,r.name);return;case"player_leave":(a=(i=this._callbacks).onPlayerLeave)==null||a.call(i,r.playerId);return;case"player_transform":(c=(l=this._callbacks).onPlayerTransform)==null||c.call(l,r.playerId,r.x,r.y,r.z,r.yaw,r.pitch);return;case"block_edit":(f=(d=this._callbacks).onBlockEdit)==null||f.call(d,r.edit);return}}_failAllPending(r){this._pendingHello!==null&&(this._pendingHello.reject(r),this._pendingHello=null),this._pendingCreate!==null&&(this._pendingCreate.reject(r),this._pendingCreate=null),this._pendingJoin!==null&&(this._pendingJoin.reject(r),this._pendingJoin=null)}_send(r){this._ws===null||this._ws.readyState!==WebSocket.OPEN||this._ws.send(JSON.stringify(r))}}const su=""+new URL("crafty-CP0F5VYA.png",import.meta.url).href,ti="crafty.playerName",rr="crafty.lastSeed",ri="crafty.serverUrl",ni="crafty.playerKey",Ir="ws://localhost:8787";function lu(){let u=localStorage.getItem(ni);return(u===null||u.length===0)&&(u=typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`,localStorage.setItem(ni,u)),u}async function cu(){let u=null,r=[];try{u=await mn.open(),r=await u.list()}catch(e){console.warn("[crafty] world storage unavailable — local worlds will not persist",e)}return new Promise(e=>{const t=document.createElement("div");t.style.cssText=["position:fixed","inset:0","z-index:200",`background:linear-gradient(rgba(128,128,128,0.05),rgba(128,128,128,0.35)),url(${su}) center/cover no-repeat #000`,"display:flex","align-items:center","justify-content:center","font-family:ui-monospace,monospace"].join(";"),document.body.appendChild(t);const n=document.createElement("div");n.style.cssText=["display:flex","flex-direction:column","align-items:stretch","gap:clamp(10px,2vh,18px)","padding:clamp(16px,4vh,36px) clamp(12px,4vw,44px)","background:rgba(82, 82, 82, 1.0)","border:1px solid rgba(255,255,255,0.12)","border-radius:12px","width:min(520px,calc(100vw - 24px))","box-sizing:border-box","max-height:min(600px,calc(100vh - 24px))","overflow-y:auto","box-shadow:0 0 55px rgba(255,255,255,0.8)"].join(";"),t.appendChild(n);const o=document.createElement("h1");o.textContent="CRAFTY",o.style.cssText=["margin:0 0 4px","text-align:center","font-size:clamp(28px,7vw,44px)","font-weight:900","color:#fff","letter-spacing:0.14em","text-shadow:0 0 32px rgba(100,200,255,0.4)"].join(";"),n.appendChild(o);const i=bt("Player name",vt({value:localStorage.getItem(ti)??"",placeholder:"Steve",maxLength:16}));n.appendChild(i.row);const a=document.createElement("div");a.style.cssText="display:flex;gap:0;border-bottom:1px solid rgba(255,255,255,0.12)",n.appendChild(a);const l=oi("Local"),c=oi("Network");a.appendChild(l),a.appendChild(c);const d=ai(),f=ai();n.appendChild(d),n.appendChild(f),d.appendChild(Mt("Saved worlds"));const p=document.createElement("div");p.style.cssText=["display:flex","flex-direction:column","gap:6px","max-height:clamp(120px,30vh,240px)","overflow-y:auto","padding:8px 4px 12px"].join(";"),d.appendChild(p);let h=r;function _(){if(p.replaceChildren(),h.length===0){const D=document.createElement("div");D.textContent=u===null?"Storage unavailable in this browser":"No saved worlds yet",D.style.cssText="color:rgba(255,255,255,0.85);font-size:12px;padding:8px 0",p.appendChild(D);return}for(const D of h)p.appendChild(uu(D,()=>m(D),()=>b(D)))}_();function m(D){ee({mode:"local",world:D,storage:u,playerName:ie()})}async function b(D){if(u!==null)try{await u.delete(D.id),h=h.filter(W=>W.id!==D.id),_()}catch(W){console.error("[crafty] delete failed",W)}}d.appendChild(Mt("New world"));const v=vt({value:"",placeholder:`World ${r.length+1}`,maxLength:32});d.appendChild(bt("Name",v).row);const y=vt({value:localStorage.getItem(rr)??"13",placeholder:"random"});d.appendChild(bt("Seed",y).row);const w=Or("Create"),S=document.createElement("div");S.style.cssText="color:#f88;font-size:12px;min-height:16px;text-align:right",d.appendChild(Dr(w,S));const x=lu();let k=null,C="",E=[];const I=document.createElement("div");I.style.cssText="display:flex;flex-direction:column;gap:10px",f.appendChild(I);const U=document.createElement("div");U.style.cssText="display:none;flex-direction:column;gap:10px",f.appendChild(U),I.appendChild(Mt("Server"));const g=vt({value:localStorage.getItem(ri)??Ir,placeholder:Ir});I.appendChild(bt("URL",g).row);const A=Or("Connect"),P=document.createElement("div");P.style.cssText="color:#f88;font-size:12px;min-height:16px;text-align:right",I.appendChild(Dr(A,P)),U.appendChild(Mt("Server worlds"));const T=document.createElement("div");T.style.cssText="color:rgba(255,255,255,0.6);font-size:11px;padding:0 0 4px;display:flex;align-items:center;justify-content:space-between;gap:8px";const B=document.createElement("span");T.appendChild(B);const N=document.createElement("button");N.textContent="Disconnect",N.style.cssText=["background:transparent","color:rgba(255,255,255,0.6)","border:1px solid rgba(255,255,255,0.25)","border-radius:4px","padding:2px 8px","font:11px ui-monospace,monospace","cursor:pointer"].join(";"),T.appendChild(N),U.appendChild(T);const G=document.createElement("div");G.style.cssText=["display:flex","flex-direction:column","gap:6px","max-height:200px","overflow-y:auto","padding:4px"].join(";"),U.appendChild(G),U.appendChild(Mt("New world"));const q=vt({value:"",placeholder:"World name",maxLength:32});U.appendChild(bt("Name",q).row);const O=vt({value:localStorage.getItem(rr)??"13",placeholder:"random"});U.appendChild(bt("Seed",O).row);const L=Or("Create"),F=document.createElement("div");F.style.cssText="color:#f88;font-size:12px;min-height:16px;text-align:right",U.appendChild(Dr(L,F));function z(){if(G.replaceChildren(),E.length===0){const D=document.createElement("div");D.textContent="No worlds on this server yet",D.style.cssText="color:rgba(255,255,255,0.85);font-size:12px;padding:8px 0",G.appendChild(D);return}for(const D of E)G.appendChild(du(D,()=>ae(D)))}async function ae(D){if(k!==null){F.style.color="rgba(255,255,255,0.92)",F.textContent=`joining "${D.name}"…`;try{const W=await k.joinWorld(D.id);ee({mode:"network",playerName:ie(),serverUrl:C,network:k,welcome:W,world:D})}catch(W){F.style.color="#f88",F.textContent=`join failed: ${W.message}`}}}L.addEventListener("click",async()=>{if(k===null)return;const D=K(O.value);O.value=String(D),localStorage.setItem(rr,String(D));const W=q.value.trim(),Q=W.length>0?W:`World ${E.length+1}`;L.disabled=!0,F.style.color="rgba(255,255,255,0.92)",F.textContent="creating…";try{const J=await k.createWorld(Q,D),ue=await k.joinWorld(J.id);ee({mode:"network",playerName:ie(),serverUrl:C,network:k,welcome:ue,world:J})}catch(J){F.style.color="#f88",F.textContent=`failed: ${J.message}`,L.disabled=!1}}),N.addEventListener("click",()=>{k=null,E=[],C="",U.style.display="none",I.style.display="flex",A.disabled=!1,P.textContent="",i.input.disabled=!1});function oe(D){const W=D==="local";ii(l,W),ii(c,!W),d.style.display=W?"flex":"none",f.style.display=W?"none":"flex"}l.addEventListener("click",()=>oe("local")),c.addEventListener("click",()=>oe("network")),oe("local");function ie(){const D=(i.input.value??"").trim().slice(0,16);return D.length>0?D:`player${Math.floor(Math.random()*1e3)}`}function K(D){const W=D.trim();if(W.length===0)return Math.floor(Math.random()*2147483647);const Q=Number(W);if(Number.isFinite(Q))return Math.floor(Q);let J=2166136261;for(let ue=0;ue<W.length;ue++)J=Math.imul(J^W.charCodeAt(ue),16777619)>>>0;return J&2147483647}function ee(D){localStorage.setItem(ti,ie()),t.remove(),e(D)}w.addEventListener("click",async()=>{const D=K(y.value);y.value=String(D),localStorage.setItem(rr,String(D));const W=v.value.trim(),Q=W.length>0?W:`World ${h.length+1}`;if(u===null){ee({mode:"local",world:ei(Q,D),storage:null,playerName:ie()});return}w.disabled=!0,S.style.color="rgba(255,255,255,0.92)",S.textContent="creating…";try{const J=ei(Q,D);await u.save(J),ee({mode:"local",world:J,storage:u,playerName:ie()})}catch(J){S.style.color="#f88",S.textContent=`failed: ${J.message}`,w.disabled=!1}}),A.addEventListener("click",async()=>{const D=g.value.trim()||Ir,W=ie();P.style.color="rgba(255,255,255,0.92)",P.textContent="connecting…",A.disabled=!0;const Q=new au;try{const J=await Q.connect(D,x,W);localStorage.setItem(ri,D),k=Q,C=D,E=J,i.input.disabled=!0,Q.setCallbacks({onWorldList:ue=>{E=ue,z()}}),B.textContent=D,I.style.display="none",U.style.display="flex",P.textContent="",z()}catch(J){P.style.color="#f88",P.textContent=`failed: ${J.message}`,A.disabled=!1}})})}function vt(u){const r=document.createElement("input");return r.type="text",u.value!==void 0&&(r.value=u.value),u.placeholder!==void 0&&(r.placeholder=u.placeholder),u.maxLength!==void 0&&(r.maxLength=u.maxLength),r.style.cssText=["flex:1","padding:8px 10px","background:rgba(0,0,0,0.55)","color:#fff","border:1px solid rgba(255,255,255,0.35)","border-radius:5px","font:13px ui-monospace,monospace","outline:none"].join(";"),r.addEventListener("focus",()=>{r.style.borderColor="#5f5"}),r.addEventListener("blur",()=>{r.style.borderColor="rgba(255,255,255,0.35)"}),r}function bt(u,r){const e=document.createElement("div");e.style.cssText="display:flex;align-items:center;gap:12px";const t=document.createElement("label");return t.textContent=u,t.style.cssText="min-width:96px;color:rgba(255,255,255,0.92);font-size:12px;letter-spacing:0.06em",e.appendChild(t),e.appendChild(r),{row:e,input:r}}function oi(u){const r=document.createElement("button");return r.textContent=u,r.style.cssText=["padding:10px 20px","background:transparent","color:rgba(255,255,255,0.8)","border:none","border-bottom:2px solid transparent","font:13px ui-monospace,monospace","letter-spacing:0.08em","cursor:pointer"].join(";"),r}function ii(u,r){u.style.color=r?"#9fff9f":"rgba(255,255,255,0.8)",u.style.borderBottomColor=r?"#9fff9f":"transparent"}function ai(){const u=document.createElement("div");return u.style.cssText="display:flex;flex-direction:column;gap:10px;padding:12px 0",u}function Mt(u){const r=document.createElement("div");return r.textContent=u,r.style.cssText="color:#fff;font-size:11px;letter-spacing:0.18em",r}function Or(u){const r=document.createElement("button");return r.textContent=u,r.style.cssText=["padding:10px 32px","background:#1a3a1a","color:#5f5","border:1px solid #5f5","border-radius:6px","font:13px ui-monospace,monospace","letter-spacing:0.06em","cursor:pointer","transition:background 0.15s"].join(";"),r.addEventListener("mouseenter",()=>{r.disabled||(r.style.background="#243e24")}),r.addEventListener("mouseleave",()=>{r.style.background="#1a3a1a"}),r}function Dr(...u){const r=document.createElement("div");r.style.cssText="display:flex;align-items:center;gap:12px;justify-content:flex-end;padding-top:8px";for(const e of u)r.appendChild(e);return r}function uu(u,r,e){const t=document.createElement("div");t.style.cssText=["display:flex","align-items:center","gap:10px","padding:6px 8px","border-radius:6px","background:rgba(0,0,0,0.35)","border:1px solid rgba(255,255,255,0.08)","cursor:pointer","transition:background 0.12s"].join(";"),t.addEventListener("mouseenter",()=>{t.style.background="rgba(255,255,255,0.08)"}),t.addEventListener("mouseleave",()=>{t.style.background="rgba(0,0,0,0.35)"}),t.addEventListener("click",d=>{d.target.dataset.role!=="delete"&&r()});const n=document.createElement("div");if(n.style.cssText=["width:64px","height:36px","flex-shrink:0","border-radius:4px","overflow:hidden","background:linear-gradient(135deg,#1f3a4a,#0a1622)"].join(";"),u.screenshot!==void 0){const d=document.createElement("img");d.src=URL.createObjectURL(u.screenshot),d.style.cssText="width:100%;height:100%;object-fit:cover;display:block",d.addEventListener("load",()=>URL.revokeObjectURL(d.src)),n.appendChild(d)}t.appendChild(n);const o=document.createElement("div");o.style.cssText="flex:1;display:flex;flex-direction:column;gap:2px;min-width:0";const i=document.createElement("div");i.textContent=u.name,i.style.cssText="color:#fff;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis";const a=document.createElement("div");a.textContent=Bi(Date.now()-u.lastPlayedAt),a.style.cssText="color:rgba(255,255,255,0.55);font-size:11px",o.appendChild(i),o.appendChild(a),t.appendChild(o);const l=document.createElement("button");l.dataset.role="delete",l.textContent="×",l.title="Delete",l.style.cssText=["background:transparent","color:rgba(255,255,255,0.45)","border:1px solid rgba(255,255,255,0.18)","border-radius:4px","padding:2px 8px","font:13px ui-monospace,monospace","cursor:pointer"].join(";");let c=!1;return l.addEventListener("click",d=>{if(d.stopPropagation(),!c){c=!0,l.textContent="Delete?",l.style.color="#f88",l.style.borderColor="#f88";const f=()=>{c=!1,l.textContent="×",l.style.color="rgba(255,255,255,0.45)",l.style.borderColor="rgba(255,255,255,0.18)",document.removeEventListener("click",f,!0)};setTimeout(()=>document.addEventListener("click",f,!0),0);return}e()}),t.appendChild(l),t}function du(u,r){const e=document.createElement("div");e.style.cssText=["display:flex","align-items:center","gap:10px","padding:8px 10px","border-radius:6px","background:rgba(0,0,0,0.35)","border:1px solid rgba(255,255,255,0.08)","cursor:pointer","transition:background 0.12s"].join(";"),e.addEventListener("mouseenter",()=>{e.style.background="rgba(255,255,255,0.08)"}),e.addEventListener("mouseleave",()=>{e.style.background="rgba(0,0,0,0.35)"}),e.addEventListener("click",r);const t=document.createElement("div");t.style.cssText="flex:1;display:flex;flex-direction:column;gap:2px;min-width:0";const n=document.createElement("div");n.textContent=u.name,n.style.cssText="color:#fff;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis";const o=document.createElement("div"),i=u.playerCount===1?"1 player":`${u.playerCount} players`;return o.textContent=`${i}  ·  ${u.editCount} edit${u.editCount===1?"":"s"}  ·  ${Bi(Date.now()-u.lastModifiedAt)}`,o.style.cssText="color:rgba(255,255,255,0.55);font-size:11px",t.appendChild(n),t.appendChild(o),e.appendChild(t),e}function Bi(u){if(u<0)return"just now";const r=Math.floor(u/1e3);if(r<60)return"just now";const e=Math.floor(r/60);if(e<60)return`${e} minute${e===1?"":"s"} ago`;const t=Math.floor(e/60);if(t<24)return`${t} hour${t===1?"":"s"} ago`;const n=Math.floor(t/24);if(n<30)return`${n} day${n===1?"":"s"} ago`;const o=Math.floor(n/30);return`${o} month${o===1?"":"s"} ago`}const fu={ssao:!0,ssgi:!1,shadows:!0,dof:!0,bloom:!0,godrays:!0,fog:!1,aces:!0,ao_dbg:!1,shd_dbg:!1,chunk_dbg:!1,hdr:!0,auto_exp:!1,rain:!0,clouds:!0},pu="modulepreload",hu=function(u,r){return new URL(u,r).href},si={},_u=function(r,e,t){let n=Promise.resolve();if(e&&e.length>0){const i=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),l=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));n=Promise.allSettled(e.map(c=>{if(c=hu(c,t),c in si)return;si[c]=!0;const d=c.endsWith(".css"),f=d?'[rel="stylesheet"]':"";if(!!t)for(let _=i.length-1;_>=0;_--){const m=i[_];if(m.href===c&&(!d||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${c}"]${f}`))return;const h=document.createElement("link");if(h.rel=d?"stylesheet":pu,d||(h.as="script"),h.crossOrigin="",h.href=c,l&&h.setAttribute("nonce",l),document.head.appendChild(h),d)return new Promise((_,m)=>{h.addEventListener("load",_),h.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${c}`)))})}))}function o(i){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=i,window.dispatchEvent(a),!a.defaultPrevented)throw i}return n.then(i=>{for(const a of i||[])a.status==="rejected"&&o(a.reason);return r().catch(o)})},mu={emitter:{maxParticles:8e4,spawnRate:24e3,lifetime:[2,3.5],shape:{kind:"box",halfExtents:[35,.1,35]},initialSpeed:[0,0],initialColor:[.75,.88,1,.55],initialSize:[.005,.009],roughness:.1,metallic:0},modifiers:[{type:"gravity",strength:9},{type:"drag",coefficient:.05},{type:"color_over_lifetime",startColor:[.75,.88,1,.55],endColor:[.75,.88,1,0]},{type:"block_collision"}],renderer:{type:"sprites",blendMode:"alpha",billboard:"velocity",renderTarget:"hdr"}},gu={emitter:{maxParticles:8e4,spawnRate:1500,lifetime:[30,105],shape:{kind:"box",halfExtents:[35,.1,35]},initialSpeed:[0,0],initialColor:[.92,.96,1,.85],initialSize:[.025,.055],roughness:.1,metallic:0},modifiers:[{type:"gravity",strength:1.5},{type:"drag",coefficient:.8},{type:"curl_noise",scale:1,strength:1,timeScale:1,octaves:1},{type:"block_collision"}],renderer:{type:"sprites",blendMode:"alpha",billboard:"camera",renderTarget:"hdr"}};async function vu(u,r,e,t,n,o,i,a,l,c,d){let f,p,h,_;if(r.worldGeometryPass){const F=ir.create(u);r.worldGeometryPass.updateGBuffer(F),f=F,p=r.worldGeometryPass,h=r.worldShadowPass,_=r.waterPass}else{f=ir.create(u),p=an.create(u,f,t),h=dn.create(u,r.shadowPass.shadowMapArrayViews,3,t);const F=u.device.createTexture({label:"WaterDummyHDR",size:{width:u.width,height:u.height},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),z=u.device.createTexture({label:"WaterDummyDepth",size:{width:u.width,height:u.height},format:"depth32float",usage:GPUTextureUsage.TEXTURE_BINDING}),ae=F.createView(),oe=z.createView();_=ut.create(u,F,ae,oe,n,o,i);const ie=(D,W)=>{d.set(D,W),p.addChunk(D,W),h.addChunk(D,W),_.addChunk(D,W)},K=(D,W)=>{d.set(D,W),p.updateChunk(D,W),h.updateChunk(D,W),_.updateChunk(D,W)},ee=D=>{d.delete(D),p.removeChunk(D),h.removeChunk(D),_.removeChunk(D)};c.onChunkAdded=ie,c.onChunkUpdated=K,c.onChunkRemoved=ee;for(const[D,W]of d)_.addChunk(D,W)}const m=on.create(u,f),b=ln.create(u,f),v=e.clouds?Qr.create(u,l):null,y=$r.create(u,f,r.shadowPass,b.aoView,v==null?void 0:v.shadowView,a),w=e.godrays?rn.create(u,f,r.shadowPass,y.hdrView,y.cameraBuffer,y.lightBuffer,l):null,S=Zr.create(u,y.hdrView),x=e.clouds?Jr.create(u,y.hdrView,f.depthView,l):null;u.pushInitErrorScope();const k=un.create(u);await u.popInitErrorScope("PointSpotShadowPass");const C=fn.create(u,f,k,y.hdrView),E=en.create(u,y,f),I=cn.create(u,f,E.historyView);y.updateSSGI(I.resultView),r.waterPass,_.updateRenderTargets(y.hdrTexture,y.hdrView,f.depthView,n);let U=null;const g=e.dof?(U=sn.create(u,E.resolvedView,f.depthView),U.resultView):E.resolvedView;let A=null;const P=e.bloom?(A=tn.create(u,g),A.resultView):g,T=Kr.create(u,P,f.depthView),B=Vr.create(u,y.hdrTexture);B.enabled=e.auto_exp;const N=nn.create(u,P,b.aoView,f.depthView,y.cameraBuffer,y.lightBuffer,B.exposureBuffer);N.depthFogEnabled=e.fog;const G=r.currentWeatherEffect??Ye.None;let q=null;if(e.rain&&G!==Ye.None){const F=G===Ye.Snow?gu:mu;q=pn.create(u,F,f,y.hdrView)}const{RenderGraph:O}=await _u(async()=>{const{RenderGraph:F}=await import("./index-DQT4ky7t.js");return{RenderGraph:F}},[],import.meta.url),L=new O;return L.addPass(r.shadowPass),v&&L.addPass(v),L.addPass(h),L.addPass(k),L.addPass(m),L.addPass(p),L.addPass(b),L.addPass(I),x?L.addPass(x):L.addPass(S),L.addPass(y),L.addPass(C),L.addPass(_),w&&L.addPass(w),q&&L.addPass(q),L.addPass(E),U&&L.addPass(U),A&&L.addPass(A),L.addPass(T),L.addPass(B),L.addPass(N),{shadowPass:r.shadowPass,gbuffer:f,geometryPass:m,worldGeometryPass:p,worldShadowPass:h,waterPass:_,ssaoPass:b,ssgiPass:I,lightingPass:y,atmospherePass:S,pointSpotShadowPass:k,pointSpotLightPass:C,taaPass:E,dofPass:U,bloomPass:A,rainPass:q,godrayPass:w,cloudPass:x,cloudShadowPass:v,blockHighlightPass:T,autoExposurePass:B,compositePass:N,graph:L,prevViewProj:null,currentWeatherEffect:G}}function li(u,r){let e=0,t=1;for(;u>0;)t/=r,e+=t*(u%r),u=Math.floor(u/r);return e}function bu(u,r,e){const t=u.clone();for(let n=0;n<4;n++)t.data[n*4+0]+=r*t.data[n*4+3],t.data[n*4+1]+=e*t.data[n*4+3];return t}async function yu(){const u=document.getElementById("canvas");if(!u)throw new Error("No canvas element");const r=await cu(),e=r.playerName,t=r.mode==="network"?r.network:null,n=r.mode==="network"?r.welcome:null,o=r.mode==="local"?r.world:null,i=r.mode==="local"?r.storage:null;if(n!==null)console.log(`[crafty] connected as player ${n.playerId} "${e}" (${n.players.length} other(s) online, ${n.edits.length} replay edits)`);else if(o!==null){if((o.version??0)<1){let H=0;for(const te of o.edits)te.kind==="place"&&(te.x-=te.fx??0,te.y-=te.fy??0,te.z-=te.fz??0,H++);o.version=or,console.log(`[crafty] migrated saved world to v${or} (${H} place edits rewritten)`)}console.log(`[crafty] starting local world "${o.name}" (seed=${o.seed}, ${o.edits.length} edits to replay)`)}const a=await jr.create(u,{enableErrorHandling:!1}),{device:l}=a,c=await Ys(l,js(await(await fetch(Fi)).arrayBuffer())),d=await Hs(l,c.gpuTexture),f=Cs(l),p=await hn.load(l,Sr,Hi,Wi,ji),h=await Ne.fromUrl(l,qi),_=await Ne.fromUrl(l,Yi),m=await Ne.fromUrl(l,Xi,{resizeWidth:256,resizeHeight:256,usage:7}),b=rl(Sr),v=sl(),y=al(u,v.reticle),w=(n==null?void 0:n.seed)??(o==null?void 0:o.seed)??13,S=new zr(w);bl()&&(S.renderDistanceH=4,S.renderDistanceV=3);const x=new Map,k=new Zi,C=new be("Sun"),E=C.addComponent(new di(new j(.3,-1,.5),j.one(),6,3));k.add(C);const I=ll(u,k,S,a.width,a.height,m.gpuTexture,v.reticle,b.element),{cameraGO:U,camera:g,player:A,freeCamera:P}=I;A.onStep=M=>{const H=U.position;T.playStep(M,H,.5)},A.onLand=(M,H)=>{const te=U.position;te.y-=1.62,T.playLand(M,te,H)};const T=new Gc,B=j.UP,N=pl();hl(u,N,S,()=>b.getSelected(),k);let G=!1;function q(){v.fps.style.display=G?"":"none",v.stats.style.display=G?"":"none",v.biome.style.display=G?"":"none",v.pos.style.display=G?"":"none",v.weather.style.display=G?"":"none"}q(),window.addEventListener("keydown",M=>{M.code==="KeyX"&&(G=!G,q())});const O=()=>{T.init(),u.removeEventListener("click",O),u.removeEventListener("touchend",O)};u.addEventListener("click",O),u.addEventListener("touchend",O),vl(u,{player:A,camera:P,getActive:()=>I.isPlayerMode()?"player":"camera",world:S,scene:k,blockInteraction:N,getSelectedBlock:()=>b.getSelected(),onLookDoubleTap:()=>I.toggleController(),onMenu:()=>y.open(),onFlashlightToggle:()=>{I.setFlashlightEnabled(!I.isFlashlightEnabled())}},()=>{A.usePointerLock=!1,A.autoJump=!0,P.usePointerLock=!1});const L={...fu},F=Xr.create(a,3);let z={shadowPass:F,currentWeatherEffect:Ye.None};async function ae(){z=await vu(a,z,L,p,c,h,_,d,f,S,x),g.aspect=a.width/a.height}await ae(),jc(S,k,{duckBody:Ro(l),duckHead:No(l),duckBill:Io(l),ducklingBody:Ro(l,.5),ducklingHead:No(l,.5),ducklingBill:Io(l,.5),pigBody:Oo(l,1),pigHead:Do(l,1),pigSnout:Vo(l,1),babyPigBody:Oo(l,.55),babyPigHead:Do(l,.55),babyPigSnout:Vo(l,.55)});const oe=16,ie=16,K=16,ee=(M,H,te)=>`${Math.floor(M/oe)},${Math.floor(H/ie)},${Math.floor(te/K)}`,D=new Map;function W(M){return M.kind==="place"?[M.x+(M.fx??0),M.y+(M.fy??0),M.z+(M.fz??0)]:[M.x,M.y,M.z]}function Q(M,H){return!(H.kind==="break"&&M.kind==="place")}function J(M){const[H,te,Me]=W(M),we=ee(H,te,Me);let xe=D.get(we);xe===void 0&&(xe=[],D.set(we,xe));for(let Ue=xe.length-1;Ue>=0;Ue--){const[ht,at,Bt]=W(xe[Ue]);if(ht===H&&at===te&&Bt===Me){Q(M,xe[Ue])&&xe.splice(Ue,1);break}}xe.push(M)}if(n!==null)for(const M of n.edits)J(M);if(o!==null)for(const M of o.edits)J(M);const ue=S.onChunkAdded;S.onChunkAdded=(M,H)=>{ue==null||ue(M,H);const te=`${Math.floor(M.globalPosition.x/oe)},${Math.floor(M.globalPosition.y/ie)},${Math.floor(M.globalPosition.z/K)}`,Me=D.get(te);if(Me!==void 0)for(const we of Me)Fo(we.kind==="place"?{kind:"place",x:we.x,y:we.y,z:we.z,fx:we.fx??0,fy:we.fy??0,fz:we.fz??0,blockType:we.blockType}:{kind:"break",x:we.x,y:we.y,z:we.z},S,k)};const ce=new Map,ge=Xc(l),$=new Qc(u.parentElement??document.body),de=new Map;function ye(M,H){if(ce.has(M))return;const te=new Zc(M,H,k,ge);ce.set(M,te),$.add(M,H),de.set(M,new j)}function Re(M){const H=ce.get(M);H!==void 0&&(H.dispose(),ce.delete(M)),$.remove(M),de.delete(M)}if(n!==null)for(const M of n.players)ye(M.playerId,M.name),ce.get(M.playerId).setTargetTransform(M.x,M.y,M.z,M.yaw,M.pitch);t!==null?(t.setCallbacks({onPlayerJoin:(M,H)=>{console.log(`[crafty] +${H} (#${M})`),ye(M,H)},onPlayerLeave:M=>{console.log(`[crafty] -#${M}`),Re(M)},onPlayerTransform:(M,H,te,Me,we,xe)=>{const Ue=ce.get(M);Ue!==void 0&&Ue.setTargetTransform(H,te,Me,we,xe)},onBlockEdit:M=>{J(M),Fo(M.kind==="place"?{kind:"place",x:M.x,y:M.y,z:M.z,fx:M.fx??0,fy:M.fy??0,fz:M.fz??0,blockType:M.blockType}:{kind:"break",x:M.x,y:M.y,z:M.z},S,k)}}),N.onLocalEdit=M=>{M.kind==="place"?(J({kind:"place",x:M.x,y:M.y,z:M.z,blockType:M.blockType,fx:M.fx,fy:M.fy,fz:M.fz}),t.sendBlockPlace(M.x,M.y,M.z,M.fx,M.fy,M.fz,M.blockType)):(J({kind:"break",x:M.x,y:M.y,z:M.z,blockType:0}),t.sendBlockBreak(M.x,M.y,M.z))}):o!==null&&(N.onLocalEdit=M=>{const H=M.kind==="place"?{kind:"place",x:M.x,y:M.y,z:M.z,blockType:M.blockType,fx:M.fx,fy:M.fy,fz:M.fz}:{kind:"break",x:M.x,y:M.y,z:M.z,blockType:0},[te,Me,we]=W(H);for(let xe=o.edits.length-1;xe>=0;xe--){const[Ue,ht,at]=W(o.edits[xe]);if(Ue===te&&ht===Me&&at===we){Q(H,o.edits[xe])&&o.edits.splice(xe,1);break}}o.edits.push(H),J(H),Xe=!0});let Xe=!1;const Ie=(n==null?void 0:n.lastPosition)??(o!==null&&o.lastPlayedAt>o.createdAt?o.player:null);if(Ie!==null){U.position.set(Ie.x,Ie.y,Ie.z),A.yaw=Ie.yaw,A.pitch=Ie.pitch,A.velY=0;const M=S.chunksPerFrame;S.chunksPerFrame=200,S.update(new j(Ie.x,Ie.y,Ie.z),0),S.chunksPerFrame=M}else{const M=U.position.x,H=U.position.z,te=S.chunksPerFrame;S.chunksPerFrame=200,S.update(new j(M,50,H),0),S.chunksPerFrame=te;const Me=S.getTopBlockY(M,H,200);Me>0&&(U.position.y=Me+1.62,A.velY=0)}const gn=document.createElement("div");gn.style.cssText="width:100%;height:1px;background:rgba(255,255,255,0.12)",y.card.appendChild(gn);const Si="background:rgba(255,255,255,0.75);color:#000;border-bottom-color:rgba(100,200,255,0.6)",Pi="background:transparent;color:#000;border-bottom-color:transparent",Ct=document.createElement("div");Ct.style.cssText="display:flex;gap:0;width:100%;border-bottom:1px solid rgba(255,255,255,0.1)",y.card.appendChild(Ct);const Fe=document.createElement("button");Fe.textContent="Inventory",Fe.style.cssText=["padding:8px 24px","font-size:13px","font-family:ui-monospace,monospace","border:none","border-bottom:2px solid transparent","cursor:pointer","letter-spacing:0.06em","transition:background 0.15s","border-radius:6px 6px 0 0",Si].join(";"),Ct.appendChild(Fe);const He=document.createElement("button");He.textContent="Settings",He.style.cssText=["padding:8px 24px","font-size:13px","font-family:ui-monospace,monospace","border:none","border-bottom:2px solid transparent","cursor:pointer","letter-spacing:0.06em","transition:background 0.15s","border-radius:6px 6px 0 0",Pi].join(";"),Ct.appendChild(He);const Lt=document.createElement("div");Lt.style.cssText="display:flex;flex-direction:column;align-items:center;gap:12px;width:100%",y.card.appendChild(Lt);const Rt=document.createElement("div");Rt.style.cssText="display:none;flex-direction:column;align-items:center;gap:10px;width:100%",y.card.appendChild(Rt);function vn(M){const H=M==="inv";Lt.style.display=H?"flex":"none",Rt.style.display=H?"none":"flex",Fe.style.cssText=Fe.style.cssText.replace(/background:[^;]+;/,H?"background:rgba(255,255,255,0.75);":"background:transparent;"),Fe.style.cssText=Fe.style.cssText.replace(/color:[^;]+;/,"color:#000;"),Fe.style.borderBottomColor=H?"rgba(100,200,255,0.6)":"transparent",He.style.cssText=He.style.cssText.replace(/background:[^;]+;/,H?"background:transparent;":"background:rgba(255,255,255,0.72);"),He.style.cssText=He.style.cssText.replace(/color:[^;]+;/,"color:#000;"),He.style.borderBottomColor=H?"transparent":"rgba(100,200,255,0.6)"}Fe.addEventListener("click",()=>vn("inv")),He.addEventListener("click",()=>vn("set"));const Gi=ol(Lt,Sr,b.slots,()=>b.refresh(),b.getSelectedSlot,b.setSelectedSlot);il(L,async M=>{if(M!=="ssao"&&M!=="ssgi"&&M!=="shadows"&&M!=="aces"&&M!=="ao_dbg"&&M!=="shd_dbg"){if(M==="chunk_dbg"){z.worldGeometryPass.setDebugChunks(L.chunk_dbg);return}if(M!=="hdr"){if(M==="auto_exp"){z.autoExposurePass.enabled=L.auto_exp;return}if(M==="fog"){z.compositePass.depthFogEnabled=L.fog;return}if(M==="rain"){await ae();return}if(M==="clouds"){await ae();return}await ae()}}},Rt),b.setOnSelectionChanged(Gi.refreshSlotHighlight);const We=document.createElement("button");We.textContent="Quit to Title",We.style.cssText=["padding:8px 28px","font-size:13px","font-family:ui-monospace,monospace","background: #3a1a1a","color:rgb(255,251,251)","border:1px solid #f88","border-radius:6px","cursor:pointer","letter-spacing:0.06em","transition:background 0.15s","margin-top:12px"].join(";"),We.addEventListener("mouseenter",()=>{We.style.background="#4a2424"}),We.addEventListener("mouseleave",()=>{We.style.background="#3a1a1a"});const bn=()=>{document.pointerLockElement===u&&document.exitPointerLock(),location.reload()};We.addEventListener("click",bn),We.addEventListener("touchend",M=>{M.preventDefault(),bn()},{passive:!1}),y.card.insertBefore(We,y.card.children[2]),new ResizeObserver(async()=>{const M=Math.max(1,Math.round(u.clientWidth*devicePixelRatio)),H=Math.max(1,Math.round(u.clientHeight*devicePixelRatio));M===u.width&&H===u.height||(u.width=M,u.height=H,await ae())}).observe(u);let yn=0,fr=0,wn=-1/0,ft=(n==null?void 0:n.sunAngle)??(o==null?void 0:o.sunAngle)??Math.PI*.3,pr=0,xn=0,Bn=0,Sn=0;const Pn=S.getBiomeAt(U.position.x,U.position.y,U.position.z);let pt=Yo(Pn),xt=Xo(),Nt=qo(pt);const Gn=ko(Pn);let hr=Gn.cloudBase,_r=Gn.cloudTop;window.addEventListener("keydown",M=>{M.code==="KeyO"&&(xt=0)});const mr=new Yc,$e=new j(0,0,-1),It=new se([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),Ti=5e3,Mi=3e4,Tn=.5,Ei=.005;let Mn=performance.now(),En=-1/0,An=U.position.x,Un=U.position.y,kn=U.position.z,Cn=ft,gr=!1;async function Ai(){try{const M=await createImageBitmap(u,{resizeWidth:160,resizeHeight:90,resizeQuality:"medium"}),H=new OffscreenCanvas(160,90),te=H.getContext("2d");return te===null?null:(te.drawImage(M,0,0),await H.convertToBlob({type:"image/jpeg",quality:.7}))}catch(M){return console.warn("[crafty] screenshot capture failed",M),null}}function Ln(M){if(o===null||i===null||gr)return;o.player.x=U.position.x,o.player.y=U.position.y,o.player.z=U.position.z,o.player.yaw=A.yaw,o.player.pitch=A.pitch,o.sunAngle=ft,o.lastPlayedAt=Date.now(),o.version=or,An=U.position.x,Un=U.position.y,kn=U.position.z,Cn=ft,Xe=!1,gr=!0;const H=()=>{i.save(o).catch(te=>{console.error("[crafty] save failed",te)}).finally(()=>{gr=!1})};M?Ai().then(te=>{te!==null&&(o.screenshot=te),En=performance.now(),H()}):H()}if(o!==null&&i!==null){const M=()=>{Xe&&Ln(!1)};window.addEventListener("beforeunload",M),window.addEventListener("pagehide",M),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&M()})}async function Rn(M){var Xn,$n,Zn;a.pushPassErrorScope("frame");const H=Math.min((M-yn)/1e3,.1);yn=M;const te=M-wn>=1e3;te&&(wn=M),H>0&&(fr+=(1/H-fr)*.1),ft+=H*.01,pr+=H,Bn+=H*1.5,Sn+=H*.5;const Me=.65,we=(ft%(2*Math.PI)+2*Math.PI)%(2*Math.PI),xe=Me*2*Math.PI,Ue=we<xe?we/xe*Math.PI:Math.PI+(we-xe)/(2*Math.PI-xe)*Math.PI,ht=Math.sin(Ue),at=.25,Bt=-ht,vr=Math.cos(Ue),br=Math.sqrt(at*at+Bt*Bt+vr*vr);E.direction.set(at/br,Bt/br,vr/br);const yr=ht;E.intensity=Math.max(0,yr)*6;const Nn=Math.max(0,yr);E.color.set(1,.8+.2*Nn,.6+.4*Nn),I.isPlayerMode()?A.update(U,H):P.update(U,H),cl(M/1e3),ul(M/1e3);const Z=g.position();{const pe=I.isPlayerMode()?A.yaw:P.yaw,ke=I.isPlayerMode()?A.pitch:P.pitch,Ke=Math.cos(ke);$e.x=-Math.sin(pe)*Ke,$e.y=-Math.sin(ke),$e.z=-Math.cos(pe)*Ke,T.updateListener(Z,$e,B)}wt.playerPos.x=Z.x,wt.playerPos.y=Z.y,wt.playerPos.z=Z.z,t!==null&&t.connected&&t.sendTransform(Z.x,Z.y,Z.z,A.yaw,A.pitch);for(const pe of ce.values())pe.update(H);k.update(H),S.update(Z,H);const wr=S.getBiomeAt(Z.x,Z.y,Z.z);if(xt-=H,xt<=0){pt=Yo(wr),xt=Xo();const pe=Uc(pt);pe!==z.currentWeatherEffect&&(z.currentWeatherEffect=pe,await ae());const ke=kc(pt);z.rainPass&&ke>0&&z.rainPass.setSpawnRate(ke)}const Ui=qo(pt);Nt+=(Ui-Nt)*Math.min(1,.3*H);const In=ko(wr);if(hr+=(In.cloudBase-hr)*Math.min(1,.3*H),_r+=(In.cloudTop-_r)*Math.min(1,.3*H),te){v.fps.textContent=`${fr.toFixed(0)} fps`;const pe=(z.worldGeometryPass.triangles/1e3).toFixed(1);v.stats.textContent=`${z.worldGeometryPass.drawCalls} draws  ${pe}k tris
${S.chunkCount} chunks  ${S.pendingChunks} pending`,v.biome.textContent=Be[wr],v.weather.textContent=`${Ac(pt)}
clouds: ${Nt.toFixed(2)}
next: ${xt.toFixed(0)}s`,v.pos.textContent=`X: ${Z.x.toFixed(1)}  Y: ${Z.y.toFixed(1)}  Z: ${Z.z.toFixed(1)}`}const On=xn%16+1,ki=(li(On,2)-.5)*(2/a.width),Ci=(li(On,3)-.5)*(2/a.height),Oe=g.viewProjectionMatrix(),Dn=bu(Oe,ki,Ci),Ze=g.viewMatrix(),je=g.projectionMatrix(),De=Oe.invert(),Vn=je.invert(),zn=E.computeCascadeMatrices(g,128),Fn=k.collectMeshRenderers(),Li=Fn.map(pe=>{const ke=pe.gameObject.localToWorld();return{mesh:pe.mesh,modelMatrix:ke,normalMatrix:ke.normalMatrix(),material:pe.material}}),Hn=Fn.filter(pe=>pe.castShadow).map(pe=>({mesh:pe.mesh,modelMatrix:pe.gameObject.localToWorld()}));F.setSceneSnapshot(Hn),F.updateScene(k,g,E,128),z.worldShadowPass.enabled=E.intensity>0,z.worldShadowPass.update(a,zn,Z.x,Z.z);const Ot=Math.max(0,yr),Ri=[.02+.38*Ot,.03+.52*Ot,.05+.65*Ot],xr={cloudBase:hr,cloudTop:_r,coverage:Nt,density:4,windOffset:[Bn,Sn],anisotropy:.85,extinction:.25,ambientColor:Ri,exposure:1};z.cloudShadowPass&&z.cloudShadowPass.update(a,xr,[Z.x,Z.z],128),(Xn=z.godrayPass)==null||Xn.updateCloudDensity(a,xr),z.cloudPass&&(z.cloudPass.updateCamera(a,De,Z,g.near,g.far),z.cloudPass.updateLight(a,E.direction,E.color,E.intensity),z.cloudPass.updateSettings(a,xr));const Wn=k.getComponents(Wr),jn=k.getComponents(fi);z.pointSpotShadowPass.update(Wn,jn,Hn),z.pointSpotLightPass.updateCamera(a,Ze,je,Oe,De,Z,g.near,g.far),z.pointSpotLightPass.updateLights(a,Wn,jn),z.atmospherePass.update(a,De,Z,E.direction),z.geometryPass.setDrawItems(Li),z.geometryPass.updateCamera(a,Ze,je,Dn,De,Z,g.near,g.far),z.worldGeometryPass.updateCamera(a,Ze,je,Dn,De,Z,g.near,g.far),z.waterPass.updateCamera(a,Ze,je,Oe,De,Z,g.near,g.far),z.waterPass.updateTime(a,pr,Math.max(.01,Ot)),z.lightingPass.updateCamera(a,Ze,je,Oe,De,Z,g.near,g.far),z.lightingPass.updateLight(a,E.direction,E.color,E.intensity,zn,L.shadows,L.shd_dbg),z.lightingPass.updateCloudShadow(a,z.cloudShadowPass?Z.x:0,z.cloudShadowPass?Z.z:0,128),z.ssaoPass.updateCamera(a,Ze,je,Vn),z.ssaoPass.updateParams(a,1,.005,L.ssao?2:0),z.ssgiPass.enabled=L.ssgi,z.ssgiPass.updateSettings({strength:L.ssgi?1:0}),L.ssgi&&z.ssgiPass.updateCamera(a,Ze,je,Vn,De,z.prevViewProj??Oe,Z);const qn=Math.cos(A.pitch);$e.x=-Math.sin(A.yaw)*qn,$e.y=-Math.sin(A.pitch),$e.z=-Math.cos(A.yaw)*qn;const Dt=S.getBlockByRay(Z,$e,16),Yn=!!(Dt&&Dt.position.sub(Z).length()<=6);N.targetBlock=Yn?Dt.position:null,N.targetHit=Yn?Dt:null;const Ni=N.targetBlock&&!_e(S.getBlockType(N.targetBlock.x,N.targetBlock.y,N.targetBlock.z))?N.targetBlock:null;if(z.blockHighlightPass.setCrackStage(N.crackStage),z.blockHighlightPass.update(a,Oe,Ni),_l(H,M,N,S,()=>b.getSelected(),k),z.rainPass){mr.update(Z.x,Z.z,S),z.rainPass.updateHeightmap(a,mr.data,Z.x,Z.z,mr.extent);const pe=z.currentWeatherEffect===Ye.Snow?20:8;It.data[12]=Z.x,It.data[13]=Z.y+pe,It.data[14]=Z.z,z.rainPass.update(a,H,Ze,je,Oe,De,Z,g.near,g.far,It)}($n=z.dofPass)==null||$n.updateParams(a,8,75,3,g.near,g.far),(Zn=z.godrayPass)==null||Zn.updateParams(a);const Ii=_e(S.getBlockType(Math.floor(Z.x),Math.floor(Z.y),Math.floor(Z.z))),Oi={x:-E.direction.x,y:-E.direction.y,z:-E.direction.z};if(z.compositePass.updateParams(a,Ii,pr,L.aces,L.ao_dbg,L.hdr),z.compositePass.updateStars(a,De,Z,Oi),z.autoExposurePass.update(a,H),z.taaPass.updateCamera(a,De,z.prevViewProj??Oe),ce.size>0){for(const[pe,ke]of ce){const Ke=de.get(pe);Ke!==void 0&&ke.headWorldPosition(Ke)}$.update(Oe,Z,u.clientWidth,u.clientHeight,de)}if(z.prevViewProj=Oe,xn++,await z.graph.execute(a),await a.popPassErrorScope("frame"),o!==null&&i!==null){const pe=U.position.x-An,ke=U.position.y-Un,Ke=U.position.z-kn;pe*pe+ke*ke+Ke*Ke>Tn*Tn&&(Xe=!0),Math.abs(ft-Cn)>Ei&&(Xe=!0);const Br=performance.now();if(Xe&&Br-Mn>=Ti){Mn=Br;const Di=Br-En>=Mi;Ln(Di)}}requestAnimationFrame(Rn)}requestAnimationFrame(Rn)}yu().catch(u=>{document.body.innerHTML=`<pre style="color:red;padding:1rem">${u}</pre>`,console.error(u)});export{Zr as A,Kr as B,Jr as C,sn as D,ir as G,$r as L,pn as P,jr as R,ln as S,en as T,ut as W,Vr as a,tn as b,Qr as c,nn as d,on as e,rn as f,fn as g,un as h,Se as i,cn as j,Xr as k,an as l,dn as m};
