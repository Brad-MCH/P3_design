import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import type {
  ApiCakeConfiguration,
  ApiCakeExtra,
  CreateApiOrder,
} from "../../../../shared/types/bakery";
import { formatCRC } from "../../../../shared/utils/bakeryUtils";

interface CreateOrderTabProps {
  onCreateOrder: (payload: CreateApiOrder) => Promise<void>;
}

export const CreateOrderTab: React.FC<CreateOrderTabProps> = ({
  onCreateOrder,
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cake, setCake] = useState<ApiCakeConfiguration>({
    size: "medium",
    flavor: "chocolate",
    frosting: "buttercream",
    design: "floral",
    color: "#E98D9C",
    message: "",
    extras: [],
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setCakeField = <K extends keyof ApiCakeConfiguration>(
    field: K,
    value: ApiCakeConfiguration[K],
  ) => setCake((current) => ({ ...current, [field]: value }));

  const toggleExtra = (extra: ApiCakeExtra) =>
    setCakeField(
      "extras",
      cake.extras.includes(extra)
        ? cake.extras.filter((item) => item !== extra)
        : [...cake.extras, extra],
    );

  const total = estimateCake(cake);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await onCreateOrder({ customer: { name, phone }, cake });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo crear el pedido.");
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    "w-full rounded-xl bg-crema-campo border border-cacao-500/40 px-3 py-2 text-sm text-cacao-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cacao-900";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p role="alert" className="text-sm text-carmesi">{error}</p>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-crema-fondo rounded-2xl p-4 sm:p-5 border border-cacao-400/30 space-y-4">
          <h3 className="font-bold text-sm sm:text-base text-cacao-950 underline decoration-cacao-950 decoration-2 underline-offset-4">
            Información del cliente
          </h3>
          <div className="space-y-3">
            <div>
              <label htmlFor="admin-customer-name" className="block text-xs font-semibold text-cacao-950 mb-1">Nombre *</label>
              <input id="admin-customer-name" type="text" required minLength={1} maxLength={100} value={name} onChange={(event) => setName(event.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="admin-customer-phone" className="block text-xs font-semibold text-cacao-950 mb-1">Teléfono *</label>
              <input id="admin-customer-phone" type="tel" required minLength={7} maxLength={25} value={phone} onChange={(event) => setPhone(event.target.value)} className={inputClass} />
            </div>
          </div>
        </div>

        <div className="bg-crema-fondo rounded-2xl p-4 sm:p-5 border border-cacao-400/30 space-y-3">
          <h3 className="font-bold text-sm sm:text-base text-cacao-950 underline decoration-cacao-950 decoration-2 underline-offset-4">
            Configuración del pastel
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cakeFields.map(({ field, label, options }) => (
              <div key={field}>
                <label htmlFor={`admin-cake-${field}`} className="block text-xs font-semibold text-cacao-950 mb-1">{label}</label>
                <select id={`admin-cake-${field}`} value={cake[field] as string} onChange={(event) => setCakeField(field, event.target.value)} className={inputClass}>
                  {options.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
            ))}
            <div>
              <label htmlFor="admin-cake-color" className="block text-xs font-semibold text-cacao-950 mb-1">Color</label>
              <input id="admin-cake-color" type="color" value={cake.color} onChange={(event) => setCakeField("color", event.target.value)} className="w-full h-10 rounded-xl bg-crema-campo p-1" />
            </div>
            <div>
              <label htmlFor="admin-cake-message" className="block text-xs font-semibold text-cacao-950 mb-1">Mensaje</label>
              <input id="admin-cake-message" type="text" maxLength={80} value={cake.message} onChange={(event) => setCakeField("message", event.target.value)} className={inputClass} />
            </div>
            <fieldset className="sm:col-span-2">
              <legend className="block text-xs font-semibold text-cacao-950 mb-2">Extras</legend>
              <div className="flex flex-wrap gap-4 text-sm text-cacao-900">
                {cakeExtras.map(([extra, label]) => (
                  <label key={extra} className="flex items-center gap-2">
                    <input type="checkbox" checked={cake.extras.includes(extra)} onChange={() => toggleExtra(extra)} />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </div>
      </div>

      <div className="bg-crema-fondo rounded-2xl p-4 sm:p-5 border border-cacao-400/30 border-l-4 border-l-crema-dorado flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-xs sm:text-sm text-cacao-950 underline decoration-cacao-800 underline-offset-4">Total estimado</h4>
          <p className="text-[11px] sm:text-xs text-cacao-800 mt-1">El precio final lo determina el servidor.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xl sm:text-2xl font-bold text-cacao-950 bg-crema-vainilla/70 px-3.5 py-1.5 rounded-xl tabular-nums">{formatCRC(total)}</span>
          <button type="submit" disabled={busy} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-cacao-900 hover:bg-cacao-800 disabled:opacity-60 text-crema-fondo text-xs sm:text-sm font-semibold transition-colors shadow-sm">
            <PlusCircle className="w-4 h-4" />
            <span>{busy ? "Creando…" : "Crear pedido"}</span>
          </button>
        </div>
      </div>
    </form>
  );
};

function estimateCake(cake: ApiCakeConfiguration): number {
  const price = {
    size: { small: 12000, medium: 18000, large: 26000 },
    flavor: { vanilla: 0, chocolate: 1500, red_velvet: 2500, lemon: 1000 },
    frosting: { buttercream: 0, cream_cheese: 1500, ganache: 2000 },
    design: { classic: 0, floral: 3000, birthday: 2000, minimal: 0 },
    extra: { candles: 1000, fruit: 2500, macarons: 4000 },
  };
  return price.size[cake.size as keyof typeof price.size]
    + price.flavor[cake.flavor as keyof typeof price.flavor]
    + price.frosting[cake.frosting as keyof typeof price.frosting]
    + price.design[cake.design as keyof typeof price.design]
    + cake.extras.reduce((sum, extra) => sum + price.extra[extra], 0);
}

const cakeFields = [
  { field: "size", label: "Tamaño", options: ["small", "medium", "large"] },
  { field: "flavor", label: "Sabor", options: ["vanilla", "chocolate", "red_velvet", "lemon"] },
  { field: "frosting", label: "Cubierta", options: ["buttercream", "cream_cheese", "ganache"] },
  { field: "design", label: "Diseño", options: ["classic", "floral", "birthday", "minimal"] },
] as const satisfies ReadonlyArray<{
  field: "size" | "flavor" | "frosting" | "design";
  label: string;
  options: readonly string[];
}>;

const cakeExtras: readonly [ApiCakeExtra, string][] = [
  ["candles", "Velas"],
  ["fruit", "Fruta"],
  ["macarons", "Macarons"],
];
