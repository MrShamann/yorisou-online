# Yorisou Technical Architecture and Execution Protocol v0.3

**Status:** Approved  
**Owner:** Edward  
**Approver:** Edward  
**Approved Date:** 2026-07-10  
**Supersedes:** Yorisou Technical Architecture and Execution Protocol v0.2

---

## 1. Purpose

This protocol defines the v0.3 technical direction, system-of-record boundaries, Japan product and channel architecture, canonical entities, trust and moderation infrastructure, deployment assumptions, and Codex execution rules.

It protects against:

- channel lock-in,
- multi-region code forks,
- premature international infrastructure,
- social-feature overbuild,
- data-model drift,
- visibility failures,
- moderation gaps,
- secret exposure,
- Codex overreach.

---

## 2. Technical Doctrine

Yorisou must support:

> Enter -> Understand -> Express -> Discover -> Connect -> Recommend -> Act -> Reflect -> Learn -> Return

The system should remain simple enough for a one-person company while avoiding unnecessary future lock-in.

The intended direction is:

- one governed core codebase,
- locale-aware presentation,
- channel adapters separated from product logic,
- privacy and visibility as first-class data,
- event tracking before advanced analytics,
- thin vertical slices before platform overbuild,
- Codex as the sole formal repo execution agent unless Edward changes this rule.

---

## 3. Current Technology Direction

Intended production architecture:

- Vercel for production web runtime and delivery,
- GitHub as engineering source of truth,
- approved application database for operational data,
- object storage for artifacts where needed,
- LINE as Japan return and identity channel,
- Web as the primary product surface,
- email authentication as a current identity option, with additional provider login only after review,
- ChatGPT Project Resources for approved governance,
- Codex for repo implementation,
- governed automation for internal tasks only.

Existing repo and production systems must be audited, not discarded by assumption.

---

## 4. System of Record

### 4.1 Governance

Approved Project Resources contain locked governance.

### 4.2 GitHub

Contains code, schemas, migrations, tests, technical documentation, and implementation history.

### 4.3 Application Database

Contains operational identity, state, experience, recommendation, visibility, report, consent, moderation, and event data.

### 4.4 Artifact Storage

May contain generated reports, export files, internal intelligence, and approved automation artifacts.

### 4.5 Live Operating Records

Decision, risk, and task registers may be maintained in approved live systems.

---

## 5. Japan Product and Channel Architecture

### 5.1 Japan Product Core

The current product core includes:

- identity and account linking;
- consent and privacy controls;
- test and state logic;
- private state space;
- Experience Graph;
- Recommendation Graph;
- visibility and trust controls;
- reports;
- moderation;
- analytics and demand intelligence.

### 5.2 Current Interfaces

Current supported interfaces are:

- Japanese Web;
- LINE adapter;
- email authentication and account recovery;
- internal admin and moderation surfaces.

### 5.3 No Unnecessary Forks

Maintain one production repository and one coherent Japan product. Do not create international repos, country-specific forks, or multilingual community infrastructure during v0.3.

## 6. Channel Abstraction

Channel adapters may include:

- Web,
- LINE,
- email registration and recovery,
- QR and approved partner links.

Additional identity providers require separate approval.

Core business logic must not exist only inside a LINE webhook or any channel-specific route.

A channel identity is not the user profile.

---

## 7. Identity Architecture

Canonical direction:

- UserProfile represents the person,
- AuthIdentity represents a login or channel identity,
- UserProfile may link multiple AuthIdentity records,
- links require consent and verification,
- anonymous session may exist before profile creation,
- merging must preserve auditability and avoid silent identity combination.

---

## 8. Canonical Data Entities

### 8.1 Identity, Eligibility, and Consent

- UserProfile
- AuthIdentity
- AnonymousSession
- ConsentLog
- VisibilityConsentLog
- LocalePreference
- AuditLog

### 8.2 State and Test

- TestDefinition
- TestQuestion
- TestSession
- TestAnswer
- TestResult
- StateSnapshot
- StateTag
- StateHistoryEvent
- MethodologyVersion

### 8.3 Private State Space

- PrivateStateNote
- SavedItem
- IntendedAction
- TriedAction
- CheckInEvent

### 8.4 Experience Graph

- ExperienceCard
- ExperienceRevision
- ExperienceStateTag
- ExperienceOutcome
- ExperienceVisibility
- ExperienceProvenance
- ExperienceAttachment
- ExperienceDeletionRecord

### 8.5 Discovery and Interaction

- DiscoverySession
- DiscoveryCandidate
- DiscoveryImpression
- SaveEvent
- TryIntentEvent
- TriedEvent
- HelpfulnessEvent
- RelevanceFeedback
- ConstrainedResponseEvent
- TopicFollow

### 8.6 State Topics

- StateTopic
- StateTopicSubscription
- StateTopicContentLink
- StateTopicCheckIn

### 8.7 Recommendation

- RecommendationItem
- ResourceRecord
- RecommendationEvent
- RecommendationReason
- RecommendationFeedback
- CommercialStatus
- DisclosureLog

