/**
 * ============================================================
 * COMPONENTE: DashboardComponent
 * ============================================================
 * Página principal del dashboard que muestra un resumen
 * general del sistema con tarjetas de estadísticas y datos
 * relevantes de usuarios, productos, clientes y facturas.
 * ============================================================
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuariosService, ProductosService, ClientesService, FacturasService } from '../../services';
import { Usuario, Producto, Cliente, Factura } from '../../models';

/** Interfaz para las tarjetas de estadísticas */
interface TarjetaEstadistica {
  titulo: string;
  valor: number;
  icono: string;
  color: string;
  ruta: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <h2 class="dashboard-title">Panel de Control</h2>
      <p class="dashboard-subtitle">Resumen general del sistema</p>

      <!-- Tarjetas de estadísticas -->
      <div class="stats-grid">
        @for (tarjeta of tarjetas; track tarjeta.titulo) {
          <a [routerLink]="tarjeta.ruta" class="stat-card" style="--card-color: {{ tarjeta.color }}">
            <div class="stat-icon" [style.background]="tarjeta.color + '15'">
              <span class="material-icons-outlined" [style.color]="tarjeta.color">{{ tarjeta.icono }}</span>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ tarjeta.valor | number }}</span>
              <span class="stat-label">{{ tarjeta.titulo }}</span>
            </div>
            <span class="stat-arrow material-icons-outlined">arrow_forward</span>
          </a>
        }
      </div>

      <!-- Sección de contenido reciente -->
      <div class="content-grid">
        <!-- Tabla de últimos usuarios -->
        <div class="card">
          <div class="card-header">
            <h3>Últimos Usuarios</h3>
            <a [routerLink]="'/usuarios'" class="card-link">Ver todos</a>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  @for (usuario of ultimosUsuarios; track usuario.id) {
                    <tr>
                      <td>{{ usuario.nombre }}</td>
                      <td>{{ usuario.email }}</td>
                      <td><span class="badge badge-rol">{{ usuario.rol }}</span></td>
                      <td>
                        <span class="badge" [class.badge-activo]="usuario.activo" [class.badge-inactivo]="!usuario.activo">
                          {{ usuario.activo ? 'Activo' : 'Inactivo' }}
                        </span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Tabla de últimos productos -->
        <div class="card">
          <div class="card-header">
            <h3>Productos Recientes</h3>
            <a [routerLink]="'/productos'" class="card-link">Ver todos</a>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  @for (producto of ultimosProductos; track producto.id) {
                    <tr>
                      <td>{{ producto.nombre }}</td>
                      <td>{{ producto.precio | currency:'COP':'symbol-narrow':'1.0-0' }}</td>
                      <td>{{ producto.stock }}</td>
                      <td>
                        <span class="badge" [class.badge-disponible]="producto.estado === 'Disponible'" [class.badge-agotado]="producto.estado === 'Agotado'">
                          {{ producto.estado }}
                        </span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Últimas facturas -->
      <div class="card" style="margin-top: 24px;">
        <div class="card-header">
          <h3>Últimas Facturas</h3>
          <a [routerLink]="'/facturas'" class="card-link">Ver todas</a>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th># Factura</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                @for (factura of ultimasFacturas; track factura.id) {
                  <tr>
                    <td><strong>#{{ factura.id }}</strong></td>
                    <td>{{ factura.cliente.nombre }}</td>
                    <td>{{ factura.fechaEmision | date:'dd/MM/yyyy' }}</td>
                    <td>{{ factura.total | currency:'COP':'symbol-narrow':'1.0-0' }}</td>
                    <td>
                      <span class="badge" [class.badge-pagada]="factura.estado === 'PAGADA'"
                                      [class.badge-pendiente]="factura.estado === 'PENDIENTE'"
                                      [class.badge-anulada]="factura.estado === 'ANULADA'">
                        {{ factura.estado }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-title {
      font-size: 24px;
      font-weight: 700;
      color: #1a237e;
      margin: 0 0 4px;
    }

    .dashboard-subtitle {
      color: #888;
      font-size: 14px;
      margin: 0 0 24px;
    }

    /* ─── Grid de estadísticas ────────────────────────────── */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      text-decoration: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .stat-icon {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-icon span {
      font-size: 26px;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 26px;
      font-weight: 700;
      color: #333;
    }

    .stat-label {
      font-size: 13px;
      color: #888;
      margin-top: 2px;
    }

    .stat-arrow {
      position: absolute;
      right: 16px;
      color: #ccc;
      font-size: 20px;
      transition: transform 0.3s;
    }

    .stat-card:hover .stat-arrow {
      transform: translateX(4px);
      color: #1a237e;
    }

    /* ─── Grid de contenido ───────────────────────────────── */
    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    /* ─── Tarjetas ────────────────────────────────────────── */
    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      overflow: hidden;
    }

    .card-header {
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f0f0f0;
    }

    .card-header h3 {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .card-link {
      font-size: 13px;
      color: #1a237e;
      text-decoration: none;
      font-weight: 500;
    }

    .card-link:hover {
      text-decoration: underline;
    }

    .card-body {
      padding: 0;
    }

    /* ─── Tablas ──────────────────────────────────────────── */
    .table-responsive {
      overflow-x: auto;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
    }

    .table th {
      text-align: left;
      padding: 12px 20px;
      font-size: 12px;
      font-weight: 600;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: #fafafa;
      border-bottom: 1px solid #f0f0f0;
    }

    .table td {
      padding: 14px 20px;
      font-size: 14px;
      color: #444;
      border-bottom: 1px solid #f5f5f5;
    }

    .table tr:last-child td {
      border-bottom: none;
    }

    .table tr:hover td {
      background: #f8f9ff;
    }

    /* ─── Badges ──────────────────────────────────────────── */
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

    .badge-disponible {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .badge-agotado {
      background: #fff3e0;
      color: #e65100;
    }

    .badge-pagada {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .badge-pendiente {
      background: #fff8e1;
      color: #f57f17;
    }

    .badge-anulada {
      background: #fce4ec;
      color: #c62828;
    }
  `]
})
export class DashboardComponent implements OnInit {
  /** Servicios injectados */
  private usuariosService = inject(UsuariosService);
  private productosService = inject(ProductosService);
  private clientesService = inject(ClientesService);
  private facturasService = inject(FacturasService);

  /** Datos cargados */
  usuarios: Usuario[] = [];
  productos: Producto[] = [];
  clientes: Cliente[] = [];
  facturas: Factura[] = [];

  /** Tarjetas de estadísticas */
  tarjetas: TarjetaEstadistica[] = [];

  /** Últimos registros para mostrar */
  ultimosUsuarios: Usuario[] = [];
  ultimosProductos: Producto[] = [];
  ultimasFacturas: Factura[] = [];

  /**
   * Al inicializar el componente, carga todos los datos
   */
  ngOnInit(): void {
    this.cargarDatos();
  }

  /**
   * Carga los datos desde los servicios y actualiza las
   * tarjetas de estadísticas y las tablas de contenido.
   */
  private cargarDatos(): void {
    this.usuariosService.obtenerTodos().subscribe(data => {
      this.usuarios = data;
      this.ultimosUsuarios = data.slice(0, 4);
      this.actualizarTarjetas();
    });

    this.productosService.obtenerTodos().subscribe(data => {
      this.productos = data;
      this.ultimosProductos = data.slice(0, 4);
      this.actualizarTarjetas();
    });

    this.clientesService.obtenerTodos().subscribe(data => {
      this.clientes = data;
      this.actualizarTarjetas();
    });

    this.facturasService.obtenerTodos().subscribe(data => {
      this.facturas = data;
      this.ultimasFacturas = data.slice(0, 5);
      this.actualizarTarjetas();
    });
  }

  /**
   * Actualiza las tarjetas de estadísticas con los datos actuales.
   * Se llama cada vez que se completa la carga de un servicio.
   */
  private actualizarTarjetas(): void {
    this.tarjetas = [
      { titulo: 'Usuarios Registrados', valor: this.usuarios.length, icono: 'people', color: '#1a237e', ruta: '/usuarios' },
      { titulo: 'Productos en Stock', valor: this.productos.length, icono: 'inventory_2', color: '#00897b', ruta: '/productos' },
      { titulo: 'Clientes Activos', valor: this.clientes.filter(c => c.activo).length, icono: 'groups', color: '#e65100', ruta: '/clientes' },
      { titulo: 'Facturas Emitidas', valor: this.facturas.length, icono: 'receipt', color: '#2e7d32', ruta: '/facturas' }
    ];
  }
}