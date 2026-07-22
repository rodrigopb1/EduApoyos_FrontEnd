import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api.config';
import { ResultadoPaginado } from '../../../shared/models/api.models';
import {
  CambiarEstadoRequest,
  CrearSolicitudRequest,
  SolicitudDetalleResponse,
  SolicitudFiltro,
  SolicitudResponse,
} from './request.models';

@Injectable({ providedIn: 'root' })
export class RequestApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  listar(filtro: SolicitudFiltro): Observable<ResultadoPaginado<SolicitudResponse>> {
    let params = new HttpParams()
      .set('pagina', filtro.pagina)
      .set('tamanoPagina', filtro.tamanoPagina);

    if (filtro.estado) {
      params = params.set('estado', filtro.estado);
    }
    if (filtro.tipoApoyo) {
      params = params.set('tipoApoyo', filtro.tipoApoyo);
    }
    if (filtro.estudianteId) {
      params = params.set('estudianteId', filtro.estudianteId);
    }

    return this.http.get<ResultadoPaginado<SolicitudResponse>>(`${this.apiBaseUrl}/solicitudes`, {
      params,
    });
  }

  listarPropias(): Observable<SolicitudResponse[]> {
    return this.http.get<SolicitudResponse[]>(`${this.apiBaseUrl}/portalEstudiante/solicitudes`);
  }

  listarPorEstudiante(estudianteId: string): Observable<SolicitudResponse[]> {
    return this.http.get<SolicitudResponse[]>(
      `${this.apiBaseUrl}/estudiantes/${estudianteId}/solicitudes`,
    );
  }

  obtener(id: string): Observable<SolicitudDetalleResponse> {
    return this.http.get<SolicitudDetalleResponse>(`${this.apiBaseUrl}/solicitudes/${id}`);
  }

  crear(request: CrearSolicitudRequest): Observable<{ id: string; mensaje: string }> {
    return this.http.post<{ id: string; mensaje: string }>(
      `${this.apiBaseUrl}/solicitudes`,
      request,
    );
  }

  cambiarEstado(id: string, request: CambiarEstadoRequest): Observable<void> {
    return this.http.patch<void>(`${this.apiBaseUrl}/solicitudes/${id}/estado`, request);
  }

  descargarConstancia(id: string, formato: 'texto' | 'html'): Observable<Blob> {
    return this.http.get(`${this.apiBaseUrl}/solicitudes/${id}/constancia`, {
      params: { formato },
      responseType: 'blob',
    });
  }
}
