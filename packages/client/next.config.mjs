import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync, mkdirSync, rmSync } from 'node:fs'

const __filename = fileURLToPath(import.meta.url)

const __dirname = join(__filename, '../')

const sharedFileDir = join(__dirname, '__shared__')

if (existsSync(sharedFileDir)) {
  rmSync(sharedFileDir, { recursive: true })
}

mkdirSync(sharedFileDir)

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  serverRuntimeConfig: {
    root: __dirname,
    sharedFileDir
  },
}

export default nextConfig
