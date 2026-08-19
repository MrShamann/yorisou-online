import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { sharingOperational } from "@/lib/yorisou/sharing/access";
import { readPublicShare } from "@/lib/server/platform/sharingCore/service";
import { sharingRepository } from "@/lib/server/sharing/store";
import {
  IMAIRO_SHARE_CARD_FAMILY,
  IMAIRO_SHARE_PAYLOAD_VERSION,
  validateImairoSharePayload,
  type ImairoSharePayload,
} from "@/packs/yorisou/imairo/share";
import { PUBLIC_RESULT_CTA_LABEL } from "@/app/tests/ima-iro/resultCompatibility";

export const metadata: Metadata = {
  title: "いま色テスト | Yorisou",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ publicId: string }>; searchParams?: Promise<Record<string, string | string[] | undefined>> };

const PUBLIC_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

// SHR-1 — the canonical public deep link. The URL carries ONE thing: the high-entropy public id
// (plus the presentation-only `story` flag). Rendering reads ONLY the stored public-safe payload
// through the sharing repository — no assessment, no owner, no source, no scoring is ever loaded
// here, and that is a tested architectural invariant, not a style choice.
//
// EVERY failure conceals identically: gate closed, schema not ready, malformed id, unknown id,
// revoked object, wrong family, invalid stored payload — all are the same 404. The route never
// explains which one happened.
export default async function PublicSharePage(context: Context) {
  if (!sharingOperational()) notFound();
  const { publicId } = await context.params;
  if (!PUBLIC_ID_RE.test(publicId)) notFound();

  let view;
  try {
    view = await readPublicShare<ImairoSharePayload>({
      publicId,
      expectedFamily: IMAIRO_SHARE_CARD_FAMILY,
      expectedPayloadVersion: IMAIRO_SHARE_PAYLOAD_VERSION,
      validate: validateImairoSharePayload,
      repository: sharingRepository,
    });
  } catch {
    view = null;
  }
  if (!view) notFound();
  const payload = view.payload;

  return (
    <main className="mx-auto w-full max-w-[var(--pxr-content-width)] px-5 pb-28 pt-10">
      <p className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
        {payload.test_name}
      </p>
      <h1 className="mt-3 text-[24px] font-semibold leading-[1.5] text-[var(--pxr-text-primary)]">
        {payload.display_line}
      </h1>
      <p className="mt-1 text-[15px] text-[var(--pxr-text-secondary)]">{payload.code_line}</p>

      {payload.hero_chips.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {payload.hero_chips.map((chip) => (
            <li
              key={chip}
              className="rounded-[var(--pxr-radius-pill)] border border-[var(--pxr-border-subtle)] px-3 py-1 text-[12px] text-[var(--pxr-text-secondary)]"
            >
              {chip}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 text-[16px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-primary)]">
        {payload.recognition_line}
      </p>

      {payload.highlights.length > 0 && (
        <ul className="mt-5 space-y-3">
          {payload.highlights.map((highlight) => (
            <li key={highlight.label}>
              <p className="text-[13px] font-medium text-[var(--pxr-text-muted)]">{highlight.label}</p>
              <p className="mt-0.5 text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
                {highlight.text}
              </p>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">{payload.global_note}</p>

      <Link
        href="/tests/ima-iro"
        className="mt-8 inline-flex min-h-[var(--pxr-touch-target)] items-center justify-center rounded-[var(--pxr-radius-pill)] bg-[var(--pxr-accent)] px-8 py-3 text-[15px] font-semibold text-white"
      >
        {PUBLIC_RESULT_CTA_LABEL}
      </Link>
    </main>
  );
}
