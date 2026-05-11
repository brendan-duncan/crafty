import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import type { GBuffer } from '../gbuffer.js';
import { buildSpawnShader, buildUpdateShader, hasBlockCollision } from '../../particles/particle_builder.js';
import type { ParticleGraphConfig } from '../../particles/particle_types.js';
import type { Mat4 } from '../../math/mat4.js';
import compactWgsl from '../../shaders/particles/particle_compact.wgsl?raw';
import renderWgsl from '../../shaders/particles/particle_render.wgsl?raw';
import renderForwardWgsl from '../../shaders/particles/particle_render_forward.wgsl?raw';
import { HDR_FORMAT } from './lighting_pass.js';

const PARTICLE_STRIDE   = 64;
const COMPUTE_UNI_SIZE  = 80;   // ComputeUniforms: 20 × f32
const COMPACT_UNI_SIZE  = 16;
const RENDER_UNI_SIZE   = 16;
const CAMERA_UNI_SIZE   = 288;
const HEIGHTMAP_UNI_SIZE = 16;  // HeightmapUniforms: origin_x, origin_z, extent, resolution
const HEIGHTMAP_RES     = 128;  // Fixed heightmap resolution for block_collision

/**
 * GPU particle system pass: simulates particles in compute (spawn → update →
 * compact) and draws them as billboards via an indirect draw. Spawn and
 * update WGSL is generated from the {@link ParticleGraphConfig}; the compact
 * step rebuilds the alive list and writes the indirect-draw `instanceCount`.
 *
 * Two render flavours are supported:
 *   - Forward HDR (alpha-blended sprites, depth read-only) writing into
 *     `hdrView`.
 *   - Deferred GBuffer (opaque billboards) writing albedo + normal into the
 *     supplied {@link GBuffer}.
 *
 * Optionally consumes a heightmap for cheap block-collision against terrain.
 */
export class ParticlePass extends RenderPass {
  readonly name = 'ParticlePass';

  private readonly _gbuffer        : GBuffer;
  private readonly _hdrView        : GPUTextureView | undefined;
  private readonly _isForward      : boolean;
  private readonly _maxParticles   : number;
  private readonly _config         : ParticleGraphConfig;

  private readonly _particleBuffer : GPUBuffer;
  private readonly _aliveList      : GPUBuffer;
  private readonly _counterBuffer  : GPUBuffer;
  private readonly _indirectBuffer : GPUBuffer;
  private readonly _computeUniforms: GPUBuffer;
  private readonly _renderUniforms : GPUBuffer;
  private readonly _cameraBuffer   : GPUBuffer;

  private readonly _spawnPipeline  : GPUComputePipeline;
  private readonly _updatePipeline : GPUComputePipeline;
  private readonly _compactPipeline: GPUComputePipeline;
  private readonly _indirectPipeline: GPUComputePipeline;
  private readonly _renderPipeline : GPURenderPipeline;

  private readonly _computeDataBG  : GPUBindGroup;
  private readonly _computeUniBG   : GPUBindGroup;
  private readonly _compactDataBG  : GPUBindGroup;
  private readonly _compactUniBG   : GPUBindGroup;
  private readonly _renderDataBG   : GPUBindGroup;
  private readonly _cameraRenderBG : GPUBindGroup;
  private readonly _renderParamsBG : GPUBindGroup | undefined;

  // block_collision heightmap (optional)
  private readonly _heightmapDataBuf: GPUBuffer | undefined;
  private readonly _heightmapUniBuf : GPUBuffer | undefined;
  private          _heightmapBG     : GPUBindGroup | undefined;

  private _spawnAccum  = 0;
  private _spawnOffset = 0;
  private _spawnCount  = 0;

  /** Override the per-second spawn rate at runtime without rebuilding the pass. */
  setSpawnRate(rate: number): void {
    this._config.emitter.spawnRate = rate;
  }

