import { Vec3 } from '../math/index.js';
import { Chunk } from './chunk.js';
import { BlockType, isBlockWater, isBlockProp } from './block_type.js';
import { buildErosionRegion, EROSION_REGION_SIZE } from './erosion.js';
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
    static MAX_CHUNKS = 2048;
    seed;
    renderDistanceH = 8;
    renderDistanceV = 4;
    chunksPerFrame = 2;
    time = 0;
    waterSimulationRadius = 32; // blocks
    waterTickInterval = 0.25; // seconds between water updates (slower = more realistic)
    _waterTickTimer = 0;
    /** When set, `_updateChunk` defers the re-mesh by adding chunks here instead of re-generating immediately. */
    _dirtyChunks = null;
    onChunkAdded;
    onChunkUpdated;
    onChunkRemoved;
    _chunks = new Map();
    _generated = new Set();
    _erosionCache = new Map();
    /**
     * Creates an empty world with the given generation seed.
     *
     * @param seed - master seed for terrain, biome, and erosion noise
     */
    constructor(seed) {
        this.seed = seed;
    }
    /** Number of chunks currently resident in memory. */
    get chunkCount() { return this._chunks.size; }
    /** Iterator over all resident chunks. */
    get chunks() { return this._chunks.values(); }
    pendingChunks = 0;
    /**
     * Returns the biome at a world-space block position (does not require the chunk to exist).
     *
     * @param wx - world X
     * @param wy - world Y
     * @param wz - world Z
     */
    getBiomeAt(wx, wy, wz) {
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
    static normalizeChunkPosition(wx, wy, wz) {
        return [
            Math.floor(wx / Chunk.CHUNK_WIDTH),
            Math.floor(wy / Chunk.CHUNK_HEIGHT),
            Math.floor(wz / Chunk.CHUNK_DEPTH),
        ];
    }
    // Single-axis variants used by hot paths to avoid the per-call tuple
    // allocation that `normalizeChunkPosition` would force.
    static _cx(wx) { return Math.floor(wx / Chunk.CHUNK_WIDTH); }
    static _cy(wy) { return Math.floor(wy / Chunk.CHUNK_HEIGHT); }
    static _cz(wz) { return Math.floor(wz / Chunk.CHUNK_DEPTH); }
    // Bit-packs three signed 16-bit chunk coords into a single number key for
    // `_chunks` / `_generated`. Avoids the template-literal allocation that
    // string keys would force on every Map.get / Map.has — a major GC source.
    // Range: cx, cy, cz ∈ [-32768, 32767]; total fits in 48 bits.
    static _key(cx, cy, cz) {
        return ((cx + 32768) * 0x100000000) + ((cy + 32768) * 0x10000) + (cz + 32768);
    }
    /**
     * Returns the chunk containing the given world-space block position, or `undefined` if not loaded.
     *
     * @param wx - world X
     * @param wy - world Y
     * @param wz - world Z
     */
    getChunk(wx, wy, wz) {
        return this._chunks.get(World._key(World._cx(wx), World._cy(wy), World._cz(wz)));
    }
    /**
     * Returns true if a chunk exists at the given world-space block position.
     *
     * @param wx - world X
     * @param wy - world Y
     * @param wz - world Z
     */
    chunkExists(wx, wy, wz) {
        return this.getChunk(wx, wy, wz) !== undefined;
    }
    /**
     * Returns the block type at a world-space position, or `BlockType.NONE` if the chunk is not loaded.
     *
     * @param wx - world X
     * @param wy - world Y
     * @param wz - world Z
     */
    getBlockType(wx, wy, wz) {
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
    setBlockType(wx, wy, wz, blockType) {
        let chunk = this.getChunk(wx, wy, wz);
        if (!chunk) {
            // Create chunk if it doesn't exist
            const cx = World._cx(wx), cy = World._cy(wy), cz = World._cz(wz);
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
    getTopBlockY(wx, wz, maxY) {
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
    getBlockByRay(from, dir, maxSteps) {
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
    addBlock(gX, gY, gZ, faceX, faceY, faceZ, blockType) {
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
        }
        else {
            // Other blocks can replace air or water
            if (existing !== BlockType.NONE && !isBlockWater(existing)) {
                return false;
            }
        }
        let targetChunk = this.getChunk(newX, newY, newZ);
        if (!targetChunk) {
            const cx = World._cx(newX), cy = World._cy(newY), cz = World._cz(newZ);
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
    mineBlock(gX, gY, gZ) {
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
    update(playerPos, dt) {
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
    deleteChunk(chunk) {
        const cx = World._cx(chunk.globalPosition.x);
        const cy = World._cy(chunk.globalPosition.y);
        const cz = World._cz(chunk.globalPosition.z);
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
    calcWaterLevel(wx, wy, wz) {
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
            const nx = World._cx(wx), nz = World._cz(wz);
            const rx = nx * Chunk.CHUNK_WIDTH - above.globalPosition.x;
            const rz = nz * Chunk.CHUNK_DEPTH - above.globalPosition.z;
            if (above.waterBlocks > 0 && isBlockWater(above.getBlock(rx, 0, rz))) {
                level += this._calcWaterLevelInChunk(above, wy);
            }
            else {
                break;
            }
        }
        return level;
    }
    _calcWaterLevelInChunk(chunk, wy) {
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
    _getErosionRegion(rx, rz) {
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
    getErosionDisplacement(gx, gz) {
        const R = EROSION_REGION_SIZE;
        const rx = Math.floor(gx / R);
        const rz = Math.floor(gz / R);
        const lx = ((gx % R) + R) % R;
        const lz = ((gz % R) + R) % R;
        return this._getErosionRegion(rx, rz)[lx + lz * R];
    }
    _insertChunk(chunk) {
        const cx = World._cx(chunk.globalPosition.x);
        const cy = World._cy(chunk.globalPosition.y);
        const cz = World._cz(chunk.globalPosition.z);
        this._chunks.set(World._key(cx, cy, cz), chunk);
        chunk.isDeleted = false;
    }
    // Reused across all _gatherNeighbors calls — `generateVertices` only reads
    // these fields synchronously, so a single shared object is safe and avoids
    // an object-literal + closure allocation on every chunk re-mesh.
    _neighborScratch = {
        negX: undefined, posX: undefined,
        negY: undefined, posY: undefined,
        negZ: undefined, posZ: undefined,
    };
    _gatherNeighbors(cx, cy, cz) {
        const n = this._neighborScratch;
        n.negX = this._chunks.get(World._key(cx - 1, cy, cz))?.blocks;
        n.posX = this._chunks.get(World._key(cx + 1, cy, cz))?.blocks;
        n.negY = this._chunks.get(World._key(cx, cy - 1, cz))?.blocks;
        n.posY = this._chunks.get(World._key(cx, cy + 1, cz))?.blocks;
        n.negZ = this._chunks.get(World._key(cx, cy, cz - 1))?.blocks;
        n.posZ = this._chunks.get(World._key(cx, cy, cz + 1))?.blocks;
        return n;
    }
    _remeshSingleNeighbor(cx, cy, cz) {
        const neighbor = this._chunks.get(World._key(cx, cy, cz));
        if (neighbor) {
            this.onChunkUpdated?.(neighbor, neighbor.generateVertices(this._gatherNeighbors(cx, cy, cz)));
        }
    }
    _updateChunk(chunk, rx, ry, rz) {
        const cx = World._cx(chunk.globalPosition.x);
        const cy = World._cy(chunk.globalPosition.y);
        const cz = World._cz(chunk.globalPosition.z);
        // Batching mode: defer the (expensive) re-mesh; collect chunks instead.
        if (this._dirtyChunks) {
            this._dirtyChunks.add(chunk);
            if (rx === undefined) {
                return;
            }
            const W = Chunk.CHUNK_WIDTH, H = Chunk.CHUNK_HEIGHT, D = Chunk.CHUNK_DEPTH;
            const addNeighbor = (ncx, ncy, ncz) => {
                const n = this._chunks.get(World._key(ncx, ncy, ncz));
                if (n) {
                    this._dirtyChunks.add(n);
                }
            };
            if (rx === 0) {
                addNeighbor(cx - 1, cy, cz);
            }
            if (rx === W - 1) {
                addNeighbor(cx + 1, cy, cz);
            }
            if (ry === 0) {
                addNeighbor(cx, cy - 1, cz);
            }
            if (ry === H - 1) {
                addNeighbor(cx, cy + 1, cz);
            }
            if (rz === 0) {
                addNeighbor(cx, cy, cz - 1);
            }
            if (rz === D - 1) {
                addNeighbor(cx, cy, cz + 1);
            }
            return;
        }
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
    _createNearbyChunks(playerPos) {
        const cpx = World._cx(playerPos.x), cpy = World._cy(playerPos.y), cpz = World._cz(playerPos.z);
        const rdH = this.renderDistanceH;
        const rdV = this.renderDistanceV;
        const rdH2 = rdH * rdH;
        // Find the `chunksPerFrame` closest ungenerated positions via top-N
        // selection, no full sort and no per-candidate allocations. The previous
        // implementation built and sorted a list of ~2,600 entries on the first
        // call (4-element arrays + string keys per entry), which dominated GC.
        const N = Math.max(1, this.chunksPerFrame);
        if (!this._scratchTopD2 || this._scratchTopD2.length !== N) {
            this._scratchTopD2 = new Float64Array(N);
            this._scratchTopXYZ = new Int32Array(N * 3);
        }
        for (let i = 0; i < N; i++) {
            this._scratchTopD2[i] = Infinity;
        }
        let pending = 0;
        let worstIdx = 0;
        let worstD2 = Infinity;
        for (let dx = -rdH; dx <= rdH; dx++) {
            const dx2 = dx * dx;
            for (let dz = -rdH; dz <= rdH; dz++) {
                const dxz2 = dx2 + dz * dz;
                if (dxz2 > rdH2) {
                    continue;
                }
                for (let dy = -rdV; dy <= rdV; dy++) {
                    const cx = cpx + dx, cy = cpy + dy, cz = cpz + dz;
                    if (this._generated.has(World._key(cx, cy, cz))) {
                        continue;
                    }
                    pending++;
                    const d2 = dxz2 + dy * dy;
                    if (d2 >= worstD2) {
                        continue;
                    }
                    this._scratchTopD2[worstIdx] = d2;
                    this._scratchTopXYZ[worstIdx * 3] = cx;
                    this._scratchTopXYZ[worstIdx * 3 + 1] = cy;
                    this._scratchTopXYZ[worstIdx * 3 + 2] = cz;
                    // Find new worst slot for next replacement.
                    worstD2 = -Infinity;
                    for (let i = 0; i < N; i++) {
                        const v = this._scratchTopD2[i];
                        if (v > worstD2) {
                            worstD2 = v;
                            worstIdx = i;
                        }
                    }
                }
            }
        }
        this.pendingChunks = pending;
        if (this._chunks.size >= World.MAX_CHUNKS) {
            return;
        }
        // Create the selected chunks, nearest first. With small N (default 2)
        // an insertion sort over the slots is trivially cheap.
        for (let pass = 0; pass < N; pass++) {
            let bestIdx = -1;
            let bestD2 = Infinity;
            for (let i = 0; i < N; i++) {
                const v = this._scratchTopD2[i];
                if (v < bestD2) {
                    bestD2 = v;
                    bestIdx = i;
                }
            }
            if (bestIdx < 0 || bestD2 === Infinity) {
                break;
            }
            if (this._chunks.size >= World.MAX_CHUNKS) {
                break;
            }
            const cx = this._scratchTopXYZ[bestIdx * 3];
            const cy = this._scratchTopXYZ[bestIdx * 3 + 1];
            const cz = this._scratchTopXYZ[bestIdx * 3 + 2];
            this._scratchTopD2[bestIdx] = Infinity;
            this._createChunkAt(cx, cy, cz);
        }
    }
    _scratchTopD2 = null;
    _scratchTopXYZ = null;
    // Reused per-tick scratch buffers — avoid re-allocating each frame/tick.
    _scratchToDelete = [];
    _scratchWaterBlocks = [];
    _scratchDirtyChunks = new Set();
    _removeDistantChunks(playerPos) {
        const cpx = World._cx(playerPos.x), cpy = World._cy(playerPos.y), cpz = World._cz(playerPos.z);
        const rdH = this.renderDistanceH + 1;
        const rdV = this.renderDistanceV + 1;
        const toDelete = this._scratchToDelete;
        toDelete.length = 0;
        for (const chunk of this._chunks.values()) {
            const cx = World._cx(chunk.globalPosition.x);
            const cy = World._cy(chunk.globalPosition.y);
            const cz = World._cz(chunk.globalPosition.z);
            const dx = cx - cpx, dy = cy - cpy, dz = cz - cpz;
            if (dx * dx + dz * dz > rdH * rdH || Math.abs(dy) > rdV) {
                toDelete.push(chunk);
            }
        }
        for (let i = 0; i < toDelete.length; i++) {
            this.deleteChunk(toDelete[i]);
        }
        toDelete.length = 0;
    }
    _createChunkAt(cx, cy, cz) {
        const key = World._key(cx, cy, cz);
        this._generated.add(key);
        const chunk = new Chunk(cx * Chunk.CHUNK_WIDTH, cy * Chunk.CHUNK_HEIGHT, cz * Chunk.CHUNK_DEPTH);
        chunk.generateBlocks(this.seed, (gx, gz) => this.getErosionDisplacement(gx, gz));
        if (chunk.aliveBlocks > 0) {
            this._insertChunk(chunk);
            this.onChunkAdded?.(chunk, chunk.generateVertices(this._gatherNeighbors(cx, cy, cz)));
            // Re-mesh existing neighbors so their edge faces are correctly culled against this chunk.
            // (Inlined: a per-call array-of-tuples literal would allocate 7 arrays each time.)
            this._remeshSingleNeighbor(cx - 1, cy, cz);
            this._remeshSingleNeighbor(cx + 1, cy, cz);
            this._remeshSingleNeighbor(cx, cy - 1, cz);
            this._remeshSingleNeighbor(cx, cy + 1, cz);
            this._remeshSingleNeighbor(cx, cy, cz - 1);
            this._remeshSingleNeighbor(cx, cy, cz + 1);
        }
    }
    _updateWaterFlow(playerPos) {
        const radius = this.waterSimulationRadius;
        const minX = Math.floor(playerPos.x - radius);
        const maxX = Math.floor(playerPos.x + radius);
        const minY = Math.floor(Math.max(0, playerPos.y - radius));
        const maxY = Math.floor(playerPos.y + radius);
        const minZ = Math.floor(playerPos.z - radius);
        const maxZ = Math.floor(playerPos.z + radius);
        const W = Chunk.CHUNK_WIDTH;
        const H = Chunk.CHUNK_HEIGHT;
        const D = Chunk.CHUNK_DEPTH;
        const cMinX = Math.floor(minX / W);
        const cMaxX = Math.floor(maxX / W);
        const cMinY = Math.floor(minY / H);
        const cMaxY = Math.floor(maxY / H);
        const cMinZ = Math.floor(minZ / D);
        const cMaxZ = Math.floor(maxZ / D);
        // Iterate by chunk, then scan only chunks that actually contain water.
        // Avoids ~275k per-block Map lookups (with string-key allocations) per tick.
        const waterBlocks = this._scratchWaterBlocks; // flat (x, y, z, x, y, z, …); reused across ticks
        waterBlocks.length = 0;
        for (let cx = cMinX; cx <= cMaxX; cx++) {
            for (let cy = cMinY; cy <= cMaxY; cy++) {
                for (let cz = cMinZ; cz <= cMaxZ; cz++) {
                    const chunk = this._chunks.get(World._key(cx, cy, cz));
                    if (!chunk || chunk.waterBlocks === 0) {
                        continue;
                    }
                    const baseX = chunk.globalPosition.x;
                    const baseY = chunk.globalPosition.y;
                    const baseZ = chunk.globalPosition.z;
                    // Clip the player's AABB to this chunk's local coordinates.
                    const lxMin = Math.max(0, minX - baseX);
                    const lxMax = Math.min(W - 1, maxX - baseX);
                    const lyMin = Math.max(0, minY - baseY);
                    const lyMax = Math.min(H - 1, maxY - baseY);
                    const lzMin = Math.max(0, minZ - baseZ);
                    const lzMax = Math.min(D - 1, maxZ - baseZ);
                    for (let lz = lzMin; lz <= lzMax; lz++) {
                        for (let ly = lyMin; ly <= lyMax; ly++) {
                            for (let lx = lxMin; lx <= lxMax; lx++) {
                                if (isBlockWater(chunk.getBlock(lx, ly, lz))) {
                                    waterBlocks.push(baseX + lx, baseY + ly, baseZ + lz);
                                }
                            }
                        }
                    }
                }
            }
        }
        // Batch chunk re-meshes: each `_flowWater` call may invoke setBlockType up to
        // twice; without batching every block change triggers a full chunk re-mesh,
        // which dominates the tick when many blocks flow on the first frame.
        const dirty = this._scratchDirtyChunks;
        dirty.clear();
        this._dirtyChunks = dirty;
        try {
            for (let i = 0; i < waterBlocks.length; i += 3) {
                this._flowWater(waterBlocks[i], waterBlocks[i + 1], waterBlocks[i + 2]);
            }
        }
        finally {
            this._dirtyChunks = null;
        }
        // Re-mesh each touched chunk exactly once.
        for (const chunk of dirty) {
            const cx = World._cx(chunk.globalPosition.x);
            const cy = World._cy(chunk.globalPosition.y);
            const cz = World._cz(chunk.globalPosition.z);
            this.onChunkUpdated?.(chunk, chunk.generateVertices(this._gatherNeighbors(cx, cy, cz)));
        }
        dirty.clear();
        waterBlocks.length = 0;
    }
    _flowWater(wx, wy, wz) {
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
