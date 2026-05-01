export type YorisouPersonaAssetKind =
  | "portrait"
  | "crest"
  | "result_hero"
  | "share_accent"
  | "oracle_motif"
  | "motion_seed";

export type YorisouPersonaAssetStatus =
  | "fallback_css"
  | "manual_candidate"
  | "needs_review"
  | "approved_static"
  | "rejected";

export type YorisouPersonaAssetRecord = {
  kind: YorisouPersonaAssetKind;
  status: YorisouPersonaAssetStatus;
  path: string | null;
  expectedPath: string;
};

export type YorisouPersonaAssetRegistryEntry = {
  personaId: "P01" | "P07" | "P09" | "P11" | "P02" | "P03" | "P19";
  slug: string;
  officialNameJa: string;
  structuralName: string;
  visualFamily: string;
  expectedAssetBase: string;
  assets: Record<YorisouPersonaAssetKind, YorisouPersonaAssetRecord>;
};

function createFallbackAsset(
  kind: YorisouPersonaAssetKind,
  expectedPath: string,
): YorisouPersonaAssetRecord {
  return {
    kind,
    status: "fallback_css",
    path: null,
    expectedPath,
  };
}

function createManualCandidateAsset(
  kind: YorisouPersonaAssetKind,
  assetPath: string,
): YorisouPersonaAssetRecord {
  return {
    kind,
    status: "manual_candidate",
    path: assetPath,
    expectedPath: assetPath,
  };
}

