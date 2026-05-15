import type { RenderContext } from '../render_context.js';
import { PassBuilderImpl, type PassBuilder, type PassNode, type ResolvedResources } from './pass_builder.js';
import { PhysicalResourceCache } from './physical_resource_cache.js';
import {
  ResourceKind,
  type BufferDesc,
  type PassType,
  type ResourceHandle,
  type ResourceUsage,
  type TextureDesc,
} from './types.js';

/** Internal record for every virtual resource registered in the graph. */
interface VirtualResource {
  id: number;
  kind: ResourceKind;
  desc: TextureDesc | BufferDesc;
  /** Highest version produced so far in this graph. */
  currentVersion: number;
  /** When set, this resource is backed by a stable persistent physical object. */
  persistentKey: string | null;
  /** When set, this resource resolves to the canvas swapchain texture at execute time. */
  isBackbuffer: boolean;
  /** When set, this resource resolves to a caller-provided GPUTexture / GPUBuffer. */
  externalTexture: GPUTexture | null;
  externalBuffer: GPUBuffer | null;
}

/** A {@link PassNode} after culling/sort, ready to execute. */
interface CompiledPass {
  node: PassNode;
  /** Pre-resolved order index in the compiled execution list. */
  index: number;
}

/**
 * The output of {@link RenderGraph.compile}: an ordered list of passes plus
 * the bindings from virtual resource id to the physical GPU object that will
 * back it during execute.
 */
export interface CompiledGraph {
  passes: CompiledPass[];
  /** id → physical texture (transient or persistent or external). */
  textureBindings: Map<number, GPUTexture>;
  /** id → physical buffer. */
  bufferBindings: Map<number, GPUBuffer>;
  /** Resource ids that resolve to the canvas swapchain at execute time. */
  backbufferIds: number[];
}

/**
 * RenderGraph: declares passes, compiles a dependency graph from their
 * read/write declarations, and executes them in topological order against
 * pooled physical resources.
 *
 * Lifecycle (per frame):
 * 1. Build a fresh `RenderGraph(ctx, cache)`.
 * 2. Call `addPass(name, type, setup)` for each pass; the setup callback uses
 *    the {@link PassBuilder} to declare reads/writes and register an execute
 *    callback.
 * 3. Call `setBackbuffer(...)` once with the swapchain target.
 * 4. `compile()` produces a {@link CompiledGraph} (validate, cull, sort, bind).
 * 5. `execute(compiled)` records and submits a single command buffer.
 *
 * The {@link PhysicalResourceCache} is owned externally and survives across
 * frames so transient resources are pooled and persistent resources persist.
 */
export class RenderGraph {
  readonly ctx: RenderContext;
  readonly cache: PhysicalResourceCache;
  private readonly _resources = new Map<number, VirtualResource>();
  private readonly _passes: PassNode[] = [];
  private _nextId = 1;

  /** Backbuffer setup. Resolved at execute() time. */
  private _backbufferHandle: ResourceHandle | null = null;
  private _backbufferDepthHandle: ResourceHandle | null = null;

  constructor(ctx: RenderContext, cache: PhysicalResourceCache) {
    this.ctx = ctx;
    this.cache = cache;
  }

  /**
   * Designate the swapchain (or a caller-supplied render texture) as the
   * graph's backbuffer. The returned handle is what the final pass writes to.
   * Call once per graph build, before compile().
   */
  setBackbuffer(target: GPUTexture | 'canvas', desc?: Partial<TextureDesc>): ResourceHandle {
    if (this._backbufferHandle) {
      throw new Error('[render-graph] setBackbuffer called more than once.');
    }
    const id = this._nextId++;
    const fullDesc: TextureDesc = {
      label: 'backbuffer',
      format: this.ctx.format,
      width: this.ctx.width,
      height: this.ctx.height,
      ...desc,
    };
    const isCanvas = target === 'canvas';
    this._resources.set(id, {
      id,
      kind: ResourceKind.Texture,
      desc: fullDesc,
      currentVersion: 0,
      persistentKey: null,
      isBackbuffer: isCanvas,
      externalTexture: isCanvas ? null : (target as GPUTexture),
      externalBuffer: null,
    });
    this._backbufferHandle = { id, version: 0 };
    return this._backbufferHandle;
  }

