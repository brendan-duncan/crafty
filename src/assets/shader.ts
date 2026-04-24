export class Shader {
  readonly module: GPUShaderModule;
  readonly label: string;

  constructor(device: GPUDevice, code: string, label: string) {
    this.label = label;
    this.module = device.createShaderModule({ label, code });
  }
}
