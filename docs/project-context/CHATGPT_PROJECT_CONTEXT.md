# YORISOU — ChatGPT Project Context

*(Package 20, 2026-07-15 · self-contained upload for ChatGPT Project Resources · verified at `main` @ `334a8057`)*

## 1. What YORISOU is

A **Japanese-language, mobile-first emotional-companionship product**. A personality test is the **acquisition and understanding entrypoint — not the entire product**; the product is the continuing relationship: a staged, story-like result experience, then ongoing gentle companionship through **LINE** (the primary retention channel), with optional paid detailed reports under explicit consent and human review.

Hard boundary: **never medical** — no diagnosis, treatment framing, or clinical language anywhere. AI-derived statements are always **interpretation** (解釈) with honest, word-based confidence and visible limits — never objective truth or fake scientific precision.

## 2. Users and problem

Japanese-speaking adults on their phones who live in the gap between "I'm fine" and "I need professional help": they want private, low-pressure, continuing understanding — without counseling stigma/cost, social-media exposure, or throwaway quiz emptiness. YORISOU answers with warmth, honesty about its limits, consent before depth, and a relationship that continues in the messaging app they already use.

## 3. Current state — honest and exact

- **Live in production**: verified production commit `334a8057` (= `main`) on Vercel, **https://yorisou.online**. **Auto-deploy policy: every push to `main` deploys production** (founder policy: merge gates = release gates). Project currently **PAUSED**, no active writer.
- **Active runtime: the verified 120-question set** (`data/yorisou/120q-question-bank.generated.json` + scoring master; contract-tested). A **990-question bank is founder-reported content-complete but NOT activated** — activation is a founder decision with taxonomy/scoring impact analysis, not a content swap.
- Implemented and verified: AI-native **result reveal on `/result`** (staged, skippable, progressive enhancement over server-rendered summary-first content; source grammar 回答から/タイプ解釈/限界; server-SVG trait constellation with non-measurement caveat; privacy and limits panels; gentle declinable actions). Dependency posture: next 16.2.10 line, zero production HIGH/CRITICAL OSV.
- Operations corpus in `docs/` (40+ versioned files) governs consented pilots and paid-report operations (consent copy, quality rubrics, retention/non-use policies, admin tooling specs).
- **Known open item — YRR-1**: transient `aria-hidden-focus` on `/result` during the staged-reveal window. **DEFERRED_BY_FOUNDER, non-blocking, NOT fixed** (Package 12 canceled before execution; revisit triggers recorded). Never describe it as resolved.

## 4. AI-native principles (permanent)

Interpretation-not-truth framing; never medical; consent precedes depth (specific, revocable, warmly designed); optional progression — kind to the user who does nothing; emotional safety outranks engagement; progressive disclosure (summary first, server-rendered first); privacy by architecture with documented non-use policies; human review on paid reports; **no automatic LINE sending without explicit product authorization**; no autonomous product-write permission for any AI.

## 5. UX direction (permanent, YORISOU-specific)

**Gentle emotional clarity** — a warm letter from someone who listened. Emphasize: Japanese mobile reading rhythm; progressive disclosure; consent as a felt quality; human warmth without medicalization; meaningful result storytelling (narrative + visible limits); relationship continuity into LINE in the same voice; subtle slow motion respecting reduced-motion; zero-pressure next actions with dignified declines. Reject: clinical-diagnosis aesthetics, gamified addiction loops, streak pressure, fake precision ("97% accurate"), coin/token mechanics, generic chatbot-first UI, automatic external messages, dark conversion patterns.

## 6. Current priority

**PAUSED — no active package.** Queued (founder decisions, none started): YRR-1 revisit on its triggers; 990-bank activation decision; `governance/v0.4.0-activation` branch disposition; dev-tooling OSV refresh (dev-only). Decisions not to reopen casually: result taxonomy + scoring algorithm; the non-medical boundary; consent-first LINE posture; Japanese public voice; 120-question runtime as the active set.

## 7. Working rules for conversations

- Repository code and live Git state are implementation truth; this file summarizes — it never overrides evidence. Planned work is never described as completed.
- Because `main` auto-deploys production, **any repository push is a release act** — it happens only inside a founder-authorized package holding the canonical writer lock. ChatGPT conversations advise and draft copy/strategy; they do not execute repository changes.
- Public product copy is Japanese, in YORISOU's voice; brand tokens, persona assets, and typography are preserved.
- Never draft copy that medicalizes, pressures, fakes precision, or pre-checks consent.

## 8. Authoritative file map (in-repo)

`PROJECT_START_HERE.md` (entrypoint) → `docs/project-context/` (vision, users, positioning, AI-native principles, UX direction, current state/priority/handoff, tool startup protocol) · `data/yorisou/120q-*.generated.json` (runtime identity, contract-tested) · `docs/` operations corpus (consent/report/pilot governance) · `AGENT_PROJECT_RULES.md` + `PROJECT_MANIFEST.yaml` (execution identity). Lifecycle truth (registries, RELEASE_REGISTRY, locks, vault) lives in the founder's AI-Workspace control plane.
