import { Mesh } from '../../../src/assets/mesh.js';

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
 * @param scale  - Uniform scale; 1.0 = adult, 0.5 = duckling.
 * @returns A Mesh with position, normal, uv, and tangent attributes.
 */
export function createDuckBodyMesh(device: GPUDevice, scale = 1.0): Mesh {
  const verts: number[] = [];
  const indices: number[] = [];
  const s = scale;
  _addBox(verts, indices, 0, 0, 0, 0.19 * s, 0.11 * s, 0.225 * s);
  _addBox(verts, indices, 0, 0.07 * s, 0.225 * s, 0.075 * s, 0.06 * s, 0.06 * s);
  return Mesh.fromData(device, new Float32Array(verts), new Uint32Array(indices));
}

/**
 * Builds the duck head mesh: a small box centered at local origin.
 *
 * @param device - WebGPU device used to create the GPU buffers.
 * @param scale  - Uniform scale; 1.0 = adult, 0.5 = duckling.
 * @returns A Mesh with position, normal, uv, and tangent attributes.
 */
export function createDuckHeadMesh(device: GPUDevice, scale = 1.0): Mesh {
  const verts: number[] = [];
  const indices: number[] = [];
  const s = scale;
  _addBox(verts, indices, 0, 0, 0, 0.085 * s, 0.085 * s, 0.075 * s);
  return Mesh.fromData(device, new Float32Array(verts), new Uint32Array(indices));
}

/**
 * Builds the duck bill mesh: a flat, wide box centered at local origin.
 *
 * @param device - WebGPU device used to create the GPU buffers.
 * @param scale  - Uniform scale; 1.0 = adult, 0.5 = duckling.
 * @returns A Mesh with position, normal, uv, and tangent attributes.
 */
export function createDuckBillMesh(device: GPUDevice, scale = 1.0): Mesh {
  const verts: number[] = [];
  const indices: number[] = [];
  const s = scale;
  _addBox(verts, indices, 0, 0, 0, 0.065 * s, 0.03 * s, 0.055 * s);
  return Mesh.fromData(device, new Float32Array(verts), new Uint32Array(indices));
}
