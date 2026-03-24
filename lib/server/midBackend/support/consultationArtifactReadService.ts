import type { ConsultationRecord } from "@/lib/server/yorisouData";
import type { ConsultationArtifactReadModel } from "@/lib/server/midBackend/support/readModels";
import {
  readConsultationArtifactFromLegacyRecord,
  readConsultationArtifactsFromLegacyRecords,
} from "@/lib/server/midBackend/support/consultationArtifactReads";

export type ConsultationArtifactSnapshot = ConsultationArtifactReadModel;

// Transitional read-only service for canonical consultation artifact reads
// derived from legacy ConsultationRecord values. This does not imply canonical
// consultation storage and must not be used for write-path or route logic.
export class ConsultationArtifactReadService {
  getConsultationArtifact(record: ConsultationRecord): ConsultationArtifactSnapshot {
    return readConsultationArtifactFromLegacyRecord(record);
  }

  listConsultationArtifacts(records: ConsultationRecord[]): ConsultationArtifactSnapshot[] {
    return readConsultationArtifactsFromLegacyRecords(records);
  }
}

export const consultationArtifactReadService = new ConsultationArtifactReadService();
