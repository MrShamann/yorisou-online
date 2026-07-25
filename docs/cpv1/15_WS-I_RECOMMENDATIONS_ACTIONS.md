# WS-I — Recommendations & Actions

**Program:** YORISOU Complete Platform V1 · **Branch:** `feat/cpv1-integrated-platform`
**Workstream:** I (Recommendations & actions) · **Maturity:** `CONTRACT_CPV1`
**Extends:** APP-2 adaptation + SR-1 service spine (real code; see §Data/contract model).

Brand vision **人を、ひとつの答えに閉じ込めない。** — Brand line **ひとつの見方で、あなたを決めない。**
A recommendation is a *door*, never a verdict. WS-I proposes finite, explainable next
steps; it never ranks the person, never decides for them, and never sells first.

---

## 1. Purpose

Turn source-separated understanding (WS-D), method results (WS-C), reflection cadence
and longitudinal history (WS-F) into a **finite, explainable, user-controllable** set of
recommendations and actions — every one traceable to an authorized signal and a stated
reason. WS-I is the connective tissue between "what we understood" and "what may help
now / next", reusing the governed service catalogue so no valid state produces a
dead-end and nothing is surfaced without a reason the user can read and override.

Non-goals (explicit): no infinite feed, no opaque relevance score, no engagement
optimization, no person-ranking, no automated life decisions, no commercial placement
that outranks fit, no fabricated inventory or fake "others chose" social proof.

## 2. Maturity

`CONTRACT_CPV1` — a real typed contract + priority model + governance, layered on top of
already-shipped surfaces. It is **not** a new public route on its own; it formalizes and
constrains the existing recommendation/adaptation surfaces and defines the CPV1
provenance envelope every recommendation must carry before any broader activation.

| Component | Status |
|---|---|
| APP-2 deterministic adaptation ranking | `LIVE_APP2` (reused, constrained by this spec) |
| SR-1 support plan + service catalogue | `LIVE_APP2` (reused) |
| Recommendation graph + action registry | `LIVE_APP2` (reused as candidate source) |
| WS-I provenance envelope + priority order (§4) | `CONTRACT_CPV1` (this doc) |
| Symbolic/cultural influence boundary (§6) | `CONTRACT_CPV1` (gated by WS-C rights) |
| Commercial-status / availability / price fields | `CONTRACT_CPV1` (no real supplier, no real price) |

No supplier is contacted, no real price is quoted, no purchase executes in this program.

## 3. Where WS-I sits in the loop

`understanding (WS-D) → candidate generation → priority ordering (§4) → provenance
envelope → user action → feedback/outcome (WS-F) → longitudinal learning → (loop)`

Candidates come only from governed, real routes; ordering is deterministic and
explainable; the user's confirm/correct/reject/hide/not-for-me signals feed back and are
never overridden by a later pass.

## 4. Priority order (the load-bearing rule)

Every ranking pass MUST apply these tiers in exactly this order. A lower-number tier can
never be overridden by a higher-number one. **Commercial value is LAST, always.**

1. **Safety & exclusions** — hard filters: risk boundaries, user exclusions, hidden /
   "今は違う" (not-now) items, deleted or rejected observations. Removes candidates.
2. **Explicit intention & constraints** — what the user actually asked for / declared,
   and their stated limits (time, place, capacity, "no romance suggestions", etc.).
3. **Current context** — current-state answers, reflection cadence, present situation.
4. **Confirmed patterns** — recurring, user-confirmed themes across methods (WS-D
   `synthesizeThemes` with `userConfirmed`), never a single averaged score.
