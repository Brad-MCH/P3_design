// Datos específicos del Módulo Cliente.

import type { ApiCakeConfiguration } from "../../../shared/types/bakery";

export type ClientView = "home" | "builder" | "promotions" | "about";

export interface CartItem {
  id: string;
  name: string;
  details: string;
  price: number;
  quantity: number;
  image?: string;
  cake?: ApiCakeConfiguration;
}

export interface ClientNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}
