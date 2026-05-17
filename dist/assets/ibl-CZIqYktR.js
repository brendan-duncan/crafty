const C=`// IBL baking — two compute entry points share the same bind group layout.
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
`;const V=[0,.25,.5,.75,1],A=Math.PI;function R(e){let n=e>>>0;return n=(n<<16|n>>>16)>>>0,n=((n&1431655765)<<1|n>>>1&1431655765)>>>0,n=((n&858993459)<<2|n>>>2&858993459)>>>0,n=((n&252645135)<<4|n>>>4&252645135)>>>0,n=((n&16711935)<<8|n>>>8&16711935)>>>0,n*23283064365386963e-26}function k(e,n,r){const i=new Float32Array(e*n*4);for(let c=0;c<n;c++)for(let u=0;u<e;u++){const a=(u+.5)/e,g=(c+.5)/n,p=g*g,f=p*p,_=Math.sqrt(1-a*a),L=a;let x=0,h=0;for(let m=0;m<r;m++){const S=(m+.5)/r,I=R(m),B=(1-I)/(1+(f-1)*I),P=Math.sqrt(B),T=Math.sqrt(Math.max(0,1-B)),l=2*A*S,v=T*Math.cos(l),G=P,b=_*v+L*G;if(b<=0)continue;const E=2*b*G-L,t=Math.max(0,E),o=Math.max(0,P);if(t<=0)continue;const s=f/2,y=a/(a*(1-s)+s),z=t/(t*(1-s)+s),w=y*z*b/(o*a),U=Math.pow(1-b,5);x+=w*(1-U),h+=w*U}const d=(c*e+u)*4;i[d+0]=x/r,i[d+1]=h/r,i[d+2]=0,i[d+3]=1}return i}function q(e){const n=new Float32Array([e]),r=new Uint32Array(n.buffer)[0],i=r>>31&1,c=r>>23&255,u=r&8388607;if(c===255)return i<<15|31744|(u?1:0);if(c===0)return i<<15;const a=c-127+15;return a>=31?i<<15|31744:a<=0?i<<15:i<<15|a<<10|u>>13}function D(e){const n=new Uint16Array(e.length);for(let r=0;r<e.length;r++)n[r]=q(e[r]);return n}const N=new WeakMap;function O(e){const n=N.get(e);if(n)return n;const r=D(k(64,64,512)),i=e.createTexture({label:"IBL BRDF LUT",size:{width:64,height:64},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return e.queue.writeTexture({texture:i},r,{bytesPerRow:64*8},{width:64,height:64}),N.set(e,i),i}const M=new WeakMap;function F(e){const n=M.get(e);if(n)return n;const r=e.createBindGroupLayout({label:"IblBGL0",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"float"}},{binding:2,visibility:GPUShaderStage.COMPUTE,sampler:{type:"filtering"}}]}),i=e.createBindGroupLayout({label:"IblBGL1",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"2d"}}]}),c=e.createPipelineLayout({bindGroupLayouts:[r,i]}),u=e.createShaderModule({label:"IblCompute",code:C}),a=e.createComputePipeline({label:"IblIrradiancePipeline",layout:c,compute:{module:u,entryPoint:"cs_irradiance"}}),g=e.createComputePipeline({label:"IblPrefilterPipeline",layout:c,compute:{module:u,entryPoint:"cs_prefilter"}}),p=e.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"clamp-to-edge"}),f={irrPipeline:a,pfPipeline:g,bgl0:r,bgl1:i,sampler:p};return M.set(e,f),f}async function H(e,n,r=.2){const{irrPipeline:i,pfPipeline:c,bgl0:u,bgl1:a,sampler:g}=F(e),p=e.createTexture({label:"IBL Irradiance",size:{width:32,height:32,depthOrArrayLayers:6},format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),f=e.createTexture({label:"IBL Prefiltered",size:{width:128,height:128,depthOrArrayLayers:6},mipLevelCount:5,format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING}),_=(t,o)=>{const s=e.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});return e.queue.writeBuffer(s,0,new Float32Array([r,t,o,0])),s},L=n.createView(),x=t=>e.createBindGroup({layout:u,entries:[{binding:0,resource:{buffer:t}},{binding:1,resource:L},{binding:2,resource:g}]}),h=t=>e.createBindGroup({layout:a,entries:[{binding:0,resource:t}]}),d=Array.from({length:6},(t,o)=>_(0,o)),m=V.flatMap((t,o)=>Array.from({length:6},(s,y)=>_(t,y))),S=d.map(x),I=m.map(x),B=Array.from({length:6},(t,o)=>h(p.createView({dimension:"2d",baseArrayLayer:o,arrayLayerCount:1}))),P=Array.from({length:5*6},(t,o)=>{const s=Math.floor(o/6),y=o%6;return h(f.createView({dimension:"2d",baseMipLevel:s,mipLevelCount:1,baseArrayLayer:y,arrayLayerCount:1}))}),T=e.createCommandEncoder({label:"IblComputeEncoder"}),l=T.beginComputePass({label:"IblComputePass"});l.setPipeline(i);for(let t=0;t<6;t++)l.setBindGroup(0,S[t]),l.setBindGroup(1,B[t]),l.dispatchWorkgroups(Math.ceil(32/8),Math.ceil(32/8));l.setPipeline(c);for(let t=0;t<5;t++){const o=128>>t;for(let s=0;s<6;s++)l.setBindGroup(0,I[t*6+s]),l.setBindGroup(1,P[t*6+s]),l.dispatchWorkgroups(Math.ceil(o/8),Math.ceil(o/8))}l.end(),e.queue.submit([T.finish()]),await e.queue.onSubmittedWorkDone(),d.forEach(t=>t.destroy()),m.forEach(t=>t.destroy());const v=O(e),G=p.createView({dimension:"cube"}),b=f.createView({dimension:"cube"}),E=v.createView();return{irradiance:p,prefiltered:f,brdfLut:v,irradianceView:G,prefilteredView:b,brdfLutView:E,levels:5,destroy(){p.destroy(),f.destroy()}}}export{H as c};
