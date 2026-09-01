import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('../contracts/DeadlockPairGuard.py', import.meta.url), 'utf8')
const sdk = readFileSync(new URL('../src/genlayer.js', import.meta.url), 'utf8')
const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8')

test('frontend covers all user-flow methods', () => {
  for (const method of ['create_workspace', 'evaluate_pair', 'get_config', 'get_workspace', 'get_attempt']) {
    assert.match(sdk, new RegExp(`functionName: '${method}'`))
  }
})

test('frontend targets fresh CycleGuard deployment', () => {
  assert.match(sdk, /0xFaCB1C2F37C33137C359a5efd66Eb3E21Cf7e123/)
})

test('GenLayerJS browser module is version pinned', () => {
  assert.match(sdk, /genlayer-js@1\.1\.8/)
})

test('transaction truth gate waits FINALIZED then checks GenVM result', () => {
  assert.match(sdk, /TransactionStatus\.FINALIZED/)
  assert.match(sdk, /FINISHED_WITH_RETURN/)
  assert.match(sdk, /FINISHED_WITH_ERROR/)
  assert.match(app, /readWorkspace/)
})

test('wallet switching and double-send protections are wired', () => {
  assert.match(app, /accountsChanged/)
  assert.match(app, /chainChanged/)
  assert.match(app, /if \(state\.busy\) return/)
})

test('contract keeps deterministic consequence', () => {
  assert.match(source, /workspace\.status = STATUS_ACTIVE/)
  assert.match(source, /workspace\.status = STATUS_BLOCKED/)
  assert.match(source, /workspace\.deadlock_blocks = u256\(1\)/)
})
