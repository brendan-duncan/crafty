import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import type { GBuffer } from '../gbuffer.js';
import type { ShadowPass } from './shadow_pass.js';
import type { CloudNoiseTextures } from '../../assets/cloud_noise.js';
import type { CloudSettings } from './cloud_pass.js';
import { HDR_FORMAT } from './lighting_pass.js';
import godrayMarchWgsl from '../../shaders/godray_march.wgsl?raw';
import godrayCompositeWgsl from '../../shaders/godray_composite.wgsl?raw';

const FOG_FORMAT: GPUTextureFormat = HDR_FORMAT;

const PARAMS_SIZE = 16;
const CLOUD_DENSITY_SIZE = 64; // CloudDensityUniforms padded to 64 for safety with auto-layout

export class GodrayPass extends RenderPass {
  readonly name = 'GodrayPass';

  scattering = 0.3;
  fogCurve   = 2.0;
  maxSteps   = 16;

  private _fogA    : GPUTexture;
  private _fogB    : GPUTexture;
  private _fogAView: GPUTextureView;
  private _fogBView: GPUTextureView;
  private _hdrView : GPUTextureView;

  private _marchPipeline    : GPURenderPipeline;
  private _blurHPipeline    : GPURenderPipeline;
  private _blurVPipeline    : GPURenderPipeline;
  private _compositePipeline: GPURenderPipeline;

  private _marchBG    : GPUBindGroup;
  private _blurHBG    : GPUBindGroup;
  private _blurVBG    : GPUBindGroup;
  private _compositeBG: GPUBindGroup;

  private _marchParamsBuf: GPUBuffer;
  private _blurHParamsBuf: GPUBuffer;
  private _blurVParamsBuf: GPUBuffer;
  private _compParamsBuf : GPUBuffer;
  private _cloudDensityBuf: GPUBuffer;

  private constructor(
    fogA: GPUTexture, fogAView: GPUTextureView,
    fogB: GPUTexture, fogBView: GPUTextureView,
    hdrView: GPUTextureView,
    marchPipeline: GPURenderPipeline,
    blurHPipeline: GPURenderPipeline,
    blurVPipeline: GPURenderPipeline,
    compositePipeline: GPURenderPipeline,
    marchBG: GPUBindGroup,
    blurHBG: GPUBindGroup,
    blurVBG: GPUBindGroup,
    compositeBG: GPUBindGroup,
    marchParamsBuf: GPUBuffer,
    blurHParamsBuf: GPUBuffer,
    blurVParamsBuf: GPUBuffer,
    compParamsBuf: GPUBuffer,
    cloudDensityBuf: GPUBuffer,
  ) {
    super();
    this._fogA     = fogA;     this._fogAView = fogAView;
    this._fogB     = fogB;     this._fogBView = fogBView;
    this._hdrView  = hdrView;
    this._marchPipeline     = marchPipeline;
    this._blurHPipeline     = blurHPipeline;
    this._blurVPipeline     = blurVPipeline;
    this._compositePipeline = compositePipeline;
    this._marchBG     = marchBG;
    this._blurHBG     = blurHBG;
    this._blurVBG     = blurVBG;
    this._compositeBG = compositeBG;
    this._marchParamsBuf = marchParamsBuf;
    this._blurHParamsBuf = blurHParamsBuf;
    this._blurVParamsBuf = blurVParamsBuf;
    this._compParamsBuf  = compParamsBuf;
    this._cloudDensityBuf = cloudDensityBuf;
  }