  /**
   * Designate the canvas depth texture (or a caller-supplied depth texture)
   * as the graph's backbuffer depth attachment.
   */
  setBackbufferDepth(target: GPUTexture | 'canvas', desc?: Partial<TextureDesc>): ResourceHandle {
    if (this._backbufferDepthHandle) {
      throw new Error('[render-graph] setBackbufferDepth called more than once.');
    }
    const id = this._nextId++;
    const fullDesc: TextureDesc = {
      label: 'backbuffer-depth',
      format: this.ctx.depthFormat ?? 'depth32float',
      width: this.ctx.width,
      height: this.ctx.height,
      ...desc,
    };
    const isCanvas = target === 'canvas';
    this._resources.set(id, {
      id,
      kind: ResourceKind.Texture,
      desc: fullDesc,
      currentVersion: 0,
      persistentKey: null,
      isBackbuffer: isCanvas,
      externalTexture: isCanvas ? null : (target as GPUTexture),
      externalBuffer: null,
    });
    this._backbufferDepthHandle = { id, version: 0 };
    return this._backbufferDepthHandle;
  }

  /** Returns the previously registered backbuffer handle, if any. */
  getBackbuffer(): ResourceHandle {
    if (!this._backbufferHandle) {
      throw new Error('[render-graph] getBackbuffer() before setBackbuffer().');
    }
    return this._backbufferHandle;
  }

  getBackbufferDepth(): ResourceHandle | null {
    return this._backbufferDepthHandle;
  }

  /**
   * Register a persistent texture, identified by stable string `key`. Returns
   * a handle the same way as a created texture — read/write declarations
   * follow the same rules.
   */
  importPersistentTexture(key: string, desc: TextureDesc): ResourceHandle {
    const id = this._nextId++;
    this._resources.set(id, {
      id,
      kind: ResourceKind.Texture,
      desc,
      currentVersion: 0,
      persistentKey: key,
      isBackbuffer: false,
      externalTexture: null,
      externalBuffer: null,
    });
    return { id, version: 0 };
  }

  /** Register a persistent buffer. */
  importPersistentBuffer(key: string, desc: BufferDesc): ResourceHandle {
    const id = this._nextId++;
    this._resources.set(id, {
      id,
      kind: ResourceKind.Buffer,
      desc,
      currentVersion: 0,
      persistentKey: key,
      isBackbuffer: false,
      externalTexture: null,
      externalBuffer: null,
    });
    return { id, version: 0 };
  }

  /**
   * Import a caller-owned GPUTexture into the graph as a virtual resource.
   * Useful for textures whose lifetime is managed elsewhere (asset loaders,
   * external libraries). The graph never destroys imported textures.
   */
  importExternalTexture(texture: GPUTexture, desc: TextureDesc): ResourceHandle {
    const id = this._nextId++;
    this._resources.set(id, {
      id,
      kind: ResourceKind.Texture,
      desc,
      currentVersion: 0,
      persistentKey: null,
      isBackbuffer: false,
      externalTexture: texture,
      externalBuffer: null,
    });
    return { id, version: 0 };
  }

  importExternalBuffer(buffer: GPUBuffer, desc: BufferDesc): ResourceHandle {
    const id = this._nextId++;
    this._resources.set(id, {
      id,
      kind: ResourceKind.Buffer,
      desc,
      currentVersion: 0,
      persistentKey: null,
      isBackbuffer: false,
      externalTexture: null,
      externalBuffer: buffer,
    });
    return { id, version: 0 };
  }

  /**
   * Append a pass to the graph. The setup callback runs synchronously and
   * uses the supplied {@link PassBuilder} to declare reads/writes/creates and
   * register an execute callback.
   */
  addPass(name: string, type: PassType, setup: (b: PassBuilder) => void): void {
    const builder = new PassBuilderImpl(
      name,
      type,
      this._passes.length,
      (desc) => this._registerCreatedTexture(desc),
      (desc) => this._registerCreatedBuffer(desc),
      (id) => this._bumpVersion(id),
      (h) => this._validateHandle(h),
    );
    setup(builder);
    if (!builder.node.execute) {
      throw new Error(`[render-graph] Pass '${name}' did not call setExecute().`);
    }
    this._passes.push(builder.node);
  }

