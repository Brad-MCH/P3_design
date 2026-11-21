import { handleApi, services, type PagesContext } from '../_lib/http.ts'

export const onRequestGet = ({ env }: PagesContext): Promise<Response> =>
  handleApi(() => services(env.DB).orderRepository.dashboard())
