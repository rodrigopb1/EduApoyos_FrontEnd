import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { ROLES } from '../../../../core/auth/auth.models';
import { obtenerMensajeError } from '../../../../core/http/api-error';
import {
  claseEstadoSolicitud,
  nombreEstadoSolicitud,
  nombreTipoApoyo,
} from '../../../../shared/models/catalogs';
import { StudentApiService } from '../../../students/data-access/student-api.service';
import { EstudianteResponse } from '../../../students/data-access/student.models';
import { RequestApiService } from '../../data-access/request-api.service';
import { SolicitudResponse } from '../../data-access/request.models';

@Component({
  selector: 'app-student-request-list',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './student-request-list.component.html',
  styleUrl: './student-request-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentRequestListComponent implements OnInit {
  private readonly api = inject(RequestApiService);
  private readonly studentApi = inject(StudentApiService);
  private readonly authService = inject(AuthService);

  readonly id = input<string>();
  readonly solicitudes = signal<SolicitudResponse[]>([]);
  readonly estudiante = signal<EstudianteResponse | null>(null);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly esAsesor = this.authService.tieneRol(ROLES.asesor);
  readonly nombreTipoApoyo = nombreTipoApoyo;
  readonly nombreEstadoSolicitud = nombreEstadoSolicitud;
  readonly claseEstadoSolicitud = claseEstadoSolicitud;

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    const estudianteId = this.id();

    if (estudianteId) {
      this.studentApi.obtener(estudianteId).subscribe({
        next: (estudiante) => this.estudiante.set(estudiante),
      });
    }

    const operacion = estudianteId
      ? this.api.listarPorEstudiante(estudianteId)
      : this.api.listarPropias();

    operacion.pipe(finalize(() => this.cargando.set(false))).subscribe({
      next: (solicitudes) => this.solicitudes.set(solicitudes),
      error: (error: unknown) => this.error.set(obtenerMensajeError(error)),
    });
  }
}
