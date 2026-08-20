import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { connectionOperational } from "@/lib/yorisou/connection/access";
import { readPublicInvitation } from "@/lib/server/platform/connectionCore/service";
import { connectionRepository } from "@/lib/server/connection/store";
import { listOwnedPairSources } from "@/lib/server/connection/imairoPairSource";
import { IMAIRO_PAIR_TITLE, IMAIRO_PAIR_SAFETY_FRAMING } from "@/packs/yorisou/imairo/pair";
import AcceptInviteForm from "@/app/connect/_components/AcceptInviteForm";

export const metadata: Metadata = {
  title: "ふたりのImairo | Yorisou",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ publicId: string }> };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

// CPR-1 — the invitation page. THE PRIVACY BOUNDARY BEFORE CONSENT.
//
// Everything this page can possibly render comes from `PublicInvitationView`, which carries the
// invite id, the family and the expiry — and nothing else. It does not know who sent the
// invitation, which result it came from, or what that result says, so it cannot leak any of it.
// A person deciding whether to accept learns only that someone invited them; the inviter's result
// becomes visible to them only after they have contributed their own.
//
// Every failure conceals identically as a 404: gate closed, malformed id, unknown id, cancelled,
// expired, already accepted.
export default async function ConnectInvitePage(context: Context) {
  if (!connectionOperational()) notFound();
  const { publicId } = await context.params;
  if (!UUID_RE.test(publicId)) notFound();

  let invitation;
  try {
    invitation = await readPublicInvitation(publicId, connectionRepository);
  } catch {
    invitation = null;
  }
  if (!invitation) notFound();

  const viewer = await getViewerContext();
  const accountId = viewer.account?.id || viewer.legacyAccount?.id;

  return (
    <main className="mx-auto w-full max-w-[var(--pxr-content-width)] px-5 pb-28 pt-10">
      <p className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">招待</p>
      <h1 className="mt-3 text-[22px] font-semibold leading-[1.5] text-[var(--pxr-text-primary)]">
        {IMAIRO_PAIR_TITLE}を見てみませんか
      </h1>
      <p className="mt-4 text-[15px] leading-[1.9] text-[var(--pxr-text-secondary)]">
        ある人が、いま色テストの結果をあなたと並べて見たいと考えています。
      </p>
      <p className="mt-3 text-[14px] leading-[1.9] text-[var(--pxr-text-secondary)]">
        {IMAIRO_PAIR_SAFETY_FRAMING}
      </p>

      <section
        aria-labelledby="connect-consent-heading"
        className="mt-8 rounded-2xl border border-[var(--yorisou-color-neutral-100)] px-5 py-6"
      >
        <h2
          id="connect-consent-heading"
          className="text-[15px] font-semibold text-[var(--pxr-text-primary)]"
        >
          受け取ると、どうなりますか
        </h2>
        <ul className="mt-4 flex list-none flex-col gap-2.5 p-0 text-[14px] leading-[1.85] text-[var(--pxr-text-secondary)]">
          <li>あなたの回答そのものは、相手に共有されません。</li>
          <li>あなたのレポートや記録、ふりかえりは共有されません。</li>
          <li>あなたが選んだいま色テストの結果が、ふたりのページをつくるために使われます。</li>
          <li>相手も、そのふたりのページを見ることができます。</li>
          <li>どちらからでも、あとでやめることができます。</li>
        </ul>
      </section>

      {!accountId ? (
        <div className="mt-8">
          <p className="text-[14px] leading-[1.9] text-[var(--pxr-text-secondary)]">
            受け取るには、ログインが必要です。
          </p>
          <Link
            href="/login"
            className="mt-4 inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--yorisou-color-primary-600)] px-6 text-[15px] font-semibold text-white no-underline"
          >
            ログイン
          </Link>
        </div>
      ) : (
        <InviteAction publicInviteId={publicId} accountId={accountId} />
      )}
    </main>
  );
}

/**
 * The invitee needs one of their OWN results to accept with. When they have none, the calm path is
 * the canonical test route — not a second assessment route, and not a dead end.
 *
 * NOTHING PRIVATE TRAVELS THROUGH THAT DETOUR. The only context carried is the opaque invitation
 * id, which the person already holds; there is no result id, no source ref and no account id in
 * the URL. If they finish the test and come back to this same link, the invitation is still here.
 */
async function InviteAction({ publicInviteId, accountId }: { publicInviteId: string; accountId: string }) {
  let sources;
  try {
    sources = await listOwnedPairSources(accountId);
  } catch {
    return (
      <p className="mt-8 text-[14px] leading-[1.9] text-[var(--pxr-text-secondary)]">
        いま読み込めませんでした。時間をおいて開いてみてください。
      </p>
    );
  }

  if (sources.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-[var(--yorisou-color-neutral-100)] px-5 py-6">
        <p className="text-[15px] font-semibold text-[var(--pxr-text-primary)]">
          まず、あなたのいま色を出してみましょう。
        </p>
        <p className="mt-3 text-[14px] leading-[1.9] text-[var(--pxr-text-secondary)]">
          結果が出たあとで、この招待のページに戻ってくると受け取れます。
        </p>
        <Link
          href="/tests/ima-iro"
          className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--yorisou-color-primary-600)] px-6 text-[15px] font-semibold text-white no-underline"
        >
          いま色テストをする
        </Link>
      </div>
    );
  }

  return <AcceptInviteForm publicInviteId={publicInviteId} sources={sources} />;
}
