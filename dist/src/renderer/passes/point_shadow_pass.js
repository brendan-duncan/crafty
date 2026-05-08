import { RenderPass } from '../render_pass.js';
import { VERTEX_ATTRIBUTES, VERTEX_STRIDE } from '../../assets/mesh.js';
import shadowCubeWgsl from '../../shaders/shadow_cube.wgsl?raw';
const CAMERA_UNIFORM_SIZE = 80; // mat4 (64) + vec3 lightPos (12) + f32 farPlane (4)
const MODEL_UNIFORM_SIZE = 64;
/**
 * Renders depth-only shadows for a single point light into a cube map.
 *
 * Performs six render passes, one per cube face, each using a per-face view-projection
 * matrix supplied via {@link PointShadowPass.updateCamera}. The vertex shader y-flips
 * the output, so triangles are front-face culled to keep correct winding.
 */
export class PointShadowPass extends RenderPass {
    name = 'PointShadowPass';
    _pipeline;
    _modelBGL;
    _cameraBuffers;
    _cameraBindGroups;
    _cameraInitialized = false;
    _modelBuffers = [];
    _modelBindGroups = [];
    _drawItems = [];
    _shadowCubeFaceViews = [];
    _modelData = new Float32Array(16);
    constructor(pipeline, modelBGL, cameraBuffers, cameraBindGroups, shadowCubeFaceViews) {
        super();
        this._pipeline = pipeline;
        this._modelBGL = modelBGL;
        this._cameraBuffers = cameraBuffers;
        this._cameraBindGroups = cameraBindGroups;
        this._shadowCubeFaceViews = shadowCubeFaceViews;
    }
    /**
     * Creates the depth-only render pipeline and the per-face camera uniform buffers
     * (six in total) plus their bind groups, and builds 2D views into each face of the
     * supplied shadow cube texture starting at `baseArrayLayer`.
     *
     * @param ctx - The render context owning the GPU device.
     * @param shadowCubeTexture - A cube (or cube-array) depth texture to write into.
     * @param baseArrayLayer - First array layer of the cube within `shadowCubeTexture`.
     */
    static create(ctx, shadowCubeTexture, baseArrayLayer = 0) {
        const { device } = ctx;
        // Create views for each cube face
        const shadowCubeFaceViews = [];
        for (let i = 0; i < 6; i++) {
            shadowCubeFaceViews.push(shadowCubeTexture.createView({
                dimension: '2d',
                baseArrayLayer: baseArrayLayer + i,
                arrayLayerCount: 1,
            }));
        }
        const cameraBGL = device.createBindGroupLayout({
            label: 'PointShadowCameraBGL',
            entries: [
                { binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
            ],
        });
        const modelBGL = device.createBindGroupLayout({
            label: 'PointShadowModelBGL',
            entries: [
                { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
            ],
        });
        // One camera buffer/bind group per cube face so each render pass binds the
        // correct view-projection matrix.
        const cameraBuffers = [];
        const cameraBindGroups = [];
        for (let i = 0; i < 6; i++) {
            const buffer = device.createBuffer({
                label: `PointShadowCameraBuffer_Face${i}`,
                size: CAMERA_UNIFORM_SIZE,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });
            cameraBuffers.push(buffer);
            cameraBindGroups.push(device.createBindGroup({
                label: `PointShadowCameraBindGroup_Face${i}`,
                layout: cameraBGL,
                entries: [{ binding: 0, resource: { buffer } }],
            }));
        }
        const shaderModule = device.createShaderModule({
            label: 'PointShadowShader',
            code: shadowCubeWgsl,
        });
        const pipeline = device.createRenderPipeline({
            label: 'PointShadowPipeline',
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
                // Y-flip in the vertex shader reverses triangle winding, so cull the
                // opposite side to keep "front faces are rendered" semantics.
                cullMode: 'front',
            },
        });
        return new PointShadowPass(pipeline, modelBGL, cameraBuffers, cameraBindGroups, shadowCubeFaceViews);
    }
    /**
     * Replaces the list of meshes to render into all six cube faces this frame.
     */
    setDrawItems(items) {
        this._drawItems = items;
    }
    /**
     * Uploads the six per-face view-projection matrices, the light world position, and the
     * far-plane distance into the per-face camera uniform buffers.
     *
     * @param viewProjections - Length-6 array of cube-face view-projection matrices.
     */
    updateCamera(ctx, lightPosition, viewProjections, farPlane) {
        const data = new Float32Array(CAMERA_UNIFORM_SIZE / 4);
        for (let face = 0; face < 6; face++) {
            data.set(viewProjections[face].data, 0);
            data[16] = lightPosition.x;
            data[17] = lightPosition.y;
            data[18] = lightPosition.z;
            data[19] = farPlane;
            ctx.queue.writeBuffer(this._cameraBuffers[face], 0, data);
        }
        this._cameraInitialized = true;
    }
    /**
     * Uploads per-mesh model matrices, then renders the current draw items into each of
     * the six cube faces in turn (depth-only, clearing depth between passes). No-op
     * until {@link PointShadowPass.updateCamera} has been called at least once.
     */
    execute(encoder, ctx) {
        if (!this._cameraInitialized) {
            return;
        }
        this._ensureModelBuffers(ctx.device, this._drawItems.length);
        // Write all model matrices
        for (let i = 0; i < this._drawItems.length; i++) {
            const item = this._drawItems[i];
            this._modelData.set(item.modelMatrix.data, 0);
            ctx.queue.writeBuffer(this._modelBuffers[i], 0, this._modelData);
        }
        // Render to each cube face with the matching per-face camera bind group
        for (let face = 0; face < 6; face++) {
            const pass = encoder.beginRenderPass({
                label: `PointShadowPass_Face${face}`,
                colorAttachments: [],
                depthStencilAttachment: {
                    view: this._shadowCubeFaceViews[face],
                    depthClearValue: 1.0,
                    depthLoadOp: 'clear',
                    depthStoreOp: 'store',
                },
            });
            pass.setPipeline(this._pipeline);
            pass.setBindGroup(0, this._cameraBindGroups[face]);
            for (let i = 0; i < this._drawItems.length; i++) {
                const item = this._drawItems[i];
                pass.setBindGroup(1, this._modelBindGroups[i]);
                pass.setVertexBuffer(0, item.mesh.vertexBuffer);
                pass.setIndexBuffer(item.mesh.indexBuffer, 'uint32');
                pass.drawIndexed(item.mesh.indexCount);
            }
            pass.end();
        }
    }
    _ensureModelBuffers(device, count) {
        while (this._modelBuffers.length < count) {
            const idx = this._modelBuffers.length;
            const buffer = device.createBuffer({
                label: `PointShadowModelBuffer${idx}`,
                size: MODEL_UNIFORM_SIZE,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });
            this._modelBuffers.push(buffer);
            const bindGroup = device.createBindGroup({
                label: `PointShadowModelBG${idx}`,
                layout: this._modelBGL,
                entries: [{ binding: 0, resource: { buffer } }],
            });
            this._modelBindGroups.push(bindGroup);
        }
    }
    /**
     * Releases all per-face camera buffers and the model uniform buffer pool.
     */
    destroy() {
        for (const buffer of this._cameraBuffers) {
            buffer.destroy();
        }
        for (const buffer of this._modelBuffers) {
            buffer.destroy();
        }
    }
}
