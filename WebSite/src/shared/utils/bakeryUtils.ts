import type { CatalogData, Order } from "../types/bakery";

export const CURRENT_REF_DATE = new Date(2026, 10, 13);

export const formatCRC = (val: number): string =>
  "₡" + Number(val || 0).toLocaleString("es-CR");

export function parseDDMMYYYY(str: string): Date | null {
  const parts = (str || "").split("/");
  if (parts.length !== 3) return null;
  return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
}

export function getDaysUntilDelivery(dateStr: string): number {
  const d = parseDDMMYYYY(dateStr);
  if (!d) return 999;
  return Math.round(
    (d.getTime() - CURRENT_REF_DATE.getTime()) / (1000 * 60 * 60 * 24),
  );
}

export function formatShortClientName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length >= 3)
    return `${parts[0]} ${parts[1][0].toUpperCase()}.${parts[2][0].toUpperCase()}`;
  if (parts.length === 2) return `${parts[0]} ${parts[1][0].toUpperCase()}.`;
  return fullName.trim() || "Cliente";
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

export function calculateOrderTotal(
  orderObj: Pick<
    Order,
    "productoId" | "tamanoId" | "masaId" | "rellenoId" | "cubiertaId"
  >,
  catalog: CatalogData,
) {
  const prod = catalog.productos.find((i) => i.id === orderObj.productoId);
  const tam = catalog.tamanos.find((i) => i.id === orderObj.tamanoId);
  const masa = catalog.masas.find((i) => i.id === orderObj.masaId);
  const rel = catalog.rellenos.find((i) => i.id === orderObj.rellenoId);
  const cub = catalog.cubiertas.find((i) => i.id === orderObj.cubiertaId);

  const pPrice = prod?.price ?? 0;
  const tPrice = tam?.price ?? 0;
  const mPrice = masa?.price ?? 0;
  const rPrice = rel?.price ?? 0;
  const cPrice = cub?.price ?? 0;

  const total = pPrice + tPrice + mPrice + rPrice + cPrice;
  const breakdown = `Producto (${formatCRC(pPrice)}) + Tamaño (${formatCRC(tPrice)}) + Masa (${formatCRC(mPrice)}) + Relleno (${formatCRC(rPrice)}) + Cubierta (${formatCRC(cPrice)})`;

  return { total, breakdown, prod, tam, masa, rel, cub };
}
