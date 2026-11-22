// Componente dedicado para representar la tarjeta de un pedido.

import React from "react";
import {
  Calendar,
  CheckCircle2,
  Eye,
  RotateCcw,
  UtensilsCrossed,
} from "lucide-react";
import type { CatalogData, Order } from "../../../../shared/types/bakery";
import {
  calculateOrderTotal,
  formatCRC,
  getInitials,
} from "../../../../shared/utils/bakeryUtils";
import { InfoCard } from "../../../../shared/components/ui/InfoCard";

interface OrderCardProps {
  order: Order;
  catalog: CatalogData;
  onViewDetails: (orderId: string) => void;
  onToggleStatus: (orderId: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  catalog,
  onViewDetails,
  onToggleStatus,
}) => {
  const { total, prod, tam } = calculateOrderTotal(order, catalog);
  const isCompleted = order.estado === "Terminado";

  return (
    <InfoCard
      avatar={
        <div className="w-8 h-8 rounded-full bg-cacao-900 text-crema-fondo text-xs font-bold flex items-center justify-center shrink-0">
          {getInitials(order.nombreCompleto)}
        </div>
      }
      headerTitle={order.cliente}
      badge={
        <span
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap border ${
            isCompleted
              ? "bg-emerald-100/80 text-emerald-900 border-emerald-300/70"
              : "bg-crema-vainilla/75 text-cacao-950 border-crema-dorado"
          }`}
        >
          {order.estado}
        </span>
      }
      metaBlocks={[
        {
          icon: <UtensilsCrossed className="w-3.5 h-3.5 shrink-0" />,
          label: "Pedido",
          value: order.pedidoResumen,
        },
        {
          icon: <Calendar className="w-3.5 h-3.5 shrink-0" />,
          label: "Entrega",
          value: order.fechaEntrega,
        },
      ]}
      title={prod?.name ?? order.pedidoResumen}
      priceTag={formatCRC(total)}
      description={`${tam ? `${tam.name} · ` : ""}${
        order.tematica || order.adicional || "Sin observaciones adicionales."
      }`}
      actions={
        <>
          <button
            type="button"
            onClick={() => onViewDetails(order.id)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-crema-pildora hover:bg-crema-pildoraActiva text-cacao-950 text-xs font-semibold transition-colors"
          >
            <Eye className="w-3.5 h-3.5 shrink-0" />
            <span>Ver detalles</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleStatus(order.id)}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-semibold transition-colors ${
              isCompleted
                ? "bg-cacao-700 hover:bg-cacao-800 text-crema-fondo"
                : "bg-cacao-900 hover:bg-cacao-950 text-crema-fondo"
            }`}
          >
            {isCompleted ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span>Reabrir</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Terminado</span>
              </>
            )}
          </button>
        </>
      }
    />
  );
};
