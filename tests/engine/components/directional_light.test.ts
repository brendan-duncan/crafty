import { describe, it, expect } from 'vitest';
import { DirectionalLight } from '../../../src/engine/components/directional_light.js';
import { Camera } from '../../../src/engine/components/camera.js';
import { GameObject } from '../../../src/engine/game_object.js';
import { Vec3 } from '../../../src/math/vec3.js';

describe('DirectionalLight', () => {
  describe('constructor', () => {
    it('should normalize direction', () => {
      const light = new DirectionalLight(new Vec3(0, -5, 0));
      expect(light.direction.length()).toBeCloseTo(1);
      expect(light.direction.y).toBeCloseTo(-1);
    });

    it('should set default values', () => {
      const light = new DirectionalLight();
      expect(light.intensity).toBe(1);
      expect(light.numCascades).toBe(3);
      expect(light.color.x).toBe(1);
    });
  });

  describe('computeCascadeMatrices', () => {
    it('should return correct number of cascades', () => {
      const go = new GameObject();
      const cam = go.addComponent(Camera.createPerspective(60, 0.1, 100, 16 / 9));
      const light = new DirectionalLight(new Vec3(0.3, -1, 0.5), Vec3.one(), 1, 3);
      const cascades = light.computeCascadeMatrices(cam);
      expect(cascades).toHaveLength(3);
    });

    it('should produce increasing split depths', () => {
      const go = new GameObject();
      const cam = go.addComponent(Camera.createPerspective(60, 0.1, 100, 16 / 9));
      const light = new DirectionalLight(new Vec3(0.3, -1, 0.5), Vec3.one(), 1, 4);
      const cascades = light.computeCascadeMatrices(cam);
      expect(cascades[0].splitFar).toBeLessThan(cascades[1].splitFar);
      expect(cascades[1].splitFar).toBeLessThan(cascades[2].splitFar);
      expect(cascades[2].splitFar).toBeLessThan(cascades[3].splitFar);
    });

    it('should produce valid lightViewProj matrices', () => {
      const go = new GameObject();
      go.position.set(0, 0, 0);
      const cam = go.addComponent(Camera.createPerspective(60, 0.1, 100, 16 / 9));
      const light = new DirectionalLight(new Vec3(0.3, -1, 0.5), Vec3.one(), 1, 3);
      const cascades = light.computeCascadeMatrices(cam);
      for (const c of cascades) {
        expect(c.lightViewProj.data[15]).toBe(1); // w=1 for ortho
        expect(c.depthRange).toBeGreaterThan(0);
        expect(c.texelWorldSize).toBeGreaterThan(0);
      }
    });

    it('should handle different light directions', () => {
      const go = new GameObject();
      const cam = go.addComponent(Camera.createPerspective(60, 0.1, 100, 16 / 9));
      const light = new DirectionalLight(new Vec3(0, -1, 0), Vec3.one(), 1, 2);
      const cascades = light.computeCascadeMatrices(cam);
      expect(cascades).toHaveLength(2);
      expect(cascades[0].splitFar).toBeGreaterThan(0);
    });

    it('should use shadowFar override when provided', () => {
      const go = new GameObject();
      const cam = go.addComponent(Camera.createPerspective(60, 0.1, 1000, 16 / 9));
      const light = new DirectionalLight(new Vec3(0.3, -1, 0.5), Vec3.one(), 1, 3);
      const cascades = light.computeCascadeMatrices(cam, 50);
      // With shadowFar=50, all split depths should be <= 50
      for (const c of cascades) {
        expect(c.splitFar).toBeLessThanOrEqual(50 + 1e-6);
      }
    });
  });
});
