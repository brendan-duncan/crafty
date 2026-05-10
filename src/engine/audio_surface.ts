import { BlockType } from '../block/block_type.js';

/**
 * Audio surface group name used to look up footstep and dig sounds.
 * Maps to subdirectories under `assets/sounds/player/{step,dig}/`.
 */
export type SurfaceGroup = 'grass' | 'sand' | 'stone' | 'wood';

/**
 * Maps a {@link BlockType} to the surface group used for footstep/dig sounds.
 * Defaults to `'stone'` for hard unclassified blocks.
 */
export function blockTypeToSurface(bt: BlockType): SurfaceGroup {
  switch (bt) {
    case BlockType.GRASS:
    case BlockType.DIRT:
    case BlockType.TREELEAVES:
    case BlockType.SNOW:
    case BlockType.GRASS_SNOW:
    case BlockType.GRASS_PROP:
    case BlockType.SNOWYLEAVES:
      return 'grass';
    case BlockType.SAND:
      return 'sand';
    case BlockType.TRUNK:
    case BlockType.SPRUCE_PLANKS:
      return 'wood';
    default:
      return 'stone';
  }
}
