import { RenderPass } from '../render_pass.js';
import { SKINNED_VERTEX_ATTRIBUTES, SKINNED_VERTEX_STRIDE } from '../../assets/skinned_mesh.js';
import { MaterialPassType } from '../material.js';
const CAMERA_UNIFORM_SIZE = 64 * 4 + 16 + 16;
const MODEL_UNIFORM_SIZE = 128;
/**
 * Geometry pass for skinned (animated) meshes.
 *
 * Performs GPU skinning in the vertex shader using a per-mesh joint matrix storage
 * buffer, then writes albedo+roughness and normal+metallic into the GBuffer (loading
 * existing contents so it composites with prior geometry passes). Each draw supplies
 * its own {@link Material}; pipelines are cached per `material.shaderId` so many
 * materials sharing a shader share one pipeline.
 */
export class SkinnedGeometryPass extends RenderPass {
    name = 'SkinnedGeometryPass';
    _gbuffer;
    _cameraBGL;
    // Group 1 combines model uniforms (binding 0) + joint matrices (binding 1)
    _modelJointBGL;
    _pipelineCache = new Map();
    _cameraBuffer;
    _cameraBindGroup;
    _modelBuffers = [];
    _jointBuffers = [];
    _jointBufferSizes = [];
    _modelJointBindGroups = [];
    _drawItems = [];
    // Pre-allocated staging buffer — reused per draw call to avoid per-frame GC.
    _modelData = new Float32Array(32);
    _cameraScratch = new Float32Array(CAMERA_UNIFORM_SIZE / 4);
    constructor(gbuffer, cameraBGL, modelJointBGL, cameraBuffer, cameraBindGroup) {
        super();
        this._gbuffer = gbuffer;
        this._cameraBGL = cameraBGL;
        this._modelJointBGL = modelJointBGL;
        this._cameraBuffer = cameraBuffer;
        this._cameraBindGroup = cameraBindGroup;
    }
    /**
     * Creates the camera uniform, the bind group layouts for model+joints, and
     * the camera bind group. Pipelines are NOT created up front — they are
     * compiled lazily on the first draw of each unique `material.shaderId`.
     */
    static create(ctx, gbuffer) {
        const { device } = ctx;
        const cameraBGL = device.createBindGroupLayout({
            label: 'SkinnedGeomCameraBGL',
            entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
        });
        // Group 1: model uniform (b0) + joint matrices storage (b1)
        const modelJointBGL = device.createBindGroupLayout({
            label: 'SkinnedGeomModelJointBGL',
            entries: [
                { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
                { binding: 1, visibility: GPUShaderStage.VERTEX, buffer: { type: 'read-only-storage' } },
            ],
        });
        const cameraBuffer = device.createBuffer({
            label: 'SkinnedGeomCameraBuffer',
            size: CAMERA_UNIFORM_SIZE,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        const cameraBindGroup = device.createBindGroup({
            label: 'SkinnedGeomCameraBG', layout: cameraBGL,
            entries: [{ binding: 0, resource: { buffer: cameraBuffer } }],
        });
        return new SkinnedGeometryPass(gbuffer, cameraBGL, modelJointBGL, cameraBuffer, cameraBindGroup);
    }
    /**
     * Replaces the list of skinned mesh draws to render in the next {@link execute}.
     */
    setDrawItems(items) {
        this._drawItems = items;
    }
    /**
     * Uploads the per-frame camera matrices, world-space camera position, and near/far
     * planes into the camera uniform buffer.
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
     * For every skinned draw item, uploads the model+normal matrices and the joint
     * matrix array (recreating the storage buffer if the joint count grew), asks
     * each material to refresh its uniforms, then renders into the GBuffer (loading
     * existing albedo/normal/depth).
     */
    execute(encoder, ctx) {
        if (this._drawItems.length === 0) {
            return;
        }
        const { device } = ctx;
        this._ensurePerDrawBuffers(device, this._drawItems.length);
        for (let i = 0; i < this._drawItems.length; i++) {
            const item = this._drawItems[i];
            const modelData = this._modelData;
            modelData.set(item.modelMatrix.data, 0);
            modelData.set(item.normalMatrix.data, 16);
            ctx.queue.writeBuffer(this._modelBuffers[i], 0, modelData.buffer);
            item.material.update?.(ctx.queue);
            // Upload joint matrices, recreating storage buffer and bind group if size changed
            const jBytes = item.jointMatrices.byteLength;
            if (this._jointBufferSizes[i] < jBytes || !this._jointBuffers[i]) {
                this._jointBuffers[i]?.destroy();
                const buf = device.createBuffer({
                    label: `SkinnedGeomJointBuffer[${i}]`,
                    size: Math.max(jBytes, 64),
                    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
                });
                this._jointBuffers[i] = buf;
                this._jointBufferSizes[i] = jBytes;
                this._modelJointBindGroups[i] = device.createBindGroup({
                    label: `SkinnedGeomModelJointBG[${i}]`, layout: this._modelJointBGL,
                    entries: [
                        { binding: 0, resource: { buffer: this._modelBuffers[i] } },
                        { binding: 1, resource: { buffer: buf } },
                    ],
                });
            }
            ctx.queue.writeBuffer(this._jointBuffers[i], 0, item.jointMatrices.buffer, item.jointMatrices.byteOffset, jBytes);
        }
        const pass = encoder.beginRenderPass({
            label: 'SkinnedGeometryPass',
            colorAttachments: [
                { view: this._gbuffer.albedoRoughnessView, loadOp: 'load', storeOp: 'store' },
                { view: this._gbuffer.normalMetallicView, loadOp: 'load', storeOp: 'store' },
            ],
            depthStencilAttachment: {
                view: this._gbuffer.depthView,
                depthLoadOp: 'load', depthStoreOp: 'store',
            },
        });
        pass.setBindGroup(0, this._cameraBindGroup);
        for (let i = 0; i < this._drawItems.length; i++) {
            const item = this._drawItems[i];
            pass.setPipeline(this._getPipeline(device, item.material));
            pass.setBindGroup(1, this._modelJointBindGroups[i]);
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
            label: `SkinnedGeometryShader[${material.shaderId}]`,
            code: material.getShaderCode(MaterialPassType.SkinnedGeometry),
        });
        pipeline = device.createRenderPipeline({
            label: `SkinnedGeometryPipeline[${material.shaderId}]`,
            layout: device.createPipelineLayout({
                bindGroupLayouts: [this._cameraBGL, this._modelJointBGL, material.getBindGroupLayout(device)],
            }),
            vertex: {
                module: shaderModule, entryPoint: 'vs_main',
                buffers: [{ arrayStride: SKINNED_VERTEX_STRIDE, attributes: SKINNED_VERTEX_ATTRIBUTES }],
            },
            fragment: {
                module: shaderModule, entryPoint: 'fs_main',
                targets: [{ format: 'rgba8unorm' }, { format: 'rgba16float' }],
            },
            depthStencil: { format: 'depth32float', depthWriteEnabled: true, depthCompare: 'less' },
            primitive: { topology: 'triangle-list', cullMode: 'none' },
        });
        this._pipelineCache.set(material.shaderId, pipeline);
        return pipeline;
    }
    _ensurePerDrawBuffers(device, count) {
        while (this._modelBuffers.length < count) {
            const mb = device.createBuffer({ size: MODEL_UNIFORM_SIZE, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
            this._modelBuffers.push(mb);
            // Joint buffer and combined bind group are created lazily in execute()
            this._jointBuffers.push(null);
            this._jointBufferSizes.push(0);
            this._modelJointBindGroups.push(null);
        }
    }
    /**
     * Releases the camera, model, and joint buffers. Material-owned resources,
     * pipelines, and bind groups are GC'd / destroyed by their owners.
     */
    destroy() {
        this._cameraBuffer.destroy();
        for (const b of this._modelBuffers) {
            b.destroy();
        }
        for (const b of this._jointBuffers) {
            b?.destroy();
        }
    }
}
