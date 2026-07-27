/**
 * ============================================================
 * SERVICIO: ProductosService
 * ============================================================
 * Proposito: Servicio que simula (Mock) las operaciones CRUD
 * para la gestion del inventario de productos. Proporciona
 * datos ficticios de productos con categorias variadas y
 * reemplaza completamente las llamadas a una API REST real.
 * 
 * Metodos disponibles:
 *   - obtenerTodos(): Retorna el catalogo completo de productos
 *   - obtenerPorId(id): Busca un producto por su ID
 *   - crear(producto): Simula la creacion de un nuevo producto
 *   - actualizar(producto): Simula la actualizacion de datos
 *   - eliminar(id): Simula la eliminacion de un producto
 * 
 * Todos los metodos retornan Observables con un retardo
 * simulado (delay) para emular la latencia de red.
 * ============================================================
 */

import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Producto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  /**
   * Base de datos interna de productos mock.
   * Contiene 10 productos con categorias como: Computacion,
   * Perifericos, Oficina, Muebles, Redes. Incluye un producto
   * con stock 0 (agotado) para mostrar el estado de inventario.
   */
  private readonly mockProductos: Producto[] = [
    { id: 1, nombre: 'Laptop ProBook 450', descripcion: 'Laptop empresarial con procesador i7 y 16GB RAM', precio: 4500000, stock: 15, categoria: 'Computacion', estado: 'Disponible', imagen: 'laptop.png', codigo: 'LAP-001' },
    { id: 2, nombre: 'Monitor LED 27"', descripcion: 'Monitor Full HD con panel IPS', precio: 1200000, stock: 8, categoria: 'Computacion', estado: 'Disponible', imagen: 'monitor.png', codigo: 'MON-001' },
    { id: 3, nombre: 'Teclado Mecanico RGB', descripcion: 'Teclado mecanico con retroiluminacion RGB', precio: 250000, stock: 25, categoria: 'Perifericos', estado: 'Disponible', imagen: 'teclado.png', codigo: 'TEC-001' },
    { id: 4, nombre: 'Mouse Inalambrico', descripcion: 'Mouse ergonomico inalambrico con sensor optico', precio: 120000, stock: 30, categoria: 'Perifericos', estado: 'Disponible', imagen: 'mouse.png', codigo: 'MOU-001' },
    { id: 5, nombre: 'Impresora Multifuncional', descripcion: 'Impresora laser multifuncional con WiFi', precio: 1800000, stock: 5, categoria: 'Oficina', estado: 'Disponible', imagen: 'impresora.png', codigo: 'IMP-001' },
    { id: 6, nombre: 'Escritorio Ejecutivo', descripcion: 'Escritorio en madera con acabado premium', precio: 950000, stock: 3, categoria: 'Muebles', estado: 'Disponible', imagen: 'escritorio.png', codigo: 'MUE-001' },
    { id: 7, nombre: 'Silla Ergonomica', descripcion: 'Silla de oficina con soporte lumbar ajustable', precio: 2100000, stock: 0, categoria: 'Muebles', estado: 'Agotado', imagen: 'silla.png', codigo: 'MUE-002' },
    { id: 8, nombre: 'Disco SSD 1TB', descripcion: 'Disco de estado solido NVMe de 1TB', precio: 380000, stock: 12, categoria: 'Computacion', estado: 'Disponible', imagen: 'ssd.png', codigo: 'ALM-001' },
    { id: 9, nombre: 'Webcam HD 1080p', descripcion: 'Camara web con resolucion Full HD y microfono integrado', precio: 180000, stock: 20, categoria: 'Perifericos', estado: 'Disponible', imagen: 'webcam.png', codigo: 'WEB-001' },
    { id: 10, nombre: 'Switch de Red 24 Puertos', descripcion: 'Switch Gigabit administrable de 24 puertos', precio: 3200000, stock: 7, categoria: 'Redes', estado: 'Disponible', imagen: 'switch.png', codigo: 'RED-001' }
  ];

  /**
   * Obtiene el catalogo completo de productos disponibles.
   * Simula una peticion GET a /api/productos.
   * @returns Observable que emite un arreglo con todos los productos
   */
  obtenerTodos(): Observable<Producto[]> {
    return of([...this.mockProductos]).pipe(delay(500));
  }

  /**
   * Busca un producto especifico por su identificador unico.
   * Simula una peticion GET a /api/productos/:id.
   * @param id - Identificador numerico del producto a buscar
   * @returns Observable con el producto encontrado o undefined si no existe
   */
  obtenerPorId(id: number): Observable<Producto | undefined> {
    const producto = this.mockProductos.find(p => p.id === id);
    return of(producto).pipe(delay(300));
  }

  /**
   * Simula la creacion de un nuevo producto en el inventario.
   * @param producto - Datos del nuevo producto (sin incluir el ID)
   * @returns Observable con el producto creado incluyendo su nuevo ID
   */
  crear(producto: Omit<Producto, 'id'>): Observable<Producto> {
    const nuevoProducto: Producto = {
      ...producto,
      id: Math.max(...this.mockProductos.map(p => p.id)) + 1
    };
    return of(nuevoProducto).pipe(delay(500));
  }

  /**
   * Simula la actualizacion de los datos de un producto existente.
   * @param producto - Objeto Producto completo con los datos actualizados
   * @returns Observable con el producto actualizado
   */
  actualizar(producto: Producto): Observable<Producto> {
    return of(producto).pipe(delay(500));
  }

  /**
   * Simula la eliminacion de un producto del inventario.
   * @param id - Identificador del producto a eliminar
   * @returns Observable que emite true indicando que la operacion fue exitosa
   */
  eliminar(id: number): Observable<boolean> {
    return of(true).pipe(delay(300));
  }
}