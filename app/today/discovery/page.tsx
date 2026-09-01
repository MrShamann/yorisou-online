import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { resolveDiscoveryRouteAccess } from "@/lib/cpv1/pilotRouteAccess";
import { discoverySchemaReady } from "@/lib/yorisou/discovery/access";
import { readTodaysDiscovery } from "@/lib/server/platform/discoveryCore/service";
import { discoveryRepository } from "@/lib/server/discovery/store";
import {
  DAILY_SYMBOLS_COPY,
  DAILY_SYMBOLS_DEFINITION,
  dailySymbolById,
} from "@/packs/yorisou/daily-symbols/pack";
import SignInRequired from "@/app/life/SignInRequired";
import RevealButton from "./RevealButton";
import ShareButton from "./ShareButton";
import { CONSUMER_HOME } from "@/lib/consumerHome";

export const metadata: Metadata = {
  title: "今日のしるし | Yorisou",
  description: "今日は、ひとつだけ。答えを当てるものではなく、今の自分を見る小さなきっかけです。",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

// DD-1 — canonical Screen 19 (Daily Discovery / 今日のひとつ), ONE route for the whole finite flow:
//
//   ENTRY (not yet drawn today) → explicit reveal → RESULT → close / share-lite
//
// No start/result/history route split, no feed, no next symbol, no reroll — revisiting after
// completion renders the SAME result, because the day's canonical row is the only truth this page
// reads. The result is symbolic reflection material (SYMBOLIC_INTERPRETATION), presented with its
// safety note; nothing here collects an answer, writes memory, or reads any other personal store.
export default async function DiscoveryPage() {
  const gate = await resolveDiscoveryRouteAccess();
  if (!gate.allowed) notFound();
  // Route open but migration not declared applied: the surface does not exist yet. Fail closed
  // BEFORE inviting an action that would end in a database error.
  if (!discoverySchemaReady()) notFound();

  const accountId = gate.viewer?.account?.id || gate.viewer?.legacyAccount?.id;
  if (!accountId) {
    return (
      <main className="mx-auto w-full max-w-[var(--pxr-content-width)] px-5 pb-28 pt-10">
        <SignInRequired next="/today/discovery" purpose="今日のひとつを、その日のうちに見られるように。" />
      </main>
    );
  }

  const today = await readTodaysDiscovery({
    ownerAccountId: accountId,
    definition: DAILY_SYMBOLS_DEFINITION,
    repository: discoveryRepository,
  }).catch(() => null);
  if (!today) notFound();

  const symbol = today.session ? dailySymbolById(today.session.result_id) : null;

  return (
    <main className="mx-auto w-full max-w-[var(--pxr-content-width)] px-5 pb-28 pt-10">
      <p className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
        {DAILY_SYMBOLS_COPY.eyebrow}
      </p>
      <h1 className="mt-2 text-[24px] font-semibold leading-[1.5] text-[var(--pxr-text-primary)]">
        {DAILY_SYMBOLS_COPY.title}
      </h1>

      {!symbol ? (
        <>
          <p className="mt-4 text-[16px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
            {DAILY_SYMBOLS_COPY.description}
          </p>
          <p className="mt-2 text-[13px] text-[var(--pxr-text-muted)]">{DAILY_SYMBOLS_COPY.duration}</p>
          <RevealButton label={DAILY_SYMBOLS_COPY.primaryCta} />
          <p className="mt-6 text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
            {DAILY_SYMBOLS_COPY.safetyNote}
          </p>
        </>
      ) : (
        <>
          {/* The mark is typographic and decorative; the name carries the result for readers. */}
          <p aria-hidden="true" className="mt-8 text-[56px] leading-none text-[var(--pxr-accent)]">
            {symbol.mark}
          </p>
          <h2 className="mt-3 text-[20px] font-semibold leading-[1.5] text-[var(--pxr-text-primary)]">
            {symbol.name}
          </h2>
          <p className="mt-4 text-[16px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-primary)]">
            {symbol.recognition}
          </p>
          {/* A prompt to carry, not a field to fill: no text box, no persistence, no candidate. */}
          <p className="mt-4 text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
            {symbol.prompt}
          </p>
          <p className="mt-6 text-[13px] leading-[1.8] text-[var(--pxr-text-muted)]">
            {DAILY_SYMBOLS_COPY.safetyNote}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={CONSUMER_HOME}
              className="inline-flex min-h-[var(--pxr-touch-target)] items-center justify-center rounded-[var(--pxr-radius-pill)] bg-[var(--pxr-accent)] px-8 py-3 text-[15px] font-semibold text-white"
            >
              {DAILY_SYMBOLS_COPY.closeCta}
            </Link>
            <ShareButton symbolName={symbol.name} recognition={symbol.recognition} label={DAILY_SYMBOLS_COPY.shareCta} />
          </div>
        </>
      )}
    </main>
  );
}
