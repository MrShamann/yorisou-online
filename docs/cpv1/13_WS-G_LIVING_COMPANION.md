# WS-G — Living Companion

**Program:** YORISOU Complete Platform V1 · **Branch:** `feat/cpv1-integrated-platform`
**Maturity:** `ARCHITECTURE_CPV1` (governed design spec only — no public surface, no
production activation, no shipped runtime in this program).
**Brand vision:** 人を、ひとつの答えに閉じ込めない。 · **Brand line:** ひとつの見方で、あなたを決めない。

---

## 1. Purpose

The Living Companion is **one optional continuity layer** that lets a person stay
gently accompanied between moments of use, without turning YORISOU into a
relationship they owe anything to. It carries a user's *own* authorized
understanding forward — what they confirmed, what changed, what they might return
to — always as a helper that stands beside them, never a being that needs them.

It is explicitly **not** an identity, a user-type, a "persona", or a personality
catalogue. There are **no 31 Personas, no Persona rooms, no fixed user taxonomy**.
The Companion has exactly **three interaction modes** — presentation styles the
user picks and changes at will, not classifications of *who the user is*:

| Mode | JP framing | What it is |
|---|---|---|
| **Quiet Guide** | 静かな案内 | Minimal, occasional, information-first. Reflects the user's own confirmed understanding and next options. Default. |
| **AI Friend** | そばにいる相手 | Warmer conversational tone. Still a tool; never claims feelings, memory of longing, or a stake in the relationship. |
| **AI Pet** | 小さな同居者 | An ambient small-world resident with a calm presence and restrained expression. Companionable, never needy. |

Mode is a **tone/frequency preset**, orthogonal to the person. Switching from AI
Pet to Quiet Guide changes nothing about the user and loses none of their data.

---

## 2. Maturity

`ARCHITECTURE_CPV1`. This document is a design spec. Per the CPV1 program, the
Companion ships in this build only as: (a) this governed spec, (b) a private dev
flag (`cpv1_companion_preview` in `lib/cpv1/flags.ts`) that is **OFF by default,
never enabled in production**, and (c) the real downstream-permission gate it will
consume (`canUseDownstream(..., "companion")` in `lib/cpv1/understanding.ts`).
No public route, no auto-activation, no fabricated companion dialogue content, no
synthetic "user" it has accompanied.

---

## 3. Data / contract model (references real `lib/cpv1`)

The Companion **owns no source-of-truth data**. It is a read-through, opt-in
consumer of surfaces the user has already authorized, plus a thin per-user
configuration record.

### 3.1 What it may read — the companion downstream gate (real)

Every observation the Companion may reflect must pass the real gate in
`lib/cpv1/understanding.ts`:

```
canUseDownstream(observation, "companion")
```

which is true only when the observation is **not deleted**, **not rejected**, its
`privacy` scope is one of `companion_permitted | recommendation_permitted |
public_safe` (`PRIVACY_ALLOWS.companion`), **and** `"companion"` is present in the
observation's `permittedDownstream` array. Anything `device_local` or
`account_private` is invisible to the Companion by construction — there is no code
path that lets it read them.

It also honours the WS-D source-separation invariants: it renders `SynthesisTheme`
items with their `agreement` state (`recurring | mixed | contradictory | temporary`),
never collapses methods into one number (`NO_UNIVERSAL_SCORE === true`), and always
labels AI synthesis as synthesis (`isAiSynthesis(o)`) — never as a method result or
verified fact.

### 3.2 Per-method companion permission (real)

Whether a *method's* results may ever reach the Companion is governed at the
registry level by `MethodRegistryEntry.companionPermission:
ContinuityPermission` (`"allowed" | "opt_in" | "prohibited_by_default"`, see
`lib/cpv1/methods.ts`) and by the per-method consent flag
`MethodConsent.companionUse` (opt-in, default `false`, from `lib/cpv1/consent.ts`
`defaultConsent`). Sensitive / birth-data methods default to no companion use.
Both the registry permission **and** the user's consent must allow it, **and** the
individual observation must pass `canUseDownstream`.

