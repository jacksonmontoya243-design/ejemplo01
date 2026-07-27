/**
 * ============================================================
 * SERVICIO: ClientesService
 * ============================================================
 * Proposito: Servicio que simula (Mock) las operaciones CRUD
 * para la gestion de la cartera de clientes. Proporciona datos
 * ficticios con clientes de tipo persona natural y juridica,
 * con ciudades colombianas y documentos de identificacion reales.
 * 
 * Metodos disponibles:
 *   - obtenerTodos(): Retorna la lista completa de clientes
 *   - obtenerPorId(id): Busca un cliente por su ID
 *   - crear(cliente): Simula la creacion de un nuevo cliente
 *   - actualizar(cliente): Simula la actualizacion de datos
 *   - eliminar(id): Simula la eliminacion de un cliente
 * 
 * Todos los metodos retornan Observables con un retardo
 * simulado (delay) para emular la latencia de red.
 * ============================================================
 */

import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Cliente } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  /**
   * Base de datos interna de clientes mock.
   * Contiene 8 clientes alternando entre personas naturales (CC)
   * y personas juridicas (NIT), con ciudades principales de Colombia:
   * Bogota, Medellin, Cali, Pasto, Barranquilla, Bucaramanga, Pereira.
   */
  private readonly mockClientes: Cliente[] = [
    { id: 1, nombre: 'TechSolutions S.A.S.', tipoIdentificacion: 'NIT', numeroIdentificacion: '901.123.456-7', email: 'contacto@techsolutions.com', telefono: '+57 601 234 5678', direccion: 'Cra 12 #34-56, Bogota', ciudad: 'Bogota', tipo: 'Juridica', activo: true, fechaRegistro: new Date('2023-11-10') },
    { id: 2, nombre: 'Inversiones Gamma Ltda.', tipoIdentificacion: 'NIT', numeroIdentificacion: '901.789.012-3', email: 'info@inversionesgamma.com', telefono: '+57 604 345 6789', direccion: 'Cl 45 #67-89, Medellin', ciudad: 'Medellin', tipo: 'Juridica', activo: true, fechaRegistro: new Date('2024-01-22') },
    { id: 3, nombre: 'Maria Isabel Torres', tipoIdentificacion: 'CC', numeroIdentificacion: '52.123.456', email: 'maria.torres@email.com', telefono: '+57 315 456 7890', direccion: 'Av 3N #23-45, Cali', ciudad: 'Cali', tipo: 'Natural', activo: true, fechaRegistro: new Date('2024-03-05') },
    { id: 4, nombre: 'Distribuidora del Sur', tipoIdentificacion: 'NIT', numeroIdentificacion: '901.456.789-0', email: 'ventas@delsur.com', telefono: '+57 602 567 8901', direccion: 'Cra 8 #12-34, Pasto', ciudad: 'Pasto', tipo: 'Juridica', activo: true, fechaRegistro: new Date('2023-09-18') },
    { id: 5, nombre: 'Carlos Arturo Ramirez', tipoIdentificacion: 'CC', numeroIdentificacion: '78.987.654', email: 'carlos.ramirez@email.com', telefono: '+57 310 678 9012', direccion: 'Cl 78 #90-12, Bogota', ciudad: 'Bogota', tipo: 'Natural', activo: false, fechaRegistro: new Date('2024-04-30') },
    { id: 6, nombre: 'Comercializadora Norte S.A.S.', tipoIdentificacion: 'NIT', numeroIdentificacion: '901.321.654-8', email: 'comercial@norte.com', telefono: '+57 605 789 0123', direccion: 'Av 5 #67-89, Barranquilla', ciudad: 'Barranquilla', tipo: 'Juridica', activo: true, fechaRegistro: new Date('2024-06-12') },
    { id: 7, nombre: 'Ana Cecilia Mendoza', tipoIdentificacion: 'CC', numeroIdentificacion: '65.432.109', email: 'ana.mendoza@email.com', telefono: '+57 322 890 1234', direccion: 'Cl 34 #56-78, Bucaramanga', ciudad: 'Bucaramanga', tipo: 'Natural', activo: true, fechaRegistro: new Date('2024-02-28') },
    { id: 8, nombre: 'Servicios Empresariales XYZ', tipoIdentificacion: 'NIT', numeroIdentificacion: '901.654.321-0', email: 'info@serviciosxyz.com', telefono: '+57 606 901 2345', direccion: 'Cra 23 #45-67, Pereira', ciudad: 'Pereira', tipo: 'Juridica', activo: false, fechaRegistro: new Date('2024-05-15') }
  ];

  /**
   * Obtiene la lista completa de clientes registrados.
   * Simula una peticion GET a /api/clientes.
   * @returns Observable que emite un arreglo con todos los clientes
   */
  obtenerTodos(): Observable<Cliente[]> {
    return of([...this.mockClientes]).pipe(delay(500));
  }

  /**
   * Busca un cliente especifico por su identificador unico.
   * Simula una peticion GET a /api/clientes/:id.
   * @param id - Identificador numerico del cliente a buscar
   * @returns Observable con el cliente encontrado o undefined si no existe
   */
  obtenerPorId(id: number): Observable<Cliente | undefined> {
    const cliente = this.mockClientes.find(c => c.id === id);
    return of(cliente).pipe(delay(300));
  }

  /**
   * Simula la creacion de un nuevo cliente en el sistema.
   * @param cliente - Datos del nuevo cliente (sin incluir el ID)
   * @returns Observable con el cliente creado incluyendo su nuevo ID
   */
  crear(cliente: Omit<Cliente, 'id'>): Observable<Cliente> {
    const nuevoCliente: Cliente = {
      ...cliente,
      id: Math.max(...this.mockClientes.map(c => c.id)) + 1
    };
    return of(nuevoCliente).pipe(delay(500));
  }

  /**
   * Simula la actualizacion de los datos de un cliente existente.
   * @param cliente - Objeto Cliente completo con los datos actualizados
   * @returns Observable con el cliente actualizado
   */
  actualizar(cliente: Cliente): Observable<Cliente> {
    return of(cliente).pipe(delay(500));
  }

  /**
   * Simula la eliminacion de un cliente de la base de datos.
   * @param id - Identificador del cliente a eliminar
   * @returns Observable que emite true indicando que la operacion fue exitosa
   */
  eliminar(id: number): Observable<boolean> {
    return of(true).pipe(delay(300));
  }
}