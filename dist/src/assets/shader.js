/**
 * Wraps a compiled WGSL shader module with its label.
 *
 * The underlying GPUShaderModule has no explicit destroy step; it is released
 * when this object and any pipelines referencing it are dropped.
 */
export class Shader {
    module;
    label;
    /**
     * Compiles the given WGSL source into a GPU shader module.
     *
     * @param device - The WebGPU device used to compile the module.
     * @param code - WGSL source code.
     * @param label - Debug label attached to the module.
     */
    constructor(device, code, label) {
        this.label = label;
        this.module = device.createShaderModule({ label, code });
    }
}
