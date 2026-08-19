// PRODUCT PACK — yorisou.imairo share adapter 「いま色テスト」 result card, template imairo-share-v1.
//
// Yorisou product IP: the mapping from the EXISTING approved public Imairo result content to the
// sharing.core public derivative. This pack owns the card family id, the template version, the
// allowlist, and nothing else — no scoring, no questions, no result calculation, no persistence.
// The Imairo methodology is protected and this file only ever READS its approved PUBLIC output
// (the same `getTemporary120QResultCompatibility` content the legacy share card renders today).
//
// ALLOWLIST-BUILT, NEVER REDACTED. The payload is constructed field by field from approved public
// content; a private object is never "cleaned". `validateImairoSharePayload` refuses any payload
// carrying a forbidden key or missing the schema — and the reader fails CLOSED on it, so a
// malformed stored payload is concealed rather than partially rendered.

import {
  getTemporary120QResultCompatibility,
  PUBLIC_RESULT_BRANDED_TEST_NAME,
  PUBLIC_RESULT_GLOBAL_NOTE,
} from "@/app/tests/ima-iro/resultCompatibility";
import type { ShareCandidate } from "@/lib/platform/sharingCore";

export const IMAIRO_SHARE_CARD_FAMILY = "imairo_result_card";
export const IMAIRO_SHARE_SOURCE_FAMILY = "assessment_result";
export const IMAIRO_SHARE_TEMPLATE_REF = "yorisou.imairo/result-card";
export const IMAIRO_SHARE_TEMPLATE_VERSION = "1.0.0";
export const IMAIRO_SHARE_PAYLOAD_VERSION = "imairo-share-v1";

/** The versioned public payload — exactly what the card needs, nothing else. */
export interface ImairoSharePayload {
  test_name: string;
  result_code: string;
  display_line: string;
  code_line: string;
  recognition_line: string;
  share_line: string;
  highlights: { label: string; text: string }[];
  hero_chips: string[];
  global_note: string;
  locale: "ja";
}

/** Keys that must never exist anywhere in a share payload, at any depth. */
export const IMAIRO_SHARE_FORBIDDEN_KEYS = [
  "owner_account_id",
  "ownerAccountId",
  "source_ref",
  "sourceRef",
  "result_row_id",
  "resultRowId",
  "attempt_id",
  "attemptId",
  "completion_id",
  "completionId",
  "raw_answers",
  "answers",
  "scores",
  "dimension_output",
  "dimensionOutput",
  "confidence",
  "confidence_band",
  "payloadKey",
  "payload_key",
  "acceptedResultId",
  "accepted_result_id",
  "correctedResultId",
  "memory",
  "state",
  "reflection",
  "report",
  "email",
  "line_user_id",
] as const;

const REQUIRED_STRING_FIELDS = [
  "test_name",
  "result_code",
  "display_line",
  "code_line",
  "recognition_line",
  "share_line",
  "global_note",
] as const;

function collectKeys(value: unknown, into: Set<string>): void {
  if (value === null || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const entry of value) collectKeys(entry, into);
    return;
  }
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    into.add(key);
    collectKeys(entry, into);
  }
}

/**
 * Schema + forbidden-key validation for imairo-share-v1. Throws on any violation; callers treat a
 * throw as "this payload does not exist".
 */
export function validateImairoSharePayload(payload: unknown): asserts payload is ImairoSharePayload {
  if (payload === null || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("share_payload_invalid");
  }
  const record = payload as Record<string, unknown>;
  const keys = new Set<string>();
  collectKeys(record, keys);
  for (const forbidden of IMAIRO_SHARE_FORBIDDEN_KEYS) {
    if (keys.has(forbidden)) throw new Error(`share_payload_forbidden_key:${forbidden}`);
  }
  for (const field of REQUIRED_STRING_FIELDS) {
    const value = record[field];
    if (typeof value !== "string" || value.length === 0 || value.length > 300) {
      throw new Error(`share_payload_invalid_field:${field}`);
    }
  }
  if (record.locale !== "ja") throw new Error("share_payload_invalid_field:locale");
  if (!Array.isArray(record.highlights) || record.highlights.length > 3) {
    throw new Error("share_payload_invalid_field:highlights");
  }
  for (const highlight of record.highlights as unknown[]) {
    const h = highlight as Record<string, unknown>;
    if (typeof h?.label !== "string" || typeof h?.text !== "string" || h.label.length > 80 || h.text.length > 200) {
      throw new Error("share_payload_invalid_field:highlights");
    }
  }
  if (!Array.isArray(record.hero_chips) || record.hero_chips.length > 3) {
    throw new Error("share_payload_invalid_field:hero_chips");
  }
  for (const chip of record.hero_chips as unknown[]) {
    if (typeof chip !== "string" || chip.length > 40) throw new Error("share_payload_invalid_field:hero_chips");
  }
}

/**
 * Build the candidate from an ASSIGNED public result code — the same approved content the legacy
 * share card renders. Returns null when the code resolves to no assigned archetype: a placeholder
 * result is not publishable.
 */
export function buildImairoShareCandidate(input: {
  publicResultCode: string;
  sourceRef: string;
}): ShareCandidate<ImairoSharePayload> | null {
  const compatibility = getTemporary120QResultCompatibility({
    resultId: input.publicResultCode,
    overlayId: null,
    confidenceBand: "low",
    payloadKey: null,
  });
  if (compatibility.resultStatus !== "assigned" || !compatibility.assignment) return null;

  const payload: ImairoSharePayload = {
    test_name: PUBLIC_RESULT_BRANDED_TEST_NAME,
    result_code: compatibility.assignment.publicCode,
    display_line: compatibility.displayLine,
    code_line: compatibility.codeLine ?? `${compatibility.assignment.clanJapanese}のタイプ`,
    recognition_line: compatibility.recognitionLine,
    share_line: compatibility.shareLine,
    highlights: compatibility.highlights.slice(0, 3).map((h) => ({ label: h.label, text: h.text })),
    hero_chips: compatibility.heroChips.slice(0, 3),
    global_note: PUBLIC_RESULT_GLOBAL_NOTE,
    locale: "ja",
  };
  validateImairoSharePayload(payload);

  return {
    card_family: IMAIRO_SHARE_CARD_FAMILY,
    source_family: IMAIRO_SHARE_SOURCE_FAMILY,
    source_ref: input.sourceRef,
    template_ref: IMAIRO_SHARE_TEMPLATE_REF,
    template_version: IMAIRO_SHARE_TEMPLATE_VERSION,
    payload_version: IMAIRO_SHARE_PAYLOAD_VERSION,
    payload,
  };
}
