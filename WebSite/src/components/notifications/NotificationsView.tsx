import React from "react";
import type { CatalogData, Order } from "../../types/bakery";
import {
  calculateOrderTotal,
  formatCRC,
  getDaysUntilDelivery,
} from "../../utils/bakeryUtils";

interface NotificationsViewProps {
  bakeryName: string;
  urgentOrders: Order[];
  catalog: CatalogData;
  onViewOrder: (orderId: string) => void;
  onMarkCompleted: (orderId: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  bakeryName,
  urgentOrders,
  catalog,
  onViewOrder,
  onMarkCompleted,
}) => {
  return (
    <section className="flex-1 flex flex-col space-y-4 overflow-y-auto custom-scrollbar pr-1">
      <div className="w-full bg-crema-pildora rounded-full py-2 sm:py-2.5 px-5 flex items-center justify-center shrink-0">
        <h1 className="text-center font-semibold text-sm sm:text-lg text-cacao-950">
          Notificaciones de {bakeryName}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {urgentOrders.length === 0 ? (
          <div className="col-span-full bg-crema-tarjeta rounded-2xl p-6 text-center">
            <p className="font-semibold text-sm text-cacao-950">
              No hay pedidos sin terminar próximos a vencer.
            </p>
          </div>
        ) : (
          urgentOrders.map((ord) => {
            const days = getDaysUntilDelivery(ord.fechaEntrega);
            const urgencyText =
              days === 0
                ? "Vence hoy"
                : days === 1
                  ? "Vence en 1 día"
                  : `Vence en ${days} días`;
            const isCritical = days <= 1;
            const { total } = calculateOrderTotal(ord, catalog);

            return (
              <article
                key={ord.id}
                className={`bg-crema-tarjeta rounded-2xl p-5 flex flex-col justify-between gap-4 border-l-4 ${
                  isCritical ? "border-carmesi" : "border-crema-dorado"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                        isCritical
                          ? "bg-carmesi text-white"
                          : "bg-crema-vainilla text-cacao-950"
                      }`}
                    >
                      {urgencyText}
                    </span>
                    <span className="text-xs font-semibold text-cacao-900">
                      Entrega: {ord.fechaEntrega}
                    </span>
                  </div>
                  <h2 className="font-bold text-base text-cacao-950 pt-1">
                    {ord.nombreCompleto}
                  </h2>
                  <p className="text-xs sm:text-sm text-cacao-900">
                    {ord.pedidoResumen} · Total:{" "}
                    <strong>{formatCRC(total)}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => onViewOrder(ord.id)}
                    className="px-3.5 py-1.5 rounded-full bg-crema-pildora hover:bg-crema-pildoraActiva text-cacao-950 text-xs font-semibold"
                  >
                    + Ver detalle
                  </button>
                  <button
                    type="button"
                    onClick={() => onMarkCompleted(ord.id)}
                    className="px-3.5 py-1.5 rounded-full bg-cacao-900 hover:bg-cacao-800 text-white text-xs font-semibold"
                  >
                    Marcar terminado
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
};
