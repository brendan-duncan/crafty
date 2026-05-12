import { RenderPass } from '../render_pass.js';
import { blockTextureOffsetData, BlockType, BLOCK_ATLAS_WIDTH_DIVIDED } from '../../block/block_type.js';
import chunkGeometryWgsl from '../../shaders/chunk_geometry.wgsl?raw';
const CAMERA_UNIFORM_SIZE = 64 * 4 + 16 + 16; // 4 mat4 + vec3+f32 + f32+pad = 288 bytes
const BLOCK_DATA_STRIDE = 16; // 4 u32s: sideTile, bottomTile, topTile, pad
const CHUNK_UNIFORM_ALIGNMENT = 256; // minUniformBufferOffsetAlignment (WebGPU spec max)
const MAX_CHUNK_SLOTS = 2048; // World.MAX_CHUNKS + generous headroom
const FLOATS_PER_VERT = 5;
const BYTES_PER_VERT = FLOATS_PER_VERT * 4;
const CHUNK_SIZE = 16; // CHUNK_WIDTH = CHUNK_HEIGHT = CHUNK_DEPTH
/**
 * G-buffer fill pass for voxel world chunks. Rasterises opaque, transparent and
 * "prop" (foliage / cross-quad) chunk geometry into the same albedo+roughness /
 * normal+metallic / depth attachments used by `GeometryPass`.
 *
 * Owns per-chunk vertex buffers and a shared dynamic-offset uniform buffer that
 * stores chunk world origins. Performs CPU-side frustum culling each frame using
 * planes extracted from the view-projection matrix. Tracks `drawCalls` and
 * `triangles` for HUD / debug overlays.
 */
