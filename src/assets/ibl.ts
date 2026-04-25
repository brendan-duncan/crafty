import iblWgsl from '../shaders/ibl.wgsl?raw';

export interface IblTextures {
  readonly irradiance    : GPUTexture;   // rgba16float 64×32 — pre-integrated diffuse
  readonly prefiltered   : GPUTexture;   // rgba16float 64×32 × IBL_LEVELS layers — GGX pre-filtered
  readonly brdfLut       : GPUTexture;   // rgba16float 64×64 — split-sum A/B in rg
  readonly irradianceView : GPUTextureView;
  readonly prefilteredView: GPUTextureView; // dimension: '2d-array'
  readonly brdfLutView    : GPUTextureView;
  readonly levels         : number;
  destroy(): void;
}

export const IBL_LEVELS = 5;
const ROUGHNESSES = [0, 0.25, 0.5, 0.75, 1.0];

// ---- BRDF LUT (view-independent, computed once on the CPU and cached) -------

const PI = Math.PI;

function radicalInverse(n: number): number {
  let bits = n >>> 0;
  bits = ((bits << 16) | (bits >>> 16)) >>> 0;
  bits = (((bits & 0x55555555) << 1)  | ((bits >>> 1)  & 0x55555555)) >>> 0;
  bits = (((bits & 0x33333333) << 2)  | ((bits >>> 2)  & 0x33333333)) >>> 0;
  bits = (((bits & 0x0f0f0f0f) << 4)  | ((bits >>> 4)  & 0x0f0f0f0f)) >>> 0;
  bits = (((bits & 0x00ff00ff) << 8)  | ((bits >>> 8)  & 0x00ff00ff)) >>> 0;
  return bits * 2.3283064365386963e-10;
}

function computeBrdfLutData(outW: number, outH: number, samples: number): Float32Array {
  const out = new Float32Array(outW * outH * 4);
  for (let py = 0; py < outH; py++) {
    for (let px = 0; px < outW; px++) {
      const NdotV    = (px + 0.5) / outW;
      const roughness = (py + 0.5) / outH;
      const a  = roughness * roughness;
      const a2 = a * a;
      const Vx = Math.sqrt(1 - NdotV * NdotV);
      const Vz = NdotV;
      let A = 0, B = 0;
      for (let i = 0; i < samples; i++) {
        const xi1   = (i + 0.5) / samples;
        const xi2   = radicalInverse(i);
        const cosT2 = (1 - xi2) / (1 + (a2 - 1) * xi2);
        const cosT  = Math.sqrt(cosT2);
        const sinT  = Math.sqrt(Math.max(0, 1 - cosT2));
        const phiH  = 2 * PI * xi1;
        const Hx    = sinT * Math.cos(phiH);
        const Hz    = cosT;
        const VdotH = Vx * Hx + Vz * Hz;
        if (VdotH <= 0) continue;
        const Lz    = 2 * VdotH * Hz - Vz;
        const NdotL = Math.max(0, Lz);
        const NdotH = Math.max(0, cosT);
        if (NdotL <= 0) continue;
        const k     = a2 / 2;
        const G_v   = NdotV / (NdotV * (1 - k) + k);
        const G_l   = NdotL / (NdotL * (1 - k) + k);
        const G_vis = G_v * G_l * VdotH / (NdotH * NdotV);
        const Fc    = Math.pow(1 - VdotH, 5);
        A += G_vis * (1 - Fc);
        B += G_vis * Fc;
      }
      const base = (py * outW + px) * 4;
      out[base+0] = A / samples;
      out[base+1] = B / samples;
      out[base+2] = 0;
      out[base+3] = 1;
    }
  }
  return out;
}

function encodeF16(v: number): number {
  const f32 = new Float32Array([v]);
  const u32 = new Uint32Array(f32.buffer)[0];
  const sign     = (u32 >> 31) & 1;
  const exponent = (u32 >> 23) & 0xff;
  const mantissa = u32 & 0x7fffff;
  if (exponent === 0xff) return (sign << 15) | 0x7c00 | (mantissa ? 1 : 0);
  if (exponent === 0)    return (sign << 15);
  const e16 = exponent - 127 + 15;
  if (e16 >= 0x1f) return (sign << 15) | 0x7c00;
  if (e16 <= 0)    return (sign << 15);
  return (sign << 15) | (e16 << 10) | (mantissa >> 13);
}

function toF16(src: Float32Array): Uint16Array {
  const dst = new Uint16Array(src.length);
  for (let i = 0; i < src.length; i++) dst[i] = encodeF16(src[i]);
  return dst;
}

const _brdfCache = new WeakMap<GPUDevice, GPUTexture>();

function getOrCreateBrdfLut(device: GPUDevice): GPUTexture {
  const cached = _brdfCache.get(device);
  if (cached) return cached;
  const data = toF16(computeBrdfLutData(64, 64, 512));
  const tex  = device.createTexture({
    label: 'IBL BRDF LUT', size: { width: 64, height: 64 },
    format: 'rgba16float',
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
  });
  device.queue.writeTexture(
    { texture: tex },
    data as unknown as GPUAllowSharedBufferSource,
    { bytesPerRow: 64 * 8 },
    { width: 64, height: 64 },
  );
  _brdfCache.set(device, tex);
  return tex;
}

// ---- Compute pipeline cache (compiled once per device) ----------------------

interface IblPipelines {
  irrPipeline : GPUComputePipeline;
  pfPipeline  : GPUComputePipeline;
  bgl0        : GPUBindGroupLayout;  // uniform + sky_tex + sky_samp
  bgl1        : GPUBindGroupLayout;  // write-only storage texture
  sampler     : GPUSampler;
}

const _pipelineCache = new WeakMap<GPUDevice, IblPipelines>();

