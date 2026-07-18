import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ResultadoOperacion } from '../../shared/models/api.models';
import { API_BASE_URL } from '../config/api.config';
import { LoginRequest, RolSistema, SesionUsuario, TokenResponse } from './auth.models';

export interface RegistrarEstudianteRequest {
  nombreCompleto: string;
  correoElectronico: string;
  contrasena: string;
  numeroDocumento: string;
  tipoDocumento: number;
  programaAcademico: string;
  semestre: number;
}

const CLAVE_SESION = 'eduapoyos.session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly sesionState = signal<SesionUsuario | null>(this.restaurarSesion());

  readonly sesion = this.sesionState.asReadonly();
  readonly autenticado = computed(() => this.sesionState() !== null);
  readonly nombreUsuario = computed(() => this.sesionState()?.nombreCompleto ?? '');
  readonly roles = computed(() => this.sesionState()?.roles ?? []);

  iniciarSesion(request: LoginRequest, persistente: boolean): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${this.apiBaseUrl}/auth/login`, request)
      .pipe(tap((response) => this.guardarSesion(response, persistente)));
  }

  registrarEstudiante(request: RegistrarEstudianteRequest): Observable<ResultadoOperacion> {
    return this.http.post<ResultadoOperacion>(
      `${this.apiBaseUrl}/auth/register`,
      request,
    );
  }

  cerrarSesion(): void {
    this.sesionState.set(null);
    localStorage.removeItem(CLAVE_SESION);
    sessionStorage.removeItem(CLAVE_SESION);
  }

  tokenValido(): string | null {
    const sesion = this.sesionState();
    if (!sesion) {
      return null;
    }

    if (Date.parse(sesion.expiraEn) <= Date.now()) {
      this.cerrarSesion();
      return null;
    }

    return sesion.token;
  }

  tieneRol(...roles: RolSistema[]): boolean {
    return roles.some((rol) => this.roles().includes(rol));
  }

  rutaInicial(): string {
    if (this.tieneRol('Asesor')) {
      return '/';
    }

    if (this.tieneRol('Estudiante')) {
      return '/';
    }

    return '/acceso';
  }

  private guardarSesion(response: TokenResponse, persistente: boolean): void {
    const sesion: SesionUsuario = { ...response, persistente };
    const storage = persistente ? localStorage : sessionStorage;
    const otroStorage = persistente ? sessionStorage : localStorage;

    otroStorage.removeItem(CLAVE_SESION);
    storage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    this.sesionState.set(sesion);
  }

  private restaurarSesion(): SesionUsuario | null {
    const contenido = localStorage.getItem(CLAVE_SESION) ?? sessionStorage.getItem(CLAVE_SESION);
    if (!contenido) {
      return null;
    }

    try {
      const sesion = JSON.parse(contenido) as SesionUsuario;
      if (!sesion.token || Date.parse(sesion.expiraEn) <= Date.now()) {
        localStorage.removeItem(CLAVE_SESION);
        sessionStorage.removeItem(CLAVE_SESION);
        return null;
      }

      return sesion;
    } catch {
      localStorage.removeItem(CLAVE_SESION);
      sessionStorage.removeItem(CLAVE_SESION);
      return null;
    }
  }
}
