export interface Resultado {
  puesto: number;
  numero: string;
}

export interface QuinielaSorteo {
  vespertina: Resultado[];
  nocturna: Resultado[];
}

export interface QuinielaResponse {
  fecha: string;
  sorteo: QuinielaSorteo;
  ultimaActualizacion: string;
  estado?: string;
}
