
import { request } from "./api";
import { getCache, setCache } from "./cache";
import { API_CONFIG } from "./config";

export interface FiveGoldResponse {
  fecha: string;

  sorteo: {
    numeros: number[];
    bolillaExtra: number;
    pozoDeOro: string;
    revancha: number[];
    pozoRevancha: string;
  };

  ultimaActualizacion: string;
  estado?: string;
}

const CACHE_KEY = "fivegold";

export async function getFiveGold(): Promise<FiveGoldResponse> {
  const cache = getCache<FiveGoldResponse>(CACHE_KEY);

  if (cache) return cache;

  const data = await request<FiveGoldResponse>(
    "/api/fivegold"
  );

  setCache(CACHE_KEY, data, API_CONFIG.cacheTime);

  return data;
}
