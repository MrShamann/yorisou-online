# MTF-1 — YORISOU Dynamic Test Engine Contract (v1 specification)

**Specification only.** Nothing in this document is runtime code, and no runtime file may import anything defined here. The TypeScript below is a **non-runtime interface draft** embedded in documentation for precision. Implementation is a later, separately authorized package.

## Design position

1. **Channel-neutral core.** The engine core is pure TypeScript with zero dependency on Next.js route components, React, DOM, LIFF, or any platform API. Channels — responsive Web, LINE/LIFF, iOS, Android — are adapters over the same core. **iOS and Android are channels, not separate holders of core logic**; no channel may own scoring, banks, or result assembly.
2. **120Q is an adapter, not the engine.** The engine must NOT be designed as a thin alias around the 120Q pipeline. The 120Q, the shared C02/F01/F02 rule engine, the RF/LD/micro flows, and the pair/draw flows each get an **adapter** implementing this contract (see `MTF1_EXISTING_ENGINE_ADAPTER_MAP.md`). The dormant DTE engine is not resurrected.
3. **Source separation is structural.** Every result is bound to exactly one `methodId`+`methodVersion`. **No universal cross-method score exists, and none may be added** — cross-method meaning arises only in the CPV1 understanding layer as user-confirmable, source-tagged observations.
4. **CPV1 compatibility.** Identity/maturity/activation vocabulary REUSES the canonical clean-main CPV1 contract (`lib/cpv1/methods.ts` — `MethodActivationState` 5-state set, evidence-gated deployment/Founder, separate maturity dimensions). This contract does not fork or overwrite CPV1 semantics; where the engine needs more granularity it composes, never redefines.
5. **Versioned everything.** Method, bank, scoring, result, and report versions are independent, explicit, and carried on every persisted object. Reproducibility: same `(methodVersion, scoringVersion, bankVersion, inputs, seed)` ⇒ same result, on every channel.

## 1. Method identity

```ts
// NON-RUNTIME INTERFACE DRAFT — do not import from application code.
/** Reuses CPV1 vocabulary; does not redefine it. */
type MethodActivationState = // = lib/cpv1 METHOD_ACTIVATION_STATES
  | "public_active" | "implemented_route_verified" | "implemented_private" | "gated" | "retired";

interface EngineMethodIdentity {
  methodId: string;                    // canonical, e.g. "relationship-pair-check"
  methodVersion: string;               // e.g. "pair-check-v1.0"
  family: string;                      // universe family (source-separated)
  evidenceClass:
    | "yorisou_original_reflection"
    | "psychology_preference_nonclinical"
    | "public_domain_psychometric_review"
    | "traditional_symbolic"
    | "traditional_symbolic_entertainment"; // S01 class: NEVER feeds evidence
  rightsStatus: string;                // from the CPV1 rights model (cleared/review_required/…)
  contentStatus: "authored" | "in_review" | "not_authored";
  privacyClass: "P1_answers_only" | "P2_name_input" | "P3_two_person" | "P4_birth_data" | "P5_free_text";
  activationState: MethodActivationState; // CPV1-evidence-gated; engine NEVER self-activates a method
  supportedChannels: ReadonlyArray<"web" | "line_liff" | "ios" | "android">;
  language: "ja" | "en";               // ja-first; per-language bundles, one canonical content source
  provenance: {                        // truth chain, not marketing
    bankVersion: string;               // content-hash-bearing (NOT count-only — fixes T12)
    bankContentHash: string;           // invalidates saved progress on content change
    scoringVersion: string;
    sourceRegister: string;            // pointer to Forge step-2/3 artifacts
  };
}
```

## 2. Question & interaction formats

Every format is a first-class, versioned item type. A method declares an ordered plan of items; the engine validates coverage and completion.

