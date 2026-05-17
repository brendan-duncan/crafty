import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle, TextureDesc } from '../index.js';
import { HDR_FORMAT } from './deferred_lighting_pass.js';
import type { CloudNoiseTextures } from '../../../assets/cloud_noise.js';
import type { CloudSettings } from '../../passes/cloud_pass.js';
import godrayMarchWgsl from '../../../shaders/godray_march.wgsl?raw';
import godrayCompositeWgsl from '../../../shaders/godray_composite.wgsl?raw';

const FOG_FORMAT: GPUTextureFormat = HDR_FORMAT;
const PARAMS_SIZE = 16;
const CLOUD_DENSITY_SIZE = 64;

export interface GodrayDeps {
  hdr: ResourceHandle;
  depth: ResourceHandle;
  shadowMap: ResourceHandle;
  cameraBuffer: ResourceHandle;
  lightBuffer: ResourceHandle;
}

export class GodrayPass extends Pass<GodrayDeps, void> {
  readonly name = 'GodrayPass';

  scattering = 0.3;
  fogCurve = 2.0;
  maxSteps = 16;

  private readonly _device: GPUDevice;
  private readonly _marchPipeline: GPURenderPipeline;
  private readonly _blurHPipeline: GPURenderPipeline;
  private readonly _blurVPipeline: GPURenderPipeline;
  private readonly _compositePipeline: GPURenderPipeline;

  private readonly _marchParamsBuf: GPUBuffer;
  private readonly _blurHParamsBuf: GPUBuffer;
  private readonly _blurVParamsBuf: GPUBuffer;
  private readonly _compParamsBuf: GPUBuffer;
  private readonly _cloudDensityBuf: GPUBuffer;

  private readonly _bglMarch: GPUBindGroupLayout;
  private readonly _bglBlur: GPUBindGroupLayout;
  private readonly _bglComposite: GPUBindGroupLayout;

  private readonly _sampler: GPUSampler;
  private readonly _noiseSampler: GPUSampler;
  private readonly _cmpSampler: GPUSampler;
  private readonly _cloudNoises: CloudNoiseTextures;

  private readonly _marchScratch = new Float32Array(4);
  private readonly _compScratch = new Float32Array(4);
  private readonly _densityScratch = new Float32Array(8);

  private constructor(
    device: GPUDevice,
    marchPipeline: GPURenderPipeline,
    blurHPipeline: GPURenderPipeline,
    blurVPipeline: GPURenderPipeline,
    compositePipeline: GPURenderPipeline,
    marchParamsBuf: GPUBuffer,
    blurHParamsBuf: GPUBuffer,
    blurVParamsBuf: GPUBuffer,
    compParamsBuf: GPUBuffer,
    cloudDensityBuf: GPUBuffer,
    bglMarch: GPUBindGroupLayout,
    bglBlur: GPUBindGroupLayout,
    bglComposite: GPUBindGroupLayout,
    sampler: GPUSampler,
    noiseSampler: GPUSampler,
    cmpSampler: GPUSampler,
    cloudNoises: CloudNoiseTextures,
  ) {
    super();
    this._device = device;
    this._marchPipeline = marchPipeline;
    this._blurHPipeline = blurHPipeline;
    this._blurVPipeline = blurVPipeline;
    this._compositePipeline = compositePipeline;
    this._marchParamsBuf = marchParamsBuf;
    this._blurHParamsBuf = blurHParamsBuf;
    this._blurVParamsBuf = blurVParamsBuf;
    this._compParamsBuf = compParamsBuf;
    this._cloudDensityBuf = cloudDensityBuf;
    this._bglMarch = bglMarch;
    this._bglBlur = bglBlur;
    this._bglComposite = bglComposite;
    this._sampler = sampler;
    this._noiseSampler = noiseSampler;
    this._cmpSampler = cmpSampler;
    this._cloudNoises = cloudNoises;
  }

