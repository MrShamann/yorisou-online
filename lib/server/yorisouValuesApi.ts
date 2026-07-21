import "server-only";
// YV-1 §10/§11 — shared bounded-error mapping and bounded-body reader for the
// yorisou-values API routes. Only allowlisted codes ever reach the client;
// internal Postgres exception text is never exposed; raw answer bodies are
// never logged.

// YV-1.1: the pure contract helpers (provenance gate, strict-field check) live in
// a server-agnostic module so tests can exercise them directly; re-exported here
// for the API routes' convenience.
export { CANONICAL_VALUES_PROVENANCE, recordProvenanceMatchesCanonical, firstUnknownKey } from "@/lib/yorisou/methods/yorisou-values/contract";

export const MAX_VALUES_BODY_BYTES = 32 * 1024; // 48 answers + provenance fits well within

const RPC_ERROR_MAP: Record<string, { status: number; error: string }> = {
  values_record_not_found: { status: 404, error: "record_not_found" },
  values_invalid_reason: { status: 422, error: "invalid_correction_reason" },
  values_owner_required: { status: 400, error: "invalid_request" },
  values_persistence_not_configured: { status: 503, error: "backend_unavailable" },
  // YV-1.1 (YV-C1/YV-C2): confirmation/provenance-aware bounded codes.
  values_record_contract_version_mismatch: { status: 409, error: "values_record_contract_version_mismatch" },
  values_no_answer_change: { status: 409, error: "values_no_answer_change" },
  values_invalid_confirmation: { status: 422, error: "invalid_confirmation" },
};

export function mapValuesStoreError(error: unknown, fallback: string): { status: number; error: string; internalCode: string } {
  const message = error instanceof Error ? error.message : "unknown";
  const mapped = RPC_ERROR_MAP[message];
  if (mapped) return { ...mapped, internalCode: message };
  return { status: 500, error: fallback, internalCode: message };
}

export async function readBoundedJson(request: Request): Promise<{ ok: true; body: unknown } | { ok: false; status: number; error: string }> {
  const raw = await request.text().catch(() => null);
  if (raw === null) return { ok: false, status: 400, error: "invalid_request" };
  if (raw.length > MAX_VALUES_BODY_BYTES) return { ok: false, status: 413, error: "request_too_large" };
  try {
    return { ok: true, body: JSON.parse(raw) };
  } catch {
    return { ok: false, status: 400, error: "invalid_request" };
  }
}
