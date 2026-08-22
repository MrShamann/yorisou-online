# ASTERION INFRASTRUCTURE HANDOFF — YORISOU / yorisou-online

**Schema:** `asterion.venture-handoff/1`
**Produced:** 2026-08-21 · **Checkpoint:** `41b46f415b019a1aee836682358dfc62021dcae9` (`main`, = `origin/main`)
**Nature:** discovery and handoff. **No production change, no external infrastructure change.**

> Supersedes `ASTERION_CAPABILITY_EXPORT.md` (root, untracked, pinned to `70da80a`, 2026-07-18).
> That audit predates ARCH-P1…P7, LCO-1 and the V2 work and is **stale for infrastructure purposes**.
> It remains accurate as a *capability/content* audit and is not deleted.

---

## A. Venture identity

| Fact | Value |
|---|---|
| Venture | YORISOU — Japanese personal reflection & continuity product |
| `project_id` | `yorisou-online` |
| Repository | `github.com/MrShamann/yorisou-online` |
| Canonical path | `/Users/yangjin/Projects/yorisou-online` (symlink → `/Volumes/AI-Work/Projects/yorisou-online`) |
| Checkpoint SHA | `41b46f415b019a1aee836682358dfc62021dcae9` |
| Branch | `main`, in sync with `origin/main`, 0 unpushed |
| Working tree | clean except two pre-existing untracked documents (below) |
| Manifest lifecycle | `PAUSED` · sensitivity `internal` · primary tool `CLAUDE_CODE` |
| Product phase | Architecture P1–P7 complete and merged; Life OS live to authenticated accounts; V2 consumer refoundation **partially delivered** |
| Deployment | Vercel production, live at `https://yorisou.online` |

**Product purpose.** A person leaves small amounts of state, reflection and confirmed context over
time; the product connects those into continuity they can revisit, correct and delete. Assessment
("いま色") is the main lightweight acquisition path, not the product identity.

---

## B. Infrastructure inventory — by capability

Verified by direct inspection at the checkpoint unless marked. **No secret values recorded anywhere
in this document; only names/references.**

