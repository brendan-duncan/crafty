import { Mesh } from './mesh.js';

// 12 floats per vertex: position(3) + normal(3) + uv(2) + tangent(4)
function _addBox(
  verts: number[], indices: number[],
  cx: number, cy: number, cz: number,
  sx: number, sy: number, sz: number,
): void {
  const faces: Array<{
    n: [number, number, number];
    t: [number, number, number, number];
    v: [number, number, number][];
  }> = [
    // Front -Z (duck looks toward -Z when yaw=0)
    { n: [0, 0, -1], t: [-1, 0, 0, 1], v: [[-sx, -sy, -sz], [sx, -sy, -sz], [sx, sy, -sz], [-sx, sy, -sz]] },
    // Back +Z
    { n: [0, 0,  1], t: [ 1, 0, 0, 1], v: [[sx, -sy, sz], [-sx, -sy, sz], [-sx, sy, sz], [sx, sy, sz]] },
    // Left -X
    { n: [-1, 0, 0], t: [0, 0, -1, 1], v: [[-sx, -sy, sz], [-sx, -sy, -sz], [-sx, sy, -sz], [-sx, sy, sz]] },
    // Right +X
    { n: [ 1, 0, 0], t: [0, 0,  1, 1], v: [[sx, -sy, -sz], [sx, -sy, sz], [sx, sy, sz], [sx, sy, -sz]] },
    // Top +Y
    { n: [0, 1, 0],  t: [ 1, 0, 0, 1], v: [[-sx, sy, -sz], [sx, sy, -sz], [sx, sy, sz], [-sx, sy, sz]] },
    // Bottom -Y
    { n: [0, -1, 0], t: [ 1, 0, 0, 1], v: [[-sx, -sy, sz], [sx, -sy, sz], [sx, -sy, -sz], [-sx, -sy, -sz]] },
  ];

  const uvs: [number, number][] = [[0, 1], [1, 1], [1, 0], [0, 0]];

  for (const f of faces) {
    const base = verts.length / 12;
    for (let i = 0; i < 4; i++) {
      const [vx, vy, vz] = f.v[i];
      verts.push(
        cx + vx, cy + vy, cz + vz,
        f.n[0], f.n[1], f.n[2],
        uvs[i][0], uvs[i][1],
        f.t[0], f.t[1], f.t[2], f.t[3],
      );
    }
    // CCW winding (outward normals)
    indices.push(base, base + 2, base + 1, base, base + 3, base + 2);
  }
}

/**
 * Builds the duck body mesh: a white box body with a small tail nub.
 *
 * Centered at local origin (feet at y = -0.15). The root duck GameObject is
 * placed so feet are at ground level.
 *
 * @param device - WebGPU device used to create the GPU buffers.
 * @returns A Mesh with position, normal, uv, and tangent attributes.
 */
export function createDuckBodyMesh(device: GPUDevice): Mesh {
  const verts: number[] = [];
  const indices: number[] = [];
  // Body: 0.38 wide × 0.22 tall × 0.45 deep, center at y=0
  _addBox(verts, indices, 0, 0, 0, 0.19, 0.11, 0.225);
  // Tail nub: small box raised slightly at back
  _addBox(verts, indices, 0, 0.07, 0.225, 0.075, 0.06, 0.06);
  return Mesh.fromData(device, new Float32Array(verts), new Uint32Array(indices));
}

/**
 * Builds the duck head mesh: a small box centered at local origin.
 *
 * Intended to be parented above the body by the caller.
 *
 * @param device - WebGPU device used to create the GPU buffers.
 * @returns A Mesh with position, normal, uv, and tangent attributes.
 */
export function createDuckHeadMesh(device: GPUDevice): Mesh {
  const verts: number[] = [];
  const indices: number[] = [];
  _addBox(verts, indices, 0, 0, 0, 0.085, 0.085, 0.075);
  return Mesh.fromData(device, new Float32Array(verts), new Uint32Array(indices));
}

/**
 * Builds the duck bill mesh: a flat, wide box centered at local origin.
 *
 * @param device - WebGPU device used to create the GPU buffers.
 * @returns A Mesh with position, normal, uv, and tangent attributes.
 */
export function createDuckBillMesh(device: GPUDevice): Mesh {
  const verts: number[] = [];
  const indices: number[] = [];
  _addBox(verts, indices, 0, 0, 0, 0.065, 0.03, 0.055);
  return Mesh.fromData(device, new Float32Array(verts), new Uint32Array(indices));
}
