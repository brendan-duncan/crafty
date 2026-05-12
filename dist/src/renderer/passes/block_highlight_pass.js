import { RenderPass } from '../render_pass.js';
import { HDR_FORMAT } from './lighting_pass.js';
import blockHighlightWgsl from '../../shaders/block_highlight.wgsl?raw';
// viewProj(64) + blockPos(12) + pad(4) = 80 bytes
const UNIFORM_SIZE = 80;
/**
 * Draws a selection outline around the currently-targeted block, plus a
 * progressive crack overlay when the block is being broken. Reads the
 * existing depth buffer (load-only) and blends a dark face overlay plus thick
 * edge quads into the HDR color target.
 *
 * Uses two pipelines sharing a single shader: a face overlay (with depth bias
 * to avoid z-fighting) and an edge outline made of thin perpendicular quads.
 */
export class BlockHighlightPass extends RenderPass {
    name = 'BlockHighlightPass';
    _facePipeline;
    _edgePipeline;
    _uniformBuf;
    _bg;
    _hdrView;
    _depthView;
    _active = false;
    _crackStage = 0;
    _scratch = new Float32Array(UNIFORM_SIZE / 4);
    constructor(facePipeline, edgePipeline, uniformBuf, bg, hdrView, depthView) {
        super();
        this._facePipeline = facePipeline;
        this._edgePipeline = edgePipeline;
        this._uniformBuf = uniformBuf;
        this._bg = bg;
        this._hdrView = hdrView;
        this._depthView = depthView;
    }
    /**
     * Builds the pass, allocating the uniform buffer, bind group, and the face
     * and edge pipelines.
     *
     * @param ctx        Renderer context providing the GPU device.
     * @param hdrView    HDR color attachment to draw the highlight into.
     * @param depthView  Depth attachment used for occlusion (load-only).
     * @param crackAtlas Block atlas texture; the rightmost column of tiles
     *                   contains the per-stage crack overlay sampled by the face shader.
     * @returns A ready-to-execute BlockHighlightPass.
     */
    static create(ctx, hdrView, depthView, crackAtlas) {
        const { device } = ctx;
        const uniformBuf = device.createBuffer({
            label: 'BlockHighlightUniform',
            size: UNIFORM_SIZE,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        const crackSampler = device.createSampler({
            label: 'BlockHighlightCrackSampler',
            magFilter: 'nearest', // crisp pixel-art crack tiles
            minFilter: 'nearest',
            mipmapFilter: 'nearest',
            addressModeU: 'clamp-to-edge',
            addressModeV: 'clamp-to-edge',
        });
        const bgl = device.createBindGroupLayout({
            label: 'BlockHighlightBGL',
            entries: [
                { binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
                { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
                { binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
            ],
        });
        const bg = device.createBindGroup({
            label: 'BlockHighlightBG',
            layout: bgl,
            entries: [
                { binding: 0, resource: { buffer: uniformBuf } },
                { binding: 1, resource: crackAtlas.view },
                { binding: 2, resource: crackSampler },
            ],
        });
        const shader = device.createShaderModule({ label: 'BlockHighlightShader', code: blockHighlightWgsl });
        const pipelineLayout = device.createPipelineLayout({ bindGroupLayouts: [bgl] });
        // The vertex shader applies a clip-space depth bias (clip.z -= 0.001 * clip.w)
        // which is reliable across drivers; pipeline `depthBias` for depth32float is
        // implementation-defined and was insufficient at certain camera angles.
        const depthStencil = {
            format: 'depth32float',
            depthWriteEnabled: false,
            depthCompare: 'less-equal',
        };
        const blend = {
            color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' },
            alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
        };
        const facePipeline = device.createRenderPipeline({
            label: 'BlockHighlightFacePipeline',
            layout: pipelineLayout,
            vertex: { module: shader, entryPoint: 'vs_face' },
            fragment: { module: shader, entryPoint: 'fs_face', targets: [{ format: HDR_FORMAT, blend }] },
            primitive: { topology: 'triangle-list', cullMode: 'none' },
            depthStencil,
        });
        const edgePipeline = device.createRenderPipeline({
            label: 'BlockHighlightEdgePipeline',
            layout: pipelineLayout,
            vertex: { module: shader, entryPoint: 'vs_edge' },
            fragment: { module: shader, entryPoint: 'fs_edge', targets: [{ format: HDR_FORMAT, blend }] },
            primitive: { topology: 'triangle-list', cullMode: 'none' },
            depthStencil,
        });
        return new BlockHighlightPass(facePipeline, edgePipeline, uniformBuf, bg, hdrView, depthView);
    }
    /**
     * Sets the crack overlay stage (0-9) for the currently highlighted block.
     * Pass 0 or -1 to disable cracks.
     */
    setCrackStage(stage) {
        this._crackStage = Math.max(0, Math.min(9, Math.floor(stage)));
    }
    /**
     * Updates the per-frame uniforms. Pass `null` for `blockPos` to disable the
     * highlight for this frame.
     *
     * @param ctx      Renderer context (used for the queue).
     * @param viewProj Combined view-projection matrix (column-major).
     * @param blockPos Integer world-space coordinate of the targeted block, or
     *                 `null` when nothing is targeted.
     */
    update(ctx, viewProj, blockPos) {
        if (!blockPos) {
            this._active = false;
            return;
        }
        this._active = true;
        const data = this._scratch;
        data.set(viewProj.data, 0);
        data[16] = blockPos.x;
        data[17] = blockPos.y;
        data[18] = blockPos.z;
        data[19] = this._crackStage;
        ctx.queue.writeBuffer(this._uniformBuf, 0, data.buffer);
    }
    /**
     * Records the highlight draw calls. Becomes a no-op when no block is
     * currently targeted (i.e. `update` was last called with `null`).
     *
     * @param encoder Active command encoder to record into.
     * @param _ctx    Render context (unused).
     */
    execute(encoder, _ctx) {
        if (!this._active) {
            return;
        }
        const pass = encoder.beginRenderPass({
            label: 'BlockHighlightPass',
            colorAttachments: [{ view: this._hdrView, loadOp: 'load', storeOp: 'store' }],
            depthStencilAttachment: {
                view: this._depthView,
                depthLoadOp: 'load',
                depthStoreOp: 'store',
            },
        });
        pass.setBindGroup(0, this._bg);
        // 6 faces × 6 verts = 36 vertices for the dark face overlay
        pass.setPipeline(this._facePipeline);
        pass.draw(36);
        // 12 edges × 6 verts × 2 perpendicular planes = 144 vertices for thick edge quads
        pass.setPipeline(this._edgePipeline);
        pass.draw(144);
        pass.end();
    }
    /**
     * Releases GPU resources owned by this pass.
     */
    destroy() {
        this._uniformBuf.destroy();
    }
}
