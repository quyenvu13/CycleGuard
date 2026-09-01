import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'

const contract = readFileSync(new URL('../contracts/DeadlockPairGuard.py', import.meta.url), 'utf8')
const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8')
const client = readFileSync(new URL('../src/genlayer.js', import.meta.url), 'utf8')
const expectedAddress = '0xFaCB1C2F37C33137C359a5efd66Eb3E21Cf7e123'
const expectedSha = 'd2b71f9dbf105a5346b61e1885067ec5108864615dc89a05dedac27ef4adb3b9'
const actualSha = createHash('sha256').update(contract).digest('hex')
const failures = []

for (const method of ['create_workspace', 'evaluate_pair', 'get_config', 'get_workspace', 'get_clause', 'get_attempt']) {
  if (!contract.includes(`def ${method}(`)) failures.push(`contract method missing: ${method}`)
}
for (const method of ['create_workspace', 'evaluate_pair', 'get_config', 'get_workspace', 'get_attempt']) {
  if (!client.includes(`'${method}'`)) failures.push(`frontend method coverage missing: ${method}`)
}
if (actualSha !== expectedSha) failures.push(`contract SHA mismatch: ${actualSha}`)
if (!client.includes(expectedAddress)) failures.push('fresh StudioNet contract address missing')
if (!client.includes('genlayer-js@1.1.8')) failures.push('GenLayerJS is not version-pinned')
if (!client.includes('TransactionStatus.FINALIZED')) failures.push('frontend does not wait for FINALIZED')
if (!client.includes('FINISHED_WITH_RETURN') || !client.includes('FINISHED_WITH_ERROR')) failures.push('execution result split missing')
if (!app.includes('accountsChanged') || !app.includes('chainChanged')) failures.push('wallet switching listeners missing')
if (!app.includes('readWorkspace') || !app.includes('refreshConfig')) failures.push('post-transaction state re-read missing')
if (/workspace_count\s*\+\+|attempt_count\s*\+\+|deadlock_blocks\s*\+\+/.test(app)) failures.push('fabricated local counter increment pattern detected')
if (!app.includes('if (state.busy) return')) failures.push('double-send guard missing')

if (failures.length) {
  console.error('STATIC CHECK FAIL')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}
console.log('STATIC CHECK PASS')
console.log(`- source parity: ${actualSha}`)
console.log(`- deployment: ${expectedAddress}`)
console.log('- GenLayerJS pinned: 1.1.8')
console.log('- FINALIZED + GenVM result handling present')
console.log('- wallet switch listeners present')
console.log('- double-send guard present')
console.log('- no fake counter increment pattern detected')
