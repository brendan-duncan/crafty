import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle } from '../index.js';
import type { RenderContext } from '../../render_context.js';
import { VERTEX_ATTRIBUTES, VERTEX_STRIDE } from '../../../assets/mesh.js';
import type { Mesh } from '../../../assets/mesh.js';
import type { Mat4 } from '../../../math/mat4.js';
import { Vec3 } from '../../../math/vec3.js';
import { Vec4 } from '../../../math/vec4.js';
import { Material, MaterialPassType } from '../../material.js';
import type { IblTextures } from '../../../assets/ibl.js';
import type { SpotLight } from '../../spot_light.js';
import type { DirectionalLight } from '../../directional_light.js';
import type { PointLight } from '../../point_light.js';

const HDR_FORMAT: GPUTextureFormat = 'rgba16float';
const CAMERA_UNIFORM_SIZE = 64 * 4 + 16 + 16;
const MODEL_UNIFORM_SIZE = 128;
const LIGHTING_UNIFORM_SIZE = 16;
const DIRECTIONAL_LIGHT_SIZE = 368;
const POINT_LIGHT_SIZE = 48;
const SPOT_LIGHT_SIZE = 128;
const MAX_POINT_LIGHTS = 8;
const MAX_SPOT_LIGHTS = 4;
const POINT_SHADOW_SIZE = 1024;

export { MAX_POINT_LIGHTS, MAX_SPOT_LIGHTS };

export interface ForwardDrawItem {
  mesh: Mesh;
  modelMatrix: Mat4;
  normalMatrix: Mat4;
  material: Material;
}

/**
 * How a {@link ForwardPass} attachment slot is sourced.
 *
 * - `ResourceHandle` — write into the supplied handle (caller provides the texture).
 * - `'backbuffer'`   — write into the graph's registered backbuffer / backbuffer depth.
 *                      Requires {@link RenderGraph.setBackbuffer} (and, for depth,
 *                      {@link RenderGraph.setBackbufferDepth}) to have been called.
 * - `'auto'`         — use the backbuffer when one is registered; otherwise
 *                      fall back to creating a transient texture. The caller is
 *                      responsible for choosing `loadOp` ('clear' if this pass
 *                      is the first writer, 'load' if a previous pass already
 *                      cleared/wrote to the same backbuffer).
 * - `undefined`      — always create a transient texture (HDR `rgba16float` for
 *                      color, `depth32float` for depth). This is the legacy default.
 */
export type ForwardTargetSpec = ResourceHandle | 'backbuffer' | 'auto';

export interface ForwardDeps {
  output?: ForwardTargetSpec;
  depth?: ForwardTargetSpec;
  iblTextures?: IblTextures;
  loadOp?: GPULoadOp;
  /** Defaults to `'clear'`. Set to `'load'` when reusing an existing depth
   *  buffer (e.g. the gbuffer depth from a prior deferred pass) so previously
   *  drawn geometry still depth-tests transparents correctly. */
  depthLoadOp?: GPULoadOp;
  clearColor?: GPUColor | Vec3 | Vec4;
  /** Optional external shadow map to copy into this pass's internal shadow array layer 0. */
  shadowMapSource?: ResourceHandle;
}

export interface ForwardOutputs {
  output: ResourceHandle;
  depth: ResourceHandle;
}

export class ForwardPass extends Pass<ForwardDeps, ForwardOutputs> {
  readonly name = 'ForwardPass';

  private readonly _ctx: RenderContext;
  private readonly _device: GPUDevice;
  private readonly _cameraBGL: GPUBindGroupLayout;
  private readonly _modelBGL: GPUBindGroupLayout;
  private readonly _lightingIblBGL: GPUBindGroupLayout;

  private readonly _opaquePipelineCache = new Map<string, GPURenderPipeline>();
  private readonly _transparentPipelineCache = new Map<string, GPURenderPipeline>();

  private readonly _cameraBuffer: GPUBuffer;
  private readonly _cameraBindGroup: GPUBindGroup;

  private readonly _lightingBuffer: GPUBuffer;
  private readonly _directionalLightBuffer: GPUBuffer;
  private readonly _pointLightsBuffer: GPUBuffer;
  private readonly _spotLightsBuffer: GPUBuffer;

  private readonly _shadowSampler: GPUSampler;
  private readonly _iblSampler: GPUSampler;

