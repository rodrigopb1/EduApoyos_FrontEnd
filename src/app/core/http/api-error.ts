import { HttpErrorResponse } from '@angular/common/http';

interface ApiProblemDetails {
  title?: string;
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

const mensajesCampos: Record<string, string> = {
  estado: 'Seleccione un estado válido.',
  observacion: 'Revise la observación ingresada.',
  nombreCompleto: 'Revise el nombre completo.',
  correoElectronico: 'Revise el correo electrónico.',
  contrasena: 'Revise la contraseña ingresada.',
  numeroDocumento: 'Revise el número de documento.',
  tipoDocumento: 'Seleccione un tipo de documento válido.',
  programaAcademico: 'Revise el programa académico.',
  semestre: 'Ingrese un semestre válido.',
};

export function obtenerMensajeError(
  error: unknown,
  mensajePredeterminado = 'No fue posible completar la operación.'
): string {
  if (!(error instanceof HttpErrorResponse)) {
    return mensajePredeterminado;
  }

  if (error.status === 0) {
    return 'No fue posible conectar con el servidor. Verifique su conexión e intente nuevamente.';
  }

  const respuesta = error.error;

  if (typeof respuesta === 'string') {
    return obtenerMensajeDesdeTexto(
      respuesta,
      error.status,
      mensajePredeterminado
    );
  }

  if (esProblemDetails(respuesta)) {
    const mensajeValidacion = obtenerMensajeValidacion(respuesta.errors);

    if (mensajeValidacion) {
      return mensajeValidacion;
    }

    if (respuesta.detail && !esMensajeTecnico(respuesta.detail)) {
      return traducirMensaje(respuesta.detail);
    }

    if (respuesta.message && !esMensajeTecnico(respuesta.message)) {
      return traducirMensaje(respuesta.message);
    }

    if (respuesta.title && !esMensajeTecnico(respuesta.title)) {
      return traducirMensaje(respuesta.title);
    }
  }

  return obtenerMensajePorEstado(error.status, mensajePredeterminado);
}

function esProblemDetails(valor: unknown): valor is ApiProblemDetails {
  return typeof valor === 'object' && valor !== null;
}

function obtenerMensajeValidacion(
  errores?: Record<string, string[]>
): string | null {
  if (!errores) {
    return null;
  }

  /*
   * Primero se buscan errores asociados a campos concretos.
   * Se evita mostrar inicialmente el mensaje genérico:
   * "The request field is required."
   */
  for (const [campoOriginal] of Object.entries(errores)) {
    const campo = normalizarCampo(campoOriginal);

    if (campo !== 'request' && mensajesCampos[campo]) {
      return mensajesCampos[campo];
    }
  }

  for (const [campoOriginal, mensajes] of Object.entries(errores)) {
    const campo = normalizarCampo(campoOriginal);

    if (campo === 'request') {
      continue;
    }

    for (const mensaje of mensajes) {
      const mensajeTraducido = traducirMensajeValidacion(mensaje);

      if (mensajeTraducido) {
        return mensajeTraducido;
      }
    }
  }

  return 'La información enviada no es válida. Revise los campos e intente nuevamente.';
}

function normalizarCampo(campo: string): string {
  return campo
    .replace(/^\$\./, '')
    .replace(/^request\./i, '')
    .trim();
}

function traducirMensajeValidacion(mensaje: string): string | null {
  const texto = mensaje.toLowerCase();

  if (
    texto.includes('json value could not be converted') &&
    texto.includes('estado')
  ) {
    return 'Seleccione un estado válido.';
  }

  if (texto.includes('json value could not be converted')) {
    return 'Uno de los valores enviados no tiene el formato correcto.';
  }

  if (texto.includes('field is required')) {
    return 'Complete todos los campos obligatorios.';
  }

  if (texto.includes('minimum length')) {
    return 'Uno de los campos no cumple con la longitud mínima.';
  }

  if (texto.includes('maximum length')) {
    return 'Uno de los campos supera la longitud permitida.';
  }

  if (esMensajeTecnico(mensaje)) {
    return null;
  }

  return traducirMensaje(mensaje);
}

function obtenerMensajeDesdeTexto(
  mensaje: string,
  estadoHttp: number,
  mensajePredeterminado: string
): string {
  if (esMensajeTecnico(mensaje)) {
    return obtenerMensajePorEstado(estadoHttp, mensajePredeterminado);
  }

  return traducirMensaje(mensaje);
}

function traducirMensaje(mensaje: string): string {
  const texto = mensaje.toLowerCase();

  if (texto.includes('one or more validation errors occurred')) {
    return 'La información enviada contiene errores.';
  }

  if (texto.includes('the request field is required')) {
    return 'Complete todos los campos obligatorios.';
  }

  if (texto.includes('not found')) {
    return 'No se encontró la información solicitada.';
  }

  if (texto.includes('unauthorized')) {
    return 'Debe iniciar sesión nuevamente.';
  }

  if (texto.includes('forbidden')) {
    return 'No tiene permisos para realizar esta operación.';
  }

  return mensaje;
}

function esMensajeTecnico(mensaje: string): boolean {
  const texto = mensaje.toLowerCase();

  return (
    texto.includes('json value could not be converted') ||
    texto.includes('linenumber') ||
    texto.includes('bytepositioninline') ||
    texto.includes('system.') ||
    texto.includes('edapoyos.domain') ||
    texto.includes('path: $.') ||
    texto.includes('traceid')
  );
}

function obtenerMensajePorEstado(
  estadoHttp: number,
  mensajePredeterminado: string
): string {
  switch (estadoHttp) {
    case 400:
      return 'La información enviada no es válida. Revise los datos e intente nuevamente.';

    case 401:
      return 'Su sesión expiró. Inicie sesión nuevamente.';

    case 403:
      return 'No tiene permisos para realizar esta operación.';

    case 404:
      return 'No se encontró la información solicitada.';

    case 409:
      return 'La operación no puede realizarse debido al estado actual del registro.';

    case 500:
      return 'Ocurrió un error interno en el servidor. Intente nuevamente más tarde.';

    default:
      return mensajePredeterminado;
  }
}