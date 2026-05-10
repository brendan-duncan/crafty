import { Vec2 } from "../math/vec2.js"
import { Vec3 } from "../math/vec3.js"

/** Reference horizontal resolution used for UI layout scaling. */
export const BASE_RESOLUTION_WIDTH = 1280;
/** Reference vertical resolution used for UI layout scaling. */
export const BASE_RESOLUTION_HEIGHT = 720;
/** Width in pixels of the block texture atlas. */
export const BLOCK_ATLAS_WIDTH = 400;
/** Height in pixels of the block texture atlas. */
export const BLOCK_ATLAS_HEIGHT = 400;
/** Width and height in pixels of a single block texture tile in the atlas. */
export const BLOCK_ATLAS_TEX_SIZE = 16;
/** Number of tile columns in the atlas. */
export const BLOCK_ATLAS_WIDTH_DIVIDED = BLOCK_ATLAS_WIDTH / BLOCK_ATLAS_TEX_SIZE;
/** Number of tile rows in the atlas. */
export const BLOCK_ATLAS_HEIGHT_DIVIDED = BLOCK_ATLAS_HEIGHT / BLOCK_ATLAS_TEX_SIZE;

/** Identifier for every distinct block kind. `NONE` is air, `MAX` is a sentinel. */
export enum BlockType {
  NONE,
  GRASS,
  SAND,
  STONE,
  DIRT,
  TRUNK,
  TREELEAVES,
  WATER,
  GLASS,
  FLOWER,
  GLOWSTONE,
  MAGMA,
  OBSIDIAN,
  DIAMOND,
  IRON,
  SPECULAR,
  CACTUS,
  SNOW,
  GRASS_SNOW,
  SPRUCE_PLANKS,
  GRASS_PROP,
  TORCH,
  DEAD_BUSH,
  SNOWYLEAVES,
  AMETHYST,
  MAX
}

/**
 * Per-block atlas tile coordinates for each face group.
 *
 * Each `Vec2` is a tile (column, row) index into the texture atlas.
 */
export class BlockTextureOffsetData {
  /** Block this entry describes. */
  blockType: BlockType;
  /** Atlas tile for the four side faces. */
  sideFace: Vec2;
  /** Atlas tile for the bottom face. */
  bottomFace: Vec2;
  /** Atlas tile for the top face. */
  topFace: Vec2;

  /**
   * Creates a new block texture offset entry.
   *
   * @param bt - block type
   * @param sf - side face tile coordinate
   * @param bf - bottom face tile coordinate
   * @param tf - top face tile coordinate
   */
  constructor(bt: BlockType, sf: Vec2, bf: Vec2, tf: Vec2) {
    this.blockType = bt;
    this.sideFace = sf;
    this.bottomFace = bf;
    this.topFace = tf;
  }
}

