import { Vec3 } from '../math/index.js';
import { Chunk, ChunkMesh, ChunkNeighbors } from './chunk.js';
import { BlockType, isBlockWater, isBlockProp } from './block_type.js';
import { BiomeType } from './biome_type.js';

export interface RaycastResult {
  blockType: number;
  position: Vec3;
  face: Vec3;
  chunk: Chunk;
  relativePosition: Vec3;
}

export class World {
  static readonly MAX_CHUNKS = 1024;

  seed: number;
  renderDistanceH = 8;
  renderDistanceV = 4;
  chunksPerFrame   = 2;
  time = 0;

  onChunkAdded?: (chunk: Chunk, mesh: ChunkMesh) => void;
  onChunkUpdated?: (chunk: Chunk, mesh: ChunkMesh) => void;
  onChunkRemoved?: (chunk: Chunk) => void;

  private _chunks    = new Map<string, Chunk>();
  private _generated = new Set<string>();

  constructor(seed: number) {
    this.seed = seed;
  }

  get chunkCount(): number { return this._chunks.size; }
  get chunks(): IterableIterator<Chunk> { return this._chunks.values(); }

  pendingChunks = 0;

  getBiomeAt(wx: number, wz: number): BiomeType {
    return Chunk._determineBiome(wx, wz, this.seed);
  }

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

  getChunk(wx: number, wy: number, wz: number): Chunk | undefined {
    const [cx, cy, cz] = World.normalizeChunkPosition(wx, wy, wz);
    return this._chunks.get(World._key(cx, cy, cz));
  }

  chunkExists(wx: number, wy: number, wz: number): boolean {
    return this.getChunk(wx, wy, wz) !== undefined;
  }

  getBlockType(wx: number, wy: number, wz: number): number {
    const chunk = this.getChunk(wx, wy, wz);
    if (!chunk) return BlockType.NONE;
    const rx = Math.round(wx) - chunk.globalPosition.x;
    const ry = Math.round(wy) - chunk.globalPosition.y;
    const rz = Math.round(wz) - chunk.globalPosition.z;
    return chunk.getBlock(rx, ry, rz);
  }

  // Returns the Y coordinate of the first air block above the highest solid/water block
  // in column (wx, wz), scanning down from maxY. Returns 0 if column is empty.
  getTopBlockY(wx: number, wz: number, maxY: number): number {
    const H = Chunk.CHUNK_HEIGHT;
    const bx = Math.floor(wx);
    const bz = Math.floor(wz);
    for (let cy = Math.floor(maxY / H); cy >= 0; cy--) {
      const chunk = this.getChunk(bx, cy * H, bz);
      if (!chunk) continue;
      const rx = bx - chunk.globalPosition.x;
      const rz = bz - chunk.globalPosition.z;
      for (let ry = H - 1; ry >= 0; ry--) {
        const bt = chunk.getBlock(rx, ry, rz);
        if (bt !== BlockType.NONE && !isBlockProp(bt)) return chunk.globalPosition.y + ry + 1;
      }
    }
    return 0;
  }

  // "A Fast Voxel Traversal Algorithm for Ray Tracing" — Amanatides & Woo
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

