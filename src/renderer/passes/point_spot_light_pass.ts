import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import type { GBuffer } from '../gbuffer.js';
import type { Mat4 } from '../../math/mat4.js';
import type { PointLight } from '../../engine/components/point_light.js';
import type { SpotLight } from '../../engine/components/spot_light.js';
import type { PointSpotShadowPass } from './point_spot_shadow_pass.js';
import { MAX_POINT_LIGHTS, MAX_SPOT_LIGHTS, MAX_SHADOW_POINT_LIGHTS, MAX_SHADOW_SPOT_LIGHTS } from './point_spot_shadow_pass.js';
import { HDR_FORMAT } from './lighting_pass.js';
import lightingWgsl from '../../shaders/point_spot_lighting.wgsl?raw';

// CameraUniforms: same layout as LightingPass (288 bytes)
const CAMERA_SIZE = 64 * 4 + 16 + 16;

// LightCounts: numPoint(4) + numSpot(4) = 8 bytes
const LIGHT_COUNTS_SIZE = 8;

// Per-light buffer sizes (bytes)
const POINT_STRIDE = 48;   // matches PointLightGpu in shader
const SPOT_STRIDE  = 128;  // matches SpotLightGpu in shader

export class PointSpotLightPass extends RenderPass {
  readonly name = 'PointSpotLightPass';

  private _pipeline        : GPURenderPipeline;
  private _cameraBG        : GPUBindGroup;
  private _gbufferBG       : GPUBindGroup;
  private _lightBG         : GPUBindGroup;
  private _shadowBG        : GPUBindGroup;
  private _cameraBuffer    : GPUBuffer;
  private _lightCountsBuffer: GPUBuffer;
  private _pointBuffer     : GPUBuffer;
  private _spotBuffer      : GPUBuffer;
  private _hdrView         : GPUTextureView;

  private constructor(
    pipeline        : GPURenderPipeline,
    cameraBG        : GPUBindGroup,
    gbufferBG       : GPUBindGroup,
    lightBG         : GPUBindGroup,
    shadowBG        : GPUBindGroup,
    cameraBuffer    : GPUBuffer,
    lightCountsBuffer: GPUBuffer,
    pointBuffer     : GPUBuffer,
    spotBuffer      : GPUBuffer,
    hdrView         : GPUTextureView,
  ) {
    super();
    this._pipeline         = pipeline;
    this._cameraBG         = cameraBG;
    this._gbufferBG        = gbufferBG;
    this._lightBG          = lightBG;
    this._shadowBG         = shadowBG;
    this._cameraBuffer     = cameraBuffer;
    this._lightCountsBuffer = lightCountsBuffer;
    this._pointBuffer      = pointBuffer;
    this._spotBuffer       = spotBuffer;
    this._hdrView          = hdrView;
  }

