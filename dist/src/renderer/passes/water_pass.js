import { RenderPass } from '../render_pass.js';
import { HDR_FORMAT } from './deferred_lighting_pass.js';
import waterWgsl from '../../shaders/water.wgsl?raw';
// Matches WorldGeometryPass camera uniform layout: 4×mat4 + vec3 + near + far + pad×3 = 288 bytes
const CAMERA_UNIFORM_SIZE = 64 * 4 + 16 + 16;
const WATER_UNIFORM_SIZE = 16; // time + pad×3
const CHUNK_UNIFORM_SIZE = 16; // vec3f offset + f32 pad
const FLOATS_PER_VERT = 3; // [x, y, z]
const BYTES_PER_VERT = FLOATS_PER_VERT * 4;
const CHUNK_SIZE = 16;
/**
 * Forward-renders animated water chunk surfaces over the deferred-lit HDR buffer,
 * blending refraction (a copy of the pre-water HDR scene), screen-space reflections,
 * an equirectangular HDR sky fallback, depth-based tinting, and DUDV-driven ripples.
 *
 * Inputs sampled: HDR scene (copied into a refraction texture), GBuffer depth,
 * DUDV ripple map, water-depth gradient map, sky panorama. Output written: the
 * HDR texture view, blended with src-alpha. Per-chunk vertex data is supplied
 * via addChunk/updateChunk/removeChunk and culled against the camera frustum.
 */
