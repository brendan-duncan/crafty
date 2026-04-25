import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import tonemapWgsl from '../../shaders/tonemap.wgsl?raw';

export class TonemapPass extends RenderPass {
  readonly name = 'TonemapPass';

  private _pipeline: GPURenderPipeline;
  private _bindGroup: GPUBindGroup;
  private _paramsBuffer: GPUBuffer;

  private constructor(pipeline: GPURenderPipeline, bindGroup: GPUBindGroup, paramsBuffer: GPUBuffer) {
    super();
    this._pipeline = pipeline;
    this._bindGroup = bindGroup;
    this._paramsBuffer = paramsBuffer;
  }

  static create(
    ctx            : RenderContext,
    hdrView        : GPUTextureView,
    aoView         : GPUTextureView,
    exposureBuffer : GPUBuffer,
  ): TonemapPass {
    const { device, format } = ctx;

    const bgl = device.createBindGroupLayout({
      label: 'TonemapBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 4, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'read-only-storage' } },
      ],
    });

    const sampler = device.createSampler({ label: 'TonemapSampler', magFilter: 'linear', minFilter: 'linear' });

    const paramsBuffer = device.createBuffer({
      label: 'TonemapParamsBuffer',
      size: 16,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    // Default: ACES on, debug_ao off
    device.queue.writeBuffer(paramsBuffer, 0, new Uint32Array([1, 0, 0, 0]));

    const bindGroup = device.createBindGroup({
      layout: bgl,
      entries: [
        { binding: 0, resource: hdrView },
        { binding: 1, resource: sampler },
        { binding: 2, resource: { buffer: paramsBuffer } },
        { binding: 3, resource: aoView },
        { binding: 4, resource: { buffer: exposureBuffer } },
      ],
    });

    const shaderModule = device.createShaderModule({ label: 'TonemapShader', code: tonemapWgsl });

    const pipeline = device.createRenderPipeline({
      label: 'TonemapPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [bgl] }),
      vertex: { module: shaderModule, entryPoint: 'vs_main' },
      fragment: {
        module: shaderModule, entryPoint: 'fs_main',
        targets: [{ format }],
      },
      primitive: { topology: 'triangle-list' },
    });

    return new TonemapPass(pipeline, bindGroup, paramsBuffer);
  }

  updateParams(ctx: RenderContext, acesEnabled: boolean, debugAO = false, hdrCanvas = false): void {
    ctx.queue.writeBuffer(this._paramsBuffer, 0, new Uint32Array([
      acesEnabled ? 1 : 0, debugAO ? 1 : 0, hdrCanvas ? 1 : 0, 0,
    ]));
  }

  execute(encoder: GPUCommandEncoder, ctx: RenderContext): void {
    const pass = encoder.beginRenderPass({
      label: 'TonemapPass',
      colorAttachments: [{
        view: ctx.getCurrentTexture().createView(),
        clearValue: [0, 0, 0, 1],
        loadOp: 'clear',
        storeOp: 'store',
      }],
    });
    pass.setPipeline(this._pipeline);
    pass.setBindGroup(0, this._bindGroup);
    pass.draw(3);
    pass.end();
  }

  destroy(): void {
    this._paramsBuffer.destroy();
  }
}
