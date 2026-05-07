import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import { VERTEX_ATTRIBUTES, VERTEX_STRIDE } from '../../assets/mesh.js';
import type { Mesh } from '../../assets/mesh.js';
import type { Mat4 } from '../../math/mat4.js';
import type { Vec3 } from '../../math/vec3.js';
import type { Material } from '../../engine/components/mesh_renderer.js';
import type { IblTextures } from '../../assets/ibl.js';
import forwardPbrWgsl from '../../shaders/forward_pbr.wgsl?raw';

const CAMERA_UNIFORM_SIZE = 64 * 4 + 16 + 16;
const MODEL_UNIFORM_SIZE = 128;
const MATERIAL_UNIFORM_SIZE = 48;
const LIGHTING_UNIFORM_SIZE = 16;
const DIRECTIONAL_LIGHT_SIZE = 128; // vec3 direction (16) + f32 intensity (4) + vec3 color (16) + u32 castShadows (4) + u32 shadowMapIndex (4) + vec3 _pad (16 aligned) + mat4x4 lightViewProj (64) = 128
const POINT_LIGHT_SIZE = 48;
const SPOT_LIGHT_SIZE = 128; // 13 floats + 1 u32 (castShadows) + 1 u32 (shadowMapIndex) + 1 u32 padding + 16 floats (viewProj) = 32 * 4 = 128
const MAX_POINT_LIGHTS = 8;
const MAX_SPOT_LIGHTS = 4;

export interface ForwardDrawItem {
  mesh: Mesh;
  modelMatrix: Mat4;
  normalMatrix: Mat4;
  material: Material;
  transparent?: boolean;
}

export interface DirectionalLightData {
  direction: Vec3;
  intensity: number;
  color: Vec3;
  castShadows: boolean;
  lightViewProj?: Mat4;
  shadowMap?: GPUTextureView;
}

export interface PointLightData {
  position: Vec3;
  range: number;
  color: Vec3;
  intensity: number;
  castShadows?: boolean;
}

export interface SpotLightData {
  position: Vec3;
  range: number;
  direction: Vec3;
  innerAngle: number;
  color: Vec3;
  outerAngle: number;
  intensity: number;
  castShadows?: boolean;
  lightViewProj?: Mat4;
  shadowMap?: GPUTextureView;
}

export class ForwardPass extends RenderPass {
  readonly name = 'ForwardPass';

  private _opaquePipeline: GPURenderPipeline;
  private _transparentPipeline: GPURenderPipeline;

  private _modelMaterialBGL: GPUBindGroupLayout;
  private _textureBGL: GPUBindGroupLayout;

  private _cameraBuffer: GPUBuffer;
  private _cameraBindGroup: GPUBindGroup;

  private _lightingBuffer: GPUBuffer;
  private _directionalLightBuffer: GPUBuffer;
  private _pointLightsBuffer: GPUBuffer;
  private _spotLightsBuffer: GPUBuffer;
  private _lightingIblBindGroup: GPUBindGroup;

  private _shadowMapArray: GPUTexture;

  private _whiteTex: GPUTexture;
  private _flatNormalTex: GPUTexture;
  private _merDefaultTex: GPUTexture;
  private _whiteView: GPUTextureView;
  private _flatNormalView: GPUTextureView;
  private _merDefaultView: GPUTextureView;
  private _materialSampler: GPUSampler;

  private _textureBGs = new WeakMap<object, GPUBindGroup>();

  private _opaqueItems: ForwardDrawItem[] = [];
  private _transparentItems: ForwardDrawItem[] = [];

  private readonly _modelData = new Float32Array(32);
  private readonly _matData = new Float32Array(12);

  private _depthTexture: GPUTexture;
  private _depthView: GPUTextureView;
  private _outputTexture: GPUTexture;
  private _outputView: GPUTextureView;

