// Controlador del modulo administrativo.

import React, { useMemo, useState } from "react";
import type {
  CatalogData,
  NavView,
  Order,
  ProductCatalogItem,
  PromotionItem,
} from "../../shared/types/bakery";
import { getDaysUntilDelivery } from "../../shared/utils/bakeryUtils";
import { Sidebar } from "./components/layout/Sidebar";
import { OrdersView } from "./components/orders/OrdersView";
import { OrderDetailModal } from "./components/orders/OrderDetailModal";
import { CatalogView } from "./components/catalog/CatalogView";
import { StatsView } from "./components/stats/StatsView";
import { NotificationsView } from "./components/notifications/NotificationsView";
import { ConfirmDialog } from "../../shared/components/common/ConfirmDialog";
import { Toast } from "../../shared/components/common/Toast";
import { AccessibilityWidget } from "../../shared/components/common/AccessibilityWidget";

interface AdminModuleProps {
  catalog: CatalogData;
  orders: Order[];
  onCreateOrder: (order: Order) => void;
  onUpdateOrder: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
  onToggleOrderStatus: (orderId: string) => void;
  onMarkOrderCompleted: (orderId: string) => void;
  onSaveProduct: (product: ProductCatalogItem, isEdit: boolean) => void;
  onDeleteProduct: (productId: string) => void;
  onSavePromotion: (promotion: PromotionItem, isEdit: boolean) => void;
  onDeletePromotion: (promotionId: string) => void;
  onSwitchToClient: () => void;
}

export const AdminModule: React.FC<AdminModuleProps> = ({
  catalog,
  orders,
  onCreateOrder,
  onUpdateOrder,
  onDeleteOrder,
  onToggleOrderStatus,
  onMarkOrderCompleted,
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

  // Filtra pedidos pendientes próximos a vencer
  const urgentOrders = useMemo(
    () =>
      orders
        .filter((order) => {
          if (order.estado !== "Sin terminar") return false;
          const days = getDaysUntilDelivery(order.fechaEntrega);
          return days >= 0 && days <= 3;
        })
        .sort(
          (a, b) =>
            getDaysUntilDelivery(a.fechaEntrega) -
            getDaysUntilDelivery(b.fechaEntrega),
        ),
    [orders],
  );

  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedOrderId) ?? null,
    [orders, selectedOrderId],
  );

  // Modales con confirmación
  const handleRequestDeleteOrder = (order: Order) => {
    setConfirmState({
      open: true,
      title: `Eliminar pedido de ${order.cliente}`,
      description: `¿Seguro que desea eliminar el pedido de ${order.nombreCompleto}?`,
      onConfirm: () => {
        onDeleteOrder(order.id);
        setSelectedOrderId(null);
        setConfirmState((prev) => ({ ...prev, open: false }));
        showToast("Pedido eliminado.");
      },
    });
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
        urgentCount={urgentOrders.length}
        onLogout={onSwitchToClient}
      />

      <main className="flex-1 bg-crema-fondo p-2 sm:p-4 lg:p-6 flex flex-col overflow-hidden h-full">
        <div className="flex-1 w-full bg-crema-contenedor rounded-2xl p-2 sm:p-4 lg:p-6 flex flex-col shadow-xs overflow-hidden">
          {activeView === "pedidos" && (
            <OrdersView
              orders={orders}
              catalog={catalog}
              onOpenOrderModal={setSelectedOrderId}
              onToggleOrderStatus={(id) => {
                onToggleOrderStatus(id);
                showToast("Estado del pedido actualizado.");
              }}
              onCreateOrder={(newOrder) => {
                onCreateOrder(newOrder);
                showToast(`Pedido de ${newOrder.cliente} creado.`);
              }}
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
            <NotificationsView
              urgentOrders={urgentOrders}
              catalog={catalog}
              onViewOrder={setSelectedOrderId}
              onMarkCompleted={(id) => {
                onMarkOrderCompleted(id);
                showToast("Pedido marcado como terminado.");
              }}
            />
          )}
        </div>
      </main>

      <OrderDetailModal
        order={selectedOrder}
        catalog={catalog}
        onClose={() => setSelectedOrderId(null)}
        onSave={(updated) => {
          onUpdateOrder(updated);
          showToast("Pedido actualizado.");
        }}
        onRequestDelete={handleRequestDeleteOrder}
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
