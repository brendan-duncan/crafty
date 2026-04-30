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
    case BiomeType.GrassyPlains:    return EnvironmentEffect.Rain;
    case BiomeType.SnowyMountains:  return EnvironmentEffect.Snow;
    case BiomeType.SnowyPlains:     return EnvironmentEffect.Snow;
    default:                        return EnvironmentEffect.None;
  }
}

export function getBiomeCloudCoverage(biome: BiomeType): number {
  switch (biome) {
    case BiomeType.SnowyMountains:  return 1.2;
    case BiomeType.SnowyPlains:     return 1.2;
    case BiomeType.GrassyPlains:    return 1.0;
    case BiomeType.RockyMountains:  return 0.9;
    case BiomeType.Desert:          return 0.15;
    default:                        return 0.55;
  }
}
