import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { obtenerMensajeError } from '../../../../core/http/api-error';
import { nombreTipoDocumento } from '../../../../shared/models/catalogs';
import { StudentApiService } from '../../data-access/student-api.service';
import { EstudianteResponse } from '../../data-access/student.models';

@Component({
  selector: 'app-student-list',
  imports: [RouterLink],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentListComponent {
  private readonly api = inject(StudentApiService);

  readonly estudiantes = signal<EstudianteResponse[]>([]);
  readonly filtro = signal('');
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly nombreTipoDocumento = nombreTipoDocumento;

  readonly estudiantesFiltrados = computed(() => {
    const texto = this.filtro().trim().toLocaleLowerCase('es');
    if (!texto) {
      return this.estudiantes();
    }

    return this.estudiantes().filter((estudiante) =>
      [
        estudiante.nombreCompleto,
        estudiante.correoElectronico,
        estudiante.numeroDocumento,
        estudiante.programaAcademico,
      ].some((valor) => valor.toLocaleLowerCase('es').includes(texto)),
    );
  });

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    this.api
      .listar()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (estudiantes) => this.estudiantes.set(estudiantes),
        error: (error: unknown) => this.error.set(obtenerMensajeError(error)),
      });
  }

  actualizarFiltro(event: Event): void {
    this.filtro.set((event.target as HTMLInputElement).value);
  }

  desactivar(estudiante: EstudianteResponse): void {
    if (!estudiante.activo || !confirm(`¿Desea desactivar a ${estudiante.nombreCompleto}?`)) {
      return;
    }

    this.api.desactivar(estudiante.id).subscribe({
      next: () =>
        this.estudiantes.update((items) =>
          items.map((item) => (item.id === estudiante.id ? { ...item, activo: false } : item)),
        ),
      error: (error: unknown) => this.error.set(obtenerMensajeError(error)),
    });
  }

activar(estudiante: EstudianteResponse): void {
  if (estudiante.activo || !confirm(`¿Desea activar nuevamente a ${estudiante.nombreCompleto}?`)) {
    return;
  }

  this.api.activar(estudiante.id).subscribe({
    next: () =>
      this.estudiantes.update((items) =>
        items.map((item) =>
          item.id === estudiante.id
            ? { ...item, activo: true }
            : item
        ),
      ),
    error: (error: unknown) =>
      this.error.set(obtenerMensajeError(error)),
  });
}

}
