import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Role {
  id: number;
  nombre: string;
}

interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  contrasena: string;
  rol: {
    id: number | null;
    nombre: string;
  };
}

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent implements OnInit {
  @Input() user: User = {
    id: 0,
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '',
    rol: {
      id: null,
      nombre: ''
    }
  };
  @Input() isEditMode = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveUser = new EventEmitter<User>();
  @Output() userCreatedOrUpdated = new EventEmitter<void>();

  showPassword = false;
  showRepeatPassword = false;
  repeatPassword = '';
  toastMessage: string | null = null;
  toastClass: string = '';

  roles: Role[] = []; // Lista de roles obtenidos desde la API

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadRoles();
    if (!this.isEditMode) {
      this.user.rol.id = null; // Asignar null para mostrar el placeholder en modo añadir
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleRepeatPasswordVisibility() {
    this.showRepeatPassword = !this.showRepeatPassword;
  }

  loadRoles() {
    this.http.get<Role[]>('http://192.168.0.18/roles/').subscribe(
      data => {
        // Filtrar roles que no sean "DOCENTE"
        this.roles = data.filter(role => role.nombre !== 'DOCENTE');
      },
      error => {
        console.error('Error loading roles', error);
      }
    );
  }


  showToast(message: string, type: string) {
    this.toastMessage = message;
    this.toastClass = type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
    setTimeout(() => {
      this.toastMessage = null;
    }, 2000);
  }

  onClose() {
    this.closeModal.emit();
  }

  onSave() {
    this.saveUser.emit(this.user);
  }
}