| Capability | Provider | Account / org | Resource id | Env | Purpose | Prod-critical | Source of truth | Verified |
|---|---|---|---|---|---|---|---|---|
| Source control | GitHub | `MrShamann` | `yorisou-online` | all | code, PRs, CI | YES | GitHub | ✅ |
| CI/CD | GitHub Actions | `MrShamann` | 7 workflows | all | tests, DB acceptance, a11y | YES | `.github/workflows/` | ✅ |
| Frontend + server runtime | Vercel | team `team_s3Pfgmcz3GkUOLDW7iAJP8iS` | `prj_XGMZYPllkQF14blo4pZvBtlvhMuW` | prod/preview/dev | Next.js 16 app, server components, API routes | YES | Vercel | ✅ |
| Database | Supabase (PostgreSQL 17.6) | org `mcbskmcwhnfbyjjrvhxd` ("MrShamann's Org") | `krxizslnksorwhepyijs` (`yorisou-production`, ap-northeast-1, ACTIVE_HEALTHY) | prod | all durable product data | YES | Supabase | ✅ |
| Database (preview) | Supabase | org `tolnifbylbbkmvuigmpb` ("Yorisou Preview") | `nbltsbonsnbpfptihomc` (`yorisou-preview`) | preview | **status INACTIVE** | NO | Supabase | ✅ |
| Data transport | PostgREST (via Supabase) | — | `${SUPABASE_URL}/rest/v1` | all | **all** reads/writes; no Supabase SDK | YES | code | ✅ |
| Authentication | first-party (in-repo) | — | `yorisou_session` cookie, `YORISOU_AUTH_COOKIE_SECRET` | all | email+password sessions | YES | `lib/server/yorisouAuth.ts` | ✅ |
| Identity (federated) | LINE | LINE Developers | `LINE_CHANNEL_ID`, LIFF `NEXT_PUBLIC_LIFF_ID` | prod | LINE login / mini-app entry | YES | LINE console | ⚠️ config not re-verified |
| Object storage | AWS S3 / S3-compatible | `AWS_ACCESS_KEY_ID` | `YORISOU_SHARED_STORE_BUCKET`, `YORISOU_SHARED_STORE_REGION` | prod/preview | shared identity/auth store | YES | `lib/server/sharedStoreBoundary.ts` | ✅ code, ⚠️ bucket not probed |
| Transactional email | Resend | — | `RESEND_API_KEY`, `PASSWORD_RESET_FROM_EMAIL`, `CONTACT_FROM_EMAIL` | prod | password reset, contact | YES | Resend | ⚠️ not probed |
| Domains | Vercel-managed | Vercel team | `yorisou.online`, `www.yorisou.online`, `yorisou-online.vercel.app` | prod | public product | YES | Vercel | ✅ |
| DNS | **UNKNOWN registrar** | — | — | prod | apex + www | YES | — | ❌ not determinable from repo |
| AI inference | OpenRouter | — | `OPENROUTER_API_KEY`, `OPENROUTER_BASE_URL` | prod/preview | reflection routing | NO (gated) | code | ✅ names |
| AI inference | Google Gemini / Vertex | `GOOGLE_CLOUD_PROJECT` | `GEMINI_API_KEY`, `GOOGLE_SERVICE_ACCOUNT_JSON`, `VERTEX_AI_ENABLED` | all | creative/text/image | NO (gated) | code | ✅ names |
| AI inference | NVIDIA | — | `NVIDIA_API_KEY`, `NVIDIA_BASE_URL` | all | fallback route | NO | code | ✅ names |
| AI inference | Groq | — | `GROQ_API_KEY` | prod | fallback route | NO | code | ✅ names |
| AI inference | Mistral | — | `MISTRAL_API_KEY` | prod | fallback route | NO | code | ✅ names |
| AI inference | Cloudflare Workers AI | `CLOUDFLARE_ACCOUNT_ID` | `CLOUDFLARE_WORKERS_AI_API_TOKEN` | preview/prod | fallback route | NO | code | ✅ names |
| Media generation | Revid | — | `REVID_API_TOKEN`, `REVID_ENABLED`, `REVID_MODEL` | prod | video generation | NO | code | ✅ names |
| Sidecar services | OpenClaw / Hermes | self-hosted? | `OPENCLAW_*` (6 vars), voice + knowledge sidecar | prod | companion runtime | NO | code | ⚠️ host unknown |
| Secrets | Vercel env store | Vercel team | 68 prod / 95 preview / 26 dev entries | all | all credentials | YES | Vercel | ✅ counts |
| Secrets (operator) | macOS keychain | local | `Supabase CLI` token | local | migration transport | NO | keychain | ✅ |
| Observability | `console.*` → Vercel logs | Vercel | — | prod | bounded ops events (`LIFE_OS_OPS_EVENTS`) | NO | `lib/server/lifeOs/observability.ts` | ✅ |
| Analytics | **NONE FOUND** | — | — | — | — | — | — | ✅ absent |
| Monitoring / alerting | **NONE FOUND** | — | — | — | no uptime or error alerting | — | — | ✅ absent |
| Payments / billing | **NOT ACTIVATED** | — | — | — | spec docs only | — | — | ✅ absent |
| Queues / realtime | **NONE FOUND** | — | — | — | — | — | — | ✅ absent |
| Vector / embeddings | **NONE FOUND** | — | — | — | — | — | — | ✅ absent |

**Cross-venture note.** Supabase org `mcbskmcwhnfbyjjrvhxd` also holds `mirai-move`,
`mirai-move-staging-codex` and `kakari-private-pilot-prod`. Ventures are **separate projects** but
share one billing org — relevant to Asterion cost attribution, and a blast-radius consideration at
the org-credential level.

---

## C. Environment map

| Environment | Runtime | Database | Notes |
|---|---|---|---|
| local | `next dev` / `next start` | disposable `initdb` clusters per harness | Life OS open (`trusted_local`) |
| test | node test runner | disposable clusters + PostgREST container | Life OS open (`trusted_test`) |
| preview (Vercel) | per-branch deployments | `yorisou-preview` (**INACTIVE**) | 95 env entries — largest set |
| production | Vercel prod, `yorisou.online` | `yorisou-production` | 35/35 migrations applied |
| PR/temporary | Vercel branch deployments | — | `yorisou-online-git-*` aliases observed |
| legacy | — | — | 23 merged branches still on the remote |

**Ambiguity / leakage found:**
1. **Preview env set (95) is larger than production (68)** — preview carries variables production does not. Not leakage of prod credentials into preview, but an unreviewed surface.
2. **`yorisou-preview` Supabase project is INACTIVE** while preview env vars still exist → preview deployments may point at a dead database.
3. The `production_shared_store_not_production` boundary correctly refuses a local stack claiming production; **this is a strength**, and it also means the production runtime path cannot be exercised outside production.

