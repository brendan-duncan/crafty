import { Texture } from './texture.js';
import { SkinnedMesh } from './skinned_mesh.js';
import { Skeleton } from '../engine/skeleton.js';
import type { AnimationClip, AnimationChannel, Interpolation } from '../engine/animation.js';
import { Material } from '../renderer/material.js';
import { PbrMaterial } from '../renderer/materials/pbr_material.js';

// ---- GLTF JSON types --------------------------------------------------------

interface GltfJson {
  asset       : { version: string };
  scene?      : number;
  scenes?     : { nodes?: number[] }[];
  nodes?      : GltfNode[];
  meshes?     : GltfMeshJson[];
  accessors?  : GltfAccessor[];
  bufferViews?: GltfBufferView[];
  buffers?    : { byteLength: number; uri?: string }[];
  materials?  : GltfMaterial[];
  textures?   : { sampler?: number; source?: number }[];
  images?     : GltfImage[];
  samplers?   : object[];
  skins?      : GltfSkinJson[];
  animations? : GltfAnimationJson[];
}

interface GltfNode {
  name?       : string;
  children?   : number[];
  mesh?       : number;
  skin?       : number;
  translation?: [number, number, number];
  rotation?   : [number, number, number, number];
  scale?      : [number, number, number];
  matrix?     : number[];
}

interface GltfMeshJson {
  name?      : string;
  primitives : GltfPrimitive[];
}

interface GltfPrimitive {
  attributes : { [name: string]: number };
  indices?   : number;
  material?  : number;
  mode?      : number;  // 4 = TRIANGLES (default)
}

interface GltfAccessor {
  bufferView?    : number;
  byteOffset?    : number;
  componentType  : number;  // 5120=i8 5121=u8 5122=i16 5123=u16 5125=u32 5126=f32
  count          : number;
  type           : string;  // "SCALAR" "VEC2" "VEC3" "VEC4" "MAT4" etc.
  normalized?    : boolean;
  sparse?        : object;
}

interface GltfBufferView {
  buffer     : number;
  byteOffset?: number;
  byteLength : number;
  byteStride?: number;
  target?    : number;
}

interface GltfMaterial {
  name?               : string;
  pbrMetallicRoughness?: {
    baseColorFactor?           : [number, number, number, number];
    baseColorTexture?          : { index: number };
    metallicFactor?            : number;
    roughnessFactor?           : number;
    metallicRoughnessTexture?  : { index: number };
  };
  normalTexture?       : { index: number };
  doubleSided?         : boolean;
  alphaMode?           : string;
}

interface GltfImage {
  uri?        : string;
  mimeType?   : string;
  bufferView? : number;
}

interface GltfSkinJson {
  name?                : string;
  joints               : number[];
  skeleton?            : number;
  inverseBindMatrices? : number;
}

interface GltfAnimationJson {
  name?     : string;
  channels  : { sampler: number; target: { node?: number; path: string } }[];
  samplers  : { input: number; output: number; interpolation?: string }[];
}

// ---- Public output types ----------------------------------------------------

/**
 * One renderable primitive parsed from a glTF mesh.
 *
 * Pairs a GPU-resident skinned mesh with the resolved PBR material.
 */
export interface GltfMeshData {
  skinnedMesh  : SkinnedMesh;
  material     : Material;
}

/**
 * Result of loading a glTF 2.0 (.glb) file.
 *
 * Owns GPU resources (vertex/index buffers and textures) for every mesh and
 * material; the caller must call `destroy()` to release them.
 */
export interface GltfModel {
  meshes   : GltfMeshData[];
  skin     : Skeleton | null;
  clips    : AnimationClip[];
  /** Releases all GPU buffers and textures created by the loader. */
  destroy  : () => void;
}

// ---- Element counts per accessor type --------------------------------------

const TYPE_COUNT: Record<string, number> = {
  SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4,
  MAT2: 4, MAT3: 9, MAT4: 16,
};

// ---- Accessor reading -------------------------------------------------------

