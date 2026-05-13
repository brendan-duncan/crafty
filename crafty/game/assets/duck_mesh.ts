import { Mesh } from '../../../src/assets/mesh.js';

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
  Mesh.addBox(verts, indices, 0, 0, 0, 0.19 * s, 0.11 * s, 0.225 * s);
  Mesh.addBox(verts, indices, 0, 0.07 * s, 0.225 * s, 0.075 * s, 0.06 * s, 0.06 * s);
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
  Mesh.addBox(verts, indices, 0, 0, 0, 0.085 * s, 0.085 * s, 0.075 * s);
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
  Mesh.addBox(verts, indices, 0, 0, 0, 0.065 * s, 0.03 * s, 0.055 * s);
  return Mesh.fromData(device, new Float32Array(verts), new Uint32Array(indices));
}
