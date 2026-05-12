export function halton(index, base) {
    let result = 0, f = 1;
    while (index > 0) {
        f /= base;
        result += f * (index % base);
        index = Math.floor(index / base);
    }
    return result;
}
export function applyJitter(vp, jx, jy) {
    const m = vp.clone();
    for (let c = 0; c < 4; c++) {
        m.data[c * 4 + 0] += jx * m.data[c * 4 + 3];
        m.data[c * 4 + 1] += jy * m.data[c * 4 + 3];
    }
    return m;
}
