import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { obtenerMensajeError } from '../../../../core/http/api-error';
import { TIPOS_DOCUMENTO } from '../../../../shared/models/catalogs';
import { campoInvalido, mensajeCampo } from '../../../../shared/utils/form-errors';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly enviando = signal(false);
  readonly error = signal('');
  readonly tiposDocumento = TIPOS_DOCUMENTO;
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
    numeroDocumento: ['', [Validators.required, Validators.maxLength(30)]],
    tipoDocumento: [1, Validators.required],
    programaAcademico: ['', [Validators.required, Validators.maxLength(150)]],
    semestre: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
  });

  enviar(): void {
    if (this.form.invalid || this.enviando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.error.set('');
    this.enviando.set(true);
    this.authService
      .registrarEstudiante(this.form.getRawValue())
      .pipe(finalize(() => this.enviando.set(false)))
      .subscribe({
        next: () => void this.router.navigate(['/acceso'], { queryParams: { registrado: true } }),
        error: (error: unknown) => this.error.set(obtenerMensajeError(error)),
      });
  }
}
