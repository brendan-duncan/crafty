import { BiomeType, EnvironmentEffect } from '../../src/block/index.js';

export enum WeatherType {
  Clear,
  Cloudy,
  Overcast,
  LightRain,
  HeavyRain,
  LightSnow,
  HeavySnow,
  Foggy,
}

const BIOME_WEATHERS: Record<BiomeType, WeatherType[]> = {
  [BiomeType.None]:            [WeatherType.Clear, WeatherType.Cloudy, WeatherType.Overcast, WeatherType.Foggy],
  [BiomeType.Desert]:          [WeatherType.Clear, WeatherType.Cloudy],
  [BiomeType.GrassyPlains]:    [WeatherType.Clear, WeatherType.Cloudy, WeatherType.Overcast, WeatherType.LightRain, WeatherType.HeavyRain, WeatherType.Foggy],
  [BiomeType.RockyMountains]:  [WeatherType.Clear, WeatherType.Cloudy, WeatherType.Overcast, WeatherType.LightRain, WeatherType.HeavyRain, WeatherType.Foggy],
  [BiomeType.SnowyPlains]:     [WeatherType.Clear, WeatherType.Cloudy, WeatherType.Overcast, WeatherType.LightSnow, WeatherType.HeavySnow, WeatherType.Foggy],
  [BiomeType.SnowyMountains]:  [WeatherType.Clear, WeatherType.Cloudy, WeatherType.Overcast, WeatherType.LightSnow, WeatherType.HeavySnow, WeatherType.Foggy],
  [BiomeType.Max]:             [WeatherType.Clear, WeatherType.Cloudy, WeatherType.Overcast, WeatherType.Foggy],
};

const WEATHER_WEIGHTS: Record<WeatherType, number> = {
  [WeatherType.Clear]:       5,
  [WeatherType.Cloudy]:      4,
  [WeatherType.Overcast]:    2,
  [WeatherType.LightRain]:   2,
  [WeatherType.HeavyRain]:   1,
  [WeatherType.LightSnow]:   2,
  [WeatherType.HeavySnow]:   1,
  [WeatherType.Foggy]:       2,
};

const WEATHER_NAMES: Record<WeatherType, string> = {
  [WeatherType.Clear]:       'Clear',
  [WeatherType.Cloudy]:      'Cloudy',
  [WeatherType.Overcast]:    'Overcast',
  [WeatherType.LightRain]:   'Light Rain',
  [WeatherType.HeavyRain]:   'Heavy Rain',
  [WeatherType.LightSnow]:   'Light Snow',
  [WeatherType.HeavySnow]:   'Heavy Snow',
  [WeatherType.Foggy]:       'Foggy',
};

export function getWeatherName(weather: WeatherType): string {
  return WEATHER_NAMES[weather];
}

export function getWeatherCloudCoverage(weather: WeatherType): number {
  switch (weather) {
    case WeatherType.Clear:      return 0.1;
    case WeatherType.Cloudy:     return 0.85;
    case WeatherType.Overcast:   return 1.1;
    case WeatherType.LightRain:  return 0.95;
    case WeatherType.HeavyRain:  return 1.1;
    case WeatherType.LightSnow:  return 0.8;
    case WeatherType.HeavySnow:  return 1.2;
    case WeatherType.Foggy:      return 1.15;
  }
}

/**
 * Per-weather cloud density override.  Most weather uses the global default
 * (set by the game), but Foggy needs a much lower density so the player can
 * see a useful distance while walking through ground-level cloud.
 *
 * Returns `null` when the weather doesn't override the global density.
 */
export function getWeatherCloudDensity(weather: WeatherType): number | null {
  switch (weather) {
    case WeatherType.Foggy: return 0.5;
    default:                return null;
  }
}

/**
 * Per-weather cloud altitude override.  Most weather defers to the biome's
 * cloud bounds; Foggy drops the base below ground so the cloud volume engulfs
 * the player.
 */
export function getWeatherCloudBounds(
  weather: WeatherType,
  biomeBounds: { cloudBase: number; cloudTop: number },
): { cloudBase: number; cloudTop: number } {
  if (weather === WeatherType.Foggy) {
    return { cloudBase: -10, cloudTop: 80 };
  }
  return biomeBounds;
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
    case WeatherType.LightRain:  return 12000;
    case WeatherType.HeavyRain:  return 50000;
    case WeatherType.LightSnow:  return 800;
    case WeatherType.HeavySnow:  return 5500;
    default:                     return 0;
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
  if (!available || available.length === 0) return WeatherType.Clear;
  const idx = available.indexOf(current);
  if (idx === -1) return available[0];
  return available[(idx + 1) % available.length];
}
