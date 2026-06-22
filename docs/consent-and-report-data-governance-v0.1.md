# Yorisou — Consent and Report Data Governance v0.1

**Status:** Specification only. Not legal advice. Not implementation approval.  
**Version:** v0.1  
**Controller:** Edward (final approver)  
**Last updated:** 2026-06-21

---

> **This document is a product/governance specification, not legal advice and not implementation approval.**

---

## 1. Governance Principles

Yorisou handles personal information about users' emotional states, relationships, and behavioral patterns. This is sensitive data. The following principles govern all data handling decisions:

**Explainability:** Every use of user data must be describable in plain Japanese in one or two sentences that a non-technical user can understand before they decide.

**Consent:** No data is used beyond what the user understood and agreed to at the time of collection or at the time of expanded use. Consent is specific — broad blanket agreement is not sufficient.

**Reversibility:** Users must be able to stop future use and, where technically and policy-permitted, request deletion. The path to stopping or deleting must be simple.

**Minimum necessary:** Only data required to perform the described function is collected or accessed. Data is not pre-collected "in case it is useful later."

**Non-creepiness:** Yorisou must not feel like it is watching users, building profiles without permission, or using data in ways that would surprise or disturb them if explained.

**No model training by default:** Report content, user answers, and usage signals are not used to train or fine-tune AI models without explicit separate consent. This is not approved by default at v0.1.

**Separation of operational and private content:** Dashboard and admin tools default to showing operational status. Private content (answers, report text, LINE messages) requires separate, explicitly restricted access. See `docs/report-data-dashboard-governance-v0.1.md`.

---

## 2. Consent Levels

Yorisou operates on four consent levels. Each level is incremental — a higher level requires the user to have understood and accepted the lower levels.

---

### Level 0 — Anonymous / Session Only

**What it means:** The user's answers are used only to produce their result in the current session. No information is retained after the session ends. No result ID is associated with a persistent identity.

**What is collected:**
- Answer payload (in-session only, not persisted beyond result display)
- Result ID (used to display result, not stored to a user account)

**What is NOT collected:**
- Name, email, LINE ID, or any identifier
- Device fingerprint or persistent browser identifier for tracking
- Prior session data

**Requires consent copy:** None — this is the default anonymous state.

**First launch:** Level 0 is the default for all check-in users who have not logged in and have not saved a result.

---

### Level 1 — Save Current Result

**What it means:** The user agrees to associate their current check-in result with a persistent identifier (browser localStorage or account session) so they can view it again later.

**What is collected:**
- Result ID and overlay ID
- Timestamp of check-in
- Basic locale/session signals

**What is NOT collected at Level 1:**
- Full answer payload (not required for result revisit)
- Prior session history
- LINE interaction content

**Requires consent copy:** Yes — see Level 1 copy in `docs/report-consent-copy-v0.1.md`.

**First pilot baseline:** Level 1 is the minimum recommended starting point for all report delivery. Reports cannot be revisited without at least Level 1.

---

### Level 2 — Personalized Report Signals

**What it means:** The user agrees to allow Yorisou to use stored signals from past check-in sessions to improve the personalization of the current report (e.g., recognizing repeated patterns, noting changes over time).

**What is collected:**
- All Level 1 data
- Top dimension scores from prior sessions
- Personalization level used in prior reports
- Pattern cluster history (not raw answers)

**What is NOT collected at Level 2:**
- Raw answer payloads from prior sessions
- Full prior report text
- LINE interaction summaries (separate consent — see Level 3 note)

**Requires consent copy:** Yes — see Level 2 copy in `docs/report-consent-copy-v0.1.md`.

**Controller restriction:** Level 2 is optional and may only be offered after Edward approves the consent copy and confirms that dashboard restrictions for Level 2 data are in place. Level 2 is not active at first launch.

---

### Level 3 — Longitudinal Yorisou Memory

**What it means:** The user agrees to allow Yorisou to maintain an ongoing memory of their check-in history, prior reports, and stated preferences, enabling longer-term pattern tracking and continuity across sessions.

**What is collected:**
- All Level 1 and Level 2 data
- Full session history summary (not raw answers, not full report text — summary only)
- Stated user preferences and memory notes
- Optionally: LINE interaction summaries (requires additional separate consent)

**Requires consent copy:** Yes — see Level 3 copy in `docs/report-consent-copy-v0.1.md`.

**Controller decision:** Level 3 is **deferred**. It is not active at first launch. It requires separate Edward approval, finalized consent wording, confirmed deletion capability, and review of dashboard restrictions before any user is offered Level 3.

---

## 3. Data Categories Table

| Data category | Collected at | Notes |
|---|---|---|
| In-session answer payload | Level 0 (session only) | Not persisted beyond result display at L0 |
| Result ID and overlay ID | Level 1+ | Used to retrieve result for revisit or report |
| Top dimension scores | Level 2+ | Derived signals, not raw answers |
| Personalization level | Level 2+ | Which template variant was used |
| Pattern cluster history | Level 2+ | Cluster ID only, not full text |
| Raw answer payload (prior sessions) | Not collected | Not approved at any consent level |
| Full prior report text | Not stored in user record | Only displayed to user; not retained in profile |
| LINE interaction summaries | Level 3 + additional consent | Not approved for first launch |
| Raw LINE messages | Not collected | Not approved at any consent level |
| Name / email / phone | Account level only | Only if user creates an account |
| Device fingerprint / persistent tracking | Not collected | Not approved |
| Payment information | Not collected | Handled by payment provider only (future) |

