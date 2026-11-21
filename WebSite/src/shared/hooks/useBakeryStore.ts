import { useState } from "react";
import { INITIAL_CATALOG, INITIAL_ORDERS } from "../data/mockData";
import type {
  CatalogData,
  Order,
  ProductCatalogItem,
  PromotionItem,
} from "../types/bakery";

export function useBakeryStore() {
  const [catalog, setCatalog] = useState<CatalogData>(INITIAL_CATALOG);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  // ==================== OPERACIONES DE PEDIDOS ====================

  const createOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const updateOrder = (updatedOrder: Order) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order,
      ),
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
  };

  const toggleOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              estado:
                order.estado === "Sin terminar" ? "Terminado" : "Sin terminar",
            }
          : order,
      ),
    );
  };

  const markOrderCompleted = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, estado: "Terminado" } : order,
      ),
    );
  };

  // ==================== OPERACIONES DE CATÁLOGO ====================

  const saveProduct = (product: ProductCatalogItem, isEdit: boolean) => {
    setCatalog((prev) => ({
      ...prev,
      productCatalog: isEdit
        ? prev.productCatalog.map((p) => (p.id === product.id ? product : p))
        : [product, ...prev.productCatalog],
    }));
  };

  const deleteProduct = (productId: string) => {
    setCatalog((prev) => ({
      ...prev,
      productCatalog: prev.productCatalog.filter((p) => p.id !== productId),
    }));
  };

  const savePromotion = (promotion: PromotionItem, isEdit: boolean) => {
    setCatalog((prev) => ({
      ...prev,
      promociones: isEdit
        ? prev.promociones.map((p) => (p.id === promotion.id ? promotion : p))
        : [promotion, ...prev.promociones],
    }));
  };

  const deletePromotion = (promotionId: string) => {
    setCatalog((prev) => ({
      ...prev,
      promociones: prev.promociones.filter((p) => p.id !== promotionId),
    }));
  };

  return {
    catalog,
    orders,
    createOrder,
    updateOrder,
    deleteOrder,
    toggleOrderStatus,
    markOrderCompleted,
    saveProduct,
    deleteProduct,
    savePromotion,
    deletePromotion,
  };
}
