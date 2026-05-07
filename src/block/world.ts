import { Vec3 } from '../math/index.js';
import { Chunk, ChunkMesh, ChunkNeighbors } from './chunk.js';
import { BlockType, isBlockWater, isBlockProp } from './block_type.js';
import { BiomeType } from './biome_type.js';
import { buildErosionRegion, EROSION_REGION_SIZE } from './erosion.js';

/**
 * Result of a successful voxel raycast.
 */
export interface RaycastResult {
  /** Hit block type. */
  blockType: number;
  /** World-space integer block position that was hit. */
  position: Vec3;
  /** Outward normal of the hit face (one component is +/-1, others are 0). */
  face: Vec3;
  /** Chunk containing the hit block. */
  chunk: Chunk;
  /** Hit position relative to the chunk's local origin. */
  relativePosition: Vec3;
}

/**
 * Streaming voxel world built from `Chunk`s keyed by integer chunk coordinates.
 *
 * Chunks are stored in a `Map<string, Chunk>` keyed by `"cx,cy,cz"`, where chunk
 * coordinates are world coords floor-divided by chunk dimensions. `update()`
 * generates chunks within `renderDistanceH`/`renderDistanceV` of the player and
 * removes ones outside that radius. New chunks are created at most
 * `chunksPerFrame` per call, sorted by distance to the player. Generation uses
 * a cached 128x128 hydraulic erosion displacement field per region.
 */
export class World {
  /** Hard cap on the number of resident chunks. */
  static readonly MAX_CHUNKS = 2048;

  seed: number;
  renderDistanceH = 8;
  renderDistanceV = 4;
  chunksPerFrame   = 2;
  time = 0;
  waterSimulationRadius = 32; // blocks
  waterTickInterval = 0.25; // seconds between water updates (slower = more realistic)
  private _waterTickTimer = 0;

  onChunkAdded?: (chunk: Chunk, mesh: ChunkMesh) => void;
  onChunkUpdated?: (chunk: Chunk, mesh: ChunkMesh) => void;
  onChunkRemoved?: (chunk: Chunk) => void;

  private _chunks    = new Map<string, Chunk>();
  private _generated = new Set<string>();
  private _erosionCache = new Map<string, Float32Array>();

  /**
   * Creates an empty world with the given generation seed.
   *
   * @param seed - master seed for terrain, biome, and erosion noise
   */
  constructor(seed: number) {
    this.seed = seed;
  }

  /** Number of chunks currently resident in memory. */
  get chunkCount(): number { return this._chunks.size; }
  /** Iterator over all resident chunks. */
  get chunks(): IterableIterator<Chunk> { return this._chunks.values(); }

  pendingChunks = 0;

  /**
   * Returns the biome at a world-space block position (does not require the chunk to exist).
   *
   * @param wx - world X
   * @param wy - world Y
   * @param wz - world Z
   */
  getBiomeAt(wx: number, wy: number, wz: number): BiomeType {
    return Chunk._determineBiome(wx, wy, wz, this.seed);
  }

  /**
   * Converts a world-space block position to integer chunk coordinates.
   *
   * @param wx - world X
   * @param wy - world Y
   * @param wz - world Z
   * @returns `[cx, cy, cz]` chunk coordinates
   */
  static normalizeChunkPosition(wx: number, wy: number, wz: number): [number, number, number] {
    return [
      Math.floor(wx / Chunk.CHUNK_WIDTH),
      Math.floor(wy / Chunk.CHUNK_HEIGHT),
      Math.floor(wz / Chunk.CHUNK_DEPTH),
    ];
  }

  private static _key(cx: number, cy: number, cz: number): string {
    return `${cx},${cy},${cz}`;
  }

  /**
   * Returns the chunk containing the given world-space block position, or `undefined` if not loaded.
   *
   * @param wx - world X
   * @param wy - world Y
   * @param wz - world Z
   */
  getChunk(wx: number, wy: number, wz: number): Chunk | undefined {
    const [cx, cy, cz] = World.normalizeChunkPosition(wx, wy, wz);
    return this._chunks.get(World._key(cx, cy, cz));
  }

  /**
   * Returns true if a chunk exists at the given world-space block position.
   *
   * @param wx - world X
   * @param wy - world Y
   * @param wz - world Z
   */
  chunkExists(wx: number, wy: number, wz: number): boolean {
    return this.getChunk(wx, wy, wz) !== undefined;
  }

