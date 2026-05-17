import { Vec3, Quaternion, Mat4 } from '../math/index.js';
import { Component } from './component.js';
import type { RenderContext } from '../renderer/render_context.js';

export interface GameObjectOptions {
  name?: string;
  position?: Vec3;
  rotation?: Quaternion;
  scale?: Vec3;
}

/**
 * Container for transform, children, and components.
 *
 * Forms a parent/child scene graph: each GameObject has its own local TRS
 * (position/rotation/scale) and inherits its parent's world transform via
 * {@link GameObject.localToWorld}. Behavior is added by attaching {@link Component}
 * instances; per-frame updates flow recursively through {@link GameObject.update}.
 */
export class GameObject {
  /** Whether this GameObject is active and should be updated and rendered. */
  enabled = true;
  /** Display/lookup name (not unique). */
  name: string;
  /** Local-space position relative to parent. */
  position: Vec3;
  /** Local-space rotation relative to parent. */
  rotation: Quaternion;
  /** Local-space scale relative to parent. */
  scale: Vec3;

  /** Child GameObjects whose transforms are relative to this one. */
  readonly children: GameObject[] = [];
  /** Parent GameObject, or null if this is a root. */
  parent: GameObject | null = null;

  private _components: Component[] = [];

  /**
   * @param options - Optional parameters for initializing the GameObject.
   */
  constructor(options: GameObjectOptions = {}) {
    this.name = options.name ?? 'GameObject';
    this.position = options.position ?? Vec3.zero();
    this.rotation = options.rotation ?? Quaternion.identity();
    this.scale = options.scale ?? Vec3.one();
  }

  /**
   * Attaches a component, binds its {@link Component.gameObject}, and runs onAttach.
   *
   * @param component - Component instance to attach.
   * @returns The same component, for chaining.
   */
  addComponent<T extends Component>(component: T): T {
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
  getComponent<T extends Component>(ctor: new (...args: never[]) => T): T | null {
    for (const c of this._components) {
      if (c instanceof ctor) {
        return c as T;
      }
    }
    return null;
  }

  /**
   * Returns all attached components matching the given constructor.
   *
   * @param ctor - Component subclass constructor used as a type filter.
   */
  getComponents<T extends Component>(ctor: new (...args: never[]) => T): T[] {
    return this._components.filter((c): c is T => c instanceof ctor);
  }

  /**
   * Detaches a component (calling its onDetach) if it is attached to this GameObject.
   *
   * @param component - The component instance to remove.
   */
  removeComponent(component: Component): void {
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
  addChild(child: GameObject): void {
    child.parent = this;
    this.children.push(child);
  }

  /**
   * Computes this GameObject's world transform by walking up the parent chain.
   */
  localToWorld(): Mat4 {
    const local = Mat4.trs(
      this.position,
      this.rotation.x, this.rotation.y, this.rotation.z, this.rotation.w,
      this.scale,
    );
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
  update(dt: number): void {
    if (!this.enabled) {
      return;
    }
    for (const c of this._components) {
      c.update(dt);
    }
    for (const child of this.children) {
      child.update(dt);
    }
  }

  /**
   * Refreshes per-frame render state on every attached component, then
   * recursively on each child. Called after {@link update} and any controller
   * input that mutates the transform, so cached values (e.g. camera view /
   * projection matrices) reflect the final transform for the frame.
   *
   * @param ctx - Active render context.
   */
  updateRender(ctx: RenderContext): void {
    if (!this.enabled) {
      return;
    }
    for (const c of this._components) {
      c.updateRender(ctx);
    }
    for (const child of this.children) {
      child.updateRender(ctx);
    }
  }
}
