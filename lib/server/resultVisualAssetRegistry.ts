import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";

import {
  buildResultVisualAssetRegistrySeed,
  buildResultVisualPromptPackage,
  buildResultVisualSpec,
  resolveResultVisualFamilyKey,
  type ResultVisualApprovalState,
  type ResultVisualAssetClass,
  type ResultVisualAssetRegistryRecord,
  type ResultVisualAssetSpecInput,
  type ResultVisualAssetResolution,
  type ResultVisualPublishState,
  type ResultVisualSurfaceTarget,
} from "@/lib/result/visual-asset-chain";

const REGISTRY_FILE = "result-visual-asset-registry.json";

type RegistryDocument = {
  schema_version: string;
  updated_at: string;
  records: ResultVisualAssetRegistryRecord[];
};

type RegisterDraftInput = ResultVisualAssetSpecInput & {
  assetClass: ResultVisualAssetClass;
  requestedBy: string;
  refreshCadence?: "daily" | "every_2_days" | "weekly" | null;
};

type ApproveInput = {
  assetId: string;
  reviewedBy: string;
  approvalState?: ResultVisualApprovalState;
  publishState?: ResultVisualPublishState;
};

type VariationRequestInput = {
  personaId: string;
  surfaceTarget: ResultVisualSurfaceTarget;
  assetClass: ResultVisualAssetClass;
  requestedBy: string;
  refreshCadence: "daily" | "every_2_days" | "weekly";
  campaignTag?: string | null;
};