  /**
   * Returns the block type at a world-space position, or `BlockType.NONE` if the chunk is not loaded.
   *
   * @param wx - world X
   * @param wy - world Y
   * @param wz - world Z
   */
  getBlockType(wx: number, wy: number, wz: number): number {
    const chunk = this.getChunk(wx, wy, wz);
    if (!chunk) {
      return BlockType.NONE;
    }
    const rx = Math.round(wx) - chunk.globalPosition.x;
    const ry = Math.round(wy) - chunk.globalPosition.y;
    const rz = Math.round(wz) - chunk.globalPosition.z;
    return chunk.getBlock(rx, ry, rz);
  }

  /**
   * Sets the block at a world-space position, creating the chunk if needed and re-meshing it.
   *
   * @param wx - world X
   * @param wy - world Y
   * @param wz - world Z
   * @param blockType - new block type
   * @returns true on success
   */
  setBlockType(wx: number, wy: number, wz: number, blockType: BlockType): boolean {
    let chunk = this.getChunk(wx, wy, wz);
    if (!chunk) {
      // Create chunk if it doesn't exist
      const [cx, cy, cz] = World.normalizeChunkPosition(wx, wy, wz);
      chunk = new Chunk(cx * Chunk.CHUNK_WIDTH, cy * Chunk.CHUNK_HEIGHT, cz * Chunk.CHUNK_DEPTH);
      this._insertChunk(chunk);
    }
    const rx = Math.round(wx) - chunk.globalPosition.x;
    const ry = Math.round(wy) - chunk.globalPosition.y;
    const rz = Math.round(wz) - chunk.globalPosition.z;
    chunk.setBlock(rx, ry, rz, blockType);
    this._updateChunk(chunk, rx, ry, rz);
    return true;
  }

  /**
   * Returns the Y of the first air block above the highest solid/water block in column `(wx, wz)`.
   *
   * Scans downward from `maxY`. Returns 0 if the column is empty.
   *
   * @param wx - world X
   * @param wz - world Z
   * @param maxY - upper bound to start scanning from
   */
  getTopBlockY(wx: number, wz: number, maxY: number): number {
    const H = Chunk.CHUNK_HEIGHT;
    const bx = Math.floor(wx);
    const bz = Math.floor(wz);
    for (let cy = Math.floor(maxY / H); cy >= 0; cy--) {
      const chunk = this.getChunk(bx, cy * H, bz);
      if (!chunk) {
        continue;
      }
      const rx = bx - chunk.globalPosition.x;
      const rz = bz - chunk.globalPosition.z;
      for (let ry = H - 1; ry >= 0; ry--) {
        const bt = chunk.getBlock(rx, ry, rz);
        if (bt !== BlockType.NONE && !isBlockProp(bt)) {
          return chunk.globalPosition.y + ry + 1;
        }
      }
    }
    return 0;
  }

  /**
   * Casts a ray through the voxel grid and returns the first non-water block hit.
   *
   * Implements the Amanatides & Woo "Fast Voxel Traversal Algorithm for Ray Tracing".
   * Water blocks are skipped (the ray passes through them).
   *
   * @param from - ray origin in world space
   * @param dir - ray direction (need not be normalized)
   * @param maxSteps - maximum number of voxel steps before giving up
   * @returns hit description, or `null` if no block was hit
   */
  getBlockByRay(from: Vec3, dir: Vec3, maxSteps: number): RaycastResult | null {
    const BIG = Number.MAX_VALUE;
    let px = Math.floor(from.x);
    let py = Math.floor(from.y);
    let pz = Math.floor(from.z);

    const dxi = 1.0 / dir.x, dyi = 1.0 / dir.y, dzi = 1.0 / dir.z;
    const sx = dir.x > 0 ? 1 : -1;
    const sy = dir.y > 0 ? 1 : -1;
    const sz = dir.z > 0 ? 1 : -1;

    const dtx = Math.min(dxi * sx, BIG);
    const dty = Math.min(dyi * sy, BIG);
    const dtz = Math.min(dzi * sz, BIG);
    let tx = Math.abs((px + Math.max(sx, 0) - from.x) * dxi);
    let ty = Math.abs((py + Math.max(sy, 0) - from.y) * dyi);
    let tz = Math.abs((pz + Math.max(sz, 0) - from.z) * dzi);

    let cmpx = 0, cmpy = 0, cmpz = 0;

    for (let i = 0; i < maxSteps; i++) {
      if (i > 0) {
        const chunk = this.getChunk(px, py, pz);
        if (chunk) {
          const rx = px - chunk.globalPosition.x;
          const ry = py - chunk.globalPosition.y;
          const rz = pz - chunk.globalPosition.z;
          const blockType = chunk.getBlock(rx, ry, rz);
          // Skip water blocks - raycast passes through them
          if (blockType !== BlockType.NONE && !isBlockWater(blockType)) {
            return {
              blockType,
              position: new Vec3(px, py, pz),
              face: new Vec3(-cmpx * sx, -cmpy * sy, -cmpz * sz),
              chunk,
              relativePosition: new Vec3(rx, ry, rz),
            };
          }
        }
      }

      // step(a, b) = a <= b ? 1 : 0; advance the axis with the smallest t
      cmpx = (tx <= tz ? 1 : 0) * (tx <= ty ? 1 : 0);
      cmpy = (ty <= tx ? 1 : 0) * (ty <= tz ? 1 : 0);
      cmpz = (tz <= ty ? 1 : 0) * (tz <= tx ? 1 : 0);
      tx += dtx * cmpx;
      ty += dty * cmpy;
      tz += dtz * cmpz;
      px += sx * cmpx;
      py += sy * cmpy;
      pz += sz * cmpz;
    }

    return null;
  }

