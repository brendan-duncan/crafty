/**
 * Core types for the render graph: virtual resource handles, descriptors,
 * usage classification, and attachment metadata.
 */

/**
 * Opaque, versioned reference to a virtual resource (texture or buffer).
 * Each {@link PassBuilder.write} call returns a new handle whose `version` is
 * incremented; this lets the compiler distinguish "the texture before this
 * write" from "the texture after this write" and detect stale reads.
 */
export interface ResourceHandle {
  readonly id: number;
  readonly version: number;
}

/** Describes a virtual texture's allocation parameters. */
export interface TextureDesc {
  label?: string;
  format: GPUTextureFormat;
  width: number;
  height: number;
  depthOrArrayLayers?: number;
  mipLevelCount?: number;
  sampleCount?: number;
  dimension?: GPUTextureDimension;
  /**
   * Additional usage flags beyond what the graph infers from declared reads/
   * writes. The graph always adds RENDER_ATTACHMENT/TEXTURE_BINDING/
   * STORAGE_BINDING/COPY_SRC/COPY_DST as appropriate based on declared usage,
   * so this is only needed when the pass uses the texture in a way the graph
   * cannot see (e.g. mipmap generation outside the encoder).
   */
  extraUsage?: GPUTextureUsageFlags;
}

/** Describes a virtual buffer's allocation parameters. */
export interface BufferDesc {
  label?: string;
  size: number;
  /** Additional usage flags. The graph always infers from declared reads/writes. */
  extraUsage?: GPUBufferUsageFlags;
}

/**
 * How a pass uses a resource. Drives the GPU usage flags applied to the
 * physical resource and the kind of pass encoder the graph creates.
 */
export type ResourceUsage =
  | 'attachment'        // color attachment (write only)
  | 'depth-attachment'  // depth-stencil attachment (write or read+write)
  | 'depth-read'        // depth-stencil bound read-only (depthReadOnly: true)
  | 'sampled'           // bound to bind group as a sampled texture
  | 'storage-read'      // bound as read-only storage texture / buffer
  | 'storage-write'     // bound as writable storage texture / buffer
  | 'storage-read-write'
  | 'uniform'           // bound as uniform buffer
  | 'vertex'            // bound as vertex buffer
  | 'index'             // bound as index buffer
  | 'indirect'          // used as indirect draw / dispatch source
  | 'copy-src'          // source of a copy command
  | 'copy-dst';         // destination of a copy command

/**
 * Per-attachment metadata supplied alongside an `'attachment'` /
 * `'depth-attachment'` write. The graph consumes this to build the
 * GPURenderPassDescriptor; the pass execute callback never builds the
 * descriptor itself.
 */
export interface AttachmentOptions {
  /** Defaults to `'load'`. */
  loadOp?: GPULoadOp;
  /** Defaults to `'store'`. */
  storeOp?: GPUStoreOp;
  /** Required when `loadOp === 'clear'` for color attachments. */
  clearValue?: GPUColor;
  /** Required when `loadOp === 'clear'` for depth attachments. */
  depthClearValue?: number;
  /** Defaults to `'load'`. Stencil ops mirror depth if the format has stencil. */
  depthLoadOp?: GPULoadOp;
  /** Defaults to `'store'`. */
  depthStoreOp?: GPUStoreOp;
  stencilLoadOp?: GPULoadOp;
  stencilStoreOp?: GPUStoreOp;
  stencilClearValue?: number;
  /** Specific texture view to attach (mip / array slice / cube face / depth slice). */
  view?: GPUTextureViewDescriptor;
  /**
   * MSAA resolve target. The handle must be a separate virtual texture
   * declared with `'attachment'` write usage in the same pass; the graph
   * consumes both into a single attachment slot.
   */
  resolveTarget?: ResourceHandle;
}

/**
 * Pass type: drives which encoder the graph hands to the execute callback.
 *
 * - `'render'` — graph builds a `GPURenderPassDescriptor` from the declared
 *   attachments, begins a render pass, and passes both the command encoder and
 *   the render pass encoder to `execute`.
 * - `'compute'` — graph begins a compute pass and passes both the command
 *   encoder and the compute pass encoder to `execute`.
 * - `'transfer'` — graph passes only the raw `GPUCommandEncoder` to `execute`;
 *   no render or compute pass is opened. Use this for work that lives directly
 *   on the command encoder rather than inside a sub-pass: copy commands
 *   (`copyBufferToBuffer`, `copyTextureToTexture`, `copyBufferToTexture`,
 *   `copyTextureToBuffer`), `clearBuffer`, or passes that manage their own
 *   internal sub-passes (e.g. shadow passes that begin many render passes of
 *   their own, history-buffer copies for TAA / SSGI). It is also a convenient
 *   no-op placeholder for a disabled pass that still needs to participate in
 *   the dependency graph.
 */
export type PassType = 'render' | 'compute' | 'transfer';

/**
 * Internal: tag used by the graph to distinguish texture handles from buffer
 * handles when both can be passed by the same `ResourceHandle` interface.
 */
export const enum ResourceKind {
  Texture = 0,
  Buffer = 1,
}
