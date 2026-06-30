import {
  SENSITIVITY_HANDLING_VALUES,
  REVIEW_ROUTING_VALUES,
  type OptionScore,
  type SafetyRoutingSummary,
} from "./types";

export function summarizeSafetyRouting(rows: OptionScore[]): SafetyRoutingSummary {
  const sensitivityCounts = {
    public_safe: 0,
    private_low: 0,
    private_medium: 0,
    private_high: 0,
  } as Record<(typeof SENSITIVITY_HANDLING_VALUES)[number], number>;

  const reviewRoutingCounts = {
    none: 0,
    needs_review: 0,
    needs_human_review_sensitive: 0,
  } as Record<(typeof REVIEW_ROUTING_VALUES)[number], number>;

  for (const row of rows) {
    sensitivityCounts[row.sensitivityHandling] += 1;
    reviewRoutingCounts[row.reviewRouting] += 1;
  }

  const highSensitivityRows = rows.filter(
    (row) => row.sensitivityHandling === "private_high",
  );

  const warnings: string[] = [];
  if (highSensitivityRows.length > 0) {
    warnings.push(
      `${highSensitivityRows.length} rows are marked private_high. Raw scoring data remains internal only.`,
    );
  }
  if (reviewRoutingCounts.needs_human_review_sensitive > 0) {
    warnings.push(
      `${reviewRoutingCounts.needs_human_review_sensitive} rows require human review for sensitivity routing. This is not a severity or danger score.`,
    );
  }

  return {
    sensitivityCounts,
    reviewRoutingCounts,
    highSensitivityRows,
    warnings,
  };
}
