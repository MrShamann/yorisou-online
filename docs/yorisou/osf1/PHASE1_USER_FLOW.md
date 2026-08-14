# OSF-1 — Phase 1 User Flow

**Package:** Phase 1 Life OS completion · **Written:** 2026-08-15 · **Status:** describes surfaces that
exist in this tree and are **closed in production**

> This is the loop as a person moves through it — where they are, what is on the screen, what they do,
> what the product keeps, and what it deliberately declines to do at that moment. It is not an API
> listing; the endpoints appear only where the person's experience depends on which one is called.
>
> **Nobody has taken this journey.** No OSF-1 migration has been applied to any database —
> not production, not staging, not preview. `deploymentContext()` fails closed, so every `/life`
> route returns 404 in production and in any unrecognised context. What follows is what a person
> would experience on a preview deployment with `osf1_life_os_preview` set and
> `YORISOU_OSF1_LIFE_OS_SCHEMA_READY=true`, or on a local machine. Read it as a specification of the
> built surfaces, not as a report of use.

Every Japanese string quoted below is copy that exists in this tree, in the component or contract
named in the section it appears under. Nothing here is invented for illustration.

---

## The loop, in one table

| Step | Where | What the person does | What is stored |
|---|---|---|---|
| **Understand** | `/today/check-in` | picks one state, one intent | a `yorisou_current_state_records` row (signed in), plus a device-local record |
| **Record** | `/life/goals`, `/life/experience` | writes a direction, or an experience | a `yorisou_goals` row · a `yorisou_experience_cards` row, always PRIVATE |
| **Reflect** | `/life/reflect`, `?mode=postmortem` | answers 5 or 7 questions | one `yorisou_life_reflections` row, with `mode` |
| **Remember** | the confirmation card, `/life/memories` | agrees to keep a sentence, edits it, or deletes it | a `yorisou_explicit_memories` row — **only** after an explicit yes |
| **Review** | `/life`, `/life/timeline` | reads back what they wrote | nothing |
| **Return** | `前にいたところ` on `/life` | picks up where they left | nothing |

Two of the six steps write nothing at all. That is not an omission — Review and Return exist so that
the product has somewhere to give a person their own words back without asking them for more.

**How someone reaches the loop.** `/life` is linked from exactly two places outside it: the 今日 home
page's `前回の記録` section (`app/TodaySavedState.tsx`, rendered only for a signed-in person who
already has a state record) and `/me` under the heading `アカウントに残す` — "振り返りや、向かいたい方向は、サインインすると端末を越えて残せます。". Note what this means for the first step: the
check-in's own completion screen never links to `/life`. Its next steps go to `/explore`, `/tests` or
`/tests/ima-iro` (`NEXT_STEP_BY_INTENT` in `lib/yorisou/today/currentStateCheckIn.ts`). The Life OS
links out to the check-in; the check-in does not funnel into the Life OS. A person who only ever
checks in never arrives at step two.

---

## 1. Understand — `/today/check-in`

**Where they are.** The one Life-OS-adjacent surface that needs no account and no feature gate. It
predates OSF-1 (PXR-1) and OSF-1 changed nothing about the questions — only where the answer goes.

**What they see.** Two screens, one question each, marked `1 / 2` and `2 / 2`.

> いま、どんな感じですか。
>
> 落ち着かない · 頭が休まらない · なんとなく重い · わりと落ち着いている · よくわからない

Then:

> どうなるとよさそうですか。
>
> 少し休みたい · 頭の中を整理したい · 気分を変えたい · 自分のことを知りたい · まだ決めていない

Five large targets each, no free text, `ひとつ戻る` on the second screen.

**What they do.** Two taps. The bounded vocabulary is the design, not a shortcut: free-text state
would turn a calm question into a disclosure surface and would give an inference path something to
read.

**What they see next.** Their own two choices, verbatim, as the heading — `落ち着かない。` /
`頭の中を整理したい。` — followed by one lookup line, never a computed one:
「頭の中を整理したい、という気持ちがあるようです。」 Then `今できること` with one bounded next step,
and `もう少し深く見る` offering `いま色テストを見る（120問）` as an option rather than the default
completion action.

