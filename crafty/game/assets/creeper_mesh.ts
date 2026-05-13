import { Mesh } from '../../../src/assets/mesh.js';

export function createCreeperBodyMesh(device: GPUDevice, scale = 1.0): Mesh {
  const verts: number[] = [];
  const indices: number[] = [];
  const s = scale;

  // Main body: 0.50 wide × 1.20 tall × 0.40 deep (twice as tall)
  Mesh.addBox(verts, indices, 0, 0, 0, 0.25 * s, 0.60 * s, 0.20 * s);

  // Four legs; each 0.12 wide × 0.40 tall × 0.12 deep (twice as tall)
  const lx  = 0.16 * s;
  const ly  = -0.80 * s;
  const lz  = 0.13 * s;
  const lsx = 0.06 * s;
  const lsy = 0.20 * s;
  const lsz = 0.06 * s;
  Mesh.addBox(verts, indices, -lx, ly, -lz, lsx, lsy, lsz);
  Mesh.addBox(verts, indices,  lx, ly, -lz, lsx, lsy, lsz);
  Mesh.addBox(verts, indices, -lx, ly,  lz, lsx, lsy, lsz);
  Mesh.addBox(verts, indices,  lx, ly,  lz, lsx, lsy, lsz);

  return Mesh.fromData(device, new Float32Array(verts), new Uint32Array(indices));
}

export function createCreeperHeadMesh(device: GPUDevice, scale = 1.0): Mesh {
  const verts: number[] = [];
  const indices: number[] = [];
  const s = scale;
  // Head: 0.44 wide × 0.44 tall × 0.44 deep
  Mesh.addBox(verts, indices, 0, 0, 0, 0.22 * s, 0.22 * s, 0.22 * s);
  return Mesh.fromData(device, new Float32Array(verts), new Uint32Array(indices));
}
