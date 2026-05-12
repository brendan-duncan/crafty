import { RenderPass } from '../render_pass.js';
import { VERTEX_ATTRIBUTES, VERTEX_STRIDE } from '../../assets/mesh.js';
import shadowWgsl from '../../shaders/shadow.wgsl?raw';
const CAMERA_UNIFORM_SIZE = 64; // 1 mat4
const MODEL_UNIFORM_SIZE = 64; // 1 mat4
/**
 * Renders scene geometry from the sun's point of view into a depth-only
 * shadow map for use by the lighting pass.
 *
 * Inputs: a list of {@link DirectionalShadowDrawItem}s (set via
 * {@link setDrawItems}) and the light view-projection matrix supplied by
 * {@link updateCamera}.
 * Output: writes depth32float to the supplied shadow-map view; no color
 * targets are bound.
 *
 * Shader: `shadow.wgsl`. Uses depth-bias and back-face culling to mitigate
 * shadow acne.
 */
export class DirectionalShadowPass extends RenderPass {
    /** Identifier used in render-graph diagnostics. */
    name = 'DirectionalShadowPass';
    _pipeline;
    _cameraBGL;
    _modelBGL;
    _cameraBuffer;
    _cameraBindGroup = null;
    _modelBuffers = [];
    _modelBindGroups = [];
    _drawItems = [];
    _shadowMapView;
    _modelData = new Float32Array(16);
    _cameraScratch = new Float32Array(16);
    constructor(pipeline, cameraBGL, modelBGL, cameraBuffer, shadowMapView) {
        super();
        this._pipeline = pipeline;
        this._cameraBGL = cameraBGL;
        this._modelBGL = modelBGL;
        this._cameraBuffer = cameraBuffer;
        this._shadowMapView = shadowMapView;
    }
    /**
     * Allocates the shadow pipeline, layouts and camera uniform buffer.
     *
     * @param ctx - Active render context providing the GPU device.
     * @param shadowMapView - Depth32float texture view this pass writes into.
     * @returns A configured directional shadow pass instance.
     */
    static create(ctx, shadowMapView) {
        const { device } = ctx;
        const cameraBGL = device.createBindGroupLayout({
            label: 'DirectionalShadowCameraBGL',
            entries: [
                { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
            ],
        });
        const modelBGL = device.createBindGroupLayout({
            label: 'DirectionalShadowModelBGL',
            entries: [
                { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
            ],
        });
        const cameraBuffer = device.createBuffer({
            label: 'DirectionalShadowCameraBuffer',
            size: CAMERA_UNIFORM_SIZE,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        const shaderModule = device.createShaderModule({
            label: 'DirectionalShadowShader',
            code: shadowWgsl,
        });
        const pipeline = device.createRenderPipeline({
            label: 'DirectionalShadowPipeline',
            layout: device.createPipelineLayout({
                bindGroupLayouts: [cameraBGL, modelBGL],
            }),
            vertex: {
                module: shaderModule,
                entryPoint: 'vs_main',
                buffers: [{
                        arrayStride: VERTEX_STRIDE,
                        attributes: [VERTEX_ATTRIBUTES[0]], // Only position needed for shadows
                    }],
            },
            fragment: {
                module: shaderModule,
                entryPoint: 'fs_main',
                targets: [], // No color output
            },
            depthStencil: {
                format: 'depth32float',
                depthWriteEnabled: true,
                depthCompare: 'less',
                depthBias: 1,
                depthBiasSlopeScale: 1.5,
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'back',
            },
        });
        return new DirectionalShadowPass(pipeline, cameraBGL, modelBGL, cameraBuffer, shadowMapView);
    }
    /** The depth32float texture view this pass writes shadow depth into. */
    get shadowMapView() {
        return this._shadowMapView;
    }
    /**
     * Replaces the list of draw items rendered into the shadow map.
     *
     * @param items - Mesh + transform pairs to draw next frame.
     */
    setDrawItems(items) {
        this._drawItems = items;
    }
    /**
     * Updates the light-space view-projection matrix used to transform geometry
     * into shadow-map space and lazily creates the camera bind group on first
     * call.
     *
     * @param ctx - Active render context providing the GPU device and queue.
     * @param lightViewProj - Combined view-projection matrix from the sun's frustum.
     */
    updateCamera(ctx, lightViewProj) {
        const data = this._cameraScratch;
        data.set(lightViewProj.data, 0);
        ctx.queue.writeBuffer(this._cameraBuffer, 0, data);
        if (!this._cameraBindGroup) {
            this._cameraBindGroup = ctx.device.createBindGroup({
                label: 'DirectionalShadowCameraBindGroup',
                layout: this._cameraBGL,
                entries: [{ binding: 0, resource: { buffer: this._cameraBuffer } }],
            });
        }
    }
    /**
     * Encodes the depth-only shadow render pass for every queued draw item.
     * No-op until {@link updateCamera} has been called at least once.
     *
     * @param encoder - GPU command encoder to record into.
     * @param ctx - Active render context (used to allocate per-instance buffers).
     */
    execute(encoder, ctx) {
        if (!this._cameraBindGroup) {
            return;
        }
        this._ensureModelBuffers(ctx.device, this._drawItems.length);
        // Write all model matrices
        for (let i = 0; i < this._drawItems.length; i++) {
            const item = this._drawItems[i];
            this._modelData.set(item.modelMatrix.data, 0);
            ctx.queue.writeBuffer(this._modelBuffers[i], 0, this._modelData);
        }
        const pass = encoder.beginRenderPass({
            label: 'DirectionalShadowPass',
            colorAttachments: [],
            depthStencilAttachment: {
                view: this._shadowMapView,
                depthClearValue: 1.0,
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
            },
        });
        pass.setPipeline(this._pipeline);
        pass.setBindGroup(0, this._cameraBindGroup);
        for (let i = 0; i < this._drawItems.length; i++) {
            const item = this._drawItems[i];
            pass.setBindGroup(1, this._modelBindGroups[i]);
            pass.setVertexBuffer(0, item.mesh.vertexBuffer);
            pass.setIndexBuffer(item.mesh.indexBuffer, 'uint32');
            pass.drawIndexed(item.mesh.indexCount);
        }
        pass.end();
    }
    _ensureModelBuffers(device, count) {
        while (this._modelBuffers.length < count) {
            const idx = this._modelBuffers.length;
            const buffer = device.createBuffer({
                label: `DirectionalShadowModelBuffer${idx}`,
                size: MODEL_UNIFORM_SIZE,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });
            this._modelBuffers.push(buffer);
            const bindGroup = device.createBindGroup({
                label: `DirectionalShadowModelBG${idx}`,
                layout: this._modelBGL,
                entries: [{ binding: 0, resource: { buffer } }],
            });
            this._modelBindGroups.push(bindGroup);
        }
    }
    /** Releases the camera and per-instance model uniform buffers. */
    destroy() {
        this._cameraBuffer.destroy();
        for (const buffer of this._modelBuffers) {
            buffer.destroy();
        }
    }
}
