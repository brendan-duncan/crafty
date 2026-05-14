import { Mat4, Vec3 } from '../src/math/index.js';
import { RenderPass } from '../src/renderer/render_pass.js';
import { RenderContext } from '../src/renderer/render_context.js';
import { CameraController } from '../src/engine/index.js';
import { Mesh } from '../src/assets/mesh.js';

import densityWgsl from './terraforming/mc_density.wgsl?raw';
import marchWgsl from './terraforming/mc_march.wgsl?raw';
import renderWgsl from './terraforming/mc_render.wgsl?raw';
import { EDGE_TABLE, TRIANGLE_TABLE } from './terraforming/mc_tables.js';

const BRUSH_SPHERE_WGSL = `
  struct Uniforms {
    viewProj: mat4x4<f32>,
    brushCenter: vec3<f32>,
    brushRadius: f32,
    brushColor: vec4<f32>,
  };

  @group(0) @binding(0) var<uniform> uni: Uniforms;

  @vertex
  fn vs_main(@location(0) pos: vec3<f32>) -> @builtin(position) vec4<f32> {
    let worldPos = uni.brushCenter + pos * uni.brushRadius;
    return uni.viewProj * vec4<f32>(worldPos, 1.0);
  }

  @fragment
  fn fs_main() -> @location(0) vec4<f32> {
    return uni.brushColor;
  }
`;

interface GridConfig {
  gridSize: [number, number, number];
  gridExtent: [number, number, number];
  gridOffset: [number, number, number];
  isolevel: number;
  noiseScale: number;
  noiseHeight: number;
  detailScale: number;
  detailStrength: number;
  maxVertices: number;
}

interface BrushState {
  enabled: boolean;
  center: Vec3;
  radius: number;
  strength: number;
}

const DEFAULT_CONFIG: GridConfig = {
  gridSize: [32, 24, 32],
  gridExtent: [32, 24, 32],
  gridOffset: [-16, -8, -16],
  isolevel: 0.0,
  noiseScale: 0.08,
  noiseHeight: 10.0,
  detailScale: 0.3,
  detailStrength: 1.0,
  maxVertices: 128 * 1024,
};

class MarchingCubesPass extends RenderPass {
  readonly name = 'MarchingCubesPass';

  private readonly _config: GridConfig;

  private _colorView: GPUTextureView;
  private _depthView: GPUTextureView;

  private readonly _densityBuffer: GPUBuffer;
  private readonly _vertexBuffer: GPUBuffer;
  private readonly _vertexCounter: GPUBuffer;
  private readonly _indirectBuffer: GPUBuffer;
  private readonly _edgeTableBuffer: GPUBuffer;
  private readonly _triTableBuffer: GPUBuffer;

  private readonly _densityUniforms: GPUBuffer;
  private readonly _mcUniforms: GPUBuffer;
  private readonly _renderUniforms: GPUBuffer;

  private readonly _densityPipeline: GPUComputePipeline;
  private readonly _brushPipeline: GPUComputePipeline;
  private readonly _marchPipeline: GPUComputePipeline;
  private readonly _indirectPipeline: GPUComputePipeline;
  private readonly _renderPipeline: GPURenderPipeline;

  private readonly _densityBG: GPUBindGroup;
  private readonly _marchBG: GPUBindGroup;
  private readonly _renderBG: GPUBindGroup;

  private _generated = false;
  private _viewProj = new Mat4();

  private readonly _sphereMesh: Mesh;
  private readonly _brushSphereUniforms: GPUBuffer;
  private readonly _brushSpherePipeline: GPURenderPipeline;
  private readonly _brushSphereBG: GPUBindGroup;
  private readonly _brushSphereUniBuf: Float32Array;

  private _brush: BrushState = {
    enabled: false,
    center: new Vec3(),
    radius: 2.0,
    strength: 0.2,
  };

  private readonly _zeroU32 = new Uint32Array([0]);
  private readonly _densityUniBuf = new Float32Array(64);

