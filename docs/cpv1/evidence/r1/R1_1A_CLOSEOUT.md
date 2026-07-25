# CPV1-R1.1A — Deployment Evidence & Activation-State Final Correction — Closeout (§10)

Narrowly bounded corrective of CPV1-R1.1. Local/Preview only; production untouched. No new package, no
user-facing UI, no external methods, no merge/deploy.

## Repository state
- **Starting HEAD (R1.1A):** `6ef1485` · **R1.1A code/docs HEAD:** `5a44d0f` (this closeout adds one docs
  commit; its own CI verified green at closeout).
- Branch `feat/cpv1-integrated-platform`; working tree clean (only the two untracked audit/export files).
- PR #114 OPEN, **draft**, base `feat/aix-1-ai-native-experience`, title preserved
  *"CPV1-R1 — Contract, Schema and Runtime-Truth Foundation (stacked draft; DO NOT MERGE)"*. Not ready, not merged.
- PR #113 OPEN, unmerged, unchanged (`head 8483333…`).
- Production `main` / `origin/main` UNCHANGED at `70da80a0`.

## Final activation-state derivation (`methodActivationState`)
- `public_active` — ONLY when `methodMaturity.publicRoute === "available"`, which requires **all 10**:
  implementation complete · rights cleared · content authored/licensed · privacy reviewed · tests passing ·
  route `production_main_present` · **deployment `production_verified`** · **Founder `open`** ·
  non-dev-flagged · **the evidence refs present** (an enum value without its ref downgrades to unverified).
- `implemented_route_verified` — implementation + rights cleared + content + privacy + tests + route on
  production main. Does **NOT** require deployment or Founder activation; never returned merely because
  implementation, tests and a route exist.
- `implemented_private` — implemented + rights cleared, no production route. `gated` — otherwise.

## Final deployment-evidence model (§2)
New independent field `deploymentStatus: "unverified" | "preview_verified" | "production_verified"` plus
`deploymentEvidenceRef` and `founderDecisionRef`. Deployment is **never inferred** from a route file, a
branch name, a route on `main`, a local build, a Preview deployment, or a Founder-activation decision. A
`*_verified` deployment is trusted only when `deploymentEvidenceRef` is present; `founderActivation: "open"`
is trusted only when `founderDecisionRef` is present. No constructor sets any of these to a verified/open
value (proved by test §7.8).

## New negative contract tests (§7) — all pass
1. route present + Founder open + deployment unverified → not public. 2. deployment verified + Founder
unverified → not public. 3. deployment verified + Founder closed → not public. 4. route present + rights
blocked → not route-verified. 5. route present + content incomplete → not route-verified. 6. route present
+ privacy not reviewed (and route absent, and tests not passing) → not route-verified. 7. all dimensions +
production deployment + Founder open (with refs) → **public_active** (proves the gate can pass). 8. no
constructor infers Founder activation or deployment evidence; enum-without-ref not trusted.

## Final method-state counts
**0 `public_active`** (`publicMethods()`===0), **9 `implemented_route_verified`**
(`productionRouteVerifiedMethods()`===9 — `deploymentStatus` unverified, `founderActivation` unverified, no
refs), **18 `gated`**. Truth table with the deployment dimension:
[`METHOD_STATE_TRUTH_TABLE_R1.1.md`](./METHOD_STATE_TRUTH_TABLE_R1.1.md).

## §5 terminology
`externalRightsBlocked` → `externalGatedMethod`; `RIGHTS_BLOCKED` summary → `MULTI_DIMENSION_GATED`;
`PROVEN_PUBLIC` → `ROUTE_VERIFIED_METHODS`; header/legend comments corrected (external universe is
multi-dimension unbuilt, not merely rights-blocked). No live-site observation is converted into CPV1
Founder activation.

## §9 verification
- **Contract suite: 66 checks** (58 → 66; +8 R1.1A negative tests). Regression aix4/aix5/sr1/sr2/app1/app2
  + c02/relationship-fatigue/result-reveal all pass. `tsc` 0; focused lint clean; migration validator PASS;
  changed-content gitleaks (`origin/main..HEAD`) clean.
- **Axe: unaffected.** R1.1A changed no `app/**` route markup (`git diff 6ef1485..5a44d0f -- app/` empty);
  the `LOCAL_PRODUCTION_BUILD_AXE_VERIFIED` result still holds; hosted Preview axe remains NOT verified
  (Vercel SSO blocker, unchanged) and is not claimed.
- **Remote CI:** `CPV1-R1 CI` run tied to the final HEAD recorded green (URL in the PR #114 comment).

## Production-boundary + lock
Production unchanged; PR #113 unchanged; PR #114 OPEN/draft/unmerged; no deploy/prod-migration/secrets/
data; Codex excluded; untracked audit/export files untouched. Writer lock released at closeout after
evidence + handoff.

**Status:** `CPV1_R1_1A_ACTIVATION_MODEL_READY_FOR_FOUNDER_REVIEW`
