import "server-only";

// APP-2 WS-D/E/F/G/H — server-side service-role store for the full-service
// backend (guest→account migration, adaptation persistence, service incidents,
// review queues, sensitive-admin access logs, readiness aggregates).
//
// Admin authorization is enforced by the API layer (requireAdminRequestViewer);
// this module runs only on server paths and touches ONLY the eight yorisou_*
// APP-2 tables + their aggregate views. It never reads user profile/test/
// scoring/reflection/recommendation data and never affects recommendation
// eligibility or ranking. All writes that must be atomic go through the
// security-definer RPCs defined in migration 202607190001.

const JOBS = "yorisou_guest_migration_jobs";
const ADAPT = "yorisou_adaptation_state";
const INCIDENTS = "yorisou_service_incidents";
const REVIEW_ITEMS = "yorisou_review_queue_items";
const OVERVIEW = "yorisou_service_readiness_overview";
const FUNNEL = "yorisou_migration_funnel";
const QUEUE_SUMMARY = "yorisou_review_queue_summary";

function config() {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("app2_backend_not_configured");
  return { url: url.replace(/\/$/, ""), key };
}

async function request(path: string, init: RequestInit) {
  const { url, key } = config();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...(init.headers || {}) },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`app2_backend_failed:${response.status}`);
  return response;
}

async function callRpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const response = await request(`rpc/${fn}`, { method: "POST", body: JSON.stringify(args) });
  return (await response.json()) as T;
}

async function selectOne<T>(path: string): Promise<T | null> {
  const response = await request(path, { method: "GET" });
  const rows = (await response.json()) as T[];
  return rows[0] ?? null;
}

async function selectMany<T>(path: string): Promise<T[]> {
  const response = await request(path, { method: "GET" });
  return (await response.json()) as T[];
}

// ── Types (rows are minimal, safe projections) ───────────────────────────────
export type GuestMigrationJob = {
  id: string;
  idempotency_key: string;
  account_id: string;
  guest_ref: string | null;
  status: "pending" | "running" | "succeeded" | "failed" | "cancelled" | "compensated";
  provenance: string;
  saved_item_count: number;
  retry_count: number;
  last_error_code: string | null;
  created_at: string;
  updated_at: string;
};

export type ReviewQueueItem = {
  id: string;
  queue_type: string;
  severity: string;
  status: string;
  safe_summary: string;
  evidence_ref: string | null;
  occurrence_count: number;
  assigned_to: string | null;
  resolution_note: string | null;
  first_seen_at: string;
  last_occurrence_at: string;
};

export type ServiceIncident = {
  id: string;
  incident_type: string;
  severity: string;
  status: string;
  safe_summary: string;
  occurrence_count: number;
  last_seen_at: string;
};

export type ReadinessOverview = {
  open_incidents: number;
  high_severity_open: number;
  open_review_items: number;
  failed_migrations: number;
  denied_admin_access_events: number;
};

export type MigrationFunnel = {
  total_jobs: number;
  succeeded: number;
  failed: number;
  cancelled: number;
  compensated: number;
  in_progress: number;
  total_retries: number;
};

export type ReviewQueueSummaryRow = { queue_type: string; status: string; severity: string; item_count: number };

// ── WS-E: guest→account migration (idempotent, audited) ──────────────────────
export async function createGuestMigrationJob(input: {
  idempotencyKey: string;
  accountId: string;
  guestRef?: string | null;
  provenance?: string;
  savedItemCount?: number;
}): Promise<GuestMigrationJob> {
  return callRpc<GuestMigrationJob>("create_yorisou_guest_migration_job", {
    p_idempotency_key: input.idempotencyKey,
    p_account_id: input.accountId,
    p_guest_ref: input.guestRef ?? null,
    p_provenance: input.provenance ?? "device_local",
    p_saved_item_count: String(input.savedItemCount ?? 0),
  });
}

export async function transitionGuestMigrationJob(input: {
  jobId: string;
  toStatus: GuestMigrationJob["status"];
  eventType: "started" | "succeeded" | "failed" | "cancelled" | "compensated" | "retried";
  errorCode?: string | null;
  detail?: string | null;
}): Promise<GuestMigrationJob> {
  return callRpc<GuestMigrationJob>("transition_yorisou_guest_migration_job", {
    p_job_id: input.jobId,
    p_to_status: input.toStatus,
    p_event_type: input.eventType,
    p_error_code: input.errorCode ?? null,
    p_detail: input.detail ?? null,
  });
}

