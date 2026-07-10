# Yorisou Data Privacy, Consent and Social Visibility Governance v0.3

**Status:** Approved  
**Owner:** Edward  
**Approver:** Edward  
**Approved Date:** 2026-07-10  
**Supersedes:** Yorisou Data Privacy and Consent Governance v0.2

---

## 1. Purpose

This governance defines how Yorisou collects, uses, stores, links, shares, moderates, deletes, anonymizes, and transfers data in a state-based social discovery platform.

v0.3 adds explicit governance for:

- user-generated experience,
- anonymous content,
- social visibility,
- state history,
- AI-assisted rewriting,
- content moderation,
- report and block controls,
- Japan-market service operation,
- regional data architecture.

---

## 2. Core Data Doctrine

Yorisou may use data only for clear user and platform purposes.

The product must be useful with minimal data.

Private data is private by default.

Sharing requires explicit user choice.

External insight uses anonymized or aggregated data.

Yorisou must not sell identifiable user data.

---

## 3. Data Categories

### 3.1 Identity Data

Examples:

- UserProfile ID,
- channel identity,
- LINE ID,
- Google identity,
- Apple identity,
- email identity,
- locale and authentication metadata.

Rules:

- separate UserProfile from AuthIdentity,
- collect only what is needed,
- cross-channel linking requires consent,
- do not expose channel identifiers publicly.

### 3.2 State and Test Data

Examples:

- answers,
- scores,
- state tags,
- confidence,
- result history,
- private state notes.

Rules:

- sensitive-adjacent,
- private by default,
- public output must use public-safe derivative content,
- no external sale of individual state profiles.

### 3.3 Experience Data

Examples:

- situation,
- action tried,
- perceived outcome,
- limitations,
- state context,
- visibility,
- edits,
- deletion status,
- AI-assistance status.

Rules:

- user controls visibility,
- public versions should minimize identifying detail,
- third-party personal data must be removed or minimized,
- AI may not invent or alter factual experience.

### 3.4 Social Interaction Data

Examples:

- save,
- try intent,
- tried,
- helpfulness,
- constrained response,
- topic follow,
- block,
- report.

Rules:

- used for user value, safety, ranking, and aggregate insight,
- not treated as a public popularity score by default.

### 3.5 Recommendation Data

Examples:

- impressions,
- reasons,
- source,
- commercial status,
- clicks,
- saves,
- conversion,
- feedback.

Rules:

- commercial status preserved,
- disclosure supported,
- vulnerable-state targeting must not be exploitative.

### 3.6 Report and Payment Data

Examples:

- paid intent,
- purchase,
- report access,
- refunds,
- delivery status,
- usefulness feedback.

Rules:

- private by default,
- payment data minimized and handled through approved providers,
- purchase behavior not exposed socially.

### 3.7 Local and Mobility/Life-Support Data

Rules:

- high sensitivity,
- broad area preferred,
- no unnecessary precise location,
- no public raw inquiry,
- no service promise inferred from inquiry.

### 3.8 Moderation and Safety Data

Examples:

- reports,
- block records,
- review status,
- policy reason,
- enforcement action,
- appeal or restoration record.

Rules:

- access restricted,
- evidence retained only as needed,
- no public shaming or public enforcement display.

### 3.9 External Insight Dataset Data

Must include:

- source categories,
- timeframe,
- aggregation rule,
- anonymization review,
- sample limitation,
- excluded categories,
- reviewer,
- approval.

---

## 4. Visibility Classes

Every user-generated state or experience object must have a visibility class.

### PRIVATE

Visible only to the user and approved processing systems.

### INVITE_ONLY

Visible only to explicitly authorized participants.

### SIMILAR_STATE_ONLY

A controlled distribution class based on an approved relevance rule. It must not expose the inferred state, diagnosis-like label, or identity of another user. Opt-out and visibility change must remain available.

Eligible for limited discovery among users meeting controlled relevance rules.

### ANONYMOUS_SHARED

Anonymous to other users. Yorisou may retain a minimal internal account/session, consent, abuse-prevention, and audit reference where necessary. The interface must not promise technical anonymity that the system does not actually provide.

Shared without public identity after de-identification checks.

### PSEUDONYMOUS_SHARED

Shared under a stable chosen name. This increases impersonation, harassment, and re-identification risk and is deferred from the first public MVP unless dedicated controls are approved.

Shared under an approved display-name identity.

### PUBLIC_SAFE

Eligible for broader public access or search.

Visibility changes require explicit user action and logged consent.

No automated system may silently broaden visibility.

---

## 5. Layered Consent

Consent should match the action.

### Basic entry

Simple notice for lightweight test or browsing.

### Result save

Consent to create or update a private profile.

### Channel linking

Consent to link LINE, Google, Apple, email, or other identity.

### Experience sharing

Object-specific visibility consent.

### AI-assisted rewrite

Consent to use AI to organize or de-identify text.

### Compatibility

Participant-specific consent and private-answer boundaries.

### Payment

Purchase, delivery, refund, and data-use notice.

### External insight

Aggregate/anonymized-use notice where required.

### Regional transfer

Appropriate notice and legal mechanism where applicable.

---

## 6. AI-Assisted Content Rules

AI may:

- suggest structure,
- improve readability,
- remove identifiers,
- flag risk,
- create a public-safe candidate.

AI must not:

- invent an event,
- create false testimony,
- add a diagnosis,
- add unsupported motives,
- change the user's conclusion,
- publish without approval,
- widen visibility,
- conceal that a public version was AI-assisted where disclosure is required.

The user must be able to review the final shared version.

---

## 7. Third-Party Privacy

Users may describe relationships and shared situations.

Yorisou must discourage or block:

