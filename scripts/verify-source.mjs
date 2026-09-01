import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

const path = new URL('../contracts/DeadlockPairGuard.py', import.meta.url)
const bytes = readFileSync(path)
const sha = createHash('sha256').update(bytes).digest('hex')
const expected = 'd2b71f9dbf105a5346b61e1885067ec5108864615dc89a05dedac27ef4adb3b9'

if (sha !== expected) {
  console.error(`SOURCE PARITY FAIL\nexpected ${expected}\nactual   ${sha}`)
  process.exit(1)
}
console.log(`SOURCE PARITY PASS ${sha}`)