  /**
   * Pending one-shot burst, processed on the next {@link update}.
   * Overrides the emitter's world transform position and the spawn color for
   * this frame's spawn dispatch. Continuous emission is suppressed for that
   * frame so the burst count is exactly what was requested.
   */
  private _pendingBurst: { px: number; py: number; pz: number; r: number; g: number; b: number; a: number; count: number } | null = null;

  /**
   * Queues a one-shot burst of `count` particles at `position`, tinted `color`,
   * to be spawned on the next {@link update} call. Replaces any prior pending
   * burst. The burst position overrides the emitter's world transform for the
   * spawned particles only — subsequent frames return to using `worldTransform`.
   */
  burst(position: { x: number; y: number; z: number }, color: [number, number, number, number], count: number): void {
    if (count <= 0) {
      return;
    }
    const c = Math.min(count, this._maxParticles);
    this._pendingBurst = {
      px: position.x, py: position.y, pz: position.z,
      r: color[0], g: color[1], b: color[2], a: color[3],
      count: c,
    };
  }

  private _time        = 0;
  private _frameSeed   = 0;

  // Pre-allocated staging buffers — reused every frame to avoid per-frame GC.
  private readonly _cuBuf      = new Float32Array(COMPUTE_UNI_SIZE / 4);
  private readonly _cuiView    = new Uint32Array(this._cuBuf.buffer);
  private readonly _camBuf     = new Float32Array(CAMERA_UNI_SIZE / 4);
  private readonly _hmUniBuf   = new Float32Array(HEIGHTMAP_UNI_SIZE / 4);
  private readonly _hmRes      = new Uint32Array([HEIGHTMAP_RES]);
  private readonly _resetArr   = new Uint32Array(1); // stays 0

  private constructor(
    gbuffer: GBuffer,
    hdrView: GPUTextureView | undefined,
    isForward: boolean,
    config: ParticleGraphConfig,
    maxParticles: number,
    particleBuffer: GPUBuffer,
    aliveList: GPUBuffer,
    counterBuffer: GPUBuffer,
    indirectBuffer: GPUBuffer,
    computeUniforms: GPUBuffer,
    renderUniforms: GPUBuffer,
    cameraBuffer: GPUBuffer,
    spawnPipeline: GPUComputePipeline,
    updatePipeline: GPUComputePipeline,
    compactPipeline: GPUComputePipeline,
    indirectPipeline: GPUComputePipeline,
    renderPipeline: GPURenderPipeline,
    computeDataBG: GPUBindGroup,
    computeUniBG: GPUBindGroup,
    compactDataBG: GPUBindGroup,
    compactUniBG: GPUBindGroup,
    renderDataBG: GPUBindGroup,
    cameraRenderBG: GPUBindGroup,
    renderParamsBG: GPUBindGroup | undefined,
    heightmapDataBuf: GPUBuffer | undefined,
    heightmapUniBuf : GPUBuffer | undefined,
    heightmapBG     : GPUBindGroup | undefined,
  ) {
    super();
    this._gbuffer          = gbuffer;
    this._hdrView          = hdrView;
    this._isForward        = isForward;
    this._config           = config;
    this._maxParticles     = maxParticles;
    this._particleBuffer   = particleBuffer;
    this._aliveList        = aliveList;
    this._counterBuffer    = counterBuffer;
    this._indirectBuffer   = indirectBuffer;
    this._computeUniforms  = computeUniforms;
    this._renderUniforms   = renderUniforms;
    this._cameraBuffer     = cameraBuffer;
    this._spawnPipeline    = spawnPipeline;
    this._updatePipeline   = updatePipeline;
    this._compactPipeline  = compactPipeline;
    this._indirectPipeline = indirectPipeline;
    this._renderPipeline   = renderPipeline;
    this._computeDataBG    = computeDataBG;
    this._computeUniBG     = computeUniBG;
    this._compactDataBG    = compactDataBG;
    this._compactUniBG     = compactUniBG;
    this._renderDataBG     = renderDataBG;
    this._cameraRenderBG   = cameraRenderBG;
    this._renderParamsBG   = renderParamsBG;
    this._heightmapDataBuf = heightmapDataBuf;
    this._heightmapUniBuf  = heightmapUniBuf;
    this._heightmapBG      = heightmapBG;
  }

