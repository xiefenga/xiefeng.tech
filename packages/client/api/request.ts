import { fetch, RequestInfo, RequestInit } from 'undici'

interface Response<T = object> {
  code: number
  data: T
  message: string
}

export default async function request<T = object>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const resp = await fetch(input, init)
  const json = await resp.json() as Response<T>
  return json.data
}