import { execSync } from 'child_process'
import PKG from '../apps/server/package.json'

const command = `docker build -f apps/server/Dockerfile -t 0x1461a0.me/server:${PKG.version} .`

const output = execSync(command, {
  encoding: 'utf-8',
  stdio: 'inherit',
})

console.log(output)
