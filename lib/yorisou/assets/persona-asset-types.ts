export type PersonaAssetStatus = "missing" | "placeholder" | "approved_static" | "needs_review";

export type PersonaAssetSource = "manual_upload" | "generated_candidate" | "fallback_css";

export type PersonaAssetRecord = {
  personaId: string;
  officialPublicPersonaName: string;
  portraitPath: string | null;
  crestPath: string | null;
  resultHeroPath: string | null;
  shareAccentPath: string | null;
  oracleMotifPath: string | null;
  videoThumbnailPath: string | null;
  status: PersonaAssetStatus;
  source: PersonaAssetSource;
  aspectRatio: "1:1" | "4:5" | "3:4" | "16:9";
  mobileSafe: boolean;
  riskNote: string;
};
