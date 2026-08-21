export interface FiveGoldSorteo {
  bolillas: number[];
  bolillaExtra: number;
  revancha: number[];

  pozoDeOro: string;
  pozoRevancha: string;
  pozoDePlata: string;
}

export interface FiveGoldResponse {
  fecha: string;
  sorteo: FiveGoldSorteo;
  ultimaActualizacion: string;
  estado?: string;
}

