// Pantalla de inicio.

import React, { useEffect, useState } from "react";
import {
  Award,
  CakeSlice,
  Clock,
  Heart,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import type {
  CatalogData,
  ProductCatalogItem,
} from "../../../shared/types/bakery";
import { formatCRC } from "../../../shared/utils/bakeryUtils";

interface ClientHomeProps {
  catalog: CatalogData;
  onStartBuilder: (presetProductId?: string) => void;
  onAddQuickToCart: (product: ProductCatalogItem) => void;
  onGoToPromotions: () => void;
}

// Datos de las diapositivas que se alternan automáticamente
const HERO_SLIDES = [
  {
    id: "cake",
    badge: "Cada creación, una obra de sabor",
    titleLine1: "Hecho con Arte,",
    titleLine2: "Horneado para Ti.",
    description:
      "Desde pasteles artesanales personalizados hasta cheesecakes y cupcakes gourmet. Diseña tu postre ideal eligiendo cada sabor, relleno y cubierta.",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Pastel artesanal Dulce Lienzo",
    isLogo: false,
    sealText: "Horneado Fresco Diario",
  },
  {
    id: "brand",
    badge: "Panadería y Repostería Artesanal",
    titleLine1: "Dulce Lienzo,",
    titleLine2: "Tu Historia en Postre.",
    description:
      "Combinamos técnica pastelera y creatividad artística para transformar tus celebraciones en piezas únicas, elaboradas con los mejores ingredientes.",
    image: "/assets/dulce-lienzo-logo.jpg",
    imageAlt: "Logo oficial de Dulce Lienzo",
    isLogo: true,
    sealText: "Hecho a Mano con Amor",
  },
] as const;

const TRUST_ITEMS = [
  {
    icon: CakeSlice,
    title: "Ingredientes Premium",
    sub: "La mejor calidad",
    flip: true,
  },
  {
    icon: Clock,
    title: "Horneado Diario",
    sub: "Fresco sobre pedido",
    flip: false,
  },
  { icon: Truck, title: "Entrega Puntual", sub: "En toda la GAM", flip: false },
  {
    icon: ShieldCheck,
    title: "Pago Seguro",
    sub: "SINPE y tarjeta",
    flip: false,
  },
  { icon: Heart, title: "4.9 ★ Clientes", sub: "+1,200 reseñas", flip: false },
];

export const ClientHome: React.FC<ClientHomeProps> = ({
  catalog,
  onStartBuilder,
  onAddQuickToCart,
  onGoToPromotions,
}) => {
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Alterna cada 6.5 segundos y se pausa si el usuario pasa el cursor encima
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div className="space-y-12 pb-12">
      {/* Informacion alternante */}
      <section
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="bg-crema-tarjeta border-b border-cacao-400/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Columna de texto */}
          <div className="lg:col-span-6 space-y-5">
            <div className="grid">
              {HERO_SLIDES.map((slide, idx) => {
                const isActive = activeSlideIdx === idx;
                return (
                  <div
                    key={slide.id}
                    aria-hidden={!isActive}
                    className={`col-start-1 row-start-1 space-y-5 transition-all duration-1000 ease-in-out ${
                      isActive
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 translate-y-3 pointer-events-none"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-cacao-800 bg-crema-pildora/70 px-3 py-1 rounded-full">
                      <CakeSlice className="w-3.5 h-3.5 -scale-x-100" />
                      {slide.badge}
                    </span>

                    <h1 className="font-serif text-4xl sm:text-5xl font-bold text-cacao-950 leading-tight">
                      {slide.titleLine1} <br />
                      {slide.titleLine2}
                    </h1>

                    <p className="text-sm sm:text-base text-cacao-800 max-w-lg leading-relaxed">
                      {slide.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => onStartBuilder()}
                className="px-6 py-3 rounded-full bg-cacao-900 hover:bg-cacao-800 text-crema-fondo text-xs sm:text-sm font-semibold shadow-md transition-colors"
              >
                Construir mi pastel
              </button>
              <button
                type="button"
                onClick={onGoToPromotions}
                className="px-6 py-3 rounded-full bg-crema-fondo hover:bg-crema-pildora text-cacao-950 border border-cacao-500/50 text-xs sm:text-sm font-semibold transition-colors"
              >
                Ver promociones
              </button>
            </div>

            {/* Indicadores del carrusel */}
            <div
              className="flex items-center gap-2 pt-2"
              role="tablist"
              aria-label="Diapositivas destacadas"
            >
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={activeSlideIdx === idx}
                  aria-label={`Ver ${
                    slide.id === "cake"
                      ? "pastel destacado"
                      : "identidad Dulce Lienzo"
                  }`}
                  onClick={() => setActiveSlideIdx(idx)}
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    activeSlideIdx === idx
                      ? "w-8 bg-cacao-900"
                      : "w-2.5 bg-cacao-400/60 hover:bg-cacao-600"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Columna de imagen */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-cacao-400/40 aspect-[4/3] bg-[#f4eee6]">
              {HERO_SLIDES.map((slide, idx) => {
                const isActive = activeSlideIdx === idx;
                return (
                  <img
                    key={slide.id}
                    src={slide.image}
                    alt={slide.imageAlt}
                    className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-in-out ${
                      isActive
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-105 pointer-events-none"
                    }`}
                  />
                );
              })}
            </div>

            {/* Insignia circular */}
            <div className="hidden sm:flex flex-col items-center justify-center w-24 h-24 rounded-full bg-crema-fondo border-2 border-cacao-900 shadow-lg absolute -bottom-4 -left-4 text-center p-2">
              <Award className="w-5 h-5 text-cacao-900 mb-0.5 shrink-0" />
              <div className="grid w-full">
                {HERO_SLIDES.map((slide, idx) => (
                  <span
                    key={slide.id}
                    className={`col-start-1 row-start-1 text-[10px] font-bold uppercase tracking-tight text-cacao-950 leading-tight transition-opacity duration-700 ${
                      activeSlideIdx === idx ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {slide.sealText}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Componente de beneficios */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 bg-crema-tarjeta rounded-2xl p-4 sm:p-5 border border-cacao-400/30">
          {TRUST_ITEMS.map(({ icon: Icon, title, sub, flip }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-crema-pildora text-cacao-900 flex items-center justify-center shrink-0">
                <Icon className={`w-4 h-4 ${flip ? "-scale-x-100" : ""}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-cacao-950 truncate">
                  {title}
                </p>
                <p className="text-[11px] text-cacao-700 truncate">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorias */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <h2 className="text-center font-serif text-2xl font-bold text-cacao-950">
          Explora por Categoría
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {catalog.productCatalog.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onStartBuilder(item.id)}
              className="flex flex-col items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-crema-pildoraActiva group-hover:border-cacao-900 shadow-sm transition-all">
                <img
                  src={item.image}
                  alt={item.category}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-cacao-950 group-hover:text-cacao-700">
                {item.category}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Mas vendidos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-cacao-950">
            Más Vendidos
          </h2>
          <button
            type="button"
            onClick={() => onStartBuilder()}
            className="text-xs font-bold text-cacao-900 hover:underline underline-offset-4"
          >
            Personalizar el mío
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {catalog.productCatalog.slice(0, 4).map((prod) => (
            <article
              key={prod.id}
              className="card-interactive bg-crema-tarjeta rounded-2xl overflow-hidden border border-cacao-400/30 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="h-44 bg-crema-campo overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 space-y-1.5">
                  <div className="flex items-center gap-1 text-crema-dorado">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                    <span className="text-[10px] text-cacao-700 ml-1">
                      (4.9)
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-cacao-950 truncate">
                    {prod.name}
                  </h3>
                  <p className="text-sm font-bold text-cacao-900 tabular-nums">
                    Desde{" "}
                    {formatCRC(
                      prod.basePrice +
                        (prod.characteristics[0]?.marketPrice ?? 0),
                    )}
                  </p>
                </div>
              </div>
              <div className="px-4 pb-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onStartBuilder(prod.id)}
                  className="py-2 px-2 rounded-full bg-crema-pildora hover:bg-crema-pildoraActiva text-cacao-950 text-[11px] font-semibold"
                >
                  Personalizar
                </button>
                <button
                  type="button"
                  onClick={() => onAddQuickToCart(prod)}
                  className="py-2 px-2 rounded-full bg-cacao-900 hover:bg-cacao-800 text-crema-fondo text-[11px] font-semibold"
                >
                  + Carrito
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Banners*/}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-crema-contenedor rounded-3xl p-6 sm:p-8 border border-cacao-400/40 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-cacao-800">
              Pasteles Personalizados
            </span>
            <h3 className="font-serif text-2xl font-bold text-cacao-950">
              Diseñados para tus Momentos Especiales
            </h3>
            <p className="text-xs sm:text-sm text-cacao-800">
              Elige tamaño, textura, masa, relleno y cubierta!
            </p>
          </div>
          <button
            type="button"
            onClick={() => onStartBuilder()}
            className="self-start px-5 py-2.5 rounded-full bg-cacao-900 hover:bg-cacao-800 text-crema-fondo text-xs font-semibold"
          >
            Armar pedido ahora
          </button>
        </div>

        <div className="bg-cacao-950 text-crema-fondo rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-crema-dorado">
              Promociones Vigentes
            </span>
            <h3 className="font-serif text-2xl font-bold">
              Ofertas Especiales de la Semana
            </h3>
            <p className="text-xs sm:text-sm text-cacao-300">
              Aprovecha combos de celebración, 2x1 en cupcakes y descuentos en
              cheesecakes familiares.
            </p>
          </div>
          <button
            type="button"
            onClick={onGoToPromotions}
            className="self-start px-5 py-2.5 rounded-full bg-crema-vainilla hover:bg-crema-dorado text-cacao-950 text-xs font-bold"
          >
            Explorar promociones
          </button>
        </div>
      </section>
    </div>
  );
};
