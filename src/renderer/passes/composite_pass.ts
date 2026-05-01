import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import type { Mat4 } from '../../math/mat4.js';
import compositeWgsl from '../../shaders/composite.wgsl?raw';

// Merged replacement for FogPass + UnderwaterPass + TonemapPass.
// Saves 2 intermediate HDR textures and 2 render-pass boundaries.

// params uniform layout (64 bytes — offsets in f32 indices):
//  [0..2]  fog_color
//  [3]     depth_density
//  [4]     depth_begin
//  [5]     depth_end
//  [6]     depth_curve
//  [7]     height_density
//  [8]     height_min
//  [9]     height_max
//  [10]    height_curve
//  [11]    fog_flags  (u32: bit 0 = depth, bit 1 = height)
//  [12]    uw_time
//  [13]    is_underwater
//  [14]    tonemap_flags (u32: bit 0 = aces, bit 1 = debug_ao, bit 2 = hdr_canvas)
//  [15]    _pad
const PARAMS_SIZE   = 64;
const STAR_UNI_SIZE = 96; // mat4(64) + vec3+pad(16) + vec3+pad(16)

export class CompositePass extends RenderPass {
  readonly name = 'CompositePass';

  // ── Fog properties ────────────────────────────────────────────────────────
  depthFogEnabled  = true;
  depthDensity     = 1.0;
  depthBegin       = 32;
  depthEnd         = 128;
  depthCurve       = 1.5;
  heightFogEnabled = false;
  heightDensity    = 0.7;
  heightMin        = 48;
  heightMax        = 80;
  heightCurve      = 1.0;
  fogColor: [number, number, number] = [1.0, 1.0, 1.0];

  private _pipeline  : GPURenderPipeline;
  private _bg0       : GPUBindGroup;  // textures + sampler
  private _bg1       : GPUBindGroup;  // camera + light (shared buffers)
  private _bg2       : GPUBindGroup;  // params + stars + exposure
  private _paramsBuf : GPUBuffer;
  private _starBuf   : GPUBuffer;

  private constructor(
    pipeline : GPURenderPipeline,
    bg0      : GPUBindGroup,
    bg1      : GPUBindGroup,
    bg2      : GPUBindGroup,
    paramsBuf: GPUBuffer,
    starBuf  : GPUBuffer,
  ) {
    super();
    this._pipeline  = pipeline;
    this._bg0       = bg0;
    this._bg1       = bg1;
    this._bg2       = bg2;
    this._paramsBuf = paramsBuf;
    this._starBuf   = starBuf;
  }

  // hdrView      — post-Bloom (or post-DOF / TAA resolved) HDR texture
  // aoView       — SSAO AO texture (used by debug_ao mode)
  // depthView    — GBuffer depth32float (for fog world-position reconstruction + stars)
  // cameraBuffer — shared with LightingPass (CameraUniforms)
  // lightBuffer  — shared with LightingPass (LightUniforms — only direction is read)
  // exposureBuf  — shared with AutoExposurePass
  static create(
    ctx          : RenderContext,
    hdrView      : GPUTextureView,
    aoView       : GPUTextureView,
    depthView    : GPUTextureView,
    cameraBuffer : GPUBuffer,
    lightBuffer  : GPUBuffer,
    exposureBuf  : GPUBuffer,
  ): CompositePass {
    const { device, format } = ctx;

    const bgl0 = device.createBindGroupLayout({
      label: 'CompositeBGL0',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering'   } },
      ],
    });

