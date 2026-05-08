import iblWgsl from '../shaders/ibl.wgsl?raw';
/** Number of mip levels in the prefiltered specular cube (one per roughness step). */
export const IBL_LEVELS = 5;
/** Base mip size of each face of the prefiltered specular cube. */
export const CUBE_SIZE = 128; // prefilter base mip (mip 0 = 128, mip 4 = 8)
/** Face size of each face of the irradiance cube. */
export const IRR_SIZE = 32; // irradiance cube face size
const ROUGHNESSES = [0, 0.25, 0.5, 0.75, 1.0];
// ---- BRDF LUT (view-independent, computed once on the CPU and cached) -------
const PI = Math.PI;
function radicalInverse(n) {
    let bits = n >>> 0;
    bits = ((bits << 16) | (bits >>> 16)) >>> 0;
    bits = (((bits & 0x55555555) << 1) | ((bits >>> 1) & 0x55555555)) >>> 0;
    bits = (((bits & 0x33333333) << 2) | ((bits >>> 2) & 0x33333333)) >>> 0;
    bits = (((bits & 0x0f0f0f0f) << 4) | ((bits >>> 4) & 0x0f0f0f0f)) >>> 0;
    bits = (((bits & 0x00ff00ff) << 8) | ((bits >>> 8) & 0x00ff00ff)) >>> 0;
    return bits * 2.3283064365386963e-10;
}
function computeBrdfLutData(outW, outH, samples) {
    const out = new Float32Array(outW * outH * 4);
    for (let py = 0; py < outH; py++) {
        for (let px = 0; px < outW; px++) {
            const NdotV = (px + 0.5) / outW;
            const roughness = (py + 0.5) / outH;
            const a = roughness * roughness;
            const a2 = a * a;
            const Vx = Math.sqrt(1 - NdotV * NdotV);
            const Vz = NdotV;
            let A = 0, B = 0;
            for (let i = 0; i < samples; i++) {
                const xi1 = (i + 0.5) / samples;
                const xi2 = radicalInverse(i);
                const cosT2 = (1 - xi2) / (1 + (a2 - 1) * xi2);
                const cosT = Math.sqrt(cosT2);
                const sinT = Math.sqrt(Math.max(0, 1 - cosT2));
                const phiH = 2 * PI * xi1;
                const Hx = sinT * Math.cos(phiH);
                const Hz = cosT;
                const VdotH = Vx * Hx + Vz * Hz;
                if (VdotH <= 0) {
                    continue;
                }
                const Lz = 2 * VdotH * Hz - Vz;
                const NdotL = Math.max(0, Lz);
                const NdotH = Math.max(0, cosT);
                if (NdotL <= 0) {
                    continue;
                }
                const k = a2 / 2;
                const G_v = NdotV / (NdotV * (1 - k) + k);
                const G_l = NdotL / (NdotL * (1 - k) + k);
                const G_vis = G_v * G_l * VdotH / (NdotH * NdotV);
                const Fc = Math.pow(1 - VdotH, 5);
                A += G_vis * (1 - Fc);
                B += G_vis * Fc;
            }
            const base = (py * outW + px) * 4;
            out[base + 0] = A / samples;
            out[base + 1] = B / samples;
            out[base + 2] = 0;
            out[base + 3] = 1;
        }
    }
    return out;
}
function encodeF16(v) {
    const f32 = new Float32Array([v]);
    const u32 = new Uint32Array(f32.buffer)[0];
    const sign = (u32 >> 31) & 1;
    const exponent = (u32 >> 23) & 0xff;
    const mantissa = u32 & 0x7fffff;
    if (exponent === 0xff) {
        return (sign << 15) | 0x7c00 | (mantissa ? 1 : 0);
    }
    if (exponent === 0) {
        return (sign << 15);
    }
    const e16 = exponent - 127 + 15;
    if (e16 >= 0x1f) {
        return (sign << 15) | 0x7c00;
    }
    if (e16 <= 0) {
        return (sign << 15);
    }
    return (sign << 15) | (e16 << 10) | (mantissa >> 13);
}
function toF16(src) {
    const dst = new Uint16Array(src.length);
    for (let i = 0; i < src.length; i++) {
        dst[i] = encodeF16(src[i]);
    }
    return dst;
}
const _brdfCache = new WeakMap();
function getOrCreateBrdfLut(device) {
    const cached = _brdfCache.get(device);
    if (cached) {
        return cached;
    }
    const data = toF16(computeBrdfLutData(64, 64, 512));
    const tex = device.createTexture({
        label: 'IBL BRDF LUT', size: { width: 64, height: 64 },
        format: 'rgba16float',
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });
    device.queue.writeTexture({ texture: tex }, data, { bytesPerRow: 64 * 8 }, { width: 64, height: 64 });
    _brdfCache.set(device, tex);
    return tex;
}
const _pipelineCache = new WeakMap();
function getOrCreatePipelines(device) {
    const cached = _pipelineCache.get(device);
    if (cached) {
        return cached;
    }
    const bgl0 = device.createBindGroupLayout({
        label: 'IblBGL0',
        entries: [
            { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
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
/**
 * Bakes IBL cube textures from an equirectangular sky texture on the GPU.
 *
 * Computes the diffuse irradiance cube (6 faces at {@link IRR_SIZE}) and the
 * GGX-prefiltered specular cube ({@link IBL_LEVELS} mips at {@link CUBE_SIZE}),
 * then attaches the device-cached split-sum BRDF LUT. Dispatches
 * 6 + 6 × IBL_LEVELS compute groups and awaits GPU completion before returning.
 *
 * @param device - WebGPU device used to create textures and dispatch compute.
 * @param skyTexture - Equirectangular HDR sky texture sampled as the radiance source.
 * @param exposure - Linear scale applied to the sky radiance during convolution.
 * @returns The baked IBL textures; caller must `destroy()` to release the cubes.
 */
export async function computeIblGpu(device, skyTexture, exposure = 0.2) {
    const { irrPipeline, pfPipeline, bgl0, bgl1, sampler } = getOrCreatePipelines(device);
    // Irradiance: 32×32 per face, 6 faces, no mip levels needed (it's already very blurred).
    const irradiance = device.createTexture({
        label: 'IBL Irradiance',
        size: { width: IRR_SIZE, height: IRR_SIZE, depthOrArrayLayers: 6 },
        format: 'rgba16float',
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING,
    });
    // Prefiltered: 128×128 per face, 6 faces, IBL_LEVELS mip levels (roughness 0→1).
    const prefiltered = device.createTexture({
        label: 'IBL Prefiltered',
        size: { width: CUBE_SIZE, height: CUBE_SIZE, depthOrArrayLayers: 6 },
        mipLevelCount: IBL_LEVELS,
        format: 'rgba16float',
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING,
    });
    const makeUniformBuf = (roughness, face) => {
        const buf = device.createBuffer({
            size: 16, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        device.queue.writeBuffer(buf, 0, new Float32Array([exposure, roughness, face, 0]));
        return buf;
    };
    const skyView = skyTexture.createView();
    const makeBG0 = (uniformBuf) => device.createBindGroup({
        layout: bgl0,
        entries: [
            { binding: 0, resource: { buffer: uniformBuf } },
            { binding: 1, resource: skyView },
            { binding: 2, resource: sampler },
        ],
    });
    const makeBG1 = (view) => device.createBindGroup({
        layout: bgl1, entries: [{ binding: 0, resource: view }],
    });
    // Create uniform buffers and face views: 6 for irradiance, 6×IBL_LEVELS for prefilter.
    const irrUniforms = Array.from({ length: 6 }, (_, f) => makeUniformBuf(0.0, f));
    const pfUniforms = ROUGHNESSES.flatMap((r, _l) => Array.from({ length: 6 }, (_, f) => makeUniformBuf(r, f)));
    const irrBG0s = irrUniforms.map(makeBG0);
    const pfBG0s = pfUniforms.map(makeBG0);
    const irrBG1s = Array.from({ length: 6 }, (_, f) => makeBG1(irradiance.createView({
        dimension: '2d', baseArrayLayer: f, arrayLayerCount: 1,
    })));
    const pfBG1s = Array.from({ length: IBL_LEVELS * 6 }, (_, i) => {
        const l = Math.floor(i / 6);
        const f = i % 6;
        return makeBG1(prefiltered.createView({
            dimension: '2d',
            baseMipLevel: l, mipLevelCount: 1,
            baseArrayLayer: f, arrayLayerCount: 1,
        }));
    });
    const encoder = device.createCommandEncoder({ label: 'IblComputeEncoder' });
    const pass = encoder.beginComputePass({ label: 'IblComputePass' });
    // Irradiance: 6 face dispatches.
    pass.setPipeline(irrPipeline);
    for (let f = 0; f < 6; f++) {
        pass.setBindGroup(0, irrBG0s[f]);
        pass.setBindGroup(1, irrBG1s[f]);
        pass.dispatchWorkgroups(Math.ceil(IRR_SIZE / 8), Math.ceil(IRR_SIZE / 8));
    }
    // Prefiltered: IBL_LEVELS roughness levels × 6 faces.
    pass.setPipeline(pfPipeline);
    for (let l = 0; l < IBL_LEVELS; l++) {
        const mipSize = CUBE_SIZE >> l;
        for (let f = 0; f < 6; f++) {
            pass.setBindGroup(0, pfBG0s[l * 6 + f]);
            pass.setBindGroup(1, pfBG1s[l * 6 + f]);
            pass.dispatchWorkgroups(Math.ceil(mipSize / 8), Math.ceil(mipSize / 8));
        }
    }
    pass.end();
    device.queue.submit([encoder.finish()]);
    await device.queue.onSubmittedWorkDone();
    irrUniforms.forEach(b => b.destroy());
    pfUniforms.forEach(b => b.destroy());
    const brdfLut = getOrCreateBrdfLut(device);
    const irradianceView = irradiance.createView({ dimension: 'cube' });
    const prefilteredView = prefiltered.createView({ dimension: 'cube' });
    const brdfLutView = brdfLut.createView();
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
