import { Component } from '../component.js';
import type { Mesh } from '../../assets/mesh.js';
import type { Texture } from '../../assets/texture.js';

/**
 * PBR material parameters consumed by the world geometry / forward pass.
 */
export interface Material {
  /** Base colour with alpha (linear RGBA, 0–1). */
  albedo: [number, number, number, number];
  /** Surface roughness 0 (smooth) – 1 (rough). */
  roughness: number;
  /** Metallic factor 0 (dielectric) – 1 (metal). */
  metallic: number;
  /** UV atlas offset added after uvScale. Defaults to [0,0]. */
  uvOffset?: [number, number];
  /** UV atlas scale multiplied into mesh UVs. Defaults to [1,1]. */
  uvScale?: [number, number];
  /** Tile repeat count across the mesh. Defaults to [1,1]. */
  uvTile?: [number, number];
  /** RGB multiplied with albedo colour; sRGB format recommended. */
  albedoMap?: Texture;
  /** Tangent-space normal map (rgb, linear). */
  normalMap?: Texture;
  /** Packed map: r=metallic multiplier, g=emissive (unused), b=roughness multiplier. */
  merMap?: Texture;
}

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
   * @param material - Optional material overrides; missing fields use sensible defaults.
   */
  constructor(mesh: Mesh, material: Partial<Material> = {}) {
    super();
    this.mesh = mesh;
    this.material = {
      albedo: material.albedo ?? [1, 1, 1, 1],
      roughness: material.roughness ?? 0.5,
      metallic: material.metallic ?? 0,
      uvOffset: material.uvOffset,
      uvScale: material.uvScale,
      uvTile: material.uvTile,
      albedoMap: material.albedoMap,
      normalMap: material.normalMap,
      merMap: material.merMap,
    };
  }
}
