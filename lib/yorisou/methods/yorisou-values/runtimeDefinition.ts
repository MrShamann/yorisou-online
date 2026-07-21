// YV-1 — adapter from the generated canonical artifact to the channel-neutral
// scored runtime boundary definition. No content lives here.

import type { ScoredMethodDefinition } from "@/lib/yorisou/method-runtime/scored";
import { YORISOU_VALUES_DEFINITION } from "./definition.generated";

const DEF = YORISOU_VALUES_DEFINITION;

export const YORISOU_VALUES_RUNTIME_DEFINITION: ScoredMethodDefinition = {
  methodId: DEF.methodId,
  methodVersion: DEF.methodVersion,
  executionModel: DEF.executionModel,
  bankVersion: DEF.bankVersion,
  scoringVersion: DEF.scoringVersion,
  resultSchemaVersion: DEF.resultSchemaVersion,
  bankContentHash: DEF.bankContentHash,
  dimensionOrder: DEF.dimensionOrder,
  dimensionAppearances: DEF.dimensionAppearances,
  items: DEF.items,
  requiredAnsweredItems: DEF.scoring.requiredAnsweredItems,
  mixedThreshold: DEF.scoring.mixedThreshold,
};
