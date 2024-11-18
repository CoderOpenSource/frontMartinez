import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuthenticated: boolean = false;
  userName: string | null = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      const userId = this.authService.getUserId();
      if (userId) {
        this.authService.getUserInfo().subscribe(
          userInfo => {
            this.userName = userInfo.nombre; // Asegúrate de que 'name' sea la propiedad correcta del objeto devuelto por la API
          },
          error => {
            console.error('Error fetching user info:', error);
          }
        );
      }
    }
  }

  logout() {
    this.authService.clearSession();
    this.router.navigate(['/login']);
  }
}
