import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api.config';
import {
  ActualizarEstudianteRequest,
  CrearEstudianteRequest,
  EstudianteResponse,
} from './student.models';

@Injectable({ providedIn: 'root' })
export class StudentApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  listar(): Observable<EstudianteResponse[]> {
    return this.http.get<EstudianteResponse[]>(`${this.apiBaseUrl}/estudiantes`);
  }

  obtener(id: string): Observable<EstudianteResponse> {
    return this.http.get<EstudianteResponse>(`${this.apiBaseUrl}/estudiantes/${id}`);
  }

  crear(request: CrearEstudianteRequest): Observable<{ id: string; mensaje: string }> {
    return this.http.post<{ id: string; mensaje: string }>(
      `${this.apiBaseUrl}/estudiantes`,
      request,
    );
  }

  actualizar(id: string, request: ActualizarEstudianteRequest): Observable<void> {
    return this.http.put<void>(`${this.apiBaseUrl}/estudiantes/${id}`, request);
  }

  desactivar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/estudiantes/${id}`);
  }
}
