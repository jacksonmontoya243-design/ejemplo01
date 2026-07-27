/**
 * ============================================================
 * COMPONENTE: App (Raíz)
 * ============================================================
 * Componente raíz de la aplicación Angular. Es el punto de
 * entrada de la aplicación y renderiza el router-outlet para
 * la navegación entre páginas.
 * ============================================================
 */

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <!-- El router-outlet renderiza la ruta activa:
         - /login → LoginComponent (sin layout)
         - /dashboard, /usuarios, etc. → LayoutComponent + contenido -->
    <router-outlet />
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class App {
  // El componente raíz solo actúa como contenedor del router
}