import Link from "next/link";

import { listSavedTestResultsForOwner } from "@/lib/server/testResults";
import { IMAIRO_SNAPSHOT_TEST_ID } from "@/lib/yorisou/public-result/snapshot";

// わたし — what is kept on the ACCOUNT, as opposed to on this device.
//
// WHY THIS EXISTS.
//
// わたし told every visitor 「保存したものは、この端末のあなたにだけ表示されます。」 and offered no way
// to sign in. For a signed-out visitor that is a dead end; for a signed-in person it is simply not
// true — saving an いま色 result POSTs it to their account, and it survives a new phone. The page
// was describing the device-local half of itself as though it were the whole product.
//
// So this section says which of the two a person is actually in, and nothing more than is true
// today. It deliberately does NOT promise reflections, records or continuity: those live behind the
// Life OS, which is not open to ordinary accounts, and advertising them here would be selling
// something a person cannot reach.
//
// IT READS THE ACCOUNT, NOT THE LIFE OS. The saved-result store is its own surface with its own
// gate; the composition of records is a separate, governed activation. Keeping them apart is what
// lets this section be honest without touching that decision.

const HEADING = "text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]";
const PANEL =
  "mt-3 rounded-[var(--pxr-radius-lg)] border border-[var(--pxr-border-subtle)] bg-[var(--pxr-surface)] px-5 py-5";
const BODY = "text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]";
const ACTION =
  "mt-3 inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] font-medium text-[var(--pxr-accent)]";

export default async function AccountContinuity({ accountId }: { accountId: string | null }) {
  // SIGNED OUT. An invitation, not a wall — and it names the one thing signing in actually does
  // today rather than a general promise about "your data".
  if (!accountId) {
    return (
      <section className="mt-10">
        <h2 className={HEADING}>アカウントに残す</h2>
        <div className={PANEL}>
          <p className={BODY}>
            いま色テストの結果は、ログインしていると、この端末だけでなくアカウントに残ります。
            機種を変えても、同じ結果を見返せます。
          </p>
          <Link href="/login" className={ACTION}>
            ログイン / アカウントを作る
          </Link>
        </div>
      </section>
    );
  }

  // One failing read must not blank the section — a person who is signed in should still be told
  // that they are, even if the store is briefly unreachable.
  const saved = await listSavedTestResultsForOwner(accountId).catch(() => null);
  const imairo = saved?.find((row) => row.test_id === IMAIRO_SNAPSHOT_TEST_ID) ?? null;

  return (
    <section className="mt-10">
      <h2 className={HEADING}>アカウントに残っているもの</h2>
      <div className={PANEL}>
        {saved === null ? (
          // Not "you have none" during an outage. Those are different sentences to a person.
          <p className={BODY}>いまは読み込めませんでした。時間をおいて開いてみてください。</p>
        ) : imairo ? (
          <>
            <p className={BODY}>
              いま色テストの結果が、アカウントに残っています。この端末を変えても見返せます。
            </p>
            <Link href="/saved" className={ACTION}>
              保存した結果を見る
            </Link>
          </>
        ) : (
          <>
            <p className={BODY}>
              いまアカウントに残っているものはありません。いま色テストの結果は、保存するとここに残ります。
            </p>
            <Link href="/tests/ima-iro" className={ACTION}>
              いま色テストを見る
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
