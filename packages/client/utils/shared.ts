import { join } from 'node:path'
import getConfig from 'next/config'
import { readFileSync, writeFileSync } from 'node:fs'

const { serverRuntimeConfig } = getConfig()

const { sharedFileDir } = serverRuntimeConfig

export const initShared = <T extends object>(key: string, initialValue?: T) => {
  const filePath = join(sharedFileDir, key)
  writeFileSync(filePath, JSON.stringify(initialValue ?? null), 'utf-8')
  const get = () => {
    return JSON.parse(readFileSync(filePath, 'utf-8'))
  }
  const set = (value: T) => {
    writeFileSync(filePath, JSON.stringify(value), 'utf-8')
  }
  return {
    get,
    set,
  }
}
