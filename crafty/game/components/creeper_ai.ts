import { Vec3 } from '../../../src/math/index.js';
import { Quaternion } from '../../../src/math/quaternion.js';
import { Component } from '../../../src/engine/component.js';
import { Scene } from '../../../src/engine/scene.js';
import { MeshRenderer } from '../../../src/engine/components/mesh_renderer.js';
import { PbrMaterial } from '../../../src/renderer/materials/pbr_material.js';
import { NPCEntity } from '../npc_entity.js';
import { Creeper } from '../entities/creeper_entity.js';
import type { BlockWorld } from '../../../src/block/world.js';

type CreeperState = 'idle' | 'wander' | 'chase' | 'detonate';

const _Y_AXIS = new Vec3(0, 1, 0);

const DETECT_RADIUS_SQ = 16;        // 4 blocks
const LOST_RADIUS_SQ = 25;         // 5 blocks
const TOUCH_RADIUS_SQ = 3.24;       // 1.8 blocks
const DETONATE_CANCEL_RADIUS_SQ = 36; // 6 blocks
const DETONATE_TIME = 2.5;

const EXPLOSION_RADIUS = 4;

const CREEPER_GREEN: [number, number, number, number] = [0.37, 0.82, 0.22, 1];
const FLASH_WHITE: [number, number, number, number] = [0.95, 0.45, 0.45, 1];

export class CreeperAI extends Component {
  private _world: BlockWorld;
  private _scene: Scene;
  private _state: CreeperState = 'idle';
  private _timer = 0;
  private _targetX = 0;
  private _targetZ = 0;
  private _hasTarget = false;
  private _velY = 0;
  private _yaw = 0;

  private _detonateElapsed = 0;
  private _flashToggle = false;
  private _flashAccum = 0;

  constructor(world: BlockWorld, scene: Scene) {
    super();
    this._world = world;
    this._scene = scene;
    this._timer = 2 + Math.random() * 4;
    this._yaw = Math.random() * Math.PI * 2;
  }

  onAttach(): void {
  }

  update(dt: number): void {
    const go = this.gameObject as NPCEntity;
    const gx = go.position.x;
    const gz = go.position.z;

    if (go.isStatic) {
      return;
    }

    const player = NPCEntity.playerPos;
    const dpx = player.x - gx;
    const dpz = player.z - gz;
    const playerDist2 = dpx * dpx + dpz * dpz;

    this._velY -= 9.8 * dt;
    go.position.y += this._velY * dt;
    const groundY = this._world.getTopBlockY(Math.floor(gx), Math.floor(gz), Math.ceil(go.position.y) + 4);
    if (groundY > 0 && go.position.y <= groundY + 0.1) {
      go.position.y = groundY;
      this._velY = 0;
    }

    switch (this._state) {
      case 'idle': {
        this._timer -= dt;
        if (playerDist2 < DETECT_RADIUS_SQ) {
          this._enterChase();
        } else if (this._timer <= 0) {
          this._pickWanderTarget();
        }
        break;
      }

      case 'wander': {
        this._timer -= dt;
        if (playerDist2 < DETECT_RADIUS_SQ) {
          this._enterChase();
          break;
        }
        if (!this._hasTarget || this._timer <= 0) {
          this._enterIdle();
          break;
        }
        const dx = this._targetX - gx;
        const dz = this._targetZ - gz;
        const dist2 = dx * dx + dz * dz;
        if (dist2 < 0.25) {
          this._enterIdle();
          break;
        }
        const dist = Math.sqrt(dist2);
        go.position.x += (dx / dist) * 1.0 * dt;
        go.position.z += (dz / dist) * 1.0 * dt;
        this._yaw = Math.atan2(-(dx / dist), -(dz / dist));
        break;
      }

      case 'chase': {
        if (playerDist2 > LOST_RADIUS_SQ) {
          this._enterIdle();
          break;
        }
        if (playerDist2 < TOUCH_RADIUS_SQ) {
          this._enterDetonate();
          break;
        }
        const dist = Math.sqrt(playerDist2);
        const nx = dpx / dist;
        const nz = dpz / dist;
        go.position.x += nx * 1.8 * dt;
        go.position.z += nz * 1.8 * dt;
        this._yaw = Math.atan2(-nx, -nz);
        break;
      }

      case 'detonate': {
        if (playerDist2 > DETONATE_CANCEL_RADIUS_SQ) {
          this._exitDetonate();
          break;
        }
        this._detonateElapsed += dt;
        this._flashAccum += dt;
        const flashInterval = Math.max(0.08, 0.5 - this._detonateElapsed * 0.18);
        if (this._flashAccum >= flashInterval) {
          this._flashAccum -= flashInterval;
          this._flashToggle = !this._flashToggle;
          this._updateFlash();
        }
        if (this._detonateElapsed >= DETONATE_TIME) {
          this._explode();
        }
        break;
      }
    }

    go.rotation = Quaternion.fromAxisAngle(_Y_AXIS, this._yaw);
  }

  private _enterIdle(): void {
    this._state = 'idle';
    this._hasTarget = false;
    this._timer = 2 + Math.random() * 4;
  }

  private _enterChase(): void {
    this._state = 'chase';
    this._hasTarget = false;
  }

  private _enterDetonate(): void {
    this._state = 'detonate';
    this._detonateElapsed = 0;
    this._flashAccum = 0;
    this._flashToggle = true;
    this._updateFlash();
  }

  private _exitDetonate(): void {
    this._state = 'idle';
    this._hasTarget = false;
    this._timer = 1 + Math.random() * 2;
    this._setColor(CREEPER_GREEN);
  }

  private _pickWanderTarget(): void {
    const go = this.gameObject;
    const angle = Math.random() * Math.PI * 2;
    const dist  = 3 + Math.random() * 6;
    this._targetX = go.position.x + Math.cos(angle) * dist;
    this._targetZ = go.position.z + Math.sin(angle) * dist;
    this._hasTarget = true;
    this._state = 'wander';
    this._timer = 4 + Math.random() * 4;
  }

  private _updateFlash(): void {
    this._setColor(this._flashToggle ? FLASH_WHITE : CREEPER_GREEN);
  }

  private _setColor(color: [number, number, number, number]): void {
    const go = this.gameObject;
    for (const child of go.children) {
      const renderer = child.getComponent(MeshRenderer);
      if (renderer && renderer.material instanceof PbrMaterial) {
        renderer.material.albedo = color;
        renderer.material.markDirty();
      }
    }
  }

  private _explode(): void {
    const go = this.gameObject;
    const cx = Math.floor(go.position.x);
    const cy = Math.floor(go.position.y);
    const cz = Math.floor(go.position.z);

    Creeper.onExplode?.(go.position.x, go.position.y, go.position.z);

    const r = EXPLOSION_RADIUS;
    for (let dx = -r; dx <= r; dx++) {
      for (let dy = -r; dy <= r; dy++) {
        for (let dz = -r; dz <= r; dz++) {
          if (dx * dx + dy * dy + dz * dz <= r * r) {
            Creeper.onBlockDestroyed?.(cx + dx, cy + dy, cz + dz);
            this._world.mineBlock(cx + dx, cy + dy, cz + dz);
          }
        }
      }
    }

    this._scene.remove(go);
  }
}
