import { RenderPass } from '../render_pass.js';
import { HDR_FORMAT } from './lighting_pass.js';
import cloudsWgsl from '../../shaders/clouds.wgsl?raw';
// CameraUniforms: invViewProj(64) + position vec3(12) + near(4) + far(4) + pad(12) = 96 bytes
const CLOUD_CAMERA_UNIFORM_SIZE = 96;
// CloudUniforms: see clouds.wgsl struct — 12 floats = 48 bytes
const CLOUD_UNIFORM_SIZE = 48;
// LightUniforms: direction(12) + intensity(4) + color(12) + _pad(4) = 32 bytes
const CLOUD_LIGHT_UNIFORM_SIZE = 32;
/**
 * Reasonable default {@link CloudSettings} for a daytime overcast-leaning sky.
 */
export const DEFAULT_CLOUD_SETTINGS = {
    cloudBase: 5,
    cloudTop: 15,
    coverage: 0.55,
    density: 1.0,
    windOffset: [0, 0],
    anisotropy: 0.85,
    extinction: 0.25,
    ambientColor: [0.4, 0.55, 0.7],
    exposure: 0.2,
};
/**
 * Volumetric cloud + procedural sky pass. Renders a fullscreen triangle that
 * raymarches a horizontal cloud slab using two 3D noise textures (base shape
 * + detail erosion), with Beer's law transmittance and a secondary light
 * march for self-shadowing. Reads the scene depth (to early-out behind solid
 * geometry) and clears+writes the HDR color target.
 *
 * Sky color is computed analytically (Rayleigh+Mie) inside the same shader,
 * so no sky cubemap is required.
 */
