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
//   cascadeDepthRanges(4) = 352 bytes
const LIGHT_SIZE = 352;

export class LightingPass extends RenderPass {
  readonly name = 'LightingPass';

  readonly hdrTexture: GPUTexture;
  readonly hdrView: GPUTextureView;

  private _pipeline: GPURenderPipeline;
  private _sceneBindGroup: GPUBindGroup;
  private _gbufferBindGroup: GPUBindGroup;
  private _iblBindGroup: GPUBindGroup;
  private _aoBindGroup: GPUBindGroup;    // group 3: AO + SSGI combined
  private _cameraBuffer: GPUBuffer;
  private _lightBuffer: GPUBuffer;
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
    iblBindGroup: GPUBindGroup,
    aoBindGroup: GPUBindGroup,
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
    this._iblBindGroup = iblBindGroup;
    this._aoBindGroup = aoBindGroup;
    this._cameraBuffer = cameraBuffer;
    this._lightBuffer = lightBuffer;
    this._defaultCloudShadow = defaultCloudShadow;
    this._defaultSsgi = defaultSsgi;
    this._device = device;
    this._aoBGL = aoBGL;
    this._aoView = aoView;
    this._aoSampler = aoSampler;
    this._ssgiSampler = ssgiSampler;
  }

  static create(ctx: RenderContext, gbuffer: GBuffer, shadowPass: ShadowPass, ibl: IblTextures, aoView: GPUTextureView, cloudShadowView?: GPUTextureView): LightingPass {
    const { device, width, height } = ctx;

    const hdrTexture = device.createTexture({
      label: 'HDR Texture',
      size: { width, height },
      format: HDR_FORMAT,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
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
    const equirectSampler = device.createSampler({
      label: 'IBLEquirectSampler',
      magFilter: 'linear', minFilter: 'linear',
      addressModeU: 'repeat', addressModeV: 'clamp-to-edge',
    });
    const lutSampler = device.createSampler({
      label: 'IBLLutSampler',
      magFilter: 'linear', minFilter: 'linear',
      addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge',
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

    const iblBGL = device.createBindGroupLayout({
      label: 'LightIBLBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float', viewDimension: '2d-array' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
        { binding: 4, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    // Group 3: AO (binding 0–1) + SSGI (binding 2–3) — merged to stay within 4-group limit
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

    const iblBindGroup = device.createBindGroup({
      layout: iblBGL,
      entries: [
        { binding: 0, resource: ibl.irradianceView },
        { binding: 1, resource: ibl.prefilteredView },
        { binding: 2, resource: ibl.brdfLutView },
        { binding: 3, resource: equirectSampler },
        { binding: 4, resource: lutSampler },
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
      layout: device.createPipelineLayout({ bindGroupLayouts: [sceneBGL, gbufferBGL, iblBGL, aoBGL] }),
      vertex: { module: shaderModule, entryPoint: 'vs_main' },
      fragment: {
        module: shaderModule, entryPoint: 'fs_main',
        targets: [{ format: HDR_FORMAT }],
      },
      primitive: { topology: 'triangle-list' },
    });

    return new LightingPass(
      hdrTexture, hdrView, pipeline,
      sceneBindGroup, gbufferBindGroup, iblBindGroup, aoBindGroup,
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
    ctx.queue.writeBuffer(this._cameraBuffer, 0, data.buffer as ArrayBuffer);
  }

  updateLight(ctx: RenderContext, dir: { x: number; y: number; z: number }, color: { x: number; y: number; z: number }, intensity: number, cascades: CascadeData[], shadowsEnabled = true, debugCascades = false, shadowSoftness = 0.02): void {
    const data = new Float32Array(LIGHT_SIZE / 4);
    let o = 0;
    data[o++] = dir.x; data[o++] = dir.y; data[o++] = dir.z;
    data[o++] = intensity;
    data[o++] = color.x; data[o++] = color.y; data[o++] = color.z;
    new Uint32Array(data.buffer)[o++] = cascades.length;
    for (let i = 0; i < 4; i++) {
      if (i < cascades.length) data.set(cascades[i].lightViewProj.data, o);
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
    ctx.queue.writeBuffer(this._lightBuffer, 0, data.buffer as ArrayBuffer);
  }

  // Must be called after updateLight() each frame (updateLight overwrites the whole buffer).
  // Writes only 3 floats (12 bytes) to avoid clobbering shadowSoftness at offset 324.
  updateCloudShadow(ctx: RenderContext, originX: number, originZ: number, extent: number): void {
    const data = new Float32Array(3);
    data[0] = originX;
    data[1] = originZ;
    data[2] = extent;
    ctx.queue.writeBuffer(this._lightBuffer, 312, data.buffer as ArrayBuffer);
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
    pass.setBindGroup(2, this._iblBindGroup);
    pass.setBindGroup(3, this._aoBindGroup);
    pass.draw(3);
    pass.end();
  }

  destroy(): void {
    this.hdrTexture.destroy();
    this._cameraBuffer.destroy();
    this._lightBuffer.destroy();
    this._defaultCloudShadow?.destroy();
    this._defaultSsgi?.destroy();
  }
}
