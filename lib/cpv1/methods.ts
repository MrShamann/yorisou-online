// CPV1 WS-B1/C — Method Registry + method-adapter contract + method universe.
//
// One first-class governed registry for every method. Each entry carries its
// identity, inputs (incl. sensitive), model, schemas, limits, continuity
// permissions, sharing/export/deletion rules, and activation state. The public
// activation gate combines: method logic complete AND rights clear AND privacy
// reviewed AND tests pass AND Founder activation. External/traditional methods
// are registered but RIGHTS_BLOCKED (kept off public routes; no fabricated
// calculation logic or interpretation content).

import { isDevFlagOn } from "./flags";
import { type RightsRecord, rightsClears, rightsResolutionReport, rightsReviewRequired, yorisouOriginal } from "./rights";

export type MethodFamily =
  | "yorisou_state" // current-state / reflection originals
  | "yorisou_original_assessment" // 120Q, work fit, etc.
  | "chinese_traditional"
  | "western_symbolic"
  | "psychology_preference";

export type MethodRole =
  | "primary_understanding" // deep understanding (e.g. 120Q)
  | "lightweight_check"
  | "reflection_cadence"
  | "relationship"
  | "symbolic_reflection"
  | "preference_reflection";

export type InputKind = "answers" | "text" | "birth_date" | "birth_time" | "birth_location" | "name" | "image" | "selection";

export type ContinuityPermission = "allowed" | "opt_in" | "prohibited_by_default";

// CPV1-R1 §4 — SEVEN SEPARATE maturity dimensions. Blockers are never collapsed
// into a single "rights_blocked". Each method exposes each dimension truthfully.
export type ImplementationStatus = "not_started" | "in_progress" | "complete";
export type MethodRightsStatus = "review_required" | "cleared" | "blocked";
export type ContentStatus = "not_authored" | "draft" | "authored" | "licensed";
export type PrivacyStatus = "not_reviewed" | "reviewed";
export type TestStatus = "not_run" | "passing";
export type FounderActivationStatus = "closed" | "open";
export type PublicRouteStatus = "unavailable" | "available";

export type MethodMaturity = {
  implementation: ImplementationStatus;
  rights: MethodRightsStatus;
  content: ContentStatus;
  privacy: PrivacyStatus;
  tests: TestStatus;
  founderActivation: FounderActivationStatus;
  publicRoute: PublicRouteStatus;
};

// A coarse summary label (NOT a replacement for the seven dimensions — read
// methodMaturity() for the real per-dimension truth). Never collapses blockers.
export type MethodActivationState =
  | "public_active" // every dimension passes; on a public route
  | "implemented_private" // implemented + rights cleared, not yet Founder-activated
  | "gated" // one or more dimensions unmet (see methodMaturity for which)
  | "retired";

export type MethodRegistryEntry = {
  methodId: string;
  nameJa: string;
  nameZh: string | null;
  nameEn: string;
  family: MethodFamily;
  tradition: string; // origin / tradition; "YORISOU original" for owned methods
  schoolVariant: string | null; // explicit school/calculation variant if any
  role: MethodRole;
  requiredInputs: InputKind[];
  optionalInputs: InputKind[];
  sensitiveInputs: InputKind[]; // birth time/location, name, raw answers, …
  model: string; // calculation / draw / reflection model (description, not content)
  methodVersion: string;
  resultSchema: string; // ref/name of the result schema
  reportSchema: string; // ref/name of the report schema
  interpretationLimits: string;
  refreshModel: string; // retest / refresh cadence
  companionPermission: ContinuityPermission;
  recommendationPermission: ContinuityPermission;
  communityPermission: ContinuityPermission;
  publicSafeSharingRule: string;
  exportRule: string;
  deletionRule: string;
  // CPV1-R1 §4 — separate maturity dimensions (raw truth; never collapsed).
  implementation: ImplementationStatus; // is the method's own logic actually built?
  content: ContentStatus; // is the interpretation/result content authored/licensed?
  privacy: PrivacyStatus;
  tests: TestStatus;
  rights: RightsRecord; // rights status derives from the route-specific gate
  devFlagged: boolean; // true ⇒ visible only in dev preview, never public
};

