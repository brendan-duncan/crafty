import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import type { Vec3 } from '../../math/vec3.js';
import { HDR_FORMAT } from './lighting_pass.js';
import blockHighlightWgsl from '../../shaders/block_highlight.wgsl?raw';

// viewProj(64) + blockPos(12) + pad(4) = 80 bytes
const UNIFORM_SIZE = 80;

export class BlockHighlightPass extends RenderPass {
  readonly name = 'BlockHighlightPass';

  private _facePipeline: GPURenderPipeline;
  private _edgePipeline: GPURenderPipeline;
  private _uniformBuf  : GPUBuffer;
  private _bg          : GPUBindGroup;
  private _hdrView     : GPUTextureView;
  private _depthView   : GPUTextureView;
  private _active      = false;

  private constructor(
    facePipeline: GPURenderPipeline,
    edgePipeline: GPURenderPipeline,
    uniformBuf  : GPUBuffer,
    bg          : GPUBindGroup,
    hdrView     : GPUTextureView,
    depthView   : GPUTextureView,
  ) {
    super();
    this._facePipeline = facePipeline;
    this._edgePipeline = edgePipeline;
    this._uniformBuf   = uniformBuf;
    this._bg           = bg;
    this._hdrView      = hdrView;
    this._depthView    = depthView;
  }

  static create(ctx: RenderContext, hdrView: GPUTextureView, depthView: GPUTextureView): BlockHighlightPass {
    const { device } = ctx;

    const uniformBuf = device.createBuffer({
      label: 'BlockHighlightUniform',
      size : UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const bgl = device.createBindGroupLayout({
      label  : 'BlockHighlightBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
    });

    const bg = device.createBindGroup({
      label  : 'BlockHighlightBG',
      layout : bgl,
      entries: [{ binding: 0, resource: { buffer: uniformBuf } }],
    });

    const shader = device.createShaderModule({ label: 'BlockHighlightShader', code: blockHighlightWgsl });
    const pipelineLayout = device.createPipelineLayout({ bindGroupLayouts: [bgl] });

    const depthStencil: GPUDepthStencilState = {
      format           : 'depth32float',
      depthWriteEnabled: false,
      depthCompare     : 'less-equal',
    };

    // Face overlay needs depth bias to avoid z-fighting with the block surface.
    const faceDepthStencil: GPUDepthStencilState = {
      format           : 'depth32float',
      depthWriteEnabled: false,
      depthCompare     : 'less-equal',
      depthBias        : -2,
      depthBiasSlopeScale: -1.0,
      depthBiasClamp   : 0.0,
    };

    const blend: GPUBlendState = {
      color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' },
      alpha: { srcFactor: 'one',       dstFactor: 'one-minus-src-alpha', operation: 'add' },
    };

    const facePipeline = device.createRenderPipeline({
      label   : 'BlockHighlightFacePipeline',
      layout  : pipelineLayout,
      vertex  : { module: shader, entryPoint: 'vs_face' },
      fragment: { module: shader, entryPoint: 'fs_face', targets: [{ format: HDR_FORMAT, blend }] },
      primitive   : { topology: 'triangle-list', cullMode: 'none' },
      depthStencil: faceDepthStencil,
    });

    const edgePipeline = device.createRenderPipeline({
      label   : 'BlockHighlightEdgePipeline',
      layout  : pipelineLayout,
      vertex  : { module: shader, entryPoint: 'vs_edge' },
      fragment: { module: shader, entryPoint: 'fs_edge', targets: [{ format: HDR_FORMAT, blend }] },
      primitive   : { topology: 'triangle-list', cullMode: 'none' },
      depthStencil,
    });

    return new BlockHighlightPass(facePipeline, edgePipeline, uniformBuf, bg, hdrView, depthView);
  }

  // Call each frame with the integer block position, or null when nothing is targeted.
  update(ctx: RenderContext, viewProj: { data: Float32Array }, blockPos: Vec3 | null): void {
    if (!blockPos) { this._active = false; return; }
    this._active = true;
    const data = new Float32Array(UNIFORM_SIZE / 4);
    data.set(viewProj.data, 0);
    data[16] = blockPos.x;
    data[17] = blockPos.y;
    data[18] = blockPos.z;
    ctx.queue.writeBuffer(this._uniformBuf, 0, data.buffer as ArrayBuffer);
  }

  execute(encoder: GPUCommandEncoder, _ctx: RenderContext): void {
    if (!this._active) return;

    const pass = encoder.beginRenderPass({
      label           : 'BlockHighlightPass',
      colorAttachments: [{ view: this._hdrView, loadOp: 'load', storeOp: 'store' }],
      depthStencilAttachment: {
        view        : this._depthView,
        depthLoadOp : 'load',
        depthStoreOp: 'store',
      },
    });

    pass.setBindGroup(0, this._bg);

    // 6 faces × 6 verts = 36 vertices for the dark face overlay
    pass.setPipeline(this._facePipeline);
    pass.draw(36);

    // 12 edges × 6 verts × 2 perpendicular planes = 144 vertices for thick edge quads
    pass.setPipeline(this._edgePipeline);
    pass.draw(144);

    pass.end();
  }

  destroy(): void {
    this._uniformBuf.destroy();
  }
}
