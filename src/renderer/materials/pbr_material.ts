import { Material, MaterialPassType } from '../material.js';
import type { Texture } from '../../assets/texture.js';

import forwardPbrWgsl from '../../shaders/forward_pbr.wgsl?raw';
import geometryWgsl from '../../shaders/geometry.wgsl?raw';
import skinnedGeometryWgsl from '../../shaders/skinned_geometry.wgsl?raw';

const MATERIAL_UNIFORM_SIZE = 48;

const HAS_ALBEDO_MAP = 1 << 0;
const HAS_NORMAL_MAP = 1 << 1;
const HAS_MER_MAP = 1 << 2;

export interface PbrMaterialOptions {
  albedo?: [number, number, number, number];
  roughness?: number;
  metallic?: number;
  uvOffset?: [number, number];
  uvScale?: [number, number];
  uvTile?: [number, number];
  albedoMap?: Texture;
  normalMap?: Texture;
  merMap?: Texture;
  transparent?: boolean;
}

export class PbrMaterial extends Material {
  readonly shaderId = 'pbr';

  albedo: [number, number, number, number];
  roughness: number;
  metallic: number;
  uvOffset?: [number, number];
  uvScale?: [number, number];
  uvTile?: [number, number];

  private _albedoMap?: Texture;
  private _normalMap?: Texture;
  private _merMap?: Texture;

  private static _layoutByDevice = new WeakMap<GPUDevice, Map<number, GPUBindGroupLayout>>();
  private static _samplerByDevice = new WeakMap<GPUDevice, GPUSampler>();

  private _uniformBuffer: GPUBuffer | null = null;
  private _uniformDevice: GPUDevice | null = null;
  private _bindGroup: GPUBindGroup | null = null;
  private _bindGroupAlbedo?: Texture;
  private _bindGroupNormal?: Texture;
  private _bindGroupMer?: Texture;
  private _dirty = true;
  private readonly _scratch = new Float32Array(MATERIAL_UNIFORM_SIZE / 4);

  constructor(options: PbrMaterialOptions = {}) {
    super();
    this.albedo = options.albedo ?? [1, 1, 1, 1];
    this.roughness = options.roughness ?? 0.5;
    this.metallic = options.metallic ?? 0;
    this.uvOffset = options.uvOffset;
    this.uvScale = options.uvScale;
    this.uvTile = options.uvTile;
    this._albedoMap = options.albedoMap;
    this._normalMap = options.normalMap;
    this._merMap = options.merMap;
    this.transparent = options.transparent ?? false;
  }

  get albedoMap(): Texture | undefined { return this._albedoMap; }
  set albedoMap(tex: Texture | undefined) {
    if (tex !== this._albedoMap) { this._albedoMap = tex; this._bindGroup = null; }
  }

  get normalMap(): Texture | undefined { return this._normalMap; }
  set normalMap(tex: Texture | undefined) {
    if (tex !== this._normalMap) { this._normalMap = tex; this._bindGroup = null; }
  }

  get merMap(): Texture | undefined { return this._merMap; }
  set merMap(tex: Texture | undefined) {
    if (tex !== this._merMap) { this._merMap = tex; this._bindGroup = null; }
  }

  get variantMask(): number {
    let mask = 0;
    if (this._albedoMap) mask |= HAS_ALBEDO_MAP;
    if (this._normalMap) mask |= HAS_NORMAL_MAP;
    if (this._merMap) mask |= HAS_MER_MAP;
    return mask;
  }

  markDirty(): void { this._dirty = true; }

  getShaderCode(passType: MaterialPassType, _variantMask?: number): string {
    switch (passType) {
      case MaterialPassType.Forward: return forwardPbrWgsl;
      case MaterialPassType.Geometry: return geometryWgsl;
      case MaterialPassType.SkinnedGeometry: return skinnedGeometryWgsl;
    }
  }

