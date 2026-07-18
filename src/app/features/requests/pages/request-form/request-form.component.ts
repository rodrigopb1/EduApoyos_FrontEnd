import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { obtenerMensajeError } from '../../../../core/http/api-error';
import { TIPOS_APOYO, TipoApoyo } from '../../../../shared/models/catalogs';
import { campoInvalido, mensajeCampo } from '../../../../shared/utils/form-errors';
import { RequestApiService } from '../../data-access/request-api.service';

@Component({
  selector: 'app-request-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './request-form.component.html',
  styleUrl: './request-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(RequestApiService);
  private readonly router = inject(Router);

  readonly guardando = signal(false);
  readonly error = signal('');
  readonly exito = signal('');

  readonly tiposApoyo = TIPOS_APOYO;
  readonly campoInvalido = campoInvalido;
  readonly mensajeCampo = mensajeCampo;

  readonly form = this.fb.nonNullable.group({
    tipoApoyo: [
      TipoApoyo.Beca,
      Validators.required,
    ],
    montoSolicitado: [
      0,
      [
        Validators.required,
        Validators.min(1),
        Validators.max(500000000),
      ],
    ],
    justificacion: [
      '',
      [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(2000),
      ],
    ],
  });

  guardar(): void {
    if (this.form.invalid || this.guardando()) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();

    const solicitud = {
      estudianteId: null,
      tipoApoyo: Number(valores.tipoApoyo) as TipoApoyo,
      montoSolicitado: Number(valores.montoSolicitado),
      justificacion: valores.justificacion.trim(),
    };

    this.error.set('');
    this.exito.set('');
    this.guardando.set(true);

    this.api
      .crear(solicitud)
      .pipe(
        finalize(() => this.guardando.set(false)),
      )
      .subscribe({
        next: () => {
          this.exito.set(
            'La solicitud fue creada correctamente.',
          );

          this.form.disable();

          window.setTimeout(() => {
            void this.router.navigate([
              '/estudiante/solicitudes',
            ]);
          }, 1500);
        },
        error: (error: unknown) => {
          this.exito.set('');
          this.error.set(
            obtenerMensajeError(error),
          );
        },
      });
  }
}