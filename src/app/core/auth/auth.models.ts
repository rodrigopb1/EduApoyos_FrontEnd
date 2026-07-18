export const ROLES = {
  asesor: 'Asesor',
  estudiante: 'Estudiante',
} as const;

export type RolSistema = (typeof ROLES)[keyof typeof ROLES];

export interface LoginRequest {
  correoElectronico: string;
  contrasena: string;
}

export interface TokenResponse {
  token: string;
  expiraEn: string;
  usuarioId: string;
  nombreCompleto: string;
  correoElectronico: string;
  roles: RolSistema[];
}

export interface SesionUsuario extends TokenResponse {
  persistente: boolean;
}