/** Texture atlas offsets indexed by `BlockType`. */
export const blockTextureOffsetData: BlockTextureOffsetData[] = [
  //NONE
  new BlockTextureOffsetData(BlockType.NONE,
    new Vec2(0, 0),
    new Vec2(0, 0),
    new Vec2(0, 0)),

  //GRASS
  new BlockTextureOffsetData(BlockType.GRASS,
    new Vec2(1, 0),
    new Vec2(3, 0),
    new Vec2(2, 0)),

  //SAND
  new BlockTextureOffsetData(BlockType.SAND,
    new Vec2(4, 0),
    new Vec2(4, 0),
    new Vec2(4, 0)),

  //STONE
  new BlockTextureOffsetData(BlockType.STONE,
    new Vec2(5, 0),
    new Vec2(5, 0),
    new Vec2(5, 0)),

  //DIRT
  new BlockTextureOffsetData(BlockType.DIRT,
    new Vec2(6, 0),
    new Vec2(6, 0),
    new Vec2(6, 0)),

  //TRUNK
  new BlockTextureOffsetData(BlockType.TRUNK,
    new Vec2(7, 0),
    new Vec2(8, 0),
    new Vec2(8, 0)),

  //TREE LEAVES
  new BlockTextureOffsetData(BlockType.TREELEAVES,
    new Vec2(9, 0),
    new Vec2(9, 0),
    new Vec2(9, 0)),

  //WATER
  new BlockTextureOffsetData(BlockType.WATER,
    new Vec2(2, 29),
    new Vec2(2, 29),
    new Vec2(2, 29)),

  //GLASS
  new BlockTextureOffsetData(BlockType.GLASS,
    new Vec2(10, 0),
    new Vec2(10, 0),
    new Vec2(10, 0)),

  //FLOWER
  new BlockTextureOffsetData(BlockType.FLOWER,
    new Vec2(23, 0),
    new Vec2(23, 0),
    new Vec2(23, 0)),

  //GLOWSTONE
  new BlockTextureOffsetData(BlockType.GLOWSTONE,
    new Vec2(11, 0),
    new Vec2(11, 0),
    new Vec2(11, 0)),

  //MAGMA
  new BlockTextureOffsetData(BlockType.MAGMA,
    new Vec2(12, 0),
    new Vec2(12, 0),
    new Vec2(12, 0)),

  //OBSIDIAN
  new BlockTextureOffsetData(BlockType.OBSIDIAN,
    new Vec2(13, 0),
    new Vec2(13, 0),
    new Vec2(13, 0)),

  //DIAMOND
  new BlockTextureOffsetData(BlockType.DIAMOND,
    new Vec2(14, 0),
    new Vec2(14, 0),
    new Vec2(14, 0)),

  //IRON
  new BlockTextureOffsetData(BlockType.IRON,
    new Vec2(15, 0),
    new Vec2(15, 0),
    new Vec2(15, 0)),

  //SPECULAR
  new BlockTextureOffsetData(BlockType.SPECULAR,
    new Vec2(0, 24),
    new Vec2(0, 24),
    new Vec2(0, 24)),

  //CACTUS
  new BlockTextureOffsetData(BlockType.CACTUS,
    new Vec2(17, 0),
    new Vec2(18, 0),
    new Vec2(16, 0)),

  //SNOW
  new BlockTextureOffsetData(BlockType.SNOW,
    new Vec2(19, 0),
    new Vec2(19, 0),
    new Vec2(19, 0)),

  //SNOW
  new BlockTextureOffsetData(BlockType.GRASS_SNOW,
    new Vec2(20, 0),
    new Vec2(3, 0),
    new Vec2(21, 0)),

  //SPRUCE PLANKS
  new BlockTextureOffsetData(BlockType.SPRUCE_PLANKS,
    new Vec2(22, 0),
    new Vec2(22, 0),
    new Vec2(22, 0)),

  //GRASS PROP
  new BlockTextureOffsetData(BlockType.GRASS_PROP,
    new Vec2(1, 1),
    new Vec2(1, 1),
    new Vec2(1, 1)),

  //TORCH
  new BlockTextureOffsetData(BlockType.TORCH,
    new Vec2(2, 1),
    new Vec2(2, 1),
    new Vec2(2, 1)),

  //DEAD BUSH
  new BlockTextureOffsetData(BlockType.DEAD_BUSH,
    new Vec2(3, 1),
    new Vec2(3, 1),
    new Vec2(3, 1)),

  //SNOWY LEAVES
  new BlockTextureOffsetData(BlockType.SNOWYLEAVES,
    new Vec2(4, 1),
    new Vec2(9, 0),
    new Vec2(21, 0)),

  //SNOWY LEAVES
  new BlockTextureOffsetData(BlockType.AMETHYST,
    new Vec2(5, 1),
    new Vec2(5, 1),
    new Vec2(5, 1)),

  //MAX
  new BlockTextureOffsetData(BlockType.MAX,
    new Vec2(0, 0),
    new Vec2(0, 0),
    new Vec2(0, 0)),
];

/** Render/material category controlling render pass and shader path. */
export enum MaterialType {
  OPAQUE,
  SEMI_TRANSPARENT,
  WATER,
  PROP
}

/**
 * Material/physics flags for a block.
 */
export class BlockMaterialData {
  /** Block this entry describes. */
  blockType: BlockType;
  /** Render category (opaque, semi-transparent, water, prop). */
  materialType: MaterialType;
  /** 1 if the block emits light, 0 otherwise. */
  emitsLight: number;
  /** 1 if the block collides with entities, 0 otherwise. */
  collidable: number;

