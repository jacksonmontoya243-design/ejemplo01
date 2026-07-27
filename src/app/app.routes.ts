/**
 * ============================================================
 * MÓDULO: Configuración de Rutas (app.routes)
 * ============================================================
 * Define las rutas principales de la aplicación. Implementa
 * lazy loading para los componentes del dashboard y protege
 * las rutas con el guard de autenticación.
 * 
 * Estructura de rutas:
 *   /login      → Página de inicio de sesión (pública)
 *   /dashboard  → Panel de control (protegida)
 *   /usuarios   → Gestión de usuarios (protegida)
 *   /productos  → Gestión de productos (protegida)
 *   /clientes   → Gestión de clientes (protegida)
 *   /facturas   → Gestión de facturas (protegida)
 *   ''          → Redirección automática a /dashboard
 *   **          → Redirección a /dashboard (rutas no encontradas)
 * ============================================================
 */

import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    // Ruta pública: Login
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(m => m.LoginComponent),
    title: 'Inicio de Sesión - Sistema Empresarial'
  },
  {
    // Rutas protegidas con Layout compartido
    path: '',
    canActivate: [authGuard], // Protege todas las rutas hijas
    loadComponent: () =>
      import('./components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard - Sistema Empresarial'
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./components/usuarios/usuarios.component').then(m => m.UsuariosComponent),
        title: 'Usuarios - Sistema Empresarial'
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./components/productos/productos.component').then(m => m.ProductosComponent),
        title: 'Productos - Sistema Empresarial'
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./components/clientes/clientes.component').then(m => m.ClientesComponent),
        title: 'Clientes - Sistema Empresarial'
      },
      {
        path: 'facturas',
        loadComponent: () =>
          import('./components/facturas/facturas.component').then(m => m.FacturasComponent),
        title: 'Facturas - Sistema Empresarial'
      },
      {
        // Redirección por defecto al dashboard
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    // Redirección de rutas no encontradas al dashboard
    path: '**',
    redirectTo: '/dashboard'
  }
];