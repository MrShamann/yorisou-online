import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { latestCurrentStateRecord, listGoals, listMemories, listReflections } from "@/lib/server/lifeOs/store";
import { GOAL_STATUS_LABELS, type CurrentStateRecord, type Goal } from "@/lib/life-os/contract";
import { labelForIntent, labelForState, type IntentOptionId, type StateOptionId } from "@/lib/yorisou/today/currentStateCheckIn";
import SignInRequired from "./SignInRequired";
import { INTERNAL_HANDLING } from "@/lib/life-os/privacyCopy";
import { lifeOsAccess } from "@/lib/life-os/access";

export const metadata: Metadata = {
  title: "わたしの記録 | Yorisou",
  description: "いまの状態、向かいたい方向、振り返り、覚えておきたいこと。",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

// OSF-1 — わたしの記録.
//
// The Life OS hub. Deliberately a set of quiet rows and one recent line each, not a dashboard:
// no counts, no streaks, no charts, no "you have completed 4 of 7". The UX principles ask for a
// calm surface with no dashboard feeling, and the fastest way to break that is to start counting
// things at someone.
//
// `robots: index false` — this is a person's private record surface, not a page for search results.
//
// Everything here renders only what actually exists. A section with nothing in it says so in one
// line and offers the action, rather than displaying an empty frame.

function stateSummary(record: CurrentStateRecord): string {
  // The tags are the Today check-in's own option ids; render them with the labels that flow already
  // uses so the same choice never appears under two different names.
  return record.state_tags
    .map((tag) => labelForState(tag as StateOptionId) || labelForIntent(tag as IntentOptionId) || tag)
    .filter(Boolean)
    .join(" / ");
}

function goalLine(goal: Goal): string {
  return `${goal.title}（${GOAL_STATUS_LABELS[goal.status]}）`;
}

export default async function LifePage() {
  // OSF-1 FEATURE GATE. Default CLOSED: production and unknown contexts 404 before any
  // session lookup or database read. Route-concealing, following pilotRouteAccess.
  if (!lifeOsAccess().allowed) notFound();
  const viewer = await getViewerContext();
  const accountId = viewer.account?.id || viewer.legacyAccount?.id || null;
  if (!accountId) {
    return (
      <main className="mx-auto w-full max-w-[var(--pxr-content-width)] px-5 pb-28 pt-10">
        <SignInRequired next="/life" purpose="いまの状態や、振り返りを残しておく。" />
      </main>
    );
  }

  // One failing read must not blank the whole surface — a person whose goals load but whose
  // reflections time out should still see their goals.
  const [currentState, goals, reflections, memories] = await Promise.all([
    latestCurrentStateRecord(accountId).catch(() => null),
    listGoals(accountId, 3).catch(() => []),
    listReflections(accountId, 3).catch(() => []),
    listMemories(accountId, 3).catch(() => []),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-[var(--pxr-content-width)] flex-col px-5 pb-28 pt-10">
      <p className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">わたしの記録</p>
      <h1 className="mt-3 text-[26px] font-semibold leading-[1.5] tracking-[-0.01em] text-[var(--pxr-text-primary)]">
        ここに残したものは、
        <br />
        ほかの利用者に表示されません。
      </h1>
      {/* The separate sentence, not a qualifier tucked into the heading. */}
      <p className="mt-3 text-[13px] leading-[1.9] text-[var(--pxr-text-muted)]">{INTERNAL_HANDLING}</p>

      <section className="mt-9">
        <h2 className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">いまの状態</h2>
        {currentState ? (
          <>
            <p className="mt-2 text-[17px] leading-[1.7] text-[var(--pxr-text-primary)]">
              {stateSummary(currentState)}
            </p>
            {currentState.reflection && (
              <p className="mt-2 whitespace-pre-wrap text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
                {currentState.reflection}
              </p>
            )}
          </>
        ) : (
          <p className="mt-2 text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
            まだ記録はありません。
          </p>
        )}
        <Link
          href="/today/check-in"
          className="mt-3 inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] font-medium text-[var(--pxr-accent)]"
        >
          今の気配を見る
        </Link>
      </section>

      <section className="mt-10">
        <h2 className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
          向かいたい方向
        </h2>
        {goals.length > 0 ? (
          <ul className="mt-2 divide-y divide-[var(--pxr-border-subtle)] border-y border-[var(--pxr-border-subtle)]">
            {goals.map((goal) => (
              <li key={goal.id} className="py-3 text-[16px] leading-[1.7] text-[var(--pxr-text-primary)]">
                {goalLine(goal)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
            まだありません。
          </p>
        )}
        <Link
          href="/life/goals"
          className="mt-3 inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] font-medium text-[var(--pxr-accent)]"
        >
          方向を書く
        </Link>
      </section>

      <section className="mt-10">
        <h2 className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">振り返り</h2>
        {reflections.length > 0 ? (
          <ul className="mt-2 divide-y divide-[var(--pxr-border-subtle)] border-y border-[var(--pxr-border-subtle)]">
            {reflections.map((reflection) => (
              <li key={reflection.id} className="py-3">
                <p className="line-clamp-2 text-[16px] leading-[1.7] text-[var(--pxr-text-primary)]">
                  {reflection.what_happened}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
            まだありません。
          </p>
        )}
        <Link
          href="/life/reflect"
          className="mt-3 inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] font-medium text-[var(--pxr-accent)]"
        >
          振り返りを書く
        </Link>
      </section>

      <section className="mt-10">
        <h2 className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">経験</h2>
        <p className="mt-2 text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
          やってみたことと、その結果を残しておけます。
        </p>
        <Link
          href="/life/experience"
          className="mt-3 inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] font-medium text-[var(--pxr-accent)]"
        >
          経験を書く
        </Link>
      </section>

      <section className="mt-10">
        <h2 className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
          覚えておきたいこと
        </h2>
        {memories.length > 0 ? (
          <ul className="mt-2 divide-y divide-[var(--pxr-border-subtle)] border-y border-[var(--pxr-border-subtle)]">
            {memories.map((memory) => (
              <li key={memory.id} className="py-3">
                <p className="line-clamp-2 text-[16px] leading-[1.7] text-[var(--pxr-text-primary)]">
                  {memory.content}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
            まだありません。あなたが確認したものだけが残ります。
          </p>
        )}
        <Link
          href="/life/memories"
          className="mt-3 inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] font-medium text-[var(--pxr-accent)]"
        >
          覚えていることを見る
        </Link>
      </section>
    </main>
  );
}