### 8.8 Reports and Commerce

- ReportProduct
- ReportGenerationEvent
- ReportAccess
- ReportFeedback
- PaidIntentEvent
- PurchaseRecord
- RefundRecord

### 8.9 Trust and Moderation

- BlockRecord
- ReportRecord
- ModerationCase
- ModerationDecision
- ContentSafetyReview
- AbuseSignal
- AppealRecord

### 8.10 Demand Intelligence

- DemandSignal
- InsightReport
- DatasetSnapshot
- AggregationRule
- AnonymizationReview
- ExternalReportApproval

### 8.11 Local and Mobility

- LocalSignal
- LocalPartnerNode
- MobilityLifeSupportInquiry
- PartnerLead
- ServicePartnerCandidate

MVP may simplify implementation, but schema naming and relationships must not contradict this direction.

---

## 9. Visibility Architecture

The six canonical visibility values are PRIVATE, INVITE_ONLY, SIMILAR_STATE_ONLY, ANONYMOUS_SHARED, PSEUDONYMOUS_SHARED, and PUBLIC_SAFE. Public anonymity is a presentation rule; internal safety references may still exist. SIMILAR_STATE_ONLY must not reveal another user's inferred state.

Every shareable object must store:

- owner,
- visibility class,
- visibility version,
- consent record,
- searchable status,
- audience rule,
- expiration if any,
- moderation status,
- deletion status,
- provenance,
- last visibility change.

Visibility must be enforced server-side, not only through UI hiding.

---

## 10. Experience Provenance

Every experience should preserve whether it is:

- real user submission,
- user submission edited by user,
- AI-assisted user submission,
- editorial example,
- synthetic demo,
- imported legacy content.

Synthetic or editorial examples must not be represented as real user testimony.

---

## 11. Discovery and Ranking

Initial ranking should use transparent bounded factors:

1. state relevance,
2. context relevance,
3. visibility eligibility,
4. safety and moderation status,
5. freshness,
6. outcome evidence,
7. diversity,
8. quality,
9. commercial value only after qualification.

The system should support limited result sets and stopping points.

Do not optimize for endless feed depth.

---

## 12. Event Tracking

Required first-phase events:

- entry_viewed,
- state_check_started,
- state_check_completed,
- result_viewed,
- private_state_saved,
- experience_draft_started,
- experience_visibility_selected,
- experience_published,
- experience_viewed,
- experience_saved,
- try_intent_recorded,
- tried_recorded,
- helpfulness_recorded,
- relevance_feedback_recorded,
- recommendation_viewed,
- recommendation_acted,
- topic_followed,
- content_reported,
- content_blocked,
- visibility_changed,
- content_deleted,
- return_visit.

Event definitions must distinguish intent from completed action.

---

## 13. Localization and Internationalization

The current active locale is Japanese.

Technical implementation should centralize user-facing strings where practical, but v0.3 does not require a language switcher, translated content, overseas locale routing, or international community support.

Japanese copy and Japan-market behavior are the source of truth for the current product.

## 14. Data Region Direction

Use the current approved production data region and avoid unnecessary multi-region replication.

The architecture must support:

- controlled access;
- backups;
- deletion workflows;
- audit logging;
- secure vendor configuration;
- data minimization.

Global multi-region synchronization is outside v0.3.

## 15. AI Architecture

AI use cases may include:

- state interpretation,
- public-safe rewriting,
- de-identification suggestions,
- experience matching,
- recommendation explanation,
- moderation triage,
- report drafting,
- demand clustering.

Requirements:

- provider configuration not hardcoded,
- secrets outside repo,
- purpose documented,
- data minimized,
- provenance preserved,
- user review before shared rewrite,
- no silent visibility change,
- fallback and failure behavior defined.

---

## 16. Moderation Architecture

No public user-generated content release should occur before report, block, delete/withdraw, review queue, provenance labeling, and basic abuse handling are operational. Early cohorts may use pre-publication review or tightly limited distribution.

Before open user contribution, support:

- automated flagging,
- founder/admin review queue,
- report categories,
- block control,
- visibility restriction,
- removal,
- evidence logging,
- status reason,
- repeat-abuse detection.

Moderation must not depend entirely on AI.

---

## 17. MVP Technical Scope

First-phase implementation should support:

1. Japanese Web product.
2. LINE login/account linking where supported by the existing architecture.
3. Email registration or secure passwordless login.
4. UserProfile with multiple AuthIdentity records.
5. Private state space.
6. Structured ExperienceCard creation.
7. Immediate publication after registration and required consent acceptance.
8. Visibility states needed for private and anonymous sharing.
9. State-based discovery.
10. SaveEvent, TriedEvent, HelpfulnessEvent, NotForMeEvent, ReportRecord, BlockRecord, edit, and delete flows.
11. Basic automated spam/abuse checks and rate limiting.
12. Post-publication moderation queue and administrative takedown.
13. Recommendation events and report bridges.
14. Core analytics.

Do not build first:

