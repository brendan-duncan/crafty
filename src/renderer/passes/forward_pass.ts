import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import { VERTEX_ATTRIBUTES, VERTEX_STRIDE } from '../../assets/mesh.js';
import type { Mesh } from '../../assets/mesh.js';
import type { Mat4 } from '../../math/mat4.js';
import { Vec3 } from '../../math/vec3.js';
import { Vec4 } from '../../math/vec4.js';
import { Material, MaterialPassType } from '../material.js';
import type { IblTextures } from '../../assets/ibl.js';
import type { SpotLight } from '../spot_light.js';
import type { DirectionalLight } from '../directional_light.js';
import type { PointLight } from '../point_light.js';

const CAMERA_UNIFORM_SIZE = 64 * 4 + 16 + 16;
const MODEL_UNIFORM_SIZE = 128;
const LIGHTING_UNIFORM_SIZE = 16;
const DIRECTIONAL_LIGHT_SIZE = 128; // vec3 direction (16) + f32 intensity (4) + vec3 color (16) + u32 castShadows (4) + u32 shadowMapIndex (4) + vec3 _pad (16 aligned) + mat4x4 lightViewProj (64) = 128
const POINT_LIGHT_SIZE = 48;
const SPOT_LIGHT_SIZE = 128; // 13 floats + 1 u32 (castShadows) + 1 u32 (shadowMapIndex) + 1 u32 padding + 16 floats (viewProj) = 32 * 4 = 128
const MAX_POINT_LIGHTS = 8;
const MAX_SPOT_LIGHTS = 4;
const POINT_SHADOW_SIZE = 1024;

/**
 * Maximum point lights uploaded per frame; matches the storage buffer size and
 * the cube-array shadow texture's reserved layer count.
 */
export { MAX_POINT_LIGHTS, MAX_SPOT_LIGHTS };

/**
 * One mesh instance to be drawn during a forward pass. Set
 * `material.transparent = true` to route the draw through the alpha-blended
 * sub-pass (drawn after all opaque items, with depth-write disabled).
 */
export interface ForwardDrawItem {
  mesh: Mesh;
  modelMatrix: Mat4;
  normalMatrix: Mat4;
  material: Material;
}

export interface ForwardPassOptions {
  load?: GPULoadOp;
  store?: GPUStoreOp;
  clearColor?: GPUColor | Vec3 | Vec4;
  iblTextures?: IblTextures;
}


/**
 * Forward pass that shades meshes in a single render pass with one directional
 * light, up to `MAX_POINT_LIGHTS` point lights and `MAX_SPOT_LIGHTS` spot
 * lights, plus an IBL environment.
 *
 * Each draw item supplies its own {@link Material}; pipelines are cached per
 * `material.shaderId` (separately for the opaque and transparent variants), so
 * many materials sharing a shader share a single pipeline. Reads the camera,
 * light, IBL and shadow bind groups owned by the pass; writes an HDR
 * `rgba16float` color target (`outputView`, or the swapchain when its format
 * matches) and an internal `depth32float` depth attachment. Opaque items are
 * drawn first, then alpha-blended transparents with depth-write disabled.
 */
export class ForwardPass extends RenderPass {
  readonly name = 'ForwardPass';

  private _cameraBGL: GPUBindGroupLayout;
  private _modelBGL: GPUBindGroupLayout;
  private _lightingIblBGL: GPUBindGroupLayout;

  private _opaquePipelineCache = new Map<string, GPURenderPipeline>();
  private _transparentPipelineCache = new Map<string, GPURenderPipeline>();

  private _cameraBuffer: GPUBuffer;
  private _cameraBindGroup: GPUBindGroup;

  private _lightingBuffer: GPUBuffer;
  private _directionalLightBuffer: GPUBuffer;
  private _pointLightsBuffer: GPUBuffer;
  private _spotLightsBuffer: GPUBuffer;
  private _lightingIblBindGroup: GPUBindGroup;

  private _shadowMapArray: GPUTexture;
  private _pointShadowCubeArray: GPUTexture;

  private _opaqueItems: ForwardDrawItem[] = [];
  private _transparentItems: ForwardDrawItem[] = [];

  /**
   * When `true` (default), transparent draw items are sorted back-to-front
   * relative to the camera each frame so alpha blending produces correct
   * results. Set to `false` to draw transparents in registration order (useful
   * for performance comparisons or when items are manually ordered).
   */
  sortTransparent = true;
  /** Cached camera world-space position, used for transparent sorting. */
  private _camPos = new Float32Array(3);

