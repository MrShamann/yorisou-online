import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { lifeOsAccess } from "@/lib/life-os/access";
import { lifeTimeline, type TimelineEntry } from "@/lib/server/lifeOs/timeline";
import { labelForIntent, labelForState, type IntentOptionId, type StateOptionId } from "@/lib/yorisou/today/currentStateCheckIn";
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

function line(entry: TimelineEntry): string {
  if (entry.kind === "current_state") {
    return entry.record.state_tags
      .map((tag) => labelForState(tag as StateOptionId) || labelForIntent(tag as IntentOptionId) || "")
      .filter(Boolean)
      .join(" / ");
  }
  if (entry.kind === "goal") return entry.record.title;
  if (entry.kind === "reflection") return entry.record.what_happened;
  if (entry.kind === "memory") return entry.record.content;
  return entry.record.title ?? entry.record.situation ?? "";
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
          {entries.map((entry) => (
            <li key={`${entry.kind}:${entry.id}`} className="py-4">
              <p className="text-[12px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
                {day(entry.at)} · {KIND_LABEL[entry.kind]}
              </p>
              <p className="mt-1 line-clamp-2 text-[16px] leading-[1.7] text-[var(--pxr-text-primary)]">
                {line(entry)}
              </p>
            </li>
          ))}
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
