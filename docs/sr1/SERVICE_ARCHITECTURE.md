# SR-1 — Stranger-Ready Service Architecture (canonical)

The canonical anonymous-first service system that turns YORISOU from a set of
pages into one continuous service. This is the SR-1 architecture of record.

## The canonical first-time journey (§7)
`Arrive → Choose current need → Receive a suitable entry → Provide minimal input
→ Receive current-state understanding → Receive a personalized support plan →
Choose one useful next step → Save / try / reflect → Return`

A visitor never needs to understand YORISOU's internal architecture to proceed.

## Components

### 1. Service router — `/start` (`app/start/`)
Begins from **ordinary needs** (`SERVICE_NEEDS`, 7 items) → minimal pace/returning
signal → `routeService()` (pure, deterministic, `lib/sr1/serviceRouter.ts`) →
one primary destination + alternatives, each explaining **why / how long / what
you receive / data-stays-on-device / login-optional**. No opaque classifier; no
login required to reach real value. The homepage hero + global header primary CTA
route here.

### 2. Guest journey continuity — `lib/sr1/guestJourney.ts` (+ `useGuestJourney`)
One public-safe device-local model (need, route, pace, returning, last public
result, saved/tried/hidden ids, coarse feedback, return path, consent). Built on
the RTR-1 `saveState` pattern; additive. Persistence truth via
`PERSISTENCE_SCOPE_LABEL`. Clearable in one action.

### 3. Personalized Support Plan — `lib/sr1/supportPlan.ts` (+ `SupportPlanView`)
Deterministic `buildSupportPlan(input)` → what we understood / one primary "help
now" / prioritized "help next" / why these / controls. Public-safe; reuses the
governed catalogue. Rendered on `/result` (imairo) with an anonymous device-local
save; reachable for every family via `/my-yorisou`.

### 4. Personal Support Home — `/my-yorisou` (`app/my-yorisou/`)
The continuing centre: current state · what matters now · one suggested next step
· continue exploring · saved & tried · return & control. Works anonymously from
device-local state; honest empty state for first-time visitors. Not a marketing
page.

### 5. Service catalogue — `app/data/sr1/serviceCatalogue.ts`
One governed support-item model (real internal routes only; typed by
small_action / reflection / report / guided_experience / public_resource /
return_action; each with why-it-may-fit, availability, privacy scope, review
state). No fabricated suppliers/products/events.

### 6. Guided experiences — `/experiences/guided/[slug]` (`app/experiences/guided/`)
Anonymous, completable, device-local reflection experiences (3 shipped:
grounding-reflection, relationship-breath, work-reset). Start → step → complete →
reflect → feedback → save/return. Honest non-diagnosis boundary. Distinct from
the authenticated experience-cards hub at `/experiences`.

### 7. Recovery system — `app/components/sr1/ServiceStates.tsx`
`ServiceEmptyState` / `ServiceRecoveryBlock` — plain-language, safe next action,
return path, no stack traces. Applied to `/recommendations` (no-result first
visit) and `/private-state` (401 → login), and reusable elsewhere.

## Boundaries preserved
- Public/private: the first result is public-safe; deeper interpretation +
  private notes + recommendation records stay private (unchanged).
- Current vs prototype honestly labeled; no "coming soon" vagueness in the core
  journey; fabricated locked content removed from `/reports/sample`.
- No production migration, no production secrets, no supplier self-service, no
  payments (SR-1 scope). Server-backed journeys degrade to honest recovery.

## Surface registration
`/start`, `/my-yorisou`, and `/experiences/guided/*` render on the dark product
surface (`app/lib/publicSurface.ts` — immersive family), so the shared header/
footer tone and design system are coherent with the rest of the product.
