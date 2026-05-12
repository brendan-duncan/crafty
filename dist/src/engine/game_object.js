import { Vec3, Quaternion, Mat4 } from '../math/index.js';
/**
 * Container for transform, children, and components.
 *
 * Forms a parent/child scene graph: each GameObject has its own local TRS
 * (position/rotation/scale) and inherits its parent's world transform via
 * {@link GameObject.localToWorld}. Behavior is added by attaching {@link Component}
 * instances; per-frame updates flow recursively through {@link GameObject.update}.
 */
export class GameObject {
    /** Display/lookup name (not unique). */
    name;
    /** Local-space position relative to parent. */
    position;
    /** Local-space rotation relative to parent. */
    rotation;
    /** Local-space scale relative to parent. */
    scale;
    /** Child GameObjects whose transforms are relative to this one. */
    children = [];
    /** Parent GameObject, or null if this is a root. */
    parent = null;
    _components = [];
    /**
     * @param name - Optional display name; defaults to 'GameObject'.
     */
    constructor(name = 'GameObject') {
        this.name = name;
        this.position = Vec3.zero();
        this.rotation = Quaternion.identity();
        this.scale = Vec3.one();
    }
    /**
     * Attaches a component, binds its {@link Component.gameObject}, and runs onAttach.
     *
     * @param component - Component instance to attach.
     * @returns The same component, for chaining.
     */
    addComponent(component) {
        component.gameObject = this;
        this._components.push(component);
        component.onAttach();
        return component;
    }
    /**
     * Returns the first attached component matching the given constructor, or null.
     *
     * @param ctor - Component subclass constructor used as a type filter.
     */
    getComponent(ctor) {
        for (const c of this._components) {
            if (c instanceof ctor) {
                return c;
            }
        }
        return null;
    }
    /**
     * Returns all attached components matching the given constructor.
     *
     * @param ctor - Component subclass constructor used as a type filter.
     */
    getComponents(ctor) {
        return this._components.filter((c) => c instanceof ctor);
    }
    /**
     * Detaches a component (calling its onDetach) if it is attached to this GameObject.
     *
     * @param component - The component instance to remove.
     */
    removeComponent(component) {
        const idx = this._components.indexOf(component);
        if (idx !== -1) {
            component.onDetach();
            this._components.splice(idx, 1);
        }
    }
    /**
     * Reparents another GameObject under this one.
     *
     * Note: this does not remove the child from any previous parent's children list.
     *
     * @param child - GameObject to add as a child.
     */
    addChild(child) {
        child.parent = this;
        this.children.push(child);
    }
    /**
     * Computes this GameObject's world transform by walking up the parent chain.
     */
    localToWorld() {
        const local = Mat4.trs(this.position, this.rotation.x, this.rotation.y, this.rotation.z, this.rotation.w, this.scale);
        if (this.parent) {
            return this.parent.localToWorld().multiply(local);
        }
        return local;
    }
    /**
     * Updates every attached component, then recursively updates each child.
     *
     * @param dt - Frame delta time in seconds.
     */
    update(dt) {
        for (const c of this._components) {
            c.update(dt);
        }
        for (const child of this.children) {
            child.update(dt);
        }
    }
}
