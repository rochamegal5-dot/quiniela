import type { FiveGoldResponse } from "@/types/fiveGold";

export async function obtenerCincoDeOro(): Promise<FiveGoldResponse> {
  return {
    fecha: new Date().toLocaleDateString("es-UY"),

    sorteo: {
      bolillas: [4, 11, 18, 32, 46],

      bolillaExtra: 27,

      revancha: [3, 9, 22, 35, 45],

      pozoDeOro: "$ 35.000.000",

      pozoRevancha: "$ 10.500.000",

      pozoDePlata: "$ 2.000.000",
    },

    ultimaActualizacion: new Date().toLocaleTimeString("es-UY"),

    estado: "OK",
  };
}