  private readonly _modelData = new Float32Array(32);

  // Reused per-frame staging buffers — avoid allocating typed arrays each
  // updateCamera / updateLights call (a meaningful per-frame GC source).
  private readonly _cameraScratch        = new Float32Array(CAMERA_UNIFORM_SIZE / 4);
  private readonly _lightingScratch      = new Uint32Array(4);
  private readonly _directionalScratch   = new ArrayBuffer(DIRECTIONAL_LIGHT_SIZE);
  private readonly _directionalScratchF  = new Float32Array(this._directionalScratch);
  private readonly _directionalScratchU  = new Uint32Array(this._directionalScratch);
  private readonly _pointLightsScratch   = new ArrayBuffer(POINT_LIGHT_SIZE * MAX_POINT_LIGHTS);
  private readonly _pointLightsScratchF  = new Float32Array(this._pointLightsScratch);
  private readonly _pointLightsScratchU  = new Uint32Array(this._pointLightsScratch);
  private readonly _spotLightsScratch    = new ArrayBuffer(SPOT_LIGHT_SIZE * MAX_SPOT_LIGHTS);
  private readonly _spotLightsScratchF   = new Float32Array(this._spotLightsScratch);
  private readonly _spotLightsScratchU   = new Uint32Array(this._spotLightsScratch);

  private _depthTexture: GPUTexture;
  private _depthView: GPUTextureView;
  private _outputTexture: GPUTexture;
  private _outputView: GPUTextureView;

  private _modelBuffers: GPUBuffer[] = [];
  private _modelBindGroups: GPUBindGroup[] = [];
  private _bufferIndex = 0;

  private _load: GPULoadOp;
  private _store: GPUStoreOp;
  private _clearColor: GPUColor;

  private constructor(
    cameraBGL: GPUBindGroupLayout,
    modelBGL: GPUBindGroupLayout,
    lightingIblBGL: GPUBindGroupLayout,
    cameraBuffer: GPUBuffer,
    cameraBindGroup: GPUBindGroup,
    lightingBuffer: GPUBuffer,
    directionalLightBuffer: GPUBuffer,
    pointLightsBuffer: GPUBuffer,
    spotLightsBuffer: GPUBuffer,
    lightingIblBindGroup: GPUBindGroup,
    shadowMapArray: GPUTexture,
    pointShadowCubeArray: GPUTexture,
    depthTexture: GPUTexture,
    depthView: GPUTextureView,
    outputTexture: GPUTexture,
    outputView: GPUTextureView,
    load: GPULoadOp,
    store: GPUStoreOp,
    clearColor: GPUColor,
  ) {
    super();
    this._cameraBGL = cameraBGL;
    this._modelBGL = modelBGL;
    this._lightingIblBGL = lightingIblBGL;
    this._cameraBuffer = cameraBuffer;
    this._cameraBindGroup = cameraBindGroup;
    this._lightingBuffer = lightingBuffer;
    this._directionalLightBuffer = directionalLightBuffer;
    this._pointLightsBuffer = pointLightsBuffer;
    this._spotLightsBuffer = spotLightsBuffer;
    this._lightingIblBindGroup = lightingIblBindGroup;
    this._shadowMapArray = shadowMapArray;
    this._pointShadowCubeArray = pointShadowCubeArray;
    this._depthTexture = depthTexture;
    this._depthView = depthView;
    this._outputTexture = outputTexture;
    this._outputView = outputView;
    this._load = load;
    this._store = store;
    this._clearColor = clearColor;
  }

