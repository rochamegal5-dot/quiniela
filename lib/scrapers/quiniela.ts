import type { QuinielaResponse } from "@/types/quiniela";

function generar() {
  return Array.from({ length: 20 }, (_, i) => ({
    puesto: i + 1,
    numero: String(Math.floor(Math.random() * 10000)).padStart(4, "0"),
  }));
}

export async function obtenerQuiniela(): Promise<QuinielaResponse> {
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
