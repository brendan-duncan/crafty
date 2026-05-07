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

/**
 * Final fullscreen pass that composes the post-processed HDR scene with fog,
 * stars, the underwater effect and tonemapping into the swap-chain target.
 *
 * Inputs sampled:
 *  - `hdrView`: post-bloom (or DOF/TAA) HDR colour
 *  - `aoView`: SSAO occlusion (used for the debug-AO output mode)
 *  - `depthView`: GBuffer depth32float (for fog reconstruction and stars)
 *  - shared camera, light and auto-exposure buffers
 *
 * Output: writes LDR/HDR colour to the swap-chain texture acquired from the
 * render context.
 *
 * Shader: `composite.wgsl`. Replaces the legacy fog + underwater + tonemap
 * passes to save two intermediate HDR textures and two render-pass boundaries.
 */
export class CompositePass extends RenderPass {
  /** Identifier used in render-graph diagnostics. */
  readonly name = 'CompositePass';

  // ── Fog properties ────────────────────────────────────────────────────────
  /** When true, depth-based exponential fog is applied. */
  depthFogEnabled  = true;
  /** Depth fog density multiplier. */
  depthDensity     = 1.0;
  /** World-space distance at which depth fog begins to accumulate. */
  depthBegin       = 32;
  /** World-space distance at which depth fog reaches full strength. */
  depthEnd         = 128;
  /** Power curve applied to the depth-fog interpolation in [begin, end]. */
  depthCurve       = 1.5;
  /** When true, height-based fog is applied (heavier near {@link heightMin}). */
  heightFogEnabled = false;
  /** Height fog density multiplier. */
  heightDensity    = 0.7;
  /** World-space Y at which height fog reaches its strongest contribution. */
  heightMin        = 48;
  /** World-space Y at which height fog vanishes. */
  heightMax        = 80;
  /** Power curve applied to the height-fog interpolation. */
  heightCurve      = 1.0;
  /** Linear RGB fog tint shared by both fog modes. */
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

  /**
   * Allocates the pipeline, bind groups and uniform buffers for the composite
   * pass.
   *
   * @param ctx - Active render context (provides device and swap-chain format).
   * @param hdrView - Post-bloom (or post-DOF/TAA) HDR scene texture.
   * @param aoView - SSAO ambient-occlusion texture (used for debug visualisation).
   * @param depthView - GBuffer depth32float view for world-position reconstruction and stars.
   * @param cameraBuffer - Shared `CameraUniforms` buffer (also used by lighting).
   * @param lightBuffer - Shared `LightUniforms` buffer (only the sun direction is read).
   * @param exposureBuf - Auto-exposure storage buffer used for tonemapping.
   * @returns A configured composite pass instance.
   */
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

  /**
   * Packs all fog, underwater and tonemap parameters into a single GPU
   * buffer write. Call once per frame after mutating the fog property fields.
   *
   * @param ctx - Active render context providing the GPU queue.
   * @param isUnderwater - Whether the camera is currently submerged.
   * @param uwTime - Animation time used for underwater distortion.
   * @param aces - Enable ACES tonemapping (otherwise Reinhard is used).
   * @param debugAO - Output the SSAO buffer instead of the final image.
   * @param hdrCanvas - Skip the SDR clamp when the canvas is HDR-capable.
   */
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
    if (this.depthFogEnabled) {
      fogFlags |= 1;
    }
    if (this.heightFogEnabled) {
      fogFlags |= 2;
    }

    let tonemapFlags = 0;
    if (aces) {
      tonemapFlags |= 1;
    }
    if (debugAO) {
      tonemapFlags |= 2;
    }
    if (hdrCanvas) {
      tonemapFlags |= 4;
    }

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

  /**
   * Uploads the data needed by the analytic star field rendered when the sun
   * is below the horizon.
   *
   * @param ctx - Active render context providing the GPU queue.
   * @param invViewProj - Inverse view-projection matrix for ray reconstruction.
   * @param camPos - World-space camera position.
   * @param sunDir - Normalised sun direction (used to fade stars at dawn/dusk).
   */
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

  /**
   * Encodes the composite pass into the swap-chain texture for the current frame.
   *
   * @param encoder - GPU command encoder to record into.
   * @param ctx - Active render context (used to acquire the current swap-chain texture).
   */
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

  /** Releases the params and star uniform buffers owned by this pass. */
  destroy(): void {
    this._paramsBuf.destroy();
    this._starBuf.destroy();
  }
}
