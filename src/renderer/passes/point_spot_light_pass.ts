import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import type { GBuffer } from '../gbuffer.js';
import type { PointLight as EnginePointLight } from '../../engine/components/point_light.js';
import type { SpotLight as EngineSpotLight } from '../../engine/components/spot_light.js';
import type { SpotLight } from '../spot_light.js';
import type { PointSpotShadowPass } from './point_spot_shadow_pass.js';
import { MAX_POINT_LIGHTS, MAX_SPOT_LIGHTS, MAX_SHADOW_POINT_LIGHTS, MAX_SHADOW_SPOT_LIGHTS } from './point_spot_shadow_pass.js';
import { HDR_FORMAT } from './deferred_lighting_pass.js';
import lightingWgsl from '../../shaders/point_spot_lighting.wgsl?raw';

// CameraUniforms: same layout as DeferredLightingPass (288 bytes)
const CAMERA_SIZE = 64 * 4 + 16 + 16;

// LightCounts: numPoint(4) + numSpot(4) = 8 bytes
const LIGHT_COUNTS_SIZE = 8;

// Per-light buffer sizes (bytes)
const POINT_STRIDE = 48;   // matches PointLightGpu in shader
const SPOT_STRIDE  = 128;  // matches SpotLightGpu in shader

/**
 * Deferred lighting pass that accumulates contributions from all point and spot
 * lights into the HDR scene buffer.
 *
 * Reads the GBuffer (albedo+roughness, normal+metallic, depth) and the VSM/projection
 * texture arrays produced by {@link PointSpotShadowPass}, applies a PBR shading model,
 * and additively blends the result on top of the HDR target previously written by the
 * directional {@link DeferredLightingPass} and {@link SkyTexturePass}.
 */
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

  // Pre-allocated staging buffers — reused every frame to avoid GC pressure.
  private readonly _cameraData      = new Float32Array(CAMERA_SIZE / 4);
  private readonly _lightCountsArr  = new Uint32Array(2);
  private readonly _pointBuf        = new ArrayBuffer(MAX_POINT_LIGHTS * POINT_STRIDE);
  private readonly _pointF32        = new Float32Array(this._pointBuf);
  private readonly _pointI32        = new Int32Array(this._pointBuf);
  private readonly _spotBuf         = new ArrayBuffer(MAX_SPOT_LIGHTS * SPOT_STRIDE);
  private readonly _spotF32         = new Float32Array(this._spotBuf);
  private readonly _spotI32         = new Int32Array(this._spotBuf);

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

  /**
   * Allocates the camera/light-counts uniform buffers, the point and spot light storage
   * buffers, samplers, bind group layouts/groups, and the additively-blended fragment
   * pipeline that writes into the HDR target.
   *
   * @param shadowPass - Source of the point cube-array VSM, spot 2D-array VSM, and projection texture array.
   * @param hdrView - HDR color target previously written by sky/directional lighting.
   */
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

    const shaderModule = ctx.createShaderModule(lightingWgsl, 'PointSpotLightShader');

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

  /**
   * Uploads the per-frame camera matrices, world-space camera position, and
   * near/far planes from `ctx.activeCamera` into the camera uniform buffer
   * (un-jittered VP — additive lights composite onto already-shaded HDR).
   */
  updateCamera(ctx: RenderContext): void {
    const camera = ctx.activeCamera;
    if (!camera) {
      throw new Error('PointSpotLightPass.updateCamera: ctx.activeCamera is null');
    }
    const camPos = camera.position();
    const data = this._cameraData;
    data.set(camera.viewMatrix().data,                  0);
    data.set(camera.projectionMatrix().data,           16);
    data.set(camera.viewProjectionMatrix().data,       32);
    data.set(camera.inverseViewProjectionMatrix().data, 48);
    data[64] = camPos.x; data[65] = camPos.y; data[66] = camPos.z;
    data[67] = camera.near; data[68] = camera.far;
    ctx.queue.writeBuffer(this._cameraBuffer, 0, data.buffer as ArrayBuffer);
  }

  /**
   * Packs and uploads the active point and spot lights into their storage buffers and
   * writes the light-count uniform. Light arrays are clamped to {@link MAX_POINT_LIGHTS}
   * / {@link MAX_SPOT_LIGHTS}; shadow-casting lights are assigned VSM array slot indices
   * up to {@link MAX_SHADOW_POINT_LIGHTS} / {@link MAX_SHADOW_SPOT_LIGHTS}.
   */
  updateLights(ctx: RenderContext, pointLights: EnginePointLight[], spotLights: EngineSpotLight[]): void {
    // Light counts
    const counts = this._lightCountsArr;
    counts[0] = Math.min(pointLights.length, MAX_POINT_LIGHTS);
    counts[1] = Math.min(spotLights.length,  MAX_SPOT_LIGHTS);
    ctx.queue.writeBuffer(this._lightCountsBuffer, 0, counts.buffer as ArrayBuffer);

    // Point lights — 48 bytes each (12 float/int32 words)
    const pf32 = this._pointF32;
    const pi32 = this._pointI32;
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
    ctx.queue.writeBuffer(this._pointBuffer, 0, this._pointBuf);

    // Spot lights — 128 bytes each (32 float/int32 words)
    const sf32 = this._spotF32;
    const si32 = this._spotI32;
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
    ctx.queue.writeBuffer(this._spotBuffer, 0, this._spotBuf);
  }

  /**
   * Computes the view-projection matrix for a single {@link SpotLightData} in
   * place (via {@link SpotLightData.computeLightViewProj}), leaving the caller
   * responsible for uploading it through the normal {@link updateLights} flow.
   *
   * Useful when updating a light's transform between frames without rebuilding
   * the entire light array.
   */
  updateLight(light: SpotLight): void {
    light.computeLightViewProj();
  }

  /**
   * Issues a single full-screen-triangle draw that additively accumulates all point
   * and spot light contributions onto the HDR target.
   */
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

  /**
   * Releases the camera, light-counts, and per-light storage buffers.
   */
  destroy(): void {
    this._cameraBuffer.destroy();
    this._lightCountsBuffer.destroy();
    this._pointBuffer.destroy();
    this._spotBuffer.destroy();
  }
}
