// DCI-1 — canonical longitudinal rules (daily-longitudinal-v1) for daily-check-in.
//
// Field-valid denominator principle (canonical): every summary uses ONLY the
// recorded entries where the specific field was answered. Missing days and
// unanswered fields are neutral and excluded; unrecorded days are never treated
// as known states. Copy carries the 「記録した日の中では…」 meaning. No streaks,
// no worsening claims, no medical inference, no hidden score, no ranking.

import { DAILY_CHECK_IN_DEFINITION } from "./definition.generated";

export type TimelineEntry = {
  entryLocalDate: string; // YYYY-MM-DD
  stateValues: Record<string, string | null>;
};

export type SevenDaySummary = { summaryId: string; copyJa: string };

const LABELS = new Map<string, string>(
  DAILY_CHECK_IN_DEFINITION.fields.flatMap((f) => f.options.map((o) => [`${f.fieldId}:${o.optionId}`, o.labelJa] as [string, string])),
);

const fieldValid = (entries: TimelineEntry[], fieldId: string) =>
  entries.filter((e) => typeof e.stateValues[fieldId] === "string" && e.stateValues[fieldId]);

const countOf = (entries: TimelineEntry[], fieldId: string, optionId: string) =>
  fieldValid(entries, fieldId).filter((e) => e.stateValues[fieldId] === optionId).length;

// Modal kyou_hoshii labels over field-valid days; ties joined by 「と」; below the
// minimum the caller shows nothing.
function mostFrequentNeedLabel(entries: TimelineEntry[], minFieldValid: number): string | null {
  const valid = fieldValid(entries, "kyou_hoshii");
  if (valid.length < minFieldValid) return null;
  const counts = new Map<string, number>();
  for (const e of valid) counts.set(e.stateValues.kyou_hoshii as string, (counts.get(e.stateValues.kyou_hoshii as string) ?? 0) + 1);
  const max = Math.max(...counts.values());
  if (max < minFieldValid) return null;
  const tied = [...counts.entries()].filter(([, c]) => c === max).map(([optionId]) => LABELS.get(`kyou_hoshii:${optionId}`) ?? optionId);
  // Deterministic tie order: canonical option declaration order.
  const order: string[] = DAILY_CHECK_IN_DEFINITION.fields.find((f) => f.fieldId === "kyou_hoshii")!.options.map((o) => o.labelJa);
  tied.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  return tied.join("と");
}

// Rule semantics keyed by canonical summaryId; minFieldValid and copy come from the
// canonical artifact (contract-tested against the canonical rule descriptions).
function ruleFires(summaryId: string, entries: TimelineEntry[], minFieldValid: number): { fires: boolean; needLabel?: string } {
  switch (summaryId) {
    case "SUM_RAIN_RUN":
      return { fires: fieldValid(entries, "kokoro_tenki").length >= minFieldValid && countOf(entries, "kokoro_tenki", "ame") >= minFieldValid };
    case "SUM_LOWBATT_RUN":
      return { fires: fieldValid(entries, "karada_juden").length >= minFieldValid && countOf(entries, "karada_juden", "hobo_kara") >= minFieldValid };
    case "SUM_SWIRL_RUN":
      return { fires: fieldValid(entries, "atama_yohaku").length >= minFieldValid && countOf(entries, "atama_yohaku", "guruguru") >= minFieldValid };
    case "SUM_NEED_REPEAT": {
      const label = mostFrequentNeedLabel(entries, minFieldValid);
      return { fires: label !== null, needLabel: label ?? undefined };
    }
    case "SUM_SUNNY_RUN":
      return { fires: fieldValid(entries, "kokoro_tenki").length >= minFieldValid && countOf(entries, "kokoro_tenki", "hare") >= minFieldValid };
    case "SUM_MIXED_WEATHER": {
      const valid = fieldValid(entries, "kokoro_tenki");
      return { fires: valid.length >= minFieldValid && new Set(valid.map((e) => e.stateValues.kokoro_tenki)).size >= 4 };
    }
    default:
      return { fires: false };
  }
}

// 7-day summaries: evaluate in canonical priorityOrder, emit at most
// maxSimultaneousSummaries; a rule whose minFieldValid is not met does not fire.
export function sevenDaySummaries(entries: TimelineEntry[]): { summaries: SevenDaySummary[]; insufficientCopyJa: string | null } {
  const cfg = DAILY_CHECK_IN_DEFINITION.sevenDaySummary;
  if (entries.length < cfg.minimumRecordedDays) return { summaries: [], insufficientCopyJa: cfg.insufficientHistoryCopyJa };
  const byId = new Map(cfg.rules.map((r) => [r.summaryId, r]));
  const out: SevenDaySummary[] = [];
  for (const summaryId of cfg.priorityOrder) {
    if (out.length >= cfg.maxSimultaneousSummaries) break;
    const rule = byId.get(summaryId);
    if (!rule) continue;
    const { fires, needLabel } = ruleFires(summaryId, entries, rule.minFieldValid);
    if (fires) out.push({ summaryId, copyJa: needLabel ? rule.copyJa.replace("{need}", needLabel) : rule.copyJa });
  }
  return { summaries: out, insufficientCopyJa: null };
}

// 30-day view data: weather strip (only answered weather renders; blanks neutral)
// + most-frequent need over kyou_hoshii-answered days (min 3; ties joined by 「と」).
export function thirtyDayView(entries: TimelineEntry[]): {
  sufficient: boolean;
  insufficientCopyJa: string | null;
  mostFrequentNeedJa: string | null;
} {
  const cfg = DAILY_CHECK_IN_DEFINITION.thirtyDaySummary;
  if (entries.length < cfg.minimumRecordedDays) {
    return { sufficient: false, insufficientCopyJa: cfg.insufficientDataCopyJa, mostFrequentNeedJa: null };
  }
  return { sufficient: true, insufficientCopyJa: null, mostFrequentNeedJa: mostFrequentNeedLabel(entries, 3) };
}

export function optionLabelJa(fieldId: string, optionId: string | null): string | null {
  if (!optionId) return null;
  return LABELS.get(`${fieldId}:${optionId}`) ?? null;
}
