import type { ConsultationRecord } from "@/lib/server/yorisouData";
import { consultationArtifactReadService, type ConsultationArtifactSnapshot } from "@/lib/server/midBackend/support/consultationArtifactReadService";
import type { SupportTimelineEntryReadModel } from "@/lib/server/midBackend/support/readModels";

// Transitional read-only prototype for deriving canonical support timeline
// entries from consultation artifact snapshots. This is intentionally limited
// to consultation-derived entries and must not be used for route/display/write
// behavior until a broader timeline read layer is introduced.
export function prototypeConsultationArtifactTimelineEntry(
  artifact: ConsultationArtifactSnapshot,
): SupportTimelineEntryReadModel {
  return {
    supportTimelineEntryId: `timeline_consultation_${artifact.consultationId}`,
    userProfileId: artifact.userProfileId,
    authIdentityId: null,
    supportCaseId: null,
    sourceType: "consultation",
    sourceRecordId: artifact.consultationId,
    direction: "system",
    entryType: artifact.leadSubmitted ? "consultation_lead_submitted" : "consultation_created",
    title: artifact.recommendation.recommendedCategory,
    bodyText: artifact.recommendation.summary || null,
    occurredAt: artifact.createdAt,
    recordedAt: artifact.createdAt,
  };
}

export function prototypeConsultationArtifactTimelineEntries(
  artifacts: ConsultationArtifactSnapshot[],
): SupportTimelineEntryReadModel[] {
  return artifacts.map(prototypeConsultationArtifactTimelineEntry);
}

export function prototypeConsultationTimelineEntryFromLegacyRecord(
  record: ConsultationRecord,
): SupportTimelineEntryReadModel {
  return prototypeConsultationArtifactTimelineEntry(consultationArtifactReadService.getConsultationArtifact(record));
}

export function prototypeConsultationTimelineEntriesFromLegacyRecords(
  records: ConsultationRecord[],
): SupportTimelineEntryReadModel[] {
  return prototypeConsultationArtifactTimelineEntries(consultationArtifactReadService.listConsultationArtifacts(records));
}
