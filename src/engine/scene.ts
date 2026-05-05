import { GameObject } from './game_object.js';
import { Camera } from './components/camera.js';
import { DirectionalLight } from './components/directional_light.js';
import { MeshRenderer } from './components/mesh_renderer.js';
import { Component } from './component.js';

export class Scene {
  readonly gameObjects: GameObject[] = [];

  add(go: GameObject): void {
    this.gameObjects.push(go);
  }

  remove(go: GameObject): void {
    const idx = this.gameObjects.indexOf(go);
    if (idx !== -1) {
      this.gameObjects.splice(idx, 1);
    }
  }

  update(dt: number): void {
    for (const go of this.gameObjects) {
      go.update(dt);
    }
  }

  findCamera(): Camera | null {
    for (const go of this.gameObjects) {
      const c = go.getComponent(Camera);
      if (c) {
        return c;
      }
    }
    return null;
  }

  findDirectionalLight(): DirectionalLight | null {
    for (const go of this.gameObjects) {
      const l = go.getComponent(DirectionalLight);
      if (l) {
        return l;
      }
    }
    return null;
  }

  collectMeshRenderers(): MeshRenderer[] {
    const result: MeshRenderer[] = [];
    for (const go of this.gameObjects) {
      this._collectMeshRenderersRecursive(go, result);
    }
    return result;
  }

  private _collectMeshRenderersRecursive(go: GameObject, result: MeshRenderer[]): void {
    const mr = go.getComponent(MeshRenderer);
    if (mr) {
      result.push(mr);
    }
    for (const child of go.children) {
      this._collectMeshRenderersRecursive(child, result);
    }
  }

  getComponents<T extends Component>(ctor: new (...args: never[]) => T): T[] {
    const result: T[] = [];
    for (const go of this.gameObjects) {
      const c = go.getComponent(ctor);
      if (c) {
        result.push(c);
      }
    }
    return result;
  }
}
