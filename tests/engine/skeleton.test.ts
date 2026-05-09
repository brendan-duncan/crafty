import { describe, it, expect } from 'vitest';
import { Skeleton } from '../../src/engine/skeleton.js';

function identityMat(): Float32Array {
  return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
}

describe('Skeleton', () => {
  it('should construct with given values', () => {
    const parents = new Int16Array([-1]);
    const invBind = identityMat();
    const trans = new Float32Array([0, 0, 0]);
    const rots = new Float32Array([0, 0, 0, 1]);
    const scales = new Float32Array([1, 1, 1]);
    const skel = new Skeleton(parents, invBind, trans, rots, scales);
    expect(skel.jointCount).toBe(1);
  });

  it('should produce identity output for rest pose root joint', () => {
    const parents = new Int16Array([-1]);
    const invBind = identityMat();
    const trans = new Float32Array([0, 0, 0]);
    const rots = new Float32Array([0, 0, 0, 1]);
    const scales = new Float32Array([1, 1, 1]);
    const skel = new Skeleton(parents, invBind, trans, rots, scales);

    const out = new Float32Array(16);
    skel.computeJointMatrices(trans, rots, scales, out);
    for (let i = 0; i < 16; i++) {
      expect(out[i]).toBeCloseTo(identityMat()[i]);
    }
  });

  it('should include translation in output', () => {
    const parents = new Int16Array([-1]);
    const invBind = identityMat();
    const trans = new Float32Array([10, 20, 30]);
    const rots = new Float32Array([0, 0, 0, 1]);
    const scales = new Float32Array([1, 1, 1]);
    const skel = new Skeleton(parents, invBind, trans, rots, scales);

    const out = new Float32Array(16);
    skel.computeJointMatrices(trans, rots, scales, out);
    expect(out[12]).toBeCloseTo(10);
    expect(out[13]).toBeCloseTo(20);
    expect(out[14]).toBeCloseTo(30);
  });

  it('should include non-uniform scale', () => {
    const parents = new Int16Array([-1]);
    const invBind = identityMat();
    const trans = new Float32Array([0, 0, 0]);
    const rots = new Float32Array([0, 0, 0, 1]);
    const scales = new Float32Array([2, 3, 4]);
    const skel = new Skeleton(parents, invBind, trans, rots, scales);

    const out = new Float32Array(16);
    skel.computeJointMatrices(trans, rots, scales, out);
    expect(out[0]).toBeCloseTo(2);
    expect(out[5]).toBeCloseTo(3);
    expect(out[10]).toBeCloseTo(4);
  });

  it('should compose parent then child transform', () => {
    // Two joints: 0 is root, 1 is child of 0
    const parents = new Int16Array([-1, 0]);
    const invBind = new Float32Array([...identityMat(), ...identityMat()]);
    const trans = new Float32Array([10, 0, 0, 0, 0, 0]); // root at (10,0,0), child at (0,0,0)
    const rots = new Float32Array([0, 0, 0, 1, 0, 0, 0, 1]);
    const scales = new Float32Array([1, 1, 1, 1, 1, 1]);
    const skel = new Skeleton(parents, invBind, trans, rots, scales);

    const out = new Float32Array(32);
    skel.computeJointMatrices(trans, rots, scales, out);
    // Child translation includes root's translation
    expect(out[16 + 12]).toBeCloseTo(10); // child tx = root tx + child local tx
    expect(out[16 + 13]).toBeCloseTo(0);
    expect(out[16 + 14]).toBeCloseTo(0);
  });

  it('should multiply by invBind to produce final matrix', () => {
    const invBindData = new Float32Array([
      1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1,
    ]);
    const parents = new Int16Array([-1]);
    const trans = new Float32Array([0, 0, 0]);
    const rots = new Float32Array([0, 0, 0, 1]);
    const scales = new Float32Array([1, 1, 1]);
    const skel = new Skeleton(parents, invBindData, trans, rots, scales);

    const out = new Float32Array(16);
    skel.computeJointMatrices(trans, rots, scales, out);
    // final = global * invBind. Both identity => identity.
    for (let i = 0; i < 16; i++) {
      expect(out[i]).toBeCloseTo(identityMat()[i]);
    }
  });

  it('should handle rootTransform', () => {
    const rootTx = new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 5,0,0,1]);
    const parents = new Int16Array([-1]);
    const invBind = identityMat();
    const trans = new Float32Array([0, 0, 0]);
    const rots = new Float32Array([0, 0, 0, 1]);
    const scales = new Float32Array([1, 1, 1]);
    const skel = new Skeleton(parents, invBind, trans, rots, scales, rootTx);

    const out = new Float32Array(16);
    skel.computeJointMatrices(trans, rots, scales, out);
    expect(out[12]).toBeCloseTo(5);
  });

  it('should produce unit-length rotation in output', () => {
    // A 90-degree rotation around Y
    const s2 = Math.SQRT1_2;
    const parents = new Int16Array([-1]);
    const invBind = identityMat();
    const trans = new Float32Array([0, 0, 0]);
    const rots = new Float32Array([0, s2, 0, s2]); // 90 deg around Y
    const scales = new Float32Array([1, 1, 1]);
    const skel = new Skeleton(parents, invBind, trans, rots, scales);

    const out = new Float32Array(16);
    skel.computeJointMatrices(trans, rots, scales, out);

    // Rotate (1,0,0) through the matrix and check it goes to (0,0,-1)
    const x = out[0] * 1 + out[4] * 0 + out[8] * 0 + out[12] * 0;
    const y = out[1] * 1 + out[5] * 0 + out[9] * 0 + out[13] * 0;
    const z = out[2] * 1 + out[6] * 0 + out[10] * 0 + out[14] * 0;
    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(0);
    expect(z).toBeCloseTo(-1, 5);
  });
});
