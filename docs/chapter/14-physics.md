# Chapter 14: Physics and Interaction

[Contents](../crafty.md) | [13-Game Engine](13-game-engine.md) | [15-Audio](15-audio.md)

Crafty implements a minimal physics system focused on player movement and block interaction. There is no general-purpose physics engine — only what the gameplay requires.

## 14.1 Collision Detection (AABB)

The player's collision volume is an axis-aligned bounding box (AABB). Collision detection tests the player's AABB against solid blocks in the world:

```typescript
class AABB {
  min: Vec3;
  max: Vec3;

  intersectsBlock(wx: number, wy: number, wz: number): boolean;
  sweepTest(velocity: Vec3, world: World): { hit: boolean; normal: Vec3; time: number };
}
```

The **sweep test** moves the AABB along the velocity vector and finds the first collision. This allows the player to slide along walls — if the velocity has an X component that causes collision, the X component is zeroed and the remaining Y/Z sweep continues.

## 14.2 Player Movement and Gravity

The player controller implements a simplified **collide-and-slide** algorithm:

1. Compute desired velocity from input and gravity.
2. Sweep-test the velocity against world blocks.
3. If collision, slide along the collision normal (remove the velocity component along the normal).
4. Repeat up to 3 iterations to handle corners and multiple collisions.
5. Apply the final velocity to the player position.

Gravity is constant at `-20 m/s²` (slightly higher than Earth's `-9.8` for a more responsive feel). Ground friction slows horizontal movement when the player is standing on a block.

## 14.3 Block Ray Casting

To determine which block the player is looking at, a ray is cast from the camera through the crosshair. The DDA (Digital Differential Analyzer) algorithm traverses the voxel grid efficiently:

```typescript
function raycastVoxels(origin: Vec3, dir: Vec3, world: World, maxDist: number): BlockHit | null {
  let x = Math.floor(origin.x), y = Math.floor(origin.y), z = Math.floor(origin.z);
  const stepX = sign(dir.x), stepY = sign(dir.y), stepZ = sign(dir.z);
  let tMaxX = ((dir.x > 0 ? (x + 1) : x) - origin.x) / dir.x;
  let tMaxY = ((dir.y > 0 ? (y + 1) : y) - origin.y) / dir.y;
  let tMaxZ = ((dir.z > 0 ? (z + 1) : z) - origin.z) / dir.z;
  const tDeltaX = abs(1 / dir.x), tDeltaY = abs(1 / dir.y), tDeltaZ = abs(1 / dir.z);

  for (let i = 0; i < MAX_STEPS; i++) {
    if (world.getBlock(x, y, z) !== BlockType.Air) {
      return { x, y, z, normal: ... };
    }
    // Step to next voxel boundary
    if (tMaxX < tMaxY) { tMaxX += tDeltaX; x += stepX; }
    else if (tMaxY < tMaxZ) { tMaxY += tDeltaY; y += stepY; }
    else { tMaxZ += tDeltaZ; z += stepZ; }
  }
  return null;
}
```

The return value includes the block position and the face normal (which side was hit), used for placing new blocks adjacent to the hit face.

## 14.4 Block Interaction

Block breaking uses a **progressive crack animation** — holding the mouse button on a block gradually breaks it:

```typescript
// Block breaking state
let breakProgress = 0;
const breakTime = blockHardness * 1.5;  // Stone ~1.5s, dirt ~0.3s

function updateBreak(dt: number, hit: BlockHit) {
  breakProgress += dt;
  if (breakProgress >= breakTime) {
    world.setBlock(hit.x, hit.y, hit.z, BlockType.Air);
    breakProgress = 0;
  }
  // Update crack overlay texture
  const stage = Math.min(Math.floor(breakProgress / breakTime * 10), 9);
  blockHighlightPass.setCrackStage(stage);
}
```

Block placement inserts a block at the face adjacent to the hit position:

```typescript
function placeBlock(hit: BlockHit, blockType: BlockType) {
  const nx = hit.x + hit.normal.x;
  const ny = hit.y + hit.normal.y;
  const nz = hit.z + hit.normal.z;
  if (world.getBlock(nx, ny, nz) === BlockType.Air) {
    world.setBlock(nx, ny, nz, blockType);
  }
}
```

## 14.5 Animal AI

Ducks and pigs implement simple behaviour: wandering, following, and fleeing. Each animal has a state machine with idle, walk, and flee states:

```typescript
class AnimalAI extends Component {
  state: 'idle' | 'walk' | 'flee' = 'idle';
  targetPosition: Vec3;
  detectionRadius = 10;

  update(dt: number) {
    switch (this.state) {
      case 'idle':
        if (random() < 0.01) this.startWalking();
        if (this.playerNearby()) this.state = 'flee';
        break;
      case 'walk':
        this.moveToward(this.targetPosition, dt);
        if (this.arrived() || random() < 0.01) this.state = 'idle';
        break;
      case 'flee':
        this.moveAwayFrom(this.player.position, dt);
        if (!this.playerNearby()) this.state = 'idle';
        break;
    }
  }
}
```

Animations are simple — ducks and pigs use a few frames of vertex animation (waddle) blended with movement direction.

**Further reading:**
- `src/engine/components/player_controller.ts` — Player movement and collision
- `src/engine/components/` — Animal AI, block interaction
- `src/block/` — World modification and ray casting

----
[Contents](../crafty.md) | [13-Game Engine](13-game-engine.md) | [15-Audio](15-audio.md)
