import { Vec3 } from '../../math/index.js';
import { Quaternion } from '../../math/quaternion.js';
import { Component } from '../component.js';
import type { GameObject } from '../game_object.js';
import type { World } from '../../block/world.js';

const _Y_AXIS = new Vec3(0, 1, 0);

/**
 * Follow behaviour for duckling GameObjects.
 *
 * Each duckling tracks its parent duck's world position and maintains a
 * personalised orbit offset so the brood spreads naturally rather than
 * stacking. The offset angle drifts slowly over time, giving the group a
 * gentle swirling motion. Ducklings do not flee from the player on their
 * own — they simply chase their parent, so they naturally mirror whatever
 * the parent does.
 */
export class DucklingAI extends Component {
  private _parent: GameObject;
  private _world: World;
  private _velY = 0;
  private _yaw = 0;

  private _headGO: GameObject | null = null;
  private _headBaseY = 0;
  private _bobPhase: number;

  // Polar offset from the parent that defines this duckling's target slot.
  private _offsetAngle: number;
  private _followDist: number;

  constructor(parent: GameObject, world: World) {
    super();
    this._parent = parent;
    this._world = world;
    this._offsetAngle = Math.random() * Math.PI * 2;
    this._followDist  = 0.55 + Math.random() * 0.5;
    this._bobPhase    = Math.random() * Math.PI * 2;
  }

  onAttach(): void {
    for (const child of this.gameObject.children) {
      if (child.name === 'Duckling.Head') {
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

    // ── Follow parent ────────────────────────────────────────────────────────
    // Drift the orbit angle so the brood gently swirls.
    this._offsetAngle += dt * 0.25;

    const tx = this._parent.position.x + Math.cos(this._offsetAngle) * this._followDist;
    const tz = this._parent.position.z + Math.sin(this._offsetAngle) * this._followDist;

    const dx = tx - gx;
    const dz = tz - gz;
    const dist2 = dx * dx + dz * dz;

    let moving = false;
    if (dist2 > 0.04) {
      const dist  = Math.sqrt(dist2);
      // Speed up when further behind so the duckling catches up quickly.
      const speed = dist > 2.5 ? 3.5 : 1.8;
      const nx = dx / dist;
      const nz = dz / dist;
      go.position.x += nx * speed * dt;
      go.position.z += nz * speed * dt;
      this._yaw = Math.atan2(-nx, -nz);
      moving = true;
    }

    // ── Apply yaw rotation ───────────────────────────────────────────────────
    go.rotation = Quaternion.fromAxisAngle(_Y_AXIS, this._yaw);

    // ── Head bob ─────────────────────────────────────────────────────────────
    if (this._headGO) {
      this._bobPhase += dt * (moving ? 7 : 2);
      const bobAmp = moving ? 0.012 : 0.004;
      this._headGO.position.y = this._headBaseY + Math.sin(this._bobPhase) * bobAmp;
    }
  }
}
