// CIF-1 — Candidate Intake Foundation: submission state machine (shared).
//
// This is the TypeScript mirror of the authoritative SQL function
// `transition_yorisou_candidate_submission` (migration 202607160002).
// A contract test asserts parity between the two so they never drift.
//
// IMPORTANT GOVERNANCE INVARIANT: `accepted_for_evaluation` means ONLY that a
// candidate has been accepted into an internal evaluation queue. It is NOT
// approval, verification, endorsement, safety, recommendation-eligibility, or
// commercial acceptance. Those are out of scope for CIF-1.

export const CANDIDATE_SUBMISSION_STATUSES = [
  "draft",
  "submitted",
  "under_review",
  "needs_information",
  "accepted_for_evaluation",
  "rejected",
  "withdrawn",
  "archived",
] as const;

export type CandidateSubmissionStatus = (typeof CANDIDATE_SUBMISSION_STATUSES)[number];

// Allowed transitions. Resubmission after withdrawn/rejected is intentionally a
// NEW submission row (history preserved) — so neither leads back into an active
// state; only archival is permitted from those terminal-ish states.
export const CANDIDATE_ALLOWED_TRANSITIONS: Record<CandidateSubmissionStatus, CandidateSubmissionStatus[]> = {
  draft: ["submitted", "withdrawn", "archived"],
  submitted: ["under_review", "needs_information", "withdrawn", "archived"],
  under_review: ["needs_information", "accepted_for_evaluation", "rejected", "withdrawn", "archived"],
  needs_information: ["under_review", "submitted", "withdrawn", "archived"],
  accepted_for_evaluation: ["archived", "withdrawn"],
  rejected: ["archived"],
  withdrawn: ["archived"],
  archived: [],
};

// Material review decisions require a non-empty reason (mirrors the SQL).
export const CANDIDATE_REASON_REQUIRED_TARGETS: ReadonlySet<CandidateSubmissionStatus> = new Set([
  "needs_information",
  "accepted_for_evaluation",
  "rejected",
  "withdrawn",
  "archived",
]);

export function isCandidateTransitionAllowed(
  from: CandidateSubmissionStatus,
  to: CandidateSubmissionStatus,
): boolean {
  return CANDIDATE_ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export function candidateTransitionReasonRequired(to: CandidateSubmissionStatus): boolean {
  return CANDIDATE_REASON_REQUIRED_TARGETS.has(to);
}

export type CandidateTransitionCheck =
  | { ok: true }
  | { ok: false; code: "invalid_transition" | "reason_required" };

export function checkCandidateTransition(
  from: CandidateSubmissionStatus,
  to: CandidateSubmissionStatus,
  reason: string | null | undefined,
): CandidateTransitionCheck {
  if (!isCandidateTransitionAllowed(from, to)) return { ok: false, code: "invalid_transition" };
  if (candidateTransitionReasonRequired(to) && (!reason || reason.trim().length === 0)) {
    return { ok: false, code: "reason_required" };
  }
  return { ok: true };
}

// Neutral, non-approval admin labels (Japanese-first, internal). The label for
// accepted_for_evaluation explicitly denies approval/endorsement framing.
export const CANDIDATE_STATUS_LABEL: Record<CandidateSubmissionStatus, string> = {
  draft: "下書き",
  submitted: "提出済み",
  under_review: "確認中",
  needs_information: "追加情報待ち",
  accepted_for_evaluation: "評価キューに受理（承認・推奨・検証ではありません）",
  rejected: "不受理",
  withdrawn: "取り下げ",
  archived: "アーカイブ",
};
