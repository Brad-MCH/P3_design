// Componente dedicado para visualizar la rotación de inventario y perdidas por ingrediente.

import React from "react";
import type { InventoryRotationItem } from "../../../../shared/types/bakery";
import { formatCRC } from "../../../../shared/utils/bakeryUtils";

export const InventoryRotationCard: React.FC<{
  items: InventoryRotationItem[];
}> = ({ items }) => {
  return (
    <article className="bg-crema-tarjeta rounded-2xl p-5 border border-cacao-400/30 space-y-4">
      <h3 className="font-bold text-sm sm:text-base text-cacao-950">
        Rotación de inventario y perdidas
      </h3>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.ingredient} className="space-y-1">
            <div className="flex items-center justify-between text-xs gap-2">
              <span className="font-semibold text-cacao-950 truncate">
                {item.ingredient}{" "}
                <span className="font-normal text-cacao-700">
                  ({item.category})
                </span>
              </span>
              <span className="shrink-0 flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.status === "Alta"
                      ? "bg-emerald-100 text-emerald-900"
                      : item.status === "Óptima"
                        ? "bg-crema-vainilla text-cacao-950"
                        : "bg-carmesi/15 text-carmesi"
                  }`}
                >
                  {item.status} ({item.turnoverRate}%)
                </span>
                <span className="text-[11px] text-carmesi font-semibold tabular-nums">
                  Perdida: {formatCRC(item.wasteCost)}
                </span>
              </span>
            </div>
            <div className="w-full h-2.5 bg-crema-campo rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  item.status === "Baja" ? "bg-carmesi" : "bg-cacao-900"
                }`}
                style={{ width: `${item.turnoverRate}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
};