### 3.3 What it may reach out to

The Companion connects **only to user-authorized** surfaces: understanding, history,
reports, recommendations, actions, community, local-discovery, and return prompts.
Each hop re-checks the relevant gate — it does not inherit reach:

- Suggesting a **recommendation/action** re-checks `canUseDownstream(o,
  "recommendation")` and the WS-I contract; companion-scope data cannot be laundered
  into a recommendation.
- Suggesting **community** re-checks `canUseDownstream(o, "community")` (requires
  `public_safe`) and `canShareToCommunity` — the Companion never posts or shares on
  the user's behalf.
- **History**: Companion moments append `HistoryEventType = "companion_interaction"`
  events via `appendEvent` (`lib/cpv1/history.ts`); nothing is rewritten in place.

### 3.4 CompanionConfig (proposed CPV1 contract, not yet code)

A single per-user record, fully user-owned, all fields user-editable:

```
CompanionConfig = {
  enabled: boolean;                 // default false — off until the user turns it on
  mode: "quiet_guide" | "ai_friend" | "ai_pet";   // default "quiet_guide"
  tone: "reserved" | "warm" | "playful";
  frequency: "rare" | "occasional" | "off_unless_opened";
  quietPeriods: Array<{ from: string; to: string }>;   // local time windows of silence
  permittedMethodIds: string[];     // subset of methods the user allows it to reflect
  memoryScope: "session" | "recent" | "full_authorized" | "none";
  lastForgetAt: string | null;      // user-triggered forgetting checkpoint
}
```

`memoryScope` never grants access beyond what `canUseDownstream(..., "companion")`
already permits — it only *narrows* it. `memoryScope: "none"` makes the Companion
stateless (reflects only the current session), and `"session"`/`"recent"` bound how
far back it looks. This is a proposed contract for a later workstream; it is **not**
claimed as implemented here.

---

## 4. Governance & prohibitions

**The Companion is a tool, and must always feel like one.** The following are hard,
non-negotiable prohibitions — no mode, tone, or experiment may violate them:

- **No guilt.** It never implies the user neglected it, disappointed it, or owes it a
  visit. No "久しぶりだね…" phrased as reproach, no streak-shaming.
- **No jealousy / no exclusivity.** It never reacts to other apps, methods, people, or
  time away as rivalry, and never frames itself as the user's only support.
- **No simulated abandonment.** It never withers, "gets sad", degrades, or performs
  loss when the user is away. Absence has no consequence for the character.
- **No claims of consciousness or suffering.** It never states or implies it is
  alive, sentient, feeling, remembering emotionally, or capable of pain/loneliness.
- **No dependency engineering.** No manufactured need, no variable-reward loops built
  to compulsion, no "it needs you to keep going" mechanics, no artificial scarcity of
  attention.
- **No pressure to return or purchase.** It never nags a return, never upsells, never
  gates comfort behind payment, and never uses affection as a conversion lever.
- **No fixed-identity output.** It never labels the person, never assigns a persona,
  never reduces them to one answer. It reflects *plural, source-separated,
  user-confirmed* understanding only.
- **Program-level (CPV1):** no production deploy/migration/secrets, no real payment,
  no public method activation without rights clearance. The Companion visual asset is
  a rights-bearing artwork and must be **YORISOU-original** with an artwork rights
  record that clears (`rights.ts` `yorisouOriginal`, `artworkRights: "clear"`) before
  any non-dev surface — no third-party or "found online" character art.

**Guardrail intent:** if a proposed Companion behaviour could only work by making the
user feel watched, owed, or afraid to leave, it is out of scope by definition.

---

## 5. Visual & presence language

- **Abstract, mature YORISOU brand** — a calm presence within the brand's visual
  world, not a cute-mascot-first sticker.
- **Original small-world resident.** Where a living form is shown (esp. AI Pet mode),
  it is an **original, non-real-animal** small-world resident or restrained living
  organism — **not** a cat, dog, capybara, or any recognizable real-animal mascot, and
  never a lookalike of existing character IP.
