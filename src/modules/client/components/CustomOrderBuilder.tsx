import React, { useState } from "react";
import { ShoppingBag } from "lucide-react";
import type { CartItem } from "../types/client";
import type { ApiCakeConfiguration } from "../../../shared/types/bakery";
import { formatCRC } from "../../../shared/utils/bakeryUtils";

type CakeSize = "small" | "medium" | "large";
type CakeFlavor = "vanilla" | "chocolate" | "red_velvet" | "lemon";
type CakeFrosting = "buttercream" | "cream_cheese" | "ganache";
type CakeDesign = "classic" | "floral" | "birthday" | "minimal";
type CakeExtra = "candles" | "fruit" | "macarons";

interface CakeConfiguration {
  size: CakeSize;
  flavor: CakeFlavor;
  frosting: CakeFrosting;
  design: CakeDesign;
  color: string;
  message: string;
  extras: CakeExtra[];
}

const cakePrices = {
  size: { small: 12000, medium: 18000, large: 26000 },
  flavor: { vanilla: 0, chocolate: 1500, red_velvet: 2500, lemon: 1000 },
  frosting: { buttercream: 0, cream_cheese: 1500, ganache: 2000 },
  design: { classic: 0, floral: 3000, birthday: 2000, minimal: 0 },
  extra: { candles: 1000, fruit: 2500, macarons: 4000 },
};

interface CustomOrderBuilderProps {
  onAddBuiltCakeToCart: (item: CartItem) => void;
}

