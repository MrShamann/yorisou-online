# UX-2 / ICP-1 — Current Journey and Route Truth

> **Founder authorization:** `YORISOU_UX2_INTEGRATED_CORE_PRODUCT_AND_END_TO_END_COMPLETION_AUTHORIZED`.
> Branch `feat/ux2-integrated-core-experience` from verified `origin/main` `c8d8a8ad6a72949c248adb098a626d1ab9d6a579`.
> Companion document: [`UX2_DATA_AND_CONTRACT_TRUTH.md`](./UX2_DATA_AND_CONTRACT_TRUTH.md).
> Route classification per §8. **Persistence claims are traced to write paths, never inferred from UI code.**

---

## 1. Scale

`find app -name page.tsx` → **111 routes**. This is the sprawl the Founder's gap #3 names. The
table below covers the launch-critical set; the remainder are classified in §4.

---

## 2. Route truth table — launch-critical

| Route | Audience | Current purpose | Data source | Auth | Persistence | Status | UX-2 action |
|---|---|---|---|---|---|---|---|
| `/` | public | Home / positioning | static | no | n/a | renders; generic SaaS hero + empty AI orb (UX-1 audit V1–V3) | **ADAPT** |
| `/tests` | public | Catalog of 3 tests (C02/F01/F02) | `PHASE1_TEST_CATALOG` | no | n/a | renders; a *catalog*, not intent entry; exposes コミュニティ/マッチング teasers | **ADAPT** |
| `/check-in` | public | **The only real 120Q entry** | bundled JSON banks | no | **none** | renders | **ADAPT** |
| `/open-testing` | public | Marketing entry → `/check-in` | static | no | n/a | renders | **MERGE** into intent entry |
| `/services`, `/formal-check` | public | `redirect("/check-in")` stubs | — | no | n/a | redirect | **RETAIN** (redirect) |
| `/en/check-in` | public | `redirect()` → `/check-in` | — | no | n/a | redirect | **RETAIN** |
| `/report-loading` | public | ~3.9s interstitial → `/result` | query params | no | none | renders | **ADAPT** (honest, no fake compute) |
| `/result` | public | 120Q public result | **query string only** | **no** | **none** | renders | **ADAPT** — cannot show a persisted result |
| `/result/return` | public→auth | Replays a pending save after login | `sessionStorage` (10-min TTL) | yes | writes via API | works | **RETAIN** |
| `/result/share` | public | Share card + OG | query params | no | none | renders | **RETAIN** |
| `/saved` | mixed | Two unlinked stores on one page | localStorage **+** `yorisou_test_results` | partial | **split** | renders | **MERGE** — resolve the split |
| `/saved/tests/[id]` | auth | Persisted result detail **+ the only private-state write UI** | `GET /api/tests/results/[id]` | yes | ✅ Supabase | works | **ADAPT** — critical node |
| `/private-state` | auth | 「わたしの今」 — read-only dashboard | `GET /api/private-state` | yes | ✅ Supabase (read) | renders | **ADAPT** — has **no write UI** |
| `/recommendations` | public | Signal form | `localStorage` | no | ❌ **none** | renders | **MERGE/DEPRECATE** |
| `/recommendations/graph` | auth | Real recommendation set + feedback | `yorisou_recommendation_*` | yes | ✅ Supabase | works | **RETAIN** — real feedback loop |
| `/tests/yorisou-values` | gated | **YV — full lifecycle** | YV RPCs | yes | ✅ versioned + events | works (Preview gate) | **RETAIN — the anchor** |
| `/tests/daily-check-in` | gated | DCI daily record | DCI RPCs | yes | ✅ versioned + events | works (Preview gate) | **RETAIN** |
| `/login`, `/register` | public | Email auth | object store | — | ✅ | works | **RETAIN** |
| `/forgot-password`, `/reset-password` | public | Recovery | object store | — | ✅ | works | **RETAIN** |
| `/methodology`, `/privacy`, `/legal` | public | Trust surfaces | static (**governed copy**) | no | n/a | renders | **RETAIN** (protected) |
| `/experiences` | mixed | Experience Card create/browse | `yorisou_experience_cards` | partial | ✅ Supabase | renders | **ADAPT** if slice completes |
| `/line/*`, `/line/mini-app` | public | LINE entry/return | LINE + object store | — | ✅ | works | **RETAIN** — do not mutate Production LINE |
| `/prototype/ux1/*` | internal | UX-1 approved direction | synthetic | no | none | renders | **PROTOTYPE_ONLY** — never a user destination |
| `/admin/**` | admin | Admin surfaces | Supabase | admin | ✅ | works | **INTERNAL_ONLY** |

---

## 3. The three structural breaks (evidence for the Founder's gaps)

### Break 1 — the 120Q journey is client-side and ephemeral end to end

