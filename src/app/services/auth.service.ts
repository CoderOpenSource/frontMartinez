import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'accessToken';
  private roleKey = 'userRole';
  private userIdKey = 'userId';

  constructor(private http: HttpClient) {}

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.userIdKey);
  }

  getUserId(): number | null {
    const userId = localStorage.getItem(this.userIdKey);
    return userId ? parseInt(userId, 10) : null; // Convertir a número al leer
  }

  setSession(token: string, role: string, userId: number): void {
    // Almacenar el token y el rol en localStorage
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.roleKey, role);

    // Siempre almacenar el userId recibido
    localStorage.setItem(this.userIdKey, userId.toString());

    // Si el rol es "MEDICO", buscar y almacenar el medicoId
    if (role === 'MEDICO') {
      this.fetchMedicoId(userId).subscribe(
        (medicoId) => {
          localStorage.setItem('medicoId', medicoId.toString()); // Guardar medicoId como cadena
        },
        (error) => {
          console.error('Error al obtener medicoId:', error);
        }
      );
    }
  }


  private fetchMedicoId(userId: number): Observable<number> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Token no encontrado');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any[]>('http://143.198.147.110/api/medicos', { headers }).pipe(
      map((medicos) => {
        const medico = medicos.find((m) => m.usuarioId === userId);
        if (!medico) {
          throw new Error('Médico no encontrado');
        }
        console.log(medico.id);
        return medico.id;
      }),
      catchError((error) => {
        if (error.status === 401) {
          this.clearSession();
          Swal.fire({
            title: 'Sesión expirada',
            text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = '/login'; // Redirigir al inicio de sesión
            }
          });
        }
        return throwError(() => error);
      })
    );
  }

  getUserInfo(): Observable<any> {
    const userId = this.getUserId();
    const token = this.getToken();

    if (!userId) {
      Swal.fire('Error', 'Usuario no identificado', 'error');
      throw new Error('Usuario no identificado');
    }

    if (!token) {
      Swal.fire('Error', 'Token no encontrado', 'error');
      throw new Error('Token no encontrado');
    }

    console.log('Token enviado en la solicitud:', token);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`http://143.198.147.110/usuarios/${userId}`, { headers }).pipe(
      map((response) => response),
      catchError((error) => {
        if (error.status === 401) {
          this.clearSession();
          Swal.fire({
            title: 'Sesión expirada',
            text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = '/login'; // Redirigir al inicio de sesión
            }
          });
        }
        return throwError(() => error);
      })
    );
  }
}
