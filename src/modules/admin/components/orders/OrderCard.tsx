// Componente dedicado para representar la tarjeta de un pedido.

import React, { useState } from "react";
import {
  Ban,
  CheckCircle2,
  Eye,
  Forward,
} from "lucide-react";
import type { ApiOrder, ApiOrderStatus } from "../../../../shared/types/bakery";
import { formatCRC, getInitials } from "../../../../shared/utils/bakeryUtils";
import { InfoCard } from "../../../../shared/components/ui/InfoCard";

interface OrderCardProps {
  order: ApiOrder;
  onViewDetails: (orderId: string) => void;
  onUpdateStatus: (orderId: string, status: ApiOrderStatus) => Promise<void>;
}

const allowedNext: Partial<Record<ApiOrderStatus, ApiOrderStatus>> = {
  received: "preparing",
  preparing: "ready",
  ready: "delivered",
};

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onViewDetails,
  onUpdateStatus,
}) => {
  const nextStatus = allowedNext[order.status];
  const isTerminal = order.status === "delivered" || order.status === "cancelled";
  const [busy, setBusy] = useState(false);

  const changeStatus = async (status: ApiOrderStatus) => {
    setBusy(true);
    try {
      await onUpdateStatus(order.id, status);
    } finally {
      setBusy(false);
    }
  };
  const cakeDescription = [
    `${order.cake.size} · ${order.cake.flavor}`,
    `Cubierta: ${order.cake.frosting}`,
    `Diseño: ${order.cake.design} · ${order.cake.color}`,
    order.cake.message && `Mensaje: ${order.cake.message}`,
    order.cake.extras.length > 0 && `Extras: ${order.cake.extras.join(", ")}`,
  ].filter(Boolean).join(" · ");

  return (
    <InfoCard
      avatar={
        <div className="w-8 h-8 rounded-full bg-cacao-900 text-crema-fondo text-xs font-bold flex items-center justify-center shrink-0">
          {getInitials(order.customer.name)}
        </div>
      }
      headerTitle={order.customer.name}
      badge={<span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap border bg-crema-vainilla/75 text-cacao-950 border-crema-dorado">{order.status}</span>}
      metaBlocks={[
        { icon: <Eye className="w-3.5 h-3.5 shrink-0" />, label: "ID", value: order.id },
        { icon: <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />, label: "Creado", value: new Date(order.createdAt).toLocaleString("es-CR") },
      ]}
      title={`${order.cake.size} · ${order.cake.flavor}`}
      priceTag={formatCRC(order.total)}
      description={cakeDescription}
      actions={
        <>
          <button type="button" onClick={() => onViewDetails(order.id)} className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-crema-pildora hover:bg-crema-pildoraActiva text-cacao-950 text-xs font-semibold transition-colors">
            <Eye className="w-3.5 h-3.5 shrink-0" />
            <span>Ver detalles</span>
          </button>
          <div className="flex gap-2">
            {nextStatus && <button type="button" disabled={busy} onClick={() => void changeStatus(nextStatus)} className="flex flex-1 items-center justify-center gap-1 py-2 px-2 rounded-full bg-cacao-900 hover:bg-cacao-800 text-crema-fondo text-xs font-semibold transition-colors">
              <Forward className="w-3.5 h-3.5" />
              <span>{nextStatus}</span>
            </button>}
            {!isTerminal && <button type="button" disabled={busy} onClick={() => void changeStatus("cancelled")} className="flex flex-1 items-center justify-center gap-1 py-2 px-2 rounded-full bg-carmesi hover:bg-carmesi-oscuro text-white text-xs font-semibold transition-colors">
              <Ban className="w-3.5 h-3.5" />
              <span>Cancelar</span>
            </button>}
          </div>
        </>
      }
    />
  );
};
