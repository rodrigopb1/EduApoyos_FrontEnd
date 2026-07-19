import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { ROLES } from '../../../../core/auth/auth.models';
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
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly estudianteId = input<string>();
  readonly guardando = signal(false);
  readonly error = signal('');
  readonly tiposApoyo = TIPOS_APOYO;
  readonly esAsesor = this.authService.tieneRol(ROLES.asesor);
  readonly campoInvalido = campoInvalido;
  readonly mensajeCampo = mensajeCampo;

  readonly form = this.fb.nonNullable.group({
    tipoApoyo: [TipoApoyo.Beca, Validators.required],
    montoSolicitado: [0, [Validators.required, Validators.min(1), Validators.max(500000000)]],
    justificacion: [
      '',
      [Validators.required, Validators.minLength(20), Validators.maxLength(2000)],
    ],
  });

  guardar(): void {
    if (this.form.invalid || this.guardando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.error.set('');
    this.guardando.set(true);
    this.api
      .crear({
        estudianteId: this.estudianteId() || null,
        ...this.form.getRawValue(),
      })
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: (resultado) => void this.router.navigate(['/solicitudes', resultado.id]),
        error: (error: unknown) => this.error.set(obtenerMensajeError(error)),
      });
  }

  rutaCancelar(): string {
    return this.esAsesor && this.estudianteId()
      ? `/asesor/estudiantes/${this.estudianteId()}/solicitudes`
      : '/estudiante/solicitudes';
  }
}
