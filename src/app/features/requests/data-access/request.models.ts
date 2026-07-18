import { EstadoSolicitud, TipoApoyo } from '../../../shared/models/catalogs';

export interface SolicitudResponse {
  id: string;
  estudianteId: string;
  nombreEstudiante: string;
  tipoApoyo: TipoApoyo;
  montoSolicitado: number;
  estado: EstadoSolicitud;
  fechaCreacion: string;
}

export interface HistorialEstadoResponse {
  id: string;
  estadoAnterior: EstadoSolicitud;
  estadoNuevo: EstadoSolicitud;
  usuarioResponsableId: string;
  observacion: string;
  fechaCambio: string;
}

export interface SolicitudDetalleResponse {
  id: string;
  estudianteId: string;
  nombreEstudiante: string;
  numeroDocumento: string;
  programaAcademico: string;
  semestre: number;
  tipoApoyo: TipoApoyo;
  montoSolicitado: number;
  justificacion: string;
  estado: EstadoSolicitud;
  fechaCreacion: string;
  historial: HistorialEstadoResponse[];
}

export interface CrearSolicitudRequest {
  estudianteId: string | null;
  tipoApoyo: TipoApoyo;
  montoSolicitado: number;
  justificacion: string;
}

export interface CambiarEstadoRequest {
  estado: EstadoSolicitud;
  observacion: string;
}

export interface SolicitudFiltro {
  estado?: EstadoSolicitud | null;
  tipoApoyo?: TipoApoyo | null;
  estudianteId?: string | null;
  pagina: number;
  tamanoPagina: number;
}