---

## D. Provider-specific coupling

| Coupling | Evidence | Class |
|---|---|---|
| **Supabase SDK** | **0 imports of `@supabase/*`.** All access is raw `fetch` to `${SUPABASE_URL}/rest/v1` (18 files) | **LOW** — any PostgREST-compatible host works |
| Supabase auth | **Not used.** Auth is first-party (`yorisou_session` cookie, own password hashing) | **LOW** |
| Supabase storage | **Not used.** Object storage is S3/S3-compatible | **LOW** |
| Postgres semantics | `SECURITY DEFINER` RPCs, RLS, advisory locks, triggers, `pg_stat_clear_snapshot` | **HIGH** — genuine PostgreSQL dependency (not Supabase-specific) |
| Supabase platform privileges | Hosted default privileges grant `service_role` ALL on new `public` tables — required migration `202608210001` to correct | **MEDIUM** — a real hosted-platform behaviour the schema must counter |
| Supabase Management API | Migration transport is `POST /v1/projects/{ref}/database/query` + keychain CLI token | **MEDIUM** — operational, not in product code |
| **Vercel SDK** | **0 imports of `@vercel/*`** | **LOW** |
| Vercel env convention | `VERCEL_ENV` read in 18 files, but through **one** abstraction `deploymentContext()` (17 call sites) | **LOW–MEDIUM** — single seam to re-point |
| Vercel deployment model | CLI `vercel deploy --prod`; domains project-attached; **env changes require redeploy** | **MEDIUM** |
| Vercel build | `npm run build` (Next.js/Turbopack), Node 24.x, install auto-detected | **LOW** |
| Next.js framework | 252 files import `next/*`; server components, App Router, route handlers | **HIGH** — framework, not provider; migration means a rewrite |
| GitHub Actions | 7 workflows, `actions/checkout@v4`, `actions/setup-node@v4`, service containers, `postgrest/postgrest:v12.2.3` | **MEDIUM** — portable patterns, provider-specific syntax |
| LINE | LIFF + login + messaging + webhook; `NEXT_PUBLIC_LIFF_*` reaches the client | **HIGH** — identity + channel, not substitutable |
| AWS S3 | 11 files; `sharedStoreBoundary` enforces store/database project match | **MEDIUM** |
| Resend | 4 files | **LOW** — transactional email is commodity |
| AI providers | Routed through `resolvePrivateReflectionProviders()` with primary + fallbacks from env | **LOW** — already an adapter |
| Payments | none | **N/A** |
| DNS/registrar | **UNKNOWN** | **UNKNOWN** |

---

## E. Reusable capability candidates (do **not** move now)

Genuinely infrastructure, not YORISOU business logic:

1. **AI provider routing** — `lib/server/privateAiProviderResolver.ts`. Primary + ordered fallbacks from env, provider-neutral request/parse shape. **Strongest single candidate.**
2. **Deployment-context resolution** — `lib/cpv1/deploymentContext.ts`. `local | test | vercel_preview | production | unknown`, fail-closed on unknown. Provider-neutral in shape.
3. **Schema-readiness declaration pattern** — `YORISOU_*_SCHEMA_READY`: separates "migration ran" from "feature on". Used by 8+ capabilities. A reusable environment-schema policy.
4. **Migration scope guard** — `scripts/validate-migration-scope.mjs` + sha256 manifest, classifying every migration `PRODUCTION_LINEAGE | LOCAL_ONLY | PREVIEW_ONLY`. Generic migration governance.
5. **Reusable CI shapes** — disposable-PostgreSQL acceptance harnesses; `tests/life-os/ci/postgrest-docker` shim (binary-vs-container adapter).
6. **Bounded ops event vocabulary** — `LIFE_OS_OPS_EVENTS`: closed union, no payload bag, cannot carry user content by shape. A reusable observability contract.
7. **Shared-store boundary** — `lib/server/sharedStoreBoundary.ts`: refuses a store and database belonging to different projects. Generic environment-isolation guard.
8. **Consent record pattern** — `202608220001`: owner-scoped, versioned-to-wording, revocable, collects nothing else.

**Explicitly NOT reusable (YORISOU business logic, must stay):** the 120-question instrument and scoring, 24 archetypes / 31 personas / 21 dimensions, continuity projection semantics, Me composition, the 25-cell check-in response table, all Japanese product copy, POR-1 deletion lifecycle.

