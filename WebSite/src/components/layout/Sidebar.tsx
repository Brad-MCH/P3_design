import React from "react";
import { LogOut, User } from "lucide-react";
import type { NavView } from "../../types/bakery";

interface SidebarProps {
  activeView: NavView;
  onSelectView: (view: NavView) => void;
  urgentCount: number;
  onLogout: () => void;
}

const NAV_ITEMS: { id: NavView; label: string }[] = [
  { id: "pedidos", label: "Pedidos" },
  { id: "catalogo", label: "Catálogo" },
  { id: "estadisticas", label: "Estadísticas" },
  { id: "notificaciones", label: "Notificaciones" },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  urgentCount,
  onLogout,
}) => {
  return (
    <aside
      aria-label="Menú lateral de administración"
      className="w-56 md:w-64 lg:w-72 bg-crema-sidebar border-r border-cacao-400/50 flex flex-col justify-between shrink-0 h-full"
    >
      <div className="overflow-y-auto custom-scrollbar">
        <div className="pt-2 sm:pt-4">
          <div className="border-t-[3px] border-b-[3px] border-cacao-950 py-3 sm:py-5 px-3 sm:px-4 flex flex-col items-center text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-cacao-900 text-crema-fondo flex items-center justify-center mb-2 sm:mb-3 shadow-xs">
              <User className="w-7 h-7 sm:w-9 sm:h-9" />
            </div>
            <p
              contentEditable
              suppressContentEditableWarning
              className="font-bold text-cacao-950 text-sm sm:text-base tracking-tight px-2 py-0.5 rounded hover:bg-crema-pildora/60 focus:bg-white focus:outline-none cursor-text"
            >
              Nombre del usuario
            </p>
          </div>
        </div>

        <nav
          aria-label="Navegación principal"
          className="px-2 sm:px-4 py-4 sm:py-6 flex flex-col gap-2"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => onSelectView(item.id)}
                className={`w-full text-center px-2 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-colors whitespace-nowrap flex justify-center items-center relative ${
                  isActive
                    ? "font-semibold bg-crema-pildoraActiva text-cacao-950"
                    : "font-medium text-cacao-950 hover:bg-crema-pildora/70"
                }`}
              >
                <span>{item.label}</span>
                {item.id === "notificaciones" && urgentCount > 0 && (
                  <span className="absolute right-2 sm:right-4 inline-flex items-center justify-center min-w-[1.35rem] h-5 px-1.5 text-xs font-bold rounded-full bg-carmesi text-white">
                    {urgentCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3 sm:p-5 flex justify-center border-t border-cacao-400/50 shrink-0">
        <button
          type="button"
          onClick={onLogout}
          className="w-full py-2.5 px-3 sm:px-5 rounded-full bg-crema-pildora hover:bg-crema-pildoraActiva text-cacao-950 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </aside>
  );
};
