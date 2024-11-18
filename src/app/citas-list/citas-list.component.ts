import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importa FormsModule para ngModel

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

@Component({
  selector: 'app-citas-list',
  standalone: true,
  imports: [CommonModule, FormsModule], // Añade FormsModule aquí
  template: `
    <!-- Spinner Manual -->
    <div *ngIf="isLoading" class="spinner-container">
      <div class="spinner"></div>
    </div>

    <div *ngIf="!isLoading" class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-4 text-center text-gray-800">
        Listado de Citas
      </h1>

      <div class="flex items-center justify-center mb-4">
        <input
          type="date"
          [(ngModel)]="fechaFiltro"
          class="border p-2 rounded"
        />
        <button
          (click)="filtrarPorFecha()"
          class="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Filtrar por fecha
        </button>
      </div>

      <!-- Texto dinámico según la fecha -->
      <div *ngIf="citasFiltradas.length > 0" class="text-center text-gray-600 mb-4">
        <p *ngIf="fechaFiltro === hoy">Citas de hoy</p>
        <p *ngIf="fechaFiltro && fechaFiltro !== hoy">Citas de la fecha {{ fechaFiltro }}</p>
      </div>

      <!-- Mensaje si no hay citas -->
      <div *ngIf="citasFiltradas.length === 0" class="text-center text-gray-600 mb-4">
        <p *ngIf="fechaFiltro === hoy">No hay citas hoy</p>
        <p *ngIf="fechaFiltro && fechaFiltro !== hoy">No hay citas en la fecha {{ fechaFiltro }}</p>
      </div>

      <!-- Tabla de citas -->
      <table
        *ngIf="citasFiltradas.length > 0"
        class="min-w-full bg-white shadow-lg rounded-lg"
      >
        <thead>
        <tr class="bg-gray-800 text-white">
          <th class="p-4 text-left">Fecha</th>
          <th class="p-4 text-left">Hora</th>
          <th class="p-4 text-left">Médico</th>
          <th class="p-4 text-left">Paciente</th>
          <th class="p-4 text-left">Especialidad</th>
          <th class="p-4 text-left">Estado</th>
        </tr>
        </thead>
        <tbody>
        <tr
          *ngFor="let cita of citasFiltradas"
          class="hover:bg-gray-100"
        >
          <td class="p-4">{{ cita.fecha }}</td>
          <td class="p-4">{{ cita.hora }}</td>
          <td class="p-4">
            {{ cita.medicoNombre }} {{ cita.medicoApellido }}
          </td>
          <td class="p-4">
            {{ cita.pacienteNombre }} {{ cita.pacienteApellido }}
          </td>
          <td class="p-4">{{ cita.especialidadNombre }}</td>
          <td class="p-4">{{ cita.estado }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [
    `
      .spinner-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      .spinner {
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top: 4px solid #ffffff;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }

      thead tr {
        background-color: #343a40;
        color: white;
      }

      th,
      td {
        border: 1px solid #dee2e6;
        padding: 12px;
        text-align: left;
      }

      tbody tr:nth-child(even) {
        background-color: #f8f9fa;
      }

      button {
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      button:hover {
        opacity: 0.9;
      }

      @media (max-width: 768px) {
        table {
          font-size: 14px;
        }

        button {
          width: 100%;
          margin-top: 10px;
        }
      }
    `,
  ],
})
export class CitasListComponent implements OnInit {
  citas: Cita[] = [];
  citasFiltradas: Cita[] = [];
  fechaFiltro: string = '';
  hoy: string = new Date().toISOString().split('T')[0]; // Fecha de hoy en formato YYYY-MM-DD
  isLoading: boolean = false; // Estado de carga

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerCitas();
  }

  obtenerCitas() {
    this.isLoading = true; // Muestra el spinner
    this.http.get<Cita[]>('http://localhost:8080/api/citas').subscribe(
      (data) => {
        this.citas = data;
        this.citasFiltradas = data.filter((cita) => cita.fecha === this.hoy); // Mostrar citas de hoy al inicio
        this.isLoading = false; // Oculta el spinner
      },
      (error) => {
        console.error('Error al cargar las citas', error);
        this.isLoading = false; // Oculta el spinner
      }
    );
  }

  filtrarPorFecha() {
    if (this.fechaFiltro) {
      this.citasFiltradas = this.citas.filter((cita) => cita.fecha === this.fechaFiltro);
    } else {
      this.citasFiltradas = this.citas; // Mostrar todas si no hay filtro
    }
  }
}
