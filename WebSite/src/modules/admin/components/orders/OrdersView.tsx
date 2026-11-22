// Vista dedicada de gestión de pedidos.

import React, { useState } from "react";
import { ClipboardList, PlusCircle, Search } from "lucide-react";
import type { CatalogData, Order } from "../../../../shared/types/bakery";
import { BrandBanner } from "../../../../shared/components/ui/BrandBanner";
import { FolderTabs } from "../../../../shared/components/ui/FolderTabs";
import { OrderCard } from "./OrderCard";
import { CreateOrderTab } from "./CreateOrderTab";

interface OrdersViewProps {
  orders: Order[];
  catalog: CatalogData;
  onOpenOrderModal: (orderId: string) => void;
  onToggleOrderStatus: (orderId: string) => void;
  onCreateOrder: (newOrder: Order) => void;
}

type OrdersTab = "list" | "create";

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  catalog,
  onOpenOrderModal,
  onToggleOrderStatus,
  onCreateOrder,
}) => {
  const [activeTab, setActiveTab] = useState<OrdersTab>("list");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtra los pedidos según el texto ingresado
  const filteredOrders = orders.filter(
    (ord) =>
      ord.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.nombreCompleto.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.pedidoResumen.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Crea el pedido y regresa a la pestaña de listado
  const handleCreateAndSwitch = (newOrder: Order) => {
    onCreateOrder(newOrder);
    setActiveTab("list");
  };

  return (
    <section
      aria-label="Gestión de pedidos"
      className="flex-1 flex flex-col min-h-0"
    >
      <BrandBanner sectionLabel="Pedidos" />

      <FolderTabs<OrdersTab>
        ariaLabel="Secciones de pedidos"
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          {
            id: "list",
            label: "Lista de pedidos",
            icon: <ClipboardList className="w-3.5 h-3.5" />,
            badgeCount: orders.length,
          },
          {
            id: "create",
            label: "Crear pedido",
            icon: <PlusCircle className="w-3.5 h-3.5" />,
          },
        ]}
      />

      <div className="flex-1 bg-crema-tarjeta rounded-2xl rounded-tl-none p-4 sm:p-5 overflow-y-auto custom-scrollbar">
        {activeTab === "list" ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="font-bold text-sm sm:text-base text-cacao-950">
                Pedidos registrados
              </h2>
              <div className="bg-crema-fondo border border-cacao-400/40 rounded-full px-3.5 py-1.5 flex items-center gap-2 w-full sm:w-72 focus-within:ring-2 focus-within:ring-cacao-900">
                <Search className="w-4 h-4 text-cacao-800 shrink-0" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por cliente o producto..."
                  className="w-full bg-transparent text-xs sm:text-sm text-cacao-950 placeholder-cacao-700 focus:outline-none"
                />
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-crema-fondo rounded-2xl p-8 text-center border border-cacao-400/30">
                <p className="text-sm font-medium text-cacao-800">
                  No se encontraron pedidos con ese criterio.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    catalog={catalog}
                    onViewDetails={onOpenOrderModal}
                    onToggleStatus={onToggleOrderStatus}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <CreateOrderTab
            catalog={catalog}
            onCreateOrder={handleCreateAndSwitch}
          />
        )}
      </div>
    </section>
  );
};