// The shared method-adapter contract. Implemented methods provide a real adapter;
// rights-blocked methods provide `blockedAdapter` which never computes content.
export type MethodSession = { methodId: string; startedAt: string; inputsRef?: string };
export type MethodResult = {
  methodId: string;
  methodVersion: string;
  resultId: string; // public result id where applicable
  producedAt: string;
  // No cross-method numeric truth; a method result is its own source class.
  summarySafe: string;
};
export type MethodAdapter = {
  methodId: string;
  prepare: (inputsRef?: string) => MethodSession;
  // compute is intentionally absent for rights-blocked methods.
  compute?: (session: MethodSession) => MethodResult;
  gatedReason?: string; // present when compute is withheld (rights/legal/etc.)
};

export function blockedAdapter(methodId: string, reason: string): MethodAdapter {
  return {
    methodId,
    prepare: () => ({ methodId, startedAt: "" }),
    gatedReason: reason,
  };
}

// Derive the rights DIMENSION from the route-specific gate (cleared / blocked /
// review_required) — kept separate from implementation, content, privacy, tests.
function deriveRightsStatus(r: RightsRecord): MethodRightsStatus {
  if (rightsClears(r)) return "cleared";
  if (r.rightsRoute === "RIGHTS_REVIEW_REQUIRED") return "review_required";
  const report = rightsResolutionReport(r);
  return report.unresolved.some((u) => u.includes(":blocked")) ? "blocked" : "review_required";
}

// CPV1-R1 §4 — the seven separate maturity dimensions. `founderActivation` is the
// single source of truth (the rights activation gate). `publicRoute` is available
// ONLY when every dimension passes AND the method is not dev-flagged.
export function methodMaturity(m: MethodRegistryEntry): MethodMaturity {
  const rights = deriveRightsStatus(m.rights);
  const founderActivation: FounderActivationStatus = m.rights.activationGate;
  const publicRoute: PublicRouteStatus =
    m.implementation === "complete" &&
    rights === "cleared" &&
    (m.content === "authored" || m.content === "licensed") &&
    m.privacy === "reviewed" &&
    m.tests === "passing" &&
    founderActivation === "open" &&
    !m.devFlagged
      ? "available"
      : "unavailable";
  return {
    implementation: m.implementation,
    rights,
    content: m.content,
    privacy: m.privacy,
    tests: m.tests,
    founderActivation,
    publicRoute,
  };
}

// The public activation gate (§8.3): PUBLIC only when every dimension passes.
export function methodPublicallyActivatable(m: MethodRegistryEntry): boolean {
  return methodMaturity(m).publicRoute === "available";
}

// The FIRST unmet dimension (honest primary blocker) — never a single collapsed
// "rights_blocked". Returns null when the method is publicly activatable.
export function methodPrimaryBlocker(m: MethodRegistryEntry): keyof MethodMaturity | "dev_flagged" | null {
  const mt = methodMaturity(m);
  if (mt.publicRoute === "available") return null;
  if (mt.implementation !== "complete") return "implementation";
  if (mt.rights !== "cleared") return "rights";
  if (mt.content !== "authored" && mt.content !== "licensed") return "content";
  if (mt.privacy !== "reviewed") return "privacy";
  if (mt.tests !== "passing") return "tests";
  if (mt.founderActivation !== "open") return "founderActivation";
  if (m.devFlagged) return "dev_flagged";
  return null;
}

// A coarse summary label. The real truth is methodMaturity(); this never collapses
// distinct blockers into one.
export function methodActivationState(m: MethodRegistryEntry): MethodActivationState {
  const mt = methodMaturity(m);
  if (mt.publicRoute === "available") return "public_active";
  if (mt.implementation === "complete" && mt.rights === "cleared") return "implemented_private";
  return "gated";
}

// ── helpers ─────────────────────────────────────────────────────────────────
const common = {
  companionPermission: "opt_in" as ContinuityPermission,
  recommendationPermission: "opt_in" as ContinuityPermission,
  communityPermission: "prohibited_by_default" as ContinuityPermission,
  publicSafeSharingRule: "method name + user-approved theme + non-sensitive summary only",
  exportRule: "user-exportable (device-local + account)",
  deletionRule: "user-deletable; deletion propagates to derived understanding",
};

