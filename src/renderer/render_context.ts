export interface RenderContextOptions {
  enableErrorHandling?: boolean;
}

export class RenderContext {
  readonly device: GPUDevice;
  readonly queue: GPUQueue;
  readonly context: GPUCanvasContext;
  readonly format: GPUTextureFormat;
  readonly canvas: HTMLCanvasElement;
  readonly hdr: boolean;
  readonly enableErrorHandling: boolean;

  private constructor(
    device: GPUDevice,
    context: GPUCanvasContext,
    format: GPUTextureFormat,
    canvas: HTMLCanvasElement,
    hdr: boolean,
    enableErrorHandling: boolean,
  ) {
    this.device = device;
    this.queue = device.queue;
    this.context = context;
    this.format = format;
    this.canvas = canvas;
    this.hdr = hdr;
    this.enableErrorHandling = enableErrorHandling;
  }

  get width(): number { return this.canvas.width; }
  get height(): number { return this.canvas.height; }

  static async create(canvas: HTMLCanvasElement, options: RenderContextOptions = {}): Promise<RenderContext> {
    if (!navigator.gpu) {
      throw new Error('WebGPU not supported');
    }

    const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) {
      throw new Error('No WebGPU adapter found');
    }

    const device = await adapter.requestDevice({
      requiredFeatures: [],
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
      format = 'rgba16float';
      hdr = true;
    } catch {
      format = navigator.gpu.getPreferredCanvasFormat();
      context.configure({ device, format, alphaMode: 'opaque' });
    }

    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;

    return new RenderContext(device, context, format, canvas, hdr, options.enableErrorHandling ?? false);
  }

  getCurrentTexture(): GPUTexture {
    return this.context.getCurrentTexture();
  }

  createBuffer(size: number, usage: GPUBufferUsageFlags, label?: string): GPUBuffer {
    return this.device.createBuffer({ size, usage, label });
  }

  writeBuffer(buffer: GPUBuffer, data: ArrayBuffer | ArrayBufferView, offset = 0): void {
    if (data instanceof ArrayBuffer) {
      this.queue.writeBuffer(buffer, offset, data);
    } else {
      this.queue.writeBuffer(buffer, offset, data.buffer as ArrayBuffer, data.byteOffset, data.byteLength);
    }
  }

  pushInitErrorScope(): void {
    if (this.enableErrorHandling) {
      this.device.pushErrorScope('validation');
    }
  }

  async popInitErrorScope(label: string): Promise<void> {
    if (this.enableErrorHandling) {
      const validationError = await this.device.popErrorScope();
      if (validationError) {
        console.error(`[Init:${label}] Validation Error:`, validationError.message);
        console.trace();
      }
    }
  }

  pushFrameErrorScope(): void {
    if (this.enableErrorHandling) {
      this.device.pushErrorScope('validation');
    }
  }

  async popFrameErrorScope(): Promise<void> {
    if (this.enableErrorHandling) {
      const validationError = await this.device.popErrorScope();
      if (validationError) {
        console.error('[Frame] Validation Error:', validationError.message);
        console.trace();
      }
    }
  }

  pushPassErrorScope(_passName: string): void {
    if (this.enableErrorHandling) {
      this.device.pushErrorScope('validation');
      this.device.pushErrorScope('out-of-memory');
      this.device.pushErrorScope('internal');
    }
  }

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
}
