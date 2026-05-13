import { Mesh } from '../../../src/assets/mesh.js';

export function createBeeBodyMesh(device: GPUDevice, scale = 1.0): Mesh {
  const verts: number[] = [];
  const indices: number[] = [];
  const s = scale;

  // Main yellow body — elongated along Z
  Mesh.addBox(verts, indices, 0, 0, 0, 0.12 * s, 0.09 * s, 0.15 * s);

  return Mesh.fromData(device, new Float32Array(verts), new Uint32Array(indices));
}

export function createBeeStripeMesh(device: GPUDevice, scale = 1.0): Mesh {
  const verts: number[] = [];
  const indices: number[] = [];
  const s = scale;

  // Black stripe band — slightly wider than body so it wraps
  Mesh.addBox(verts, indices, 0, 0, 0, 0.13 * s, 0.09 * s, 0.03 * s);

  return Mesh.fromData(device, new Float32Array(verts), new Uint32Array(indices));
}

export function createBeeHeadMesh(device: GPUDevice, scale = 1.0): Mesh {
  const verts: number[] = [];
  const indices: number[] = [];
  const s = scale;

  // Flat head pressed against the front of the body
  Mesh.addBox(verts, indices, 0, 0, 0, 0.09 * s, 0.07 * s, 0.04 * s);

  return Mesh.fromData(device, new Float32Array(verts), new Uint32Array(indices));
}

export function createBeeEyeMesh(device: GPUDevice, scale = 1.0): Mesh {
  const verts: number[] = [];
  const indices: number[] = [];
  const s = scale;

  // Tiny black eye
  Mesh.addBox(verts, indices, 0, 0, 0, 0.02 * s, 0.02 * s, 0.001 * s);

  return Mesh.fromData(device, new Float32Array(verts), new Uint32Array(indices));
}

export function createBeeWingMesh(device: GPUDevice, scale = 1.0): Mesh {
  const verts: number[] = [];
  const indices: number[] = [];
  const s = scale;

  // Horizontal translucent wing
  Mesh.addBox(verts, indices, 0, 0, 0, 0.12 * s, 0.005 * s, 0.06 * s);

  return Mesh.fromData(device, new Float32Array(verts), new Uint32Array(indices));
}