  /**
   * Build the pass's system bind groups and shadow textures. Pipelines are NOT
   * created up front — they are compiled lazily on the first draw of each
   * unique `material.shaderId`.
   *
   * @param ctx Render context (provides device + framebuffer dimensions).
   * @param options Optional configuration for the forward pass.
   * @returns A configured `ForwardPass`.
   */
  static create(ctx: RenderContext, options: ForwardPassOptions = {}): ForwardPass {
    const { device, width, height } = ctx;
    let { iblTextures, load, store, clearColor } = options;

    load ??= 'clear';
    store ??= 'store';

    if (!iblTextures) {
      // Create fallback 1x1 white cubemaps for IBL if not provided
      const defaultCubemap = ctx.createDefaultCubemap();
      const defaultBrdfLut = ctx.createDefaultBrdfLUT();
      iblTextures = {
        irradiance: defaultCubemap,
        prefiltered: defaultCubemap,
        brdfLut: defaultBrdfLut,
        irradianceView: defaultCubemap.createView({ dimension: 'cube' }),
        prefilteredView: defaultCubemap.createView({ dimension: 'cube' }),
        brdfLutView: defaultBrdfLut.createView(),
        levels: 1,
        destroy() {
          defaultCubemap.destroy();
          defaultBrdfLut.destroy();
        },
      };
    }

    // Bind group layouts (max 4 groups per pipeline in WebGPU)
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
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }, // lighting uniforms
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }, // directional light
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'read-only-storage' } }, // point lights
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'read-only-storage' } }, // spot lights
        { binding: 4, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth', viewDimension: '2d-array' } }, // shadow map array
        { binding: 5, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'comparison' } }, // shadow sampler
        { binding: 6, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float', viewDimension: 'cube' } }, // irradiance
        { binding: 7, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float', viewDimension: 'cube' } }, // prefilter
        { binding: 8, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } }, // brdf lut
        { binding: 9, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } }, // ibl sampler
        { binding: 10, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth', viewDimension: 'cube-array' } }, // point shadow cube array
      ],
    });

    const shadowSampler = device.createSampler({
      label: 'ForwardShadowSampler',
      compare: 'less',
      magFilter: 'linear',
      minFilter: 'linear',
    });

    // Create buffers
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

    // Create samplers
    const iblSampler = device.createSampler({
      magFilter: 'linear',
      minFilter: 'linear',
      mipmapFilter: 'linear',
    });

    // Create shadow map array (8 layers: 1 directional + up to 4 spot + 3 spare)
    const shadowMapArray = device.createTexture({
      label: 'ForwardShadowMapArray',
      size: { width: 2048, height: 2048, depthOrArrayLayers: 8 },
      format: 'depth32float',
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });
    const shadowMapArrayView = shadowMapArray.createView({ dimension: '2d-array' });

    // Cube-array shadow texture for point lights (6 layers per light)
    const pointShadowCubeArray = device.createTexture({
      label: 'ForwardPointShadowCubeArray',
      size: { width: POINT_SHADOW_SIZE, height: POINT_SHADOW_SIZE, depthOrArrayLayers: 6 * MAX_POINT_LIGHTS },
      dimension: '2d',
      format: 'depth32float',
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
    const pointShadowCubeArrayView = pointShadowCubeArray.createView({ dimension: 'cube-array' });

    // Create combined lighting+IBL bind group (to stay under 4 bind group limit)
    const lightingIblBindGroup = device.createBindGroup({
      label: 'ForwardLightingIblBindGroup',
      layout: lightingIblBGL,
      entries: [
        { binding: 0, resource: { buffer: lightingBuffer } },
        { binding: 1, resource: { buffer: directionalLightBuffer } },
        { binding: 2, resource: { buffer: pointLightsBuffer } },
        { binding: 3, resource: { buffer: spotLightsBuffer } },
        { binding: 4, resource: shadowMapArrayView },
        { binding: 5, resource: shadowSampler },
        { binding: 6, resource: iblTextures.irradianceView },
        { binding: 7, resource: iblTextures.prefilteredView },
        { binding: 8, resource: iblTextures.brdfLut.createView() },
        { binding: 9, resource: iblSampler },
        { binding: 10, resource: pointShadowCubeArrayView },
      ],
    });

    // Create render targets
    const depthTexture = device.createTexture({
      label: 'ForwardDepth',
      size: { width, height },
      format: 'depth32float',
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
    const depthView = depthTexture.createView();

    const outputTexture = device.createTexture({
      label: 'ForwardOutput',
      size: { width, height },
      format: 'rgba16float',
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
    const outputView = outputTexture.createView();

    let clear: GPUColor = !clearColor ? [0, 0, 0, 1]
        : 'r' in clearColor ? clearColor
        : Array.isArray(clearColor) ? clearColor as GPUColor
        : clearColor instanceof Vec3 ? [clearColor.x, clearColor.y, clearColor.z, 1]
        : clearColor instanceof Vec4 ? [clearColor.x, clearColor.y, clearColor.z, clearColor.w]
        : [0, 0, 0, 1];

    return new ForwardPass(
      cameraBGL,
      modelBGL,
      lightingIblBGL,
      cameraBuffer,
      cameraBindGroup,
      lightingBuffer,
      directionalLightBuffer,
      pointLightsBuffer,
      spotLightsBuffer,
      lightingIblBindGroup,
      shadowMapArray,
      pointShadowCubeArray,
      depthTexture,
      depthView,
      outputTexture,
      outputView,
      load,
      store,
      clear
    );
  }

  /** Default view of the internal HDR color target written by the pass. */
  get outputView(): GPUTextureView {
    return this._outputView;
  }

  /**
   * Shared 2D-array shadow texture (`depth32float`, 8 layers): layer 0 is the
   * directional cascade-zero map; subsequent layers are spot-light shadows.
   */
  get shadowMapArray(): GPUTexture {
    return this._shadowMapArray;
  }

  /**
   * Shared cube-array shadow texture (`depth32float`, 6 × `MAX_POINT_LIGHTS`
   * layers) that backs point-light omnidirectional shadow maps.
   */
  get pointShadowCubeArray(): GPUTexture {
    return this._pointShadowCubeArray;
  }

  /**
   * Recreate the color and depth render targets for a new framebuffer size.
   *
   * Existing HDR / depth textures are destroyed and replaced; bind groups that
   * reference them must be regenerated externally.
   *
   * @param device Active GPU device.
   * @param width New width in pixels.
   * @param height New height in pixels.
   */
  resize(device: GPUDevice, width: number, height: number): void {
    // Destroy old textures
    this._depthTexture.destroy();
    this._outputTexture.destroy();

    // Create new textures with updated size
    this._depthTexture = device.createTexture({
      label: 'ForwardDepth',
      size: { width, height },
      format: 'depth32float',
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
    this._depthView = this._depthTexture.createView();

    this._outputTexture = device.createTexture({
      label: 'ForwardOutput',
      size: { width, height },
      format: 'rgba16float',
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
    this._outputView = this._outputTexture.createView();
  }

  /**
   * Replace the draw list for the next `execute` call. Items are partitioned
   * into opaque and transparent buckets up front based on
   * `item.material.transparent`; transparents are drawn after opaques with
   * depth-write disabled.
   *
   * @param items All meshes to render this frame, in any order.
   */
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

  /**
   * Upload per-frame camera uniforms (matrices, world-space position, clip planes).
   *
   * @param ctx Render context for queue access.
   * @param view World-to-view matrix.
   * @param proj View-to-clip matrix.
   * @param viewProj Pre-multiplied `proj * view`.
   * @param invViewProj Inverse of `viewProj`.
   * @param camPos Camera world-space position.
   * @param near Near clip-plane distance.
   * @param far Far clip-plane distance.
   */
  updateCamera(
    ctx: RenderContext,
    view: Mat4,
    proj: Mat4,
    viewProj: Mat4,
    invViewProj: Mat4,
    camPos: Vec3,
    near: number,
    far: number,
  ): void {
    const data = this._cameraScratch;
    data.set(view.data, 0);
    data.set(proj.data, 16);
    data.set(viewProj.data, 32);
    data.set(invViewProj.data, 48);
    data[64] = camPos.x;
    data[65] = camPos.y;
    data[66] = camPos.z;
    data[67] = near;
    data[68] = far;
    this._camPos[0] = camPos.x;
    this._camPos[1] = camPos.y;
    this._camPos[2] = camPos.z;
    ctx.device.queue.writeBuffer(this._cameraBuffer, 0, data);
  }

  /**
   * Copy a single shadow map into one slice of the shared 2D-array shadow texture.
   *
   * Used by the renderer to stage external shadow maps (e.g. cascade-zero from
   * the directional shadow pass, or per-spot maps) into the slot the forward
   * shader expects.
   *
   * @param encoder Command encoder used to record the copy.
   * @param sourceTexture Single-layer source texture (must be `depth32float`,
   *   `size×size`).
   * @param arrayLayer Destination layer index in the shadow array (0 = directional).
   * @param size Side length of the square shadow map; defaults to 2048.
   */
  copyShadowMapToArray(encoder: GPUCommandEncoder, sourceTexture: GPUTexture, arrayLayer: number, size: number = 2048): void {
    encoder.copyTextureToTexture(
      { texture: sourceTexture },
      { texture: this._shadowMapArray, origin: { x: 0, y: 0, z: arrayLayer } },
      { width: size, height: size, depthOrArrayLayers: 1 }
    );
  }

  /**
   * Ensures a spot light's `lightViewProj` is computed from its position,
   * direction, outerAngle, and range. Safe to call multiple times — recomputed
   * each call so field changes are reflected.
   */
  updateLight(light: SpotLight): void {
    light.computeLightViewProj();
  }

  /**
   * Upload all light data for the next frame: counts uniform, the single
   * directional light, then truncated point and spot light arrays.
   *
   * Light counts are clamped to `MAX_POINT_LIGHTS` / `MAX_SPOT_LIGHTS`. Spot
   * shadow indices are assigned by array order (1..N), reserving layer 0 of
   * the cascade shadow array for the directional light.
   *
   * @param ctx Render context for queue access.
   * @param directionalLight Sun-style directional light state.
   * @param pointLights Point lights in the scene; extras beyond the cap are ignored.
   * @param spotLights Spot lights in the scene; extras beyond the cap are ignored.
   */
  updateLights(
    ctx: RenderContext,
    directionalLight: DirectionalLight,
    pointLights: PointLight[],
    spotLights: SpotLight[],
  ): void {
    // Update lighting counts
    const lightingData = this._lightingScratch;
    lightingData[0] = Math.min(pointLights.length, MAX_POINT_LIGHTS);
    lightingData[1] = Math.min(spotLights.length, MAX_SPOT_LIGHTS);
    lightingData[2] = 0;
    lightingData[3] = 0;
    ctx.device.queue.writeBuffer(this._lightingBuffer, 0, lightingData);

    // Update directional light (128 bytes = 32 floats)
    const dirBuffer = this._directionalScratch;
    const dirData = this._directionalScratchF;
    const dirDataU32 = this._directionalScratchU;
    dirData.fill(0);
    // offset 0: direction vec3<f32> (aligned to 16)
    dirData[0] = directionalLight.direction.x;
    dirData[1] = directionalLight.direction.y;
    dirData[2] = directionalLight.direction.z;
    // offset 12: intensity f32
    dirData[3] = directionalLight.intensity;
    // offset 16: color vec3<f32> (aligned to 16)
    dirData[4] = directionalLight.color.x;
    dirData[5] = directionalLight.color.y;
    dirData[6] = directionalLight.color.z;
    // offset 28: castShadows u32
    dirDataU32[7] = directionalLight.castShadows ? 1 : 0;
    // offset 32: shadowMapIndex u32
    dirDataU32[8] = 0; // shadowMapIndex (always 0 for directional light)
    // offset 36-47: padding (dirData[9-11] are unused)
    // offset 48-59: _pad vec3<u32> (vec3 requires 16-byte alignment, so it starts at 48)
    // offset 60-63: padding before matrix
    // offset 64-127: lightViewProj mat4x4<f32> (starts at index 16)
    if (directionalLight.lightViewProj) {
      dirData.set(directionalLight.lightViewProj.data, 16);
    }
    ctx.device.queue.writeBuffer(this._directionalLightBuffer, 0, dirBuffer);

    // Update point lights
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
        pointDataU32[offset + 8] = light.castShadows ? 1 : 0; // u32
        // offset + 9, 10, 11 are padding
      }
      ctx.device.queue.writeBuffer(this._pointLightsBuffer, 0, buffer);
    }

    // Update spot lights
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
        spotDataU32[offset + 13] = light.castShadows ? 1 : 0; // u32
        spotDataU32[offset + 14] = light.castShadows ? (i + 1) : 0; // u32 shadowMapIndex: directional=0, spot lights start at 1
        // offset + 15 is padding
        // Write view-projection matrix starting at offset 16
        spotData.set(light.lightViewProj.data, offset + 16);
      }
      ctx.device.queue.writeBuffer(this._spotLightsBuffer, 0, buffer);
    }

  }

  /**
   * Encode the forward render pass: clears the color and depth attachments,
   * draws all opaque items with the opaque pipeline variant for each material's
   * shader, then all transparents with the alpha-blended variant.
   *
   * If `outputView` is omitted, the pass renders into the swapchain when its
   * format is `rgba16float`, otherwise into the internal HDR target.
   *
   * @param encoder Command encoder to record into.
   * @param ctx Render context (provides device + current swapchain texture).
   * @param outputView Optional override color attachment.
   * @param depthView Optional override depth attachment.
   */
  execute(encoder: GPUCommandEncoder, ctx: RenderContext, outputView?: GPUTextureView, depthView?: GPUTextureView): void {
    // If no output view provided and context is HDR-capable, render directly to canvas
    const colorView = outputView ?? (ctx.format === 'rgba16float' ? ctx.getCurrentTexture().createView() : this._outputView);
    const depthAttachmentView = depthView ?? this._depthView;

    const pass = encoder.beginRenderPass({
      label: 'ForwardRenderPass',
      colorAttachments: [
        {
          view: colorView,
          clearValue: this._clearColor ?? { r: 0.0, g: 0.0, b: 1.0, a: 1.0 },
          loadOp: this._load,
          storeOp: this._store,
        },
      ],
      depthStencilAttachment: {
        view: depthAttachmentView,
        depthClearValue: 1.0,
        depthLoadOp: this._load,
        depthStoreOp: this._store,
      },
    });

    pass.setBindGroup(0, this._cameraBindGroup);
    pass.setBindGroup(3, this._lightingIblBindGroup);

    // Draw opaque objects
    for (const item of this._opaqueItems) {
      this._drawItem(pass, ctx, item, false);
    }

    // Draw transparent objects
    for (const item of this._transparentItems) {
      this._drawItem(pass, ctx, item, true);
    }

    pass.end();
  }

  private _drawItem(pass: GPURenderPassEncoder, ctx: RenderContext, item: ForwardDrawItem, transparent: boolean): void {
    const device = ctx.device;
    const material = item.material;

    // Let the material flush dirty CPU-side parameters into its uniform buffers.
    material.update?.(ctx.queue);

    // Compile (or fetch cached) pipeline for this material's shader.
    pass.setPipeline(this._getPipeline(device, material, transparent));

    // Per-draw model uniform.
    this._modelData.set(item.modelMatrix.data, 0);
    this._modelData.set(item.normalMatrix.data, 16);
    const modelBuffer = this._getOrCreateModelBuffer(device);
    ctx.queue.writeBuffer(modelBuffer, 0, this._modelData);

    pass.setBindGroup(1, this._getOrCreateModelBindGroup(device));
    pass.setBindGroup(2, material.getBindGroup(device));

    pass.setVertexBuffer(0, item.mesh.vertexBuffer);
    pass.setIndexBuffer(item.mesh.indexBuffer, 'uint32');
    pass.drawIndexed(item.mesh.indexCount);
  }

  private _getPipeline(device: GPUDevice, material: Material, transparent: boolean): GPURenderPipeline {
    const cache = transparent ? this._transparentPipelineCache : this._opaquePipelineCache;
    let pipeline = cache.get(material.shaderId);
    if (pipeline) {
      return pipeline;
    }

    const shaderModule = device.createShaderModule({
      label: `ForwardShader[${material.shaderId}]`,
      code: material.getShaderCode(MaterialPassType.Forward),
    });

    const layout = device.createPipelineLayout({
      label: `ForwardPipelineLayout[${material.shaderId}]`,
      bindGroupLayouts: [
        this._cameraBGL,
        this._modelBGL,
        material.getBindGroupLayout(device),
        this._lightingIblBGL,
      ],
    });

    const colorTarget: GPUColorTargetState = transparent
      ? {
          format: 'rgba16float',
          blend: {
            color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' },
            alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
          },
        }
      : { format: 'rgba16float' };

    pipeline = device.createRenderPipeline({
      label: `ForwardPipeline[${material.shaderId}${transparent ? ':t' : ''}]`,
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
        format: 'depth32float',
        depthWriteEnabled: !transparent,
        depthCompare: 'less',
      },
      primitive: {
        topology: 'triangle-list',
        cullMode: 'back',
      },
    });
    cache.set(material.shaderId, pipeline);
    return pipeline;
  }

  private _getOrCreateModelBuffer(device: GPUDevice): GPUBuffer {
    const idx = this._bufferIndex % 32;
    if (!this._modelBuffers[idx]) {
      this._modelBuffers[idx] = device.createBuffer({
        label: `ForwardModelBuffer${idx}`,
        size: MODEL_UNIFORM_SIZE,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
    }
    return this._modelBuffers[idx];
  }

  private _getOrCreateModelBindGroup(device: GPUDevice): GPUBindGroup {
    const idx = this._bufferIndex++ % 32;
    if (!this._modelBindGroups[idx]) {
      this._modelBindGroups[idx] = device.createBindGroup({
        label: `ForwardModelBG${idx}`,
        layout: this._modelBGL,
        entries: [
          { binding: 0, resource: { buffer: this._modelBuffers[idx] } },
        ],
      });
    }
    return this._modelBindGroups[idx];
  }

  /**
   * Release every GPU resource owned by the pass: render targets, shadow
   * arrays, and uniform / per-draw buffers. Pipelines, bind groups, and
   * material-owned resources are GC'd / destroyed by their owners.
   */
  destroy(): void {
    this._depthTexture.destroy();
    this._outputTexture.destroy();
    this._shadowMapArray.destroy();
    this._pointShadowCubeArray.destroy();
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
