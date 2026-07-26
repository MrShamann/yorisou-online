# Governed-Document Amendment — Production Data Model Authority (Bounded Private Method-State Pilot Schema Authority)

**Date:** 2026-07-26
**Authority:** Edward (Founder) — `YORISOU_PPR_1_COMPLETION_PHASE_1_AUTHORIZED`
**Change class (Change Management §3 rule 1):** GOVERNED-DOCUMENT
**Executor:** CLAUDE_CODE
**Base main:** `7c37ca1e21e27690027cb3ee04b90e52a264abdc`

## What changes

- `resources/governance/current/annex/PRODUCTION_DATA_MODEL_AUTHORITY.md` **v1.0 → v1.1**: added a new
  section *Bounded Private Method-State Pilot Schema Authority* recognizing the six already-existing
  dormant DCI/YV private-pilot Production tables and defining their domain status, no-reinterpretation
  rules, identity/access, mutation model, pilot boundary, and existing-Production truth. A "Version
  history" section was added in-place. **The core 18-entity long-term data model is unchanged.**
- **Governance Pack v0.4.0 → v0.4.1** in the machine-tracked identity fields only:
  `README.md` title, `RESOURCE_MANIFEST.md` title + Pack line (+ version-history note),
  `lib/server/agent-runtime/governance-checksums.json` (`packageVersion` + `provenance`),
  `lib/server/agent-runtime/governanceResources.ts` (README/SHASUMS metadata literals), and
  `lib/server/agent-runtime/__tests__/governanceActivation.test.ts` (packageVersion assertion + messages).
- `resources/governance/current/SHA256SUMS.txt` and `governance-checksums.json` regenerated
  (only the four changed files' hashes differ: README, RESOURCE_MANIFEST, annex/PDMA, SHA256SUMS.txt).
- No document filenames renamed; no other active governance document content changed. File count
  unchanged: **34 files / 32 README index entries / 33 SHA256SUMS lines**.

## Why it changes

The six DCI/YV private-pilot tables already exist in dormant Production state (historical PPR-1). The
binding Production Data Model Authority defined the 18-entity long-term model but did not describe these
tables, leaving them without explicit bounded schema authority. This amendment closes that gap so the
tables are governed truthfully and can never be silently treated as memory, consent, companion memory,
or public method data — a pre-activation prerequisite. This amendment authorizes **no** activation.

## Evidence

- `docs/yorisou/ppr1/PPR1_COMPLETION_PHASE_1.md` (package evidence).
- `docs/yorisou/ppr1/PPR1_PRIVATE_PRODUCTION_PILOT.md` (§9/§10 historical PPR-1 record).
- PPR-1R read-only audit (session record): 6 tables RLS-enabled, 0 policies, `service_role` SELECT-only,
  0 rows at audit, migration-history reconciliation incomplete.
- Governance integrity gate: `npm run test:agent-runtime` → status ok, 34 files, positive fixture + 24
  tamper-negatives pass, activation (loader 34 / checksums 34 / SHA256SUMS 33 / annexes 4) green.

## Affected documents

- `resources/governance/current/annex/PRODUCTION_DATA_MODEL_AUTHORITY.md` (v1.0 → v1.1)
- `resources/governance/current/README.md` (pack version)
- `resources/governance/current/RESOURCE_MANIFEST.md` (pack version + version history)
- `resources/governance/current/SHA256SUMS.txt` (regenerated)
- `lib/server/agent-runtime/governance-checksums.json` (packageVersion + provenance + 4 hashes)
- `lib/server/agent-runtime/governanceResources.ts` (metadata version literals)
- `lib/server/agent-runtime/__tests__/governanceActivation.test.ts` (packageVersion assertion)
- Archive: `resources/governance/archive/annex-production-data-model-authority/v1.0/` (prior text, byte-for-byte)

## Rollback of the change itself

Revert the PPR-1 Completion Phase 1 amendment commit(s) on `main`. The prior v1.0 annex text is preserved
byte-for-byte at `resources/governance/archive/annex-production-data-model-authority/v1.0/PRODUCTION_DATA_MODEL_AUTHORITY.md`
(sha256 `c0a3abfebcaebe9dbfeca796e3e5670104f40f29b6ee2b2b475e3d78069c0d7c`). Reverting restores pack v0.4.0
and regenerates the prior checksums; no Production schema, data, or flag is involved (this is a
documentation/governance change only).

## Scope guarantees

This amendment does NOT set `YORISOU_PRIVATE_PILOT_FLAGS`, does NOT authorize Production release, does NOT
authorize Founder/Admin acceptance, does NOT create/alter/apply Production schema, and does NOT change any
DCI/YV question, scoring, copy, methodology, or result taxonomy. Founder authority and agent authority are
unchanged (Edward retains sole merge + production-release + rollback authority; Claude Code limited to
Founder-authorized scope; Codex not authorized). Public activation remains closed; the Method Registry
continues to report both methods as non-public.