  /**
   * Compile the declared graph: validate references, cull passes that don't
   * reach the backbuffer, topologically sort the survivors, and bind each
   * surviving virtual resource to a physical GPU object.
   */
  compile(): CompiledGraph {
    this._validateAccesses();
    const live = this._cull();
    const ordered = this._topoSort(live);

    const textureBindings = new Map<number, GPUTexture>();
    const bufferBindings = new Map<number, GPUBuffer>();
    const backbufferIds: number[] = [];
    const usedIds = new Set<number>();
    for (const pass of ordered) {
      for (const a of pass.reads) usedIds.add(a.id);
      for (const a of pass.writes) usedIds.add(a.id);
    }

    // Pre-aggregate usage flags across every virtual id that shares a
    // persistentKey. Two callers (e.g. TAA pass + a separate import in the
    // sample) requesting the same persistent resource with different usages
    // would otherwise cause `getOrCreatePersistentTexture` to destroy and
    // recreate the texture mid-compile, leaving earlier bindings dangling.
    const persistentTextureUsage = new Map<string, GPUTextureUsageFlags>();
    const persistentBufferUsage = new Map<string, GPUBufferUsageFlags>();
    for (const id of usedIds) {
      const res = this._resources.get(id)!;
      if (!res.persistentKey) continue;
      const usage = this._aggregateUsage(id, ordered);
      if (res.kind === ResourceKind.Texture) {
        const prev = persistentTextureUsage.get(res.persistentKey) ?? 0;
        persistentTextureUsage.set(res.persistentKey, prev | (usage as GPUTextureUsageFlags));
      } else {
        const prev = persistentBufferUsage.get(res.persistentKey) ?? 0;
        persistentBufferUsage.set(res.persistentKey, prev | (usage as GPUBufferUsageFlags));
      }
    }

    for (const id of usedIds) {
      const res = this._resources.get(id)!;
      const usage = this._aggregateUsage(id, ordered);
      if (res.kind === ResourceKind.Texture) {
        if (res.isBackbuffer) {
          backbufferIds.push(id);
          // Bound at execute time.
        } else if (res.externalTexture) {
          textureBindings.set(id, res.externalTexture);
        } else if (res.persistentKey) {
          const aggregated = persistentTextureUsage.get(res.persistentKey)!;
          const tex = this.cache.getOrCreatePersistentTexture(
            res.persistentKey,
            res.desc as TextureDesc,
            aggregated,
          );
          textureBindings.set(id, tex);
        } else {
          const tex = this.cache.acquireTexture(res.desc as TextureDesc, usage as GPUTextureUsageFlags);
          textureBindings.set(id, tex);
        }
      } else {
        if (res.externalBuffer) {
          bufferBindings.set(id, res.externalBuffer);
        } else if (res.persistentKey) {
          const aggregated = persistentBufferUsage.get(res.persistentKey)!;
          const buf = this.cache.getOrCreatePersistentBuffer(
            res.persistentKey,
            res.desc as BufferDesc,
            aggregated,
          );
          bufferBindings.set(id, buf);
        } else {
          const buf = this.cache.acquireBuffer(res.desc as BufferDesc, usage as GPUBufferUsageFlags);
          bufferBindings.set(id, buf);
        }
      }
    }

    return {
      passes: ordered.map((node, index) => ({ node, index })),
      textureBindings,
      bufferBindings,
      backbufferIds,
    };
  }

  /**
   * Execute the compiled graph: record one command buffer, run each pass's
   * execute callback inside the appropriate encoder, then release transient
   * resources back to the pool. Returns once the command buffer is submitted.
   */
  async execute(compiled: CompiledGraph): Promise<void> {
    this.ctx.pushFrameErrorScope();

    // Bind canvas-backed backbuffer textures now (they change per frame).
    for (const id of compiled.backbufferIds) {
      if (id === this._backbufferHandle?.id) {
        compiled.textureBindings.set(id, this.ctx.backbufferTexture);
      } else if (id === this._backbufferDepthHandle?.id) {
        const depth = this.ctx.backbufferDepth;
        if (!depth) this._fail('backbuffer depth not configured');
        compiled.textureBindings.set(id, depth);
      }
    }

    const encoder = this.ctx.device.createCommandEncoder({ label: 'RenderGraph' });

    for (const cp of compiled.passes) {
      const node = cp.node;
      const resolved = this._buildResolvedResources(compiled);

      if (node.type === 'render') {
        const { colorAttachments, depthStencilAttachment } = this._buildRenderPassDescriptor(node, compiled);
        const renderPass = encoder.beginRenderPass({
          label: node.name,
          colorAttachments,
          depthStencilAttachment,
        });
        node.execute!({ commandEncoder: encoder, renderPassEncoder: renderPass }, resolved);
        renderPass.end();
      } else if (node.type === 'compute') {
        const computePass = encoder.beginComputePass({ label: node.name });
        node.execute!({ commandEncoder: encoder, computePassEncoder: computePass }, resolved);
        computePass.end();
      } else {
        node.execute!({ commandEncoder: encoder }, resolved);
      }
    }

    this.ctx.queue.submit([encoder.finish()]);
    this.cache.releaseAllTransients();
    await this.ctx.popFrameErrorScope();
  }

