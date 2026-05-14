import type { RenderContext } from '../../render_context.js';
import { Pass } from '../pass.js';
import type { PassBuilder, RenderGraph, ResourceHandle } from '../index.js';
import { buildSpawnShader, buildUpdateShader, hasBlockCollision } from '../../../particles/particle_builder.js';
import type { ParticleGraphConfig } from '../../../particles/particle_types.js';
import type { Mat4 } from '../../../math/mat4.js';
import compactWgsl from '../../../shaders/particles/particle_compact.wgsl?raw';
import renderWgsl from '../../../shaders/particles/particle_render.wgsl?raw';
import renderForwardWgsl from '../../../shaders/particles/particle_render_forward.wgsl?raw';
import { HDR_FORMAT } from './deferred_lighting_pass.js';
import { GBUF_ALBEDO_FORMAT, GBUF_NORMAL_FORMAT, GBUF_DEPTH_FORMAT } from './block_geometry_pass.js';

const PARTICLE_STRIDE = 64;
const COMPUTE_UNI_SIZE = 80;
const COMPACT_UNI_SIZE = 16;
const RENDER_UNI_SIZE = 16;
const CAMERA_UNI_SIZE = 288;
const HEIGHTMAP_UNI_SIZE = 16;
const HEIGHTMAP_RES = 128;

export interface ParticleDeps {
  /** GBuffer attachments. Forward (HDR) target needs depth read; deferred needs all three. */
  gbuffer: { albedo?: ResourceHandle; normal?: ResourceHandle; depth: ResourceHandle };
  /** HDR target for forward (alpha-blended) particles. Required when the config's renderTarget === 'hdr'. */
  hdr?: ResourceHandle;
}

export interface ParticleOutputs {
  /** Forward HDR output (the loaded+blended hdr handle). Undefined for deferred GBuffer mode. */
  hdr?: ResourceHandle;
  /** Deferred GBuffer outputs. Undefined for forward mode. */
  albedo?: ResourceHandle;
  normal?: ResourceHandle;
  depth?: ResourceHandle;
}

/**
 * GPU particle system pass (render-graph version).
 *
 * Compute (spawn → update → compact → indirect-write) followed by an indirect
 * billboard draw, either alpha-blended into the HDR target (forward mode) or
 * additive into the GBuffer (deferred mode), driven by `config.renderer`.
 */
export class ParticlePass extends Pass<ParticleDeps, ParticleOutputs> {
  readonly name = 'ParticlePass';

  private readonly _isForward: boolean;
  private readonly _maxParticles: number;
  private readonly _config: ParticleGraphConfig;

  private readonly _particleBuffer: GPUBuffer;
  private readonly _aliveList: GPUBuffer;
  private readonly _counterBuffer: GPUBuffer;
  private readonly _indirectBuffer: GPUBuffer;
  private readonly _computeUniforms: GPUBuffer;
  private readonly _renderUniforms: GPUBuffer;
  private readonly _cameraBuffer: GPUBuffer;

  private readonly _spawnPipeline: GPUComputePipeline;
  private readonly _updatePipeline: GPUComputePipeline;
  private readonly _compactPipeline: GPUComputePipeline;
  private readonly _indirectPipeline: GPUComputePipeline;
  private readonly _renderPipeline: GPURenderPipeline;

  private readonly _computeDataBg: GPUBindGroup;
  private readonly _computeUniBg: GPUBindGroup;
  private readonly _compactDataBg: GPUBindGroup;
  private readonly _compactUniBg: GPUBindGroup;
  private readonly _renderDataBg: GPUBindGroup;
  private readonly _cameraRenderBg: GPUBindGroup;
  private readonly _renderParamsBg: GPUBindGroup | undefined;

  private readonly _heightmapDataBuf: GPUBuffer | undefined;
  private readonly _heightmapUniBuf: GPUBuffer | undefined;
  private readonly _heightmapBg: GPUBindGroup | undefined;