function readFloat32Accessor(
  acc: GltfAccessor,
  bufferViews: GltfBufferView[],
  bin: ArrayBuffer,
): Float32Array {
  const n      = TYPE_COUNT[acc.type] ?? 1;
  const bv     = acc.bufferView != null ? bufferViews[acc.bufferView] : null;
  const bvOff  = bv ? (bv.byteOffset ?? 0) : 0;
  const accOff = acc.byteOffset ?? 0;
  const stride = bv?.byteStride ?? (n * 4);
  const count  = acc.count;

  const out = new Float32Array(count * n);
  const src = new DataView(bin, bvOff + accOff);

  if (acc.componentType === 5126) {
    for (let i = 0; i < count; i++) {
      for (let c = 0; c < n; c++) {
        out[i * n + c] = src.getFloat32(i * stride + c * 4, true);
      }
    }
  } else {
    throw new Error(`readFloat32Accessor: unsupported componentType ${acc.componentType}`);
  }

  return out;
}

function readUint32Accessor(
  acc: GltfAccessor,
  bufferViews: GltfBufferView[],
  bin: ArrayBuffer,
): Uint32Array {
  const n      = TYPE_COUNT[acc.type] ?? 1;
  const bv     = acc.bufferView != null ? bufferViews[acc.bufferView] : null;
  const bvOff  = bv ? (bv.byteOffset ?? 0) : 0;
  const accOff = acc.byteOffset ?? 0;
  const count  = acc.count;

  const out = new Uint32Array(count * n);
  const src = new DataView(bin, bvOff + accOff);

  if (acc.componentType === 5125) {
    const stride = bv?.byteStride ?? (n * 4);
    for (let i = 0; i < count; i++) {
      for (let c = 0; c < n; c++) {
        out[i * n + c] = src.getUint32(i * stride + c * 4, true);
      }
    }
  } else if (acc.componentType === 5123) {
    const stride = bv?.byteStride ?? (n * 2);
    for (let i = 0; i < count; i++) {
      for (let c = 0; c < n; c++) {
        out[i * n + c] = src.getUint16(i * stride + c * 2, true);
      }
    }
  } else if (acc.componentType === 5121) {
    const stride = bv?.byteStride ?? n;
    for (let i = 0; i < count; i++) {
      for (let c = 0; c < n; c++) {
        out[i * n + c] = src.getUint8(i * stride + c);
      }
    }
  } else {
    throw new Error(`readUint32Accessor: unsupported componentType ${acc.componentType}`);
  }

  return out;
}

// Reads joint indices as uint32, handling uint16 and uint8 source formats.
function readJointsAccessor(
  acc: GltfAccessor,
  bufferViews: GltfBufferView[],
  bin: ArrayBuffer,
): Uint32Array {
  return readUint32Accessor(acc, bufferViews, bin);
}

// ---- Tangent generation -----------------------------------------------------

