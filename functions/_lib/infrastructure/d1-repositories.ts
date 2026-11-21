import type { NotificationRepository, OrderRepository } from '../application/ports.ts'
import type { Order, OrderNotification, OrderStatus } from '../domain/order.ts'

export interface D1Database {
  prepare(query: string): D1PreparedStatement
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<T[]>
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  first<T = Record<string, unknown>>(): Promise<T | null>
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>
  run(): Promise<unknown>
}

interface OrderRow {
  id: string
  customer_name: string
  customer_phone: string
  cake_json: string
  status: OrderStatus
  total: number
  created_at: string
  updated_at: string
}

interface NotificationRow {
  id: string
  order_id: string
  status: OrderStatus
  message: string
  created_at: string
}

export class D1OrderRepository implements OrderRepository {
  constructor(private readonly db: D1Database) {}

  async create(order: Order): Promise<void> {
    await this.db.prepare(
      'INSERT INTO orders (id, customer_name, customer_phone, cake_json, status, total, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    ).bind(
      order.id,
      order.customer.name,
      order.customer.phone,
      JSON.stringify(order.cake),
      order.status,
      order.total,
      order.createdAt,
      order.updatedAt,
    ).run()
  }

  async findById(id: string): Promise<Order | null> {
    const row = await this.db.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first<OrderRow>()
    return row ? mapOrder(row) : null
  }

  async list(): Promise<Order[]> {
    const result = await this.db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all<OrderRow>()
    return result.results.map(mapOrder)
  }

  async updateStatus(id: string, status: OrderStatus, updatedAt: string, notification: OrderNotification): Promise<void> {
    const update = this.db.prepare('UPDATE orders SET status = ?, updated_at = ? WHERE id = ?')
      .bind(status, updatedAt, id)
    const insert = this.db.prepare(
      'INSERT INTO notifications (id, order_id, status, message, created_at) VALUES (?, ?, ?, ?, ?)',
    ).bind(notification.id, notification.orderId, notification.status, notification.message, notification.createdAt)
    await this.db.batch([update, insert])
  }

  async dashboard(): Promise<{ totalOrders: number; totalRevenue: number; ordersByStatus: Record<string, number> }> {
    const [totals, statuses] = await Promise.all([
      this.db.prepare("SELECT COUNT(*) AS total_orders, COALESCE(SUM(CASE WHEN status != 'cancelled' THEN total ELSE 0 END), 0) AS total_revenue FROM orders")
        .first<{ total_orders: number; total_revenue: number }>(),
      this.db.prepare('SELECT status, COUNT(*) AS count FROM orders GROUP BY status').all<{ status: string; count: number }>(),
    ])
    return {
      totalOrders: totals?.total_orders ?? 0,
      totalRevenue: totals?.total_revenue ?? 0,
      ordersByStatus: Object.fromEntries((statuses?.results ?? []).map((row) => [row.status, row.count])),
    }
  }
}

export class D1NotificationRepository implements NotificationRepository {
  constructor(private readonly db: D1Database) {}

  async list(): Promise<OrderNotification[]> {
    const result = await this.db.prepare('SELECT * FROM notifications ORDER BY created_at DESC').all<NotificationRow>()
    return result.results.map((row) => ({
      id: row.id,
      orderId: row.order_id,
      status: row.status,
      message: row.message,
      createdAt: row.created_at,
    }))
  }
}

function mapOrder(row: OrderRow): Order {
  return {
    id: row.id,
    customer: { name: row.customer_name, phone: row.customer_phone },
    cake: JSON.parse(row.cake_json) as Order['cake'],
    total: row.total,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