  getBindGroupLayout(device: GPUDevice, variantMaskOverrides?: number): GPUBindGroupLayout {
    const mask = variantMaskOverrides ?? this.variantMask;
    let perDevice = PbrMaterial._layoutByDevice.get(device);
    if (!perDevice) {
      perDevice = new Map();
      PbrMaterial._layoutByDevice.set(device, perDevice);
    }
    let layout = perDevice.get(mask);
    if (!layout) {
      const entries: GPUBindGroupLayoutEntry[] = [
        { binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
      ];
      if (mask & HAS_ALBEDO_MAP) {
        entries.push({ binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } });
      }
      if (mask & HAS_NORMAL_MAP) {
        entries.push({ binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } });
      }
      if (mask & HAS_MER_MAP) {
        entries.push({ binding: 3, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } });
      }
      entries.push({ binding: 4, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } });
      layout = device.createBindGroupLayout({ label: `PbrMaterialBGL[${mask}]`, entries });
      perDevice.set(mask, layout);
    }
    return layout;
  }

  getBindGroup(device: GPUDevice): GPUBindGroup {
    if (this._bindGroup
        && this._bindGroupAlbedo === this._albedoMap
        && this._bindGroupNormal === this._normalMap
        && this._bindGroupMer === this._merMap) {
      return this._bindGroup;
    }

    if (!this._uniformBuffer || this._uniformDevice !== device) {
      this._uniformBuffer?.destroy();
      this._uniformBuffer = device.createBuffer({
        label: 'PbrMaterialUniform',
        size: MATERIAL_UNIFORM_SIZE,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      this._uniformDevice = device;
      this._dirty = true;
    }

    const layout = this.getBindGroupLayout(device);
    const sampler = PbrMaterial._getSampler(device);
    const entries: GPUBindGroupEntry[] = [
      { binding: 0, resource: { buffer: this._uniformBuffer } },
    ];
    if (this._albedoMap) {
      entries.push({ binding: 1, resource: this._albedoMap.view });
    }
    if (this._normalMap) {
      entries.push({ binding: 2, resource: this._normalMap.view });
    }
    if (this._merMap) {
      entries.push({ binding: 3, resource: this._merMap.view });
    }
    entries.push({ binding: 4, resource: sampler });

    this._bindGroup = device.createBindGroup({
      label: 'PbrMaterialBG',
      layout,
      entries,
    });
    this._bindGroupAlbedo = this._albedoMap;
    this._bindGroupNormal = this._normalMap;
    this._bindGroupMer = this._merMap;
    return this._bindGroup;
  }

  update(queue: GPUQueue): void {
    if (!this._dirty || !this._uniformBuffer) return;
    const data = this._scratch;
    data[0] = this.albedo[0];
    data[1] = this.albedo[1];
    data[2] = this.albedo[2];
    data[3] = this.albedo[3];
    data[4] = this.roughness;
    data[5] = this.metallic;
    data[6] = this.uvOffset?.[0] ?? 0;
    data[7] = this.uvOffset?.[1] ?? 0;
    data[8] = this.uvScale?.[0] ?? 1;
    data[9] = this.uvScale?.[1] ?? 1;
    data[10] = this.uvTile?.[0] ?? 1;
    data[11] = this.uvTile?.[1] ?? 1;
    queue.writeBuffer(this._uniformBuffer, 0, data.buffer as ArrayBuffer);
    this._dirty = false;
  }

  destroy(): void {
    this._uniformBuffer?.destroy();
    this._uniformBuffer = null;
    this._uniformDevice = null;
    this._bindGroup = null;
  }

  private static _getSampler(device: GPUDevice): GPUSampler {
    let s = PbrMaterial._samplerByDevice.get(device);
    if (!s) {
      s = device.createSampler({
        label: 'PbrMaterialSampler',
        magFilter: 'linear',
        minFilter: 'linear',
        addressModeU: 'repeat',
        addressModeV: 'repeat',
      });
      PbrMaterial._samplerByDevice.set(device, s);
    }
    return s;
  }
}
