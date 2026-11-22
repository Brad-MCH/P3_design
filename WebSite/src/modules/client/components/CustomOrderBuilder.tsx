// Constructor interactivo de pedidos para clientes.
import React, { useMemo, useState } from "react";
import { ShoppingBag, Cake } from "lucide-react";
import type { CatalogData } from "../../../shared/types/bakery";
import type { CartItem } from "../types/client";
import { CakeBuilder } from "../../../patterns/CakeBuilder";
import { formatCRC } from "../../../shared/utils/bakeryUtils";

interface CustomOrderBuilderProps {
  catalog: CatalogData;
  onAddBuiltCakeToCart: (item: CartItem) => void;
}

export const CustomOrderBuilder: React.FC<CustomOrderBuilderProps> = ({
  catalog,
  onAddBuiltCakeToCart,
}) => {
  const [productId, setProductId] = useState(catalog.productos[0]?.id ?? "");
  const [texture, setTexture] = useState("Húmedo");
  const [sizeId, setSizeId] = useState(catalog.tamanos[0]?.id ?? "");
  const [flavorId, setFlavorId] = useState(catalog.masas[0]?.id ?? "");
  const [fillingId, setFillingId] = useState(catalog.rellenos[0]?.id ?? "");
  const [frostingId, setFrostingId] = useState(catalog.cubiertas[0]?.id ?? "");
  const [deliveryMethod, setDeliveryMethod] = useState<"Retiro" | "Delivery">(
    "Retiro",
  );
  const [theme, setTheme] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  // Aplica un atajo rápido precargando producto, tamaño y sabores sugeridos
  const applyQuickPreset = (presetProductId: string) => {
    setProductId(presetProductId);
    const prod = catalog.productos.find((p) => p.id === presetProductId);
    if (prod?.tipoBase === "Pastel") {
      setSizeId(catalog.tamanos[1]?.id ?? catalog.tamanos[0]?.id ?? "");
      setTexture(prod.textura ?? "Húmedo");
    } else {
      setSizeId(catalog.tamanos[4]?.id ?? catalog.tamanos[0]?.id ?? "");
      setTexture("No aplica");
    }
    setErrors([]);
  };

  // construye el resumen y el total
  const builtCake = useMemo(() => {
    const builder = new CakeBuilder()
      .setProduct(catalog.productos.find((p) => p.id === productId))
      .setTexture(texture)
      .setSize(catalog.tamanos.find((t) => t.id === sizeId))
      .setFlavor(catalog.masas.find((m) => m.id === flavorId))
      .setFilling(catalog.rellenos.find((r) => r.id === fillingId))
      .setFrosting(catalog.cubiertas.find((c) => c.id === frostingId))
      .setDeliveryMethod(deliveryMethod)
      .setTheme(theme);

    return { builder, result: builder.build() };
  }, [
    productId,
    texture,
    sizeId,
    flavorId,
    fillingId,
    frostingId,
    deliveryMethod,
    theme,
    catalog,
  ]);

  const handleAddToCart = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = builtCake.builder.validate();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors([]);

    onAddBuiltCakeToCart({
      id: `custom-${Date.now()}`,
      name: builtCake.result.productName,
      details: builtCake.result.summaryText,
      price: builtCake.result.total,
      quantity: 1,
      image: builtCake.result.image,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="text-center space-y-1">
        <h2 className="font-serif text-3xl font-bold text-cacao-950">
          Construye tu Pastel
        </h2>
        <p className="text-sm text-cacao-800">
          Usa un atajo o personaliza cada detalle de tu creación.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Formulario izquierdo */}
        <form
          id="custom-cake-form"
          onSubmit={handleAddToCart}
          className="lg:col-span-8 space-y-5"
        >
          {/* Atajos */}
          <div className="bg-crema-contenedor/70 border border-cacao-400/40 rounded-2xl p-4 sm:p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-cacao-950 mb-3 flex items-center gap-1.5">
              <Cake className="w-4 h-4 text-cacao-900" />
              Atajos
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {catalog.productos.slice(0, 3).map((prod) => (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => applyQuickPreset(prod.id)}
                  className={`bg-crema-fondo rounded-xl p-2.5 border-2 text-left transition-all flex items-center gap-3 ${
                    productId === prod.id
                      ? "border-cacao-900 shadow-xs"
                      : "border-transparent hover:border-cacao-400"
                  }`}
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-cacao-950 truncate">
                      {prod.name}
                    </p>
                    <p className="text-[11px] text-cacao-700 tabular-nums">
                      {formatCRC(prod.price)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Configuración */}
          <div className="bg-crema-tarjeta rounded-2xl p-5 border border-cacao-400/35 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-cacao-950 mb-1">
                Producto base *
              </label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full rounded-xl bg-crema-campo px-3 py-2.5 text-sm text-cacao-950"
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
                Textura del bizcocho
              </label>
              <select
                value={texture}
                onChange={(e) => setTexture(e.target.value)}
                className="w-full rounded-xl bg-crema-campo px-3 py-2.5 text-sm text-cacao-950"
              >
                <option value="Húmedo">Húmedo</option>
                <option value="Semihúmedo">Semihúmedo</option>
                <option value="Seco">Seco</option>
                <option value="No aplica">No aplica</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-cacao-950 mb-1">
                Tamaño *
              </label>
              <select
                value={sizeId}
                onChange={(e) => setSizeId(e.target.value)}
                className="w-full rounded-xl bg-crema-campo px-3 py-2.5 text-sm text-cacao-950"
              >
                {catalog.tamanos.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (+{formatCRC(t.price)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-cacao-950 mb-1">
                Masa
              </label>
              <select
                value={flavorId}
                onChange={(e) => setFlavorId(e.target.value)}
                className="w-full rounded-xl bg-crema-campo px-3 py-2.5 text-sm text-cacao-950"
              >
                {catalog.masas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} (+{formatCRC(m.price)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-cacao-950 mb-1">
                Relleno
              </label>
              <select
                value={fillingId}
                onChange={(e) => setFillingId(e.target.value)}
                className="w-full rounded-xl bg-crema-campo px-3 py-2.5 text-sm text-cacao-950"
              >
                {catalog.rellenos.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} (+{formatCRC(r.price)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-cacao-950 mb-1">
                Cubierta
              </label>
              <select
                value={frostingId}
                onChange={(e) => setFrostingId(e.target.value)}
                className="w-full rounded-xl bg-crema-campo px-3 py-2.5 text-sm text-cacao-950"
              >
                {catalog.cubiertas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (+{formatCRC(c.price)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-cacao-950 mb-1">
                Método de entrega
              </label>
              <select
                value={deliveryMethod}
                onChange={(e) =>
                  setDeliveryMethod(e.target.value as "Retiro" | "Delivery")
                }
                className="w-full rounded-xl bg-crema-campo px-3 py-2.5 text-sm text-cacao-950"
              >
                <option value="Retiro">Retiro en local (Gratis)</option>
                <option value="Delivery">Envío a domicilio (+₡3,000)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-cacao-950 mb-1">
                Color, temática o dedicatoria
              </label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Ej. Flores naturales, tonos pastel, texto 'Feliz Cumpleaños'..."
                className="w-full rounded-xl bg-crema-campo px-3 py-2.5 text-sm text-cacao-950 focus:bg-white"
              />
            </div>

            {errors.length > 0 && (
              <div className="sm:col-span-2 bg-carmesi/10 border border-carmesi rounded-xl p-3 text-xs text-carmesi font-semibold">
                {errors.join(" ")}
              </div>
            )}
          </div>
        </form>

        {/* Resumen */}
        <aside className="lg:col-span-4 lg:sticky lg:top-28 bg-crema-tarjeta rounded-2xl p-5 border border-cacao-400/40 shadow-md space-y-4">
          <h3 className="font-serif text-lg font-bold text-cacao-950 border-b border-cacao-400/30 pb-2">
            Resumen de tu obra
          </h3>

          {builtCake.result.image && (
            <img
              src={builtCake.result.image}
              alt={builtCake.result.productName}
              className="w-full h-36 object-cover rounded-xl border border-cacao-400/30"
            />
          )}

          <div className="text-xs space-y-1.5 text-cacao-900">
            <p className="font-bold text-sm text-cacao-950">
              {builtCake.result.productName}
            </p>
            <p>{builtCake.result.summaryText}</p>
          </div>

          <div className="border-t border-cacao-400/30 pt-3 space-y-1 text-xs">
            <div className="flex justify-between text-cacao-800">
              <span>Subtotal</span>
              <span className="tabular-nums">
                {formatCRC(builtCake.result.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-cacao-800">
              <span>Envío ({deliveryMethod})</span>
              <span className="tabular-nums">
                {formatCRC(builtCake.result.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-cacao-400/40">
              <span className="font-bold text-sm text-cacao-950">
                Total estimado
              </span>
              <span className="font-serif text-2xl font-bold text-cacao-950 tabular-nums">
                {formatCRC(builtCake.result.total)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            form="custom-cake-form"
            className="w-full py-3 px-4 rounded-full bg-cacao-900 hover:bg-cacao-800 text-crema-fondo text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Agregar al carrito</span>
          </button>
        </aside>
      </div>
    </div>
  );
};
