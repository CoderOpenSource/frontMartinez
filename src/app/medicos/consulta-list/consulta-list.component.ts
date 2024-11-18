import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

interface Consulta {
  id: number;
  fecha: string;
  diagnostico: string;
  tratamiento: string;
  notas: string;
  pacienteNombre: string;
  pacienteApellido: string;
  derivoProcedimiento: boolean; // Nuevo campo
  especialidadNombre: string;
}

interface Cita {
  id: number;
  fecha: string;
  hora: string;
  medicoId: number;
  pacienteId: number;
  pacienteNombre: string;
  pacienteApellido: string;
  especialidadNombre: string;
  estado: string;
  consultaCreada: boolean;
}

@Component({
  selector: 'app-consulta-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consulta-list.component.html',
  styleUrls: ['./consulta-list.component.css']
})
export class ConsultaListComponent implements OnInit {
  consultas: Consulta[] = [];
  citas: Cita[] = [];
  medicoId: number;
  selectedDate: string | null = null; // Fecha seleccionada para filtrar
  loading: boolean = false; // Indicador de carga

  constructor(private http: HttpClient) {
    this.medicoId = parseInt(localStorage.getItem('medicoId') || '0', 10);
  }

  ngOnInit(): void {
    this.loadConsultas();
    this.loadCitas(); // Cargar citas al iniciar
  }

  loadConsultas() {
    this.loading = true; // Mostrar spinner
    let url = `http://143.198.147.110/api/consultas/medico/${this.medicoId}`;
    if (this.selectedDate) {
      url += `?fecha=${this.selectedDate}`;
    }

    this.http.get<Consulta[]>(url).subscribe(
      (consultas) => {
        this.consultas = consultas;
        this.loading = false; // Ocultar spinner
      },
      (error) => {
        this.loading = false; // Ocultar spinner
        Swal.fire({
          title: 'Error al cargar consultas',
          text: 'Por favor, inténtalo nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        console.error('Error al cargar consultas', error);
      }
    );
  }

  loadCitas() {
    this.loading = true; // Mostrar spinner
    const boliviaTime = new Date().toLocaleString("es-BO", {
      timeZone: "America/La_Paz",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const [day, month, year] = boliviaTime.split("/");
    const today = `${year}-${month}-${day}`; // Fecha en formato yyyy-MM-dd
    console.log(today);
    this.http.get<Cita[]>(`http://143.198.147.110/api/citas`).subscribe(
      (citas) => {
        this.citas = citas.filter(
          (cita) =>
            cita.estado === 'atendida' &&
            cita.medicoId === this.medicoId &&
            cita.consultaCreada === false &&
            cita.fecha === today
        );
        this.loading = false; // Ocultar spinner
      },
      (error) => {
        this.loading = false; // Ocultar spinner
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

  crearConsulta(cita: Cita) {
    Swal.fire({
      title: `Crear Consulta para ${cita.pacienteNombre} ${cita.pacienteApellido}`,
      html: `
        <textarea id="diagnostico" class="swal2-textarea" placeholder="Diagnóstico"></textarea>
        <textarea id="sintomas" class="swal2-textarea" placeholder="Síntomas"></textarea>
        <textarea id="tratamiento" class="swal2-textarea" placeholder="Tratamiento"></textarea>
        <textarea id="notas" class="swal2-textarea" placeholder="Notas"></textarea>
        <label class="swal2-checkbox">
          <input id="derivoProcedimiento" type="checkbox">
          <span>¿Derivó a procedimiento?</span>
        </label>
      `,
      preConfirm: () => {
        const diagnostico = (document.getElementById('diagnostico') as HTMLTextAreaElement).value;
        const sintomas = (document.getElementById('sintomas') as HTMLTextAreaElement).value.split(',').map(s => s.trim());
        const tratamiento = (document.getElementById('tratamiento') as HTMLTextAreaElement).value;
        const notas = (document.getElementById('notas') as HTMLTextAreaElement).value;
        const derivoProcedimiento = (document.getElementById('derivoProcedimiento') as HTMLInputElement).checked;

        if (!diagnostico) {
          Swal.showValidationMessage('El diagnóstico es obligatorio');
          return null; // Retorna nulo si falla la validación
        }

        return { diagnostico, sintomas, tratamiento, notas, derivoProcedimiento };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true; // Mostrar spinner
        const consultaDTO = {
          citaId: cita.id,
          pacienteId: cita.pacienteId,
          pacienteNombre: `${cita.pacienteNombre} ${cita.pacienteApellido}`,
          medicoId: this.medicoId,
          fecha: cita.fecha,
          diagnostico: result.value?.diagnostico,
          sintomas: result.value?.sintomas,
          tratamiento: result.value?.tratamiento,
          notas: result.value?.notas,
          derivoProcedimiento: result.value?.derivoProcedimiento // Nuevo campo
        };

        this.http.post('http://143.198.147.110/api/consultas', consultaDTO).subscribe({
          next: () => {
            this.loading = false; // Ocultar spinner
            Swal.fire('Consulta creada', 'La consulta fue creada exitosamente', 'success');
            this.loadConsultas();
            this.loadCitas(); // Recargar citas para actualizar las disponibles
          },
          error: (error) => {
            this.loading = false; // Ocultar spinner
            Swal.fire('Consulta creada', 'La consulta fue creada exitosamente', 'success');
            this.loadConsultas();
            this.loadCitas();
          },
          complete: () => {
            console.log('Proceso de creación de consulta completado');
          }
        });
      }
    });
  }

  filtrarConsultasPorFecha() {
    this.loadConsultas();
  }
}
