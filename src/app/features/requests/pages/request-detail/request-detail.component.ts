import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { ROLES } from '../../../../core/auth/auth.models';
import { obtenerMensajeError } from '../../../../core/http/api-error';
import {
  claseEstadoSolicitud,
  EstadoSolicitud,
  nombreEstadoSolicitud,
  nombreTipoApoyo,
} from '../../../../shared/models/catalogs';
import { campoInvalido, mensajeCampo } from '../../../../shared/utils/form-errors';
import { RequestApiService } from '../../data-access/request-api.service';
import { SolicitudDetalleResponse } from '../../data-access/request.models';

@Component({
  selector: 'app-request-detail',
  imports: [CurrencyPipe, DatePipe, ReactiveFormsModule],
  templateUrl: './request-detail.component.html',
  styleUrl: './request-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestDetailComponent implements OnInit {
  private readonly api = inject(RequestApiService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly id = input.required<string>();
  readonly solicitud = signal<SolicitudDetalleResponse | null>(null);
  readonly cargando = signal(true);
  readonly guardandoEstado = signal(false);
  readonly descargando = signal(false);
  readonly error = signal('');
  readonly mensaje = signal('');
  readonly esAsesor = this.authService.tieneRol(ROLES.asesor);
  readonly nombreEstadoSolicitud = nombreEstadoSolicitud;
  readonly nombreTipoApoyo = nombreTipoApoyo;
  readonly claseEstadoSolicitud = claseEstadoSolicitud;
  readonly campoInvalido = campoInvalido;
  readonly mensajeCampo = mensajeCampo;

  readonly estadosDisponibles = computed(() => {
    switch (this.solicitud()?.estado) {
      case EstadoSolicitud.Pendiente:
        return [{ value: EstadoSolicitud.EnRevision, label: 'En revisión' }];
      case EstadoSolicitud.EnRevision:
        return [
          { value: EstadoSolicitud.Aprobada, label: 'Aprobada' },
          { value: EstadoSolicitud.Rechazada, label: 'Rechazada' },
        ];
      default:
        return [];
    }
  });

  readonly estadoForm = this.fb.nonNullable.group({
    estado: [EstadoSolicitud.EnRevision, Validators.required],
    observacion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]],
  });

  ngOnInit(): void {
    this.cargar();
  }

  cambiarEstado(): void {
    if (this.estadoForm.invalid || this.guardandoEstado()) {
      this.estadoForm.markAllAsTouched();
      return;
    }

    this.error.set('');
    this.mensaje.set('');
    this.guardandoEstado.set(true);
    this.api
      .cambiarEstado(this.id(), this.estadoForm.getRawValue())
      .pipe(finalize(() => this.guardandoEstado.set(false)))
      .subscribe({
        next: () => {
          this.mensaje.set('El estado fue actualizado correctamente.');
          this.estadoForm.controls.observacion.reset('');
          this.cargar();
        },
        error: (error: unknown) => this.error.set(obtenerMensajeError(error)),
      });
  }

  descargar(formato: 'texto' | 'html'): void {
    if (this.descargando()) {
      return;
    }

    this.descargando.set(true);
    this.error.set('');
    this.api
      .descargarConstancia(this.id(), formato)
      .pipe(finalize(() => this.descargando.set(false)))
      .subscribe({
        next: (archivo) => {
          const enlace = document.createElement('a');
          enlace.href = URL.createObjectURL(archivo);
          enlace.download = `constancia-${this.id()}.${formato === 'html' ? 'html' : 'txt'}`;
          enlace.click();
          URL.revokeObjectURL(enlace.href);
        },
        error: (error: unknown) => this.error.set(obtenerMensajeError(error)),
      });
  }

  private cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    this.api
      .obtener(this.id())
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (solicitud) => {
          this.solicitud.set(solicitud);
          const primerEstado = this.estadosDisponibles()[0]?.value;
          if (primerEstado) {
            this.estadoForm.controls.estado.setValue(primerEstado);
          }
        },
        error: (error: unknown) => this.error.set(obtenerMensajeError(error)),
      });
  }
}
