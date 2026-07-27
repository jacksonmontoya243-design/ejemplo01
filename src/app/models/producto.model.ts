/**
 * ============================================================
 * MODELO: Producto
 * ============================================================
 * Propósito: Define la estructura de datos de un producto o
 * artículo del inventario. Este modelo se utiliza en toda la
 * aplicación para representar productos en las tablas de
 * inventario, formularios y facturas.
 * ============================================================
 */

/**
 * Representa un producto disponible en el inventario del sistema.
 * Incluye información comercial, de stock y categorización.
 * 
 * @property id - Identificador numérico único del producto
 * @property nombre - Nombre comercial del producto (ej: "Laptop ProBook 450")
 * @property descripcion - Descripción detallada con especificaciones técnicas
 * @property precio - Precio unitario de venta en pesos colombianos (COP)
 * @property stock - Cantidad de unidades disponibles en bodega
 * @property categoria - Categoría a la que pertenece (Computación, Oficina, etc.)
 * @property estado - Estado actual del inventario (Disponible, Agotado, Descontinuado)
 * @property imagen - Nombre del archivo de imagen del producto
 * @property codigo - Código SKU o de barras único para identificación interna
 */
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  estado: string;
  imagen: string;
  codigo: string;
}