**What is stored.** The device-local record is written first and unconditionally, which is what makes
the flow work with no account, offline, and against an unreachable database. Then, and only for
someone signed in, `POST /api/life/state` writes a current-state row carrying the two chosen tags and
`source: "today_check_in"`.

The closing line then says which of those actually happened, from the response and never from a guess:

| Outcome | Line shown |
|---|---|
| saved to the account | この記録は、この端末とあなたのアカウントに保存されます。 |
| server write failed | この記録はこの端末に保存されました。アカウントへの保存はできませんでした。 |
| not signed in | この記録はこの端末にだけ保存されます。 |

**The optional note.** Only when the record reached the account does `書き残しておく（任意）` appear —
a textarea placeheld with 「思ったことを、そのまま。」 and a `残す` button. It is offered, never asked.
It can be written **once**: `yorisou_osf1_current_state_set_reflection` updates
`where … and reflection is null`, so a note cannot be overwritten or replaced, and a second attempt
answers `state_record_not_open_for_note`.

**What the product does NOT do here.**

- It does not name a type, score a dimension, or say "you are" anything. The reflection line is a
  lookup from `REFLECTION_BY_INTENT`, not a computation.
- It does not ask for mood or energy. Those columns exist and both `/life` and `/life/timeline` know
  how to render them (`気分：`, `気力：` in `app/life/StateHistory.tsx`) — but **no surface in this
  repository collects them.** They can only arrive through a direct `POST /api/life/state`, so in
  practice the detail line is empty for every record a person creates.
- It does not convert into an Imairo Result, and nothing converts back. A two-tap state and a
  120-question methodology output are different kinds of evidence; `lib/life-os/boundaries.ts` holds
  the rule and `osf1Boundaries.test.ts` fails if an OSF-1 module imports an assessment module.

---

## 2. Record — `/life/goals` and `/life/experience`

### 向かいたい方向

**What they see.** `向かいたい方向。` and, immediately under it, the sentence that decides what this
screen is: 「達成するためのものではありません。いま大切にしたいことを、言葉にしておくためのものです。」
Then `ひとこと`, `もう少し書く（任意）`, and `書きとめる`.

**What is stored.** A goal row: title, optional description, status `active`.

Each existing goal carries one control, labelled `いまの扱い`, offering four statuses that the copy
treats as equal:

| Value | Label |
|---|---|
| `active` | いま向かっている |
| `paused` | いったん置いている |
| `achieved` | 届いた |
| `released` | 手放した |

`手放した` sits beside `届いた` deliberately. Deciding to stop carrying something is a real outcome,
and a status list that only allowed success would quietly tell people otherwise.

**What the product does NOT do here.** No due date, no reminder, no progress indicator, no completion
percentage, no sort-by-urgency, no celebration on `届いた`. There is no delete control and no delete
route — a goal can be moved to `手放した`, which is a decision, not an erasure.

### 経験を書く

**What they see.** 「やってみたことを、書きとめておく。」 and 「うまくいったかどうかは問いません。あとから見返せるようにしておくためのものです。」 Then `みだし` and four questions:

| Field | Label on screen |
|---|---|
| `situation` | 何が起きましたか |
| `actionTaken` | どうしてみましたか |
| `outcome` | その結果、どうなりましたか |
| `lesson` | そこから何を持ち帰りますか（任意） |

These map onto the **existing** `yorisou_experience_cards` columns (`situation`, `action_tried`,
`perceived_outcome`, and the `lesson` column added by `202608140001`). There is no second experience
table.

**What is stored, and at what visibility.** The card is written `PRIVATE`, always, with no option to
do otherwise at the moment of writing. The privacy paragraph is on the same screen in full, including
the part most products would omit: 「診断や治療にふれる内容は、安全確認の対象になることがあります。そのとき運営が本文を確認します。」 Said precisely, because the placement is weaker than the
claim would suggest: it sits **below** the fields and the `書きとめる` button in `ExperienceForm.tsx`,
so on a phone it is under the fold while someone is typing rather than in front of them. That sentence
is there because it is true —
`trustFlags()` in `lib/server/experienceCards.ts` flags 診断/治療 vocabulary and sets
`moderation_status='limited'` **even for a private card**, which puts it in the Founder moderation
queue. Someone deciding whether to write about a diagnosis deserves to know that before they type.

