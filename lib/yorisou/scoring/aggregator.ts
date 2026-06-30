import {
  CONFIDENCE_BANDS,
  DIMENSION_CODES,
  FORMULA_DRAFT_REQUIRES_EDWARD_APPROVAL,
  REVIEW_ROUTING_VALUES,
  SENSITIVITY_HANDLING_VALUES,
  SIGNAL_STRENGTH_VALUES,
  SUBDIMENSION_CODES,
  type ConfidenceBand,
  type DimensionCode,
  type OptionScore,
  type ReviewRouting,
  type ScoringOutput,
  type SensitivityHandling,
  type SignalStrength,
  type SubdimensionCode,
} from "./types";
import { summarizeSafetyRouting } from "./safety-routing";

function createBucketMap<T extends string>(keys: readonly T[]) {
  return Object.fromEntries(keys.map((key) => [key, []])) as unknown as Record<T, OptionScore[]>;
}

function createCountMap<T extends string | number>(keys: readonly T[]) {
  return Object.fromEntries(keys.map((key) => [key, 0])) as Record<T, number>;
}

export function aggregateInternal120QSelections(selectedRows: OptionScore[]): ScoringOutput {
  const groupedByDimension = createBucketMap(DIMENSION_CODES);
  const groupedBySubdimension = createBucketMap(SUBDIMENSION_CODES);
  const groupedByPrimarySignal: Record<string, OptionScore[]> = {};
  const signalStrengthSummary = createCountMap(
    SIGNAL_STRENGTH_VALUES,
  ) as Record<SignalStrength, number>;
  const confidenceBandSummary = createCountMap(
    CONFIDENCE_BANDS,
  ) as Record<ConfidenceBand, number>;
  const sensitivitySummary = createCountMap(
    SENSITIVITY_HANDLING_VALUES,
  ) as Record<SensitivityHandling, number>;
  const reviewRoutingSummary = createCountMap(
    REVIEW_ROUTING_VALUES,
  ) as Record<ReviewRouting, number>;

  const internalWarnings: string[] = [];

  for (const row of selectedRows) {
    groupedByDimension[row.dimensionCode as DimensionCode].push(row);
    groupedBySubdimension[row.subdimensionCode as SubdimensionCode].push(row);

    if (!groupedByPrimarySignal[row.primarySignal]) {
      groupedByPrimarySignal[row.primarySignal] = [];
    }
    groupedByPrimarySignal[row.primarySignal].push(row);

    signalStrengthSummary[row.signalStrength] += 1;
    confidenceBandSummary[row.confidenceBand] += 1;
    sensitivitySummary[row.sensitivityHandling] += 1;
    reviewRoutingSummary[row.reviewRouting] += 1;

    if (row.crossFamilyHandling === "source_bounded_cross_family_primary") {
      internalWarnings.push(
        `${row.questionId}:${row.optionId} is source_bounded_cross_family_primary and must not create an independent cross-dimension score.`,
      );
    }
    if (row.crossFamilyHandling === "modifier_only") {
      internalWarnings.push(
        `${row.questionId}:${row.optionId} is modifier_only and must not create an independent dimension score.`,
      );
    }
  }

  const safetyRoutingSummary = summarizeSafetyRouting(selectedRows);
  internalWarnings.push(...safetyRoutingSummary.warnings);

  return {
    selectedRows,
    groupedByDimension,
    groupedBySubdimension,
    groupedByPrimarySignal,
    signalStrengthSummary,
    confidenceBandSummary,
    sensitivitySummary,
    reviewRoutingSummary,
    safetyRoutingSummary,
    internalWarnings,
    formulaStatus: FORMULA_DRAFT_REQUIRES_EDWARD_APPROVAL,
  };
}