function getOrCreatePipelines(device: GPUDevice): IblPipelines {
  const cached = _pipelineCache.get(device);
  if (cached) return cached;

  const bgl0 = device.createBindGroupLayout({
    label: 'IblBGL0',
    entries: [
      { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer:  { type: 'uniform' } },
      { binding: 1, visibility: GPUShaderStage.COMPUTE, texture: { sampleType: 'float' } },
      { binding: 2, visibility: GPUShaderStage.COMPUTE, sampler: { type: 'filtering' } },
    ],
  });

  const bgl1 = device.createBindGroupLayout({
    label: 'IblBGL1',
    entries: [{
      binding: 0, visibility: GPUShaderStage.COMPUTE,
      storageTexture: { access: 'write-only', format: 'rgba16float', viewDimension: '2d' },
    }],
  });

  const layout = device.createPipelineLayout({ bindGroupLayouts: [bgl0, bgl1] });
  const module = device.createShaderModule({ label: 'IblCompute', code: iblWgsl });

  const irrPipeline = device.createComputePipeline({
    label: 'IblIrradiancePipeline', layout,
    compute: { module, entryPoint: 'cs_irradiance' },
  });
  const pfPipeline = device.createComputePipeline({
    label: 'IblPrefilterPipeline', layout,
    compute: { module, entryPoint: 'cs_prefilter' },
  });
  const sampler = device.createSampler({
    magFilter: 'linear', minFilter: 'linear',
    addressModeU: 'repeat', addressModeV: 'clamp-to-edge',
  });

  const pipelines = { irrPipeline, pfPipeline, bgl0, bgl1, sampler };
  _pipelineCache.set(device, pipelines);
  return pipelines;
}

// ---- Public API -------------------------------------------------------------

// Samples skyTexture directly on the GPU — no CPU-side HDR data needed.
// Both the irradiance and prefiltered outputs are ready by the time the
// returned Promise resolves.
export async function computeIblGpu(
  device     : GPUDevice,
  skyTexture : GPUTexture,
  exposure   = 0.2,
): Promise<IblTextures> {
  const IRR_W = 64, IRR_H = 32;
  const PF_W  = 64, PF_H  = 32;

  const { irrPipeline, pfPipeline, bgl0, bgl1, sampler } = getOrCreatePipelines(device);

  // Output textures need STORAGE_BINDING (written by compute) + TEXTURE_BINDING (read by lighting).
  const irradiance = device.createTexture({
    label: 'IBL Irradiance',
    size:  { width: IRR_W, height: IRR_H },
    format: 'rgba16float',
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING,
  });

  const prefiltered = device.createTexture({
    label: 'IBL Prefiltered',
    size:  { width: PF_W, height: PF_H, depthOrArrayLayers: IBL_LEVELS },
    format: 'rgba16float',
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING,
  });

  // One uniform buffer per dispatch (roughness value differs across prefiltered levels).
  const makeUniformBuf = (roughness: number) => {
    const buf = device.createBuffer({
      size: 16, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(buf, 0, new Float32Array([exposure, roughness, 0, 0]));
    return buf;
  };

  const irrUniform  = makeUniformBuf(0.0);
  const pfUniforms  = ROUGHNESSES.map(r => makeUniformBuf(r));

  const skyView = skyTexture.createView();

  const makeBG0 = (uniformBuf: GPUBuffer) => device.createBindGroup({
    layout: bgl0,
    entries: [
      { binding: 0, resource: { buffer: uniformBuf } },
      { binding: 1, resource: skyView },
      { binding: 2, resource: sampler },
    ],
  });

  const makeBG1 = (view: GPUTextureView) => device.createBindGroup({
    layout: bgl1, entries: [{ binding: 0, resource: view }],
  });

  const irrBG0  = makeBG0(irrUniform);
  const pfBG0s  = pfUniforms.map(makeBG0);
  const irrBG1  = makeBG1(irradiance.createView());
  const pfBG1s  = Array.from({ length: IBL_LEVELS }, (_, l) =>
    makeBG1(prefiltered.createView({ dimension: '2d', baseArrayLayer: l, arrayLayerCount: 1 })),
  );

  const encoder = device.createCommandEncoder({ label: 'IblComputeEncoder' });
  const pass    = encoder.beginComputePass({ label: 'IblComputePass' });

  pass.setPipeline(irrPipeline);
  pass.setBindGroup(0, irrBG0);
  pass.setBindGroup(1, irrBG1);
  pass.dispatchWorkgroups(Math.ceil(IRR_W / 8), Math.ceil(IRR_H / 8));

  pass.setPipeline(pfPipeline);
  for (let l = 0; l < IBL_LEVELS; l++) {
    pass.setBindGroup(0, pfBG0s[l]);
    pass.setBindGroup(1, pfBG1s[l]);
    pass.dispatchWorkgroups(Math.ceil(PF_W / 8), Math.ceil(PF_H / 8));
  }

  pass.end();
  device.queue.submit([encoder.finish()]);
  await device.queue.onSubmittedWorkDone();

  // Uniform buffers no longer needed after GPU work is done.
  irrUniform.destroy();
  pfUniforms.forEach(b => b.destroy());

  const brdfLut         = getOrCreateBrdfLut(device);
  const irradianceView  = irradiance.createView();
  const prefilteredView = prefiltered.createView({ dimension: '2d-array' });
  const brdfLutView     = brdfLut.createView();

  return {
    irradiance, prefiltered, brdfLut,
    irradianceView, prefilteredView, brdfLutView,
    levels: IBL_LEVELS,
    destroy() {
      irradiance.destroy();
      prefiltered.destroy();
      // brdfLut is device-cached — do not destroy here.
    },
  };
}
