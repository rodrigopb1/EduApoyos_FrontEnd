import { AbstractControl } from '@angular/forms';

export function campoInvalido(control: AbstractControl | null): boolean {
  return Boolean(control && control.invalid && (control.dirty || control.touched));
}

export function mensajeCampo(control: AbstractControl | null, etiqueta: string): string {
  if (!control?.errors) {
    return '';
  }

  if (control.hasError('required')) {
    return `${etiqueta} es obligatorio.`;
  }

  if (control.hasError('email')) {
    return 'Ingrese un correo electrónico válido.';
  }

  if (control.hasError('minlength')) {
    return `${etiqueta} no cumple la longitud mínima.`;
  }

  if (control.hasError('maxlength')) {
    return `${etiqueta} supera la longitud permitida.`;
  }

  if (control.hasError('min') || control.hasError('max')) {
    return `${etiqueta} está fuera del rango permitido.`;
  }

  if (control.hasError('pattern')) {
    return `${etiqueta} no cumple el formato requerido.`;
  }

  return `Revise el valor de ${etiqueta.toLowerCase()}.`;
}
