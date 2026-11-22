// Gráfica de Ingresos Brutos, Ganancia Neta y Pérdidas.

import React from "react";
import type { DashboardMonthStats } from "../../../../shared/types/bakery";
import { formatCRC } from "../../../../shared/utils/bakeryUtils";

interface FinancialAxisChartProps {
  stats: DashboardMonthStats;
}

export const FinancialAxisChart: React.FC<FinancialAxisChartProps> = ({
  stats,
}) => {
  const points = stats.weeklyFinancials.map((w) => ({
    week: w.week,
    revenue: w.revenue,
    netProfit: Math.max(0, w.revenue - w.expenses - w.losses),
    losses: w.losses,
  }));

  // Dimensiones del lienzo
  const width = 680;
  const height = 240;
  const pad = { top: 20, right: 24, bottom: 34, left: 68 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const maxY =
    Math.ceil(Math.max(...points.map((p) => p.revenue), 1) / 50000) * 50000;
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(maxY * t));

  const getX = (idx: number) =>
    pad.left +
    (points.length > 1 ? (idx / (points.length - 1)) * plotW : plotW / 2);
  const getY = (val: number) => pad.top + plotH - (val / maxY) * plotH;

  const buildPath = (key: "revenue" | "netProfit" | "losses") =>
    points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(p[key])}`)
      .join(" ");

  return (
    <article className="bg-crema-tarjeta rounded-2xl p-5 border border-cacao-400/30 space-y-4">
      {/* Encabezado con resumen numérico y leyenda */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="font-bold text-sm sm:text-base text-cacao-950">
            Evolución Financiera ({stats.label})
          </h2>
          <p className="text-[11px] text-cacao-700">
            Comparativa semanal en colones · {stats.completedOrders} pedidos
            completados
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-crema-fondo border border-cacao-400/30 font-semibold text-cacao-950">
            <i className="w-2.5 h-2.5 rounded-full bg-cacao-900 inline-block" />
            Ingresos: {formatCRC(stats.totalRevenue)}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-crema-fondo border border-emerald-700/30 font-semibold text-emerald-900">
            <i className="w-2.5 h-2.5 rounded-full bg-emerald-700 inline-block" />
            Ganancia: {formatCRC(stats.netProfit)}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-crema-fondo border border-carmesi/30 font-semibold text-carmesi">
            <i className="w-2.5 h-2.5 rounded-full bg-carmesi inline-block" />
            Pérdidas: {formatCRC(stats.totalLosses)}
          </span>
        </div>
      </div>

      {/* Gráfica */}
      <div className="w-full overflow-x-auto custom-scrollbar">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[460px] h-56"
          role="img"
          aria-label="Gráfica lineal de ingresos brutos, ganancia neta y pérdidas por semana"
        >
          {/* Líneas guía horizontales */}
          {yTicks.map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <line
                  x1={pad.left}
                  y1={y}
                  x2={width - pad.right}
                  y2={y}
                  stroke="#cbbba8"
                  strokeDasharray={tick === 0 ? undefined : "4 4"}
                  strokeWidth={tick === 0 ? 1.5 : 1}
                />
                <text
                  x={pad.left - 10}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="central"
                  fill="#713112"
                  fontSize="11"
                  fontWeight="600"
                >
                  ₡{Math.round(tick / 1000)}k
                </text>
              </g>
            );
          })}

          {/* Eje Y vertical */}
          <line
            x1={pad.left}
            y1={pad.top}
            x2={pad.left}
            y2={pad.top + plotH}
            stroke="#874421"
            strokeWidth="1.5"
          />

          {/* Líneas de series */}
          <path
            d={buildPath("revenue")}
            fill="none"
            stroke="#5b1f00"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d={buildPath("netProfit")}
            fill="none"
            stroke="#047857"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d={buildPath("losses")}
            fill="none"
            stroke="#d11a1a"
            strokeWidth="2.5"
            strokeDasharray="5 3"
            strokeLinecap="round"
          />

          {/* Puntos y etiquetas del Eje X */}
          {points.map((p, i) => {
            const cx = getX(i);
            return (
              <g key={p.week}>
                <circle
                  cx={cx}
                  cy={getY(p.revenue)}
                  r="5"
                  fill="#5b1f00"
                  stroke="#f4eee6"
                  strokeWidth="2"
                >
                  <title>{`${p.week} · Ingresos: ${formatCRC(p.revenue)}`}</title>
                </circle>
                <circle
                  cx={cx}
                  cy={getY(p.netProfit)}
                  r="5"
                  fill="#047857"
                  stroke="#f4eee6"
                  strokeWidth="2"
                >
                  <title>{`${p.week} · Ganancia Neta: ${formatCRC(p.netProfit)}`}</title>
                </circle>
                <circle
                  cx={cx}
                  cy={getY(p.losses)}
                  r="4.5"
                  fill="#d11a1a"
                  stroke="#f4eee6"
                  strokeWidth="2"
                >
                  <title>{`${p.week} · Pérdidas: ${formatCRC(p.losses)}`}</title>
                </circle>
                <text
                  x={cx}
                  y={height - 10}
                  textAnchor="middle"
                  fill="#3a1300"
                  fontSize="12"
                  fontWeight="700"
                >
                  {p.week}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </article>
  );
};
