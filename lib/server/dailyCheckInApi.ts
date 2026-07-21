import "server-only";
// DCI-1.1 §11 — shared bounded-error mapping and bounded-body reader for the
// daily-check-in API routes. Only allowlisted codes ever reach the client;
// internal Postgres exception text is never exposed; raw bodies are never logged.

export const MAX_DAILY_BODY_BYTES = 16 * 1024;

const RPC_ERROR_MAP: Record<string, { status: number; error: string }> = {
  daily_record_exists: { status: 409, error: "record_exists_use_correction" },
  daily_record_not_found: { status: 404, error: "record_not_found" },
  daily_record_correction_window_closed: { status: 409, error: "correction_window_closed" },
  daily_record_invalid_reason: { status: 422, error: "invalid_correction_reason" },
  daily_record_owner_required: { status: 400, error: "invalid_request" },
  daily_persistence_not_configured: { status: 503, error: "backend_unavailable" },
};

export function mapDailyStoreError(error: unknown, fallback: string): { status: number; error: string; internalCode: string } {
  const message = error instanceof Error ? error.message : "unknown";
  const mapped = RPC_ERROR_MAP[message];
  if (mapped) return { ...mapped, internalCode: message };
  return { status: 500, error: fallback, internalCode: message };
}

export async function readBoundedJson(request: Request): Promise<{ ok: true; body: unknown } | { ok: false; status: number; error: string }> {
  const raw = await request.text().catch(() => null);
  if (raw === null) return { ok: false, status: 400, error: "invalid_request" };
  if (raw.length > MAX_DAILY_BODY_BYTES) return { ok: false, status: 413, error: "request_too_large" };
  try {
    return { ok: true, body: JSON.parse(raw) };
  } catch {
    return { ok: false, status: 400, error: "invalid_request" };
  }
}