function computeTangents(
  positions: Float32Array,
  normals  : Float32Array,
  uvs      : Float32Array,
  indices  : Uint32Array,
): Float32Array {
  const vertCount = positions.length / 3;
  const tan1 = new Float32Array(vertCount * 3);
  const tan2 = new Float32Array(vertCount * 3);

  for (let i = 0; i < indices.length; i += 3) {
    const i0 = indices[i], i1 = indices[i + 1], i2 = indices[i + 2];
    const p0x = positions[i0*3], p0y = positions[i0*3+1], p0z = positions[i0*3+2];
    const p1x = positions[i1*3], p1y = positions[i1*3+1], p1z = positions[i1*3+2];
    const p2x = positions[i2*3], p2y = positions[i2*3+1], p2z = positions[i2*3+2];
    const u0 = uvs[i0*2], v0 = uvs[i0*2+1];
    const u1 = uvs[i1*2], v1 = uvs[i1*2+1];
    const u2 = uvs[i2*2], v2 = uvs[i2*2+1];
    const e1x = p1x-p0x, e1y = p1y-p0y, e1z = p1z-p0z;
    const e2x = p2x-p0x, e2y = p2y-p0y, e2z = p2z-p0z;
    const du1 = u1-u0, dv1 = v1-v0, du2 = u2-u0, dv2 = v2-v0;
    const d = du1*dv2 - du2*dv1;
    if (Math.abs(d) < 1e-9) {
      continue;
    }
    const r = 1 / d;
    const tx = (dv2*e1x - dv1*e2x)*r, ty = (dv2*e1y - dv1*e2y)*r, tz = (dv2*e1z - dv1*e2z)*r;
    const bx = (du1*e2x - du2*e1x)*r, by = (du1*e2y - du2*e1y)*r, bz = (du1*e2z - du2*e1z)*r;
    for (const vi of [i0, i1, i2]) {
      tan1[vi*3] += tx; tan1[vi*3+1] += ty; tan1[vi*3+2] += tz;
      tan2[vi*3] += bx; tan2[vi*3+1] += by; tan2[vi*3+2] += bz;
    }
  }

  const tangents = new Float32Array(vertCount * 4);
  for (let i = 0; i < vertCount; i++) {
    const nx = normals[i*3], ny = normals[i*3+1], nz = normals[i*3+2];
    const tx = tan1[i*3], ty = tan1[i*3+1], tz = tan1[i*3+2];
    // Gram-Schmidt
    const dot = nx*tx + ny*ty + nz*tz;
    const ox = tx - nx*dot, oy = ty - ny*dot, oz = tz - nz*dot;
    const len = Math.sqrt(ox*ox + oy*oy + oz*oz);
    const sx = len > 0 ? ox/len : 1, sy = len > 0 ? oy/len : 0, sz = len > 0 ? oz/len : 0;
    // Bitangent sign: cross(n,t)·t2
    const cx = ny*sz - nz*sy, cy = nz*sx - nx*sz, cz = nx*sy - ny*sx;
    const w = (cx*tan2[i*3] + cy*tan2[i*3+1] + cz*tan2[i*3+2]) < 0 ? -1 : 1;
    tangents[i*4] = sx; tangents[i*4+1] = sy; tangents[i*4+2] = sz; tangents[i*4+3] = w;
  }
  return tangents;
}

// ---- Texture loading --------------------------------------------------------

async function loadGltfTexture(
  device: GPUDevice,
  texIndex: number,
  gltf: GltfJson,
  bin: ArrayBuffer,
  srgb: boolean,
): Promise<Texture | null> {
  const tex  = gltf.textures?.[texIndex];
  if (!tex || tex.source == null) {
    return null;
  }
  const img = gltf.images?.[tex.source];
  if (!img) {
    return null;
  }

  if (img.bufferView != null) {
    const bv     = gltf.bufferViews![img.bufferView];
    const bytes  = new Uint8Array(bin, bv.byteOffset ?? 0, bv.byteLength);
    const blob   = new Blob([bytes], { type: img.mimeType ?? 'image/png' });
    const bitmap = await createImageBitmap(blob, { colorSpaceConversion: 'none' });
    return Texture.fromBitmap(device, bitmap, { srgb });
  }

  if (img.uri) {
    return Texture.fromUrl(device, img.uri, { srgb });
  }

  return null;
}

// ---- Node/matrix helpers ----------------------------------------------------

function nodeLocalMatrix(node: GltfNode): Float32Array {
  if (node.matrix) {
    return new Float32Array(node.matrix);
  }
  const t = node.translation ?? [0, 0, 0];
  const r = node.rotation    ?? [0, 0, 0, 1];
  const s = node.scale       ?? [1, 1, 1];
  const [qx, qy, qz, qw] = r;
  const [sx, sy, sz] = s;
  const x2 = qx+qx, y2 = qy+qy, z2 = qz+qz;
  const xx = qx*x2, xy = qx*y2, xz = qx*z2;
  const yy = qy*y2, yz = qy*z2, zz = qz*z2;
  const wx = qw*x2, wy = qw*y2, wz = qw*z2;
  const m = new Float32Array(16);
  m[0]  = (1-(yy+zz))*sx; m[1]  = (xy+wz)*sx; m[2]  = (xz-wy)*sx; m[3]  = 0;
  m[4]  = (xy-wz)*sy; m[5]  = (1-(xx+zz))*sy; m[6]  = (yz+wx)*sy; m[7]  = 0;
  m[8]  = (xz+wy)*sz; m[9]  = (yz-wx)*sz; m[10] = (1-(xx+yy))*sz; m[11] = 0;
  m[12] = t[0]; m[13] = t[1]; m[14] = t[2]; m[15] = 1;
  return m;
}

