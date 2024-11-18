import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const credentials = {
      username: this.email,
      password: this.password
    };

    this.http.post<any>('http://192.168.0.17/authenticate/', credentials).subscribe(
      response => {
        console.log('Response:', response);

        if (response.token) {
          localStorage.setItem('accessToken', response.token);
          localStorage.setItem('userRole', response.rol);
          localStorage.setItem('userId', response.id);

          console.log("-----TOKEN--------------", response.token);
          console.log("-----ROLE---------------", response.rol);
          console.log("-----USER ID------------", response.id);

          this.router.navigate(['/dashboard']); // Redirige a otra vista (dashboard)
        } else {
          this.error = 'No se recibió el token de autenticación.';
        }
      },
      error => {
        console.error('Authentication error:', error);
        this.error = 'Error: ' + error.message;
      }
    );
  }
}
