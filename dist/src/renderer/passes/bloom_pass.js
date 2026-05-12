import { RenderPass } from '../render_pass.js';
import { HDR_FORMAT } from './deferred_lighting_pass.js';
import bloomWgsl from '../../shaders/bloom.wgsl?raw';
import bloomCompositeWgsl from '../../shaders/bloom_composite.wgsl?raw';
// threshold (f32) + knee (f32) + strength (f32) + pad (f32)
const UNIFORM_SIZE = 16;
/**
 * HDR bloom: prefilters bright pixels of the incoming HDR target into a
 * half-res texture, applies a separable Gaussian blur ping-pong (two H/V
 * iterations), and composites the result back over the original HDR into
 * `resultView`. Downstream passes (e.g. tonemap) sample `resultView`.
 *
 * Pipeline summary:
 *   1. Prefilter (full-res HDR → half-res half1)
 *   2. Two iterations of horizontal+vertical blur (half1 ↔ half2)
 *   3. Composite (HDR + blurred bloom → full-res result)
 */
export class BloomPass extends RenderPass {
    name = 'BloomPass';
    /**
     * Full-resolution HDR output containing the original scene composited with
     * the blurred bloom. Sampled by the tonemap pass instead of the raw HDR.
     */
    resultView;
    _result;
    _half1;
    _half2;
    _half1View;
    _half2View;
    _prefilterPipeline;
    _blurHPipeline;
    _blurVPipeline;
    _compositePipeline;
    _uniformBuffer;
    _scratch = new Float32Array(4);
    _prefilterBG; // reads hdrView
    _blurHBG; // reads half1
    _blurVBG; // reads half2
    _compositeBG; // reads hdrView + half1
    constructor(result, resultView, half1, half1View, half2, half2View, prefilterPipeline, blurHPipeline, blurVPipeline, compositePipeline, uniformBuffer, prefilterBG, blurHBG, blurVBG, compositeBG) {
        super();
        this._result = result;
        this.resultView = resultView;
        this._half1 = half1;
        this._half1View = half1View;
        this._half2 = half2;
        this._half2View = half2View;
        this._prefilterPipeline = prefilterPipeline;
        this._blurHPipeline = blurHPipeline;
        this._blurVPipeline = blurVPipeline;
        this._compositePipeline = compositePipeline;
        this._uniformBuffer = uniformBuffer;
        this._prefilterBG = prefilterBG;
        this._blurHBG = blurHBG;
        this._blurVBG = blurVBG;
        this._compositeBG = compositeBG;
    }
    /**
     * Builds the bloom pass: allocates the half-res ping-pong textures, the
     * full-res result texture, all bind groups, and the prefilter, blur, and
     * composite pipelines.
     *
     * @param ctx     Renderer context (provides device and target dimensions).
     * @param hdrView The full-resolution HDR scene color to bloom.
     * @returns A configured BloomPass with default parameters
     *          (threshold=1.0, knee=0.5, strength=0.3).
     */
    static create(ctx, hdrView) {
        const { device, width, height } = ctx;
        const halfW = Math.max(1, width >> 1);
        const halfH = Math.max(1, height >> 1);
        const half1 = device.createTexture({ label: 'BloomHalf1', size: { width: halfW, height: halfH }, format: HDR_FORMAT, usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING });
        const half2 = device.createTexture({ label: 'BloomHalf2', size: { width: halfW, height: halfH }, format: HDR_FORMAT, usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING });
        const result = device.createTexture({ label: 'BloomResult', size: { width, height }, format: HDR_FORMAT, usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING });
        const half1View = half1.createView();
        const half2View = half2.createView();
        const resultView = result.createView();
        const uniformBuffer = device.createBuffer({
            label: 'BloomUniforms', size: UNIFORM_SIZE,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        // Default params: threshold=1.0, knee=0.5, strength=0.3
        device.queue.writeBuffer(uniformBuffer, 0, new Float32Array([1.0, 0.5, 0.3, 0]).buffer);
        const sampler = device.createSampler({
            label: 'BloomSampler',
            magFilter: 'linear', minFilter: 'linear',
            addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge',
        });
        // Bind group layout for prefilter + blur passes (single input texture)
        const singleBGL = device.createBindGroupLayout({
            label: 'BloomSingleBGL',
            entries: [
                { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
                { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
                { binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
            ],
        });
        // Bind group layout for composite (two input textures)
        const compositeBGL = device.createBindGroupLayout({
            label: 'BloomCompositeBGL',
            entries: [
                { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
                { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
                { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
                { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
            ],
        });
        const bloomShader = device.createShaderModule({ label: 'BloomShader', code: bloomWgsl });
        const compositeShader = device.createShaderModule({ label: 'BloomComposite', code: bloomCompositeWgsl });
        const singleLayout = device.createPipelineLayout({ bindGroupLayouts: [singleBGL] });
        const compositeLayout = device.createPipelineLayout({ bindGroupLayouts: [compositeBGL] });
        function makeSingle(entryPoint, label) {
            return device.createRenderPipeline({
                label, layout: singleLayout,
                vertex: { module: bloomShader, entryPoint: 'vs_main' },
                fragment: { module: bloomShader, entryPoint, targets: [{ format: HDR_FORMAT }] },
                primitive: { topology: 'triangle-list' },
            });
        }
        const prefilterPipeline = makeSingle('fs_prefilter', 'BloomPrefilterPipeline');
        const blurHPipeline = makeSingle('fs_blur_h', 'BloomBlurHPipeline');
        const blurVPipeline = makeSingle('fs_blur_v', 'BloomBlurVPipeline');
        const compositePipeline = device.createRenderPipeline({
            label: 'BloomCompositePipeline', layout: compositeLayout,
            vertex: { module: compositeShader, entryPoint: 'vs_main' },
            fragment: { module: compositeShader, entryPoint: 'fs_main', targets: [{ format: HDR_FORMAT }] },
            primitive: { topology: 'triangle-list' },
        });
        function makeSingleBG(texView) {
            return device.createBindGroup({
                layout: singleBGL,
                entries: [
                    { binding: 0, resource: { buffer: uniformBuffer } },
                    { binding: 1, resource: texView },
                    { binding: 2, resource: sampler },
                ],
            });
        }
        const prefilterBG = makeSingleBG(hdrView);
        const blurHBG = makeSingleBG(half1View);
        const blurVBG = makeSingleBG(half2View);
        const compositeBG = device.createBindGroup({
            layout: compositeBGL,
            entries: [
                { binding: 0, resource: { buffer: uniformBuffer } },
                { binding: 1, resource: hdrView },
                { binding: 2, resource: half1View },
                { binding: 3, resource: sampler },
            ],
        });
        return new BloomPass(result, resultView, half1, half1View, half2, half2View, prefilterPipeline, blurHPipeline, blurVPipeline, compositePipeline, uniformBuffer, prefilterBG, blurHBG, blurVBG, compositeBG);
    }
    /**
     * Updates the bloom shader parameters.
     *
     * @param ctx       Renderer context (used for the queue).
     * @param threshold HDR luminance above which pixels begin to bloom.
     * @param knee      Width of the smooth ramp below the threshold (soft knee).
     * @param strength  Multiplier for the blurred bloom added during composite.
     */
    updateParams(ctx, threshold = 1.0, knee = 0.5, strength = 0.3) {
        this._scratch[0] = threshold;
        this._scratch[1] = knee;
        this._scratch[2] = strength;
        this._scratch[3] = 0;
        ctx.queue.writeBuffer(this._uniformBuffer, 0, this._scratch.buffer);
    }
    /**
     * Records the prefilter, blur ping-pong, and composite render passes.
     *
     * @param encoder Active command encoder to record into.
     * @param _ctx    Render context (unused).
     */
    execute(encoder, _ctx) {
        const draw = (label, attachment, pipeline, bg) => {
            const pass = encoder.beginRenderPass({
                label,
                colorAttachments: [{ view: attachment, clearValue: [0, 0, 0, 1], loadOp: 'clear', storeOp: 'store' }],
            });
            pass.setPipeline(pipeline);
            pass.setBindGroup(0, bg);
            pass.draw(3);
            pass.end();
        };
        // 1. Prefilter: full-res HDR → half-res bright regions
        draw('BloomPrefilter', this._half1View, this._prefilterPipeline, this._prefilterBG);
        // 2. Two blur iterations for a wider spread (H→V ping-pong on half-res)
        for (let i = 0; i < 2; i++) {
            draw('BloomBlurH', this._half2View, this._blurHPipeline, this._blurHBG);
            draw('BloomBlurV', this._half1View, this._blurVPipeline, this._blurVBG);
        }
        // 3. Composite: original full-res HDR + blurred bloom → result
        draw('BloomComposite', this.resultView, this._compositePipeline, this._compositeBG);
    }
    /**
     * Releases the textures and uniform buffer owned by this pass.
     */
    destroy() {
        this._result.destroy();
        this._half1.destroy();
        this._half2.destroy();
        this._uniformBuffer.destroy();
    }
}