  private readonly _shadowMapArray: GPUTexture;
  private readonly _shadowMapArrayView: GPUTextureView;
  private readonly _pointShadowCubeArray: GPUTexture;
  private readonly _pointShadowCubeArrayView: GPUTextureView;

  /** When set, the render pass reads from this external shadow map handle instead of _shadowMapArray. */
  private _externalShadowHandle: ResourceHandle | null = null;

  private readonly _defaultCubemap: GPUTexture;
  private readonly _defaultCubemapView: GPUTextureView;
  private readonly _defaultBrdfLut: GPUTexture;
  private readonly _defaultBrdfLutView: GPUTextureView;

  private _opaqueItems: ForwardDrawItem[] = [];
  private _transparentItems: ForwardDrawItem[] = [];

  sortTransparent = true;
  private readonly _camPos = new Float32Array(3);

  private readonly _modelData = new Float32Array(32);
  private readonly _cameraScratch = new Float32Array(CAMERA_UNIFORM_SIZE / 4);
  private readonly _lightingScratch = new Uint32Array(4);
  private readonly _directionalScratch = new ArrayBuffer(DIRECTIONAL_LIGHT_SIZE);
  private readonly _directionalScratchF = new Float32Array(this._directionalScratch);
  private readonly _directionalScratchU = new Uint32Array(this._directionalScratch);
  private readonly _pointLightsScratch = new ArrayBuffer(POINT_LIGHT_SIZE * MAX_POINT_LIGHTS);
  private readonly _pointLightsScratchF = new Float32Array(this._pointLightsScratch);
  private readonly _pointLightsScratchU = new Uint32Array(this._pointLightsScratch);
  private readonly _spotLightsScratch = new ArrayBuffer(SPOT_LIGHT_SIZE * MAX_SPOT_LIGHTS);
  private readonly _spotLightsScratchF = new Float32Array(this._spotLightsScratch);
  private readonly _spotLightsScratchU = new Uint32Array(this._spotLightsScratch);

  private readonly _modelBuffers: GPUBuffer[] = [];
  private readonly _modelBindGroups: GPUBindGroup[] = [];
  private _bufferIndex = 0;

  private constructor(
    ctx: import('../../render_context.js').RenderContext,
    device: GPUDevice,
    cameraBGL: GPUBindGroupLayout,
    modelBGL: GPUBindGroupLayout,
    lightingIblBGL: GPUBindGroupLayout,
    cameraBuffer: GPUBuffer,
    cameraBindGroup: GPUBindGroup,
    lightingBuffer: GPUBuffer,
    directionalLightBuffer: GPUBuffer,
    pointLightsBuffer: GPUBuffer,
    spotLightsBuffer: GPUBuffer,
    shadowSampler: GPUSampler,
    iblSampler: GPUSampler,
    shadowMapArray: GPUTexture,
    shadowMapArrayView: GPUTextureView,
    pointShadowCubeArray: GPUTexture,
    pointShadowCubeArrayView: GPUTextureView,
    defaultCubemap: GPUTexture,
    defaultCubemapView: GPUTextureView,
    defaultBrdfLut: GPUTexture,
    defaultBrdfLutView: GPUTextureView,
  ) {
    super();
    this._ctx = ctx;
    this._device = device;
    this._cameraBGL = cameraBGL;
    this._modelBGL = modelBGL;
    this._lightingIblBGL = lightingIblBGL;
    this._cameraBuffer = cameraBuffer;
    this._cameraBindGroup = cameraBindGroup;
    this._lightingBuffer = lightingBuffer;
    this._directionalLightBuffer = directionalLightBuffer;
    this._pointLightsBuffer = pointLightsBuffer;
    this._spotLightsBuffer = spotLightsBuffer;
    this._shadowSampler = shadowSampler;
    this._iblSampler = iblSampler;
    this._shadowMapArray = shadowMapArray;
    this._shadowMapArrayView = shadowMapArrayView;
    this._pointShadowCubeArray = pointShadowCubeArray;
    this._pointShadowCubeArrayView = pointShadowCubeArrayView;
    this._defaultCubemap = defaultCubemap;
    this._defaultCubemapView = defaultCubemapView;
    this._defaultBrdfLut = defaultBrdfLut;
    this._defaultBrdfLutView = defaultBrdfLutView;
  }

