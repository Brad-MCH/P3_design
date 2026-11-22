// Controlador principal del Módulo Cliente.

import React, { useState } from "react";
import { Clock, MapPin, Phone } from "lucide-react";
import type {
  ApiOrder,
  CatalogData,
  CreateApiOrder,
  ProductCatalogItem,
} from "../../shared/types/bakery";
import type { CartItem, ClientNotification, ClientView } from "./types/client";
import { formatCRC } from "../../shared/utils/bakeryUtils";
import { ClientHeader } from "./components/ClientHeader";
import { ClientHome } from "./components/ClientHome";
import { CustomOrderBuilder } from "./components/CustomOrderBuilder";
import { CartDrawer } from "./components/CartDrawer";
import { Toast } from "../../shared/components/common/Toast";
import { AccessibilityWidget } from "../../shared/components/common/AccessibilityWidget";

interface ClientModuleProps {
  catalog: CatalogData;
  orders: ApiOrder[];
  onCreateOrder: (payload: CreateApiOrder) => Promise<ApiOrder>;
  onSwitchToAdmin?: () => void;
}

export const ClientModule: React.FC<ClientModuleProps> = ({
  catalog,
  orders,
  onCreateOrder,
  onSwitchToAdmin,
}) => {
  const [activeView, setActiveView] = useState<ClientView>("home");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const notifications: ClientNotification[] = orders.map((order) => ({
    id: order.id,
    title: "Estado de tu pedido",
    message: `Pedido ${order.id}: ${order.status}.`,
    date: new Date(order.createdAt).toLocaleDateString("es-CR"),
    read: false,
  }));

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => [item, ...prev]);
    showToast(`"${item.name}" agregado al carrito.`);
  };

  const handleQuickAddProduct = (prod: ProductCatalogItem) => {
    const firstChar = prod.characteristics[0];
    handleAddToCart({
      id: `quick-${Date.now()}`,
      name: prod.name,
      details: firstChar
        ? `${firstChar.name} · Configuración estándar`
        : prod.description,
      price: prod.basePrice + (firstChar?.marketPrice ?? 0),
      quantity: 1,
      image: prod.image,
    });
  };

  const handleCheckout = async (customerName: string, phone: string) => {
    const cakeItems = cartItems.filter((item) => item.cake);
    if (cakeItems.length !== 1 || cakeItems.length !== cartItems.length) {
      throw new Error("El checkout solo acepta un pastel personalizado por pedido.");
    }

    const order = await onCreateOrder({
      customer: { name: customerName, phone },
      cake: cakeItems[0].cake!,
    });
    setCartItems([]);
    setCartOpen(false);
    setActiveView("home");
    showToast(`¡Gracias ${customerName}! Pedido confirmado por ${formatCRC(order.total)}.`);
  };

  return (
    <div className="min-h-screen bg-crema-fondo text-cacao-950 flex flex-col">
      <ClientHeader
        activeView={activeView}
        onNavigate={setActiveView}
        cartCount={cartItems.length}
        onOpenCart={() => setCartOpen(true)}
        notifications={notifications}
        onSwitchToAdmin={onSwitchToAdmin}
      />

      <main className="flex-1">
        {activeView === "home" && (
          <ClientHome
            catalog={catalog}
            onStartBuilder={() => setActiveView("builder")}
            onAddQuickToCart={handleQuickAddProduct}
            onGoToPromotions={() => setActiveView("promotions")}
          />
        )}

        {activeView === "builder" && (
          <CustomOrderBuilder onAddBuiltCakeToCart={handleAddToCart} />
        )}

        {activeView === "promotions" && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
            <h2 className="font-serif text-3xl font-bold text-center text-cacao-950">
              Promociones Especiales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalog.promociones.map((promo) => (
                <article
                  key={promo.id}
                  className="card-interactive bg-crema-tarjeta rounded-2xl overflow-hidden border border-cacao-400/35 flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={promo.image}
                      alt={promo.name}
                      className="w-full h-44 object-cover"
                    />
                    <div className="p-4 space-y-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-carmesi text-white text-[11px] font-bold">
                        {promo.discountLabel}
                      </span>
                      <h3 className="font-bold text-base text-cacao-950">
                        {promo.name}
                      </h3>
                      <p className="text-xs text-cacao-800">
                        {promo.description}
                      </p>
                      <p className="font-bold text-lg text-cacao-900 tabular-nums">
                        {formatCRC(promo.price)}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={() =>
                        handleAddToCart({
                          id: `promo-cart-${Date.now()}`,
                          name: promo.name,
                          details: `Promoción válida hasta ${promo.validUntil}`,
                          price: promo.price,
                          quantity: 1,
                          image: promo.image,
                        })
                      }
                      className="w-full py-2.5 rounded-full bg-cacao-900 hover:bg-cacao-800 text-crema-fondo text-xs font-semibold transition-colors"
                    >
                      Agregar promoción al carrito
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeView === "about" && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
            {/* Historia y Logo */}
            <div className="bg-crema-tarjeta rounded-3xl p-6 sm:p-10 border border-cacao-400/35 flex flex-col md:flex-row items-center gap-8 shadow-sm">
              <img
                src="/assets/dulce-lienzo-logo.jpg"
                alt="Logo oficial Dulce Lienzo"
                className="w-48 h-48 sm:w-60 sm:h-60 rounded-3xl object-contain bg-[#f4eee6] border-2 border-cacao-900 shadow-md shrink-0 p-2"
              />
              <div className="space-y-3 text-center md:text-left">
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-cacao-800 bg-crema-pildora/70 px-3 py-1 rounded-full">
                  Nuestra Historia
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cacao-950">
                  Sobre Dulce Lienzo
                </h2>
                <p className="text-sm sm:text-base text-cacao-800 leading-relaxed">
                  En <strong>Dulce Lienzo</strong> creemos que{" "}
                  <em>cada creación es una obra de sabor</em>. Horneamos
                  diariamente con ingredientes frescos y técnicas artesanales
                  para convertir tus celebraciones en recuerdos inolvidables.
                </p>
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-center text-cacao-950">
                Contáctanos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <article className="bg-crema-tarjeta rounded-2xl p-5 border border-cacao-400/35 flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-cacao-900 text-crema-fondo flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-cacao-950">
                    Ubicación
                  </h4>
                  <p className="text-xs text-cacao-800">
                    San Pedro de Montes de Oca, San José, Costa Rica.
                  </p>
                </article>

                <article className="bg-crema-tarjeta rounded-2xl p-5 border border-cacao-400/35 flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-cacao-900 text-crema-fondo flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-cacao-950">
                    WhatsApp y Pedidos
                  </h4>
                  <p className="text-xs text-cacao-800">+506 6195 2828</p>
                </article>

                <article className="bg-crema-tarjeta rounded-2xl p-5 border border-cacao-400/35 flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-cacao-900 text-crema-fondo flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-cacao-950">Horario</h4>
                  <p className="text-xs text-cacao-800">
                    Lunes a Sábado de 8:00 AM a 6:00 PM.
                  </p>
                </article>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-crema-sidebar border-t border-cacao-400/40 py-8 px-4 text-center text-xs text-cacao-800">
        <p className="font-serif font-bold text-base text-cacao-950">
          Dulce Lienzo
        </p>
        <p className="italic mt-0.5">“Cada creación, una obra de sabor.”</p>
        <p className="mt-3 text-[11px] text-cacao-700">
          © 2026 Dulce Lienzo · Panadería y Repostería
        </p>
      </footer>

      <CartDrawer
        isOpen={cartOpen}
        items={cartItems}
        onClose={() => setCartOpen(false)}
        onRemoveItem={(id) =>
          setCartItems((prev) => prev.filter((i) => i.id !== id))
        }
        onCheckout={handleCheckout}
      />

      <Toast message={toastMsg} />
      <AccessibilityWidget onResetNotify={showToast} />
    </div>
  );
};
