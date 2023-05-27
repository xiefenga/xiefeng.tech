import 'zx/globals'
import dayjs from 'dayjs'
import PKG from '../apps/server/package.json'

const buildTime = dayjs().format('YYYY-MM-DD@HH:mm:ss')

const version = `${PKG.version}(${buildTime})`

const tag = `0x1461a0.me/server:${version}`

const command = `docker build -f apps/server/Dockerfile -t ${tag} .`

await $`${command}`
