# YORISOU Phase 1 — Founder test script

**20–30 minutes.** For Edward, after the migration and INTERNAL activation steps in
`PHASE1_ACTIVATION_RUNBOOK.md` have been completed. Nothing here requires a developer.

**Before you start:** you must be signed in with the account whose email is in the admin allowlist.
If `/life` returns "not found", stop — that is the access gate, not a bug, and it means one of the
four INTERNAL preconditions is missing.

Read the **FAILURE SIGNAL** column as "stop and write it down", not "the product is broken".

---

| # | Action | Expected | Failure signal | Note for Edward |
|---|---|---|---|---|
| 1 | Open `/life` | 「わたしの記録」 with quiet sections, no dashboard feel | 404, or it looks like an admin panel | Do you know what this page is *for* within 5 seconds? |
| 2 | From Today, record a state (two taps) | Saves; Today shows 「前回の記録」 | Error, or nothing appears | Did two taps feel like enough, or too little? |
| 3 | On `/life`, look at the state history | Recent states with mood/energy/note, as moments not a chart | Only tags; or it reads like a graph | Does seeing your own past states feel useful or exposing? |
| 4 | Create a direction (`/life/goals`) | Saves; no deadline, no progress, no streak anywhere | Any due date, percentage or streak | Does this feel like a to-do app? It must not. |
| 5 | Record an experience (`/life/experience`) | Privacy sentence visible **before** you type; PRIVATE by default | Disclosure appears after the form, or claims 「あなただけが見られます」 | Would you write something real here? |
| 6 | Light reflection (`/life/reflect`) | Exactly 5 questions; only the first required | A 6th question, or it refuses to save with blanks | Does it feel like a form or a conversation? |
| 7 | Link the reflection to a state, if offered | Optional; skipping is fine | Auto-linked without asking | Linking must never be automatic. |
| 8 | Save a memory when offered | Confirmation asked first; saved only after you agree | Anything saved without a confirmation step | This is the single most important boundary in the product. |
| 9 | Open `/life/memories` | Each shows kind, source, date, status on one line | A compliance table | Can you tell at a glance what the product is holding? |
| 10 | Suppress a memory (「いまは使わない」) | Disappears from `/life` and the timeline; still listed here | Still shown on the hub | Suppression must be real, not cosmetic. |
| 11 | Restore it (「また使う」) | Returns to normal use | Cannot be restored | |
| 12 | Deep reflection (`/life/reflect?mode=postmortem`) | 7 questions incl. 「どんな選択肢がありましたか」 | 5 questions, or the options question missing | Does it help you separate the decision from the result? |
| 13 | Use the assistant (「下書きを見る」, last screen only) | A draft appears in its own box **beside** your words; nothing replaces them | Text replaced automatically, or a claim about you | Does it feel like help, or like being analysed? |
| 13a | Press 「使わない」 | The draft disappears, your words are untouched, and the offer comes back | The draft stays, or your text changed | Declining must be as easy as accepting. |
| 13b | Press 「下書きを見る」 again, then 「この内容を使う」 | The draft is **appended** to your last answer, not substituted for it | Your own sentence is gone | You must be able to edit it afterwards. |
| 13c | If providers are off (the normal state) | 「いまは整理を利用できません。このまま書き終えられます。」 and you can still finish | The flow blocks, or your text is lost | The assistant is optional by design. |
| 14 | Open `/life/timeline` | Chronological list; the filters read すべて / 状態 / 経験 / かるく振り返る / じっくり振り返る / 方向 | 「体験」 and 「経験」 both on screen, or anything claiming causes and connections | Does it read as a record or as admin history? |
| 14a | Press 「かるく振り返る」, then 「じっくり振り返る」 | Each shows only its own kind; the current filter is marked | A filter that shows everything, or nothing marked as current | Two names for one thing is the bug to watch for. |
| 15 | Return to `/life` | A small continuity card, or nothing | A feed, a streak, or 「昨日は書けませんでした」 | Return must never scold. |
| 16 | Revoke a memory (「もう使わないことにする」) | Asks twice, says it cannot be undone, then stops using it | One tap, or silently reversible | |
| 17 | Try to restore the revoked memory | Not offered | Restore appears | Revocation is terminal by design. |
| 18 | Delete a memory (「忘れる」) | Gone from the list | Still present | The copy says it is deleted; it must be. |
| 19 | Sign in as an ordinary account and open `/life` | 404, and no Life link anywhere on `/me` | Page loads, or a link is visible | Nothing may hint the feature exists. |
| 20 | Remove `osf1_life_os_internal` from the pilot flags, **then redeploy** | `/life` 404s for you too; you are still signed in | Still accessible after the redeploy, or you were signed out | **The kill switch.** Recovery class is MEASURED as `restart_required`: changing the variable alone does NOT close the feature on a running process. On Vercel that means a redeploy. See `PHASE1_FOUNDER_INTERNAL_BETA_RUNBOOK.md`. |
| 20a | Restore the flag and redeploy | Access returns and every record is exactly as it was | A record is missing or duplicated | Turning it off and on again must cost nothing. |

---

## What to write down

For each step: **did it work**, and **how did it feel**. The second matters more here. Phase 1 is a
product about people writing honestly, and the failure mode is not a crash — it is a screen that
makes someone decide not to write.

Three questions worth answering at the end:

1. After twenty minutes, could you explain to a friend what 「わたしの記録」 is?
2. Was there any moment you hesitated to type something true?
3. Did the assistant ever feel like it was telling you about yourself rather than helping you write?