export async function findMigrationJobByIdempotencyKey(key: string): Promise<GuestMigrationJob | null> {
  return selectOne<GuestMigrationJob>(`${JOBS}?idempotency_key=eq.${encodeURIComponent(key)}&limit=1`);
}

// ── WS-B: account-side adaptation persistence ────────────────────────────────
export async function upsertAdaptationState(input: {
  accountId: string;
  need?: string | null;
  pace?: "quick" | "deep" | null;
  lastResultFamily?: string | null;
  savedItemIds?: string[];
  triedItemIds?: string[];
  hiddenItemIds?: string[];
}): Promise<void> {
  await request(`${ADAPT}?on_conflict=account_id`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({
      account_id: input.accountId,
      need: input.need ?? null,
      pace: input.pace ?? null,
      last_result_family: input.lastResultFamily ?? null,
      saved_item_ids: input.savedItemIds ?? [],
      tried_item_ids: input.triedItemIds ?? [],
      hidden_item_ids: input.hiddenItemIds ?? [],
      updated_at: new Date().toISOString(),
    }),
  });
}

// ── WS-G: review queues ──────────────────────────────────────────────────────
export async function enqueueReviewItem(input: {
  queueType: string;
  severity?: string;
  safeSummary: string;
  evidenceRef?: string | null;
  actor: string;
  detail?: string | null;
}): Promise<ReviewQueueItem> {
  return callRpc<ReviewQueueItem>("enqueue_yorisou_review_item", {
    p_queue_type: input.queueType,
    p_severity: input.severity ?? "low",
    p_safe_summary: input.safeSummary,
    p_evidence_ref: input.evidenceRef ?? null,
    p_actor: input.actor,
    p_detail: input.detail ?? null,
  });
}

export async function transitionReviewItem(input: {
  itemId: string;
  toStatus: "reviewing" | "resolved" | "dismissed" | "reopened" | "open";
  actor: string;
  resolutionNote?: string | null;
  detail?: string | null;
}): Promise<ReviewQueueItem> {
  return callRpc<ReviewQueueItem>("transition_yorisou_review_item", {
    p_item_id: input.itemId,
    p_to_status: input.toStatus,
    p_actor: input.actor,
    p_resolution_note: input.resolutionNote ?? null,
    p_detail: input.detail ?? null,
  });
}

export async function listReviewItems(filter?: { status?: string; queueType?: string }): Promise<ReviewQueueItem[]> {
  const params = ["order=last_occurrence_at.desc", "limit=200"];
  if (filter?.status) params.push(`status=eq.${encodeURIComponent(filter.status)}`);
  if (filter?.queueType) params.push(`queue_type=eq.${encodeURIComponent(filter.queueType)}`);
  return selectMany<ReviewQueueItem>(`${REVIEW_ITEMS}?${params.join("&")}`);
}

// ── WS-H: sensitive-admin access logging ─────────────────────────────────────
export async function logAdminAccess(input: {
  actor: string;
  actorType?: "founder" | "staff" | "admin" | "agent" | "system" | "anonymous" | "user";
  scope: string;
  action: string;
  safeObjectRef?: string | null;
  route?: string | null;
  allowed: boolean;
  outcome: string;
}): Promise<void> {
  await callRpc("log_yorisou_admin_access", {
    p_actor: input.actor,
    p_actor_type: input.actorType ?? "admin",
    p_scope: input.scope,
    p_action: input.action,
    p_safe_object_ref: input.safeObjectRef ?? null,
    p_route: input.route ?? null,
    p_allowed: input.allowed,
    p_outcome: input.outcome,
  });
}

// ── WS-F: readiness aggregates (no raw answers / PII) ────────────────────────
export async function getReadinessOverview(): Promise<ReadinessOverview | null> {
  return selectOne<ReadinessOverview>(`${OVERVIEW}?limit=1`);
}

export async function getMigrationFunnel(): Promise<MigrationFunnel | null> {
  return selectOne<MigrationFunnel>(`${FUNNEL}?limit=1`);
}

export async function getReviewQueueSummary(): Promise<ReviewQueueSummaryRow[]> {
  return selectMany<ReviewQueueSummaryRow>(`${QUEUE_SUMMARY}?order=queue_type.asc`);
}

export async function listOpenIncidents(): Promise<ServiceIncident[]> {
  return selectMany<ServiceIncident>(`${INCIDENTS}?status=eq.open&order=last_seen_at.desc&limit=100`);
}

// Whether the local/hosted backend is configured (used by dashboards to render a
// truthful empty/unconfigured state rather than fabricating numbers).
export function isApp2BackendConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}
