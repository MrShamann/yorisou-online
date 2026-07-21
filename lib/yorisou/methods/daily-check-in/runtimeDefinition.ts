// DCI-1 — adapter from the generated canonical artifact to the channel-neutral
// recorded-state runtime boundary definition. No content lives here.

import type { MethodRuntimeDefinition } from "@/lib/yorisou/method-runtime/recordedState";
import { DAILY_CHECK_IN_DEFINITION } from "./definition.generated";

export const DAILY_CHECK_IN_RUNTIME_DEFINITION: MethodRuntimeDefinition = {
  methodId: DAILY_CHECK_IN_DEFINITION.methodId,
  methodVersion: DAILY_CHECK_IN_DEFINITION.methodVersion,
  executionModel: DAILY_CHECK_IN_DEFINITION.executionModel,
  schemaVersion: DAILY_CHECK_IN_DEFINITION.schemaVersion,
  acknowledgementVersion: DAILY_CHECK_IN_DEFINITION.acknowledgementVersion,
  contentHash: DAILY_CHECK_IN_DEFINITION.contentHash,
  fields: DAILY_CHECK_IN_DEFINITION.fields,
  privateReflection: {
    fieldId: DAILY_CHECK_IN_DEFINITION.privateReflection.fieldId,
    maxLength: DAILY_CHECK_IN_DEFINITION.privateReflection.maxLength,
  },
  comparisonPolicy: DAILY_CHECK_IN_DEFINITION.comparisonPolicy,
  understandingPolicy: DAILY_CHECK_IN_DEFINITION.understandingPolicy,
};
