// Vertex layout (interleaved, 80 bytes per vertex):
//   position: vec3  (12 bytes)
//   normal:   vec3  (12 bytes)
//   uv:       vec2  ( 8 bytes)
//   tangent:  vec4  (16 bytes)
//   joints:   uvec4 (16 bytes)  — 4 joint indices as u32
//   weights:  vec4  (16 bytes)  — 4 blend weights
export const SKINNED_VERTEX_STRIDE = 80;

export const SKINNED_VERTEX_ATTRIBUTES: GPUVertexAttribute[] = [
  { shaderLocation: 0, offset:  0, format: 'float32x3' }, // position
  { shaderLocation: 1, offset: 12, format: 'float32x3' }, // normal
  { shaderLocation: 2, offset: 24, format: 'float32x2' }, // uv
  { shaderLocation: 3, offset: 32, format: 'float32x4' }, // tangent
  { shaderLocation: 4, offset: 48, format: 'uint32x4'  }, // joints
  { shaderLocation: 5, offset: 64, format: 'float32x4' }, // weights
];

export class SkinnedMesh {
  readonly vertexBuffer: GPUBuffer;
  readonly indexBuffer : GPUBuffer;
  readonly indexCount  : number;

  private constructor(vb: GPUBuffer, ib: GPUBuffer, indexCount: number) {
    this.vertexBuffer = vb;
    this.indexBuffer  = ib;
    this.indexCount   = indexCount;
  }

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

  destroy(): void {
    this.vertexBuffer.destroy();
    this.indexBuffer.destroy();
  }
}
