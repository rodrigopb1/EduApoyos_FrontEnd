import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { obtenerMensajeError } from '../../../../core/http/api-error';
import {
  claseEstadoSolicitud,
  nombreEstadoSolicitud,
  nombreTipoApoyo,
} from '../../../../shared/models/catalogs';
import { RequestApiService } from '../../data-access/request-api.service';
import { SolicitudDetalleResponse } from '../../data-access/request.models';

@Component({
  selector: 'app-request-detail',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './request-detail.component.html',
  styleUrl: './request-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestDetailComponent implements OnInit {
  private readonly api = inject(RequestApiService);

  readonly id = input.required<string>();
  readonly solicitud = signal<SolicitudDetalleResponse | null>(null);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly nombreEstadoSolicitud = nombreEstadoSolicitud;
  readonly nombreTipoApoyo = nombreTipoApoyo;
  readonly claseEstadoSolicitud = claseEstadoSolicitud;

  ngOnInit(): void {
    this.api
      .obtener(this.id())
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (solicitud) => this.solicitud.set(solicitud),
        error: (error: unknown) => this.error.set(obtenerMensajeError(error)),
      });
  }
}
