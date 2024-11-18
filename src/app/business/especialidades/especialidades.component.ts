import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

interface Especialidad {
  id: number;
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './especialidades.component.html',
  styleUrls: ['./especialidades.component.css']
})
export class EspecialidadesComponent implements OnInit {
  isLoading: boolean = false;
  especialidades: Especialidad[] = [];
  selectedEspecialidad: Especialidad = { id: 0, nombre: '', descripcion: '' };
  showModal = false;
  isEditMode = false;
  toastMessage: string | null = null;
  toastClass: string = '';
  showToastModal = false; // Nueva variable para controlar la visibilidad del Toast

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadEspecialidades();
  }

  loadEspecialidades() {
    this.isLoading = true;
    this.http.get<Especialidad[]>('http://143.198.147.110/api/especialidades').subscribe(
      data => {
        this.especialidades = data;
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        console.error('Error loading especialidades', error);
      }
    );
  }

  addEspecialidad() {
    this.selectedEspecialidad = { id: 0, nombre: '', descripcion: '' };
    this.isEditMode = false;
    this.showModal = true;
  }

  editEspecialidad(especialidadId: number) {
    this.selectedEspecialidad = this.especialidades.find(e => e.id === especialidadId) || this.selectedEspecialidad;
    this.isEditMode = true;
    this.showModal = true;
  }

  deleteEspecialidad(especialidadId: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://143.198.147.110/api/especialidades/${especialidadId}`).subscribe(
          () => {
            Swal.fire({
              title: 'Eliminado con éxito',
              text: 'La especialidad ha sido eliminada correctamente.',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000 // El mensaje se cierra automáticamente después de 2 segundos
            });
            this.loadEspecialidades();
          },
          error => {
            Swal.fire({
              title: 'Error al eliminar la especialidad',
              text: 'Por favor, inténtalo nuevamente.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
            console.error('Error deleting especialidad', error);
          }
        );
      }
    });
  }



  saveEspecialidad() {
    const url = this.isEditMode
      ? `http://143.198.147.110/api/especialidades/${this.selectedEspecialidad.id}`
      : 'http://143.198.147.110/api/especialidades';

    const request = this.isEditMode
      ? this.http.put<Especialidad>(url, this.selectedEspecialidad)
      : this.http.post<Especialidad>(url, this.selectedEspecialidad);

    request.subscribe(
      () => {
        Swal.fire({
          title: `Especialidad ${this.isEditMode ? 'actualizada' : 'creada'} con éxito`,
          icon: 'success',
          showConfirmButton: false,
          timer: 2000 // El mensaje se cierra automáticamente después de 2 segundos
        });
        this.loadEspecialidades();
        this.showModal = false;
      },
      error => {
        Swal.fire({
          title: `Error al ${this.isEditMode ? 'actualizar' : 'crear'} la especialidad`,
          text: 'Por favor, inténtalo nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        console.error('Error saving especialidad', error);
      }
    );
  }


  closeModal() {
    this.showModal = false;
  }
}
