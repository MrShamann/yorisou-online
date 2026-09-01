# START HERE — `yorisou-online`

**Single authoritative entrypoint for this REPOSITORY.** Read this before planning or editing
anything.

This repository carries **two protected surfaces**. It is not one product. Read the surface you are
working in, and treat the other one as protected territory you may not mutate.

Neither surface grants permission to change the other's protected domain. Corporate website work
must pass consumer non-regression. Consumer governance cannot silently overwrite corporate public
truth. Strategy for the corporate surface is governed at the YORISOU v1.2 level; **implementation
truth is always this repository and its live Git state** — a plan is never implementation evidence.

---

## Surface A — Corporate / Yorisou Foundry website

**Status: Preview only. Never merged to `main`, never deployed to Production.**

YORISOU LLC / Yorisou 合同会社, operating as **Yorisou Foundry**: finding structural problems,
building evidence and venture assets, forming founding teams, and carrying ventures toward
independently governed companies. Ventures: **Mirai Move · Kakari · Chigamo**.

**Asterion OS is an independent shared technology and execution platform. It is NOT a public
Yorisou venture.** Yorisou ventures may use Asterion capabilities where appropriate authorization
exists. Ownership, licensing, data rights and operating responsibility depend on the agreements
that apply — this repository draws **NO ownership conclusion in either direction**. No "powered by"
claim, no executed-licence claim, and no claim that venture or user data flows to it.

> CORP-v1.4 withdrew the earlier absolute "It is NOT owned by Yorisou" that stood here, because an
> unsupported denial is still an unsupported claim; see `CORP_V12_PUBLIC_CLAIM_LEDGER.md` C-68. This
> file was missed at the time and corrected in CORP-v1.4R1.1 — which is exactly how a withdrawn
> claim gets written back onto a page, since every agent is required to read this file first.

Covers: corporate public routes · venture presentation · the Foundry narrative · the Asterion public
narrative · founder / government / university engagement pages · corporate multilingual content ·
corporate SEO, robots and routing · the corporate contact UI.

| Read | Answers |
|---|---|
| [docs/yorisou/corporate/CORP_V12_DUAL_SURFACE_REPOSITORY_ADR.md](docs/yorisou/corporate/CORP_V12_DUAL_SURFACE_REPOSITORY_ADR.md) | why two surfaces share this repo, and what it does not authorize |
| [docs/yorisou/corporate/CORP_V12_EXECUTION_BRIEF.md](docs/yorisou/corporate/CORP_V12_EXECUTION_BRIEF.md) | scope, authority, exclusions |
| [docs/yorisou/corporate/CORP_V12_PUBLIC_CLAIM_LEDGER.md](docs/yorisou/corporate/CORP_V12_PUBLIC_CLAIM_LEDGER.md) | every public claim, its evidence, and what is deliberately omitted |
| [docs/yorisou/corporate/CORP_V12_ROUTE_AND_SURFACE_MATRIX.md](docs/yorisou/corporate/CORP_V12_ROUTE_AND_SURFACE_MATRIX.md) | which surface owns which route |
| [docs/yorisou/corporate/CORP_V12_RELEASE_BLOCKERS.md](docs/yorisou/corporate/CORP_V12_RELEASE_BLOCKERS.md) | what still blocks Production |
| [docs/yorisou/corporate/CORP_P5R2_ROUTING_MIGRATION.md](docs/yorisou/corporate/CORP_P5R2_ROUTING_MIGRATION.md) | the `?lang=` Preview strategy and the path-routing migration |

Code lives in `app/_corporate/**` with its guards in `tests/corporate-p5r2/**`.
**Never** publish a claim the claim ledger does not support. **Never** present Asterion as owned,
licensed or "powering" anything. **Never** publish the internal contribution-economics percentages.

---

## Surface B — Legacy consumer YORISOU

**Status: LIVE in Production at https://yorisou.online. Protected.**

