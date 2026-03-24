import type { MessageEventSnapshot } from "@/lib/server/midBackend/services/messageEventReadService";
import { prototypeConsultationArtifactTimelineEntries } from "@/lib/server/midBackend/support/consultationTimelinePrototype";
import type { ConsultationArtifactSnapshot } from "@/lib/server/midBackend/support/consultationArtifactReadService";
import type { SupportTimelineEntryReadModel } from "@/lib/server/midBackend/support/readModels";

// Transitional read-only prototype for combining consultation-derived timeline
// entries with canonical LINE message-event snapshots. This does not imply a
// complete unified timeline model and must not be used for route/display/write
// behavior until a broader timeline read layer is introduced.
export function prototypeLineMessageEventTimelineEntry(
  event: MessageEventSnapshot,
): SupportTimelineEntryReadModel {
  return {
    supportTimelineEntryId: `timeline_line_${event.messageEventId}`,
    userProfileId: event.userProfileId,
    authIdentityId: event.authIdentityId,
    supportCaseId: null,
    sourceType: "line_message",
    sourceRecordId: event.messageEventId,
    direction: event.direction,
    entryType: toLineTimelineEntryType(event.eventType),
    title: event.sourceType || event.eventType,
    bodyText: event.contentText || null,
    occurredAt: event.occurredAt,
    recordedAt: event.recordedAt,
  };
}

export function prototypeLineMessageEventTimelineEntries(
  events: MessageEventSnapshot[],
): SupportTimelineEntryReadModel[] {
  return events.map(prototypeLineMessageEventTimelineEntry);
}

export function prototypeUnifiedSupportTimelineEntries(input: {
  consultationArtifacts: ConsultationArtifactSnapshot[];
  lineMessageEvents: MessageEventSnapshot[];
}): SupportTimelineEntryReadModel[] {
  const consultationEntries = prototypeConsultationArtifactTimelineEntries(input.consultationArtifacts);
  const lineEntries = prototypeLineMessageEventTimelineEntries(input.lineMessageEvents);

  return [...consultationEntries, ...lineEntries];
}

function toLineTimelineEntryType(
  eventType: MessageEventSnapshot["eventType"],
): SupportTimelineEntryReadModel["entryType"] {
  if (eventType === "follow") {
    return "line_follow";
  }

  if (eventType === "unfollow") {
    return "line_unfollow";
  }

  if (eventType === "postback") {
    return "line_postback";
  }

  return "line_message";
}
