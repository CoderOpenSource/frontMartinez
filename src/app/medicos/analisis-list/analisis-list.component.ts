import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

interface Analisis {
  id: number;
  pacienteId: number;
  pacienteNombre: string;
  pacienteApellido: string;
  medicoId: number;
  medicoNombre: string;
  medicoApellido: string;
  tipoAnalisis: string;
  resultado: string;
  fechaRealizacion: string;
  archivoUrl: string;
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
    fcmToken: string;
    rol: {
      id: number;
      nombre: string;
    };
  };
}

interface Cita {
  id: number;
  fecha: string;
  hora: string;
  medicoId: number;
  pacienteId: number;
  pacienteNombre: string;
  pacienteApellido: string;
  estado: string;
  consultaCreada: boolean;
}

@Component({
  selector: 'app-analisis-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analisis-list.component.html',
  styleUrls: ['./analisis-list.component.css']
})
export class AnalisisListComponent implements OnInit {
  analisisList: Analisis[] = [];
  citasAtendidas: Cita[] = []; // Lista de citas atendidas
  pacientes: Paciente[] = []; // Lista completa de pacientes
  usuarioId: number; // ID del médico autenticado
  tiposAnalisis: string[] = [
    'Hemograma completo',
    'Prueba de glucosa',
    'Perfil lipídico',
    'Prueba de función hepática',
    'Prueba de tiroides',
    'Prueba de embarazo',
    'Uroanálisis',
    'Prueba de VIH',
    'Cultivo de sangre',
    'Panel metabólico completo'
  ];
  isLoading: boolean = false; // Control de carga

  constructor(private http: HttpClient) {
    this.usuarioId = parseInt(localStorage.getItem('medicoId') || '0', 10);
  }

  ngOnInit(): void {
    this.loadAnalisis();
    this.loadCitasAtendidas();
    this.loadPacientes();
  }

  loadAnalisis() {
    this.isLoading = true; // Activar spinner
    this.http.get<Analisis[]>(`http://143.198.147.110/api/analisis/medico/${this.usuarioId}`).subscribe(
      (analisisList) => {
        this.analisisList = analisisList;
        this.isLoading = false; // Desactivar spinner
      },
      (error) => {
        this.isLoading = false; // Desactivar spinner
        Swal.fire({
          title: 'Error al cargar análisis',
          text: 'Por favor, inténtalo nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        console.error('Error al cargar análisis', error);
      }
    );
  }

  loadCitasAtendidas() {
    this.isLoading = true; // Activar spinner
    this.http.get<Cita[]>('http://143.198.147.110/api/citas').subscribe(
      (citas) => {
        this.citasAtendidas = citas.filter(
          (cita) =>
            cita.estado === 'atendida' &&
            cita.medicoId === this.usuarioId
        );
        this.isLoading = false; // Desactivar spinner
      },
      (error) => {
        this.isLoading = false; // Desactivar spinner
        Swal.fire({
          title: 'Error al cargar citas',
          text: 'Por favor, inténtalo nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        console.error('Error al cargar citas', error);
      }
    );
  }

  loadPacientes() {
    this.isLoading = true; // Activar spinner
    this.http.get<Paciente[]>('http://143.198.147.110/api/pacientes').subscribe(
      (pacientes) => {
        // Filtrar pacientes basados en las citas atendidas
        const attendedPatientIds = new Set(this.citasAtendidas.map(cita => cita.pacienteId));
        this.pacientes = pacientes.filter(paciente => attendedPatientIds.has(paciente.id));
        this.isLoading = false; // Desactivar spinner
      },
      (error) => {
        this.isLoading = false; // Desactivar spinner
        Swal.fire({
          title: 'Error al cargar pacientes',
          text: 'Por favor, inténtalo nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        console.error('Error al cargar pacientes', error);
      }
    );
  }

  crearAnalisis() {
    Swal.fire({
      title: 'Crear Análisis',
      html: `
       <p>Selecciona un Paciente</p>
      <select id="pacienteId" class="swal2-input">
        ${this.pacientes.map(paciente => `<option value="${paciente.id}">${paciente.usuario.nombre} ${paciente.usuario.apellido}</option>`).join('')}
      </select>
      <p>Selecciona un tipo de Análisis</p>
      <select id="tipoAnalisis" class="swal2-input">
        ${this.tiposAnalisis.map(tipo => `<option value="${tipo}">${tipo}</option>`).join('')}
      </select>
      <textarea id="resultado" class="swal2-textarea" placeholder="Resultado"></textarea>
      <input id="archivoUrl" type="file" class="swal2-input">
    `,
      focusConfirm: false,
      preConfirm: () => {
        const pacienteId = (document.getElementById('pacienteId') as HTMLSelectElement).value;
        const tipoAnalisis = (document.getElementById('tipoAnalisis') as HTMLSelectElement).value;
        const resultado = (document.getElementById('resultado') as HTMLTextAreaElement).value;
        const archivoInput = (document.getElementById('archivoUrl') as HTMLInputElement);

        if (!pacienteId || !tipoAnalisis || !archivoInput.files || archivoInput.files.length === 0) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return null;
        }

        return {
          pacienteId: parseInt(pacienteId),
          tipoAnalisis,
          resultado,
          archivo: archivoInput.files[0]
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true; // Activar spinner
        // Obtener la fecha ajustada a Bolivia (UTC-4)
        const fechaBolivia = this.getFechaBolivia();
        const formData = new FormData();
        formData.append('pacienteId', result.value?.pacienteId.toString());
        formData.append('medicoId', this.usuarioId.toString());
        formData.append('tipoAnalisis', result.value?.tipoAnalisis);
        formData.append('resultado', result.value?.resultado);
        formData.append('fechaRealizacion', fechaBolivia);
        formData.append('archivo', result.value?.archivo); // Archivo como File

        this.http.post('http://143.198.147.110/api/analisis', formData).subscribe(
          () => {
            this.isLoading = false; // Desactivar spinner
            Swal.fire('Análisis creado', 'El análisis se ha creado exitosamente', 'success');
            this.loadAnalisis();
          },
          (error) => {
            this.isLoading = false; // Desactivar spinner
            Swal.fire({
              title: 'Error al crear análisis',
              text: 'Por favor, inténtalo nuevamente.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
            console.error('Error al crear análisis', error);
          }
        );
      }
    });
  }
  // Función para ajustar la fecha a la hora de Bolivia (UTC-4)
  getFechaBolivia(): string {
    const now = new Date();

    // Ajustar la fecha a UTC-4
    const boliviaTime = new Date(now.getTime() - (now.getTimezoneOffset() + 240) * 60000);

    // Formatear como yyyy-MM-dd
    return boliviaTime.toISOString().split('T')[0];
  }
}
