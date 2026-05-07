/**
 * Byte stride of a `SkinnedMesh` vertex: 80 bytes = position(12) + normal(12) + uv(8) + tangent(16) + joints(16, uvec4) + weights(16).
 */
export const SKINNED_VERTEX_STRIDE = 80;

/**
 * WebGPU vertex attribute layout matching `SKINNED_VERTEX_STRIDE`: position, normal, uv, tangent, joints (uvec4), weights.
 */
export const SKINNED_VERTEX_ATTRIBUTES: GPUVertexAttribute[] = [
  { shaderLocation: 0, offset:  0, format: 'float32x3' }, // position
  { shaderLocation: 1, offset: 12, format: 'float32x3' }, // normal
  { shaderLocation: 2, offset: 24, format: 'float32x2' }, // uv
  { shaderLocation: 3, offset: 32, format: 'float32x4' }, // tangent
  { shaderLocation: 4, offset: 48, format: 'uint32x4'  }, // joints
  { shaderLocation: 5, offset: 64, format: 'float32x4' }, // weights
];

/**
 * GPU mesh with skinning attributes (joint indices and weights) per vertex.
 *
 * Vertex layout matches `SKINNED_VERTEX_STRIDE` / `SKINNED_VERTEX_ATTRIBUTES`.
 * Owns its vertex and index GPU buffers; call `destroy()` to release them.
 */
export class SkinnedMesh {
  readonly vertexBuffer: GPUBuffer;
  readonly indexBuffer : GPUBuffer;
  readonly indexCount  : number;

  private constructor(vb: GPUBuffer, ib: GPUBuffer, indexCount: number) {
    this.vertexBuffer = vb;
    this.indexBuffer  = ib;
    this.indexCount   = indexCount;
  }

  /**
   * Creates a skinned mesh from interleaved vertex data and 32-bit indices.
   *
   * @param device - The WebGPU device.
   * @param vertices - Interleaved vertex data laid out per `SKINNED_VERTEX_ATTRIBUTES` (20 floats per vertex; joint indices reinterpreted as `u32`).
   * @param indices - Triangle list indices.
   * @returns A new skinned mesh owning the uploaded GPU buffers.
   */
  static fromData(device: GPUDevice, vertices: Float32Array, indices: Uint32Array): SkinnedMesh {
    const vb = device.createBuffer({
      label: 'SkinnedMesh VertexBuffer',
      size: vertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(vb, 0, vertices.buffer as ArrayBuffer, vertices.byteOffset, vertices.byteLength);

    const ib = device.createBuffer({
      label: 'SkinnedMesh IndexBuffer',
      size: indices.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(ib, 0, indices.buffer as ArrayBuffer, indices.byteOffset, indices.byteLength);

    return new SkinnedMesh(vb, ib, indices.length);
  }

  /** Destroys the underlying GPU vertex and index buffers. */
  destroy(): void {
    this.vertexBuffer.destroy();
    this.indexBuffer.destroy();
  }
}