  private constructor(
    opaquePipeline: GPURenderPipeline,
    transparentPipeline: GPURenderPipeline,
    modelMaterialBGL: GPUBindGroupLayout,
    textureBGL: GPUBindGroupLayout,
    cameraBuffer: GPUBuffer,
    cameraBindGroup: GPUBindGroup,
    lightingBuffer: GPUBuffer,
    directionalLightBuffer: GPUBuffer,
    pointLightsBuffer: GPUBuffer,
    spotLightsBuffer: GPUBuffer,
    lightingIblBindGroup: GPUBindGroup,
    shadowMapArray: GPUTexture,
    whiteTex: GPUTexture,
    whiteView: GPUTextureView,
    flatNormalTex: GPUTexture,
    flatNormalView: GPUTextureView,
    merDefaultTex: GPUTexture,
    merDefaultView: GPUTextureView,
    materialSampler: GPUSampler,
    depthTexture: GPUTexture,
    depthView: GPUTextureView,
    outputTexture: GPUTexture,
    outputView: GPUTextureView,
  ) {
    super();
    this._opaquePipeline = opaquePipeline;
    this._transparentPipeline = transparentPipeline;
    this._modelMaterialBGL = modelMaterialBGL;
    this._textureBGL = textureBGL;
    this._cameraBuffer = cameraBuffer;
    this._cameraBindGroup = cameraBindGroup;
    this._lightingBuffer = lightingBuffer;
    this._directionalLightBuffer = directionalLightBuffer;
    this._pointLightsBuffer = pointLightsBuffer;
    this._spotLightsBuffer = spotLightsBuffer;
    this._lightingIblBindGroup = lightingIblBindGroup;
    this._shadowMapArray = shadowMapArray;
    this._whiteTex = whiteTex;
    this._whiteView = whiteView;
    this._flatNormalTex = flatNormalTex;
    this._flatNormalView = flatNormalView;
    this._merDefaultTex = merDefaultTex;
    this._merDefaultView = merDefaultView;
    this._materialSampler = materialSampler;
    this._depthTexture = depthTexture;
    this._depthView = depthView;
    this._outputTexture = outputTexture;
    this._outputView = outputView;
  }

  static create(ctx: RenderContext, iblTextures: IblTextures): ForwardPass {
    const { device, width, height } = ctx;

    // Bind group layouts (max 4 groups per pipeline in WebGPU)
    const cameraBGL = device.createBindGroupLayout({
      label: 'ForwardCameraBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
      ],
    });

