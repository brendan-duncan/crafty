import type { RenderContext } from '../../src/renderer/render_context.js';
import { Pass } from '../../src/renderer/render_graph/pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle } from '../../src/renderer/render_graph/index.js';

const HDR_FORMAT: GPUTextureFormat = 'rgba16float';

// LightUniforms (64 bytes):
//   dir(3)+pad(1) | color(3)+intensity(1) | ambient(3)+pad(1) | _pad(4)
const LIGHT_UNIFORM_SIZE = 64;

const sliceLightWgsl = /* wgsl */ `
struct Light {
  dirAndPad:        vec4f,
  colorIntensity:   vec4f,  // rgb=color, a=intensity
  ambientPad:       vec4f,
  _pad:             vec4f,
}
@group(0) @binding(0) var<uniform> light: Light;

@group(1) @binding(0) var samp:    sampler;
@group(1) @binding(1) var albedoT: texture_2d<f32>;
@group(1) @binding(2) var normalT: texture_2d<f32>;

struct VOut { @builtin(position) pos: vec4f, @location(0) uv: vec2f }

@vertex
fn vs_main(@builtin(vertex_index) i: u32) -> VOut {
  let xy = vec2f(f32((i << 1u) & 2u), f32(i & 2u));
  var out: VOut;
  out.pos = vec4f(xy * 2.0 - 1.0, 0.0, 1.0);
  out.uv  = vec2f(xy.x, 1.0 - xy.y);
  return out;
}

@fragment
fn fs_main(in: VOut) -> @location(0) vec4f {
  let albedo = textureSample(albedoT, samp, in.uv).rgb;
  let nEnc = textureSample(normalT, samp, in.uv).rgb;
  let n = normalize(nEnc * 2.0 - 1.0);

  let l = normalize(-light.dirAndPad.xyz);
  let ndl = max(dot(n, l), 0.0);

  let direct = albedo * light.colorIntensity.rgb * light.colorIntensity.a * ndl;
  let ambient = albedo * light.ambientPad.rgb;
  return vec4f(direct + ambient, 1.0);
}
`;

export interface SliceLightingDeps {
  /** GBuffer outputs from {@link SliceGeometryPass}. */
  albedo: ResourceHandle;
  normal: ResourceHandle;
  /** Directional light direction (world space, points away from light). */
  lightDir:  { x: number; y: number; z: number };
  /** Directional light color (linear RGB) and intensity multiplier. */
  lightColor: { r: number; g: number; b: number };
  lightIntensity: number;
  /** Ambient term applied across the whole image. */
  ambient: { r: number; g: number; b: number };
}

export interface SliceLightingOutputs {
  hdr: ResourceHandle;
}

/**
 * Slice demo: minimal deferred lighting pass. Samples the albedo + world
 * normal G-buffer, applies a single directional light + ambient term, and
 * writes the result to an HDR (`rgba16float`) target.
 */
export class SliceLightingPass extends Pass<SliceLightingDeps, SliceLightingOutputs> {
  readonly name = 'SliceLightingPass';

  private readonly _device: GPUDevice;
  private readonly _pipeline: GPURenderPipeline;
  private readonly _lightBuffer: GPUBuffer;
  private readonly _gbufferBgl: GPUBindGroupLayout;
  private readonly _lightBindGroup: GPUBindGroup;
  private readonly _sampler: GPUSampler;
  private readonly _scratch = new Float32Array(LIGHT_UNIFORM_SIZE / 4);

  private constructor(
    device: GPUDevice,
    pipeline: GPURenderPipeline,
    lightBuffer: GPUBuffer,
    gbufferBgl: GPUBindGroupLayout,
    lightBindGroup: GPUBindGroup,
    sampler: GPUSampler,
  ) {
    super();
    this._device = device;
    this._pipeline = pipeline;
    this._lightBuffer = lightBuffer;
    this._gbufferBgl = gbufferBgl;
    this._lightBindGroup = lightBindGroup;
    this._sampler = sampler;
  }

  static create(ctx: RenderContext): SliceLightingPass {
    const { device } = ctx;

    const lightBgl = device.createBindGroupLayout({
      label: 'SliceLight.lightBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
    });
    const gbufferBgl = device.createBindGroupLayout({
      label: 'SliceLight.gbufferBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
      ],
    });

    const lightBuffer = device.createBuffer({
      label: 'SliceLight.lightUBO',
      size: LIGHT_UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const lightBindGroup = device.createBindGroup({
      label: 'SliceLight.lightBG',
      layout: lightBgl,
      entries: [{ binding: 0, resource: { buffer: lightBuffer } }],
    });

    const sampler = device.createSampler({
      label: 'SliceLight.sampler',
      magFilter: 'linear',
      minFilter: 'linear',
    });

    const shader = device.createShaderModule({ label: 'SliceLight.shader', code: sliceLightWgsl });
    const pipeline = device.createRenderPipeline({
      label: 'SliceLight.pipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [lightBgl, gbufferBgl] }),
      vertex: { module: shader, entryPoint: 'vs_main' },
      fragment: { module: shader, entryPoint: 'fs_main', targets: [{ format: HDR_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    return new SliceLightingPass(device, pipeline, lightBuffer, gbufferBgl, lightBindGroup, sampler);
  }

  addToGraph(graph: RenderGraph, deps: SliceLightingDeps): SliceLightingOutputs {
    const { ctx } = graph;
    const screen = { width: ctx.width, height: ctx.height };

    let hdr!: ResourceHandle;

    graph.addPass(this.name, 'render', (b: PassBuilder) => {
      hdr = b.createTexture({ label: 'slice.hdr', format: HDR_FORMAT, ...screen });
      hdr = b.write(hdr, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] });
      b.read(deps.albedo, 'sampled');
      b.read(deps.normal, 'sampled');

      b.setExecute((pctx, res) => {
        // Upload light uniforms.
        const s = this._scratch;
        s[0] = deps.lightDir.x; s[1] = deps.lightDir.y; s[2] = deps.lightDir.z; s[3] = 0;
        s[4] = deps.lightColor.r; s[5] = deps.lightColor.g; s[6] = deps.lightColor.b; s[7] = deps.lightIntensity;
        s[8] = deps.ambient.r;    s[9] = deps.ambient.g;    s[10] = deps.ambient.b;   s[11] = 0;
        s[12] = 0; s[13] = 0; s[14] = 0; s[15] = 0;
        ctx.queue.writeBuffer(this._lightBuffer, 0, s.buffer as ArrayBuffer);

        // Bind group with the resolved gbuffer views must be built per frame
        // because pool reuse can hand back different physical textures/views.
        const gbufferBg = this._device.createBindGroup({
          label: 'SliceLight.gbufferBG',
          layout: this._gbufferBgl,
          entries: [
            { binding: 0, resource: this._sampler },
            { binding: 1, resource: res.getTextureView(deps.albedo) },
            { binding: 2, resource: res.getTextureView(deps.normal) },
          ],
        });

        const enc = pctx.renderPassEncoder!;
        enc.setPipeline(this._pipeline);
        enc.setBindGroup(0, this._lightBindGroup);
        enc.setBindGroup(1, gbufferBg);
        enc.draw(3);
      });
    });

    return { hdr };
  }

  destroy(): void {
    this._lightBuffer.destroy();
  }
}
