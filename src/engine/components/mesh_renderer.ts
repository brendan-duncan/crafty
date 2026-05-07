import { Component } from '../component.js';
import type { Mesh } from '../../assets/mesh.js';
import { Material } from '../material.js';

export { Material } from '../material.js';

/**
 * Component that draws a {@link Mesh} with a {@link Material}.
 *
 * Discovered each frame by {@link Scene.collectMeshRenderers} and submitted
 * by the world geometry pass (and the cascade/spot/point shadow passes when
 * castShadow is true).
 */
export class MeshRenderer extends Component {
  mesh: Mesh;
  material: Material;
  /** Whether this mesh contributes to shadow map rendering. */
  castShadow = true;

  /**
   * @param mesh - The mesh asset to draw.
   * @param material - The material describing how to shade the mesh.
   */
  constructor(mesh: Mesh, material: Material) {
    super();
    this.mesh = mesh;
    this.material = material;
  }
}
