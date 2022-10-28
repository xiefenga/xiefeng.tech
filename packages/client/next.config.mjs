import { fileURLToPath } from 'node:url'
import { join, basename, dirname } from 'node:path'
import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs'

import { monitor } from '@0x1461a0.me/sync'
import { addNote, updateNote } from '@0x1461a0.me/shared/api'

// queryBlogList().then(console.log)

monitor(
  process.env.sourceDir, 
  async path => {
    if (path.endsWith('.md')) {
      const title = basename(path, '.md')
      const cleanPath = join(dirname(path), title)
      const content = readFileSync(path, 'utf-8')
      const article = {
        title,
        path: cleanPath,
        content,
        createTime: Date.now(),
        updateTime: Date.now(),
      }
      addNote(article)
    }
  },
  async path => {
    // updateNote()
  }
)

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
    sharedFileDir,
  },
}

export default nextConfig
