import fs from 'node:fs'
import path from 'node:path'
import camelcase from 'lodash.camelcase'
import uppperfirst from 'lodash.upperfirst'

const ROOT = process.cwd()

const SOURCE_DIR = path.resolve(ROOT, 'src')

const ICONS_DIR = path.resolve(SOURCE_DIR, 'assets/icons')

const ICONS_MAP_FILE = path.resolve(SOURCE_DIR, 'constants/icons.ts')

const scopes = fs
  .readdirSync(ICONS_DIR, { withFileTypes: true })
  .filter((file) => file.isDirectory() && file.name !== 'skill-icons1')

const map = scopes.reduce(
  (memo, scope) => {
    memo[scope.name] = fs
      .readdirSync(path.resolve(ICONS_DIR, scope.name), { withFileTypes: true })
      .filter((file) => file.isFile())
      .map((file) => path.basename(file.name, '.svg'))
    return memo
  },
  {} as Record<string, string[]>,
)

const fileContent = `
// This file is generated by scripts/icons.ts
// Do not edit this file manually

import { SVGComponent } from '@/types'

${Object.entries(map)
  .map(([scope, files]) => {
    return files
      .map((file) => {
        const id = uppperfirst(camelcase(`${scope}-${file}`))
        return `import ${id} from '@/assets/icons/${scope}/${file}.svg'`
      })
      .join('\n')
  })
  .join('\n')}

export const LOCAL_ICONS: Record<string, SVGComponent> = {
${Object.entries(map)
  .map(([scope, files]) => {
    return files
      .map((file) => {
        const id = uppperfirst(camelcase(`${scope}-${file}`))
        return `  '${scope}:${file}': ${id},`
      })
      .join('\n')
  })
  .join('\n')}
}
`.trimStart()

fs.writeFileSync(ICONS_MAP_FILE, fileContent, 'utf-8')

console.log('Icons Generated Successfully!', '🎉🎉🎉')
console.log(ICONS_MAP_FILE, '🔎')