  // -------- internals --------

  private _registerCreatedTexture(desc: TextureDesc): ResourceHandle {
    const id = this._nextId++;
    this._resources.set(id, {
      id,
      kind: ResourceKind.Texture,
      desc,
      currentVersion: 0,
      persistentKey: null,
      isBackbuffer: false,
      externalTexture: null,
      externalBuffer: null,
    });
    return { id, version: 0 };
  }

  private _registerCreatedBuffer(desc: BufferDesc): ResourceHandle {
    const id = this._nextId++;
    this._resources.set(id, {
      id,
      kind: ResourceKind.Buffer,
      desc,
      currentVersion: 0,
      persistentKey: null,
      isBackbuffer: false,
      externalTexture: null,
      externalBuffer: null,
    });
    return { id, version: 0 };
  }

  private _bumpVersion(id: number): number {
    const res = this._resources.get(id);
    if (!res) throw new Error(`[render-graph] write of unknown resource id=${id}`);
    return ++res.currentVersion;
  }

  private _validateHandle(handle: ResourceHandle): void {
    const res = this._resources.get(handle.id);
    if (!res) throw new Error(`[render-graph] handle id=${handle.id} not registered with this graph`);
  }

  private _validateAccesses(): void {
    // For each version of each resource, find the producing pass index. A
    // version greater than 0 must have been produced by exactly one earlier
    // pass; version 0 is the implicit "import" or "create" version.
    const producer = new Map<string, number>(); // `${id}:${version}` → pass index
    for (let i = 0; i < this._passes.length; i++) {
      for (const w of this._passes[i].writes) {
        const key = `${w.id}:${w.version}`;
        if (producer.has(key)) {
          throw new Error(`[render-graph] resource id=${w.id} v${w.version} written by multiple passes`);
        }
        producer.set(key, i);
      }
    }
    for (let i = 0; i < this._passes.length; i++) {
      for (const r of this._passes[i].reads) {
        if (r.version === 0) continue; // initial state — always valid
        const producerIdx = producer.get(`${r.id}:${r.version}`);
        if (producerIdx === undefined) {
          throw new Error(
            `[render-graph] pass '${this._passes[i].name}' reads id=${r.id} v${r.version} which is never produced`,
          );
        }
      }
    }
  }

  private _cull(): PassNode[] {
    const live = new Set<number>();
    if (!this._backbufferHandle) {
      // No backbuffer set — keep everything (useful for tests / offscreen).
      return this._passes.slice();
    }
    // Seed: every pass that writes the backbuffer or the backbuffer depth, plus
    // every pass that writes to a persistent or external resource (those writes
    // are observed by the next frame's graph, so they must not be culled even
    // when nothing in the current graph reads the new version).
    const sinkIds = new Set<number>();
    sinkIds.add(this._backbufferHandle.id);
    if (this._backbufferDepthHandle) sinkIds.add(this._backbufferDepthHandle.id);
    for (const res of this._resources.values()) {
      if (res.persistentKey || res.externalTexture || res.externalBuffer) {
        sinkIds.add(res.id);
      }
    }

    const stack: number[] = [];
    for (let i = 0; i < this._passes.length; i++) {
      for (const w of this._passes[i].writes) {
        if (sinkIds.has(w.id)) {
          if (!live.has(i)) {
            live.add(i);
            stack.push(i);
          }
          break;
        }
      }
    }

    // Producer index: `${id}:${version}` → producing pass index.
    const producer = new Map<string, number>();
    for (let i = 0; i < this._passes.length; i++) {
      for (const w of this._passes[i].writes) {
        producer.set(`${w.id}:${w.version}`, i);
      }
    }

    while (stack.length > 0) {
      const i = stack.pop()!;
      for (const r of this._passes[i].reads) {
        if (r.version === 0) continue;
        const p = producer.get(`${r.id}:${r.version}`);
        if (p !== undefined && !live.has(p)) {
          live.add(p);
          stack.push(p);
        }
      }
      // A write of version V implicitly depends on the producer of V-1: the
      // new attachment loads the previous version's contents (or the previous
      // pass established the persistent resource). Without this edge, e.g.
      // a sky-clear pass that produces v=1 gets culled when the lighting pass
      // that loads it produces v=2 — leaving a stale or uncleared target.
      for (const w of this._passes[i].writes) {
        if (w.version <= 1) continue;
        const p = producer.get(`${w.id}:${w.version - 1}`);
        if (p !== undefined && !live.has(p)) {
          live.add(p);
          stack.push(p);
        }
      }
    }

    return this._passes.filter((_, i) => live.has(i));
  }

