import type { MobilityKnowledgeObject, MobilityKnowledgeSignalType } from "@/lib/insights/types";

function normalizeText(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function dayDifference(startIso: string, endIso: string) {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.max(0, (end - start) / (1000 * 60 * 60 * 24));
}

export function inferMobilitySignalType(input: {
  text: string;
  productCategory: MobilityKnowledgeObject["product_category"];
}): MobilityKnowledgeSignalType {
  const text = normalizeText(input.text);

  if (/(accident|crash|collision|injury|fatal|recall|hazard|danger|safety incident|事故|危険|安全)/i.test(text)) {
    return "incident_signal";
  }
  if (/(policy|guideline|subsidy|regulation|strategy|plan|law|budget|制度|方針|政策|補助|計画)/i.test(text)) {
    return "policy_signal";
  }
  if (/(pilot|trial|demo|prototype|launch|rollout|smart|automated|connected|innovation|実証|試行|新型|スマート|自動運転|AI)/i.test(text)) {
    return "innovation_signal";
  }
  if (/(service|consultation|support program|program|project|サービス|相談|支援)/i.test(text)) {
    return "service_signal";
  }
  if (/(walker|rollator|foldable|portable|lightweight|device|product|aid|歩行器|折りたたみ|軽量|福祉用具)/i.test(text)) {
    return "product_intelligence";
  }
  if (/(older adults|elderly|senior|family|community|participation|accessibility|高齢|参加|無障碍|無障害|バリアフリー)/i.test(text)) {
    return "social_signal";
  }

  return input.productCategory === "mobility_policy" || input.productCategory === "mobility_infrastructure"
    ? "market_signal"
    : "product_intelligence";
}

export function scoreFreshness(input: {
  publishedAt?: string | null;
  updatedAt?: string | null;
  lastCheckedAt?: string | null;
}) {
  const now = new Date().toISOString();
  const reference = input.updatedAt || input.publishedAt || input.lastCheckedAt || now;
  const ageDays = dayDifference(reference, now);

  if (!Number.isFinite(ageDays)) {
    return 40;
  }
  if (ageDays <= 1) return 100;
  if (ageDays <= 3) return 92;
  if (ageDays <= 7) return 84;
  if (ageDays <= 14) return 74;
  if (ageDays <= 30) return 64;
  if (ageDays <= 90) return 52;
  if (ageDays <= 180) return 40;
  if (ageDays <= 365) return 28;
  return 18;
}

export function scoreUrgency(input: {
  signalType: MobilityKnowledgeSignalType;
  text: string;
  freshnessScore: number;
}) {
  const text = normalizeText(input.text);
  let score = 0;

  switch (input.signalType) {
    case "incident_signal":
      score += 72;
      break;
    case "policy_signal":
      score += 54;
      break;
    case "innovation_signal":
      score += 44;
      break;
    case "service_signal":
      score += 34;
      break;
    case "product_intelligence":
      score += 28;
      break;
    case "social_signal":
      score += 26;
      break;
    case "market_signal":
    default:
      score += 22;
      break;
  }

  if (/(deadline|effective immediately|starts on|today|this week|urgent|now|immediate|as soon as possible|至急|本日|開始|施行|今週)/i.test(text)) {
    score += 16;
  }
  if (/(safety|危険|事故|recall|fall|転倒|accessibility|barrier-free|バリアフリー)/i.test(text)) {
    score += 14;
  }
  if (/(subsidy|grant|budget|funding|support|補助|助成|支援)/i.test(text)) {
    score += 10;
  }
  if (input.freshnessScore >= 90) {
    score += 8;
  }
  if (input.freshnessScore <= 30) {
    score -= 10;
  }

  return clamp(score);
}

