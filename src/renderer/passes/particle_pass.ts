import { RenderPass } from '../render_pass.js';
import type { RenderContext } from '../render_context.js';
import type { GBuffer } from '../gbuffer.js';
import { buildSpawnShader, buildUpdateShader } from '../../particles/particle_builder.js';
import type { ParticleGraphConfig } from '../../particles/particle_types.js';
import type { Mat4 } from '../../math/mat4.js';
import compactWgsl from '../../shaders/particles/particle_compact.wgsl?raw';
import renderWgsl from '../../shaders/particles/particle_render.wgsl?raw';
import renderForwardWgsl from '../../shaders/particles/particle_render_forward.wgsl?raw';
import { HDR_FORMAT } from './lighting_pass.js';

const PARTICLE_STRIDE  = 64;
const COMPUTE_UNI_SIZE = 80;   // ComputeUniforms: 20 × f32
const COMPACT_UNI_SIZE = 16;
const RENDER_UNI_SIZE  = 16;
const CAMERA_UNI_SIZE  = 288;

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

  private _spawnAccum  = 0;
  private _spawnOffset = 0;
  private _spawnCount  = 0;
  private _time        = 0;
  private _frameSeed   = 0;

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
  ) {
    super();
    this._gbuffer         = gbuffer;
    this._hdrView         = hdrView;
    this._isForward       = isForward;
    this._config          = config;
    this._maxParticles    = maxParticles;
    this._particleBuffer  = particleBuffer;
    this._aliveList       = aliveList;
    this._counterBuffer   = counterBuffer;
    this._indirectBuffer  = indirectBuffer;
    this._computeUniforms = computeUniforms;
    this._renderUniforms  = renderUniforms;
    this._cameraBuffer    = cameraBuffer;
    this._spawnPipeline   = spawnPipeline;
    this._updatePipeline  = updatePipeline;
    this._compactPipeline = compactPipeline;
    this._indirectPipeline = indirectPipeline;
    this._renderPipeline  = renderPipeline;
    this._computeDataBG   = computeDataBG;
    this._computeUniBG    = computeUniBG;
    this._compactDataBG   = compactDataBG;
    this._compactUniBG    = compactUniBG;
    this._renderDataBG    = renderDataBG;
    this._cameraRenderBG  = cameraRenderBG;
    this._renderParamsBG  = renderParamsBG;
  }

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
    for (let i = 0; i < maxParticles; i++) initData[i * 16 + 3] = -1.0;
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

    // ---- Pipelines -------------------------------------------------------------

    const computeLayout = device.createPipelineLayout({
      bindGroupLayouts: [computeDataBGL, computeUniBGL],
    });
    const compactComputeLayout = device.createPipelineLayout({
      bindGroupLayouts: [compactDataBGL, computeUniBGL],
    });

    const spawnModule   = device.createShaderModule({ label: 'ParticleSpawn',   code: buildSpawnShader(config) });
    const updateModule  = device.createShaderModule({ label: 'ParticleUpdate',  code: buildUpdateShader(config) });
    const compactModule = device.createShaderModule({ label: 'ParticleCompact', code: compactWgsl });

    const spawnPipeline = device.createComputePipeline({
      label: 'ParticleSpawnPipeline',
      layout: computeLayout,
      compute: { module: spawnModule, entryPoint: 'cs_main' },
    });
    const updatePipeline = device.createComputePipeline({
      label: 'ParticleUpdatePipeline',
      layout: computeLayout,
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
      const vsEntry = billboard === 'camera' ? 'vs_camera' : 'vs_main';
      const fsEntry = billboard === 'camera' ? 'fs_snow'   : 'fs_main';
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
    );
  }

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

    this._spawnAccum += this._config.emitter.spawnRate * dt;
    this._spawnCount  = Math.min(Math.floor(this._spawnAccum), this._maxParticles);
    this._spawnAccum -= this._spawnCount;

    // Decompose world transform into position + rotation quaternion
    const m = worldTransform.data;
    const px = m[12], py = m[13], pz = m[14];
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

    // ComputeUniforms (20 floats / 80 bytes):
    //   [0..2]  world_pos, [3] spawn_count
    //   [4..7]  world_quat
    //   [8]     spawn_offset, [9] max_particles, [10] frame_seed, [11] _pad
    //   [12]    dt, [13] time, [14..15] _pad
    const cu  = new Float32Array(20);
    const cui = new Uint32Array(cu.buffer);
    cu[0] = px; cu[1] = py; cu[2] = pz;
    cui[3]  = this._spawnCount;
    cu[4]   = qx; cu[5] = qy; cu[6] = qz; cu[7] = qw;
    cui[8]  = this._spawnOffset;
    cui[9]  = this._maxParticles;
    cui[10] = this._frameSeed;
    cui[11] = 0;
    cu[12] = dt;
    cu[13] = this._time;
    ctx.queue.writeBuffer(this._computeUniforms, 0, cu.buffer as ArrayBuffer);

    // Reset atomic counter for this frame's compact pass
    ctx.queue.writeBuffer(this._counterBuffer, 0, new Uint32Array([0]));

    this._spawnOffset = (this._spawnOffset + this._spawnCount) % this._maxParticles;

    // Camera uniforms (72 floats / 288 bytes)
    const camData = new Float32Array(CAMERA_UNI_SIZE / 4);
    camData.set(view.data,         0);
    camData.set(proj.data,        16);
    camData.set(viewProj.data,    32);
    camData.set(invViewProj.data, 48);
    camData[64] = camPos.x; camData[65] = camPos.y; camData[66] = camPos.z;
    camData[67] = near;
    camData[68] = far;
    ctx.queue.writeBuffer(this._cameraBuffer, 0, camData.buffer as ArrayBuffer);
  }

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

  destroy(): void {
    this._particleBuffer.destroy();
    this._aliveList.destroy();
    this._counterBuffer.destroy();
    this._indirectBuffer.destroy();
    this._computeUniforms.destroy();
    this._renderUniforms.destroy();
    this._cameraBuffer.destroy();
  }
}
