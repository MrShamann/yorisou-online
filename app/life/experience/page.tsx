import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ACTIVE_VISIBILITIES, listOwnerCards } from "@/lib/server/experienceCards";
import ExperienceForm, { type ExperienceSummary } from "./ExperienceForm";
import SignInRequired from "../SignInRequired";
import { resolveLifeOsRouteAccess } from "@/lib/server/lifeOs/routeAccess";

export const metadata: Metadata = {
  title: "経験を書く | Yorisou",
  description: "やってみたことと、その結果を書きとめておきます。",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

/** OSF-1 made state_context, limitations, may_fit and may_not_fit nullable, so these arrive null. */
const text = (value: unknown) => (typeof value === "string" && value.length > 0 ? value : null);

// THE COLUMN'S VOCABULARY IS WIDER THAN THE CONTROL'S. yorisou_experience_cards also permits
// PSEUDONYMOUS_SHARED and PUBLIC_SAFE — deferred ranges that ACTIVE_VISIBILITIES refuses and that
// deferred_visibility_inactive holds unpublished — so the row is not guaranteed to carry one of the
// four the sharing control knows. Asserting it anyway put a value into a <select> with no matching
// option, which browsers render as the first one, 非公開: a range nobody chose, shown as fact. null
// says what is true instead, and the control declines to speak for it.
const activeVisibility = (value: unknown): ExperienceSummary["visibility"] =>
  (ACTIVE_VISIBILITIES as readonly string[]).includes(String(value))
    ? (value as ExperienceSummary["visibility"])
    : null;

export default async function ExperiencePage() {
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
        <SignInRequired next="/life/experience" purpose="やってみたことを、書きとめておく。" />
      </main>
    );
  }
  // An unreachable store means an empty list and a working form, not a 500 — the person can still
  // write, and the failure surfaces where it is actionable (the save response).
  //
  // Narrowed here rather than handed over whole: the sharing control needs exactly these eleven
  // fields, and owner_account_id, moderation_status and the consent timestamps are not among them.
  //
  // withdrawn_at arrives as a flag because that is all the control needs to know: a withdrawn card is
  // out of every reader query (discoverExperiences, invitedCard, sharedCard all require
  // withdrawn_at is.null) while its visibility column still reads whatever it read before 取り下げ.
  // Passing the column alone would have the screen name a range the card no longer reaches.
  const experiences: ExperienceSummary[] = (await listOwnerCards(accountId).catch(() => [])).map((card) => ({
    id: String(card.id),
    title: text(card.title),
    visibility: activeVisibility(card.visibility),
    withdrawn: text(card.withdrawn_at) !== null,
    stateContext: text(card.state_context),
    situation: String(card.situation ?? ""),
    actionTried: String(card.action_tried ?? ""),
    perceivedOutcome: String(card.perceived_outcome ?? ""),
    limitations: text(card.limitations),
    mayFit: text(card.may_fit),
    mayNotFit: text(card.may_not_fit),
  }));
  return (
    <main className="mx-auto w-full max-w-[var(--pxr-content-width)] px-5 pb-28 pt-10">
      <ExperienceForm initialExperiences={experiences} />
    </main>
  );
}