  static create(ctx: RenderContext, cloudNoises: CloudNoiseTextures): GodrayPass {
    const { device } = ctx;

    const sampler = device.createSampler({
      label: 'GodraySampler',
      magFilter: 'linear', minFilter: 'linear',
      addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge',
    });

    const noiseSampler = device.createSampler({
      label: 'GodrayNoiseSampler',
      magFilter: 'linear', minFilter: 'linear', mipmapFilter: 'linear',
      addressModeU: 'mirror-repeat', addressModeV: 'mirror-repeat', addressModeW: 'mirror-repeat',
    });

    const cmpSampler = device.createSampler({
      label: 'GodrayCmpSampler',
      compare: 'less-equal', magFilter: 'linear', minFilter: 'linear',
    });

    const cloudDensityBuf = device.createBuffer({
      label: 'GodrayCloudDensity', size: CLOUD_DENSITY_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const marchParamsBuf = device.createBuffer({
      label: 'GodrayMarchParams', size: PARAMS_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(marchParamsBuf, 0,
      new Float32Array([0.3, 16.0, 0.0, 0.0]).buffer as ArrayBuffer);

    const blurHParamsBuf = device.createBuffer({
      label: 'GodrayBlurHParams', size: PARAMS_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(blurHParamsBuf, 0,
      new Float32Array([1.0, 0.0, 0.0, 0.0]).buffer as ArrayBuffer);

    const blurVParamsBuf = device.createBuffer({
      label: 'GodrayBlurVParams', size: PARAMS_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(blurVParamsBuf, 0,
      new Float32Array([0.0, 1.0, 0.0, 0.0]).buffer as ArrayBuffer);

    const compParamsBuf = device.createBuffer({
      label: 'GodrayCompositeParams', size: PARAMS_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(compParamsBuf, 0,
      new Float32Array([0.0, 0.0, 2.0, 0.0]).buffer as ArrayBuffer);

    const marchShader = ctx.createShaderModule(godrayMarchWgsl, 'GodrayMarchShader');
    const compShader = ctx.createShaderModule(godrayCompositeWgsl, 'GodrayCompositeShader');

    // Bind group layouts discovered via 'auto' layout for each pipeline.
    // We create the pipelines first to extract layouts, then store layouts
    // so per-frame bind groups can be rebuilt without re-creating pipelines.
    const tempMarchPipeline = device.createRenderPipeline({
      label: 'GodrayMarchPipeline', layout: 'auto',
      vertex: { module: marchShader, entryPoint: 'vs_main' },
      fragment: { module: marchShader, entryPoint: 'fs_march', targets: [{ format: FOG_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });
    const bglMarch = tempMarchPipeline.getBindGroupLayout(0);

    const tempBlurHPipeline = device.createRenderPipeline({
      label: 'GodrayBlurHPipeline', layout: 'auto',
      vertex: { module: compShader, entryPoint: 'vs_main' },
      fragment: { module: compShader, entryPoint: 'fs_blur', targets: [{ format: FOG_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });
    const bglBlur = tempBlurHPipeline.getBindGroupLayout(0);

    const tempBlurVPipeline = device.createRenderPipeline({
      label: 'GodrayBlurVPipeline', layout: 'auto',
      vertex: { module: compShader, entryPoint: 'vs_main' },
      fragment: { module: compShader, entryPoint: 'fs_blur', targets: [{ format: FOG_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });
    const bglBlurV = tempBlurVPipeline.getBindGroupLayout(0);

    const tempCompositePipeline = device.createRenderPipeline({
      label: 'GodrayCompositePipeline', layout: 'auto',
      vertex: { module: compShader, entryPoint: 'vs_main' },
      fragment: {
        module: compShader, entryPoint: 'fs_composite',
        targets: [{
          format: HDR_FORMAT,
          blend: {
            color: { operation: 'add', srcFactor: 'one', dstFactor: 'one' },
            alpha: { operation: 'add', srcFactor: 'one', dstFactor: 'one' },
          },
        }],
      },
      primitive: { topology: 'triangle-list' },
    });
    const bglComposite = tempCompositePipeline.getBindGroupLayout(0);

    // Re-create the pipelines with explicit layouts so the bind group layouts
    // are accessible (auto-layout pipelines may not expose BGLs in all impls).
    const plMarch = device.createPipelineLayout({ bindGroupLayouts: [bglMarch] });
    const plBlurH = device.createPipelineLayout({ bindGroupLayouts: [bglBlur] });
    const plBlurV = device.createPipelineLayout({ bindGroupLayouts: [bglBlurV] });
    const plComposite = device.createPipelineLayout({ bindGroupLayouts: [bglComposite] });

    const marchPipeline = device.createRenderPipeline({
      label: 'GodrayMarchPipeline', layout: plMarch,
      vertex: { module: marchShader, entryPoint: 'vs_main' },
      fragment: { module: marchShader, entryPoint: 'fs_march', targets: [{ format: FOG_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    const blurHPipeline = device.createRenderPipeline({
      label: 'GodrayBlurHPipeline', layout: plBlurH,
      vertex: { module: compShader, entryPoint: 'vs_main' },
      fragment: { module: compShader, entryPoint: 'fs_blur', targets: [{ format: FOG_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    const blurVPipeline = device.createRenderPipeline({
      label: 'GodrayBlurVPipeline', layout: plBlurV,
      vertex: { module: compShader, entryPoint: 'vs_main' },
      fragment: { module: compShader, entryPoint: 'fs_blur', targets: [{ format: FOG_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    const compositePipeline = device.createRenderPipeline({
      label: 'GodrayCompositePipeline', layout: plComposite,
      vertex: { module: compShader, entryPoint: 'vs_main' },
      fragment: {
        module: compShader, entryPoint: 'fs_composite',
        targets: [{
          format: HDR_FORMAT,
          blend: {
            color: { operation: 'add', srcFactor: 'one', dstFactor: 'one' },
            alpha: { operation: 'add', srcFactor: 'one', dstFactor: 'one' },
          },
        }],
      },
      primitive: { topology: 'triangle-list' },
    });

    return new GodrayPass(
      device,
      marchPipeline, blurHPipeline, blurVPipeline, compositePipeline,
      marchParamsBuf, blurHParamsBuf, blurVParamsBuf, compParamsBuf,
      cloudDensityBuf,
      bglMarch, bglBlur, bglComposite,
      sampler, noiseSampler, cmpSampler, cloudNoises,
    );
  }

  updateParams(ctx: RenderContext): void {
    this._marchScratch[0] = this.scattering;
    this._marchScratch[1] = this.maxSteps;
    this._marchScratch[2] = 0;
    this._marchScratch[3] = 0;
    ctx.queue.writeBuffer(this._marchParamsBuf, 0, this._marchScratch.buffer as ArrayBuffer);
    this._compScratch[0] = 0;
    this._compScratch[1] = 0;
    this._compScratch[2] = this.fogCurve;
    this._compScratch[3] = 0;
    ctx.queue.writeBuffer(this._compParamsBuf, 0, this._compScratch.buffer as ArrayBuffer);
  }

  updateCloudDensity(ctx: RenderContext, settings: CloudSettings): void {
    const data = this._densityScratch;
    data[0] = settings.cloudBase;
    data[1] = settings.cloudTop;
    data[2] = settings.coverage;
    data[3] = settings.density;
    data[4] = settings.windOffset[0];
    data[5] = settings.windOffset[1];
    data[6] = settings.extinction;
    data[7] = 0;
    ctx.queue.writeBuffer(this._cloudDensityBuf, 0, data.buffer as ArrayBuffer);
  }

  addToGraph(graph: RenderGraph, deps: GodrayDeps): void {
    const { ctx } = graph;
    const hw = Math.max(1, ctx.width >> 1);
    const hh = Math.max(1, ctx.height >> 1);
    const halfDesc: TextureDesc = { format: FOG_FORMAT, width: hw, height: hh };

    let fogA!: ResourceHandle;
    let fogB!: ResourceHandle;

    // Pass 1: Ray march → fogA
    graph.addPass(`${this.name}.march`, 'render', (b: PassBuilder) => {
      fogA = b.createTexture({ label: 'GodrayFogA', ...halfDesc });
      b.write(fogA, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 0] });
      b.read(deps.depth, 'sampled');
      b.read(deps.shadowMap, 'sampled');
      b.read(deps.cameraBuffer, 'uniform');
      b.read(deps.lightBuffer, 'uniform');

      b.setExecute((pctx, res) => {
        const bg = this._device.createBindGroup({
          label: 'GodrayMarchBG',
          layout: this._bglMarch,
          entries: [
            { binding: 0, resource: { buffer: res.getBuffer(deps.cameraBuffer) } },
            { binding: 1, resource: { buffer: res.getBuffer(deps.lightBuffer) } },
            { binding: 2, resource: res.getTextureView(deps.depth) },
            { binding: 3, resource: res.getTextureView(deps.shadowMap) },
            { binding: 4, resource: this._cmpSampler },
            { binding: 5, resource: { buffer: this._marchParamsBuf } },
            { binding: 6, resource: { buffer: this._cloudDensityBuf } },
            { binding: 7, resource: this._cloudNoises.baseView },
            { binding: 8, resource: this._cloudNoises.detailView },
            { binding: 9, resource: this._noiseSampler },
          ],
        });
        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(this._marchPipeline);
        enc.setBindGroup(0, bg);
        enc.draw(3);
      });
    });

    // Pass 2: Horizontal blur fogA → fogB
    graph.addPass(`${this.name}.blurH`, 'render', (b: PassBuilder) => {
      fogB = b.createTexture({ label: 'GodrayFogB', ...halfDesc });
      b.write(fogB, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 0] });
      b.read(fogA, 'sampled');
      b.read(deps.depth, 'sampled');

      b.setExecute((pctx, res) => {
        const bg = this._device.createBindGroup({
          label: 'GodrayBlurHBG',
          layout: this._bglBlur,
          entries: [
            { binding: 0, resource: res.getTextureView(fogA) },
            { binding: 1, resource: res.getTextureView(deps.depth) },
            { binding: 2, resource: this._sampler },
            { binding: 3, resource: { buffer: this._blurHParamsBuf } },
          ],
        });
        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(this._blurHPipeline);
        enc.setBindGroup(0, bg);
        enc.draw(3);
      });
    });

    // Pass 3: Vertical blur fogB → fogA (overwrite)
    graph.addPass(`${this.name}.blurV`, 'render', (b: PassBuilder) => {
      b.write(fogA, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 0] });
      b.read(fogB, 'sampled');
      b.read(deps.depth, 'sampled');

      b.setExecute((pctx, res) => {
        const bg = this._device.createBindGroup({
          label: 'GodrayBlurVBG',
          layout: this._bglBlur,
          entries: [
            { binding: 0, resource: res.getTextureView(fogB) },
            { binding: 1, resource: res.getTextureView(deps.depth) },
            { binding: 2, resource: this._sampler },
            { binding: 3, resource: { buffer: this._blurVParamsBuf } },
          ],
        });
        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(this._blurVPipeline);
        enc.setBindGroup(0, bg);
        enc.draw(3);
      });
    });

    // Pass 4: Composite fogA onto HDR
    graph.addPass(`${this.name}.composite`, 'render', (b: PassBuilder) => {
      b.write(deps.hdr, 'attachment', { loadOp: 'load', storeOp: 'store' });
      b.read(fogA, 'sampled');
      b.read(deps.depth, 'sampled');
      b.read(deps.lightBuffer, 'uniform');

      b.setExecute((pctx, res) => {
        const bg = this._device.createBindGroup({
          label: 'GodrayCompositeBG',
          layout: this._bglComposite,
          entries: [
            { binding: 0, resource: res.getTextureView(fogA) },
            { binding: 1, resource: res.getTextureView(deps.depth) },
            { binding: 2, resource: this._sampler },
            { binding: 3, resource: { buffer: this._compParamsBuf } },
            { binding: 4, resource: { buffer: res.getBuffer(deps.lightBuffer) } },
          ],
        });
        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(this._compositePipeline);
        enc.setBindGroup(0, bg);
        enc.draw(3);
      });
    });
  }

  destroy(): void {
    this._marchParamsBuf.destroy();
    this._blurHParamsBuf.destroy();
    this._blurVParamsBuf.destroy();
    this._compParamsBuf.destroy();
    this._cloudDensityBuf.destroy();
  }
}
