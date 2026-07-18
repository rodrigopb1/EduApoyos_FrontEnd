import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';
import { ROLES } from './core/auth/auth.models';
import { AppShellComponent } from './core/layout/app-shell.component';

export const routes: Routes = [
  {
    path: 'acceso',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./features/auth/pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'estudiante/solicitudes',
        canActivate: [roleGuard],
        data: { roles: [ROLES.estudiante] },
        loadComponent: () =>
          import(
            './features/requests/pages/student-request-list/student-request-list.component'
          ).then((m) => m.StudentRequestListComponent),
      },
      {
        path: 'estudiante/solicitudes/nueva',
        canActivate: [roleGuard],
        data: { roles: [ROLES.estudiante] },
        loadComponent: () =>
          import('./features/requests/pages/request-form/request-form.component').then(
            (m) => m.RequestFormComponent,
          ),
      },
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      {
        path: 'inicio',
        loadComponent: () => import('./core/layout/start.component').then((m) => m.StartComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'inicio' },
];