  /**
   * Creates a new block material entry.
   *
   * @param blockType - block type
   * @param materialType - render category
   * @param emitsLight - 1 if the block emits light
   * @param collidable - 1 if the block is collidable
   */
  constructor(blockType: BlockType, materialType: MaterialType, emitsLight: number, collidable: number) {
    this.blockType = blockType;
    this.materialType = materialType;
    this.emitsLight = emitsLight;
    this.collidable = collidable;
  }
}

/** Material data indexed by `BlockType`. */
export const blockMaterialData: BlockMaterialData[] = [
  new BlockMaterialData(BlockType.NONE, MaterialType.SEMI_TRANSPARENT, 0, 0),
  new BlockMaterialData(BlockType.GRASS, MaterialType.OPAQUE, 0, 1),
  new BlockMaterialData(BlockType.SAND, MaterialType.OPAQUE, 0, 1),
  new BlockMaterialData(BlockType.STONE, MaterialType.OPAQUE, 0, 1),
  new BlockMaterialData(BlockType.DIRT, MaterialType.OPAQUE, 0, 1),
  new BlockMaterialData(BlockType.TRUNK, MaterialType.OPAQUE, 0, 1),
  new BlockMaterialData(BlockType.TREELEAVES, MaterialType.SEMI_TRANSPARENT, 0, 1),
  new BlockMaterialData(BlockType.WATER, MaterialType.WATER, 0, 0),
  new BlockMaterialData(BlockType.GLASS, MaterialType.SEMI_TRANSPARENT, 0, 1),
  new BlockMaterialData(BlockType.FLOWER, MaterialType.PROP, 0, 0),
  new BlockMaterialData(BlockType.GLOWSTONE, MaterialType.OPAQUE, 1, 1),
  new BlockMaterialData(BlockType.MAGMA, MaterialType.OPAQUE, 1, 1),
  new BlockMaterialData(BlockType.OBSIDIAN, MaterialType.OPAQUE, 0, 1),
  new BlockMaterialData(BlockType.DIAMOND, MaterialType.OPAQUE, 0, 1),
  new BlockMaterialData(BlockType.IRON, MaterialType.OPAQUE, 0, 1),
  new BlockMaterialData(BlockType.SPECULAR, MaterialType.OPAQUE, 0, 1),
  new BlockMaterialData(BlockType.CACTUS, MaterialType.OPAQUE, 0, 1),
  new BlockMaterialData(BlockType.SNOW, MaterialType.OPAQUE, 0, 1),
  new BlockMaterialData(BlockType.GRASS_SNOW, MaterialType.OPAQUE, 0, 1),
  new BlockMaterialData(BlockType.SPRUCE_PLANKS, MaterialType.OPAQUE, 0, 1),
  new BlockMaterialData(BlockType.GRASS_PROP, MaterialType.PROP, 0, 0),
  new BlockMaterialData(BlockType.TORCH, MaterialType.PROP, 1, 0),
  new BlockMaterialData(BlockType.DEAD_BUSH, MaterialType.PROP, 0, 0),
  new BlockMaterialData(BlockType.SNOWYLEAVES, MaterialType.SEMI_TRANSPARENT, 0, 1),
  new BlockMaterialData(BlockType.AMETHYST, MaterialType.OPAQUE, 0, 1)
];

/**
 * Point-light parameters emitted by a block.
 */
export class BlockLightData {
  /** Block this entry describes. */
  blockType: BlockType;

  /** Linear RGB light color. */
  color: Vec3;
  /** Ambient contribution intensity. */
  ambientIntensity: number;
  /** Specular contribution intensity. */
  specularIntensity: number;

  /** Light radius in world units. */
  radius: number;
  /** Falloff exponent. */
  attenuation: number;

  /**
   * Creates a new block light entry.
   *
   * @param bt - block type
   * @param c - light color
   * @param ai - ambient intensity
   * @param si - specular intensity
   * @param r - radius
   * @param atten - attenuation exponent
   */
  constructor(bt: BlockType, c: Vec3, ai: number, si: number, r: number, atten: number) {
    this.blockType = bt;
    this.color = c;
    this.ambientIntensity = ai;
    this.specularIntensity = si;
    this.radius = r;
    this.attenuation = atten;
  }
}

