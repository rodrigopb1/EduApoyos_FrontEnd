import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { obtenerMensajeError } from '../../../../core/http/api-error';
import {
  claseEstadoSolicitud,
  ESTADOS_SOLICITUD,
  nombreEstadoSolicitud,
  nombreTipoApoyo,
  TIPOS_APOYO,
} from '../../../../shared/models/catalogs';
import { ResultadoPaginado } from '../../../../shared/models/api.models';
import { RequestApiService } from '../../data-access/request-api.service';
import { SolicitudResponse } from '../../data-access/request.models';

@Component({
  selector: 'app-advisor-request-list',
  imports: [CurrencyPipe, DatePipe, ReactiveFormsModule, RouterLink],
  templateUrl: './advisor-request-list.component.html',
  styleUrl: './advisor-request-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvisorRequestListComponent {
  private readonly api = inject(RequestApiService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly resultado = signal<ResultadoPaginado<SolicitudResponse> | null>(null);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly estados = ESTADOS_SOLICITUD;
  readonly tiposApoyo = TIPOS_APOYO;
  readonly nombreEstadoSolicitud = nombreEstadoSolicitud;
  readonly nombreTipoApoyo = nombreTipoApoyo;
  readonly claseEstadoSolicitud = claseEstadoSolicitud;

  readonly filtros = this.fb.group({
    estado: this.fb.control<number | null>(null),
    tipoApoyo: this.fb.control<number | null>(null),
  });

  private pagina = 1;
  private readonly tamanoPagina = 10;

  constructor() {
    this.cargar();

    this.filtros.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.buscar());
  }

  buscar(): void {
    this.pagina = 1;
    this.cargar();
  }

  limpiar(): void {
    this.filtros.reset({ estado: null, tipoApoyo: null });
  }

  cambiarPagina(pagina: number): void {
    const totalPaginas = this.resultado()?.totalPaginas ?? 1;
    if (pagina < 1 || pagina > totalPaginas || pagina === this.pagina) {
      return;
    }

    this.pagina = pagina;
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    const { estado, tipoApoyo } = this.filtros.getRawValue();

    this.api
      .listar({
        estado: estado || null,
        tipoApoyo: tipoApoyo || null,
        pagina: this.pagina,
        tamanoPagina: this.tamanoPagina,
      })
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (resultado) => this.resultado.set(resultado),
        error: (error: unknown) => this.error.set(obtenerMensajeError(error)),
      });
  }
}