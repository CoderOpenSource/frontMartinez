import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { TokenInterceptor } from './token.interceptor'; // Importa el interceptor
import { AuthService } from './services/auth.service'; // Importa AuthService (gestión del token)

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    AuthService, // Registra AuthService
    {
      provide: HTTP_INTERCEPTORS, // Registra el TokenInterceptor
      useClass: TokenInterceptor,
      multi: true, // Permitir múltiples interceptores si hay otros en el futuro
    },
  ],
})
export class AppModule {}