// A YORISOU-original, already-implemented, publicly-active method (mirrors the
// real shipped assessments/reflections).
function originalActive(
  e: Pick<MethodRegistryEntry, "methodId" | "nameJa" | "nameEn" | "family" | "role" | "requiredInputs" | "sensitiveInputs" | "model" | "methodVersion" | "resultSchema" | "reportSchema" | "interpretationLimits" | "refreshModel">,
): MethodRegistryEntry {
  return {
    nameZh: null,
    tradition: "YORISOU original",
    schoolVariant: null,
    optionalInputs: [],
    ...common,
    implementation: "complete",
    content: "authored",
    privacy: "reviewed",
    tests: "passing",
    rights: yorisouOriginal(e.methodId, { activated: true }),
    devFlagged: false,
    ...e,
  } as MethodRegistryEntry;
}

// An external/traditional method: registered, rights-blocked, dev-flagged, NO
// implementation (no fabricated content). `model` describes the intended model
// only; compute is withheld.
function externalRightsBlocked(
  e: Pick<MethodRegistryEntry, "methodId" | "nameJa" | "nameZh" | "nameEn" | "family" | "tradition" | "schoolVariant" | "role" | "requiredInputs" | "sensitiveInputs" | "model" | "interpretationLimits"> & {
    rightsSource: string;
    requiresEphemeris?: boolean; // astrology natal chart etc.
    requiresArtwork?: boolean; // Tarot / symbolic cards etc.
  },
): MethodRegistryEntry {
  return {
    optionalInputs: [],
    methodVersion: "0.0.0-unimplemented",
    resultSchema: "pending-rights",
    reportSchema: "pending-rights",
    refreshModel: "pending",
    ...common,
    communityPermission: "prohibited_by_default",
    // CPV1-R1 §4 — every blocking dimension recorded separately, not collapsed.
    implementation: "not_started",
    content: "not_authored",
    privacy: "not_reviewed",
    tests: "not_run",
    rights: rightsReviewRequired(e.methodId, e.rightsSource, {
      requiresEphemeris: e.requiresEphemeris,
      requiresArtwork: e.requiresArtwork,
    }),
    devFlagged: true,
    ...e,
  } as MethodRegistryEntry;
}

