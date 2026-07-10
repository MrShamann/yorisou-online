# Capability Package 3 test batch

## Selected production tests

| Rank | Test | Source | Questions | Decision | Reason |
| --- | --- | --- | ---: | --- | --- |
| 1 | C02 今のわたしチェック v1.0 | `generated/C02_ima_no_watashi_check_v1_0.ts` | 36 | Retain through engine | Existing production baseline and deterministic current-state framing. |
| 2 | F01 向いている働き方診断 v1.0 | `generated/F01_muiteiru_hatarakikata_shindan_v1_0.ts` | 60 | Migrate | Stable question IDs, Japanese copy, rule mapping and low governance risk when framed as reflection. |
| 3 | F02 職場環境フィット診断 v1.0 | `generated/F02_shokuba_kankyou_fit_shindan_v1_0.ts` | 60 | Migrate | Stable question IDs, deterministic dimension rules and a useful repeat-entry topic. |

## Deferred candidates

| Test | Decision | Reason |
| --- | --- | --- |
| R01 ふたり恋愛相性診断 | Defer | Multi-party answers and relationship data need a separate consent and ownership model. |
| R04 名前相性チェック | Defer | Name input needs a dedicated personal-data and sharing boundary. |
| S01 今日のおみくじ | Defer | Seeded lightweight result pool is not the same deterministic assessment contract. |

## Shared contract

The engine registry supplies test ID, version, locale, title, description, stable questions, validation, scoring adapter, result mapper, public and private boundaries, methodology, provenance, analytics namespace, and a safe LINE return target. Each source continues to own its scoring dimensions; the engine only standardizes validation, persistence and presentation boundaries.

## Explicit exclusions

No Provider execution, permanent persona assignment, 120-question redesign, R01/R04 personal-data migration, S01 migration, Agent Runtime use, workers, schedules, OpenClaw, Hinata, Akari, Mirai Move or Shigeru system is included.
