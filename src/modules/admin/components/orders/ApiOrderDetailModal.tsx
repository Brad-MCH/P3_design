import React from "react";
import { formatCRC } from "../../../../shared/utils/bakeryUtils";
import type { ApiOrder } from "../../../../shared/types/bakery";
import { BaseModal } from "../../../../shared/components/ui/BaseModal";

interface ApiOrderDetailModalProps {
  order: ApiOrder | null;
  onClose: () => void;
}

export const ApiOrderDetailModal: React.FC<ApiOrderDetailModalProps> = ({
  order,
  onClose,
}) => {
  if (!order) return null;

  const details = [
    ["Tamaño", order.cake.size],
    ["Sabor", order.cake.flavor],
    ["Cubierta", order.cake.frosting],
    ["Diseño", order.cake.design],
    ["Color", order.cake.color],
    ["Mensaje", order.cake.message || "Sin mensaje"],
    ["Extras", order.cake.extras.join(", ") || "Ninguno"],
  ];

  return (
    <BaseModal isOpen onClose={onClose} ariaLabelledBy="api-order-title">
      <section className="flex-1 p-5 sm:p-7 overflow-y-auto custom-scrollbar space-y-5">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2 id="api-order-title" className="font-serif text-2xl font-bold text-cacao-950">
              Pedido de {order.customer.name}
            </h2>
            <p className="mt-1 text-sm text-cacao-800">{order.id}</p>
          </div>
          <span className="rounded-full bg-crema-vainilla px-3 py-1 text-sm font-semibold text-cacao-950">
            {order.status}
          </span>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <p className="rounded-xl bg-crema-fondo p-3 text-sm text-cacao-950">
            <strong>Teléfono:</strong> {order.customer.phone}
          </p>
          <p className="rounded-xl bg-crema-fondo p-3 text-sm text-cacao-950">
            <strong>Total:</strong> {formatCRC(order.total)}
          </p>
          <p className="rounded-xl bg-crema-fondo p-3 text-sm text-cacao-950 sm:col-span-2">
            <strong>Creado:</strong> {new Date(order.createdAt).toLocaleString("es-CR")}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-base text-cacao-950">Pastel</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {details.map(([label, value]) => (
              <div key={label} className="rounded-xl bg-crema-fondo p-3">
                <dt className="text-xs font-semibold text-cacao-700">{label}</dt>
                <dd className="text-sm text-cacao-950">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </BaseModal>
  );
};
