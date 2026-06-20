import { createHash } from "crypto";

export type ResultVisualFamilyKey = "dawn" | "motion" | "recovery" | "boundary";
export type ResultVisualSurfaceTarget =
  | "result_first_screen"
  | "result_share_card"
  | "result_continue"
  | "result_continue_companion"
  | "result_return"
  | "entry_hero";
export type ResultVisualAssetClass = "crest" | "hero" | "share_card" | "motif";
export type ResultVisualApprovalState = "draft" | "approved_internal" | "approved_public" | "cooldown" | "retired";
export type ResultVisualPublishState = "draft" | "staged" | "published" | "held";
export type ResultVisualProvider = "static_pack" | "dry_run" | "gemini" | "openai" | "revid";

export type ResultVisualSpec = {
  persona_id: string;
  surface_target: ResultVisualSurfaceTarget;
  campaign_tag: string | null;
  visual_family: ResultVisualFamilyKey;
  myth_archetype_label: string;
  contemporary_label: string;
  functional_subtitle: string;
  hook_line: string;
  trait_chips: string[];
  motif_direction: string;
  symbolic_elements: string[];
  forbidden_elements: string[];
  palette_direction: string;
  composition_direction: string;
  surface_intent: string;
  tone_intensity: "soft" | "balanced" | "clear" | "sharp";
  image_ratio_target: "1:1" | "4:5" | "3:1" | "16:9";
  text_overlay_allowed: boolean;
  brand_fit_notes: string;
  cultural_risk_notes: string;
  refresh_mode: "stable_core" | "refreshable_detail";
};

export type ResultVisualPromptAsset = {
  asset_class: ResultVisualAssetClass;
  title: string;
  prompt: string;
  guardrails: string[];
  output_requirements: string[];
  ratio: ResultVisualSpec["image_ratio_target"];
};

export type ResultVisualPromptPackage = {
  prompt_hash: string;
  result_hero_prompt: string;
  crest_prompt: string;
  share_card_prompt: string;
  motif_prompt: string;
  entry_hero_prompt: string;
  guardrails: string[];
  output_requirements: string[];
  asset_prompts: Record<ResultVisualAssetClass, ResultVisualPromptAsset>;
};

export type ResultVisualCooldownState = {
  active: boolean;
  until: string | null;
  reason: string | null;
};

export type ResultVisualAssetRegistryRecord = {
  asset_id: string;
  version: number;
  persona_id: string;
  persona_family_key: ResultVisualFamilyKey;
  surface_target: ResultVisualSurfaceTarget;
  asset_class: ResultVisualAssetClass;
  visual_family: ResultVisualFamilyKey;
  prompt_hash: string;
  provider: ResultVisualProvider;
  approval_state: ResultVisualApprovalState;
  publish_state: ResultVisualPublishState;
  current_static_path: string;
  created_at: string;
  updated_at: string;
  created_by_agent: string;
  reviewed_by: string | null;
  approved_at: string | null;
  retired_at: string | null;
  cooldown_state: ResultVisualCooldownState;
  variation_key: string;
  refresh_cadence: "daily" | "every_2_days" | "weekly" | null;
  next_variation_hint: string | null;
  notes: string;
  risk_note: string;
  prompt_spec: ResultVisualSpec;
  prompt_package: ResultVisualPromptPackage;
};

export type ResultStaticPack = {
  familyKey: ResultVisualFamilyKey;
  familyLabelJa: string;
  familyLabelEn: string;
  crestSrc: string;
  heroSrc: string;
  shareSrc: string;
  motifSrc: string;
  memoryHookJa: string;
  memoryHookEn: string;
  paletteHint: string;
  surfaceTarget: ResultVisualSurfaceTarget;
  approvalState: ResultVisualApprovalState;
  publishState: ResultVisualPublishState;
  registryRecordIds: string[];
  promptHash: string;
  resolvedFrom: "registry" | "fallback";
  visualSpec: ResultVisualSpec;
  promptPackage: ResultVisualPromptPackage;
};

