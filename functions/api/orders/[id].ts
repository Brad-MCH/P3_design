import { handleApi, services, type PagesContext } from '../../_lib/http.ts'

export const onRequestGet = ({ env, params }: PagesContext): Promise<Response> =>
  handleApi(() => services(env.DB).orders.getOrder(params?.id ?? ''))
