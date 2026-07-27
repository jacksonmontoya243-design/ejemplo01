/**
 * ============================================================
 * COMPONENTE: LayoutComponent
 * ============================================================
 * Componente principal que envuelve todas las páginas del
 * dashboard. Incluye un menú lateral de navegación y una
 * barra superior con información del usuario.
 * Proporciona la estructura visual base de la aplicación.
 * ============================================================
 */

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services';

/** Interfaz para los items del menú de navegación */
interface MenuItem {
  /** Ruta de navegación */
  ruta: string;
  /** Icono Material a mostrar */
  icono: string;
  /** Texto visible del menú */
  texto: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="layout">
      <!-- Menú lateral -->
      <aside class="sidebar" [class.collapsed]="sidebarCollapsed()">
        <!-- Logo del sistema -->
        <div class="sidebar-header">
          <div class="logo">
            <span class="material-icons-outlined">business</span>
            @if (!sidebarCollapsed()) {
              <span class="logo-text">SGE</span>
            }
          </div>
        </div>

        <!-- Items de navegación -->
        <nav class="sidebar-nav">
          @for (item of menuItems; track item.ruta) {
            <a
              class="nav-item"
              [routerLink]="item.ruta"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{exact: item.ruta === '/dashboard'}"
              title="{{ item.texto }}"
            >
              <span class="material-icons-outlined nav-icon">{{ item.icono }}</span>
              @if (!sidebarCollapsed()) {
                <span class="nav-text">{{ item.texto }}</span>
              }
            </a>
          }
        </nav>

        <!-- Botón para colapsar/expandir sidebar -->
        <button class="collapse-btn" (click)="toggleSidebar()" title="Colapsar menú">
          <span class="material-icons-outlined">
            {{ sidebarCollapsed() ? 'chevron_right' : 'chevron_left' }}
          </span>
        </button>
      </aside>

      <!-- Contenido principal -->
      <main class="main-content">
        <!-- Barra superior -->
        <header class="topbar">
          <div class="topbar-left">
            <span class="material-icons-outlined menu-icon" (click)="toggleSidebar()">menu</span>
            <span class="page-title">Bienvenido, {{ (usuario?.nombre || '').split(' ')[0] }}</span>
          </div>
          <div class="topbar-right">
            <!-- Información del usuario -->
            <div class="user-info">
              <div class="user-avatar">
                {{ (usuario?.nombre || '').charAt(0) }}
              </div>
              <div class="user-details">
                <span class="user-name">{{ usuario?.nombre }}</span>
                <span class="user-role">{{ usuario?.rol }}</span>
              </div>
            </div>
            <!-- Botón de cerrar sesión -->
            <button class="btn-logout" (click)="cerrarSesion()" title="Cerrar sesión">
              <span class="material-icons-outlined">logout</span>
            </button>
          </div>
        </header>

        <!-- Área de contenido dinámico (router-outlet) -->
        <div class="content-area">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
  styles: [`
    /* Contenedor principal del layout */
    .layout {
      display: flex;
      min-height: 100vh;
      background: #f5f7fa;
    }

    /* ─── Sidebar ────────────────────────────────────────── */
    .sidebar {
      width: 250px;
      background: linear-gradient(180deg, #1a237e 0%, #283593 100%);
      color: white;
      display: flex;
      flex-direction: column;
      transition: width 0.3s ease;
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      z-index: 100;
      overflow: hidden;
    }

    .sidebar.collapsed {
      width: 64px;
    }

    /* Encabezado del sidebar */
    .sidebar-header {
      padding: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo span {
      font-size: 32px;
    }

    .logo-text {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 1px;
      white-space: nowrap;
    }

    /* Navegación del sidebar */
    .sidebar-nav {
      flex: 1;
      padding: 12px 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      overflow-y: auto;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      border-radius: 10px;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .nav-item.active {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      font-weight: 500;
    }

    .nav-icon {
      font-size: 22px;
      min-width: 22px;
    }

    .nav-text {
      font-size: 14px;
    }

    /* Botón colapsar */
    .collapse-btn {
      padding: 12px;
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .collapse-btn:hover {
      color: white;
    }

    /* ─── Contenido principal ────────────────────────────── */
    .main-content {
      flex: 1;
      margin-left: 250px;
      transition: margin-left 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .sidebar.collapsed + .main-content {
      /* CSS no puede seleccionar hermano anterior, usamos lógica en JS si es necesario */
    }

    /* Barra superior */
    .topbar {
      background: white;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .topbar-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .menu-icon {
      display: none;
      font-size: 28px;
      cursor: pointer;
      color: #666;
    }

    .page-title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    /* Información del usuario */
    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .user-avatar {
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, #1a237e, #3949ab);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 13px;
      font-weight: 600;
      color: #333;
    }

    .user-role {
      font-size: 11px;
      color: #888;
    }

    .btn-logout {
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
    }

    .btn-logout:hover {
      background: #fce4ec;
      color: #c62828;
    }

    /* Área de contenido */
    .content-area {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* ─── Responsive ─────────────────────────────────────── */
    @media (max-width: 768px) {
      .sidebar {
        width: 64px;
      }

      .sidebar .nav-text,
      .sidebar .logo-text {
        display: none;
      }

      .main-content {
        margin-left: 64px;
      }

      .menu-icon {
        display: block;
      }

      .user-details {
        display: none;
      }

      .content-area {
        padding: 16px;
      }
    }
  `]
})
export class LayoutComponent {
  /** Servicio de autenticación */
  private authService = inject(AuthService);
  /** Router para navegación */
  private router = inject(Router);

  /** Control de colapso del sidebar */
  sidebarCollapsed = signal(false);

  /** Items del menú de navegación */
  menuItems: MenuItem[] = [
    { ruta: '/dashboard', icono: 'dashboard', texto: 'Dashboard' },
    { ruta: '/usuarios', icono: 'people', texto: 'Usuarios' },
    { ruta: '/productos', icono: 'inventory_2', texto: 'Productos' },
    { ruta: '/clientes', icono: 'groups', texto: 'Clientes' },
    { ruta: '/facturas', icono: 'receipt', texto: 'Facturas' }
  ];

  /** Usuario actual autenticado */
  get usuario() {
    return this.authService.getUsuarioActual();
  }

  /**
   * Alterna el estado colapsado del sidebar
   */
  toggleSidebar(): void {
    this.sidebarCollapsed.update(valor => !valor);
  }

  /**
   * Cierra la sesión y redirige al login
   */
  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}