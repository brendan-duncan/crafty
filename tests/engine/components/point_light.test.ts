import { describe, it, expect } from 'vitest';
import { PointLight } from '../../../src/engine/components/point_light.js';
import { GameObject } from '../../../src/engine/game_object.js';
import { Vec3 } from '../../../src/math/vec3.js';

describe('PointLight', () => {
  describe('constructor defaults', () => {
    it('should set default color/intensity/radius', () => {
      const pl = new PointLight();
      expect(pl.color.x).toBe(1);
      expect(pl.color.y).toBe(1);
      expect(pl.color.z).toBe(1);
      expect(pl.intensity).toBe(1);
      expect(pl.radius).toBe(10);
      expect(pl.castShadow).toBe(false);
    });
  });

  describe('worldPosition', () => {
    it('should return origin when GameObject is at origin', () => {
      const go = new GameObject();
      const pl = go.addComponent(new PointLight());
      const pos = pl.worldPosition();
      expect(pos.x).toBeCloseTo(0);
      expect(pos.y).toBeCloseTo(0);
      expect(pos.z).toBeCloseTo(0);
    });

    it('should return GameObject world position', () => {
      const go = new GameObject();
      go.position.set(100, 200, 300);
      const pl = go.addComponent(new PointLight());
      const pos = pl.worldPosition();
      expect(pos.x).toBeCloseTo(100);
      expect(pos.y).toBeCloseTo(200);
      expect(pos.z).toBeCloseTo(300);
    });
  });

  describe('cubeFaceViewProjs', () => {
    it('should return 6 matrices', () => {
      const go = new GameObject();
      const pl = go.addComponent(new PointLight());
      const mats = pl.cubeFaceViewProjs();
      expect(mats).toHaveLength(6);
    });

    it('should each have w=0 or w=1 in last column depending on perspective', () => {
      const go = new GameObject();
      const pl = go.addComponent(new PointLight());
      const mats = pl.cubeFaceViewProjs();
      for (const m of mats) {
        expect(m.data[15]).toBe(0); // perspective projection has w=0 at [15]
      }
    });

    it('should have distinct matrices for each face', () => {
      const go = new GameObject();
      const pl = go.addComponent(new PointLight());
      const mats = pl.cubeFaceViewProjs();
      for (let i = 1; i < 6; i++) {
        let same = true;
        for (let j = 0; j < 16; j++) {
          if (mats[0].data[j] !== mats[i].data[j]) {
            same = false;
            break;
          }
        }
        expect(same).toBe(false);
      }
    });

    it('should render a point at origin correctly', () => {
      const go = new GameObject();
      const pl = go.addComponent(new PointLight());
      const mats = pl.cubeFaceViewProjs(0.1);
      // For +X face: lookAt(origin, origin + (1,0,0), (0,-1,0))
      // A point at (1, 0, 0) should be at center of the +X face
      const point = new Vec3(1, 0, 0);
      const p = mats[0].transformPoint(point);
      // After perspective projection, x and y should be at center (0, 0) more or less
      expect(Math.abs(p.x)).toBeLessThan(1);
      expect(Math.abs(p.y)).toBeLessThan(1);
    });
  });
});
