export interface ResultadoOperacion {
  exitoso: boolean;
  mensaje: string;
}

export interface ResultadoPaginado<T> {
  elementos: T[];
  pagina: number;
  tamanoPagina: number;
  totalRegistros: number;
  totalPaginas: number;
}

export interface ProblemaApi {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  traceId?: string;
  errors?: Record<string, string[]>;
}
