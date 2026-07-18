import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { RolSistema } from './auth.models';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const roles = (route.data['roles'] as RolSistema[] | undefined) ?? [];

  if (roles.length === 0 || roles.some((rol) => authService.tieneRol(rol))) {
    return true;
  }

  return router.createUrlTree([authService.rutaInicial()]);
};
