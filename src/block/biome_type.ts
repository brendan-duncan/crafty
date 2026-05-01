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
    //case BiomeType.GrassyPlains:    return EnvironmentEffect.Rain;
    case BiomeType.SnowyMountains:  return EnvironmentEffect.Snow;
    case BiomeType.SnowyPlains:     return EnvironmentEffect.Snow;
    default:                        return EnvironmentEffect.None;
  }
}

export function getBiomeCloudBounds(biome: BiomeType): { cloudBase: number; cloudTop: number } {
  switch (biome) {
    case BiomeType.SnowyMountains: return { cloudBase: 90, cloudTop: 200 };
    case BiomeType.RockyMountains: return { cloudBase: 75, cloudTop: 160 };
    default:                       return { cloudBase: 75, cloudTop:  105 };
  }
}

export function getBiomeCloudCoverage(biome: BiomeType): number {
  switch (biome) {
    case BiomeType.SnowyMountains:  return 1.2;
    case BiomeType.SnowyPlains:     return 1.0;
    case BiomeType.GrassyPlains:    return 0.75;
    case BiomeType.RockyMountains:  return 0.9;
    case BiomeType.Desert:          return 0.15;
    default:                        return 0.55;
  }
}
