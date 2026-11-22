// Tarjeta dedicada para mostrar una promoción activa con imagen y vigencia.

import React from "react";
import { Calendar, Pencil, Sparkles, Trash2 } from "lucide-react";
import type { PromotionItem } from "../../../../shared/types/bakery";
import { formatCRC } from "../../../../shared/utils/bakeryUtils";

interface PromotionCardProps {
  promotion: PromotionItem;
  onEdit: (promotion: PromotionItem) => void;
  onDelete: (promotion: PromotionItem) => void;
}

export const PromotionCard: React.FC<PromotionCardProps> = ({
  promotion,
  onEdit,
  onDelete,
}) => {
  return (
    <article className="card-interactive bg-crema-fondo rounded-2xl overflow-hidden border border-cacao-400/35 shadow-sm flex flex-col justify-between">
      <div>
        <div className="relative h-36 w-full bg-crema-campo overflow-hidden">
          {promotion.image ? (
            <img
              src={promotion.image}
              alt={promotion.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-cacao-700">
              Sin imagen
            </div>
          )}
          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-carmesi text-white text-[11px] font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {promotion.discountLabel}
          </span>
        </div>

        <div className="p-4 space-y-2.5">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-bold text-sm text-cacao-950 truncate">
              {promotion.name}
            </h3>
            <span className="text-xs font-bold text-cacao-950 bg-crema-vainilla px-2 py-0.5 rounded-md shrink-0 tabular-nums">
              {formatCRC(promotion.price)}
            </span>
          </div>

          <p className="text-xs text-cacao-800 line-clamp-2 min-h-[2rem]">
            {promotion.description}
          </p>

          <div className="flex items-center gap-1.5 text-[11px] font-medium text-cacao-700 bg-crema-tarjeta px-2.5 py-1.5 rounded-xl">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>Válida hasta: {promotion.validUntil}</span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onEdit(promotion)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-crema-pildora hover:bg-crema-pildoraActiva text-cacao-950 text-xs font-semibold transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
          Editar
        </button>
        <button
          type="button"
          onClick={() => onDelete(promotion)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-carmesi hover:bg-carmesi-oscuro text-white text-xs font-semibold transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Eliminar
        </button>
      </div>
    </article>
  );
};
