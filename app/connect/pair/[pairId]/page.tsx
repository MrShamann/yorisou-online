import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { connectionOperational } from "@/lib/yorisou/connection/access";
import { readConnection } from "@/lib/server/platform/connectionCore/service";
import { readComparison, renderComparisonFor } from "@/lib/server/platform/comparisonCore/service";
import { connectionRepository, comparisonRepository } from "@/lib/server/connection/store";
import { COMPARISON_OUTPUT_FAMILIES } from "@/lib/platform/comparisonCore";
import {
  imairoPairAdapter,
  IMAIRO_PAIR_FAMILY_LABELS,
  IMAIRO_PAIR_SAFETY_FRAMING,
  IMAIRO_PAIR_TITLE,
} from "@/packs/yorisou/imairo/pair";
import DissolvePairButton from "@/app/connect/_components/DissolvePairButton";

export const metadata: Metadata = {
  title: "ふたりのImairo | Yorisou",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ pairId: string }> };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

// CPR-1 — the private pair view. PARTICIPANTS ONLY.
//
// Participation is established first, against the database, and only then is the comparison read.
// Every failure conceals identically as a 404 — gate closed, malformed id, unknown pair, dissolved
// pair, invalidated comparison, and "you are not in this pair" are one answer, so the URL cannot
// be used to discover that a particular pair exists or that a particular person is in one.
//
// The rendered copy is built FOR THIS READER, with their own side first, which is why the stored
// record holds the two public result codes rather than one pre-rendered view: a single stored view
// would address the second participant as if they were the first.
export default async function ConnectPairPage(context: Context) {
  if (!connectionOperational()) notFound();
  const { pairId } = await context.params;
  if (!UUID_RE.test(pairId)) notFound();

  const viewer = await getViewerContext();
  const accountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!accountId) notFound();

  let connection;
  let record;
  try {
    // BOTH reads are participant-scoped independently. The connection read is what this page needs
    // for its own rendering; the comparison read no longer depends on it having happened first.
    connection = await readConnection(accountId, pairId, connectionRepository);
    record = await readComparison(accountId, pairId, comparisonRepository);
  } catch {
    connection = null;
    record = null;
  }
  if (!connection || !record) notFound();

  let view;
  try {
    view = renderComparisonFor(accountId, record, imairoPairAdapter);
  } catch {
    // A stored pair whose adapter can no longer render it shows nothing rather than a partial
    // reading — the same fail-closed rule the public share page uses.
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-[var(--pxr-content-width)] px-5 pb-28 pt-10">
      <h1 className="text-[22px] font-semibold leading-[1.5] text-[var(--pxr-text-primary)]">
        {IMAIRO_PAIR_TITLE}
      </h1>
      <p className="mt-3 text-[14px] leading-[1.9] text-[var(--pxr-text-secondary)]">
        {IMAIRO_PAIR_SAFETY_FRAMING}
      </p>

      <div className="mt-8 flex flex-col gap-6">
        {COMPARISON_OUTPUT_FAMILIES.map((family) => {
          const value = view[family];
          const lines = typeof value === "string" ? [value] : value;
          return (
            <section
              key={family}
              aria-labelledby={`pair-${family}`}
              className="rounded-2xl border border-[var(--yorisou-color-neutral-100)] px-5 py-5"
            >
              <h2
                id={`pair-${family}`}
                className="text-[15px] font-semibold text-[var(--pxr-text-primary)]"
              >
                {IMAIRO_PAIR_FAMILY_LABELS[family]}
              </h2>
              <ul className="mt-3 flex list-none flex-col gap-2 p-0">
                {lines.map((line) => (
                  <li key={line} className="text-[14px] leading-[1.9] text-[var(--pxr-text-secondary)]">
                    {line}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <div className="mt-10 border-t border-[var(--yorisou-color-neutral-100)] pt-6">
        <p className="text-[13px] leading-[1.85] text-[var(--pxr-text-muted)]">
          やめると、このページはどちらからも見られなくなります。相手の結果があなたに残ることはありません。
        </p>
        <DissolvePairButton pairPublicId={pairId} />
      </div>
    </main>
  );
}