  static create(
    ctx: RenderContext,
    colorView: GPUTextureView,
    depthView: GPUTextureView,
    config: Partial<GridConfig> = {},
  ): MarchingCubesPass {
    const cfg: GridConfig = { ...DEFAULT_CONFIG, ...config };
    const { device } = ctx;

    const gridCells = cfg.gridSize[0] * cfg.gridSize[1] * cfg.gridSize[2];

    const densityBuffer = device.createBuffer({
      label: 'McDensityBuffer',
      size: gridCells * 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    const vertexBuffer = device.createBuffer({
      label: 'McVertexBuffer',
      size: cfg.maxVertices * 32,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.VERTEX,
    });

    const vertexCounter = device.createBuffer({
      label: 'McVertexCounter',
      size: 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(vertexCounter, 0, new Uint32Array([0]));

    const indirectBuffer = device.createBuffer({
      label: 'McIndirectBuffer',
      size: 16,
      usage: GPUBufferUsage.INDIRECT | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(indirectBuffer, 0, new Uint32Array([0, 1, 0, 0]));

    const edgeTableData = new Uint32Array(EDGE_TABLE);
    const edgeTableBuffer = device.createBuffer({
      label: 'McEdgeTable',
      size: edgeTableData.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    ctx.queue.writeBuffer(edgeTableBuffer, 0, edgeTableData);

    const triTableData = new Int32Array(256 * 16);
    for (let i = 0; i < 256; i++) {
      for (let j = 0; j < 16; j++) {
        triTableData[i * 16 + j] = TRIANGLE_TABLE[i][j];
      }
    }
    const triTableBuffer = device.createBuffer({
      label: 'McTriTable',
      size: triTableData.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    ctx.queue.writeBuffer(triTableBuffer, 0, triTableData);

    const densityUniforms = device.createBuffer({
      label: 'McDensityUniforms',
      size: 256,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const mcUniforms = device.createBuffer({
      label: 'McMarchUniforms',
      size: 256,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const renderUniforms = device.createBuffer({
      label: 'McRenderUniforms',
      size: 512,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const densityBGL = device.createBindGroupLayout({
      label: 'McDensityBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
        { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
      ],
    });

    const marchBGL = device.createBindGroupLayout({
      label: 'McMarchBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
        { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
        { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
        { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
        { binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
        { binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
        { binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
      ],
    });

    const renderBGL = device.createBindGroupLayout({
      label: 'McRenderBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
        { binding: 1, visibility: GPUShaderStage.VERTEX, buffer: { type: 'read-only-storage' } },
      ],
    });

    const densityModule = ctx.createShaderModule(densityWgsl, 'McDensityShader');
    const marchModule = ctx.createShaderModule(marchWgsl, 'McMarchShader');
    const renderModule = ctx.createShaderModule(renderWgsl, 'McRenderShader');

    const densityLayout = device.createPipelineLayout({
      bindGroupLayouts: [densityBGL],
    });

    const marchLayout = device.createPipelineLayout({
      bindGroupLayouts: [marchBGL],
    });

    const renderLayout = device.createPipelineLayout({
      bindGroupLayouts: [renderBGL],
    });

    const densityPipeline = device.createComputePipeline({
      label: 'McDensityPipeline',
      layout: densityLayout,
      compute: { module: densityModule, entryPoint: 'cs_generate' },
    });

    const brushPipeline = device.createComputePipeline({
      label: 'McBrushPipeline',
      layout: densityLayout,
      compute: { module: densityModule, entryPoint: 'cs_brush' },
    });

    const marchPipeline = device.createComputePipeline({
      label: 'McMarchPipeline',
      layout: marchLayout,
      compute: { module: marchModule, entryPoint: 'cs_march' },
    });

    const indirectPipeline = device.createComputePipeline({
      label: 'McIndirectPipeline',
      layout: marchLayout,
      compute: { module: marchModule, entryPoint: 'cs_write_indirect' },
    });

    const renderPipeline = device.createRenderPipeline({
      label: 'McRenderPipeline',
      layout: renderLayout,
      vertex: {
        module: renderModule,
        entryPoint: 'vs_main',
        buffers: [],
      },
      fragment: {
        module: renderModule,
        entryPoint: 'fs_main',
        targets: [{
          format: ctx.format,
        }],
      },
      depthStencil: {
        format: 'depth32float',
        depthWriteEnabled: true,
        depthCompare: 'less',
      },
      primitive: {
        topology: 'triangle-list',
        cullMode: 'none',
      },
    });

    const densityBG = device.createBindGroup({
      label: 'McDensityBG',
      layout: densityBGL,
      entries: [
        { binding: 0, resource: { buffer: densityBuffer } },
        { binding: 1, resource: { buffer: densityUniforms } },
      ],
    });

    const marchBG = device.createBindGroup({
      label: 'McMarchBG',
      layout: marchBGL,
      entries: [
        { binding: 0, resource: { buffer: densityBuffer } },
        { binding: 1, resource: { buffer: vertexBuffer } },
        { binding: 2, resource: { buffer: vertexCounter } },
        { binding: 3, resource: { buffer: indirectBuffer } },
        { binding: 4, resource: { buffer: mcUniforms } },
        { binding: 5, resource: { buffer: edgeTableBuffer } },
        { binding: 6, resource: { buffer: triTableBuffer } },
      ],
    });

    const renderBG = device.createBindGroup({
      label: 'McRenderBG',
      layout: renderBGL,
      entries: [
        { binding: 0, resource: { buffer: renderUniforms } },
        { binding: 1, resource: { buffer: vertexBuffer } },
      ],
    });

    const mcUniBuf = new Float32Array(64);
    mcUniBuf[0] = cfg.gridSize[0];
    mcUniBuf[1] = cfg.gridSize[1];
    mcUniBuf[2] = cfg.gridSize[2];
    mcUniBuf[4] = cfg.isolevel;
    mcUniBuf[8] = cfg.gridExtent[0];
    mcUniBuf[9] = cfg.gridExtent[1];
    mcUniBuf[10] = cfg.gridExtent[2];
    mcUniBuf[12] = cfg.gridOffset[0];
    mcUniBuf[13] = cfg.gridOffset[1];
    mcUniBuf[14] = cfg.gridOffset[2];
    device.queue.writeBuffer(mcUniforms, 0, mcUniBuf);

    const sphereMesh = Mesh.createSphere(device, 1, 16, 16);

    const brushSphereModule = ctx.createShaderModule(BRUSH_SPHERE_WGSL, 'McBrushSphereShader');

    const brushSphereBGL = device.createBindGroupLayout({
      label: 'McBrushSphereBGL',
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
      ],
    });

    const brushSpherePL = device.createPipelineLayout({
      bindGroupLayouts: [brushSphereBGL],
    });

    const brushSpherePipeline = device.createRenderPipeline({
      label: 'McBrushSpherePipeline',
      layout: brushSpherePL,
      vertex: {
        module: brushSphereModule,
        entryPoint: 'vs_main',
        buffers: [{
          arrayStride: 48,
          attributes: [
            { shaderLocation: 0, offset: 0, format: 'float32x3' },
          ],
        }],
      },
      fragment: {
        module: brushSphereModule,
        entryPoint: 'fs_main',
        targets: [{
          format: ctx.format,
          blend: {
            color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' },
            alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
          },
        }],
      },
      depthStencil: {
        format: 'depth32float',
        depthWriteEnabled: false,
        depthCompare: 'less',
      },
      primitive: {
        topology: 'triangle-list',
        cullMode: 'none',
      },
    });

    const brushSphereUniforms = device.createBuffer({
      label: 'McBrushSphereUniforms',
      size: 96,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const brushSphereUniBuf = new Float32Array(24);

    const brushSphereBG = device.createBindGroup({
      label: 'McBrushSphereBG',
      layout: brushSphereBGL,
      entries: [
        { binding: 0, resource: { buffer: brushSphereUniforms } },
      ],
    });

    return new MarchingCubesPass(
      cfg,
      colorView, depthView,
      densityBuffer, vertexBuffer, vertexCounter, indirectBuffer,
      edgeTableBuffer, triTableBuffer,
      densityUniforms, mcUniforms, renderUniforms,
      densityPipeline, brushPipeline, marchPipeline, indirectPipeline, renderPipeline,
      densityBG, marchBG, renderBG,
      sphereMesh, brushSphereUniforms, brushSpherePipeline, brushSphereBG, brushSphereUniBuf,
    );
  }

  private constructor(
    config: GridConfig,
    colorView: GPUTextureView,
    depthView: GPUTextureView,
    densityBuffer: GPUBuffer,
    vertexBuffer: GPUBuffer,
    vertexCounter: GPUBuffer,
    indirectBuffer: GPUBuffer,
    edgeTableBuffer: GPUBuffer,
    triTableBuffer: GPUBuffer,
    densityUniforms: GPUBuffer,
    mcUniforms: GPUBuffer,
    renderUniforms: GPUBuffer,
    densityPipeline: GPUComputePipeline,
    brushPipeline: GPUComputePipeline,
    marchPipeline: GPUComputePipeline,
    indirectPipeline: GPUComputePipeline,
    renderPipeline: GPURenderPipeline,
    densityBG: GPUBindGroup,
    marchBG: GPUBindGroup,
    renderBG: GPUBindGroup,
    sphereMesh: Mesh,
    brushSphereUniforms: GPUBuffer,
    brushSpherePipeline: GPURenderPipeline,
    brushSphereBG: GPUBindGroup,
    brushSphereUniBuf: Float32Array,
  ) {
    super();
    this._config = config;
    this._colorView = colorView;
    this._depthView = depthView;
    this._densityBuffer = densityBuffer;
    this._vertexBuffer = vertexBuffer;
    this._vertexCounter = vertexCounter;
    this._indirectBuffer = indirectBuffer;
    this._edgeTableBuffer = edgeTableBuffer;
    this._triTableBuffer = triTableBuffer;
    this._densityUniforms = densityUniforms;
    this._mcUniforms = mcUniforms;
    this._renderUniforms = renderUniforms;
    this._densityPipeline = densityPipeline;
    this._brushPipeline = brushPipeline;
    this._marchPipeline = marchPipeline;
    this._indirectPipeline = indirectPipeline;
    this._renderPipeline = renderPipeline;
    this._densityBG = densityBG;
    this._marchBG = marchBG;
    this._renderBG = renderBG;
    this._sphereMesh = sphereMesh;
    this._brushSphereUniforms = brushSphereUniforms;
    this._brushSpherePipeline = brushSpherePipeline;
    this._brushSphereBG = brushSphereBG;
    this._brushSphereUniBuf = brushSphereUniBuf;
  }

  updateAttachments(colorView: GPUTextureView, depthView: GPUTextureView): void {
    this._colorView = colorView;
    this._depthView = depthView;
  }

  setBrush(center: Vec3, radius: number, strength: number, active = true): void {
    this._brush.enabled = active;
    this._brush.center = center.clone();
    this._brush.radius = radius;
    this._brush.strength = strength;
  }

  updateCamera(
    ctx: RenderContext,
    view: Mat4, proj: Mat4, viewProj: Mat4, invViewProj: Mat4,
    camPos: Vec3, near: number, far: number,
  ): void {
    const buf = new Float32Array(16 + 16 + 16 + 16 + 4 + 1 + 1);
    let off = 0;
    buf.set(view.data, off); off += 16;
    buf.set(proj.data, off); off += 16;
    buf.set(viewProj.data, off); off += 16;
    buf.set(invViewProj.data, off); off += 16;
    buf[off++] = camPos.x;
    buf[off++] = camPos.y;
    buf[off++] = camPos.z;
    buf[off++] = near;
    buf[off] = far;

    this._viewProj = viewProj;
    ctx.queue.writeBuffer(this._renderUniforms, 0, buf);
  }

  execute(encoder: GPUCommandEncoder, ctx: RenderContext): void {
    const d = this._densityUniBuf;
    d[0] = this._config.gridSize[0];
    d[1] = this._config.gridSize[1];
    d[2] = this._config.gridSize[2];
    d[4] = this._config.isolevel;
    d[8] = this._config.gridExtent[0];
    d[9] = this._config.gridExtent[1];
    d[10] = this._config.gridExtent[2];
    d[12] = this._config.gridOffset[0];
    d[13] = this._config.gridOffset[1];
    d[14] = this._config.gridOffset[2];
    d[16] = this._config.noiseScale;
    d[17] = this._config.noiseHeight;
    d[18] = this._config.detailScale;
    d[19] = this._config.detailStrength;

    d[24] = this._brush.center.x;
    d[25] = this._brush.center.y;
    d[26] = this._brush.center.z;
    d[28] = this._brush.radius;
    d[29] = this._brush.strength;
    d[30] = this._brush.enabled ? 1 : 0;

    ctx.queue.writeBuffer(this._densityUniforms, 0, d);
    ctx.queue.writeBuffer(this._vertexCounter, 0, this._zeroU32);

    const compute = encoder.beginComputePass({ label: 'McCompute' });

    if (!this._generated) {
      compute.setPipeline(this._densityPipeline);
      compute.setBindGroup(0, this._densityBG);
      compute.dispatchWorkgroups(
        Math.ceil(this._config.gridSize[0] / 8),
        Math.ceil(this._config.gridSize[1] / 4),
        Math.ceil(this._config.gridSize[2] / 8),
      );
      this._generated = true;
    }

    if (this._brush.enabled) {
      compute.setPipeline(this._brushPipeline);
      compute.setBindGroup(0, this._densityBG);
      compute.dispatchWorkgroups(
        Math.ceil(this._config.gridSize[0] / 8),
        Math.ceil(this._config.gridSize[1] / 4),
        Math.ceil(this._config.gridSize[2] / 8),
      );
    }

    compute.setPipeline(this._marchPipeline);
    compute.setBindGroup(0, this._marchBG);
    compute.dispatchWorkgroups(
      Math.ceil((this._config.gridSize[0] - 1) / 8),
      Math.ceil((this._config.gridSize[1] - 1) / 4),
      Math.ceil((this._config.gridSize[2] - 1) / 8),
    );

    compute.setPipeline(this._indirectPipeline);
    compute.setBindGroup(0, this._marchBG);
    compute.dispatchWorkgroups(1);

    compute.end();

    const pass = encoder.beginRenderPass({
      label: 'McRender',
      colorAttachments: [
        {
          view: this._colorView,
          loadOp: 'clear',
          storeOp: 'store',
          clearValue: { r: 0.45, g: 0.65, b: 0.9, a: 1.0 },
        },
      ],
      depthStencilAttachment: {
        view: this._depthView,
        depthLoadOp: 'clear',
        depthStoreOp: 'store',
        depthClearValue: 1.0,
      },
    });

    pass.setPipeline(this._renderPipeline);
    pass.setBindGroup(0, this._renderBG);
    pass.drawIndirect(this._indirectBuffer, 0);

    {
      const u = this._brushSphereUniBuf;
      u.set(this._viewProj.data, 0);
      u[16] = this._brush.center.x;
      u[17] = this._brush.center.y;
      u[18] = this._brush.center.z;
      u[19] = this._brush.radius;
      if (this._brush.strength >= 0) {
        u[20] = 0; u[21] = 1; u[22] = 0; u[23] = 0.25;
      } else {
        u[20] = 1; u[21] = 0; u[22] = 0; u[23] = 0.25;
      }
      ctx.device.queue.writeBuffer(this._brushSphereUniforms, 0, u.buffer as ArrayBuffer, u.byteOffset, u.byteLength);

      pass.setPipeline(this._brushSpherePipeline);
      pass.setBindGroup(0, this._brushSphereBG);
      pass.setVertexBuffer(0, this._sphereMesh.vertexBuffer);
      pass.setIndexBuffer(this._sphereMesh.indexBuffer, 'uint32');
      pass.drawIndexed(this._sphereMesh.indexCount);
    }

    pass.end();
  }

  destroy(): void {
    this._densityBuffer.destroy();
    this._vertexBuffer.destroy();
    this._vertexCounter.destroy();
    this._indirectBuffer.destroy();
    this._edgeTableBuffer.destroy();
    this._triTableBuffer.destroy();
    this._densityUniforms.destroy();
    this._mcUniforms.destroy();
    this._renderUniforms.destroy();
    this._sphereMesh.destroy();
  }
}

async function main() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const fpsElement = document.getElementById('fps')!;

  canvas.width = canvas.clientWidth * devicePixelRatio;
  canvas.height = canvas.clientHeight * devicePixelRatio;

  const ctx = await RenderContext.create(canvas, { enableErrorHandling: false });
  const device = ctx.device;

  const camPos = new Vec3(0, 10, 25);
  const cameraController = CameraController.create({ yaw: 0, pitch: -15 * Math.PI / 180, speed: 15, sensitivity: 0.002, pointerLock: false });
  cameraController.attach(canvas);
  const fakeGO = { position: camPos, rotation: { x: 0, y: 0, z: 0, w: 1 } };

  let brushRadius = 2.0;
  let brushStrength = 0.2;
  let brushActive = false;
  let brushPosition = new Vec3();

  window.addEventListener('keydown', (e) => {
    if (e.key === '1') {
      brushStrength = Math.abs(brushStrength);
      console.log('Add mode');
    } else if (e.key === '2') {
      brushStrength = -Math.abs(brushStrength);
      console.log('Remove mode');
    } else if (e.key === 'ArrowUp') {
      brushRadius = Math.min(8.0, brushRadius + 0.5);
      console.log('Brush radius:', brushRadius);
    } else if (e.key === 'ArrowDown') {
      brushRadius = Math.max(0.5, brushRadius - 0.5);
      console.log('Brush radius:', brushRadius);
    }
  });

  canvas.addEventListener('pointerdown', (e) => {
    if (e.button === 2) {
      e.preventDefault();
      brushActive = true;
    }
  });

  canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  window.addEventListener('pointerup', (e) => {
    if (e.button === 2) {
      brushActive = false;
    }
  });

  const mcPass = MarchingCubesPass.create(
    ctx,
    ctx.backbufferView,
    ctx.backbufferDepthView!
  );

  let time = 0;
  let lastTime = performance.now();
  let frameCount = 0;
  let fpsTime = 0;

  async function render() {
    const now = performance.now();
    const dt = (now - lastTime) * 0.001;
    lastTime = now;
    time += dt;

    frameCount++;
    fpsTime += dt;
    if (fpsTime >= 0.5) {
      const fps = Math.round(frameCount / fpsTime);
      fpsElement.textContent = `FPS: ${fps}`;
      frameCount = 0;
      fpsTime = 0;
      const brushInfo = document.getElementById('brush-info')!;
      const mode = brushStrength > 0 ? 'Add' : 'Remove';
      brushInfo.textContent = `Brush: ${mode} | Radius: ${brushRadius.toFixed(1)}`;
    }

    ctx.update();

    cameraController.update(fakeGO as any, dt);

    const sinY = Math.sin(cameraController.yaw);
    const cosY = Math.cos(cameraController.yaw);
    const sinP = Math.sin(cameraController.pitch);
    const cosP = Math.cos(cameraController.pitch);
    const forward = new Vec3(-sinY * cosP, -sinP, -cosY * cosP).normalize();
    brushPosition = camPos.add(forward.scale(15.0));
    const target = camPos.add(forward);
    const view = Mat4.lookAt(camPos, target, new Vec3(0, 1, 0));
    const aspect = ctx.width / ctx.height;
    const proj = Mat4.perspective(60 * Math.PI / 180, aspect, 0.1, 200);
    const viewProj = proj.multiply(view);
    const invViewProj = viewProj.invert();

    mcPass.updateCamera(
      ctx,
      view, proj, viewProj, invViewProj,
      camPos, 0.1, 200,
    );

    mcPass.setBrush(brushPosition, brushRadius, brushStrength, brushActive);

    mcPass.updateAttachments(ctx.backbufferView, ctx.backbufferDepthView!);

    const encoder = device.createCommandEncoder({ label: 'McMainEncoder' });

    if (mcPass.enabled) {
      mcPass.execute(encoder, ctx);
    }

    device.queue.submit([encoder.finish()]);

    requestAnimationFrame(render);
  }

  render();
}

main();
