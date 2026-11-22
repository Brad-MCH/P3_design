import type { CatalogItem } from "../shared/types/bakery";

export interface BuiltCustomCake {
  productName: string;
  texture: string;
  sizeName: string;
  flavorName: string;
  fillingName: string;
  frostingName: string;
  theme: string;
  deliveryMethod: "Retiro" | "Delivery";
  subtotal: number;
  deliveryFee: number;
  total: number;
  summaryText: string;
  image?: string;
}

export class CakeBuilder {
  private product?: CatalogItem;
  private texture = "Húmedo";
  private size?: CatalogItem;
  private flavor?: CatalogItem;
  private filling?: CatalogItem;
  private frosting?: CatalogItem;
  private theme = "";
  private deliveryMethod: "Retiro" | "Delivery" = "Retiro";

  public setProduct(item?: CatalogItem): this {
    this.product = item;
    return this;
  }

  public setTexture(texture: string): this {
    this.texture = texture;
    return this;
  }

  public setSize(item?: CatalogItem): this {
    this.size = item;
    return this;
  }

  public setFlavor(item?: CatalogItem): this {
    this.flavor = item;
    return this;
  }

  public setFilling(item?: CatalogItem): this {
    this.filling = item;
    return this;
  }

  public setFrosting(item?: CatalogItem): this {
    this.frosting = item;
    return this;
  }

  public setTheme(theme: string): this {
    this.theme = theme.trim();
    return this;
  }

  public setDeliveryMethod(method: "Retiro" | "Delivery"): this {
    this.deliveryMethod = method;
    return this;
  }

  // Valida que existan los campos mínimos obligatorios antes de construir
  public validate(): string[] {
    const errors: string[] = [];
    if (!this.product) errors.push("Debes seleccionar un producto base.");
    if (!this.size) errors.push("Debes seleccionar un tamaño.");
    return errors;
  }

  public build(): BuiltCustomCake {
    const basePrice = this.product?.price ?? 0;
    const sizePrice = this.size?.price ?? 0;
    const flavorPrice = this.flavor?.price ?? 0;
    const fillingPrice = this.filling?.price ?? 0;
    const frostingPrice = this.frosting?.price ?? 0;

    const subtotal =
      basePrice + sizePrice + flavorPrice + fillingPrice + frostingPrice;
    const deliveryFee = this.deliveryMethod === "Delivery" ? 3000 : 0;

    const parts = [
      this.size?.name,
      this.flavor ? `Masa: ${this.flavor.name}` : null,
      this.filling ? `Relleno: ${this.filling.name}` : null,
      this.frosting ? `Cubierta: ${this.frosting.name}` : null,
      this.theme ? `Temática: ${this.theme}` : null,
    ].filter(Boolean);

    return {
      productName: this.product?.name ?? "Creación personalizada",
      texture: this.texture,
      sizeName: this.size?.name ?? "Sin definir",
      flavorName: this.flavor?.name ?? "Estándar",
      fillingName: this.filling?.name ?? "Sin relleno",
      frostingName: this.frosting?.name ?? "Estándar",
      theme: this.theme,
      deliveryMethod: this.deliveryMethod,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      summaryText: parts.join(" · "),
      image: this.product?.image,
    };
  }
}