```ts
type EngineItem =
  | { kind: "scale5"; itemId: string; prompt: string; anchors: [string, string, string, string, string] }
  | { kind: "ab_choice"; itemId: string; prompt: string; a: string; b: string }
  | { kind: "single_choice"; itemId: string; prompt: string; options: EngineOption[] }
  | { kind: "multi_select"; itemId: string; prompt: string; options: EngineOption[]; min: number; max: number }
  | { kind: "ranking"; itemId: string; prompt: string; options: EngineOption[] }        // full or top-k order
  | { kind: "forced_tradeoff"; itemId: string; prompt: string; left: EngineOption; right: EngineOption } // both desirable
  | { kind: "scenario_choice"; itemId: string; scenario: string; options: EngineOption[] }
  | { kind: "image_choice"; itemId: string; prompt: string; images: EngineImageRef[] }   // original/licensed assets only
  | { kind: "color_choice"; itemId: string; prompt: string; colors: EngineColorRef[] }
  | { kind: "card_choice"; itemId: string; deckId: string; draw: number; allowReversed?: boolean }
  | { kind: "free_text"; itemId: string; prompt: string; maxLength: number }             // P5 handling mandatory
  | { kind: "datetime_place"; itemId: string; fields: ReadonlyArray<"date" | "time" | "place">; retention: "compute_and_discard" | "stored_with_consent" } // P4 policy required (ND-2)
  | { kind: "two_person"; itemId: string; perPerson: EngineItem; pairing: "same_items" | "mirrored" } // P3; both-party consent
  | { kind: "repeated_check"; itemId: string; cadence: "daily" | "weekly" | "monthly" | "seasonal" | "annual"; inner: EngineItem[] }
  | { kind: "calculator_input"; itemId: string; calculatorId: string; inputs: Record<string, unknown> } // deterministic
  | { kind: "imported_result"; itemId: string; provider: string; importMode: "user_declared" | "official_handoff" }; // NEVER re-scored as YORISOU evidence
```

## 3. Scoring & interpretation

```ts
type EngineScoringSpec =
  | { kind: "weighted_dimensions"; version: string; dims: DimensionWeightTable; tieBreak: TieBreakRule[]; fallback: FallbackRule }
  | { kind: "tag_rules"; version: string; rules: TagRule[]; tieBreak: TieBreakRule[]; fallback: FallbackRule }
  | { kind: "deterministic_algorithm"; version: string; algorithmId: string; seedPolicy: "none" | "input_derived" } // R04/S01-style draws
  | { kind: "pair_comparison"; version: string; perPersonDims: DimensionWeightTable; gapModel: GapRule[]; pairResults: string[] }
  | { kind: "nonnumeric_vector"; version: string; signalModel: string }                  // 120Q-style signal counting
  | { kind: "branching"; version: string; graph: BranchNode[] };                         // conditional item paths

interface EngineScoringMeta {
  methodVersion: string;
  scoringVersion: string;
  bankContentHash: string;
  reproducible: true;                  // structurally required — no nondeterminism outside declared seeds
  multiResult: boolean;                // e.g. Big-Five profile: several simultaneous facet results
  confidencePolicy:
    | { kind: "none_stated" }          // DEFAULT. Honest absence: "このバージョンは統計的に検証された確信度スコアを提供しません"
    | { kind: "validated"; validationRef: string }; // ONLY with a real, Founder-approved validation reference
  // PROHIBITED: numeric confidence without validationRef; any cross-method universal score.
}
```

Confidence rule (binding, per Founder decision D-3.5): the engine never fabricates certainty. Until a validation exists, every method uses `none_stated`; UI copy states the honest absence and NEVER attributes low confidence to false causes (the 120Q "insufficient answers" copy is the canonical violation, gated for correction as G-1).

## 4. Result object

```ts
interface EngineResult {
  resultId: string;                    // method-SPECIFIC id (e.g. "RF_BOUNDARY_RESET") — no global namespace
  methodId: string;
  methodVersion: string;
  scoringVersion: string;
  computedAt: string;                  // ISO
  primary: { archetypeId: string; nameJa: string };
  secondarySignals: Array<{ id: string; nameJa: string; strength: "faint" | "present" | "strong" }>; // words, not numbers
  reasons: Array<{ itemRefs: string[]; explanationJa: string }>;   // explainability: WHY this result
  limits: string;                      // mandatory interpretation-limit line (「診断ではありません」…)
  publicCopy: { recognitionJa: string; shareLineJa: string };      // screenshot-safe layer ONLY
  privateCopy: { highlightsJa: string[]; gentleNextStepJa: string }; // never in URLs/share cards
  reportEligibility: { deepReport: boolean; reportSchemaId: string | null };
  recommendationTags: string[];        // routing suggestions, never verdicts; empty for *_entertainment
  retestGuidance: { cadence: string; noteJa: string };             // no "you got worse" framing
  confirmation: {                      // CPV1 understanding integration (source-separated)
    status: "unreviewed" | "confirmed" | "corrected" | "rejected";
    correctedNoteRef: string | null;   // structured ref — no personal free text in audit events (CPV1 rule)
  };
}
```

