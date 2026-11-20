import { useMemo, useState } from "react";
import { INITIAL_CATALOG, INITIAL_ORDERS } from "./data/mockData";
import type {
  CatalogCategory,
  CatalogData,
  CatalogItem,
  NavView,
  Order,
} from "./types/bakery";
import { getDaysUntilDelivery } from "./utils/bakeryUtils";
import { Sidebar } from "./components/layout/Sidebar";
import { OrdersView } from "./components/orders/OrdersView";
import { OrderDetailModal } from "./components/orders/OrderDetailModal";
import { CatalogView } from "./components/catalog/CatalogView";
import { StatsView } from "./components/stats/StatsView";
import { NotificationsView } from "./components/notifications/NotificationsView";
import { ConfirmDialog } from "./components/common/ConfirmDialog";
import { Toast } from "./components/common/Toast";
import { AccessibilityWidget } from "./components/common/AccessibilityWidget";

export default function App() {
  const [activeView, setActiveView] = useState<NavView>("pedidos");
  const [bakeryName, setBakeryName] = useState("[Nombre de la repostería]");
  const [catalog, setCatalog] = useState<CatalogData>(INITIAL_CATALOG);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ open: false, title: "", description: "", onConfirm: () => {} });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const urgentOrders = useMemo(
    () =>
      orders
        .filter((ord) => {
          if (ord.estado !== "Sin terminar") return false;
          const days = getDaysUntilDelivery(ord.fechaEntrega);
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

  const handleToggleStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              estado:
                o.estado === "Sin terminar" ? "Terminado" : "Sin terminar",
            }
          : o,
      ),
    );
    showToast("Estado del pedido actualizado.");
  };

  const handleCreateOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    showToast(`Pedido de ${newOrder.cliente} creado.`);
  };

  const handleSaveOrder = (updated: Order) => {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    showToast("Pedido actualizado.");
  };

  const handleRequestDeleteOrder = (order: Order) => {
    setConfirmState({
      open: true,
      title: `Eliminar pedido de ${order.cliente}`,
      description: `¿Seguro que desea eliminar el pedido de ${order.nombreCompleto}?`,
      onConfirm: () => {
        setOrders((prev) => prev.filter((o) => o.id !== order.id));
        setSelectedOrderId(null);
        setConfirmState((s) => ({ ...s, open: false }));
        showToast("Pedido eliminado.");
      },
    });
  };

  const handleSaveCatalogItem = (
    category: CatalogCategory,
    item: CatalogItem,
    isEdit: boolean,
  ) => {
    setCatalog((prev) => ({
      ...prev,
      [category]: isEdit
        ? prev[category].map((i) => (i.id === item.id ? item : i))
        : [...prev[category], item],
    }));
    showToast(isEdit ? "Ítem actualizado." : "Ítem agregado al catálogo.");
  };

  const handleDeleteCatalogItem = (
    category: CatalogCategory,
    item: CatalogItem,
  ) => {
    if (catalog[category].length <= 1) {
      showToast("Debe quedar al menos un ítem en la categoría.");
      return;
    }
    setConfirmState({
      open: true,
      title: "Eliminar del catálogo",
      description: `¿Desea eliminar "${item.name}"?`,
      onConfirm: () => {
        setCatalog((prev) => ({
          ...prev,
          [category]: prev[category].filter((i) => i.id !== item.id),
        }));
        setConfirmState((s) => ({ ...s, open: false }));
        showToast("Ítem eliminado del catálogo.");
      },
    });
  };

  return (
    <div className="h-[100dvh] overflow-hidden flex flex-row antialiased selection:bg-cacao-300 selection:text-cacao-950">
      <Sidebar
        activeView={activeView}
        onSelectView={setActiveView}
        urgentCount={urgentOrders.length}
        onLogout={() => showToast("Sesión administrativa verificada.")}
      />

      <main className="flex-1 bg-crema-fondo p-2 sm:p-4 lg:p-6 flex flex-col overflow-hidden h-full">
        <div className="flex-1 w-full bg-crema-contenedor rounded-2xl p-2 sm:p-4 lg:p-6 flex flex-col shadow-xs overflow-hidden">
          {activeView === "pedidos" && (
            <OrdersView
              bakeryName={bakeryName}
              onBakeryNameChange={setBakeryName}
              orders={orders}
              catalog={catalog}
              onOpenOrderModal={setSelectedOrderId}
              onToggleOrderStatus={handleToggleStatus}
              onCreateOrder={handleCreateOrder}
            />
          )}

          {activeView === "catalogo" && (
            <CatalogView
              bakeryName={bakeryName}
              catalog={catalog}
              onSaveItem={handleSaveCatalogItem}
              onDeleteItem={handleDeleteCatalogItem}
            />
          )}

          {activeView === "estadisticas" && (
            <StatsView bakeryName={bakeryName} />
          )}

          {activeView === "notificaciones" && (
            <NotificationsView
              bakeryName={bakeryName}
              urgentOrders={urgentOrders}
              catalog={catalog}
              onViewOrder={setSelectedOrderId}
              onMarkCompleted={(id) => {
                setOrders((prev) =>
                  prev.map((o) =>
                    o.id === id ? { ...o, estado: "Terminado" } : o,
                  ),
                );
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
        onSave={handleSaveOrder}
        onRequestDelete={handleRequestDeleteOrder}
      />

      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        description={confirmState.description}
        onCancel={() => setConfirmState((s) => ({ ...s, open: false }))}
        onConfirm={confirmState.onConfirm}
      />

      <Toast message={toastMsg} />
      <AccessibilityWidget onResetNotify={showToast} />
    </div>
  );
}
