// CPV1 WS-D — source-separated understanding model.
//
// One understanding model WITHOUT one universal score. Every observation keeps
// its source, method, version, time, evidence class, and the user's confirm /
// correct / reject state. Incompatible methods are never averaged into a single
// numeric truth. Cross-method synthesis may surface recurring themes, disagree-
// ments, temporary changes, and unresolved contradictions — and AI synthesis is
// always a distinct, labelled source class, never presented as method output or
// verified fact.

export type SourceClass =
  | "verified_user_fact"
  | "direct_user_statement"
  | "current_state_answer"
  | "yorisou_original_result"
  | "psychology_preference_reflection"
  | "licensed_framework_result"
  | "imported_external_result"
  | "chinese_cultural_interpretation"
  | "symbolic_reflection"
  | "behavioral_feedback"
  | "historical_state"
  | "ai_synthesis"
  | "user_confirmation"
  | "user_correction"
  | "user_rejection";

export type EvidenceClass = "user_declared" | "method_derived" | "behavioral" | "inferred" | "imported";

export type ConfirmationState = "unreviewed" | "confirmed" | "corrected" | "rejected";

export type PrivacyScope = "device_local" | "account_private" | "companion_permitted" | "recommendation_permitted" | "public_safe";

export type Observation = {
  id: string;
  sourceClass: SourceClass;
  methodId: string | null; // null for pure user statements / AI synthesis
  methodVersion: string | null;
  createdAt: string;
  rawInputRef: string | null; // reference only where permitted; never raw content here
  derived: string; // the derived reading (safe summary; not raw answers)
  evidenceClass: EvidenceClass;
  confirmation: ConfirmationState;
  userCorrection: string | null;
  privacy: PrivacyScope;
  freshnessAt: string; // when this observation was last considered current
  permittedDownstream: Array<"companion" | "recommendation" | "report" | "community">;
  deleted: boolean;
};

// AI synthesis MUST be a distinct source class and never claim to be a method
// result or a verified fact.
export function isAiSynthesis(o: Observation): boolean {
  return o.sourceClass === "ai_synthesis";
}

type DownstreamUse = "companion" | "recommendation" | "report" | "community";

// Which privacy scopes permit which downstream use. Community requires the
// strongest (public_safe); companion/recommendation require their explicit
// grant; report is allowed for anything account-private or broader.
const PRIVACY_ALLOWS: Record<DownstreamUse, ReadonlySet<PrivacyScope>> = {
  companion: new Set<PrivacyScope>(["companion_permitted", "recommendation_permitted", "public_safe"]),
  recommendation: new Set<PrivacyScope>(["recommendation_permitted", "public_safe"]),
  report: new Set<PrivacyScope>(["account_private", "companion_permitted", "recommendation_permitted", "public_safe"]),
  community: new Set<PrivacyScope>(["public_safe"]),
};

// Downstream use is allowed only when the observation is not deleted, not
// rejected, privacy permits it, and the specific use is in permittedDownstream.
export function canUseDownstream(o: Observation, use: DownstreamUse): boolean {
  if (o.deleted) return false;
  if (o.confirmation === "rejected") return false;
  if (!PRIVACY_ALLOWS[use].has(o.privacy)) return false;
  return o.permittedDownstream.includes(use);
}

export type SynthesisTheme = {
  theme: string;
  supportingMethodIds: string[]; // which methods point at this theme
  agreement: "recurring" | "mixed" | "contradictory" | "temporary";
  userConfirmed: boolean;
  note: string; // safe, non-diagnostic
};

// Build a cross-method view WITHOUT collapsing to one score. Pure + deterministic.
// It groups non-rejected, non-deleted observations by their derived theme key and
// reports agreement/disagreement rather than an average.
export function synthesizeThemes(
  observations: readonly Observation[],
  themeKeyOf: (o: Observation) => string,
): SynthesisTheme[] {
  const groups = new Map<string, Observation[]>();
  for (const o of observations) {
    if (o.deleted || o.confirmation === "rejected") continue;
    const key = themeKeyOf(o);
    if (!key) continue;
    const arr = groups.get(key) ?? [];
    arr.push(o);
    groups.set(key, arr);
  }
  const out: SynthesisTheme[] = [];
  for (const [theme, obs] of groups) {
    const methodIds = Array.from(new Set(obs.map((o) => o.methodId).filter((m): m is string => Boolean(m))));
    const confirmed = obs.some((o) => o.confirmation === "confirmed");
    // Agreement: multiple distinct methods → recurring; single → temporary/mixed.
    const agreement: SynthesisTheme["agreement"] =
      methodIds.length >= 2 ? "recurring" : obs.length >= 2 ? "mixed" : "temporary";
    out.push({
      theme,
      supportingMethodIds: methodIds,
      agreement,
      userConfirmed: confirmed,
      note: "複数の見方から見えている傾向です。ひとつの答えに決めるものではありません。",
    });
  }
  // Deterministic order: most-supported first, then theme name.
  out.sort((a, b) => b.supportingMethodIds.length - a.supportingMethodIds.length || a.theme.localeCompare(b.theme));
  return out;
}

// A guard used by every surface: never average incompatible methods into one
// number. This function intentionally has no "overall score" output.
export const NO_UNIVERSAL_SCORE = true as const;
