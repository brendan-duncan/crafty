import { Mesh } from './mesh.js';
import { Texture } from './texture.js';
import { Shader } from './shader.js';

/**
 * Named cache and lifetime owner for shared meshes, textures, and shaders.
 *
 * Assets registered here are kept alive for the lifetime of the manager and
 * destroyed in bulk via `destroy()`. Use this to share GPU resources between
 * scenes or render passes.
 */
export class AssetManager {
  private _meshes = new Map<string, Mesh>();
  private _textures = new Map<string, Texture>();
  private _shaders = new Map<string, Shader>();

  /**
   * Registers a mesh under the given name, replacing any existing entry.
   *
   * @param name - Lookup key.
   * @param mesh - Mesh to take ownership of.
   */
  addMesh(name: string, mesh: Mesh): void { this._meshes.set(name, mesh); }

  /**
   * Looks up a previously registered mesh.
   *
   * @param name - Lookup key.
   * @returns The mesh, or `undefined` if not registered.
   */
  getMesh(name: string): Mesh | undefined { return this._meshes.get(name); }

  /**
   * Registers a texture under the given name, replacing any existing entry.
   *
   * @param name - Lookup key.
   * @param tex - Texture to take ownership of.
   */
  addTexture(name: string, tex: Texture): void { this._textures.set(name, tex); }

  /**
   * Looks up a previously registered texture.
   *
   * @param name - Lookup key.
   * @returns The texture, or `undefined` if not registered.
   */
  getTexture(name: string): Texture | undefined { return this._textures.get(name); }

  /**
   * Registers a shader under the given name, replacing any existing entry.
   *
   * @param name - Lookup key.
   * @param shader - Shader to register.
   */
  addShader(name: string, shader: Shader): void { this._shaders.set(name, shader); }

  /**
   * Looks up a previously registered shader.
   *
   * @param name - Lookup key.
   * @returns The shader, or `undefined` if not registered.
   */
  getShader(name: string): Shader | undefined { return this._shaders.get(name); }

  /**
   * Destroys all owned meshes and textures and clears every cache.
   */
  destroy(): void {
    this._meshes.forEach(m => m.destroy());
    this._textures.forEach(t => t.destroy());
    this._meshes.clear();
    this._textures.clear();
    this._shaders.clear();
  }
}
