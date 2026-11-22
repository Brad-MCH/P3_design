export const ORDER_STATUSES = ['received', 'preparing', 'ready', 'delivered', 'cancelled'] as const
export type OrderStatus = (typeof ORDER_STATUSES)[number]

const transitions: Record<OrderStatus, readonly OrderStatus[]> = {
  received: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
}

export class InvalidOrderTransitionError extends Error {
  constructor(from: OrderStatus, to: OrderStatus) {
    super(`Cannot change order status from ${from} to ${to}`)
    this.name = 'InvalidOrderTransitionError'
  }
}

export class OrderState {
  constructor(readonly value: OrderStatus) {}

  transitionTo(next: OrderStatus): OrderState {
    if (!transitions[this.value].includes(next)) {
      throw new InvalidOrderTransitionError(this.value, next)
    }
    return new OrderState(next)
  }
}

export interface Order {
  id: string
  customer: { name: string; phone: string }
  cake: import('./cake.ts').CakeConfiguration
  total: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
}

export interface OrderNotification {
  id: string
  orderId: string
  status: OrderStatus
  message: string
  createdAt: string
}
