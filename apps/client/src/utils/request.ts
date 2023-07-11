import to from 'await-to-js'
import { join } from 'node:path'

const BASE_URL = process.env.SERVER_HOST ?? ''

export const request = async <T>(target: string, init?: RequestInit) => {

  const url = join(BASE_URL, target)

  const resp = await fetch(url, init)

  const json = await resp.json()
  
  if (resp.status >= 400 || json.errors) {
    throw new Error(json.message)
  } 
  return json.data as T | null
}

export const toRequest = <T>(target: string, init?: RequestInit) => to(request<T>(target, init))