---

## F. Cost and waste evidence

Only what is verifiable. **No monthly cost is invented; nothing deleted.**

| Item | Evidence | Disposition |
|---|---|---|
| Supabase org `MrShamann's Org` | plan **pro**; 4 projects incl. 2 other ventures | KEEP |
| `yorisou-production` | ACTIVE_HEALTHY, 35 migrations, small data volume (1 experience card, 5 test results, 0 consents/projections) | KEEP |
| `yorisou-preview` `nbltsbonsnbpfptihomc` | **INACTIVE**, separate org `tolnifbylbbkmvuigmpb` | **INVESTIGATE** — dead project in its own org; may still bill |
| Supabase PITR | not enabled; add-ons **none selected**; priced $100/$200/$400 per month | KEEP (deferred commercial decision) |
| Supabase backups | WAL-G on, 7 daily retained | KEEP |
| Vercel project | 1 project, 3 domains | KEEP |
| Vercel production deployments | **20 retained** | **INVESTIGATE** — retention policy unreviewed |
| Vercel preview env vars | **95** vs 68 production | **INVESTIGATE** — larger than prod, unreviewed |
| Remote branches | **66**, of which **23 already merged into `main`** | **ARCHIVE_CANDIDATE** (merged ones) — architecture branches are deliberately retained as evidence |
| Open PRs | 5, oldest `#113` | **INVESTIGATE** (see §I) |
| AI providers configured | **7** (OpenRouter, Gemini/Vertex, NVIDIA, Groq, Mistral, Cloudflare, Revid) | **CONSOLIDATE_CANDIDATE** — 7 billable vendors for gated features |
| Revid | `REVID_ENABLED` present | **INVESTIGATE** — usage unknown |
| OpenClaw/Hermes sidecars | 6 env vars, upstream URL configured | **INVESTIGATE** — host and cost unknown |
| Resend | configured | KEEP |
| AWS S3 | credentials + bucket configured | KEEP |

**Billing areas requiring provider-level inspection (not determinable here):** actual Supabase spend
and per-project attribution across the shared org; Vercel plan/bandwidth; AWS S3 storage/egress;
per-vendor AI spend; Resend volume; Revid; OpenClaw/Hermes hosting; **domain registrar and DNS**.

---

## G. Migration and portability risks

| Capability | Current | Portable | Non-portable / uncertain | Prerequisites | Cutover | Rollback |
|---|---|---|---|---|---|---|
| Database | Supabase PG 17 | **High** — schema is plain SQL, 35 versioned migrations, sha256-pinned; access is PostgREST | Hosted default privileges; Management API transport; `supabase_migrations` bookkeeping | PostgREST-compatible endpoint; role model (`anon`/`authenticated`/`service_role`) | Requires downtime or dual-write; **no PITR** | Daily backup only (up to 24h loss) |
| Runtime | Vercel + Next.js 16 | Medium | Next.js server components + Turbopack build; env-change-needs-redeploy | Node 24 host supporting Next.js SSR | Domain cutover | Redeploy previous |
| Auth | first-party | **High** — own cookie + hashing, no provider lock | Cookie secret rotation invalidates sessions | Session store availability | Sessions drop on secret change | Restore secret |
| Object store | S3-compatible | **High** | `sharedStoreBoundary` requires store/database project match | Same-project endpoint | Data copy | Re-point |
| Email | Resend | **High** | Sender domain verification | DNS records | Low risk | Re-point |
| AI | 7 providers via resolver | **High** | Per-provider response shapes already normalised | API keys | None | Env change |
| LINE | LINE platform | **LOW** | Channel, LIFF id, webhook URL, verified identity; **account-bound** | LINE console access | Webhook + LIFF endpoint change | Revert console |
| Domains/DNS | Vercel-managed; registrar UNKNOWN | Unknown | Registrar/transfer lock, nameserver authority | Registrar access | **Real downtime risk** | Depends on registrar |

**Do not claim one-click portability.** The database is genuinely portable; **LINE and DNS are not**,
and DNS ownership is currently unestablished.

---

## H. Asterion integration contract requirements

### READ (safe, no approval)
- Repository: HEAD, branches, PRs, CI conclusions, workflow inventory
- Vercel: project id, domains, deployment list/state, **env var NAMES only**
- Supabase: project id/region/status/plan, migration versions, add-on selection, backup config
- Product: public route health (anonymous HTTP status), migration scope validator result
- **Never:** secret values, user content, private records, authenticated user data

