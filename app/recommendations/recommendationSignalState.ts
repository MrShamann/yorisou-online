export const YORISOU_RECOMMENDATION_SIGNAL_KEY = "yorisou.recommendationSignal.v0_2";
const YORISOU_RECOMMENDATION_SIGNAL_EVENT = "yorisou:recommendation-signal-updated";

export type RecommendationSignalValue =
  | "self-understanding-reading"
  | "distance-and-relationships"
  | "work-and-learning-rhythm"
  | "rest-and-recovery"
  | "none-right-now";

export type RecommendationSignalRecord = {
  submittedAt: string;
  selectedSignal: RecommendationSignalValue;
  source: "local-browser";
  version: "v0.2";
  path: "/recommendations";
  resultId?: string;
  overlayId?: string;
  confidenceBand?: "low" | "medium";
  payloadKey?: string;
};

let cachedRecommendationSignalRaw: string | null = null;
let cachedRecommendationSignalParsed: RecommendationSignalRecord | null = null;

function parseRecommendationSignal(rawValue: string | null): RecommendationSignalRecord | null {
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<RecommendationSignalRecord>;
    if (
      parsed &&
      typeof parsed.submittedAt === "string" &&
      typeof parsed.selectedSignal === "string" &&
      parsed.source === "local-browser" &&
      parsed.version === "v0.2" &&
      parsed.path === "/recommendations"
    ) {
      const record: RecommendationSignalRecord = {
        submittedAt: parsed.submittedAt,
        selectedSignal: parsed.selectedSignal as RecommendationSignalValue,
        source: parsed.source,
        version: parsed.version,
        path: parsed.path,
      };

      if (typeof parsed.resultId === "string") {
        record.resultId = parsed.resultId;
      }

      if (typeof parsed.overlayId === "string") {
        record.overlayId = parsed.overlayId;
      }

      if (parsed.confidenceBand === "low" || parsed.confidenceBand === "medium") {
        record.confidenceBand = parsed.confidenceBand;
      }

      if (typeof parsed.payloadKey === "string") {
        record.payloadKey = parsed.payloadKey;
      }

      return record;
    }
  } catch {
    return null;
  }

  return null;
}

function syncRecommendationSignalSnapshot(rawValue: string | null) {
  if (rawValue === cachedRecommendationSignalRaw) {
    return cachedRecommendationSignalParsed;
  }

  cachedRecommendationSignalRaw = rawValue;
  cachedRecommendationSignalParsed = parseRecommendationSignal(rawValue);
  return cachedRecommendationSignalParsed;
}

export function saveRecommendationSignal(record: RecommendationSignalRecord) {
  if (typeof window === "undefined") {
    return;
  }

  const rawValue = JSON.stringify(record);
  window.localStorage.setItem(YORISOU_RECOMMENDATION_SIGNAL_KEY, rawValue);
  syncRecommendationSignalSnapshot(rawValue);
  window.dispatchEvent(new Event(YORISOU_RECOMMENDATION_SIGNAL_EVENT));
}

export function readRecommendationSignal(): RecommendationSignalRecord | null {
  if (typeof window === "undefined") {
    return cachedRecommendationSignalParsed;
  }

  const rawValue = window.localStorage.getItem(YORISOU_RECOMMENDATION_SIGNAL_KEY);
  return syncRecommendationSignalSnapshot(rawValue);
}

export function subscribeRecommendationSignal(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = (event: Event) => {
    if (event instanceof StorageEvent && event.key && event.key !== YORISOU_RECOMMENDATION_SIGNAL_KEY) {
      return;
    }

    onStoreChange();
  };

  window.addEventListener("storage", handleChange);
  window.addEventListener(YORISOU_RECOMMENDATION_SIGNAL_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(YORISOU_RECOMMENDATION_SIGNAL_EVENT, handleChange);
  };
}
