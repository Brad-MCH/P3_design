import { useState } from "react";
import { useBakeryStore } from "./shared/hooks/useBakeryStore";
import { ClientModule } from "./modules/client/ClientModule";
import { AdminModule } from "./modules/admin/AdminModule";

type AppMode = "client" | "admin";

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>("client");
  const store = useBakeryStore();

  if (appMode === "client") {
    return (
      <ClientModule
        catalog={store.catalog}
        orders={store.orders}
        onCreateOrder={store.createOrder}
        onSwitchToAdmin={() => setAppMode("admin")}
      />
    );
  }

  return (
    <AdminModule
      catalog={store.catalog}
      orders={store.orders}
      notifications={store.notifications}
      onCreateOrder={store.createOrder}
      onRefreshOrders={store.refreshOrders}
      onUpdateStatus={store.updateStatus}
      onSaveProduct={store.saveProduct}
      onDeleteProduct={store.deleteProduct}
      onSavePromotion={store.savePromotion}
      onDeletePromotion={store.deletePromotion}
      onSwitchToClient={() => setAppMode("client")}
    />
  );
}
