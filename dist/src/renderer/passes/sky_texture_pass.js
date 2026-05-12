import { RenderPass } from '../render_pass.js';
import { HDR_FORMAT } from './deferred_lighting_pass.js';
import skyWgsl from '../../shaders/sky.wgsl?raw';
// invViewProj (mat4x4 = 64 bytes) + cameraPos (vec3 = 12 bytes) + pad (4 bytes) = 80 bytes
const SKY_UNIFORM_SIZE = 80;
/**
 * Renders the sky as a fullscreen background by sampling an equirectangular HDR texture.
 *
 * Issued as the first color writer of the frame: clears the HDR target and shades
 * each pixel by reconstructing its world-space view direction from `invViewProj` and
 * sampling the supplied sky texture. Output exposure is configurable per frame.
 */
export class SkyTexturePass extends RenderPass {
    name = 'SkyPass';
    _pipeline;
    _uniformBuffer;
    _uniformBG;
    _textureBG;
    _hdrView;
    _scratch = new Float32Array(SKY_UNIFORM_SIZE / 4);
    constructor(pipeline, uniformBuffer, uniformBG, textureBG, hdrView) {
        super();
        this._pipeline = pipeline;
        this._uniformBuffer = uniformBuffer;
        this._uniformBG = uniformBG;
        this._textureBG = textureBG;
        this._hdrView = hdrView;
    }
    /**
     * Allocates the sky uniform buffer, sampler, bind groups, and the fragment pipeline
     * that writes into the HDR color target.
     *
     * @param hdrView - HDR color render target (the pass clears it).
     * @param skyTexture - Equirectangular HDR sky source.
     */
    static create(ctx, hdrView, skyTexture) {
        const { device } = ctx;
        const uniformBuffer = device.createBuffer({
            label: 'SkyUniformBuffer',
            size: SKY_UNIFORM_SIZE,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        const uniformBGL = device.createBindGroupLayout({
            label: 'SkyUniformBGL',
            entries: [
                { binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
            ],
        });
        const textureBGL = device.createBindGroupLayout({
            label: 'SkyTextureBGL',
            entries: [
                { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
                { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
            ],
        });
        const sampler = device.createSampler({
            label: 'SkySampler',
            magFilter: 'linear', minFilter: 'linear',
            addressModeU: 'repeat', addressModeV: 'clamp-to-edge',
        });
        const uniformBG = device.createBindGroup({
            layout: uniformBGL,
            entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
        });
        const textureBG = device.createBindGroup({
            layout: textureBGL,
            entries: [
                { binding: 0, resource: skyTexture.view },
                { binding: 1, resource: sampler },
            ],
        });
        const shader = device.createShaderModule({ label: 'SkyShader', code: skyWgsl });
        const pipeline = device.createRenderPipeline({
            label: 'SkyPipeline',
            layout: device.createPipelineLayout({ bindGroupLayouts: [uniformBGL, textureBGL] }),
            vertex: { module: shader, entryPoint: 'vs_main' },
            fragment: { module: shader, entryPoint: 'fs_main', targets: [{ format: HDR_FORMAT }] },
            primitive: { topology: 'triangle-list' },
        });
        return new SkyTexturePass(pipeline, uniformBuffer, uniformBG, textureBG, hdrView);
    }
    /**
     * Uploads the inverse view-projection (used to reconstruct view directions),
     * camera position, and an exposure multiplier into the sky uniform buffer.
     */
    updateCamera(ctx, invViewProj, cameraPos, exposure = 0.2) {
        const data = this._scratch;
        data.set(invViewProj.data, 0);
        data[16] = cameraPos.x;
        data[17] = cameraPos.y;
        data[18] = cameraPos.z;
        data[19] = exposure;
        ctx.queue.writeBuffer(this._uniformBuffer, 0, data.buffer);
    }
    /**
     * Clears the HDR target and draws a fullscreen triangle that shades each pixel
     * with the sky color for its view direction.
     */
    execute(encoder, _ctx) {
        const pass = encoder.beginRenderPass({
            label: 'SkyPass',
            colorAttachments: [{
                    view: this._hdrView,
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
    }
    destroy() {
        this._uniformBuffer.destroy();
    }
}
