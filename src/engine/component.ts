import type { GameObject } from './game_object.js';
import type { RenderContext } from '../renderer/render_context.js';

/**
 * Abstract base class for all behaviors attached to a {@link GameObject}.
 *
 * Subclasses add behavior or rendering data to a GameObject. The instance is
 * bound to its owner via {@link GameObject.addComponent}, which sets
 * {@link Component.gameObject} and then calls {@link Component.onAttach}.
 * {@link Component.update} is invoked once per frame as part of the scene's
 * simulation traversal; {@link Component.updateRender} runs once per frame
 * *after* simulation, when render passes are about to consume cached state
 * (e.g. {@link Camera} uses it to refresh view/projection matrices).
 * {@link Component.onDetach} runs when the component is removed via
 * {@link GameObject.removeComponent}.
 */
export abstract class Component {
  /** The owning GameObject; assigned by addComponent before onAttach runs. */
  gameObject!: GameObject;

  /**
   * Called once when the component is added to a GameObject. Override to
   * acquire references to siblings/children or initialize resources.
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

  /**
   * Called every frame by the GameObject's render traversal, *after* {@link update}
   * and any input/controller mutations to the transform. Override to refresh
   * per-frame state that render passes consume (e.g. {@link Camera} recomputes
   * its cached view/projection matrices here).
   *
   * @param _ctx - Active render context (provides canvas width/height etc.).
   */
  updateRender(_ctx: RenderContext): void {}
}
