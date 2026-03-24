// Non-live validation only. This file must never be imported by runtime code.
// It exists solely for explicit compile-time support composition checks.
// Optional manual check:
// `npx tsx lib/server/midBackend/support/supportReadComposition.validation.ts`

import { buildSupportReadComposition, type SupportReadComposition } from "@/lib/server/midBackend/support/supportReadComposition";

const baseComposition = buildSupportReadComposition({
  viewer: {
    session: null,
    account: null,
  },
  display: {
    account: null,
    consultations: [],
    latestLineEvent: null,
  },
});

const _baseCompositionCheck: SupportReadComposition = baseComposition;

const compositionWithCanonical = buildSupportReadComposition({
  viewer: {
    session: null,
    account: null,
  },
  display: {
    account: null,
    consultations: [],
    latestLineEvent: null,
  },
  canonical: {
    unifiedTimeline: [],
  },
});

const _canonicalCompositionCheck: SupportReadComposition = compositionWithCanonical;

void _baseCompositionCheck;
void _canonicalCompositionCheck;
