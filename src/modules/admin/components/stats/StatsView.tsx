// Dashboard administrativo.

import React, { useState } from "react";
import { MONTHLY_DASHBOARD_STATS } from "../../../../shared/data/mockData";
import { BrandBanner } from "../../../../shared/components/ui/BrandBanner";
import { FinancialAxisChart } from "./FinancialAxisChart";
import { ProfitLossChart } from "./ProfitLossChart";
import { InventoryRotationCard } from "./InventoryRotationCard";
import { TopProductsColumnChart } from "./TopProductsColumnChart";

export const StatsView: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState("2026-11");
  const stats = MONTHLY_DASHBOARD_STATS[selectedMonth];

  return (
    <section className="flex-1 flex flex-col min-h-0">
      <BrandBanner
        sectionLabel="Dashboard"
        action={
          <div className="flex items-center gap-2">
            <label
              htmlFor="stats-month"
              className="text-xs font-semibold text-cacao-950"
            >
              Mes:
            </label>
            <select
              id="stats-month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded-full bg-crema-fondo border border-cacao-500 px-3 py-1 text-xs font-semibold text-cacao-950"
            >
              <option value="2026-11">Noviembre 2026</option>
              <option value="2026-10">Octubre 2026</option>
            </select>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
        {/* Gráfica X/Y de Ingresos Brutos, Ganancia Neta y Pérdidas */}
        <FinancialAxisChart stats={stats} />

        {/* Rotación de Inventario */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ProfitLossChart data={stats.weeklyFinancials} />
          <InventoryRotationCard items={stats.inventoryRotation} />
        </div>

        {/* Columnas de Productos Más Vendidos */}
        <TopProductsColumnChart
          label={stats.label}
          products={stats.topProducts}
        />
      </div>
    </section>
  );
};