5. **Prior outcomes** — what was tried, marked helpful / not-helpful, completed (WS-F).
6. **Quality & provenance** — evidence class, source clarity, method maturity, freshness.
7. **Availability & practicality** — is the route real, reachable, and in-scope now.
8. **Diversity** — avoid one-note lists; keep multiple angles ("ひとつの見方で決めない").
9. **Commercial value — LAST.** A paid/commercial option may only tie-break *within* an
   already-earned slot; it can never lift a candidate above tiers 1–8. Placement is
   never for sale (mirrors APP-2 `lib/app2/adaptation.ts`: "placement can never be
   bought").

Determinism requirement: same inputs → same ordering. No `Math.random`, no wall-clock
inside ranking (recency passed in as `nowMs`), no network, no model call in the ordering
function — consistent with `lib/app2/adaptation.ts` (§6.2 there).

## 5. Data / contract model (references real code)

### 5.1 The recommendation provenance envelope (`CONTRACT_CPV1`)

Every recommendation object preserves the full envelope below. No field may be dropped
on the way to a surface; a missing field means the recommendation is not shown.

| Field | Meaning | Backed by (real) |
|---|---|---|
| `objectType` | test / report / action / content / companion-theme / community-hint / local-life | `RecommendationActionType`, `RecommendationProductLayer` (`app/data/yorisouRecommendationActions.ts`, `yorisouRecommendationGraph.ts`) |
| `sourceClass` | which understanding source drove it | `SourceClass` (`lib/cpv1/understanding.ts`) |
| `provenance` | signal source + method id/version | `RecommendationSignalSource`, `Observation.methodId/methodVersion` |
| `reasonCode` | stable machine reason | `AdaptationReasonCode` (`lib/app2/adaptation.ts`) |
| `nlReason` | human "why now" sentence (JP copy) | `AdaptedItem.primaryReason`, `SupportPlanItem` reason |
| `evidence` + `limits` | evidence class + interpretation limits | `EvidenceClass`, `MethodRegistryEntry.interpretationLimits` |
| `commercialStatus` | free / paid / partner / none | `CONTRACT_CPV1` — no real price/supplier this program |
| `availability` | reachable now / waitlist / not-in-region | `ServiceItemStatus` (`app/data/sr1/serviceCatalogue.ts`) |
| `locationScope` | where it applies (region / online / n/a) | `RecommendationRiskBoundary: sensitive_local_life` gate |
| `priceRange` | display band only, never entered/charged | `CONTRACT_CPV1` — display placeholder only |
| `priorFeedback` | user's earlier helpful / not-for-me / hidden | WS-F `marked_helpful`/`marked_not_helpful`/`not_for_me`/`hidden` |
| `outcome` | tried / completed / no-action | WS-F `action_saved`/`action_tried`/`action_completed`/`recommendation_outcome` |

### 5.2 Authorized signals only (the input gate)

A candidate may be generated only from signals the user permitted for recommendation
use. This is enforced by real contracts, not by convention:

- `canUseDownstream(observation, "recommendation")` — `lib/cpv1/understanding.ts`. An
  observation reaches WS-I only when it is not deleted, not `rejected`, its `PrivacyScope`
  is `recommendation_permitted` or `public_safe`, and `permittedDownstream` includes
  `"recommendation"`.
- `MethodConsent.recommendationUse === true` (opt-in) — `lib/cpv1/consent.ts`. Default is
  `false`; sensitive/birth-data families default to `session_only` with no downstream use.
- `MethodRegistryEntry.recommendationPermission` — `lib/cpv1/methods.ts` (default
  `opt_in`). A method that is not publicly activatable (`gated`) yields **no**
  recommendation content (there is no `compute`; `blockedAdapter` withholds it).

### 5.3 Candidate sources (all real routes)

- SR-1 `SR1_SERVICE_CATALOGUE` + `getServiceItem` (`app/data/sr1/serviceCatalogue.ts`).
- SR-1 support plan (`lib/sr1/supportPlan.ts`) — deterministic, public-safe, no valid
  family produces an empty plan or a dead-end.
- APP-2 adaptation ranking (`lib/app2/adaptation.ts`) — reason-coded, device-local.
- Recommendation graph rules + action registry (`app/data/yorisouRecommendationGraph.ts`,
  `yorisouRecommendationActions.ts`) — the `no_action_safe_fallback` action guarantees a
  safe empty state.

## 6. Symbolic / cultural method influence boundary

Symbolic and cultural methods (WS-C `chinese_traditional`, `western_symbolic`; e.g. I
Ching, Tarot, astrology, Zi Wei Dou Shu) are, in this program, unbuilt and not publicly activatable (`gated` — implementation/content/privacy/tests/rights all unmet) and
produce no computed content. **Even once rights-cleared**, their influence on WS-I is
permanently narrowed by contract:

**MAY influence only:**
- optional **reflection themes** (journaling prompts, self-authored notes),
- **low-risk rituals** (a pause, a breathing prompt, a "notice one thing today"),
- **companion atmosphere** (tone/mood of the Living Companion, WS-G),
- and only via `sourceClass: "symbolic_reflection"` / `"chinese_cultural_interpretation"`,
  always labelled, never merged into a factual claim.

**MUST NEVER influence:** medical, legal, financial, employment, relationship-termination,
safety-critical, or any person-ranking decision. These are hard-excluded at Tier 1 (§4)
and additionally fenced by `RecommendationRiskBoundary`
(`clinical_or_fortune_boundary`, `care_welfare_mobility_boundary`, `product_claim_boundary`).
A symbolic source can never be the provenance of a recommendation whose `objectType`
touches those domains — the candidate is dropped, not down-ranked.

## 7. Governance & prohibitions

- **No universal score.** WS-I consumes `synthesizeThemes` (agreement/disagreement), never
  an averaged number (`NO_UNIVERSAL_SCORE`, `lib/cpv1/understanding.ts`).
- **No fabricated content or inventory.** No invented suppliers, prices, availability,
  ratings, or "others like you chose". Commercial/price fields are display placeholders
  in this program; nothing is charged or reserved.
- **No auto-execution.** WS-I proposes; the user acts. No purchase, no message send, no
  form submit, no downstream write happens without an explicit user action.
- **Commercial value cannot buy rank** (§4 Tier 9). Ordering depends only on the user's
  own signals and declared eligibility.
- **Rights gate upstream.** Rights-blocked methods contribute nothing to WS-I; enforced by
  `methodActivationState` / `blockedAdapter` (`lib/cpv1/methods.ts`) and `rights.ts`.
- **No public activation** of any symbolic/cultural-influenced recommendation surface
  without rights clearance + privacy review + Founder activation.
- **Explainability is mandatory.** Every surfaced item carries a `reasonCode` + `nlReason`.
  No item appears without a reason the user can read; there is no opaque score to trace.
- **Diversity, not funneling.** A ranking pass must not collapse the user to one theme.

## 8. Privacy / consent touchpoints

- **Per-method opt-in** for recommendation use (`MethodConsent.recommendationUse`,
  `lib/cpv1/consent.ts`); default off; sensitive families default session-only.
- **PrivacyScope gate** — only `recommendation_permitted` / `public_safe` observations are
  eligible (`canUseDownstream`, `lib/cpv1/understanding.ts`).
- **Location minimization** — `locationScope` uses derived scope only; raw location is
  minimized (`MethodConsent.rawLocationMinimized`); never placed in a URL/query.
- **Full user rights, always available** on any recommendation and its inputs:
  `confirm · correct · reject · hide · forget · delete · export · revoke_downstream`
  (`ALL_USER_DATA_RIGHTS`, `lib/cpv1/consent.ts`). `revoke_downstream` immediately removes
  a signal from future WS-I passes.
- **Feedback is authoritative and sticky** — `not_for_me` / `hidden` items never return;
  `already_tried` items are recognized as done, not re-pushed as new (APP-2 §6.3).
- **Append-only outcome record** — every action_saved / tried / completed / helpful /
  not-helpful / recommendation_outcome is a WS-F `HistoryEvent`, never rewritten
  (`lib/cpv1/history.ts`).

## 9. Acceptance criteria

- [ ] Every emitted recommendation carries all §5.1 envelope fields; a missing field
      suppresses the item (contract-tested).
- [ ] Only signals passing `canUseDownstream(o, "recommendation")` **and**
      `MethodConsent.recommendationUse` **and** `recommendationPermission` reach candidate
      generation.
- [ ] Ordering applies tiers 1→9 in order; a fabricated "high commercial value" candidate
      never outranks a safety/intention/context/pattern/outcome/quality winner (test).
- [ ] `not_for_me` / `hidden` / `rejected` / `deleted` items never appear in output.
- [ ] A symbolic/cultural source can only produce reflection-theme / low-risk-ritual /
      companion-atmosphere objects, and is dropped for any
      medical/legal/financial/employment/relationship-termination/safety/person-ranking
      objectType (test).
- [ ] Ranking is deterministic: identical inputs → identical output (no RNG, no wall-clock,
      no network in the ordering path).
- [ ] Every valid completed family yields at least the SR-1 support-plan / safe-fallback
      action — no dead-ends, no empty plan for a valid family.
- [ ] `revoke_downstream` on an input removes its influence from the next pass.
- [ ] No purchase / send / submit / supplier contact / real price occurs anywhere in WS-I.

## 10. Open blockers

- **Symbolic/cultural methods are upstream-unbuilt** (`gated` across multiple dimensions, WS-C). WS-I's
  symbolic-influence path is specified but inert until methods clear rights + privacy +
  Founder activation. Do not surface it publicly before then.
- **Commercial layer is placeholder** — `commercialStatus` / `priceRange` / partner
  availability have no real supplier, contract, or payment in this Preview program.
  Real activation needs supplier agreements, pricing governance, and Founder sign-off
  (`FOUNDER_GATED`).
- **Local-life / care routes** (`sensitive_local_life`,
  `care_welfare_mobility_boundary`) need a privacy + safety review before any public
  recommendation in those categories.
- **Full CPV1 provenance envelope** is a superset of today's shipped recommendation
  objects; the envelope-completeness contract test is CPV1 work, not yet wired to every
  live surface (hence `CONTRACT_CPV1`, not `IMPLEMENTED_CPV1`).
