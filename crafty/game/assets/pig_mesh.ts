import { Mesh } from '../../../src/assets/mesh.js';

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
  Mesh.addBox(verts, indices, 0, 0, 0, 0.22 * s, 0.15 * s, 0.32 * s);

  // Tail nub: small curl at the back
  Mesh.addBox(verts, indices, 0, 0.07 * s, 0.32 * s, 0.035 * s, 0.035 * s, 0.035 * s);

  // Four legs; each 0.13 wide × 0.20 tall × 0.13 deep.
  // Centers at y = -0.25*s (= body bottom -0.15 then down half-leg 0.10).
  const lx  = 0.155 * s;
  const ly  = -0.25 * s;
  const lz  = 0.255 * s;
  const lsx = 0.065 * s;
  const lsy = 0.10  * s;
  const lsz = 0.065 * s;
  Mesh.addBox(verts, indices, -lx, ly, -lz, lsx, lsy, lsz); // front-left
  Mesh.addBox(verts, indices,  lx, ly, -lz, lsx, lsy, lsz); // front-right
  Mesh.addBox(verts, indices, -lx, ly,  lz, lsx, lsy, lsz); // back-left
  Mesh.addBox(verts, indices,  lx, ly,  lz, lsx, lsy, lsz); // back-right

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
  Mesh.addBox(verts, indices, 0, 0, 0, 0.18 * s, 0.16 * s, 0.16 * s);
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
  Mesh.addBox(verts, indices, 0, 0, 0, 0.10 * s, 0.08 * s, 0.06 * s);
  return Mesh.fromData(device, new Float32Array(verts), new Uint32Array(indices));
}
