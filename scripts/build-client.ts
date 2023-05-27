import dayjs from 'dayjs'
import { execSync } from 'node:child_process'
import PKG from '../apps/client/package.json'

const buildTime = dayjs().format('YYYY-MM-DD_HH.mm.ss')

const version = `${PKG.version}-${buildTime}`

const tag = `0x1461a0.me/client:${version}`

const dockerfilePath = 'apps/client/Dockerfile'

const context = '.'

const command = `docker build -f ${dockerfilePath} -t ${tag} ${context}`

try {
  console.log(`> Building image: ${tag}`)
  execSync(command, { stdio: 'inherit' })
  console.log('Building image succeeded.')
} catch (error) {
  console.error('Building image failed.', '\n', error)
}