  addBlock(gX: number, gY: number, gZ: number, faceX: number, faceY: number, faceZ: number, blockType: number): boolean {
    if (blockType === BlockType.NONE) return false;

    const hitChunk = this.getChunk(gX, gY, gZ);
    if (!hitChunk) return false;

    if (isBlockProp(this.getBlockType(gX, gY, gZ))) return false;

    const newX = gX + faceX;
    const newY = gY + faceY;
    const newZ = gZ + faceZ;

    const existing = this.getBlockType(newX, newY, newZ);
    if (existing !== BlockType.NONE && !isBlockWater(existing)) return false;

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

  mineBlock(gX: number, gY: number, gZ: number): boolean {
    const chunk = this.getChunk(gX, gY, gZ);
    if (!chunk) return false;

    const rx = gX - chunk.globalPosition.x;
    const ry = gY - chunk.globalPosition.y;
    const rz = gZ - chunk.globalPosition.z;

    const blockType = chunk.getBlock(rx, ry, rz);
    if (blockType === BlockType.NONE || isBlockWater(blockType)) return false;

    chunk.setBlock(rx, ry, rz, BlockType.NONE);
    this._updateChunk(chunk, rx, ry, rz);
    return true;
  }

  update(playerPos: Vec3, dt: number): void {
    this.time += dt;
    this._removeDistantChunks(playerPos);
    this._createNearbyChunks(playerPos);
  }

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

  calcWaterLevel(wx: number, wy: number, wz: number): number {
    const chunk = this.getChunk(wx, wy, wz);
    if (!chunk || chunk.waterBlocks <= 0) return 0;

    let level = this._calcWaterLevelInChunk(chunk, wy);

    for (let i = 1; i <= 4; i++) {
      const above = this.getChunk(wx, wy + i * Chunk.CHUNK_HEIGHT, wz);
      if (!above) break;
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
    if (wy <= base + H * 0.8) level++;
    if (wy <= base + H * 0.7) level++;
    if (wy <= base + H * 0.6) level++;
    if (wy <= base + H * 0.5) level++;
    return level;
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
    if (rx === undefined) return;
    const W = Chunk.CHUNK_WIDTH, H = Chunk.CHUNK_HEIGHT, D = Chunk.CHUNK_DEPTH;
    if (rx === 0)     this._remeshSingleNeighbor(cx - 1, cy, cz);
    if (rx === W - 1) this._remeshSingleNeighbor(cx + 1, cy, cz);
    if (ry === 0)     this._remeshSingleNeighbor(cx, cy - 1, cz);
    if (ry === H - 1) this._remeshSingleNeighbor(cx, cy + 1, cz);
    if (rz === 0)     this._remeshSingleNeighbor(cx, cy, cz - 1);
    if (rz === D - 1) this._remeshSingleNeighbor(cx, cy, cz + 1);
  }

  private _createNearbyChunks(playerPos: Vec3): void {
    if (this._chunks.size >= World.MAX_CHUNKS) return;
    const [cpx, cpy, cpz] = World.normalizeChunkPosition(playerPos.x, playerPos.y, playerPos.z);
    const rdH = this.renderDistanceH;
    const rdV = this.renderDistanceV;

    // Collect all ungenerated positions within the cylinder, sorted by distance.
    const candidates: [number, number, number, number][] = []; // [dist2, cx, cy, cz]
    for (let dx = -rdH; dx <= rdH; dx++) {
      for (let dz = -rdH; dz <= rdH; dz++) {
        if (dx * dx + dz * dz > rdH * rdH) continue;
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
    let created = 0;
    for (const [, cx, cy, cz] of candidates) {
      if (created >= this.chunksPerFrame) break;
      if (this._chunks.size >= World.MAX_CHUNKS) break;
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
    for (const chunk of toDelete) this.deleteChunk(chunk);
  }

  private _createChunkAt(cx: number, cy: number, cz: number): void {
    const key = World._key(cx, cy, cz);
    this._generated.add(key);
    const chunk = new Chunk(
      cx * Chunk.CHUNK_WIDTH,
      cy * Chunk.CHUNK_HEIGHT,
      cz * Chunk.CHUNK_DEPTH,
    );
    chunk.generateBlocks(this.seed);
    if (chunk.aliveBlocks > 0) {
      this._insertChunk(chunk);
      this.onChunkAdded?.(chunk, chunk.generateVertices(this._gatherNeighbors(cx, cy, cz)));
      // Re-mesh existing neighbors so their edge faces are correctly culled against this chunk.
      for (const [dx, dy, dz] of [[-1,0,0],[1,0,0],[0,-1,0],[0,1,0],[0,0,-1],[0,0,1]] as const) {
        this._remeshSingleNeighbor(cx + dx, cy + dy, cz + dz);
      }
    }
  }
}
