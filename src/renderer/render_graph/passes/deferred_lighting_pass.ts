import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle, BufferDesc, TextureDesc } from '../index.js';
import type { Mat4 } from '../../../math/mat4.js';
import type { CascadeData } from '../../../engine/components/directional_light.js';
import type { IblTextures } from '../../../assets/ibl.js';
import lightingWgsl from '../../../shaders/lighting.wgsl?raw';

export const HDR_FORMAT: GPUTextureFormat = 'rgba16float';

// CameraUniforms: 4 mat4 (256) + vec3+f32 near (16) + f32 far + pad (8) = 280 bytes
const CAMERA_SIZE = 64 * 4 + 16 + 16;
// LightUniforms: see deferred_lighting_pass.ts (legacy) for byte layout — 368 bytes
const LIGHT_SIZE = 368;

export interface DeferredLightingDeps {
  /** GBuffer attachments produced by geometry passes. */
  gbuffer: { albedo: ResourceHandle; normal: ResourceHandle; depth: ResourceHandle };
  /** Persistent shadow map handle (from ShadowPass / BlockShadowPass output chain). */
  shadowMap: ResourceHandle;
  /** SSAO ambient-occlusion handle (half-res `r8unorm`). */
  ao: ResourceHandle;
  /**
   * Optional HDR target to write into. When omitted the pass creates a fresh
   * HDR texture and clears it. When provided (e.g. by AtmospherePass) the pass
   * loads the existing contents and additively composites lighting on top.
   */
  hdr?: ResourceHandle;
  /** Optional cloud shadow transmittance map (`r8unorm`). */
  cloudShadow?: ResourceHandle;
  /** Optional SSGI indirect-light handle (`rgba16float`). */
  ssgi?: ResourceHandle;
  /** Optional IBL texture set. */
  iblTextures?: IblTextures;
}

export interface DeferredLightingOutputs {
  /** Final HDR result containing direct lighting (and atmosphere if loaded in). */
  hdr: ResourceHandle;
  /** Persistent camera uniform buffer handle, exposed for downstream readers (composite, godray). */
  cameraBuffer: ResourceHandle;
  /** Persistent light uniform buffer handle, exposed for downstream readers. */
  lightBuffer: ResourceHandle;
}

const CAMERA_BUFFER_KEY = 'lighting:camera';
const LIGHT_BUFFER_KEY = 'lighting:light';

const CAMERA_BUFFER_DESC: BufferDesc = {
  label: 'LightCameraBuffer',
  size: CAMERA_SIZE,
  extraUsage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
};

const LIGHT_BUFFER_DESC: BufferDesc = {
  label: 'LightBuffer',
  size: LIGHT_SIZE,
  extraUsage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
};

/**
 * Deferred lighting pass (render-graph version).
 *
 * Samples the G-buffer, cascade shadow maps, AO/SSGI, cloud transmittance and
 * IBL textures, then composites direct + indirect lighting into an HDR target.
 * The camera and light uniform buffers are persistent in the graph cache so
 * downstream passes (composite, godray) can read them via handles.
 */
export class DeferredLightingPass extends Pass<DeferredLightingDeps, DeferredLightingOutputs> {
  readonly name = 'DeferredLightingPass';

  private readonly _pipeline: GPURenderPipeline;
  private readonly _sceneBgl: GPUBindGroupLayout;
  private readonly _gbufferBgl: GPUBindGroupLayout;
  private readonly _aoBgl: GPUBindGroupLayout;
  private readonly _iblBgl: GPUBindGroupLayout;

  private readonly _comparisonSampler: GPUSampler;
  private readonly _linearSampler: GPUSampler;
  private readonly _aoSampler: GPUSampler;
  private readonly _ssgiSampler: GPUSampler;
  private readonly _iblSampler: GPUSampler;

  private readonly _defaultCloudShadow: GPUTexture;
  private readonly _defaultCloudShadowView: GPUTextureView;
  private readonly _defaultSsgi: GPUTexture;
  private readonly _defaultSsgiView: GPUTextureView;
  private readonly _defaultIblCube: GPUTexture;
  private readonly _defaultIblView: GPUTextureView;
  private readonly _defaultBrdfLut: GPUTexture;
  private readonly _defaultBrdfLutView: GPUTextureView;

  // Caches for the persistent camera/light buffers so updateCamera/updateLight
  // can target them without going through addToGraph first.
  private _cameraBufferRef: GPUBuffer | null = null;
  private _lightBufferRef: GPUBuffer | null = null;

