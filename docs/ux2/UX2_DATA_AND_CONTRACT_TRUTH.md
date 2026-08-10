# UX-2 / ICP-1 — Data and Contract Truth

> **Founder authorization:** `YORISOU_UX2_INTEGRATED_CORE_PRODUCT_AND_END_TO_END_COMPLETION_AUTHORIZED`.
> Branch `feat/ux2-integrated-core-experience` from verified `origin/main` `c8d8a8ad6a72949c248adb098a626d1ab9d6a579`.
> **Persistence is traced to real write paths — never inferred from UI code**, as §8 requires.
> Every row below names the file and function that performs the write.

---

## 1. The single most important finding

> **The Preview Supabase project (`yorisou-preview` / `nbltsbonsnbpfptihomc`) contains only SIX tables:**
> `yorisou_values_assessments`, `yorisou_values_assessment_versions`, `yorisou_values_assessment_events`,
> `yorisou_daily_state_records`, `yorisou_daily_state_record_versions`, `yorisou_daily_state_history_events`.

Verified read-only via the Supabase Management API on 2026-07-27.

Everything else the current product writes to Supabase — saved test results, private-state
reflections/memories/next-steps/check-ins, the entire recommendation graph, experience cards,
candidate intake — **has no table in Preview**. Those code paths will fail in the Preview
environment until their migrations are applied there.

**Consequence for this package:** the only method families that can carry a genuinely persisted
end-to-end journey in Preview *today* are **Yorisou Values (YV)** and **Daily Check-In (DCI)**.
Any other anchor requires Preview migrations first (which §6 authorizes, but which must be
executed and evidenced, not assumed).

---

## 2. Identity, session and authentication

**There is no Supabase Auth and no `users`/`sessions` table anywhere in this flow.**

| Concern | Truth | Evidence |
|---|---|---|
| Session transport | Cookie `yorisou_session` (session cookie, no `maxAge`) | `lib/server/yorisouAuth.ts:21` |
| Account transport | Cookie `yorisou_account`, `maxAge` 180 days | `lib/server/yorisouAuth.ts:22` |
| Cookie contents | **Not an opaque id** — AES-256-GCM encrypted JSON. `yorisou_account` carries the entire `AccountRecord` including `passwordHash` | `encryptCookieValue()` |
| Key | `YORISOU_AUTH_COOKIE_SECRET`; in non-production it falls back to `randomBytes(32)` **per process** | `yorisouAuth.ts:240` |
| Session record store | S3-compatible object store `phase1/sessions/{id}.json`, or local file `data/phase1-sessions.json` | `yorisouData.ts:416`, `:1075-1145` |
| Account record store | `phase1/accounts/by-id/{id}.json` + `by-email/{sha256}.json` | `yorisouData.ts:406-413` |
| Viewer resolution | `getViewerContext()`, three branches | `yorisouAuth.ts:612` |

### Two load-bearing behaviours the integration must respect

1. **A valid `yorisou_account` cookie alone authenticates every owner-scoped API** — branch 3 of
   `getViewerContext()` returns an account with no session record at all. Every route using the
   `owner()` helper accepts this.
2. **After login/register, `session.userId` is deliberately set to `null`** and the
   `principalLanding` contract becomes the sole owner pointer
   (`switchSessionToPrincipalLandingTruth()`, `yorisouAuth.ts:481`). LINE callback does *not* do
   this and keeps `userId` populated — an inconsistency to preserve carefully, not "fix" casually.

> **Testing note (§30):** because the dev cookie key is regenerated per process, any E2E run must
> set `YORISOU_AUTH_COOKIE_SECRET` explicitly or every restart silently logs the user out.

### Anonymous → account carry-over

**Only consultations are re-owned.** `bindSessionToUser()` → `assignSessionConsultationsToUser()`
(`yorisouData.ts:1548`) rewrites consultation ownership. **Nothing** re-owns saved test results,
reflections, memories, recommendations, check-in plans or localStorage records. None of the
Supabase tables below carry a `session_id` column; they are keyed on `owner_account_id` and their
routes 401 when anonymous.

The only anonymous→account bridge for a result is client-side and deliberate: `app/result/pendingSave.ts`
stores the *route context only* (not content) in `sessionStorage` under
`yorisou.imairo.pending-save.v1` with a **10-minute TTL**, replayed by `app/result/return/page.tsx`.

---

## 3. Persistence map (write paths traced)

### 3.1 Genuinely server-persisted, and present in Preview ✅

| Domain | Tables | Write path |
|---|---|---|
| **Yorisou Values** | `yorisou_values_assessments`, `_versions`, `_events` | `lib/server/yorisouValuesStore.ts` — atomic SECURITY DEFINER RPCs `yorisou_values_assessment_create` / `_correct` / `_set_confirmation` / `_delete` |
| **Daily Check-In** | `yorisou_daily_state_records`, `_record_versions`, `_history_events` | `lib/server/dailyCheckInStore.ts` |

**YV already implements most of the §13 contract**: a versioned correction (previous version
preserved), a *distinct* confirmation event that does not bump the version, six-field provenance
enforcement, and content-erasing deletion leaving only content-free tombstones. This was proven in
Production during PPR-1.

**The one §13 element YV lacks: rejection.** There is no "この理解は残さない" event type — confirmation
is limited to `confirmed | not_quite | skipped`. Adding a true rejection event (and making a rejected
interpretation stop being reused as accepted truth) is genuine new work.

### 3.2 Server-persisted, but **absent from Preview** ⚠️

