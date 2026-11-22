// Gráfica de columnas verticales para los productos más vendidos del mes.

import React from "react";
import { Award } from "lucide-react";
import { formatCRC } from "../../../../shared/utils/bakeryUtils";

interface TopProductRow {
  name: string;
  units: number;
  revenue: number;
  pct: number;
}

interface TopProductsColumnChartProps {
  label: string;
  products: TopProductRow[];
}

export const TopProductsColumnChart: React.FC<TopProductsColumnChartProps> = ({
  label,
  products,
}) => {
  const maxPct = Math.max(...products.map((p) => p.pct), 1);

  return (
    <article className="bg-crema-tarjeta rounded-2xl p-5 border border-cacao-400/30 space-y-5">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-cacao-950 flex items-center gap-2">
            <Award className="w-4 h-4 text-cacao-900" />
            Productos Más Vendidos ({label})
          </h3>
          <p className="text-[11px] text-cacao-700">
            Unidades vendidas e ingresos generados por categoría
          </p>
        </div>
      </div>

      {/* Columnas verticales */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 items-end pt-4 border-b border-cacao-400/40 pb-3">
        {products.map((item, idx) => {
          const barHeightPct = Math.max(
            18,
            Math.round((item.pct / maxPct) * 100),
          );
          const isLeader = idx === 0;

          return (
            <div key={item.name} className="flex flex-col items-center gap-2">
              {/* Etiqueta superior de unidades y monto */}
              <div className="text-center">
                <p className="text-xs font-bold text-cacao-950 tabular-nums">
                  {item.units} uds
                </p>
                <p className="text-[10px] font-medium text-cacao-700 tabular-nums">
                  {formatCRC(item.revenue)}
                </p>
              </div>

              {/* Contenedor de altura para la columna */}
              <div className="w-full max-w-[76px] h-40 bg-crema-campo/60 rounded-t-xl flex items-end p-1">
                <div
                  className={`w-full rounded-t-lg flex items-start justify-center pt-1.5 transition-all duration-500 ${
                    isLeader
                      ? "bg-cacao-900 text-crema-vainilla"
                      : "bg-cacao-700 text-crema-fondo"
                  }`}
                  style={{ height: `${barHeightPct}%` }}
                >
                  <span className="text-[11px] font-bold tabular-nums">
                    {item.pct}%
                  </span>
                </div>
              </div>

              {/* Nombre del producto */}
              <p className="text-xs font-bold text-cacao-950 text-center leading-tight min-h-[2rem]">
                {item.name}
              </p>
            </div>
          );
        })}
      </div>
    </article>
  );
};
