# CycleGuard — Testing

## Evidence model

These gates are deliberately separate:

```text
STATIC CHECK
DEPLOY
TX ACCEPTED
TX FINALIZED
GenVM SUCCESS / ERROR
semantic PASS / FAIL
frontend integration PASS
Vercel runtime PASS
```

`FINALIZED` alone is not treated as semantic or execution success.

## Baseline / deployment

Accepted source SHA256:

```text
d2b71f9dbf105a5346b61e1885067ec5108864615dc89a05dedac27ef4adb3b9
```

Fresh StudioNet contract:

```text
0xFaCB1C2F37C33137C359a5efd66Eb3E21Cf7e123
```

Explorer deployment observation:

```text
Deploy status: ACCEPTED
GenVM result: SUCCESS
Constructor: no args
```

Production frontend:

```text
https://cycle-guard-two.vercel.app/
```

## Local gates

Run:

```bash
npm run verify:source
npm run check
npm test
npm run build
```

Observed locally on 2026-09-01 after the StudioNet receipt-evidence fix:

```text
PASS source parity
PASS frontend method coverage
PASS fresh address binding
PASS GenLayerJS 1.1.8 pin
PASS FINALIZED tracking present
PASS FINISHED_WITH_RETURN / FINISHED_WITH_ERROR split present
PASS raw leader-receipt execution-result fallback
PASS one getTransaction fallback when normalized execution evidence is absent
PASS wallet switching listeners present
PASS double-send guard
PASS no fake counter increment pattern
PASS 9/9 Node tests
PASS production build
PASS local HTTP asset smoke
PASS mobile/responsive static gate
PASS source console scan
```

## Vercel runtime E2E — PASS

Observed directly on the production Vercel deployment on 2026-09-01.

### 1. Circular/deadlock path — PASS

Creator wallet created Workspace #1 with:

Clause A:

```text
Production deployment may begin only after integration approval is issued.
```

Clause B:

```text
Integration approval may be issued only after production deployment has begun and has been observed in production.
```

Observed before semantic evaluation:

```text
workspace #1 = PENDING
workspace owner = creator wallet
attempt_count = 0
deadlock_blocks = 0
```

An independent reviewer wallet then called the permissionless evaluation flow. Observed final state:

```text
semantic verdict = PAIR_DEADLOCKED
workspace #1 = BLOCKED
attempt_count = 1
deadlock_blocks = 1
```

The UI re-read the actual contract state automatically and disabled further evaluation for the finalized workspace.

### 2. Executable/control path — PASS

Creator wallet created Workspace #2 with:

Clause A:

```text
Production deployment may begin after staging tests pass.
```

Clause B:

```text
Integration approval may be issued after production deployment begins and smoke tests pass.
```

The independent reviewer wallet evaluated Workspace #2. Observed final state:

```text
semantic verdict = PAIR_EXECUTABLE
workspace #2 = ACTIVE
attempt_count = 1
deadlock_blocks = 0
```

Observed global counters after both semantic evaluations:

```text
workspaces = 2
clauses = 4
attempts = 2
```

### 3. Wallet switching — PASS

The frontend was switched between the creator wallet and reviewer wallet after page load.

Observed:

```text
connected address updated without page refresh
Workspace #1 and #2 remained readable
reviewer evaluation was recorded under the reviewer wallet
no fabricated state appeared during account switching
```

### 4. Automatic finalized state refresh — PASS

No manual page refresh was required to observe the final semantic consequences. The UI rendered:

```text
Workspace #1 -> BLOCKED / PAIR_DEADLOCKED
Workspace #2 -> ACTIVE / PAIR_EXECUTABLE
```

from post-transaction contract reads.

### 5. StudioNet execution-evidence edge case — FOUND + FIXED + RETESTED

During the first Workspace #1 create transaction, StudioNet finalized the transaction but the receipt presented to the frontend did not expose the normalized `txExecutionResultName`. The old UI therefore displayed `FINALIZED with UNKNOWN` and did not claim success.

A subsequent real state read showed:

```text
workspaces = 1
clauses = 2
attempts = 0
```

which proved the write had actually executed successfully. No second create transaction was sent.

The frontend was then hardened to:

```text
1. check normalized SDK execution-result evidence
2. check raw leader_receipt.execution_result
3. perform one getTransaction fallback when needed
4. show verification-required if evidence is still unavailable
5. never infer success merely from FINALIZED
```

The later Workspace #2 create/evaluate flow completed under the fixed frontend and the final contract counters/state were correct.

### 6. Console / repeat-read smoke — PASS

After the semantic tests, the browser console was cleared, wallets were switched again, and Workspace #1 / #2 were re-inspected without sending new transactions.

Observed:

```text
no production console errors
no retry spam
no manual F5 required for transaction state
no duplicate transaction caused by the UI
```

## Runtime conclusion

```text
STATIC CHECK: PASS
DEPLOY: PASS
TX FINALIZATION TRACKING: PASS
EXECUTION-EVIDENCE HANDLING: PASS after runtime fix
SEMANTIC DEADLOCK PATH: PASS
SEMANTIC EXECUTABLE PATH: PASS
DETERMINISTIC CONSEQUENCES: PASS
WALLET SWITCHING: PASS
FRONTEND INTEGRATION: PASS
VERCEL RUNTIME E2E (desktop): PASS
PRODUCTION CONSOLE: PASS
```

Responsive/mobile behavior is covered by local responsive/static gates; a separate physical/mobile-browser transaction run was not part of this desktop E2E session.
