// Componente dedicado para mostrar un producto del catálogo con imagen y características.

import React from "react";
import { Pencil, Tag, Trash2 } from "lucide-react";
import type { ProductCatalogItem } from "../../../../shared/types/bakery";
import { formatCRC } from "../../../../shared/utils/bakeryUtils";

interface ProductCardProps {
  product: ProductCatalogItem;
  onEdit: (product: ProductCatalogItem) => void;
  onDelete: (product: ProductCatalogItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  // Calcula el precio mínimo estimado sumando la característica más económica si existe
  const minCharacteristicPrice =
    product.characteristics.length > 0
      ? Math.min(...product.characteristics.map((c) => c.marketPrice))
      : 0;

  return (
    <article className="card-interactive bg-crema-fondo rounded-2xl overflow-hidden border border-cacao-400/35 shadow-sm flex flex-col justify-between">
      <div>
        {/* Imagen superior del producto */}
        <div className="relative h-40 w-full bg-crema-campo overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-cacao-700">
              Sin imagen
            </div>
          )}
          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-cacao-950/85 text-crema-fondo text-[11px] font-semibold">
            {product.category}
          </span>
          <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-crema-vainilla text-cacao-950 text-xs font-bold tabular-nums shadow-xs">
            Desde {formatCRC(product.basePrice + minCharacteristicPrice)}
          </span>
        </div>

        {/* Cuerpo de la tarjeta */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-cacao-950 truncate">
              {product.name}
            </h3>
            <p className="text-xs text-cacao-800 line-clamp-2 mt-0.5">
              {product.description}
            </p>
          </div>

          {/* Listado resumido de características y su precio de mercado */}
          <div className="bg-crema-tarjeta rounded-xl p-2.5 border border-cacao-400/20 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-cacao-800">
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                Características ({product.characteristics.length})
              </span>
              <span>Base: {formatCRC(product.basePrice)}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto custom-scrollbar">
              {product.characteristics.map((ch) => (
                <span
                  key={ch.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-crema-fondo border border-cacao-400/30 text-[11px] text-cacao-950"
                >
                  <span className="font-medium truncate max-w-[110px]">
                    {ch.name}
                  </span>
                  <strong className="text-cacao-900 tabular-nums">
                    +{formatCRC(ch.marketPrice)}
                  </strong>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Acciones inferiores */}
      <div className="px-4 pb-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onEdit(product)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-crema-pildora hover:bg-crema-pildoraActiva text-cacao-950 text-xs font-semibold transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
          <span>Editar</span>
        </button>
        <button
          type="button"
          onClick={() => onDelete(product)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-carmesi hover:bg-carmesi-oscuro text-white text-xs font-semibold transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Eliminar</span>
        </button>
      </div>
    </article>
  );
};
