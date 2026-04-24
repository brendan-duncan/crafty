import type { GameObject } from './game_object.js';

export abstract class Component {
  gameObject!: GameObject;

  onAttach(): void {}
  onDetach(): void {}
  update(_dt: number): void {}
}
