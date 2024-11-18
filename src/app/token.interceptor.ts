import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import Swal from 'sweetalert2';
import {catchError, throwError} from "rxjs";

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  const modifiedReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(modifiedReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        Swal.fire({
          title: 'Sesión Expirada',
          text: 'Por favor, inicia sesión nuevamente.',
          icon: 'warning',
          confirmButtonText: 'Aceptar',
        }).then((result) => {
          if (result.isConfirmed) {
            authService.clearSession();
            window.location.href = '/login';
          }
        });
      }
      return throwError(() => error);
    })
  );
};
