/**
 * Wraps a compiled WGSL shader module with its label.
 *
 * The underlying GPUShaderModule has no explicit destroy step; it is released
 * when this object and any pipelines referencing it are dropped.
 */
export class Shader {
  readonly module: GPUShaderModule;
  readonly label: string;

  /**
   * Compiles the given WGSL source into a GPU shader module.
   *
   * @param device - The WebGPU device used to compile the module.
   * @param code - WGSL source code.
   * @param label - Debug label attached to the module.
   */
  constructor(device: GPUDevice, code: string, label: string) {
    this.label = label;
    this.module = device.createShaderModule({ label, code });
  }
}