**What they see after saving.** 「書きとめました。」, the privacy sentence plus 「共有するかどうかは、あとから決められます。」, and a link `この経験を振り返る` that carries the new card's id into the
reflection flow. That link opens the **light** flow; reaching the postmortem for a specific experience
means adding `&mode=postmortem` by hand, which no surface offers.

**The sharing decision, deliberately separated.** Below the form, `書きとめたもの` lists the person's
cards with a `公開範囲` control and one honest sentence: 「はじめはすべて非公開です。ほかの人に見えるようにするかどうかは、一つずつ決められます。」

The asymmetry is the point:

- **Narrowing sends immediately** (`この範囲に変更する`). It takes nothing from the person and gives
  nothing to anyone.
- **Widening asks first** (`共有前の表示を確認`). It opens a preview showing 「ここに書かれている内容が、〈範囲〉の範囲で見えるようになります。」 with the exact fields a reader would receive — in reader
  order, not form order — and the boundary stated plainly: 「みだしと「そこから何を持ち帰りますか」は共有されません。」 The four reader-protection fields (`今の状態や背景`, `条件や限界`,
  `合うかもしれない人・場面`, `合わないかもしれない人・場面`) are collected here, at the one moment
  they start to matter, because a private note has no readers to protect. Nothing is sent until the
  person ticks 「第三者の個人情報を含まず、この範囲で共有することに同意します。」 and presses
  `この範囲で共有`.

The server remains the authority — `updateExperience` refuses an unconfirmed widening through
`isVisibilityExpansion()` — but a refusal after the fact is not a decision the person got to make, so
the preview comes first.

**What the product does NOT do here.** No sharing checkbox at the bottom of the writing form. No
"share to help others" prompt. No delete control on this surface.

---

## 3. Reflect — `/life/reflect` and `/life/reflect?mode=postmortem`

Two entry points sit side by side on `/life`, named by what they ask rather than ranked by depth:

> かるく振り返る（5つの問い）
>
> じっくり振り返る（7つの問い）

### The two modes, exactly

| | LIGHT (`/life/reflect`) | POSTMORTEM (`?mode=postmortem`) |
|---|---|---|
| 1 | 何がありましたか。 → `what_happened` | 何が起きましたか。 → `what_happened` |
| 2 | その時、どう感じましたか。 → `felt` | そのとき、どうなってほしいと思っていましたか。 → `goal_at_the_time` |
| 3 | 何を試しましたか。 → `tried` | そのとき、何がわかっていましたか。 → `information_at_hand` |
| 4 | そのあと、何が起きましたか。 → `what_followed` | どんな選択肢がありましたか。 → `options_considered` |
| 5 | 次に活かせそうなことはありますか。 → `next_time` | どうすることにしましたか。 → `decision_made` |
| 6 | — | そのあと、何が起きましたか。 → `what_followed` |
| 7 | — | 次に同じことがあったら、どうしたいですか。 → `next_time` |

**Why neither can stand in for the other.** The light flow never asks what was known at the time. That
is not a shortened version of the postmortem — it is a different act, and it makes one thing
structurally impossible: separating a decision from its outcome. Without `information_at_hand` and
`options_considered`, every result reads as a verdict on the choice, and a good call that went badly
is indistinguishable from a bad one. Telling those apart requires knowing what was available *before*
the result arrived, which is exactly what questions 3 and 4 of the postmortem exist to capture. The
help text under question 3 says so to the person: 「あとから知ったことは含めなくて構いません。」 and
under question 6: 「決めたことと、そのあと起きたことは、切り離して見ます。」

The converse is equally true. Asking someone to reconstruct a past state of mind is real work, and
putting that in front of them on a hard day gets one of two things: an abandoned flow, or a tidy story
invented after the fact. So the postmortem is never the default, and the light flow asks nothing that
needs distance — 「うまく言葉にならなくても、そのままで。」

