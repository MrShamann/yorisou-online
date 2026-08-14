import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { lifeOsAccess } from "@/lib/life-os/access";
import { lifeTimeline, type TimelineEntry } from "@/lib/server/lifeOs/timeline";
import { REFLECTION_MODE_LABELS } from "@/lib/life-os/contract";
import { stateDetailLine, stateTagLine } from "../StateHistory";
import SignInRequired from "../SignInRequired";

export const metadata: Metadata = {
  title: "これまで | Yorisou",
  description: "書いたものを、順番に。",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

// PHASE E — これまで.
//
// A chronological view, not a Life Graph: it orders records the person already made and asserts no
// relationship between them. There is no count, no chart, no "you have written N times" — the point
// is to recognise a thread, not to be measured.

const KIND_LABEL: Record<TimelineEntry["kind"], string> = {
  current_state: "いまの状態",
  goal: "向かいたい方向",
  reflection: "振り返り",
  memory: "覚えていること",
  experience: "経験",
};

/**
 * What kind of record this is — and for a reflection, which of the two flows wrote it.
 *
 * The mode is stored on the row since 202608160001, so the list can stop calling both the same
 * thing. It says which questions were asked, not which entry is worth more: a postmortem is a
 * different act from a light reflection, never a better one.
 *
 * A mode this build has no label for falls back to the plain kind rather than throwing — a migration
 * can reach the database before the code that knows what it added reaches the browser.
 */
function kindLabel(entry: TimelineEntry): string {
  if (entry.kind === "reflection") {
    return REFLECTION_MODE_LABELS[entry.record.mode]?.title ?? KIND_LABEL.reflection;
  }
  return KIND_LABEL[entry.kind];
}

function line(entry: TimelineEntry): string {
  if (entry.kind === "current_state") return stateTagLine(entry.record);
  if (entry.kind === "goal") return entry.record.title;
  if (entry.kind === "reflection") return entry.record.what_happened;
  if (entry.kind === "memory") return entry.record.content;
  return entry.record.title ?? entry.record.situation ?? "";
}

/**
 * The rest of what a state record holds: mood and energy, then anything written alongside them.
 *
 * The tags alone were all this list showed, which left a moment someone had described in their own
 * words looking identical to a two-tap check-in. Same detail わたしの記録 shows, same wording.
 */
function stateLines(entry: TimelineEntry): string[] {
  if (entry.kind !== "current_state") return [];
  return [stateDetailLine(entry.record), entry.record.situation, entry.record.reflection].filter(
    (part): part is string => Boolean(part && part.trim()),
  );
}

function day(at: string): string {
  // Date only. A timestamp to the minute would invite reading habits into the list.
  return new Date(at).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
}

export default async function LifeTimelinePage() {
  if (!lifeOsAccess().allowed) notFound();
  const viewer = await getViewerContext();
  const accountId = viewer.account?.id || viewer.legacyAccount?.id || null;
  if (!accountId) {
    return (
      <main className="mx-auto w-full max-w-[var(--pxr-content-width)] px-5 pb-28 pt-10">
        <SignInRequired next="/life/timeline" purpose="書いたものを、順番に見る。" />
      </main>
    );
  }
  const entries = await lifeTimeline(accountId).catch(() => []);

  return (
    <main className="mx-auto w-full max-w-[var(--pxr-content-width)] px-5 pb-28 pt-10">
      <p className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">わたしの記録</p>
      <h1 className="mt-3 text-[24px] font-semibold leading-[1.55] tracking-[-0.01em] text-[var(--pxr-text-primary)]">
        これまで。
      </h1>

      {entries.length === 0 ? (
        <p className="mt-6 text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
          まだ何もありません。
        </p>
      ) : (
        <ol className="mt-7 divide-y divide-[var(--pxr-border-subtle)] border-y border-[var(--pxr-border-subtle)]">
          {entries.map((entry) => {
            const headline = line(entry);
            return (
              <li key={`${entry.kind}:${entry.id}`} className="py-4">
                <p className="text-[12px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
                  {day(entry.at)} · {kindLabel(entry)}
                </p>
                {headline && (
                  <p className="mt-1 line-clamp-2 text-[16px] leading-[1.7] text-[var(--pxr-text-primary)]">
                    {headline}
                  </p>
                )}
                {stateLines(entry).map((text, index) => (
                  <p
                    key={index}
                    className="mt-1 line-clamp-2 text-[14px] leading-[1.9] text-[var(--pxr-text-secondary)]"
                  >
                    {text}
                  </p>
                ))}
              </li>
            );
          })}
        </ol>
      )}

      <Link
        href="/life"
        className="mt-9 inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] font-medium text-[var(--pxr-accent)]"
      >
        わたしの記録へ
      </Link>
    </main>
  );
}
