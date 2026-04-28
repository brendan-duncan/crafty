import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import type { Mat4 } from '../../math/mat4.js';
import tonemapWgsl from '../../shaders/tonemap.wgsl?raw';

const STAR_UNIFORM_SIZE = 96; // mat4(64) + vec3+pad(16) + vec3+pad(16)

export class TonemapPass extends RenderPass {
  readonly name = 'TonemapPass';

  private _pipeline   : GPURenderPipeline;
  private _bindGroup  : GPUBindGroup;
  private _paramsBuffer: GPUBuffer;
  private _starBuffer : GPUBuffer;

  private constructor(pipeline: GPURenderPipeline, bindGroup: GPUBindGroup, paramsBuffer: GPUBuffer, starBuffer: GPUBuffer) {
    super();
    this._pipeline    = pipeline;
    this._bindGroup   = bindGroup;
    this._paramsBuffer = paramsBuffer;
    this._starBuffer  = starBuffer;
  }

  static create(
    ctx            : RenderContext,
    hdrView        : GPUTextureView,
    aoView         : GPUTextureView,
    exposureBuffer : GPUBuffer,
    depthView      : GPUTextureView,
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
        { binding: 5, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
        { binding: 6, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
      ],
    });

    const sampler = device.createSampler({ label: 'TonemapSampler', magFilter: 'linear', minFilter: 'linear' });

    const paramsBuffer = device.createBuffer({
      label: 'TonemapParamsBuffer',
      size: 16,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(paramsBuffer, 0, new Uint32Array([1, 0, 0, 0]));

    const starBuffer = device.createBuffer({
      label: 'TonemapStarBuffer',
      size: STAR_UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const bindGroup = device.createBindGroup({
      layout: bgl,
      entries: [
        { binding: 0, resource: hdrView },
        { binding: 1, resource: sampler },
        { binding: 2, resource: { buffer: paramsBuffer } },
        { binding: 3, resource: aoView },
        { binding: 4, resource: { buffer: exposureBuffer } },
        { binding: 5, resource: { buffer: starBuffer } },
        { binding: 6, resource: depthView },
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

    return new TonemapPass(pipeline, bindGroup, paramsBuffer, starBuffer);
  }

  updateStars(
    ctx       : RenderContext,
    invViewProj: Mat4,
    camPos    : { x: number; y: number; z: number },
    sunDir    : { x: number; y: number; z: number },
  ): void {
    const data = new Float32Array(STAR_UNIFORM_SIZE / 4);
    data.set(invViewProj.data, 0);
    data[16] = camPos.x; data[17] = camPos.y; data[18] = camPos.z; data[19] = 0;
    data[20] = sunDir.x;  data[21] = sunDir.y;  data[22] = sunDir.z;  data[23] = 0;
    ctx.queue.writeBuffer(this._starBuffer, 0, data.buffer as ArrayBuffer);
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
    this._starBuffer.destroy();
  }
}
