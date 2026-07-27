/**
 * ============================================================
 * COMPONENTE: UsuariosComponent
 * ============================================================
 * Página de gestión de usuarios del sistema. Muestra una tabla
 * con todos los usuarios registrados, permite buscar, filtrar,
 * y simula operaciones CRUD (crear, editar, eliminar).
 * ============================================================
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services';
import { Usuario } from '../../models';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <!-- Encabezado de la página -->
      <div class="page-header">
        <div>
          <h2>Gestión de Usuarios</h2>
          <p class="page-subtitle">Administre los usuarios del sistema</p>
        </div>
        <button class="btn-primary" (click)="abrirFormulario()">
          <span class="material-icons-outlined">add</span>
          Nuevo Usuario
        </button>
      </div>

      <!-- Barra de búsqueda -->
      <div class="search-bar">
        <span class="material-icons-outlined search-icon">search</span>
        <input
          type="text"
          [(ngModel)]="terminoBusqueda"
          (input)="buscar()"
          placeholder="Buscar por nombre, email o rol..."
          class="search-input"
        />
      </div>

      <!-- Tabla de usuarios -->
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Departamento</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (usuario of usuariosFiltrados(); track usuario.id) {
              <tr>
                <td><strong>{{ usuario.nombre }}</strong></td>
                <td>{{ usuario.email }}</td>
                <td><span class="badge badge-rol">{{ usuario.rol }}</span></td>
                <td>{{ usuario.departamento }}</td>
                <td>{{ usuario.telefono }}</td>
                <td>
                  <span class="badge" [class.badge-activo]="usuario.activo" [class.badge-inactivo]="!usuario.activo">
                    {{ usuario.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="actions">
                  <button class="btn-icon btn-edit" title="Editar" (click)="editar(usuario)">
                    <span class="material-icons-outlined">edit</span>
                  </button>
                  <button class="btn-icon btn-delete" title="Eliminar" (click)="eliminar(usuario)">
                    <span class="material-icons-outlined">delete</span>
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="7" class="empty-state">
                  <span class="material-icons-outlined">people_outline</span>
                  <p>No se encontraron usuarios</p>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Indicador de carga -->
      @if (cargando()) {
        <div class="loading-overlay">
          <div class="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .page {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .page-header h2 {
      font-size: 24px;
      font-weight: 700;
      color: #1a237e;
      margin: 0 0 4px;
    }

    .page-subtitle {
      color: #888;
      font-size: 14px;
      margin: 0;
    }

    .btn-primary {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: linear-gradient(135deg, #1a237e, #3949ab);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(26, 35, 126, 0.3);
    }

    .btn-primary span {
      font-size: 20px;
    }

    .search-bar {
      position: relative;
      margin-bottom: 20px;
      max-width: 400px;
    }

    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #aaa;
      font-size: 22px;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px 12px 44px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 14px;
      transition: border-color 0.3s;
      outline: none;
      font-family: inherit;
      background: white;
    }

    .search-input:focus {
      border-color: #1a237e;
    }

    .table-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      overflow-x: auto;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
    }

    .table th {
      text-align: left;
      padding: 14px 20px;
      font-size: 12px;
      font-weight: 600;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: #fafafa;
      border-bottom: 2px solid #f0f0f0;
    }

    .table td {
      padding: 14px 20px;
      font-size: 14px;
      color: #444;
      border-bottom: 1px solid #f5f5f5;
    }

    .table tr:hover td {
      background: #f8f9ff;
    }

    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
    }

    .badge-rol {
      background: #e8eaf6;
      color: #1a237e;
    }

    .badge-activo {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .badge-inactivo {
      background: #fce4ec;
      color: #c62828;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      background: none;
      border: none;
      padding: 8px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
    }

    .btn-edit {
      color: #1a237e;
    }

    .btn-edit:hover {
      background: #e8eaf6;
    }

    .btn-delete {
      color: #c62828;
    }

    .btn-delete:hover {
      background: #fce4ec;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px !important;
      color: #aaa;
    }

    .empty-state span {
      font-size: 48px;
    }

    .empty-state p {
      margin: 8px 0 0;
      font-size: 16px;
    }

    .loading-overlay {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px;
      color: #888;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e0e0e0;
      border-top-color: #1a237e;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
      margin-bottom: 12px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class UsuariosComponent implements OnInit {
  private usuariosService = inject(UsuariosService);

  /** Lista completa de usuarios */
  usuarios: Usuario[] = [];

  /** Lista filtrada para mostrar */
  usuariosFiltrados = signal<Usuario[]>([]);

  /** Término de búsqueda */
  terminoBusqueda = '';

  /** Estado de carga */
  cargando = signal(true);

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  /** Carga los usuarios desde el servicio */
  private cargarUsuarios(): void {
    this.cargando.set(true);
    this.usuariosService.obtenerTodos().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.usuariosFiltrados.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  /** Filtra los usuarios según el término de búsqueda */
  buscar(): void {
    const termino = this.terminoBusqueda.toLowerCase().trim();
    if (!termino) {
      this.usuariosFiltrados.set(this.usuarios);
      return;
    }

    const filtrados = this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(termino) ||
      u.email.toLowerCase().includes(termino) ||
      u.rol.toLowerCase().includes(termino) ||
      u.departamento.toLowerCase().includes(termino)
    );
    this.usuariosFiltrados.set(filtrados);
  }

  /** Simula abrir formulario de nuevo usuario */
  abrirFormulario(): void {
    alert('Funcionalidad de creación de usuarios. Los datos se guardarían en el backend.');
  }

  /** Simula editar un usuario */
  editar(usuario: Usuario): void {
    alert(`Editando usuario: ${usuario.nombre}`);
  }

  /** Simula eliminar un usuario */
  eliminar(usuario: Usuario): void {
    if (confirm(`¿Está seguro de eliminar al usuario "${usuario.nombre}"?`)) {
      this.usuariosService.eliminar(usuario.id).subscribe(() => {
        this.cargarUsuarios();
      });
    }
  }
}