import { Vec3, Quaternion, Mat4 } from '../math/index.js';
import { Component } from './component.js';

export class GameObject {
  name: string;
  position: Vec3;
  rotation: Quaternion;
  scale: Vec3;

  readonly children: GameObject[] = [];
  parent: GameObject | null = null;

  private _components: Component[] = [];

  constructor(name = 'GameObject') {
    this.name = name;
    this.position = Vec3.zero();
    this.rotation = Quaternion.identity();
    this.scale = Vec3.one();
  }

  addComponent<T extends Component>(component: T): T {
    component.gameObject = this;
    this._components.push(component);
    component.onAttach();
    return component;
  }

  getComponent<T extends Component>(ctor: new (...args: never[]) => T): T | null {
    for (const c of this._components) {
      if (c instanceof ctor) {
        return c as T;
      }
    }
    return null;
  }

  getComponents<T extends Component>(ctor: new (...args: never[]) => T): T[] {
    return this._components.filter((c): c is T => c instanceof ctor);
  }

  removeComponent(component: Component): void {
    const idx = this._components.indexOf(component);
    if (idx !== -1) {
      component.onDetach();
      this._components.splice(idx, 1);
    }
  }

  addChild(child: GameObject): void {
    child.parent = this;
    this.children.push(child);
  }

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

  update(dt: number): void {
    for (const c of this._components) {
      c.update(dt);
    }
    for (const child of this.children) {
      child.update(dt);
    }
  }
}
