import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  contrasena: string;
  rol: {
    id: number;
    nombre: string;
  };
}

interface Paciente {
  id: number;
  carnet: string;
  fechaNacimiento: string;
  sexo: string;
  edad: number;
  fechaInicioSeguro: string;
  fechaFinSeguro: string;
  usuario: Usuario;
}

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [CommonModule], // Solo importa CommonModule
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {
  pacientes: Paciente[] = [];
  isLoading: boolean = false; // Propiedad para manejar el estado de carga

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPacientes();
  }

  loadPacientes() {
    this.isLoading = true; // Activa el estado de carga
    this.http.get<Paciente[]>('http://143.198.147.110/api/pacientes').subscribe(
      data => {
        this.pacientes = data;
        this.isLoading = false; // Desactiva el estado de carga
      },
      error => {
        this.isLoading = false; // Desactiva el estado de carga
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.isLoading = true; // Activa el estado de carga
      this.http.post('http://143.198.147.110/api/pacientes/cargar', formData, { responseType: 'json' })
        .subscribe(
          (response: any) => {
            this.isLoading = false; // Desactiva el estado de carga
            if (response && response.mensaje) {
              Swal.fire({
                title: 'Archivo cargado con éxito',
                text: 'Los pacientes se han actualizado correctamente.',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
              });
              this.loadPacientes(); // Recargar la lista de pacientes
            } else {
              Swal.fire({
                title: 'Error al cargar el archivo',
                text: 'El archivo fue recibido, pero ocurrió un problema al procesarlo.',
                icon: 'warning',
                confirmButtonText: 'Aceptar'
              });
            }
          },
          error => {
            this.isLoading = false; // Desactiva el estado de carga
            Swal.fire({
              title: 'Error al cargar el archivo',
              text: 'Por favor, verifica el archivo y vuelve a intentarlo.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
            console.error('Error uploading file', error);
          }
        );
    }
  }
}
