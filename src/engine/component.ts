import type { GameObject } from './game_object.js';

/**
 * Abstract base class for all behaviors attached to a {@link GameObject}.
 *
 * Subclasses add behavior or rendering data to a GameObject. The instance is
 * bound to its owner via {@link GameObject.addComponent}, which sets
 * {@link Component.gameObject} and then calls {@link Component.onAttach}.
 * {@link Component.update} is invoked once per frame as part of the scene's
 * traversal, and {@link Component.onDetach} runs when the component is
 * removed via {@link GameObject.removeComponent}.
 */
export abstract class Component {
  /** The owning GameObject; assigned by addComponent before onAttach runs. */
  gameObject!: GameObject;

  /**
   * Called once when the component is added to a GameObject. Override to
   * acquire references to siblings/children or initialise resources.
   */
  onAttach(): void {}

  /**
   * Called once when the component is removed from its GameObject. Override
   * to release resources or unsubscribe from events.
   */
  onDetach(): void {}

  /**
   * Called every frame by the GameObject's update traversal.
   *
   * @param _dt - Frame delta time in seconds.
   */
  update(_dt: number): void {}
}
