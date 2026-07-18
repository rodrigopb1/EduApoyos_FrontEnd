import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { obtenerMensajeError } from '../../../../core/http/api-error';
import {
  claseEstadoSolicitud,
  nombreEstadoSolicitud,
  nombreTipoApoyo,
} from '../../../../shared/models/catalogs';
import { RequestApiService } from '../../data-access/request-api.service';
import { SolicitudResponse } from '../../data-access/request.models';

@Component({
  selector: 'app-student-request-list',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './student-request-list.component.html',
  styleUrl: './student-request-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentRequestListComponent {
  private readonly api = inject(RequestApiService);

  readonly solicitudes = signal<SolicitudResponse[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly nombreTipoApoyo = nombreTipoApoyo;
  readonly nombreEstadoSolicitud = nombreEstadoSolicitud;
  readonly claseEstadoSolicitud = claseEstadoSolicitud;

  constructor() {
    this.api
      .listarPropias()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (solicitudes) => this.solicitudes.set(solicitudes),
        error: (error: unknown) => this.error.set(obtenerMensajeError(error)),
      });
  }
}
