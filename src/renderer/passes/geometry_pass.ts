import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import type { GBuffer } from '../gbuffer.js';
import { VERTEX_ATTRIBUTES, VERTEX_STRIDE } from '../../assets/mesh.js';
import type { Mesh } from '../../assets/mesh.js';
import type { Mat4 } from '../../math/mat4.js';
import type { Material } from '../../engine/components/mesh_renderer.js';
import geometryWgsl from '../../shaders/geometry.wgsl?raw';

const CAMERA_UNIFORM_SIZE = 64 * 4 + 16 + 16; // 4 mat4 + vec3+f32 + vec3+f32
const MODEL_UNIFORM_SIZE = 128;                 // 2 mat4
const MATERIAL_UNIFORM_SIZE = 48;               // vec4 + 2 f32 + 2 vec2 + vec2 pad

export interface DrawItem {
  mesh: Mesh;
  modelMatrix: Mat4;
  normalMatrix: Mat4;
  material: Material;
}

export class GeometryPass extends RenderPass {
  readonly name = 'GeometryPass';

  private _gbuffer: GBuffer;
  private _pipeline: GPURenderPipeline;

  private _modelBGL: GPUBindGroupLayout;
  private _materialBGL: GPUBindGroupLayout;
  private _textureBGL: GPUBindGroupLayout;

  private _cameraBuffer: GPUBuffer;
  private _cameraBindGroup: GPUBindGroup;

  private _modelBuffers: GPUBuffer[] = [];
  private _modelBindGroups: GPUBindGroup[] = [];
  private _materialBuffers: GPUBuffer[] = [];
  private _materialBindGroups: GPUBindGroup[] = [];

  // Fallback 1×1 textures used when a material has no albedoMap / normalMap / merMap.
  private _whiteTex      : GPUTexture;  // (1,1,1,1) — albedo fallback
  private _flatNormalTex : GPUTexture;  // (0.5,0.5,1,1) → (0,0,1) tangent-space — normal fallback
  private _merDefaultTex : GPUTexture;  // (1,1,1,1) → metallic×1, roughness×1 — MER fallback
  private _whiteView     : GPUTextureView;
  private _flatNormalView: GPUTextureView;
  private _merDefaultView: GPUTextureView;
  private _materialSampler: GPUSampler;

  // Cache texture bind groups by material object identity. Keyed as WeakMap so entries
  // are collected when a material is no longer referenced.
  private _textureBGs = new WeakMap<object, GPUBindGroup>();

  private _drawItems: DrawItem[] = [];

  // Pre-allocated staging buffers — reused per draw call to avoid per-frame GC.
  private readonly _modelData = new Float32Array(32);
  private readonly _matData   = new Float32Array(12);

  private constructor(
    gbuffer: GBuffer,
    pipeline: GPURenderPipeline,
    _cameraBGL: GPUBindGroupLayout,
    modelBGL: GPUBindGroupLayout,
    materialBGL: GPUBindGroupLayout,
    textureBGL: GPUBindGroupLayout,
    cameraBuffer: GPUBuffer,
    cameraBindGroup: GPUBindGroup,
    whiteTex: GPUTexture, whiteView: GPUTextureView,
    flatNormalTex: GPUTexture, flatNormalView: GPUTextureView,
    merDefaultTex: GPUTexture, merDefaultView: GPUTextureView,
    materialSampler: GPUSampler,
  ) {
    super();
    this._gbuffer = gbuffer;
    this._pipeline = pipeline;
    this._modelBGL = modelBGL;
    this._materialBGL = materialBGL;
    this._textureBGL = textureBGL;
    this._cameraBuffer = cameraBuffer;
    this._cameraBindGroup = cameraBindGroup;
    this._whiteTex = whiteTex;
    this._whiteView = whiteView;
    this._flatNormalTex = flatNormalTex;
    this._flatNormalView = flatNormalView;
    this._merDefaultTex = merDefaultTex;
    this._merDefaultView = merDefaultView;
    this._materialSampler = materialSampler;
  }

