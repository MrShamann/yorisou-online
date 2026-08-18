# YORISOU Phase 1 — UX coherence review

**2026-08-17** · PR [#135](https://github.com/MrShamann/yorisou-online/pull/135) · five journeys walked
in a real browser at 375 × 812, against a real database with real seeded records

> **What this is.** §18 of the finalization package asks whether Phase 1 reads as **one product**
> rather than seven features that happen to share a URL prefix. That question cannot be answered from
> a component tree, so the journeys were driven in a browser on the disposable stack, with a signed-in
> account holding two states, a direction, an experience, both reflection modes and a memory.
>
> **Scope discipline.** Bounded fixes only. Nothing here changes the YORISOU visual language: no new
> component, no layout system, no colour, no type scale. Four things moved, and each is a sentence or a
> label.

---

## 1. The journeys

| | Journey | Verdict |
|---|---|---|
| **A** | Today → check-in → Life → Return | **Coherent.** The check-in writes a state with `source: today_check_in`; the hub shows that record in full and 前に残した状態 shows the ones before it. 前にいたところ names what was left. The seam between the two verticals is invisible, which is the point. |
| **B** | Life → Experience → Light Reflection → Memory → Timeline | **Coherent after one fix.** 「この経験を振り返る」 carries the experience id into the reflection, the reflection offers a memory candidate, and the timeline shows all three. The fix was terminology — see 2.1. |
| **C** | Life → Deep Reflection → Timeline → Return | **Coherent after one fix.** The deep flow is 「じっくり振り返る（7つの問い）」 throughout and 「Postmortem」 appears nowhere. The timeline distinguished the two modes correctly but named them inconsistently — see 2.2. |
| **D** | Life → Direction → Return | **Coherent.** 「達成するためのものではありません。いま大切にしたいことを、言葉にしておくためのものです。」 is doing the load-bearing work: it is the sentence that stops Direction reading as a task manager. Return shows 「いま向かっている方向：…」 without a progress bar, a percentage or a due date. |
| **E** | Life → Assistant → draft → decide → save | **Coherent after two fixes.** The draft sits in its own bordered card outside every textarea, is labelled 下書き, and enters the person's text only on an explicit press. Declining did not exist, and accepting could produce something unsavable — see 2.3 and 2.4. |

## 2. What was changed

### 2.1 One concept, two words, side by side

The timeline's filter chip said 「体験」 while every entry it filtered was labelled 「経験」 — **both
visible at once, for the same records.** The Life OS says 経験 everywhere else: the hub's section, 「経験を書く」, the page title, `MEMORY_TYPE_LABELS.experience`, and 「最近書いた経験」 in Return. 体験 belongs
to the older `/experiences` vertical (体験カード) and is still right there. The chip moved.

### 2.2 A filter whose name promised more than it showed

The two reflection chips read 「振り返り」 and 「じっくり振り返る」 — *reflections*, and *deep reflections*.
That is not what they do: `REFLECTION` shows **only light** reflections and deliberately excludes
postmortems, which the reflection end-to-end test asserts. The broader-sounding name was the narrower
filter, so someone pressing it to see everything they had written would find half of it missing with
no way to tell why. Now 「かるく振り返る」 / 「じっくり振り返る」 — symmetric, and the same two words the hub
offers.

### 2.3 The assistant had no way to say no

Once a draft appeared the only action was 「この内容を使う」. A person who did not want it had to accept
it or leave the screen. 「使わない」 now exists, and it restores the offer rather than closing it —
declining is not a one-way door. The keyboard smoke drives accept, decline, and re-offer.

### 2.4 「この内容を使う」 could produce a reflection that would not save

The draft bound and the answer column are both 2,000 characters, and a comment claimed that made the
button always work. It does not: appending a 2,000-character draft to a 1,500-character answer exceeds
the column, so the person would accept the draft and then be refused at save. The case is now named —
「いま書いてある文章と合わせると長すぎます。少し短くすると使えます。」 — rather than truncating a draft, which
would put half a sentence in someone's mouth, or overwriting what they wrote.

### 2.5 Half a disclosure, then the Return section, then the other half

The hub's `<h1>` was 「ここに残したものは、ほかの利用者に表示されません。」 and the second sentence of the same
disclosure — 「保存先はYorisouのサーバーです。運営が内容を見るのは、安全確認が必要なときに限られます。」 — sat
**after** the whole Return block. Separation of the two sentences was deliberate and correct; the
interruption was not. The second sentence moved directly under the first. The heading also now uses the
exported constant instead of a retyped, slightly different version of it.

## 3. The review questions, answered

| Question | Answer |
|---|---|
| **First-screen clarity** | The hub leads with what the surface promises rather than what it offers to do. For a product about private records that is the right first sentence — and it is now one contiguous disclosure rather than two halves. |
| **Too many entry choices** | Seven sections, each one line of recent content and one action. Counted: the hub offers **7** links. That is a lot for a phone, and it is deliberate — the hub is an index, not a home screen — but it is the number to watch if an eighth capability arrives. **Non-blocking observation, no change.** |
| **Terminology consistency** | Two real collisions found and fixed (2.1, 2.2). After them: 状態 / 方向 / 経験 / かるく振り返る / じっくり振り返る / 覚えていること are used identically on every surface that names them. |
| **Back navigation** | Every sub-surface ends with 「わたしの記録へ」. Reflection has 「ひとつ戻る」 per screen. No surface is a dead end and none relies on the browser's back button. |
| **Empty states** | Each says what is absent in one line and offers the action. 「まだありません。」「まだ記録はありません。」「まだ何もありません。」「まだ何も覚えていません。あなたが確認したものだけが、ここに残ります。」 No empty frames, no invented encouragement. The memory one carries the promise as well as the absence, which is right on that surface. |
| **Mobile density** | Fine at 375 for reading. The one pressure point is the memory list: every row carries four or five controls, so with 29 memories 「もっと見る」 sits past **120 focus stops**. It is reachable — the keyboard smoke proves it — but a keyboard user pressing Tab 130 times to reach the next page is real friction. **Non-blocking; the fix is a skip affordance, which is a design addition rather than a bounded repair.** |
| **Privacy comprehension** | Now contiguous, before the first input on every writing surface, and it names the specific trigger on experience cards rather than hinting at it. No surface claims absolute privacy, and a test enforces that. |
| **Does Memory feel technical?** | No. 「覚えていること」, 「覚えておく」, 「忘れる」, 「いまは使わない」, 「また使う」, 「もう使わないことにする」. Ordinary verbs. No confidence score, no "learned" section, no embedding, no id on screen. The one-line receipt reads as a sentence, not a compliance panel. |
| **Does Direction feel like productivity software?** | No, and one sentence is why (journey D). No percentage, no streak, no deadline, no 達成率. |
| **Does Timeline look administrative?** | It is a list of dates and sentences with no metadata columns, no ids and no counts. The filters are natural words. Closer to a diary index than a log viewer. |
| **Does the Assistant feel too powerful?** | No. It appears on one screen, only after something is written, only when pressed. Labelled 下書き. It reads nothing stored — 24 assertions on that — and now offers 「使わない」 as an action rather than as the absence of one. |
| **Does Return feel like a feed?** | No: a hard cap of three items, fixed priority, no ranking, no recommendation, no infinite scroll. Named as an offer (「書きかけ」) rather than a task (「未完了」). |

## 4. Non-blocking observations, recorded not fixed

1. **Seven entry points on the hub.** Correct for an index today. Worth a decision before an eighth.
2. **Reaching pagination by keyboard in a long memory list takes ~130 Tab presses.** A skip-to-end or
   in-page landmark navigation would fix it; both are design additions.
3. **The hub issues 21 database reads to render one page** (measured at 450 rows — five each for
   reflections, directions and states). Bounded by the number of sections rather than by the amount of
   data, so it does not degrade, and the performance smoke asserts that. Consolidating them is a
   worthwhile refactor and not a Phase 1 defect.

## 5. What was NOT changed, and why

- **The h1 being a privacy statement.** It reads as unusual for a "my records" page, and it is the
  right unusual: the most important thing to know before writing something private is who else can
  read it. Changing it would be a redesign, not a fix.
- **「N日ぶりですね」.** Assumes shared context, and appears only when there is some.
- **「忘れる」 for a hard delete.** Honest about disappearing, which is the one thing that surface must be.
- **The seven-section hub layout.** Counted and questioned above; not restructured.