  private _topoSort(live: PassNode[]): PassNode[] {
    // Insertion order already respects writes-before-reads because PassBuilder
    // returns a new version on write that downstream callers must use. So a
    // stable sort by insertion order is a valid topological order. We just
    // assert that here by checking each read's producer comes before the
    // reader; users who insert passes out of order will get an error.
    const indexOfPass = new Map<PassNode, number>();
    live.forEach((p, i) => indexOfPass.set(p, i));

    const producer = new Map<string, number>();
    for (let i = 0; i < live.length; i++) {
      for (const w of live[i].writes) producer.set(`${w.id}:${w.version}`, i);
    }
    for (let i = 0; i < live.length; i++) {
      for (const r of live[i].reads) {
        if (r.version === 0) continue;
        const p = producer.get(`${r.id}:${r.version}`);
        if (p !== undefined && p > i) {
          throw new Error(
            `[render-graph] pass '${live[i].name}' reads id=${r.id} v${r.version} produced by '${live[p].name}' which was added later. ` +
            `addPass() ordering must respect data dependencies.`,
          );
        }
      }
    }
    return live;
  }

  private _aggregateUsage(id: number, passes: PassNode[]): GPUTextureUsageFlags | GPUBufferUsageFlags {
    const res = this._resources.get(id)!;
    let texFlags: GPUTextureUsageFlags = 0;
    let bufFlags: GPUBufferUsageFlags = 0;
    const isTex = res.kind === ResourceKind.Texture;
    const accumulate = (usage: ResourceUsage) => {
      if (isTex) texFlags |= textureUsageFlag(usage, (res.desc as TextureDesc).format);
      else bufFlags |= bufferUsageFlag(usage);
    };
    for (const pass of passes) {
      for (const a of pass.reads) if (a.id === id) accumulate(a.usage);
      for (const a of pass.writes) if (a.id === id) accumulate(a.usage);
    }
    if (isTex) {
      const tdesc = res.desc as TextureDesc;
      if (tdesc.extraUsage) texFlags |= tdesc.extraUsage;
      return texFlags;
    } else {
      const bdesc = res.desc as BufferDesc;
      if (bdesc.extraUsage) bufFlags |= bdesc.extraUsage;
      return bufFlags;
    }
  }

  private _buildResolvedResources(compiled: CompiledGraph): ResolvedResources {
    const cache = this.cache;
    return {
      getTexture: (h: ResourceHandle) => {
        const tex = compiled.textureBindings.get(h.id);
        if (!tex) throw new Error(`[render-graph] no physical texture for id=${h.id}`);
        return tex;
      },
      getTextureView: (h: ResourceHandle, desc?: GPUTextureViewDescriptor) => {
        const tex = compiled.textureBindings.get(h.id);
        if (!tex) throw new Error(`[render-graph] no physical texture for id=${h.id}`);
        return cache.getOrCreateView(tex, desc);
      },
      getBuffer: (h: ResourceHandle) => {
        const buf = compiled.bufferBindings.get(h.id);
        if (!buf) throw new Error(`[render-graph] no physical buffer for id=${h.id}`);
        return buf;
      },
    };
  }

