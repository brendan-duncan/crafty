import { ShaderBlockManager } from '../assets/shader_block_manager.js';

/**
 * Options accepted by {@link RenderContext.create}.
 */
export interface RenderContextOptions {
  /** Install an `uncapturederror` listener and enable per-pass/frame validation scopes. */
  enableErrorHandling?: boolean;
  depthFormat?: GPUTextureFormat | null;  // defaults to 'depth32float'. Use null to disable depth.
}

/**
 * Owns the WebGPU device, queue and canvas configuration for the renderer.
 *
 * Acts as the single shared handle to GPU resources, and exposes helpers for
 * buffer creation, swap-chain access and scoped validation error capture.
 */
export class RenderContext {
  static readonly DEFAULT_DEPTH_FORMAT: GPUTextureFormat = 'depth32float';

  readonly device: GPUDevice;
  readonly queue: GPUQueue;
  readonly context: GPUCanvasContext;
  readonly format: GPUTextureFormat;
  readonly depthFormat: GPUTextureFormat | null;
  readonly canvas: HTMLCanvasElement;
  readonly hdr: boolean;
  readonly enableErrorHandling: boolean;
  readonly shaderBlockManager: ShaderBlockManager;

  /** Seconds since the first call to {@link update}. Updated every frame. */
  elapsedTime = 0;
  /** Seconds since the last call to {@link update}. Updated every frame. */
  deltaTime = 0;
  /** Total frames rendered since creation. Incremented every frame by {@link update}. */
  frameCount = 0;
  /** Smoothed frames-per-second (EMA with alpha 0.1). Updated every frame by {@link update}. */
  framesPerSecond = 0;
  /** Frames-per-second clamped to an integer. Updated every frame by {@link update}. */
  fps = 0;

  readonly #startTime = performance.now();
  #lastTime = performance.now();

  private _backbufferView: GPUTextureView | null = null;
  private _backbufferDepth: GPUTexture | null = null;
  private _backbufferDepthView: GPUTextureView | null = null;

  private constructor(
    device: GPUDevice,
    context: GPUCanvasContext,
    format: GPUTextureFormat,
    depthFormat: GPUTextureFormat | null,
    canvas: HTMLCanvasElement,
    hdr: boolean,
    enableErrorHandling: boolean,
  ) {
    this.device = device;
    this.queue = device.queue;
    this.context = context;
    this.format = format;
    this.depthFormat = depthFormat;
    this.canvas = canvas;
    this.hdr = hdr;
    this.enableErrorHandling = enableErrorHandling;
    this.shaderBlockManager = new ShaderBlockManager();
  }

  /** Backing canvas pixel width. */
  get width(): number { return this.canvas.width; }
  /** Backing canvas pixel height. */
  get height(): number { return this.canvas.height; }

