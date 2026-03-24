import type { ConsultationRecord } from "@/lib/server/yorisouData";
import { mapConsultationRecordToArtifact, mapConsultationRecordsToArtifacts } from "@/lib/server/midBackend/adapters/consultationRecordAdapter";

// Transitional read-only surface for canonical consultation artifact reads
// derived from legacy ConsultationRecord values. This does not imply canonical
// storage and must not be used for write-path or route-branching logic.
export function readConsultationArtifactFromLegacyRecord(record: ConsultationRecord) {
  return mapConsultationRecordToArtifact(record);
}

export function readConsultationArtifactsFromLegacyRecords(records: ConsultationRecord[]) {
  return mapConsultationRecordsToArtifacts(records);
}
