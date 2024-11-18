import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface Medico {
  id: number;
  ci: string;
  nombre: string;
  apellido: string;
  email: string;
  especialidadesIds: number[];
  telefonoConsultorio: string;
  numeroLicencia: string;
  disponibilidad: boolean;
}

interface Especialidad {
  id: number;
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-medicos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css']
})
export class MedicosComponent implements OnInit {
  isLoading: boolean = false;
  medicos: Medico[] = [];
  especialidades: Especialidad[] = [];
  selectedMedico: Medico = {
    id: 0,
    ci: '',
    nombre: '',
    apellido: '',
    email: '',
    especialidadesIds: [],
    telefonoConsultorio: '',
    numeroLicencia: '',
    disponibilidad: true
  };
  especialidadesIds: number[] = [];
  showModal = false;
  isEditMode = false;

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
        this.isLoading = false;
        },
      error => {
        this.isLoading = false;
        this.handleHttpError(error);
        }
    );
  }

  loadEspecialidades() {
    this.isLoading = true;
    this.http.get<Especialidad[]>('http://143.198.147.110/api/especialidades').subscribe(
      data => { this.especialidades = data;
        this.isLoading = false;},
      error => {
        this.isLoading = false;
        this.handleHttpError(error);}
    );
  }

  getEspecialidadNombre(id: number): string {
    const especialidad = this.especialidades.find(e => e.id === id);
    return especialidad ? especialidad.nombre : '';
  }

  addMedico() {
    this.selectedMedico = {
      id: 0,
      ci: '',
      nombre: '',
      apellido: '',
      email: '',
      especialidadesIds: [],
      telefonoConsultorio: '',
      numeroLicencia: '',
      disponibilidad: true
    };
    this.especialidadesIds = [];
    this.isEditMode = false;
    this.showModal = true;
  }

  editMedico(medicoId: number) {
    const medico = this.medicos.find(m => m.id === medicoId);
    if (medico) {
      this.selectedMedico = { ...medico };
      this.especialidadesIds = medico.especialidadesIds;
      this.isEditMode = true;
      this.showModal = true;
    }
  }

  deleteMedico(medicoId: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://143.198.147.110/api/medicos/${medicoId}`).subscribe(
          () => {
            Swal.fire('Eliminado', 'El médico ha sido eliminado correctamente.', 'success');
            this.loadMedicos();
          },
          error => { this.handleHttpError(error); }
        );
      }
    });
  }

  saveMedico() {
    const payload = {
      ci: this.selectedMedico.ci,
      nombre: this.selectedMedico.nombre,
      apellido: this.selectedMedico.apellido,
      email: this.selectedMedico.email,
      telefonoConsultorio: this.selectedMedico.telefonoConsultorio,
      numeroLicencia: this.selectedMedico.numeroLicencia,
      disponibilidad: this.selectedMedico.disponibilidad,
      especialidadesIds: this.especialidadesIds
    };

    const url = this.isEditMode
      ? `http://143.198.147.110/api/medicos/${this.selectedMedico.id}`
      : 'http://143.198.147.110/api/medicos';

    const request = this.isEditMode
      ? this.http.put(url, payload)
      : this.http.post(url, payload);

    request.subscribe(
      () => {
        Swal.fire('Guardado', `Médico ${this.isEditMode ? 'actualizado' : 'creado'} correctamente.`, 'success');
        this.loadMedicos();
        this.showModal = false;
      },
      error => { this.handleHttpError(error); }
    );
  }

  toggleEspecialidadSelection(especialidadId: number) {
    const index = this.especialidadesIds.indexOf(especialidadId);
    if (index === -1) {
      this.especialidadesIds.push(especialidadId);
    } else {
      this.especialidadesIds.splice(index, 1);
    }
  }

  closeModal() {
    this.showModal = false;
  }

  private handleHttpError(error: any): void {
    if (error.status === 401) {
      Swal.fire({
        title: 'Sesión expirada',
        text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false // Evita que se cierre al hacer clic fuera
      }).then((result) => {
        if (result.isConfirmed) {
          // Solo redirige si el usuario presionó "Aceptar"
          localStorage.clear(); // Limpia los datos del almacenamiento local
          window.location.href = '/login'; // Redirige al login
        }
      });
    } else {
      Swal.fire('Error', 'Ha ocurrido un error. Inténtalo nuevamente.', 'error');
      console.error('HTTP Error:', error);
    }
  }


}
