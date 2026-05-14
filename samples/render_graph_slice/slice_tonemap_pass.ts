import type { RenderContext } from '../../src/renderer/render_context.js';
import { Pass } from '../../src/renderer/render_graph/pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle } from '../../src/renderer/render_graph/index.js';

// 16 bytes: exposure | flags | _pad0 | _pad1
const PARAMS_SIZE = 16;

const sliceTonemapWgsl = /* wgsl */ `
struct Params {
  exposure: f32,
  flags:    u32,
  _pad0:    f32,
  _pad1:    f32,
}
@group(0) @binding(0) var<uniform> params: Params;

@group(1) @binding(0) var src:  texture_2d<f32>;
@group(1) @binding(1) var samp: sampler;

struct VOut { @builtin(position) pos: vec4f, @location(0) uv: vec2f }

@vertex
fn vs_main(@builtin(vertex_index) i: u32) -> VOut {
  let xy = vec2f(f32((i << 1u) & 2u), f32(i & 2u));
  var out: VOut;
  out.pos = vec4f(xy * 2.0 - 1.0, 0.0, 1.0);
  out.uv  = vec2f(xy.x, 1.0 - xy.y);
  return out;
}

// Narkowicz 2015 ACES fit.
fn aces(c: vec3f) -> vec3f {
  let a = 2.51; let b = 0.03; let cc = 2.43; let d = 0.59; let e = 0.14;
  return clamp((c * (a * c + b)) / (c * (cc * c + d) + e), vec3f(0.0), vec3f(1.0));
}

@fragment
fn fs_main(in: VOut) -> @location(0) vec4f {
  var rgb = textureSample(src, samp, in.uv).rgb * params.exposure;
  if ((params.flags & 1u) != 0u) {
    rgb = aces(rgb);
  }
  if ((params.flags & 2u) == 0u) {
    rgb = pow(rgb, vec3f(1.0 / 2.2));
  }
  return vec4f(rgb, 1.0);
}
`;

export interface SliceTonemapDeps {
  hdr: ResourceHandle;
  backbuffer: ResourceHandle;
  exposure: number;
  /** ACES filmic tone curve. */
  useAces?: boolean;
  /** Skip the gamma encode (for HDR canvas). */
  hdrCanvas?: boolean;
}

/**
 * Slice demo: HDR → SDR tone-mapping pass. Reads a sampled HDR input, applies
 * exposure + optional ACES, optional gamma encode, then writes to the supplied
 * backbuffer attachment.
 */
export class SliceTonemapPass extends Pass<SliceTonemapDeps, void> {
  readonly name = 'SliceTonemapPass';

  private readonly _device: GPUDevice;
  private readonly _pipeline: GPURenderPipeline;
  private readonly _paramsBuffer: GPUBuffer;
  private readonly _paramsBindGroup: GPUBindGroup;
  private readonly _sourceBgl: GPUBindGroupLayout;
  private readonly _sampler: GPUSampler;
  private readonly _scratchAB = new ArrayBuffer(PARAMS_SIZE);
  private readonly _scratchF = new Float32Array(this._scratchAB);
  private readonly _scratchU = new Uint32Array(this._scratchAB);

  private constructor(
    device: GPUDevice,
    pipeline: GPURenderPipeline,
    paramsBuffer: GPUBuffer,
    paramsBindGroup: GPUBindGroup,
    sourceBgl: GPUBindGroupLayout,
    sampler: GPUSampler,
  ) {
    super();
    this._device = device;
    this._pipeline = pipeline;
    this._paramsBuffer = paramsBuffer;
    this._paramsBindGroup = paramsBindGroup;
    this._sourceBgl = sourceBgl;
    this._sampler = sampler;
  }

  /**
   * @param ctx Render context.
   * @param outputFormat Format of the backbuffer the tonemap writes to.
   *   Defaults to `ctx.format` (canvas swapchain format).
   */
  static create(ctx: RenderContext, outputFormat?: GPUTextureFormat): SliceTonemapPass {
    const { device, format } = ctx;
    const finalFormat = outputFormat ?? format;

    const paramsBgl = device.createBindGroupLayout({
      label: 'SliceTone.paramsBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
    });
    const sourceBgl = device.createBindGroupLayout({
      label: 'SliceTone.sourceBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
      ],
    });

    const paramsBuffer = device.createBuffer({
      label: 'SliceTone.params',
      size: PARAMS_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const paramsBindGroup = device.createBindGroup({
      label: 'SliceTone.paramsBG',
      layout: paramsBgl,
      entries: [{ binding: 0, resource: { buffer: paramsBuffer } }],
    });

    const sampler = device.createSampler({
      label: 'SliceTone.sampler',
      magFilter: 'linear', minFilter: 'linear',
    });

    const shader = device.createShaderModule({ label: 'SliceTone.shader', code: sliceTonemapWgsl });
    const pipeline = device.createRenderPipeline({
      label: 'SliceTone.pipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [paramsBgl, sourceBgl] }),
      vertex: { module: shader, entryPoint: 'vs_main' },
      fragment: { module: shader, entryPoint: 'fs_main', targets: [{ format: finalFormat }] },
      primitive: { topology: 'triangle-list' },
    });

    return new SliceTonemapPass(device, pipeline, paramsBuffer, paramsBindGroup, sourceBgl, sampler);
  }

  addToGraph(graph: RenderGraph, deps: SliceTonemapDeps): void {
    const { ctx } = graph;

    graph.addPass(this.name, 'render', (b: PassBuilder) => {
      b.read(deps.hdr, 'sampled');
      b.write(deps.backbuffer, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] });

      b.setExecute((pctx, res) => {
        const f = this._scratchF;
        const u = this._scratchU;
        let flags = 0;
        if (deps.useAces) flags |= 1;
        if (deps.hdrCanvas) flags |= 2;
        f[0] = deps.exposure;
        u[1] = flags;
        f[2] = 0;
        f[3] = 0;
        ctx.queue.writeBuffer(this._paramsBuffer, 0, this._scratchAB);

        const sourceBg = this._device.createBindGroup({
          label: 'SliceTone.sourceBG',
          layout: this._sourceBgl,
          entries: [
            { binding: 0, resource: res.getTextureView(deps.hdr) },
            { binding: 1, resource: this._sampler },
          ],
        });

        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(this._pipeline);
        enc.setBindGroup(0, this._paramsBindGroup);
        enc.setBindGroup(1, sourceBg);
        enc.draw(3);
      });
    });
  }

  destroy(): void {
    this._paramsBuffer.destroy();
  }
}