    const bgl1 = device.createBindGroupLayout({
      label: 'CompositeBGL1',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }, // camera
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }, // light dir
      ],
    });

    const bgl2 = device.createBindGroupLayout({
      label: 'CompositeBGL2',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform'          } }, // params
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform'          } }, // stars
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'read-only-storage'} }, // exposure
      ],
    });

    const sampler   = device.createSampler({ label: 'CompositeSampler', magFilter: 'linear', minFilter: 'linear' });
    const paramsBuf = device.createBuffer({ label: 'CompositeParams', size: PARAMS_SIZE,   usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    const starBuf   = device.createBuffer({ label: 'CompositeStars',  size: STAR_UNI_SIZE, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });

    const bg0 = device.createBindGroup({
      label: 'CompositeBG0', layout: bgl0,
      entries: [
        { binding: 0, resource: hdrView   },
        { binding: 1, resource: aoView    },
        { binding: 2, resource: depthView },
        { binding: 3, resource: sampler   },
      ],
    });

    const bg1 = device.createBindGroup({
      label: 'CompositeBG1', layout: bgl1,
      entries: [
        { binding: 0, resource: { buffer: cameraBuffer } },
        { binding: 1, resource: { buffer: lightBuffer  } },
      ],
    });

    const bg2 = device.createBindGroup({
      label: 'CompositeBG2', layout: bgl2,
      entries: [
        { binding: 0, resource: { buffer: paramsBuf  } },
        { binding: 1, resource: { buffer: starBuf    } },
        { binding: 2, resource: { buffer: exposureBuf} },
      ],
    });

    const shader   = device.createShaderModule({ label: 'CompositeShader', code: compositeWgsl });
    const layout   = device.createPipelineLayout({ bindGroupLayouts: [bgl0, bgl1, bgl2] });
    const pipeline = device.createRenderPipeline({
      label   : 'CompositePipeline',
      layout,
      vertex  : { module: shader, entryPoint: 'vs_main' },
      fragment: { module: shader, entryPoint: 'fs_main', targets: [{ format }] },
      primitive: { topology: 'triangle-list' },
    });

    return new CompositePass(pipeline, bg0, bg1, bg2, paramsBuf, starBuf);
  }

  // Write all per-frame params in one buffer write.
  // Call after setting fog property fields.
  updateParams(
    ctx         : RenderContext,
    isUnderwater: boolean,
    uwTime      : number,
    aces        : boolean,
    debugAO     : boolean,
    hdrCanvas   : boolean,
  ): void {
    const buf = new ArrayBuffer(PARAMS_SIZE);
    const f   = new Float32Array(buf);
    const u   = new Uint32Array(buf);

    let fogFlags = 0;
    if (this.depthFogEnabled)  fogFlags |= 1;
    if (this.heightFogEnabled) fogFlags |= 2;

    let tonemapFlags = 0;
    if (aces)     tonemapFlags |= 1;
    if (debugAO)  tonemapFlags |= 2;
    if (hdrCanvas) tonemapFlags |= 4;

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
    u[11] = fogFlags;
    f[12] = uwTime;
    f[13] = isUnderwater ? 1.0 : 0.0;
    u[14] = tonemapFlags;
    f[15] = 0;

    ctx.queue.writeBuffer(this._paramsBuf, 0, buf);
  }

  updateStars(
    ctx        : RenderContext,
    invViewProj: Mat4,
    camPos     : { x: number; y: number; z: number },
    sunDir     : { x: number; y: number; z: number },
  ): void {
    const data = new Float32Array(STAR_UNI_SIZE / 4);
    data.set(invViewProj.data, 0);
    data[16] = camPos.x; data[17] = camPos.y; data[18] = camPos.z; data[19] = 0;
    data[20] = sunDir.x;  data[21] = sunDir.y;  data[22] = sunDir.z;  data[23] = 0;
    ctx.queue.writeBuffer(this._starBuf, 0, data.buffer as ArrayBuffer);
  }

  execute(encoder: GPUCommandEncoder, ctx: RenderContext): void {
    const pass = encoder.beginRenderPass({
      label: 'CompositePass',
      colorAttachments: [{
        view: ctx.getCurrentTexture().createView(),
        clearValue: [0, 0, 0, 1],
        loadOp: 'clear',
        storeOp: 'store',
      }],
    });
    pass.setPipeline(this._pipeline);
    pass.setBindGroup(0, this._bg0);
    pass.setBindGroup(1, this._bg1);
    pass.setBindGroup(2, this._bg2);
    pass.draw(3);
    pass.end();
  }

  destroy(): void {
    this._paramsBuf.destroy();
    this._starBuf.destroy();
  }
}
