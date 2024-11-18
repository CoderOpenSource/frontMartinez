import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Consulta } from './consulta.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consultas',
  template: `
    <div class="container">
      <h1 class="text-2xl font-bold mb-4 text-center">Listado de Consultas</h1>

      <!-- Mostrar spinner mientras se cargan los datos -->
      <div class="spinner-container" *ngIf="isLoading">
        <div class="spinner"></div>
      </div>

      <!-- Tabla de consultas -->
      <table class="table table-bordered table-striped" *ngIf="!isLoading">
        <thead>
        <tr>
          <th>ID</th>
          <th>Paciente</th>
          <th>Fecha</th>
          <th>Diagnóstico</th>
          <th>Síntomas</th>
          <th>Tratamiento</th>
          <th>Medico</th>
          <th>Especialidad</th>
          <th>Derivó Procedimiento</th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let consulta of consultas">
          <td>{{ consulta.id }}</td>
          <td>{{ consulta.pacienteNombre }}</td>
          <td>{{ consulta.fecha }}</td>
          <td>{{ consulta.diagnostico }}</td>
          <td>
            <ul>
              <li *ngFor="let sintoma of consulta.sintomas">{{ sintoma }}</li>
            </ul>
          </td>
          <td>{{ consulta.tratamiento }}</td>
          <td>{{ consulta.nombreMedico }}</td>
          <td>{{ consulta.especialidadNombre }}</td>
          <td>
            <span *ngIf="consulta.derivoProcedimiento" class="text-success">Sí</span>
            <span *ngIf="!consulta.derivoProcedimiento" class="text-danger">No</span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [
    `
      /* Contenedor del spinner */
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

      /* Estilo del spinner */
      .spinner {
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top: 4px solid #ffffff;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
      }

      /* Animación del spinner */
      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      /* Estilo de la tabla */
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

      /* Botones */
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

      /* Responsividad */
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
  standalone: true,
  imports: [CommonModule],
})
export class ConsultasComponent implements OnInit {
  consultas: Consulta[] = [];
  isLoading: boolean = true; // Para controlar el spinner

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerConsultas();
  }

  obtenerConsultas(): void {
    this.http.get<Consulta[]>('http://143.198.147.110/api/consultas').subscribe({
      next: (data) => {
        this.consultas = data;
        this.isLoading = false; // Ocultar spinner cuando se obtienen los datos
      },
      error: (err) => {
        console.error('Error al obtener consultas:', err);
        this.isLoading = false; // Ocultar spinner incluso si hay un error
      },
    });
  }
}