const FAMILY_META = {
  dawn: {
    familyLabelJa: "朝の余白",
    familyLabelEn: "Morning space",
    memoryHookJa: "立ち上がりを、やわらかく整える。",
    memoryHookEn: "Set the morning in a softer way.",
    paletteHint: "sage-sand",
  },
  motion: {
    familyLabelJa: "切替の流れ",
    familyLabelEn: "Switching flow",
    memoryHookJa: "切り替えの速さが、負荷を軽くする。",
    memoryHookEn: "Faster switching keeps load lighter.",
    paletteHint: "sage-amber",
  },
  recovery: {
    familyLabelJa: "回復の静けさ",
    familyLabelEn: "Quiet recovery",
    memoryHookJa: "静かに戻すと、回復は深くなる。",
    memoryHookEn: "Quiet returns tend to recover deeper.",
    paletteHint: "sage-ivory",
  },
  boundary: {
    familyLabelJa: "境目の見極め",
    familyLabelEn: "Boundary check",
    memoryHookJa: "決める前に、境目が見える。",
    memoryHookEn: "You see the boundary before deciding.",
    paletteHint: "sage-rose",
  },
} as const;

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${randomBytes(4).toString("hex")}`;
}

function getDataDir() {
  if (process.env.YORISOU_DATA_DIR) {
    return process.env.YORISOU_DATA_DIR;
  }

  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    return path.join("/tmp", "yorisou-online-data");
  }

  return path.join(process.cwd(), "data");
}

function getRegistryPath() {
  return path.join(getDataDir(), REGISTRY_FILE);
}

async function ensureRegistrySeed() {
  const filePath = getRegistryPath();
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  try {
    await fs.access(filePath);
  } catch {
    const seed: RegistryDocument = {
      schema_version: "result_visual_asset_registry_v1",
      updated_at: nowIso(),
      records: buildResultVisualAssetRegistrySeed(),
    };
    await fs.writeFile(filePath, JSON.stringify(seed, null, 2) + "\n", "utf8");
  }
}

async function readRegistryDocument(): Promise<RegistryDocument> {
  await ensureRegistrySeed();
  const raw = await fs.readFile(getRegistryPath(), "utf8");
  const parsed = JSON.parse(raw || "{}") as Partial<RegistryDocument>;
  return {
    schema_version: parsed.schema_version || "result_visual_asset_registry_v1",
    updated_at: parsed.updated_at || nowIso(),
    records: Array.isArray(parsed.records) ? (parsed.records as ResultVisualAssetRegistryRecord[]) : buildResultVisualAssetRegistrySeed(),
  };
}

async function writeRegistryDocument(document: RegistryDocument) {
  await fs.mkdir(path.dirname(getRegistryPath()), { recursive: true });
  await fs.writeFile(getRegistryPath(), JSON.stringify(document, null, 2) + "\n", "utf8");
}

function buildRecordFromInput(input: RegisterDraftInput, state: ResultVisualApprovalState): ResultVisualAssetRegistryRecord {
  const surfaceTarget = input.surfaceTarget || "result_first_screen";
  const spec = buildResultVisualSpec({
    ...input,
    surfaceTarget,
    refreshMode: input.refreshCadence ? "refreshable_detail" : undefined,
  });
  const promptPackage = buildResultVisualPromptPackage(spec);
  const familyKey = resolveResultVisualFamilyKey(input.personaId);
  const assetId = createId(`result_visual_${familyKey}_${input.assetClass}`);
  const currentStaticPath = `/images/result-static/${familyKey}/${input.assetClass === "share_card" ? "share_card.svg" : `${input.assetClass}.svg`}`;

  return {
    asset_id: assetId,
    version: 1,
    persona_id: input.personaId,
    persona_family_key: familyKey,
    surface_target: surfaceTarget,
    asset_class: input.assetClass,
    visual_family: familyKey,
    prompt_hash: promptPackage.prompt_hash,
    provider: "static_pack",
    approval_state: state,
    publish_state: state === "approved_public" ? "published" : "draft",
    current_static_path: currentStaticPath,
    created_at: nowIso(),
    updated_at: nowIso(),
    created_by_agent: "Yorisou Visual Asset Agent Chain v1",
    reviewed_by: state === "draft" ? null : input.requestedBy,
    approved_at: state === "draft" ? null : nowIso(),
    retired_at: null,
    cooldown_state: {
      active: false,
      until: null,
      reason: null,
    },
    variation_key: `${familyKey}:${input.assetClass}:${surfaceTarget}:${state}`,
    refresh_cadence: input.refreshCadence || null,
    next_variation_hint: input.refreshCadence
      ? "Create the next approved variation with the same family memory hook and a small change in texture or crop."
      : null,
    notes: state === "draft" ? "Draft asset awaiting approval." : "Approved internal asset.",
    risk_note: spec.cultural_risk_notes,
    prompt_spec: spec,
    prompt_package: promptPackage,
  };
}

export async function listResultVisualAssetRecords() {
  const document = await readRegistryDocument();
  return document.records;
}

export async function getResultVisualAssetRecord(assetId: string) {
  const document = await readRegistryDocument();
  return document.records.find((record) => record.asset_id === assetId) || null;
}

export async function upsertResultVisualAssetRecord(record: ResultVisualAssetRegistryRecord) {
  const document = await readRegistryDocument();
  const index = document.records.findIndex((entry) => entry.asset_id === record.asset_id);
  const nextRecords =
    index >= 0 ? document.records.map((entry) => (entry.asset_id === record.asset_id ? record : entry)) : [...document.records, record];
  await writeRegistryDocument({
    schema_version: document.schema_version,
    updated_at: nowIso(),
    records: nextRecords,
  });
  return record;
}

export async function registerResultVisualAssetDraft(input: RegisterDraftInput) {
  const record = buildRecordFromInput(input, "draft");
  await upsertResultVisualAssetRecord(record);
  return record;
}

export async function approveResultVisualAsset(input: ApproveInput) {
  const existing = await getResultVisualAssetRecord(input.assetId);
  if (!existing) {
    return null;
  }

  const approvalState = input.approvalState || "approved_public";
  const publishState = input.publishState || (approvalState === "approved_public" ? "published" : "staged");
  const nextRecord: ResultVisualAssetRegistryRecord = {
    ...existing,
    approval_state: approvalState,
    publish_state: publishState,
    reviewed_by: input.reviewedBy,
    approved_at: approvalState === "retired" ? existing.approved_at : nowIso(),
    retired_at: approvalState === "retired" ? nowIso() : null,
    updated_at: nowIso(),
    cooldown_state:
      approvalState === "cooldown"
        ? {
            active: true,
            until: null,
            reason: "manual cooldown",
          }
        : existing.cooldown_state,
  };
  await upsertResultVisualAssetRecord(nextRecord);
  return nextRecord;
}

export async function requestNextResultVisualVariation(input: VariationRequestInput) {
  const record = await registerResultVisualAssetDraft({
    personaId: input.personaId,
    surfaceTarget: input.surfaceTarget,
    assetClass: input.assetClass,
    requestedBy: input.requestedBy,
    campaignTag: input.campaignTag || "result-visual-refresh",
    refreshCadence: input.refreshCadence,
  });

  return {
    request_id: createId("result_visual_variation"),
    asset_id: record.asset_id,
    status: "draft" as const,
    cadence: input.refreshCadence,
    next_variation_hint: record.next_variation_hint,
    prompt_spec: record.prompt_spec,
    prompt_package: record.prompt_package,
  };
}

export async function getResultVisualAssetResolution(input: ResultVisualAssetSpecInput): Promise<ResultVisualAssetResolution> {
  const document = await readRegistryDocument();
  const familyKey = resolveResultVisualFamilyKey(input.personaId);
  const matchingRecords = document.records.filter((record) => record.persona_family_key === familyKey);
  const approvedRecords = matchingRecords.filter((record) => record.approval_state === "approved_public");
  const publicRecords = approvedRecords;
  const fallbackRecords = publicRecords.length > 0 ? publicRecords : [];
  const spec = buildResultVisualSpec(input);
  const promptPackage = buildResultVisualPromptPackage(spec);
  const meta = FAMILY_META[familyKey];

  return {
    personaId: input.personaId,
    surfaceTarget: input.surfaceTarget || "result_first_screen",
    pack: {
      familyKey,
      familyLabelJa: meta.familyLabelJa,
      familyLabelEn: meta.familyLabelEn,
      crestSrc:
        fallbackRecords.find((record) => record.asset_class === "crest")?.current_static_path ||
        `/images/result-static/default/crest.svg`,
      heroSrc:
        fallbackRecords.find((record) => record.asset_class === "hero")?.current_static_path ||
        `/images/result-static/default/hero.svg`,
      shareSrc:
        fallbackRecords.find((record) => record.asset_class === "share_card")?.current_static_path ||
        `/images/result-static/default/share_card.svg`,
      motifSrc:
        fallbackRecords.find((record) => record.asset_class === "motif")?.current_static_path ||
        `/images/result-static/default/motif.svg`,
      memoryHookJa: meta.memoryHookJa,
      memoryHookEn: meta.memoryHookEn,
      paletteHint: meta.paletteHint,
      surfaceTarget: input.surfaceTarget || "result_first_screen",
      approvalState: fallbackRecords[0]?.approval_state || "draft",
      publishState: fallbackRecords[0]?.publish_state || "draft",
      registryRecordIds: fallbackRecords.map((record) => record.asset_id),
      promptHash: fallbackRecords[0]?.prompt_hash || promptPackage.prompt_hash,
      resolvedFrom: fallbackRecords.length > 0 ? "registry" : "fallback",
      visualSpec: fallbackRecords[0]?.prompt_spec || spec,
      promptPackage: fallbackRecords[0]?.prompt_package || promptPackage,
    },
    registryRecords: matchingRecords,
    primaryRegistryRecord: fallbackRecords.find((record) => record.asset_class === "hero") || fallbackRecords[0] || null,
    approvedPublic: fallbackRecords.length > 0 && fallbackRecords.every((record) => record.approval_state === "approved_public"),
  };
}

export async function ensureResultVisualAssetRegistrySeeded() {
  return readRegistryDocument();
}
