/**
 * ============================================================
 * COMPONENTE: ClientesComponent
 * ============================================================
 * Página de gestión de clientes. Muestra una tabla con todos
 * los clientes registrados, permite buscar, filtrar por tipo
 * y estado, y simula operaciones CRUD.
 * ============================================================
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '../../services';
import { Cliente } from '../../models';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2>Gestión de Clientes</h2>
          <p class="page-subtitle">Administre la cartera de clientes</p>
        </div>
        <button class="btn-primary" (click)="abrirFormulario()">
          <span class="material-icons-outlined">add</span>
          Nuevo Cliente
        </button>
      </div>

      <div class="filters">
        <div class="search-bar">
          <span class="material-icons-outlined search-icon">search</span>
          <input type="text" [(ngModel)]="terminoBusqueda" (input)="buscar()" placeholder="Buscar clientes..." class="search-input" />
        </div>
        <select [(ngModel)]="filtroTipo" (change)="buscar()" class="filter-select">
          <option value="">Todos los tipos</option>
          <option value="Natural">Persona Natural</option>
          <option value="Jurídica">Persona Jurídica</option>
        </select>
        <select [(ngModel)]="filtroEstado" (change)="buscar()" class="filter-select">
          <option value="">Todos los estados</option>
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
      </div>

      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Identificación</th>
              <th>Nombre / Razón Social</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Ciudad</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (cliente of clientesFiltrados(); track cliente.id) {
              <tr>
                <td><span class="badge badge-id">{{ cliente.tipoIdentificacion }} {{ cliente.numeroIdentificacion }}</span></td>
                <td><strong>{{ cliente.nombre }}</strong></td>
                <td>{{ cliente.email }}</td>
                <td>{{ cliente.telefono }}</td>
                <td>{{ cliente.ciudad }}</td>
                <td>
                  <span class="badge" [class.badge-natural]="cliente.tipo === 'Natural'" [class.badge-juridica]="cliente.tipo === 'Jurídica'">
                    {{ cliente.tipo === 'Natural' ? 'Persona' : 'Empresa' }}
                  </span>
                </td>
                <td>
                  <span class="badge" [class.badge-activo]="cliente.activo" [class.badge-inactivo]="!cliente.activo">
                    {{ cliente.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="actions">
                  <button class="btn-icon btn-edit" title="Editar" (click)="editar(cliente)"><span class="material-icons-outlined">edit</span></button>
                  <button class="btn-icon btn-delete" title="Eliminar" (click)="eliminar(cliente)"><span class="material-icons-outlined">delete</span></button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="8" class="empty-state">
                  <span class="material-icons-outlined">groups</span>
                  <p>No se encontraron clientes</p>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      @if (cargando()) {
        <div class="loading-overlay">
          <div class="spinner"></div>
          <p>Cargando clientes...</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 1400px; margin: 0 auto; }
    .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
    .page-header h2 { font-size: 24px; font-weight: 700; color: #1a237e; margin: 0 0 4px; }
    .page-subtitle { color: #888; font-size: 14px; margin: 0; }
    .btn-primary { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: linear-gradient(135deg, #1a237e, #3949ab); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(26, 35, 126, 0.3); }
    .btn-primary span { font-size: 20px; }
    .filters { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
    .search-bar { position: relative; flex: 1; min-width: 200px; }
    .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #aaa; font-size: 22px; }
    .search-input { width: 100%; padding: 12px 16px 12px 44px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 14px; transition: border-color 0.3s; outline: none; font-family: inherit; background: white; box-sizing: border-box; }
    .search-input:focus { border-color: #1a237e; }
    .filter-select { padding: 12px 16px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 14px; outline: none; font-family: inherit; background: white; cursor: pointer; min-width: 180px; }
    .filter-select:focus { border-color: #1a237e; }
    .table-container { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); overflow-x: auto; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { text-align: left; padding: 14px 20px; font-size: 12px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px; background: #fafafa; border-bottom: 2px solid #f0f0f0; }
    .table td { padding: 14px 20px; font-size: 14px; color: #444; border-bottom: 1px solid #f5f5f5; }
    .table tr:hover td { background: #f8f9ff; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 500; }
    .badge-id { background: #e8eaf6; color: #1a237e; font-family: monospace; font-size: 11px; }
    .badge-natural { background: #e3f2fd; color: #1565c0; }
    .badge-juridica { background: #fce4ec; color: #c62828; }
    .badge-activo { background: #e8f5e9; color: #2e7d32; }
    .badge-inactivo { background: #fce4ec; color: #c62828; }
    .actions { display: flex; gap: 8px; }
    .btn-icon { background: none; border: none; padding: 8px; border-radius: 8px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; }
    .btn-edit { color: #1a237e; }
    .btn-edit:hover { background: #e8eaf6; }
    .btn-delete { color: #c62828; }
    .btn-delete:hover { background: #fce4ec; }
    .empty-state { text-align: center; padding: 60px 20px !important; color: #aaa; }
    .empty-state span { font-size: 48px; }
    .empty-state p { margin: 8px 0 0; font-size: 16px; }
    .loading-overlay { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; color: #888; }
    .spinner { width: 40px; height: 40px; border: 4px solid #e0e0e0; border-top-color: #1a237e; border-radius: 50%; animation: spin 0.6s linear infinite; margin-bottom: 12px; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class ClientesComponent implements OnInit {
  private clientesService = inject(ClientesService);

  clientes: Cliente[] = [];
  clientesFiltrados = signal<Cliente[]>([]);
  terminoBusqueda = '';
  filtroTipo = '';
  filtroEstado = '';
  cargando = signal(true);

  ngOnInit(): void {
    this.cargarClientes();
  }

  private cargarClientes(): void {
    this.cargando.set(true);
    this.clientesService.obtenerTodos().subscribe({
      next: (data) => {
        this.clientes = data;
        this.clientesFiltrados.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  buscar(): void {
    let filtrados = this.clientes;
    const termino = this.terminoBusqueda.toLowerCase().trim();

    if (termino) {
      filtrados = filtrados.filter(c =>
        c.nombre.toLowerCase().includes(termino) ||
        c.numeroIdentificacion.includes(termino) ||
        c.email.toLowerCase().includes(termino) ||
        c.ciudad.toLowerCase().includes(termino)
      );
    }

    if (this.filtroTipo) {
      filtrados = filtrados.filter(c => c.tipo === this.filtroTipo);
    }

    if (this.filtroEstado) {
      const activo = this.filtroEstado === 'true';
      filtrados = filtrados.filter(c => c.activo === activo);
    }

    this.clientesFiltrados.set(filtrados);
  }

  abrirFormulario(): void {
    alert('Funcionalidad de creación de clientes. Los datos se guardarían en el backend.');
  }

  editar(cliente: Cliente): void {
    alert(`Editando cliente: ${cliente.nombre}`);
  }

  eliminar(cliente: Cliente): void {
    if (confirm(`¿Está seguro de eliminar al cliente "${cliente.nombre}"?`)) {
      this.clientesService.eliminar(cliente.id).subscribe(() => {
        this.cargarClientes();
      });
    }
  }
}