/**
 * ============================================================
 * COMPONENTE: FacturasComponent
 * ============================================================
 * Página de gestión de facturas. Muestra una tabla con todas
 * las facturas emitidas, permite ver detalles, filtrar por
 * estado y simula operaciones CRUD.
 * ============================================================
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacturasService } from '../../services';
import { Factura } from '../../models';

@Component({
  selector: 'app-facturas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2>Gestión de Facturas</h2>
          <p class="page-subtitle">Administre las facturas del sistema</p>
        </div>
        <button class="btn-primary" (click)="abrirFormulario()">
          <span class="material-icons-outlined">add</span>
          Nueva Factura
        </button>
      </div>

      <div class="filters">
        <div class="search-bar">
          <span class="material-icons-outlined search-icon">search</span>
          <input type="text" [(ngModel)]="terminoBusqueda" (input)="buscar()" placeholder="Buscar por #factura o cliente..." class="search-input" />
        </div>
        <select [(ngModel)]="filtroEstado" (change)="buscar()" class="filter-select">
          <option value="">Todos los estados</option>
          <option value="PAGADA">Pagada</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="ANULADA">Anulada</option>
        </select>
      </div>

      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th># Factura</th>
              <th>Cliente</th>
              <th>Fecha Emisión</th>
              <th>Vencimiento</th>
              <th>Subtotal</th>
              <th>IVA</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (factura of facturasFiltradas(); track factura.id) {
              <tr>
                <td><strong>#{{ factura.id }}</strong></td>
                <td>{{ factura.cliente.nombre }}</td>
                <td>{{ factura.fechaEmision | date:'dd/MM/yyyy' }}</td>
                <td>{{ factura.fechaVencimiento | date:'dd/MM/yyyy' }}</td>
                <td>{{ factura.subtotal | currency:'COP':'symbol-narrow':'1.0-0' }}</td>
                <td>{{ factura.iva | currency:'COP':'symbol-narrow':'1.0-0' }}</td>
                <td><strong>{{ factura.total | currency:'COP':'symbol-narrow':'1.0-0' }}</strong></td>
                <td>
                  <span class="badge" [class.badge-pagada]="factura.estado === 'PAGADA'"
                                      [class.badge-pendiente]="factura.estado === 'PENDIENTE'"
                                      [class.badge-anulada]="factura.estado === 'ANULADA'">
                    {{ factura.estado }}
                  </span>
                </td>
                <td class="actions">
                  <button class="btn-icon btn-view" title="Ver detalle" (click)="verDetalle(factura)">
                    <span class="material-icons-outlined">visibility</span>
                  </button>
                  <button class="btn-icon btn-delete" title="Eliminar" (click)="eliminar(factura)">
                    <span class="material-icons-outlined">delete</span>
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="9" class="empty-state">
                  <span class="material-icons-outlined">receipt_long</span>
                  <p>No se encontraron facturas</p>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      @if (cargando()) {
        <div class="loading-overlay">
          <div class="spinner"></div>
          <p>Cargando facturas...</p>
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
    .badge-pagada { background: #e8f5e9; color: #2e7d32; }
    .badge-pendiente { background: #fff8e1; color: #f57f17; }
    .badge-anulada { background: #fce4ec; color: #c62828; }
    .actions { display: flex; gap: 8px; }
    .btn-icon { background: none; border: none; padding: 8px; border-radius: 8px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; }
    .btn-view { color: #1565c0; }
    .btn-view:hover { background: #e3f2fd; }
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
export class FacturasComponent implements OnInit {
  private facturasService = inject(FacturasService);

  facturas: Factura[] = [];
  facturasFiltradas = signal<Factura[]>([]);
  terminoBusqueda = '';
  filtroEstado = '';
  cargando = signal(true);

  ngOnInit(): void {
    this.cargarFacturas();
  }

  private cargarFacturas(): void {
    this.cargando.set(true);
    this.facturasService.obtenerTodos().subscribe({
      next: (data) => {
        this.facturas = data;
        this.facturasFiltradas.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  buscar(): void {
    let filtrados = this.facturas;
    const termino = this.terminoBusqueda.toLowerCase().trim();

    if (termino) {
      filtrados = filtrados.filter(f =>
        f.id.toString().includes(termino) ||
        f.cliente.nombre.toLowerCase().includes(termino)
      );
    }

    if (this.filtroEstado) {
      filtrados = filtrados.filter(f => f.estado === this.filtroEstado);
    }

    this.facturasFiltradas.set(filtrados);
  }

  abrirFormulario(): void {
    alert('Funcionalidad de creación de facturas. Los datos se guardarían en el backend.');
  }

  verDetalle(factura: Factura): void {
    const detalles = factura.detalles.map(d =>
      `  - ${d.producto.nombre} x${d.cantidad}: $${d.subtotal.toLocaleString()}`
    ).join('\n');

    alert(`FACTURA #${factura.id}\nCliente: ${factura.cliente.nombre}\nEstado: ${factura.estado}\n\nDetalles:\n${detalles}\n\nTotal: $${factura.total.toLocaleString()}`);
  }

  eliminar(factura: Factura): void {
    if (confirm(`¿Está seguro de anular la factura #${factura.id}?`)) {
      this.facturasService.eliminar(factura.id).subscribe(() => {
        this.cargarFacturas();
      });
    }
  }
}