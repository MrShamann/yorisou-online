# CORP-P5 — Legacy consumer site: migration options

**Nothing in this document is implemented.** The legacy Yorisou consumer product is intact on this
branch and unchanged on Production.

## Current state on the Preview branch

- `/` and the five corporate routes render the corporate site.
- **Every legacy consumer route still works** — verified: `/notice`, `/tests` and the rest return 200
  with their own behaviour and their own metadata.
- The **root layout metadata** changed on this branch only, from the consumer product identity to the
  corporate one. Consumer routes that define their own metadata are unaffected; only the site-level
  fallback changed. **Production still serves the old value.**

## What Production still serves

`main @ b5521141` — the standalone consumer site, with the consumer root identity. Untouched.

## Options for the eventual cutover (Founder decision, not taken here)

| | Option | What it costs |
|---|---|---|
| A | **Corporate at `/`, consumer moved to a subpath** (e.g. `/app`) | Cleanest public story. Breaks every existing consumer deep link unless redirects are written; those links are in LINE messages and saved results we cannot edit |
| B | **Corporate at `/`, consumer left exactly where it is** (current Preview behaviour) | No consumer link breaks. Two products share one namespace, and the route table stays mixed — which is what forced the crawl-policy work in CORP-P4AR1/R2 |
| C | **Corporate on a separate domain**, consumer keeps `yorisou.online` | Strongest separation, and it decouples the corporate release from the consumer product entirely. Needs a domain decision and new DNS |
| D | **Retire the consumer product**, corporate only | Do not choose this without an explicit decision: it destroys historical product capability and any saved user artefacts |

**Recommended for decision, not enacted:** C if a corporate domain is acceptable, otherwise B until
the route-group separation (CORP-P4B D-2) lands and makes A safe.

## Coupled items

- **Root-layout metadata cutover** belongs to whichever option is chosen; it must not be shipped to
  Production on its own.
- **The corporate routes still load the legacy global CSS bundle**, which is the measured cause of
  the Preview's LCP miss (`unused-css-rules` ≈ 530ms). Separating them is the route-group refactor
  already recorded as CORP-P4B D-2.
- **Dynamic 404** remains `CORP_P4AR2R1_FRAMEWORK_BLOCKED` and is untouched.