  /**
   * Call each frame to detect canvas resizes and update the backbuffer depth texture accordingly.
   *
   * Also updates {@link deltaTime}, {@link elapsedTime}, {@link frameCount}, {@link framesPerSecond} and {@link fps}.
   * 
   * @returns true if a resize was detected and handled, false otherwise.
   */
  update(): boolean {
    // Update frame timing
    const now = performance.now();
    this.deltaTime = Math.max(0, (now - this.#lastTime) / 1000);
    this.#lastTime = now;
    this.elapsedTime = (now - this.#startTime) / 1000;

    // Frame counter & FPS (exponential moving average)
    this.frameCount++;
    const instFps = this.deltaTime > 0 ? 1 / this.deltaTime : 0;
    this.framesPerSecond += (instFps - this.framesPerSecond) * 0.1;
    this.fps = Math.round(this.framesPerSecond);

    // Invalidate backbuffer view to ensure it's recreated for the new texture after a resize.
    this._backbufferView = null;

    const needsResize = this.canvas.width !== this.canvas.clientWidth ||
                        this.canvas.height !== this.canvas.clientHeight;

    if (needsResize) {
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
      this._backbufferDepth?.destroy();
      this._backbufferDepth = null;
      this._backbufferDepthView = null;
    }

    return needsResize;
  }

  /** Returns the swap chain texture for the current frame. */
  get backbufferTexture(): GPUTexture {
    return this.context.getCurrentTexture();
  }

  /** Returns the swap chain texture view for the current frame. */
  get backbufferView(): GPUTextureView {
    if (!this._backbufferView) {
      this._backbufferView = this.backbufferTexture.createView();
    }
    return this._backbufferView;
  }

  /** Returns the depth texture for the current frame, or null if depth is not enabled. */
  get backbufferDepth(): GPUTexture | null {
    if (!this._backbufferDepth) {
      this._createBackbufferDepth();
    }
    return this._backbufferDepth;
  }

  /** Returns the depth texture view for the current frame, or null if depth is not enabled. */
  get backbufferDepthView(): GPUTextureView | null {
    if (!this._backbufferDepth) {
      this._createBackbufferDepth();
    }
    return this._backbufferDepthView;
  }

  private _createBackbufferDepth(): void {
    this._backbufferDepth?.destroy();
    this._backbufferDepth = null;
    this._backbufferDepthView = null;

    if (this.depthFormat) {
      this._backbufferDepth = this.device.createTexture({
        size: { width: this.width, height: this.height },
        format: this.depthFormat,
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
      });
      this._backbufferDepthView = this._backbufferDepth.createView();
    }
  }

  /**
   * Requests a WebGPU adapter and device, configures the canvas swap chain and
   * returns a ready-to-use context.
   *
   * Attempts an HDR (`rgba16float` + display-p3 + extended tonemapping) swap
   * chain and falls back to the preferred SDR format if unsupported.
   *
   * @param canvas - canvas to bind the swap chain to
   * @param options - optional context configuration
   * @returns initialized render context
   * @throws if WebGPU is unavailable or no adapter can be acquired
   */
  static async create(canvas: HTMLCanvasElement, options: RenderContextOptions = {}): Promise<RenderContext> {
    if (!navigator.gpu) {
      throw new Error('WebGPU not supported');
    }

    const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) {
      throw new Error('No WebGPU adapter found');
    }

    // Use all available features and limits. Feature detection should be
    // used to verify a feature or limit is actually supported before using it.
    const requiredFeatures: GPUFeatureName[] = [];
    for (const feature of adapter.features) {
      requiredFeatures.push(feature as GPUFeatureName);
    }
    const requiredLimits: Record<string, number> = {};
    for (const [limit, value] of Object.entries(adapter.limits)) {
      requiredLimits[limit] = value;
    }

    const device = await adapter.requestDevice({
      requiredFeatures,
      requiredLimits,
    });

    if (options.enableErrorHandling) {
      device.addEventListener('uncapturederror', (event) => {
        const err = event.error;
        if (err instanceof GPUValidationError) {
          console.error('[WebGPU Validation Error]', err.message);
        } else if (err instanceof GPUOutOfMemoryError) {
          console.error('[WebGPU Out of Memory]');
        } else {
          console.error('[WebGPU Internal Error]', err);
        }
      });
    }

    const context = canvas.getContext('webgpu') as GPUCanvasContext;

    // Attempt HDR canvas: rgba16float + display-p3 + extended tonemapping.
    // Falls back to the preferred SDR format if unsupported.
    let format: GPUTextureFormat;
    let hdr = false;

    try {
      (context as any).configure({
        device,
        format: 'rgba16float',
        alphaMode: 'opaque',
        colorSpace: 'display-p3',
        toneMapping: { mode: 'extended' },
      });
      const config = context.getConfiguration();
      // Verify that we actually got an HDR display.
      if (config?.toneMapping?.mode === "extended") {
        format = 'rgba16float';
        hdr = true;
      } else {
        // The display doesn't support HDR, get the format used by the canvas.
        format = navigator.gpu.getPreferredCanvasFormat();
      }
    } catch {
      format = navigator.gpu.getPreferredCanvasFormat();
      context.configure({ device, format, alphaMode: 'opaque' });
    }

    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;

    return new RenderContext(device, context, format, options.depthFormat ?? RenderContext.DEFAULT_DEPTH_FORMAT,
        canvas, hdr, options.enableErrorHandling ?? false);
  }

  /**
   * Creates a GPU shader module from the provided WGSL code.
   *
   * @param code - WGSL shader code
   * @param label - optional debug label
   * @param defines - optional preprocessor defines for shader block imports
   * @returns GPUShaderModule instance
   */
  createShaderModule(code: string, label?: string, defines?: Record<string,string>): GPUShaderModule {
    code = this.shaderBlockManager.importShaderBlocks(code, defines);
    return this.device.createShaderModule({ code, label });
  }

  /**
   * Registers a shader block for later use in shader modules.
   *
   * @param name - unique identifier for the shader block
   * @param code - WGSL code of the shader block
   */
  registerShaderBlock(name: string, code: string): void {
    this.shaderBlockManager.registerShaderBlock(name, code);
  }

  /**
   * Removes a previously registered shader block by name.
   * @param name - name of the shader block to remove
   */
  removeShaderBlock(name: string): void {
    this.shaderBlockManager.removeShaderBlock(name);
  }

  /**
    * Retrieves the WGSL code for a registered shader block by name.
    * @param name - name of the shader block
    * @returns WGSL code of the shader block, or a placeholder comment if not found
    */
  getShaderBlock(name: string, defines?: Record<string, string>): string {
    return this.shaderBlockManager.getShaderBlock(name, defines);
  }

  /**
   * Convenience wrapper around `device.createBuffer`.
   *
   * @param size - buffer size in bytes
   * @param usage - usage flags
   * @param label - optional debug label
   */
  createBuffer(size: number, usage: GPUBufferUsageFlags, label?: string): GPUBuffer {
    return this.device.createBuffer({ size, usage, label });
  }

  /**
   * Uploads CPU data into a GPU buffer, handling both ArrayBuffer and typed-array sources.
   *
   * @param buffer - destination GPU buffer
   * @param data - source bytes to copy
   * @param offset - destination byte offset
   */
  writeBuffer(buffer: GPUBuffer, data: ArrayBuffer | ArrayBufferView, offset = 0): void {
    if (data instanceof ArrayBuffer) {
      this.queue.writeBuffer(buffer, offset, data);
    } else {
      this.queue.writeBuffer(buffer, offset, data.buffer as ArrayBuffer, data.byteOffset, data.byteLength);
    }
  }

  /**
   * Pushes a validation error scope used during one-time resource initialization.
   * No-op when error handling is disabled.
   */
  pushInitErrorScope(): void {
    if (this.enableErrorHandling) {
      this.device.pushErrorScope('validation');
    }
  }

  /**
   * Pops the matching init error scope and logs any validation failure.
   *
   * @param label - identifier included in the log message
   */
  async popInitErrorScope(label: string): Promise<void> {
    if (this.enableErrorHandling) {
      const validationError = await this.device.popErrorScope();
      if (validationError) {
        console.error(`[Init:${label}] Validation Error:`, validationError.message);
        console.trace();
      }
    }
  }

  /**
   * Pushes a per-frame validation error scope. No-op when error handling is disabled.
   */
  pushFrameErrorScope(): void {
    if (this.enableErrorHandling) {
      this.device.pushErrorScope('validation');
    }
  }

  /**
   * Pops the matching per-frame error scope and logs any validation failure.
   */
  async popFrameErrorScope(): Promise<void> {
    if (this.enableErrorHandling) {
      const validationError = await this.device.popErrorScope();
      if (validationError) {
        console.error('[Frame] Validation Error:', validationError.message);
        console.trace();
      }
    }
  }

  /**
   * Pushes nested validation, out-of-memory and internal error scopes around a
   * single render pass. No-op when error handling is disabled.
   *
   * @param _passName - pass identifier (currently unused; reserved for diagnostics)
   */
  pushPassErrorScope(_passName: string): void {
    if (this.enableErrorHandling) {
      this.device.pushErrorScope('validation');
      this.device.pushErrorScope('out-of-memory');
      this.device.pushErrorScope('internal');
    }
  }

  /**
   * Pops the three pass-level error scopes pushed by {@link pushPassErrorScope}
   * and logs any captured errors.
   *
   * @param passName - pass identifier included in log messages
   */
  async popPassErrorScope(passName: string): Promise<void> {
    if (this.enableErrorHandling) {
      const internalError = await this.device.popErrorScope();
      if (internalError) {
        console.error(`[${passName}] Internal Error:`, internalError);
      }
      const oomError = await this.device.popErrorScope();
      if (oomError) {
        console.error(`[${passName}] Out of Memory`);
      }
      const validationError = await this.device.popErrorScope();
      if (validationError) {
        console.error(`[${passName}] Validation Error:`, validationError.message);
      }
    }
  }

  /**
   * Convenience method to create a 1x1 cubemap texture with a neutral gray color, used as a fallback when IBL textures fail to load.
   */
  createDefaultCubemap(): GPUTexture {
    const tex = this.device.createTexture({
      size: { width: 1, height: 1, depthOrArrayLayers: 6 },
      format: 'rgba16float',
      dimension: '2d',
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
      mipLevelCount: 1,
    });
    const data = new Uint16Array([0, 0, 0, 0]);
    for (let i = 0; i < 6; i++) {
      this.queue.writeTexture(
        { texture: tex, origin: { x: 0, y: 0, z: i } },
        data,
        { bytesPerRow: 8 },
        { width: 1, height: 1 },
      );
    }
    return tex;
  }

  /**
   * Convenience method to create a 1x1 BRDF LUT texture with a neutral value, used as a fallback when IBL textures fail to load.
   */
  createDefaultBrdfLUT(): GPUTexture {
    const tex = this.device.createTexture({
      size: { width: 1, height: 1 },
      format: 'rgba16float',
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });
    const data = new Uint16Array([0x3800, 0x3800, 0x3800, 0x3C00]);
    this.queue.writeTexture(
      { texture: tex },
      data,
      { bytesPerRow: 8 },
      { width: 1, height: 1 },
    );
    return tex;
  }
}