  private _buildRenderPassDescriptor(
    node: PassNode,
    compiled: CompiledGraph,
  ): { colorAttachments: GPURenderPassColorAttachment[]; depthStencilAttachment?: GPURenderPassDepthStencilAttachment } {
    const colors: GPURenderPassColorAttachment[] = [];
    let depth: GPURenderPassDepthStencilAttachment | undefined;
    const consumedAsResolveTarget = new Set<number>();

    // First pass: depth-attachment writes claim the depth slot.
    for (const w of node.writes) {
      if (w.usage === 'depth-attachment') {
        if (depth) throw new Error(`[render-graph] pass '${node.name}' has multiple depth attachments`);
        const tex = compiled.textureBindings.get(w.id);
        if (!tex) throw new Error(`[render-graph] depth attachment id=${w.id} unbound`);
        const opts = w.attachment ?? {};
        depth = {
          view: this.cache.getOrCreateView(tex, opts.view),
          depthLoadOp: opts.depthLoadOp ?? opts.loadOp ?? 'load',
          depthStoreOp: opts.depthStoreOp ?? opts.storeOp ?? 'store',
          depthClearValue: opts.depthClearValue,
        };
        if (opts.stencilLoadOp || opts.stencilStoreOp || opts.stencilClearValue !== undefined) {
          depth.stencilLoadOp = opts.stencilLoadOp;
          depth.stencilStoreOp = opts.stencilStoreOp;
          depth.stencilClearValue = opts.stencilClearValue;
        }
      }
    }
    // Depth-read declarations bind the depth attachment as read-only.
    for (const r of node.reads) {
      if (r.usage === 'depth-read') {
        if (depth) throw new Error(`[render-graph] pass '${node.name}' depth-read conflicts with depth-attachment write`);
        const tex = compiled.textureBindings.get(r.id);
        if (!tex) throw new Error(`[render-graph] depth-read id=${r.id} unbound`);
        depth = {
          view: this.cache.getOrCreateView(tex),
          depthReadOnly: true,
        };
      }
    }
    // Color attachments in declaration order.
    for (const w of node.writes) {
      if (w.usage !== 'attachment') continue;
      if (consumedAsResolveTarget.has(w.id)) continue;
      const tex = compiled.textureBindings.get(w.id);
      if (!tex) throw new Error(`[render-graph] color attachment id=${w.id} unbound`);
      const opts = w.attachment ?? {};
      let resolveTarget: GPUTextureView | undefined;
      if (opts.resolveTarget) {
        const rtTex = compiled.textureBindings.get(opts.resolveTarget.id);
        if (!rtTex) throw new Error(`[render-graph] resolveTarget id=${opts.resolveTarget.id} unbound`);
        resolveTarget = this.cache.getOrCreateView(rtTex);
        consumedAsResolveTarget.add(opts.resolveTarget.id);
      }
      colors.push({
        view: this.cache.getOrCreateView(tex, opts.view),
        loadOp: opts.loadOp ?? 'load',
        storeOp: opts.storeOp ?? 'store',
        clearValue: opts.clearValue,
        resolveTarget,
      });
    }
    return { colorAttachments: colors, depthStencilAttachment: depth };
  }

  private _fail(msg: string): never {
    throw new Error(`[render-graph] ${msg}`);
  }
}

function textureUsageFlag(usage: ResourceUsage, format: GPUTextureFormat): GPUTextureUsageFlags {
  switch (usage) {
    case 'attachment':
    case 'depth-attachment':
      return GPUTextureUsage.RENDER_ATTACHMENT;
    case 'depth-read':
      // Depth read-only attachment + likely sampled later; use both.
      return GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING;
    case 'sampled':
      return GPUTextureUsage.TEXTURE_BINDING;
    case 'storage-read':
    case 'storage-write':
    case 'storage-read-write':
      return GPUTextureUsage.STORAGE_BINDING;
    case 'copy-src':
      return GPUTextureUsage.COPY_SRC;
    case 'copy-dst':
      return GPUTextureUsage.COPY_DST;
    default:
      // Vertex/index/uniform/indirect aren't valid for textures — just silently 0.
      void format;
      return 0;
  }
}

function bufferUsageFlag(usage: ResourceUsage): GPUBufferUsageFlags {
  switch (usage) {
    case 'uniform':
      return GPUBufferUsage.UNIFORM;
    case 'storage-read':
    case 'storage-write':
    case 'storage-read-write':
      return GPUBufferUsage.STORAGE;
    case 'vertex':
      return GPUBufferUsage.VERTEX;
    case 'index':
      return GPUBufferUsage.INDEX;
    case 'indirect':
      return GPUBufferUsage.INDIRECT;
    case 'copy-src':
      return GPUBufferUsage.COPY_SRC;
    case 'copy-dst':
      return GPUBufferUsage.COPY_DST;
    default:
      return 0;
  }
}