Question 4 is what makes the seven-question flow a postmortem rather than a longer diary, and its help
text guards against the failure mode the format exists to prevent: 「選ばなかったものも含めて。あとから思いついたものではなく、そのとき見えていたもので。」

**Retained columns.** `why` and `what_learned` are asked by neither flow. Their columns are kept and
still read back, because rows written by the earlier flow hold them, and `createReflection` sends
`p_why: null` and `p_what_learned: null` explicitly rather than letting anything invent a value.

### What they see, screen by screen

One question per screen, marked `3 / 5` or `4 / 7`. Free-text textareas, capped at 2000 characters —
"what happened" cannot be a list of options, and that is exactly why nothing here interprets what is
typed.

**Only the first question is required.** Every other screen carries `とばす`, and once the first answer
exists, every screen between it and the last carries `ここまでで残す` — on the last screen the primary
button is already `書き終える`, which does the same thing. `ひとつ戻る` is available from screen two.
Someone who wanted to write one line about a hard day should not have to answer the rest to keep it; a
flow that refuses to save until every box is full is a form.

### The assistant, on the last screen only

`書いたことを整理する（任意）` appears on the final question, and only once something has been typed.
It states its own limits before it runs: 「書いた内容だけをもとに、読みやすく整理します。診断や決めつけはしません。」 The person presses `整理してもらう`.

If a draft comes back, it sits **beside** their text, never in it, under 「これは案です。使うかどうかはあなたが決めます。」 Pressing `この案を使う` appends it to the last answer and overwrites nothing.

The ordinary outcome is the other one: providers are off by default in this product, so the person
sees 「いまは整理を利用できません。このまま書き終えられます。」 and finishes without it. The same
message covers a boundary refusal — every provider response passes `assertAiOutputWithinBoundary`, and
a violation discards the entire draft rather than editing it, because a sanitised sentence would still
carry the provenance of a model that just broke the rule while reading as the product's own voice.

The assistant reads **nothing stored**: no memory, no reflection, no goal, no context. It works only on
the text typed in the same request and holds no state between calls. That is not a limitation worked
around — reflection governance requires any reference to a stored memory to pass an eligibility check
by a shared permission service, and that service does not exist in this codebase. An assistant that
read stored memories would have no governed gate to pass through, so it reads nothing and the question
does not arise.

One thing it sees less of than the person might assume, said here rather than left to be discovered:
`prompt()` in `reflectionAssistant.ts` walks `REFLECTION_QUESTIONS`, which is the **light** set. In the
postmortem flow the route collects every answer, but only the fields the light flow also names —
`what_happened`, `what_followed`, `next_time` — reach the provider. `goal_at_the_time`,
`information_at_hand`, `options_considered` and `decision_made` are not in the prompt. The draft a
postmortem writer gets back is therefore organised from three of their seven answers.

### What is stored

One row in `yorisou_life_reflections`, carrying the answers, the optional `experience_id`, and the
`mode` — a real column since `202608160001`. It matters that it is a column: before this package,
`parseReflectionInput` dropped the mode entirely, so `input.mode` was always `undefined` downstream and
**every postmortem was recorded as a light reflection.** An all-null postmortem and a light reflection
are otherwise indistinguishable, which is why `/life/timeline` can now label them separately.

The audit row `yorisou.life.reflection.created` is written **inside the RPC's own transaction**. The
route calls no `auditLifeOs` afterwards, and `auditLifeOs()` throws if handed a transactional action,
because the audit table is append-only and a duplicate could never be removed.

**State the trade-off plainly: if the audit table is unavailable, the save fails.** A person can lose a
reflection because its record could not be written. That reversal is deliberate — for a deletion, a
confirmation, an edit, and a reflection, the audit row answers a question the surviving data cannot —
but it is a real cost paid by a real person. The one thing that softens it is that nothing is thrown
away silently: the flow shows 「保存できませんでした。書いた内容はこの画面に残っています。」 and the
text stays in the textareas.

**Retention of those audit rows is `RETENTION_POLICY_TBD`.** No retention period is set or assumed.
Twenty-four months is an unapproved proposal, not the policy. Rows have no expiry and nothing removes
them.

