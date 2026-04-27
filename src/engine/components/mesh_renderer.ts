import { Component } from '../component.js';
import type { Mesh } from '../../assets/mesh.js';
import type { Texture } from '../../assets/texture.js';

export interface Material {
  albedo: [number, number, number, number];
  roughness: number;
  metallic: number;
  // UV atlas transform: mesh UVs are multiplied by uvScale then offset by uvOffset.
  // Defaults to offset=[0,0] scale=[1,1] (identity — use whole texture).
  uvOffset?: [number, number];
  uvScale ?: [number, number];
  uvTile  ?: [number, number]; // how many times the tile repeats across the mesh (default 1,1)
  // Optional texture maps. Unset slots use 1×1 fallback textures in the geometry pass.
  albedoMap?: Texture;  // rgb multiplied with albedo colour; srgb format recommended
  normalMap?: Texture;  // tangent-space normal map (rgb, linear)
  merMap   ?: Texture;  // r=metallic multiplier, g=emissive (unused), b=roughness multiplier
}

export class MeshRenderer extends Component {
  mesh: Mesh;
  material: Material;
  castShadow = true;

  constructor(mesh: Mesh, material: Partial<Material> = {}) {
    super();
    this.mesh = mesh;
    this.material = {
      albedo: material.albedo ?? [1, 1, 1, 1],
      roughness: material.roughness ?? 0.5,
      metallic: material.metallic ?? 0,
      uvOffset: material.uvOffset,
      uvScale:  material.uvScale,
      uvTile:   material.uvTile,
      albedoMap: material.albedoMap,
      normalMap: material.normalMap,
      merMap:    material.merMap,
    };
  }
}
