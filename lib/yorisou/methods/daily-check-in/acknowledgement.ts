// DCI-1 — canonical acknowledgement cascade (daily-ack-v1.2) for daily-check-in.
// Finite set of 13 authored acknowledgements; deterministic first-match priority
// cascade. The cascade picks COPY — it computes nothing about the person. No
// scoring, no AI generation, no prediction, no prescription.

import { DAILY_CHECK_IN_DEFINITION, type DailyAckId } from "./definition.generated";

const COPY_BY_ID = new Map(DAILY_CHECK_IN_DEFINITION.acknowledgements.map((a) => [a.ackId, a.copyJa]));

// Canonical cascade rules ("first_entry_ever" | "<fieldId> == <optionId>" | "default"),
// evaluated strictly in canonical order; first match wins; default always matches.
export function selectAcknowledgement(stateValues: Record<string, string | null>, isFirstEntryEver: boolean): { ackId: DailyAckId; copyJa: string } {
  for (const { rule, ackId } of DAILY_CHECK_IN_DEFINITION.acknowledgementCascade) {
    if (rule === "first_entry_ever") {
      if (isFirstEntryEver) return resolved(ackId);
      continue;
    }
    if (rule === "default") return resolved(ackId);
    const match = /^(\w+) == (\w+)$/.exec(rule);
    if (!match) continue; // canonical rules are contract-tested; unknown forms never fire
    const [, fieldId, optionId] = match;
    if (stateValues[fieldId] === optionId) return resolved(ackId);
  }
  // Unreachable: the canonical cascade ends with an unconditional default
  // (contract-tested); this satisfies the type system only.
  return resolved("ACK_NEUTRAL");
}

function resolved(ackId: string): { ackId: DailyAckId; copyJa: string } {
  const copyJa = COPY_BY_ID.get(ackId as DailyAckId);
  if (!copyJa) throw new Error(`acknowledgement copy missing for ${ackId}`);
  return { ackId: ackId as DailyAckId, copyJa };
}