**What the product does NOT do here.** It does not summarise the reflection back. It does not score,
rank or characterise anything written. It does not offer an edit or a delete afterwards — there is no
`PATCH` and no `DELETE` on `/api/life/reflections`, and no surface offers either. A reflection, once
written, is a record of what was said at that time.

---

## 4. Remember — the confirmation card and `/life/memories`

### How a candidate is offered

On the reflection's completion screen — 「書き終わりました。」 — and after creating a goal, a section
appears:

> **覚えておきますか**
>
> あなたが確認したものだけが残ります。何もしなければ、保存されません。

Each candidate card shows its type, then the sentence **in full, verbatim, before the confirm control**.
No truncation and no summary: someone confirming a memory has to be able to read the exact sentence
that will be stored, and an ellipsis in the middle of it makes the confirmation meaningless. Under it,
one line saying why it is being offered — 「次にどうしたいか書いたことを、やり方として残せます。」 —
which is a statement about the text, never a claim about the person.

Two buttons: `覚えておく` and `今はしない`. The second is a real decline, not a snooze: the card
disappears and nothing is stored.

**The candidate has no row behind it.** It arrived in the response body of what the person just wrote,
and if they close the tab it is gone. There is no draft, no pending record, no "we'll ask you later"
queue. That is the whole design: the product cannot end up holding something a person never agreed to,
because there is nowhere for it to be held.

**Candidates are quotes, not conclusions.** `buildMemoryCandidates` is deterministic and calls no
provider — it wraps a sentence the person already wrote in the minimum framing needed to read as a
memory. It never proposes remembering something inferred, because a candidate that said something new
would be a claim the person never made and would be confirming without having written it. This is also
why the confirm-before-save flow works with every AI provider switched off, which is their current
state.

**One honest detail about what is actually offered today.** `buildMemoryCandidates` reads two
reflection fields, `what_learned` and `next_time`. Neither flow asks `what_learned` any more and
`createReflection` writes `null` into it, so that branch is unreachable from either current flow: a
reflection offers **at most one** candidate, from `next_time`, typed `preference` and labelled
`好みや、やり方`. Creating a goal offers one from the title. Nothing else in the product produces a
candidate.

### What confirmation actually guarantees

`POST /api/life/memories` refuses anything where `confirmed !== true` with a 409, before any database
call. The RPC checks it again, and the table carries `check (user_confirmed = true)` — so an
unconfirmed memory cannot exist even if both application checks were removed. The `digest` sent
alongside is an **integrity** check, not an authenticity one: it catches a candidate mutated in flight
or a payload assembled from the wrong field, and it proves nothing about whether a human read the
sentence. Nothing sent from a client can prove that. The guarantee lives in the schema.

**The AI never saves a memory on its own.** `create_memory_without_confirmation` is a declared
prohibition in `AI_BOUNDARY.prohibited`, asserted by test so the list cannot be quietly widened.
Beyond that, there is nothing to prohibit: the assistant writes nothing at all, produces no candidates,
and the only memory write path in the codebase is `confirmMemory`, which passes the person's
confirmation through rather than hardcoding it — a caller that forgot to collect one must be rejected,
not silently corrected into a save.

### `/life/memories`

**What they see.** 「覚えていること。」 and 「あなたが「覚えておく」と決めたものだけが、ここにあります。忘れると、消えます。」 With nothing stored: 「まだ何も覚えていません。あなたが確認したものだけが、ここに残ります。」

There is no "learned" section, no inferred section and no confidence score, because nothing here was
inferred.

**Editing re-confirms, in two steps.** `書きかえる` opens a textarea. Nothing saves on blur. Pressing
`この文章にする` moves to a confirmation showing the new sentence complete and verbatim, with the
consequence stated: 「この文章に置きかえます。もとの文章は残りません。」 Only `置きかえる` writes;
`書き直す` goes back, `やめる` restores what was there. On success: 「書きかえました。」

The second step is not ceremony. An edit **replaces the sentence the person agreed to**, so it needs
the same act of agreement the original required — `parseMemoryUpdateInput` throws
`memory_requires_confirmation` unless `confirmed` is exactly `true`. Said precisely, because it is
weaker than creation: `yorisou_osf1_memory_update` has no `p_user_confirmed` parameter, so the
consent check lives only at the route. What the RPC re-checks is the digest, recomputed over the
bytes it is about to store. The alternative would be treating a stored memory as a text field that
happens to be persisted.

