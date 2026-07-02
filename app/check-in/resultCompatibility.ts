import {
  PUBLIC_RESULT_CURRENT_STATE_NOTE,
  PUBLIC_RESULT_MAPPING_VERSION,
  findPublicArchetypeContentByCode,
  findPublicArchetypeByCode,
  type PublicResultHighlight,
  type PublicResultAssignment,
} from "@/lib/yorisou/public-result";

export type PublicResultConfidenceBand = "low" | "medium";

export type PublicResultRouteContext = {
  resultId?: string | null;
  overlayId?: string | null;
  confidenceBand?: PublicResultConfidenceBand | null;
  payloadKey?: string | null;
};

export type Temporary120QResultCompatibility = {
  resultStatus: "assigned" | "placeholder_ready" | "placeholder_pending";
  resultVersion: "phase-4c-2";
  sourceModel: "yorisou-120q";
  taxonomyStatus: typeof PUBLIC_RESULT_MAPPING_VERSION | "RESULT_PENDING_PUBLIC_RESULT";
  assignment: PublicResultAssignment | null;
  brandedTestName: "いま色テスト by よりそう";
  testName: "いま色テスト";
  description: "今の動き方を、24の色と名前で見てみるテスト。120Qをもとにしています。";
  headline: string;
  subheadline: string;
  displayLine: string;
  codeLine: string | null;
  recognitionLine: string;
  highlights: PublicResultHighlight[];
  gentleNextStep: string;
  currentStateNote: typeof PUBLIC_RESULT_CURRENT_STATE_NOTE;
  shareLine: string;
  globalNote: "結果は固定タイプではなく、今の動き方です。";
  ctaLabel: "いま色テストをはじめる";
  loadingLine: "24の色から、今の動き方を照らしています。";
  heroChips: string[];
  placeholderText: string;
};

export const RESULT_PENDING_PUBLIC_RESULT = "RESULT_PENDING_PUBLIC_RESULT" as const;
export const PUBLIC_RESULT_GLOBAL_NOTE = "結果は固定タイプではなく、今の動き方です。" as const;
export const PUBLIC_RESULT_TEST_NAME = "いま色テスト" as const;
export const PUBLIC_RESULT_BRANDED_TEST_NAME = "いま色テスト by よりそう" as const;
export const PUBLIC_RESULT_DESCRIPTION =
  "今の動き方を、24の色と名前で見てみるテスト。120Qをもとにしています。" as const;
export const PUBLIC_RESULT_HEADLINE = "今のあなたの“いま色”を見てみる" as const;
export const PUBLIC_RESULT_SUBHEADLINE =
  "結果は固定タイプではなく、120Qから見た今の動き方です。" as const;
export const PUBLIC_RESULT_CTA_LABEL = "いま色テストをはじめる" as const;
export const PUBLIC_RESULT_LOADING_LINE =
  "24の色から、今の動き方を照らしています。" as const;
export const PUBLIC_RESULT_PREPARING_NOTE =
  "結果の整理に少し時間が必要です。もう一度結果ページを開くと、今の見え方を確認できます。" as const;

const PLACEHOLDER_HIGHLIGHTS = [
  {
    label: "見え方",
    text: "今の動き方を、公開できる範囲でやわらかく整理しています。",
  },
  {
    label: "次の一歩",
    text: "少し時間を置いてから、結果のページをもう一度開いてみてください。",
  },
] as const;

const PLACEHOLDER_NEXT_STEP =
  "今日は、気になった感触をひとつだけメモしてから戻ってきてください。" as const;

function buildBaseCompatibility() {
  return {
    resultVersion: "phase-4c-2" as const,
    sourceModel: "yorisou-120q" as const,
    brandedTestName: PUBLIC_RESULT_BRANDED_TEST_NAME,
    testName: PUBLIC_RESULT_TEST_NAME,
    description: PUBLIC_RESULT_DESCRIPTION,
    currentStateNote: PUBLIC_RESULT_CURRENT_STATE_NOTE,
    globalNote: PUBLIC_RESULT_GLOBAL_NOTE,
    ctaLabel: PUBLIC_RESULT_CTA_LABEL,
    loadingLine: PUBLIC_RESULT_LOADING_LINE,
  };
}

export function buildPublicResultSearchParams(context: PublicResultRouteContext) {
  const params = new URLSearchParams();

  if (context.resultId) {
    params.set("resultId", context.resultId);
  }

  if (context.overlayId) {
    params.set("overlayId", context.overlayId);
  }

  if (context.confidenceBand) {
    params.set("confidence", context.confidenceBand);
  }

  if (context.payloadKey) {
    params.set("payloadKey", context.payloadKey);
  }

  return params.toString();
}

export function buildPublicResultHref(pathname: string, context: PublicResultRouteContext) {
  const query = buildPublicResultSearchParams(context);
  return query ? `${pathname}?${query}` : pathname;
}

export function getTemporary120QResultCompatibility(
  context: PublicResultRouteContext,
): Temporary120QResultCompatibility {
  const hasResultContext = Boolean(context.resultId || context.overlayId || context.payloadKey);
  const assignment = findPublicArchetypeByCode(context.resultId);
  const content = findPublicArchetypeContentByCode(context.resultId);

  if (assignment) {
    return {
      ...buildBaseCompatibility(),
      resultStatus: "assigned",
      taxonomyStatus: assignment.mappingVersion,
      assignment,
      headline: `あなたのいま色は、${assignment.nickname}。`,
      subheadline: PUBLIC_RESULT_SUBHEADLINE,
      displayLine: `あなたのいま色は、${assignment.nickname}。`,
      codeLine: `${assignment.clanEnglish} / ${assignment.publicCode}`,
      recognitionLine:
        content?.recognitionLine ||
        `${assignment.nickname}らしい今の動き方が、やわらかく表れています。`,
      highlights: content?.highlights ? [...content.highlights] : [],
      gentleNextStep: content?.gentleNextStep || PLACEHOLDER_NEXT_STEP,
      shareLine: content?.shareLine || `私は${assignment.nickname}。あなたは？`,
      heroChips: [assignment.clanJapanese, assignment.secondaryBadge, assignment.publicCode],
      placeholderText: PUBLIC_RESULT_GLOBAL_NOTE,
    };
  }

  return {
    ...buildBaseCompatibility(),
    resultStatus: hasResultContext ? "placeholder_ready" : "placeholder_pending",
    taxonomyStatus: RESULT_PENDING_PUBLIC_RESULT,
    assignment: null,
    headline: PUBLIC_RESULT_HEADLINE,
    subheadline: PUBLIC_RESULT_SUBHEADLINE,
    displayLine: PUBLIC_RESULT_HEADLINE,
    codeLine: null,
    recognitionLine: PUBLIC_RESULT_PREPARING_NOTE,
    highlights: [...PLACEHOLDER_HIGHLIGHTS],
    gentleNextStep: PLACEHOLDER_NEXT_STEP,
    shareLine: "私はどんな“いま色”になる？",
    heroChips: ["120問ベース", "今の動き方", "準備中"],
    placeholderText: PUBLIC_RESULT_PREPARING_NOTE,
  };
}
