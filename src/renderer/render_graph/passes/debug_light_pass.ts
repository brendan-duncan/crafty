import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle } from '../index.js';
import type { Mesh } from '../../../assets/mesh.js';
import { VERTEX_ATTRIBUTES, VERTEX_STRIDE } from '../../../assets/mesh.js';
import type { Mat4 } from '../../../math/mat4.js';
import { HDR_FORMAT } from './deferred_lighting_pass.js';
import debugLightWgsl from '../../../shaders/debug_light.wgsl?raw';

const UNIFORM_SIZE = 80;

export interface DebugLightDeps {
  hdr: ResourceHandle;
  depth: ResourceHandle;
}

export class DebugLightPass extends Pass<DebugLightDeps, void> {
  readonly name = 'DebugLightPass';

  private readonly _pipeline: GPURenderPipeline;
  private readonly _uniformBuffer: GPUBuffer;
  private readonly _bindGroup: GPUBindGroup;
  private _mesh: Mesh | null = null;
  private readonly _scratch = new Float32Array(UNIFORM_SIZE / 4);

  private constructor(
    pipeline: GPURenderPipeline,
    uniformBuffer: GPUBuffer,
    bindGroup: GPUBindGroup,
  ) {
    super();
    this._pipeline = pipeline;
    this._uniformBuffer = uniformBuffer;
    this._bindGroup = bindGroup;
  }

  static create(ctx: RenderContext): DebugLightPass {
    const { device } = ctx;

    const uniformBuffer = device.createBuffer({
      label: 'DebugLightUniform',
      size: UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const bgl = device.createBindGroupLayout({
      label: 'DebugLightBGL',
      entries: [{
        binding: 0,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        buffer: { type: 'uniform' },
      }],
    });

    const bindGroup = device.createBindGroup({
      label: 'DebugLightBG',
      layout: bgl,
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });

    const shader = device.createShaderModule({ label: 'DebugLightShader', code: debugLightWgsl });

    const pipeline = device.createRenderPipeline({
      label: 'DebugLightPipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [bgl] }),
      vertex: {
        module: shader,
        entryPoint: 'vs_main',
        buffers: [{
          arrayStride: VERTEX_STRIDE,
          attributes: [VERTEX_ATTRIBUTES[0]],
        }],
      },
      fragment: {
        module: shader,
        entryPoint: 'fs_main',
        targets: [{ format: HDR_FORMAT }],
      },
      depthStencil: {
        format: 'depth32float',
        depthWriteEnabled: false,
        depthCompare: 'less',
      },
      primitive: { topology: 'triangle-list', cullMode: 'none' },
    });

    return new DebugLightPass(pipeline, uniformBuffer, bindGroup);
  }

  setMesh(mesh: Mesh): void {
    this._mesh = mesh;
  }

  update(ctx: RenderContext, viewProj: Mat4, model: Mat4, color: [number, number, number, number]): void {
    const mvp = viewProj.multiply(model);
    const data = this._scratch;
    data.set(mvp.data, 0);
    data[16] = color[0]; data[17] = color[1]; data[18] = color[2]; data[19] = color[3];
    ctx.queue.writeBuffer(this._uniformBuffer, 0, data.buffer as ArrayBuffer);
  }

  addToGraph(graph: RenderGraph, deps: DebugLightDeps): void {
    graph.addPass(this.name, 'render', (b: PassBuilder) => {
      b.write(deps.hdr, 'attachment', { loadOp: 'load', storeOp: 'store' });
      b.read(deps.depth, 'depth-read');

      b.setExecute((pctx) => {
        if (!this._mesh) return;
        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(this._pipeline);
        enc.setBindGroup(0, this._bindGroup);
        enc.setVertexBuffer(0, this._mesh.vertexBuffer);
        enc.setIndexBuffer(this._mesh.indexBuffer, 'uint32');
        enc.drawIndexed(this._mesh.indexCount);
      });
    });
  }

  destroy(): void {
    this._uniformBuffer.destroy();
  }
}
