import Link from "next/link";

import { resolveDiscoveryRouteAccess } from "@/lib/cpv1/pilotRouteAccess";
import { discoverySchemaReady } from "@/lib/yorisou/discovery/access";
import { readTodaysDiscovery } from "@/lib/server/platform/discoveryCore/service";
import { discoveryRepository } from "@/lib/server/discovery/store";
import { DAILY_SYMBOLS_COPY, DAILY_SYMBOLS_DEFINITION } from "@/packs/yorisou/daily-symbols/pack";

// DD-1 — Today's curiosity half: one calm row for 今日のひとつ, AFTER the utility hero and real
// continuity, BEFORE the 5-minute actions. Today stays utility-first; this section adds curiosity,
// it never competes with 「今の気配を見る」.
//
// FAIL CLOSED, RENDER NOTHING: gate closed, signed out, schema not declared ready, or the store
// unreachable — every one of those renders null rather than a dead CTA that ends in an error. An
// anonymous or non-pilot production visitor cannot learn this feature exists from this component.
export default async function TodayDiscoveryEntry() {
  // Schema readiness first: without it the flow cannot operate safely, so the entry does not exist.
  if (!discoverySchemaReady()) return null;

  const gate = await resolveDiscoveryRouteAccess();
  if (!gate.allowed || !gate.viewer) return null;
  const accountId = gate.viewer.account?.id || gate.viewer.legacyAccount?.id;
  if (!accountId) return null;

  // Completed-today changes only the CTA label; a read failure degrades to the entry CTA rather
  // than hiding the section (the route itself refuses safely if persistence is truly down).
  const today = await readTodaysDiscovery({
    ownerAccountId: accountId,
    definition: DAILY_SYMBOLS_DEFINITION,
    repository: discoveryRepository,
  }).catch(() => null);
  const completed = Boolean(today?.session);

  return (
    <section className="mt-10">
      <h2 className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">
        {DAILY_SYMBOLS_COPY.eyebrow}
      </h2>
      <p className="mt-2 text-[17px] font-medium leading-[1.7] text-[var(--pxr-text-primary)]">
        {DAILY_SYMBOLS_COPY.title}
      </p>
      <p className="mt-1 text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
        {DAILY_SYMBOLS_COPY.todayEntryDescription}
      </p>
      <p className="mt-1 text-[13px] text-[var(--pxr-text-muted)]">{DAILY_SYMBOLS_COPY.duration}</p>
      <Link
        href="/today/discovery"
        className="mt-3 inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] font-medium text-[var(--pxr-accent)]"
      >
        {completed ? DAILY_SYMBOLS_COPY.completedCta : DAILY_SYMBOLS_COPY.primaryCta}
      </Link>
    </section>
  );
}
