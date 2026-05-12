import type { ParticleGraphConfig } from '../../src/particles/index.js';

export const rainConfig: ParticleGraphConfig = {
  emitter: {
    maxParticles: 80000,
    spawnRate: 24000,
    lifetime: [2.0, 3.5],
    shape: { kind: 'box', halfExtents: [35, 0.1, 35] },
    initialSpeed: [0, 0],
    initialColor: [0.75, 0.88, 1.0, 0.55],
    initialSize: [0.005, 0.009],
    roughness: 0.1,
    metallic: 0.0,
  },
  modifiers: [
    { type: 'gravity', strength: 9.0 },
    { type: 'drag', coefficient: 0.05 },
    { type: 'color_over_lifetime', startColor: [0.75, 0.88, 1.0, 0.55], endColor: [0.75, 0.88, 1.0, 0.0] },
    { type: 'block_collision' },
  ],
  renderer: { type: 'sprites', blendMode: 'alpha', billboard: 'velocity', renderTarget: 'hdr' },
};

export const blockBreakConfig: ParticleGraphConfig = {
  emitter: {
    maxParticles: 1024,
    spawnRate: 0,                          // bursts only — no continuous emission
    lifetime: [0.5, 1.0],
    shape: { kind: 'sphere', radius: 0.15, solidAngle: Math.PI },
    initialSpeed: [2.0, 4.5],
    initialColor: [1, 1, 1, 1],            // overridden per burst by ParticlePass.burst()
    initialSize: [0.025, 0.05],
    roughness: 0.9,
    metallic: 0.0,
  },
  modifiers: [
    { type: 'gravity', strength: 14.0 },
    { type: 'drag', coefficient: 0.6 },
  ],
  renderer: { type: 'sprites', blendMode: 'alpha', billboard: 'camera', shape: 'pixel', renderTarget: 'hdr' },
};

export const explosionConfig: ParticleGraphConfig = {
  emitter: {
    maxParticles: 512,
    spawnRate: 0,
    lifetime: [0.3, 0.8],
    shape: { kind: 'sphere', radius: 0.5, solidAngle: Math.PI },
    initialSpeed: [4.0, 10.0],
    initialColor: [1, 0.6, 0.1, 1],
    initialSize: [0.05, 0.15],
    roughness: 0.5,
    metallic: 0.0,
  },
  modifiers: [
    { type: 'gravity', strength: 4.0 },
    { type: 'drag', coefficient: 0.4 },
    { type: 'color_over_lifetime', startColor: [1, 0.6, 0.1, 1], endColor: [0.2, 0.05, 0.0, 0] },
    { type: 'size_over_lifetime', start: 0.15, end: 0.02 },
  ],
  renderer: { type: 'sprites', blendMode: 'alpha', billboard: 'camera', shape: 'soft', renderTarget: 'hdr' },
};

export const snowConfig: ParticleGraphConfig = {
  emitter: {
    maxParticles: 80000,
    spawnRate: 1500,
    lifetime: [30.0, 105.0],
    shape: { kind: 'box', halfExtents: [35, 0.1, 35] },
    initialSpeed: [0, 0],
    initialColor: [0.92, 0.96, 1.0, 0.85],
    initialSize: [0.025, 0.055],
    roughness: 0.1,
    metallic: 0.0,
  },
  modifiers: [
    { type: 'gravity', strength: 1.5 },
    { type: 'drag', coefficient: 0.8 },
    { type: 'curl_noise', scale: 1.0, strength: 1.0, timeScale: 1.0, octaves: 1 },
    { type: 'block_collision' },
  ],
  renderer: { type: 'sprites', blendMode: 'alpha', billboard: 'camera', renderTarget: 'hdr' },
};