// ── The method universe ───────────────────────────────────────────────────────
export const CPV1_METHOD_UNIVERSE: readonly MethodRegistryEntry[] = [
  // YORISOU-original, implemented, active (mirror of the shipped app) ----------
  originalActive({
    methodId: "imairo-120q",
    nameJa: "いま色テスト（120問）",
    nameEn: "Imairo 120Q",
    family: "yorisou_original_assessment",
    role: "primary_understanding",
    requiredInputs: ["answers"],
    sensitiveInputs: ["answers"],
    model: "120 fixed questions → 8 dimensions → 24 subdimensions → imairo-public-assignment-v0.1 → 24 results / 6 clans",
    methodVersion: "imairo-public-assignment-v0.1",
    resultSchema: "imairo-result-v0.1 (24 results)",
    reportSchema: "24-report-library-v0.2.1 + family-report",
    interpretationLimits: "今の傾向の整理。医学的・心理的診断ではない。回答はその日の状態でも変わる。",
    refreshModel: "retake anytime; history-preserving",
  }),
  originalActive({
    methodId: "c02-current-state",
    nameJa: "今のわたしチェック",
    nameEn: "Current-state check",
    family: "yorisou_state",
    role: "lightweight_check",
    requiredInputs: ["answers"],
    sensitiveInputs: ["answers"],
    model: "short current-state answers → multi-facet state summary",
    methodVersion: "c02-v1",
    resultSchema: "c02-result",
    reportSchema: "family-report:c02",
    interpretationLimits: "今の状態のスナップショット。判定ではない。",
    refreshModel: "frequent; snapshot per completion",
  }),
  originalActive({
    methodId: "relationship-fatigue-24q",
    nameJa: "人間関係の疲れチェック",
    nameEn: "Relationship-fatigue check",
    family: "yorisou_state",
    role: "relationship",
    requiredInputs: ["answers"],
    sensitiveInputs: ["answers"],
    model: "24 fixed questions → relationship-load facets (SEPARATE from the 120Q route)",
    methodVersion: "relfatigue-v1",
    resultSchema: "relationship-fatigue-result",
    reportSchema: "family-report:relationship-fatigue",
    interpretationLimits: "会う・返す・合わせるの負担の傾向。関係の結論を決めるものではない。",
    refreshModel: "retake anytime",
  }),
  originalActive({
    methodId: "f01-work-fit",
    nameJa: "向いている働き方",
    nameEn: "Work-fit",
    family: "yorisou_original_assessment",
    role: "preference_reflection",
    requiredInputs: ["answers"],
    sensitiveInputs: ["answers"],
    model: "answers → work-fit direction",
    methodVersion: "f01-v1_0",
    resultSchema: "f01-result",
    reportSchema: "family-report:f01",
    interpretationLimits: "向いている方向の傾向。適職や能力の断定ではない。",
    refreshModel: "retake anytime",
  }),
  originalActive({
    methodId: "f02-workplace-fit",
    nameJa: "職場環境フィット",
    nameEn: "Workplace-fit",
    family: "yorisou_original_assessment",
    role: "preference_reflection",
    requiredInputs: ["answers"],
    sensitiveInputs: ["answers"],
    model: "answers → workplace-environment fit",
    methodVersion: "f02-v1_0",
    resultSchema: "f02-result",
    reportSchema: "family-report:f02",
    interpretationLimits: "環境との相性の傾向。職場の良し悪しの判定ではない。",
    refreshModel: "retake anytime",
  }),
  originalActive({
    methodId: "love-distance",
    nameJa: "恋愛の距離感チェック",
    nameEn: "Love-distance",
    family: "yorisou_state",
    role: "relationship",
    requiredInputs: ["answers"],
    sensitiveInputs: ["answers"],
    model: "answers → distance/pace facets",
    methodVersion: "love-distance-v1",
    resultSchema: "love-distance-result",
    reportSchema: "family-report:love-distance",
    interpretationLimits: "距離の取り方の傾向。恋愛の成否や相性の判定ではない。",
    refreshModel: "retake anytime",
  }),
  originalActive({
    methodId: "work-rhythm",
    nameJa: "仕事のリズムチェック",
    nameEn: "Work-rhythm",
    family: "yorisou_state",
    role: "lightweight_check",
    requiredInputs: ["answers"],
    sensitiveInputs: ["answers"],
    model: "answers → focus peaks/troughs & fatigue pace",
    methodVersion: "work-rhythm-v1",
    resultSchema: "work-rhythm-result",
    reportSchema: "family-report:work-rhythm",
    interpretationLimits: "今のリズムの傾向。能力や健康状態の判定ではない。",
    refreshModel: "retake anytime",
  }),
  originalActive({
    methodId: "local-life",
    nameJa: "暮らしの関心チェック",
    nameEn: "Local-life",
    family: "yorisou_state",
    role: "lightweight_check",
    requiredInputs: ["answers"],
    sensitiveInputs: ["answers"],
    model: "answers → current-interest & rhythm facets",
    methodVersion: "local-life-v1",
    resultSchema: "local-life-result",
    reportSchema: "family-report:local-life",
    interpretationLimits: "今の関心とリズムの傾向。暮らしの良し悪しの判定ではない。",
    refreshModel: "retake anytime",
  }),
  originalActive({
    methodId: "name-impression",
    nameJa: "名前の印象チェック",
    nameEn: "Name-impression",
    family: "yorisou_state",
    role: "symbolic_reflection",
    requiredInputs: ["name"],
    sensitiveInputs: ["name"],
    model: "YORISOU-original reflection on how a name reads (NOT 姓名判断/fortune-telling)",
    methodVersion: "name-impression-v1",
    resultSchema: "name-impression-result",
    reportSchema: "family-report:name-impression",
    interpretationLimits: "名前から受ける印象の傾向。性格・運勢・将来の判定ではない。",
    refreshModel: "retake anytime",
  }),

  // Reflection cadence originals (contract-level; understanding integration) ---
  {
    ...originalActive({
      methodId: "reflection-cadence",
      nameJa: "ふり返り（日次・週次・月次・季節・年次）",
      nameEn: "Reflection cadence",
      family: "yorisou_state",
      role: "reflection_cadence",
      requiredInputs: ["text"],
      sensitiveInputs: ["text"],
      model: "structured periodic reflection prompts → private reflection observations",
      methodVersion: "reflect-cadence-v0.1",
      resultSchema: "reflection-observation",
      reportSchema: "change-over-time-report",
      interpretationLimits: "自己記述の記録。判定や評価ではない。",
      refreshModel: "recurring by cadence",
    }),
    implementation: "in_progress",
    tests: "not_run",
    // Real original method, but CPV1 surface integration is contract-level (not yet public).
  },

  // Chinese cultural & traditional — RIGHTS_BLOCKED (no fabricated content) -----
  externalRightsBlocked({
    methodId: "ziwei-dou-shu",
    nameJa: "紫微斗数",
    nameZh: "紫微斗數",
    nameEn: "Zi Wei Dou Shu",
    family: "chinese_traditional",
    tradition: "Chinese astrology (Purple Star)",
    schoolVariant: "school/variant TBD at rights review (must be explicit)",
    role: "symbolic_reflection",
    requiredInputs: ["birth_date", "birth_time"],
    sensitiveInputs: ["birth_date", "birth_time", "birth_location"],
    model: "birth chart → star placements (calc logic + interpretation are rights-gated; not implemented)",
    interpretationLimits: "象徴的参照。運命・断定・診断・重大判断の根拠にしない。",
    rightsSource: "traditional system; needs verified public-domain reimplementation or licensed integration",
  }),
  externalRightsBlocked({
    methodId: "bazi-four-pillars",
    nameJa: "八字・四柱推命",
    nameZh: "八字/四柱",
    nameEn: "Ba Zi / Four Pillars",
    family: "chinese_traditional",
    tradition: "Chinese Four Pillars of Destiny",
    schoolVariant: "explicit school required (e.g. classical vs modern)",
    role: "symbolic_reflection",
    requiredInputs: ["birth_date", "birth_time"],
    sensitiveInputs: ["birth_date", "birth_time", "birth_location"],
    model: "date/time → four pillars (calendar/timezone provenance required); rights-gated",
    interpretationLimits: "象徴的参照。運命・断定の根拠にしない。",
    rightsSource: "traditional system + calendar conversion + interpretation corpus; rights review required",
  }),
  externalRightsBlocked({
    methodId: "cheng-gu",
    nameJa: "称骨",
    nameZh: "稱骨",
    nameEn: "Cheng Gu (Bone Weighting)",
    family: "chinese_traditional",
    tradition: "Chinese bone-weight fortune",
    schoolVariant: "explicit table variant required",
    role: "symbolic_reflection",
    requiredInputs: ["birth_date", "birth_time"],
    sensitiveInputs: ["birth_date", "birth_time"],
    model: "birth data → weighting table lookup; table + verses are rights-gated",
    interpretationLimits: "象徴的参照のみ。",
    rightsSource: "traditional weighting tables + verse text; rights review required",
  }),
  externalRightsBlocked({
    methodId: "i-ching",
    nameJa: "易経",
    nameZh: "易經",
    nameEn: "I Ching",
    family: "chinese_traditional",
    tradition: "Book of Changes",
    schoolVariant: "translation/edition must be rights-cleared",
    role: "symbolic_reflection",
    requiredInputs: ["selection"],
    sensitiveInputs: ["text"],
    model: "hexagram draw → reading; hexagram TEXT/translation is rights-gated",
    interpretationLimits: "内省の入口。決定の権威にしない。",
    rightsSource: "text + translation rights; classical text may be PD but modern translations are not",
  }),
  externalRightsBlocked({
    methodId: "five-elements",
    nameJa: "五行",
    nameZh: "五行",
    nameEn: "Five Elements",
    family: "chinese_traditional",
    tradition: "Wu Xing",
    schoolVariant: "mapping model must be explicit",
    role: "symbolic_reflection",
    requiredInputs: ["birth_date"],
    sensitiveInputs: ["birth_date"],
    model: "element mapping/balance; interpretation corpus rights-gated",
    interpretationLimits: "象徴的参照のみ。",
    rightsSource: "mapping + interpretation corpus; rights review required",
  }),
  externalRightsBlocked({
    methodId: "chinese-zodiac",
    nameJa: "生肖（十二支）",
    nameZh: "生肖",
    nameEn: "Chinese Zodiac",
    family: "chinese_traditional",
    tradition: "Twelve animal signs",
    schoolVariant: "n/a",
    role: "symbolic_reflection",
    requiredInputs: ["birth_date"],
    sensitiveInputs: ["birth_date"],
    model: "year → sign (calendar provenance); interpretation text rights-gated",
    interpretationLimits: "象徴的参照のみ。",
    rightsSource: "sign mapping is simple but interpretation text must be original/licensed",
  }),
  externalRightsBlocked({
    methodId: "name-hanzi-reflection",
    nameJa: "姓名・漢字リフレクション",
    nameZh: "姓名/漢字",
    nameEn: "Name & Han-character Reflection",
    family: "chinese_traditional",
    tradition: "Han-character naming reflection",
    schoolVariant: "stroke/meaning model must be explicit + rights-cleared",
    role: "symbolic_reflection",
    requiredInputs: ["name"],
    sensitiveInputs: ["name"],
    model: "character stroke/meaning reflection (distinct from YORISOU name-impression); rights-gated",
    interpretationLimits: "名前占いではない。象徴的な見方の一つ。",
    rightsSource: "stroke tables + meaning corpus; rights review required (do not copy 姓名判断 tables)",
  }),

  // Western & global symbolic — RIGHTS_BLOCKED --------------------------------
  externalRightsBlocked({
    methodId: "astrology-natal",
    nameJa: "占星術・出生図",
    nameZh: null,
    nameEn: "Astrology / Natal chart",
    family: "western_symbolic",
    tradition: "Western astrology",
    schoolVariant: "house system + zodiac (tropical/sidereal) must be explicit",
    role: "symbolic_reflection",
    requiredInputs: ["birth_date", "birth_time", "birth_location"],
    sensitiveInputs: ["birth_date", "birth_time", "birth_location"],
    model: "natal chart requires a LICENSED ephemeris + original interpretation; not implemented",
    interpretationLimits: "象徴的参照。医療・法律・金融・雇用・関係の権威にしない。",
    rightsSource: "ephemeris data licence + original interpretation content required",
    requiresEphemeris: true,
  }),
  externalRightsBlocked({
    methodId: "tarot",
    nameJa: "タロット",
    nameZh: null,
    nameEn: "Tarot",
    family: "western_symbolic",
    tradition: "Tarot",
    schoolVariant: "deck + spread must be explicit",
    role: "symbolic_reflection",
    requiredInputs: ["selection"],
    sensitiveInputs: ["text"],
    model: "card draw → reflection; ARTWORK + interpretation must be ORIGINAL YORISOU or licensed (do NOT copy a modern deck)",
    interpretationLimits: "内省の入口。決定の権威にしない。",
    rightsSource: "artwork rights + interpretation; original YORISOU deck or verified commercial licence required",
    requiresArtwork: true,
  }),
  externalRightsBlocked({
    methodId: "numerology",
    nameJa: "数秘術",
    nameZh: null,
    nameEn: "Numerology",
    family: "western_symbolic",
    tradition: "Numerology",
    schoolVariant: "system (Pythagorean/Chaldean) must be explicit",
    role: "symbolic_reflection",
    requiredInputs: ["birth_date", "name"],
    sensitiveInputs: ["birth_date", "name"],
    model: "number reduction (logic simple) + interpretation corpus (rights-gated)",
    interpretationLimits: "象徴的参照のみ。",
    rightsSource: "interpretation text must be original/licensed",
  }),
  externalRightsBlocked({
    methodId: "dream-reflection",
    nameJa: "夢のふり返り",
    nameZh: null,
    nameEn: "Dream reflection",
    family: "western_symbolic",
    tradition: "reflective (not dream-dictionary)",
    schoolVariant: "n/a",
    role: "symbolic_reflection",
    requiredInputs: ["text"],
    sensitiveInputs: ["text"],
    model: "guided reflection on a dream; must avoid copied dream-dictionaries; original prompts needed",
    interpretationLimits: "解釈は内省の補助。診断ではない。",
    rightsSource: "original reflective prompts required (no third-party dream dictionary)",
  }),
  externalRightsBlocked({
    methodId: "yorisou-symbolic-cards",
    nameJa: "YORISOUシンボルカード",
    nameZh: null,
    nameEn: "YORISOU symbolic cards",
    family: "western_symbolic",
    tradition: "YORISOU original",
    schoolVariant: "n/a",
    role: "symbolic_reflection",
    requiredInputs: ["selection"],
    sensitiveInputs: [],
    model: "original YORISOU card set — logic can be original but ORIGINAL ARTWORK must be authored/verified before public",
    interpretationLimits: "内省の入口。決定の権威にしない。",
    rightsSource: "must be original YORISOU artwork + copy; blocked until authored (no copied deck)",
    requiresArtwork: true,
  }),
  externalRightsBlocked({
    methodId: "image-color-reflection",
    nameJa: "イメージ・色のふり返り",
    nameZh: null,
    nameEn: "Image & color reflection",
    family: "western_symbolic",
    tradition: "YORISOU original",
    schoolVariant: "n/a",
    role: "symbolic_reflection",
    requiredInputs: ["image", "selection"],
    sensitiveInputs: ["image"],
    model: "original image/color reflection — images must be original/licensed",
    interpretationLimits: "感覚の記録。判定ではない。",
    rightsSource: "image assets must be original or licensed; blocked until asset rights cleared",
  }),

  // Psychology & preference -----------------------------------------------------
  externalRightsBlocked({
    methodId: "big-five-ipip",
    nameJa: "ビッグファイブ（IPIP準拠）",
    nameZh: null,
    nameEn: "Big Five (IPIP-based)",
    family: "psychology_preference",
    tradition: "Five-Factor Model",
    schoolVariant: "IPIP item pool licence + scoring must be validated",
    role: "preference_reflection",
    requiredInputs: ["answers"],
    sensitiveInputs: ["answers"],
    model: "IPIP items are public-domain but require licence/source validation + original scoring presentation; not implemented",
    interpretationLimits: "傾向の内省。臨床診断ではない。",
    rightsSource: "IPIP source validation required before use (§9 C4)",
  }),
  externalRightsBlocked({
    methodId: "mbti-import-handoff",
    nameJa: "MBTI（結果インポート／公式連携）",
    nameZh: null,
    nameEn: "MBTI (import / official handoff)",
    family: "psychology_preference",
    tradition: "Type indicator (trademarked)",
    schoolVariant: "import or official handoff or formal licence ONLY — no embedded instrument",
    role: "preference_reflection",
    requiredInputs: ["selection"],
    sensitiveInputs: [],
    model: "USER_RESULT_IMPORT / official handoff only; embedding an unlicensed MBTI instrument is prohibited",
    interpretationLimits: "外部結果の取り込み。YORISOUの判定ではない。",
    rightsSource: "trademarked; import/handoff/licence only",
  }),
  originalActive({
    methodId: "yorisou-values",
    nameJa: "価値観リフレクション",
    nameEn: "Values reflection",
    family: "psychology_preference",
    role: "preference_reflection",
    requiredInputs: ["answers"],
    sensitiveInputs: ["answers"],
    model: "YORISOU-original values reflection",
    methodVersion: "values-v0.1",
    resultSchema: "values-result",
    reportSchema: "family-report:values",
    interpretationLimits: "今大事にしていることの整理。判定ではない。",
    refreshModel: "retake anytime",
  }),
  {
    ...originalActive({
      methodId: "yorisou-motivation",
      nameJa: "動機リフレクション",
      nameEn: "Motivation reflection",
      family: "psychology_preference",
      role: "preference_reflection",
      requiredInputs: ["answers"],
      sensitiveInputs: ["answers"],
      model: "YORISOU-original motivation reflection",
      methodVersion: "motivation-v0.1",
      resultSchema: "motivation-result",
      reportSchema: "family-report:motivation",
      interpretationLimits: "動機の傾向。判定ではない。",
      refreshModel: "retake anytime",
    }),
    implementation: "in_progress",
    tests: "not_run", // original but CPV1 surface integration is contract-level (not yet public)
  },
] as const;

const BY_ID = new Map(CPV1_METHOD_UNIVERSE.map((m) => [m.methodId, m]));
export function getMethod(id: string): MethodRegistryEntry | undefined {
  return BY_ID.get(id);
}

// Methods that MAY be shown on a public route right now (gate passes).
export function publicMethods(): MethodRegistryEntry[] {
  return CPV1_METHOD_UNIVERSE.filter(methodPublicallyActivatable);
}

// Rights-blocked methods (never public; visible in dev preview only).
export function rightsBlockedMethods(): MethodRegistryEntry[] {
  return CPV1_METHOD_UNIVERSE.filter((m) => methodMaturity(m).rights !== "cleared");
}

// Dev-preview visibility (never in production).
export function devVisibleMethods(): MethodRegistryEntry[] {
  if (!isDevFlagOn("cpv1_method_universe_preview")) return [];
  return CPV1_METHOD_UNIVERSE.slice();
}
