import React, { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import type { CatalogData, Order } from "../../types/bakery";
import {
  calculateOrderTotal,
  formatCRC,
  formatShortClientName,
} from "../../utils/bakeryUtils";

interface OrderDetailModalProps {
  order: Order | null;
  catalog: CatalogData;
  onClose: () => void;
  onSave: (updatedOrder: Order) => void;
  onRequestDelete: (order: Order) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  catalog,
  onClose,
  onSave,
  onRequestDelete,
}) => {
  const [activeTab, setActiveTab] = useState<"info" | "detalles">("info");
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<Order | null>(order);

  useEffect(() => {
    setDraft(order);
    setActiveTab("info");
    setIsEditing(false);
  }, [order]);

  useEffect(() => {
    if (!order) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [order, onClose]);

  const priceInfo = useMemo(() => {
    if (!draft) return { total: 0, breakdown: "", prod: undefined };
    return calculateOrderTotal(draft, catalog);
  }, [draft, catalog]);

  if (!order || !draft) return null;

  const updateField = <K extends keyof Order>(key: K, value: Order[K]) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [key]: value };
      if (key === "productoId") {
        const selectedProd = catalog.productos.find((p) => p.id === value);
        if (selectedProd) {
          next.pedidoResumen = selectedProd.tipoBase ?? "Pastel";
          next.humedad =
            selectedProd.tipoBase !== "Pastel"
              ? "No aplica"
              : (selectedProd.textura ?? "Húmedo");
        }
      }
      return next;
    });
  };

  const handleSave = () => {
    const updated: Order = {
      ...draft,
      cliente: formatShortClientName(draft.nombreCompleto),
    };
    onSave(updated);
    setIsEditing(false);
  };

  const inputClass = `w-full rounded-xl px-3 py-2 text-sm font-medium text-cacao-950 focus:outline-none transition-colors ${
    isEditing ? "bg-white ring-1 ring-cacao-800" : "bg-crema-campo"
  }`;

  return (
    <div
      className="fixed inset-0 z-40 modal-backdrop flex items-center justify-center p-2 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-order-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-crema-contenedor rounded-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-row overflow-hidden shadow-2xl relative border border-cacao-500/40">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar ventana"
          className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-crema-pildora hover:bg-crema-pildoraActiva text-cacao-950 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Barra lateral del modal */}
        <div className="w-36 md:w-44 lg:w-56 bg-crema-pildoraActiva p-3 sm:p-5 flex flex-col justify-between shrink-0 overflow-y-auto custom-scrollbar">
          <div>
            <div className="border-t-[3px] border-b-[3px] border-cacao-950 py-2 sm:py-3 text-center mb-4 sm:mb-6 mt-6 md:mt-2">
              <p className="font-bold text-xs sm:text-sm text-cacao-950">
                Pedido de
              </p>
              <h2
                id="modal-order-title"
                className="font-medium text-xs sm:text-sm text-cacao-950 mt-0.5 truncate"
              >
                {draft.cliente}
              </h2>
            </div>

            <div
              role="tablist"
              aria-label="Información del pedido"
              className="flex flex-col gap-2"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "info"}
                onClick={() => setActiveTab("info")}
                className={`text-center px-2 sm:px-4 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs transition-colors leading-snug ${
                  activeTab === "info"
                    ? "font-semibold bg-[#bca995] text-cacao-950"
                    : "font-medium text-cacao-950 hover:bg-[#bca995]/50"
                }`}
              >
                Información y entrega
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "detalles"}
                onClick={() => setActiveTab("detalles")}
                className={`text-center px-2 sm:px-4 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs transition-colors leading-snug ${
                  activeTab === "detalles"
                    ? "font-semibold bg-[#bca995] text-cacao-950"
                    : "font-medium text-cacao-950 hover:bg-[#bca995]/50"
                }`}
              >
                Detalles del pedido
              </button>
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-cacao-800/40 flex items-center justify-start sm:pl-2 gap-3 sm:gap-4 shrink-0">
            <button
              type="button"
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              aria-label={isEditing ? "Guardar" : "Editar"}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cacao-900 hover:bg-cacao-800 text-white flex items-center justify-center transition-transform hover:scale-105"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onRequestDelete(order)}
              aria-label="Eliminar"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-carmesi hover:bg-carmesi-oscuro text-white flex items-center justify-center transition-transform hover:scale-105"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contenido derecho del modal */}
        <div className="flex-1 p-3 sm:p-6 overflow-y-auto custom-scrollbar space-y-4">
          {isEditing && (
            <div className="bg-crema-vainilla/80 border border-cacao-700 rounded-xl px-4 py-2 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-cacao-950">
                Modo edición activo
              </span>
              <button
                type="button"
                onClick={handleSave}
                className="px-3.5 py-1 rounded-full bg-cacao-900 text-white text-xs font-semibold"
              >
                Guardar
              </button>
            </div>
          )}

          {activeTab === "info" ? (
            <div className="space-y-4">
              <div className="bg-crema-tarjeta rounded-2xl p-4 sm:p-5 space-y-3">
                <h3 className="font-bold text-sm sm:text-base text-cacao-950 underline decoration-cacao-950 decoration-2 underline-offset-4">
                  Información del cliente
                </h3>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-cacao-950 mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={draft.nombreCompleto}
                    onChange={(e) =>
                      updateField("nombreCompleto", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-cacao-950 mb-1">
                    Número telefónico
                  </label>
                  <input
                    type="tel"
                    readOnly={!isEditing}
                    value={draft.telefono}
                    onChange={(e) => updateField("telefono", e.target.value)}
                    className={`${inputClass} sm:w-64`}
                  />
                </div>
              </div>

              <div className="bg-crema-tarjeta rounded-2xl p-4 sm:p-5 space-y-3">
                <h3 className="font-bold text-sm sm:text-base text-cacao-950 underline decoration-cacao-950 decoration-2 underline-offset-4">
                  Detalles de entrega
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-cacao-950 mb-1">
                      Delivery
                    </label>
                    <select
                      disabled={!isEditing}
                      value={draft.delivery}
                      onChange={(e) =>
                        updateField("delivery", e.target.value as "Sí" | "No")
                      }
                      className={`${inputClass} disabled:opacity-100`}
                    >
                      <option value="Sí">Sí</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-cacao-950 mb-1">
                      Fecha de entrega
                    </label>
                    <input
                      type="text"
                      readOnly={!isEditing}
                      value={draft.fechaEntrega}
                      onChange={(e) =>
                        updateField("fechaEntrega", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-cacao-950 mb-1">
                      Estado
                    </label>
                    <select
                      disabled={!isEditing}
                      value={draft.estado}
                      onChange={(e) =>
                        updateField("estado", e.target.value as Order["estado"])
                      }
                      className={`${inputClass} disabled:opacity-100`}
                    >
                      <option value="Sin terminar">Sin terminar</option>
                      <option value="Terminado">Terminado</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-cacao-950 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={draft.direccion}
                    onChange={(e) => updateField("direccion", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-crema-tarjeta rounded-2xl p-4 sm:p-5 space-y-3">
                <h3 className="font-bold text-sm sm:text-base text-cacao-950 underline decoration-cacao-950 decoration-2 underline-offset-4">
                  Detalles del pedido
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-cacao-950 mb-1">
                      Producto solicitado
                    </label>
                    <select
                      disabled={!isEditing}
                      value={draft.productoId}
                      onChange={(e) =>
                        updateField("productoId", e.target.value)
                      }
                      className={`${inputClass} disabled:opacity-100`}
                    >
                      {catalog.productos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({formatCRC(p.price)})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-cacao-950 mb-1">
                      Textura del pastel
                    </label>
                    <select
                      disabled={!isEditing}
                      value={draft.humedad}
                      onChange={(e) =>
                        updateField(
                          "humedad",
                          e.target.value as Order["humedad"],
                        )
                      }
                      className={`${inputClass} disabled:opacity-100`}
                    >
                      <option value="Húmedo">Húmedo</option>
                      <option value="Semihúmedo">Semihúmedo</option>
                      <option value="Seco">Seco</option>
                      <option value="No aplica">No aplica</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cacao-950 mb-1">
                    Tamaño
                  </label>
                  <select
                    disabled={!isEditing}
                    value={draft.tamanoId}
                    onChange={(e) => updateField("tamanoId", e.target.value)}
                    className={`${inputClass} disabled:opacity-100`}
                  >
                    {catalog.tamanos.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({formatCRC(t.price)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-cacao-950 mb-1">
                      Masa
                    </label>
                    <select
                      disabled={!isEditing}
                      value={draft.masaId}
                      onChange={(e) => updateField("masaId", e.target.value)}
                      className={`${inputClass} disabled:opacity-100`}
                    >
                      {catalog.masas.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({formatCRC(m.price)})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-cacao-950 mb-1">
                      Relleno
                    </label>
                    <select
                      disabled={!isEditing}
                      value={draft.rellenoId}
                      onChange={(e) => updateField("rellenoId", e.target.value)}
                      className={`${inputClass} disabled:opacity-100`}
                    >
                      {catalog.rellenos.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({formatCRC(r.price)})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-cacao-950 mb-1">
                      Cubierta
                    </label>
                    <select
                      disabled={!isEditing}
                      value={draft.cubiertaId}
                      onChange={(e) =>
                        updateField("cubiertaId", e.target.value)
                      }
                      className={`${inputClass} disabled:opacity-100`}
                    >
                      {catalog.cubiertas.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({formatCRC(c.price)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cacao-950 mb-1">
                    Color o temática
                  </label>
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={draft.tematica}
                    onChange={(e) => updateField("tematica", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-cacao-950 mb-1">
                    Información adicional
                  </label>
                  <textarea
                    rows={2}
                    readOnly={!isEditing}
                    value={draft.adicional}
                    onChange={(e) => updateField("adicional", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="bg-crema-tarjeta rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-l-4 border-crema-dorado">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-cacao-950 underline decoration-cacao-800 underline-offset-4">
                    Total del pedido (según catálogo)
                  </h4>
                  <p className="text-[11px] sm:text-xs text-cacao-800 mt-1">
                    {priceInfo.breakdown}
                  </p>
                </div>
                <div className="sm:text-right shrink-0">
                  <span className="text-lg sm:text-2xl font-bold text-cacao-950 bg-crema-vainilla/70 px-3 py-1 rounded-xl inline-block tabular-nums">
                    {formatCRC(priceInfo.total)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
