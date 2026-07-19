# SR-1 — Result → Service Coverage Matrix

Every retained public result family produces (1) a useful interpretation, (2) at
least one immediate next action, (3) at least one deeper reading/report route,
(4) at least one save/return route, and (5) at least one feedback control — via
the deterministic Personalized Support Plan (`lib/sr1/supportPlan.ts`) rendered
by `SupportPlanView`. No valid result leads to an empty recommendation page,
"check back later" copy, dead buttons, or an unavailable item without an
alternative. This matrix is enforced by `test:sr1`.

Legend: interpretation · immediate action · deeper reading · save/return · feedback.

| Family | Interpretation (what we understood) | Primary "help now" | Prioritized next | Save/return | Feedback |
|---|---|---|---|---|---|
| **imairo** (120Q) | いま色 archetype current-state line + traits + confidence + boundary | self-understanding report (real, free) → falls back to reasoned hints if no report file | hints · 2分の振り返り · save/return | ✓ device-local save (RTR-1 record) + /my-yorisou | 役立った / 今は違う + per-item 保存 |
| **c02** (今のわたし) | multi-angle current-state summary | 2分の振り返り (guided) | hints · save/return | ✓ | ✓ |
| **f01** (向いている働き方) | working-style direction | 仕事のリズムチェック | hints · 2分の振り返り · save/return | ✓ | ✓ |
| **f02** (職場環境フィット) | environment-fit direction | 仕事のリズムチェック | hints · 2分の振り返り · save/return | ✓ | ✓ |
| **relationship-fatigue** | where relational load sits | 距離感をゆるめる / 2分の振り返り | hints · save/return | ✓ | ✓ |
| **love-distance** | your distance rhythm | 2分の振り返り | hints · save/return | ✓ | ✓ |
| **local-life** | current life-interest themes | reasoned hints | 2分の振り返り · save/return | ✓ | ✓ |
| **work-rhythm** | focus peaks + tiring pace | 2分の振り返り | 暮らしの関心チェック · hints · save/return | ✓ | ✓ |
| **name-impression** | how your self-presentation reads | 2分の振り返り | hints · save/return | ✓ | ✓ |

## How coverage is guaranteed
- `buildSupportPlan(family)` always returns a non-empty `whatMayHelpNow` plus a
  `whatMayHelpNext` set, and always appends the `save-and-return` action if it is
  not already present — so no family can dead-end.
- Every plan item resolves to a **real internal route** in the governed service
  catalogue (`app/data/sr1/serviceCatalogue.ts`). No fabricated availability.
- The primary "help now" for imairo prefers the **real free** self-understanding
  report only when a report href exists; otherwise it falls back to reasoned
  hints (no fake paywall / no non-existent deliverable).
- Controls (保存 / 試してみる / 役に立った / 今は違う / 後で見る / もう表示しない) map to
  truthful device-local guest-journey signals.

## Where the result surface renders this
`app/result/page.tsx` (imairo public result) renders `SupportPlanView` with the
plan + a device-local save (writes the RTR-1 `saveState` record, so `/saved`'s
device-local hero and `/my-yorisou` become truthfully populated) + feedback
controls. The other families reach the same plan model through `/my-yorisou`
(from a saved journey result) and can be wired onto their own flow result
surfaces in a follow-up (their plans are already produced deterministically and
covered by `test:sr1`).
