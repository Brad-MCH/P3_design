// Panel lateral del Carrito de Compras.

import React, { useState } from "react";
import { CheckCircle2, Trash2, X } from "lucide-react";
import type { CartItem } from "../types/client";
import { formatCRC } from "../../../shared/utils/bakeryUtils";

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (customerName: string, phone: string) => Promise<void>;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  onClose,
  onRemoveItem,
  onCheckout,
}) => {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleCheckout = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || items.length === 0 || busy) return;

    setBusy(true);
    setError(null);
    try {
      await onCheckout(customerName.trim(), phone.trim());
      setCustomerName("");
      setPhone("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo enviar el pedido.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex justify-end">
      <div className="w-full max-w-md bg-crema-fondo h-full shadow-2xl border-l border-cacao-400/40 flex flex-col">
        <div className="p-5 border-b border-cacao-400/30 flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-cacao-950">
            Tu Carrito
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="p-1.5 rounded-full hover:bg-crema-pildora text-cacao-950"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-cacao-700 text-center py-10">
              Tu carrito está vacío. ¡Empieza a diseñar tu pastel!
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-crema-tarjeta rounded-2xl p-3 border border-cacao-400/30 flex gap-3 items-start"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-cacao-950 truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-cacao-700 line-clamp-2">
                    {item.details}
                  </p>
                  <p className="text-xs font-bold text-cacao-900 mt-1 tabular-nums">
                    {formatCRC(item.price)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="p-1.5 rounded-full text-carmesi hover:bg-carmesi/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Formulario */}
        {items.length > 0 && (
          <form
            onSubmit={handleCheckout}
            className="p-5 bg-crema-tarjeta border-t border-cacao-400/40 space-y-3"
          >
            {(items.some((item) => !item.cake) || items.length > 1) && (
              <p role="alert" className="text-xs text-carmesi">
                Solo se puede confirmar un pastel personalizado por pedido. Elimina los demás artículos para continuar.
              </p>
            )}
            {error && <p role="alert" className="text-xs text-carmesi">{error}</p>}
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-bold text-cacao-950">
                Total a pagar
              </span>
              <span className="font-serif text-xl font-bold text-cacao-950 tabular-nums">
                {formatCRC(total)}
              </span>
            </div>

            <input
              type="text"
              required
              minLength={1}
              maxLength={100}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Tu nombre completo *"
              className="w-full rounded-xl bg-crema-campo px-3 py-2 text-xs text-cacao-950 focus:bg-white"
            />
            <input
              type="tel"
              required
              minLength={7}
              maxLength={25}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Teléfono / WhatsApp *"
              className="w-full rounded-xl bg-crema-campo px-3 py-2 text-xs text-cacao-950 focus:bg-white"
            />

            <button
              type="submit"
              disabled={busy || items.length !== 1 || items.some((item) => !item.cake)}
              className="w-full py-3 rounded-full bg-cacao-900 hover:bg-cacao-800 disabled:opacity-50 text-crema-fondo text-xs sm:text-sm font-semibold flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {busy ? "Enviando pedido…" : "Confirmar pedido"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
