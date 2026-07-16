import "server-only";

// CIF-1 — Candidate Intake Foundation: server-side service-role store.
// Admin authorization is enforced by the API layer (requireAdminRequestViewer);
// this module never runs on an anonymous or normal-user path.
//
// Scope guard: this store touches ONLY the yorisou_candidate_* tables. It does
// not read or write user profile/test/scoring/reflection/recommendation/LINE
// data, and it does not affect recommendation eligibility or ranking.

import {
  checkCandidateTransition,
  type CandidateSubmissionStatus,
} from "@/lib/candidate-intake/stateMachine";
import type {
  CandidateActorType,
  CandidateCommercialRelationship,
  CandidateConsentStatus,
  CandidateEvent,
  CandidateOffering,
  CandidateOfferingType,
  CandidateOrganization,
  CandidateOrgSourceType,
  CandidateRetentionCategory,
  CandidateSubmission,
  CandidateSubmissionChannel,
  CandidateSubmitterType,
} from "@/lib/candidate-intake/types";

const ORG = "yorisou_candidate_organizations";
const OFFERING = "yorisou_candidate_offerings";
const SUBMISSION = "yorisou_candidate_submissions";
const EVENT = "yorisou_candidate_events";

function config() {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("candidate_intake_not_configured");
  return { url: url.replace(/\/$/, ""), key };
}

async function request(path: string, init: RequestInit) {
  const { url, key } = config();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...(init.headers || {}) },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`candidate_intake_failed:${response.status}`);
  return response;
}

// CIF-1A: creation goes through security-definer RPCs that insert the object
// AND its `created` audit event in ONE transaction. Direct table INSERT is
// revoked from the application role, so there is no non-atomic creation path
// and no separate event-emission call.
async function callRpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const response = await request(`rpc/${fn}`, { method: "POST", body: JSON.stringify(args) });
  const record = (await response.json()) as T;
  if (!record) throw new Error("candidate_intake_empty_response");
  return record;
}

// ── Organizations ──────────────────────────────────────────────────────────
export async function createCandidateOrganization(input: {
  sourceType: CandidateOrgSourceType;
  displayName: string;
  externalDomain?: string | null;
  externalRef?: string | null;
  commercialRelationship?: CandidateCommercialRelationship;
  relatedProjectRef?: string | null;
  conflictOfInterestDisclosure?: string | null;
  notes?: string | null;
  actor: string;
  actorType?: CandidateActorType;
}): Promise<CandidateOrganization> {
  return callRpc<CandidateOrganization>("create_yorisou_candidate_organization", {
    p_source_type: input.sourceType,
    p_display_name: input.displayName,
    p_external_domain: input.externalDomain ?? null,
    p_external_ref: input.externalRef ?? null,
    p_commercial_relationship: input.commercialRelationship ?? "unknown_review",
    p_related_project_ref: input.relatedProjectRef ?? null,
    p_conflict_of_interest_disclosure: input.conflictOfInterestDisclosure ?? null,
    p_notes: input.notes ?? null,
    p_actor: input.actor,
    p_actor_type: input.actorType ?? "admin",
  });
}

export async function listCandidateOrganizations(): Promise<CandidateOrganization[]> {
  const params = new URLSearchParams({ select: "*", order: "created_at.desc", limit: "200" });
  return (await (await request(`${ORG}?${params}`, { method: "GET" })).json()) as CandidateOrganization[];
}

// Duplicate detection (surfaced, never auto-blocked): same domain, external_ref,
// or normalized name.
export async function findDuplicateOrganizations(input: { externalDomain?: string | null; externalRef?: string | null; displayName?: string | null }): Promise<CandidateOrganization[]> {
  const ors: string[] = [];
  if (input.externalDomain) ors.push(`external_domain.eq.${encodeURIComponent(input.externalDomain)}`);
  if (input.externalRef) ors.push(`external_ref.eq.${encodeURIComponent(input.externalRef)}`);
  if (input.displayName) ors.push(`display_name.ilike.${encodeURIComponent(input.displayName)}`);
  if (ors.length === 0) return [];
  const params = new URLSearchParams({ select: "*", or: `(${ors.join(",")})`, limit: "50" });
  return (await (await request(`${ORG}?${params}`, { method: "GET" })).json()) as CandidateOrganization[];
}

// ── Offerings ──────────────────────────────────────────────────────────────
export async function createCandidateOffering(input: {
  organizationId: string;
  offeringType: CandidateOfferingType;
  title: string;
  summary?: string | null;
  externalUrl?: string | null;
  externalRef?: string | null;
  versionLabel?: string | null;
  supersedesOfferingId?: string | null;
  actor: string;
  actorType?: CandidateActorType;
}): Promise<CandidateOffering> {
  return callRpc<CandidateOffering>("create_yorisou_candidate_offering", {
    p_organization_id: input.organizationId,
    p_offering_type: input.offeringType,
    p_title: input.title,
    p_summary: input.summary ?? null,
    p_external_url: input.externalUrl ?? null,
    p_external_ref: input.externalRef ?? null,
    p_version_label: input.versionLabel ?? null,
    p_supersedes_offering_id: input.supersedesOfferingId ?? null,
    p_actor: input.actor,
    p_actor_type: input.actorType ?? "admin",
  });
}

