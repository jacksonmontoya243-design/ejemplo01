/**
 * ============================================================
 * COMPONENTE: ProductosComponent
 * ============================================================
 * Página de gestión de productos e inventario. Muestra una
 * tabla con todos los productos, permite buscar, filtrar por
 * categoría y estado, y simula operaciones CRUD.
 * ============================================================
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../services';
import { Producto } from '../../models';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2>Gestión de Productos</h2>
          <p class="page-subtitle">Administre el inventario de productos</p>
        </div>
        <button class="btn-primary" (click)="abrirFormulario()">
          <span class="material-icons-outlined">add</span>
          Nuevo Producto
        </button>
      </div>

      <!-- Filtros -->
      <div class="filters">
        <div class="search-bar">
          <span class="material-icons-outlined search-icon">search</span>
          <input type="text" [(ngModel)]="terminoBusqueda" (input)="buscar()" placeholder="Buscar productos..." class="search-input" />
        </div>
        <select [(ngModel)]="filtroCategoria" (change)="buscar()" class="filter-select">
          <option value="">Todas las categorías</option>
          @for (cat of categorias; track cat) {
            <option [value]="cat">{{ cat }}</option>
          }
        </select>
        <select [(ngModel)]="filtroEstado" (change)="buscar()" class="filter-select">
          <option value="">Todos los estados</option>
          <option value="Disponible">Disponible</option>
          <option value="Agotado">Agotado</option>
        </select>
      </div>

      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (producto of productosFiltrados(); track producto.id) {
              <tr>
                <td><span class="badge badge-codigo">{{ producto.codigo }}</span></td>
                <td>
                  <div class="product-info">
                    <strong>{{ producto.nombre }}</strong>
                    <small>{{ producto.descripcion }}</small>
                  </div>
                </td>
                <td>{{ producto.categoria }}</td>
                <td><strong>{{ producto.precio | currency:'COP':'symbol-narrow':'1.0-0' }}</strong></td>
                <td>
                  <span [class.stock-bajo]="producto.stock > 0 && producto.stock <= 5"
                        [class.stock-agotado]="producto.stock === 0">
                    {{ producto.stock }}
                  </span>
                </td>
                <td>
                  <span class="badge" [class.badge-disponible]="producto.estado === 'Disponible'"
                                      [class.badge-agotado]="producto.estado === 'Agotado'">
                    {{ producto.estado }}
                  </span>
                </td>
                <td class="actions">
                  <button class="btn-icon btn-edit" title="Editar" (click)="editar(producto)">
                    <span class="material-icons-outlined">edit</span>
                  </button>
                  <button class="btn-icon btn-delete" title="Eliminar" (click)="eliminar(producto)">
                    <span class="material-icons-outlined">delete</span>
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="7" class="empty-state">
                  <span class="material-icons-outlined">inventory_2</span>
                  <p>No se encontraron productos</p>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      @if (cargando()) {
        <div class="loading-overlay">
          <div class="spinner"></div>
          <p>Cargando productos...</p>
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

    .product-info { display: flex; flex-direction: column; }
    .product-info small { color: #888; font-size: 12px; margin-top: 2px; }

    .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 500; }
    .badge-codigo { background: #e8eaf6; color: #1a237e; font-family: monospace; }
    .badge-disponible { background: #e8f5e9; color: #2e7d32; }
    .badge-agotado { background: #fce4ec; color: #c62828; }

    .stock-bajo { color: #e65100; font-weight: 600; }
    .stock-agotado { color: #c62828; font-weight: 600; }

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
export class ProductosComponent implements OnInit {
  private productosService = inject(ProductosService);

  productos: Producto[] = [];
  productosFiltrados = signal<Producto[]>([]);
  terminoBusqueda = '';
  filtroCategoria = '';
  filtroEstado = '';
  cargando = signal(true);

  get categorias(): string[] {
    return [...new Set(this.productos.map(p => p.categoria))];
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  private cargarProductos(): void {
    this.cargando.set(true);
    this.productosService.obtenerTodos().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosFiltrados.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  buscar(): void {
    let filtrados = this.productos;
    const termino = this.terminoBusqueda.toLowerCase().trim();

    if (termino) {
      filtrados = filtrados.filter(p =>
        p.nombre.toLowerCase().includes(termino) ||
        p.codigo.toLowerCase().includes(termino) ||
        p.categoria.toLowerCase().includes(termino)
      );
    }

    if (this.filtroCategoria) {
      filtrados = filtrados.filter(p => p.categoria === this.filtroCategoria);
    }

    if (this.filtroEstado) {
      filtrados = filtrados.filter(p => p.estado === this.filtroEstado);
    }

    this.productosFiltrados.set(filtrados);
  }

  abrirFormulario(): void {
    alert('Funcionalidad de creación de productos. Los datos se guardarían en el backend.');
  }

  editar(producto: Producto): void {
    alert(`Editando producto: ${producto.nombre}`);
  }

  eliminar(producto: Producto): void {
    if (confirm(`¿Está seguro de eliminar el producto "${producto.nombre}"?`)) {
      this.productosService.eliminar(producto.id).subscribe(() => {
        this.cargarProductos();
      });
    }
  }
}