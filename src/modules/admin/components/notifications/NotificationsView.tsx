// Vista dedicada de Notificaciones

import React from "react";
import {
  BellRing,
  Calendar,
  CheckCircle2,
  Eye,
  UtensilsCrossed,
} from "lucide-react";
import type { CatalogData, Order } from "../../../../shared/types/bakery";
import {
  calculateOrderTotal,
  formatCRC,
  getDaysUntilDelivery,
} from "../../../../shared/utils/bakeryUtils";
import { BrandBanner } from "../../../../shared/components/ui/BrandBanner";
import { InfoCard } from "../../../../shared/components/ui/InfoCard";

interface NotificationsViewProps {
  urgentOrders: Order[];
  catalog: CatalogData;
  onViewOrder: (orderId: string) => void;
  onMarkCompleted: (orderId: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  urgentOrders,
  catalog,
  onViewOrder,
  onMarkCompleted,
}) => {
  return (
    <section className="flex-1 flex flex-col min-h-0">
      <BrandBanner sectionLabel="Notificaciones" />

      <div className="flex-1 bg-crema-tarjeta rounded-2xl p-4 sm:p-5 overflow-y-auto custom-scrollbar">
        {urgentOrders.length === 0 ? (
          <div className="bg-crema-fondo rounded-2xl p-8 text-center border border-cacao-400/30">
            <p className="font-semibold text-sm text-cacao-950">
              No hay pedidos sin terminar o próximos a vencer.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {urgentOrders.map((ord) => {
              const days = getDaysUntilDelivery(ord.fechaEntrega);
              const urgencyText =
                days === 0
                  ? "Vence hoy"
                  : days === 1
                    ? "Vence en 1 día"
                    : `Vence en ${days} días`;
              const isCritical = days <= 1;
              const { total, prod } = calculateOrderTotal(ord, catalog);

              return (
                <InfoCard
                  key={ord.id}
                  accentBorderClass={
                    isCritical
                      ? "border-carmesi/60 border-l-4 border-l-carmesi"
                      : "border-crema-dorado border-l-4 border-l-crema-dorado"
                  }
                  avatar={
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isCritical
                          ? "bg-carmesi text-white"
                          : "bg-cacao-900 text-crema-fondo"
                      }`}
                    >
                      <BellRing className="w-4 h-4" />
                    </div>
                  }
                  headerTitle={ord.nombreCompleto}
                  badge={
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap ${
                        isCritical
                          ? "bg-carmesi text-white"
                          : "bg-crema-vainilla text-cacao-950 border border-crema-dorado"
                      }`}
                    >
                      {urgencyText}
                    </span>
                  }
                  metaBlocks={[
                    {
                      icon: (
                        <UtensilsCrossed className="w-3.5 h-3.5 shrink-0" />
                      ),
                      label: "Producto",
                      value: ord.pedidoResumen,
                    },
                    {
                      icon: <Calendar className="w-3.5 h-3.5 shrink-0" />,
                      label: "Entrega",
                      value: ord.fechaEntrega,
                    },
                  ]}
                  title={prod?.name ?? ord.pedidoResumen}
                  priceTag={formatCRC(total)}
                  description={
                    ord.tematica ||
                    ord.adicional ||
                    "Pedido próximo a entregar."
                  }
                  actions={
                    <>
                      <button
                        type="button"
                        onClick={() => onViewOrder(ord.id)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-crema-pildora hover:bg-crema-pildoraActiva text-cacao-950 text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver detalle</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onMarkCompleted(ord.id)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-cacao-900 hover:bg-cacao-950 text-crema-fondo text-xs font-semibold transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Terminado</span>
                      </button>
                    </>
                  }
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
