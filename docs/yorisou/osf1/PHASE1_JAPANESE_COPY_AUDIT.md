# YORISOU Phase 1 — Japanese copy audit

**2026-08-17** · PR [#135](https://github.com/MrShamann/yorisou-online/pull/135) · **247 user-visible
strings across 17 files**, enumerated from source, not from a walkthrough

> **How the list was built.** Every string literal and JSX text node containing Japanese, extracted
> from `app/life/**` and `lib/life-os/**` — the two trees that own every OSF-1 surface and every piece
> of copy they share. Reading the screens instead would have missed the states nobody opens: a
> failure message, an empty list, a suppressed row, a provider that refused.

---

## 1. What the audit found

**The copy is in good condition, and that is a measured statement rather than a compliment.** Eight of
the ten criteria have zero violations, checked mechanically against the full string set:

| Criterion | Result |
|---|---|
| 「Postmortem」 in consumer UI | **0** — the deep flow is 「じっくり振り返る」 everywhere; `postmortem` stays an internal id |
| Unnecessary English (OK / Error / Save / Delete / Next …) | **0** |
| SaaS register (ダッシュボード / プラン / 管理画面 / 最適化 …) | **0** |
| Productivity register (タスク / 生産性 / 効率 / 達成率 / KPI …) | **0** |
| Mystical register (運命 / 波動 / 前世 / オーラ …) | **0** |
| Absolute claims (必ず / 絶対に / 間違いなく / 100%) | **0** |
| 「あなたは〜です」 assertions | **0** |
| Translated syntax (することができます / を実施 / を行う) | **0** |
| Clinical register | 2 hits, **both correct** — see below |
| Absolute privacy claims | 3 hits, **all in the forbidden-phrase list itself** — see below |

**The two clinical hits are negations or disclosures, not claims.**
`「書いた内容だけをもとに、読みやすく整理します。診断や決めつけはしません。」` says the product does *not*
diagnose. `「診断や治療にふれる内容は、安全確認の対象になることがあります。」` names the trigger that can
route a card to a human — the honest disclosure Data & Privacy asks for, and removing the word would
make it vaguer, not safer.

**The three absolute-privacy hits are `lib/life-os/privacyCopy.ts`'s list of phrases no surface may
contain** (`あなただけが見られます`, `誰にも見られません`, …). They are the test data for a rule, not copy.
`lib/server/__tests__/osf1PrivacyCopy.test.ts` asserts no surface reintroduces one.

## 2. Meaningful changes made

Four. Punctuation and spacing edits are not listed — those are not strategic.

### 2.1 One thing, two words, on the same page

| | |
|---|---|
| **BEFORE** | The timeline's filter chip read 「体験」. Every entry it filtered was labelled 「経験」. |
| **AFTER** | `TIMELINE_FILTER_LABELS.EXPERIENCE = "経験"` |
| **REASON** | Both words were on screen **at the same time, for the same records**. The Life OS says 経験 everywhere else — the hub's section heading, 「経験を書く」, the page title, `MEMORY_TYPE_LABELS.experience`, and the Return section's 「最近書いた経験」. 体験 belongs to the older `/experiences` vertical (体験カード, and the Founder moderation screen), where it is still correct. Inside the Life OS the chip was the outlier, so the chip moved. |

### 2.2 A save failure that did not say what happened to the words

| | |
|---|---|
| **BEFORE** | `lifeFailureMessage` → 「保存できませんでした。書いた内容はこの画面に残っています。」 |
| **AFTER** | 「保存できませんでした。入力した内容はこの画面に残っています。少し時間をおいて、もう一度お試しください。」 |
| **REASON** | Every failure message should answer two questions in order: **what happened to what I had**, and **what can I do now**. The old sentence answered only the first. The transactional audit class makes the first answerable as *fact* rather than hope — a failed reflection save means nothing was written, because the mutation and its audit row stand or fall together — so the copy can state it plainly and then invite the retry. |

Two further shapes were added rather than reusing one sentence for three different acts, because
「入力した内容はこの画面に残っています」 is true of a reflection that would not save and **false** of a
suppression that would not apply:

- change: 「変更できませんでした。記録はそのままです。少し時間をおいて、もう一度お試しください。」
- delete: 「消せませんでした。記録はまだ残っています。少し時間をおいて、もう一度お試しください。」

`not_accepting` deliberately does **not** invite a retry: a 503 there means the schema is not declared
ready, which will not resolve in the next minute, and inviting someone to keep trying a closed door is
worse than telling them it is closed.

### 2.3 The goals panel had its own private failure sentence

| | |
|---|---|
| **BEFORE** | `app/life/goals/GoalsPanel.tsx` hardcoded 「保存できませんでした。もう一度おためしください。」 |
| **AFTER** | `lifeFailureMessage(result)` |
| **REASON** | Three faults at once. It never said the words were still on screen — they were. It spelled お試し in kana where every other surface uses the kanji. And it answered 「サインインすると保存できます」 and 「いまは保存を受け付けていません」 with the same sentence as a genuine failure, so a signed-out person was told a lie about what had gone wrong. Copy that lives in one place cannot drift from itself. |

`ExperienceForm.tsx`'s 「もう一度おためしください」 moved to the kanji for the same reason. It already
routed everything else through the shared message.

### 2.4 The assistant's labels

| BEFORE | AFTER | REASON |
|---|---|---|
| 「書いたことを整理する（任意）」 | 「言葉を整理する（任意）」 | The product framing is 「言葉を整理する手伝い」, and the heading is where it is read. |
| 「整理してもらう」 | 「下書きを見る」 | 「〜してもらう」 asks someone to do something *for* you. 「下書きを見る」 is lower-commitment and truthful: what you get is a draft to look at. |
| 「この案を使う」 | 「この内容を使う」 | 「案」 reads as a proposal from an authority; 「内容」 is just text. |
| 「これは案です。」 | 「これは下書きです。」 | Same reason, and it matches the button. |
| *(nothing)* | **「使わない」** | Declining was previously only possible by accepting or leaving the screen. See §3. |

## 3. What was NOT a copy problem but was found while reading it

Three defects surfaced during this pass. They are recorded here because they were found here; the
fixes are code, not wording.

1. **The assistant draft had no decline.** Once a draft appeared the only action was 「この内容を使う」 —
   a person who did not want it had to accept it or leave. 「使わない」 now exists, it restores the offer
   rather than closing it, and the keyboard smoke drives both.
2. **「この内容を使う」 could produce a reflection that would not save.** The draft bound and the answer
   column are both 2,000 characters, which was described as making the button always work. It does
   not: appending a 2,000-character draft to a 1,500-character answer exceeds the column. The case is
   now NAMED — 「いま書いてある文章と合わせると長すぎます。少し短くすると使えます。」 — rather than truncating a
   draft (which would put half a sentence in someone's mouth) or silently overwriting what they wrote.
3. **A failure threw keyboard focus to the top of the page.** Buttons disabled while their request was
   in flight are blurred by the browser. Fixed across five surfaces: in-flight is `aria-busy`, the
   re-entry guard moved into the handler, and `disabled` now means only "not allowed yet".

## 4. Register notes worth keeping

Things the audit checked and deliberately left alone.

- **「N日ぶりですね」** (Return section) — 「ですね」 is a small assumption of shared context, and it is the
  right one here: this line only appears when someone has come back after a gap, and greeting that
  neutrally would read colder than the product is.
- **Mood and energy labels** — 「なんとなく重い」「よくわからない」「落ち着かない」. Ordinary words for how a day
  went, not scale points. 「よくわからない」 in particular is a real answer and must stay available.
- **「忘れる」 for delete** — a hard delete, and the copy says so. 「アーカイブ」 or 「非表示」 would be a lie
  about what happens, and the one thing a memory surface has to be honest about is disappearing.
- **「達成するためのものではありません。」** on 向かいたい方向 — the sentence that stops Direction reading as
  productivity software. It is doing real work and should not be trimmed.
- **「ここまでで残す」** rather than 「途中保存」 — the remaining questions are an offer, not a queue to
  clear.
- **「書きかけ」 rather than 「未完了」** in the Return section — named as an offer, never as an outstanding
  task.

## 5. What is enforced rather than reviewed

Prose drifts; a test does not. Three properties of this copy are pinned by executed tests:

| Property | Test |
|---|---|
| No surface claims absolute privacy | `lib/server/__tests__/osf1PrivacyCopy.test.ts` |
| 「Postmortem」 never reaches a screen | `tests/smoke/osf1-life-reflection-e2e.spec.ts` asserts `toHaveCount(0)` |
| A failure message carries no digits — so no status code or count can leak into it | `tests/smoke/osf1-audit-failure-e2e.spec.ts` |

## 6. Coverage

Every surface named in §17 of the finalization package was enumerated: Life hub · Current State ·
state history · Direction · Experience · privacy · Reflection · Deep Reflection · Memory · receipt ·
suppress · restore · revoke · delete · Timeline · filters · Return · Assistant · validation and error
messages · empty states · retry · buttons.

**Not audited:** the pre-OSF-1 surfaces (`/`, `/me`, `/today/check-in`, `/experiences`,
`/tests/ima-iro`). They are outside this package and unchanged by it — the Imairo protected baseline
proves the last of those byte-for-byte.
