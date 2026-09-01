import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

test('Accepted contract source is byte-for-byte parity by SHA256', () => {
  const bytes = readFileSync(new URL('../contracts/DeadlockPairGuard.py', import.meta.url))
  assert.equal(
    createHash('sha256').update(bytes).digest('hex'),
    'd2b71f9dbf105a5346b61e1885067ec5108864615dc89a05dedac27ef4adb3b9',
  )
})
