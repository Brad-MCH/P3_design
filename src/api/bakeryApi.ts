import type {
  ApiDashboard,
  CreateApiOrder,
  ApiNotification,
  ApiOrder,
  ApiOrderStatus,
  ApiResult,
} from "../shared/types/bakery";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

// funcion generica de consultas
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json", ...options?.headers },
      ...options,
    });
  } catch {
    throw new Error(
      'No se pudo conectar con la API. Ejecuta "npm run dev:pages" para iniciar las Cloudflare Pages Functions.',
    );
  }

  let result: ApiResult<T>;
  try {
    result = (await response.json()) as ApiResult<T>;
  } catch {
    throw new Error(
      'La API no devolvió JSON. Ejecuta "npm run dev:pages" para usar las Cloudflare Pages Functions.',
    );
  }

  if (!response.ok || result.data === undefined) {
    throw new Error(
      `${response.status} ${result.error?.code ?? "ERROR"}: ${result.error?.message ?? "Request failed"}`,
    );
  }

  return result.data;
}

export const bakeryApi = {
  // Verifica la salud del servidor
  checkHealth: () => request<{ status: string }>("/health"),

  // Obtiene todos los pedidos persistidos
  getOrders: () => request<ApiOrder[]>("/orders"),
  getDashboard: () => request<ApiDashboard>("/dashboard"),
  getNotifications: () => request<ApiNotification[]>("/notifications"),

  // Crea un nuevo pedido
  createOrder: (payload: CreateApiOrder) =>
    request<ApiOrder>("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Cambia el estado validando transiciones
  updateOrderStatus: (orderId: string, status: ApiOrderStatus) =>
    request<ApiOrder>(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
