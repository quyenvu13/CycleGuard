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

No fresh semantic test claim is made yet on this address. The prior Accepted contribution runtime evidence remains contract-baseline evidence, not a substitute for testing the new production frontend.

## Local gates

Run:

```bash
npm run verify:source
npm run check
npm test
npm run build
```

Observed locally on 2026-09-01:

```text
PASS source parity
PASS frontend method coverage
PASS fresh address binding
PASS GenLayerJS 1.1.8 pin
PASS FINALIZED tracking present
PASS FINISHED_WITH_RETURN / FINISHED_WITH_ERROR split present
PASS wallet switching listeners present
PASS double-send guard
PASS no fake counter increment pattern
PASS 7/7 Node tests
PASS production build
PASS local HTTP asset smoke (/, app.js, styles.css, logo, manifest)
PASS mobile viewport + responsive breakpoint static gate
PASS source console scan
```

These are local/static gates only. They do not replace wallet-signed Vercel runtime testing.

## Required Vercel E2E — pending

### Happy / deadlock path

Clause A:

```text
Production deployment may begin only after integration approval is issued.
```

Clause B:

```text
Integration approval may be issued only after production deployment has begun and has been observed in production.
```

Steps:

```text
Connect reviewer MetaMask
-> Create workspace
-> wait FINALIZED
-> require FINISHED_WITH_RETURN
-> UI re-reads workspace = PENDING
-> Evaluate semantic pair
-> wait FINALIZED
-> require FINISHED_WITH_RETURN
-> UI re-reads actual state
```

Expected:

```text
PAIR_DEADLOCKED
BLOCKED
attempt_count = 1
deadlock_blocks = 1
```

### Control / executable path

Clause A:

```text
Production deployment may begin after staging tests pass.
```

Clause B:

```text
Integration approval may be issued after production deployment begins and smoke tests pass.
```

Expected after evaluation:

```text
PAIR_EXECUTABLE
ACTIVE
attempt_count = 1
deadlock_blocks = 0
```

### Negative path

Try evaluating an already-finalized workspace again.

Expected:

```text
GenVM execution error / revert is displayed truthfully.
No state is fabricated.
No second attempt is claimed.
```

### Wallet switching

Switch MetaMask account after page load.

Expected:

```text
Connected address updates without page refresh.
New writes are signed by the newly selected wallet.
```

### Browser gates

```text
Desktop responsive PASS required
Mobile responsive PASS required
No F5 after transaction required
No double-send required
Production console clean required
```

These Vercel runtime gates remain **PENDING** until observed directly on the deployed production URL.
