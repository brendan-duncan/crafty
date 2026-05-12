import { Material, MaterialPassType } from '../material.js';
import forwardPbrWgsl from '../../shaders/forward_pbr.wgsl?raw';
import geometryWgsl from '../../shaders/geometry.wgsl?raw';
import skinnedGeometryWgsl from '../../shaders/skinned_geometry.wgsl?raw';
const MATERIAL_UNIFORM_SIZE = 48; // vec4 albedo + f32 roughness + f32 metallic + 2× vec2 + vec2 pad
/**
 * Standard physically-based-rendering material — preserves the renderer's
 * historical PBR shader/data combination.
 *
 * Owns a 48-byte uniform buffer (albedo / roughness / metallic / UV transform)
 * and binds the three texture maps with a shared linear repeat sampler.
 * Compatible with the geometry, forward, and skinned-geometry passes; one
 * `shaderId = 'pbr'` is shared across all instances so they all use a single
 * cached pipeline per pass.
 */
export class PbrMaterial extends Material {
    shaderId = 'pbr';
    albedo;
    roughness;
    metallic;
    uvOffset;
    uvScale;
    uvTile;
    _albedoMap;
    _normalMap;
    _merMap;
    static _layoutByDevice = new WeakMap();
    static _samplerByDevice = new WeakMap();
    static _whiteByDevice = new WeakMap();
    static _flatNormalByDevice = new WeakMap();
    static _merDefaultByDevice = new WeakMap();
    _uniformBuffer = null;
    _uniformDevice = null;
    _bindGroup = null;
    _bindGroupAlbedo;
    _bindGroupNormal;
    _bindGroupMer;
    _dirty = true;
    _scratch = new Float32Array(MATERIAL_UNIFORM_SIZE / 4);
    constructor(options = {}) {
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
    /** RGB multiplied with albedo colour; sRGB recommended. */
    get albedoMap() {
        return this._albedoMap;
    }
    set albedoMap(tex) {
        if (tex !== this._albedoMap) {
            this._albedoMap = tex;
            this._bindGroup = null;
        }
    }
    /** Tangent-space normal map (rgb, linear). */
    get normalMap() {
        return this._normalMap;
    }
    set normalMap(tex) {
        if (tex !== this._normalMap) {
            this._normalMap = tex;
            this._bindGroup = null;
        }
    }
    /** Packed map: r=metallic multiplier, g=emissive (unused), b=roughness multiplier. */
    get merMap() {
        return this._merMap;
    }
    set merMap(tex) {
        if (tex !== this._merMap) {
            this._merMap = tex;
            this._bindGroup = null;
        }
    }
    /** Mark uniform parameters as needing re-upload before next draw. */
    markDirty() {
        this._dirty = true;
    }
    getShaderCode(passType) {
        switch (passType) {
            case MaterialPassType.Forward: return forwardPbrWgsl;
            case MaterialPassType.Geometry: return geometryWgsl;
            case MaterialPassType.SkinnedGeometry: return skinnedGeometryWgsl;
        }
    }
    getBindGroupLayout(device) {
        let layout = PbrMaterial._layoutByDevice.get(device);
        if (!layout) {
            layout = device.createBindGroupLayout({
                label: 'PbrMaterialBGL',
                entries: [
                    { binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
                    { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
                    { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
                    { binding: 3, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
                    { binding: 4, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
                ],
            });
            PbrMaterial._layoutByDevice.set(device, layout);
        }
        return layout;
    }
    getBindGroup(device) {
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
        const sampler = PbrMaterial._getSampler(device);
        const albedoView = this._albedoMap?.view ?? PbrMaterial._getWhite(device);
        const normalView = this._normalMap?.view ?? PbrMaterial._getFlatNormal(device);
        const merView = this._merMap?.view ?? PbrMaterial._getMerDefault(device);
        this._bindGroup = device.createBindGroup({
            label: 'PbrMaterialBG',
            layout: this.getBindGroupLayout(device),
            entries: [
                { binding: 0, resource: { buffer: this._uniformBuffer } },
                { binding: 1, resource: albedoView },
                { binding: 2, resource: normalView },
                { binding: 3, resource: merView },
                { binding: 4, resource: sampler },
            ],
        });
        this._bindGroupAlbedo = this._albedoMap;
        this._bindGroupNormal = this._normalMap;
        this._bindGroupMer = this._merMap;
        return this._bindGroup;
    }
    update(queue) {
        if (!this._dirty || !this._uniformBuffer) {
            return;
        }
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
        queue.writeBuffer(this._uniformBuffer, 0, data.buffer);
        this._dirty = false;
    }
    destroy() {
        this._uniformBuffer?.destroy();
        this._uniformBuffer = null;
        this._uniformDevice = null;
        this._bindGroup = null;
    }
    static _getSampler(device) {
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
    static _make1x1View(device, label, r, g, b, a) {
        const tex = device.createTexture({
            label,
            size: { width: 1, height: 1 },
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
        });
        device.queue.writeTexture({ texture: tex }, new Uint8Array([r, g, b, a]), { bytesPerRow: 4 }, { width: 1, height: 1 });
        return tex.createView();
    }
    static _getWhite(device) {
        let v = PbrMaterial._whiteByDevice.get(device);
        if (!v) {
            v = PbrMaterial._make1x1View(device, 'PbrFallbackWhite', 255, 255, 255, 255);
            PbrMaterial._whiteByDevice.set(device, v);
        }
        return v;
    }
    static _getFlatNormal(device) {
        let v = PbrMaterial._flatNormalByDevice.get(device);
        if (!v) {
            v = PbrMaterial._make1x1View(device, 'PbrFallbackFlatNormal', 128, 128, 255, 255);
            PbrMaterial._flatNormalByDevice.set(device, v);
        }
        return v;
    }
    static _getMerDefault(device) {
        let v = PbrMaterial._merDefaultByDevice.get(device);
        if (!v) {
            // r=metallic=1.0 (multiplier with material.metallic), g=emissive=0, b=roughness=1.0 (multiplier with material.roughness)
            v = PbrMaterial._make1x1View(device, 'PbrFallbackMer', 255, 0, 255, 255);
            PbrMaterial._merDefaultByDevice.set(device, v);
        }
        return v;
    }
}
