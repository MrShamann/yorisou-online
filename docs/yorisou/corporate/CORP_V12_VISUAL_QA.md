# CORP-v1.2 — visual QA

Screenshots are captured from the production build at deviceScaleFactor 2 and stored outside the
repository at `/Users/yangjin/yorisou-p5r2-recovery-20260830/evidence/shots/` (25 files). They are
kept out of git deliberately: they are review evidence, not a repository record.

## Captured set (25)

Home — ja desktop, ja mobile 390, ja mobile 375, en, zh-CN, es, ar, ko ·
Ventures — ja, en, ja mobile · How we build — ja, en, ar ·
Build with us — ja, en · Chigamo — ja ·
Company — ja, ja mobile, en, ar · Mirai Move — ja · Kakari — ja · Contact — ja ·
Language selector opened.

Every capture reported HTTP 200, **zero console errors, zero failed requests and zero horizontal
overflow**.

## Defects found by looking, and fixed

### 1. The homepage hero was still the old positioning — the most important defect in the package

Automated gates were entirely green while the hero still read
「人と社会のあいだに、次のよりそいをつくる。」 — the CORP-P5R2 product thesis. Every new v1.2
section had been added correctly around it, so nothing failed: the route matrix passed, the claim
guard passed, axe passed. Only opening the screenshot showed that the first viewport never said
YORISOU builds companies, which is the whole point of §7.1.

Fixed by rewriting `home.thesis`, `home.lead` and `home.buildHeading` in the Japanese canonical
source and propagating to all 21 locales. Now: 「構造の課題から、独立して立つ会社をつくる。」

**Lesson recorded:** a green test suite proves the new thing was added. It does not prove the old
thing was removed.

### 2. Arabic pages scrolled 10,000px horizontally

`/ventures` and `/build-with-us` in Arabic reported `scrollWidth` 11439 against a 1440 viewport, at
every width tested. The offender was the skip link, parked at `inset-inline-start: -9999px`. In LTR
that resolves to `left: -9999px` and is harmless; in RTL it resolves to `right: -9999px`, placing the
link 9,999px past the right edge and attaching a scrollbar to an invisible element.

Fixed with the clip-path visually-hidden pattern, which has no side and therefore cannot overflow in
either direction, while keeping the link in the tab order.

### 3. Asterion body text was unreadable on the dark band

`/about` rendered `#2f3633` on `#0e1211` — **1.52:1**, far below AA — across 14 nodes. `.bandDark`
sets a light ink, but `.body` and `.lead` each set their own light-surface colour and win on
specificity. Headings were unaffected because `.h2` sets no colour and inherits.

Fixed by giving prose inside `.bandDark` the dark-surface inks: 9.36:1 for body and lead, 6.02:1 for
muted text.

## A defect that was NOT real

Measuring the Asterion boundary paragraph in the embedded browser reported `width: 0` and 75 lines —
the signature of the one-character-per-line Japanese fragmentation defect seen in earlier packages.

It was an artifact: `window.innerWidth` was **0** because the browser pane was collapsed. Re-measured
through Playwright at real viewports the paragraph is 416px wide and 4 lines at 1440, 768 and 390.
Recorded here because it nearly became a false defect report, and because it is a reminder that a
measurement taken in a degenerate viewport is not evidence.

## Judgement against the §24 questions

- **Is the hero understandable in five seconds?** Yes, after fix 1. It names the input (structural
  problems) and the output (companies that stand on their own).
- **Is YORISOU visibly a company-building organisation?** Yes — hero, the eight-stage process, and
  the independence section all say so.
- **Are ventures distinct from Asterion?** Yes. Three venture cards sit in their own section;
  Asterion is a separate shared-floor band with its boundary note attached, and appears nowhere in
  the ventures list (test-enforced).
- **Is Asterion secondary but understandable?** Yes — below the ventures on the homepage, and a
  mid-page section on How We Build. No badge, no hero presence.
- **Premium without overdesign?** The editorial system is unchanged from P5R2: typography and
  whitespace carry the page, diagrams appear only where a real structure exists. Chigamo carries no
  diagram because it has no structure yet.
- **Is Build With Us useful?** Four lanes with concrete "who this is for" lists, and the intake
  reality stated *before* the CTAs rather than in a footnote.
- **Can a government or university visitor see how to engage?** Yes — a dedicated lane each, and
  every CTA is a conversation rather than an application.
- **Does mobile feel designed?** Yes at 390 and 375: the hero, lead and chips fit the first screen,
  and sections stack without collapsing into a list of fragments.
- **Does any text sound like unsupported hype?** The strongest statements are limits: "not a proven,
  repeatable method", "no application process", "not incorporated subsidiaries". The claim guard
  enforces this, and is negation-aware so those denials remain sayable.
