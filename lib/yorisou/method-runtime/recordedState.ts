// DCI-1 — minimal channel-neutral RECORDED-STATE method runtime boundary.
//
// This is deliberately NOT a generalized Dynamic Test Engine. It supports exactly
// one MTF-1.3 execution model (`recorded_state`) and rejects every other model
// explicitly. It contains no scored-method implementation, no archetype engine,
// no universal score, no persona logic, no LINE-specific logic and no
// route-specific business logic. A future scored implementation may EXTEND this
// boundary with its own executor without rewriting the daily method; that
// extension is intentionally not implemented here.

export type RecordedStateFieldDefinition = {
  fieldId: string;
  labelJa: string;
  options: readonly { optionId: string; labelJa: string }[];
};

// The channel-neutral definition a recorded-state method hands to the runtime.
export type MethodRuntimeDefinition = {
  methodId: string;
  methodVersion: string;
  executionModel: string; // only "recorded_state" is executable by this boundary
  schemaVersion: string;
  acknowledgementVersion: string;
  contentHash: string;
  fields: readonly RecordedStateFieldDefinition[];
  privateReflection: { fieldId: string; maxLength: number };
  comparisonPolicy: string;
  understandingPolicy: string;
};

export type RecordedStateInput = {
  values: Record<string, string | null>; // fieldId -> optionId | null
  memoOptIn: boolean;
  memo: string | null;
  producedAt: string; // UTC ISO 8601 (record contract: producedAt, not computedAt)
  entryLocalDate: string; // YYYY-MM-DD in the entry timezone
  timezone: string; // IANA
  utcOffsetMinutes?: number | null;
};

export type MethodRuntimeValidationError = {
  code:
    | "unsupported_execution_model"
    | "unknown_field"
    | "unknown_option"
    | "no_structured_field"
    | "memo_without_opt_in"
    | "memo_too_long"
    | "invalid_timezone"
    | "invalid_entry_local_date"
    | "entry_date_timezone_mismatch"
    | "invalid_produced_at";
  message: string;
};

export type RecordedStateProvenance = {
  kind: "recorded_state";
  schemaVersion: string;
  methodVersion: string;
  yorisouScoring: null; // structural — no score of any kind is calculated
};

// The StateRecordResult envelope (MTF-1.3 polymorphic result model).
export type RecordedStateResultEnvelope = {
  resultVariant: "StateRecordResult";
  methodId: string;
  stateValues: Record<string, string | null>;
  memoIncluded: boolean;
  producedAt: string;
  entryLocalDate: string;
  timezone: string;
  utcOffsetMinutes: number | null;
  comparisonPolicy: string;
  understandingPolicy: string;
  provenance: RecordedStateProvenance;
  confirmation: { required: true };
};

export type RecordedStateExecution =
  | { ok: true; envelope: RecordedStateResultEnvelope }
  | { ok: false; errors: MethodRuntimeValidationError[] };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidIanaTimezone(timezone: string): boolean {
  if (!timezone || timezone.length > 64) return false;
  try {
    new Intl.DateTimeFormat("en-CA", { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

// Local calendar date of a UTC instant in an IANA timezone (en-CA => YYYY-MM-DD).
export function localDateForInstant(utcIso: string, timezone: string): string | null {
  const instant = new Date(utcIso);
  if (Number.isNaN(instant.getTime())) return null;
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).format(instant);
  } catch {
    return null;
  }
}

// Execute a recorded-state entry: validate against the definition and produce the
// StateRecordResult envelope. Deterministic; computes nothing about the person.
export function executeRecordedState(definition: MethodRuntimeDefinition, input: RecordedStateInput): RecordedStateExecution {
  const errors: MethodRuntimeValidationError[] = [];
  if (definition.executionModel !== "recorded_state") {
    return {
      ok: false,
      errors: [{ code: "unsupported_execution_model", message: `this runtime boundary executes only recorded_state (got: ${definition.executionModel})` }],
    };
  }

  const knownFields = new Map(definition.fields.map((f) => [f.fieldId, new Set(f.options.map((o) => o.optionId))]));
  for (const [fieldId, optionId] of Object.entries(input.values)) {
    const options = knownFields.get(fieldId);
    if (!options) {
      errors.push({ code: "unknown_field", message: `unknown field: ${fieldId}` });
      continue;
    }
    if (optionId !== null && !options.has(optionId)) {
      errors.push({ code: "unknown_option", message: `unknown option for ${fieldId}: ${optionId}` });
    }
  }
  const answeredCount = definition.fields.filter((f) => typeof input.values[f.fieldId] === "string" && input.values[f.fieldId]).length;
  if (answeredCount === 0) {
    // Record contract: an entry REQUIRES >=1 structured field; a memo alone is not an entry.
    errors.push({ code: "no_structured_field", message: "an entry requires at least one structured field; a memo alone is not an entry" });
  }
  if (input.memo !== null && input.memo !== undefined && input.memo !== "") {
    if (!input.memoOptIn) errors.push({ code: "memo_without_opt_in", message: "memo accepted only when the user has opted in" });
    if (input.memo.length > definition.privateReflection.maxLength) {
      errors.push({ code: "memo_too_long", message: `memo exceeds ${definition.privateReflection.maxLength} characters` });
    }
  }
  if (!isValidIanaTimezone(input.timezone)) errors.push({ code: "invalid_timezone", message: `invalid IANA timezone: ${input.timezone}` });
  if (!DATE_RE.test(input.entryLocalDate)) errors.push({ code: "invalid_entry_local_date", message: `invalid entryLocalDate: ${input.entryLocalDate}` });
  const producedAtInstant = new Date(input.producedAt);
  if (Number.isNaN(producedAtInstant.getTime())) errors.push({ code: "invalid_produced_at", message: `invalid producedAt: ${input.producedAt}` });
  if (errors.length === 0) {
    const derivedLocalDate = localDateForInstant(input.producedAt, input.timezone);
    if (derivedLocalDate !== input.entryLocalDate) {
      errors.push({
        code: "entry_date_timezone_mismatch",
        message: `entryLocalDate ${input.entryLocalDate} does not match producedAt in ${input.timezone} (${derivedLocalDate})`,
      });
    }
  }
  if (errors.length) return { ok: false, errors };

  const stateValues: Record<string, string | null> = {};
  for (const f of definition.fields) stateValues[f.fieldId] = typeof input.values[f.fieldId] === "string" ? input.values[f.fieldId] : null;

  return {
    ok: true,
    envelope: {
      resultVariant: "StateRecordResult",
      methodId: definition.methodId,
      stateValues,
      memoIncluded: Boolean(input.memoOptIn && input.memo),
      producedAt: input.producedAt,
      entryLocalDate: input.entryLocalDate,
      timezone: input.timezone,
      utcOffsetMinutes: input.utcOffsetMinutes ?? null,
      comparisonPolicy: definition.comparisonPolicy,
      understandingPolicy: definition.understandingPolicy,
      provenance: {
        kind: "recorded_state",
        schemaVersion: definition.schemaVersion,
        methodVersion: definition.methodVersion,
        yorisouScoring: null,
      },
      confirmation: { required: true },
    },
  };
}
