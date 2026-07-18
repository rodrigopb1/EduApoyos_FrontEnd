export enum TipoDocumento {
  CedulaCiudadania = 1,
  CedulaExtranjeria = 2,
  TarjetaIdentidad = 3,
  Pasaporte = 4,
}

export enum TipoApoyo {
  Beca = 1,
  Credito = 2,
  Subsidio = 3,
}

export enum EstadoSolicitud {
  Pendiente = 1,
  EnRevision = 2,
  Aprobada = 3,
  Rechazada = 4,
}

export const TIPOS_DOCUMENTO = [
  { value: TipoDocumento.CedulaCiudadania, label: 'Cédula de ciudadanía' },
  { value: TipoDocumento.CedulaExtranjeria, label: 'Cédula de extranjería' },
  { value: TipoDocumento.TarjetaIdentidad, label: 'Tarjeta de identidad' },
  { value: TipoDocumento.Pasaporte, label: 'Pasaporte' },
] as const;

export const TIPOS_APOYO = [
  { value: TipoApoyo.Beca, label: 'Beca' },
  { value: TipoApoyo.Credito, label: 'Crédito' },
  { value: TipoApoyo.Subsidio, label: 'Subsidio' },
] as const;

export const ESTADOS_SOLICITUD = [
  { value: EstadoSolicitud.Pendiente, label: 'Pendiente' },
  { value: EstadoSolicitud.EnRevision, label: 'En revisión' },
  { value: EstadoSolicitud.Aprobada, label: 'Aprobada' },
  { value: EstadoSolicitud.Rechazada, label: 'Rechazada' },
] as const;

export function nombreTipoDocumento(tipo: TipoDocumento): string {
  return TIPOS_DOCUMENTO.find((item) => item.value === tipo)?.label ?? 'Sin definir';
}

export function nombreTipoApoyo(tipo: TipoApoyo): string {
  return TIPOS_APOYO.find((item) => item.value === tipo)?.label ?? 'Sin definir';
}

export function nombreEstadoSolicitud(estado: EstadoSolicitud): string {
  return ESTADOS_SOLICITUD.find((item) => item.value === estado)?.label ?? 'Sin definir';
}

export function claseEstadoSolicitud(estado: EstadoSolicitud): string {
  switch (estado) {
    case EstadoSolicitud.Pendiente:
      return 'status status--pending';
    case EstadoSolicitud.EnRevision:
      return 'status status--review';
    case EstadoSolicitud.Aprobada:
      return 'status status--approved';
    case EstadoSolicitud.Rechazada:
      return 'status status--rejected';
  }
}
