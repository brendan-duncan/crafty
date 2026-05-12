import { Mesh } from './mesh.js';
function _addBox(verts, indices, cx, cy, cz, sx, sy, sz) {
    const faces = [
        { n: [0, 0, -1], t: [-1, 0, 0, 1], v: [[-sx, -sy, -sz], [sx, -sy, -sz], [sx, sy, -sz], [-sx, sy, -sz]] },
        { n: [0, 0, 1], t: [1, 0, 0, 1], v: [[sx, -sy, sz], [-sx, -sy, sz], [-sx, sy, sz], [sx, sy, sz]] },
        { n: [-1, 0, 0], t: [0, 0, -1, 1], v: [[-sx, -sy, sz], [-sx, -sy, -sz], [-sx, sy, -sz], [-sx, sy, sz]] },
        { n: [1, 0, 0], t: [0, 0, 1, 1], v: [[sx, -sy, -sz], [sx, -sy, sz], [sx, sy, sz], [sx, sy, -sz]] },
        { n: [0, 1, 0], t: [1, 0, 0, 1], v: [[-sx, sy, -sz], [sx, sy, -sz], [sx, sy, sz], [-sx, sy, sz]] },
        { n: [0, -1, 0], t: [1, 0, 0, 1], v: [[-sx, -sy, sz], [sx, -sy, sz], [sx, -sy, -sz], [-sx, -sy, -sz]] },
    ];
    const uvs = [[0, 1], [1, 1], [1, 0], [0, 0]];
    for (const f of faces) {
        const base = verts.length / 12;
        for (let i = 0; i < 4; i++) {
            const [vx, vy, vz] = f.v[i];
            verts.push(cx + vx, cy + vy, cz + vz, f.n[0], f.n[1], f.n[2], uvs[i][0], uvs[i][1], f.t[0], f.t[1], f.t[2], f.t[3]);
        }
        indices.push(base, base + 2, base + 1, base, base + 3, base + 2);
    }
}
export function createCreeperBodyMesh(device, scale = 1.0) {
    const verts = [];
    const indices = [];
    const s = scale;
    // Main body: 0.50 wide × 1.20 tall × 0.40 deep (twice as tall)
    _addBox(verts, indices, 0, 0, 0, 0.25 * s, 0.60 * s, 0.20 * s);
    // Four legs; each 0.12 wide × 0.40 tall × 0.12 deep (twice as tall)
    const lx = 0.16 * s;
    const ly = -0.80 * s;
    const lz = 0.13 * s;
    const lsx = 0.06 * s;
    const lsy = 0.20 * s;
    const lsz = 0.06 * s;
    _addBox(verts, indices, -lx, ly, -lz, lsx, lsy, lsz);
    _addBox(verts, indices, lx, ly, -lz, lsx, lsy, lsz);
    _addBox(verts, indices, -lx, ly, lz, lsx, lsy, lsz);
    _addBox(verts, indices, lx, ly, lz, lsx, lsy, lsz);
    return Mesh.fromData(device, new Float32Array(verts), new Uint32Array(indices));
}
export function createCreeperHeadMesh(device, scale = 1.0) {
    const verts = [];
    const indices = [];
    const s = scale;
    // Head: 0.44 wide × 0.44 tall × 0.44 deep
    _addBox(verts, indices, 0, 0, 0, 0.22 * s, 0.22 * s, 0.22 * s);
    return Mesh.fromData(device, new Float32Array(verts), new Uint32Array(indices));
}
