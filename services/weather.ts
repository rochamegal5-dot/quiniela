import { request } from "./api";
import { getCache, setCache } from "./cache";
import { API_CONFIG } from "./config";

export interface WeatherResponse {
  ciudad: string;
  temperatura: number;
  descripcion: string;
}

const CACHE_KEY = "weather";

export async function getWeather(): Promise<WeatherResponse> {
  const cache = getCache<WeatherResponse>(CACHE_KEY);

  if (cache) return cache;

  const data = await request<WeatherResponse>(
    "/api/weather"
  );

  setCache(CACHE_KEY, data, API_CONFIG.cacheTime);

  return data;
}
