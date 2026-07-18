import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { obtenerMensajeError } from '../../../../core/http/api-error';
import { campoInvalido, mensajeCampo } from '../../../../shared/utils/form-errors';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly enviando = signal(false);
  readonly error = signal('');
  readonly sesionExpirada = this.route.snapshot.queryParamMap.get('sesionExpirada') === 'true';
  readonly registroExitoso = this.route.snapshot.queryParamMap.get('registrado') === 'true';

  readonly form = this.fb.nonNullable.group({
    correoElectronico: ['', [Validators.required, Validators.email]],
    contrasena: ['', Validators.required],
    persistente: [false],
  });

  readonly campoInvalido = campoInvalido;
  readonly mensajeCampo = mensajeCampo;

  constructor() {
    if (this.authService.tokenValido()) {
      void this.router.navigateByUrl(this.authService.rutaInicial());
    }
  }

  enviar(): void {
    if (this.form.invalid || this.enviando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.error.set('');
    this.enviando.set(true);
    const { correoElectronico, contrasena, persistente } = this.form.getRawValue();

    this.authService
      .iniciarSesion({ correoElectronico, contrasena }, persistente)
      .pipe(finalize(() => this.enviando.set(false)))
      .subscribe({
        next: () => {
          const retorno = this.route.snapshot.queryParamMap.get('retorno');
          void this.router.navigateByUrl(retorno || this.authService.rutaInicial());
        },
        error: (error: unknown) => this.error.set(obtenerMensajeError(error)),
      });
  }
}
