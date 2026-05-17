import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle } from '../index.js';
import type { Vec3 } from '../../../math/vec3.js';
import { HDR_FORMAT } from './deferred_lighting_pass.js';
import blockHighlightWgsl from '../../../shaders/block_highlight.wgsl?raw';

interface CrackAtlasSource {
  readonly view: GPUTextureView;
}

const UNIFORM_SIZE = 80;

export interface BlockHighlightDeps {
  hdr: ResourceHandle;
  depth: ResourceHandle;
}

export class BlockHighlightPass extends Pass<BlockHighlightDeps, void> {
  readonly name = 'BlockHighlightPass';

  private readonly _facePipeline: GPURenderPipeline;
  private readonly _edgePipeline: GPURenderPipeline;
  private readonly _uniformBuf: GPUBuffer;
  private readonly _bg: GPUBindGroup;
  private _crackStage = 0;
  private _active = false;
  private readonly _scratch = new Float32Array(UNIFORM_SIZE / 4);

  private constructor(
    facePipeline: GPURenderPipeline,
    edgePipeline: GPURenderPipeline,
    uniformBuf: GPUBuffer,
    bg: GPUBindGroup,
  ) {
    super();
    this._facePipeline = facePipeline;
    this._edgePipeline = edgePipeline;
    this._uniformBuf = uniformBuf;
    this._bg = bg;
  }

  static create(ctx: RenderContext, crackAtlas: CrackAtlasSource): BlockHighlightPass {
    const { device } = ctx;

    const uniformBuf = device.createBuffer({
      label: 'BlockHighlightUniform',
      size: UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const crackSampler = device.createSampler({
      label: 'BlockHighlightCrackSampler',
      magFilter: 'nearest', minFilter: 'nearest', mipmapFilter: 'nearest',
      addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge',
    });

    const bgl = device.createBindGroupLayout({
      label: 'BlockHighlightBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    const bg = device.createBindGroup({
      label: 'BlockHighlightBG',
      layout: bgl,
      entries: [
        { binding: 0, resource: { buffer: uniformBuf } },
        { binding: 1, resource: crackAtlas.view },
        { binding: 2, resource: crackSampler },
      ],
    });

    const shader = ctx.createShaderModule(blockHighlightWgsl, 'BlockHighlightShader');
    const pipelineLayout = device.createPipelineLayout({ bindGroupLayouts: [bgl] });

    const depthStencil: GPUDepthStencilState = {
      format: 'depth32float',
      depthWriteEnabled: false,
      depthCompare: 'less-equal',
    };

    const blend: GPUBlendState = {
      color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' },
      alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
    };

    const facePipeline = device.createRenderPipeline({
      label: 'BlockHighlightFacePipeline',
      layout: pipelineLayout,
      vertex: { module: shader, entryPoint: 'vs_face' },
      fragment: { module: shader, entryPoint: 'fs_face', targets: [{ format: HDR_FORMAT, blend }] },
      primitive: { topology: 'triangle-list', cullMode: 'none' },
      depthStencil,
    });

    const edgePipeline = device.createRenderPipeline({
      label: 'BlockHighlightEdgePipeline',
      layout: pipelineLayout,
      vertex: { module: shader, entryPoint: 'vs_edge' },
      fragment: { module: shader, entryPoint: 'fs_edge', targets: [{ format: HDR_FORMAT, blend }] },
      primitive: { topology: 'triangle-list', cullMode: 'none' },
      depthStencil,
    });

    return new BlockHighlightPass(facePipeline, edgePipeline, uniformBuf, bg);
  }

  setCrackStage(stage: number): void {
    this._crackStage = Math.max(0, Math.min(9, Math.floor(stage)));
  }

  update(ctx: RenderContext, viewProj: { data: Float32Array }, blockPos: Vec3 | null): void {
    if (!blockPos) { this._active = false; return; }
    this._active = true;
    const data = this._scratch;
    data.set(viewProj.data, 0);
    data[16] = blockPos.x;
    data[17] = blockPos.y;
    data[18] = blockPos.z;
    data[19] = this._crackStage;
    ctx.queue.writeBuffer(this._uniformBuf, 0, data.buffer as ArrayBuffer);
  }

  addToGraph(graph: RenderGraph, deps: BlockHighlightDeps): void {
    graph.addPass(this.name, 'render', (b: PassBuilder) => {
      b.write(deps.hdr, 'attachment', { loadOp: 'load', storeOp: 'store' });
      b.write(deps.depth, 'depth-attachment', { depthLoadOp: 'load', depthStoreOp: 'store' });

      b.setExecute((pctx) => {
        if (!this._active) return;
        const enc = pctx.renderPassEncoder!;
        enc.setBindGroup(0, this._bg);
        enc.setPipeline(this._facePipeline);
        enc.draw(36);
        enc.setPipeline(this._edgePipeline);
        enc.draw(144);
      });
    });
  }

  destroy(): void {
    this._uniformBuf.destroy();
  }
}
