// CPV1 WS-D (+ CPV1-R1 §7 relations, §9 independent permissions) —
// source-separated understanding model.
//
// One understanding model WITHOUT one universal score. Every observation keeps
// its source, method, version, time, evidence class, and the user's confirm /
// correct / reject state. Incompatible methods are never averaged into a single
// numeric truth. AI synthesis is always a distinct, labelled source class.
//
// §7 — genuine cross-method synthesis: contradiction is detected ONLY when
// explicit OPPOSING relations exist for the same normalized theme (Route A: a
// governed relation model). Different method IDs alone do NOT prove contradiction.
// No opaque LLM classifier.
//
// §9 — permissions are INDEPENDENT, never an ordered level. Downstream purposes
// (report / companion / recommendation / community / public / archive / legacy)
// are an explicit set; visibility (private / shared / public_safe) is separate;
// one permission is never inferred from another.

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

// §9 — visibility is SEPARATE from downstream-purpose permissions.
export type Visibility = "private" | "shared" | "public_safe";

// §9 — independent downstream purposes. Membership in this set is the ONLY grant;
// no purpose implies another.
export type DownstreamUse = "report" | "companion" | "recommendation" | "community" | "public" | "archive" | "legacy";

// §7 — the relation an observation asserts toward a normalized theme.
export type ThemeRelation = "supports" | "opposes" | "unrelated" | "uncertain";

export type Observation = {
  id: string;
  sourceClass: SourceClass;
  methodId: string | null; // null for pure user statements / AI synthesis
  methodVersion: string | null;
  resultId: string | null; // exact result identity (§8 stable identity)
  createdAt: string;
  rawInputRef: string | null; // reference only where permitted; never raw content here
  derived: string; // the derived reading (safe summary; not raw answers)
  themeKey: string | null; // normalized theme key (§7)
  relation: ThemeRelation; // §7 — polarity toward themeKey
  correctedRelation: ThemeRelation | null; // §7/§8 — a user correction changes the effective relation
  evidenceClass: EvidenceClass;
  confirmation: ConfirmationState;
  userCorrection: string | null;
  visibility: Visibility; // §9
  permittedDownstream: DownstreamUse[]; // §9 — independent set
  freshnessAt: string;
  deleted: boolean;
};

export function isAiSynthesis(o: Observation): boolean {
  return o.sourceClass === "ai_synthesis";
}

// §9 — downstream use is allowed ONLY when: not deleted, not rejected, the purpose
// is EXPLICITLY in permittedDownstream, and (for community/public) visibility is
// public_safe. No purpose is inferred from any other, and no ordered level exists.
export function canUseDownstream(o: Observation, use: DownstreamUse): boolean {
  if (o.deleted) return false;
  if (o.confirmation === "rejected") return false;
  if (!o.permittedDownstream.includes(use)) return false;
  if ((use === "community" || use === "public") && o.visibility !== "public_safe") return false;
  return true;
}

// The effective relation after any user correction (§7 test 8).
export function effectiveRelation(o: Observation): ThemeRelation {
  return o.correctedRelation ?? o.relation;
}

export type ThemeAgreement = "recurring" | "mixed" | "contradictory" | "temporary" | "uncertain";

export type SynthesisTheme = {
  theme: string;
  supportingMethodIds: string[];
  opposingMethodIds: string[];
  agreement: ThemeAgreement;
  userConfirmed: boolean;
  note: string; // safe, non-diagnostic
};

// §7 — build a cross-method view WITHOUT collapsing to one score, using EXPLICIT
// relations. Pure + deterministic. `contradictory` is returned ONLY when the same
// normalized theme has at least one `supports` AND at least one `opposes` among
// effective (non-deleted, non-rejected) observations. `unrelated` observations are
// excluded from a theme; `uncertain` never creates contradiction.
export function synthesizeThemes(
  observations: readonly Observation[],
  themeKeyOf?: (o: Observation) => string,
): SynthesisTheme[] {
  const groups = new Map<string, Observation[]>();
  for (const o of observations) {
    if (o.deleted || o.confirmation === "rejected") continue; // §7 tests 6,7
    const rel = effectiveRelation(o);
    if (rel === "unrelated") continue; // §7 test 4 — unrelated is not mixed in
    const key = o.themeKey ?? (themeKeyOf ? themeKeyOf(o) : "");
    if (!key) continue;
    const arr = groups.get(key) ?? [];
    arr.push(o);
    groups.set(key, arr);
  }
  const out: SynthesisTheme[] = [];
  for (const [theme, obs] of groups) {
    const supporting = obs.filter((o) => effectiveRelation(o) === "supports");
    const opposing = obs.filter((o) => effectiveRelation(o) === "opposes");
    const uncertain = obs.filter((o) => effectiveRelation(o) === "uncertain");
    const supMethods = Array.from(new Set(supporting.map((o) => o.methodId).filter((m): m is string => Boolean(m))));
    const oppMethods = Array.from(new Set(opposing.map((o) => o.methodId).filter((m): m is string => Boolean(m))));

    let agreement: ThemeAgreement;
    if (supporting.length > 0 && opposing.length > 0) {
      agreement = "contradictory"; // §7 test 3 — explicit support/oppose pair
    } else if (supporting.length >= 2) {
      agreement = "recurring"; // §7 test 2 — multiple supporting relations
    } else if (uncertain.length > 0 && supporting.length === 0 && opposing.length === 0) {
      agreement = "uncertain"; // §7 test 5 — uncertain is never contradiction
    } else if (obs.length >= 2) {
      agreement = "mixed";
    } else {
      agreement = "temporary";
    }

    out.push({
      theme,
      supportingMethodIds: supMethods,
      opposingMethodIds: oppMethods,
      agreement,
      userConfirmed: obs.some((o) => o.confirmation === "confirmed"),
      note:
        agreement === "contradictory"
          ? "複数の見方が食い違っています。どちらかに決めるのではなく、両方の見え方として扱います。"
          : "複数の見方から見えている傾向です。ひとつの答えに決めるものではありません。",
    });
  }
  // Deterministic order: contradictory first (most notable), then most-supported,
  // then theme name.
  out.sort((a, b) => {
    const rank = (t: ThemeAgreement) => (t === "contradictory" ? 0 : t === "recurring" ? 1 : 2);
    if (rank(a.agreement) !== rank(b.agreement)) return rank(a.agreement) - rank(b.agreement);
    if (b.supportingMethodIds.length !== a.supportingMethodIds.length) return b.supportingMethodIds.length - a.supportingMethodIds.length;
    return a.theme.localeCompare(b.theme);
  });
  return out;
}

// A guard used by every surface: never average incompatible methods into one
// number. This function intentionally has no "overall score" output.
export const NO_UNIVERSAL_SCORE = true as const;
