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
