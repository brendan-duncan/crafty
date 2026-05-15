import { describe, it, expect, beforeAll } from 'vitest';
import type { RenderContext } from '../../../src/renderer/render_context.js';
import { RenderGraph, PhysicalResourceCache } from '../../../src/renderer/render_graph/index.js';
import type { ResourceHandle } from '../../../src/renderer/render_graph/index.js';

// Polyfill WebGPU globals not available in the Node test environment.
beforeAll(() => {
  (globalThis as any).GPUTextureUsage = {
    COPY_SRC: 1, COPY_DST: 2, TEXTURE_BINDING: 32,
    STORAGE_BINDING: 64, RENDER_ATTACHMENT: 16,
  };
  (globalThis as any).GPUBufferUsage = {
    COPY_SRC: 4, COPY_DST: 8, INDEX: 32, INDIRECT: 256,
    MAP_READ: 1, MAP_WRITE: 2, QUERY_RESOLVE: 512,
    STORAGE: 2, UNIFORM: 1, VERTEX: 16,
  };
});

function createMockGPUTexture(): GPUTexture {
  return {
    label: 'mock-tex',
    createView: () => createMockGPUTextureView(),
    destroy: () => {},
  } as unknown as GPUTexture;
}

function createMockGPUTextureView(): GPUTextureView {
  return {} as unknown as GPUTextureView;
}

function createMockGPUBuffer(): GPUBuffer {
  return {
    label: 'mock-buf',
    destroy: () => {},
  } as unknown as GPUBuffer;
}

function createMockCache(): PhysicalResourceCache {
  return {
    acquireTexture: () => createMockGPUTexture(),
    acquireBuffer: () => createMockGPUBuffer(),
    getOrCreatePersistentTexture: () => createMockGPUTexture(),
    getOrCreatePersistentBuffer: () => createMockGPUBuffer(),
    getOrCreateView: () => createMockGPUTextureView(),
    releaseAllTransients: () => {},
    destroyPersistentTexture: () => {},
    destroyPersistentBuffer: () => {},
    destroy: () => {},
    trimUnused: () => {},
  } as unknown as PhysicalResourceCache;
}

function createMockContext(): RenderContext {
  return {
    format: 'rgba8unorm',
    width: 1920,
    height: 1080,
    depthFormat: 'depth32float',
    device: {} as GPUDevice,
    queue: {} as GPUQueue,
    canvas: {} as HTMLCanvasElement,
    hdr: false,
    enableErrorHandling: false,
    shaderBlockManager: {} as any,
    backbufferTexture: createMockGPUTexture(),
    backbufferView: createMockGPUTextureView(),
    backbufferDepth: createMockGPUTexture(),
    backbufferDepthView: createMockGPUTextureView(),
    update: () => {},
    pushFrameErrorScope: () => {},
    popFrameErrorScope: async () => {},
  } as unknown as RenderContext;
}

