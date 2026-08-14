import Link from "next/link";

import { lifeReturnView } from "@/lib/server/lifeOs/timeline";

// PHASE F — 前にいたところ.
//
// WHAT THIS IS NOT, AND THE REASON EACH IS ABSENT.
//
//   no streak, no counter          counting visits turns returning into a score to protect
//   no "N日ぶりですね"              measuring absence makes the gap the subject instead of the person
//   no notification, no reminder    a return the product asked for is not a return
//   no daily target, no completion  a life is not a checklist
//
// What it does: when someone comes back, it shows them what they left — the last thing they wrote,
// an answer they started and did not finish, the direction they are holding, the most recent
// experience. Each is a link back to their own words. If there is nothing, it renders nothing rather
// than inventing an encouragement.

const MISSING_LABEL: Record<string, string> = {
  felt: "感じたこと",
  tried: "試したこと",
  what_followed: "そのあと起きたこと",
  next_time: "次に活かせそうなこと",
};

export default async function ReturnSection({ accountId }: { accountId: string }) {
  const view = await lifeReturnView(accountId).catch(() => null);
  if (!view) return null;
  const hasAnything =
    view.lastReflection || view.unfinished || view.activeDirection || view.recentExperience;
  if (!hasAnything) return null;

  return (
    <section className="mt-9 rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface-emphasis)] px-5 py-5">
      <h2 className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
        前にいたところ
      </h2>

      {view.lastReflection && (
        <p className="mt-3 line-clamp-2 text-[16px] leading-[1.7] text-[var(--pxr-text-primary)]">
          {view.lastReflection.what_happened}
        </p>
      )}

      {view.unfinished && (
        // Named as an offer, never as an outstanding task. 「書きかけ」 not 「未完了」.
        <p className="mt-2 text-[14px] leading-[1.9] text-[var(--pxr-text-secondary)]">
          書きかけのままのところがあります（{view.unfinished.missing.map((f) => MISSING_LABEL[f] ?? f).join("・")}）。
          そのままにしておいても構いません。
        </p>
      )}

      {view.activeDirection && (
        <p className="mt-3 text-[15px] leading-[1.8] text-[var(--pxr-text-secondary)]">
          いま向かっている方向：{view.activeDirection.title}
        </p>
      )}

      {view.recentExperience?.title && (
        <p className="mt-2 text-[15px] leading-[1.8] text-[var(--pxr-text-secondary)]">
          最近書いた経験：{view.recentExperience.title}
        </p>
      )}

      <Link
        href="/life/timeline"
        className="mt-4 inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] font-medium text-[var(--pxr-accent)]"
      >
        これまでを見る
      </Link>
    </section>
  );
}
