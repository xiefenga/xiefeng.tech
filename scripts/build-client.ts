import 'zx/globals'
import dayjs from 'dayjs'
import PKG from '../apps/client/package.json'

const buildTime = dayjs().format('YYYY-MM-DD@HH:mm:ss')

const version = `${PKG.version}(${buildTime})`

const tag = `0x1461a0.me/client:${version}`

const command = `docker build -f apps/client/Dockerfile -t ${tag} .`

await $`${command}`
