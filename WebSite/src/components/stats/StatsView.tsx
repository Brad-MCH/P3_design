import React, { useState } from "react";
import { MONTHLY_STATS } from "../../data/mockData";
import { formatCRC } from "../../utils/bakeryUtils";

export const StatsView: React.FC<{ bakeryName: string }> = ({ bakeryName }) => {
  const [month, setMonth] = useState("2026-11");
  const data = MONTHLY_STATS[month];

  return (
    <section className="flex-1 flex flex-col space-y-4 overflow-y-auto custom-scrollbar pr-1">
      <div className="w-full bg-crema-pildora rounded-full py-2 sm:py-2.5 px-3 sm:px-5 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
        <div className="w-28 hidden sm:block" />
        <h1 className="text-center font-semibold text-sm sm:text-lg text-cacao-950">
          Estadísticas de {bakeryName}
        </h1>
        <div className="flex items-center gap-2">
          <label
            htmlFor="stats-month"
            className="text-xs font-semibold text-cacao-950"
          >
            Mes:
          </label>
          <select
            id="stats-month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-full bg-crema-fondo border border-cacao-500 px-3 py-1 text-xs font-semibold text-cacao-950"
          >
            <option value="2026-11">Noviembre 2026</option>
            <option value="2026-10">Octubre 2026</option>
            <option value="2026-09">Septiembre 2026</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
        <article className="bg-crema-tarjeta rounded-2xl p-5 space-y-2">
          <h2 className="font-bold text-sm text-cacao-950 underline decoration-cacao-800 underline-offset-4">
            Total generado en el mes
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-cacao-950 pt-1 tabular-nums">
            {formatCRC(data.totalRevenue)}
          </p>
          <p className="text-xs font-medium text-cacao-800">
            {data.label} · {data.completedOrders} pedidos completados
          </p>
        </article>

        <article className="bg-crema-tarjeta rounded-2xl p-5 space-y-2 border-l-4 border-crema-dorado">
          <h2 className="font-bold text-sm text-cacao-950 underline decoration-cacao-800 underline-offset-4">
            Producto más vendido del mes
          </h2>
          <p className="text-lg sm:text-xl font-bold text-cacao-950 pt-1">
            {data.topProduct.name}
          </p>
          <p className="text-xs font-medium text-cacao-800">
            {data.topProduct.units} unidades vendidas ·{" "}
            {formatCRC(data.topProduct.revenue)} generados
          </p>
        </article>
      </div>

      <div className="bg-crema-tarjeta rounded-2xl p-5 space-y-4 flex-1">
        <h3 className="font-bold text-sm sm:text-base text-cacao-950 underline decoration-cacao-800 underline-offset-4">
          Estadística general de productos vendidos durante el mes
        </h3>
        <div className="space-y-4">
          {data.breakdown.map((row) => (
            <div key={row.name} className="space-y-1.5">
              <div className="flex flex-wrap justify-between text-xs sm:text-sm gap-2">
                <span className="font-semibold text-cacao-950">{row.name}</span>
                <span className="font-medium text-cacao-900">
                  {row.units} uds · <strong>{formatCRC(row.revenue)}</strong> (
                  {row.pct}%)
                </span>
              </div>
              <div className="w-full h-3 bg-crema-campo rounded-full overflow-hidden">
                <div
                  className="h-full bg-cacao-900 rounded-full"
                  style={{ width: `${row.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