  static create(
    ctx        : RenderContext,
    gbuffer    : GBuffer,
    shadowPass : ShadowPass,
    hdrView    : GPUTextureView,
    cameraBuffer: GPUBuffer,
    lightBuffer : GPUBuffer,
    cloudNoises : CloudNoiseTextures,
  ): GodrayPass {
    const { device, width, height } = ctx;
    const halfW = Math.max(1, width  >> 1);
    const halfH = Math.max(1, height >> 1);

    const fogA = device.createTexture({
      label: 'GodrayFogA', size: { width: halfW, height: halfH }, format: FOG_FORMAT,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
    const fogB = device.createTexture({
      label: 'GodrayFogB', size: { width: halfW, height: halfH }, format: FOG_FORMAT,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
    const fogAView = fogA.createView();
    const fogBView = fogB.createView();

    const sampler = device.createSampler({
      label: 'GodraySampler',
      magFilter: 'linear', minFilter: 'linear',
      addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge',
    });

    const noiseSampler = device.createSampler({
      label: 'GodrayNoiseSampler',
      magFilter: 'linear', minFilter: 'linear', mipmapFilter: 'linear',
      addressModeU: 'mirror-repeat', addressModeV: 'mirror-repeat', addressModeW: 'mirror-repeat',
    });

    const cmpSampler = device.createSampler({
      label: 'GodrayCmpSampler',
      compare: 'less-equal', magFilter: 'linear', minFilter: 'linear',
    });

    // ---- Cloud density uniform buffer ----
    const cloudDensityBuf = device.createBuffer({
      label: 'GodrayCloudDensity', size: CLOUD_DENSITY_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    // ---- March param buffer ----
    const marchParamsBuf = device.createBuffer({
      label: 'GodrayMarchParams', size: PARAMS_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(marchParamsBuf, 0,
      new Float32Array([0.3, 16.0, 0.0, 0.0]).buffer as ArrayBuffer);

    // ---- Blur param buffers ----
    const blurHParamsBuf = device.createBuffer({
      label: 'GodrayBlurHParams', size: PARAMS_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(blurHParamsBuf, 0,
      new Float32Array([1.0, 0.0, 0.0, 0.0]).buffer as ArrayBuffer);

    const blurVParamsBuf = device.createBuffer({
      label: 'GodrayBlurVParams', size: PARAMS_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(blurVParamsBuf, 0,
      new Float32Array([0.0, 1.0, 0.0, 0.0]).buffer as ArrayBuffer);

    // ---- Composite param buffer ----
    const compParamsBuf = device.createBuffer({
      label: 'GodrayCompositeParams', size: PARAMS_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(compParamsBuf, 0,
      new Float32Array([0.0, 0.0, 2.0, 0.0]).buffer as ArrayBuffer);

    // ---- March pipeline ----
    const marchShader = device.createShaderModule({ label: 'GodrayMarchShader', code: godrayMarchWgsl });
    const marchPipeline = device.createRenderPipeline({
      label: 'GodrayMarchPipeline', layout: 'auto',
      vertex:   { module: marchShader, entryPoint: 'vs_main' },
      fragment: { module: marchShader, entryPoint: 'fs_march', targets: [{ format: FOG_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });

    const marchBG = device.createBindGroup({
      label: 'GodrayMarchBG', layout: marchPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: cameraBuffer } },
        { binding: 1, resource: { buffer: lightBuffer  } },
        { binding: 2, resource: gbuffer.depthView },
        { binding: 3, resource: shadowPass.shadowMapView },
        { binding: 4, resource: cmpSampler },
        { binding: 5, resource: { buffer: marchParamsBuf } },
        { binding: 6, resource: { buffer: cloudDensityBuf } },
        { binding: 7, resource: cloudNoises.baseView },
        { binding: 8, resource: cloudNoises.detailView },
        { binding: 9, resource: noiseSampler },
      ],
    });

    // ---- Blur + composite pipelines ----
    const compShader = device.createShaderModule({ label: 'GodrayCompositeShader', code: godrayCompositeWgsl });

    const blurHPipeline = device.createRenderPipeline({
      label: 'GodrayBlurHPipeline', layout: 'auto',
      vertex:   { module: compShader, entryPoint: 'vs_main' },
      fragment: { module: compShader, entryPoint: 'fs_blur', targets: [{ format: FOG_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });
    const blurVPipeline = device.createRenderPipeline({
      label: 'GodrayBlurVPipeline', layout: 'auto',
      vertex:   { module: compShader, entryPoint: 'vs_main' },
      fragment: { module: compShader, entryPoint: 'fs_blur', targets: [{ format: FOG_FORMAT }] },
      primitive: { topology: 'triangle-list' },
    });
    const compositePipeline = device.createRenderPipeline({
      label: 'GodrayCompositePipeline', layout: 'auto',
      vertex:   { module: compShader, entryPoint: 'vs_main' },
      fragment: {
        module: compShader, entryPoint: 'fs_composite',
        targets: [{
          format: HDR_FORMAT,
          blend: {
            color: { operation: 'add', srcFactor: 'one', dstFactor: 'one' },
            alpha: { operation: 'add', srcFactor: 'one', dstFactor: 'one' },
          },
        }],
      },
      primitive: { topology: 'triangle-list' },
    });

    const blurHBG = device.createBindGroup({
      label: 'GodrayBlurHBG', layout: blurHPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: fogAView },
        { binding: 1, resource: gbuffer.depthView },
        { binding: 2, resource: sampler },
        { binding: 3, resource: { buffer: blurHParamsBuf } },
      ],
    });
    const blurVBG = device.createBindGroup({
      label: 'GodrayBlurVBG', layout: blurVPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: fogBView },
        { binding: 1, resource: gbuffer.depthView },
        { binding: 2, resource: sampler },
        { binding: 3, resource: { buffer: blurVParamsBuf } },
      ],
    });

    const compositeBG = device.createBindGroup({
      label: 'GodrayCompositeBG', layout: compositePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: fogAView },
        { binding: 1, resource: gbuffer.depthView },
        { binding: 2, resource: sampler },
        { binding: 3, resource: { buffer: compParamsBuf } },
        { binding: 4, resource: { buffer: lightBuffer   } },
      ],
    });

    return new GodrayPass(
      fogA, fogAView, fogB, fogBView, hdrView,
      marchPipeline, blurHPipeline, blurVPipeline, compositePipeline,
      marchBG, blurHBG, blurVBG, compositeBG,
      marchParamsBuf, blurHParamsBuf, blurVParamsBuf, compParamsBuf,
      cloudDensityBuf,
    );
  }

  updateParams(ctx: RenderContext): void {
    ctx.queue.writeBuffer(this._marchParamsBuf, 0,
      new Float32Array([this.scattering, this.maxSteps, 0.0, 0.0]).buffer as ArrayBuffer);
    ctx.queue.writeBuffer(this._compParamsBuf, 0,
      new Float32Array([0.0, 0.0, this.fogCurve, 0.0]).buffer as ArrayBuffer);
  }

  updateCloudDensity(ctx: RenderContext, settings: CloudSettings): void {
    const data = new Float32Array([
      settings.cloudBase,
      settings.cloudTop,
      settings.coverage,
      settings.density,
      settings.windOffset[0],
      settings.windOffset[1],
      settings.extinction,
      0,
    ]);
    ctx.queue.writeBuffer(this._cloudDensityBuf, 0, data.buffer as ArrayBuffer);
  }

  execute(encoder: GPUCommandEncoder, _ctx: RenderContext): void {
    const draw = (label: string, target: GPUTextureView, pipeline: GPURenderPipeline, bg: GPUBindGroup, clear = true) => {
      const pass = encoder.beginRenderPass({
        label,
        colorAttachments: [{
          view: target,
          clearValue: [0, 0, 0, 0],
          loadOp: clear ? 'clear' : 'load',
          storeOp: 'store',
        }],
      });
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bg);
      pass.draw(3);
      pass.end();
    };

    draw('GodrayMarch',  this._fogAView, this._marchPipeline,    this._marchBG);
    draw('GodrayBlurH',  this._fogBView, this._blurHPipeline,    this._blurHBG);
    draw('GodrayBlurV',  this._fogAView, this._blurVPipeline,    this._blurVBG);
    draw('GodrayComposite', this._hdrView, this._compositePipeline, this._compositeBG, false);
  }

  destroy(): void {
    this._fogA.destroy();
    this._fogB.destroy();
    this._marchParamsBuf.destroy();
    this._blurHParamsBuf.destroy();
    this._blurVParamsBuf.destroy();
    this._compParamsBuf.destroy();
    this._cloudDensityBuf.destroy();
  }
}
