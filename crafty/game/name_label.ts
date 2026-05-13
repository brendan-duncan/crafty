import { Mat4, Vec3, Vec4 } from '../../src/math/index.js';

const MAX_LABEL_DISTANCE = 64;

/**
 * Container that owns a single absolutely-positioned overlay div per remote
 * player and projects them onto the screen each frame.
 *
 * Anchored to a parent element (usually the canvas's parent). Labels are added
 * as the player joins (`add`) and removed on leave (`remove`). `update` walks
 * all live labels, projects their world-space anchor with the camera's
 * `viewProjectionMatrix`, and positions the corresponding div.
 */
export class NameLabelLayer
{
  private readonly _root: HTMLDivElement;
  private readonly _labels = new Map<number, HTMLDivElement>();

  constructor(parent: HTMLElement)
  {
    const root = document.createElement('div');
    root.style.position = 'absolute';
    root.style.left = '0';
    root.style.top = '0';
    root.style.width = '100%';
    root.style.height = '100%';
    root.style.pointerEvents = 'none';
    root.style.overflow = 'hidden';
    parent.appendChild(root);
    this._root = root;
  }

  add(playerId: number, name: string): void
  {
    if (this._labels.has(playerId)) {
      return;
    }
    const div = document.createElement('div');
    div.textContent = name;
    div.style.position = 'absolute';
    div.style.transform = 'translate(-50%, -100%)';
    div.style.padding = '2px 6px';
    div.style.font = '12px sans-serif';
    div.style.color = '#fff';
    div.style.background = 'rgba(0,0,0,0.55)';
    div.style.border = '1px solid rgba(255,255,255,0.2)';
    div.style.borderRadius = '4px';
    div.style.whiteSpace = 'nowrap';
    div.style.userSelect = 'none';
    div.style.display = 'none';
    this._root.appendChild(div);
    this._labels.set(playerId, div);
  }

  remove(playerId: number): void
  {
    const div = this._labels.get(playerId);
    if (div !== undefined) {
      div.remove();
      this._labels.delete(playerId);
    }
  }

  /** Project each labeled position to screen. Caller supplies world-space anchors. */
  update(viewProj: Mat4, camPos: Vec3, viewportW: number, viewportH: number, anchors: Map<number, Vec3>): void
  {
    for (const [playerId, div] of this._labels) {
      const anchor = anchors.get(playerId);
      if (anchor === undefined) {
        div.style.display = 'none';
        continue;
      }
      const dx = anchor.x - camPos.x;
      const dy = anchor.y - camPos.y;
      const dz = anchor.z - camPos.z;
      const distSq = dx * dx + dy * dy + dz * dz;
      if (distSq > MAX_LABEL_DISTANCE * MAX_LABEL_DISTANCE) {
        div.style.display = 'none';
        continue;
      }
      const clip = viewProj.transformVec4(new Vec4(anchor.x, anchor.y, anchor.z, 1));
      if (clip.w <= 0.001) {
        div.style.display = 'none';
        continue;
      }
      const ndcX = clip.x / clip.w;
      const ndcY = clip.y / clip.w;
      if (ndcX < -1 || ndcX > 1 || ndcY < -1 || ndcY > 1) {
        div.style.display = 'none';
        continue;
      }
      const px = (ndcX * 0.5 + 0.5) * viewportW;
      const py = (1 - (ndcY * 0.5 + 0.5)) * viewportH;
      div.style.display = 'block';
      div.style.left = `${px}px`;
      div.style.top = `${py}px`;
    }
  }
}
