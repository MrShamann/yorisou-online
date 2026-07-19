# WS-N — Founder / Admin Surfaces

**Program:** YORISOU Complete Platform V1 (CPV1) · **Branch:** `feat/cpv1-integrated-platform`
**Maturity (this workstream):** `CONTRACT_CPV1` — a typed aggregate-view contract that **extends** the
already-shipped APP-2 admin dashboards (`LIVE_APP2`: `app/admin/service-readiness`, `app/admin/review-queues`,
`app/admin/experiences`). No new privileged data path is activated until a Founder review passes.
**Brand vision:** 人を、ひとつの答えに閉じ込めない。 · **Brand line:** ひとつの見方で、あなたを決めない。

The Founder/Admin surface is where the whole platform becomes *legible to its operators* — readiness,
rights, gates, safety, blockers — **without** ever becoming a window into any one person's private life.
This spec governs that boundary: aggregate by default, sensitive access logged, no raw-user-data browsing.

---

## 1. Purpose

Give the Founder (and least-privilege staff) one governed operations view that answers "is the platform
safe and ready to operate, and where is it blocked?" using **privacy-minimized aggregate metrics** only.
It extends the live APP-2 readiness dashboard rather than replacing it, and it deliberately refuses to
become an admin-can-read-anything console. Every panel is an aggregate; every raw-scope touch is logged
and, by default, disallowed.

Twelve aggregate panels, each tagged with its own maturity and sourced from a real contract:

| # | Panel | Maturity | Source of truth (real) |
|---|-------|----------|------------------------|
| 1 | Method readiness | `CONTRACT_CPV1` | `methodActivationState` over `CPV1_METHOD_UNIVERSE` (`lib/cpv1/methods.ts`) |
| 2 | Rights status | `RIGHTS_BLOCKED` | `rightsClears` / `RightsRecord` (`lib/cpv1/rights.ts`) |
| 3 | Method activation gates | `FOUNDER_GATED` | `methodPublicallyActivatable`; `founderActivated` + `activationGate` |
| 4 | Completion / abandonment | `CONTRACT_CPV1` | `HistoryEventType` (`method_completed`), `yorisou_migration_funnel` (`LIVE_APP2`) |
| 5 | Correction / rejection patterns | `CONTRACT_CPV1` | `HistoryEvent` (`user_corrected`, `user_rejected`); `ConfirmationState` |
| 6 | Companion opt-in & memory scope | `CONTRACT_CPV1` | `MethodConsent.companionUse` / `PrivacyScope` (`consent.ts`, `understanding.ts`) |
| 7 | Recommendation outcomes | `CONTRACT_CPV1` | `HistoryEvent` (`recommendation_outcome`, `marked_helpful`) |
| 8 | Community safety | `CONTRACT_CPV1` | `yorisou_review_queue_summary` + `app/admin/experiences` moderation (`LIVE_APP2`) |
| 9 | Report usefulness | `CONTRACT_CPV1` | `HistoryEvent` (`marked_helpful` / `marked_not_helpful`) |
| 10 | Archive readiness | `ARCHITECTURE_CPV1` | WS-K archive contract (aggregate counts only) |
| 11 | Legacy config status | `LEGAL_BLOCKED` | WS-K Designated Legacy config (activation blocked) |
| 12 | Incidents / blockers | `LIVE_APP2` | `yorisou_service_incidents`, `yorisou_service_readiness_overview` |

No panel exposes a person. No panel renders a "31 personas" taxonomy, persona rooms, or any fixed
user classification — the platform holds a source-separated understanding, never one universal label.

---

## 2. Maturity

**WS-N as a whole: `CONTRACT_CPV1`.** It is a design + typed-view contract layered on the live APP-2
admin stack. The APP-2 pieces it builds on are already `LIVE_APP2`: the sensitive-access log
(`yorisou_admin_access_logs`), the append-only audit triggers, the `security_invoker` aggregate views,
and `requireAdminViewer` gating (`lib/server/foundation/access.ts`). What is **not** yet built are the
nine CPV1-specific aggregate panels (rows 1–11 above minus the live incident view). Those are contracts,
not implementations. Nothing in this doc authorizes production deploy, and it activates no public method,
no public Digital Legacy, and no unrestricted admin read path.

