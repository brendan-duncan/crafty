import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle } from '../index.js';
import type { PointLight as EnginePointLight } from '../../../engine/components/point_light.js';
import type { SpotLight as EngineSpotLight } from '../../../engine/components/spot_light.js';
import type { SpotLight } from '../../spot_light.js';
import { MAX_POINT_LIGHTS, MAX_SPOT_LIGHTS, MAX_SHADOW_POINT_LIGHTS, MAX_SHADOW_SPOT_LIGHTS } from './point_spot_shadow_pass.js';
import { HDR_FORMAT } from './deferred_lighting_pass.js';
import lightingWgsl from '../../../shaders/point_spot_lighting.wgsl?raw';

const CAMERA_SIZE = 64 * 4 + 16 + 16;
const LIGHT_COUNTS_SIZE = 8;
const POINT_STRIDE = 48;
const SPOT_STRIDE = 128;

export interface PointSpotLightDeps {
  /** GBuffer attachments (read sampled). */
  gbuffer: { albedo: ResourceHandle; normal: ResourceHandle; depth: ResourceHandle };
  /** Persistent VSM textures from PointSpotShadowPass. */
  pointVsm: ResourceHandle;
  spotVsm: ResourceHandle;
  projTex: ResourceHandle;
  /** HDR target to additively blend onto. */
  hdr: ResourceHandle;
}

export interface PointSpotLightOutputs {
  /** HDR after the point/spot light contribution is blended in. */
  hdr: ResourceHandle;
}

/**
 * Deferred point + spot lighting (render-graph version). Reads the GBuffer +
 * VSM/projection textures and additively blends point/spot light contribution
 * into the existing HDR target.
 */
export class PointSpotLightPass extends Pass<PointSpotLightDeps, PointSpotLightOutputs> {
  readonly name = 'PointSpotLightPass';

  private readonly _pipeline: GPURenderPipeline;
  private readonly _cameraBg: GPUBindGroup;
  private readonly _lightBg: GPUBindGroup;
  private readonly _gbufferBgl: GPUBindGroupLayout;
  private readonly _shadowBgl: GPUBindGroupLayout;
  private readonly _cameraBuffer: GPUBuffer;
  private readonly _lightCountsBuffer: GPUBuffer;
  private readonly _pointBuffer: GPUBuffer;
  private readonly _spotBuffer: GPUBuffer;
  private readonly _linearSampler: GPUSampler;
  private readonly _vsmSampler: GPUSampler;
  private readonly _projSampler: GPUSampler;

  private readonly _cameraData = new Float32Array(CAMERA_SIZE / 4);
  private readonly _lightCountsArr = new Uint32Array(2);
  private readonly _pointBuf = new ArrayBuffer(MAX_POINT_LIGHTS * POINT_STRIDE);
  private readonly _pointF32 = new Float32Array(this._pointBuf);
  private readonly _pointI32 = new Int32Array(this._pointBuf);
  private readonly _spotBuf = new ArrayBuffer(MAX_SPOT_LIGHTS * SPOT_STRIDE);
  private readonly _spotF32 = new Float32Array(this._spotBuf);
  private readonly _spotI32 = new Int32Array(this._spotBuf);

  private constructor(
    pipeline: GPURenderPipeline,
    cameraBg: GPUBindGroup,
    lightBg: GPUBindGroup,
    gbufferBgl: GPUBindGroupLayout,
    shadowBgl: GPUBindGroupLayout,
    cameraBuffer: GPUBuffer,
    lightCountsBuffer: GPUBuffer,
    pointBuffer: GPUBuffer,
    spotBuffer: GPUBuffer,
    linearSampler: GPUSampler,
    vsmSampler: GPUSampler,
    projSampler: GPUSampler,
  ) {
    super();
    this._pipeline = pipeline;
    this._cameraBg = cameraBg;
    this._lightBg = lightBg;
    this._gbufferBgl = gbufferBgl;
    this._shadowBgl = shadowBgl;
    this._cameraBuffer = cameraBuffer;
    this._lightCountsBuffer = lightCountsBuffer;
    this._pointBuffer = pointBuffer;
    this._spotBuffer = spotBuffer;
    this._linearSampler = linearSampler;
    this._vsmSampler = vsmSampler;
    this._projSampler = projSampler;
  }

