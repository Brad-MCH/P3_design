import React, { useState } from "react";
import type {
  CatalogCategory,
  CatalogData,
  CatalogItem,
} from "../../types/bakery";
import { formatCRC } from "../../utils/bakeryUtils";

interface CatalogViewProps {
  bakeryName: string;
  catalog: CatalogData;
  onSaveItem: (
    category: CatalogCategory,
    item: CatalogItem,
    isEdit: boolean,
  ) => void;
  onDeleteItem: (category: CatalogCategory, item: CatalogItem) => void;
}

const TABS: { key: CatalogCategory; label: string }[] = [
  { key: "productos", label: "Productos" },
  { key: "tamanos", label: "Tamaños" },
  { key: "masas", label: "Masas" },
  { key: "rellenos", label: "Rellenos" },
  { key: "cubiertas", label: "Cubiertas" },
  { key: "promociones", label: "Promociones" },
  { key: "opcionesPrehechas", label: "Opciones Prehechas" },
];

export const CatalogView: React.FC<CatalogViewProps> = ({
  bakeryName,
  catalog,
  onSaveItem,
  onDeleteItem,
}) => {
  const [activeTab, setActiveTab] = useState<CatalogCategory>("productos");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [category, setCategory] = useState<CatalogCategory>("productos");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const openAdd = () => {
    setEditId(null);
    setCategory(activeTab);
    setName("");
    setPrice("");
    setImage("");
    setShowForm(true);
  };

  const openEdit = (item: CatalogItem) => {
    setEditId(item.id);
    setCategory(activeTab);
    setName(item.name);
    setPrice(String(item.price));
    setImage(item.image ?? "");
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: CatalogItem = {
      id: editId ?? `cat-${Date.now()}`,
      name: name.trim(),
      price: Number(price),
      image: image.trim() || undefined,
      tipoBase: name.toLowerCase().includes("cupcake")
        ? "Cupcakes"
        : name.toLowerCase().includes("galleta")
          ? "Galletas"
          : "Pastel",
      textura: name.toLowerCase().includes("seco")
        ? "Seco"
        : name.toLowerCase().includes("semihúmedo")
          ? "Semihúmedo"
          : "Húmedo",
    };
    onSaveItem(category, item, Boolean(editId));
    setActiveTab(category);
    setShowForm(false);
  };

  return (
    <section className="flex-1 flex flex-col space-y-4 overflow-y-auto custom-scrollbar pr-1">
      <div className="w-full bg-crema-pildora rounded-full py-2 sm:py-2.5 px-3 sm:px-5 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
        <div className="w-28 hidden sm:block" />
        <h1 className="text-center font-semibold text-sm sm:text-lg text-cacao-950">
          Catálogo de {bakeryName}
        </h1>
        <button
          type="button"
          onClick={openAdd}
          className="px-3.5 py-1 rounded-full bg-cacao-900 hover:bg-cacao-800 text-crema-fondo text-xs font-semibold transition-colors"
        >
          + Agregar ítem
        </button>
      </div>

      <div className="flex flex-wrap gap-2 shrink-0" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={activeTab === t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm transition-colors ${
              activeTab === t.key
                ? "font-semibold bg-crema-pildoraActiva text-cacao-950"
                : "font-medium bg-crema-pildora text-cacao-950 hover:bg-crema-pildoraActiva/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="bg-crema-tarjeta border border-cacao-700 rounded-2xl p-4 sm:p-5 shadow-sm shrink-0">
          <h2 className="font-bold text-sm text-cacao-950 mb-3 underline decoration-cacao-800 underline-offset-4">
            {editId
              ? "Editar elemento del catálogo"
              : "Agregar elemento al catálogo"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
          >
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-cacao-950 mb-1">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CatalogCategory)}
                className="w-full rounded-xl bg-crema-campo border border-cacao-500 px-3 py-2 text-sm text-cacao-950"
              >
                {TABS.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-cacao-950 mb-1">
                Nombre
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl bg-crema-campo border border-cacao-500 px-3 py-2 text-sm text-cacao-950"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-cacao-950 mb-1">
                Precio (₡)
              </label>
              <input
                type="number"
                min={0}
                step={100}
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl bg-crema-campo border border-cacao-500 px-3 py-2 text-sm text-cacao-950"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-cacao-950 mb-1">
                URL Imagen
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full rounded-xl bg-crema-campo border border-cacao-500 px-3 py-2 text-sm text-cacao-950"
              />
            </div>
            <div className="sm:col-span-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2 px-3 rounded-full bg-cacao-900 hover:bg-cacao-800 text-white text-xs font-semibold"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="py-2 px-3 rounded-full bg-crema-pildora hover:bg-crema-pildoraActiva text-cacao-950 text-xs font-semibold"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-crema-tarjeta rounded-2xl p-4 sm:p-5 overflow-x-auto custom-scrollbar flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-cacao-800/40 text-xs font-bold text-cacao-950 uppercase">
              <th className="py-3 px-2 sm:px-4">Imagen</th>
              <th className="py-3 px-2 sm:px-4">Detalle</th>
              <th className="py-3 px-2 sm:px-4">Precio (CRC)</th>
              <th className="py-3 px-2 sm:px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cacao-800/20 text-sm">
            {catalog[activeTab].map((item) => (
              <tr key={item.id}>
                <td className="py-2 px-2 sm:px-4">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-md border border-cacao-300"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-crema-campo rounded-md flex items-center justify-center text-xs text-cacao-500">
                      N/A
                    </div>
                  )}
                </td>
                <td className="py-3 px-2 sm:px-4 font-medium text-cacao-950">
                  {item.name}
                </td>
                <td className="py-3 px-2 sm:px-4 font-bold text-cacao-900 tabular-nums">
                  {formatCRC(item.price)}
                </td>
                <td className="py-3 px-2 sm:px-4 text-right space-x-2 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="px-3 py-1 rounded-full bg-crema-pildora hover:bg-crema-pildoraActiva text-cacao-950 text-xs font-semibold"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteItem(activeTab, item)}
                    className="px-3 py-1 rounded-full bg-carmesi hover:bg-carmesi-oscuro text-white text-xs font-semibold"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
