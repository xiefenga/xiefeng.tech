import gen from './utils/gen.mjs'

const sourceDir = process.env.sourceDir

const { dirs, files } = await gen(sourceDir)

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
