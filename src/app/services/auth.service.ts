/**
 * ============================================================
 * SERVICIO: AuthService
 * ============================================================
 * Propósito: Servicio de autenticación que simula (Mock) el
 * proceso de inicio y cierre de sesión sin necesidad de un
 * backend real. Utiliza localStorage para persistir la sesión
 * y Signals para notificar cambios de estado en tiempo real.
 * 
 * Datos de acceso por defecto:
 *   - Usuario: admin
 *   - Contraseña: admin123
 * 
 * Funcionamiento:
 *   1. Al iniciar la aplicación, verifica si hay una sesión
 *      guardada en localStorage y la restaura automáticamente.
 *   2. El metodo login() compara las credenciales contra un
 *      usuario y contrasena fijos hardcodeados.
 *   3. Si las credenciales son correctas, guarda los datos
 *      del usuario en localStorage y actualiza la Signal.
 *   4. El metodo logout() limpia localStorage y la Signal.
 *   5. Los componentes pueden suscribirse a isAuthenticated()
 *      para reaccionar a cambios en el estado de autenticacion.
 * ============================================================
 */

import { Injectable, PLATFORM_ID, Inject, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, delay } from 'rxjs';
import { Usuario, Credenciales, AuthResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly mockUsuario: Usuario = {
    id: 1,
    nombre: 'Administrador del Sistema',
    email: 'admin@empresa.com',
    rol: 'Administrador',
    activo: true,
    fechaCreacion: new Date('2024-01-01'),
    telefono: '+57 300 123 4567',
    departamento: 'Tecnologia'
  };

  private usuarioActual = signal<Usuario | null>(null);

  readonly isAuthenticated = computed(() => this.usuarioActual() !== null);

  readonly rolActual = computed(() => this.usuarioActual()?.rol ?? '');

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.cargarSesion();
  }

  private cargarSesion(): void {
    if (isPlatformBrowser(this.platformId)) {
      const sesionGuardada = localStorage.getItem('auth_user');
      if (sesionGuardada) {
        try {
          this.usuarioActual.set(JSON.parse(sesionGuardada));
        } catch {
          localStorage.removeItem('auth_user');
        }
      }
    }
  }

  getUsuarioActual(): Usuario | null {
    return this.usuarioActual();
  }

  login(credenciales: Credenciales): Observable<AuthResponse> {
    if (credenciales.usuario === 'admin' && credenciales.contrasena === 'admin123') {
      const respuesta: AuthResponse = {
        success: true,
        mensaje: 'Inicio de sesion exitoso',
        token: 'mock-token-' + Date.now(),
        usuario: this.mockUsuario
      };
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('auth_user', JSON.stringify(this.mockUsuario));
        localStorage.setItem('auth_token', respuesta.token);
      }
      this.usuarioActual.set(this.mockUsuario);
      return of(respuesta).pipe(delay(800));
    }
    return of({
      success: false,
      mensaje: 'Usuario o contrasena incorrectos',
      token: '',
      usuario: null
    }).pipe(delay(800));
  }

  logout(): void {
    this.usuarioActual.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
    }
  }
}