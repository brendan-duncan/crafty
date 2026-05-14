import type { TextureDesc, BufferDesc } from './types.js';

/**
 * Pool of GPU textures and buffers keyed by descriptor. Survives graph
 * compile/execute cycles so transient virtual resources can be backed by
 * the same physical objects across frames without recreation, and so that
 * persistent resources (shadow maps, TAA history, IBL data) live across
 * graph rebuilds.
 *
 * Pooling here is a straight free-list per descriptor hash. Lifetime-overlap
 * memory aliasing is intentionally out of scope for the first cut.
 */
export class PhysicalResourceCache {
  private readonly _device: GPUDevice;
  /** Free pools keyed by descriptor hash. Released transients land here. */
  private readonly _texturePool = new Map<string, GPUTexture[]>();
  private readonly _bufferPool = new Map<string, GPUBuffer[]>();
  /** Texture/buffer + descriptor for every transient currently checked out. */
  private readonly _liveTransients: { kind: 'tex' | 'buf'; key: string; resource: GPUTexture | GPUBuffer }[] = [];
  /** Persistent registry: stable string key → resource, never returned to pool. */
  private readonly _persistentTextures = new Map<string, { texture: GPUTexture; descKey: string }>();
  private readonly _persistentBuffers = new Map<string, { buffer: GPUBuffer; descKey: string }>();
  /** Cache of texture views — built lazily, evicted when their owning texture is destroyed. */
  private readonly _viewCache = new WeakMap<GPUTexture, Map<string, GPUTextureView>>();

  constructor(device: GPUDevice) {
    this._device = device;
  }

  /** Acquire a transient texture matching `desc`. Reused from the pool when possible. */
  acquireTexture(desc: TextureDesc, usage: GPUTextureUsageFlags): GPUTexture {
    const key = textureKey(desc, usage);
    const pool = this._texturePool.get(key);
    let tex = pool?.pop();
    if (!tex) {
      tex = this._device.createTexture({
        label: desc.label,
        size: {
          width: desc.width,
          height: desc.height,
          depthOrArrayLayers: desc.depthOrArrayLayers ?? 1,
        },
        format: desc.format,
        mipLevelCount: desc.mipLevelCount ?? 1,
        sampleCount: desc.sampleCount ?? 1,
        dimension: desc.dimension ?? '2d',
        usage,
      });
    }
    this._liveTransients.push({ kind: 'tex', key, resource: tex });
    return tex;
  }

  /** Acquire a transient buffer matching `desc`. Reused from the pool when possible. */
  acquireBuffer(desc: BufferDesc, usage: GPUBufferUsageFlags): GPUBuffer {
    const key = bufferKey(desc, usage);
    const pool = this._bufferPool.get(key);
    let buf = pool?.pop();
    if (!buf) {
      buf = this._device.createBuffer({
        label: desc.label,
        size: desc.size,
        usage,
      });
    }
    this._liveTransients.push({ kind: 'buf', key, resource: buf });
    return buf;
  }

  /**
   * Release every transient checked out since the last call. Persistent
   * resources are unaffected. Called by the graph at the end of execute().
   */
  releaseAllTransients(): void {
    for (const entry of this._liveTransients) {
      if (entry.kind === 'tex') {
        let pool = this._texturePool.get(entry.key);
        if (!pool) {
          pool = [];
          this._texturePool.set(entry.key, pool);
        }
        pool.push(entry.resource as GPUTexture);
      } else {
        let pool = this._bufferPool.get(entry.key);
        if (!pool) {
          pool = [];
          this._bufferPool.set(entry.key, pool);
        }
        pool.push(entry.resource as GPUBuffer);
      }
    }
    this._liveTransients.length = 0;
  }

