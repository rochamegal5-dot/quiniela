import { request } from "./api";
import { getCache, setCache } from "./cache";
import { API_CONFIG } from "./config";

export interface Resultado {
  puesto: number;
  numero: string;
}

export interface TombolaResponse {
  fecha: string;
  sorteo: {
    vespertina: Resultado[];
    nocturna: Resultado[];
  };
  ultimaActualizacion: string;
  estado?: string;
}

const CACHE_KEY = "tombola";

export async function getTombola(): Promise<TombolaResponse> {
  const cache = getCache<TombolaResponse>(CACHE_KEY);

  if (cache) return cache;

  const data = await request<TombolaResponse>(
    "/api/tombola"
  );

  setCache(CACHE_KEY, data, API_CONFIG.cacheTime);

  return data;
}