  /**
   * Builds the particle pass: allocates the particle storage buffer, alive
   * list, atomic counter, indirect draw buffer, all uniform buffers and bind
   * groups, generates and compiles the spawn/update shaders from `config`,
   * and creates the appropriate render pipeline (forward HDR or GBuffer).
   *
   * If the config uses block_collision, also allocates the heightmap data
   * and uniform buffers (populate them via {@link updateHeightmap}).
   *
   * @param ctx     Renderer context (provides GPU device).
   * @param config  Particle system definition (emitter + modules + renderer).
   * @param gbuffer GBuffer attachments (depth always sampled; color used in
   *                deferred mode).
   * @param hdrView HDR color attachment, required when `config.renderer`
   *                targets HDR.
   * @returns A configured ParticlePass with all particles initialized dead.
   */
  static create(ctx: RenderContext, config: ParticleGraphConfig, gbuffer: GBuffer, hdrView?: GPUTextureView): ParticlePass {
    const { device } = ctx;
    const isForward = config.renderer.type === 'sprites' && config.renderer.renderTarget === 'hdr';
    const maxParticles = config.emitter.maxParticles;

    // ---- Buffers ---------------------------------------------------------------

    const particleBuffer = device.createBuffer({
      label: 'ParticleBuffer',
      size: maxParticles * PARTICLE_STRIDE,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    // Initialize all life fields to -1.0 (dead). Particle struct: life is at float index 3.
    const initData = new Float32Array(maxParticles * (PARTICLE_STRIDE / 4));
    for (let i = 0; i < maxParticles; i++) {
      initData[i * 16 + 3] = -1.0;
    }
    device.queue.writeBuffer(particleBuffer, 0, initData.buffer as ArrayBuffer);

    const aliveList = device.createBuffer({
      label: 'ParticleAliveList',
      size: maxParticles * 4,
      usage: GPUBufferUsage.STORAGE,
    });

    const counterBuffer = device.createBuffer({
      label: 'ParticleCounter',
      size: 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    const indirectBuffer = device.createBuffer({
      label: 'ParticleIndirect',
      size: 16,
      usage: GPUBufferUsage.INDIRECT | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(indirectBuffer, 0, new Uint32Array([6, 0, 0, 0]));

    const computeUniforms = device.createBuffer({
      label: 'ParticleComputeUniforms',
      size: COMPUTE_UNI_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const compactUniforms = device.createBuffer({
      label: 'ParticleCompactUniforms',
      size: COMPACT_UNI_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(compactUniforms, 0, new Uint32Array([maxParticles, 0, 0, 0]));

    const renderUniforms = device.createBuffer({
      label: 'ParticleRenderUniforms',
      size: RENDER_UNI_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(renderUniforms, 0, new Float32Array([
      config.emitter.roughness, config.emitter.metallic, 0, 0,
    ]));

    const cameraBuffer = device.createBuffer({
      label: 'ParticleCameraBuffer',
      size: CAMERA_UNI_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    // ---- Bind group layouts ----------------------------------------------------

    const computeDataBGL = device.createBindGroupLayout({
      label: 'ParticleComputeDataBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
        { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
        { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
        { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
      ],
    });

    // Compact read particles as read-only (only reads life field to check alive/dead)
    const compactDataBGL = device.createBindGroupLayout({
      label: 'ParticleCompactDataBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
        { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
        { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
        { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
      ],
    });

    const computeUniBGL = device.createBindGroupLayout({
      label: 'ParticleComputeUniBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
      ],
    });

    const renderDataBGL = device.createBindGroupLayout({
      label: 'ParticleRenderDataBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'read-only-storage' } },
        { binding: 1, visibility: GPUShaderStage.VERTEX, buffer: { type: 'read-only-storage' } },
      ],
    });

    const cameraRenderBGL = device.createBindGroupLayout({
      label: 'ParticleCameraRenderBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
      ],
    });

    const renderParamsBGL = device.createBindGroupLayout({
      label: 'ParticleRenderParamsBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
      ],
    });

    // ---- Bind groups -----------------------------------------------------------

    const computeDataBG = device.createBindGroup({
      label: 'ParticleComputeDataBG',
      layout: computeDataBGL,
      entries: [
        { binding: 0, resource: { buffer: particleBuffer } },
        { binding: 1, resource: { buffer: aliveList } },
        { binding: 2, resource: { buffer: counterBuffer } },
        { binding: 3, resource: { buffer: indirectBuffer } },
      ],
    });

    const compactDataBG = device.createBindGroup({
      label: 'ParticleCompactDataBG',
      layout: compactDataBGL,
      entries: [
        { binding: 0, resource: { buffer: particleBuffer } },
        { binding: 1, resource: { buffer: aliveList } },
        { binding: 2, resource: { buffer: counterBuffer } },
        { binding: 3, resource: { buffer: indirectBuffer } },
      ],
    });

    const computeUniBG = device.createBindGroup({
      label: 'ParticleComputeUniBG',
      layout: computeUniBGL,
      entries: [{ binding: 0, resource: { buffer: computeUniforms } }],
    });

    const compactUniBG = device.createBindGroup({
      label: 'ParticleCompactUniBG',
      layout: computeUniBGL,
      entries: [{ binding: 0, resource: { buffer: compactUniforms } }],
    });

    const renderDataBG = device.createBindGroup({
      label: 'ParticleRenderDataBG',
      layout: renderDataBGL,
      entries: [
        { binding: 0, resource: { buffer: particleBuffer } },
        { binding: 1, resource: { buffer: aliveList } },
      ],
    });

    const cameraRenderBG = device.createBindGroup({
      label: 'ParticleCameraRenderBG',
      layout: cameraRenderBGL,
      entries: [{ binding: 0, resource: { buffer: cameraBuffer } }],
    });

    const renderParamsBG = device.createBindGroup({
      label: 'ParticleRenderParamsBG',
      layout: renderParamsBGL,
      entries: [{ binding: 0, resource: { buffer: renderUniforms } }],
    });

    // ---- block_collision heightmap resources -----------------------------------

    let heightmapDataBuf: GPUBuffer | undefined;
    let heightmapUniBuf : GPUBuffer | undefined;
    let heightmapBG     : GPUBindGroup | undefined;
    let heightmapBGL    : GPUBindGroupLayout | undefined;

    if (hasBlockCollision(config)) {
      heightmapDataBuf = device.createBuffer({
        label: 'ParticleHeightmapData',
        size: HEIGHTMAP_RES * HEIGHTMAP_RES * 4,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      });
      heightmapUniBuf = device.createBuffer({
        label: 'ParticleHeightmapUniforms',
        size: HEIGHTMAP_UNI_SIZE,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      heightmapBGL = device.createBindGroupLayout({
        label: 'ParticleHeightmapBGL',
        entries: [
          { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
          { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
        ],
      });
      heightmapBG = device.createBindGroup({
        label: 'ParticleHeightmapBG',
        layout: heightmapBGL,
        entries: [
          { binding: 0, resource: { buffer: heightmapDataBuf } },
          { binding: 1, resource: { buffer: heightmapUniBuf  } },
        ],
      });
    }

    // ---- Pipelines -------------------------------------------------------------

    const spawnLayout = device.createPipelineLayout({
      bindGroupLayouts: [computeDataBGL, computeUniBGL],
    });
    const updateLayout = heightmapBGL
      ? device.createPipelineLayout({ bindGroupLayouts: [computeDataBGL, computeUniBGL, heightmapBGL] })
      : device.createPipelineLayout({ bindGroupLayouts: [computeDataBGL, computeUniBGL] });
    const compactComputeLayout = device.createPipelineLayout({
      bindGroupLayouts: [compactDataBGL, computeUniBGL],
    });

    const spawnModule   = device.createShaderModule({ label: 'ParticleSpawn',   code: buildSpawnShader(config) });
    const updateModule  = device.createShaderModule({ label: 'ParticleUpdate',  code: buildUpdateShader(config) });
    const compactModule = device.createShaderModule({ label: 'ParticleCompact', code: compactWgsl });

    const spawnPipeline = device.createComputePipeline({
      label: 'ParticleSpawnPipeline',
      layout: spawnLayout,
      compute: { module: spawnModule, entryPoint: 'cs_main' },
    });
    const updatePipeline = device.createComputePipeline({
      label: 'ParticleUpdatePipeline',
      layout: updateLayout,
      compute: { module: updateModule, entryPoint: 'cs_main' },
    });
    const compactPipeline = device.createComputePipeline({
      label: 'ParticleCompactPipeline',
      layout: compactComputeLayout,
      compute: { module: compactModule, entryPoint: 'cs_compact' },
    });
    const indirectPipeline = device.createComputePipeline({
      label: 'ParticleIndirectPipeline',
      layout: compactComputeLayout,
      compute: { module: compactModule, entryPoint: 'cs_write_indirect' },
    });

    let renderPipeline: GPURenderPipeline;
    if (isForward) {
      // Forward HDR pipeline: alpha blend, no depth write.
      // 'velocity' billboard = velocity-aligned streak (rain).
      // 'camera' billboard   = camera-facing soft disc (snow, smoke).
      const billboard = config.renderer.type === 'sprites' ? config.renderer.billboard : 'camera';
      const shape     = config.renderer.type === 'sprites' ? (config.renderer.shape ?? 'soft') : 'soft';
      const vsEntry = billboard === 'camera' ? 'vs_camera' : 'vs_main';
      // Velocity-aligned streaks always use fs_main (alpha-faded tips); camera-aligned
      // sprites pick between the soft circular disc and the hard square pixel.
      const fsEntry = billboard === 'velocity'
        ? 'fs_main'
        : (shape === 'pixel' ? 'fs_pixel' : 'fs_snow');
      const renderModule = device.createShaderModule({ label: 'ParticleRenderForward', code: renderForwardWgsl });
      const renderLayout = device.createPipelineLayout({
        bindGroupLayouts: [renderDataBGL, cameraRenderBGL],
      });
      renderPipeline = device.createRenderPipeline({
        label: 'ParticleForwardPipeline',
        layout: renderLayout,
        vertex:   { module: renderModule, entryPoint: vsEntry },
        fragment: {
          module: renderModule,
          entryPoint: fsEntry,
          targets: [{
            format: HDR_FORMAT,
            blend: {
              color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' },
              alpha: { srcFactor: 'one',        dstFactor: 'one-minus-src-alpha', operation: 'add' },
            },
          }],
        },
        depthStencil: { format: 'depth32float', depthWriteEnabled: false, depthCompare: 'less' },
        primitive: { topology: 'triangle-list', cullMode: 'none' },
      });
    } else {
      // GBuffer pipeline: camera-facing billboard, writes albedo+normal, depth write on.
      const renderModule = device.createShaderModule({ label: 'ParticleRender', code: renderWgsl });
      const renderLayout = device.createPipelineLayout({
        bindGroupLayouts: [renderDataBGL, cameraRenderBGL, renderParamsBGL],
      });
      renderPipeline = device.createRenderPipeline({
        label: 'ParticleRenderPipeline',
        layout: renderLayout,
        vertex:   { module: renderModule, entryPoint: 'vs_main' },
        fragment: {
          module: renderModule,
          entryPoint: 'fs_main',
          targets: [
            { format: 'rgba8unorm'  },
            { format: 'rgba16float' },
          ],
        },
        depthStencil: { format: 'depth32float', depthWriteEnabled: true, depthCompare: 'less' },
        primitive: { topology: 'triangle-list', cullMode: 'none' },
      });
    }

    return new ParticlePass(
      gbuffer, hdrView, isForward, config, maxParticles,
      particleBuffer, aliveList, counterBuffer, indirectBuffer,
      computeUniforms, renderUniforms, cameraBuffer,
      spawnPipeline, updatePipeline, compactPipeline, indirectPipeline,
      renderPipeline,
      computeDataBG, computeUniBG,
      compactDataBG, compactUniBG,
      renderDataBG, cameraRenderBG,
      isForward ? undefined : renderParamsBG,
      heightmapDataBuf, heightmapUniBuf, heightmapBG,
    );
  }

  /**
   * Uploads a new collision heightmap covering an axis-aligned XZ region.
   * No-op when the configured particle graph does not use block collision.
   *
   * `heights[z * HEIGHTMAP_RES + x]` stores the top solid-block Y at that
   * cell. The covered region is centred on `(originX, originZ)` and spans
   * `±extent` blocks on each axis.
   *
   * @param ctx     Renderer context (used for the queue).
   * @param heights Top-block Y per cell (`HEIGHTMAP_RES * HEIGHTMAP_RES` values).
   * @param originX World-space X centre of the covered region.
   * @param originZ World-space Z centre of the covered region.
   * @param extent  Half-size of the covered region in blocks.
   */
  updateHeightmap(ctx: RenderContext, heights: Float32Array, originX: number, originZ: number, extent: number): void {
    if (!this._heightmapDataBuf || !this._heightmapUniBuf) {
      return;
    }
    ctx.queue.writeBuffer(this._heightmapDataBuf, 0, heights.buffer as ArrayBuffer);
    const uni = this._hmUniBuf;
    uni[0] = originX; uni[1] = originZ; uni[2] = extent;
    // Write first 3 floats then the u32 resolution separately to avoid aliasing.
    ctx.queue.writeBuffer(this._heightmapUniBuf, 0, uni.buffer as ArrayBuffer, 0, 12);
    ctx.queue.writeBuffer(this._heightmapUniBuf, 12, this._hmRes);
  }

  /**
   * Advances internal time, accumulates the spawn count for this frame,
   * decomposes the emitter's world transform into position+rotation, and
   * uploads compute and camera uniforms.
   *
   * @param ctx            Renderer context (used for the queue).
   * @param dt             Frame delta time, seconds.
   * @param view           View matrix (column-major).
   * @param proj           Projection matrix (column-major).
   * @param viewProj       Combined view-projection matrix.
   * @param invViewProj    Inverse view-projection matrix.
   * @param camPos         World-space camera position.
   * @param near           Near plane distance.
   * @param far            Far plane distance.
   * @param worldTransform Emitter world transform; only translation and
   *                       rotation are used (scale is normalized away).
   */
  update(
    ctx: RenderContext,
    dt: number,
    view: Mat4, proj: Mat4, viewProj: Mat4, invViewProj: Mat4,
    camPos: { x: number; y: number; z: number },
    near: number, far: number,
    worldTransform: Mat4,
  ): void {
    this._time += dt;
    this._frameSeed = (this._frameSeed + 1) & 0xFFFFFFFF;

    // Default: continuous emission accumulated from spawnRate.
    this._spawnAccum += this._config.emitter.spawnRate * dt;
    this._spawnCount  = Math.min(Math.floor(this._spawnAccum), this._maxParticles);
    this._spawnAccum -= this._spawnCount;

    // Default emitter transform comes from the per-frame world matrix.
    const m = worldTransform.data;
    let px = m[12], py = m[13], pz = m[14];
    const sx = Math.hypot(m[0], m[1], m[2]);
    const sy = Math.hypot(m[4], m[5], m[6]);
    const sz = Math.hypot(m[8], m[9], m[10]);
    const r00 = m[0]/sx, r10 = m[1]/sx, r20 = m[2]/sx;
    const r01 = m[4]/sy, r11 = m[5]/sy, r21 = m[6]/sy;
    const r02 = m[8]/sz, r12 = m[9]/sz, r22 = m[10]/sz;
    const trace = r00 + r11 + r22;
    let qx: number, qy: number, qz: number, qw: number;
    if (trace > 0) {
      const s = 0.5 / Math.sqrt(trace + 1);
      qw = 0.25 / s; qx = (r21 - r12) * s; qy = (r02 - r20) * s; qz = (r10 - r01) * s;
    } else if (r00 > r11 && r00 > r22) {
      const s = 2 * Math.sqrt(1 + r00 - r11 - r22);
      qw = (r21 - r12) / s; qx = 0.25 * s; qy = (r01 + r10) / s; qz = (r02 + r20) / s;
    } else if (r11 > r22) {
      const s = 2 * Math.sqrt(1 + r11 - r00 - r22);
      qw = (r02 - r20) / s; qx = (r01 + r10) / s; qy = 0.25 * s; qz = (r12 + r21) / s;
    } else {
      const s = 2 * Math.sqrt(1 + r22 - r00 - r11);
      qw = (r10 - r01) / s; qx = (r02 + r20) / s; qy = (r12 + r21) / s; qz = 0.25 * s;
    }

    // Default spawn color comes from the emitter config; bursts override it.
    const ec = this._config.emitter.initialColor;
    let cr = ec[0], cg = ec[1], cb = ec[2], ca = ec[3];

    // A pending burst overrides position, rotation (identity), spawn count and color
    // for this single frame. Continuous emission is replaced (not added to) so the
    // burst count is exactly what was requested.
    if (this._pendingBurst) {
      const b = this._pendingBurst;
      px = b.px; py = b.py; pz = b.pz;
      qx = 0; qy = 0; qz = 0; qw = 1;
      this._spawnCount = b.count;
      cr = b.r; cg = b.g; cb = b.b; ca = b.a;
      this._pendingBurst = null;
    }

    // ComputeUniforms (24 floats / 96 bytes-of-space, 80 actually used):
    //   [0..2]  world_pos, [3] spawn_count
    //   [4..7]  world_quat
    //   [8]     spawn_offset, [9] max_particles, [10] frame_seed, [11] _pad
    //   [12]    dt, [13] time, [14..15] _pad
    //   [16..19] spawn_color (rgba)
    const cu  = this._cuBuf;
    const cui = this._cuiView;
    cu[0] = px; cu[1] = py; cu[2] = pz;
    cui[3]  = this._spawnCount;
    cu[4]   = qx; cu[5] = qy; cu[6] = qz; cu[7] = qw;
    cui[8]  = this._spawnOffset;
    cui[9]  = this._maxParticles;
    cui[10] = this._frameSeed;
    cui[11] = 0;
    cu[12] = dt;
    cu[13] = this._time;
    cu[16] = cr; cu[17] = cg; cu[18] = cb; cu[19] = ca;
    ctx.queue.writeBuffer(this._computeUniforms, 0, cu.buffer as ArrayBuffer);

    // Reset atomic counter for this frame's compact pass
    ctx.queue.writeBuffer(this._counterBuffer, 0, this._resetArr);

    this._spawnOffset = (this._spawnOffset + this._spawnCount) % this._maxParticles;

    // Camera uniforms (72 floats / 288 bytes)
    const camData = this._camBuf;
    camData.set(view.data,         0);
    camData.set(proj.data,        16);
    camData.set(viewProj.data,    32);
    camData.set(invViewProj.data, 48);
    camData[64] = camPos.x; camData[65] = camPos.y; camData[66] = camPos.z;
    camData[67] = near;
    camData[68] = far;
    ctx.queue.writeBuffer(this._cameraBuffer, 0, camData.buffer as ArrayBuffer);
  }

  /**
   * Records the simulation compute pass (spawn → update → compact → indirect
   * write) followed by the billboard draw (forward HDR or deferred GBuffer
   * variant, selected at construction).
   *
   * @param encoder Active command encoder to record into.
   * @param _ctx    Render context (unused).
   */
  execute(encoder: GPUCommandEncoder, _ctx: RenderContext): void {
    // ---- Compute: spawn → update → compact-fill → compact-indirect-write -------
    const compute = encoder.beginComputePass({ label: 'ParticleCompute' });

    if (this._spawnCount > 0) {
      compute.setPipeline(this._spawnPipeline);
      compute.setBindGroup(0, this._computeDataBG);
      compute.setBindGroup(1, this._computeUniBG);
      compute.dispatchWorkgroups(Math.ceil(this._spawnCount / 64));
    }

    compute.setPipeline(this._updatePipeline);
    compute.setBindGroup(0, this._computeDataBG);
    compute.setBindGroup(1, this._computeUniBG);
    if (this._heightmapBG) {
      compute.setBindGroup(2, this._heightmapBG);
    }
    compute.dispatchWorkgroups(Math.ceil(this._maxParticles / 64));

    // Compact: scan all slots, rebuild alive_list and indirect instanceCount.
    // Two sequential dispatches within one pass guarantee ordering.
    compute.setPipeline(this._compactPipeline);
    compute.setBindGroup(0, this._compactDataBG);
    compute.setBindGroup(1, this._compactUniBG);
    compute.dispatchWorkgroups(Math.ceil(this._maxParticles / 64));

    compute.setPipeline(this._indirectPipeline);
    compute.dispatchWorkgroups(1);

    compute.end();

    // ---- Render: billboard quads -------------------------------------------
    if (this._isForward) {
      // Forward HDR pass: alpha-blended, reads GBuffer depth (no write).
      const pass = encoder.beginRenderPass({
        label: 'ParticleForwardPass',
        colorAttachments: [
          { view: this._hdrView!, loadOp: 'load', storeOp: 'store' },
        ],
        depthStencilAttachment: {
          view: this._gbuffer.depthView,
          depthReadOnly: true,
        },
      });
      pass.setPipeline(this._renderPipeline);
      pass.setBindGroup(0, this._renderDataBG);
      pass.setBindGroup(1, this._cameraRenderBG);
      pass.drawIndirect(this._indirectBuffer, 0);
      pass.end();
    } else {
      // GBuffer pass: opaque particles write to albedo+normal.
      const pass = encoder.beginRenderPass({
        label: 'ParticleGBufferPass',
        colorAttachments: [
          { view: this._gbuffer.albedoRoughnessView, loadOp: 'load', storeOp: 'store' },
          { view: this._gbuffer.normalMetallicView,  loadOp: 'load', storeOp: 'store' },
        ],
        depthStencilAttachment: {
          view: this._gbuffer.depthView,
          depthLoadOp: 'load', depthStoreOp: 'store',
        },
      });
      pass.setPipeline(this._renderPipeline);
      pass.setBindGroup(0, this._renderDataBG);
      pass.setBindGroup(1, this._cameraRenderBG);
      pass.setBindGroup(2, this._renderParamsBG!);
      pass.drawIndirect(this._indirectBuffer, 0);
      pass.end();
    }
  }

  /**
   * Releases all GPU buffers owned by this pass, including the optional
   * heightmap buffers when present.
   */
  destroy(): void {
    this._particleBuffer.destroy();
    this._aliveList.destroy();
    this._counterBuffer.destroy();
    this._indirectBuffer.destroy();
    this._computeUniforms.destroy();
    this._renderUniforms.destroy();
    this._cameraBuffer.destroy();
    this._heightmapDataBuf?.destroy();
    this._heightmapUniBuf?.destroy();
  }
}
