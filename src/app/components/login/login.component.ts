/**
 * ============================================================
 * COMPONENTE: LoginComponent
 * ============================================================
 * Componente de inicio de sesión. Muestra un formulario con
 * campos de usuario y contraseña. Utiliza AuthService para
 * autenticar al usuario de forma simulada (Mock).
 * 
 * Datos de acceso por defecto:
 *   - Usuario: admin
 *   - Contraseña: admin123
 * ============================================================
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services';
import { Credenciales } from '../../models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <!-- Contenedor principal centrado vertical y horizontalmente -->
    <div class="login-container">
      <div class="login-card">
        <!-- Logo y título -->
        <div class="login-header">
          <div class="logo-icon">
            <span class="material-icons-outlined">business</span>
          </div>
          <h1>Sistema de Gestión Empresarial</h1>
          <p class="subtitle">Inicie sesión para acceder al sistema</p>
        </div>

        <!-- Formulario de inicio de sesión -->
        <form (ngSubmit)="onSubmit()" class="login-form">
          <!-- Campo de usuario -->
          <div class="form-group">
            <label for="usuario">
              <span class="material-icons-outlined">person</span>
              Usuario
            </label>
            <input
              id="usuario"
              type="text"
              [(ngModel)]="credenciales.usuario"
              name="usuario"
              placeholder="Ingrese su usuario"
              required
              autocomplete="username"
            />
          </div>

          <!-- Campo de contraseña -->
          <div class="form-group">
            <label for="contrasena">
              <span class="material-icons-outlined">lock</span>
              Contraseña
            </label>
            <input
              id="contrasena"
              type="password"
              [(ngModel)]="credenciales.contrasena"
              name="contrasena"
              placeholder="Ingrese su contraseña"
              required
              autocomplete="current-password"
            />
          </div>

          <!-- Mensaje de error -->
          @if (errorMensaje) {
            <div class="error-message">
              <span class="material-icons-outlined">error</span>
              {{ errorMensaje }}
            </div>
          }

          <!-- Botón de inicio de sesión -->
          <button type="submit" class="btn-login" [disabled]="cargando">
            @if (cargando) {
              <span class="spinner"></span>
              Iniciando sesión...
            } @else {
              <span class="material-icons-outlined">login</span>
              Iniciar Sesión
            }
          </button>
        </form>

        <!-- Información de credenciales de prueba -->
        <div class="demo-info">
          <p>
            <span class="material-icons-outlined">info</span>
            Credenciales de demostración
          </p>
          <p class="creds">Usuario: <strong>admin</strong> | Contraseña: <strong>admin123</strong></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Contenedor principal - fondo con gradiente */
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%);
      padding: 20px;
    }

    /* Tarjeta de login */
    .login-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.5s ease-out;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Encabezado */
    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .logo-icon {
      width: 72px;
      height: 72px;
      background: linear-gradient(135deg, #1a237e, #3949ab);
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }

    .logo-icon span {
      font-size: 36px;
      color: white;
    }

    .login-header h1 {
      font-size: 22px;
      font-weight: 600;
      color: #1a237e;
      margin: 0 0 8px;
    }

    .subtitle {
      color: #666;
      font-size: 14px;
      margin: 0;
    }

    /* Formulario */
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      font-weight: 500;
      color: #444;
    }

    .form-group label span {
      font-size: 18px;
      color: #1a237e;
    }

    .form-group input {
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 15px;
      transition: border-color 0.3s, box-shadow 0.3s;
      outline: none;
      font-family: inherit;
    }

    .form-group input:focus {
      border-color: #1a237e;
      box-shadow: 0 0 0 3px rgba(26, 35, 126, 0.1);
    }

    .form-group input::placeholder {
      color: #aaa;
    }

    /* Mensaje de error */
    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #fce4ec;
      color: #c62828;
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 14px;
      border: 1px solid #f8bbd0;
    }

    .error-message span {
      font-size: 20px;
    }

    /* Botón de login */
    .btn-login {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 24px;
      background: linear-gradient(135deg, #1a237e, #3949ab);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      font-family: inherit;
    }

    .btn-login:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(26, 35, 126, 0.4);
    }

    .btn-login:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    /* Spinner de carga */
    .spinner {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Información de demo */
    .demo-info {
      margin-top: 24px;
      padding: 16px;
      background: #e8eaf6;
      border-radius: 10px;
      text-align: center;
    }

    .demo-info p {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin: 0 0 8px;
      font-size: 13px;
      color: #283593;
    }

    .demo-info span {
      font-size: 18px;
    }

    .demo-info .creds {
      font-size: 13px;
      color: #444;
      margin: 0;
    }

    .demo-info strong {
      color: #1a237e;
    }
  `]
})
export class LoginComponent {
  /** Servicio de autenticación */
  private authService = inject(AuthService);
  /** Router para navegación */
  private router = inject(Router);

  /** Objeto con las credenciales del formulario */
  credenciales: Credenciales = { usuario: '', contrasena: '' };

  /** Indicador de carga */
  cargando = false;

  /** Mensaje de error a mostrar */
  errorMensaje = '';

  /**
   * Procesa el envío del formulario de login
   * Valida las credenciales y redirige al dashboard si son correctas
   */
  onSubmit(): void {
    // Validar que los campos no estén vacíos
    if (!this.credenciales.usuario || !this.credenciales.contrasena) {
      this.errorMensaje = 'Por favor ingrese usuario y contraseña';
      return;
    }

    this.cargando = true;
    this.errorMensaje = '';

    // Llamar al servicio de autenticación
    this.authService.login(this.credenciales).subscribe({
      next: (respuesta) => {
        this.cargando = false;
        if (respuesta.success) {
          // Redirigir al dashboard si la autenticación es exitosa
          this.router.navigate(['/dashboard']);
        } else {
          // Mostrar mensaje de error
          this.errorMensaje = respuesta.mensaje;
        }
      },
      error: () => {
        this.cargando = false;
        this.errorMensaje = 'Error de conexión. Intente nuevamente.';
      }
    });
  }
}