Only the sentence can change. `memory_type`, `source` and every subject link are what the memory *is*;
the RPC has no parameters for them, so changing one memory into a different one under a stable id is
not expressible.

**Deleting is a hard delete, and the copy says so.** The control is `忘れる`. The row is removed. It is
not hidden, not archived, not deactivated — any of those words would be a lie about what happens, and
the one thing a memory surface has to be honest about is disappearing. If it fails: 「消せませんでした。まだ残っています。」

After a hard delete the audit row is the **only** remaining evidence the memory existed or that the
person asked for it to go, which is why `yorisou.life.memory.deleted` is written inside the same
transaction. A 404 means nothing was deleted and nothing was recorded, so an id that is not yours
cannot be used to manufacture a deletion record.

### Which mutations are transactional, and which are not

| Written inside the mutation's transaction | Best-effort, after the fact |
|---|---|
| `yorisou.life.reflection.created` | `context.updated` |
| `yorisou.life.memory.confirmed` | `state.created` · `state.annotated` |
| `yorisou.life.memory.deleted` | `goal.created` · `goal.status_changed` |
| `yorisou.life.memory.updated` | `experience.created` · `experience.updated` |
| | `assistant.drafted` · `assistant.refused` |

The right-hand column is correct as best-effort because each of those mutations is self-evidencing —
the row itself is the record and nothing was destroyed. The left-hand column is not: it covers the two
consent acts, the one destructive act, and the longest-lived content the Life OS holds.

---

## 5. Review — `/life` and `/life/timeline`

### わたしの記録

**What they see.** A private surface (`robots: index false`), opening with the promise it can actually
keep:

> ここに残したものは、
> ほかの利用者に表示されません。

and, as a separate sentence rather than a qualifier tucked into the heading, the part about internal
handling: 「保存先はYorisouのサーバーです。運営が内容を見るのは、安全確認が必要なときに限られます。」

The wording is deliberate. 「ほかの利用者に表示されることはありません」 is a statement about other
users, which the code enforces. 「あなただけが見られます」 would be a statement about everyone, which
it does not — and `osf1Boundaries.test.ts` ("no surface claims absolute user-only visibility") fails if
any surface under `app/life`, `app/today`, `app/experiences` or the Life OS libraries reintroduces that
phrasing. The source comment in `privacyCopy.ts` points at an `osf1PrivacyCopy.test.ts` that does not
exist; the assertion is real, the filename in that comment is stale.

Then five quiet rows — `いまの状態`, `向かいたい方向`, `振り返り`, `経験`, `覚えておきたいこと` — each
showing at most three recent lines and one link. An empty section says so in one line and offers the
action: 「まだ記録はありません。」, 「まだありません。」, 「まだありません。あなたが確認したものだけが残ります。」

**`前に残した状態`** lists up to six earlier moments, each with a date, the chosen tags, and anything
written alongside them, closing with 「どれも、その時の記録です。」 It is a list and deliberately
nothing more: no chart, no average, no trend, no count, no comparison between one day and the next.
Each of those would turn a record of how someone *was* into a measurement of how they are *doing*, and
the reading it invites — "I am getting worse" — is a claim this product does not get to make about
anyone. Six heavy days are six days, not a personality.

### これまで

**What they see.** 「これまで。」 and a single chronological list of up to twenty entries across five
kinds, each line reading `2026年8月15日 · 経験`. Empty: 「まだ何もありません。」

Reflections are labelled by the flow that wrote them — `かるく振り返る` or `じっくり振り返る` — which
says which questions were asked, not which entry is worth more. A mode this build has no label for
falls back to the plain kind rather than throwing, because a migration can reach the database before
the code that knows about it reaches the browser.