---

## 3. Data / contract model

**Everything the surface renders is an aggregate row, never a user row.** The contract type is a
readonly `AdminAggregatePanel` whose cells are counts/rates over already-governed contracts:

```
type AdminAggregatePanel = {
  panelId: string;               // e.g. "method_readiness"
  maturity: Cpv1Maturity;        // one of the seven allowed tags
  cells: ReadonlyArray<{ key: string; count: number; note?: string }>;
  suppressedCells: number;       // k-anonymity: cells below threshold are hidden, not shown as "~0"
  sourceRefs: string[];          // provenance: which contract/table produced the number
  computedAt: string;            // ISO
};
```

Real sources it aggregates over (no invented data):

- **Method readiness / rights / gates** — derived purely from `lib/cpv1/methods.ts`:
  `publicMethods()`, `rightsBlockedMethods()`, `devVisibleMethods()`, and `methodActivationState(m)`
  bucketing into `public_active | implemented_private | rights_blocked | contract_only | retired`. Rights
  cells come from `rightsClears(m.rights)` and `RightsRecord` fields (`copyrightStatus`, `activationGate`).
  These are configuration facts about the catalog, not user data.
- **Completion / abandonment / correction / rejection / recommendation / report** — counts over
  `HistoryEvent` types (`lib/cpv1/history.ts`): `method_completed`, `user_corrected`, `user_rejected`,
  `marked_helpful`, `marked_not_helpful`, `recommendation_outcome`. Aggregated by `methodId` +
  `methodVersion` only; `objectRef` and `safeDetail` are **never** surfaced. The live funnel view
  (`yorisou_migration_funnel`) supplies the guest→account completion counts.
- **Companion opt-in & memory scope** — distribution of `MethodConsent.companionUse` and of
  `PrivacyScope` (`device_local | account_private | companion_permitted | recommendation_permitted |
  public_safe`) from `lib/cpv1/understanding.ts`. Only the *scope distribution* is shown, never which
  observation belongs to whom.
- **Community safety** — the live `yorisou_review_queue_summary` view (grouped by `queue_type, status,
  severity`) plus the experience-card moderation states from `app/admin/experiences`.
- **Incidents / blockers** — the live `yorisou_service_incidents` table and
  `yorisou_service_readiness_overview` view (open incidents, high-severity open, open review items,
  failed migrations, `denied_admin_access_events`).

Backend access uses the existing service-role helpers in `lib/server/app2ServiceBackend.ts`
(`getReadinessOverview`, `getMigrationFunnel`, `getReviewQueueSummary`, `listOpenIncidents`,
`isApp2BackendConfigured`). New CPV1 panels add analogous **aggregate** RPC/view reads only. When the
backend is unconfigured, panels render a truthful empty/unconfigured state — never fabricated numbers.

---

## 4. Governance & prohibitions

- **Aggregate-only by default.** The surface has no route that returns a single user's answers, results,
  companion memory, reports, or raw consent record. There is no "search by user" box.
- **k-anonymity suppression.** Any aggregate cell below the threshold (`k`, default 5) is suppressed and
  counted in `suppressedCells` — never rendered as a near-unique value that could re-identify a person.
- **Least privilege.** Admin tables (`yorisou_admin_access_logs`, `yorisou_service_incidents`, review
  queue) grant `anon` and `authenticated` **nothing**; only `service_role` reads them, and only after
  `requireAdminViewer()` authorizes the viewer against `YORISOU_ADMIN_EMAILS`. Aggregate views are
  `security_invoker = true`, so they are unreachable except by service_role.
- **Append-only audit.** `yorisou_admin_access_logs` is immutable via the `..._no_mutate` trigger
  (`yorisou_app2_block_mutation`); it records **allowed AND denied** access. No admin action bypasses it.
