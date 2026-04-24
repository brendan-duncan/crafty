import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import type { Mesh } from '../../assets/mesh.js';
import { VERTEX_ATTRIBUTES, VERTEX_STRIDE } from '../../assets/mesh.js';
import type { Mat4 } from '../../math/mat4.js';
import { HDR_FORMAT } from './lighting_pass.js';
import debugLightWgsl from '../../shaders/debug_light.wgsl?raw';

// mvp mat4 (64) + color vec4 (16) = 80 bytes
const UNIFORM_SIZE = 80;

export class DebugLightPass extends RenderPass {
  readonly name = 'DebugLightPass';

  private _pipeline: GPURenderPipeline;
  private _uniformBuffer: GPUBuffer;
  private _bindGroup: GPUBindGroup;
  private _hdrView: GPUTextureView;
  private _depthView: GPUTextureView;
  private _mesh: Mesh | null = null;

  private constructor(
    pipeline: GPURenderPipeline,
    uniformBuffer: GPUBuffer,
    bindGroup: GPUBindGroup,
    hdrView: GPUTextureView,
    depthView: GPUTextureView,
  ) {
    super();
    this._pipeline = pipeline;
    this._uniformBuffer = uniformBuffer;
    this._bindGroup = bindGroup;
    this._hdrView = hdrView;
    this._depthView = depthView;
  }

  static create(ctx: RenderContext, hdrView: GPUTextureView, depthView: GPUTextureView): DebugLightPass {
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
          attributes: [VERTEX_ATTRIBUTES[0]], // position only
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

    return new DebugLightPass(pipeline, uniformBuffer, bindGroup, hdrView, depthView);
  }

  setMesh(mesh: Mesh): void {
    this._mesh = mesh;
  }

  update(ctx: RenderContext, viewProj: Mat4, model: Mat4, color: [number, number, number, number]): void {
    const mvp = viewProj.multiply(model);
    const data = new Float32Array(UNIFORM_SIZE / 4);
    data.set(mvp.data, 0);
    data[16] = color[0]; data[17] = color[1]; data[18] = color[2]; data[19] = color[3];
    ctx.queue.writeBuffer(this._uniformBuffer, 0, data.buffer as ArrayBuffer);
  }

  execute(encoder: GPUCommandEncoder, _ctx: RenderContext): void {
    if (!this._mesh) return;

    const pass = encoder.beginRenderPass({
      label: 'DebugLightPass',
      colorAttachments: [{ view: this._hdrView, loadOp: 'load', storeOp: 'store' }],
      depthStencilAttachment: {
        view: this._depthView,
        depthReadOnly: true,
      },
    });
    pass.setPipeline(this._pipeline);
    pass.setBindGroup(0, this._bindGroup);
    pass.setVertexBuffer(0, this._mesh.vertexBuffer);
    pass.setIndexBuffer(this._mesh.indexBuffer, 'uint32');
    pass.drawIndexed(this._mesh.indexCount);
    pass.end();
  }

  destroy(): void {
    this._uniformBuffer.destroy();
  }
}
