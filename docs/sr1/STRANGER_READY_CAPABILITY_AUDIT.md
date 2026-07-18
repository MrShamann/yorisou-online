# SR-1 — Stranger-Ready Capability Audit

Machine-grounded audit (parallel readers over the real source) of whether a
completely unfamiliar first-time visitor can enter YORISOU and receive a
coherent, useful, personalized service end to end. This is an SR-1 **implementation
input**, not a completion claim.

Legend — anon (works without login) · login · value · next (connected to a
coherent next step) · recov (recovery/empty/error path) · truthful · launch.

## A. Two operating layers (the central finding)

YORISOU has two layers with very different launch-readiness:

1. **Anonymous device-local layer** — homepage, the 120Q いま色テスト, the short
   flows, results, sharing, reports (self-understanding), co-design/partner
   intake, the support-chat engine. These work **without login** and are the
   stranger-ready core. Their gaps are mostly *wiring and coherence*, fixable in
   the authorized SR-1 scope (frontend / service-logic / device-local).
2. **Server-backed account/LINE layer** — account save (`/saved`), private-state,
   the recommendation graph, the experiences hub, LINE messaging/login,
   password reset, and the founder readiness dashboards. These require
   provisioned production env (**Supabase, shared-S3 store, Resend, LINE
   channels, an LLM key**). SR-1 **may not** provision production secrets or run
   production migrations (§25); these are **launch-environment provisioning
   items**, tracked here and documented as out-of-SR-1-scope blockers.

## B. Capability findings

### Entry & Understand
| Capability | Route | anon | login | value | next | recov | truthful | launch | Gap → SR-1 action |
|---|---|---|---|---|---|---|---|---|---|
| Homepage entry | `/` | ✓ | no | ✓ | ✓ | ✓ | ✓ | ✓ | Only CTA → 12-min 120Q; heaviest first commitment. **→ route through a service router that offers lighter paths.** |
| 120Q いま色テスト | `/check-in` | ✓ | no | ✓ | ✓ | ✓ | ✓ | partial | No in-progress persistence — reload loses 120 answers. **→ persist + resume.** |
| Intention chooser | `/tests` | ✓ | no | ✓ | ✓ | ✓ | concern | partial | Surfaces only imairo+C02+F01+F02; short flows absent; a "coming soon" note contradicts already-live flows. **→ surface short flows via router; remove false note.** |
| Short live flows | `/tests/{work-rhythm,name-impression,local-life,love-distance,relationship-fatigue}` | ✓ | no | ✓ | ✓ | ✓ | ✓ | partial | The only quick (2–5 min) anonymous value, but **orphaned** from all web entries (LINE/post-result only). **→ router + entries.** |
| `yorisouTests.ts` | (imported nowhere) | — | — | no | no | — | concern | no | Dead catalog with stale "約3分/タイプ診断" copy. **→ delete.** |

### Results & Sharing
Real result engine confirmed: `assignPublicArchetype` maps a completed 120Q to
one of 24 named archetypes; `/check-in → /report-loading → /result` yields a
**real named result** (placeholder only for unfinished input). C02/F01/F02 via
`SpecAssessmentFlow`; short flows via `yorisouQuestionSets`. Result surface has
reveal + report link + recommendation link + share + private save. Gaps: **the
anonymous device-local "remember" writer is dead** (below); C02/F01/F02 "save"
is login-gated (inconsistent with the 120Q which saves device-local — but that
writer is unwired, see below).

