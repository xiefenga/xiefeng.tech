import { fileURLToPath } from 'node:url'
import { resolve, join } from 'node:path'
import gen from './utils/gen.mjs'

const __filename = fileURLToPath(import.meta.url)

const __dirname = join(__filename, '../')

const sourceDir = process.env.NODE_ENV === 'development'
  ? process.env.sourceDir
  : resolve(__dirname, './NOTES')

const { dirs, files } = process.env.P_NODE_ENV === 'ssr_server'
  ? {}
  : await gen(sourceDir)

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  serverRuntimeConfig: {
    dirs,
    files,
    sourceDir
  },
}

export default nextConfig