  /**
   * Places a block adjacent to the hit block on the given face.
   *
   * The new block goes at `(gX + faceX, gY + faceY, gZ + faceZ)`. Existing
   * non-air, non-water blocks block placement. Creates the target chunk if needed.
   *
   * @param gX - hit block world X
   * @param gY - hit block world Y
   * @param gZ - hit block world Z
   * @param faceX - face normal X
   * @param faceY - face normal Y
   * @param faceZ - face normal Z
   * @param blockType - block type to place
   * @returns true if a block was placed
   */
  addBlock(gX: number, gY: number, gZ: number, faceX: number, faceY: number, faceZ: number, blockType: number): boolean {
    if (blockType === BlockType.NONE) {
      return false;
    }

    const hitChunk = this.getChunk(gX, gY, gZ);
    if (!hitChunk) {
      return false;
    }

    const hitBlockType = this.getBlockType(gX, gY, gZ);
    if (isBlockProp(hitBlockType)) {
      return false;
    }

    const newX = gX + faceX;
    const newY = gY + faceY;
    const newZ = gZ + faceZ;

    const existing = this.getBlockType(newX, newY, newZ);

    // Allow placing water in water, or replacing air/water with any block
    if (isBlockWater(blockType)) {
      // Water can be placed in air or water
      if (existing !== BlockType.NONE && !isBlockWater(existing)) {
        return false;
      }
    } else {
      // Other blocks can replace air or water
      if (existing !== BlockType.NONE && !isBlockWater(existing)) {
        return false;
      }
    }

    let targetChunk = this.getChunk(newX, newY, newZ);
    if (!targetChunk) {
      const [cx, cy, cz] = World.normalizeChunkPosition(newX, newY, newZ);
      targetChunk = new Chunk(cx * Chunk.CHUNK_WIDTH, cy * Chunk.CHUNK_HEIGHT, cz * Chunk.CHUNK_DEPTH);
      this._insertChunk(targetChunk);
    }

    const rx = newX - targetChunk.globalPosition.x;
    const ry = newY - targetChunk.globalPosition.y;
    const rz = newZ - targetChunk.globalPosition.z;

    targetChunk.setBlock(rx, ry, rz, blockType);
    this._updateChunk(targetChunk, rx, ry, rz);
    return true;
  }

  /**
   * Removes the block at the given world position and re-meshes the affected chunk(s).
   *
   * @param gX - world X
   * @param gY - world Y
   * @param gZ - world Z
   * @returns true if a block was removed
   */
  mineBlock(gX: number, gY: number, gZ: number): boolean {
    const chunk = this.getChunk(gX, gY, gZ);
    if (!chunk) {
      return false;
    }

    const rx = gX - chunk.globalPosition.x;
    const ry = gY - chunk.globalPosition.y;
    const rz = gZ - chunk.globalPosition.z;

    const blockType = chunk.getBlock(rx, ry, rz);
    if (blockType === BlockType.NONE) {
      return false;
    }

    // Allow mining water blocks (just removes them)
    if (isBlockWater(blockType)) {
      chunk.setBlock(rx, ry, rz, BlockType.NONE);
      this._updateChunk(chunk, rx, ry, rz);
      return true;
    }

    chunk.setBlock(rx, ry, rz, BlockType.NONE);
    this._updateChunk(chunk, rx, ry, rz);
    return true;
  }