  static create(ctx: RenderContext): PointSpotLightPass {
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

    const cameraBgl = device.createBindGroupLayout({
      label: 'PSLCameraBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
    });
    const gbufferBgl = device.createBindGroupLayout({
      label: 'PSLGBufferBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });
    const lightBgl = device.createBindGroupLayout({
      label: 'PSLLightBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'read-only-storage' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'read-only-storage' } },
      ],
    });
    const shadowBgl = device.createBindGroupLayout({
      label: 'PSLShadowBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float', viewDimension: 'cube-array' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float', viewDimension: '2d-array' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float', viewDimension: '2d-array' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
        { binding: 4, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    const cameraBg = device.createBindGroup({
      label: 'PSLCameraBG', layout: cameraBgl,
      entries: [{ binding: 0, resource: { buffer: cameraBuffer } }],
    });
    const lightBg = device.createBindGroup({
      label: 'PSLLightBG', layout: lightBgl,
      entries: [
        { binding: 0, resource: { buffer: lightCountsBuffer } },
        { binding: 1, resource: { buffer: pointBuffer } },
        { binding: 2, resource: { buffer: spotBuffer } },
      ],
    });

    const shaderModule = ctx.createShaderModule(lightingWgsl, 'PointSpotLightShader');
    const pipeline = device.createRenderPipeline({
      label: 'PointSpotLightPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [cameraBgl, gbufferBgl, lightBgl, shadowBgl] }),
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
      pipeline, cameraBg, lightBg, gbufferBgl, shadowBgl,
      cameraBuffer, lightCountsBuffer, pointBuffer, spotBuffer,
      linearSampler, vsmSampler, projSampler,
    );
  }

  updateCamera(ctx: RenderContext): void {
    const camera = ctx.activeCamera;
    if (!camera) {
      throw new Error('PointSpotLightPass.updateCamera: ctx.activeCamera is null');
    }
    const camPos = camera.position();
    const data = this._cameraData;
    data.set(camera.viewMatrix().data, 0);
    data.set(camera.projectionMatrix().data, 16);
    data.set(camera.viewProjectionMatrix().data, 32);
    data.set(camera.inverseViewProjectionMatrix().data, 48);
    data[64] = camPos.x; data[65] = camPos.y; data[66] = camPos.z;
    data[67] = camera.near; data[68] = camera.far;
    ctx.queue.writeBuffer(this._cameraBuffer, 0, data.buffer as ArrayBuffer);
  }

  updateLights(ctx: RenderContext, pointLights: EnginePointLight[], spotLights: EngineSpotLight[]): void {
    const counts = this._lightCountsArr;
    counts[0] = Math.min(pointLights.length, MAX_POINT_LIGHTS);
    counts[1] = Math.min(spotLights.length, MAX_SPOT_LIGHTS);
    ctx.queue.writeBuffer(this._lightCountsBuffer, 0, counts.buffer as ArrayBuffer);

    const pf32 = this._pointF32;
    const pi32 = this._pointI32;
    let shadowPointIdx = 0;
    for (let i = 0; i < Math.min(pointLights.length, MAX_POINT_LIGHTS); i++) {
      const pl = pointLights[i];
      const pos = pl.worldPosition();
      const b = i * 12;
      pf32[b+0] = pos.x; pf32[b+1] = pos.y; pf32[b+2] = pos.z;
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
    ctx.queue.writeBuffer(this._pointBuffer, 0, this._pointBuf);

    const sf32 = this._spotF32;
    const si32 = this._spotI32;
    let shadowSpotIdx = 0;
    for (let i = 0; i < Math.min(spotLights.length, MAX_SPOT_LIGHTS); i++) {
      const sl = spotLights[i];
      const pos = sl.worldPosition();
      const dir = sl.worldDirection();
      const vp = sl.lightViewProj();
      const b = i * 32;
      sf32[b+0] = pos.x; sf32[b+1] = pos.y; sf32[b+2] = pos.z;
      sf32[b+3] = sl.range;
      sf32[b+4] = dir.x; sf32[b+5] = dir.y; sf32[b+6] = dir.z;
      sf32[b+7] = Math.cos(sl.innerAngle * Math.PI / 180);
      sf32[b+8] = sl.color.x; sf32[b+9] = sl.color.y; sf32[b+10] = sl.color.z;
      sf32[b+11] = Math.cos(sl.outerAngle * Math.PI / 180);
      sf32[b+12] = sl.intensity;
      if (sl.castShadow && shadowSpotIdx < MAX_SHADOW_SPOT_LIGHTS) {
        si32[b+13] = shadowSpotIdx++;
      } else {
        si32[b+13] = -1;
      }
      si32[b+14] = sl.projectionTexture !== null ? i : -1;
      si32[b+15] = 0;
      sf32.set(vp.data, b + 16);
    }
    ctx.queue.writeBuffer(this._spotBuffer, 0, this._spotBuf);
  }

  updateLight(light: SpotLight): void {
    light.computeLightViewProj();
  }

  addToGraph(graph: RenderGraph, deps: PointSpotLightDeps): PointSpotLightOutputs {
    let outHdr!: ResourceHandle;

    graph.addPass(this.name, 'render', (b: PassBuilder) => {
      outHdr = b.write(deps.hdr, 'attachment', { loadOp: 'load', storeOp: 'store' });
      b.read(deps.gbuffer.albedo, 'sampled');
      b.read(deps.gbuffer.normal, 'sampled');
      b.read(deps.gbuffer.depth, 'sampled');
      b.read(deps.pointVsm, 'sampled');
      b.read(deps.spotVsm, 'sampled');
      b.read(deps.projTex, 'sampled');

      b.setExecute((pctx, res) => {
        const gbufferBg = res.getOrCreateBindGroup({
          layout: this._gbufferBgl,
          entries: [
            { binding: 0, resource: res.getTextureView(deps.gbuffer.albedo) },
            { binding: 1, resource: res.getTextureView(deps.gbuffer.normal) },
            { binding: 2, resource: res.getTextureView(deps.gbuffer.depth) },
            { binding: 3, resource: this._linearSampler },
          ],
        });
        const shadowBg = res.getOrCreateBindGroup({
          layout: this._shadowBgl,
          entries: [
            { binding: 0, resource: res.getTextureView(deps.pointVsm, { dimension: 'cube-array', arrayLayerCount: MAX_SHADOW_POINT_LIGHTS * 6 }) },
            { binding: 1, resource: res.getTextureView(deps.spotVsm, { dimension: '2d-array' }) },
            { binding: 2, resource: res.getTextureView(deps.projTex, { dimension: '2d-array' }) },
            { binding: 3, resource: this._vsmSampler },
            { binding: 4, resource: this._projSampler },
          ],
        });

        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(this._pipeline);
        enc.setBindGroup(0, this._cameraBg);
        enc.setBindGroup(1, gbufferBg);
        enc.setBindGroup(2, this._lightBg);
        enc.setBindGroup(3, shadowBg);
        enc.draw(3);
      });
    });

    return { hdr: outHdr };
  }

  destroy(): void {
    this._cameraBuffer.destroy();
    this._lightCountsBuffer.destroy();
    this._pointBuffer.destroy();
    this._spotBuffer.destroy();
  }
}