**This is a chronological view, and it is not a Life Graph.** The distinction is exact and worth
stating once so it can be cited: a view *sorts records that already exist* by a timestamp they already
carry, and stores nothing. A graph *asserts relationships* — edges, inferred links, "this reflection is
about that goal" — and an assertion is a new claim about a person that has to be stored, governed and
erased. `lib/server/lifeOs/timeline.ts` reads owner-scoped rows, orders them by `created_at`, and
writes nothing. There is no relationships table, and a test fails if any migration in this package ever
creates a table whose name contains `relationship|edge|graph|link`. The one link that appears — a
reflection's `experience_id` — is a foreign key the **person** created by choosing to reflect on an
experience; it is not derived.

Assessment results are excluded, deliberately. A timeline mixing a two-tap check-in with a
120-question methodology result would present them as the same kind of evidence.

---

## 6. Return — `前にいたところ`

**Where they are.** Back on `/life`, after some time away. This section renders **above everything
else**, before anything asks them to do something new.

**What they see.** Only what they left:

- the opening line of their last reflection;
- if that reflection has optional answers still empty, and only then: 「書きかけのままのところがあります（感じたこと・試したこと）。そのままにしておいても構いません。」
- 「いま向かっている方向：〈title〉」 when a goal is `active`;
- 「最近書いた経験：〈title〉」;
- a link, `これまでを見る`.

The unfinished labels come from the questions that were actually put to that person — the row's own
`mode` decides the set. The two modes name even their shared field differently
(`次に活かせそうなこと` / `次にしたいこと`), and a fixed list measured against every row used to report
a completed deep reflection as unfinished. It is named as an offer, never as an outstanding task:
`書きかけ`, not `未完了`, and the sentence that follows gives permission to ignore it.

**If there is nothing to show, nothing renders.** Not an empty frame, not an invented encouragement.

**What the product does NOT do here, and why each is absent.**

| Absent | Reason |
|---|---|
| streak, visit counter | counting visits turns returning into a score to protect |
| 「N日ぶりですね」 | measuring absence makes the gap the subject instead of the person |
| notification, reminder, scheduled prompt | a return the product asked for is not a return |
| daily target, completion state | a life is not a checklist |

---

## What the person is never subjected to

Each claim below was checked against the code, and the check is named so it can be repeated.

| Claim | How it is verified |
|---|---|
| **No streaks or counters.** | Nothing in `app/life/**`, `lib/life-os/**` or `lib/server/lifeOs/**` counts visits, days, or entries. `/life` shows three recent lines per section and no total; `これまで` shows entries, never "N件". |
| **No daily targets or completion states.** | No surface defines a target. `ReturnSection` treats empty answers as an offer, and the reflection flow saves after one answer. |
| **No progress bars.** *(stated precisely)* | There is no percentage, meter, or completion ring anywhere in the loop. There **is** a plain position counter — `1 / 2` on the check-in, `3 / 5` or `4 / 7` in the reflection flow. It says where you are in a list of questions; it does not measure you, and it does not fill up. |
| **No notifications or reminders.** | No `Notification` API call, no service-worker push, no scheduled job touches any Life OS surface. (The product has a `lineNotificationsEnabled` preference on the *support* profile — a different subsystem entirely, and nothing in this loop reads or writes it.) |
| **No ranking.** | Nothing sorts by importance, quality, or urgency. Every list in the loop is ordered by `created_at` and nothing else. |
| **No scoring of what they wrote.** | No code path reads reflection, goal, experience or memory *content* to produce a number. Memories carry no confidence score; states carry no value; the check-in "computes nothing about the person". |
| **No interpretation of who they are.** | The check-in reflects selections verbatim. The reflection flow never summarises anything back. The assistant runs only on a button press and its output passes `assertAiOutputWithinBoundary`, which rejects diagnosis, personality attribution, permanent-identity framing, sensitive-trait inference, and absolute certainty — discarding the whole draft on a violation. |
| **No trend, average or chart of state.** | `StateHistory` and `これまで` list moments. Neither computes across rows. |

