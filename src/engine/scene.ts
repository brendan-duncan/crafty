import { GameObject } from './game_object.js';
import { Camera } from './components/camera.js';
import { DirectionalLight } from './components/directional_light.js';
import { MeshRenderer } from './components/mesh_renderer.js';
import { Component } from './component.js';
import type { RenderContext } from '../renderer/render_context.js';

/**
 * Top-level container for the GameObject hierarchy.
 *
 * Holds the root-level {@link GameObject}s for a frame. {@link Scene.update}
 * recursively ticks every component in the hierarchy; the renderer then
 * queries the scene (via {@link Scene.findCamera}, {@link Scene.findDirectionalLight},
 * {@link Scene.collectMeshRenderers}, {@link Scene.getComponents}) to build
 * its per-pass draw lists.
 */
export class Scene {
  /** Root-level GameObjects in this scene. */
  readonly gameObjects: GameObject[] = [];

  /**
   * Adds a root GameObject to the scene.
   *
   * @param go - GameObject to add.
   */
  add(go: GameObject): void {
    this.gameObjects.push(go);
  }

  /**
   * Removes a root GameObject from the scene if present.
   *
   * @param go - GameObject to remove.
   */
  remove(go: GameObject): void {
    const idx = this.gameObjects.indexOf(go);
    if (idx !== -1) {
      this.gameObjects.splice(idx, 1);
    }
  }

  /**
   * Recursively updates every root GameObject and its children.
   *
   * @param dt - Frame delta time in seconds.
   */
  update(dt: number): void {
    for (const go of this.gameObjects) {
      if (!go.enabled) {
        continue;
      }
      go.update(dt);
    }
  }

  /**
   * Recursively refreshes per-frame render state on every root GameObject and
   * its children. Call after {@link update} and any input/controller mutations
   * so cached state (e.g. camera matrices) reflects the final transforms.
   *
   * @param ctx - Active render context.
   */
  updateRender(ctx: RenderContext): void {
    for (const go of this.gameObjects) {
      if (!go.enabled) {
        continue;
      }
      go.updateRender(ctx);
    }
  }

  /**
   * Returns the first {@link Camera} found on a root GameObject, or null.
   *
   * Note: this only searches roots, not children.
   */
  findCamera(): Camera | null {
    for (const go of this.gameObjects) {
      if (!go.enabled) {
        continue;
      }
      const c = go.getComponent(Camera);
      if (c) {
        return c;
      }
    }
    return null;
  }

  /**
   * Returns the first {@link DirectionalLight} found on a root GameObject, or null.
   *
   * Note: this only searches roots, not children.
   */
  findDirectionalLight(): DirectionalLight | null {
    for (const go of this.gameObjects) {
      if (!go.enabled) {
        continue;
      }
      const l = go.getComponent(DirectionalLight);
      if (l) {
        return l;
      }
    }
    return null;
  }

  /**
   * Walks the full hierarchy and returns every {@link MeshRenderer} found.
   *
   * Used by the world geometry pass and shadow passes to build draw lists.
   */
  collectMeshRenderers(): MeshRenderer[] {
    const result: MeshRenderer[] = [];
    for (const go of this.gameObjects) {
      if (!go.enabled) {
        continue;
      }
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
      if (!child.enabled) {
        continue;
      }
      this._collectMeshRenderersRecursive(child, result);
    }
  }

  /**
   * Returns one component of the given type per root GameObject (the first match
   * via {@link GameObject.getComponent}). Does not recurse into children.
   *
   * @param ctor - Component subclass constructor used as a type filter.
   */
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
