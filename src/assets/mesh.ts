// Vertex layout (interleaved, 48 bytes per vertex):
//   position: vec3  (12 bytes)
//   normal:   vec3  (12 bytes)
//   uv:       vec2  ( 8 bytes)
//   tangent:  vec4  (16 bytes)
export const VERTEX_STRIDE = 48;

export const VERTEX_ATTRIBUTES: GPUVertexAttribute[] = [
  { shaderLocation: 0, offset: 0,  format: 'float32x3' }, // position
  { shaderLocation: 1, offset: 12, format: 'float32x3' }, // normal
  { shaderLocation: 2, offset: 24, format: 'float32x2' }, // uv
  { shaderLocation: 3, offset: 32, format: 'float32x4' }, // tangent
];

export class Mesh {
  readonly vertexBuffer: GPUBuffer;
  readonly indexBuffer: GPUBuffer;
  readonly indexCount: number;

  private constructor(vertexBuffer: GPUBuffer, indexBuffer: GPUBuffer, indexCount: number) {
    this.vertexBuffer = vertexBuffer;
    this.indexBuffer = indexBuffer;
    this.indexCount = indexCount;
  }

  destroy(): void {
    this.vertexBuffer.destroy();
    this.indexBuffer.destroy();
  }

  static fromData(device: GPUDevice, vertices: Float32Array, indices: Uint32Array): Mesh {
    const vb = device.createBuffer({
      label: 'Mesh VertexBuffer',
      size: vertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(vb, 0, vertices.buffer as ArrayBuffer, vertices.byteOffset, vertices.byteLength);

    const ib = device.createBuffer({
      label: 'Mesh IndexBuffer',
      size: indices.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(ib, 0, indices.buffer as ArrayBuffer, indices.byteOffset, indices.byteLength);

    return new Mesh(vb, ib, indices.length);
  }

  // Counter-clockwise winding, +Y up
  static createCube(device: GPUDevice, size = 1): Mesh {
    const h = size / 2;
    // Each face: 4 verts, normal, uvs, tangent
    // position(3), normal(3), uv(2), tangent(4) = 12 floats per vertex
    const faces: Array<{ normal: [number,number,number]; tangent: [number,number,number,number]; verts: [number,number,number][] }> = [
      { normal:[0,0,1],  tangent:[1,0,0,1],  verts: [[-h,-h,h],[h,-h,h],[h,h,h],[-h,h,h]] },   // front
      { normal:[0,0,-1], tangent:[-1,0,0,1], verts: [[h,-h,-h],[-h,-h,-h],[-h,h,-h],[h,h,-h]] }, // back
      { normal:[1,0,0],  tangent:[0,0,-1,1], verts: [[h,-h,h],[h,-h,-h],[h,h,-h],[h,h,h]] },    // right
      { normal:[-1,0,0], tangent:[0,0,1,1],  verts: [[-h,-h,-h],[-h,-h,h],[-h,h,h],[-h,h,-h]] },// left
      { normal:[0,1,0],  tangent:[1,0,0,1],  verts: [[-h,h,h],[h,h,h],[h,h,-h],[-h,h,-h]] },    // top
      { normal:[0,-1,0], tangent:[1,0,0,1],  verts: [[-h,-h,-h],[h,-h,-h],[h,-h,h],[-h,-h,h]] },// bottom
    ];
    const uvs: [number,number][] = [[0,1],[1,1],[1,0],[0,0]];

    const vertData: number[] = [];
    const idxData: number[] = [];
    let baseVertex = 0;

    for (const face of faces) {
      for (let i = 0; i < 4; i++) {
        vertData.push(...face.verts[i], ...face.normal, ...uvs[i], ...face.tangent);
      }
      // CCW: 0,1,2, 0,2,3
      idxData.push(baseVertex,baseVertex+1,baseVertex+2, baseVertex,baseVertex+2,baseVertex+3);
      baseVertex += 4;
    }

    return Mesh.fromData(device, new Float32Array(vertData), new Uint32Array(idxData));
  }

  // UV sphere, normals point outward, tangent along +longitude (phi) direction.
  static createSphere(device: GPUDevice, radius = 0.5, latSegments = 32, lonSegments = 32): Mesh {
    const vertData: number[] = [];
    const idxData: number[] = [];

    for (let lat = 0; lat <= latSegments; lat++) {
      const theta    = (lat / latSegments) * Math.PI;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let lon = 0; lon <= lonSegments; lon++) {
        const phi    = (lon / lonSegments) * Math.PI * 2;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const nx = sinTheta * cosPhi;
        const ny = cosTheta;
        const nz = sinTheta * sinPhi;

        // Tangent: dP/dphi direction = (-sinPhi, 0, cosPhi)
        vertData.push(
          nx * radius, ny * radius, nz * radius,
          nx, ny, nz,
          lon / lonSegments, lat / latSegments,
          -sinPhi, 0, cosPhi, 1,
        );
      }
    }

    for (let lat = 0; lat < latSegments; lat++) {
      for (let lon = 0; lon < lonSegments; lon++) {
        const a = lat * (lonSegments + 1) + lon;
        const b = a + lonSegments + 1;
        // CCW from outside → outward normals
        idxData.push(a, a + 1, b);
        idxData.push(a + 1, b + 1, b);
      }
    }

    return Mesh.fromData(device, new Float32Array(vertData), new Uint32Array(idxData));
  }

  // Cone pointing along +Y: apex at (0, height, 0), base circle at Y=0, radius r.
  // Rotate the returned mesh so local +Y aligns with the desired direction.
  static createCone(device: GPUDevice, radius = 0.5, height = 1.0, segments = 16): Mesh {
    const vertData: number[] = [];
    const idxData: number[] = [];

    const slope = Math.sqrt(height * height + radius * radius);
    const sn = height / slope; // outward normal x/z scale
    const cn = radius / slope; // outward normal y component

    // Apex
    vertData.push(0, height, 0,  0, 1, 0,  0.5, 0,  1, 0, 0, 1);

    // Side ring — one vertex per segment boundary (segments+1 to close the seam)
    const sideRingStart = 1;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      const c = Math.cos(t), s = Math.sin(t);
      vertData.push(c * radius, 0, s * radius,  c * sn, cn, s * sn,  i / segments, 1,  c, 0, s, 1);
    }

    // Side triangles — CCW from outside: apex, ring[i+1], ring[i]
    for (let i = 0; i < segments; i++) {
      idxData.push(0, sideRingStart + i + 1, sideRingStart + i);
    }

    // Base cap center
    const capCenter = sideRingStart + segments + 1;
    vertData.push(0, 0, 0,  0, -1, 0,  0.5, 0.5,  1, 0, 0, 1);

    // Base cap ring
    const capRingStart = capCenter + 1;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      const c = Math.cos(t), s = Math.sin(t);
      vertData.push(c * radius, 0, s * radius,  0, -1, 0,  0.5 + c * 0.5, 0.5 + s * 0.5,  1, 0, 0, 1);
    }

    // Base triangles — CCW from below: center, ring[i], ring[i+1]
    for (let i = 0; i < segments; i++) {
      idxData.push(capCenter, capRingStart + i, capRingStart + i + 1);
    }

    return Mesh.fromData(device, new Float32Array(vertData), new Uint32Array(idxData));
  }

  static createPlane(device: GPUDevice, width = 10, depth = 10, segX = 1, segZ = 1): Mesh {
    const vertData: number[] = [];
    const idxData: number[] = [];

    for (let z = 0; z <= segZ; z++) {
      for (let x = 0; x <= segX; x++) {
        const px = (x / segX - 0.5) * width;
        const pz = (z / segZ - 0.5) * depth;
        const u = x / segX;
        const v = z / segZ;
        // position, normal (up), uv, tangent (+X)
        vertData.push(px, 0, pz,  0, 1, 0,  u, v,  1, 0, 0, 1);
      }
    }

    for (let z = 0; z < segZ; z++) {
      for (let x = 0; x < segX; x++) {
        const i = z * (segX + 1) + x;
        // CCW winding when viewed from above (+Y)
        idxData.push(i, i+segX+1, i+1,  i+1, i+segX+1, i+segX+2);
      }
    }

    return Mesh.fromData(device, new Float32Array(vertData), new Uint32Array(idxData));
  }
}