  static create(ctx: RenderContext, gbuffer: GBuffer): GeometryPass {
    const { device } = ctx;

    const cameraBGL = device.createBindGroupLayout({
      label: 'GeomCameraBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
    });
    const modelBGL = device.createBindGroupLayout({
      label: 'GeomModelBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
    });
    const materialBGL = device.createBindGroupLayout({
      label: 'GeomMaterialBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
    });
    const textureBGL = device.createBindGroupLayout({
      label: 'GeomTextureBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } }, // albedoMap
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } }, // normalMap
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } }, // merMap
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    // Fallback textures (created once, shared across all draw calls)
    function makeTex(label: string, r: number, g: number, b: number, a: number): [GPUTexture, GPUTextureView] {
      const t = device.createTexture({
        label, size: { width: 1, height: 1 }, format: 'rgba8unorm',
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
      });
      device.queue.writeTexture({ texture: t }, new Uint8Array([r, g, b, a]), { bytesPerRow: 4 }, { width: 1, height: 1 });
      return [t, t.createView()];
    }
    const [whiteTex,      whiteView]      = makeTex('GeomWhite',      255, 255, 255, 255);
    const [flatNormalTex, flatNormalView] = makeTex('GeomFlatNormal', 128, 128, 255, 255);
    const [merDefaultTex, merDefaultView] = makeTex('GeomMerDefault', 255, 0, 255, 255); // R=metallic, G=emission(0), B=roughness

    const materialSampler = device.createSampler({
      label: 'GeomMaterialSampler',
      magFilter: 'nearest', minFilter: 'nearest',
      addressModeU: 'repeat', addressModeV: 'repeat',
    });

    const cameraBuffer = device.createBuffer({
      label: 'GeomCameraBuffer',
      size: CAMERA_UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const cameraBindGroup = device.createBindGroup({
      label: 'GeomCameraBindGroup', layout: cameraBGL,
      entries: [{ binding: 0, resource: { buffer: cameraBuffer } }],
    });

    const shaderModule = device.createShaderModule({ label: 'GeometryShader', code: geometryWgsl });

    const pipeline = device.createRenderPipeline({
      label: 'GeometryPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [cameraBGL, modelBGL, materialBGL, textureBGL] }),
      vertex: {
        module: shaderModule, entryPoint: 'vs_main',
        buffers: [{ arrayStride: VERTEX_STRIDE, attributes: VERTEX_ATTRIBUTES }],
      },
      fragment: {
        module: shaderModule, entryPoint: 'fs_main',
        targets: [
          { format: 'rgba8unorm' },    // albedo+roughness
          { format: 'rgba16float' },   // normal+metallic
        ],
      },
      depthStencil: { format: 'depth32float', depthWriteEnabled: true, depthCompare: 'less' },
      primitive: { topology: 'triangle-list', cullMode: 'back' },
    });

    return new GeometryPass(
      gbuffer, pipeline, cameraBGL, modelBGL, materialBGL, textureBGL,
      cameraBuffer, cameraBindGroup,
      whiteTex, whiteView, flatNormalTex, flatNormalView, merDefaultTex, merDefaultView,
      materialSampler,
    );
  }

  setDrawItems(items: DrawItem[]): void {
    this._drawItems = items;
  }

  updateCamera(ctx: RenderContext, view: Mat4, proj: Mat4, viewProj: Mat4, invViewProj: Mat4, camPos: { x: number; y: number; z: number }, near: number, far: number): void {
    const data = new Float32Array(CAMERA_UNIFORM_SIZE / 4);
    data.set(view.data,         0);
    data.set(proj.data,        16);
    data.set(viewProj.data,    32);
    data.set(invViewProj.data, 48);
    data[64] = camPos.x; data[65] = camPos.y; data[66] = camPos.z;
    data[67] = near;
    data[68] = far;
    ctx.queue.writeBuffer(this._cameraBuffer, 0, data.buffer as ArrayBuffer);
  }

  execute(encoder: GPUCommandEncoder, ctx: RenderContext): void {
    const { device } = ctx;
    this._ensurePerDrawBuffers(device, this._drawItems.length);

    for (let i = 0; i < this._drawItems.length; i++) {
      const item = this._drawItems[i];

      const modelData = this._modelData;
      modelData.set(item.modelMatrix.data, 0);
      modelData.set(item.normalMatrix.data, 16);
      ctx.queue.writeBuffer(this._modelBuffers[i], 0, modelData.buffer as ArrayBuffer);

      // Layout: albedo(4) + roughness(1) + metallic(1) + uvOffset(2) + uvScale(2) + pad(2) = 12 floats
      const matData = this._matData;
      matData.set(item.material.albedo, 0);
      matData[4] = item.material.roughness;
      matData[5] = item.material.metallic;
      matData[6] = item.material.uvOffset?.[0] ?? 0;
      matData[7] = item.material.uvOffset?.[1] ?? 0;
      matData[8]  = item.material.uvScale ?.[0] ?? 1;
      matData[9]  = item.material.uvScale ?.[1] ?? 1;
      matData[10] = item.material.uvTile  ?.[0] ?? 1;
      matData[11] = item.material.uvTile  ?.[1] ?? 1;
      ctx.queue.writeBuffer(this._materialBuffers[i], 0, matData.buffer as ArrayBuffer);
    }

    const pass = encoder.beginRenderPass({
      label: 'GeometryPass',
      colorAttachments: [
        { view: this._gbuffer.albedoRoughnessView, clearValue: [0,0,0,1], loadOp: 'clear', storeOp: 'store' },
        { view: this._gbuffer.normalMetallicView,  clearValue: [0,0,0,0], loadOp: 'clear', storeOp: 'store' },
      ],
      depthStencilAttachment: {
        view: this._gbuffer.depthView,
        depthClearValue: 1, depthLoadOp: 'clear', depthStoreOp: 'store',
      },
    });

    pass.setPipeline(this._pipeline);
    pass.setBindGroup(0, this._cameraBindGroup);

    for (let i = 0; i < this._drawItems.length; i++) {
      const item = this._drawItems[i];
      pass.setBindGroup(1, this._modelBindGroups[i]);
      pass.setBindGroup(2, this._materialBindGroups[i]);
      pass.setBindGroup(3, this._getOrCreateTextureBG(device, item.material));
      pass.setVertexBuffer(0, item.mesh.vertexBuffer);
      pass.setIndexBuffer(item.mesh.indexBuffer, 'uint32');
      pass.drawIndexed(item.mesh.indexCount);
    }
    pass.end();
  }

  private _getOrCreateTextureBG(device: GPUDevice, material: Material): GPUBindGroup {
    let bg = this._textureBGs.get(material);
    if (!bg) {
      bg = device.createBindGroup({
        label: 'GeomTextureBG', layout: this._textureBGL,
        entries: [
          { binding: 0, resource: material.albedoMap?.view ?? this._whiteView },
          { binding: 1, resource: material.normalMap?.view ?? this._flatNormalView },
          { binding: 2, resource: material.merMap?.view    ?? this._merDefaultView },
          { binding: 3, resource: this._materialSampler },
        ],
      });
      this._textureBGs.set(material, bg);
    }
    return bg;
  }

  private _ensurePerDrawBuffers(device: GPUDevice, count: number): void {
    while (this._modelBuffers.length < count) {
      const mb = device.createBuffer({ size: MODEL_UNIFORM_SIZE, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
      this._modelBuffers.push(mb);
      this._modelBindGroups.push(device.createBindGroup({ layout: this._modelBGL, entries: [{ binding: 0, resource: { buffer: mb } }] }));

      const matb = device.createBuffer({ size: MATERIAL_UNIFORM_SIZE, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
      this._materialBuffers.push(matb);
      this._materialBindGroups.push(device.createBindGroup({ layout: this._materialBGL, entries: [{ binding: 0, resource: { buffer: matb } }] }));
    }
  }

  destroy(): void {
    this._cameraBuffer.destroy();
    for (const b of this._modelBuffers) b.destroy();
    for (const b of this._materialBuffers) b.destroy();
    this._whiteTex.destroy();
    this._flatNormalTex.destroy();
    this._merDefaultTex.destroy();
  }
}
