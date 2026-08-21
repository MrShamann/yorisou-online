import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { listGoals, listEligibleMemories, listReflections } from "@/lib/server/lifeOs/store";
import { latestCurrentStateRecord } from "@/lib/server/platform/stateCore";
import { GOAL_STATUS_LABELS, type Goal } from "@/lib/life-os/contract";
import SignInRequired from "./SignInRequired";
import { INTERNAL_HANDLING, NOT_VISIBLE_TO_OTHER_USERS } from "@/lib/life-os/privacyCopy";
import { lifeOsConsentSatisfied, resolveLifeOsRouteAccess } from "@/lib/server/lifeOs/routeAccess";
import LifeOsConsent from "./LifeOsConsent";
import ReturnSection from "./ReturnSection";
import StateHistory, { stateDetailLine, stateTagLine } from "./StateHistory";

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

// The state lines come from StateHistory so the record shown here and the same record shown in the
// list below it are worded identically — the tags carry the Today check-in's own labels, so one
// choice never appears under two different names.

function goalLine(goal: Goal): string {
  return `${goal.title}（${GOAL_STATUS_LABELS[goal.status]}）`;
}

export default async function LifePage() {
  // OSF-1 FEATURE GATE. Default CLOSED: production and unknown contexts 404 before any
  // session lookup or database read. Route-concealing, following pilotRouteAccess.
  // ONE authority for the gate AND the viewer: resolving them separately is how a page ends
  // up scoping data to a different identity than the one that passed the gate.
  const access = await resolveLifeOsRouteAccess();
  if (!access.allowed) notFound();
  const accountId = access.accountId;
  if (!accountId) {
    return (
      <main className="mx-auto w-full max-w-[var(--pxr-content-width)] px-5 pb-28 pt-10">
        <SignInRequired next="/life" purpose="いまの状態や、振り返りを残しておく。" />
      </main>
    );
  }

  // LCO-1 — the explanation comes before anything durable is kept. Reads of what a person ALREADY
  // has are not blocked by it (see the guard); what this prevents is arriving at a surface that
  // invites writing before the person has been told what writing means here.
  if (!(await lifeOsConsentSatisfied(accountId))) {
    return (
      <main className="mx-auto w-full max-w-[var(--pxr-content-width)] px-5 pb-28 pt-10">
        <LifeOsConsent />
      </main>
    );
  }

  // One failing read must not blank the whole surface — a person whose goals load but whose
  // reflections time out should still see their goals.
  const [currentState, goals, reflections, memories] = await Promise.all([
    latestCurrentStateRecord(accountId).catch(() => null),
    listGoals(accountId, 3).catch(() => []),
    listReflections(accountId, 3).catch(() => []),
    listEligibleMemories(accountId, 3).catch(() => []),
  ]);
  const stateTags = currentState ? stateTagLine(currentState) : "";
  const stateDetail = currentState ? stateDetailLine(currentState) : null;

  return (
    <main className="mx-auto flex w-full max-w-[var(--pxr-content-width)] flex-col px-5 pb-28 pt-10">
      <p className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">わたしの記録</p>
      {/* The exported constant, not a retyped version of it. This heading said 「ほかの利用者に表示され
          ません。」 while lib/life-os/privacyCopy.ts says 「ほかの利用者に表示されることはありません。」 and
          explains at length why that phrasing was chosen. Two sentences for one promise is one too
          many, and the one on the most-read screen was the copy. */}
      <h1 className="mt-3 text-[26px] font-semibold leading-[1.5] tracking-[-0.01em] text-[var(--pxr-text-primary)]">
        ここに残したものは、
        <br />
        {NOT_VISIBLE_TO_OTHER_USERS}
      </h1>

      {/* The separate sentence — separate on purpose, but DIRECTLY BELOW the first half now.
          It used to sit after the Return section, so a person read half a disclosure, then their own
          past reflections, then the other half. Separation was the intent; interruption was not. */}
      <p className="mt-3 text-[13px] leading-[1.9] text-[var(--pxr-text-muted)]">{INTERNAL_HANDLING}</p>

      {/* PHASE F — what they left, shown before anything asks them to do something new. */}
      <ReturnSection accountId={accountId} />

      <section className="mt-9">
        <h2 className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">いまの状態</h2>
        {currentState ? (
          <>
            {stateTags && (
              <p className="mt-2 text-[17px] leading-[1.7] text-[var(--pxr-text-primary)]">{stateTags}</p>
            )}
            {stateDetail && (
              <p className="mt-1 text-[14px] leading-[1.9] text-[var(--pxr-text-secondary)]">{stateDetail}</p>
            )}
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
        {/* The moments before this one — a record of what was said, never a shape to read a direction
            into. Renders nothing when the latest record is the only one. */}
        <StateHistory accountId={accountId} excludeId={currentState?.id ?? null} />
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
        {/* Two entry points, named by what they ask of you rather than by depth ranking — a
            postmortem is not a "better" reflection, it is a different one that needs distance. */}
        <Link
          href="/life/reflect"
          className="mt-3 flex min-h-[var(--pxr-touch-target)] items-center text-[15px] font-medium text-[var(--pxr-accent)]"
        >
          かるく振り返る（5つの問い）
        </Link>
        <Link
          href="/life/reflect?mode=postmortem"
          className="flex min-h-[var(--pxr-touch-target)] items-center text-[15px] font-medium text-[var(--pxr-accent)]"
        >
          じっくり振り返る（7つの問い）
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

      {/* The way into これまで that is always there. 前にいたところ carries one too, but it renders
          nothing until there is something to come back to — so without this, the person with the
          least to go on is the one who cannot reach it. */}
      <Link
        href="/life/timeline"
        className="mt-10 inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] font-medium text-[var(--pxr-accent)]"
      >
        これまでを見る
      </Link>
    </main>
  );
}
