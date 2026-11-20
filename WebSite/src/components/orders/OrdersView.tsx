import React, { useState } from "react";
import { ClipboardList, PlusCircle, Search } from "lucide-react";
import type { CatalogData, Order } from "../../types/bakery";
import { OrderCard } from "./OrderCard";
import { CreateOrderTab } from "./CreateOrderTab";

interface OrdersViewProps {
  bakeryName: string;
  onBakeryNameChange: (name: string) => void;
  orders: Order[];
  catalog: CatalogData;
  onOpenOrderModal: (orderId: string) => void;
  onToggleOrderStatus: (orderId: string) => void;
  onCreateOrder: (newOrder: Order) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  bakeryName,
  onBakeryNameChange,
  orders,
  catalog,
  onOpenOrderModal,
  onToggleOrderStatus,
  onCreateOrder,
}) => {
  const [activeTab, setActiveTab] = useState<"lista" | "crear">("lista");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter(
    (ord) =>
      ord.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.nombreCompleto.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.pedidoResumen.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreateAndSwitch = (newOrder: Order) => {
    onCreateOrder(newOrder);
    setActiveTab("lista");
  };

  return (
    <section
      aria-labelledby="heading-pedidos"
      className="flex-1 flex flex-col min-h-0"
    >
      {/* Título principal editable */}
      <div className="w-full bg-crema-pildora rounded-full py-2 sm:py-2.5 px-4 mb-4 flex items-center justify-center shrink-0">
        <h1
          id="heading-pedidos"
          className="text-center font-semibold text-sm sm:text-base lg:text-lg text-cacao-950"
        >
          Pedidos de{" "}
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              onBakeryNameChange(
                e.currentTarget.textContent?.trim() ||
                  "[Nombre de la repostería]",
              )
            }
            className="underline decoration-dotted decoration-cacao-700 underline-offset-4 px-1 rounded hover:bg-crema-fondo/60 focus:bg-white focus:no-underline focus:outline-none cursor-text"
          >
            {bakeryName}
          </span>
        </h1>
      </div>

      {/* Tabs superiores estilo carpeta*/}
      <div
        role="tablist"
        aria-label="Secciones de pedidos"
        className="flex items-end gap-2 px-2 shrink-0"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "lista"}
          onClick={() => setActiveTab("lista")}
          className={`flex items-center gap-2.5 px-4 sm:px-6 py-2.5 rounded-t-2xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "lista"
              ? "bg-crema-tarjeta text-cacao-950 shadow-xs"
              : "bg-crema-pildora/65 text-cacao-800 hover:bg-crema-pildora"
          }`}
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              activeTab === "lista"
                ? "bg-cacao-900 text-crema-fondo"
                : "bg-crema-campo text-cacao-900"
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
          </span>
          <span>Lista de pedidos</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${
              activeTab === "lista"
                ? "bg-cacao-900 text-crema-fondo"
                : "bg-crema-fondo text-cacao-900"
            }`}
          >
            {orders.length}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "crear"}
          onClick={() => setActiveTab("crear")}
          className={`flex items-center gap-2.5 px-4 sm:px-6 py-2.5 rounded-t-2xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "crear"
              ? "bg-crema-tarjeta text-cacao-950 shadow-xs"
              : "bg-crema-pildora/65 text-cacao-800 hover:bg-crema-pildora"
          }`}
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              activeTab === "crear"
                ? "bg-cacao-900 text-crema-fondo"
                : "bg-crema-campo text-cacao-900"
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
          </span>
          <span>Crear pedido</span>
        </button>
      </div>

      {/* Contenedor unido visualmente a la tab activa */}
      <div className="flex-1 bg-crema-tarjeta rounded-2xl rounded-tl-none p-4 sm:p-5 overflow-y-auto custom-scrollbar">
        {activeTab === "lista" ? (
          <div className="space-y-4">
            {/* Sub-header con título y buscador */}
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

            {/* Grid de tarjetas */}
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
