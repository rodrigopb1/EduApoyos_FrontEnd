import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { API_BASE_URL } from '../../../../core/config/api.config';
import { obtenerMensajeError } from '../../../../core/http/api-error';
import { ResultadoOperacion } from '../../../../shared/models/api.models';
import { campoInvalido, mensajeCampo } from '../../../../shared/utils/form-errors';

@Component({
  selector: 'app-advisor-form',
  imports: [ReactiveFormsModule],
  templateUrl: './advisor-form.component.html',
  styleUrl: './advisor-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvisorFormComponent {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly fb = inject(FormBuilder);

  readonly enviando = signal(false);
  readonly error = signal('');
  readonly mensaje = signal('');
  readonly campoInvalido = campoInvalido;
  readonly mensajeCampo = mensajeCampo;

  readonly form = this.fb.nonNullable.group({
    nombreCompleto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    correoElectronico: ['', [Validators.required, Validators.email]],
    contrasena: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/),
      ],
    ],
  });

  guardar(): void {
    if (this.form.invalid || this.enviando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.error.set('');
    this.mensaje.set('');
    this.enviando.set(true);

    this.http
      .post<ResultadoOperacion>(`${this.apiBaseUrl}/asesores`, this.form.getRawValue())
      .pipe(finalize(() => this.enviando.set(false)))
      .subscribe({
        next: (resultado) => {
          this.mensaje.set(resultado.mensaje);
          this.form.reset({ nombreCompleto: '', correoElectronico: '', contrasena: '' });
        },
        error: (error: unknown) => this.error.set(obtenerMensajeError(error)),
      });
  }
}