  /**
   * Advances world time, streams chunks around the player, and ticks water flow.
   *
   * @param playerPos - current player position
   * @param dt - elapsed time in seconds
   */
  update(playerPos: Vec3, dt: number): void {
    this.time += dt;
    this._removeDistantChunks(playerPos);
    this._createNearbyChunks(playerPos);

    // Water simulation
    this._waterTickTimer += dt;
    if (this._waterTickTimer >= this.waterTickInterval) {
      this._waterTickTimer = 0;
      this._updateWaterFlow(playerPos);
    }
  }

  /**
   * Removes a chunk from the world, marks it deleted, and notifies listeners.
   *
   * @param chunk - chunk to delete
   */
  deleteChunk(chunk: Chunk): void {
    const [cx, cy, cz] = World.normalizeChunkPosition(
      chunk.globalPosition.x, chunk.globalPosition.y, chunk.globalPosition.z,
    );
    const key = World._key(cx, cy, cz);
    this._chunks.delete(key);
    this._generated.delete(key);
    chunk.isDeleted = true;
    this.onChunkRemoved?.(chunk);
  }

  /**
   * Computes a discrete water depth value at the given world position.
   *
   * Walks upward through stacked chunks of water and accumulates a per-chunk
   * level contribution based on the height of the water column.
   *
   * @param wx - world X
   * @param wy - world Y
   * @param wz - world Z
   * @returns aggregate water level (0 if not in water)
   */
  calcWaterLevel(wx: number, wy: number, wz: number): number {
    const chunk = this.getChunk(wx, wy, wz);
    if (!chunk || chunk.waterBlocks <= 0) {
      return 0;
    }

    let level = this._calcWaterLevelInChunk(chunk, wy);

    for (let i = 1; i <= 4; i++) {
      const above = this.getChunk(wx, wy + i * Chunk.CHUNK_HEIGHT, wz);
      if (!above) {
        break;
      }
      const [nx, , nz] = World.normalizeChunkPosition(wx, wy, wz);
      const rx = nx * Chunk.CHUNK_WIDTH - above.globalPosition.x;
      const rz = nz * Chunk.CHUNK_DEPTH - above.globalPosition.z;
      if (above.waterBlocks > 0 && isBlockWater(above.getBlock(rx, 0, rz))) {
        level += this._calcWaterLevelInChunk(above, wy);
      } else {
        break;
      }
    }

    return level;
  }

  private _calcWaterLevelInChunk(chunk: Chunk, wy: number): number {
    const base = chunk.globalPosition.y;
    const H = Chunk.CHUNK_HEIGHT;
    let level = 0;
    if (wy <= base + H * 0.8) {
      level++;
    }
    if (wy <= base + H * 0.7) {
      level++;
    }
    if (wy <= base + H * 0.6) {
      level++;
    }
    if (wy <= base + H * 0.5) {
      level++;
    }
    return level;
  }

  private _getErosionRegion(rx: number, rz: number): Float32Array {
    const key = `${rx},${rz}`;
    let region = this._erosionCache.get(key);
    if (!region) {
      region = buildErosionRegion(rx, rz, this.seed);
      this._erosionCache.set(key, region);
    }
    return region;
  }

  /**
   * Returns the cached hydraulic-erosion displacement at world XZ.
   *
   * Looks up (and lazily generates) the 128x128 region containing `(gx, gz)`.
   *
   * @param gx - world X
   * @param gz - world Z
   */
  getErosionDisplacement(gx: number, gz: number): number {
    const R  = EROSION_REGION_SIZE;
    const rx = Math.floor(gx / R);
    const rz = Math.floor(gz / R);
    const lx = ((gx % R) + R) % R;
    const lz = ((gz % R) + R) % R;
    return this._getErosionRegion(rx, rz)[lx + lz * R];
  }

  private _insertChunk(chunk: Chunk): void {
    const [cx, cy, cz] = World.normalizeChunkPosition(
      chunk.globalPosition.x, chunk.globalPosition.y, chunk.globalPosition.z,
    );
    this._chunks.set(World._key(cx, cy, cz), chunk);
    chunk.isDeleted = false;
  }