| Stage | Reality | Evidence |
|---|---|---|
| Answers during the flow | `useState` **in memory only** | `app/check-in/MiniTestFlow.tsx:41` |
| Resume after refresh | **Not possible** — resets to intro, index 0 | no progress key exists for 120Q |
| Scoring | **100% client-side; no API route calls it** | `scoreCurrentStateCheck()` `app/check-in/currentStateCheckV1.ts:303` |
| Result identity | Carried in the **URL query string** | `buildPublicResultHref()` `resultCompatibility.ts:110` |
| `/result` data source | **Query params only** — no DB, no cookie, no auth | `app/result/page.tsx:44-49` |
| Anonymous completion | **Not persisted as a result anywhere** | localStorage `yorisou.120q.result.v1:*` is effectively **write-only** — no page reads it back |
| Only server write | `POST /api/tests/imairo/results` — **auth required, `answers={}`**, snapshot rebuilt server-side | `app/api/tests/imairo/results/route.ts`, `testResults.ts:22` |
| Test session / attempt table | **None in Supabase** | only an analytics-grade `DiagnosisSession` in a file/S3 store, ephemeral in prod |

**So: a user can complete 120 questions and, unless they authenticate and press save, nothing exists
afterwards.** `/result` cannot render a persisted result for a signed-in user — it is stateless-by-URL.

### Break 2 — the private continuity surface cannot be acted upon

`/private-state` performs exactly one `fetch("/api/private-state")` and renders. **Every write control
lives in `app/components/PrivateStatePanel.tsx`, mounted only from `/saved/tests/[id]`.** The "my current
state" page cannot generate a reflection, add a memory, act on a next step or plan a check-in.

### Break 3 — duplicated, contradictory surfaces

- **Two "saved" stores** on one page sharing no id: `localStorage["yorisou.savedResult.v0_2"]` (single slot) and `yorisou_test_results`.
- **Two "recommendations"**: `/recommendations` (localStorage, `source: "local-browser"`, **no fetch at all**) vs `/recommendations/graph` (fully server-backed with persisted feedback).
- **A naming collision**: `yorisou_private_recommendations` (per-result next steps) vs `yorisou_recommendation_items`/`_actions` (the graph) — both render "saved / tried / helpful / not relevant".
- **Three entry idioms**: `/` (violet), `/tests` (deep-green serif catalog), `/check-in` (chromeless).

---

## 4. Classification of the wider route set

| Class | Examples | Note |
|---|---|---|
| `RETAIN` | auth, recovery, trust/methodology, LINE, `/recommendations/graph`, YV, DCI | governed or already real |
| `ADAPT` | `/`, `/tests`, `/check-in`, `/result`, `/report-loading`, `/private-state`, `/saved/tests/[id]` | the core journey |
| `MERGE` | `/open-testing`→intent entry, `/recommendations`→graph, `/saved` split | remove duplication |
| `REDIRECT` | `/services`, `/formal-check`, `/en/check-in` | already redirects |
| `DEPRECATE` (candidates) | `/dev/**`, `/concept`, `/business`, `/company`, `/pilot`, duplicate EN product routes | verify before removal |
| `INTERNAL_ONLY` | `/admin/**`, `/dashboard/open-testing`, `/admin-entry` | must not appear in public nav |
| `PROTOTYPE_ONLY` | `/prototype/**` incl. `/prototype/ux1/*` | noindex; never a user destination |
| `UNKNOWN_PENDING_EVIDENCE` | remaining EN mirrors, `/insights/[slug]`, `/experiences/invite/[token]` | not yet individually verified — **not** silently deleted |

**No route has been deleted or redirected by this document.** Consolidation (§22) must follow the
core journey working, not precede it.

---

## 5. Anchor decision (evidence-based)

| Candidate | Governed runtime | Server persistence | Correction | Distinct confirmation | Rejection | In Preview | Verdict |
|---|---|---|---|---|---|---|---|
| **Yorisou Values** | ✅ | ✅ versioned + events | ✅ | ✅ | ❌ **missing** | ✅ | **ANCHOR** |
| Daily Check-In | ✅ | ✅ versioned + events | ✅ | ack only | ❌ | ✅ | secondary |
| 120Q / imairo | ✅ | snapshot only, auth-gated, `answers={}` | ❌ | ❌ | ❌ | ❌ table absent | needs Preview migrations + new machinery |

**Decision: anchor the end-to-end persisted journey on Yorisou Values**, then extend it with a genuine
**rejection** event — the one §13 element that does not exist anywhere in the product today.

Rationale: YV is the only path where confirm → correct → history is already real, server-enforced,
versioned, event-logged **and present in the Preview database**. It is exactly the loop the Founder's
gap #2 says has never been proven, and it can be proven rather than rebuilt.

---

## 6. Verification method

Route enumeration by `find app -name page.tsx`; behaviour by direct source reading of the routes,
their components and their server modules; Preview table list by read-only Supabase Management API
query. **No route was modified, no database was mutated, and Production was not touched** in producing
this document.