export type ResultVisualAssetResolution = {
  personaId: string;
  surfaceTarget: ResultVisualSurfaceTarget;
  pack: ResultStaticPack;
  registryRecords: ResultVisualAssetRegistryRecord[];
  primaryRegistryRecord: ResultVisualAssetRegistryRecord | null;
  approvedPublic: boolean;
};

export type ResultVisualChainInput = {
  personaId: string;
  surfaceTarget?: ResultVisualSurfaceTarget;
  campaignTag?: string | null;
  mythArchetypeLabel?: string | null;
  contemporaryLabel?: string | null;
  functionalSubtitle?: string | null;
  hookLine?: string | null;
  traitChips?: string[] | null;
  refreshMode?: ResultVisualSpec["refresh_mode"];
};

export type ResultVisualAssetSpecInput = ResultVisualChainInput;

type FamilyDefinition = {
  familyKey: ResultVisualFamilyKey;
  familyLabelJa: string;
  familyLabelEn: string;
  memoryHookJa: string;
  memoryHookEn: string;
  paletteHint: string;
  motifDirection: string;
  symbolicElements: string[];
  forbiddenElements: string[];
  paletteDirection: string;
  compositionDirection: string;
  toneIntensity: ResultVisualSpec["tone_intensity"];
  brandFitNotes: string;
  culturalRiskNotes: string;
  surfaceIntent: Record<ResultVisualSurfaceTarget, string>;
};

const DEFAULT_ASSET_ROOT = "/images/result-static/default";

