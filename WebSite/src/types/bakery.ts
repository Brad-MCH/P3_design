export type NavView =
  | "pedidos"
  | "catalogo"
  | "estadisticas"
  | "notificaciones";

export type CatalogCategory =
  | "productos"
  | "tamanos"
  | "masas"
  | "rellenos"
  | "cubiertas"
  | "promociones"
  | "opcionesPrehechas";

export interface CatalogItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  tipoBase?: "Pastel" | "Cupcakes" | "Galletas";
  textura?: "Húmedo" | "Semihúmedo" | "Seco" | "No aplica";
}

export type CatalogData = Record<CatalogCategory, CatalogItem[]>;

export type OrderStatus = "Sin terminar" | "Terminado";

export interface Order {
  id: string;
  cliente: string;
  nombreCompleto: string;
  telefono: string;
  pedidoResumen: string;
  fechaEntrega: string; // Formato DD/MM/YYYY
  estado: OrderStatus;
  delivery: "Sí" | "No";
  direccion: string;
  productoId: string;
  humedad: "Húmedo" | "Semihúmedo" | "Seco" | "No aplica";
  tamanoId: string;
  masaId: string;
  rellenoId: string;
  cubiertaId: string;
  tematica: string;
  adicional: string;
}

export interface MonthlyStats {
  label: string;
  totalRevenue: number;
  completedOrders: number;
  topProduct: { name: string; units: number; revenue: number };
  breakdown: { name: string; units: number; revenue: number; pct: number }[];
}