  /**
   * Get-or-create a persistent texture identified by `key`. Subsequent calls
   * with the same key return the same physical texture. Requesting a key with
   * an incompatible descriptor is treated as a recreate (old texture destroyed).
   */
  getOrCreatePersistentTexture(key: string, desc: TextureDesc, usage: GPUTextureUsageFlags): GPUTexture {
    const existing = this._persistentTextures.get(key);
    const descKey = textureKey(desc, usage);
    if (existing) {
      if (existing.descKey === descKey) return existing.texture;
      existing.texture.destroy();
      this._persistentTextures.delete(key);
    }
    const tex = this._device.createTexture({
      label: desc.label ?? key,
      size: {
        width: desc.width,
        height: desc.height,
        depthOrArrayLayers: desc.depthOrArrayLayers ?? 1,
      },
      format: desc.format,
      mipLevelCount: desc.mipLevelCount ?? 1,
      sampleCount: desc.sampleCount ?? 1,
      dimension: desc.dimension ?? '2d',
      usage,
    });
    this._persistentTextures.set(key, { texture: tex, descKey });
    return tex;
  }

  /** Get-or-create a persistent buffer identified by `key`. */
  getOrCreatePersistentBuffer(key: string, desc: BufferDesc, usage: GPUBufferUsageFlags): GPUBuffer {
    const existing = this._persistentBuffers.get(key);
    const descKey = bufferKey(desc, usage);
    if (existing) {
      if (existing.descKey === descKey) return existing.buffer;
      existing.buffer.destroy();
      this._persistentBuffers.delete(key);
    }
    const buf = this._device.createBuffer({
      label: desc.label ?? key,
      size: desc.size,
      usage,
    });
    this._persistentBuffers.set(key, { buffer: buf, descKey });
    return buf;
  }

  /**
   * Get a view of `texture` matching `viewDesc`, cached by descriptor stringification.
   * The cache is automatically cleared when the texture is destroyed (WeakMap).
   */
  getOrCreateView(texture: GPUTexture, viewDesc?: GPUTextureViewDescriptor): GPUTextureView {
    let perTexture = this._viewCache.get(texture);
    if (!perTexture) {
      perTexture = new Map();
      this._viewCache.set(texture, perTexture);
    }
    const key = viewDesc ? JSON.stringify(viewDesc) : '';
    let view = perTexture.get(key);
    if (!view) {
      view = texture.createView(viewDesc);
      perTexture.set(key, view);
    }
    return view;
  }

  /**
   * Drop and destroy every pooled (non-checked-out, non-persistent) resource.
   * Use after a canvas resize to reclaim now-wrong-sized textures.
   */
  trimUnused(): void {
    for (const pool of this._texturePool.values()) {
      for (const t of pool) t.destroy();
      pool.length = 0;
    }
    this._texturePool.clear();
    for (const pool of this._bufferPool.values()) {
      for (const b of pool) b.destroy();
      pool.length = 0;
    }
    this._bufferPool.clear();
  }

  /** Destroy a single persistent resource by key. No-op if not present. */
  destroyPersistentTexture(key: string): void {
    const entry = this._persistentTextures.get(key);
    if (entry) {
      entry.texture.destroy();
      this._persistentTextures.delete(key);
    }
  }

  destroyPersistentBuffer(key: string): void {
    const entry = this._persistentBuffers.get(key);
    if (entry) {
      entry.buffer.destroy();
      this._persistentBuffers.delete(key);
    }
  }

  /** Destroy every resource owned by the cache. */
  destroy(): void {
    this.trimUnused();
    for (const entry of this._liveTransients) {
      if (entry.kind === 'tex') (entry.resource as GPUTexture).destroy();
      else (entry.resource as GPUBuffer).destroy();
    }
    this._liveTransients.length = 0;
    for (const entry of this._persistentTextures.values()) entry.texture.destroy();
    this._persistentTextures.clear();
    for (const entry of this._persistentBuffers.values()) entry.buffer.destroy();
    this._persistentBuffers.clear();
  }
}

function textureKey(desc: TextureDesc, usage: GPUTextureUsageFlags): string {
  return `${desc.format}|${desc.width}x${desc.height}x${desc.depthOrArrayLayers ?? 1}|m${desc.mipLevelCount ?? 1}|s${desc.sampleCount ?? 1}|${desc.dimension ?? '2d'}|u${usage}`;
}

function bufferKey(desc: BufferDesc, usage: GPUBufferUsageFlags): string {
  return `s${desc.size}|u${usage}`;
}
