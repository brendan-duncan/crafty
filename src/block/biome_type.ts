export enum BiomeType {
  None,
  SnowyMountains,
  RockyMountains,
  GrassyPlains,
  SnowyPlains,
  Desert,
  Max
}

export enum EnvironmentEffect {
  None,
  Rain,
  Snow,
}

export function getBiomeEnvironmentEffect(biome: BiomeType): EnvironmentEffect {
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

export function getBiomeCloudBounds(biome: BiomeType): { cloudBase: number; cloudTop: number } {
  switch (biome) {
    case BiomeType.SnowyMountains: 
      return { cloudBase: 90, cloudTop: 200 };
    case BiomeType.RockyMountains: 
      return { cloudBase: 75, cloudTop: 160 };
    default: 
      return { cloudBase: 75, cloudTop:  105 };
  }
}

// Width of the blend zone on each side of a biome threshold, in temperature units.
// Temperature is sampled at gx/512, so 0.05 ≈ 25 blocks per side (≈ 3-chunk total blend band).
const _BLEND_HALF = 0.05;

// Each entry: [threshold, warm-side biome, cool-side biome]
const _THRESHOLDS: [number, BiomeType, BiomeType][] = [
  [ 0.35,  BiomeType.Desert,         BiomeType.GrassyPlains   ],
  [-0.15,  BiomeType.GrassyPlains,   BiomeType.SnowyPlains    ],
  [-0.3,   BiomeType.SnowyPlains,    BiomeType.SnowyMountains ],
  [-0.5,   BiomeType.SnowyMountains, BiomeType.RockyMountains ],
];

export interface BiomeBlend {
  biome1: BiomeType; // cool-side (or pure biome when blend === 0)
  biome2: BiomeType; // warm-side (equals biome1 outside blend zone)
  blend: number;     // 0 = fully biome1, 1 = fully biome2
}

/**
 * Returns the two biomes on either side of the nearest threshold and a blend weight.
 * Outside all blend zones, biome1 === biome2 and blend === 0.
 */
export function getBiomeBlend(temperature: number): BiomeBlend {
  for (const [t, warm, cool] of _THRESHOLDS) {
    const d = temperature - t;
    if (d >= -_BLEND_HALF && d <= _BLEND_HALF) {
      return { biome1: cool, biome2: warm, blend: (d + _BLEND_HALF) / (2 * _BLEND_HALF) };
    }
  }
  const biome = _pureFromTemperature(temperature);
  return { biome1: biome, biome2: biome, blend: 0 };
}

function _pureFromTemperature(temperature: number): BiomeType {
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

export function getBiomeCloudCoverage(biome: BiomeType): number {
  switch (biome) {
    case BiomeType.SnowyMountains: return 1.2;
    case BiomeType.SnowyPlains: return 1.0;
    case BiomeType.GrassyPlains: return 0.75;
    case BiomeType.RockyMountains: return 0.9;
    case BiomeType.Desert: return 0.15;
    default: return 0.55;
  }
}