function mat4MulF32(a: Float32Array, b: Float32Array): Float32Array {
  const out = new Float32Array(16);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) {
        sum += a[k*4+row] * b[col*4+k];
      }
      out[col*4+row] = sum;
    }
  }
  return out;
}

// ---- Main loader ------------------------------------------------------------

/**
 * Loader for binary glTF 2.0 (.glb) assets.
 *
 * Parses the GLB container, decodes accessors/buffer views, computes missing
 * tangents, builds skinned meshes, materials, skeletons, and animation clips,
 * and uploads textures to the GPU.
 */
export class GltfLoader {
  /**
   * Fetches and parses a GLB file at `url` into GPU-ready resources.
   *
   * Creates GPU vertex/index buffers and textures owned by the returned
   * model; the caller must invoke `model.destroy()` to release them.
   *
   * @param device - WebGPU device used to create buffers and textures.
   * @param url - URL of a binary glTF 2.0 (.glb) file.
   * @returns Parsed meshes, optional skeleton, and animation clips.
   * @throws If the file is not a valid GLB 2.0 container or the JSON chunk is missing.
   */
  static async load(device: GPUDevice, url: string): Promise<GltfModel> {
    const response = await fetch(url);
    const arrayBuf = await response.arrayBuffer();
    const view     = new DataView(arrayBuf);

    // ---- Parse GLB header ----
    const magic   = view.getUint32(0, true);
    const version = view.getUint32(4, true);
    if (magic !== 0x46546C67 || version !== 2) {
      throw new Error('Not a valid GLB 2.0 file');
    }

    let gltfJson: GltfJson | null = null;
    let binBuffer: ArrayBuffer = new ArrayBuffer(0);

    let offset = 12;
    while (offset < arrayBuf.byteLength) {
      const chunkLength = view.getUint32(offset, true);
      const chunkType   = view.getUint32(offset + 4, true);
      offset += 8;
      if (chunkType === 0x4E4F534A) {
        const jsonBytes = new Uint8Array(arrayBuf, offset, chunkLength);
        gltfJson = JSON.parse(new TextDecoder().decode(jsonBytes));
      } else if (chunkType === 0x004E4942) {
        binBuffer = arrayBuf.slice(offset, offset + chunkLength);
      }
      offset += chunkLength;
    }

    if (!gltfJson) {
      throw new Error('GLB: no JSON chunk found');
    }

    const gltf = gltfJson;
    const accessors  = gltf.accessors  ?? [];
    const bufViews   = gltf.bufferViews ?? [];
    const nodes      = gltf.nodes      ?? [];

    // ---- Build node-parent map ----
    const nodeParent = new Int32Array(nodes.length).fill(-1);
    for (let ni = 0; ni < nodes.length; ni++) {
      for (const ci of (nodes[ni].children ?? [])) {
        nodeParent[ci] = ni;
      }
    }

    // ---- Parse skin ----
    let skeleton: Skeleton | null = null;
    const nodeToJoint = new Map<number, number>();

    if (gltf.skins && gltf.skins.length > 0) {
      const skinJson   = gltf.skins[0];
      const jointNodes = skinJson.joints;
      const jointCount = jointNodes.length;

      for (let j = 0; j < jointCount; j++) {
        nodeToJoint.set(jointNodes[j], j);
      }

      // Parent indices
      const parentIndices = new Int16Array(jointCount).fill(-1);
      for (let j = 0; j < jointCount; j++) {
        const pni = nodeParent[jointNodes[j]];
        if (pni >= 0 && nodeToJoint.has(pni)) {
          parentIndices[j] = nodeToJoint.get(pni)!;
        }
      }

      // Inverse bind matrices
      let invBindMats: Float32Array;
      if (skinJson.inverseBindMatrices != null) {
        invBindMats = readFloat32Accessor(accessors[skinJson.inverseBindMatrices], bufViews, binBuffer);
      } else {
        invBindMats = new Float32Array(jointCount * 16);
        for (let j = 0; j < jointCount; j++) {
          const base = j * 16;
          invBindMats[base] = invBindMats[base + 5] = invBindMats[base + 10] = invBindMats[base + 15] = 1;
        }
      }

      // Rest pose from node defaults
      const restT = new Float32Array(jointCount * 3);
      const restR = new Float32Array(jointCount * 4);
      const restS = new Float32Array(jointCount * 3);
      for (let j = 0; j < jointCount; j++) {
        const node = nodes[jointNodes[j]];
        if (node.translation) { 
          restT[j*3] = node.translation[0]; 
          restT[j*3+1] = node.translation[1]; 
          restT[j*3+2] = node.translation[2];
        }
        restR[j*4+3] = 1; // identity quaternion w=1
        if (node.rotation) {
          restR[j*4] = node.rotation[0];
          restR[j*4+1] = node.rotation[1];
          restR[j*4+2] = node.rotation[2];
          restR[j*4+3] = node.rotation[3];
        }
        restS[j*3] = restS[j*3+1] = restS[j*3+2] = 1;
        if (node.scale) {
          restS[j*3] = node.scale[0];
          restS[j*3+1] = node.scale[1];
          restS[j*3+2] = node.scale[2];
        }
      }

      // Compute accumulated transform of all ancestor nodes above the root joint.
      // These are non-joint nodes whose transforms are baked into the IBMs but
      // not included in our joint-only hierarchy traversal.
      let rootTransform: Float32Array = new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
      let anc = nodeParent[jointNodes[0]];
      while (anc >= 0) {
        rootTransform = mat4MulF32(nodeLocalMatrix(nodes[anc]), rootTransform);
        anc = nodeParent[anc];
      }

      skeleton = new Skeleton(parentIndices, invBindMats, restT, restR, restS, rootTransform);
    }

    // ---- Parse animations ----
    const clips: AnimationClip[] = [];
    for (const animJson of (gltf.animations ?? [])) {
      const channels: AnimationChannel[] = [];
      let duration = 0;

      for (const ch of animJson.channels) {
        const targetNode = ch.target.node;
        if (targetNode == null || !nodeToJoint.has(targetNode)) {
          continue;
        }
        const jointIndex = nodeToJoint.get(targetNode)!;
        const prop = ch.target.path as 'translation' | 'rotation' | 'scale';
        if (prop !== 'translation' && prop !== 'rotation' && prop !== 'scale') {
          continue;
        }

        const samp = animJson.samplers[ch.sampler];
        const times = readFloat32Accessor(accessors[samp.input],  bufViews, binBuffer);
        const values = readFloat32Accessor(accessors[samp.output], bufViews, binBuffer);
        const interpolation = (samp.interpolation ?? 'LINEAR') as Interpolation;

        if (times.length > 0) {
          duration = Math.max(duration, times[times.length - 1]);
        }

        channels.push({ jointIndex, property: prop, times, values, interpolation });
      }

      clips.push({ name: animJson.name ?? `Anim_${clips.length}`, duration, channels });
    }

    // ---- Parse meshes ----
    const meshDatas: GltfMeshData[] = [];
    const textures: (Texture | null)[] = [];

    const loadTex = async (idx: number | undefined, srgb: boolean): Promise<Texture | null> => {
      if (idx == null) {
        return null;
      }
      if (!(idx in textures)) {
        textures[idx] = await loadGltfTexture(device, idx, gltf, binBuffer, srgb);
      }
      return textures[idx]!;
    };

    for (const meshJson of (gltf.meshes ?? [])) {
      for (const prim of meshJson.primitives) {
        const attrs    = prim.attributes;
        const vertCount = accessors[attrs['POSITION']].count;

        const positions = readFloat32Accessor(accessors[attrs['POSITION']], bufViews, binBuffer);
        const normals   = attrs['NORMAL']     != null ? readFloat32Accessor(accessors[attrs['NORMAL']],     bufViews, binBuffer) : new Float32Array(vertCount * 3);
        const uvs       = attrs['TEXCOORD_0'] != null ? readFloat32Accessor(accessors[attrs['TEXCOORD_0']], bufViews, binBuffer) : new Float32Array(vertCount * 2);
        const tangents  = attrs['TANGENT']    != null ? readFloat32Accessor(accessors[attrs['TANGENT']],    bufViews, binBuffer) : null;
        const jointsRaw = attrs['JOINTS_0']   != null ? readJointsAccessor(accessors[attrs['JOINTS_0']],    bufViews, binBuffer) : null;
        const weights   = attrs['WEIGHTS_0']  != null ? readFloat32Accessor(accessors[attrs['WEIGHTS_0']],  bufViews, binBuffer) : null;

        // Indices (always convert to uint32)
        let indices: Uint32Array;
        if (prim.indices != null) {
          indices = readUint32Accessor(accessors[prim.indices], bufViews, binBuffer);
        } else {
          indices = new Uint32Array(vertCount);
          for (let i = 0; i < vertCount; i++) {
            indices[i] = i;
          }
        }

        const finalTangents = tangents ?? computeTangents(positions, normals, uvs, indices);

        // Pack vertex buffer (80 bytes = 20 × f32-sized words per vertex)
        const floatsPerVert = 20;
        const vertBuf = new Float32Array(vertCount * floatsPerVert);
        const vertU32 = new Uint32Array(vertBuf.buffer);

        for (let i = 0; i < vertCount; i++) {
          const f = i * floatsPerVert;
          vertBuf[f]      = positions[i*3];   vertBuf[f+1]  = positions[i*3+1]; vertBuf[f+2]  = positions[i*3+2];
          vertBuf[f+3]    = normals[i*3];     vertBuf[f+4]  = normals[i*3+1];   vertBuf[f+5]  = normals[i*3+2];
          vertBuf[f+6]    = uvs[i*2];         vertBuf[f+7]  = uvs[i*2+1];
          vertBuf[f+8]    = finalTangents[i*4]; vertBuf[f+9]  = finalTangents[i*4+1];
          vertBuf[f+10]   = finalTangents[i*4+2]; vertBuf[f+11] = finalTangents[i*4+3];
          // joints at f+12..15 as u32
          if (jointsRaw) {
            vertU32[f+12] = jointsRaw[i*4]; vertU32[f+13] = jointsRaw[i*4+1];
            vertU32[f+14] = jointsRaw[i*4+2]; vertU32[f+15] = jointsRaw[i*4+3];
          }
          // weights at f+16..19
          if (weights) {
            vertBuf[f+16] = weights[i*4]; vertBuf[f+17] = weights[i*4+1];
            vertBuf[f+18] = weights[i*4+2]; vertBuf[f+19] = weights[i*4+3];
          } else {
            vertBuf[f+16] = 1; // full weight on joint 0
          }
        }

        const skinnedMesh = SkinnedMesh.fromData(device, vertBuf, indices);

        // Material
        const matJson = prim.material != null ? gltf.materials?.[prim.material] : undefined;
        const pbr = matJson?.pbrMetallicRoughness;
        const albedoMap = await loadTex(pbr?.baseColorTexture?.index, true);
        const normalMap = await loadTex(matJson?.normalTexture?.index, false);

        const material: Material = new PbrMaterial({
          albedo   : (pbr?.baseColorFactor as [number, number, number, number] | undefined) ?? [1, 1, 1, 1],
          roughness: pbr?.roughnessFactor  ?? 0.5,
          metallic : pbr?.metallicFactor   ?? 0,
          albedoMap: albedoMap ?? undefined,
          normalMap: normalMap ?? undefined,
        });

        meshDatas.push({ skinnedMesh, material });
      }
    }

    const allTextures = textures.filter(Boolean) as Texture[];

    return {
      meshes : meshDatas,
      skin   : skeleton,
      clips,
      destroy() {
        for (const md of meshDatas) {
          md.skinnedMesh.destroy();
        }
        for (const t of allTextures) {
          t.destroy();
        }
      },
    };
  }
}
