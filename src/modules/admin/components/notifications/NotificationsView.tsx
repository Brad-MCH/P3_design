import React from "react";
import { BellRing } from "lucide-react";
import type { ApiNotification } from "../../../../shared/types/bakery";
import { BrandBanner } from "../../../../shared/components/ui/BrandBanner";

interface NotificationsViewProps {
  notifications: ApiNotification[];
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
}) => (
  <section className="flex-1 flex flex-col min-h-0">
    <BrandBanner sectionLabel="Notificaciones" />
    <div className="flex-1 bg-crema-tarjeta rounded-2xl p-4 sm:p-5 overflow-y-auto custom-scrollbar">
      {notifications.length === 0 ? (
        <div className="bg-crema-fondo rounded-2xl p-8 text-center border border-cacao-400/30">
          <p className="font-semibold text-sm text-cacao-950">No hay notificaciones.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {notifications.map((notification) => (
            <li key={notification.id} className="flex items-start gap-3 rounded-2xl border border-cacao-400/30 bg-crema-fondo p-4">
              <BellRing className="mt-0.5 h-5 w-5 shrink-0 text-cacao-900" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-cacao-950">{notification.message}</p>
                <p className="mt-1 text-xs text-cacao-700">
                  Pedido {notification.orderId} · {notification.status} · {new Date(notification.createdAt).toLocaleString("es-CR")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </section>
);