export async function listCandidateOfferings(organizationId: string): Promise<CandidateOffering[]> {
  const params = new URLSearchParams({ select: "*", organization_id: `eq.${organizationId}`, order: "created_at.desc", limit: "200" });
  return (await (await request(`${OFFERING}?${params}`, { method: "GET" })).json()) as CandidateOffering[];
}

// ── Submissions ────────────────────────────────────────────────────────────
export async function createCandidateSubmission(input: {
  organizationId: string;
  offeringId?: string | null;
  submissionChannel: CandidateSubmissionChannel;
  submitterType: CandidateSubmitterType;
  submitterRef?: string | null;
  provenance: string;
  commercialRelationship?: CandidateCommercialRelationship;
  relatedProjectDisclosure?: string | null;
  conflictOfInterestDisclosure?: string | null;
  consentStatus?: CandidateConsentStatus;
  consentReference?: string | null;
  contactInfo?: string | null;
  retentionCategory?: CandidateRetentionCategory;
  retentionDeadline?: string | null;
  externalRef?: string | null;
  actor: string;
  actorType?: CandidateActorType;
}): Promise<CandidateSubmission> {
  // Privacy invariant mirrored from the DB CHECK: contact info requires recorded consent.
  if (input.contactInfo && input.consentStatus !== "recorded") {
    throw new Error("candidate_contact_requires_recorded_consent");
  }
  return callRpc<CandidateSubmission>("create_yorisou_candidate_submission", {
    p_organization_id: input.organizationId,
    p_offering_id: input.offeringId ?? null,
    p_submission_channel: input.submissionChannel,
    p_submitter_type: input.submitterType,
    p_submitter_ref: input.submitterRef ?? null,
    p_provenance: input.provenance,
    p_commercial_relationship: input.commercialRelationship ?? "unknown_review",
    p_related_project_disclosure: input.relatedProjectDisclosure ?? null,
    p_conflict_of_interest_disclosure: input.conflictOfInterestDisclosure ?? null,
    p_consent_status: input.consentStatus ?? "not_required",
    p_consent_reference: input.consentReference ?? null,
    p_contact_info: input.contactInfo ?? null,
    p_retention_category: input.retentionCategory ?? "standard",
    p_retention_deadline: input.retentionDeadline ?? null,
    p_external_ref: input.externalRef ?? null,
    p_actor: input.actor,
    p_actor_type: input.actorType ?? "admin",
  });
}

export async function listCandidateSubmissions(filter?: { status?: CandidateSubmissionStatus; organizationId?: string }): Promise<CandidateSubmission[]> {
  const params = new URLSearchParams({ select: "*", order: "created_at.desc", limit: "200" });
  if (filter?.status) params.set("status", `eq.${filter.status}`);
  if (filter?.organizationId) params.set("organization_id", `eq.${filter.organizationId}`);
  return (await (await request(`${SUBMISSION}?${params}`, { method: "GET" })).json()) as CandidateSubmission[];
}

export async function getCandidateSubmission(id: string): Promise<CandidateSubmission | null> {
  const params = new URLSearchParams({ select: "*", id: `eq.${id}`, limit: "1" });
  return ((await (await request(`${SUBMISSION}?${params}`, { method: "GET" })).json()) as CandidateSubmission[])[0] || null;
}

// Duplicate/resubmission detection by external_ref (surfaced, not blocked).
export async function findCandidateSubmissionsByExternalRef(externalRef: string): Promise<CandidateSubmission[]> {
  const params = new URLSearchParams({ select: "*", external_ref: `eq.${externalRef}`, order: "created_at.desc", limit: "50" });
  return (await (await request(`${SUBMISSION}?${params}`, { method: "GET" })).json()) as CandidateSubmission[];
}

// Controlled transition via the security-definer RPC (atomic status + event).
// A client-side check gives a friendly error before the round-trip; the DB
// function remains the authoritative guard.
export async function transitionCandidateSubmission(input: {
  submissionId: string;
  toStatus: CandidateSubmissionStatus;
  reason?: string | null;
  actor: string;
  actorType?: CandidateActorType;
}): Promise<{ ok: true } | { ok: false; code: "invalid_transition" | "reason_required" | "not_found" }> {
  const current = await getCandidateSubmission(input.submissionId);
  if (!current) return { ok: false, code: "not_found" };
  const check = checkCandidateTransition(current.status, input.toStatus, input.reason);
  if (!check.ok) return check;
  await request("rpc/transition_yorisou_candidate_submission", {
    method: "POST",
    body: JSON.stringify({
      p_submission_id: input.submissionId,
      p_actor: input.actor,
      p_actor_type: input.actorType ?? "admin",
      p_to_status: input.toStatus,
      p_reason: input.reason ?? null,
    }),
  });
  return { ok: true };
}

export async function listCandidateEvents(submissionId: string): Promise<CandidateEvent[]> {
  const params = new URLSearchParams({ select: "*", submission_id: `eq.${submissionId}`, order: "created_at.asc", limit: "200" });
  return (await (await request(`${EVENT}?${params}`, { method: "GET" })).json()) as CandidateEvent[];
}
