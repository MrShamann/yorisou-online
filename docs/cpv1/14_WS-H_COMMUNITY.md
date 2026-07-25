# WS-H — Community (Structured Surfaces)

**Program:** YORISOU Complete Platform V1 (CPV1) · **Branch:** `feat/cpv1-integrated-platform`
**Maturity (this workstream):** `ARCHITECTURE_CPV1` — governed design spec only. No public
community surface ships in this program. Preview-only behind the `cpv1_community_preview`
dev flag (`lib/cpv1/flags.ts`), never in production, never for an anonymous public visitor.

Brand vision: **人を、ひとつの答えに閉じ込めない。** Brand line: **ひとつの見方で、あなたを決めない。**
Community must express this: it connects people around *states and interests over time*, never
around a fixed identity, a Persona, a rank, or a follower count.

---

## 1. Purpose

Give the integrated loop (`… → Companion → community → recommendation & action → …`) a
**structured, finite, consent-gated** social layer. Community exists so a person can, when they
choose, stand next to others in a similar *moment* or *interest* — not to be scored, ranked,
followed, or farmed for engagement.

In-scope structured surfaces (all design-only in CPV1):

- **Temporary state spaces** — 一時的な状態スペース. Ephemeral rooms keyed to a current state
  (e.g. 「今、気持ちを整理したい」), auto-expiring; no permanent membership.
- **Method-interest spaces** — 方法・関心スペース. Grouped by an *interest in a way of seeing*,
  not by a result value. A space never publishes a member's method outcome.
- **Goal circles** — 目標サークル. Small, purpose-scoped, time-boxed groups working toward a
  stated goal; dissolve when the goal window closes.
- **Structured experience cards** — 体験カード. Editorial/curated single-purpose prompts a person
  can pick up, do, and put down. Clearly labelled by content source (§5).
- **Finite guided challenges** — 有限のガイド付きチャレンジ. Fixed-length (e.g. 7-day) guided
  sequences with a defined start and end. No streak-punishment, no infinite ladder.
- **Invite-only groups** — 招待制グループ. Private groups formed by explicit invitation only.
- **Local discovery** — ローカル発見. Opt-in, coarse, consented locality surfacing of spaces or
  events. Never raw location; only derived/minimized locality (mirrors `rawLocationMinimized`
  in `lib/cpv1/consent.ts`).

Every surface is a *place you enter and leave*, not a *feed you are retained inside*.

---

## 2. Maturity

| Capability | Maturity | Note |
|---|---|---|
| Community surface set (all above) | `ARCHITECTURE_CPV1` | Design only; no public route. |
| Consent gate `canShareToCommunity` | `CONTRACT_CPV1` | Real code in `lib/cpv1/consent.ts`. |
| Downstream gate `canUseDownstream(o,"community")` | `CONTRACT_CPV1` | Real code in `lib/cpv1/understanding.ts`. |
| Method `communityPermission` | `CONTRACT_CPV1` | Real field in `lib/cpv1/methods.ts`. |
| `community_participation` history event | `CONTRACT_CPV1` | Real type in `lib/cpv1/history.ts`. |
| Content-source labelling taxonomy (§5) | `ARCHITECTURE_CPV1` | Design proposal; not yet code. |
| Any real user-generated community content | not present | No real users, posts, or activity. |

Nothing here is presented as public, functional, or "coming soon".

---

## 3. Data / contract model (references real `lib/cpv1`)

Community is a *consumer* of contracts that already exist — it introduces **no new sharing
path** that bypasses them. A contribution reaches a community surface only when **all three**
real gates pass, in this order:

1. **Method permits it.** `MethodRegistryEntry.communityPermission` (`lib/cpv1/methods.ts`) is
   `ContinuityPermission` = `"allowed" | "opt_in" | "prohibited_by_default"`. Default posture for
   sensitive/traditional families is `prohibited_by_default`; the method itself must allow community use.

