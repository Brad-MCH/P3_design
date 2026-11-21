import { CakeBuilder, DomainValidationError, priceCake } from '../domain/cake.ts'
import { InvalidOrderTransitionError, OrderState, type Order, type OrderNotification, type OrderStatus } from '../domain/order.ts'
import type { OrderRepository, OrderStatusObserver } from './ports.ts'

export class OrderNotFoundError extends Error {
  constructor() {
    super('Order not found')
    this.name = 'OrderNotFoundError'
  }
}

export class NotificationPublisher implements OrderStatusObserver {
  onStatusChanged(order: Order, previousStatus: OrderStatus): OrderNotification {
    return {
      id: crypto.randomUUID(),
      orderId: order.id,
      status: order.status,
      message: `El pedido ${order.id} cambió de ${previousStatus} a ${order.status}`,
      createdAt: order.updatedAt,
    }
  }
}

export class OrderService {
  constructor(
    private readonly orders: OrderRepository,
    private readonly observer: OrderStatusObserver,
  ) {}

  async createOrder(input: unknown): Promise<Order> {
    if (!isRecord(input)) throw new DomainValidationError('request body must be an object')
    const customer = input.customer
    if (!isRecord(customer) || typeof customer.name !== 'string' || typeof customer.phone !== 'string') {
      throw new DomainValidationError('customer name and phone are required')
    }
    const name = customer.name.trim()
    const phone = customer.phone.trim()
    if (name.length < 1 || name.length > 100) throw new DomainValidationError('customer name must be 1-100 characters')
    if (phone.length < 7 || phone.length > 25) throw new DomainValidationError('customer phone must be 7-25 characters')
    const cake = buildCake(input.cake)
    const now = new Date().toISOString()
    const order: Order = {
      id: crypto.randomUUID(),
      customer: { name, phone },
      cake,
      total: priceCake(cake).amount,
      status: new OrderState('received').value,
      createdAt: now,
      updatedAt: now,
    }
    await this.orders.create(order)
    return order
  }

  async getOrder(id: string): Promise<Order> {
    const order = await this.orders.findById(id)
    if (!order) throw new OrderNotFoundError()
    return order
  }

  listOrders(): Promise<Order[]> {
    return this.orders.list()
  }

  async changeStatus(id: string, target: unknown): Promise<Order> {
    if (typeof target !== 'string' || !['received', 'preparing', 'ready', 'delivered', 'cancelled'].includes(target)) {
      throw new DomainValidationError('invalid status')
    }
    const order = await this.getOrder(id)
    const previousStatus = order.status
    const nextState = new OrderState(previousStatus).transitionTo(target as OrderStatus)
    const updatedAt = new Date().toISOString()
    const updatedOrder = { ...order, status: nextState.value, updatedAt }
    const notification = this.observer.onStatusChanged(updatedOrder, previousStatus)
    await this.orders.updateStatus(id, nextState.value, updatedAt, notification)
    return updatedOrder
  }
}

function buildCake(input: unknown): ReturnType<CakeBuilder['build']> {
  if (!isRecord(input)) throw new DomainValidationError('cake configuration is required')
  return new CakeBuilder()
    .withSize(input.size)
    .withFlavor(input.flavor)
    .withFrosting(input.frosting)
    .withDesign(input.design)
    .withColor(input.color)
    .withMessage(input.message ?? '')
    .withExtras(input.extras ?? [])
    .build()
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export { DomainValidationError, InvalidOrderTransitionError }
