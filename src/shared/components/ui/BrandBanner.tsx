import React from "react";
import { CakeSlice } from "lucide-react";

interface BrandBannerProps {
  sectionLabel: string;
  action?: React.ReactNode;
}

export const BrandBanner: React.FC<BrandBannerProps> = ({
  sectionLabel,
  action,
}) => {
  return (
    <header className="w-full bg-crema-pildora rounded-2xl py-3.5 px-5 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 border border-cacao-400/35 shadow-xs shrink-0">
      <div className="hidden sm:flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cacao-800">
        <CakeSlice className="w-5 h-5 -scale-x-100 text-cacao-900" />
        <span>{sectionLabel}</span>
      </div>

      <div className="text-center select-none">
        <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-cacao-950 leading-tight">
          Dulce Lienzo
        </h1>
        <p className="text-[11px] sm:text-xs italic text-cacao-800 tracking-wide mt-0.5">
          “Cada creación, una obra de sabor.”
        </p>
      </div>

      <div className="flex items-center justify-end min-w-[120px]">
        {action}
      </div>
    </header>
  );
};
