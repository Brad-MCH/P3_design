// Modal dedicado para crear/editar un producto y sus características con precio de mercado.

import React, { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import type {
  CharacteristicType,
  ProductCatalogItem,
  ProductCharacteristic,
} from "../../../../shared/types/bakery";
import { formatCRC } from "../../../../shared/utils/bakeryUtils";
import { BaseModal } from "../../../../shared/components/ui/BaseModal";

interface ProductModalProps {
  isOpen: boolean;
  editingProduct: ProductCatalogItem | null;
  onClose: () => void;
  onSave: (product: ProductCatalogItem, isEdit: boolean) => void;
}

const CHARACTERISTIC_LABELS: Record<CharacteristicType, string> = {
  Size: "Tamaño",
  Flavor: "Sabor / Masa",
  Filling: "Relleno",
  Frosting: "Cubierta",
  Extra: "Extra",
};

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  editingProduct,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] =
    useState<ProductCatalogItem["category"]>("Pastel");
  const [basePrice, setBasePrice] = useState("2500");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [characteristics, setCharacteristics] = useState<
    ProductCharacteristic[]
  >([]);

  // Campos temporales para agregar una nueva característica
  const [newCharType, setNewCharType] = useState<CharacteristicType>("Size");
  const [newCharName, setNewCharName] = useState("");
  const [newCharPrice, setNewCharPrice] = useState("");

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setCategory(editingProduct.category);
      setBasePrice(String(editingProduct.basePrice));
      setImage(editingProduct.image ?? "");
      setDescription(editingProduct.description);
      setCharacteristics(editingProduct.characteristics);
    } else {
      setName("");
      setCategory("Pastel");
      setBasePrice("2500");
      setImage("");
      setDescription("");
      setCharacteristics([]);
    }
    setNewCharName("");
    setNewCharPrice("");
  }, [editingProduct, isOpen]);

  const handleAddCharacteristic = () => {
    if (!newCharName.trim()) return;
    const item: ProductCharacteristic = {
      id: `ch-${Date.now()}`,
      type: newCharType,
      name: newCharName.trim(),
      marketPrice: Number(newCharPrice || 0),
    };
    setCharacteristics((prev) => [...prev, item]);
    setNewCharName("");
    setNewCharPrice("");
  };

  const handleRemoveCharacteristic = (id: string) => {
    setCharacteristics((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;

    const product: ProductCatalogItem = {
      id: editingProduct?.id ?? `pcat-${Date.now()}`,
      name: name.trim(),
      category,
      basePrice: Number(basePrice || 0),
      image: image.trim() || undefined,
      description: description.trim() || "Producto artesanal de Dulce Lienzo.",
      characteristics,
    };

    onSave(product, Boolean(editingProduct));
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabelledBy="product-modal-title"
    >
      <form
        onSubmit={handleSubmit}
        className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar space-y-5"
      >
        <div className="border-b border-cacao-400/50 pb-3">
          <h2
            id="product-modal-title"
            className="font-bold text-base sm:text-lg text-cacao-950"
          >
            {editingProduct
              ? "Editar producto y características"
              : "Nuevo producto del catálogo"}
          </h2>
        </div>

        {/* Datos generales del producto */}
        <div className="bg-crema-tarjeta rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 border border-cacao-400/30">
          <div>
            <label className="block text-xs font-semibold text-cacao-950 mb-1">
              Nombre del producto *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Pastel Artesanal / Cheesecake"
              className="w-full rounded-xl bg-crema-campo px-3 py-2 text-sm text-cacao-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cacao-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cacao-950 mb-1">
              Tipo
            </label>
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as ProductCatalogItem["category"])
              }
              className="w-full rounded-xl bg-crema-campo px-3 py-2 text-sm text-cacao-950 focus:bg-white"
            >
              <option value="Pastel">Pastel</option>
              <option value="Cupcakes">Cupcakes</option>
              <option value="Galletas">Galletas</option>
              <option value="Cheesecake">Cheesecake</option>
              <option value="Tartaleta">Tartaleta</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-cacao-950 mb-1">
              Precio base (₡) *
            </label>
            <input
              type="number"
              min={0}
              step={100}
              required
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
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
              placeholder="https://..."
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

        {/* Gestor dinámico de características con precio de mercado */}
        <div className="bg-crema-tarjeta rounded-2xl p-4 space-y-3 border border-cacao-400/30">
          <h3 className="font-bold text-sm text-cacao-950">
            Características y precios de mercado
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
            <div className="sm:col-span-3">
              <label className="block text-[11px] font-semibold text-cacao-950 mb-1">
                Tipo
              </label>
              <select
                value={newCharType}
                onChange={(e) =>
                  setNewCharType(e.target.value as CharacteristicType)
                }
                className="w-full rounded-xl bg-crema-campo px-2.5 py-2 text-xs text-cacao-950"
              >
                {Object.entries(CHARACTERISTIC_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-[11px] font-semibold text-cacao-950 mb-1">
                Característica
              </label>
              <input
                type="text"
                value={newCharName}
                onChange={(e) => setNewCharName(e.target.value)}
                placeholder="Ej. 16 cm / Dulce de leche"
                className="w-full rounded-xl bg-crema-campo px-2.5 py-2 text-xs text-cacao-950 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[11px] font-semibold text-cacao-950 mb-1">
                Precio mercado (₡)
              </label>
              <input
                type="number"
                min={0}
                step={100}
                value={newCharPrice}
                onChange={(e) => setNewCharPrice(e.target.value)}
                placeholder="9000 / 300"
                className="w-full rounded-xl bg-crema-campo px-2.5 py-2 text-xs text-cacao-950 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={handleAddCharacteristic}
                className="w-full py-2 px-3 rounded-full bg-cacao-900 hover:bg-cacao-800 text-crema-fondo text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Añadir
              </button>
            </div>
          </div>

          <ul className="divide-y divide-cacao-400/30 max-h-44 overflow-y-auto custom-scrollbar">
            {characteristics.length === 0 ? (
              <li className="py-2 text-xs text-cacao-700">
                Aún no se han agregado características a este producto.
              </li>
            ) : (
              characteristics.map((ch) => (
                <li
                  key={ch.id}
                  className="py-2 flex items-center justify-between gap-2 text-xs sm:text-sm"
                >
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-crema-pildora text-[11px] font-semibold text-cacao-950 mr-2">
                      {CHARACTERISTIC_LABELS[ch.type]}
                    </span>
                    <span className="font-medium text-cacao-950">
                      {ch.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-cacao-900 tabular-nums">
                      +{formatCRC(ch.marketPrice)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCharacteristic(ch.id)}
                      className="p-1 rounded-full bg-carmesi/10 hover:bg-carmesi text-carmesi hover:text-white transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="flex justify-end gap-2 pt-2">
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
            Guardar producto
          </button>
        </div>
      </form>
    </BaseModal>
  );
};
