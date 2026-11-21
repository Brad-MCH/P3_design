import { handleApi, parseJson, services, type PagesContext } from '../../_lib/http.ts'

export const onRequestGet = ({ env }: PagesContext): Promise<Response> =>
  handleApi(() => services(env.DB).orders.listOrders())

export const onRequestPost = async ({ request, env }: PagesContext): Promise<Response> => {
  const body = await parseJson(request).catch((error: unknown) => error)
  if (body instanceof Error) return handleApi(async () => { throw body })
  return handleApi(() => services(env.DB).orders.createOrder(body), 201)
}
