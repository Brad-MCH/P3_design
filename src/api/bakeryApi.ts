import type { Order, OrderStatus } from "../shared/types/bakery";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

// funcion generica de consultas
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `Error HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const bakeryApi = {
  // Verifica la salud del servidor
  checkHealth: () => request<{ status: string }>("/health"),

  // Obtiene todos los pedidos persistidos
  getOrders: () => request<Order[]>("/orders"),

  // Crea un nuevo pedido
  createOrder: (payload: Omit<Order, "id">) =>
    request<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Cambia el estado validando transiciones
  updateOrderStatus: (orderId: string, status: OrderStatus) =>
    request<Order>(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