  private _spawnAccum = 0;
  private _spawnOffset = 0;
  private _spawnCount = 0;
  private _time = 0;
  private _frameSeed = 0;
  private _pendingBurst: { px: number; py: number; pz: number; r: number; g: number; b: number; a: number; count: number } | null = null;

  private readonly _cuBuf = new Float32Array(COMPUTE_UNI_SIZE / 4);
  private readonly _cuiView = new Uint32Array(this._cuBuf.buffer);
  private readonly _camBuf = new Float32Array(CAMERA_UNI_SIZE / 4);
  private readonly _hmUniBuf = new Float32Array(HEIGHTMAP_UNI_SIZE / 4);
  private readonly _hmRes = new Uint32Array([HEIGHTMAP_RES]);
  private readonly _resetArr = new Uint32Array(1);

  setSpawnRate(rate: number): void {
    this._config.emitter.spawnRate = rate;
  }

  burst(position: { x: number; y: number; z: number }, color: [number, number, number, number], count: number): void {
    if (count <= 0) return;
    const c = Math.min(count, this._maxParticles);
    this._pendingBurst = {
      px: position.x, py: position.y, pz: position.z,
      r: color[0], g: color[1], b: color[2], a: color[3], count: c,
    };
  }

  private constructor(
    isForward: boolean,
    config: ParticleGraphConfig,
    maxParticles: number,
    particleBuffer: GPUBuffer, aliveList: GPUBuffer, counterBuffer: GPUBuffer, indirectBuffer: GPUBuffer,
    computeUniforms: GPUBuffer, renderUniforms: GPUBuffer, cameraBuffer: GPUBuffer,
    spawnPipeline: GPUComputePipeline, updatePipeline: GPUComputePipeline,
    compactPipeline: GPUComputePipeline, indirectPipeline: GPUComputePipeline,
    renderPipeline: GPURenderPipeline,
    computeDataBg: GPUBindGroup, computeUniBg: GPUBindGroup,
    compactDataBg: GPUBindGroup, compactUniBg: GPUBindGroup,
    renderDataBg: GPUBindGroup, cameraRenderBg: GPUBindGroup,
    renderParamsBg: GPUBindGroup | undefined,
    heightmapDataBuf: GPUBuffer | undefined, heightmapUniBuf: GPUBuffer | undefined, heightmapBg: GPUBindGroup | undefined,
  ) {
    super();
    this._isForward = isForward;
    this._config = config;
    this._maxParticles = maxParticles;
    this._particleBuffer = particleBuffer;
    this._aliveList = aliveList;
    this._counterBuffer = counterBuffer;
    this._indirectBuffer = indirectBuffer;
    this._computeUniforms = computeUniforms;
    this._renderUniforms = renderUniforms;
    this._cameraBuffer = cameraBuffer;
    this._spawnPipeline = spawnPipeline;
    this._updatePipeline = updatePipeline;
    this._compactPipeline = compactPipeline;
    this._indirectPipeline = indirectPipeline;
    this._renderPipeline = renderPipeline;
    this._computeDataBg = computeDataBg;
    this._computeUniBg = computeUniBg;
    this._compactDataBg = compactDataBg;
    this._compactUniBg = compactUniBg;
    this._renderDataBg = renderDataBg;
    this._cameraRenderBg = cameraRenderBg;
    this._renderParamsBg = renderParamsBg;
    this._heightmapDataBuf = heightmapDataBuf;
    this._heightmapUniBuf = heightmapUniBuf;
    this._heightmapBg = heightmapBg;
  }

