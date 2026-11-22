// Controlador del modulo administrativo.

import React, { useState } from "react";
import type {
  ApiNotification,
  ApiOrder,
  ApiOrderStatus,
  CatalogData,
  CreateApiOrder,
  NavView,
  ProductCatalogItem,
  PromotionItem,
} from "../../shared/types/bakery";
import { Sidebar } from "./components/layout/Sidebar";
import { OrdersView } from "./components/orders/OrdersView";
import { ApiOrderDetailModal } from "./components/orders/ApiOrderDetailModal";
import { CatalogView } from "./components/catalog/CatalogView";
import { StatsView } from "./components/stats/StatsView";
import { NotificationsView } from "./components/notifications/NotificationsView";
import { ConfirmDialog } from "../../shared/components/common/ConfirmDialog";
import { Toast } from "../../shared/components/common/Toast";
import { AccessibilityWidget } from "../../shared/components/common/AccessibilityWidget";

interface AdminModuleProps {
  catalog: CatalogData;
  orders: ApiOrder[];
  notifications: ApiNotification[];
  onCreateOrder: (payload: CreateApiOrder) => Promise<unknown>;
  onRefreshOrders: () => Promise<void>;
  onUpdateStatus: (orderId: string, status: ApiOrderStatus) => Promise<void>;
  onSaveProduct: (product: ProductCatalogItem, isEdit: boolean) => void;
  onDeleteProduct: (productId: string) => void;
  onSavePromotion: (promotion: PromotionItem, isEdit: boolean) => void;
  onDeletePromotion: (promotionId: string) => void;
  onSwitchToClient: () => void;
}

export const AdminModule: React.FC<AdminModuleProps> = ({
  catalog,
  orders,
  notifications,
  onCreateOrder,
  onRefreshOrders,
  onUpdateStatus,
  onSaveProduct,
  onDeleteProduct,
  onSavePromotion,
  onDeletePromotion,
  onSwitchToClient,
}) => {
  const [activeView, setActiveView] = useState<NavView>("pedidos");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [confirmState, setConfirmState] = useState({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? null;

  const handleUpdateStatus = async (orderId: string, status: ApiOrderStatus) => {
    try {
      await onUpdateStatus(orderId, status);
      showToast(`Estado actualizado a ${status}.`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "No se pudo actualizar el estado.");
    }
  };

  const handleCreateOrder = async (payload: CreateApiOrder) => {
    await onCreateOrder(payload);
    showToast("Pedido creado.");
  };

  const handleRequestDeleteProduct = (product: ProductCatalogItem) => {
    setConfirmState({
      open: true,
      title: "Eliminar producto",
      description: `¿Desea eliminar "${product.name}" del catálogo?`,
      onConfirm: () => {
        onDeleteProduct(product.id);
        setConfirmState((prev) => ({ ...prev, open: false }));
        showToast("Producto eliminado.");
      },
    });
  };

  const handleRequestDeletePromotion = (promotion: PromotionItem) => {
    setConfirmState({
      open: true,
      title: "Eliminar promoción",
      description: `¿Desea eliminar la promoción "${promotion.name}"?`,
      onConfirm: () => {
        onDeletePromotion(promotion.id);
        setConfirmState((prev) => ({ ...prev, open: false }));
        showToast("Promoción eliminada.");
      },
    });
  };

  return (
    <div className="h-[100dvh] overflow-hidden flex flex-row antialiased selection:bg-cacao-300 selection:text-cacao-950">
      <Sidebar
        activeView={activeView}
        onSelectView={setActiveView}
        urgentCount={notifications.length}
        onLogout={onSwitchToClient}
      />

      <main className="flex-1 bg-crema-fondo p-2 sm:p-4 lg:p-6 flex flex-col overflow-hidden h-full">
        <div className="flex-1 w-full bg-crema-contenedor rounded-2xl p-2 sm:p-4 lg:p-6 flex flex-col shadow-xs overflow-hidden">
          {activeView === "pedidos" && (
            <OrdersView
              orders={orders}
              onRefreshOrders={onRefreshOrders}
              onOpenOrderModal={setSelectedOrderId}
              onUpdateStatus={handleUpdateStatus}
              onCreateOrder={handleCreateOrder}
            />
          )}

          {activeView === "catalogo" && (
            <CatalogView
              catalog={catalog}
              onSaveProduct={(product, isEdit) => {
                onSaveProduct(product, isEdit);
                showToast(
                  isEdit ? "Producto actualizado." : "Producto agregado.",
                );
              }}
              onDeleteProduct={handleRequestDeleteProduct}
              onSavePromotion={(promo, isEdit) => {
                onSavePromotion(promo, isEdit);
                showToast(
                  isEdit ? "Promoción actualizada." : "Promoción creada.",
                );
              }}
              onDeletePromotion={handleRequestDeletePromotion}
            />
          )}

          {activeView === "estadisticas" && <StatsView />}

          {activeView === "notificaciones" && (
            <NotificationsView notifications={notifications} />
          )}
        </div>
      </main>

      <ApiOrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrderId(null)}
      />

      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        description={confirmState.description}
        onCancel={() => setConfirmState((prev) => ({ ...prev, open: false }))}
        onConfirm={confirmState.onConfirm}
      />

      <Toast message={toastMessage} />
      <AccessibilityWidget onResetNotify={showToast} />
    </div>
  );
};
