import React, { useState } from "react";
import { CakeSlice, Gift, PlusCircle } from "lucide-react";
import type {
  CatalogData,
  ProductCatalogItem,
  PromotionItem,
} from "../../../../shared/types/bakery";
import { BrandBanner } from "../../../../shared/components/ui/BrandBanner";
import { FolderTabs } from "../../../../shared/components/ui/FolderTabs";
import { ProductCard } from "./ProductCard";
import { ProductModal } from "./ProductModal";
import { PromotionCard } from "./PromotionCard";
import { PromotionModal } from "./PromotionModal";

interface CatalogViewProps {
  catalog: CatalogData;
  onSaveProduct: (product: ProductCatalogItem, isEdit: boolean) => void;
  onDeleteProduct: (product: ProductCatalogItem) => void;
  onSavePromotion: (promotion: PromotionItem, isEdit: boolean) => void;
  onDeletePromotion: (promotion: PromotionItem) => void;
}

type CatalogTab = "products" | "promotions";

export const CatalogView: React.FC<CatalogViewProps> = ({
  catalog,
  onSaveProduct,
  onDeleteProduct,
  onSavePromotion,
  onDeletePromotion,
}) => {
  const [activeTab, setActiveTab] = useState<CatalogTab>("products");
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<ProductCatalogItem | null>(null);
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromotionItem | null>(null);

  const handleOpenAdd = () => {
    if (activeTab === "products") {
      setEditingProduct(null);
      setProductModalOpen(true);
    } else {
      setEditingPromo(null);
      setPromoModalOpen(true);
    }
  };

  return (
    <section className="flex-1 flex flex-col min-h-0">
      <BrandBanner
        sectionLabel="Catálogo"
        action={
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-cacao-900 hover:bg-cacao-800 text-crema-fondo text-xs font-semibold transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>
              {activeTab === "products"
                ? "Agregar producto"
                : "Agregar promoción"}
            </span>
          </button>
        }
      />

      <FolderTabs<CatalogTab>
        ariaLabel="Secciones del catálogo"
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          {
            id: "products",
            label: "Productos",
            icon: <CakeSlice className="w-3.5 h-3.5" />,
            badgeCount: catalog.productCatalog.length,
          },
          {
            id: "promotions",
            label: "Promociones",
            icon: <Gift className="w-3.5 h-3.5" />,
            badgeCount: catalog.promociones.length,
          },
        ]}
      />

      <div className="flex-1 bg-crema-tarjeta rounded-2xl rounded-tl-none p-4 sm:p-5 overflow-y-auto custom-scrollbar">
        {activeTab === "products" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {catalog.productCatalog.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={(p) => {
                  setEditingProduct(p);
                  setProductModalOpen(true);
                }}
                onDelete={onDeleteProduct}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {catalog.promociones.map((promo) => (
              <PromotionCard
                key={promo.id}
                promotion={promo}
                onEdit={(p) => {
                  setEditingPromo(p);
                  setPromoModalOpen(true);
                }}
                onDelete={onDeletePromotion}
              />
            ))}
          </div>
        )}
      </div>

      <ProductModal
        isOpen={productModalOpen}
        editingProduct={editingProduct}
        onClose={() => setProductModalOpen(false)}
        onSave={onSaveProduct}
      />

      <PromotionModal
        isOpen={promoModalOpen}
        editingPromotion={editingPromo}
        onClose={() => setPromoModalOpen(false)}
        onSave={onSavePromotion}
      />
    </section>
  );
};
