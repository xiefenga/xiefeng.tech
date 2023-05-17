import { execSync } from 'child_process'
import PKG from '../apps/client/package.json'

const command = `docker build -f apps/client/Dockerfile -t 0x1461a0.me/client:${PKG.version} .`

const output = execSync(command, {
  encoding: 'utf-8',
  stdio: 'inherit',
})

console.log(output)
