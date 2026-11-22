import React, { useMemo, useState } from "react";
import { PlusCircle } from "lucide-react";
import type { CatalogData, Order } from "../../../../shared/types/bakery";
import {
  calculateOrderTotal,
  formatCRC,
  formatShortClientName,
} from "../../../../shared/utils/bakeryUtils";

interface CreateOrderTabProps {
  catalog: CatalogData;
  onCreateOrder: (newOrder: Order) => void;
}

export const CreateOrderTab: React.FC<CreateOrderTabProps> = ({
  catalog,
  onCreateOrder,
}) => {
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [delivery, setDelivery] = useState<"Sí" | "No">("Sí");
  const [fechaEntrega, setFechaEntrega] = useState("15/11/2026");
  const [direccion, setDireccion] = useState("");
  const [productoId, setProductoId] = useState(catalog.productos[0]?.id ?? "");
  const [humedad, setHumedad] = useState<Order["humedad"]>(
    catalog.productos[0]?.textura ?? "Húmedo",
  );
  const [tamanoId, setTamanoId] = useState(
    catalog.tamanos[1]?.id ?? catalog.tamanos[0]?.id ?? "",
  );
  const [masaId, setMasaId] = useState(catalog.masas[0]?.id ?? "");
  const [rellenoId, setRellenoId] = useState(catalog.rellenos[0]?.id ?? "");
  const [cubiertaId, setCubiertaId] = useState(catalog.cubiertas[0]?.id ?? "");
  const [tematica, setTematica] = useState("");
  const [adicional, setAdicional] = useState("");

  const { total, breakdown, prod } = useMemo(
    () =>
      calculateOrderTotal(
        { productoId, tamanoId, masaId, rellenoId, cubiertaId },
        catalog,
      ),
    [productoId, tamanoId, masaId, rellenoId, cubiertaId, catalog],
  );

  const handleProductChange = (newProdId: string) => {
    setProductoId(newProdId);
    const selected = catalog.productos.find((p) => p.id === newProdId);
    if (selected) {
      setHumedad(
        selected.tipoBase !== "Pastel"
          ? "No aplica"
          : (selected.textura ?? "Húmedo"),
      );
    }
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nombreCompleto.trim()) return;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      cliente: formatShortClientName(nombreCompleto),
      nombreCompleto: nombreCompleto.trim(),
      telefono: telefono.trim() || "Sin teléfono",
      pedidoResumen: prod?.tipoBase ?? "Pastel",
      fechaEntrega: fechaEntrega.trim() || "Por definir",
      estado: "Sin terminar",
      delivery,
      direccion:
        direccion.trim() ||
        (delivery === "No" ? "Retiro en local" : "Sin dirección"),
      productoId,
      humedad,
      tamanoId,
      masaId,
      rellenoId,
      cubiertaId,
      tematica: tematica.trim() || "Personalizada",
      adicional: adicional.trim(),
    };

    onCreateOrder(newOrder);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Información del cliente y entrega */}
        <div className="bg-crema-fondo rounded-2xl p-4 sm:p-5 border border-cacao-400/30 space-y-4">
          <h3 className="font-bold text-sm sm:text-base text-cacao-950 underline decoration-cacao-950 decoration-2 underline-offset-4">
            Información del cliente y entrega
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-cacao-950 mb-1">
                Nombre completo *
              </label>
              <input
                type="text"
                required
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
                placeholder="Ej. Sofía Vargas Alpízar"
                className="w-full rounded-xl bg-crema-campo border border-cacao-500/40 px-3 py-2 text-sm text-cacao-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cacao-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-cacao-950 mb-1">
                Número telefónico
              </label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="8800-0000"
                className="w-full rounded-xl bg-crema-campo border border-cacao-500/40 px-3 py-2 text-sm text-cacao-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cacao-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-cacao-950 mb-1">
                Fecha de entrega (DD/MM/AAAA) *
              </label>
              <input
                type="text"
                required
                value={fechaEntrega}
                onChange={(e) => setFechaEntrega(e.target.value)}
                placeholder="15/11/2026"
                className="w-full rounded-xl bg-crema-campo border border-cacao-500/40 px-3 py-2 text-sm text-cacao-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cacao-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-cacao-950 mb-1">
                Delivery
              </label>
              <select
                value={delivery}
                onChange={(e) => setDelivery(e.target.value as "Sí" | "No")}
                className="w-full rounded-xl bg-crema-campo border border-cacao-500/40 px-3 py-2 text-sm text-cacao-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cacao-900"
              >
                <option value="Sí">Sí</option>
                <option value="No">No (Retiro en local)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-cacao-950 mb-1">
                Dirección
              </label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Provincia, cantón y señas exactas..."
                className="w-full rounded-xl bg-crema-campo border border-cacao-500/40 px-3 py-2 text-sm text-cacao-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cacao-900"
              />
            </div>
          </div>
        </div>

        {/* Detalles del pedido */}
        <div className="bg-crema-fondo rounded-2xl p-4 sm:p-5 border border-cacao-400/30 space-y-3">
          <h3 className="font-bold text-sm sm:text-base text-cacao-950 underline decoration-cacao-950 decoration-2 underline-offset-4">
            Detalles del pedido
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-cacao-950 mb-1">
                Producto solicitado
              </label>
              <select
                value={productoId}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full rounded-xl bg-crema-campo border border-cacao-500/40 px-3 py-2 text-sm text-cacao-950 focus:bg-white"
              >
                {catalog.productos.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({formatCRC(item.price)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-cacao-950 mb-1">
                Textura del pastel
              </label>
              <select
                value={humedad}
                onChange={(e) => setHumedad(e.target.value as Order["humedad"])}
                className="w-full rounded-xl bg-crema-campo border border-cacao-500/40 px-3 py-2 text-sm text-cacao-950 focus:bg-white"
              >
                <option value="Húmedo">Húmedo</option>
                <option value="Semihúmedo">Semihúmedo</option>
                <option value="Seco">Seco</option>
                <option value="No aplica">No aplica</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-cacao-950 mb-1">
                Tamaño
              </label>
              <select
                value={tamanoId}
                onChange={(e) => setTamanoId(e.target.value)}
                className="w-full rounded-xl bg-crema-campo border border-cacao-500/40 px-3 py-2 text-sm text-cacao-950 focus:bg-white"
              >
                {catalog.tamanos.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({formatCRC(item.price)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-cacao-950 mb-1">
                Masa
              </label>
              <select
                value={masaId}
                onChange={(e) => setMasaId(e.target.value)}
                className="w-full rounded-xl bg-crema-campo border border-cacao-500/40 px-3 py-2 text-sm text-cacao-950 focus:bg-white"
              >
                {catalog.masas.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({formatCRC(item.price)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-cacao-950 mb-1">
                Relleno
              </label>
              <select
                value={rellenoId}
                onChange={(e) => setRellenoId(e.target.value)}
                className="w-full rounded-xl bg-crema-campo border border-cacao-500/40 px-3 py-2 text-sm text-cacao-950 focus:bg-white"
              >
                {catalog.rellenos.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({formatCRC(item.price)})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-cacao-950 mb-1">
                Cubierta
              </label>
              <select
                value={cubiertaId}
                onChange={(e) => setCubiertaId(e.target.value)}
                className="w-full rounded-xl bg-crema-campo border border-cacao-500/40 px-3 py-2 text-sm text-cacao-950 focus:bg-white"
              >
                {catalog.cubiertas.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({formatCRC(item.price)})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-cacao-950 mb-1">
                Color o temática
              </label>
              <input
                type="text"
                value={tematica}
                onChange={(e) => setTematica(e.target.value)}
                placeholder="Ej. Tonos pastel con detalles dorados"
                className="w-full rounded-xl bg-crema-campo border border-cacao-500/40 px-3 py-2 text-sm text-cacao-950 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-cacao-950 mb-1">
                Información adicional
              </label>
              <textarea
                rows={2}
                value={adicional}
                onChange={(e) => setAdicional(e.target.value)}
                placeholder="Dedicatorias, alergias o notas de entrega..."
                className="w-full rounded-xl bg-crema-campo border border-cacao-500/40 px-3 py-2 text-sm text-cacao-950 focus:bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Barra inferior de total y botón de creación */}
      <div className="bg-crema-fondo rounded-2xl p-4 sm:p-5 border border-cacao-400/30 border-l-4 border-l-crema-dorado flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-xs sm:text-sm text-cacao-950 underline decoration-cacao-800 underline-offset-4">
            Total estimado del pedido (según catálogo)
          </h4>
          <p className="text-[11px] sm:text-xs text-cacao-800 mt-1">
            {breakdown}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xl sm:text-2xl font-bold text-cacao-950 bg-crema-vainilla/70 px-3.5 py-1.5 rounded-xl tabular-nums">
            {formatCRC(total)}
          </span>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-cacao-900 hover:bg-cacao-800 text-crema-fondo text-xs sm:text-sm font-semibold transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Crear pedido</span>
          </button>
        </div>
      </div>
    </form>
  );
};
