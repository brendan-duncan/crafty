import { BiomeType, EnvironmentEffect } from '../../src/block/index.js';

export enum WeatherType {
  Clear,
  Cloudy,
  Overcast,
  LightRain,
  HeavyRain,
  LightSnow,
  HeavySnow,
  LightFog,
  HeavyFog,
}

const BIOME_WEATHERS: Record<BiomeType, WeatherType[]> = {
  [BiomeType.None]: [WeatherType.Clear, WeatherType.Cloudy, WeatherType.Overcast, WeatherType.LightFog, WeatherType.HeavyFog],
  [BiomeType.Desert]: [WeatherType.Clear, WeatherType.Cloudy],
  [BiomeType.GrassyPlains]: [WeatherType.Clear, WeatherType.Cloudy, WeatherType.Overcast, WeatherType.LightRain, WeatherType.HeavyRain, WeatherType.LightFog, WeatherType.HeavyFog],
  [BiomeType.RockyMountains]: [WeatherType.Clear, WeatherType.Cloudy, WeatherType.Overcast, WeatherType.LightRain, WeatherType.HeavyRain, WeatherType.LightFog, WeatherType.HeavyFog],
  [BiomeType.SnowyPlains]: [WeatherType.Clear, WeatherType.Cloudy, WeatherType.Overcast, WeatherType.LightSnow, WeatherType.HeavySnow, WeatherType.LightFog, WeatherType.HeavyFog],
  [BiomeType.SnowyMountains]: [WeatherType.Clear, WeatherType.Cloudy, WeatherType.Overcast, WeatherType.LightSnow, WeatherType.HeavySnow, WeatherType.LightFog, WeatherType.HeavyFog],
  [BiomeType.Max]: [WeatherType.Clear, WeatherType.Cloudy, WeatherType.Overcast, WeatherType.LightFog, WeatherType.HeavyFog],
};

const WEATHER_WEIGHTS: Record<WeatherType, number> = {
  [WeatherType.Clear]: 5,
  [WeatherType.Cloudy]: 4,
  [WeatherType.Overcast]: 2,
  [WeatherType.LightRain]: 2,
  [WeatherType.HeavyRain]: 1,
  [WeatherType.LightSnow]: 2,
  [WeatherType.HeavySnow]: 1,
  [WeatherType.LightFog]: 2,
  [WeatherType.HeavyFog]: 2,
};

const WEATHER_NAMES: Record<WeatherType, string> = {
  [WeatherType.Clear]: 'Clear',
  [WeatherType.Cloudy]: 'Cloudy',
  [WeatherType.Overcast]: 'Overcast',
  [WeatherType.LightRain]: 'Light Rain',
  [WeatherType.HeavyRain]: 'Heavy Rain',
  [WeatherType.LightSnow]: 'Light Snow',
  [WeatherType.HeavySnow]: 'Heavy Snow',
  [WeatherType.LightFog]: 'Light Fog',
  [WeatherType.HeavyFog]: 'Heavy Fog',
};

export function getWeatherName(weather: WeatherType): string {
  return WEATHER_NAMES[weather];
}

export function getWeatherCloudCoverage(weather: WeatherType): number {
  switch (weather) {
    case WeatherType.Clear: return 0.1;
    case WeatherType.Cloudy: return 0.85;
    case WeatherType.Overcast: return 1.1;
    case WeatherType.LightRain: return 0.95;
    case WeatherType.HeavyRain: return 1.1;
    case WeatherType.LightSnow: return 0.8;
    case WeatherType.HeavySnow: return 1.2;
    case WeatherType.LightFog: return 0.8;
    case WeatherType.HeavyFog: return 1.15;
  }
}

/**
 * Per-weather cloud density override.  Most weather uses the global default
 * (set by the game), but fog weathers need a lower density so the player can
 * see a useful distance while walking through ground-level cloud.
 *
 * Returns `null` when the weather doesn't override the global density.
 */
export function getWeatherCloudDensity(weather: WeatherType): number | null {
  switch (weather) {
    case WeatherType.LightFog: return 0.2;
    case WeatherType.HeavyFog: return 0.5;
    default: return null;
  }
}

/**
 * Per-weather cloud altitude override.  Most weather defers to the biome's
 * cloud bounds; fog weathers drop the base below ground so the cloud volume
 * engulfs the player.
 */
export function getWeatherCloudBounds(
  weather: WeatherType,
  biomeBounds: { cloudBase: number; cloudTop: number },
): { cloudBase: number; cloudTop: number } {
  if (weather === WeatherType.LightFog || weather === WeatherType.HeavyFog) {
    return { cloudBase: -10, cloudTop: 80 };
  } else if (weather === WeatherType.Overcast || weather === WeatherType.HeavySnow) {
    return { cloudBase: biomeBounds.cloudBase - 10, cloudTop: biomeBounds.cloudTop + 20 };
  }
  return biomeBounds;
}

/**
 * How strongly to whiten the cloud ambient color for this weather, in [0, 1].
 * 0 = leave the sky-tinted ambient as-is; 1 = push each channel up to the
 * brightest one (fully neutral gray of the same peak brightness). Fog weathers
 * use this so the volume reads as white fog when the camera is inside it,
 * instead of the default bluish cloud ambient dominating.
 */
export function getWeatherCloudAmbientWhiten(weather: WeatherType): number {
  switch (weather) {
    case WeatherType.LightFog: return 0.5;
    case WeatherType.HeavyFog: return 0.85;
    default:                   return 0;
  }
}

export function getWeatherEnvironmentEffect(weather: WeatherType): EnvironmentEffect {
  switch (weather) {
    case WeatherType.LightRain:
    case WeatherType.HeavyRain:
      return EnvironmentEffect.Rain;
    case WeatherType.LightSnow:
    case WeatherType.HeavySnow:
      return EnvironmentEffect.Snow;
    default:
      return EnvironmentEffect.None;
  }
}

export function getWeatherSpawnRate(weather: WeatherType): number {
  switch (weather) {
    case WeatherType.LightRain: return 12000;
    case WeatherType.HeavyRain: return 50000;
    case WeatherType.LightSnow: return 800;
    case WeatherType.HeavySnow: return 5500;
    default: return 0;
  }
}

export function pickRandomWeather(biome: BiomeType, _current?: WeatherType): WeatherType {
  const available = BIOME_WEATHERS[biome];
  if (!available || available.length === 0) return WeatherType.Clear;
  const totalWeight = available.reduce((sum, w) => sum + WEATHER_WEIGHTS[w], 0);
  let r = Math.random() * totalWeight;
  for (const w of available) {
    r -= WEATHER_WEIGHTS[w];
    if (r <= 0) return w;
  }
  return available[available.length - 1];
}

export function getWeatherChangeInterval(): number {
  return 30 + Math.random() * 90;
}

/**
 * Next weather in the biome's available list (wraps around). When `current`
 * isn't in the list (e.g. just moved biomes) the first available weather is
 * returned. Used by the debug `O` hotkey to cycle deterministically through
 * weathers instead of rolling another random pick.
 */
export function nextWeather(biome: BiomeType, current: WeatherType): WeatherType {
  const available = BIOME_WEATHERS[biome];
  if (!available || available.length === 0) {
    return WeatherType.Clear;
  }
  const idx = available.indexOf(current);
  if (idx === -1) {
    return available[0];
  }
  return available[(idx + 1) % available.length];
}
