import type { ConsultationRecord } from "@/lib/server/yorisouData";
import type { ConsultationArtifactReadModel } from "@/lib/server/midBackend/support/readModels";

export function mapConsultationRecordToArtifact(record: ConsultationRecord): ConsultationArtifactReadModel {
  return {
    consultationId: record.id,
    sessionId: record.sessionId,
    userProfileId: record.userId,
    locale: record.locale,
    createdAt: record.createdAt,
    recommendation: {
      recommendedCategory: record.recommendedCategory,
      secondaryRecommendation: record.secondaryRecommendation,
      summary: record.summary,
      suggestedNextAction: record.suggestedNextAction,
    },
    answerLabels: record.answerLabels,
    leadSubmitted: record.leadSubmitted,
    leadPresent: Boolean(record.lead),
  };
}

export function mapConsultationRecordsToArtifacts(records: ConsultationRecord[]): ConsultationArtifactReadModel[] {
  return records.map(mapConsultationRecordToArtifact);
}
