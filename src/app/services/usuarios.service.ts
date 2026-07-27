/**
 * ============================================================
 * SERVICIO: UsuariosService
 * ============================================================
 * Propósito: Servicio que simula (Mock) las operaciones CRUD
 * para la gestión de usuarios del sistema. Proporciona datos
 * ficticios de usuarios y reemplaza completamente las llamadas
 * a una API REST real.
 * 
 * Metodos disponibles:
 *   - obtenerTodos(): Retorna la lista completa de usuarios
 *   - obtenerPorId(id): Busca un usuario por su ID
 *   - crear(usuario): Simula la creacion de un nuevo usuario
 *   - actualizar(usuario): Simula la actualizacion de datos
 *   - eliminar(id): Simula la eliminacion de un usuario
 * 
 * Todos los metodos retornan Observables con un retardo
 * simulado (delay) para emular la latencia de red.
 * ============================================================
 */

import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Usuario } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  /**
   * Base de datos interna de usuarios mock.
   * Contiene 8 usuarios con datos ficticios pero realistas,
   * incluyendo nombres colombianos, roles variados y estados
   * mixtos (activos e inactivos).
   */
  private readonly mockUsuarios: Usuario[] = [
    { id: 1, nombre: 'Carlos Andres Lopez', email: 'carlos.lopez@empresa.com', rol: 'Administrador', activo: true, fechaCreacion: new Date('2024-01-15'), telefono: '+57 310 123 4567', departamento: 'Tecnologia' },
    { id: 2, nombre: 'Maria Fernanda Rincon', email: 'maria.rincon@empresa.com', rol: 'Usuario', activo: true, fechaCreacion: new Date('2024-02-20'), telefono: '+57 320 234 5678', departamento: 'Ventas' },
    { id: 3, nombre: 'Pedro Jesus Martinez', email: 'pedro.martinez@empresa.com', rol: 'Usuario', activo: true, fechaCreacion: new Date('2024-03-10'), telefono: '+57 300 345 6789', departamento: 'Marketing' },
    { id: 4, nombre: 'Ana Sofia Giraldo', email: 'ana.giraldo@empresa.com', rol: 'Supervisor', activo: true, fechaCreacion: new Date('2024-01-05'), telefono: '+57 311 456 7890', departamento: 'Recursos Humanos' },
    { id: 5, nombre: 'Luis Fernando Ortiz', email: 'luis.ortiz@empresa.com', rol: 'Usuario', activo: false, fechaCreacion: new Date('2024-04-22'), telefono: '+57 322 567 8901', departamento: 'Operaciones' },
    { id: 6, nombre: 'Diana Patricia Mora', email: 'diana.mora@empresa.com', rol: 'Usuario', activo: true, fechaCreacion: new Date('2024-05-30'), telefono: '+57 315 678 9012', departamento: 'Contabilidad' },
    { id: 7, nombre: 'Jorge Alberto Silva', email: 'jorge.silva@empresa.com', rol: 'Supervisor', activo: true, fechaCreacion: new Date('2024-02-14'), telefono: '+57 318 789 0123', departamento: 'Tecnologia' },
    { id: 8, nombre: 'Laura Catalina Perez', email: 'laura.perez@empresa.com', rol: 'Usuario', activo: false, fechaCreacion: new Date('2024-06-18'), telefono: '+57 301 890 1234', departamento: 'Ventas' }
  ];

  /**
   * Obtiene la lista completa de usuarios registrados.
   * Simula una peticion GET a /api/usuarios.
   * @returns Observable que emite un arreglo con todos los usuarios
   */
  obtenerTodos(): Observable<Usuario[]> {
    return of([...this.mockUsuarios]).pipe(delay(500));
  }

  /**
   * Busca un usuario especifico por su identificador unico.
   * Simula una peticion GET a /api/usuarios/:id.
   * @param id - Identificador numerico del usuario a buscar
   * @returns Observable con el usuario encontrado o undefined si no existe
   */
  obtenerPorId(id: number): Observable<Usuario | undefined> {
    const usuario = this.mockUsuarios.find(u => u.id === id);
    return of(usuario).pipe(delay(300));
  }

  /**
   * Simula la creacion de un nuevo usuario en el sistema.
   * Asigna un ID autoincremental basado en el maximo ID existente.
   * @param usuario - Datos del nuevo usuario (sin incluir el ID)
   * @returns Observable con el usuario creado incluyendo su nuevo ID
   */
  crear(usuario: Omit<Usuario, 'id'>): Observable<Usuario> {
    const nuevoUsuario: Usuario = {
      ...usuario,
      id: Math.max(...this.mockUsuarios.map(u => u.id)) + 1
    };
    return of(nuevoUsuario).pipe(delay(500));
  }

  /**
   * Simula la actualizacion de los datos de un usuario existente.
   * @param usuario - Objeto Usuario completo con los datos actualizados
   * @returns Observable con el usuario actualizado
   */
  actualizar(usuario: Usuario): Observable<Usuario> {
    return of(usuario).pipe(delay(500));
  }

  /**
   * Simula la eliminacion logica o fisica de un usuario.
   * @param id - Identificador del usuario a eliminar
   * @returns Observable que emite true indicando que la operacion fue exitosa
   */
  eliminar(id: number): Observable<boolean> {
    return of(true).pipe(delay(300));
  }
}