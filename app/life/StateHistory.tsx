import { listCurrentStateRecords } from "@/lib/server/lifeOs/store";
import type { CurrentStateRecord, Energy, Mood } from "@/lib/life-os/contract";
import { labelForIntent, labelForState, type IntentOptionId, type StateOptionId } from "@/lib/yorisou/today/currentStateCheckIn";

// OSF-1 — 前に残した状態.
//
// A list of moments, and deliberately nothing more than a list: no chart, no average, no trend, no
// count, no comparison between one day and the next. Each of those turns a record of how someone WAS
// into a measurement of how they are DOING, and the reading it invites — "I am getting worse" — is a
// claim this product does not get to make about anyone.
//
// EVERY ROW IS A TEMPORAL STATE. What one person said about one moment, in the words they picked. It
// is not a personality, not an assessment result, not a diagnosis, and it does not accumulate into an
// identity: six heavy days are six days. lib/life-os/boundaries.ts holds the same rule at the data
// layer, and this surface is where it would be broken first.
//
// The mood and energy vocabularies have no Japanese in the contract — that file holds the values, the
// surfaces name them — so the labels live here, with the component that renders them, and これまで
// reads them from here rather than keeping a second set that could drift.

const MOOD_LABELS: Record<Mood, string> = {
  calm: "落ち着いている",
  unsettled: "落ち着かない",
  heavy: "なんとなく重い",
  tired: "疲れている",
  bright: "明るい",
  unsure: "よくわからない",
};

const ENERGY_LABELS: Record<Energy, string> = {
  low: "少なめ",
  steady: "一定",
  high: "多め",
};

/** The chosen tags in the words the check-in used. A tag outside the vocabulary is dropped, never shown as its id. */
export function stateTagLine(record: CurrentStateRecord): string {
  return record.state_tags
    .map((tag) => labelForState(tag as StateOptionId) || labelForIntent(tag as IntentOptionId) || "")
    .filter(Boolean)
    .join(" / ");
}

/** Mood and energy when they were given — two things someone said, side by side, never combined into a value. */
export function stateDetailLine(record: CurrentStateRecord): string | null {
  const parts: string[] = [];
  if (record.mood) parts.push(`気分：${MOOD_LABELS[record.mood]}`);
  if (record.energy) parts.push(`気力：${ENERGY_LABELS[record.energy]}`);
  return parts.length > 0 ? parts.join("・") : null;
}

function day(at: string): string {
  // Date only, as これまで does. A timestamp to the minute would invite reading habits into the list.
  return new Date(at).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
}

/** A handful. これまで holds the rest; a long list here would start to look like something to read into. */
const RECENT_LIMIT = 6;

type Props = {
  accountId: string;
  /** The record already shown in full above. Repeating it would read as two separate moments. */
  excludeId?: string | null;
};

export default async function StateHistory({ accountId, excludeId }: Props) {
  const records = await listCurrentStateRecords(accountId, RECENT_LIMIT + 1).catch(() => []);
  const earlier = records.filter((record) => record.id !== excludeId).slice(0, RECENT_LIMIT);
  // Nothing to show means nothing rendered, as 前にいたところ does — an empty frame or an invented
  // encouragement would both be worse than silence.
  if (earlier.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-[12px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
        前に残した状態
      </h3>
      <ul className="mt-2 divide-y divide-[var(--pxr-border-subtle)] border-y border-[var(--pxr-border-subtle)]">
        {earlier.map((record) => {
          const tags = stateTagLine(record);
          const detail = stateDetailLine(record);
          return (
            <li key={record.id} className="py-3">
              <p className="text-[12px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
                {day(record.created_at)}
              </p>
              {tags && (
                <p className="mt-1 text-[16px] leading-[1.7] text-[var(--pxr-text-primary)]">{tags}</p>
              )}
              {detail && (
                <p className="mt-1 text-[14px] leading-[1.9] text-[var(--pxr-text-secondary)]">{detail}</p>
              )}
              {record.situation && (
                <p className="mt-1 whitespace-pre-wrap text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
                  {record.situation}
                </p>
              )}
              {record.reflection && (
                <p className="mt-1 whitespace-pre-wrap text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
                  {record.reflection}
                </p>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-[13px] leading-[1.9] text-[var(--pxr-text-muted)]">
        どれも、その時の記録です。
      </p>
    </div>
  );
}
