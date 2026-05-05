import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import type { GBuffer } from '../gbuffer.js';
import type { ShadowPass } from './shadow_pass.js';
import type { Mat4 } from '../../math/mat4.js';
import type { CascadeData } from '../../engine/components/directional_light.js';
import type { IblTextures } from '../../assets/ibl.js';
import lightingWgsl from '../../shaders/lighting.wgsl?raw';

export const HDR_FORMAT: GPUTextureFormat = 'rgba16float';

// CameraUniforms: 4 mat4 (256 bytes) + vec3+f32 near (16 bytes) + f32 far + pad (8 bytes) = 280 bytes
const CAMERA_SIZE = 64 * 4 + 16 + 16;
// LightUniforms: dir(3)+intensity(1)+color(3)+cascadeCount(1)+4*mat4(256)+cascadeSplits(4)+
//   shadowsEnabled(1)+debugCascades(1)+cloudShadowOrigin(2)+cloudShadowExtent(1)+shadowSoftness(1)+
//   _pad(2)+cascadeDepthRanges(4)+cascadeTexelSizes(4) = 368 bytes
const LIGHT_SIZE = 368;

export class LightingPass extends RenderPass {
  readonly name = 'LightingPass';

  readonly hdrTexture   : GPUTexture;
  readonly hdrView      : GPUTextureView;
  // Exposed so other passes (e.g. GodrayPass) can share the same GPU buffers
  // without duplicating per-frame writes.
  readonly cameraBuffer : GPUBuffer;
  readonly lightBuffer  : GPUBuffer;

  private _pipeline: GPURenderPipeline;
  private _sceneBindGroup: GPUBindGroup;
  private _gbufferBindGroup: GPUBindGroup;
  private _aoBindGroup : GPUBindGroup;    // group 2: AO + SSGI combined
  private _iblBindGroup: GPUBindGroup;   // group 3: irradiance cube, prefilter cube, BRDF LUT
  private _defaultCloudShadow: GPUTexture | null;
  private _defaultSsgi: GPUTexture | null;

  // Retained for updateSSGI() bind group recreation
  private _device: GPUDevice;
  private _aoBGL: GPUBindGroupLayout;
  private _aoView: GPUTextureView;
  private _aoSampler: GPUSampler;
  private _ssgiSampler: GPUSampler;

  private constructor(
    hdrTexture: GPUTexture,
    hdrView: GPUTextureView,
    pipeline: GPURenderPipeline,
    sceneBindGroup: GPUBindGroup,
    gbufferBindGroup: GPUBindGroup,
    aoBindGroup: GPUBindGroup,
    iblBindGroup: GPUBindGroup,
    cameraBuffer: GPUBuffer,
    lightBuffer: GPUBuffer,
    defaultCloudShadow: GPUTexture | null,
    defaultSsgi: GPUTexture | null,
    device: GPUDevice,
    aoBGL: GPUBindGroupLayout,
    aoView: GPUTextureView,
    aoSampler: GPUSampler,
    ssgiSampler: GPUSampler,
  ) {
    super();
    this.hdrTexture = hdrTexture;
    this.hdrView = hdrView;
    this._pipeline = pipeline;
    this._sceneBindGroup = sceneBindGroup;
    this._gbufferBindGroup = gbufferBindGroup;
    this._aoBindGroup = aoBindGroup;
    this._iblBindGroup = iblBindGroup;
    this.cameraBuffer = cameraBuffer;
    this.lightBuffer  = lightBuffer;
    this._defaultCloudShadow = defaultCloudShadow;
    this._defaultSsgi = defaultSsgi;
    this._device = device;
    this._aoBGL = aoBGL;
    this._aoView = aoView;
    this._aoSampler = aoSampler;
    this._ssgiSampler = ssgiSampler;
  }

