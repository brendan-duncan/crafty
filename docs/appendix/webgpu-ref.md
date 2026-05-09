# Appendix B: WebGPU API Reference

[Contents](../README.md) | [Previous](wgsl-ref.md) | [Next](math-ref.md)

## Initialisation

```typescript
// Check availability
if (!navigator.gpu) { /* not supported */ }

// Get adapter
const adapter = await navigator.gpu.requestAdapter({
  powerPreference: 'high-performance',  // or 'low-power'
});

// Create device
const device = await adapter.requestDevice({
  requiredFeatures: [],
  requiredLimits: {},
});
```

## Canvas Configuration

```typescript
const context = canvas.getContext('webgpu') as GPUCanvasContext;

// SDR
context.configure({
  device,
  format: 'bgra8unorm',  // or 'rgba8unorm'
  alphaMode: 'opaque',    // or 'premultiplied'
});

// HDR
context.configure({
  device,
  format: 'rgba16float',
  alphaMode: 'opaque',
  colorSpace: 'display-p3',
  toneMapping: { mode: 'extended' },
});
```

## Buffer

```typescript
// Create
const buffer = device.createBuffer({
  size: 256,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  label: 'MyBuffer',
});

// Write data
device.queue.writeBuffer(buffer, 0, data, byteOffset, byteLength);

// Read back (requires MAP_READ usage)
await buffer.mapAsync(GPUMapMode.READ);
const data = buffer.getMappedRange();
buffer.unmap();

// Destroy
buffer.destroy();
```

## Texture

```typescript
// Create 2D texture
const texture = device.createTexture({
  size: { width: 1024, height: 1024 },
  format: 'rgba8unorm',
  usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
  mipLevelCount: 1,
  sampleCount: 1,
  label: 'MyTexture',
});

// Create cube texture
const cubeTexture = device.createTexture({
  size: { width: 512, height: 512, depthOrArrayLayers: 6 },
  format: 'rgba16float',
  usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
});

// Create depth texture
const depthTexture = device.createTexture({
  size: { width, height },
  format: 'depth32float',
  usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
});

// Create texture view
const view = texture.createView();
const arrayView = texture.createView({ dimension: '2d-array' });
const cubeView = cubeTexture.createView({ dimension: 'cube' });

// Upload data (via copyExternalImageToTexture or writeTexture)
device.queue.copyExternalImageToTexture(
  { source: imageBitmap },
  { texture, premultipliedAlpha: false },
  { width, height },
);

// Destroy
texture.destroy();
```

## Sampler

```typescript
const sampler = device.createSampler({
  addressModeU: 'repeat',    // 'clamp-to-edge' | 'repeat' | 'mirror-repeat'
  addressModeV: 'repeat',
  addressModeW: 'clamp-to-edge',
  magFilter: 'linear',       // 'nearest' | 'linear'
  minFilter: 'linear',
  mipmapFilter: 'linear',    // 'nearest' | 'linear'
  lodMinClamp: 0,
  lodMaxClamp: 32,
  maxAnisotropy: 1,          // 1-16
  compare: undefined,        // 'never' | 'less' | 'equal' | ... enables PCF
});
```

## Bind Group / Layout

```typescript
// Layout
const layout = device.createBindGroupLayout({
  entries: [{
    binding: 0,
    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
    buffer: { type: 'uniform' },  // 'uniform' | 'storage' | 'read-only-storage'
  }, {
    binding: 1,
    visibility: GPUShaderStage.FRAGMENT,
    texture: { sampleType: 'float' },  // 'float' | 'unfilterable-float' | 'depth' | ...
  }, {
    binding: 2,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: { type: 'filtering' },  // 'filtering' | 'comparison' | 'non-filtering'
  }],
});

// Pipeline layout
const pipelineLayout = device.createPipelineLayout({
  bindGroupLayouts: [layout0, layout1, layout2],
});

// Bind group
const bindGroup = device.createBindGroup({
  layout,
  entries: [
    { binding: 0, resource: { buffer, offset: 0, size: 256 } },
    { binding: 1, resource: textureView },
    { binding: 2, resource: sampler },
  ],
});
```

