/**
 * ============================================================
 * MODELO: Cliente
 * ============================================================
 * Propósito: Define la estructura de datos de un cliente
 * registrado en el sistema de gestión. Este modelo se utiliza
 * en los componentes de clientes, facturas y en todo el flujo
 * comercial de la aplicación.
 * ============================================================
 */

/**
 * Representa un cliente registrado en el sistema con información
 * completa de contacto, identificación fiscal y clasificación.
 * 
 * @property id - Identificador numérico único del cliente en el sistema
 * @property nombre - Nombre completo (persona natural) o razón social (persona jurídica)
 * @property tipoIdentificacion - Tipo de documento: NIT para empresas, CC para personas
 * @property numeroIdentificacion - Número de identificación fiscal o documento de identidad
 * @property email - Correo electrónico principal de contacto
 * @property telefono - Número telefónico de contacto, incluye código de país (+57)
 * @property direccion - Dirección física completa de la sede o domicilio
 * @property ciudad - Ciudad de residencia o sede principal
 * @property tipo - Clasificación del cliente: 'Natural' para persona natural, 'Jurídica' para empresa
 * @property activo - Estado del cliente en el sistema: true = habilitado, false = deshabilitado
 * @property fechaRegistro - Fecha en que el cliente fue registrado en el sistema
 */
export interface Cliente {
  id: number;
  nombre: string;
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  tipo: string;
  activo: boolean;
  fechaRegistro: Date;
}