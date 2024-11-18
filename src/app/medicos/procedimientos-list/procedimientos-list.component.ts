import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

interface Procedimiento {
  id: number;
  fecha: string;
  descripcion: string;
  observaciones: string;
  archivoUrl?: string;
  medicoNombre: string;
  medicoApellido: string;
  pacienteNombre: string;
  pacienteApellido: string;
  consultaId: number;
}

interface Consulta {
  id: number;
  fecha: string;
  diagnostico: string;
  tratamiento: string;
  notas: string;
  pacienteNombre: string;
  pacienteId: number;
  derivoProcedimiento: boolean; // Campo para identificar si derivó a procedimiento
}

@Component({
  selector: 'app-procedimientos-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './procedimientos-list.component.html',
  styleUrls: ['./procedimientos-list.component.css']
})
export class ProcedimientosListComponent implements OnInit {
  procedimientos: Procedimiento[] = [];
  consultas: Consulta[] = [];
  medicoId: number;
  selectedDate: string | null = null; // Fecha seleccionada para filtrar procedimientos
  loading: boolean = false; // Indicador de carga

  constructor(private http: HttpClient) {
    this.medicoId = parseInt(localStorage.getItem('medicoId') || '0', 10);
  }

  ngOnInit(): void {
    this.loadProcedimientos();
    this.loadConsultas(); // Cargar consultas al iniciar
  }

  loadProcedimientos() {
    this.loading = true; // Mostrar spinner
    let url = `http://143.198.147.110/api/procedimientos/medico/${this.medicoId}`;
    if (this.selectedDate) {
      url += `?fecha=${this.selectedDate}`;
    }

    this.http.get<Procedimiento[]>(url).subscribe({
      next: (procedimientos) => {
        this.procedimientos = procedimientos;
        this.loading = false; // Ocultar spinner
      },
      error: (error) => {
        this.loading = false; // Ocultar spinner
        Swal.fire('Error al cargar procedimientos', 'Por favor, inténtalo nuevamente.', 'error');
        console.error('Error al cargar procedimientos', error);
      }
    });
  }

  loadConsultas() {
    this.loading = true; // Mostrar spinner
    const boliviaTime = new Date().toLocaleString('es-BO', {
      timeZone: 'America/La_Paz',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    const [day, month, year] = boliviaTime.split('/');
    const today = `${year}-${month}-${day}`; // Fecha en formato yyyy-MM-dd

    this.http.get<Consulta[]>(`http://143.198.147.110/api/consultas/medico/${this.medicoId}`).subscribe({
      next: (consultas) => {
        this.consultas = consultas.filter(consulta => consulta.derivoProcedimiento);
        this.loading = false; // Ocultar spinner
      },
      error: (error) => {
        this.loading = false; // Ocultar spinner
        Swal.fire('Error al cargar consultas', 'Por favor, inténtalo nuevamente.', 'error');
        console.error('Error al cargar consultas', error);
      }
    });
  }

  crearProcedimiento() {
    Swal.fire({
      title: 'Crear Procedimiento',
      html: `
      <p>Selecciona una Consulta</p>
      <select id="consultaId" class="swal2-input">
        <option value="" disabled selected>Seleccione una consulta válida</option>
        ${this.consultas.map(consulta => `<option value="${consulta.id}">${consulta.fecha} - ${consulta.pacienteNombre}</option>`).join('')}
      </select>
      <p>Descripción del Procedimiento</p>
      <textarea id="descripcion" class="swal2-textarea" placeholder="Descripción"></textarea>
      <p>Observaciones</p>
      <textarea id="observaciones" class="swal2-textarea" placeholder="Observaciones"></textarea>
      <p>Fecha del Procedimiento</p>
      <input id="fecha" type="date" class="swal2-input">
      <p>Archivo Opcional</p>
      <input id="archivo" type="file" class="swal2-input">
    `,
      preConfirm: () => {
        const consultaId = (document.getElementById('consultaId') as HTMLSelectElement).value;
        const descripcion = (document.getElementById('descripcion') as HTMLTextAreaElement).value;
        const observaciones = (document.getElementById('observaciones') as HTMLTextAreaElement).value;
        const fecha = (document.getElementById('fecha') as HTMLInputElement).value;
        const archivoInput = (document.getElementById('archivo') as HTMLInputElement);

        // Validar que la consulta haya sido seleccionada
        if (!consultaId) {
          Swal.showValidationMessage('Por favor, selecciona una consulta válida');
          return null;
        }

        if (!descripcion || !fecha) {
          Swal.showValidationMessage('Por favor, completa todos los campos obligatorios');
          return null;
        }

        const consulta = this.consultas.find(c => c.id === parseInt(consultaId, 10));
        if (!consulta) {
          Swal.showValidationMessage('Consulta no válida seleccionada');
          return null;
        }

        return {
          consultaId: parseInt(consultaId, 10),
          pacienteId: consulta.pacienteId,
          medicoId: this.medicoId,
          descripcion,
          observaciones,
          fecha,
          archivo: archivoInput.files?.[0] || null
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();

        formData.append('consultaId', result.value?.consultaId.toString());
        formData.append('pacienteId', result.value?.pacienteId.toString());
        formData.append('medicoId', result.value?.medicoId.toString());
        formData.append('descripcion', result.value?.descripcion);
        formData.append('observaciones', result.value?.observaciones);
        formData.append('fecha', result.value?.fecha);
        if (result.value?.archivo) {
          formData.append('archivo', result.value?.archivo);
        }

        this.loading = true; // Mostrar spinner
        this.http.post('http://143.198.147.110/api/procedimientos', formData).subscribe({
          next: () => {
            this.loading = false; // Ocultar spinner
            Swal.fire('Procedimiento creado', 'El procedimiento fue creado exitosamente', 'success');
            this.loadProcedimientos();
          },
          error: (error) => {
            this.loading = false; // Ocultar spinner
            Swal.fire('Error al crear procedimiento', 'Por favor, inténtalo nuevamente.', 'error');
            console.error('Error al crear procedimiento', error);
          }
        });
      }
    });
  }


  filtrarProcedimientosPorFecha() {
    this.loadProcedimientos();
  }
}
