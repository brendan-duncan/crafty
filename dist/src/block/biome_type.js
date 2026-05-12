/** Discrete biome categories used by world generation. */
export var BiomeType;
(function (BiomeType) {
    BiomeType[BiomeType["None"] = 0] = "None";
    BiomeType[BiomeType["SnowyMountains"] = 1] = "SnowyMountains";
    BiomeType[BiomeType["RockyMountains"] = 2] = "RockyMountains";
    BiomeType[BiomeType["GrassyPlains"] = 3] = "GrassyPlains";
    BiomeType[BiomeType["SnowyPlains"] = 4] = "SnowyPlains";
    BiomeType[BiomeType["Desert"] = 5] = "Desert";
    BiomeType[BiomeType["Max"] = 6] = "Max";
})(BiomeType || (BiomeType = {}));
/** Ambient weather/particle effect associated with a biome. */
export var EnvironmentEffect;
(function (EnvironmentEffect) {
    EnvironmentEffect[EnvironmentEffect["None"] = 0] = "None";
    EnvironmentEffect[EnvironmentEffect["Rain"] = 1] = "Rain";
    EnvironmentEffect[EnvironmentEffect["Snow"] = 2] = "Snow";
})(EnvironmentEffect || (EnvironmentEffect = {}));
/**
 * Returns the weather/particle effect that should play in the given biome.
 *
 * @param biome - biome to query
 * @returns the environment effect, or `EnvironmentEffect.None` if none
 */
export function getBiomeEnvironmentEffect(biome) {
    switch (biome) {
        //case BiomeType.GrassyPlains:
        // return EnvironmentEffect.Rain;
        case BiomeType.SnowyMountains:
            return EnvironmentEffect.Snow;
        case BiomeType.SnowyPlains:
            return EnvironmentEffect.Snow;
        default:
            return EnvironmentEffect.None;
    }
}
/**
 * Returns the vertical cloud layer bounds (in world units) for the biome.
 *
 * @param biome - biome to query
 * @returns the cloud base and top altitudes
 */
export function getBiomeCloudBounds(biome) {
    switch (biome) {
        case BiomeType.SnowyMountains:
            return { cloudBase: 90, cloudTop: 200 };
        case BiomeType.RockyMountains:
            return { cloudBase: 75, cloudTop: 160 };
        default:
            return { cloudBase: 75, cloudTop: 105 };
    }
}
// Width of the blend zone on each side of a biome threshold, in temperature units.
// Temperature is sampled at gx/512, so 0.05 ≈ 25 blocks per side (≈ 3-chunk total blend band).
const _BLEND_HALF = 0.05;
// Each entry: [threshold, warm-side biome, cool-side biome]
const _THRESHOLDS = [
    [0.35, BiomeType.Desert, BiomeType.GrassyPlains],
    [-0.15, BiomeType.GrassyPlains, BiomeType.SnowyPlains],
    [-0.3, BiomeType.SnowyPlains, BiomeType.SnowyMountains],
    [-0.5, BiomeType.SnowyMountains, BiomeType.RockyMountains],
];
/**
 * Returns the two biomes on either side of the nearest threshold and a blend weight.
 *
 * Outside all blend zones, `biome1 === biome2` and `blend === 0`.
 *
 * @param temperature - sampled temperature noise in `[-1, 1]`
 * @returns the blend descriptor
 */
export function getBiomeBlend(temperature) {
    for (const [t, warm, cool] of _THRESHOLDS) {
        const d = temperature - t;
        if (d >= -_BLEND_HALF && d <= _BLEND_HALF) {
            return { biome1: cool, biome2: warm, blend: (d + _BLEND_HALF) / (2 * _BLEND_HALF) };
        }
    }
    const biome = _pureFromTemperature(temperature);
    return { biome1: biome, biome2: biome, blend: 0 };
}
function _pureFromTemperature(temperature) {
    if (temperature > 0.35) {
        return BiomeType.Desert;
    }
    if (temperature > -0.15) {
        return BiomeType.GrassyPlains;
    }
    if (temperature > -0.3) {
        return BiomeType.SnowyPlains;
    }
    if (temperature > -0.5) {
        return BiomeType.SnowyMountains;
    }
    return BiomeType.RockyMountains;
}
/**
 * Returns the cloud coverage density multiplier for the biome.
 *
 * @param biome - biome to query
 * @returns coverage multiplier (higher = more clouds)
 */
export function getBiomeCloudCoverage(biome) {
    switch (biome) {
        case BiomeType.SnowyMountains: return 1.2;
        case BiomeType.SnowyPlains: return 1.0;
        case BiomeType.GrassyPlains: return 0.75;
        case BiomeType.RockyMountains: return 0.9;
        case BiomeType.Desert: return 0.15;
        default: return 0.55;
    }
}