export class WaterPass extends RenderPass {
    name = 'WaterPass';
    _device;
    _hdrTexture;
    _hdrView;
    _refractionTex;
    _pipeline;
    _cameraBuffer;
    _waterBuffer;
    _cameraBG;
    _waterBG;
    _sceneBG;
    _sceneBGL;
    _chunkBGL;
    _skyTexture;
    _dudvTexture;
    _gradientTexture;
    _chunks = new Map();
    _frustumPlanes = new Float32Array(24);
    _cameraScratch = new Float32Array(CAMERA_UNIFORM_SIZE / 4);
    _waterScratch = new Float32Array(4);
    constructor(device, hdrTexture, hdrView, refractionTex, pipeline, cameraBuffer, waterBuffer, cameraBG, waterBG, sceneBG, sceneBGL, chunkBGL, skyTexture, dudvTexture, gradientTexture) {
        super();
        this._device = device;
        this._hdrTexture = hdrTexture;
        this._hdrView = hdrView;
        this._refractionTex = refractionTex;
        this._pipeline = pipeline;
        this._cameraBuffer = cameraBuffer;
        this._waterBuffer = waterBuffer;
        this._cameraBG = cameraBG;
        this._waterBG = waterBG;
        this._sceneBG = sceneBG;
        this._sceneBGL = sceneBGL;
        this._chunkBGL = chunkBGL;
        this._skyTexture = skyTexture;
        this._dudvTexture = dudvTexture;
        this._gradientTexture = gradientTexture;
    }
    /**
     * Build the pass and all of its GPU resources (pipeline, refraction texture,
     * camera and water uniform buffers, scene bind group).
     *
     * @param ctx Render context providing the GPU device and target dimensions.
     * @param hdrTexture Lighting pass output; must have COPY_SRC usage so it can be copied into the refraction texture.
     * @param hdrView Render target view that water is composited onto with src-alpha blending.
     * @param depthView GBuffer depth (depth32float) used for the in-shader manual depth test.
     * @param skyTexture Equirectangular HDR sky panorama used as SSR reflection fallback.
     * @param dudvTexture DUDV ripple/distortion map driving wave normals and screen-space distortion.
     * @param gradientTexture Colour gradient sampled by water depth to produce the murky tint.
     * @returns A ready-to-use WaterPass instance.
     */
    static create(ctx, hdrTexture, hdrView, depthView, skyTexture, dudvTexture, gradientTexture) {
        const { device, width, height } = ctx;
        const cameraBGL = device.createBindGroupLayout({
            label: 'WaterCameraBGL',
            entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
        });
        const waterBGL = device.createBindGroupLayout({
            label: 'WaterUniformBGL',
            entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
        });
        const chunkBGL = device.createBindGroupLayout({
            label: 'WaterChunkBGL',
            entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
        });
        const sceneBGL = device.createBindGroupLayout({
            label: 'WaterSceneBGL',
            entries: [
                { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } }, // refraction
                { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'depth' } }, // depth
                { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } }, // dudv
                { binding: 3, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } }, // gradient
                { binding: 4, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } }, // sky (equirect)
                { binding: 5, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
            ],
        });
        const { refractionTex, refractionView } = WaterPass._makeRefractionTex(device, width, height);
        const sampler = device.createSampler({ magFilter: 'linear', minFilter: 'linear', addressModeU: 'repeat', addressModeV: 'repeat' });
        const cameraBuffer = device.createBuffer({ label: 'WaterCameraBuffer', size: CAMERA_UNIFORM_SIZE, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
        const waterBuffer = device.createBuffer({ label: 'WaterUniformBuffer', size: WATER_UNIFORM_SIZE, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
        const cameraBG = device.createBindGroup({ label: 'WaterCameraBG', layout: cameraBGL, entries: [{ binding: 0, resource: { buffer: cameraBuffer } }] });
        const waterBG = device.createBindGroup({ label: 'WaterUniformBG', layout: waterBGL, entries: [{ binding: 0, resource: { buffer: waterBuffer } }] });
        const sceneBG = WaterPass._makeSceneBG(device, sceneBGL, refractionView, depthView, dudvTexture, gradientTexture, skyTexture, sampler);
        const shader = device.createShaderModule({ label: 'WaterShader', code: waterWgsl });
        const layout = device.createPipelineLayout({ bindGroupLayouts: [cameraBGL, waterBGL, chunkBGL, sceneBGL] });
        const vertexLayout = {
            arrayStride: BYTES_PER_VERT,
            attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x3' }],
        };
        const pipeline = device.createRenderPipeline({
            label: 'WaterPipeline',
            layout,
            vertex: { module: shader, entryPoint: 'vs_main', buffers: [vertexLayout] },
            fragment: {
                module: shader, entryPoint: 'fs_main',
                targets: [{
                        format: HDR_FORMAT,
                        blend: {
                            color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' },
                            alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
                        },
                    }],
            },
            primitive: { topology: 'triangle-list', cullMode: 'none' },
        });
        return new WaterPass(device, hdrTexture, hdrView, refractionTex, pipeline, cameraBuffer, waterBuffer, cameraBG, waterBG, sceneBG, sceneBGL, chunkBGL, skyTexture, dudvTexture, gradientTexture);
    }
    /**
     * Rebuild the refraction texture and scene bind group after a resize or sky change.
     * Per-chunk vertex and uniform data is always preserved.
     *
     * @param hdrTexture New HDR scene texture (must have COPY_SRC).
     * @param hdrView New HDR render target view.
     * @param depthView New GBuffer depth view.
     * @param skyTexture Optional replacement for the equirectangular sky; omit to keep the current one.
     */
    updateRenderTargets(hdrTexture, hdrView, depthView, skyTexture) {
        this._refractionTex.destroy();
        this._hdrTexture = hdrTexture;
        this._hdrView = hdrView;
        if (skyTexture) {
            this._skyTexture = skyTexture;
        }
        const { width, height } = hdrTexture;
        const { refractionTex, refractionView } = WaterPass._makeRefractionTex(this._device, width, height);
        this._refractionTex = refractionTex;
        const sampler = this._device.createSampler({ magFilter: 'linear', minFilter: 'linear', addressModeU: 'repeat', addressModeV: 'repeat' });
        this._sceneBG = WaterPass._makeSceneBG(this._device, this._sceneBGL, refractionView, depthView, this._dudvTexture, this._gradientTexture, this._skyTexture, sampler);
    }
    /**
     * Upload per-frame camera uniforms (matrices, position, near/far) and refresh
     * the cached frustum planes used for chunk culling.
     *
     * @param ctx Render context providing the GPU queue.
     * @param view View matrix.
     * @param proj Projection matrix.
     * @param viewProj Combined view-projection matrix; also used to extract frustum planes.
     * @param invViewProj Inverse of viewProj, used by the shader to reconstruct world positions.
     * @param camPos World-space camera position.
     * @param near Near plane distance.
     * @param far Far plane distance.
     */
    updateCamera(ctx, view, proj, viewProj, invViewProj, camPos, near, far) {
        const data = this._cameraScratch;
        data.set(view.data, 0);
        data.set(proj.data, 16);
        data.set(viewProj.data, 32);
        data.set(invViewProj.data, 48);
        data[64] = camPos.x;
        data[65] = camPos.y;
        data[66] = camPos.z;
        data[67] = near;
        data[68] = far;
        ctx.queue.writeBuffer(this._cameraBuffer, 0, data.buffer);
        this._extractFrustumPlanes(viewProj.data);
    }
    _extractFrustumPlanes(m) {
        const p = this._frustumPlanes;
        p[0] = m[3] + m[0];
        p[1] = m[7] + m[4];
        p[2] = m[11] + m[8];
        p[3] = m[15] + m[12];
        p[4] = m[3] - m[0];
        p[5] = m[7] - m[4];
        p[6] = m[11] - m[8];
        p[7] = m[15] - m[12];
        p[8] = m[3] + m[1];
        p[9] = m[7] + m[5];
        p[10] = m[11] + m[9];
        p[11] = m[15] + m[13];
        p[12] = m[3] - m[1];
        p[13] = m[7] - m[5];
        p[14] = m[11] - m[9];
        p[15] = m[15] - m[13];
        p[16] = m[2];
        p[17] = m[6];
        p[18] = m[10];
        p[19] = m[14];
        p[20] = m[3] - m[2];
        p[21] = m[7] - m[6];
        p[22] = m[11] - m[10];
        p[23] = m[15] - m[14];
    }
    _isVisible(ox, oy, oz) {
        const p = this._frustumPlanes;
        const mx = ox + CHUNK_SIZE, my = oy + CHUNK_SIZE, mz = oz + CHUNK_SIZE;
        for (let i = 0; i < 6; i++) {
            const a = p[i * 4], b = p[i * 4 + 1], c = p[i * 4 + 2], d = p[i * 4 + 3];
            if (a * (a >= 0 ? mx : ox) + b * (b >= 0 ? my : oy) + c * (c >= 0 ? mz : oz) + d < 0) {
                return false;
            }
        }
        return true;
    }
    /**
     * Upload per-frame water uniforms driving wave animation and sky reflection brightness.
     *
     * @param ctx Render context providing the GPU queue.
     * @param time Animation time in seconds, used to scroll DUDV samples and drive ripples.
     * @param skyIntensity Multiplier for the HDR sky reflection (0 at night, 1 at noon). Defaults to 1.
     */
    updateTime(ctx, time, skyIntensity = 1.0) {
        this._waterScratch[0] = time;
        this._waterScratch[1] = skyIntensity;
        this._waterScratch[2] = 0;
        this._waterScratch[3] = 0;
        ctx.queue.writeBuffer(this._waterBuffer, 0, this._waterScratch.buffer);
    }
    /**
     * Register a chunk's water mesh, allocating GPU buffers and uniforms for it.
     * If the chunk is already registered the mesh data is replaced in place.
     *
     * @param chunk Chunk owning the water surface.
     * @param mesh Mesh data containing the water vertex buffer.
     */
    addChunk(chunk, mesh) {
        const existing = this._chunks.get(chunk);
        if (existing) {
            this._replaceMeshBuffer(existing, mesh);
        }
        else {
            this._chunks.set(chunk, this._createChunkGpu(chunk, mesh));
        }
    }
    /**
     * Replace the GPU vertex buffer for an already-registered chunk, or register it
     * if it has not been seen before.
     *
     * @param chunk Chunk whose water mesh has changed.
     * @param mesh Updated mesh data.
     */
    updateChunk(chunk, mesh) {
        const existing = this._chunks.get(chunk);
        if (existing) {
            this._replaceMeshBuffer(existing, mesh);
        }
        else {
            this._chunks.set(chunk, this._createChunkGpu(chunk, mesh));
        }
    }
    /**
     * Drop a chunk and free its GPU vertex/uniform buffers. No-op if the chunk
     * has not been registered.
     *
     * @param chunk Chunk to remove.
     */
    removeChunk(chunk) {
        const gpu = this._chunks.get(chunk);
        if (!gpu) {
            return;
        }
        gpu.buffer?.destroy();
        gpu.uniformBuffer.destroy();
        this._chunks.delete(chunk);
    }
    /**
     * Copy the current HDR scene into the refraction texture and then render every
     * frustum-visible water chunk on top of the HDR target with src-alpha blending.
     *
     * @param encoder Command encoder to record into.
     * @param _ctx Render context (unused; resources are owned by the pass).
     */
    execute(encoder, _ctx) {
        // Copy the lit scene into the refraction texture before water overwrites it.
        const { width, height } = this._refractionTex;
        encoder.copyTextureToTexture({ texture: this._hdrTexture }, { texture: this._refractionTex }, { width, height, depthOrArrayLayers: 1 });
        const pass = encoder.beginRenderPass({
            label: 'WaterPass',
            colorAttachments: [{ view: this._hdrView, loadOp: 'load', storeOp: 'store' }],
        });
        pass.setPipeline(this._pipeline);
        pass.setBindGroup(0, this._cameraBG);
        pass.setBindGroup(1, this._waterBG);
        pass.setBindGroup(3, this._sceneBG);
        for (const gpu of this._chunks.values()) {
            if (!gpu.buffer || gpu.vertexCount === 0) {
                continue;
            }
            if (!this._isVisible(gpu.ox, gpu.oy, gpu.oz)) {
                continue;
            }
            pass.setBindGroup(2, gpu.chunkBG);
            pass.setVertexBuffer(0, gpu.buffer);
            pass.draw(gpu.vertexCount);
        }
        pass.end();
    }
    /**
     * Release all GPU resources owned by the pass, including per-chunk vertex and
     * uniform buffers, and clear the chunk registry.
     */
    destroy() {
        this._cameraBuffer.destroy();
        this._waterBuffer.destroy();
        this._refractionTex.destroy();
        for (const gpu of this._chunks.values()) {
            gpu.buffer?.destroy();
            gpu.uniformBuffer.destroy();
        }
        this._chunks.clear();
    }
    static _makeRefractionTex(device, width, height) {
        const refractionTex = device.createTexture({ label: 'WaterRefractionTex', size: { width, height }, format: HDR_FORMAT, usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT });
        const refractionView = refractionTex.createView();
        return { refractionTex, refractionView };
    }
    static _makeSceneBG(device, layout, refractionView, depthView, dudv, gradient, sky, sampler) {
        return device.createBindGroup({
            label: 'WaterSceneBG', layout,
            entries: [
                { binding: 0, resource: refractionView },
                { binding: 1, resource: depthView },
                { binding: 2, resource: dudv.view },
                { binding: 3, resource: gradient.view },
                { binding: 4, resource: sky.view },
                { binding: 5, resource: sampler },
            ],
        });
    }
    _createChunkGpu(chunk, mesh) {
        const uniformBuffer = this._device.createBuffer({
            label: `WaterChunkBuf(${chunk.globalPosition.x},${chunk.globalPosition.y},${chunk.globalPosition.z})`,
            size: CHUNK_UNIFORM_SIZE,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        this._device.queue.writeBuffer(uniformBuffer, 0, new Float32Array([chunk.globalPosition.x, chunk.globalPosition.y, chunk.globalPosition.z, 0]));
        const chunkBG = this._device.createBindGroup({
            label: 'WaterChunkBG', layout: this._chunkBGL,
            entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
        });
        const gpu = {
            ox: chunk.globalPosition.x, oy: chunk.globalPosition.y, oz: chunk.globalPosition.z,
            buffer: null, vertexCount: 0, uniformBuffer, chunkBG,
        };
        this._replaceMeshBuffer(gpu, mesh);
        return gpu;
    }
    _replaceMeshBuffer(gpu, mesh) {
        gpu.buffer?.destroy();
        gpu.buffer = null;
        gpu.vertexCount = mesh.waterCount;
        if (mesh.waterCount > 0) {
            const buf = this._device.createBuffer({
                label: 'WaterVertexBuf',
                size: mesh.waterCount * BYTES_PER_VERT,
                usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            });
            this._device.queue.writeBuffer(buf, 0, mesh.water.buffer, 0, mesh.waterCount * BYTES_PER_VERT);
            gpu.buffer = buf;
        }
    }
}
