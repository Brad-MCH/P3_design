import { onRequestPatch as __api_orders__id__status_ts_onRequestPatch } from "C:\\Users\\brad\\Documents\\code\\P3_design\\functions\\api\\orders\\[id]\\status.ts"
import { onRequestGet as __api_orders__id__ts_onRequestGet } from "C:\\Users\\brad\\Documents\\code\\P3_design\\functions\\api\\orders\\[id].ts"
import { onRequestGet as __api_dashboard_ts_onRequestGet } from "C:\\Users\\brad\\Documents\\code\\P3_design\\functions\\api\\dashboard.ts"
import { onRequestGet as __api_notifications_ts_onRequestGet } from "C:\\Users\\brad\\Documents\\code\\P3_design\\functions\\api\\notifications.ts"
import { onRequestGet as __api_orders_index_ts_onRequestGet } from "C:\\Users\\brad\\Documents\\code\\P3_design\\functions\\api\\orders\\index.ts"
import { onRequestPost as __api_orders_index_ts_onRequestPost } from "C:\\Users\\brad\\Documents\\code\\P3_design\\functions\\api\\orders\\index.ts"

export const routes = [
    {
      routePath: "/api/orders/:id/status",
      mountPath: "/api/orders/:id",
      method: "PATCH",
      middlewares: [],
      modules: [__api_orders__id__status_ts_onRequestPatch],
    },
  {
      routePath: "/api/orders/:id",
      mountPath: "/api/orders",
      method: "GET",
      middlewares: [],
      modules: [__api_orders__id__ts_onRequestGet],
    },
  {
      routePath: "/api/dashboard",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_dashboard_ts_onRequestGet],
    },
  {
      routePath: "/api/notifications",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_notifications_ts_onRequestGet],
    },
  {
      routePath: "/api/orders",
      mountPath: "/api/orders",
      method: "GET",
      middlewares: [],
      modules: [__api_orders_index_ts_onRequestGet],
    },
  {
      routePath: "/api/orders",
      mountPath: "/api/orders",
      method: "POST",
      middlewares: [],
      modules: [__api_orders_index_ts_onRequestPost],
    },
  ]