export type NavView =
  | "pedidos"
  | "catalogo"
  | "estadisticas"
  | "notificaciones";

export type CharacteristicType =
  | "Size"
  | "Flavor"
  | "Filling"
  | "Frosting"
  | "Extra";

export interface ProductCharacteristic {
  id: string;
  type: CharacteristicType;
  name: string;
  marketPrice: number;
}

export interface ProductCatalogItem {
  id: string;
  name: string;
  category: "Pastel" | "Cupcakes" | "Galletas" | "Cheesecake" | "Tartaleta";
  basePrice: number;
  image?: string;
  description: string;
  characteristics: ProductCharacteristic[];
}

export interface PromotionItem {
  id: string;
  name: string;
  price: number;
  discountLabel: string;
  description: string;
  image?: string;
  validUntil: string;
}

export type CatalogCategory =
  | "productos"
  | "tamanos"
  | "masas"
  | "rellenos"
  | "cubiertas"
  | "promociones";

export interface CatalogItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  tipoBase?: "Pastel" | "Cupcakes" | "Galletas";
  textura?: "Húmedo" | "Semihúmedo" | "Seco" | "No aplica";
}

export type CatalogData = {
  productos: CatalogItem[];
  tamanos: CatalogItem[];
  masas: CatalogItem[];
  rellenos: CatalogItem[];
  cubiertas: CatalogItem[];
  promociones: PromotionItem[];
  productCatalog: ProductCatalogItem[];
};

export type OrderStatus = "Sin terminar" | "Terminado";

export type ApiOrderStatus =
  | "received"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export type ApiCakeExtra = "candles" | "fruit" | "macarons";

export interface ApiCakeConfiguration {
  size: string;
  flavor: string;
  frosting: string;
  design: string;
  color: string;
  message: string;
  extras: ApiCakeExtra[];
}

export interface ApiOrder {
  id: string;
  customer: { name: string; phone: string };
  cake: ApiCakeConfiguration;
  total: number;
  status: ApiOrderStatus;
  createdAt: string;
}

export interface CreateApiOrder {
  customer: ApiOrder["customer"];
  cake: ApiCakeConfiguration;
}

export interface ApiDashboard {
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: Record<string, number>;
}

export interface ApiNotification {
  id: string;
  orderId: string;
  status: ApiOrderStatus;
  message: string;
  createdAt: string;
}

export interface ApiResult<T> {
  data?: T;
  error?: { code: string; message: string };
}

export interface Order {
  apiStatus?: ApiOrderStatus;
  cake?: ApiCakeConfiguration;
  id: string;
  cliente: string;
  nombreCompleto: string;
  telefono: string;
  pedidoResumen: string;
  fechaEntrega: string;
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

export interface InventoryRotationItem {
  ingredient: string;
  category: string;
  turnoverRate: number;
  status: "Alta" | "Óptima" | "Baja";
  wasteCost: number;
}

export interface WeeklyFinancialPoint {
  week: string;
  revenue: number;
  expenses: number;
  losses: number;
}

export interface DashboardMonthStats {
  label: string;
  totalRevenue: number;
  totalExpenses: number;
  totalLosses: number;
  netProfit: number;
  completedOrders: number;
  topProduct: { name: string; units: number; revenue: number };
  weeklyFinancials: WeeklyFinancialPoint[];
  topProducts: { name: string; units: number; revenue: number; pct: number }[];
  inventoryRotation: InventoryRotationItem[];
}
