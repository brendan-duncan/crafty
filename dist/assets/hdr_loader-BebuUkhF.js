var O=Object.defineProperty;var V=(n,e,t)=>e in n?O(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var N=(n,e,t)=>V(n,typeof e!="symbol"?e+"":e,t);const te=""+new URL("clear_sky-CyjsjiVR.hdr",import.meta.url).href,q=`// IBL baking — two compute entry points share the same bind group layout.
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

// Convert cube face + normalized UV in [-1,1] to a world-space direction.
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
`,v=5,z=128,S=32,W=[0,.25,.5,.75,1],X=Math.PI;function F(n){let e=n>>>0;return e=(e<<16|e>>>16)>>>0,e=((e&1431655765)<<1|e>>>1&1431655765)>>>0,e=((e&858993459)<<2|e>>>2&858993459)>>>0,e=((e&252645135)<<4|e>>>4&252645135)>>>0,e=((e&16711935)<<8|e>>>8&16711935)>>>0,e*23283064365386963e-26}function Y(n,e,t){const r=new Float32Array(n*e*4);for(let s=0;s<e;s++)for(let c=0;c<n;c++){const a=(c+.5)/n,m=(s+.5)/e,u=m*m,i=u*u,_=Math.sqrt(1-a*a),L=a;let g=0,b=0;for(let h=0;h<t;h++){const P=(h+.5)/t,l=F(h),f=(1-l)/(1+(i-1)*l),d=Math.sqrt(f),B=Math.sqrt(Math.max(0,1-f)),p=2*X*P,w=B*Math.cos(p),G=d,U=_*w+L*G;if(U<=0)continue;const R=2*U*G-L,o=Math.max(0,R),T=Math.max(0,d);if(o<=0)continue;const y=i/2,E=a/(a*(1-y)+y),H=o/(o*(1-y)+y),D=E*H*U/(T*a),C=Math.pow(1-U,5);g+=D*(1-C),b+=D*C}const x=(s*n+c)*4;r[x+0]=g/t,r[x+1]=b/t,r[x+2]=0,r[x+3]=1}return r}function Z(n){const e=new Float32Array([n]),t=new Uint32Array(e.buffer)[0],r=t>>31&1,s=t>>23&255,c=t&8388607;if(s===255)return r<<15|31744|(c?1:0);if(s===0)return r<<15;const a=s-127+15;return a>=31?r<<15|31744:a<=0?r<<15:r<<15|a<<10|c>>13}function $(n){const e=new Uint16Array(n.length);for(let t=0;t<n.length;t++)e[t]=Z(n[t]);return e}const M=new WeakMap;function j(n){const e=M.get(n);if(e)return e;const t=$(Y(64,64,512)),r=n.createTexture({label:"IBL BRDF LUT",size:{width:64,height:64},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return n.queue.writeTexture({texture:r},t,{bytesPerRow:64*8},{width:64,height:64}),M.set(n,r),r}const A=new WeakMap;function Q(n){const e=A.get(n);if(e)return e;const t=n.createBindGroupLayout({label:"IblBGL0",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.COMPUTE,sampler:{type:"filtering"}}]}),r=n.createBindGroupLayout({label:"IblBGL1",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"2d"}}]}),s=n.createPipelineLayout({bindGroupLayouts:[t,r]}),c=n.createShaderModule({label:"IblCompute",code:q}),a=n.createComputePipeline({label:"IblIrradiancePipeline",layout:s,compute:{module:c,entryPoint:"cs_irradiance"}}),m=n.createComputePipeline({label:"IblPrefilterPipeline",layout:s,compute:{module:c,entryPoint:"cs_prefilter"}}),u=n.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"clamp-to-edge"}),i={irrPipeline:a,pfPipeline:m,bgl0:t,bgl1:r,sampler:u};return A.set(n,i),i}async function ne(n,e,t=.2){const{irrPipeline:r,pfPipeline:s,bgl0:c,bgl1:a,sampler:m}=Q(n),u=n.createTexture({label:"IBL Irradiance",size:{width:S,height:S,depthOrArrayLayers:6},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),i=n.createTexture({label:"IBL Prefiltered",size:{width:z,height:z,depthOrArrayLayers:6},mipLevelCount:v,format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),_=(o,T)=>{const y=n.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return n.queue.writeBuffer(y,0,new Float32Array([t,o,T,0])),y},L=e.createView(),g=o=>n.createBindGroup({layout:c,entries:[{binding:0,resource:{buffer:o}},{binding:1,resource:L},{binding:2,resource:m}]}),b=o=>n.createBindGroup({layout:a,entries:[{binding:0,resource:o}]}),x=Array.from({length:6},(o,T)=>_(0,T)),h=W.flatMap((o,T)=>Array.from({length:6},(y,E)=>_(o,E))),P=x.map(g),l=h.map(g),f=Array.from({length:6},(o,T)=>b(u.createView({dimension:"2d",baseArrayLayer:T,arrayLayerCount:1}))),d=Array.from({length:v*6},(o,T)=>{const y=Math.floor(T/6),E=T%6;return b(i.createView({dimension:"2d",baseMipLevel:y,mipLevelCount:1,baseArrayLayer:E,arrayLayerCount:1}))}),B=n.createCommandEncoder({label:"IblComputeEncoder"}),p=B.beginComputePass({label:"IblComputePass"});p.setPipeline(r);for(let o=0;o<6;o++)p.setBindGroup(0,P[o]),p.setBindGroup(1,f[o]),p.dispatchWorkgroups(Math.ceil(S/8),Math.ceil(S/8));p.setPipeline(s);for(let o=0;o<v;o++){const T=z>>o;for(let y=0;y<6;y++)p.setBindGroup(0,l[o*6+y]),p.setBindGroup(1,d[o*6+y]),p.dispatchWorkgroups(Math.ceil(T/8),Math.ceil(T/8))}p.end(),n.queue.submit([B.finish()]),await n.queue.onSubmittedWorkDone(),x.forEach(o=>o.destroy()),h.forEach(o=>o.destroy());const w=j(n),G=u.createView({dimension:"cube"}),U=i.createView({dimension:"cube"}),R=w.createView();return{irradiance:u,prefiltered:i,brdfLut:w,irradianceView:G,prefilteredView:U,brdfLutView:R,levels:v,destroy(){u.destroy(),i.destroy()}}}class I{constructor(e,t){N(this,"gpuTexture");N(this,"view");N(this,"type");this.gpuTexture=e,this.type=t,this.view=e.createView({dimension:t==="cube"?"cube":t==="3d"?"3d":"2d"})}destroy(){this.gpuTexture.destroy()}static createSolid(e,t,r,s,c=255){const a=e.createTexture({size:{width:1,height:1},format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return e.queue.writeTexture({texture:a},new Uint8Array([t,r,s,c]),{bytesPerRow:4},{width:1,height:1}),new I(a,"2d")}static fromBitmap(e,t,{srgb:r=!1,usage:s}={}){const c=r?"rgba8unorm-srgb":"rgba8unorm";s=s?s|(GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT):GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT;const a=e.createTexture({size:{width:t.width,height:t.height},format:c,usage:s});return e.queue.copyExternalImageToTexture({source:t,flipY:!1},{texture:a},{width:t.width,height:t.height}),new I(a,"2d")}static async fromUrl(e,t,r={}){const s=await(await fetch(t)).blob(),c={colorSpaceConversion:"none"};r.resizeWidth!==void 0&&r.resizeHeight!==void 0&&(c.resizeWidth=r.resizeWidth,c.resizeHeight=r.resizeHeight,c.resizeQuality="high");const a=await createImageBitmap(s,c);return I.fromBitmap(e,a,r)}}const J=`// Decodes an RGBE (Radiance HDR) texture into a linear rgba16float texture.
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
`;function re(n){const e=new Uint8Array(n);let t=0;function r(){let g="";for(;t<e.length&&e[t]!==10;)e[t]!==13&&(g+=String.fromCharCode(e[t])),t++;return t<e.length&&t++,g}const s=r();if(!s.startsWith("#?RADIANCE")&&!s.startsWith("#?RGBE"))throw new Error(`Not a Radiance HDR file (magic: "${s}")`);for(;r().length!==0;);const c=r(),a=c.match(/-Y\s+(\d+)\s+\+X\s+(\d+)/);if(!a)throw new Error(`Unrecognized HDR resolution: "${c}"`);const m=parseInt(a[1],10),u=parseInt(a[2],10),i=new Uint8Array(u*m*4);function _(g){const b=new Uint8Array(u),x=new Uint8Array(u),h=new Uint8Array(u),P=new Uint8Array(u),l=[b,x,h,P];for(let d=0;d<4;d++){const B=l[d];let p=0;for(;p<u;){const w=e[t++];if(w>128){const G=w-128,U=e[t++];B.fill(U,p,p+G),p+=G}else B.set(e.subarray(t,t+w),p),t+=w,p+=w}}const f=g*u*4;for(let d=0;d<u;d++)i[f+d*4+0]=b[d],i[f+d*4+1]=x[d],i[f+d*4+2]=h[d],i[f+d*4+3]=P[d]}function L(g,b,x,h,P){const l=g*u*4;i[l+0]=b,i[l+1]=x,i[l+2]=h,i[l+3]=P;let f=1;for(;f<u;){const d=e[t++],B=e[t++],p=e[t++],w=e[t++];if(d===1&&B===1&&p===1){const G=l+(f-1)*4;for(let U=0;U<w;U++)i[l+f*4+0]=i[G+0],i[l+f*4+1]=i[G+1],i[l+f*4+2]=i[G+2],i[l+f*4+3]=i[G+3],f++}else i[l+f*4+0]=d,i[l+f*4+1]=B,i[l+f*4+2]=p,i[l+f*4+3]=w,f++}}for(let g=0;g<m&&!(t+4>e.length);g++){const b=e[t++],x=e[t++],h=e[t++],P=e[t++];if(b===2&&x===2&&!(h&128)){const l=h<<8|P;if(l!==u)throw new Error(`HDR scanline width mismatch: ${l} vs ${u}`);_(g)}else L(g,b,x,h,P)}return{width:u,height:m,data:i}}const k=new WeakMap;function K(n){const e=k.get(n);if(e)return e;const t=n.createBindGroupLayout({label:"RgbeSrcBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"uint"}}]}),r=n.createBindGroupLayout({label:"RgbeDstBGL",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"2d"}}]}),s=n.createPipelineLayout({bindGroupLayouts:[t,r]}),c=n.createShaderModule({label:"RgbeDecode",code:J}),m={pipeline:n.createComputePipeline({label:"RgbeDecodePipeline",layout:s,compute:{module:c,entryPoint:"cs_decode"}}),srcBGL:t,dstBGL:r};return k.set(n,m),m}async function ie(n,e){const{width:t,height:r,data:s}=e,{pipeline:c,srcBGL:a,dstBGL:m}=K(n),u=n.createTexture({label:"Sky RGBE Raw",size:{width:t,height:r},format:"rgba8uint",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});n.queue.writeTexture({texture:u},s.buffer,{bytesPerRow:t*4},{width:t,height:r});const i=n.createTexture({label:"Sky HDR Texture",size:{width:t,height:r},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),_=n.createBindGroup({layout:a,entries:[{binding:0,resource:u.createView()}]}),L=n.createBindGroup({layout:m,entries:[{binding:0,resource:i.createView()}]}),g=n.createCommandEncoder({label:"RgbeDecodeEncoder"}),b=g.beginComputePass({label:"RgbeDecodePass"});return b.setPipeline(c),b.setBindGroup(0,_),b.setBindGroup(1,L),b.dispatchWorkgroups(Math.ceil(t/8),Math.ceil(r/8)),b.end(),n.queue.submit([g.finish()]),await n.queue.onSubmittedWorkDone(),u.destroy(),new I(i,"2d")}export{I as T,ne as a,ie as c,re as p,te as s};
