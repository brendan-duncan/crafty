import { GameObject, PointLight, Scene } from '../../src/engine/index.js';
import { Vec3 } from '../../src/math/index.js';

interface TorchEntry { go: GameObject; pl: PointLight; phase: number; }

const torchLights = new Map<string, TorchEntry>();
const magmaLights = new Map<string, TorchEntry>();

const torchLightKey = (x: number, y: number, z: number) => `${x},${y},${z}`;

export function addTorchLight(bx: number, by: number, bz: number, scene: Scene): void {
  const key = torchLightKey(bx, by, bz);
  if (torchLights.has(key)) {
    return;
  }
  const go = new GameObject({ name: 'TorchLight' });
  go.position.set(bx + 0.5, by + 0.9, bz + 0.5);
  const pl = go.addComponent(new PointLight());
  pl.color = new Vec3(1.0, 0.52, 0.18);
  pl.intensity = 4.0;
  pl.radius = 6.0;
  pl.castShadow = false;
  scene.add(go);
  const phase = (bx * 127.1 + by * 311.7 + bz * 74.3) % (Math.PI * 2);
  torchLights.set(key, { go, pl, phase });
}

export function removeTorchLight(bx: number, by: number, bz: number, scene: Scene): void {
  const key = torchLightKey(bx, by, bz);
  const entry = torchLights.get(key);
  if (!entry) {
    return;
  }
  scene.remove(entry.go);
  torchLights.delete(key);
}

export function updateTorchFlicker(t: number): void {
  for (const { pl, phase } of torchLights.values()) {
    const flicker = 1.0
      + 0.08 * Math.sin(t * 11.7 + phase)
      + 0.05 * Math.sin(t *  7.3 + phase * 1.7)
      + 0.03 * Math.sin(t * 23.1 + phase * 0.5);
    pl.intensity = 4.0 * flicker;
  }
}

export function addMagmaLight(bx: number, by: number, bz: number, scene: Scene): void {
  const key = torchLightKey(bx, by, bz);
  if (magmaLights.has(key)) {
    return;
  }
  const go = new GameObject({ name: 'MagmaLight' });
  go.position.set(bx + 0.5, by + 0.5, bz + 0.5);
  const pl = go.addComponent(new PointLight());
  pl.color = new Vec3(1.0, 0.28, 0.0);
  pl.intensity = 6.0;
  pl.radius = 10.0;
  pl.castShadow = false;
  scene.add(go);
  const phase = (bx * 127.1 + by * 311.7 + bz * 74.3) % (Math.PI * 2);
  magmaLights.set(key, { go, pl, phase });
}

export function removeMagmaLight(bx: number, by: number, bz: number, scene: Scene): void {
  const key = torchLightKey(bx, by, bz);
  const entry = magmaLights.get(key);
  if (!entry) {
    return;
  }
  scene.remove(entry.go);
  magmaLights.delete(key);
}

export function updateMagmaFlicker(t: number): void {
  for (const { pl, phase } of magmaLights.values()) {
    const flicker = 1.0
      + 0.18 * Math.sin(t * 1.1 + phase)
      + 0.10 * Math.sin(t * 2.9 + phase * 0.7)
      + 0.06 * Math.sin(t * 0.5 + phase * 1.4);
    pl.intensity = 6.0 * flicker;
  }
}