  static create(ctx: RenderContext, gbuffer: GBuffer, shadowPass: PointSpotShadowPass, hdrView: GPUTextureView): PointSpotLightPass {
    const { device } = ctx;

    const cameraBuffer = device.createBuffer({
      label: 'PSLCameraBuffer', size: CAMERA_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const lightCountsBuffer = device.createBuffer({
      label: 'PSLLightCounts', size: LIGHT_COUNTS_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const pointBuffer = device.createBuffer({
      label: 'PSLPointBuffer', size: MAX_POINT_LIGHTS * POINT_STRIDE,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    const spotBuffer = device.createBuffer({
      label: 'PSLSpotBuffer', size: MAX_SPOT_LIGHTS * SPOT_STRIDE,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    const linearSampler = device.createSampler({
      label: 'PSLLinearSampler',
      magFilter: 'linear', minFilter: 'linear',
      addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge',
    });
    const vsmSampler = device.createSampler({
      label: 'PSLVsmSampler',
      magFilter: 'linear', minFilter: 'linear',
      addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge', addressModeW: 'clamp-to-edge',
    });
    const projSampler = device.createSampler({
      label: 'PSLProjSampler',
      magFilter: 'linear', minFilter: 'linear',
      addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge',
    });

    // Bind group layouts
    const cameraBGL = device.createBindGroupLayout({
      label: 'PSLCameraBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
    });

    const gbufferBGL = device.createBindGroupLayout({
      label: 'PSLGBufferBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    const lightBGL = device.createBindGroupLayout({
      label: 'PSLLightBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'read-only-storage' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'read-only-storage' } },
      ],
    });

    const shadowBGL = device.createBindGroupLayout({
      label: 'PSLShadowBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float', viewDimension: 'cube-array' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float', viewDimension: '2d-array' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float', viewDimension: '2d-array' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
        { binding: 4, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    // Bind groups
    const cameraBG = device.createBindGroup({
      label: 'PSLCameraBG', layout: cameraBGL,
      entries: [{ binding: 0, resource: { buffer: cameraBuffer } }],
    });

    const gbufferBG = device.createBindGroup({
      label: 'PSLGBufferBG', layout: gbufferBGL,
      entries: [
        { binding: 0, resource: gbuffer.albedoRoughnessView },
        { binding: 1, resource: gbuffer.normalMetallicView },
        { binding: 2, resource: gbuffer.depthView },
        { binding: 3, resource: linearSampler },
      ],
    });

    const lightBG = device.createBindGroup({
      label: 'PSLLightBG', layout: lightBGL,
      entries: [
        { binding: 0, resource: { buffer: lightCountsBuffer } },
        { binding: 1, resource: { buffer: pointBuffer } },
        { binding: 2, resource: { buffer: spotBuffer } },
      ],
    });

    const shadowBG = device.createBindGroup({
      label: 'PSLShadowBG', layout: shadowBGL,
      entries: [
        { binding: 0, resource: shadowPass.pointVsmView },
        { binding: 1, resource: shadowPass.spotVsmView },
        { binding: 2, resource: shadowPass.projTexView },
        { binding: 3, resource: vsmSampler },
        { binding: 4, resource: projSampler },
      ],
    });

    const shaderModule = device.createShaderModule({ label: 'PointSpotLightShader', code: lightingWgsl });

    const pipeline = device.createRenderPipeline({
      label: 'PointSpotLightPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [cameraBGL, gbufferBGL, lightBGL, shadowBGL] }),
      vertex: { module: shaderModule, entryPoint: 'vs_main' },
      fragment: {
        module: shaderModule, entryPoint: 'fs_main',
        targets: [{
          format: HDR_FORMAT,
          blend: {
            color: { srcFactor: 'one', dstFactor: 'one', operation: 'add' },
            alpha: { srcFactor: 'one', dstFactor: 'one', operation: 'add' },
          },
        }],
      },
      primitive: { topology: 'triangle-list' },
    });

    return new PointSpotLightPass(
      pipeline, cameraBG, gbufferBG, lightBG, shadowBG,
      cameraBuffer, lightCountsBuffer, pointBuffer, spotBuffer,
      hdrView,
    );
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

  updateLights(ctx: RenderContext, pointLights: PointLight[], spotLights: SpotLight[]): void {
    // Light counts
    const counts = new Uint32Array([
      Math.min(pointLights.length, MAX_POINT_LIGHTS),
      Math.min(spotLights.length,  MAX_SPOT_LIGHTS),
    ]);
    ctx.queue.writeBuffer(this._lightCountsBuffer, 0, counts.buffer as ArrayBuffer);

    // Point lights — 48 bytes each (12 float/int32 words)
    const pointBuf = new ArrayBuffer(MAX_POINT_LIGHTS * POINT_STRIDE);
    const pf32 = new Float32Array(pointBuf);
    const pi32 = new Int32Array(pointBuf);
    let shadowPointIdx = 0;
    for (let i = 0; i < Math.min(pointLights.length, MAX_POINT_LIGHTS); i++) {
      const pl  = pointLights[i];
      const pos = pl.worldPosition();
      const b   = i * 12;
      pf32[b+0] = pos.x;   pf32[b+1] = pos.y;   pf32[b+2] = pos.z;
      pf32[b+3] = pl.radius;
      pf32[b+4] = pl.color.x; pf32[b+5] = pl.color.y; pf32[b+6] = pl.color.z;
      pf32[b+7] = pl.intensity;
      if (pl.castShadow && shadowPointIdx < MAX_SHADOW_POINT_LIGHTS) {
        pi32[b+8] = shadowPointIdx++;
      } else {
        pi32[b+8] = -1;
      }
      pi32[b+9] = 0; pi32[b+10] = 0; pi32[b+11] = 0;
    }
    ctx.queue.writeBuffer(this._pointBuffer, 0, pointBuf);

    // Spot lights — 128 bytes each (32 float/int32 words)
    const spotBuf = new ArrayBuffer(MAX_SPOT_LIGHTS * SPOT_STRIDE);
    const sf32 = new Float32Array(spotBuf);
    const si32 = new Int32Array(spotBuf);
    let shadowSpotIdx = 0;
    for (let i = 0; i < Math.min(spotLights.length, MAX_SPOT_LIGHTS); i++) {
      const sl  = spotLights[i];
      const pos = sl.worldPosition();
      const dir = sl.worldDirection();
      const vp  = sl.lightViewProj();
      const b   = i * 32;
      sf32[b+0] = pos.x;  sf32[b+1] = pos.y;  sf32[b+2] = pos.z;
      sf32[b+3] = sl.range;
      sf32[b+4] = dir.x;  sf32[b+5] = dir.y;  sf32[b+6] = dir.z;
      sf32[b+7] = Math.cos(sl.innerAngle * Math.PI / 180);
      sf32[b+8] = sl.color.x; sf32[b+9] = sl.color.y; sf32[b+10] = sl.color.z;
      sf32[b+11] = Math.cos(sl.outerAngle * Math.PI / 180);
      sf32[b+12] = sl.intensity;
      if (sl.castShadow && shadowSpotIdx < MAX_SHADOW_SPOT_LIGHTS) {
        si32[b+13] = shadowSpotIdx++;
      } else {
        si32[b+13] = -1;
      }
      si32[b+14] = sl.projectionTexture !== null ? i : -1;  // projTexIdx if projection tex set
      si32[b+15] = 0;
      sf32.set(vp.data, b + 16);
    }
    ctx.queue.writeBuffer(this._spotBuffer, 0, spotBuf);
  }

  execute(encoder: GPUCommandEncoder, _ctx: RenderContext): void {
    const pass = encoder.beginRenderPass({
      label: 'PointSpotLightPass',
      colorAttachments: [
        { view: this._hdrView, loadOp: 'load', storeOp: 'store' },
      ],
    });
    pass.setPipeline(this._pipeline);
    pass.setBindGroup(0, this._cameraBG);
    pass.setBindGroup(1, this._gbufferBG);
    pass.setBindGroup(2, this._lightBG);
    pass.setBindGroup(3, this._shadowBG);
    pass.draw(3);
    pass.end();
  }

  destroy(): void {
    this._cameraBuffer.destroy();
    this._lightCountsBuffer.destroy();
    this._pointBuffer.destroy();
    this._spotBuffer.destroy();
  }
}