/**
 * Hardness multiplier per block type. Used for progressive block breaking:
 *   breakTime (ms) = hardness * 1500
 * A hardness of 0 means the block breaks instantly (no crack animation).
 * Order matches `BlockType` enum.
 */
export const blockHardness: number[] = [
  0,    // NONE
  0.6,  // GRASS
  0.5,  // SAND
  1.5,  // STONE
  0.5,  // DIRT
  2.0,  // TRUNK
  0.2,  // TREELEAVES
  0,    // WATER
  0.3,  // GLASS
  0,    // FLOWER (prop)
  0.3,  // GLOWSTONE
  0.3,  // MAGMA
  10.0, // OBSIDIAN
  3.0,  // DIAMOND
  3.0,  // IRON
  1.5,  // SPECULAR
  0.4,  // CACTUS
  0.1,  // SNOW
  0.6,  // GRASS_SNOW
  2.0,  // SPRUCE_PLANKS
  0,    // GRASS_PROP (prop)
  0,    // TORCH (prop)
  0,    // DEAD_BUSH (prop)
  0.2,  // SNOWYLEAVES
  1.5,  // AMETHYST
];

/** Light parameters for every light-emitting block. Order is unrelated to `BlockType` index. */
export const blockLightData: BlockLightData[] = [
  //GLOWSTONE
  new BlockLightData(BlockType.GLOWSTONE,
    new Vec3(0.98, 0.85, 0.45),
    24.8,
    0.2,
    6.42,
    0.20),

  //MAGMA
  new BlockLightData(BlockType.MAGMA,
    new Vec3(0.95, 0.06, 0.12),
    32.0,
    12.4,
    8.72,
    0.20),

  //OBSIDIAN 
  new BlockLightData(BlockType.OBSIDIAN,
    new Vec3(0.51, 0.03, 0.89),
    12.0,
    0.4,
    9.22,
    0.20),

  //TORCH
  new BlockLightData(BlockType.TORCH,
    new Vec3(0.95, 0.56, 0.01),
    4.0,
    0.4,
    3.22,
    1.20),
];

/** Human-readable display name indexed by `BlockType`. */
export const blockTypeName: String[] = [
  //NONE
  "None",

  //GRASS
  "Grass",

  //SAND
  "Sand",

  //STONE
  "Stone",

  //DIRT
  "Dirt",

  //TRUNK
  "Trunk",

  //TREE LEAVES
  "Tree leaves",

  //WATER
  "Water",

  //GLASS
  "Glass",

  //FLOWER
  "Flower",

  //GLOWSTONE
  "Glowstone",

  //MAGMA
  "Magma",

  //OBSIDIAN
  "Obsidian",

  //DIAMOND
  "Diamond",

  //IRON
  "Iron",

  //SPECULAR
  "Specular",

  //CACTUS
  "Cactus",

  //SNOW
  "Snow",

  //GRASS SNOW
  "Grass snow",

  //SPRUCE PLANKS
  "Spruce planks",

  //GRASS PROP
  "Grass prop",

  //TORCH
  "Torch",

  //Dead bush
  "Dead bush",

  //Snowy leaves
  "Snowy leaves",

  //Amethyst,
  "Amethyst",

  //MAX
  "Max"
];

/**
 * Returns true if the block is water.
 *
 * @param blockType - block to test
 */
export function isBlockWater(blockType: BlockType): boolean {
  return blockMaterialData[blockType].materialType === 2;
}

/**
 * Returns true if the block is fully opaque.
 *
 * @param blockType - block to test
 */
export function isBlockOpaque(blockType: BlockType): boolean {
  return blockMaterialData[blockType].materialType === 0;
}

/**
 * Returns true if the block is semi-transparent or a prop (rendered in the alpha pass).
 *
 * @param blockType - block to test
 */
export function isBlockSemiTransparent(blockType: BlockType): boolean {
  return blockMaterialData[blockType].materialType === 1 || blockMaterialData[blockType].materialType === 3;
}

