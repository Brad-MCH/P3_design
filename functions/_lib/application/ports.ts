import type { Order, OrderNotification, OrderStatus } from '../domain/order.ts'

export interface OrderRepository {
  create(order: Order): Promise<void>
  findById(id: string): Promise<Order | null>
  list(): Promise<Order[]>
  updateStatus(id: string, status: OrderStatus, updatedAt: string, notification: OrderNotification): Promise<void>
  dashboard(): Promise<{
    totalOrders: number
    totalRevenue: number
    ordersByStatus: Record<string, number>
  }>
}

export interface NotificationRepository {
  list(): Promise<OrderNotification[]>
}

export interface OrderStatusObserver {
  onStatusChanged(order: Order, previousStatus: OrderStatus): OrderNotification
}
