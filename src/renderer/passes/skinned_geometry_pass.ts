import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import type { GBuffer } from '../gbuffer.js';
import { SKINNED_VERTEX_ATTRIBUTES, SKINNED_VERTEX_STRIDE } from '../../assets/skinned_mesh.js';
import type { SkinnedMesh } from '../../assets/skinned_mesh.js';
import type { Mat4 } from '../../math/mat4.js';
import type { Material } from '../../engine/components/mesh_renderer.js';
import skinnedGeometryWgsl from '../../shaders/skinned_geometry.wgsl?raw';

const CAMERA_UNIFORM_SIZE   = 64 * 4 + 16 + 16;
const MODEL_UNIFORM_SIZE    = 128;
const MATERIAL_UNIFORM_SIZE = 48;

export interface SkinnedDrawItem {
  mesh         : SkinnedMesh;
  modelMatrix  : Mat4;
  normalMatrix : Mat4;
  material     : Material;
  jointMatrices: Float32Array;  // jointCount × 16 floats, column-major
}

export class SkinnedGeometryPass extends RenderPass {
  readonly name = 'SkinnedGeometryPass';

  private _gbuffer: GBuffer;
  private _pipeline: GPURenderPipeline;

  // Group 1 combines model uniforms (binding 0) + joint matrices (binding 1)
  private _modelJointBGL: GPUBindGroupLayout;
  private _materialBGL  : GPUBindGroupLayout;
  private _textureBGL   : GPUBindGroupLayout;

  private _cameraBuffer   : GPUBuffer;
  private _cameraBindGroup: GPUBindGroup;

  private _modelBuffers         : GPUBuffer[] = [];
  private _jointBuffers         : GPUBuffer[] = [];
  private _jointBufferSizes     : number[] = [];
  private _modelJointBindGroups : GPUBindGroup[] = [];
  private _materialBuffers      : GPUBuffer[] = [];
  private _materialBindGroups   : GPUBindGroup[] = [];

  private _whiteTex      : GPUTexture;
  private _flatNormalTex : GPUTexture;
  private _merDefaultTex : GPUTexture;
  private _whiteView     : GPUTextureView;
  private _flatNormalView: GPUTextureView;
  private _merDefaultView: GPUTextureView;
  private _materialSampler: GPUSampler;

  private _textureBGs = new WeakMap<object, GPUBindGroup>();
  private _drawItems: SkinnedDrawItem[] = [];

  private constructor(
    gbuffer: GBuffer,
    pipeline: GPURenderPipeline,
    _cameraBGL: GPUBindGroupLayout,
    modelJointBGL: GPUBindGroupLayout,
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
    this._gbuffer          = gbuffer;
    this._pipeline         = pipeline;
    this._modelJointBGL    = modelJointBGL;
    this._materialBGL      = materialBGL;
    this._textureBGL       = textureBGL;
    this._cameraBuffer     = cameraBuffer;
    this._cameraBindGroup  = cameraBindGroup;
    this._whiteTex         = whiteTex;
    this._whiteView        = whiteView;
    this._flatNormalTex    = flatNormalTex;
    this._flatNormalView   = flatNormalView;
    this._merDefaultTex    = merDefaultTex;
    this._merDefaultView   = merDefaultView;
    this._materialSampler  = materialSampler;
  }