/**
 * Returns true if the block collides with entities.
 *
 * @param blockType - block to test
 */
export function isBlockCollidable(blockType: BlockType): boolean {
  return blockMaterialData[blockType].collidable === 1;
}

/**
 * Returns true if the block emits light.
 *
 * @param blockType - block to test
 */
export function isBlockEmittingLight(blockType: BlockType): boolean {
  return blockMaterialData[blockType].emitsLight === 1;
}

/**
 * Returns true if the block is a prop (billboard, non-collidable foliage, etc.).
 *
 * @param blockType - block to test
 */
export function isBlockProp(blockType: BlockType): boolean {
  return blockMaterialData[blockType].materialType === 3;
}

/**
 * Returns the display name for the block.
 *
 * @param blockType - block to query
 */
export function getBlockName(blockType: BlockType): String {
    return blockTypeName[blockType];
}

/**
 * Writes the block's local-space AABB into `dest[0]` (min) and `dest[1]` (max).
 *
 * Props use a smaller bounding box than full cubes.
 *
 * @param blockType - block to query
 * @param dest - two-element array of Vec3 to populate (min, max)
 */
export function getBlockTypeAABB(blockType: BlockType, dest: Vec3[]) {
  let width = 1;
  let height = 1;
  let length = 1;

  if (isBlockProp(blockType)) {
    if (blockType === BlockType.DEAD_BUSH || blockType === BlockType.GRASS_PROP) {
      width = 0.5;
      height = 0.8;
      length = 0.5;
    } else {
      width = 0.5;
      height = 0.5;
      length = 0.5;
    }
  }
  dest[0].x = -(0.5 * width);
  dest[0].y = -(0.5 * height);
  dest[0].z = -(0.5) * length;

  dest[1].x = width - (width * 0.5);
  dest[1].y = height - (height * 0.5);
  dest[1].z = length - (length * 0.5);
}

/**
 * Returns the light parameters for the block, or the first entry as a fallback.
 *
 * @param block_type - block to query
 * @returns the matching `BlockLightData`, or `blockLightData[0]` if none
 */
export function getBlockLightingData(block_type: BlockType): BlockLightData {
  for (const bld of blockLightData) {
    if (bld.blockType === block_type) {
      return bld;
    }
  }
  return blockLightData[0];
}

/**
 * Builds and uploads the per-block-type uniform buffer used by chunk shaders.
 *
 * Each entry packs the six face atlas indices and a prop flag.
 *
 * @param device - WebGPU device used to allocate the buffer
 */
export function generateBlockInfoUniformBuffer(device: GPUDevice) {
  const elementSize = 28; // { float[6], float }
  const bufferSize = elementSize * BlockType.MAX;
  
  let offset = 0;
  const data = new Float32Array(bufferSize / 4);
  for (let i = 0; i < BlockType.MAX; i++, offset += elementSize) {
    const textureData = blockTextureOffsetData[i];
    
    data[offset + 0] = (BLOCK_ATLAS_WIDTH_DIVIDED * textureData.sideFace.y) + textureData.sideFace.x;
		data[offset + 1] = (BLOCK_ATLAS_WIDTH_DIVIDED * textureData.sideFace.y) + textureData.sideFace.x;
		data[offset + 2] = (BLOCK_ATLAS_WIDTH_DIVIDED * textureData.sideFace.y) + textureData.sideFace.x;
		data[offset + 3] = (BLOCK_ATLAS_WIDTH_DIVIDED * textureData.sideFace.y) + textureData.sideFace.x;
		data[offset + 4] = (BLOCK_ATLAS_WIDTH_DIVIDED * textureData.bottomFace.y) + textureData.bottomFace.x;
		data[offset + 5] = (BLOCK_ATLAS_WIDTH_DIVIDED * textureData.topFace.y) + textureData.topFace.x;
    data[offset + 6] = (isBlockProp(i)) ? 0.5 : 0.0;
  }
  
  const buffer = device.createBuffer({
    size: bufferSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true
  });

  new Float32Array(buffer.getMappedRange()).set(data);

  buffer.unmap();
}
