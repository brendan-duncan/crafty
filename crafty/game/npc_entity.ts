import { GameObject } from '../../src/engine/index.js';
import { Vec3 } from '../../src/math/index.js';
import type { BlockWorld } from '../../src/block/world.js';
import type { Scene } from '../../src/engine/index.js';

export abstract class NPCEntity extends GameObject {
  static playerPos: Vec3 = new Vec3(0, 0, 0);

  protected world: BlockWorld;
  protected scene: Scene;

  isStatic = false;   // If true, the entity will stay in an idle state, or not otherwise move.

  constructor(name: string, world: BlockWorld, scene: Scene) {
    super({ name });
    this.world = world;
    this.scene = scene;
  }

  protected getChild(name: string): GameObject | null {
    for (const child of this.children) {
      if (child.name === name) {
        return child;
      }
    }
    return null;
  }

  setStatic(isStatic: boolean = true): void {
    this.isStatic = isStatic;
  }
}