  static create(ctx: RenderContext, config: ParticleGraphConfig): ParticlePass {
    const { device } = ctx;
    const isForward = config.renderer.type === 'sprites' && config.renderer.renderTarget === 'hdr';
    const maxParticles = config.emitter.maxParticles;

    const particleBuffer = device.createBuffer({
      label: 'ParticleBuffer',
      size: maxParticles * PARTICLE_STRIDE,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    const initData = new Float32Array(maxParticles * (PARTICLE_STRIDE / 4));
    for (let i = 0; i < maxParticles; i++) initData[i * 16 + 3] = -1.0;
    device.queue.writeBuffer(particleBuffer, 0, initData.buffer as ArrayBuffer);

    const aliveList = device.createBuffer({
      label: 'ParticleAliveList', size: maxParticles * 4, usage: GPUBufferUsage.STORAGE,
    });
    const counterBuffer = device.createBuffer({
      label: 'ParticleCounter', size: 4, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    const indirectBuffer = device.createBuffer({
      label: 'ParticleIndirect', size: 16,
      usage: GPUBufferUsage.INDIRECT | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(indirectBuffer, 0, new Uint32Array([6, 0, 0, 0]));

    const computeUniforms = device.createBuffer({
      label: 'ParticleComputeUniforms', size: COMPUTE_UNI_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const compactUniforms = device.createBuffer({
      label: 'ParticleCompactUniforms', size: COMPACT_UNI_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(compactUniforms, 0, new Uint32Array([maxParticles, 0, 0, 0]));

    const renderUniforms = device.createBuffer({
      label: 'ParticleRenderUniforms', size: RENDER_UNI_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(renderUniforms, 0, new Float32Array([
      config.emitter.roughness, config.emitter.metallic, 0, 0,
    ]));

    const cameraBuffer = device.createBuffer({
      label: 'ParticleCameraBuffer', size: CAMERA_UNI_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const computeDataBgl = device.createBindGroupLayout({
      label: 'ParticleComputeDataBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
        { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
        { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
        { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
      ],
    });
    const compactDataBgl = device.createBindGroupLayout({
      label: 'ParticleCompactDataBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
        { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
        { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
        { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
      ],
    });
    const computeUniBgl = device.createBindGroupLayout({
      label: 'ParticleComputeUniBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } }],
    });
    const renderDataBgl = device.createBindGroupLayout({
      label: 'ParticleRenderDataBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'read-only-storage' } },
        { binding: 1, visibility: GPUShaderStage.VERTEX, buffer: { type: 'read-only-storage' } },
      ],
    });
    const cameraRenderBgl = device.createBindGroupLayout({
      label: 'ParticleCameraRenderBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
    });
    const renderParamsBgl = device.createBindGroupLayout({
      label: 'ParticleRenderParamsBGL',
      entries: [{ binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
    });

    const computeDataBg = device.createBindGroup({
      label: 'ParticleComputeDataBG', layout: computeDataBgl,
      entries: [
        { binding: 0, resource: { buffer: particleBuffer } },
        { binding: 1, resource: { buffer: aliveList } },
        { binding: 2, resource: { buffer: counterBuffer } },
        { binding: 3, resource: { buffer: indirectBuffer } },
      ],
    });
    const compactDataBg = device.createBindGroup({
      label: 'ParticleCompactDataBG', layout: compactDataBgl,
      entries: [
        { binding: 0, resource: { buffer: particleBuffer } },
        { binding: 1, resource: { buffer: aliveList } },
        { binding: 2, resource: { buffer: counterBuffer } },
        { binding: 3, resource: { buffer: indirectBuffer } },
      ],
    });
    const computeUniBg = device.createBindGroup({
      label: 'ParticleComputeUniBG', layout: computeUniBgl,
      entries: [{ binding: 0, resource: { buffer: computeUniforms } }],
    });
    const compactUniBg = device.createBindGroup({
      label: 'ParticleCompactUniBG', layout: computeUniBgl,
      entries: [{ binding: 0, resource: { buffer: compactUniforms } }],
    });
    const renderDataBg = device.createBindGroup({
      label: 'ParticleRenderDataBG', layout: renderDataBgl,
      entries: [
        { binding: 0, resource: { buffer: particleBuffer } },
        { binding: 1, resource: { buffer: aliveList } },
      ],
    });
    const cameraRenderBg = device.createBindGroup({
      label: 'ParticleCameraRenderBG', layout: cameraRenderBgl,
      entries: [{ binding: 0, resource: { buffer: cameraBuffer } }],
    });
    const renderParamsBg = device.createBindGroup({
      label: 'ParticleRenderParamsBG', layout: renderParamsBgl,
      entries: [{ binding: 0, resource: { buffer: renderUniforms } }],
    });

    let heightmapDataBuf: GPUBuffer | undefined;
    let heightmapUniBuf: GPUBuffer | undefined;
    let heightmapBg: GPUBindGroup | undefined;
    let heightmapBgl: GPUBindGroupLayout | undefined;

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
      heightmapBgl = device.createBindGroupLayout({
        label: 'ParticleHeightmapBGL',
        entries: [
          { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
          { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
        ],
      });
      heightmapBg = device.createBindGroup({
        label: 'ParticleHeightmapBG', layout: heightmapBgl,
        entries: [
          { binding: 0, resource: { buffer: heightmapDataBuf } },
          { binding: 1, resource: { buffer: heightmapUniBuf } },
        ],
      });
    }

    const spawnLayout = device.createPipelineLayout({ bindGroupLayouts: [computeDataBgl, computeUniBgl] });
    const updateLayout = heightmapBgl
      ? device.createPipelineLayout({ bindGroupLayouts: [computeDataBgl, computeUniBgl, heightmapBgl] })
      : device.createPipelineLayout({ bindGroupLayouts: [computeDataBgl, computeUniBgl] });
    const compactComputeLayout = device.createPipelineLayout({ bindGroupLayouts: [compactDataBgl, computeUniBgl] });

    const spawnModule = device.createShaderModule({ label: 'ParticleSpawn', code: buildSpawnShader(config) });
    const updateModule = device.createShaderModule({ label: 'ParticleUpdate', code: buildUpdateShader(config) });
    const compactModule = device.createShaderModule({ label: 'ParticleCompact', code: compactWgsl });

    const spawnPipeline = device.createComputePipeline({
      label: 'ParticleSpawnPipeline', layout: spawnLayout,
      compute: { module: spawnModule, entryPoint: 'cs_main' },
    });
    const updatePipeline = device.createComputePipeline({
      label: 'ParticleUpdatePipeline', layout: updateLayout,
      compute: { module: updateModule, entryPoint: 'cs_main' },
    });
    const compactPipeline = device.createComputePipeline({
      label: 'ParticleCompactPipeline', layout: compactComputeLayout,
      compute: { module: compactModule, entryPoint: 'cs_compact' },
    });
    const indirectPipeline = device.createComputePipeline({
      label: 'ParticleIndirectPipeline', layout: compactComputeLayout,
      compute: { module: compactModule, entryPoint: 'cs_write_indirect' },
    });

    let renderPipeline: GPURenderPipeline;
    if (isForward) {
      const billboard = config.renderer.type === 'sprites' ? config.renderer.billboard : 'camera';
      const shape = config.renderer.type === 'sprites' ? (config.renderer.shape ?? 'soft') : 'soft';
      const vsEntry = billboard === 'camera' ? 'vs_camera' : 'vs_main';
      const fsEntry = billboard === 'velocity'
        ? 'fs_main'
        : (shape === 'pixel' ? 'fs_pixel' : 'fs_snow');
      const renderModule = ctx.createShaderModule(renderForwardWgsl, 'ParticleRenderForward');
      renderPipeline = device.createRenderPipeline({
        label: 'ParticleForwardPipeline',
        layout: device.createPipelineLayout({ bindGroupLayouts: [renderDataBgl, cameraRenderBgl] }),
        vertex: { module: renderModule, entryPoint: vsEntry },
        fragment: {
          module: renderModule, entryPoint: fsEntry,
          targets: [{
            format: HDR_FORMAT,
            blend: {
              color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' },
              alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
            },
          }],
        },
        depthStencil: { format: GBUF_DEPTH_FORMAT, depthWriteEnabled: false, depthCompare: 'less' },
        primitive: { topology: 'triangle-list', cullMode: 'none' },
      });
    } else {
      const renderModule = ctx.createShaderModule(renderWgsl, 'ParticleRender');
      renderPipeline = device.createRenderPipeline({
        label: 'ParticleRenderPipeline',
        layout: device.createPipelineLayout({ bindGroupLayouts: [renderDataBgl, cameraRenderBgl, renderParamsBgl] }),
        vertex: { module: renderModule, entryPoint: 'vs_main' },
        fragment: {
          module: renderModule, entryPoint: 'fs_main',
          targets: [{ format: GBUF_ALBEDO_FORMAT }, { format: GBUF_NORMAL_FORMAT }],
        },
        depthStencil: { format: GBUF_DEPTH_FORMAT, depthWriteEnabled: true, depthCompare: 'less' },
        primitive: { topology: 'triangle-list', cullMode: 'none' },
      });
    }

    return new ParticlePass(
      isForward, config, maxParticles,
      particleBuffer, aliveList, counterBuffer, indirectBuffer,
      computeUniforms, renderUniforms, cameraBuffer,
      spawnPipeline, updatePipeline, compactPipeline, indirectPipeline,
      renderPipeline,
      computeDataBg, computeUniBg, compactDataBg, compactUniBg,
      renderDataBg, cameraRenderBg,
      isForward ? undefined : renderParamsBg,
      heightmapDataBuf, heightmapUniBuf, heightmapBg,
    );
  }

  updateHeightmap(ctx: RenderContext, heights: Float32Array, originX: number, originZ: number, extent: number): void {
    if (!this._heightmapDataBuf || !this._heightmapUniBuf) return;
    ctx.queue.writeBuffer(this._heightmapDataBuf, 0, heights.buffer as ArrayBuffer);
    const uni = this._hmUniBuf;
    uni[0] = originX; uni[1] = originZ; uni[2] = extent;
    ctx.queue.writeBuffer(this._heightmapUniBuf, 0, uni.buffer as ArrayBuffer, 0, 12);
    ctx.queue.writeBuffer(this._heightmapUniBuf, 12, this._hmRes);
  }

  update(
    ctx: RenderContext, dt: number,
    view: Mat4, proj: Mat4, viewProj: Mat4, invViewProj: Mat4,
    camPos: { x: number; y: number; z: number },
    near: number, far: number,
    worldTransform: Mat4,
  ): void {
    this._time += dt;
    this._frameSeed = (this._frameSeed + 1) & 0xFFFFFFFF;

    this._spawnAccum += this._config.emitter.spawnRate * dt;
    this._spawnCount = Math.min(Math.floor(this._spawnAccum), this._maxParticles);
    this._spawnAccum -= this._spawnCount;

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

    const ec = this._config.emitter.initialColor;
    let cr = ec[0], cg = ec[1], cb = ec[2], ca = ec[3];

    if (this._pendingBurst) {
      const b = this._pendingBurst;
      px = b.px; py = b.py; pz = b.pz;
      qx = 0; qy = 0; qz = 0; qw = 1;
      this._spawnCount = b.count;
      cr = b.r; cg = b.g; cb = b.b; ca = b.a;
      this._pendingBurst = null;
    }

    const cu = this._cuBuf;
    const cui = this._cuiView;
    cu[0] = px; cu[1] = py; cu[2] = pz;
    cui[3] = this._spawnCount;
    cu[4] = qx; cu[5] = qy; cu[6] = qz; cu[7] = qw;
    cui[8] = this._spawnOffset;
    cui[9] = this._maxParticles;
    cui[10] = this._frameSeed;
    cui[11] = 0;
    cu[12] = dt;
    cu[13] = this._time;
    cu[16] = cr; cu[17] = cg; cu[18] = cb; cu[19] = ca;
    ctx.queue.writeBuffer(this._computeUniforms, 0, cu.buffer as ArrayBuffer);
    ctx.queue.writeBuffer(this._counterBuffer, 0, this._resetArr);

    this._spawnOffset = (this._spawnOffset + this._spawnCount) % this._maxParticles;

    const camData = this._camBuf;
    camData.set(view.data, 0); camData.set(proj.data, 16);
    camData.set(viewProj.data, 32); camData.set(invViewProj.data, 48);
    camData[64] = camPos.x; camData[65] = camPos.y; camData[66] = camPos.z;
    camData[67] = near; camData[68] = far;
    ctx.queue.writeBuffer(this._cameraBuffer, 0, camData.buffer as ArrayBuffer);
  }

  addToGraph(graph: RenderGraph, deps: ParticleDeps): ParticleOutputs {
    // 1. Compute pass: spawn → update → compact → indirect.
    graph.addPass(this.name + '.compute', 'compute', (b: PassBuilder) => {
      // The compute work is internal to the pass (uses pass-owned buffers).
      // Declare no graph reads/writes — particles' GPU state is encapsulated.
      b.setExecute((pctx) => {
        const enc = pctx.computePassEncoder!;
        if (this._spawnCount > 0) {
          enc.setPipeline(this._spawnPipeline);
          enc.setBindGroup(0, this._computeDataBg);
          enc.setBindGroup(1, this._computeUniBg);
          enc.dispatchWorkgroups(Math.ceil(this._spawnCount / 64));
        }
        enc.setPipeline(this._updatePipeline);
        enc.setBindGroup(0, this._computeDataBg);
        enc.setBindGroup(1, this._computeUniBg);
        if (this._heightmapBg) enc.setBindGroup(2, this._heightmapBg);
        enc.dispatchWorkgroups(Math.ceil(this._maxParticles / 64));

        enc.setPipeline(this._compactPipeline);
        enc.setBindGroup(0, this._compactDataBg);
        enc.setBindGroup(1, this._compactUniBg);
        enc.dispatchWorkgroups(Math.ceil(this._maxParticles / 64));

        enc.setPipeline(this._indirectPipeline);
        enc.dispatchWorkgroups(1);
      });
    });

    // 2. Render pass.
    let outHdr: ResourceHandle | undefined;
    let outAlbedo: ResourceHandle | undefined;
    let outNormal: ResourceHandle | undefined;
    let outDepth: ResourceHandle | undefined;

    if (this._isForward) {
      if (!deps.hdr) throw new Error('[ParticlePass] forward mode requires deps.hdr');
      const hdrIn = deps.hdr;
      const depthIn = deps.gbuffer.depth;
      graph.addPass(this.name + '.render', 'render', (b: PassBuilder) => {
        outHdr = b.write(hdrIn, 'attachment', { loadOp: 'load', storeOp: 'store' });
        b.read(depthIn, 'depth-read');
        b.setExecute((pctx) => {
          const enc = pctx.renderPassEncoder!;
          enc.setPipeline(this._renderPipeline);
          enc.setBindGroup(0, this._renderDataBg);
          enc.setBindGroup(1, this._cameraRenderBg);
          enc.drawIndirect(this._indirectBuffer, 0);
        });
      });
    } else {
      if (!deps.gbuffer.albedo || !deps.gbuffer.normal) {
        throw new Error('[ParticlePass] deferred mode requires deps.gbuffer.{albedo,normal}');
      }
      const albedoIn = deps.gbuffer.albedo;
      const normalIn = deps.gbuffer.normal;
      const depthIn = deps.gbuffer.depth;
      graph.addPass(this.name + '.render', 'render', (b: PassBuilder) => {
        outAlbedo = b.write(albedoIn, 'attachment', { loadOp: 'load', storeOp: 'store' });
        outNormal = b.write(normalIn, 'attachment', { loadOp: 'load', storeOp: 'store' });
        outDepth = b.write(depthIn, 'depth-attachment', { depthLoadOp: 'load', depthStoreOp: 'store' });
        b.setExecute((pctx) => {
          const enc = pctx.renderPassEncoder!;
          enc.setPipeline(this._renderPipeline);
          enc.setBindGroup(0, this._renderDataBg);
          enc.setBindGroup(1, this._cameraRenderBg);
          enc.setBindGroup(2, this._renderParamsBg!);
          enc.drawIndirect(this._indirectBuffer, 0);
        });
      });
    }

    return { hdr: outHdr, albedo: outAlbedo, normal: outNormal, depth: outDepth };
  }

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
