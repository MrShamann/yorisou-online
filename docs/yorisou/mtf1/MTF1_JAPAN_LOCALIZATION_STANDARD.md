# MTF-1 — Japan Localization Standard（日本ファースト設計基準）

**Binding standard.** Every YORISOU method is a **Japan-first product**, not a translated one. This standard defines how a global or abstract test concept becomes a YORISOU product. It is checklist step 14 of the Test Pattern Forge and must be recorded per method.

## 1. Language register — 抑制された自然な日本語

- Restrained, warm, plain Japanese. No hype adjectives, no exclamation stacking, no AI-translationese (直訳調の禁止).
- Question stems are situations, not abstractions: 「会議で意見を求められたとき…」 not 「あなたは外向的ですか」.
- Result copy uses **current-state language, not permanent labels**: 「いまは〜の時期」「〜しやすい状態」— never 「あなたは〜な人」 as a fixed identity verdict. (This is the shipped house rule: interpretation-limit lines like 「今の傾向の整理。医学的・心理的診断ではない。」 are mandatory.)
- Avoid imported therapy/self-help jargon (セルフコンパッション, バウンダリー etc.) unless genuinely established in everyday Japanese AND reviewed; prefer ordinary words (「距離の取り方」「休み方」).

## 2. Context — where Japanese users actually live

- **Work/school**: 残業・シフト・年度替わり・異動・就活/転職・部活/サークル — question scenarios draw from these, not from US office tropes.
- **Relationship distance** (距離感) is a first-class concept: 返信ペース、既読、誘いの断り方、会う頻度 — the LD/RF/communication-rhythm family is built on this vocabulary.
- **Indirect communication**: questions must allow for 遠回しな伝え方・察し・空気 as normal strategies, never framing them as deficits.
- **Household & caregiving**: 同居/一人暮らし/実家、介護、子育て、パートナーとの家事分担 appear as ordinary contexts, phrased neutrally for all household forms.
- **Seasonal & life-stage**: 新生活（4月）、連休明け、年末年始、梅雨、受験期 — retest prompts and daily check-in copy may key to these; seasonal framing must not become horoscope framing for non-symbolic methods.

## 3. Privacy & embarrassment avoidance（恥ずかしさ設計）

- Assume completion in public (train, office, LINE): neutral screen appearance, no loud colors/labels on question screens, discreet wording.
- **Screenshot-safe result copy**: the public result surface must be safe if screenshotted — no sensitive inference, no vulnerable phrasing a user would be embarrassed to have seen.
- **Share-safe vs private split**: share cards carry only the share-line layer; deep/limit/next-step copy stays private. Nothing personal in URLs or query params beyond public result IDs (existing house rule).
- Two-person methods: the second person's name/answers are the FIRST person's sensitive data too — both-party consent design per the engine contract; no "check your partner without them knowing" framing, ever.

## 4. Mobile & LINE behavior

- Completion budget declared per method and honored: micro ≤1min, casual ≤5min, deep methods must support interruption + resume (train-commute reality).
- One-hand thumb reach; one question per screen for scenario formats; no hover-dependent interactions.
- LINE: login-return save is the established bridge; deep links must survive the LIFF/external-browser boundary; nothing is ever pushed to LINE without consent (existing reply-only rule).

## 5. Names, kana, kanji

- Name inputs accept kanji / ひらがな / カタカナ / romaji, mixed scripts, single-name entries, and long names; no "first/last" Western assumptions; furigana optional, never required.
- Name-based methods state explicitly what the name is used for and how long it is retained (P2 privacy class); the 姓名判断-denial boundary line is mandatory on every name method.

## 6. Accessibility & burden

- WCAG 2.2 AA baseline (existing project gate); full keyboard/screen-reader paths; `prefers-reduced-motion` honored on every reveal animation.
- Question count honesty: the advertised count equals the served count (the T4 「24問」/120問 mismatch is the canonical counter-example, never to be repeated).
- Reading level: result copy readable without specialist vocabulary; line length and contrast tuned for mobile.

## 7. What localization must NOT do

- Not soften honesty: interpretation limits and 「〜ではありません」boundary lines are part of the brand voice, not removable "negativity".
- Not convert current-state framing into fortune framing outside `traditional_symbolic*` methods.
- Not import Western test conventions (percentile scores, IQ-style numbers, letter grades) — YORISOU renders archetypes, states, and words, never universal numbers.
