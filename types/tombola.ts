export interface Resultado {
  puesto: number;
  numero: string;
}

export interface TombolaSorteo {
  vespertina: Resultado[];
  nocturna: Resultado[];
}

export interface TombolaResponse {
  fecha: string;
  sorteo: TombolaSorteo;
  ultimaActualizacion: string;
  estado?: string;
}