  static create(ctx: RenderContext, gbuffer: GBuffer): SkinnedGeometryPass {
    const { device } = ctx;

    const cameraBGL = device.createBindGroupLayout({
      label: 'SkinnedGeomCameraBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
    });
    // Group 1: model uniform (b0) + joint matrices storage (b1)
    const modelJointBGL = device.createBindGroupLayout({
      label: 'SkinnedGeomModelJointBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
        { binding: 1, visibility: GPUShaderStage.VERTEX, buffer: { type: 'read-only-storage' } },
      ],
    });
    const materialBGL = device.createBindGroupLayout({
      label: 'SkinnedGeomMaterialBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
    });
    const textureBGL = device.createBindGroupLayout({
      label: 'SkinnedGeomTextureBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    function makeTex(label: string, r: number, g: number, b: number, a: number): [GPUTexture, GPUTextureView] {
      const t = device.createTexture({
        label, size: { width: 1, height: 1 }, format: 'rgba8unorm',
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
      });
      device.queue.writeTexture({ texture: t }, new Uint8Array([r, g, b, a]), { bytesPerRow: 4 }, { width: 1, height: 1 });
      return [t, t.createView()];
    }
    const [whiteTex,      whiteView]      = makeTex('SkinnedGeomWhite',      255, 255, 255, 255);
    const [flatNormalTex, flatNormalView] = makeTex('SkinnedGeomFlatNormal', 128, 128, 255, 255);
    const [merDefaultTex, merDefaultView] = makeTex('SkinnedGeomMerDefault', 255, 255, 255, 255);

    const materialSampler = device.createSampler({
      label: 'SkinnedGeomMaterialSampler',
      magFilter: 'linear', minFilter: 'linear', mipmapFilter: 'linear',
      addressModeU: 'repeat', addressModeV: 'repeat',
    });

    const cameraBuffer = device.createBuffer({
      label: 'SkinnedGeomCameraBuffer',
      size: CAMERA_UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const cameraBindGroup = device.createBindGroup({
      label: 'SkinnedGeomCameraBG', layout: cameraBGL,
      entries: [{ binding: 0, resource: { buffer: cameraBuffer } }],
    });

    const shaderModule = device.createShaderModule({ label: 'SkinnedGeometryShader', code: skinnedGeometryWgsl });

    const pipeline = device.createRenderPipeline({
      label: 'SkinnedGeometryPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [cameraBGL, modelJointBGL, materialBGL, textureBGL] }),
      vertex: {
        module: shaderModule, entryPoint: 'vs_main',
        buffers: [{ arrayStride: SKINNED_VERTEX_STRIDE, attributes: SKINNED_VERTEX_ATTRIBUTES }],
      },
      fragment: {
        module: shaderModule, entryPoint: 'fs_main',
        targets: [{ format: 'rgba8unorm' }, { format: 'rgba16float' }],
      },
      depthStencil: { format: 'depth32float', depthWriteEnabled: true, depthCompare: 'less' },
      primitive: { topology: 'triangle-list', cullMode: 'none' },
    });

    return new SkinnedGeometryPass(
      gbuffer, pipeline, cameraBGL, modelJointBGL, materialBGL, textureBGL,
      cameraBuffer, cameraBindGroup,
      whiteTex, whiteView, flatNormalTex, flatNormalView, merDefaultTex, merDefaultView,
      materialSampler,
    );
  }

  setDrawItems(items: SkinnedDrawItem[]): void {
    this._drawItems = items;
  }

  updateCamera(ctx: RenderContext, view: Mat4, proj: Mat4, viewProj: Mat4, invViewProj: Mat4, camPos: { x: number; y: number; z: number }, near: number, far: number): void {
    const data = new Float32Array(CAMERA_UNIFORM_SIZE / 4);
    data.set(view.data, 0); data.set(proj.data, 16); data.set(viewProj.data, 32); data.set(invViewProj.data, 48);
    data[64] = camPos.x; data[65] = camPos.y; data[66] = camPos.z;
    data[67] = near; data[68] = far;
    ctx.queue.writeBuffer(this._cameraBuffer, 0, data.buffer as ArrayBuffer);
  }

  execute(encoder: GPUCommandEncoder, ctx: RenderContext): void {
    if (this._drawItems.length === 0) return;

    const { device } = ctx;
    this._ensurePerDrawBuffers(device, this._drawItems.length);

    for (let i = 0; i < this._drawItems.length; i++) {
      const item = this._drawItems[i];

      const modelData = new Float32Array(32);
      modelData.set(item.modelMatrix.data, 0);
      modelData.set(item.normalMatrix.data, 16);
      ctx.queue.writeBuffer(this._modelBuffers[i], 0, modelData.buffer as ArrayBuffer);

      const matData = new Float32Array(12);
      matData.set(item.material.albedo, 0);
      matData[4] = item.material.roughness;
      matData[5] = item.material.metallic;
      matData[6] = item.material.uvOffset?.[0] ?? 0;
      matData[7] = item.material.uvOffset?.[1] ?? 0;
      matData[8]  = item.material.uvScale?.[0]  ?? 1;
      matData[9]  = item.material.uvScale?.[1]  ?? 1;
      matData[10] = item.material.uvTile?.[0]   ?? 1;
      matData[11] = item.material.uvTile?.[1]   ?? 1;
      ctx.queue.writeBuffer(this._materialBuffers[i], 0, matData.buffer as ArrayBuffer);

      // Upload joint matrices, recreating storage buffer and bind group if size changed
      const jBytes = item.jointMatrices.byteLength;
      if (this._jointBufferSizes[i] < jBytes || !this._jointBuffers[i]) {
        this._jointBuffers[i]?.destroy();
        const buf = device.createBuffer({
          label: `SkinnedGeomJointBuffer[${i}]`,
          size: Math.max(jBytes, 64),
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });
        this._jointBuffers[i]     = buf;
        this._jointBufferSizes[i] = jBytes;
        this._modelJointBindGroups[i] = device.createBindGroup({
          label: `SkinnedGeomModelJointBG[${i}]`, layout: this._modelJointBGL,
          entries: [
            { binding: 0, resource: { buffer: this._modelBuffers[i] } },
            { binding: 1, resource: { buffer: buf } },
          ],
        });
      }
      ctx.queue.writeBuffer(this._jointBuffers[i], 0,
        item.jointMatrices.buffer as ArrayBuffer, item.jointMatrices.byteOffset, jBytes);
    }

    const pass = encoder.beginRenderPass({
      label: 'SkinnedGeometryPass',
      colorAttachments: [
        { view: this._gbuffer.albedoRoughnessView, loadOp: 'load', storeOp: 'store' },
        { view: this._gbuffer.normalMetallicView,  loadOp: 'load', storeOp: 'store' },
      ],
      depthStencilAttachment: {
        view: this._gbuffer.depthView,
        depthLoadOp: 'load', depthStoreOp: 'store',
      },
    });

    pass.setPipeline(this._pipeline);
    pass.setBindGroup(0, this._cameraBindGroup);

    for (let i = 0; i < this._drawItems.length; i++) {
      const item = this._drawItems[i];
      pass.setBindGroup(1, this._modelJointBindGroups[i]);
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
        label: 'SkinnedGeomTextureBG', layout: this._textureBGL,
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
      // Joint buffer and combined bind group are created lazily in execute()
      this._jointBuffers.push(null as unknown as GPUBuffer);
      this._jointBufferSizes.push(0);
      this._modelJointBindGroups.push(null as unknown as GPUBindGroup);

      const matb = device.createBuffer({ size: MATERIAL_UNIFORM_SIZE, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
      this._materialBuffers.push(matb);
      this._materialBindGroups.push(device.createBindGroup({ layout: this._materialBGL, entries: [{ binding: 0, resource: { buffer: matb } }] }));
    }
  }

  destroy(): void {
    this._cameraBuffer.destroy();
    for (const b of this._modelBuffers)    b.destroy();
    for (const b of this._jointBuffers)    b?.destroy();
    for (const b of this._materialBuffers) b.destroy();
    this._whiteTex.destroy();
    this._flatNormalTex.destroy();
    this._merDefaultTex.destroy();
  }
}