export const yorisouPersonaAssetRegistry = {
  P01: {
    personaId: "P01",
    slug: "kebaiyomi",
    officialNameJa: "気配読み",
    structuralName: "The Quiet Receiver",
    visualFamily: "tide_moon",
    expectedAssetBase: "P01_kebaiyomi",
    assets: {
      portrait: createManualCandidateAsset(
        "portrait",
        "/assets/yorisou/personas/portraits/P01_kebaiyomi_portrait_g00_core_v07.png",
      ),
      crest: createManualCandidateAsset(
        "crest",
        "/assets/yorisou/personas/crests/P01_kebaiyomi_crest_g00_core_v03.png",
      ),
      result_hero: createManualCandidateAsset(
        "result_hero",
        "/assets/yorisou/personas/result-heroes/P01_kebaiyomi_result_hero_g00_core_v01.png",
      ),
      share_accent: createManualCandidateAsset(
        "share_accent",
        "/assets/yorisou/personas/share-accents/P01_kebaiyomi_share_accent_g00_core_v01.png",
      ),
      oracle_motif: createManualCandidateAsset(
        "oracle_motif",
        "/assets/yorisou/personas/oracle-motifs/P01_kebaiyomi_oracle_motif_g00_core_v01.png",
      ),
      motion_seed: createFallbackAsset(
        "motion_seed",
        "/assets/yorisou/video-thumbnails/P01_kebaiyomi_motion_seed_g00_core_v01.png",
      ),
    },
  },
  P07: {
    personaId: "P07",
    slug: "kirigiri",
    officialNameJa: "霧切り",
    structuralName: "The Straight Blade",
    visualFamily: "mist_blade",
    expectedAssetBase: "P07_kirigiri",
    assets: {
      portrait: createFallbackAsset(
        "portrait",
        "/assets/yorisou/personas/portraits/P07_kirigiri_portrait_g00_core_v01.png",
      ),
      crest: createFallbackAsset(
        "crest",
        "/assets/yorisou/personas/crests/P07_kirigiri_crest_g00_core_v01.svg",
      ),
      result_hero: createFallbackAsset(
        "result_hero",
        "/assets/yorisou/personas/result-heroes/P07_kirigiri_result_hero_g00_core_v01.png",
      ),
      share_accent: createFallbackAsset(
        "share_accent",
        "/assets/yorisou/personas/share-accents/P07_kirigiri_share_accent_g00_core_v01.png",
      ),
      oracle_motif: createFallbackAsset(
        "oracle_motif",
        "/assets/yorisou/personas/oracle-motifs/P07_kirigiri_oracle_motif_g00_core_v01.svg",
      ),
      motion_seed: createFallbackAsset(
        "motion_seed",
        "/assets/yorisou/video-thumbnails/P07_kirigiri_motion_seed_g00_core_v01.png",
      ),
    },
  },
  P09: {
    personaId: "P09",
    slug: "koraekomi",
    officialNameJa: "堪え込み",
    structuralName: "The Reluctant Exploder",
    visualFamily: "mist_blade",
    expectedAssetBase: "P09_koraekomi",
    assets: {
      portrait: createFallbackAsset(
        "portrait",
        "/assets/yorisou/personas/portraits/P09_koraekomi_portrait_g00_core_v01.png",
      ),
      crest: createFallbackAsset(
        "crest",
        "/assets/yorisou/personas/crests/P09_koraekomi_crest_g00_core_v01.svg",
      ),
      result_hero: createFallbackAsset(
        "result_hero",
        "/assets/yorisou/personas/result-heroes/P09_koraekomi_result_hero_g00_core_v01.png",
      ),
      share_accent: createFallbackAsset(
        "share_accent",
        "/assets/yorisou/personas/share-accents/P09_koraekomi_share_accent_g00_core_v01.png",
      ),
      oracle_motif: createFallbackAsset(
        "oracle_motif",
        "/assets/yorisou/personas/oracle-motifs/P09_koraekomi_oracle_motif_g00_core_v01.svg",
      ),
      motion_seed: createFallbackAsset(
        "motion_seed",
        "/assets/yorisou/video-thumbnails/P09_koraekomi_motion_seed_g00_core_v01.png",
      ),
    },
  },
  P11: {
    personaId: "P11",
    slug: "dandori",
    officialNameJa: "段取り",
    structuralName: "The Measured Architect",
    visualFamily: "frame_garden",
    expectedAssetBase: "P11_dandori",
    assets: {
      portrait: createFallbackAsset(
        "portrait",
        "/assets/yorisou/personas/portraits/P11_dandori_portrait_g00_core_v01.png",
      ),
      crest: createFallbackAsset(
        "crest",
        "/assets/yorisou/personas/crests/P11_dandori_crest_g00_core_v01.svg",
      ),
      result_hero: createFallbackAsset(
        "result_hero",
        "/assets/yorisou/personas/result-heroes/P11_dandori_result_hero_g00_core_v01.png",
      ),
      share_accent: createFallbackAsset(
        "share_accent",
        "/assets/yorisou/personas/share-accents/P11_dandori_share_accent_g00_core_v01.png",
      ),
      oracle_motif: createFallbackAsset(
        "oracle_motif",
        "/assets/yorisou/personas/oracle-motifs/P11_dandori_oracle_motif_g00_core_v01.svg",
      ),
      motion_seed: createFallbackAsset(
        "motion_seed",
        "/assets/yorisou/video-thumbnails/P11_dandori_motion_seed_g00_core_v01.png",
      ),
    },
  },
  P02: {
    personaId: "P02",
    slug: "hitsuke",
    officialNameJa: "火つけ",
    structuralName: "The Visible Spark",
    visualFamily: "spark_flare",
    expectedAssetBase: "P02_hitsuke",
    assets: {
      portrait: createFallbackAsset(
        "portrait",
        "/assets/yorisou/personas/portraits/P02_hitsuke_portrait_g00_core_v01.png",
      ),
      crest: createFallbackAsset(
        "crest",
        "/assets/yorisou/personas/crests/P02_hitsuke_crest_g00_core_v01.svg",
      ),
      result_hero: createFallbackAsset(
        "result_hero",
        "/assets/yorisou/personas/result-heroes/P02_hitsuke_result_hero_g00_core_v01.png",
      ),
      share_accent: createFallbackAsset(
        "share_accent",
        "/assets/yorisou/personas/share-accents/P02_hitsuke_share_accent_g00_core_v01.png",
      ),
      oracle_motif: createFallbackAsset(
        "oracle_motif",
        "/assets/yorisou/personas/oracle-motifs/P02_hitsuke_oracle_motif_g00_core_v01.svg",
      ),
      motion_seed: createFallbackAsset(
        "motion_seed",
        "/assets/yorisou/video-thumbnails/P02_hitsuke_motion_seed_g00_core_v01.png",
      ),
    },
  },
  P03: {
    personaId: "P03",
    slug: "shizumoe",
    officialNameJa: "静燃え",
    structuralName: "The Hidden Fire",
    visualFamily: "tide_moon",
    expectedAssetBase: "P03_shizumoe",
    assets: {
      portrait: createFallbackAsset(
        "portrait",
        "/assets/yorisou/personas/portraits/P03_shizumoe_portrait_g00_core_v01.png",
      ),
      crest: createFallbackAsset(
        "crest",
        "/assets/yorisou/personas/crests/P03_shizumoe_crest_g00_core_v01.svg",
      ),
      result_hero: createFallbackAsset(
        "result_hero",
        "/assets/yorisou/personas/result-heroes/P03_shizumoe_result_hero_g00_core_v01.png",
      ),
      share_accent: createFallbackAsset(
        "share_accent",
        "/assets/yorisou/personas/share-accents/P03_shizumoe_share_accent_g00_core_v01.png",
      ),
      oracle_motif: createFallbackAsset(
        "oracle_motif",
        "/assets/yorisou/personas/oracle-motifs/P03_shizumoe_oracle_motif_g00_core_v01.svg",
      ),
      motion_seed: createFallbackAsset(
        "motion_seed",
        "/assets/yorisou/video-thumbnails/P03_shizumoe_motion_seed_g00_core_v01.png",
      ),
    },
  },
  P19: {
    personaId: "P19",
    slug: "anshinmachi",
    officialNameJa: "安心待ち",
    structuralName: "The Closeness Seeker",
    visualFamily: "tide_moon",
    expectedAssetBase: "P19_anshinmachi",
    assets: {
      portrait: createFallbackAsset(
        "portrait",
        "/assets/yorisou/personas/portraits/P19_anshinmachi_portrait_g00_core_v01.png",
      ),
      crest: createFallbackAsset(
        "crest",
        "/assets/yorisou/personas/crests/P19_anshinmachi_crest_g00_core_v01.svg",
      ),
      result_hero: createFallbackAsset(
        "result_hero",
        "/assets/yorisou/personas/result-heroes/P19_anshinmachi_result_hero_g00_core_v01.png",
      ),
      share_accent: createFallbackAsset(
        "share_accent",
        "/assets/yorisou/personas/share-accents/P19_anshinmachi_share_accent_g00_core_v01.png",
      ),
      oracle_motif: createFallbackAsset(
        "oracle_motif",
        "/assets/yorisou/personas/oracle-motifs/P19_anshinmachi_oracle_motif_g00_core_v01.svg",
      ),
      motion_seed: createFallbackAsset(
        "motion_seed",
        "/assets/yorisou/video-thumbnails/P19_anshinmachi_motion_seed_g00_core_v01.png",
      ),
    },
  },
} as const satisfies Record<string, YorisouPersonaAssetRegistryEntry>;

export type YorisouPersonaAssetRegistry = typeof yorisouPersonaAssetRegistry;
