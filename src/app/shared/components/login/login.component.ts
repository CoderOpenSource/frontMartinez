import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service'; // Asegúrate de importar AuthService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string | null = null;
  showPassword: boolean = false;
  toastMessage: string | null = null;
  toastClass: string = '';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  showToast(message: string, type: string) {
    this.toastMessage = message;
    this.toastClass = type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
    setTimeout(() => {
      this.toastMessage = null;
      if (type === 'success') {
        this.router.navigate(['/dashboard']);
      }
    }, 2000);
  }

  onSubmit() {
    const credentials = {
      username: this.email,
      password: this.password
    };

    this.http.post<any>('http://143.198.147.110/authenticate/', credentials).subscribe(
      response => {
        console.log('Response:', response);

        if (response.token) {
          this.authService.setSession(response.token, response.rol, response.id);
          this.showToast('Usuario loggeado con éxito', 'success');
        } else {
          this.showToast('No se recibió el token de autenticación.', 'error');
        }
      },
      error => {
        console.error('Authentication error:', error);
        this.showToast('Contraseña incorrecta o correo electrónico inválido.', 'error');
      }
    );
  }
}
