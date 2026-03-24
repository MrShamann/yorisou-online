import type {
  AccountRecord,
  ConsultationRecord,
  LineWebhookEventRecord,
  SessionRecord,
} from "@/lib/server/yorisouData";
import type { UnifiedSupportTimelineSnapshot } from "@/lib/server/midBackend/support/unifiedSupportTimelineReadService";

// Transitional internal-only envelope for future support read composition.
// The `display` branch mirrors the current live support payload shape, while
// `canonical` can later host optional unified timeline reads without changing
// any returned route/display contract.
export type SupportReadComposition = {
  viewer: {
    session: SessionRecord | null;
    account: AccountRecord | null;
  };
  display: {
    account: AccountRecord | null;
    consultations: ConsultationRecord[];
    latestLineEvent: LineWebhookEventRecord | null;
  };
  canonical?: {
    unifiedTimeline?: UnifiedSupportTimelineSnapshot;
  };
};

export type SupportReadCompositionInput = {
  viewer: {
    session: SessionRecord | null;
    account: AccountRecord | null;
  };
  display: {
    account: AccountRecord | null;
    consultations: ConsultationRecord[];
    latestLineEvent: LineWebhookEventRecord | null;
  };
  canonical?: {
    unifiedTimeline?: UnifiedSupportTimelineSnapshot;
  };
};

// Transitional pure builder for the internal support read composition envelope.
// It performs no fetching or timeline computation and only packages already
// available data into the internal-only shape for future safe adoption.
// Future non-live validation for this builder should live in the neighboring
// `supportReadComposition.validation.ts` file and be checked explicitly via
// TypeScript/tsx when needed, never imported by live runtime paths.
export function buildSupportReadComposition(input: SupportReadCompositionInput): SupportReadComposition {
  if (!input.canonical) {
    return {
      viewer: input.viewer,
      display: input.display,
    };
  }

  return {
    viewer: input.viewer,
    display: input.display,
    canonical: input.canonical,
  };
}