export const CustomOrderBuilder: React.FC<CustomOrderBuilderProps> = ({
  onAddBuiltCakeToCart,
}) => {
  const [cake, setCake] = useState<CakeConfiguration>({
    size: "medium",
    flavor: "chocolate",
    frosting: "buttercream",
    design: "floral",
    color: "#E98D9C",
    message: "",
    extras: [],
  });

  const setCakeField = <K extends keyof CakeConfiguration>(
    field: K,
    value: CakeConfiguration[K],
  ) => setCake((current) => ({ ...current, [field]: value }));

  const toggleExtra = (extra: CakeExtra) =>
    setCakeField(
      "extras",
      cake.extras.includes(extra)
        ? cake.extras.filter((item) => item !== extra)
        : [...cake.extras, extra],
    );

  const total =
    cakePrices.size[cake.size] +
    cakePrices.flavor[cake.flavor] +
    cakePrices.frosting[cake.frosting] +
    cakePrices.design[cake.design] +
    cake.extras.reduce((sum, extra) => sum + cakePrices.extra[extra], 0);

  const handleAddToCart = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const details = [
      `Tamaño: ${cake.size}`,
      `Sabor: ${cake.flavor}`,
      `Cubierta: ${cake.frosting}`,
      `Diseño: ${cake.design}`,
      `Color: ${cake.color}`,
      cake.message && `Mensaje: ${cake.message}`,
      cake.extras.length > 0 && `Extras: ${cake.extras.join(", ")}`,
    ]
      .filter(Boolean)
      .join(" · ");

    onAddBuiltCakeToCart({
      id: `custom-${Date.now()}`,
      name: "Pastel personalizado",
      details,
      price: total,
      quantity: 1,
      cake: { ...cake } satisfies ApiCakeConfiguration,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="text-center space-y-1">
        <h2 className="font-serif text-3xl font-bold text-cacao-950">
          Construye tu Pastel
        </h2>
        <p className="text-sm text-cacao-800">
          Personaliza tu pastel con las opciones disponibles.
        </p>
      </div>

      <div className="max-w-3xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <form
          id="custom-cake-form"
          onSubmit={handleAddToCart}
          className="lg:col-span-2 bg-crema-tarjeta rounded-2xl p-5 border border-cacao-400/35 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div>
            <label htmlFor="cake-size" className="block text-xs font-semibold text-cacao-950 mb-1">
              Tamaño
            </label>
            <select id="cake-size" value={cake.size} onChange={(event) => setCakeField("size", event.target.value as CakeSize)} className="w-full rounded-xl bg-crema-campo px-3 py-2.5 text-sm text-cacao-950">
              <option value="small">Pequeño</option>
              <option value="medium">Mediano</option>
              <option value="large">Grande</option>
            </select>
          </div>
          <div>
            <label htmlFor="cake-flavor" className="block text-xs font-semibold text-cacao-950 mb-1">
              Sabor
            </label>
            <select id="cake-flavor" value={cake.flavor} onChange={(event) => setCakeField("flavor", event.target.value as CakeFlavor)} className="w-full rounded-xl bg-crema-campo px-3 py-2.5 text-sm text-cacao-950">
              <option value="vanilla">Vainilla</option>
              <option value="chocolate">Chocolate</option>
              <option value="red_velvet">Red Velvet</option>
              <option value="lemon">Limón</option>
            </select>
          </div>
          <div>
            <label htmlFor="cake-frosting" className="block text-xs font-semibold text-cacao-950 mb-1">
              Cubierta
            </label>
            <select id="cake-frosting" value={cake.frosting} onChange={(event) => setCakeField("frosting", event.target.value as CakeFrosting)} className="w-full rounded-xl bg-crema-campo px-3 py-2.5 text-sm text-cacao-950">
              <option value="buttercream">Buttercream</option>
              <option value="cream_cheese">Queso crema</option>
              <option value="ganache">Ganache</option>
            </select>
          </div>
          <div>
            <label htmlFor="cake-design" className="block text-xs font-semibold text-cacao-950 mb-1">
              Diseño
            </label>
            <select id="cake-design" value={cake.design} onChange={(event) => setCakeField("design", event.target.value as CakeDesign)} className="w-full rounded-xl bg-crema-campo px-3 py-2.5 text-sm text-cacao-950">
              <option value="classic">Clásico</option>
              <option value="floral">Floral</option>
              <option value="birthday">Cumpleaños</option>
              <option value="minimal">Minimalista</option>
            </select>
          </div>
          <div>
            <label htmlFor="cake-color" className="block text-xs font-semibold text-cacao-950 mb-1">
              Color
            </label>
            <input id="cake-color" type="color" value={cake.color} onChange={(event) => setCakeField("color", event.target.value)} className="w-full h-10 rounded-xl bg-crema-campo p-1" />
          </div>
          <div>
            <label htmlFor="cake-message" className="block text-xs font-semibold text-cacao-950 mb-1">
              Mensaje (máximo 80 caracteres)
            </label>
            <input id="cake-message" type="text" maxLength={80} value={cake.message} onChange={(event) => setCakeField("message", event.target.value)} className="w-full rounded-xl bg-crema-campo px-3 py-2.5 text-sm text-cacao-950" />
          </div>
          <fieldset className="sm:col-span-2">
            <legend className="block text-xs font-semibold text-cacao-950 mb-2">Extras</legend>
            <div className="flex flex-wrap gap-4 text-sm text-cacao-900">
              {([
                ["candles", "Velas"],
                ["fruit", "Fruta"],
                ["macarons", "Macarons"],
              ] as const).map(([extra, label]) => (
                <label key={extra} className="flex items-center gap-2">
                  <input type="checkbox" checked={cake.extras.includes(extra)} onChange={() => toggleExtra(extra)} />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
        </form>

        <aside className="lg:sticky lg:top-28 bg-crema-tarjeta rounded-2xl p-5 border border-cacao-400/40 shadow-md space-y-4">
          <h3 className="font-serif text-lg font-bold text-cacao-950 border-b border-cacao-400/30 pb-2">
            Resumen
          </h3>
          <p className="text-xs text-cacao-900">
            {cake.size} · {cake.flavor} · {cake.frosting} · {cake.design}
          </p>
          <div className="flex justify-between items-baseline pt-2 border-t border-cacao-400/30">
            <span className="font-bold text-sm text-cacao-950">Total estimado</span>
            <span className="font-serif text-2xl font-bold text-cacao-950 tabular-nums">
              {formatCRC(total)}
            </span>
          </div>
          <button type="submit" form="custom-cake-form" className="w-full py-3 px-4 rounded-full bg-cacao-900 hover:bg-cacao-800 text-crema-fondo text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm">
            <ShoppingBag className="w-4 h-4" />
            <span>Agregar al carrito</span>
          </button>
        </aside>
      </div>
    </div>
  );
};