const FAMILY_DEFINITIONS: Record<ResultVisualFamilyKey, FamilyDefinition> = {
  dawn: {
    familyKey: "dawn",
    familyLabelJa: "朝の余白",
    familyLabelEn: "Morning space",
    memoryHookJa: "立ち上がりを、やわらかく整える。",
    memoryHookEn: "Set the morning in a softer way.",
    paletteHint: "sage-sand",
    motifDirection: "first light, open threshold, quiet departure",
    symbolicElements: ["first light", "clear threshold", "departure order", "soft horizon"],
    forbiddenElements: ["hard neon", "busy collage", "literal shrine icon", "anime contour"],
    paletteDirection: "sage / sand / ivory / warm stone",
    compositionDirection: "vertical reveal with a calm open field",
    toneIntensity: "soft",
    brandFitNotes: "Modern Japanese, gentle but decisive, and suitable for a conclusion-first result screen.",
    culturalRiskNotes: "Avoid literal sun motifs that read like national symbol mimicry and avoid overdecorated shrine cues.",
    surfaceIntent: {
      result_first_screen: "one-screen conclusion reveal with a stable visual anchor",
      result_share_card: "shareable reveal card with a single memory hook",
      result_continue: "light follow-up frame that keeps the result warm",
      result_continue_companion: "quiet confirmation step that stays close to the reveal",
      result_return: "return path that feels like a gentle revisit",
      entry_hero: "landing support that feels premium and welcoming",
    },
  },
  motion: {
    familyKey: "motion",
    familyLabelJa: "切替の流れ",
    familyLabelEn: "Switching flow",
    memoryHookJa: "切り替えの速さが、負荷を軽くする。",
    memoryHookEn: "Faster switching keeps load lighter.",
    paletteHint: "sage-amber",
    motifDirection: "transition lines, fast handoff, clear turn",
    symbolicElements: ["transition line", "handoff rhythm", "light turn", "moving frame"],
    forbiddenElements: ["shaky neon", "game HUD clutter", "fantasy sword motifs", "pixel noise"],
    paletteDirection: "sage / amber / cream / slate",
    compositionDirection: "angled flow with a clean destination point",
    toneIntensity: "balanced",
    brandFitNotes: "Feels operational and commercially legible without looking like a tool UI.",
    culturalRiskNotes: "Keep motion restrained so it does not drift into trendy app illustration noise.",
    surfaceIntent: {
      result_first_screen: "result reveal with a cleaner turn and visible momentum",
      result_share_card: "share card with a crisp social punch",
      result_continue: "follow-up frame that suggests the next movement",
      result_continue_companion: "compact continuation with clear action hierarchy",
      result_return: "revisit path with controlled motion and less drift",
      entry_hero: "entry hero that signals quick, light engagement",
    },
  },
  recovery: {
    familyKey: "recovery",
    familyLabelJa: "回復の静けさ",
    familyLabelEn: "Quiet recovery",
    memoryHookJa: "静かに戻すと、回復は深くなる。",
    memoryHookEn: "Quiet returns tend to recover deeper.",
    paletteHint: "sage-ivory",
    motifDirection: "resting air, soft return, gentle containment",
    symbolicElements: ["resting air", "contained horizon", "quiet return", "slow breathing"],
    forbiddenElements: ["clinical overlays", "harsh contrast", "overbuilt UI frames", "melodrama"],
    paletteDirection: "ivory / pale sage / muted clay / soft moss",
    compositionDirection: "center-weighted calm with soft margins",
    toneIntensity: "soft",
    brandFitNotes: "Supports recovery and return without becoming therapeutic or clinical.",
    culturalRiskNotes: "Avoid hospital-like cues, wellness clichés, and overly soft pastel collapse.",
    surfaceIntent: {
      result_first_screen: "conclusion with a softer landing and immediate calm",
      result_share_card: "share card that feels warm and settled",
      result_continue: "gentle next step with low-friction reading",
      result_continue_companion: "confirmation step with a quiet rhythm",
      result_return: "return path that feels restorative rather than repetitive",
      entry_hero: "welcome frame that feels reassuring and low-pressure",
    },
  },
  boundary: {
    familyKey: "boundary",
    familyLabelJa: "境目の見極め",
    familyLabelEn: "Boundary check",
    memoryHookJa: "決める前に、境目が見える。",
    memoryHookEn: "You see the boundary before deciding.",
    paletteHint: "sage-rose",
    motifDirection: "threshold markers, clear edge, decision line",
    symbolicElements: ["threshold marker", "decision line", "edge clarity", "contained field"],
    forbiddenElements: ["alarm red", "chaotic graph noise", "ornate fantasy frame", "overly literal symbols"],
    paletteDirection: "sage / rose beige / paper white / muted copper",
    compositionDirection: "clear front edge with one decisive focal plane",
    toneIntensity: "clear",
    brandFitNotes: "Fits the founder decision surface and keeps the result legible as a choice point.",
    culturalRiskNotes: "Do not overstate drama or make it look like a risk dashboard.",
    surfaceIntent: {
      result_first_screen: "result reveal with a crisp decision edge",
      result_share_card: "share card with a memorable threshold cue",
      result_continue: "follow-up frame that clarifies the next decision",
      result_continue_companion: "decision support view with a tight hierarchy",
      result_return: "return path that keeps the boundary readable",
      entry_hero: "entry hero that feels decisive but still warm",
    },
  },
};

const ASSET_RATIO_BY_CLASS: Record<ResultVisualAssetClass, ResultVisualSpec["image_ratio_target"]> = {
  crest: "1:1",
  hero: "4:5",
  share_card: "1:1",
  motif: "3:1",
};

const ASSET_PATH_BY_CLASS: Record<ResultVisualAssetClass, string> = {
  crest: "crest.svg",
  hero: "hero.svg",
  share_card: "share_card.svg",
  motif: "motif.svg",
};

