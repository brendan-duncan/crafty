import { Vec3 } from '../../math/index.js';
import { Quaternion } from '../../math/quaternion.js';
import { Component } from '../component.js';
import type { World } from '../../block/world.js';

type PigState = 'idle' | 'wander';

const _Y_AXIS = new Vec3(0, 1, 0);

/**
 * Wandering NPC behaviour for pig GameObjects.
 *
 * Implements a two-state machine (idle ↔ wander) plus gravity, ground
 * collision, head-bob animation on a 'Pig.Head' child GameObject, and yaw
 * rotation based on movement direction. Pigs are docile — they never flee
 * from the player.
 */
export class PigAI extends Component {
  private _world: World;
  private _state: PigState = 'idle';
  private _timer = 0;
  private _targetX = 0;
  private _targetZ = 0;
  private _hasTarget = false;
  private _velY = 0;
  private _yaw = 0;

  private _headGO: import('../game_object.js').GameObject | null = null;
  private _headBaseY = 0;
  private _bobPhase: number;

  constructor(world: World) {
    super();
    this._world = world;
    this._timer = 1 + Math.random() * 5;
    this._yaw = Math.random() * Math.PI * 2;
    this._bobPhase = Math.random() * Math.PI * 2;
  }

  onAttach(): void {
    for (const child of this.gameObject.children) {
      if (child.name === 'Pig.Head') {
        this._headGO = child;
        this._headBaseY = child.position.y;
        break;
      }
    }
  }

  update(dt: number): void {
    const go = this.gameObject;
    const gx = go.position.x;
    const gz = go.position.z;

    // ── Gravity / ground collision ───────────────────────────────────────────
    this._velY -= 9.8 * dt;
    go.position.y += this._velY * dt;
    const groundY = this._world.getTopBlockY(Math.floor(gx), Math.floor(gz), Math.ceil(go.position.y) + 4);
    if (groundY > 0 && go.position.y <= groundY + 0.1) {
      go.position.y = groundY;
      this._velY = 0;
    }

    // ── State machine ────────────────────────────────────────────────────────
    switch (this._state) {
      case 'idle': {
        this._timer -= dt;
        if (this._timer <= 0) {
          this._pickWanderTarget();
        }
        break;
      }

      case 'wander': {
        this._timer -= dt;
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
        go.position.x += (dx / dist) * 1.2 * dt;
        go.position.z += (dz / dist) * 1.2 * dt;
        this._yaw = Math.atan2(-(dx / dist), -(dz / dist));
        break;
      }
    }

    // ── Apply yaw rotation ───────────────────────────────────────────────────
    go.rotation = Quaternion.fromAxisAngle(_Y_AXIS, this._yaw);

    // ── Head bob ─────────────────────────────────────────────────────────────
    if (this._headGO) {
      this._bobPhase += dt * (this._state === 'wander' ? 4 : 1.5);
      const bobAmp = this._state === 'wander' ? 0.014 : 0.005;
      this._headGO.position.y = this._headBaseY + Math.sin(this._bobPhase) * bobAmp;
    }
  }

  private _enterIdle(): void {
    this._state = 'idle';
    this._hasTarget = false;
    this._timer = 3 + Math.random() * 5;
  }

  private _pickWanderTarget(): void {
    const go = this.gameObject;
    const angle = Math.random() * Math.PI * 2;
    const dist  = 4 + Math.random() * 8;
    this._targetX = go.position.x + Math.cos(angle) * dist;
    this._targetZ = go.position.z + Math.sin(angle) * dist;
    this._hasTarget = true;
    this._state = 'wander';
    this._timer = 8 + Math.random() * 7;
  }
}
