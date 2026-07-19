# AIX-5 — Experience Architecture (binding)

The core product architecture is the **loop**, not the check:

`Understand → Remember → Recommend → Try → Reflect → Adapt → Return`

## Layers

### Input signals (permissioned, explicit)
Check answers · explicit preferences/choices · saved interests · feedback
(useful / tried / not-for-me) · stated needs · changes over time. All
user-initiated; nothing inferred about private facts without the user's action.

### Understanding layer
Reads the user's **current state** (not a fixed type): needs, pace, context,
distance/relationship signals, work-life rhythm. Produces a public-safe
current-state result + private, deeper interpretation kept for the user.

### Continuity layer (user-controlled)
Save results/intentions (device-local + optional account); return paths; private
history; LINE continuity where chosen. The user decides what is remembered; can
clear it anytime.

### Recommendation & support layer
Turns understanding into explained, optional next steps: information, reports,
actions, experiences, places, public resources, services, qualified products,
optional human/local connection. Placement is never for sale; every suggestion
shows *why it is shown*; the user can decline.

### Feedback / learning loop
Outcome signals (useful / tried / save / revisit / not-for-me / feedback /
optional prototype participation) refine future understanding + recommendations,
with permission. This is the "Reflect → Adapt" of the loop.

## Six user-facing domains — one system, not categories

Each domain is a stage of the same personalized loop; each depends on
understanding and hands off to the next.

| # | Domain | The user receives | Depends on understanding | Hands off to | Entry |
|---|--------|-------------------|--------------------------|--------------|-------|
| 1 | 理解する (Understand) | a calm read of the current state | — (the entry) | 残す・戻る / 見つける | `/tests`, `/check-in` |
| 2 | 残す・戻る (Remember/Return) | saved result + return path | current state to remember | 見つける / 深める | `/saved`, `/private-state` |
| 3 | 見つける (Discover) | explained, optional next steps | current state → relevance | 深める / つながる | `/recommendations` |
| 4 | 深める (Deepen) | a fuller report reading | the result to deepen | 見つける / つながる | `/reports` |
| 5 | つながる (Connect) | low-pressure experiences | state + preferences | 育てる (feedback) | `/experiences` |
| 6 | 育てる (Improve/Co-design) | shape what comes next | outcome signals | back to 見つける | `/co-design` |

## Partner pathway (separate)

Providers/makers reach people **by current-state fit, not by ads**; ranking
cannot be bought; no public listings/checkout/pre-sales. Kept visually and
narratively separate from the individual product. Entry: `/partners`.

## Boundaries

- **Public / private:** the first result is public-safe; deeper interpretation +
  private notes + recommendation records stay private. Share carries only
  public-safe fields.
- **Current / prototype / planned:** いま使える = 理解する / 残す・戻る / 見つける /
  深める; プロトタイプ = つながる / 育てる. Copy is honest about which is which; no
  "coming soon" vagueness, no claiming unfinished capability as operational.
- **AI role (per ai-native-product-architect):** the AI reads *dynamic current
  state* (not a static snapshot), presents results as a soft current-state
  interpretation with honest confidence (no numbers, no determinism), anchors
  recommendations in *why-shown* evidence, keeps every action reversible and
  user-initiated, and never presents inference as a medical/legal/official
  conclusion. Memory is consented and user-clearable. No autonomous action on
  the user's behalf; no chatbot-only surface.
