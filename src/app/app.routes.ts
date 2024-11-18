import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guards';
import { roleGuard } from './guards/role.guards';
import { loginGuard } from './guards/login.guards';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./shared/components/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [roleGuard],
        data: { expectedRoles: ['ADMIN', 'MEDICO'] },
      },
      {
        path: 'especialidades',
        loadComponent: () => import('./business/especialidades/especialidades.component').then(m => m.EspecialidadesComponent),
        canActivate: [roleGuard],
        data: { expectedRoles: ['ADMIN'] }
      },
      {
        path: 'medicos',
        loadComponent: () => import('./business/medicos/medicos.component').then(m => m.MedicosComponent),
        canActivate: [roleGuard],
        data: { expectedRoles: ['ADMIN'] }
      },
      {
        path: 'pacientes',
        loadComponent: () => import('./business/paciente/paciente.component').then(m => m.PacienteComponent),
        canActivate: [roleGuard],
        data: { expectedRoles: ['ADMIN'] }
      },
      {
        path: 'horarios',
        loadComponent: () => import('./business/horarios/horarios.component').then(m => m.HorariosComponent),
        canActivate: [roleGuard],
        data: { expectedRoles: ['ADMIN'] }
      },
      {
        path: 'citas',
        loadComponent: () => import('./citas-list/citas-list.component').then(m => m.CitasListComponent),
        canActivate: [roleGuard],
        data: { expectedRoles: ['ADMIN'] }
      },

      {
        path: 'pacientes/medico',
        loadComponent: () => import('./medicos/pacientes/pacientes.component').then(m => m.GestionarPacientesComponent),
        canActivate: [roleGuard],
        data: { expectedRoles: ['MEDICO'] }
      },
      {
        path: 'medico/citas',
        loadComponent: () => import('./medicos/medico-citas/medico-citas.component').then(m => m.MedicoCitasComponent),
        canActivate: [roleGuard],
        data: { expectedRoles: ['MEDICO'] }
      },
      {
        path: 'medico/consultas',
        loadComponent: () => import('./medicos/consulta-list/consulta-list.component').then(m => m.ConsultaListComponent),
        canActivate: [roleGuard],
        data: { expectedRoles: ['MEDICO'] }
      },
      {
        path: 'medico/analisis',
        loadComponent: () => import('./medicos/analisis-list/analisis-list.component').then(m => m.AnalisisListComponent),
        canActivate: [roleGuard],
        data: { expectedRoles: ['MEDICO'] }
      },
      {
        path: 'medico/procedimientos',
        loadComponent: () => import('./medicos/procedimientos-list/procedimientos-list.component').then(m => m.ProcedimientosListComponent),
        canActivate: [roleGuard],
        data: { expectedRoles: ['MEDICO'] }
      },
      {
        path: 'reportes',
        loadComponent: () => import('./business/reportes.component').then(m => m.ReportesComponent),
        canActivate: [roleGuard],
        data: { expectedRoles: ['ADMIN'] }
      },
      {
        path: 'consultas',
        loadComponent: () => import('./business/consultas/consultas.component').then(m => m.ConsultasComponent),
        canActivate: [roleGuard],
        data: { expectedRoles: ['ADMIN'] }
      },
      {
        path: 'analisis',
        loadComponent: () => import('./business/analisis/analisis.component').then(m => m.AnalisisComponent),
        canActivate: [roleGuard],
        data: { expectedRoles: ['ADMIN'] }
      },
      {
        path: 'procedimientos',
        loadComponent: () => import('./business/procedimientos/procedimientos.component').then(m => m.ProcedimientosComponent),
        canActivate: [roleGuard],
        data: { expectedRoles: ['ADMIN'] }
      },

    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./shared/components/login/login.component').then(m => m.LoginComponent),
    canActivate: [loginGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