## 5. Persistence & continuity

```ts
interface EngineContinuityContract {
  session: {
    guest: true;                       // every method playable as guest
    authenticatedOwnership: "on_save"; // results become owned rows only on explicit save
    saveResume: {
      supported: true;
      progressKey: { methodId: string; methodVersion: string; bankContentHash: string }; // content-hash keyed (fixes T12)
      storage: "server_authoritative_when_authenticated"; // browser/localStorage is a CACHE, never source of truth
    };
  };
  privacy: {
    privateByDefault: true;
    consentByPurpose: true;            // independent booleans per purpose (CPV1 method_consent model) — no ordered levels
    twoPersonConsent: {                // P3 methods
      required: true;
      bothPartiesExplicit: true;       // no result until both consent; second person may withdraw
      secondPersonDataMinimized: true;
    };
  };
  rights: {                            // CPV1 history/data-rights integration
    confirmation: true; correction: true; rejection: true;
    deletion: true;                    // user deletion honored across channels
    export: true;                      // user-readable export of own results
    auditEvents: "reason_coded_no_free_text"; // CPV1 rule
  };
  history: {
    perMethodTimeline: true;
    retest: { versionAware: true; oldResultsKeepTheirVersion: true }; // never re-scored silently
    crossMethodComparison: "cpv1_understanding_only";                 // source-separated; no merged taxonomy
    nextTestRecommendation: "tag_based_suggestion_only";
  };
  sharing: { shareSafeCardOnly: true; noPrivateCopyInUrls: true };
}
```

## 6. Mobile readiness

```ts
interface EngineMobileContract {
  offlineCapableScoring: "where_deterministic";  // banks+scoring bundled; deterministic methods compute offline, sync on reconnect
  sourceOfTruth: "server_for_saved_results";     // NO browser-only storage as source of truth for owned data
  identityHandoff: "secure_token_exchange";      // Web↔LINE↔native; no credentials in deep links
  deepLinkReturn: true;                          // interrupted flows resume via deep link on every channel
  oldVersionHandling: {
    bankVersionPinnedPerSession: true;           // a session finishes on the bank it started
    minSupportedEngineVersion: string;           // older apps get a graceful upgrade path, not corrupt results
  };
  localizationBundles: "per_language_versioned";
  accessibility: "wcag22aa_equivalent_on_all_channels";
  lifecycleInterruption: "state_checkpoint_per_item"; // call/app-switch/kill mid-test loses at most one item
  smallScreen: "one_item_per_screen_thumb_reach";
  channelOwnership: "core_logic_in_shared_engine_only"; // restated: channels render + collect; they never score
}
```

## 7. What the engine explicitly does NOT do

- No universal score, ranking, or cross-method numeric comparison of users.
- No self-activation: `activationState` transitions happen only through the CPV1 evidence-gated model (deployment evidence + Founder decision refs).
- No silent re-scoring of historical results on version changes.
- No fabricated confidence, validation, accuracy, or user-count claims.
- No evidence contribution from `traditional_symbolic*` methods — their results are reflections/entertainment, structurally excluded from the understanding evidence classes.
- No channel-specific forks of banks, scoring, or result assembly.

## 8. Open engine-contract items (for the implementation package)

1. Concrete wire format for `EngineItem` plans (JSON schema) + bank build tooling (the 120Q generator being founder-held (T20) argues for an in-repo bank compiler this time).
2. `calculator_input` calculator registry (numerology/zodiac later — deterministic, versioned, PD-verified rules only).
3. Two-person session pairing transport (same-device pass-and-play vs async link) — privacy review first (relationship-pair-check content package).
4. Multi-result rendering pattern (needed before big-five-ipip exits the rights queue).
