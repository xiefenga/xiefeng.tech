import { join } from 'node:path'
import getConfig from 'next/config'
import { readFileSync, writeFileSync, existsSync} from 'node:fs'

const { serverRuntimeConfig } = getConfig()

const { sharedFileDir } = serverRuntimeConfig

type PrimitiveValue = number | string | boolean
// type PrimitiveConstructor = NumberConstructor | StringConstructor | BooleanConstructor

export const initSharedPrimitive = <T extends PrimitiveValue>(key: string, initialValue?: T) => {
  const filePath = join(sharedFileDir, key)
  const get = (): string | null => {
    try{
      const data = readFileSync(filePath, 'utf-8')
      return data === 'null' ? null : data
    } catch (_) {
      return null
    }
  }
  const set = (value: T) => {
    writeFileSync(filePath, JSON.stringify(value), 'utf-8')
  }

  // development && exists file 不写文件，实现开发环境每一个连接都共享数据
  // console.log(key, existsSync(filePath))
  if(
    !(
      // process.env.NODE_ENV === 'development' &&
      existsSync(filePath)
    )
  ) {
    writeFileSync(filePath, JSON.stringify(initialValue ?? null), 'utf-8')
  }


  return {
    get,
    set,
  }
}

export const initShared = <T extends object>(key: string, initialValue?: T) => {
  const filePath = join(sharedFileDir, key)

  const get = () => {
    try{
      return JSON.parse(readFileSync(filePath, 'utf-8'))
    } catch (_) {
      return null
    }
  }
  const set = (value: T) => {
    writeFileSync(filePath, JSON.stringify(value), 'utf-8')
  }

  // development && exists file 不写文件，实现开发环境每一个连接都共享数据

  console.log(key, existsSync(filePath))
  if(
    !(
      // process.env.NODE_ENV === 'development' &&
      existsSync(filePath)
    )
  ) {
    writeFileSync(filePath, JSON.stringify(initialValue ?? null), 'utf-8')
  }


  return {
    get,
    set,
  }
}