- **No rights-blocked activation from here.** Panels 2–3 are read-only status. Flipping `founderActivated`
  / opening an `activationGate` for a public method is a separate, out-of-scope Founder action requiring
  rights clearance — never a one-click toggle on this dashboard. "Found online" is never a route.
- **No Digital Legacy activation.** Panel 11 shows config status only; public legacy activation is
  `LEGAL_BLOCKED` and out of scope for Preview.
- **No production/secrets/payment/migration** are performed by this surface. Preview/local only.
- **No persona taxonomy.** The surface never buckets users into fixed personas or a universal score.

Any future raw-scope access (should it ever be justified for a specific incident) is a distinct,
individually-logged, denied-by-default capability — not part of this contract.

---

## 5. Privacy / consent touchpoints

- **The log is the consent boundary for operators.** Every sensitive-scope touch calls
  `logAdminAccess({ actor, actorType, scope, action, safeObjectRef?, route?, allowed, outcome })`
  (`lib/server/app2ServiceBackend.ts` → RPC `log_yorisou_admin_access`). `safe_object_ref` carries an
  id/route only, **never** the raw object or PII (enforced by table comment + column limits).
- **User data rights are unaffected.** Nothing here weakens a person's `ALL_USER_DATA_RIGHTS`
  (`confirm/correct/reject/hide/forget/delete/export/revoke_downstream`, `lib/cpv1/consent.ts`). A
  deletion that propagates to derived understanding must also drop the deleted observation from any
  aggregate on recompute — aggregates are recomputed, never cached over forgotten data.
- **Downstream-use honesty.** Panels 6–7 report *distributions of opt-in state* (`companionUse`,
  `recommendationUse`, `canUseDownstream`), so the operator can see consent posture without reading any
  granted content.
- **Denied-access visibility.** `denied_admin_access_events` is itself a first-class metric, so attempts
  to over-reach are observable to the Founder.

---

## 6. Acceptance criteria

1. Every panel returns an `AdminAggregatePanel`; no route returns a user-identifiable row. A test asserts
   the response shape contains only aggregate cells and provenance `sourceRefs`.
2. Method panels (1–3) are computed **only** from `CPV1_METHOD_UNIVERSE` via `methodActivationState`,
   `rightsClears`, `methodPublicallyActivatable`; a rights-blocked or contract-only method never shows as
   `public_active`.
3. Cells below `k` are suppressed and reflected in `suppressedCells`; a test with a low-count fixture
   confirms suppression.
4. Access to any panel is gated by `requireAdminViewer()`; unauthenticated/non-admin viewers get no data
   and the attempt is logged with `allowed:false`.
5. Every sensitive read writes exactly one `yorisou_admin_access_logs` row via `logAdminAccess`; the log
   row contains no raw payload; mutation/delete of the log is rejected by the append-only trigger.
6. With the backend unconfigured (`isApp2BackendConfigured() === false`), panels render a truthful
   empty state and never fabricate counts.
7. Panels 11 (legacy) render status only and expose no activation control; a test asserts no activation
   mutation is reachable from the surface.
8. `robots: { index: false, follow: false }` and `dynamic = "force-dynamic"` on every admin route, as on
   the existing APP-2 admin pages.

---

## 7. Open blockers

- **`RIGHTS_BLOCKED`** — Panel 2/3 numbers are meaningful only once real rights records are reviewed;
  until a human reviewer + evidence + open `activationGate` exist, methods correctly read as blocked.
- **`LEGAL_BLOCKED`** — Panel 11 (Digital Legacy config) cannot move past status display; public legacy
  activation requires legal clearance not in scope for Preview.
- **`ARCHITECTURE_CPV1`** — Panel 10 (archive readiness) depends on the WS-K archive contract being
  defined before its aggregate can be computed; currently architecture-only.
- **`FOUNDER_GATED`** — Threshold `k`, the admin email allowlist (`YORISOU_ADMIN_EMAILS`), and any
  future incident-specific raw-scope capability all require an explicit Founder decision + log entry.
- **`CONTRACT_CPV1`** — Nine of the twelve panels are contracts, not implementations; the aggregate
  RPC/view reads for the CPV1-specific panels are unbuilt. Planning is not completion.
