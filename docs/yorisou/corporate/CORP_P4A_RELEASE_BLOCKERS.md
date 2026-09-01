# CORP-P4A — Release Blockers

**Package:** CORP-P4A · **Date:** 2026-08-24 · **Branch HEAD after this package:** see the handoff.
**Status: ALL FOUR BLOCKERS REMAIN OPEN.** Nothing in CORP-P4A closes any of them.

---

## 1. `COMPANY_REGISTRATION_SOURCE_REQUIRED` — OPEN

No 履歴事項全部証明書 and no 定款 exists in the approved workspace. Until one does, no company fact
may be published: 商号 · 本店所在地 · 郵便番号 · 設立年月日 · 代表者（氏名・肩書） · 法人番号 ·
資本金 · 登記された事業目的.

The local `/company` candidate renders the designed pending state and **zero legal values** —
verified: 代表取締役 = 0, 福岡県福岡市 = 0, 「寄り添う（Yorisou）」 = 0.

**Clears when:** the registration document is placed in the workspace and the values are transcribed
from it.

## 2. `VERIFIED_CORPORATE_CONTACT_REQUIRED` — OPEN

No verified corporate contact channel exists. The local `/contact` candidate has **no form, no
`mailto:`, no `<input>`, and submits nothing** — verified. A form with no confirmed destination
collects messages that go nowhere, which is worse than an honest absence.

**Clears when:** a corporate contact address or endpoint is confirmed and its handling is decided.

## 3. `CONSUMER_ROUTE_FINAL_DISPOSITION_REQUIRED` — OPEN

CORP-P4A deliberately **did not** delete, move, rewrite or redirect a single consumer route. All of
`/me`, `/life`, `/tests/*`, `/result`, `/saved`, auth, `/line/*`, `/share/*`, `/reports/*`,
`/dashboard/*`, `/admin/*` behave exactly as before, with unchanged authentication, data access and
feature flags. They are simply absent from corporate navigation, the footer and the sitemap.

**This is the CORP-P4B decision**, per route: `RETAIN_GATED` · `REDIRECT` · `RETIRE` · `REPLACE`.
Two prerequisites carry real obligations: the Life OS is live for authenticated users, and if
accounts are retired, existing users need an export and deletion path **first**.

**Clears when:** CORP-P4B records a per-route decision with evidence.

## 4. `PRODUCTION_RELEASE_AUTHORIZATION_REQUIRED` — OPEN

The branch is local and **has never been pushed**. Production still serves `b5521141` and is
unchanged. No deploy, no DNS change, no Vercel change.

**Clears when:** the Founder authorizes a release, after blockers 1–3 and a final visual acceptance.

---

## Not a blocker, but still true and still wrong

**Production `/company` continues to publish unverified legal information, including 代表取締役 — a
株式会社 title a 合同会社 cannot hold.** CORP-P4A corrected the **local candidate only**. The live
page is untouched and remains incorrect today.

```
LOCAL BRANCH CANDIDATE: CORRECTED
PRODUCTION /company:    STILL UNCHANGED
```

Correcting the live page does not require the corporate site to ship — it is a separate, smaller,
independently authorizable action.