2. **User consent permits it.** `canShareToCommunity(c: MethodConsent)` in `lib/cpv1/consent.ts`
   returns `c.communityUse === true && c.saveAcknowledged === true`. `communityUse` defaults to
   `false` in `defaultConsent(...)` and must stay false unless the user explicitly enables it.

3. **The specific observation is public-safe.** `canUseDownstream(o, "community")` in
   `lib/cpv1/understanding.ts` requires `o.privacy === "public_safe"` (community is in
   `PRIVACY_ALLOWS.community = Set(["public_safe"])`), `"community" ∈ o.permittedDownstream`,
   `!o.deleted`, and `o.confirmation !== "rejected"`.

```
shareToCommunity(observation, consent, method) :=
    method.communityPermission !== "prohibited_by_default"
    && canShareToCommunity(consent)                 // consent.ts
    && canUseDownstream(observation, "community")   // understanding.ts (public_safe)
```

Design-only additions (this spec, `ARCHITECTURE_CPV1` — **not** yet in `lib/cpv1`):

- **Space** — `{ id, kind, title, opensAt, closesAt|null, invitedOnly, localityDerived|null }`.
  Temporary/finite kinds MUST carry a real `closesAt`; there is no permanent-room kind.
- **ContentSourceLabel** (§5) attached to every rendered card/post.
- History: participation is recorded via the real `community_participation` event type
  (`lib/cpv1/history.ts`, `appendEvent`) — append-only, safe-detail only, no raw content.

No universal score is ever computed for community (`NO_UNIVERSAL_SCORE`,
`lib/cpv1/understanding.ts`). A space is never ordered by a member's result value.

---

## 4. Governance & prohibitions

**Explicitly forbidden to build (structural, not cosmetic):**

- **Permanent Persona rooms** — no 31 Personas, no Persona rooms, no fixed user taxonomy.
  Spaces are state/interest/goal-scoped and time-bounded, never identity-scoped.
- **Follower competition / popularity rankings / leaderboards** — no follower counts, no
  ranks, no "top members", no visible engagement scores.
- **Infinite-feed dependency** — no endless scroll, no algorithmic retention loop, no
  auto-refreshing timeline. Surfaces are finite and enterable/leaveable.
- **Unrestricted DMs** — no open direct-message graph. Contact is scoped to invite-only
  groups or explicit, revocable, consented connections; strangers cannot DM by default.
- **Fabricated social proof** — no fake activity, fake users, fake posts, fake member counts,
  fake testimonials, seeded "warm start" data presented as real. Synthetic fixtures may exist
  ONLY in tests/evidence and are never rendered as real community activity (§CPV1 §21).

**Required truthful states:** every surface MUST have honest empty and low-activity states.
Examples (editorial copy, not live data):

- Empty space: 「まだ誰もいません。あなたが最初のひとりです。」
- Low activity: 「今は静かです。無理に人を集めていません。」

Member counts, when shown, are exact and real or absent — never inflated, never "500+".

**Rights posture.** Any community surface that would surface third-party method output,
artwork, instrument text, or branded terminology inherits the rights gate (`lib/cpv1/rights.ts`,
CPV1 §2). Rights-incomplete method content is `RIGHTS_BLOCKED` and cannot appear in community —
not even as a "coming soon" card. Community may only carry method material whose
`RightsRecord` `rightsClears(...)` AND whose method is Founder-activated.

---

## 5. Content-source distinction (mandatory labelling)

Every community item MUST be labelled, visibly, with exactly one source class so users can tell
who/what produced it. This taxonomy is `ARCHITECTURE_CPV1` (design) and aligns with the real
`SourceClass` model in `lib/cpv1/understanding.ts`:

| Label | Meaning | Grounding |
|---|---|---|
| `real_user` | A real person's consented, public-safe contribution | gated by §3 triad |
| `editorial` | YORISOU-authored curated content (experience cards, prompts) | `yorisou_original` rights |
| `ai_assisted` | AI-synthesised/summarised text | must map to `ai_synthesis` (`isAiSynthesis`), never shown as fact or method output |
| `public_resource` | Cited external public-domain / licensed resource | requires a cleared `RightsRecord` |
| `commercial` | Sponsored/partner/commercial content | must be labelled 広告/PR; never disguised as user content |
| `internal_test` | Synthetic fixture / dev-preview seed | dev-flag only; NEVER rendered on any public route |

