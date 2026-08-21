import axios from "axios";
import { API_CONFIG } from "./config";

export async function request<T>(
  url: string
): Promise<T> {
  let ultimoError: unknown;

  for (let intento = 0; intento < API_CONFIG.retries; intento++) {
    try {
      const response = await axios.get<T>(url, {
        timeout: API_CONFIG.timeout,

        headers: {
          "User-Agent": API_CONFIG.userAgent,
        },
      });

      return response.data;
    } catch (e) {
      ultimoError = e;
    }
  }

  throw ultimoError;
}
