// Datos específicos del Módulo Cliente.

export type ClientView = "home" | "builder" | "promotions" | "about";

export interface CartItem {
  id: string;
  name: string;
  details: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ClientNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}
