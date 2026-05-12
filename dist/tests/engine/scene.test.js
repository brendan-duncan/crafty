import { describe, it, expect } from 'vitest';
import { Scene } from '../../src/engine/scene.js';
import { GameObject } from '../../src/engine/game_object.js';
import { Camera } from '../../src/engine/components/camera.js';
import { DirectionalLight } from '../../src/engine/components/directional_light.js';
import { MeshRenderer } from '../../src/engine/components/mesh_renderer.js';
import { Component } from '../../src/engine/component.js';
class TestComponent extends Component {
    updateCount = 0;
    update(_dt) { this.updateCount++; }
}
describe('Scene', () => {
    describe('add / remove', () => {
        it('should add a root GameObject', () => {
            const scene = new Scene();
            const go = new GameObject();
            scene.add(go);
            expect(scene.gameObjects).toHaveLength(1);
            expect(scene.gameObjects[0]).toBe(go);
        });
        it('should remove a root GameObject', () => {
            const scene = new Scene();
            const go = new GameObject();
            scene.add(go);
            scene.remove(go);
            expect(scene.gameObjects).toHaveLength(0);
        });
        it('should do nothing when removing non-existent object', () => {
            const scene = new Scene();
            scene.add(new GameObject());
            scene.remove(new GameObject());
            expect(scene.gameObjects).toHaveLength(1);
        });
    });
    describe('update', () => {
        it('should update all root GameObjects', () => {
            const scene = new Scene();
            const go1 = new GameObject();
            const c1 = go1.addComponent(new TestComponent());
            const go2 = new GameObject();
            const c2 = go2.addComponent(new TestComponent());
            scene.add(go1);
            scene.add(go2);
            scene.update(0.016);
            expect(c1.updateCount).toBe(1);
            expect(c2.updateCount).toBe(1);
        });
        it('should propagate update to children', () => {
            const scene = new Scene();
            const parent = new GameObject();
            const child = new GameObject();
            const c = child.addComponent(new TestComponent());
            parent.addChild(child);
            scene.add(parent);
            scene.update(0.03);
            expect(c.updateCount).toBe(1);
        });
    });
    describe('findCamera', () => {
        it('should find a Camera on a root GameObject', () => {
            const scene = new Scene();
            const go = new GameObject();
            const cam = go.addComponent(new Camera(60, 0.1, 100, 16 / 9));
            scene.add(go);
            expect(scene.findCamera()).toBe(cam);
        });
        it('should return null when no Camera exists', () => {
            const scene = new Scene();
            scene.add(new GameObject());
            expect(scene.findCamera()).toBeNull();
        });
        it('should not find Camera on child GameObjects', () => {
            const scene = new Scene();
            const parent = new GameObject();
            const child = new GameObject();
            child.addComponent(new Camera());
            parent.addChild(child);
            scene.add(parent);
            expect(scene.findCamera()).toBeNull();
        });
    });
    describe('findDirectionalLight', () => {
        it('should find a DirectionalLight on a root GameObject', () => {
            const scene = new Scene();
            const go = new GameObject();
            const light = go.addComponent(new DirectionalLight());
            scene.add(go);
            expect(scene.findDirectionalLight()).toBe(light);
        });
        it('should return null when no DirectionalLight exists', () => {
            const scene = new Scene();
            scene.add(new GameObject());
            expect(scene.findDirectionalLight()).toBeNull();
        });
    });
    describe('collectMeshRenderers', () => {
        it('should collect MeshRenderers from hierarchy', () => {
            const scene = new Scene();
            const parent = new GameObject();
            const child = new GameObject();
            const mr = child.addComponent(new MeshRenderer({}, {}));
            parent.addChild(child);
            scene.add(parent);
            const list = scene.collectMeshRenderers();
            expect(list).toHaveLength(1);
            expect(list[0]).toBe(mr);
        });
        it('should return empty array when none exist', () => {
            const scene = new Scene();
            scene.add(new GameObject());
            expect(scene.collectMeshRenderers()).toEqual([]);
        });
    });
    describe('getComponents', () => {
        it('should return one component per root of matching type', () => {
            const scene = new Scene();
            const c1 = new GameObject().addComponent(new TestComponent());
            const c2 = new GameObject().addComponent(new TestComponent());
            new GameObject().addComponent(new TestComponent());
            scene.add(c1.gameObject);
            scene.add(c2.gameObject);
            // Third one not added — not in scene
            const list = scene.getComponents(TestComponent);
            expect(list).toHaveLength(2);
        });
        it('should not recurse into children', () => {
            const scene = new Scene();
            const parent = new GameObject();
            const child = new GameObject();
            parent.addChild(child);
            child.addComponent(new TestComponent());
            scene.add(parent);
            expect(scene.getComponents(TestComponent)).toHaveLength(0);
        });
    });
});
