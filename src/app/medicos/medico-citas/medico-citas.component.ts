import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

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
  observaciones?: string;
}

@Component({
  selector: 'app-medico-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medico-citas.component.html',
  styleUrls: ['./medico-citas.component.css']
})
export class MedicoCitasComponent implements OnInit {
  citas: Cita[] = [];
  medicoId: number;
  isLoading: boolean = false;
  horaActual: Date = new Date();
  showModal: boolean = false;
  observaciones: string = '';
  citaSeleccionadaId: number | null = null;

  constructor(private http: HttpClient) {
    this.medicoId = parseInt(localStorage.getItem('medicoId') || '0', 10);
  }

  ngOnInit(): void {
    this.loadCitas();
    this.actualizarHoraActual();
    setInterval(() => this.actualizarHoraActual(), 60000); // Actualiza cada minuto
  }

  loadCitas() {
    this.isLoading = true;
    this.http.get<Cita[]>('http://143.198.147.110/api/citas').subscribe(
      (citas) => {
        this.citas = citas.filter(cita => cita.medicoId === this.medicoId);
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
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

  aceptarCitaConObservaciones() {
    if (this.citaSeleccionadaId === null) return;

    this.isLoading = true;
    const url = `http://143.198.147.110/api/citas/aceptar?citaId=${this.citaSeleccionadaId}&medicoId=${this.medicoId}&observaciones=${encodeURIComponent(this.observaciones)}`;

    this.http.post(url, {}, { responseType: 'text' }).subscribe(
      (response) => {
        Swal.fire('Cita atendida', response, 'success');
        this.loadCitas();
        this.cerrarModal();
      },
      (error) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Error al aceptar cita',
          text: 'Por favor, inténtalo nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        console.error('Error al aceptar cita', error);
      }
    );
  }

  cancelarCita(citaId: number) {
    this.isLoading = true;
    this.http.post(`http://143.198.147.110/api/citas/cancelar/medico?citaId=${citaId}&medicoId=${this.medicoId}`, {}, { responseType: 'text' }).subscribe(
      (response) => {
        Swal.fire('Cita cancelada', response, 'success');
        this.loadCitas();
      },
      (error) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Error al cancelar cita',
          text: 'Por favor, inténtalo nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        console.error('Error al cancelar cita', error);
      }
    );
  }

  abrirModal(citaId: number) {
    this.citaSeleccionadaId = citaId;
    this.showModal = true;
    this.observaciones = ''; // Limpia las observaciones del modal
  }

  cerrarModal() {
    this.showModal = false;
    this.citaSeleccionadaId = null;
    this.observaciones = '';
  }

  actualizarHoraActual() {
    this.horaActual = new Date();
  }

  puedeAceptarCita(cita: Cita): boolean {
    const citaHora = new Date(`${cita.fecha}T${cita.hora}`);
    const limite = new Date(citaHora);
    limite.setHours(limite.getHours() + 1);

    console.log('--- Validando si se puede aceptar la cita ---');
    console.log('Hora actual (zona horaria local):', this.horaActual);
    console.log('Hora de la cita:', citaHora);
    console.log('Límite para aceptar:', limite);

    const puedeAceptar = this.horaActual >= citaHora && this.horaActual <= limite;
    console.log('¿Se puede aceptar la cita?', puedeAceptar);

    return puedeAceptar;
  }

  puedeCancelarCita(cita: Cita): boolean {
    const citaHora = new Date(`${cita.fecha}T${cita.hora}`);
    const limite = new Date(citaHora);
    limite.setMinutes(limite.getMinutes() - 1);

    console.log('--- Validando si se puede cancelar la cita ---');
    console.log('Hora actual (zona horaria local):', this.horaActual);
    console.log('Hora de la cita:', citaHora);
    console.log('Límite para cancelar (1 minuto antes de la cita):', limite);

    const puedeCancelar = this.horaActual <= limite;
    console.log('¿Se puede cancelar la cita?', puedeCancelar);

    return puedeCancelar;
  }
}