    const modelMaterialBGL = device.createBindGroupLayout({
      label: 'ForwardModelMaterialBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }, // model
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }, // material
      ],
    });

    const textureBGL = device.createBindGroupLayout({
      label: 'ForwardTextureBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
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
      ],
    });

    // Create fallback textures
    function makeTex(label: string, r: number, g: number, b: number, a: number): [GPUTexture, GPUTextureView] {
      const t = device.createTexture({
        label,
        size: { width: 1, height: 1 },
        format: 'rgba8unorm',
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
      });
      device.queue.writeTexture({ texture: t }, new Uint8Array([r, g, b, a]), { bytesPerRow: 4 }, { width: 1, height: 1 });
      return [t, t.createView()];
    }

    const [whiteTex, whiteView] = makeTex('ForwardWhite', 255, 255, 255, 255);
    const [flatNormalTex, flatNormalView] = makeTex('ForwardFlatNormal', 128, 128, 255, 255);
    const [merDefaultTex, merDefaultView] = makeTex('ForwardMerDefault', 255, 0, 255, 255);

    const materialSampler = device.createSampler({
      label: 'ForwardMaterialSampler',
      magFilter: 'linear',
      minFilter: 'linear',
      addressModeU: 'repeat',
      addressModeV: 'repeat',
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

    // Create pipelines
    const shaderModule = device.createShaderModule({
      label: 'ForwardPBRShader',
      code: forwardPbrWgsl,
    });

    const pipelineLayout = device.createPipelineLayout({
      bindGroupLayouts: [cameraBGL, modelMaterialBGL, textureBGL, lightingIblBGL],
    });

    const opaquePipeline = device.createRenderPipeline({
      label: 'ForwardOpaquePipeline',
      layout: pipelineLayout,
      vertex: {
        module: shaderModule,
        entryPoint: 'vs_main',
        buffers: [{ arrayStride: VERTEX_STRIDE, attributes: VERTEX_ATTRIBUTES }],
      },
      fragment: {
        module: shaderModule,
        entryPoint: 'fs_main',
        targets: [{ format: 'rgba16float' }],
      },
      depthStencil: {
        format: 'depth32float',
        depthWriteEnabled: true,
        depthCompare: 'less',
      },
      primitive: {
        topology: 'triangle-list',
        cullMode: 'back',
      },
    });

    const transparentPipeline = device.createRenderPipeline({
      label: 'ForwardTransparentPipeline',
      layout: pipelineLayout,
      vertex: {
        module: shaderModule,
        entryPoint: 'vs_main',
        buffers: [{ arrayStride: VERTEX_STRIDE, attributes: VERTEX_ATTRIBUTES }],
      },
      fragment: {
        module: shaderModule,
        entryPoint: 'fs_main',
        targets: [
          {
            format: 'rgba16float',
            blend: {
              color: {
                srcFactor: 'src-alpha',
                dstFactor: 'one-minus-src-alpha',
                operation: 'add',
              },
              alpha: {
                srcFactor: 'one',
                dstFactor: 'one-minus-src-alpha',
                operation: 'add',
              },
            },
          },
        ],
      },
      depthStencil: {
        format: 'depth32float',
        depthWriteEnabled: false,
        depthCompare: 'less',
      },
      primitive: {
        topology: 'triangle-list',
        cullMode: 'back',
      },
    });

    return new ForwardPass(
      opaquePipeline,
      transparentPipeline,
      modelMaterialBGL,
      textureBGL,
      cameraBuffer,
      cameraBindGroup,
      lightingBuffer,
      directionalLightBuffer,
      pointLightsBuffer,
      spotLightsBuffer,
      lightingIblBindGroup,
      shadowMapArray,
      whiteTex,
      whiteView,
      flatNormalTex,
      flatNormalView,
      merDefaultTex,
      merDefaultView,
      materialSampler,
      depthTexture,
      depthView,
      outputTexture,
      outputView,
    );
  }

  get outputView(): GPUTextureView {
    return this._outputView;
  }

  get shadowMapArray(): GPUTexture {
    return this._shadowMapArray;
  }

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

  setDrawItems(items: ForwardDrawItem[]): void {
    this._opaqueItems = items.filter((item) => !item.transparent);
    this._transparentItems = items.filter((item) => item.transparent);
  }

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
    const data = new Float32Array(CAMERA_UNIFORM_SIZE / 4);
    data.set(view.data, 0);
    data.set(proj.data, 16);
    data.set(viewProj.data, 32);
    data.set(invViewProj.data, 48);
    data[64] = camPos.x;
    data[65] = camPos.y;
    data[66] = camPos.z;
    data[67] = near;
    data[68] = far;
    ctx.device.queue.writeBuffer(this._cameraBuffer, 0, data);
  }

  copyShadowMapToArray(encoder: GPUCommandEncoder, sourceTexture: GPUTexture, arrayLayer: number, size: number = 2048): void {
    encoder.copyTextureToTexture(
      { texture: sourceTexture },
      { texture: this._shadowMapArray, origin: { x: 0, y: 0, z: arrayLayer } },
      { width: size, height: size, depthOrArrayLayers: 1 }
    );
  }

  updateLights(
    ctx: RenderContext,
    directionalLight: DirectionalLightData,
    pointLights: PointLightData[],
    spotLights: SpotLightData[],
  ): void {
    // Update lighting counts
    const lightingData = new Uint32Array(4);
    lightingData[0] = Math.min(pointLights.length, MAX_POINT_LIGHTS);
    lightingData[1] = Math.min(spotLights.length, MAX_SPOT_LIGHTS);
    ctx.device.queue.writeBuffer(this._lightingBuffer, 0, lightingData);

    // Update directional light (128 bytes = 32 floats)
    const dirBuffer = new ArrayBuffer(128);
    const dirData = new Float32Array(dirBuffer);
    const dirDataU32 = new Uint32Array(dirBuffer);
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
    // offset 36: _pad vec3<u32> (aligned to 48)
    // dirData[9-11] are padding, skip to index 12 (offset 48)
    // offset 64: lightViewProj mat4x4<f32> (aligned to 16)
    if (directionalLight.lightViewProj) {
      dirData.set(directionalLight.lightViewProj.data, 16);
    }
    ctx.device.queue.writeBuffer(this._directionalLightBuffer, 0, dirBuffer);

    // Update point lights
    if (pointLights.length > 0) {
      const buffer = new ArrayBuffer(POINT_LIGHT_SIZE * MAX_POINT_LIGHTS);
      const pointData = new Float32Array(buffer);
      const pointDataU32 = new Uint32Array(buffer);
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
      const buffer = new ArrayBuffer(MAX_SPOT_LIGHTS * 128);
      const spotData = new Float32Array(buffer);
      const spotDataU32 = new Uint32Array(buffer);

      for (let i = 0; i < Math.min(spotLights.length, MAX_SPOT_LIGHTS); i++) {
        const light = spotLights[i];
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
        if (light.lightViewProj) {
          spotData.set(light.lightViewProj.data, offset + 16);
        }
      }
      ctx.device.queue.writeBuffer(this._spotLightsBuffer, 0, buffer);
    }

  }

  execute(encoder: GPUCommandEncoder, ctx: RenderContext, outputView?: GPUTextureView, depthView?: GPUTextureView): void {
    // If no output view provided and context is HDR-capable, render directly to canvas
    const colorView = outputView ?? (ctx.format === 'rgba16float' ? ctx.getCurrentTexture().createView() : this._outputView);
    const depthAttachmentView = depthView ?? this._depthView;

    const pass = encoder.beginRenderPass({
      label: 'ForwardRenderPass',
      colorAttachments: [
        {
          view: colorView,
          clearValue: { r: 0.0, g: 0.0, b: 1.0, a: 1.0 },
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
      depthStencilAttachment: {
        view: depthAttachmentView,
        depthClearValue: 1.0,
        depthLoadOp: 'clear',
        depthStoreOp: 'store',
      },
    });

    pass.setBindGroup(0, this._cameraBindGroup);
    pass.setBindGroup(3, this._lightingIblBindGroup);

    // Draw opaque objects
    pass.setPipeline(this._opaquePipeline);
    for (const item of this._opaqueItems) {
      this._drawItem(pass, ctx, item);
    }

    // Draw transparent objects
    pass.setPipeline(this._transparentPipeline);
    for (const item of this._transparentItems) {
      this._drawItem(pass, ctx, item);
    }

    pass.end();
  }

  private _drawItem(pass: GPURenderPassEncoder, ctx: RenderContext, item: ForwardDrawItem): void {
    // Model uniform
    this._modelData.set(item.modelMatrix.data, 0);
    this._modelData.set(item.normalMatrix.data, 16);
    ctx.device.queue.writeBuffer(this._getOrCreateModelBuffer(ctx.device), 0, this._modelData);

    // Material uniform
    const mat = item.material;
    this._matData[0] = mat.albedo[0];
    this._matData[1] = mat.albedo[1];
    this._matData[2] = mat.albedo[2];
    this._matData[3] = mat.albedo[3];
    this._matData[4] = mat.roughness;
    this._matData[5] = mat.metallic ?? 0.0;
    this._matData[6] = mat.uvOffset?.[0] ?? 0.0;
    this._matData[7] = mat.uvOffset?.[1] ?? 0.0;
    this._matData[8] = mat.uvScale?.[0] ?? 1.0;
    this._matData[9] = mat.uvScale?.[1] ?? 1.0;
    this._matData[10] = mat.uvTile?.[0] ?? 1.0;
    this._matData[11] = mat.uvTile?.[1] ?? 1.0;
    ctx.device.queue.writeBuffer(this._getOrCreateMaterialBuffer(ctx.device), 0, this._matData);

    pass.setBindGroup(1, this._getOrCreateModelMaterialBindGroup(ctx.device));
    pass.setBindGroup(2, this._getOrCreateTextureBindGroup(ctx.device, mat));

    pass.setVertexBuffer(0, item.mesh.vertexBuffer);
    pass.setIndexBuffer(item.mesh.indexBuffer, 'uint32');
    pass.drawIndexed(item.mesh.indexCount);
  }

  private _bufferIndex = 0;

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

  private _getOrCreateMaterialBuffer(device: GPUDevice): GPUBuffer {
    const idx = this._bufferIndex % 32;
    if (!this._materialBuffers[idx]) {
      this._materialBuffers[idx] = device.createBuffer({
        label: `ForwardMaterialBuffer${idx}`,
        size: MATERIAL_UNIFORM_SIZE,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
    }
    return this._materialBuffers[idx];
  }

  private _getOrCreateModelMaterialBindGroup(device: GPUDevice): GPUBindGroup {
    const idx = this._bufferIndex++ % 32;
    if (!this._modelMaterialBindGroups[idx]) {
      this._modelMaterialBindGroups[idx] = device.createBindGroup({
        label: `ForwardModelMaterialBG${idx}`,
        layout: this._modelMaterialBGL,
        entries: [
          { binding: 0, resource: { buffer: this._modelBuffers[idx] } },
          { binding: 1, resource: { buffer: this._materialBuffers[idx] } },
        ],
      });
    }
    return this._modelMaterialBindGroups[idx];
  }

  private _modelBuffers: GPUBuffer[] = [];
  private _materialBuffers: GPUBuffer[] = [];
  private _modelMaterialBindGroups: GPUBindGroup[] = [];

  private _getOrCreateTextureBindGroup(device: GPUDevice, material: Material): GPUBindGroup {
    let bg = this._textureBGs.get(material);
    if (!bg) {
      const albedoView = material.albedoMap?.view ?? this._whiteView;
      const normalView = material.normalMap?.view ?? this._flatNormalView;
      const merView = material.merMap?.view ?? this._merDefaultView;

      bg = device.createBindGroup({
        label: 'ForwardTextureBG',
        layout: this._textureBGL,
        entries: [
          { binding: 0, resource: albedoView },
          { binding: 1, resource: normalView },
          { binding: 2, resource: merView },
          { binding: 3, resource: this._materialSampler },
        ],
      });
      this._textureBGs.set(material, bg);
    }
    return bg;
  }

  destroy(): void {
    this._depthTexture.destroy();
    this._outputTexture.destroy();
    this._whiteTex.destroy();
    this._flatNormalTex.destroy();
    this._merDefaultTex.destroy();
    this._cameraBuffer.destroy();
    this._lightingBuffer.destroy();
    this._directionalLightBuffer.destroy();
    this._pointLightsBuffer.destroy();
    this._spotLightsBuffer.destroy();
    for (const buf of this._modelBuffers) {
      buf.destroy();
    }
    for (const buf of this._materialBuffers) {
      buf.destroy();
    }
  }
}