A Japanese-language, mobile-first emotional-companionship product. A personality test is where people
first feel understood; **LINE** is where the relationship continues. It is **never** medical,
diagnostic or treatment-oriented, and its public product language is **Japanese**.

Covers: consumer routes · auth and account · the **120-question** runtime · scoring, taxonomy and
results · LINE continuity · consumer data and consent · Life OS / Today capabilities where present.

| Read | Answers |
|---|---|
| [docs/project-context/PRODUCT_VISION.md](docs/project-context/PRODUCT_VISION.md) | what & why |
| [docs/project-context/USER_AND_PROBLEM.md](docs/project-context/USER_AND_PROBLEM.md) | who & what problem |
| [docs/project-context/PRODUCT_POSITIONING.md](docs/project-context/PRODUCT_POSITIONING.md) | vs. alternatives; boundaries |
| [docs/project-context/AI_NATIVE_UX_PRINCIPLES.md](docs/project-context/AI_NATIVE_UX_PRINCIPLES.md) | permanent AI-native rules |
| [docs/project-context/UI_UX_CREATIVE_DIRECTION.md](docs/project-context/UI_UX_CREATIVE_DIRECTION.md) | permanent UX direction |
| [docs/project-context/CURRENT_PRODUCT_STATE.md](docs/project-context/CURRENT_PRODUCT_STATE.md) | what exists & production truth |
| [docs/project-context/CURRENT_PRIORITY.md](docs/project-context/CURRENT_PRIORITY.md) | what's being worked on |
| [docs/project-context/CURRENT_HANDOFF.md](docs/project-context/CURRENT_HANDOFF.md) | exact repo state; safe-to-switch |
| [docs/project-context/TOOL_STARTUP_PROTOCOL.md](docs/project-context/TOOL_STARTUP_PROTOCOL.md) | mandatory session preamble |

**Never** change the result taxonomy, scoring, or question set casually. **Never** send LINE messages
automatically without explicit product authorization. **Never** use medical or diagnostic framing.

### Open consumer issue — the Today landing surface

`app/page.tsx` was the consumer **Today** page until commit `9f0e8ff`, which promoted the corporate
site to the root URLs. Today was **not relocated**: the composition (utility hero → continuity →
今日のひとつ → 5-minute actions) now exists in no file, and `app/TodaySavedState.tsx` and
`app/TodayDiscoveryEntry.tsx` are orphaned. `app/today/check-in` and `app/today/discovery` survive.

`lib/server/__tests__/archP3DailyDiscovery.test.ts` assertion **L/M** has failed ever since and is
**correctly reporting a missing consumer surface**. It has not been weakened or rebound, because
rebinding it to a file that does not contain the composition would silently delete the protection.
Resolving it is a consumer product decision. See
[docs/yorisou/corporate/CORP_V12R1_PREMERGE_REMEDIATION.md](docs/yorisou/corporate/CORP_V12R1_PREMERGE_REMEDIATION.md).

---

## Authoritative sources (context summarizes, never replaces)

- **Implementation truth:** this repository + live Git state. The question bank / scoring runtime is
  `data/yorisou/120q-*.generated.json` (contract-tested — never casually changed).
- **Operations corpus:** `docs/` — versioned pilot/consent/report-operations documents (deep but
  historical-leaning; check version headers).
- **Lifecycle truth:** AI-Workspace registries, RELEASE_REGISTRY, locks, and Vault
  (`vaults/projects/yorisou-online/`).
- **Execution rules:** [AGENT_PROJECT_RULES.md](AGENT_PROJECT_RULES.md) +
  [PROJECT_MANIFEST.yaml](PROJECT_MANIFEST.yaml).

`PROJECT_MANIFEST.yaml` remains a single-`project_id` record. Its schema has no field for multiple
surfaces, and inventing one would make the machine record schema-invalid to make prose look tidier.
The dual-surface model is therefore documented here and in the ADR, not in the manifest.

Plans are not implementation evidence.