  private _gatherNeighbors(cx: number, cy: number, cz: number): ChunkNeighbors {
    const get = (dx: number, dy: number, dz: number): Uint8Array | undefined =>
      this._chunks.get(World._key(cx + dx, cy + dy, cz + dz))?.blocks;
    return {
      negX: get(-1,  0,  0),
      posX: get( 1,  0,  0),
      negY: get( 0, -1,  0),
      posY: get( 0,  1,  0),
      negZ: get( 0,  0, -1),
      posZ: get( 0,  0,  1),
    };
  }

  private _remeshSingleNeighbor(cx: number, cy: number, cz: number): void {
    const neighbor = this._chunks.get(World._key(cx, cy, cz));
    if (neighbor) {
      this.onChunkUpdated?.(neighbor, neighbor.generateVertices(this._gatherNeighbors(cx, cy, cz)));
    }
  }

  private _updateChunk(chunk: Chunk, rx?: number, ry?: number, rz?: number): void {
    const [cx, cy, cz] = World.normalizeChunkPosition(
      chunk.globalPosition.x, chunk.globalPosition.y, chunk.globalPosition.z,
    );
    this.onChunkUpdated?.(chunk, chunk.generateVertices(this._gatherNeighbors(cx, cy, cz)));
    if (rx === undefined) {
      return;
    }
    const W = Chunk.CHUNK_WIDTH, H = Chunk.CHUNK_HEIGHT, D = Chunk.CHUNK_DEPTH;
    if (rx === 0) {
      this._remeshSingleNeighbor(cx - 1, cy, cz);
    }
    if (rx === W - 1) {
      this._remeshSingleNeighbor(cx + 1, cy, cz);
    }
    if (ry === 0) {
      this._remeshSingleNeighbor(cx, cy - 1, cz);
    }
    if (ry === H - 1) {
      this._remeshSingleNeighbor(cx, cy + 1, cz);
    }
    if (rz === 0) {
      this._remeshSingleNeighbor(cx, cy, cz - 1);
    }
    if (rz === D - 1) {
      this._remeshSingleNeighbor(cx, cy, cz + 1);
    }
  }

  private _createNearbyChunks(playerPos: Vec3): void {
    const [cpx, cpy, cpz] = World.normalizeChunkPosition(playerPos.x, playerPos.y, playerPos.z);
    const rdH = this.renderDistanceH;
    const rdV = this.renderDistanceV;

    // Collect all ungenerated positions within the cylinder, sorted by distance.
    const candidates: [number, number, number, number][] = []; // [dist2, cx, cy, cz]
    for (let dx = -rdH; dx <= rdH; dx++) {
      for (let dz = -rdH; dz <= rdH; dz++) {
        if (dx * dx + dz * dz > rdH * rdH) {
          continue;
        }
        for (let dy = -rdV; dy <= rdV; dy++) {
          const cx = cpx + dx, cy = cpy + dy, cz = cpz + dz;
          const key = World._key(cx, cy, cz);
          if (!this._generated.has(key)) {
            candidates.push([dx * dx + dy * dy + dz * dz, cx, cy, cz]);
          }
        }
      }
    }

    candidates.sort((a, b) => a[0] - b[0]);
    this.pendingChunks = candidates.length;
    if (this._chunks.size >= World.MAX_CHUNKS) {
      return;
    }
    let created = 0;
    for (const [, cx, cy, cz] of candidates) {
      if (created >= this.chunksPerFrame) {
        break;
      }
      if (this._chunks.size >= World.MAX_CHUNKS) {
        break;
      }
      this._createChunkAt(cx, cy, cz);
      created++;
    }
  }

  private _removeDistantChunks(playerPos: Vec3): void {
    const [cpx, cpy, cpz] = World.normalizeChunkPosition(playerPos.x, playerPos.y, playerPos.z);
    const rdH = this.renderDistanceH + 1;
    const rdV = this.renderDistanceV + 1;
    const toDelete: Chunk[] = [];
    for (const chunk of this._chunks.values()) {
      const [cx, cy, cz] = World.normalizeChunkPosition(
        chunk.globalPosition.x, chunk.globalPosition.y, chunk.globalPosition.z,
      );
      const dx = cx - cpx, dy = cy - cpy, dz = cz - cpz;
      if (dx * dx + dz * dz > rdH * rdH || Math.abs(dy) > rdV) {
        toDelete.push(chunk);
      }
    }
    for (const chunk of toDelete) {
      this.deleteChunk(chunk);
    }
  }

