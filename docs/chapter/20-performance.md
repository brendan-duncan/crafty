# Chapter 20: Performance

[Contents](../crafty.md) | [19-Multiplayer Gameplay](19-multiplayer-gameplay.md) | [21-Tools](21-tools.md)

This chapter covers the profiling, optimisation, and culling techniques used to keep Crafty running at 60+ FPS on mid-range hardware.

## 20.1 GPU Timestamps and Profiling

Crafty uses WebGPU timestamp queries to measure per-pass GPU execution time:

```typescript
// Create query set
const querySet = device.createQuerySet({
  type: 'timestamp',
  count: passCount * 2,  // begin + end per pass
});

// In the command encoder:
const pass = encoder.beginRenderPass({ ... });
encoder.writeTimestamp(querySet, passIndex * 2);
// ... draw calls ...
encoder.writeTimestamp(querySet, passIndex * 2 + 1);
pass.end();

// Read back results
const results = new BigUint64Array(passCount * 2);
await device.queue.readBuffer(timestampBuffer, 0, results.buffer);

for (let i = 0; i < passCount; i++) {
  const duration = Number(results[i * 2 + 1] - results[i * 2]);
  const ms = duration / 1_000_000;  // Nanoseconds to milliseconds
  console.log(`Pass ${i}: ${ms.toFixed(2)} ms`);
}
```

Timestamp queries require the `'timestamp-query'` feature, which must be requested during device creation. The results identify which passes are GPU-bound.

## 20.2 Async Shader Compilation

Pipeline compilation is expensive. Crafty uses the `getCompilationInfo()` API to diagnose shader compile errors, and creates pipelines lazily (on first use) rather than upfront:

```typescript
private _getPipeline(device: GPUDevice, material: Material): GPURenderPipeline {
  let pipeline = this._pipelineCache.get(material.shaderId);
  if (pipeline) return pipeline;
  // Compile and cache — first frame with a new shader may hitch
  pipeline = device.createRenderPipeline({ ... });
  this._pipelineCache.set(material.shaderId, pipeline);
  return pipeline;
}
```

For materials that are always visible, pipelines can be compiled eagerly during the loading screen by iterating the material list and calling `_getPipeline` once.

## 20.3 Frustum Culling

Every chunk and mesh is tested against the camera frustum before rendering. The test uses the six planes of the view-projection frustum:

```typescript
function isVisible(aabb: AABB, frustum: Plane[]): boolean {
  for (const plane of frustum) {
    // Compute the signed distance of the AABB's positive vertex
    // (the vertex most in the direction of the plane normal)
    const px = plane.normal.x > 0 ? aabb.max.x : aabb.min.x;
    const py = plane.normal.y > 0 ? aabb.max.y : aabb.min.y;
    const pz = plane.normal.z > 0 ? aabb.max.z : aabb.min.z;
    if (plane.normal.dot(new Vec3(px, py, pz)) + plane.distance < 0) {
      return false;
    }
  }
  return true;
}
```

Frustum culling for chunks uses the chunk's axis-aligned bounding box (16×256×16 blocks). Mesh objects use their local AABB transformed to world space.

## 20.4 Occlusion Culling

Occlusion culling determines whether an object is hidden behind other objects (not just outside the frustum). Crafty uses a simple **temporal occlusion culling** approach:

1. Render a low-resolution depth buffer of occluders (large chunks in the near field).
2. For each cull candidate, test its bounding box against this depth buffer.
3. If fully occluded, skip the draw call.

This is implemented as a compute pass that reads the depth buffer and writes an indirect draw count.

## 20.5 Draw Call Batching

Chunk rendering uses **indirect draw** to issue many draws with a single call. The chunk visibility and draw parameters are computed on the GPU:

```typescript
// Indirect draw buffer: one draw command per visible chunk
struct DrawArraysIndirect {
  indexCount: u32;
  instanceCount: u32;
  firstIndex: u32;
  baseVertex: i32;
  firstInstance: u32;
};
```

A compute shader performs frustum culling on the GPU and packs visible chunks into the indirect buffer. This eliminates CPU-GPU round trips for chunk culling.

## 20.6 Memory Management

### Pre-Allocated Staging Arrays

Many passes pre-allocate `Float32Array` / `Uint32Array` scratch buffers to avoid per-frame GC pressure:

```typescript
// Reused per frame — never garbage collected
private readonly _modelData = new Float32Array(32);
private readonly _cameraScratch = new Float32Array(CAMERA_UNIFORM_SIZE / 4);
```

### Buffer Pooling

Per-draw model uniform buffers are grown on demand but never freed during gameplay:

```typescript
private _ensureModelBuffers(device: GPUDevice, count: number): void {
  while (this._modelBuffers.length < count) {
    const buffer = device.createBuffer({ ... });
    this._modelBuffers.push(buffer);
  }
}
```

This avoids allocation and deallocation churn when the draw count varies between frames.

### Texture Management

Textures are reference-counted and destroyed when no longer referenced. The asset manager caches loaded textures by URL:

```typescript
class TextureCache {
  private _cache = new Map<string, Promise<GPUTexture>>();

  get(url: string): Promise<GPUTexture> {
    if (!this._cache.has(url)) {
      this._cache.set(url, this._load(url));
    }
    return this._cache.get(url)!;
  }

  release(url: string): void {
    // Decrement reference count; destroy when zero
  }
}
```

**Further reading:**
- `src/renderer/passes/` — Per-pass buffer pre-allocation patterns
- `src/block/chunk.ts` — Chunk culling
- `crafty/main.ts` — Frame loop and performance tracking

----
[Contents](../crafty.md) | [19-Multiplayer Gameplay](19-multiplayer-gameplay.md) | [21-Tools](21-tools.md)
