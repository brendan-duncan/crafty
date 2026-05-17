import type {
  AttachmentOptions,
  BufferDesc,
  PassType,
  ResourceHandle,
  ResourceUsage,
  TextureDesc,
} from './types.js';

/**
 * Per-pass resource access record produced by {@link PassBuilder.read} and
 * {@link PassBuilder.write}.
 */
export interface PassAccess {
  /** Resource id this access targets. */
  id: number;
  /** Version of the handle as seen by the pass at the time of declaration. */
  version: number;
  usage: ResourceUsage;
  /** Attachment metadata when usage is `'attachment'` or `'depth-attachment'`. */
  attachment?: AttachmentOptions;
}

/**
 * Internal: declared (uncompiled) pass. Captures the user's reads/writes,
 * the new resources it created, and the execute callback. The compiler turns
 * this into a {@link CompiledPass}.
 */
export interface PassNode {
  name: string;
  type: PassType;
  /** Author-declared insertion order (purely for debugging). */
  order: number;
  reads: PassAccess[];
  writes: PassAccess[];
  /** Resources the pass created via `b.create*()`. */
  created: number[];
  execute: ExecuteFn | null;
}

/** Context handed to the pass's execute callback. */
export interface PassContext {
  /** Frame-shared command encoder. Always available. */
  commandEncoder: GPUCommandEncoder;
  /** Set when the pass is `'render'`. The graph begins/ends the render pass. */
  renderPassEncoder?: GPURenderPassEncoder;
  /** Set when the pass is `'compute'`. The graph begins/ends the compute pass. */
  computePassEncoder?: GPUComputePassEncoder;
}

/** Resolved access to physical GPU resources, scoped to a single pass execution. */
export interface ResolvedResources {
  getTexture(handle: ResourceHandle): GPUTexture;
  getTextureView(handle: ResourceHandle, viewDesc?: GPUTextureViewDescriptor): GPUTextureView;
  getBuffer(handle: ResourceHandle): GPUBuffer;
  getOrCreateBindGroup(descriptor: GPUBindGroupDescriptor): GPUBindGroup;
}

export type ExecuteFn = (ctx: PassContext, resources: ResolvedResources) => void;

/**
 * Builder handed to the pass's setup function. Declares how the pass uses
 * resources and registers its execute callback. Each call to {@link write}
 * returns a fresh handle whose `version` is incremented; the compiler uses
 * these versions to wire dependencies precisely.
 */
export interface PassBuilder {
  /** Create a new transient virtual texture. Returns a v0 handle. */
  createTexture(desc: TextureDesc): ResourceHandle;
  /** Create a new transient virtual buffer. Returns a v0 handle. */
  createBuffer(desc: BufferDesc): ResourceHandle;
  /** Declare a read of the supplied handle at its current version. */
  read(handle: ResourceHandle, usage: ResourceUsage): ResourceHandle;
  /**
   * Declare a write to the supplied handle. Returns a new handle with
   * version incremented; downstream passes that consume this write must use
   * the returned handle, not the original.
   */
  write(handle: ResourceHandle, usage: ResourceUsage, attachment?: AttachmentOptions): ResourceHandle;
  /** Register the pass's execute callback. Must be called exactly once. */
  setExecute(fn: ExecuteFn): void;
}

/**
 * Implementation of PassBuilder backed by the parent RenderGraph's resource
 * registry. Constructed for the duration of a single addPass setup call.
 */
export class PassBuilderImpl implements PassBuilder {
  /** Latest version observed for each resource id during this pass's setup. */
  private readonly _localVersion = new Map<number, number>();
  readonly node: PassNode;

  constructor(
    name: string,
    type: PassType,
    order: number,
    private readonly _onCreateTexture: (desc: TextureDesc) => ResourceHandle,
    private readonly _onCreateBuffer: (desc: BufferDesc) => ResourceHandle,
    private readonly _onWriteBumpVersion: (id: number) => number,
    private readonly _validateHandle: (handle: ResourceHandle) => void,
  ) {
    this.node = {
      name,
      type,
      order,
      reads: [],
      writes: [],
      created: [],
      execute: null,
    };
  }

  createTexture(desc: TextureDesc): ResourceHandle {
    const handle = this._onCreateTexture(desc);
    this.node.created.push(handle.id);
    this._localVersion.set(handle.id, handle.version);
    return handle;
  }

  createBuffer(desc: BufferDesc): ResourceHandle {
    const handle = this._onCreateBuffer(desc);
    this.node.created.push(handle.id);
    this._localVersion.set(handle.id, handle.version);
    return handle;
  }

  read(handle: ResourceHandle, usage: ResourceUsage): ResourceHandle {
    this._validateHandle(handle);
    const localV = this._localVersion.get(handle.id);
    if (localV !== undefined && localV > handle.version) {
      throw new Error(
        `[render-graph] Pass '${this.node.name}' reads stale handle id=${handle.id} v${handle.version} ` +
        `(latest in this pass is v${localV}). Use the handle returned by write().`,
      );
    }
    this.node.reads.push({ id: handle.id, version: handle.version, usage });
    return handle;
  }

  write(handle: ResourceHandle, usage: ResourceUsage, attachment?: AttachmentOptions): ResourceHandle {
    this._validateHandle(handle);
    // Same-pass read-of-own-write is detected here: a write follows a read
    // recorded earlier in this pass against the same id.
    for (const r of this.node.reads) {
      if (r.id === handle.id) {
        throw new Error(
          `[render-graph] Pass '${this.node.name}' writes id=${handle.id} after reading it in the same pass. ` +
          `Split the work into two passes.`,
        );
      }
    }
    const newVersion = this._onWriteBumpVersion(handle.id);
    this._localVersion.set(handle.id, newVersion);
    this.node.writes.push({ id: handle.id, version: newVersion, usage, attachment });
    return { id: handle.id, version: newVersion };
  }

  setExecute(fn: ExecuteFn): void {
    if (this.node.execute) {
      throw new Error(`[render-graph] Pass '${this.node.name}' setExecute called more than once.`);
    }
    this.node.execute = fn;
  }
}
