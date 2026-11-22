// Componente genérico de tarjeta informativa.

import React from "react";

interface MetaBlock {
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface InfoCardProps {
  avatar: React.ReactNode;
  headerTitle: string;
  badge: React.ReactNode;
  metaBlocks: [MetaBlock, MetaBlock];
  title: string;
  priceTag?: string;
  description: string;
  accentBorderClass?: string;
  actions: React.ReactNode;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  avatar,
  headerTitle,
  badge,
  metaBlocks,
  title,
  priceTag,
  description,
  accentBorderClass = "border-cacao-400/35",
  actions,
}) => {
  return (
    <article
      className={`card-interactive bg-crema-fondo rounded-2xl p-4 border shadow-sm flex flex-col justify-between gap-3.5 ${accentBorderClass}`}
    >
      {/* Encabezado */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {avatar}
          <span className="font-semibold text-sm text-cacao-950 truncate">
            {headerTitle}
          </span>
        </div>
        {badge}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {metaBlocks.map((block, idx) => (
          <div
            key={idx}
            className="bg-crema-tarjeta rounded-xl p-2.5 border border-cacao-400/20"
          >
            <div className="flex items-center gap-1.5 text-[11px] text-cacao-700 font-medium mb-0.5">
              {block.icon}
              <span>{block.label}</span>
            </div>
            <p className="text-xs font-semibold text-cacao-950 truncate tabular-nums">
              {block.value}
            </p>
          </div>
        ))}
      </div>

      {/* Título principal y descripción */}
      <div className="space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-bold text-sm text-cacao-950 truncate">{title}</h3>
          {priceTag && (
            <span className="text-xs font-bold text-cacao-900 bg-crema-pildora/60 px-2 py-0.5 rounded-md shrink-0 tabular-nums">
              {priceTag}
            </span>
          )}
        </div>
        <p className="text-xs text-cacao-800 line-clamp-2 min-h-[2rem]">
          {description}
        </p>
      </div>

      {/* Botones de acción */}
      <div className="grid grid-cols-2 gap-2 pt-1">{actions}</div>
    </article>
  );
};
