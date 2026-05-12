import { RenderPass } from '../render_pass.js';
import { VERTEX_ATTRIBUTES, VERTEX_STRIDE } from '../../assets/mesh.js';
import shadowWgsl from '../../shaders/shadow.wgsl?raw';
const CAMERA_UNIFORM_SIZE = 64; // 1 mat4
const MODEL_UNIFORM_SIZE = 64; // 1 mat4
/**
 * Renders scene meshes into a single 2D depth texture from a spot light's perspective
 * (perspective projection), producing a shadow map sampled later during lighting.
 *
 * Inputs: per-draw mesh vertex/index buffers (position attribute only) and a
 * light view-projection matrix. Output: depth32float values written to the
 * provided shadow map texture view.
 */
export class SpotShadowPass extends RenderPass {
    name = 'SpotShadowPass';
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
     * Build the pass, allocating the camera uniform buffer, bind-group layouts, and
     * depth-only render pipeline that targets the supplied shadow map view.
     *
     * @param ctx Render context providing the GPU device.
     * @param shadowMapView Depth32Float texture view that will receive the shadow map.
     * @returns A ready-to-use SpotShadowPass instance.
     */
    static create(ctx, shadowMapView) {
        const { device } = ctx;
        const cameraBGL = device.createBindGroupLayout({
            label: 'SpotShadowCameraBGL',
            entries: [
                { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
            ],
        });
        const modelBGL = device.createBindGroupLayout({
            label: 'SpotShadowModelBGL',
            entries: [
                { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
            ],
        });
        const cameraBuffer = device.createBuffer({
            label: 'SpotShadowCameraBuffer',
            size: CAMERA_UNIFORM_SIZE,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        const shaderModule = device.createShaderModule({
            label: 'SpotShadowShader',
            code: shadowWgsl,
        });
        const pipeline = device.createRenderPipeline({
            label: 'SpotShadowPipeline',
            layout: device.createPipelineLayout({
                bindGroupLayouts: [cameraBGL, modelBGL],
            }),
            vertex: {
                module: shaderModule,
                entryPoint: 'vs_main',
                buffers: [{
                        arrayStride: VERTEX_STRIDE,
                        attributes: [VERTEX_ATTRIBUTES[0]], // Only position needed
                    }],
            },
            fragment: {
                module: shaderModule,
                entryPoint: 'fs_main',
                targets: [], // Depth-only output
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
        return new SpotShadowPass(pipeline, cameraBGL, modelBGL, cameraBuffer, shadowMapView);
    }
    /**
     * Replace the list of meshes that will be rasterized on the next execute.
     *
     * @param items Draw items to record; the array is retained by reference.
     */
    setDrawItems(items) {
        this._drawItems = items;
    }
    /**
     * Computes the view-projection matrix from the spot light data and uploads it
     * to the camera uniform, lazily creating the camera bind group.
     *
     * @param ctx Render context providing the GPU queue and device.
     * @param light Spot light data whose position/direction/outerAngle/range are
     *              used to derive the view-projection.
     */
    updateLight(ctx, light) {
        const vp = light.computeLightViewProj();
        const data = this._cameraScratch;
        data.set(vp.data, 0);
        ctx.queue.writeBuffer(this._cameraBuffer, 0, data);
        if (!this._cameraBindGroup) {
            this._cameraBindGroup = ctx.device.createBindGroup({
                label: 'SpotShadowCameraBindGroup',
                layout: this._cameraBGL,
                entries: [{ binding: 0, resource: { buffer: this._cameraBuffer } }],
            });
        }
    }
    /**
     * Record the depth-only render pass, clearing the shadow map and drawing every
     * registered item from the spot light's perspective. Skips work entirely if
     * the camera bind group has not yet been initialized via updateCamera.
     *
     * @param encoder Command encoder to record into.
     * @param ctx Render context providing the GPU device and queue.
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
            label: 'SpotShadowPass',
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
                label: `SpotShadowModelBuffer${idx}`,
                size: MODEL_UNIFORM_SIZE,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });
            this._modelBuffers.push(buffer);
            const bindGroup = device.createBindGroup({
                label: `SpotShadowModelBG${idx}`,
                layout: this._modelBGL,
                entries: [{ binding: 0, resource: { buffer } }],
            });
            this._modelBindGroups.push(bindGroup);
        }
    }
    /**
     * Release all GPU resources owned by this pass (camera and per-model uniform buffers).
     */
    destroy() {
        this._cameraBuffer.destroy();
        for (const buffer of this._modelBuffers) {
            buffer.destroy();
        }
    }
}
