import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { obtenerMensajeError } from '../../../../core/http/api-error';
import { TIPOS_DOCUMENTO, TipoDocumento } from '../../../../shared/models/catalogs';
import { campoInvalido, mensajeCampo } from '../../../../shared/utils/form-errors';
import { StudentApiService } from '../../data-access/student-api.service';

@Component({
  selector: 'app-student-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(StudentApiService);
  private readonly router = inject(Router);

  readonly id = input<string>();
  readonly guardando = signal(false);
  readonly cargando = signal(false);
  readonly error = signal('');
  readonly tiposDocumento = TIPOS_DOCUMENTO;
  readonly campoInvalido = campoInvalido;
  readonly mensajeCampo = mensajeCampo;

  readonly form = this.fb.nonNullable.group({
    nombreCompleto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    correoElectronico: ['', [Validators.required, Validators.email]],
    contrasena: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/),
      ],
    ],
    numeroDocumento: ['', [Validators.required, Validators.maxLength(30)]],
    tipoDocumento: [TipoDocumento.CedulaCiudadania, Validators.required],
    programaAcademico: ['', [Validators.required, Validators.maxLength(150)]],
    semestre: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
  });

  constructor() {
    queueMicrotask(() => {
      if (this.id()) {
        this.cargar(this.id()!);
      }
    });
  }

  readonly programasAcademicos = [
  'Administración de Empresas',
  'Contaduría Pública',
  'Derecho',
  'Ingeniería de Sistemas',
  'Ingeniería Industrial',
  'Psicología',
  'Trabajo Social',
  ];

  soloNumeros(event: Event): void {
  const input = event.target as HTMLInputElement;
  const valorLimpio = input.value.replace(/[^0-9]/g, '');

  input.value = valorLimpio;

  this.form.controls.numeroDocumento.setValue(valorLimpio, {
    emitEvent: false,
  });
}

  get editando(): boolean {
    return Boolean(this.id());
  }

  guardar(): void {
    if (this.form.invalid || this.guardando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.error.set('');
    this.guardando.set(true);
    const valor = this.form.getRawValue();
    if (this.editando) {
      this.api
        .actualizar(this.id()!, {
          numeroDocumento: valor.numeroDocumento,
          tipoDocumento: valor.tipoDocumento,
          programaAcademico: valor.programaAcademico,
          semestre: valor.semestre,
        })
        .pipe(finalize(() => this.guardando.set(false)))
        .subscribe({
          next: () => void this.router.navigate(['/asesor/estudiantes']),
          error: (error: unknown) => this.error.set(obtenerMensajeError(error)),
        });
      return;
    }

    this.api
      .crear(valor)
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: () => void this.router.navigate(['/asesor/estudiantes']),
        error: (error: unknown) => this.error.set(obtenerMensajeError(error)),
      });
  }

  private cargar(id: string): void {
    this.cargando.set(true);
    this.api
      .obtener(id)
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (estudiante) => {
          this.form.patchValue({
            nombreCompleto: estudiante.nombreCompleto,
            correoElectronico: estudiante.correoElectronico,
            numeroDocumento: estudiante.numeroDocumento,
            tipoDocumento: estudiante.tipoDocumento,
            programaAcademico: estudiante.programaAcademico,
            semestre: estudiante.semestre,
          });
          this.form.controls.nombreCompleto.disable();
          this.form.controls.correoElectronico.disable();
          this.form.controls.contrasena.disable();
        },
        error: (error: unknown) => this.error.set(obtenerMensajeError(error)),
      });
  }
}