  static create(ctx: RenderContext): ForwardPass {
    const { device } = ctx;

    const cameraBGL = device.createBindGroupLayout({
      label: 'ForwardCameraBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
      ],
    });

    const modelBGL = device.createBindGroupLayout({
      label: 'ForwardModelBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
      ],
    });

    const lightingIblBGL = device.createBindGroupLayout({
      label: 'ForwardLightingIblBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'read-only-storage' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'read-only-storage' } },
        { binding: 4, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth', viewDimension: '2d-array' } },
        { binding: 5, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'comparison' } },
        { binding: 6, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float', viewDimension: 'cube' } },
        { binding: 7, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float', viewDimension: 'cube' } },
        { binding: 8, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 9, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
        { binding: 10, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth', viewDimension: 'cube-array' } },
      ],
    });

    const shadowSampler = device.createSampler({
      label: 'ForwardShadowSampler',
      compare: 'less',
      magFilter: 'linear',
      minFilter: 'linear',
    });

    const iblSampler = device.createSampler({
      magFilter: 'linear',
      minFilter: 'linear',
      mipmapFilter: 'linear',
    });

    const cameraBuffer = device.createBuffer({
      label: 'ForwardCameraBuffer',
      size: CAMERA_UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const cameraBindGroup = device.createBindGroup({
      label: 'ForwardCameraBindGroup',
      layout: cameraBGL,
      entries: [{ binding: 0, resource: { buffer: cameraBuffer } }],
    });

    const lightingBuffer = device.createBuffer({
      label: 'ForwardLightingBuffer',
      size: LIGHTING_UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const directionalLightBuffer = device.createBuffer({
      label: 'ForwardDirectionalLightBuffer',
      size: DIRECTIONAL_LIGHT_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const pointLightsBuffer = device.createBuffer({
      label: 'ForwardPointLightsBuffer',
      size: POINT_LIGHT_SIZE * MAX_POINT_LIGHTS,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    const spotLightsBuffer = device.createBuffer({
      label: 'ForwardSpotLightsBuffer',
      size: SPOT_LIGHT_SIZE * MAX_SPOT_LIGHTS,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    const shadowMapArray = device.createTexture({
      label: 'ForwardShadowMapArray',
      size: { width: 2048, height: 2048, depthOrArrayLayers: 8 },
      format: 'depth32float',
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });
    const shadowMapArrayView = shadowMapArray.createView({ dimension: '2d-array' });

    const pointShadowCubeArray = device.createTexture({
      label: 'ForwardPointShadowCubeArray',
      size: { width: POINT_SHADOW_SIZE, height: POINT_SHADOW_SIZE, depthOrArrayLayers: 6 * MAX_POINT_LIGHTS },
      dimension: '2d',
      format: 'depth32float',
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
    const pointShadowCubeArrayView = pointShadowCubeArray.createView({ dimension: 'cube-array' });

    const defaultCubemap = ctx.createDefaultCubemap();
    const defaultCubemapView = defaultCubemap.createView({ dimension: 'cube' });
    const defaultBrdfLut = ctx.createDefaultBrdfLUT();
    const defaultBrdfLutView = defaultBrdfLut.createView();

    return new ForwardPass(
      ctx,
      device,
      cameraBGL,
      modelBGL,
      lightingIblBGL,
      cameraBuffer,
      cameraBindGroup,
      lightingBuffer,
      directionalLightBuffer,
      pointLightsBuffer,
      spotLightsBuffer,
      shadowSampler,
      iblSampler,
      shadowMapArray,
      shadowMapArrayView,
      pointShadowCubeArray,
      pointShadowCubeArrayView,
      defaultCubemap,
      defaultCubemapView,
      defaultBrdfLut,
      defaultBrdfLutView,
    );
  }

  get shadowMapArray(): GPUTexture {
    return this._shadowMapArray;
  }

  getShadowMap(index: number): GPUTextureView {
    return this._shadowMapArray.createView({
      dimension: '2d',
      baseArrayLayer: index,
      arrayLayerCount: 1,
    });
  }

  get pointShadowCubeArray(): GPUTexture {
    return this._pointShadowCubeArray;
  }

  setDrawItems(items: ForwardDrawItem[]): void {
    this._opaqueItems = items.filter((item) => !item.material.transparent);
    this._transparentItems = items.filter((item) => item.material.transparent);
    if (this.sortTransparent && this._transparentItems.length > 1) {
      const cx = this._camPos[0], cy = this._camPos[1], cz = this._camPos[2];
      this._transparentItems.sort((a, b) => {
        const dxA = a.modelMatrix.data[12] - cx;
        const dyA = a.modelMatrix.data[13] - cy;
        const dzA = a.modelMatrix.data[14] - cz;
        const dxB = b.modelMatrix.data[12] - cx;
        const dyB = b.modelMatrix.data[13] - cy;
        const dzB = b.modelMatrix.data[14] - cz;
        return (dxB * dxB + dyB * dyB + dzB * dzB) - (dxA * dxA + dyA * dyA + dzA * dzA);
      });
    }
  }

  updateCamera(ctx: RenderContext): void {
    const camera = ctx.activeCamera;
    if (!camera) {
      throw new Error('ForwardPass.updateCamera: ctx.activeCamera is null');
    }
    const camPos = camera.position();
    const data = this._cameraScratch;
    data.set(camera.viewMatrix().data, 0);
    data.set(camera.projectionMatrix().data, 16);
    data.set(camera.jitteredViewProjectionMatrix().data, 32);
    data.set(camera.inverseViewProjectionMatrix().data, 48);
    data[64] = camPos.x;
    data[65] = camPos.y;
    data[66] = camPos.z;
    data[67] = camera.near;
    data[68] = camera.far;
    this._camPos[0] = camPos.x;
    this._camPos[1] = camPos.y;
    this._camPos[2] = camPos.z;
    ctx.device.queue.writeBuffer(this._cameraBuffer, 0, data);
  }

  copyShadowMapToArray(encoder: GPUCommandEncoder, sourceTexture: GPUTexture, arrayLayer: number, size: number = 2048): void {
    encoder.copyTextureToTexture(
      { texture: sourceTexture },
      { texture: this._shadowMapArray, origin: { x: 0, y: 0, z: arrayLayer } },
      { width: size, height: size, depthOrArrayLayers: 1 },
    );
  }

  updateLight(light: SpotLight): void {
    light.computeLightViewProj();
  }

  updateLights(
    ctx: RenderContext,
    directionalLight: DirectionalLight,
    pointLights: PointLight[],
    spotLights: SpotLight[],
  ): void {
    const lightingData = this._lightingScratch;
    lightingData[0] = Math.min(pointLights.length, MAX_POINT_LIGHTS);
    lightingData[1] = Math.min(spotLights.length, MAX_SPOT_LIGHTS);
    lightingData[2] = 0;
    lightingData[3] = 0;
    ctx.device.queue.writeBuffer(this._lightingBuffer, 0, lightingData);

    const cascades = directionalLight.cascades;
    const cascadeCount = cascades ? Math.min(cascades.length, 4) : (directionalLight.lightViewProj ? 1 : 0);

    const dirBuffer = this._directionalScratch;
    const dirData = this._directionalScratchF;
    const dirDataU32 = this._directionalScratchU;
    dirData.fill(0);
    dirData[0] = directionalLight.direction.x;
    dirData[1] = directionalLight.direction.y;
    dirData[2] = directionalLight.direction.z;
    dirData[3] = directionalLight.intensity;
    dirData[4] = directionalLight.color.x;
    dirData[5] = directionalLight.color.y;
    dirData[6] = directionalLight.color.z;
    dirDataU32[7] = directionalLight.castShadows ? 1 : 0;
    dirDataU32[8] = cascadeCount;

    if (cascades) {
      for (let i = 0; i < cascadeCount; i++) {
        const base = 12 + i * 20;
        dirData.set(cascades[i].lightViewProj.data, base);
        dirData[base + 16] = cascades[i].splitFar;
      }
    } else if (directionalLight.lightViewProj) {
      dirData.set(directionalLight.lightViewProj.data, 12);
      dirData[28] = 1e9;
    }
    ctx.device.queue.writeBuffer(this._directionalLightBuffer, 0, dirBuffer);

    if (pointLights.length > 0) {
      const buffer = this._pointLightsScratch;
      const pointData = this._pointLightsScratchF;
      const pointDataU32 = this._pointLightsScratchU;
      pointData.fill(0);
      for (let i = 0; i < Math.min(pointLights.length, MAX_POINT_LIGHTS); i++) {
        const light = pointLights[i];
        const offset = i * 12;
        pointData[offset + 0] = light.position.x;
        pointData[offset + 1] = light.position.y;
        pointData[offset + 2] = light.position.z;
        pointData[offset + 3] = light.range;
        pointData[offset + 4] = light.color.x;
        pointData[offset + 5] = light.color.y;
        pointData[offset + 6] = light.color.z;
        pointData[offset + 7] = light.intensity;
        pointDataU32[offset + 8] = light.castShadows ? 1 : 0;
      }
      ctx.device.queue.writeBuffer(this._pointLightsBuffer, 0, buffer);
    }

    if (spotLights.length > 0) {
      const buffer = this._spotLightsScratch;
      const spotData = this._spotLightsScratchF;
      const spotDataU32 = this._spotLightsScratchU;
      spotData.fill(0);

      for (let i = 0; i < Math.min(spotLights.length, MAX_SPOT_LIGHTS); i++) {
        const light = spotLights[i];
        this.updateLight(light);
        const offset = i * 32;
        spotData[offset + 0] = light.position.x;
        spotData[offset + 1] = light.position.y;
        spotData[offset + 2] = light.position.z;
        spotData[offset + 3] = light.range;
        spotData[offset + 4] = light.direction.x;
        spotData[offset + 5] = light.direction.y;
        spotData[offset + 6] = light.direction.z;
        spotData[offset + 7] = light.innerAngle;
        spotData[offset + 8] = light.color.x;
        spotData[offset + 9] = light.color.y;
        spotData[offset + 10] = light.color.z;
        spotData[offset + 11] = light.outerAngle;
        spotData[offset + 12] = light.intensity;
        spotDataU32[offset + 13] = light.castShadows ? 1 : 0;
        spotDataU32[offset + 14] = light.castShadows ? (i + 1) : 0;
        spotData.set(light.lightViewProj.data, offset + 16);
      }
      ctx.device.queue.writeBuffer(this._spotLightsBuffer, 0, buffer);
    }
  }

  addToGraph(graph: RenderGraph, deps: ForwardDeps = {}): ForwardOutputs {
    const { ctx } = graph;
    const { iblTextures, clearColor, shadowMapSource } = deps;
    const loadOp: GPULoadOp = deps.loadOp ?? 'clear';
    const depthLoadOp: GPULoadOp = deps.depthLoadOp ?? 'clear';

    const clear: GPUColor = !clearColor ? [0, 0, 0, 1]
        : 'r' in clearColor ? clearColor
        : Array.isArray(clearColor) ? clearColor as GPUColor
        : clearColor instanceof Vec3 ? [clearColor.x, clearColor.y, clearColor.z, 1]
        : clearColor instanceof Vec4 ? [clearColor.x, clearColor.y, clearColor.z, clearColor.w]
        : [0, 0, 0, 1];

    this._externalShadowHandle = shadowMapSource ?? null;

    const colorTarget = this._resolveColorTarget(graph, deps.output);
    const depthTarget = this._resolveDepthTarget(graph, deps.depth);
    const colorFormat = colorTarget.format;
    const depthFormat = depthTarget.format;

    let outOutput!: ResourceHandle;
    let outDepth!: ResourceHandle;

    graph.addPass(this.name, 'render', (b: PassBuilder) => {
      // Establish dependency on the shadow source so shadow cascades
      // are guaranteed to execute before this pass.
      if (shadowMapSource) {
        b.read(shadowMapSource, 'sampled');
      }

      const output = colorTarget.handle ?? b.createTexture({
        label: 'ForwardOutput',
        format: colorFormat,
        width: ctx.width,
        height: ctx.height,
      });
      outOutput = b.write(output, 'attachment', { loadOp, storeOp: 'store', clearValue: clear });

      const depth = depthTarget.handle ?? b.createTexture({
        label: 'ForwardDepth',
        format: depthFormat,
        width: ctx.width,
        height: ctx.height,
      });
      outDepth = b.write(depth, 'depth-attachment', {
        depthLoadOp, depthStoreOp: 'store', depthClearValue: 1.0,
      });

      b.setExecute((pctx, res) => {
        let externalShadowView: GPUTextureView | undefined;
        if (this._externalShadowHandle) {
          externalShadowView = res.getTextureView(this._externalShadowHandle, { dimension: '2d-array' });
        }
        const lightingIblBindGroup = res.getOrCreateBindGroup({
          label: 'ForwardLightingIblBindGroup',
          layout: this._lightingIblBGL,
          entries: [
            { binding: 0, resource: { buffer: this._lightingBuffer } },
            { binding: 1, resource: { buffer: this._directionalLightBuffer } },
            { binding: 2, resource: { buffer: this._pointLightsBuffer } },
            { binding: 3, resource: { buffer: this._spotLightsBuffer } },
            { binding: 4, resource: externalShadowView ?? this._shadowMapArrayView },
            { binding: 5, resource: this._shadowSampler },
            { binding: 6, resource: iblTextures?.irradianceView ?? this._defaultCubemapView },
            { binding: 7, resource: iblTextures?.prefilteredView ?? this._defaultCubemapView },
            { binding: 8, resource: iblTextures?.brdfLutView ?? this._defaultBrdfLutView },
            { binding: 9, resource: this._iblSampler },
            { binding: 10, resource: this._pointShadowCubeArrayView },
          ],
        });

        const enc = pctx.renderPassEncoder!;
        enc.setBindGroup(0, this._cameraBindGroup);
        enc.setBindGroup(3, lightingIblBindGroup);

        for (const item of this._opaqueItems) {
          this._drawItem(enc, item, false, colorFormat, depthFormat);
        }
        for (const item of this._transparentItems) {
          this._drawItem(enc, item, true, colorFormat, depthFormat);
        }
      });
    });

    return { output: outOutput, depth: outDepth };
  }

  private _resolveColorTarget(
    graph: RenderGraph,
    spec: ForwardTargetSpec | undefined,
  ): { handle: ResourceHandle | null; format: GPUTextureFormat } {
    if (spec === undefined) {
      return { handle: null, format: HDR_FORMAT };
    }
    if (spec === 'backbuffer') {
      const bb = graph.getBackbuffer();
      return { handle: bb, format: graph.ctx.format };
    }
    if (spec === 'auto') {
      const bb = tryGetBackbuffer(graph);
      if (bb) {
        return { handle: bb, format: graph.ctx.format };
      }
      return { handle: null, format: HDR_FORMAT };
    }
    const info = graph.getResourceInfo(spec.id);
    return { handle: spec, format: (info?.format as GPUTextureFormat) ?? HDR_FORMAT };
  }

  private _resolveDepthTarget(
    graph: RenderGraph,
    spec: ForwardTargetSpec | undefined,
  ): { handle: ResourceHandle | null; format: GPUTextureFormat } {
    if (spec === undefined) {
      return { handle: null, format: 'depth32float' };
    }
    if (spec === 'backbuffer') {
      const bb = graph.getBackbufferDepth();
      if (!bb) {
        throw new Error('[ForwardPass] depth: "backbuffer" requested but graph.setBackbufferDepth() was not called');
      }
      const info = graph.getResourceInfo(bb.id);
      return { handle: bb, format: (info?.format as GPUTextureFormat) ?? 'depth32float' };
    }
    if (spec === 'auto') {
      const bb = graph.getBackbufferDepth();
      if (bb) {
        const info = graph.getResourceInfo(bb.id);
        return { handle: bb, format: (info?.format as GPUTextureFormat) ?? 'depth32float' };
      }
      return { handle: null, format: 'depth32float' };
    }
    const info = graph.getResourceInfo(spec.id);
    return { handle: spec, format: (info?.format as GPUTextureFormat) ?? 'depth32float' };
  }

  private _drawItem(
    enc: GPURenderPassEncoder,
    item: ForwardDrawItem,
    transparent: boolean,
    colorFormat: GPUTextureFormat,
    depthFormat: GPUTextureFormat,
  ): void {
    const material = item.material;
    material.update?.(this._device.queue);

    const variantMask = 'variantMask' in material ? (material as any).variantMask as number : 0;
    enc.setPipeline(this._getPipeline(material, variantMask, transparent, colorFormat, depthFormat));

    this._modelData.set(item.modelMatrix.data, 0);
    this._modelData.set(item.normalMatrix.data, 16);
    const modelBuffer = this._getOrCreateModelBuffer();
    this._device.queue.writeBuffer(modelBuffer, 0, this._modelData);

    enc.setBindGroup(1, this._getOrCreateModelBindGroup());
    enc.setBindGroup(2, material.getBindGroup(this._device));
    enc.setVertexBuffer(0, item.mesh.vertexBuffer);
    enc.setIndexBuffer(item.mesh.indexBuffer, 'uint32');
    enc.drawIndexed(item.mesh.indexCount);
  }

  private _getPipeline(
    material: Material,
    variantMask: number,
    transparent: boolean,
    colorFormat: GPUTextureFormat,
    depthFormat: GPUTextureFormat,
  ): GPURenderPipeline {
    const cache = transparent ? this._transparentPipelineCache : this._opaquePipelineCache;
    const key = `${material.shaderId}:${variantMask}:${colorFormat}:${depthFormat}`;
    let pipeline = cache.get(key);
    if (pipeline) {
      return pipeline;
    }

    const defines: Record<string, string> = {};
    if (variantMask & 1) defines['HAS_ALBEDO_MAP'] = '1';
    if (variantMask & 2) defines['HAS_NORMAL_MAP'] = '1';
    if (variantMask & 4) defines['HAS_MER_MAP'] = '1';

    const shaderModule = this._ctx.createShaderModule(
      material.getShaderCode(MaterialPassType.Forward, variantMask),
      `ForwardShader[${key}]`,
      defines,
    );

    const layout = this._device.createPipelineLayout({
      label: `ForwardPipelineLayout[${key}]`,
      bindGroupLayouts: [
        this._cameraBGL,
        this._modelBGL,
        material.getBindGroupLayout(this._device, variantMask),
        this._lightingIblBGL,
      ],
    });

    const colorTarget: GPUColorTargetState = transparent
      ? {
          format: colorFormat,
          blend: {
            color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' },
            alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
          },
        }
      : { format: colorFormat };

    pipeline = this._device.createRenderPipeline({
      label: `ForwardPipeline[${key}${transparent ? ':t' : ''}]`,
      layout,
      vertex: {
        module: shaderModule,
        entryPoint: 'vs_main',
        buffers: [{ arrayStride: VERTEX_STRIDE, attributes: VERTEX_ATTRIBUTES }],
      },
      fragment: {
        module: shaderModule,
        entryPoint: 'fs_main',
        targets: [colorTarget],
      },
      depthStencil: {
        format: depthFormat,
        depthWriteEnabled: !transparent,
        depthCompare: 'less',
      },
      primitive: {
        topology: 'triangle-list',
        cullMode: 'back',
      },
    });
    cache.set(key, pipeline);
    return pipeline;
  }

  private _getOrCreateModelBuffer(): GPUBuffer {
    const idx = this._bufferIndex % 32;
    if (!this._modelBuffers[idx]) {
      this._modelBuffers[idx] = this._device.createBuffer({
        label: `ForwardModelBuffer${idx}`,
        size: MODEL_UNIFORM_SIZE,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
    }
    return this._modelBuffers[idx];
  }

  private _getOrCreateModelBindGroup(): GPUBindGroup {
    const idx = this._bufferIndex++ % 32;
    if (!this._modelBindGroups[idx]) {
      this._modelBindGroups[idx] = this._device.createBindGroup({
        label: `ForwardModelBG${idx}`,
        layout: this._modelBGL,
        entries: [
          { binding: 0, resource: { buffer: this._modelBuffers[idx] } },
        ],
      });
    }
    return this._modelBindGroups[idx];
  }

  destroy(): void {
    this._shadowMapArray.destroy();
    this._pointShadowCubeArray.destroy();
    this._defaultCubemap.destroy();
    this._defaultBrdfLut.destroy();
    this._cameraBuffer.destroy();
    this._lightingBuffer.destroy();
    this._directionalLightBuffer.destroy();
    this._pointLightsBuffer.destroy();
    this._spotLightsBuffer.destroy();
    for (const buf of this._modelBuffers) {
      buf.destroy();
    }
  }
}

/** Returns the graph's registered backbuffer handle, or null if `setBackbuffer` was never called. */
function tryGetBackbuffer(graph: RenderGraph): ResourceHandle | null {
  try {
    return graph.getBackbuffer();
  } catch {
    return null;
  }
}
