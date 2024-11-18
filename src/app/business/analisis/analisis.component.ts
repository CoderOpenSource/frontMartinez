import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Analisis } from './analisis.model';

@Component({
  selector: 'app-analisis',
  template: `
    <div class="container">
      <h1 class="text-2xl font-bold mb-4 text-center">Listado de Análisis</h1>

      <!-- Mostrar spinner mientras se cargan los datos -->
      <div class="spinner-container" *ngIf="isLoading">
        <div class="spinner"></div>
      </div>

      <!-- Tabla de análisis -->
      <table class="table table-bordered table-striped" *ngIf="!isLoading">
        <thead>
          <tr>
            <th>ID</th>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Tipo de Análisis</th>
            <th>Resultado</th>
            <th>Fecha de Realización</th>
            <th>Archivo</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let analisis of analisisList">
            <td>{{ analisis.id }}</td>
            <td>{{ analisis.pacienteNombre }} {{ analisis.pacienteApellido }}</td>
            <td>{{ analisis.medicoNombre }} {{ analisis.medicoApellido }}</td>
            <td>{{ analisis.tipoAnalisis }}</td>
            <td>{{ analisis.resultado }}</td>
            <td>{{ analisis.fechaRealizacion }}</td>
            <td>
              <a [href]="analisis.archivoUrl" target="_blank" class="btn btn-link">Ver Archivo</a>
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

      /* Responsividad */
      @media (max-width: 768px) {
        table {
          font-size: 14px;
        }
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule],
})
export class AnalisisComponent implements OnInit {
  analisisList: Analisis[] = [];
  isLoading: boolean = true; // Controlar el spinner

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerAnalisis();
  }

  obtenerAnalisis(): void {
    this.http.get<Analisis[]>('http://143.198.147.110/api/analisis').subscribe({
      next: (data) => {
        this.analisisList = data;
        this.isLoading = false; // Ocultar spinner cuando se obtienen los datos
      },
      error: (err) => {
        console.error('Error al obtener análisis:', err);
        this.isLoading = false; // Ocultar spinner incluso si hay un error
      },
    });
  }
}