Two more things a person cannot do, said plainly because their absence is also part of the experience:
**a reflection, a goal, a state record and an experience have no delete control on any surface** —
only a memory can be removed individually, with `忘れる`. Account-level erasure is registered:
`202608140002` adds all five OSF-1 tables to the POR-1 erasure plan, without which a person who deleted
their account would keep their state history, goals, reflections and memories on the server while
being told the deletion succeeded. The plan is **inert while the deletion executor is off**, and off is
the default: `isPor1CapabilityEnabled("ACCOUNT_DELETION_EXECUTOR")` returns false unless
`YORISOU_POR1_ACCOUNT_DELETION_EXECUTOR` is exactly `on`. No application code sets it; the only place
in this repository that does is the POR-1 harness `tests/por1/m3-journey-stack.sh`, for its own
disposable stack. Whether a hosted environment sets it is an environment fact, not a repository one —
`docs/ux2r/07_POR1_EXECUTION_STATE.md` records it as unset in Production and set in Preview.

---

## What does not exist

Stated here so nothing in the sections above is read as implying more than it says.

- **No Life Graph, and no relationships table.** The timeline sorts; it asserts nothing and stores
  nothing.
- **No autonomous agents.** No Companion Core, no Platform Orchestrator, no Specialist Agents. The
  Reflection Assistant runs only when a person presses `整理してもらう`, reads nothing stored, persists
  nothing, keeps no state between calls, and its output is never applied automatically.
- **No Legacy, no marketplace, no cross-project integration.**
- **No permission service.** `use_permission` / `permissionCheckService` are named in the entity model
  and are unbuilt, which is precisely why the assistant reads nothing.

---

## Where this journey is available

`lib/life-os/access.ts` names four activation states — **OFF**, **INTERNAL**, **PREVIEW**, **PUBLIC** —
and the default is OFF everywhere. What actually gates a surface is narrower than that list suggests,
and the difference matters:

| Context | Can a person reach `/life`? | Can they write? |
|---|---|---|
| production | **No.** `deploymentContext()` → `denied_production`; every route 404s | no |
| unknown context | **No.** Fails closed → `denied_unknown_context` | no |
| vercel preview | only with the `osf1_life_os_preview` dev flag | additionally requires `YORISOU_OSF1_LIFE_OS_SCHEMA_READY=true` |
| local / test | yes | additionally requires the schema-ready flag |

**PUBLIC is unreachable by construction** — no environment variable in this codebase returns it, and
adding one is a Founder act at Gate 5.

**INTERNAL is defined and tested but wired to nothing.** `lifeOsInternalAccess()` correctly answers
"production + pilot token + authenticated Founder/Admin", and `osf1Activation.test.ts` exercises every
refusal reason — but no page and no API route calls it. Every surface consults `lifeOsAccess()` alone,
which denies production unconditionally. So setting the `osf1_life_os_internal` pilot token today would
change the reported activation state and open nothing: production still 404s. Said plainly because the
state name could otherwise be read as a route that exists.

The read gate and the mutation gate are separate on purpose. Reads degrade to an empty state when the
database has no Life OS tables; writes cannot degrade — they fail, and a person who typed a reflection
loses it. The gate is checked before the session lookup, so a closed route answers identically to a
signed-in and a signed-out caller, and before the request body is read, so a write that cannot succeed
is refused before someone's text is accepted and then dropped — the person is told
「いまは保存を受け付けていません。書いた内容はこの画面に残っています。」 rather than losing the text.

**No migration has been applied to any database.** Production remains closed.

---

## Governance note

This package's own materials name "Project Constitution v0.7.0" and "Technical Architecture v0.7.0".
**Neither document exists in this repository.** The governance corpus actually installed here is
**YORISOU Governance Pack v0.4.1** (`resources/governance/current/RESOURCE_MANIFEST.md`), whose
constitutional and operations documents are `Yorisou_Project_Constitution_v0.4.0.md` and
`Yorisou_Technical_Architecture_v0.4.0.md`. Where this document's constraints trace to governance, they
trace to that pack. A version number that names no document cannot be cited, and repeating one would
make every claim resting on it unverifiable.

---

## Version history

- **v1.0 (2026-08-15)** — written for the Phase 1 completion package, against the surfaces in
  `app/life/**`, `app/today/check-in/**`, `lib/life-os/**` and `lib/server/lifeOs/**` as they stand in
  the working tree on `feat/osf1-life-os-activation` (head `a6305f0`; the package is not yet
  committed, so the branch as pushed does not contain these surfaces).
