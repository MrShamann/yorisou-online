// CIF-1 — shared enums/types for the Candidate Intake Foundation.
// These mirror the CHECK constraints in migration 202607160002.

import type { CandidateSubmissionStatus } from "./stateMachine";

export const CANDIDATE_ORG_SOURCE_TYPES = [
  "external_supplier",
  "creator",
  "institution",
  "partner",
  "founder_sourced",
  "agent_discovered",
  "internal_project",
  "other",
] as const;
export type CandidateOrgSourceType = (typeof CANDIDATE_ORG_SOURCE_TYPES)[number];

export const CANDIDATE_OFFERING_TYPES = [
  "product",
  "service",
  "resource",
  "content",
  "experience",
  "concept",
  "prototype",
  "other",
] as const;
export type CandidateOfferingType = (typeof CANDIDATE_OFFERING_TYPES)[number];

export const CANDIDATE_SUBMISSION_CHANNELS = [
  "founder_manual",
  "internal_research",
  "agent_assisted",
  "partner_referral",
  "external_supplier",
  "creator",
  "internal_project",
  "other",
] as const;
export type CandidateSubmissionChannel = (typeof CANDIDATE_SUBMISSION_CHANNELS)[number];

export const CANDIDATE_SUBMITTER_TYPES = [
  "founder",
  "staff",
  "agent",
  "external_supplier",
  "creator",
  "partner",
  "internal_project",
  "other",
] as const;
export type CandidateSubmitterType = (typeof CANDIDATE_SUBMITTER_TYPES)[number];

// Commercial/relationship provenance. NEVER used to affect recommendation
// eligibility or ranking (CIF-1 does not touch the recommendation engine).
export const CANDIDATE_COMMERCIAL_RELATIONSHIPS = [
  "none",
  "sponsored",
  "affiliate",
  "paid_evaluation",
  "partner",
  "internal_owned",
  "related_party",
  "unknown_review",
] as const;
export type CandidateCommercialRelationship = (typeof CANDIDATE_COMMERCIAL_RELATIONSHIPS)[number];

export const CANDIDATE_CONSENT_STATUSES = ["not_required", "pending", "recorded", "withdrawn"] as const;
export type CandidateConsentStatus = (typeof CANDIDATE_CONSENT_STATUSES)[number];

export const CANDIDATE_RETENTION_CATEGORIES = ["transient", "standard", "extended", "legal_hold"] as const;
export type CandidateRetentionCategory = (typeof CANDIDATE_RETENTION_CATEGORIES)[number];

export const CANDIDATE_ACTOR_TYPES = ["founder", "staff", "admin", "agent", "system"] as const;
export type CandidateActorType = (typeof CANDIDATE_ACTOR_TYPES)[number];

export type CandidateOrganization = {
  id: string;
  source_type: CandidateOrgSourceType;
  display_name: string;
  external_domain: string | null;
  external_ref: string | null;
  commercial_relationship: CandidateCommercialRelationship;
  related_project_ref: string | null;
  conflict_of_interest_disclosure: string | null;
  notes: string | null;
  lifecycle_status: "active" | "archived";
  created_by: string;
  created_by_type: CandidateActorType;
  created_at: string;
  updated_at: string;
};

export type CandidateOffering = {
  id: string;
  organization_id: string;
  offering_type: CandidateOfferingType;
  title: string;
  summary: string | null;
  external_url: string | null;
  external_ref: string | null;
  version_label: string | null;
  supersedes_offering_id: string | null;
  lifecycle_status: "active" | "archived";
  created_at: string;
};

export type CandidateSubmission = {
  id: string;
  organization_id: string;
  offering_id: string | null;
  submission_channel: CandidateSubmissionChannel;
  submitter_type: CandidateSubmitterType;
  submitter_ref: string | null;
  provenance: string;
  commercial_relationship: CandidateCommercialRelationship;
  related_project_disclosure: string | null;
  conflict_of_interest_disclosure: string | null;
  consent_status: CandidateConsentStatus;
  consent_reference: string | null;
  contact_info: string | null;
  retention_category: CandidateRetentionCategory;
  retention_deadline: string | null;
  external_ref: string | null;
  status: CandidateSubmissionStatus;
  status_reason: string | null;
  created_at: string;
  updated_at: string;
};

export type CandidateEvent = {
  id: string;
  submission_id: string | null;
  organization_id: string | null;
  offering_id: string | null;
  event_type: string;
  actor: string;
  actor_type: CandidateActorType;
  reason: string | null;
  previous_state: string | null;
  new_state: string | null;
  created_at: string;
};
