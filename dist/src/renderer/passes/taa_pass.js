import { RenderPass } from '../render_pass.js';
import { HDR_FORMAT } from './lighting_pass.js';
import taaWgsl from '../../shaders/taa.wgsl?raw';
// invViewProj (mat4) + prevViewProj (mat4) = 128 bytes
const TAA_UNIFORM_SIZE = 128;
/**
 * Temporal anti-aliasing pass. Reprojects the previous-frame history into the
 * current frame using depth + camera matrices, then blends it with the jittered
 * lit color to converge sub-pixel detail across frames.
 *
 * Inputs sampled: lit HDR color, TAA history, G-buffer depth.
 * Output: resolved HDR color exposed as `resolvedView`; the result is also
 * copied back into the history texture for the next frame.
 */
export class TAAPass extends RenderPass {
    name = 'TAAPass';
    _resolved;
    /** Final anti-aliased HDR view consumed by downstream post-processing. */
    resolvedView;
    _history;
    _historyView;
    _pipeline;
    _uniformBuffer;
    _uniformBG;
    _textureBG;
    _width;
    _height;
    _scratch = new Float32Array(TAA_UNIFORM_SIZE / 4);
    /** View of the history texture, useful for debugging or external consumers. */
    get historyView() { return this._historyView; }
    constructor(resolved, resolvedView, history, historyView, pipeline, uniformBuffer, uniformBG, textureBG, width, height) {
        super();
        this._resolved = resolved;
        this.resolvedView = resolvedView;
        this._history = history;
        this._historyView = historyView;
        this._pipeline = pipeline;
        this._uniformBuffer = uniformBuffer;
        this._uniformBG = uniformBG;
        this._textureBG = textureBG;
        this._width = width;
        this._height = height;
    }
    /**
     * Constructs the pass and allocates the resolved + history textures, the
     * uniform buffer, the pipeline, and bind groups.
     *
     * @param ctx Render context providing device and screen size.
     * @param lightingPass Lighting pass providing the HDR color view to anti-alias.
     * @param gbuffer G-buffer providing the depth view for reprojection.
     * @returns Configured TAAPass instance.
     */
    static create(ctx, lightingPass, gbuffer) {
        const { device, width, height } = ctx;
        const resolved = device.createTexture({
            label: 'TAA Resolved',
            size: { width, height },
            format: HDR_FORMAT,
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
        });
        const history = device.createTexture({
            label: 'TAA History',
            size: { width, height },
            format: HDR_FORMAT,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
        });
        const resolvedView = resolved.createView();
        const historyView = history.createView();
        const uniformBuffer = device.createBuffer({
            label: 'TAAUniformBuffer',
            size: TAA_UNIFORM_SIZE,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        const uniformBGL = device.createBindGroupLayout({
            label: 'TAAUniformBGL',
            entries: [
                { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
            ],
        });
        const textureBGL = device.createBindGroupLayout({
            label: 'TAATextureBGL',
            entries: [
                { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
                { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
                { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
                { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
            ],
        });
        const linearSampler = device.createSampler({
            label: 'TAALinearSampler',
            magFilter: 'linear', minFilter: 'linear',
            addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge',
        });
        const uniformBG = device.createBindGroup({
            layout: uniformBGL,
            entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
        });
        const textureBG = device.createBindGroup({
            layout: textureBGL,
            entries: [
                { binding: 0, resource: lightingPass.hdrView },
                { binding: 1, resource: historyView },
                { binding: 2, resource: gbuffer.depthView },
                { binding: 3, resource: linearSampler },
            ],
        });
        const shader = device.createShaderModule({ label: 'TAAShader', code: taaWgsl });
        const pipeline = device.createRenderPipeline({
            label: 'TAAPipeline',
            layout: device.createPipelineLayout({ bindGroupLayouts: [uniformBGL, textureBGL] }),
            vertex: { module: shader, entryPoint: 'vs_main' },
            fragment: { module: shader, entryPoint: 'fs_main', targets: [{ format: HDR_FORMAT }] },
            primitive: { topology: 'triangle-list' },
        });
        return new TAAPass(resolved, resolvedView, history, historyView, pipeline, uniformBuffer, uniformBG, textureBG, width, height);
    }
    /**
     * Uploads the matrices needed to reproject the previous frame's history into
     * the current frame. Call once per frame before {@link execute}.
     *
     * @param ctx Render context whose queue receives the buffer write.
     * @param invViewProj Inverse view*proj for the current (jittered) frame.
     * @param prevViewProj Previous frame's view*proj used for reprojection.
     */
    updateCamera(ctx, invViewProj, prevViewProj) {
        const data = this._scratch;
        data.set(invViewProj.data, 0);
        data.set(prevViewProj.data, 16);
        ctx.queue.writeBuffer(this._uniformBuffer, 0, data.buffer);
    }
    /**
     * Records the resolve render and the resolved-to-history copy used by the
     * next frame's reprojection.
     *
     * @param encoder Command encoder to record into.
     * @param _ctx Render context (unused).
     */
    execute(encoder, _ctx) {
        const pass = encoder.beginRenderPass({
            label: 'TAAPass',
            colorAttachments: [{
                    view: this.resolvedView,
                    clearValue: [0, 0, 0, 1],
                    loadOp: 'clear',
                    storeOp: 'store',
                }],
        });
        pass.setPipeline(this._pipeline);
        pass.setBindGroup(0, this._uniformBG);
        pass.setBindGroup(1, this._textureBG);
        pass.draw(3);
        pass.end();
        // Copy resolved → history so next frame can reproject into it
        encoder.copyTextureToTexture({ texture: this._resolved }, { texture: this._history }, { width: this._width, height: this._height });
    }
    /** Releases the resolved + history textures and the uniform buffer. */
    destroy() {
        this._resolved.destroy();
        this._history.destroy();
        this._uniformBuffer.destroy();
    }
}
