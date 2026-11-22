import { useCallback, useEffect, useState } from "react";
import { bakeryApi } from "../../api/bakeryApi";
import { INITIAL_CATALOG } from "../data/mockData";
import type {
  ApiNotification,
  CreateApiOrder,
  ApiOrder,
  ApiOrderStatus,
  CatalogData,
  ProductCatalogItem,
  PromotionItem,
} from "../types/bakery";

export function useBakeryStore() {
  const [catalog, setCatalog] = useState<CatalogData>(INITIAL_CATALOG);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);

  const refreshOrders = useCallback(async () => {
    setOrders(await bakeryApi.getOrders());
  }, []);

  const refreshNotifications = useCallback(async () => {
    setNotifications(await bakeryApi.getNotifications());
  }, []);

  useEffect(() => {
    void Promise.all([refreshOrders(), refreshNotifications()]).catch(
      (error: unknown) => {
        console.error("No se pudieron cargar los datos desde la API:", error);
      },
    );
  }, [refreshOrders, refreshNotifications]);

  const createOrder = async (payload: CreateApiOrder) => {
    const order = await bakeryApi.createOrder(payload);
    await Promise.all([refreshOrders(), refreshNotifications()]);
    return order;
  };

  const updateStatus = async (orderId: string, status: ApiOrderStatus) => {
    await bakeryApi.updateOrderStatus(orderId, status);
    await Promise.all([refreshOrders(), refreshNotifications()]);
  };


  const saveProduct = (product: ProductCatalogItem, isEdit: boolean) => {
    setCatalog((prev) => ({
      ...prev,
      productCatalog: isEdit
        ? prev.productCatalog.map((item) => (item.id === product.id ? product : item))
        : [product, ...prev.productCatalog],
    }));
  };

  const deleteProduct = (productId: string) => {
    setCatalog((prev) => ({
      ...prev,
      productCatalog: prev.productCatalog.filter((item) => item.id !== productId),
    }));
  };

  const savePromotion = (promotion: PromotionItem, isEdit: boolean) => {
    setCatalog((prev) => ({
      ...prev,
      promociones: isEdit
        ? prev.promociones.map((item) => (item.id === promotion.id ? promotion : item))
        : [promotion, ...prev.promociones],
    }));
  };

  const deletePromotion = (promotionId: string) => {
    setCatalog((prev) => ({
      ...prev,
      promociones: prev.promociones.filter((item) => item.id !== promotionId),
    }));
  };

  return {
    catalog,
    orders,
    notifications,
    refreshOrders,
    createOrder,
    updateStatus,
    saveProduct,
    deleteProduct,
    savePromotion,
    deletePromotion,
  };
}
