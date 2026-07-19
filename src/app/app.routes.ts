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
        path: 'asesor/solicitudes',
        canActivate: [roleGuard],
        data: { roles: [ROLES.asesor] },
        loadComponent: () =>
          import(
            './features/requests/pages/advisor-request-list/advisor-request-list.component'
          ).then((m) => m.AdvisorRequestListComponent),
      },
      {
        path: 'asesor/estudiantes',
        canActivate: [roleGuard],
        data: { roles: [ROLES.asesor] },
        loadComponent: () =>
          import('./features/students/pages/student-list/student-list.component').then(
            (m) => m.StudentListComponent,
          ),
      },
      {
        path: 'asesor/estudiantes/nuevo',
        canActivate: [roleGuard],
        data: { roles: [ROLES.asesor] },
        loadComponent: () =>
          import('./features/students/pages/student-form/student-form.component').then(
            (m) => m.StudentFormComponent,
          ),
      },
      {
        path: 'asesor/estudiantes/:id/editar',
        canActivate: [roleGuard],
        data: { roles: [ROLES.asesor] },
        loadComponent: () =>
          import('./features/students/pages/student-form/student-form.component').then(
            (m) => m.StudentFormComponent,
          ),
      },
      {
        path: 'asesor/estudiantes/:id/solicitudes',
        canActivate: [roleGuard],
        data: { roles: [ROLES.asesor] },
        loadComponent: () =>
          import(
            './features/requests/pages/student-request-list/student-request-list.component'
          ).then((m) => m.StudentRequestListComponent),
      },
      {
        path: 'asesor/asesores/nuevo',
        canActivate: [roleGuard],
        data: { roles: [ROLES.asesor] },
        loadComponent: () =>
          import('./features/advisors/pages/advisor-form/advisor-form.component').then(
            (m) => m.AdvisorFormComponent,
          ),
      },
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
      {
        path: 'asesor/estudiantes/:estudianteId/solicitudes/nueva',
        canActivate: [roleGuard],
        data: { roles: [ROLES.asesor] },
        loadComponent: () =>
          import('./features/requests/pages/request-form/request-form.component').then(
            (m) => m.RequestFormComponent,
          ),
      },
      {
        path: 'solicitudes/:id',
        canActivate: [roleGuard],
        data: { roles: [ROLES.asesor, ROLES.estudiante] },
        loadComponent: () =>
          import('./features/requests/pages/request-detail/request-detail.component').then(
            (m) => m.RequestDetailComponent,
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'inicio',
      },
      {
        path: 'inicio',
        loadComponent: () => import('./core/layout/start.component').then((m) => m.StartComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'inicio' },
];