| Domain | Tables | Write path |
|---|---|---|
| Saved test results | `yorisou_test_results` | `lib/server/testResults.ts:13/22/30`, `lib/server/c02Results.ts` |
| Private state — reflections | `yorisou_ai_reflections` | `lib/server/privateAi.ts:108/121` |
| Private state — memories | `yorisou_private_memory_items` | `privateAi.ts:118` |
| Private state — next steps | `yorisou_private_recommendations` | `privateAi.ts:109/119` |
| Private state — check-ins | `yorisou_private_check_in_plans` | `privateAi.ts:120` |
| AI runs / controls | `yorisou_ai_runs`, `yorisou_ai_runtime_controls`, `agent_runtime_tasks` | `privateAi.ts:97/106/60` |
| Recommendation graph | `yorisou_recommendation_sets`, `_items`, `_actions`, `_events`, `_reports`, `_returns`, `yorisou_resources` | `lib/server/recommendationGraph.ts` |
| Experience cards | `yorisou_experience_cards` + `_revisions/_consents/_invites/_blocks/_reports/_events/_moderation_events/_visibility_events` | `lib/server/experienceCards.ts` |
| Candidate intake | `yorisou_candidate_*`, `yorisou_resource_sources` | `lib/server/candidateIntake.ts` |
| LINE OAuth state | `yorisou_line_oauth_states` | `lib/server/lineOAuthStateStore.ts` |

### 3.3 **Client-only — not persisted anywhere server-side** ❌

This is the list that matters most for the Founder's gap #2.

| # | What | Storage | Consequence |
|---|---|---|---|
| 1 | The entire `/saved` hero card (`SavedResultView`) | `localStorage["yorisou.savedResult.v0_2"]` (`app/result/saveState.ts`) | **Single slot, overwritten each save**, device-local, lost on browser clear or device change |
| 2 | The `/recommendations` signal selection (`RecommendationSignalForm`) | `localStorage["yorisou.recommendationSignal.v0_2"]`, type literally declares `source: "local-browser"` | **Makes no `fetch` call at all** — never reaches a server |
| 3 | Anonymous→login result bridge | `sessionStorage`, 10-minute TTL | Route context only, not content |
| 4 | `/private-state` and `SavedTestList` view data | plain `useState` fetch caches | No offline persistence; a failed fetch simply shows nothing |
| 5 | All anonymous work except consultations | — | Not carried into an account by anything |

---

## 4. Structural problems this package must resolve

### 4.1 `/private-state` is a read-only dashboard with no write UI

`app/private-state/view.tsx` does exactly one `fetch("/api/private-state")` on mount. **Every write
control lives in `app/components/PrivateStatePanel.tsx`, which is only mounted from
`app/saved/tests/[id]/view.tsx`.** So the "my current state" surface cannot be acted on from itself —
the user must first find a saved result detail page. This is a core reason the journey does not feel
connected.

### 4.2 `/saved` shows two stores that are never reconciled

`SavedResultView` (localStorage, single slot) and `SavedTestList` (`yorisou_test_results`, account-backed)
render on the same page and **share no id**. A user can "save" twice and get two unrelated artefacts.

### 4.3 Two different "recommendations" with opposite persistence, and a naming collision

- `/recommendations` → localStorage only, never persisted.
- `/recommendations/graph` → fully server-backed, with **real persisted feedback**
  (`actionRecommendation()` → `rpc/record_yorisou_recommendation_action` → `yorisou_recommendation_actions`,
  plus a row in `yorisou_recommendation_events`). Allowed actions: `saved`, `try_intent`, `tried`,
  `helpful`, `not_helpful`, `not_relevant`, `hidden`, `reported`, `reason_viewed`, `resource_opened`.

Additionally `yorisou_private_recommendations` (per-result "next steps", statuses
`saved|try|tried|helpful|not_relevant|hidden`) is a **different table and API** from
`yorisou_recommendation_items`/`_actions`, while both render "saved / tried / helpful / not relevant"
buttons. Any integration must not conflate them.

**Good news for §17:** a real, persisted, explainable recommendation-feedback loop already exists in
the graph surface. It needs Preview tables and integration, not invention.

---

## 5. What this means for the UX-2 anchor decision

| Candidate anchor | Real governed runtime | Server persistence | Correction | Confirmation event | Present in Preview | Verdict |
|---|---|---|---|---|---|---|
| **Yorisou Values** | ✅ | ✅ versioned | ✅ | ✅ distinct | ✅ | **Strongest anchor** |
| Daily Check-In | ✅ | ✅ versioned | ✅ | acknowledgement only | ✅ | Good secondary |
| 120Q / imairo | ✅ | see route-truth doc | ❌ none (audit R3) | ❌ | ❌ tables absent | Requires Preview migrations + new correction machinery |

**Recommended anchor: Yorisou Values**, extended with a genuine rejection event — because it is the
only path where the confirm → correct → history loop is already real, server-enforced and present in
Preview, which is precisely what the Founder's gap #2 says has never been proven.

---

## 6. Verification method

- Preview table list: Supabase Management API `POST /v1/projects/nbltsbonsnbpfptihomc/database/query`, read-only `SELECT` against `information_schema.tables`.
- Write paths: direct source reading of `lib/server/**` (`yorisouAuth.ts`, `yorisouData.ts`, `privateAi.ts`, `testResults.ts`, `recommendationGraph.ts`, `experienceCards.ts`, `yorisouValuesStore.ts`, `dailyCheckInStore.ts`) and the API routes under `app/api/**`.
- No database was mutated in producing this document. Production was not touched.