export class CloudPass extends RenderPass {
    name = 'CloudPass';
    _pipeline;
    _hdrView;
    _cameraBuffer;
    _cloudBuffer;
    _lightBuffer;
    _sceneBG; // group 0: camera + cloud
    _lightBG; // group 1: light
    _depthBG; // group 2: depth texture
    _noiseSkyBG; // group 3: noises
    constructor(pipeline, hdrView, cameraBuffer, cloudBuffer, lightBuffer, sceneBG, lightBG, depthBG, noiseSkyBG) {
        super();
        this._pipeline = pipeline;
        this._hdrView = hdrView;
        this._cameraBuffer = cameraBuffer;
        this._cloudBuffer = cloudBuffer;
        this._lightBuffer = lightBuffer;
        this._sceneBG = sceneBG;
        this._lightBG = lightBG;
        this._depthBG = depthBG;
        this._noiseSkyBG = noiseSkyBG;
    }
    /**
     * Builds the cloud pass: allocates uniform buffers, bind groups, and the
     * raymarching pipeline.
     *
     * @param ctx       Renderer context (provides GPU device).
     * @param hdrView   HDR color attachment that will be cleared and written.
     * @param depthView Scene depth attachment, sampled for occlusion.
     * @param noises    Pre-built 3D base and detail noise textures.
     * @returns A configured CloudPass.
     */
    static create(ctx, hdrView, depthView, noises) {
        const { device } = ctx;
        const cameraBuffer = device.createBuffer({
            label: 'CloudCameraBuffer', size: CLOUD_CAMERA_UNIFORM_SIZE,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        const cloudBuffer = device.createBuffer({
            label: 'CloudUniformBuffer', size: CLOUD_UNIFORM_SIZE,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        const lightBuffer = device.createBuffer({
            label: 'CloudLightBuffer', size: CLOUD_LIGHT_UNIFORM_SIZE,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        // group 0: camera uniform + cloud uniform
        const sceneBGL = device.createBindGroupLayout({
            label: 'CloudSceneBGL',
            entries: [
                { binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
                { binding: 1, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
            ],
        });
        // group 1: light uniform
        const lightBGL = device.createBindGroupLayout({
            label: 'CloudLightBGL',
            entries: [
                { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
            ],
        });
        // group 2: depth texture + dummy sampler (textureLoad doesn't need sampler but sampler slot kept)
        const depthBGL = device.createBindGroupLayout({
            label: 'CloudDepthBGL',
            entries: [
                { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } },
                { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
            ],
        });
        // group 3: base_noise + detail_noise + noise_samp
        const noiseSkyBGL = device.createBindGroupLayout({
            label: 'CloudNoiseSkyBGL',
            entries: [
                { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float', viewDimension: '3d' } },
                { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float', viewDimension: '3d' } },
                { binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
            ],
        });
        const noiseSampler = device.createSampler({
            label: 'CloudNoiseSampler',
            magFilter: 'linear', minFilter: 'linear', mipmapFilter: 'linear',
            addressModeU: 'repeat', addressModeV: 'repeat', addressModeW: 'repeat',
        });
        const depthSampler = device.createSampler({ label: 'CloudDepthSampler' });
        const sceneBG = device.createBindGroup({
            label: 'CloudSceneBG', layout: sceneBGL,
            entries: [
                { binding: 0, resource: { buffer: cameraBuffer } },
                { binding: 1, resource: { buffer: cloudBuffer } },
            ],
        });
        const lightBG = device.createBindGroup({
            label: 'CloudLightBG', layout: lightBGL,
            entries: [{ binding: 0, resource: { buffer: lightBuffer } }],
        });
        const depthBG = device.createBindGroup({
            label: 'CloudDepthBG', layout: depthBGL,
            entries: [
                { binding: 0, resource: depthView },
                { binding: 1, resource: depthSampler },
            ],
        });
        const noiseSkyBG = device.createBindGroup({
            label: 'CloudNoiseSkyBG', layout: noiseSkyBGL,
            entries: [
                { binding: 0, resource: noises.baseView },
                { binding: 1, resource: noises.detailView },
                { binding: 2, resource: noiseSampler },
            ],
        });
        const shader = device.createShaderModule({ label: 'CloudShader', code: cloudsWgsl });
        const pipeline = device.createRenderPipeline({
            label: 'CloudPipeline',
            layout: device.createPipelineLayout({ bindGroupLayouts: [sceneBGL, lightBGL, depthBGL, noiseSkyBGL] }),
            vertex: { module: shader, entryPoint: 'vs_main' },
            fragment: { module: shader, entryPoint: 'fs_main', targets: [{ format: HDR_FORMAT }] },
            primitive: { topology: 'triangle-list' },
        });
        return new CloudPass(pipeline, hdrView, cameraBuffer, cloudBuffer, lightBuffer, sceneBG, lightBG, depthBG, noiseSkyBG);
    }
    /**
     * Updates the per-frame camera uniforms used to reconstruct view rays and
     * linearize the depth buffer.
     *
     * @param ctx         Renderer context (used for the queue).
     * @param invViewProj Inverse view-projection matrix (column-major).
     * @param camPos      World-space camera position.
     * @param near        Near plane distance.
     * @param far         Far plane distance.
     */
    updateCamera(ctx, invViewProj, camPos, near, far) {
        const data = new Float32Array(CLOUD_CAMERA_UNIFORM_SIZE / 4);
        data.set(invViewProj.data, 0);
        data[16] = camPos.x;
        data[17] = camPos.y;
        data[18] = camPos.z;
        data[19] = near;
        data[20] = far;
        ctx.queue.writeBuffer(this._cameraBuffer, 0, data.buffer);
    }
    /**
     * Updates the directional sun light used by both the cloud scattering
     * solution and the procedural sky.
     *
     * @param ctx       Renderer context (used for the queue).
     * @param dir       Normalized direction *to* the sun in world space.
     * @param color     Linear RGB sun color.
     * @param intensity Scalar light intensity.
     */
    updateLight(ctx, dir, color, intensity) {
        const data = new Float32Array(CLOUD_LIGHT_UNIFORM_SIZE / 4);
        data[0] = dir.x;
        data[1] = dir.y;
        data[2] = dir.z;
        data[3] = intensity;
        data[4] = color.x;
        data[5] = color.y;
        data[6] = color.z; // data[7] = pad
        ctx.queue.writeBuffer(this._lightBuffer, 0, data.buffer);
    }
    /**
     * Uploads the {@link CloudSettings} struct to the cloud uniform buffer.
     *
     * @param ctx Renderer context (used for the queue).
     * @param s   Cloud parameters for this frame.
     */
    updateSettings(ctx, s) {
        const data = new Float32Array(CLOUD_UNIFORM_SIZE / 4);
        data[0] = s.cloudBase;
        data[1] = s.cloudTop;
        data[2] = s.coverage;
        data[3] = s.density;
        data[4] = s.windOffset[0];
        data[5] = s.windOffset[1];
        data[6] = s.anisotropy;
        data[7] = s.extinction;
        data[8] = s.ambientColor[0];
        data[9] = s.ambientColor[1];
        data[10] = s.ambientColor[2];
        data[11] = s.exposure;
        ctx.queue.writeBuffer(this._cloudBuffer, 0, data.buffer);
    }
    /**
     * Records the fullscreen cloud+sky draw, clearing the HDR target.
     *
     * @param encoder Active command encoder to record into.
     * @param _ctx    Render context (unused).
     */
    execute(encoder, _ctx) {
        const pass = encoder.beginRenderPass({
            label: 'CloudPass',
            colorAttachments: [{
                    view: this._hdrView,
                    clearValue: [0, 0, 0, 1],
                    loadOp: 'clear',
                    storeOp: 'store',
                }],
        });
        pass.setPipeline(this._pipeline);
        pass.setBindGroup(0, this._sceneBG);
        pass.setBindGroup(1, this._lightBG);
        pass.setBindGroup(2, this._depthBG);
        pass.setBindGroup(3, this._noiseSkyBG);
        pass.draw(3);
        pass.end();
    }
    /**
     * Releases the uniform buffers owned by this pass.
     */
    destroy() {
        this._cameraBuffer.destroy();
        this._cloudBuffer.destroy();
        this._lightBuffer.destroy();
    }
}
