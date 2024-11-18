import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isAdmin: boolean = false;
  isMedico: boolean = false;

  ngOnInit(): void {
    // Supongamos que el rol está almacenado en localStorage como "userRole"
    const userRole = localStorage.getItem('userRole');
    this.isAdmin = userRole === 'ADMIN'; // Verificamos si el rol es "admin"
    this.isMedico = userRole === 'MEDICO';
  }
}
