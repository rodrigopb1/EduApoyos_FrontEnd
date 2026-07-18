import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ROLES } from '../auth/auth.models';

@Component({
  selector: 'app-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly sesion = this.authService.sesion;
  readonly esAsesor = computed(() => this.authService.tieneRol(ROLES.asesor));
  readonly esEstudiante = computed(() => this.authService.tieneRol(ROLES.estudiante));
  readonly iniciales = computed(() => {
    const nombre = this.sesion()?.nombreCompleto ?? '';
    return nombre
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0]?.toUpperCase())
      .join('');
  });

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    void this.router.navigate(['/acceso']);
  }
}
