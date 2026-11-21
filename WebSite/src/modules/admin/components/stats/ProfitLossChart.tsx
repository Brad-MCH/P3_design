// Gráfica Pie Chart para el desglose financiero.
import React, { useMemo, useState } from "react";
import type { WeeklyFinancialPoint } from "../../../../shared/types/bakery";
import { formatCRC } from "../../../../shared/utils/bakeryUtils";

interface CakeSlice {
  id: string;
  label: string;
  value: number;
  percentage: number;
  color: string;
  flavorHint: string;
}

// Convierte coordenadas polares a cartesianas
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

// Genera la seccion de la grafica Pie Chart
function describeSlice(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

export const ProfitLossChart: React.FC<{ data: WeeklyFinancialPoint[] }> = ({
  data,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Agrupa ingresos, costos y pérdidas para mostrar el flujo financiero mensual
  const { slices, totalRevenue } = useMemo(() => {
    const revenue = data.reduce((sum, d) => sum + d.revenue, 0);
    const expenses = data.reduce((sum, d) => sum + d.expenses, 0);
    const losses = data.reduce((sum, d) => sum + d.losses, 0);
    const netProfit = Math.max(0, revenue - expenses - losses);
    const safeTotal = revenue || 1;

    const computedSlices: CakeSlice[] = [
      {
        id: "profit",
        label: "Ganancia Neta",
        value: netProfit,
        percentage: (netProfit / safeTotal) * 100,
        color: "#5b1f00",
        flavorHint: "Margen libre del mes",
      },
      {
        id: "expenses",
        label: "Costos Operativos",
        value: expenses,
        percentage: (expenses / safeTotal) * 100,
        color: "#b4764f",
        flavorHint: "Insumos y producción",
      },
      {
        id: "losses",
        label: "Pérdidas",
        value: losses,
        percentage: (losses / safeTotal) * 100,
        color: "#d11a1a",
        flavorHint: "Desperdicio y ajustes",
      },
    ];

    return { slices: computedSlices, totalRevenue: revenue };
  }, [data]);

  // Calcula ángulos acumulados y coordenadas de etiquetas
  const renderedSlices = useMemo(() => {
    let currentAngle = 0;
    return slices.map((slice) => {
      const sweep = (slice.percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sweep;
      const midAngle = startAngle + sweep / 2;
      currentAngle = endAngle;

      const labelPos = polarToCartesian(110, 110, 56, midAngle);
      const offsetPos = polarToCartesian(0, 0, 5, midAngle);

      return {
        ...slice,
        path: describeSlice(110, 110, 82, startAngle, endAngle),
        labelPos,
        offsetPos,
      };
    });
  }, [slices]);

  // Circulo decorativo de la grafica
  const frostingDots = useMemo(
    () =>
      Array.from({ length: 24 }, (_, idx) =>
        polarToCartesian(110, 110, 88, idx * 15),
      ),
    [],
  );

  return (
    <article className="bg-crema-tarjeta rounded-2xl p-5 border border-cacao-400/30 flex flex-col justify-between gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-cacao-950">
            Distribución Financiera
          </h3>
          <p className="text-[11px] text-cacao-700">
            Ingresos totales: <strong>{formatCRC(totalRevenue)}</strong>
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        {/* Gráfica */}
        <div className="relative shrink-0">
          <svg
            viewBox="0 0 220 220"
            className="w-48 h-48 sm:w-52 sm:h-52 drop-shadow-sm"
            role="img"
            aria-label="Gráfica circular de distribución financiera con estética de pastel"
          >
            {/* Base de la grafica */}
            <circle
              cx="110"
              cy="110"
              r="102"
              fill="#e4d8ca"
              stroke="#cd966c"
              strokeWidth="1.5"
            />

            {/* Borde decorativo */}
            {frostingDots.map((dot, idx) => (
              <circle
                key={idx}
                cx={dot.x}
                cy={dot.y}
                r="7.5"
                fill="#f4eee6"
                stroke="#d8cbbe"
                strokeWidth="1"
              />
            ))}

            {/* Secciones de graficas */}
            {renderedSlices.map((slice) => {
              const isHovered = hoveredId === slice.id;
              return (
                <g
                  key={slice.id}
                  onMouseEnter={() => setHoveredId(slice.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="cursor-pointer transition-transform duration-200"
                  style={{
                    transform: isHovered
                      ? `translate(${slice.offsetPos.x}px, ${slice.offsetPos.y}px)`
                      : "translate(0px, 0px)",
                  }}
                >
                  <path
                    d={slice.path}
                    fill={slice.color}
                    stroke="#f4eee6"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  {slice.percentage >= 5 && (
                    <text
                      x={slice.labelPos.x}
                      y={slice.labelPos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#f4eee6"
                      fontSize="11"
                      fontWeight="700"
                    >
                      {slice.percentage.toFixed(1)}%
                    </text>
                  )}
                </g>
              );
            })}

            {/* Circulo central */}
            <circle
              cx="110"
              cy="110"
              r="10"
              fill="#f4eee6"
              stroke="#d8cbbe"
              strokeWidth="1.5"
            />
            <circle cx="110" cy="110" r="4.5" fill="#d11a1a" />
          </svg>
        </div>

        {/* Leyenda lateral */}
        <ul className="w-full sm:flex-1 space-y-2.5">
          {slices.map((slice) => {
            const isHovered = hoveredId === slice.id;
            return (
              <li
                key={slice.id}
                onMouseEnter={() => setHoveredId(slice.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  isHovered
                    ? "bg-crema-fondo border-cacao-700 shadow-xs"
                    : "bg-crema-fondo/60 border-cacao-400/25"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3.5 h-3.5 rounded-sm shrink-0"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span className="text-xs font-bold text-cacao-950 truncate">
                      {slice.label}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-cacao-950 tabular-nums shrink-0">
                    {slice.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-cacao-700 mt-1 pl-5">
                  <span>{slice.flavorHint}</span>
                  <span className="font-semibold text-cacao-900 tabular-nums">
                    {formatCRC(slice.value)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
};
