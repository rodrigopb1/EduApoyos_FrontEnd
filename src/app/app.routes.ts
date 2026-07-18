import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'acceso',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then((m) => m.LoginComponent),
  },
  { path: '', pathMatch: 'full', redirectTo: 'acceso' },
  { path: '**', redirectTo: 'acceso' },
];
