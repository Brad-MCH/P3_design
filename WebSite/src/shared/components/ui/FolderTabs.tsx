// Componente genérico de pestañas estilo carpeta.
import React from "react";

export interface FolderTabOption<T extends string> {
  id: T;
  label: string;
  icon: React.ReactNode;
  badgeCount?: number;
}

interface FolderTabsProps<T extends string> {
  tabs: FolderTabOption<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  ariaLabel: string;
}

export function FolderTabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  ariaLabel,
}: FolderTabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="flex items-end gap-2 px-2 shrink-0"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2.5 px-4 sm:px-6 py-2.5 rounded-t-2xl text-xs sm:text-sm font-semibold transition-all ${
              isActive
                ? "bg-crema-tarjeta text-cacao-950 shadow-xs"
                : "bg-crema-pildora/65 text-cacao-800 hover:bg-crema-pildora"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                isActive
                  ? "bg-cacao-900 text-crema-fondo"
                  : "bg-crema-campo text-cacao-900"
              }`}
            >
              {tab.icon}
            </span>
            <span>{tab.label}</span>
            {typeof tab.badgeCount === "number" && (
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${
                  isActive
                    ? "bg-cacao-900 text-crema-fondo"
                    : "bg-crema-fondo text-cacao-900"
                }`}
              >
                {tab.badgeCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
