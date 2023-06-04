import { join } from 'node:path'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)

const __dirname = join(__filename, '../')

const rootDir = resolve(__dirname, './')

const sourceDir = resolve(__dirname, './src')

const navRoutes = [
  { text: 'blogs', link: '/blogs' },
  { text: 'notes', link: '/notes' },
  // 备忘录
  { text: 'memo', link: '/memo' },
  { text: 'thinks', link: '/thinks' },
  { text: 'tools', link: '/tools' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  serverRuntimeConfig: {
    rootDir,
    sourceDir,
  },
  publicRuntimeConfig: {
    navRoutes,
    oldVersion: 'http://old.xiefeng.tech',
    beian: '苏ICP备2020051656号',
    nextjs: 'https://nextjs.org',
    github: 'https://github.com/xiefenga',
  },
}

export default nextConfig