## Render Pipeline

```typescript
const pipeline = device.createRenderPipeline({
  layout: pipelineLayout,
  vertex: {
    module: shaderModule,
    entryPoint: 'vs_main',
    buffers: [{
      arrayStride: 48,
      attributes: [
        { shaderLocation: 0, offset: 0,  format: 'float32x3' },  // position
        { shaderLocation: 1, offset: 12, format: 'float32x3' },  // normal
        { shaderLocation: 2, offset: 24, format: 'float32x2' },  // uv
        { shaderLocation: 3, offset: 32, format: 'float32x4' },  // tangent
      ],
    }],
  },
  fragment: {
    module: shaderModule,
    entryPoint: 'fs_main',
    targets: [
      { format: 'rgba8unorm', blend: { /* optional blend state */ } },
      { format: 'rgba16float' },
    ],
  },
  depthStencil: {
    format: 'depth32float',
    depthWriteEnabled: true,
    depthCompare: 'less',
    depthBias: 0,
    depthBiasSlopeScale: 0,
    depthBiasClamp: 0,
  },
  primitive: {
    topology: 'triangle-list',      // 'point-list' | 'line-list' | 'triangle-list' | 'triangle-strip'
    stripIndexFormat: undefined,     // 'uint16' | 'uint32' (for strip)
    frontFace: 'ccw',               // 'ccw' | 'cw'
    cullMode: 'back',               // 'none' | 'front' | 'back'
  },
  multisample: {
    count: 1,
    mask: 0xFFFFFFFF,
    alphaToCoverageEnabled: false,
  },
});
```

## Compute Pipeline

```typescript
const computePipeline = device.createComputePipeline({
  layout: pipelineLayout,
  compute: {
    module: shaderModule,
    entryPoint: 'cs_main',
  },
});
```

## Command Encoding

```typescript
const encoder = device.createCommandEncoder();

// Render pass
const pass = encoder.beginRenderPass({
  colorAttachments: [{
    view: colorTextureView,
    clearValue: [0, 0, 0, 0],
    loadOp: 'clear',     // 'clear' | 'load'
    storeOp: 'store',    // 'store' | 'discard'
  }],
  depthStencilAttachment: {
    view: depthTextureView,
    depthClearValue: 1.0,
    depthLoadOp: 'clear',
    depthStoreOp: 'store',
  },
});
pass.setPipeline(renderPipeline);
pass.setBindGroup(0, bindGroup);
pass.setVertexBuffer(0, vertexBuffer);
pass.setIndexBuffer(indexBuffer, 'uint32');
pass.drawIndexed(indexCount, instanceCount, firstIndex, baseVertex, firstInstance);
pass.draw(vertexCount, instanceCount, firstVertex, firstInstance);
pass.end();

// Compute pass
const computePass = encoder.beginComputePass();
computePass.setPipeline(computePipeline);
computePass.setBindGroup(0, bindGroup);
computePass.dispatchWorkgroups(x, y, z);
computePass.end();

// Copy
encoder.copyBufferToBuffer(src, srcOffset, dst, dstOffset, size);
encoder.copyBufferToTexture(src, dst, copySize);
encoder.copyTextureToBuffer(src, dst, copySize);

// Finish and submit
const commandBuffer = encoder.finish();
device.queue.submit([commandBuffer]);
```

## Error Scopes

```typescript
device.pushErrorScope('validation');
// ... create resources ...
const error = await device.popErrorScope();
if (error) console.error(error.message);
// Other scope types: 'out-of-memory', 'internal'
```

## Limits

```typescript
const limits = device.limits;
// maxTextureDimension2D, maxBindGroups, maxUniformBuffersPerShaderStage,
// minUniformBufferOffsetAlignment, maxVertexAttributes, etc.
```