### Remember & Return (continuity) — the biggest gap
- **DEAD anonymous save.** `app/result/LocalResultSave.tsx` + `app/result/saveState.ts`
  (the device-local `saveResultRecord` writer) are **rendered by no page** —
  `/result` renders only the login-gated `PrivateResultSave`. So the entire
  no-login "remember" path is dead code, and `/saved`'s device-local hero is
  **permanently empty with false copy** ("結果ページで保存すると、この端末からあとで
  見返せる"). Reports + LINE also promise "この端末やLINEに残して見返せます". **→ SR-1
  wires an anonymous device-local save on the result path; the promise becomes true.**
- `/saved` account list: truthful, but its empty state has no inline login CTA.
- `/private-state`: for logged-out visitors a 401 renders as a misleading
  *transient* error with no login CTA — a dead-end. **→ 401 → login/register/LINE CTA.**

### Discover & Deepen
- `/recommendations`: for a no-result stranger the hero implies a pending result
  they never created; primary CTA → login-gated graph → 401. **→ true first-visit
  hero + working anonymous next-step.**
- `/recommendations/graph`: fully broken for strangers (401, generic error, no
  recovery). **→ 401 recovery (sign-in / take 120Q) + device-local support plan.**
- `/reports/self-understanding/[publicCode]`: **real deeper reading, free, works
  anonymously** (open-testing access mode). ~2 archetype codes lack a content
  file → `notFound()`. **→ soft fallback.**
- `/reports/sample`: **fabricated "🔒 残り12章" locked-content** (fake scarcity;
  §30 violation). **→ remove; point to the real free report.**
- `/reports/{relationship-fatigue,love-distance,self}`: promise a *personalized*
  report with **no delivery route**; light theme inconsistent. **→ relabel as
  sample readings + align theme.**

### Experience, Connect & Co-Design
- `/experiences`: **login-gated hub with no auth UI** — an anonymous stranger
  gets an interactive form where every call 401s with a misleading validation
  error. No anonymous, completable guided experience exists anywhere. **→ SR-1
  builds an anonymous guided-experience runtime + surfaces it; adds a sign-in CTA.**
- `/experiences/invite/[token]`: anonymous read-only, but dead-ends (no onward CTA).
- `/co-design`, `/partners`: **truthful concept surfaces** (current/prototype/
  planned honestly labeled; real `/contact` intake; no fake commerce). Co-design
  feedback → governed admin review room is a **complete path**. No SR-1 change required.

### LINE, Auth, Trust & Ops
- LINE mini-app: cold-start shows "return" framing to first-timers → first-visit branch.
- LINE messaging/login, forgot-password, account persistence: **env-gated**
  (LINE_*, Resend, shared-S3). Degrade gracefully today but are inert/ephemeral
  without provisioning. **Launch-env provisioning items — out of SR-1 scope.**
- `/forgot-password`: always says "sent" even when mail unconfigured (silent
  recovery dead-end without Resend). Provisioning item.
- `/support`: mislabeled — it is a login/account helper, and the working
  anonymous `/api/support/chat` engine (deterministic fallback) is not surfaced.
- Admin: real observability (`/admin`, `/admin/dte-launch-dashboard`,
  `/dashboard/open-testing`) but two **PII access-logging gaps** (timeline +
  feedback inbox unlogged; feedback inbox spreads PII). **→ add audit logging +
  masking (server code, no migration).** No `nav_dead_end` telemetry. **→ add event.**

## C. Concrete dead-ends / placeholders found (must clear from the core journey)
1. Dead anonymous device-local save (writer rendered nowhere) + false `/saved` device-local copy + false reports/LINE "この端末に残せる" promise.
2. `/recommendations/graph` 401 with generic error, no recovery.
3. `/recommendations` no-result hero implies a non-existent pending result.
4. `/private-state` 401 → misleading transient error, no login CTA.
5. `/experiences` login-gated form with no auth UI (401 → validation-style error).
6. `/experiences/invite/[token]` read-only dead-end (no onward CTA).
7. `/reports/sample` fabricated "🔒 残り12章" locked chapters (fake scarcity).
8. `/reports/{relationship-fatigue,love-distance,self}` promise personalized reports with no delivery route.
9. `/tests` "coming soon" note contradicting live flows; short flows orphaned.
10. Dead code: `yorisouTests.ts`, `LocalFeedbackConsent.tsx`.

## D. SR-1 in-scope plan (device-local / frontend / service-logic; no prod env, no migration)
1. **Service router** (`/start`) — ordinary needs → real destinations with why/time/receive/privacy/login-optional; homepage routes through it.
2. **Guest journey continuity** (`lib/sr1/guestJourney.ts`) + **wire the anonymous device-local save** on `/result` so "remember" is real; `/saved` device-local hero becomes truthful.
3. **Personal Support Home** (`/my-yorisou`) — continuing hub from guest journey + saved result.
4. **Personalized Support Plan** — deterministic, public-safe, on the result surface + hub (reuses the result-compatibility + next-actions).
5. **Recovery system** — fix items C-2..C-6 (401 recovery + login CTAs + onward CTAs) with one governed empty/error component set.
6. **One anonymous guided experience** (`/experiences/guided/grounding-reflection`) — start→complete→reflect→feedback→save/return, device-local.
7. **Truthfulness fixes** — remove the fake `/reports/sample` lock; relabel report teasers as samples; fix false `/saved` device-local copy; remove the `/tests` "coming soon" note; delete dead `yorisouTests.ts` / `LocalFeedbackConsent.tsx`.
8. **120Q in-progress persistence** + resume.
9. **Admin service-readiness** — access-logging + PII masking on timeline/feedback; a `nav_dead_end` client event.

## E. Out of SR-1 scope (production-environment provisioning — documented blockers)
These require production secrets / infra that §25 forbids SR-1 from touching.
They gate the *server-backed* journeys (account save, private-state, the
recommendation graph, the experiences hub, LINE, password reset, persistent
readiness dashboards) and several Stranger Acceptance Scenarios (guest→account/
LINE upgrade E2E; real-backend API-failure E2E; founder ops with real aggregates):
- **Supabase** (`SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`) — recommendation store, experience cards.
- **Shared-S3 store** (`YORISOU_SHARED_STORE_BUCKET` + AWS creds) — account/feedback/event persistence (else ephemeral `/tmp`).
- **Resend** (`RESEND_API_KEY` + from/to emails) — password reset + feedback email.
- **LINE** (`LINE_MESSAGING_*`, `LINE_CHANNEL_ID`, login secret, `LINE_REDIRECT_URI`).
- **LLM key** — private AI reflection + experience structuring (deterministic fallbacks exist).
- **`YORISOU_ADMIN_EMAILS`** set explicitly; confirm no dev-fallback-open in production.

SR-1 makes the anonymous device-local core stranger-ready and ensures every
server-backed surface **degrades to an honest, recoverable state** for the
unauthenticated/unprovisioned visitor, rather than a misleading dead-end.
