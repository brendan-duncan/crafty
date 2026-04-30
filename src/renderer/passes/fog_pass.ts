import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import { HDR_FORMAT } from './lighting_pass.js';
import fogWgsl from '../../shaders/fog.wgsl?raw';

// FogParams layout (64 bytes — see fog.wgsl for offsets):
//  f32[0..2]  fog_color      (tint multiplier on atmospheric scatter; white = neutral)
//  f32[3]     depth_density
//  f32[4]     depth_begin
//  f32[5]     depth_end      (0 = use camera.far)
//  f32[6]     depth_curve
//  f32[7]     height_density
//  f32[8]     height_min
//  f32[9]     height_max
//  f32[10]    height_curve
//  u32[11]    flags          (bit 0 = depth, bit 1 = height)
//  f32[12..15] _pad
const PARAMS_SIZE = 64;

export class FogPass extends RenderPass {
  readonly name = 'FogPass';
  readonly resultView: GPUTextureView;

  // Depth fog: fog that increases with view-space distance.
  depthFogEnabled = true;
  depthDensity    = 1.0;
  depthBegin      = 32;    // world units — fog starts here (2 chunks)
  depthEnd        = 128;   // world units — fully opaque at render edge (8 chunks)
  depthCurve      = 1.5;   // >1 = slow start, builds steadily toward render edge

  // Height fog: fog based on world Y.  height_min > height_max means denser at low Y.
  heightFogEnabled = false;
  heightDensity    = 0.7;
  heightMin        = 48;   // world Y where fog is fully opaque
  heightMax        = 80;   // world Y where fog clears
  heightCurve      = 1.0;

  // Fog tint multiplier applied on top of the atmospheric scatter color (white = no tint).
  fogColor: [number, number, number] = [1.0, 1.0, 1.0];

  private _resultTex: GPUTexture;
  private _pipeline : GPURenderPipeline;
  private _bg       : GPUBindGroup;
  private _paramsBuf: GPUBuffer;

  private constructor(
    resultTex : GPUTexture,
    resultView: GPUTextureView,
    pipeline  : GPURenderPipeline,
    bg        : GPUBindGroup,
    paramsBuf : GPUBuffer,
  ) {
    super();
    this._resultTex = resultTex;
    this.resultView = resultView;
    this._pipeline  = pipeline;
    this._bg        = bg;
    this._paramsBuf = paramsBuf;
  }

  // cameraBuffer and lightBuffer are shared with LightingPass (no extra writes).
  static create(
    ctx         : RenderContext,
    inputView   : GPUTextureView,
    depthView   : GPUTextureView,
    cameraBuffer: GPUBuffer,
    lightBuffer : GPUBuffer,
  ): FogPass {
    const { device, width, height } = ctx;

    const bgl = device.createBindGroupLayout({
      label: 'FogBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float'   } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth'   } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering'      } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, buffer:  { type: 'uniform'        } },
        { binding: 4, visibility: GPUShaderStage.FRAGMENT, buffer:  { type: 'uniform'        } },
        { binding: 5, visibility: GPUShaderStage.FRAGMENT, buffer:  { type: 'uniform'        } },
      ],
    });

    const sampler   = device.createSampler({ label: 'FogSampler', magFilter: 'linear', minFilter: 'linear' });
    const paramsBuf = device.createBuffer({
      label: 'FogParamsBuf', size: PARAMS_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const resultTex  = device.createTexture({
      label: 'FogResult', size: { width, height }, format: HDR_FORMAT,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
    const resultView = resultTex.createView();

    const bg = device.createBindGroup({
      label: 'FogBG', layout: bgl,
      entries: [
        { binding: 0, resource: inputView                },
        { binding: 1, resource: depthView                },
        { binding: 2, resource: sampler                  },
        { binding: 3, resource: { buffer: cameraBuffer } },
        { binding: 4, resource: { buffer: lightBuffer  } },
        { binding: 5, resource: { buffer: paramsBuf    } },
      ],
    });

    const shader   = device.createShaderModule({ label: 'FogShader', code: fogWgsl });
    const layout   = device.createPipelineLayout({ bindGroupLayouts: [bgl] });
    const pipeline = device.createRenderPipeline({
      label: 'FogPipeline', layout,
      vertex:   { module: shader, entryPoint: 'vs_main' },
      fragment: { module: shader, entryPoint: 'fs_main', targets: [{ format: HDR_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    return new FogPass(resultTex, resultView, pipeline, bg, paramsBuf);
  }

  updateParams(ctx: RenderContext): void {
    let flags = 0;
    if (this.depthFogEnabled)  flags |= 1;
    if (this.heightFogEnabled) flags |= 2;

    const data = new ArrayBuffer(PARAMS_SIZE);
    const f    = new Float32Array(data);
    const u    = new Uint32Array(data);

    f[0]  = this.fogColor[0];
    f[1]  = this.fogColor[1];
    f[2]  = this.fogColor[2];
    f[3]  = this.depthDensity;
    f[4]  = this.depthBegin;
    f[5]  = this.depthEnd;
    f[6]  = this.depthCurve;
    f[7]  = this.heightDensity;
    f[8]  = this.heightMin;
    f[9]  = this.heightMax;
    f[10] = this.heightCurve;
    u[11] = flags;

    ctx.queue.writeBuffer(this._paramsBuf, 0, data);
  }

  execute(encoder: GPUCommandEncoder, _ctx: RenderContext): void {
    const pass = encoder.beginRenderPass({
      label: 'FogPass',
      colorAttachments: [{
        view: this.resultView, loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1],
      }],
    });
    pass.setPipeline(this._pipeline);
    pass.setBindGroup(0, this._bg);
    pass.draw(3);
    pass.end();
  }

  destroy(): void {
    this._resultTex.destroy();
    this._paramsBuf.destroy();
  }
}
