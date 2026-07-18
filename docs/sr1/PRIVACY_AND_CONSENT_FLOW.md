# SR-1 — Privacy & Consent Flow

The stranger-ready journey is privacy-safe by default (§26). This audits the
data flow of the SR-1 spine.

## What the anonymous journey stores, and where
| Data | Scope | Store | User control |
|---|---|---|---|
| Selected need / pace | device | `localStorage` `yorisou.sr1.journey.v1` | cleared by "この端末の記録を削除する" |
| Chosen route / return path | device | same | same |
| Public result identity (family + public result id + label + path) | device | same | same |
| Saved / tried / hidden service-item ids | device | same | same |
| Coarse feedback signals (useful / not_now / tried / hide / saved) | device | same | same |
| Public saved result (RTR-1 record) | device | `localStorage` `yorisou.savedResult.v0_2` | "この端末の記録を削除する" / `/saved` clear |
| Pending save across login | session (≤10 min) | `sessionStorage` (RTR-1 `pendingSave`) | expires automatically |

**The guest journey stores NO raw answers, NO private notes, NO scoring
internals, NO account identifiers, NO PII.** The parser (`parseGuestJourney`)
strips any non-typed field, and only relative in-site paths are accepted for
route fields — verified by `test:sr1` (it feeds injected `answers` / `email` /
`rawAnswers` / `payloadKey` and asserts they are dropped).

## Persistence truth (§9.2)
The UI states scope accurately via `PERSISTENCE_SCOPE_LABEL`:
- session — "この画面を閉じるまで（保存されません）"
- device — "この端末にのみ保存（いつでも削除できます）"
- account / line — only where a real server store / LINE link exists.
No cross-device sync is implied anywhere. The device-local save copy explicitly
says it is not a LINE/account link.

## Consent boundaries
- Collect the minimum needed to route (need + pace + returning).
- Feedback is coarse and device-local by default; nothing is submitted to a
  server from the SR-1 spine without an explicit, separate action (the existing
  `/contact` intake is the only server feedback path, and it validates + is
  enumeration-safe).
- No automatic public profile, no hidden sharing. Share cards carry only
  public-safe fields (AIX-4/5 share model).
- No medical/psychological interpretation; no crisis-service implication; the
  guided experiences carry an explicit "これは診断ではありません" boundary.
- No autonomous external contact on the user's behalf.
- Clearing is one action and removes both the journey and the saved record.

## Guest → account / LINE transition
Login / registration / LINE are **optional continuity upgrades** (§9.3). They do
not block initial value. The existing RTR-1 pending-save bridge preserves the
public result context across the login boundary (sessionStorage, ≤10 min,
public-safe only). SR-1 adds honest recovery states on the account-gated
surfaces (`/private-state`, `/saved`, `/recommendations`) so a logged-out
visitor is told clearly how to continue rather than hitting a misleading error.

## Founder/Admin data-handling (documented gaps — see audit §E)
The founder observability surfaces already exist. Two access-logging gaps were
identified (timeline + open-testing feedback inbox record no `admin.view_sensitive`
audit entry, and the feedback inbox spreads PII). These are **server-side, no-
migration** fixes tracked as SR-1 follow-ups; they do not affect the anonymous
stranger journey. Admin access remains email-allowlist gated; the audit log
viewer exists. Provisioning `YORISOU_ADMIN_EMAILS` explicitly and confirming no
dev-fallback-open in production is a launch-environment item.

## No raw answers in any public/analytics/share surface
Verified across the AIX smoke suite (no `service_role` / `answerCount` /
`payloadKey` leak into public HTML or share metadata) and preserved here — the
SR-1 additions only read the public-safe device-local model.