Rules: AI-assisted content is always a distinct, labelled class and never presented as a method
result or verified fact. `internal_test` content is barred from public routes by construction —
it exists only under `cpv1_community_preview` (`isDevPreviewContext()`). Commercial content is
never mixed indistinguishably into a `real_user` stream.

---

## 6. Privacy / consent touchpoints

- **Default-off.** `communityUse` is `false` by `defaultConsent(...)`; sensitive families
  (`chinese_traditional`, `western_symbolic`) additionally default to `session_only` retention,
  so nothing about them can be community-shared until the user both saves and opts in.
- **Per-method, not global.** Consent is per method (`MethodConsent.methodId`). Enabling
  community for one method never enables it for another.
- **Public-safe is the only door.** Only `PrivacyScope = "public_safe"` observations are ever
  eligible (`PRIVACY_ALLOWS.community`). `device_local` / `account_private` /
  `companion_permitted` / `recommendation_permitted` content can NEVER reach community.
- **Locality minimized.** Local discovery uses only derived/minimized locality
  (`rawLocationMinimized`, `derivedProvenance`); raw location is never stored or surfaced.
- **Full user rights persist downstream.** `ALL_USER_DATA_RIGHTS` (`confirm, correct, reject,
  hide, forget, delete, export, revoke_downstream`) apply to anything shared. `revoke_downstream`
  MUST retract a contribution from every community surface; `delete` removes it; `hide` unlists it.
- **Revocation is real.** Turning `communityUse` back to `false`, rejecting an observation, or
  deleting it immediately fails the §3 triad and removes eligibility going forward.
- **Auditable participation.** Joining/contributing appends a `community_participation` event
  (`lib/cpv1/history.ts`) with safe detail only — no raw content in the log.

---

## 7. Acceptance criteria

1. No permanent room, no Persona room, no follower/rank/leaderboard, no infinite feed, no open
   DM graph exists in the design or any preview surface.
2. A contribution renders in community **only** when the §3 triad passes; a unit contract test
   proves each gate independently blocks (`communityPermission = prohibited_by_default`,
   `communityUse = false`, `saveAcknowledged = false`, `privacy ≠ public_safe`,
   `"community" ∉ permittedDownstream`, `confirmation = "rejected"`, `deleted = true`).
3. `revoke_downstream` / `delete` / `hide` on a shared item is proven to remove it from every
   community surface (retraction test).
4. Every rendered item carries exactly one §5 source label; `ai_assisted` maps to
   `ai_synthesis`; `internal_test` never appears on a public route.
5. Truthful empty and low-activity states are present for every surface; member counts are exact
   or absent; no synthetic activity is presented as real.
6. All community surfaces are gated behind `cpv1_community_preview` and off in production
   (`isDevFlagOn`, `isDevPreviewContext` return the safe default).
7. No rights-blocked method content appears anywhere in community (rights-gate test).
8. No new sharing path bypasses `lib/cpv1` contracts — community is a pure consumer of them.

---

## 8. Open blockers

- **`RIGHTS_BLOCKED`** — surfacing any external/traditional method material in community is
  blocked until that method's `RightsRecord` clears and it is Founder-activated. No fabricated
  method content substitutes for it.
- **`ARCHITECTURE_CPV1`** — no community backend, moderation model, or persistence schema is
  built in CPV1. Trust & safety (reporting, moderation, abuse handling, minor-safety, and legal
  content review) is a required precondition for any real activation and is **out of scope** here.
- **`FOUNDER_GATED`** — real community launch (real users, real UGC) requires explicit Founder
  activation plus a completed T&S + privacy review; it cannot be turned on inside this program.
- **Design-only labelling** — the §5 `ContentSourceLabel` taxonomy and `Space` types are not yet
  in `lib/cpv1`; they must be implemented and contract-tested before any preview beyond design.
