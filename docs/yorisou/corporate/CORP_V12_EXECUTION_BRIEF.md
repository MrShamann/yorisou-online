# CORP-v1.2 — execution brief

**Package:** YORISOU-CORP-v1.2 — corporate website refoundation / final Preview candidate
**Date:** 2026-08-30 · **Branch:** `product/corporate-p5r2-global-site` · **PR:** #156 (Draft)
**Base HEAD at start:** `0e4b2a391d7fcd1da6ced4120cc8e81a3eba5d8a`

## Objective

Turn the existing CORP-P5R2 corporate site into a launch-grade Preview candidate aligned to the
ratified YORISOU v1.2 governance model: YORISOU LLC operating as **Yorisou Foundry** — finding
structural problems, building evidence and venture assets, forming founder-grade teams, and carrying
venture-ready projects toward independently governed companies.

The end state is a **Founder-reviewable Preview candidate**, not a Production launch.

## Scope

- Governance: a branch-scoped dual-surface repository ADR.
- Information architecture: six primary destinations (Home, Ventures, How We Build, Build With Us,
  Company, Contact) plus three venture detail pages.
- Content: refound the corporate narrative on the Foundry model; add **Chigamo** as the third venture.
- Asterion: present it as **independent shared infrastructure**, inside "How We Build" — never a
  venture, never owned, never a "powered by" badge.
- Localisation: preserve the existing 21-locale registry architecture and extend it to the new IA.
- Guards: a corporate claim guard, plus the existing token, locale-completeness and mailbox guards.
- Validation: routes × locales, accessibility, responsive, performance, consumer non-regression.

## Authority

Authorized: repository analysis, local implementation, tests, commits, push to the existing corporate
PR branch, Vercel Preview through the existing workflow, and updating the Draft PR and evidence docs.

## Exclusions — none of these was performed

Merging PR #156 · pushing to `main` · Production deployment · Production database mutation ·
DNS/domain change · Vercel Production promotion · consumer-data migration · consumer
assessment/scoring change · LINE behaviour change · secret creation or rotation · Resend or domain
configuration · payments · external email or contact · legal execution of an Asterion licence ·
government or university submissions · equity or financing actions.

## Initial state, verified at preflight

| Fact | Expected | Observed |
|---|---|---|
| Canonical worktree | `/Volumes/AI-Work/Projects/yorisou-online` | Matches; `/Users/yangjin/Projects/yorisou-online` is a symlink to it |
| Branch | `product/corporate-p5r2-global-site` | Matches |
| HEAD | `0e4b2a39…` | Matches |
| `origin/main` | `b5521141…` | Matches |
| Working tree | clean apart from protected files | Only `ASTERION_CAPABILITY_EXPORT.md` and `YORISOU_METHODOLOGY_RUNTIME_TRUTH_TABLE_2026-07-19.md`, both untracked and untouched |
| PR #156 | OPEN, DRAFT, base `main`, not merged | Matches |
| Writer lock | — | Was `NONE`; acquired for CORP-v1.2 |
| `PROJECT_START_HERE.md` | legacy consumer framing | Confirmed — still declares a single authoritative consumer product. This is the conflict the ADR addresses. |
| `PROJECT_MANIFEST.yaml` | `yorisou-online`, Claude Code, PAUSED, Vercel | Matches |

### Divergence from the expected state

**Chigamo has no canonical source.** There is no `chigamo` repository on disk, no entry in the
project registry, and no reference in this repository. It is therefore published **only** as the
public-safe thesis supplied in the execution package, explicitly at concept stage, with no product,
users or municipal programme implied. Anything stronger needs a real source.

## Decisions taken inside the boundaries

1. **Venture URLs kept at top level.** `/mirai-move` and `/kakari` are anchored crawlable paths in
   `robots.ts` (CORP-P4AR2). Moving them under `/ventures/` would break an accepted policy for
   cosmetic tidiness. `/ventures` is an index; the ventures keep their URLs.
2. **`/about` keeps its URL and changes its label** to "how we build", for the same reason.
3. **Navigation labels reuse section eyebrows** rather than new `chrome.nav` strings, so two new
   destinations needed no new string in twenty-one locale files.
4. **Chigamo renders without a system diagram.** Mirai Move has a party network and Kakari has a
   procedure because those exist; drawing one for an untested concept would misrepresent its stage.
5. **The claim guard is negation-aware.** The copy frequently names a forbidden claim in order to
   deny it ("not a proven, repeatable method"), and a guard that could not tell an assertion from a
   denial would have pushed the copy into vagueness.
6. **`copy.about` retained** in the type though the About view was retired, so the change did not
   require editing twenty-one locale files mid-translation.
