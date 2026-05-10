var Ti=Object.defineProperty;var Mi=(u,n,e)=>n in u?Ti(u,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):u[n]=e;var s=(u,n,e)=>Mi(u,typeof n!="symbol"?n+"":n,e);(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))t(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&t(i)}).observe(document,{childList:!0,subtree:!0});function e(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function t(r){if(r.ep)return;r.ep=!0;const o=e(r);fetch(r.href,o)}})();const Ai=""+new URL("clear_sky-CyjsjiVR.hdr",import.meta.url).href,bn=""+new URL("simple_block_atlas-B-7juoTN.png",import.meta.url).href,Ei=""+new URL("simple_block_atlas_normal-BdCvGD-K.png",import.meta.url).href,Ui=""+new URL("simple_block_atlas_mer-C_Oa_Ink.png",import.meta.url).href,Ci=""+new URL("simple_block_atlas_heightmap-BOV6qQJl.png",import.meta.url).href,ki=""+new URL("waterDUDV-CGfbcllR.png",import.meta.url).href,Li="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAgCAYAAADaInAlAAAA4klEQVR4Ae2UQQ4CIRAEGeAvnn2H/3+PDqBuXLnvoYqEAMvApptKx+3+eJYrW0QpNXvUNdYc57exrjkd+/u9o+58/r8+xj+yr/t+5/G+/7P3rc361lr2Onvva5zrzbyPun7Un+v259uUcdUTpFM2sgMCQH791C4AAgB3AC7fBBAAuANw+SaAAMAdgMs3AQQA7gBcvgkgAHAH4PJNAAGAOwCXbwIIANwBuHwTQADgDsDlmwACAHcALt8EEAC4A3D5JoAAwB2AyzcBBADuAFy+CSAAcAfg8k0AAYA7AJdvAsABeAEiUwM8dIJUQAAAAABJRU5ErkJggg==",Ri=""+new URL("flashlight-C64SqrUS.jpg",import.meta.url).href;class V{constructor(n=0,e=0){s(this,"x");s(this,"y");this.x=n,this.y=e}set(n,e){return this.x=n,this.y=e,this}clone(){return new V(this.x,this.y)}add(n){return new V(this.x+n.x,this.y+n.y)}sub(n){return new V(this.x-n.x,this.y-n.y)}scale(n){return new V(this.x*n,this.y*n)}dot(n){return this.x*n.x+this.y*n.y}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.lengthSq())}normalize(){const n=this.length();return n>0?this.scale(1/n):new V}toArray(){return[this.x,this.y]}static zero(){return new V(0,0)}static one(){return new V(1,1)}}const te=class te{constructor(n=0,e=0,t=0){s(this,"x");s(this,"y");s(this,"z");this.x=n,this.y=e,this.z=t}set(n,e,t){return this.x=n,this.y=e,this.z=t,this}clone(){return new te(this.x,this.y,this.z)}negate(){return new te(-this.x,-this.y,-this.z)}add(n){return new te(this.x+n.x,this.y+n.y,this.z+n.z)}sub(n){return new te(this.x-n.x,this.y-n.y,this.z-n.z)}scale(n){return new te(this.x*n,this.y*n,this.z*n)}mul(n){return new te(this.x*n.x,this.y*n.y,this.z*n.z)}dot(n){return this.x*n.x+this.y*n.y+this.z*n.z}cross(n){return new te(this.y*n.z-this.z*n.y,this.z*n.x-this.x*n.z,this.x*n.y-this.y*n.x)}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.lengthSq())}normalize(){const n=this.length();return n>0?this.scale(1/n):new te}lerp(n,e){return new te(this.x+(n.x-this.x)*e,this.y+(n.y-this.y)*e,this.z+(n.z-this.z)*e)}toArray(){return[this.x,this.y,this.z]}static zero(){return new te(0,0,0)}static one(){return new te(1,1,1)}static up(){return new te(0,1,0)}static down(){return new te(0,-1,0)}static forward(){return new te(0,0,-1)}static backward(){return new te(0,0,1)}static right(){return new te(1,0,0)}static left(){return new te(-1,0,0)}static fromArray(n,e=0){return new te(n[e],n[e+1],n[e+2])}};s(te,"ZERO",new te(0,0,0)),s(te,"ONE",new te(1,1,1)),s(te,"UP",new te(0,1,0)),s(te,"DOWN",new te(0,-1,0)),s(te,"FORWARD",new te(0,0,-1)),s(te,"BACKWARD",new te(0,0,1)),s(te,"RIGHT",new te(1,0,0)),s(te,"LEFT",new te(-1,0,0));let j=te;class Ve{constructor(n=0,e=0,t=0,r=0){s(this,"x");s(this,"y");s(this,"z");s(this,"w");this.x=n,this.y=e,this.z=t,this.w=r}set(n,e,t,r){return this.x=n,this.y=e,this.z=t,this.w=r,this}clone(){return new Ve(this.x,this.y,this.z,this.w)}add(n){return new Ve(this.x+n.x,this.y+n.y,this.z+n.z,this.w+n.w)}sub(n){return new Ve(this.x-n.x,this.y-n.y,this.z-n.z,this.w-n.w)}scale(n){return new Ve(this.x*n,this.y*n,this.z*n,this.w*n)}dot(n){return this.x*n.x+this.y*n.y+this.z*n.z+this.w*n.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.lengthSq())}toArray(){return[this.x,this.y,this.z,this.w]}static zero(){return new Ve(0,0,0,0)}static one(){return new Ve(1,1,1,1)}static fromArray(n,e=0){return new Ve(n[e],n[e+1],n[e+2],n[e+3])}}class ae{constructor(n){s(this,"data");this.data=new Float32Array(16),n&&this.data.set(n)}clone(){return new ae(this.data)}get(n,e){return this.data[n*4+e]}set(n,e,t){this.data[n*4+e]=t}multiply(n){const e=this.data,t=n.data,r=new Float32Array(16);for(let o=0;o<4;o++)for(let i=0;i<4;i++)r[o*4+i]=e[0*4+i]*t[o*4+0]+e[1*4+i]*t[o*4+1]+e[2*4+i]*t[o*4+2]+e[3*4+i]*t[o*4+3];return new ae(r)}transformPoint(n){const e=this.data,t=e[0]*n.x+e[4]*n.y+e[8]*n.z+e[12],r=e[1]*n.x+e[5]*n.y+e[9]*n.z+e[13],o=e[2]*n.x+e[6]*n.y+e[10]*n.z+e[14],i=e[3]*n.x+e[7]*n.y+e[11]*n.z+e[15];return new j(t/i,r/i,o/i)}transformDirection(n){const e=this.data;return new j(e[0]*n.x+e[4]*n.y+e[8]*n.z,e[1]*n.x+e[5]*n.y+e[9]*n.z,e[2]*n.x+e[6]*n.y+e[10]*n.z)}transformVec4(n){const e=this.data;return new Ve(e[0]*n.x+e[4]*n.y+e[8]*n.z+e[12]*n.w,e[1]*n.x+e[5]*n.y+e[9]*n.z+e[13]*n.w,e[2]*n.x+e[6]*n.y+e[10]*n.z+e[14]*n.w,e[3]*n.x+e[7]*n.y+e[11]*n.z+e[15]*n.w)}transpose(){const n=this.data;return new ae([n[0],n[4],n[8],n[12],n[1],n[5],n[9],n[13],n[2],n[6],n[10],n[14],n[3],n[7],n[11],n[15]])}invert(){const n=this.data,e=new Float32Array(16),t=n[0],r=n[1],o=n[2],i=n[3],a=n[4],l=n[5],c=n[6],d=n[7],p=n[8],f=n[9],h=n[10],_=n[11],m=n[12],b=n[13],y=n[14],v=n[15],w=t*l-r*a,B=t*c-o*a,x=t*d-i*a,C=r*c-o*l,L=r*d-i*l,U=o*d-i*c,I=p*b-f*m,E=p*y-h*m,g=p*v-_*m,k=f*y-h*b,P=f*v-_*b,M=h*v-_*y;let S=w*M-B*P+x*k+C*g-L*E+U*I;return S===0?ae.identity():(S=1/S,e[0]=(l*M-c*P+d*k)*S,e[1]=(o*P-r*M-i*k)*S,e[2]=(b*U-y*L+v*C)*S,e[3]=(h*L-f*U-_*C)*S,e[4]=(c*g-a*M-d*E)*S,e[5]=(t*M-o*g+i*E)*S,e[6]=(y*x-m*U-v*B)*S,e[7]=(p*U-h*x+_*B)*S,e[8]=(a*P-l*g+d*I)*S,e[9]=(r*g-t*P-i*I)*S,e[10]=(m*L-b*x+v*w)*S,e[11]=(f*x-p*L-_*w)*S,e[12]=(l*E-a*k-c*I)*S,e[13]=(t*k-r*E+o*I)*S,e[14]=(b*B-m*C-y*w)*S,e[15]=(p*C-f*B+h*w)*S,new ae(e))}normalMatrix(){const n=this.data,e=n[0],t=n[1],r=n[2],o=n[4],i=n[5],a=n[6],l=n[8],c=n[9],d=n[10],p=d*i-a*c,f=-d*o+a*l,h=c*o-i*l;let _=e*p+t*f+r*h;if(_===0)return ae.identity();_=1/_;const m=new Float32Array(16);return m[0]=p*_,m[4]=(-d*t+r*c)*_,m[8]=(a*t-r*i)*_,m[1]=f*_,m[5]=(d*e-r*l)*_,m[9]=(-a*e+r*o)*_,m[2]=h*_,m[6]=(-c*e+t*l)*_,m[10]=(i*e-t*o)*_,m[15]=1,new ae(m)}static identity(){return new ae([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}static translation(n,e,t){return new ae([1,0,0,0,0,1,0,0,0,0,1,0,n,e,t,1])}static scale(n,e,t){return new ae([n,0,0,0,0,e,0,0,0,0,t,0,0,0,0,1])}static rotationX(n){const e=Math.cos(n),t=Math.sin(n);return new ae([1,0,0,0,0,e,t,0,0,-t,e,0,0,0,0,1])}static rotationY(n){const e=Math.cos(n),t=Math.sin(n);return new ae([e,0,-t,0,0,1,0,0,t,0,e,0,0,0,0,1])}static rotationZ(n){const e=Math.cos(n),t=Math.sin(n);return new ae([e,t,0,0,-t,e,0,0,0,0,1,0,0,0,0,1])}static fromQuaternion(n,e,t,r){const o=n+n,i=e+e,a=t+t,l=n*o,c=e*o,d=e*i,p=t*o,f=t*i,h=t*a,_=r*o,m=r*i,b=r*a;return new ae([1-d-h,c+b,p-m,0,c-b,1-l-h,f+_,0,p+m,f-_,1-l-d,0,0,0,0,1])}static perspective(n,e,t,r){const o=1/Math.tan(n/2),i=1/(t-r);return new ae([o/e,0,0,0,0,o,0,0,0,0,r*i,-1,0,0,r*t*i,0])}static orthographic(n,e,t,r,o,i){const a=1/(n-e),l=1/(t-r),c=1/(o-i);return new ae([-2*a,0,0,0,0,-2*l,0,0,0,0,c,0,(n+e)*a,(r+t)*l,o*c,1])}static lookAt(n,e,t){const r=e.sub(n).normalize(),o=r.cross(t).normalize(),i=o.cross(r);return new ae([o.x,i.x,-r.x,0,o.y,i.y,-r.y,0,o.z,i.z,-r.z,0,-o.dot(n),-i.dot(n),r.dot(n),1])}static trs(n,e,t,r,o,i){const l=ae.fromQuaternion(e,t,r,o).data;return new ae([i.x*l[0],i.x*l[1],i.x*l[2],0,i.y*l[4],i.y*l[5],i.y*l[6],0,i.z*l[8],i.z*l[9],i.z*l[10],0,n.x,n.y,n.z,1])}}class _e{constructor(n=0,e=0,t=0,r=1){s(this,"x");s(this,"y");s(this,"z");s(this,"w");this.x=n,this.y=e,this.z=t,this.w=r}clone(){return new _e(this.x,this.y,this.z,this.w)}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.lengthSq())}normalize(){const n=this.length();return n>0?new _e(this.x/n,this.y/n,this.z/n,this.w/n):_e.identity()}conjugate(){return new _e(-this.x,-this.y,-this.z,this.w)}multiply(n){const e=this.x,t=this.y,r=this.z,o=this.w,i=n.x,a=n.y,l=n.z,c=n.w;return new _e(o*i+e*c+t*l-r*a,o*a-e*l+t*c+r*i,o*l+e*a-t*i+r*c,o*c-e*i-t*a-r*l)}rotateVec3(n){const e=this.x,t=this.y,r=this.z,o=this.w,i=o*n.x+t*n.z-r*n.y,a=o*n.y+r*n.x-e*n.z,l=o*n.z+e*n.y-t*n.x,c=-e*n.x-t*n.y-r*n.z;return new j(i*o+c*-e+a*-r-l*-t,a*o+c*-t+l*-e-i*-r,l*o+c*-r+i*-t-a*-e)}toMat4(){return ae.fromQuaternion(this.x,this.y,this.z,this.w)}slerp(n,e){let t=this.x*n.x+this.y*n.y+this.z*n.z+this.w*n.w,r=n.x,o=n.y,i=n.z,a=n.w;if(t<0&&(t=-t,r=-r,o=-o,i=-i,a=-a),t>=1)return this.clone();const l=Math.acos(t),c=Math.sqrt(1-t*t);if(Math.abs(c)<.001)return new _e(this.x*.5+r*.5,this.y*.5+o*.5,this.z*.5+i*.5,this.w*.5+a*.5);const d=Math.sin((1-e)*l)/c,p=Math.sin(e*l)/c;return new _e(this.x*d+r*p,this.y*d+o*p,this.z*d+i*p,this.w*d+a*p)}static identity(){return new _e(0,0,0,1)}static fromAxisAngle(n,e){const t=Math.sin(e/2),r=n.normalize();return new _e(r.x*t,r.y*t,r.z*t,Math.cos(e/2))}static fromEuler(n,e,t){const r=Math.cos(n/2),o=Math.sin(n/2),i=Math.cos(e/2),a=Math.sin(e/2),l=Math.cos(t/2),c=Math.sin(t/2);return new _e(o*i*l+r*a*c,r*a*l-o*i*c,r*i*c+o*a*l,r*i*l-o*a*c)}}const lt=new Uint8Array([23,125,161,52,103,117,70,37,247,101,203,169,124,126,44,123,152,238,145,45,171,114,253,10,192,136,4,157,249,30,35,72,175,63,77,90,181,16,96,111,133,104,75,162,93,56,66,240,8,50,84,229,49,210,173,239,141,1,87,18,2,198,143,57,225,160,58,217,168,206,245,204,199,6,73,60,20,230,211,233,94,200,88,9,74,155,33,15,219,130,226,202,83,236,42,172,165,218,55,222,46,107,98,154,109,67,196,178,127,158,13,243,65,79,166,248,25,224,115,80,68,51,184,128,232,208,151,122,26,212,105,43,179,213,235,148,146,89,14,195,28,78,112,76,250,47,24,251,140,108,186,190,228,170,183,139,39,188,244,246,132,48,119,144,180,138,134,193,82,182,120,121,86,220,209,3,91,241,149,85,205,150,113,216,31,100,41,164,177,214,153,231,38,71,185,174,97,201,29,95,7,92,54,254,191,118,34,221,131,11,163,99,234,81,227,147,156,176,17,142,69,12,110,62,27,255,0,194,59,116,242,252,19,21,187,53,207,129,64,135,61,40,167,237,102,223,106,159,197,189,215,137,36,32,22,5,23,125,161,52,103,117,70,37,247,101,203,169,124,126,44,123,152,238,145,45,171,114,253,10,192,136,4,157,249,30,35,72,175,63,77,90,181,16,96,111,133,104,75,162,93,56,66,240,8,50,84,229,49,210,173,239,141,1,87,18,2,198,143,57,225,160,58,217,168,206,245,204,199,6,73,60,20,230,211,233,94,200,88,9,74,155,33,15,219,130,226,202,83,236,42,172,165,218,55,222,46,107,98,154,109,67,196,178,127,158,13,243,65,79,166,248,25,224,115,80,68,51,184,128,232,208,151,122,26,212,105,43,179,213,235,148,146,89,14,195,28,78,112,76,250,47,24,251,140,108,186,190,228,170,183,139,39,188,244,246,132,48,119,144,180,138,134,193,82,182,120,121,86,220,209,3,91,241,149,85,205,150,113,216,31,100,41,164,177,214,153,231,38,71,185,174,97,201,29,95,7,92,54,254,191,118,34,221,131,11,163,99,234,81,227,147,156,176,17,142,69,12,110,62,27,255,0,194,59,116,242,252,19,21,187,53,207,129,64,135,61,40,167,237,102,223,106,159,197,189,215,137,36,32,22,5]),Ye=new Uint8Array([7,9,5,0,11,1,6,9,3,9,11,1,8,10,4,7,8,6,1,5,3,10,9,10,0,8,4,1,5,2,7,8,7,11,9,10,1,0,4,7,5,0,11,6,1,4,2,8,8,10,4,9,9,2,5,7,9,1,7,2,2,6,11,5,5,4,6,9,0,1,1,0,7,6,9,8,4,10,3,1,2,8,8,9,10,11,5,11,11,2,6,10,3,4,2,4,9,10,3,2,6,3,6,10,5,3,4,10,11,2,9,11,1,11,10,4,9,4,11,0,4,11,4,0,0,0,7,6,10,4,1,3,11,5,3,4,2,9,1,3,0,1,8,0,6,7,8,7,0,4,6,10,8,2,3,11,11,8,0,2,4,8,3,0,0,10,6,1,2,2,4,5,6,0,1,3,11,9,5,5,9,6,9,8,3,8,1,8,9,6,9,11,10,7,5,6,5,9,1,3,7,0,2,10,11,2,6,1,3,11,7,7,2,1,7,3,0,8,1,1,5,0,6,10,11,11,0,2,7,0,10,8,3,5,7,1,11,1,0,7,9,0,11,5,10,3,2,3,5,9,7,9,8,4,6,5,7,9,5,0,11,1,6,9,3,9,11,1,8,10,4,7,8,6,1,5,3,10,9,10,0,8,4,1,5,2,7,8,7,11,9,10,1,0,4,7,5,0,11,6,1,4,2,8,8,10,4,9,9,2,5,7,9,1,7,2,2,6,11,5,5,4,6,9,0,1,1,0,7,6,9,8,4,10,3,1,2,8,8,9,10,11,5,11,11,2,6,10,3,4,2,4,9,10,3,2,6,3,6,10,5,3,4,10,11,2,9,11,1,11,10,4,9,4,11,0,4,11,4,0,0,0,7,6,10,4,1,3,11,5,3,4,2,9,1,3,0,1,8,0,6,7,8,7,0,4,6,10,8,2,3,11,11,8,0,2,4,8,3,0,0,10,6,1,2,2,4,5,6,0,1,3,11,9,5,5,9,6,9,8,3,8,1,8,9,6,9,11,10,7,5,6,5,9,1,3,7,0,2,10,11,2,6,1,3,11,7,7,2,1,7,3,0,8,1,1,5,0,6,10,11,11,0,2,7,0,10,8,3,5,7,1,11,1,0,7,9,0,11,5,10,3,2,3,5,9,7,9,8,4,6,5]),yn=new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]);function wn(u){const n=u|0;return u<n?n-1:n}function Xe(u,n,e,t){const r=u*3;return yn[r]*n+yn[r+1]*e+yn[r+2]*t}function xn(u){return((u*6-15)*u+10)*u*u*u}function On(u,n,e,t,r,o,i){const a=t-1&255,l=r-1&255,c=o-1&255,d=wn(u),p=wn(n),f=wn(e),h=d&a,_=d+1&a,m=p&l,b=p+1&l,y=f&c,v=f+1&c,w=u-d,B=xn(w),x=n-p,C=xn(x),L=e-f,U=xn(L),I=lt[h+i],E=lt[_+i],g=lt[I+m],k=lt[I+b],P=lt[E+m],M=lt[E+b],S=Xe(Ye[g+y],w,x,L),N=Xe(Ye[g+v],w,x,L-1),G=Xe(Ye[k+y],w,x-1,L),H=Xe(Ye[k+v],w,x-1,L-1),O=Xe(Ye[P+y],w-1,x,L),T=Xe(Ye[P+v],w-1,x,L-1),z=Xe(Ye[M+y],w-1,x-1,L),ie=Xe(Ye[M+v],w-1,x-1,L-1),le=S+(N-S)*U,re=G+(H-G)*U,oe=O+(T-O)*U,Z=z+(ie-z)*U,Q=le+(re-le)*C,D=oe+(Z-oe)*C;return Q+(D-Q)*B}function ke(u,n,e,t,r,o,i){return On(u,n,e,t,r,o,i&255)}function Qo(u,n,e,t,r,o,i){let a=1,l=1,c=.5,d=0;for(let p=0;p<i;p++){let f=On(u*a,n*a,e*a,0,0,0,p&255);f=o-Math.abs(f),f=f*f,d+=f*c*l,l=f,a*=t,c*=r}return d}function Wr(u,n,e,t,r,o){let i=1,a=1,l=0;for(let c=0;c<o;c++)l+=Math.abs(On(u*i,n*i,e*i,0,0,0,c&255)*a),i*=t,a*=r;return l}const en=class en extends Uint32Array{constructor(e){super(6);s(this,"_seed");this._seed=0,this.seed=e??Date.now()}get seed(){return this[0]}set seed(e){this._seed=e,this[0]=e,this[1]=this[0]*1812433253+1>>>0,this[2]=this[1]*1812433253+1>>>0,this[3]=this[2]*1812433253+1>>>0,this[4]=0,this[5]=0}reset(){this.seed=this._seed}randomUint32(){let e=this[3];const t=this[0];return this[3]=this[2],this[2]=this[1],this[1]=t,e^=e>>>2,e^=e<<1,e^=t^t<<4,this[0]=e,this[4]=this[4]+362437>>>0,this[5]=e+this[4]>>>0,this[5]}randomFloat(e,t){const r=(this.randomUint32()&8388607)*11920930376163766e-23;return e===void 0?r:r*((t??1)-e)+e}randomDouble(e,t){const r=this.randomUint32()>>>5,o=this.randomUint32()>>>6,i=(r*67108864+o)*(1/9007199254740992);return e===void 0?i:i*((t??1)-e)+e}};s(en,"global",new en);let Ae=en;class et{constructor(){s(this,"gameObject")}onAttach(){}onDetach(){}update(n){}}class ge{constructor(n="GameObject"){s(this,"name");s(this,"position");s(this,"rotation");s(this,"scale");s(this,"children",[]);s(this,"parent",null);s(this,"_components",[]);this.name=n,this.position=j.zero(),this.rotation=_e.identity(),this.scale=j.one()}addComponent(n){return n.gameObject=this,this._components.push(n),n.onAttach(),n}getComponent(n){for(const e of this._components)if(e instanceof n)return e;return null}getComponents(n){return this._components.filter(e=>e instanceof n)}removeComponent(n){const e=this._components.indexOf(n);e!==-1&&(n.onDetach(),this._components.splice(e,1))}addChild(n){n.parent=this,this.children.push(n)}localToWorld(){const n=ae.trs(this.position,this.rotation.x,this.rotation.y,this.rotation.z,this.rotation.w,this.scale);return this.parent?this.parent.localToWorld().multiply(n):n}update(n){for(const e of this._components)e.update(n);for(const e of this.children)e.update(n)}}class ei extends et{constructor(e=60,t=.1,r=1e3,o=16/9){super();s(this,"fov");s(this,"near");s(this,"far");s(this,"aspect");this.fov=e*(Math.PI/180),this.near=t,this.far=r,this.aspect=o}projectionMatrix(){return ae.perspective(this.fov,this.aspect,this.near,this.far)}viewMatrix(){return this.gameObject.localToWorld().invert()}viewProjectionMatrix(){return this.projectionMatrix().multiply(this.viewMatrix())}position(){const e=this.gameObject.localToWorld();return new j(e.data[12],e.data[13],e.data[14])}frustumCornersWorld(){const e=this.viewProjectionMatrix().invert();return[[-1,-1,0],[1,-1,0],[-1,1,0],[1,1,0],[-1,-1,1],[1,-1,1],[-1,1,1],[1,1,1]].map(([r,o,i])=>e.transformPoint(new j(r,o,i)))}}class ti extends et{constructor(e=new j(.3,-1,.5),t=j.one(),r=1,o=3){super();s(this,"direction");s(this,"color");s(this,"intensity");s(this,"numCascades");this.direction=e.normalize(),this.color=t,this.intensity=r,this.numCascades=o}computeCascadeMatrices(e,t){const r=t??e.far,o=this._computeSplitDepths(e.near,r,this.numCascades),i=[];for(let a=0;a<this.numCascades;a++){const l=a===0?e.near:o[a-1],c=o[a],d=this._frustumCornersForSplit(e,l,c),p=d.reduce((P,M)=>P.add(M),j.ZERO).scale(1/8),f=this.direction.normalize(),h=ae.lookAt(p.sub(f),p,j.UP),_=2048;let m=0;for(const P of d)m=Math.max(m,P.sub(p).length());let b=2*m/_;m=Math.ceil(m/b)*b,m*=_/(_-2),b=2*m/_;let y=1/0,v=-1/0;for(const P of d){const M=h.transformPoint(P);y=Math.min(y,M.z),v=Math.max(v,M.z)}const w=Math.min((v-y)*.25,64);y-=w,v+=w;let B=ae.orthographic(-m,m,-m,m,-v,-y);const C=B.multiply(h).transformPoint(p),L=C.x*.5+.5,U=.5-C.y*.5,I=Math.round(L*_)/_,E=Math.round(U*_)/_,g=(I-L)*2,k=-(E-U)*2;B.set(3,0,B.get(3,0)+g),B.set(3,1,B.get(3,1)+k),i.push({lightViewProj:B.multiply(h),splitFar:c,depthRange:v-y,texelWorldSize:b})}return i}_computeSplitDepths(e,t,r){const i=[];for(let a=1;a<=r;a++){const l=e+(t-e)*(a/r),c=e*Math.pow(t/e,a/r);i.push(.75*c+(1-.75)*l)}return i}_frustumCornersForSplit(e,t,r){const o=e.near,i=e.far;e.near=t,e.far=r;const a=e.frustumCornersWorld();return e.near=o,e.far=i,a}}var Bt=(u=>(u.Forward="forward",u.Geometry="geometry",u.SkinnedGeometry="skinnedGeometry",u))(Bt||{});class Ni{constructor(){s(this,"transparent",!1)}}class Te extends et{constructor(e,t){super();s(this,"mesh");s(this,"material");s(this,"castShadow",!0);this.mesh=e,this.material=t}}class Ii{constructor(){s(this,"gameObjects",[])}add(n){this.gameObjects.push(n)}remove(n){const e=this.gameObjects.indexOf(n);e!==-1&&this.gameObjects.splice(e,1)}update(n){for(const e of this.gameObjects)e.update(n)}findCamera(){for(const n of this.gameObjects){const e=n.getComponent(ei);if(e)return e}return null}findDirectionalLight(){for(const n of this.gameObjects){const e=n.getComponent(ti);if(e)return e}return null}collectMeshRenderers(){const n=[];for(const e of this.gameObjects)this._collectMeshRenderersRecursive(e,n);return n}_collectMeshRenderersRecursive(n,e){const t=n.getComponent(Te);t&&e.push(t);for(const r of n.children)this._collectMeshRenderersRecursive(r,e)}getComponents(n){const e=[];for(const t of this.gameObjects){const r=t.getComponent(n);r&&e.push(r)}return e}}const Oi=[new j(1,0,0),new j(-1,0,0),new j(0,1,0),new j(0,-1,0),new j(0,0,1),new j(0,0,-1)],Di=[new j(0,-1,0),new j(0,-1,0),new j(0,0,1),new j(0,0,-1),new j(0,-1,0),new j(0,-1,0)];class Dn extends et{constructor(){super(...arguments);s(this,"color",j.one());s(this,"intensity",1);s(this,"radius",10);s(this,"castShadow",!1)}worldPosition(){return this.gameObject.localToWorld().transformPoint(j.ZERO)}cubeFaceViewProjs(e=.05){const t=this.worldPosition(),r=ae.perspective(Math.PI/2,1,e,this.radius),o=new Array(6);for(let i=0;i<6;i++)o[i]=r.multiply(ae.lookAt(t,t.add(Oi[i]),Di[i]));return o}}class ni extends et{constructor(){super(...arguments);s(this,"color",j.one());s(this,"intensity",1);s(this,"range",20);s(this,"innerAngle",15);s(this,"outerAngle",30);s(this,"castShadow",!1);s(this,"projectionTexture",null)}worldPosition(){return this.gameObject.localToWorld().transformPoint(j.ZERO)}worldDirection(){return this.gameObject.localToWorld().transformDirection(j.FORWARD).normalize()}lightViewProj(e=.1){const t=this.worldPosition(),r=this.worldDirection(),o=Math.abs(r.y)>.99?j.RIGHT:j.UP,i=ae.lookAt(t,t.add(r),o);return ae.perspective(this.outerAngle*2*Math.PI/180,1,e,this.range).multiply(i)}}const Vi=new j(0,1,0);class zi extends et{constructor(e){super();s(this,"_world");s(this,"_state","idle");s(this,"_timer",0);s(this,"_targetX",0);s(this,"_targetZ",0);s(this,"_hasTarget",!1);s(this,"_velY",0);s(this,"_yaw",0);s(this,"_headGO",null);s(this,"_headBaseY",0);s(this,"_bobPhase");this._world=e,this._timer=1+Math.random()*5,this._yaw=Math.random()*Math.PI*2,this._bobPhase=Math.random()*Math.PI*2}onAttach(){for(const e of this.gameObject.children)if(e.name==="Pig.Head"){this._headGO=e,this._headBaseY=e.position.y;break}}update(e){const t=this.gameObject,r=t.position.x,o=t.position.z;this._velY-=9.8*e,t.position.y+=this._velY*e;const i=this._world.getTopBlockY(Math.floor(r),Math.floor(o),Math.ceil(t.position.y)+4);switch(i>0&&t.position.y<=i+.1&&(t.position.y=i,this._velY=0),this._state){case"idle":{this._timer-=e,this._timer<=0&&this._pickWanderTarget();break}case"wander":{if(this._timer-=e,!this._hasTarget||this._timer<=0){this._enterIdle();break}const a=this._targetX-r,l=this._targetZ-o,c=a*a+l*l;if(c<.25){this._enterIdle();break}const d=Math.sqrt(c);t.position.x+=a/d*1.2*e,t.position.z+=l/d*1.2*e,this._yaw=Math.atan2(-(a/d),-(l/d));break}}if(t.rotation=_e.fromAxisAngle(Vi,this._yaw),this._headGO){this._bobPhase+=e*(this._state==="wander"?4:1.5);const a=this._state==="wander"?.014:.005;this._headGO.position.y=this._headBaseY+Math.sin(this._bobPhase)*a}}_enterIdle(){this._state="idle",this._hasTarget=!1,this._timer=3+Math.random()*5}_pickWanderTarget(){const e=this.gameObject,t=Math.random()*Math.PI*2,r=4+Math.random()*8;this._targetX=e.position.x+Math.cos(t)*r,this._targetZ=e.position.z+Math.sin(t)*r,this._hasTarget=!0,this._state="wander",this._timer=8+Math.random()*7}}const Fi=new j(0,1,0);class Hi extends et{constructor(e,t){super();s(this,"_parent");s(this,"_world");s(this,"_velY",0);s(this,"_yaw",0);s(this,"_headGO",null);s(this,"_headBaseY",0);s(this,"_bobPhase");s(this,"_offsetAngle");s(this,"_followDist");this._parent=e,this._world=t,this._offsetAngle=Math.random()*Math.PI*2,this._followDist=.55+Math.random()*.5,this._bobPhase=Math.random()*Math.PI*2}onAttach(){for(const e of this.gameObject.children)if(e.name==="Duckling.Head"){this._headGO=e,this._headBaseY=e.position.y;break}}update(e){const t=this.gameObject,r=t.position.x,o=t.position.z;this._velY-=9.8*e,t.position.y+=this._velY*e;const i=this._world.getTopBlockY(Math.floor(r),Math.floor(o),Math.ceil(t.position.y)+4);i>0&&t.position.y<=i+.1&&(t.position.y=i,this._velY=0),this._offsetAngle+=e*.25;const a=this._parent.position.x+Math.cos(this._offsetAngle)*this._followDist,l=this._parent.position.z+Math.sin(this._offsetAngle)*this._followDist,c=a-r,d=l-o,p=c*c+d*d;let f=!1;if(p>.04){const h=Math.sqrt(p),_=h>2.5?3.5:1.8,m=c/h,b=d/h;t.position.x+=m*_*e,t.position.z+=b*_*e,this._yaw=Math.atan2(-m,-b),f=!0}if(t.rotation=_e.fromAxisAngle(Fi,this._yaw),this._headGO){this._bobPhase+=e*(f?7:2);const h=f?.012:.004;this._headGO.position.y=this._headBaseY+Math.sin(this._bobPhase)*h}}}const Wi=new j(0,1,0),ji=new j(1,0,0),qi=3;class Yi{constructor(n=0,e=0,t=5,r=.002){s(this,"yaw");s(this,"pitch");s(this,"speed");s(this,"sensitivity");s(this,"inputForward",0);s(this,"inputStrafe",0);s(this,"inputUp",!1);s(this,"inputDown",!1);s(this,"inputFast",!1);s(this,"_keys",new Set);s(this,"_canvas",null);s(this,"_onMouseMove");s(this,"_onKeyDown");s(this,"_onKeyUp");s(this,"_onClick");s(this,"_onBlur");s(this,"usePointerLock",!0);this.yaw=n,this.pitch=e,this.speed=t,this.sensitivity=r;const o=Math.PI/2-.001;this._onMouseMove=i=>{document.pointerLockElement===this._canvas&&(this.yaw-=i.movementX*this.sensitivity,this.pitch=Math.max(-o,Math.min(o,this.pitch+i.movementY*this.sensitivity)))},this._onKeyDown=i=>this._keys.add(i.code),this._onKeyUp=i=>this._keys.delete(i.code),this._onClick=()=>{var i;this.usePointerLock&&((i=this._canvas)==null||i.requestPointerLock())},this._onBlur=()=>this._keys.clear()}attach(n){this._canvas=n,n.addEventListener("click",this._onClick),document.addEventListener("mousemove",this._onMouseMove),document.addEventListener("keydown",this._onKeyDown),document.addEventListener("keyup",this._onKeyUp),window.addEventListener("blur",this._onBlur)}pressKey(n){this._keys.add(n)}applyLookDelta(n,e){const t=Math.PI/2-.001;this.yaw-=n*this.sensitivity,this.pitch=Math.max(-t,Math.min(t,this.pitch+e*this.sensitivity))}detach(){this._canvas&&(this._canvas.removeEventListener("click",this._onClick),document.removeEventListener("mousemove",this._onMouseMove),document.removeEventListener("keydown",this._onKeyDown),document.removeEventListener("keyup",this._onKeyUp),window.removeEventListener("blur",this._onBlur),this._canvas=null)}update(n,e){const t=Math.sin(this.yaw),r=Math.cos(this.yaw);let o=0,i=0,a=0;(this._keys.has("KeyW")||this._keys.has("ArrowUp"))&&(o-=t,a-=r),(this._keys.has("KeyS")||this._keys.has("ArrowDown"))&&(o+=t,a+=r),(this._keys.has("KeyA")||this._keys.has("ArrowLeft"))&&(o-=r,a+=t),(this._keys.has("KeyD")||this._keys.has("ArrowRight"))&&(o+=r,a-=t),this.inputForward!==0&&(o-=t*this.inputForward,a-=r*this.inputForward),this.inputStrafe!==0&&(o+=r*this.inputStrafe,a-=t*this.inputStrafe),(this._keys.has("Space")||this.inputUp)&&(i+=1),(this._keys.has("ShiftLeft")||this.inputDown)&&(i-=1);const l=Math.sqrt(o*o+i*i+a*a);if(l>0){const c=this._keys.has("ControlLeft")||this._keys.has("AltLeft")||this.inputFast,d=this.speed*(c?qi:1)*e/l;n.position.x+=o*d,n.position.y+=i*d,n.position.z+=a*d}n.rotation=_e.fromAxisAngle(Wi,this.yaw).multiply(_e.fromAxisAngle(ji,-this.pitch))}}const Xi=400,$i=16,ri=Xi/$i;var R=(u=>(u[u.NONE=0]="NONE",u[u.GRASS=1]="GRASS",u[u.SAND=2]="SAND",u[u.STONE=3]="STONE",u[u.DIRT=4]="DIRT",u[u.TRUNK=5]="TRUNK",u[u.TREELEAVES=6]="TREELEAVES",u[u.WATER=7]="WATER",u[u.GLASS=8]="GLASS",u[u.FLOWER=9]="FLOWER",u[u.GLOWSTONE=10]="GLOWSTONE",u[u.MAGMA=11]="MAGMA",u[u.OBSIDIAN=12]="OBSIDIAN",u[u.DIAMOND=13]="DIAMOND",u[u.IRON=14]="IRON",u[u.SPECULAR=15]="SPECULAR",u[u.CACTUS=16]="CACTUS",u[u.SNOW=17]="SNOW",u[u.GRASS_SNOW=18]="GRASS_SNOW",u[u.SPRUCE_PLANKS=19]="SPRUCE_PLANKS",u[u.GRASS_PROP=20]="GRASS_PROP",u[u.TORCH=21]="TORCH",u[u.DEAD_BUSH=22]="DEAD_BUSH",u[u.SNOWYLEAVES=23]="SNOWYLEAVES",u[u.AMETHYST=24]="AMETHYST",u[u.MAX=25]="MAX",u))(R||{});class de{constructor(n,e,t,r){s(this,"blockType");s(this,"sideFace");s(this,"bottomFace");s(this,"topFace");this.blockType=n,this.sideFace=e,this.bottomFace=t,this.topFace=r}}const nn=[new de(0,new V(0,0),new V(0,0),new V(0,0)),new de(1,new V(1,0),new V(3,0),new V(2,0)),new de(2,new V(4,0),new V(4,0),new V(4,0)),new de(3,new V(5,0),new V(5,0),new V(5,0)),new de(4,new V(6,0),new V(6,0),new V(6,0)),new de(5,new V(7,0),new V(8,0),new V(8,0)),new de(6,new V(9,0),new V(9,0),new V(9,0)),new de(7,new V(2,29),new V(2,29),new V(2,29)),new de(8,new V(10,0),new V(10,0),new V(10,0)),new de(9,new V(23,0),new V(23,0),new V(23,0)),new de(10,new V(11,0),new V(11,0),new V(11,0)),new de(11,new V(12,0),new V(12,0),new V(12,0)),new de(12,new V(13,0),new V(13,0),new V(13,0)),new de(13,new V(14,0),new V(14,0),new V(14,0)),new de(14,new V(15,0),new V(15,0),new V(15,0)),new de(15,new V(0,24),new V(0,24),new V(0,24)),new de(16,new V(17,0),new V(18,0),new V(16,0)),new de(17,new V(19,0),new V(19,0),new V(19,0)),new de(18,new V(20,0),new V(3,0),new V(21,0)),new de(19,new V(22,0),new V(22,0),new V(22,0)),new de(20,new V(1,1),new V(1,1),new V(1,1)),new de(21,new V(2,1),new V(2,1),new V(2,1)),new de(22,new V(3,1),new V(3,1),new V(3,1)),new de(23,new V(4,1),new V(9,0),new V(21,0)),new de(24,new V(5,1),new V(5,1),new V(5,1)),new de(25,new V(0,0),new V(0,0),new V(0,0))];class pe{constructor(n,e,t,r){s(this,"blockType");s(this,"materialType");s(this,"emitsLight");s(this,"collidable");this.blockType=n,this.materialType=e,this.emitsLight=t,this.collidable=r}}const St=[new pe(0,1,0,0),new pe(1,0,0,1),new pe(2,0,0,1),new pe(3,0,0,1),new pe(4,0,0,1),new pe(5,0,0,1),new pe(6,1,0,1),new pe(7,2,0,0),new pe(8,1,0,1),new pe(9,3,0,0),new pe(10,0,1,1),new pe(11,0,1,1),new pe(12,0,0,1),new pe(13,0,0,1),new pe(14,0,0,1),new pe(15,0,0,1),new pe(16,0,0,1),new pe(17,0,0,1),new pe(18,0,0,1),new pe(19,0,0,1),new pe(20,3,0,0),new pe(21,3,1,0),new pe(22,3,0,0),new pe(23,1,0,1),new pe(24,0,0,1)],Zi=[0,.6,.5,1.5,.5,2,.2,0,.3,0,.3,.3,10,3,3,1.5,.4,.1,.6,2,0,0,0,.2,1.5],Ki=["None","Grass","Sand","Stone","Dirt","Trunk","Tree leaves","Water","Glass","Flower","Glowstone","Magma","Obsidian","Diamond","Iron","Specular","Cactus","Snow","Grass snow","Spruce planks","Grass prop","Torch","Dead bush","Snowy leaves","Amethyst","Max"];function he(u){return St[u].materialType===2}function ct(u){return St[u].materialType===1||St[u].materialType===3}function jr(u){return St[u].emitsLight===1}function Ue(u){return St[u].materialType===3}function Ji(u){switch(u){case R.GRASS:case R.DIRT:case R.TREELEAVES:case R.SNOW:case R.GRASS_SNOW:case R.GRASS_PROP:case R.SNOWYLEAVES:return"grass";case R.SAND:return"sand";case R.TRUNK:case R.SPRUCE_PLANKS:return"wood";default:return"stone"}}const Qi=new j(0,1,0),ea=new j(1,0,0),ta=-28,na=-4,ra=1.3,oa=4.3,ia=7,aa=11.5,sa=3.5,Ge=.3,vt=1.8,qr=1.62;class la{constructor(n,e=Math.PI,t=.1){s(this,"yaw");s(this,"pitch");s(this,"sensitivity",.002);s(this,"inputForward",0);s(this,"inputStrafe",0);s(this,"inputJump",!1);s(this,"inputSneak",!1);s(this,"inputSprint",!1);s(this,"onStep");s(this,"onLand");s(this,"_velY",0);s(this,"_stepDistance",0);s(this,"_onGround",!1);s(this,"_prevInWater",!1);s(this,"_coyoteFrames",0);s(this,"_keys",new Set);s(this,"_canvas",null);s(this,"_world");s(this,"_onMouseMove");s(this,"_onKeyDown");s(this,"_onKeyUp");s(this,"_onClick");s(this,"_onBlur");s(this,"usePointerLock",!0);this._world=n,this.yaw=e,this.pitch=t;const r=Math.PI/2-.001;this._onMouseMove=o=>{document.pointerLockElement===this._canvas&&(this.yaw-=o.movementX*this.sensitivity,this.pitch=Math.max(-r,Math.min(r,this.pitch+o.movementY*this.sensitivity)))},this._onKeyDown=o=>this._keys.add(o.code),this._onKeyUp=o=>this._keys.delete(o.code),this._onClick=()=>{var o;this.usePointerLock&&((o=this._canvas)==null||o.requestPointerLock())},this._onBlur=()=>this._keys.clear()}set velY(n){this._velY=n}attach(n){this._canvas=n,n.addEventListener("click",this._onClick),document.addEventListener("mousemove",this._onMouseMove),document.addEventListener("keydown",this._onKeyDown),document.addEventListener("keyup",this._onKeyUp),window.addEventListener("blur",this._onBlur)}applyLookDelta(n,e){const t=Math.PI/2-.001;this.yaw-=n*this.sensitivity,this.pitch=Math.max(-t,Math.min(t,this.pitch+e*this.sensitivity))}detach(){this._canvas&&(this._canvas.removeEventListener("click",this._onClick),document.removeEventListener("mousemove",this._onMouseMove),document.removeEventListener("keydown",this._onKeyDown),document.removeEventListener("keyup",this._onKeyUp),window.removeEventListener("blur",this._onBlur),this._canvas=null)}update(n,e){var E,g;e=Math.min(e,.05),n.rotation=_e.fromAxisAngle(Qi,this.yaw).multiply(_e.fromAxisAngle(ea,-this.pitch));const t=Math.sin(this.yaw),r=Math.cos(this.yaw),o=this._keys.has("ControlLeft")||this._keys.has("AltLeft")||this.inputSprint,i=this._keys.has("ShiftLeft")||this.inputSneak,a=o?ia:i?ra:oa;let l=0,c=0;(this._keys.has("KeyW")||this._keys.has("ArrowUp"))&&(l-=t,c-=r),(this._keys.has("KeyS")||this._keys.has("ArrowDown"))&&(l+=t,c+=r),(this._keys.has("KeyA")||this._keys.has("ArrowLeft"))&&(l-=r,c+=t),(this._keys.has("KeyD")||this._keys.has("ArrowRight"))&&(l+=r,c-=t),this.inputForward!==0&&(l-=t*this.inputForward,c-=r*this.inputForward),this.inputStrafe!==0&&(l+=r*this.inputStrafe,c-=t*this.inputStrafe);const d=Math.sqrt(l*l+c*c);if(d>0){const k=1/Math.max(d,1);l=l*k*a,c=c*k*a}let p=n.position.x,f=n.position.y-qr,h=n.position.z;const _=he(this._world.getBlockType(Math.floor(p),Math.floor(f+vt*.5),Math.floor(h))),m=this._keys.has("Space")||this.inputJump;_?(m&&(this._velY=sa),this._velY=Math.max(this._velY+na*e,-2)):(this._prevInWater&&this._velY>0&&(this._velY=0),m&&(this._onGround||this._coyoteFrames>0)&&(this._velY=aa,this._coyoteFrames=0),this._velY=Math.max(this._velY+ta*e,-50));const b=this._onGround,y=Math.sqrt(l*l+c*c);p=this._slideX(p+l*e,f,h,l),h=this._slideZ(p,f,h+c*e,c);const[v,w,B]=this._slideY(p,f+this._velY*e,h),x=this._velY;(w||B)&&(this._velY=0),f=v,this._onGround=w,this._prevInWater=_;const C=Math.floor(p),L=Math.floor(f-.01),U=Math.floor(h),I=Ji(this._world.getBlockType(C,L,U));if(w&&!b&&((E=this.onLand)==null||E.call(this,I,Math.abs(x))),w&&y>.5){this._stepDistance+=y*e;const k=y>5.5?.55:y>2?.45:.3;this._stepDistance>=k&&(this._stepDistance-=k,(g=this.onStep)==null||g.call(this,I))}else this._stepDistance=0;w?this._coyoteFrames=6:_||(this._coyoteFrames=Math.max(0,this._coyoteFrames-1)),n.position.x=p,n.position.y=f+qr,n.position.z=h}_isSolid(n,e,t){const r=this._world.getBlockType(n,e,t);return r!==R.NONE&&!he(r)&&!Ue(r)}_slideX(n,e,t,r){if(Math.abs(r)<1e-6)return n;const o=r>0?n+Ge:n-Ge,i=Math.floor(o),a=Math.floor(e+.01),l=Math.floor(e+vt-.01),c=Math.floor(t-Ge+.01),d=Math.floor(t+Ge-.01);for(let p=a;p<=l;p++)for(let f=c;f<=d;f++)if(this._isSolid(i,p,f))return r>0?i-Ge-.001:i+1+Ge+.001;return n}_slideZ(n,e,t,r){if(Math.abs(r)<1e-6)return t;const o=r>0?t+Ge:t-Ge,i=Math.floor(o),a=Math.floor(e+.01),l=Math.floor(e+vt-.01),c=Math.floor(n-Ge+.01),d=Math.floor(n+Ge-.01);for(let p=a;p<=l;p++)for(let f=c;f<=d;f++)if(this._isSolid(f,p,i))return r>0?i-Ge-.001:i+1+Ge+.001;return t}_slideY(n,e,t){const r=Math.floor(n-Ge+.01),o=Math.floor(n+Ge-.01),i=Math.floor(t-Ge+.01),a=Math.floor(t+Ge-.01);if(this._velY<=0){const l=Math.floor(e-.001);for(let c=r;c<=o;c++)for(let d=i;d<=a;d++)if(this._isSolid(c,l,d))return[l+1,!0,!1];return[e,!1,!1]}else{const l=Math.floor(e+vt);for(let c=r;c<=o;c++)for(let d=i;d<=a;d++)if(this._isSolid(c,l,d))return[l-vt-.001,!1,!0];return[e,!1,!1]}}}class Vn{constructor(n,e,t,r,o,i){s(this,"device");s(this,"queue");s(this,"context");s(this,"format");s(this,"canvas");s(this,"hdr");s(this,"enableErrorHandling");this.device=n,this.queue=n.queue,this.context=e,this.format=t,this.canvas=r,this.hdr=o,this.enableErrorHandling=i}get width(){return this.canvas.width}get height(){return this.canvas.height}static async create(n,e={}){if(!navigator.gpu)throw new Error("WebGPU not supported");const t=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!t)throw new Error("No WebGPU adapter found");const r=await t.requestDevice({requiredFeatures:[]});e.enableErrorHandling&&r.addEventListener("uncapturederror",l=>{const c=l.error;c instanceof GPUValidationError?console.error("[WebGPU Validation Error]",c.message):c instanceof GPUOutOfMemoryError?console.error("[WebGPU Out of Memory]"):console.error("[WebGPU Internal Error]",c)});const o=n.getContext("webgpu");let i,a=!1;try{o.configure({device:r,format:"rgba16float",alphaMode:"opaque",colorSpace:"display-p3",toneMapping:{mode:"extended"}}),i="rgba16float",a=!0}catch{i=navigator.gpu.getPreferredCanvasFormat(),o.configure({device:r,format:i,alphaMode:"opaque"})}return n.width=n.clientWidth*devicePixelRatio,n.height=n.clientHeight*devicePixelRatio,new Vn(r,o,i,n,a,e.enableErrorHandling??!1)}getCurrentTexture(){return this.context.getCurrentTexture()}createBuffer(n,e,t){return this.device.createBuffer({size:n,usage:e,label:t})}writeBuffer(n,e,t=0){e instanceof ArrayBuffer?this.queue.writeBuffer(n,t,e):this.queue.writeBuffer(n,t,e.buffer,e.byteOffset,e.byteLength)}pushInitErrorScope(){this.enableErrorHandling&&this.device.pushErrorScope("validation")}async popInitErrorScope(n){if(this.enableErrorHandling){const e=await this.device.popErrorScope();e&&(console.error(`[Init:${n}] Validation Error:`,e.message),console.trace())}}pushFrameErrorScope(){this.enableErrorHandling&&this.device.pushErrorScope("validation")}async popFrameErrorScope(){if(this.enableErrorHandling){const n=await this.device.popErrorScope();n&&(console.error("[Frame] Validation Error:",n.message),console.trace())}}pushPassErrorScope(n){this.enableErrorHandling&&(this.device.pushErrorScope("validation"),this.device.pushErrorScope("out-of-memory"),this.device.pushErrorScope("internal"))}async popPassErrorScope(n){if(this.enableErrorHandling){const e=await this.device.popErrorScope();e&&console.error(`[${n}] Internal Error:`,e),await this.device.popErrorScope()&&console.error(`[${n}] Out of Memory`);const r=await this.device.popErrorScope();r&&console.error(`[${n}] Validation Error:`,r.message)}}}class Be{constructor(){s(this,"enabled",!0)}destroy(){}}class Jt{constructor(n,e,t,r,o){s(this,"albedoRoughness");s(this,"normalMetallic");s(this,"depth");s(this,"albedoRoughnessView");s(this,"normalMetallicView");s(this,"depthView");s(this,"width");s(this,"height");this.albedoRoughness=n,this.normalMetallic=e,this.depth=t,this.width=r,this.height=o,this.albedoRoughnessView=n.createView(),this.normalMetallicView=e.createView(),this.depthView=t.createView()}static create(n){const{device:e,width:t,height:r}=n,o=e.createTexture({label:"GBuffer AlbedoRoughness",size:{width:t,height:r},format:"rgba8unorm",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),i=e.createTexture({label:"GBuffer NormalMetallic",size:{width:t,height:r},format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),a=e.createTexture({label:"GBuffer Depth",size:{width:t,height:r},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING});return new Jt(o,i,a,t,r)}destroy(){this.albedoRoughness.destroy(),this.normalMetallic.destroy(),this.depth.destroy()}}const zn=48,Fn=[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x3"},{shaderLocation:2,offset:24,format:"float32x2"},{shaderLocation:3,offset:32,format:"float32x4"}];class Le{constructor(n,e,t){s(this,"vertexBuffer");s(this,"indexBuffer");s(this,"indexCount");this.vertexBuffer=n,this.indexBuffer=e,this.indexCount=t}destroy(){this.vertexBuffer.destroy(),this.indexBuffer.destroy()}static fromData(n,e,t){const r=n.createBuffer({label:"Mesh VertexBuffer",size:e.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});n.queue.writeBuffer(r,0,e.buffer,e.byteOffset,e.byteLength);const o=n.createBuffer({label:"Mesh IndexBuffer",size:t.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST});return n.queue.writeBuffer(o,0,t.buffer,t.byteOffset,t.byteLength),new Le(r,o,t.length)}static createCube(n,e=1){const t=e/2,r=[{normal:[0,0,1],tangent:[1,0,0,1],verts:[[-t,-t,t],[t,-t,t],[t,t,t],[-t,t,t]]},{normal:[0,0,-1],tangent:[-1,0,0,1],verts:[[t,-t,-t],[-t,-t,-t],[-t,t,-t],[t,t,-t]]},{normal:[1,0,0],tangent:[0,0,-1,1],verts:[[t,-t,t],[t,-t,-t],[t,t,-t],[t,t,t]]},{normal:[-1,0,0],tangent:[0,0,1,1],verts:[[-t,-t,-t],[-t,-t,t],[-t,t,t],[-t,t,-t]]},{normal:[0,1,0],tangent:[1,0,0,1],verts:[[-t,t,t],[t,t,t],[t,t,-t],[-t,t,-t]]},{normal:[0,-1,0],tangent:[1,0,0,1],verts:[[-t,-t,-t],[t,-t,-t],[t,-t,t],[-t,-t,t]]}],o=[[0,1],[1,1],[1,0],[0,0]],i=[],a=[];let l=0;for(const c of r){for(let d=0;d<4;d++)i.push(...c.verts[d],...c.normal,...o[d],...c.tangent);a.push(l,l+1,l+2,l,l+2,l+3),l+=4}return Le.fromData(n,new Float32Array(i),new Uint32Array(a))}static createSphere(n,e=.5,t=32,r=32){const o=[],i=[];for(let a=0;a<=t;a++){const l=a/t*Math.PI,c=Math.sin(l),d=Math.cos(l);for(let p=0;p<=r;p++){const f=p/r*Math.PI*2,h=Math.sin(f),_=Math.cos(f),m=c*_,b=d,y=c*h;o.push(m*e,b*e,y*e,m,b,y,p/r,a/t,-h,0,_,1)}}for(let a=0;a<t;a++)for(let l=0;l<r;l++){const c=a*(r+1)+l,d=c+r+1;i.push(c,c+1,d),i.push(c+1,d+1,d)}return Le.fromData(n,new Float32Array(o),new Uint32Array(i))}static createCone(n,e=.5,t=1,r=16){const o=[],i=[],a=Math.sqrt(t*t+e*e),l=t/a,c=e/a;o.push(0,t,0,0,1,0,.5,0,1,0,0,1);const d=1;for(let h=0;h<=r;h++){const _=h/r*Math.PI*2,m=Math.cos(_),b=Math.sin(_);o.push(m*e,0,b*e,m*l,c,b*l,h/r,1,m,0,b,1)}for(let h=0;h<r;h++)i.push(0,d+h+1,d+h);const p=d+r+1;o.push(0,0,0,0,-1,0,.5,.5,1,0,0,1);const f=p+1;for(let h=0;h<=r;h++){const _=h/r*Math.PI*2,m=Math.cos(_),b=Math.sin(_);o.push(m*e,0,b*e,0,-1,0,.5+m*.5,.5+b*.5,1,0,0,1)}for(let h=0;h<r;h++)i.push(p,f+h,f+h+1);return Le.fromData(n,new Float32Array(o),new Uint32Array(i))}static createPlane(n,e=10,t=10,r=1,o=1){const i=[],a=[];for(let l=0;l<=o;l++)for(let c=0;c<=r;c++){const d=(c/r-.5)*e,p=(l/o-.5)*t,f=c/r,h=l/o;i.push(d,0,p,0,1,0,f,h,1,0,0,1)}for(let l=0;l<o;l++)for(let c=0;c<r;c++){const d=l*(r+1)+c;a.push(d,d+r+1,d+1,d+1,d+r+1,d+r+2)}return Le.fromData(n,new Float32Array(i),new Uint32Array(a))}}const oi=`// Shadow map rendering shader - outputs depth only

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
`,Yr=2048,kt=4;class Hn extends Be{constructor(e,t,r,o,i,a,l,c){super();s(this,"name","ShadowPass");s(this,"shadowMap");s(this,"shadowMapView");s(this,"shadowMapArrayViews");s(this,"_pipeline");s(this,"_shadowBindGroups");s(this,"_shadowUniformBuffers");s(this,"_modelUniformBuffers",[]);s(this,"_modelBindGroups",[]);s(this,"_cascadeCount");s(this,"_cascades",[]);s(this,"_modelBGL");s(this,"_sceneSnapshot",[]);this.shadowMap=e,this.shadowMapView=t,this.shadowMapArrayViews=r,this._pipeline=o,this._shadowBindGroups=i,this._shadowUniformBuffers=a,this._modelBGL=l,this._cascadeCount=c}static create(e,t=3){const{device:r}=e,o=r.createTexture({label:"ShadowMap",size:{width:Yr,height:Yr,depthOrArrayLayers:kt},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),i=o.createView({dimension:"2d-array"}),a=Array.from({length:kt},(_,m)=>o.createView({dimension:"2d",baseArrayLayer:m,arrayLayerCount:1})),l=r.createBindGroupLayout({label:"ShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),c=r.createBindGroupLayout({label:"ModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),d=[],p=[];for(let _=0;_<kt;_++){const m=r.createBuffer({label:`ShadowUniformBuffer ${_}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});d.push(m),p.push(r.createBindGroup({label:`ShadowBindGroup ${_}`,layout:l,entries:[{binding:0,resource:{buffer:m}}]}))}const f=r.createShaderModule({label:"ShadowShader",code:oi}),h=r.createRenderPipeline({label:"ShadowPipeline",layout:r.createPipelineLayout({bindGroupLayouts:[l,c]}),vertex:{module:f,entryPoint:"vs_main",buffers:[{arrayStride:zn,attributes:[Fn[0]]}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less",depthBias:2,depthBiasSlopeScale:2.5,depthBiasClamp:0},primitive:{topology:"triangle-list",cullMode:"back"}});return new Hn(o,i,a,h,p,d,c,t)}updateScene(e,t,r,o){this._cascades=r.computeCascadeMatrices(t,o),this._cascadeCount=Math.min(this._cascades.length,kt)}execute(e,t){const{device:r}=t,o=this._getMeshRenderers(t);this._ensureModelBuffers(r,o.length);for(let i=0;i<this._cascadeCount&&!(i>=this._cascades.length);i++){const a=this._cascades[i];t.queue.writeBuffer(this._shadowUniformBuffers[i],0,a.lightViewProj.data.buffer);const l=e.beginRenderPass({label:`ShadowPass cascade ${i}`,colorAttachments:[],depthStencilAttachment:{view:this.shadowMapArrayViews[i],depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});l.setPipeline(this._pipeline),l.setBindGroup(0,this._shadowBindGroups[i]);for(let c=0;c<o.length;c++){const{mesh:d,modelMatrix:p}=o[c],f=this._modelUniformBuffers[c];t.queue.writeBuffer(f,0,p.data.buffer),l.setBindGroup(1,this._modelBindGroups[c]),l.setVertexBuffer(0,d.vertexBuffer),l.setIndexBuffer(d.indexBuffer,"uint32"),l.drawIndexed(d.indexCount)}l.end()}}_getMeshRenderers(e){return this._sceneSnapshot??[]}setSceneSnapshot(e){this._sceneSnapshot=e}_ensureModelBuffers(e,t){for(;this._modelUniformBuffers.length<t;){const r=e.createBuffer({label:`ModelUniform ${this._modelUniformBuffers.length}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),o=e.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:r}}]});this._modelUniformBuffers.push(r),this._modelBindGroups.push(o)}}destroy(){this.shadowMap.destroy();for(const e of this._shadowUniformBuffers)e.destroy();for(const e of this._modelUniformBuffers)e.destroy()}}const ca=`// Deferred PBR lighting pass — fullscreen triangle, reads GBuffer + shadow maps + IBL.

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
`,se="rgba16float",Xr=64*4+16+16,$r=368;class Wn extends Be{constructor(e,t,r,o,i,a,l,c,d,p,f,h,_,m,b,y,v,w){super();s(this,"name","LightingPass");s(this,"hdrTexture");s(this,"hdrView");s(this,"cameraBuffer");s(this,"lightBuffer");s(this,"_pipeline");s(this,"_sceneBindGroup");s(this,"_gbufferBindGroup");s(this,"_aoBindGroup");s(this,"_iblBindGroup");s(this,"_defaultCloudShadow");s(this,"_defaultSsgi");s(this,"_defaultIblCube");s(this,"_defaultBrdfLut");s(this,"_device");s(this,"_aoBGL");s(this,"_aoView");s(this,"_aoSampler");s(this,"_ssgiSampler");s(this,"_cameraScratch",new Float32Array(Xr/4));s(this,"_lightScratch",new Float32Array($r/4));s(this,"_lightScratchU",new Uint32Array(this._lightScratch.buffer));s(this,"_cloudShadowScratch",new Float32Array(3));this.hdrTexture=e,this.hdrView=t,this._pipeline=r,this._sceneBindGroup=o,this._gbufferBindGroup=i,this._aoBindGroup=a,this._iblBindGroup=l,this.cameraBuffer=c,this.lightBuffer=d,this._defaultCloudShadow=p,this._defaultSsgi=f,this._defaultIblCube=h,this._defaultBrdfLut=_,this._device=m,this._aoBGL=b,this._aoView=y,this._aoSampler=v,this._ssgiSampler=w}static create(e,t,r,o,i,a){const{device:l,width:c,height:d}=e,p=l.createTexture({label:"HDR Texture",size:{width:c,height:d},format:se,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),f=p.createView(),h=l.createBuffer({label:"LightCameraBuffer",size:Xr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),_=l.createBuffer({label:"LightBuffer",size:$r,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),m=l.createSampler({label:"ShadowSampler",compare:"less-equal",magFilter:"linear",minFilter:"linear"}),b=l.createSampler({label:"GBufferLinearSampler",magFilter:"linear",minFilter:"linear"}),y=l.createSampler({label:"AoSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),v=l.createSampler({label:"SsgiSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),w=l.createBindGroupLayout({label:"LightSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),B=l.createBindGroupLayout({label:"LightGBufferBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth",viewDimension:"2d-array"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"comparison"}},{binding:5,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:6,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),x=l.createTexture({label:"DefaultCloudShadow",size:{width:1,height:1},format:"r8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});l.queue.writeTexture({texture:x},new Uint8Array([255]),{bytesPerRow:1},{width:1,height:1});const C=i??x.createView(),L=l.createBindGroupLayout({label:"LightAoBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),U=l.createTexture({label:"DefaultSsgi",size:{width:1,height:1},format:se,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),I=l.createBindGroupLayout({label:"LightIblBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),E=l.createSampler({label:"IblSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge"}),g=l.createTexture({label:"DefaultIblCube",size:{width:1,height:1,depthOrArrayLayers:6},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),k=g.createView({dimension:"cube"}),P=l.createTexture({label:"DefaultBrdfLut",size:{width:1,height:1},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),M=l.createBindGroup({label:"LightIblBG",layout:I,entries:[{binding:0,resource:(a==null?void 0:a.irradianceView)??k},{binding:1,resource:(a==null?void 0:a.prefilteredView)??k},{binding:2,resource:(a==null?void 0:a.brdfLutView)??P.createView()},{binding:3,resource:E}]}),S=l.createBindGroup({layout:w,entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:{buffer:_}}]}),N=l.createBindGroup({layout:B,entries:[{binding:0,resource:t.albedoRoughnessView},{binding:1,resource:t.normalMetallicView},{binding:2,resource:t.depthView},{binding:3,resource:r.shadowMapView},{binding:4,resource:m},{binding:5,resource:b},{binding:6,resource:C}]}),G=l.createBindGroup({label:"LightAoBG",layout:L,entries:[{binding:0,resource:o},{binding:1,resource:y},{binding:2,resource:U.createView()},{binding:3,resource:v}]}),H=l.createShaderModule({label:"LightingShader",code:ca}),O=l.createRenderPipeline({label:"LightingPipeline",layout:l.createPipelineLayout({bindGroupLayouts:[w,B,L,I]}),vertex:{module:H,entryPoint:"vs_main"},fragment:{module:H,entryPoint:"fs_main",targets:[{format:se}]},primitive:{topology:"triangle-list"}});return new Wn(p,f,O,S,N,G,M,h,_,i?null:x,U,a?null:g,a?null:P,l,L,o,y,v)}updateSSGI(e){this._aoBindGroup=this._device.createBindGroup({label:"LightAoBG",layout:this._aoBGL,entries:[{binding:0,resource:this._aoView},{binding:1,resource:this._aoSampler},{binding:2,resource:e},{binding:3,resource:this._ssgiSampler}]})}updateCamera(e,t,r,o,i,a,l,c){const d=this._cameraScratch;d.set(t.data,0),d.set(r.data,16),d.set(o.data,32),d.set(i.data,48),d[64]=a.x,d[65]=a.y,d[66]=a.z,d[67]=l,d[68]=c,e.queue.writeBuffer(this.cameraBuffer,0,d.buffer)}updateLight(e,t,r,o,i,a=!0,l=!1,c=.02){const d=this._lightScratch,p=this._lightScratchU;let f=0;d[f++]=t.x,d[f++]=t.y,d[f++]=t.z,d[f++]=o,d[f++]=r.x,d[f++]=r.y,d[f++]=r.z,p[f++]=i.length;for(let h=0;h<4;h++)h<i.length&&d.set(i[h].lightViewProj.data,f),f+=16;for(let h=0;h<4;h++)d[f++]=h<i.length?i[h].splitFar:1e9;p[f]=a?1:0,p[f+1]=l?1:0,d[81]=c;for(let h=0;h<4;h++)d[84+h]=h<i.length?i[h].depthRange:1;for(let h=0;h<4;h++)d[88+h]=h<i.length?i[h].texelWorldSize:1;e.queue.writeBuffer(this.lightBuffer,0,d.buffer)}updateCloudShadow(e,t,r,o){const i=this._cloudShadowScratch;i[0]=t,i[1]=r,i[2]=o,e.queue.writeBuffer(this.lightBuffer,312,i.buffer)}execute(e,t){const r=e.beginRenderPass({label:"LightingPass",colorAttachments:[{view:this.hdrView,loadOp:"load",storeOp:"store"}]});r.setPipeline(this._pipeline),r.setBindGroup(0,this._sceneBindGroup),r.setBindGroup(1,this._gbufferBindGroup),r.setBindGroup(2,this._aoBindGroup),r.setBindGroup(3,this._iblBindGroup),r.draw(3),r.end()}destroy(){var e,t,r,o;this.hdrTexture.destroy(),this.cameraBuffer.destroy(),this.lightBuffer.destroy(),(e=this._defaultCloudShadow)==null||e.destroy(),(t=this._defaultSsgi)==null||t.destroy(),(r=this._defaultIblCube)==null||r.destroy(),(o=this._defaultBrdfLut)==null||o.destroy()}}const ua=`// Physically based single-scattering atmosphere (Rayleigh + Mie).
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
`,Zr=96;class jn extends Be{constructor(e,t,r,o){super();s(this,"name","AtmospherePass");s(this,"_pipeline");s(this,"_uniformBuf");s(this,"_bg");s(this,"_hdrView");s(this,"_scratch",new Float32Array(Zr/4));this._pipeline=e,this._uniformBuf=t,this._bg=r,this._hdrView=o}static create(e,t){const{device:r}=e,o=r.createBuffer({label:"AtmosphereUniform",size:Zr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),i=r.createBindGroupLayout({label:"AtmosphereBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),a=r.createBindGroup({label:"AtmosphereBG",layout:i,entries:[{binding:0,resource:{buffer:o}}]}),l=r.createShaderModule({label:"AtmosphereShader",code:ua}),c=r.createRenderPipeline({label:"AtmospherePipeline",layout:r.createPipelineLayout({bindGroupLayouts:[i]}),vertex:{module:l,entryPoint:"vs_main"},fragment:{module:l,entryPoint:"fs_main",targets:[{format:se}]},primitive:{topology:"triangle-list"}});return new jn(c,o,a,t)}update(e,t,r,o){const i=this._scratch;i.set(t.data,0),i[16]=r.x,i[17]=r.y,i[18]=r.z;const a=Math.sqrt(o.x*o.x+o.y*o.y+o.z*o.z),l=a>0?1/a:0;i[20]=-o.x*l,i[21]=-o.y*l,i[22]=-o.z*l,e.queue.writeBuffer(this._uniformBuf,0,i.buffer)}execute(e,t){const r=e.beginRenderPass({label:"AtmospherePass",colorAttachments:[{view:this._hdrView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._pipeline),r.setBindGroup(0,this._bg),r.draw(3),r.end()}destroy(){this._uniformBuf.destroy()}}const da=`// Block selection highlight — two draw calls sharing this shader:
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

// Procedural crack overlay — hash-based cell pattern
fn hash2(p: vec2<f32>) -> f32 {
  return fract(sin(dot(p, vec2<f32>(127.1, 311.7))) * 43758.5453);
}

fn crack_alpha(local: vec3<f32>, stage: f32) -> f32 {
  if (stage < 0.5) { return 0.0; }

  // Use the two dominant face axes for UV
  let ax = abs(local.x - 0.5);
  let ay = abs(local.y - 0.5);
  let az = abs(local.z - 0.5);
  var u = local.x;
  var v = local.z;
  if (ax <= ay && ax <= az) { u = local.y; v = local.z; }
  else if (az <= ax && az <= ay) { u = local.x; v = local.y; }

  // 8x8 hash grid on the block face — each cell cracks independently
  let cell = floor(vec2<f32>(u, v) * 8.0);
  let h = hash2(cell);
  let percent = stage / 10.0;
  return 1.0 - smoothstep(percent - 0.08, percent + 0.08, h);
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
`,Kr=80;class qn extends Be{constructor(e,t,r,o,i,a){super();s(this,"name","BlockHighlightPass");s(this,"_facePipeline");s(this,"_edgePipeline");s(this,"_uniformBuf");s(this,"_bg");s(this,"_hdrView");s(this,"_depthView");s(this,"_active",!1);s(this,"_crackStage",0);s(this,"_scratch",new Float32Array(Kr/4));this._facePipeline=e,this._edgePipeline=t,this._uniformBuf=r,this._bg=o,this._hdrView=i,this._depthView=a}static create(e,t,r){const{device:o}=e,i=o.createBuffer({label:"BlockHighlightUniform",size:Kr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),a=o.createBindGroupLayout({label:"BlockHighlightBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),l=o.createBindGroup({label:"BlockHighlightBG",layout:a,entries:[{binding:0,resource:{buffer:i}}]}),c=o.createShaderModule({label:"BlockHighlightShader",code:da}),d=o.createPipelineLayout({bindGroupLayouts:[a]}),p={format:"depth32float",depthWriteEnabled:!1,depthCompare:"less-equal"},f={color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}},h=o.createRenderPipeline({label:"BlockHighlightFacePipeline",layout:d,vertex:{module:c,entryPoint:"vs_face"},fragment:{module:c,entryPoint:"fs_face",targets:[{format:se,blend:f}]},primitive:{topology:"triangle-list",cullMode:"none"},depthStencil:p}),_=o.createRenderPipeline({label:"BlockHighlightEdgePipeline",layout:d,vertex:{module:c,entryPoint:"vs_edge"},fragment:{module:c,entryPoint:"fs_edge",targets:[{format:se,blend:f}]},primitive:{topology:"triangle-list",cullMode:"none"},depthStencil:p});return new qn(h,_,i,l,t,r)}setCrackStage(e){this._crackStage=Math.max(0,Math.min(9,Math.floor(e)))}update(e,t,r){if(!r){this._active=!1;return}this._active=!0;const o=this._scratch;o.set(t.data,0),o[16]=r.x,o[17]=r.y,o[18]=r.z,o[19]=this._crackStage,e.queue.writeBuffer(this._uniformBuf,0,o.buffer)}execute(e,t){if(!this._active)return;const r=e.beginRenderPass({label:"BlockHighlightPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._depthView,depthLoadOp:"load",depthStoreOp:"store"}});r.setBindGroup(0,this._bg),r.setPipeline(this._facePipeline),r.draw(36),r.setPipeline(this._edgePipeline),r.draw(144),r.end()}destroy(){this._uniformBuf.destroy()}}const fa=`// Cloud + sky pass — fullscreen triangle.
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
`,Jr=96,Qr=48,eo=32;class Yn extends Be{constructor(e,t,r,o,i,a,l,c,d){super();s(this,"name","CloudPass");s(this,"_pipeline");s(this,"_hdrView");s(this,"_cameraBuffer");s(this,"_cloudBuffer");s(this,"_lightBuffer");s(this,"_sceneBG");s(this,"_lightBG");s(this,"_depthBG");s(this,"_noiseSkyBG");s(this,"_cameraScratch",new Float32Array(Jr/4));s(this,"_lightScratch",new Float32Array(eo/4));s(this,"_settingsScratch",new Float32Array(Qr/4));this._pipeline=e,this._hdrView=t,this._cameraBuffer=r,this._cloudBuffer=o,this._lightBuffer=i,this._sceneBG=a,this._lightBG=l,this._depthBG=c,this._noiseSkyBG=d}static create(e,t,r,o){const{device:i}=e,a=i.createBuffer({label:"CloudCameraBuffer",size:Jr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),l=i.createBuffer({label:"CloudUniformBuffer",size:Qr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),c=i.createBuffer({label:"CloudLightBuffer",size:eo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),d=i.createBindGroupLayout({label:"CloudSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),p=i.createBindGroupLayout({label:"CloudLightBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),f=i.createBindGroupLayout({label:"CloudDepthBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),h=i.createBindGroupLayout({label:"CloudNoiseSkyBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),_=i.createSampler({label:"CloudNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"mirror-repeat",addressModeV:"mirror-repeat",addressModeW:"mirror-repeat"}),m=i.createSampler({label:"CloudDepthSampler"}),b=i.createBindGroup({label:"CloudSceneBG",layout:d,entries:[{binding:0,resource:{buffer:a}},{binding:1,resource:{buffer:l}}]}),y=i.createBindGroup({label:"CloudLightBG",layout:p,entries:[{binding:0,resource:{buffer:c}}]}),v=i.createBindGroup({label:"CloudDepthBG",layout:f,entries:[{binding:0,resource:r},{binding:1,resource:m}]}),w=i.createBindGroup({label:"CloudNoiseSkyBG",layout:h,entries:[{binding:0,resource:o.baseView},{binding:1,resource:o.detailView},{binding:2,resource:_}]}),B=i.createShaderModule({label:"CloudShader",code:fa}),x=i.createRenderPipeline({label:"CloudPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[d,p,f,h]}),vertex:{module:B,entryPoint:"vs_main"},fragment:{module:B,entryPoint:"fs_main",targets:[{format:se}]},primitive:{topology:"triangle-list"}});return new Yn(x,t,a,l,c,b,y,v,w)}updateCamera(e,t,r,o,i){const a=this._cameraScratch;a.set(t.data,0),a[16]=r.x,a[17]=r.y,a[18]=r.z,a[19]=o,a[20]=i,e.queue.writeBuffer(this._cameraBuffer,0,a.buffer)}updateLight(e,t,r,o){const i=this._lightScratch;i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=o,i[4]=r.x,i[5]=r.y,i[6]=r.z,e.queue.writeBuffer(this._lightBuffer,0,i.buffer)}updateSettings(e,t){const r=this._settingsScratch;r[0]=t.cloudBase,r[1]=t.cloudTop,r[2]=t.coverage,r[3]=t.density,r[4]=t.windOffset[0],r[5]=t.windOffset[1],r[6]=t.anisotropy,r[7]=t.extinction,r[8]=t.ambientColor[0],r[9]=t.ambientColor[1],r[10]=t.ambientColor[2],r[11]=t.exposure,e.queue.writeBuffer(this._cloudBuffer,0,r.buffer)}execute(e,t){const r=e.beginRenderPass({label:"CloudPass",colorAttachments:[{view:this._hdrView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._pipeline),r.setBindGroup(0,this._sceneBG),r.setBindGroup(1,this._lightBG),r.setBindGroup(2,this._depthBG),r.setBindGroup(3,this._noiseSkyBG),r.draw(3),r.end()}destroy(){this._cameraBuffer.destroy(),this._cloudBuffer.destroy(),this._lightBuffer.destroy()}}const pa=`// Cloud shadow pass — renders a top-down cloud transmittance map (1024×1024 r8unorm).
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
`,to=1024,no="r8unorm",ro=48;class Xn extends Be{constructor(e,t,r,o,i,a){super();s(this,"name","CloudShadowPass");s(this,"shadowTexture");s(this,"shadowView");s(this,"_pipeline");s(this,"_uniformBuffer");s(this,"_uniformBG");s(this,"_noiseBG");s(this,"_frameCount",0);s(this,"_data",new Float32Array(ro/4));this.shadowTexture=e,this.shadowView=t,this._pipeline=r,this._uniformBuffer=o,this._uniformBG=i,this._noiseBG=a}static create(e,t){const{device:r}=e,o=r.createTexture({label:"CloudShadowTexture",size:{width:to,height:to},format:no,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),i=o.createView(),a=r.createBuffer({label:"CloudShadowUniform",size:ro,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),l=r.createBindGroupLayout({label:"CloudShadowUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),c=r.createSampler({label:"CloudNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"mirror-repeat",addressModeV:"mirror-repeat",addressModeW:"mirror-repeat"}),d=r.createBindGroupLayout({label:"CloudShadowNoiseBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"3d"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),p=r.createBindGroup({label:"CloudShadowUniformBG",layout:l,entries:[{binding:0,resource:{buffer:a}}]}),f=r.createBindGroup({label:"CloudShadowNoiseBG",layout:d,entries:[{binding:0,resource:t.baseView},{binding:1,resource:t.detailView},{binding:2,resource:c}]}),h=r.createShaderModule({label:"CloudShadowShader",code:pa}),_=r.createRenderPipeline({label:"CloudShadowPipeline",layout:r.createPipelineLayout({bindGroupLayouts:[l,d]}),vertex:{module:h,entryPoint:"vs_main"},fragment:{module:h,entryPoint:"fs_main",targets:[{format:no}]},primitive:{topology:"triangle-list"}});return new Xn(o,i,_,a,p,f)}update(e,t,r,o){this._data[0]=t.cloudBase,this._data[1]=t.cloudTop,this._data[2]=t.coverage,this._data[3]=t.density,this._data[4]=t.windOffset[0],this._data[5]=t.windOffset[1],this._data[6]=r[0],this._data[7]=r[1],this._data[8]=o,this._data[9]=t.extinction,e.queue.writeBuffer(this._uniformBuffer,0,this._data.buffer)}execute(e,t){if(this._frameCount++%2!==0)return;const r=e.beginRenderPass({label:"CloudShadowPass",colorAttachments:[{view:this.shadowView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._pipeline),r.setBindGroup(0,this._uniformBG),r.setBindGroup(1,this._noiseBG),r.draw(3),r.end()}destroy(){this.shadowTexture.destroy(),this._uniformBuffer.destroy()}}const ha=`// TAA resolve pass — fullscreen triangle, blends current HDR with reprojected history.

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
`,oo=128;class $n extends Be{constructor(e,t,r,o,i,a,l,c,d,p){super();s(this,"name","TAAPass");s(this,"_resolved");s(this,"resolvedView");s(this,"_history");s(this,"_historyView");s(this,"_pipeline");s(this,"_uniformBuffer");s(this,"_uniformBG");s(this,"_textureBG");s(this,"_width");s(this,"_height");s(this,"_scratch",new Float32Array(oo/4));this._resolved=e,this.resolvedView=t,this._history=r,this._historyView=o,this._pipeline=i,this._uniformBuffer=a,this._uniformBG=l,this._textureBG=c,this._width=d,this._height=p}get historyView(){return this._historyView}static create(e,t,r){const{device:o,width:i,height:a}=e,l=o.createTexture({label:"TAA Resolved",size:{width:i,height:a},format:se,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),c=o.createTexture({label:"TAA History",size:{width:i,height:a},format:se,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),d=l.createView(),p=c.createView(),f=o.createBuffer({label:"TAAUniformBuffer",size:oo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),h=o.createBindGroupLayout({label:"TAAUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),_=o.createBindGroupLayout({label:"TAATextureBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),m=o.createSampler({label:"TAALinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),b=o.createBindGroup({layout:h,entries:[{binding:0,resource:{buffer:f}}]}),y=o.createBindGroup({layout:_,entries:[{binding:0,resource:t.hdrView},{binding:1,resource:p},{binding:2,resource:r.depthView},{binding:3,resource:m}]}),v=o.createShaderModule({label:"TAAShader",code:ha}),w=o.createRenderPipeline({label:"TAAPipeline",layout:o.createPipelineLayout({bindGroupLayouts:[h,_]}),vertex:{module:v,entryPoint:"vs_main"},fragment:{module:v,entryPoint:"fs_main",targets:[{format:se}]},primitive:{topology:"triangle-list"}});return new $n(l,d,c,p,w,f,b,y,i,a)}updateCamera(e,t,r){const o=this._scratch;o.set(t.data,0),o.set(r.data,16),e.queue.writeBuffer(this._uniformBuffer,0,o.buffer)}execute(e,t){const r=e.beginRenderPass({label:"TAAPass",colorAttachments:[{view:this.resolvedView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._pipeline),r.setBindGroup(0,this._uniformBG),r.setBindGroup(1,this._textureBG),r.draw(3),r.end(),e.copyTextureToTexture({texture:this._resolved},{texture:this._history},{width:this._width,height:this._height})}destroy(){this._resolved.destroy(),this._history.destroy(),this._uniformBuffer.destroy()}}const _a=`// Bloom: prefilter (downsample + threshold) and separable Gaussian blur.
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
`,ma=`// Bloom composite: adds the blurred bright regions back to the source HDR.

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
`,ga=16;class Zn extends Be{constructor(e,t,r,o,i,a,l,c,d,p,f,h,_,m,b){super();s(this,"name","BloomPass");s(this,"resultView");s(this,"_result");s(this,"_half1");s(this,"_half2");s(this,"_half1View");s(this,"_half2View");s(this,"_prefilterPipeline");s(this,"_blurHPipeline");s(this,"_blurVPipeline");s(this,"_compositePipeline");s(this,"_uniformBuffer");s(this,"_scratch",new Float32Array(4));s(this,"_prefilterBG");s(this,"_blurHBG");s(this,"_blurVBG");s(this,"_compositeBG");this._result=e,this.resultView=t,this._half1=r,this._half1View=o,this._half2=i,this._half2View=a,this._prefilterPipeline=l,this._blurHPipeline=c,this._blurVPipeline=d,this._compositePipeline=p,this._uniformBuffer=f,this._prefilterBG=h,this._blurHBG=_,this._blurVBG=m,this._compositeBG=b}static create(e,t){const{device:r,width:o,height:i}=e,a=Math.max(1,o>>1),l=Math.max(1,i>>1),c=r.createTexture({label:"BloomHalf1",size:{width:a,height:l},format:se,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),d=r.createTexture({label:"BloomHalf2",size:{width:a,height:l},format:se,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),p=r.createTexture({label:"BloomResult",size:{width:o,height:i},format:se,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),f=c.createView(),h=d.createView(),_=p.createView(),m=r.createBuffer({label:"BloomUniforms",size:ga,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(m,0,new Float32Array([1,.5,.3,0]).buffer);const b=r.createSampler({label:"BloomSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),y=r.createBindGroupLayout({label:"BloomSingleBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),v=r.createBindGroupLayout({label:"BloomCompositeBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),w=r.createShaderModule({label:"BloomShader",code:_a}),B=r.createShaderModule({label:"BloomComposite",code:ma}),x=r.createPipelineLayout({bindGroupLayouts:[y]}),C=r.createPipelineLayout({bindGroupLayouts:[v]});function L(G,H){return r.createRenderPipeline({label:H,layout:x,vertex:{module:w,entryPoint:"vs_main"},fragment:{module:w,entryPoint:G,targets:[{format:se}]},primitive:{topology:"triangle-list"}})}const U=L("fs_prefilter","BloomPrefilterPipeline"),I=L("fs_blur_h","BloomBlurHPipeline"),E=L("fs_blur_v","BloomBlurVPipeline"),g=r.createRenderPipeline({label:"BloomCompositePipeline",layout:C,vertex:{module:B,entryPoint:"vs_main"},fragment:{module:B,entryPoint:"fs_main",targets:[{format:se}]},primitive:{topology:"triangle-list"}});function k(G){return r.createBindGroup({layout:y,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:G},{binding:2,resource:b}]})}const P=k(t),M=k(f),S=k(h),N=r.createBindGroup({layout:v,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:t},{binding:2,resource:f},{binding:3,resource:b}]});return new Zn(p,_,c,f,d,h,U,I,E,g,m,P,M,S,N)}updateParams(e,t=1,r=.5,o=.3){this._scratch[0]=t,this._scratch[1]=r,this._scratch[2]=o,this._scratch[3]=0,e.queue.writeBuffer(this._uniformBuffer,0,this._scratch.buffer)}execute(e,t){const r=(o,i,a,l)=>{const c=e.beginRenderPass({label:o,colorAttachments:[{view:i,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});c.setPipeline(a),c.setBindGroup(0,l),c.draw(3),c.end()};r("BloomPrefilter",this._half1View,this._prefilterPipeline,this._prefilterBG);for(let o=0;o<2;o++)r("BloomBlurH",this._half2View,this._blurHPipeline,this._blurHBG),r("BloomBlurV",this._half1View,this._blurVPipeline,this._blurVBG);r("BloomComposite",this.resultView,this._compositePipeline,this._compositeBG)}destroy(){this._result.destroy(),this._half1.destroy(),this._half2.destroy(),this._uniformBuffer.destroy()}}const va=`// godray_march.wgsl — Half-resolution ray-march pass with 3D cloud-density shadowing

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
`,ba=`// godray_composite.wgsl — Blur and composite passes for volumetric godrays.
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
`,bt=se,Lt=16,ya=64;class Kn extends Be{constructor(e,t,r,o,i,a,l,c,d,p,f,h,_,m,b,y,v,w){super();s(this,"name","GodrayPass");s(this,"scattering",.3);s(this,"fogCurve",2);s(this,"maxSteps",16);s(this,"_fogA");s(this,"_fogB");s(this,"_fogAView");s(this,"_fogBView");s(this,"_hdrView");s(this,"_marchPipeline");s(this,"_blurHPipeline");s(this,"_blurVPipeline");s(this,"_compositePipeline");s(this,"_marchBG");s(this,"_blurHBG");s(this,"_blurVBG");s(this,"_compositeBG");s(this,"_marchParamsBuf");s(this,"_blurHParamsBuf");s(this,"_blurVParamsBuf");s(this,"_compParamsBuf");s(this,"_cloudDensityBuf");s(this,"_marchScratch",new Float32Array(4));s(this,"_compScratch",new Float32Array(4));s(this,"_densityScratch",new Float32Array(8));this._fogA=e,this._fogAView=t,this._fogB=r,this._fogBView=o,this._hdrView=i,this._marchPipeline=a,this._blurHPipeline=l,this._blurVPipeline=c,this._compositePipeline=d,this._marchBG=p,this._blurHBG=f,this._blurVBG=h,this._compositeBG=_,this._marchParamsBuf=m,this._blurHParamsBuf=b,this._blurVParamsBuf=y,this._compParamsBuf=v,this._cloudDensityBuf=w}static create(e,t,r,o,i,a,l){const{device:c,width:d,height:p}=e,f=Math.max(1,d>>1),h=Math.max(1,p>>1),_=c.createTexture({label:"GodrayFogA",size:{width:f,height:h},format:bt,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),m=c.createTexture({label:"GodrayFogB",size:{width:f,height:h},format:bt,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),b=_.createView(),y=m.createView(),v=c.createSampler({label:"GodraySampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),w=c.createSampler({label:"GodrayNoiseSampler",magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"mirror-repeat",addressModeV:"mirror-repeat",addressModeW:"mirror-repeat"}),B=c.createSampler({label:"GodrayCmpSampler",compare:"less-equal",magFilter:"linear",minFilter:"linear"}),x=c.createBuffer({label:"GodrayCloudDensity",size:ya,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),C=c.createBuffer({label:"GodrayMarchParams",size:Lt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});c.queue.writeBuffer(C,0,new Float32Array([.3,16,0,0]).buffer);const L=c.createBuffer({label:"GodrayBlurHParams",size:Lt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});c.queue.writeBuffer(L,0,new Float32Array([1,0,0,0]).buffer);const U=c.createBuffer({label:"GodrayBlurVParams",size:Lt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});c.queue.writeBuffer(U,0,new Float32Array([0,1,0,0]).buffer);const I=c.createBuffer({label:"GodrayCompositeParams",size:Lt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});c.queue.writeBuffer(I,0,new Float32Array([0,0,2,0]).buffer);const E=c.createShaderModule({label:"GodrayMarchShader",code:va}),g=c.createRenderPipeline({label:"GodrayMarchPipeline",layout:"auto",vertex:{module:E,entryPoint:"vs_main"},fragment:{module:E,entryPoint:"fs_march",targets:[{format:bt}]},primitive:{topology:"triangle-list"}}),k=c.createBindGroup({label:"GodrayMarchBG",layout:g.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:a}},{binding:2,resource:t.depthView},{binding:3,resource:r.shadowMapView},{binding:4,resource:B},{binding:5,resource:{buffer:C}},{binding:6,resource:{buffer:x}},{binding:7,resource:l.baseView},{binding:8,resource:l.detailView},{binding:9,resource:w}]}),P=c.createShaderModule({label:"GodrayCompositeShader",code:ba}),M=c.createRenderPipeline({label:"GodrayBlurHPipeline",layout:"auto",vertex:{module:P,entryPoint:"vs_main"},fragment:{module:P,entryPoint:"fs_blur",targets:[{format:bt}]},primitive:{topology:"triangle-list"}}),S=c.createRenderPipeline({label:"GodrayBlurVPipeline",layout:"auto",vertex:{module:P,entryPoint:"vs_main"},fragment:{module:P,entryPoint:"fs_blur",targets:[{format:bt}]},primitive:{topology:"triangle-list"}}),N=c.createRenderPipeline({label:"GodrayCompositePipeline",layout:"auto",vertex:{module:P,entryPoint:"vs_main"},fragment:{module:P,entryPoint:"fs_composite",targets:[{format:se,blend:{color:{operation:"add",srcFactor:"one",dstFactor:"one"},alpha:{operation:"add",srcFactor:"one",dstFactor:"one"}}}]},primitive:{topology:"triangle-list"}}),G=c.createBindGroup({label:"GodrayBlurHBG",layout:M.getBindGroupLayout(0),entries:[{binding:0,resource:b},{binding:1,resource:t.depthView},{binding:2,resource:v},{binding:3,resource:{buffer:L}}]}),H=c.createBindGroup({label:"GodrayBlurVBG",layout:S.getBindGroupLayout(0),entries:[{binding:0,resource:y},{binding:1,resource:t.depthView},{binding:2,resource:v},{binding:3,resource:{buffer:U}}]}),O=c.createBindGroup({label:"GodrayCompositeBG",layout:N.getBindGroupLayout(0),entries:[{binding:0,resource:b},{binding:1,resource:t.depthView},{binding:2,resource:v},{binding:3,resource:{buffer:I}},{binding:4,resource:{buffer:a}}]});return new Kn(_,b,m,y,o,g,M,S,N,k,G,H,O,C,L,U,I,x)}updateParams(e){this._marchScratch[0]=this.scattering,this._marchScratch[1]=this.maxSteps,this._marchScratch[2]=0,this._marchScratch[3]=0,e.queue.writeBuffer(this._marchParamsBuf,0,this._marchScratch.buffer),this._compScratch[0]=0,this._compScratch[1]=0,this._compScratch[2]=this.fogCurve,this._compScratch[3]=0,e.queue.writeBuffer(this._compParamsBuf,0,this._compScratch.buffer)}updateCloudDensity(e,t){const r=this._densityScratch;r[0]=t.cloudBase,r[1]=t.cloudTop,r[2]=t.coverage,r[3]=t.density,r[4]=t.windOffset[0],r[5]=t.windOffset[1],r[6]=t.extinction,r[7]=0,e.queue.writeBuffer(this._cloudDensityBuf,0,r.buffer)}execute(e,t){const r=(o,i,a,l,c=!0)=>{const d=e.beginRenderPass({label:o,colorAttachments:[{view:i,clearValue:[0,0,0,0],loadOp:c?"clear":"load",storeOp:"store"}]});d.setPipeline(a),d.setBindGroup(0,l),d.draw(3),d.end()};r("GodrayMarch",this._fogAView,this._marchPipeline,this._marchBG),r("GodrayBlurH",this._fogBView,this._blurHPipeline,this._blurHBG),r("GodrayBlurV",this._fogAView,this._blurVPipeline,this._blurVBG),r("GodrayComposite",this._hdrView,this._compositePipeline,this._compositeBG,!1)}destroy(){this._fogA.destroy(),this._fogB.destroy(),this._marchParamsBuf.destroy(),this._blurHParamsBuf.destroy(),this._blurVParamsBuf.destroy(),this._compParamsBuf.destroy(),this._cloudDensityBuf.destroy()}}const wa=`// composite.wgsl — Fog + Underwater + Tonemap merged into a single full-screen draw.
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
`,io=64,ao=96;class Jn extends Be{constructor(e,t,r,o,i,a){super();s(this,"name","CompositePass");s(this,"depthFogEnabled",!0);s(this,"depthDensity",1);s(this,"depthBegin",32);s(this,"depthEnd",128);s(this,"depthCurve",1.5);s(this,"heightFogEnabled",!1);s(this,"heightDensity",.7);s(this,"heightMin",48);s(this,"heightMax",80);s(this,"heightCurve",1);s(this,"fogColor",[1,1,1]);s(this,"_pipeline");s(this,"_bg0");s(this,"_bg1");s(this,"_bg2");s(this,"_paramsBuf");s(this,"_starBuf");s(this,"_paramsAB",new ArrayBuffer(io));s(this,"_paramsF",new Float32Array(this._paramsAB));s(this,"_paramsU",new Uint32Array(this._paramsAB));s(this,"_starScratch",new Float32Array(ao/4));this._pipeline=e,this._bg0=t,this._bg1=r,this._bg2=o,this._paramsBuf=i,this._starBuf=a}static create(e,t,r,o,i,a,l){const{device:c,format:d}=e,p=c.createBindGroupLayout({label:"CompositeBGL0",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),f=c.createBindGroupLayout({label:"CompositeBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),h=c.createBindGroupLayout({label:"CompositeBGL2",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),_=c.createSampler({label:"CompositeSampler",magFilter:"linear",minFilter:"linear"}),m=c.createBuffer({label:"CompositeParams",size:io,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),b=c.createBuffer({label:"CompositeStars",size:ao,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),y=c.createBindGroup({label:"CompositeBG0",layout:p,entries:[{binding:0,resource:t},{binding:1,resource:r},{binding:2,resource:o},{binding:3,resource:_}]}),v=c.createBindGroup({label:"CompositeBG1",layout:f,entries:[{binding:0,resource:{buffer:i}},{binding:1,resource:{buffer:a}}]}),w=c.createBindGroup({label:"CompositeBG2",layout:h,entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:b}},{binding:2,resource:{buffer:l}}]}),B=c.createShaderModule({label:"CompositeShader",code:wa}),x=c.createPipelineLayout({bindGroupLayouts:[p,f,h]}),C=c.createRenderPipeline({label:"CompositePipeline",layout:x,vertex:{module:B,entryPoint:"vs_main"},fragment:{module:B,entryPoint:"fs_main",targets:[{format:d}]},primitive:{topology:"triangle-list"}});return new Jn(C,y,v,w,m,b)}updateParams(e,t,r,o,i,a){const l=this._paramsF,c=this._paramsU;let d=0;this.depthFogEnabled&&(d|=1),this.heightFogEnabled&&(d|=2);let p=0;o&&(p|=1),i&&(p|=2),a&&(p|=4),l[0]=this.fogColor[0],l[1]=this.fogColor[1],l[2]=this.fogColor[2],l[3]=this.depthDensity,l[4]=this.depthBegin,l[5]=this.depthEnd,l[6]=this.depthCurve,l[7]=this.heightDensity,l[8]=this.heightMin,l[9]=this.heightMax,l[10]=this.heightCurve,c[11]=d,l[12]=r,l[13]=t?1:0,c[14]=p,l[15]=0,e.queue.writeBuffer(this._paramsBuf,0,this._paramsAB)}updateStars(e,t,r,o){const i=this._starScratch;i.set(t.data,0),i[16]=r.x,i[17]=r.y,i[18]=r.z,i[19]=0,i[20]=o.x,i[21]=o.y,i[22]=o.z,i[23]=0,e.queue.writeBuffer(this._starBuf,0,i.buffer)}execute(e,t){const r=e.beginRenderPass({label:"CompositePass",colorAttachments:[{view:t.getCurrentTexture().createView(),clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._pipeline),r.setBindGroup(0,this._bg0),r.setBindGroup(1,this._bg1),r.setBindGroup(2,this._bg2),r.draw(3),r.end()}destroy(){this._paramsBuf.destroy(),this._starBuf.destroy()}}const so=64*4+16+16,xa=128;class Qn extends Be{constructor(e,t,r,o,i){super();s(this,"name","GeometryPass");s(this,"_gbuffer");s(this,"_cameraBGL");s(this,"_modelBGL");s(this,"_pipelineCache",new Map);s(this,"_cameraBuffer");s(this,"_cameraBindGroup");s(this,"_modelBuffers",[]);s(this,"_modelBindGroups",[]);s(this,"_drawItems",[]);s(this,"_modelData",new Float32Array(32));s(this,"_cameraScratch",new Float32Array(so/4));this._gbuffer=e,this._cameraBGL=t,this._modelBGL=r,this._cameraBuffer=o,this._cameraBindGroup=i}static create(e,t){const{device:r}=e,o=r.createBindGroupLayout({label:"GeomCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),i=r.createBindGroupLayout({label:"GeomModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),a=r.createBuffer({label:"GeomCameraBuffer",size:so,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),l=r.createBindGroup({label:"GeomCameraBindGroup",layout:o,entries:[{binding:0,resource:{buffer:a}}]});return new Qn(t,o,i,a,l)}setDrawItems(e){this._drawItems=e}updateCamera(e,t,r,o,i,a,l,c){const d=this._cameraScratch;d.set(t.data,0),d.set(r.data,16),d.set(o.data,32),d.set(i.data,48),d[64]=a.x,d[65]=a.y,d[66]=a.z,d[67]=l,d[68]=c,e.queue.writeBuffer(this._cameraBuffer,0,d.buffer)}execute(e,t){var i,a;const{device:r}=t;this._ensurePerDrawBuffers(r,this._drawItems.length);for(let l=0;l<this._drawItems.length;l++){const c=this._drawItems[l],d=this._modelData;d.set(c.modelMatrix.data,0),d.set(c.normalMatrix.data,16),t.queue.writeBuffer(this._modelBuffers[l],0,d.buffer),(a=(i=c.material).update)==null||a.call(i,t.queue)}const o=e.beginRenderPass({label:"GeometryPass",colorAttachments:[{view:this._gbuffer.albedoRoughnessView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"},{view:this._gbuffer.normalMetallicView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});o.setBindGroup(0,this._cameraBindGroup);for(let l=0;l<this._drawItems.length;l++){const c=this._drawItems[l];o.setPipeline(this._getPipeline(r,c.material)),o.setBindGroup(1,this._modelBindGroups[l]),o.setBindGroup(2,c.material.getBindGroup(r)),o.setVertexBuffer(0,c.mesh.vertexBuffer),o.setIndexBuffer(c.mesh.indexBuffer,"uint32"),o.drawIndexed(c.mesh.indexCount)}o.end()}_getPipeline(e,t){let r=this._pipelineCache.get(t.shaderId);if(r)return r;const o=e.createShaderModule({label:`GeometryShader[${t.shaderId}]`,code:t.getShaderCode(Bt.Geometry)});return r=e.createRenderPipeline({label:`GeometryPipeline[${t.shaderId}]`,layout:e.createPipelineLayout({bindGroupLayouts:[this._cameraBGL,this._modelBGL,t.getBindGroupLayout(e)]}),vertex:{module:o,entryPoint:"vs_main",buffers:[{arrayStride:zn,attributes:Fn}]},fragment:{module:o,entryPoint:"fs_main",targets:[{format:"rgba8unorm"},{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),this._pipelineCache.set(t.shaderId,r),r}_ensurePerDrawBuffers(e,t){for(;this._modelBuffers.length<t;){const r=e.createBuffer({size:xa,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._modelBuffers.push(r),this._modelBindGroups.push(e.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:r}}]}))}}destroy(){this._cameraBuffer.destroy();for(const e of this._modelBuffers)e.destroy()}}const Ba=`// GBuffer fill pass for voxel chunk geometry.
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
`,lo=64*4+16+16,Sa=16,yt=256,Pa=2048,Ga=5,nt=Ga*4,Bn=16;class er extends Be{constructor(e,t,r,o,i,a,l,c,d,p){super();s(this,"name","WorldGeometryPass");s(this,"_gbuffer");s(this,"_device");s(this,"_opaquePipeline");s(this,"_transparentPipeline");s(this,"_propPipeline");s(this,"_cameraBuffer");s(this,"_cameraBindGroup");s(this,"_sharedBindGroup");s(this,"_chunkUniformBuffer");s(this,"_chunkBindGroup");s(this,"_slotFreeList",[]);s(this,"_slotHighWater",0);s(this,"_chunks",new Map);s(this,"_frustumPlanes",new Float32Array(24));s(this,"drawCalls",0);s(this,"triangles",0);s(this,"_cameraData",new Float32Array(lo/4));s(this,"_chunkUniformAB",new ArrayBuffer(32));s(this,"_chunkUniformF",new Float32Array(this._chunkUniformAB));s(this,"_chunkUniformU",new Uint32Array(this._chunkUniformAB));s(this,"_debugChunks",!1);this._device=e,this._gbuffer=t,this._opaquePipeline=r,this._transparentPipeline=o,this._propPipeline=i,this._cameraBuffer=a,this._cameraBindGroup=l,this._sharedBindGroup=c,this._chunkUniformBuffer=d,this._chunkBindGroup=p}static create(e,t,r){const{device:o}=e,i=o.createBindGroupLayout({label:"ChunkCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),a=o.createBindGroupLayout({label:"ChunkSharedBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),l=o.createBindGroupLayout({label:"ChunkOffsetBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform",hasDynamicOffset:!0,minBindingSize:32}}]}),c=R.MAX,d=o.createBuffer({label:"BlockDataBuffer",size:Math.max(c*Sa,16),usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),p=ri,f=new Uint32Array(c*4);for(let E=0;E<c;E++){const g=nn[E];g&&(f[E*4+0]=g.sideFace.y*p+g.sideFace.x,f[E*4+1]=g.bottomFace.y*p+g.bottomFace.x,f[E*4+2]=g.topFace.y*p+g.topFace.x)}o.queue.writeBuffer(d,0,f);const h=o.createSampler({label:"ChunkAtlasSampler",magFilter:"nearest",minFilter:"nearest",addressModeU:"repeat",addressModeV:"repeat"}),_=o.createBindGroup({label:"ChunkSharedBG",layout:a,entries:[{binding:0,resource:r.colorAtlas.view},{binding:1,resource:r.normalAtlas.view},{binding:2,resource:r.merAtlas.view},{binding:3,resource:h},{binding:4,resource:{buffer:d}}]}),m=o.createBuffer({label:"ChunkCameraBuffer",size:lo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),b=o.createBindGroup({label:"ChunkCameraBG",layout:i,entries:[{binding:0,resource:{buffer:m}}]}),y=o.createShaderModule({label:"ChunkGeometryShader",code:Ba}),v=o.createPipelineLayout({bindGroupLayouts:[i,a,l]}),w={arrayStride:nt,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32"},{shaderLocation:2,offset:16,format:"float32"}]},B=[{format:"rgba8unorm"},{format:"rgba16float"}],x=o.createRenderPipeline({label:"ChunkOpaquePipeline",layout:v,vertex:{module:y,entryPoint:"vs_main",buffers:[w]},fragment:{module:y,entryPoint:"fs_opaque",targets:B},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),C=o.createRenderPipeline({label:"ChunkTransparentPipeline",layout:v,vertex:{module:y,entryPoint:"vs_main",buffers:[w]},fragment:{module:y,entryPoint:"fs_transparent",targets:B},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),L=o.createRenderPipeline({label:"ChunkPropPipeline",layout:v,vertex:{module:y,entryPoint:"vs_prop",buffers:[w]},fragment:{module:y,entryPoint:"fs_prop",targets:B},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}}),U=o.createBuffer({label:"ChunkUniformBuffer",size:Pa*yt,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),I=o.createBindGroup({label:"ChunkOffsetBG",layout:l,entries:[{binding:0,resource:{buffer:U,size:32}}]});return new er(o,t,x,C,L,m,b,_,U,I)}updateGBuffer(e){this._gbuffer=e}addChunk(e,t){const r=this._chunks.get(e);r?this._replaceMeshBuffers(r,t):this._chunks.set(e,this._createChunkGpu(e,t))}updateChunk(e,t){const r=this._chunks.get(e);r?this._replaceMeshBuffers(r,t):this._chunks.set(e,this._createChunkGpu(e,t))}removeChunk(e){var r,o,i;const t=this._chunks.get(e);t&&((r=t.opaqueBuffer)==null||r.destroy(),(o=t.transparentBuffer)==null||o.destroy(),(i=t.propBuffer)==null||i.destroy(),this._freeSlot(t.slot),this._chunks.delete(e))}updateCamera(e,t,r,o,i,a,l,c){const d=this._cameraData;d.set(t.data,0),d.set(r.data,16),d.set(o.data,32),d.set(i.data,48),d[64]=a.x,d[65]=a.y,d[66]=a.z,d[67]=l,d[68]=c,e.queue.writeBuffer(this._cameraBuffer,0,d.buffer),this._extractFrustumPlanes(o.data)}_extractFrustumPlanes(e){const t=this._frustumPlanes;t[0]=e[3]+e[0],t[1]=e[7]+e[4],t[2]=e[11]+e[8],t[3]=e[15]+e[12],t[4]=e[3]-e[0],t[5]=e[7]-e[4],t[6]=e[11]-e[8],t[7]=e[15]-e[12],t[8]=e[3]+e[1],t[9]=e[7]+e[5],t[10]=e[11]+e[9],t[11]=e[15]+e[13],t[12]=e[3]-e[1],t[13]=e[7]-e[5],t[14]=e[11]-e[9],t[15]=e[15]-e[13],t[16]=e[2],t[17]=e[6],t[18]=e[10],t[19]=e[14],t[20]=e[3]-e[2],t[21]=e[7]-e[6],t[22]=e[11]-e[10],t[23]=e[15]-e[14]}setDebugChunks(e){if(this._debugChunks!==e){this._debugChunks=e;for(const[t,r]of this._chunks)this._writeChunkUniforms(r.slot,r.ox,r.oy,r.oz)}}_isVisible(e,t,r){const o=this._frustumPlanes,i=e+Bn,a=t+Bn,l=r+Bn;for(let c=0;c<6;c++){const d=o[c*4],p=o[c*4+1],f=o[c*4+2],h=o[c*4+3];if(d*(d>=0?i:e)+p*(p>=0?a:t)+f*(f>=0?l:r)+h<0)return!1}return!0}execute(e,t){const r=e.beginRenderPass({label:"WorldGeometryPass",colorAttachments:[{view:this._gbuffer.albedoRoughnessView,loadOp:"load",storeOp:"store"},{view:this._gbuffer.normalMetallicView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthLoadOp:"load",depthStoreOp:"store"}});r.setBindGroup(0,this._cameraBindGroup),r.setBindGroup(1,this._sharedBindGroup);let o=0,i=0;const a=[];for(const l of this._chunks.values())this._isVisible(l.ox,l.oy,l.oz)&&a.push(l);r.setPipeline(this._opaquePipeline);for(const l of a)l.opaqueBuffer&&l.opaqueCount>0&&(r.setBindGroup(2,this._chunkBindGroup,[l.slot*yt]),r.setVertexBuffer(0,l.opaqueBuffer),r.draw(l.opaqueCount),o++,i+=l.opaqueCount/3);r.setPipeline(this._transparentPipeline);for(const l of a)l.transparentBuffer&&l.transparentCount>0&&(r.setBindGroup(2,this._chunkBindGroup,[l.slot*yt]),r.setVertexBuffer(0,l.transparentBuffer),r.draw(l.transparentCount),o++,i+=l.transparentCount/3);r.setPipeline(this._propPipeline);for(const l of a)l.propBuffer&&l.propCount>0&&(r.setBindGroup(2,this._chunkBindGroup,[l.slot*yt]),r.setVertexBuffer(0,l.propBuffer),r.draw(l.propCount),o++,i+=l.propCount/3);this.drawCalls=o,this.triangles=i,r.end()}destroy(){var e,t,r;this._cameraBuffer.destroy(),this._chunkUniformBuffer.destroy();for(const o of this._chunks.values())(e=o.opaqueBuffer)==null||e.destroy(),(t=o.transparentBuffer)==null||t.destroy(),(r=o.propBuffer)==null||r.destroy();this._chunks.clear()}_allocSlot(){return this._slotFreeList.length>0?this._slotFreeList.pop():this._slotHighWater++}_freeSlot(e){this._slotFreeList.push(e)}_writeChunkUniforms(e,t,r,o){const i=t*73856093^r*19349663^o*83492791,a=(i&255)/255*.6+.4,l=(i>>8&255)/255*.6+.4,c=(i>>16&255)/255*.6+.4,d=this._chunkUniformAB,p=this._chunkUniformF,f=this._chunkUniformU;p[0]=t,p[1]=r,p[2]=o,f[3]=this._debugChunks?1:0,p[4]=a,p[5]=l,p[6]=c,p[7]=0,this._device.queue.writeBuffer(this._chunkUniformBuffer,e*yt,d)}_createChunkGpu(e,t){const r=this._allocSlot();this._writeChunkUniforms(r,e.globalPosition.x,e.globalPosition.y,e.globalPosition.z);const o={ox:e.globalPosition.x,oy:e.globalPosition.y,oz:e.globalPosition.z,slot:r,opaqueBuffer:null,opaqueCount:0,transparentBuffer:null,transparentCount:0,propBuffer:null,propCount:0};return this._replaceMeshBuffers(o,t),o}_replaceMeshBuffers(e,t){var r,o,i;if((r=e.opaqueBuffer)==null||r.destroy(),(o=e.transparentBuffer)==null||o.destroy(),(i=e.propBuffer)==null||i.destroy(),e.opaqueBuffer=null,e.transparentBuffer=null,e.propBuffer=null,e.opaqueCount=t.opaqueCount,e.transparentCount=t.transparentCount,e.propCount=t.propCount,t.opaqueCount>0){const a=this._device.createBuffer({label:"ChunkOpaqueBuf",size:t.opaqueCount*nt,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.opaque.buffer,0,t.opaqueCount*nt),e.opaqueBuffer=a}if(t.transparentCount>0){const a=this._device.createBuffer({label:"ChunkTransparentBuf",size:t.transparentCount*nt,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.transparent.buffer,0,t.transparentCount*nt),e.transparentBuffer=a}if(t.propCount>0){const a=this._device.createBuffer({label:"ChunkPropBuf",size:t.propCount*nt,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.prop.buffer,0,t.propCount*nt),e.propBuffer=a}}}const Ta=`// Depth of Field: prefilter (CoC + 2x downsample) then fused disc-blur + composite.

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
`,Ma=32;class tr extends Be{constructor(e,t,r,o,i,a,l,c,d,p){super();s(this,"name","DofPass");s(this,"resultView");s(this,"_result");s(this,"_half");s(this,"_halfView");s(this,"_prefilterPipeline");s(this,"_compositePipeline");s(this,"_uniformBuffer");s(this,"_scratch",new Float32Array(8));s(this,"_prefilterBG");s(this,"_compBG0");s(this,"_compBG1");this._result=e,this.resultView=t,this._half=r,this._halfView=o,this._prefilterPipeline=i,this._compositePipeline=a,this._uniformBuffer=l,this._prefilterBG=c,this._compBG0=d,this._compBG1=p}static create(e,t,r){const{device:o,width:i,height:a}=e,l=Math.max(1,i>>1),c=Math.max(1,a>>1),d=o.createTexture({label:"DofHalf",size:{width:l,height:c},format:se,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),p=o.createTexture({label:"DofResult",size:{width:i,height:a},format:se,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),f=d.createView(),h=p.createView(),_=o.createBuffer({label:"DofUniforms",size:Ma,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});o.queue.writeBuffer(_,0,new Float32Array([30,60,6,.1,1e3,0,0,0]).buffer);const m=o.createSampler({label:"DofSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),b=o.createBindGroupLayout({label:"DofBGL0Prefilter",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),y=o.createBindGroupLayout({label:"DofBGL0Composite",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),v=o.createBindGroupLayout({label:"DofBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),w=o.createShaderModule({label:"DofShader",code:Ta}),B=o.createRenderPipeline({label:"DofPrefilterPipeline",layout:o.createPipelineLayout({bindGroupLayouts:[b]}),vertex:{module:w,entryPoint:"vs_main"},fragment:{module:w,entryPoint:"fs_prefilter",targets:[{format:se}]},primitive:{topology:"triangle-list"}}),x=o.createRenderPipeline({label:"DofCompositePipeline",layout:o.createPipelineLayout({bindGroupLayouts:[y,v]}),vertex:{module:w,entryPoint:"vs_main"},fragment:{module:w,entryPoint:"fs_composite",targets:[{format:se}]},primitive:{topology:"triangle-list"}}),C=o.createBindGroup({label:"DofPrefilterBG",layout:b,entries:[{binding:0,resource:{buffer:_}},{binding:1,resource:t},{binding:2,resource:r},{binding:3,resource:m}]}),L=o.createBindGroup({label:"DofCompBG0",layout:y,entries:[{binding:0,resource:{buffer:_}},{binding:1,resource:t},{binding:3,resource:m}]}),U=o.createBindGroup({label:"DofCompBG1",layout:v,entries:[{binding:0,resource:f}]});return new tr(p,h,d,f,B,x,_,C,L,U)}updateParams(e,t=30,r=60,o=6,i=.1,a=1e3,l=1){this._scratch[0]=t,this._scratch[1]=r,this._scratch[2]=o,this._scratch[3]=i,this._scratch[4]=a,this._scratch[5]=l,this._scratch[6]=0,this._scratch[7]=0,e.device.queue.writeBuffer(this._uniformBuffer,0,this._scratch.buffer)}execute(e,t){{const r=e.beginRenderPass({label:"DofPrefilter",colorAttachments:[{view:this._halfView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._prefilterPipeline),r.setBindGroup(0,this._prefilterBG),r.draw(3),r.end()}{const r=e.beginRenderPass({label:"DofComposite",colorAttachments:[{view:this.resultView,clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._compositePipeline),r.setBindGroup(0,this._compBG0),r.setBindGroup(1,this._compBG1),r.draw(3),r.end()}}destroy(){this._result.destroy(),this._half.destroy(),this._uniformBuffer.destroy()}}const Aa=`// SSAO: hemisphere sampling in view space.
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
`,Ea=`// SSAO blur: 4×4 box blur to smooth raw SSAO output.

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
`,Rt="r8unorm",Sn=16,Ua=464;function Ca(){const u=new Float32Array(Sn*4);for(let n=0;n<Sn;n++){const e=Math.random(),t=Math.random()*Math.PI*2,r=Math.sqrt(1-e*e),o=.1+.9*(n/Sn)**2;u[n*4+0]=r*Math.cos(t)*o,u[n*4+1]=r*Math.sin(t)*o,u[n*4+2]=e*o,u[n*4+3]=0}return u}function ka(){const u=new Uint8Array(64);for(let n=0;n<16;n++){const e=Math.random()*Math.PI*2;u[n*4+0]=Math.round((Math.cos(e)*.5+.5)*255),u[n*4+1]=Math.round((Math.sin(e)*.5+.5)*255),u[n*4+2]=128,u[n*4+3]=255}return u}class nr extends Be{constructor(e,t,r,o,i,a,l,c,d,p,f){super();s(this,"name","SSAOPass");s(this,"aoView");s(this,"_raw");s(this,"_blurred");s(this,"_rawView");s(this,"_ssaoPipeline");s(this,"_blurPipeline");s(this,"_uniformBuffer");s(this,"_noiseTex");s(this,"_cameraScratch",new Float32Array(48));s(this,"_paramsScratch",new Float32Array(4));s(this,"_ssaoBG0");s(this,"_ssaoBG1");s(this,"_blurBG");this._raw=e,this._rawView=t,this._blurred=r,this.aoView=o,this._ssaoPipeline=i,this._blurPipeline=a,this._uniformBuffer=l,this._noiseTex=c,this._ssaoBG0=d,this._ssaoBG1=p,this._blurBG=f}static create(e,t){const{device:r,width:o,height:i}=e,a=Math.max(1,o>>1),l=Math.max(1,i>>1),c=r.createTexture({label:"SsaoRaw",size:{width:a,height:l},format:Rt,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),d=r.createTexture({label:"SsaoBlurred",size:{width:a,height:l},format:Rt,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),p=c.createView(),f=d.createView(),h=r.createTexture({label:"SsaoNoise",size:{width:4,height:4},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});r.queue.writeTexture({texture:h},ka().buffer,{bytesPerRow:4*4,rowsPerImage:4},{width:4,height:4});const _=h.createView(),m=r.createBuffer({label:"SsaoUniforms",size:Ua,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});r.queue.writeBuffer(m,208,Ca().buffer),r.queue.writeBuffer(m,192,new Float32Array([1,.005,2,0]).buffer);const b=r.createSampler({label:"SsaoBlurSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),y=r.createBindGroupLayout({label:"SsaoBGL0",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),v=r.createBindGroupLayout({label:"SsaoBGL1",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),w=r.createBindGroupLayout({label:"SsaoBlurBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),B=r.createShaderModule({label:"SsaoShader",code:Aa}),x=r.createShaderModule({label:"SsaoBlurShader",code:Ea}),C=r.createRenderPipeline({label:"SsaoPipeline",layout:r.createPipelineLayout({bindGroupLayouts:[y,v]}),vertex:{module:B,entryPoint:"vs_main"},fragment:{module:B,entryPoint:"fs_ssao",targets:[{format:Rt}]},primitive:{topology:"triangle-list"}}),L=r.createRenderPipeline({label:"SsaoBlurPipeline",layout:r.createPipelineLayout({bindGroupLayouts:[w]}),vertex:{module:x,entryPoint:"vs_main"},fragment:{module:x,entryPoint:"fs_blur",targets:[{format:Rt}]},primitive:{topology:"triangle-list"}}),U=r.createBindGroup({label:"SsaoBG0",layout:y,entries:[{binding:0,resource:{buffer:m}}]}),I=r.createBindGroup({label:"SsaoBG1",layout:v,entries:[{binding:0,resource:t.normalMetallicView},{binding:1,resource:t.depthView},{binding:2,resource:_}]}),E=r.createBindGroup({label:"SsaoBlurBG",layout:w,entries:[{binding:0,resource:p},{binding:1,resource:b}]});return new nr(c,p,d,f,C,L,m,h,U,I,E)}updateCamera(e,t,r,o){const i=this._cameraScratch;i.set(t.data,0),i.set(r.data,16),i.set(o.data,32),e.device.queue.writeBuffer(this._uniformBuffer,0,i.buffer)}updateParams(e,t=1,r=.005,o=2){this._paramsScratch[0]=t,this._paramsScratch[1]=r,this._paramsScratch[2]=o,this._paramsScratch[3]=0,e.device.queue.writeBuffer(this._uniformBuffer,192,this._paramsScratch.buffer)}execute(e,t){{const r=e.beginRenderPass({label:"SSAOPass",colorAttachments:[{view:this._rawView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._ssaoPipeline),r.setBindGroup(0,this._ssaoBG0),r.setBindGroup(1,this._ssaoBG1),r.draw(3),r.end()}{const r=e.beginRenderPass({label:"SSAOBlur",colorAttachments:[{view:this.aoView,clearValue:[1,0,0,1],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._blurPipeline),r.setBindGroup(0,this._blurBG),r.draw(3),r.end()}}destroy(){this._raw.destroy(),this._blurred.destroy(),this._uniformBuffer.destroy(),this._noiseTex.destroy()}}const La=`// Screen-Space Global Illumination — ray march pass.
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
`,Ra=`// Screen-Space Global Illumination — temporal accumulation pass.
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
`,co=368,Na={numRays:4,numSteps:16,radius:3,thickness:.5,strength:1};function Ia(){const u=new Uint8Array(new ArrayBuffer(64));for(let n=0;n<16;n++){const e=Math.random()*Math.PI*2;u[n*4+0]=Math.round((Math.cos(e)*.5+.5)*255),u[n*4+1]=Math.round((Math.sin(e)*.5+.5)*255),u[n*4+2]=128,u[n*4+3]=255}return u}class rr extends Be{constructor(e,t,r,o,i,a,l,c,d,p,f,h,_,m,b,y){super();s(this,"name","SSGIPass");s(this,"resultView");s(this,"_uniformBuffer");s(this,"_noiseTexture");s(this,"_rawTexture");s(this,"_rawView");s(this,"_historyTexture");s(this,"_resultTexture");s(this,"_ssgiPipeline");s(this,"_temporalPipeline");s(this,"_ssgiBG0");s(this,"_ssgiBG1");s(this,"_tempBG0");s(this,"_tempBG1");s(this,"_settings");s(this,"_frameIndex",0);s(this,"_scratch",new Float32Array(co/4));s(this,"_scratchU32",new Uint32Array(this._scratch.buffer));s(this,"_width");s(this,"_height");this._uniformBuffer=e,this._noiseTexture=t,this._rawTexture=r,this._rawView=o,this._historyTexture=i,this._resultTexture=a,this.resultView=l,this._ssgiPipeline=c,this._temporalPipeline=d,this._ssgiBG0=p,this._ssgiBG1=f,this._tempBG0=h,this._tempBG1=_,this._settings=m,this._width=b,this._height=y}static create(e,t,r,o=Na){const{device:i,width:a,height:l}=e,c=i.createBuffer({label:"SSGIUniforms",size:co,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),d=i.createTexture({label:"SSGINoise",size:{width:4,height:4},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});i.queue.writeTexture({texture:d},Ia(),{bytesPerRow:4*4,rowsPerImage:4},{width:4,height:4});const p=d.createView(),f=i.createTexture({label:"SSGIRaw",size:{width:a,height:l},format:se,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),h=f.createView(),_=i.createTexture({label:"SSGIHistory",size:{width:a,height:l},format:se,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),m=_.createView(),b=i.createTexture({label:"SSGIResult",size:{width:a,height:l},format:se,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),y=b.createView(),v=i.createSampler({label:"SSGILinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),w=i.createBindGroupLayout({label:"SSGIUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),B=i.createBindGroupLayout({label:"SSGITexBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),x=i.createBindGroupLayout({label:"SSGITempTexBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),C=i.createBindGroup({label:"SSGIUniformBG",layout:w,entries:[{binding:0,resource:{buffer:c}}]}),L=i.createBindGroup({label:"SSGITexBG",layout:B,entries:[{binding:0,resource:t.depthView},{binding:1,resource:t.normalMetallicView},{binding:2,resource:r},{binding:3,resource:p},{binding:4,resource:v}]}),U=i.createBindGroup({label:"SSGITempUniformBG",layout:w,entries:[{binding:0,resource:{buffer:c}}]}),I=i.createBindGroup({label:"SSGITempTexBG",layout:x,entries:[{binding:0,resource:h},{binding:1,resource:m},{binding:2,resource:t.depthView},{binding:3,resource:v}]}),E=i.createShaderModule({label:"SSGIShader",code:La}),g=i.createShaderModule({label:"SSGITempShader",code:Ra}),k=i.createRenderPipeline({label:"SSGIPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[w,B]}),vertex:{module:E,entryPoint:"vs_main"},fragment:{module:E,entryPoint:"fs_ssgi",targets:[{format:se}]},primitive:{topology:"triangle-list"}}),P=i.createRenderPipeline({label:"SSGITempPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[w,x]}),vertex:{module:g,entryPoint:"vs_main"},fragment:{module:g,entryPoint:"fs_temporal",targets:[{format:se}]},primitive:{topology:"triangle-list"}});return new rr(c,d,f,h,_,b,y,k,P,C,L,U,I,o,a,l)}updateCamera(e,t,r,o,i,a,l){const c=this._scratch;c.set(t.data,0),c.set(r.data,16),c.set(o.data,32),c.set(i.data,48),c.set(a.data,64),c[80]=l.x,c[81]=l.y,c[82]=l.z;const d=this._scratchU32;d[83]=this._settings.numRays,d[84]=this._settings.numSteps,c[85]=this._settings.radius,c[86]=this._settings.thickness,c[87]=this._settings.strength,d[88]=this._frameIndex++,e.queue.writeBuffer(this._uniformBuffer,0,c.buffer)}updateSettings(e){this._settings={...this._settings,...e}}execute(e,t){{const r=e.beginRenderPass({label:"SSGIRayMarch",colorAttachments:[{view:this._rawView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._ssgiPipeline),r.setBindGroup(0,this._ssgiBG0),r.setBindGroup(1,this._ssgiBG1),r.draw(3),r.end()}{const r=e.beginRenderPass({label:"SSGITemporal",colorAttachments:[{view:this.resultView,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]});r.setPipeline(this._temporalPipeline),r.setBindGroup(0,this._tempBG0),r.setBindGroup(1,this._tempBG1),r.draw(3),r.end()}e.copyTextureToTexture({texture:this._resultTexture},{texture:this._historyTexture},{width:this._width,height:this._height})}destroy(){this._uniformBuffer.destroy(),this._noiseTexture.destroy(),this._rawTexture.destroy(),this._historyTexture.destroy(),this._resultTexture.destroy()}}const Oa=`// VSM shadow map generation for point and spot lights.
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
`,Nt=32,It=32,ht=4,Ke=8,Ot=256,Dt=512,De=256,uo=80,Da=64,Va=6*ht,za=Va+Ke;class or extends Be{constructor(e,t,r,o,i,a,l,c,d,p,f,h,_,m){super();s(this,"name","PointSpotShadowPass");s(this,"pointVsmView");s(this,"spotVsmView");s(this,"projTexView");s(this,"_pointVsmTex");s(this,"_spotVsmTex");s(this,"_projTexArray");s(this,"_pointDepth");s(this,"_spotDepth");s(this,"_pointFaceViews");s(this,"_spotFaceViews");s(this,"_pointDepthView");s(this,"_spotDepthView");s(this,"_pointPipeline");s(this,"_spotPipeline");s(this,"_shadowBufs");s(this,"_shadowBGs");s(this,"_modelBufs",[]);s(this,"_modelBGs",[]);s(this,"_modelBGL");s(this,"_shadowScratch",new Float32Array(uo/4));s(this,"_snapshot",[]);s(this,"_pointLights",[]);s(this,"_spotLights",[]);this._pointVsmTex=e,this._spotVsmTex=t,this._projTexArray=r,this._pointDepth=o,this._spotDepth=i,this._pointFaceViews=a,this._spotFaceViews=l,this._pointDepthView=c,this._spotDepthView=d,this._pointPipeline=p,this._spotPipeline=f,this._shadowBufs=h,this._shadowBGs=_,this._modelBGL=m,this.pointVsmView=e.createView({dimension:"cube-array",arrayLayerCount:ht*6}),this.spotVsmView=t.createView({dimension:"2d-array"}),this.projTexView=r.createView({dimension:"2d-array"})}static create(e){const{device:t}=e,r=t.createTexture({label:"PointVSM",size:{width:Ot,height:Ot,depthOrArrayLayers:ht*6},format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),o=t.createTexture({label:"SpotVSM",size:{width:Dt,height:Dt,depthOrArrayLayers:Ke},format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),i=t.createTexture({label:"ProjTexArray",size:{width:De,height:De,depthOrArrayLayers:Ke},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),a=new Uint8Array(De*De*4).fill(255);for(let L=0;L<Ke;L++)t.queue.writeTexture({texture:i,origin:{x:0,y:0,z:L}},a,{bytesPerRow:De*4,rowsPerImage:De},{width:De,height:De,depthOrArrayLayers:1});const l=t.createTexture({label:"PointShadowDepth",size:{width:Ot,height:Ot},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),c=t.createTexture({label:"SpotShadowDepth",size:{width:Dt,height:Dt},format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT}),d=Array.from({length:ht*6},(L,U)=>r.createView({dimension:"2d",baseArrayLayer:U,arrayLayerCount:1})),p=Array.from({length:Ke},(L,U)=>o.createView({dimension:"2d",baseArrayLayer:U,arrayLayerCount:1})),f=l.createView(),h=c.createView(),_=t.createBindGroupLayout({label:"PSShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),m=t.createBindGroupLayout({label:"PSModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),b=[],y=[];for(let L=0;L<za;L++){const U=t.createBuffer({label:`PSShadowUniform ${L}`,size:uo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});b.push(U),y.push(t.createBindGroup({label:`PSShadowBG ${L}`,layout:_,entries:[{binding:0,resource:{buffer:U}}]}))}const v=t.createPipelineLayout({bindGroupLayouts:[_,m]}),w=t.createShaderModule({label:"PointSpotShadowShader",code:Oa}),B={module:w,buffers:[{arrayStride:zn,attributes:[Fn[0]]}]},x=t.createRenderPipeline({label:"PointShadowPipeline",layout:v,vertex:{...B,entryPoint:"vs_point"},fragment:{module:w,entryPoint:"fs_point",targets:[{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}}),C=t.createRenderPipeline({label:"SpotShadowPipeline",layout:v,vertex:{...B,entryPoint:"vs_spot"},fragment:{module:w,entryPoint:"fs_spot",targets:[{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"back"}});return new or(r,o,i,l,c,d,p,f,h,x,C,b,y,m)}update(e,t,r){this._pointLights=e,this._spotLights=t,this._snapshot=r}setProjectionTexture(e,t,r){e.copyTextureToTexture({texture:r},{texture:this._projTexArray,origin:{x:0,y:0,z:t}},{width:De,height:De,depthOrArrayLayers:1})}execute(e,t){const{device:r}=t,o=this._snapshot;this._ensureModelBuffers(r,o.length);for(let c=0;c<this._spotLights.length&&c<Ke;c++){const d=this._spotLights[c];d.projectionTexture&&this.setProjectionTexture(e,c,d.projectionTexture)}for(let c=0;c<o.length;c++)t.queue.writeBuffer(this._modelBufs[c],0,o[c].modelMatrix.data.buffer);let i=0,a=0;for(const c of this._pointLights){if(!c.castShadow||a>=ht)continue;const d=c.worldPosition(),p=c.cubeFaceViewProjs(),f=this._shadowScratch;f[16]=d.x,f[17]=d.y,f[18]=d.z,f[19]=c.radius;for(let h=0;h<6;h++){f.set(p[h].data,0),t.queue.writeBuffer(this._shadowBufs[i],0,f.buffer);const _=a*6+h,m=e.beginRenderPass({label:`PointShadow light${a} face${h}`,colorAttachments:[{view:this._pointFaceViews[_],clearValue:{r:1,g:1,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._pointDepthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"discard"}});m.setPipeline(this._pointPipeline),m.setBindGroup(0,this._shadowBGs[i]),this._drawItems(m,o),m.end(),i++}a++}let l=0;for(const c of this._spotLights){if(!c.castShadow||l>=Ke)continue;const d=c.lightViewProj(),p=c.worldPosition(),f=this._shadowScratch;f.set(d.data,0),f[16]=p.x,f[17]=p.y,f[18]=p.z,f[19]=c.range,t.queue.writeBuffer(this._shadowBufs[i],0,f.buffer);const h=e.beginRenderPass({label:`SpotShadow light${l}`,colorAttachments:[{view:this._spotFaceViews[l],clearValue:{r:1,g:1,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._spotDepthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"discard"}});h.setPipeline(this._spotPipeline),h.setBindGroup(0,this._shadowBGs[i]),this._drawItems(h,o),h.end(),i++,l++}}_drawItems(e,t){for(let r=0;r<t.length;r++){const{mesh:o}=t[r];e.setBindGroup(1,this._modelBGs[r]),e.setVertexBuffer(0,o.vertexBuffer),e.setIndexBuffer(o.indexBuffer,"uint32"),e.drawIndexed(o.indexCount)}}_ensureModelBuffers(e,t){for(;this._modelBufs.length<t;){const r=e.createBuffer({label:`PSModelUniform ${this._modelBufs.length}`,size:Da,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._modelBufs.push(r),this._modelBGs.push(e.createBindGroup({layout:this._modelBGL,entries:[{binding:0,resource:{buffer:r}}]}))}}destroy(){this._pointVsmTex.destroy(),this._spotVsmTex.destroy(),this._projTexArray.destroy(),this._pointDepth.destroy(),this._spotDepth.destroy();for(const e of this._shadowBufs)e.destroy();for(const e of this._modelBufs)e.destroy()}}const Fa=`// Water pass — forward-rendered on top of the deferred-lit HDR buffer.
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
`,fo=64*4+16+16,Ha=16,Wa=16,ja=3,Pn=ja*4,Gn=16;class ot extends Be{constructor(e,t,r,o,i,a,l,c,d,p,f,h,_,m,b){super();s(this,"name","WaterPass");s(this,"_device");s(this,"_hdrTexture");s(this,"_hdrView");s(this,"_refractionTex");s(this,"_pipeline");s(this,"_cameraBuffer");s(this,"_waterBuffer");s(this,"_cameraBG");s(this,"_waterBG");s(this,"_sceneBG");s(this,"_sceneBGL");s(this,"_chunkBGL");s(this,"_skyTexture");s(this,"_dudvTexture");s(this,"_gradientTexture");s(this,"_chunks",new Map);s(this,"_frustumPlanes",new Float32Array(24));s(this,"_cameraScratch",new Float32Array(fo/4));s(this,"_waterScratch",new Float32Array(4));this._device=e,this._hdrTexture=t,this._hdrView=r,this._refractionTex=o,this._pipeline=i,this._cameraBuffer=a,this._waterBuffer=l,this._cameraBG=c,this._waterBG=d,this._sceneBG=p,this._sceneBGL=f,this._chunkBGL=h,this._skyTexture=_,this._dudvTexture=m,this._gradientTexture=b}static create(e,t,r,o,i,a,l){const{device:c,width:d,height:p}=e,f=c.createBindGroupLayout({label:"WaterCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),h=c.createBindGroupLayout({label:"WaterUniformBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),_=c.createBindGroupLayout({label:"WaterChunkBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),m=c.createBindGroupLayout({label:"WaterSceneBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:5,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),{refractionTex:b,refractionView:y}=ot._makeRefractionTex(c,d,p),v=c.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"}),w=c.createBuffer({label:"WaterCameraBuffer",size:fo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),B=c.createBuffer({label:"WaterUniformBuffer",size:Ha,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),x=c.createBindGroup({label:"WaterCameraBG",layout:f,entries:[{binding:0,resource:{buffer:w}}]}),C=c.createBindGroup({label:"WaterUniformBG",layout:h,entries:[{binding:0,resource:{buffer:B}}]}),L=ot._makeSceneBG(c,m,y,o,a,l,i,v),U=c.createShaderModule({label:"WaterShader",code:Fa}),I=c.createPipelineLayout({bindGroupLayouts:[f,h,_,m]}),E={arrayStride:Pn,attributes:[{shaderLocation:0,offset:0,format:"float32x3"}]},g=c.createRenderPipeline({label:"WaterPipeline",layout:I,vertex:{module:U,entryPoint:"vs_main",buffers:[E]},fragment:{module:U,entryPoint:"fs_main",targets:[{format:se,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},primitive:{topology:"triangle-list",cullMode:"none"}});return new ot(c,t,r,b,g,w,B,x,C,L,m,_,i,a,l)}updateRenderTargets(e,t,r,o){this._refractionTex.destroy(),this._hdrTexture=e,this._hdrView=t,o&&(this._skyTexture=o);const{width:i,height:a}=e,{refractionTex:l,refractionView:c}=ot._makeRefractionTex(this._device,i,a);this._refractionTex=l;const d=this._device.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"});this._sceneBG=ot._makeSceneBG(this._device,this._sceneBGL,c,r,this._dudvTexture,this._gradientTexture,this._skyTexture,d)}updateCamera(e,t,r,o,i,a,l,c){const d=this._cameraScratch;d.set(t.data,0),d.set(r.data,16),d.set(o.data,32),d.set(i.data,48),d[64]=a.x,d[65]=a.y,d[66]=a.z,d[67]=l,d[68]=c,e.queue.writeBuffer(this._cameraBuffer,0,d.buffer),this._extractFrustumPlanes(o.data)}_extractFrustumPlanes(e){const t=this._frustumPlanes;t[0]=e[3]+e[0],t[1]=e[7]+e[4],t[2]=e[11]+e[8],t[3]=e[15]+e[12],t[4]=e[3]-e[0],t[5]=e[7]-e[4],t[6]=e[11]-e[8],t[7]=e[15]-e[12],t[8]=e[3]+e[1],t[9]=e[7]+e[5],t[10]=e[11]+e[9],t[11]=e[15]+e[13],t[12]=e[3]-e[1],t[13]=e[7]-e[5],t[14]=e[11]-e[9],t[15]=e[15]-e[13],t[16]=e[2],t[17]=e[6],t[18]=e[10],t[19]=e[14],t[20]=e[3]-e[2],t[21]=e[7]-e[6],t[22]=e[11]-e[10],t[23]=e[15]-e[14]}_isVisible(e,t,r){const o=this._frustumPlanes,i=e+Gn,a=t+Gn,l=r+Gn;for(let c=0;c<6;c++){const d=o[c*4],p=o[c*4+1],f=o[c*4+2],h=o[c*4+3];if(d*(d>=0?i:e)+p*(p>=0?a:t)+f*(f>=0?l:r)+h<0)return!1}return!0}updateTime(e,t,r=1){this._waterScratch[0]=t,this._waterScratch[1]=r,this._waterScratch[2]=0,this._waterScratch[3]=0,e.queue.writeBuffer(this._waterBuffer,0,this._waterScratch.buffer)}addChunk(e,t){const r=this._chunks.get(e);r?this._replaceMeshBuffer(r,t):this._chunks.set(e,this._createChunkGpu(e,t))}updateChunk(e,t){const r=this._chunks.get(e);r?this._replaceMeshBuffer(r,t):this._chunks.set(e,this._createChunkGpu(e,t))}removeChunk(e){var r;const t=this._chunks.get(e);t&&((r=t.buffer)==null||r.destroy(),t.uniformBuffer.destroy(),this._chunks.delete(e))}execute(e,t){const{width:r,height:o}=this._refractionTex;e.copyTextureToTexture({texture:this._hdrTexture},{texture:this._refractionTex},{width:r,height:o,depthOrArrayLayers:1});const i=e.beginRenderPass({label:"WaterPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}]});i.setPipeline(this._pipeline),i.setBindGroup(0,this._cameraBG),i.setBindGroup(1,this._waterBG),i.setBindGroup(3,this._sceneBG);for(const a of this._chunks.values())!a.buffer||a.vertexCount===0||this._isVisible(a.ox,a.oy,a.oz)&&(i.setBindGroup(2,a.chunkBG),i.setVertexBuffer(0,a.buffer),i.draw(a.vertexCount));i.end()}destroy(){var e;this._cameraBuffer.destroy(),this._waterBuffer.destroy(),this._refractionTex.destroy();for(const t of this._chunks.values())(e=t.buffer)==null||e.destroy(),t.uniformBuffer.destroy();this._chunks.clear()}static _makeRefractionTex(e,t,r){const o=e.createTexture({label:"WaterRefractionTex",size:{width:t,height:r},format:se,usage:GPUTextureUsage.COPY_DST|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT}),i=o.createView();return{refractionTex:o,refractionView:i}}static _makeSceneBG(e,t,r,o,i,a,l,c){return e.createBindGroup({label:"WaterSceneBG",layout:t,entries:[{binding:0,resource:r},{binding:1,resource:o},{binding:2,resource:i.view},{binding:3,resource:a.view},{binding:4,resource:l.view},{binding:5,resource:c}]})}_createChunkGpu(e,t){const r=this._device.createBuffer({label:`WaterChunkBuf(${e.globalPosition.x},${e.globalPosition.y},${e.globalPosition.z})`,size:Wa,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(r,0,new Float32Array([e.globalPosition.x,e.globalPosition.y,e.globalPosition.z,0]));const o=this._device.createBindGroup({label:"WaterChunkBG",layout:this._chunkBGL,entries:[{binding:0,resource:{buffer:r}}]}),i={ox:e.globalPosition.x,oy:e.globalPosition.y,oz:e.globalPosition.z,buffer:null,vertexCount:0,uniformBuffer:r,chunkBG:o};return this._replaceMeshBuffer(i,t),i}_replaceMeshBuffer(e,t){var r;if((r=e.buffer)==null||r.destroy(),e.buffer=null,e.vertexCount=t.waterCount,t.waterCount>0){const o=this._device.createBuffer({label:"WaterVertexBuf",size:t.waterCount*Pn,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(o,0,t.water.buffer,0,t.waterCount*Pn),e.buffer=o}}}const qa=`// Shadow pass for transparent chunk geometry — samples color atlas alpha for discard.
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
`,Ya=`// Shadow pass for prop billboards (flowers, grass, torches, etc.).
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
`,Xa=4,He=5*4;class ir extends Be{constructor(e,t,r,o,i,a,l,c,d,p,f){super();s(this,"name","WorldShadowPass");s(this,"shadowChunkRadius",4);s(this,"_camX",0);s(this,"_camZ",0);s(this,"_device");s(this,"_shadowMapArrayViews");s(this,"_pipeline");s(this,"_transparentPipeline");s(this,"_propPipeline");s(this,"_cascadeBGs");s(this,"_cascadeBuffers");s(this,"_modelBGL");s(this,"_atlasBG");s(this,"_orientBG_X");s(this,"_orientBG_Z");s(this,"_chunks",new Map);s(this,"_cascades",[]);this._device=e,this._shadowMapArrayViews=t,this._pipeline=r,this._transparentPipeline=o,this._propPipeline=i,this._cascadeBGs=a,this._cascadeBuffers=l,this._modelBGL=c,this._atlasBG=d,this._orientBG_X=p,this._orientBG_Z=f}static create(e,t,r,o){const{device:i}=e,a=i.createBindGroupLayout({label:"WorldShadowCascadeBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),l=i.createBindGroupLayout({label:"WorldShadowModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),c=i.createBindGroupLayout({label:"WorldShadowAtlasBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),d=[],p=[];for(let S=0;S<Math.min(r,Xa);S++){const N=i.createBuffer({label:`WorldShadowCascadeBuf${S}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});d.push(N),p.push(i.createBindGroup({label:`WorldShadowCascadeBG${S}`,layout:a,entries:[{binding:0,resource:{buffer:N}}]}))}const f=R.MAX,h=i.createBuffer({label:"WorldShadowBlockDataBuf",size:Math.max(f*16,16),usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),_=ri,m=new Uint32Array(f*4);for(let S=0;S<f;S++){const N=nn[S];N&&(m[S*4+0]=N.sideFace.y*_+N.sideFace.x,m[S*4+1]=N.bottomFace.y*_+N.bottomFace.x,m[S*4+2]=N.topFace.y*_+N.topFace.x)}i.queue.writeBuffer(h,0,m);const b=i.createSampler({label:"WorldShadowAtlasSampler",magFilter:"nearest",minFilter:"nearest"}),y=i.createBindGroup({label:"WorldShadowAtlasBG",layout:c,entries:[{binding:0,resource:o.colorAtlas.view},{binding:1,resource:b},{binding:2,resource:{buffer:h}}]}),v=i.createShaderModule({label:"WorldShadowShader",code:oi}),w=i.createPipelineLayout({bindGroupLayouts:[a,l]}),B=i.createRenderPipeline({label:"WorldShadowPipeline",layout:w,vertex:{module:v,entryPoint:"vs_main",buffers:[{arrayStride:He,attributes:[{shaderLocation:0,offset:0,format:"float32x3"}]}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}}),x=i.createShaderModule({label:"WorldShadowTranspShader",code:qa}),C=i.createPipelineLayout({bindGroupLayouts:[a,l,c]}),L=i.createRenderPipeline({label:"WorldShadowTransparentPipeline",layout:C,vertex:{module:x,entryPoint:"vs_main",buffers:[{arrayStride:He,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32"},{shaderLocation:2,offset:16,format:"float32"}]}]},fragment:{module:x,entryPoint:"fs_alpha_test",targets:[]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}}),U=i.createBindGroupLayout({label:"WorldShadowOrientBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),I=(S,N,G,H)=>{const O=i.createBuffer({label:S,size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return i.queue.writeBuffer(O,0,new Float32Array([N,G,H,0])),i.createBindGroup({label:S,layout:U,entries:[{binding:0,resource:{buffer:O}}]})},E=I("PropShadowOrientBG_X",1,0,0),g=I("PropShadowOrientBG_Z",0,0,1),k=i.createShaderModule({label:"WorldShadowPropShader",code:Ya}),P=i.createPipelineLayout({bindGroupLayouts:[a,l,c,U]}),M=i.createRenderPipeline({label:"WorldShadowPropPipeline",layout:P,vertex:{module:k,entryPoint:"vs_main",buffers:[{arrayStride:He,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32"},{shaderLocation:2,offset:16,format:"float32"}]}]},fragment:{module:k,entryPoint:"fs_alpha_test",targets:[]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}});return new ir(i,t,B,L,M,p,d,l,y,E,g)}update(e,t,r,o){this._cascades=t,this._camX=r,this._camZ=o;const i=Math.min(t.length,this._cascadeBuffers.length);for(let a=0;a<i;a++)e.queue.writeBuffer(this._cascadeBuffers[a],0,t[a].lightViewProj.data.buffer)}addChunk(e,t){const r=this._chunks.get(e);r?this._replaceMeshBuffer(r,t):this._chunks.set(e,this._createChunkGpu(e,t))}updateChunk(e,t){const r=this._chunks.get(e);r?this._replaceMeshBuffer(r,t):this._chunks.set(e,this._createChunkGpu(e,t))}removeChunk(e){var r,o,i;const t=this._chunks.get(e);t&&((r=t.opaqueBuffer)==null||r.destroy(),(o=t.transparentBuffer)==null||o.destroy(),(i=t.propBuffer)==null||i.destroy(),t.modelBuffer.destroy(),this._chunks.delete(e))}execute(e,t){const r=Math.min(this._cascades.length,this._cascadeBuffers.length);for(let o=0;o<r;o++){const i=e.beginRenderPass({label:`WorldShadowPass cascade ${o}`,colorAttachments:[],depthStencilAttachment:{view:this._shadowMapArrayViews[o],depthLoadOp:"load",depthStoreOp:"store"}});i.setBindGroup(0,this._cascadeBGs[o]);const a=this.shadowChunkRadius*16,l=a*a;i.setPipeline(this._pipeline);for(const c of this._chunks.values()){if(!c.opaqueBuffer||c.opaqueCount===0)continue;const d=c.ox-this._camX,p=c.oz-this._camZ;d*d+p*p>l||(i.setBindGroup(1,c.modelBG),i.setVertexBuffer(0,c.opaqueBuffer),i.draw(c.opaqueCount))}i.setPipeline(this._transparentPipeline),i.setBindGroup(2,this._atlasBG);for(const c of this._chunks.values()){if(!c.transparentBuffer||c.transparentCount===0)continue;const d=c.ox-this._camX,p=c.oz-this._camZ;d*d+p*p>l||(i.setBindGroup(1,c.modelBG),i.setVertexBuffer(0,c.transparentBuffer),i.draw(c.transparentCount))}i.setPipeline(this._propPipeline),i.setBindGroup(2,this._atlasBG);for(const c of[this._orientBG_X,this._orientBG_Z]){i.setBindGroup(3,c);for(const d of this._chunks.values()){if(!d.propBuffer||d.propCount===0)continue;const p=d.ox-this._camX,f=d.oz-this._camZ;p*p+f*f>l||(i.setBindGroup(1,d.modelBG),i.setVertexBuffer(0,d.propBuffer),i.draw(d.propCount))}}i.end()}}destroy(){var e,t,r;for(const o of this._cascadeBuffers)o.destroy();for(const o of this._chunks.values())(e=o.opaqueBuffer)==null||e.destroy(),(t=o.transparentBuffer)==null||t.destroy(),(r=o.propBuffer)==null||r.destroy(),o.modelBuffer.destroy();this._chunks.clear()}_createChunkGpu(e,t){const r=e.globalPosition,o=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,r.x,r.y,r.z,1]),i=this._device.createBuffer({label:"WorldShadowModelBuf",size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(i,0,o.buffer);const a=this._device.createBindGroup({label:"WorldShadowModelBG",layout:this._modelBGL,entries:[{binding:0,resource:{buffer:i}}]}),l={ox:r.x,oz:r.z,opaqueBuffer:null,opaqueCount:0,transparentBuffer:null,transparentCount:0,propBuffer:null,propCount:0,modelBuffer:i,modelBG:a};return this._replaceMeshBuffer(l,t),l}_replaceMeshBuffer(e,t){var r,o,i;if((r=e.opaqueBuffer)==null||r.destroy(),e.opaqueBuffer=null,e.opaqueCount=t.opaqueCount,t.opaqueCount>0){const a=this._device.createBuffer({label:"WorldShadowOpaqueBuf",size:t.opaqueCount*He,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.opaque.buffer,0,t.opaqueCount*He),e.opaqueBuffer=a}if((o=e.transparentBuffer)==null||o.destroy(),e.transparentBuffer=null,e.transparentCount=t.transparentCount,t.transparentCount>0){const a=this._device.createBuffer({label:"WorldShadowTransparentBuf",size:t.transparentCount*He,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.transparent.buffer,0,t.transparentCount*He),e.transparentBuffer=a}if((i=e.propBuffer)==null||i.destroy(),e.propBuffer=null,e.propCount=t.propCount,t.propCount>0){const a=this._device.createBuffer({label:"WorldShadowPropBuf",size:t.propCount*He,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});this._device.queue.writeBuffer(a,0,t.prop.buffer,0,t.propCount*He),e.propBuffer=a}}}const $a=`// Additive deferred pass for point and spot lights.
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
`,po=64*4+16+16,Za=8,ho=48,_o=128;class ar extends Be{constructor(e,t,r,o,i,a,l,c,d,p){super();s(this,"name","PointSpotLightPass");s(this,"_pipeline");s(this,"_cameraBG");s(this,"_gbufferBG");s(this,"_lightBG");s(this,"_shadowBG");s(this,"_cameraBuffer");s(this,"_lightCountsBuffer");s(this,"_pointBuffer");s(this,"_spotBuffer");s(this,"_hdrView");s(this,"_cameraData",new Float32Array(po/4));s(this,"_lightCountsArr",new Uint32Array(2));s(this,"_pointBuf",new ArrayBuffer(Nt*ho));s(this,"_pointF32",new Float32Array(this._pointBuf));s(this,"_pointI32",new Int32Array(this._pointBuf));s(this,"_spotBuf",new ArrayBuffer(It*_o));s(this,"_spotF32",new Float32Array(this._spotBuf));s(this,"_spotI32",new Int32Array(this._spotBuf));this._pipeline=e,this._cameraBG=t,this._gbufferBG=r,this._lightBG=o,this._shadowBG=i,this._cameraBuffer=a,this._lightCountsBuffer=l,this._pointBuffer=c,this._spotBuffer=d,this._hdrView=p}static create(e,t,r,o){const{device:i}=e,a=i.createBuffer({label:"PSLCameraBuffer",size:po,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),l=i.createBuffer({label:"PSLLightCounts",size:Za,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),c=i.createBuffer({label:"PSLPointBuffer",size:Nt*ho,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),d=i.createBuffer({label:"PSLSpotBuffer",size:It*_o,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),p=i.createSampler({label:"PSLLinearSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),f=i.createSampler({label:"PSLVsmSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge"}),h=i.createSampler({label:"PSLProjSampler",magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),_=i.createBindGroupLayout({label:"PSLCameraBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),m=i.createBindGroupLayout({label:"PSLGBufferBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"depth"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),b=i.createBindGroupLayout({label:"PSLLightBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"read-only-storage"}}]}),y=i.createBindGroupLayout({label:"PSLShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"cube-array"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d-array"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d-array"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),v=i.createBindGroup({label:"PSLCameraBG",layout:_,entries:[{binding:0,resource:{buffer:a}}]}),w=i.createBindGroup({label:"PSLGBufferBG",layout:m,entries:[{binding:0,resource:t.albedoRoughnessView},{binding:1,resource:t.normalMetallicView},{binding:2,resource:t.depthView},{binding:3,resource:p}]}),B=i.createBindGroup({label:"PSLLightBG",layout:b,entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:{buffer:c}},{binding:2,resource:{buffer:d}}]}),x=i.createBindGroup({label:"PSLShadowBG",layout:y,entries:[{binding:0,resource:r.pointVsmView},{binding:1,resource:r.spotVsmView},{binding:2,resource:r.projTexView},{binding:3,resource:f},{binding:4,resource:h}]}),C=i.createShaderModule({label:"PointSpotLightShader",code:$a}),L=i.createRenderPipeline({label:"PointSpotLightPipeline",layout:i.createPipelineLayout({bindGroupLayouts:[_,m,b,y]}),vertex:{module:C,entryPoint:"vs_main"},fragment:{module:C,entryPoint:"fs_main",targets:[{format:se,blend:{color:{srcFactor:"one",dstFactor:"one",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one",operation:"add"}}}]},primitive:{topology:"triangle-list"}});return new ar(L,v,w,B,x,a,l,c,d,o)}updateCamera(e,t,r,o,i,a,l,c){const d=this._cameraData;d.set(t.data,0),d.set(r.data,16),d.set(o.data,32),d.set(i.data,48),d[64]=a.x,d[65]=a.y,d[66]=a.z,d[67]=l,d[68]=c,e.queue.writeBuffer(this._cameraBuffer,0,d.buffer)}updateLights(e,t,r){const o=this._lightCountsArr;o[0]=Math.min(t.length,Nt),o[1]=Math.min(r.length,It),e.queue.writeBuffer(this._lightCountsBuffer,0,o.buffer);const i=this._pointF32,a=this._pointI32;let l=0;for(let f=0;f<Math.min(t.length,Nt);f++){const h=t[f],_=h.worldPosition(),m=f*12;i[m+0]=_.x,i[m+1]=_.y,i[m+2]=_.z,i[m+3]=h.radius,i[m+4]=h.color.x,i[m+5]=h.color.y,i[m+6]=h.color.z,i[m+7]=h.intensity,h.castShadow&&l<ht?a[m+8]=l++:a[m+8]=-1,a[m+9]=0,a[m+10]=0,a[m+11]=0}e.queue.writeBuffer(this._pointBuffer,0,this._pointBuf);const c=this._spotF32,d=this._spotI32;let p=0;for(let f=0;f<Math.min(r.length,It);f++){const h=r[f],_=h.worldPosition(),m=h.worldDirection(),b=h.lightViewProj(),y=f*32;c[y+0]=_.x,c[y+1]=_.y,c[y+2]=_.z,c[y+3]=h.range,c[y+4]=m.x,c[y+5]=m.y,c[y+6]=m.z,c[y+7]=Math.cos(h.innerAngle*Math.PI/180),c[y+8]=h.color.x,c[y+9]=h.color.y,c[y+10]=h.color.z,c[y+11]=Math.cos(h.outerAngle*Math.PI/180),c[y+12]=h.intensity,h.castShadow&&p<Ke?d[y+13]=p++:d[y+13]=-1,d[y+14]=h.projectionTexture!==null?f:-1,d[y+15]=0,c.set(b.data,y+16)}e.queue.writeBuffer(this._spotBuffer,0,this._spotBuf)}updateLight(e){e.computeLightViewProj()}execute(e,t){const r=e.beginRenderPass({label:"PointSpotLightPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}]});r.setPipeline(this._pipeline),r.setBindGroup(0,this._cameraBG),r.setBindGroup(1,this._gbufferBG),r.setBindGroup(2,this._lightBG),r.setBindGroup(3,this._shadowBG),r.draw(3),r.end()}destroy(){this._cameraBuffer.destroy(),this._lightCountsBuffer.destroy(),this._pointBuffer.destroy(),this._spotBuffer.destroy()}}const ii=`
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
`;function Ka(u){switch(u.kind){case"sphere":{const n=Math.cos(u.solidAngle).toFixed(6),e=u.radius.toFixed(6);return`{
  let dir = sample_cone(seed + 10u, seed + 11u, ${n});
  let world_dir = quat_rotate(uniforms.world_quat, dir);
  p.position = uniforms.world_pos + world_dir * ${e};
  p.velocity = world_dir * speed;
}`}case"cone":{const n=Math.cos(u.angle).toFixed(6),e=u.radius.toFixed(6);return`{
  let dir = sample_cone(seed + 10u, seed + 11u, ${n});
  let world_dir = quat_rotate(uniforms.world_quat, dir);
  p.position = uniforms.world_pos + world_dir * ${e};
  p.velocity = world_dir * speed;
}`}case"box":{const[n,e,t]=u.halfExtents.map(r=>r.toFixed(6));return`{
  let local_off = vec3<f32>(
    (rand_f32(seed + 10u) * 2.0 - 1.0) * ${n},
    (rand_f32(seed + 11u) * 2.0 - 1.0) * ${e},
    (rand_f32(seed + 12u) * 2.0 - 1.0) * ${t},
  );
  let up = quat_rotate(uniforms.world_quat, vec3<f32>(0.0, 1.0, 0.0));
  p.position = uniforms.world_pos + quat_rotate(uniforms.world_quat, local_off);
  p.velocity = up * speed;
}`}}}function ai(u){switch(u.type){case"gravity":return`p.velocity.y -= ${u.strength.toFixed(6)} * uniforms.dt;`;case"drag":return`p.velocity -= p.velocity * ${u.coefficient.toFixed(6)} * uniforms.dt;`;case"force":{const[n,e,t]=u.direction.map(r=>r.toFixed(6));return`p.velocity += vec3<f32>(${n}, ${e}, ${t}) * ${u.strength.toFixed(6)} * uniforms.dt;`}case"swirl_force":{const n=u.speed.toFixed(6),e=u.strength.toFixed(6);return`{
  let swirl_angle = uniforms.time * ${n};
  p.velocity += vec3<f32>(cos(swirl_angle), 0.0, sin(swirl_angle)) * ${e} * uniforms.dt;
}`}case"vortex":return`{
  let vx_radial = p.position.xz - uniforms.world_pos.xz;
  p.velocity += vec3<f32>(-vx_radial.y, 0.0, vx_radial.x) * ${u.strength.toFixed(6)} * uniforms.dt;
}`;case"curl_noise":{const n=u.octaves??1,e=n>1?`curl_noise_fbm(cn_pos, ${n})`:"curl_noise(cn_pos)";return`{
  let cn_pos = p.position * ${u.scale.toFixed(6)} + uniforms.time * ${u.timeScale.toFixed(6)};
  p.velocity += ${e} * ${u.strength.toFixed(6)} * uniforms.dt;
}`}case"size_random":return`p.size = rand_range(${u.min.toFixed(6)}, ${u.max.toFixed(6)}, pcg_hash(idx * 2654435761u));`;case"size_over_lifetime":return`p.size = mix(${u.start.toFixed(6)}, ${u.end.toFixed(6)}, t);`;case"color_over_lifetime":{const[n,e,t,r]=u.startColor.map(c=>c.toFixed(6)),[o,i,a,l]=u.endColor.map(c=>c.toFixed(6));return`p.color = mix(vec4<f32>(${n}, ${e}, ${t}, ${r}), vec4<f32>(${o}, ${i}, ${a}, ${l}), t);`}case"block_collision":return`{
  let _bc_uv = (p.position.xz - vec2<f32>(hm.origin_x, hm.origin_z)) / (hm.extent * 2.0) + 0.5;
  if (all(_bc_uv >= vec2<f32>(0.0)) && all(_bc_uv <= vec2<f32>(1.0))) {
    let _bc_xi = clamp(u32(_bc_uv.x * f32(hm.resolution)), 0u, hm.resolution - 1u);
    let _bc_zi = clamp(u32(_bc_uv.y * f32(hm.resolution)), 0u, hm.resolution - 1u);
    if (p.position.y <= hm_data[_bc_zi * hm.resolution + _bc_xi]) {
      particles[idx].life = -1.0; return;
    }
  }
}`}}function si(u,n){return u?u.filter(e=>e.trigger===n).flatMap(e=>e.actions.map(ai)).join(`
  `):""}function Ja(u){const{emitter:n,events:e}=u,[t,r]=n.lifetime.map(h=>h.toFixed(6)),[o,i]=n.initialSpeed.map(h=>h.toFixed(6)),[a,l]=n.initialSize.map(h=>h.toFixed(6)),[c,d,p,f]=n.initialColor.map(h=>h.toFixed(6));return`
${ii}

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
  p.color    = vec4<f32>(${c}, ${d}, ${p}, ${f});
  p.size     = rand_range(${a}, ${l}, seed + 3u);
  p.rotation = rand_f32(seed + 4u) * 6.28318530717958647;

  ${Ka(n.shape)}

  ${si(e,"on_spawn")}

  particles[idx] = p;
}
`}function Qa(u){return u.modifiers.some(n=>n.type==="block_collision")}const es=`
struct HeightmapUniforms {
  origin_x  : f32,
  origin_z  : f32,
  extent    : f32,
  resolution: u32,
}
@group(2) @binding(0) var<storage, read> hm_data: array<f32>;
@group(2) @binding(1) var<uniform>       hm     : HeightmapUniforms;
`;function ts(u){const n=u.modifiers.some(r=>r.type==="block_collision"),e=u.modifiers.map(ai).join(`
  `),t=si(u.events,"on_death");return`
${ii}
${n?es:""}

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
`}const ns=`// Compact pass — rebuilds alive_list and writes indirect draw instance count.
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
`,rs=`// Particle GBuffer render pass — camera-facing billboard quads.
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
`,os=`// Particle forward HDR render pass — velocity-aligned billboard quads.
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
`,mo=64,go=80,is=16,as=16,vo=288,bo=16,Tn=128;class sr extends Be{constructor(e,t,r,o,i,a,l,c,d,p,f,h,_,m,b,y,v,w,B,x,C,L,U,I,E,g,k){super();s(this,"name","ParticlePass");s(this,"_gbuffer");s(this,"_hdrView");s(this,"_isForward");s(this,"_maxParticles");s(this,"_config");s(this,"_particleBuffer");s(this,"_aliveList");s(this,"_counterBuffer");s(this,"_indirectBuffer");s(this,"_computeUniforms");s(this,"_renderUniforms");s(this,"_cameraBuffer");s(this,"_spawnPipeline");s(this,"_updatePipeline");s(this,"_compactPipeline");s(this,"_indirectPipeline");s(this,"_renderPipeline");s(this,"_computeDataBG");s(this,"_computeUniBG");s(this,"_compactDataBG");s(this,"_compactUniBG");s(this,"_renderDataBG");s(this,"_cameraRenderBG");s(this,"_renderParamsBG");s(this,"_heightmapDataBuf");s(this,"_heightmapUniBuf");s(this,"_heightmapBG");s(this,"_spawnAccum",0);s(this,"_spawnOffset",0);s(this,"_spawnCount",0);s(this,"_time",0);s(this,"_frameSeed",0);s(this,"_cuBuf",new Float32Array(go/4));s(this,"_cuiView",new Uint32Array(this._cuBuf.buffer));s(this,"_camBuf",new Float32Array(vo/4));s(this,"_hmUniBuf",new Float32Array(bo/4));s(this,"_hmRes",new Uint32Array([Tn]));s(this,"_resetArr",new Uint32Array(1));this._gbuffer=e,this._hdrView=t,this._isForward=r,this._config=o,this._maxParticles=i,this._particleBuffer=a,this._aliveList=l,this._counterBuffer=c,this._indirectBuffer=d,this._computeUniforms=p,this._renderUniforms=f,this._cameraBuffer=h,this._spawnPipeline=_,this._updatePipeline=m,this._compactPipeline=b,this._indirectPipeline=y,this._renderPipeline=v,this._computeDataBG=w,this._computeUniBG=B,this._compactDataBG=x,this._compactUniBG=C,this._renderDataBG=L,this._cameraRenderBG=U,this._renderParamsBG=I,this._heightmapDataBuf=E,this._heightmapUniBuf=g,this._heightmapBG=k}static create(e,t,r,o){const{device:i}=e,a=t.renderer.type==="sprites"&&t.renderer.renderTarget==="hdr",l=t.emitter.maxParticles,c=i.createBuffer({label:"ParticleBuffer",size:l*mo,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),d=new Float32Array(l*(mo/4));for(let J=0;J<l;J++)d[J*16+3]=-1;i.queue.writeBuffer(c,0,d.buffer);const p=i.createBuffer({label:"ParticleAliveList",size:l*4,usage:GPUBufferUsage.STORAGE}),f=i.createBuffer({label:"ParticleCounter",size:4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),h=i.createBuffer({label:"ParticleIndirect",size:16,usage:GPUBufferUsage.INDIRECT|GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});i.queue.writeBuffer(h,0,new Uint32Array([6,0,0,0]));const _=i.createBuffer({label:"ParticleComputeUniforms",size:go,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),m=i.createBuffer({label:"ParticleCompactUniforms",size:is,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});i.queue.writeBuffer(m,0,new Uint32Array([l,0,0,0]));const b=i.createBuffer({label:"ParticleRenderUniforms",size:as,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});i.queue.writeBuffer(b,0,new Float32Array([t.emitter.roughness,t.emitter.metallic,0,0]));const y=i.createBuffer({label:"ParticleCameraBuffer",size:vo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),v=i.createBindGroupLayout({label:"ParticleComputeDataBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),w=i.createBindGroupLayout({label:"ParticleCompactDataBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),B=i.createBindGroupLayout({label:"ParticleComputeUniBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),x=i.createBindGroupLayout({label:"ParticleRenderDataBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.VERTEX,buffer:{type:"read-only-storage"}}]}),C=i.createBindGroupLayout({label:"ParticleCameraRenderBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),L=i.createBindGroupLayout({label:"ParticleRenderParamsBGL",entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),U=i.createBindGroup({label:"ParticleComputeDataBG",layout:v,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:p}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:h}}]}),I=i.createBindGroup({label:"ParticleCompactDataBG",layout:w,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:p}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:h}}]}),E=i.createBindGroup({label:"ParticleComputeUniBG",layout:B,entries:[{binding:0,resource:{buffer:_}}]}),g=i.createBindGroup({label:"ParticleCompactUniBG",layout:B,entries:[{binding:0,resource:{buffer:m}}]}),k=i.createBindGroup({label:"ParticleRenderDataBG",layout:x,entries:[{binding:0,resource:{buffer:c}},{binding:1,resource:{buffer:p}}]}),P=i.createBindGroup({label:"ParticleCameraRenderBG",layout:C,entries:[{binding:0,resource:{buffer:y}}]}),M=i.createBindGroup({label:"ParticleRenderParamsBG",layout:L,entries:[{binding:0,resource:{buffer:b}}]});let S,N,G,H;Qa(t)&&(S=i.createBuffer({label:"ParticleHeightmapData",size:Tn*Tn*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),N=i.createBuffer({label:"ParticleHeightmapUniforms",size:bo,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),H=i.createBindGroupLayout({label:"ParticleHeightmapBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),G=i.createBindGroup({label:"ParticleHeightmapBG",layout:H,entries:[{binding:0,resource:{buffer:S}},{binding:1,resource:{buffer:N}}]}));const O=i.createPipelineLayout({bindGroupLayouts:[v,B]}),T=H?i.createPipelineLayout({bindGroupLayouts:[v,B,H]}):i.createPipelineLayout({bindGroupLayouts:[v,B]}),z=i.createPipelineLayout({bindGroupLayouts:[w,B]}),ie=i.createShaderModule({label:"ParticleSpawn",code:Ja(t)}),le=i.createShaderModule({label:"ParticleUpdate",code:ts(t)}),re=i.createShaderModule({label:"ParticleCompact",code:ns}),oe=i.createComputePipeline({label:"ParticleSpawnPipeline",layout:O,compute:{module:ie,entryPoint:"cs_main"}}),Z=i.createComputePipeline({label:"ParticleUpdatePipeline",layout:T,compute:{module:le,entryPoint:"cs_main"}}),Q=i.createComputePipeline({label:"ParticleCompactPipeline",layout:z,compute:{module:re,entryPoint:"cs_compact"}}),D=i.createComputePipeline({label:"ParticleIndirectPipeline",layout:z,compute:{module:re,entryPoint:"cs_write_indirect"}});let F;if(a){const J=t.renderer.type==="sprites"?t.renderer.billboard:"camera",X=J==="camera"?"vs_camera":"vs_main",fe=J==="camera"?"fs_snow":"fs_main",ve=i.createShaderModule({label:"ParticleRenderForward",code:os}),ce=i.createPipelineLayout({bindGroupLayouts:[x,C]});F=i.createRenderPipeline({label:"ParticleForwardPipeline",layout:ce,vertex:{module:ve,entryPoint:X},fragment:{module:ve,entryPoint:fe,targets:[{format:se,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},depthStencil:{format:"depth32float",depthWriteEnabled:!1,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}})}else{const J=i.createShaderModule({label:"ParticleRender",code:rs}),X=i.createPipelineLayout({bindGroupLayouts:[x,C,L]});F=i.createRenderPipeline({label:"ParticleRenderPipeline",layout:X,vertex:{module:J,entryPoint:"vs_main"},fragment:{module:J,entryPoint:"fs_main",targets:[{format:"rgba8unorm"},{format:"rgba16float"}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{topology:"triangle-list",cullMode:"none"}})}return new sr(r,o,a,t,l,c,p,f,h,_,b,y,oe,Z,Q,D,F,U,E,I,g,k,P,a?void 0:M,S,N,G)}updateHeightmap(e,t,r,o,i){if(!this._heightmapDataBuf||!this._heightmapUniBuf)return;e.queue.writeBuffer(this._heightmapDataBuf,0,t.buffer);const a=this._hmUniBuf;a[0]=r,a[1]=o,a[2]=i,e.queue.writeBuffer(this._heightmapUniBuf,0,a.buffer,0,12),e.queue.writeBuffer(this._heightmapUniBuf,12,this._hmRes)}update(e,t,r,o,i,a,l,c,d,p){this._time+=t,this._frameSeed=this._frameSeed+1&4294967295,this._spawnAccum+=this._config.emitter.spawnRate*t,this._spawnCount=Math.min(Math.floor(this._spawnAccum),this._maxParticles),this._spawnAccum-=this._spawnCount;const f=p.data,h=f[12],_=f[13],m=f[14],b=Math.hypot(f[0],f[1],f[2]),y=Math.hypot(f[4],f[5],f[6]),v=Math.hypot(f[8],f[9],f[10]),w=f[0]/b,B=f[1]/b,x=f[2]/b,C=f[4]/y,L=f[5]/y,U=f[6]/y,I=f[8]/v,E=f[9]/v,g=f[10]/v,k=w+L+g;let P,M,S,N;if(k>0){const T=.5/Math.sqrt(k+1);N=.25/T,P=(U-E)*T,M=(I-x)*T,S=(B-C)*T}else if(w>L&&w>g){const T=2*Math.sqrt(1+w-L-g);N=(U-E)/T,P=.25*T,M=(C+B)/T,S=(I+x)/T}else if(L>g){const T=2*Math.sqrt(1+L-w-g);N=(I-x)/T,P=(C+B)/T,M=.25*T,S=(E+U)/T}else{const T=2*Math.sqrt(1+g-w-L);N=(B-C)/T,P=(I+x)/T,M=(E+U)/T,S=.25*T}const G=this._cuBuf,H=this._cuiView;G[0]=h,G[1]=_,G[2]=m,H[3]=this._spawnCount,G[4]=P,G[5]=M,G[6]=S,G[7]=N,H[8]=this._spawnOffset,H[9]=this._maxParticles,H[10]=this._frameSeed,H[11]=0,G[12]=t,G[13]=this._time,e.queue.writeBuffer(this._computeUniforms,0,G.buffer),e.queue.writeBuffer(this._counterBuffer,0,this._resetArr),this._spawnOffset=(this._spawnOffset+this._spawnCount)%this._maxParticles;const O=this._camBuf;O.set(r.data,0),O.set(o.data,16),O.set(i.data,32),O.set(a.data,48),O[64]=l.x,O[65]=l.y,O[66]=l.z,O[67]=c,O[68]=d,e.queue.writeBuffer(this._cameraBuffer,0,O.buffer)}execute(e,t){const r=e.beginComputePass({label:"ParticleCompute"});if(this._spawnCount>0&&(r.setPipeline(this._spawnPipeline),r.setBindGroup(0,this._computeDataBG),r.setBindGroup(1,this._computeUniBG),r.dispatchWorkgroups(Math.ceil(this._spawnCount/64))),r.setPipeline(this._updatePipeline),r.setBindGroup(0,this._computeDataBG),r.setBindGroup(1,this._computeUniBG),this._heightmapBG&&r.setBindGroup(2,this._heightmapBG),r.dispatchWorkgroups(Math.ceil(this._maxParticles/64)),r.setPipeline(this._compactPipeline),r.setBindGroup(0,this._compactDataBG),r.setBindGroup(1,this._compactUniBG),r.dispatchWorkgroups(Math.ceil(this._maxParticles/64)),r.setPipeline(this._indirectPipeline),r.dispatchWorkgroups(1),r.end(),this._isForward){const o=e.beginRenderPass({label:"ParticleForwardPass",colorAttachments:[{view:this._hdrView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthReadOnly:!0}});o.setPipeline(this._renderPipeline),o.setBindGroup(0,this._renderDataBG),o.setBindGroup(1,this._cameraRenderBG),o.drawIndirect(this._indirectBuffer,0),o.end()}else{const o=e.beginRenderPass({label:"ParticleGBufferPass",colorAttachments:[{view:this._gbuffer.albedoRoughnessView,loadOp:"load",storeOp:"store"},{view:this._gbuffer.normalMetallicView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this._gbuffer.depthView,depthLoadOp:"load",depthStoreOp:"store"}});o.setPipeline(this._renderPipeline),o.setBindGroup(0,this._renderDataBG),o.setBindGroup(1,this._cameraRenderBG),o.setBindGroup(2,this._renderParamsBG),o.drawIndirect(this._indirectBuffer,0),o.end()}}destroy(){var e,t;this._particleBuffer.destroy(),this._aliveList.destroy(),this._counterBuffer.destroy(),this._indirectBuffer.destroy(),this._computeUniforms.destroy(),this._renderUniforms.destroy(),this._cameraBuffer.destroy(),(e=this._heightmapDataBuf)==null||e.destroy(),(t=this._heightmapUniBuf)==null||t.destroy()}}const ss=`// Auto-exposure — two-pass histogram approach.
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
`,ls=64,cs=32,us=16,ds=ls*4,yo={adaptSpeed:1.5,minExposure:.1,maxExposure:10,lowPct:.05,highPct:.02},it=class it extends Be{constructor(e,t,r,o,i,a,l,c){super();s(this,"name","AutoExposurePass");s(this,"exposureBuffer");s(this,"_histogramPipeline");s(this,"_adaptPipeline");s(this,"_bindGroup");s(this,"_paramsBuffer");s(this,"_histogramBuffer");s(this,"_hdrWidth");s(this,"_hdrHeight");s(this,"enabled",!0);s(this,"_resetScratch",new Float32Array([1,0,0,0]));this._histogramPipeline=e,this._adaptPipeline=t,this._bindGroup=r,this._paramsBuffer=o,this._histogramBuffer=i,this.exposureBuffer=a,this._hdrWidth=l,this._hdrHeight=c}static create(e,t,r=yo){const{device:o}=e,i=o.createBindGroupLayout({label:"AutoExposureBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}]}),a=o.createBuffer({label:"AutoExposureHistogram",size:ds,usage:GPUBufferUsage.STORAGE}),l=o.createBuffer({label:"AutoExposureValue",size:us,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});o.queue.writeBuffer(l,0,new Float32Array([1,0,0,0]));const c=o.createBuffer({label:"AutoExposureParams",size:cs,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});it._writeParams(o,c,0,r);const d=o.createBindGroup({label:"AutoExposureBG",layout:i,entries:[{binding:0,resource:t.createView()},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:c}}]}),p=o.createPipelineLayout({bindGroupLayouts:[i]}),f=o.createShaderModule({label:"AutoExposure",code:ss}),h=o.createComputePipeline({label:"AutoExposureHistogramPipeline",layout:p,compute:{module:f,entryPoint:"cs_histogram"}}),_=o.createComputePipeline({label:"AutoExposureAdaptPipeline",layout:p,compute:{module:f,entryPoint:"cs_adapt"}});return new it(h,_,d,c,a,l,t.width,t.height)}update(e,t,r=yo){if(!this.enabled){e.device.queue.writeBuffer(this.exposureBuffer,0,this._resetScratch);return}it._writeParams(e.device,this._paramsBuffer,t,r)}execute(e,t){if(!this.enabled)return;const r=e.beginComputePass({label:"AutoExposurePass"});r.setPipeline(this._histogramPipeline),r.setBindGroup(0,this._bindGroup),r.dispatchWorkgroups(Math.ceil(this._hdrWidth/32),Math.ceil(this._hdrHeight/32)),r.setPipeline(this._adaptPipeline),r.dispatchWorkgroups(1),r.end()}destroy(){this._paramsBuffer.destroy(),this._histogramBuffer.destroy(),this.exposureBuffer.destroy()}static _writeParams(e,t,r,o){const i=it._paramsScratch;i[0]=r,i[1]=o.adaptSpeed,i[2]=o.minExposure,i[3]=o.maxExposure,i[4]=o.lowPct,i[5]=o.highPct,i[6]=0,i[7]=0,e.queue.writeBuffer(t,0,i)}};s(it,"_paramsScratch",new Float32Array(8));let Ln=it;function fs(u,n,e){let t=(Math.imul(u,1664525)^Math.imul(n,1013904223)^Math.imul(e,22695477))>>>0;return t=Math.imul(t^t>>>16,73244475)>>>0,t=Math.imul(t^t>>>16,73244475)>>>0,((t^t>>>16)>>>0)/4294967295}function Zt(u,n,e,t){return fs(u^t,n^t*7+3,e^t*13+5)}function Mn(u){return u*u*u*(u*(u*6-15)+10)}function ps(u,n,e,t,r,o,i,a,l,c,d){const p=u+(n-u)*l,f=e+(t-e)*l,h=r+(o-r)*l,_=i+(a-i)*l,m=p+(f-p)*c,b=h+(_-h)*c;return m+(b-m)*d}const hs=new Int8Array([1,-1,1,-1,1,-1,1,-1,0,0,0,0]),_s=new Int8Array([1,1,-1,-1,0,0,0,0,1,-1,1,-1]),ms=new Int8Array([0,0,0,0,1,1,-1,-1,1,1,-1,-1]);function $e(u,n,e,t,r,o,i,a){const l=(u%t+t)%t,c=(n%t+t)%t,d=(e%t+t)%t,p=Math.floor(Zt(l,c,d,r)*12)%12;return hs[p]*o+_s[p]*i+ms[p]*a}function gs(u,n,e,t,r){const o=Math.floor(u),i=Math.floor(n),a=Math.floor(e),l=u-o,c=n-i,d=e-a,p=Mn(l),f=Mn(c),h=Mn(d);return ps($e(o,i,a,t,r,l,c,d),$e(o+1,i,a,t,r,l-1,c,d),$e(o,i+1,a,t,r,l,c-1,d),$e(o+1,i+1,a,t,r,l-1,c-1,d),$e(o,i,a+1,t,r,l,c,d-1),$e(o+1,i,a+1,t,r,l-1,c,d-1),$e(o,i+1,a+1,t,r,l,c-1,d-1),$e(o+1,i+1,a+1,t,r,l-1,c-1,d-1),p,f,h)}function vs(u,n,e,t,r,o){let i=0,a=.5,l=1,c=0;for(let d=0;d<t;d++)i+=gs(u*l,n*l,e*l,r*l,o+d*17)*a,c+=a,a*=.5,l*=2;return Math.max(0,Math.min(1,i/c*.85+.5))}function ut(u,n,e,t,r){const o=u*t,i=n*t,a=e*t,l=Math.floor(o),c=Math.floor(i),d=Math.floor(a);let p=1/0;for(let f=-1;f<=1;f++)for(let h=-1;h<=1;h++)for(let _=-1;_<=1;_++){const m=l+_,b=c+h,y=d+f,v=(m%t+t)%t,w=(b%t+t)%t,B=(y%t+t)%t,x=m+Zt(v,w,B,r),C=b+Zt(v,w,B,r+1),L=y+Zt(v,w,B,r+2),U=o-x,I=i-C,E=a-L,g=U*U+I*I+E*E;g<p&&(p=g)}return 1-Math.min(Math.sqrt(p),1)}function wo(u,n,e,t){const r=u.createTexture({label:n,dimension:"3d",size:{width:e,height:e,depthOrArrayLayers:e},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return u.queue.writeTexture({texture:r},t.buffer,{bytesPerRow:e*4,rowsPerImage:e},{width:e,height:e,depthOrArrayLayers:e}),r}function bs(u){const e=new Uint8Array(1048576);for(let a=0;a<64;a++)for(let l=0;l<64;l++)for(let c=0;c<64;c++){const d=(a*64*64+l*64+c)*4,p=c/64,f=l/64,h=a/64,_=vs(p,f,h,4,4,0),m=ut(p,f,h,2,100),b=ut(p,f,h,4,200),y=ut(p,f,h,8,300);e[d]=Math.round(_*255),e[d+1]=Math.round(m*255),e[d+2]=Math.round(b*255),e[d+3]=Math.round(y*255)}const t=32,r=new Uint8Array(t*t*t*4);for(let a=0;a<t;a++)for(let l=0;l<t;l++)for(let c=0;c<t;c++){const d=(a*t*t+l*t+c)*4,p=c/t,f=l/t,h=a/t,_=ut(p,f,h,4,400),m=ut(p,f,h,8,500),b=ut(p,f,h,16,600);r[d]=Math.round(_*255),r[d+1]=Math.round(m*255),r[d+2]=Math.round(b*255),r[d+3]=255}const o=wo(u,"CloudBaseNoise",64,e),i=wo(u,"CloudDetailNoise",t,r);return{baseNoise:o,baseView:o.createView({dimension:"3d"}),detailNoise:i,detailView:i.createView({dimension:"3d"}),destroy(){o.destroy(),i.destroy()}}}const ys=`// IBL baking — two compute entry points share the same bind group layout.
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
`,Vt=5,An=128,zt=32,ws=[0,.25,.5,.75,1],xs=Math.PI;function Bs(u){let n=u>>>0;return n=(n<<16|n>>>16)>>>0,n=((n&1431655765)<<1|n>>>1&1431655765)>>>0,n=((n&858993459)<<2|n>>>2&858993459)>>>0,n=((n&252645135)<<4|n>>>4&252645135)>>>0,n=((n&16711935)<<8|n>>>8&16711935)>>>0,n*23283064365386963e-26}function Ss(u,n,e){const t=new Float32Array(u*n*4);for(let r=0;r<n;r++)for(let o=0;o<u;o++){const i=(o+.5)/u,a=(r+.5)/n,l=a*a,c=l*l,d=Math.sqrt(1-i*i),p=i;let f=0,h=0;for(let m=0;m<e;m++){const b=(m+.5)/e,y=Bs(m),v=(1-y)/(1+(c-1)*y),w=Math.sqrt(v),B=Math.sqrt(Math.max(0,1-v)),x=2*xs*b,C=B*Math.cos(x),L=w,U=d*C+p*L;if(U<=0)continue;const I=2*U*L-p,E=Math.max(0,I),g=Math.max(0,w);if(E<=0)continue;const k=c/2,P=i/(i*(1-k)+k),M=E/(E*(1-k)+k),S=P*M*U/(g*i),N=Math.pow(1-U,5);f+=S*(1-N),h+=S*N}const _=(r*u+o)*4;t[_+0]=f/e,t[_+1]=h/e,t[_+2]=0,t[_+3]=1}return t}function Ps(u){const n=new Float32Array([u]),e=new Uint32Array(n.buffer)[0],t=e>>31&1,r=e>>23&255,o=e&8388607;if(r===255)return t<<15|31744|(o?1:0);if(r===0)return t<<15;const i=r-127+15;return i>=31?t<<15|31744:i<=0?t<<15:t<<15|i<<10|o>>13}function Gs(u){const n=new Uint16Array(u.length);for(let e=0;e<u.length;e++)n[e]=Ps(u[e]);return n}const xo=new WeakMap;function Ts(u){const n=xo.get(u);if(n)return n;const e=Gs(Ss(64,64,512)),t=u.createTexture({label:"IBL BRDF LUT",size:{width:64,height:64},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return u.queue.writeTexture({texture:t},e,{bytesPerRow:64*8},{width:64,height:64}),xo.set(u,t),t}const Bo=new WeakMap;function Ms(u){const n=Bo.get(u);if(n)return n;const e=u.createBindGroupLayout({label:"IblBGL0",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.COMPUTE,sampler:{type:"filtering"}}]}),t=u.createBindGroupLayout({label:"IblBGL1",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"2d"}}]}),r=u.createPipelineLayout({bindGroupLayouts:[e,t]}),o=u.createShaderModule({label:"IblCompute",code:ys}),i=u.createComputePipeline({label:"IblIrradiancePipeline",layout:r,compute:{module:o,entryPoint:"cs_irradiance"}}),a=u.createComputePipeline({label:"IblPrefilterPipeline",layout:r,compute:{module:o,entryPoint:"cs_prefilter"}}),l=u.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"clamp-to-edge"}),c={irrPipeline:i,pfPipeline:a,bgl0:e,bgl1:t,sampler:l};return Bo.set(u,c),c}async function As(u,n,e=.2){const{irrPipeline:t,pfPipeline:r,bgl0:o,bgl1:i,sampler:a}=Ms(u),l=u.createTexture({label:"IBL Irradiance",size:{width:zt,height:zt,depthOrArrayLayers:6},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),c=u.createTexture({label:"IBL Prefiltered",size:{width:An,height:An,depthOrArrayLayers:6},mipLevelCount:Vt,format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),d=(E,g)=>{const k=u.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return u.queue.writeBuffer(k,0,new Float32Array([e,E,g,0])),k},p=n.createView(),f=E=>u.createBindGroup({layout:o,entries:[{binding:0,resource:{buffer:E}},{binding:1,resource:p},{binding:2,resource:a}]}),h=E=>u.createBindGroup({layout:i,entries:[{binding:0,resource:E}]}),_=Array.from({length:6},(E,g)=>d(0,g)),m=ws.flatMap((E,g)=>Array.from({length:6},(k,P)=>d(E,P))),b=_.map(f),y=m.map(f),v=Array.from({length:6},(E,g)=>h(l.createView({dimension:"2d",baseArrayLayer:g,arrayLayerCount:1}))),w=Array.from({length:Vt*6},(E,g)=>{const k=Math.floor(g/6),P=g%6;return h(c.createView({dimension:"2d",baseMipLevel:k,mipLevelCount:1,baseArrayLayer:P,arrayLayerCount:1}))}),B=u.createCommandEncoder({label:"IblComputeEncoder"}),x=B.beginComputePass({label:"IblComputePass"});x.setPipeline(t);for(let E=0;E<6;E++)x.setBindGroup(0,b[E]),x.setBindGroup(1,v[E]),x.dispatchWorkgroups(Math.ceil(zt/8),Math.ceil(zt/8));x.setPipeline(r);for(let E=0;E<Vt;E++){const g=An>>E;for(let k=0;k<6;k++)x.setBindGroup(0,y[E*6+k]),x.setBindGroup(1,w[E*6+k]),x.dispatchWorkgroups(Math.ceil(g/8),Math.ceil(g/8))}x.end(),u.queue.submit([B.finish()]),await u.queue.onSubmittedWorkDone(),_.forEach(E=>E.destroy()),m.forEach(E=>E.destroy());const C=Ts(u),L=l.createView({dimension:"cube"}),U=c.createView({dimension:"cube"}),I=C.createView();return{irradiance:l,prefiltered:c,brdfLut:C,irradianceView:L,prefilteredView:U,brdfLutView:I,levels:Vt,destroy(){l.destroy(),c.destroy()}}}class Re{constructor(n,e){s(this,"gpuTexture");s(this,"view");s(this,"type");this.gpuTexture=n,this.type=e,this.view=n.createView({dimension:e==="cube"?"cube":e==="3d"?"3d":"2d"})}destroy(){this.gpuTexture.destroy()}static createSolid(n,e,t,r,o=255){const i=n.createTexture({size:{width:1,height:1},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return n.queue.writeTexture({texture:i},new Uint8Array([e,t,r,o]),{bytesPerRow:4},{width:1,height:1}),new Re(i,"2d")}static fromBitmap(n,e,{srgb:t=!1,usage:r}={}){const o=t?"rgba8unorm-srgb":"rgba8unorm";r=r?r|(GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT):GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT;const i=n.createTexture({size:{width:e.width,height:e.height},format:o,usage:r});return n.queue.copyExternalImageToTexture({source:e,flipY:!1},{texture:i},{width:e.width,height:e.height}),new Re(i,"2d")}static async fromUrl(n,e,t={}){const r=await(await fetch(e)).blob(),o={colorSpaceConversion:"none"};t.resizeWidth!==void 0&&t.resizeHeight!==void 0&&(o.resizeWidth=t.resizeWidth,o.resizeHeight=t.resizeHeight,o.resizeQuality="high");const i=await createImageBitmap(r,o);return Re.fromBitmap(n,i,t)}}const Es=`// Decodes an RGBE (Radiance HDR) texture into a linear rgba16float texture.
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
`;function Us(u){const n=new Uint8Array(u);let e=0;function t(){let f="";for(;e<n.length&&n[e]!==10;)n[e]!==13&&(f+=String.fromCharCode(n[e])),e++;return e<n.length&&e++,f}const r=t();if(!r.startsWith("#?RADIANCE")&&!r.startsWith("#?RGBE"))throw new Error(`Not a Radiance HDR file (magic: "${r}")`);for(;t().length!==0;);const o=t(),i=o.match(/-Y\s+(\d+)\s+\+X\s+(\d+)/);if(!i)throw new Error(`Unrecognized HDR resolution: "${o}"`);const a=parseInt(i[1],10),l=parseInt(i[2],10),c=new Uint8Array(l*a*4);function d(f){const h=new Uint8Array(l),_=new Uint8Array(l),m=new Uint8Array(l),b=new Uint8Array(l),y=[h,_,m,b];for(let w=0;w<4;w++){const B=y[w];let x=0;for(;x<l;){const C=n[e++];if(C>128){const L=C-128,U=n[e++];B.fill(U,x,x+L),x+=L}else B.set(n.subarray(e,e+C),x),e+=C,x+=C}}const v=f*l*4;for(let w=0;w<l;w++)c[v+w*4+0]=h[w],c[v+w*4+1]=_[w],c[v+w*4+2]=m[w],c[v+w*4+3]=b[w]}function p(f,h,_,m,b){const y=f*l*4;c[y+0]=h,c[y+1]=_,c[y+2]=m,c[y+3]=b;let v=1;for(;v<l;){const w=n[e++],B=n[e++],x=n[e++],C=n[e++];if(w===1&&B===1&&x===1){const L=y+(v-1)*4;for(let U=0;U<C;U++)c[y+v*4+0]=c[L+0],c[y+v*4+1]=c[L+1],c[y+v*4+2]=c[L+2],c[y+v*4+3]=c[L+3],v++}else c[y+v*4+0]=w,c[y+v*4+1]=B,c[y+v*4+2]=x,c[y+v*4+3]=C,v++}}for(let f=0;f<a&&!(e+4>n.length);f++){const h=n[e++],_=n[e++],m=n[e++],b=n[e++];if(h===2&&_===2&&!(m&128)){const y=m<<8|b;if(y!==l)throw new Error(`HDR scanline width mismatch: ${y} vs ${l}`);d(f)}else p(f,h,_,m,b)}return{width:l,height:a,data:c}}const So=new WeakMap;function Cs(u){const n=So.get(u);if(n)return n;const e=u.createBindGroupLayout({label:"RgbeSrcBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"uint"}}]}),t=u.createBindGroupLayout({label:"RgbeDstBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"2d"}}]}),r=u.createPipelineLayout({bindGroupLayouts:[e,t]}),o=u.createShaderModule({label:"RgbeDecode",code:Es}),a={pipeline:u.createComputePipeline({label:"RgbeDecodePipeline",layout:r,compute:{module:o,entryPoint:"cs_decode"}}),srcBGL:e,dstBGL:t};return So.set(u,a),a}async function ks(u,n){const{width:e,height:t,data:r}=n,{pipeline:o,srcBGL:i,dstBGL:a}=Cs(u),l=u.createTexture({label:"Sky RGBE Raw",size:{width:e,height:t},format:"rgba8uint",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});u.queue.writeTexture({texture:l},r.buffer,{bytesPerRow:e*4},{width:e,height:t});const c=u.createTexture({label:"Sky HDR Texture",size:{width:e,height:t},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),d=u.createBindGroup({layout:i,entries:[{binding:0,resource:l.createView()}]}),p=u.createBindGroup({layout:a,entries:[{binding:0,resource:c.createView()}]}),f=u.createCommandEncoder({label:"RgbeDecodeEncoder"}),h=f.beginComputePass({label:"RgbeDecodePass"});return h.setPipeline(o),h.setBindGroup(0,d),h.setBindGroup(1,p),h.dispatchWorkgroups(Math.ceil(e/8),Math.ceil(t/8)),h.end(),u.queue.submit([f.finish()]),await u.queue.onSubmittedWorkDone(),l.destroy(),new Re(c,"2d")}class lr{constructor(n,e,t,r,o,i,a){s(this,"colorAtlas");s(this,"normalAtlas");s(this,"merAtlas");s(this,"heightAtlas");s(this,"blockSize");s(this,"blockCount");s(this,"_atlasWidth");s(this,"_atlasHeight");this.colorAtlas=n,this.normalAtlas=e,this.merAtlas=t,this.heightAtlas=r,this.blockSize=o,this._atlasWidth=i,this._atlasHeight=a,this.blockCount=Math.floor(i/o)}static async load(n,e,t,r,o,i=16){async function a(v){const w=await(await fetch(v)).blob();return createImageBitmap(w,{colorSpaceConversion:"none"})}const[l,c,d,p]=await Promise.all([a(e),a(t),a(r),a(o)]),f=l.width,h=l.height,_=Re.fromBitmap(n,l,{srgb:!0}),m=Re.fromBitmap(n,c,{srgb:!1}),b=Re.fromBitmap(n,d,{srgb:!1}),y=Re.fromBitmap(n,p,{srgb:!1});return new lr(_,m,b,y,i,f,h)}uvTransform(n){const e=this.blockSize/this._atlasWidth,t=this.blockSize/this._atlasHeight;return[n*e,0,e,t]}destroy(){this.colorAtlas.destroy(),this.normalAtlas.destroy(),this.merAtlas.destroy(),this.heightAtlas.destroy()}}var Ee=(u=>(u[u.None=0]="None",u[u.SnowyMountains=1]="SnowyMountains",u[u.RockyMountains=2]="RockyMountains",u[u.GrassyPlains=3]="GrassyPlains",u[u.SnowyPlains=4]="SnowyPlains",u[u.Desert=5]="Desert",u[u.Max=6]="Max",u))(Ee||{}),_t=(u=>(u[u.None=0]="None",u[u.Rain=1]="Rain",u[u.Snow=2]="Snow",u))(_t||{});function Ls(u){switch(u){case 1:return 2;case 4:return 2;default:return 0}}function Po(u){switch(u){case 1:return{cloudBase:90,cloudTop:200};case 2:return{cloudBase:75,cloudTop:160};default:return{cloudBase:75,cloudTop:105}}}const Ft=.05,Rs=[[.35,5,3],[-.15,3,4],[-.3,4,1],[-.5,1,2]];function Ns(u){for(const[e,t,r]of Rs){const o=u-e;if(o>=-Ft&&o<=Ft)return{biome1:r,biome2:t,blend:(o+Ft)/(2*Ft)}}const n=Is(u);return{biome1:n,biome2:n,blend:0}}function Is(u){return u>.35?5:u>-.15?3:u>-.3?4:u>-.5?1:2}function Go(u){switch(u){case 1:return 1.2;case 4:return 1;case 3:return .75;case 2:return .9;case 5:return .15;default:return .55}}function Os(u,n){let e=(Math.imul(u|0,2654435769)^Math.imul(n|0,1367130551))>>>0;return e=Math.imul(e^e>>>16,73244475)>>>0,e=(e^e>>>16)>>>0,e/4294967296}const Y=class Y{constructor(n,e,t){s(this,"blocks",new Uint8Array(Y.CHUNK_WIDTH*Y.CHUNK_HEIGHT*Y.CHUNK_DEPTH));s(this,"globalPosition",new j);s(this,"opaqueIndex",-1);s(this,"transparentIndex",-1);s(this,"waterIndex",-1);s(this,"drawCommandIndex",-1);s(this,"chunkDataIndex",-1);s(this,"aabbTreeIndex",-1);s(this,"aliveBlocks",0);s(this,"opaqueBlocks",0);s(this,"transparentBlocks",0);s(this,"waterBlocks",0);s(this,"lightBlocks",0);s(this,"isDeleted",!1);this.globalPosition.set(n,e,t)}generateVertices(n){const e=Y.CHUNK_WIDTH,t=Y.CHUNK_HEIGHT,r=Y.CHUNK_DEPTH,o=5;let i=0,a=0,l=0;for(let P=0;P<this.blocks.length;P++){const M=this.blocks[P];M===R.NONE||he(M)||(Ue(M)?l++:ct(M)?a++:i++)}const c=new Float32Array(i*36*o),d=new Float32Array(a*36*o),p=new Float32Array(l*6*o),f=new Uint16Array(e*t*6);let h=0,_=0,m=0,b=!1;const y=[],v=e+2,w=t+2,B=v*w,x=new Uint8Array(v*w*(r+2));for(let P=0;P<r;P++)for(let M=0;M<t;M++)for(let S=0;S<e;S++)x[S+1+(M+1)*v+(P+1)*B]=this.blocks[S+M*e+P*e*t];if(n!=null&&n.negX){const P=n.negX;for(let M=0;M<r;M++)for(let S=0;S<t;S++)x[0+(S+1)*v+(M+1)*B]=P[e-1+S*e+M*e*t]}if(n!=null&&n.posX){const P=n.posX;for(let M=0;M<r;M++)for(let S=0;S<t;S++)x[e+1+(S+1)*v+(M+1)*B]=P[0+S*e+M*e*t]}if(n!=null&&n.negY){const P=n.negY;for(let M=0;M<r;M++)for(let S=0;S<e;S++)x[S+1+0+(M+1)*B]=P[S+(t-1)*e+M*e*t]}if(n!=null&&n.posY){const P=n.posY;for(let M=0;M<r;M++)for(let S=0;S<e;S++)x[S+1+(t+1)*v+(M+1)*B]=P[S+0*e+M*e*t]}if(n!=null&&n.negZ){const P=n.negZ;for(let M=0;M<t;M++)for(let S=0;S<e;S++)x[S+1+(M+1)*v+0]=P[S+M*e+(r-1)*e*t]}if(n!=null&&n.posZ){const P=n.posZ;for(let M=0;M<t;M++)for(let S=0;S<e;S++)x[S+1+(M+1)*v+(r+1)*B]=P[S+M*e+0*e*t]}const C=(P,M,S,N)=>{f[(P*t+M)*6+N]|=1<<S},L=(P,M,S,N)=>(f[(P*t+M)*6+N]&1<<S)!==0,U=(P,M,S)=>x[P+1+(M+1)*v+(S+1)*B],I=(P,M)=>!(M===R.NONE||Ue(P)||Ue(M)||!he(P)&&he(M)||!ct(P)&&ct(M)),E=Y.CUBE_VERTS;for(let P=0;P<e;P++)for(let M=0;M<t;M++)for(let S=0;S<r;S++){const N=U(P,M,S);if(N===R.NONE)continue;if(he(N)){y.push({x:P,y:M,z:S}),b=!0;continue}if(Ue(N)){for(let Z=0;Z<6;Z++)p[m++]=P+.5,p[m++]=M+.5,p[m++]=S+.5,p[m++]=6,p[m++]=N;continue}const H=ct(N),O=I(N,U(P,M,S-1))||L(P,M,S,0),T=I(N,U(P,M,S+1))||L(P,M,S,1),z=I(N,U(P-1,M,S))||L(P,M,S,2),ie=I(N,U(P+1,M,S))||L(P,M,S,3),le=I(N,U(P,M-1,S))||L(P,M,S,4),re=I(N,U(P,M+1,S))||L(P,M,S,5);if(O&&T&&z&&ie&&le&&re)continue;let oe=M;if(!O||!T||!z||!ie){let Z=M;for(;Z<t&&U(P,Z,S)===N;){oe=Z;Z++}}if(!O||!T){let Z=P,Q=P,D=0;for(;Q<e&&U(Q,M,S)===N;){let K=M;for(;K<=oe&&U(Q,K,S)===N;){D=K;K++}if(D===oe)Z=Q,Q++;else break}for(let K=P;K<=Z;K++)for(let be=M;be<=oe;be++)O||C(K,be,S,0),T||C(K,be,S,1);let F,J;!O&&!T?(F=0,J=12):O?(F=6,J=12):(F=0,J=6);const X=Z+1-P,fe=oe+1-M,ve=H?d:c;let ce=H?_:h;for(let K=F;K<J;K++){const be=E[K*3],ue=E[K*3+1],Se=E[K*3+2];ve[ce++]=P+.5*(X-1)+.5+be*X,ve[ce++]=M+.5*(fe-1)+.5+ue*fe,ve[ce++]=S+.5+Se,ve[ce++]=K<6?0:1,ve[ce++]=N}H?_=ce:h=ce}if(!z||!ie){let Z=S,Q=S,D=0;for(;Q<r&&U(P,M,Q)===N;){let K=M;for(;K<=oe&&U(P,K,Q)===N;){D=K;K++}if(D===oe)Z=Q,Q++;else break}for(let K=S;K<=Z;K++)for(let be=M;be<=oe;be++)z||C(P,be,K,2),ie||C(P,be,K,3);let F,J;!z&&!ie?(F=12,J=24):z?(F=18,J=24):(F=12,J=18);const X=Z+1-S,fe=oe+1-M,ve=H?d:c;let ce=H?_:h;for(let K=F;K<J;K++){const be=E[K*3],ue=E[K*3+1],Se=E[K*3+2];ve[ce++]=P+.5+be,ve[ce++]=M+.5*(fe-1)+.5+ue*fe,ve[ce++]=S+.5*(X-1)+.5+Se*X,ve[ce++]=K<18?2:3,ve[ce++]=N}H?_=ce:h=ce}if(!le||!re){let Z=P,Q=P;for(;Q<e&&U(Q,M,S)===N;){Z=Q;Q++}let D=S,F=S,J=0;for(;F<r&&U(P,M,F)===N;){let ue=P;for(;ue<=Z&&U(ue,M,F)===N;){J=ue;ue++}if(J===Z)D=F,F++;else break}for(let ue=P;ue<=Z;ue++)for(let Se=S;Se<=D;Se++)le||C(ue,M,Se,4),re||C(ue,M,Se,5);let X,fe;!le&&!re?(X=24,fe=36):le?(X=30,fe=36):(X=24,fe=30);const ve=Z+1-P,ce=D+1-S,K=H?d:c;let be=H?_:h;for(let ue=X;ue<fe;ue++){const Se=E[ue*3],Tt=E[ue*3+1],on=E[ue*3+2];K[be++]=P+.5*(ve-1)+.5+Se*ve,K[be++]=M+.5+Tt,K[be++]=S+.5*(ce-1)+.5+on*ce,K[be++]=ue<30?4:5,K[be++]=N}H?_=be:h=be}}let g=null,k=0;if(b){const P=(n==null?void 0:n.negX)!==void 0,M=(n==null?void 0:n.posX)!==void 0,S=(n==null?void 0:n.negZ)!==void 0,N=(n==null?void 0:n.posZ)!==void 0;g=new Float32Array(y.length*6*6*3);let G=0;for(const H of y){const{x:O,y:T,z}=H,ie=O+1,le=T+1,re=z+1,oe=x[ie+(le+1)*v+re*B];he(oe)||(g[G++]=O,g[G++]=T+1,g[G++]=z,g[G++]=O+1,g[G++]=T+1,g[G++]=z,g[G++]=O+1,g[G++]=T+1,g[G++]=z+1,g[G++]=O,g[G++]=T+1,g[G++]=z,g[G++]=O,g[G++]=T+1,g[G++]=z+1,g[G++]=O+1,g[G++]=T+1,g[G++]=z+1);const Z=x[ie+le*v+(re+1)*B],Q=z===r-1;!he(Z)&&!(Q&&Z===R.NONE&&!N)&&(g[G++]=O,g[G++]=T,g[G++]=z+1,g[G++]=O+1,g[G++]=T,g[G++]=z+1,g[G++]=O+1,g[G++]=T+1,g[G++]=z+1,g[G++]=O,g[G++]=T,g[G++]=z+1,g[G++]=O,g[G++]=T+1,g[G++]=z+1,g[G++]=O+1,g[G++]=T+1,g[G++]=z+1);const D=x[ie+le*v+(re-1)*B],F=z===0;!he(D)&&!(F&&D===R.NONE&&!S)&&(g[G++]=O+1,g[G++]=T,g[G++]=z,g[G++]=O,g[G++]=T,g[G++]=z,g[G++]=O,g[G++]=T+1,g[G++]=z,g[G++]=O+1,g[G++]=T,g[G++]=z,g[G++]=O+1,g[G++]=T+1,g[G++]=z,g[G++]=O,g[G++]=T+1,g[G++]=z);const J=x[ie+1+le*v+re*B],X=O===e-1;!he(J)&&!(X&&J===R.NONE&&!M)&&(g[G++]=O+1,g[G++]=T,g[G++]=z,g[G++]=O+1,g[G++]=T+1,g[G++]=z,g[G++]=O+1,g[G++]=T+1,g[G++]=z+1,g[G++]=O+1,g[G++]=T,g[G++]=z,g[G++]=O+1,g[G++]=T,g[G++]=z+1,g[G++]=O+1,g[G++]=T+1,g[G++]=z+1);const fe=x[ie-1+le*v+re*B],ve=O===0;!he(fe)&&!(ve&&fe===R.NONE&&!P)&&(g[G++]=O,g[G++]=T,g[G++]=z+1,g[G++]=O,g[G++]=T+1,g[G++]=z+1,g[G++]=O,g[G++]=T+1,g[G++]=z,g[G++]=O,g[G++]=T,g[G++]=z+1,g[G++]=O,g[G++]=T,g[G++]=z,g[G++]=O,g[G++]=T+1,g[G++]=z);const ce=x[ie+(le-1)*v+re*B];he(ce)||(g[G++]=O,g[G++]=T,g[G++]=z+1,g[G++]=O+1,g[G++]=T,g[G++]=z+1,g[G++]=O+1,g[G++]=T,g[G++]=z,g[G++]=O,g[G++]=T,g[G++]=z+1,g[G++]=O,g[G++]=T,g[G++]=z,g[G++]=O+1,g[G++]=T,g[G++]=z)}k=G/3,g=g.subarray(0,G)}return{opaque:c.subarray(0,h),opaqueCount:h/o,transparent:d.subarray(0,_),transparentCount:_/o,water:g||new Float32Array(0),waterCount:k,prop:p.subarray(0,m),propCount:m/o}}generateBlocks(n,e){const t=Y.CHUNK_WIDTH,r=Y.CHUNK_HEIGHT,o=Y.CHUNK_DEPTH,i=new Float64Array(t*o),a=new Float64Array(t*o),l=new Float32Array(t*o),c=new Uint8Array(t*o),d=new Uint8Array(t*o),p=new Float32Array(t*o);for(let f=0;f<o;f++)for(let h=0;h<t;h++){const _=h+this.globalPosition.x,m=f+this.globalPosition.z,b=h+f*t,y=ke(_/512,-5,m/512,0,0,0,n+31337),v=ke(_/2048,10,m/2048,0,0,0,n);i[b]=Math.abs(ke(_/1024,0,m/1024,0,0,0,n)*450)*Math.max(.1,(v+1)*.5),a[b]=Qo(_/256,15,m/256,2,.6,1.2,6)*12,l[b]=e?e(_,m):0;const w=Ns(y);c[b]=w.biome1,d[b]=w.biome2,p[b]=w.blend}for(let f=0;f<o;f++)for(let h=0;h<r;h++)for(let _=0;_<t;_++){if(this.getBlock(_,h,f)!==R.NONE)continue;const m=_+f*t,b=_+this.globalPosition.x,y=h+this.globalPosition.y,v=f+this.globalPosition.z,w=Math.abs(ke(b/256,y/512,v/256,0,0,0,n)*i[m])+a[m]+l[m];y<w?Y._isCave(b,y,v,n,w-y)?y<Y.SEA_LEVEL+1?this.setBlock(_,h,f,R.WATER):this.setBlock(_,h,f,R.NONE):this.setBlock(_,h,f,this._generateBlockBasedOnBiome(c[m],d[m],p[m],b,y,v,w)):y<Y.SEA_LEVEL+1&&this.setBlock(_,h,f,R.WATER)}for(let f=0;f<Y.CHUNK_DEPTH;f++)for(let h=0;h<Y.CHUNK_HEIGHT;h++)for(let _=0;_<Y.CHUNK_WIDTH;_++){if(this.getBlock(_,h,f)===R.NONE)continue;const m=_+this.globalPosition.x,b=h+this.globalPosition.y,y=f+this.globalPosition.z;this._generateAdditionalBlocks(_,h,f,m,b,y,n)}}setBlock(n,e,t,r){if(n<0||n>=Y.CHUNK_WIDTH||e<0||e>=Y.CHUNK_HEIGHT||t<0||t>=Y.CHUNK_DEPTH)return;const o=n+e*Y.CHUNK_WIDTH+t*Y.CHUNK_WIDTH*Y.CHUNK_HEIGHT,i=this.blocks[o];i!==R.NONE&&(this.aliveBlocks--,he(i)?this.waterBlocks--:ct(i)?this.transparentBlocks--:this.opaqueBlocks--,jr(i)&&this.lightBlocks--),this.blocks[o]=r,r!==R.NONE&&(this.aliveBlocks++,he(r)?this.waterBlocks++:ct(r)?this.transparentBlocks++:this.opaqueBlocks++,jr(r)&&this.lightBlocks++)}getBlock(n,e,t){if(n<0||n>=Y.CHUNK_WIDTH||e<0||e>=Y.CHUNK_HEIGHT||t<0||t>=Y.CHUNK_DEPTH)return R.NONE;const r=n+e*Y.CHUNK_WIDTH+t*Y.CHUNK_WIDTH*Y.CHUNK_HEIGHT;return this.blocks[r]}getBlockIndex(n,e,t){return n<0||n>=Y.CHUNK_WIDTH||e<0||e>=Y.CHUNK_HEIGHT||t<0||t>=Y.CHUNK_DEPTH?-1:n+e*Y.CHUNK_WIDTH+t*Y.CHUNK_WIDTH*Y.CHUNK_HEIGHT}_generateAdditionalBlocks(n,e,t,r,o,i,a){const l=this.getBlock(n,e,t),c=this.getBlock(n-1,e,t),d=this.getBlock(n+1,e,t),p=this.getBlock(n,e,t+1),f=this.getBlock(n,e,t-1),h=this.getBlock(n,e+1,t);if(l==R.SAND)if(o>0&&Ae.global.randomUint32()%512==0){const _=Ae.global.randomUint32()%5;for(let m=0;m<_;m++)this.setBlock(n,e+m,t,R.CACTUS)}else Ae.global.randomUint32()%128==0&&this.setBlock(n,e+1,t,R.DEAD_BUSH);else if(l==R.SNOW||l==R.GRASS_SNOW){if(Ae.global.randomUint32()%16==0&&o>12&&(h==R.NONE||he(h))&&(c==R.NONE||f==R.NONE))this.setBlock(n,e+1,t,R.DEAD_BUSH);else if(Ae.global.randomUint32()%16==0&&o>12&&o<300&&e<Y.CHUNK_HEIGHT-5&&n>2&&t>2&&n<Y.CHUNK_WIDTH-2&&t<Y.CHUNK_DEPTH-2&&h==R.NONE&&d==R.NONE&&p==R.NONE&&f==R.NONE){const m=Math.max(Ae.global.randomUint32()%5,5);for(let b=0;b<m;b++)this.setBlock(n,e+b,t,R.TRUNK);for(let b=-2;b<=2;b++){const y=b<-1||b>1?0:-1,v=b<-1||b>1?0:1;for(let w=-1+y;w<=1+v;w++){const B=Math.abs(w-n);for(let x=-1+y;x<=1+v;x++){const C=Math.abs(x-t),L=w*w+b*b+x*x,U=this.getBlock(n+w,e+m+b,t+x);L+2<Ae.global.randomUint32()%24&&B!=2-y&&B!=2+v&&C!=2-y&&C!=2+v&&(U==R.NONE||U==R.SNOWYLEAVES)&&this.setBlock(n+w,e+m+b,t+x,R.SNOWYLEAVES)}}}}}else if(l==R.GRASS||l==R.DIRT)if(Ae.global.randomUint32()%2==0&&o>5&&o<300&&e<Y.CHUNK_HEIGHT-5&&n>2&&t>2&&n<Y.CHUNK_WIDTH-2&&t<Y.CHUNK_DEPTH-2&&h==R.NONE&&d==R.NONE&&p==R.NONE&&f==R.NONE){const m=Math.max(Ae.global.randomUint32()%5,5);for(let b=0;b<m;b++)this.setBlock(n,e+b,t,R.TRUNK);for(let b=-2;b<=2;b++){const y=b<-1||b>1?0:-1,v=b<-1||b>1?0:1;for(let w=-1+y;w<=1+v;w++){const B=Math.abs(w-n);for(let x=-1+y;x<=1+v;x++){const C=Math.abs(x-t),L=w*w+b*b+x*x,U=this.getBlock(n+w,e+m+b,t+x);L+2<Ae.global.randomUint32()%24&&B!=2-y&&B!=2+v&&C!=2-y&&C!=2+v&&(U==R.NONE||U==R.TREELEAVES)&&this.setBlock(n+w,e+m+b,t+x,R.TREELEAVES)}}}}else o>5&&h==R.NONE&&(c==R.NONE||f==R.NONE)&&(Ae.global.randomUint32()%8==0?this.setBlock(n,e+1,t,R.GRASS_PROP):Ae.global.randomUint32()%8==0&&this.setBlock(n,e+1,t,R.FLOWER))}_generateBlockBasedOnBiome(n,e,t,r,o,i,a){const l=t>0&&n!==e&&Os(r,i)<t?e:n,c=Math.floor(a)-o,d=a<Y.SEA_LEVEL+1;switch(l){case Ee.GrassyPlains:return c===0?d?R.DIRT:R.GRASS:c<=3?R.DIRT:R.STONE;case Ee.Desert:return c<=3?R.SAND:R.STONE;case Ee.SnowyPlains:return c===0?R.GRASS_SNOW:c<=2?R.SNOW:R.STONE;case Ee.SnowyMountains:{const p=Math.abs(Wr(r/256,o/256,i/256,2,.6,1))*35;return c===0?R.GRASS_SNOW:c<=4||p>20?R.SNOW:R.STONE}case Ee.RockyMountains:return c===0&&Math.abs(Wr(r/64,o/64,i/64,2,.6,1))<.12?R.SNOW:R.STONE;default:return R.GRASS}}static _determineBiomeFromNoise(n){return n>.35?Ee.Desert:n>-.15?Ee.GrassyPlains:n>-.3?Ee.SnowyPlains:n>-.5?Ee.SnowyMountains:Ee.RockyMountains}static _determineBiome(n,e,t,r){const o=ke(n/512,-5,t/512,0,0,0,r+31337);return Y._determineBiomeFromNoise(o)}static _isCave(n,e,t,r,o){if(o<3)return!1;if(ke(n/60,e/60,t/60,0,0,0,r+777)>.6)return!0;const a=ke(n/24,e/24,t/24,0,0,0,r+13579),l=ke(n/24,e/14,t/24,0,0,0,r+24680);if(Math.abs(a)<.12&&Math.abs(l)<.12)return!0;const c=ke(n/28,e/18,t/28,0,0,0,r+55555),d=ke(n/28,e/28,t/28,0,0,0,r+99999);return Math.abs(c)<.1&&Math.abs(d)<.1}};s(Y,"CHUNK_WIDTH",16),s(Y,"CHUNK_HEIGHT",16),s(Y,"CHUNK_DEPTH",16),s(Y,"SEA_LEVEL",15),s(Y,"CUBE_VERTS",new Float32Array([-.5,-.5,-.5,.5,.5,-.5,.5,-.5,-.5,.5,.5,-.5,-.5,-.5,-.5,-.5,.5,-.5,-.5,-.5,.5,.5,-.5,.5,.5,.5,.5,.5,.5,.5,-.5,.5,.5,-.5,-.5,.5,-.5,.5,.5,-.5,.5,-.5,-.5,-.5,-.5,-.5,-.5,-.5,-.5,-.5,.5,-.5,.5,.5,.5,.5,.5,.5,-.5,-.5,.5,.5,-.5,.5,-.5,-.5,.5,.5,.5,.5,-.5,.5,-.5,-.5,-.5,.5,-.5,-.5,.5,-.5,.5,.5,-.5,.5,-.5,-.5,.5,-.5,-.5,-.5,-.5,.5,-.5,.5,.5,.5,.5,.5,-.5,.5,.5,.5,-.5,.5,-.5,-.5,.5,.5]));let ne=Y;const li=128;function Ds(u,n,e){const t=ke(u/2048,10,n/2048,0,0,0,e),r=Math.abs(ke(u/1024,0,n/1024,0,0,0,e)*450)*Math.max(.1,(t+1)*.5),o=Qo(u/256,15,n/256,2,.6,1.2,6)*12;return Math.abs(ke(u/256,0,n/256,0,0,0,e)*r)+o}function To(u,n,e,t){const r=e|0,o=t|0,i=e-r,a=t-o,l=u[r+o*n],c=u[r+1+o*n],d=u[r+(o+1)*n],p=u[r+1+(o+1)*n];return[(c-l)*(1-a)+(p-d)*a,(d-l)*(1-i)+(p-c)*i,l*(1-i)*(1-a)+c*i*(1-a)+d*(1-i)*a+p*i*a]}function Mo(u){return Math.imul(u,1664525)+1013904223>>>0}function Vs(u,n,e){const t=n*n>>2,r=.05,o=4,i=.01,a=.4,l=.3,c=.01,d=4,p=20,f=2,h=f*2+1,_=new Float32Array(h*h);let m=0;for(let v=-f;v<=f;v++)for(let w=-f;w<=f;w++){const B=Math.sqrt(w*w+v*v);if(B<f){const x=1-B/f;_[w+f+(v+f)*h]=x,m+=x}}for(let v=0;v<_.length;v++)_[v]/=m;const b=n-2;let y=(e^3735928559)>>>0;for(let v=0;v<t;v++){y=Mo(y);let w=y/4294967295*b;y=Mo(y);let B=y/4294967295*b,x=0,C=0,L=1,U=1,I=0;for(let E=0;E<p;E++){const g=w|0,k=B|0;if(g<0||g>=b||k<0||k>=b)break;const P=w-g,M=B-k,[S,N,G]=To(u,n,w,B);x=x*r-S*(1-r),C=C*r-N*(1-r);const H=Math.sqrt(x*x+C*C);if(H<1e-6)break;x/=H,C/=H;const O=w+x,T=B+C;if(O<0||O>=b||T<0||T>=b)break;const[,,z]=To(u,n,O,T),ie=z-G,le=Math.max(-ie*L*U*o,i);if(I>le||ie>0){const re=ie>0?Math.min(ie,I):(I-le)*l;I-=re,u[g+k*n]+=re*(1-P)*(1-M),u[g+1+k*n]+=re*P*(1-M),u[g+(k+1)*n]+=re*(1-P)*M,u[g+1+(k+1)*n]+=re*P*M}else{const re=Math.min((le-I)*a,-ie);for(let oe=-f;oe<=f;oe++)for(let Z=-f;Z<=f;Z++){const Q=g+Z,D=k+oe;Q<0||Q>=n||D<0||D>=n||(u[Q+D*n]-=_[Z+f+(oe+f)*h]*re)}I+=re}L=Math.sqrt(Math.max(L*L+ie*d,0)),U*=1-c,w=O,B=T}}}function zs(u,n,e){const t=li,r=u*t,o=n*t,i=new Float32Array(t*t);for(let p=0;p<t;p++)for(let f=0;f<t;f++)i[f+p*t]=Ds(r+f,o+p,e);const a=new Float32Array(i),l=(e^(Math.imul(u,73856093)^Math.imul(n,19349663)))>>>0;Vs(a,t,l);const c=12,d=new Float32Array(t*t);for(let p=0;p<t;p++)for(let f=0;f<t;f++){const h=f+p*t,_=Math.min(f,t-1-f,p,t-1-p),m=Math.min(_/c,1);d[h]=(a[h]-i[h])*m}return d}const q=class q{constructor(n){s(this,"seed");s(this,"renderDistanceH",8);s(this,"renderDistanceV",4);s(this,"chunksPerFrame",2);s(this,"time",0);s(this,"waterSimulationRadius",32);s(this,"waterTickInterval",.25);s(this,"_waterTickTimer",0);s(this,"_dirtyChunks",null);s(this,"onChunkAdded");s(this,"onChunkUpdated");s(this,"onChunkRemoved");s(this,"_chunks",new Map);s(this,"_generated",new Set);s(this,"_erosionCache",new Map);s(this,"pendingChunks",0);s(this,"_neighborScratch",{negX:void 0,posX:void 0,negY:void 0,posY:void 0,negZ:void 0,posZ:void 0});s(this,"_scratchTopD2",null);s(this,"_scratchTopXYZ",null);s(this,"_scratchToDelete",[]);s(this,"_scratchWaterBlocks",[]);s(this,"_scratchDirtyChunks",new Set);this.seed=n}get chunkCount(){return this._chunks.size}get chunks(){return this._chunks.values()}getBiomeAt(n,e,t){return ne._determineBiome(n,e,t,this.seed)}static normalizeChunkPosition(n,e,t){return[Math.floor(n/ne.CHUNK_WIDTH),Math.floor(e/ne.CHUNK_HEIGHT),Math.floor(t/ne.CHUNK_DEPTH)]}static _cx(n){return Math.floor(n/ne.CHUNK_WIDTH)}static _cy(n){return Math.floor(n/ne.CHUNK_HEIGHT)}static _cz(n){return Math.floor(n/ne.CHUNK_DEPTH)}static _key(n,e,t){return(n+32768)*4294967296+(e+32768)*65536+(t+32768)}getChunk(n,e,t){return this._chunks.get(q._key(q._cx(n),q._cy(e),q._cz(t)))}chunkExists(n,e,t){return this.getChunk(n,e,t)!==void 0}getBlockType(n,e,t){const r=this.getChunk(n,e,t);if(!r)return R.NONE;const o=Math.round(n)-r.globalPosition.x,i=Math.round(e)-r.globalPosition.y,a=Math.round(t)-r.globalPosition.z;return r.getBlock(o,i,a)}setBlockType(n,e,t,r){let o=this.getChunk(n,e,t);if(!o){const c=q._cx(n),d=q._cy(e),p=q._cz(t);o=new ne(c*ne.CHUNK_WIDTH,d*ne.CHUNK_HEIGHT,p*ne.CHUNK_DEPTH),this._insertChunk(o)}const i=Math.round(n)-o.globalPosition.x,a=Math.round(e)-o.globalPosition.y,l=Math.round(t)-o.globalPosition.z;return o.setBlock(i,a,l,r),this._updateChunk(o,i,a,l),!0}getTopBlockY(n,e,t){const r=ne.CHUNK_HEIGHT,o=Math.floor(n),i=Math.floor(e);for(let a=Math.floor(t/r);a>=0;a--){const l=this.getChunk(o,a*r,i);if(!l)continue;const c=o-l.globalPosition.x,d=i-l.globalPosition.z;for(let p=r-1;p>=0;p--){const f=l.getBlock(c,p,d);if(f!==R.NONE&&!Ue(f))return l.globalPosition.y+p+1}}return 0}getBlockByRay(n,e,t){const r=Number.MAX_VALUE;let o=Math.floor(n.x),i=Math.floor(n.y),a=Math.floor(n.z);const l=1/e.x,c=1/e.y,d=1/e.z,p=e.x>0?1:-1,f=e.y>0?1:-1,h=e.z>0?1:-1,_=Math.min(l*p,r),m=Math.min(c*f,r),b=Math.min(d*h,r);let y=Math.abs((o+Math.max(p,0)-n.x)*l),v=Math.abs((i+Math.max(f,0)-n.y)*c),w=Math.abs((a+Math.max(h,0)-n.z)*d),B=0,x=0,C=0;for(let L=0;L<t;L++){if(L>0){const U=this.getChunk(o,i,a);if(U){const I=o-U.globalPosition.x,E=i-U.globalPosition.y,g=a-U.globalPosition.z,k=U.getBlock(I,E,g);if(k!==R.NONE&&!he(k))return{blockType:k,position:new j(o,i,a),face:new j(-B*p,-x*f,-C*h),chunk:U,relativePosition:new j(I,E,g)}}}B=(y<=w?1:0)*(y<=v?1:0),x=(v<=y?1:0)*(v<=w?1:0),C=(w<=v?1:0)*(w<=y?1:0),y+=_*B,v+=m*x,w+=b*C,o+=p*B,i+=f*x,a+=h*C}return null}addBlock(n,e,t,r,o,i,a){if(a===R.NONE||!this.getChunk(n,e,t))return!1;const c=this.getBlockType(n,e,t);if(Ue(c))return!1;const d=n+r,p=e+o,f=t+i,h=this.getBlockType(d,p,f);if(he(a)){if(h!==R.NONE&&!he(h))return!1}else if(h!==R.NONE&&!he(h))return!1;let _=this.getChunk(d,p,f);if(!_){const v=q._cx(d),w=q._cy(p),B=q._cz(f);_=new ne(v*ne.CHUNK_WIDTH,w*ne.CHUNK_HEIGHT,B*ne.CHUNK_DEPTH),this._insertChunk(_)}const m=d-_.globalPosition.x,b=p-_.globalPosition.y,y=f-_.globalPosition.z;return _.setBlock(m,b,y,a),this._updateChunk(_,m,b,y),!0}mineBlock(n,e,t){const r=this.getChunk(n,e,t);if(!r)return!1;const o=n-r.globalPosition.x,i=e-r.globalPosition.y,a=t-r.globalPosition.z,l=r.getBlock(o,i,a);return l===R.NONE?!1:he(l)?(r.setBlock(o,i,a,R.NONE),this._updateChunk(r,o,i,a),!0):(r.setBlock(o,i,a,R.NONE),this._updateChunk(r,o,i,a),!0)}update(n,e){this.time+=e,this._removeDistantChunks(n),this._createNearbyChunks(n),this._waterTickTimer+=e,this._waterTickTimer>=this.waterTickInterval&&(this._waterTickTimer=0,this._updateWaterFlow(n))}deleteChunk(n){var i;const e=q._cx(n.globalPosition.x),t=q._cy(n.globalPosition.y),r=q._cz(n.globalPosition.z),o=q._key(e,t,r);this._chunks.delete(o),this._generated.delete(o),n.isDeleted=!0,(i=this.onChunkRemoved)==null||i.call(this,n)}calcWaterLevel(n,e,t){const r=this.getChunk(n,e,t);if(!r||r.waterBlocks<=0)return 0;let o=this._calcWaterLevelInChunk(r,e);for(let i=1;i<=4;i++){const a=this.getChunk(n,e+i*ne.CHUNK_HEIGHT,t);if(!a)break;const l=q._cx(n),c=q._cz(t),d=l*ne.CHUNK_WIDTH-a.globalPosition.x,p=c*ne.CHUNK_DEPTH-a.globalPosition.z;if(a.waterBlocks>0&&he(a.getBlock(d,0,p)))o+=this._calcWaterLevelInChunk(a,e);else break}return o}_calcWaterLevelInChunk(n,e){const t=n.globalPosition.y,r=ne.CHUNK_HEIGHT;let o=0;return e<=t+r*.8&&o++,e<=t+r*.7&&o++,e<=t+r*.6&&o++,e<=t+r*.5&&o++,o}_getErosionRegion(n,e){const t=`${n},${e}`;let r=this._erosionCache.get(t);return r||(r=zs(n,e,this.seed),this._erosionCache.set(t,r)),r}getErosionDisplacement(n,e){const t=li,r=Math.floor(n/t),o=Math.floor(e/t),i=(n%t+t)%t,a=(e%t+t)%t;return this._getErosionRegion(r,o)[i+a*t]}_insertChunk(n){const e=q._cx(n.globalPosition.x),t=q._cy(n.globalPosition.y),r=q._cz(n.globalPosition.z);this._chunks.set(q._key(e,t,r),n),n.isDeleted=!1}_gatherNeighbors(n,e,t){var o,i,a,l,c,d;const r=this._neighborScratch;return r.negX=(o=this._chunks.get(q._key(n-1,e,t)))==null?void 0:o.blocks,r.posX=(i=this._chunks.get(q._key(n+1,e,t)))==null?void 0:i.blocks,r.negY=(a=this._chunks.get(q._key(n,e-1,t)))==null?void 0:a.blocks,r.posY=(l=this._chunks.get(q._key(n,e+1,t)))==null?void 0:l.blocks,r.negZ=(c=this._chunks.get(q._key(n,e,t-1)))==null?void 0:c.blocks,r.posZ=(d=this._chunks.get(q._key(n,e,t+1)))==null?void 0:d.blocks,r}_remeshSingleNeighbor(n,e,t){var o;const r=this._chunks.get(q._key(n,e,t));r&&((o=this.onChunkUpdated)==null||o.call(this,r,r.generateVertices(this._gatherNeighbors(n,e,t))))}_updateChunk(n,e,t,r){var p;const o=q._cx(n.globalPosition.x),i=q._cy(n.globalPosition.y),a=q._cz(n.globalPosition.z);if(this._dirtyChunks){if(this._dirtyChunks.add(n),e===void 0)return;const f=ne.CHUNK_WIDTH,h=ne.CHUNK_HEIGHT,_=ne.CHUNK_DEPTH,m=(b,y,v)=>{const w=this._chunks.get(q._key(b,y,v));w&&this._dirtyChunks.add(w)};e===0&&m(o-1,i,a),e===f-1&&m(o+1,i,a),t===0&&m(o,i-1,a),t===h-1&&m(o,i+1,a),r===0&&m(o,i,a-1),r===_-1&&m(o,i,a+1);return}if((p=this.onChunkUpdated)==null||p.call(this,n,n.generateVertices(this._gatherNeighbors(o,i,a))),e===void 0)return;const l=ne.CHUNK_WIDTH,c=ne.CHUNK_HEIGHT,d=ne.CHUNK_DEPTH;e===0&&this._remeshSingleNeighbor(o-1,i,a),e===l-1&&this._remeshSingleNeighbor(o+1,i,a),t===0&&this._remeshSingleNeighbor(o,i-1,a),t===c-1&&this._remeshSingleNeighbor(o,i+1,a),r===0&&this._remeshSingleNeighbor(o,i,a-1),r===d-1&&this._remeshSingleNeighbor(o,i,a+1)}_createNearbyChunks(n){const e=q._cx(n.x),t=q._cy(n.y),r=q._cz(n.z),o=this.renderDistanceH,i=this.renderDistanceV,a=o*o,l=Math.max(1,this.chunksPerFrame);(!this._scratchTopD2||this._scratchTopD2.length!==l)&&(this._scratchTopD2=new Float64Array(l),this._scratchTopXYZ=new Int32Array(l*3));for(let f=0;f<l;f++)this._scratchTopD2[f]=1/0;let c=0,d=0,p=1/0;for(let f=-o;f<=o;f++){const h=f*f;for(let _=-o;_<=o;_++){const m=h+_*_;if(!(m>a))for(let b=-i;b<=i;b++){const y=e+f,v=t+b,w=r+_;if(this._generated.has(q._key(y,v,w)))continue;c++;const B=m+b*b;if(!(B>=p)){this._scratchTopD2[d]=B,this._scratchTopXYZ[d*3]=y,this._scratchTopXYZ[d*3+1]=v,this._scratchTopXYZ[d*3+2]=w,p=-1/0;for(let x=0;x<l;x++){const C=this._scratchTopD2[x];C>p&&(p=C,d=x)}}}}}if(this.pendingChunks=c,!(this._chunks.size>=q.MAX_CHUNKS))for(let f=0;f<l;f++){let h=-1,_=1/0;for(let v=0;v<l;v++){const w=this._scratchTopD2[v];w<_&&(_=w,h=v)}if(h<0||_===1/0||this._chunks.size>=q.MAX_CHUNKS)break;const m=this._scratchTopXYZ[h*3],b=this._scratchTopXYZ[h*3+1],y=this._scratchTopXYZ[h*3+2];this._scratchTopD2[h]=1/0,this._createChunkAt(m,b,y)}}_removeDistantChunks(n){const e=q._cx(n.x),t=q._cy(n.y),r=q._cz(n.z),o=this.renderDistanceH+1,i=this.renderDistanceV+1,a=this._scratchToDelete;a.length=0;for(const l of this._chunks.values()){const c=q._cx(l.globalPosition.x),d=q._cy(l.globalPosition.y),p=q._cz(l.globalPosition.z),f=c-e,h=d-t,_=p-r;(f*f+_*_>o*o||Math.abs(h)>i)&&a.push(l)}for(let l=0;l<a.length;l++)this.deleteChunk(a[l]);a.length=0}_createChunkAt(n,e,t){var i;const r=q._key(n,e,t);this._generated.add(r);const o=new ne(n*ne.CHUNK_WIDTH,e*ne.CHUNK_HEIGHT,t*ne.CHUNK_DEPTH);o.generateBlocks(this.seed,(a,l)=>this.getErosionDisplacement(a,l)),o.aliveBlocks>0&&(this._insertChunk(o),(i=this.onChunkAdded)==null||i.call(this,o,o.generateVertices(this._gatherNeighbors(n,e,t))),this._remeshSingleNeighbor(n-1,e,t),this._remeshSingleNeighbor(n+1,e,t),this._remeshSingleNeighbor(n,e-1,t),this._remeshSingleNeighbor(n,e+1,t),this._remeshSingleNeighbor(n,e,t-1),this._remeshSingleNeighbor(n,e,t+1))}_updateWaterFlow(n){var B;const e=this.waterSimulationRadius,t=Math.floor(n.x-e),r=Math.floor(n.x+e),o=Math.floor(Math.max(0,n.y-e)),i=Math.floor(n.y+e),a=Math.floor(n.z-e),l=Math.floor(n.z+e),c=ne.CHUNK_WIDTH,d=ne.CHUNK_HEIGHT,p=ne.CHUNK_DEPTH,f=Math.floor(t/c),h=Math.floor(r/c),_=Math.floor(o/d),m=Math.floor(i/d),b=Math.floor(a/p),y=Math.floor(l/p),v=this._scratchWaterBlocks;v.length=0;for(let x=f;x<=h;x++)for(let C=_;C<=m;C++)for(let L=b;L<=y;L++){const U=this._chunks.get(q._key(x,C,L));if(!U||U.waterBlocks===0)continue;const I=U.globalPosition.x,E=U.globalPosition.y,g=U.globalPosition.z,k=Math.max(0,t-I),P=Math.min(c-1,r-I),M=Math.max(0,o-E),S=Math.min(d-1,i-E),N=Math.max(0,a-g),G=Math.min(p-1,l-g);for(let H=N;H<=G;H++)for(let O=M;O<=S;O++)for(let T=k;T<=P;T++)he(U.getBlock(T,O,H))&&v.push(I+T,E+O,g+H)}const w=this._scratchDirtyChunks;w.clear(),this._dirtyChunks=w;try{for(let x=0;x<v.length;x+=3)this._flowWater(v[x],v[x+1],v[x+2])}finally{this._dirtyChunks=null}for(const x of w){const C=q._cx(x.globalPosition.x),L=q._cy(x.globalPosition.y),U=q._cz(x.globalPosition.z);(B=this.onChunkUpdated)==null||B.call(this,x,x.generateVertices(this._gatherNeighbors(C,L,U)))}w.clear(),v.length=0}_flowWater(n,e,t){const r=this.getBlockType(n,e-1,t);if(r===R.NONE||Ue(r)){this.setBlockType(n,e-1,t,R.WATER),this.setBlockType(n,e,t,R.NONE);return}let o=!1;for(let i=1;i<=4;i++){const a=this.getBlockType(n,e-i,t);if(a!==R.NONE&&!he(a)&&!Ue(a)){o=!0;break}if(a===R.NONE||Ue(a))break}if(!o){const i=[{x:n+1,y:e,z:t},{x:n-1,y:e,z:t},{x:n,y:e,z:t+1},{x:n,y:e,z:t-1}];for(const a of i){const l=this.getBlockType(a.x,a.y,a.z);if(l===R.NONE||Ue(l)){this.setBlockType(a.x,a.y,a.z,R.WATER),this.setBlockType(n,e,t,R.NONE);return}}}if(o){const i=[{x:n+1,y:e,z:t},{x:n-1,y:e,z:t},{x:n,y:e,z:t+1},{x:n,y:e,z:t-1}];for(const a of i){const l=this.getBlockType(a.x,a.y,a.z);if(l===R.NONE||Ue(l)){this.setBlockType(a.x,a.y,a.z,R.WATER);return}}}}};s(q,"MAX_CHUNKS",2048);let Rn=q;function Qt(u,n,e,t,r,o,i,a){const l=[{n:[0,0,-1],t:[-1,0,0,1],v:[[-o,-i,-a],[o,-i,-a],[o,i,-a],[-o,i,-a]]},{n:[0,0,1],t:[1,0,0,1],v:[[o,-i,a],[-o,-i,a],[-o,i,a],[o,i,a]]},{n:[-1,0,0],t:[0,0,-1,1],v:[[-o,-i,a],[-o,-i,-a],[-o,i,-a],[-o,i,a]]},{n:[1,0,0],t:[0,0,1,1],v:[[o,-i,-a],[o,-i,a],[o,i,a],[o,i,-a]]},{n:[0,1,0],t:[1,0,0,1],v:[[-o,i,-a],[o,i,-a],[o,i,a],[-o,i,a]]},{n:[0,-1,0],t:[1,0,0,1],v:[[-o,-i,a],[o,-i,a],[o,-i,-a],[-o,-i,-a]]}],c=[[0,1],[1,1],[1,0],[0,0]];for(const d of l){const p=u.length/12;for(let f=0;f<4;f++){const[h,_,m]=d.v[f];u.push(e+h,t+_,r+m,d.n[0],d.n[1],d.n[2],c[f][0],c[f][1],d.t[0],d.t[1],d.t[2],d.t[3])}n.push(p,p+2,p+1,p,p+3,p+2)}}function Ao(u,n=1){const e=[],t=[],r=n;return Qt(e,t,0,0,0,.19*r,.11*r,.225*r),Qt(e,t,0,.07*r,.225*r,.075*r,.06*r,.06*r),Le.fromData(u,new Float32Array(e),new Uint32Array(t))}function Eo(u,n=1){const e=[],t=[],r=n;return Qt(e,t,0,0,0,.085*r,.085*r,.075*r),Le.fromData(u,new Float32Array(e),new Uint32Array(t))}function Uo(u,n=1){const e=[],t=[],r=n;return Qt(e,t,0,0,0,.065*r,.03*r,.055*r),Le.fromData(u,new Float32Array(e),new Uint32Array(t))}function Je(u,n,e,t,r,o,i,a){const l=[{n:[0,0,-1],t:[-1,0,0,1],v:[[-o,-i,-a],[o,-i,-a],[o,i,-a],[-o,i,-a]]},{n:[0,0,1],t:[1,0,0,1],v:[[o,-i,a],[-o,-i,a],[-o,i,a],[o,i,a]]},{n:[-1,0,0],t:[0,0,-1,1],v:[[-o,-i,a],[-o,-i,-a],[-o,i,-a],[-o,i,a]]},{n:[1,0,0],t:[0,0,1,1],v:[[o,-i,-a],[o,-i,a],[o,i,a],[o,i,-a]]},{n:[0,1,0],t:[1,0,0,1],v:[[-o,i,-a],[o,i,-a],[o,i,a],[-o,i,a]]},{n:[0,-1,0],t:[1,0,0,1],v:[[-o,-i,a],[o,-i,a],[o,-i,-a],[-o,-i,-a]]}],c=[[0,1],[1,1],[1,0],[0,0]];for(const d of l){const p=u.length/12;for(let f=0;f<4;f++){const[h,_,m]=d.v[f];u.push(e+h,t+_,r+m,d.n[0],d.n[1],d.n[2],c[f][0],c[f][1],d.t[0],d.t[1],d.t[2],d.t[3])}n.push(p,p+2,p+1,p,p+3,p+2)}}function Co(u,n=1){const e=[],t=[],r=n;Je(e,t,0,0,0,.22*r,.15*r,.32*r),Je(e,t,0,.07*r,.32*r,.035*r,.035*r,.035*r);const o=.155*r,i=-.25*r,a=.255*r,l=.065*r,c=.1*r,d=.065*r;return Je(e,t,-o,i,-a,l,c,d),Je(e,t,o,i,-a,l,c,d),Je(e,t,-o,i,a,l,c,d),Je(e,t,o,i,a,l,c,d),Le.fromData(u,new Float32Array(e),new Uint32Array(t))}function ko(u,n=1){const e=[],t=[],r=n;return Je(e,t,0,0,0,.18*r,.16*r,.16*r),Le.fromData(u,new Float32Array(e),new Uint32Array(t))}function Lo(u,n=1){const e=[],t=[],r=n;return Je(e,t,0,0,0,.1*r,.08*r,.06*r),Le.fromData(u,new Float32Array(e),new Uint32Array(t))}const Fs=new j(0,1,0),tn=class tn extends et{constructor(e){super();s(this,"_world");s(this,"_state","idle");s(this,"_timer",0);s(this,"_targetX",0);s(this,"_targetZ",0);s(this,"_hasTarget",!1);s(this,"_velY",0);s(this,"_yaw",0);s(this,"_headGO",null);s(this,"_headBaseY",0);s(this,"_bobPhase");this._world=e,this._timer=1+Math.random()*4,this._yaw=Math.random()*Math.PI*2,this._bobPhase=Math.random()*Math.PI*2}onAttach(){for(const e of this.gameObject.children)if(e.name==="Duck.Head"){this._headGO=e,this._headBaseY=e.position.y;break}}update(e){const t=this.gameObject,r=t.position.x,o=t.position.z,i=tn.playerPos,a=i.x-r,l=i.z-o,c=a*a+l*l;this._velY-=9.8*e,t.position.y+=this._velY*e;const d=this._world.getTopBlockY(Math.floor(r),Math.floor(o),Math.ceil(t.position.y)+4);if(d>0&&t.position.y<=d+.1){const p=this._world.getBlockType(Math.floor(r),Math.floor(d-1),Math.floor(o));R.WATER,t.position.y=d,this._velY=0}switch(this._state){case"idle":{this._timer-=e,c<36?this._enterFlee():this._timer<=0&&this._pickWanderTarget();break}case"wander":{if(this._timer-=e,c<36){this._enterFlee();break}if(!this._hasTarget||this._timer<=0){this._enterIdle();break}const p=this._targetX-r,f=this._targetZ-o,h=p*p+f*f;if(h<.25){this._enterIdle();break}const _=Math.sqrt(h),m=p/_,b=f/_;t.position.x+=m*1.5*e,t.position.z+=b*1.5*e,this._yaw=Math.atan2(-m,-b);break}case"flee":{if(c>196){this._enterIdle();break}const p=Math.sqrt(c),f=p>0?-a/p:0,h=p>0?-l/p:0;t.position.x+=f*4*e,t.position.z+=h*4*e,this._yaw=Math.atan2(-f,-h);break}}if(t.rotation=_e.fromAxisAngle(Fs,this._yaw),this._headGO){this._bobPhase+=e*(this._state==="wander"?6:2);const p=this._state==="wander"?.018:.008;this._headGO.position.y=this._headBaseY+Math.sin(this._bobPhase)*p}}_enterIdle(){this._state="idle",this._hasTarget=!1,this._timer=2+Math.random()*5}_enterFlee(){this._state="flee",this._hasTarget=!1}_pickWanderTarget(){const e=this.gameObject,t=Math.random()*Math.PI*2,r=3+Math.random()*8;this._targetX=e.position.x+Math.cos(t)*r,this._targetZ=e.position.z+Math.sin(t)*r,this._hasTarget=!0,this._state="wander",this._timer=6+Math.random()*6}};s(tn,"playerPos",new j(0,0,0));let mt=tn;const Ro=""+new URL("hotbar-DkVq2FsR.png",import.meta.url).href,Ht=[R.DIRT,R.IRON,R.STONE,R.SAND,R.TRUNK,R.SPRUCE_PLANKS,R.GLASS,R.TORCH,R.WATER];function Hs(u){const n=Ht.length;let e=0;const t=document.createElement("div");t.style.cssText=["position:fixed","bottom:12px","left:50%","transform:translateX(-50%)","display:flex","flex-direction:row","flex-wrap:nowrap","align-items:center","gap:0px","background:url("+Ro+") no-repeat","background-position:-48px 0px","background-size:414px 48px","width:364px","height:44px","padding:1px 2px","image-rendering:pixelated","box-sizing:border-box"].join(";");const r=[];for(let d=0;d<n;d++){const p=document.createElement("div");p.style.cssText=["width:40px","height:40px","display:flex","align-items:center","justify-content:center","position:relative","flex-shrink:0"].join(";");const f=document.createElement("canvas");f.width=f.height=32,f.style.cssText="width:32px;height:32px;image-rendering:pixelated;",p.appendChild(f);const h=document.createElement("span");h.textContent=String(d+1),h.style.cssText=["position:absolute","top:1px","left:3px","font-family:ui-monospace,monospace","font-size:9px","color:#ccc","text-shadow:0 0 2px #000","pointer-events:none"].join(";"),p.appendChild(h),t.appendChild(p),r.push(f)}document.body.appendChild(t);const o=document.createElement("div");o.style.cssText=["position:fixed","bottom:12px","width:44px","height:48px","background:url("+Ro+") no-repeat","background-position:0px 0px","background-size:414px 48px","pointer-events:none","image-rendering:pixelated","transition:left 60ms linear"].join(";"),document.body.appendChild(o);let i=null;function a(){const d=t.getBoundingClientRect();o.style.left=d.left-2+e*40+"px",i==null||i()}const l=new Image;l.src=u;function c(){if(!l.complete)return;const d=16;for(let p=0;p<n;p++){const f=nn.find(_=>_.blockType===Ht[p]),h=r[p].getContext("2d");h.clearRect(0,0,32,32),f&&(h.imageSmoothingEnabled=!1,h.drawImage(l,f.sideFace.x*d,f.sideFace.y*d,d,d,0,0,32,32))}}return l.onload=c,window.addEventListener("keydown",d=>{const p=parseInt(d.key);p>=1&&p<=n&&(e=p-1,a())}),window.addEventListener("wheel",d=>{e=(e+(d.deltaY>0?1:n-1))%n,a()},{passive:!0}),requestAnimationFrame(a),{getSelected:()=>Ht[e],refresh:c,getSelectedSlot:()=>e,setSelectedSlot:d=>{e=d,a()},setOnSelectionChanged:d=>{i=d},slots:Ht,element:t}}const Ws="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAACWCAYAAADwkd5lAAAD7ElEQVR4nO3dUU7bahSF0eOqgyIwDU/EkmcBUibicQRm5ftyE7UoacvOb+LEa0l9obD7P/VTKdKpAgAA+C7dX35//pZXALBWFzvxp4DM86wfAFvWdV3VhVZcCoh4AFBVlyNyLiCneLy/vy/7KgBWbbfbVdX5iPy4wXsAeAACAkBEQACICAgAEQEBIPLzK588DMPVf2Df9zVNkx07duxsfqflVqud/X7/z5/7pR/jHYah+r6/5m01jmM9PT3ZsWPHzuZ3pmmqj4+Pent7W83O54D4MV4AmhMQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAANDMfHQ6H3369vr7OLdixY8eOnXW95bjz+e/9o6qaP8fiywelrrW261t27Nixc6udlltLXST800EpFwnt2LFj50Y7LhICsEkCAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgGZOF6hcJLRjx46d5XbW9JbjjouEduzYsXMHOy23XCS0Y8eOnQ3tuEgIwCYJCAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQAJo5XaBykdCOHTt2lttZ01uOOy4S2rFjx84d7LTccpHQjh07dja04yIhAJskIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBICIgAAQERAAIgICQERAAGjmdIHKRUI7duzYWW5nTW857rhIaMeOHTt3sNNyy0VCO3bs2NnQjouEAGySgAAQERAAIgICQERAAIgICAARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBAaCZ0wUqFwnt2LFjZ7mdNb3luOMioR07duzcwU7LLRcJ7dixY2dDOy4SArBJAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkBEQACICAgAEQEBICIgAEQEBIBmTheoXCS0Y8eOneV21vSW485iFwkB2BYHpQBoTkAAiAgIAJGft34AyxmG4eqNvu9rmiY7duKdl5eXq3dYJwF5cH3fX/X14zjWNE127MQ7fhjncfkWFgARAQEgIiAARAQEgIiAABAREAAiAgJAREAAiAgIABEBASAiIABEBASAiIAAEBEQACICAkDEPZAH1vd9jeNox85Nd3hc3ZmPzfM8V1U5BAOwcbvdrqqquq6r+tQM38ICICIgAEQEBIDIuf9E77qumw+HQ+33+29/EADr8vz8XHXm/8wv/Quk+/8LANiwS/G4+MFfzM1fA8A9+VsnAAAAvsF/uG+b8sfhThMAAAAASUVORK5CYII=";function js(u,n,e,t,r,o){const b=[];for(let k=1;k<R.MAX;k++)k!==R.WATER&&b.push(k);const y=document.createElement("div");y.style.cssText="position:relative;display:inline-block;align-self:center;";const v=document.createElement("img");v.src=Ws,v.draggable=!1,v.style.cssText=[`width:${400*2}px`,`height:${150*2}px`,"display:block","image-rendering:pixelated","user-select:none"].join(";"),y.appendChild(v);const w=new Image;w.src=n;function B(k,P){const M=k.getContext("2d");if(M.clearRect(0,0,k.width,k.height),!P)return;const S=nn.find(N=>N.blockType===P);S&&(M.imageSmoothingEnabled=!1,M.drawImage(w,S.sideFace.x*16,S.sideFace.y*16,16,16,0,0,k.width,k.height))}let x=null,C=null;const L=[];function U(){L.forEach((k,P)=>{k.style.outline=P===r()?"2px solid #ff0":""})}function I(k,P,M){const S=document.createElement("div");S.style.cssText=["position:absolute",`left:${k}px`,`top:${P}px`,"width:32px","height:32px","box-sizing:border-box","cursor:grab"].join(";"),S.draggable=M;const N=document.createElement("canvas");return N.width=N.height=32,N.style.cssText="width:32px;height:32px;image-rendering:pixelated;pointer-events:none;display:block;",S.appendChild(N),y.appendChild(S),[S,N]}for(let k=0;k<6;k++)for(let P=0;P<21;P++){const M=b[k*21+P]??null;if(!M)continue;const[S,N]=I(24+P*36,24+k*36,!0);S.title=String(Ki[M]),w.complete?B(N,M):w.addEventListener("load",()=>B(N,M),{once:!1}),S.addEventListener("click",()=>{e[r()]=M,g(),t()}),S.addEventListener("dragstart",G=>{x=M,C=null,G.dataTransfer.effectAllowed="copy",S.style.opacity="0.4"}),S.addEventListener("dragend",()=>{S.style.opacity="1"})}const E=[];for(let k=0;k<9;k++){const[P,M]=I(240+k*36,248,!0);E.push(M),L.push(P),P.title=`Slot ${k+1}`,P.addEventListener("click",()=>{o(k),U()}),P.addEventListener("dragstart",S=>{x=e[k],C=k,S.dataTransfer.effectAllowed="move",P.style.opacity="0.4"}),P.addEventListener("dragend",()=>{P.style.opacity="1"}),P.addEventListener("dragover",S=>{S.preventDefault(),S.dataTransfer.dropEffect=C!==null?"move":"copy",P.style.boxShadow="inset 0 0 0 2px #7ff"}),P.addEventListener("dragleave",()=>{P.style.boxShadow=""}),P.addEventListener("drop",S=>{S.preventDefault(),P.style.boxShadow="",x&&(C!==null&&C!==k?[e[k],e[C]]=[e[C],e[k]]:C===null&&(e[k]=x),g(),t(),x=null,C=null)})}function g(){for(let k=0;k<9;k++)B(E[k],e[k])}return w.addEventListener("load",g),w.complete&&g(),u.appendChild(y),{syncHotbar:g,refreshSlotHighlight:U}}function qs(u,n,e){const t=document.createElement("div");t.style.cssText=["display:flex","flex-wrap:wrap","gap:8px","justify-content:center","font-family:ui-monospace,monospace","font-size:13px","user-select:none"].join(";");const r="background:#1a2e1a;color:#5f5;border-color:#5f5",o="background:#2e1a1a;color:#f55;border-color:#f55";for(const i of Object.keys(u)){const a=document.createElement("button"),l=i.toUpperCase().padEnd(5),c=()=>{const d=u[i];a.textContent=`${l} ${d?"ON ":"OFF"}`,a.setAttribute("style",["padding:5px 10px","border-width:1px","border-style:solid","border-radius:4px","cursor:pointer","letter-spacing:0.04em",d?r:o].join(";"))};a.addEventListener("click",()=>{u[i]=!u[i],c(),n(i)}),c(),t.appendChild(a)}return e.appendChild(t),t}function Ys(u,n){const e=document.createElement("div");e.style.cssText=["position:fixed","inset:0","z-index:100","background:rgba(0,0,0,0.78)","display:none","align-items:center","justify-content:center","font-family:ui-monospace,monospace"].join(";"),document.body.appendChild(e);const t=document.createElement("div");t.style.cssText=["display:flex","flex-direction:column","align-items:center","gap:clamp(12px,3vh,24px)","padding:clamp(20px,5vh,48px) clamp(16px,5vw,56px)","background:rgba(255,255,255,0.24)","border:1px solid rgba(255,255,255,0.12)","border-radius:12px","width:min(860px,calc(100vw - 24px))","box-sizing:border-box","max-height:min(700px,calc(100vh - 24px))","overflow-y:auto"].join(";"),e.appendChild(t);const r=document.createElement("h1");r.textContent="CRAFTY",r.style.cssText=["margin:0","font-size:clamp(28px,7vw,52px)","font-weight:900","color:#fff","letter-spacing:0.12em","text-shadow:0 0 48px rgba(100,200,255,0.45)","font-family:ui-monospace,monospace"].join(";"),t.appendChild(r);const o=document.createElement("button");o.textContent="Back to Game",o.style.cssText=["padding:10px 40px","font-size:15px","font-family:ui-monospace,monospace","background:#1a3a1a","color:#5f5","border:1px solid #5f5","border-radius:6px","cursor:pointer","letter-spacing:0.06em","transition:background 0.15s"].join(";"),o.addEventListener("mouseenter",()=>{o.style.background="#243e24"}),o.addEventListener("mouseleave",()=>{o.style.background="#1a3a1a"});const i=()=>{d();try{u.requestPointerLock()}catch{}};o.addEventListener("click",i),o.addEventListener("touchend",f=>{f.preventDefault(),i()},{passive:!1}),t.appendChild(o);const a=document.createElement("div");a.style.cssText="width:100%;height:1px;background:rgba(255,255,255,0.12)",t.appendChild(a);let l=0;function c(){l=performance.now(),e.style.display="flex",n.style.display="none"}function d(){e.style.display="none",n.style.display=""}function p(){return e.style.display!=="none"}return document.addEventListener("pointerlockchange",()=>{document.pointerLockElement===u?d():c()}),document.addEventListener("keydown",f=>{if(f.code==="Escape"&&p()){if(performance.now()-l<200)return;d(),u.requestPointerLock()}}),{overlay:e,card:t,open:c,close:d,isOpen:p}}function Xs(){const u=document.createElement("div");u.style.cssText=["position:fixed","top:50%","left:50%","width:16px","height:16px","transform:translate(-50%,-50%)","pointer-events:none"].join(";"),u.innerHTML=['<div style="position:absolute;top:50%;left:0;width:100%;height:3px;background:#fff;opacity:0.8;transform:translateY(-50%)"></div>','<div style="position:absolute;left:50%;top:0;width:3px;height:100%;background:#fff;opacity:0.8;transform:translateX(-50%)"></div>','<div style="position:absolute;top:50%;left:50%;width:7px;height:3px;background:#fff;opacity:0.9;transform:translate(-50%,-50%);border-radius:50%"></div>'].join(""),document.body.appendChild(u);const n=document.createElement("div");n.style.cssText=["position:fixed","top:12px","right:12px","font-family:ui-monospace,monospace","font-size:13px","color:#ff0","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none"].join(";"),document.body.appendChild(n);const e=document.createElement("div");e.style.cssText=["position:fixed","top:44px","right:12px","font-family:ui-monospace,monospace","font-size:11px","color:#aaf","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none","white-space:pre"].join(";"),document.body.appendChild(e);const t=document.createElement("div");t.style.cssText=["position:fixed","bottom:12px","right:12px","font-family:ui-monospace,monospace","font-size:13px","color:#ff0","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none"].join(";"),document.body.appendChild(t);const r=document.createElement("div");return r.style.cssText=["position:fixed","bottom:44px","right:12px","font-family:ui-monospace,monospace","font-size:11px","color:#ccf","background:rgba(0,0,0,0.85)","padding:4px 8px","border-radius:4px","pointer-events:none"].join(";"),document.body.appendChild(r),{fps:n,stats:e,biome:t,pos:r,reticle:u}}function $s(u,n,e,t,r,o,i,a){const l=new ge("Camera");l.position.set(64,25,64);const c=l.addComponent(new ei(70,.1,1e3,t/r));n.add(l);const d=new ge("Flashlight"),p=d.addComponent(new ni);p.color=new j(1,.95,.9),p.intensity=0,p.range=40,p.innerAngle=12,p.outerAngle=25,p.castShadow=!1,p.projectionTexture=o,l.addChild(d),n.add(d);let f=!1;const h=new la(e,Math.PI,.1);h.attach(u);const _=new Yi(Math.PI,.1,15);let m=!0;const b=document.createElement("div");b.textContent="PLAYER",b.style.cssText=["position:fixed","top:12px","left:12px","font-family:ui-monospace,monospace","font-size:13px","font-weight:bold","color:#4f4","background:rgba(0,0,0,0.45)","padding:4px 8px","border-radius:4px","pointer-events:none","letter-spacing:0.05em"].join(";"),document.body.appendChild(b);function y(x){i&&(i.style.display=x?"":"none"),a&&(a.style.display=x?"":"none")}function v(){m=!m,m?(h.yaw=_.yaw,h.pitch=_.pitch,_.detach(),h.attach(u)):(_.yaw=h.yaw,_.pitch=h.pitch,h.detach(),_.attach(u)),b.textContent=m?"PLAYER":"FREE",b.style.color=m?"#4f4":"#4cf",y(m)}function w(x){f=x,p.intensity=f?25:0}let B=-1/0;return document.addEventListener("keyup",x=>{x.code==="Space"&&(B=performance.now())}),document.addEventListener("keydown",x=>{if(x.code==="KeyC"&&!x.repeat){v();return}if(!(x.code!=="Space"||x.repeat)&&performance.now()-B<400&&document.pointerLockElement===u){const C=m;v(),B=-1/0,C&&_.pressKey("Space")}}),window.addEventListener("keydown",x=>{x.code==="KeyF"&&!x.repeat&&(w(!f),console.log(`Flashlight ${f?"ON":"OFF"} (intensity: ${p.intensity})`)),x.ctrlKey&&x.key==="w"&&(x.preventDefault(),window.location.reload())}),{cameraGO:l,camera:c,player:h,freeCamera:_,isPlayerMode:()=>m,flashlight:p,isFlashlightEnabled:()=>f,modeEl:b,toggleController:v,setFlashlightEnabled:w,setPlayerUIVisible:y}}const Pt=new Map,Gt=new Map,rn=(u,n,e)=>`${u},${n},${e}`;function ci(u,n,e,t){const r=rn(u,n,e);if(Pt.has(r))return;const o=new ge("TorchLight");o.position.set(u+.5,n+.9,e+.5);const i=o.addComponent(new Dn);i.color=new j(1,.52,.18),i.intensity=4,i.radius=6,i.castShadow=!1,t.add(o);const a=(u*127.1+n*311.7+e*74.3)%(Math.PI*2);Pt.set(r,{go:o,pl:i,phase:a})}function Nn(u,n,e,t){const r=rn(u,n,e),o=Pt.get(r);o&&(t.remove(o.go),Pt.delete(r))}function Zs(u){for(const{pl:n,phase:e}of Pt.values()){const t=1+.08*Math.sin(u*11.7+e)+.05*Math.sin(u*7.3+e*1.7)+.03*Math.sin(u*23.1+e*.5);n.intensity=4*t}}function ui(u,n,e,t){const r=rn(u,n,e);if(Gt.has(r))return;const o=new ge("MagmaLight");o.position.set(u+.5,n+.5,e+.5);const i=o.addComponent(new Dn);i.color=new j(1,.28,0),i.intensity=6,i.radius=10,i.castShadow=!1,t.add(o);const a=(u*127.1+n*311.7+e*74.3)%(Math.PI*2);Gt.set(r,{go:o,pl:i,phase:a})}function di(u,n,e,t){const r=rn(u,n,e),o=Gt.get(r);o&&(t.remove(o.go),Gt.delete(r))}function Ks(u){for(const{pl:n,phase:e}of Gt.values()){const t=1+.18*Math.sin(u*1.1+e)+.1*Math.sin(u*2.9+e*.7)+.06*Math.sin(u*.5+e*1.4);n.intensity=6*t}}const Js=700,Qs=300;function fi(u){return Zi[u]*1500}function el(){return{targetBlock:null,targetHit:null,mouseHeld:-1,mouseHoldTime:0,lastBlockAction:0,breakProgress:0,breakingBlock:null,breakTime:0,crackStage:-1}}function In(u,n,e){var a,l;const t=u.breakingBlock.x,r=u.breakingBlock.y,o=u.breakingBlock.z,i=n.getBlockType(t,r,o);if(i===R.TORCH&&Nn(t,r,o,e),i===R.MAGMA&&di(t,r,o,e),n.mineBlock(t,r,o)&&((a=u.onLocalEdit)==null||a.call(u,{kind:"break",x:t,y:r,z:o}),!Ue(i))){const c=n.getBlockType(t,r+1,o);Ue(c)&&(c===R.TORCH&&Nn(t,r+1,o,e),n.mineBlock(t,r+1,o)&&((l=u.onLocalEdit)==null||l.call(u,{kind:"break",x:t,y:r+1,z:o})))}u.breakProgress=0,u.breakingBlock=null,u.crackStage=-1}function cr(u,n,e,t,r,o){var i;if(u===0&&e.targetBlock){const a=e.targetBlock.x,l=e.targetBlock.y,c=e.targetBlock.z,d=t.getBlockType(a,l,c);e.breakingBlock&&(e.breakingBlock.x!==a||e.breakingBlock.y!==l||e.breakingBlock.z!==c)&&(e.breakProgress=0,e.crackStage=-1,e.breakingBlock=null),e.breakingBlock=new j(a,l,c),e.breakTime=fi(d),e.breakTime===0&&In(e,t,o),e.lastBlockAction=n}else if(u===2&&e.targetHit){const a=e.targetHit,l=r(),c=a.position.x+a.face.x,d=a.position.y+a.face.y,p=a.position.z+a.face.z;t.addBlock(a.position.x,a.position.y,a.position.z,a.face.x,a.face.y,a.face.z,l)&&(l===R.TORCH&&ci(c,d,p,o),l===R.MAGMA&&ui(c,d,p,o),(i=e.onLocalEdit)==null||i.call(e,{kind:"place",x:a.position.x,y:a.position.y,z:a.position.z,fx:a.face.x,fy:a.face.y,fz:a.face.z,blockType:l})),e.lastBlockAction=n}}function No(u,n,e){if(u.kind==="break"){const i=n.getBlockType(u.x,u.y,u.z);i===R.TORCH&&Nn(u.x,u.y,u.z,e),i===R.MAGMA&&di(u.x,u.y,u.z,e),n.mineBlock(u.x,u.y,u.z);return}const t=u.x+u.fx,r=u.y+u.fy,o=u.z+u.fz;n.setBlockType(t,r,o,u.blockType),u.blockType===R.TORCH&&ci(t,r,o,e),u.blockType===R.MAGMA&&ui(t,r,o,e)}function tl(u,n,e,t,r){u.addEventListener("contextmenu",o=>o.preventDefault()),u.addEventListener("mousedown",o=>{document.pointerLockElement===u&&(o.button!==0&&o.button!==2||(n.mouseHeld=o.button,n.mouseHoldTime=o.timeStamp,o.button===2&&cr(o.button,o.timeStamp,n,e,t,r)))}),u.addEventListener("mouseup",o=>{o.button===n.mouseHeld&&(n.mouseHeld=-1,n.breakProgress=0,n.breakingBlock=null,n.crackStage=-1)})}function nl(u,n,e,t,r,o,i){if(t.mouseHeld>=0&&document.pointerLockElement===e)if(t.mouseHeld===0){const a=t.targetBlock;if(a&&t.breakingBlock)a.x===t.breakingBlock.x&&a.y===t.breakingBlock.y&&a.z===t.breakingBlock.z?(t.breakProgress+=u*1e3,t.crackStage=Math.min(Math.floor(t.breakProgress/t.breakTime*10),9),t.breakProgress>=t.breakTime&&In(t,r,i)):(t.breakProgress=0,t.breakingBlock=null,t.crackStage=-1);else if(a&&!t.breakingBlock){const l=r.getBlockType(a.x,a.y,a.z);t.breakingBlock=new j(a.x,a.y,a.z),t.breakTime=fi(l),t.breakProgress=0,t.crackStage=0,t.breakTime===0&&In(t,r,i)}}else t.mouseHeld===2&&n-t.mouseHoldTime>=Js&&n-t.lastBlockAction>=Qs&&cr(t.mouseHeld,n,t,r,o,i);else t.breakingBlock&&(t.breakProgress=0,t.breakingBlock=null,t.crackStage=-1)}const Ze=60,rl=.1,Wt=28,dt=64,Io=44,ol=.005;function il(u,n,e){const t={controls:null,cancel(){}},r=()=>{t.controls||(t.controls=new sl(u,n),e==null||e(t.controls))};return window.addEventListener("touchstart",r,{once:!0,passive:!0,capture:!0}),t.cancel=()=>window.removeEventListener("touchstart",r,!0),t}function al(){if(typeof location<"u"&&/[?&]touch(=1|=true|=on|$|&)/.test(location.search))return!0;if(typeof navigator<"u"){const u=navigator;if((u.maxTouchPoints??0)>0||(u.msMaxTouchPoints??0)>0)return!0}if(typeof window<"u"&&"ontouchstart"in window)return!0;if(typeof window<"u"&&typeof window.matchMedia=="function")try{if(window.matchMedia("(any-pointer: coarse)").matches||window.matchMedia("(pointer: coarse)").matches)return!0}catch{}return!1}class sl{constructor(n,e){s(this,"_root");s(this,"_joystick");s(this,"_stick");s(this,"_btnJump");s(this,"_btnSneak");s(this,"_btnMine");s(this,"_btnPlace");s(this,"_btnMenu");s(this,"_joyTouchId",null);s(this,"_joyOriginX",0);s(this,"_joyOriginY",0);s(this,"_lookTouchId",null);s(this,"_lookLastX",0);s(this,"_lookLastY",0);s(this,"_lookLastTapAt",-1/0);s(this,"_lookSensitivity");s(this,"_onJoyStart",n=>{if(this._joyTouchId!==null)return;n.preventDefault();const e=n.changedTouches[0];this._joyTouchId=e.identifier;const t=this._joystick.getBoundingClientRect();this._joyOriginX=t.left+t.width*.5,this._joyOriginY=t.top+t.height*.5,this._updateJoystick(e.clientX,e.clientY)});s(this,"_onJoyMove",n=>{if(this._joyTouchId!==null)for(let e=0;e<n.changedTouches.length;e++){const t=n.changedTouches[e];if(t.identifier===this._joyTouchId){n.preventDefault(),this._updateJoystick(t.clientX,t.clientY);return}}});s(this,"_onJoyEnd",n=>{if(this._joyTouchId!==null){for(let e=0;e<n.changedTouches.length;e++)if(n.changedTouches[e].identifier===this._joyTouchId){n.preventDefault(),this._joyTouchId=null,this._setMovement(0,0),this._stick.style.transform="translate(0px, 0px)";return}}});s(this,"_onLookStart",n=>{if(this._lookTouchId!==null)return;const e=n.changedTouches[0],t=window.innerWidth*.5;if(e.clientX<t)return;n.preventDefault(),this._lookTouchId=e.identifier,this._lookLastX=e.clientX,this._lookLastY=e.clientY;const r=performance.now();r-this._lookLastTapAt<350&&this._opts.onLookDoubleTap?(this._opts.onLookDoubleTap(),this._lookLastTapAt=-1/0):this._lookLastTapAt=r});s(this,"_onLookMove",n=>{if(this._lookTouchId!==null)for(let e=0;e<n.changedTouches.length;e++){const t=n.changedTouches[e];if(t.identifier!==this._lookTouchId)continue;n.preventDefault();const r=t.clientX-this._lookLastX,o=t.clientY-this._lookLastY;this._lookLastX=t.clientX,this._lookLastY=t.clientY,this._applyLook(r,o);return}});s(this,"_onLookEnd",n=>{if(this._lookTouchId!==null){for(let e=0;e<n.changedTouches.length;e++)if(n.changedTouches[e].identifier===this._lookTouchId){n.preventDefault(),this._lookTouchId=null;return}}});this._canvas=n,this._opts=e,this._lookSensitivity=e.lookSensitivity??ol,this._root=document.createElement("div"),this._root.style.cssText=["position:fixed","inset:0","pointer-events:none","user-select:none","-webkit-user-select:none","touch-action:none","z-index:50"].join(";"),this._joystick=document.createElement("div"),this._joystick.style.cssText=["position:absolute","left:24px","bottom:24px",`width:${Ze*2}px`,`height:${Ze*2}px`,"border-radius:50%","background:rgba(255,255,255,0.10)","border:2px solid rgba(255,255,255,0.30)","pointer-events:auto"].join(";"),this._stick=document.createElement("div"),this._stick.style.cssText=["position:absolute",`left:${Ze-Wt}px`,`top:${Ze-Wt}px`,`width:${Wt*2}px`,`height:${Wt*2}px`,"border-radius:50%","background:rgba(255,255,255,0.30)","border:2px solid rgba(255,255,255,0.50)","pointer-events:none","transition:transform 80ms ease-out"].join(";"),this._joystick.appendChild(this._stick),this._root.appendChild(this._joystick),this._btnMine=this._makeButton("⛏",`right:${24+dt+12}px`,`bottom:${24+dt+12}px`,"rgba(220,80,80,0.45)"),this._btnPlace=this._makeButton("▣","right:24px",`bottom:${24+dt+12}px`,"rgba(80,180,90,0.45)"),this._btnJump=this._makeButton("⤒","right:24px","bottom:24px","rgba(255,255,255,0.18)"),this._btnSneak=this._makeButton("⤓",`right:${24+dt+12}px`,"bottom:24px","rgba(255,255,255,0.10)"),this._btnMenu=this._makeButton("☰","right:16px","top:16px","rgba(0,0,0,0.45)"),this._btnMenu.style.width=`${Io}px`,this._btnMenu.style.height=`${Io}px`,this._btnMenu.style.fontSize="24px",document.body.appendChild(this._root),this._attachEvents()}destroy(){this._detachEvents(),this._root.remove()}_makeButton(n,e,t,r){const o=document.createElement("div");return o.textContent=n,o.style.cssText=["position:absolute",e,t,`width:${dt}px`,`height:${dt}px`,"border-radius:50%",`background:${r}`,"border:2px solid rgba(255,255,255,0.45)","color:#fff","font-size:32px","font-family:sans-serif","display:flex","align-items:center","justify-content:center","pointer-events:auto","user-select:none"].join(";"),this._root.appendChild(o),o}_attachEvents(){this._joystick.addEventListener("touchstart",this._onJoyStart,{passive:!1}),this._joystick.addEventListener("touchmove",this._onJoyMove,{passive:!1}),this._joystick.addEventListener("touchend",this._onJoyEnd,{passive:!1}),this._joystick.addEventListener("touchcancel",this._onJoyEnd,{passive:!1}),this._canvas.addEventListener("touchstart",this._onLookStart,{passive:!1}),this._canvas.addEventListener("touchmove",this._onLookMove,{passive:!1}),this._canvas.addEventListener("touchend",this._onLookEnd,{passive:!1}),this._canvas.addEventListener("touchcancel",this._onLookEnd,{passive:!1}),this._bindHoldButton(this._btnJump,()=>this._setJump(!0),()=>this._setJump(!1)),this._bindHoldButton(this._btnSneak,()=>this._setSneak(!0),()=>this._setSneak(!1)),this._bindHoldButton(this._btnMine,()=>this._actionDown(0),()=>this._actionUp(0)),this._bindHoldButton(this._btnPlace,()=>this._actionDown(2),()=>this._actionUp(2));const n=e=>{var t,r;e.preventDefault(),this._btnMenu.style.filter="",(r=(t=this._opts).onMenu)==null||r.call(t)};this._btnMenu.addEventListener("touchstart",e=>{e.preventDefault(),this._btnMenu.style.filter="brightness(1.5)"},{passive:!1}),this._btnMenu.addEventListener("touchend",n,{passive:!1}),this._btnMenu.addEventListener("touchcancel",()=>{this._btnMenu.style.filter=""},{passive:!1})}_detachEvents(){this._joystick.removeEventListener("touchstart",this._onJoyStart),this._joystick.removeEventListener("touchmove",this._onJoyMove),this._joystick.removeEventListener("touchend",this._onJoyEnd),this._joystick.removeEventListener("touchcancel",this._onJoyEnd),this._canvas.removeEventListener("touchstart",this._onLookStart),this._canvas.removeEventListener("touchmove",this._onLookMove),this._canvas.removeEventListener("touchend",this._onLookEnd),this._canvas.removeEventListener("touchcancel",this._onLookEnd)}_bindHoldButton(n,e,t){const r=i=>{i.preventDefault(),n.style.filter="brightness(1.5)",e()},o=i=>{i.preventDefault(),n.style.filter="",t()};n.addEventListener("touchstart",r,{passive:!1}),n.addEventListener("touchend",o,{passive:!1}),n.addEventListener("touchcancel",o,{passive:!1})}_updateJoystick(n,e){let t=n-this._joyOriginX,r=e-this._joyOriginY;const o=Math.hypot(t,r);if(o>Ze){const c=Ze/o;t*=c,r*=c}this._stick.style.transition="none",this._stick.style.transform=`translate(${t}px, ${r}px)`,requestAnimationFrame(()=>{this._stick.style.transition="transform 80ms ease-out"});const i=t/Ze,a=r/Ze;if(Math.hypot(i,a)<rl){this._setMovement(0,0);return}this._setMovement(i,-a)}_activeIsCamera(){return(this._opts.getActive?this._opts.getActive():"player")==="camera"}_setMovement(n,e){const t=this._activeIsCamera();t&&this._opts.camera?(this._opts.camera.inputForward=e,this._opts.camera.inputStrafe=n):this._opts.player&&(this._opts.player.inputForward=e,this._opts.player.inputStrafe=n),t&&this._opts.player?(this._opts.player.inputForward=0,this._opts.player.inputStrafe=0):!t&&this._opts.camera&&(this._opts.camera.inputForward=0,this._opts.camera.inputStrafe=0)}_setJump(n){this._activeIsCamera()&&this._opts.camera?this._opts.camera.inputUp=n:this._opts.player&&(this._opts.player.inputJump=n)}_setSneak(n){this._activeIsCamera()&&this._opts.camera?this._opts.camera.inputDown=n:this._opts.player&&(this._opts.player.inputSneak=n)}_applyLook(n,e){const t=n*(this._lookSensitivity/.002),r=e*(this._lookSensitivity/.002);this._activeIsCamera()&&this._opts.camera?this._opts.camera.applyLookDelta(t,r):this._opts.player&&this._opts.player.applyLookDelta(t,r)}_actionDown(n){const{world:e,scene:t,blockInteraction:r,getSelectedBlock:o}=this._opts;if(!e||!t||!r||!o)return;const i=performance.now();r.mouseHeld=n,r.mouseHoldTime=i,cr(n,i,r,e,o,t)}_actionUp(n){const e=this._opts.blockInteraction;e&&e.mouseHeld===n&&(e.mouseHeld=-1)}}const ll=""+new URL("cloth1-rQSbqQaY.wav",import.meta.url).href,cl=""+new URL("cloth2-Bsf9dy7W.wav",import.meta.url).href,ul=""+new URL("cloth3-4mN9PCjB.wav",import.meta.url).href,dl=""+new URL("cloth4-BB13HI0Q.wav",import.meta.url).href,fl=""+new URL("coral1-Ce7Jeu17.wav",import.meta.url).href,pl=""+new URL("coral2-Cfy2RjU2.wav",import.meta.url).href,hl=""+new URL("coral3-CyI9rIW8.wav",import.meta.url).href,_l=""+new URL("coral4-Bp3T5iM4.wav",import.meta.url).href,ml=""+new URL("coral5-DonNr-7d.wav",import.meta.url).href,gl=""+new URL("coral6-B8JOks-i.wav",import.meta.url).href,vl=""+new URL("grass1-CcRd259Q.wav",import.meta.url).href,bl=""+new URL("grass2-DGXOtHh7.wav",import.meta.url).href,yl=""+new URL("grass3-BPyuRLOX.wav",import.meta.url).href,wl=""+new URL("grass4-DVxIVnx3.wav",import.meta.url).href,xl=""+new URL("grass5-DI6OjZl4.wav",import.meta.url).href,Bl=""+new URL("grass6-Bf5VD6yI.wav",import.meta.url).href,Sl=""+new URL("gravel1-CZz6Zfew.wav",import.meta.url).href,Pl=""+new URL("gravel2-C9lv5mzC.wav",import.meta.url).href,Gl=""+new URL("gravel3-DyeQ0Rfa.wav",import.meta.url).href,Tl=""+new URL("gravel4-BfSCT7w0.wav",import.meta.url).href,Ml=""+new URL("sand1-Ciqwhtq8.wav",import.meta.url).href,Al=""+new URL("sand2-BTi87W5b.wav",import.meta.url).href,El=""+new URL("sand3-532u2TkY.wav",import.meta.url).href,Ul=""+new URL("sand4-C_w1pmBG.wav",import.meta.url).href,Cl=""+new URL("sand5-CDCdXHm6.wav",import.meta.url).href,kl=""+new URL("stone1-BsjzFAng.wav",import.meta.url).href,Ll=""+new URL("stone2-DzvdL41T.wav",import.meta.url).href,Rl=""+new URL("stone3-CYb6BfFN.wav",import.meta.url).href,Nl=""+new URL("stone4-DFPefyQ7.wav",import.meta.url).href,Il=""+new URL("stone5-CVLj567P.wav",import.meta.url).href,Ol=""+new URL("stone6-CswOa5tA.wav",import.meta.url).href,Dl=""+new URL("wood1-DSWFSF8G.wav",import.meta.url).href,Vl=""+new URL("wood2-CSGQI2IY.wav",import.meta.url).href,zl=""+new URL("wood3-DCP5Ew66.wav",import.meta.url).href,Fl=""+new URL("wood4-C--JcgAp.wav",import.meta.url).href,Hl=""+new URL("wood5-cP_3p3YS.wav",import.meta.url).href,Wl=""+new URL("wood6-IdFIwSmi.wav",import.meta.url).href,jl=""+new URL("fallbig-BE8dw5XJ.wav",import.meta.url).href,ql=""+new URL("fallsmall-BZcAgTny.wav",import.meta.url).href,Yl=""+new URL("grass1-CCHdxn4D.wav",import.meta.url).href,Xl=""+new URL("grass2-Ctd8JhUF.wav",import.meta.url).href,$l=""+new URL("grass3-x_45b-_D.wav",import.meta.url).href,Zl=""+new URL("grass4-spl5Ndua.wav",import.meta.url).href,Kl=""+new URL("sand1-T_E592kx.wav",import.meta.url).href,Jl=""+new URL("sand2-BNuSYbkF.wav",import.meta.url).href,Ql=""+new URL("sand3-DaqPUVKQ.wav",import.meta.url).href,ec=""+new URL("sand4-TT7LnGwY.wav",import.meta.url).href,tc=""+new URL("stone1-DAnELQ24.wav",import.meta.url).href,nc=""+new URL("stone2-cLpgUmtS.wav",import.meta.url).href,rc=""+new URL("stone3-3yjcMYde.wav",import.meta.url).href,oc=""+new URL("stone4-DaH288J_.wav",import.meta.url).href,ic=""+new URL("wood1-D5mqXTyf.wav",import.meta.url).href,ac=""+new URL("wood2-mBu4sysu.wav",import.meta.url).href,sc=""+new URL("wood3-wSoj1HMx.wav",import.meta.url).href,lc=""+new URL("wood4-DKmn8tfu.wav",import.meta.url).href,cc=Object.assign({"../../assets/sounds/player/step/cloth1.wav":ll,"../../assets/sounds/player/step/cloth2.wav":cl,"../../assets/sounds/player/step/cloth3.wav":ul,"../../assets/sounds/player/step/cloth4.wav":dl,"../../assets/sounds/player/step/coral1.wav":fl,"../../assets/sounds/player/step/coral2.wav":pl,"../../assets/sounds/player/step/coral3.wav":hl,"../../assets/sounds/player/step/coral4.wav":_l,"../../assets/sounds/player/step/coral5.wav":ml,"../../assets/sounds/player/step/coral6.wav":gl,"../../assets/sounds/player/step/grass1.wav":vl,"../../assets/sounds/player/step/grass2.wav":bl,"../../assets/sounds/player/step/grass3.wav":yl,"../../assets/sounds/player/step/grass4.wav":wl,"../../assets/sounds/player/step/grass5.wav":xl,"../../assets/sounds/player/step/grass6.wav":Bl,"../../assets/sounds/player/step/gravel1.wav":Sl,"../../assets/sounds/player/step/gravel2.wav":Pl,"../../assets/sounds/player/step/gravel3.wav":Gl,"../../assets/sounds/player/step/gravel4.wav":Tl,"../../assets/sounds/player/step/sand1.wav":Ml,"../../assets/sounds/player/step/sand2.wav":Al,"../../assets/sounds/player/step/sand3.wav":El,"../../assets/sounds/player/step/sand4.wav":Ul,"../../assets/sounds/player/step/sand5.wav":Cl,"../../assets/sounds/player/step/stone1.wav":kl,"../../assets/sounds/player/step/stone2.wav":Ll,"../../assets/sounds/player/step/stone3.wav":Rl,"../../assets/sounds/player/step/stone4.wav":Nl,"../../assets/sounds/player/step/stone5.wav":Il,"../../assets/sounds/player/step/stone6.wav":Ol,"../../assets/sounds/player/step/wood1.wav":Dl,"../../assets/sounds/player/step/wood2.wav":Vl,"../../assets/sounds/player/step/wood3.wav":zl,"../../assets/sounds/player/step/wood4.wav":Fl,"../../assets/sounds/player/step/wood5.wav":Hl,"../../assets/sounds/player/step/wood6.wav":Wl}),uc=Object.assign({"../../assets/sounds/player/fall/fallbig.wav":jl,"../../assets/sounds/player/fall/fallsmall.wav":ql}),dc=Object.assign({"../../assets/sounds/player/dig/grass1.wav":Yl,"../../assets/sounds/player/dig/grass2.wav":Xl,"../../assets/sounds/player/dig/grass3.wav":$l,"../../assets/sounds/player/dig/grass4.wav":Zl,"../../assets/sounds/player/dig/sand1.wav":Kl,"../../assets/sounds/player/dig/sand2.wav":Jl,"../../assets/sounds/player/dig/sand3.wav":Ql,"../../assets/sounds/player/dig/sand4.wav":ec,"../../assets/sounds/player/dig/stone1.wav":tc,"../../assets/sounds/player/dig/stone2.wav":nc,"../../assets/sounds/player/dig/stone3.wav":rc,"../../assets/sounds/player/dig/stone4.wav":oc,"../../assets/sounds/player/dig/wood1.wav":ic,"../../assets/sounds/player/dig/wood2.wav":ac,"../../assets/sounds/player/dig/wood3.wav":sc,"../../assets/sounds/player/dig/wood4.wav":lc});function Oo(u){const n=u.match(/step\/(\w+?)(\d+)\.wav$/);return n?{surface:n[1],variant:parseInt(n[2],10)}:null}function fc(u){const n=u.match(/fall\/(\w+)\.wav$/);return n?n[1]:null}class pc{constructor(){s(this,"_ctx",null);s(this,"_stepBuffers",new Map);s(this,"_fallBuffers",new Map);s(this,"_digBuffers",new Map);s(this,"_oneShots",[]);s(this,"_musicGain",null);s(this,"_musicSource",null);s(this,"_musicBuffer",null);s(this,"masterVolume",.5);s(this,"sfxVolume",.7);s(this,"musicVolume",.4)}async init(){this._ctx||(this._ctx=new AudioContext),this._ctx.state==="suspended"&&await this._ctx.resume(),await Promise.all([this._loadStepSounds(),this._loadFallSounds(),this._loadDigSounds()])}get context(){return this._ctx||(this._ctx=new AudioContext),this._ctx}async _loadStepSounds(){const n=new Map;for(const[e,t]of Object.entries(cc)){const r=Oo(e);if(!r)continue;const o=await this._fetchDecode(t);if(!o)continue;let i=n.get(r.surface);i||(i=[],n.set(r.surface,i)),i.push(o)}for(const[,e]of n)e.sort(()=>Math.random()-.5);this._stepBuffers=n}async _loadFallSounds(){for(const[n,e]of Object.entries(uc)){const t=fc(n);if(!t)continue;const r=await this._fetchDecode(e);r&&this._fallBuffers.set(t,r)}}async _loadDigSounds(){const n=new Map;for(const[e,t]of Object.entries(dc)){const r=Oo(e);if(!r)continue;const o=await this._fetchDecode(t);if(!o)continue;let i=n.get(r.surface);i||(i=[],n.set(r.surface,i)),i.push(o)}for(const[,e]of n)e.sort(()=>Math.random()-.5);this._digBuffers=n}async _fetchDecode(n){try{const t=await(await fetch(n)).arrayBuffer();return await this.context.decodeAudioData(t)}catch(e){return console.warn("[audio] failed to load",n,e),null}}get ready(){return this._ctx!==null&&this._ctx.state!=="suspended"}updateListener(n,e,t){const r=this._ctx;if(!r||r.state!=="running")return;const o=r.listener;o.positionX.value=n.x,o.positionY.value=n.y,o.positionZ.value=n.z,o.forwardX.value=e.x,o.forwardY.value=e.y,o.forwardZ.value=e.z,o.upX.value=t.x,o.upY.value=t.y,o.upZ.value=t.z;for(let i=this._oneShots.length-1;i>=0;i--)this._oneShots[i].done&&(this._oneShots[i].dispose(),this._oneShots.splice(i,1))}playBufferAt(n,e,t=1,r=1){const o=this._ctx;if(!o||o.state!=="running")return;const i=t*this.sfxVolume*this.masterVolume;if(i<=0)return;const a=new hc(o,n,e,i,r);this._oneShots.push(a)}playStep(n,e,t=1,r=1){const o=this._stepBuffers.get(n);if(!o||o.length===0)return;const i=o[Math.floor(Math.random()*o.length)];this.playBufferAt(i,e,t,r)}playLand(n,e,t){const r=t>15?"fallbig":"fallsmall",o=this._fallBuffers.get(r);o&&this.playBufferAt(o,e,.6+Math.min(t/30,.4))}playDig(n,e){const t=this._digBuffers.get(n);if(!t||t.length===0)return;const r=t[Math.floor(Math.random()*t.length)];this.playBufferAt(r,e,.8)}playUI(n,e=1){const t=this._ctx;if(!t||t.state!=="running")return;const r=e*this.sfxVolume*this.masterVolume;if(r<=0)return;const o=t.createBufferSource();o.buffer=n;const i=t.createGain();i.gain.value=r,o.connect(i).connect(t.destination),o.start(),o.onended=()=>{o.disconnect(),i.disconnect()}}async playMusic(n,e){const t=this._ctx;if(!t)return;this.stopMusic();const r=await this._fetchDecode(n);if(!r)return;this._musicBuffer=r,this._musicGain||(this._musicGain=t.createGain(),this._musicGain.connect(t.destination)),this._musicGain.gain.value=(e??this.musicVolume)*this.masterVolume;const o=t.createBufferSource();o.buffer=r,o.loop=!0,o.connect(this._musicGain),o.start(),this._musicSource=o}setMusicVolume(n){this.musicVolume=n,this._musicGain&&(this._musicGain.gain.value=n*this.masterVolume)}stopMusic(){if(this._musicSource){try{this._musicSource.stop()}catch{}this._musicSource.disconnect(),this._musicSource=null}this._musicBuffer=null}fadeOutMusic(n=2){return new Promise(e=>{if(!this._musicGain||!this._musicSource){e();return}const t=this._musicGain.gain.value;this._musicGain.gain.cancelScheduledValues(this.context.currentTime),this._musicGain.gain.setValueAtTime(t,this.context.currentTime),this._musicGain.gain.linearRampToValueAtTime(0,this.context.currentTime+n),setTimeout(()=>{this.stopMusic(),e()},n*1e3)})}dispose(){this.stopMusic();for(const n of this._oneShots)n.dispose();this._oneShots.length=0,this._stepBuffers.clear(),this._fallBuffers.clear(),this._digBuffers.clear(),this._ctx&&(this._ctx.close().catch(()=>{}),this._ctx=null)}}class hc{constructor(n,e,t,r,o){s(this,"_src");s(this,"_gain");s(this,"_panner");s(this,"_ctx");s(this,"_finished",!1);this._ctx=n,this._gain=n.createGain(),this._gain.gain.value=r,this._panner=n.createPanner(),this._panner.panningModel="HRTF",this._panner.distanceModel="inverse",this._panner.maxDistance=50,this._panner.refDistance=5,this._panner.rolloffFactor=1,this._panner.positionX.value=t.x,this._panner.positionY.value=t.y,this._panner.positionZ.value=t.z,this._src=n.createBufferSource(),this._src.buffer=e,this._src.playbackRate.value=o,this._src.connect(this._gain),this._gain.connect(this._panner),this._panner.connect(n.destination),this._src.start(),this._src.onended=()=>{this._finished=!0}}get done(){return this._finished}dispose(){try{this._src.stop()}catch{}this._src.disconnect(),this._gain.disconnect(),this._panner.disconnect()}}const _c=`// Forward PBR shader with multi-light support
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
`,mc=`// GBuffer fill pass — writes albedo+roughness and normal+metallic.
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
`,gc=`// Skinned GBuffer fill pass — GPU vertex skinning with up to 4 bone influences.
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
`,Do=48,me=class me extends Ni{constructor(e={}){super();s(this,"shaderId","pbr");s(this,"albedo");s(this,"roughness");s(this,"metallic");s(this,"uvOffset");s(this,"uvScale");s(this,"uvTile");s(this,"_albedoMap");s(this,"_normalMap");s(this,"_merMap");s(this,"_uniformBuffer",null);s(this,"_uniformDevice",null);s(this,"_bindGroup",null);s(this,"_bindGroupAlbedo");s(this,"_bindGroupNormal");s(this,"_bindGroupMer");s(this,"_dirty",!0);s(this,"_scratch",new Float32Array(Do/4));this.albedo=e.albedo??[1,1,1,1],this.roughness=e.roughness??.5,this.metallic=e.metallic??0,this.uvOffset=e.uvOffset,this.uvScale=e.uvScale,this.uvTile=e.uvTile,this._albedoMap=e.albedoMap,this._normalMap=e.normalMap,this._merMap=e.merMap,this.transparent=e.transparent??!1}get albedoMap(){return this._albedoMap}set albedoMap(e){e!==this._albedoMap&&(this._albedoMap=e,this._bindGroup=null)}get normalMap(){return this._normalMap}set normalMap(e){e!==this._normalMap&&(this._normalMap=e,this._bindGroup=null)}get merMap(){return this._merMap}set merMap(e){e!==this._merMap&&(this._merMap=e,this._bindGroup=null)}markDirty(){this._dirty=!0}getShaderCode(e){switch(e){case Bt.Forward:return _c;case Bt.Geometry:return mc;case Bt.SkinnedGeometry:return gc}}getBindGroupLayout(e){let t=me._layoutByDevice.get(e);return t||(t=e.createBindGroupLayout({label:"PbrMaterialBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]}),me._layoutByDevice.set(e,t)),t}getBindGroup(e){var a,l,c,d;if(this._bindGroup&&this._bindGroupAlbedo===this._albedoMap&&this._bindGroupNormal===this._normalMap&&this._bindGroupMer===this._merMap)return this._bindGroup;(!this._uniformBuffer||this._uniformDevice!==e)&&((a=this._uniformBuffer)==null||a.destroy(),this._uniformBuffer=e.createBuffer({label:"PbrMaterialUniform",size:Do,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this._uniformDevice=e,this._dirty=!0);const t=me._getSampler(e),r=((l=this._albedoMap)==null?void 0:l.view)??me._getWhite(e),o=((c=this._normalMap)==null?void 0:c.view)??me._getFlatNormal(e),i=((d=this._merMap)==null?void 0:d.view)??me._getMerDefault(e);return this._bindGroup=e.createBindGroup({label:"PbrMaterialBG",layout:this.getBindGroupLayout(e),entries:[{binding:0,resource:{buffer:this._uniformBuffer}},{binding:1,resource:r},{binding:2,resource:o},{binding:3,resource:i},{binding:4,resource:t}]}),this._bindGroupAlbedo=this._albedoMap,this._bindGroupNormal=this._normalMap,this._bindGroupMer=this._merMap,this._bindGroup}update(e){var r,o,i,a,l,c;if(!this._dirty||!this._uniformBuffer)return;const t=this._scratch;t[0]=this.albedo[0],t[1]=this.albedo[1],t[2]=this.albedo[2],t[3]=this.albedo[3],t[4]=this.roughness,t[5]=this.metallic,t[6]=((r=this.uvOffset)==null?void 0:r[0])??0,t[7]=((o=this.uvOffset)==null?void 0:o[1])??0,t[8]=((i=this.uvScale)==null?void 0:i[0])??1,t[9]=((a=this.uvScale)==null?void 0:a[1])??1,t[10]=((l=this.uvTile)==null?void 0:l[0])??1,t[11]=((c=this.uvTile)==null?void 0:c[1])??1,e.writeBuffer(this._uniformBuffer,0,t.buffer),this._dirty=!1}destroy(){var e;(e=this._uniformBuffer)==null||e.destroy(),this._uniformBuffer=null,this._uniformDevice=null,this._bindGroup=null}static _getSampler(e){let t=me._samplerByDevice.get(e);return t||(t=e.createSampler({label:"PbrMaterialSampler",magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"}),me._samplerByDevice.set(e,t)),t}static _make1x1View(e,t,r,o,i,a){const l=e.createTexture({label:t,size:{width:1,height:1},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return e.queue.writeTexture({texture:l},new Uint8Array([r,o,i,a]),{bytesPerRow:4},{width:1,height:1}),l.createView()}static _getWhite(e){let t=me._whiteByDevice.get(e);return t||(t=me._make1x1View(e,"PbrFallbackWhite",255,255,255,255),me._whiteByDevice.set(e,t)),t}static _getFlatNormal(e){let t=me._flatNormalByDevice.get(e);return t||(t=me._make1x1View(e,"PbrFallbackFlatNormal",128,128,255,255),me._flatNormalByDevice.set(e,t)),t}static _getMerDefault(e){let t=me._merDefaultByDevice.get(e);return t||(t=me._make1x1View(e,"PbrFallbackMer",255,0,255,255),me._merDefaultByDevice.set(e,t)),t}};s(me,"_layoutByDevice",new WeakMap),s(me,"_samplerByDevice",new WeakMap),s(me,"_whiteByDevice",new WeakMap),s(me,"_flatNormalByDevice",new WeakMap),s(me,"_merDefaultByDevice",new WeakMap);let Pe=me;const vc=.5;function bc(u,n,e,t,r,o,i){const a=e.getTopBlockY(u,n,200);if(a<=0||e.getBiomeAt(u,a,n)!==Ee.GrassyPlains)return null;const d=e.getBlockType(Math.floor(u),Math.floor(a-1),Math.floor(n))===R.WATER?Math.floor(a-.05):a,p=new ge("Duck");p.position.set(u+.5,d,n+.5);const f=new ge("Duck.Body");f.position.set(0,.15,0),f.addComponent(new Te(r,new Pe({albedo:[.93,.93,.93,1],roughness:.9}))),p.addChild(f);const h=new ge("Duck.Head");h.position.set(0,.32,-.12),h.addComponent(new Te(o,new Pe({albedo:[.08,.32,.1,1],roughness:.9}))),p.addChild(h);const _=new ge("Duck.Bill");return _.position.set(0,.27,-.205),_.addComponent(new Te(i,new Pe({albedo:[1,.55,.05,1],roughness:.8}))),p.addChild(_),p.addComponent(new mt(e)),t.add(p),p}function yc(u,n,e,t,r,o){const i=Math.random()*Math.PI*2,a=.5+Math.random()*1,l=u.position.x+Math.cos(i)*a,c=u.position.z+Math.sin(i)*a,d=n.getTopBlockY(Math.floor(l),Math.floor(c),200);if(d<=0)return;const p=vc,f=new ge("Duckling");f.position.set(l,d,c);const h=new ge("Duckling.Body");h.position.set(0,.15*p,0),h.addComponent(new Te(t,new Pe({albedo:[.95,.87,.25,1],roughness:.9}))),f.addChild(h);const _=new ge("Duckling.Head");_.position.set(0,.32*p,-.12*p),_.addComponent(new Te(r,new Pe({albedo:[.88,.78,.15,1],roughness:.9}))),f.addChild(_);const m=new ge("Duckling.Bill");m.position.set(0,.27*p,-.205*p),m.addComponent(new Te(o,new Pe({albedo:[1,.55,.05,1],roughness:.8}))),f.addChild(m),f.addComponent(new Hi(u,n)),e.add(f)}const Vo=[.96,.7,.72,1],wc=[.98,.76,.78,1];function zo(u,n,e,t,r,o,i,a=1){const l=e.getTopBlockY(u,n,200);if(l<=0||e.getBiomeAt(u,l,n)!==Ee.GrassyPlains)return;const d=a,p=new ge("Pig");p.position.set(u+.5,l,n+.5);const f=new ge("Pig.Body");f.position.set(0,.35*d,0),f.addComponent(new Te(r,new Pe({albedo:Vo,roughness:.85}))),p.addChild(f);const h=new ge("Pig.Head");h.position.set(0,.35*d,-.48*d),h.addComponent(new Te(o,new Pe({albedo:Vo,roughness:.85}))),p.addChild(h);const _=new ge("Pig.Snout");_.position.set(0,.31*d,-.7*d),_.addComponent(new Te(i,new Pe({albedo:wc,roughness:.8}))),p.addChild(_),p.addComponent(new zi(e)),t.add(p)}const Qe=16,xc=.15,Bc=.2,Sc=.25,Pc=5,Gc=.25;function Tc(u,n,e){const t=new Set,r=u.onChunkAdded;u.onChunkAdded=(o,i)=>{if(r==null||r(o,i),o.aliveBlocks===0)return;const a=Math.floor(o.globalPosition.x/Qe),l=Math.floor(o.globalPosition.z/Qe),c=`${a}:${l}`;t.has(c)||(t.add(c),Mc(a,l,u,n,e))}}function Mc(u,n,e,t,r){const o=u*Qe,i=n*Qe;if(Math.random()<xc){const a=1+Math.floor(Math.random()*2);for(let l=0;l<a;l++){const c=Math.floor(o+Math.random()*Qe),d=Math.floor(i+Math.random()*Qe),p=bc(c,d,e,t,r.duckBody,r.duckHead,r.duckBill);if(p&&Math.random()<Sc)for(let f=0;f<Pc;f++)yc(p,e,t,r.ducklingBody,r.ducklingHead,r.ducklingBill)}}if(Math.random()<Bc){const a=1+Math.floor(Math.random()*2);for(let l=0;l<a;l++){const c=Math.floor(o+Math.random()*Qe),d=Math.floor(i+Math.random()*Qe);Math.random()<Gc?zo(c,d,e,t,r.babyPigBody,r.babyPigHead,r.babyPigSnout,.55):zo(c,d,e,t,r.pigBody,r.pigHead,r.pigSnout,1)}}}const rt=128,jt=40;class Ac{constructor(){s(this,"data",new Float32Array(rt*rt));s(this,"resolution",rt);s(this,"extent",jt);s(this,"_camX",NaN);s(this,"_camZ",NaN)}update(n,e,t){if(Math.abs(n-this._camX)<2&&Math.abs(e-this._camZ)<2)return;this._camX=n,this._camZ=e;const r=jt*2/rt,o=n-jt,i=e-jt,a=Math.ceil(e)+80;for(let l=0;l<rt;l++)for(let c=0;c<rt;c++)this.data[l*rt+c]=t.getTopBlockY(Math.floor(o+c*r),Math.floor(i+l*r),a)}}function qt(u,n,e,t,r,o,i,a){const l=[{n:[0,0,-1],t:[-1,0,0,1],v:[[-o,-i,-a],[o,-i,-a],[o,i,-a],[-o,i,-a]]},{n:[0,0,1],t:[1,0,0,1],v:[[o,-i,a],[-o,-i,a],[-o,i,a],[o,i,a]]},{n:[-1,0,0],t:[0,0,-1,1],v:[[-o,-i,a],[-o,-i,-a],[-o,i,-a],[-o,i,a]]},{n:[1,0,0],t:[0,0,1,1],v:[[o,-i,-a],[o,-i,a],[o,i,a],[o,i,-a]]},{n:[0,1,0],t:[1,0,0,1],v:[[-o,i,-a],[o,i,-a],[o,i,a],[-o,i,a]]},{n:[0,-1,0],t:[1,0,0,1],v:[[-o,-i,a],[o,-i,a],[o,-i,-a],[-o,-i,-a]]}],c=[[0,1],[1,1],[1,0],[0,0]];for(const d of l){const p=u.length/12;for(let f=0;f<4;f++){const[h,_,m]=d.v[f];u.push(e+h,t+_,r+m,d.n[0],d.n[1],d.n[2],c[f][0],c[f][1],d.t[0],d.t[1],d.t[2],d.t[3])}n.push(p,p+2,p+1,p,p+3,p+2)}}function Ec(u){const n=Yt(u,(o,i)=>qt(o,i,0,0,0,.25,.375,.125)),e=Yt(u,(o,i)=>qt(o,i,0,0,0,.25,.25,.25)),t=Yt(u,(o,i)=>qt(o,i,0,-.375,0,.125,.375,.125)),r=Yt(u,(o,i)=>qt(o,i,0,-.375,0,.125,.375,.125));return{body:n,head:e,arm:t,leg:r}}function Yt(u,n){const e=[],t=[];return n(e,t),Le.fromData(u,new Float32Array(e),new Uint32Array(t))}const Uc=[.95,.78,.62,1],En=[.3,.55,.85,1],Fo=[.25,.3,.45,1];class Cc{constructor(n,e,t,r){s(this,"playerId");s(this,"name");s(this,"root");s(this,"_scene");s(this,"_head");s(this,"_armL");s(this,"_armR");s(this,"_legL");s(this,"_legR");s(this,"_curX",0);s(this,"_curY",0);s(this,"_curZ",0);s(this,"_curYaw",0);s(this,"_curPitch",0);s(this,"_tgtX",0);s(this,"_tgtY",0);s(this,"_tgtZ",0);s(this,"_tgtYaw",0);s(this,"_tgtPitch",0);s(this,"_hasTarget",!1);s(this,"_walkPhase",0);this.playerId=n,this.name=e,this._scene=t;const o=new ge(`RemotePlayer.${n}`);this.root=o;const i=new ge("RP.Body");i.position.set(0,1.125,0),i.addComponent(new Te(r.body,new Pe({albedo:En,roughness:.85}))),o.addChild(i);const a=new ge("RP.Head");a.position.set(0,1.75,0),a.addComponent(new Te(r.head,new Pe({albedo:Uc,roughness:.8}))),o.addChild(a),this._head=a;const l=new ge("RP.ArmL");l.position.set(-.375,1.5,0),l.addComponent(new Te(r.arm,new Pe({albedo:En,roughness:.85}))),o.addChild(l),this._armL=l;const c=new ge("RP.ArmR");c.position.set(.375,1.5,0),c.addComponent(new Te(r.arm,new Pe({albedo:En,roughness:.85}))),o.addChild(c),this._armR=c;const d=new ge("RP.LegL");d.position.set(-.125,.75,0),d.addComponent(new Te(r.leg,new Pe({albedo:Fo,roughness:.85}))),o.addChild(d),this._legL=d;const p=new ge("RP.LegR");p.position.set(.125,.75,0),p.addComponent(new Te(r.leg,new Pe({albedo:Fo,roughness:.85}))),o.addChild(p),this._legR=p,t.add(o)}setTargetTransform(n,e,t,r,o){this._hasTarget||(this._curX=n,this._curY=e,this._curZ=t,this._curYaw=r,this._curPitch=o),this._tgtX=n,this._tgtY=e,this._tgtZ=t,this._tgtYaw=r,this._tgtPitch=o,this._hasTarget=!0}update(n){if(!this._hasTarget)return;const e=1-Math.exp(-12*n),t=this._tgtX-this._curX,r=this._tgtY-this._curY,o=this._tgtZ-this._curZ;this._curX+=t*e,this._curY+=r*e,this._curZ+=o*e,this._curYaw=Lc(this._curYaw,this._tgtYaw,e),this._curPitch+=(this._tgtPitch-this._curPitch)*e,this.root.position.set(this._curX,this._curY-1.625,this._curZ),this.root.rotation=_e.fromAxisAngle(kc,this._curYaw),this._head.rotation=_e.fromAxisAngle(wt,this._curPitch);const a=Math.hypot(t,o)/Math.max(n,.001),l=a>.3,c=l?Math.min(a*1.2,8):4;this._walkPhase+=n*c;const d=l?Math.sin(this._walkPhase)*.55:0;this._armL.rotation=_e.fromAxisAngle(wt,d),this._armR.rotation=_e.fromAxisAngle(wt,-d),this._legL.rotation=_e.fromAxisAngle(wt,-d),this._legR.rotation=_e.fromAxisAngle(wt,d)}headWorldPosition(n){return n.x=this.root.position.x,n.y=this.root.position.y+2.1,n.z=this.root.position.z,n}dispose(){this._scene.remove(this.root)}}const kc=new j(0,1,0),wt=new j(1,0,0);function Lc(u,n,e){let t=n-u;for(;t>Math.PI;)t-=2*Math.PI;for(;t<-Math.PI;)t+=2*Math.PI;return u+t*e}const Ho=64;class Rc{constructor(n){s(this,"_root");s(this,"_labels",new Map);const e=document.createElement("div");e.style.position="absolute",e.style.left="0",e.style.top="0",e.style.width="100%",e.style.height="100%",e.style.pointerEvents="none",e.style.overflow="hidden",n.appendChild(e),this._root=e}add(n,e){if(this._labels.has(n))return;const t=document.createElement("div");t.textContent=e,t.style.position="absolute",t.style.transform="translate(-50%, -100%)",t.style.padding="2px 6px",t.style.font="12px sans-serif",t.style.color="#fff",t.style.background="rgba(0,0,0,0.55)",t.style.border="1px solid rgba(255,255,255,0.2)",t.style.borderRadius="4px",t.style.whiteSpace="nowrap",t.style.userSelect="none",t.style.display="none",this._root.appendChild(t),this._labels.set(n,t)}remove(n){const e=this._labels.get(n);e!==void 0&&(e.remove(),this._labels.delete(n))}update(n,e,t,r,o){for(const[i,a]of this._labels){const l=o.get(i);if(l===void 0){a.style.display="none";continue}const c=l.x-e.x,d=l.y-e.y,p=l.z-e.z;if(c*c+d*d+p*p>Ho*Ho){a.style.display="none";continue}const h=n.transformVec4(new Ve(l.x,l.y,l.z,1));if(h.w<=.001){a.style.display="none";continue}const _=h.x/h.w,m=h.y/h.w;if(_<-1||_>1||m<-1||m>1){a.style.display="none";continue}const b=(_*.5+.5)*t,y=(1-(m*.5+.5))*r;a.style.display="block",a.style.left=`${b}px`,a.style.top=`${y}px`}}}const Kt=1,Nc="crafty",Ic=1,Xt="worlds";class ur{constructor(n){s(this,"_db");this._db=n}static open(){return new Promise((n,e)=>{const t=indexedDB.open(Nc,Ic);t.onupgradeneeded=()=>{const r=t.result;r.objectStoreNames.contains(Xt)||r.createObjectStore(Xt,{keyPath:"id"})},t.onsuccess=()=>n(new ur(t.result)),t.onerror=()=>e(t.error??new Error("IndexedDB open failed"))})}list(){return this._withStore("readonly",n=>new Promise((e,t)=>{const r=n.getAll();r.onsuccess=()=>{const o=r.result??[];o.sort((i,a)=>a.lastPlayedAt-i.lastPlayedAt),e(o)},r.onerror=()=>t(r.error??new Error("IndexedDB list failed"))}))}load(n){return this._withStore("readonly",e=>new Promise((t,r)=>{const o=e.get(n);o.onsuccess=()=>t(o.result??null),o.onerror=()=>r(o.error??new Error("IndexedDB load failed"))}))}save(n){return this._withStore("readwrite",e=>new Promise((t,r)=>{const o=e.put(n);o.onsuccess=()=>t(),o.onerror=()=>r(o.error??new Error("IndexedDB save failed"))}))}delete(n){return this._withStore("readwrite",e=>new Promise((t,r)=>{const o=e.delete(n);o.onsuccess=()=>t(),o.onerror=()=>r(o.error??new Error("IndexedDB delete failed"))}))}_withStore(n,e){const r=this._db.transaction(Xt,n).objectStore(Xt);return e(r)}}function Wo(u,n){const e=Date.now();return{id:Oc(),name:u,seed:n,createdAt:e,lastPlayedAt:e,edits:[],player:{x:64,y:80,z:64,yaw:0,pitch:0},sunAngle:Math.PI*.3,version:Kt}}function Oc(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`}const Dc=2,Vc=20,zc=1e3/Vc;class Fc{constructor(){s(this,"_ws",null);s(this,"_callbacks",{});s(this,"_lastTransformSend",0);s(this,"_pendingTransform",null);s(this,"_connected",!1);s(this,"_inGame",!1);s(this,"_pendingHello",null);s(this,"_pendingCreate",null);s(this,"_pendingJoin",null)}get connected(){return this._connected}setCallbacks(n){this._callbacks=n}connect(n,e,t){return new Promise((r,o)=>{const i=new WebSocket(n);this._ws=i,this._pendingHello={resolve:r,reject:o},i.addEventListener("open",()=>{this._send({t:"hello",playerKey:e,name:t,version:Dc})}),i.addEventListener("message",a=>{let l;try{l=JSON.parse(typeof a.data=="string"?a.data:"")}catch{return}this._dispatch(l)}),i.addEventListener("error",()=>{this._failAllPending(new Error("WebSocket error"))}),i.addEventListener("close",()=>{this._connected=!1,this._inGame=!1,this._failAllPending(new Error("WebSocket closed"))})})}createWorld(n,e){return!this._connected||this._inGame?Promise.reject(new Error("createWorld requires lobby phase")):new Promise((t,r)=>{this._pendingCreate={resolve:t,reject:r},this._send({t:"create_world",name:n,seed:e})})}joinWorld(n){return!this._connected||this._inGame?Promise.reject(new Error("joinWorld requires lobby phase")):new Promise((e,t)=>{this._pendingJoin={resolve:e,reject:t},this._send({t:"join_world",worldId:n})})}sendTransform(n,e,t,r,o){if(!this._inGame)return;this._pendingTransform={x:n,y:e,z:t,yaw:r,pitch:o};const i=performance.now();if(i-this._lastTransformSend<zc)return;this._lastTransformSend=i;const a=this._pendingTransform;this._pendingTransform=null,this._send({t:"transform",x:a.x,y:a.y,z:a.z,yaw:a.yaw,pitch:a.pitch})}sendBlockPlace(n,e,t,r,o,i,a){this._inGame&&this._send({t:"block_place",x:n,y:e,z:t,fx:r,fy:o,fz:i,blockType:a})}sendBlockBreak(n,e,t){this._inGame&&this._send({t:"block_break",x:n,y:e,z:t})}_dispatch(n){var e,t,r,o,i,a,l,c,d,p;switch(n.t){case"world_list":if(this._pendingHello!==null){this._connected=!0,this._pendingHello.resolve(n.worlds),this._pendingHello=null;return}(t=(e=this._callbacks).onWorldList)==null||t.call(e,n.worlds);return;case"world_created":this._pendingCreate!==null&&(this._pendingCreate.resolve(n.world),this._pendingCreate=null);return;case"welcome":this._pendingJoin!==null&&(this._inGame=!0,this._pendingJoin.resolve({playerId:n.playerId,worldId:n.worldId,seed:n.seed,sunAngle:n.sunAngle,lastPosition:n.lastPosition,edits:n.edits,players:n.players}),this._pendingJoin=null);return;case"error":{const f=new Error(`${n.code}: ${n.message}`);if(this._pendingCreate!==null){this._pendingCreate.reject(f),this._pendingCreate=null;return}if(this._pendingJoin!==null){this._pendingJoin.reject(f),this._pendingJoin=null;return}if(this._pendingHello!==null){this._pendingHello.reject(f),this._pendingHello=null;return}console.warn("[crafty] server error:",f.message);return}case"player_join":(o=(r=this._callbacks).onPlayerJoin)==null||o.call(r,n.playerId,n.name);return;case"player_leave":(a=(i=this._callbacks).onPlayerLeave)==null||a.call(i,n.playerId);return;case"player_transform":(c=(l=this._callbacks).onPlayerTransform)==null||c.call(l,n.playerId,n.x,n.y,n.z,n.yaw,n.pitch);return;case"block_edit":(p=(d=this._callbacks).onBlockEdit)==null||p.call(d,n.edit);return}}_failAllPending(n){this._pendingHello!==null&&(this._pendingHello.reject(n),this._pendingHello=null),this._pendingCreate!==null&&(this._pendingCreate.reject(n),this._pendingCreate=null),this._pendingJoin!==null&&(this._pendingJoin.reject(n),this._pendingJoin=null)}_send(n){this._ws===null||this._ws.readyState!==WebSocket.OPEN||this._ws.send(JSON.stringify(n))}}const Hc=""+new URL("crafty-CP0F5VYA.png",import.meta.url).href,jo="crafty.playerName",$t="crafty.lastSeed",qo="crafty.serverUrl",Yo="crafty.playerKey",Un="ws://localhost:8787";function Wc(){let u=localStorage.getItem(Yo);return(u===null||u.length===0)&&(u=typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`,localStorage.setItem(Yo,u)),u}async function jc(){let u=null,n=[];try{u=await ur.open(),n=await u.list()}catch(e){console.warn("[crafty] world storage unavailable — local worlds will not persist",e)}return new Promise(e=>{const t=document.createElement("div");t.style.cssText=["position:fixed","inset:0","z-index:200",`background:linear-gradient(rgba(128,128,128,0.05),rgba(128,128,128,0.35)),url(${Hc}) center/cover no-repeat #000`,"display:flex","align-items:center","justify-content:center","font-family:ui-monospace,monospace"].join(";"),document.body.appendChild(t);const r=document.createElement("div");r.style.cssText=["display:flex","flex-direction:column","align-items:stretch","gap:clamp(10px,2vh,18px)","padding:clamp(16px,4vh,36px) clamp(12px,4vw,44px)","background:rgba(82, 82, 82, 1.0)","border:1px solid rgba(255,255,255,0.12)","border-radius:12px","width:min(520px,calc(100vw - 24px))","box-sizing:border-box","max-height:min(600px,calc(100vh - 24px))","overflow-y:auto","box-shadow:0 0 55px rgba(255,255,255,0.8)"].join(";"),t.appendChild(r);const o=document.createElement("h1");o.textContent="CRAFTY",o.style.cssText=["margin:0 0 4px","text-align:center","font-size:clamp(28px,7vw,44px)","font-weight:900","color:#fff","letter-spacing:0.14em","text-shadow:0 0 32px rgba(100,200,255,0.4)"].join(";"),r.appendChild(o);const i=pt("Player name",ft({value:localStorage.getItem(jo)??"",placeholder:"Steve",maxLength:16}));r.appendChild(i.row);const a=document.createElement("div");a.style.cssText="display:flex;gap:0;border-bottom:1px solid rgba(255,255,255,0.12)",r.appendChild(a);const l=Xo("Local"),c=Xo("Network");a.appendChild(l),a.appendChild(c);const d=Zo(),p=Zo();r.appendChild(d),r.appendChild(p),d.appendChild(xt("Saved worlds"));const f=document.createElement("div");f.style.cssText=["display:flex","flex-direction:column","gap:6px","max-height:clamp(120px,30vh,240px)","overflow-y:auto","padding:8px 4px 12px"].join(";"),d.appendChild(f);let h=n;function _(){if(f.replaceChildren(),h.length===0){const D=document.createElement("div");D.textContent=u===null?"Storage unavailable in this browser":"No saved worlds yet",D.style.cssText="color:rgba(255,255,255,0.85);font-size:12px;padding:8px 0",f.appendChild(D);return}for(const D of h)f.appendChild(qc(D,()=>m(D),()=>b(D)))}_();function m(D){Q({mode:"local",world:D,storage:u,playerName:oe()})}async function b(D){if(u!==null)try{await u.delete(D.id),h=h.filter(F=>F.id!==D.id),_()}catch(F){console.error("[crafty] delete failed",F)}}d.appendChild(xt("New world"));const y=ft({value:"",placeholder:`World ${n.length+1}`,maxLength:32});d.appendChild(pt("Name",y).row);const v=ft({value:localStorage.getItem($t)??"13",placeholder:"random"});d.appendChild(pt("Seed",v).row);const w=Cn("Create"),B=document.createElement("div");B.style.cssText="color:#f88;font-size:12px;min-height:16px;text-align:right",d.appendChild(kn(w,B));const x=Wc();let C=null,L="",U=[];const I=document.createElement("div");I.style.cssText="display:flex;flex-direction:column;gap:10px",p.appendChild(I);const E=document.createElement("div");E.style.cssText="display:none;flex-direction:column;gap:10px",p.appendChild(E),I.appendChild(xt("Server"));const g=ft({value:localStorage.getItem(qo)??Un,placeholder:Un});I.appendChild(pt("URL",g).row);const k=Cn("Connect"),P=document.createElement("div");P.style.cssText="color:#f88;font-size:12px;min-height:16px;text-align:right",I.appendChild(kn(k,P)),E.appendChild(xt("Server worlds"));const M=document.createElement("div");M.style.cssText="color:rgba(255,255,255,0.6);font-size:11px;padding:0 0 4px;display:flex;align-items:center;justify-content:space-between;gap:8px";const S=document.createElement("span");M.appendChild(S);const N=document.createElement("button");N.textContent="Disconnect",N.style.cssText=["background:transparent","color:rgba(255,255,255,0.6)","border:1px solid rgba(255,255,255,0.25)","border-radius:4px","padding:2px 8px","font:11px ui-monospace,monospace","cursor:pointer"].join(";"),M.appendChild(N),E.appendChild(M);const G=document.createElement("div");G.style.cssText=["display:flex","flex-direction:column","gap:6px","max-height:200px","overflow-y:auto","padding:4px"].join(";"),E.appendChild(G),E.appendChild(xt("New world"));const H=ft({value:"",placeholder:"World name",maxLength:32});E.appendChild(pt("Name",H).row);const O=ft({value:localStorage.getItem($t)??"13",placeholder:"random"});E.appendChild(pt("Seed",O).row);const T=Cn("Create"),z=document.createElement("div");z.style.cssText="color:#f88;font-size:12px;min-height:16px;text-align:right",E.appendChild(kn(T,z));function ie(){if(G.replaceChildren(),U.length===0){const D=document.createElement("div");D.textContent="No worlds on this server yet",D.style.cssText="color:rgba(255,255,255,0.85);font-size:12px;padding:8px 0",G.appendChild(D);return}for(const D of U)G.appendChild(Yc(D,()=>le(D)))}async function le(D){if(C!==null){z.style.color="rgba(255,255,255,0.92)",z.textContent=`joining "${D.name}"…`;try{const F=await C.joinWorld(D.id);Q({mode:"network",playerName:oe(),serverUrl:L,network:C,welcome:F,world:D})}catch(F){z.style.color="#f88",z.textContent=`join failed: ${F.message}`}}}T.addEventListener("click",async()=>{if(C===null)return;const D=Z(O.value);O.value=String(D),localStorage.setItem($t,String(D));const F=H.value.trim(),J=F.length>0?F:`World ${U.length+1}`;T.disabled=!0,z.style.color="rgba(255,255,255,0.92)",z.textContent="creating…";try{const X=await C.createWorld(J,D),fe=await C.joinWorld(X.id);Q({mode:"network",playerName:oe(),serverUrl:L,network:C,welcome:fe,world:X})}catch(X){z.style.color="#f88",z.textContent=`failed: ${X.message}`,T.disabled=!1}}),N.addEventListener("click",()=>{C=null,U=[],L="",E.style.display="none",I.style.display="flex",k.disabled=!1,P.textContent="",i.input.disabled=!1});function re(D){const F=D==="local";$o(l,F),$o(c,!F),d.style.display=F?"flex":"none",p.style.display=F?"none":"flex"}l.addEventListener("click",()=>re("local")),c.addEventListener("click",()=>re("network")),re("local");function oe(){const D=(i.input.value??"").trim().slice(0,16);return D.length>0?D:`player${Math.floor(Math.random()*1e3)}`}function Z(D){const F=D.trim();if(F.length===0)return Math.floor(Math.random()*2147483647);const J=Number(F);if(Number.isFinite(J))return Math.floor(J);let X=2166136261;for(let fe=0;fe<F.length;fe++)X=Math.imul(X^F.charCodeAt(fe),16777619)>>>0;return X&2147483647}function Q(D){localStorage.setItem(jo,oe()),t.remove(),e(D)}w.addEventListener("click",async()=>{const D=Z(v.value);v.value=String(D),localStorage.setItem($t,String(D));const F=y.value.trim(),J=F.length>0?F:`World ${h.length+1}`;if(u===null){Q({mode:"local",world:Wo(J,D),storage:null,playerName:oe()});return}w.disabled=!0,B.style.color="rgba(255,255,255,0.92)",B.textContent="creating…";try{const X=Wo(J,D);await u.save(X),Q({mode:"local",world:X,storage:u,playerName:oe()})}catch(X){B.style.color="#f88",B.textContent=`failed: ${X.message}`,w.disabled=!1}}),k.addEventListener("click",async()=>{const D=g.value.trim()||Un,F=oe();P.style.color="rgba(255,255,255,0.92)",P.textContent="connecting…",k.disabled=!0;const J=new Fc;try{const X=await J.connect(D,x,F);localStorage.setItem(qo,D),C=J,L=D,U=X,i.input.disabled=!0,J.setCallbacks({onWorldList:fe=>{U=fe,ie()}}),S.textContent=D,I.style.display="none",E.style.display="flex",P.textContent="",ie()}catch(X){P.style.color="#f88",P.textContent=`failed: ${X.message}`,k.disabled=!1}})})}function ft(u){const n=document.createElement("input");return n.type="text",u.value!==void 0&&(n.value=u.value),u.placeholder!==void 0&&(n.placeholder=u.placeholder),u.maxLength!==void 0&&(n.maxLength=u.maxLength),n.style.cssText=["flex:1","padding:8px 10px","background:rgba(0,0,0,0.55)","color:#fff","border:1px solid rgba(255,255,255,0.35)","border-radius:5px","font:13px ui-monospace,monospace","outline:none"].join(";"),n.addEventListener("focus",()=>{n.style.borderColor="#5f5"}),n.addEventListener("blur",()=>{n.style.borderColor="rgba(255,255,255,0.35)"}),n}function pt(u,n){const e=document.createElement("div");e.style.cssText="display:flex;align-items:center;gap:12px";const t=document.createElement("label");return t.textContent=u,t.style.cssText="min-width:96px;color:rgba(255,255,255,0.92);font-size:12px;letter-spacing:0.06em",e.appendChild(t),e.appendChild(n),{row:e,input:n}}function Xo(u){const n=document.createElement("button");return n.textContent=u,n.style.cssText=["padding:10px 20px","background:transparent","color:rgba(255,255,255,0.8)","border:none","border-bottom:2px solid transparent","font:13px ui-monospace,monospace","letter-spacing:0.08em","cursor:pointer"].join(";"),n}function $o(u,n){u.style.color=n?"#9fff9f":"rgba(255,255,255,0.8)",u.style.borderBottomColor=n?"#9fff9f":"transparent"}function Zo(){const u=document.createElement("div");return u.style.cssText="display:flex;flex-direction:column;gap:10px;padding:12px 0",u}function xt(u){const n=document.createElement("div");return n.textContent=u,n.style.cssText="color:#fff;font-size:11px;letter-spacing:0.18em",n}function Cn(u){const n=document.createElement("button");return n.textContent=u,n.style.cssText=["padding:10px 32px","background:#1a3a1a","color:#5f5","border:1px solid #5f5","border-radius:6px","font:13px ui-monospace,monospace","letter-spacing:0.06em","cursor:pointer","transition:background 0.15s"].join(";"),n.addEventListener("mouseenter",()=>{n.disabled||(n.style.background="#243e24")}),n.addEventListener("mouseleave",()=>{n.style.background="#1a3a1a"}),n}function kn(...u){const n=document.createElement("div");n.style.cssText="display:flex;align-items:center;gap:12px;justify-content:flex-end;padding-top:8px";for(const e of u)n.appendChild(e);return n}function qc(u,n,e){const t=document.createElement("div");t.style.cssText=["display:flex","align-items:center","gap:10px","padding:6px 8px","border-radius:6px","background:rgba(0,0,0,0.35)","border:1px solid rgba(255,255,255,0.08)","cursor:pointer","transition:background 0.12s"].join(";"),t.addEventListener("mouseenter",()=>{t.style.background="rgba(255,255,255,0.08)"}),t.addEventListener("mouseleave",()=>{t.style.background="rgba(0,0,0,0.35)"}),t.addEventListener("click",d=>{d.target.dataset.role!=="delete"&&n()});const r=document.createElement("div");if(r.style.cssText=["width:64px","height:36px","flex-shrink:0","border-radius:4px","overflow:hidden","background:linear-gradient(135deg,#1f3a4a,#0a1622)"].join(";"),u.screenshot!==void 0){const d=document.createElement("img");d.src=URL.createObjectURL(u.screenshot),d.style.cssText="width:100%;height:100%;object-fit:cover;display:block",d.addEventListener("load",()=>URL.revokeObjectURL(d.src)),r.appendChild(d)}t.appendChild(r);const o=document.createElement("div");o.style.cssText="flex:1;display:flex;flex-direction:column;gap:2px;min-width:0";const i=document.createElement("div");i.textContent=u.name,i.style.cssText="color:#fff;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis";const a=document.createElement("div");a.textContent=pi(Date.now()-u.lastPlayedAt),a.style.cssText="color:rgba(255,255,255,0.55);font-size:11px",o.appendChild(i),o.appendChild(a),t.appendChild(o);const l=document.createElement("button");l.dataset.role="delete",l.textContent="×",l.title="Delete",l.style.cssText=["background:transparent","color:rgba(255,255,255,0.45)","border:1px solid rgba(255,255,255,0.18)","border-radius:4px","padding:2px 8px","font:13px ui-monospace,monospace","cursor:pointer"].join(";");let c=!1;return l.addEventListener("click",d=>{if(d.stopPropagation(),!c){c=!0,l.textContent="Delete?",l.style.color="#f88",l.style.borderColor="#f88";const p=()=>{c=!1,l.textContent="×",l.style.color="rgba(255,255,255,0.45)",l.style.borderColor="rgba(255,255,255,0.18)",document.removeEventListener("click",p,!0)};setTimeout(()=>document.addEventListener("click",p,!0),0);return}e()}),t.appendChild(l),t}function Yc(u,n){const e=document.createElement("div");e.style.cssText=["display:flex","align-items:center","gap:10px","padding:8px 10px","border-radius:6px","background:rgba(0,0,0,0.35)","border:1px solid rgba(255,255,255,0.08)","cursor:pointer","transition:background 0.12s"].join(";"),e.addEventListener("mouseenter",()=>{e.style.background="rgba(255,255,255,0.08)"}),e.addEventListener("mouseleave",()=>{e.style.background="rgba(0,0,0,0.35)"}),e.addEventListener("click",n);const t=document.createElement("div");t.style.cssText="flex:1;display:flex;flex-direction:column;gap:2px;min-width:0";const r=document.createElement("div");r.textContent=u.name,r.style.cssText="color:#fff;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis";const o=document.createElement("div"),i=u.playerCount===1?"1 player":`${u.playerCount} players`;return o.textContent=`${i}  ·  ${u.editCount} edit${u.editCount===1?"":"s"}  ·  ${pi(Date.now()-u.lastModifiedAt)}`,o.style.cssText="color:rgba(255,255,255,0.55);font-size:11px",t.appendChild(r),t.appendChild(o),e.appendChild(t),e}function pi(u){if(u<0)return"just now";const n=Math.floor(u/1e3);if(n<60)return"just now";const e=Math.floor(n/60);if(e<60)return`${e} minute${e===1?"":"s"} ago`;const t=Math.floor(e/60);if(t<24)return`${t} hour${t===1?"":"s"} ago`;const r=Math.floor(t/24);if(r<30)return`${r} day${r===1?"":"s"} ago`;const o=Math.floor(r/30);return`${o} month${o===1?"":"s"} ago`}const Xc={ssao:!0,ssgi:!1,shadows:!0,dof:!0,bloom:!0,godrays:!0,fog:!1,aces:!0,ao_dbg:!1,shd_dbg:!1,chunk_dbg:!1,hdr:!0,auto_exp:!1,rain:!0,clouds:!0},$c="modulepreload",Zc=function(u,n){return new URL(u,n).href},Ko={},Kc=function(n,e,t){let r=Promise.resolve();if(e&&e.length>0){const i=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),l=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));r=Promise.allSettled(e.map(c=>{if(c=Zc(c,t),c in Ko)return;Ko[c]=!0;const d=c.endsWith(".css"),p=d?'[rel="stylesheet"]':"";if(!!t)for(let _=i.length-1;_>=0;_--){const m=i[_];if(m.href===c&&(!d||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${c}"]${p}`))return;const h=document.createElement("link");if(h.rel=d?"stylesheet":$c,d||(h.as="script"),h.crossOrigin="",h.href=c,l&&h.setAttribute("nonce",l),document.head.appendChild(h),d)return new Promise((_,m)=>{h.addEventListener("load",_),h.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${c}`)))})}))}function o(i){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=i,window.dispatchEvent(a),!a.defaultPrevented)throw i}return r.then(i=>{for(const a of i||[])a.status==="rejected"&&o(a.reason);return n().catch(o)})},Jc={emitter:{maxParticles:8e4,spawnRate:24e3,lifetime:[2,3.5],shape:{kind:"box",halfExtents:[35,.1,35]},initialSpeed:[0,0],initialColor:[.75,.88,1,.55],initialSize:[.005,.009],roughness:.1,metallic:0},modifiers:[{type:"gravity",strength:9},{type:"drag",coefficient:.05},{type:"color_over_lifetime",startColor:[.75,.88,1,.55],endColor:[.75,.88,1,0]},{type:"block_collision"}],renderer:{type:"sprites",blendMode:"alpha",billboard:"velocity",renderTarget:"hdr"}},Qc={emitter:{maxParticles:5e4,spawnRate:1500,lifetime:[30,45],shape:{kind:"box",halfExtents:[35,.1,35]},initialSpeed:[0,0],initialColor:[.92,.96,1,.85],initialSize:[.025,.055],roughness:.1,metallic:0},modifiers:[{type:"gravity",strength:1.5},{type:"drag",coefficient:.8},{type:"curl_noise",scale:1,strength:1,timeScale:1,octaves:1},{type:"block_collision"}],renderer:{type:"sprites",blendMode:"alpha",billboard:"camera",renderTarget:"hdr"}};async function eu(u,n,e,t,r,o,i,a,l,c,d){let p,f,h,_;if(n.worldGeometryPass){const z=Jt.create(u);n.worldGeometryPass.updateGBuffer(z),p=z,f=n.worldGeometryPass,h=n.worldShadowPass,_=n.waterPass}else{p=Jt.create(u),f=er.create(u,p,t),h=ir.create(u,n.shadowPass.shadowMapArrayViews,3,t);const z=u.device.createTexture({label:"WaterDummyHDR",size:{width:u.width,height:u.height},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),ie=u.device.createTexture({label:"WaterDummyDepth",size:{width:u.width,height:u.height},format:"depth32float",usage:GPUTextureUsage.TEXTURE_BINDING}),le=z.createView(),re=ie.createView();_=ot.create(u,z,le,re,r,o,i);const oe=(D,F)=>{d.set(D,F),f.addChunk(D,F),h.addChunk(D,F),_.addChunk(D,F)},Z=(D,F)=>{d.set(D,F),f.updateChunk(D,F),h.updateChunk(D,F),_.updateChunk(D,F)},Q=D=>{d.delete(D),f.removeChunk(D),h.removeChunk(D),_.removeChunk(D)};c.onChunkAdded=oe,c.onChunkUpdated=Z,c.onChunkRemoved=Q;for(const[D,F]of d)_.addChunk(D,F)}const m=Qn.create(u,p),b=nr.create(u,p),y=e.clouds?Xn.create(u,l):null,v=Wn.create(u,p,n.shadowPass,b.aoView,y==null?void 0:y.shadowView,a),w=e.godrays?Kn.create(u,p,n.shadowPass,v.hdrView,v.cameraBuffer,v.lightBuffer,l):null,B=jn.create(u,v.hdrView),x=e.clouds?Yn.create(u,v.hdrView,p.depthView,l):null;u.pushInitErrorScope();const C=or.create(u);await u.popInitErrorScope("PointSpotShadowPass");const L=ar.create(u,p,C,v.hdrView),U=$n.create(u,v,p),I=rr.create(u,p,U.historyView);v.updateSSGI(I.resultView),n.waterPass,_.updateRenderTargets(v.hdrTexture,v.hdrView,p.depthView,r);let E=null;const g=e.dof?(E=tr.create(u,U.resolvedView,p.depthView),E.resultView):U.resolvedView;let k=null;const P=e.bloom?(k=Zn.create(u,g),k.resultView):g,M=qn.create(u,P,p.depthView),S=Ln.create(u,v.hdrTexture);S.enabled=e.auto_exp;const N=Jn.create(u,P,b.aoView,p.depthView,v.cameraBuffer,v.lightBuffer,S.exposureBuffer);N.depthFogEnabled=e.fog;const G=n.currentWeatherEffect??_t.None;let H=null;if(e.rain&&G!==_t.None){const z=G===_t.Snow?Qc:Jc;H=sr.create(u,z,p,v.hdrView)}const{RenderGraph:O}=await Kc(async()=>{const{RenderGraph:z}=await import("./index-CchcZ55I.js");return{RenderGraph:z}},[],import.meta.url),T=new O;return T.addPass(n.shadowPass),y&&T.addPass(y),T.addPass(h),T.addPass(C),T.addPass(m),T.addPass(f),T.addPass(b),T.addPass(I),x?T.addPass(x):T.addPass(B),T.addPass(v),T.addPass(L),T.addPass(_),w&&T.addPass(w),H&&T.addPass(H),T.addPass(U),E&&T.addPass(E),k&&T.addPass(k),T.addPass(M),T.addPass(S),T.addPass(N),{shadowPass:n.shadowPass,gbuffer:p,geometryPass:m,worldGeometryPass:f,worldShadowPass:h,waterPass:_,ssaoPass:b,ssgiPass:I,lightingPass:v,atmospherePass:B,pointSpotShadowPass:C,pointSpotLightPass:L,taaPass:U,dofPass:E,bloomPass:k,rainPass:H,godrayPass:w,cloudPass:x,cloudShadowPass:y,blockHighlightPass:M,autoExposurePass:S,compositePass:N,graph:T,prevViewProj:null,currentWeatherEffect:G}}function Jo(u,n){let e=0,t=1;for(;u>0;)t/=n,e+=t*(u%n),u=Math.floor(u/n);return e}function tu(u,n,e){const t=u.clone();for(let r=0;r<4;r++)t.data[r*4+0]+=n*t.data[r*4+3],t.data[r*4+1]+=e*t.data[r*4+3];return t}async function nu(){const u=document.getElementById("canvas");if(!u)throw new Error("No canvas element");const n=await jc(),e=n.playerName,t=n.mode==="network"?n.network:null,r=n.mode==="network"?n.welcome:null,o=n.mode==="local"?n.world:null,i=n.mode==="local"?n.storage:null;if(r!==null)console.log(`[crafty] connected as player ${r.playerId} "${e}" (${r.players.length} other(s) online, ${r.edits.length} replay edits)`);else if(o!==null){if((o.version??0)<1){let W=0;for(const ee of o.edits)ee.kind==="place"&&(ee.x-=ee.fx??0,ee.y-=ee.fy??0,ee.z-=ee.fz??0,W++);o.version=Kt,console.log(`[crafty] migrated saved world to v${Kt} (${W} place edits rewritten)`)}console.log(`[crafty] starting local world "${o.name}" (seed=${o.seed}, ${o.edits.length} edits to replay)`)}const a=await Vn.create(u,{enableErrorHandling:!1}),{device:l}=a,c=await ks(l,Us(await(await fetch(Ai)).arrayBuffer())),d=await As(l,c.gpuTexture),p=bs(l),f=await lr.load(l,bn,Ei,Ui,Ci),h=await Re.fromUrl(l,ki),_=await Re.fromUrl(l,Li),m=await Re.fromUrl(l,Ri,{resizeWidth:256,resizeHeight:256,usage:7}),b=Hs(bn),y=Xs(),v=Ys(u,y.reticle),w=(r==null?void 0:r.seed)??(o==null?void 0:o.seed)??13,B=new Rn(w);al()&&(B.renderDistanceH=4,B.renderDistanceV=3);const x=new Map,C=new Ii,L=new ge("Sun"),U=L.addComponent(new ti(new j(.3,-1,.5),j.one(),6,3));C.add(L);const I=$s(u,C,B,a.width,a.height,m.gpuTexture,y.reticle,b.element),{cameraGO:E,camera:g,player:k,freeCamera:P}=I;k.onStep=A=>{const W=E.position;M.playStep(A,W,.5)},k.onLand=(A,W)=>{const ee=E.position;ee.y-=1.62,M.playLand(A,ee,W)};const M=new pc,S=j.UP,N=el();tl(u,N,B,()=>b.getSelected(),C);const G=()=>{M.init(),u.removeEventListener("click",G),u.removeEventListener("touchend",G)};u.addEventListener("click",G),u.addEventListener("touchend",G),il(u,{player:k,camera:P,getActive:()=>I.isPlayerMode()?"player":"camera",world:B,scene:C,blockInteraction:N,getSelectedBlock:()=>b.getSelected(),onLookDoubleTap:()=>I.toggleController(),onMenu:()=>v.open()},()=>{k.usePointerLock=!1,P.usePointerLock=!1});const H={...Xc},O=Hn.create(a,3);let T={shadowPass:O,currentWeatherEffect:_t.None};async function z(){T=await eu(a,T,H,f,c,h,_,d,p,B,x),g.aspect=a.width/a.height}await z(),Tc(B,C,{duckBody:Ao(l),duckHead:Eo(l),duckBill:Uo(l),ducklingBody:Ao(l,.5),ducklingHead:Eo(l,.5),ducklingBill:Uo(l,.5),pigBody:Co(l,1),pigHead:ko(l,1),pigSnout:Lo(l,1),babyPigBody:Co(l,.55),babyPigHead:ko(l,.55),babyPigSnout:Lo(l,.55)});const ie=16,le=16,re=16,oe=(A,W,ee)=>`${Math.floor(A/ie)},${Math.floor(W/le)},${Math.floor(ee/re)}`,Z=new Map;function Q(A){return A.kind==="place"?[A.x+(A.fx??0),A.y+(A.fy??0),A.z+(A.fz??0)]:[A.x,A.y,A.z]}function D(A,W){return!(W.kind==="break"&&A.kind==="place")}function F(A){const[W,ee,Me]=Q(A),ye=oe(W,ee,Me);let xe=Z.get(ye);xe===void 0&&(xe=[],Z.set(ye,xe));for(let Ce=xe.length-1;Ce>=0;Ce--){const[st,tt,gt]=Q(xe[Ce]);if(st===W&&tt===ee&&gt===Me){D(A,xe[Ce])&&xe.splice(Ce,1);break}}xe.push(A)}if(r!==null)for(const A of r.edits)F(A);if(o!==null)for(const A of o.edits)F(A);const J=B.onChunkAdded;B.onChunkAdded=(A,W)=>{J==null||J(A,W);const ee=`${Math.floor(A.globalPosition.x/ie)},${Math.floor(A.globalPosition.y/le)},${Math.floor(A.globalPosition.z/re)}`,Me=Z.get(ee);if(Me!==void 0)for(const ye of Me)No(ye.kind==="place"?{kind:"place",x:ye.x,y:ye.y,z:ye.z,fx:ye.fx??0,fy:ye.fy??0,fz:ye.fz??0,blockType:ye.blockType}:{kind:"break",x:ye.x,y:ye.y,z:ye.z},B,C)};const X=new Map,fe=Ec(l),ve=new Rc(u.parentElement??document.body),ce=new Map;function K(A,W){if(X.has(A))return;const ee=new Cc(A,W,C,fe);X.set(A,ee),ve.add(A,W),ce.set(A,new j)}function be(A){const W=X.get(A);W!==void 0&&(W.dispose(),X.delete(A)),ve.remove(A),ce.delete(A)}if(r!==null)for(const A of r.players)K(A.playerId,A.name),X.get(A.playerId).setTargetTransform(A.x,A.y,A.z,A.yaw,A.pitch);t!==null?(t.setCallbacks({onPlayerJoin:(A,W)=>{console.log(`[crafty] +${W} (#${A})`),K(A,W)},onPlayerLeave:A=>{console.log(`[crafty] -#${A}`),be(A)},onPlayerTransform:(A,W,ee,Me,ye,xe)=>{const Ce=X.get(A);Ce!==void 0&&Ce.setTargetTransform(W,ee,Me,ye,xe)},onBlockEdit:A=>{F(A),No(A.kind==="place"?{kind:"place",x:A.x,y:A.y,z:A.z,fx:A.fx??0,fy:A.fy??0,fz:A.fz??0,blockType:A.blockType}:{kind:"break",x:A.x,y:A.y,z:A.z},B,C)}}),N.onLocalEdit=A=>{A.kind==="place"?(F({kind:"place",x:A.x,y:A.y,z:A.z,blockType:A.blockType,fx:A.fx,fy:A.fy,fz:A.fz}),t.sendBlockPlace(A.x,A.y,A.z,A.fx,A.fy,A.fz,A.blockType)):(F({kind:"break",x:A.x,y:A.y,z:A.z,blockType:0}),t.sendBlockBreak(A.x,A.y,A.z))}):o!==null&&(N.onLocalEdit=A=>{const W=A.kind==="place"?{kind:"place",x:A.x,y:A.y,z:A.z,blockType:A.blockType,fx:A.fx,fy:A.fy,fz:A.fz}:{kind:"break",x:A.x,y:A.y,z:A.z,blockType:0},[ee,Me,ye]=Q(W);for(let xe=o.edits.length-1;xe>=0;xe--){const[Ce,st,tt]=Q(o.edits[xe]);if(Ce===ee&&st===Me&&tt===ye){D(W,o.edits[xe])&&o.edits.splice(xe,1);break}}o.edits.push(W),F(W),ue=!0});let ue=!1;const Se=(r==null?void 0:r.lastPosition)??(o!==null&&o.lastPlayedAt>o.createdAt?o.player:null);if(Se!==null){E.position.set(Se.x,Se.y,Se.z),k.yaw=Se.yaw,k.pitch=Se.pitch,k.velY=0;const A=B.chunksPerFrame;B.chunksPerFrame=200,B.update(new j(Se.x,Se.y,Se.z),0),B.chunksPerFrame=A}else{const A=E.position.x,W=E.position.z,ee=B.chunksPerFrame;B.chunksPerFrame=200,B.update(new j(A,50,W),0),B.chunksPerFrame=ee;const Me=B.getTopBlockY(A,W,200);Me>0&&(E.position.y=Me+1.62,k.velY=0)}const Tt=document.createElement("div");Tt.style.cssText="width:100%;height:1px;background:rgba(255,255,255,0.12)",v.card.appendChild(Tt);const on=js(v.card,bn,b.slots,()=>b.refresh(),b.getSelectedSlot,b.setSelectedSlot),dr=document.createElement("div");dr.style.cssText="width:100%;height:1px;background:rgba(255,255,255,0.12)",v.card.appendChild(dr);const an=document.createElement("div");an.textContent="EFFECTS",an.style.cssText="color:rgba(255,255,255,0.35);font-size:11px;letter-spacing:0.18em;align-self:flex-start",v.card.appendChild(an),qs(H,async A=>{if(A!=="ssao"&&A!=="ssgi"&&A!=="shadows"&&A!=="aces"&&A!=="ao_dbg"&&A!=="shd_dbg"){if(A==="chunk_dbg"){T.worldGeometryPass.setDebugChunks(H.chunk_dbg);return}if(A!=="hdr"){if(A==="auto_exp"){T.autoExposurePass.enabled=H.auto_exp;return}if(A==="fog"){T.compositePass.depthFogEnabled=H.fog;return}if(A==="rain"){await z();return}if(A==="clouds"){await z();return}await z()}}},v.card),b.setOnSelectionChanged(on.refreshSlotHighlight);const sn=document.createElement("div");sn.textContent="ESC  ·  resume",sn.style.cssText="color:rgba(255,255,255,0.25);font-size:11px;letter-spacing:0.1em",v.card.appendChild(sn);const ze=document.createElement("button");ze.textContent="Quit to Title",ze.style.cssText=["padding:8px 28px","font-size:13px","font-family:ui-monospace,monospace","background: #3a1a1a","color:#f88","border:1px solid #f88","border-radius:6px","cursor:pointer","letter-spacing:0.06em","transition:background 0.15s"].join(";"),ze.addEventListener("mouseenter",()=>{ze.style.background="#4a2424"}),ze.addEventListener("mouseleave",()=>{ze.style.background="#3a1a1a"});const fr=()=>{document.pointerLockElement===u&&document.exitPointerLock(),location.reload()};ze.addEventListener("click",fr),ze.addEventListener("touchend",A=>{A.preventDefault(),fr()},{passive:!1}),v.card.insertBefore(ze,v.card.children[2]),new ResizeObserver(async()=>{const A=Math.max(1,Math.round(u.clientWidth*devicePixelRatio)),W=Math.max(1,Math.round(u.clientHeight*devicePixelRatio));A===u.width&&W===u.height||(u.width=A,u.height=W,await z())}).observe(u);let pr=0,ln=0,hr=-1/0,at=(r==null?void 0:r.sunAngle)??(o==null?void 0:o.sunAngle)??Math.PI*.3,cn=0,_r=0,mr=0,gr=0,Mt=Go(B.getBiomeAt(E.position.x,E.position.y,E.position.z));const vr=Po(B.getBiomeAt(E.position.x,E.position.y,E.position.z));let un=vr.cloudBase,dn=vr.cloudTop;const fn=new Ac,We=new j(0,0,-1),At=new ae([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),hi=5e3,_i=3e4,br=.5,mi=.005;let yr=performance.now(),wr=-1/0,xr=E.position.x,Br=E.position.y,Sr=E.position.z,Pr=at,pn=!1;async function gi(){try{const A=await createImageBitmap(u,{resizeWidth:160,resizeHeight:90,resizeQuality:"medium"}),W=new OffscreenCanvas(160,90),ee=W.getContext("2d");return ee===null?null:(ee.drawImage(A,0,0),await W.convertToBlob({type:"image/jpeg",quality:.7}))}catch(A){return console.warn("[crafty] screenshot capture failed",A),null}}function Gr(A){if(o===null||i===null||pn)return;o.player.x=E.position.x,o.player.y=E.position.y,o.player.z=E.position.z,o.player.yaw=k.yaw,o.player.pitch=k.pitch,o.sunAngle=at,o.lastPlayedAt=Date.now(),o.version=Kt,xr=E.position.x,Br=E.position.y,Sr=E.position.z,Pr=at,ue=!1,pn=!0;const W=()=>{i.save(o).catch(ee=>{console.error("[crafty] save failed",ee)}).finally(()=>{pn=!1})};A?gi().then(ee=>{ee!==null&&(o.screenshot=ee),wr=performance.now(),W()}):W()}if(o!==null&&i!==null){const A=()=>{ue&&Gr(!1)};window.addEventListener("beforeunload",A),window.addEventListener("pagehide",A),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&A()})}async function Tr(A){var zr,Fr,Hr;a.pushPassErrorScope("frame");const W=Math.min((A-pr)/1e3,.1);pr=A;const ee=A-hr>=1e3;ee&&(hr=A),W>0&&(ln+=(1/W-ln)*.1),at+=W*.01,cn+=W,mr+=W*1.5,gr+=W*.5;const Me=.65,ye=(at%(2*Math.PI)+2*Math.PI)%(2*Math.PI),xe=Me*2*Math.PI,Ce=ye<xe?ye/xe*Math.PI:Math.PI+(ye-xe)/(2*Math.PI-xe)*Math.PI,st=Math.sin(Ce),tt=.25,gt=-st,hn=Math.cos(Ce),_n=Math.sqrt(tt*tt+gt*gt+hn*hn);U.direction.set(tt/_n,gt/_n,hn/_n);const mn=st;U.intensity=Math.max(0,mn)*6;const Mr=Math.max(0,mn);U.color.set(1,.8+.2*Mr,.6+.4*Mr),I.isPlayerMode()?k.update(E,W):P.update(E,W),Zs(A/1e3),Ks(A/1e3);const $=g.position();{const we=I.isPlayerMode()?k.yaw:P.yaw,Oe=I.isPlayerMode()?k.pitch:P.pitch,qe=Math.cos(Oe);We.x=-Math.sin(we)*qe,We.y=-Math.sin(Oe),We.z=-Math.cos(we)*qe,M.updateListener($,We,S)}mt.playerPos.x=$.x,mt.playerPos.y=$.y,mt.playerPos.z=$.z,t!==null&&t.connected&&t.sendTransform($.x,$.y,$.z,k.yaw,k.pitch);for(const we of X.values())we.update(W);C.update(W),B.update($,W);const Et=B.getBiomeAt($.x,$.y,$.z),Ar=Ls(Et);Ar!==T.currentWeatherEffect&&(T.currentWeatherEffect=Ar,await z());const vi=Go(Et);Mt+=(vi-Mt)*Math.min(1,.3*W);const Er=Po(Et);if(un+=(Er.cloudBase-un)*Math.min(1,.3*W),dn+=(Er.cloudTop-dn)*Math.min(1,.3*W),ee){y.fps.textContent=`${ln.toFixed(0)} fps`;const we=(T.worldGeometryPass.triangles/1e3).toFixed(1);y.stats.textContent=`${T.worldGeometryPass.drawCalls} draws  ${we}k tris
${B.chunkCount} chunks  ${B.pendingChunks} pending`,y.biome.textContent=`${Ee[Et]}  coverage:${Mt.toFixed(2)}`,y.pos.textContent=`X: ${$.x.toFixed(1)}  Y: ${$.y.toFixed(1)}  Z: ${$.z.toFixed(1)}`}const Ur=_r%16+1,bi=(Jo(Ur,2)-.5)*(2/a.width),yi=(Jo(Ur,3)-.5)*(2/a.height),Ne=g.viewProjectionMatrix(),Cr=tu(Ne,bi,yi),je=g.viewMatrix(),Fe=g.projectionMatrix(),Ie=Ne.invert(),kr=Fe.invert(),Lr=U.computeCascadeMatrices(g,128),Rr=C.collectMeshRenderers(),wi=Rr.map(we=>{const Oe=we.gameObject.localToWorld();return{mesh:we.mesh,modelMatrix:Oe,normalMatrix:Oe.normalMatrix(),material:we.material}}),Nr=Rr.filter(we=>we.castShadow).map(we=>({mesh:we.mesh,modelMatrix:we.gameObject.localToWorld()}));O.setSceneSnapshot(Nr),O.updateScene(C,g,U,128),T.worldShadowPass.enabled=U.intensity>0,T.worldShadowPass.update(a,Lr,$.x,$.z);const Ut=Math.max(0,mn),xi=[.02+.38*Ut,.03+.52*Ut,.05+.65*Ut],gn={cloudBase:un,cloudTop:dn,coverage:Mt,density:4,windOffset:[mr,gr],anisotropy:.85,extinction:.25,ambientColor:xi,exposure:1};T.cloudShadowPass&&T.cloudShadowPass.update(a,gn,[$.x,$.z],128),(zr=T.godrayPass)==null||zr.updateCloudDensity(a,gn),T.cloudPass&&(T.cloudPass.updateCamera(a,Ie,$,g.near,g.far),T.cloudPass.updateLight(a,U.direction,U.color,U.intensity),T.cloudPass.updateSettings(a,gn));const Ir=C.getComponents(Dn),Or=C.getComponents(ni);T.pointSpotShadowPass.update(Ir,Or,Nr),T.pointSpotLightPass.updateCamera(a,je,Fe,Ne,Ie,$,g.near,g.far),T.pointSpotLightPass.updateLights(a,Ir,Or),T.atmospherePass.update(a,Ie,$,U.direction),T.geometryPass.setDrawItems(wi),T.geometryPass.updateCamera(a,je,Fe,Cr,Ie,$,g.near,g.far),T.worldGeometryPass.updateCamera(a,je,Fe,Cr,Ie,$,g.near,g.far),T.waterPass.updateCamera(a,je,Fe,Ne,Ie,$,g.near,g.far),T.waterPass.updateTime(a,cn,Math.max(.01,Ut)),T.lightingPass.updateCamera(a,je,Fe,Ne,Ie,$,g.near,g.far),T.lightingPass.updateLight(a,U.direction,U.color,U.intensity,Lr,H.shadows,H.shd_dbg),T.lightingPass.updateCloudShadow(a,T.cloudShadowPass?$.x:0,T.cloudShadowPass?$.z:0,128),T.ssaoPass.updateCamera(a,je,Fe,kr),T.ssaoPass.updateParams(a,1,.005,H.ssao?2:0),T.ssgiPass.enabled=H.ssgi,T.ssgiPass.updateSettings({strength:H.ssgi?1:0}),H.ssgi&&T.ssgiPass.updateCamera(a,je,Fe,kr,Ie,T.prevViewProj??Ne,$);const Dr=Math.cos(k.pitch);We.x=-Math.sin(k.yaw)*Dr,We.y=-Math.sin(k.pitch),We.z=-Math.cos(k.yaw)*Dr;const Ct=B.getBlockByRay($,We,16),Vr=!!(Ct&&Ct.position.sub($).length()<=6);N.targetBlock=Vr?Ct.position:null,N.targetHit=Vr?Ct:null;const Bi=N.targetBlock&&!he(B.getBlockType(N.targetBlock.x,N.targetBlock.y,N.targetBlock.z))?N.targetBlock:null;if(T.blockHighlightPass.setCrackStage(N.crackStage),T.blockHighlightPass.update(a,Ne,Bi),nl(W,A,u,N,B,()=>b.getSelected(),C),T.rainPass){fn.update($.x,$.z,B),T.rainPass.updateHeightmap(a,fn.data,$.x,$.z,fn.extent);const we=T.currentWeatherEffect===_t.Snow?20:8;At.data[12]=$.x,At.data[13]=$.y+we,At.data[14]=$.z,T.rainPass.update(a,W,je,Fe,Ne,Ie,$,g.near,g.far,At)}(Fr=T.dofPass)==null||Fr.updateParams(a,8,75,3,g.near,g.far),(Hr=T.godrayPass)==null||Hr.updateParams(a);const Si=he(B.getBlockType(Math.floor($.x),Math.floor($.y),Math.floor($.z))),Pi={x:-U.direction.x,y:-U.direction.y,z:-U.direction.z};if(T.compositePass.updateParams(a,Si,cn,H.aces,H.ao_dbg,H.hdr),T.compositePass.updateStars(a,Ie,$,Pi),T.autoExposurePass.update(a,W),T.taaPass.updateCamera(a,Ie,T.prevViewProj??Ne),X.size>0){for(const[we,Oe]of X){const qe=ce.get(we);qe!==void 0&&Oe.headWorldPosition(qe)}ve.update(Ne,$,u.clientWidth,u.clientHeight,ce)}if(T.prevViewProj=Ne,_r++,await T.graph.execute(a),await a.popPassErrorScope("frame"),o!==null&&i!==null){const we=E.position.x-xr,Oe=E.position.y-Br,qe=E.position.z-Sr;we*we+Oe*Oe+qe*qe>br*br&&(ue=!0),Math.abs(at-Pr)>mi&&(ue=!0);const vn=performance.now();if(ue&&vn-yr>=hi){yr=vn;const Gi=vn-wr>=_i;Gr(Gi)}}requestAnimationFrame(Tr)}requestAnimationFrame(Tr)}nu().catch(u=>{document.body.innerHTML=`<pre style="color:red;padding:1rem">${u}</pre>`,console.error(u)});export{jn as A,qn as B,Yn as C,tr as D,Jt as G,Wn as L,sr as P,Vn as R,nr as S,$n as T,ot as W,Ln as a,Zn as b,Xn as c,Jn as d,Qn as e,Kn as f,ar as g,or as h,Be as i,rr as j,Hn as k,er as l,ir as m};
