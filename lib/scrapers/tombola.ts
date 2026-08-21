import type { TombolaResponse } from "@/types/tombola";

function generar() {
  return Array.from({ length: 20 }, (_, i) => ({
    puesto: i + 1,
    numero: String(Math.floor(Math.random() * 100)).padStart(2, "0"),
  }));
}

export async function obtenerTombola(): Promise<TombolaResponse> {
  return {
    fecha: new Date().toLocaleDateString("es-UY"),

    sorteo: {
      vespertina: generar(),
      nocturna: generar(),
    },

    ultimaActualizacion: new Date().toLocaleTimeString("es-UY"),

    estado: "OK",
  };
}
