import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-start',
  template: `
    <section class="card">
      <p class="eyebrow">EduApoyos</p>
      <h1>Bienvenido, {{ authService.nombreUsuario() }}</h1>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartComponent {
  readonly authService = inject(AuthService);
}
