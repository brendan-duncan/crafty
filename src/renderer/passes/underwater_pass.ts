import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import { HDR_FORMAT } from './lighting_pass.js';
import underwaterWgsl from '../../shaders/underwater.wgsl?raw';

const UNIFORM_SIZE = 16; // time + is_underwater + 2 pad

export class UnderwaterPass extends RenderPass {
  readonly name = 'UnderwaterPass';

  private _device    : GPUDevice;
  private _pipeline  : GPURenderPipeline;
  private _resultTex : GPUTexture;
  private _bg        : GPUBindGroup;
  private _uniformBuf: GPUBuffer;
  readonly resultView: GPUTextureView;

  private constructor(
    device    : GPUDevice,
    pipeline  : GPURenderPipeline,
    resultTex : GPUTexture,
    resultView: GPUTextureView,
    bg        : GPUBindGroup,
    uniformBuf: GPUBuffer,
  ) {
    super();
    this._device     = device;
    this._pipeline   = pipeline;
    this._resultTex  = resultTex;
    this.resultView  = resultView;
    this._bg         = bg;
    this._uniformBuf = uniformBuf;
  }

  static create(ctx: RenderContext, inputView: GPUTextureView): UnderwaterPass {
    const { device, width, height } = ctx;

    const bgl = device.createBindGroupLayout({
      label: 'UnderwaterBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, buffer:  { type: 'uniform'   } },
      ],
    });

    const uniformBuf = device.createBuffer({ label: 'UnderwaterUniform', size: UNIFORM_SIZE, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    const sampler    = device.createSampler({ magFilter: 'linear', minFilter: 'linear' });

    const bg = device.createBindGroup({
      label: 'UnderwaterBG', layout: bgl,
      entries: [
        { binding: 0, resource: inputView               },
        { binding: 1, resource: sampler                 },
        { binding: 2, resource: { buffer: uniformBuf }  },
      ],
    });

    const resultTex  = device.createTexture({ label: 'UnderwaterResult', size: { width, height }, format: HDR_FORMAT, usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING });
    const resultView = resultTex.createView();

    const shader  = device.createShaderModule({ label: 'UnderwaterShader', code: underwaterWgsl });
    const layout  = device.createPipelineLayout({ bindGroupLayouts: [bgl] });
    const pipeline = device.createRenderPipeline({
      label   : 'UnderwaterPipeline',
      layout,
      vertex  : { module: shader, entryPoint: 'vs_main' },
      fragment: { module: shader, entryPoint: 'fs_main', targets: [{ format: HDR_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    return new UnderwaterPass(device, pipeline, resultTex, resultView, bg, uniformBuf);
  }

  updateParams(ctx: RenderContext, isUnderwater: boolean, time: number): void {
    ctx.queue.writeBuffer(this._uniformBuf, 0, new Float32Array([time, isUnderwater ? 1.0 : 0.0, 0, 0]));
  }

  execute(encoder: GPUCommandEncoder, _ctx: RenderContext): void {
    const pass = encoder.beginRenderPass({
      label: 'UnderwaterPass',
      colorAttachments: [{ view: this.resultView, loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] }],
    });
    pass.setPipeline(this._pipeline);
    pass.setBindGroup(0, this._bg);
    pass.draw(3);
    pass.end();
  }

  destroy(): void {
    this._resultTex.destroy();
    this._uniformBuf.destroy();
  }
}
