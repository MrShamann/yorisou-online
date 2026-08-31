# CORP-v1.2R2.1 — Founder visual closure

Continues CORP-v1.2R2. Preview only. Not merged. Production, DNS, consumer Today and the 120Q
runtime untouched.

## Preflight divergence — recorded, not silently absorbed

The package specified starting HEAD `2ce8493`. The local branch tip was **`8be233c`**: another
package (RELEASE_GATES_3 Track F) had landed a `/company` statutory-fact correction and released the
lock. That commit is **local-only** — `origin` still holds `2ce8493`, which is why PR #156 shows the
expected head.

It was not reverted. Its reasoning is sound and better-founded than what it replaced: 代表社員 is
designated *from among* the 業務執行社員 under 会社法 §599(3) rather than following automatically, so
**業務執行社員 is true under either answer** and is what the file says until the register is read. It
also adds 法人番号 2290003018125, verified against the National Tax Agency publication site, while
correctly keeping 設立年月日 omitted (the NTA publishes 法人番号指定年月日, a different fact) and 番地
omitted by Founder decision. R2.1 is built on top of it, and claim-ledger row C-02 is updated.

## 1. Japanese venture identity — completed, treatment unchanged

R2's finding stands and is not reopened: no katakana. Kakari's own glossary says *"ASCII wordmark
only. Never transliterated (カカリ, 卡卡里)"* and enforces it in CI; Mirai Move's `brand.ts` carries a
Latin wordmark and no reading; Chigamo has no canonical source.

The defect was **inconsistency**, and it is closed by making one component own the treatment:

`VentureName` renders the two-level unit — Latin wordmark + that venture's own Japanese line — and is
now used on Home, Ventures, How We Build, the venture detail hero and the footer. A guard asserts
every one of those surfaces uses it, so the treatment cannot drift again.

On detail pages the **wordmark now leads**: it is rendered at hero scale before the positioning
headline, so a visitor never has to infer which venture they are on from the URL.

## 2. "Yorisou in 30 seconds" — a guided explainer

`GuidedExplainer` replaces the static section: **seven beats, ~4.6s each, ~32s total**, where each
beat *changes the same field* rather than scrolling past cards.

signals → evidence verifies → venture defined → founding team attaches → company separates →
current ventures → shared capability and the way in.

- Play / pause / restart, a `場面 n / 7` indicator, and beat pips as a real tablist with arrow, Home
  and End key support. Nothing is reachable only by pointer.
- **Reduced motion does not autoplay at all** — it becomes a stepper, verified empirically: after six
  seconds it was still on 場面 1 / 7.
- No MP4, no Lottie, no WebGL, no dependency. It is never called a video, because no video exists.
- Beat text comes from `foundry.stages` and existing section names, so it is localised in all 21
  locales without one new sentence to translate. Only four control words were added.

## 3. Continuous system grammar

`FormationState` places each venture on the Foundry sequence using the hero's own vocabulary — node,
line, state, jade — with reached nodes filled and joined solid, unreached hollow and dashed. It
appears on Ventures, How We Build and each detail page, so Hero → Ventures → How We Build →
Participation reads as one system.

**No percentages and no completion bars.** A venture is at a named stage or it is not; a number would
imply precision the evidence cannot support. The reached index is recorded in `ventureState.ts` with
its evidence: Mirai Move 4 (built and operating, but nothing has ever left the system), Kakari 4
(built, but private-testing with zero users), Chigamo 1 (hypothesis only). A guard forbids any
percentage or progress element in that component.

## 4. Participation interface

The six lanes are now native `<details>` disclosures: the summary carries the role and its truthful
state, and opening reveals contribution fit, relevant ventures, `offers`, `cannot`, state and next
action. First lane open, so the page opens as an answer rather than six closed rows.

`<details>` is deliberate — keyboard-operable with no JavaScript, content in the DOM whether open or
closed, and nothing revealed by hover. A guard asserts the disclosure is semantic, that all four
truth fields survive, and that no `:hover` rule reveals lane content.

Home's six cells now show which ventures each role connects to, taken from that lane's own `ventures`
field. This is information architecture — nothing is matched, recommended or personalised.

## Performance — measured honestly

| | median of 3 runs | runs |
|---|---|---|
| ja Home | **87** | 86, 87, 88 |
| ar Home | **86** | 86, 83, 88 |
| ja Company | **89** | 85, 89, 91 |

Accessibility **100**, best practices **100**, CLS **0** throughout.

**The ≥90 target is not met on this method, and that is reported as a miss rather than by quoting a
favourable run.** Two facts bound what it means:

1. **R2.1 added no JavaScript to the pages whose scores moved.** Home and Company ship byte-identical
   payloads — 7 scripts, 144.0KB transfer each. The guided explainer costs **+1.5KB, on `/about`
   alone**.
2. **Single-run measurement on this machine has ±14 variance.** Two consecutive single runs of the
   same build gave 80/88/89 and 91/77/89, with TBT swinging 60–390ms.

R2's recorded 91/91/92 were single runs taken the same way, so they were an optimistic sample rather
than a stable baseline. The honest position: R2.1 cannot be shown to have regressed anything, and the
target cannot be shown to have been stably met before. Real numbers should come from the Vercel
Preview on CDN, not from this laptop.

## Validation

189/189 route × locale · **23/23 guards** · tsc clean · eslint 0 on corporate code · build passes ·
**axe 0 / 56 combinations** · **210 responsive combinations clean** · reduced motion clean · keyboard
complete · **0 brand transliterations** across sampled locales · JA Home carries all three ventures'
Japanese lines · detail hero carries wordmark + line.

Four new guards: every venture surface uses the shared identity unit; the explainer has all seven
beats, transport controls, keyboard operation and a reduced-motion path, and references no video or
heavy runtime; lane content is disclosed semantically and never by hover; formation state publishes
no percentage.

One guard was corrected during development: the no-video check fired on its own explanatory comment,
which names Lottie and WebGL in order to say they are not used. It now scans code with comments
stripped — the same fix pattern as the negation-aware claim guard.

## Residual

- Footer tagline still reads 人と社会のあいだに、次のよりそいをつくる。 — the pre-v1.2 brand line. Not
  false, but no longer the positioning. Changing it is a copy decision across 21 locales and was out
  of scope for a visual-closure package. **Raised, not assumed.**
- Consumer Today / ARCH-P3 L/M unchanged and untouched.
- Contact still `BLOCKED_BY_RESEND_ACCESS` / `BLOCKED_BY_DNS_ACCESS`.
- 19 locales remain `preview_only`.
