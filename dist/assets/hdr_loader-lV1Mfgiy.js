var O=Object.defineProperty;var V=(t,e,r)=>e in t?O(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var N=(t,e,r)=>V(t,typeof e!="symbol"?e+"":e,r);const re=""+new URL("clear_sky-CyjsjiVR.hdr",import.meta.url).href,q=`// IBL baking — two compute entry points share the same bind group layout.\r
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
`,v=5,D=128,S=32,W=[0,.25,.5,.75,1],X=Math.PI;function F(t){let e=t>>>0;return e=(e<<16|e>>>16)>>>0,e=((e&1431655765)<<1|e>>>1&1431655765)>>>0,e=((e&858993459)<<2|e>>>2&858993459)>>>0,e=((e&252645135)<<4|e>>>4&252645135)>>>0,e=((e&16711935)<<8|e>>>8&16711935)>>>0,e*23283064365386963e-26}function Y(t,e,r){const n=new Float32Array(t*e*4);for(let s=0;s<e;s++)for(let c=0;c<t;c++){const a=(c+.5)/t,m=(s+.5)/e,u=m*m,i=u*u,_=Math.sqrt(1-a*a),L=a;let g=0,b=0;for(let h=0;h<r;h++){const P=(h+.5)/r,l=F(h),f=(1-l)/(1+(i-1)*l),d=Math.sqrt(f),B=Math.sqrt(Math.max(0,1-f)),p=2*X*P,w=B*Math.cos(p),G=d,U=_*w+L*G;if(U<=0)continue;const R=2*U*G-L,o=Math.max(0,R),T=Math.max(0,d);if(o<=0)continue;const y=i/2,E=a/(a*(1-y)+y),H=o/(o*(1-y)+y),z=E*H*U/(T*a),C=Math.pow(1-U,5);g+=z*(1-C),b+=z*C}const x=(s*t+c)*4;n[x+0]=g/r,n[x+1]=b/r,n[x+2]=0,n[x+3]=1}return n}function Z(t){const e=new Float32Array([t]),r=new Uint32Array(e.buffer)[0],n=r>>31&1,s=r>>23&255,c=r&8388607;if(s===255)return n<<15|31744|(c?1:0);if(s===0)return n<<15;const a=s-127+15;return a>=31?n<<15|31744:a<=0?n<<15:n<<15|a<<10|c>>13}function $(t){const e=new Uint16Array(t.length);for(let r=0;r<t.length;r++)e[r]=Z(t[r]);return e}const M=new WeakMap;function j(t){const e=M.get(t);if(e)return e;const r=$(Y(64,64,512)),n=t.createTexture({label:"IBL BRDF LUT",size:{width:64,height:64},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return t.queue.writeTexture({texture:n},r,{bytesPerRow:64*8},{width:64,height:64}),M.set(t,n),n}const A=new WeakMap;function Q(t){const e=A.get(t);if(e)return e;const r=t.createBindGroupLayout({label:"IblBGL0",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.COMPUTE,sampler:{type:"filtering"}}]}),n=t.createBindGroupLayout({label:"IblBGL1",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"2d"}}]}),s=t.createPipelineLayout({bindGroupLayouts:[r,n]}),c=t.createShaderModule({label:"IblCompute",code:q}),a=t.createComputePipeline({label:"IblIrradiancePipeline",layout:s,compute:{module:c,entryPoint:"cs_irradiance"}}),m=t.createComputePipeline({label:"IblPrefilterPipeline",layout:s,compute:{module:c,entryPoint:"cs_prefilter"}}),u=t.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"clamp-to-edge"}),i={irrPipeline:a,pfPipeline:m,bgl0:r,bgl1:n,sampler:u};return A.set(t,i),i}async function te(t,e,r=.2){const{irrPipeline:n,pfPipeline:s,bgl0:c,bgl1:a,sampler:m}=Q(t),u=t.createTexture({label:"IBL Irradiance",size:{width:S,height:S,depthOrArrayLayers:6},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),i=t.createTexture({label:"IBL Prefiltered",size:{width:D,height:D,depthOrArrayLayers:6},mipLevelCount:v,format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),_=(o,T)=>{const y=t.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return t.queue.writeBuffer(y,0,new Float32Array([r,o,T,0])),y},L=e.createView(),g=o=>t.createBindGroup({layout:c,entries:[{binding:0,resource:{buffer:o}},{binding:1,resource:L},{binding:2,resource:m}]}),b=o=>t.createBindGroup({layout:a,entries:[{binding:0,resource:o}]}),x=Array.from({length:6},(o,T)=>_(0,T)),h=W.flatMap((o,T)=>Array.from({length:6},(y,E)=>_(o,E))),P=x.map(g),l=h.map(g),f=Array.from({length:6},(o,T)=>b(u.createView({dimension:"2d",baseArrayLayer:T,arrayLayerCount:1}))),d=Array.from({length:v*6},(o,T)=>{const y=Math.floor(T/6),E=T%6;return b(i.createView({dimension:"2d",baseMipLevel:y,mipLevelCount:1,baseArrayLayer:E,arrayLayerCount:1}))}),B=t.createCommandEncoder({label:"IblComputeEncoder"}),p=B.beginComputePass({label:"IblComputePass"});p.setPipeline(n);for(let o=0;o<6;o++)p.setBindGroup(0,P[o]),p.setBindGroup(1,f[o]),p.dispatchWorkgroups(Math.ceil(S/8),Math.ceil(S/8));p.setPipeline(s);for(let o=0;o<v;o++){const T=D>>o;for(let y=0;y<6;y++)p.setBindGroup(0,l[o*6+y]),p.setBindGroup(1,d[o*6+y]),p.dispatchWorkgroups(Math.ceil(T/8),Math.ceil(T/8))}p.end(),t.queue.submit([B.finish()]),await t.queue.onSubmittedWorkDone(),x.forEach(o=>o.destroy()),h.forEach(o=>o.destroy());const w=j(t),G=u.createView({dimension:"cube"}),U=i.createView({dimension:"cube"}),R=w.createView();return{irradiance:u,prefiltered:i,brdfLut:w,irradianceView:G,prefilteredView:U,brdfLutView:R,levels:v,destroy(){u.destroy(),i.destroy()}}}class I{constructor(e,r){N(this,"gpuTexture");N(this,"view");N(this,"type");this.gpuTexture=e,this.type=r,this.view=e.createView({dimension:r==="cube"?"cube":r==="3d"?"3d":"2d"})}destroy(){this.gpuTexture.destroy()}static createSolid(e,r,n,s,c=255){const a=e.createTexture({size:{width:1,height:1},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return e.queue.writeTexture({texture:a},new Uint8Array([r,n,s,c]),{bytesPerRow:4},{width:1,height:1}),new I(a,"2d")}static fromBitmap(e,r,{srgb:n=!1,usage:s}={}){const c=n?"rgba8unorm-srgb":"rgba8unorm";s=s?s|(GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT):GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT;const a=e.createTexture({size:{width:r.width,height:r.height},format:c,usage:s});return e.queue.copyExternalImageToTexture({source:r,flipY:!1},{texture:a},{width:r.width,height:r.height}),new I(a,"2d")}static async fromUrl(e,r,n={}){const s=await(await fetch(r)).blob(),c={colorSpaceConversion:"none"};n.resizeWidth!==void 0&&n.resizeHeight!==void 0&&(c.resizeWidth=n.resizeWidth,c.resizeHeight=n.resizeHeight,c.resizeQuality="high");const a=await createImageBitmap(s,c);return I.fromBitmap(e,a,n)}}const J=`// Decodes an RGBE (Radiance HDR) texture into a linear rgba16float texture.\r
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
`;function ne(t){const e=new Uint8Array(t);let r=0;function n(){let g="";for(;r<e.length&&e[r]!==10;)e[r]!==13&&(g+=String.fromCharCode(e[r])),r++;return r<e.length&&r++,g}const s=n();if(!s.startsWith("#?RADIANCE")&&!s.startsWith("#?RGBE"))throw new Error(`Not a Radiance HDR file (magic: "${s}")`);for(;n().length!==0;);const c=n(),a=c.match(/-Y\s+(\d+)\s+\+X\s+(\d+)/);if(!a)throw new Error(`Unrecognized HDR resolution: "${c}"`);const m=parseInt(a[1],10),u=parseInt(a[2],10),i=new Uint8Array(u*m*4);function _(g){const b=new Uint8Array(u),x=new Uint8Array(u),h=new Uint8Array(u),P=new Uint8Array(u),l=[b,x,h,P];for(let d=0;d<4;d++){const B=l[d];let p=0;for(;p<u;){const w=e[r++];if(w>128){const G=w-128,U=e[r++];B.fill(U,p,p+G),p+=G}else B.set(e.subarray(r,r+w),p),r+=w,p+=w}}const f=g*u*4;for(let d=0;d<u;d++)i[f+d*4+0]=b[d],i[f+d*4+1]=x[d],i[f+d*4+2]=h[d],i[f+d*4+3]=P[d]}function L(g,b,x,h,P){const l=g*u*4;i[l+0]=b,i[l+1]=x,i[l+2]=h,i[l+3]=P;let f=1;for(;f<u;){const d=e[r++],B=e[r++],p=e[r++],w=e[r++];if(d===1&&B===1&&p===1){const G=l+(f-1)*4;for(let U=0;U<w;U++)i[l+f*4+0]=i[G+0],i[l+f*4+1]=i[G+1],i[l+f*4+2]=i[G+2],i[l+f*4+3]=i[G+3],f++}else i[l+f*4+0]=d,i[l+f*4+1]=B,i[l+f*4+2]=p,i[l+f*4+3]=w,f++}}for(let g=0;g<m&&!(r+4>e.length);g++){const b=e[r++],x=e[r++],h=e[r++],P=e[r++];if(b===2&&x===2&&!(h&128)){const l=h<<8|P;if(l!==u)throw new Error(`HDR scanline width mismatch: ${l} vs ${u}`);_(g)}else L(g,b,x,h,P)}return{width:u,height:m,data:i}}const k=new WeakMap;function K(t){const e=k.get(t);if(e)return e;const r=t.createBindGroupLayout({label:"RgbeSrcBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"uint"}}]}),n=t.createBindGroupLayout({label:"RgbeDstBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"2d"}}]}),s=t.createPipelineLayout({bindGroupLayouts:[r,n]}),c=t.createShaderModule({label:"RgbeDecode",code:J}),m={pipeline:t.createComputePipeline({label:"RgbeDecodePipeline",layout:s,compute:{module:c,entryPoint:"cs_decode"}}),srcBGL:r,dstBGL:n};return k.set(t,m),m}async function ie(t,e){const{width:r,height:n,data:s}=e,{pipeline:c,srcBGL:a,dstBGL:m}=K(t),u=t.createTexture({label:"Sky RGBE Raw",size:{width:r,height:n},format:"rgba8uint",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});t.queue.writeTexture({texture:u},s.buffer,{bytesPerRow:r*4},{width:r,height:n});const i=t.createTexture({label:"Sky HDR Texture",size:{width:r,height:n},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),_=t.createBindGroup({layout:a,entries:[{binding:0,resource:u.createView()}]}),L=t.createBindGroup({layout:m,entries:[{binding:0,resource:i.createView()}]}),g=t.createCommandEncoder({label:"RgbeDecodeEncoder"}),b=g.beginComputePass({label:"RgbeDecodePass"});return b.setPipeline(c),b.setBindGroup(0,_),b.setBindGroup(1,L),b.dispatchWorkgroups(Math.ceil(r/8),Math.ceil(n/8)),b.end(),t.queue.submit([g.finish()]),await t.queue.onSubmittedWorkDone(),u.destroy(),new I(i,"2d")}export{I as T,te as a,ie as c,ne as p,re as s};
