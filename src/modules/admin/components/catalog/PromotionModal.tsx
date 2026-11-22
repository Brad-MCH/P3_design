// Modal dedicado exclusivamente a promociones (sin tamaños, masas, rellenos ni cubiertas).

import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";
import type { PromotionItem } from "../../../../shared/types/bakery";
import { BaseModal } from "../../../../shared/components/ui/BaseModal";

interface PromotionModalProps {
  isOpen: boolean;
  editingPromotion: PromotionItem | null;
  onClose: () => void;
  onSave: (promotion: PromotionItem, isEdit: boolean) => void;
}

export const PromotionModal: React.FC<PromotionModalProps> = ({
  isOpen,
  editingPromotion,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discountLabel, setDiscountLabel] = useState("");
  const [validUntil, setValidUntil] = useState("30/12/2026");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editingPromotion) {
      setName(editingPromotion.name);
      setPrice(String(editingPromotion.price));
      setDiscountLabel(editingPromotion.discountLabel);
      setValidUntil(editingPromotion.validUntil);
      setImage(editingPromotion.image ?? "");
      setDescription(editingPromotion.description);
    } else {
      setName("");
      setPrice("");
      setDiscountLabel("Oferta especial");
      setValidUntil("30/12/2026");
      setImage("");
      setDescription("");
    }
  }, [editingPromotion, isOpen]);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave(
      {
        id: editingPromotion?.id ?? `promo-${Date.now()}`,
        name: name.trim(),
        price: Number(price || 0),
        discountLabel: discountLabel.trim() || "Promoción",
        validUntil: validUntil.trim() || "Sin fecha límite",
        image: image.trim() || undefined,
        description:
          description.trim() || "Promoción exclusiva de Dulce Lienzo.",
      },
      Boolean(editingPromotion),
    );
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabelledBy="promo-modal-title"
    >
      <form
        onSubmit={handleSubmit}
        className="flex-1 p-5 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar"
      >
        <h2
          id="promo-modal-title"
          className="font-bold text-base sm:text-lg text-cacao-950 border-b border-cacao-400/50 pb-2"
        >
          {editingPromotion ? "Editar promoción" : "Nueva promoción"}
        </h2>

        <div className="bg-crema-tarjeta rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 border border-cacao-400/30">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-cacao-950 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl bg-crema-campo px-3 py-2 text-sm text-cacao-950 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-cacao-950 mb-1">
              Precio promocional (₡) *
            </label>
            <input
              type="number"
              min={0}
              step={100}
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-xl bg-crema-campo px-3 py-2 text-sm text-cacao-950 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-cacao-950 mb-1">
              Etiqueta de descuento
            </label>
            <input
              type="text"
              value={discountLabel}
              onChange={(e) => setDiscountLabel(e.target.value)}
              placeholder="Ej. 20% OFF"
              className="w-full rounded-xl bg-crema-campo px-3 py-2 text-sm text-cacao-950 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-cacao-950 mb-1">
              Válida hasta
            </label>
            <input
              type="text"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              placeholder="30/12/2026"
              className="w-full rounded-xl bg-crema-campo px-3 py-2 text-sm text-cacao-950 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-cacao-950 mb-1">
              URL de imagen
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full rounded-xl bg-crema-campo px-3 py-2 text-sm text-cacao-950 focus:bg-white"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-cacao-950 mb-1">
              Descripción
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl bg-crema-campo px-3 py-2 text-sm text-cacao-950 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-crema-pildora hover:bg-crema-pildoraActiva text-cacao-950 text-xs font-semibold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-cacao-900 hover:bg-cacao-800 text-crema-fondo text-xs font-semibold"
          >
            <Save className="w-4 h-4" />
            Guardar promoción
          </button>
        </div>
      </form>
    </BaseModal>
  );
};
