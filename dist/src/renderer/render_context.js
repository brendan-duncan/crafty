/**
 * Owns the WebGPU device, queue and canvas configuration for the renderer.
 *
 * Acts as the single shared handle to GPU resources, and exposes helpers for
 * buffer creation, swap-chain access and scoped validation error capture.
 */
export class RenderContext {
    device;
    queue;
    context;
    format;
    canvas;
    hdr;
    enableErrorHandling;
    constructor(device, context, format, canvas, hdr, enableErrorHandling) {
        this.device = device;
        this.queue = device.queue;
        this.context = context;
        this.format = format;
        this.canvas = canvas;
        this.hdr = hdr;
        this.enableErrorHandling = enableErrorHandling;
    }
    /** Backing canvas pixel width. */
    get width() { return this.canvas.width; }
    /** Backing canvas pixel height. */
    get height() { return this.canvas.height; }
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
    static async create(canvas, options = {}) {
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
                }
                else if (err instanceof GPUOutOfMemoryError) {
                    console.error('[WebGPU Out of Memory]');
                }
                else {
                    console.error('[WebGPU Internal Error]', err);
                }
            });
        }
        const context = canvas.getContext('webgpu');
        // Attempt HDR canvas: rgba16float + display-p3 + extended tonemapping.
        // Falls back to the preferred SDR format if unsupported.
        let format;
        let hdr = false;
        try {
            context.configure({
                device,
                format: 'rgba16float',
                alphaMode: 'opaque',
                colorSpace: 'display-p3',
                toneMapping: { mode: 'extended' },
            });
            format = 'rgba16float';
            hdr = true;
        }
        catch {
            format = navigator.gpu.getPreferredCanvasFormat();
            context.configure({ device, format, alphaMode: 'opaque' });
        }
        canvas.width = canvas.clientWidth * devicePixelRatio;
        canvas.height = canvas.clientHeight * devicePixelRatio;
        return new RenderContext(device, context, format, canvas, hdr, options.enableErrorHandling ?? false);
    }
    /**
     * Returns the swap chain texture for the current frame.
     */
    getCurrentTexture() {
        return this.context.getCurrentTexture();
    }
    /**
     * Convenience wrapper around `device.createBuffer`.
     *
     * @param size - buffer size in bytes
     * @param usage - usage flags
     * @param label - optional debug label
     */
    createBuffer(size, usage, label) {
        return this.device.createBuffer({ size, usage, label });
    }
    /**
     * Uploads CPU data into a GPU buffer, handling both ArrayBuffer and typed-array sources.
     *
     * @param buffer - destination GPU buffer
     * @param data - source bytes to copy
     * @param offset - destination byte offset
     */
    writeBuffer(buffer, data, offset = 0) {
        if (data instanceof ArrayBuffer) {
            this.queue.writeBuffer(buffer, offset, data);
        }
        else {
            this.queue.writeBuffer(buffer, offset, data.buffer, data.byteOffset, data.byteLength);
        }
    }
    /**
     * Pushes a validation error scope used during one-time resource initialization.
     * No-op when error handling is disabled.
     */
    pushInitErrorScope() {
        if (this.enableErrorHandling) {
            this.device.pushErrorScope('validation');
        }
    }
    /**
     * Pops the matching init error scope and logs any validation failure.
     *
     * @param label - identifier included in the log message
     */
    async popInitErrorScope(label) {
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
    pushFrameErrorScope() {
        if (this.enableErrorHandling) {
            this.device.pushErrorScope('validation');
        }
    }
    /**
     * Pops the matching per-frame error scope and logs any validation failure.
     */
    async popFrameErrorScope() {
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
    pushPassErrorScope(_passName) {
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
    async popPassErrorScope(passName) {
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
