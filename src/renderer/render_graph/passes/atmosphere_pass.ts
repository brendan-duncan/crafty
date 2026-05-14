import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle } from '../index.js';
import type { Mat4 } from '../../../math/mat4.js';
import atmosphereWgsl from '../../../shaders/atmosphere.wgsl?raw';

const HDR_FORMAT: GPUTextureFormat = 'rgba16float';

// invViewProj(64) + cameraPos+pad(16) + sunDir+pad(16) = 96 bytes
const UNIFORM_SIZE = 96;

export interface AtmosphereDeps {
  /**
   * Optional HDR target the sky is written into. When omitted the pass
   * creates a fresh `rgba16float` screen-sized texture (the typical case
   * since atmosphere is normally the first color writer in the frame).
   */
  hdr?: ResourceHandle;
  /** Defaults to `'clear'` when atmosphere is the first writer, else `'load'`. */
  load?: GPULoadOp;
}

export interface AtmosphereOutputs {
  /** Resulting HDR handle after the sky has been rendered. */
  hdr: ResourceHandle;
}

/**
 * Renders an atmospheric sky dome into the supplied HDR target
 * (render-graph version).
 *
 * Uses a fullscreen triangle and reconstructs view rays via the inverse
 * view-projection matrix; the atmosphere shader evaluates a procedural sky
 * model from the camera position and the toward-sun vector.
 */
export class AtmospherePass extends Pass<AtmosphereDeps, AtmosphereOutputs> {
  readonly name = 'AtmospherePass';

  private readonly _pipeline: GPURenderPipeline;
  private readonly _uniformBuf: GPUBuffer;
  private readonly _bg: GPUBindGroup;
  private readonly _scratch = new Float32Array(UNIFORM_SIZE / 4);

  private constructor(pipeline: GPURenderPipeline, uniformBuf: GPUBuffer, bg: GPUBindGroup) {
    super();
    this._pipeline = pipeline;
    this._uniformBuf = uniformBuf;
    this._bg = bg;
  }

  static create(ctx: RenderContext): AtmospherePass {
    const { device } = ctx;

    const uniformBuf = device.createBuffer({
      label: 'AtmosphereUniform',
      size: UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const bgl = device.createBindGroupLayout({
      label: 'AtmosphereBGL',
      entries: [{
        binding: 0,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        buffer: { type: 'uniform' },
      }],
    });

    const bg = device.createBindGroup({
      label: 'AtmosphereBG',
      layout: bgl,
      entries: [{ binding: 0, resource: { buffer: uniformBuf } }],
    });

    const shader = ctx.createShaderModule(atmosphereWgsl, 'AtmosphereShader');

    const pipeline = device.createRenderPipeline({
      label: 'AtmospherePipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [bgl] }),
      vertex: { module: shader, entryPoint: 'vs_main' },
      fragment: { module: shader, entryPoint: 'fs_main', targets: [{ format: HDR_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    return new AtmospherePass(pipeline, uniformBuf, bg);
  }

  /**
   * @param ctx Render context (used for the queue).
   * @param invViewProj Inverse view-projection matrix used to reconstruct view rays.
   * @param camPos World-space camera position.
   * @param lightDir Directional light direction (rays traveling toward the scene);
   *   the shader receives `normalize(-lightDir)` as the toward-sun vector.
   */
  update(
    ctx: RenderContext,
    invViewProj: Mat4,
    camPos: { x: number; y: number; z: number },
    lightDir: { x: number; y: number; z: number },
  ): void {
    const data = this._scratch;
    data.set(invViewProj.data, 0);
    data[16] = camPos.x;
    data[17] = camPos.y;
    data[18] = camPos.z;
    const len = Math.sqrt(lightDir.x * lightDir.x + lightDir.y * lightDir.y + lightDir.z * lightDir.z);
    const inv = len > 0 ? 1 / len : 0;
    data[20] = -lightDir.x * inv;
    data[21] = -lightDir.y * inv;
    data[22] = -lightDir.z * inv;
    ctx.queue.writeBuffer(this._uniformBuf, 0, data.buffer as ArrayBuffer);
  }

  addToGraph(graph: RenderGraph, deps: AtmosphereDeps = {}): AtmosphereOutputs {
    const { ctx } = graph;
    const hasInput = !!deps.hdr;
    let target: ResourceHandle = deps.hdr ?? (undefined as unknown as ResourceHandle);
    let hdr!: ResourceHandle;

    graph.addPass(this.name, 'render', (b: PassBuilder) => {
      if (!hasInput) {
        target = b.createTexture({
          label: 'atmosphere.hdr',
          format: HDR_FORMAT,
          width: ctx.width,
          height: ctx.height,
          extraUsage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
        });
      }
      hdr = b.write(target, 'attachment', {
        loadOp: deps.load ?? (hasInput ? 'load' : 'clear'),
        storeOp: 'store',
        clearValue: [0, 0, 0, 1],
      });
      b.setExecute((pctx) => {
        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(this._pipeline);
        enc.setBindGroup(0, this._bg);
        enc.draw(3);
      });
    });
    return { hdr };
  }

  destroy(): void {
    this._uniformBuf.destroy();
  }
}

export { HDR_FORMAT };
