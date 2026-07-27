/**
 * ============================================================
 * GUARD DE RUTA: AuthGuard
 * ============================================================
 * Proposito: Protege las rutas del dashboard para que solo
 * puedan ser accedidas por usuarios autenticados. Si un
 * usuario no ha iniciado sesion e intenta acceder a una
 * ruta protegida, sera redirigido automaticamente a la
 * pagina de inicio de sesion (/login).
 * 
 * Funcionamiento:
 *   1. Angular Router ejecuta esta funcion antes de activar
 *      cualquier ruta protegida.
 *   2. Verifica el estado de autenticacion mediante AuthService.
 *   3. Si el usuario esta autenticado, permite el acceso (true).
 *   4. Si no, redirige a /login usando UrlTree.
 * 
 * Uso: Se aplica en app.routes.ts con canActivate: [authGuard]
 * a las rutas hijas del LayoutComponent.
 * ============================================================
 */

import { inject } from '@angular/core';
import { Router, type CanActivateFn, type UrlTree } from '@angular/router';
import { AuthService } from '../services';

/**
 * Funcion guard que verifica la autenticacion del usuario.
 * Se ejecuta automaticamente cuando Angular Router navega
 * a una ruta que tiene este guard en su configuracion.
 * 
 * @returns true si el usuario esta autenticado, o un UrlTree
 *          que redirige a /login si no lo esta.
 */
export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  // Injectar servicios necesarios
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar estado de autenticacion mediante la Signal
  if (authService.isAuthenticated()) {
    return true; // Usuario autenticado, permitir acceso
  }

  // Usuario no autenticado, redirigir a la pagina de login
  return router.parseUrl('/login');
};