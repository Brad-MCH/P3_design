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
        onSwitchToAdmin={() => setAppMode("admin")}
      />
    );
  }

  return (
    <AdminModule
      catalog={store.catalog}
      orders={store.orders}
      onCreateOrder={store.createOrder}
      onUpdateOrder={store.updateOrder}
      onDeleteOrder={store.deleteOrder}
      onToggleOrderStatus={store.toggleOrderStatus}
      onMarkOrderCompleted={store.markOrderCompleted}
      onSaveProduct={store.saveProduct}
      onDeleteProduct={store.deleteProduct}
      onSavePromotion={store.savePromotion}
      onDeletePromotion={store.deletePromotion}
      onSwitchToClient={() => setAppMode("client")}
    />
  );
}
