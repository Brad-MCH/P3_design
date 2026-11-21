import { useEffect, useState, type FormEvent } from 'react'

type Status = 'received' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
type Extra = 'candles' | 'fruit' | 'macarons'

interface Cake {
  size: string
  flavor: string
  frosting: string
  design: string
  color: string
  message: string
  extras: Extra[]
}

interface Order {
  id: string
  customer: { name: string; phone: string }
  cake: Cake
  total: number
  status: Status
  createdAt: string
}

interface Dashboard {
  totalOrders: number
  totalRevenue: number
  ordersByStatus: Record<string, number>
}

interface Notification {
  id: string
  orderId: string
  status: Status
  message: string
  createdAt: string
}

interface ApiResult<T> {
  data?: T
  error?: { code: string; message: string }
}

const currency = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 })
const allowedNext: Partial<Record<Status, Status>> = {
  received: 'preparing', preparing: 'ready', ready: 'delivered',
}

function App() {
  const [orders, setOrders] = useState<Order[]>([])
  const [dashboard, setDashboard] = useState<Dashboard>()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [cake, setCake] = useState<Cake>({
    size: 'medium', flavor: 'chocolate', frosting: 'buttercream', design: 'floral',
    color: '#E98D9C', message: '', extras: [],
  })
  const [customer, setCustomer] = useState({ name: '', phone: '' })

  async function refresh() {
    try {
      const [ordersResult, dashboardResult, notificationsResult] = await Promise.all([
        get<Order[]>('/api/orders'), get<Dashboard>('/api/dashboard'), get<Notification[]>('/api/notifications'),
      ])
      setOrders(ordersResult)
      setDashboard(dashboardResult)
      setNotifications(notificationsResult)
      setError('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Request failed')
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 0)
    return () => window.clearTimeout(timer)
  }, [])

  async function createOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await perform(async () => {
      const order = await post<Order>('/api/orders', { customer, cake })
      setError(`Created order ${order.id}: ${currency.format(order.total)}`)
      await refresh()
    })
  }

  async function changeStatus(order: Order, status: Status) {
    await perform(async () => {
      await patch<Order>(`/api/orders/${order.id}/status`, { status })
      await refresh()
    })
  }

  async function perform(action: () => Promise<void>) {
    setBusy(true)
    try {
      await action()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Request failed')
    } finally {
      setBusy(false)
    }
  }

  function setCakeField<K extends keyof Cake>(key: K, value: Cake[K]) {
    setCake(current => ({ ...current, [key]: value }))
  }

  function toggleExtra(extra: Extra) {
    setCakeField('extras', cake.extras.includes(extra)
      ? cake.extras.filter(item => item !== extra)
      : [...cake.extras, extra])
  }

  return (
    <main>
      <h1>API test</h1>
      <button type="button" onClick={() => void refresh()} disabled={busy}>Refresh</button>
      {error && <p role="status">{error}</p>}

      <h2>Create order</h2>
      <form onSubmit={createOrder}>
        <p><label>Name <input required minLength={1} maxLength={100} value={customer.name} onChange={event => setCustomer({ ...customer, name: event.target.value })} /></label></p>
        <p><label>Phone <input required minLength={7} maxLength={25} value={customer.phone} onChange={event => setCustomer({ ...customer, phone: event.target.value })} /></label></p>
        <p><label>Size <select value={cake.size} onChange={event => setCakeField('size', event.target.value)}><option value="small">small</option><option value="medium">medium</option><option value="large">large</option></select></label></p>
        <p><label>Flavor <select value={cake.flavor} onChange={event => setCakeField('flavor', event.target.value)}><option value="vanilla">vanilla</option><option value="chocolate">chocolate</option><option value="red_velvet">red_velvet</option><option value="lemon">lemon</option></select></label></p>
        <p><label>Frosting <select value={cake.frosting} onChange={event => setCakeField('frosting', event.target.value)}><option value="buttercream">buttercream</option><option value="cream_cheese">cream_cheese</option><option value="ganache">ganache</option></select></label></p>
        <p><label>Design <select value={cake.design} onChange={event => setCakeField('design', event.target.value)}><option value="classic">classic</option><option value="floral">floral</option><option value="birthday">birthday</option><option value="minimal">minimal</option></select></label></p>
        <p><label>Color <input type="color" value={cake.color} onChange={event => setCakeField('color', event.target.value)} /></label></p>
        <p><label>Message <input maxLength={80} value={cake.message} onChange={event => setCakeField('message', event.target.value)} /></label></p>
        <fieldset><legend>Extras</legend>
          {(['candles', 'fruit', 'macarons'] as Extra[]).map(extra => <label key={extra}><input type="checkbox" checked={cake.extras.includes(extra)} onChange={() => toggleExtra(extra)} />{extra} </label>)}
        </fieldset>
        <p>Estimated total: {currency.format(estimate(cake))} (server price is final)</p>
        <button type="submit" disabled={busy}>Create order</button>
      </form>

      <h2>Dashboard</h2>
      {dashboard ? <pre>{JSON.stringify(dashboard, null, 2)}</pre> : <p>Loading…</p>}

      <h2>Orders ({orders.length})</h2>
      {orders.map(order => <article key={order.id}>
        <p>Acá solamente se muestran esos atributos a modo de ejemplo, pero realmente se tiene toda la información de las órdenes, su cliente, y toda la info del pastel</p>
        <p><code>{order.id}</code> · {order.customer.name} · {order.cake.size}/{order.cake.flavor} · {currency.format(order.total)} · {order.status}</p>
        {allowedNext[order.status] && <button type="button" disabled={busy} onClick={() => void changeStatus(order, allowedNext[order.status]!)}>Set {allowedNext[order.status]}</button>}
        {!['delivered', 'cancelled'].includes(order.status) && <button type="button" disabled={busy} onClick={() => void changeStatus(order, 'cancelled')}>Cancel</button>}
      </article>)}

      <h2>Notifications ({notifications.length})</h2>
      {notifications.map(notification => <p key={notification.id}>{notification.message}</p>)}
    </main>
  )
}

async function get<T>(url: string): Promise<T> {
  return request<T>(url)
}

async function post<T>(url: string, body: unknown): Promise<T> {
  return request<T>(url, { method: 'POST', body: JSON.stringify(body) })
}

async function patch<T>(url: string, body: unknown): Promise<T> {
  return request<T>(url, { method: 'PATCH', body: JSON.stringify(body) })
}

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { 'content-type': 'application/json', ...init.headers },
  })
  const result = await response.json() as ApiResult<T>
  if (!response.ok || result.data === undefined) {
    throw new Error(`${response.status} ${result.error?.code ?? 'ERROR'}: ${result.error?.message ?? 'Request failed'}`)
  }
  return result.data
}

function estimate(cake: Cake): number {
  const price = {
    size: { small: 12000, medium: 18000, large: 26000 },
    flavor: { vanilla: 0, chocolate: 1500, red_velvet: 2500, lemon: 1000 },
    frosting: { buttercream: 0, cream_cheese: 1500, ganache: 2000 },
    design: { classic: 0, floral: 3000, birthday: 2000, minimal: 0 },
    extra: { candles: 1000, fruit: 2500, macarons: 4000 },
  }
  return price.size[cake.size as keyof typeof price.size]
    + price.flavor[cake.flavor as keyof typeof price.flavor]
    + price.frosting[cake.frosting as keyof typeof price.frosting]
    + price.design[cake.design as keyof typeof price.design]
    + cake.extras.reduce((total, extra) => total + price.extra[extra], 0)
}

export default App
