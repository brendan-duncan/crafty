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
    // Front -Z (pig looks toward -Z when yaw=0)
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
 * Builds the pig body mesh: a pink barrel body with four stubby legs and a
 * small tail nub at the back. Centered at local origin (body center at y=0);
 * the bodyGO is lifted 0.35 * scale from the root so feet reach ground.
 *
 * @param device - WebGPU device used to create the GPU buffers.
 * @param scale  - Uniform scale; 1.0 = adult, ~0.55 = baby.
 */
export function createPigBodyMesh(device: GPUDevice, scale = 1.0): Mesh {
  const verts: number[] = [];
  const indices: number[] = [];
  const s = scale;

  // Main body: 0.44 wide × 0.30 tall × 0.64 deep
  _addBox(verts, indices, 0, 0, 0, 0.22 * s, 0.15 * s, 0.32 * s);

  // Tail nub: small curl at the back
  _addBox(verts, indices, 0, 0.07 * s, 0.32 * s, 0.035 * s, 0.035 * s, 0.035 * s);

  // Four legs; each 0.13 wide × 0.20 tall × 0.13 deep.
  // Centers at y = -0.25*s (= body bottom -0.15 then down half-leg 0.10).
  const lx  = 0.155 * s;
  const ly  = -0.25 * s;
  const lz  = 0.255 * s;
  const lsx = 0.065 * s;
  const lsy = 0.10  * s;
  const lsz = 0.065 * s;
  _addBox(verts, indices, -lx, ly, -lz, lsx, lsy, lsz); // front-left
  _addBox(verts, indices,  lx, ly, -lz, lsx, lsy, lsz); // front-right
  _addBox(verts, indices, -lx, ly,  lz, lsx, lsy, lsz); // back-left
  _addBox(verts, indices,  lx, ly,  lz, lsx, lsy, lsz); // back-right

  return Mesh.fromData(device, new Float32Array(verts), new Uint32Array(indices));
}

/**
 * Builds the pig head mesh: a square-ish box centered at local origin.
 *
 * @param device - WebGPU device used to create the GPU buffers.
 * @param scale  - Uniform scale; 1.0 = adult, ~0.55 = baby.
 */
export function createPigHeadMesh(device: GPUDevice, scale = 1.0): Mesh {
  const verts: number[] = [];
  const indices: number[] = [];
  const s = scale;
  // Head: 0.36 wide × 0.32 tall × 0.32 deep
  _addBox(verts, indices, 0, 0, 0, 0.18 * s, 0.16 * s, 0.16 * s);
  return Mesh.fromData(device, new Float32Array(verts), new Uint32Array(indices));
}

/**
 * Builds the pig snout mesh: a flat wide disc that protrudes from the head.
 *
 * @param device - WebGPU device used to create the GPU buffers.
 * @param scale  - Uniform scale; 1.0 = adult, ~0.55 = baby.
 */
export function createPigSnoutMesh(device: GPUDevice, scale = 1.0): Mesh {
  const verts: number[] = [];
  const indices: number[] = [];
  const s = scale;
  // Snout: 0.20 wide × 0.16 tall × 0.12 deep
  _addBox(verts, indices, 0, 0, 0, 0.10 * s, 0.08 * s, 0.06 * s);
  return Mesh.fromData(device, new Float32Array(verts), new Uint32Array(indices));
}
