import { Mesh } from './mesh.js';
import { Texture } from './texture.js';
import { Shader } from './shader.js';

export class AssetManager {
  private _meshes = new Map<string, Mesh>();
  private _textures = new Map<string, Texture>();
  private _shaders = new Map<string, Shader>();

  addMesh(name: string, mesh: Mesh): void { this._meshes.set(name, mesh); }
  getMesh(name: string): Mesh | undefined { return this._meshes.get(name); }

  addTexture(name: string, tex: Texture): void { this._textures.set(name, tex); }
  getTexture(name: string): Texture | undefined { return this._textures.get(name); }

  addShader(name: string, shader: Shader): void { this._shaders.set(name, shader); }
  getShader(name: string): Shader | undefined { return this._shaders.get(name); }

  destroy(): void {
    this._meshes.forEach(m => m.destroy());
    this._textures.forEach(t => t.destroy());
    this._meshes.clear();
    this._textures.clear();
    this._shaders.clear();
  }
}
