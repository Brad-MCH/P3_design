import React from "react";
import {
  Calendar,
  CheckCircle2,
  Eye,
  RotateCcw,
  UtensilsCrossed,
} from "lucide-react";
import type { CatalogData, Order } from "../../types/bakery";
import {
  calculateOrderTotal,
  formatCRC,
  getInitials,
} from "../../utils/bakeryUtils";

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
    <article className="bg-crema-fondo rounded-2xl p-4 border border-cacao-400/35 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-3.5">
      {/* Encabezado */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-cacao-900 text-crema-fondo text-xs font-bold flex items-center justify-center shrink-0">
            {getInitials(order.nombreCompleto)}
          </div>
          <span
            className="font-semibold text-sm text-cacao-950 truncate"
            title={order.nombreCompleto}
          >
            {order.cliente}
          </span>
        </div>

        <span
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap border ${
            isCompleted
              ? "bg-emerald-100/80 text-emerald-900 border-emerald-300/70"
              : "bg-crema-vainilla/75 text-cacao-950 border-crema-dorado"
          }`}
        >
          {order.estado}
        </span>
      </div>

      {/* Tipo de pedido y Fecha de entrega */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-crema-tarjeta rounded-xl p-2.5 border border-cacao-400/20">
          <div className="flex items-center gap-1.5 text-[11px] text-cacao-700 font-medium mb-0.5">
            <UtensilsCrossed className="w-3.5 h-3.5 shrink-0" />
            <span>Pedido</span>
          </div>
          <p className="text-xs font-semibold text-cacao-950 truncate">
            {order.pedidoResumen}
          </p>
        </div>

        <div className="bg-crema-tarjeta rounded-xl p-2.5 border border-cacao-400/20">
          <div className="flex items-center gap-1.5 text-[11px] text-cacao-700 font-medium mb-0.5">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>Entrega</span>
          </div>
          <p className="text-xs font-semibold text-cacao-950 tabular-nums truncate">
            {order.fechaEntrega}
          </p>
        </div>
      </div>

      {/* Título del producto, resumen de temática */}
      <div className="space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-bold text-sm text-cacao-950 truncate">
            {prod?.name ?? order.pedidoResumen}
          </h3>
          <span className="text-xs font-bold text-cacao-900 bg-crema-pildora/60 px-2 py-0.5 rounded-md shrink-0 tabular-nums">
            {formatCRC(total)}
          </span>
        </div>
        <p className="text-xs text-cacao-800 line-clamp-2 min-h-[2rem]">
          {tam ? `${tam.name} · ` : ""}
          {order.tematica ||
            order.adicional ||
            "Sin observaciones adicionales."}
        </p>
      </div>

      {/* Botones de acción inferiores */}
      <div className="grid grid-cols-2 gap-2 pt-1">
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
      </div>
    </article>
  );
};