function normalizePersonaIndex(personaId: string) {
  const match = /P(\d{2})/.exec(personaId || "");
  if (!match) {
    return 1;
  }

  const parsed = Number(match[1]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function resolveResultVisualFamilyKey(personaId: string): ResultVisualFamilyKey {
  const index = normalizePersonaIndex(personaId);
  return index <= 8 ? "dawn" : index <= 16 ? "motion" : index <= 24 ? "recovery" : "boundary";
}

function nowIso() {
  return new Date().toISOString();
}

function hashPromptPackage(promptPackage: ResultVisualPromptPackage) {
  const hash = createHash("sha256");
  hash.update(JSON.stringify(promptPackage));
  return hash.digest("hex");
}

function normalizeTraitChips(traitChips: string[] | null | undefined) {
  const items = (traitChips || []).map((item) => item.trim()).filter(Boolean);
  return items.length > 0 ? items.slice(0, 3) : [];
}

export function buildResultVisualSpec(input: ResultVisualAssetSpecInput): ResultVisualSpec {
  const familyKey = resolveResultVisualFamilyKey(input.personaId);
  const family = FAMILY_DEFINITIONS[familyKey];
  const surfaceTarget = input.surfaceTarget || "result_first_screen";
  const traitChips = normalizeTraitChips(input.traitChips);
  const mythArchetypeLabel = (input.mythArchetypeLabel || family.familyLabelJa).trim();
  const contemporaryLabel = (input.contemporaryLabel || family.memoryHookJa).trim();
  const functionalSubtitle = (input.functionalSubtitle || family.memoryHookJa).trim();
  const hookLine = (input.hookLine || family.memoryHookJa).trim();

  return {
    persona_id: input.personaId,
    surface_target: surfaceTarget,
    campaign_tag: input.campaignTag || null,
    visual_family: familyKey,
    myth_archetype_label: mythArchetypeLabel,
    contemporary_label: contemporaryLabel,
    functional_subtitle: functionalSubtitle,
    hook_line: hookLine,
    trait_chips: traitChips,
    motif_direction: family.motifDirection,
    symbolic_elements: [...family.symbolicElements, ...traitChips].slice(0, 6),
    forbidden_elements: family.forbiddenElements,
    palette_direction: family.paletteDirection,
    composition_direction: family.compositionDirection,
    surface_intent: family.surfaceIntent[surfaceTarget],
    tone_intensity: family.toneIntensity,
    image_ratio_target:
      surfaceTarget === "result_share_card" ? "1:1" : surfaceTarget === "result_continue" || surfaceTarget === "result_continue_companion" ? "4:5" : surfaceTarget === "entry_hero" ? "4:5" : "4:5",
    text_overlay_allowed: false,
    brand_fit_notes: family.brandFitNotes,
    cultural_risk_notes: family.culturalRiskNotes,
    refresh_mode: input.refreshMode || (surfaceTarget === "result_first_screen" ? "stable_core" : "refreshable_detail"),
  };
}

function buildAssetPrompt(spec: ResultVisualSpec, assetClass: ResultVisualAssetClass) {
  const titleByClass: Record<ResultVisualAssetClass, string> = {
    crest: "Crest / seal",
    hero: "Primary hero",
    share_card: "Share card",
    motif: "Motif / background",
  };

  const classFocusByClass: Record<ResultVisualAssetClass, string> = {
    crest: "a compact seal with restrained symbolism and collectible clarity",
    hero: "a full first-screen anchor with a strong climax and spacious framing",
    share_card: "a square share-safe image with one clear memory hook",
    motif: "a wide background rhythm that supports cropping and layering",
  };

  const overlayLine = spec.text_overlay_allowed
    ? "Allow only minimal text overlay and keep it legible on mobile."
    : "Do not place text inside the artwork; the UI layer will carry the labels.";

  const prompt = [
    "Yorisou governed visual direction.",
    `Asset class: ${assetClass}`,
    `Visual family: ${spec.visual_family}`,
    `Surface target: ${spec.surface_target}`,
    `Surface intent: ${spec.surface_intent}`,
    `Myth / archetype label: ${spec.myth_archetype_label}`,
    `Contemporary label: ${spec.contemporary_label}`,
    `Functional subtitle: ${spec.functional_subtitle}`,
    `Hook line: ${spec.hook_line}`,
    `Trait chips: ${spec.trait_chips.join(" / ") || "none"}`,
    `Motif direction: ${spec.motif_direction}`,
    `Symbolic elements: ${spec.symbolic_elements.join(", ")}`,
    `Forbidden elements: ${spec.forbidden_elements.join(", ")}`,
    `Palette direction: ${spec.palette_direction}`,
    `Composition direction: ${spec.composition_direction}`,
    `Tone intensity: ${spec.tone_intensity}`,
    `Brand fit notes: ${spec.brand_fit_notes}`,
    `Cultural risk notes: ${spec.cultural_risk_notes}`,
    classFocusByClass[assetClass],
    overlayLine,
    "Keep the result commercial, modern Japanese, elegant, screenshot-safe, and mobile-readable.",
    "Do not drift into anime fan-art, fake mystical decoration, generic SaaS art, or lore-heavy fantasy imagery.",
  ].join("\n");

  return {
    asset_class: assetClass,
    title: titleByClass[assetClass],
    prompt,
    guardrails: [
      "no anime fan-art drift",
      "no fake shrine brochure literalism",
      "no public multi-agent cues",
      "no overexplained text inside artwork",
      "no generic stock background noise",
      "mobile-safe and screenshot-safe composition only",
    ],
    output_requirements: [
      "single clear visual anchor",
      "croppable for mobile",
      "commercial reveal logic",
      "brand-appropriate restraint",
    ],
    ratio: ASSET_RATIO_BY_CLASS[assetClass],
  } satisfies ResultVisualPromptAsset;
}

export function buildResultVisualPromptPackage(spec: ResultVisualSpec): ResultVisualPromptPackage {
  const asset_prompts: Record<ResultVisualAssetClass, ResultVisualPromptAsset> = {
    crest: buildAssetPrompt(spec, "crest"),
    hero: buildAssetPrompt(spec, "hero"),
    share_card: buildAssetPrompt(spec, "share_card"),
    motif: buildAssetPrompt(spec, "motif"),
  };

  const promptPackage = {
    prompt_hash: "",
    result_hero_prompt: asset_prompts.hero.prompt,
    crest_prompt: asset_prompts.crest.prompt,
    share_card_prompt: asset_prompts.share_card.prompt,
    motif_prompt: asset_prompts.motif.prompt,
    entry_hero_prompt: [
      "Yorisou entry hero direction.",
      `Visual family: ${spec.visual_family}`,
      `Surface target: ${spec.surface_target === "entry_hero" ? spec.surface_target : "entry_hero"}`,
      `Brand fit: ${spec.brand_fit_notes}`,
      "Create a warm premium landing visual that feels welcoming, not promotional noise.",
    ].join("\n"),
    guardrails: asset_prompts.hero.guardrails,
    output_requirements: asset_prompts.hero.output_requirements,
    asset_prompts,
  } satisfies ResultVisualPromptPackage;

  return {
    ...promptPackage,
    prompt_hash: hashPromptPackage(promptPackage),
  };
}

function familyRootPath(familyKey: ResultVisualFamilyKey) {
  return `/images/result-static/${familyKey}`;
}

function buildStaticPath(familyKey: ResultVisualFamilyKey, assetClass: ResultVisualAssetClass) {
  return `${familyRootPath(familyKey)}/${ASSET_PATH_BY_CLASS[assetClass]}`;
}

export function buildResultVisualAssetRegistrySeed(): ResultVisualAssetRegistryRecord[] {
  const familySeeds: Array<{ personaId: string; familyKey: ResultVisualFamilyKey; surfaceTarget: ResultVisualSurfaceTarget }> = [
    { personaId: "P01", familyKey: "dawn", surfaceTarget: "result_first_screen" },
    { personaId: "P09", familyKey: "motion", surfaceTarget: "result_first_screen" },
    { personaId: "P17", familyKey: "recovery", surfaceTarget: "result_first_screen" },
    { personaId: "P25", familyKey: "boundary", surfaceTarget: "result_first_screen" },
  ];

  const records: ResultVisualAssetRegistryRecord[] = [];
  const createdAt = "2026-04-21T00:00:00.000Z";

  for (const familySeed of familySeeds) {
    const family = FAMILY_DEFINITIONS[familySeed.familyKey];
    const spec = buildResultVisualSpec({
      personaId: familySeed.personaId,
      surfaceTarget: familySeed.surfaceTarget,
      campaignTag: "static-pack-first",
      mythArchetypeLabel: family.familyLabelJa,
      contemporaryLabel: family.memoryHookJa,
      functionalSubtitle: family.memoryHookJa,
      hookLine: family.memoryHookJa,
      traitChips: ["安定", "品位", "可読性"],
      refreshMode: "stable_core",
    });
    const promptPackage = buildResultVisualPromptPackage(spec);
    for (const assetClass of Object.keys(ASSET_PATH_BY_CLASS) as ResultVisualAssetClass[]) {
      const assetId = `result_visual_${familySeed.familyKey}_${assetClass}_v1`;
      records.push({
        asset_id: assetId,
        version: 1,
        persona_id: familySeed.personaId,
        persona_family_key: familySeed.familyKey,
        surface_target:
          assetClass === "share_card" ? "result_share_card" : familySeed.surfaceTarget,
        asset_class: assetClass,
        visual_family: familySeed.familyKey,
        prompt_hash: promptPackage.prompt_hash,
        provider: "static_pack",
        approval_state: "approved_public",
        publish_state: "published",
        current_static_path: buildStaticPath(familySeed.familyKey, assetClass),
        created_at: createdAt,
        updated_at: createdAt,
        created_by_agent: "Yorisou Visual Asset Agent Chain v1",
        reviewed_by: "launch-closure",
        approved_at: createdAt,
        retired_at: null,
        cooldown_state: {
          active: false,
          until: null,
          reason: null,
        },
        variation_key: `${familySeed.familyKey}:${assetClass}:stable`,
        refresh_cadence: assetClass === "hero" ? "weekly" : assetClass === "share_card" ? "every_2_days" : "daily",
        next_variation_hint: "Create one approved variation that preserves the same family memory hook and improves the current shot.",
        notes: `Seeded static-pack placeholder for ${family.familyLabelJa}.`,
        risk_note: family.culturalRiskNotes || "Keep cultural fit restrained and product-first.",
        prompt_spec: spec,
        prompt_package: promptPackage,
      });
    }
  }

  return records;
}

export function resolveResultVisualAssetChain(input: ResultVisualChainInput): ResultVisualAssetResolution {
  const personaId = input.personaId || "P01";
  const surfaceTarget = input.surfaceTarget || "result_first_screen";
  const familyKey = resolveResultVisualFamilyKey(personaId);
  const family = FAMILY_DEFINITIONS[familyKey];
  const spec = buildResultVisualSpec({
    ...input,
    personaId,
    surfaceTarget,
  });
  const promptPackage = buildResultVisualPromptPackage(spec);
  const seedRecords = buildResultVisualAssetRegistrySeed().filter((record) => record.persona_family_key === familyKey);
  const approvedRecords = seedRecords.filter((record) => record.approval_state === "approved_public");
  const registryRecords = approvedRecords.length > 0 ? approvedRecords : [];
  const primaryRegistryRecord =
    registryRecords.find((record) => record.asset_class === "hero") ||
    registryRecords.find((record) => record.asset_class === "crest") ||
    registryRecords[0] ||
    null;

  const pack: ResultStaticPack = {
    familyKey,
    familyLabelJa: family.familyLabelJa,
    familyLabelEn: family.familyLabelEn,
    crestSrc:
      registryRecords.find((record) => record.asset_class === "crest")?.current_static_path ||
      buildStaticPath(familyKey, "crest"),
    heroSrc:
      registryRecords.find((record) => record.asset_class === "hero")?.current_static_path ||
      buildStaticPath(familyKey, "hero"),
    shareSrc:
      registryRecords.find((record) => record.asset_class === "share_card")?.current_static_path ||
      buildStaticPath(familyKey, "share_card"),
    motifSrc:
      registryRecords.find((record) => record.asset_class === "motif")?.current_static_path ||
      buildStaticPath(familyKey, "motif"),
    memoryHookJa: family.memoryHookJa,
    memoryHookEn: family.memoryHookEn,
    paletteHint: family.paletteHint,
    surfaceTarget,
    approvalState: primaryRegistryRecord?.approval_state || "draft",
    publishState: primaryRegistryRecord?.publish_state || "draft",
    registryRecordIds: registryRecords.map((record) => record.asset_id),
    promptHash: promptPackage.prompt_hash,
    resolvedFrom: registryRecords.length > 0 ? "registry" : "fallback",
    visualSpec: spec,
    promptPackage,
  };

  return {
    personaId,
    surfaceTarget,
    pack,
    registryRecords,
    primaryRegistryRecord,
    approvedPublic: registryRecords.length > 0 && registryRecords.every((record) => record.approval_state === "approved_public"),
  };
}

export function buildResultVisualRefreshRequest(input: {
  personaId: string;
  surfaceTarget: ResultVisualSurfaceTarget;
  cadence: "daily" | "every_2_days" | "weekly";
  requestedBy: string;
  campaignTag?: string | null;
}) {
  const familyKey = resolveResultVisualFamilyKey(input.personaId);
  const spec = buildResultVisualSpec({
    personaId: input.personaId,
    surfaceTarget: input.surfaceTarget,
    campaignTag: input.campaignTag || "refresh-request",
    traitChips: ["安定", "品位", "可読性"],
    refreshMode: input.surfaceTarget === "result_first_screen" ? "stable_core" : "refreshable_detail",
  });

  return {
    request_id: `result_visual_refresh_${familyKey}_${Date.now()}`,
    persona_id: input.personaId,
    family_key: familyKey,
    surface_target: input.surfaceTarget,
    cadence: input.cadence,
    requested_by: input.requestedBy,
    status: "draft" as const,
    prompt_spec: spec,
    next_variation_hint:
      input.cadence === "daily"
        ? "Keep the same family, but refresh the supporting textures and spacing while preserving the core result memory."
        : input.cadence === "every_2_days"
          ? "Refresh the hero rhythm and background grammar without changing the main result memory."
          : "Refresh the hero and share-card pair while preserving the stable core result identity.",
  };
}

export function getResultVisualChainDebugSummary(input: ResultVisualChainInput) {
  const resolution = resolveResultVisualAssetChain(input);
  return {
    personaId: resolution.personaId,
    surfaceTarget: resolution.surfaceTarget,
    familyKey: resolution.pack.familyKey,
    approvalState: resolution.pack.approvalState,
    publishState: resolution.pack.publishState,
    resolvedFrom: resolution.pack.resolvedFrom,
    registryRecordIds: resolution.pack.registryRecordIds,
    promptHash: resolution.pack.promptHash,
    visualSpec: resolution.pack.visualSpec,
    promptPackage: resolution.pack.promptPackage,
    assetPaths: {
      crest: resolution.pack.crestSrc,
      hero: resolution.pack.heroSrc,
      share: resolution.pack.shareSrc,
      motif: resolution.pack.motifSrc,
    },
    approvedPublic: resolution.approvedPublic,
  };
}

export const RESULT_STATIC_ASSET_SPECS = {
  crest: {
    ratio: "1:1",
    file: `${DEFAULT_ASSET_ROOT}/crest.svg`,
    purpose: "seal / crest slot",
  },
  hero: {
    ratio: "4:5",
    file: `${DEFAULT_ASSET_ROOT}/hero.svg`,
    purpose: "primary hero visual slot",
  },
  share: {
    ratio: "1:1",
    file: `${DEFAULT_ASSET_ROOT}/share_card.svg`,
    purpose: "share-card visual slot",
  },
  motif: {
    ratio: "3:1",
    file: `${DEFAULT_ASSET_ROOT}/motif.svg`,
    purpose: "motif / background grammar slot",
  },
} as const;