  static create(ctx: RenderContext, gbuffer: GBuffer, shadowPass: ShadowPass, aoView: GPUTextureView, cloudShadowView?: GPUTextureView, iblTextures?: IblTextures): LightingPass {
    const { device, width, height } = ctx;

    const hdrTexture = device.createTexture({
      label: 'HDR Texture',
      size: { width, height },
      format: HDR_FORMAT,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
    });
    const hdrView = hdrTexture.createView();

    const cameraBuffer = device.createBuffer({
      label: 'LightCameraBuffer', size: CAMERA_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const lightBuffer = device.createBuffer({
      label: 'LightBuffer', size: LIGHT_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const comparisonSampler = device.createSampler({
      label: 'ShadowSampler', compare: 'less-equal',
      magFilter: 'linear', minFilter: 'linear',
    });
    const linearSampler = device.createSampler({
      label: 'GBufferLinearSampler', magFilter: 'linear', minFilter: 'linear',
    });
    const aoSampler = device.createSampler({
      label: 'AoSampler',
      magFilter: 'linear', minFilter: 'linear',
      addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge',
    });
    const ssgiSampler = device.createSampler({
      label: 'SsgiSampler',
      magFilter: 'linear', minFilter: 'linear',
      addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge',
    });

    const sceneBGL = device.createBindGroupLayout({
      label: 'LightSceneBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
      ],
    });

    const gbufferBGL = device.createBindGroupLayout({
      label: 'LightGBufferBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth', viewDimension: '2d-array' } },
        { binding: 4, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'comparison' } },
        { binding: 5, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
        { binding: 6, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
      ],
    });

    // Default 1×1 white cloud shadow texture — transmittance 1.0 = no shadow
    const defaultCloudShadow = device.createTexture({
      label: 'DefaultCloudShadow', size: { width: 1, height: 1 },
      format: 'r8unorm',
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });
    device.queue.writeTexture({ texture: defaultCloudShadow }, new Uint8Array([255]),
      { bytesPerRow: 1 }, { width: 1, height: 1 });
    const resolvedCloudShadowView = cloudShadowView ?? defaultCloudShadow.createView();

    // Group 2: AO (binding 0–1) + SSGI (binding 2–3) — merged to stay within 4-group limit
    const aoBGL = device.createBindGroupLayout({
      label: 'LightAoBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    // Default 1×1 black SSGI texture — zero indirect until SSGIPass is wired in
    const defaultSsgi = device.createTexture({
      label: 'DefaultSsgi', size: { width: 1, height: 1 },
      format: HDR_FORMAT,
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });

    // Group 3: IBL — irradiance cube, pre-filtered cube, BRDF LUT, shared sampler
    const iblBGL = device.createBindGroupLayout({
      label: 'LightIblBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float', viewDimension: 'cube' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float', viewDimension: 'cube' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });
    const iblSampler = device.createSampler({
      label: 'IblSampler',
      magFilter: 'linear', minFilter: 'linear', mipmapFilter: 'linear',
      addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge', addressModeW: 'clamp-to-edge',
    });
    // 1×1 black cube fallback used when IBL textures are not yet available.
    const defaultIblCube = device.createTexture({
      label: 'DefaultIblCube', size: { width: 1, height: 1, depthOrArrayLayers: 6 },
      format: 'rgba16float',
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });
    const defaultIblView    = defaultIblCube.createView({ dimension: 'cube' });
    const defaultBrdfLut    = device.createTexture({
      label: 'DefaultBrdfLut', size: { width: 1, height: 1 },
      format: 'rgba16float',
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });
    const iblBindGroup = device.createBindGroup({
      label: 'LightIblBG', layout: iblBGL,
      entries: [
        { binding: 0, resource: iblTextures?.irradianceView  ?? defaultIblView },
        { binding: 1, resource: iblTextures?.prefilteredView ?? defaultIblView },
        { binding: 2, resource: iblTextures?.brdfLutView     ?? defaultBrdfLut.createView() },
        { binding: 3, resource: iblSampler },
      ],
    });
    defaultIblCube.destroy();
    defaultBrdfLut.destroy();

    const sceneBindGroup = device.createBindGroup({
      layout: sceneBGL,
      entries: [
        { binding: 0, resource: { buffer: cameraBuffer } },
        { binding: 1, resource: { buffer: lightBuffer } },
      ],
    });

    const gbufferBindGroup = device.createBindGroup({
      layout: gbufferBGL,
      entries: [
        { binding: 0, resource: gbuffer.albedoRoughnessView },
        { binding: 1, resource: gbuffer.normalMetallicView },
        { binding: 2, resource: gbuffer.depthView },
        { binding: 3, resource: shadowPass.shadowMapView },
        { binding: 4, resource: comparisonSampler },
        { binding: 5, resource: linearSampler },
        { binding: 6, resource: resolvedCloudShadowView },
      ],
    });

    const aoBindGroup = device.createBindGroup({
      label: 'LightAoBG', layout: aoBGL,
      entries: [
        { binding: 0, resource: aoView },
        { binding: 1, resource: aoSampler },
        { binding: 2, resource: defaultSsgi.createView() },
        { binding: 3, resource: ssgiSampler },
      ],
    });

    const shaderModule = device.createShaderModule({ label: 'LightingShader', code: lightingWgsl });

    const pipeline = device.createRenderPipeline({
      label: 'LightingPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [sceneBGL, gbufferBGL, aoBGL, iblBGL] }),
      vertex: { module: shaderModule, entryPoint: 'vs_main' },
      fragment: {
        module: shaderModule, entryPoint: 'fs_main',
        targets: [{ format: HDR_FORMAT }],
      },
      primitive: { topology: 'triangle-list' },
    });

    return new LightingPass(
      hdrTexture, hdrView, pipeline,
      sceneBindGroup, gbufferBindGroup, aoBindGroup, iblBindGroup,
      cameraBuffer, lightBuffer,
      cloudShadowView ? null : defaultCloudShadow,
      defaultSsgi, device, aoBGL, aoView, aoSampler, ssgiSampler,
    );
  }

  // Wire in the live SSGIPass result; recreates the combined AO+SSGI bind group.
  updateSSGI(ssgiView: GPUTextureView): void {
    this._aoBindGroup = this._device.createBindGroup({
      label: 'LightAoBG', layout: this._aoBGL,
      entries: [
        { binding: 0, resource: this._aoView },
        { binding: 1, resource: this._aoSampler },
        { binding: 2, resource: ssgiView },
        { binding: 3, resource: this._ssgiSampler },
      ],
    });
  }

  updateCamera(ctx: RenderContext, view: Mat4, proj: Mat4, viewProj: Mat4, invViewProj: Mat4, camPos: { x: number; y: number; z: number }, near: number, far: number): void {
    const data = new Float32Array(CAMERA_SIZE / 4);
    data.set(view.data,         0);
    data.set(proj.data,        16);
    data.set(viewProj.data,    32);
    data.set(invViewProj.data, 48);
    data[64] = camPos.x; data[65] = camPos.y; data[66] = camPos.z;
    data[67] = near; data[68] = far;
    ctx.queue.writeBuffer(this.cameraBuffer, 0, data.buffer as ArrayBuffer);
  }

  updateLight(ctx: RenderContext, dir: { x: number; y: number; z: number }, color: { x: number; y: number; z: number }, intensity: number, cascades: CascadeData[], shadowsEnabled = true, debugCascades = false, shadowSoftness = 0.02): void {
    const data = new Float32Array(LIGHT_SIZE / 4);
    let o = 0;
    data[o++] = dir.x; data[o++] = dir.y; data[o++] = dir.z;
    data[o++] = intensity;
    data[o++] = color.x; data[o++] = color.y; data[o++] = color.z;
    new Uint32Array(data.buffer)[o++] = cascades.length;
    for (let i = 0; i < 4; i++) {
      if (i < cascades.length) {
        data.set(cascades[i].lightViewProj.data, o);
      }
      o += 16;
    }
    for (let i = 0; i < 4; i++) {
      data[o++] = i < cascades.length ? cascades[i].splitFar : 1e9;
    }
    // o=76, offset 304: shadowsEnabled | o=77, offset 308: debugCascades
    new Uint32Array(data.buffer)[o]   = shadowsEnabled ? 1 : 0;
    new Uint32Array(data.buffer)[o+1] = debugCascades  ? 1 : 0;
    // o=78..80 (offsets 312..320): cloud shadow params — written by updateCloudShadow()
    // o=81 (offset 324): shadowSoftness — PCSS light-size factor
    data[81] = shadowSoftness;
    // floats 82-83 (offsets 328-335): implicit WGSL padding before vec4 alignment
    // floats 84-87 (offsets 336-351): cascadeDepthRanges — vec4<f32> requires 16-byte align
    for (let i = 0; i < 4; i++) {
      data[84 + i] = i < cascades.length ? cascades[i].depthRange : 1.0;
    }
    // floats 88-91 (offsets 352-367): cascadeTexelSizes — world-space size of one shadow texel
    for (let i = 0; i < 4; i++) {
      data[88 + i] = i < cascades.length ? cascades[i].texelWorldSize : 1.0;
    }
    ctx.queue.writeBuffer(this.lightBuffer, 0, data.buffer as ArrayBuffer);
  }

  // Must be called after updateLight() each frame (updateLight overwrites the whole buffer).
  // Writes only 3 floats (12 bytes) to avoid clobbering shadowSoftness at offset 324.
  updateCloudShadow(ctx: RenderContext, originX: number, originZ: number, extent: number): void {
    const data = new Float32Array(3);
    data[0] = originX;
    data[1] = originZ;
    data[2] = extent;
    ctx.queue.writeBuffer(this.lightBuffer, 312, data.buffer as ArrayBuffer);
  }

  execute(encoder: GPUCommandEncoder, _ctx: RenderContext): void {
    const pass = encoder.beginRenderPass({
      label: 'LightingPass',
      colorAttachments: [
        { view: this.hdrView, loadOp: 'load', storeOp: 'store' },
      ],
    });
    pass.setPipeline(this._pipeline);
    pass.setBindGroup(0, this._sceneBindGroup);
    pass.setBindGroup(1, this._gbufferBindGroup);
    pass.setBindGroup(2, this._aoBindGroup);
    pass.setBindGroup(3, this._iblBindGroup);
    pass.draw(3);
    pass.end();
  }

  destroy(): void {
    this.hdrTexture.destroy();
    this.cameraBuffer.destroy();
    this.lightBuffer.destroy();
    this._defaultCloudShadow?.destroy();
    this._defaultSsgi?.destroy();
  }
}