---

## 4. What Yorisou Must Not Do

The following are explicitly prohibited at v0.1 and require separate controller authorization before any change:

| Prohibited action | Reason |
|---|---|
| Use raw LINE messages in report generation | Not consented. LINE message content is personal communication, not check-in data. |
| Use report or answer data for model training | Not approved by default. Requires explicit separate consent and Edward authorization. |
| Share individual user signals with third parties | Not approved. Aggregate anonymized metrics only with confirmed controller approval. |
| Sell personal signals or pattern data | Not approved under any current product direction. |
| Enable Level 3 memory at first launch | Deferred. Requires separate approval and capability confirmation. |
| Store full report text in a user-accessible database without confirmed consent and deletion path | Report text is sensitive. Storage requires confirmed delivery mode, consent wording, and deletion mechanism. |
| Use data collected at one consent level for a purpose belonging to a higher consent level | Each level requires affirmative consent. |
| Degrade the free result experience because the user declined memory or personalization | The core クイックチェック result must be equally useful regardless of consent level. |

---

## 5. Report Memory Rules

### What may be retained after a report is delivered

| Item | May retain? | Condition |
|---|---|---|
| Report ID and metadata | Yes | Dashboard operational logging |
| Result ID reference | Yes | For revisit access at Level 1+ |
| Report type and version | Yes | Dashboard logging |
| Personalization level used | Yes | Dashboard logging |
| Safety review status | Yes | Dashboard logging |
| Full report text | Not by default | Only if delivery mode requires it AND user has Level 1+ consent AND deletion path is confirmed |
| User's answers | No | Answers are not retained post-report at v0.1 |

### What the user may access

At Level 1, users may access their saved result to revisit their free check-in result. Full report revisit requires the delivery mode to be decided and confirmed with consent wording.

### Report expiry

No automatic expiry policy is set at v0.1. This is an unresolved decision. Do not implement an expiry schedule until Edward approves.

---

## 6. OpenClaw / Backend Agent Memory Rules

OpenClaw and any backend agent system that may assist with report generation must operate under the following restrictions:

- May only receive the input record assembled for the specific report being generated (see `docs/paid-report-semi-manual-ops-v0.1.md` Section 4)
- Must not retain or cache user signals beyond the scope of the current generation task
- Must not cross-reference signals from one user against another
- Must not use prior report content as training input without explicit approval
- Must not access LINE interaction content without Level 3 consent being confirmed
- Must not log user-identifiable data in backend system logs
- Must operate under the same minimum-necessary principle as the frontend

OpenClaw backend agent access to generation tasks is not yet authorized at v0.1. See `docs/paid-report-generation-workflow-v0.1.md` Section 3.

---

## 7. Retention and Deletion Assumptions

At v0.1, no persistent server-side user data store exists. The following assumptions apply:

- Check-in result data is stored in browser localStorage or session (client-side only)
- Report intent signals are stored in browser localStorage (client-side only)
- Dashboard event logs are stored in the DTE event store (S3-backed, operational only)
- No server-side user profile database exists

**When a server-side store is introduced:**
- Deletion capability must be confirmed before any user data is stored server-side
- Consent copy must be finalized before offering Level 2 or above
- A data register/map must be created documenting what is stored where

**Deletion wording:** When deletion options are offered to users, the copy must distinguish:
- "今後の利用を止める" — stopping future use of signals
- "削除を依頼する" — requesting deletion of stored data, with acknowledgment that some data may be retained where technically or policy required

See approved wording in `docs/report-consent-copy-v0.1.md`.

---

## 8. First Launch Recommendation

For the first pilot (reports 1–20, as described in `docs/paid-report-semi-manual-ops-v0.1.md`):

**Baseline: Level 1 only**
- Users consent to saving their current result for revisit
- No prior session signals used in report generation
- No LINE content used
- No longitudinal memory offered

**Level 2: Optional, after Edward approval**
- Not active at first launch
- May be offered to pilot users only after:
  - Consent copy is finalized and approved by Edward
  - Dashboard restrictions for Level 2 data are confirmed in place
  - At least 5 Level 1 reports have been delivered without issue

**Level 3: Deferred**
- Not offered at first launch or pilot
- Requires separate authorization, capability confirmation, and consent wording finalization

---

## 9. Controller Corrections (v0.1)

The following corrections apply to any earlier working assumptions and must be reflected in all downstream specifications:

1. **Model training is not approved by default.** Report content, user answers, and usage signals are not to be used for model training or fine-tuning without explicit separate consent from the user and authorization from Edward.

2. **Raw LINE message use is not approved for first launch.** Even if a user has connected LINE, raw LINE message content may not be used as input to report generation. Summarized LINE interaction data at Level 3 requires separate consent and is deferred.

3. **Deletion copy must be accurate.** Consent and deletion wording must distinguish between "stopping future use" and "deleting stored data." Wording that implies complete deletion when deletion is not yet technically confirmed is not acceptable.

4. **Free experience must not be degraded.** Users who decline memory, personalization, or report consent must receive the same quality of free クイックチェック result as users who consent. Gating the free result on memory consent is not approved.

---

> **This document is a product/governance specification, not legal advice and not implementation approval.**
