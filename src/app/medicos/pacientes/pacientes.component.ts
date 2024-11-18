import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

interface Cita {
  id: number;
  fecha: string;
  hora: string;
  medicoId: number;
  medicoNombre: string;
  medicoApellido: string;
  pacienteId: number;
  pacienteNombre: string;
  pacienteApellido: string;
  horarioDia: string;
  horarioInicio: string;
  horarioFin: string;
  especialidadId: number;
  especialidadNombre: string;
  estado: string;
}

interface Paciente {
  id: number;
  carnet: string;
  fechaNacimiento: string;
  sexo: string;
  edad: number;
  fechaInicioSeguro: string;
  fechaFinSeguro: string;
  usuario: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    rol: {
      id: number;
      nombre: string;
    };
  };
}

interface HistorialClinico {
  id: number;
  pacienteId: number;
  pacienteNombre: string;
  fechaCreacion: string;
  fechaUltimaActualizacion: string;
  notas: string | null;
  archivoUrl: string;
}

@Component({
  selector: 'app-gestionar-pacientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class GestionarPacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  filteredPacientes: Paciente[] = [];
  citas: Cita[] = [];
  medicoId: number;
  isLoading: boolean = false; // Indicador de carga

  constructor(private http: HttpClient) {
    // Obtener el ID del médico almacenado en localStorage
    this.medicoId = parseInt(localStorage.getItem('medicoId') || '0', 10);
    console.log(this.medicoId);
  }

  ngOnInit(): void {
    this.loadCitas();
  }

  loadCitas() {
    this.isLoading = true; // Inicia el estado de carga
    this.http.get<Cita[]>('http://143.198.147.110/api/citas').subscribe(
      (citas) => {
        // Filtrar las citas para obtener solo aquellas que corresponden al ID del médico actual y que tienen el estado "atendida"
        this.citas = citas.filter(cita => cita.medicoId === this.medicoId && cita.estado === 'atendida');
        // Cargar los pacientes una vez obtenidas las citas filtradas
        this.loadPacientes();
      },
      (error) => {
        this.isLoading = false; // Finaliza el estado de carga
        Swal.fire({
          title: 'Error al cargar citas',
          text: 'Por favor, inténtalo nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        console.error('Error loading citas', error);
      }
    );
  }

  loadPacientes() {
    this.http.get<Paciente[]>('http://143.198.147.110/api/pacientes').subscribe(
      (pacientes) => {
        // Filtrar los pacientes que aparecen en las citas con estado "atendida"
        const pacienteIds = new Set(this.citas.map(cita => cita.pacienteId));
        this.filteredPacientes = pacientes.filter(paciente => pacienteIds.has(paciente.id));
        this.isLoading = false; // Finaliza el estado de carga
      },
      (error) => {
        this.isLoading = false; // Finaliza el estado de carga
        Swal.fire({
          title: 'Error al cargar pacientes',
          text: 'Por favor, inténtalo nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        console.error('Error loading pacientes', error);
      }
    );
  }

  verHistorial(pacienteId: number) {
    this.isLoading = true; // Inicia el estado de carga
    this.http.get<HistorialClinico>(`http://143.198.147.110/api/historiales-clinicos/paciente/${pacienteId}`).subscribe(
      (historial) => {
        this.isLoading = false; // Finaliza el estado de carga
        // Mostrar historial en un modal
        Swal.fire({
          title: `Historial Clínico de ${historial.pacienteNombre}`,
          html: `
            <p><strong>Fecha de Creación:</strong> ${historial.fechaCreacion}</p>
            <p><strong>Última Actualización:</strong> ${historial.fechaUltimaActualizacion}</p>
            <p><strong>Notas:</strong> ${historial.notas || 'Sin notas'}</p>
            <a href="${historial.archivoUrl}" target="_blank" class="text-blue-500 underline">Ver Archivo</a>
          `,
          icon: 'info',
          confirmButtonText: 'Cerrar'
        });
      },
      (error) => {
        this.isLoading = false; // Finaliza el estado de carga
        Swal.fire({
          title: 'Error al cargar historial clínico',
          text: 'Por favor, inténtalo nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        console.error('Error loading historial clínico', error);
      }
    );
  }
}