export class WorldGeometryPass extends RenderPass {
    name = 'WorldGeometryPass';
    _gbuffer;
    _device;
    _opaquePipeline;
    _transparentPipeline;
    _propPipeline;
    _cameraBuffer;
    _cameraBindGroup;
    _sharedBindGroup;
    _chunkUniformBuffer;
    _chunkBindGroup;
    _slotFreeList = [];
    _slotHighWater = 0;
    _chunks = new Map();
    _frustumPlanes = new Float32Array(24); // 6 planes × (A,B,C,D)
    /** Number of draw calls issued during the most recent `execute`. */
    drawCalls = 0;
    /** Triangle count submitted during the most recent `execute`. */
    triangles = 0;
    _cameraData = new Float32Array(CAMERA_UNIFORM_SIZE / 4);
    _chunkUniformAB = new ArrayBuffer(32);
    _chunkUniformF = new Float32Array(this._chunkUniformAB);
    _chunkUniformU = new Uint32Array(this._chunkUniformAB);
    _debugChunks = false;
    constructor(device, gbuffer, opaquePipeline, transparentPipeline, propPipeline, cameraBuffer, cameraBindGroup, sharedBindGroup, chunkUniformBuffer, chunkBindGroup) {
        super();
        this._device = device;
        this._gbuffer = gbuffer;
        this._opaquePipeline = opaquePipeline;
        this._transparentPipeline = transparentPipeline;
        this._propPipeline = propPipeline;
        this._cameraBuffer = cameraBuffer;
        this._cameraBindGroup = cameraBindGroup;
        this._sharedBindGroup = sharedBindGroup;
        this._chunkUniformBuffer = chunkUniformBuffer;
        this._chunkBindGroup = chunkBindGroup;
    }
    /**
     * Build the pass: bind group layouts, the three render pipelines (opaque,
     * transparent, prop), the shared atlas+block-data bind group and the dynamic
     * chunk-uniform buffer.
     *
     * @param ctx Render context (provides the GPU device).
     * @param gbuffer Target G-buffer whose attachments will be loaded and written.
     * @param blockTexture Block atlas (colour, normal, MER) sampled by chunk pixels.
     * @returns A configured `WorldGeometryPass`.
     */
    static create(ctx, gbuffer, blockTexture) {
        const { device } = ctx;
        const cameraBGL = device.createBindGroupLayout({
            label: 'ChunkCameraBGL',
            entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
        });
        const sharedBGL = device.createBindGroupLayout({
            label: 'ChunkSharedBGL',
            entries: [
                { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } }, // color atlas
                { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } }, // normal atlas
                { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } }, // MER atlas
                { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
                { binding: 4, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'read-only-storage' } }, // block data
            ],
        });
        const chunkBGL = device.createBindGroupLayout({
            label: 'ChunkOffsetBGL',
            entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform', hasDynamicOffset: true, minBindingSize: 32 } }],
        });
        // Build block data storage buffer: 4 u32s per block type (sideTile, bottomTile, topTile, pad)
        const numBlocks = BlockType.MAX;
        const blockDataBuf = device.createBuffer({
            label: 'BlockDataBuffer',
            size: Math.max(numBlocks * BLOCK_DATA_STRIDE, 16),
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });
        const COLS = BLOCK_ATLAS_WIDTH_DIVIDED; // 25
        const blockArr = new Uint32Array(numBlocks * 4);
        for (let bt = 0; bt < numBlocks; bt++) {
            const tod = blockTextureOffsetData[bt];
            if (tod) {
                blockArr[bt * 4 + 0] = tod.sideFace.y * COLS + tod.sideFace.x;
                blockArr[bt * 4 + 1] = tod.bottomFace.y * COLS + tod.bottomFace.x;
                blockArr[bt * 4 + 2] = tod.topFace.y * COLS + tod.topFace.x;
            }
        }
        device.queue.writeBuffer(blockDataBuf, 0, blockArr);
        const atlasSampler = device.createSampler({
            label: 'ChunkAtlasSampler',
            magFilter: 'nearest', minFilter: 'nearest',
            addressModeU: 'repeat', addressModeV: 'repeat',
        });
        const sharedBindGroup = device.createBindGroup({
            label: 'ChunkSharedBG',
            layout: sharedBGL,
            entries: [
                { binding: 0, resource: blockTexture.colorAtlas.view },
                { binding: 1, resource: blockTexture.normalAtlas.view },
                { binding: 2, resource: blockTexture.merAtlas.view },
                { binding: 3, resource: atlasSampler },
                { binding: 4, resource: { buffer: blockDataBuf } },
            ],
        });
        const cameraBuffer = device.createBuffer({
            label: 'ChunkCameraBuffer',
            size: CAMERA_UNIFORM_SIZE,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        const cameraBindGroup = device.createBindGroup({
            label: 'ChunkCameraBG',
            layout: cameraBGL,
            entries: [{ binding: 0, resource: { buffer: cameraBuffer } }],
        });
        const shader = device.createShaderModule({ label: 'ChunkGeometryShader', code: chunkGeometryWgsl });
        const layout = device.createPipelineLayout({ bindGroupLayouts: [cameraBGL, sharedBGL, chunkBGL] });
        const vertexLayout = {
            arrayStride: BYTES_PER_VERT,
            attributes: [
                { shaderLocation: 0, offset: 0, format: 'float32x3' }, // position
                { shaderLocation: 1, offset: 12, format: 'float32' }, // face
                { shaderLocation: 2, offset: 16, format: 'float32' }, // blockType
            ],
        };
        const colorTargets = [
            { format: 'rgba8unorm' }, // albedo + roughness
            { format: 'rgba16float' }, // normal + metallic
        ];
        const opaquePipeline = device.createRenderPipeline({
            label: 'ChunkOpaquePipeline',
            layout,
            vertex: { module: shader, entryPoint: 'vs_main', buffers: [vertexLayout] },
            fragment: { module: shader, entryPoint: 'fs_opaque', targets: colorTargets },
            depthStencil: { format: 'depth32float', depthWriteEnabled: true, depthCompare: 'less' },
            primitive: { topology: 'triangle-list', cullMode: 'back' },
        });
        const transparentPipeline = device.createRenderPipeline({
            label: 'ChunkTransparentPipeline',
            layout,
            vertex: { module: shader, entryPoint: 'vs_main', buffers: [vertexLayout] },
            fragment: { module: shader, entryPoint: 'fs_transparent', targets: colorTargets },
            depthStencil: { format: 'depth32float', depthWriteEnabled: true, depthCompare: 'less' },
            primitive: { topology: 'triangle-list', cullMode: 'back' },
        });
        const propPipeline = device.createRenderPipeline({
            label: 'ChunkPropPipeline',
            layout,
            vertex: { module: shader, entryPoint: 'vs_prop', buffers: [vertexLayout] },
            fragment: { module: shader, entryPoint: 'fs_prop', targets: colorTargets },
            depthStencil: { format: 'depth32float', depthWriteEnabled: true, depthCompare: 'less' },
            primitive: { topology: 'triangle-list', cullMode: 'none' },
        });
        const chunkUniformBuffer = device.createBuffer({
            label: 'ChunkUniformBuffer',
            size: MAX_CHUNK_SLOTS * CHUNK_UNIFORM_ALIGNMENT,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        const chunkBindGroup = device.createBindGroup({
            label: 'ChunkOffsetBG',
            layout: chunkBGL,
            entries: [{ binding: 0, resource: { buffer: chunkUniformBuffer, size: 32 } }],
        });
        return new WorldGeometryPass(device, gbuffer, opaquePipeline, transparentPipeline, propPipeline, cameraBuffer, cameraBindGroup, sharedBindGroup, chunkUniformBuffer, chunkBindGroup);
    }
    /**
     * Replace the G-buffer the pass renders into (e.g. after a window resize).
     *
     * @param gbuffer New G-buffer to bind for subsequent `execute` calls.
     */
    updateGBuffer(gbuffer) {
        this._gbuffer = gbuffer;
    }
    /**
     * Register a chunk and upload its mesh data. If the chunk is already tracked,
     * its existing GPU buffers are replaced.
     *
     * @param chunk Logical chunk used as the lookup key.
     * @param mesh Generated geometry for the chunk's opaque, transparent and prop layers.
     */
    addChunk(chunk, mesh) {
        const existing = this._chunks.get(chunk);
        if (existing) {
            this._replaceMeshBuffers(existing, mesh);
        }
        else {
            this._chunks.set(chunk, this._createChunkGpu(chunk, mesh));
        }
    }
    /**
     * Replace the GPU mesh data for a tracked chunk, or register it if new.
     *
     * @param chunk Logical chunk used as the lookup key.
     * @param mesh New geometry for the chunk.
     */
    updateChunk(chunk, mesh) {
        const existing = this._chunks.get(chunk);
        if (existing) {
            this._replaceMeshBuffers(existing, mesh);
        }
        else {
            this._chunks.set(chunk, this._createChunkGpu(chunk, mesh));
        }
    }
    /**
     * Drop a tracked chunk: destroys its vertex buffers and frees its slot in the
     * shared chunk uniform buffer. No-op if the chunk is unknown.
     *
     * @param chunk Logical chunk to remove.
     */
    removeChunk(chunk) {
        const gpuData = this._chunks.get(chunk);
        if (!gpuData) {
            return;
        }
        gpuData.opaqueBuffer?.destroy();
        gpuData.transparentBuffer?.destroy();
        gpuData.propBuffer?.destroy();
        this._freeSlot(gpuData.slot);
        this._chunks.delete(chunk);
    }
    /**
     * Upload per-frame camera state and recompute the cached frustum planes used
     * for chunk culling.
     *
     * @param ctx Render context for queue access.
     * @param view World-to-view matrix.
     * @param proj View-to-clip matrix.
     * @param viewProj Pre-multiplied `proj * view`; also used for plane extraction.
     * @param invViewProj Inverse of `viewProj`.
     * @param camPos Camera world-space position.
     * @param near Near clip-plane distance.
     * @param far Far clip-plane distance.
     */
    updateCamera(ctx, view, proj, viewProj, invViewProj, camPos, near, far) {
        const data = this._cameraData;
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
    // Gribb/Hartmann plane extraction from a column-major VP matrix.
    // Planes are in the form Ax+By+Cz+D >= 0 for points inside the frustum.
    // WebGPU clip space: x/y in [-1,1], z in [0,1].
    _extractFrustumPlanes(m) {
        const p = this._frustumPlanes;
        // Row i of a column-major 4×4: data[0*4+i], data[1*4+i], data[2*4+i], data[3*4+i]
        // Left:   row3 + row0
        p[0] = m[3] + m[0];
        p[1] = m[7] + m[4];
        p[2] = m[11] + m[8];
        p[3] = m[15] + m[12];
        // Right:  row3 - row0
        p[4] = m[3] - m[0];
        p[5] = m[7] - m[4];
        p[6] = m[11] - m[8];
        p[7] = m[15] - m[12];
        // Bottom: row3 + row1
        p[8] = m[3] + m[1];
        p[9] = m[7] + m[5];
        p[10] = m[11] + m[9];
        p[11] = m[15] + m[13];
        // Top:    row3 - row1
        p[12] = m[3] - m[1];
        p[13] = m[7] - m[5];
        p[14] = m[11] - m[9];
        p[15] = m[15] - m[13];
        // Near:   row2  (WebGPU z >= 0)
        p[16] = m[2];
        p[17] = m[6];
        p[18] = m[10];
        p[19] = m[14];
        // Far:    row3 - row2
        p[20] = m[3] - m[2];
        p[21] = m[7] - m[6];
        p[22] = m[11] - m[10];
        p[23] = m[15] - m[14];
    }
    /**
     * Toggle per-chunk debug colourisation. When enabled, each chunk is shaded
     * with a deterministic colour derived from its world position to make chunk
     * boundaries visible. Re-uploads every tracked chunk's uniforms.
     *
     * @param enabled Whether the debug colour overlay is on.
     */
    setDebugChunks(enabled) {
        if (this._debugChunks === enabled) {
            return;
        }
        this._debugChunks = enabled;
        // Update all existing chunk uniforms
        for (const [_chunk, gpu] of this._chunks) {
            this._writeChunkUniforms(gpu.slot, gpu.ox, gpu.oy, gpu.oz);
        }
    }
    _isVisible(ox, oy, oz) {
        const p = this._frustumPlanes;
        const mx = ox + CHUNK_SIZE, my = oy + CHUNK_SIZE, mz = oz + CHUNK_SIZE;
        for (let i = 0; i < 6; i++) {
            const a = p[i * 4], b = p[i * 4 + 1], c = p[i * 4 + 2], d = p[i * 4 + 3];
            // Positive vertex: the corner most in the direction of the plane normal.
            if (a * (a >= 0 ? mx : ox) + b * (b >= 0 ? my : oy) + c * (c >= 0 ? mz : oz) + d < 0) {
                return false;
            }
        }
        return true;
    }
    /**
     * Encode the world geometry pass: load existing G-buffer attachments, frustum-cull
     * chunks, then run the opaque, transparent and prop pipelines in turn over the
     * surviving set. Updates `drawCalls` and `triangles` for the frame.
     *
     * @param encoder Command encoder to record into.
     * @param _ctx Render context (unused; kept for the `RenderPass` interface).
     */
    execute(encoder, _ctx) {
        const pass = encoder.beginRenderPass({
            label: 'WorldGeometryPass',
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
        pass.setBindGroup(1, this._sharedBindGroup);
        let dc = 0, tris = 0;
        // Collect visible chunks once — reused across all three pipeline passes.
        const visible = [];
        for (const gpuData of this._chunks.values()) {
            if (this._isVisible(gpuData.ox, gpuData.oy, gpuData.oz)) {
                visible.push(gpuData);
            }
        }
        pass.setPipeline(this._opaquePipeline);
        for (const gpuData of visible) {
            if (gpuData.opaqueBuffer && gpuData.opaqueCount > 0) {
                pass.setBindGroup(2, this._chunkBindGroup, [gpuData.slot * CHUNK_UNIFORM_ALIGNMENT]);
                pass.setVertexBuffer(0, gpuData.opaqueBuffer);
                pass.draw(gpuData.opaqueCount);
                dc++;
                tris += gpuData.opaqueCount / 3;
            }
        }
        pass.setPipeline(this._transparentPipeline);
        for (const gpuData of visible) {
            if (gpuData.transparentBuffer && gpuData.transparentCount > 0) {
                pass.setBindGroup(2, this._chunkBindGroup, [gpuData.slot * CHUNK_UNIFORM_ALIGNMENT]);
                pass.setVertexBuffer(0, gpuData.transparentBuffer);
                pass.draw(gpuData.transparentCount);
                dc++;
                tris += gpuData.transparentCount / 3;
            }
        }
        pass.setPipeline(this._propPipeline);
        for (const gpuData of visible) {
            if (gpuData.propBuffer && gpuData.propCount > 0) {
                pass.setBindGroup(2, this._chunkBindGroup, [gpuData.slot * CHUNK_UNIFORM_ALIGNMENT]);
                pass.setVertexBuffer(0, gpuData.propBuffer);
                pass.draw(gpuData.propCount);
                dc++;
                tris += gpuData.propCount / 3;
            }
        }
        this.drawCalls = dc;
        this.triangles = tris;
        pass.end();
    }
    /**
     * Release every GPU resource owned by the pass: camera/chunk uniform buffers
     * and every per-chunk vertex buffer. Clears the chunk registry.
     */
    destroy() {
        this._cameraBuffer.destroy();
        this._chunkUniformBuffer.destroy();
        for (const gpuData of this._chunks.values()) {
            gpuData.opaqueBuffer?.destroy();
            gpuData.transparentBuffer?.destroy();
            gpuData.propBuffer?.destroy();
        }
        this._chunks.clear();
    }
    _allocSlot() {
        return this._slotFreeList.length > 0
            ? this._slotFreeList.pop()
            : this._slotHighWater++;
    }
    _freeSlot(slot) {
        this._slotFreeList.push(slot);
    }
    _writeChunkUniforms(slot, cx, cy, cz) {
        // Generate a deterministic random color based on chunk position
        const hash = (cx * 73856093) ^ (cy * 19349663) ^ (cz * 83492791);
        const r = ((hash & 0xFF) / 255.0) * 0.6 + 0.4;
        const g = (((hash >> 8) & 0xFF) / 255.0) * 0.6 + 0.4;
        const b = (((hash >> 16) & 0xFF) / 255.0) * 0.6 + 0.4;
        const buf = this._chunkUniformAB;
        const f = this._chunkUniformF;
        const u = this._chunkUniformU;
        f[0] = cx;
        f[1] = cy;
        f[2] = cz;
        u[3] = this._debugChunks ? 1 : 0;
        f[4] = r;
        f[5] = g;
        f[6] = b;
        f[7] = 0;
        this._device.queue.writeBuffer(this._chunkUniformBuffer, slot * CHUNK_UNIFORM_ALIGNMENT, buf);
    }
    _createChunkGpu(chunk, mesh) {
        const slot = this._allocSlot();
        this._writeChunkUniforms(slot, chunk.globalPosition.x, chunk.globalPosition.y, chunk.globalPosition.z);
        const gpuData = {
            ox: chunk.globalPosition.x,
            oy: chunk.globalPosition.y,
            oz: chunk.globalPosition.z,
            slot,
            opaqueBuffer: null,
            opaqueCount: 0,
            transparentBuffer: null,
            transparentCount: 0,
            propBuffer: null,
            propCount: 0,
        };
        this._replaceMeshBuffers(gpuData, mesh);
        return gpuData;
    }
    _replaceMeshBuffers(gpuData, mesh) {
        gpuData.opaqueBuffer?.destroy();
        gpuData.transparentBuffer?.destroy();
        gpuData.propBuffer?.destroy();
        gpuData.opaqueBuffer = null;
        gpuData.transparentBuffer = null;
        gpuData.propBuffer = null;
        gpuData.opaqueCount = mesh.opaqueCount;
        gpuData.transparentCount = mesh.transparentCount;
        gpuData.propCount = mesh.propCount;
        if (mesh.opaqueCount > 0) {
            const buf = this._device.createBuffer({
                label: 'ChunkOpaqueBuf',
                size: mesh.opaqueCount * BYTES_PER_VERT,
                usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            });
            this._device.queue.writeBuffer(buf, 0, mesh.opaque.buffer, 0, mesh.opaqueCount * BYTES_PER_VERT);
            gpuData.opaqueBuffer = buf;
        }
        if (mesh.transparentCount > 0) {
            const buf = this._device.createBuffer({
                label: 'ChunkTransparentBuf',
                size: mesh.transparentCount * BYTES_PER_VERT,
                usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            });
            this._device.queue.writeBuffer(buf, 0, mesh.transparent.buffer, 0, mesh.transparentCount * BYTES_PER_VERT);
            gpuData.transparentBuffer = buf;
        }
        if (mesh.propCount > 0) {
            const buf = this._device.createBuffer({
                label: 'ChunkPropBuf',
                size: mesh.propCount * BYTES_PER_VERT,
                usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            });
            this._device.queue.writeBuffer(buf, 0, mesh.prop.buffer, 0, mesh.propCount * BYTES_PER_VERT);
            gpuData.propBuffer = buf;
        }
    }
}
