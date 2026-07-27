/**
 * ============================================================
 * MODELO: Usuario
 * ============================================================
 * Propósito: Define la estructura de datos de un usuario del
 * sistema de gestión empresarial. Este modelo se utiliza en
 * toda la aplicación para tipar los datos de usuarios tanto
 * en los servicios mock como en los componentes.
 * 
 * También se incluyen interfaces auxiliares para el proceso
 * de autenticación (Credenciales y AuthResponse).
 * ============================================================
 */

/**
 * Representa un usuario registrado en el sistema con todos
 * sus datos personales, laborales y de acceso.
 * 
 * @property id - Identificador numérico único del usuario (autoincremental)
 * @property nombre - Nombre completo del usuario (nombres y apellidos)
 * @property email - Correo electrónico corporativo utilizado para comunicaciones
 * @property rol - Rol asignado en el sistema (Administrador, Supervisor, Usuario)
 * @property activo - Indica si la cuenta está habilitada (true) o deshabilitada (false)
 * @property fechaCreacion - Fecha y hora en que se registró el usuario en el sistema
 * @property telefono - Número de teléfono de contacto del usuario
 * @property departamento - Departamento o área de la empresa a la que pertenece
 */
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
  fechaCreacion: Date;
  telefono: string;
  departamento: string;
}

/**
 * Interfaz para las credenciales que el usuario ingresa en
 * el formulario de inicio de sesión.
 * 
 * @property usuario - Nombre de usuario o correo electrónico
 * @property contrasena - Contraseña de acceso al sistema
 */
export interface Credenciales {
  usuario: string;
  contrasena: string;
}

/**
 * Interfaz que define la estructura de la respuesta devuelta
 * por el servicio de autenticación después de un intento de
 * inicio de sesión.
 * 
 * @property success - Indica si la autenticación fue exitosa (true/false)
 * @property mensaje - Mensaje informativo para mostrar al usuario
 * @property token - Token de sesión simulado (string único generado con Date.now())
 * @property usuario - Objeto Usuario con los datos completos del autenticado (null si falló)
 */
export interface AuthResponse {
  success: boolean;
  mensaje: string;
  token: string;
  usuario: Usuario | null;
}