  // Per-frame staging buffers — avoid GC churn.
  private readonly _cameraScratch = new Float32Array(CAMERA_SIZE / 4);
  private readonly _lightScratch = new Float32Array(LIGHT_SIZE / 4);
  private readonly _lightScratchU = new Uint32Array(this._lightScratch.buffer);
  private readonly _cloudShadowScratch = new Float32Array(3);

  // Pending uploads if updateCamera/updateLight are called before the first
  // graph cycle has imported the persistent buffers.
  private _pendingCamera: ArrayBuffer | null = null;
  private _pendingLight: ArrayBuffer | null = null;
  private _pendingCloudShadow: ArrayBuffer | null = null;

  private constructor(
    pipeline: GPURenderPipeline,
    sceneBgl: GPUBindGroupLayout,
    gbufferBgl: GPUBindGroupLayout,
    aoBgl: GPUBindGroupLayout,
    iblBgl: GPUBindGroupLayout,
    comparisonSampler: GPUSampler,
    linearSampler: GPUSampler,
    aoSampler: GPUSampler,
    ssgiSampler: GPUSampler,
    iblSampler: GPUSampler,
    defaultCloudShadow: GPUTexture,
    defaultCloudShadowView: GPUTextureView,
    defaultSsgi: GPUTexture,
    defaultSsgiView: GPUTextureView,
    defaultIblCube: GPUTexture,
    defaultIblView: GPUTextureView,
    defaultBrdfLut: GPUTexture,
    defaultBrdfLutView: GPUTextureView,
  ) {
    super();
    this._pipeline = pipeline;
    this._sceneBgl = sceneBgl;
    this._gbufferBgl = gbufferBgl;
    this._aoBgl = aoBgl;
    this._iblBgl = iblBgl;
    this._comparisonSampler = comparisonSampler;
    this._linearSampler = linearSampler;
    this._aoSampler = aoSampler;
    this._ssgiSampler = ssgiSampler;
    this._iblSampler = iblSampler;
    this._defaultCloudShadow = defaultCloudShadow;
    this._defaultCloudShadowView = defaultCloudShadowView;
    this._defaultSsgi = defaultSsgi;
    this._defaultSsgiView = defaultSsgiView;
    this._defaultIblCube = defaultIblCube;
    this._defaultIblView = defaultIblView;
    this._defaultBrdfLut = defaultBrdfLut;
    this._defaultBrdfLutView = defaultBrdfLutView;
  }

