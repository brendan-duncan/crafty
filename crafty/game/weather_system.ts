import { BiomeType, EnvironmentEffect } from '../../src/block/index.js';

export enum WeatherType {
  Clear,
  Cloudy,
  Overcast,
  LightRain,
  HeavyRain,
  LightSnow,
  HeavySnow,
}

const BIOME_WEATHERS: Record<BiomeType, WeatherType[]> = {
  [BiomeType.None]:            [WeatherType.Clear, WeatherType.Cloudy, WeatherType.Overcast],
  [BiomeType.Desert]:          [WeatherType.Clear, WeatherType.Cloudy],
  [BiomeType.GrassyPlains]:    [WeatherType.Clear, WeatherType.Cloudy, WeatherType.Overcast, WeatherType.LightRain, WeatherType.HeavyRain],
  [BiomeType.RockyMountains]:  [WeatherType.Clear, WeatherType.Cloudy, WeatherType.Overcast, WeatherType.LightRain, WeatherType.HeavyRain],
  [BiomeType.SnowyPlains]:     [WeatherType.Clear, WeatherType.Cloudy, WeatherType.Overcast, WeatherType.LightSnow, WeatherType.HeavySnow],
  [BiomeType.SnowyMountains]:  [WeatherType.Clear, WeatherType.Cloudy, WeatherType.Overcast, WeatherType.LightSnow, WeatherType.HeavySnow],
  [BiomeType.Max]:             [WeatherType.Clear, WeatherType.Cloudy, WeatherType.Overcast],
};

const WEATHER_WEIGHTS: Record<WeatherType, number> = {
  [WeatherType.Clear]:       5,
  [WeatherType.Cloudy]:      4,
  [WeatherType.Overcast]:    2,
  [WeatherType.LightRain]:   2,
  [WeatherType.HeavyRain]:   1,
  [WeatherType.LightSnow]:   2,
  [WeatherType.HeavySnow]:   1,
};

const WEATHER_NAMES: Record<WeatherType, string> = {
  [WeatherType.Clear]:       'Clear',
  [WeatherType.Cloudy]:      'Cloudy',
  [WeatherType.Overcast]:    'Overcast',
  [WeatherType.LightRain]:   'Light Rain',
  [WeatherType.HeavyRain]:   'Heavy Rain',
  [WeatherType.LightSnow]:   'Light Snow',
  [WeatherType.HeavySnow]:   'Heavy Snow',
};

export function getWeatherName(weather: WeatherType): string {
  return WEATHER_NAMES[weather];
}

export function getWeatherCloudCoverage(weather: WeatherType): number {
  switch (weather) {
    case WeatherType.Clear:      return 0.1;
    case WeatherType.Cloudy:     return 0.55;
    case WeatherType.Overcast:   return 0.9;
    case WeatherType.LightRain:  return 0.7;
    case WeatherType.HeavyRain:  return 0.9;
    case WeatherType.LightSnow:  return 0.8;
    case WeatherType.HeavySnow:  return 0.95;
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
    case WeatherType.LightRain:  return 12000;
    case WeatherType.HeavyRain:  return 24000;
    case WeatherType.LightSnow:  return 800;
    case WeatherType.HeavySnow:  return 1500;
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