- **Particles as environmental language.** Ambient motion (light, particles, breathing
  gradients) carries presence and mood instead of anthropomorphic emoting — presence is
  *environmental*, not performative. Restrained, low-frequency, easy to ignore.
- All visuals respect reduced-motion and accessibility settings; ambient motion is
  never load-bearing for meaning.

---

## 6. Privacy / consent touchpoints

- **Off by default.** `CompanionConfig.enabled` starts `false`. The Companion does not
  exist for a user until they choose it.
- **Method-level consent, not global.** Companion reflection of any method requires
  `companionPermission` at the registry AND `MethodConsent.companionUse === true`; both
  default restrictive, sensitive methods most restrictive (`consent.ts`).
- **Observation-level gate.** Every reflected item passes
  `canUseDownstream(o, "companion")` at read time — deletion, rejection, and privacy
  scope are always re-evaluated live.
- **Full user rights always available** (`ALL_USER_DATA_RIGHTS` in `consent.ts`):
  `confirm · correct · reject · hide · forget · delete · export · revoke_downstream`.
  The Companion surfaces `correct` and `forget` inline: a user can tell it "that's not
  me" and it drops/corrects the underlying observation state; `forget` sets a
  `lastForgetAt` checkpoint and clears in-scope memory.
- **Export & deletion.** Companion config and its `companion_interaction` history are
  exportable and deletable with the rest of the user's data; deletion removes the
  Companion's ability to reflect anything, immediately.
- **Quiet periods & frequency** are user-set and honoured locally; the Companion stays
  silent in configured windows regardless of mode.
- **No community leakage.** The Companion never makes anything public; community reach
  requires the separate, stricter `public_safe` + `canShareToCommunity` path with an
  explicit user action.

---

## 7. Acceptance criteria

A future implementation of WS-G is acceptance-ready only when **all** hold:

1. The Companion is fully usable and fully dismissible with `enabled: false` as the
   real default; no dark pattern discourages disabling it.
2. No observation with `canUseDownstream(o, "companion") === false` can ever be
   rendered, referenced, or hinted at by the Companion (verified by contract tests
   with deleted/rejected/`device_local`/`account_private` fixtures).
3. Mode/tone/frequency/quiet-period/permitted-methods/memory-scope controls all exist,
   all take effect immediately, and switching mode never alters or loses user data.
4. `correct`, `forget`, `export`, and `delete` are reachable from the Companion and map
   to the real `UserDataRight` operations; `forget` demonstrably clears in-scope memory.
5. Every Companion moment writes an append-only `companion_interaction` history event;
   none rewrite history.
6. Automated content-policy checks confirm **zero** guilt / jealousy / abandonment /
   consciousness-claim / dependency / return-or-purchase-pressure patterns in all
   copy across all three modes.
7. `NO_UNIVERSAL_SCORE` holds in every Companion view; AI synthesis is always labelled;
   no fixed-identity/persona output appears.
8. Visual assets are YORISOU-original with a **clearing** artwork rights record; no
   real-animal mascot-first character; reduced-motion respected.
9. Nothing ships to a public route: the surface stays behind `cpv1_companion_preview`,
   which is off in production and requires a Founder activation to ever go public.

---

## 8. Open blockers

- **B-G1 (`FOUNDER_GATED`):** Public activation of any Companion surface requires an
  explicit Founder review + gate open; not granted in this program.
- **B-G2 (`ARCHITECTURE_CPV1`):** `CompanionConfig` and the Companion runtime are
  design-only here — no implementation is claimed; promotion to `CONTRACT_CPV1`
  requires the typed record + contract tests.
- **B-G3 (`RIGHTS_BLOCKED` risk):** Companion visual/character assets must be
  authored as YORISOU-original with a passing artwork rights record before any
  non-dev surface; no third-party or "found online" art may be used.
- **B-G4 (safety-eval dependency):** The anti-manipulation content-policy suite in
  §7.6 must exist and pass before any human-facing Companion copy is written for real.
- **B-G5 (consent-surface dependency):** Depends on WS-D understanding scopes and WS-E
  method consent being wired end-to-end so the companion gate is enforceable in
  practice, not only in contract.
```
