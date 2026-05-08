import { RenderPass } from '../render_pass.js';
import { VERTEX_ATTRIBUTES, VERTEX_STRIDE } from '../../assets/mesh.js';
import { MaterialPassType } from '../../engine/material.js';
const CAMERA_UNIFORM_SIZE = 64 * 4 + 16 + 16; // 4 mat4 + vec3+f32 + vec3+f32
const MODEL_UNIFORM_SIZE = 128; // 2 mat4
/**
 * Deferred geometry pass: rasterises opaque mesh draw items into the G-buffer.
 *
 * Writes albedo+roughness (rgba8unorm), normal+metallic (rgba16float) and depth
 * (depth32float). Each draw supplies its own {@link Material}; pipelines are
 * cached per `material.shaderId` so many materials sharing a shader share one
 * pipeline.
 */
export class GeometryPass extends RenderPass {
    name = 'GeometryPass';
    _gbuffer;
    _cameraBGL;
    _modelBGL;
    _pipelineCache = new Map();
    _cameraBuffer;
    _cameraBindGroup;
    _modelBuffers = [];
    _modelBindGroups = [];
    _drawItems = [];
    // Pre-allocated staging buffer — reused per draw call to avoid per-frame GC.
    _modelData = new Float32Array(32);
    _cameraScratch = new Float32Array(CAMERA_UNIFORM_SIZE / 4);
    constructor(gbuffer, cameraBGL, modelBGL, cameraBuffer, cameraBindGroup) {
        super();
        this._gbuffer = gbuffer;
        this._cameraBGL = cameraBGL;
        this._modelBGL = modelBGL;
        this._cameraBuffer = cameraBuffer;
        this._cameraBindGroup = cameraBindGroup;
    }
    /**
     * Build the pass's system bind groups and camera buffer. Pipelines are NOT
     * created up front — they are compiled lazily on the first draw of each
     * unique `material.shaderId`.
     *
     * @param ctx Active render context (provides the GPU device).
     * @param gbuffer Target G-buffer whose attachments will receive the rasterised output.
     * @returns A fully initialised `GeometryPass`.
     */
    static create(ctx, gbuffer) {
        const { device } = ctx;
        const cameraBGL = device.createBindGroupLayout({
            label: 'GeomCameraBGL',
            entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
        });
        const modelBGL = device.createBindGroupLayout({
            label: 'GeomModelBGL',
            entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
        });
        const cameraBuffer = device.createBuffer({
            label: 'GeomCameraBuffer',
            size: CAMERA_UNIFORM_SIZE,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        const cameraBindGroup = device.createBindGroup({
            label: 'GeomCameraBindGroup', layout: cameraBGL,
            entries: [{ binding: 0, resource: { buffer: cameraBuffer } }],
        });
        return new GeometryPass(gbuffer, cameraBGL, modelBGL, cameraBuffer, cameraBindGroup);
    }
    /**
     * Replace the list of meshes drawn during the next `execute` call.
     *
     * @param items Draw items in submission order. Per-draw GPU buffers and bind
     *   groups grow on demand to accommodate the largest list seen so far.
     */
    setDrawItems(items) {
        this._drawItems = items;
    }
    /**
     * Upload the per-frame camera uniforms (view, projection, derived matrices and
     * camera position / clip-plane distances) consumed by both the vertex and
     * fragment stages.
     *
     * @param ctx Render context used for queue access.
     * @param view World-to-view matrix.
     * @param proj View-to-clip projection matrix.
     * @param viewProj Pre-multiplied `proj * view`.
     * @param invViewProj Inverse of `viewProj`.
     * @param camPos Camera world-space position.
     * @param near Near clip-plane distance.
     * @param far Far clip-plane distance.
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
    }
    /**
     * Encode the geometry render pass: uploads per-draw model uniforms, asks each
     * material to refresh its uniforms, then issues an indexed draw bound to the
     * G-buffer attachments. Clears all targets at the start of the pass.
     *
     * @param encoder Command encoder to record into.
     * @param ctx Render context (used for the device + queue).
     */
    execute(encoder, ctx) {
        const { device } = ctx;
        this._ensurePerDrawBuffers(device, this._drawItems.length);
        for (let i = 0; i < this._drawItems.length; i++) {
            const item = this._drawItems[i];
            const modelData = this._modelData;
            modelData.set(item.modelMatrix.data, 0);
            modelData.set(item.normalMatrix.data, 16);
            ctx.queue.writeBuffer(this._modelBuffers[i], 0, modelData.buffer);
            item.material.update?.(ctx.queue);
        }
        const pass = encoder.beginRenderPass({
            label: 'GeometryPass',
            colorAttachments: [
                { view: this._gbuffer.albedoRoughnessView, clearValue: [0, 0, 0, 1], loadOp: 'clear', storeOp: 'store' },
                { view: this._gbuffer.normalMetallicView, clearValue: [0, 0, 0, 0], loadOp: 'clear', storeOp: 'store' },
            ],
            depthStencilAttachment: {
                view: this._gbuffer.depthView,
                depthClearValue: 1, depthLoadOp: 'clear', depthStoreOp: 'store',
            },
        });
        pass.setBindGroup(0, this._cameraBindGroup);
        for (let i = 0; i < this._drawItems.length; i++) {
            const item = this._drawItems[i];
            pass.setPipeline(this._getPipeline(device, item.material));
            pass.setBindGroup(1, this._modelBindGroups[i]);
            pass.setBindGroup(2, item.material.getBindGroup(device));
            pass.setVertexBuffer(0, item.mesh.vertexBuffer);
            pass.setIndexBuffer(item.mesh.indexBuffer, 'uint32');
            pass.drawIndexed(item.mesh.indexCount);
        }
        pass.end();
    }
    _getPipeline(device, material) {
        let pipeline = this._pipelineCache.get(material.shaderId);
        if (pipeline) {
            return pipeline;
        }
        const shaderModule = device.createShaderModule({
            label: `GeometryShader[${material.shaderId}]`,
            code: material.getShaderCode(MaterialPassType.Geometry),
        });
        pipeline = device.createRenderPipeline({
            label: `GeometryPipeline[${material.shaderId}]`,
            layout: device.createPipelineLayout({
                bindGroupLayouts: [this._cameraBGL, this._modelBGL, material.getBindGroupLayout(device)],
            }),
            vertex: {
                module: shaderModule, entryPoint: 'vs_main',
                buffers: [{ arrayStride: VERTEX_STRIDE, attributes: VERTEX_ATTRIBUTES }],
            },
            fragment: {
                module: shaderModule, entryPoint: 'fs_main',
                targets: [
                    { format: 'rgba8unorm' }, // albedo+roughness
                    { format: 'rgba16float' }, // normal+metallic
                ],
            },
            depthStencil: { format: 'depth32float', depthWriteEnabled: true, depthCompare: 'less' },
            primitive: { topology: 'triangle-list', cullMode: 'back' },
        });
        this._pipelineCache.set(material.shaderId, pipeline);
        return pipeline;
    }
    _ensurePerDrawBuffers(device, count) {
        while (this._modelBuffers.length < count) {
            const mb = device.createBuffer({ size: MODEL_UNIFORM_SIZE, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
            this._modelBuffers.push(mb);
            this._modelBindGroups.push(device.createBindGroup({ layout: this._modelBGL, entries: [{ binding: 0, resource: { buffer: mb } }] }));
        }
    }
    /**
     * Release the pass-owned camera and per-draw model uniform buffers. Material
     * resources, pipelines and bind groups are GC'd / destroyed by their owners.
     */
    destroy() {
        this._cameraBuffer.destroy();
        for (const b of this._modelBuffers) {
            b.destroy();
        }
    }
}