- real names,
- exact addresses,
- workplace identifiers,
- identifiable photos without permission,
- specific medical or legal details of another person,
- private messages copied without consent,
- accusations that create foreseeable harm.

The system should provide warnings and de-identification support.

---

## 8. User Rights and Controls

Users should be able to:

- view saved personal data,
- edit state notes,
- edit experience cards,
- change visibility,
- delete or withdraw shared content,
- unlink an identity where feasible,
- block users or content pathways where supported,
- report content,
- request account deletion,
- request data export where required,
- correct inaccurate personal data.

Deletion behavior and legal retention exceptions must be explained.

---

## 9. Moderation and Safety

Yorisou must support:

- automated risk flagging,
- human/founder review for material cases,
- report categories,
- block controls,
- content status,
- removal or restricted visibility,
- audit evidence,
- repeat-abuse handling.

High-risk categories include:

- self-harm or crisis content,
- medical or professional claims,
- harassment,
- impersonation,
- doxxing,
- sexual exploitation,
- illegal activity,
- vulnerable-person targeting,
- commercial deception,
- fabricated experience represented as real.

Yorisou is not an emergency service.

Clear crisis and emergency routing should be localized where appropriate.

---

## 10. Public and Private Separation

Public-safe results and shared experience must never automatically include:

- raw answers,
- private insight,
- paid report content,
- relationship vulnerabilities,
- exact location,
- family or care details,
- private recommendation history,
- purchase behavior,
- hidden identity links.

---

## 11. Japan Data Governance and Future Regional Expansion

### 11.1 Current Operating Model

Yorisou v0.3 operates for the Japan market through Yorisou合同会社 and the yorisou.online product surface.

The user-facing service is Japanese-language and Web/LINE-first.

### 11.2 Current Identity Channels

Allowed current identity channels include:

- LINE;
- email;
- passwordless or other approved secure email authentication;
- other provider-managed login only after separate technical review.

Users should not be required to display their real identity publicly.

### 11.3 Data Location and Vendors

Operational data should remain in approved production systems with clear access control and vendor responsibility. International expansion and separate regional data programs are outside the current v0.3 scope.

## 12. Data Minimization and Retention

Retention must be purpose-based and documented before public launch. At minimum, identity and consent records, private state content, shared content, moderation evidence, payment records, analytics events, and deleted-content tombstones must have separately defined retention rules. Deleted content must disappear from ordinary product access promptly; any limited legal, security, fraud, backup, or dispute retention must be access-restricted and time-bounded.

Rules:

1. collect the minimum needed,
2. avoid precise location unless necessary,
3. separate identity from content where practical,
4. use aggregate data for analysis,
5. define retention by data category,
6. remove stale moderation evidence when no longer needed,
7. avoid raw free-text export,
8. do not keep deleted content indefinitely without documented reason.

---

## 13. External Reports

External outputs must not contain:

- raw user answers,
- raw experience text that can identify a person,
- channel IDs,
- emails,
- individual reports,
- precise location tied to a person,
- individual click history,
- private state history,
- identifiable household stories.

Small samples require stronger aggregation and limitation language.

---

## 14. Security and Access

Use least privilege.

Restricted data includes:

- secrets,
- provider tokens,
- raw identifiable datasets,
- moderation evidence,
- precise local or mobility records,
- payment or identity-linking data.

High-risk access should be logged.

Secrets must remain outside prompts, governance files, tracked repo files, and public logs.

---

## 15. Age, Crisis, and First-Phase Privacy Requirements

Yorisou is not restricted to adults only.

The product should not require exact age collection unless needed for a specific legal, payment, safety, or product reason.

The service must avoid age-inappropriate targeting, exploitative recommendation, clinical claims, and unrestricted direct contact.

Yorisou is not a crisis or emergency service. High-risk content must not be promoted through ordinary discovery or commercial recommendation.

### First-phase requirements

Before public user-generated experiences launch, Yorisou must support:

- registration through LINE or email;
- terms and privacy acceptance;
- private-by-default creation flow;
- clear visibility selection;
- direct publication without manual pre-approval;
- automated or rule-based basic spam and abuse checks where practical;
- user report and block controls;
- author edit and delete controls;
- administrative takedown and review queue;
- rate limiting and abuse logging;
- privacy reminders before sharing;
- no unrestricted private messaging.

Yorisou does not promise complete technical anonymity. Anonymous sharing means the public does not see the user's account identity, while Yorisou may retain the minimum internal account and safety reference needed to operate the service.


---

## 16. Personal Memory Governance

Personal Memory is opt-in and purpose-limited. Memory items must record:

- source;
- author;
- creation time;
- memory type;
- confidence where inferred;
- permitted uses;
- visibility;
- retention status;
- correction or deletion history.

AI inference must never be stored as confirmed user fact. Users must be able to review and correct material memory.

## 17. Companion Data Governance

Companion personalization may use only approved state, preference, memory, and interaction data. Private companion conversations must not automatically become public experience cards, external reports, advertisements, or commercial recommendation evidence.

## 18. Digital Legacy Data Governance

Digital Legacy requires separate explicit consent from normal product use. It must define:

- authorized material;
- permitted simulation modes;
- designated legacy administrator and recipients;
- activation evidence;
- access scope;
- voice and image permissions;
- permitted and prohibited outputs;
- retention and deletion rules;
- revocation while the user is alive;
- dispute and suspension procedures.

A family member cannot create an unrestricted simulation solely by claiming a relationship after death.

## 19. Cross-Agent Data Isolation

Akari, Hinata, and YORISOU specialist Agents may access only the minimum data allowed by their contracts. YORISOU data, memories, prompts, and artifacts must not enter Mirai Move or Shigeru contexts. Provider calls must follow data-classification and minimization rules through Hermes.
