/**
 * Named cache and lifetime owner for shared meshes, textures, and shaders.
 *
 * Assets registered here are kept alive for the lifetime of the manager and
 * destroyed in bulk via `destroy()`. Use this to share GPU resources between
 * scenes or render passes.
 */
export class AssetManager {
    _meshes = new Map();
    _textures = new Map();
    _shaders = new Map();
    /**
     * Registers a mesh under the given name, replacing any existing entry.
     *
     * @param name - Lookup key.
     * @param mesh - Mesh to take ownership of.
     */
    addMesh(name, mesh) { this._meshes.set(name, mesh); }
    /**
     * Looks up a previously registered mesh.
     *
     * @param name - Lookup key.
     * @returns The mesh, or `undefined` if not registered.
     */
    getMesh(name) { return this._meshes.get(name); }
    /**
     * Registers a texture under the given name, replacing any existing entry.
     *
     * @param name - Lookup key.
     * @param tex - Texture to take ownership of.
     */
    addTexture(name, tex) { this._textures.set(name, tex); }
    /**
     * Looks up a previously registered texture.
     *
     * @param name - Lookup key.
     * @returns The texture, or `undefined` if not registered.
     */
    getTexture(name) { return this._textures.get(name); }
    /**
     * Registers a shader under the given name, replacing any existing entry.
     *
     * @param name - Lookup key.
     * @param shader - Shader to register.
     */
    addShader(name, shader) { this._shaders.set(name, shader); }
    /**
     * Looks up a previously registered shader.
     *
     * @param name - Lookup key.
     * @returns The shader, or `undefined` if not registered.
     */
    getShader(name) { return this._shaders.get(name); }
    /**
     * Destroys all owned meshes and textures and clears every cache.
     */
    destroy() {
        this._meshes.forEach(m => m.destroy());
        this._textures.forEach(t => t.destroy());
        this._meshes.clear();
        this._textures.clear();
        this._shaders.clear();
    }
}
