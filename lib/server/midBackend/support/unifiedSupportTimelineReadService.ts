import type { MessageEventSnapshot } from "@/lib/server/midBackend/services/messageEventReadService";
import type { ConsultationArtifactSnapshot } from "@/lib/server/midBackend/support/consultationArtifactReadService";
import {
  prototypeLineMessageEventTimelineEntries,
  prototypeLineMessageEventTimelineEntry,
  prototypeUnifiedSupportTimelineEntries,
} from "@/lib/server/midBackend/support/unifiedSupportTimelinePrototype";
import type { SupportTimelineEntryReadModel } from "@/lib/server/midBackend/support/readModels";

export type UnifiedSupportTimelineSnapshot = SupportTimelineEntryReadModel[];

// Transitional read-only service for unified support timeline snapshots
// derived from consultation artifact snapshots and canonical LINE message-event
// snapshots. This does not imply canonical storage and must not be used for
// route/display/write behavior until a broader timeline read layer is adopted.
export class UnifiedSupportTimelineReadService {
  getLineTimelineEntry(event: MessageEventSnapshot): SupportTimelineEntryReadModel {
    return prototypeLineMessageEventTimelineEntry(event);
  }

  listLineTimelineEntries(events: MessageEventSnapshot[]): SupportTimelineEntryReadModel[] {
    return prototypeLineMessageEventTimelineEntries(events);
  }

  getUnifiedTimeline(input: {
    consultationArtifacts: ConsultationArtifactSnapshot[];
    lineMessageEvents: MessageEventSnapshot[];
  }): UnifiedSupportTimelineSnapshot {
    return prototypeUnifiedSupportTimelineEntries(input);
  }
}

export const unifiedSupportTimelineReadService = new UnifiedSupportTimelineReadService();
