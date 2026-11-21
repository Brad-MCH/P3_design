import { DomainValidationError, InvalidOrderTransitionError, OrderNotFoundError, OrderService, NotificationPublisher } from './application/order-service.ts'
import { D1NotificationRepository, D1OrderRepository, type D1Database } from './infrastructure/d1-repositories.ts'

export interface PagesEnv {
  DB: D1Database
}

export interface PagesContext {
  request: Request
  env: PagesEnv
  params?: Record<string, string>
}

export function services(db: D1Database) {
  const notificationRepository = new D1NotificationRepository(db)
  const orderRepository = new D1OrderRepository(db)
  const observer = new NotificationPublisher()
  return { orders: new OrderService(orderRepository, observer), orderRepository, notificationRepository }
}

export async function parseJson(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    throw new DomainValidationError('request body must contain valid JSON')
  }
}

export async function handleApi<T>(action: () => Promise<T>, status = 200): Promise<Response> {
  try {
    const data = await action()
    return Response.json({ data }, { status })
  } catch (error) {
    if (error instanceof DomainValidationError) return errorResponse(400, 'VALIDATION_ERROR', error.message)
    if (error instanceof OrderNotFoundError) return errorResponse(404, 'NOT_FOUND', error.message)
    if (error instanceof InvalidOrderTransitionError) return errorResponse(409, 'INVALID_TRANSITION', error.message)
    return errorResponse(500, 'INTERNAL_ERROR', 'An unexpected error occurred')
  }
}

function errorResponse(status: number, code: string, message: string): Response {
  return Response.json({ error: { code, message } }, { status })
}
