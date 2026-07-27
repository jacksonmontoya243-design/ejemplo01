/**
 * ============================================================
 * MODELO: Factura
 * ============================================================
 * Propósito: Define las estructuras de datos para la gestión
 * de facturación electrónica. Incluye la factura principal y
 * sus líneas de detalle. Se utiliza en los módulos de ventas,
 * facturación y reportes financieros.
 * ============================================================
 */

import { Cliente } from './cliente.model';
import { Producto } from './producto.model';

/**
 * Representa una línea individual dentro de una factura.
 * Cada detalle corresponde a un producto vendido con su
 * cantidad, precio y subtotal calculado.
 * 
 * @property producto - Referencia al producto vendido (objeto completo)
 * @property cantidad - Número de unidades vendidas de este producto
 * @property precioUnitario - Precio unitario al momento de la venta (puede diferir del precio actual)
 * @property subtotal - Resultado de multiplicar cantidad × precioUnitario
 */
export interface DetalleFactura {
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

/**
 * Estados posibles por los que puede pasar una factura durante
 * su ciclo de vida en el sistema:
 * - PENDIENTE: Factura emitida pero aún no ha sido pagada
 * - PAGADA: Factura cancelada por el cliente
 * - ANULADA: Factura invalidada (por error, devolución, etc.)
 * - VENCIDA: Factura pendiente que ha superado la fecha de vencimiento
 */
export type EstadoFactura = 'PENDIENTE' | 'PAGADA' | 'ANULADA' | 'VENCIDA';

/**
 * Representa una factura de venta completa con su información
 * de cabecera, cliente, detalles y totales financieros.
 * 
 * @property id - Número único de factura (formato: 1001, 1002, etc.)
 * @property cliente - Objeto Cliente con los datos del comprador
 * @property fechaEmision - Fecha en que se generó la factura
 * @property fechaVencimiento - Fecha límite para el pago
 * @property detalles - Arreglo con los productos y cantidades vendidas
 * @property subtotal - Suma de todos los subtotales antes de impuestos
 * @property iva - Valor del Impuesto al Valor Agregado (19% sobre subtotal)
 * @property total - Monto total a pagar (subtotal + iva)
 * @property estado - Estado actual del ciclo de vida de la factura
 * @property metodoPago - Forma de pago (Contado, Crédito, Transferencia, etc.)
 */
export interface Factura {
  id: number;
  cliente: Cliente;
  fechaEmision: Date;
  fechaVencimiento: Date;
  detalles: DetalleFactura[];
  subtotal: number;
  iva: number;
  total: number;
  estado: EstadoFactura;
  metodoPago: string;
}