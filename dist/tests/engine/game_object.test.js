import { describe, it, expect } from 'vitest';
import { GameObject } from '../../src/engine/game_object.js';
import { Component } from '../../src/engine/component.js';
class TestComponent extends Component {
    attachCount = 0;
    detachCount = 0;
    updateCount = 0;
    lastDt = 0;
    onAttach() { this.attachCount++; }
    onDetach() { this.detachCount++; }
    update(dt) { this.updateCount++; this.lastDt = dt; }
}
class OtherComponent extends Component {
}
describe('GameObject', () => {
    describe('constructor', () => {
        it('should set default values', () => {
            const go = new GameObject();
            expect(go.name).toBe('GameObject');
            expect(go.position.x).toBe(0);
            expect(go.rotation.w).toBe(1);
            expect(go.scale.x).toBe(1);
            expect(go.children).toEqual([]);
            expect(go.parent).toBeNull();
        });
        it('should accept a custom name', () => {
            const go = new GameObject('Player');
            expect(go.name).toBe('Player');
        });
    });
    describe('addComponent / getComponent / getComponents', () => {
        it('should add a component and set its gameObject', () => {
            const go = new GameObject();
            const c = new TestComponent();
            go.addComponent(c);
            expect(c.gameObject).toBe(go);
        });
        it('should call onAttach when added', () => {
            const go = new GameObject();
            const c = new TestComponent();
            go.addComponent(c);
            expect(c.attachCount).toBe(1);
        });
        it('should return the same component for chaining', () => {
            const go = new GameObject();
            const c = new TestComponent();
            const ret = go.addComponent(c);
            expect(ret).toBe(c);
        });
        it('should find component by type', () => {
            const go = new GameObject();
            const c = new TestComponent();
            go.addComponent(c);
            expect(go.getComponent(TestComponent)).toBe(c);
        });
        it('should return null for missing component type', () => {
            const go = new GameObject();
            expect(go.getComponent(TestComponent)).toBeNull();
        });
        it('should return array from getComponents', () => {
            const go = new GameObject();
            const c1 = go.addComponent(new TestComponent());
            const c2 = go.addComponent(new TestComponent());
            const list = go.getComponents(TestComponent);
            expect(list).toHaveLength(2);
            expect(list[0]).toBe(c1);
            expect(list[1]).toBe(c2);
        });
        it('should filter by type with getComponents', () => {
            const go = new GameObject();
            go.addComponent(new TestComponent());
            go.addComponent(new OtherComponent());
            expect(go.getComponents(TestComponent)).toHaveLength(1);
            expect(go.getComponents(OtherComponent)).toHaveLength(1);
        });
    });
    describe('removeComponent', () => {
        it('should call onDetach and remove the component', () => {
            const go = new GameObject();
            const c = new TestComponent();
            go.addComponent(c);
            go.removeComponent(c);
            expect(c.detachCount).toBe(1);
            expect(go.getComponent(TestComponent)).toBeNull();
        });
        it('should do nothing for unmanaged component', () => {
            const go = new GameObject();
            const c = new TestComponent();
            go.removeComponent(c);
            expect(c.detachCount).toBe(0);
        });
    });
    describe('addChild', () => {
        it('should set parent and add to children', () => {
            const parent = new GameObject();
            const child = new GameObject();
            parent.addChild(child);
            expect(child.parent).toBe(parent);
            expect(parent.children).toHaveLength(1);
            expect(parent.children[0]).toBe(child);
        });
    });
    describe('localToWorld', () => {
        it('should return identity-equivalent for default GameObject', () => {
            const go = new GameObject();
            const m = go.localToWorld();
            expect(m.data[0]).toBe(1);
            expect(m.data[5]).toBe(1);
            expect(m.data[10]).toBe(1);
            expect(m.data[15]).toBe(1);
            expect(m.data[12]).toBe(0);
            expect(m.data[13]).toBe(0);
            expect(m.data[14]).toBe(0);
        });
        it('should include translation', () => {
            const go = new GameObject();
            go.position.set(10, 20, 30);
            const m = go.localToWorld();
            expect(m.data[12]).toBe(10);
            expect(m.data[13]).toBe(20);
            expect(m.data[14]).toBe(30);
        });
        it('should compose parent and child transforms', () => {
            const parent = new GameObject();
            parent.position.set(100, 0, 0);
            const child = new GameObject();
            child.position.set(0, 50, 0);
            parent.addChild(child);
            const m = child.localToWorld();
            expect(m.data[12]).toBeCloseTo(100);
            expect(m.data[13]).toBeCloseTo(50);
            expect(m.data[14]).toBeCloseTo(0);
        });
    });
    describe('update', () => {
        it('should call update on all components', () => {
            const go = new GameObject();
            const c1 = go.addComponent(new TestComponent());
            const c2 = go.addComponent(new TestComponent());
            go.update(0.016);
            expect(c1.updateCount).toBe(1);
            expect(c2.updateCount).toBe(1);
            expect(c1.lastDt).toBe(0.016);
        });
        it('should update child GameObjects recursively', () => {
            const parent = new GameObject();
            const child = new GameObject();
            const c = child.addComponent(new TestComponent());
            parent.addChild(child);
            parent.update(0.03);
            expect(c.updateCount).toBe(1);
        });
        it('should not update removed components', () => {
            const go = new GameObject();
            const c = new TestComponent();
            go.addComponent(c);
            go.removeComponent(c);
            go.update(0.016);
            expect(c.updateCount).toBe(0);
        });
    });
});