describe('RenderGraph', () => {
  describe('compile', () => {
    it('compiles a simple producer-consumer chain', () => {
      const ctx = createMockContext();
      const cache = createMockCache();
      const graph = new RenderGraph(ctx, cache);

      const bb = graph.setBackbuffer('canvas');

      let tex!: ResourceHandle;
      graph.addPass('producer', 'render', (b) => {
        tex = b.createTexture({ format: 'rgba8unorm', width: 64, height: 64 });
        tex = b.write(tex, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: { r: 0, g: 0, b: 0, a: 1 } });
        b.setExecute(() => {});
      });

      graph.addPass('consumer', 'render', (b) => {
        b.read(tex, 'sampled');
        b.write(bb, 'attachment', { loadOp: 'load', storeOp: 'store' });
        b.setExecute(() => {});
      });

      const compiled = graph.compile();
      expect(compiled.passes).toHaveLength(2);
      expect(compiled.passes[0].node.name).toBe('producer');
      expect(compiled.passes[1].node.name).toBe('consumer');
    });

    it('culls passes not connected to backbuffer', () => {
      const ctx = createMockContext();
      const cache = createMockCache();
      const graph = new RenderGraph(ctx, cache);

      const bb = graph.setBackbuffer('canvas');

      graph.addPass('orphan', 'render', (b) => {
        const orphanTex = b.createTexture({ format: 'rgba8unorm', width: 8, height: 8 });
        b.write(orphanTex, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: { r: 1, g: 0, b: 0, a: 1 } });
        b.setExecute(() => {});
      });

      graph.addPass('writer', 'render', (b) => {
        b.write(bb, 'attachment', { loadOp: 'load', storeOp: 'store' });
        b.setExecute(() => {});
      });

      const compiled = graph.compile();
      expect(compiled.passes).toHaveLength(1);
      expect(compiled.passes[0].node.name).toBe('writer');
    });

    it('throws when a pass reads an unproduced resource version', () => {
      const ctx = createMockContext();
      const cache = createMockCache();
      const graph = new RenderGraph(ctx, cache);

      const bb = graph.setBackbuffer('canvas');

      // Create a texture in one pass and try to read a newer version that
      // was never produced.
      let tex!: ResourceHandle;
      graph.addPass('producer', 'render', (b) => {
        tex = b.createTexture({ format: 'rgba8unorm', width: 64, height: 64 });
        tex = b.write(tex, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: { r: 0, g: 0, b: 0, a: 1 } });
        b.setExecute(() => {});
      });

      // Bump past the produced version — v2 was never written.
      const stale = { id: tex.id, version: tex.version + 1 };

      graph.addPass('consumer', 'render', (b) => {
        b.read(stale, 'sampled');
        b.write(bb, 'attachment', { loadOp: 'load', storeOp: 'store' });
        b.setExecute(() => {});
      });

      expect(() => graph.compile()).toThrow(/never produced/);
    });

    it('preserves declaration order for passes that write to backbuffer', () => {
      const ctx = createMockContext();
      const cache = createMockCache();
      const graph = new RenderGraph(ctx, cache);

      const bb = graph.setBackbuffer('canvas');

      graph.addPass('first', 'render', (b) => {
        b.write(bb, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: { r: 0, g: 0, b: 0, a: 1 } });
        b.setExecute(() => {});
      });
      graph.addPass('second', 'render', (b) => {
        b.write(bb, 'attachment', { loadOp: 'load', storeOp: 'store' });
        b.setExecute(() => {});
      });

      const compiled = graph.compile();
      expect(compiled.passes).toHaveLength(2);
      expect(compiled.passes[0].node.name).toBe('first');
      expect(compiled.passes[1].node.name).toBe('second');
    });
  });

  describe('getResourceInfo', () => {
    it('returns texture info with format, dimensions, and label', () => {
      const ctx = createMockContext();
      const cache = createMockCache();
      const graph = new RenderGraph(ctx, cache);

      graph.setBackbuffer('canvas');

      let tex!: ResourceHandle;
      graph.addPass('pass', 'render', (b) => {
        tex = b.createTexture({ label: 'my-tex', format: 'rgba16float', width: 320, height: 240 });
        tex = b.write(tex, 'attachment', { loadOp: 'clear', storeOp: 'store', clearValue: { r: 0, g: 0, b: 0, a: 1 } });
        b.setExecute(() => {});
      });

      const info = graph.getResourceInfo(tex.id);
      expect(info).not.toBeNull();
      expect(info!.kind).toBe('texture');
      expect(info!.format).toBe('rgba16float');
      expect(info!.width).toBe(320);
      expect(info!.height).toBe(240);
      expect(info!.label).toBe('rgba16float'); // fallback label equals format
    });

    it('returns buffer info with kind, size, and label', () => {
      const ctx = createMockContext();
      const cache = createMockCache();
      const graph = new RenderGraph(ctx, cache);

      graph.setBackbuffer('canvas');

      let buf!: ResourceHandle;
      graph.addPass('pass', 'compute', (b) => {
        buf = b.createBuffer({ label: 'my-buf', size: 256 });
        b.setExecute(() => {});
      });

      const info = graph.getResourceInfo(buf.id);
      expect(info).not.toBeNull();
      expect(info!.kind).toBe('buffer');
      expect(info!.size).toBe(256);
      expect(info!.label).toContain('my-buf');
    });

    it('returns null for unknown id', () => {
      const ctx = createMockContext();
      const cache = createMockCache();
      const graph = new RenderGraph(ctx, cache);

      const info = graph.getResourceInfo(9999);
      expect(info).toBeNull();
    });

    it('labels persistent textures by their key', () => {
      const ctx = createMockContext();
      const cache = createMockCache();
      const graph = new RenderGraph(ctx, cache);

      graph.setBackbuffer('canvas');

      const handle = graph.importPersistentTexture('taa:history', {
        label: 'TAAHistory',
        format: 'rgba16float',
        width: 1920,
        height: 1080,
      });

      const info = graph.getResourceInfo(handle.id);
      expect(info).not.toBeNull();
      expect(info!.kind).toBe('texture');
      expect(info!.label).toBe('taa:history'); // persistentKey takes priority
    });

    it('labels backbuffer resource', () => {
      const ctx = createMockContext();
      const cache = createMockCache();
      const graph = new RenderGraph(ctx, cache);

      const bb = graph.setBackbuffer('canvas');

      const info = graph.getResourceInfo(bb.id);
      expect(info).not.toBeNull();
      expect(info!.kind).toBe('texture');
      expect(info!.label).toBe('Backbuffer');
      expect(info!.isBackbuffer).toBe(true);
    });
  });

  describe('backbuffer', () => {
    it('setBackbufferDepth produces a valid handle', () => {
      const ctx = createMockContext();
      const cache = createMockCache();
      const graph = new RenderGraph(ctx, cache);

      graph.setBackbuffer('canvas');
      const depthHandle = graph.setBackbufferDepth('canvas');

      const info = graph.getResourceInfo(depthHandle.id);
      expect(info).not.toBeNull();
      expect(info!.kind).toBe('texture');
      expect(info!.isBackbuffer).toBe(true);
    });

    it('getBackbufferDepth returns null if no depth set', () => {
      const ctx = createMockContext();
      const cache = createMockCache();
      const graph = new RenderGraph(ctx, cache);

      expect(graph.getBackbufferDepth()).toBeNull();
    });
  });

  describe('importPersistentTexture', () => {
    it('returns a handle referencing the registered resource', () => {
      const ctx = createMockContext();
      const cache = createMockCache();
      const graph = new RenderGraph(ctx, cache);

      graph.setBackbuffer('canvas');

      const handle = graph.importPersistentTexture('shadow:map', {
        label: 'ShadowMap',
        format: 'depth32float',
        width: 2048,
        height: 2048,
      });

      const info = graph.getResourceInfo(handle.id);
      expect(info).not.toBeNull();
      expect(info!.label).toBe('shadow:map');
      expect(info!.format).toBe('depth32float');
    });
  });

  describe('passList', () => {
    it('returns passes in declaration order before compile', () => {
      const ctx = createMockContext();
      const cache = createMockCache();
      const graph = new RenderGraph(ctx, cache);

      graph.setBackbuffer('canvas');

      graph.addPass('first', 'render', (b) => b.setExecute(() => {}));
      graph.addPass('second', 'compute', (b) => b.setExecute(() => {}));
      graph.addPass('third', 'render', (b) => b.setExecute(() => {}));

      expect(graph.passList).toHaveLength(3);
      expect(graph.passList[0].name).toBe('first');
      expect(graph.passList[1].name).toBe('second');
      expect(graph.passList[2].name).toBe('third');
    });
  });
});
