# Yorisou — Report Data Dashboard Governance v0.1

**Status:** Specification only. Not implementation approval.  
**Version:** v0.1  
**Controller:** Edward (final approver)  
**Last updated:** 2026-06-21

---

> **Dashboard should show operational status by default, not private diary-like content.**

---

## 1. Purpose

This document defines what data the Yorisou admin dashboard (including `/admin/dte-launch-dashboard`) may display by default, what data requires restricted access, and the rules governing OpenClaw / backend agent access to dashboard data.

The dashboard exists to support operations, quality monitoring, and controlled pilot management — not to provide a private window into individual users' emotional or personal content.

---

## 2. Dashboard Allowed by Default

The following fields and metrics may be displayed in the standard admin dashboard view without additional access restriction:

### Event Counts and Funnel Metrics

| Metric | Description |
|---|---|
| Total check-in sessions started | Count only |
| Check-in completion rate | Aggregate percentage |
| Result display events | Count |
| Report preview views | Count |
| Report intent saves | Count |
| Sample report opens | Count |
| Report delivery events | Count |
| Not-now clicks | Count |
| LINE mini-app entries | Count |
| Session funnel drop-off points | Aggregate by step |

### Per-Report Operational Fields

| Field | Display allowed |
|---|---|
| Report ID | Yes (opaque identifier, not user-identifiable) |
| Report type | Yes (e.g., "detailed-self-understanding") |
| Template version | Yes |
| Generation method | Yes (manual / assisted / automated) |
| Personalization level used | Yes (L1 / L2 / L3) |
| Signal completeness | Yes (e.g., "top 3 dimensions available") |
| Confidence band | Yes (low / medium / high) |
| Consent level confirmed | Yes (L0 / L1 / L2 / L3) |
| Safety review status | Yes (pending / passed / flagged) |
| Delivery status | Yes (not started / delivered / failed / deferred) |
| Delivery timestamp | Yes |
| Phase label | Yes (pilot_phase_1 / pilot_phase_2) |
| Locale | Yes (ja / en) |

### Aggregate Conversion Metrics

| Metric | Display allowed |
|---|---|
| Report intent save rate | Yes |
| Report delivery rate | Yes |
| Safety flag rate | Yes |
| Generation method distribution | Yes |
| Consent level distribution | Yes |
| Confidence band distribution | Yes |
| Feedback response rate | Yes |
| Aggregate feedback sentiment (if collected) | Yes, as aggregate only |

---

## 3. Restricted Fields

The following fields must NOT appear in the default dashboard view. They may only be accessed under the conditions defined in Section 4.

| Field | Reason for restriction |
|---|---|
| Raw answer payload | Contains detailed personal responses to emotional questions |
| Raw LINE message content | Personal communications; not collected or stored at v0.1 |
| Full report text | Sensitive personal content; not to be displayed in dashboard |
| Admin review notes (free text) | May inadvertently contain personal content |
| Account identifiers (email, LINE UID) | Personally identifiable; not needed for operational view |
| User identifiers beyond session/result ID | Personally identifiable |
| Free-text user feedback | May contain personal disclosures; aggregate only by default |
| Payment status (future) | Financial privacy; separate access controls when implemented |
| Consent record details (specific timestamps, IP) | Privacy-sensitive operational data |

---

## 4. Rules for Restricted Access View

A restricted dashboard view may be created for Edward or authorized reviewers under the following conditions:

### Access Conditions

- Access is only granted to explicitly named, authorized individuals (Edward at v0.1)
- The purpose of accessing restricted data must be clear and documented before access
- Restricted view must not be the default dashboard — it requires a deliberate navigation step
- Access must not expose all restricted fields simultaneously — only the minimum necessary for the stated purpose

### Minimum Necessary Principle

When restricted access is used:
- Show only the specific field(s) needed for the review purpose
- Do not surface user identifiers alongside sensitive content (e.g., do not display email next to report text)
- Do not allow bulk export of restricted fields by default

### No Export by Default

- Restricted fields must not be exportable (CSV, JSON, or other format) from the dashboard without a separate explicit action and logged reason
- Export capability for restricted fields is not implemented at v0.1 and requires separate authorization

