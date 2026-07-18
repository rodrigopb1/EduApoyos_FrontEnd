import { HttpErrorResponse } from '@angular/common/http';
import { ProblemaApi } from '../../shared/models/api.models';

const MENSAJE_GENERICO = 'No fue posible completar la operación.';

export function obtenerMensajeError(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) {
    return MENSAJE_GENERICO;
  }

  if (error.status === 0) {
    return 'No fue posible conectar con la API. Verifique que el backend esté en ejecución.';
  }

  const contenido = error.error as ProblemaApi | string | null;

  if (typeof contenido === 'string') {
    return contenido.trim() || MENSAJE_GENERICO;
  }

  if (contenido?.errors) {
    const mensajes = Object.values(contenido.errors).flat().filter(Boolean);
    if (mensajes.length > 0) {
      return mensajes.join(' ');
    }
  }

  return contenido?.detail ?? contenido?.title ?? MENSAJE_GENERICO;
}
