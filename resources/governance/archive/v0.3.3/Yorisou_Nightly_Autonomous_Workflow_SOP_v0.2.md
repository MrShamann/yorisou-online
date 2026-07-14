# YORISOU Nightly Autonomous Workflow SOP v0.2

**Status:** Approved  
**Runtime:** OpenClaw  
**Orchestrator:** Akari  
**Harness:** Hermes

## 1. Purpose

Nightly workflows keep YORISOU useful and current without requiring continuous founder operation.

## 2. Default Nightly Scope

Nightly execution may:

- refresh approved resource candidates;
- verify links, availability, and source freshness;
- identify duplicated or low-quality recommendations;
- summarize save, try, helpful, hide, and report signals;
- generate internal state-topic candidates;
- detect local-resource gaps;
- generate test-question candidates for sandbox review;
- identify product and service opportunity candidates;
- calculate Agent quality, provider health, and cost metrics;
- prepare an Akari founder brief.

## 3. Prohibited Nightly Actions

Nightly workflows must not autonomously:

- modify the production 120-question core methodology;
- publish invented user experience;
- contact partners or suppliers;
- launch paid products or pre-sales;
- change prices or commercial terms;
- alter governance;
- activate Digital Legacy;
- modify production code;
- send unapproved high-frequency LINE messages.

## 4. Output Queues

Outputs must enter one of:

- low-risk auto-update queue;
- recommendation-candidate queue;
- content-candidate queue;
- test-evolution sandbox;
- moderation review queue;
- product-opportunity queue;
- founder review queue;
- failure and retry queue.

## 5. Morning Brief

Akari should produce a concise brief containing:

- completed runs;
- failed or paused runs;
- meaningful user and demand signals;
- new resource and local candidates;
- safety or moderation alerts;
- provider health and cost exceptions;
- decisions requiring Edward.

## 6. Safety and Cost Stops

A workflow must stop or pause when:

- data classification is unclear;
- provider policy or retention terms are unsuitable;
- schema validation repeatedly fails;
- cost exceeds the approved envelope;
- output quality falls below threshold;
- user-facing impact cannot be reversed;
- cross-project isolation is violated.
