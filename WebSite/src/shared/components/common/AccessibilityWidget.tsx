import React, { useState } from "react";
import { Accessibility, X } from "lucide-react";

export const AccessibilityWidget: React.FC<{
  onResetNotify: (msg: string) => void;
}> = ({ onResetNotify }) => {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState("1");
  const [flags, setFlags] = useState({
    darkMode: false,
    highContrast: false,
    spacing: false,
    highlight: false,
    motion: false,
  });

  const changeScale = (val: string) => {
    setScale(val);
    document.documentElement.style.setProperty("--font-scale", val);
  };

  const toggleFlag = (key: keyof typeof flags, className: string) => {
    const active = document.body.classList.toggle(className);
    setFlags((prev) => ({ ...prev, [key]: active }));
  };

  const resetAll = () => {
    changeScale("1");
    document.body.classList.remove(
      "a11y-dark-mode",
      "a11y-high-contrast",
      "a11y-spacing",
      "a11y-highlight",
      "a11y-reduced-motion",
    );
    setFlags({
      darkMode: false,
      highContrast: false,
      spacing: false,
      highlight: false,
      motion: false,
    });
    onResetNotify("Accesibilidad restablecida.");
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 flex items-end gap-2">
      {open && (
        <div className="w-72 sm:w-80 bg-crema-fondo border-2 border-cacao-900 rounded-2xl shadow-2xl p-4 space-y-3 text-cacao-950">
          <div className="flex items-center justify-between border-b border-cacao-400/50 pb-2">
            <h2 className="font-bold text-sm">Accesibilidad (WCAG 2.1 AA)</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1 rounded-full hover:bg-crema-pildora"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {(["1", "1.15", "1.3"] as const).map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => changeScale(val)}
                className={`py-1.5 rounded-full text-xs font-semibold ${
                  scale === val
                    ? "bg-cacao-900 text-white"
                    : "bg-crema-pildora text-cacao-950"
                }`}
              >
                {Math.round(Number(val) * 100)}%
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            {[
              {
                key: "darkMode" as const,
                label: "Modo Oscuro",
                cls: "a11y-dark-mode",
              },
              {
                key: "highContrast" as const,
                label: "Modo Alto Contraste",
                cls: "a11y-high-contrast",
              },
              {
                key: "spacing" as const,
                label: "Espaciado legible",
                cls: "a11y-spacing",
              },
              {
                key: "highlight" as const,
                label: "Resaltar enlaces y botones",
                cls: "a11y-highlight",
              },
              {
                key: "motion" as const,
                label: "Reducir animaciones",
                cls: "a11y-reduced-motion",
              },
            ].map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => toggleFlag(opt.key, opt.cls)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-crema-tarjeta hover:bg-crema-pildora text-xs font-semibold"
              >
                <span>{opt.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] ${
                    flags[opt.key]
                      ? "bg-cacao-900 text-white"
                      : "bg-crema-pildora"
                  }`}
                >
                  {flags[opt.key] ? "On" : "Off"}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={resetAll}
            className="w-full py-2 rounded-full bg-cacao-900 hover:bg-cacao-800 text-white text-xs font-semibold"
          >
            Restablecer
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Opciones de accesibilidad"
        className="w-12 h-12 rounded-full bg-cacao-900 hover:bg-cacao-800 text-crema-fondo flex items-center justify-center shadow-lg border-2 border-crema-fondo transition-transform hover:scale-105"
      >
        <Accessibility className="w-6 h-6" />
      </button>
    </div>
  );
};