### Audit Log (Recommended, Not Yet Required)

- When restricted access is implemented, an audit log of access events is recommended
- Minimum log fields: accessor identity, accessed field type, timestamp, stated reason
- Full audit logging is deferred to a future governance review — it is not required at v0.1 but is noted as a priority for scaled operation

---

## 5. OpenClaw / Backend Agent Access Limits

OpenClaw or any backend agent system that assists with report generation must observe the following dashboard and data access limits:

| Access | Permitted |
|---|---|
| Read aggregate event counts | Yes, for operational monitoring |
| Read per-report operational fields (Section 2) | Yes, for generation pipeline status |
| Read individual user signals for current task | Yes, scoped to current report generation only |
| Read full report text of prior delivered reports | No — not permitted without explicit authorization |
| Read raw answer payload | No |
| Read user identifiers | No |
| Cross-reference signals across users | No |
| Access LINE message content | No |
| Access restricted dashboard fields | No — restricted to human reviewers only |
| Write to dashboard event store | Yes, for operational events (report_delivered, etc.) |
| Write user-identifiable data to event store | No |

Backend agents must treat the dashboard event store as write-once operational logging. They must not read back from the event store to build user profiles or cross-session signal histories.

---

## 6. Safe Logging Rules

All events logged to the DTE event store (or any future analytics/logging system) must follow these rules:

### Allowed in Event Logs

- Event name (e.g., `report_delivered`)
- Report ID (opaque, not user-identifiable on its own)
- Result ID and overlay ID
- Persona cluster ID
- Confidence band
- Report type and version
- Generation method
- Safety review status
- Delivery status
- Locale
- Phase label
- Timestamp

### Not Allowed in Event Logs

- User email, LINE UID, or any personal identifier
- Raw answer payload or individual answer values
- Full report text or any report excerpt
- Free-text content of any kind
- IP address or device fingerprint (unless required for security, with separate policy)
- Payment information

### Log Retention

No automatic log retention or expiry policy is defined at v0.1. Logs accumulate in the S3-backed event store. A retention policy must be defined before scaled operation — this is an unresolved decision.

---

## 7. Cross-User Leakage Prevention

The dashboard and any downstream system must prevent cross-user data leakage:

**Generation scope isolation:** When a report is being generated for one user, the generation context must not include signals, result IDs, or patterns from other users.

**No aggregate-to-individual reverse engineering:** Dashboard aggregate metrics must be computed in a way that does not allow individual user records to be inferred from small-cohort aggregates. For cohorts smaller than [threshold TBD], suppress individual breakdowns.

**Dashboard session isolation:** Admin dashboard sessions must not persist query results that could expose one user's data to a subsequent admin session.

**Event store access:** The S3-backed event store should have access controls limiting read access to authorized operators (Edward at v0.1). Broad read permissions are not appropriate.

---

## 8. Unresolved Dashboard Decisions (v0.1)

| Decision | Status |
|---|---|
| Whether full report text is viewable by Edward in restricted view | Unresolved — pending delivery mode decision |
| Log retention policy | Unresolved |
| Aggregate threshold for suppressing small-cohort breakdowns | Unresolved |
| Whether audit logging is implemented before scaled operation | Unresolved — recommended but not required at v0.1 |
| Whether free-text feedback is stored or only aggregate sentiment | Unresolved |
| Payment status dashboard display (when payment is implemented) | Deferred with payment implementation |
| Whether OpenClaw agent receives read access to prior report operational fields | Unresolved — pending authorization |

---

## 9. First Launch Dashboard State

At first launch (pilot phase 1–2):

- Default dashboard view: operational fields only (Section 2)
- Restricted fields: not accessible in current dashboard implementation
- Full report text: not stored in dashboard or event store
- User identifiers: not logged
- Cross-user leakage risk: low (small cohort, manual process)
- Export: not implemented
- Audit log: not implemented (deferred)

The DTE launch dashboard at `/admin/dte-launch-dashboard` is protected by `requireAdminViewer()` and is accessible only to authorized email addresses. This satisfies first-launch access control requirements.

---

> **Dashboard should show operational status by default, not private diary-like content.**
