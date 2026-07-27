/**
 * ============================================================
 * MÓDULO: Configuración de la Aplicación (app.config)
 * ============================================================
 * Configura los providers globales de la aplicación Angular:
 * - Router con las rutas definidas
 * - Soporte para Animaciones (Angular Material)
 * ============================================================
 */

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Configuración del router con las rutas de la aplicación
    provideRouter(routes),
    // Soporte para animaciones de Angular Material
    provideAnimations()
  ]
};