### PLAN (safe, no approval)
- Diff repo migration manifest vs Production `schema_migrations`
- Compute env-var name deltas across environments
- Identify merged branches, stale deployments, inactive projects
- Cost attribution **inputs** (resource inventory), not invented figures

### WRITE (approval required)
| Action | Approval | Rollback evidence required |
|---|---|---|
| Apply a migration | Founder, per-migration, with sha256 verified against manifest | Rollback contract in the migration header; pre-state row counts; backup timestamp |
| Set/change a runtime flag | Founder | Prior value recorded; redeploy needed to take effect; kill-switch semantics documented |
| Deploy to Production | Founder | Prior deployment id; public route smoke; instant redeploy of previous |
| Merge to `main` | Founder | Exact-head CI green; merge-commit only (no squash/rebase) |
| Create branches/PRs | Standing | — |

### DESTRUCTIVE (Founder-only, explicit, per-item)
| Action | Approval | Rollback evidence required |
|---|---|---|
| Delete Supabase project | Founder, named project | Verified backup export; confirmed no live dependency |
| Delete Vercel project/domain | Founder | DNS ownership proven **first** |
| Delete branches/deployments | Founder, listed | Merge state proven; deployments not aliased |
| Rotate credentials | Founder or security incident | Blast radius listed; session-invalidation impact |
| Any DNS/registrar change | Founder | Registrar established first |

**Hard invariants Asterion must never bypass:** `PROJECT_MANIFEST.yaml` identity; the writer-lock /
handoff protocol; POR-1 mutation-lease boundary; P6 continuity semantics (terminal invalidation,
delete propagation); consent governance; owner isolation; protected assessment/scoring assets.

---

## I. Current work ledger

**Completed and merged:** ARCH-P1…P7 (platform contracts → Me composition); CNT-1 + CNT-1a
(continuity index, RPC-only); LCO-1 (consent); Gate 5 authenticated Life OS activation with a
live-tested kill switch; V2 check-in Value-Delta fix; V2 Home promise. 35/35 migrations applied to
Production. All CI green at the checkpoint.

**Unmerged work:** none. Working tree clean.

**Open PRs (all pre-existing, none from current program):**

| PR | State | Disposition |
|---|---|---|
| #113 | OPEN | Founder review pending; marked DO-NOT-MERGE historically — **INVESTIGATE** |
| #125 | OPEN | UX-1 visual direction — **INVESTIGATE** (likely superseded by V2) |
| #127 | OPEN, draft | **PROTECTED — DO NOT TOUCH** (standing Founder exclusion) |
| #129 | OPEN | POR-1 incident classification — **INVESTIGATE** |
| #136 | OPEN | **PROTECTED — DO NOT TOUCH** (standing Founder exclusion) |

**HOLD / protected:** PR #127, PR #136; `main` merge authority is Founder's; Production activation
is Founder's; Life OS `PUBLIC` (anonymous) state remains unreachable by design.

**Deferred, governed OFF:** sharing, connection, comparison, discovery, pattern detection (V1.5),
community, DM, feed, followers, matching, payments, Digital Legacy, cross-project data sharing.

**Known defects / risks (none P0/P1):**
- Local `npm run build` intermittently fails on `fonts.gstatic.com` (Noto Sans JP). Environmental —
  reproduced on a tree containing none of this work; remote build green.
- No uptime/error monitoring or alerting exists.
- No PITR; recovery is up to 24h of loss.
- `yorisou-preview` Supabase project INACTIVE while preview env vars persist.
- DNS registrar unestablished.

**External blocker:** Production authenticated E2E cannot be executed by the agent (creating
accounts / entering passwords is prohibited). Requires ~2 minutes of Founder interaction.

**Exact next product task when the pause lifts:** V2 Reflection — replace the five mandatory
textareas with expression → grounded reading → one follow-up, reusing the hypothesis + 近い/少し違う
pattern now live in the check-in. Then Me reframing, then Timeline.

---

## Provenance

Produced under the Asterion Infrastructure Consolidation safe-pause mandate. Read-only with respect
to all external infrastructure: **no** cloud/Vercel/Supabase/repository deletion, DNS change, domain
transfer, production migration, payment activation, credential rotation, destructive cleanup or
external communication was performed. The only mutation is the addition of this document and its
machine-readable manifest.
