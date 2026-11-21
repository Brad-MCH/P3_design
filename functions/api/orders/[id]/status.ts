import { handleApi, parseJson, services, type PagesContext } from '../../../_lib/http.ts'

export const onRequestPatch = async ({ request, env, params }: PagesContext): Promise<Response> => {
  const body = await parseJson(request).catch((error: unknown) => error)
  if (body instanceof Error) return handleApi(async () => { throw body })
  const status = typeof body === 'object' && body !== null && !Array.isArray(body)
    ? (body as Record<string, unknown>).status
    : undefined
  return handleApi(() => services(env.DB).orders.changeStatus(params?.id ?? '', status))
}
