import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import type { Mat4 } from '../../math/mat4.js';
import { HDR_FORMAT } from './lighting_pass.js';
import atmosphereWgsl from '../../shaders/atmosphere.wgsl?raw';

// invViewProj(64) + cameraPos+pad(16) + sunDir+pad(16) = 96 bytes
const UNIFORM_SIZE = 96;

export class AtmospherePass extends RenderPass {
  readonly name = 'AtmospherePass';

  private _pipeline: GPURenderPipeline;
  private _uniformBuf: GPUBuffer;
  private _bg: GPUBindGroup;
  private _hdrView: GPUTextureView;

  private constructor(
    pipeline: GPURenderPipeline,
    uniformBuf: GPUBuffer,
    bg: GPUBindGroup,
    hdrView: GPUTextureView,
  ) {
    super();
    this._pipeline = pipeline;
    this._uniformBuf = uniformBuf;
    this._bg = bg;
    this._hdrView = hdrView;
  }

  static create(ctx: RenderContext, hdrView: GPUTextureView): AtmospherePass {
    const { device } = ctx;

    const uniformBuf = device.createBuffer({
      label: 'AtmosphereUniform',
      size: UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const bgl = device.createBindGroupLayout({
      label: 'AtmosphereBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
    });

    const bg = device.createBindGroup({
      label: 'AtmosphereBG',
      layout: bgl,
      entries: [{ binding: 0, resource: { buffer: uniformBuf } }],
    });

    const shader = device.createShaderModule({ label: 'AtmosphereShader', code: atmosphereWgsl });

    const pipeline = device.createRenderPipeline({
      label: 'AtmospherePipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [bgl] }),
      vertex: { module: shader, entryPoint: 'vs_main' },
      fragment: { module: shader, entryPoint: 'fs_main', targets: [{ format: HDR_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    return new AtmospherePass(pipeline, uniformBuf, bg, hdrView);
  }

  // lightDir: directional-light direction (light rays travel in this direction, i.e. toward the scene).
  // Negated inside to produce the toward-sun vector the atmosphere shader expects.
  update(
    ctx: RenderContext,
    invViewProj: Mat4,
    camPos: { x: number; y: number; z: number },
    lightDir: { x: number; y: number; z: number },
  ): void {
    const data = new Float32Array(UNIFORM_SIZE / 4);
    data.set(invViewProj.data, 0);
    data[16] = camPos.x;
    data[17] = camPos.y;
    data[18] = camPos.z;
    // data[19] pad
    // sunDir = normalize(-lightDir) (toward the sun)
    const len = Math.sqrt(lightDir.x * lightDir.x + lightDir.y * lightDir.y + lightDir.z * lightDir.z);
    const inv = len > 0 ? 1 / len : 0;
    data[20] = -lightDir.x * inv;
    data[21] = -lightDir.y * inv;
    data[22] = -lightDir.z * inv;
    // data[23] pad
    ctx.queue.writeBuffer(this._uniformBuf, 0, data.buffer as ArrayBuffer);
  }

  execute(encoder: GPUCommandEncoder, _ctx: RenderContext): void {
    const pass = encoder.beginRenderPass({
      label: 'AtmospherePass',
      colorAttachments: [{
        view: this._hdrView,
        clearValue: [0, 0, 0, 1],
        loadOp: 'clear',
        storeOp: 'store',
      }],
    });
    pass.setPipeline(this._pipeline);
    pass.setBindGroup(0, this._bg);
    pass.draw(3);
    pass.end();
  }

  destroy(): void {
    this._uniformBuf.destroy();
  }
}