  private _createChunkAt(cx: number, cy: number, cz: number): void {
    const key = World._key(cx, cy, cz);
    this._generated.add(key);
    const chunk = new Chunk(
      cx * Chunk.CHUNK_WIDTH,
      cy * Chunk.CHUNK_HEIGHT,
      cz * Chunk.CHUNK_DEPTH,
    );
    chunk.generateBlocks(this.seed, (gx, gz) => this.getErosionDisplacement(gx, gz));
    if (chunk.aliveBlocks > 0) {
      this._insertChunk(chunk);
      this.onChunkAdded?.(chunk, chunk.generateVertices(this._gatherNeighbors(cx, cy, cz)));
      // Re-mesh existing neighbors so their edge faces are correctly culled against this chunk.
      for (const [dx, dy, dz] of [[-1,0,0],[1,0,0],[0,-1,0],[0,1,0],[0,0,-1],[0,0,1]] as const) {
        this._remeshSingleNeighbor(cx + dx, cy + dy, cz + dz);
      }
    }
  }

  private _updateWaterFlow(playerPos: Vec3): void {
    const radius = this.waterSimulationRadius;
    const minX = Math.floor(playerPos.x - radius);
    const maxX = Math.floor(playerPos.x + radius);
    const minY = Math.floor(Math.max(0, playerPos.y - radius));
    const maxY = Math.floor(playerPos.y + radius);
    const minZ = Math.floor(playerPos.z - radius);
    const maxZ = Math.floor(playerPos.z + radius);

    // Collect water blocks that need to flow
    const waterBlocks: Array<{ x: number; y: number; z: number }> = [];

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let z = minZ; z <= maxZ; z++) {
          const blockType = this.getBlockType(x, y, z);
          if (isBlockWater(blockType)) {
            waterBlocks.push({ x, y, z });
          }
        }
      }
    }

    // Process water flow for each water block
    for (const { x, y, z } of waterBlocks) {
      this._flowWater(x, y, z);
    }
  }

  private _flowWater(wx: number, wy: number, wz: number): void {
    // Check if water can flow down (can replace air or props)
    const below = this.getBlockType(wx, wy - 1, wz);
    if (below === BlockType.NONE || isBlockProp(below)) {
      // Water flows down - move the water block
      this.setBlockType(wx, wy - 1, wz, BlockType.WATER);
      this.setBlockType(wx, wy, wz, BlockType.NONE);
      return;
    }

    // Check if this water has support (something solid below it, within 4 blocks)
    let hasSupport = false;
    for (let dy = 1; dy <= 4; dy++) {
      const checkBelow = this.getBlockType(wx, wy - dy, wz);
      if (checkBelow !== BlockType.NONE && !isBlockWater(checkBelow) && !isBlockProp(checkBelow)) {
        hasSupport = true;
        break;
      }
      if (checkBelow === BlockType.NONE || isBlockProp(checkBelow)) {
        // Found air or prop, no support
        break;
      }
    }

    // If no support (floating water), spread horizontally 1 block (fountain effect)
    if (!hasSupport) {
      const horizontal = [
        { x: wx + 1, y: wy, z: wz },
        { x: wx - 1, y: wy, z: wz },
        { x: wx, y: wy, z: wz + 1 },
        { x: wx, y: wy, z: wz - 1 },
      ];

      for (const pos of horizontal) {
        const block = this.getBlockType(pos.x, pos.y, pos.z);
        // Allow water to spread 1 block horizontally into empty space, even without support
        if (block === BlockType.NONE || isBlockProp(block)) {
          this.setBlockType(pos.x, pos.y, pos.z, BlockType.WATER);
          this.setBlockType(wx, wy, wz, BlockType.NONE);
          return;
        }
      }
    }

    // If has support, try to spread horizontally (can spill over edges)
    if (hasSupport) {
      const horizontal = [
        { x: wx + 1, y: wy, z: wz },
        { x: wx - 1, y: wy, z: wz },
        { x: wx, y: wy, z: wz + 1 },
        { x: wx, y: wy, z: wz - 1 },
      ];

      for (const pos of horizontal) {
        const block = this.getBlockType(pos.x, pos.y, pos.z);
        if (block === BlockType.NONE || isBlockProp(block)) {
          // Spread to any adjacent empty space (will flow down naturally in next tick)
          this.setBlockType(pos.x, pos.y, pos.z, BlockType.WATER);
          // Only spread to one direction per tick to avoid flooding too fast
          return;
        }
      }
    }
  }
}