- adult eligibility gate;
- invitation-only registration;
- manual pre-approval pipeline for every post;
- unrestricted private messages;
- follower/following graph;
- public popularity ranking;
- infinite feed;
- international locale system;
- global multi-region synchronization.

## 18. Codex Execution Doctrine

Codex is the formal Yorisou repo execution agent.

Codex may:

- audit current repo,
- map legacy assets to v0.3,
- propose migration plans,
- modify approved files,
- implement bounded features,
- add tests and migrations,
- prepare deployment checks,
- produce evidence reports.

Codex may not:

- decide strategy,
- rewrite governance without explicit task,
- delete legacy assets without evidence and approval,
- change data visibility rules beyond scope,
- deploy production without approval,
- launch public community features,
- expose secrets,
- create market forks without approval,
- merge PRs unless Edward explicitly changes the existing workflow.

Every Codex task must define:

- objective,
- current evidence,
- allowed files,
- forbidden files,
- data and visibility impact,
- migration plan,
- validation commands,
- rollback,
- commit permission,
- deployment permission,
- output report.

If evidence is insufficient, Codex must report:

> UNKNOWN_NEEDS_CONFIRMATION

---

## 19. Migration Principle

v0.3 implementation must begin with an audit.

Existing assets should be classified as:

- retain unchanged,
- retain with adaptation,
- migrate,
- deprecate,
- archive,
- unknown.

No asset should be deleted merely because the strategic wording changed.

The fixed 31-persona assumption must not be introduced into new schemas or UI.

---

## 20. Validation Requirements

A v0.3 technical slice is not complete until applicable checks pass:

- typecheck,
- lint,
- build,
- tests,
- migration review,
- access-control test,
- visibility test,
- deletion test,
- moderation test,
- locale test,
- no-secret check,
- mobile UX review,
- manual smoke test.


---

## 21. AI-Native Runtime Architecture

Canonical runtime structure:

```text
Edward / Governance
        |
        v
Akari Platform Orchestrator
        |
        v
OpenClaw Runtime and Event Processing
        |
        +--> Hinata User Intelligence and Companion Orchestrator
        +--> Specialist Agents
        |
        v
Hermes Harness and Provider Router
        |
        +--> AI models
        +--> search and resource tools
        +--> image, audio, and voice tools
        +--> internal databases and artifact storage
```

Shigeru is outside this architecture and remains exclusive to Mirai Move.

## 22. Agent Harness Loop

All material Agent workflows should follow:

> Observe -> Classify -> Plan -> Route -> Execute -> Verify -> Review -> Publish or Queue -> Learn -> Measure.

Each run must retain task identity, project namespace, Agent version, prompt or workflow version, provider, tool calls, data classification, cost, latency, output schema result, review result, publication status, feedback, and failure state.

## 23. Canonical Agent Infrastructure Entities

Add or map equivalent records for:

- AgentDefinition;
- AgentContractVersion;
- AgentCapability;
- AgentEventSubscription;
- AgentTask;
- AgentRun;
- AgentStep;
- AgentArtifact;
- AgentReviewDecision;
- AgentEvaluation;
- AgentCostLedger;
- ProviderDefinition;
- ProviderHealthRecord;
- ProviderRoutingDecision;
- ToolPermission;
- WorkflowDefinition;
- WorkflowRun;
- HumanReviewQueueItem;
- AutomationPauseRecord;
- EventEnvelope.

Every record must include `project_id = yorisou` or equivalent hard namespace isolation.

## 24. Personal Memory and Companion Entities

Add or map equivalent entities for:

- PersonalMemoryItem;
- MemorySourceReference;
- MemoryInference;
- MemoryCorrection;
- MemoryDeletionEvent;
- CompanionProfile;
- CompanionMode;
- CompanionPreference;
- CompanionInteraction;
- FollowUpPermission;
- QuietPeriod;
- RecommendationPreference.

## 25. Digital Legacy Entities

Future implementation may include:

- LegacyPlan;
- LegacyConsent;
- LegacyMaterial;
- LegacyAdministrator;
- LegacyRecipient;
- LegacyActivationCase;
- LegacyAccessGrant;
- LegacySimulationProfile;
- LegacyInteraction;
- LegacySourceCitation;
- LegacySuspension;
- LegacyDeletionEvent.

These entities are architectural reservations only until separately approved for implementation.

## 26. Provider Router Rules

Agents must call providers through Hermes or an approved equivalent Harness. Routing must consider:

- data sensitivity;
- Japanese quality;
- task type;
- context length;
- cost;
- latency;
- structured-output reliability;
- search or multimodal requirements;
- provider health;
- retention and training terms.

No provider may become a permanent hidden dependency of one Agent.

## 27. Initial Active Agent Set

Initial activation target:

1. Akari;
2. Hinata;
3. State Understanding Agent;
4. Memory Agent;
5. Experience Structuring Agent;
6. Resource Discovery Agent;
7. Recommendation Matching Agent;
8. Evidence and Quality Agent;
9. Trust and Moderation Agent;
10. Demand Intelligence Agent;
11. Governance Auditor.

Other capabilities remain Planned or Dormant until trigger conditions and value are demonstrated.
