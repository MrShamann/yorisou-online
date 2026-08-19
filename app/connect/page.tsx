import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { connectionOperational } from "@/lib/yorisou/connection/access";
import { listConnections } from "@/lib/server/platform/connectionCore/service";
import { connectionRepository } from "@/lib/server/connection/store";
import { IMAIRO_PAIR_TITLE } from "@/packs/yorisou/imairo/pair";

export const metadata: Metadata = {
  title: "つながる | Yorisou",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

// CPR-1 — Screen 20, the Connect hub. A calm, FINITE list of the pairs this person is actually in.
//
// What this deliberately is not: there is no feed, no stranger browsing, no user search, no
// suggestions, no follower count, no ranking and no infinite scroll. A person can only arrive at a
// pair by having invited someone or accepted an invitation, so this page has nothing to discover —
// which is the point. The list is bounded by the capability's own limit, not by pagination.
export default async function ConnectHubPage() {
  if (!connectionOperational()) notFound();
  const viewer = await getViewerContext();
  const accountId = viewer.account?.id || viewer.legacyAccount?.id;

  if (!accountId) {
    return (
      <main className="mx-auto w-full max-w-[var(--pxr-content-width)] px-5 pb-28 pt-10">
        <h1 className="text-[22px] font-semibold leading-[1.5] text-[var(--pxr-text-primary)]">つながる</h1>
        <p className="mt-4 text-[15px] leading-[1.9] text-[var(--pxr-text-secondary)]">
          ふたりで結果を見比べるには、ログインが必要です。
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--yorisou-color-primary-600)] px-6 text-[15px] font-semibold text-white no-underline"
        >
          ログイン
        </Link>
      </main>
    );
  }

  let pairs: readonly { pair_public_id: string; created_at: string }[] = [];
  let unavailable = false;
  try {
    pairs = await listConnections(accountId, connectionRepository);
  } catch {
    // Fail closed and SAY SO. Rendering an empty list on a store failure would tell the person
    // they have no pairs, which is a different and possibly false statement.
    unavailable = true;
  }

  return (
    <main className="mx-auto w-full max-w-[var(--pxr-content-width)] px-5 pb-28 pt-10">
      <h1 className="text-[22px] font-semibold leading-[1.5] text-[var(--pxr-text-primary)]">つながる</h1>
      <p className="mt-3 text-[14px] leading-[1.9] text-[var(--pxr-text-secondary)]">
        選んだ相手と、いま色テストの結果を並べて見るところです。相手を探す機能はありません。
      </p>

      {unavailable ? (
        <p className="mt-8 rounded-2xl border border-[var(--yorisou-color-neutral-100)] px-5 py-6 text-[14px] leading-[1.9] text-[var(--pxr-text-secondary)]">
          いま読み込めませんでした。時間をおいて開いてみてください。
        </p>
      ) : pairs.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-[var(--yorisou-color-neutral-100)] px-5 py-6">
          <p className="text-[15px] font-semibold text-[var(--pxr-text-primary)]">まだ、ふたりの結果はありません。</p>
          <p className="mt-3 text-[14px] leading-[1.9] text-[var(--pxr-text-secondary)]">
            はじめるには、自分のいま色テストの結果ページから「ふたりで見比べる」を選びます。
          </p>
          <Link
            href="/me"
            className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--yorisou-color-neutral-200)] px-6 text-[15px] font-semibold text-[var(--pxr-text-primary)] no-underline"
          >
            自分の結果を見る
          </Link>
        </div>
      ) : (
        <ul className="mt-8 flex list-none flex-col gap-3 p-0">
          {pairs.map((pair) => (
            <li key={pair.pair_public_id}>
              <Link
                href={`/connect/pair/${pair.pair_public_id}`}
                className="flex min-h-[64px] flex-col justify-center rounded-2xl border border-[var(--yorisou-color-neutral-100)] px-5 py-4 no-underline"
              >
                <span className="text-[15px] font-semibold text-[var(--pxr-text-primary)]">
                  {IMAIRO_PAIR_TITLE}
                </span>
                <span className="mt-1 text-[13px] text-[var(--pxr-text-muted)]">
                  {new Date(pair.created_at).toLocaleDateString("ja-JP")} から
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
