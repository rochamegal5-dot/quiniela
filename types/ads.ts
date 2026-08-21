export interface Advertisement {
  id: number;

  titulo: string;

  descripcion: string;

  imagen?: string;

  video?: string;

  enlace?: string;

  activo: boolean;

  duracion: number;
}

export interface AdsResponse {
  anuncios: Advertisement[];
}
