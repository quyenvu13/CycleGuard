# Changelog

## 1.0.2 — 2026-09-01

### Runtime fixes

- Hardened StudioNet execution-result parsing after a finalized create transaction exposed no normalized `txExecutionResultName` even though the write succeeded on-chain.
- Added raw `leader_receipt.execution_result` handling plus one `getTransaction` fallback.
- Unknown execution evidence is no longer mislabeled as a contract failure or success.
- No contract source, deployment address, semantic rule, or wallet authorization rule changed.

### Production E2E verification

- Vercel desktop runtime: **PASS**.
- Circular Workspace #1: `PAIR_DEADLOCKED` -> `BLOCKED`, attempt count `1`, deadlock blocks `1`.
- Executable Workspace #2: `PAIR_EXECUTABLE` -> `ACTIVE`, attempt count `1`, deadlock blocks `0`.
- Final global counters observed: `2` workspaces, `4` clauses, `2` attempts.
- Independent reviewer-wallet evaluation: **PASS**.
- Wallet switching without refresh: **PASS**.
- Automatic post-finalization state re-read: **PASS**.
- Production console after final switch/inspect smoke: **clean**.
- Local post-fix gates: source parity PASS, static check PASS, **9/9 tests PASS**, production build PASS.

### UI

- Kept the Portal-inspired information architecture but restored the original CycleGuard dark charcoal/lime visual palette.

## 1.0.1 — 2026-09-01

### Changed

- Reworked the frontend into a **GenLayer Portal-inspired** light dashboard while keeping CycleGuard branding and layout distinct.
- Added a desktop navigation sidebar, compact product header, clearer contract-stat cards, and a more readable create/inspect workflow.
- Reorganized transaction-truth, semantic-boundary, deterministic-consequence, and reviewer-path sections into consistent portal-style cards.
- Improved tablet/mobile responsiveness; the sidebar collapses into a compact mobile header.
- No contract, deployment address, GenLayer transaction logic, wallet behavior, or source parity was changed.

### Local gates

- Source parity PASS.
- Static check PASS.
- 7/7 tests PASS.
- Production build PASS.
- Production Vercel E2E remains pending direct runtime verification.

## 1.0.0 — 2026-09-01

### Added

- New project/frontend name: **CycleGuard**.
- Fresh StudioNet deployment binding: `0xFaCB1C2F37C33137C359a5efd66Eb3E21Cf7e123`.
- Accepted `DeadlockPairGuard.py` preserved byte-for-byte with SHA256 source-parity gate.
- MetaMask connect and wallet-switch handling.
- Real `get_config`, `get_workspace`, and `get_attempt` reads.
- `create_workspace` and permissionless `evaluate_pair` writes.
- Automatic wait to `FINALIZED` and explicit GenVM execution-result gate.
- Post-finalization state refresh; no transaction-hash-derived fake state.
- Circular and executable reviewer examples.
- Responsive CycleGuard UI, brand assets, manifest and OG image.
- Local static/source/integration checks and Vercel-ready configuration.
- Dependency-free build pipeline with GenLayerJS pinned to browser ESM version `1.1.8`.

### Runtime status

- Fresh contract deploy: verified `ACCEPTED` / GenVM `SUCCESS` on StudioNet Explorer.
- Production Vercel E2E: pending deployment and direct runtime test.


## 2026-09-01 — StudioNet execution-evidence hardening

- Fixed a runtime case where a FINALIZED StudioNet receipt omitted the normalized `txExecutionResultName` field and the UI incorrectly labeled it as `UNKNOWN` failure.
- Receipt verification now checks the SDK execution field first, then the raw leader receipt (`execution_result`), and performs one `getTransaction` fallback read when normalized evidence is absent.
- A genuinely unavailable execution result is now shown as verification-required rather than success or revert; accepted state may still be re-read without fabricating transaction outcome.
- No contract source, address, wallet role, semantic rule, or deterministic consequence changed.