  static create(ctx: RenderContext): DeferredLightingPass {
    const { device } = ctx;

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
    const iblSampler = device.createSampler({
      label: 'IblSampler',
      magFilter: 'linear', minFilter: 'linear', mipmapFilter: 'linear',
      addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge', addressModeW: 'clamp-to-edge',
    });

    const sceneBgl = device.createBindGroupLayout({
      label: 'LightSceneBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
      ],
    });
    const gbufferBgl = device.createBindGroupLayout({
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
    const aoBgl = device.createBindGroupLayout({
      label: 'LightAoBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });
    const iblBgl = device.createBindGroupLayout({
      label: 'LightIblBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float', viewDimension: 'cube' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float', viewDimension: 'cube' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    // Default 1×1 white cloud shadow texture — transmittance 1.0 (no shadow).
    const defaultCloudShadow = device.createTexture({
      label: 'DefaultCloudShadow', size: { width: 1, height: 1 },
      format: 'r8unorm',
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });
    device.queue.writeTexture({ texture: defaultCloudShadow }, new Uint8Array([255]),
      { bytesPerRow: 1 }, { width: 1, height: 1 });
    const defaultCloudShadowView = defaultCloudShadow.createView();

    // Default 1×1 black SSGI texture — zero indirect light.
    const defaultSsgi = device.createTexture({
      label: 'DefaultSsgi', size: { width: 1, height: 1 },
      format: HDR_FORMAT,
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });
    const defaultSsgiView = defaultSsgi.createView();

    // 1×1 black cubemap fallback for IBL.
    const defaultIblCube = device.createTexture({
      label: 'DefaultIblCube', size: { width: 1, height: 1, depthOrArrayLayers: 6 },
      format: 'rgba16float',
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });
    const defaultIblView = defaultIblCube.createView({ dimension: 'cube' });

    const defaultBrdfLut = device.createTexture({
      label: 'DefaultBrdfLut', size: { width: 1, height: 1 },
      format: 'rgba16float',
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });
    const defaultBrdfLutView = defaultBrdfLut.createView();

    const shaderModule = device.createShaderModule({ label: 'LightingShader', code: lightingWgsl });

    const pipeline = device.createRenderPipeline({
      label: 'LightingPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [sceneBgl, gbufferBgl, aoBgl, iblBgl] }),
      vertex: { module: shaderModule, entryPoint: 'vs_main' },
      fragment: {
        module: shaderModule, entryPoint: 'fs_main',
        targets: [{ format: HDR_FORMAT }],
      },
      primitive: { topology: 'triangle-list' },
    });

    return new DeferredLightingPass(
      pipeline,
      sceneBgl, gbufferBgl, aoBgl, iblBgl,
      comparisonSampler, linearSampler, aoSampler, ssgiSampler, iblSampler,
      defaultCloudShadow, defaultCloudShadowView,
      defaultSsgi, defaultSsgiView,
      defaultIblCube, defaultIblView,
      defaultBrdfLut, defaultBrdfLutView,
    );
  }

  // ── Update API (compatible with the legacy DeferredLightingPass) ──────────

  updateCamera(
    ctx: RenderContext,
    view: Mat4, proj: Mat4, viewProj: Mat4, invViewProj: Mat4,
    camPos: { x: number; y: number; z: number },
    near: number, far: number,
  ): void {
    const data = this._cameraScratch;
    data.set(view.data, 0);
    data.set(proj.data, 16);
    data.set(viewProj.data, 32);
    data.set(invViewProj.data, 48);
    data[64] = camPos.x; data[65] = camPos.y; data[66] = camPos.z;
    data[67] = near; data[68] = far;
    if (this._cameraBufferRef) {
      ctx.queue.writeBuffer(this._cameraBufferRef, 0, data.buffer as ArrayBuffer);
    } else {
      this._pendingCamera = data.buffer.slice(0, CAMERA_SIZE) as ArrayBuffer;
    }
  }

  updateLight(
    ctx: RenderContext,
    dir: { x: number; y: number; z: number },
    color: { x: number; y: number; z: number },
    intensity: number,
    cascades: CascadeData[],
    shadowsEnabled = true,
    debugCascades = false,
    shadowSoftness = 0.02,
  ): void {
    const data = this._lightScratch;
    const dataU = this._lightScratchU;
    let o = 0;
    data[o++] = dir.x; data[o++] = dir.y; data[o++] = dir.z;
    data[o++] = intensity;
    data[o++] = color.x; data[o++] = color.y; data[o++] = color.z;
    dataU[o++] = cascades.length;
    for (let i = 0; i < 4; i++) {
      if (i < cascades.length) data.set(cascades[i].lightViewProj.data, o);
      o += 16;
    }
    for (let i = 0; i < 4; i++) {
      data[o++] = i < cascades.length ? cascades[i].splitFar : 1e9;
    }
    dataU[o] = shadowsEnabled ? 1 : 0;
    dataU[o + 1] = debugCascades ? 1 : 0;
    data[81] = shadowSoftness;
    for (let i = 0; i < 4; i++) {
      data[84 + i] = i < cascades.length ? cascades[i].depthRange : 1.0;
    }
    for (let i = 0; i < 4; i++) {
      data[88 + i] = i < cascades.length ? cascades[i].texelWorldSize : 1.0;
    }
    if (this._lightBufferRef) {
      ctx.queue.writeBuffer(this._lightBufferRef, 0, data.buffer as ArrayBuffer);
    } else {
      this._pendingLight = data.buffer.slice(0, LIGHT_SIZE) as ArrayBuffer;
    }
  }

  updateCloudShadow(
    ctx: RenderContext,
    originX: number, originZ: number, extent: number,
  ): void {
    const data = this._cloudShadowScratch;
    data[0] = originX;
    data[1] = originZ;
    data[2] = extent;
    if (this._lightBufferRef) {
      ctx.queue.writeBuffer(this._lightBufferRef, 312, data.buffer as ArrayBuffer);
    } else {
      this._pendingCloudShadow = data.buffer.slice(0, 12) as ArrayBuffer;
    }
  }

  addToGraph(graph: RenderGraph, deps: DeferredLightingDeps): DeferredLightingOutputs {
    const { ctx } = graph;

    // Persistent uniform buffers for camera + light. Created on first call;
    // reused thereafter.
    const cameraBuffer = graph.importPersistentBuffer(CAMERA_BUFFER_KEY, CAMERA_BUFFER_DESC);
    const lightBuffer = graph.importPersistentBuffer(LIGHT_BUFFER_KEY, LIGHT_BUFFER_DESC);

    let hdr: ResourceHandle;
    const hasInput = !!deps.hdr;
    if (hasInput) {
      hdr = deps.hdr!;
    } else {
      hdr = undefined as unknown as ResourceHandle;
    }
    let outHdr!: ResourceHandle;

    graph.addPass(this.name, 'render', (b: PassBuilder) => {
      if (!hasInput) {
        hdr = b.createTexture({
          label: 'lighting.hdr',
          format: HDR_FORMAT,
          width: ctx.width,
          height: ctx.height,
          extraUsage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
        } as TextureDesc);
      }
      outHdr = b.write(hdr, 'attachment', {
        loadOp: hasInput ? 'load' : 'clear',
        storeOp: 'store',
        clearValue: [0, 0, 0, 1],
      });
      b.read(deps.gbuffer.albedo, 'sampled');
      b.read(deps.gbuffer.normal, 'sampled');
      b.read(deps.gbuffer.depth, 'sampled');
      b.read(deps.shadowMap, 'sampled');
      b.read(deps.ao, 'sampled');
      b.read(cameraBuffer, 'uniform');
      b.read(lightBuffer, 'uniform');
      if (deps.cloudShadow) b.read(deps.cloudShadow, 'sampled');
      if (deps.ssgi) b.read(deps.ssgi, 'sampled');

      b.setExecute((pctx, res) => {
        // Cache the resolved physical buffer references and flush any
        // pre-graph updates buffered before the first import.
        const camBuf = res.getBuffer(cameraBuffer);
        const ltBuf = res.getBuffer(lightBuffer);
        if (this._cameraBufferRef !== camBuf) {
          this._cameraBufferRef = camBuf;
          if (this._pendingCamera) {
            ctx.queue.writeBuffer(camBuf, 0, this._pendingCamera);
            this._pendingCamera = null;
          }
        }
        if (this._lightBufferRef !== ltBuf) {
          this._lightBufferRef = ltBuf;
          if (this._pendingLight) {
            ctx.queue.writeBuffer(ltBuf, 0, this._pendingLight);
            this._pendingLight = null;
          }
          if (this._pendingCloudShadow) {
            ctx.queue.writeBuffer(ltBuf, 312, this._pendingCloudShadow);
            this._pendingCloudShadow = null;
          }
        }

        const sceneBg = res.getOrCreateBindGroup({
          layout: this._sceneBgl,
          entries: [
            { binding: 0, resource: { buffer: camBuf } },
            { binding: 1, resource: { buffer: ltBuf } },
          ],
        });

        const shadowMapView = res.getTextureView(deps.shadowMap, { dimension: '2d-array' });
        const cloudShadowView = deps.cloudShadow
          ? res.getTextureView(deps.cloudShadow)
          : this._defaultCloudShadowView;

        const gbufferBg = res.getOrCreateBindGroup({
          layout: this._gbufferBgl,
          entries: [
            { binding: 0, resource: res.getTextureView(deps.gbuffer.albedo) },
            { binding: 1, resource: res.getTextureView(deps.gbuffer.normal) },
            { binding: 2, resource: res.getTextureView(deps.gbuffer.depth) },
            { binding: 3, resource: shadowMapView },
            { binding: 4, resource: this._comparisonSampler },
            { binding: 5, resource: this._linearSampler },
            { binding: 6, resource: cloudShadowView },
          ],
        });

        const ssgiView = deps.ssgi ? res.getTextureView(deps.ssgi) : this._defaultSsgiView;
        const aoBg = res.getOrCreateBindGroup({
          layout: this._aoBgl,
          entries: [
            { binding: 0, resource: res.getTextureView(deps.ao) },
            { binding: 1, resource: this._aoSampler },
            { binding: 2, resource: ssgiView },
            { binding: 3, resource: this._ssgiSampler },
          ],
        });

        const iblBg = res.getOrCreateBindGroup({
          layout: this._iblBgl,
          entries: [
            { binding: 0, resource: deps.iblTextures?.irradianceView ?? this._defaultIblView },
            { binding: 1, resource: deps.iblTextures?.prefilteredView ?? this._defaultIblView },
            { binding: 2, resource: deps.iblTextures?.brdfLutView ?? this._defaultBrdfLutView },
            { binding: 3, resource: this._iblSampler },
          ],
        });

        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(this._pipeline);
        enc.setBindGroup(0, sceneBg);
        enc.setBindGroup(1, gbufferBg);
        enc.setBindGroup(2, aoBg);
        enc.setBindGroup(3, iblBg);
        enc.draw(3);
      });
    });

    return { hdr: outHdr, cameraBuffer, lightBuffer };
  }

  destroy(): void {
    this._defaultCloudShadow.destroy();
    this._defaultSsgi.destroy();
    this._defaultIblCube.destroy();
    this._defaultBrdfLut.destroy();
  }
}
