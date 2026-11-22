// Encabezado principal del Módulo Cliente.

import React, { useState } from "react";
import { Bell, CakeSlice, ShoppingBag, Truck, User } from "lucide-react";
import type { ClientNotification, ClientView } from "../types/client";

interface ClientHeaderProps {
  activeView: ClientView;
  onNavigate: (view: ClientView) => void;
  cartCount: number;
  onOpenCart: () => void;
  notifications: ClientNotification[];
  onSwitchToAdmin?: () => void;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({
  activeView,
  onNavigate,
  cartCount,
  onOpenCart,
  notifications,
  onSwitchToAdmin,
}) => {
  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Navegación
  const navLinks: { id: ClientView; label: string }[] = [
    { id: "home", label: "Inicio" },
    { id: "builder", label: "Armar Pastel" },
    { id: "promotions", label: "Promociones" },
    { id: "about", label: "Conócenos" },
  ];

  return (
    <header className="sticky top-0 z-40 shadow-xs">
      {/* Barra superior de anuncios */}
      <div className="bg-cacao-950 text-crema-fondo text-[11px] sm:text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-crema-dorado" />
            Envío gratis en pedidos mayores a ₡25,000
          </span>
          <span className="hidden md:flex items-center gap-1.5 font-medium">
            <CakeSlice className="w-3.5 h-3.5 text-crema-dorado -scale-x-100" />
            10% OFF en tu primer pedido personalizado · Código: LIENZO10
          </span>
          <span className="hidden sm:inline text-cacao-300">
            Horneado fresco todos los días
          </span>
        </div>
      </div>

      {/* Navbar principal */}
      <div className="bg-crema-fondo/95 backdrop-blur-md border-b border-cacao-400/35">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          {/* Botón Volver */}
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="flex items-center gap-3 text-left group focus:outline-none"
            aria-label="Volver al inicio de Dulce Lienzo"
          >
            <img
              src="/assets/dulce-lienzo-logo.jpg"
              alt="Logo Dulce Lienzo"
              className="w-14 h-14 rounded-full object-cover border-2 border-cacao-900 shadow-xs group-hover:scale-105 transition-transform"
            />
            <div>
              <span className="block font-serif font-bold text-lg sm:text-xl text-cacao-950 leading-none">
                Dulce Lienzo
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-cacao-700 mt-0.5">
                Panadería y Repostería
              </span>
            </div>
          </button>

          {/* Enlaces centrales */}
          <nav
            aria-label="Navegación de tienda"
            className="hidden lg:flex items-center gap-6"
          >
            {navLinks.map((link) => {
              const active = activeView === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => onNavigate(link.id)}
                  className={`text-xs uppercase tracking-wider font-semibold transition-colors pb-1 border-b-2 ${
                    active
                      ? "text-cacao-950 border-cacao-900"
                      : "text-cacao-700 border-transparent hover:text-cacao-950"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Acciones: Notificaciones, Perfil y Carrito */}
          <div className="flex items-center gap-2 sm:gap-3 relative">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifPopover((prev) => !prev)}
                aria-label="Notificaciones"
                className="p-2 rounded-full hover:bg-crema-pildora text-cacao-950 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-carmesi text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifPopover && (
                <div className="absolute right-0 mt-2 w-72 bg-crema-fondo border border-cacao-400/50 rounded-2xl shadow-xl p-3 z-50 space-y-2">
                  <p className="text-xs font-bold text-cacao-950 border-b border-cacao-400/30 pb-1.5">
                    Notificaciones recientes
                  </p>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="bg-crema-tarjeta rounded-xl p-2.5 text-xs"
                    >
                      <p className="font-bold text-cacao-950">{n.title}</p>
                      <p className="text-cacao-800 mt-0.5">{n.message}</p>
                      <span className="text-[10px] text-cacao-600">
                        {n.date}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onSwitchToAdmin}
              title="Perfil / Panel Administrativo"
              className="p-2 rounded-full hover:bg-crema-pildora text-cacao-950 transition-colors"
            >
              <User className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={onOpenCart}
              aria-label="Abrir carrito"
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-cacao-900 hover:bg-cacao-800 text-crema-fondo text-xs font-semibold transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="tabular-nums">{cartCount}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
