import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface Medico {
  id: number;
  nombre: string;
  apellido: string;
  especialidadesIds: number[];
}

interface Especialidad {
  id: number;
  nombre: string;
  descripcion: string;
}

interface HorarioDTO {
  id: number;
  dia: string;
  horaInicio: string;
  horaFin: string;
  medicoId: number;
}

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css']
})
export class HorariosComponent implements OnInit {
  isLoading: boolean = false;
  medicos: Medico[] = [];
  especialidades: Especialidad[] = [];
  horariosPorMedico: { [medicoId: number]: HorarioDTO[] } = {};
  selectedHorario: HorarioDTO = {
    id: 0,
    dia: '',
    horaInicio: '',
    horaFin: '',
    medicoId: 0
  };
  selectedMedicoId: number | null = null;
  isEditMode = false;
  showModal = false;
  selectedForDeletion: Set<number> = new Set();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMedicos();
    this.loadEspecialidades();
  }

  loadMedicos() {
    this.isLoading = true;
    this.http.get<Medico[]>('http://143.198.147.110/api/medicos').subscribe(
      data => {
        this.medicos = data;
        this.loadHorariosForMedicos();
      },
      error => {
        this.isLoading = false;
        console.error('Error loading medicos', error); }
    );
  }

  loadEspecialidades() {
    this.http.get<Especialidad[]>('http://143.198.147.110/api/especialidades').subscribe(
      data => { this.especialidades = data;
        this.isLoading = false;},
      error => { this.isLoading=false;
    console.error('Error loading especialidades', error); }
    );
  }

  loadHorariosForMedicos() {
    this.medicos.forEach(medico => {
      this.http.get<HorarioDTO[]>(`http://143.198.147.110/api/horarios/medico/${medico.id}`).subscribe(
        horarios => {
          this.horariosPorMedico[medico.id] = horarios;
        },
        error => {
          this.isLoading=false;
          console.error(`Error loading horarios for medico ${medico.id}`, error); }
      );
    });
  }

  getEspecialidadNombre(id: number): string {
    const especialidad = this.especialidades.find(e => e.id === id);
    return especialidad ? especialidad.nombre : '';
  }

  openAddHorarioModal() {
    this.selectedHorario = {
      id: 0,
      dia: '',
      horaInicio: '',
      horaFin: '',
      medicoId: this.selectedMedicoId || 0
    };
    this.isEditMode = false;
    this.showModal = true;
  }

  editHorario(horario: HorarioDTO) {
    this.selectedHorario = { ...horario };
    this.isEditMode = true;
    this.showModal = true;
  }

  deleteSelectedHorarios() {
    Swal.fire({
      title: '¿Eliminar horarios seleccionados?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        const deleteRequests = Array.from(this.selectedForDeletion).map(horarioId =>
          this.http.delete(`http://143.198.147.110/api/horarios/${horarioId}`).toPromise()
        );
        Promise.all(deleteRequests).then(() => {
          Swal.fire('Eliminado', 'Los horarios seleccionados fueron eliminados correctamente.', 'success');
          this.loadHorariosForMedicos();
          this.selectedForDeletion.clear();
        }).catch(error => {
          console.error('Error deleting horarios', error);
          Swal.fire('Error', 'Hubo un error al eliminar los horarios.', 'error');
        });
      }
    });
  }

  toggleDeleteSelection(horarioId: number) {
    if (this.selectedForDeletion.has(horarioId)) {
      this.selectedForDeletion.delete(horarioId);
    } else {
      this.selectedForDeletion.add(horarioId);
    }
  }

  saveHorario() {
    if (!this.selectedMedicoId) {
      Swal.fire('Error', 'Debe seleccionar un médico.', 'error');
      return;
    }

    this.selectedHorario.medicoId = this.selectedMedicoId;

    const url = this.isEditMode
      ? `http://143.198.147.110/api/horarios/${this.selectedHorario.id}`
      : `http://143.198.147.110/api/horarios/medico/${this.selectedMedicoId}`;

    const request = this.isEditMode
      ? this.http.put<HorarioDTO>(url, this.selectedHorario)
      : this.http.post<HorarioDTO>(url, this.selectedHorario);

    request.subscribe(
      () => {
        this.loadHorariosForMedicos();
        this.showModal = false;
        Swal.fire(
          this.isEditMode ? 'Actualizado' : 'Creado',
          `El horario ha sido ${this.isEditMode ? 'actualizado' : 'creado'} correctamente.`,
          'success'
        );
      },
      error => {
        console.error('Error saving horario', error);
        Swal.fire('Error', 'Hubo un error al guardar el horario.', 'error');
      }
    );
  }

  closeModal() {
    this.showModal = false;
  }
}
