var Qi=Object.defineProperty;var ea=(u,r,e)=>r in u?Qi(u,r,{enumerable:!0,configurable:!0,writable:!0,value:e}):u[r]=e;var s=(u,r,e)=>ea(u,typeof r!="symbol"?r+"":r,e);(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))t(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&t(i)}).observe(document,{childList:!0,subtree:!0});function e(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function t(n){if(n.ep)return;n.ep=!0;const o=e(n);fetch(n.href,o)}})();const ta=""+new URL("clear_sky-CyjsjiVR.hdr",import.meta.url).href,qt=""+new URL("simple_block_atlas-B-7juoTN.png",import.meta.url).href,na=""+new URL("simple_block_atlas_normal-BdCvGD-K.png",import.meta.url).href,ra=""+new URL("simple_block_atlas_mer-C_Oa_Ink.png",import.meta.url).href,oa=""+new URL("simple_block_atlas_heightmap-BOV6qQJl.png",import.meta.url).href,ia=""+new URL("waterDUDV-CGfbcllR.png",import.meta.url).href,aa="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAgCAYAAADaInAlAAAA4klEQVR4Ae2UQQ4CIRAEGeAvnn2H/3+PDqBuXLnvoYqEAMvApptKx+3+eJYrW0QpNXvUNdYc57exrjkd+/u9o+58/r8+xj+yr/t+5/G+/7P3rc361lr2Onvva5zrzbyPun7Un+v259uUcdUTpFM2sgMCQH791C4AAgB3AC7fBBAAuANw+SaAAMAdgMs3AQQA7gBcvgkgAHAH4PJNAAGAOwCXbwIIANwBuHwTQADgDsDlmwACAHcALt8EEAC4A3D5JoAAwB2AyzcBBADuAFy+CSAAcAfg8k0AAYA7AJdvAsABeAEiUwM8dIJUQAAAAABJRU5ErkJggg==",sa=""+new URL("flashlight-C64SqrUS.jpg",import.meta.url).href;class D{constructor(r=0,e=0){s(this,"x");s(this,"y");this.x=r,this.y=e}set(r,e){return this.x=r,this.y=e,this}clone(){return new D(this.x,this.y)}add(r){return new D(this.x+r.x,this.y+r.y)}sub(r){return new D(this.x-r.x,this.y-r.y)}scale(r){return new D(this.x*r,this.y*r)}dot(r){return this.x*r.x+this.y*r.y}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.lengthSq())}normalize(){const r=this.length();return r>0?this.scale(1/r):new D}toArray(){return[this.x,this.y]}static zero(){return new D(0,0)}static one(){return new D(1,1)}}const oe=class oe{constructor(r=0,e=0,t=0){s(this,"x");s(this,"y");s(this,"z");this.x=r,this.y=e,this.z=t}set(r,e,t){return this.x=r,this.y=e,this.z=t,this}clone(){return new oe(this.x,this.y,this.z)}negate(){return new oe(-this.x,-this.y,-this.z)}add(r){return new oe(this.x+r.x,this.y+r.y,this.z+r.z)}sub(r){return new oe(this.x-r.x,this.y-r.y,this.z-r.z)}scale(r){return new oe(this.x*r,this.y*r,this.z*r)}mul(r){return new oe(this.x*r.x,this.y*r.y,this.z*r.z)}dot(r){return this.x*r.x+this.y*r.y+this.z*r.z}cross(r){return new oe(this.y*r.z-this.z*r.y,this.z*r.x-this.x*r.z,this.x*r.y-this.y*r.x)}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.lengthSq())}normalize(){const r=this.length();return r>0?this.scale(1/r):new oe}lerp(r,e){return new oe(this.x+(r.x-this.x)*e,this.y+(r.y-this.y)*e,this.z+(r.z-this.z)*e)}toArray(){return[this.x,this.y,this.z]}static zero(){return new oe(0,0,0)}static one(){return new oe(1,1,1)}static up(){return new oe(0,1,0)}static down(){return new oe(0,-1,0)}static forward(){return new oe(0,0,-1)}static backward(){return new oe(0,0,1)}static right(){return new oe(1,0,0)}static left(){return new oe(-1,0,0)}static fromArray(r,e=0){return new oe(r[e],r[e+1],r[e+2])}};s(oe,"ZERO",new oe(0,0,0)),s(oe,"ONE",new oe(1,1,1)),s(oe,"UP",new oe(0,1,0)),s(oe,"DOWN",new oe(0,-1,0)),s(oe,"FORWARD",new oe(0,0,-1)),s(oe,"BACKWARD",new oe(0,0,1)),s(oe,"RIGHT",new oe(1,0,0)),s(oe,"LEFT",new oe(-1,0,0));let j=oe;class qe{constructor(r=0,e=0,t=0,n=0){s(this,"x");s(this,"y");s(this,"z");s(this,"w");this.x=r,this.y=e,this.z=t,this.w=n}set(r,e,t,n){return this.x=r,this.y=e,this.z=t,this.w=n,this}clone(){return new qe(this.x,this.y,this.z,this.w)}add(r){return new qe(this.x+r.x,this.y+r.y,this.z+r.z,this.w+r.w)}sub(r){return new qe(this.x-r.x,this.y-r.y,this.z-r.z,this.w-r.w)}scale(r){return new qe(this.x*r,this.y*r,this.z*r,this.w*r)}dot(r){return this.x*r.x+this.y*r.y+this.z*r.z+this.w*r.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.lengthSq())}toArray(){return[this.x,this.y,this.z,this.w]}static zero(){return new qe(0,0,0,0)}static one(){return new qe(1,1,1,1)}static fromArray(r,e=0){return new qe(r[e],r[e+1],r[e+2],r[e+3])}}class ue{constructor(r){s(this,"data");this.data=new Float32Array(16),r&&this.data.set(r)}clone(){return new ue(this.data)}get(r,e){return this.data[r*4+e]}set(r,e,t){this.data[r*4+e]=t}multiply(r){const e=this.data,t=r.data,n=new Float32Array(16);for(let o=0;o<4;o++)for(let i=0;i<4;i++)n[o*4+i]=e[0*4+i]*t[o*4+0]+e[1*4+i]*t[o*4+1]+e[2*4+i]*t[o*4+2]+e[3*4+i]*t[o*4+3];return new ue(n)}transformPoint(r){const e=this.data,t=e[0]*r.x+e[4]*r.y+e[8]*r.z+e[12],n=e[1]*r.x+e[5]*r.y+e[9]*r.z+e[13],o=e[2]*r.x+e[6]*r.y+e[10]*r.z+e[14],i=e[3]*r.x+e[7]*r.y+e[11]*r.z+e[15];return new j(t/i,n/i,o/i)}transformDirection(r){const e=this.data;return new j(e[0]*r.x+e[4]*r.y+e[8]*r.z,e[1]*r.x+e[5]*r.y+e[9]*r.z,e[2]*r.x+e[6]*r.y+e[10]*r.z)}transformVec4(r){const e=this.data;return new qe(e[0]*r.x+e[4]*r.y+e[8]*r.z+e[12]*r.w,e[1]*r.x+e[5]*r.y+e[9]*r.z+e[13]*r.w,e[2]*r.x+e[6]*r.y+e[10]*r.z+e[14]*r.w,e[3]*r.x+e[7]*r.y+e[11]*r.z+e[15]*r.w)}transpose(){const r=this.data;return new ue([r[0],r[4],r[8],r[12],r[1],r[5],r[9],r[13],r[2],r[6],r[10],r[14],r[3],r[7],r[11],r[15]])}invert(){const r=this.data,e=new Float32Array(16),t=r[0],n=r[1],o=r[2],i=r[3],a=r[4],l=r[5],c=r[6],d=r[7],f=r[8],p=r[9],h=r[10],_=r[11],m=r[12],y=r[13],g=r[14],b=r[15],w=t*l-n*a,B=t*c-o*a,x=t*d-i*a,U=n*c-o*l,R=n*d-i*l,A=o*d-i*c,I=f*y-p*m,k=f*g-h*m,v=f*b-_*m,M=p*g-h*y,T=p*b-_*y,G=h*b-_*g;let S=w*G-B*T+x*M+U*v-R*k+A*I;return S===0?ue.identity():(S=1/S,e[0]=(l*G-c*T+d*M)*S,e[1]=(o*T-n*G-i*M)*S,e[2]=(y*A-g*R+b*U)*S,e[3]=(h*R-p*A-_*U)*S,e[4]=(c*v-a*G-d*k)*S,e[5]=(t*G-o*v+i*k)*S,e[6]=(g*x-m*A-b*B)*S,e[7]=(f*A-h*x+_*B)*S,e[8]=(a*T-l*v+d*I)*S,e[9]=(n*v-t*T-i*I)*S,e[10]=(m*R-y*x+b*w)*S,e[11]=(p*x-f*R-_*w)*S,e[12]=(l*k-a*M-c*I)*S,e[13]=(t*M-n*k+o*I)*S,e[14]=(y*B-m*U-g*w)*S,e[15]=(f*U-p*B+h*w)*S,new ue(e))}normalMatrix(){const r=this.data,e=r[0],t=r[1],n=r[2],o=r[4],i=r[5],a=r[6],l=r[8],c=r[9],d=r[10],f=d*i-a*c,p=-d*o+a*l,h=c*o-i*l;let _=e*f+t*p+n*h;if(_===0)return ue.identity();_=1/_;const m=new Float32Array(16);return m[0]=f*_,m[4]=(-d*t+n*c)*_,m[8]=(a*t-n*i)*_,m[1]=p*_,m[5]=(d*e-n*l)*_,m[9]=(-a*e+n*o)*_,m[2]=h*_,m[6]=(-c*e+t*l)*_,m[10]=(i*e-t*o)*_,m[15]=1,new ue(m)}static identity(){return new ue([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}static translation(r,e,t){return new ue([1,0,0,0,0,1,0,0,0,0,1,0,r,e,t,1])}static scale(r,e,t){return new ue([r,0,0,0,0,e,0,0,0,0,t,0,0,0,0,1])}static rotationX(r){const e=Math.cos(r),t=Math.sin(r);return new ue([1,0,0,0,0,e,t,0,0,-t,e,0,0,0,0,1])}static rotationY(r){const e=Math.cos(r),t=Math.sin(r);return new ue([e,0,-t,0,0,1,0,0,t,0,e,0,0,0,0,1])}static rotationZ(r){const e=Math.cos(r),t=Math.sin(r);return new ue([e,t,0,0,-t,e,0,0,0,0,1,0,0,0,0,1])}static fromQuaternion(r,e,t,n){const o=r+r,i=e+e,a=t+t,l=r*o,c=e*o,d=e*i,f=t*o,p=t*i,h=t*a,_=n*o,m=n*i,y=n*a;return new ue([1-d-h,c+y,f-m,0,c-y,1-l-h,p+_,0,f+m,p-_,1-l-d,0,0,0,0,1])}static perspective(r,e,t,n){const o=1/Math.tan(r/2),i=1/(t-n);return new ue([o/e,0,0,0,0,o,0,0,0,0,n*i,-1,0,0,n*t*i,0])}static orthographic(r,e,t,n,o,i){const a=1/(r-e),l=1/(t-n),c=1/(o-i);return new ue([-2*a,0,0,0,0,-2*l,0,0,0,0,c,0,(r+e)*a,(n+t)*l,o*c,1])}static lookAt(r,e,t){const n=e.sub(r).normalize(),o=n.cross(t).normalize(),i=o.cross(n);return new ue([o.x,i.x,-n.x,0,o.y,i.y,-n.y,0,o.z,i.z,-n.z,0,-o.dot(r),-i.dot(r),n.dot(r),1])}static trs(r,e,t,n,o,i){const l=ue.fromQuaternion(e,t,n,o).data;return new ue([i.x*l[0],i.x*l[1],i.x*l[2],0,i.y*l[4],i.y*l[5],i.y*l[6],0,i.z*l[8],i.z*l[9],i.z*l[10],0,r.x,r.y,r.z,1])}}class ve{constructor(r=0,e=0,t=0,n=1){s(this,"x");s(this,"y");s(this,"z");s(this,"w");this.x=r,this.y=e,this.z=t,this.w=n}clone(){return new ve(this.x,this.y,this.z,this.w)}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.lengthSq())}normalize(){const r=this.length();return r>0?new ve(this.x/r,this.y/r,this.z/r,this.w/r):ve.identity()}conjugate(){return new ve(-this.x,-this.y,-this.z,this.w)}multiply(r){const e=this.x,t=this.y,n=this.z,o=this.w,i=r.x,a=r.y,l=r.z,c=r.w;return new ve(o*i+e*c+t*l-n*a,o*a-e*l+t*c+n*i,o*l+e*a-t*i+n*c,o*c-e*i-t*a-n*l)}rotateVec3(r){const e=this.x,t=this.y,n=this.z,o=this.w,i=o*r.x+t*r.z-n*r.y,a=o*r.y+n*r.x-e*r.z,l=o*r.z+e*r.y-t*r.x,c=-e*r.x-t*r.y-n*r.z;return new j(i*o+c*-e+a*-n-l*-t,a*o+c*-t+l*-e-i*-n,l*o+c*-n+i*-t-a*-e)}toMat4(){return ue.fromQuaternion(this.x,this.y,this.z,this.w)}slerp(r,e){let t=this.x*r.x+this.y*r.y+this.z*r.z+this.w*r.w,n=r.x,o=r.y,i=r.z,a=r.w;if(t<0&&(t=-t,n=-n,o=-o,i=-i,a=-a),t>=1)return this.clone();const l=Math.acos(t),c=Math.sqrt(1-t*t);if(Math.abs(c)<.001)return new ve(this.x*.5+n*.5,this.y*.5+o*.5,this.z*.5+i*.5,this.w*.5+a*.5);const d=Math.sin((1-e)*l)/c,f=Math.sin(e*l)/c;return new ve(this.x*d+n*f,this.y*d+o*f,this.z*d+i*f,this.w*d+a*f)}static identity(){return new ve(0,0,0,1)}static fromAxisAngle(r,e){const t=Math.sin(e/2),n=r.normalize();return new ve(n.x*t,n.y*t,n.z*t,Math.cos(e/2))}static fromEuler(r,e,t){const n=Math.cos(r/2),o=Math.sin(r/2),i=Math.cos(e/2),a=Math.sin(e/2),l=Math.cos(t/2),c=Math.sin(t/2);return new ve(o*i*l+n*a*c,n*a*l-o*i*c,n*i*c+o*a*l,n*i*l-o*a*c)}}const vt=new Uint8Array([23,125,161,52,103,117,70,37,247,101,203,169,124,126,44,123,152,238,145,45,171,114,253,10,192,136,4,157,249,30,35,72,175,63,77,90,181,16,96,111,133,104,75,162,93,56,66,240,8,50,84,229,49,210,173,239,141,1,87,18,2,198,143,57,225,160,58,217,168,206,245,204,199,6,73,60,20,230,211,233,94,200,88,9,74,155,33,15,219,130,226,202,83,236,42,172,165,218,55,222,46,107,98,154,109,67,196,178,127,158,13,243,65,79,166,248,25,224,115,80,68,51,184,128,232,208,151,122,26,212,105,43,179,213,235,148,146,89,14,195,28,78,112,76,250,47,24,251,140,108,186,190,228,170,183,139,39,188,244,246,132,48,119,144,180,138,134,193,82,182,120,121,86,220,209,3,91,241,149,85,205,150,113,216,31,100,41,164,177,214,153,231,38,71,185,174,97,201,29,95,7,92,54,254,191,118,34,221,131,11,163,99,234,81,227,147,156,176,17,142,69,12,110,62,27,255,0,194,59,116,242,252,19,21,187,53,207,129,64,135,61,40,167,237,102,223,106,159,197,189,215,137,36,32,22,5,23,125,161,52,103,117,70,37,247,101,203,169,124,126,44,123,152,238,145,45,171,114,253,10,192,136,4,157,249,30,35,72,175,63,77,90,181,16,96,111,133,104,75,162,93,56,66,240,8,50,84,229,49,210,173,239,141,1,87,18,2,198,143,57,225,160,58,217,168,206,245,204,199,6,73,60,20,230,211,233,94,200,88,9,74,155,33,15,219,130,226,202,83,236,42,172,165,218,55,222,46,107,98,154,109,67,196,178,127,158,13,243,65,79,166,248,25,224,115,80,68,51,184,128,232,208,151,122,26,212,105,43,179,213,235,148,146,89,14,195,28,78,112,76,250,47,24,251,140,108,186,190,228,170,183,139,39,188,244,246,132,48,119,144,180,138,134,193,82,182,120,121,86,220,209,3,91,241,149,85,205,150,113,216,31,100,41,164,177,214,153,231,38,71,185,174,97,201,29,95,7,92,54,254,191,118,34,221,131,11,163,99,234,81,227,147,156,176,17,142,69,12,110,62,27,255,0,194,59,116,242,252,19,21,187,53,207,129,64,135,61,40,167,237,102,223,106,159,197,189,215,137,36,32,22,5]),rt=new Uint8Array([7,9,5,0,11,1,6,9,3,9,11,1,8,10,4,7,8,6,1,5,3,10,9,10,0,8,4,1,5,2,7,8,7,11,9,10,1,0,4,7,5,0,11,6,1,4,2,8,8,10,4,9,9,2,5,7,9,1,7,2,2,6,11,5,5,4,6,9,0,1,1,0,7,6,9,8,4,10,3,1,2,8,8,9,10,11,5,11,11,2,6,10,3,4,2,4,9,10,3,2,6,3,6,10,5,3,4,10,11,2,9,11,1,11,10,4,9,4,11,0,4,11,4,0,0,0,7,6,10,4,1,3,11,5,3,4,2,9,1,3,0,1,8,0,6,7,8,7,0,4,6,10,8,2,3,11,11,8,0,2,4,8,3,0,0,10,6,1,2,2,4,5,6,0,1,3,11,9,5,5,9,6,9,8,3,8,1,8,9,6,9,11,10,7,5,6,5,9,1,3,7,0,2,10,11,2,6,1,3,11,7,7,2,1,7,3,0,8,1,1,5,0,6,10,11,11,0,2,7,0,10,8,3,5,7,1,11,1,0,7,9,0,11,5,10,3,2,3,5,9,7,9,8,4,6,5,7,9,5,0,11,1,6,9,3,9,11,1,8,10,4,7,8,6,1,5,3,10,9,10,0,8,4,1,5,2,7,8,7,11,9,10,1,0,4,7,5,0,11,6,1,4,2,8,8,10,4,9,9,2,5,7,9,1,7,2,2,6,11,5,5,4,6,9,0,1,1,0,7,6,9,8,4,10,3,1,2,8,8,9,10,11,5,11,11,2,6,10,3,4,2,4,9,10,3,2,6,3,6,10,5,3,4,10,11,2,9,11,1,11,10,4,9,4,11,0,4,11,4,0,0,0,7,6,10,4,1,3,11,5,3,4,2,9,1,3,0,1,8,0,6,7,8,7,0,4,6,10,8,2,3,11,11,8,0,2,4,8,3,0,0,10,6,1,2,2,4,5,6,0,1,3,11,9,5,5,9,6,9,8,3,8,1,8,9,6,9,11,10,7,5,6,5,9,1,3,7,0,2,10,11,2,6,1,3,11,7,7,2,1,7,3,0,8,1,1,5,0,6,10,11,11,0,2,7,0,10,8,3,5,7,1,11,1,0,7,9,0,11,5,10,3,2,3,5,9,7,9,8,4,6,5]),An=new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]);function Un(u){const r=u|0;return u<r?r-1:r}function ot(u,r,e,t){const n=u*3;return An[n]*r+An[n+1]*e+An[n+2]*t}function kn(u){return((u*6-15)*u+10)*u*u*u}function Zn(u,r,e,t,n,o,i){const a=t-1&255,l=n-1&255,c=o-1&255,d=Un(u),f=Un(r),p=Un(e),h=d&a,_=d+1&a,m=f&l,y=f+1&l,g=p&c,b=p+1&c,w=u-d,B=kn(w),x=r-f,U=kn(x),R=e-p,A=kn(R),I=vt[h+i],k=vt[_+i],v=vt[I+m],M=vt[I+y],T=vt[k+m],G=vt[k+y],S=ot(rt[v+g],w,x,R),N=ot(rt[v+b],w,x,R-1),E=ot(rt[M+g],w,x-1,R),X=ot(rt[M+b],w,x-1,R-1),V=ot(rt[T+g],w-1,x,R),F=ot(rt[T+b],w-1,x,R-1),H=ot(rt[G+g],w-1,x-1,R),C=ot(rt[G+b],w-1,x-1,R-1),Y=S+(N-S)*A,te=E+(X-E)*A,q=V+(F-V)*A,ne=H+(C-H)*A,re=Y+(te-Y)*U,fe=q+(ne-q)*U;return re+(fe-re)*B}function Ie(u,r,e,t,n,o,i){return Zn(u,r,e,t,n,o,i&255)}function yi(u,r,e,t,n,o,i){let a=1,l=1,c=.5,d=0;for(let f=0;f<i;f++){let p=Zn(u*a,r*a,e*a,0,0,0,f&255);p=o-Math.abs(p),p=p*p,d+=p*c*l,l=p,a*=t,c*=n}return d}function oo(u,r,e,t,n,o){let i=1,a=1,l=0;for(let c=0;c<o;c++)l+=Math.abs(Zn(u*i,r*i,e*i,0,0,0,c&255)*a),i*=t,a*=n;return l}const _n=class _n extends Uint32Array{constructor(e){super(6);s(this,"_seed");this._seed=0,this.seed=e??Date.now()}get seed(){return this[0]}set seed(e){this._seed=e,this[0]=e,this[1]=this[0]*1812433253+1>>>0,this[2]=this[1]*1812433253+1>>>0,this[3]=this[2]*1812433253+1>>>0,this[4]=0,this[5]=0}reset(){this.seed=this._seed}randomUint32(){let e=this[3];const t=this[0];return this[3]=this[2],this[2]=this[1],this[1]=t,e^=e>>>2,e^=e<<1,e^=t^t<<4,this[0]=e,this[4]=this[4]+362437>>>0,this[5]=e+this[4]>>>0,this[5]}randomFloat(e,t){const n=(this.randomUint32()&8388607)*11920930376163766e-23;return e===void 0?n:n*((t??1)-e)+e}randomDouble(e,t){const n=this.randomUint32()>>>5,o=this.randomUint32()>>>6,i=(n*67108864+o)*(1/9007199254740992);return e===void 0?i:i*((t??1)-e)+e}};s(_n,"global",new _n);let ke=_n;class et{constructor(){s(this,"gameObject")}onAttach(){}onDetach(){}update(r){}}class _e{constructor(r="GameObject"){s(this,"name");s(this,"position");s(this,"rotation");s(this,"scale");s(this,"children",[]);s(this,"parent",null);s(this,"_components",[]);this.name=r,this.position=j.zero(),this.rotation=ve.identity(),this.scale=j.one()}addComponent(r){return r.gameObject=this,this._components.push(r),r.onAttach(),r}getComponent(r){for(const e of this._components)if(e instanceof r)return e;return null}getComponents(r){return this._components.filter(e=>e instanceof r)}removeComponent(r){const e=this._components.indexOf(r);e!==-1&&(r.onDetach(),this._components.splice(e,1))}addChild(r){r.parent=this,this.children.push(r)}localToWorld(){const r=ue.trs(this.position,this.rotation.x,this.rotation.y,this.rotation.z,this.rotation.w,this.scale);return this.parent?this.parent.localToWorld().multiply(r):r}update(r){for(const e of this._components)e.update(r);for(const e of this.children)e.update(r)}}class wi extends et{constructor(e=60,t=.1,n=1e3,o=16/9){super();s(this,"fov");s(this,"near");s(this,"far");s(this,"aspect");this.fov=e*(Math.PI/180),this.near=t,this.far=n,this.aspect=o}projectionMatrix(){return ue.perspective(this.fov,this.aspect,this.near,this.far)}viewMatrix(){return this.gameObject.localToWorld().invert()}viewProjectionMatrix(){return this.projectionMatrix().multiply(this.viewMatrix())}position(){const e=this.gameObject.localToWorld();return new j(e.data[12],e.data[13],e.data[14])}frustumCornersWorld(){const e=this.viewProjectionMatrix().invert();return[[-1,-1,0],[1,-1,0],[-1,1,0],[1,1,0],[-1,-1,1],[1,-1,1],[-1,1,1],[1,1,1]].map(([n,o,i])=>e.transformPoint(new j(n,o,i)))}}class xi extends et{constructor(e=new j(.3,-1,.5),t=j.one(),n=1,o=3){super();s(this,"direction");s(this,"color");s(this,"intensity");s(this,"numCascades");this.direction=e.normalize(),this.color=t,this.intensity=n,this.numCascades=o}computeCascadeMatrices(e,t){const n=t??e.far,o=this._computeSplitDepths(e.near,n,this.numCascades),i=[];for(let a=0;a<this.numCascades;a++){const l=a===0?e.near:o[a-1],c=o[a],d=this._frustumCornersForSplit(e,l,c),f=d.reduce((T,G)=>T.add(G),j.ZERO).scale(1/8),p=this.direction.normalize(),h=ue.lookAt(f.sub(p),f,j.UP),_=2048;let m=0;for(const T of d)m=Math.max(m,T.sub(f).length());let y=2*m/_;m=Math.ceil(m/y)*y,m*=_/(_-2),y=2*m/_;let g=1/0,b=-1/0;for(const T of d){const G=h.transformPoint(T);g=Math.min(g,G.z),b=Math.max(b,G.z)}const w=Math.min((b-g)*.25,64);g-=w,b+=w;let B=ue.orthographic(-m,m,-m,m,-b,-g);const U=B.multiply(h).transformPoint(f),R=U.x*.5+.5,A=.5-U.y*.5,I=Math.round(R*_)/_,k=Math.round(A*_)/_,v=(I-R)*2,M=-(k-A)*2;B.set(3,0,B.get(3,0)+v),B.set(3,1,B.get(3,1)+M),i.push({lightViewProj:B.multiply(h),splitFar:c,depthRange:b-g,texelWorldSize:y})}return i}_computeSplitDepths(e,t,n){const i=[];for(let a=1;a<=n;a++){const l=e+(t-e)*(a/n),c=e*Math.pow(t/e,a/n);i.push(.75*c+(1-.75)*l)}return i}_frustumCornersForSplit(e,t,n){const o=e.near,i=e.far;e.near=t,e.far=n;const a=e.frustumCornersWorld();return e.near=o,e.far=i,a}}var Lt=(u=>(u.Forward="forward",u.Geometry="geometry",u.SkinnedGeometry="skinnedGeometry",u))(Lt||{});class la{constructor(){s(this,"transparent",!1)}}class Ee extends et{constructor(e,t){super();s(this,"mesh");s(this,"material");s(this,"castShadow",!0);this.mesh=e,this.material=t}}class ca{constructor(){s(this,"gameObjects",[])}add(r){this.gameObjects.push(r)}remove(r){const e=this.gameObjects.indexOf(r);e!==-1&&this.gameObjects.splice(e,1)}update(r){for(const e of this.gameObjects)e.update(r)}findCamera(){for(const r of this.gameObjects){const e=r.getComponent(wi);if(e)return e}return null}findDirectionalLight(){for(const r of this.gameObjects){const e=r.getComponent(xi);if(e)return e}return null}collectMeshRenderers(){const r=[];for(const e of this.gameObjects)this._collectMeshRenderersRecursive(e,r);return r}_collectMeshRenderersRecursive(r,e){const t=r.getComponent(Ee);t&&e.push(t);for(const n of r.children)this._collectMeshRenderersRecursive(n,e)}getComponents(r){const e=[];for(const t of this.gameObjects){const n=t.getComponent(r);n&&e.push(n)}return e}}const ua=[new j(1,0,0),new j(-1,0,0),new j(0,1,0),new j(0,-1,0),new j(0,0,1),new j(0,0,-1)],da=[new j(0,-1,0),new j(0,-1,0),new j(0,0,1),new j(0,0,-1),new j(0,-1,0),new j(0,-1,0)];class Kn extends et{constructor(){super(...arguments);s(this,"color",j.one());s(this,"intensity",1);s(this,"radius",10);s(this,"castShadow",!1)}worldPosition(){return this.gameObject.localToWorld().transformPoint(j.ZERO)}cubeFaceViewProjs(e=.05){const t=this.worldPosition(),n=ue.perspective(Math.PI/2,1,e,this.radius),o=new Array(6);for(let i=0;i<6;i++)o[i]=n.multiply(ue.lookAt(t,t.add(ua[i]),da[i]));return o}}class Bi extends et{constructor(){super(...arguments);s(this,"color",j.one());s(this,"intensity",1);s(this,"range",20);s(this,"innerAngle",15);s(this,"outerAngle",30);s(this,"castShadow",!1);s(this,"projectionTexture",null)}worldPosition(){return this.gameObject.localToWorld().transformPoint(j.ZERO)}worldDirection(){return this.gameObject.localToWorld().transformDirection(j.FORWARD).normalize()}lightViewProj(e=.1){const t=this.worldPosition(),n=this.worldDirection(),o=Math.abs(n.y)>.99?j.RIGHT:j.UP,i=ue.lookAt(t,t.add(n),o);return ue.perspective(this.outerAngle*2*Math.PI/180,1,e,this.range).multiply(i)}}const fa=new j(0,1,0),pa=new j(1,0,0),ha=3;class _a{constructor(r=0,e=0,t=5,n=.002){s(this,"yaw");s(this,"pitch");s(this,"speed");s(this,"sensitivity");s(this,"inputForward",0);s(this,"inputStrafe",0);s(this,"inputUp",!1);s(this,"inputDown",!1);s(this,"inputFast",!1);s(this,"_keys",new Set);s(this,"_canvas",null);s(this,"_onMouseMove");s(this,"_onKeyDown");s(this,"_onKeyUp");s(this,"_onClick");s(this,"_onBlur");s(this,"usePointerLock",!0);this.yaw=r,this.pitch=e,this.speed=t,this.sensitivity=n;const o=Math.PI/2-.001;this._onMouseMove=i=>{document.pointerLockElement===this._canvas&&(this.yaw-=i.movementX*this.sensitivity,this.pitch=Math.max(-o,Math.min(o,this.pitch+i.movementY*this.sensitivity)))},this._onKeyDown=i=>this._keys.add(i.code),this._onKeyUp=i=>this._keys.delete(i.code),this._onClick=()=>{var i;this.usePointerLock&&((i=this._canvas)==null||i.requestPointerLock())},this._onBlur=()=>this._keys.clear()}attach(r){this._canvas=r,r.addEventListener("click",this._onClick),document.addEventListener("mousemove",this._onMouseMove),document.addEventListener("keydown",this._onKeyDown),document.addEventListener("keyup",this._onKeyUp),window.addEventListener("blur",this._onBlur)}pressKey(r){this._keys.add(r)}applyLookDelta(r,e){const t=Math.PI/2-.001;this.yaw-=r*this.sensitivity,this.pitch=Math.max(-t,Math.min(t,this.pitch+e*this.sensitivity))}detach(){this._canvas&&(this._canvas.removeEventListener("click",this._onClick),document.removeEventListener("mousemove",this._onMouseMove),document.removeEventListener("keydown",this._onKeyDown),document.removeEventListener("keyup",this._onKeyUp),window.removeEventListener("blur",this._onBlur),this._canvas=null)}update(r,e){const t=Math.sin(this.yaw),n=Math.cos(this.yaw);let o=0,i=0,a=0;(this._keys.has("KeyW")||this._keys.has("ArrowUp"))&&(o-=t,a-=n),(this._keys.has("KeyS")||this._keys.has("ArrowDown"))&&(o+=t,a+=n),(this._keys.has("KeyA")||this._keys.has("ArrowLeft"))&&(o-=n,a+=t),(this._keys.has("KeyD")||this._keys.has("ArrowRight"))&&(o+=n,a-=t),this.inputForward!==0&&(o-=t*this.inputForward,a-=n*this.inputForward),this.inputStrafe!==0&&(o+=n*this.inputStrafe,a-=t*this.inputStrafe),(this._keys.has("Space")||this.inputUp)&&(i+=1),(this._keys.has("ShiftLeft")||this.inputDown)&&(i-=1);const l=Math.sqrt(o*o+i*i+a*a);if(l>0){const c=this._keys.has("ControlLeft")||this._keys.has("AltLeft")||this.inputFast,d=this.speed*(c?ha:1)*e/l;r.position.x+=o*d,r.position.y+=i*d,r.position.z+=a*d}r.rotation=ve.fromAxisAngle(fa,this.yaw).multiply(ve.fromAxisAngle(pa,-this.pitch))}}const ma=400,Si=16,Pi=ma/Si;var L=(u=>(u[u.NONE=0]="NONE",u[u.GRASS=1]="GRASS",u[u.SAND=2]="SAND",u[u.STONE=3]="STONE",u[u.DIRT=4]="DIRT",u[u.TRUNK=5]="TRUNK",u[u.TREELEAVES=6]="TREELEAVES",u[u.WATER=7]="WATER",u[u.GLASS=8]="GLASS",u[u.FLOWER=9]="FLOWER",u[u.GLOWSTONE=10]="GLOWSTONE",u[u.MAGMA=11]="MAGMA",u[u.OBSIDIAN=12]="OBSIDIAN",u[u.DIAMOND=13]="DIAMOND",u[u.IRON=14]="IRON",u[u.SPECULAR=15]="SPECULAR",u[u.CACTUS=16]="CACTUS",u[u.SNOW=17]="SNOW",u[u.GRASS_SNOW=18]="GRASS_SNOW",u[u.SPRUCE_PLANKS=19]="SPRUCE_PLANKS",u[u.GRASS_PROP=20]="GRASS_PROP",u[u.TORCH=21]="TORCH",u[u.DEAD_BUSH=22]="DEAD_BUSH",u[u.SNOWYLEAVES=23]="SNOWYLEAVES",u[u.AMETHYST=24]="AMETHYST",u[u.MAX=25]="MAX",u))(L||{});class ge{constructor(r,e,t,n){s(this,"blockType");s(this,"sideFace");s(this,"bottomFace");s(this,"topFace");this.blockType=r,this.sideFace=e,this.bottomFace=t,this.topFace=n}}const Dt=[new ge(0,new D(0,0),new D(0,0),new D(0,0)),new ge(1,new D(1,0),new D(3,0),new D(2,0)),new ge(2,new D(4,0),new D(4,0),new D(4,0)),new ge(3,new D(5,0),new D(5,0),new D(5,0)),new ge(4,new D(6,0),new D(6,0),new D(6,0)),new ge(5,new D(7,0),new D(8,0),new D(8,0)),new ge(6,new D(9,0),new D(9,0),new D(9,0)),new ge(7,new D(2,29),new D(2,29),new D(2,29)),new ge(8,new D(10,0),new D(10,0),new D(10,0)),new ge(9,new D(23,0),new D(23,0),new D(23,0)),new ge(10,new D(11,0),new D(11,0),new D(11,0)),new ge(11,new D(12,0),new D(12,0),new D(12,0)),new ge(12,new D(13,0),new D(13,0),new D(13,0)),new ge(13,new D(14,0),new D(14,0),new D(14,0)),new ge(14,new D(15,0),new D(15,0),new D(15,0)),new ge(15,new D(0,24),new D(0,24),new D(0,24)),new ge(16,new D(17,0),new D(18,0),new D(16,0)),new ge(17,new D(19,0),new D(19,0),new D(19,0)),new ge(18,new D(20,0),new D(3,0),new D(21,0)),new ge(19,new D(22,0),new D(22,0),new D(22,0)),new ge(20,new D(1,1),new D(1,1),new D(1,1)),new ge(21,new D(2,1),new D(2,1),new D(2,1)),new ge(22,new D(3,1),new D(3,1),new D(3,1)),new ge(23,new D(4,1),new D(9,0),new D(21,0)),new ge(24,new D(5,1),new D(5,1),new D(5,1)),new ge(25,new D(0,0),new D(0,0),new D(0,0))];class ye{constructor(r,e,t,n){s(this,"blockType");s(this,"materialType");s(this,"emitsLight");s(this,"collidable");this.blockType=r,this.materialType=e,this.emitsLight=t,this.collidable=n}}const Nt=[new ye(0,1,0,0),new ye(1,0,0,1),new ye(2,0,0,1),new ye(3,0,0,1),new ye(4,0,0,1),new ye(5,0,0,1),new ye(6,1,0,1),new ye(7,2,0,0),new ye(8,1,0,1),new ye(9,3,0,0),new ye(10,0,1,1),new ye(11,0,1,1),new ye(12,0,0,1),new ye(13,0,0,1),new ye(14,0,0,1),new ye(15,0,0,1),new ye(16,0,0,1),new ye(17,0,0,1),new ye(18,0,0,1),new ye(19,0,0,1),new ye(20,3,0,0),new ye(21,3,1,0),new ye(22,3,0,0),new ye(23,1,0,1),new ye(24,0,0,1)],ga=[0,.6,.5,1.5,.5,2,.2,0,.3,0,.3,.3,10,3,3,1.5,.4,.1,.6,2,0,0,0,.2,1.5],va=["None","Grass","Sand","Stone","Dirt","Trunk","Tree leaves","Water","Glass","Flower","Glowstone","Magma","Obsidian","Diamond","Iron","Specular","Cactus","Snow","Grass snow","Spruce planks","Grass prop","Torch","Dead bush","Snowy leaves","Amethyst","Max"];function he(u){return Nt[u].materialType===2}function bt(u){return Nt[u].materialType===1||Nt[u].materialType===3}function io(u){return Nt[u].emitsLight===1}function Ce(u){return Nt[u].materialType===3}function ba(u){switch(u){case L.GRASS:case L.DIRT:case L.TREELEAVES:case L.SNOW:case L.GRASS_SNOW:case L.GRASS_PROP:case L.SNOWYLEAVES:return"grass";case L.SAND:return"sand";case L.TRUNK:case L.SPRUCE_PLANKS:return"wood";default:return"stone"}}const ya=new j(0,1,0),wa=new j(1,0,0),xa=-28,Ba=-4,Sa=1.3,Pa=4.3,Ta=7,Ga=11.5,Ea=8,Ma=3.5,Me=.3,Mt=1.8,ao=1.62;class Aa{constructor(r,e=Math.PI,t=.1){s(this,"yaw");s(this,"pitch");s(this,"sensitivity",.002);s(this,"inputForward",0);s(this,"inputStrafe",0);s(this,"inputJump",!1);s(this,"inputSneak",!1);s(this,"inputSprint",!1);s(this,"autoJump",!0);s(this,"onStep");s(this,"onLand");s(this,"_velY",0);s(this,"_stepDistance",0);s(this,"_onGround",!1);s(this,"_prevInWater",!1);s(this,"_coyoteFrames",0);s(this,"_keys",new Set);s(this,"_canvas",null);s(this,"_world");s(this,"_onMouseMove");s(this,"_onKeyDown");s(this,"_onKeyUp");s(this,"_onClick");s(this,"_onBlur");s(this,"usePointerLock",!0);this._world=r,this.yaw=e,this.pitch=t;const n=Math.PI/2-.001;this._onMouseMove=o=>{document.pointerLockElement===this._canvas&&(this.yaw-=o.movementX*this.sensitivity,this.pitch=Math.max(-n,Math.min(n,this.pitch+o.movementY*this.sensitivity)))},this._onKeyDown=o=>this._keys.add(o.code),this._onKeyUp=o=>this._keys.delete(o.code),this._onClick=()=>{var o;this.usePointerLock&&((o=this._canvas)==null||o.requestPointerLock())},this._onBlur=()=>this._keys.clear()}set velY(r){this._velY=r}attach(r){this._canvas=r,r.addEventListener("click",this._onClick),document.addEventListener("mousemove",this._onMouseMove),document.addEventListener("keydown",this._onKeyDown),document.addEventListener("keyup",this._onKeyUp),window.addEventListener("blur",this._onBlur)}applyLookDelta(r,e){const t=Math.PI/2-.001;this.yaw-=r*this.sensitivity,this.pitch=Math.max(-t,Math.min(t,this.pitch+e*this.sensitivity))}detach(){this._canvas&&(this._canvas.removeEventListener("click",this._onClick),document.removeEventListener("mousemove",this._onMouseMove),document.removeEventListener("keydown",this._onKeyDown),document.removeEventListener("keyup",this._onKeyUp),window.removeEventListener("blur",this._onBlur),this._canvas=null)}update(r,e){var k,v;e=Math.min(e,.05),r.rotation=ve.fromAxisAngle(ya,this.yaw).multiply(ve.fromAxisAngle(wa,-this.pitch));const t=Math.sin(this.yaw),n=Math.cos(this.yaw),o=this._keys.has("ControlLeft")||this._keys.has("AltLeft")||this.inputSprint,i=this._keys.has("ShiftLeft")||this.inputSneak,a=o?Ta:i?Sa:Pa;let l=0,c=0;(this._keys.has("KeyW")||this._keys.has("ArrowUp"))&&(l-=t,c-=n),(this._keys.has("KeyS")||this._keys.has("ArrowDown"))&&(l+=t,c+=n),(this._keys.has("KeyA")||this._keys.has("ArrowLeft"))&&(l-=n,c+=t),(this._keys.has("KeyD")||this._keys.has("ArrowRight"))&&(l+=n,c-=t),this.inputForward!==0&&(l-=t*this.inputForward,c-=n*this.inputForward),this.inputStrafe!==0&&(l+=n*this.inputStrafe,c-=t*this.inputStrafe);const d=Math.sqrt(l*l+c*c);if(d>0){const M=1/Math.max(d,1);l=l*M*a,c=c*M*a}let f=r.position.x,p=r.position.y-ao,h=r.position.z;const _=he(this._world.getBlockType(Math.floor(f),Math.floor(p+Mt*.5),Math.floor(h))),m=this._keys.has("Space")||this.inputJump;_?(m&&(this._velY=Ma),this._velY=Math.max(this._velY+Ba*e,-2)):(this._prevInWater&&this._velY>0&&(this._velY=0),m&&(this._onGround||this._coyoteFrames>0)&&(this._velY=Ga,this._coyoteFrames=0),this._velY=Math.max(this._velY+xa*e,-50));const y=this._onGround,g=Math.sqrt(l*l+c*c);if(this.autoJump&&this._onGround&&g>.5){const M=1/Math.max(g,1),T=l*M,G=c*M,S=Math.floor(p),N=Math.floor(f+T*(Me+.3)),E=Math.floor(h+G*(Me+.3));this._isSolid(N,S,E)&&!this._isSolid(N,S+1,E)&&(this._velY=Ea)}f=this._slideX(f+l*e,p,h,l),h=this._slideZ(f,p,h+c*e,c);const[b,w,B]=this._slideY(f,p+this._velY*e,h),x=this._velY;(w||B)&&(this._velY=0),p=b,this._onGround=w,this._prevInWater=_;const U=Math.floor(f),R=Math.floor(p-.01),A=Math.floor(h),I=ba(this._world.getBlockType(U,R,A));if(w&&!y&&((k=this.onLand)==null||k.call(this,I,Math.abs(x))),w&&g>.5){this._stepDistance+=g*e;const M=g>5.5?.55:g>2?.45:.3;this._stepDistance>=M&&(this._stepDistance-=M,(v=this.onStep)==null||v.call(this,I))}else this._stepDistance=0;w?this._coyoteFrames=6:_||(this._coyoteFrames=Math.max(0,this._coyoteFrames-1)),r.position.x=f,r.position.y=p+ao,r.position.z=h}_isSolid(r,e,t){const n=this._world.getBlockType(r,e,t);return n!==L.NONE&&!he(n)&&!Ce(n)}_slideX(r,e,t,n){if(Math.abs(n)<1e-6)return r;const o=n>0?r+Me:r-Me,i=Math.floor(o),a=Math.floor(e+.01),l=Math.floor(e+Mt-.01),c=Math.floor(t-Me+.01),d=Math.floor(t+Me-.01);for(let f=a;f<=l;f++)for(let p=c;p<=d;p++)if(this._isSolid(i,f,p))return n>0?i-Me-.001:i+1+Me+.001;return r}_slideZ(r,e,t,n){if(Math.abs(n)<1e-6)return t;const o=n>0?t+Me:t-Me,i=Math.floor(o),a=Math.floor(e+.01),l=Math.floor(e+Mt-.01),c=Math.floor(r-Me+.01),d=Math.floor(r+Me-.01);for(let f=a;f<=l;f++)for(let p=c;p<=d;p++)if(this._isSolid(p,f,i))return n>0?i-Me-.001:i+1+Me+.001;return t}_slideY(r,e,t){const n=Math.floor(r-Me+.01),o=Math.floor(r+Me-.01),i=Math.floor(t-Me+.01),a=Math.floor(t+Me-.01);if(this._velY<=0){const l=Math.floor(e-.001);for(let c=n;c<=o;c++)for(let d=i;d<=a;d++)if(this._isSolid(c,l,d))return[l+1,!0,!1];return[e,!1,!1]}else{const l=Math.floor(e+Mt);for(let c=n;c<=o;c++)for(let d=i;d<=a;d++)if(this._isSolid(c,l,d))return[l-Mt-.001,!1,!0];return[e,!1,!1]}}}class Jn{constructor(r,e,t,n,o,i){s(this,"device");s(this,"queue");s(this,"context");s(this,"format");s(this,"canvas");s(this,"hdr");s(this,"enableErrorHandling");this.device=r,this.queue=r.queue,this.context=e,this.format=t,this.canvas=n,this.hdr=o,this.enableErrorHandling=i}get width(){return this.canvas.width}get height(){return this.canvas.height}static async create(r,e={}){if(!navigator.gpu)throw new Error("WebGPU not supported");const t=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!t)throw new Error("No WebGPU adapter found");const n=await t.requestDevice({requiredFeatures:[]});e.enableErrorHandling&&n.addEventListener("uncapturederror",l=>{const c=l.error;c instanceof GPUValidationError?console.error("[WebGPU Validation Error]",c.message):c instanceof GPUOutOfMemoryError?console.error("[WebGPU Out of Memory]"):console.error("[WebGPU Internal Error]",c)});const o=r.getContext("webgpu");let i,a=!1;try{o.configure({device:n,format:"rgba16float",alphaMode:"opaque",colorSpace:"display-p3",toneMapping:{mode:"extended"}}),i="rgba16float",a=!0}catch{i=navigator.gpu.getPreferredCanvasFormat(),o.configure({device:n,format:i,alphaMode:"opaque"})}return r.width=r.clientWidth*devicePixelRatio,r.height=r.clientHeight*devicePixelRatio,new Jn(n,o,i,r,a,e.enableErrorHandling??!1)}getCurrentTexture(){return this.context.getCurrentTexture()}createBuffer(r,e,t){return this.device.createBuffer({size:r,usage:e,label:t})}writeBuffer(r,e,t=0){e instanceof ArrayBuffer?this.queue.writeBuffer(r,t,e):this.queue.writeBuffer(r,t,e.buffer,e.byteOffset,e.byteLength)}pushInitErrorScope(){this.enableErrorHandling&&this.device.pushErrorScope("validation")}async popInitErrorScope(r){if(this.enableErrorHandling){const e=await this.device.popErrorScope();e&&(console.error(`[Init:${r}] Validation Error:`,e.message),console.trace())}}pushFrameErrorScope(){this.enableErrorHandling&&this.device.pushErrorScope("validation")}async popFrameErrorScope(){if(this.enableErrorHandling){const r=await this.device.popErrorScope();r&&(console.error("[Frame] Validation Error:",r.message),console.trace())}}pushPassErrorScope(r){this.enableErrorHandling&&(this.device.pushErrorScope("validation"),this.device.pushErrorScope("out-of-memory"),this.device.pushErrorScope("internal"))}async popPassErrorScope(r){if(this.enableErrorHandling){const e=await this.device.popErrorScope();e&&console.error(`[${r}] Internal Error:`,e),await this.device.popErrorScope()&&console.error(`[${r}] Out of Memory`);const n=await this.device.popErrorScope();n&&console.error(`[${r}] Validation Error:`,n.message)}}}class Pe{constructor(){s(this,"enabled",!0)}destroy(){}}class pn{constructor(r,e,t,n,o){s(this,"albedoRoughness");s(this,"normalMetallic");s(this,"depth");s(this,"albedoRoughnessView");s(this,"normalMetallicView");s(this,"depthView");s(this,"width");s(this,"height");this.albedoRoughness=r,this.normalMetallic=e,this.depth=t,this.width=n,this.height=o,this.albedoRoughnessView=r.createView(),this.normalMetallicView=e.createView(),this.depthView=t.createView()}static create(r){const{device:e,width:t,height:n}=r,o=e.createTexture({label:"GBuffer AlbedoRoughness",size:{width:t,height:n},format:"rgba8unorm",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),i=e.createTexture({label:"GBuffer NormalMetallic",size:{width:t,height:n},format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),a=e.createTexture({label:"GBuffer Depth",size:{width:t,height:n},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING});return new pn(o,i,a,t,n)}destroy(){this.albedoRoughness.destroy(),this.normalMetallic.destroy(),this.depth.destroy()}}const Qn=48,er=[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x3"},{shaderLocation:2,offset:24,format:"float32x2"},{shaderLocation:3,offset:32,format:"float32x4"}];class Ae{constructor(r,e,t){s(this,"vertexBuffer");s(this,"indexBuffer");s(this,"indexCount");this.vertexBuffer=r,this.indexBuffer=e,this.indexCount=t}destroy(){this.vertexBuffer.destroy(),this.indexBuffer.destroy()}static fromData(r,e,t){const n=r.createBuffer({label:"Mesh VertexBuffer",size:e.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(n,0,e.buffer,e.byteOffset,e.byteLength);const o=r.createBuffer({label:"Mesh IndexBuffer",size:t.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(o,0,t.buffer,t.byteOffset,t.byteLength),new Ae(n,o,t.length)}static createCube(r,e=1){const t=e/2,n=[{normal:[0,0,1],tangent:[1,0,0,1],verts:[[-t,-t,t],[t,-t,t],[t,t,t],[-t,t,t]]},{normal:[0,0,-1],tangent:[-1,0,0,1],verts:[[t,-t,-t],[-t,-t,-t],[-t,t,-t],[t,t,-t]]},{normal:[1,0,0],tangent:[0,0,-1,1],verts:[[t,-t,t],[t,-t,-t],[t,t,-t],[t,t,t]]},{normal:[-1,0,0],tangent:[0,0,1,1],verts:[[-t,-t,-t],[-t,-t,t],[-t,t,t],[-t,t,-t]]},{normal:[0,1,0],tangent:[1,0,0,1],verts:[[-t,t,t],[t,t,t],[t,t,-t],[-t,t,-t]]},{normal:[0,-1,0],tangent:[1,0,0,1],verts:[[-t,-t,-t],[t,-t,-t],[t,-t,t],[-t,-t,t]]}],o=[[0,1],[1,1],[1,0],[0,0]],i=[],a=[];let l=0;for(const c of n){for(let d=0;d<4;d++)i.push(...c.verts[d],...c.normal,...o[d],...c.tangent);a.push(l,l+1,l+2,l,l+2,l+3),l+=4}return Ae.fromData(r,new Float32Array(i),new Uint32Array(a))}static createSphere(r,e=.5,t=32,n=32){const o=[],i=[];for(let a=0;a<=t;a++){const l=a/t*Math.PI,c=Math.sin(l),d=Math.cos(l);for(let f=0;f<=n;f++){const p=f/n*Math.PI*2,h=Math.sin(p),_=Math.cos(p),m=c*_,y=d,g=c*h;o.push(m*e,y*e,g*e,m,y,g,f/n,a/t,-h,0,_,1)}}for(let a=0;a<t;a++)for(let l=0;l<n;l++){const c=a*(n+1)+l,d=c+n+1;i.push(c,c+1,d),i.push(c+1,d+1,d)}return Ae.fromData(r,new Float32Array(o),new Uint32Array(i))}static createCone(r,e=.5,t=1,n=16){const o=[],i=[],a=Math.sqrt(t*t+e*e),l=t/a,c=e/a;o.push(0,t,0,0,1,0,.5,0,1,0,0,1);const d=1;for(let h=0;h<=n;h++){const _=h/n*Math.PI*2,m=Math.cos(_),y=Math.sin(_);o.push(m*e,0,y*e,m*l,c,y*l,h/n,1,m,0,y,1)}for(let h=0;h<n;h++)i.push(0,d+h+1,d+h);const f=d+n+1;o.push(0,0,0,0,-1,0,.5,.5,1,0,0,1);const p=f+1;for(let h=0;h<=n;h++){const _=h/n*Math.PI*2,m=Math.cos(_),y=Math.sin(_);o.push(m*e,0,y*e,0,-1,0,.5+m*.5,.5+y*.5,1,0,0,1)}for(let h=0;h<n;h++)i.push(f,p+h,p+h+1);return Ae.fromData(r,new Float32Array(o),new Uint32Array(i))}static createPlane(r,e=10,t=10,n=1,o=1){const i=[],a=[];for(let l=0;l<=o;l++)for(let c=0;c<=n;c++){const d=(c/n-.5)*e,f=(l/o-.5)*t,p=c/n,h=l/o;i.push(d,0,f,0,1,0,p,h,1,0,0,1)}for(let l=0;l<o;l++)for(let c=0;c<n;c++){const d=l*(n+1)+c;a.push(d,d+n+1,d+1,d+1,d+n+1,d+n+2)}return Ae.fromData(r,new Float32Array(i),new Uint32Array(a))}}const Ti=`// Shadow map rendering shader - outputs depth only

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
`,so=2048,Yt=4;class tr extends Pe{constructor(e,t,n,o,i,a,l,c){super();s(this,"name","ShadowPass");s(this,"shadowMap");s(this,"shadowMapView");s(this,"shadowMapArrayViews");s(this,"_pipeline");s(this,"_shadowBindGroups");s(this,"_shadowUniformBuffers");s(this,"_modelUniformBuffers",[]);s(this,"_modelBindGroups",[]);s(this,"_cascadeCount");s(this,"_cascades",[]);s(this,"_modelBGL");s(this,"_sceneSnapshot",[]);this.shadowMap=e,this.shadowMapView=t,this.shadowMapArrayViews=n,this._pipeline=o,this._shadowBindGroups=i,this._shadowUniformBuffers=a,this._modelBGL=l,this._cascadeCount=c}static create(e,t=3){const{device:n}=e,o=n.createTexture({label:"ShadowMap",size:{width:so,height:so,depthOrArrayLayers:Yt},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),i=o.createView({dimension:"2d-array"}),a=Array.from({length:Yt},(_,m)=>o.createView({dimension:"2d",baseArrayLayer:m,arrayLayerCount:1})),l=n.createBindGroupLayout({label:"ShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),c=n.createBindGroupLayout({label:"ModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),d=[],f=[];for(let _=0;_<Yt;_++){const m=n.createBuffer({label:`ShadowUniformBuffer ${_}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});d.push(m),f.push(n.createBindGroup({label:`ShadowBindGroup ${_}`,layout:l,entries:[{binding:0,resource:{buffer:m}}]}))}const p=n.createShaderModule({label:"ShadowShader",code:Ti}),h=n.createRenderPipeline({label:"ShadowPipeline",layout:n.createPipelineLayout({bindGroupLayouts:[l,c]}),vertex:{module:p,entryPoint:"vs_main",buffers:[{arrayStride:Qn,attributes:[er[0]]}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less",depthBias:2,depthBiasSlopeScale:2.5,depthBiasClamp:0},primitive:{topology:"triangle-list",cullMode:"back"}});return new tr(o,i,a,h,f,d,c,t)}updateScene(e,t,n,o){this._cascades=n.computeCascadeMatrices(t,o),this._cascadeCount=Math.min(this._cascades.length,Yt)}execute(e,t){const{device:n}=t,o=this._getMeshRenderers(t);this._ensureModelBuffers(n,o.length);for(let i=0;i<this._cascadeCount&&!(i>=this._cascades.length);i++){const a=this._cascades[i];t.queue.writeBuffer(this._shadowUniformBuffers[i],0,a.lightViewProj.data.buffer);const l=e.beginRenderPass({label:`ShadowPass cascade ${i}`,colorAttachments:[],depthStencilAttachment:{view:this.shadowMapArrayViews[i],depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});l.setPipeline(this._pipeline),l.setBindGroup(0,this._shadowBindGroups[i]);for(let c=0;c<o.length;c++){const{mesh:d,modelMatrix:f}=o[c],p=this._modelUniformBuffers[c];t.queue.writeBuffer(p,0,f.data.buffer),l.setBindGroup(1,this._modelBindGroups[c]),l.setVertexBuffer(0,d.vertexBuffer),l.setIndexBuffer(d.indexBuffer,"uint32"),l.drawIndexed(d.indexCount)}l.end()}}_getMeshRenderers(e){return this._sceneSnapshot??[]}setSceneSnapshot(e){this._sceneSnapshot=e}_ensureModelBuffers(e,t){for(;this._modelUniformBuffers.length<t;){const n=e.createBuffer({label:`ModelUniform ${this._modelUniformBuffers.length}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),o=e.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:n}}]});this._modelUniformBuffers.push(n),this._modelBindGroups.push(o)}}destroy(){this.shadowMap.destroy();for(const e of this._shadowUniformBuffers)e.destroy();for(const e of this._modelUniformBuffers)e.destroy()}}const Ua=`// Deferred PBR lighting pass — fullscreen triangle, reads GBuffer + shadow maps + IBL.

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
  let cloud_uv  = (world_pos.xz - light.cloudShadowOrigin) / (cloud_ext * 2.0) + 0.5;
  // Fade cloud shadow to 1.0 (no shadow) in the outer 10% of the map to hide the
  // hard edge where the shadow map repeats its border.
  var cloud_edge = min(cloud_uv.x, 1.0 - cloud_uv.x);
  cloud_edge = min(cloud_edge, min(cloud_uv.y, 1.0 - cloud_uv.y));
  let cloud_fade = saturate(cloud_edge * 10.0);
  let cloud_raw  = textureSampleLevel(cloudShadowTex, gbufferSampler, clamp(cloud_uv, vec2<f32>(0.0), vec2<f32>(1.0)), 0.0).r;
  let cloud_shadow = select(mix(1.0, cloud_raw, cloud_fade), 1.0, light.cloudShadowExtent <= 0.0);

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
`,de="rgba16float",lo=64*4+16+16,co=368;class nr extends Pe{constructor(e,t,n,o,i,a,l,c,d,f,p,h,_,m,y,g,b,w){super();s(this,"name","DeferredLightingPass");s(this,"hdrTexture");s(this,"hdrView");s(this,"cameraBuffer");s(this,"lightBuffer");s(this,"_pipeline");s(this,"_sceneBindGroup");s(this,"_gbufferBindGroup");s(this,"_aoBindGroup");s(this,"_iblBindGroup");s(this,"_defaultCloudShadow");s(this,"_defaultSsgi");s(this,"_defaultIblCube");s(this,"_defaultBrdfLut");s(this,"_device");s(this,"_aoBGL");s(this,"_aoView");s(this,"_aoSampler");s(this,"_ssgiSampler");s(this,"_cameraScratch",new Float32Array(lo/4));s(this,"_lightScratch",new Float32Array(co/4));s(this,"_lightScratchU",new Uint32Array(this._lightScratch.buffer));s(this,"_cloudShadowScratch",new Float32Array(3));this.hdrTexture=e,this.hdrView=t,this._pipeline=n,this._sceneBindGroup=o,this._gbufferBindGroup=i,this._aoBindGroup=a,this._iblBindGroup=l,this.cameraBuffer=c,this.lightBuffer=d,this._defaultCloudShadow=f,this._defaultSsgi=p,this._defaultIblCube=h,this._defaultBrdfLut=_,this._device=m,this._aoBGL=y,this._aoView=g,this._aoSampler=b,this._ssgiSampler=w}static create(e,t,n,o,i,a){const{device:l,width:c,height:d}=e,f=l.createTexture({label:"HDR Texture",size:{width:c,height:d},format:de,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),p=f.createView(),h=l.createBuffer({label:"LightCameraBuffer",size:lo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),_=l.createBuffer({label:"LightBuffer",size:co,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),m=l.createSampler({label:"ShadowSampler",compare:"less-equal",magFilter:"linear",minFilter:"linear"}),y=l.createSampler({label:"GBufferLinearSampler",magFilter:"linear",minFilter:"linear"}),g=l.createSampler({label:"AoSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),b=l.createSampler({label:"SsgiSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),w=l.createBindGroupLayout({label:"LightSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),B=l.createBindGroupLayout({label:"LightGBufferBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth",viewDimension:"2d-array"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"comparison"}},{binding:5,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:6,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),x=l.createTexture({label:"DefaultCloudShadow",size:{width:1,height:1},format:"r8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});l.queue.writeTexture({texture:x},new Uint8Array([255]),{bytesPerRow:1},{width:1,height:1});const U=i??x.createView(),R=l.createBindGroupLayout({label:"LightAoBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),A=l.createTexture({label:"DefaultSsgi",size:{width:1,height:1},format:de,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),I=l.createBindGroupLayout({label:"LightIblBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),k=l.createSampler({label:"IblSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge"}),v=l.createTexture({label:"DefaultIblCube",size:{width:1,height:1,depthOrArrayLayers:6},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),M=v.createView({dimension:"cube"}),T=l.createTexture({label:"DefaultBrdfLut",size:{width:1,height:1},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),G=l.createBindGroup({label:"LightIblBG",layout:I,entries:[{binding:0,resource:(a==null?void 0:a.irradianceView)??M},{binding:1,resource:(a==null?void 0:a.prefilteredView)??M},{binding:2,resource:(a==null?void 0:a.brdfLutView)??T.createView()},{binding:3,resource:k}]}),S=l.createBindGroup({layout:w,entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:{buffer:_}}]}),N=l.createBindGroup({layout:B,entries:[{binding:0,resource:t.albedoRoughnessView},{binding:1,resource:t.normalMetallicView},{binding:2,resource:t.depthView},{binding:3,resource:n.shadowMapView},{binding:4,resource:m},{binding:5,resource:y},{binding:6,resource:U}]}),E=l.createBindGroup({label:"LightAoBG",layout:R,entries:[{binding:0,resource:o},{binding:1,resource:g},{binding:2,resource:A.createView()},{binding:3,resource:b}]}),X=l.createShaderModule({label:"LightingShader",code:Ua}),V=l.createRenderPipeline({label:"LightingPipeline",layout:l.createPipelineLayout({bindGroupLayouts:[w,B,R,I]}),vertex:{module:X,entryPoint:"vs_main"},fragment:{module:X,entryPoint:"fs_main",targets:[{format:de}]},primitive:{topology:"triangle-list"}});return new nr(f,p,V,S,N,E,G,h,_,i?null:x,A,a?null:v,a?null:T,l,R,o,g,b)}updateSSGI(e){this._aoBindGroup=this._device.createBindGroup({label:"LightAoBG",layout:this._aoBGL,entries:[{binding:0,resource:this._aoView},{binding:1,resource:this._aoSampler},{binding:2,resource:e},{binding:3,resource:this._ssgiSampler}]})}updateCamera(e,t,n,o,i,a,l,c){const d=this._cameraScratch;d.set(t.data,0),d.set(n.data,16),d.set(o.data,32),d.set(i.data,48),d[64]=a.x,d[65]=a.y,d[66]=a.z,d[67]=l,d[68]=c,e.queue.writeBuffer(this.cameraBuffer,0,d.buffer)}updateLight(e,t,n,o,i,a=!0,l=!1,c=.02){const d=this._lightScratch,f=this._lightScratchU;let p=0;d[p++]=t.x,d[p++]=t.y,d[p++]=t.z,d[p++]=o,d[p++]=n.x,d[p++]=n.y,d[p++]=n.z,f[p++]=i.length;for(let h=0;h<4;h++)h<i.length&&d.set(i[h].lightViewProj.data,p),p+=16;for(let h=0;h<4;h++)d[p++]=h<i.length?i[h].splitFar:1e9;f[p]=a?1:0,f[p+1]=l?1:0,d[81]=c;for(let h=0;h<4;h++)d[84+h]=h<i.length?i[h].depthRange:1;for(let h=0;h<4;h++)d[88+h]=h<i.length?i[h].texelWorldSize:1;e.queue.writeBuffer(this.lightBuffer,0,d.buffer)}updateCloudShadow(e,t,n,o){const i=this._cloudShadowScratch;i[0]=t,i[1]=n,i[2]=o,e.queue.writeBuffer(this.lightBuffer,312,i.buffer)}execute(e,t){const n=e.beginRenderPass({label:"DeferredLightingPass",colorAttachments:[{view:this.hdrView,loadOp:"load",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._sceneBindGroup),n.setBindGroup(1,this._gbufferBindGroup),n.setBindGroup(2,this._aoBindGroup),n.setBindGroup(3,this._iblBindGroup),n.draw(3),n.end()}destroy(){var e,t,n,o;this.hdrTexture.destroy(),this.cameraBuffer.destroy(),this.lightBuffer.destroy(),(e=this._defaultCloudShadow)==null||e.destroy(),(t=this._defaultSsgi)==null||t.destroy(),(n=this._defaultIblCube)==null||n.destroy(),(o=this._defaultBrdfLut)==null||o.destroy()}}const ka=`// Physically based single-scattering atmosphere (Rayleigh + Mie).
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
`,uo=96;class rr extends Pe{constructor(e,t,n,o){super();s(this,"name","AtmospherePass");s(this,"_pipeline");s(this,"_uniformBuf");s(this,"_bg");s(this,"_hdrView");s(this,"_scratch",new Float32Array(uo/4));this._pipeline=e,this._uniformBuf=t,this._bg=n,this._hdrView=o}static create(e,t){const{device:n}=e,o=n.createBuffer({label:"AtmosphereUniform",size:uo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),i=n.createBindGroupLayout({label:"AtmosphereBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),a=n.createBindGroup({label:"AtmosphereBG",layout:i,entries:[{binding:0,resource:{buffer:o}}]}),l=n.createShaderModule({label:"AtmosphereShader",code:ka}),c=n.createRenderPipeline({label:"AtmospherePipeline",layout:n.createPipelineLayout({bindGroupLayouts:[i]}),vertex:{module:l,entryPoint:"vs_main"},fragment:{module:l,entryPoint:"fs_main",targets:[{format:de}]},primitive:{topology:"triangle-list"}});return new rr(c,o,a,t)}update(e,t,n,o){const i=this._scratch;i.set(t.data,0),i[16]=n.x,i[17]=n.y,i[18]=n.z;const a=Math.sqrt(o.x*o.x+o.y*o.y+o.z*o.z),l=a>0?1/a:0;i[20]=-o.x*l,i[21]=-o.y*l,i[22]=-o.z*l,e.queue.writeBuffer(this._uniformBuf,0,i.buffer)}execute(e,t){const n=e.beginRenderPass({label:"AtmospherePass",colorAttachments:[{view:this._hdrView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._bg),n.draw(3),n.end()}destroy(){this._uniformBuf.destroy()}}const Ca=`// Block selection highlight — two draw calls sharing this shader:
//   draw(36): semi-transparent dark face overlay (6 faces × 2 triangles × 3 verts)
//   draw(36, 36): thick edge outlines (12 edges × 2 quads × 3 verts, offset into same array)
//
// Corner index encoding: bit 0 = x, bit 1 = y, bit 2 = z (0=min, 1=max side).

struct Uniforms {
  viewProj   : mat4x4<f32>,
  blockPos   : vec3<f32>,
  crackStage : f32,
}

@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var crack_atlas  : texture_2d<f32>;
@group(0) @binding(2) var crack_sampler: sampler;

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

struct FaceOutput {
  @builtin(position) clip_pos : vec4<f32>,
  @location(0)       world_pos : vec3<f32>,
}

@vertex
fn vs_face(@builtin(vertex_index) vid: u32) -> FaceOutput {
  let ci  = FACE_CI[vid];
  let pos = u.blockPos + vec3<f32>(
    mix(-0.001, 1.001, f32((ci >> 0u) & 1u)),
    mix(-0.001, 1.001, f32((ci >> 1u) & 1u)),
    mix(-0.001, 1.001, f32((ci >> 2u) & 1u)),
  );
  var out: FaceOutput;
  out.clip_pos  = bias_clip(u.viewProj * vec4<f32>(pos, 1.0));
  out.world_pos = pos;
  return out;
}

// Crack overlay sampled from the last column of the block atlas.
// The atlas is 25 × 25 tiles; the rightmost column (x = 24) holds 9 crack
// stages stacked from top (least cracked) to bottom (most cracked).
const CRACK_ATLAS_TILES   : f32 = 25.0;
const CRACK_ATLAS_COL     : f32 = 24.0;
const CRACK_ATLAS_STAGES  : f32 = 9.0;

fn crack_alpha(local: vec3<f32>, stage: f32) -> f32 {
  if (stage < 0.5) { return 0.0; }

  // Pick the dominant face axis (largest distance from block centre = the face
  // the fragment lies on) and derive 0..1 face UV from the other two axes.
  let dx = abs(local.x - 0.5);
  let dy = abs(local.y - 0.5);
  let dz = abs(local.z - 0.5);
  var face_uv: vec2<f32>;
  if (dx >= dy && dx >= dz) {
    face_uv = vec2<f32>(local.z, local.y);   // ±X face
  } else if (dy >= dx && dy >= dz) {
    face_uv = vec2<f32>(local.x, local.z);   // ±Y face
  } else {
    face_uv = vec2<f32>(local.x, local.y);   // ±Z face
  }

  // Pick the crack tile for this break stage (1 → top tile, 9 → bottom tile)
  // and remap face UV into the tile's slot in the atlas.
  let stage_idx = clamp(floor(stage) - 1.0, 0.0, CRACK_ATLAS_STAGES - 1.0);
  let atlas_uv = vec2<f32>(
    (CRACK_ATLAS_COL + face_uv.x) / CRACK_ATLAS_TILES,
    (stage_idx       + face_uv.y) / CRACK_ATLAS_TILES,
  );

  // The crack tile uses opaque dark pixels for the cracks; we treat luminance
  // inverse as the crack strength so a black crack pattern reads as a strong
  // dark overlay even on RGB-only crack textures.
  let s = textureSampleLevel(crack_atlas, crack_sampler, atlas_uv, 0.0);
  let lum = dot(s.rgb, vec3<f32>(0.2126, 0.7152, 0.0722));
  return s.a * (1.0 - lum);
}

@fragment
fn fs_face(in: FaceOutput) -> @location(0) vec4<f32> {
  let crack = crack_alpha(in.world_pos - u.blockPos, u.crackStage);
  let alpha = min(0.35 + crack * 0.5, 0.9);
  return vec4<f32>(0.0, 0.0, 0.0, alpha);
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
`,fo=80;class or extends Pe{constructor(e,t,n,o,i,a){super();s(this,"name","BlockHighlightPass");s(this,"_facePipeline");s(this,"_edgePipeline");s(this,"_uniformBuf");s(this,"_bg");s(this,"_hdrView");s(this,"_depthView");s(this,"_active",!1);s(this,"_crackStage",0);s(this,"_scratch",new Float32Array(fo/4));this._facePipeline=e,this._edgePipeline=t,this._uniformBuf=n,this._bg=o,this._hdrView=i,this._depthView=a}static create(e,t,n,o){const{device:i}=e,a=i.createBuffer({label:"BlockHighlightUniform",size:fo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),l=i.createSampler({label:"BlockHighlightCrackSampler",magFilter:"nearest",minFilter:"nearest",mipmapFilter:"nearest",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),c=i.createBindGroupLayout({label:"BlockHighlightBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),d=i.createBindGroup({label:"BlockHighlightBG",layout:c,entries:[{binding:0,resource:{buffer:a}},{binding:1,resource:o.view},{binding:2,resource:l}]}),f=i.createShaderModule({label:"BlockHighlightShader",code:Ca}),p=i.createPipelineLayout({bindGroupLayouts:[c]}),h={format:"depth32float",depthWriteEnabled:!1,depthCompare:"less-equal"},_={color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}},m=i.createRenderPipeline({label:"BlockHighlightFacePipeline",layout:p,vertex:{module:f,entryPoint:"vs_face"},fragment:{module:f,entryPoint:"fs_face",targets:[{format:de,blend:_}]},primitive:{topology:"triangle-list",cullMode:"none"},depthStencil:h}),y=i.createRenderPipeline({label:"BlockHighlightEdgePipeline",layout:p,vertex:{module:f,entryPoint:"vs_edge"},fragment:{module:f,entryPoint:"fs_edge",targets:[{format:de,blend:_}]},primitive:{topology:"triangle-list",cullMode:"none"},depthStencil:h});return new or(m,y,a,d,t,n)}setCrackStage(e){this._crackStage=Math.max(0,Math.min(9,Math.floor(e)))}update(e,t,n){if(!n){this._active=!1;return}this._active=!0;const o=this._scratch;o.set(t.data,0),o[16]=n.x,o[17]=n.y,o[18]=n.z,o[19]=this._crackStage,e.queue.writeBuffer(this._uniformBuf,0,o.buffer)}execute(e,t){if(!this._active)return;const n=e.beginRenderPass({label:"BlockHighlightPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._depthView,depthLoadOp:"load",depthStoreOp:"store"}});n.setBindGroup(0,this._bg),n.setPipeline(this._facePipeline),n.draw(36),n.setPipeline(this._edgePipeline),n.draw(144),n.end()}destroy(){this._uniformBuf.destroy()}}const La=`// Cloud + sky pass — fullscreen triangle.
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

// Rotate XZ around Y by ~37° so the Perlin noise grid doesn't align with world
// axes, which would otherwise produce visible hard edges along X=0 and Z=0.
const ROT_C: f32 = 0.79863551;
const ROT_S: f32 = 0.60181502;
fn rotate_xz(p: vec3<f32>) -> vec3<f32> {
  return vec3<f32>(p.x * ROT_C - p.z * ROT_S, p.y, p.x * ROT_S + p.z * ROT_C);
}

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
  let pr = rotate_xz(rotate_xz(p));
  // Large-scale pass (3× coarser) — creates some very big cloud masses.
  // Drifts at half wind speed for natural differential parallax with smaller clouds.
  let pw_large = sample_pw((pr + wind * 0.5) * 0.012);
  // Medium-scale pass — smaller individual clouds.
  let pw_med = sample_pw((pr + wind) * 0.04);
  // Blend: large scale dominates shape; medium adds smaller clouds in sparser areas.
  let pw = pw_large * 0.6 + pw_med * 0.4;
  let hg = height_gradient(p.y);
  let cov = saturate(remap(pw, 1.0 - cloud.coverage, 1.0, 0.0, 1.0)) * hg;
  if (cov < 0.001) { return 0.0; }
  let detail_uv = pr * 0.12 + wind * 0.1;
  let det = textureSampleLevel(detail_noise, noise_samp, detail_uv, 0.0);
  let detail = det.r * 0.5 + det.g * 0.25 + det.b * 0.125;
  return max(0.0, cov - (1.0 - cov) * detail * 0.3) * cloud.density;
}

fn sample_density_coarse(p: vec3<f32>) -> f32 {
  let wind     = vec3<f32>(cloud.windOffset.x, 0.0, cloud.windOffset.y);
  let pr       = rotate_xz(p);
  let pw_large = sample_pw((pr + wind * 0.5) * 0.012);
  let pw_med   = sample_pw((pr + wind) * 0.04);
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
`,po=96,ho=48,_o=32;class ir extends Pe{constructor(e,t,n,o,i,a,l,c,d){super();s(this,"name","CloudPass");s(this,"_pipeline");s(this,"_hdrView");s(this,"_cameraBuffer");s(this,"_cloudBuffer");s(this,"_lightBuffer");s(this,"_sceneBG");s(this,"_lightBG");s(this,"_depthBG");s(this,"_noiseSkyBG");s(this,"_cameraScratch",new Float32Array(po/4));s(this,"_lightScratch",new Float32Array(_o/4));s(this,"_settingsScratch",new Float32Array(ho/4));this._pipeline=e,this._hdrView=t,this._cameraBuffer=n,this._cloudBuffer=o,this._lightBuffer=i,this._sceneBG=a,this._lightBG=l,this._depthBG=c,this._noiseSkyBG=d}static create(e,t,n,o){const{device:i}=e,a=i.createBuffer({label:"CloudCameraBuffer",size:po,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),l=i.createBuffer({label:"CloudUniformBuffer",size:ho,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),c=i.createBuffer({label:"CloudLightBuffer",size:_o,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),d=i.createBindGroupLayout({label:"CloudSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),f=i.createBindGroupLayout({label:"CloudLightBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),p=i.createBindGroupLayout({label:"CloudDepthBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),h=i.createBindGroupLayout({label:"CloudNoiseSkyBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),_=i.createSampler({label:"CloudNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"mirror-repeat",addressModeV:"mirror-repeat",addressModeW:"mirror-repeat"}),m=i.createSampler({label:"CloudDepthSampler"}),y=i.createBindGroup({label:"CloudSceneBG",layout:d,entries:[{binding:0,resource:{buffer:a}},{binding:1,resource:{buffer:l}}]}),g=i.createBindGroup({label:"CloudLightBG",layout:f,entries:[{binding:0,resource:{buffer:c}}]}),b=i.createBindGroup({label:"CloudDepthBG",layout:p,entries:[{binding:0,resource:n},{binding:1,resource:m}]}),w=i.createBindGroup({label:"CloudNoiseSkyBG",layout:h,entries:[{binding:0,resource:o.baseView},{binding:1,resource:o.detailView},{binding:2,resource:_}]}),B=i.createShaderModule({label:"CloudShader",code:La}),x=i.createRenderPipeline({label:"CloudPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[d,f,p,h]}),vertex:{module:B,entryPoint:"vs_main"},fragment:{module:B,entryPoint:"fs_main",targets:[{format:de}]},primitive:{topology:"triangle-list"}});return new ir(x,t,a,l,c,y,g,b,w)}updateCamera(e,t,n,o,i){const a=this._cameraScratch;a.set(t.data,0),a[16]=n.x,a[17]=n.y,a[18]=n.z,a[19]=o,a[20]=i,e.queue.writeBuffer(this._cameraBuffer,0,a.buffer)}updateLight(e,t,n,o){const i=this._lightScratch;i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=o,i[4]=n.x,i[5]=n.y,i[6]=n.z,e.queue.writeBuffer(this._lightBuffer,0,i.buffer)}updateSettings(e,t){const n=this._settingsScratch;n[0]=t.cloudBase,n[1]=t.cloudTop,n[2]=t.coverage,n[3]=t.density,n[4]=t.windOffset[0],n[5]=t.windOffset[1],n[6]=t.anisotropy,n[7]=t.extinction,n[8]=t.ambientColor[0],n[9]=t.ambientColor[1],n[10]=t.ambientColor[2],n[11]=t.exposure,e.queue.writeBuffer(this._cloudBuffer,0,n.buffer)}execute(e,t){const n=e.beginRenderPass({label:"CloudPass",colorAttachments:[{view:this._hdrView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._sceneBG),n.setBindGroup(1,this._lightBG),n.setBindGroup(2,this._depthBG),n.setBindGroup(3,this._noiseSkyBG),n.draw(3),n.end()}destroy(){this._cameraBuffer.destroy(),this._cloudBuffer.destroy(),this._lightBuffer.destroy()}}const Ra=`// Cloud shadow pass — renders a top-down cloud transmittance map (1024×1024 r8unorm).
// For each texel, marches 32 steps vertically through the cloud slab and accumulates
// optical depth, then outputs Beer's-law transmittance.

const PI: f32 = 3.14159265358979323846;

const ROT_C: f32 = 0.79863551;
const ROT_S: f32 = 0.60181502;
fn rotate_xz(p: vec3<f32>) -> vec3<f32> {
  return vec3<f32>(p.x * ROT_C - p.z * ROT_S, p.y, p.x * ROT_S + p.z * ROT_C);
}

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
  let pr = rotate_xz(world_pos);
  let scale = 0.04;
  let base_uv = (pr + vec3<f32>(params.windOffset.x, 0.0, params.windOffset.y)) * scale;
  let base = textureSampleLevel(base_noise, noise_samp, base_uv, 0.0);

  // Perlin-Worley blend
  let pw = base.r * 0.625 + (1.0 - base.g) * 0.25 + (1.0 - base.b) * 0.125;
  let hg = height_gradient(world_pos.y);
  let cov = saturate(remap(pw, 1.0 - params.coverage, 1.0, 0.0, 1.0)) * hg;
  if (cov < 0.001) { return 0.0; }

  let detail_scale = 0.12;
  let detail_uv = pr * detail_scale + vec3<f32>(params.windOffset.x, 0.0, params.windOffset.y) * 0.1;
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
`,mo=1024,go="r8unorm",vo=48;class ar extends Pe{constructor(e,t,n,o,i,a){super();s(this,"name","CloudShadowPass");s(this,"shadowTexture");s(this,"shadowView");s(this,"_pipeline");s(this,"_uniformBuffer");s(this,"_uniformBG");s(this,"_noiseBG");s(this,"_frameCount",0);s(this,"_data",new Float32Array(vo/4));this.shadowTexture=e,this.shadowView=t,this._pipeline=n,this._uniformBuffer=o,this._uniformBG=i,this._noiseBG=a}static create(e,t){const{device:n}=e,o=n.createTexture({label:"CloudShadowTexture",size:{width:mo,height:mo},format:go,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),i=o.createView(),a=n.createBuffer({label:"CloudShadowUniform",size:vo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),l=n.createBindGroupLayout({label:"CloudShadowUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),c=n.createSampler({label:"CloudNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"mirror-repeat",addressModeV:"mirror-repeat",addressModeW:"mirror-repeat"}),d=n.createBindGroupLayout({label:"CloudShadowNoiseBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),f=n.createBindGroup({label:"CloudShadowUniformBG",layout:l,entries:[{binding:0,resource:{buffer:a}}]}),p=n.createBindGroup({label:"CloudShadowNoiseBG",layout:d,entries:[{binding:0,resource:t.baseView},{binding:1,resource:t.detailView},{binding:2,resource:c}]}),h=n.createShaderModule({label:"CloudShadowShader",code:Ra}),_=n.createRenderPipeline({label:"CloudShadowPipeline",layout:n.createPipelineLayout({bindGroupLayouts:[l,d]}),vertex:{module:h,entryPoint:"vs_main"},fragment:{module:h,entryPoint:"fs_main",targets:[{format:go}]},primitive:{topology:"triangle-list"}});return new ar(o,i,_,a,f,p)}update(e,t,n,o){this._data[0]=t.cloudBase,this._data[1]=t.cloudTop,this._data[2]=t.coverage,this._data[3]=t.density,this._data[4]=t.windOffset[0],this._data[5]=t.windOffset[1],this._data[6]=n[0],this._data[7]=n[1],this._data[8]=o,this._data[9]=t.extinction,e.queue.writeBuffer(this._uniformBuffer,0,this._data.buffer)}execute(e,t){if(this._frameCount++%2!==0)return;const n=e.beginRenderPass({label:"CloudShadowPass",colorAttachments:[{view:this.shadowView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._uniformBG),n.setBindGroup(1,this._noiseBG),n.draw(3),n.end()}destroy(){this.shadowTexture.destroy(),this._uniformBuffer.destroy()}}const Na=`// TAA resolve pass — fullscreen triangle, blends current HDR with reprojected history.

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
`,bo=128;class sr extends Pe{constructor(e,t,n,o,i,a,l,c,d,f){super();s(this,"name","TAAPass");s(this,"_resolved");s(this,"resolvedView");s(this,"_history");s(this,"_historyView");s(this,"_pipeline");s(this,"_uniformBuffer");s(this,"_uniformBG");s(this,"_textureBG");s(this,"_width");s(this,"_height");s(this,"_scratch",new Float32Array(bo/4));this._resolved=e,this.resolvedView=t,this._history=n,this._historyView=o,this._pipeline=i,this._uniformBuffer=a,this._uniformBG=l,this._textureBG=c,this._width=d,this._height=f}get historyView(){return this._historyView}static create(e,t,n){const{device:o,width:i,height:a}=e,l=o.createTexture({label:"TAA Resolved",size:{width:i,height:a},format:de,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),c=o.createTexture({label:"TAA History",size:{width:i,height:a},format:de,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),d=l.createView(),f=c.createView(),p=o.createBuffer({label:"TAAUniformBuffer",size:bo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),h=o.createBindGroupLayout({label:"TAAUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),_=o.createBindGroupLayout({label:"TAATextureBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),m=o.createSampler({label:"TAALinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),y=o.createBindGroup({layout:h,entries:[{binding:0,resource:{buffer:p}}]}),g=o.createBindGroup({layout:_,entries:[{binding:0,resource:t.hdrView},{binding:1,resource:f},{binding:2,resource:n.depthView},{binding:3,resource:m}]}),b=o.createShaderModule({label:"TAAShader",code:Na}),w=o.createRenderPipeline({label:"TAAPipeline",layout:o.createPipelineLayout({bindGroupLayouts:[h,_]}),vertex:{module:b,entryPoint:"vs_main"},fragment:{module:b,entryPoint:"fs_main",targets:[{format:de}]},primitive:{topology:"triangle-list"}});return new sr(l,d,c,f,w,p,y,g,i,a)}updateCamera(e,t,n){const o=this._scratch;o.set(t.data,0),o.set(n.data,16),e.queue.writeBuffer(this._uniformBuffer,0,o.buffer)}execute(e,t){const n=e.beginRenderPass({label:"TAAPass",colorAttachments:[{view:this.resolvedView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._uniformBG),n.setBindGroup(1,this._textureBG),n.draw(3),n.end(),e.copyTextureToTexture({texture:this._resolved},{texture:this._history},{width:this._width,height:this._height})}destroy(){this._resolved.destroy(),this._history.destroy(),this._uniformBuffer.destroy()}}const Ia=`// Bloom: prefilter (downsample + threshold) and separable Gaussian blur.
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
`,Oa=`// Bloom composite: adds the blurred bright regions back to the source HDR.

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
`,Da=16;class lr extends Pe{constructor(e,t,n,o,i,a,l,c,d,f,p,h,_,m,y){super();s(this,"name","BloomPass");s(this,"resultView");s(this,"_result");s(this,"_half1");s(this,"_half2");s(this,"_half1View");s(this,"_half2View");s(this,"_prefilterPipeline");s(this,"_blurHPipeline");s(this,"_blurVPipeline");s(this,"_compositePipeline");s(this,"_uniformBuffer");s(this,"_scratch",new Float32Array(4));s(this,"_prefilterBG");s(this,"_blurHBG");s(this,"_blurVBG");s(this,"_compositeBG");this._result=e,this.resultView=t,this._half1=n,this._half1View=o,this._half2=i,this._half2View=a,this._prefilterPipeline=l,this._blurHPipeline=c,this._blurVPipeline=d,this._compositePipeline=f,this._uniformBuffer=p,this._prefilterBG=h,this._blurHBG=_,this._blurVBG=m,this._compositeBG=y}static create(e,t){const{device:n,width:o,height:i}=e,a=Math.max(1,o>>1),l=Math.max(1,i>>1),c=n.createTexture({label:"BloomHalf1",size:{width:a,height:l},format:de,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),d=n.createTexture({label:"BloomHalf2",size:{width:a,height:l},format:de,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),f=n.createTexture({label:"BloomResult",size:{width:o,height:i},format:de,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),p=c.createView(),h=d.createView(),_=f.createView(),m=n.createBuffer({label:"BloomUniforms",size:Da,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});n.queue.writeBuffer(m,0,new Float32Array([1,.5,.3,0]).buffer);const y=n.createSampler({label:"BloomSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),g=n.createBindGroupLayout({label:"BloomSingleBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),b=n.createBindGroupLayout({label:"BloomCompositeBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),w=n.createShaderModule({label:"BloomShader",code:Ia}),B=n.createShaderModule({label:"BloomComposite",code:Oa}),x=n.createPipelineLayout({bindGroupLayouts:[g]}),U=n.createPipelineLayout({bindGroupLayouts:[b]});function R(E,X){return n.createRenderPipeline({label:X,layout:x,vertex:{module:w,entryPoint:"vs_main"},fragment:{module:w,entryPoint:E,targets:[{format:de}]},primitive:{topology:"triangle-list"}})}const A=R("fs_prefilter","BloomPrefilterPipeline"),I=R("fs_blur_h","BloomBlurHPipeline"),k=R("fs_blur_v","BloomBlurVPipeline"),v=n.createRenderPipeline({label:"BloomCompositePipeline",layout:U,vertex:{module:B,entryPoint:"vs_main"},fragment:{module:B,entryPoint:"fs_main",targets:[{format:de}]},primitive:{topology:"triangle-list"}});function M(E){return n.createBindGroup({layout:g,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:E},{binding:2,resource:y}]})}const T=M(t),G=M(p),S=M(h),N=n.createBindGroup({layout:b,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:t},{binding:2,resource:p},{binding:3,resource:y}]});return new lr(f,_,c,p,d,h,A,I,k,v,m,T,G,S,N)}updateParams(e,t=1,n=.5,o=.3){this._scratch[0]=t,this._scratch[1]=n,this._scratch[2]=o,this._scratch[3]=0,e.queue.writeBuffer(this._uniformBuffer,0,this._scratch.buffer)}execute(e,t){const n=(o,i,a,l)=>{const c=e.beginRenderPass({label:o,colorAttachments:[{view:i,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});c.setPipeline(a),c.setBindGroup(0,l),c.draw(3),c.end()};n("BloomPrefilter",this._half1View,this._prefilterPipeline,this._prefilterBG);for(let o=0;o<2;o++)n("BloomBlurH",this._half2View,this._blurHPipeline,this._blurHBG),n("BloomBlurV",this._half1View,this._blurVPipeline,this._blurVBG);n("BloomComposite",this.resultView,this._compositePipeline,this._compositeBG)}destroy(){this._result.destroy(),this._half1.destroy(),this._half2.destroy(),this._uniformBuffer.destroy()}}const Va=`// godray_march.wgsl — Half-resolution ray-march pass with 3D cloud-density shadowing

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
  scattering: f32,
  max_steps : f32,
  _pad0     : f32,
  _pad1     : f32,
}

struct CloudDensityUniforms {
  cloudBase : f32,
  cloudTop  : f32,
  coverage  : f32,
  density   : f32,
  windOffset: vec2<f32>,
  extinction: f32,
  _pad0     : f32,
  _pad1     : f32,
  _pad2     : f32,
  _pad3     : f32,
  _pad4     : f32,
  _pad5     : f32,
  _pad6     : f32,
  _pad7     : f32,
}

@group(0) @binding(0) var<uniform> camera         : CameraUniforms;
@group(0) @binding(1) var<uniform> light           : LightUniforms;
@group(0) @binding(2) var          depth_tex       : texture_depth_2d;
@group(0) @binding(3) var          shadow_map      : texture_depth_2d_array;
@group(0) @binding(4) var          shadow_samp     : sampler_comparison;
@group(0) @binding(5) var<uniform> march_params    : MarchParams;
@group(0) @binding(6) var<uniform> cloud_density   : CloudDensityUniforms;
@group(0) @binding(7) var          base_noise      : texture_3d<f32>;
@group(0) @binding(8) var          detail_noise    : texture_3d<f32>;
@group(0) @binding(9) var          noise_samp      : sampler;

@vertex
fn vs_main(@builtin(vertex_index) vid: u32) -> VertexOutput {
  let x = f32((vid & 1u) << 2u) - 1.0;
  let y = f32((vid & 2u) << 1u) - 1.0;
  var out: VertexOutput;
  out.clip_pos = vec4<f32>(x, y, 0.0, 1.0);
  out.uv       = vec2<f32>(x * 0.5 + 0.5, -y * 0.5 + 0.5);
  return out;
}

fn henyey_greenstein(cos_theta: f32, g: f32) -> f32 {
  let k = 0.0795774715459;
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

fn dither(uv: vec2<f32>) -> f32 {
  return fract(sin(dot(uv, vec2<f32>(41.0, 289.0))) * 45758.5453);
}

// ---- Cloud density helpers (mirrors cloud_shadow.wgsl) -----------------------

const ROT_C: f32 = 0.79863551;
const ROT_S: f32 = 0.60181502;
fn rotate_xz(p: vec3<f32>) -> vec3<f32> {
  return vec3<f32>(p.x * ROT_C - p.z * ROT_S, p.y, p.x * ROT_S + p.z * ROT_C);
}

fn remap(v: f32, lo: f32, hi: f32, a: f32, b: f32) -> f32 {
  return clamp(a + (v - lo) / max(hi - lo, 0.0001) * (b - a), a, b);
}

fn height_gradient(y: f32) -> f32 {
  let t    = clamp((y - cloud_density.cloudBase) / max(cloud_density.cloudTop - cloud_density.cloudBase, 0.001), 0.0, 1.0);
  let base = remap(t, 0.0, 0.07, 0.0, 1.0);
  let top  = remap(t, 0.2, 1.0,  1.0, 0.0);
  return saturate(base * top);
}

fn sample_density(world_pos: vec3<f32>) -> f32 {
  let pr = rotate_xz(world_pos);
  let scale = 0.04;
  let base_uv = (pr + vec3<f32>(cloud_density.windOffset.x, 0.0, cloud_density.windOffset.y)) * scale;
  let base = textureSampleLevel(base_noise, noise_samp, base_uv, 0.0);

  let pw = base.r * 0.625 + (1.0 - base.g) * 0.25 + (1.0 - base.b) * 0.125;
  let hg = height_gradient(world_pos.y);
  let cov = saturate(remap(pw, 1.0 - cloud_density.coverage, 1.0, 0.0, 1.0)) * hg;
  if (cov < 0.001) { return 0.0; }

  let detail_scale = 0.12;
  let detail_uv = pr * detail_scale + vec3<f32>(cloud_density.windOffset.x, 0.0, cloud_density.windOffset.y) * 0.1;
  let det = textureSampleLevel(detail_noise, noise_samp, detail_uv, 0.0);
  let detail = det.r * 0.5 + det.g * 0.25 + det.b * 0.125;

  return max(0.0, cov - (1.0 - cov) * detail * 0.3) * cloud_density.density;
}

// Integrates cloud density vertically above p through the full cloud slab.
// Returns the Beer's-law transmittance (1 = fully transparent, 0 = fully opaque).
fn cloud_shadow_vertical(p: vec3<f32>) -> f32 {
  let start_y = max(p.y, cloud_density.cloudBase);
  if (start_y >= cloud_density.cloudTop) { return 1.0; }
  let range = cloud_density.cloudTop - start_y;
  let num_steps = 4u;
  let step_size = range / f32(num_steps);
  var opt_depth = 0.0;
  for (var i = 0u; i < num_steps; i++) {
    let y = start_y + (f32(i) + 0.5) * step_size;
    opt_depth += sample_density(vec3<f32>(p.x, y, p.z)) * step_size;
  }
  return exp(-opt_depth * cloud_density.extinction);
}

// ---- Fragment shader ---------------------------------------------------------

@fragment
fn fs_march(in: VertexOutput) -> @location(0) vec4<f32> {
  let depth_size = vec2<i32>(textureDimensions(depth_tex));
  let coord      = clamp(vec2<i32>(in.uv * vec2<f32>(depth_size)),
                         vec2<i32>(0), depth_size - vec2<i32>(1));
  let depth = textureLoad(depth_tex, coord, 0u);

  let hit_depth = select(depth, 1.0, depth >= 1.0);
  let world_pos = reconstruct_world_pos(in.uv, hit_depth);
  let ray_vec   = world_pos - camera.position;
  let ray_len   = length(ray_vec);
  let ray_dir   = ray_vec / max(ray_len, 0.001);

  let steps     = u32(march_params.max_steps);
  let step_len  = ray_len / f32(steps);
  let dith      = dither(in.uv) * step_len;
  var pos       = camera.position + ray_dir * dith;

  let sun_dir   = normalize(-light.direction);
  let cos_theta = dot(ray_dir, sun_dir);
  let phase     = henyey_greenstein(cos_theta, march_params.scattering);

  var accum = 0.0;
  for (var i = 0u; i < steps; i++) {
    let shad     = shadow_at(pos);
    let trans    = cloud_shadow_vertical(pos);
    accum += phase * shad * trans;
    pos   += ray_dir * step_len;
  }

  let fog = clamp(accum / f32(steps), 0.0, 1.0);
  return vec4<f32>(fog, 0.0, 0.0, 1.0);
}
`,za=`// godray_composite.wgsl — Blur and composite passes for volumetric godrays.
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

  // Sky pixels: sample fog directly without depth-aware neighbor logic.
  if (depth0 >= 1.0) {
    var fog = textureSampleLevel(fog_tex, samp, in.uv, 0.0).r;
    fog = pow(max(fog, 0.0), params.fog_curve);
    let horizon_fade = smoothstep(-0.05, 0.05, -light.direction.y);
    let fog_color = light.color * light.intensity * fog * horizon_fade;
    return vec4<f32>(fog_color, 0.0);
  }

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
`,At=de,Xt=16,Fa=64;class cr extends Pe{constructor(e,t,n,o,i,a,l,c,d,f,p,h,_,m,y,g,b,w){super();s(this,"name","GodrayPass");s(this,"scattering",.3);s(this,"fogCurve",2);s(this,"maxSteps",16);s(this,"_fogA");s(this,"_fogB");s(this,"_fogAView");s(this,"_fogBView");s(this,"_hdrView");s(this,"_marchPipeline");s(this,"_blurHPipeline");s(this,"_blurVPipeline");s(this,"_compositePipeline");s(this,"_marchBG");s(this,"_blurHBG");s(this,"_blurVBG");s(this,"_compositeBG");s(this,"_marchParamsBuf");s(this,"_blurHParamsBuf");s(this,"_blurVParamsBuf");s(this,"_compParamsBuf");s(this,"_cloudDensityBuf");s(this,"_marchScratch",new Float32Array(4));s(this,"_compScratch",new Float32Array(4));s(this,"_densityScratch",new Float32Array(8));this._fogA=e,this._fogAView=t,this._fogB=n,this._fogBView=o,this._hdrView=i,this._marchPipeline=a,this._blurHPipeline=l,this._blurVPipeline=c,this._compositePipeline=d,this._marchBG=f,this._blurHBG=p,this._blurVBG=h,this._compositeBG=_,this._marchParamsBuf=m,this._blurHParamsBuf=y,this._blurVParamsBuf=g,this._compParamsBuf=b,this._cloudDensityBuf=w}static create(e,t,n,o,i,a,l){const{device:c,width:d,height:f}=e,p=Math.max(1,d>>1),h=Math.max(1,f>>1),_=c.createTexture({label:"GodrayFogA",size:{width:p,height:h},format:At,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),m=c.createTexture({label:"GodrayFogB",size:{width:p,height:h},format:At,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),y=_.createView(),g=m.createView(),b=c.createSampler({label:"GodraySampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),w=c.createSampler({label:"GodrayNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"mirror-repeat",addressModeV:"mirror-repeat",addressModeW:"mirror-repeat"}),B=c.createSampler({label:"GodrayCmpSampler",compare:"less-equal",magFilter:"linear",minFilter:"linear"}),x=c.createBuffer({label:"GodrayCloudDensity",size:Fa,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),U=c.createBuffer({label:"GodrayMarchParams",size:Xt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});c.queue.writeBuffer(U,0,new Float32Array([.3,16,0,0]).buffer);const R=c.createBuffer({label:"GodrayBlurHParams",size:Xt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});c.queue.writeBuffer(R,0,new Float32Array([1,0,0,0]).buffer);const A=c.createBuffer({label:"GodrayBlurVParams",size:Xt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});c.queue.writeBuffer(A,0,new Float32Array([0,1,0,0]).buffer);const I=c.createBuffer({label:"GodrayCompositeParams",size:Xt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});c.queue.writeBuffer(I,0,new Float32Array([0,0,2,0]).buffer);const k=c.createShaderModule({label:"GodrayMarchShader",code:Va}),v=c.createRenderPipeline({label:"GodrayMarchPipeline",layout:"auto",vertex:{module:k,entryPoint:"vs_main"},fragment:{module:k,entryPoint:"fs_march",targets:[{format:At}]},primitive:{topology:"triangle-list"}}),M=c.createBindGroup({label:"GodrayMarchBG",layout:v.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:a}},{binding:2,resource:t.depthView},{binding:3,resource:n.shadowMapView},{binding:4,resource:B},{binding:5,resource:{buffer:U}},{binding:6,resource:{buffer:x}},{binding:7,resource:l.baseView},{binding:8,resource:l.detailView},{binding:9,resource:w}]}),T=c.createShaderModule({label:"GodrayCompositeShader",code:za}),G=c.createRenderPipeline({label:"GodrayBlurHPipeline",layout:"auto",vertex:{module:T,entryPoint:"vs_main"},fragment:{module:T,entryPoint:"fs_blur",targets:[{format:At}]},primitive:{topology:"triangle-list"}}),S=c.createRenderPipeline({label:"GodrayBlurVPipeline",layout:"auto",vertex:{module:T,entryPoint:"vs_main"},fragment:{module:T,entryPoint:"fs_blur",targets:[{format:At}]},primitive:{topology:"triangle-list"}}),N=c.createRenderPipeline({label:"GodrayCompositePipeline",layout:"auto",vertex:{module:T,entryPoint:"vs_main"},fragment:{module:T,entryPoint:"fs_composite",targets:[{format:de,blend:{color:{operation:"add",srcFactor:"one",dstFactor:"one"},alpha:{operation:"add",srcFactor:"one",dstFactor:"one"}}}]},primitive:{topology:"triangle-list"}}),E=c.createBindGroup({label:"GodrayBlurHBG",layout:G.getBindGroupLayout(0),entries:[{binding:0,resource:y},{binding:1,resource:t.depthView},{binding:2,resource:b},{binding:3,resource:{buffer:R}}]}),X=c.createBindGroup({label:"GodrayBlurVBG",layout:S.getBindGroupLayout(0),entries:[{binding:0,resource:g},{binding:1,resource:t.depthView},{binding:2,resource:b},{binding:3,resource:{buffer:A}}]}),V=c.createBindGroup({label:"GodrayCompositeBG",layout:N.getBindGroupLayout(0),entries:[{binding:0,resource:y},{binding:1,resource:t.depthView},{binding:2,resource:b},{binding:3,resource:{buffer:I}},{binding:4,resource:{buffer:a}}]});return new cr(_,y,m,g,o,v,G,S,N,M,E,X,V,U,R,A,I,x)}updateParams(e){this._marchScratch[0]=this.scattering,this._marchScratch[1]=this.maxSteps,this._marchScratch[2]=0,this._marchScratch[3]=0,e.queue.writeBuffer(this._marchParamsBuf,0,this._marchScratch.buffer),this._compScratch[0]=0,this._compScratch[1]=0,this._compScratch[2]=this.fogCurve,this._compScratch[3]=0,e.queue.writeBuffer(this._compParamsBuf,0,this._compScratch.buffer)}updateCloudDensity(e,t){const n=this._densityScratch;n[0]=t.cloudBase,n[1]=t.cloudTop,n[2]=t.coverage,n[3]=t.density,n[4]=t.windOffset[0],n[5]=t.windOffset[1],n[6]=t.extinction,n[7]=0,e.queue.writeBuffer(this._cloudDensityBuf,0,n.buffer)}execute(e,t){const n=(o,i,a,l,c=!0)=>{const d=e.beginRenderPass({label:o,colorAttachments:[{view:i,clearValue:[0,0,0,0],loadOp:c?"clear":"load",storeOp:"store"}]});d.setPipeline(a),d.setBindGroup(0,l),d.draw(3),d.end()};n("GodrayMarch",this._fogAView,this._marchPipeline,this._marchBG),n("GodrayBlurH",this._fogBView,this._blurHPipeline,this._blurHBG),n("GodrayBlurV",this._fogAView,this._blurVPipeline,this._blurVBG),n("GodrayComposite",this._hdrView,this._compositePipeline,this._compositeBG,!1)}destroy(){this._fogA.destroy(),this._fogB.destroy(),this._marchParamsBuf.destroy(),this._blurHParamsBuf.destroy(),this._blurVParamsBuf.destroy(),this._compParamsBuf.destroy(),this._cloudDensityBuf.destroy()}}const Ha=`// composite.wgsl — Fog + Underwater + Tonemap merged into a single full-screen draw.
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
`,yo=64,wo=96;class ur extends Pe{constructor(e,t,n,o,i,a){super();s(this,"name","CompositePass");s(this,"depthFogEnabled",!0);s(this,"depthDensity",1);s(this,"depthBegin",32);s(this,"depthEnd",128);s(this,"depthCurve",1.5);s(this,"heightFogEnabled",!1);s(this,"heightDensity",.7);s(this,"heightMin",48);s(this,"heightMax",80);s(this,"heightCurve",1);s(this,"fogColor",[1,1,1]);s(this,"_pipeline");s(this,"_bg0");s(this,"_bg1");s(this,"_bg2");s(this,"_paramsBuf");s(this,"_starBuf");s(this,"_paramsAB",new ArrayBuffer(yo));s(this,"_paramsF",new Float32Array(this._paramsAB));s(this,"_paramsU",new Uint32Array(this._paramsAB));s(this,"_starScratch",new Float32Array(wo/4));this._pipeline=e,this._bg0=t,this._bg1=n,this._bg2=o,this._paramsBuf=i,this._starBuf=a}static create(e,t,n,o,i,a,l){const{device:c,format:d}=e,f=c.createBindGroupLayout({label:"CompositeBGL0",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),p=c.createBindGroupLayout({label:"CompositeBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),h=c.createBindGroupLayout({label:"CompositeBGL2",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),_=c.createSampler({label:"CompositeSampler",magFilter:"linear",minFilter:"linear"}),m=c.createBuffer({label:"CompositeParams",size:yo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),y=c.createBuffer({label:"CompositeStars",size:wo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),g=c.createBindGroup({label:"CompositeBG0",layout:f,entries:[{binding:0,resource:t},{binding:1,resource:n},{binding:2,resource:o},{binding:3,resource:_}]}),b=c.createBindGroup({label:"CompositeBG1",layout:p,entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:a}}]}),w=c.createBindGroup({label:"CompositeBG2",layout:h,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:y}},{binding:2,resource:{buffer:l}}]}),B=c.createShaderModule({label:"CompositeShader",code:Ha}),x=c.createPipelineLayout({bindGroupLayouts:[f,p,h]}),U=c.createRenderPipeline({label:"CompositePipeline",layout:x,vertex:{module:B,entryPoint:"vs_main"},fragment:{module:B,entryPoint:"fs_main",targets:[{format:d}]},primitive:{topology:"triangle-list"}});return new ur(U,g,b,w,m,y)}updateParams(e,t,n,o,i,a){const l=this._paramsF,c=this._paramsU;let d=0;this.depthFogEnabled&&(d|=1),this.heightFogEnabled&&(d|=2);let f=0;o&&(f|=1),i&&(f|=2),a&&(f|=4),l[0]=this.fogColor[0],l[1]=this.fogColor[1],l[2]=this.fogColor[2],l[3]=this.depthDensity,l[4]=this.depthBegin,l[5]=this.depthEnd,l[6]=this.depthCurve,l[7]=this.heightDensity,l[8]=this.heightMin,l[9]=this.heightMax,l[10]=this.heightCurve,c[11]=d,l[12]=n,l[13]=t?1:0,c[14]=f,l[15]=0,e.queue.writeBuffer(this._paramsBuf,0,this._paramsAB)}updateStars(e,t,n,o){const i=this._starScratch;i.set(t.data,0),i[16]=n.x,i[17]=n.y,i[18]=n.z,i[19]=0,i[20]=o.x,i[21]=o.y,i[22]=o.z,i[23]=0,e.queue.writeBuffer(this._starBuf,0,i.buffer)}execute(e,t){const n=e.beginRenderPass({label:"CompositePass",colorAttachments:[{view:t.getCurrentTexture().createView(),clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._bg0),n.setBindGroup(1,this._bg1),n.setBindGroup(2,this._bg2),n.draw(3),n.end()}destroy(){this._paramsBuf.destroy(),this._starBuf.destroy()}}const xo=64*4+16+16,Wa=128;class dr extends Pe{constructor(e,t,n,o,i){super();s(this,"name","GeometryPass");s(this,"_gbuffer");s(this,"_cameraBGL");s(this,"_modelBGL");s(this,"_pipelineCache",new Map);s(this,"_cameraBuffer");s(this,"_cameraBindGroup");s(this,"_modelBuffers",[]);s(this,"_modelBindGroups",[]);s(this,"_drawItems",[]);s(this,"_modelData",new Float32Array(32));s(this,"_cameraScratch",new Float32Array(xo/4));this._gbuffer=e,this._cameraBGL=t,this._modelBGL=n,this._cameraBuffer=o,this._cameraBindGroup=i}static create(e,t){const{device:n}=e,o=n.createBindGroupLayout({label:"GeomCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),i=n.createBindGroupLayout({label:"GeomModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),a=n.createBuffer({label:"GeomCameraBuffer",size:xo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),l=n.createBindGroup({label:"GeomCameraBindGroup",layout:o,entries:[{binding:0,resource:{buffer:a}}]});return new dr(t,o,i,a,l)}setDrawItems(e){this._drawItems=e}updateCamera(e,t,n,o,i,a,l,c){const d=this._cameraScratch;d.set(t.data,0),d.set(n.data,16),d.set(o.data,32),d.set(i.data,48),d[64]=a.x,d[65]=a.y,d[66]=a.z,d[67]=l,d[68]=c,e.queue.writeBuffer(this._cameraBuffer,0,d.buffer)}execute(e,t){var i,a;const{device:n}=t;this._ensurePerDrawBuffers(n,this._drawItems.length);for(let l=0;l<this._drawItems.length;l++){const c=this._drawItems[l],d=this._modelData;d.set(c.modelMatrix.data,0),d.set(c.normalMatrix.data,16),t.queue.writeBuffer(this._modelBuffers[l],0,d.buffer),(a=(i=c.material).update)==null||a.call(i,t.queue)}const o=e.beginRenderPass({label:"GeometryPass",colorAttachments:[{view:this._gbuffer.albedoRoughnessView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"},{view:this._gbuffer.normalMetallicView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});o.setBindGroup(0,this._cameraBindGroup);for(let l=0;l<this._drawItems.length;l++){const c=this._drawItems[l];o.setPipeline(this._getPipeline(n,c.material)),o.setBindGroup(1,this._modelBindGroups[l]),o.setBindGroup(2,c.material.getBindGroup(n)),o.setVertexBuffer(0,c.mesh.vertexBuffer),o.setIndexBuffer(c.mesh.indexBuffer,"uint32"),o.drawIndexed(c.mesh.indexCount)}o.end()}_getPipeline(e,t){let n=this._pipelineCache.get(t.shaderId);if(n)return n;const o=e.createShaderModule({label:`GeometryShader[${t.shaderId}]`,code:t.getShaderCode(Lt.Geometry)});return n=e.createRenderPipeline({label:`GeometryPipeline[${t.shaderId}]`,layout:e.createPipelineLayout({bindGroupLayouts:[this._cameraBGL,this._modelBGL,t.getBindGroupLayout(e)]}),vertex:{module:o,entryPoint:"vs_main",buffers:[{arrayStride:Qn,attributes:er}]},fragment:{module:o,entryPoint:"fs_main",targets:[{format:"rgba8unorm"},{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),this._pipelineCache.set(t.shaderId,n),n}_ensurePerDrawBuffers(e,t){for(;this._modelBuffers.length<t;){const n=e.createBuffer({size:Wa,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._modelBuffers.push(n),this._modelBindGroups.push(e.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:n}}]}))}}destroy(){this._cameraBuffer.destroy();for(const e of this._modelBuffers)e.destroy()}}const ja=`// GBuffer fill pass for voxel chunk geometry.
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
`,Bo=64*4+16+16,qa=16,Ut=256,Ya=2048,Xa=5,ut=Xa*4,Cn=16;class fr extends Pe{constructor(e,t,n,o,i,a,l,c,d,f){super();s(this,"name","WorldGeometryPass");s(this,"_gbuffer");s(this,"_device");s(this,"_opaquePipeline");s(this,"_transparentPipeline");s(this,"_propPipeline");s(this,"_cameraBuffer");s(this,"_cameraBindGroup");s(this,"_sharedBindGroup");s(this,"_chunkUniformBuffer");s(this,"_chunkBindGroup");s(this,"_slotFreeList",[]);s(this,"_slotHighWater",0);s(this,"_chunks",new Map);s(this,"_frustumPlanes",new Float32Array(24));s(this,"drawCalls",0);s(this,"triangles",0);s(this,"_cameraData",new Float32Array(Bo/4));s(this,"_chunkUniformAB",new ArrayBuffer(32));s(this,"_chunkUniformF",new Float32Array(this._chunkUniformAB));s(this,"_chunkUniformU",new Uint32Array(this._chunkUniformAB));s(this,"_debugChunks",!1);this._device=e,this._gbuffer=t,this._opaquePipeline=n,this._transparentPipeline=o,this._propPipeline=i,this._cameraBuffer=a,this._cameraBindGroup=l,this._sharedBindGroup=c,this._chunkUniformBuffer=d,this._chunkBindGroup=f}static create(e,t,n){const{device:o}=e,i=o.createBindGroupLayout({label:"ChunkCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),a=o.createBindGroupLayout({label:"ChunkSharedBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),l=o.createBindGroupLayout({label:"ChunkOffsetBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform",hasDynamicOffset:!0,minBindingSize:32}}]}),c=L.MAX,d=o.createBuffer({label:"BlockDataBuffer",size:Math.max(c*qa,16),usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),f=Pi,p=new Uint32Array(c*4);for(let k=0;k<c;k++){const v=Dt[k];v&&(p[k*4+0]=v.sideFace.y*f+v.sideFace.x,p[k*4+1]=v.bottomFace.y*f+v.bottomFace.x,p[k*4+2]=v.topFace.y*f+v.topFace.x)}o.queue.writeBuffer(d,0,p);const h=o.createSampler({label:"ChunkAtlasSampler",magFilter:"nearest",minFilter:"nearest",addressModeU:"repeat",addressModeV:"repeat"}),_=o.createBindGroup({label:"ChunkSharedBG",layout:a,entries:[{binding:0,resource:n.colorAtlas.view},{binding:1,resource:n.normalAtlas.view},{binding:2,resource:n.merAtlas.view},{binding:3,resource:h},{binding:4,resource:{buffer:d}}]}),m=o.createBuffer({label:"ChunkCameraBuffer",size:Bo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),y=o.createBindGroup({label:"ChunkCameraBG",layout:i,entries:[{binding:0,resource:{buffer:m}}]}),g=o.createShaderModule({label:"ChunkGeometryShader",code:ja}),b=o.createPipelineLayout({bindGroupLayouts:[i,a,l]}),w={arrayStride:ut,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32"},{shaderLocation:2,offset:16,format:"float32"}]},B=[{format:"rgba8unorm"},{format:"rgba16float"}],x=o.createRenderPipeline({label:"ChunkOpaquePipeline",layout:b,vertex:{module:g,entryPoint:"vs_main",buffers:[w]},fragment:{module:g,entryPoint:"fs_opaque",targets:B},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),U=o.createRenderPipeline({label:"ChunkTransparentPipeline",layout:b,vertex:{module:g,entryPoint:"vs_main",buffers:[w]},fragment:{module:g,entryPoint:"fs_transparent",targets:B},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),R=o.createRenderPipeline({label:"ChunkPropPipeline",layout:b,vertex:{module:g,entryPoint:"vs_prop",buffers:[w]},fragment:{module:g,entryPoint:"fs_prop",targets:B},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}}),A=o.createBuffer({label:"ChunkUniformBuffer",size:Ya*Ut,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),I=o.createBindGroup({label:"ChunkOffsetBG",layout:l,entries:[{binding:0,resource:{buffer:A,size:32}}]});return new fr(o,t,x,U,R,m,y,_,A,I)}updateGBuffer(e){this._gbuffer=e}addChunk(e,t){const n=this._chunks.get(e);n?this._replaceMeshBuffers(n,t):this._chunks.set(e,this._createChunkGpu(e,t))}updateChunk(e,t){const n=this._chunks.get(e);n?this._replaceMeshBuffers(n,t):this._chunks.set(e,this._createChunkGpu(e,t))}removeChunk(e){var n,o,i;const t=this._chunks.get(e);t&&((n=t.opaqueBuffer)==null||n.destroy(),(o=t.transparentBuffer)==null||o.destroy(),(i=t.propBuffer)==null||i.destroy(),this._freeSlot(t.slot),this._chunks.delete(e))}updateCamera(e,t,n,o,i,a,l,c){const d=this._cameraData;d.set(t.data,0),d.set(n.data,16),d.set(o.data,32),d.set(i.data,48),d[64]=a.x,d[65]=a.y,d[66]=a.z,d[67]=l,d[68]=c,e.queue.writeBuffer(this._cameraBuffer,0,d.buffer),this._extractFrustumPlanes(o.data)}_extractFrustumPlanes(e){const t=this._frustumPlanes;t[0]=e[3]+e[0],t[1]=e[7]+e[4],t[2]=e[11]+e[8],t[3]=e[15]+e[12],t[4]=e[3]-e[0],t[5]=e[7]-e[4],t[6]=e[11]-e[8],t[7]=e[15]-e[12],t[8]=e[3]+e[1],t[9]=e[7]+e[5],t[10]=e[11]+e[9],t[11]=e[15]+e[13],t[12]=e[3]-e[1],t[13]=e[7]-e[5],t[14]=e[11]-e[9],t[15]=e[15]-e[13],t[16]=e[2],t[17]=e[6],t[18]=e[10],t[19]=e[14],t[20]=e[3]-e[2],t[21]=e[7]-e[6],t[22]=e[11]-e[10],t[23]=e[15]-e[14]}setDebugChunks(e){if(this._debugChunks!==e){this._debugChunks=e;for(const[t,n]of this._chunks)this._writeChunkUniforms(n.slot,n.ox,n.oy,n.oz)}}_isVisible(e,t,n){const o=this._frustumPlanes,i=e+Cn,a=t+Cn,l=n+Cn;for(let c=0;c<6;c++){const d=o[c*4],f=o[c*4+1],p=o[c*4+2],h=o[c*4+3];if(d*(d>=0?i:e)+f*(f>=0?a:t)+p*(p>=0?l:n)+h<0)return!1}return!0}execute(e,t){const n=e.beginRenderPass({label:"WorldGeometryPass",colorAttachments:[{view:this._gbuffer.albedoRoughnessView,loadOp:"load",storeOp:"store"},{view:this._gbuffer.normalMetallicView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthLoadOp:"load",depthStoreOp:"store"}});n.setBindGroup(0,this._cameraBindGroup),n.setBindGroup(1,this._sharedBindGroup);let o=0,i=0;const a=[];for(const l of this._chunks.values())this._isVisible(l.ox,l.oy,l.oz)&&a.push(l);n.setPipeline(this._opaquePipeline);for(const l of a)l.opaqueBuffer&&l.opaqueCount>0&&(n.setBindGroup(2,this._chunkBindGroup,[l.slot*Ut]),n.setVertexBuffer(0,l.opaqueBuffer),n.draw(l.opaqueCount),o++,i+=l.opaqueCount/3);n.setPipeline(this._transparentPipeline);for(const l of a)l.transparentBuffer&&l.transparentCount>0&&(n.setBindGroup(2,this._chunkBindGroup,[l.slot*Ut]),n.setVertexBuffer(0,l.transparentBuffer),n.draw(l.transparentCount),o++,i+=l.transparentCount/3);n.setPipeline(this._propPipeline);for(const l of a)l.propBuffer&&l.propCount>0&&(n.setBindGroup(2,this._chunkBindGroup,[l.slot*Ut]),n.setVertexBuffer(0,l.propBuffer),n.draw(l.propCount),o++,i+=l.propCount/3);this.drawCalls=o,this.triangles=i,n.end()}destroy(){var e,t,n;this._cameraBuffer.destroy(),this._chunkUniformBuffer.destroy();for(const o of this._chunks.values())(e=o.opaqueBuffer)==null||e.destroy(),(t=o.transparentBuffer)==null||t.destroy(),(n=o.propBuffer)==null||n.destroy();this._chunks.clear()}_allocSlot(){return this._slotFreeList.length>0?this._slotFreeList.pop():this._slotHighWater++}_freeSlot(e){this._slotFreeList.push(e)}_writeChunkUniforms(e,t,n,o){const i=t*73856093^n*19349663^o*83492791,a=(i&255)/255*.6+.4,l=(i>>8&255)/255*.6+.4,c=(i>>16&255)/255*.6+.4,d=this._chunkUniformAB,f=this._chunkUniformF,p=this._chunkUniformU;f[0]=t,f[1]=n,f[2]=o,p[3]=this._debugChunks?1:0,f[4]=a,f[5]=l,f[6]=c,f[7]=0,this._device.queue.writeBuffer(this._chunkUniformBuffer,e*Ut,d)}_createChunkGpu(e,t){const n=this._allocSlot();this._writeChunkUniforms(n,e.globalPosition.x,e.globalPosition.y,e.globalPosition.z);const o={ox:e.globalPosition.x,oy:e.globalPosition.y,oz:e.globalPosition.z,slot:n,opaqueBuffer:null,opaqueCount:0,transparentBuffer:null,transparentCount:0,propBuffer:null,propCount:0};return this._replaceMeshBuffers(o,t),o}_replaceMeshBuffers(e,t){var n,o,i;if((n=e.opaqueBuffer)==null||n.destroy(),(o=e.transparentBuffer)==null||o.destroy(),(i=e.propBuffer)==null||i.destroy(),e.opaqueBuffer=null,e.transparentBuffer=null,e.propBuffer=null,e.opaqueCount=t.opaqueCount,e.transparentCount=t.transparentCount,e.propCount=t.propCount,t.opaqueCount>0){const a=this._device.createBuffer({label:"ChunkOpaqueBuf",size:t.opaqueCount*ut,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.opaque.buffer,0,t.opaqueCount*ut),e.opaqueBuffer=a}if(t.transparentCount>0){const a=this._device.createBuffer({label:"ChunkTransparentBuf",size:t.transparentCount*ut,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.transparent.buffer,0,t.transparentCount*ut),e.transparentBuffer=a}if(t.propCount>0){const a=this._device.createBuffer({label:"ChunkPropBuf",size:t.propCount*ut,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.prop.buffer,0,t.propCount*ut),e.propBuffer=a}}}const $a=`// Depth of Field: prefilter (CoC + 2x downsample) then fused disc-blur + composite.

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
`,Za=32;class pr extends Pe{constructor(e,t,n,o,i,a,l,c,d,f){super();s(this,"name","DofPass");s(this,"resultView");s(this,"_result");s(this,"_half");s(this,"_halfView");s(this,"_prefilterPipeline");s(this,"_compositePipeline");s(this,"_uniformBuffer");s(this,"_scratch",new Float32Array(8));s(this,"_prefilterBG");s(this,"_compBG0");s(this,"_compBG1");this._result=e,this.resultView=t,this._half=n,this._halfView=o,this._prefilterPipeline=i,this._compositePipeline=a,this._uniformBuffer=l,this._prefilterBG=c,this._compBG0=d,this._compBG1=f}static create(e,t,n){const{device:o,width:i,height:a}=e,l=Math.max(1,i>>1),c=Math.max(1,a>>1),d=o.createTexture({label:"DofHalf",size:{width:l,height:c},format:de,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),f=o.createTexture({label:"DofResult",size:{width:i,height:a},format:de,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),p=d.createView(),h=f.createView(),_=o.createBuffer({label:"DofUniforms",size:Za,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});o.queue.writeBuffer(_,0,new Float32Array([30,60,6,.1,1e3,0,0,0]).buffer);const m=o.createSampler({label:"DofSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),y=o.createBindGroupLayout({label:"DofBGL0Prefilter",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),g=o.createBindGroupLayout({label:"DofBGL0Composite",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),b=o.createBindGroupLayout({label:"DofBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),w=o.createShaderModule({label:"DofShader",code:$a}),B=o.createRenderPipeline({label:"DofPrefilterPipeline",layout:o.createPipelineLayout({bindGroupLayouts:[y]}),vertex:{module:w,entryPoint:"vs_main"},fragment:{module:w,entryPoint:"fs_prefilter",targets:[{format:de}]},primitive:{topology:"triangle-list"}}),x=o.createRenderPipeline({label:"DofCompositePipeline",layout:o.createPipelineLayout({bindGroupLayouts:[g,b]}),vertex:{module:w,entryPoint:"vs_main"},fragment:{module:w,entryPoint:"fs_composite",targets:[{format:de}]},primitive:{topology:"triangle-list"}}),U=o.createBindGroup({label:"DofPrefilterBG",layout:y,entries:[{binding:0,resource:{buffer:_}},{binding:1,resource:t},{binding:2,resource:n},{binding:3,resource:m}]}),R=o.createBindGroup({label:"DofCompBG0",layout:g,entries:[{binding:0,resource:{buffer:_}},{binding:1,resource:t},{binding:3,resource:m}]}),A=o.createBindGroup({label:"DofCompBG1",layout:b,entries:[{binding:0,resource:p}]});return new pr(f,h,d,p,B,x,_,U,R,A)}updateParams(e,t=30,n=60,o=6,i=.1,a=1e3,l=1){this._scratch[0]=t,this._scratch[1]=n,this._scratch[2]=o,this._scratch[3]=i,this._scratch[4]=a,this._scratch[5]=l,this._scratch[6]=0,this._scratch[7]=0,e.device.queue.writeBuffer(this._uniformBuffer,0,this._scratch.buffer)}execute(e,t){{const n=e.beginRenderPass({label:"DofPrefilter",colorAttachments:[{view:this._halfView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._prefilterPipeline),n.setBindGroup(0,this._prefilterBG),n.draw(3),n.end()}{const n=e.beginRenderPass({label:"DofComposite",colorAttachments:[{view:this.resultView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._compositePipeline),n.setBindGroup(0,this._compBG0),n.setBindGroup(1,this._compBG1),n.draw(3),n.end()}}destroy(){this._result.destroy(),this._half.destroy(),this._uniformBuffer.destroy()}}const Ka=`// SSAO: hemisphere sampling in view space.
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
`,Ja=`// SSAO blur: 4×4 box blur to smooth raw SSAO output.

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
`,$t="r8unorm",Ln=16,Qa=464;function es(){const u=new Float32Array(Ln*4);for(let r=0;r<Ln;r++){const e=Math.random(),t=Math.random()*Math.PI*2,n=Math.sqrt(1-e*e),o=.1+.9*(r/Ln)**2;u[r*4+0]=n*Math.cos(t)*o,u[r*4+1]=n*Math.sin(t)*o,u[r*4+2]=e*o,u[r*4+3]=0}return u}function ts(){const u=new Uint8Array(64);for(let r=0;r<16;r++){const e=Math.random()*Math.PI*2;u[r*4+0]=Math.round((Math.cos(e)*.5+.5)*255),u[r*4+1]=Math.round((Math.sin(e)*.5+.5)*255),u[r*4+2]=128,u[r*4+3]=255}return u}class hr extends Pe{constructor(e,t,n,o,i,a,l,c,d,f,p){super();s(this,"name","SSAOPass");s(this,"aoView");s(this,"_raw");s(this,"_blurred");s(this,"_rawView");s(this,"_ssaoPipeline");s(this,"_blurPipeline");s(this,"_uniformBuffer");s(this,"_noiseTex");s(this,"_cameraScratch",new Float32Array(48));s(this,"_paramsScratch",new Float32Array(4));s(this,"_ssaoBG0");s(this,"_ssaoBG1");s(this,"_blurBG");this._raw=e,this._rawView=t,this._blurred=n,this.aoView=o,this._ssaoPipeline=i,this._blurPipeline=a,this._uniformBuffer=l,this._noiseTex=c,this._ssaoBG0=d,this._ssaoBG1=f,this._blurBG=p}static create(e,t){const{device:n,width:o,height:i}=e,a=Math.max(1,o>>1),l=Math.max(1,i>>1),c=n.createTexture({label:"SsaoRaw",size:{width:a,height:l},format:$t,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),d=n.createTexture({label:"SsaoBlurred",size:{width:a,height:l},format:$t,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),f=c.createView(),p=d.createView(),h=n.createTexture({label:"SsaoNoise",size:{width:4,height:4},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});n.queue.writeTexture({texture:h},ts().buffer,{bytesPerRow:4*4,rowsPerImage:4},{width:4,height:4});const _=h.createView(),m=n.createBuffer({label:"SsaoUniforms",size:Qa,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});n.queue.writeBuffer(m,208,es().buffer),n.queue.writeBuffer(m,192,new Float32Array([1,.005,2,0]).buffer);const y=n.createSampler({label:"SsaoBlurSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),g=n.createBindGroupLayout({label:"SsaoBGL0",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),b=n.createBindGroupLayout({label:"SsaoBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),w=n.createBindGroupLayout({label:"SsaoBlurBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),B=n.createShaderModule({label:"SsaoShader",code:Ka}),x=n.createShaderModule({label:"SsaoBlurShader",code:Ja}),U=n.createRenderPipeline({label:"SsaoPipeline",layout:n.createPipelineLayout({bindGroupLayouts:[g,b]}),vertex:{module:B,entryPoint:"vs_main"},fragment:{module:B,entryPoint:"fs_ssao",targets:[{format:$t}]},primitive:{topology:"triangle-list"}}),R=n.createRenderPipeline({label:"SsaoBlurPipeline",layout:n.createPipelineLayout({bindGroupLayouts:[w]}),vertex:{module:x,entryPoint:"vs_main"},fragment:{module:x,entryPoint:"fs_blur",targets:[{format:$t}]},primitive:{topology:"triangle-list"}}),A=n.createBindGroup({label:"SsaoBG0",layout:g,entries:[{binding:0,resource:{buffer:m}}]}),I=n.createBindGroup({label:"SsaoBG1",layout:b,entries:[{binding:0,resource:t.normalMetallicView},{binding:1,resource:t.depthView},{binding:2,resource:_}]}),k=n.createBindGroup({label:"SsaoBlurBG",layout:w,entries:[{binding:0,resource:f},{binding:1,resource:y}]});return new hr(c,f,d,p,U,R,m,h,A,I,k)}updateCamera(e,t,n,o){const i=this._cameraScratch;i.set(t.data,0),i.set(n.data,16),i.set(o.data,32),e.device.queue.writeBuffer(this._uniformBuffer,0,i.buffer)}updateParams(e,t=1,n=.005,o=2){this._paramsScratch[0]=t,this._paramsScratch[1]=n,this._paramsScratch[2]=o,this._paramsScratch[3]=0,e.device.queue.writeBuffer(this._uniformBuffer,192,this._paramsScratch.buffer)}execute(e,t){{const n=e.beginRenderPass({label:"SSAOPass",colorAttachments:[{view:this._rawView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._ssaoPipeline),n.setBindGroup(0,this._ssaoBG0),n.setBindGroup(1,this._ssaoBG1),n.draw(3),n.end()}{const n=e.beginRenderPass({label:"SSAOBlur",colorAttachments:[{view:this.aoView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._blurPipeline),n.setBindGroup(0,this._blurBG),n.draw(3),n.end()}}destroy(){this._raw.destroy(),this._blurred.destroy(),this._uniformBuffer.destroy(),this._noiseTex.destroy()}}const ns=`// Screen-Space Global Illumination — ray march pass.
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
`,rs=`// Screen-Space Global Illumination — temporal accumulation pass.
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
`,So=368,os={numRays:4,numSteps:16,radius:3,thickness:.5,strength:1};function is(){const u=new Uint8Array(new ArrayBuffer(64));for(let r=0;r<16;r++){const e=Math.random()*Math.PI*2;u[r*4+0]=Math.round((Math.cos(e)*.5+.5)*255),u[r*4+1]=Math.round((Math.sin(e)*.5+.5)*255),u[r*4+2]=128,u[r*4+3]=255}return u}class _r extends Pe{constructor(e,t,n,o,i,a,l,c,d,f,p,h,_,m,y,g){super();s(this,"name","SSGIPass");s(this,"resultView");s(this,"_uniformBuffer");s(this,"_noiseTexture");s(this,"_rawTexture");s(this,"_rawView");s(this,"_historyTexture");s(this,"_resultTexture");s(this,"_ssgiPipeline");s(this,"_temporalPipeline");s(this,"_ssgiBG0");s(this,"_ssgiBG1");s(this,"_tempBG0");s(this,"_tempBG1");s(this,"_settings");s(this,"_frameIndex",0);s(this,"_scratch",new Float32Array(So/4));s(this,"_scratchU32",new Uint32Array(this._scratch.buffer));s(this,"_width");s(this,"_height");this._uniformBuffer=e,this._noiseTexture=t,this._rawTexture=n,this._rawView=o,this._historyTexture=i,this._resultTexture=a,this.resultView=l,this._ssgiPipeline=c,this._temporalPipeline=d,this._ssgiBG0=f,this._ssgiBG1=p,this._tempBG0=h,this._tempBG1=_,this._settings=m,this._width=y,this._height=g}static create(e,t,n,o=os){const{device:i,width:a,height:l}=e,c=i.createBuffer({label:"SSGIUniforms",size:So,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),d=i.createTexture({label:"SSGINoise",size:{width:4,height:4},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});i.queue.writeTexture({texture:d},is(),{bytesPerRow:4*4,rowsPerImage:4},{width:4,height:4});const f=d.createView(),p=i.createTexture({label:"SSGIRaw",size:{width:a,height:l},format:de,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),h=p.createView(),_=i.createTexture({label:"SSGIHistory",size:{width:a,height:l},format:de,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),m=_.createView(),y=i.createTexture({label:"SSGIResult",size:{width:a,height:l},format:de,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),g=y.createView(),b=i.createSampler({label:"SSGILinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),w=i.createBindGroupLayout({label:"SSGIUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),B=i.createBindGroupLayout({label:"SSGITexBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),x=i.createBindGroupLayout({label:"SSGITempTexBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),U=i.createBindGroup({label:"SSGIUniformBG",layout:w,entries:[{binding:0,resource:{buffer:c}}]}),R=i.createBindGroup({label:"SSGITexBG",layout:B,entries:[{binding:0,resource:t.depthView},{binding:1,resource:t.normalMetallicView},{binding:2,resource:n},{binding:3,resource:f},{binding:4,resource:b}]}),A=i.createBindGroup({label:"SSGITempUniformBG",layout:w,entries:[{binding:0,resource:{buffer:c}}]}),I=i.createBindGroup({label:"SSGITempTexBG",layout:x,entries:[{binding:0,resource:h},{binding:1,resource:m},{binding:2,resource:t.depthView},{binding:3,resource:b}]}),k=i.createShaderModule({label:"SSGIShader",code:ns}),v=i.createShaderModule({label:"SSGITempShader",code:rs}),M=i.createRenderPipeline({label:"SSGIPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[w,B]}),vertex:{module:k,entryPoint:"vs_main"},fragment:{module:k,entryPoint:"fs_ssgi",targets:[{format:de}]},primitive:{topology:"triangle-list"}}),T=i.createRenderPipeline({label:"SSGITempPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[w,x]}),vertex:{module:v,entryPoint:"vs_main"},fragment:{module:v,entryPoint:"fs_temporal",targets:[{format:de}]},primitive:{topology:"triangle-list"}});return new _r(c,d,p,h,_,y,g,M,T,U,R,A,I,o,a,l)}updateCamera(e,t,n,o,i,a,l){const c=this._scratch;c.set(t.data,0),c.set(n.data,16),c.set(o.data,32),c.set(i.data,48),c.set(a.data,64),c[80]=l.x,c[81]=l.y,c[82]=l.z;const d=this._scratchU32;d[83]=this._settings.numRays,d[84]=this._settings.numSteps,c[85]=this._settings.radius,c[86]=this._settings.thickness,c[87]=this._settings.strength,d[88]=this._frameIndex++,e.queue.writeBuffer(this._uniformBuffer,0,c.buffer)}updateSettings(e){this._settings={...this._settings,...e}}execute(e,t){{const n=e.beginRenderPass({label:"SSGIRayMarch",colorAttachments:[{view:this._rawView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._ssgiPipeline),n.setBindGroup(0,this._ssgiBG0),n.setBindGroup(1,this._ssgiBG1),n.draw(3),n.end()}{const n=e.beginRenderPass({label:"SSGITemporal",colorAttachments:[{view:this.resultView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]});n.setPipeline(this._temporalPipeline),n.setBindGroup(0,this._tempBG0),n.setBindGroup(1,this._tempBG1),n.draw(3),n.end()}e.copyTextureToTexture({texture:this._resultTexture},{texture:this._historyTexture},{width:this._width,height:this._height})}destroy(){this._uniformBuffer.destroy(),this._noiseTexture.destroy(),this._rawTexture.destroy(),this._historyTexture.destroy(),this._resultTexture.destroy()}}const as=`// VSM shadow map generation for point and spot lights.
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
`,Zt=32,Kt=32,St=4,st=8,Jt=256,Qt=512,We=256,Po=80,ss=64,ls=6*St,cs=ls+st;class mr extends Pe{constructor(e,t,n,o,i,a,l,c,d,f,p,h,_,m){super();s(this,"name","PointSpotShadowPass");s(this,"pointVsmView");s(this,"spotVsmView");s(this,"projTexView");s(this,"_pointVsmTex");s(this,"_spotVsmTex");s(this,"_projTexArray");s(this,"_pointDepth");s(this,"_spotDepth");s(this,"_pointFaceViews");s(this,"_spotFaceViews");s(this,"_pointDepthView");s(this,"_spotDepthView");s(this,"_pointPipeline");s(this,"_spotPipeline");s(this,"_shadowBufs");s(this,"_shadowBGs");s(this,"_modelBufs",[]);s(this,"_modelBGs",[]);s(this,"_modelBGL");s(this,"_shadowScratch",new Float32Array(Po/4));s(this,"_snapshot",[]);s(this,"_pointLights",[]);s(this,"_spotLights",[]);this._pointVsmTex=e,this._spotVsmTex=t,this._projTexArray=n,this._pointDepth=o,this._spotDepth=i,this._pointFaceViews=a,this._spotFaceViews=l,this._pointDepthView=c,this._spotDepthView=d,this._pointPipeline=f,this._spotPipeline=p,this._shadowBufs=h,this._shadowBGs=_,this._modelBGL=m,this.pointVsmView=e.createView({dimension:"cube-array",arrayLayerCount:St*6}),this.spotVsmView=t.createView({dimension:"2d-array"}),this.projTexView=n.createView({dimension:"2d-array"})}static create(e){const{device:t}=e,n=t.createTexture({label:"PointVSM",size:{width:Jt,height:Jt,depthOrArrayLayers:St*6},format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),o=t.createTexture({label:"SpotVSM",size:{width:Qt,height:Qt,depthOrArrayLayers:st},format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),i=t.createTexture({label:"ProjTexArray",size:{width:We,height:We,depthOrArrayLayers:st},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),a=new Uint8Array(We*We*4).fill(255);for(let R=0;R<st;R++)t.queue.writeTexture({texture:i,origin:{x:0,y:0,z:R}},a,{bytesPerRow:We*4,rowsPerImage:We},{width:We,height:We,depthOrArrayLayers:1});const l=t.createTexture({label:"PointShadowDepth",size:{width:Jt,height:Jt},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),c=t.createTexture({label:"SpotShadowDepth",size:{width:Qt,height:Qt},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),d=Array.from({length:St*6},(R,A)=>n.createView({dimension:"2d",baseArrayLayer:A,arrayLayerCount:1})),f=Array.from({length:st},(R,A)=>o.createView({dimension:"2d",baseArrayLayer:A,arrayLayerCount:1})),p=l.createView(),h=c.createView(),_=t.createBindGroupLayout({label:"PSShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),m=t.createBindGroupLayout({label:"PSModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),y=[],g=[];for(let R=0;R<cs;R++){const A=t.createBuffer({label:`PSShadowUniform ${R}`,size:Po,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});y.push(A),g.push(t.createBindGroup({label:`PSShadowBG ${R}`,layout:_,entries:[{binding:0,resource:{buffer:A}}]}))}const b=t.createPipelineLayout({bindGroupLayouts:[_,m]}),w=t.createShaderModule({label:"PointSpotShadowShader",code:as}),B={module:w,buffers:[{arrayStride:Qn,attributes:[er[0]]}]},x=t.createRenderPipeline({label:"PointShadowPipeline",layout:b,vertex:{...B,entryPoint:"vs_point"},fragment:{module:w,entryPoint:"fs_point",targets:[{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),U=t.createRenderPipeline({label:"SpotShadowPipeline",layout:b,vertex:{...B,entryPoint:"vs_spot"},fragment:{module:w,entryPoint:"fs_spot",targets:[{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}});return new mr(n,o,i,l,c,d,f,p,h,x,U,y,g,m)}update(e,t,n){this._pointLights=e,this._spotLights=t,this._snapshot=n}setProjectionTexture(e,t,n){e.copyTextureToTexture({texture:n},{texture:this._projTexArray,origin:{x:0,y:0,z:t}},{width:We,height:We,depthOrArrayLayers:1})}execute(e,t){const{device:n}=t,o=this._snapshot;this._ensureModelBuffers(n,o.length);for(let c=0;c<this._spotLights.length&&c<st;c++){const d=this._spotLights[c];d.projectionTexture&&this.setProjectionTexture(e,c,d.projectionTexture)}for(let c=0;c<o.length;c++)t.queue.writeBuffer(this._modelBufs[c],0,o[c].modelMatrix.data.buffer);let i=0,a=0;for(const c of this._pointLights){if(!c.castShadow||a>=St)continue;const d=c.worldPosition(),f=c.cubeFaceViewProjs(),p=this._shadowScratch;p[16]=d.x,p[17]=d.y,p[18]=d.z,p[19]=c.radius;for(let h=0;h<6;h++){p.set(f[h].data,0),t.queue.writeBuffer(this._shadowBufs[i],0,p.buffer);const _=a*6+h,m=e.beginRenderPass({label:`PointShadow light${a} face${h}`,colorAttachments:[{view:this._pointFaceViews[_],clearValue:{r:1,g:1,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._pointDepthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"discard"}});m.setPipeline(this._pointPipeline),m.setBindGroup(0,this._shadowBGs[i]),this._drawItems(m,o),m.end(),i++}a++}let l=0;for(const c of this._spotLights){if(!c.castShadow||l>=st)continue;const d=c.lightViewProj(),f=c.worldPosition(),p=this._shadowScratch;p.set(d.data,0),p[16]=f.x,p[17]=f.y,p[18]=f.z,p[19]=c.range,t.queue.writeBuffer(this._shadowBufs[i],0,p.buffer);const h=e.beginRenderPass({label:`SpotShadow light${l}`,colorAttachments:[{view:this._spotFaceViews[l],clearValue:{r:1,g:1,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._spotDepthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"discard"}});h.setPipeline(this._spotPipeline),h.setBindGroup(0,this._shadowBGs[i]),this._drawItems(h,o),h.end(),i++,l++}}_drawItems(e,t){for(let n=0;n<t.length;n++){const{mesh:o}=t[n];e.setBindGroup(1,this._modelBGs[n]),e.setVertexBuffer(0,o.vertexBuffer),e.setIndexBuffer(o.indexBuffer,"uint32"),e.drawIndexed(o.indexCount)}}_ensureModelBuffers(e,t){for(;this._modelBufs.length<t;){const n=e.createBuffer({label:`PSModelUniform ${this._modelBufs.length}`,size:ss,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._modelBufs.push(n),this._modelBGs.push(e.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:n}}]}))}}destroy(){this._pointVsmTex.destroy(),this._spotVsmTex.destroy(),this._projTexArray.destroy(),this._pointDepth.destroy(),this._spotDepth.destroy();for(const e of this._shadowBufs)e.destroy();for(const e of this._modelBufs)e.destroy()}}const us=`// Water pass — forward-rendered on top of the deferred-lit HDR buffer.
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
`,To=64*4+16+16,ds=16,fs=16,ps=3,Rn=ps*4,Nn=16;class pt extends Pe{constructor(e,t,n,o,i,a,l,c,d,f,p,h,_,m,y){super();s(this,"name","WaterPass");s(this,"_device");s(this,"_hdrTexture");s(this,"_hdrView");s(this,"_refractionTex");s(this,"_pipeline");s(this,"_cameraBuffer");s(this,"_waterBuffer");s(this,"_cameraBG");s(this,"_waterBG");s(this,"_sceneBG");s(this,"_sceneBGL");s(this,"_chunkBGL");s(this,"_skyTexture");s(this,"_dudvTexture");s(this,"_gradientTexture");s(this,"_chunks",new Map);s(this,"_frustumPlanes",new Float32Array(24));s(this,"_cameraScratch",new Float32Array(To/4));s(this,"_waterScratch",new Float32Array(4));this._device=e,this._hdrTexture=t,this._hdrView=n,this._refractionTex=o,this._pipeline=i,this._cameraBuffer=a,this._waterBuffer=l,this._cameraBG=c,this._waterBG=d,this._sceneBG=f,this._sceneBGL=p,this._chunkBGL=h,this._skyTexture=_,this._dudvTexture=m,this._gradientTexture=y}static create(e,t,n,o,i,a,l){const{device:c,width:d,height:f}=e,p=c.createBindGroupLayout({label:"WaterCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),h=c.createBindGroupLayout({label:"WaterUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),_=c.createBindGroupLayout({label:"WaterChunkBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),m=c.createBindGroupLayout({label:"WaterSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:5,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),{refractionTex:y,refractionView:g}=pt._makeRefractionTex(c,d,f),b=c.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"}),w=c.createBuffer({label:"WaterCameraBuffer",size:To,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),B=c.createBuffer({label:"WaterUniformBuffer",size:ds,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),x=c.createBindGroup({label:"WaterCameraBG",layout:p,entries:[{binding:0,resource:{buffer:w}}]}),U=c.createBindGroup({label:"WaterUniformBG",layout:h,entries:[{binding:0,resource:{buffer:B}}]}),R=pt._makeSceneBG(c,m,g,o,a,l,i,b),A=c.createShaderModule({label:"WaterShader",code:us}),I=c.createPipelineLayout({bindGroupLayouts:[p,h,_,m]}),k={arrayStride:Rn,attributes:[{shaderLocation:0,offset:0,format:"float32x3"}]},v=c.createRenderPipeline({label:"WaterPipeline",layout:I,vertex:{module:A,entryPoint:"vs_main",buffers:[k]},fragment:{module:A,entryPoint:"fs_main",targets:[{format:de,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},primitive:{topology:"triangle-list",cullMode:"none"}});return new pt(c,t,n,y,v,w,B,x,U,R,m,_,i,a,l)}updateRenderTargets(e,t,n,o){this._refractionTex.destroy(),this._hdrTexture=e,this._hdrView=t,o&&(this._skyTexture=o);const{width:i,height:a}=e,{refractionTex:l,refractionView:c}=pt._makeRefractionTex(this._device,i,a);this._refractionTex=l;const d=this._device.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"});this._sceneBG=pt._makeSceneBG(this._device,this._sceneBGL,c,n,this._dudvTexture,this._gradientTexture,this._skyTexture,d)}updateCamera(e,t,n,o,i,a,l,c){const d=this._cameraScratch;d.set(t.data,0),d.set(n.data,16),d.set(o.data,32),d.set(i.data,48),d[64]=a.x,d[65]=a.y,d[66]=a.z,d[67]=l,d[68]=c,e.queue.writeBuffer(this._cameraBuffer,0,d.buffer),this._extractFrustumPlanes(o.data)}_extractFrustumPlanes(e){const t=this._frustumPlanes;t[0]=e[3]+e[0],t[1]=e[7]+e[4],t[2]=e[11]+e[8],t[3]=e[15]+e[12],t[4]=e[3]-e[0],t[5]=e[7]-e[4],t[6]=e[11]-e[8],t[7]=e[15]-e[12],t[8]=e[3]+e[1],t[9]=e[7]+e[5],t[10]=e[11]+e[9],t[11]=e[15]+e[13],t[12]=e[3]-e[1],t[13]=e[7]-e[5],t[14]=e[11]-e[9],t[15]=e[15]-e[13],t[16]=e[2],t[17]=e[6],t[18]=e[10],t[19]=e[14],t[20]=e[3]-e[2],t[21]=e[7]-e[6],t[22]=e[11]-e[10],t[23]=e[15]-e[14]}_isVisible(e,t,n){const o=this._frustumPlanes,i=e+Nn,a=t+Nn,l=n+Nn;for(let c=0;c<6;c++){const d=o[c*4],f=o[c*4+1],p=o[c*4+2],h=o[c*4+3];if(d*(d>=0?i:e)+f*(f>=0?a:t)+p*(p>=0?l:n)+h<0)return!1}return!0}updateTime(e,t,n=1){this._waterScratch[0]=t,this._waterScratch[1]=n,this._waterScratch[2]=0,this._waterScratch[3]=0,e.queue.writeBuffer(this._waterBuffer,0,this._waterScratch.buffer)}addChunk(e,t){const n=this._chunks.get(e);n?this._replaceMeshBuffer(n,t):this._chunks.set(e,this._createChunkGpu(e,t))}updateChunk(e,t){const n=this._chunks.get(e);n?this._replaceMeshBuffer(n,t):this._chunks.set(e,this._createChunkGpu(e,t))}removeChunk(e){var n;const t=this._chunks.get(e);t&&((n=t.buffer)==null||n.destroy(),t.uniformBuffer.destroy(),this._chunks.delete(e))}execute(e,t){const{width:n,height:o}=this._refractionTex;e.copyTextureToTexture({texture:this._hdrTexture},{texture:this._refractionTex},{width:n,height:o,depthOrArrayLayers:1});const i=e.beginRenderPass({label:"WaterPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}]});i.setPipeline(this._pipeline),i.setBindGroup(0,this._cameraBG),i.setBindGroup(1,this._waterBG),i.setBindGroup(3,this._sceneBG);for(const a of this._chunks.values())!a.buffer||a.vertexCount===0||this._isVisible(a.ox,a.oy,a.oz)&&(i.setBindGroup(2,a.chunkBG),i.setVertexBuffer(0,a.buffer),i.draw(a.vertexCount));i.end()}destroy(){var e;this._cameraBuffer.destroy(),this._waterBuffer.destroy(),this._refractionTex.destroy();for(const t of this._chunks.values())(e=t.buffer)==null||e.destroy(),t.uniformBuffer.destroy();this._chunks.clear()}static _makeRefractionTex(e,t,n){const o=e.createTexture({label:"WaterRefractionTex",size:{width:t,height:n},format:de,usage:GPUTextureUsage.COPY_DST|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT}),i=o.createView();return{refractionTex:o,refractionView:i}}static _makeSceneBG(e,t,n,o,i,a,l,c){return e.createBindGroup({label:"WaterSceneBG",layout:t,entries:[{binding:0,resource:n},{binding:1,resource:o},{binding:2,resource:i.view},{binding:3,resource:a.view},{binding:4,resource:l.view},{binding:5,resource:c}]})}_createChunkGpu(e,t){const n=this._device.createBuffer({label:`WaterChunkBuf(${e.globalPosition.x},${e.globalPosition.y},${e.globalPosition.z})`,size:fs,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(n,0,new Float32Array([e.globalPosition.x,e.globalPosition.y,e.globalPosition.z,0]));const o=this._device.createBindGroup({label:"WaterChunkBG",layout:this._chunkBGL,entries:[{binding:0,resource:{buffer:n}}]}),i={ox:e.globalPosition.x,oy:e.globalPosition.y,oz:e.globalPosition.z,buffer:null,vertexCount:0,uniformBuffer:n,chunkBG:o};return this._replaceMeshBuffer(i,t),i}_replaceMeshBuffer(e,t){var n;if((n=e.buffer)==null||n.destroy(),e.buffer=null,e.vertexCount=t.waterCount,t.waterCount>0){const o=this._device.createBuffer({label:"WaterVertexBuf",size:t.waterCount*Rn,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(o,0,t.water.buffer,0,t.waterCount*Rn),e.buffer=o}}}const hs=`// Shadow pass for transparent chunk geometry — samples color atlas alpha for discard.
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
`,_s=`// Shadow pass for prop billboards (flowers, grass, torches, etc.).
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
`,ms=4,Ke=5*4;class gr extends Pe{constructor(e,t,n,o,i,a,l,c,d,f,p){super();s(this,"name","WorldShadowPass");s(this,"shadowChunkRadius",4);s(this,"_camX",0);s(this,"_camZ",0);s(this,"_device");s(this,"_shadowMapArrayViews");s(this,"_pipeline");s(this,"_transparentPipeline");s(this,"_propPipeline");s(this,"_cascadeBGs");s(this,"_cascadeBuffers");s(this,"_modelBGL");s(this,"_atlasBG");s(this,"_orientBG_X");s(this,"_orientBG_Z");s(this,"_chunks",new Map);s(this,"_cascades",[]);this._device=e,this._shadowMapArrayViews=t,this._pipeline=n,this._transparentPipeline=o,this._propPipeline=i,this._cascadeBGs=a,this._cascadeBuffers=l,this._modelBGL=c,this._atlasBG=d,this._orientBG_X=f,this._orientBG_Z=p}static create(e,t,n,o){const{device:i}=e,a=i.createBindGroupLayout({label:"WorldShadowCascadeBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),l=i.createBindGroupLayout({label:"WorldShadowModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),c=i.createBindGroupLayout({label:"WorldShadowAtlasBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),d=[],f=[];for(let S=0;S<Math.min(n,ms);S++){const N=i.createBuffer({label:`WorldShadowCascadeBuf${S}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});d.push(N),f.push(i.createBindGroup({label:`WorldShadowCascadeBG${S}`,layout:a,entries:[{binding:0,resource:{buffer:N}}]}))}const p=L.MAX,h=i.createBuffer({label:"WorldShadowBlockDataBuf",size:Math.max(p*16,16),usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),_=Pi,m=new Uint32Array(p*4);for(let S=0;S<p;S++){const N=Dt[S];N&&(m[S*4+0]=N.sideFace.y*_+N.sideFace.x,m[S*4+1]=N.bottomFace.y*_+N.bottomFace.x,m[S*4+2]=N.topFace.y*_+N.topFace.x)}i.queue.writeBuffer(h,0,m);const y=i.createSampler({label:"WorldShadowAtlasSampler",magFilter:"nearest",minFilter:"nearest"}),g=i.createBindGroup({label:"WorldShadowAtlasBG",layout:c,entries:[{binding:0,resource:o.colorAtlas.view},{binding:1,resource:y},{binding:2,resource:{buffer:h}}]}),b=i.createShaderModule({label:"WorldShadowShader",code:Ti}),w=i.createPipelineLayout({bindGroupLayouts:[a,l]}),B=i.createRenderPipeline({label:"WorldShadowPipeline",layout:w,vertex:{module:b,entryPoint:"vs_main",buffers:[{arrayStride:Ke,attributes:[{shaderLocation:0,offset:0,format:"float32x3"}]}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}}),x=i.createShaderModule({label:"WorldShadowTranspShader",code:hs}),U=i.createPipelineLayout({bindGroupLayouts:[a,l,c]}),R=i.createRenderPipeline({label:"WorldShadowTransparentPipeline",layout:U,vertex:{module:x,entryPoint:"vs_main",buffers:[{arrayStride:Ke,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32"},{shaderLocation:2,offset:16,format:"float32"}]}]},fragment:{module:x,entryPoint:"fs_alpha_test",targets:[]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}}),A=i.createBindGroupLayout({label:"WorldShadowOrientBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),I=(S,N,E,X)=>{const V=i.createBuffer({label:S,size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return i.queue.writeBuffer(V,0,new Float32Array([N,E,X,0])),i.createBindGroup({label:S,layout:A,entries:[{binding:0,resource:{buffer:V}}]})},k=I("PropShadowOrientBG_X",1,0,0),v=I("PropShadowOrientBG_Z",0,0,1),M=i.createShaderModule({label:"WorldShadowPropShader",code:_s}),T=i.createPipelineLayout({bindGroupLayouts:[a,l,c,A]}),G=i.createRenderPipeline({label:"WorldShadowPropPipeline",layout:T,vertex:{module:M,entryPoint:"vs_main",buffers:[{arrayStride:Ke,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32"},{shaderLocation:2,offset:16,format:"float32"}]}]},fragment:{module:M,entryPoint:"fs_alpha_test",targets:[]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}});return new gr(i,t,B,R,G,f,d,l,g,k,v)}update(e,t,n,o){this._cascades=t,this._camX=n,this._camZ=o;const i=Math.min(t.length,this._cascadeBuffers.length);for(let a=0;a<i;a++)e.queue.writeBuffer(this._cascadeBuffers[a],0,t[a].lightViewProj.data.buffer)}addChunk(e,t){const n=this._chunks.get(e);n?this._replaceMeshBuffer(n,t):this._chunks.set(e,this._createChunkGpu(e,t))}updateChunk(e,t){const n=this._chunks.get(e);n?this._replaceMeshBuffer(n,t):this._chunks.set(e,this._createChunkGpu(e,t))}removeChunk(e){var n,o,i;const t=this._chunks.get(e);t&&((n=t.opaqueBuffer)==null||n.destroy(),(o=t.transparentBuffer)==null||o.destroy(),(i=t.propBuffer)==null||i.destroy(),t.modelBuffer.destroy(),this._chunks.delete(e))}execute(e,t){const n=Math.min(this._cascades.length,this._cascadeBuffers.length);for(let o=0;o<n;o++){const i=e.beginRenderPass({label:`WorldShadowPass cascade ${o}`,colorAttachments:[],depthStencilAttachment:{view:this._shadowMapArrayViews[o],depthLoadOp:"load",depthStoreOp:"store"}});i.setBindGroup(0,this._cascadeBGs[o]);const a=this.shadowChunkRadius*16,l=a*a;i.setPipeline(this._pipeline);for(const c of this._chunks.values()){if(!c.opaqueBuffer||c.opaqueCount===0)continue;const d=c.ox-this._camX,f=c.oz-this._camZ;d*d+f*f>l||(i.setBindGroup(1,c.modelBG),i.setVertexBuffer(0,c.opaqueBuffer),i.draw(c.opaqueCount))}i.setPipeline(this._transparentPipeline),i.setBindGroup(2,this._atlasBG);for(const c of this._chunks.values()){if(!c.transparentBuffer||c.transparentCount===0)continue;const d=c.ox-this._camX,f=c.oz-this._camZ;d*d+f*f>l||(i.setBindGroup(1,c.modelBG),i.setVertexBuffer(0,c.transparentBuffer),i.draw(c.transparentCount))}i.setPipeline(this._propPipeline),i.setBindGroup(2,this._atlasBG);for(const c of[this._orientBG_X,this._orientBG_Z]){i.setBindGroup(3,c);for(const d of this._chunks.values()){if(!d.propBuffer||d.propCount===0)continue;const f=d.ox-this._camX,p=d.oz-this._camZ;f*f+p*p>l||(i.setBindGroup(1,d.modelBG),i.setVertexBuffer(0,d.propBuffer),i.draw(d.propCount))}}i.end()}}destroy(){var e,t,n;for(const o of this._cascadeBuffers)o.destroy();for(const o of this._chunks.values())(e=o.opaqueBuffer)==null||e.destroy(),(t=o.transparentBuffer)==null||t.destroy(),(n=o.propBuffer)==null||n.destroy(),o.modelBuffer.destroy();this._chunks.clear()}_createChunkGpu(e,t){const n=e.globalPosition,o=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,n.x,n.y,n.z,1]),i=this._device.createBuffer({label:"WorldShadowModelBuf",size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(i,0,o.buffer);const a=this._device.createBindGroup({label:"WorldShadowModelBG",layout:this._modelBGL,entries:[{binding:0,resource:{buffer:i}}]}),l={ox:n.x,oz:n.z,opaqueBuffer:null,opaqueCount:0,transparentBuffer:null,transparentCount:0,propBuffer:null,propCount:0,modelBuffer:i,modelBG:a};return this._replaceMeshBuffer(l,t),l}_replaceMeshBuffer(e,t){var n,o,i;if((n=e.opaqueBuffer)==null||n.destroy(),e.opaqueBuffer=null,e.opaqueCount=t.opaqueCount,t.opaqueCount>0){const a=this._device.createBuffer({label:"WorldShadowOpaqueBuf",size:t.opaqueCount*Ke,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.opaque.buffer,0,t.opaqueCount*Ke),e.opaqueBuffer=a}if((o=e.transparentBuffer)==null||o.destroy(),e.transparentBuffer=null,e.transparentCount=t.transparentCount,t.transparentCount>0){const a=this._device.createBuffer({label:"WorldShadowTransparentBuf",size:t.transparentCount*Ke,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.transparent.buffer,0,t.transparentCount*Ke),e.transparentBuffer=a}if((i=e.propBuffer)==null||i.destroy(),e.propBuffer=null,e.propCount=t.propCount,t.propCount>0){const a=this._device.createBuffer({label:"WorldShadowPropBuf",size:t.propCount*Ke,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.prop.buffer,0,t.propCount*Ke),e.propBuffer=a}}}const gs=`// Additive deferred pass for point and spot lights.
// Runs after DeferredLightingPass (which handles directional + IBL) with loadOp:'load'
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
`,Go=64*4+16+16,vs=8,Eo=48,Mo=128;class vr extends Pe{constructor(e,t,n,o,i,a,l,c,d,f){super();s(this,"name","PointSpotLightPass");s(this,"_pipeline");s(this,"_cameraBG");s(this,"_gbufferBG");s(this,"_lightBG");s(this,"_shadowBG");s(this,"_cameraBuffer");s(this,"_lightCountsBuffer");s(this,"_pointBuffer");s(this,"_spotBuffer");s(this,"_hdrView");s(this,"_cameraData",new Float32Array(Go/4));s(this,"_lightCountsArr",new Uint32Array(2));s(this,"_pointBuf",new ArrayBuffer(Zt*Eo));s(this,"_pointF32",new Float32Array(this._pointBuf));s(this,"_pointI32",new Int32Array(this._pointBuf));s(this,"_spotBuf",new ArrayBuffer(Kt*Mo));s(this,"_spotF32",new Float32Array(this._spotBuf));s(this,"_spotI32",new Int32Array(this._spotBuf));this._pipeline=e,this._cameraBG=t,this._gbufferBG=n,this._lightBG=o,this._shadowBG=i,this._cameraBuffer=a,this._lightCountsBuffer=l,this._pointBuffer=c,this._spotBuffer=d,this._hdrView=f}static create(e,t,n,o){const{device:i}=e,a=i.createBuffer({label:"PSLCameraBuffer",size:Go,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),l=i.createBuffer({label:"PSLLightCounts",size:vs,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),c=i.createBuffer({label:"PSLPointBuffer",size:Zt*Eo,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),d=i.createBuffer({label:"PSLSpotBuffer",size:Kt*Mo,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),f=i.createSampler({label:"PSLLinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),p=i.createSampler({label:"PSLVsmSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge"}),h=i.createSampler({label:"PSLProjSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),_=i.createBindGroupLayout({label:"PSLCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),m=i.createBindGroupLayout({label:"PSLGBufferBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),y=i.createBindGroupLayout({label:"PSLLightBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),g=i.createBindGroupLayout({label:"PSLShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube-array"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d-array"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d-array"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),b=i.createBindGroup({label:"PSLCameraBG",layout:_,entries:[{binding:0,resource:{buffer:a}}]}),w=i.createBindGroup({label:"PSLGBufferBG",layout:m,entries:[{binding:0,resource:t.albedoRoughnessView},{binding:1,resource:t.normalMetallicView},{binding:2,resource:t.depthView},{binding:3,resource:f}]}),B=i.createBindGroup({label:"PSLLightBG",layout:y,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:d}}]}),x=i.createBindGroup({label:"PSLShadowBG",layout:g,entries:[{binding:0,resource:n.pointVsmView},{binding:1,resource:n.spotVsmView},{binding:2,resource:n.projTexView},{binding:3,resource:p},{binding:4,resource:h}]}),U=i.createShaderModule({label:"PointSpotLightShader",code:gs}),R=i.createRenderPipeline({label:"PointSpotLightPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[_,m,y,g]}),vertex:{module:U,entryPoint:"vs_main"},fragment:{module:U,entryPoint:"fs_main",targets:[{format:de,blend:{color:{srcFactor:"one",dstFactor:"one",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one",operation:"add"}}}]},primitive:{topology:"triangle-list"}});return new vr(R,b,w,B,x,a,l,c,d,o)}updateCamera(e,t,n,o,i,a,l,c){const d=this._cameraData;d.set(t.data,0),d.set(n.data,16),d.set(o.data,32),d.set(i.data,48),d[64]=a.x,d[65]=a.y,d[66]=a.z,d[67]=l,d[68]=c,e.queue.writeBuffer(this._cameraBuffer,0,d.buffer)}updateLights(e,t,n){const o=this._lightCountsArr;o[0]=Math.min(t.length,Zt),o[1]=Math.min(n.length,Kt),e.queue.writeBuffer(this._lightCountsBuffer,0,o.buffer);const i=this._pointF32,a=this._pointI32;let l=0;for(let p=0;p<Math.min(t.length,Zt);p++){const h=t[p],_=h.worldPosition(),m=p*12;i[m+0]=_.x,i[m+1]=_.y,i[m+2]=_.z,i[m+3]=h.radius,i[m+4]=h.color.x,i[m+5]=h.color.y,i[m+6]=h.color.z,i[m+7]=h.intensity,h.castShadow&&l<St?a[m+8]=l++:a[m+8]=-1,a[m+9]=0,a[m+10]=0,a[m+11]=0}e.queue.writeBuffer(this._pointBuffer,0,this._pointBuf);const c=this._spotF32,d=this._spotI32;let f=0;for(let p=0;p<Math.min(n.length,Kt);p++){const h=n[p],_=h.worldPosition(),m=h.worldDirection(),y=h.lightViewProj(),g=p*32;c[g+0]=_.x,c[g+1]=_.y,c[g+2]=_.z,c[g+3]=h.range,c[g+4]=m.x,c[g+5]=m.y,c[g+6]=m.z,c[g+7]=Math.cos(h.innerAngle*Math.PI/180),c[g+8]=h.color.x,c[g+9]=h.color.y,c[g+10]=h.color.z,c[g+11]=Math.cos(h.outerAngle*Math.PI/180),c[g+12]=h.intensity,h.castShadow&&f<st?d[g+13]=f++:d[g+13]=-1,d[g+14]=h.projectionTexture!==null?p:-1,d[g+15]=0,c.set(y.data,g+16)}e.queue.writeBuffer(this._spotBuffer,0,this._spotBuf)}updateLight(e){e.computeLightViewProj()}execute(e,t){const n=e.beginRenderPass({label:"PointSpotLightPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}]});n.setPipeline(this._pipeline),n.setBindGroup(0,this._cameraBG),n.setBindGroup(1,this._gbufferBG),n.setBindGroup(2,this._lightBG),n.setBindGroup(3,this._shadowBG),n.draw(3),n.end()}destroy(){this._cameraBuffer.destroy(),this._lightCountsBuffer.destroy(),this._pointBuffer.destroy(),this._spotBuffer.destroy()}}const Gi=`
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
  spawn_color   : vec4<f32>,
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
`;function bs(u){switch(u.kind){case"sphere":{const r=Math.cos(u.solidAngle).toFixed(6),e=u.radius.toFixed(6);return`{
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
}`}}}function Ei(u){switch(u.type){case"gravity":return`p.velocity.y -= ${u.strength.toFixed(6)} * uniforms.dt;`;case"drag":return`p.velocity -= p.velocity * ${u.coefficient.toFixed(6)} * uniforms.dt;`;case"force":{const[r,e,t]=u.direction.map(n=>n.toFixed(6));return`p.velocity += vec3<f32>(${r}, ${e}, ${t}) * ${u.strength.toFixed(6)} * uniforms.dt;`}case"swirl_force":{const r=u.speed.toFixed(6),e=u.strength.toFixed(6);return`{
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
}`}}function Mi(u,r){return u?u.filter(e=>e.trigger===r).flatMap(e=>e.actions.map(Ei)).join(`
  `):""}function ys(u){const{emitter:r,events:e}=u,[t,n]=r.lifetime.map(c=>c.toFixed(6)),[o,i]=r.initialSpeed.map(c=>c.toFixed(6)),[a,l]=r.initialSize.map(c=>c.toFixed(6));return`
${Gi}

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
  p.color    = uniforms.spawn_color;
  p.size     = rand_range(${a}, ${l}, seed + 3u);
  p.rotation = rand_f32(seed + 4u) * 6.28318530717958647;

  ${bs(r.shape)}

  ${Mi(e,"on_spawn")}

  particles[idx] = p;
}
`}function ws(u){return u.modifiers.some(r=>r.type==="block_collision")}const xs=`
struct HeightmapUniforms {
  origin_x  : f32,
  origin_z  : f32,
  extent    : f32,
  resolution: u32,
}
@group(2) @binding(0) var<storage, read> hm_data: array<f32>;
@group(2) @binding(1) var<uniform>       hm     : HeightmapUniforms;
`;function Bs(u){const r=u.modifiers.some(n=>n.type==="block_collision"),e=u.modifiers.map(Ei).join(`
  `),t=Mi(u.events,"on_death");return`
${Gi}
${r?xs:""}

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
`}const Ss=`// Compact pass — rebuilds alive_list and writes indirect draw instance count.
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
`,Ps=`// Particle GBuffer render pass — camera-facing billboard quads.
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
`,Ts=`// Particle forward HDR render pass — velocity-aligned billboard quads.
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

// Hard square pixel — no radial falloff, no discard. Suits chunky debris that
// should read as a solid coloured pixel rather than a soft glow. Skips
// EMIT_SCALE so the output matches the source colour after tonemapping.
@fragment
fn fs_pixel(in: VertexOutput) -> @location(0) vec4<f32> {
  return vec4<f32>(in.color.rgb, in.color.a);
}
`,Ao=64,Uo=80,Gs=16,Es=16,ko=288,Co=16,In=128;class Rt extends Pe{constructor(e,t,n,o,i,a,l,c,d,f,p,h,_,m,y,g,b,w,B,x,U,R,A,I,k,v,M){super();s(this,"name","ParticlePass");s(this,"_gbuffer");s(this,"_hdrView");s(this,"_isForward");s(this,"_maxParticles");s(this,"_config");s(this,"_particleBuffer");s(this,"_aliveList");s(this,"_counterBuffer");s(this,"_indirectBuffer");s(this,"_computeUniforms");s(this,"_renderUniforms");s(this,"_cameraBuffer");s(this,"_spawnPipeline");s(this,"_updatePipeline");s(this,"_compactPipeline");s(this,"_indirectPipeline");s(this,"_renderPipeline");s(this,"_computeDataBG");s(this,"_computeUniBG");s(this,"_compactDataBG");s(this,"_compactUniBG");s(this,"_renderDataBG");s(this,"_cameraRenderBG");s(this,"_renderParamsBG");s(this,"_heightmapDataBuf");s(this,"_heightmapUniBuf");s(this,"_heightmapBG");s(this,"_spawnAccum",0);s(this,"_spawnOffset",0);s(this,"_spawnCount",0);s(this,"_pendingBurst",null);s(this,"_time",0);s(this,"_frameSeed",0);s(this,"_cuBuf",new Float32Array(Uo/4));s(this,"_cuiView",new Uint32Array(this._cuBuf.buffer));s(this,"_camBuf",new Float32Array(ko/4));s(this,"_hmUniBuf",new Float32Array(Co/4));s(this,"_hmRes",new Uint32Array([In]));s(this,"_resetArr",new Uint32Array(1));this._gbuffer=e,this._hdrView=t,this._isForward=n,this._config=o,this._maxParticles=i,this._particleBuffer=a,this._aliveList=l,this._counterBuffer=c,this._indirectBuffer=d,this._computeUniforms=f,this._renderUniforms=p,this._cameraBuffer=h,this._spawnPipeline=_,this._updatePipeline=m,this._compactPipeline=y,this._indirectPipeline=g,this._renderPipeline=b,this._computeDataBG=w,this._computeUniBG=B,this._compactDataBG=x,this._compactUniBG=U,this._renderDataBG=R,this._cameraRenderBG=A,this._renderParamsBG=I,this._heightmapDataBuf=k,this._heightmapUniBuf=v,this._heightmapBG=M}setSpawnRate(e){this._config.emitter.spawnRate=e}burst(e,t,n){if(n<=0)return;const o=Math.min(n,this._maxParticles);this._pendingBurst={px:e.x,py:e.y,pz:e.z,r:t[0],g:t[1],b:t[2],a:t[3],count:o}}static create(e,t,n,o){const{device:i}=e,a=t.renderer.type==="sprites"&&t.renderer.renderTarget==="hdr",l=t.emitter.maxParticles,c=i.createBuffer({label:"ParticleBuffer",size:l*Ao,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),d=new Float32Array(l*(Ao/4));for(let O=0;O<l;O++)d[O*16+3]=-1;i.queue.writeBuffer(c,0,d.buffer);const f=i.createBuffer({label:"ParticleAliveList",size:l*4,usage:GPUBufferUsage.STORAGE}),p=i.createBuffer({label:"ParticleCounter",size:4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),h=i.createBuffer({label:"ParticleIndirect",size:16,usage:GPUBufferUsage.INDIRECT|GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});i.queue.writeBuffer(h,0,new Uint32Array([6,0,0,0]));const _=i.createBuffer({label:"ParticleComputeUniforms",size:Uo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),m=i.createBuffer({label:"ParticleCompactUniforms",size:Gs,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});i.queue.writeBuffer(m,0,new Uint32Array([l,0,0,0]));const y=i.createBuffer({label:"ParticleRenderUniforms",size:Es,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});i.queue.writeBuffer(y,0,new Float32Array([t.emitter.roughness,t.emitter.metallic,0,0]));const g=i.createBuffer({label:"ParticleCameraBuffer",size:ko,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),b=i.createBindGroupLayout({label:"ParticleComputeDataBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),w=i.createBindGroupLayout({label:"ParticleCompactDataBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),B=i.createBindGroupLayout({label:"ParticleComputeUniBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),x=i.createBindGroupLayout({label:"ParticleRenderDataBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}}]}),U=i.createBindGroupLayout({label:"ParticleCameraRenderBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),R=i.createBindGroupLayout({label:"ParticleRenderParamsBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),A=i.createBindGroup({label:"ParticleComputeDataBG",layout:b,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:f}},{binding:2,resource:{buffer:p}},{binding:3,resource:{buffer:h}}]}),I=i.createBindGroup({label:"ParticleCompactDataBG",layout:w,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:f}},{binding:2,resource:{buffer:p}},{binding:3,resource:{buffer:h}}]}),k=i.createBindGroup({label:"ParticleComputeUniBG",layout:B,entries:[{binding:0,resource:{buffer:_}}]}),v=i.createBindGroup({label:"ParticleCompactUniBG",layout:B,entries:[{binding:0,resource:{buffer:m}}]}),M=i.createBindGroup({label:"ParticleRenderDataBG",layout:x,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:f}}]}),T=i.createBindGroup({label:"ParticleCameraRenderBG",layout:U,entries:[{binding:0,resource:{buffer:g}}]}),G=i.createBindGroup({label:"ParticleRenderParamsBG",layout:R,entries:[{binding:0,resource:{buffer:y}}]});let S,N,E,X;ws(t)&&(S=i.createBuffer({label:"ParticleHeightmapData",size:In*In*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),N=i.createBuffer({label:"ParticleHeightmapUniforms",size:Co,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),X=i.createBindGroupLayout({label:"ParticleHeightmapBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),E=i.createBindGroup({label:"ParticleHeightmapBG",layout:X,entries:[{binding:0,resource:{buffer:S}},{binding:1,resource:{buffer:N}}]}));const V=i.createPipelineLayout({bindGroupLayouts:[b,B]}),F=X?i.createPipelineLayout({bindGroupLayouts:[b,B,X]}):i.createPipelineLayout({bindGroupLayouts:[b,B]}),H=i.createPipelineLayout({bindGroupLayouts:[w,B]}),C=i.createShaderModule({label:"ParticleSpawn",code:ys(t)}),Y=i.createShaderModule({label:"ParticleUpdate",code:Bs(t)}),te=i.createShaderModule({label:"ParticleCompact",code:Ss}),q=i.createComputePipeline({label:"ParticleSpawnPipeline",layout:V,compute:{module:C,entryPoint:"cs_main"}}),ne=i.createComputePipeline({label:"ParticleUpdatePipeline",layout:F,compute:{module:Y,entryPoint:"cs_main"}}),re=i.createComputePipeline({label:"ParticleCompactPipeline",layout:H,compute:{module:te,entryPoint:"cs_compact"}}),fe=i.createComputePipeline({label:"ParticleIndirectPipeline",layout:H,compute:{module:te,entryPoint:"cs_write_indirect"}});let ie;if(a){const O=t.renderer.type==="sprites"?t.renderer.billboard:"camera",W=t.renderer.type==="sprites"?t.renderer.shape??"soft":"soft",ce=O==="camera"?"vs_camera":"vs_main",Q=O==="velocity"?"fs_main":W==="pixel"?"fs_pixel":"fs_snow",le=i.createShaderModule({label:"ParticleRenderForward",code:Ts}),ee=i.createPipelineLayout({bindGroupLayouts:[x,U]});ie=i.createRenderPipeline({label:"ParticleForwardPipeline",layout:ee,vertex:{module:le,entryPoint:ce},fragment:{module:le,entryPoint:Q,targets:[{format:de,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},depthStencil:{format:"depth32float",depthWriteEnabled:!1,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}})}else{const O=i.createShaderModule({label:"ParticleRender",code:Ps}),W=i.createPipelineLayout({bindGroupLayouts:[x,U,R]});ie=i.createRenderPipeline({label:"ParticleRenderPipeline",layout:W,vertex:{module:O,entryPoint:"vs_main"},fragment:{module:O,entryPoint:"fs_main",targets:[{format:"rgba8unorm"},{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}})}return new Rt(n,o,a,t,l,c,f,p,h,_,y,g,q,ne,re,fe,ie,A,k,I,v,M,T,a?void 0:G,S,N,E)}updateHeightmap(e,t,n,o,i){if(!this._heightmapDataBuf||!this._heightmapUniBuf)return;e.queue.writeBuffer(this._heightmapDataBuf,0,t.buffer);const a=this._hmUniBuf;a[0]=n,a[1]=o,a[2]=i,e.queue.writeBuffer(this._heightmapUniBuf,0,a.buffer,0,12),e.queue.writeBuffer(this._heightmapUniBuf,12,this._hmRes)}update(e,t,n,o,i,a,l,c,d,f){this._time+=t,this._frameSeed=this._frameSeed+1&4294967295,this._spawnAccum+=this._config.emitter.spawnRate*t,this._spawnCount=Math.min(Math.floor(this._spawnAccum),this._maxParticles),this._spawnAccum-=this._spawnCount;const p=f.data;let h=p[12],_=p[13],m=p[14];const y=Math.hypot(p[0],p[1],p[2]),g=Math.hypot(p[4],p[5],p[6]),b=Math.hypot(p[8],p[9],p[10]),w=p[0]/y,B=p[1]/y,x=p[2]/y,U=p[4]/g,R=p[5]/g,A=p[6]/g,I=p[8]/b,k=p[9]/b,v=p[10]/b,M=w+R+v;let T,G,S,N;if(M>0){const q=.5/Math.sqrt(M+1);N=.25/q,T=(A-k)*q,G=(I-x)*q,S=(B-U)*q}else if(w>R&&w>v){const q=2*Math.sqrt(1+w-R-v);N=(A-k)/q,T=.25*q,G=(U+B)/q,S=(I+x)/q}else if(R>v){const q=2*Math.sqrt(1+R-w-v);N=(I-x)/q,T=(U+B)/q,G=.25*q,S=(k+A)/q}else{const q=2*Math.sqrt(1+v-w-R);N=(B-U)/q,T=(I+x)/q,G=(k+A)/q,S=.25*q}const E=this._config.emitter.initialColor;let X=E[0],V=E[1],F=E[2],H=E[3];if(this._pendingBurst){const q=this._pendingBurst;h=q.px,_=q.py,m=q.pz,T=0,G=0,S=0,N=1,this._spawnCount=q.count,X=q.r,V=q.g,F=q.b,H=q.a,this._pendingBurst=null}const C=this._cuBuf,Y=this._cuiView;C[0]=h,C[1]=_,C[2]=m,Y[3]=this._spawnCount,C[4]=T,C[5]=G,C[6]=S,C[7]=N,Y[8]=this._spawnOffset,Y[9]=this._maxParticles,Y[10]=this._frameSeed,Y[11]=0,C[12]=t,C[13]=this._time,C[16]=X,C[17]=V,C[18]=F,C[19]=H,e.queue.writeBuffer(this._computeUniforms,0,C.buffer),e.queue.writeBuffer(this._counterBuffer,0,this._resetArr),this._spawnOffset=(this._spawnOffset+this._spawnCount)%this._maxParticles;const te=this._camBuf;te.set(n.data,0),te.set(o.data,16),te.set(i.data,32),te.set(a.data,48),te[64]=l.x,te[65]=l.y,te[66]=l.z,te[67]=c,te[68]=d,e.queue.writeBuffer(this._cameraBuffer,0,te.buffer)}execute(e,t){const n=e.beginComputePass({label:"ParticleCompute"});if(this._spawnCount>0&&(n.setPipeline(this._spawnPipeline),n.setBindGroup(0,this._computeDataBG),n.setBindGroup(1,this._computeUniBG),n.dispatchWorkgroups(Math.ceil(this._spawnCount/64))),n.setPipeline(this._updatePipeline),n.setBindGroup(0,this._computeDataBG),n.setBindGroup(1,this._computeUniBG),this._heightmapBG&&n.setBindGroup(2,this._heightmapBG),n.dispatchWorkgroups(Math.ceil(this._maxParticles/64)),n.setPipeline(this._compactPipeline),n.setBindGroup(0,this._compactDataBG),n.setBindGroup(1,this._compactUniBG),n.dispatchWorkgroups(Math.ceil(this._maxParticles/64)),n.setPipeline(this._indirectPipeline),n.dispatchWorkgroups(1),n.end(),this._isForward){const o=e.beginRenderPass({label:"ParticleForwardPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthReadOnly:!0}});o.setPipeline(this._renderPipeline),o.setBindGroup(0,this._renderDataBG),o.setBindGroup(1,this._cameraRenderBG),o.drawIndirect(this._indirectBuffer,0),o.end()}else{const o=e.beginRenderPass({label:"ParticleGBufferPass",colorAttachments:[{view:this._gbuffer.albedoRoughnessView,loadOp:"load",storeOp:"store"},{view:this._gbuffer.normalMetallicView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthLoadOp:"load",depthStoreOp:"store"}});o.setPipeline(this._renderPipeline),o.setBindGroup(0,this._renderDataBG),o.setBindGroup(1,this._cameraRenderBG),o.setBindGroup(2,this._renderParamsBG),o.drawIndirect(this._indirectBuffer,0),o.end()}}destroy(){var e,t;this._particleBuffer.destroy(),this._aliveList.destroy(),this._counterBuffer.destroy(),this._indirectBuffer.destroy(),this._computeUniforms.destroy(),this._renderUniforms.destroy(),this._cameraBuffer.destroy(),(e=this._heightmapDataBuf)==null||e.destroy(),(t=this._heightmapUniBuf)==null||t.destroy()}}const Ms=`// Auto-exposure — two-pass histogram approach.
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
`,As=64,Us=32,ks=16,Cs=As*4,Lo={adaptSpeed:1.5,minExposure:.1,maxExposure:10,lowPct:.05,highPct:.02},ht=class ht extends Pe{constructor(e,t,n,o,i,a,l,c){super();s(this,"name","AutoExposurePass");s(this,"exposureBuffer");s(this,"_histogramPipeline");s(this,"_adaptPipeline");s(this,"_bindGroup");s(this,"_paramsBuffer");s(this,"_histogramBuffer");s(this,"_hdrWidth");s(this,"_hdrHeight");s(this,"enabled",!0);s(this,"_resetScratch",new Float32Array([1,0,0,0]));this._histogramPipeline=e,this._adaptPipeline=t,this._bindGroup=n,this._paramsBuffer=o,this._histogramBuffer=i,this.exposureBuffer=a,this._hdrWidth=l,this._hdrHeight=c}static create(e,t,n=Lo){const{device:o}=e,i=o.createBindGroupLayout({label:"AutoExposureBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),a=o.createBuffer({label:"AutoExposureHistogram",size:Cs,usage:GPUBufferUsage.STORAGE}),l=o.createBuffer({label:"AutoExposureValue",size:ks,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});o.queue.writeBuffer(l,0,new Float32Array([1,0,0,0]));const c=o.createBuffer({label:"AutoExposureParams",size:Us,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});ht._writeParams(o,c,0,n);const d=o.createBindGroup({label:"AutoExposureBG",layout:i,entries:[{binding:0,resource:t.createView()},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:c}}]}),f=o.createPipelineLayout({bindGroupLayouts:[i]}),p=o.createShaderModule({label:"AutoExposure",code:Ms}),h=o.createComputePipeline({label:"AutoExposureHistogramPipeline",layout:f,compute:{module:p,entryPoint:"cs_histogram"}}),_=o.createComputePipeline({label:"AutoExposureAdaptPipeline",layout:f,compute:{module:p,entryPoint:"cs_adapt"}});return new ht(h,_,d,c,a,l,t.width,t.height)}update(e,t,n=Lo){if(!this.enabled){e.device.queue.writeBuffer(this.exposureBuffer,0,this._resetScratch);return}ht._writeParams(e.device,this._paramsBuffer,t,n)}execute(e,t){if(!this.enabled)return;const n=e.beginComputePass({label:"AutoExposurePass"});n.setPipeline(this._histogramPipeline),n.setBindGroup(0,this._bindGroup),n.dispatchWorkgroups(Math.ceil(this._hdrWidth/32),Math.ceil(this._hdrHeight/32)),n.setPipeline(this._adaptPipeline),n.dispatchWorkgroups(1),n.end()}destroy(){this._paramsBuffer.destroy(),this._histogramBuffer.destroy(),this.exposureBuffer.destroy()}static _writeParams(e,t,n,o){const i=ht._paramsScratch;i[0]=n,i[1]=o.adaptSpeed,i[2]=o.minExposure,i[3]=o.maxExposure,i[4]=o.lowPct,i[5]=o.highPct,i[6]=0,i[7]=0,e.queue.writeBuffer(t,0,i)}};s(ht,"_paramsScratch",new Float32Array(8));let qn=ht;function Ls(u,r,e){let t=(Math.imul(u,1664525)^Math.imul(r,1013904223)^Math.imul(e,22695477))>>>0;return t=Math.imul(t^t>>>16,73244475)>>>0,t=Math.imul(t^t>>>16,73244475)>>>0,((t^t>>>16)>>>0)/4294967295}function dn(u,r,e,t){return Ls(u^t,r^t*7+3,e^t*13+5)}function On(u){return u*u*u*(u*(u*6-15)+10)}function Rs(u,r,e,t,n,o,i,a,l,c,d){const f=u+(r-u)*l,p=e+(t-e)*l,h=n+(o-n)*l,_=i+(a-i)*l,m=f+(p-f)*c,y=h+(_-h)*c;return m+(y-m)*d}const Ns=new Int8Array([1,-1,1,-1,1,-1,1,-1,0,0,0,0]),Is=new Int8Array([1,1,-1,-1,0,0,0,0,1,-1,1,-1]),Os=new Int8Array([0,0,0,0,1,1,-1,-1,1,1,-1,-1]);function it(u,r,e,t,n,o,i,a){const l=(u%t+t)%t,c=(r%t+t)%t,d=(e%t+t)%t,f=Math.floor(dn(l,c,d,n)*12)%12;return Ns[f]*o+Is[f]*i+Os[f]*a}function Ds(u,r,e,t,n){const o=Math.floor(u),i=Math.floor(r),a=Math.floor(e),l=u-o,c=r-i,d=e-a,f=On(l),p=On(c),h=On(d);return Rs(it(o,i,a,t,n,l,c,d),it(o+1,i,a,t,n,l-1,c,d),it(o,i+1,a,t,n,l,c-1,d),it(o+1,i+1,a,t,n,l-1,c-1,d),it(o,i,a+1,t,n,l,c,d-1),it(o+1,i,a+1,t,n,l-1,c,d-1),it(o,i+1,a+1,t,n,l,c-1,d-1),it(o+1,i+1,a+1,t,n,l-1,c-1,d-1),f,p,h)}function Vs(u,r,e,t,n,o){let i=0,a=.5,l=1,c=0;for(let d=0;d<t;d++)i+=Ds(u*l,r*l,e*l,n*l,o+d*17)*a,c+=a,a*=.5,l*=2;return Math.max(0,Math.min(1,i/c*.85+.5))}function yt(u,r,e,t,n){const o=u*t,i=r*t,a=e*t,l=Math.floor(o),c=Math.floor(i),d=Math.floor(a);let f=1/0;for(let p=-1;p<=1;p++)for(let h=-1;h<=1;h++)for(let _=-1;_<=1;_++){const m=l+_,y=c+h,g=d+p,b=(m%t+t)%t,w=(y%t+t)%t,B=(g%t+t)%t,x=m+dn(b,w,B,n),U=y+dn(b,w,B,n+1),R=g+dn(b,w,B,n+2),A=o-x,I=i-U,k=a-R,v=A*A+I*I+k*k;v<f&&(f=v)}return 1-Math.min(Math.sqrt(f),1)}function Ro(u,r,e,t){const n=u.createTexture({label:r,dimension:"3d",size:{width:e,height:e,depthOrArrayLayers:e},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return u.queue.writeTexture({texture:n},t.buffer,{bytesPerRow:e*4,rowsPerImage:e},{width:e,height:e,depthOrArrayLayers:e}),n}function zs(u){const e=new Uint8Array(1048576);for(let a=0;a<64;a++)for(let l=0;l<64;l++)for(let c=0;c<64;c++){const d=(a*64*64+l*64+c)*4,f=c/64,p=l/64,h=a/64,_=Vs(f,p,h,4,4,0),m=yt(f,p,h,2,100),y=yt(f,p,h,4,200),g=yt(f,p,h,8,300);e[d]=Math.round(_*255),e[d+1]=Math.round(m*255),e[d+2]=Math.round(y*255),e[d+3]=Math.round(g*255)}const t=32,n=new Uint8Array(t*t*t*4);for(let a=0;a<t;a++)for(let l=0;l<t;l++)for(let c=0;c<t;c++){const d=(a*t*t+l*t+c)*4,f=c/t,p=l/t,h=a/t,_=yt(f,p,h,4,400),m=yt(f,p,h,8,500),y=yt(f,p,h,16,600);n[d]=Math.round(_*255),n[d+1]=Math.round(m*255),n[d+2]=Math.round(y*255),n[d+3]=255}const o=Ro(u,"CloudBaseNoise",64,e),i=Ro(u,"CloudDetailNoise",t,n);return{baseNoise:o,baseView:o.createView({dimension:"3d"}),detailNoise:i,detailView:i.createView({dimension:"3d"}),destroy(){o.destroy(),i.destroy()}}}const Fs=`// IBL baking — two compute entry points share the same bind group layout.
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
`,en=5,Dn=128,tn=32,Hs=[0,.25,.5,.75,1],Ws=Math.PI;function js(u){let r=u>>>0;return r=(r<<16|r>>>16)>>>0,r=((r&1431655765)<<1|r>>>1&1431655765)>>>0,r=((r&858993459)<<2|r>>>2&858993459)>>>0,r=((r&252645135)<<4|r>>>4&252645135)>>>0,r=((r&16711935)<<8|r>>>8&16711935)>>>0,r*23283064365386963e-26}function qs(u,r,e){const t=new Float32Array(u*r*4);for(let n=0;n<r;n++)for(let o=0;o<u;o++){const i=(o+.5)/u,a=(n+.5)/r,l=a*a,c=l*l,d=Math.sqrt(1-i*i),f=i;let p=0,h=0;for(let m=0;m<e;m++){const y=(m+.5)/e,g=js(m),b=(1-g)/(1+(c-1)*g),w=Math.sqrt(b),B=Math.sqrt(Math.max(0,1-b)),x=2*Ws*y,U=B*Math.cos(x),R=w,A=d*U+f*R;if(A<=0)continue;const I=2*A*R-f,k=Math.max(0,I),v=Math.max(0,w);if(k<=0)continue;const M=c/2,T=i/(i*(1-M)+M),G=k/(k*(1-M)+M),S=T*G*A/(v*i),N=Math.pow(1-A,5);p+=S*(1-N),h+=S*N}const _=(n*u+o)*4;t[_+0]=p/e,t[_+1]=h/e,t[_+2]=0,t[_+3]=1}return t}function Ys(u){const r=new Float32Array([u]),e=new Uint32Array(r.buffer)[0],t=e>>31&1,n=e>>23&255,o=e&8388607;if(n===255)return t<<15|31744|(o?1:0);if(n===0)return t<<15;const i=n-127+15;return i>=31?t<<15|31744:i<=0?t<<15:t<<15|i<<10|o>>13}function Xs(u){const r=new Uint16Array(u.length);for(let e=0;e<u.length;e++)r[e]=Ys(u[e]);return r}const No=new WeakMap;function $s(u){const r=No.get(u);if(r)return r;const e=Xs(qs(64,64,512)),t=u.createTexture({label:"IBL BRDF LUT",size:{width:64,height:64},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return u.queue.writeTexture({texture:t},e,{bytesPerRow:64*8},{width:64,height:64}),No.set(u,t),t}const Io=new WeakMap;function Zs(u){const r=Io.get(u);if(r)return r;const e=u.createBindGroupLayout({label:"IblBGL0",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.COMPUTE,sampler:{type:"filtering"}}]}),t=u.createBindGroupLayout({label:"IblBGL1",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"2d"}}]}),n=u.createPipelineLayout({bindGroupLayouts:[e,t]}),o=u.createShaderModule({label:"IblCompute",code:Fs}),i=u.createComputePipeline({label:"IblIrradiancePipeline",layout:n,compute:{module:o,entryPoint:"cs_irradiance"}}),a=u.createComputePipeline({label:"IblPrefilterPipeline",layout:n,compute:{module:o,entryPoint:"cs_prefilter"}}),l=u.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"clamp-to-edge"}),c={irrPipeline:i,pfPipeline:a,bgl0:e,bgl1:t,sampler:l};return Io.set(u,c),c}async function Ks(u,r,e=.2){const{irrPipeline:t,pfPipeline:n,bgl0:o,bgl1:i,sampler:a}=Zs(u),l=u.createTexture({label:"IBL Irradiance",size:{width:tn,height:tn,depthOrArrayLayers:6},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),c=u.createTexture({label:"IBL Prefiltered",size:{width:Dn,height:Dn,depthOrArrayLayers:6},mipLevelCount:en,format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),d=(k,v)=>{const M=u.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return u.queue.writeBuffer(M,0,new Float32Array([e,k,v,0])),M},f=r.createView(),p=k=>u.createBindGroup({layout:o,entries:[{binding:0,resource:{buffer:k}},{binding:1,resource:f},{binding:2,resource:a}]}),h=k=>u.createBindGroup({layout:i,entries:[{binding:0,resource:k}]}),_=Array.from({length:6},(k,v)=>d(0,v)),m=Hs.flatMap((k,v)=>Array.from({length:6},(M,T)=>d(k,T))),y=_.map(p),g=m.map(p),b=Array.from({length:6},(k,v)=>h(l.createView({dimension:"2d",baseArrayLayer:v,arrayLayerCount:1}))),w=Array.from({length:en*6},(k,v)=>{const M=Math.floor(v/6),T=v%6;return h(c.createView({dimension:"2d",baseMipLevel:M,mipLevelCount:1,baseArrayLayer:T,arrayLayerCount:1}))}),B=u.createCommandEncoder({label:"IblComputeEncoder"}),x=B.beginComputePass({label:"IblComputePass"});x.setPipeline(t);for(let k=0;k<6;k++)x.setBindGroup(0,y[k]),x.setBindGroup(1,b[k]),x.dispatchWorkgroups(Math.ceil(tn/8),Math.ceil(tn/8));x.setPipeline(n);for(let k=0;k<en;k++){const v=Dn>>k;for(let M=0;M<6;M++)x.setBindGroup(0,g[k*6+M]),x.setBindGroup(1,w[k*6+M]),x.dispatchWorkgroups(Math.ceil(v/8),Math.ceil(v/8))}x.end(),u.queue.submit([B.finish()]),await u.queue.onSubmittedWorkDone(),_.forEach(k=>k.destroy()),m.forEach(k=>k.destroy());const U=$s(u),R=l.createView({dimension:"cube"}),A=c.createView({dimension:"cube"}),I=U.createView();return{irradiance:l,prefiltered:c,brdfLut:U,irradianceView:R,prefilteredView:A,brdfLutView:I,levels:en,destroy(){l.destroy(),c.destroy()}}}class Ve{constructor(r,e){s(this,"gpuTexture");s(this,"view");s(this,"type");this.gpuTexture=r,this.type=e,this.view=r.createView({dimension:e==="cube"?"cube":e==="3d"?"3d":"2d"})}destroy(){this.gpuTexture.destroy()}static createSolid(r,e,t,n,o=255){const i=r.createTexture({size:{width:1,height:1},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return r.queue.writeTexture({texture:i},new Uint8Array([e,t,n,o]),{bytesPerRow:4},{width:1,height:1}),new Ve(i,"2d")}static fromBitmap(r,e,{srgb:t=!1,usage:n}={}){const o=t?"rgba8unorm-srgb":"rgba8unorm";n=n?n|(GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT):GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT;const i=r.createTexture({size:{width:e.width,height:e.height},format:o,usage:n});return r.queue.copyExternalImageToTexture({source:e,flipY:!1},{texture:i},{width:e.width,height:e.height}),new Ve(i,"2d")}static async fromUrl(r,e,t={}){const n=await(await fetch(e)).blob(),o={colorSpaceConversion:"none"};t.resizeWidth!==void 0&&t.resizeHeight!==void 0&&(o.resizeWidth=t.resizeWidth,o.resizeHeight=t.resizeHeight,o.resizeQuality="high");const i=await createImageBitmap(n,o);return Ve.fromBitmap(r,i,t)}}const Js=`// Decodes an RGBE (Radiance HDR) texture into a linear rgba16float texture.
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
`;function Qs(u){const r=new Uint8Array(u);let e=0;function t(){let p="";for(;e<r.length&&r[e]!==10;)r[e]!==13&&(p+=String.fromCharCode(r[e])),e++;return e<r.length&&e++,p}const n=t();if(!n.startsWith("#?RADIANCE")&&!n.startsWith("#?RGBE"))throw new Error(`Not a Radiance HDR file (magic: "${n}")`);for(;t().length!==0;);const o=t(),i=o.match(/-Y\s+(\d+)\s+\+X\s+(\d+)/);if(!i)throw new Error(`Unrecognized HDR resolution: "${o}"`);const a=parseInt(i[1],10),l=parseInt(i[2],10),c=new Uint8Array(l*a*4);function d(p){const h=new Uint8Array(l),_=new Uint8Array(l),m=new Uint8Array(l),y=new Uint8Array(l),g=[h,_,m,y];for(let w=0;w<4;w++){const B=g[w];let x=0;for(;x<l;){const U=r[e++];if(U>128){const R=U-128,A=r[e++];B.fill(A,x,x+R),x+=R}else B.set(r.subarray(e,e+U),x),e+=U,x+=U}}const b=p*l*4;for(let w=0;w<l;w++)c[b+w*4+0]=h[w],c[b+w*4+1]=_[w],c[b+w*4+2]=m[w],c[b+w*4+3]=y[w]}function f(p,h,_,m,y){const g=p*l*4;c[g+0]=h,c[g+1]=_,c[g+2]=m,c[g+3]=y;let b=1;for(;b<l;){const w=r[e++],B=r[e++],x=r[e++],U=r[e++];if(w===1&&B===1&&x===1){const R=g+(b-1)*4;for(let A=0;A<U;A++)c[g+b*4+0]=c[R+0],c[g+b*4+1]=c[R+1],c[g+b*4+2]=c[R+2],c[g+b*4+3]=c[R+3],b++}else c[g+b*4+0]=w,c[g+b*4+1]=B,c[g+b*4+2]=x,c[g+b*4+3]=U,b++}}for(let p=0;p<a&&!(e+4>r.length);p++){const h=r[e++],_=r[e++],m=r[e++],y=r[e++];if(h===2&&_===2&&!(m&128)){const g=m<<8|y;if(g!==l)throw new Error(`HDR scanline width mismatch: ${g} vs ${l}`);d(p)}else f(p,h,_,m,y)}return{width:l,height:a,data:c}}const Oo=new WeakMap;function el(u){const r=Oo.get(u);if(r)return r;const e=u.createBindGroupLayout({label:"RgbeSrcBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"uint"}}]}),t=u.createBindGroupLayout({label:"RgbeDstBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"2d"}}]}),n=u.createPipelineLayout({bindGroupLayouts:[e,t]}),o=u.createShaderModule({label:"RgbeDecode",code:Js}),a={pipeline:u.createComputePipeline({label:"RgbeDecodePipeline",layout:n,compute:{module:o,entryPoint:"cs_decode"}}),srcBGL:e,dstBGL:t};return Oo.set(u,a),a}async function tl(u,r){const{width:e,height:t,data:n}=r,{pipeline:o,srcBGL:i,dstBGL:a}=el(u),l=u.createTexture({label:"Sky RGBE Raw",size:{width:e,height:t},format:"rgba8uint",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});u.queue.writeTexture({texture:l},n.buffer,{bytesPerRow:e*4},{width:e,height:t});const c=u.createTexture({label:"Sky HDR Texture",size:{width:e,height:t},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),d=u.createBindGroup({layout:i,entries:[{binding:0,resource:l.createView()}]}),f=u.createBindGroup({layout:a,entries:[{binding:0,resource:c.createView()}]}),p=u.createCommandEncoder({label:"RgbeDecodeEncoder"}),h=p.beginComputePass({label:"RgbeDecodePass"});return h.setPipeline(o),h.setBindGroup(0,d),h.setBindGroup(1,f),h.dispatchWorkgroups(Math.ceil(e/8),Math.ceil(t/8)),h.end(),u.queue.submit([p.finish()]),await u.queue.onSubmittedWorkDone(),l.destroy(),new Ve(c,"2d")}class br{constructor(r,e,t,n,o,i,a){s(this,"colorAtlas");s(this,"normalAtlas");s(this,"merAtlas");s(this,"heightAtlas");s(this,"blockSize");s(this,"blockCount");s(this,"_atlasWidth");s(this,"_atlasHeight");this.colorAtlas=r,this.normalAtlas=e,this.merAtlas=t,this.heightAtlas=n,this.blockSize=o,this._atlasWidth=i,this._atlasHeight=a,this.blockCount=Math.floor(i/o)}static async load(r,e,t,n,o,i=16){async function a(b){const w=await(await fetch(b)).blob();return createImageBitmap(w,{colorSpaceConversion:"none"})}const[l,c,d,f]=await Promise.all([a(e),a(t),a(n),a(o)]),p=l.width,h=l.height,_=Ve.fromBitmap(r,l,{srgb:!0}),m=Ve.fromBitmap(r,c,{srgb:!1}),y=Ve.fromBitmap(r,d,{srgb:!1}),g=Ve.fromBitmap(r,f,{srgb:!1});return new br(_,m,y,g,i,p,h)}uvTransform(r){const e=this.blockSize/this._atlasWidth,t=this.blockSize/this._atlasHeight;return[r*e,0,e,t]}destroy(){this.colorAtlas.destroy(),this.normalAtlas.destroy(),this.merAtlas.destroy(),this.heightAtlas.destroy()}}var Se=(u=>(u[u.None=0]="None",u[u.SnowyMountains=1]="SnowyMountains",u[u.RockyMountains=2]="RockyMountains",u[u.GrassyPlains=3]="GrassyPlains",u[u.SnowyPlains=4]="SnowyPlains",u[u.Desert=5]="Desert",u[u.Max=6]="Max",u))(Se||{}),Qe=(u=>(u[u.None=0]="None",u[u.Rain=1]="Rain",u[u.Snow=2]="Snow",u))(Qe||{});function Do(u){switch(u){case 1:return{cloudBase:90,cloudTop:200};case 2:return{cloudBase:75,cloudTop:160};default:return{cloudBase:75,cloudTop:105}}}const nn=.05,nl=[[.35,5,3],[-.15,3,4],[-.3,4,1],[-.5,1,2]];function rl(u){for(const[e,t,n]of nl){const o=u-e;if(o>=-nn&&o<=nn)return{biome1:n,biome2:t,blend:(o+nn)/(2*nn)}}const r=ol(u);return{biome1:r,biome2:r,blend:0}}function ol(u){return u>.35?5:u>-.15?3:u>-.3?4:u>-.5?1:2}function il(u,r){let e=(Math.imul(u|0,2654435769)^Math.imul(r|0,1367130551))>>>0;return e=Math.imul(e^e>>>16,73244475)>>>0,e=(e^e>>>16)>>>0,e/4294967296}const Z=class Z{constructor(r,e,t){s(this,"blocks",new Uint8Array(Z.CHUNK_WIDTH*Z.CHUNK_HEIGHT*Z.CHUNK_DEPTH));s(this,"globalPosition",new j);s(this,"opaqueIndex",-1);s(this,"transparentIndex",-1);s(this,"waterIndex",-1);s(this,"drawCommandIndex",-1);s(this,"chunkDataIndex",-1);s(this,"aabbTreeIndex",-1);s(this,"aliveBlocks",0);s(this,"opaqueBlocks",0);s(this,"transparentBlocks",0);s(this,"waterBlocks",0);s(this,"lightBlocks",0);s(this,"isDeleted",!1);this.globalPosition.set(r,e,t)}generateVertices(r){const e=Z.CHUNK_WIDTH,t=Z.CHUNK_HEIGHT,n=Z.CHUNK_DEPTH,o=5;let i=0,a=0,l=0;for(let T=0;T<this.blocks.length;T++){const G=this.blocks[T];G===L.NONE||he(G)||(Ce(G)?l++:bt(G)?a++:i++)}const c=new Float32Array(i*36*o),d=new Float32Array(a*36*o),f=new Float32Array(l*6*o),p=new Uint16Array(e*t*6);let h=0,_=0,m=0,y=!1;const g=[],b=e+2,w=t+2,B=b*w,x=new Uint8Array(b*w*(n+2));for(let T=0;T<n;T++)for(let G=0;G<t;G++)for(let S=0;S<e;S++)x[S+1+(G+1)*b+(T+1)*B]=this.blocks[S+G*e+T*e*t];if(r!=null&&r.negX){const T=r.negX;for(let G=0;G<n;G++)for(let S=0;S<t;S++)x[0+(S+1)*b+(G+1)*B]=T[e-1+S*e+G*e*t]}if(r!=null&&r.posX){const T=r.posX;for(let G=0;G<n;G++)for(let S=0;S<t;S++)x[e+1+(S+1)*b+(G+1)*B]=T[0+S*e+G*e*t]}if(r!=null&&r.negY){const T=r.negY;for(let G=0;G<n;G++)for(let S=0;S<e;S++)x[S+1+0+(G+1)*B]=T[S+(t-1)*e+G*e*t]}if(r!=null&&r.posY){const T=r.posY;for(let G=0;G<n;G++)for(let S=0;S<e;S++)x[S+1+(t+1)*b+(G+1)*B]=T[S+0*e+G*e*t]}if(r!=null&&r.negZ){const T=r.negZ;for(let G=0;G<t;G++)for(let S=0;S<e;S++)x[S+1+(G+1)*b+0]=T[S+G*e+(n-1)*e*t]}if(r!=null&&r.posZ){const T=r.posZ;for(let G=0;G<t;G++)for(let S=0;S<e;S++)x[S+1+(G+1)*b+(n+1)*B]=T[S+G*e+0*e*t]}const U=(T,G,S,N)=>{p[(T*t+G)*6+N]|=1<<S},R=(T,G,S,N)=>(p[(T*t+G)*6+N]&1<<S)!==0,A=(T,G,S)=>x[T+1+(G+1)*b+(S+1)*B],I=(T,G)=>!(G===L.NONE||Ce(T)||Ce(G)||!he(T)&&he(G)||!bt(T)&&bt(G)),k=Z.CUBE_VERTS;for(let T=0;T<e;T++)for(let G=0;G<t;G++)for(let S=0;S<n;S++){const N=A(T,G,S);if(N===L.NONE)continue;if(he(N)){g.push({x:T,y:G,z:S}),y=!0;continue}if(Ce(N)){for(let ne=0;ne<6;ne++)f[m++]=T+.5,f[m++]=G+.5,f[m++]=S+.5,f[m++]=6,f[m++]=N;continue}const X=bt(N),V=I(N,A(T,G,S-1))||R(T,G,S,0),F=I(N,A(T,G,S+1))||R(T,G,S,1),H=I(N,A(T-1,G,S))||R(T,G,S,2),C=I(N,A(T+1,G,S))||R(T,G,S,3),Y=I(N,A(T,G-1,S))||R(T,G,S,4),te=I(N,A(T,G+1,S))||R(T,G,S,5);if(V&&F&&H&&C&&Y&&te)continue;let q=G;if(!V||!F||!H||!C){let ne=G;for(;ne<t&&A(T,ne,S)===N;){q=ne;ne++}}if(!V||!F){let ne=T,re=T,fe=0;for(;re<e&&A(re,G,S)===N;){let ee=G;for(;ee<=q&&A(re,ee,S)===N;){fe=ee;ee++}if(fe===q)ne=re,re++;else break}for(let ee=T;ee<=ne;ee++)for(let me=G;me<=q;me++)V||U(ee,me,S,0),F||U(ee,me,S,1);let ie,O;!V&&!F?(ie=0,O=12):V?(ie=6,O=12):(ie=0,O=6);const W=ne+1-T,ce=q+1-G,Q=X?d:c;let le=X?_:h;for(let ee=ie;ee<O;ee++){const me=k[ee*3],Be=k[ee*3+1],Oe=k[ee*3+2];Q[le++]=T+.5*(W-1)+.5+me*W,Q[le++]=G+.5*(ce-1)+.5+Be*ce,Q[le++]=S+.5+Oe,Q[le++]=ee<6?0:1,Q[le++]=N}X?_=le:h=le}if(!H||!C){let ne=S,re=S,fe=0;for(;re<n&&A(T,G,re)===N;){let ee=G;for(;ee<=q&&A(T,ee,re)===N;){fe=ee;ee++}if(fe===q)ne=re,re++;else break}for(let ee=S;ee<=ne;ee++)for(let me=G;me<=q;me++)H||U(T,me,ee,2),C||U(T,me,ee,3);let ie,O;!H&&!C?(ie=12,O=24):H?(ie=18,O=24):(ie=12,O=18);const W=ne+1-S,ce=q+1-G,Q=X?d:c;let le=X?_:h;for(let ee=ie;ee<O;ee++){const me=k[ee*3],Be=k[ee*3+1],Oe=k[ee*3+2];Q[le++]=T+.5+me,Q[le++]=G+.5*(ce-1)+.5+Be*ce,Q[le++]=S+.5*(W-1)+.5+Oe*W,Q[le++]=ee<18?2:3,Q[le++]=N}X?_=le:h=le}if(!Y||!te){let ne=T,re=T;for(;re<e&&A(re,G,S)===N;){ne=re;re++}let fe=S,ie=S,O=0;for(;ie<n&&A(T,G,ie)===N;){let Be=T;for(;Be<=ne&&A(Be,G,ie)===N;){O=Be;Be++}if(O===ne)fe=ie,ie++;else break}for(let Be=T;Be<=ne;Be++)for(let Oe=S;Oe<=fe;Oe++)Y||U(Be,G,Oe,4),te||U(Be,G,Oe,5);let W,ce;!Y&&!te?(W=24,ce=36):Y?(W=30,ce=36):(W=24,ce=30);const Q=ne+1-T,le=fe+1-S,ee=X?d:c;let me=X?_:h;for(let Be=W;Be<ce;Be++){const Oe=k[Be*3],Ye=k[Be*3+1],ze=k[Be*3+2];ee[me++]=T+.5*(Q-1)+.5+Oe*Q,ee[me++]=G+.5+Ye,ee[me++]=S+.5*(le-1)+.5+ze*le,ee[me++]=Be<30?4:5,ee[me++]=N}X?_=me:h=me}}let v=null,M=0;if(y){const T=(r==null?void 0:r.negX)!==void 0,G=(r==null?void 0:r.posX)!==void 0,S=(r==null?void 0:r.negZ)!==void 0,N=(r==null?void 0:r.posZ)!==void 0;v=new Float32Array(g.length*6*6*3);let E=0;for(const X of g){const{x:V,y:F,z:H}=X,C=V+1,Y=F+1,te=H+1,q=x[C+(Y+1)*b+te*B];he(q)||(v[E++]=V,v[E++]=F+1,v[E++]=H,v[E++]=V+1,v[E++]=F+1,v[E++]=H,v[E++]=V+1,v[E++]=F+1,v[E++]=H+1,v[E++]=V,v[E++]=F+1,v[E++]=H,v[E++]=V,v[E++]=F+1,v[E++]=H+1,v[E++]=V+1,v[E++]=F+1,v[E++]=H+1);const ne=x[C+Y*b+(te+1)*B],re=H===n-1;!he(ne)&&!(re&&ne===L.NONE&&!N)&&(v[E++]=V,v[E++]=F,v[E++]=H+1,v[E++]=V+1,v[E++]=F,v[E++]=H+1,v[E++]=V+1,v[E++]=F+1,v[E++]=H+1,v[E++]=V,v[E++]=F,v[E++]=H+1,v[E++]=V,v[E++]=F+1,v[E++]=H+1,v[E++]=V+1,v[E++]=F+1,v[E++]=H+1);const fe=x[C+Y*b+(te-1)*B],ie=H===0;!he(fe)&&!(ie&&fe===L.NONE&&!S)&&(v[E++]=V+1,v[E++]=F,v[E++]=H,v[E++]=V,v[E++]=F,v[E++]=H,v[E++]=V,v[E++]=F+1,v[E++]=H,v[E++]=V+1,v[E++]=F,v[E++]=H,v[E++]=V+1,v[E++]=F+1,v[E++]=H,v[E++]=V,v[E++]=F+1,v[E++]=H);const O=x[C+1+Y*b+te*B],W=V===e-1;!he(O)&&!(W&&O===L.NONE&&!G)&&(v[E++]=V+1,v[E++]=F,v[E++]=H,v[E++]=V+1,v[E++]=F+1,v[E++]=H,v[E++]=V+1,v[E++]=F+1,v[E++]=H+1,v[E++]=V+1,v[E++]=F,v[E++]=H,v[E++]=V+1,v[E++]=F,v[E++]=H+1,v[E++]=V+1,v[E++]=F+1,v[E++]=H+1);const ce=x[C-1+Y*b+te*B],Q=V===0;!he(ce)&&!(Q&&ce===L.NONE&&!T)&&(v[E++]=V,v[E++]=F,v[E++]=H+1,v[E++]=V,v[E++]=F+1,v[E++]=H+1,v[E++]=V,v[E++]=F+1,v[E++]=H,v[E++]=V,v[E++]=F,v[E++]=H+1,v[E++]=V,v[E++]=F,v[E++]=H,v[E++]=V,v[E++]=F+1,v[E++]=H);const le=x[C+(Y-1)*b+te*B];he(le)||(v[E++]=V,v[E++]=F,v[E++]=H+1,v[E++]=V+1,v[E++]=F,v[E++]=H+1,v[E++]=V+1,v[E++]=F,v[E++]=H,v[E++]=V,v[E++]=F,v[E++]=H+1,v[E++]=V,v[E++]=F,v[E++]=H,v[E++]=V+1,v[E++]=F,v[E++]=H)}M=E/3,v=v.subarray(0,E)}return{opaque:c.subarray(0,h),opaqueCount:h/o,transparent:d.subarray(0,_),transparentCount:_/o,water:v||new Float32Array(0),waterCount:M,prop:f.subarray(0,m),propCount:m/o}}generateBlocks(r,e){const t=Z.CHUNK_WIDTH,n=Z.CHUNK_HEIGHT,o=Z.CHUNK_DEPTH,i=new Float64Array(t*o),a=new Float64Array(t*o),l=new Float32Array(t*o),c=new Uint8Array(t*o),d=new Uint8Array(t*o),f=new Float32Array(t*o);for(let p=0;p<o;p++)for(let h=0;h<t;h++){const _=h+this.globalPosition.x,m=p+this.globalPosition.z,y=h+p*t,g=Ie(_/512,-5,m/512,0,0,0,r+31337),b=Ie(_/2048,10,m/2048,0,0,0,r);i[y]=Math.abs(Ie(_/1024,0,m/1024,0,0,0,r)*450)*Math.max(.1,(b+1)*.5),a[y]=yi(_/256,15,m/256,2,.6,1.2,6)*12,l[y]=e?e(_,m):0;const w=rl(g);c[y]=w.biome1,d[y]=w.biome2,f[y]=w.blend}for(let p=0;p<o;p++)for(let h=0;h<n;h++)for(let _=0;_<t;_++){if(this.getBlock(_,h,p)!==L.NONE)continue;const m=_+p*t,y=_+this.globalPosition.x,g=h+this.globalPosition.y,b=p+this.globalPosition.z,w=Math.abs(Ie(y/256,g/512,b/256,0,0,0,r)*i[m])+a[m]+l[m];g<w?Z._isCave(y,g,b,r,w-g)?g<Z.SEA_LEVEL+1?this.setBlock(_,h,p,L.WATER):this.setBlock(_,h,p,L.NONE):this.setBlock(_,h,p,this._generateBlockBasedOnBiome(c[m],d[m],f[m],y,g,b,w)):g<Z.SEA_LEVEL+1&&this.setBlock(_,h,p,L.WATER)}for(let p=0;p<Z.CHUNK_DEPTH;p++)for(let h=0;h<Z.CHUNK_HEIGHT;h++)for(let _=0;_<Z.CHUNK_WIDTH;_++){if(this.getBlock(_,h,p)===L.NONE)continue;const m=_+this.globalPosition.x,y=h+this.globalPosition.y,g=p+this.globalPosition.z;this._generateAdditionalBlocks(_,h,p,m,y,g,r)}}setBlock(r,e,t,n){if(r<0||r>=Z.CHUNK_WIDTH||e<0||e>=Z.CHUNK_HEIGHT||t<0||t>=Z.CHUNK_DEPTH)return;const o=r+e*Z.CHUNK_WIDTH+t*Z.CHUNK_WIDTH*Z.CHUNK_HEIGHT,i=this.blocks[o];i!==L.NONE&&(this.aliveBlocks--,he(i)?this.waterBlocks--:bt(i)?this.transparentBlocks--:this.opaqueBlocks--,io(i)&&this.lightBlocks--),this.blocks[o]=n,n!==L.NONE&&(this.aliveBlocks++,he(n)?this.waterBlocks++:bt(n)?this.transparentBlocks++:this.opaqueBlocks++,io(n)&&this.lightBlocks++)}getBlock(r,e,t){if(r<0||r>=Z.CHUNK_WIDTH||e<0||e>=Z.CHUNK_HEIGHT||t<0||t>=Z.CHUNK_DEPTH)return L.NONE;const n=r+e*Z.CHUNK_WIDTH+t*Z.CHUNK_WIDTH*Z.CHUNK_HEIGHT;return this.blocks[n]}getBlockIndex(r,e,t){return r<0||r>=Z.CHUNK_WIDTH||e<0||e>=Z.CHUNK_HEIGHT||t<0||t>=Z.CHUNK_DEPTH?-1:r+e*Z.CHUNK_WIDTH+t*Z.CHUNK_WIDTH*Z.CHUNK_HEIGHT}_generateAdditionalBlocks(r,e,t,n,o,i,a){const l=this.getBlock(r,e,t),c=this.getBlock(r-1,e,t),d=this.getBlock(r+1,e,t),f=this.getBlock(r,e,t+1),p=this.getBlock(r,e,t-1),h=this.getBlock(r,e+1,t);if(l==L.SAND)if(o>0&&ke.global.randomUint32()%512==0){const _=ke.global.randomUint32()%5;for(let m=0;m<_;m++)this.setBlock(r,e+m,t,L.CACTUS)}else ke.global.randomUint32()%128==0&&this.setBlock(r,e+1,t,L.DEAD_BUSH);else if(l==L.SNOW||l==L.GRASS_SNOW){if(ke.global.randomUint32()%16==0&&o>12&&(h==L.NONE||he(h))&&(c==L.NONE||p==L.NONE))this.setBlock(r,e+1,t,L.DEAD_BUSH);else if(ke.global.randomUint32()%16==0&&o>12&&o<300&&e<Z.CHUNK_HEIGHT-5&&r>2&&t>2&&r<Z.CHUNK_WIDTH-2&&t<Z.CHUNK_DEPTH-2&&h==L.NONE&&d==L.NONE&&f==L.NONE&&p==L.NONE){const m=Math.max(ke.global.randomUint32()%5,5);for(let y=0;y<m;y++)this.setBlock(r,e+y,t,L.TRUNK);for(let y=-2;y<=2;y++){const g=y<-1||y>1?0:-1,b=y<-1||y>1?0:1;for(let w=-1+g;w<=1+b;w++){const B=Math.abs(w-r);for(let x=-1+g;x<=1+b;x++){const U=Math.abs(x-t),R=w*w+y*y+x*x,A=this.getBlock(r+w,e+m+y,t+x);R+2<ke.global.randomUint32()%24&&B!=2-g&&B!=2+b&&U!=2-g&&U!=2+b&&(A==L.NONE||A==L.SNOWYLEAVES)&&this.setBlock(r+w,e+m+y,t+x,L.SNOWYLEAVES)}}}}}else if(l==L.GRASS||l==L.DIRT)if(ke.global.randomUint32()%2==0&&o>5&&o<300&&e<Z.CHUNK_HEIGHT-5&&r>2&&t>2&&r<Z.CHUNK_WIDTH-2&&t<Z.CHUNK_DEPTH-2&&h==L.NONE&&d==L.NONE&&f==L.NONE&&p==L.NONE){const m=Math.max(ke.global.randomUint32()%5,5);for(let y=0;y<m;y++)this.setBlock(r,e+y,t,L.TRUNK);for(let y=-2;y<=2;y++){const g=y<-1||y>1?0:-1,b=y<-1||y>1?0:1;for(let w=-1+g;w<=1+b;w++){const B=Math.abs(w-r);for(let x=-1+g;x<=1+b;x++){const U=Math.abs(x-t),R=w*w+y*y+x*x,A=this.getBlock(r+w,e+m+y,t+x);R+2<ke.global.randomUint32()%24&&B!=2-g&&B!=2+b&&U!=2-g&&U!=2+b&&(A==L.NONE||A==L.TREELEAVES)&&this.setBlock(r+w,e+m+y,t+x,L.TREELEAVES)}}}}else o>5&&h==L.NONE&&(c==L.NONE||p==L.NONE)&&(ke.global.randomUint32()%8==0?this.setBlock(r,e+1,t,L.GRASS_PROP):ke.global.randomUint32()%8==0&&this.setBlock(r,e+1,t,L.FLOWER))}_generateBlockBasedOnBiome(r,e,t,n,o,i,a){const l=t>0&&r!==e&&il(n,i)<t?e:r,c=Math.floor(a)-o,d=a<Z.SEA_LEVEL+1;switch(l){case Se.GrassyPlains:return c===0?d?L.DIRT:L.GRASS:c<=3?L.DIRT:L.STONE;case Se.Desert:return c<=3?L.SAND:L.STONE;case Se.SnowyPlains:return c===0?L.GRASS_SNOW:c<=2?L.SNOW:L.STONE;case Se.SnowyMountains:{const f=Math.abs(oo(n/256,o/256,i/256,2,.6,1))*35;return c===0?L.GRASS_SNOW:c<=4||f>20?L.SNOW:L.STONE}case Se.RockyMountains:return c===0&&Math.abs(oo(n/64,o/64,i/64,2,.6,1))<.12?L.SNOW:L.STONE;default:return L.GRASS}}static _determineBiomeFromNoise(r){return r>.35?Se.Desert:r>-.15?Se.GrassyPlains:r>-.3?Se.SnowyPlains:r>-.5?Se.SnowyMountains:Se.RockyMountains}static _determineBiome(r,e,t,n){const o=Ie(r/512,-5,t/512,0,0,0,n+31337);return Z._determineBiomeFromNoise(o)}static _isCave(r,e,t,n,o){if(o<3)return!1;if(Ie(r/60,e/60,t/60,0,0,0,n+777)>.6)return!0;const a=Ie(r/24,e/24,t/24,0,0,0,n+13579),l=Ie(r/24,e/14,t/24,0,0,0,n+24680);if(Math.abs(a)<.12&&Math.abs(l)<.12)return!0;const c=Ie(r/28,e/18,t/28,0,0,0,n+55555),d=Ie(r/28,e/28,t/28,0,0,0,n+99999);return Math.abs(c)<.1&&Math.abs(d)<.1}};s(Z,"CHUNK_WIDTH",16),s(Z,"CHUNK_HEIGHT",16),s(Z,"CHUNK_DEPTH",16),s(Z,"SEA_LEVEL",15),s(Z,"CUBE_VERTS",new Float32Array([-.5,-.5,-.5,.5,.5,-.5,.5,-.5,-.5,.5,.5,-.5,-.5,-.5,-.5,-.5,.5,-.5,-.5,-.5,.5,.5,-.5,.5,.5,.5,.5,.5,.5,.5,-.5,.5,.5,-.5,-.5,.5,-.5,.5,.5,-.5,.5,-.5,-.5,-.5,-.5,-.5,-.5,-.5,-.5,-.5,.5,-.5,.5,.5,.5,.5,.5,.5,-.5,-.5,.5,.5,-.5,.5,-.5,-.5,.5,.5,.5,.5,-.5,.5,-.5,-.5,-.5,.5,-.5,-.5,.5,-.5,.5,.5,-.5,.5,-.5,-.5,.5,-.5,-.5,-.5,-.5,.5,-.5,.5,.5,.5,.5,.5,-.5,.5,.5,.5,-.5,.5,-.5,-.5,.5,.5]));let se=Z;const Ai=128;function al(u,r,e){const t=Ie(u/2048,10,r/2048,0,0,0,e),n=Math.abs(Ie(u/1024,0,r/1024,0,0,0,e)*450)*Math.max(.1,(t+1)*.5),o=yi(u/256,15,r/256,2,.6,1.2,6)*12;return Math.abs(Ie(u/256,0,r/256,0,0,0,e)*n)+o}function Vo(u,r,e,t){const n=e|0,o=t|0,i=e-n,a=t-o,l=u[n+o*r],c=u[n+1+o*r],d=u[n+(o+1)*r],f=u[n+1+(o+1)*r];return[(c-l)*(1-a)+(f-d)*a,(d-l)*(1-i)+(f-c)*i,l*(1-i)*(1-a)+c*i*(1-a)+d*(1-i)*a+f*i*a]}function zo(u){return Math.imul(u,1664525)+1013904223>>>0}function sl(u,r,e){const t=r*r>>2,n=.05,o=4,i=.01,a=.4,l=.3,c=.01,d=4,f=20,p=2,h=p*2+1,_=new Float32Array(h*h);let m=0;for(let b=-p;b<=p;b++)for(let w=-p;w<=p;w++){const B=Math.sqrt(w*w+b*b);if(B<p){const x=1-B/p;_[w+p+(b+p)*h]=x,m+=x}}for(let b=0;b<_.length;b++)_[b]/=m;const y=r-2;let g=(e^3735928559)>>>0;for(let b=0;b<t;b++){g=zo(g);let w=g/4294967295*y;g=zo(g);let B=g/4294967295*y,x=0,U=0,R=1,A=1,I=0;for(let k=0;k<f;k++){const v=w|0,M=B|0;if(v<0||v>=y||M<0||M>=y)break;const T=w-v,G=B-M,[S,N,E]=Vo(u,r,w,B);x=x*n-S*(1-n),U=U*n-N*(1-n);const X=Math.sqrt(x*x+U*U);if(X<1e-6)break;x/=X,U/=X;const V=w+x,F=B+U;if(V<0||V>=y||F<0||F>=y)break;const[,,H]=Vo(u,r,V,F),C=H-E,Y=Math.max(-C*R*A*o,i);if(I>Y||C>0){const te=C>0?Math.min(C,I):(I-Y)*l;I-=te,u[v+M*r]+=te*(1-T)*(1-G),u[v+1+M*r]+=te*T*(1-G),u[v+(M+1)*r]+=te*(1-T)*G,u[v+1+(M+1)*r]+=te*T*G}else{const te=Math.min((Y-I)*a,-C);for(let q=-p;q<=p;q++)for(let ne=-p;ne<=p;ne++){const re=v+ne,fe=M+q;re<0||re>=r||fe<0||fe>=r||(u[re+fe*r]-=_[ne+p+(q+p)*h]*te)}I+=te}R=Math.sqrt(Math.max(R*R+C*d,0)),A*=1-c,w=V,B=F}}}function ll(u,r,e){const t=Ai,n=u*t,o=r*t,i=new Float32Array(t*t);for(let f=0;f<t;f++)for(let p=0;p<t;p++)i[p+f*t]=al(n+p,o+f,e);const a=new Float32Array(i),l=(e^(Math.imul(u,73856093)^Math.imul(r,19349663)))>>>0;sl(a,t,l);const c=12,d=new Float32Array(t*t);for(let f=0;f<t;f++)for(let p=0;p<t;p++){const h=p+f*t,_=Math.min(p,t-1-p,f,t-1-f),m=Math.min(_/c,1);d[h]=(a[h]-i[h])*m}return d}const $=class ${constructor(r){s(this,"seed");s(this,"renderDistanceH",8);s(this,"renderDistanceV",4);s(this,"chunksPerFrame",2);s(this,"time",0);s(this,"waterSimulationRadius",32);s(this,"waterTickInterval",.25);s(this,"_waterTickTimer",0);s(this,"_dirtyChunks",null);s(this,"onChunkAdded");s(this,"onChunkUpdated");s(this,"onChunkRemoved");s(this,"_chunks",new Map);s(this,"_generated",new Set);s(this,"_erosionCache",new Map);s(this,"pendingChunks",0);s(this,"_neighborScratch",{negX:void 0,posX:void 0,negY:void 0,posY:void 0,negZ:void 0,posZ:void 0});s(this,"_scratchTopD2",null);s(this,"_scratchTopXYZ",null);s(this,"_scratchToDelete",[]);s(this,"_scratchWaterBlocks",[]);s(this,"_scratchDirtyChunks",new Set);this.seed=r}get chunkCount(){return this._chunks.size}get chunks(){return this._chunks.values()}getBiomeAt(r,e,t){return se._determineBiome(r,e,t,this.seed)}static normalizeChunkPosition(r,e,t){return[Math.floor(r/se.CHUNK_WIDTH),Math.floor(e/se.CHUNK_HEIGHT),Math.floor(t/se.CHUNK_DEPTH)]}static _cx(r){return Math.floor(r/se.CHUNK_WIDTH)}static _cy(r){return Math.floor(r/se.CHUNK_HEIGHT)}static _cz(r){return Math.floor(r/se.CHUNK_DEPTH)}static _key(r,e,t){return(r+32768)*4294967296+(e+32768)*65536+(t+32768)}getChunk(r,e,t){return this._chunks.get($._key($._cx(r),$._cy(e),$._cz(t)))}chunkExists(r,e,t){return this.getChunk(r,e,t)!==void 0}getBlockType(r,e,t){const n=this.getChunk(r,e,t);if(!n)return L.NONE;const o=Math.round(r)-n.globalPosition.x,i=Math.round(e)-n.globalPosition.y,a=Math.round(t)-n.globalPosition.z;return n.getBlock(o,i,a)}setBlockType(r,e,t,n){let o=this.getChunk(r,e,t);if(!o){const c=$._cx(r),d=$._cy(e),f=$._cz(t);o=new se(c*se.CHUNK_WIDTH,d*se.CHUNK_HEIGHT,f*se.CHUNK_DEPTH),this._insertChunk(o)}const i=Math.round(r)-o.globalPosition.x,a=Math.round(e)-o.globalPosition.y,l=Math.round(t)-o.globalPosition.z;return o.setBlock(i,a,l,n),this._updateChunk(o,i,a,l),!0}getTopBlockY(r,e,t){const n=se.CHUNK_HEIGHT,o=Math.floor(r),i=Math.floor(e);for(let a=Math.floor(t/n);a>=0;a--){const l=this.getChunk(o,a*n,i);if(!l)continue;const c=o-l.globalPosition.x,d=i-l.globalPosition.z;for(let f=n-1;f>=0;f--){const p=l.getBlock(c,f,d);if(p!==L.NONE&&!Ce(p))return l.globalPosition.y+f+1}}return 0}getBlockByRay(r,e,t){const n=Number.MAX_VALUE;let o=Math.floor(r.x),i=Math.floor(r.y),a=Math.floor(r.z);const l=1/e.x,c=1/e.y,d=1/e.z,f=e.x>0?1:-1,p=e.y>0?1:-1,h=e.z>0?1:-1,_=Math.min(l*f,n),m=Math.min(c*p,n),y=Math.min(d*h,n);let g=Math.abs((o+Math.max(f,0)-r.x)*l),b=Math.abs((i+Math.max(p,0)-r.y)*c),w=Math.abs((a+Math.max(h,0)-r.z)*d),B=0,x=0,U=0;for(let R=0;R<t;R++){if(R>0){const A=this.getChunk(o,i,a);if(A){const I=o-A.globalPosition.x,k=i-A.globalPosition.y,v=a-A.globalPosition.z,M=A.getBlock(I,k,v);if(M!==L.NONE&&!he(M))return{blockType:M,position:new j(o,i,a),face:new j(-B*f,-x*p,-U*h),chunk:A,relativePosition:new j(I,k,v)}}}B=(g<=w?1:0)*(g<=b?1:0),x=(b<=g?1:0)*(b<=w?1:0),U=(w<=b?1:0)*(w<=g?1:0),g+=_*B,b+=m*x,w+=y*U,o+=f*B,i+=p*x,a+=h*U}return null}addBlock(r,e,t,n,o,i,a){if(a===L.NONE||!this.getChunk(r,e,t))return!1;const c=this.getBlockType(r,e,t);if(Ce(c))return!1;const d=r+n,f=e+o,p=t+i,h=this.getBlockType(d,f,p);if(he(a)){if(h!==L.NONE&&!he(h))return!1}else if(h!==L.NONE&&!he(h))return!1;let _=this.getChunk(d,f,p);if(!_){const b=$._cx(d),w=$._cy(f),B=$._cz(p);_=new se(b*se.CHUNK_WIDTH,w*se.CHUNK_HEIGHT,B*se.CHUNK_DEPTH),this._insertChunk(_)}const m=d-_.globalPosition.x,y=f-_.globalPosition.y,g=p-_.globalPosition.z;return _.setBlock(m,y,g,a),this._updateChunk(_,m,y,g),!0}mineBlock(r,e,t){const n=this.getChunk(r,e,t);if(!n)return!1;const o=r-n.globalPosition.x,i=e-n.globalPosition.y,a=t-n.globalPosition.z,l=n.getBlock(o,i,a);return l===L.NONE?!1:he(l)?(n.setBlock(o,i,a,L.NONE),this._updateChunk(n,o,i,a),!0):(n.setBlock(o,i,a,L.NONE),this._updateChunk(n,o,i,a),!0)}update(r,e){this.time+=e,this._removeDistantChunks(r),this._createNearbyChunks(r),this._waterTickTimer+=e,this._waterTickTimer>=this.waterTickInterval&&(this._waterTickTimer=0,this._updateWaterFlow(r))}deleteChunk(r){var i;const e=$._cx(r.globalPosition.x),t=$._cy(r.globalPosition.y),n=$._cz(r.globalPosition.z),o=$._key(e,t,n);this._chunks.delete(o),this._generated.delete(o),r.isDeleted=!0,(i=this.onChunkRemoved)==null||i.call(this,r)}calcWaterLevel(r,e,t){const n=this.getChunk(r,e,t);if(!n||n.waterBlocks<=0)return 0;let o=this._calcWaterLevelInChunk(n,e);for(let i=1;i<=4;i++){const a=this.getChunk(r,e+i*se.CHUNK_HEIGHT,t);if(!a)break;const l=$._cx(r),c=$._cz(t),d=l*se.CHUNK_WIDTH-a.globalPosition.x,f=c*se.CHUNK_DEPTH-a.globalPosition.z;if(a.waterBlocks>0&&he(a.getBlock(d,0,f)))o+=this._calcWaterLevelInChunk(a,e);else break}return o}_calcWaterLevelInChunk(r,e){const t=r.globalPosition.y,n=se.CHUNK_HEIGHT;let o=0;return e<=t+n*.8&&o++,e<=t+n*.7&&o++,e<=t+n*.6&&o++,e<=t+n*.5&&o++,o}_getErosionRegion(r,e){const t=`${r},${e}`;let n=this._erosionCache.get(t);return n||(n=ll(r,e,this.seed),this._erosionCache.set(t,n)),n}getErosionDisplacement(r,e){const t=Ai,n=Math.floor(r/t),o=Math.floor(e/t),i=(r%t+t)%t,a=(e%t+t)%t;return this._getErosionRegion(n,o)[i+a*t]}_insertChunk(r){const e=$._cx(r.globalPosition.x),t=$._cy(r.globalPosition.y),n=$._cz(r.globalPosition.z);this._chunks.set($._key(e,t,n),r),r.isDeleted=!1}_gatherNeighbors(r,e,t){var o,i,a,l,c,d;const n=this._neighborScratch;return n.negX=(o=this._chunks.get($._key(r-1,e,t)))==null?void 0:o.blocks,n.posX=(i=this._chunks.get($._key(r+1,e,t)))==null?void 0:i.blocks,n.negY=(a=this._chunks.get($._key(r,e-1,t)))==null?void 0:a.blocks,n.posY=(l=this._chunks.get($._key(r,e+1,t)))==null?void 0:l.blocks,n.negZ=(c=this._chunks.get($._key(r,e,t-1)))==null?void 0:c.blocks,n.posZ=(d=this._chunks.get($._key(r,e,t+1)))==null?void 0:d.blocks,n}_remeshSingleNeighbor(r,e,t){var o;const n=this._chunks.get($._key(r,e,t));n&&((o=this.onChunkUpdated)==null||o.call(this,n,n.generateVertices(this._gatherNeighbors(r,e,t))))}_updateChunk(r,e,t,n){var f;const o=$._cx(r.globalPosition.x),i=$._cy(r.globalPosition.y),a=$._cz(r.globalPosition.z);if(this._dirtyChunks){if(this._dirtyChunks.add(r),e===void 0)return;const p=se.CHUNK_WIDTH,h=se.CHUNK_HEIGHT,_=se.CHUNK_DEPTH,m=(y,g,b)=>{const w=this._chunks.get($._key(y,g,b));w&&this._dirtyChunks.add(w)};e===0&&m(o-1,i,a),e===p-1&&m(o+1,i,a),t===0&&m(o,i-1,a),t===h-1&&m(o,i+1,a),n===0&&m(o,i,a-1),n===_-1&&m(o,i,a+1);return}if((f=this.onChunkUpdated)==null||f.call(this,r,r.generateVertices(this._gatherNeighbors(o,i,a))),e===void 0)return;const l=se.CHUNK_WIDTH,c=se.CHUNK_HEIGHT,d=se.CHUNK_DEPTH;e===0&&this._remeshSingleNeighbor(o-1,i,a),e===l-1&&this._remeshSingleNeighbor(o+1,i,a),t===0&&this._remeshSingleNeighbor(o,i-1,a),t===c-1&&this._remeshSingleNeighbor(o,i+1,a),n===0&&this._remeshSingleNeighbor(o,i,a-1),n===d-1&&this._remeshSingleNeighbor(o,i,a+1)}_createNearbyChunks(r){const e=$._cx(r.x),t=$._cy(r.y),n=$._cz(r.z),o=this.renderDistanceH,i=this.renderDistanceV,a=o*o,l=Math.max(1,this.chunksPerFrame);(!this._scratchTopD2||this._scratchTopD2.length!==l)&&(this._scratchTopD2=new Float64Array(l),this._scratchTopXYZ=new Int32Array(l*3));for(let p=0;p<l;p++)this._scratchTopD2[p]=1/0;let c=0,d=0,f=1/0;for(let p=-o;p<=o;p++){const h=p*p;for(let _=-o;_<=o;_++){const m=h+_*_;if(!(m>a))for(let y=-i;y<=i;y++){const g=e+p,b=t+y,w=n+_;if(this._generated.has($._key(g,b,w)))continue;c++;const B=m+y*y;if(!(B>=f)){this._scratchTopD2[d]=B,this._scratchTopXYZ[d*3]=g,this._scratchTopXYZ[d*3+1]=b,this._scratchTopXYZ[d*3+2]=w,f=-1/0;for(let x=0;x<l;x++){const U=this._scratchTopD2[x];U>f&&(f=U,d=x)}}}}}if(this.pendingChunks=c,!(this._chunks.size>=$.MAX_CHUNKS))for(let p=0;p<l;p++){let h=-1,_=1/0;for(let b=0;b<l;b++){const w=this._scratchTopD2[b];w<_&&(_=w,h=b)}if(h<0||_===1/0||this._chunks.size>=$.MAX_CHUNKS)break;const m=this._scratchTopXYZ[h*3],y=this._scratchTopXYZ[h*3+1],g=this._scratchTopXYZ[h*3+2];this._scratchTopD2[h]=1/0,this._createChunkAt(m,y,g)}}_removeDistantChunks(r){const e=$._cx(r.x),t=$._cy(r.y),n=$._cz(r.z),o=this.renderDistanceH+1,i=this.renderDistanceV+1,a=this._scratchToDelete;a.length=0;for(const l of this._chunks.values()){const c=$._cx(l.globalPosition.x),d=$._cy(l.globalPosition.y),f=$._cz(l.globalPosition.z),p=c-e,h=d-t,_=f-n;(p*p+_*_>o*o||Math.abs(h)>i)&&a.push(l)}for(let l=0;l<a.length;l++)this.deleteChunk(a[l]);a.length=0}_createChunkAt(r,e,t){var i;const n=$._key(r,e,t);this._generated.add(n);const o=new se(r*se.CHUNK_WIDTH,e*se.CHUNK_HEIGHT,t*se.CHUNK_DEPTH);o.generateBlocks(this.seed,(a,l)=>this.getErosionDisplacement(a,l)),o.aliveBlocks>0&&(this._insertChunk(o),(i=this.onChunkAdded)==null||i.call(this,o,o.generateVertices(this._gatherNeighbors(r,e,t))),this._remeshSingleNeighbor(r-1,e,t),this._remeshSingleNeighbor(r+1,e,t),this._remeshSingleNeighbor(r,e-1,t),this._remeshSingleNeighbor(r,e+1,t),this._remeshSingleNeighbor(r,e,t-1),this._remeshSingleNeighbor(r,e,t+1))}_updateWaterFlow(r){var B;const e=this.waterSimulationRadius,t=Math.floor(r.x-e),n=Math.floor(r.x+e),o=Math.floor(Math.max(0,r.y-e)),i=Math.floor(r.y+e),a=Math.floor(r.z-e),l=Math.floor(r.z+e),c=se.CHUNK_WIDTH,d=se.CHUNK_HEIGHT,f=se.CHUNK_DEPTH,p=Math.floor(t/c),h=Math.floor(n/c),_=Math.floor(o/d),m=Math.floor(i/d),y=Math.floor(a/f),g=Math.floor(l/f),b=this._scratchWaterBlocks;b.length=0;for(let x=p;x<=h;x++)for(let U=_;U<=m;U++)for(let R=y;R<=g;R++){const A=this._chunks.get($._key(x,U,R));if(!A||A.waterBlocks===0)continue;const I=A.globalPosition.x,k=A.globalPosition.y,v=A.globalPosition.z,M=Math.max(0,t-I),T=Math.min(c-1,n-I),G=Math.max(0,o-k),S=Math.min(d-1,i-k),N=Math.max(0,a-v),E=Math.min(f-1,l-v);for(let X=N;X<=E;X++)for(let V=G;V<=S;V++)for(let F=M;F<=T;F++)he(A.getBlock(F,V,X))&&b.push(I+F,k+V,v+X)}const w=this._scratchDirtyChunks;w.clear(),this._dirtyChunks=w;try{for(let x=0;x<b.length;x+=3)this._flowWater(b[x],b[x+1],b[x+2])}finally{this._dirtyChunks=null}for(const x of w){const U=$._cx(x.globalPosition.x),R=$._cy(x.globalPosition.y),A=$._cz(x.globalPosition.z);(B=this.onChunkUpdated)==null||B.call(this,x,x.generateVertices(this._gatherNeighbors(U,R,A)))}w.clear(),b.length=0}_flowWater(r,e,t){const n=this.getBlockType(r,e-1,t);if(n===L.NONE||Ce(n)){this.setBlockType(r,e-1,t,L.WATER),this.setBlockType(r,e,t,L.NONE);return}let o=!1;for(let i=1;i<=4;i++){const a=this.getBlockType(r,e-i,t);if(a!==L.NONE&&!he(a)&&!Ce(a)){o=!0;break}if(a===L.NONE||Ce(a))break}if(!o){const i=[{x:r+1,y:e,z:t},{x:r-1,y:e,z:t},{x:r,y:e,z:t+1},{x:r,y:e,z:t-1}];for(const a of i){const l=this.getBlockType(a.x,a.y,a.z);if(l===L.NONE||Ce(l)){this.setBlockType(a.x,a.y,a.z,L.WATER),this.setBlockType(r,e,t,L.NONE);return}}}if(o){const i=[{x:r+1,y:e,z:t},{x:r-1,y:e,z:t},{x:r,y:e,z:t+1},{x:r,y:e,z:t-1}];for(const a of i){const l=this.getBlockType(a.x,a.y,a.z);if(l===L.NONE||Ce(l)){this.setBlockType(a.x,a.y,a.z,L.WATER);return}}}}};s($,"MAX_CHUNKS",2048);let Yn=$;function hn(u,r,e,t,n,o,i,a){const l=[{n:[0,0,-1],t:[-1,0,0,1],v:[[-o,-i,-a],[o,-i,-a],[o,i,-a],[-o,i,-a]]},{n:[0,0,1],t:[1,0,0,1],v:[[o,-i,a],[-o,-i,a],[-o,i,a],[o,i,a]]},{n:[-1,0,0],t:[0,0,-1,1],v:[[-o,-i,a],[-o,-i,-a],[-o,i,-a],[-o,i,a]]},{n:[1,0,0],t:[0,0,1,1],v:[[o,-i,-a],[o,-i,a],[o,i,a],[o,i,-a]]},{n:[0,1,0],t:[1,0,0,1],v:[[-o,i,-a],[o,i,-a],[o,i,a],[-o,i,a]]},{n:[0,-1,0],t:[1,0,0,1],v:[[-o,-i,a],[o,-i,a],[o,-i,-a],[-o,-i,-a]]}],c=[[0,1],[1,1],[1,0],[0,0]];for(const d of l){const f=u.length/12;for(let p=0;p<4;p++){const[h,_,m]=d.v[p];u.push(e+h,t+_,n+m,d.n[0],d.n[1],d.n[2],c[p][0],c[p][1],d.t[0],d.t[1],d.t[2],d.t[3])}r.push(f,f+2,f+1,f,f+3,f+2)}}function Fo(u,r=1){const e=[],t=[],n=r;return hn(e,t,0,0,0,.19*n,.11*n,.225*n),hn(e,t,0,.07*n,.225*n,.075*n,.06*n,.06*n),Ae.fromData(u,new Float32Array(e),new Uint32Array(t))}function Ho(u,r=1){const e=[],t=[],n=r;return hn(e,t,0,0,0,.085*n,.085*n,.075*n),Ae.fromData(u,new Float32Array(e),new Uint32Array(t))}function Wo(u,r=1){const e=[],t=[],n=r;return hn(e,t,0,0,0,.065*n,.03*n,.055*n),Ae.fromData(u,new Float32Array(e),new Uint32Array(t))}function lt(u,r,e,t,n,o,i,a){const l=[{n:[0,0,-1],t:[-1,0,0,1],v:[[-o,-i,-a],[o,-i,-a],[o,i,-a],[-o,i,-a]]},{n:[0,0,1],t:[1,0,0,1],v:[[o,-i,a],[-o,-i,a],[-o,i,a],[o,i,a]]},{n:[-1,0,0],t:[0,0,-1,1],v:[[-o,-i,a],[-o,-i,-a],[-o,i,-a],[-o,i,a]]},{n:[1,0,0],t:[0,0,1,1],v:[[o,-i,-a],[o,-i,a],[o,i,a],[o,i,-a]]},{n:[0,1,0],t:[1,0,0,1],v:[[-o,i,-a],[o,i,-a],[o,i,a],[-o,i,a]]},{n:[0,-1,0],t:[1,0,0,1],v:[[-o,-i,a],[o,-i,a],[o,-i,-a],[-o,-i,-a]]}],c=[[0,1],[1,1],[1,0],[0,0]];for(const d of l){const f=u.length/12;for(let p=0;p<4;p++){const[h,_,m]=d.v[p];u.push(e+h,t+_,n+m,d.n[0],d.n[1],d.n[2],c[p][0],c[p][1],d.t[0],d.t[1],d.t[2],d.t[3])}r.push(f,f+2,f+1,f,f+3,f+2)}}function jo(u,r=1){const e=[],t=[],n=r;lt(e,t,0,0,0,.22*n,.15*n,.32*n),lt(e,t,0,.07*n,.32*n,.035*n,.035*n,.035*n);const o=.155*n,i=-.25*n,a=.255*n,l=.065*n,c=.1*n,d=.065*n;return lt(e,t,-o,i,-a,l,c,d),lt(e,t,o,i,-a,l,c,d),lt(e,t,-o,i,a,l,c,d),lt(e,t,o,i,a,l,c,d),Ae.fromData(u,new Float32Array(e),new Uint32Array(t))}function qo(u,r=1){const e=[],t=[],n=r;return lt(e,t,0,0,0,.18*n,.16*n,.16*n),Ae.fromData(u,new Float32Array(e),new Uint32Array(t))}function Yo(u,r=1){const e=[],t=[],n=r;return lt(e,t,0,0,0,.1*n,.08*n,.06*n),Ae.fromData(u,new Float32Array(e),new Uint32Array(t))}function Bt(u,r,e,t,n,o,i,a){const l=[{n:[0,0,-1],t:[-1,0,0,1],v:[[-o,-i,-a],[o,-i,-a],[o,i,-a],[-o,i,-a]]},{n:[0,0,1],t:[1,0,0,1],v:[[o,-i,a],[-o,-i,a],[-o,i,a],[o,i,a]]},{n:[-1,0,0],t:[0,0,-1,1],v:[[-o,-i,a],[-o,-i,-a],[-o,i,-a],[-o,i,a]]},{n:[1,0,0],t:[0,0,1,1],v:[[o,-i,-a],[o,-i,a],[o,i,a],[o,i,-a]]},{n:[0,1,0],t:[1,0,0,1],v:[[-o,i,-a],[o,i,-a],[o,i,a],[-o,i,a]]},{n:[0,-1,0],t:[1,0,0,1],v:[[-o,-i,a],[o,-i,a],[o,-i,-a],[-o,-i,-a]]}],c=[[0,1],[1,1],[1,0],[0,0]];for(const d of l){const f=u.length/12;for(let p=0;p<4;p++){const[h,_,m]=d.v[p];u.push(e+h,t+_,n+m,d.n[0],d.n[1],d.n[2],c[p][0],c[p][1],d.t[0],d.t[1],d.t[2],d.t[3])}r.push(f,f+2,f+1,f,f+3,f+2)}}function cl(u,r=1){const e=[],t=[],n=r;Bt(e,t,0,0,0,.25*n,.6*n,.2*n);const o=.16*n,i=-.8*n,a=.13*n,l=.06*n,c=.2*n,d=.06*n;return Bt(e,t,-o,i,-a,l,c,d),Bt(e,t,o,i,-a,l,c,d),Bt(e,t,-o,i,a,l,c,d),Bt(e,t,o,i,a,l,c,d),Ae.fromData(u,new Float32Array(e),new Uint32Array(t))}function ul(u,r=1){const e=[],t=[],n=r;return Bt(e,t,0,0,0,.22*n,.22*n,.22*n),Ae.fromData(u,new Float32Array(e),new Uint32Array(t))}const dl=new j(0,1,0),mn=class mn extends et{constructor(e){super();s(this,"_world");s(this,"_state","idle");s(this,"_timer",0);s(this,"_targetX",0);s(this,"_targetZ",0);s(this,"_hasTarget",!1);s(this,"_velY",0);s(this,"_yaw",0);s(this,"_headGO",null);s(this,"_headBaseY",0);s(this,"_bobPhase");this._world=e,this._timer=1+Math.random()*4,this._yaw=Math.random()*Math.PI*2,this._bobPhase=Math.random()*Math.PI*2}onAttach(){for(const e of this.gameObject.children)if(e.name==="Duck.Head"){this._headGO=e,this._headBaseY=e.position.y;break}}update(e){const t=this.gameObject,n=t.position.x,o=t.position.z,i=mn.playerPos,a=i.x-n,l=i.z-o,c=a*a+l*l;this._velY-=9.8*e,t.position.y+=this._velY*e;const d=this._world.getTopBlockY(Math.floor(n),Math.floor(o),Math.ceil(t.position.y)+4);if(d>0&&t.position.y<=d+.1){const f=this._world.getBlockType(Math.floor(n),Math.floor(d-1),Math.floor(o));L.WATER,t.position.y=d,this._velY=0}switch(this._state){case"idle":{this._timer-=e,c<36?this._enterFlee():this._timer<=0&&this._pickWanderTarget();break}case"wander":{if(this._timer-=e,c<36){this._enterFlee();break}if(!this._hasTarget||this._timer<=0){this._enterIdle();break}const f=this._targetX-n,p=this._targetZ-o,h=f*f+p*p;if(h<.25){this._enterIdle();break}const _=Math.sqrt(h),m=f/_,y=p/_;t.position.x+=m*1.5*e,t.position.z+=y*1.5*e,this._yaw=Math.atan2(-m,-y);break}case"flee":{if(c>196){this._enterIdle();break}const f=Math.sqrt(c),p=f>0?-a/f:0,h=f>0?-l/f:0;t.position.x+=p*4*e,t.position.z+=h*4*e,this._yaw=Math.atan2(-p,-h);break}}if(t.rotation=ve.fromAxisAngle(dl,this._yaw),this._headGO){this._bobPhase+=e*(this._state==="wander"?6:2);const f=this._state==="wander"?.018:.008;this._headGO.position.y=this._headBaseY+Math.sin(this._bobPhase)*f}}_enterIdle(){this._state="idle",this._hasTarget=!1,this._timer=2+Math.random()*5}_enterFlee(){this._state="flee",this._hasTarget=!1}_pickWanderTarget(){const e=this.gameObject,t=Math.random()*Math.PI*2,n=3+Math.random()*8;this._targetX=e.position.x+Math.cos(t)*n,this._targetZ=e.position.z+Math.sin(t)*n,this._hasTarget=!0,this._state="wander",this._timer=6+Math.random()*6}};s(mn,"playerPos",new j(0,0,0));let Tt=mn;const fl=`// Forward PBR shader with multi-light support
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
`,pl=`// GBuffer fill pass — writes albedo+roughness and normal+metallic.
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
`,hl=`// Skinned GBuffer fill pass — GPU vertex skinning with up to 4 bone influences.
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
`,Xo=48,xe=class xe extends la{constructor(e={}){super();s(this,"shaderId","pbr");s(this,"albedo");s(this,"roughness");s(this,"metallic");s(this,"uvOffset");s(this,"uvScale");s(this,"uvTile");s(this,"_albedoMap");s(this,"_normalMap");s(this,"_merMap");s(this,"_uniformBuffer",null);s(this,"_uniformDevice",null);s(this,"_bindGroup",null);s(this,"_bindGroupAlbedo");s(this,"_bindGroupNormal");s(this,"_bindGroupMer");s(this,"_dirty",!0);s(this,"_scratch",new Float32Array(Xo/4));this.albedo=e.albedo??[1,1,1,1],this.roughness=e.roughness??.5,this.metallic=e.metallic??0,this.uvOffset=e.uvOffset,this.uvScale=e.uvScale,this.uvTile=e.uvTile,this._albedoMap=e.albedoMap,this._normalMap=e.normalMap,this._merMap=e.merMap,this.transparent=e.transparent??!1}get albedoMap(){return this._albedoMap}set albedoMap(e){e!==this._albedoMap&&(this._albedoMap=e,this._bindGroup=null)}get normalMap(){return this._normalMap}set normalMap(e){e!==this._normalMap&&(this._normalMap=e,this._bindGroup=null)}get merMap(){return this._merMap}set merMap(e){e!==this._merMap&&(this._merMap=e,this._bindGroup=null)}markDirty(){this._dirty=!0}getShaderCode(e){switch(e){case Lt.Forward:return fl;case Lt.Geometry:return pl;case Lt.SkinnedGeometry:return hl}}getBindGroupLayout(e){let t=xe._layoutByDevice.get(e);return t||(t=e.createBindGroupLayout({label:"PbrMaterialBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),xe._layoutByDevice.set(e,t)),t}getBindGroup(e){var a,l,c,d;if(this._bindGroup&&this._bindGroupAlbedo===this._albedoMap&&this._bindGroupNormal===this._normalMap&&this._bindGroupMer===this._merMap)return this._bindGroup;(!this._uniformBuffer||this._uniformDevice!==e)&&((a=this._uniformBuffer)==null||a.destroy(),this._uniformBuffer=e.createBuffer({label:"PbrMaterialUniform",size:Xo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this._uniformDevice=e,this._dirty=!0);const t=xe._getSampler(e),n=((l=this._albedoMap)==null?void 0:l.view)??xe._getWhite(e),o=((c=this._normalMap)==null?void 0:c.view)??xe._getFlatNormal(e),i=((d=this._merMap)==null?void 0:d.view)??xe._getMerDefault(e);return this._bindGroup=e.createBindGroup({label:"PbrMaterialBG",layout:this.getBindGroupLayout(e),entries:[{binding:0,resource:{buffer:this._uniformBuffer}},{binding:1,resource:n},{binding:2,resource:o},{binding:3,resource:i},{binding:4,resource:t}]}),this._bindGroupAlbedo=this._albedoMap,this._bindGroupNormal=this._normalMap,this._bindGroupMer=this._merMap,this._bindGroup}update(e){var n,o,i,a,l,c;if(!this._dirty||!this._uniformBuffer)return;const t=this._scratch;t[0]=this.albedo[0],t[1]=this.albedo[1],t[2]=this.albedo[2],t[3]=this.albedo[3],t[4]=this.roughness,t[5]=this.metallic,t[6]=((n=this.uvOffset)==null?void 0:n[0])??0,t[7]=((o=this.uvOffset)==null?void 0:o[1])??0,t[8]=((i=this.uvScale)==null?void 0:i[0])??1,t[9]=((a=this.uvScale)==null?void 0:a[1])??1,t[10]=((l=this.uvTile)==null?void 0:l[0])??1,t[11]=((c=this.uvTile)==null?void 0:c[1])??1,e.writeBuffer(this._uniformBuffer,0,t.buffer),this._dirty=!1}destroy(){var e;(e=this._uniformBuffer)==null||e.destroy(),this._uniformBuffer=null,this._uniformDevice=null,this._bindGroup=null}static _getSampler(e){let t=xe._samplerByDevice.get(e);return t||(t=e.createSampler({label:"PbrMaterialSampler",magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"}),xe._samplerByDevice.set(e,t)),t}static _make1x1View(e,t,n,o,i,a){const l=e.createTexture({label:t,size:{width:1,height:1},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return e.queue.writeTexture({texture:l},new Uint8Array([n,o,i,a]),{bytesPerRow:4},{width:1,height:1}),l.createView()}static _getWhite(e){let t=xe._whiteByDevice.get(e);return t||(t=xe._make1x1View(e,"PbrFallbackWhite",255,255,255,255),xe._whiteByDevice.set(e,t)),t}static _getFlatNormal(e){let t=xe._flatNormalByDevice.get(e);return t||(t=xe._make1x1View(e,"PbrFallbackFlatNormal",128,128,255,255),xe._flatNormalByDevice.set(e,t)),t}static _getMerDefault(e){let t=xe._merDefaultByDevice.get(e);return t||(t=xe._make1x1View(e,"PbrFallbackMer",255,0,255,255),xe._merDefaultByDevice.set(e,t)),t}};s(xe,"_layoutByDevice",new WeakMap),s(xe,"_samplerByDevice",new WeakMap),s(xe,"_whiteByDevice",new WeakMap),s(xe,"_flatNormalByDevice",new WeakMap),s(xe,"_merDefaultByDevice",new WeakMap);let Te=xe;const _l=new j(0,1,0),$o=16,ml=25,gl=3.24,vl=36,bl=2.5,yl=4,Zo=[.37,.82,.22,1],wl=[.95,.45,.45,1],De=class De extends et{constructor(e,t){super();s(this,"_world");s(this,"_scene");s(this,"_state","idle");s(this,"_timer",0);s(this,"_targetX",0);s(this,"_targetZ",0);s(this,"_hasTarget",!1);s(this,"_velY",0);s(this,"_yaw",0);s(this,"_detonateElapsed",0);s(this,"_flashToggle",!1);s(this,"_flashAccum",0);this._world=e,this._scene=t,this._timer=2+Math.random()*4,this._yaw=Math.random()*Math.PI*2}onAttach(){}update(e){const t=this.gameObject,n=t.position.x,o=t.position.z,i=De.playerPos,a=i.x-n,l=i.z-o,c=a*a+l*l;this._velY-=9.8*e,t.position.y+=this._velY*e;const d=this._world.getTopBlockY(Math.floor(n),Math.floor(o),Math.ceil(t.position.y)+4);switch(d>0&&t.position.y<=d+.1&&(t.position.y=d,this._velY=0),this._state){case"idle":{this._timer-=e,c<$o?this._enterChase():this._timer<=0&&this._pickWanderTarget();break}case"wander":{if(this._timer-=e,c<$o){this._enterChase();break}if(!this._hasTarget||this._timer<=0){this._enterIdle();break}const f=this._targetX-n,p=this._targetZ-o,h=f*f+p*p;if(h<.25){this._enterIdle();break}const _=Math.sqrt(h);t.position.x+=f/_*1*e,t.position.z+=p/_*1*e,this._yaw=Math.atan2(-(f/_),-(p/_));break}case"chase":{if(c>ml){this._enterIdle();break}if(c<gl){this._enterDetonate();break}const f=Math.sqrt(c),p=a/f,h=l/f;t.position.x+=p*1.8*e,t.position.z+=h*1.8*e,this._yaw=Math.atan2(-p,-h);break}case"detonate":{if(c>vl){this._exitDetonate();break}this._detonateElapsed+=e,this._flashAccum+=e;const f=Math.max(.08,.5-this._detonateElapsed*.18);this._flashAccum>=f&&(this._flashAccum-=f,this._flashToggle=!this._flashToggle,this._updateFlash()),this._detonateElapsed>=bl&&this._explode();break}}t.rotation=ve.fromAxisAngle(_l,this._yaw)}_enterIdle(){this._state="idle",this._hasTarget=!1,this._timer=2+Math.random()*4}_enterChase(){this._state="chase",this._hasTarget=!1}_enterDetonate(){this._state="detonate",this._detonateElapsed=0,this._flashAccum=0,this._flashToggle=!0,this._updateFlash()}_exitDetonate(){this._state="idle",this._hasTarget=!1,this._timer=1+Math.random()*2,this._setColor(Zo)}_pickWanderTarget(){const e=this.gameObject,t=Math.random()*Math.PI*2,n=3+Math.random()*6;this._targetX=e.position.x+Math.cos(t)*n,this._targetZ=e.position.z+Math.sin(t)*n,this._hasTarget=!0,this._state="wander",this._timer=4+Math.random()*4}_updateFlash(){this._setColor(this._flashToggle?wl:Zo)}_setColor(e){const t=this.gameObject;for(const n of t.children){const o=n.getComponent(Ee);o&&o.material instanceof Te&&(o.material.albedo=e,o.material.markDirty())}}_explode(){var a,l;const e=this.gameObject,t=Math.floor(e.position.x),n=Math.floor(e.position.y),o=Math.floor(e.position.z);(a=De.onExplode)==null||a.call(De,e.position.x,e.position.y,e.position.z);const i=yl;for(let c=-i;c<=i;c++)for(let d=-i;d<=i;d++)for(let f=-i;f<=i;f++)c*c+d*d+f*f<=i*i&&((l=De.onBlockDestroyed)==null||l.call(De,t+c,n+d,o+f),this._world.mineBlock(t+c,n+d,o+f));this._scene.remove(e)}};s(De,"playerPos",new j(0,0,0)),s(De,"onExplode",null),s(De,"onBlockDestroyed",null);let Je=De;const Ko=""+new URL("hotbar-DkVq2FsR.png",import.meta.url).href,rn=[L.DIRT,L.IRON,L.STONE,L.SAND,L.TRUNK,L.SPRUCE_PLANKS,L.GLASS,L.TORCH,L.WATER];function xl(u,r){const e=rn.length;let t=0;const n=document.createElement("div");n.style.cssText=["position:fixed","bottom:12px","left:50%","transform:translateX(-50%)","display:flex","flex-direction:row","flex-wrap:nowrap","align-items:center","gap:0px","background:url("+Ko+") no-repeat","background-position:-48px 0px","background-size:414px 48px","width:364px","height:44px","padding:1px 2px","image-rendering:pixelated","box-sizing:border-box","align-items:center","justify-content:flex-start"].join(";");const o=[];for(let g=0;g<e;g++){const b=document.createElement("div");b.style.cssText=["width:40px","height:40px","display:flex","align-items:center","justify-content:center","position:relative","flex-shrink:0"].join(";");const w=document.createElement("canvas");w.width=w.height=32,w.style.cssText="width:32px;height:32px;image-rendering:pixelated;",b.appendChild(w);const B=document.createElement("span");B.textContent=String(g+1),B.style.cssText=["position:absolute","top:1px","left:3px","font-family:ui-monospace,monospace","font-size:9px","color:#ccc","text-shadow:0 0 2px #000","pointer-events:none"].join(";"),b.appendChild(B),b.addEventListener("click",()=>{t=g,l()}),n.appendChild(b),o.push(w)}document.body.appendChild(n);const i=document.createElement("div");i.style.cssText=["position:fixed","bottom:12px","width:44px","height:48px","background:url("+Ko+") no-repeat","background-position:0px 0px","background-size:414px 48px","pointer-events:none","image-rendering:pixelated","transition:left 60ms linear"].join(";"),document.body.appendChild(i);let a=null;function l(){const g=n.getBoundingClientRect();i.style.left=g.left-2+t*40+"px",a==null||a()}const c=new Image;c.src=u;function d(){if(!c.complete)return;const g=16;for(let b=0;b<e;b++){const w=Dt.find(x=>x.blockType===rn[b]),B=o[b].getContext("2d");B.clearRect(0,0,32,32),w&&(B.imageSmoothingEnabled=!1,B.drawImage(c,w.sideFace.x*g,w.sideFace.y*g,g,g,0,0,32,32))}}c.onload=d,window.addEventListener("keydown",g=>{const b=parseInt(g.key);b>=1&&b<=e&&(t=b-1,l())}),window.addEventListener("wheel",g=>{t=(t+(g.deltaY>0?1:e-1))%e,l()},{passive:!0});const f=document.createElement("button");f.textContent="💡(F)",f.title="Toggle Flashlight (F)";const p="#ff5",h="#a0a0a0";f.style.cssText=["position:fixed","bottom:12px","width:45px","height:32px","padding:0","background:#1a1a2e","border:1px solid "+h,"border-radius:4px","font-family:ui-monospace,monospace","font-size:13px","font-weight:bold","color:"+h,"cursor:pointer","z-index:10","line-height:32px","text-align:center","user-select:none"].join(";");let _=!1;function m(){f.style.color=_?p:h,f.style.borderColor=_?p:h}function y(){const g=n.getBoundingClientRect();f.style.left=g.right+8+"px"}return f.addEventListener("click",()=>{r==null||r()}),document.body.appendChild(f),window.addEventListener("resize",()=>{l(),y()}),requestAnimationFrame(()=>{l(),y()}),{getSelected:()=>rn[t],refresh:d,getSelectedSlot:()=>t,setSelectedSlot:g=>{t=g,l()},setOnSelectionChanged:g=>{a=g},slots:rn,element:n,flashlightButton:f,setFlashlightState:g=>{_=g,m()}}}const Bl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAACWCAYAAADwkd5lAAAD7ElEQVR4nO3dUU7bahSF0eOqgyIwDU/EkmcBUibicQRm5ftyE7UoacvOb+LEa0l9obD7P/VTKdKpAgAA+C7dX35//pZXALBWFzvxp4DM86wfAFvWdV3VhVZcCoh4AFBVlyNyLiCneLy/vy/7KgBWbbfbVdX5iPy4wXsAeAACAkBEQACICAgAEQEBIPLzK588DMPVf2Df9zVNkx07duxsfqflVqud/X7/z5/7pR/jHYah+r6/5m01jmM9PT3ZsWPHzuZ3pmmqj4+Pent7W83O54D4MV4AmhMQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAANDMfHQ6H3369vr7OLdixY8eOnXW95bjz+e/9o6qaP8fiywelrrW261t27Nixc6udlltLXST800EpFwnt2LFj50Y7LhICsEkCAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgGZOF6hcJLRjx46d5XbW9JbjjouEduzYsXMHOy23XCS0Y8eOnQ3tuEgIwCYJCAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQAJo5XaBykdCOHTt2lttZ01uOOy4S2rFjx84d7LTccpHQjh07dja04yIhAJskIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAGjmdIHKRUI7duzYWW5nTW857rhIaMeOHTt3sNNyy0VCO3bs2NnQjouEAGySgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBAaCZ0wUqFwnt2LFjZ7mdNb3luOMioR07duzcwU7LLRcJ7dixY2dDOy4SArBJAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBIBmTheoXCS0Y8eOneV21vSW485iFwkB2BYHpQBoTkAAiAgIAJGft34AyxmG4eqNvu9rmiY7duKdl5eXq3dYJwF5cH3fX/X14zjWNE127MQ7fhjncfkWFgARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkDEPZAH1vd9jeNox85Nd3hc3ZmPzfM8V1U5BAOwcbvdrqqquq6r+tQM38ICICIgAEQEBIDIuf9E77qumw+HQ+33+29/EADr8vz8XHXm/8wv/Quk+/8LANiwS/G4+MFfzM1fA8A9+VsnAAAAvsF/uG+b8sfhThMAAAAASUVORK5CYII=";function Sl(u,r,e,t,n,o){const y=[];for(let M=1;M<L.MAX;M++)M!==L.WATER&&y.push(M);const g=document.createElement("div");g.style.cssText="position:relative;display:inline-block;align-self:center;";const b=document.createElement("img");b.src=Bl,b.draggable=!1,b.style.cssText=[`width:${400*2}px`,`height:${150*2}px`,"display:block","image-rendering:pixelated","user-select:none"].join(";"),g.appendChild(b);const w=new Image;w.src=r;function B(M,T){const G=M.getContext("2d");if(G.clearRect(0,0,M.width,M.height),!T)return;const S=Dt.find(N=>N.blockType===T);S&&(G.imageSmoothingEnabled=!1,G.drawImage(w,S.sideFace.x*16,S.sideFace.y*16,16,16,0,0,M.width,M.height))}let x=null,U=null;const R=[];function A(){R.forEach((M,T)=>{M.style.outline=T===n()?"2px solid #ff0":""})}function I(M,T,G){const S=document.createElement("div");S.style.cssText=["position:absolute",`left:${M}px`,`top:${T}px`,"width:32px","height:32px","box-sizing:border-box","cursor:grab"].join(";"),S.draggable=G;const N=document.createElement("canvas");return N.width=N.height=32,N.style.cssText="width:32px;height:32px;image-rendering:pixelated;pointer-events:none;display:block;",S.appendChild(N),g.appendChild(S),[S,N]}for(let M=0;M<6;M++)for(let T=0;T<21;T++){const G=y[M*21+T]??null;if(!G)continue;const[S,N]=I(24+T*36,24+M*36,!0);S.title=String(va[G]),w.complete?B(N,G):w.addEventListener("load",()=>B(N,G),{once:!1}),S.addEventListener("click",()=>{e[n()]=G,v(),t()}),S.addEventListener("dragstart",E=>{x=G,U=null,E.dataTransfer.effectAllowed="copy",S.style.opacity="0.4"}),S.addEventListener("dragend",()=>{S.style.opacity="1"})}const k=[];for(let M=0;M<9;M++){const[T,G]=I(240+M*36,248,!0);k.push(G),R.push(T),T.title=`Slot ${M+1}`,T.addEventListener("click",()=>{o(M),A()}),T.addEventListener("dragstart",S=>{x=e[M],U=M,S.dataTransfer.effectAllowed="move",T.style.opacity="0.4"}),T.addEventListener("dragend",()=>{T.style.opacity="1"}),T.addEventListener("dragover",S=>{S.preventDefault(),S.dataTransfer.dropEffect=U!==null?"move":"copy",T.style.boxShadow="inset 0 0 0 2px #7ff"}),T.addEventListener("dragleave",()=>{T.style.boxShadow=""}),T.addEventListener("drop",S=>{S.preventDefault(),T.style.boxShadow="",x&&(U!==null&&U!==M?[e[M],e[U]]=[e[U],e[M]]:U===null&&(e[M]=x),v(),t(),x=null,U=null)})}function v(){for(let M=0;M<9;M++)B(k[M],e[M])}return w.addEventListener("load",v),w.complete&&v(),u.appendChild(g),{syncHotbar:v,refreshSlotHighlight:A}}function Pl(u,r,e){const t=document.createElement("div");t.style.cssText=["display:flex","flex-wrap:wrap","gap:8px","justify-content:center","font-family:ui-monospace,monospace","font-size:13px","user-select:none"].join(";");const n="background:#1a2e1a;color:#5f5;border-color:#5f5",o="background:#2e1a1a;color:#f55;border-color:#f55";for(const i of Object.keys(u)){const a=document.createElement("button"),l=i.toUpperCase().padEnd(5),c=()=>{const d=u[i];a.textContent=`${l} ${d?"ON ":"OFF"}`,a.setAttribute("style",["padding:5px 10px","border-width:1px","border-style:solid","border-radius:4px","cursor:pointer","letter-spacing:0.04em",d?n:o].join(";"))};a.addEventListener("click",()=>{u[i]=!u[i],c(),r(i)}),c(),t.appendChild(a)}return e.appendChild(t),t}function Tl(u,r){const e=document.createElement("div");e.style.cssText=["position:fixed","inset:0","z-index:100","background:rgba(0,0,0,0.78)","display:none","align-items:center","justify-content:center","font-family:ui-monospace,monospace"].join(";"),document.body.appendChild(e);const t=document.createElement("div");t.style.cssText=["display:flex","flex-direction:column","align-items:center","padding:clamp(20px,5vh,48px) clamp(16px,5vw,56px)","background:rgba(255,255,255,0.74)","border:1px solid rgba(255,255,255,0.12)","border-radius:12px","width:min(860px,calc(100vw - 24px))","box-sizing:border-box","max-height:min(700px,calc(100vh - 24px))","overflow-y:auto","padding:0px;"].join(";"),e.appendChild(t);const n=document.createElement("h1");n.textContent="CRAFTY",n.style.cssText=["margin:0","font-size:clamp(28px,7vw,52px)","font-weight:900","color:#fff","letter-spacing:0.12em","text-shadow:0 0 48px rgba(100,200,255,0.45)","font-family:ui-monospace,monospace"].join(";"),t.appendChild(n);const o=document.createElement("button");o.textContent="Back to Game (ESC)",o.style.cssText=["padding:10px 40px","font-size:15px","font-family:ui-monospace,monospace","background:#1a3a1a","color:#5f5","border:1px solid #5f5","border-radius:6px","cursor:pointer","letter-spacing:0.06em","transition:background 0.15s","margin-top:12px"].join(";"),o.addEventListener("mouseenter",()=>{o.style.background="#243e24"}),o.addEventListener("mouseleave",()=>{o.style.background="#1a3a1a"});const i=()=>{c();try{u.requestPointerLock()}catch{}};o.addEventListener("click",i),o.addEventListener("touchend",f=>{f.preventDefault(),i()},{passive:!1}),t.appendChild(o);let a=0;function l(){a=performance.now(),e.style.display="flex",r.style.display="none"}function c(){e.style.display="none",r.style.display=""}function d(){return e.style.display!=="none"}return document.addEventListener("pointerlockchange",()=>{document.pointerLockElement===u?c():l()}),document.addEventListener("keydown",f=>{if(f.code==="Escape"&&d()){if(performance.now()-a<200)return;c(),u.requestPointerLock()}}),{overlay:e,card:t,open:l,close:c,isOpen:d}}function Gl(){const u=document.createElement("div");u.style.cssText=["position:fixed","top:50%","left:50%","width:16px","height:16px","transform:translate(-50%,-50%)","pointer-events:none"].join(";"),u.innerHTML=['<div style="position:absolute;top:50%;left:0;width:100%;height:3px;background:#fff;opacity:0.8;transform:translateY(-50%)"></div>','<div style="position:absolute;left:50%;top:0;width:3px;height:100%;background:#fff;opacity:0.8;transform:translateX(-50%)"></div>','<div style="position:absolute;top:50%;left:50%;width:7px;height:3px;background:#fff;opacity:0.9;transform:translate(-50%,-50%);border-radius:50%"></div>'].join(""),document.body.appendChild(u);const r=()=>{const a=document.createElement("div");return a.style.display="none",document.body.appendChild(a),a},e=r();e.style.cssText=["position:fixed","top:12px","right:12px","font-family:ui-monospace,monospace","font-size:13px","color:#ff0","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none"].join(";");const t=r();t.style.cssText=["position:fixed","top:44px","right:12px","font-family:ui-monospace,monospace","font-size:11px","color:#aaf","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none","white-space:pre"].join(";");const n=r();n.style.cssText=["position:fixed","bottom:12px","right:12px","font-family:ui-monospace,monospace","font-size:13px","color:#ff0","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none"].join(";");const o=r();o.style.cssText=["position:fixed","bottom:44px","right:12px","font-family:ui-monospace,monospace","font-size:11px","color:#ccf","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none"].join(";");const i=r();return i.style.cssText=["position:fixed","top:76px","right:12px","font-family:ui-monospace,monospace","font-size:11px","color:#afc","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none","white-space:pre"].join(";"),{fps:e,stats:t,biome:n,pos:o,weather:i,reticle:u}}function El(u,r,e,t,n,o,i,a){const l=new _e("Camera");l.position.set(64,25,64);const c=l.addComponent(new wi(70,.1,1e3,t/n));r.add(l);const d=new _e("Flashlight"),f=d.addComponent(new Bi);f.color=new j(1,.95,.9),f.intensity=0,f.range=80,f.innerAngle=12,f.outerAngle=25,f.castShadow=!1,f.projectionTexture=o,l.addChild(d),r.add(d);let p=!1;const h=new Aa(e,Math.PI,.1);h.attach(u);const _=new _a(Math.PI,.1,15);let m=!0;const y=document.createElement("div");y.textContent="PLAYER",y.style.cssText=["position:fixed","top:12px","left:12px","font-family:ui-monospace,monospace","font-size:13px","font-weight:bold","color:#4f4","background:rgba(0,0,0,0.45)","padding:4px 8px","border-radius:4px","pointer-events:none","letter-spacing:0.05em"].join(";"),document.body.appendChild(y);function g(x){i&&(i.style.display=x?"":"none"),a&&(a.style.display=x?"flex":"none")}function b(){m=!m,m?(h.yaw=_.yaw,h.pitch=_.pitch,_.detach(),h.attach(u)):(_.yaw=h.yaw,_.pitch=h.pitch,h.detach(),_.attach(u)),y.textContent=m?"PLAYER":"FREE",y.style.color=m?"#4f4":"#4cf",g(m)}function w(x){p=x,f.intensity=p?25:0}let B=-1/0;return document.addEventListener("keyup",x=>{x.code==="Space"&&(B=performance.now())}),document.addEventListener("keydown",x=>{if(x.code==="KeyC"&&!x.repeat){b();return}if(!(x.code!=="Space"||x.repeat)&&performance.now()-B<400&&document.pointerLockElement===u){const U=m;b(),B=-1/0,U&&_.pressKey("Space")}}),window.addEventListener("keydown",x=>{x.code==="KeyF"&&!x.repeat&&(w(!p),console.log(`Flashlight ${p?"ON":"OFF"} (intensity: ${f.intensity})`)),x.ctrlKey&&x.key==="w"&&(x.preventDefault(),window.location.reload())}),{cameraGO:l,camera:c,player:h,freeCamera:_,isPlayerMode:()=>m,flashlight:f,isFlashlightEnabled:()=>p,modeEl:y,toggleController:b,setFlashlightEnabled:w,setPlayerUIVisible:g}}const It=new Map,Ot=new Map,gn=(u,r,e)=>`${u},${r},${e}`;function Ui(u,r,e,t){const n=gn(u,r,e);if(It.has(n))return;const o=new _e("TorchLight");o.position.set(u+.5,r+.9,e+.5);const i=o.addComponent(new Kn);i.color=new j(1,.52,.18),i.intensity=4,i.radius=6,i.castShadow=!1,t.add(o);const a=(u*127.1+r*311.7+e*74.3)%(Math.PI*2);It.set(n,{go:o,pl:i,phase:a})}function Xn(u,r,e,t){const n=gn(u,r,e),o=It.get(n);o&&(t.remove(o.go),It.delete(n))}function Ml(u){for(const{pl:r,phase:e}of It.values()){const t=1+.08*Math.sin(u*11.7+e)+.05*Math.sin(u*7.3+e*1.7)+.03*Math.sin(u*23.1+e*.5);r.intensity=4*t}}function ki(u,r,e,t){const n=gn(u,r,e);if(Ot.has(n))return;const o=new _e("MagmaLight");o.position.set(u+.5,r+.5,e+.5);const i=o.addComponent(new Kn);i.color=new j(1,.28,0),i.intensity=6,i.radius=10,i.castShadow=!1,t.add(o);const a=(u*127.1+r*311.7+e*74.3)%(Math.PI*2);Ot.set(n,{go:o,pl:i,phase:a})}function Ci(u,r,e,t){const n=gn(u,r,e),o=Ot.get(n);o&&(t.remove(o.go),Ot.delete(n))}function Al(u){for(const{pl:r,phase:e}of Ot.values()){const t=1+.18*Math.sin(u*1.1+e)+.1*Math.sin(u*2.9+e*.7)+.06*Math.sin(u*.5+e*1.4);r.intensity=6*t}}const Ul=700,kl=300;function Li(u){return ga[u]*1500}function Cl(){return{targetBlock:null,targetHit:null,mouseHeld:-1,mouseHoldTime:0,lastBlockAction:0,breakProgress:0,breakingBlock:null,breakTime:0,crackStage:-1}}function $n(u,r,e){var a,l,c;const t=u.breakingBlock.x,n=u.breakingBlock.y,o=u.breakingBlock.z,i=r.getBlockType(t,n,o);if(i===L.TORCH&&Xn(t,n,o,e),i===L.MAGMA&&Ci(t,n,o,e),r.mineBlock(t,n,o)&&((a=u.onLocalEdit)==null||a.call(u,{kind:"break",x:t,y:n,z:o}),(l=u.onBlockBroken)==null||l.call(u,t,n,o,i),!Ce(i))){const d=r.getBlockType(t,n+1,o);Ce(d)&&(d===L.TORCH&&Xn(t,n+1,o,e),r.mineBlock(t,n+1,o)&&((c=u.onLocalEdit)==null||c.call(u,{kind:"break",x:t,y:n+1,z:o})))}u.breakProgress=0,u.breakingBlock=null,u.crackStage=-1}function yr(u,r,e,t,n,o){var i;if(u===0&&e.targetBlock){const a=e.targetBlock.x,l=e.targetBlock.y,c=e.targetBlock.z,d=t.getBlockType(a,l,c);e.breakingBlock&&(e.breakingBlock.x!==a||e.breakingBlock.y!==l||e.breakingBlock.z!==c)&&(e.breakProgress=0,e.crackStage=-1,e.breakingBlock=null),e.breakingBlock=new j(a,l,c),e.breakTime=Li(d),e.breakTime===0&&$n(e,t,o),e.lastBlockAction=r}else if(u===2&&e.targetHit){const a=e.targetHit,l=n(),c=a.position.x+a.face.x,d=a.position.y+a.face.y,f=a.position.z+a.face.z;t.addBlock(a.position.x,a.position.y,a.position.z,a.face.x,a.face.y,a.face.z,l)&&(l===L.TORCH&&Ui(c,d,f,o),l===L.MAGMA&&ki(c,d,f,o),(i=e.onLocalEdit)==null||i.call(e,{kind:"place",x:a.position.x,y:a.position.y,z:a.position.z,fx:a.face.x,fy:a.face.y,fz:a.face.z,blockType:l})),e.lastBlockAction=r}}function Jo(u,r,e){if(u.kind==="break"){const i=r.getBlockType(u.x,u.y,u.z);i===L.TORCH&&Xn(u.x,u.y,u.z,e),i===L.MAGMA&&Ci(u.x,u.y,u.z,e),r.mineBlock(u.x,u.y,u.z);return}const t=u.x+u.fx,n=u.y+u.fy,o=u.z+u.fz;r.setBlockType(t,n,o,u.blockType),u.blockType===L.TORCH&&Ui(t,n,o,e),u.blockType===L.MAGMA&&ki(t,n,o,e)}function Ll(u,r,e,t,n){u.addEventListener("contextmenu",o=>o.preventDefault()),u.addEventListener("mousedown",o=>{document.pointerLockElement===u&&(o.button!==0&&o.button!==2||(r.mouseHeld=o.button,r.mouseHoldTime=o.timeStamp,o.button===2&&yr(o.button,o.timeStamp,r,e,t,n)))}),u.addEventListener("mouseup",o=>{o.button===r.mouseHeld&&(r.mouseHeld=-1,r.breakProgress=0,r.breakingBlock=null,r.crackStage=-1)})}function Rl(u,r,e,t,n,o){var i;if(e.mouseHeld>=0)if(e.mouseHeld===0){const a=e.targetBlock;if(a&&e.breakingBlock)if(a.x===e.breakingBlock.x&&a.y===e.breakingBlock.y&&a.z===e.breakingBlock.z){e.breakProgress+=u*1e3;const l=Math.min(Math.floor(e.breakProgress/e.breakTime*10),9);if(l>e.crackStage){const c=t.getBlockType(a.x,a.y,a.z);(i=e.onBlockChip)==null||i.call(e,a.x,a.y,a.z,c)}e.crackStage=l,e.breakProgress>=e.breakTime&&$n(e,t,o)}else e.breakProgress=0,e.breakingBlock=null,e.crackStage=-1;else if(a&&!e.breakingBlock){const l=t.getBlockType(a.x,a.y,a.z);e.breakingBlock=new j(a.x,a.y,a.z),e.breakTime=Li(l),e.breakProgress=0,e.crackStage=0,e.breakTime===0&&$n(e,t,o)}}else e.mouseHeld===2&&r-e.mouseHoldTime>=Ul&&r-e.lastBlockAction>=kl&&yr(e.mouseHeld,r,e,t,n,o);else e.breakingBlock&&(e.breakProgress=0,e.breakingBlock=null,e.crackStage=-1)}const Ri=new Map,Nl=[.6,.6,.6];async function Il(u){const r=await Ol(u),e=document.createElement("canvas");e.width=r.width,e.height=r.height;const t=e.getContext("2d",{willReadFrequently:!0});if(!t)return;t.drawImage(r,0,0);const n=Si;for(const o of Dt){if(!o||o.blockType===L.NONE)continue;const i=o.topFace,a=i.x*n,l=i.y*n;if(a+n>r.width||l+n>r.height)continue;const c=t.getImageData(a,l,n,n).data;let d=0,f=0,p=0,h=0;for(let _=0;_<c.length;_+=4)c[_+3]<32||(d+=c[_],f+=c[_+1],p+=c[_+2],h++);h!==0&&Ri.set(o.blockType,[Vn(d/h/255),Vn(f/h/255),Vn(p/h/255)])}}function Qo(u){return Ri.get(u)??Nl}function Ol(u){return new Promise((r,e)=>{const t=new Image;t.onload=()=>r(t),t.onerror=()=>e(new Error(`Failed to load atlas image: ${u}`)),t.src=u})}function Vn(u){return u<=.04045?u/12.92:Math.pow((u+.055)/1.055,2.4)}const at=60,Dl=.1,on=28,zn=64,ei=44,dt=70,Vl=.005;function zl(u,r,e){const t={controls:null,cancel(){}},n=()=>{t.controls||(t.controls=new Hl(u,r),e==null||e(t.controls))};return window.addEventListener("touchstart",n,{once:!0,passive:!0,capture:!0}),t.cancel=()=>window.removeEventListener("touchstart",n,!0),t}function Fl(){if(typeof location<"u"&&/[?&]touch(=1|=true|=on|$|&)/.test(location.search))return!0;if(typeof navigator<"u"){const u=navigator;if((u.maxTouchPoints??0)>0||(u.msMaxTouchPoints??0)>0)return!0}if(typeof window<"u"&&"ontouchstart"in window)return!0;if(typeof window<"u"&&typeof window.matchMedia=="function")try{if(window.matchMedia("(any-pointer: coarse)").matches||window.matchMedia("(pointer: coarse)").matches)return!0}catch{}return!1}class Hl{constructor(r,e){s(this,"_root");s(this,"_joystick");s(this,"_stick");s(this,"_btnJump");s(this,"_btnSneak");s(this,"_btnRun");s(this,"_btnMine");s(this,"_btnPlace");s(this,"_btnFlashlight");s(this,"_btnMenu");s(this,"_joyTouchId",null);s(this,"_joyOriginX",0);s(this,"_joyOriginY",0);s(this,"_lookTouchId",null);s(this,"_lookLastX",0);s(this,"_lookLastY",0);s(this,"_lookLastTapAt",-1/0);s(this,"_sprinting",!1);s(this,"_flashlightOn",!1);s(this,"_lookSensitivity");s(this,"_onGlobalTouchEnd");s(this,"_onVisibilityChange");s(this,"_onWindowBlur");s(this,"_onJoyStart",r=>{if(this._reconcileTouches(r.touches),this._joyTouchId!==null)return;r.preventDefault();const e=r.changedTouches[0];this._joyTouchId=e.identifier;const t=this._joystick.getBoundingClientRect();this._joyOriginX=t.left+t.width*.5,this._joyOriginY=t.top+t.height*.5,this._updateJoystick(e.clientX,e.clientY)});s(this,"_onJoyMove",r=>{if(this._joyTouchId!==null)for(let e=0;e<r.changedTouches.length;e++){const t=r.changedTouches[e];if(t.identifier===this._joyTouchId){r.preventDefault(),this._updateJoystick(t.clientX,t.clientY);return}}});s(this,"_onJoyEnd",r=>{if(this._joyTouchId!==null){for(let e=0;e<r.changedTouches.length;e++)if(r.changedTouches[e].identifier===this._joyTouchId){r.preventDefault(),this._joyTouchId=null,this._setMovement(0,0),this._stick.style.transform="translate(0px, 0px)";return}}});s(this,"_onLookStart",r=>{if(this._reconcileTouches(r.touches),this._lookTouchId!==null)return;const e=r.changedTouches[0],t=window.innerWidth*.5;if(e.clientX<t)return;r.preventDefault(),this._lookTouchId=e.identifier,this._lookLastX=e.clientX,this._lookLastY=e.clientY;const n=performance.now();n-this._lookLastTapAt<350&&this._opts.onLookDoubleTap?(this._opts.onLookDoubleTap(),this._lookLastTapAt=-1/0):this._lookLastTapAt=n});s(this,"_onLookMove",r=>{if(this._lookTouchId!==null)for(let e=0;e<r.changedTouches.length;e++){const t=r.changedTouches[e];if(t.identifier!==this._lookTouchId)continue;r.preventDefault();const n=t.clientX-this._lookLastX,o=t.clientY-this._lookLastY;this._lookLastX=t.clientX,this._lookLastY=t.clientY,this._applyLook(n,o);return}});s(this,"_onLookEnd",r=>{if(this._lookTouchId!==null){for(let e=0;e<r.changedTouches.length;e++)if(r.changedTouches[e].identifier===this._lookTouchId){r.preventDefault(),this._lookTouchId=null;return}}});this._canvas=r,this._opts=e,this._lookSensitivity=e.lookSensitivity??Vl,this._onGlobalTouchEnd=n=>this._reconcileTouches(n.touches),this._onVisibilityChange=()=>{document.visibilityState!=="visible"&&this._releaseAllTouches()},this._onWindowBlur=()=>this._releaseAllTouches(),this._root=document.createElement("div"),this._root.style.cssText=["position:fixed","inset:0","pointer-events:none","user-select:none","-webkit-user-select:none","touch-action:none","z-index:50"].join(";"),this._joystick=document.createElement("div"),this._joystick.style.cssText=["position:absolute","left:24px",`bottom:${dt}px`,`width:${at*2}px`,`height:${at*2}px`,"border-radius:50%","background:rgba(255,255,255,0.10)","border:2px solid rgba(255,255,255,0.30)","pointer-events:auto"].join(";"),this._stick=document.createElement("div"),this._stick.style.cssText=["position:absolute",`left:${at-on}px`,`top:${at-on}px`,`width:${on*2}px`,`height:${on*2}px`,"border-radius:50%","background:rgba(255,255,255,0.30)","border:2px solid rgba(255,255,255,0.50)","pointer-events:none","transition:transform 80ms ease-out"].join(";"),this._joystick.appendChild(this._stick),this._root.appendChild(this._joystick);const t=zn+12;this._btnSneak=this._makeButton("⤓",`right:${24+2*t}px`,`bottom:${dt}px`,"rgba(255,255,255,0.10)"),this._btnRun=this._makeButton(">>",`right:${24+t}px`,`bottom:${dt}px`,"rgba(100,200,100,0.25)"),this._btnJump=this._makeButton("⤒","right:24px",`bottom:${dt}px`,"rgba(255,255,255,0.18)"),this._btnMine=this._makeButton("⛏",`right:${24+2*t}px`,`bottom:${dt+t}px`,"rgba(220,80,80,0.45)"),this._btnPlace=this._makeButton("▣",`right:${24+t}px`,`bottom:${dt+t}px`,"rgba(80,180,90,0.45)"),this._btnFlashlight=this._makeButton("💡","right:24px",`bottom:${dt+t}px`,"rgba(200,200,80,0.25)"),this._btnMenu=this._makeButton("☰","right:16px","top:16px","rgba(0,0,0,0.45)"),this._btnMenu.style.width=`${ei}px`,this._btnMenu.style.height=`${ei}px`,this._btnMenu.style.fontSize="24px",document.body.appendChild(this._root),this._attachEvents()}destroy(){this._detachEvents(),this._root.remove()}_makeButton(r,e,t,n){const o=document.createElement("div");return o.textContent=r,o.style.cssText=["position:absolute",e,t,`width:${zn}px`,`height:${zn}px`,"border-radius:50%",`background:${n}`,"border:2px solid rgba(255,255,255,0.45)","color:#fff","font-size:32px","font-family:sans-serif","display:flex","align-items:center","justify-content:center","pointer-events:auto","user-select:none"].join(";"),this._root.appendChild(o),o}_attachEvents(){this._joystick.addEventListener("touchstart",this._onJoyStart,{passive:!1}),this._joystick.addEventListener("touchmove",this._onJoyMove,{passive:!1}),this._joystick.addEventListener("touchend",this._onJoyEnd,{passive:!1}),this._joystick.addEventListener("touchcancel",this._onJoyEnd,{passive:!1}),this._canvas.addEventListener("touchstart",this._onLookStart,{passive:!1}),this._canvas.addEventListener("touchmove",this._onLookMove,{passive:!1}),this._canvas.addEventListener("touchend",this._onLookEnd,{passive:!1}),this._canvas.addEventListener("touchcancel",this._onLookEnd,{passive:!1}),this._bindHoldButton(this._btnJump,()=>this._setJump(!0),()=>this._setJump(!1)),this._bindHoldButton(this._btnSneak,()=>this._setSneak(!0),()=>this._setSneak(!1)),this._bindHoldButton(this._btnMine,()=>this._actionDown(0),()=>this._actionUp(0)),this._bindHoldButton(this._btnPlace,()=>this._actionDown(2),()=>this._actionUp(2)),this._bindToggleButton(this._btnRun,()=>this._toggleSprint()),this._bindToggleButton(this._btnFlashlight,()=>this._toggleFlashlight());const r=e=>{var t,n;e.preventDefault(),this._btnMenu.style.filter="",(n=(t=this._opts).onMenu)==null||n.call(t)};this._btnMenu.addEventListener("touchstart",e=>{e.preventDefault(),this._btnMenu.style.filter="brightness(1.5)"},{passive:!1}),this._btnMenu.addEventListener("touchend",r,{passive:!1}),this._btnMenu.addEventListener("touchcancel",()=>{this._btnMenu.style.filter=""},{passive:!1}),document.addEventListener("touchend",this._onGlobalTouchEnd,{passive:!0,capture:!0}),document.addEventListener("touchcancel",this._onGlobalTouchEnd,{passive:!0,capture:!0}),document.addEventListener("visibilitychange",this._onVisibilityChange),window.addEventListener("blur",this._onWindowBlur)}_detachEvents(){this._joystick.removeEventListener("touchstart",this._onJoyStart),this._joystick.removeEventListener("touchmove",this._onJoyMove),this._joystick.removeEventListener("touchend",this._onJoyEnd),this._joystick.removeEventListener("touchcancel",this._onJoyEnd),this._canvas.removeEventListener("touchstart",this._onLookStart),this._canvas.removeEventListener("touchmove",this._onLookMove),this._canvas.removeEventListener("touchend",this._onLookEnd),this._canvas.removeEventListener("touchcancel",this._onLookEnd),document.removeEventListener("touchend",this._onGlobalTouchEnd,!0),document.removeEventListener("touchcancel",this._onGlobalTouchEnd,!0),document.removeEventListener("visibilitychange",this._onVisibilityChange),window.removeEventListener("blur",this._onWindowBlur)}_reconcileTouches(r){const e=t=>{for(let n=0;n<r.length;n++)if(r[n].identifier===t)return!0;return!1};this._joyTouchId!==null&&!e(this._joyTouchId)&&(this._joyTouchId=null,this._setMovement(0,0),this._stick.style.transform="translate(0px, 0px)"),this._lookTouchId!==null&&!e(this._lookTouchId)&&(this._lookTouchId=null)}_releaseAllTouches(){this._joyTouchId!==null&&(this._joyTouchId=null,this._stick.style.transform="translate(0px, 0px)"),this._lookTouchId=null,this._setMovement(0,0),this._setJump(!1),this._setSneak(!1),this._opts.blockInteraction&&(this._opts.blockInteraction.mouseHeld=-1),this._btnJump.style.filter="",this._btnSneak.style.filter="",this._btnMine.style.filter="",this._btnPlace.style.filter=""}_bindHoldButton(r,e,t){const n=i=>{i.preventDefault(),r.style.filter="brightness(1.5)",e()},o=i=>{i.preventDefault(),r.style.filter="",t()};r.addEventListener("touchstart",n,{passive:!1}),r.addEventListener("touchend",o,{passive:!1}),r.addEventListener("touchcancel",o,{passive:!1})}_bindToggleButton(r,e){const t=n=>{n.preventDefault(),e()};r.addEventListener("touchstart",t,{passive:!1}),r.addEventListener("touchend",n=>n.preventDefault(),{passive:!1})}_toggleSprint(){this._sprinting=!this._sprinting,this._btnRun.style.background=this._sprinting?"rgba(100,200,100,0.55)":"rgba(100,200,100,0.25)",this._btnRun.style.borderColor=this._sprinting?"rgba(100,255,100,0.8)":"rgba(255,255,255,0.45)",this._opts.player&&(this._opts.player.inputSprint=this._sprinting)}_toggleFlashlight(){var r,e;this._flashlightOn=!this._flashlightOn,this._btnFlashlight.style.background=this._flashlightOn?"rgba(200,200,80,0.55)":"rgba(200,200,80,0.25)",this._btnFlashlight.style.borderColor=this._flashlightOn?"rgba(255,255,180,0.8)":"rgba(255,255,255,0.45)",(e=(r=this._opts).onFlashlightToggle)==null||e.call(r)}_updateJoystick(r,e){let t=r-this._joyOriginX,n=e-this._joyOriginY;const o=Math.hypot(t,n);if(o>at){const c=at/o;t*=c,n*=c}this._stick.style.transition="none",this._stick.style.transform=`translate(${t}px, ${n}px)`,requestAnimationFrame(()=>{this._stick.style.transition="transform 80ms ease-out"});const i=t/at,a=n/at;if(Math.hypot(i,a)<Dl){this._setMovement(0,0);return}this._setMovement(i,-a)}_activeIsCamera(){return(this._opts.getActive?this._opts.getActive():"player")==="camera"}_setMovement(r,e){const t=this._activeIsCamera();t&&this._opts.camera?(this._opts.camera.inputForward=e,this._opts.camera.inputStrafe=r):this._opts.player&&(this._opts.player.inputForward=e,this._opts.player.inputStrafe=r),t&&this._opts.player?(this._opts.player.inputForward=0,this._opts.player.inputStrafe=0):!t&&this._opts.camera&&(this._opts.camera.inputForward=0,this._opts.camera.inputStrafe=0)}_setJump(r){this._activeIsCamera()&&this._opts.camera?this._opts.camera.inputUp=r:this._opts.player&&(this._opts.player.inputJump=r)}_setSneak(r){this._activeIsCamera()&&this._opts.camera?this._opts.camera.inputDown=r:this._opts.player&&(this._opts.player.inputSneak=r)}_applyLook(r,e){const t=r*(this._lookSensitivity/.002),n=e*(this._lookSensitivity/.002);this._activeIsCamera()&&this._opts.camera?this._opts.camera.applyLookDelta(t,n):this._opts.player&&this._opts.player.applyLookDelta(t,n)}_actionDown(r){const{world:e,scene:t,blockInteraction:n,getSelectedBlock:o}=this._opts;if(!e||!t||!n||!o)return;const i=performance.now();r===0?(n.mouseHeld=0,n.mouseHoldTime=i):r===2&&(n.mouseHeld=r,n.mouseHoldTime=i,yr(r,i,n,e,o,t))}_actionUp(r){const e=this._opts.blockInteraction;e&&e.mouseHeld===r&&(e.mouseHeld=-1)}}const Wl=""+new URL("cloth1-rQSbqQaY.wav",import.meta.url).href,jl=""+new URL("cloth2-Bsf9dy7W.wav",import.meta.url).href,ql=""+new URL("cloth3-4mN9PCjB.wav",import.meta.url).href,Yl=""+new URL("cloth4-BB13HI0Q.wav",import.meta.url).href,Xl=""+new URL("coral1-Ce7Jeu17.wav",import.meta.url).href,$l=""+new URL("coral2-Cfy2RjU2.wav",import.meta.url).href,Zl=""+new URL("coral3-CyI9rIW8.wav",import.meta.url).href,Kl=""+new URL("coral4-Bp3T5iM4.wav",import.meta.url).href,Jl=""+new URL("coral5-DonNr-7d.wav",import.meta.url).href,Ql=""+new URL("coral6-B8JOks-i.wav",import.meta.url).href,ec=""+new URL("grass1-CcRd259Q.wav",import.meta.url).href,tc=""+new URL("grass2-DGXOtHh7.wav",import.meta.url).href,nc=""+new URL("grass3-BPyuRLOX.wav",import.meta.url).href,rc=""+new URL("grass4-DVxIVnx3.wav",import.meta.url).href,oc=""+new URL("grass5-DI6OjZl4.wav",import.meta.url).href,ic=""+new URL("grass6-Bf5VD6yI.wav",import.meta.url).href,ac=""+new URL("gravel1-CZz6Zfew.wav",import.meta.url).href,sc=""+new URL("gravel2-C9lv5mzC.wav",import.meta.url).href,lc=""+new URL("gravel3-DyeQ0Rfa.wav",import.meta.url).href,cc=""+new URL("gravel4-BfSCT7w0.wav",import.meta.url).href,uc=""+new URL("sand1-Ciqwhtq8.wav",import.meta.url).href,dc=""+new URL("sand2-BTi87W5b.wav",import.meta.url).href,fc=""+new URL("sand3-532u2TkY.wav",import.meta.url).href,pc=""+new URL("sand4-C_w1pmBG.wav",import.meta.url).href,hc=""+new URL("sand5-CDCdXHm6.wav",import.meta.url).href,_c=""+new URL("stone1-BsjzFAng.wav",import.meta.url).href,mc=""+new URL("stone2-DzvdL41T.wav",import.meta.url).href,gc=""+new URL("stone3-CYb6BfFN.wav",import.meta.url).href,vc=""+new URL("stone4-DFPefyQ7.wav",import.meta.url).href,bc=""+new URL("stone5-CVLj567P.wav",import.meta.url).href,yc=""+new URL("stone6-CswOa5tA.wav",import.meta.url).href,wc=""+new URL("wood1-DSWFSF8G.wav",import.meta.url).href,xc=""+new URL("wood2-CSGQI2IY.wav",import.meta.url).href,Bc=""+new URL("wood3-DCP5Ew66.wav",import.meta.url).href,Sc=""+new URL("wood4-C--JcgAp.wav",import.meta.url).href,Pc=""+new URL("wood5-cP_3p3YS.wav",import.meta.url).href,Tc=""+new URL("wood6-IdFIwSmi.wav",import.meta.url).href,Gc=""+new URL("fallbig-BE8dw5XJ.wav",import.meta.url).href,Ec=""+new URL("fallsmall-BZcAgTny.wav",import.meta.url).href,Mc=""+new URL("grass1-CCHdxn4D.wav",import.meta.url).href,Ac=""+new URL("grass2-Ctd8JhUF.wav",import.meta.url).href,Uc=""+new URL("grass3-x_45b-_D.wav",import.meta.url).href,kc=""+new URL("grass4-spl5Ndua.wav",import.meta.url).href,Cc=""+new URL("sand1-T_E592kx.wav",import.meta.url).href,Lc=""+new URL("sand2-BNuSYbkF.wav",import.meta.url).href,Rc=""+new URL("sand3-DaqPUVKQ.wav",import.meta.url).href,Nc=""+new URL("sand4-TT7LnGwY.wav",import.meta.url).href,Ic=""+new URL("stone1-DAnELQ24.wav",import.meta.url).href,Oc=""+new URL("stone2-cLpgUmtS.wav",import.meta.url).href,Dc=""+new URL("stone3-3yjcMYde.wav",import.meta.url).href,Vc=""+new URL("stone4-DaH288J_.wav",import.meta.url).href,zc=""+new URL("wood1-D5mqXTyf.wav",import.meta.url).href,Fc=""+new URL("wood2-mBu4sysu.wav",import.meta.url).href,Hc=""+new URL("wood3-wSoj1HMx.wav",import.meta.url).href,Wc=""+new URL("wood4-DKmn8tfu.wav",import.meta.url).href,jc=Object.assign({"../../assets/sounds/player/step/cloth1.wav":Wl,"../../assets/sounds/player/step/cloth2.wav":jl,"../../assets/sounds/player/step/cloth3.wav":ql,"../../assets/sounds/player/step/cloth4.wav":Yl,"../../assets/sounds/player/step/coral1.wav":Xl,"../../assets/sounds/player/step/coral2.wav":$l,"../../assets/sounds/player/step/coral3.wav":Zl,"../../assets/sounds/player/step/coral4.wav":Kl,"../../assets/sounds/player/step/coral5.wav":Jl,"../../assets/sounds/player/step/coral6.wav":Ql,"../../assets/sounds/player/step/grass1.wav":ec,"../../assets/sounds/player/step/grass2.wav":tc,"../../assets/sounds/player/step/grass3.wav":nc,"../../assets/sounds/player/step/grass4.wav":rc,"../../assets/sounds/player/step/grass5.wav":oc,"../../assets/sounds/player/step/grass6.wav":ic,"../../assets/sounds/player/step/gravel1.wav":ac,"../../assets/sounds/player/step/gravel2.wav":sc,"../../assets/sounds/player/step/gravel3.wav":lc,"../../assets/sounds/player/step/gravel4.wav":cc,"../../assets/sounds/player/step/sand1.wav":uc,"../../assets/sounds/player/step/sand2.wav":dc,"../../assets/sounds/player/step/sand3.wav":fc,"../../assets/sounds/player/step/sand4.wav":pc,"../../assets/sounds/player/step/sand5.wav":hc,"../../assets/sounds/player/step/stone1.wav":_c,"../../assets/sounds/player/step/stone2.wav":mc,"../../assets/sounds/player/step/stone3.wav":gc,"../../assets/sounds/player/step/stone4.wav":vc,"../../assets/sounds/player/step/stone5.wav":bc,"../../assets/sounds/player/step/stone6.wav":yc,"../../assets/sounds/player/step/wood1.wav":wc,"../../assets/sounds/player/step/wood2.wav":xc,"../../assets/sounds/player/step/wood3.wav":Bc,"../../assets/sounds/player/step/wood4.wav":Sc,"../../assets/sounds/player/step/wood5.wav":Pc,"../../assets/sounds/player/step/wood6.wav":Tc}),qc=Object.assign({"../../assets/sounds/player/fall/fallbig.wav":Gc,"../../assets/sounds/player/fall/fallsmall.wav":Ec}),Yc=Object.assign({"../../assets/sounds/player/dig/grass1.wav":Mc,"../../assets/sounds/player/dig/grass2.wav":Ac,"../../assets/sounds/player/dig/grass3.wav":Uc,"../../assets/sounds/player/dig/grass4.wav":kc,"../../assets/sounds/player/dig/sand1.wav":Cc,"../../assets/sounds/player/dig/sand2.wav":Lc,"../../assets/sounds/player/dig/sand3.wav":Rc,"../../assets/sounds/player/dig/sand4.wav":Nc,"../../assets/sounds/player/dig/stone1.wav":Ic,"../../assets/sounds/player/dig/stone2.wav":Oc,"../../assets/sounds/player/dig/stone3.wav":Dc,"../../assets/sounds/player/dig/stone4.wav":Vc,"../../assets/sounds/player/dig/wood1.wav":zc,"../../assets/sounds/player/dig/wood2.wav":Fc,"../../assets/sounds/player/dig/wood3.wav":Hc,"../../assets/sounds/player/dig/wood4.wav":Wc});function ti(u){const r=u.match(/step\/(\w+?)(\d+)\.wav$/);return r?{surface:r[1],variant:parseInt(r[2],10)}:null}function Xc(u){const r=u.match(/fall\/(\w+)\.wav$/);return r?r[1]:null}class $c{constructor(){s(this,"_ctx",null);s(this,"_stepBuffers",new Map);s(this,"_fallBuffers",new Map);s(this,"_digBuffers",new Map);s(this,"_oneShots",[]);s(this,"_musicGain",null);s(this,"_musicSource",null);s(this,"_musicBuffer",null);s(this,"masterVolume",.5);s(this,"sfxVolume",.7);s(this,"musicVolume",.4)}async init(){this._ctx||(this._ctx=new AudioContext),this._ctx.state==="suspended"&&await this._ctx.resume(),await Promise.all([this._loadStepSounds(),this._loadFallSounds(),this._loadDigSounds()])}get context(){return this._ctx||(this._ctx=new AudioContext),this._ctx}async _loadStepSounds(){const r=new Map;for(const[e,t]of Object.entries(jc)){const n=ti(e);if(!n)continue;const o=await this._fetchDecode(t);if(!o)continue;let i=r.get(n.surface);i||(i=[],r.set(n.surface,i)),i.push(o)}for(const[,e]of r)e.sort(()=>Math.random()-.5);this._stepBuffers=r}async _loadFallSounds(){for(const[r,e]of Object.entries(qc)){const t=Xc(r);if(!t)continue;const n=await this._fetchDecode(e);n&&this._fallBuffers.set(t,n)}}async _loadDigSounds(){const r=new Map;for(const[e,t]of Object.entries(Yc)){const n=ti(e);if(!n)continue;const o=await this._fetchDecode(t);if(!o)continue;let i=r.get(n.surface);i||(i=[],r.set(n.surface,i)),i.push(o)}for(const[,e]of r)e.sort(()=>Math.random()-.5);this._digBuffers=r}async _fetchDecode(r){try{const t=await(await fetch(r)).arrayBuffer();return await this.context.decodeAudioData(t)}catch(e){return console.warn("[audio] failed to load",r,e),null}}get ready(){return this._ctx!==null&&this._ctx.state!=="suspended"}updateListener(r,e,t){const n=this._ctx;if(!n||n.state!=="running")return;const o=n.listener;o.positionX.value=r.x,o.positionY.value=r.y,o.positionZ.value=r.z,o.forwardX.value=e.x,o.forwardY.value=e.y,o.forwardZ.value=e.z,o.upX.value=t.x,o.upY.value=t.y,o.upZ.value=t.z;for(let i=this._oneShots.length-1;i>=0;i--)this._oneShots[i].done&&(this._oneShots[i].dispose(),this._oneShots.splice(i,1))}playBufferAt(r,e,t=1,n=1){const o=this._ctx;if(!o||o.state!=="running")return;const i=t*this.sfxVolume*this.masterVolume;if(i<=0)return;const a=new Zc(o,r,e,i,n);this._oneShots.push(a)}playStep(r,e,t=1,n=1){const o=this._stepBuffers.get(r);if(!o||o.length===0)return;const i=o[Math.floor(Math.random()*o.length)];this.playBufferAt(i,e,t,n)}playLand(r,e,t){const n=t>15?"fallbig":"fallsmall",o=this._fallBuffers.get(n);o&&this.playBufferAt(o,e,.6+Math.min(t/30,.4))}playDig(r,e){const t=this._digBuffers.get(r);if(!t||t.length===0)return;const n=t[Math.floor(Math.random()*t.length)];this.playBufferAt(n,e,.8)}playUI(r,e=1){const t=this._ctx;if(!t||t.state!=="running")return;const n=e*this.sfxVolume*this.masterVolume;if(n<=0)return;const o=t.createBufferSource();o.buffer=r;const i=t.createGain();i.gain.value=n,o.connect(i).connect(t.destination),o.start(),o.onended=()=>{o.disconnect(),i.disconnect()}}async playMusic(r,e){const t=this._ctx;if(!t)return;this.stopMusic();const n=await this._fetchDecode(r);if(!n)return;this._musicBuffer=n,this._musicGain||(this._musicGain=t.createGain(),this._musicGain.connect(t.destination)),this._musicGain.gain.value=(e??this.musicVolume)*this.masterVolume;const o=t.createBufferSource();o.buffer=n,o.loop=!0,o.connect(this._musicGain),o.start(),this._musicSource=o}setMusicVolume(r){this.musicVolume=r,this._musicGain&&(this._musicGain.gain.value=r*this.masterVolume)}stopMusic(){if(this._musicSource){try{this._musicSource.stop()}catch{}this._musicSource.disconnect(),this._musicSource=null}this._musicBuffer=null}fadeOutMusic(r=2){return new Promise(e=>{if(!this._musicGain||!this._musicSource){e();return}const t=this._musicGain.gain.value;this._musicGain.gain.cancelScheduledValues(this.context.currentTime),this._musicGain.gain.setValueAtTime(t,this.context.currentTime),this._musicGain.gain.linearRampToValueAtTime(0,this.context.currentTime+r),setTimeout(()=>{this.stopMusic(),e()},r*1e3)})}dispose(){this.stopMusic();for(const r of this._oneShots)r.dispose();this._oneShots.length=0,this._stepBuffers.clear(),this._fallBuffers.clear(),this._digBuffers.clear(),this._ctx&&(this._ctx.close().catch(()=>{}),this._ctx=null)}}class Zc{constructor(r,e,t,n,o){s(this,"_src");s(this,"_gain");s(this,"_panner");s(this,"_ctx");s(this,"_finished",!1);this._ctx=r,this._gain=r.createGain(),this._gain.gain.value=n,this._panner=r.createPanner(),this._panner.panningModel="HRTF",this._panner.distanceModel="inverse",this._panner.maxDistance=50,this._panner.refDistance=5,this._panner.rolloffFactor=1,this._panner.positionX.value=t.x,this._panner.positionY.value=t.y,this._panner.positionZ.value=t.z,this._src=r.createBufferSource(),this._src.buffer=e,this._src.playbackRate.value=o,this._src.connect(this._gain),this._gain.connect(this._panner),this._panner.connect(r.destination),this._src.start(),this._src.onended=()=>{this._finished=!0}}get done(){return this._finished}dispose(){try{this._src.stop()}catch{}this._src.disconnect(),this._gain.disconnect(),this._panner.disconnect()}}const Kc={[Se.None]:[0,1,2],[Se.Desert]:[0,1],[Se.GrassyPlains]:[0,1,2,3,4],[Se.RockyMountains]:[0,1,2,3,4],[Se.SnowyPlains]:[0,1,2,5,6],[Se.SnowyMountains]:[0,1,2,5,6],[Se.Max]:[0,1,2]},ni={0:5,1:4,2:2,3:2,4:1,5:2,6:1},Jc={0:"Clear",1:"Cloudy",2:"Overcast",3:"Light Rain",4:"Heavy Rain",5:"Light Snow",6:"Heavy Snow"};function Qc(u){return Jc[u]}function ri(u){switch(u){case 0:return .1;case 1:return .85;case 2:return 1.1;case 3:return .95;case 4:return 1.1;case 5:return .8;case 6:return 1.2}}function eu(u){switch(u){case 3:case 4:return Qe.Rain;case 5:case 6:return Qe.Snow;default:return Qe.None}}function tu(u){switch(u){case 3:return 12e3;case 4:return 5e4;case 5:return 800;case 6:return 5500;default:return 0}}function oi(u,r){const e=Kc[u];if(!e||e.length===0)return 0;const t=e.reduce((o,i)=>o+ni[i],0);let n=Math.random()*t;for(const o of e)if(n-=ni[o],n<=0)return o;return e[e.length-1]}function ii(){return 30+Math.random()*90}const nu=new j(0,1,0);class ru extends et{constructor(e,t){super();s(this,"_parent");s(this,"_world");s(this,"_velY",0);s(this,"_yaw",0);s(this,"_headGO",null);s(this,"_headBaseY",0);s(this,"_bobPhase");s(this,"_offsetAngle");s(this,"_followDist");this._parent=e,this._world=t,this._offsetAngle=Math.random()*Math.PI*2,this._followDist=.55+Math.random()*.5,this._bobPhase=Math.random()*Math.PI*2}onAttach(){for(const e of this.gameObject.children)if(e.name==="Duckling.Head"){this._headGO=e,this._headBaseY=e.position.y;break}}update(e){const t=this.gameObject,n=t.position.x,o=t.position.z;this._velY-=9.8*e,t.position.y+=this._velY*e;const i=this._world.getTopBlockY(Math.floor(n),Math.floor(o),Math.ceil(t.position.y)+4);i>0&&t.position.y<=i+.1&&(t.position.y=i,this._velY=0),this._offsetAngle+=e*.25;const a=this._parent.position.x+Math.cos(this._offsetAngle)*this._followDist,l=this._parent.position.z+Math.sin(this._offsetAngle)*this._followDist,c=a-n,d=l-o,f=c*c+d*d;let p=!1;if(f>.04){const h=Math.sqrt(f),_=h>2.5?3.5:1.8,m=c/h,y=d/h;t.position.x+=m*_*e,t.position.z+=y*_*e,this._yaw=Math.atan2(-m,-y),p=!0}if(t.rotation=ve.fromAxisAngle(nu,this._yaw),this._headGO){this._bobPhase+=e*(p?7:2);const h=p?.012:.004;this._headGO.position.y=this._headBaseY+Math.sin(this._bobPhase)*h}}}const ou=.5;function iu(u,r,e,t,n,o,i){const a=e.getTopBlockY(u,r,200);if(a<=0||e.getBiomeAt(u,a,r)!==Se.GrassyPlains)return null;const d=e.getBlockType(Math.floor(u),Math.floor(a-1),Math.floor(r))===L.WATER?Math.floor(a-.05):a,f=new _e("Duck");f.position.set(u+.5,d,r+.5);const p=new _e("Duck.Body");p.position.set(0,.15,0),p.addComponent(new Ee(n,new Te({albedo:[.93,.93,.93,1],roughness:.9}))),f.addChild(p);const h=new _e("Duck.Head");h.position.set(0,.32,-.12),h.addComponent(new Ee(o,new Te({albedo:[.08,.32,.1,1],roughness:.9}))),f.addChild(h);const _=new _e("Duck.Bill");return _.position.set(0,.27,-.205),_.addComponent(new Ee(i,new Te({albedo:[1,.55,.05,1],roughness:.8}))),f.addChild(_),f.addComponent(new Tt(e)),t.add(f),f}function au(u,r,e,t,n,o){const i=Math.random()*Math.PI*2,a=.5+Math.random()*1,l=u.position.x+Math.cos(i)*a,c=u.position.z+Math.sin(i)*a,d=r.getTopBlockY(Math.floor(l),Math.floor(c),200);if(d<=0)return;const f=ou,p=new _e("Duckling");p.position.set(l,d,c);const h=new _e("Duckling.Body");h.position.set(0,.15*f,0),h.addComponent(new Ee(t,new Te({albedo:[.95,.87,.25,1],roughness:.9}))),p.addChild(h);const _=new _e("Duckling.Head");_.position.set(0,.32*f,-.12*f),_.addComponent(new Ee(n,new Te({albedo:[.88,.78,.15,1],roughness:.9}))),p.addChild(_);const m=new _e("Duckling.Bill");m.position.set(0,.27*f,-.205*f),m.addComponent(new Ee(o,new Te({albedo:[1,.55,.05,1],roughness:.8}))),p.addChild(m),p.addComponent(new ru(u,r)),e.add(p)}const su=new j(0,1,0);class lu extends et{constructor(e){super();s(this,"_world");s(this,"_state","idle");s(this,"_timer",0);s(this,"_targetX",0);s(this,"_targetZ",0);s(this,"_hasTarget",!1);s(this,"_velY",0);s(this,"_yaw",0);s(this,"_headGO",null);s(this,"_headBaseY",0);s(this,"_bobPhase");this._world=e,this._timer=1+Math.random()*5,this._yaw=Math.random()*Math.PI*2,this._bobPhase=Math.random()*Math.PI*2}onAttach(){for(const e of this.gameObject.children)if(e.name==="Pig.Head"){this._headGO=e,this._headBaseY=e.position.y;break}}update(e){const t=this.gameObject,n=t.position.x,o=t.position.z;this._velY-=9.8*e,t.position.y+=this._velY*e;const i=this._world.getTopBlockY(Math.floor(n),Math.floor(o),Math.ceil(t.position.y)+4);switch(i>0&&t.position.y<=i+.1&&(t.position.y=i,this._velY=0),this._state){case"idle":{this._timer-=e,this._timer<=0&&this._pickWanderTarget();break}case"wander":{if(this._timer-=e,!this._hasTarget||this._timer<=0){this._enterIdle();break}const a=this._targetX-n,l=this._targetZ-o,c=a*a+l*l;if(c<.25){this._enterIdle();break}const d=Math.sqrt(c);t.position.x+=a/d*1.2*e,t.position.z+=l/d*1.2*e,this._yaw=Math.atan2(-(a/d),-(l/d));break}}if(t.rotation=ve.fromAxisAngle(su,this._yaw),this._headGO){this._bobPhase+=e*(this._state==="wander"?4:1.5);const a=this._state==="wander"?.014:.005;this._headGO.position.y=this._headBaseY+Math.sin(this._bobPhase)*a}}_enterIdle(){this._state="idle",this._hasTarget=!1,this._timer=3+Math.random()*5}_pickWanderTarget(){const e=this.gameObject,t=Math.random()*Math.PI*2,n=4+Math.random()*8;this._targetX=e.position.x+Math.cos(t)*n,this._targetZ=e.position.z+Math.sin(t)*n,this._hasTarget=!0,this._state="wander",this._timer=8+Math.random()*7}}const ai=[.96,.7,.72,1],cu=[.98,.76,.78,1];function si(u,r,e,t,n,o,i,a=1){const l=e.getTopBlockY(u,r,200);if(l<=0||e.getBiomeAt(u,l,r)!==Se.GrassyPlains)return;const d=a,f=new _e("Pig");f.position.set(u+.5,l,r+.5);const p=new _e("Pig.Body");p.position.set(0,.35*d,0),p.addComponent(new Ee(n,new Te({albedo:ai,roughness:.85}))),f.addChild(p);const h=new _e("Pig.Head");h.position.set(0,.35*d,-.48*d),h.addComponent(new Ee(o,new Te({albedo:ai,roughness:.85}))),f.addChild(h);const _=new _e("Pig.Snout");_.position.set(0,.31*d,-.7*d),_.addComponent(new Ee(i,new Te({albedo:cu,roughness:.8}))),f.addChild(_),f.addComponent(new lu(e)),t.add(f)}const li=[.37,.62,.22,1];function uu(u,r,e,t,n,o){const i=e.getTopBlockY(u,r,200);if(i<=0)return;const a=new _e("Creeper");a.position.set(u+.5,i,r+.5);const l=new _e("Creeper.Body");l.position.set(0,.9,0),l.addComponent(new Ee(n,new Te({albedo:li,roughness:.85}))),a.addChild(l);const c=new _e("Creeper.Head");c.position.set(0,1.28,-.14),c.addComponent(new Ee(o,new Te({albedo:li,roughness:.85}))),a.addChild(c),a.addComponent(new Je(e,t)),t.add(a)}const je=16,du=.15,fu=.2,pu=.08,hu=.25,_u=5,mu=.25;function gu(u,r,e){const t=new Set,n=u.onChunkAdded;u.onChunkAdded=(o,i)=>{if(n==null||n(o,i),o.aliveBlocks===0)return;const a=Math.floor(o.globalPosition.x/je),l=Math.floor(o.globalPosition.z/je),c=`${a}:${l}`;t.has(c)||(t.add(c),vu(a,l,u,r,e))}}function vu(u,r,e,t,n){const o=u*je,i=r*je;if(Math.random()<du){const a=1+Math.floor(Math.random()*2);for(let l=0;l<a;l++){const c=Math.floor(o+Math.random()*je),d=Math.floor(i+Math.random()*je),f=iu(c,d,e,t,n.duckBody,n.duckHead,n.duckBill);if(f&&Math.random()<hu)for(let p=0;p<_u;p++)au(f,e,t,n.ducklingBody,n.ducklingHead,n.ducklingBill)}}if(Math.random()<fu){const a=1+Math.floor(Math.random()*2);for(let l=0;l<a;l++){const c=Math.floor(o+Math.random()*je),d=Math.floor(i+Math.random()*je);Math.random()<mu?si(c,d,e,t,n.babyPigBody,n.babyPigHead,n.babyPigSnout,.55):si(c,d,e,t,n.pigBody,n.pigHead,n.pigSnout,1)}}if(Math.random()<pu){const a=Math.floor(o+Math.random()*je),l=Math.floor(i+Math.random()*je);uu(a,l,e,t,n.creeperBody,n.creeperHead)}}const Pt=16,bu=.025,yu=L.SPRUCE_PLANKS,wu=L.GLASS,xu=L.SPRUCE_PLANKS,Bu=[[1,1,1,1,1,1,1],[1,1,1,1,1,1,1],[1,1,1,1,1,1,1],[1,1,1,1,1,1,1],[1,1,1,1,1,1,1]],Su=[[1,1,1,2,1,1,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,1,1,0,1,1,1]],Pu=[[1,1,1,2,1,1,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,1,1,0,1,1,1]],Tu=[[3,3,3,3,3,3,3],[3,3,3,3,3,3,3],[3,3,3,3,3,3,3],[3,3,3,3,3,3,3],[3,3,3,3,3,3,3]];function Gu(u,r,e,t){const n=[Bu,Su,Pu,Tu];for(let o=0;o<n.length;o++){const i=n[o];for(let a=0;a<5;a++)for(let l=0;l<7;l++){const c=i[a][l];if(c===0)continue;const d=c===2?wu:c===3?xu:yu;t.setBlockType(u+l,r+o,e+a,d)}}}function Eu(u,r,e,t){for(let n=4;n<=12;n+=4)for(let o=4;o<=12;o+=4){const i=u.getBlockType(r+n,t-1,e+o);if(i!==L.NONE&&he(i))return!0}return!1}function Mu(u,r,e,t){for(let n=-1;n<=1;n++)for(let o=-1;o<=1;o++){const i=u.getBlockType(r+n*2,e-1,t+o*2);if(i!==L.NONE&&he(i))return!0}return!1}function Au(u,r,e,t){for(let n=0;n<Pt;n+=4)for(let o=0;o<Pt;o+=4){const i=u.getTopBlockY(r+n,e+o,200);if(i<=0||Math.abs(i-t)>1.5)return!1}return!0}function Uu(u){const r=new Set,e=u.onChunkAdded;u.onChunkAdded=(t,n)=>{if(e==null||e(t,n),t.aliveBlocks===0)return;const o=Math.floor(t.globalPosition.x/Pt),i=Math.floor(t.globalPosition.z/Pt),a=`${o}:${i}`;if(r.has(a))return;r.add(a);const l=o*Pt,c=i*Pt,d=l+8,f=c+8,p=u.getTopBlockY(d,f,200);if(p<=0||Eu(u,l,c,p)||u.getBiomeAt(d,p,f)!==Se.GrassyPlains||!Au(u,l,c,p)||Math.random()>=bu)return;const _=2+Math.floor(Math.random()*3);for(let m=0;m<_;m++){const y=Math.random()*Math.PI*2,g=4+Math.random()*6,b=Math.floor(d+Math.cos(y)*g),w=Math.floor(f+Math.sin(y)*g),B=u.getTopBlockY(b,w,200);B<=0||Math.abs(B-p)>1.5||Mu(u,b,B,w)||Gu(b,B,w,u)}}}const ft=128,an=40;class ku{constructor(){s(this,"data",new Float32Array(ft*ft));s(this,"resolution",ft);s(this,"extent",an);s(this,"_camX",NaN);s(this,"_camZ",NaN)}update(r,e,t){if(Math.abs(r-this._camX)<2&&Math.abs(e-this._camZ)<2)return;this._camX=r,this._camZ=e;const n=an*2/ft,o=r-an,i=e-an,a=Math.ceil(e)+80;for(let l=0;l<ft;l++)for(let c=0;c<ft;c++)this.data[l*ft+c]=t.getTopBlockY(Math.floor(o+c*n),Math.floor(i+l*n),a)}}function sn(u,r,e,t,n,o,i,a){const l=[{n:[0,0,-1],t:[-1,0,0,1],v:[[-o,-i,-a],[o,-i,-a],[o,i,-a],[-o,i,-a]]},{n:[0,0,1],t:[1,0,0,1],v:[[o,-i,a],[-o,-i,a],[-o,i,a],[o,i,a]]},{n:[-1,0,0],t:[0,0,-1,1],v:[[-o,-i,a],[-o,-i,-a],[-o,i,-a],[-o,i,a]]},{n:[1,0,0],t:[0,0,1,1],v:[[o,-i,-a],[o,-i,a],[o,i,a],[o,i,-a]]},{n:[0,1,0],t:[1,0,0,1],v:[[-o,i,-a],[o,i,-a],[o,i,a],[-o,i,a]]},{n:[0,-1,0],t:[1,0,0,1],v:[[-o,-i,a],[o,-i,a],[o,-i,-a],[-o,-i,-a]]}],c=[[0,1],[1,1],[1,0],[0,0]];for(const d of l){const f=u.length/12;for(let p=0;p<4;p++){const[h,_,m]=d.v[p];u.push(e+h,t+_,n+m,d.n[0],d.n[1],d.n[2],c[p][0],c[p][1],d.t[0],d.t[1],d.t[2],d.t[3])}r.push(f,f+2,f+1,f,f+3,f+2)}}function Cu(u){const r=ln(u,(o,i)=>sn(o,i,0,0,0,.25,.375,.125)),e=ln(u,(o,i)=>sn(o,i,0,0,0,.25,.25,.25)),t=ln(u,(o,i)=>sn(o,i,0,-.375,0,.125,.375,.125)),n=ln(u,(o,i)=>sn(o,i,0,-.375,0,.125,.375,.125));return{body:r,head:e,arm:t,leg:n}}function ln(u,r){const e=[],t=[];return r(e,t),Ae.fromData(u,new Float32Array(e),new Uint32Array(t))}const Lu=[.95,.78,.62,1],Fn=[.3,.55,.85,1],ci=[.25,.3,.45,1];class Ru{constructor(r,e,t,n){s(this,"playerId");s(this,"name");s(this,"root");s(this,"_scene");s(this,"_head");s(this,"_armL");s(this,"_armR");s(this,"_legL");s(this,"_legR");s(this,"_curX",0);s(this,"_curY",0);s(this,"_curZ",0);s(this,"_curYaw",0);s(this,"_curPitch",0);s(this,"_tgtX",0);s(this,"_tgtY",0);s(this,"_tgtZ",0);s(this,"_tgtYaw",0);s(this,"_tgtPitch",0);s(this,"_hasTarget",!1);s(this,"_walkPhase",0);this.playerId=r,this.name=e,this._scene=t;const o=new _e(`RemotePlayer.${r}`);this.root=o;const i=new _e("RP.Body");i.position.set(0,1.125,0),i.addComponent(new Ee(n.body,new Te({albedo:Fn,roughness:.85}))),o.addChild(i);const a=new _e("RP.Head");a.position.set(0,1.75,0),a.addComponent(new Ee(n.head,new Te({albedo:Lu,roughness:.8}))),o.addChild(a),this._head=a;const l=new _e("RP.ArmL");l.position.set(-.375,1.5,0),l.addComponent(new Ee(n.arm,new Te({albedo:Fn,roughness:.85}))),o.addChild(l),this._armL=l;const c=new _e("RP.ArmR");c.position.set(.375,1.5,0),c.addComponent(new Ee(n.arm,new Te({albedo:Fn,roughness:.85}))),o.addChild(c),this._armR=c;const d=new _e("RP.LegL");d.position.set(-.125,.75,0),d.addComponent(new Ee(n.leg,new Te({albedo:ci,roughness:.85}))),o.addChild(d),this._legL=d;const f=new _e("RP.LegR");f.position.set(.125,.75,0),f.addComponent(new Ee(n.leg,new Te({albedo:ci,roughness:.85}))),o.addChild(f),this._legR=f,t.add(o)}setTargetTransform(r,e,t,n,o){this._hasTarget||(this._curX=r,this._curY=e,this._curZ=t,this._curYaw=n,this._curPitch=o),this._tgtX=r,this._tgtY=e,this._tgtZ=t,this._tgtYaw=n,this._tgtPitch=o,this._hasTarget=!0}update(r){if(!this._hasTarget)return;const e=1-Math.exp(-12*r),t=this._tgtX-this._curX,n=this._tgtY-this._curY,o=this._tgtZ-this._curZ;this._curX+=t*e,this._curY+=n*e,this._curZ+=o*e,this._curYaw=Iu(this._curYaw,this._tgtYaw,e),this._curPitch+=(this._tgtPitch-this._curPitch)*e,this.root.position.set(this._curX,this._curY-1.625,this._curZ),this.root.rotation=ve.fromAxisAngle(Nu,this._curYaw),this._head.rotation=ve.fromAxisAngle(kt,this._curPitch);const a=Math.hypot(t,o)/Math.max(r,.001),l=a>.3,c=l?Math.min(a*1.2,8):4;this._walkPhase+=r*c;const d=l?Math.sin(this._walkPhase)*.55:0;this._armL.rotation=ve.fromAxisAngle(kt,d),this._armR.rotation=ve.fromAxisAngle(kt,-d),this._legL.rotation=ve.fromAxisAngle(kt,-d),this._legR.rotation=ve.fromAxisAngle(kt,d)}headWorldPosition(r){return r.x=this.root.position.x,r.y=this.root.position.y+2.1,r.z=this.root.position.z,r}dispose(){this._scene.remove(this.root)}}const Nu=new j(0,1,0),kt=new j(1,0,0);function Iu(u,r,e){let t=r-u;for(;t>Math.PI;)t-=2*Math.PI;for(;t<-Math.PI;)t+=2*Math.PI;return u+t*e}const ui=64;class Ou{constructor(r){s(this,"_root");s(this,"_labels",new Map);const e=document.createElement("div");e.style.position="absolute",e.style.left="0",e.style.top="0",e.style.width="100%",e.style.height="100%",e.style.pointerEvents="none",e.style.overflow="hidden",r.appendChild(e),this._root=e}add(r,e){if(this._labels.has(r))return;const t=document.createElement("div");t.textContent=e,t.style.position="absolute",t.style.transform="translate(-50%, -100%)",t.style.padding="2px 6px",t.style.font="12px sans-serif",t.style.color="#fff",t.style.background="rgba(0,0,0,0.55)",t.style.border="1px solid rgba(255,255,255,0.2)",t.style.borderRadius="4px",t.style.whiteSpace="nowrap",t.style.userSelect="none",t.style.display="none",this._root.appendChild(t),this._labels.set(r,t)}remove(r){const e=this._labels.get(r);e!==void 0&&(e.remove(),this._labels.delete(r))}update(r,e,t,n,o){for(const[i,a]of this._labels){const l=o.get(i);if(l===void 0){a.style.display="none";continue}const c=l.x-e.x,d=l.y-e.y,f=l.z-e.z;if(c*c+d*d+f*f>ui*ui){a.style.display="none";continue}const h=r.transformVec4(new qe(l.x,l.y,l.z,1));if(h.w<=.001){a.style.display="none";continue}const _=h.x/h.w,m=h.y/h.w;if(_<-1||_>1||m<-1||m>1){a.style.display="none";continue}const y=(_*.5+.5)*t,g=(1-(m*.5+.5))*n;a.style.display="block",a.style.left=`${y}px`,a.style.top=`${g}px`}}}const fn=1,Du="crafty",Vu=1,cn="worlds";class wr{constructor(r){s(this,"_db");this._db=r}static open(){return new Promise((r,e)=>{const t=indexedDB.open(Du,Vu);t.onupgradeneeded=()=>{const n=t.result;n.objectStoreNames.contains(cn)||n.createObjectStore(cn,{keyPath:"id"})},t.onsuccess=()=>r(new wr(t.result)),t.onerror=()=>e(t.error??new Error("IndexedDB open failed"))})}list(){return this._withStore("readonly",r=>new Promise((e,t)=>{const n=r.getAll();n.onsuccess=()=>{const o=n.result??[];o.sort((i,a)=>a.lastPlayedAt-i.lastPlayedAt),e(o)},n.onerror=()=>t(n.error??new Error("IndexedDB list failed"))}))}load(r){return this._withStore("readonly",e=>new Promise((t,n)=>{const o=e.get(r);o.onsuccess=()=>t(o.result??null),o.onerror=()=>n(o.error??new Error("IndexedDB load failed"))}))}save(r){return this._withStore("readwrite",e=>new Promise((t,n)=>{const o=e.put(r);o.onsuccess=()=>t(),o.onerror=()=>n(o.error??new Error("IndexedDB save failed"))}))}delete(r){return this._withStore("readwrite",e=>new Promise((t,n)=>{const o=e.delete(r);o.onsuccess=()=>t(),o.onerror=()=>n(o.error??new Error("IndexedDB delete failed"))}))}_withStore(r,e){const n=this._db.transaction(cn,r).objectStore(cn);return e(n)}}function di(u,r){const e=Date.now();return{id:zu(),name:u,seed:r,createdAt:e,lastPlayedAt:e,edits:[],player:{x:64,y:80,z:64,yaw:0,pitch:0},sunAngle:Math.PI*.3,version:fn}}function zu(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`}const Fu=2,Hu=20,Wu=1e3/Hu;class ju{constructor(){s(this,"_ws",null);s(this,"_callbacks",{});s(this,"_lastTransformSend",0);s(this,"_pendingTransform",null);s(this,"_connected",!1);s(this,"_inGame",!1);s(this,"_pendingHello",null);s(this,"_pendingCreate",null);s(this,"_pendingJoin",null)}get connected(){return this._connected}setCallbacks(r){this._callbacks=r}connect(r,e,t){return new Promise((n,o)=>{const i=new WebSocket(r);this._ws=i,this._pendingHello={resolve:n,reject:o},i.addEventListener("open",()=>{this._send({t:"hello",playerKey:e,name:t,version:Fu})}),i.addEventListener("message",a=>{let l;try{l=JSON.parse(typeof a.data=="string"?a.data:"")}catch{return}this._dispatch(l)}),i.addEventListener("error",()=>{this._failAllPending(new Error("WebSocket error"))}),i.addEventListener("close",()=>{this._connected=!1,this._inGame=!1,this._failAllPending(new Error("WebSocket closed"))})})}createWorld(r,e){return!this._connected||this._inGame?Promise.reject(new Error("createWorld requires lobby phase")):new Promise((t,n)=>{this._pendingCreate={resolve:t,reject:n},this._send({t:"create_world",name:r,seed:e})})}joinWorld(r){return!this._connected||this._inGame?Promise.reject(new Error("joinWorld requires lobby phase")):new Promise((e,t)=>{this._pendingJoin={resolve:e,reject:t},this._send({t:"join_world",worldId:r})})}sendTransform(r,e,t,n,o){if(!this._inGame)return;this._pendingTransform={x:r,y:e,z:t,yaw:n,pitch:o};const i=performance.now();if(i-this._lastTransformSend<Wu)return;this._lastTransformSend=i;const a=this._pendingTransform;this._pendingTransform=null,this._send({t:"transform",x:a.x,y:a.y,z:a.z,yaw:a.yaw,pitch:a.pitch})}sendBlockPlace(r,e,t,n,o,i,a){this._inGame&&this._send({t:"block_place",x:r,y:e,z:t,fx:n,fy:o,fz:i,blockType:a})}sendBlockBreak(r,e,t){this._inGame&&this._send({t:"block_break",x:r,y:e,z:t})}_dispatch(r){var e,t,n,o,i,a,l,c,d,f;switch(r.t){case"world_list":if(this._pendingHello!==null){this._connected=!0,this._pendingHello.resolve(r.worlds),this._pendingHello=null;return}(t=(e=this._callbacks).onWorldList)==null||t.call(e,r.worlds);return;case"world_created":this._pendingCreate!==null&&(this._pendingCreate.resolve(r.world),this._pendingCreate=null);return;case"welcome":this._pendingJoin!==null&&(this._inGame=!0,this._pendingJoin.resolve({playerId:r.playerId,worldId:r.worldId,seed:r.seed,sunAngle:r.sunAngle,lastPosition:r.lastPosition,edits:r.edits,players:r.players}),this._pendingJoin=null);return;case"error":{const p=new Error(`${r.code}: ${r.message}`);if(this._pendingCreate!==null){this._pendingCreate.reject(p),this._pendingCreate=null;return}if(this._pendingJoin!==null){this._pendingJoin.reject(p),this._pendingJoin=null;return}if(this._pendingHello!==null){this._pendingHello.reject(p),this._pendingHello=null;return}console.warn("[crafty] server error:",p.message);return}case"player_join":(o=(n=this._callbacks).onPlayerJoin)==null||o.call(n,r.playerId,r.name);return;case"player_leave":(a=(i=this._callbacks).onPlayerLeave)==null||a.call(i,r.playerId);return;case"player_transform":(c=(l=this._callbacks).onPlayerTransform)==null||c.call(l,r.playerId,r.x,r.y,r.z,r.yaw,r.pitch);return;case"block_edit":(f=(d=this._callbacks).onBlockEdit)==null||f.call(d,r.edit);return}}_failAllPending(r){this._pendingHello!==null&&(this._pendingHello.reject(r),this._pendingHello=null),this._pendingCreate!==null&&(this._pendingCreate.reject(r),this._pendingCreate=null),this._pendingJoin!==null&&(this._pendingJoin.reject(r),this._pendingJoin=null)}_send(r){this._ws===null||this._ws.readyState!==WebSocket.OPEN||this._ws.send(JSON.stringify(r))}}const qu=""+new URL("crafty-CP0F5VYA.png",import.meta.url).href,Yu=""+new URL("favicon-Bjfj1BJY.svg",import.meta.url).href,fi="crafty.playerName",un="crafty.lastSeed",pi="crafty.serverUrl",hi="crafty.playerKey",Hn="ws://localhost:8787";function Xu(){let u=localStorage.getItem(hi);return(u===null||u.length===0)&&(u=typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`,localStorage.setItem(hi,u)),u}async function $u(){let u=null,r=[];try{u=await wr.open(),r=await u.list()}catch(e){console.warn("[crafty] world storage unavailable — local worlds will not persist",e)}return new Promise(e=>{const t=document.createElement("div");t.style.cssText=["position:fixed","inset:0","z-index:200",`background:linear-gradient(rgba(128,128,128,0.05),rgba(128,128,128,0.35)),url(${qu}) center/cover no-repeat #000`,"display:flex","align-items:center","justify-content:center","font-family:ui-monospace,monospace"].join(";"),document.body.appendChild(t);const n=document.createElement("div");n.style.cssText=["display:flex","flex-direction:column","align-items:stretch","gap:clamp(10px,2vh,18px)","padding:clamp(16px,4vh,36px) clamp(12px,4vw,44px)","background:rgba(82, 82, 82, 1.0)","border:1px solid rgba(255,255,255,0.12)","border-radius:12px","width:min(520px,calc(100vw - 24px))","box-sizing:border-box","max-height:min(600px,calc(100vh - 24px))","overflow-y:auto","box-shadow:0 0 55px rgba(255,255,255,0.8)"].join(";"),t.appendChild(n);const o=document.createElement("div");o.style.cssText="display:flex;flex-direction:row;gap:8px",n.appendChild(o);const i=document.createElement("img");i.src=Yu,i.style.cssText="width:64px;height:64px;filter:drop-shadow(0 0 4px rgba(100,200,255,0.6))",o.appendChild(i);const a=document.createElement("h1");a.textContent="CRAFTY",a.style.cssText=["margin:0 0 4px","font-size:clamp(28px,7vw,44px)","font-weight:900","color:#fff","letter-spacing:0.14em","text-shadow:0 0 32px rgba(100,200,255,0.4)"].join(";"),o.appendChild(a);const l=xt("Player name",wt({value:localStorage.getItem(fi)??"",placeholder:"Steve",maxLength:16}));n.appendChild(l.row);const c=document.createElement("div");c.style.cssText="display:flex;gap:0;border-bottom:1px solid rgba(255,255,255,0.12)",n.appendChild(c);const d=_i("Local"),f=_i("Network");c.appendChild(d),c.appendChild(f);const p=gi(),h=gi();n.appendChild(p),n.appendChild(h),p.appendChild(Ct("Saved worlds"));const _=document.createElement("div");_.style.cssText=["display:flex","flex-direction:column","gap:6px","max-height:clamp(120px,30vh,240px)","overflow-y:auto","padding:8px 4px 12px"].join(";"),p.appendChild(_);let m=r;function y(){if(_.replaceChildren(),m.length===0){const O=document.createElement("div");O.textContent=u===null?"Storage unavailable in this browser":"No saved worlds yet",O.style.cssText="color:rgba(255,255,255,0.85);font-size:12px;padding:8px 0",_.appendChild(O);return}for(const O of m)_.appendChild(Zu(O,()=>g(O),()=>b(O)))}y();function g(O){ie({mode:"local",world:O,storage:u,playerName:re()})}async function b(O){if(u!==null)try{await u.delete(O.id),m=m.filter(W=>W.id!==O.id),y()}catch(W){console.error("[crafty] delete failed",W)}}p.appendChild(Ct("New world"));const w=wt({value:"",placeholder:`World ${r.length+1}`,maxLength:32});p.appendChild(xt("Name",w).row);const B=wt({value:localStorage.getItem(un)??"13",placeholder:"random"});p.appendChild(xt("Seed",B).row);const x=Wn("Create"),U=document.createElement("div");U.style.cssText="color:#f88;font-size:12px;min-height:16px;text-align:right",p.appendChild(jn(x,U));const R=Xu();let A=null,I="",k=[];const v=document.createElement("div");v.style.cssText="display:flex;flex-direction:column;gap:10px",h.appendChild(v);const M=document.createElement("div");M.style.cssText="display:none;flex-direction:column;gap:10px",h.appendChild(M),v.appendChild(Ct("Server"));const T=wt({value:localStorage.getItem(pi)??Hn,placeholder:Hn});v.appendChild(xt("URL",T).row);const G=Wn("Connect"),S=document.createElement("div");S.style.cssText="color:#f88;font-size:12px;min-height:16px;text-align:right",v.appendChild(jn(G,S)),M.appendChild(Ct("Server worlds"));const N=document.createElement("div");N.style.cssText="color:rgba(255,255,255,0.6);font-size:11px;padding:0 0 4px;display:flex;align-items:center;justify-content:space-between;gap:8px";const E=document.createElement("span");N.appendChild(E);const X=document.createElement("button");X.textContent="Disconnect",X.style.cssText=["background:transparent","color:rgba(255,255,255,0.6)","border:1px solid rgba(255,255,255,0.25)","border-radius:4px","padding:2px 8px","font:11px ui-monospace,monospace","cursor:pointer"].join(";"),N.appendChild(X),M.appendChild(N);const V=document.createElement("div");V.style.cssText=["display:flex","flex-direction:column","gap:6px","max-height:200px","overflow-y:auto","padding:4px"].join(";"),M.appendChild(V),M.appendChild(Ct("New world"));const F=wt({value:"",placeholder:"World name",maxLength:32});M.appendChild(xt("Name",F).row);const H=wt({value:localStorage.getItem(un)??"13",placeholder:"random"});M.appendChild(xt("Seed",H).row);const C=Wn("Create"),Y=document.createElement("div");Y.style.cssText="color:#f88;font-size:12px;min-height:16px;text-align:right",M.appendChild(jn(C,Y));function te(){if(V.replaceChildren(),k.length===0){const O=document.createElement("div");O.textContent="No worlds on this server yet",O.style.cssText="color:rgba(255,255,255,0.85);font-size:12px;padding:8px 0",V.appendChild(O);return}for(const O of k)V.appendChild(Ku(O,()=>q(O)))}async function q(O){if(A!==null){Y.style.color="rgba(255,255,255,0.92)",Y.textContent=`joining "${O.name}"…`;try{const W=await A.joinWorld(O.id);ie({mode:"network",playerName:re(),serverUrl:I,network:A,welcome:W,world:O})}catch(W){Y.style.color="#f88",Y.textContent=`join failed: ${W.message}`}}}C.addEventListener("click",async()=>{if(A===null)return;const O=fe(H.value);H.value=String(O),localStorage.setItem(un,String(O));const W=F.value.trim(),ce=W.length>0?W:`World ${k.length+1}`;C.disabled=!0,Y.style.color="rgba(255,255,255,0.92)",Y.textContent="creating…";try{const Q=await A.createWorld(ce,O),le=await A.joinWorld(Q.id);ie({mode:"network",playerName:re(),serverUrl:I,network:A,welcome:le,world:Q})}catch(Q){Y.style.color="#f88",Y.textContent=`failed: ${Q.message}`,C.disabled=!1}}),X.addEventListener("click",()=>{A=null,k=[],I="",M.style.display="none",v.style.display="flex",G.disabled=!1,S.textContent="",l.input.disabled=!1});function ne(O){const W=O==="local";mi(d,W),mi(f,!W),p.style.display=W?"flex":"none",h.style.display=W?"none":"flex"}d.addEventListener("click",()=>ne("local")),f.addEventListener("click",()=>ne("network")),ne("local");function re(){const O=(l.input.value??"").trim().slice(0,16);return O.length>0?O:`player${Math.floor(Math.random()*1e3)}`}function fe(O){const W=O.trim();if(W.length===0)return Math.floor(Math.random()*2147483647);const ce=Number(W);if(Number.isFinite(ce))return Math.floor(ce);let Q=2166136261;for(let le=0;le<W.length;le++)Q=Math.imul(Q^W.charCodeAt(le),16777619)>>>0;return Q&2147483647}function ie(O){localStorage.setItem(fi,re()),t.remove(),e(O)}x.addEventListener("click",async()=>{const O=fe(B.value);B.value=String(O),localStorage.setItem(un,String(O));const W=w.value.trim(),ce=W.length>0?W:`World ${m.length+1}`;if(u===null){ie({mode:"local",world:di(ce,O),storage:null,playerName:re()});return}x.disabled=!0,U.style.color="rgba(255,255,255,0.92)",U.textContent="creating…";try{const Q=di(ce,O);await u.save(Q),ie({mode:"local",world:Q,storage:u,playerName:re()})}catch(Q){U.style.color="#f88",U.textContent=`failed: ${Q.message}`,x.disabled=!1}}),G.addEventListener("click",async()=>{const O=T.value.trim()||Hn,W=re();S.style.color="rgba(255,255,255,0.92)",S.textContent="connecting…",G.disabled=!0;const ce=new ju;try{const Q=await ce.connect(O,R,W);localStorage.setItem(pi,O),A=ce,I=O,k=Q,l.input.disabled=!0,ce.setCallbacks({onWorldList:le=>{k=le,te()}}),E.textContent=O,v.style.display="none",M.style.display="flex",S.textContent="",te()}catch(Q){S.style.color="#f88",S.textContent=`failed: ${Q.message}`,G.disabled=!1}})})}function wt(u){const r=document.createElement("input");return r.type="text",u.value!==void 0&&(r.value=u.value),u.placeholder!==void 0&&(r.placeholder=u.placeholder),u.maxLength!==void 0&&(r.maxLength=u.maxLength),r.style.cssText=["flex:1","padding:8px 10px","background:rgba(0,0,0,0.55)","color:#fff","border:1px solid rgba(255,255,255,0.35)","border-radius:5px","font:13px ui-monospace,monospace","outline:none"].join(";"),r.addEventListener("focus",()=>{r.style.borderColor="#5f5"}),r.addEventListener("blur",()=>{r.style.borderColor="rgba(255,255,255,0.35)"}),r}function xt(u,r){const e=document.createElement("div");e.style.cssText="display:flex;align-items:center;gap:12px";const t=document.createElement("label");return t.textContent=u,t.style.cssText="min-width:96px;color:rgba(255,255,255,0.92);font-size:12px;letter-spacing:0.06em",e.appendChild(t),e.appendChild(r),{row:e,input:r}}function _i(u){const r=document.createElement("button");return r.textContent=u,r.style.cssText=["padding:10px 20px","background:transparent","color:rgba(255,255,255,0.8)","border:none","border-bottom:2px solid transparent","font:13px ui-monospace,monospace","letter-spacing:0.08em","cursor:pointer"].join(";"),r}function mi(u,r){u.style.color=r?"#9fff9f":"rgba(255,255,255,0.8)",u.style.borderBottomColor=r?"#9fff9f":"transparent"}function gi(){const u=document.createElement("div");return u.style.cssText="display:flex;flex-direction:column;gap:10px;padding:12px 0",u}function Ct(u){const r=document.createElement("div");return r.textContent=u,r.style.cssText="color:#fff;font-size:11px;letter-spacing:0.18em",r}function Wn(u){const r=document.createElement("button");return r.textContent=u,r.style.cssText=["padding:10px 32px","background:#1a3a1a","color:#5f5","border:1px solid #5f5","border-radius:6px","font:13px ui-monospace,monospace","letter-spacing:0.06em","cursor:pointer","transition:background 0.15s"].join(";"),r.addEventListener("mouseenter",()=>{r.disabled||(r.style.background="#243e24")}),r.addEventListener("mouseleave",()=>{r.style.background="#1a3a1a"}),r}function jn(...u){const r=document.createElement("div");r.style.cssText="display:flex;align-items:center;gap:12px;justify-content:flex-end;padding-top:8px";for(const e of u)r.appendChild(e);return r}function Zu(u,r,e){const t=document.createElement("div");t.style.cssText=["display:flex","align-items:center","gap:10px","padding:6px 8px","border-radius:6px","background:rgba(0,0,0,0.35)","border:1px solid rgba(255,255,255,0.08)","cursor:pointer","transition:background 0.12s"].join(";"),t.addEventListener("mouseenter",()=>{t.style.background="rgba(255,255,255,0.08)"}),t.addEventListener("mouseleave",()=>{t.style.background="rgba(0,0,0,0.35)"}),t.addEventListener("click",d=>{d.target.dataset.role!=="delete"&&r()});const n=document.createElement("div");if(n.style.cssText=["width:64px","height:36px","flex-shrink:0","border-radius:4px","overflow:hidden","background:linear-gradient(135deg,#1f3a4a,#0a1622)"].join(";"),u.screenshot!==void 0){const d=document.createElement("img");d.src=URL.createObjectURL(u.screenshot),d.style.cssText="width:100%;height:100%;object-fit:cover;display:block",d.addEventListener("load",()=>URL.revokeObjectURL(d.src)),n.appendChild(d)}t.appendChild(n);const o=document.createElement("div");o.style.cssText="flex:1;display:flex;flex-direction:column;gap:2px;min-width:0";const i=document.createElement("div");i.textContent=u.name,i.style.cssText="color:#fff;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis";const a=document.createElement("div");a.textContent=Ni(Date.now()-u.lastPlayedAt),a.style.cssText="color:rgba(255,255,255,0.55);font-size:11px",o.appendChild(i),o.appendChild(a),t.appendChild(o);const l=document.createElement("button");l.dataset.role="delete",l.textContent="×",l.title="Delete",l.style.cssText=["background:transparent","color:rgba(255,255,255,0.45)","border:1px solid rgba(255,255,255,0.18)","border-radius:4px","padding:2px 8px","font:13px ui-monospace,monospace","cursor:pointer"].join(";");let c=!1;return l.addEventListener("click",d=>{if(d.stopPropagation(),!c){c=!0,l.textContent="Delete?",l.style.color="#f88",l.style.borderColor="#f88";const f=()=>{c=!1,l.textContent="×",l.style.color="rgba(255,255,255,0.45)",l.style.borderColor="rgba(255,255,255,0.18)",document.removeEventListener("click",f,!0)};setTimeout(()=>document.addEventListener("click",f,!0),0);return}e()}),t.appendChild(l),t}function Ku(u,r){const e=document.createElement("div");e.style.cssText=["display:flex","align-items:center","gap:10px","padding:8px 10px","border-radius:6px","background:rgba(0,0,0,0.35)","border:1px solid rgba(255,255,255,0.08)","cursor:pointer","transition:background 0.12s"].join(";"),e.addEventListener("mouseenter",()=>{e.style.background="rgba(255,255,255,0.08)"}),e.addEventListener("mouseleave",()=>{e.style.background="rgba(0,0,0,0.35)"}),e.addEventListener("click",r);const t=document.createElement("div");t.style.cssText="flex:1;display:flex;flex-direction:column;gap:2px;min-width:0";const n=document.createElement("div");n.textContent=u.name,n.style.cssText="color:#fff;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis";const o=document.createElement("div"),i=u.playerCount===1?"1 player":`${u.playerCount} players`;return o.textContent=`${i}  ·  ${u.editCount} edit${u.editCount===1?"":"s"}  ·  ${Ni(Date.now()-u.lastModifiedAt)}`,o.style.cssText="color:rgba(255,255,255,0.55);font-size:11px",t.appendChild(n),t.appendChild(o),e.appendChild(t),e}function Ni(u){if(u<0)return"just now";const r=Math.floor(u/1e3);if(r<60)return"just now";const e=Math.floor(r/60);if(e<60)return`${e} minute${e===1?"":"s"} ago`;const t=Math.floor(e/60);if(t<24)return`${t} hour${t===1?"":"s"} ago`;const n=Math.floor(t/24);if(n<30)return`${n} day${n===1?"":"s"} ago`;const o=Math.floor(n/30);return`${o} month${o===1?"":"s"} ago`}const Ju={ssao:!0,ssgi:!1,shadows:!0,dof:!0,bloom:!0,godrays:!0,fog:!1,aces:!0,ao_dbg:!1,shd_dbg:!1,chunk_dbg:!1,hdr:!0,auto_exp:!1,debug_info:!1,rain:!0,clouds:!0},Qu="modulepreload",ed=function(u,r){return new URL(u,r).href},vi={},td=function(r,e,t){let n=Promise.resolve();if(e&&e.length>0){const i=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),l=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));n=Promise.allSettled(e.map(c=>{if(c=ed(c,t),c in vi)return;vi[c]=!0;const d=c.endsWith(".css"),f=d?'[rel="stylesheet"]':"";if(!!t)for(let _=i.length-1;_>=0;_--){const m=i[_];if(m.href===c&&(!d||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${c}"]${f}`))return;const h=document.createElement("link");if(h.rel=d?"stylesheet":Qu,d||(h.as="script"),h.crossOrigin="",h.href=c,l&&h.setAttribute("nonce",l),document.head.appendChild(h),d)return new Promise((_,m)=>{h.addEventListener("load",_),h.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${c}`)))})}))}function o(i){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=i,window.dispatchEvent(a),!a.defaultPrevented)throw i}return n.then(i=>{for(const a of i||[])a.status==="rejected"&&o(a.reason);return r().catch(o)})},nd={emitter:{maxParticles:8e4,spawnRate:24e3,lifetime:[2,3.5],shape:{kind:"box",halfExtents:[35,.1,35]},initialSpeed:[0,0],initialColor:[.75,.88,1,.55],initialSize:[.005,.009],roughness:.1,metallic:0},modifiers:[{type:"gravity",strength:9},{type:"drag",coefficient:.05},{type:"color_over_lifetime",startColor:[.75,.88,1,.55],endColor:[.75,.88,1,0]},{type:"block_collision"}],renderer:{type:"sprites",blendMode:"alpha",billboard:"velocity",renderTarget:"hdr"}},rd={emitter:{maxParticles:1024,spawnRate:0,lifetime:[.5,1],shape:{kind:"sphere",radius:.15,solidAngle:Math.PI},initialSpeed:[2,4.5],initialColor:[1,1,1,1],initialSize:[.025,.05],roughness:.9,metallic:0},modifiers:[{type:"gravity",strength:14},{type:"drag",coefficient:.6}],renderer:{type:"sprites",blendMode:"alpha",billboard:"camera",shape:"pixel",renderTarget:"hdr"}},od={emitter:{maxParticles:512,spawnRate:0,lifetime:[.3,.8],shape:{kind:"sphere",radius:.5,solidAngle:Math.PI},initialSpeed:[4,10],initialColor:[1,.6,.1,1],initialSize:[.05,.15],roughness:.5,metallic:0},modifiers:[{type:"gravity",strength:4},{type:"drag",coefficient:.4},{type:"color_over_lifetime",startColor:[1,.6,.1,1],endColor:[.2,.05,0,0]},{type:"size_over_lifetime",start:.15,end:.02}],renderer:{type:"sprites",blendMode:"alpha",billboard:"camera",shape:"soft",renderTarget:"hdr"}},id={emitter:{maxParticles:8e4,spawnRate:1500,lifetime:[30,105],shape:{kind:"box",halfExtents:[35,.1,35]},initialSpeed:[0,0],initialColor:[.92,.96,1,.85],initialSize:[.025,.055],roughness:.1,metallic:0},modifiers:[{type:"gravity",strength:1.5},{type:"drag",coefficient:.8},{type:"curl_noise",scale:1,strength:1,timeScale:1,octaves:1},{type:"block_collision"}],renderer:{type:"sprites",blendMode:"alpha",billboard:"camera",renderTarget:"hdr"}};async function ad(u,r,e,t,n,o,i,a,l,c,d){let f,p,h,_;if(r.worldGeometryPass){const Y=pn.create(u);r.worldGeometryPass.updateGBuffer(Y),f=Y,p=r.worldGeometryPass,h=r.worldShadowPass,_=r.waterPass}else{f=pn.create(u),p=fr.create(u,f,t),h=gr.create(u,r.shadowPass.shadowMapArrayViews,3,t);const Y=u.device.createTexture({label:"WaterDummyHDR",size:{width:u.width,height:u.height},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),te=u.device.createTexture({label:"WaterDummyDepth",size:{width:u.width,height:u.height},format:"depth32float",usage:GPUTextureUsage.TEXTURE_BINDING}),q=Y.createView(),ne=te.createView();_=pt.create(u,Y,q,ne,n,o,i);const re=(O,W)=>{d.set(O,W),p.addChunk(O,W),h.addChunk(O,W),_.addChunk(O,W)},fe=(O,W)=>{d.set(O,W),p.updateChunk(O,W),h.updateChunk(O,W),_.updateChunk(O,W)},ie=O=>{d.delete(O),p.removeChunk(O),h.removeChunk(O),_.removeChunk(O)};c.onChunkAdded=re,c.onChunkUpdated=fe,c.onChunkRemoved=ie;for(const[O,W]of d)_.addChunk(O,W)}const m=dr.create(u,f),y=hr.create(u,f),g=e.clouds?ar.create(u,l):null,b=nr.create(u,f,r.shadowPass,y.aoView,g==null?void 0:g.shadowView,a),w=e.godrays?cr.create(u,f,r.shadowPass,b.hdrView,b.cameraBuffer,b.lightBuffer,l):null,B=rr.create(u,b.hdrView),x=e.clouds?ir.create(u,b.hdrView,f.depthView,l):null;u.pushInitErrorScope();const U=mr.create(u);await u.popInitErrorScope("PointSpotShadowPass");const R=vr.create(u,f,U,b.hdrView),A=sr.create(u,b,f),I=_r.create(u,f,A.historyView);b.updateSSGI(I.resultView),r.waterPass,_.updateRenderTargets(b.hdrTexture,b.hdrView,f.depthView,n);let k=null;const v=e.dof?(k=pr.create(u,A.resolvedView,f.depthView),k.resultView):A.resolvedView;let M=null;const T=e.bloom?(M=lr.create(u,v),M.resultView):v,G=or.create(u,T,f.depthView,t.colorAtlas),S=qn.create(u,b.hdrTexture);S.enabled=e.auto_exp;const N=ur.create(u,T,y.aoView,f.depthView,b.cameraBuffer,b.lightBuffer,S.exposureBuffer);N.depthFogEnabled=e.fog;const E=r.currentWeatherEffect??Qe.None;let X=null;if(e.rain&&E!==Qe.None){const Y=E===Qe.Snow?id:nd;X=Rt.create(u,Y,f,b.hdrView)}const V=Rt.create(u,rd,f,b.hdrView),F=Rt.create(u,od,f,b.hdrView),{RenderGraph:H}=await td(async()=>{const{RenderGraph:Y}=await import("./index-CGA49NKJ.js");return{RenderGraph:Y}},[],import.meta.url),C=new H;return C.addPass(r.shadowPass),g&&C.addPass(g),C.addPass(h),C.addPass(U),C.addPass(m),C.addPass(p),C.addPass(y),C.addPass(I),x?C.addPass(x):C.addPass(B),C.addPass(b),C.addPass(R),C.addPass(_),w&&C.addPass(w),X&&C.addPass(X),C.addPass(V),C.addPass(F),C.addPass(A),k&&C.addPass(k),M&&C.addPass(M),C.addPass(G),C.addPass(S),C.addPass(N),{shadowPass:r.shadowPass,gbuffer:f,geometryPass:m,worldGeometryPass:p,worldShadowPass:h,waterPass:_,ssaoPass:y,ssgiPass:I,lightingPass:b,atmospherePass:B,pointSpotShadowPass:U,pointSpotLightPass:R,taaPass:A,dofPass:k,bloomPass:M,rainPass:X,blockBreakPass:V,explosionPass:F,godrayPass:w,cloudPass:x,cloudShadowPass:g,blockHighlightPass:G,autoExposurePass:S,compositePass:N,graph:C,prevViewProj:null,currentWeatherEffect:E}}function bi(u,r){let e=0,t=1;for(;u>0;)t/=r,e+=t*(u%r),u=Math.floor(u/r);return e}function sd(u,r,e){const t=u.clone();for(let n=0;n<4;n++)t.data[n*4+0]+=r*t.data[n*4+3],t.data[n*4+1]+=e*t.data[n*4+3];return t}async function ld(){const u=document.getElementById("canvas");if(!u)throw new Error("No canvas element");const r=await $u(),e=r.playerName,t=r.mode==="network"?r.network:null,n=r.mode==="network"?r.welcome:null,o=r.mode==="local"?r.world:null,i=r.mode==="local"?r.storage:null;if(n!==null)console.log(`[crafty] connected as player ${n.playerId} "${e}" (${n.players.length} other(s) online, ${n.edits.length} replay edits)`);else if(o!==null){if((o.version??0)<1){let z=0;for(const K of o.edits)K.kind==="place"&&(K.x-=K.fx??0,K.y-=K.fy??0,K.z-=K.fz??0,z++);o.version=fn,console.log(`[crafty] migrated saved world to v${fn} (${z} place edits rewritten)`)}console.log(`[crafty] starting local world "${o.name}" (seed=${o.seed}, ${o.edits.length} edits to replay)`)}const a=await Jn.create(u,{enableErrorHandling:!1}),{device:l}=a,c=await tl(l,Qs(await(await fetch(ta)).arrayBuffer())),d=await Ks(l,c.gpuTexture),f=zs(l),p=await br.load(l,qt,na,ra,oa);await Il(qt);const h=await Ve.fromUrl(l,ia),_=await Ve.fromUrl(l,aa),m=await Ve.fromUrl(l,sa,{resizeWidth:256,resizeHeight:256,usage:7}),y=xl(qt,()=>{I.setFlashlightEnabled(!I.isFlashlightEnabled()),y.setFlashlightState(I.isFlashlightEnabled())}),g=Gl(),b=Tl(u,g.reticle),w=(n==null?void 0:n.seed)??(o==null?void 0:o.seed)??13,B=new Yn(w);Fl()&&(B.renderDistanceH=4,B.renderDistanceV=3);const x=new Map,U=new ca,R=new _e("Sun"),A=R.addComponent(new xi(new j(.3,-1,.5),j.one(),6,3));U.add(R);const I=El(u,U,B,a.width,a.height,m.gpuTexture,g.reticle,y.element),{cameraGO:k,camera:v,player:M,freeCamera:T}=I;M.onStep=P=>{const z=k.position;G.playStep(P,z,.5)},M.onLand=(P,z)=>{const K=k.position;K.y-=1.62,G.playLand(P,K,z)};const G=new $c,S=j.UP,N=Cl();Ll(u,N,B,()=>y.getSelected(),U);let E=!1;function X(){g.fps.style.display=E?"":"none",g.stats.style.display=E?"":"none",g.biome.style.display=E?"":"none",g.pos.style.display=E?"":"none",g.weather.style.display=E?"":"none"}X(),window.addEventListener("keydown",P=>{P.code==="KeyX"&&(E=!E,X()),P.code==="KeyF"&&!P.repeat&&y.setFlashlightState(I.isFlashlightEnabled())});const V=()=>{G.init(),u.removeEventListener("click",V),u.removeEventListener("touchend",V)};u.addEventListener("click",V),u.addEventListener("touchend",V),zl(u,{player:M,camera:T,getActive:()=>I.isPlayerMode()?"player":"camera",world:B,scene:U,blockInteraction:N,getSelectedBlock:()=>y.getSelected(),onLookDoubleTap:()=>I.toggleController(),onMenu:()=>b.open(),onFlashlightToggle:()=>{I.setFlashlightEnabled(!I.isFlashlightEnabled())}},()=>{M.usePointerLock=!1,M.autoJump=!0,T.usePointerLock=!1,y.flashlightButton.style.display="none"});const F={...Ju},H=tr.create(a,3);let C={shadowPass:H,currentWeatherEffect:Qe.None};async function Y(){C=await ad(a,C,F,p,c,h,_,d,f,B,x),v.aspect=a.width/a.height,Je.onExplode=(z,K,we)=>{var ae;(ae=C.explosionPass)==null||ae.burst({x:z,y:K,z:we},[1,.4,.05,1],80)}}await Y(),N.onBlockChip=(P,z,K,we)=>{var Ue;const[ae,pe,Ge]=Qo(we);(Ue=C.blockBreakPass)==null||Ue.burst({x:P+.5,y:z+.5,z:K+.5},[ae,pe,Ge,1],4)},N.onBlockBroken=(P,z,K,we)=>{var Ue;const[ae,pe,Ge]=Qo(we);(Ue=C.blockBreakPass)==null||Ue.burst({x:P+.5,y:z+.5,z:K+.5},[ae,pe,Ge,1],14)},gu(B,U,{duckBody:Fo(l),duckHead:Ho(l),duckBill:Wo(l),ducklingBody:Fo(l,.5),ducklingHead:Ho(l,.5),ducklingBill:Wo(l,.5),pigBody:jo(l,1),pigHead:qo(l,1),pigSnout:Yo(l,1),babyPigBody:jo(l,.55),babyPigHead:qo(l,.55),babyPigSnout:Yo(l,.55),creeperBody:cl(l),creeperHead:ul(l)}),Uu(B);const te=16,q=16,ne=16,re=(P,z,K)=>`${Math.floor(P/te)},${Math.floor(z/q)},${Math.floor(K/ne)}`,fe=new Map;function ie(P){return P.kind==="place"?[P.x+(P.fx??0),P.y+(P.fy??0),P.z+(P.fz??0)]:[P.x,P.y,P.z]}function O(P,z){return!(z.kind==="break"&&P.kind==="place")}function W(P){const[z,K,we]=ie(P),ae=re(z,K,we);let pe=fe.get(ae);pe===void 0&&(pe=[],fe.set(ae,pe));for(let Ge=pe.length-1;Ge>=0;Ge--){const[Ue,ct,Et]=ie(pe[Ge]);if(Ue===z&&ct===K&&Et===we){O(P,pe[Ge])&&pe.splice(Ge,1);break}}pe.push(P)}if(n!==null)for(const P of n.edits)W(P);if(o!==null)for(const P of o.edits)W(P);const ce=B.onChunkAdded;B.onChunkAdded=(P,z)=>{ce==null||ce(P,z);const K=`${Math.floor(P.globalPosition.x/te)},${Math.floor(P.globalPosition.y/q)},${Math.floor(P.globalPosition.z/ne)}`,we=fe.get(K);if(we!==void 0)for(const ae of we)Jo(ae.kind==="place"?{kind:"place",x:ae.x,y:ae.y,z:ae.z,fx:ae.fx??0,fy:ae.fy??0,fz:ae.fz??0,blockType:ae.blockType}:{kind:"break",x:ae.x,y:ae.y,z:ae.z},B,U)};const Q=new Map,le=Cu(l),ee=new Ou(u.parentElement??document.body),me=new Map;function Be(P,z){if(Q.has(P))return;const K=new Ru(P,z,U,le);Q.set(P,K),ee.add(P,z),me.set(P,new j)}function Oe(P){const z=Q.get(P);z!==void 0&&(z.dispose(),Q.delete(P)),ee.remove(P),me.delete(P)}if(n!==null)for(const P of n.players)Be(P.playerId,P.name),Q.get(P.playerId).setTargetTransform(P.x,P.y,P.z,P.yaw,P.pitch);t!==null?(t.setCallbacks({onPlayerJoin:(P,z)=>{console.log(`[crafty] +${z} (#${P})`),Be(P,z)},onPlayerLeave:P=>{console.log(`[crafty] -#${P}`),Oe(P)},onPlayerTransform:(P,z,K,we,ae,pe)=>{const Ge=Q.get(P);Ge!==void 0&&Ge.setTargetTransform(z,K,we,ae,pe)},onBlockEdit:P=>{W(P),Jo(P.kind==="place"?{kind:"place",x:P.x,y:P.y,z:P.z,fx:P.fx??0,fy:P.fy??0,fz:P.fz??0,blockType:P.blockType}:{kind:"break",x:P.x,y:P.y,z:P.z},B,U)}}),N.onLocalEdit=P=>{P.kind==="place"?(W({kind:"place",x:P.x,y:P.y,z:P.z,blockType:P.blockType,fx:P.fx,fy:P.fy,fz:P.fz}),t.sendBlockPlace(P.x,P.y,P.z,P.fx,P.fy,P.fz,P.blockType)):(W({kind:"break",x:P.x,y:P.y,z:P.z,blockType:0}),t.sendBlockBreak(P.x,P.y,P.z))},Je.onBlockDestroyed=(P,z,K)=>{W({kind:"break",x:P,y:z,z:K,blockType:0}),t.sendBlockBreak(P,z,K)}):o!==null&&(N.onLocalEdit=P=>{const z=P.kind==="place"?{kind:"place",x:P.x,y:P.y,z:P.z,blockType:P.blockType,fx:P.fx,fy:P.fy,fz:P.fz}:{kind:"break",x:P.x,y:P.y,z:P.z,blockType:0},[K,we,ae]=ie(z);for(let pe=o.edits.length-1;pe>=0;pe--){const[Ge,Ue,ct]=ie(o.edits[pe]);if(Ge===K&&Ue===we&&ct===ae){O(z,o.edits[pe])&&o.edits.splice(pe,1);break}}o.edits.push(z),W(z),Ye=!0},Je.onBlockDestroyed=(P,z,K)=>{const we={kind:"break",x:P,y:z,z:K,blockType:0};for(let ae=o.edits.length-1;ae>=0;ae--){const[pe,Ge,Ue]=ie(o.edits[ae]);if(pe===P&&Ge===z&&Ue===K){O(we,o.edits[ae])&&o.edits.splice(ae,1);break}}o.edits.push(we),W(we),Ye=!0});let Ye=!1;const ze=(n==null?void 0:n.lastPosition)??(o!==null&&o.lastPlayedAt>o.createdAt?o.player:null);if(ze!==null){k.position.set(ze.x,ze.y,ze.z),M.yaw=ze.yaw,M.pitch=ze.pitch,M.velY=0;const P=B.chunksPerFrame;B.chunksPerFrame=200,B.update(new j(ze.x,ze.y,ze.z),0),B.chunksPerFrame=P}else{const P=k.position.x,z=k.position.z,K=B.chunksPerFrame;B.chunksPerFrame=200,B.update(new j(P,50,z),0),B.chunksPerFrame=K;const we=B.getTopBlockY(P,z,200);we>0&&(k.position.y=we+1.62,M.velY=0)}const xr=document.createElement("div");xr.style.cssText="width:100%;height:1px;background:rgba(255,255,255,0.12)",b.card.appendChild(xr);const Ii="background:rgba(255,255,255,0.75);color:#000;border-bottom-color:rgba(100,200,255,0.6)",Oi="background:transparent;color:#000;border-bottom-color:transparent",Vt=document.createElement("div");Vt.style.cssText="display:flex;gap:0;width:100%;border-bottom:1px solid rgba(255,255,255,0.1)",b.card.appendChild(Vt);const Xe=document.createElement("button");Xe.textContent="Inventory",Xe.style.cssText=["padding:8px 24px","font-size:13px","font-family:ui-monospace,monospace","border:none","border-bottom:2px solid transparent","cursor:pointer","letter-spacing:0.06em","transition:background 0.15s","border-radius:6px 6px 0 0",Ii].join(";"),Vt.appendChild(Xe);const $e=document.createElement("button");$e.textContent="Settings",$e.style.cssText=["padding:8px 24px","font-size:13px","font-family:ui-monospace,monospace","border:none","border-bottom:2px solid transparent","cursor:pointer","letter-spacing:0.06em","transition:background 0.15s","border-radius:6px 6px 0 0",Oi].join(";"),Vt.appendChild($e);const zt=document.createElement("div");zt.style.cssText="display:flex;flex-direction:column;align-items:center;gap:12px;width:100%",b.card.appendChild(zt);const Ft=document.createElement("div");Ft.style.cssText="display:none;flex-direction:column;align-items:center;gap:10px;width:100%;margin-top:12px",b.card.appendChild(Ft);function Br(P){const z=P==="inv";zt.style.display=z?"flex":"none",Ft.style.display=z?"none":"flex",Xe.style.cssText=Xe.style.cssText.replace(/background:[^;]+;/,z?"background:rgba(255,255,255,0.75);":"background:transparent;"),Xe.style.cssText=Xe.style.cssText.replace(/color:[^;]+;/,"color:#000;"),Xe.style.borderBottomColor=z?"rgba(100,200,255,0.6)":"transparent",$e.style.cssText=$e.style.cssText.replace(/background:[^;]+;/,z?"background:transparent;":"background:rgba(255,255,255,0.72);"),$e.style.cssText=$e.style.cssText.replace(/color:[^;]+;/,"color:#000;"),$e.style.borderBottomColor=z?"transparent":"rgba(100,200,255,0.6)"}Xe.addEventListener("click",()=>Br("inv")),$e.addEventListener("click",()=>Br("set"));const Di=Sl(zt,qt,y.slots,()=>y.refresh(),y.getSelectedSlot,y.setSelectedSlot);Pl(F,async P=>{if(P!=="ssao"&&P!=="ssgi"&&P!=="shadows"&&P!=="aces"&&P!=="ao_dbg"&&P!=="shd_dbg"){if(P==="chunk_dbg"){C.worldGeometryPass.setDebugChunks(F.chunk_dbg);return}if(P!=="hdr"){if(P==="auto_exp"){C.autoExposurePass.enabled=F.auto_exp;return}if(P==="fog"){C.compositePass.depthFogEnabled=F.fog;return}if(P==="rain"){await Y();return}if(P==="clouds"){await Y();return}if(P==="debug_info"){E=F.debug_info,X();return}await Y()}}},Ft),y.setOnSelectionChanged(Di.refreshSlotHighlight);const Ze=document.createElement("button");Ze.textContent="Quit to Title",Ze.style.cssText=["padding:8px 28px","font-size:13px","font-family:ui-monospace,monospace","background: #3a1a1a","color:rgb(255,251,251)","border:1px solid #f88","border-radius:6px","cursor:pointer","letter-spacing:0.06em","transition:background 0.15s","margin-top:12px"].join(";"),Ze.addEventListener("mouseenter",()=>{Ze.style.background="#4a2424"}),Ze.addEventListener("mouseleave",()=>{Ze.style.background="#3a1a1a"});const Sr=()=>{document.pointerLockElement===u&&document.exitPointerLock(),location.reload()};Ze.addEventListener("click",Sr),Ze.addEventListener("touchend",P=>{P.preventDefault(),Sr()},{passive:!1}),b.card.insertBefore(Ze,b.card.children[2]),new ResizeObserver(async()=>{const P=Math.max(1,Math.round(u.clientWidth*devicePixelRatio)),z=Math.max(1,Math.round(u.clientHeight*devicePixelRatio));P===u.width&&z===u.height||(u.width=P,u.height=z,await Y())}).observe(u);let Pr=0,vn=0,Tr=-1/0,_t=(n==null?void 0:n.sunAngle)??(o==null?void 0:o.sunAngle)??Math.PI*.3,bn=0,Gr=0,Er=0,Mr=0;const Ar=B.getBiomeAt(k.position.x,k.position.y,k.position.z);let mt=oi(Ar),Gt=ii(),Ht=ri(mt);const Ur=Do(Ar);let yn=Ur.cloudBase,wn=Ur.cloudTop;window.addEventListener("keydown",P=>{P.code==="KeyO"&&(Gt=0)});const xn=new ku,tt=new j(0,0,-1),gt=new ue([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),Vi=5e3,zi=3e4,kr=.5,Fi=.005;let Cr=performance.now(),Lr=-1/0,Rr=k.position.x,Nr=k.position.y,Ir=k.position.z,Or=_t,Bn=!1;async function Hi(){try{const P=await createImageBitmap(u,{resizeWidth:160,resizeHeight:90,resizeQuality:"medium"}),z=new OffscreenCanvas(160,90),K=z.getContext("2d");return K===null?null:(K.drawImage(P,0,0),await z.convertToBlob({type:"image/jpeg",quality:.7}))}catch(P){return console.warn("[crafty] screenshot capture failed",P),null}}function Dr(P){if(o===null||i===null||Bn)return;o.player.x=k.position.x,o.player.y=k.position.y,o.player.z=k.position.z,o.player.yaw=M.yaw,o.player.pitch=M.pitch,o.sunAngle=_t,o.lastPlayedAt=Date.now(),o.version=fn,Rr=k.position.x,Nr=k.position.y,Ir=k.position.z,Or=_t,Ye=!1,Bn=!0;const z=()=>{i.save(o).catch(K=>{console.error("[crafty] save failed",K)}).finally(()=>{Bn=!1})};P?Hi().then(K=>{K!==null&&(o.screenshot=K),Lr=performance.now(),z()}):z()}if(o!==null&&i!==null){const P=()=>{Ye&&Dr(!1)};window.addEventListener("beforeunload",P),window.addEventListener("pagehide",P),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&P()})}async function Vr(P){var Qr,eo,to,no,ro;a.pushPassErrorScope("frame");const z=Math.min((P-Pr)/1e3,.1);Pr=P;const K=P-Tr>=1e3;K&&(Tr=P),z>0&&(vn+=(1/z-vn)*.1),_t+=z*.01,bn+=z,Er+=z*1.5,Mr+=z*.5;const we=.65,ae=(_t%(2*Math.PI)+2*Math.PI)%(2*Math.PI),pe=we*2*Math.PI,Ge=ae<pe?ae/pe*Math.PI:Math.PI+(ae-pe)/(2*Math.PI-pe)*Math.PI,Ue=Math.sin(Ge),ct=.25,Et=-Ue,Sn=Math.cos(Ge),Pn=Math.sqrt(ct*ct+Et*Et+Sn*Sn);A.direction.set(ct/Pn,Et/Pn,Sn/Pn);const Tn=Ue;A.intensity=Math.max(0,Tn)*6;const zr=Math.max(0,Tn);A.color.set(1,.8+.2*zr,.6+.4*zr),I.isPlayerMode()?M.update(k,z):T.update(k,z),Ml(P/1e3),Al(P/1e3);const J=v.position();{const be=I.isPlayerMode()?M.yaw:T.yaw,Ne=I.isPlayerMode()?M.pitch:T.pitch,nt=Math.cos(Ne);tt.x=-Math.sin(be)*nt,tt.y=-Math.sin(Ne),tt.z=-Math.cos(be)*nt,G.updateListener(J,tt,S)}Tt.playerPos.x=J.x,Tt.playerPos.y=J.y,Tt.playerPos.z=J.z,Je.playerPos.x=J.x,Je.playerPos.y=J.y,Je.playerPos.z=J.z,t!==null&&t.connected&&t.sendTransform(J.x,J.y,J.z,M.yaw,M.pitch);for(const be of Q.values())be.update(z);U.update(z),B.update(J,z);const Gn=B.getBiomeAt(J.x,J.y,J.z);if(Gt-=z,Gt<=0){mt=oi(Gn),Gt=ii();const be=eu(mt);be!==C.currentWeatherEffect&&(C.currentWeatherEffect=be,await Y());const Ne=tu(mt);C.rainPass&&Ne>0&&C.rainPass.setSpawnRate(Ne)}const Wi=ri(mt);Ht+=(Wi-Ht)*Math.min(1,.3*z);const Fr=Do(Gn);if(yn+=(Fr.cloudBase-yn)*Math.min(1,.3*z),wn+=(Fr.cloudTop-wn)*Math.min(1,.3*z),K){g.fps.textContent=`${vn.toFixed(0)} fps`;const be=(C.worldGeometryPass.triangles/1e3).toFixed(1);g.stats.textContent=`${C.worldGeometryPass.drawCalls} draws  ${be}k tris
${B.chunkCount} chunks  ${B.pendingChunks} pending`,g.biome.textContent=Se[Gn],g.weather.textContent=`${Qc(mt)}
clouds: ${Ht.toFixed(2)}
next: ${Gt.toFixed(0)}s`,g.pos.textContent=`X: ${J.x.toFixed(1)}  Y: ${J.y.toFixed(1)}  Z: ${J.z.toFixed(1)}`}const Hr=Gr%16+1,ji=(bi(Hr,2)-.5)*(2/a.width),qi=(bi(Hr,3)-.5)*(2/a.height),Le=v.viewProjectionMatrix(),Wr=sd(Le,ji,qi),He=v.viewMatrix(),Fe=v.projectionMatrix(),Re=Le.invert(),jr=Fe.invert(),qr=A.computeCascadeMatrices(v,128),Yr=U.collectMeshRenderers(),Yi=Yr.map(be=>{const Ne=be.gameObject.localToWorld();return{mesh:be.mesh,modelMatrix:Ne,normalMatrix:Ne.normalMatrix(),material:be.material}}),Xr=Yr.filter(be=>be.castShadow).map(be=>({mesh:be.mesh,modelMatrix:be.gameObject.localToWorld()}));H.setSceneSnapshot(Xr),H.updateScene(U,v,A,128),C.worldShadowPass.enabled=A.intensity>0,C.worldShadowPass.update(a,qr,J.x,J.z);const Wt=Math.max(0,Tn),Xi=[.02+.38*Wt,.03+.52*Wt,.05+.65*Wt],En={cloudBase:yn,cloudTop:wn,coverage:Ht,density:4,windOffset:[Er,Mr],anisotropy:.85,extinction:.25,ambientColor:Xi,exposure:1};C.cloudShadowPass&&C.cloudShadowPass.update(a,En,[J.x,J.z],128),(Qr=C.godrayPass)==null||Qr.updateCloudDensity(a,En),C.cloudPass&&(C.cloudPass.updateCamera(a,Re,J,v.near,v.far),C.cloudPass.updateLight(a,A.direction,A.color,A.intensity),C.cloudPass.updateSettings(a,En));const $r=U.getComponents(Kn),Zr=U.getComponents(Bi);C.pointSpotShadowPass.update($r,Zr,Xr),C.pointSpotLightPass.updateCamera(a,He,Fe,Le,Re,J,v.near,v.far),C.pointSpotLightPass.updateLights(a,$r,Zr),C.atmospherePass.update(a,Re,J,A.direction),C.geometryPass.setDrawItems(Yi),C.geometryPass.updateCamera(a,He,Fe,Wr,Re,J,v.near,v.far),C.worldGeometryPass.updateCamera(a,He,Fe,Wr,Re,J,v.near,v.far),C.waterPass.updateCamera(a,He,Fe,Le,Re,J,v.near,v.far),C.waterPass.updateTime(a,bn,Math.max(.01,Wt)),C.lightingPass.updateCamera(a,He,Fe,Le,Re,J,v.near,v.far),C.lightingPass.updateLight(a,A.direction,A.color,A.intensity,qr,F.shadows,F.shd_dbg),C.lightingPass.updateCloudShadow(a,C.cloudShadowPass?J.x:0,C.cloudShadowPass?J.z:0,128),C.ssaoPass.updateCamera(a,He,Fe,jr),C.ssaoPass.updateParams(a,1,.005,F.ssao?2:0),C.ssgiPass.enabled=F.ssgi,C.ssgiPass.updateSettings({strength:F.ssgi?1:0}),F.ssgi&&C.ssgiPass.updateCamera(a,He,Fe,jr,Re,C.prevViewProj??Le,J);const Kr=Math.cos(M.pitch);tt.x=-Math.sin(M.yaw)*Kr,tt.y=-Math.sin(M.pitch),tt.z=-Math.cos(M.yaw)*Kr;const jt=B.getBlockByRay(J,tt,16),Jr=!!(jt&&jt.position.sub(J).length()<=6);N.targetBlock=Jr?jt.position:null,N.targetHit=Jr?jt:null;const $i=N.targetBlock&&!he(B.getBlockType(N.targetBlock.x,N.targetBlock.y,N.targetBlock.z))?N.targetBlock:null;if(C.blockHighlightPass.setCrackStage(N.crackStage),C.blockHighlightPass.update(a,Le,$i),Rl(z,P,N,B,()=>y.getSelected(),U),C.rainPass){xn.update(J.x,J.z,B),C.rainPass.updateHeightmap(a,xn.data,J.x,J.z,xn.extent);const be=C.currentWeatherEffect===Qe.Snow?20:8;gt.data[12]=J.x,gt.data[13]=J.y+be,gt.data[14]=J.z,C.rainPass.update(a,z,He,Fe,Le,Re,J,v.near,v.far,gt)}(eo=C.blockBreakPass)==null||eo.update(a,z,He,Fe,Le,Re,J,v.near,v.far,gt),(to=C.explosionPass)==null||to.update(a,z,He,Fe,Le,Re,J,v.near,v.far,gt),(no=C.dofPass)==null||no.updateParams(a,8,75,3,v.near,v.far),(ro=C.godrayPass)==null||ro.updateParams(a);const Zi=he(B.getBlockType(Math.floor(J.x),Math.floor(J.y),Math.floor(J.z))),Ki={x:-A.direction.x,y:-A.direction.y,z:-A.direction.z};if(C.compositePass.updateParams(a,Zi,bn,F.aces,F.ao_dbg,F.hdr),C.compositePass.updateStars(a,Re,J,Ki),C.autoExposurePass.update(a,z),C.taaPass.updateCamera(a,Re,C.prevViewProj??Le),Q.size>0){for(const[be,Ne]of Q){const nt=me.get(be);nt!==void 0&&Ne.headWorldPosition(nt)}ee.update(Le,J,u.clientWidth,u.clientHeight,me)}if(C.prevViewProj=Le,Gr++,await C.graph.execute(a),await a.popPassErrorScope("frame"),o!==null&&i!==null){const be=k.position.x-Rr,Ne=k.position.y-Nr,nt=k.position.z-Ir;be*be+Ne*Ne+nt*nt>kr*kr&&(Ye=!0),Math.abs(_t-Or)>Fi&&(Ye=!0);const Mn=performance.now();if(Ye&&Mn-Cr>=Vi){Cr=Mn;const Ji=Mn-Lr>=zi;Dr(Ji)}}requestAnimationFrame(Vr)}requestAnimationFrame(Vr)}ld().catch(u=>{document.body.innerHTML=`<pre style="color:red;padding:1rem">${u}</pre>`,console.error(u)});export{rr as A,or as B,ir as C,pr as D,pn as G,nr as L,Rt as P,Jn as R,hr as S,sr as T,pt as W,qn as a,lr as b,ar as c,ur as d,dr as e,cr as f,vr as g,mr as h,Pe as i,_r as j,tr as k,fr as l,gr as m};
