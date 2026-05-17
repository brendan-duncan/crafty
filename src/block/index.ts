/** Public surface of the voxel block, chunk, biome, and world generation system. */
export { BiomeType, EnvironmentEffect, getBiomeEnvironmentEffect, getBiomeCloudCoverage, getBiomeCloudBounds } from './biome_type.js';
export {
  BASE_RESOLUTION_WIDTH,
  BASE_RESOLUTION_HEIGHT,
  BLOCK_ATLAS_WIDTH,
  BLOCK_ATLAS_HEIGHT,
  BLOCK_ATLAS_TEX_SIZE,
  BLOCK_ATLAS_WIDTH_DIVIDED,
  BLOCK_ATLAS_HEIGHT_DIVIDED,
  BlockType,
  BlockTextureOffsetData,
  blockTextureOffsetData,
  BlockMaterialData,
  blockMaterialData,
  BlockLightData,
  blockLightData,
  blockTypeName,
  isBlockWater,
  isBlockOpaque,
  isBlockSemiTransparent,
  isBlockCollidable,
  isBlockEmittingLight,
  isBlockProp,
  getBlockName,
  getBlockTypeAABB,
  getBlockLightingData,
  generateBlockInfoUniformBuffer,
} from './block_type.js';
export { Chunk } from './chunk.js';
export type { ChunkMesh } from './chunk.js';
export { BlockWorld } from './world.js';
export type { RaycastResult } from './world.js';
