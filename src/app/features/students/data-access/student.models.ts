import { TipoDocumento } from '../../../shared/models/catalogs';

export interface EstudianteResponse {
  id: string;
  usuarioId: string;
  nombreCompleto: string;
  correoElectronico: string;
  numeroDocumento: string;
  tipoDocumento: TipoDocumento;
  programaAcademico: string;
  semestre: number;
  activo: boolean;
  fechaCreacion: string;
}

export interface CrearEstudianteRequest {
  nombreCompleto: string;
  correoElectronico: string;
  contrasena: string;
  numeroDocumento: string;
  tipoDocumento: TipoDocumento;
  programaAcademico: string;
  semestre: number;
}

export interface ActualizarEstudianteRequest {
  numeroDocumento: string;
  tipoDocumento: TipoDocumento;
  programaAcademico: string;
  semestre: number;
}
