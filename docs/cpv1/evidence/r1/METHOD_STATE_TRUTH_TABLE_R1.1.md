# CPV1-R1.1 §4 — `public_active` semantics + 9-method truth table

## The correction

The previous model inferred `public_active` from a code constructor (`originalActive` set
`rights: yorisouOriginal({activated:true})`, and `founderActivation` was derived from that gate). That
**equated** three distinct things the Founder requires kept separate:

- a **route existing** (on a branch, locally, in Preview, or on production `main`),
- a route being **deployed and served in production**,
- a route having an **explicit Founder public-activation** approval.

R1.1 separates these into explicit, independent contract fields
(`lib/cpv1/methods.ts` → `MethodMaturity`):

| Concept | Field | Values |
|---|---|---|
| Implementation | `implementation` | not_started / in_progress / complete |
| Route existence + environment | `route` (`routeEvidence`) | none / preview_only / production_main_present |
| Rights clearance | `rights` | review_required / cleared / blocked |
| Founder public-activation | `founderActivation` (+ `founderDecisionRef`) | **unverified** / closed / open |
| Public availability (DERIVED) | `publicRoute` | available only if ALL of the above + content + privacy + tests + not-dev-flagged |

`methodActivationState` now returns `public_active` **only** when public availability is derived true —
which requires an **explicit evidenced Founder activation** (`open`) **and** a production-main route.
No method currently carries an evidenced Founder activation, so **`publicMethods()` returns 0**. The 9
route-verified methods return **`implemented_route_verified`** (`productionRouteVerifiedMethods()`).

## R1.1A §2 — deployment evidence is now an INDEPENDENT contract dimension

R1.1A adds a first-class deployment-evidence field and evidence references, and tightens the gate so
route-exists / deployed / Founder-approved are never conflated:

| Concept | Field | Values / rule |
|---|---|---|
| Deployment evidence | `deployment` (`deploymentStatus` + `deploymentEvidenceRef`) | `unverified` / `preview_verified` / `production_verified` — a `*_verified` value is trusted **only** when `deploymentEvidenceRef` is present; NEVER inferred from route/branch/main/build/Preview/Founder-decision |
| Founder decision ref | `founderDecisionRef` | `founderActivation: "open"` is trusted **only** when this ref is present |

**`public_active` now requires ALL 10 conditions** (`methodMaturity.publicRoute === "available"`):
implementation complete · rights cleared · content authored/licensed · privacy reviewed · tests passing ·
route `production_main_present` · **deployment `production_verified`** · **Founder `open`** · non-dev-flagged ·
**the required evidence refs present** (enforced by the evidence-gating: an enum value without its ref
downgrades to `unverified`).

**`implemented_route_verified` requires** implementation + rights cleared + content + privacy + tests +
route on production main — and does **NOT** require deployment or Founder activation (and is never returned
merely because implementation, tests and a route exist — see the R1.1A §7 negative tests).

For all 9 methods, `deploymentStatus` is **`unverified`** with **no** `deploymentEvidenceRef`, and
`founderActivation` is **`unverified`** with **no** `founderDecisionRef` — so they remain
`implemented_route_verified` and `publicMethods()` stays **0**. A live-site observation is never converted
into a CPV1 Founder activation or a deployment-evidence record.

## Truth table — the 9 formerly-`public_active` methods vs the 8 conditions

Legend: ✅ evidenced · ◐ asserted-in-registry only (no separate artifact) · ⛔ not evidenced here.

| method | 1 route on prod `main` | 2 actual prod deployment | 3 impl complete | 4 content complete | 5 privacy review | 6 tests | 7 rights cleared | 8 explicit Founder activation | → state |
|---|---|---|---|---|---|---|---|---|---|
| imairo-120q | ✅ `app/check-in` | ⛔ | ✅ | ✅ | ◐ | ✅ | ✅ | ⛔ | implemented_route_verified |
| c02-current-state | ✅ `app/tests/c02` | ⛔ | ✅ | ✅ | ◐ | ✅ | ✅ | ⛔ | implemented_route_verified |
| relationship-fatigue-24q | ✅ `app/tests/relationship-fatigue` | ⛔ | ✅ | ✅ | ◐ | ✅ | ✅ | ⛔ | implemented_route_verified |
| f01-work-fit | ✅ `app/tests/f01` | ⛔ | ✅ | ✅ | ◐ | ✅ | ✅ | ⛔ | implemented_route_verified |
| f02-workplace-fit | ✅ `app/tests/f02` | ⛔ | ✅ | ✅ | ◐ | ✅ | ✅ | ⛔ | implemented_route_verified |
| love-distance | ✅ `app/tests/love-distance` | ⛔ | ✅ | ✅ | ◐ | ✅ | ✅ | ⛔ | implemented_route_verified |
| work-rhythm | ✅ `app/tests/work-rhythm` | ⛔ | ✅ | ✅ | ◐ | ✅ | ✅ | ⛔ | implemented_route_verified |
| local-life | ✅ `app/tests/local-life` | ⛔ | ✅ | ✅ | ◐ | ✅ | ✅ | ⛔ | implemented_route_verified |
| name-impression | ✅ `app/tests/name-impression` | ⛔ | ✅ | ✅ | ◐ | ✅ | ✅ | ⛔ | implemented_route_verified |

### Evidence + honest limits per condition

1. **Route on production `main`** — git-verified: `git cat-file -e origin/main:<route>` succeeds for all 9
   (production `main` = `70da80a0`, unchanged).
2. **Actual production deployment** — **not evidenced in this session.** Verifying a live serving
   deployment would require hitting the production site (out of R1.1 scope; no production access). "Route
   file present on `main`" is NOT a claim that a server is serving it.
3. **Implementation complete** — `implementation: "complete"` + real flow components under `app/` (the §5
   route+flow test asserts each route mounts a `*Flow` and is not a redirect).
4. **Content complete** — `content: "authored"` (registry assertion; these are the shipped YORISOU-original
   assessments/reflections).
5. **Privacy review** — `privacy: "reviewed"` is a registry flag; there is no separate privacy-review
   artifact bound to each method in this repo → recorded as asserted (◐), not independently evidenced.
6. **Tests** — the §5 contract test verifies route + non-redirect + flow for all 9; several also have
   dedicated suites (`imairoSnapshot`, `c02`, `relationshipFatigue`).
7. **Rights cleared** — YORISOU-original (self-owned); `rightsClears` true.
8. **Explicit Founder activation** — **not evidenced.** Previously inferred from the `originalActive`
   constructor; R1.1 sets `founderActivation: "unverified"` and requires an explicit evidenced decision
   before `public_active`.

**Conclusion:** conditions 2, 5, 8 are not evidenced (2 and 8 not at all; 5 asserted-only), so **none of
the 9 may be `public_active`**. All 9 are truthfully `implemented_route_verified`; the CPV1 registry
asserts **0** Founder-activated public methods. The underlying product routes remaining live on the real
production site is a separate fact this repo does not, and should not, assert as CPV1 activation.
