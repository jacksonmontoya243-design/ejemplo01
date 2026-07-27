/**
 * ============================================================
 * SERVICIO: FacturasService
 * ============================================================
 * Proposito: Servicio que simula (Mock) las operaciones CRUD
 * para la gestion de facturacion. Incluye datos de facturas
 * con sus respectivos detalles (productos, cantidades, precios)
 * y clientes asociados. Reemplaza completamente las llamadas
 * a una API REST real de facturacion electronica.
 * 
 * Metodos disponibles:
 *   - obtenerTodos(): Retorna el listado de todas las facturas
 *   - obtenerPorId(id): Busca una factura por su numero
 *   - crear(factura): Simula la creacion de una nueva factura
 *   - actualizarEstado(id, estado): Cambia el estado de una factura
 *   - eliminar(id): Simula la anulacion de una factura
 * 
 * Las facturas incluyen calculos de subtotal, IVA (19%) y total.
 * ============================================================
 */

import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Factura, Cliente, Producto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {
  /** Clientes de referencia utilizados en las facturas mock */
  private readonly clientes: Cliente[] = [
    { id: 1, nombre: 'TechSolutions S.A.S.', tipoIdentificacion: 'NIT', numeroIdentificacion: '901.123.456-7', email: 'contacto@techsolutions.com', telefono: '+57 601 234 5678', direccion: 'Cra 12 #34-56', ciudad: 'Bogota', tipo: 'Juridica', activo: true, fechaRegistro: new Date('2023-11-10') },
    { id: 3, nombre: 'Maria Isabel Torres', tipoIdentificacion: 'CC', numeroIdentificacion: '52.123.456', email: 'maria.torres@email.com', telefono: '+57 315 456 7890', direccion: 'Av 3N #23-45', ciudad: 'Cali', tipo: 'Natural', activo: true, fechaRegistro: new Date('2024-03-05') },
    { id: 6, nombre: 'Comercializadora Norte S.A.S.', tipoIdentificacion: 'NIT', numeroIdentificacion: '901.321.654-8', email: 'comercial@norte.com', telefono: '+57 605 789 0123', direccion: 'Av 5 #67-89', ciudad: 'Barranquilla', tipo: 'Juridica', activo: true, fechaRegistro: new Date('2024-06-12') }
  ];

  /** Productos de referencia utilizados en las facturas mock */
  private readonly productos: Producto[] = [
    { id: 1, nombre: 'Laptop ProBook 450', descripcion: 'Laptop empresarial', precio: 4500000, stock: 15, categoria: 'Computacion', estado: 'Disponible', imagen: '', codigo: 'LAP-001' },
    { id: 2, nombre: 'Monitor LED 27"', descripcion: 'Monitor Full HD', precio: 1200000, stock: 8, categoria: 'Computacion', estado: 'Disponible', imagen: '', codigo: 'MON-001' },
    { id: 3, nombre: 'Teclado Mecanico RGB', descripcion: 'Teclado mecanico', precio: 250000, stock: 25, categoria: 'Perifericos', estado: 'Disponible', imagen: '', codigo: 'TEC-001' },
    { id: 4, nombre: 'Mouse Inalambrico', descripcion: 'Mouse ergonomico', precio: 120000, stock: 30, categoria: 'Perifericos', estado: 'Disponible', imagen: '', codigo: 'MOU-001' }
  ];

  /**
   * Base de datos interna de facturas mock.
   * Contiene 5 facturas con estados variados (PAGADA, PENDIENTE, ANULADA)
   * y diferentes metodos de pago. Cada factura incluye uno o mas detalles
   * con productos, cantidades y calculos de subtotal, IVA y total.
   */
  private readonly mockFacturas: Factura[] = [
    {
      id: 1001, cliente: this.clientes[0], fechaEmision: new Date('2024-07-01'), fechaVencimiento: new Date('2024-07-31'),
      detalles: [
        { producto: this.productos[0], cantidad: 2, precioUnitario: 4500000, subtotal: 9000000 },
        { producto: this.productos[1], cantidad: 3, precioUnitario: 1200000, subtotal: 3600000 }
      ],
      subtotal: 12600000, iva: 2394000, total: 14994000, estado: 'PAGADA', metodoPago: 'Transferencia'
    },
    {
      id: 1002, cliente: this.clientes[1], fechaEmision: new Date('2024-07-15'), fechaVencimiento: new Date('2024-08-14'),
      detalles: [
        { producto: this.productos[2], cantidad: 5, precioUnitario: 250000, subtotal: 1250000 },
        { producto: this.productos[3], cantidad: 5, precioUnitario: 120000, subtotal: 600000 }
      ],
      subtotal: 1850000, iva: 351500, total: 2201500, estado: 'PENDIENTE', metodoPago: 'Contado'
    },
    {
      id: 1003, cliente: this.clientes[2], fechaEmision: new Date('2024-06-20'), fechaVencimiento: new Date('2024-07-20'),
      detalles: [
        { producto: this.productos[0], cantidad: 1, precioUnitario: 4500000, subtotal: 4500000 }
      ],
      subtotal: 4500000, iva: 855000, total: 5355000, estado: 'PAGADA', metodoPago: 'Credito'
    },
    {
      id: 1004, cliente: this.clientes[0], fechaEmision: new Date('2024-08-01'), fechaVencimiento: new Date('2024-09-01'),
      detalles: [
        { producto: this.productos[1], cantidad: 2, precioUnitario: 1200000, subtotal: 2400000 },
        { producto: this.productos[3], cantidad: 10, precioUnitario: 120000, subtotal: 1200000 }
      ],
      subtotal: 3600000, iva: 684000, total: 4284000, estado: 'PENDIENTE', metodoPago: 'Transferencia'
    },
    {
      id: 1005, cliente: this.clientes[1], fechaEmision: new Date('2024-05-10'), fechaVencimiento: new Date('2024-06-09'),
      detalles: [
        { producto: this.productos[2], cantidad: 3, precioUnitario: 250000, subtotal: 750000 }
      ],
      subtotal: 750000, iva: 142500, total: 892500, estado: 'ANULADA', metodoPago: 'Contado'
    }
  ];

  /**
   * Obtiene el listado completo de facturas emitidas.
   * Simula una peticion GET a /api/facturas.
   * @returns Observable que emite un arreglo con todas las facturas
   */
  obtenerTodos(): Observable<Factura[]> {
    return of([...this.mockFacturas]).pipe(delay(500));
  }

  /**
   * Busca una factura especifica por su numero de factura.
   * Simula una peticion GET a /api/facturas/:id.
   * @param id - Numero de factura a buscar
   * @returns Observable con la factura encontrada o undefined si no existe
   */
  obtenerPorId(id: number): Observable<Factura | undefined> {
    const factura = this.mockFacturas.find(f => f.id === id);
    return of(factura).pipe(delay(300));
  }

  /**
   * Simula la creacion de una nueva factura en el sistema.
   * @param factura - Datos de la nueva factura (sin incluir el ID)
   * @returns Observable con la factura creada incluyendo su nuevo ID
   */
  crear(factura: Omit<Factura, 'id'>): Observable<Factura> {
    const nuevaFactura: Factura = {
      ...factura,
      id: Math.max(...this.mockFacturas.map(f => f.id)) + 1
    };
    return of(nuevaFactura).pipe(delay(500));
  }

  /**
   * Simula la actualizacion del estado de una factura
   * (ej: cambiar de PENDIENTE a PAGADA o ANULADA).
   * @param id - Numero de factura a actualizar
   * @param estado - Nuevo estado de la factura
   * @returns Observable que emite true indicando que la operacion fue exitosa
   */
  actualizarEstado(id: number, estado: string): Observable<boolean> {
    return of(true).pipe(delay(300));
  }

  /**
   * Simula la eliminacion (anulacion) de una factura.
   * @param id - Numero de factura a eliminar
   * @returns Observable que emite true indicando que la operacion fue exitosa
   */
  eliminar(id: number): Observable<boolean> {
    return of(true).pipe(delay(300));
  }
}