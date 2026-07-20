# MTF-2A — Daily Check-in: Benchmark and Format Decision (Forge step 5)

Per MTF-1 §6.2 the 24/48/60/72/84 main-assessment ladder does **not** apply to a `recorded_state` daily method — the compared set is check-in-appropriate formats.

## Compared formats

| Format | Daily repeatability | Timeline usefulness | Emotional burden | Verdict |
|---|---|---|---|---|
| 3-input ultra-quick (~30s) | excellent | **thin** — weather-only history has little to reflect on at 30 days | minimal | rejected |
| **5-input standard (~45–60s)** | **good** | **good — 5 axes make the 30-day view genuinely readable** | low | **SELECTED** |
| 7-input richer (~90s) | poor — daily fatigue compounds; abandonment risk by week 2 | marginal gain over 5 | noticeable | rejected |
| One-screen multi-input | fast; the whole entry is visible; feels like one gesture | — | low | **SELECTED as rendering mode** |
| One-item-per-screen | 5 taps + 4 transitions ≈ 90s; right for assessments, wrong for a daily ritual | — | — | rejected for this method |
| Free-text default-on | — | high (notes are rich) | **high daily** — a blank box every day becomes an obligation; privacy weight | rejected as default; **opt-in** `ひとことメモ` instead |
| 30s / 45–60s / 90s targets | 30s forces 3-input; 90s kills dailiness | — | — | **45–60s SELECTED** |

## Evaluation notes (per §6.2 axes)

- **Mobile fatigue / abandonment:** one screen, five taps, no typing by default — repeatable on a train platform.
- **Embarrassment (恥ずかしさ設計):** weather metaphors read neutrally over someone's shoulder; no words like 不安/落ち込み on the entry screen.
- **State coverage:** the five fields cover mood (weather), body (charge), cognition (余白), social (距離), and need (ほしいもの) — the smallest set where a 30-day timeline supports real reflection.
- **Recommendation usefulness:** `kyou_hoshii` (today's need) is the one field that maps directly to gentle hints without any scoring.
- **Accessibility:** five labelled radio groups, one screen, no time pressure; full labels in the copy bundle.
- **LINE compatibility:** a 5-choice × 5-field single screen fits a LIFF view; the same schema can render as a LINE quick-reply sequence later.

## Decision (recorded)

**5 required-optional inputs · one-screen · ~45s target · opt-in private memo (default off).**

いまの選定に科学的根拠は主張しない（「5項目が心理学的に最適」という主張は行わない）。選定理由は継続性とタイムラインの読みごたえの製品的な釣り合いである。

State schema, options and validation: canonical in `daily-check-in.v1.json` (`stateSchema`, version `daily-state-schema-v1`).
